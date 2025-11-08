"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Dumbbell, Home, LibraryBig, Panda, PhoneCall, Store, User } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200" aria-label="NutriFit.AI Home">
          <div className="p-1 bg-primary/10 rounded">
            <Panda className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg">
            Nutri<span className="text-primary">Fit</span>.AI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5">
          {isSignedIn ? (
            <>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="Go to Home"
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="Generate Diet Plans"
              >
                <Dumbbell size={16} />
                <span>Diet Plans</span>
              </Link>
              <Link
                href="/Profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="View Profile"
              >
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Link
                href="/AboutUs"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="Diet Information"
              >
                <LibraryBig size={16} />
                <span>Diet Info</span>
              </Link>
              <Link
                href="/Store"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="Diet Information"
              >
                <Store size={16} />
                <span>Shop</span>
              </Link>
              <Link
                href="/Contact_Us"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors duration-200"
                aria-label="Contact Us"
              >
                <PhoneCall size={16} />
                <span>Contact</span>
              </Link>
              <Button
                asChild
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <Link href="/generate-program" aria-label="Get Started with Program Generation">
                  Get Started
                </Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton>
                <Button variant="outline" className="hover:bg-primary/10 transition-colors duration-200">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="hover:bg-primary/90 transition-colors duration-200">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
