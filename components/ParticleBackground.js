"use client";

import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-10"
      options={{
        fullScreen: {
          enable: false,
        },
        background: {
          color: {
            value: "#020617",
          },
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 120,
            density: {
              enable: true,
            },
          },
          color: {
            value: "#60a5fa",
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.50,
          },
          size: {
            value: { min: 1, max: 4 },
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            outModes: {
              default: "out",
            },
          },
          links: {
            enable: true,
            distance: 140,
            color: "#3b82f6",
            opacity: 0.12,
            width: 1,
          },
        },
        detectRetina: true,
      }}
    />
  );
}