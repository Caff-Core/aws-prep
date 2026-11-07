const examGuide = 'https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02';

export default {
  id: 'cloud-practitioner',
  status: 'available',
  title: 'AWS Certified Cloud Practitioner',
  shortTitle: 'Cloud Practitioner',
  examCode: 'CLF-C02',
  level: 'foundational',
  description:
    'Build a working understanding of cloud concepts, security, core services, and billing. The natural starting point for AWS certification.',
  audience:
    'Learners from technical or non-technical backgrounds who want to show an overall understanding of the AWS Cloud. No coding or architecture design is expected.',
  recommendedKnowledge: [
    'AWS suggests up to 6 months of exposure to the AWS Cloud, but says this is not required.',
    'General familiarity with how websites and business software are used.',
  ],
  learningObjectives: [
    'Explain the value of the AWS Cloud and its design principles.',
    'Describe the AWS shared responsibility model and core security concepts.',
    'Identify core AWS services and the global infrastructure they run on.',
    'Compare AWS pricing models, cost tools, and support options.',
  ],
  exam: {
    durationMinutes: 90,
    totalQuestions: 65,
    scoredQuestions: 50,
    unscoredQuestions: 15,
    scoreRange: [100, 1000],
    passingScore: 700,
    questionTypes: ['single-answer', 'multiple-response'],
    validityYears: 3,
    feeUsd: 100,
  },
  domains: [
    {
      id: 'cloud-concepts',
      number: 1,
      title: 'Cloud Concepts',
      weightPercent: 24,
      taskStatements: [
        { id: '1.1', title: 'Define the benefits of the AWS Cloud.' },
        { id: '1.2', title: 'Identify design principles of the AWS Cloud.' },
        {
          id: '1.3',
          title: 'Understand the benefits of and strategies for migration to the AWS Cloud.',
        },
        { id: '1.4', title: 'Understand concepts of cloud economics.' },
      ],
    },
    {
      id: 'security-compliance',
      number: 2,
      title: 'Security and Compliance',
      weightPercent: 30,
      taskStatements: [
        { id: '2.1', title: 'Understand the AWS shared responsibility model.' },
        { id: '2.2', title: 'Understand AWS Cloud security, governance, and compliance concepts.' },
        { id: '2.3', title: 'Identify AWS access management capabilities.' },
        { id: '2.4', title: 'Identify components and resources for security.' },
      ],
    },
    {
      id: 'technology-services',
      number: 3,
      title: 'Cloud Technology and Services',
      weightPercent: 34,
      taskStatements: [
        { id: '3.1', title: 'Define methods of deploying and operating in the AWS Cloud.' },
        { id: '3.2', title: 'Define the AWS global infrastructure.' },
        { id: '3.3', title: 'Identify AWS compute services.' },
        { id: '3.4', title: 'Identify AWS database services.' },
        { id: '3.5', title: 'Identify AWS network services.' },
        { id: '3.6', title: 'Identify AWS storage services.' },
        {
          id: '3.7',
          title:
            'Identify AWS artificial intelligence and machine learning (AI/ML) services and analytics services.',
        },
        { id: '3.8', title: 'Identify services from other in-scope AWS service categories.' },
      ],
    },
    {
      id: 'billing-support',
      number: 4,
      title: 'Billing, Pricing, and Support',
      weightPercent: 12,
      taskStatements: [
        { id: '4.1', title: 'Compare AWS pricing models.' },
        { id: '4.2', title: 'Understand resources for billing, budget, and cost management.' },
        { id: '4.3', title: 'Identify AWS technical resources and AWS Support options.' },
      ],
    },
  ],
  modules: [
    {
      slug: 'cloud-concepts',
      title: 'Cloud Concepts',
      description: 'Why organisations use the cloud, how it is designed, and how it changes costs.',
      domainIds: ['cloud-concepts'],
      topics: [
        {
          slug: 'benefits-of-the-cloud',
          title: 'Benefits of the AWS Cloud',
          taskStatements: ['1.1'],
        },
        {
          slug: 'well-architected-framework',
          title: 'The AWS Well-Architected Framework',
          taskStatements: ['1.2'],
        },
        {
          slug: 'cloud-adoption-and-migration',
          title: 'Cloud adoption and migration',
          taskStatements: ['1.3'],
        },
        { slug: 'cloud-economics', title: 'Cloud economics', taskStatements: ['1.4'] },
      ],
    },
    {
      slug: 'security-compliance',
      title: 'Security and Compliance',
      description: 'Who secures what, how access is controlled, and where to find security tools.',
      domainIds: ['security-compliance'],
      topics: [
        {
          slug: 'shared-responsibility-model',
          title: 'The AWS shared responsibility model',
          taskStatements: ['2.1'],
        },
        {
          slug: 'governance-and-compliance',
          title: 'Governance and compliance',
          taskStatements: ['2.2'],
        },
        {
          slug: 'encryption-and-security-logging',
          title: 'Encryption and security logging',
          taskStatements: ['2.2'],
        },
        {
          slug: 'identity-and-access-management',
          title: 'Identity and access management',
          taskStatements: ['2.3'],
        },
        {
          slug: 'root-user-and-credentials',
          title: 'Protecting the root user and credentials',
          taskStatements: ['2.3'],
        },
        {
          slug: 'security-services-and-resources',
          title: 'Security services and resources',
          taskStatements: ['2.2', '2.4'],
        },
      ],
    },
    {
      slug: 'technology-services',
      title: 'Cloud Technology and Services',
      description: 'The global infrastructure and the core services built on top of it.',
      domainIds: ['technology-services'],
      topics: [
        {
          slug: 'deploying-and-operating',
          title: 'Deploying and operating in the cloud',
          taskStatements: ['3.1'],
        },
        {
          slug: 'global-infrastructure',
          title: 'AWS global infrastructure',
          taskStatements: ['3.2'],
        },
        { slug: 'compute-services', title: 'Compute services', taskStatements: ['3.3'] },
        {
          slug: 'containers-and-serverless',
          title: 'Containers and serverless',
          taskStatements: ['3.3'],
        },
        { slug: 'database-services', title: 'Database services', taskStatements: ['3.4'] },
        { slug: 'network-services', title: 'Network services', taskStatements: ['3.5'] },
        { slug: 'storage-services', title: 'Storage services', taskStatements: ['3.6'] },
        {
          slug: 'ai-ml-and-analytics',
          title: 'AI, machine learning, and analytics',
          taskStatements: ['3.7'],
        },
        {
          slug: 'other-in-scope-services',
          title: 'Integration, developer, and other services',
          taskStatements: ['3.8'],
        },
      ],
    },
    {
      slug: 'billing-support',
      title: 'Billing, Pricing, and Support',
      description: 'How AWS charges, how to manage costs, and where to get help.',
      domainIds: ['billing-support'],
      topics: [
        { slug: 'pricing-models', title: 'AWS pricing models', taskStatements: ['4.1'] },
        {
          slug: 'billing-and-cost-management',
          title: 'Billing and cost management',
          taskStatements: ['4.2'],
        },
        {
          slug: 'support-and-technical-resources',
          title: 'AWS Support and technical resources',
          taskStatements: ['4.3'],
        },
        {
          slug: 'partners-and-marketplace',
          title: 'AWS Partners and AWS Marketplace',
          taskStatements: ['4.3'],
        },
      ],
    },
  ],
  mockExam: { durationMinutes: 90, questionCount: 65 },
  studyPlan: [
    {
      title: 'Learn the concepts',
      description: 'Work through each module in order and finish every knowledge check.',
    },
    {
      title: 'Find weak areas',
      description: 'Revisit lessons where knowledge checks exposed gaps, weighted by domain.',
    },
    {
      title: 'Read the exam guide',
      description: 'Confirm you can explain each task statement in the official exam guide.',
    },
  ],
  revisionResources: [
    { title: 'Official CLF-C02 exam guide', url: `${examGuide}/cloud-practitioner-02.html` },
  ],
  references: [
    { title: 'CLF-C02 exam guide', url: `${examGuide}/cloud-practitioner-02.html` },
    {
      title: 'AWS Certified Cloud Practitioner',
      url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    },
  ],
  lastReviewed: '2026-11-07',
};
