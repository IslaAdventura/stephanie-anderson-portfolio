// Define project type
interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  live: string;
  github: string;
  featured?: boolean;
}

interface ProjectsSectionProps {
  isDark: boolean;
}

// Project data - can be moved to a separate file later
const projects: Project[] = [
  {
    id: 1,
    title: "Steampunk Developer Portfolio",
    description:
      "This very portfolio you're viewing! Built with Next.js, Three.js steampunk animations, and Victorian-era industrial design. Features animated theme toggle with bats and butterflies.",
    tech: ["Next.js", "Three.js", "Tailwind CSS", "TypeScript"],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Industrial Task Manager",
    description:
      "Steam-powered productivity application with mechanical interface elements and brass-themed user experience design.",
    tech: ["React", "Node.js", "MongoDB", "Socket.io"],
    image:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Clockwork E-Commerce",
    description:
      "Victorian-era inspired online marketplace with mechanical product displays and steam-driven checkout process.",
    tech: ["Vue.js", "Express", "Stripe", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Brass Weather Station",
    description:
      "Antique barometer-style weather application with mechanical gauge displays and copper-toned interface elements.",
    tech: ["JavaScript", "Weather API", "Chart.js", "CSS3"],
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: 5,
    title: "Telegraph Chat System",
    description:
      "Real-time messaging platform designed like a Victorian telegraph system with morse code animations and vintage typography.",
    tech: ["React", "Firebase", "WebRTC", "Framer Motion"],
    image:
      "https://images.unsplash.com/photo-1520637836862-4d197d17c68a?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
  },
  {
    id: 6,
    title: "Mechanical Blog Engine",
    description:
      "Content management system with gear-driven navigation and steam-powered publishing workflow for technical writing.",
    tech: ["Gatsby", "GraphQL", "Netlify CMS", "Styled Components"],
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=300&fit=crop",
    live: "#",
    github: "#",
  },
];

export default function ProjectsSection({ isDark }: ProjectsSectionProps) {
  return (
    <section className="projects-section py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="steampunk-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-colors">
            Mechanical Marvels
          </h2>
          <p className="projects-description text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            A collection of steam-powered applications and clockwork
            contraptions, crafted with modern web technologies and Victorian
            sensibilities
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="project-card group cursor-pointer">
              <div
                className={`
                  ${isDark ? "steampunk-base-dark" : "steampunk-base-light"}
                  ${project.featured ? "featured-border" : ""}
                  p-6 h-full flex flex-col
                `}
              >
                {/* Brass Bolts */}
                <div className="brass-bolt bolt-top-left"></div>
                <div className="brass-bolt bolt-top-right"></div>
                <div className="brass-bolt bolt-bottom-left"></div>
                <div className="brass-bolt bolt-bottom-right"></div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="featured-badge px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED CONTRAPTION
                    </span>
                  </div>
                )}

                <div className="relative z-10 h-full flex flex-col">
                  {/* Project Image */}
                  <div className="project-image-container relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Project Title */}
                  <h3 className="project-title steampunk-heading text-xl font-bold mb-3 leading-tight transition-colors">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="project-description text-sm leading-relaxed mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="tech-tag px-2 py-1 rounded text-xs font-medium border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <a
                      href={project.live}
                      className="copper-button flex-1 text-center py-2 px-4 rounded-lg font-medium text-sm border-2 transition-all duration-200"
                    >
                      View Project
                    </a>
                    <a
                      href={project.github}
                      className="copper-button-secondary flex-1 text-center py-2 px-4 rounded-lg font-medium text-sm border-2 transition-all duration-200"
                    >
                      View Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
