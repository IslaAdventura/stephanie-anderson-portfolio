"use client";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimatedThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const animationIdRef = useRef<number>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

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

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    camera.position.z = 5;

    mountRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Create bat geometry
  const createBat = (x: number, y: number) => {
    const batGroup = new THREE.Group();

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
    leftWing.scale.set(1.5, 0.8, 1); // Make it more wing-like

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0.1, 0.02, 0);
    rightWing.scale.set(1.5, 0.8, 1);

    batGroup.add(leftWing, rightWing);

    // Scale the entire bat to make it bigger
    batGroup.scale.set(2, 2, 2);
    batGroup.position.set(x, y, 0);
    return batGroup;
  };

  // Create butterfly geometry
  const createButterfly = (x: number, y: number) => {
    const butterflyGroup = new THREE.Group();

    // Butterfly body
    const bodyGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x4a4a4a });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    butterflyGroup.add(body);

    // Butterfly wings
    const wingGeometry = new THREE.CircleGeometry(0.06, 8);
    const wingMaterials = [
      new THREE.MeshBasicMaterial({ color: 0xffd700, opacity: 1 }), // Gold
      new THREE.MeshBasicMaterial({ color: 0xff69b4, opacity: 1 }), // Pink
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, opacity: 1 }), // Sky blue
      new THREE.MeshBasicMaterial({ color: 0xffa500, opacity: 1 }), // Orange
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
    const numBats = 12;

    // Convert button position to Three.js coordinates
    const buttonX =
      ((buttonRect.left + buttonRect.width / 2) / window.innerWidth) * 2 - 1;
    const buttonY =
      -((buttonRect.top + buttonRect.height / 2) / window.innerHeight) * 2 + 1;

    for (let i = 0; i < numBats; i++) {
      const bat = createBat(buttonX * 2.5, buttonY * 2.5);
      const angle = (i / numBats) * Math.PI * 2;
      const speed = 0.02 + Math.random() * 0.03;

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
          // Animate the wing membranes (last two children)
          const leftWing = bat.mesh.children[4]; // Left wing
          const rightWing = bat.mesh.children[5]; // Right wing
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
    const numButterflies = 8;

    const buttonX =
      ((buttonRect.left + buttonRect.width / 2) / window.innerWidth) * 2 - 1;
    const buttonY =
      -((buttonRect.top + buttonRect.height / 2) / window.innerHeight) * 2 + 1;

    for (let i = 0; i < numButterflies; i++) {
      const butterfly = createButterfly(buttonX * 2.5, buttonY * 2.5);
      const angle = (i / numButterflies) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 0.008 + Math.random() * 0.012;

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
          // Handle material fading
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

    // Get button position
    const buttonRect = e.currentTarget.getBoundingClientRect();

    // Cancel any existing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    // Clear existing objects
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }

    // Trigger appropriate animation
    setTimeout(() => {
      if (newTheme) {
        animateBats(buttonRect);
      } else {
        animateButterflies(buttonRect);
      }
    }, 50);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-gray-900" : "bg-blue-50"
      }`}
    >
      {/* Three.js Canvas - Positioned absolutely to overlay everything */}
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none z-10"
        style={{ zIndex: 10 }}
      />

      {/* Main Content */}
      <div className="relative z-20 p-8">
        {/* Theme Toggle Button */}
        <div className="fixed top-6 right-6 z-30">
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            className={`
              relative px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg
              ${
                isDark
                  ? "bg-purple-900 text-yellow-100 hover:bg-purple-800 border-2 border-purple-700"
                  : "bg-yellow-400 text-gray-900 hover:bg-yellow-300 border-2 border-yellow-500"
              }
              ${isAnimating ? "scale-110" : "hover:scale-105"}
            `}
          >
            {isDark ? "🦋 Switch to Light" : "🦇 Switch to Dark"}
          </button>
        </div>

        {/* Sample Content */}
        <main className="max-w-4xl mx-auto pt-20">
          <h1
            className={`text-5xl font-bold mb-4 transition-colors ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Stephanie Anderson
          </h1>
          <p
            className={`text-2xl mb-8 transition-colors ${
              isDark ? "text-purple-300" : "text-blue-600"
            }`}
          >
            Junior Developer
          </p>

          <div
            className={`p-8 rounded-xl transition-all duration-500 ${
              isDark
                ? "bg-gray-800 text-gray-200 shadow-2xl border border-gray-700"
                : "bg-white text-gray-800 shadow-lg"
            }`}
          >
            <h2 className="text-3xl font-semibold mb-4">Theme Toggle Demo</h2>
            <p className="text-lg mb-4">
              Click the theme toggle button to see the magic happen!
              {isDark
                ? " Bats will dramatically explode from the button."
                : " Gentle butterflies will float away."}
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              This demo uses Three.js for smooth 3D animations and manual theme
              switching.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
