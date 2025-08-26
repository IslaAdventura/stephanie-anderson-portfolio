"use client";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import GearButton from "@/components/ui/GearButton";

// Theme Toggle Component
function ThemeToggle({
  isDark,
  setIsDark,
  isAnimating,
  setIsAnimating,
}: {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Update theme in DOM and localStorage
  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;

    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create bat geometry - responsive sizing
  const createBat = (x: number, y: number) => {
    const batGroup = new THREE.Group();
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 1.2 : 2;

    // Bat body (elongated using cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.12, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x1a0a1f });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    batGroup.add(body);

    // Bat head
    const headGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0x2d1b3d });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 0.08, 0);
    batGroup.add(head);

    // Bat ears (pointy triangles)
    const earGeometry = new THREE.ConeGeometry(0.015, 0.04, 3);
    const earMaterial = new THREE.MeshBasicMaterial({ color: 0x2d1b3d });

    const leftEar = new THREE.Mesh(earGeometry, earMaterial);
    leftEar.position.set(-0.025, 0.105, 0);
    leftEar.rotation.z = -0.3;

    const rightEar = new THREE.Mesh(earGeometry, earMaterial);
    rightEar.position.set(0.025, 0.105, 0);
    rightEar.rotation.z = 0.3;

    batGroup.add(leftEar, rightEar);

    // Larger, more bat-like wings using ellipse geometry
    const wingGeometry = new THREE.CircleGeometry(0.12, 8);
    const wingMaterial = new THREE.MeshBasicMaterial({
      color: 0x0d0514,
      transparent: true,
      opacity: 0.9,
    });

    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.1, 0.02, 0);
    leftWing.scale.set(1.5, 0.8, 1);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.1, 0.02, 0);
    rightWing.scale.set(1.5, 0.8, 1);

    batGroup.add(leftWing, rightWing);

    // Responsive scaling
    batGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    batGroup.position.set(x, y, 0);
    return batGroup;
  };

  // Create butterfly geometry - responsive sizing
  const createButterfly = (x: number, y: number) => {
    const butterflyGroup = new THREE.Group();
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.8 : 1.2;

    // Butterfly body
    const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x4a4a4a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    butterflyGroup.add(body);

    // Butterfly wings
    const wingGeometry = new THREE.CircleGeometry(0.06, 8);
    const wingMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffd700, opacity: 1 }),
      new THREE.MeshBasicMaterial({ color: 0xff69b4, opacity: 1 }),
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, opacity: 1 }),
      new THREE.MeshBasicMaterial({ color: 0xffa500, opacity: 1 }),
    ];

    const wingMaterial =
      wingMaterials[Math.floor(Math.random() * wingMaterials.length)];

    const topLeftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    topLeftWing.position.set(-0.05, 0.03, 0);
    topLeftWing.scale.set(1.2, 0.8, 1);

    const topRightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    topRightWing.position.set(0.05, 0.03, 0);
    topRightWing.scale.set(1.2, 0.8, 1);

    const bottomLeftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    bottomLeftWing.position.set(-0.04, -0.03, 0);
    bottomLeftWing.scale.set(0.8, 0.6, 1);

    const bottomRightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    bottomRightWing.position.set(0.04, -0.03, 0);
    bottomRightWing.scale.set(0.8, 0.6, 1);

    butterflyGroup.add(
      topLeftWing,
      topRightWing,
      bottomLeftWing,
      bottomRightWing
    );

    // Responsive scaling
    butterflyGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    butterflyGroup.position.set(x, y, 0);

    return butterflyGroup;
  };

  // Animate bats explosion
  const animateBats = (buttonRect: DOMRect) => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const bats: Array<{
      mesh: THREE.Group;
      velocity: THREE.Vector3;
      wingFlap: number;
    }> = [];
    const isMobile = window.innerWidth < 768;
    const numBats = isMobile ? 8 : 12;

    const buttonX =
      ((buttonRect.left + buttonRect.width / 2) / window.innerWidth) * 2 - 1;
    const buttonY =
      -((buttonRect.top + buttonRect.height / 2) / window.innerHeight) * 2 + 1;

    for (let i = 0; i < numBats; i++) {
      const bat = createBat(buttonX * 2.5, buttonY * 2.5);
      const angle = (i / numBats) * Math.PI * 2;
      const baseSpeed = isMobile ? 0.015 : 0.02;
      const speed = baseSpeed + Math.random() * 0.03;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + 0.01,
        (Math.random() - 0.5) * 0.01
      );

      bats.push({ mesh: bat, velocity, wingFlap: 0 });
      sceneRef.current.add(bat);
    }

    let frame = 0;
    const animate = () => {
      frame++;

      bats.forEach((bat, index) => {
        // Update position
        bat.mesh.position.add(bat.velocity);

        // Wing flapping animation
        bat.wingFlap += 0.3;
        const flapAmount = Math.sin(bat.wingFlap) * 0.4;
        if (bat.mesh.children.length >= 6) {
          const leftWing = bat.mesh.children[4];
          const rightWing = bat.mesh.children[5];
          leftWing.rotation.z = flapAmount;
          rightWing.rotation.z = -flapAmount;
        }

        // Gravity and air resistance
        bat.velocity.y -= 0.0005;
        bat.velocity.multiplyScalar(0.995);

        // Remove when far away
        if (bat.mesh.position.length() > 10) {
          sceneRef.current?.remove(bat.mesh);
          bats.splice(index, 1);
        }
      });

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);

      if (bats.length > 0 && frame < 600) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  // Animate butterflies gentle flight
  const animateButterflies = (buttonRect: DOMRect) => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    const butterflies: Array<{
      mesh: THREE.Group;
      velocity: THREE.Vector3;
      flutter: number;
      age: number;
    }> = [];
    const isMobile = window.innerWidth < 768;
    const numButterflies = isMobile ? 12 : 8;

    const buttonX =
      ((buttonRect.left + buttonRect.width / 2) / window.innerWidth) * 2 - 1;
    const buttonY =
      -((buttonRect.top + buttonRect.height / 2) / window.innerHeight) * 2 + 1;

    for (let i = 0; i < numButterflies; i++) {
      const butterfly = createButterfly(buttonX * 2.5, buttonY * 2.5);
      const angle = (i / numButterflies) * Math.PI * 2 + Math.random() * 0.5;
      const baseSpeed = isMobile ? 0.006 : 0.008;
      const speed = baseSpeed + Math.random() * 0.012;

      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed + 0.015,
        (Math.random() - 0.5) * 0.005
      );

      butterflies.push({
        mesh: butterfly,
        velocity,
        flutter: Math.random() * Math.PI,
        age: 0,
      });
      sceneRef.current.add(butterfly);
    }

    let frame = 0;
    const animate = () => {
      frame++;

      butterflies.forEach((butterfly, index) => {
        butterfly.age++;

        // Gentle floating motion
        butterfly.flutter += 0.08;
        butterfly.velocity.x += Math.sin(butterfly.flutter) * 0.0002;
        butterfly.velocity.y += Math.cos(butterfly.flutter * 1.3) * 0.0003;

        butterfly.mesh.position.add(butterfly.velocity);

        // Wing fluttering
        const flutterAmount = Math.sin(butterfly.flutter * 3) * 0.1;
        butterfly.mesh.rotation.z = flutterAmount;

        // Gentle fade and slow down
        butterfly.velocity.multiplyScalar(0.998);
        if (butterfly.age > 200) {
          butterfly.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const material = child.material as THREE.MeshBasicMaterial;
              material.transparent = true;
              material.opacity = Math.max(0, material.opacity - 0.01);
            }
          });
        }

        // Remove when faded or far away
        if (butterfly.mesh.position.length() > 8 || butterfly.age > 400) {
          sceneRef.current?.remove(butterfly.mesh);
          butterflies.splice(index, 1);
        }
      });

      rendererRef.current?.render(sceneRef.current!, cameraRef.current!);

      if (butterflies.length > 0 && frame < 800) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);

    const buttonRect = e.currentTarget.getBoundingClientRect();

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }

    setTimeout(() => {
      if (newTheme) {
        animateBats(buttonRect);
      } else {
        animateButterflies(buttonRect);
      }
    }, 50);
  };

  return (
    <>
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ zIndex: 10 }}
      />

      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30">
        <GearButton
          isDark={isDark}
          isAnimating={isAnimating}
          onClick={handleToggle}
        />
      </div>
    </>
  );
}

// Hero Section Component
function HeroSection({ isDark }: { isDark: boolean }) {
  return (
    <section
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-amber-950 to-red-950"
          : "bg-gradient-to-b from-amber-50 to-orange-50"
      }`}
    >
      <div className="relative z-20 p-4 sm:p-6 lg:p-8">
        <main className="max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1
              className={`
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
              font-bold mb-2 sm:mb-4 transition-colors leading-tight
              ${isDark ? "text-white" : "text-gray-900"}
            `}
            >
              Stephanie Anderson
            </h1>
            <p
              className={`
              text-lg sm:text-xl md:text-2xl lg:text-3xl 
              mb-4 sm:mb-6 lg:mb-8 transition-colors
              ${isDark ? "text-purple-300" : "text-blue-600"}
            `}
            >
              Junior Developer
            </p>
          </div>

          <div
            className={`
            p-4 sm:p-6 lg:p-8 rounded-xl transition-all duration-500 
            max-w-4xl mx-auto
            ${
              isDark
                ? "bg-gray-800 text-gray-200 shadow-2xl border border-gray-700"
                : "bg-white text-gray-800 shadow-lg"
            }
          `}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
              Welcome to My Victorian Workshop
            </h2>
            <p className="text-base sm:text-lg mb-3 sm:mb-4 leading-relaxed">
              Step into a world where steam-powered innovation meets modern web
              development.
            </p>
            <p
              className={`
              text-sm sm:text-base leading-relaxed
              ${isDark ? "text-gray-400" : "text-gray-600"}
            `}
            >
              Scroll down to explore my mechanical marvels and digital
              contraptions.
            </p>
          </div>
        </main>
      </div>
    </section>
  );
}

// Steampunk Projects Section Component
function SteampunkProjectsSection({ isDark }: { isDark: boolean }) {
  const projects = [
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

  return (
    <>
      {/* Inject CSS */}
      <style jsx>{`
        /* STEAMPUNK COLORS */
        :root {
          --steampunk-copper: #8b4513;
          --steampunk-brass: #cd853f;
          --steampunk-border: #8b4513;
          --font-great-vibes: "Great Vibes", cursive;
          --font-playfair: "Playfair Display", serif;
        }

        /* Individual brass corner bolts */
        .brass-bolt {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #ffd700 0%,
            #b8860b 60%,
            #8b4513 100%
          );
          border: 1px solid #654321;
          box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.3),
            inset -1px -1px 2px rgba(0, 0, 0, 0.5),
            0 0 3px rgba(255, 215, 0, 0.4);
          z-index: 10;
        }

        .bolt-top-left {
          top: 8px;
          left: 8px;
        }
        .bolt-top-right {
          top: 8px;
          right: 8px;
        }
        .bolt-bottom-left {
          bottom: 8px;
          left: 8px;
        }
        .bolt-bottom-right {
          bottom: 8px;
          right: 8px;
        }

        /* Light mode steampunk base */
        .steampunk-base-light {
          background: linear-gradient(135deg, #faf7f0 0%, #f5f5dc 100%);
          border: 4px solid #4a4a4a;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15),
            0 0 15px rgba(74, 74, 74, 0.3);
        }

        .steampunk-base-light::before {
          content: "";
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          height: 30%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 100%
          );
          border-radius: 10px;
          pointer-events: none;
          z-index: 1;
        }

        /* Dark mode steampunk base */
        .steampunk-base-dark {
          background: linear-gradient(135deg, #2d1810 0%, #3c1810 100%);
          border: 4px solid var(--steampunk-copper);
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(139, 69, 19, 0.4);
        }

        .steampunk-base-dark::before {
          content: "";
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          height: 30%;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.08) 0%,
            transparent 100%
          );
          border-radius: 10px;
          pointer-events: none;
          z-index: 1;
        }

        /* Featured project special border */
        .featured-border {
          border-color: #c0c0c0 !important;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.15),
            0 0 20px rgba(192, 192, 192, 0.6) !important;
        }

        /* Hover effects */
        .project-card:hover {
          transform: translateY(-4px);
          transition: all 0.3s ease;
        }

        .project-card:hover .steampunk-base-light,
        .project-card:hover .steampunk-base-dark {
          box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.9),
            0 0 25px rgba(139, 69, 19, 0.6);
        }
      `}</style>

      <section
        className={`py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-b from-amber-950 to-red-950"
            : "bg-gradient-to-b from-amber-50 to-orange-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2
              className={`
              text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-colors
              ${isDark ? "text-amber-100" : "text-gray-900"}
            `}
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Mechanical Marvels
            </h2>
            <p
              className={`
              text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed
              ${isDark ? "text-amber-200" : "text-gray-700"}
            `}
            >
              A collection of steam-powered applications and clockwork
              contraptions, crafted with modern web technologies and Victorian
              sensibilities
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card group cursor-pointer"
              >
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
                      <span className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold border border-gray-800">
                        FEATURED CONTRAPTION
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 h-full flex flex-col">
                    {/* Project Image */}
                    <div className="relative mb-4 overflow-hidden rounded-lg border-2 border-amber-700">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Project Title */}
                    <h3
                      className={`
                      text-xl font-bold mb-3 leading-tight
                      ${isDark ? "text-amber-100" : "text-gray-900"}
                    `}
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p
                      className={`
                      text-sm leading-relaxed mb-4 flex-grow
                      ${isDark ? "text-amber-200" : "text-gray-700"}
                    `}
                    >
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className={`
                          px-2 py-1 rounded text-xs font-medium border
                          ${
                            isDark
                              ? "bg-amber-900/50 text-amber-200 border-amber-700"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }
                        `}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <a
                        href={project.live}
                        className={`
                        flex-1 text-center py-2 px-4 rounded-lg font-medium text-sm
                        border-2 transition-all duration-200
                        ${
                          isDark
                            ? "bg-amber-700 hover:bg-amber-600 text-amber-100 border-amber-600 hover:border-amber-500"
                            : "bg-gray-800 hover:bg-black text-white border-gray-700 hover:border-black"
                        }
                      `}
                      >
                        View Project
                      </a>
                      <a
                        href={project.github}
                        className={`
                        flex-1 text-center py-2 px-4 rounded-lg font-medium text-sm
                        border-2 transition-all duration-200
                        ${
                          isDark
                            ? "border-amber-600 text-amber-200 hover:bg-amber-900/30"
                            : "border-gray-400 text-gray-700 hover:bg-gray-100"
                        }
                      `}
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
    </>
  );
}

// Main Page Component
export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
  }, []);

  return (
    <>
      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
      />
      <HeroSection isDark={isDark} />
      <SteampunkProjectsSection isDark={isDark} />
    </>
  );
}
