"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import GearButton from "@/components/ui/GearButton";

interface ThemeToggleProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}

export default function ThemeToggle({
  isDark,
  setIsDark,
  isAnimating,
  setIsAnimating,
}: ThemeToggleProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Update theme in DOM and localStorage
  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.className = "theme-dark";
    } else {
      document.documentElement.className = "theme-light";
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
