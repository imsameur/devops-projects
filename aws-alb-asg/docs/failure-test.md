# Availability and Scaling Tests

Test date: 2026-10-06
Region: ap-southeast-1
All times below are Bangladesh time (UTC+06:00).

## Baseline

- ASG minimum: 2, desired: 2, maximum: 3.
- Two instances were InService across two Availability Zones.
- Both ALB targets were healthy.
- Initial application test: 10 requests, all HTTP 200.
- Responses came from both web servers.

## Instance Replacement Test

At 09:02:21, the EC2 termination test was initiated for
i-0cbed1b5cdce014f2 in ap-southeast-1b.

The desired capacity remained 2.

- Surviving instance: i-09098436b1f89548a.
- Replacement instance: i-082f3e38a738fd28a.
- ASG activity recorded replacement launch at approximately 09:03:21.
- The replacement initially failed target health checks.
- Both targets were confirmed healthy at 09:05:45.
- Responses were observed from the surviving and replacement servers.

### Request Monitoring Results

Monitoring window: 09:01:03 to 09:06:35.

| Result | Count |
|---|---:|
| Total requests | 152 |
| HTTP 200 | 148 |
| Failed requests | 4 |

Observed failures:

- 09:02:28: HTTP 502.
- 09:02:33: HTTP 502.
- 09:02:37: Request timeout.
- 09:02:46: Request timeout.

Replacement succeeded, but abrupt instance termination caused
temporary request failures. This test does not demonstrate zero downtime.

The surviving server continued serving requests during the recovery.
The request samples do not measure every request or exact outage duration.

Evidence: [Request log](failure-requests.log).

## Manual Capacity Test

Desired capacity was manually changed from 2 to 3.

- New instance: i-09bf3123b80afb71e.
- Three instances became InService.
- All three targets were verified healthy.

Desired capacity was then manually changed from 3 to 2.

- ASG removed i-082f3e38a738fd28a.
- Two InService instances and two healthy targets were verified.

These changes were initiated by user commands, not by the scaling policy.

## Policy-Triggered Scaling Test

Policy: project10-request-scaling.
Metric: ALBRequestCountPerTarget.
Target: 100 requests per target per minute.

Load window: 09:14:14 to 09:22:14.

- Successful requests: 5176.
- Failed requests: 0.
- Desired capacity was not manually changed during this load test.

### Automatic Scale-Out

At 09:19:35, AlarmHigh triggered the request-scaling policy.

- Desired capacity changed from 2 to 3.
- Instance i-08b344996801dc922 was launched.
- The launch activity completed successfully.

### Automatic Scale-In

At 09:39:28, AlarmLow triggered the same policy.

- Desired capacity changed from 3 to 2.
- Instance i-08b344996801dc922 was selected for termination.
- The termination activity completed successfully.

Evidence:
[Policy scaling activities](policy-scaling-activities.json).

Target health of the automatically added instance was not separately
checked during that test. Its healthy registration is not claimed here.

## Security Verification

The deployed web Security Group was inspected.

- Inbound: TCP port 80 from the ALB Security Group only.
- No public IPv4 or IPv6 CIDR inbound rules.
- No SSH inbound rule.

This verifies the deployed inbound configuration.
A separate direct-to-instance connection test was not performed.

## Scope

This lab tested single-instance termination and recovery,
manual capacity changes, and request-driven automatic scaling.

A complete Availability Zone outage was not tested.
