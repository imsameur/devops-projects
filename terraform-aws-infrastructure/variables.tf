# -------------------------
# Variables
# -------------------------

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-southeast-1"
}

# -------------------------
# AMI 
# -------------------------
variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
  default     = "ami-02159ad7e38d562f2"
}
# -------------------------
# EC2 Instance Type
# -------------------------
variable "instance_type" {
  description = "Ec2 Instance Type"
  type        = string
  default     = "t3.micro"
}

# -------------------------
# EC2 Key Pair Name
# -------------------------
variable "key_name" {
  description = "EC2 Key Pair Name"
  type        = string
  default     = "samserver"
}