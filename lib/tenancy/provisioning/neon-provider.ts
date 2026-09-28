import "server-only";

import { createNeonClient } from "@neon/sdk";

import type {
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

    /**
     * 1. Create the Neon project.
     *
     * createAndConnect() creates the project and returns
     * a connection string for the project's default branch.
     */
    const { data, error } = await neon.projects.createAndConnect({
      name: input.businessName,
      org_id: orgId,
    });

    if (error) {
      throw error;
    }

    const project = data.project;

    if (!project.id) {
      throw new Error("Neon project was created but project ID is missing");
    }

    if (!data.connectionString) {
      throw new Error(
        "Neon project was created but connection string is missing",
      );
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

    /**
     * 3. Extract the database host from the connection string.
     */
    const databaseHost = new URL(data.connectionString).hostname;

    /**
     * 4. Return the infrastructure information needed
     *    by the tenant provisioning workflow.
     */
    return {
      tenantKey: input.tenantKey,
      databaseName: input.databaseName,
      databaseHost,
      neonProjectId: project.id,
      neonBranchId: defaultBranch.id,
      credentials: {
        connectionString: data.connectionString,
      },
    };
  }

  async get(neonProjectId: string): Promise<ProvisionedTenantDatabase | null> {
    throw new Error(
      `Neon project lookup is not implemented yet: ${neonProjectId}`,
    );
  }

  async destroy(neonProjectId: string): Promise<void> {
    throw new Error(
      `Neon project destruction is not implemented yet: ${neonProjectId}`,
    );
  }
}
