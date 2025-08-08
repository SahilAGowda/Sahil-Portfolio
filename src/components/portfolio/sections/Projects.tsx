import { useState, useEffect } from "react";
import { ExternalLink, Github, Eye, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce application with user authentication, product management, shopping cart, and payment integration.",
    category: "Full Stack",
    image: "/api/placeholder/400/250",
    technologies: ["React", "Spring Boot", "JWT", "MySQL", "REST API"],
    features: [
      "User authentication and authorization",
      "Product catalog with search and filters",
      "Shopping cart and wishlist functionality",
      "Secure payment gateway integration"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "Completed"
  },
  {
    title: "AutoProof",
    description: "Automated document verification system using OCR and machine learning for document authenticity checking.",
    category: "AI",
    image: "/api/placeholder/400/250",
    technologies: ["React", "Node.js", "Express", "MongoDB", "OCR"],
    features: [
      "Document scanning and OCR processing",
      "AI-powered authenticity verification",
      "Real-time document validation",
      "Secure document storage"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "Completed"
  },
  {
    title: "SmartFlex",
    description: "AI-powered workout monitoring system using computer vision to track exercise form and provide real-time feedback.",
    category: "AI",
    image: "/api/placeholder/400/250",
    technologies: ["TensorFlow.js", "MediaPipe", "React", "WebRTC"],
    features: [
      "Real-time pose detection and analysis",
      "Exercise form correction feedback",
      "Workout tracking and analytics",
      "Personalized training recommendations"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "In Progress"
  },
  {
    title: "OMR Scanner",
    description: "Optical Mark Recognition system for automated evaluation of multiple-choice answer sheets.",
    category: "AI",
    image: "/api/placeholder/400/250",
    technologies: ["Python", "OpenCV", "NumPy", "Image Processing"],
    features: [
      "Automatic answer sheet detection",
      "Accurate mark recognition",
      "Batch processing capabilities",
      "Results export to multiple formats"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "Completed"
  },
  {
    title: "Weather App",
    description: "Modern weather application with location-based forecasts, interactive maps, and detailed weather analytics.",
    category: "Web",
    image: "/api/placeholder/400/250",
    technologies: ["React", "OpenWeather API", "Chart.js", "Geolocation"],
    features: [
      "Current weather and 7-day forecasts",
      "Interactive weather maps",
      "Location-based weather alerts",
      "Weather data visualization"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "Completed"
  },
  {
    title: "To-Do List App",
    description: "Interactive task management application with drag-and-drop functionality and local storage.",
    category: "Web",
    image: "/api/placeholder/400/250",
    technologies: ["HTML", "CSS", "JavaScript", "Local Storage"],
    features: [
      "Create, edit, and delete tasks",
      "Drag-and-drop task reordering",
      "Task categorization and filtering",
      "Persistent data storage"
    ],
    demoUrl: "#",
    githubUrl: "#",
    status: "Completed"
  }
];

const categories = ["All", "Web", "AI", "Full Stack"];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "In Progress":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className={`section-title transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>Featured Projects</h2>
        
        {/* Filter Tabs */}
        <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <Filter className="h-5 w-5 text-text-muted mr-2 mt-1" />
          {categories.map((category, index) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              onClick={() => setActiveCategory(category)}
              className={`
                transition-all duration-300 hover:scale-105 animate-stagger-in
                ${activeCategory === category 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'hover:bg-hover-bg hover:shadow-md'
                }
              `}
              style={{animationDelay: `${0.4 + index * 0.1}s`}}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <Card 
              key={index} 
              className={`card-hover bg-card border-border overflow-hidden group animate-stagger-in transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary/50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{animationDelay: `${0.8 + index * 0.2}s`}}
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center scale-110 group-hover:scale-100">
                  <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Button size="sm" className="bg-background text-foreground hover:bg-background/90 hover:scale-110 transition-all duration-300">
                      <Eye className="h-4 w-4 mr-1" />
                      Demo
                    </Button>
                    <Button size="sm" variant="outline" className="border-background text-background hover:bg-background hover:text-foreground hover:scale-110 transition-all duration-300">
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  </div>
                </div>
                <div className="absolute top-3 right-3 transform group-hover:scale-110 transition-transform duration-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border animate-pulse ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-105">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {project.category}
                  </span>
                </div>

                <p className="text-text-secondary text-sm mb-4 leading-relaxed group-hover:text-foreground transition-colors duration-300">
                  {project.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-text-muted mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {project.features.slice(0, 2).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-code-bg text-foreground rounded text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 btn-primary">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Live Demo
                  </Button>
                  <Button size="sm" variant="outline" className="btn-secondary">
                    <Github className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <h3 className="text-lg font-bold text-foreground mb-2">Want to see more?</h3>
            <p className="text-text-secondary mb-4">
              Check out my GitHub for more projects and contributions
            </p>
            <Button className="btn-primary">
              <Github className="h-4 w-4 mr-2" />
              View GitHub Profile
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}