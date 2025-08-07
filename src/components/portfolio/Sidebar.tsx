import { useState } from "react";
import { 
  Home, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Code, 
  Trophy, 
  Award, 
  Mail,
  Menu,
  X,
  Github,
  Linkedin,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "skills", label: "Skills", icon: Code },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "contact", label: "Contact", icon: Mail },
];

const socialLinks = [
  { 
    name: "GitHub", 
    icon: Github, 
    url: "https://github.com/sahil-gowda", 
    color: "hover:text-primary" 
  },
  { 
    name: "LinkedIn", 
    icon: Linkedin, 
    url: "https://linkedin.com/in/sahil-gowda", 
    color: "hover:text-primary" 
  },
  { 
    name: "LeetCode", 
    icon: ExternalLink, 
    url: "https://leetcode.com/sahil-gowda", 
    color: "hover:text-primary" 
  },
  { 
    name: "CodeChef", 
    icon: ExternalLink, 
    url: "https://codechef.com/users/sahil_gowda", 
    color: "hover:text-primary" 
  },
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar border border-sidebar-border"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">SG</span>
            </div>
            <h2 className="text-xl font-bold text-sidebar-foreground mb-1">Sahil A Gowda</h2>
            <p className="text-sm text-text-secondary">Full Stack Developer</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        nav-item w-full text-left
                        ${isActive ? 'nav-item-active' : ''}
                      `}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <p className="text-sm text-text-muted mb-4 text-center">Connect with me</p>
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2 rounded-lg text-text-secondary transition-all duration-300 
                      hover:bg-sidebar-accent ${social.color}
                    `}
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}