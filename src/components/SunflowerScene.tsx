import { useEffect, useRef, useState } from "react";
import { SunflowerLogo } from "./SunflowerLogo";

type Props = {
  className?: string;
};

export function SunflowerScene({ className = "" }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function boot() {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const host = mountRef.current;
      const width = host.clientWidth || 320;
      const height = host.clientHeight || 320;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 5.2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);

      const flower = new THREE.Group();
      scene.add(flower);

      const petalGeo = new THREE.SphereGeometry(0.28, 18, 14);
      petalGeo.scale(1, 2.35, 0.42);
      const petalMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("oklch(0.8 0.14 88)"),
        roughness: 0.55,
        metalness: 0.05,
      });

      const petalCount = 16;
      for (let i = 0; i < petalCount; i++) {
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const angle = (i / petalCount) * Math.PI * 2;
        petal.position.set(Math.sin(angle) * 1.15, Math.cos(angle) * 1.15, 0);
        petal.rotation.z = -angle;
        petal.rotation.x = 0.18;
        flower.add(petal);
      }

      const center = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 28, 28),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color("oklch(0.32 0.08 55)"),
          roughness: 0.85,
          metalness: 0.08,
        }),
      );
      flower.add(center);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 20),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color("oklch(0.22 0.05 45)"),
          roughness: 0.9,
        }),
      );
      core.position.z = 0.18;
      flower.add(core);

      const ambient = new THREE.AmbientLight(0xfff4e0, 0.85);
      const key = new THREE.DirectionalLight(0xffe2a8, 1.15);
      key.position.set(2.5, 3, 4);
      const fill = new THREE.DirectionalLight(0xd8e8d0, 0.45);
      fill.position.set(-3, -1, 2);
      scene.add(ambient, key, fill);

      const onResize = () => {
        if (!renderer || !mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(host);

      const clock = new THREE.Clock();
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        flower.rotation.z = t * 0.18;
        flower.rotation.y = Math.sin(t * 0.35) * 0.22;
        flower.rotation.x = Math.cos(t * 0.28) * 0.1;
        flower.position.y = Math.sin(t * 0.9) * 0.05;
        renderer?.render(scene, camera);
      };

      setUse3d(true);
      animate();
    }

    boot();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {!use3d && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SunflowerLogo size={200} className="sunflower-spin opacity-95" />
        </div>
      )}
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
