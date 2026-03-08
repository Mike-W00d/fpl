import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  BarChart3,
  Users,
  Link2,
  Award,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "FplTablePro — Fantasy Premier League Analytics & League Tracker",
  description:
    "Track your Fantasy Premier League mini-league standings, analyse gameweek history, compare FPL managers, and unlock awards. The ultimate FPL companion for serious fantasy football managers.",
  keywords: [
    "Fantasy Premier League",
    "FPL",
    "FPL tracker",
    "FPL analytics",
    "FPL mini league",
    "FPL standings",
    "FPL gameweek history",
    "fantasy football",
    "Premier League fantasy",
    "FPL manager tools",
    "FPL league table",
    "FPL comparison tool",
    "FPL awards",
    "FPL statistics",
  ],
  openGraph: {
    title: "FplTablePro — Fantasy Premier League Analytics & League Tracker",
    description:
      "The ultimate FPL companion. Track mini-league standings, analyse gameweek performance, and compete for awards.",
    type: "website",
  },
};

const features = [
  {
    icon: Trophy,
    title: "League Standings",
    description:
      "Live mini-league tables with detailed rankings, points breakdowns, and movement indicators. See exactly where you stand against your rivals in every FPL league.",
    badge: "Core",
  },
  {
    icon: BarChart3,
    title: "Gameweek Analysis",
    description:
      "Deep-dive into gameweek-by-gameweek performance. Track points scored, captain choices, bench points missed, and identify patterns across the entire Premier League season.",
    badge: "Analytics",
  },
  {
    icon: Users,
    title: "Manager Comparisons",
    description:
      "Head-to-head comparisons between FPL managers in your mini-leagues. Compare transfer histories, chip usage, captaincy records, and cumulative performance.",
    badge: "Compare",
  },
  {
    icon: Link2,
    title: "Link Your FPL Team",
    description:
      "Connect your Fantasy Premier League team ID in seconds. Your leagues, history, and stats sync automatically — no manual data entry required.",
    badge: "Setup",
  },
  {
    icon: Award,
    title: "Awards & Achievements",
    description:
      "Earn awards for standout FPL moments — highest gameweek score, biggest climber, captain masterstrokes, and more. Share your achievements with your league.",
    badge: "New",
  },
  {
    icon: TrendingUp,
    title: "Season Progress",
    description:
      "Visualise your FPL journey across the entire season. Track overall rank trajectory, total points accumulation, and team value changes week by week.",
    badge: "Insights",
  },
];

const stats = [
  { value: "38", label: "Gameweeks tracked" },
  { value: "100%", label: "Free to use" },
  { value: "Live", label: "Data sync" },
  { value: "∞", label: "Leagues supported" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="text-xs uppercase tracking-wide">
              Fantasy Premier League 2025/26
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
              Your FPL league,{" "}
              <span className="text-primary">analysed</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              FplTablePro gives Fantasy Premier League managers the tools to
              track mini-league standings, dissect gameweek performance, and
              settle arguments with data. Connect your FPL team and start
              competing smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Get started free
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">
                  Sign in
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to dominate your FPL league
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Purpose-built tools for Fantasy Premier League managers who take
            their mini-leagues seriously.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:border-primary/30 transition-colors"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                    <feature.icon size={20} />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            Up and running in three steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Shield,
                title: "Create your account",
                description:
                  "Sign up in seconds with email. Your data stays private and secure.",
              },
              {
                step: "02",
                icon: Link2,
                title: "Link your FPL team",
                description:
                  "Enter your Fantasy Premier League team ID. We pull your leagues and history automatically.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Start analysing",
                description:
                  "Explore your mini-league standings, compare managers, and track your season progress.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-primary/20 tabular-nums">
                    {item.step}
                  </span>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                    <item.icon size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
            The FPL tracker built for competitive managers
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Fantasy Premier League is more than a game — it&apos;s a
              season-long battle of strategy, knowledge, and nerve.
              FplTablePro is the companion app that helps you make sense of
              it all. Whether you&apos;re tracking your mini-league
              standings, analysing which gameweek transfers paid off, or
              comparing your FPL record against friends and colleagues,
              every insight you need is here.
            </p>
            <p>
              Unlike basic FPL tools that only show you a snapshot,
              FplTablePro tracks your entire Fantasy Premier League season.
              See how your overall rank has shifted gameweek by gameweek.
              Identify when your rivals played their Wildcard, Triple
              Captain, or Bench Boost chips. Understand the decisions that
              separate the top of your league from the rest.
            </p>
            <p>
              Built for the 2025/26 Premier League season and beyond,
              FplTablePro syncs directly with the official Fantasy Premier
              League API. Your data is always current, always accurate, and
              always free.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to take your FPL game to the next level?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join FplTablePro and get instant access to league analytics,
            gameweek breakdowns, and manager comparisons — completely free.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/sign-up">
              Create your free account
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>FplTablePro — Fantasy Premier League analytics</p>
            <p>
              Not affiliated with the Premier League or Fantasy Premier League.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
