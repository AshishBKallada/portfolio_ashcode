/* React Three Fiber elements use Three.js properties, not DOM attributes. */
/* eslint react/no-unknown-property: ["error", { "ignore": ["args", "vertexShader", "fragmentShader", "transparent"] }] */
"use client";

import { OrthographicCamera, useFBO, useTexture } from "@react-three/drei";
import { Canvas, invalidate, useFrame, useThree } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import * as React from "react";
import * as THREE from "three";
import { WebGLErrorBoundary, WebGLFallback } from "@/components/ui/webgl-error-boundary";

// Adapted from Componentry's image-ripple-effect. Additions: a `source`
// material can stand in for the images (a live shader the ripples distort),
// the cursor can be read from the whole window (`trackWindow`) when other
// layers sit on top, `sepia`/`saturation` grade the result in the shader
// (cheaper than a CSS filter over a live canvas), and frames are drawn only
// while the cursor moves or a ripple is still fading — never while idle or
// off-screen.

const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 winResolution;
uniform float uStrength;
uniform float uSepia;
uniform float uSaturation;

const float PI = 3.141592653589793238;

void main() {
  vec2 vUvScreen = gl_FragCoord.xy / winResolution.xy;
  vec4 displacement = texture2D(uDisplacement, vUvScreen);
  float theta = displacement.r * 2.0 * PI;

  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 uv = vUvScreen + dir * displacement.r * uStrength;
  vec4 color = texture2D(uTexture, uv);
  // Transparent images land premultiplied in the frame buffer; undo that so
  // their soft edges don't darken when blended onto the page.
  color.rgb /= max(color.a, 0.0001);

  // CSS sepia() and saturate(), applied in place.
  vec3 sepia = vec3(
    dot(color.rgb, vec3(0.393, 0.769, 0.189)),
    dot(color.rgb, vec3(0.349, 0.686, 0.168)),
    dot(color.rgb, vec3(0.272, 0.534, 0.131))
  );
  color.rgb = mix(color.rgb, min(sepia, 1.0), uSepia);
  float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  color.rgb = clamp(mix(vec3(luma), color.rgb, uSaturation), 0.0, 1.0);

  gl_FragColor = color;
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BRUSH_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="white" stop-opacity="1"/>
        <stop offset="65%" stop-color="white" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="128" height="128" fill="url(#g)"/>
  </svg>
`)}`;

export interface RippleImageItem {
  src: string;
  x?: number;
  y?: number;
  widthScale?: number;
  heightScale?: number;
}

/**
 * A live picture for the ripples to distort instead of images: a full-frame
 * material drawn each frame. `update` runs first with that material, the
 * elapsed time and the frame size in pixels.
 */
export interface RippleSource {
  material: THREE.Material;
  update?: (material: THREE.Material, time: number, width: number, height: number) => void;
}

export interface ImageRippleEffectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  className?: string;
  images?: RippleImageItem[];
  source?: RippleSource;
  /** Follow the cursor anywhere on the page, not only over this element. */
  trackWindow?: boolean;
  /** Render a single still frame and skip the ripples. */
  still?: boolean;
  /** Shown while the images load and in place of the effect without WebGL. */
  fallback?: React.ReactNode;
  /** Like CSS sepia(): 0 leaves the colours alone. */
  sepia?: number;
  /** Like CSS saturate(): 1 leaves the colours alone. */
  saturation?: number;
  brushTextureUrl?: string;
  distortionStrength?: number;
  waveCount?: number;
  waveSize?: number;
  waveRotationSpeed?: number;
  waveFadeMultiplier?: number;
  waveGrowth?: number;
  waveSpawnThreshold?: number;
  children?: React.ReactNode;
}

type ViewportDimensions = {
  width: number;
  height: number;
  pixelRatio: number;
};

function useContainerDimensions(
  ref: React.RefObject<HTMLElement | null>,
): ViewportDimensions {
  const [dimensions, setDimensions] = React.useState<ViewportDimensions>({
    width: 0,
    height: 0,
    pixelRatio: 1,
  });

  React.useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      setDimensions({
        width: element.clientWidth,
        height: element.clientHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}

interface RippleSceneProps {
  width: number;
  height: number;
  pointerRef: React.RefObject<{ x: number; y: number } | null>;
  images: RippleImageItem[];
  source?: RippleSource;
  brushTextureUrl: string;
  distortionStrength: number;
  waveCount: number;
  waveSize: number;
  waveRotationSpeed: number;
  waveFadeMultiplier: number;
  waveGrowth: number;
  waveSpawnThreshold: number;
  sepia: number;
  saturation: number;
  onReady: () => void;
}

function disposeMesh(mesh: THREE.Mesh) {
  mesh.geometry.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else {
    mesh.material.dispose();
  }
}

function RippleScene({
  width,
  height,
  pointerRef,
  images,
  source,
  brushTextureUrl,
  distortionStrength,
  waveCount,
  waveSize,
  waveRotationSpeed,
  waveFadeMultiplier,
  waveGrowth,
  waveSpawnThreshold,
  sepia,
  saturation,
  onReady,
}: RippleSceneProps) {
  const { gl, camera, viewport } = useThree();

  const brushTexture = useTexture(brushTextureUrl, (texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });
  const imageTextures = useTexture(images.map((item) => item.src));
  const rippleScene = React.useMemo(() => new THREE.Scene(), []);
  const imageScene = React.useMemo(() => new THREE.Scene(), []);

  const waveMeshesRef = React.useRef<THREE.Mesh[]>([]);
  const prevMouseRef = React.useRef<{ x: number; y: number } | null>(null);
  const currentWaveRef = React.useRef(0);

  const uniformsRef = React.useRef({
    uDisplacement: { value: null as THREE.Texture | null },
    uTexture: { value: null as THREE.Texture | null },
    winResolution: { value: new THREE.Vector2(1, 1) },
    uStrength: { value: distortionStrength },
    uSepia: { value: sepia },
    uSaturation: { value: saturation },
  });

  const fboBase = useFBO(Math.max(width, 1), Math.max(height, 1), {
    depthBuffer: false,
    stencilBuffer: false,
  });
  const fboTexture = useFBO(Math.max(width, 1), Math.max(height, 1), {
    depthBuffer: false,
    stencilBuffer: false,
  });

  const imageCamera = React.useMemo(() => {
    const cam = new THREE.OrthographicCamera(
      viewport.width / -2,
      viewport.width / 2,
      viewport.height / 2,
      viewport.height / -2,
      -1000,
      1000,
    );
    cam.position.z = 2;
    return cam;
  }, [viewport.height, viewport.width]);

  const outputRef = React.useRef<THREE.ShaderMaterial>(null);

  // Textures are in (this only mounts once they have loaded).
  React.useEffect(() => onReady(), [onReady]);

  // Handed over before the first frame compiles the material.
  React.useLayoutEffect(() => {
    if (outputRef.current) outputRef.current.uniforms = uniformsRef.current;
  }, []);

  React.useEffect(() => {
    const uniforms = uniformsRef.current;
    uniforms.uStrength.value = distortionStrength;
    uniforms.uSepia.value = sepia;
    uniforms.uSaturation.value = saturation;
    invalidate();
  }, [distortionStrength, sepia, saturation]);

  React.useEffect(() => {
    const meshes: THREE.Mesh[] = [];
    for (let i = 0; i < waveCount; i += 1) {
      const geometry = new THREE.PlaneGeometry(waveSize, waveSize, 1, 1);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        map: brushTexture,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.rotation.z = Math.random();
      rippleScene.add(mesh);
      meshes.push(mesh);
    }

    waveMeshesRef.current = meshes;
    currentWaveRef.current = 0;

    return () => {
      meshes.forEach((mesh) => {
        rippleScene.remove(mesh);
        disposeMesh(mesh);
      });
    };
  }, [brushTexture, rippleScene, waveCount, waveSize]);

  React.useEffect(() => {
    const group = new THREE.Group();

    if (source) {
      // Full-frame plane: the source's material paints the whole picture.
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), source.material);
      mesh.scale.set(viewport.width, viewport.height, 1);
      group.add(mesh);
    } else {
      const geometry = new THREE.PlaneGeometry(1, 1);
      images.forEach((item, index) => {
        const texture = imageTextures[index];
        if (!texture) {
          return;
        }
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;

        const mesh = new THREE.Mesh(
          geometry,
          new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
        );
        mesh.position.x = (item.x ?? (index - (images.length - 1) / 2) * 0.25) * viewport.width;
        mesh.position.y = (item.y ?? 0) * viewport.height;
        mesh.position.z = 1;
        mesh.scale.x = viewport.width * (item.widthScale ?? 0.22);
        mesh.scale.y = viewport.width * (item.heightScale ?? 0.28);
        group.add(mesh);
      });
    }

    imageScene.add(group);

    return () => {
      group.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        // The source's material belongs to the caller.
        if (!source) disposeMesh(mesh);
      });
      imageScene.remove(group);
    };
  }, [imageScene, imageTextures, images, source, viewport.height, viewport.width]);

  useFrame((state) => {
    source?.update?.(source.material, state.clock.elapsedTime, width, height);

    const pointer = pointerRef.current;
    const prev = prevMouseRef.current;
    if (pointer) {
      const x = pointer.x - width / 2;
      const y = -pointer.y + height / 2;
      const moved =
        prev !== null &&
        (Math.abs(x - prev.x) > waveSpawnThreshold || Math.abs(y - prev.y) > waveSpawnThreshold);

      if (moved && waveMeshesRef.current.length > 0) {
        const waveIndex = currentWaveRef.current % waveMeshesRef.current.length;
        const mesh = waveMeshesRef.current[waveIndex];
        if (mesh) {
          mesh.position.x = x;
          mesh.position.y = y;
          mesh.visible = true;
          mesh.scale.set(1.75, 1.75, 1);
          mesh.rotation.z = Math.random() * Math.PI;
          (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
        }
        currentWaveRef.current = (waveIndex + 1) % waveMeshesRef.current.length;
      }
      prevMouseRef.current = { x, y };
    } else {
      prevMouseRef.current = null;
    }

    let rippling = false;
    waveMeshesRef.current.forEach((mesh) => {
      if (!mesh.visible) {
        return;
      }
      rippling = true;
      mesh.rotation.z += waveRotationSpeed;
      mesh.scale.x = 0.98 * mesh.scale.x + waveGrowth;
      mesh.scale.y = 0.98 * mesh.scale.y + waveGrowth;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity *= waveFadeMultiplier;
      if (material.opacity <= 0.01) {
        mesh.visible = false;
      }
    });

    const uniforms = uniformsRef.current;
    uniforms.uTexture.value = fboTexture.texture;
    uniforms.uDisplacement.value = fboBase.texture;
    uniforms.winResolution.value.set(width, height).multiplyScalar(gl.getPixelRatio());

    gl.setRenderTarget(fboBase);
    gl.clear();
    gl.render(rippleScene, camera);

    gl.setRenderTarget(fboTexture);
    gl.clear();
    gl.render(imageScene, imageCamera);

    gl.setRenderTarget(null);

    // Keep drawing only while ripples are fading or a live source animates.
    if (rippling || source?.update) state.invalidate();
  });

  return (
    <mesh>
      <planeGeometry args={[Math.max(width, 1), Math.max(height, 1), 1, 1]} />
      <shaderMaterial
        ref={outputRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
}

export function ImageRippleEffect({
  className,
  images = [],
  source,
  trackWindow = false,
  still = false,
  fallback,
  sepia = 0,
  saturation = 1,
  brushTextureUrl = BRUSH_DATA_URI,
  distortionStrength = 0.075,
  waveCount = 100,
  waveSize = 60,
  waveRotationSpeed = 0.025,
  waveFadeMultiplier = 0.95,
  waveGrowth = 0.155,
  waveSpawnThreshold = 0.1,
  children,
  ...props
}: ImageRippleEffectProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width, height, pixelRatio } = useContainerDimensions(containerRef);
  const pointerRef = React.useRef<{ x: number; y: number } | null>(null);
  const [visible, setVisible] = React.useState(true);
  const [ready, setReady] = React.useState(false);
  const markReady = React.useCallback(() => setReady(true), []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? true));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || still) return;
    const target: HTMLElement | Window = trackWindow ? window : el;
    const onMove = (event: Event) => {
      const { clientX, clientY } = event as PointerEvent;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      pointerRef.current = { x, y };
      // Wake the canvas only when the cursor is near enough to ripple it.
      if (x > -100 && y > -100 && x < rect.width + 100 && y < rect.height + 100) invalidate();
    };
    const onLeave = () => {
      pointerRef.current = null;
    };
    const leaveTarget = trackWindow ? document.documentElement : el;
    target.addEventListener("pointermove", onMove, { passive: true });
    leaveTarget.addEventListener("pointerleave", onLeave);
    return () => {
      target.removeEventListener("pointermove", onMove);
      leaveTarget.removeEventListener("pointerleave", onLeave);
    };
  }, [still, trackWindow]);

  const frustumSize = height;
  const aspect = width > 0 && height > 0 ? width / height : 1;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[560px] w-full overflow-hidden text-white", className)}
      {...props}
    >
      {fallback && !ready ? <div className="absolute inset-0">{fallback}</div> : null}
      {width > 0 && height > 0 && (
        <WebGLErrorBoundary fallback={fallback ?? <WebGLFallback className="absolute inset-0 h-full w-full" />}>
          <Canvas
            // Layout size, not the on-screen box: a parent scaled mid-animation
            // must not shrink the canvas (transforms never trigger a resize).
            resize={{ offsetSize: true }}
            dpr={Math.min(pixelRatio, 1.5)}
            frameloop={visible ? "demand" : "never"}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
          >
            <OrthographicCamera
              makeDefault
              args={[
                (frustumSize * aspect) / -2,
                (frustumSize * aspect) / 2,
                frustumSize / 2,
                frustumSize / -2,
                -1000,
                1000,
              ]}
              position={[0, 0, 2]}
            />
            <React.Suspense fallback={null}>
              <RippleScene
                width={width}
                height={height}
                pointerRef={pointerRef}
                images={images}
                source={source}
                brushTextureUrl={brushTextureUrl}
                distortionStrength={distortionStrength}
                waveCount={waveCount}
                waveSize={waveSize}
                waveRotationSpeed={waveRotationSpeed}
                waveFadeMultiplier={waveFadeMultiplier}
                waveGrowth={waveGrowth}
                waveSpawnThreshold={waveSpawnThreshold}
                sepia={sepia}
                saturation={saturation}
                onReady={markReady}
              />
            </React.Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      )}
      {children ? (
        <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
      ) : null}
    </div>
  );
}
