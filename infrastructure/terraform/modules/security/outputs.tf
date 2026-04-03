output "state_bucket_name" {
  description = "Name of the S3 bucket used for Terraform remote state"
  value       = aws_s3_bucket.tf_state.bucket
}

output "state_bucket_arn" {
  description = "ARN of the S3 bucket used for Terraform remote state"
  value       = aws_s3_bucket.tf_state.arn
}


output "admin_user_name" {
  description = "Username of the non-root admin IAM user"
  value       = aws_iam_user.admin.name
}

output "admin_user_arn" {
  description = "ARN of the non-root admin IAM user"
  value       = aws_iam_user.admin.arn
}

output "api_server_role_arn" {
  description = "ARN of the IAM role to attach to API server EC2 instances"
  value       = aws_iam_role.api_server.arn
}

output "api_server_instance_profile_name" {
  description = "Name of the EC2 instance profile for the API server role"
  value       = aws_iam_instance_profile.api_server.name
}

output "sandbox_host_role_arn" {
  description = "ARN of the IAM role to attach to Firecracker sandbox host EC2 instances"
  value       = aws_iam_role.sandbox_host.arn
}

output "sandbox_host_instance_profile_name" {
  description = "Name of the EC2 instance profile for the sandbox host role"
  value       = aws_iam_instance_profile.sandbox_host.name
}

output "cicd_pipeline_role_arn" {
  description = "ARN of the IAM role assumed by GitHub Actions via OIDC — use this in your GitHub Actions workflow"
  value       = aws_iam_role.cicd_pipeline.arn
}

output "github_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC identity provider"
  value       = aws_iam_openid_connect_provider.github_actions.arn
}
