# =============================================================================
# SECURITY GROUPS MODULE
# Creates four security groups that enforce strict least-privilege access:
#
#   1. api_server    — public-facing; accepts HTTP/HTTPS from internet
#   2. sandbox_host  — internal only; accepts traffic from API server SG
#   3. database      — PostgreSQL; accepts ONLY from api_server + sandbox_host
#   4. redis         — Redis; accepts ONLY from api_server
#
# DB and Redis groups never whitelist 0.0.0.0/0 — they reference SG IDs.
# =============================================================================

# -----------------------------------------------------------------------------
# 1. API Server Security Group
#    Lives in the public subnet behind a load balancer.
#    Accepts HTTP (80) and HTTPS (443) from the public internet.
#    Accepts SSH (22) only from within the VPC CIDR (no public SSH).
# -----------------------------------------------------------------------------
resource "aws_security_group" "api_server" {
  name        = "codelave-sg-api-server-${var.environment}"
  description = "API server: allow HTTP/HTTPS from internet, SSH from VPC only"
  vpc_id      = var.vpc_id

  # HTTP — allow from anywhere (will sit behind ALB / reverse proxy)
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS — allow from anywhere
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH — restricted to VPC CIDR only (bastion or SSM jump)
  ingress {
    description = "SSH from within VPC only (no public SSH)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  # Allow all outbound — API server needs to call external services, NAT GW
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "codelave-sg-api-server-${var.environment}"
    Environment = var.environment
    Role        = "api-server"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 2. Sandbox Host Security Group
#    Lives in the private subnet; runs Firecracker microVMs.
#    Only the API server is allowed to initiate connections to it.
# -----------------------------------------------------------------------------
resource "aws_security_group" "sandbox_host" {
  name        = "codelave-sg-sandbox-host-${var.environment}"
  description = "Sandbox host: accept connections from API server SG only"
  vpc_id      = var.vpc_id

  # Accept any port from the API server SG (gRPC, custom control plane ports)
  ingress {
    description     = "All traffic from API server"
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = [aws_security_group.api_server.id]
  }

  # Allow all outbound — sandbox hosts pull images, kernels, payloads via NAT
  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "codelave-sg-sandbox-host-${var.environment}"
    Environment = var.environment
    Role        = "sandbox-host"
    ManagedBy   = "terraform"
  }
}

# -----------------------------------------------------------------------------
# 3. Database Security Group (PostgreSQL — port 5432)
#    Lives in the private subnet.
#    NEVER accepts traffic from 0.0.0.0/0.
#    Only the API server and sandbox host SGs may connect to it.
# -----------------------------------------------------------------------------
resource "aws_security_group" "database" {
  name        = "codelave-sg-database-${var.environment}"
  description = "PostgreSQL DB: internal access from api_server + sandbox_host only. No public access."
  vpc_id      = var.vpc_id

  # PostgreSQL — from API server only
  ingress {
    description     = "PostgreSQL from API server"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api_server.id]
  }

  # PostgreSQL — from sandbox host (for job result persistence)
  ingress {
    description     = "PostgreSQL from sandbox host"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.sandbox_host.id]
  }



  tags = {
    Name        = "codelave-sg-database-${var.environment}"
    Environment = var.environment
    Role        = "database"
    ManagedBy   = "terraform"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------
# 4. Redis Security Group (port 6379)
#    Lives in the private subnet.
#    NEVER accepts traffic from 0.0.0.0/0.
#    Only the API server may connect (caching, session store, job queue).
# -----------------------------------------------------------------------------
resource "aws_security_group" "redis" {
  name        = "codelave-sg-redis-${var.environment}"
  description = "Redis: internal access from api_server only. No public access."
  vpc_id      = var.vpc_id

  # Redis — from API server only
  ingress {
    description     = "Redis from API server"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.api_server.id]
  }



  tags = {
    Name        = "codelave-sg-redis-${var.environment}"
    Environment = var.environment
    Role        = "redis"
    ManagedBy   = "terraform"
  }

  lifecycle {
    create_before_destroy = true
  }
}
