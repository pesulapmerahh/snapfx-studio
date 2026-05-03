import { VERTEX_SHADER } from '../shaders';

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private programs: Map<string, WebGLProgram> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { 
      preserveDrawingBuffer: true,
      antialias: false,
      alpha: false 
    });
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;
    this.init();
  }

  private init() {
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW
    );

    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      this.gl.STATIC_DRAW
    );

    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  }

  public createProgram(fragCode: string): WebGLProgram {
    if (this.programs.has(fragCode)) {
      return this.programs.get(fragCode)!;
    }

    const vs = this.compileShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(this.gl.FRAGMENT_SHADER, fragCode);
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      this.gl.deleteShader(vs);
      this.gl.deleteShader(fs);
      throw new Error(info || 'Program link error');
    }

    this.programs.set(fragCode, program);
    return program;
  }

  private compileShader(type: number, code: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, code);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(info || 'Shader compile error');
    }
    return shader;
  }

  public render(
    video: HTMLVideoElement,
    program: WebGLProgram,
    uniforms: Record<string, any> = {},
    options: { x?: number, y?: number, width?: number, height?: number, clear?: boolean } = {}
  ) {
    const gl = this.gl;
    if (gl.isContextLost()) return;

    const x = options.x ?? 0;
    const y = options.y ?? 0;
    const w = options.width ?? gl.canvas.width;
    const h = options.height ?? gl.canvas.height;
    const shouldClear = options.clear ?? true;

    gl.viewport(x, y, w, h);
    
    if (shouldClear) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    gl.useProgram(program);

    // Positions
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Calculate TexCoords to preserve aspect ratio (cover)
    const videoAspect = video.videoWidth / video.videoHeight;
    const viewAspect = w / h;
    
    let sx = 1, sy = 1;
    if (videoAspect > viewAspect) sx = viewAspect / videoAspect;
    else sy = videoAspect / viewAspect;

    const x0 = 0.5 - sx / 2;
    const x1 = 0.5 + sx / 2;
    const y0 = 0.5 - sy / 2;
    const y1 = 0.5 + sy / 2;

    const texCoords = new Float32Array([
      x0, y1, x1, y1, x0, y0,
      x0, y0, x1, y1, x1, y0
    ]);

    const texLoc = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    // Update texture from video
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);

    // Uniforms
    const uImgLoc = gl.getUniformLocation(program, 'u_image');
    gl.uniform1i(uImgLoc, 0);

    Object.entries(uniforms).forEach(([name, value]) => {
      const loc = gl.getUniformLocation(program, name);
      if (loc === null) return;
      if (typeof value === 'number') gl.uniform1f(loc, value);
      else if (Array.isArray(value)) {
        if (value.length === 2) gl.uniform2f(loc, value[0], value[1]);
        else if (value.length === 3) gl.uniform3f(loc, value[0], value[1], value[2]);
      }
    });

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public dispose() {
    this.programs.forEach(program => {
      this.gl.deleteProgram(program);
    });
    this.programs.clear();
    
    if (this.positionBuffer) this.gl.deleteBuffer(this.positionBuffer);
    if (this.texCoordBuffer) this.gl.deleteBuffer(this.texCoordBuffer);
    if (this.texture) this.gl.deleteTexture(this.texture);
  }

  public getGL() { return this.gl; }
}
