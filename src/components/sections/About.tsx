export function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">About</h2>
            <div className="h-1 w-12 rounded-full bg-primary" />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              I&apos;m an AI Engineer with hands-on experience in prompt
              engineering, AI product development, and building workflows for
              specialized industries.
            </p>
            <p>
              I&apos;m passionate about making AI practical and accessible in
              high-stakes domains like healthcare, where precision and trust
              matter most.
            </p>
            <p>
              Currently a Computer Science student at Georgia State University
              graduating in 2026, I&apos;m seeking opportunities to deepen my
              impact at the intersection of AI and operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
