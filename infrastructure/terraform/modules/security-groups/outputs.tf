output "alb_sg_id" {
  description = "Security Group ID for the ALB (public-facing: ports 80, 443)"
  value       = aws_security_group.alb.id
}

output "api_server_sg_id" {
  description = "Security Group ID for the API server (accepts traffic from ALB only)"
  value       = aws_security_group.api_server.id
}

output "sandbox_host_sg_id" {
  description = "Security Group ID for sandbox hosts (accepts traffic from API server SG only)"
  value       = aws_security_group.sandbox_host.id
}

