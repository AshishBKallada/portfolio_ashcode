export interface Project {
  id: number;
  name: string;
  fullName: string;
  slug: string;
  description: string;
  image: string;
  details: {
    overview: string;
    technologies: string[];
    features: string[];
    challenges: string[];
    solution: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    name: "E-commerce",
    fullName: "E-commerce Platform (01)",
    slug: "ecommerce-platform",
    description: "Comprehensive web development services covering frontend, backend, and full-stack solutions.",
    image: "/hero-background.jpg",
    details: {
      overview: "Full-stack web development services that encompass everything from modern frontend frameworks to robust backend architectures. I specialize in creating scalable, performant web applications that deliver exceptional user experiences.",
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Express"],
      features: [
        "Responsive Design",
        "Server-Side Rendering",
        "API Development",
        "Database Design",
        "Authentication & Authorization",
        "Performance Optimization"
      ],
      challenges: [
        "Scalability concerns",
        "Performance optimization",
        "Security implementation",
        "Cross-browser compatibility"
      ],
      solution: "Implemented a modern tech stack with Next.js for optimal performance, PostgreSQL for reliable data management, and comprehensive security measures including JWT authentication and data encryption."
    }
  },
  {
    id: 2,
    name: "Management System",
    fullName: "Management System (02)",
    slug: "management-system",
    description: "Native and cross-platform mobile application development for iOS and Android.",
    image: "/vintage-camera-white-background.png",
    details: {
      overview: "Mobile application development services for both native and cross-platform solutions. I create intuitive, high-performance mobile apps that engage users and deliver seamless experiences across iOS and Android platforms.",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "REST APIs"],
      features: [
        "Cross-Platform Development",
        "Native Performance",
        "Offline Capabilities",
        "Push Notifications",
        "App Store Deployment",
        "Real-time Synchronization"
      ],
      challenges: [
        "Platform-specific requirements",
        "Performance optimization",
        "Offline functionality",
        "App store compliance"
      ],
      solution: "Leveraged React Native for cross-platform development, ensuring consistent user experience while maintaining native performance. Implemented robust offline capabilities and seamless cloud synchronization."
    }
  },
  {
    id: 3,
    name: "Task Manager",
    fullName: "Task Manager (03)",
    slug: "task-manager",
    description: "User-centered design solutions that combine aesthetics with functionality.",
    image: "/hand-dials-old-red-rotary-phone-dusted-with-time.jpg",
    details: {
      overview: "Comprehensive UI/UX design services focused on creating intuitive, beautiful, and functional user interfaces. I combine user research, design thinking, and modern design principles to craft experiences that users love.",
      technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "After Effects", "Photoshop"],
      features: [
        "User Research",
        "Wireframing & Prototyping",
        "Visual Design",
        "Interaction Design",
        "Design Systems",
        "Usability Testing"
      ],
      challenges: [
        "Balancing aesthetics with functionality",
        "Ensuring accessibility",
        "Maintaining design consistency",
        "User adoption"
      ],
      solution: "Adopted a user-centered design approach with extensive research and testing. Created comprehensive design systems to ensure consistency and accessibility across all touchpoints."
    }
  },
  {
    id: 4,
    name: "Social Media",
    fullName: "Social Media Platform (04)",
    slug: "social-media-platform",
    description: "RESTful and GraphQL API development with comprehensive documentation and testing.",
    image: "/freepik__talk__92491.png",
    details: {
      overview: "Professional API development services including RESTful and GraphQL APIs. I build scalable, well-documented APIs that enable seamless communication between frontend and backend systems.",
      technologies: ["Node.js", "Express", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "JWT"],
      features: [
        "RESTful API Design",
        "GraphQL Implementation",
        "Authentication & Authorization",
        "Rate Limiting",
        "API Documentation",
        "Error Handling"
      ],
      challenges: [
        "API versioning",
        "Security vulnerabilities",
        "Performance at scale",
        "Documentation maintenance"
      ],
      solution: "Implemented RESTful best practices with comprehensive error handling and security measures. Created detailed API documentation using OpenAPI/Swagger and implemented versioning strategies for backward compatibility."
    }
  },
  {
    id: 5,
    name: "Analytics Dashboard",
    fullName: "Analytics Dashboard (05)",
    slug: "analytics-dashboard",
    description: "Cloud infrastructure setup, deployment, and management on AWS, Azure, and GCP.",
    image: "/3d-rendering-triangle-water.jpg",
    details: {
      overview: "Cloud infrastructure services covering setup, deployment, and management. I help businesses migrate to the cloud and optimize their infrastructure for scalability, reliability, and cost-effectiveness.",
      technologies: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD"],
      features: [
        "Cloud Migration",
        "Infrastructure as Code",
        "Container Orchestration",
        "Auto-scaling",
        "Load Balancing",
        "Monitoring & Logging"
      ],
      challenges: [
        "Cost optimization",
        "Security configuration",
        "Scalability planning",
        "Disaster recovery"
      ],
      solution: "Designed and implemented cloud infrastructure using Infrastructure as Code principles. Set up automated scaling, comprehensive monitoring, and disaster recovery plans to ensure high availability and cost efficiency."
    }
  },
  {
    id: 6,
    name: "Booking System",
    fullName: "Booking System (06)",
    slug: "booking-system",
    description: "Database architecture, design, and optimization for relational and NoSQL databases.",
    image: "/vintage-rotary-dial-phone-with-japanese-characters.jpg",
    details: {
      overview: "Comprehensive database design and optimization services. I create efficient, scalable database architectures that support your application's data requirements while ensuring performance and reliability.",
      technologies: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "SQL Server"],
      features: [
        "Database Architecture",
        "Schema Design",
        "Query Optimization",
        "Indexing Strategies",
        "Data Migration",
        "Backup & Recovery"
      ],
      challenges: [
        "Performance bottlenecks",
        "Data consistency",
        "Scalability",
        "Data migration"
      ],
      solution: "Designed normalized database schemas with strategic indexing for optimal query performance. Implemented comprehensive backup and recovery strategies, and optimized queries to handle large datasets efficiently."
    }
  },
  {
    id: 7,
    name: "Learning Platform",
    fullName: "Learning Platform (07)",
    slug: "learning-platform",
    description: "CI/CD pipeline setup, containerization, and automated deployment solutions.",
    image: "/scroll-with-japanese-calligraphy-wooden-stand-with-two-rolledup-scrolls.jpg",
    details: {
      overview: "DevOps and deployment services that streamline your development workflow. I set up CI/CD pipelines, containerization, and automated deployment processes to accelerate development cycles and ensure reliable releases.",
      technologies: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI", "Terraform", "Ansible"],
      features: [
        "CI/CD Pipelines",
        "Containerization",
        "Automated Testing",
        "Infrastructure Automation",
        "Monitoring & Alerting",
        "Deployment Strategies"
      ],
      challenges: [
        "Deployment complexity",
        "Environment consistency",
        "Rollback strategies",
        "Monitoring setup"
      ],
      solution: "Implemented comprehensive CI/CD pipelines with automated testing and deployment. Used containerization for environment consistency and set up monitoring and alerting systems for proactive issue detection."
    }
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}

