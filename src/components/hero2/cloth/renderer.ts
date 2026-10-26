import { CAM, ROWS_FLAT, type View } from "./camera";
import { CLOTH_FRAG, CLOTH_VERT, SHADOW_FRAG, SHADOW_VERT, SOLID_FRAG } from "./shaders";
import { COLS, ROWS } from "./settings";

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) throw new Error("shader");
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram();
  if (!p) throw new Error("program");
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

/** Draws the cloth and its soft shadow. Throws if WebGL can't do the job. */
export class ClothRenderer {
  private cloth: WebGLProgram;
  private solid: WebGLProgram;
  private shadow: WebGLProgram;
  private posBuf: WebGLBuffer;
  private norBuf: WebGLBuffer;
  private uvBuf: WebGLBuffer;
  private idxBuf: WebGLBuffer;
  private triBuf: WebGLBuffer;
  private indexCount: number;
  private tex: WebGLTexture | null = null;
  private mask: { fb: WebGLFramebuffer; tex: WebGLTexture; w: number; h: number } | null = null;

  constructor(private gl: WebGLRenderingContext) {
    this.cloth = program(gl, CLOTH_VERT, CLOTH_FRAG);
    this.solid = program(gl, CLOTH_VERT, SOLID_FRAG);
    this.shadow = program(gl, SHADOW_VERT, SHADOW_FRAG);
    const buf = () => {
      const b = gl.createBuffer();
      if (!b) throw new Error("buffer");
      return b;
    };
    this.posBuf = buf();
    this.norBuf = buf();
    this.uvBuf = buf();
    this.idxBuf = buf();
    this.triBuf = buf();

    const uv = new Float32Array(COLS * ROWS * 2);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = (row * COLS + col) * 2;
        uv[i] = col / (COLS - 1);
        uv[i + 1] = 1 - row / (ROWS - 1);
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);

    const idx: number[] = [];
    for (let row = 0; row < ROWS - 1; row++) {
      for (let col = 0; col < COLS - 1; col++) {
        const a = row * COLS + col;
        idx.push(a, a + 1, a + COLS, a + 1, a + COLS + 1, a + COLS);
      }
    }
    this.indexCount = idx.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.triBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.disable(gl.CULL_FACE);
  }

  /** Uploads the print at full strength, with mipmaps and up to 8× anisotropy. */
  setImage(img: HTMLImageElement) {
    const gl = this.gl;
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    const aniso =
      gl.getExtension("EXT_texture_filter_anisotropic") ?? gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    if (aniso) {
      const max = gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
      gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
    }
  }

  private ensureMask(w: number, h: number) {
    const gl = this.gl;
    if (this.mask && this.mask.w === w && this.mask.h === h) return this.mask;
    if (this.mask) {
      gl.deleteFramebuffer(this.mask.fb);
      gl.deleteTexture(this.mask.tex);
    }
    const tex = gl.createTexture();
    const fb = gl.createFramebuffer();
    if (!tex || !fb) throw new Error("framebuffer");
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.mask = { fb, tex, w, h };
    return this.mask;
  }

  private bindCloth(p: WebGLProgram, view: View) {
    const gl = this.gl;
    gl.useProgram(p);
    const attr = (name: string, b: WebGLBuffer, size: number) => {
      const loc = gl.getAttribLocation(p, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    attr("aPos", this.posBuf, 3);
    attr("aNor", this.norBuf, 3);
    attr("aUv", this.uvBuf, 2);
    gl.uniformMatrix3fv(gl.getUniformLocation(p, "uR"), false, ROWS_FLAT);
    gl.uniform1f(gl.getUniformLocation(p, "uCam"), CAM);
    gl.uniform1f(gl.getUniformLocation(p, "uZoom"), view.zoom);
    gl.uniform2f(gl.getUniformLocation(p, "uCenter"), view.cx, view.cy);
    gl.uniform1f(gl.getUniformLocation(p, "uAspect"), view.aspect);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.idxBuf);
  }

  draw(pos: Float32Array, normal: Float32Array, view: View, canvasW: number, canvasH: number) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.norBuf);
    gl.bufferData(gl.ARRAY_BUFFER, normal, gl.DYNAMIC_DRAW);

    // 1. The silhouette, at an eighth of the canvas, for the shadow.
    const mask = this.ensureMask(Math.max(1, Math.round(canvasW / 8)), Math.max(1, Math.round(canvasH / 8)));
    gl.bindFramebuffer(gl.FRAMEBUFFER, mask.fb);
    gl.viewport(0, 0, mask.w, mask.h);
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.bindCloth(this.solid, view);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // 2. The shadow, blurred and shifted down-left, over the clear canvas.
    gl.viewport(0, 0, canvasW, canvasH);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.shadow);
    const loc = gl.getAttribLocation(this.shadow, "aPos");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triBuf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, mask.tex);
    gl.uniform1i(gl.getUniformLocation(this.shadow, "uMask"), 1);
    const spacing = 0.9 + (1.5 * view.zoom * view.height) / 724;
    gl.uniform2f(gl.getUniformLocation(this.shadow, "uStep"), spacing / mask.w, spacing / mask.h);
    gl.uniform2f(gl.getUniformLocation(this.shadow, "uShift"), (-0.012 * view.zoom) / view.aspect, -0.045 * view.zoom);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disableVertexAttribArray(loc);

    // 3. The cloth.
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this.bindCloth(this.cloth, view);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(gl.getUniformLocation(this.cloth, "uTex"), 0);
    gl.uniform1f(gl.getUniformLocation(this.cloth, "uHasTex"), this.tex ? 1 : 0);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }
}
