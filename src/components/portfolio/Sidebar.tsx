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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { linkOrder, links, profile } from "@/data/profile";
import { linkIcons } from "./linkIcons";

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

const initials = profile.name
  .split(" ")
  .filter((_, i, words) => i === 0 || i === words.length - 1)
  .map((word) => word[0])
  .join("");

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
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary/20 group">
              <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{initials}</span>
            </div>
            <h2 className="text-xl font-bold text-sidebar-foreground mb-1">{profile.name}</h2>
            <p className="text-sm text-text-secondary">{profile.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id} 
                      className="animate-fade-in-up" 
                      style={{animationDelay: `${index * 0.1}s`}}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        nav-item w-full text-left group relative overflow-hidden
                        ${isActive ? 'nav-item-active scale-105' : 'hover:scale-105'}
                        transition-all duration-300
                      `}
                    >
                      <IconComponent className={`h-5 w-5 transition-all duration-300 ${
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Hover effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${
                        isActive ? 'opacity-20' : ''
                      }`}></div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Social Links */}
          <div className="mt-8 pt-6 border-t border-sidebar-border animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <p className="text-sm text-text-muted mb-4 text-center">Connect with me</p>
            <div className="flex justify-center space-x-4">
              {linkOrder.map((key, index) => {
                const link = links[key];
                const IconComponent = linkIcons[key];
                return (
                  <a
                    key={key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2 rounded-lg text-text-secondary transition-all duration-300
                      hover:bg-sidebar-accent hover:text-primary hover:scale-125 hover:rotate-12
                      animate-bounce-in
                    `}
                    style={{animationDelay: `${1 + index * 0.1}s`}}
                    aria-label={link.label}
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