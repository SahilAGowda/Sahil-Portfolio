import { achievements, certifications, codingProfiles, education } from "@/data/credentials";
import { ExternalLink } from "./ExternalLink";
import { Section } from "./Section";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="md:grid md:grid-cols-[13rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 max-w-[64ch] md:mt-0">{children}</dd>
    </div>
  );
}

export function CredentialsSection() {
  const [degree, ...school] = education;

  return (
    <Section id="credentials" title="Credentials">
      <dl className="mt-10 space-y-10">
        <Row label="Education">
          <p className="font-semibold">{degree.degree}</p>
          <p>
            {degree.institution}
            {degree.location ? `, ${degree.location}` : ""}
          </p>
          <p className="text-muted-foreground">
            {[degree.period, degree.status, degree.grade].filter(Boolean).join(", ")}
          </p>
          {degree.detail && <p className="mt-2 text-caption text-muted-foreground">{degree.detail}</p>}
          <ul className="mt-4 space-y-1 text-muted-foreground">
            {school.map((entry) => (
              <li key={entry.degree}>
                {[entry.degree, entry.institution, entry.location, entry.period, entry.grade].filter(Boolean).join(", ")}
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Certifications">
          <ul className="space-y-3">
            {certifications.map((cert) => (
              <li key={cert.title}>
                <p>
                  {[cert.title, cert.issuer, cert.year].join(", ")}
                  {cert.kind && <span className="text-muted-foreground"> ({cert.kind.toLowerCase()})</span>}
                </p>
                {cert.url && (
                  <ExternalLink href={cert.url} className="link inline-flex min-h-11 items-center">
                    Open certificate
                  </ExternalLink>
                )}
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Achievements">
          <ul className="space-y-3">
            {achievements.map((item) => (
              <li key={`${item.title}-${item.event}`}>
                {[item.title, item.event, item.year].filter(Boolean).join(", ")}
                {item.detail && <span className="text-muted-foreground">. {item.detail}</span>}
              </li>
            ))}
          </ul>
        </Row>

        <Row label="Coding profiles">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {codingProfiles.map((profile) => (
              <li key={profile.platform}>
                <ExternalLink href={profile.href} className="link inline-flex min-h-11 items-center">
                  {profile.platform}
                </ExternalLink>
                {profile.stat && <span className="text-muted-foreground"> {profile.stat}</span>}
              </li>
            ))}
          </ul>
        </Row>
      </dl>
    </Section>
  );
}
