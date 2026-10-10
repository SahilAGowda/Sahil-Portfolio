import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { links, profile } from "@/data/profile";
import { ExternalLink } from "./ExternalLink";
import { Section } from "./Section";

type CopyState = "idle" | "copied" | "failed";

export function ContactSection() {
  const { email, location } = profile.contact;
  const [copy, setCopy] = useState<CopyState>("idle");
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopy("idle"), 3000);
  };

  return (
    <Section id="contact" title="Get in touch">
      <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
        <picture>
          <source
            type="image/webp"
            srcSet={`${profile.photo.base}-192.webp 192w, ${profile.photo.base}-288.webp 288w`}
            sizes={`${profile.photo.width}px`}
          />
          <img
            src={`${profile.photo.base}.jpg`}
            srcSet={`${profile.photo.base}-192.jpg 192w, ${profile.photo.base}.jpg 288w`}
            sizes={`${profile.photo.width}px`}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            loading="lazy"
            decoding="async"
            className="h-[120px] w-24 rounded-md object-cover"
          />
        </picture>
        <div>
          <p className="max-w-[64ch]">Email is the quickest way to reach me.</p>
          <p className="mt-3 break-all text-lede font-semibold">{email}</p>
          <p className="text-muted-foreground">{location}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${email}`}>Email me</a>
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={copyEmail}>
              {copy === "copied" ? "Email copied" : "Copy email"}
            </Button>
          </div>
          <p role="status" className={copy === "failed" ? "mt-3 text-destructive" : "sr-only"}>
            {copy === "copied" && "Email address copied to the clipboard."}
            {copy === "failed" && "Could not copy. Select the address above instead."}
          </p>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
            <ExternalLink href={links.linkedin.href} className="link inline-flex min-h-11 items-center">
              {links.linkedin.label}
            </ExternalLink>
            <ExternalLink href={links.github.href} className="link inline-flex min-h-11 items-center">
              {links.github.label}
            </ExternalLink>
          </p>
        </div>
      </div>
    </Section>
  );
}
