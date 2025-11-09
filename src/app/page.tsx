"use client";
import TerminalOverlay from "@/Components/TerminalOverlay";
import { Button } from "@/Components/ui/button";
import UserPrograms from "@/Components/UserPrograms";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AuthPage from "@/AuthPage";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase-config"; // 👈 Make sure you export `auth` from firebase-config
import Image from "next/image";

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase login state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-primary">
        Checking authentication...
      </div>
    );
  }

  // 🧠 If no user is logged in → show AuthPage
  if (!user) {
    return <AuthPage />;
  }

  // ✅ If user is logged in → show main homepage
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section
        className="relative z-10 py-24 flex-grow"
        aria-labelledby="hero-heading"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Corner Decoration */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2 border-primary" />

            {/* Left-Side Content */}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1
                id="hero-heading"
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
              >
                <div>
                  <span className="text-foreground">Unlock Your Potential</span>
                </div>
                <div>
                  <span className="text-primary">with NutriFit</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">
                    Your AI-Technology Path to
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-primary">
                    Strength, Health, and Transformation.
                  </span>
                </div>
              </h1>

              {/* Separator Line */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

              <p className="text-xl text-muted-foreground w-2/3 leading-relaxed">
                Talk to our AI assistant and get diet plans and workout routines
                just for you.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-10 py-6 font-mono">
                <div className="flex flex-col">
                  <div className="text-2xl text-primary font-semibold">500+</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="flex flex-col">
                  <div className="text-2xl text-primary font-semibold">3min</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Generation Time
                  </div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="flex flex-col">
                  <div className="text-2xl text-primary font-semibold">100%</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Personalized
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                >
                  <Link
                    href="/generate-program"
                    className="flex items-center font-mono"
                  >
                    Build Your Program
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right-Side Content */}
            <div className="lg:col-span-5 relative">
              {/* Corner Pieces */}
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
              </div>

              {/* Image Container */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black shadow-2xl">
                  <Image
                    src="/AI.png"
                    alt="AI Fitness Coach Illustration"
                    className="size-full object-cover object-center"
                    loading="lazy"
                  />

                  {/* Scan Line Animation */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none opacity-70" />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>

                {/* Terminal Overlay */}
                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>

      <UserPrograms />
    </div>
  );
};

export default HomePage;
