import assert from "node:assert/strict";
import test from "node:test";
import { ApiError } from "./api-error";
import {
  errorResponse,
  handleApiError,
  successResponse,
} from "./responses";

test("success responses consistently wrap payloads in data", async () => {
  const response = successResponse({ id: "draft_1" }, 201);

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    success: true,
    data: { id: "draft_1" },
  });
});

test("error responses nest details under error and omit missing details", async () => {
  const withDetails = errorResponse("VALIDATION_ERROR", "Invalid input", 400, {
    name: ["Required"],
  });
  const withoutDetails = errorResponse("NOT_FOUND", "Not found", 404);

  assert.deepEqual(await withDetails.json(), {
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid input",
      details: { name: ["Required"] },
    },
  });
  assert.deepEqual(await withoutDetails.json(), {
    success: false,
    error: { code: "NOT_FOUND", message: "Not found" },
  });
});

test("API errors retain their code, status, and details", async () => {
  const error = new ApiError("Access denied", "FORBIDDEN", 403, {
    scope: "business",
  });
  const response = handleApiError(error, "FALLBACK", "Fallback");

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), {
    success: false,
    error: {
      code: "FORBIDDEN",
      message: "Access denied",
      details: { scope: "business" },
    },
  });
});

test("unknown API errors use the configured fallback", async () => {
  const originalConsoleError = console.error;
  console.error = () => undefined;
  let response: ReturnType<typeof handleApiError>;
  try {
    response = handleApiError(
      new Error("private diagnostic"),
      "FAILED",
      "Request failed",
      502,
    );
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    success: false,
    error: { code: "FAILED", message: "Request failed" },
  });
});
