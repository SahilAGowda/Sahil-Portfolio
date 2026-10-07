import { Copy, Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { links, profile } from "@/data/profile";
import { linkIcons } from "../linkIcons";

export function Connect() {
  const { toast } = useToast();
  const { email, location } = profile.contact;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Email copied", description: email });
    } catch {
      toast({ title: "Could not copy", description: `Copy it by hand: ${email}`, variant: "destructive" });
    }
  };

  return (
    <section className="portfolio-section">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">Get in touch</h2>
        <p className="text-text-secondary mb-8">Email is the quickest way to reach me.</p>

        <Card className="bg-card border-border p-6 lg:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-muted">Email</p>
              <p className="text-lg lg:text-xl font-semibold break-all">{email}</p>
              <p className="flex items-center gap-1 text-sm text-text-secondary mt-2">
                <MapPin className="w-4 h-4" />
                {location}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild className="btn-primary">
              <a href={`mailto:${email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Email me
              </a>
            </Button>
            <Button variant="outline" className="btn-secondary" onClick={copyEmail}>
              <Copy className="w-4 h-4 mr-2" />
              Copy email
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {(["linkedin", "github"] as const).map((key) => {
            const Icon = linkIcons[key];
            return (
              <Button key={key} asChild variant="outline" className="btn-secondary">
                <a href={links[key].href} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4 mr-2" />
                  {key === "github" ? "Open GitHub profile" : `Open ${links[key].label}`}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
