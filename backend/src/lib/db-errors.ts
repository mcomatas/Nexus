// Postgres SQLSTATE checks.
// NOTE: Bun's PostgresError exposes the SQLSTATE on `.errno` (e.g. "23505"),
// NOT `.code` (which is Bun's own category string like "ERR_POSTGRES_SERVER_ERROR").
export const isUniqueViolation = (err: any) => err?.errno === "23505";
export const isForeignKeyViolation = (err: any) => err?.errno === "23503";
