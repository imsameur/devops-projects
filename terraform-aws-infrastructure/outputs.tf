# -------------------------
# VPC ID
# -------------------------
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

# -------------------------
# Public Subnet ID
# -------------------------
output "public_subnet_id" {
  description = "Public Subnet ID"
  value       = aws_subnet.Public.id
}

# -------------------------
# EC2 Instance ID
# -------------------------
output "ec2_instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.web.id
}

# -------------------------
# EC2 Public IP
# -------------------------
output "ec2_public_ip" {
  description = "EC2 Public IP Address"
  value       = aws_instance.web.public_ip
}

# -------------------------
# EC2 Instance URL 
# -------------------------
output "instance_url" {
  description = "The URL to Access Nginx Server"
  value       = "http://${aws_instance.web.public_ip}"
}