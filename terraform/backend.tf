terraform {
  backend "s3" {
    bucket       = "lab-tfstate-172155958881-euw1"
    key          = "lab/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true
  }
}