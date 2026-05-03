export const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  uniform float u_mirror;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
    if (u_mirror > 0.5) {
      v_texCoord = vec2(1.0 - a_texCoord.x, a_texCoord.y);
    } else {
      v_texCoord = a_texCoord;
    }
  }
`;

export const BASE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

export const GRAYSCALE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(gray), color.a);
  }
`;

export const SEPIA_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float r = dot(color.rgb, vec3(0.393, 0.769, 0.189));
    float g = dot(color.rgb, vec3(0.349, 0.686, 0.168));
    float b = dot(color.rgb, vec3(0.272, 0.534, 0.131));
    gl_FragColor = vec4(r, g, b, color.a);
  }
`;

export const INVERT_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    gl_FragColor = vec4(1.0 - color.rgb, color.a);
  }
`;

// --- GEOMETRIC / MIRRORS ---

export const MIRROR_LR_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 uv = v_texCoord;
    if (uv.x > 0.5) uv.x = 1.0 - uv.x;
    gl_FragColor = texture2D(u_image, uv);
  }
`;

export const MIRROR_TB_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 uv = v_texCoord;
    if (uv.y > 0.5) uv.y = 1.0 - uv.y;
    gl_FragColor = texture2D(u_image, uv);
  }
`;

export const QUAD_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 uv = fract(v_texCoord * 2.0);
    gl_FragColor = texture2D(u_image, uv);
  }
`;

export const KALEIDOSCOPE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 p = v_texCoord - 0.5;
    float r = length(p);
    float a = atan(p.y, p.x);
    float sides = 6.0;
    float tau = 6.283185;
    a = mod(a, tau/sides);
    a = abs(a - tau/sides/2.0);
    p = r * vec2(cos(a), sin(a));
    gl_FragColor = texture2D(u_image, p + 0.5);
  }
`;

// --- DISTORTION ---

export const BULGE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 uv = v_texCoord - 0.5;
    float r = length(uv);
    uv *= smoothstep(0.0, 0.7, r) + 0.5;
    gl_FragColor = texture2D(u_image, uv + 0.5);
  }
`;

export const SWIRL_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;
  void main() {
    vec2 uv = v_texCoord - 0.5;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    angle += (1.0 - smoothstep(0.0, 0.5, r)) * 4.0;
    gl_FragColor = texture2D(u_image, vec2(cos(angle), sin(angle)) * r + 0.5);
  }
`;

// --- COLOR / RETRO ---

export const THERMAL_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    vec3 thermal = vec3(0.0);
    if (lum < 0.33) thermal = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 0.0), lum * 3.0);
    else if (lum < 0.66) thermal = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (lum - 0.33) * 3.0);
    else thermal = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (lum - 0.66) * 3.0);
    gl_FragColor = vec4(thermal, 1.0);
  }
`;

// Smooth Warhol-inspired look: tapered palette + retains some original detail (no blown-out flats)
export const POPART_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 src = clamp(color.rgb, 0.0, 1.0);
    float lum = dot(src, vec3(0.299, 0.587, 0.114));

    vec3 shadows = vec3(0.10, 0.12, 0.42);
    vec3 low = vec3(0.05, 0.55, 0.62);
    vec3 mid = vec3(0.92, 0.28, 0.48);
    vec3 highs = vec3(0.99, 0.92, 0.42);

    float a = smoothstep(0.0, 0.28, lum);
    float b = smoothstep(0.26, 0.58, lum);
    float c = smoothstep(0.56, 0.92, lum);

    vec3 poster = shadows;
    poster = mix(poster, low, a);
    poster = mix(poster, mid, b * (1.0 - c));
    poster = mix(poster, highs, smoothstep(0.65, 0.98, lum));

    vec3 tinted = clamp(poster + (src - vec3(lum)) * vec3(0.28, 0.22, 0.38), 0.0, 1.0);
    vec3 outCol = mix(tinted, poster, 0.62);

    vec3 vignetteLift = vec3(smoothstep(0.92, 0.35, max(abs(v_texCoord.x - 0.5), abs(v_texCoord.y - 0.5)) * 2.0));
    outCol = mix(outCol, outCol * 1.06, vignetteLift * 0.12);

    gl_FragColor = vec4(clamp(outCol, 0.0, 1.0), 1.0);
  }
`;

// Cel + soft ink outlines (readable, less noisy than halftone grid)
export const COMIC_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;

  vec3 samp(vec2 uv) {
    return texture2D(u_image, clamp(uv, 0.001, 0.999)).rgb;
  }

  void main() {
    vec3 c = samp(v_texCoord);

    vec2 px = vec2(0.0045, 0.004);
    vec3 gx = samp(v_texCoord + vec2(px.x, 0.0)) - samp(v_texCoord - vec2(px.x, 0.0));
    vec3 gy = samp(v_texCoord + vec2(0.0, px.y)) - samp(v_texCoord - vec2(0.0, px.y));
    float edge = smoothstep(0.02, 0.18, length(gx) + length(gy));

    vec3 lift = clamp((c - 0.52) * 1.08 + 0.58, 0.0, 1.0);
    vec3 toned = clamp(lift * vec3(1.02, 0.96, 0.92), 0.0, 1.0);
    toned = floor(toned * 6.5 + 0.35) / 6.5;

    vec3 shaded = toned * edge + vec3(0.06, 0.07, 0.12) * (1.0 - edge);
    gl_FragColor = vec4(shaded, 1.0);
  }
`;

// Edge glow + cool dual-tone (readable silhouette, subtler pulse)
export const NEON_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;

  vec3 S(vec2 uv) {
    return texture2D(u_image, uv).rgb;
  }

  void main() {
    vec2 uv = clamp(v_texCoord, 0.001, 0.999);

    float d = 0.0035;
    vec3 gx = S(uv + vec2(d, 0.0)) - S(uv - vec2(d, 0.0));
    vec3 gy = S(uv + vec2(0.0, d)) - S(uv - vec2(0.0, d));
    float edgeAmt = clamp(length(gx) + length(gy), 0.0, 3.5);
    float e = smoothstep(0.04, 0.28, edgeAmt);

    vec3 teal = vec3(0.15, 0.95, 0.92);
    vec3 magenta = vec3(0.98, 0.35, 0.92);
    float shift = uv.x * 6.2831 + uv.y * 3.1415 * 0.5 + sin(u_time * 0.6) * 0.35;
    vec3 neonTint = mix(teal, magenta, 0.5 + 0.5 * sin(shift));

    vec3 bloom = neonTint * pow(e, 0.75) * 1.5;
    float pulse = 0.92 + 0.08 * sin(u_time * 1.9);
    bloom *= pulse;

    vec3 faint = S(uv) * vec3(0.08, 0.095, 0.16);
    vec3 bg = faint * (0.82 + 0.18 * (1.0 - e));

    vec3 outRgb = clamp(bg + bloom * e + faint * smoothstep(0.2, 0.0, e) * 0.45, 0.0, 1.0);
    gl_FragColor = vec4(outRgb, 1.0);
  }
`;

export const GLITCH_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;
  void main() {
    float shift = sin(u_time * 10.0) * 0.01;
    float r = texture2D(u_image, v_texCoord + vec2(shift, 0)).r;
    float g = texture2D(u_image, v_texCoord).g;
    float b = texture2D(u_image, v_texCoord - vec2(shift, 0)).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export const BLUR_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = vec4(0.0);
    float offset = 0.005;
    color += texture2D(u_image, v_texCoord + vec2(-offset, -offset));
    color += texture2D(u_image, v_texCoord + vec2(0, -offset));
    color += texture2D(u_image, v_texCoord + vec2(offset, -offset));
    color += texture2D(u_image, v_texCoord + vec2(-offset, 0));
    color += texture2D(u_image, v_texCoord);
    color += texture2D(u_image, v_texCoord + vec2(offset, 0));
    color += texture2D(u_image, v_texCoord + vec2(-offset, offset));
    color += texture2D(u_image, v_texCoord + vec2(0, offset));
    color += texture2D(u_image, v_texCoord + vec2(offset, offset));
    gl_FragColor = color / 9.0;
  }
`;

export const VIGNETTE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec2 p = v_texCoord - 0.5;
    float q = dot(p, p) * 1.45;
    float vig = clamp(1.0 - q, 0.0, 1.0);
    vig = vig * vig * vig;
    vec3 rgb = mix(color.rgb * 0.22, color.rgb * vec3(1.02, 1.01, 0.99), vig);
    gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), color.a);
  }
`;

export const DUOTONE_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    lum = lum * lum * (3.0 - 2.0 * lum);
    vec3 shadows = vec3(0.12, 0.05, 0.42);
    vec3 highlights = vec3(1.0, 0.55, 0.08);
    vec3 outRgb = mix(shadows, highlights, lum);
    outRgb = mix(color.rgb * 0.2, outRgb, 0.88);
    gl_FragColor = vec4(clamp(outRgb, 0.0, 1.0), 1.0);
  }
`;

export const SUNSET_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 c = clamp(color.rgb, 0.0, 1.0);
    c = vec3(
      clamp(c.r * 1.12 + 0.05, 0.0, 1.0),
      clamp(c.g * 1.03, 0.0, 1.0),
      clamp(c.b * 0.85, 0.0, 1.0)
    );
    vec3 warmed = clamp(c + vec3(0.06, 0.02, 0.0) * (v_texCoord.y * 0.7 + 0.3), 0.0, 1.0);
    warmed = warmed * vec3(1.06, 0.98, 0.93);
    warmed = clamp((warmed - 0.5) * 1.06 + 0.5 + vec3(v_texCoord.y - 0.5) * 0.06, 0.0, 1.0);
    gl_FragColor = vec4(warmed, color.a);
  }
`;

export const NOIR_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float y = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float crush = clamp((y - 0.5) * 1.85 + 0.5 + 0.02, 0.0, 1.0);
    crush *= crush;
    float silver = clamp(pow(crush, 0.85), 0.0, 1.0);
    vec3 bw = vec3(silver * 1.06);
    bw = mix(bw, vec3(crush), 0.16);
    gl_FragColor = vec4(clamp(bw, 0.0, 1.0), 1.0);
  }
`;

export const EMBOSS_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec2 px = vec2(0.0025);
    vec3 center = texture2D(u_image, v_texCoord).rgb;
    vec3 topLeft = texture2D(u_image, clamp(v_texCoord + vec2(-px.x, px.y), 0.0, 1.0)).rgb;
    vec3 botRight = texture2D(u_image, clamp(v_texCoord + vec2(px.x, -px.y), 0.0, 1.0)).rgb;
    float edge = dot(topLeft - botRight, vec3(0.299, 0.587, 0.114));
    float base = dot(center, vec3(0.299, 0.587, 0.114));
    float shaded = clamp(0.53 + edge * 1.85, 0.0, 1.0);
    vec3 tinted = vec3(shaded) * vec3(0.98, 0.96, 0.93) + center * vec3(0.18, 0.16, 0.22);
    gl_FragColor = vec4(clamp(tinted, 0.0, 1.0), 1.0);
  }
`;

export const PRISM_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;
  void main() {
    float off = sin(u_time * 0.85) * 0.0015 + 0.002;
    vec2 drift = vec2(cos(u_time * 0.45), sin(u_time * 0.5)) * 0.002;
    vec2 uv = v_texCoord;

    vec3 rgb;
    rgb.r = texture2D(u_image, clamp(uv + vec2(-off, 0.0) + drift * 1.05, 0.0, 1.0)).r;
    rgb.g = texture2D(u_image, clamp(uv + vec2(off * 0.6, drift.y * -0.3), 0.0, 1.0)).g;
    rgb.b = texture2D(u_image, clamp(uv + vec2(off * 1.05, drift.y), 0.0, 1.0)).b;

    float fr = clamp(abs(uv.y - uv.x) + abs(uv.y + uv.x - 1.0), 0.0, 1.2);
    float vig = clamp(1.06 - dot(uv - 0.5, uv - 0.5) * 3.8, 0.0, 1.08);
    vec3 boosted = clamp(rgb * (0.93 + vig * 0.12), 0.0, 1.0);
    boosted = boosted * (0.88 + fr * 0.05);
    gl_FragColor = vec4(boosted, 1.0);
  }
`;

export const PIXEL_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    float cells = 90.0;
    vec2 uv = floor(v_texCoord * cells) / cells + 0.5 / cells;
    gl_FragColor = texture2D(u_image, clamp(uv, 0.002, 0.998));
  }
`;

export const SCANLINES_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    float line = sin(v_texCoord.y * 800.0 + u_time * 2.0) * 0.5 + 0.5;
    float darken = mix(0.88, 1.03, smoothstep(0.15, 0.85, line));
    vec3 tinted = clamp(color.rgb * darken * vec3(1.0, 0.98 + v_texCoord.x * 0.04, 0.94), 0.0, 1.0);
    float roll = fract(v_texCoord.y * 380.0 - u_time * 0.12);
    float band = smoothstep(0.0, 0.08, roll) * smoothstep(1.0, 0.92, roll);
    tinted *= 0.95 + band * 0.12;
    gl_FragColor = vec4(tinted, color.a);
  }
`;

/**
 * Comic strip cetak bergaya sunday comics: kertas krem + flat warna dari kamera +
 * pola titik/halftone (bukan B&W keras).
 */
export const COMIC_STRIP_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;

  void main() {
    float cx = 98.0;
    float cy = 126.0;
    vec2 p = vec2(v_texCoord.x * cx, v_texCoord.y * cy);
    vec2 cellUv = clamp(
      vec2((floor(p.x) + 0.5) / cx, (floor(p.y) + 0.5) / cy),
      vec2(0.004),
      vec2(0.996)
    );

    vec4 tex = texture2D(u_image, cellUv);
    vec3 samp = clamp(tex.rgb, 0.0, 1.0);
    vec3 poster = floor(samp * 7.2 + vec3(0.36)) / 7.2;
    float lum = dot(poster, vec3(0.299, 0.587, 0.114));
    lum = lum * lum * (3.0 - 2.0 * lum);

    vec2 gv = fract(p) - 0.5;
    gv.x *= cx / max(cy, 1.0);
    float d = length(gv);

    float rad = clamp((1.05 - lum) * 0.52, 0.07, 0.61);
    float halftone = smoothstep(rad + 0.048, rad - 0.021, d);

    vec3 paper = vec3(1.00, 0.98, 0.90);

    vec3 boosted = samp * vec3(
      1.05 + samp.r * 0.08,
      0.98 + samp.g * 0.1,
      0.93 + samp.b * 0.06
    );
    vec3 pastel = clamp(poster * vec3(0.94, 1.06, 0.97), 0.0, 1.0);

    vec3 chromaLift = boosted - vec3(dot(boosted, vec3(0.299, 0.587, 0.114)));

    vec3 wash = mix(
      paper + samp * vec3(0.04, 0.045 + lum * 0.04, -0.01),
      pastel * vec3(
        0.46 + lum * 0.5,
        0.43 + lum * 0.5,
        0.52 + lum * 0.4
      ) + chromaLift * vec3(0.12, -0.04, -0.02),
      0.75 * lum + 0.09
    );

    vec3 inkRich = samp * vec3(
      0.18 + (1.0 - lum) * 0.52,
      0.13 + lum * 0.45,
      0.2 + lum * 0.48
    );
    inkRich = clamp(
      inkRich + poster * vec3(0.18, -0.02 + lum * 0.08, -0.04),
      0.0,
      1.0
    );
    inkRich += chromaLift * vec3(0.42, -0.12, -0.2) * (0.52 + lum * 0.4);

    vec3 tintedPaper = wash * vec3(0.99, 1.01, 0.94);
    vec3 outRgb = mix(tintedPaper, clamp(inkRich, 0.0, 1.0), halftone);

    outRgb *= 0.99 + samp.g * (1.0 - halftone) * 0.035;
    gl_FragColor = vec4(clamp(outRgb, 0.0, 1.0), 1.0);
  }
`;

export const MIDNIGHT_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 c = clamp(color.rgb, 0.0, 1.0);
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 cool = clamp(c + vec3(0.06, -0.04, -0.12) + vec3(0.03) * lum, 0.0, 1.0);
    cool *= vec3(0.94, 0.98, 1.06);
    float shadow = clamp(1.0 - lum * 1.95, 0.0, 1.0);
    cool *= 0.75 + lum * 0.45 + shadow * 0.08;
    cool = clamp((cool - 0.5) * 1.12 + 0.53, 0.0, 1.0);
    gl_FragColor = vec4(cool, color.a);
  }
`;

export const INFRARED_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 c = clamp(color.rgb, 0.0, 1.0);
    float g = dot(c, vec3(0.299, 0.587, 0.114));

    vec3 warm = vec3(
      clamp(c.r * 1.52 + g * 0.28, 0.0, 1.0),
      clamp(c.g * 0.55 + g * 0.12, 0.0, 1.0),
      clamp(c.b * 0.35 + g * 0.08, 0.0, 1.0)
    );
    vec3 tinted = clamp(warm * vec3(1.02, 0.78, 0.72), 0.0, 1.0);
    tinted = clamp(pow(tinted, vec3(0.9)), 0.0, 1.0);
    gl_FragColor = vec4(tinted, color.a);
  }
`;

export const LITHO_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 c = clamp(color.rgb, 0.0, 1.0);
    float steps = 5.5;
    vec3 poster = floor(c * steps + 0.52) / steps;
    float lum = dot(poster, vec3(0.299, 0.587, 0.114));
    vec3 cool = clamp(poster * vec3(0.96 + lum * 0.08, 0.93, 1.06 - lum * 0.04), 0.0, 1.0);
    gl_FragColor = vec4(cool, 1.0);
  }
`;

export const VHS_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  uniform float u_time;
  varying vec2 v_texCoord;

  vec3 chroma(vec2 uv, float t) {
    float w = sin(t * 1.85 + uv.y * 80.0) * 0.0016;
    float r = texture2D(u_image, clamp(uv + vec2(w - 0.002, -0.0006), 0.0, 1.0)).r;
    float g = texture2D(u_image, clamp(uv + vec2(-w * 0.35, w * 0.4), 0.0, 1.0)).g;
    float b = texture2D(u_image, clamp(uv + vec2(-w + 0.003, -w * 0.2), 0.0, 1.0)).b;
    return vec3(r, g, b);
  }

  void main() {
    vec2 uv = v_texCoord;
    uv.x += sin(u_time * 3.15 + uv.y * 420.0) * 0.0014;
    vec3 rgb = chroma(uv, u_time);
    rgb *= 1.06 + sin(u_time * 8.9 + uv.x * 200.0) * 0.03;
    float scan = fract(uv.y * 280.0 - u_time * 2.8);
    rgb *= scan > 0.35 ? 0.92 : 1.06;
    float vig = clamp(1.06 - dot(uv - 0.5, uv - 0.5) * 4.8, 0.0, 1.06);
    rgb *= mix(vig, 1.06, 0.45);
    gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), 1.0);
  }
`;

export const ACID_FRAG = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    vec3 c = clamp(color.rgb, 0.0, 1.0);

    vec3 boosted = clamp(c + (c - vec3(dot(c, vec3(0.299, 0.587, 0.114)))) * 1.42, 0.0, 1.0);
    boosted *= vec3(1.06, 0.98 + v_texCoord.x * 0.14, 0.92);

    boosted = clamp((boosted - 0.5) * 1.18 + 0.53, 0.0, 1.0);
    gl_FragColor = vec4(boosted, color.a);
  }
`;
