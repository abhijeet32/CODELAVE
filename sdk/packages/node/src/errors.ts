export class CodelaveError extends Error {
  constructor(message: string, public readonly status?: number, public readonly details?: unknown) {
    super(message);
    this.name = "CodelaveError";
  }
}
