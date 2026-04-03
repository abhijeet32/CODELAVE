output "db_credentials_secret_arn" {
  description = "ARN of the DB credentials secret — use this ARN in your application's IAM policy to allow reading it"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_credentials_secret_name" {
  description = "Name of the DB credentials secret"
  value       = aws_secretsmanager_secret.db_credentials.name
}

output "api_keys_secret_arn" {
  description = "ARN of the API keys secret"
  value       = aws_secretsmanager_secret.api_keys.arn
}

output "api_keys_secret_name" {
  description = "Name of the API keys secret"
  value       = aws_secretsmanager_secret.api_keys.name
}
