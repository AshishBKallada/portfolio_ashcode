/** Projects the cloth: view = p * uR (uR holds the rows), then perspective, zoom and placement. */
export const CLOTH_VERT = `
attribute vec3 aPos;
attribute vec3 aNor;
attribute vec2 aUv;
uniform mat3 uR;
uniform float uCam;
uniform float uZoom;
uniform vec2 uCenter;
uniform float uAspect;
varying vec3 vView;
varying vec3 vNor;
varying vec2 vUv;
void main() {
  vec3 q = aPos * uR;
  float s = uCam / max(uCam - q.z, 0.001);
  vec2 scr = q.xy * s * uZoom;
  vView = q;
  vNor = aNor * uR;
  vUv = aUv;
  gl_Position = vec4(2.0 * (uCenter.x + scr.x / uAspect) - 1.0, 1.0 - 2.0 * (uCenter.y - scr.y), -q.z * 0.5, 1.0);
}`;

export const CLOTH_FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uHasTex;
uniform float uCam;
varying vec3 vView;
varying vec3 vNor;
varying vec2 vUv;
const vec3 KEY = vec3(-0.42, 0.45, 0.79) / length(vec3(-0.42, 0.45, 0.79));
const float PI2 = 6.28318530718;

float box(vec3 dir, vec3 centre, vec2 halfSize, float soft) {
  vec3 c = normalize(centre);
  float facing = dot(dir, c);
  if (facing <= 0.0) return 0.0;
  vec3 u = normalize(cross(vec3(0.0, 1.0, 0.0), c));
  vec3 v = cross(c, u);
  vec2 p = vec2(dot(dir, u), dot(dir, v)) / facing;
  vec2 e = (halfSize - abs(p)) / soft;
  return smoothstep(-0.5, 0.5, e.x) * smoothstep(-0.5, 0.5, e.y);
}

vec3 rainbow(float p) {
  return clamp(vec3(0.74, 0.58, 0.96) + vec3(0.26, 0.24, 0.10) * cos(PI2 * (p + vec3(0.0, 0.28, 0.62))), 0.0, 1.0);
}

void main() {
  vec3 n = normalize(vNor);
  bool back = n.z < 0.0;
  if (back) n = -n;
  vec3 V = normalize(vec3(0.0, 0.0, uCam) - vView);
  vec3 Rf = reflect(-V, n);
  float nv = clamp(dot(n, V), 0.0, 1.0);
  float nl = max(dot(n, KEY), 0.0);

  vec3 print = uHasTex > 0.5 ? pow(texture2D(uTex, vUv).rgb, vec3(2.2)) : vec3(0.10, 0.02, 0.32);
  float shade = 0.46 + 0.68 * nl + 0.08 * n.y;
  float key = pow(max(dot(Rf, KEY), 0.0), 26.0);
  float strip = box(Rf, vec3(0.08, 0.93, 0.36), vec2(1.1, 0.07), 0.22);
  float side = box(Rf, vec3(0.86, 0.12, 0.50), vec2(0.06, 0.85), 0.20);
  float fill = box(Rf, KEY, vec2(0.42, 0.30), 0.35);

  float phase = 3.0 * (0.85 * dot(n.xy, vec2(0.6, 0.8)) + 0.75 * (1.0 - nv) + 0.3 * dot(Rf.xy, vec2(-0.8, 0.6)))
    + 0.4 * sin(5.0 * vUv.x + 7.0 * vUv.y);
  vec3 holo = mix(vec3(1.0), pow(rainbow(phase), vec3(2.2)), 0.8);
  float lum = dot(print, vec3(0.2126, 0.7152, 0.0722));
  float gloss = mix(1.0, 0.45, smoothstep(0.55, 0.9, lum));
  vec3 spec = holo * gloss * mix(vec3(1.0), print * 2.4 + 0.08, 0.65)
    * (0.34 * key + 0.11 * strip + 0.07 * side + 0.02 * fill);

  vec3 colour = print * shade + spec + holo * print * 0.6 * pow(1.0 - nv, 3.0);
  if (back) {
    vec3 foil = vec3(0.30, 0.22, 0.52) * (0.35 + 0.9 * nl) + spec * 1.3;
    colour = mix(foil, print * shade, 0.38);
  }
  colour = min(colour, vec3(0.8)) + 0.2 * (1.0 - exp(-max(colour - 0.8, 0.0) / 0.2));
  gl_FragColor = vec4(pow(colour, vec3(1.0 / 2.2)), 1.0);
}`;

/** The cloth's silhouette, for the shadow. */
export const SOLID_FRAG = `
precision mediump float;
void main() { gl_FragColor = vec4(1.0); }`;

export const SHADOW_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/** A 7×7 Gaussian of the silhouette, shifted down and left, as premultiplied shadow. */
export const SHADOW_FRAG = `
precision mediump float;
uniform sampler2D uMask;
uniform vec2 uStep;
uniform vec2 uShift;
varying vec2 vUv;
void main() {
  float sum = 0.0;
  float total = 0.0;
  for (int y = -3; y <= 3; y++) {
    for (int x = -3; x <= 3; x++) {
      float w = exp(-float(x * x + y * y) / 6.0);
      sum += texture2D(uMask, vUv - uShift + vec2(float(x), float(y)) * uStep).r * w;
      total += w;
    }
  }
  float a = sum / total * 0.30;
  gl_FragColor = vec4(vec3(0.07, 0.07, 0.16) * a, a);
}`;
