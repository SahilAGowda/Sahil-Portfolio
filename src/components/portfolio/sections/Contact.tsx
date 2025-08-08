import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, ExternalLink, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "sahil.gowda@example.com",
    link: "mailto:sahil.gowda@example.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9876543210",
    link: "tel:+919876543210"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Bangalore, India",
    link: "https://maps.google.com/?q=Bangalore,India"
  }
];

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/SahilAGowda",
    color: "hover:text-primary"
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/sahil-a-gowda-551b32270/",
    color: "hover:text-primary"
  },
  {
    name: "LeetCode",
    icon: ExternalLink,
    url: "https://leetcode.com/u/sahilgowda204/",
    color: "hover:text-primary"
  },
  {
    name: "HackerRank",
    icon: ExternalLink,
    url: "https://www.hackerrank.com/profile/sahilgowda204",
    color: "hover:text-primary"
  },
  {
    name: "CodeChef",
    icon: ExternalLink,
    url: "https://www.codechef.com/users/sahilgowda204",
    color: "hover:text-primary"
  }
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="portfolio-section">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Let's Connect</h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                I'm always interested in hearing about new opportunities, whether 
                that's a full-time role, a freelance project, or a collaboration. 
                Let's discuss how we can work together!
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <Card key={index} className="card-hover bg-card border-border p-4">
                    <a 
                      href={info.link}
                      className="flex items-center gap-4 group"
                      target={info.link.startsWith('http') ? '_blank' : '_self'}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">{info.label}</p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  </Card>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Follow Me</h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <Card key={index} className="card-hover bg-card border-border p-4">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <IconComponent className={`h-5 w-5 text-text-secondary transition-colors ${social.color}`} />
                        <span className={`font-medium text-foreground transition-colors ${social.color}`}>
                          {social.name}
                        </span>
                      </a>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-card border-border p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  required
                  className="bg-input border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project or opportunity..."
                  rows={6}
                  required
                  className="bg-input border-border focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Ready to Work Together?</h3>
            <p className="text-text-secondary mb-4 max-w-md">
              Whether you have a project in mind or just want to chat about technology, 
              I'd love to hear from you.
            </p>
            <Button className="btn-primary">
              <Mail className="h-4 w-4 mr-2" />
              Start a Conversation
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}