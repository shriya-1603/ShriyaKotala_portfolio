import { Nav } from "@/components/Nav"
import { Hero } from "@/components/sections/Hero"
import { Projects } from "@/components/sections/Projects"
import { About } from "@/components/sections/About"
import { Contact } from "@/components/sections/Contact"

export default function Page() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shriya Kotala
      </footer>
    </>
  )
}
