output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "List of IDs of the two public subnets (indexed by AZ order)"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of IDs of the two private subnets (indexed by AZ order)"
  value       = aws_subnet.private[*].id
}

output "nat_gateway_ids" {
  description = "List of IDs of the two NAT Gateways"
  value       = aws_nat_gateway.nat[*].id
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.igw.id
}
