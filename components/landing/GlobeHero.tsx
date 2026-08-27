'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeHeroProps {
  scrollProgress?: number; // 0 to 1 across full landing page
  compact?: boolean;
}

export function GlobeHero({ scrollProgress = 0, compact = false }: GlobeHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef<number>(0);
  const currentScrollRotRef = useRef<number>(0);
  const [webglActive, setWebglActive] = useState<boolean>(true);

  // Update target rotation directly from scrollProgress
  useEffect(() => {
    targetRotationRef.current = scrollProgress * Math.PI * 2.2;
  }, [scrollProgress]);

  // Three.js WebGL initialization
  useEffect(() => {
    const container = containerRef.current;
    const canvas = webglCanvasRef.current;
    if (!container || !canvas || !webglActive) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number;

    try {
      // 1. WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'default',
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // 2. Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = compact ? 2.8 : 2.45;
      camera.position.y = 0.05;

      // 3. Globe Parent Group (14-degree axial tilt)
      const globeGroup = new THREE.Group();
      globeGroup.rotation.x = 0.24;
      scene.add(globeGroup);
      globeGroupRef.current = globeGroup;

      // Textures
      const textureLoader = new THREE.TextureLoader();
      const dayMap = textureLoader.load('/textures/earth_day.jpg');
      const nightLightsMap = textureLoader.load('/textures/earth_lights.png');
      const specularMap = textureLoader.load('/textures/earth_specular.jpg');
      const cloudsMap = textureLoader.load('/textures/earth_clouds.png');

      // 4. Earth Surface (Day + Emissive Night Lights)
      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        map: dayMap,
        roughnessMap: specularMap,
        roughness: 0.75,
        metalness: 0.15,
        emissiveMap: nightLightsMap,
        emissive: new THREE.Color(0xffeedd),
        emissiveIntensity: 1.2,
      });
      const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
      globeGroup.add(earthMesh);

      // 5. Nested Cloud Layer Sphere
      const cloudGeometry = new THREE.SphereGeometry(1.018, 48, 48);
      const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudsMap,
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
      });
      const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      globeGroup.add(cloudMesh);

      // 6. Atmospheric Rim (Fresnel Limb Scattering)
      const atmoGeometry = new THREE.SphereGeometry(1.09, 48, 48);
      const atmoMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
            gl_FragColor = vec4(0.22, 0.68, 0.98, 1.0) * intensity * 0.48;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
      globeGroup.add(atmoMesh);

      // 7. Sparse Cosmos Starfield Background
      const starCount = 350;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 24;
        starPositions[i + 1] = (Math.random() - 0.5) * 24;
        starPositions[i + 2] = -3 - Math.random() * 12;
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({
        color: 0x94a3b8,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
      });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // 8. Multiple Realistic Satellites as Subtle Star-Like Glints
      const satellites: Array<{
        group: THREE.Group;
        mesh: THREE.Mesh;
        radius: number;
        speed: number;
        angle: number;
      }> = [];

      const satConfigs = [
        { radius: 1.35, inclinationX: 0.72, inclinationY: 0.15, speed: 0.0035, size: 0.012 },
        { radius: 1.45, inclinationX: -0.68, inclinationY: -0.28, speed: 0.0028, size: 0.010 },
        { radius: 1.55, inclinationX: 0.38, inclinationY: 0.65, speed: 0.0042, size: 0.011 },
        { radius: 1.62, inclinationX: -0.22, inclinationY: 0.45, speed: 0.0022, size: 0.009 },
      ];

      satConfigs.forEach((cfg) => {
        const satOrbitGroup = new THREE.Group();
        satOrbitGroup.rotation.x = cfg.inclinationX;
        satOrbitGroup.rotation.y = cfg.inclinationY;
        globeGroup.add(satOrbitGroup);

        const dotGeo = new THREE.SphereGeometry(cfg.size, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({
          color: 0xf8fafc,
          transparent: true,
          opacity: 0.85,
        });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        satOrbitGroup.add(dotMesh);

        satellites.push({
          group: satOrbitGroup,
          mesh: dotMesh,
          radius: cfg.radius,
          speed: cfg.speed,
          angle: Math.random() * Math.PI * 2,
        });
      });

      // 9. Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
      sunLight.position.set(4, 2, 3);
      scene.add(sunLight);

      // 10. Animation Loop: Blended Base Autorotation + Scroll Interpolation
      let baseAngle = 0;

      const animate = () => {
        baseAngle += 0.0006;
        currentScrollRotRef.current +=
          (targetRotationRef.current - currentScrollRotRef.current) * 0.08;

        const totalRotation = baseAngle + currentScrollRotRef.current;

        earthMesh.rotation.y = totalRotation;
        cloudMesh.rotation.y = totalRotation * 1.04;

        satellites.forEach((sat) => {
          sat.angle += sat.speed;
          sat.mesh.position.x = sat.radius * Math.cos(sat.angle);
          sat.mesh.position.y = sat.radius * Math.sin(sat.angle);
        });

        if (renderer) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('Three.js WebGL error, switching to Canvas 2D fallback:', err);
      setWebglActive(false);
    }
  }, [webglActive, compact]);

  // 2D Canvas Fallback
  useEffect(() => {
    if (webglActive) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let baseAngle2D = 0;

    const handleResize2D = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize2D();
    window.addEventListener('resize', handleResize2D);

    const render2D = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const radius = Math.min(width, height) * (compact ? 0.35 : 0.42);

      baseAngle2D += 0.0006;
      currentScrollRotRef.current +=
        (targetRotationRef.current - currentScrollRotRef.current) * 0.08;
      const rot = baseAngle2D + currentScrollRotRef.current;

      // Atmosphere Rim
      const atmoGlow = ctx.createRadialGradient(
        centerX, centerY, radius * 0.95,
        centerX, centerY, radius * 1.15
      );
      atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      atmoGlow.addColorStop(0.5, 'rgba(30, 58, 138, 0.04)');
      atmoGlow.addColorStop(1, 'rgba(7, 17, 31, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = atmoGlow;
      ctx.fill();

      // Earth body
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1,
        centerX, centerY, radius
      );
      globeGrad.addColorStop(0, '#0B1728');
      globeGrad.addColorStop(0.6, '#08101E');
      globeGrad.addColorStop(1, '#050A14');

      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Continents with night lights
      const continents = [
        { lat: 20, lng: 78, scale: 0.8 },
        { lat: 45, lng: 20, scale: 0.9 },
        { lat: 0, lng: 25, scale: 0.8 },
        { lat: -25, lng: 135, scale: 0.65 },
        { lat: 35, lng: -100, scale: 0.9 },
        { lat: -15, lng: -60, scale: 0.75 },
      ];

      continents.forEach((cont) => {
        const radLng = ((cont.lng + rot * 50) * Math.PI) / 180;
        const radLat = (cont.lat * Math.PI) / 180;
        const x = centerX + radius * Math.cos(radLat) * Math.sin(radLng) * 0.85;
        const y = centerY - radius * Math.sin(radLat) * 0.78;
        const visible = Math.cos(radLng) > -0.25;

        if (visible) {
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.28 * cont.scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(148, 163, 184, 0.1)';
          ctx.fill();

          ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Shadow terminator
      const terminator = ctx.createLinearGradient(
        centerX - radius, centerY - radius * 0.5,
        centerX + radius * 0.8, centerY + radius * 0.7
      );
      terminator.addColorStop(0, 'rgba(56, 189, 248, 0.04)');
      terminator.addColorStop(0.5, 'rgba(5, 10, 20, 0.45)');
      terminator.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
      ctx.fillStyle = terminator;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render2D);
    };

    render2D();

    return () => {
      window.removeEventListener('resize', handleResize2D);
      cancelAnimationFrame(animationFrameId);
    };
  }, [webglActive, compact]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Pure 3D Earth Backdrop Canvas */}
      {webglActive ? (
        <canvas
          ref={webglCanvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <canvas
          ref={fallbackCanvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      )}
    </div>
  );
}
