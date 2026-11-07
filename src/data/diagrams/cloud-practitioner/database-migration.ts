import type { DiagramSpec } from '~/lib/diagrams/types';

export const databaseMigration: DiagramSpec = {
  id: 'database-migration',
  title: 'Moving a database to AWS while it stays in use',
  description:
    'On the left, an application in a corporate data center uses its database. AWS Database Migration Service, in an AWS Region, copies the data from that database to Amazon RDS and keeps replicating changes. When the copies match, the application can switch to Amazon RDS.',
  width: 960,
  height: 340,
  boundaries: [
    {
      kind: 'external',
      label: 'Corporate data center',
      icon: 'group-corporate-data-center',
      x: 16,
      y: 40,
      width: 340,
      height: 270,
    },
    {
      kind: 'region',
      label: 'AWS Region',
      icon: 'group-region',
      x: 400,
      y: 40,
      width: 544,
      height: 270,
    },
  ],
  nodes: [
    { id: 'app', icon: 'server', label: 'Application', x: 96, y: 170 },
    { id: 'source', icon: 'database', label: 'Source database', x: 270, y: 170 },
    { id: 'dms', icon: 'aws-dms', label: 'AWS DMS', x: 530, y: 170 },
    { id: 'rds', icon: 'amazon-rds', label: 'Amazon RDS', x: 810, y: 170 },
  ],
  connections: [
    { from: 'app', to: 'source', bidirectional: true },
    { from: 'source', to: 'dms', step: 1 },
    { from: 'dms', to: 'rds', step: 2 },
  ],
  steps: [
    'AWS DMS reads data from the source database, which stays in use.',
    'AWS DMS writes the data to the target and keeps replicating new changes, so the two stay in sync until the application switches over.',
  ],
};
