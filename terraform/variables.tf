variable "aws_region" {
  description = "The AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as a prefix for resources"
  type        = string
  default     = "letecho"
}

variable "environment" {
  description = "Environment name (e.g. prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Domain name for the frontend and API (e.g., letecho.com)"
  type        = string
  default     = "letecho.com"
}
