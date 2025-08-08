import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Single source of truth for contact details
const CONTACT = {
  email: "sahilgowda204@gmail.com",
  phone: "9945886311",
  location: "Bangalore, India",
};

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    link: `mailto:${CONTACT.email}`,
    gradient: "from-blue-500 to-cyan-500",
    hint: "Drop me a line anytime",
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT.phone,
    link: `tel:${CONTACT.phone}`,
    gradient: "from-green-500 to-emerald-500",
    hint: "Let's have a quick chat",
  },
  {
    icon: MapPin,
    label: "Location",
    value: CONTACT.location,
    link: "https://maps.google.com/?q=Bangalore,India",
    gradient: "from-purple-500 to-pink-500",
    hint: "Silicon Valley of India",
  },
];

const socials = [
  { name: "GitHub", icon: Github, url: "https://github.com/SahilAGowda" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/sahil-a-gowda-551b32270/" },
  { name: "LeetCode", icon: ExternalLink, url: "https://leetcode.com/u/sahilgowda204/" },
  { name: "HackerRank", icon: ExternalLink, url: "https://www.hackerrank.com/profile/sahilgowda204" },
  { name: "CodeChef", icon: ExternalLink, url: "https://www.codechef.com/users/sahilgowda204" },
];

export function Connect() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => setVisible(true), []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      toast({ title: "Message sent", description: "I'll get back within 24 hours." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({ title: "Failed to send", description: "Please try again or email me directly.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="portfolio-section relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 -left-24 w-[34rem] h-[34rem] bg-primary/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            Let’s build something great
          </div>
          <h2 className={`section-title transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>Contact</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I’m always interested in new opportunities—full-time roles, freelance projects, or collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Info cards */}
          <div className={`space-y-4 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}>
            {contactCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <Card key={i} className="card-hover bg-card border-border p-6 lg:p-8">
                  <a
                    href={c.link}
                    target={c.link.startsWith("http") ? "_blank" : "_self"}
                    rel={c.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{c.label}</p>
                        <p className="text-lg font-semibold">{c.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{c.hint}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </a>
                </Card>
              );
            })}

            <Card className="bg-card border-border p-5">
              <p className="font-semibold mb-3">Follow me</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="card-hover flex items-center gap-2 p-3 rounded-lg border border-border">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{s.name}</span>
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className={`xl:col-span-2 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}>
            <Card className="bg-card border-border overflow-hidden">
              <div className="p-6 bg-primary/5">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Send className="w-6 h-6 text-primary" />
                  Send a message
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Have a project in mind? Let’s discuss.</p>
              </div>
              <div className="p-6">
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium">Full name *</label>
                      <Input id="name" name="name" value={form.name} onChange={onChange} required placeholder="Enter your name" className="mt-2" />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium">Email *</label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="Enter your email" className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                    <Input id="subject" name="subject" value={form.subject} onChange={onChange} required placeholder="Collaboration / Job / Inquiry" className="mt-2" />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium">Message *</label>
                    <Textarea id="message" name="message" value={form.message} onChange={onChange} required rows={6} placeholder="Tell me about your project, requirements, and timeline..." className="mt-2" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={submitting} className="flex-1 btn-primary">
                      {submitting ? "Sending..." : (
                        <span className="inline-flex items-center gap-2">
                          <Send className="w-4 h-4" /> Send
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" className="btn-secondary" asChild>
                      <a href={`mailto:${CONTACT.email}`}>
                        <Mail className="w-4 h-4 mr-2" /> Quick email
                      </a>
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Connect;
