import { MagicCard } from "@/components/ui/magic-card"
import { ExternalLink } from "lucide-react"

const projects = [
  {
    name: "MARTAConnect",
    tagline: "Full-Stack Transit & Ticketing App",
    description:
      "Built RESTful APIs and microservices for authentication, pass purchasing, and real-time availability. Modeled enterprise-grade data from 200+ user reviews into scalable product features.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    href: null,
  },
  {
    name: "Real-Time CV Platform",
    tagline: "Computer Vision Web App",
    description:
      "Containerized platform consolidating 8 independent CV pipelines into a microservices architecture. Integrated LLM and GenAI tools including SAM segmentation, MediaPipe, and secure face authentication.",
    stack: ["Python", "Flask", "OpenCV", "MediaPipe", "PyTorch", "Docker"],
    href: null,
  },
  {
    name: "News Categorizer",
    tagline: "NLP & LLM Pipeline",
    description:
      "Fine-tuned BERT end-to-end achieving 94.2% accuracy — a 6%+ gain over traditional models. Benchmarked 6 classifiers across 4 NLP feature extraction methods.",
    stack: ["Python", "BERT", "Hugging Face", "TF-IDF", "Scikit-learn"],
    href: null,
  },
]

export function Projects() {
  return (
    <section id="projects" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Projects</h2>
        <p className="mb-12 text-muted-foreground">
          A selection of things I&apos;ve built.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <MagicCard
              key={project.name}
              className="cursor-default rounded-xl p-6"
              gradientColor="#3b0764"
              gradientOpacity={0.6}
              gradientFrom="#a855f7"
              gradientTo="#7e22ce"
            >
              <div className="flex h-full flex-col gap-4">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-purple-400">
                    {project.tagline}
                  </p>
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                </div>

                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300"
                  >
                    View project <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground/50">
                    Coming soon
                  </span>
                )}
              </div>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}
