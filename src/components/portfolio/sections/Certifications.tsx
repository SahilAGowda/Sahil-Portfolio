import { ExternalLink, Award, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const certifications = [
  {
    title: "AWS Certified Cloud Practitioner",
    provider: "Amazon Web Services",
    platform: "Udemy",
    date: "2024",
    description: "Comprehensive certification covering AWS cloud fundamentals, services, and best practices.",
    skills: ["Cloud Computing", "AWS Services", "Cloud Architecture", "Security"],
    verified: true,
    logo: "☁️",
    certificateUrl: "https://drive.google.com/file/d/14TGjTTAcI3SG6dc5bxS5nv03avHX5n4K/view?usp=sharing"
  },
  {
    title: "Machine Learning and Data Science",
    provider: "Complete Bootcamp",
    platform: "Udemy",
    date: "2023",
    description: "Intensive course covering ML algorithms, data analysis, and practical implementation.",
    skills: ["Machine Learning", "Data Science", "Python", "Statistics"],
    verified: true,
    logo: "🤖",
    certificateUrl: "https://drive.google.com/file/d/1EA-l523bPbAKhSJqZtU9ykUlu3cdYrcC/view?usp=sharing"
  },
  {
    title: "Introduction to Selenium",
    provider: "Simplilearn",
    platform: "Simplilearn",
    date: "2023",
    description: "Automation testing certification focusing on Selenium WebDriver and testing frameworks.",
    skills: ["Test Automation", "Selenium", "WebDriver", "Quality Assurance"],
    verified: true,
    logo: "🔧",
    certificateUrl: "https://drive.google.com/file/d/1-gm4ljgFwgGaDPe_-I8mKgu8To2ykqtT/view?usp=sharing"
  },
  {
    title: "Introduction to Artificial Intelligence",
    provider: "Simplilearn",
    platform: "Simplilearn",
    date: "2023",
    description: "Foundational course covering AI concepts, applications, and future trends.",
    skills: ["Artificial Intelligence", "Neural Networks", "Deep Learning", "AI Ethics"],
    verified: true,
    logo: "🧠",
    certificateUrl: "https://drive.google.com/file/d/1OpcmcSJ4r5m2EjM3BURkAwoC8Jhi57nO/view?usp=sharing"
  }
];

const codingProfiles = [
  {
    platform: "LeetCode",
    username: "sahilgowda204",
    url: "https://leetcode.com/u/sahilgowda204/",
    logo: "💻",
    stats: "500+ Problems Solved"
  },
  {
    platform: "CodeChef",
    username: "sahilgowda204",
    url: "https://www.codechef.com/users/sahilgowda204",
    logo: "👨‍💻",
    stats: "3 Star Rating"
  },
  {
    platform: "HackerRank",
    username: "sahilgowda204",
    url: "https://www.hackerrank.com/profile/sahilgowda204",
    logo: "🏆",
    stats: "Gold Badge"
  },
  {
    platform: "GitHub",
    username: "SahilAGowda",
    url: "https://github.com/SahilAGowda",
    logo: "🎯",
    stats: "Active Contributor"
  },
  {
    platform: "LinkedIn",
    username: "sahil-a-gowda",
    url: "https://www.linkedin.com/in/sahil-a-gowda-551b32270/",
    logo: "🥷",
    stats: "Professional Network"
  }
];

export function Certifications() {
  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Certifications & Learning</h2>
        
        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {certifications.map((cert, index) => (
            <Card key={index} className="card-hover bg-card border-border p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                  {cert.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                    <User className="h-4 w-4" />
                    <span>{cert.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{cert.date}</span>
                    {cert.verified && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {cert.description}
              </p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Skills Covered:</p>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full btn-secondary" 
                size="sm"
                onClick={() => window.open(cert.certificateUrl, '_blank')}
              >
                <Award className="h-4 w-4 mr-2" />
                View Certificate
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Coding Profiles Section */}
        <div className="border-t border-border pt-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Competitive Programming Profiles
          </h3>
          <p className="text-text-secondary text-center mb-8">
            Active on various coding platforms, continuously improving problem-solving skills
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {codingProfiles.map((profile, index) => (
              <Card key={index} className="card-hover bg-card border-border p-4 text-center group cursor-pointer">
                <a 
                  href={profile.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="text-3xl mb-3">{profile.logo}</div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                    {profile.platform}
                  </h4>
                  <p className="text-text-muted text-xs mb-2">@{profile.username}</p>
                  <p className="text-primary font-medium text-sm">{profile.stats}</p>
                </a>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Journey */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">Continuous Learning Journey</h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Committed to staying updated with the latest technologies and best practices 
              through continuous learning and hands-on practice.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">4+</div>
                <div className="text-sm text-text-muted">Certifications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">5</div>
                <div className="text-sm text-text-muted">Coding Platforms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-text-muted">Problems Solved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">100+</div>
                <div className="text-sm text-text-muted">Hours Learning</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}