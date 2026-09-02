# AWS Infrastructure with Terraform + NGINX Web Server

This project provisions a complete AWS networking and compute environment using Terraform, then automatically installs and starts an NGINX web server on the EC2 instance via User Data.

## Architecture

Terraform
│
├── VPC
├── Public Subnet
├── Internet Gateway
├── Route Table + Association
├── Security Group (SSH + HTTP)
│
└── EC2 Instance
│
└── User Data
├── Install NGINX
├── Start NGINX
└── Enable NGINX (auto-start on reboot)


## What this project does

- Creates a custom VPC with a public subnet
- Attaches an Internet Gateway and configures public routing
- Creates a security group allowing SSH (22) and HTTP (80)
- Launches an EC2 instance in the public subnet with a public IP
- Uses EC2 User Data to automatically install, start, and enable NGINX — no manual server setup required

## Files

| File | Purpose |
|---|---|
| `provider.tf` | AWS provider configuration |
| `vpc.tf` | VPC, subnet, internet gateway, route table |
| `security-group.tf` | Security group rules (SSH, HTTP) |
| `ec2.tf` | EC2 instance + NGINX bootstrap via user_data |
| `variables.tf` | Input variable definitions |
| `outputs.tf` | Output values (VPC ID, EC2 ID, public IP, web URL) |
| `terraform.tfvars.example` | Example variable values (copy to `terraform.tfvars` and edit) |

## Usage

```bash
git clone <your-repo-url>
cd terraform-aws-infrastructure

cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars with your own AMI ID and key pair name

terraform init
terraform plan
terraform apply
```

After apply completes, open the URL shown in the `instance_url` output to see the NGINX welcome page.

## Security Note

This is a learning/portfolio project. The security group currently allows SSH (port 22) from `0.0.0.0/0` for simplicity. In a production environment, this should be restricted to a specific IP range or accessed via a bastion host / VPN.

## Cleanup

```bash
terraform destroy
```

## Tech Stack

- Terraform
- AWS (VPC, EC2, Security Groups, IGW, Route Tables)
- NGINX