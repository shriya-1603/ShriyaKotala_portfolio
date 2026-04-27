"use client"

import { SparklesText } from "@/components/ui/sparkles-text"
import { TypingAnimation } from "@/components/ui/typing-animation"

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          CS @ Georgia State University &middot; Class of 2026
        </p>

        <SparklesText
          className="text-5xl font-bold md:text-7xl"
          colors={{ first: "#a855f7", second: "#d8b4fe" }}
          sparklesCount={8}
        >
          Shriya Kotala
        </SparklesText>

        <TypingAnimation
          className="text-lg text-muted-foreground md:text-xl"
          duration={40}
        >
          AI Engineer · Building practical AI for high-stakes domains
        </TypingAnimation>

        <div className="flex items-center justify-center gap-6 pt-4">
          <a
            href="#projects"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Get in touch →
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce">
        <svg
          className="h-5 w-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  )
}
