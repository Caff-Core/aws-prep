import type { DiagramSpec } from '~/lib/diagrams/types';

export const elasticWebApp: DiagramSpec = {
  id: 'elastic-web-app',
  title: 'A website that adds and removes servers as demand changes',
  description:
    'Users connect to a load balancer in an AWS Region. The load balancer shares requests between two Amazon EC2 servers that always run inside an Auto Scaling group. Two more EC2 servers, connected by dashed lines, are added only while demand is high and are removed when it falls.',
  width: 960,
  height: 440,
  boundaries: [
    { kind: 'external', label: 'Internet', x: 16, y: 130, width: 190, height: 190 },
    {
      kind: 'region',
      label: 'AWS Region',
      icon: 'group-region',
      x: 236,
      y: 16,
      width: 708,
      height: 408,
    },
    {
      kind: 'scaling-group',
      label: 'Auto Scaling group',
      icon: 'group-auto-scaling',
      x: 540,
      y: 56,
      width: 384,
      height: 348,
    },
  ],
  nodes: [
    { id: 'users', icon: 'users', label: 'Users', x: 110, y: 225 },
    { id: 'elb', icon: 'elastic-load-balancing', label: 'Load balancer', x: 380, y: 225 },
    { id: 'ec2-a', icon: 'amazon-ec2', label: 'Always running', x: 640, y: 130 },
    { id: 'ec2-b', icon: 'amazon-ec2', label: 'Always running', x: 640, y: 330 },
    { id: 'ec2-c', icon: 'amazon-ec2', label: 'Added at peak', x: 810, y: 165 },
    { id: 'ec2-d', icon: 'amazon-ec2', label: 'Added at peak', x: 810, y: 285 },
  ],
  connections: [
    { from: 'users', to: 'elb', step: 1 },
    { from: 'elb', to: 'ec2-a', step: 2 },
    { from: 'elb', to: 'ec2-b', step: 2 },
    { from: 'elb', to: 'ec2-c', step: 3, dashed: true },
    { from: 'elb', to: 'ec2-d', step: 3, dashed: true },
  ],
  steps: [
    'Users send requests to a load balancer.',
    'The load balancer shares requests between the servers that are running.',
    'When demand rises, Amazon EC2 Auto Scaling launches more servers (dashed lines). When demand falls, it terminates them, so you stop paying for capacity you no longer need.',
  ],
};
