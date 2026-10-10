// Source: resume-latest.pdf (skills line and experience bullets); FastAPI comes from the brief's positioning line.
// Grouped, no levels or percentages, ordered by relevance to backend and AI roles.

export interface SkillGroup {
  title: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    items: [
      "Spring Boot",
      "Spring Batch",
      "Spring MVC",
      "Spring Security",
      "Spring Data JPA",
      "Hibernate",
      "JDBC",
      "REST APIs",
      "JWT",
      "Servlets",
      "FastAPI",
    ],
  },
  {
    title: "Data and search",
    items: ["PostgreSQL", "Elasticsearch", "MySQL", "MongoDB", "Redis (basics)"],
  },
  {
    title: "AI and agents",
    items: ["LangChain", "LangGraph", "RAG", "Milvus", "Pinecone", "Meta WhatsApp Cloud API"],
  },
  {
    title: "Languages",
    items: ["Java", "Python", "SQL", "C"],
  },
  {
    title: "AWS",
    items: ["EC2", "S3", "RDS", "Lambda", "API Gateway", "SQS", "SNS", "DynamoDB", "EventBridge"],
  },
  {
    title: "Delivery and testing",
    items: ["Nginx", "Docker (familiar)", "Maven", "Git", "CI/CD basics", "JUnit", "Mockito", "Postman", "Swagger"],
  },
  {
    title: "Concepts",
    items: ["Microservices", "Design patterns", "ACID", "MVC", "OOP", "Agile"],
  },
];
