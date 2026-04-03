output "api_server_sg_id" {
  description = "Security Group ID for the API server (public-facing: ports 80, 443)"
  value       = aws_security_group.api_server.id
}

output "sandbox_host_sg_id" {
  description = "Security Group ID for sandbox hosts (accepts traffic from API server SG only)"
  value       = aws_security_group.sandbox_host.id
}

output "database_sg_id" {
  description = "Security Group ID for the database (PostgreSQL 5432 — internal only, no public access)"
  value       = aws_security_group.database.id
}

output "redis_sg_id" {
  description = "Security Group ID for Redis (port 6379 — internal only, no public access)"
  value       = aws_security_group.redis.id
}
