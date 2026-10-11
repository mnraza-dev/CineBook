import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Decorative cinema atmosphere; the poster remains visible without WebGL. */
export default function CinemaScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 8;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(180 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 18;
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xf5ec9b, size: 0.035, transparent: true, opacity: 0.65 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateAnimation = () => {
      renderer.setAnimationLoop(motion.matches ? null : (time) => {
        particles.rotation.y = time * 0.000025;
        renderer.render(scene, camera);
      });
      renderer.render(scene, camera);
    };
    motion.addEventListener("change", updateAnimation);
    updateAnimation();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateAnimation);
      renderer.setAnimationLoop(null);
      geometry.dispose(); material.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} aria-hidden="true" className="pointer-events-none absolute inset-0" />;
}
