import { BookOpen, Code, ExternalLink, Github, Linkedin, type LucideIcon } from "lucide-react";
import type { LinkKey } from "@/data/profile";

export const linkIcons: Record<LinkKey, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Code,
  hackerrank: ExternalLink,
  codechef: BookOpen,
};
