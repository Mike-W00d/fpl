import { Card, CardContent } from "@/components/ui/card";
import { Globe, Github, Linkedin } from "lucide-react";

const links = [
  {
    label: "Portfolio",
    href: "https://mgmwood.com/",
    icon: Globe,
  },
  {
    label: "GitHub",
    href: "https://github.com/Mike-W00d",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mike-wood22/",
    icon: Linkedin,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="text-muted-foreground leading-relaxed">
            This is a hobby project built over a weekend by{" "}
            <span className="font-semibold text-foreground">Michael Wood</span>.
            It&apos;s a companion app for Fantasy Premier League — pulling live
            data from the FPL API to surface league standings, awards, and
            gameweek stats in a cleaner interface.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
