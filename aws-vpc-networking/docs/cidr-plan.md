# CIDR Plan

## Network ranges

| Resource | Name | IPv4 CIDR |
|---|---|---|
| VPC | project08-vpc | 10.80.0.0/16 |
| Public subnet | project08-public-subnet | 10.80.1.0/24 |
| Private subnet | project08-private-subnet | 10.80.2.0/24 |

Region: ap-southeast-1 (Singapore)

Both subnet ranges are inside the VPC range and do not overlap.

- VPC range: 10.80.0.0 to 10.80.255.255.
- Public subnet range: 10.80.1.0 to 10.80.1.255.
- Private subnet range: 10.80.2.0 to 10.80.2.255.
- Each /24 contains 256 addresses. AWS reserves 5, leaving 251 usable addresses.

## Instances used in the lab

| Instance | Private IPv4 | Public IPv4 |
|---|---|---|
| project08-public-ec2 | 10.80.1.179 | Auto-assigned |
| project08-private-ec2 | 10.80.2.59 | None |

These private IPs were assigned during launch and recorded for testing.
Recreating the instances may assign different addresses.

## Routing plan

| Route table | Associated subnet | Routes |
|---|---|---|
| project08-public-rt | project08-public-subnet | 10.80.0.0/16 -> local; 0.0.0.0/0 -> Internet Gateway |
| project08-private-rt | project08-private-subnet | 10.80.0.0/16 -> local |

Public-to-private traffic uses the VPC local route.
The private subnet has no internet default route.
No NAT Gateway or IPv6 was configured for this lab.
