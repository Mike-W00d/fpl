import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GetStartedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Get Started</h1>
      <p className="text-muted-foreground mb-8">
        Link your FPL account to start tracking your season.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Connect your FPL Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Enter your FPL Team ID to get started. You can find this in the URL
            when viewing your team on the official FPL site.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
