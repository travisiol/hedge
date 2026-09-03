"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/**
 * The hero object: a chromed arrow monolith falling through red rain.
 *
 * Everything here is generated in code. No HDR file, no GLTF, no texture
 * ships with this site — the environment the chrome reflects is a canvas
 * painted at runtime (see `buildEnvironment`), which is also why the chrome
 * looks lit at all. Strip that out and the arrow renders as a black
 * silhouette: on a metal surface, the reflection *is* the shading.
 *
 * Three states, in order of preference:
 *   - WebGL available, motion allowed  -> animated scene
 *   - WebGL available, reduced motion  -> one frame, rendered once, no loop
 *   - no WebGL                         -> the CSS fallback in `<Fallback/>`
 */

const RED = new THREE.Color("#ff2e1f");

/**
 * A studio, painted into an equirectangular canvas.
 *
 * Two cold vertical strips above and behind the object give chrome the long
 * specular highlights that make it read as polished metal, and a red band at
 * the horizon puts the page's one colour into the reflection instead of
 * gelling it on with a light.
 */
function buildEnvironment(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const sky = ctx.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, "#2b3242");
  sky.addColorStop(0.3, "#141922");
  sky.addColorStop(0.5, "#0a0d13");
  sky.addColorStop(0.62, "#12070a");
  sky.addColorStop(1, "#020204");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1024, 512);

  // A ceiling softbox. Without it the top faces reflect near-black and the
  // whole object reads as a silhouette with a hot rim — which is exactly
  // what the first build of this scene looked like.
  const ceiling = ctx.createLinearGradient(0, 0, 0, 150);
  ceiling.addColorStop(0, "rgba(236,242,255,0.92)");
  ceiling.addColorStop(1, "rgba(236,242,255,0)");
  ctx.fillStyle = ceiling;
  ctx.fillRect(0, 0, 1024, 150);

  // Cold key strips — the highlights that travel across the metal as it turns.
  const strip = (x: number, w: number, alpha: number) => {
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, "rgba(214,228,255,0)");
    g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    g.addColorStop(1, "rgba(214,228,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, w, 330);
  };
  strip(105, 165, 1);
  strip(430, 70, 0.62);
  strip(600, 110, 0.78);
  strip(850, 55, 0.4);

  // The red horizon. Wide and soft, so it wraps the object rather than
  // marking one spot on it.
  const horizon = ctx.createLinearGradient(0, 250, 0, 440);
  horizon.addColorStop(0, "rgba(255,46,31,0)");
  horizon.addColorStop(0.4, "rgba(255,46,31,0.42)");
  horizon.addColorStop(1, "rgba(120,12,6,0)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, 250, 1024, 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A down arrow, drawn once and extruded. Origin is its own centre. */
function buildArrow(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-0.33, 1.32);
  s.lineTo(0.33, 1.32);
  s.lineTo(0.33, -0.24);
  s.lineTo(1.02, -0.24);
  s.lineTo(0, -1.34);
  s.lineTo(-1.02, -0.24);
  s.lineTo(-0.33, -0.24);
  s.closePath();

  const geometry = new THREE.ExtrudeGeometry(s, {
    depth: 0.52,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.07,
    bevelSegments: 5,
    curveSegments: 8,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * The rain. One draw call for every streak: each is a two-vertex line whose
 * fall is computed in the vertex shader, so nothing here touches the CPU
 * once it is built.
 */
function buildRain(count: number, height: number, radius: number) {
  const position = new Float32Array(count * 2 * 3);
  const origin = new Float32Array(count * 2 * 3);
  const speed = new Float32Array(count * 2);
  const phase = new Float32Array(count * 2);
  const length = new Float32Array(count * 2);
  const bright = new Float32Array(count * 2);

  for (let i = 0; i < count; i++) {
    // Distribute in an annulus so the middle of frame stays readable.
    const angle = Math.random() * Math.PI * 2;
    const r = radius * (0.25 + 0.75 * Math.sqrt(Math.random()));
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r * 0.7 - 1.5;
    const s = 0.11 + Math.random() * 0.4;
    const p = Math.random();
    const len = 0.26 + Math.random() * 0.85;
    const b = 0.25 + Math.random() * 0.75;

    for (let v = 0; v < 2; v++) {
      const j = i * 2 + v;
      position[j * 3 + 0] = 0;
      position[j * 3 + 1] = v === 0 ? 0 : -1; // top vertex, then tail
      position[j * 3 + 2] = 0;
      origin[j * 3 + 0] = x;
      origin[j * 3 + 1] = 0;
      origin[j * 3 + 2] = z;
      speed[j] = s;
      phase[j] = p;
      length[j] = len;
      bright[j] = b;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aOrigin", new THREE.BufferAttribute(origin, 3));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  geometry.setAttribute("aLength", new THREE.BufferAttribute(length, 1));
  geometry.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uHeight: { value: height },
      uColor: { value: RED.clone() },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute vec3 aOrigin;
      attribute float aSpeed;
      attribute float aPhase;
      attribute float aLength;
      attribute float aBright;
      uniform float uTime;
      uniform float uHeight;
      varying float vFade;

      void main() {
        float t = fract(aPhase + uTime * aSpeed);
        float y = uHeight * 0.5 - t * uHeight;
        vec3 p = vec3(aOrigin.x, y + position.y * aLength, aOrigin.z);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);

        // Fade in at the top, out at the bottom, and with distance, so the
        // rain has no visible ceiling, floor or edge.
        float ends = smoothstep(0.0, 0.14, t) * (1.0 - smoothstep(0.82, 1.0, t));
        float far = 1.0 - smoothstep(6.0, 20.0, -mv.z);
        vFade = ends * far * aBright;

        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vFade;
      void main() {
        gl_FragColor = vec4(uColor, vFade * uOpacity);
      }
    `,
  });

  return { mesh: new THREE.LineSegments(geometry, material), material };
}

/**
 * Rendered on the server and left in place until a real WebGL frame is ready
 * to cover it — so this is both the no-WebGL fallback and the first paint.
 * Hidden by the render loop, not by React state.
 */
function Fallback({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="relative h-[54%] w-[34%] max-w-[280px]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--red-glow),transparent_68%)] blur-2xl" />
        <svg viewBox="0 0 120 160" className="relative h-full w-full">
          <defs>
            <linearGradient id="hedge-chrome" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f2f5fb" />
              <stop offset="0.34" stopColor="#7e8798" />
              <stop offset="0.52" stopColor="#e6ebf5" />
              <stop offset="0.72" stopColor="#3b414f" />
              <stop offset="1" stopColor="#ff2e1f" />
            </linearGradient>
          </defs>
          <path
            d="M44 8h32v78h30L60 152 14 86h30z"
            fill="url(#hedge-chrome)"
          />
        </svg>
      </div>
    </div>
  );
}

export function Storm({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const fallback = fallbackRef.current;
    if (!host) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL. The flat mark is already in the DOM; leave it there.
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const environment = buildEnvironment();
    scene.environment = environment;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.35, 8.4);

    // The arrow, and a second copy of it as a ghost trail below — the fall
    // is the product, so the object is drawn as if it were mid-fall.
    const arrowGeometry = buildArrow();
    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xdfe4ec,
      metalness: 1,
      roughness: 0.085,
      envMapIntensity: 1.9,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: 0.6,
      iridescenceIOR: 1.5,
    });
    const arrow = new THREE.Mesh(arrowGeometry, chrome);
    scene.add(arrow);

    // Set by `resize`: on a wide viewport the object moves right so the
    // headline keeps a clean column on the left; on a narrow one it recentres
    // and shrinks, because there the copy sits underneath it instead.
    const layout = { offsetX: 0, scale: 1.5 };

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff2e1f,
      metalness: 0,
      roughness: 0.28,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
    });
    const halo = new THREE.Mesh(arrowGeometry, glassMaterial);
    scene.add(halo);

    // Lights. The environment does most of the work; these two only put an
    // edge on the silhouette so it separates from the black.
    const key = new THREE.DirectionalLight(0xdbe6ff, 3.1);
    key.position.set(-4, 5, 4);
    scene.add(key);

    const rim = new THREE.PointLight(RED, 16, 22, 2);
    rim.position.set(2.6, -3.2, 1.4);
    scene.add(rim);

    const fill = new THREE.PointLight(0x9fb4d8, 9, 22, 2);
    fill.position.set(-3.4, 1.6, 3.2);
    scene.add(fill);

    const { mesh: rain, material: rainMaterial } = buildRain(1400, 26, 9);
    scene.add(rain);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      0.46, // strength
      0.5, // radius
      0.74, // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      bloom.resolution.set(w, h);

      const aspect = w / h;
      const wide = aspect >= 1.15;
      layout.offsetX = wide ? 1.35 : 0;
      layout.scale = wide ? 1.3 : 1.05;
      arrow.scale.setScalar(layout.scale);
      halo.scale.setScalar(layout.scale * 1.1);

      // The red light travels with the object, not with the frame.
      rim.position.x = layout.offsetX + 1.2;
      fill.position.x = layout.offsetX - 3.4;

      camera.aspect = aspect;
      // Pull back on narrow viewports so the arrow never crops at the tip.
      camera.position.z = wide ? 9.2 : 11.8;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Pointer parallax, in normalised device space, eased every frame.
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(host);

    const clock = new THREE.Clock();
    let frame = 0;

    const draw = (elapsed: number) => {
      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;

      arrow.rotation.y = elapsed * 0.28 + eased.x * 0.32;
      arrow.rotation.x = -0.1 + Math.sin(elapsed * 0.42) * 0.055 + eased.y * 0.1;
      arrow.position.set(
        layout.offsetX,
        Math.sin(elapsed * 0.55) * 0.16 - 0.05,
        0,
      );
      halo.rotation.copy(arrow.rotation);
      halo.position.copy(arrow.position);

      // Camera x is parallax only — the framing comes from the object's own
      // world offset, so lookAt can stay on the origin.
      camera.position.x = eased.x * 0.42;
      camera.position.y = 0.35 - eased.y * 0.26;
      camera.lookAt(0, 0, 0);

      rainMaterial.uniforms.uTime.value = elapsed;
      composer.render();

      // The flat mark is server-rendered and stays visible until there is a
      // real frame behind it, so the hero is never a black rectangle.
      if (fallback && !fallback.hidden) fallback.hidden = true;
    };

    if (reduced) {
      // One composed frame at a flattering moment, then nothing moves.
      draw(1.9);
    } else {
      const loop = () => {
        frame = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        draw(clock.getElapsedTime());
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      composer.dispose();
      bloom.dispose();
      rain.geometry.dispose();
      rainMaterial.dispose();
      arrowGeometry.dispose();
      chrome.dispose();
      glassMaterial.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      if (fallback) fallback.hidden = false;
    };
  }, []);

  return (
    <div className={className}>
      {/* The glow sits behind the canvas so it survives the WebGL fallback. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[8%] h-[46%] bg-[radial-gradient(60%_100%_at_50%_100%,var(--red-glow),transparent_72%)] blur-xl"
      />
      <Fallback ref={fallbackRef} />
      <div ref={hostRef} className="absolute inset-0" aria-hidden />
    </div>
  );
}
