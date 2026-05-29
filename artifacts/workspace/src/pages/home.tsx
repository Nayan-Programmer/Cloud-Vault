import { Show } from "@clerk/react";
import { Link, Redirect } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/drive" />
      </Show>
      <Show when="signed-out">
        <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
          <header className="px-6 h-20 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
              </div>
              <span className="text-xl font-semibold tracking-tight text-foreground">My Workspace</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Your personal digital vault
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              A quiet place for your <br className="hidden md:block"/> important files.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl font-light">
              Like a well-organized filing cabinet inside a beautiful modern home. 
              Nothing cluttered, nothing anxious. Always there when you need it.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8 h-14 rounded-xl">Open Your Vault</Button>
              </Link>
            </div>
          </main>
        </div>
      </Show>
    </>
  );
}