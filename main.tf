
terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "terraform-lab"
}


resource "aws_vpc" "lab" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "terraform-secure-lab-vpc"
    Environment = "lab"
    ManagedBy   = "Terraform"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "terraform-secure-lab-public-subnet"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "public"
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.lab.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = "eu-west-1a"

  tags = {
    Name        = "terraform-secure-lab-private-subnet"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "private"
  }
}

resource "aws_internet_gateway" "lab" {
  vpc_id = aws_vpc.lab.id

  tags = {
    Name        = "terraform-secure-lab-igw"
    Environment = "lab"
    ManagedBy   = "Terraform"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.lab.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.lab.id
  }

  tags = {
    Name        = "terraform-secure-lab-public-rt"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "public"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.lab.id

  tags = {
    Name        = "terraform-secure-lab-private-rt"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "private"
  }
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "web" {
  name        = "terraform-secure-lab-web-sg"
  description = "Security group for web tier"
  vpc_id      = aws_vpc.lab.id

  tags = {
    Name        = "terraform-secure-lab-web-sg"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "web"
  }
}
resource "aws_vpc_security_group_ingress_rule" "web_http" {
  security_group_id = aws_security_group.web.id
  description       = "Allow HTTP traffic"
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "web_https" {
  security_group_id = aws_security_group.web.id
  description       = "Allow HTTPS traffic"
  ip_protocol       = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_instance" "web" {
  ami                    = "ami-0445442ed20a2c6f8"
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]

  root_block_device {
    volume_size           = 8
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  tags = {
    Name        = "terraform-secure-lab-web"
    Environment = "lab"
    ManagedBy   = "Terraform"
    Tier        = "web"
  }
}
