# Connectivity Tests

## Test environment

- Region: ap-southeast-1 (Singapore)
- Source: project08-public-ec2, private IP 10.80.1.179
- Destination: project08-private-ec2, private IP 10.80.2.59
- Protocol: ICMP Echo Request
- Traffic path: VPC local route

## Test command

Run from the public EC2 instance:

```bash
ping -c 5 -W 2 10.80.2.59
```

## Results

| Test | Private SG inbound rule | Sent | Received | Packet loss |
|---|---|---|---|---|
| Initial connectivity | ICMP allowed from public SG | 5 | 5 | 0% |
| Controlled failure | ICMP rule removed | 5 | 0 | 100% |
| Recovery | Original ICMP rule restored | 5 | 5 | 0% |

Route tables remained unchanged during all three tests.
Removing the ICMP rule blocked ping requests.
Restoring the rule restored connectivity.

## Security group configuration

The private security group allows ICMP Echo Request from
project08-public-sg (sg-0e42a2b2ce14dcf65).

The public instance reaches the private instance using its private IP
through the VPC local route. This traffic does not use the Internet Gateway.

Security groups are stateful. Replies to allowed requests do not
require a separate inbound reply rule on the source instance.

## Private instance isolation

Verified configuration:

- No public IPv4 or IPv6 address on the private instance.
- Private subnet explicitly associated with project08-private-rt.
- Private route table contains only the VPC local route.
- No internet default route or NAT Gateway.

These settings establish no direct internet access for the private
instance in this lab. A ping timeout alone would not prove isolation.

## SSH troubleshooting

The client uses a shared ISP with a changing public IPv4 address.
The initial SSH connection timed out with the configured /32 source.

SSH access succeeded after changing the source to 165.101.132.0/24.
This permits connection attempts from the entire /24 range.
SSH key authentication is still required.
A current client /32 provides a narrower access scope.

## Evidence

Screenshot files stored under docs/screenshots:

- 01-connectivity-success.png
- 02-connectivity-failure.png
- 03-connectivity-recovery.png
