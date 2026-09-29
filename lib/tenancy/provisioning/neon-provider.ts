import "server-only";

import { createNeonClient } from "@neon/sdk";

import type {
  GetTenantDatabaseInput,
  ProvisionTenantDatabaseInput,
  TenantDatabaseProvider,
} from "./database-provider";

import type { ProvisionedTenantDatabase } from "./types";

export class NeonTenantDatabaseProvider implements TenantDatabaseProvider {
  async provision(
    input: ProvisionTenantDatabaseInput,
  ): Promise<ProvisionedTenantDatabase> {
    const apiKey = process.env.NEON_API_KEY;
    const orgId = process.env.NEON_ORG_ID;

    if (!apiKey) {
      throw new Error("NEON_API_KEY is not configured");
    }

    if (!orgId) {
      throw new Error("NEON_ORG_ID is not configured");
    }

    const neon = createNeonClient({
      apiKey,
    });

    const existingProject = await this.findProjectByTenantKey(
      neon,
      orgId,
      input.tenantKey,
    );

    if (existingProject) {
      const recovered = await this.get({
        ...input,
        neonProjectId: existingProject.id,
        neonBranchId: null,
      });

      if (!recovered) {
        throw new Error(
          `Neon project "${existingProject.id}" could not be recovered`,
        );
      }

      return recovered;
    }

    /**
     * 1. Create the Neon project.
     *
     * createAndConnect() creates the project and returns
     * a connection string for the project's default branch.
     */
    const { data, error } = await neon.projects.createAndConnect({
      name: this.getProjectName(input.tenantKey),
      org_id: orgId,
      branch: {
        database_name: input.databaseName,
      },
    });

    if (error) {
      throw error;
    }

    const project = data.project;

    if (!project.id) {
      throw new Error("Neon project was created but project ID is missing");
    }

    /**
     * 2. Resolve the actual default branch.
     *
     * Do not assume the branch is named "main".
     * Neon provides a dedicated getDefault() operation.
     */
    const { data: defaultBranch, error: branchError } =
      await neon.branches.getDefault({
        projectId: project.id,
      });

    if (branchError) {
      throw branchError;
    }

    if (!defaultBranch?.id) {
      throw new Error(`Neon project "${project.id}" has no default branch`);
    }

    const provisioned = await this.get({
      ...input,
      neonProjectId: project.id,
      neonBranchId: defaultBranch.id,
    });

    if (!provisioned) {
      throw new Error(
        `Neon project "${project.id}" could not connect to database "${input.databaseName}"`,
      );
    }

    return provisioned;
  }

  async get(
    input: GetTenantDatabaseInput,
  ): Promise<ProvisionedTenantDatabase | null> {
    const apiKey = process.env.NEON_API_KEY;

    if (!apiKey) {
      throw new Error("NEON_API_KEY is not configured");
    }

    const neon = createNeonClient({ apiKey });

    const { data: branch, error: branchError } = input.neonBranchId
      ? await neon.branches.get({
          projectId: input.neonProjectId,
          branchId: input.neonBranchId,
        })
      : await neon.branches.getDefault({
          projectId: input.neonProjectId,
        });

    if (branchError) {
      throw branchError;
    }

    if (!branch?.id) {
      return null;
    }

    await this.ensureDatabase(
      neon,
      input.neonProjectId,
      branch.id,
      input.databaseName,
    );

    const { data: connectionString, error: connectionError } =
      await neon.postgres.connectionString({
        projectId: input.neonProjectId,
        branchId: branch.id,
        databaseName: input.databaseName,
        pooled: false,
      });

    if (connectionError) {
      throw connectionError;
    }

    if (!connectionString) {
      return null;
    }

    return {
      tenantKey: input.tenantKey,
      databaseName: input.databaseName,
      databaseHost: new URL(connectionString).hostname,
      neonProjectId: input.neonProjectId,
      neonBranchId: branch.id,
      credentials: {
        connectionString,
      },
    };
  }

  private async ensureDatabase(
    neon: ReturnType<typeof createNeonClient>,
    projectId: string,
    branchId: string,
    databaseName: string,
  ): Promise<void> {
    const listDatabases = async () => {
      const result = await neon.postgres.databases.list({
        projectId,
        branchId,
      });

      if (Array.isArray(result)) {
        return result;
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    };

    const databases = await listDatabases();

    if (!databases) {
      throw new Error("Neon returned no database list for the tenant branch");
    }

    if (databases.some((database) => database.name === databaseName)) {
      return;
    }

    const ownerDatabase =
      databases.find((database) => database.name === "neondb") ?? databases[0];

    if (!ownerDatabase) {
      throw new Error("Neon tenant branch has no database role to reuse");
    }

    const createResult = await neon.postgres.databases.create({
      projectId,
      branchId,
      name: databaseName,
      owner_name: ownerDatabase.owner_name,
    });

    if (!("error" in createResult) || !createResult.error) {
      return;
    }
    const createError = createResult.error;

    // A concurrent retry may have created the database after the initial list.
    const refreshedDatabases = await listDatabases();

    if (
      !refreshedDatabases?.some((database) => database.name === databaseName)
    ) {
      throw createError;
    }
  }

  async destroy(neonProjectId: string): Promise<void> {
    throw new Error(
      `Neon project destruction is not implemented yet: ${neonProjectId}`,
    );
  }

  private getProjectName(tenantKey: string): string {
    return `smart-business-${tenantKey}`;
  }

  private async findProjectByTenantKey(
    neon: ReturnType<typeof createNeonClient>,
    orgId: string,
    tenantKey: string,
  ) {
    const projectResult = await neon.projects.list({ org_id: orgId }).all();
    const projects = Array.isArray(projectResult)
      ? projectResult
      : (() => {
          if (projectResult.error) {
            throw projectResult.error;
          }

          return projectResult.data;
        })();

    const matches = projects.filter(
      (project) => project.name === this.getProjectName(tenantKey),
    );

    if (matches.length > 1) {
      throw new Error(
        `Multiple Neon projects match tenant key "${tenantKey}".`,
      );
    }

    return matches[0] ?? null;
  }
}
