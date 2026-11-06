import type { DiagramSpec } from '~/lib/diagrams/types';

export const multiAzWebApp: DiagramSpec = {
  id: 'multi-az-web-app',
  title: 'A website running across two Availability Zones in one Region',
  description:
    'Users connect through a nearby edge location. Requests that are not served from the edge continue to a load balancer in an AWS Region. The load balancer sends traffic to Amazon EC2 servers in two separate Availability Zones, so the website can keep running if one zone fails.',
  width: 960,
  height: 500,
  boundaries: [
    { kind: 'external', label: 'Close to users', x: 16, y: 120, width: 268, height: 260 },
    {
      kind: 'region',
      label: 'AWS Region',
      icon: 'group-region',
      x: 316,
      y: 16,
      width: 628,
      height: 468,
    },
    {
      kind: 'availability-zone',
      label: 'Availability Zone A',
      x: 620,
      y: 66,
      width: 300,
      height: 180,
    },
    {
      kind: 'availability-zone',
      label: 'Availability Zone B',
      x: 620,
      y: 278,
      width: 300,
      height: 180,
    },
  ],
  nodes: [
    { id: 'users', icon: 'users', label: 'Users', x: 84, y: 250 },
    { id: 'edge', icon: 'edge-location', label: 'Edge location', x: 216, y: 250 },
    { id: 'elb', icon: 'elastic-load-balancing', label: 'Load balancer', x: 450, y: 250 },
    { id: 'ec2-a', icon: 'amazon-ec2', label: 'EC2 server', x: 770, y: 160 },
    { id: 'ec2-b', icon: 'amazon-ec2', label: 'EC2 server', x: 770, y: 372 },
  ],
  connections: [
    { from: 'users', to: 'edge', step: 1 },
    { from: 'edge', to: 'elb', step: 2 },
    { from: 'elb', to: 'ec2-a', step: 3 },
    { from: 'elb', to: 'ec2-b', step: 3 },
  ],
  steps: [
    'A user’s request is routed to the edge location with the lowest latency.',
    'If the edge location cannot answer from its cache, the request continues to the Region.',
    'The load balancer shares requests between servers in different Availability Zones. If one zone fails, servers in the other zone can keep serving users.',
  ],
};
