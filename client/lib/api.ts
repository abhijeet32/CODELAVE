const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── Types matching backend DTOs ────────────────────────

export interface AuthResponse {
  accessToken: string;
  userId: string;
}

export interface ApiKeyResponse {
  id: string;
  name: string;
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

export interface CreatedApiKeyResponse {
  key: string;
  id: string;
  name: string;
}

export interface SandboxResponse {
  id: string;
  status: string;
  template: string | null;
  createdAt: string;
  timeoutAt: string;
  destroyedAt: string | null;
}

export interface UsageSummary {
  month: string;
  sandboxCount: number;
  executionCount: number;
  computeSeconds: number;
  limits: {
    maxSandboxes: number;
    maxExecutions: number;
    maxComputeSeconds: number;
  };
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// ─── Helper ─────────────────────────────────────────────

function getToken(): string {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Not authenticated');
  return token;
}

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const body: ApiErrorResponse = await response.json();
      errorMessage = body.message || body.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ─── Auth API ───────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse<void>(response);
}

export async function deleteAccount(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/account`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<void>(response);
}

// ─── API Key Management (JWT-auth) ─────────────────────

export async function createApiKey(name: string): Promise<CreatedApiKeyResponse> {
  const response = await fetch(`${API_URL}/auth/apikey`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });
  return handleResponse<CreatedApiKeyResponse>(response);
}

export async function listApiKeys(): Promise<ApiKeyResponse[]> {
  const response = await fetch(`${API_URL}/auth/apikey`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleResponse<ApiKeyResponse[]>(response);
}

export async function revokeApiKey(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/auth/apikey/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse<void>(response);
}

// ─── Usage (JWT-auth) ──────────────────────────────────

export async function getUsage(): Promise<UsageSummary> {
  const response = await fetch(`${API_URL}/usage`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleResponse<UsageSummary>(response);
}

// ─── API Key Helper for Sandbox API ──────────────────────

export function getApiKey(): string {
  const key = localStorage.getItem('playgroundApiKey');
  if (!key) throw new Error('No API key found in localStorage. Please generate one to use the Playground/Sandboxes.');
  return key;
}

function apiKeyHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-api-key': getApiKey(),
  };
}

// ─── Sandbox API ───────────────────────────────────────

export async function createSandbox(template: string, timeoutSeconds: number = 300): Promise<SandboxResponse> {
  const response = await fetch(`${API_URL}/sandbox`, {
    method: 'POST',
    headers: apiKeyHeaders(),
    body: JSON.stringify({ template, timeoutSeconds }),
  });
  return handleResponse<SandboxResponse>(response);
}

export async function listSandboxes(): Promise<SandboxResponse[]> {
  const response = await fetch(`${API_URL}/sandbox`, {
    method: 'GET',
    headers: apiKeyHeaders(),
  });
  return handleResponse<SandboxResponse[]>(response);
}

export async function getSandbox(id: string): Promise<SandboxResponse> {
  const response = await fetch(`${API_URL}/sandbox/${id}`, {
    method: 'GET',
    headers: apiKeyHeaders(),
  });
  return handleResponse<SandboxResponse>(response);
}

export async function destroySandbox(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/sandbox/${id}`, {
    method: 'DELETE',
    headers: apiKeyHeaders(),
  });
  return handleResponse<void>(response);
}

// ─── Execution API ─────────────────────────────────────

export interface ExecutionResponse {
  id: string;
  sandboxId: string;
  code: string;
  output: string;
  error: string | null;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'TIMEOUT';
  durationMs: number | null;
  createdAt: string;
}

export async function executeCode(sandboxId: string, code: string, language: string = 'python'): Promise<ExecutionResponse> {
  const response = await fetch(`${API_URL}/sandbox/${sandboxId}/execute`, {
    method: 'POST',
    headers: apiKeyHeaders(),
    body: JSON.stringify({ code, language }),
  });
  return handleResponse<ExecutionResponse>(response);
}

export async function listExecutions(sandboxId: string): Promise<ExecutionResponse[]> {
  const response = await fetch(`${API_URL}/sandbox/${sandboxId}/execute`, {
    method: 'GET',
    headers: apiKeyHeaders(),
  });
  return handleResponse<ExecutionResponse[]>(response);
}

// ─── Files API ─────────────────────────────────────────

export interface FileResponse {
  name: string;
  size: number;
  uploadedAt: string;
}

export async function listFiles(sandboxId: string): Promise<FileResponse[]> {
  const response = await fetch(`${API_URL}/sandbox/${sandboxId}/files`, {
    method: 'GET',
    headers: apiKeyHeaders(),
  });
  return handleResponse<FileResponse[]>(response);
}

export async function uploadFile(sandboxId: string, file: File): Promise<FileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/sandbox/${sandboxId}/files/upload`, {
    method: 'POST',
    headers: {
      'x-api-key': getApiKey(),
    },
    body: formData,
  });
  return handleResponse<FileResponse>(response);
}
