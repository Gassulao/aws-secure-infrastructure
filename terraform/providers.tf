provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = {
      Project     = "aws-secure-infrastructure"
      Environment = "lab"
      ManagedBy   = "Terraform"
    }
  }
}