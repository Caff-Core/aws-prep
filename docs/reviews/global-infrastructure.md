# Review sheet: AWS global infrastructure

Status: **awaiting human review** (issue #21). Claims were checked against these sources by the
author on 2026-11-07. A person must confirm them before any question moves to `approved`.

| Claim                                                                                         | Source                        |
| --------------------------------------------------------------------------------------------- | ----------------------------- |
| A Region is a physical location where AWS clusters data centers                               | [Regions and AZs][regions-az] |
| Each Region has at least three Availability Zones                                             | [AZ documentation][az-docs]   |
| An AZ is one or more discrete data centers with redundant power, networking, and connectivity | [Regions and AZs][regions-az] |
| AZs are within 100 km (60 miles) of each other                                                | [Regions and AZs][regions-az] |
| Generators and cooling equipment are not shared across AZs                                    | [Fault isolation][fault]      |
| AZs are linked by high-bandwidth, low-latency, dedicated metro fiber                          | [Fault isolation][fault]      |
| `af-south-1` is Africa (Cape Town)                                                            | [Regions list][regions]       |
| Requests route to the edge location with the lowest latency                                   | [CloudFront][cloudfront]      |
| Choose a Region by services needed, user proximity, and legal requirements                    | [Regions list][regions]       |
| Reasons for multiple Regions                                                                  | [Exam guide][domain3]         |

## Reviewer checklist

- [ ] Every claim above matches its current source.
- [ ] Each of the six questions has one defensible answer set.
- [ ] Wrong-option explanations are accurate.
- [ ] Set `reviewStatus` to `approved` and update `lastReviewed`.

## Unsourced statements to check

These came from general AWS knowledge rather than the pages above:

- "When you create most resources, you create them in a Region you have selected."
- In the retail example, the load balancer sends requests to healthy servers.
- "Customers do not add edge locations" (question explanation).

[regions-az]: https://aws.amazon.com/about-aws/global-infrastructure/regions_az/
[az-docs]: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-availability-zones.html
[fault]: https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/availability-zones.html
[regions]: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions.html
[cloudfront]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html
[domain3]: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.md
