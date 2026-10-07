// Sources: resume-latest.pdf; school-level lines and the AWS certificate link come from the previous
// site and were confirmed at Checkpoint A (B.E. completed May 2026; the AWS item is a Udemy course certificate).

import { links } from "./profile";

export interface EducationEntry {
  degree: string;
  institution: string;
  location?: string;
  period: string;
  status?: string;
  grade?: string;
  detail?: string;
}

export const education: EducationEntry[] = [
  {
    degree: "B.E. in Computer Science and Engineering",
    institution: "Cambridge Institute of Technology North Campus",
    location: "Bengaluru",
    period: "2022 – 2026",
    status: "Graduated May 2026",
    grade: "CGPA 9.25 / 10",
    detail: "Coursework: DSA, DBMS, operating systems, computer networks, OOP, system design.",
  },
  {
    degree: "Pre-University Course (PUC)",
    institution: "M.E.S. Pre-University College",
    location: "Bengaluru",
    period: "2020 – 2022",
    grade: "89%",
  },
  {
    degree: "SSLC",
    institution: "Sri Jnanvardhaka English High School",
    location: "Bengaluru",
    period: "2020",
    grade: "97%",
  },
];

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  /** Shown only when known, for example "Course certificate". */
  kind?: string;
  /** Certificate link, shown only when set. */
  url?: string;
}

export const certifications: Certification[] = [
  {
    title: "AWS Cloud Practitioner",
    issuer: "Udemy",
    year: "2024",
    kind: "Course certificate",
    url: "https://drive.google.com/file/d/1OpcmcSJ4r5m2EjM3BURkAwoC8Jhi57nO/view?usp=sharing",
  },
  {
    title: "Selenium WebDriver with Java",
    issuer: "Simplilearn",
    year: "2024",
  },
];

export interface Achievement {
  title: string;
  event?: string;
  year?: string;
  detail?: string;
}

export const achievements: Achievement[] = [
  { title: "2nd place", event: "GDSC Quizzard", year: "2024" },
  { title: "Finalist", event: "Smart India Hackathon (SIH)", year: "2025" },
  {
    title: "Tech Lead",
    event: "GDSC",
    detail: "Mentored 50+ students in AI/ML concepts and organized technical workshops.",
  },
];

export interface CodingProfile {
  platform: string;
  handle: string;
  href: string;
  /** Shown only when set; left empty until the profile page confirms a number. */
  stat?: string;
}

export const codingProfiles: CodingProfile[] = [links.leetcode, links.hackerrank, links.codechef].map((link) => ({
  platform: link.label,
  handle: link.handle ?? "",
  href: link.href,
}));
