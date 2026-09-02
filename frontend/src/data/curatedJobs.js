// Curated default jobs matching reference design (24+ curated tech jobs)
const CURATED_DEFAULT_JOBS = [
  {
    id: 101,
    title: "Software Engineer, Core",
    company_name: "Google",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "1–3 Yrs",
    salary_summary: "₹18 – 35 LPA",
    posted_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    department: "Core Engineering",
    team: "Core Engineering",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
Google is looking for a Software Engineer to build scalable, reliable and efficient software solutions that impact billions of users. You will work on challenging problems, influence product direction and help build the future.

### What you'll do
* Design, develop and maintain software solutions.
* Work on large scale distributed systems.
* Collaborate with cross-functional teams.
* Improve code quality, performance and scalability.

### What we're looking for
* Bachelor's degree in Computer Science or related field.
* 1–3 years of experience in software development.
* Strong problem solving and data structures knowledge.
* Experience with Python, C++ or Java.

### Preferred qualifications
* Experience with large scale systems.
* Knowledge of cloud technologies (GCP/AWS).
* Open source contributions.`,
    url: "https://www.google.com/about/careers/applications/jobs/results"
  },
  {
    id: 102,
    title: "Software Engineer II",
    company_name: "Microsoft",
    location: "Hyderabad, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–4 Yrs",
    salary_summary: "₹16 – 28 LPA",
    posted_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    department: "Azure Cloud",
    team: "Cloud Infrastructure",
    role: "Individual Contributor",
    full_location: "Hyderabad, Telangana, India",
    description: `### About the role
At Microsoft, we are building the future of cloud computing with Azure and developer productivity tools. In this role, you will build scalable cloud services using C#, .NET, and Azure cloud infrastructure.

### What you'll do
* Design, implement, and maintain high-throughput cloud microservices.
* Collaborate with architects and cross-functional product teams.
* Drive CI/CD quality and operational excellence.
* Build services that scale to millions of transactions.

### What we're looking for
* Bachelor's degree in Computer Science or equivalent.
* 2–4 years of professional software development experience.
* Proficiency in C#, .NET, or similar object-oriented languages.
* Understanding of distributed systems and cloud architecture.

### Preferred qualifications
* Experience with Azure or AWS cloud services.
* Knowledge of containerization with Docker and Kubernetes.
* Experience with high-availability distributed databases.`,
    url: "https://careers.microsoft.com/"
  },
  {
    id: 103,
    title: "Backend Engineer",
    company_name: "Swiggy",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹14 – 26 LPA",
    posted_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    department: "Engineering",
    team: "Platform & Logistics",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
Swiggy is India's leading on-demand delivery platform. As a Backend Engineer, you will build high-performance APIs and event-driven microservices that serve millions of orders daily in real-time.

### What you'll do
* Design and build scalable backend services with Java and Spring Boot.
* Work on real-time order tracking and payment systems.
* Optimize database queries and cache strategies using Kafka and Redis.
* Collaborate with mobile and frontend engineering teams.

### What we're looking for
* 2–5 years of backend development experience.
* Strong proficiency in Java, Spring Boot, and distributed systems.
* Experience with Kafka, Redis, or similar messaging systems.
* Knowledge of SQL and NoSQL databases.

### Preferred qualifications
* Experience with high-concurrency microservices.
* Knowledge of AWS infrastructure and Kubernetes.`,
    url: "https://careers.swiggy.com/"
  },
  {
    id: 104,
    title: "Frontend Developer",
    company_name: "Atlassian",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "1–3 Yrs",
    salary_summary: "₹14 – 24 LPA",
    posted_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    department: "Engineering",
    team: "Frontend Platform",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Atlassian builds tools like Jira, Confluence, and Trello that power collaboration for millions of teams worldwide. Join us as a Frontend Developer to build delightful, accessible, and ultra-fast user experiences.

### What you'll do
* Build responsive, accessible web applications using React and TypeScript.
* Collaborate with designers, product managers, and backend engineers.
* Write robust unit, integration, and end-to-end tests.
* Contribute to our shared design system and component library.

### What we're looking for
* 1–3 years of frontend development experience.
* Strong skills in React, TypeScript, and modern CSS (Tailwind CSS).
* Understanding of web performance optimization and browser internals.
* Passion for clean, maintainable, and well-tested code.

### Preferred qualifications
* Experience with GraphQL and state management libraries.
* Contributions to open source UI libraries.`,
    url: "https://www.atlassian.com/company/careers"
  },
  {
    id: 105,
    title: "Data Scientist",
    company_name: "PhonePe",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–4 Yrs",
    salary_summary: "₹15 – 30 LPA",
    posted_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    department: "Data Science",
    team: "Risk & Analytics",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
PhonePe processes billions of digital transactions every month across India. As a Data Scientist, you will build state-of-the-art machine learning models for fraud prevention, real-time risk scoring, and intelligent recommendation systems.

### What you'll do
* Build predictive models for fraud detection and transaction risk assessment.
* Analyze large datasets to identify patterns and actionable insights.
* Collaborate with engineering teams to deploy models into low-latency production pipelines.
* Design A/B experiments and measure business impact.

### What we're looking for
* Strong foundation in Python, SQL, Statistics, and Machine Learning.
* Experience with predictive modeling, feature engineering, and model deployment.
* Familiarity with big data tools (Spark, Hive, Presto).
* Strong analytical problem-solving skills.

### Preferred qualifications
* Master's degree in CS, Data Science, or related quantitative field.
* Experience with deep learning frameworks (PyTorch, TensorFlow).`,
    url: "https://www.phonepe.com/careers/"
  },
  {
    id: 106,
    title: "DevOps Engineer",
    company_name: "Razorpay",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹16 – 30 LPA",
    posted_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    department: "Infrastructure",
    team: "Platform Engineering",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Razorpay is India's leading fintech payments infrastructure. As a DevOps Engineer, you will build and maintain resilient, highly automated cloud infrastructure that processes billions of financial transactions with 99.99% uptime.

### What you'll do
* Design, automate, and manage cloud infrastructure on AWS.
* Build scalable CI/CD pipelines and deployment automation workflows.
* Implement observability, alerting, and automated incident response systems.
* Containerize applications using Docker and Kubernetes.

### What we're looking for
* 2–5 years of DevOps, SRE, or Infrastructure engineering experience.
* Strong hands-on skills in AWS, Docker, and Kubernetes.
* Experience with Terraform, Ansible, or similar Infrastructure as Code tools.
* Deep understanding of Linux networking, security, and protocols.

### Preferred qualifications
* AWS Certified Solutions Architect or CKA certification.
* Experience managing high-throughput financial systems.`,
    url: "https://razorpay.com/jobs/"
  },
  {
    id: 107,
    title: "Software Engineer",
    company_name: "Chargebee",
    location: "Chennai, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "1–3 Yrs",
    salary_summary: "₹12 – 22 LPA",
    posted_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    department: "Engineering",
    team: "Billing Platform",
    role: "Individual Contributor",
    full_location: "Chennai, Tamil Nadu, India",
    description: `### About the role
Chargebee is a global subscription management platform trusted by thousands of high-growth SaaS companies. Join us to build robust billing, tax calculation, and revenue automation engines.

### What you'll do
* Develop and maintain billing platform features using Go and PostgreSQL.
* Design and document resilient RESTful APIs consumed by global businesses.
* Optimize database performance with Redis caching strategies.
* Participate in architecture reviews and code quality initiatives.

### What we're looking for
* 1–3 years of software development experience.
* Proficiency in Go, PostgreSQL, or Redis.
* Clear understanding of REST API design and distributed transactions.
* Interest in fintech and SaaS subscription models.

### Preferred qualifications
* Experience with event-driven architectures.
* Knowledge of financial compliance and payment processing.`,
    url: "https://www.chargebee.com/company/careers/"
  },
  {
    id: 108,
    title: "Backend Developer",
    company_name: "Freshworks",
    location: "Hyderabad, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–4 Yrs",
    salary_summary: "₹14 – 24 LPA",
    posted_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    department: "Engineering",
    team: "CRM Platform",
    role: "Individual Contributor",
    full_location: "Hyderabad, Telangana, India",
    description: `### About the role
Freshworks builds cloud-based customer engagement software used by 60,000+ companies globally. As a Backend Developer, you will work on high-scale microservices for our flagship CRM suite.

### What you'll do
* Build and maintain scalable microservices using Java and Spring Boot.
* Design database schemas and optimize MySQL queries for high throughput.
* Integrate with third-party webhooks and communication APIs.
* Ensure high availability, fault tolerance, and system resiliency.

### What we're looking for
* 2–4 years of backend engineering experience.
* Strong skills in Java, Spring Boot, and MySQL.
* Understanding of microservices patterns and asynchronous processing.
* Experience with message queues (Kafka, RabbitMQ) and caching systems.

### Preferred qualifications
* Experience with AWS cloud infrastructure.
* Familiarity with search engines like Elasticsearch.`,
    url: "https://www.freshworks.com/company/careers/"
  },
  {
    id: 109,
    title: "Full Stack Engineer",
    company_name: "CRED",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹24 – 42 LPA",
    posted_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    department: "Engineering",
    team: "Rewards & Commerce",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
CRED is a members-only club that rewards individuals for their financial trustworthiness. Build delightful fintech products that empower millions of creditworthy individuals.

### What you'll do
* Build full stack web applications and micro-frontends with React, TypeScript, and Node.js.
* Architect scalable backend services communicating via gRPC and Kafka.
* Deliver high-fidelity UI animations with 60fps performance.
* Participate in high-impact product design sprints.

### What we're looking for
* 2–5 years of full stack web development experience.
* Strong proficiency in React, TypeScript, Node.js, and Redis.
* Obsession with micro-interactions, animations, and clean architecture.`,
    url: "https://cred.club/careers"
  },
  {
    id: 110,
    title: "Senior Cloud Architect",
    company_name: "Amazon",
    location: "Hyderabad, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "5–8 Yrs",
    salary_summary: "₹35 – 60 LPA",
    posted_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    department: "AWS",
    team: "Solutions Architecture",
    role: "Senior Contributor",
    full_location: "Hyderabad, Telangana, India",
    description: `### About the role
Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform. As a Senior Cloud Architect, you will help enterprise customers design resilient, scalable cloud systems.

### What you'll do
* Architect cloud-native solutions on AWS for Fortune 500 enterprises.
* Deliver technical leadership on security, multi-region failover, and cost optimization.
* Mentor junior architects and publish reference blueprints.

### What we're looking for
* 5+ years of distributed systems architecture experience on AWS.
* Deep knowledge of AWS services: EKS, DynamoDB, Lambda, S3, CloudFront.`,
    url: "https://amazon.jobs"
  },
  {
    id: 111,
    title: "Machine Learning Engineer",
    company_name: "Flipkart",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹20 – 38 LPA",
    posted_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    department: "Data Science",
    team: "Search & Recommendations",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
Flipkart is India's homegrown e-commerce marketplace. You will design, train, and deploy large-scale deep learning models for product ranking, personalization, and visual search.

### What you'll do
* Build recommendation models serving 300M+ users.
* Train transformer-based embeddings and multi-modal models using PyTorch.
* Optimize inference latency with TensorRT and ONNX.

### What we're looking for
* 2–5 years of applied ML engineering experience.
* Strong skills in Python, PyTorch, C++, and vector search engines.`,
    url: "https://www.flipkartcareers.com"
  },
  {
    id: 112,
    title: "Platform Security Engineer",
    company_name: "Zerodha",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "3–6 Yrs",
    salary_summary: "₹25 – 45 LPA",
    posted_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    department: "Security",
    team: "Infosec & DevSecOps",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
Zerodha is India's largest retail stockbroker. Build defense-in-depth security infrastructure protecting billions of dollars in daily market transactions.

### What you'll do
* Audit and harden Kubernetes clusters, cloud environments, and trading APIs.
* Build automated security scanning and vulnerability triage pipelines.
* Lead threat modeling, penetration testing, and incident investigations.

### What we're looking for
* 3+ years in application and cloud security.
* Deep understanding of TLS/PKI, OAuth2, Linux internals, and Go/Python.`,
    url: "https://zerodha.com/careers"
  },
  {
    id: 113,
    title: "iOS Engineer",
    company_name: "Zomato",
    location: "Gurgaon, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–4 Yrs",
    salary_summary: "₹18 – 32 LPA",
    posted_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    department: "Mobile",
    team: "Consumer App",
    role: "Individual Contributor",
    full_location: "Gurgaon, Haryana, India",
    description: `### About the role
Zomato delivers food and groceries to millions of homes across India. Build high-speed, fluid iOS experiences using Swift and SwiftUI.

### What you'll do
* Develop new features for Zomato iOS app with Swift, SwiftUI, and Combine.
* Optimize cold start time, memory footprint, and battery consumption.
* Collaborate with designers to craft pixel-perfect animations.

### What we're looking for
* 2–4 years of native iOS app development experience.
* Strong foundation in Swift, UIKit, SwiftUI, and Core Data.`,
    url: "https://www.zomato.com/careers"
  },
  {
    id: 114,
    title: "Site Reliability Engineer",
    company_name: "Postman",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "3–6 Yrs",
    salary_summary: "₹22 – 40 LPA",
    posted_at: new Date(Date.now() - 22 * 3600000).toISOString(),
    department: "Infrastructure",
    team: "Core SRE",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Postman is the world's leading API platform used by 30M+ developers. Ensure the reliability, uptime, and performance of Postman's cloud services.

### What you'll do
* Manage Kubernetes clusters across multiple AWS regions.
* Improve SLIs/SLOs, alerting thresholds, and on-call automation.
* Design multi-tenant distributed databases and Redis clusters.

### What we're looking for
* 3+ years of SRE/DevOps experience in high-scale SaaS.
* Strong skills in Terraform, Kubernetes, Prometheus, and Golang/Python.`,
    url: "https://www.postman.com/careers"
  },
  {
    id: 115,
    title: "Software Engineer, Core Systems",
    company_name: "Uber",
    location: "Hyderabad, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹28 – 50 LPA",
    posted_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    department: "Engineering",
    team: "Rider & Driver Marketplace",
    role: "Individual Contributor",
    full_location: "Hyderabad, Telangana, India",
    description: `### About the role
Uber connects the physical and digital worlds to move people and things. Build the core matching algorithms and low-latency geospatial services that power trips worldwide.

### What you'll do
* Design real-time dispatch and dynamic pricing algorithms in Go and Java.
* Optimize high-throughput event queues processing millions of location updates/sec.
* Drive architectural evolution of marketplace microservices.

### What we're looking for
* 2–5 years of distributed systems engineering experience.
* Strong proficiency in Go, Java, Kafka, and Cassandra/MySQL.`,
    url: "https://www.uber.com/careers"
  },
  {
    id: 116,
    title: "Product Designer (UI/UX)",
    company_name: "Airbnb",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "3–6 Yrs",
    salary_summary: "₹26 – 48 LPA",
    posted_at: new Date(Date.now() - 26 * 3600000).toISOString(),
    department: "Design",
    team: "Host Experience",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Airbnb creates a world where anyone can belong anywhere. As a Product Designer, you will shape intuitive and inspiring booking and hosting flows.

### What you'll do
* Design end-to-end user journeys from research to polished high-fidelity prototypes in Figma.
* Partner with engineering and product leadership on roadmap definition.
* Evolve our global design system with accessible and responsive components.

### What we're looking for
* 3+ years of digital product design experience.
* Strong portfolio demonstrating UX rigor, visual craft, and systems thinking.`,
    url: "https://careers.airbnb.com"
  },
  {
    id: 117,
    title: "Staff Data Engineer",
    company_name: "Adobe",
    location: "Noida, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "6–10 Yrs",
    salary_summary: "₹40 – 70 LPA",
    posted_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    department: "Data Platform",
    team: "Experience Cloud",
    role: "Staff Engineer",
    full_location: "Noida, Uttar Pradesh, India",
    description: `### About the role
Adobe Experience Cloud powers digital experiences for global brands. Lead the architecture of petabyte-scale streaming data pipelines.

### What you'll do
* Architect real-time lakehouse platforms using Apache Spark, Iceberg, and Delta Lake.
* Collaborate with machine learning teams to feed feature stores at sub-second latencies.
* Set data governance, lineage, and compliance standards.

### What we're looking for
* 6+ years of big data engineering experience with Spark, Kafka, and Python/Scala.`,
    url: "https://www.adobe.com/careers.html"
  },
  {
    id: 118,
    title: "Golang Backend Engineer",
    company_name: "Stripe",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "3–6 Yrs",
    salary_summary: "₹30 – 55 LPA",
    posted_at: new Date(Date.now() - 30 * 3600000).toISOString(),
    department: "Payments",
    team: "Global Financial Infrastructure",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Stripe is a financial infrastructure platform for the internet. Build rock-solid payment processing APIs that move hundreds of billions of dollars annually.

### What you'll do
* Build idempotency and transactional consistency guarantees into core payment rails in Go.
* Design robust integrations with global banking partners.
* Ensure zero downtime through automated canaries and chaos testing.

### What we're looking for
* 3+ years of backend development experience with Go, Ruby, or Java.
* Strong grasp of distributed systems, ACID transactions, and API design.`,
    url: "https://stripe.com/jobs"
  },
  {
    id: 119,
    title: "AI Research Engineer",
    company_name: "Meta",
    location: "Bangalore, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹32 – 58 LPA",
    posted_at: new Date(Date.now() - 32 * 3600000).toISOString(),
    department: "AI Research",
    team: "GenAI Foundations",
    role: "Individual Contributor",
    full_location: "Bangalore, Karnataka, India",
    description: `### About the role
Meta is creating the future of social connection. Join the GenAI engineering team to optimize and scale foundation models across LLaMA and multimodal architectures.

### What you'll do
* Optimize large language model fine-tuning and quantization pipelines.
* Implement distributed training using PyTorch FSDP and Megatron-LM.
* Evaluate and benchmark generative models on safety and domain accuracy.

### What we're looking for
* Strong background in PyTorch, CUDA, Python, and transformer architectures.`,
    url: "https://www.metacareers.com"
  },
  {
    id: 120,
    title: "Android Platform Engineer",
    company_name: "Spotify",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "3–5 Yrs",
    salary_summary: "₹22 – 38 LPA",
    posted_at: new Date(Date.now() - 34 * 3600000).toISOString(),
    department: "Mobile",
    team: "Audio Playback Engine",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Spotify unlocks the potential of human creativity. Work on the core playback and streaming engine used by 600M+ music lovers worldwide.

### What you'll do
* Build low-latency audio buffering and offline caching mechanisms in Kotlin and C++ NDK.
* Optimize memory allocations and battery efficiency across Android device tiers.
* Implement modern Jetpack Compose UI components.

### What we're looking for
* 3+ years of deep Android development with Kotlin, Coroutines, and Jetpack.`,
    url: "https://www.lifeatspotify.com"
  },
  {
    id: 121,
    title: "Senior QA Automation Engineer",
    company_name: "Salesforce",
    location: "Hyderabad, India",
    is_remote: false,
    employment_type: "FULL_TIME",
    experience: "4–7 Yrs",
    salary_summary: "₹20 – 35 LPA",
    posted_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    department: "Quality",
    team: "CRM Cloud Platform",
    role: "Individual Contributor",
    full_location: "Hyderabad, Telangana, India",
    description: `### About the role
Salesforce is the #1 AI CRM. Build automated testing frameworks that ensure enterprise-grade reliability and security for thousands of business apps.

### What you'll do
* Architect end-to-end automation frameworks with Playwright, Selenium, and Java/TypeScript.
* Integrate automated regression suites into multi-stage CI/CD pipelines.
* Perform API and performance load testing with JMeter/K6.

### What we're looking for
* 4+ years of test automation and framework design experience.
* Strong skills in Java/TypeScript, Playwright/Cypress, and Jenkins/GitHub Actions.`,
    url: "https://www.salesforce.com/company/careers"
  },
  {
    id: 122,
    title: "Blockchain Protocol Engineer",
    company_name: "Polygon",
    location: "Remote (India)",
    is_remote: true,
    employment_type: "FULL_TIME",
    experience: "2–5 Yrs",
    salary_summary: "₹28 – 52 LPA",
    posted_at: new Date(Date.now() - 38 * 3600000).toISOString(),
    department: "Core Protocol",
    team: "Zero-Knowledge zkEVM",
    role: "Individual Contributor",
    full_location: "Remote, India",
    description: `### About the role
Polygon is the leading Ethereum scaling protocol. Build state-of-the-art zero-knowledge proof generation and validation algorithms.

### What you'll do
* Develop high-performance cryptographic primitives in Rust and C++.
* Optimize zk-rollup proof verification circuits on Ethereum Layer 2.
* Ensure protocol security and formal verification of smart contracts.

### What we're looking for
* 2+ years of Rust and smart contract/cryptography development experience.`,
    url: "https://polygon.technology/careers"
  },
];

export default CURATED_DEFAULT_JOBS;


