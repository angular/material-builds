"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/math_utils.js
function signum(num) {
  if (num < 0) {
    return -1;
  } else if (num === 0) {
    return 0;
  } else {
    return 1;
  }
}
function lerp(start, stop, amount) {
  return (1 - amount) * start + amount * stop;
}
function clampInt(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }
  return input;
}
function clampDouble(min, max, input) {
  if (input < min) {
    return min;
  } else if (input > max) {
    return max;
  }
  return input;
}
function sanitizeDegreesInt(degrees) {
  degrees = degrees % 360;
  if (degrees < 0) {
    degrees = degrees + 360;
  }
  return degrees;
}
function sanitizeDegreesDouble(degrees) {
  degrees = degrees % 360;
  if (degrees < 0) {
    degrees = degrees + 360;
  }
  return degrees;
}
function rotationDirection(from, to) {
  const increasingDifference = sanitizeDegreesDouble(to - from);
  return increasingDifference <= 180 ? 1 : -1;
}
function differenceDegrees(a, b) {
  return 180 - Math.abs(Math.abs(a - b) - 180);
}
function matrixMultiply(row, matrix) {
  const a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
  const b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
  const c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
  return [a, b, c];
}
var init_math_utils = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/math_utils.js"() {
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/color_utils.js
function argbFromRgb(red, green, blue) {
  return (255 << 24 | (red & 255) << 16 | (green & 255) << 8 | blue & 255) >>> 0;
}
function argbFromLinrgb(linrgb) {
  const r = delinearized(linrgb[0]);
  const g = delinearized(linrgb[1]);
  const b = delinearized(linrgb[2]);
  return argbFromRgb(r, g, b);
}
function alphaFromArgb(argb) {
  return argb >> 24 & 255;
}
function redFromArgb(argb) {
  return argb >> 16 & 255;
}
function greenFromArgb(argb) {
  return argb >> 8 & 255;
}
function blueFromArgb(argb) {
  return argb & 255;
}
function isOpaque(argb) {
  return alphaFromArgb(argb) >= 255;
}
function argbFromXyz(x, y, z) {
  const matrix = XYZ_TO_SRGB;
  const linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
  const linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
  const linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
  const r = delinearized(linearR);
  const g = delinearized(linearG);
  const b = delinearized(linearB);
  return argbFromRgb(r, g, b);
}
function xyzFromArgb(argb) {
  const r = linearized(redFromArgb(argb));
  const g = linearized(greenFromArgb(argb));
  const b = linearized(blueFromArgb(argb));
  return matrixMultiply([r, g, b], SRGB_TO_XYZ);
}
function argbFromLab(l, a, b) {
  const whitePoint = WHITE_POINT_D65;
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const xNormalized = labInvf(fx);
  const yNormalized = labInvf(fy);
  const zNormalized = labInvf(fz);
  const x = xNormalized * whitePoint[0];
  const y = yNormalized * whitePoint[1];
  const z = zNormalized * whitePoint[2];
  return argbFromXyz(x, y, z);
}
function labFromArgb(argb) {
  const linearR = linearized(redFromArgb(argb));
  const linearG = linearized(greenFromArgb(argb));
  const linearB = linearized(blueFromArgb(argb));
  const matrix = SRGB_TO_XYZ;
  const x = matrix[0][0] * linearR + matrix[0][1] * linearG + matrix[0][2] * linearB;
  const y = matrix[1][0] * linearR + matrix[1][1] * linearG + matrix[1][2] * linearB;
  const z = matrix[2][0] * linearR + matrix[2][1] * linearG + matrix[2][2] * linearB;
  const whitePoint = WHITE_POINT_D65;
  const xNormalized = x / whitePoint[0];
  const yNormalized = y / whitePoint[1];
  const zNormalized = z / whitePoint[2];
  const fx = labF(xNormalized);
  const fy = labF(yNormalized);
  const fz = labF(zNormalized);
  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);
  return [l, a, b];
}
function argbFromLstar(lstar) {
  const y = yFromLstar(lstar);
  const component = delinearized(y);
  return argbFromRgb(component, component, component);
}
function lstarFromArgb(argb) {
  const y = xyzFromArgb(argb)[1];
  return 116 * labF(y / 100) - 16;
}
function yFromLstar(lstar) {
  return 100 * labInvf((lstar + 16) / 116);
}
function lstarFromY(y) {
  return labF(y / 100) * 116 - 16;
}
function linearized(rgbComponent) {
  const normalized = rgbComponent / 255;
  if (normalized <= 0.040449936) {
    return normalized / 12.92 * 100;
  } else {
    return Math.pow((normalized + 0.055) / 1.055, 2.4) * 100;
  }
}
function delinearized(rgbComponent) {
  const normalized = rgbComponent / 100;
  let delinearized2 = 0;
  if (normalized <= 31308e-7) {
    delinearized2 = normalized * 12.92;
  } else {
    delinearized2 = 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
  }
  return clampInt(0, 255, Math.round(delinearized2 * 255));
}
function whitePointD65() {
  return WHITE_POINT_D65;
}
function rgbaFromArgb(argb) {
  const r = redFromArgb(argb);
  const g = greenFromArgb(argb);
  const b = blueFromArgb(argb);
  const a = alphaFromArgb(argb);
  return { r, g, b, a };
}
function argbFromRgba({ r, g, b, a }) {
  const rValue = clampComponent(r);
  const gValue = clampComponent(g);
  const bValue = clampComponent(b);
  const aValue = clampComponent(a);
  return aValue << 24 | rValue << 16 | gValue << 8 | bValue;
}
function clampComponent(value) {
  if (value < 0)
    return 0;
  if (value > 255)
    return 255;
  return value;
}
function labF(t) {
  const e = 216 / 24389;
  const kappa = 24389 / 27;
  if (t > e) {
    return Math.pow(t, 1 / 3);
  } else {
    return (kappa * t + 16) / 116;
  }
}
function labInvf(ft) {
  const e = 216 / 24389;
  const kappa = 24389 / 27;
  const ft3 = ft * ft * ft;
  if (ft3 > e) {
    return ft3;
  } else {
    return (116 * ft - 16) / kappa;
  }
}
var SRGB_TO_XYZ, XYZ_TO_SRGB, WHITE_POINT_D65;
var init_color_utils = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/color_utils.js"() {
    init_math_utils();
    SRGB_TO_XYZ = [
      [0.41233895, 0.35762064, 0.18051042],
      [0.2126, 0.7152, 0.0722],
      [0.01932141, 0.11916382, 0.95034478]
    ];
    XYZ_TO_SRGB = [
      [
        3.2413774792388685,
        -1.5376652402851851,
        -0.49885366846268053
      ],
      [
        -0.9691452513005321,
        1.8758853451067872,
        0.04156585616912061
      ],
      [
        0.05562093689691305,
        -0.20395524564742123,
        1.0571799111220335
      ]
    ];
    WHITE_POINT_D65 = [95.047, 100, 108.883];
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/viewing_conditions.js
var ViewingConditions;
var init_viewing_conditions = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/viewing_conditions.js"() {
    init_color_utils();
    init_math_utils();
    ViewingConditions = class {
      static make(whitePoint = whitePointD65(), adaptingLuminance = 200 / Math.PI * yFromLstar(50) / 100, backgroundLstar = 50, surround = 2, discountingIlluminant = false) {
        const xyz = whitePoint;
        const rW = xyz[0] * 0.401288 + xyz[1] * 0.650173 + xyz[2] * -0.051461;
        const gW = xyz[0] * -0.250268 + xyz[1] * 1.204414 + xyz[2] * 0.045854;
        const bW = xyz[0] * -2079e-6 + xyz[1] * 0.048952 + xyz[2] * 0.953127;
        const f = 0.8 + surround / 10;
        const c = f >= 0.9 ? lerp(0.59, 0.69, (f - 0.9) * 10) : lerp(0.525, 0.59, (f - 0.8) * 10);
        let d = discountingIlluminant ? 1 : f * (1 - 1 / 3.6 * Math.exp((-adaptingLuminance - 42) / 92));
        d = d > 1 ? 1 : d < 0 ? 0 : d;
        const nc = f;
        const rgbD = [
          d * (100 / rW) + 1 - d,
          d * (100 / gW) + 1 - d,
          d * (100 / bW) + 1 - d
        ];
        const k = 1 / (5 * adaptingLuminance + 1);
        const k4 = k * k * k * k;
        const k4F = 1 - k4;
        const fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance);
        const n = yFromLstar(backgroundLstar) / whitePoint[1];
        const z = 1.48 + Math.sqrt(n);
        const nbb = 0.725 / Math.pow(n, 0.2);
        const ncb = nbb;
        const rgbAFactors = [
          Math.pow(fl * rgbD[0] * rW / 100, 0.42),
          Math.pow(fl * rgbD[1] * gW / 100, 0.42),
          Math.pow(fl * rgbD[2] * bW / 100, 0.42)
        ];
        const rgbA = [
          400 * rgbAFactors[0] / (rgbAFactors[0] + 27.13),
          400 * rgbAFactors[1] / (rgbAFactors[1] + 27.13),
          400 * rgbAFactors[2] / (rgbAFactors[2] + 27.13)
        ];
        const aw = (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;
        return new ViewingConditions(n, aw, nbb, ncb, c, nc, rgbD, fl, Math.pow(fl, 0.25), z);
      }
      constructor(n, aw, nbb, ncb, c, nc, rgbD, fl, fLRoot, z) {
        this.n = n;
        this.aw = aw;
        this.nbb = nbb;
        this.ncb = ncb;
        this.c = c;
        this.nc = nc;
        this.rgbD = rgbD;
        this.fl = fl;
        this.fLRoot = fLRoot;
        this.z = z;
      }
    };
    ViewingConditions.DEFAULT = ViewingConditions.make();
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/cam16.js
var Cam16;
var init_cam16 = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/cam16.js"() {
    init_color_utils();
    init_math_utils();
    init_viewing_conditions();
    Cam16 = class {
      constructor(hue, chroma, j, q, m, s, jstar, astar, bstar) {
        this.hue = hue;
        this.chroma = chroma;
        this.j = j;
        this.q = q;
        this.m = m;
        this.s = s;
        this.jstar = jstar;
        this.astar = astar;
        this.bstar = bstar;
      }
      distance(other) {
        const dJ = this.jstar - other.jstar;
        const dA = this.astar - other.astar;
        const dB = this.bstar - other.bstar;
        const dEPrime = Math.sqrt(dJ * dJ + dA * dA + dB * dB);
        const dE = 1.41 * Math.pow(dEPrime, 0.63);
        return dE;
      }
      static fromInt(argb) {
        return Cam16.fromIntInViewingConditions(argb, ViewingConditions.DEFAULT);
      }
      static fromIntInViewingConditions(argb, viewingConditions) {
        const red = (argb & 16711680) >> 16;
        const green = (argb & 65280) >> 8;
        const blue = argb & 255;
        const redL = linearized(red);
        const greenL = linearized(green);
        const blueL = linearized(blue);
        const x = 0.41233895 * redL + 0.35762064 * greenL + 0.18051042 * blueL;
        const y = 0.2126 * redL + 0.7152 * greenL + 0.0722 * blueL;
        const z = 0.01932141 * redL + 0.11916382 * greenL + 0.95034478 * blueL;
        const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
        const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
        const bC = -2079e-6 * x + 0.048952 * y + 0.953127 * z;
        const rD = viewingConditions.rgbD[0] * rC;
        const gD = viewingConditions.rgbD[1] * gC;
        const bD = viewingConditions.rgbD[2] * bC;
        const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, 0.42);
        const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, 0.42);
        const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, 0.42);
        const rA = signum(rD) * 400 * rAF / (rAF + 27.13);
        const gA = signum(gD) * 400 * gAF / (gAF + 27.13);
        const bA = signum(bD) * 400 * bAF / (bAF + 27.13);
        const a = (11 * rA + -12 * gA + bA) / 11;
        const b = (rA + gA - 2 * bA) / 9;
        const u = (20 * rA + 20 * gA + 21 * bA) / 20;
        const p2 = (40 * rA + 20 * gA + bA) / 20;
        const atan2 = Math.atan2(b, a);
        const atanDegrees = atan2 * 180 / Math.PI;
        const hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
        const hueRadians = hue * Math.PI / 180;
        const ac = p2 * viewingConditions.nbb;
        const j = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
        const q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
        const huePrime = hue < 20.14 ? hue + 360 : hue;
        const eHue = 0.25 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8);
        const p1 = 5e4 / 13 * eHue * viewingConditions.nc * viewingConditions.ncb;
        const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
        const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        const c = alpha * Math.sqrt(j / 100);
        const m = c * viewingConditions.fLRoot;
        const s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
        const jstar = (1 + 100 * 7e-3) * j / (1 + 7e-3 * j);
        const mstar = 1 / 0.0228 * Math.log(1 + 0.0228 * m);
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(hue, c, j, q, m, s, jstar, astar, bstar);
      }
      static fromJch(j, c, h) {
        return Cam16.fromJchInViewingConditions(j, c, h, ViewingConditions.DEFAULT);
      }
      static fromJchInViewingConditions(j, c, h, viewingConditions) {
        const q = 4 / viewingConditions.c * Math.sqrt(j / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
        const m = c * viewingConditions.fLRoot;
        const alpha = c / Math.sqrt(j / 100);
        const s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
        const hueRadians = h * Math.PI / 180;
        const jstar = (1 + 100 * 7e-3) * j / (1 + 7e-3 * j);
        const mstar = 1 / 0.0228 * Math.log(1 + 0.0228 * m);
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(h, c, j, q, m, s, jstar, astar, bstar);
      }
      static fromUcs(jstar, astar, bstar) {
        return Cam16.fromUcsInViewingConditions(jstar, astar, bstar, ViewingConditions.DEFAULT);
      }
      static fromUcsInViewingConditions(jstar, astar, bstar, viewingConditions) {
        const a = astar;
        const b = bstar;
        const m = Math.sqrt(a * a + b * b);
        const M = (Math.exp(m * 0.0228) - 1) / 0.0228;
        const c = M / viewingConditions.fLRoot;
        let h = Math.atan2(b, a) * (180 / Math.PI);
        if (h < 0) {
          h += 360;
        }
        const j = jstar / (1 - (jstar - 100) * 7e-3);
        return Cam16.fromJchInViewingConditions(j, c, h, viewingConditions);
      }
      toInt() {
        return this.viewed(ViewingConditions.DEFAULT);
      }
      viewed(viewingConditions) {
        const alpha = this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100);
        const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1 / 0.9);
        const hRad = this.hue * Math.PI / 180;
        const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
        const ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z);
        const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
        const p2 = ac / viewingConditions.nbb;
        const hSin = Math.sin(hRad);
        const hCos = Math.cos(hRad);
        const gamma = 23 * (p2 + 0.305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
        const a = gamma * hCos;
        const b = gamma * hSin;
        const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
        const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
        const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;
        const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA)));
        const rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / 0.42);
        const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA)));
        const gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / 0.42);
        const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA)));
        const bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / 0.42);
        const rF = rC / viewingConditions.rgbD[0];
        const gF = gC / viewingConditions.rgbD[1];
        const bF = bC / viewingConditions.rgbD[2];
        const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
        const y = 0.38752654 * rF + 0.62144744 * gF - 897398e-8 * bF;
        const z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
        const argb = argbFromXyz(x, y, z);
        return argb;
      }
      static fromXyzInViewingConditions(x, y, z, viewingConditions) {
        const rC = 0.401288 * x + 0.650173 * y - 0.051461 * z;
        const gC = -0.250268 * x + 1.204414 * y + 0.045854 * z;
        const bC = -2079e-6 * x + 0.048952 * y + 0.953127 * z;
        const rD = viewingConditions.rgbD[0] * rC;
        const gD = viewingConditions.rgbD[1] * gC;
        const bD = viewingConditions.rgbD[2] * bC;
        const rAF = Math.pow(viewingConditions.fl * Math.abs(rD) / 100, 0.42);
        const gAF = Math.pow(viewingConditions.fl * Math.abs(gD) / 100, 0.42);
        const bAF = Math.pow(viewingConditions.fl * Math.abs(bD) / 100, 0.42);
        const rA = signum(rD) * 400 * rAF / (rAF + 27.13);
        const gA = signum(gD) * 400 * gAF / (gAF + 27.13);
        const bA = signum(bD) * 400 * bAF / (bAF + 27.13);
        const a = (11 * rA + -12 * gA + bA) / 11;
        const b = (rA + gA - 2 * bA) / 9;
        const u = (20 * rA + 20 * gA + 21 * bA) / 20;
        const p2 = (40 * rA + 20 * gA + bA) / 20;
        const atan2 = Math.atan2(b, a);
        const atanDegrees = atan2 * 180 / Math.PI;
        const hue = atanDegrees < 0 ? atanDegrees + 360 : atanDegrees >= 360 ? atanDegrees - 360 : atanDegrees;
        const hueRadians = hue * Math.PI / 180;
        const ac = p2 * viewingConditions.nbb;
        const J = 100 * Math.pow(ac / viewingConditions.aw, viewingConditions.c * viewingConditions.z);
        const Q = 4 / viewingConditions.c * Math.sqrt(J / 100) * (viewingConditions.aw + 4) * viewingConditions.fLRoot;
        const huePrime = hue < 20.14 ? hue + 360 : hue;
        const eHue = 1 / 4 * (Math.cos(huePrime * Math.PI / 180 + 2) + 3.8);
        const p1 = 5e4 / 13 * eHue * viewingConditions.nc * viewingConditions.ncb;
        const t = p1 * Math.sqrt(a * a + b * b) / (u + 0.305);
        const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        const C = alpha * Math.sqrt(J / 100);
        const M = C * viewingConditions.fLRoot;
        const s = 50 * Math.sqrt(alpha * viewingConditions.c / (viewingConditions.aw + 4));
        const jstar = (1 + 100 * 7e-3) * J / (1 + 7e-3 * J);
        const mstar = Math.log(1 + 0.0228 * M) / 0.0228;
        const astar = mstar * Math.cos(hueRadians);
        const bstar = mstar * Math.sin(hueRadians);
        return new Cam16(hue, C, J, Q, M, s, jstar, astar, bstar);
      }
      xyzInViewingConditions(viewingConditions) {
        const alpha = this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100);
        const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73), 1 / 0.9);
        const hRad = this.hue * Math.PI / 180;
        const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
        const ac = viewingConditions.aw * Math.pow(this.j / 100, 1 / viewingConditions.c / viewingConditions.z);
        const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
        const p2 = ac / viewingConditions.nbb;
        const hSin = Math.sin(hRad);
        const hCos = Math.cos(hRad);
        const gamma = 23 * (p2 + 0.305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
        const a = gamma * hCos;
        const b = gamma * hSin;
        const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
        const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
        const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;
        const rCBase = Math.max(0, 27.13 * Math.abs(rA) / (400 - Math.abs(rA)));
        const rC = signum(rA) * (100 / viewingConditions.fl) * Math.pow(rCBase, 1 / 0.42);
        const gCBase = Math.max(0, 27.13 * Math.abs(gA) / (400 - Math.abs(gA)));
        const gC = signum(gA) * (100 / viewingConditions.fl) * Math.pow(gCBase, 1 / 0.42);
        const bCBase = Math.max(0, 27.13 * Math.abs(bA) / (400 - Math.abs(bA)));
        const bC = signum(bA) * (100 / viewingConditions.fl) * Math.pow(bCBase, 1 / 0.42);
        const rF = rC / viewingConditions.rgbD[0];
        const gF = gC / viewingConditions.rgbD[1];
        const bF = bC / viewingConditions.rgbD[2];
        const x = 1.86206786 * rF - 1.01125463 * gF + 0.14918677 * bF;
        const y = 0.38752654 * rF + 0.62144744 * gF - 897398e-8 * bF;
        const z = -0.0158415 * rF - 0.03412294 * gF + 1.04996444 * bF;
        return [x, y, z];
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/hct_solver.js
var HctSolver;
var init_hct_solver = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/hct_solver.js"() {
    init_color_utils();
    init_math_utils();
    init_cam16();
    init_viewing_conditions();
    HctSolver = class {
      static sanitizeRadians(angle) {
        return (angle + Math.PI * 8) % (Math.PI * 2);
      }
      static trueDelinearized(rgbComponent) {
        const normalized = rgbComponent / 100;
        let delinearized2 = 0;
        if (normalized <= 31308e-7) {
          delinearized2 = normalized * 12.92;
        } else {
          delinearized2 = 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
        }
        return delinearized2 * 255;
      }
      static chromaticAdaptation(component) {
        const af = Math.pow(Math.abs(component), 0.42);
        return signum(component) * 400 * af / (af + 27.13);
      }
      static hueOf(linrgb) {
        const scaledDiscount = matrixMultiply(linrgb, HctSolver.SCALED_DISCOUNT_FROM_LINRGB);
        const rA = HctSolver.chromaticAdaptation(scaledDiscount[0]);
        const gA = HctSolver.chromaticAdaptation(scaledDiscount[1]);
        const bA = HctSolver.chromaticAdaptation(scaledDiscount[2]);
        const a = (11 * rA + -12 * gA + bA) / 11;
        const b = (rA + gA - 2 * bA) / 9;
        return Math.atan2(b, a);
      }
      static areInCyclicOrder(a, b, c) {
        const deltaAB = HctSolver.sanitizeRadians(b - a);
        const deltaAC = HctSolver.sanitizeRadians(c - a);
        return deltaAB < deltaAC;
      }
      static intercept(source, mid, target) {
        return (mid - source) / (target - source);
      }
      static lerpPoint(source, t, target) {
        return [
          source[0] + (target[0] - source[0]) * t,
          source[1] + (target[1] - source[1]) * t,
          source[2] + (target[2] - source[2]) * t
        ];
      }
      static setCoordinate(source, coordinate, target, axis) {
        const t = HctSolver.intercept(source[axis], coordinate, target[axis]);
        return HctSolver.lerpPoint(source, t, target);
      }
      static isBounded(x) {
        return 0 <= x && x <= 100;
      }
      static nthVertex(y, n) {
        const kR = HctSolver.Y_FROM_LINRGB[0];
        const kG = HctSolver.Y_FROM_LINRGB[1];
        const kB = HctSolver.Y_FROM_LINRGB[2];
        const coordA = n % 4 <= 1 ? 0 : 100;
        const coordB = n % 2 === 0 ? 0 : 100;
        if (n < 4) {
          const g = coordA;
          const b = coordB;
          const r = (y - g * kG - b * kB) / kR;
          if (HctSolver.isBounded(r)) {
            return [r, g, b];
          } else {
            return [-1, -1, -1];
          }
        } else if (n < 8) {
          const b = coordA;
          const r = coordB;
          const g = (y - r * kR - b * kB) / kG;
          if (HctSolver.isBounded(g)) {
            return [r, g, b];
          } else {
            return [-1, -1, -1];
          }
        } else {
          const r = coordA;
          const g = coordB;
          const b = (y - r * kR - g * kG) / kB;
          if (HctSolver.isBounded(b)) {
            return [r, g, b];
          } else {
            return [-1, -1, -1];
          }
        }
      }
      static bisectToSegment(y, targetHue) {
        let left = [-1, -1, -1];
        let right = left;
        let leftHue = 0;
        let rightHue = 0;
        let initialized = false;
        let uncut = true;
        for (let n = 0; n < 12; n++) {
          const mid = HctSolver.nthVertex(y, n);
          if (mid[0] < 0) {
            continue;
          }
          const midHue = HctSolver.hueOf(mid);
          if (!initialized) {
            left = mid;
            right = mid;
            leftHue = midHue;
            rightHue = midHue;
            initialized = true;
            continue;
          }
          if (uncut || HctSolver.areInCyclicOrder(leftHue, midHue, rightHue)) {
            uncut = false;
            if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
              right = mid;
              rightHue = midHue;
            } else {
              left = mid;
              leftHue = midHue;
            }
          }
        }
        return [left, right];
      }
      static midpoint(a, b) {
        return [
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          (a[2] + b[2]) / 2
        ];
      }
      static criticalPlaneBelow(x) {
        return Math.floor(x - 0.5);
      }
      static criticalPlaneAbove(x) {
        return Math.ceil(x - 0.5);
      }
      static bisectToLimit(y, targetHue) {
        const segment = HctSolver.bisectToSegment(y, targetHue);
        let left = segment[0];
        let leftHue = HctSolver.hueOf(left);
        let right = segment[1];
        for (let axis = 0; axis < 3; axis++) {
          if (left[axis] !== right[axis]) {
            let lPlane = -1;
            let rPlane = 255;
            if (left[axis] < right[axis]) {
              lPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(left[axis]));
              rPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(right[axis]));
            } else {
              lPlane = HctSolver.criticalPlaneAbove(HctSolver.trueDelinearized(left[axis]));
              rPlane = HctSolver.criticalPlaneBelow(HctSolver.trueDelinearized(right[axis]));
            }
            for (let i = 0; i < 8; i++) {
              if (Math.abs(rPlane - lPlane) <= 1) {
                break;
              } else {
                const mPlane = Math.floor((lPlane + rPlane) / 2);
                const midPlaneCoordinate = HctSolver.CRITICAL_PLANES[mPlane];
                const mid = HctSolver.setCoordinate(left, midPlaneCoordinate, right, axis);
                const midHue = HctSolver.hueOf(mid);
                if (HctSolver.areInCyclicOrder(leftHue, targetHue, midHue)) {
                  right = mid;
                  rPlane = mPlane;
                } else {
                  left = mid;
                  leftHue = midHue;
                  lPlane = mPlane;
                }
              }
            }
          }
        }
        return HctSolver.midpoint(left, right);
      }
      static inverseChromaticAdaptation(adapted) {
        const adaptedAbs = Math.abs(adapted);
        const base = Math.max(0, 27.13 * adaptedAbs / (400 - adaptedAbs));
        return signum(adapted) * Math.pow(base, 1 / 0.42);
      }
      static findResultByJ(hueRadians, chroma, y) {
        let j = Math.sqrt(y) * 11;
        const viewingConditions = ViewingConditions.DEFAULT;
        const tInnerCoeff = 1 / Math.pow(1.64 - Math.pow(0.29, viewingConditions.n), 0.73);
        const eHue = 0.25 * (Math.cos(hueRadians + 2) + 3.8);
        const p1 = eHue * (5e4 / 13) * viewingConditions.nc * viewingConditions.ncb;
        const hSin = Math.sin(hueRadians);
        const hCos = Math.cos(hueRadians);
        for (let iterationRound = 0; iterationRound < 5; iterationRound++) {
          const jNormalized = j / 100;
          const alpha = chroma === 0 || j === 0 ? 0 : chroma / Math.sqrt(jNormalized);
          const t = Math.pow(alpha * tInnerCoeff, 1 / 0.9);
          const ac = viewingConditions.aw * Math.pow(jNormalized, 1 / viewingConditions.c / viewingConditions.z);
          const p2 = ac / viewingConditions.nbb;
          const gamma = 23 * (p2 + 0.305) * t / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
          const a = gamma * hCos;
          const b = gamma * hSin;
          const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
          const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
          const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;
          const rCScaled = HctSolver.inverseChromaticAdaptation(rA);
          const gCScaled = HctSolver.inverseChromaticAdaptation(gA);
          const bCScaled = HctSolver.inverseChromaticAdaptation(bA);
          const linrgb = matrixMultiply([rCScaled, gCScaled, bCScaled], HctSolver.LINRGB_FROM_SCALED_DISCOUNT);
          if (linrgb[0] < 0 || linrgb[1] < 0 || linrgb[2] < 0) {
            return 0;
          }
          const kR = HctSolver.Y_FROM_LINRGB[0];
          const kG = HctSolver.Y_FROM_LINRGB[1];
          const kB = HctSolver.Y_FROM_LINRGB[2];
          const fnj = kR * linrgb[0] + kG * linrgb[1] + kB * linrgb[2];
          if (fnj <= 0) {
            return 0;
          }
          if (iterationRound === 4 || Math.abs(fnj - y) < 2e-3) {
            if (linrgb[0] > 100.01 || linrgb[1] > 100.01 || linrgb[2] > 100.01) {
              return 0;
            }
            return argbFromLinrgb(linrgb);
          }
          j = j - (fnj - y) * j / (2 * fnj);
        }
        return 0;
      }
      static solveToInt(hueDegrees, chroma, lstar) {
        if (chroma < 1e-4 || lstar < 1e-4 || lstar > 99.9999) {
          return argbFromLstar(lstar);
        }
        hueDegrees = sanitizeDegreesDouble(hueDegrees);
        const hueRadians = hueDegrees / 180 * Math.PI;
        const y = yFromLstar(lstar);
        const exactAnswer = HctSolver.findResultByJ(hueRadians, chroma, y);
        if (exactAnswer !== 0) {
          return exactAnswer;
        }
        const linrgb = HctSolver.bisectToLimit(y, hueRadians);
        return argbFromLinrgb(linrgb);
      }
      static solveToCam(hueDegrees, chroma, lstar) {
        return Cam16.fromInt(HctSolver.solveToInt(hueDegrees, chroma, lstar));
      }
    };
    HctSolver.SCALED_DISCOUNT_FROM_LINRGB = [
      [
        0.001200833568784504,
        0.002389694492170889,
        2795742885861124e-19
      ],
      [
        5891086651375999e-19,
        0.0029785502573438758,
        3270666104008398e-19
      ],
      [
        10146692491640572e-20,
        5364214359186694e-19,
        0.0032979401770712076
      ]
    ];
    HctSolver.LINRGB_FROM_SCALED_DISCOUNT = [
      [
        1373.2198709594231,
        -1100.4251190754821,
        -7.278681089101213
      ],
      [
        -271.815969077903,
        559.6580465940733,
        -32.46047482791194
      ],
      [
        1.9622899599665666,
        -57.173814538844006,
        308.7233197812385
      ]
    ];
    HctSolver.Y_FROM_LINRGB = [0.2126, 0.7152, 0.0722];
    HctSolver.CRITICAL_PLANES = [
      0.015176349177441876,
      0.045529047532325624,
      0.07588174588720938,
      0.10623444424209313,
      0.13658714259697685,
      0.16693984095186062,
      0.19729253930674434,
      0.2276452376616281,
      0.2579979360165119,
      0.28835063437139563,
      0.3188300904430532,
      0.350925934958123,
      0.3848314933096426,
      0.42057480301049466,
      0.458183274052838,
      0.4976837250274023,
      0.5391024159806381,
      0.5824650784040898,
      0.6277969426914107,
      0.6751227633498623,
      0.7244668422128921,
      0.775853049866786,
      0.829304845476233,
      0.8848452951698498,
      0.942497089126609,
      1.0022825574869039,
      1.0642236851973577,
      1.1283421258858297,
      1.1946592148522128,
      1.2631959812511864,
      1.3339731595349034,
      1.407011200216447,
      1.4823302800086415,
      1.5599503113873272,
      1.6398909516233677,
      1.7221716113234105,
      1.8068114625156377,
      1.8938294463134073,
      1.9832442801866852,
      2.075074464868551,
      2.1693382909216234,
      2.2660538449872063,
      2.36523901573795,
      2.4669114995532007,
      2.5710888059345764,
      2.6777882626779785,
      2.7870270208169257,
      2.898822059350997,
      3.0131901897720907,
      3.1301480604002863,
      3.2497121605402226,
      3.3718988244681087,
      3.4967242352587946,
      3.624204428461639,
      3.754355295633311,
      3.887192587735158,
      4.022731918402185,
      4.160988767090289,
      4.301978482107941,
      4.445716283538092,
      4.592217266055746,
      4.741496401646282,
      4.893568542229298,
      5.048448422192488,
      5.20615066083972,
      5.3666897647573375,
      5.5300801301023865,
      5.696336044816294,
      5.865471690767354,
      6.037501145825082,
      6.212438385869475,
      6.390297286737924,
      6.571091626112461,
      6.7548350853498045,
      6.941541251256611,
      7.131223617812143,
      7.323895587840543,
      7.5195704746346665,
      7.7182615035334345,
      7.919981813454504,
      8.124744458384042,
      8.332562408825165,
      8.543448553206703,
      8.757415699253682,
      8.974476575321063,
      9.194643831691977,
      9.417930041841839,
      9.644347703669503,
      9.873909240696694,
      10.106627003236781,
      10.342513269534024,
      10.58158024687427,
      10.8238400726681,
      11.069304815507364,
      11.317986476196008,
      11.569896988756009,
      11.825048221409341,
      12.083451977536606,
      12.345119996613247,
      12.610063955123938,
      12.878295467455942,
      13.149826086772048,
      13.42466730586372,
      13.702830557985108,
      13.984327217668513,
      14.269168601521828,
      14.55736596900856,
      14.848930523210871,
      15.143873411576273,
      15.44220572664832,
      15.743938506781891,
      16.04908273684337,
      16.35764934889634,
      16.66964922287304,
      16.985093187232053,
      17.30399201960269,
      17.62635644741625,
      17.95219714852476,
      18.281524751807332,
      18.614349837764564,
      18.95068293910138,
      19.290534541298456,
      19.633915083172692,
      19.98083495742689,
      20.331304511189067,
      20.685334046541502,
      21.042933821039977,
      21.404114048223256,
      21.76888489811322,
      22.137256497705877,
      22.50923893145328,
      22.884842241736916,
      23.264076429332462,
      23.6469514538663,
      24.033477234264016,
      24.42366364919083,
      24.817520537484558,
      25.21505769858089,
      25.61628489293138,
      26.021211842414342,
      26.429848230738664,
      26.842203703840827,
      27.258287870275353,
      27.678110301598522,
      28.10168053274597,
      28.529008062403893,
      28.96010235337422,
      29.39497283293396,
      29.83362889318845,
      30.276079891419332,
      30.722335150426627,
      31.172403958865512,
      31.62629557157785,
      32.08401920991837,
      32.54558406207592,
      33.010999283389665,
      33.4802739966603,
      33.953417292456834,
      34.430438229418264,
      34.911345834551085,
      35.39614910352207,
      35.88485700094671,
      36.37747846067349,
      36.87402238606382,
      37.37449765026789,
      37.87891309649659,
      38.38727753828926,
      38.89959975977785,
      39.41588851594697,
      39.93615253289054,
      40.460400508064545,
      40.98864111053629,
      41.520882981230194,
      42.05713473317016,
      42.597404951718396,
      43.141702194811224,
      43.6900349931913,
      44.24241185063697,
      44.798841244188324,
      45.35933162437017,
      45.92389141541209,
      46.49252901546552,
      47.065252796817916,
      47.64207110610409,
      48.22299226451468,
      48.808024568002054,
      49.3971762874833,
      49.9904556690408,
      50.587870934119984,
      51.189430279724725,
      51.79514187861014,
      52.40501387947288,
      53.0190544071392,
      53.637271562750364,
      54.259673423945976,
      54.88626804504493,
      55.517063457223934,
      56.15206766869424,
      56.79128866487574,
      57.43473440856916,
      58.08241284012621,
      58.734331877617365,
      59.39049941699807,
      60.05092333227251,
      60.715611475655585,
      61.38457167773311,
      62.057811747619894,
      62.7353394731159,
      63.417162620860914,
      64.10328893648692,
      64.79372614476921,
      65.48848194977529,
      66.18756403501224,
      66.89098006357258,
      67.59873767827808,
      68.31084450182222,
      69.02730813691093,
      69.74813616640164,
      70.47333615344107,
      71.20291564160104,
      71.93688215501312,
      72.67524319850172,
      73.41800625771542,
      74.16517879925733,
      74.9167682708136,
      75.67278210128072,
      76.43322770089146,
      77.1981124613393,
      77.96744375590167,
      78.74122893956174,
      79.51947534912904,
      80.30219030335869,
      81.08938110306934,
      81.88105503125999,
      82.67721935322541,
      83.4778813166706,
      84.28304815182372,
      85.09272707154808,
      85.90692527145302,
      86.72564993000343,
      87.54890820862819,
      88.3767072518277,
      89.2090541872801,
      90.04595612594655,
      90.88742016217518,
      91.73345337380438,
      92.58406282226491,
      93.43925555268066,
      94.29903859396902,
      95.16341895893969,
      96.03240364439274,
      96.9059996312159,
      97.78421388448044,
      98.6670533535366,
      99.55452497210776
    ];
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/hct.js
var Hct;
var init_hct = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/hct/hct.js"() {
    init_color_utils();
    init_cam16();
    init_hct_solver();
    init_viewing_conditions();
    Hct = class {
      static from(hue, chroma, tone) {
        return new Hct(HctSolver.solveToInt(hue, chroma, tone));
      }
      static fromInt(argb) {
        return new Hct(argb);
      }
      toInt() {
        return this.argb;
      }
      get hue() {
        return this.internalHue;
      }
      set hue(newHue) {
        this.setInternalState(HctSolver.solveToInt(newHue, this.internalChroma, this.internalTone));
      }
      get chroma() {
        return this.internalChroma;
      }
      set chroma(newChroma) {
        this.setInternalState(HctSolver.solveToInt(this.internalHue, newChroma, this.internalTone));
      }
      get tone() {
        return this.internalTone;
      }
      set tone(newTone) {
        this.setInternalState(HctSolver.solveToInt(this.internalHue, this.internalChroma, newTone));
      }
      constructor(argb) {
        this.argb = argb;
        const cam = Cam16.fromInt(argb);
        this.internalHue = cam.hue;
        this.internalChroma = cam.chroma;
        this.internalTone = lstarFromArgb(argb);
        this.argb = argb;
      }
      setInternalState(argb) {
        const cam = Cam16.fromInt(argb);
        this.internalHue = cam.hue;
        this.internalChroma = cam.chroma;
        this.internalTone = lstarFromArgb(argb);
        this.argb = argb;
      }
      inViewingConditions(vc) {
        const cam = Cam16.fromInt(this.toInt());
        const viewedInVc = cam.xyzInViewingConditions(vc);
        const recastInVc = Cam16.fromXyzInViewingConditions(viewedInVc[0], viewedInVc[1], viewedInVc[2], ViewingConditions.make());
        const recastHct = Hct.from(recastInVc.hue, recastInVc.chroma, lstarFromY(viewedInVc[1]));
        return recastHct;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/blend/blend.js
var Blend;
var init_blend = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/blend/blend.js"() {
    init_cam16();
    init_hct();
    init_color_utils();
    init_math_utils();
    Blend = class {
      static harmonize(designColor, sourceColor) {
        const fromHct = Hct.fromInt(designColor);
        const toHct = Hct.fromInt(sourceColor);
        const differenceDegrees2 = differenceDegrees(fromHct.hue, toHct.hue);
        const rotationDegrees = Math.min(differenceDegrees2 * 0.5, 15);
        const outputHue = sanitizeDegreesDouble(fromHct.hue + rotationDegrees * rotationDirection(fromHct.hue, toHct.hue));
        return Hct.from(outputHue, fromHct.chroma, fromHct.tone).toInt();
      }
      static hctHue(from, to, amount) {
        const ucs = Blend.cam16Ucs(from, to, amount);
        const ucsCam = Cam16.fromInt(ucs);
        const fromCam = Cam16.fromInt(from);
        const blended = Hct.from(ucsCam.hue, fromCam.chroma, lstarFromArgb(from));
        return blended.toInt();
      }
      static cam16Ucs(from, to, amount) {
        const fromCam = Cam16.fromInt(from);
        const toCam = Cam16.fromInt(to);
        const fromJ = fromCam.jstar;
        const fromA = fromCam.astar;
        const fromB = fromCam.bstar;
        const toJ = toCam.jstar;
        const toA = toCam.astar;
        const toB = toCam.bstar;
        const jstar = fromJ + (toJ - fromJ) * amount;
        const astar = fromA + (toA - fromA) * amount;
        const bstar = fromB + (toB - fromB) * amount;
        return Cam16.fromUcs(jstar, astar, bstar).toInt();
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/contrast/contrast.js
var Contrast;
var init_contrast = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/contrast/contrast.js"() {
    init_color_utils();
    init_math_utils();
    Contrast = class {
      static ratioOfTones(toneA, toneB) {
        toneA = clampDouble(0, 100, toneA);
        toneB = clampDouble(0, 100, toneB);
        return Contrast.ratioOfYs(yFromLstar(toneA), yFromLstar(toneB));
      }
      static ratioOfYs(y1, y2) {
        const lighter = y1 > y2 ? y1 : y2;
        const darker = lighter === y2 ? y1 : y2;
        return (lighter + 5) / (darker + 5);
      }
      static lighter(tone, ratio) {
        if (tone < 0 || tone > 100) {
          return -1;
        }
        const darkY = yFromLstar(tone);
        const lightY = ratio * (darkY + 5) - 5;
        const realContrast = Contrast.ratioOfYs(lightY, darkY);
        const delta = Math.abs(realContrast - ratio);
        if (realContrast < ratio && delta > 0.04) {
          return -1;
        }
        const returnValue = lstarFromY(lightY) + 0.4;
        if (returnValue < 0 || returnValue > 100) {
          return -1;
        }
        return returnValue;
      }
      static darker(tone, ratio) {
        if (tone < 0 || tone > 100) {
          return -1;
        }
        const lightY = yFromLstar(tone);
        const darkY = (lightY + 5) / ratio - 5;
        const realContrast = Contrast.ratioOfYs(lightY, darkY);
        const delta = Math.abs(realContrast - ratio);
        if (realContrast < ratio && delta > 0.04) {
          return -1;
        }
        const returnValue = lstarFromY(darkY) - 0.4;
        if (returnValue < 0 || returnValue > 100) {
          return -1;
        }
        return returnValue;
      }
      static lighterUnsafe(tone, ratio) {
        const lighterSafe = Contrast.lighter(tone, ratio);
        return lighterSafe < 0 ? 100 : lighterSafe;
      }
      static darkerUnsafe(tone, ratio) {
        const darkerSafe = Contrast.darker(tone, ratio);
        return darkerSafe < 0 ? 0 : darkerSafe;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dislike/dislike_analyzer.js
var DislikeAnalyzer;
var init_dislike_analyzer = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dislike/dislike_analyzer.js"() {
    init_hct();
    DislikeAnalyzer = class {
      static isDisliked(hct) {
        const huePasses = Math.round(hct.hue) >= 90 && Math.round(hct.hue) <= 111;
        const chromaPasses = Math.round(hct.chroma) > 16;
        const tonePasses = Math.round(hct.tone) < 65;
        return huePasses && chromaPasses && tonePasses;
      }
      static fixIfDisliked(hct) {
        if (DislikeAnalyzer.isDisliked(hct)) {
          return Hct.from(hct.hue, hct.chroma, 70);
        }
        return hct;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_color.js
var DynamicColor;
var init_dynamic_color = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_color.js"() {
    init_contrast();
    init_math_utils();
    DynamicColor = class {
      static fromPalette(args) {
        var _a, _b;
        return new DynamicColor((_a = args.name) != null ? _a : "", args.palette, args.tone, (_b = args.isBackground) != null ? _b : false, args.background, args.secondBackground, args.contrastCurve, args.toneDeltaPair);
      }
      constructor(name, palette, tone, isBackground, background, secondBackground, contrastCurve, toneDeltaPair) {
        this.name = name;
        this.palette = palette;
        this.tone = tone;
        this.isBackground = isBackground;
        this.background = background;
        this.secondBackground = secondBackground;
        this.contrastCurve = contrastCurve;
        this.toneDeltaPair = toneDeltaPair;
        this.hctCache = /* @__PURE__ */ new Map();
        if (!background && secondBackground) {
          throw new Error(`Color ${name} has secondBackgrounddefined, but background is not defined.`);
        }
        if (!background && contrastCurve) {
          throw new Error(`Color ${name} has contrastCurvedefined, but background is not defined.`);
        }
        if (background && !contrastCurve) {
          throw new Error(`Color ${name} has backgrounddefined, but contrastCurve is not defined.`);
        }
      }
      getArgb(scheme) {
        return this.getHct(scheme).toInt();
      }
      getHct(scheme) {
        const cachedAnswer = this.hctCache.get(scheme);
        if (cachedAnswer != null) {
          return cachedAnswer;
        }
        const tone = this.getTone(scheme);
        const answer = this.palette(scheme).getHct(tone);
        if (this.hctCache.size > 4) {
          this.hctCache.clear();
        }
        this.hctCache.set(scheme, answer);
        return answer;
      }
      getTone(scheme) {
        const decreasingContrast = scheme.contrastLevel < 0;
        if (this.toneDeltaPair) {
          const toneDeltaPair = this.toneDeltaPair(scheme);
          const roleA = toneDeltaPair.roleA;
          const roleB = toneDeltaPair.roleB;
          const delta = toneDeltaPair.delta;
          const polarity = toneDeltaPair.polarity;
          const stayTogether = toneDeltaPair.stayTogether;
          const bg = this.background(scheme);
          const bgTone = bg.getTone(scheme);
          const aIsNearer = polarity === "nearer" || polarity === "lighter" && !scheme.isDark || polarity === "darker" && scheme.isDark;
          const nearer = aIsNearer ? roleA : roleB;
          const farther = aIsNearer ? roleB : roleA;
          const amNearer = this.name === nearer.name;
          const expansionDir = scheme.isDark ? 1 : -1;
          const nContrast = nearer.contrastCurve.get(scheme.contrastLevel);
          const fContrast = farther.contrastCurve.get(scheme.contrastLevel);
          const nInitialTone = nearer.tone(scheme);
          let nTone = Contrast.ratioOfTones(bgTone, nInitialTone) >= nContrast ? nInitialTone : DynamicColor.foregroundTone(bgTone, nContrast);
          const fInitialTone = farther.tone(scheme);
          let fTone = Contrast.ratioOfTones(bgTone, fInitialTone) >= fContrast ? fInitialTone : DynamicColor.foregroundTone(bgTone, fContrast);
          if (decreasingContrast) {
            nTone = DynamicColor.foregroundTone(bgTone, nContrast);
            fTone = DynamicColor.foregroundTone(bgTone, fContrast);
          }
          if ((fTone - nTone) * expansionDir >= delta) {
          } else {
            fTone = clampDouble(0, 100, nTone + delta * expansionDir);
            if ((fTone - nTone) * expansionDir >= delta) {
            } else {
              nTone = clampDouble(0, 100, fTone - delta * expansionDir);
            }
          }
          if (50 <= nTone && nTone < 60) {
            if (expansionDir > 0) {
              nTone = 60;
              fTone = Math.max(fTone, nTone + delta * expansionDir);
            } else {
              nTone = 49;
              fTone = Math.min(fTone, nTone + delta * expansionDir);
            }
          } else if (50 <= fTone && fTone < 60) {
            if (stayTogether) {
              if (expansionDir > 0) {
                nTone = 60;
                fTone = Math.max(fTone, nTone + delta * expansionDir);
              } else {
                nTone = 49;
                fTone = Math.min(fTone, nTone + delta * expansionDir);
              }
            } else {
              if (expansionDir > 0) {
                fTone = 60;
              } else {
                fTone = 49;
              }
            }
          }
          return amNearer ? nTone : fTone;
        } else {
          let answer = this.tone(scheme);
          if (this.background == null) {
            return answer;
          }
          const bgTone = this.background(scheme).getTone(scheme);
          const desiredRatio = this.contrastCurve.get(scheme.contrastLevel);
          if (Contrast.ratioOfTones(bgTone, answer) >= desiredRatio) {
          } else {
            answer = DynamicColor.foregroundTone(bgTone, desiredRatio);
          }
          if (decreasingContrast) {
            answer = DynamicColor.foregroundTone(bgTone, desiredRatio);
          }
          if (this.isBackground && 50 <= answer && answer < 60) {
            if (Contrast.ratioOfTones(49, bgTone) >= desiredRatio) {
              answer = 49;
            } else {
              answer = 60;
            }
          }
          if (this.secondBackground) {
            const [bg1, bg2] = [this.background, this.secondBackground];
            const [bgTone1, bgTone2] = [bg1(scheme).getTone(scheme), bg2(scheme).getTone(scheme)];
            const [upper, lower] = [Math.max(bgTone1, bgTone2), Math.min(bgTone1, bgTone2)];
            if (Contrast.ratioOfTones(upper, answer) >= desiredRatio && Contrast.ratioOfTones(lower, answer) >= desiredRatio) {
              return answer;
            }
            const lightOption = Contrast.lighter(upper, desiredRatio);
            const darkOption = Contrast.darker(lower, desiredRatio);
            const availables = [];
            if (lightOption !== -1)
              availables.push(lightOption);
            if (darkOption !== -1)
              availables.push(darkOption);
            const prefersLight = DynamicColor.tonePrefersLightForeground(bgTone1) || DynamicColor.tonePrefersLightForeground(bgTone2);
            if (prefersLight) {
              return lightOption < 0 ? 100 : lightOption;
            }
            if (availables.length === 1) {
              return availables[0];
            }
            return darkOption < 0 ? 0 : darkOption;
          }
          return answer;
        }
      }
      static foregroundTone(bgTone, ratio) {
        const lighterTone = Contrast.lighterUnsafe(bgTone, ratio);
        const darkerTone = Contrast.darkerUnsafe(bgTone, ratio);
        const lighterRatio = Contrast.ratioOfTones(lighterTone, bgTone);
        const darkerRatio = Contrast.ratioOfTones(darkerTone, bgTone);
        const preferLighter = DynamicColor.tonePrefersLightForeground(bgTone);
        if (preferLighter) {
          const negligibleDifference = Math.abs(lighterRatio - darkerRatio) < 0.1 && lighterRatio < ratio && darkerRatio < ratio;
          return lighterRatio >= ratio || lighterRatio >= darkerRatio || negligibleDifference ? lighterTone : darkerTone;
        } else {
          return darkerRatio >= ratio || darkerRatio >= lighterRatio ? darkerTone : lighterTone;
        }
      }
      static tonePrefersLightForeground(tone) {
        return Math.round(tone) < 60;
      }
      static toneAllowsLightForeground(tone) {
        return Math.round(tone) <= 49;
      }
      static enableLightForeground(tone) {
        if (DynamicColor.tonePrefersLightForeground(tone) && !DynamicColor.toneAllowsLightForeground(tone)) {
          return 49;
        }
        return tone;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/palettes/tonal_palette.js
var TonalPalette, KeyColor;
var init_tonal_palette = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/palettes/tonal_palette.js"() {
    init_hct();
    TonalPalette = class {
      static fromInt(argb) {
        const hct = Hct.fromInt(argb);
        return TonalPalette.fromHct(hct);
      }
      static fromHct(hct) {
        return new TonalPalette(hct.hue, hct.chroma, hct);
      }
      static fromHueAndChroma(hue, chroma) {
        const keyColor = new KeyColor(hue, chroma).create();
        return new TonalPalette(hue, chroma, keyColor);
      }
      constructor(hue, chroma, keyColor) {
        this.hue = hue;
        this.chroma = chroma;
        this.keyColor = keyColor;
        this.cache = /* @__PURE__ */ new Map();
      }
      tone(tone) {
        let argb = this.cache.get(tone);
        if (argb === void 0) {
          argb = Hct.from(this.hue, this.chroma, tone).toInt();
          this.cache.set(tone, argb);
        }
        return argb;
      }
      getHct(tone) {
        return Hct.fromInt(this.tone(tone));
      }
    };
    KeyColor = class {
      constructor(hue, requestedChroma) {
        this.hue = hue;
        this.requestedChroma = requestedChroma;
        this.chromaCache = /* @__PURE__ */ new Map();
        this.maxChromaValue = 200;
      }
      create() {
        const pivotTone = 50;
        const toneStepSize = 1;
        const epsilon = 0.01;
        let lowerTone = 0;
        let upperTone = 100;
        while (lowerTone < upperTone) {
          const midTone = Math.floor((lowerTone + upperTone) / 2);
          const isAscending = this.maxChroma(midTone) < this.maxChroma(midTone + toneStepSize);
          const sufficientChroma = this.maxChroma(midTone) >= this.requestedChroma - epsilon;
          if (sufficientChroma) {
            if (Math.abs(lowerTone - pivotTone) < Math.abs(upperTone - pivotTone)) {
              upperTone = midTone;
            } else {
              if (lowerTone === midTone) {
                return Hct.from(this.hue, this.requestedChroma, lowerTone);
              }
              lowerTone = midTone;
            }
          } else {
            if (isAscending) {
              lowerTone = midTone + toneStepSize;
            } else {
              upperTone = midTone;
            }
          }
        }
        return Hct.from(this.hue, this.requestedChroma, lowerTone);
      }
      maxChroma(tone) {
        if (this.chromaCache.has(tone)) {
          return this.chromaCache.get(tone);
        }
        const chroma = Hct.from(this.hue, this.maxChromaValue, tone).chroma;
        this.chromaCache.set(tone, chroma);
        return chroma;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/contrast_curve.js
var ContrastCurve;
var init_contrast_curve = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/contrast_curve.js"() {
    init_math_utils();
    ContrastCurve = class {
      constructor(low, normal, medium, high) {
        this.low = low;
        this.normal = normal;
        this.medium = medium;
        this.high = high;
      }
      get(contrastLevel) {
        if (contrastLevel <= -1) {
          return this.low;
        } else if (contrastLevel < 0) {
          return lerp(this.low, this.normal, (contrastLevel - -1) / 1);
        } else if (contrastLevel < 0.5) {
          return lerp(this.normal, this.medium, (contrastLevel - 0) / 0.5);
        } else if (contrastLevel < 1) {
          return lerp(this.medium, this.high, (contrastLevel - 0.5) / 0.5);
        } else {
          return this.high;
        }
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/tone_delta_pair.js
var ToneDeltaPair;
var init_tone_delta_pair = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/tone_delta_pair.js"() {
    ToneDeltaPair = class {
      constructor(roleA, roleB, delta, polarity, stayTogether) {
        this.roleA = roleA;
        this.roleB = roleB;
        this.delta = delta;
        this.polarity = polarity;
        this.stayTogether = stayTogether;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/variant.js
var Variant;
var init_variant = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/variant.js"() {
    (function(Variant2) {
      Variant2[Variant2["MONOCHROME"] = 0] = "MONOCHROME";
      Variant2[Variant2["NEUTRAL"] = 1] = "NEUTRAL";
      Variant2[Variant2["TONAL_SPOT"] = 2] = "TONAL_SPOT";
      Variant2[Variant2["VIBRANT"] = 3] = "VIBRANT";
      Variant2[Variant2["EXPRESSIVE"] = 4] = "EXPRESSIVE";
      Variant2[Variant2["FIDELITY"] = 5] = "FIDELITY";
      Variant2[Variant2["CONTENT"] = 6] = "CONTENT";
      Variant2[Variant2["RAINBOW"] = 7] = "RAINBOW";
      Variant2[Variant2["FRUIT_SALAD"] = 8] = "FRUIT_SALAD";
    })(Variant || (Variant = {}));
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/material_dynamic_colors.js
function isFidelity(scheme) {
  return scheme.variant === Variant.FIDELITY || scheme.variant === Variant.CONTENT;
}
function isMonochrome(scheme) {
  return scheme.variant === Variant.MONOCHROME;
}
function findDesiredChromaByTone(hue, chroma, tone, byDecreasingTone) {
  let answer = tone;
  let closestToChroma = Hct.from(hue, chroma, tone);
  if (closestToChroma.chroma < chroma) {
    let chromaPeak = closestToChroma.chroma;
    while (closestToChroma.chroma < chroma) {
      answer += byDecreasingTone ? -1 : 1;
      const potentialSolution = Hct.from(hue, chroma, answer);
      if (chromaPeak > potentialSolution.chroma) {
        break;
      }
      if (Math.abs(potentialSolution.chroma - chroma) < 0.4) {
        break;
      }
      const potentialDelta = Math.abs(potentialSolution.chroma - chroma);
      const currentDelta = Math.abs(closestToChroma.chroma - chroma);
      if (potentialDelta < currentDelta) {
        closestToChroma = potentialSolution;
      }
      chromaPeak = Math.max(chromaPeak, potentialSolution.chroma);
    }
  }
  return answer;
}
var MaterialDynamicColors;
var init_material_dynamic_colors = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/material_dynamic_colors.js"() {
    init_dislike_analyzer();
    init_hct();
    init_contrast_curve();
    init_dynamic_color();
    init_tone_delta_pair();
    init_variant();
    MaterialDynamicColors = class {
      static highestSurface(s) {
        return s.isDark ? MaterialDynamicColors.surfaceBright : MaterialDynamicColors.surfaceDim;
      }
    };
    MaterialDynamicColors.contentAccentToneDelta = 15;
    MaterialDynamicColors.primaryPaletteKeyColor = DynamicColor.fromPalette({
      name: "primary_palette_key_color",
      palette: (s) => s.primaryPalette,
      tone: (s) => s.primaryPalette.keyColor.tone
    });
    MaterialDynamicColors.secondaryPaletteKeyColor = DynamicColor.fromPalette({
      name: "secondary_palette_key_color",
      palette: (s) => s.secondaryPalette,
      tone: (s) => s.secondaryPalette.keyColor.tone
    });
    MaterialDynamicColors.tertiaryPaletteKeyColor = DynamicColor.fromPalette({
      name: "tertiary_palette_key_color",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => s.tertiaryPalette.keyColor.tone
    });
    MaterialDynamicColors.neutralPaletteKeyColor = DynamicColor.fromPalette({
      name: "neutral_palette_key_color",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.neutralPalette.keyColor.tone
    });
    MaterialDynamicColors.neutralVariantPaletteKeyColor = DynamicColor.fromPalette({
      name: "neutral_variant_palette_key_color",
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => s.neutralVariantPalette.keyColor.tone
    });
    MaterialDynamicColors.background = DynamicColor.fromPalette({
      name: "background",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 6 : 98,
      isBackground: true
    });
    MaterialDynamicColors.onBackground = DynamicColor.fromPalette({
      name: "on_background",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 90 : 10,
      background: (s) => MaterialDynamicColors.background,
      contrastCurve: new ContrastCurve(3, 3, 4.5, 7)
    });
    MaterialDynamicColors.surface = DynamicColor.fromPalette({
      name: "surface",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 6 : 98,
      isBackground: true
    });
    MaterialDynamicColors.surfaceDim = DynamicColor.fromPalette({
      name: "surface_dim",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 6 : new ContrastCurve(87, 87, 80, 75).get(s.contrastLevel),
      isBackground: true
    });
    MaterialDynamicColors.surfaceBright = DynamicColor.fromPalette({
      name: "surface_bright",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(24, 24, 29, 34).get(s.contrastLevel) : 98,
      isBackground: true
    });
    MaterialDynamicColors.surfaceContainerLowest = DynamicColor.fromPalette({
      name: "surface_container_lowest",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(4, 4, 2, 0).get(s.contrastLevel) : 100,
      isBackground: true
    });
    MaterialDynamicColors.surfaceContainerLow = DynamicColor.fromPalette({
      name: "surface_container_low",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(10, 10, 11, 12).get(s.contrastLevel) : new ContrastCurve(96, 96, 96, 95).get(s.contrastLevel),
      isBackground: true
    });
    MaterialDynamicColors.surfaceContainer = DynamicColor.fromPalette({
      name: "surface_container",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(12, 12, 16, 20).get(s.contrastLevel) : new ContrastCurve(94, 94, 92, 90).get(s.contrastLevel),
      isBackground: true
    });
    MaterialDynamicColors.surfaceContainerHigh = DynamicColor.fromPalette({
      name: "surface_container_high",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(17, 17, 21, 25).get(s.contrastLevel) : new ContrastCurve(92, 92, 88, 85).get(s.contrastLevel),
      isBackground: true
    });
    MaterialDynamicColors.surfaceContainerHighest = DynamicColor.fromPalette({
      name: "surface_container_highest",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? new ContrastCurve(22, 22, 26, 30).get(s.contrastLevel) : new ContrastCurve(90, 90, 84, 80).get(s.contrastLevel),
      isBackground: true
    });
    MaterialDynamicColors.onSurface = DynamicColor.fromPalette({
      name: "on_surface",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 90 : 10,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.surfaceVariant = DynamicColor.fromPalette({
      name: "surface_variant",
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => s.isDark ? 30 : 90,
      isBackground: true
    });
    MaterialDynamicColors.onSurfaceVariant = DynamicColor.fromPalette({
      name: "on_surface_variant",
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => s.isDark ? 80 : 30,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.inverseSurface = DynamicColor.fromPalette({
      name: "inverse_surface",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 90 : 20
    });
    MaterialDynamicColors.inverseOnSurface = DynamicColor.fromPalette({
      name: "inverse_on_surface",
      palette: (s) => s.neutralPalette,
      tone: (s) => s.isDark ? 20 : 95,
      background: (s) => MaterialDynamicColors.inverseSurface,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.outline = DynamicColor.fromPalette({
      name: "outline",
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => s.isDark ? 60 : 50,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1.5, 3, 4.5, 7)
    });
    MaterialDynamicColors.outlineVariant = DynamicColor.fromPalette({
      name: "outline_variant",
      palette: (s) => s.neutralVariantPalette,
      tone: (s) => s.isDark ? 30 : 80,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5)
    });
    MaterialDynamicColors.shadow = DynamicColor.fromPalette({
      name: "shadow",
      palette: (s) => s.neutralPalette,
      tone: (s) => 0
    });
    MaterialDynamicColors.scrim = DynamicColor.fromPalette({
      name: "scrim",
      palette: (s) => s.neutralPalette,
      tone: (s) => 0
    });
    MaterialDynamicColors.surfaceTint = DynamicColor.fromPalette({
      name: "surface_tint",
      palette: (s) => s.primaryPalette,
      tone: (s) => s.isDark ? 80 : 40,
      isBackground: true
    });
    MaterialDynamicColors.primary = DynamicColor.fromPalette({
      name: "primary",
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 100 : 0;
        }
        return s.isDark ? 80 : 40;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 7),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 10, "nearer", false)
    });
    MaterialDynamicColors.onPrimary = DynamicColor.fromPalette({
      name: "on_primary",
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
      },
      background: (s) => MaterialDynamicColors.primary,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.primaryContainer = DynamicColor.fromPalette({
      name: "primary_container",
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isFidelity(s)) {
          return s.sourceColorHct.tone;
        }
        if (isMonochrome(s)) {
          return s.isDark ? 85 : 25;
        }
        return s.isDark ? 30 : 90;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.primaryContainer, MaterialDynamicColors.primary, 10, "nearer", false)
    });
    MaterialDynamicColors.onPrimaryContainer = DynamicColor.fromPalette({
      name: "on_primary_container",
      palette: (s) => s.primaryPalette,
      tone: (s) => {
        if (isFidelity(s)) {
          return DynamicColor.foregroundTone(MaterialDynamicColors.primaryContainer.tone(s), 4.5);
        }
        if (isMonochrome(s)) {
          return s.isDark ? 0 : 100;
        }
        return s.isDark ? 90 : 30;
      },
      background: (s) => MaterialDynamicColors.primaryContainer,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.inversePrimary = DynamicColor.fromPalette({
      name: "inverse_primary",
      palette: (s) => s.primaryPalette,
      tone: (s) => s.isDark ? 40 : 80,
      background: (s) => MaterialDynamicColors.inverseSurface,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 7)
    });
    MaterialDynamicColors.secondary = DynamicColor.fromPalette({
      name: "secondary",
      palette: (s) => s.secondaryPalette,
      tone: (s) => s.isDark ? 80 : 40,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 7),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 10, "nearer", false)
    });
    MaterialDynamicColors.onSecondary = DynamicColor.fromPalette({
      name: "on_secondary",
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 100;
        } else {
          return s.isDark ? 20 : 100;
        }
      },
      background: (s) => MaterialDynamicColors.secondary,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.secondaryContainer = DynamicColor.fromPalette({
      name: "secondary_container",
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        const initialTone = s.isDark ? 30 : 90;
        if (isMonochrome(s)) {
          return s.isDark ? 30 : 85;
        }
        if (!isFidelity(s)) {
          return initialTone;
        }
        return findDesiredChromaByTone(s.secondaryPalette.hue, s.secondaryPalette.chroma, initialTone, s.isDark ? false : true);
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.secondaryContainer, MaterialDynamicColors.secondary, 10, "nearer", false)
    });
    MaterialDynamicColors.onSecondaryContainer = DynamicColor.fromPalette({
      name: "on_secondary_container",
      palette: (s) => s.secondaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 90 : 10;
        }
        if (!isFidelity(s)) {
          return s.isDark ? 90 : 30;
        }
        return DynamicColor.foregroundTone(MaterialDynamicColors.secondaryContainer.tone(s), 4.5);
      },
      background: (s) => MaterialDynamicColors.secondaryContainer,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.tertiary = DynamicColor.fromPalette({
      name: "tertiary",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 90 : 25;
        }
        return s.isDark ? 80 : 40;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 7),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 10, "nearer", false)
    });
    MaterialDynamicColors.onTertiary = DynamicColor.fromPalette({
      name: "on_tertiary",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 10 : 90;
        }
        return s.isDark ? 20 : 100;
      },
      background: (s) => MaterialDynamicColors.tertiary,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.tertiaryContainer = DynamicColor.fromPalette({
      name: "tertiary_container",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 60 : 49;
        }
        if (!isFidelity(s)) {
          return s.isDark ? 30 : 90;
        }
        const proposedHct = s.tertiaryPalette.getHct(s.sourceColorHct.tone);
        return DislikeAnalyzer.fixIfDisliked(proposedHct).tone;
      },
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.tertiaryContainer, MaterialDynamicColors.tertiary, 10, "nearer", false)
    });
    MaterialDynamicColors.onTertiaryContainer = DynamicColor.fromPalette({
      name: "on_tertiary_container",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 0 : 100;
        }
        if (!isFidelity(s)) {
          return s.isDark ? 90 : 30;
        }
        return DynamicColor.foregroundTone(MaterialDynamicColors.tertiaryContainer.tone(s), 4.5);
      },
      background: (s) => MaterialDynamicColors.tertiaryContainer,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.error = DynamicColor.fromPalette({
      name: "error",
      palette: (s) => s.errorPalette,
      tone: (s) => s.isDark ? 80 : 40,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(3, 4.5, 7, 7),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 10, "nearer", false)
    });
    MaterialDynamicColors.onError = DynamicColor.fromPalette({
      name: "on_error",
      palette: (s) => s.errorPalette,
      tone: (s) => s.isDark ? 20 : 100,
      background: (s) => MaterialDynamicColors.error,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.errorContainer = DynamicColor.fromPalette({
      name: "error_container",
      palette: (s) => s.errorPalette,
      tone: (s) => s.isDark ? 30 : 90,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.errorContainer, MaterialDynamicColors.error, 10, "nearer", false)
    });
    MaterialDynamicColors.onErrorContainer = DynamicColor.fromPalette({
      name: "on_error_container",
      palette: (s) => s.errorPalette,
      tone: (s) => {
        if (isMonochrome(s)) {
          return s.isDark ? 90 : 10;
        }
        return s.isDark ? 90 : 30;
      },
      background: (s) => MaterialDynamicColors.errorContainer,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.primaryFixed = DynamicColor.fromPalette({
      name: "primary_fixed",
      palette: (s) => s.primaryPalette,
      tone: (s) => isMonochrome(s) ? 40 : 90,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.primaryFixedDim = DynamicColor.fromPalette({
      name: "primary_fixed_dim",
      palette: (s) => s.primaryPalette,
      tone: (s) => isMonochrome(s) ? 30 : 80,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.primaryFixed, MaterialDynamicColors.primaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.onPrimaryFixed = DynamicColor.fromPalette({
      name: "on_primary_fixed",
      palette: (s) => s.primaryPalette,
      tone: (s) => isMonochrome(s) ? 100 : 10,
      background: (s) => MaterialDynamicColors.primaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.primaryFixed,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.onPrimaryFixedVariant = DynamicColor.fromPalette({
      name: "on_primary_fixed_variant",
      palette: (s) => s.primaryPalette,
      tone: (s) => isMonochrome(s) ? 90 : 30,
      background: (s) => MaterialDynamicColors.primaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.primaryFixed,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.secondaryFixed = DynamicColor.fromPalette({
      name: "secondary_fixed",
      palette: (s) => s.secondaryPalette,
      tone: (s) => isMonochrome(s) ? 80 : 90,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.secondaryFixedDim = DynamicColor.fromPalette({
      name: "secondary_fixed_dim",
      palette: (s) => s.secondaryPalette,
      tone: (s) => isMonochrome(s) ? 70 : 80,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.secondaryFixed, MaterialDynamicColors.secondaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.onSecondaryFixed = DynamicColor.fromPalette({
      name: "on_secondary_fixed",
      palette: (s) => s.secondaryPalette,
      tone: (s) => 10,
      background: (s) => MaterialDynamicColors.secondaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.secondaryFixed,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.onSecondaryFixedVariant = DynamicColor.fromPalette({
      name: "on_secondary_fixed_variant",
      palette: (s) => s.secondaryPalette,
      tone: (s) => isMonochrome(s) ? 25 : 30,
      background: (s) => MaterialDynamicColors.secondaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.secondaryFixed,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
    MaterialDynamicColors.tertiaryFixed = DynamicColor.fromPalette({
      name: "tertiary_fixed",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => isMonochrome(s) ? 40 : 90,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.tertiaryFixedDim = DynamicColor.fromPalette({
      name: "tertiary_fixed_dim",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => isMonochrome(s) ? 30 : 80,
      isBackground: true,
      background: (s) => MaterialDynamicColors.highestSurface(s),
      contrastCurve: new ContrastCurve(1, 1, 3, 4.5),
      toneDeltaPair: (s) => new ToneDeltaPair(MaterialDynamicColors.tertiaryFixed, MaterialDynamicColors.tertiaryFixedDim, 10, "lighter", true)
    });
    MaterialDynamicColors.onTertiaryFixed = DynamicColor.fromPalette({
      name: "on_tertiary_fixed",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => isMonochrome(s) ? 100 : 10,
      background: (s) => MaterialDynamicColors.tertiaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.tertiaryFixed,
      contrastCurve: new ContrastCurve(4.5, 7, 11, 21)
    });
    MaterialDynamicColors.onTertiaryFixedVariant = DynamicColor.fromPalette({
      name: "on_tertiary_fixed_variant",
      palette: (s) => s.tertiaryPalette,
      tone: (s) => isMonochrome(s) ? 90 : 30,
      background: (s) => MaterialDynamicColors.tertiaryFixedDim,
      secondBackground: (s) => MaterialDynamicColors.tertiaryFixed,
      contrastCurve: new ContrastCurve(3, 4.5, 7, 11)
    });
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_scheme.js
var DynamicScheme;
var init_dynamic_scheme = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/dynamiccolor/dynamic_scheme.js"() {
    init_hct();
    init_tonal_palette();
    init_math_utils();
    init_material_dynamic_colors();
    DynamicScheme = class {
      constructor(args) {
        this.sourceColorArgb = args.sourceColorArgb;
        this.variant = args.variant;
        this.contrastLevel = args.contrastLevel;
        this.isDark = args.isDark;
        this.sourceColorHct = Hct.fromInt(args.sourceColorArgb);
        this.primaryPalette = args.primaryPalette;
        this.secondaryPalette = args.secondaryPalette;
        this.tertiaryPalette = args.tertiaryPalette;
        this.neutralPalette = args.neutralPalette;
        this.neutralVariantPalette = args.neutralVariantPalette;
        this.errorPalette = TonalPalette.fromHueAndChroma(25, 84);
      }
      static getRotatedHue(sourceColor, hues, rotations) {
        const sourceHue = sourceColor.hue;
        if (hues.length !== rotations.length) {
          throw new Error(`mismatch between hue length ${hues.length} & rotations ${rotations.length}`);
        }
        if (rotations.length === 1) {
          return sanitizeDegreesDouble(sourceColor.hue + rotations[0]);
        }
        const size = hues.length;
        for (let i = 0; i <= size - 2; i++) {
          const thisHue = hues[i];
          const nextHue = hues[i + 1];
          if (thisHue < sourceHue && sourceHue < nextHue) {
            return sanitizeDegreesDouble(sourceHue + rotations[i]);
          }
        }
        return sourceHue;
      }
      getArgb(dynamicColor) {
        return dynamicColor.getArgb(this);
      }
      getHct(dynamicColor) {
        return dynamicColor.getHct(this);
      }
      get primaryPaletteKeyColor() {
        return this.getArgb(MaterialDynamicColors.primaryPaletteKeyColor);
      }
      get secondaryPaletteKeyColor() {
        return this.getArgb(MaterialDynamicColors.secondaryPaletteKeyColor);
      }
      get tertiaryPaletteKeyColor() {
        return this.getArgb(MaterialDynamicColors.tertiaryPaletteKeyColor);
      }
      get neutralPaletteKeyColor() {
        return this.getArgb(MaterialDynamicColors.neutralPaletteKeyColor);
      }
      get neutralVariantPaletteKeyColor() {
        return this.getArgb(MaterialDynamicColors.neutralVariantPaletteKeyColor);
      }
      get background() {
        return this.getArgb(MaterialDynamicColors.background);
      }
      get onBackground() {
        return this.getArgb(MaterialDynamicColors.onBackground);
      }
      get surface() {
        return this.getArgb(MaterialDynamicColors.surface);
      }
      get surfaceDim() {
        return this.getArgb(MaterialDynamicColors.surfaceDim);
      }
      get surfaceBright() {
        return this.getArgb(MaterialDynamicColors.surfaceBright);
      }
      get surfaceContainerLowest() {
        return this.getArgb(MaterialDynamicColors.surfaceContainerLowest);
      }
      get surfaceContainerLow() {
        return this.getArgb(MaterialDynamicColors.surfaceContainerLow);
      }
      get surfaceContainer() {
        return this.getArgb(MaterialDynamicColors.surfaceContainer);
      }
      get surfaceContainerHigh() {
        return this.getArgb(MaterialDynamicColors.surfaceContainerHigh);
      }
      get surfaceContainerHighest() {
        return this.getArgb(MaterialDynamicColors.surfaceContainerHighest);
      }
      get onSurface() {
        return this.getArgb(MaterialDynamicColors.onSurface);
      }
      get surfaceVariant() {
        return this.getArgb(MaterialDynamicColors.surfaceVariant);
      }
      get onSurfaceVariant() {
        return this.getArgb(MaterialDynamicColors.onSurfaceVariant);
      }
      get inverseSurface() {
        return this.getArgb(MaterialDynamicColors.inverseSurface);
      }
      get inverseOnSurface() {
        return this.getArgb(MaterialDynamicColors.inverseOnSurface);
      }
      get outline() {
        return this.getArgb(MaterialDynamicColors.outline);
      }
      get outlineVariant() {
        return this.getArgb(MaterialDynamicColors.outlineVariant);
      }
      get shadow() {
        return this.getArgb(MaterialDynamicColors.shadow);
      }
      get scrim() {
        return this.getArgb(MaterialDynamicColors.scrim);
      }
      get surfaceTint() {
        return this.getArgb(MaterialDynamicColors.surfaceTint);
      }
      get primary() {
        return this.getArgb(MaterialDynamicColors.primary);
      }
      get onPrimary() {
        return this.getArgb(MaterialDynamicColors.onPrimary);
      }
      get primaryContainer() {
        return this.getArgb(MaterialDynamicColors.primaryContainer);
      }
      get onPrimaryContainer() {
        return this.getArgb(MaterialDynamicColors.onPrimaryContainer);
      }
      get inversePrimary() {
        return this.getArgb(MaterialDynamicColors.inversePrimary);
      }
      get secondary() {
        return this.getArgb(MaterialDynamicColors.secondary);
      }
      get onSecondary() {
        return this.getArgb(MaterialDynamicColors.onSecondary);
      }
      get secondaryContainer() {
        return this.getArgb(MaterialDynamicColors.secondaryContainer);
      }
      get onSecondaryContainer() {
        return this.getArgb(MaterialDynamicColors.onSecondaryContainer);
      }
      get tertiary() {
        return this.getArgb(MaterialDynamicColors.tertiary);
      }
      get onTertiary() {
        return this.getArgb(MaterialDynamicColors.onTertiary);
      }
      get tertiaryContainer() {
        return this.getArgb(MaterialDynamicColors.tertiaryContainer);
      }
      get onTertiaryContainer() {
        return this.getArgb(MaterialDynamicColors.onTertiaryContainer);
      }
      get error() {
        return this.getArgb(MaterialDynamicColors.error);
      }
      get onError() {
        return this.getArgb(MaterialDynamicColors.onError);
      }
      get errorContainer() {
        return this.getArgb(MaterialDynamicColors.errorContainer);
      }
      get onErrorContainer() {
        return this.getArgb(MaterialDynamicColors.onErrorContainer);
      }
      get primaryFixed() {
        return this.getArgb(MaterialDynamicColors.primaryFixed);
      }
      get primaryFixedDim() {
        return this.getArgb(MaterialDynamicColors.primaryFixedDim);
      }
      get onPrimaryFixed() {
        return this.getArgb(MaterialDynamicColors.onPrimaryFixed);
      }
      get onPrimaryFixedVariant() {
        return this.getArgb(MaterialDynamicColors.onPrimaryFixedVariant);
      }
      get secondaryFixed() {
        return this.getArgb(MaterialDynamicColors.secondaryFixed);
      }
      get secondaryFixedDim() {
        return this.getArgb(MaterialDynamicColors.secondaryFixedDim);
      }
      get onSecondaryFixed() {
        return this.getArgb(MaterialDynamicColors.onSecondaryFixed);
      }
      get onSecondaryFixedVariant() {
        return this.getArgb(MaterialDynamicColors.onSecondaryFixedVariant);
      }
      get tertiaryFixed() {
        return this.getArgb(MaterialDynamicColors.tertiaryFixed);
      }
      get tertiaryFixedDim() {
        return this.getArgb(MaterialDynamicColors.tertiaryFixedDim);
      }
      get onTertiaryFixed() {
        return this.getArgb(MaterialDynamicColors.onTertiaryFixed);
      }
      get onTertiaryFixedVariant() {
        return this.getArgb(MaterialDynamicColors.onTertiaryFixedVariant);
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/palettes/core_palette.js
var CorePalette;
var init_core_palette = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/palettes/core_palette.js"() {
    init_hct();
    init_tonal_palette();
    CorePalette = class {
      static of(argb) {
        return new CorePalette(argb, false);
      }
      static contentOf(argb) {
        return new CorePalette(argb, true);
      }
      static fromColors(colors) {
        return CorePalette.createPaletteFromColors(false, colors);
      }
      static contentFromColors(colors) {
        return CorePalette.createPaletteFromColors(true, colors);
      }
      static createPaletteFromColors(content, colors) {
        const palette = new CorePalette(colors.primary, content);
        if (colors.secondary) {
          const p = new CorePalette(colors.secondary, content);
          palette.a2 = p.a1;
        }
        if (colors.tertiary) {
          const p = new CorePalette(colors.tertiary, content);
          palette.a3 = p.a1;
        }
        if (colors.error) {
          const p = new CorePalette(colors.error, content);
          palette.error = p.a1;
        }
        if (colors.neutral) {
          const p = new CorePalette(colors.neutral, content);
          palette.n1 = p.n1;
        }
        if (colors.neutralVariant) {
          const p = new CorePalette(colors.neutralVariant, content);
          palette.n2 = p.n2;
        }
        return palette;
      }
      constructor(argb, isContent) {
        const hct = Hct.fromInt(argb);
        const hue = hct.hue;
        const chroma = hct.chroma;
        if (isContent) {
          this.a1 = TonalPalette.fromHueAndChroma(hue, chroma);
          this.a2 = TonalPalette.fromHueAndChroma(hue, chroma / 3);
          this.a3 = TonalPalette.fromHueAndChroma(hue + 60, chroma / 2);
          this.n1 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 12, 4));
          this.n2 = TonalPalette.fromHueAndChroma(hue, Math.min(chroma / 6, 8));
        } else {
          this.a1 = TonalPalette.fromHueAndChroma(hue, Math.max(48, chroma));
          this.a2 = TonalPalette.fromHueAndChroma(hue, 16);
          this.a3 = TonalPalette.fromHueAndChroma(hue + 60, 24);
          this.n1 = TonalPalette.fromHueAndChroma(hue, 4);
          this.n2 = TonalPalette.fromHueAndChroma(hue, 8);
        }
        this.error = TonalPalette.fromHueAndChroma(25, 84);
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/lab_point_provider.js
var LabPointProvider;
var init_lab_point_provider = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/lab_point_provider.js"() {
    init_color_utils();
    LabPointProvider = class {
      fromInt(argb) {
        return labFromArgb(argb);
      }
      toInt(point) {
        return argbFromLab(point[0], point[1], point[2]);
      }
      distance(from, to) {
        const dL = from[0] - to[0];
        const dA = from[1] - to[1];
        const dB = from[2] - to[2];
        return dL * dL + dA * dA + dB * dB;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_wsmeans.js
var MAX_ITERATIONS, MIN_MOVEMENT_DISTANCE, QuantizerWsmeans, DistanceAndIndex;
var init_quantizer_wsmeans = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_wsmeans.js"() {
    init_lab_point_provider();
    MAX_ITERATIONS = 10;
    MIN_MOVEMENT_DISTANCE = 3;
    QuantizerWsmeans = class {
      static quantize(inputPixels, startingClusters, maxColors) {
        const pixelToCount = /* @__PURE__ */ new Map();
        const points = new Array();
        const pixels = new Array();
        const pointProvider = new LabPointProvider();
        let pointCount = 0;
        for (let i = 0; i < inputPixels.length; i++) {
          const inputPixel = inputPixels[i];
          const pixelCount = pixelToCount.get(inputPixel);
          if (pixelCount === void 0) {
            pointCount++;
            points.push(pointProvider.fromInt(inputPixel));
            pixels.push(inputPixel);
            pixelToCount.set(inputPixel, 1);
          } else {
            pixelToCount.set(inputPixel, pixelCount + 1);
          }
        }
        const counts = new Array();
        for (let i = 0; i < pointCount; i++) {
          const pixel = pixels[i];
          const count = pixelToCount.get(pixel);
          if (count !== void 0) {
            counts[i] = count;
          }
        }
        let clusterCount = Math.min(maxColors, pointCount);
        if (startingClusters.length > 0) {
          clusterCount = Math.min(clusterCount, startingClusters.length);
        }
        const clusters = new Array();
        for (let i = 0; i < startingClusters.length; i++) {
          clusters.push(pointProvider.fromInt(startingClusters[i]));
        }
        const additionalClustersNeeded = clusterCount - clusters.length;
        if (startingClusters.length === 0 && additionalClustersNeeded > 0) {
          for (let i = 0; i < additionalClustersNeeded; i++) {
            const l = Math.random() * 100;
            const a = Math.random() * (100 - -100 + 1) + -100;
            const b = Math.random() * (100 - -100 + 1) + -100;
            clusters.push(new Array(l, a, b));
          }
        }
        const clusterIndices = new Array();
        for (let i = 0; i < pointCount; i++) {
          clusterIndices.push(Math.floor(Math.random() * clusterCount));
        }
        const indexMatrix = new Array();
        for (let i = 0; i < clusterCount; i++) {
          indexMatrix.push(new Array());
          for (let j = 0; j < clusterCount; j++) {
            indexMatrix[i].push(0);
          }
        }
        const distanceToIndexMatrix = new Array();
        for (let i = 0; i < clusterCount; i++) {
          distanceToIndexMatrix.push(new Array());
          for (let j = 0; j < clusterCount; j++) {
            distanceToIndexMatrix[i].push(new DistanceAndIndex());
          }
        }
        const pixelCountSums = new Array();
        for (let i = 0; i < clusterCount; i++) {
          pixelCountSums.push(0);
        }
        for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
          for (let i = 0; i < clusterCount; i++) {
            for (let j = i + 1; j < clusterCount; j++) {
              const distance = pointProvider.distance(clusters[i], clusters[j]);
              distanceToIndexMatrix[j][i].distance = distance;
              distanceToIndexMatrix[j][i].index = i;
              distanceToIndexMatrix[i][j].distance = distance;
              distanceToIndexMatrix[i][j].index = j;
            }
            distanceToIndexMatrix[i].sort();
            for (let j = 0; j < clusterCount; j++) {
              indexMatrix[i][j] = distanceToIndexMatrix[i][j].index;
            }
          }
          let pointsMoved = 0;
          for (let i = 0; i < pointCount; i++) {
            const point = points[i];
            const previousClusterIndex = clusterIndices[i];
            const previousCluster = clusters[previousClusterIndex];
            const previousDistance = pointProvider.distance(point, previousCluster);
            let minimumDistance = previousDistance;
            let newClusterIndex = -1;
            for (let j = 0; j < clusterCount; j++) {
              if (distanceToIndexMatrix[previousClusterIndex][j].distance >= 4 * previousDistance) {
                continue;
              }
              const distance = pointProvider.distance(point, clusters[j]);
              if (distance < minimumDistance) {
                minimumDistance = distance;
                newClusterIndex = j;
              }
            }
            if (newClusterIndex !== -1) {
              const distanceChange = Math.abs(Math.sqrt(minimumDistance) - Math.sqrt(previousDistance));
              if (distanceChange > MIN_MOVEMENT_DISTANCE) {
                pointsMoved++;
                clusterIndices[i] = newClusterIndex;
              }
            }
          }
          if (pointsMoved === 0 && iteration !== 0) {
            break;
          }
          const componentASums = new Array(clusterCount).fill(0);
          const componentBSums = new Array(clusterCount).fill(0);
          const componentCSums = new Array(clusterCount).fill(0);
          for (let i = 0; i < clusterCount; i++) {
            pixelCountSums[i] = 0;
          }
          for (let i = 0; i < pointCount; i++) {
            const clusterIndex = clusterIndices[i];
            const point = points[i];
            const count = counts[i];
            pixelCountSums[clusterIndex] += count;
            componentASums[clusterIndex] += point[0] * count;
            componentBSums[clusterIndex] += point[1] * count;
            componentCSums[clusterIndex] += point[2] * count;
          }
          for (let i = 0; i < clusterCount; i++) {
            const count = pixelCountSums[i];
            if (count === 0) {
              clusters[i] = [0, 0, 0];
              continue;
            }
            const a = componentASums[i] / count;
            const b = componentBSums[i] / count;
            const c = componentCSums[i] / count;
            clusters[i] = [a, b, c];
          }
        }
        const argbToPopulation = /* @__PURE__ */ new Map();
        for (let i = 0; i < clusterCount; i++) {
          const count = pixelCountSums[i];
          if (count === 0) {
            continue;
          }
          const possibleNewCluster = pointProvider.toInt(clusters[i]);
          if (argbToPopulation.has(possibleNewCluster)) {
            continue;
          }
          argbToPopulation.set(possibleNewCluster, count);
        }
        return argbToPopulation;
      }
    };
    DistanceAndIndex = class {
      constructor() {
        this.distance = -1;
        this.index = -1;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_map.js
var QuantizerMap;
var init_quantizer_map = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_map.js"() {
    init_color_utils();
    QuantizerMap = class {
      static quantize(pixels) {
        var _a;
        const countByColor = /* @__PURE__ */ new Map();
        for (let i = 0; i < pixels.length; i++) {
          const pixel = pixels[i];
          const alpha = alphaFromArgb(pixel);
          if (alpha < 255) {
            continue;
          }
          countByColor.set(pixel, ((_a = countByColor.get(pixel)) != null ? _a : 0) + 1);
        }
        return countByColor;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_wu.js
var INDEX_BITS, SIDE_LENGTH, TOTAL_SIZE, directions, QuantizerWu, Box, CreateBoxesResult, MaximizeResult;
var init_quantizer_wu = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_wu.js"() {
    init_color_utils();
    init_quantizer_map();
    INDEX_BITS = 5;
    SIDE_LENGTH = 33;
    TOTAL_SIZE = 35937;
    directions = {
      RED: "red",
      GREEN: "green",
      BLUE: "blue"
    };
    QuantizerWu = class {
      constructor(weights = [], momentsR = [], momentsG = [], momentsB = [], moments = [], cubes = []) {
        this.weights = weights;
        this.momentsR = momentsR;
        this.momentsG = momentsG;
        this.momentsB = momentsB;
        this.moments = moments;
        this.cubes = cubes;
      }
      quantize(pixels, maxColors) {
        this.constructHistogram(pixels);
        this.computeMoments();
        const createBoxesResult = this.createBoxes(maxColors);
        const results = this.createResult(createBoxesResult.resultCount);
        return results;
      }
      constructHistogram(pixels) {
        var _a;
        this.weights = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsR = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsG = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.momentsB = Array.from({ length: TOTAL_SIZE }).fill(0);
        this.moments = Array.from({ length: TOTAL_SIZE }).fill(0);
        const countByColor = QuantizerMap.quantize(pixels);
        for (const [pixel, count] of countByColor.entries()) {
          const red = redFromArgb(pixel);
          const green = greenFromArgb(pixel);
          const blue = blueFromArgb(pixel);
          const bitsToRemove = 8 - INDEX_BITS;
          const iR = (red >> bitsToRemove) + 1;
          const iG = (green >> bitsToRemove) + 1;
          const iB = (blue >> bitsToRemove) + 1;
          const index = this.getIndex(iR, iG, iB);
          this.weights[index] = ((_a = this.weights[index]) != null ? _a : 0) + count;
          this.momentsR[index] += count * red;
          this.momentsG[index] += count * green;
          this.momentsB[index] += count * blue;
          this.moments[index] += count * (red * red + green * green + blue * blue);
        }
      }
      computeMoments() {
        for (let r = 1; r < SIDE_LENGTH; r++) {
          const area = Array.from({ length: SIDE_LENGTH }).fill(0);
          const areaR = Array.from({ length: SIDE_LENGTH }).fill(0);
          const areaG = Array.from({ length: SIDE_LENGTH }).fill(0);
          const areaB = Array.from({ length: SIDE_LENGTH }).fill(0);
          const area2 = Array.from({ length: SIDE_LENGTH }).fill(0);
          for (let g = 1; g < SIDE_LENGTH; g++) {
            let line = 0;
            let lineR = 0;
            let lineG = 0;
            let lineB = 0;
            let line2 = 0;
            for (let b = 1; b < SIDE_LENGTH; b++) {
              const index = this.getIndex(r, g, b);
              line += this.weights[index];
              lineR += this.momentsR[index];
              lineG += this.momentsG[index];
              lineB += this.momentsB[index];
              line2 += this.moments[index];
              area[b] += line;
              areaR[b] += lineR;
              areaG[b] += lineG;
              areaB[b] += lineB;
              area2[b] += line2;
              const previousIndex = this.getIndex(r - 1, g, b);
              this.weights[index] = this.weights[previousIndex] + area[b];
              this.momentsR[index] = this.momentsR[previousIndex] + areaR[b];
              this.momentsG[index] = this.momentsG[previousIndex] + areaG[b];
              this.momentsB[index] = this.momentsB[previousIndex] + areaB[b];
              this.moments[index] = this.moments[previousIndex] + area2[b];
            }
          }
        }
      }
      createBoxes(maxColors) {
        this.cubes = Array.from({ length: maxColors }).fill(0).map(() => new Box());
        const volumeVariance = Array.from({ length: maxColors }).fill(0);
        this.cubes[0].r0 = 0;
        this.cubes[0].g0 = 0;
        this.cubes[0].b0 = 0;
        this.cubes[0].r1 = SIDE_LENGTH - 1;
        this.cubes[0].g1 = SIDE_LENGTH - 1;
        this.cubes[0].b1 = SIDE_LENGTH - 1;
        let generatedColorCount = maxColors;
        let next = 0;
        for (let i = 1; i < maxColors; i++) {
          if (this.cut(this.cubes[next], this.cubes[i])) {
            volumeVariance[next] = this.cubes[next].vol > 1 ? this.variance(this.cubes[next]) : 0;
            volumeVariance[i] = this.cubes[i].vol > 1 ? this.variance(this.cubes[i]) : 0;
          } else {
            volumeVariance[next] = 0;
            i--;
          }
          next = 0;
          let temp = volumeVariance[0];
          for (let j = 1; j <= i; j++) {
            if (volumeVariance[j] > temp) {
              temp = volumeVariance[j];
              next = j;
            }
          }
          if (temp <= 0) {
            generatedColorCount = i + 1;
            break;
          }
        }
        return new CreateBoxesResult(maxColors, generatedColorCount);
      }
      createResult(colorCount) {
        const colors = [];
        for (let i = 0; i < colorCount; ++i) {
          const cube = this.cubes[i];
          const weight = this.volume(cube, this.weights);
          if (weight > 0) {
            const r = Math.round(this.volume(cube, this.momentsR) / weight);
            const g = Math.round(this.volume(cube, this.momentsG) / weight);
            const b = Math.round(this.volume(cube, this.momentsB) / weight);
            const color = 255 << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255;
            colors.push(color);
          }
        }
        return colors;
      }
      variance(cube) {
        const dr = this.volume(cube, this.momentsR);
        const dg = this.volume(cube, this.momentsG);
        const db = this.volume(cube, this.momentsB);
        const xx = this.moments[this.getIndex(cube.r1, cube.g1, cube.b1)] - this.moments[this.getIndex(cube.r1, cube.g1, cube.b0)] - this.moments[this.getIndex(cube.r1, cube.g0, cube.b1)] + this.moments[this.getIndex(cube.r1, cube.g0, cube.b0)] - this.moments[this.getIndex(cube.r0, cube.g1, cube.b1)] + this.moments[this.getIndex(cube.r0, cube.g1, cube.b0)] + this.moments[this.getIndex(cube.r0, cube.g0, cube.b1)] - this.moments[this.getIndex(cube.r0, cube.g0, cube.b0)];
        const hypotenuse = dr * dr + dg * dg + db * db;
        const volume = this.volume(cube, this.weights);
        return xx - hypotenuse / volume;
      }
      cut(one, two) {
        const wholeR = this.volume(one, this.momentsR);
        const wholeG = this.volume(one, this.momentsG);
        const wholeB = this.volume(one, this.momentsB);
        const wholeW = this.volume(one, this.weights);
        const maxRResult = this.maximize(one, directions.RED, one.r0 + 1, one.r1, wholeR, wholeG, wholeB, wholeW);
        const maxGResult = this.maximize(one, directions.GREEN, one.g0 + 1, one.g1, wholeR, wholeG, wholeB, wholeW);
        const maxBResult = this.maximize(one, directions.BLUE, one.b0 + 1, one.b1, wholeR, wholeG, wholeB, wholeW);
        let direction;
        const maxR = maxRResult.maximum;
        const maxG = maxGResult.maximum;
        const maxB = maxBResult.maximum;
        if (maxR >= maxG && maxR >= maxB) {
          if (maxRResult.cutLocation < 0) {
            return false;
          }
          direction = directions.RED;
        } else if (maxG >= maxR && maxG >= maxB) {
          direction = directions.GREEN;
        } else {
          direction = directions.BLUE;
        }
        two.r1 = one.r1;
        two.g1 = one.g1;
        two.b1 = one.b1;
        switch (direction) {
          case directions.RED:
            one.r1 = maxRResult.cutLocation;
            two.r0 = one.r1;
            two.g0 = one.g0;
            two.b0 = one.b0;
            break;
          case directions.GREEN:
            one.g1 = maxGResult.cutLocation;
            two.r0 = one.r0;
            two.g0 = one.g1;
            two.b0 = one.b0;
            break;
          case directions.BLUE:
            one.b1 = maxBResult.cutLocation;
            two.r0 = one.r0;
            two.g0 = one.g0;
            two.b0 = one.b1;
            break;
          default:
            throw new Error("unexpected direction " + direction);
        }
        one.vol = (one.r1 - one.r0) * (one.g1 - one.g0) * (one.b1 - one.b0);
        two.vol = (two.r1 - two.r0) * (two.g1 - two.g0) * (two.b1 - two.b0);
        return true;
      }
      maximize(cube, direction, first, last, wholeR, wholeG, wholeB, wholeW) {
        const bottomR = this.bottom(cube, direction, this.momentsR);
        const bottomG = this.bottom(cube, direction, this.momentsG);
        const bottomB = this.bottom(cube, direction, this.momentsB);
        const bottomW = this.bottom(cube, direction, this.weights);
        let max = 0;
        let cut = -1;
        let halfR = 0;
        let halfG = 0;
        let halfB = 0;
        let halfW = 0;
        for (let i = first; i < last; i++) {
          halfR = bottomR + this.top(cube, direction, i, this.momentsR);
          halfG = bottomG + this.top(cube, direction, i, this.momentsG);
          halfB = bottomB + this.top(cube, direction, i, this.momentsB);
          halfW = bottomW + this.top(cube, direction, i, this.weights);
          if (halfW === 0) {
            continue;
          }
          let tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1;
          let tempDenominator = halfW * 1;
          let temp = tempNumerator / tempDenominator;
          halfR = wholeR - halfR;
          halfG = wholeG - halfG;
          halfB = wholeB - halfB;
          halfW = wholeW - halfW;
          if (halfW === 0) {
            continue;
          }
          tempNumerator = (halfR * halfR + halfG * halfG + halfB * halfB) * 1;
          tempDenominator = halfW * 1;
          temp += tempNumerator / tempDenominator;
          if (temp > max) {
            max = temp;
            cut = i;
          }
        }
        return new MaximizeResult(cut, max);
      }
      volume(cube, moment) {
        return moment[this.getIndex(cube.r1, cube.g1, cube.b1)] - moment[this.getIndex(cube.r1, cube.g1, cube.b0)] - moment[this.getIndex(cube.r1, cube.g0, cube.b1)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] - moment[this.getIndex(cube.r0, cube.g1, cube.b1)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];
      }
      bottom(cube, direction, moment) {
        switch (direction) {
          case directions.RED:
            return -moment[this.getIndex(cube.r0, cube.g1, cube.b1)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];
          case directions.GREEN:
            return -moment[this.getIndex(cube.r1, cube.g0, cube.b1)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] + moment[this.getIndex(cube.r0, cube.g0, cube.b1)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];
          case directions.BLUE:
            return -moment[this.getIndex(cube.r1, cube.g1, cube.b0)] + moment[this.getIndex(cube.r1, cube.g0, cube.b0)] + moment[this.getIndex(cube.r0, cube.g1, cube.b0)] - moment[this.getIndex(cube.r0, cube.g0, cube.b0)];
          default:
            throw new Error("unexpected direction $direction");
        }
      }
      top(cube, direction, position, moment) {
        switch (direction) {
          case directions.RED:
            return moment[this.getIndex(position, cube.g1, cube.b1)] - moment[this.getIndex(position, cube.g1, cube.b0)] - moment[this.getIndex(position, cube.g0, cube.b1)] + moment[this.getIndex(position, cube.g0, cube.b0)];
          case directions.GREEN:
            return moment[this.getIndex(cube.r1, position, cube.b1)] - moment[this.getIndex(cube.r1, position, cube.b0)] - moment[this.getIndex(cube.r0, position, cube.b1)] + moment[this.getIndex(cube.r0, position, cube.b0)];
          case directions.BLUE:
            return moment[this.getIndex(cube.r1, cube.g1, position)] - moment[this.getIndex(cube.r1, cube.g0, position)] - moment[this.getIndex(cube.r0, cube.g1, position)] + moment[this.getIndex(cube.r0, cube.g0, position)];
          default:
            throw new Error("unexpected direction $direction");
        }
      }
      getIndex(r, g, b) {
        return (r << INDEX_BITS * 2) + (r << INDEX_BITS + 1) + r + (g << INDEX_BITS) + g + b;
      }
    };
    Box = class {
      constructor(r0 = 0, r1 = 0, g0 = 0, g1 = 0, b0 = 0, b1 = 0, vol = 0) {
        this.r0 = r0;
        this.r1 = r1;
        this.g0 = g0;
        this.g1 = g1;
        this.b0 = b0;
        this.b1 = b1;
        this.vol = vol;
      }
    };
    CreateBoxesResult = class {
      constructor(requestedCount, resultCount) {
        this.requestedCount = requestedCount;
        this.resultCount = resultCount;
      }
    };
    MaximizeResult = class {
      constructor(cutLocation, maximum) {
        this.cutLocation = cutLocation;
        this.maximum = maximum;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_celebi.js
var QuantizerCelebi;
var init_quantizer_celebi = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/quantize/quantizer_celebi.js"() {
    init_quantizer_wsmeans();
    init_quantizer_wu();
    QuantizerCelebi = class {
      static quantize(pixels, maxColors) {
        const wu = new QuantizerWu();
        const wuResult = wu.quantize(pixels, maxColors);
        return QuantizerWsmeans.quantize(pixels, wuResult, maxColors);
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme.js
var Scheme;
var init_scheme = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme.js"() {
    init_core_palette();
    Scheme = class {
      get primary() {
        return this.props.primary;
      }
      get onPrimary() {
        return this.props.onPrimary;
      }
      get primaryContainer() {
        return this.props.primaryContainer;
      }
      get onPrimaryContainer() {
        return this.props.onPrimaryContainer;
      }
      get secondary() {
        return this.props.secondary;
      }
      get onSecondary() {
        return this.props.onSecondary;
      }
      get secondaryContainer() {
        return this.props.secondaryContainer;
      }
      get onSecondaryContainer() {
        return this.props.onSecondaryContainer;
      }
      get tertiary() {
        return this.props.tertiary;
      }
      get onTertiary() {
        return this.props.onTertiary;
      }
      get tertiaryContainer() {
        return this.props.tertiaryContainer;
      }
      get onTertiaryContainer() {
        return this.props.onTertiaryContainer;
      }
      get error() {
        return this.props.error;
      }
      get onError() {
        return this.props.onError;
      }
      get errorContainer() {
        return this.props.errorContainer;
      }
      get onErrorContainer() {
        return this.props.onErrorContainer;
      }
      get background() {
        return this.props.background;
      }
      get onBackground() {
        return this.props.onBackground;
      }
      get surface() {
        return this.props.surface;
      }
      get onSurface() {
        return this.props.onSurface;
      }
      get surfaceVariant() {
        return this.props.surfaceVariant;
      }
      get onSurfaceVariant() {
        return this.props.onSurfaceVariant;
      }
      get outline() {
        return this.props.outline;
      }
      get outlineVariant() {
        return this.props.outlineVariant;
      }
      get shadow() {
        return this.props.shadow;
      }
      get scrim() {
        return this.props.scrim;
      }
      get inverseSurface() {
        return this.props.inverseSurface;
      }
      get inverseOnSurface() {
        return this.props.inverseOnSurface;
      }
      get inversePrimary() {
        return this.props.inversePrimary;
      }
      static light(argb) {
        return Scheme.lightFromCorePalette(CorePalette.of(argb));
      }
      static dark(argb) {
        return Scheme.darkFromCorePalette(CorePalette.of(argb));
      }
      static lightContent(argb) {
        return Scheme.lightFromCorePalette(CorePalette.contentOf(argb));
      }
      static darkContent(argb) {
        return Scheme.darkFromCorePalette(CorePalette.contentOf(argb));
      }
      static lightFromCorePalette(core) {
        return new Scheme({
          primary: core.a1.tone(40),
          onPrimary: core.a1.tone(100),
          primaryContainer: core.a1.tone(90),
          onPrimaryContainer: core.a1.tone(10),
          secondary: core.a2.tone(40),
          onSecondary: core.a2.tone(100),
          secondaryContainer: core.a2.tone(90),
          onSecondaryContainer: core.a2.tone(10),
          tertiary: core.a3.tone(40),
          onTertiary: core.a3.tone(100),
          tertiaryContainer: core.a3.tone(90),
          onTertiaryContainer: core.a3.tone(10),
          error: core.error.tone(40),
          onError: core.error.tone(100),
          errorContainer: core.error.tone(90),
          onErrorContainer: core.error.tone(10),
          background: core.n1.tone(99),
          onBackground: core.n1.tone(10),
          surface: core.n1.tone(99),
          onSurface: core.n1.tone(10),
          surfaceVariant: core.n2.tone(90),
          onSurfaceVariant: core.n2.tone(30),
          outline: core.n2.tone(50),
          outlineVariant: core.n2.tone(80),
          shadow: core.n1.tone(0),
          scrim: core.n1.tone(0),
          inverseSurface: core.n1.tone(20),
          inverseOnSurface: core.n1.tone(95),
          inversePrimary: core.a1.tone(80)
        });
      }
      static darkFromCorePalette(core) {
        return new Scheme({
          primary: core.a1.tone(80),
          onPrimary: core.a1.tone(20),
          primaryContainer: core.a1.tone(30),
          onPrimaryContainer: core.a1.tone(90),
          secondary: core.a2.tone(80),
          onSecondary: core.a2.tone(20),
          secondaryContainer: core.a2.tone(30),
          onSecondaryContainer: core.a2.tone(90),
          tertiary: core.a3.tone(80),
          onTertiary: core.a3.tone(20),
          tertiaryContainer: core.a3.tone(30),
          onTertiaryContainer: core.a3.tone(90),
          error: core.error.tone(80),
          onError: core.error.tone(20),
          errorContainer: core.error.tone(30),
          onErrorContainer: core.error.tone(80),
          background: core.n1.tone(10),
          onBackground: core.n1.tone(90),
          surface: core.n1.tone(10),
          onSurface: core.n1.tone(90),
          surfaceVariant: core.n2.tone(30),
          onSurfaceVariant: core.n2.tone(80),
          outline: core.n2.tone(60),
          outlineVariant: core.n2.tone(30),
          shadow: core.n1.tone(0),
          scrim: core.n1.tone(0),
          inverseSurface: core.n1.tone(90),
          inverseOnSurface: core.n1.tone(20),
          inversePrimary: core.a1.tone(40)
        });
      }
      constructor(props) {
        this.props = props;
      }
      toJSON() {
        return __spreadValues({}, this.props);
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_android.js
var SchemeAndroid;
var init_scheme_android = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_android.js"() {
    init_core_palette();
    SchemeAndroid = class {
      get colorAccentPrimary() {
        return this.props.colorAccentPrimary;
      }
      get colorAccentPrimaryVariant() {
        return this.props.colorAccentPrimaryVariant;
      }
      get colorAccentSecondary() {
        return this.props.colorAccentSecondary;
      }
      get colorAccentSecondaryVariant() {
        return this.props.colorAccentSecondaryVariant;
      }
      get colorAccentTertiary() {
        return this.props.colorAccentTertiary;
      }
      get colorAccentTertiaryVariant() {
        return this.props.colorAccentTertiaryVariant;
      }
      get textColorPrimary() {
        return this.props.textColorPrimary;
      }
      get textColorSecondary() {
        return this.props.textColorSecondary;
      }
      get textColorTertiary() {
        return this.props.textColorTertiary;
      }
      get textColorPrimaryInverse() {
        return this.props.textColorPrimaryInverse;
      }
      get textColorSecondaryInverse() {
        return this.props.textColorSecondaryInverse;
      }
      get textColorTertiaryInverse() {
        return this.props.textColorTertiaryInverse;
      }
      get colorBackground() {
        return this.props.colorBackground;
      }
      get colorBackgroundFloating() {
        return this.props.colorBackgroundFloating;
      }
      get colorSurface() {
        return this.props.colorSurface;
      }
      get colorSurfaceVariant() {
        return this.props.colorSurfaceVariant;
      }
      get colorSurfaceHighlight() {
        return this.props.colorSurfaceHighlight;
      }
      get surfaceHeader() {
        return this.props.surfaceHeader;
      }
      get underSurface() {
        return this.props.underSurface;
      }
      get offState() {
        return this.props.offState;
      }
      get accentSurface() {
        return this.props.accentSurface;
      }
      get textPrimaryOnAccent() {
        return this.props.textPrimaryOnAccent;
      }
      get textSecondaryOnAccent() {
        return this.props.textSecondaryOnAccent;
      }
      get volumeBackground() {
        return this.props.volumeBackground;
      }
      get scrim() {
        return this.props.scrim;
      }
      static light(argb) {
        const core = CorePalette.of(argb);
        return SchemeAndroid.lightFromCorePalette(core);
      }
      static dark(argb) {
        const core = CorePalette.of(argb);
        return SchemeAndroid.darkFromCorePalette(core);
      }
      static lightContent(argb) {
        const core = CorePalette.contentOf(argb);
        return SchemeAndroid.lightFromCorePalette(core);
      }
      static darkContent(argb) {
        const core = CorePalette.contentOf(argb);
        return SchemeAndroid.darkFromCorePalette(core);
      }
      static lightFromCorePalette(core) {
        return new SchemeAndroid({
          colorAccentPrimary: core.a1.tone(90),
          colorAccentPrimaryVariant: core.a1.tone(40),
          colorAccentSecondary: core.a2.tone(90),
          colorAccentSecondaryVariant: core.a2.tone(40),
          colorAccentTertiary: core.a3.tone(90),
          colorAccentTertiaryVariant: core.a3.tone(40),
          textColorPrimary: core.n1.tone(10),
          textColorSecondary: core.n2.tone(30),
          textColorTertiary: core.n2.tone(50),
          textColorPrimaryInverse: core.n1.tone(95),
          textColorSecondaryInverse: core.n1.tone(80),
          textColorTertiaryInverse: core.n1.tone(60),
          colorBackground: core.n1.tone(95),
          colorBackgroundFloating: core.n1.tone(98),
          colorSurface: core.n1.tone(98),
          colorSurfaceVariant: core.n1.tone(90),
          colorSurfaceHighlight: core.n1.tone(100),
          surfaceHeader: core.n1.tone(90),
          underSurface: core.n1.tone(0),
          offState: core.n1.tone(20),
          accentSurface: core.a2.tone(95),
          textPrimaryOnAccent: core.n1.tone(10),
          textSecondaryOnAccent: core.n2.tone(30),
          volumeBackground: core.n1.tone(25),
          scrim: core.n1.tone(80)
        });
      }
      static darkFromCorePalette(core) {
        return new SchemeAndroid({
          colorAccentPrimary: core.a1.tone(90),
          colorAccentPrimaryVariant: core.a1.tone(70),
          colorAccentSecondary: core.a2.tone(90),
          colorAccentSecondaryVariant: core.a2.tone(70),
          colorAccentTertiary: core.a3.tone(90),
          colorAccentTertiaryVariant: core.a3.tone(70),
          textColorPrimary: core.n1.tone(95),
          textColorSecondary: core.n2.tone(80),
          textColorTertiary: core.n2.tone(60),
          textColorPrimaryInverse: core.n1.tone(10),
          textColorSecondaryInverse: core.n1.tone(30),
          textColorTertiaryInverse: core.n1.tone(50),
          colorBackground: core.n1.tone(10),
          colorBackgroundFloating: core.n1.tone(10),
          colorSurface: core.n1.tone(20),
          colorSurfaceVariant: core.n1.tone(30),
          colorSurfaceHighlight: core.n1.tone(35),
          surfaceHeader: core.n1.tone(30),
          underSurface: core.n1.tone(0),
          offState: core.n1.tone(20),
          accentSurface: core.a2.tone(95),
          textPrimaryOnAccent: core.n1.tone(10),
          textSecondaryOnAccent: core.n2.tone(30),
          volumeBackground: core.n1.tone(25),
          scrim: core.n1.tone(80)
        });
      }
      constructor(props) {
        this.props = props;
      }
      toJSON() {
        return __spreadValues({}, this.props);
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/temperature/temperature_cache.js
var TemperatureCache;
var init_temperature_cache = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/temperature/temperature_cache.js"() {
    init_hct();
    init_color_utils();
    init_math_utils();
    TemperatureCache = class {
      constructor(input) {
        this.input = input;
        this.hctsByTempCache = [];
        this.hctsByHueCache = [];
        this.tempsByHctCache = /* @__PURE__ */ new Map();
        this.inputRelativeTemperatureCache = -1;
        this.complementCache = null;
      }
      get hctsByTemp() {
        if (this.hctsByTempCache.length > 0) {
          return this.hctsByTempCache;
        }
        const hcts = this.hctsByHue.concat([this.input]);
        const temperaturesByHct = this.tempsByHct;
        hcts.sort((a, b) => temperaturesByHct.get(a) - temperaturesByHct.get(b));
        this.hctsByTempCache = hcts;
        return hcts;
      }
      get warmest() {
        return this.hctsByTemp[this.hctsByTemp.length - 1];
      }
      get coldest() {
        return this.hctsByTemp[0];
      }
      analogous(count = 5, divisions = 12) {
        const startHue = Math.round(this.input.hue);
        const startHct = this.hctsByHue[startHue];
        let lastTemp = this.relativeTemperature(startHct);
        const allColors = [startHct];
        let absoluteTotalTempDelta = 0;
        for (let i = 0; i < 360; i++) {
          const hue = sanitizeDegreesInt(startHue + i);
          const hct = this.hctsByHue[hue];
          const temp = this.relativeTemperature(hct);
          const tempDelta = Math.abs(temp - lastTemp);
          lastTemp = temp;
          absoluteTotalTempDelta += tempDelta;
        }
        let hueAddend = 1;
        const tempStep = absoluteTotalTempDelta / divisions;
        let totalTempDelta = 0;
        lastTemp = this.relativeTemperature(startHct);
        while (allColors.length < divisions) {
          const hue = sanitizeDegreesInt(startHue + hueAddend);
          const hct = this.hctsByHue[hue];
          const temp = this.relativeTemperature(hct);
          const tempDelta = Math.abs(temp - lastTemp);
          totalTempDelta += tempDelta;
          const desiredTotalTempDeltaForIndex = allColors.length * tempStep;
          let indexSatisfied = totalTempDelta >= desiredTotalTempDeltaForIndex;
          let indexAddend = 1;
          while (indexSatisfied && allColors.length < divisions) {
            allColors.push(hct);
            const desiredTotalTempDeltaForIndex2 = (allColors.length + indexAddend) * tempStep;
            indexSatisfied = totalTempDelta >= desiredTotalTempDeltaForIndex2;
            indexAddend++;
          }
          lastTemp = temp;
          hueAddend++;
          if (hueAddend > 360) {
            while (allColors.length < divisions) {
              allColors.push(hct);
            }
            break;
          }
        }
        const answers = [this.input];
        const increaseHueCount = Math.floor((count - 1) / 2);
        for (let i = 1; i < increaseHueCount + 1; i++) {
          let index = 0 - i;
          while (index < 0) {
            index = allColors.length + index;
          }
          if (index >= allColors.length) {
            index = index % allColors.length;
          }
          answers.splice(0, 0, allColors[index]);
        }
        const decreaseHueCount = count - increaseHueCount - 1;
        for (let i = 1; i < decreaseHueCount + 1; i++) {
          let index = i;
          while (index < 0) {
            index = allColors.length + index;
          }
          if (index >= allColors.length) {
            index = index % allColors.length;
          }
          answers.push(allColors[index]);
        }
        return answers;
      }
      get complement() {
        if (this.complementCache != null) {
          return this.complementCache;
        }
        const coldestHue = this.coldest.hue;
        const coldestTemp = this.tempsByHct.get(this.coldest);
        const warmestHue = this.warmest.hue;
        const warmestTemp = this.tempsByHct.get(this.warmest);
        const range = warmestTemp - coldestTemp;
        const startHueIsColdestToWarmest = TemperatureCache.isBetween(this.input.hue, coldestHue, warmestHue);
        const startHue = startHueIsColdestToWarmest ? warmestHue : coldestHue;
        const endHue = startHueIsColdestToWarmest ? coldestHue : warmestHue;
        const directionOfRotation = 1;
        let smallestError = 1e3;
        let answer = this.hctsByHue[Math.round(this.input.hue)];
        const complementRelativeTemp = 1 - this.inputRelativeTemperature;
        for (let hueAddend = 0; hueAddend <= 360; hueAddend += 1) {
          const hue = sanitizeDegreesDouble(startHue + directionOfRotation * hueAddend);
          if (!TemperatureCache.isBetween(hue, startHue, endHue)) {
            continue;
          }
          const possibleAnswer = this.hctsByHue[Math.round(hue)];
          const relativeTemp = (this.tempsByHct.get(possibleAnswer) - coldestTemp) / range;
          const error = Math.abs(complementRelativeTemp - relativeTemp);
          if (error < smallestError) {
            smallestError = error;
            answer = possibleAnswer;
          }
        }
        this.complementCache = answer;
        return this.complementCache;
      }
      relativeTemperature(hct) {
        const range = this.tempsByHct.get(this.warmest) - this.tempsByHct.get(this.coldest);
        const differenceFromColdest = this.tempsByHct.get(hct) - this.tempsByHct.get(this.coldest);
        if (range === 0) {
          return 0.5;
        }
        return differenceFromColdest / range;
      }
      get inputRelativeTemperature() {
        if (this.inputRelativeTemperatureCache >= 0) {
          return this.inputRelativeTemperatureCache;
        }
        this.inputRelativeTemperatureCache = this.relativeTemperature(this.input);
        return this.inputRelativeTemperatureCache;
      }
      get tempsByHct() {
        if (this.tempsByHctCache.size > 0) {
          return this.tempsByHctCache;
        }
        const allHcts = this.hctsByHue.concat([this.input]);
        const temperaturesByHct = /* @__PURE__ */ new Map();
        for (const e of allHcts) {
          temperaturesByHct.set(e, TemperatureCache.rawTemperature(e));
        }
        this.tempsByHctCache = temperaturesByHct;
        return temperaturesByHct;
      }
      get hctsByHue() {
        if (this.hctsByHueCache.length > 0) {
          return this.hctsByHueCache;
        }
        const hcts = [];
        for (let hue = 0; hue <= 360; hue += 1) {
          const colorAtHue = Hct.from(hue, this.input.chroma, this.input.tone);
          hcts.push(colorAtHue);
        }
        this.hctsByHueCache = hcts;
        return this.hctsByHueCache;
      }
      static isBetween(angle, a, b) {
        if (a < b) {
          return a <= angle && angle <= b;
        }
        return a <= angle || angle <= b;
      }
      static rawTemperature(color) {
        const lab = labFromArgb(color.toInt());
        const hue = sanitizeDegreesDouble(Math.atan2(lab[2], lab[1]) * 180 / Math.PI);
        const chroma = Math.sqrt(lab[1] * lab[1] + lab[2] * lab[2]);
        const temperature = -0.5 + 0.02 * Math.pow(chroma, 1.07) * Math.cos(sanitizeDegreesDouble(hue - 50) * Math.PI / 180);
        return temperature;
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_content.js
var SchemeContent;
var init_scheme_content = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_content.js"() {
    init_dislike_analyzer();
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_temperature_cache();
    SchemeContent = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.CONTENT,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, Math.max(sourceColorHct.chroma - 32, sourceColorHct.chroma * 0.5)),
          tertiaryPalette: TonalPalette.fromInt(DislikeAnalyzer.fixIfDisliked(new TemperatureCache(sourceColorHct).analogous(3, 6)[2]).toInt()),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8 + 4)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_expressive.js
var SchemeExpressive;
var init_scheme_expressive = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_expressive.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_math_utils();
    SchemeExpressive = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.EXPRESSIVE,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue + 240), 40),
          secondaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, SchemeExpressive.hues, SchemeExpressive.secondaryRotations), 24),
          tertiaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, SchemeExpressive.hues, SchemeExpressive.tertiaryRotations), 32),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 8),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue + 15, 12)
        });
      }
    };
    SchemeExpressive.hues = [
      0,
      21,
      51,
      121,
      151,
      191,
      271,
      321,
      360
    ];
    SchemeExpressive.secondaryRotations = [
      45,
      95,
      45,
      20,
      45,
      90,
      45,
      45,
      45
    ];
    SchemeExpressive.tertiaryRotations = [
      120,
      120,
      20,
      45,
      20,
      15,
      20,
      120,
      120
    ];
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_fidelity.js
var SchemeFidelity;
var init_scheme_fidelity = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_fidelity.js"() {
    init_dislike_analyzer();
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_temperature_cache();
    SchemeFidelity = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.FIDELITY,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, Math.max(sourceColorHct.chroma - 32, sourceColorHct.chroma * 0.5)),
          tertiaryPalette: TonalPalette.fromInt(DislikeAnalyzer.fixIfDisliked(new TemperatureCache(sourceColorHct).complement).toInt()),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma / 8 + 4)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_fruit_salad.js
var SchemeFruitSalad;
var init_scheme_fruit_salad = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_fruit_salad.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_math_utils();
    SchemeFruitSalad = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.FRUIT_SALAD,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue - 50), 48),
          secondaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue - 50), 36),
          tertiaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 36),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_monochrome.js
var SchemeMonochrome;
var init_scheme_monochrome = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_monochrome.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    SchemeMonochrome = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.MONOCHROME,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0),
          tertiaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_neutral.js
var SchemeNeutral;
var init_scheme_neutral = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_neutral.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    SchemeNeutral = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.NEUTRAL,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 8),
          tertiaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 2),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 2)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_rainbow.js
var SchemeRainbow;
var init_scheme_rainbow = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_rainbow.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_math_utils();
    SchemeRainbow = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.RAINBOW,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 48),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16),
          tertiaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue + 60), 24),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 0)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_tonal_spot.js
var SchemeTonalSpot;
var init_scheme_tonal_spot = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_tonal_spot.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    init_math_utils();
    SchemeTonalSpot = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.TONAL_SPOT,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 36),
          secondaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 16),
          tertiaryPalette: TonalPalette.fromHueAndChroma(sanitizeDegreesDouble(sourceColorHct.hue + 60), 24),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 6),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 8)
        });
      }
    };
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_vibrant.js
var SchemeVibrant;
var init_scheme_vibrant = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/scheme/scheme_vibrant.js"() {
    init_dynamic_scheme();
    init_variant();
    init_tonal_palette();
    SchemeVibrant = class extends DynamicScheme {
      constructor(sourceColorHct, isDark, contrastLevel) {
        super({
          sourceColorArgb: sourceColorHct.toInt(),
          variant: Variant.VIBRANT,
          contrastLevel,
          isDark,
          primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 200),
          secondaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, SchemeVibrant.hues, SchemeVibrant.secondaryRotations), 24),
          tertiaryPalette: TonalPalette.fromHueAndChroma(DynamicScheme.getRotatedHue(sourceColorHct, SchemeVibrant.hues, SchemeVibrant.tertiaryRotations), 32),
          neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 10),
          neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 12)
        });
      }
    };
    SchemeVibrant.hues = [
      0,
      41,
      61,
      101,
      131,
      181,
      251,
      301,
      360
    ];
    SchemeVibrant.secondaryRotations = [
      18,
      15,
      10,
      12,
      15,
      18,
      15,
      12,
      12
    ];
    SchemeVibrant.tertiaryRotations = [
      35,
      30,
      20,
      25,
      30,
      35,
      30,
      25,
      25
    ];
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/score/score.js
function compare(a, b) {
  if (a.score > b.score) {
    return -1;
  } else if (a.score < b.score) {
    return 1;
  }
  return 0;
}
var SCORE_OPTION_DEFAULTS, Score;
var init_score = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/score/score.js"() {
    init_hct();
    init_math_utils();
    SCORE_OPTION_DEFAULTS = {
      desired: 4,
      fallbackColorARGB: 4282549748,
      filter: true
    };
    Score = class {
      constructor() {
      }
      static score(colorsToPopulation, options) {
        const { desired, fallbackColorARGB, filter } = __spreadValues(__spreadValues({}, SCORE_OPTION_DEFAULTS), options);
        const colorsHct = [];
        const huePopulation = new Array(360).fill(0);
        let populationSum = 0;
        for (const [argb, population] of colorsToPopulation.entries()) {
          const hct = Hct.fromInt(argb);
          colorsHct.push(hct);
          const hue = Math.floor(hct.hue);
          huePopulation[hue] += population;
          populationSum += population;
        }
        const hueExcitedProportions = new Array(360).fill(0);
        for (let hue = 0; hue < 360; hue++) {
          const proportion = huePopulation[hue] / populationSum;
          for (let i = hue - 14; i < hue + 16; i++) {
            const neighborHue = sanitizeDegreesInt(i);
            hueExcitedProportions[neighborHue] += proportion;
          }
        }
        const scoredHct = new Array();
        for (const hct of colorsHct) {
          const hue = sanitizeDegreesInt(Math.round(hct.hue));
          const proportion = hueExcitedProportions[hue];
          if (filter && (hct.chroma < Score.CUTOFF_CHROMA || proportion <= Score.CUTOFF_EXCITED_PROPORTION)) {
            continue;
          }
          const proportionScore = proportion * 100 * Score.WEIGHT_PROPORTION;
          const chromaWeight = hct.chroma < Score.TARGET_CHROMA ? Score.WEIGHT_CHROMA_BELOW : Score.WEIGHT_CHROMA_ABOVE;
          const chromaScore = (hct.chroma - Score.TARGET_CHROMA) * chromaWeight;
          const score = proportionScore + chromaScore;
          scoredHct.push({ hct, score });
        }
        scoredHct.sort(compare);
        const chosenColors = [];
        for (let differenceDegrees2 = 90; differenceDegrees2 >= 15; differenceDegrees2--) {
          chosenColors.length = 0;
          for (const { hct } of scoredHct) {
            const duplicateHue = chosenColors.find((chosenHct) => {
              return differenceDegrees(hct.hue, chosenHct.hue) < differenceDegrees2;
            });
            if (!duplicateHue) {
              chosenColors.push(hct);
            }
            if (chosenColors.length >= desired)
              break;
          }
          if (chosenColors.length >= desired)
            break;
        }
        const colors = [];
        if (chosenColors.length === 0) {
          colors.push(fallbackColorARGB);
        }
        for (const chosenHct of chosenColors) {
          colors.push(chosenHct.toInt());
        }
        return colors;
      }
    };
    Score.TARGET_CHROMA = 48;
    Score.WEIGHT_PROPORTION = 0.7;
    Score.WEIGHT_CHROMA_ABOVE = 0.3;
    Score.WEIGHT_CHROMA_BELOW = 0.1;
    Score.CUTOFF_CHROMA = 5;
    Score.CUTOFF_EXCITED_PROPORTION = 0.01;
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/string_utils.js
function hexFromArgb(argb) {
  const r = redFromArgb(argb);
  const g = greenFromArgb(argb);
  const b = blueFromArgb(argb);
  const outParts = [r.toString(16), g.toString(16), b.toString(16)];
  for (const [i, part] of outParts.entries()) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  }
  return "#" + outParts.join("");
}
function argbFromHex(hex) {
  hex = hex.replace("#", "");
  const isThree = hex.length === 3;
  const isSix = hex.length === 6;
  const isEight = hex.length === 8;
  if (!isThree && !isSix && !isEight) {
    throw new Error("unexpected hex " + hex);
  }
  let r = 0;
  let g = 0;
  let b = 0;
  if (isThree) {
    r = parseIntHex(hex.slice(0, 1).repeat(2));
    g = parseIntHex(hex.slice(1, 2).repeat(2));
    b = parseIntHex(hex.slice(2, 3).repeat(2));
  } else if (isSix) {
    r = parseIntHex(hex.slice(0, 2));
    g = parseIntHex(hex.slice(2, 4));
    b = parseIntHex(hex.slice(4, 6));
  } else if (isEight) {
    r = parseIntHex(hex.slice(2, 4));
    g = parseIntHex(hex.slice(4, 6));
    b = parseIntHex(hex.slice(6, 8));
  }
  return (255 << 24 | (r & 255) << 16 | (g & 255) << 8 | b & 255) >>> 0;
}
function parseIntHex(value) {
  return parseInt(value, 16);
}
var init_string_utils = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/string_utils.js"() {
    init_color_utils();
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/image_utils.js
function sourceColorFromImage(image) {
  return __async(this, null, function* () {
    const imageBytes = yield new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      const loadCallback = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        let rect = [0, 0, image.width, image.height];
        const area = image.dataset["area"];
        if (area && /^\d+(\s*,\s*\d+){3}$/.test(area)) {
          rect = area.split(/\s*,\s*/).map((s) => {
            return parseInt(s, 10);
          });
        }
        const [sx, sy, sw, sh] = rect;
        resolve(context.getImageData(sx, sy, sw, sh).data);
      };
      const errorCallback = () => {
        reject(new Error("Image load failed"));
      };
      if (image.complete) {
        loadCallback();
      } else {
        image.onload = loadCallback;
        image.onerror = errorCallback;
      }
    });
    const pixels = [];
    for (let i = 0; i < imageBytes.length; i += 4) {
      const r = imageBytes[i];
      const g = imageBytes[i + 1];
      const b = imageBytes[i + 2];
      const a = imageBytes[i + 3];
      if (a < 255) {
        continue;
      }
      const argb = argbFromRgb(r, g, b);
      pixels.push(argb);
    }
    const result = QuantizerCelebi.quantize(pixels, 128);
    const ranked = Score.score(result);
    const top = ranked[0];
    return top;
  });
}
var init_image_utils = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/image_utils.js"() {
    init_quantizer_celebi();
    init_score();
    init_color_utils();
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/theme_utils.js
function themeFromSourceColor(source, customColors = []) {
  const palette = CorePalette.of(source);
  return {
    source,
    schemes: {
      light: Scheme.light(source),
      dark: Scheme.dark(source)
    },
    palettes: {
      primary: palette.a1,
      secondary: palette.a2,
      tertiary: palette.a3,
      neutral: palette.n1,
      neutralVariant: palette.n2,
      error: palette.error
    },
    customColors: customColors.map((c) => customColor(source, c))
  };
}
function themeFromImage(_0) {
  return __async(this, arguments, function* (image, customColors = []) {
    const source = yield sourceColorFromImage(image);
    return themeFromSourceColor(source, customColors);
  });
}
function customColor(source, color) {
  let value = color.value;
  const from = value;
  const to = source;
  if (color.blend) {
    value = Blend.harmonize(from, to);
  }
  const palette = CorePalette.of(value);
  const tones = palette.a1;
  return {
    color,
    value,
    light: {
      color: tones.tone(40),
      onColor: tones.tone(100),
      colorContainer: tones.tone(90),
      onColorContainer: tones.tone(10)
    },
    dark: {
      color: tones.tone(80),
      onColor: tones.tone(20),
      colorContainer: tones.tone(30),
      onColorContainer: tones.tone(90)
    }
  };
}
function applyTheme(theme, options) {
  var _a, _b;
  const target = (options == null ? void 0 : options.target) || document.body;
  const isDark = (_a = options == null ? void 0 : options.dark) != null ? _a : false;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  setSchemeProperties(target, scheme);
  if (options == null ? void 0 : options.brightnessSuffix) {
    setSchemeProperties(target, theme.schemes.dark, "-dark");
    setSchemeProperties(target, theme.schemes.light, "-light");
  }
  if (options == null ? void 0 : options.paletteTones) {
    const tones = (_b = options == null ? void 0 : options.paletteTones) != null ? _b : [];
    for (const [key, palette] of Object.entries(theme.palettes)) {
      const paletteKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      for (const tone of tones) {
        const token = `--md-ref-palette-${paletteKey}-${paletteKey}${tone}`;
        const color = hexFromArgb(palette.tone(tone));
        target.style.setProperty(token, color);
      }
    }
  }
}
function setSchemeProperties(target, scheme, suffix = "") {
  for (const [key, value] of Object.entries(scheme.toJSON())) {
    const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const color = hexFromArgb(value);
    target.style.setProperty(`--md-sys-color-${token}${suffix}`, color);
  }
}
var init_theme_utils = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/utils/theme_utils.js"() {
    init_blend();
    init_core_palette();
    init_scheme();
    init_image_utils();
    init_string_utils();
  }
});

// bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/index.js
var material_color_utilities_exports = {};
__export(material_color_utilities_exports, {
  Blend: () => Blend,
  Cam16: () => Cam16,
  Contrast: () => Contrast,
  CorePalette: () => CorePalette,
  DislikeAnalyzer: () => DislikeAnalyzer,
  DynamicColor: () => DynamicColor,
  DynamicScheme: () => DynamicScheme,
  Hct: () => Hct,
  MaterialDynamicColors: () => MaterialDynamicColors,
  QuantizerCelebi: () => QuantizerCelebi,
  QuantizerMap: () => QuantizerMap,
  QuantizerWsmeans: () => QuantizerWsmeans,
  QuantizerWu: () => QuantizerWu,
  Scheme: () => Scheme,
  SchemeAndroid: () => SchemeAndroid,
  SchemeContent: () => SchemeContent,
  SchemeExpressive: () => SchemeExpressive,
  SchemeFidelity: () => SchemeFidelity,
  SchemeFruitSalad: () => SchemeFruitSalad,
  SchemeMonochrome: () => SchemeMonochrome,
  SchemeNeutral: () => SchemeNeutral,
  SchemeRainbow: () => SchemeRainbow,
  SchemeTonalSpot: () => SchemeTonalSpot,
  SchemeVibrant: () => SchemeVibrant,
  Score: () => Score,
  TemperatureCache: () => TemperatureCache,
  TonalPalette: () => TonalPalette,
  ViewingConditions: () => ViewingConditions,
  alphaFromArgb: () => alphaFromArgb,
  applyTheme: () => applyTheme,
  argbFromHex: () => argbFromHex,
  argbFromLab: () => argbFromLab,
  argbFromLinrgb: () => argbFromLinrgb,
  argbFromLstar: () => argbFromLstar,
  argbFromRgb: () => argbFromRgb,
  argbFromRgba: () => argbFromRgba,
  argbFromXyz: () => argbFromXyz,
  blueFromArgb: () => blueFromArgb,
  clampDouble: () => clampDouble,
  clampInt: () => clampInt,
  customColor: () => customColor,
  delinearized: () => delinearized,
  differenceDegrees: () => differenceDegrees,
  greenFromArgb: () => greenFromArgb,
  hexFromArgb: () => hexFromArgb,
  isOpaque: () => isOpaque,
  labFromArgb: () => labFromArgb,
  lerp: () => lerp,
  linearized: () => linearized,
  lstarFromArgb: () => lstarFromArgb,
  lstarFromY: () => lstarFromY,
  matrixMultiply: () => matrixMultiply,
  redFromArgb: () => redFromArgb,
  rgbaFromArgb: () => rgbaFromArgb,
  rotationDirection: () => rotationDirection,
  sanitizeDegreesDouble: () => sanitizeDegreesDouble,
  sanitizeDegreesInt: () => sanitizeDegreesInt,
  signum: () => signum,
  sourceColorFromImage: () => sourceColorFromImage,
  themeFromImage: () => themeFromImage,
  themeFromSourceColor: () => themeFromSourceColor,
  whitePointD65: () => whitePointD65,
  xyzFromArgb: () => xyzFromArgb,
  yFromLstar: () => yFromLstar
});
var init_material_color_utilities = __esm({
  "bazel-out/k8-fastbuild/bin/node_modules/@material/material-color-utilities/index.js"() {
    init_blend();
    init_contrast();
    init_dislike_analyzer();
    init_dynamic_color();
    init_dynamic_scheme();
    init_material_dynamic_colors();
    init_cam16();
    init_hct();
    init_viewing_conditions();
    init_core_palette();
    init_tonal_palette();
    init_quantizer_celebi();
    init_quantizer_map();
    init_quantizer_wsmeans();
    init_quantizer_wu();
    init_scheme();
    init_scheme_android();
    init_scheme_content();
    init_scheme_expressive();
    init_scheme_fidelity();
    init_scheme_fruit_salad();
    init_scheme_monochrome();
    init_scheme_neutral();
    init_scheme_rainbow();
    init_scheme_tonal_spot();
    init_scheme_vibrant();
    init_score();
    init_temperature_cache();
    init_color_utils();
    init_math_utils();
    init_string_utils();
    init_image_utils();
    init_theme_utils();
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-generate/theme-color/index.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHctFromHex = getHctFromHex;
exports.getMaterialDynamicScheme = getMaterialDynamicScheme;
exports.getColorPalettes = getColorPalettes;
exports.generateSCSSTheme = generateSCSSTheme;
exports.getAllSysVariablesCSS = getAllSysVariablesCSS;
exports.getHighContrastOverridesCSS = getHighContrastOverridesCSS;
exports.default = default_1;
var material_color_utilities_1 = (init_material_color_utilities(), __toCommonJS(material_color_utilities_exports));
var HUE_TONES = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
var NEUTRAL_HUES = /* @__PURE__ */ new Map([
  [4, { prev: 0, next: 10 }],
  [6, { prev: 0, next: 10 }],
  [12, { prev: 10, next: 20 }],
  [17, { prev: 10, next: 20 }],
  [22, { prev: 20, next: 25 }],
  [24, { prev: 20, next: 25 }],
  [87, { prev: 80, next: 90 }],
  [92, { prev: 90, next: 95 }],
  [94, { prev: 90, next: 95 }],
  [96, { prev: 95, next: 98 }]
]);
var NEUTRAL_HUE_TONES = [...HUE_TONES, ...NEUTRAL_HUES.keys()];
function getHctFromHex(color) {
  try {
    return material_color_utilities_1.Hct.fromInt((0, material_color_utilities_1.argbFromHex)(color));
  } catch (e) {
    throw new Error("Cannot parse the specified color " + color + ". Please verify it is a hex color (ex. #ffffff or ffffff).");
  }
}
function getMaterialDynamicScheme(primaryPalette, secondaryPalette, tertiaryPalette, neutralPalette, neutralVariantPalette, isDark, contrastLevel) {
  return new material_color_utilities_1.DynamicScheme({
    sourceColorArgb: primaryPalette.keyColor.toInt(),
    variant: 6,
    contrastLevel,
    isDark,
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    neutralPalette,
    neutralVariantPalette
  });
}
function getColorPalettes(primaryColor, secondaryColor, tertiaryColor, neutralColor, neutralVariantColor, errorColor) {
  const primaryColorHct = getHctFromHex(primaryColor);
  const primaryPalette = material_color_utilities_1.TonalPalette.fromHct(primaryColorHct);
  let secondaryPalette;
  if (secondaryColor) {
    secondaryPalette = material_color_utilities_1.TonalPalette.fromHct(getHctFromHex(secondaryColor));
  } else {
    secondaryPalette = material_color_utilities_1.TonalPalette.fromHueAndChroma(primaryColorHct.hue, Math.max(primaryColorHct.chroma - 32, primaryColorHct.chroma * 0.5));
  }
  let tertiaryPalette;
  if (tertiaryColor) {
    tertiaryPalette = material_color_utilities_1.TonalPalette.fromHct(getHctFromHex(tertiaryColor));
  } else {
    tertiaryPalette = material_color_utilities_1.TonalPalette.fromInt(material_color_utilities_1.DislikeAnalyzer.fixIfDisliked(new material_color_utilities_1.TemperatureCache(primaryColorHct).analogous(3, 6)[2]).toInt());
  }
  let neutralPalette;
  if (neutralColor) {
    neutralPalette = material_color_utilities_1.TonalPalette.fromHct(getHctFromHex(neutralColor));
  } else {
    neutralPalette = material_color_utilities_1.TonalPalette.fromHueAndChroma(primaryColorHct.hue, primaryColorHct.chroma / 8);
  }
  let neutralVariantPalette;
  if (neutralVariantColor) {
    neutralVariantPalette = material_color_utilities_1.TonalPalette.fromHct(getHctFromHex(neutralVariantColor));
  } else {
    neutralVariantPalette = material_color_utilities_1.TonalPalette.fromHueAndChroma(primaryColorHct.hue, primaryColorHct.chroma / 8 + 4);
  }
  let errorPalette;
  if (errorColor) {
    errorPalette = material_color_utilities_1.TonalPalette.fromHct(getHctFromHex(errorColor));
  } else {
    errorPalette = getMaterialDynamicScheme(
      primaryPalette,
      secondaryPalette,
      tertiaryPalette,
      neutralPalette,
      neutralVariantPalette,
      false,
      0
    ).errorPalette;
  }
  return {
    primary: primaryPalette,
    secondary: secondaryPalette,
    tertiary: tertiaryPalette,
    neutral: neutralPalette,
    neutralVariant: neutralVariantPalette,
    error: errorPalette
  };
}
function getColorPalettesSCSS(colorPalettes) {
  let scss = "(\n";
  for (const [variant, palette] of Object.entries(colorPalettes)) {
    const paletteKey = variant.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    scss += "  " + paletteKey + ": (\n";
    const tones = paletteKey === "neutral" ? NEUTRAL_HUE_TONES : HUE_TONES;
    for (const tone of tones) {
      const color = (0, material_color_utilities_1.hexFromArgb)(palette.tone(tone));
      scss += "    " + tone + ": " + color + ",\n";
    }
    scss += "  ),\n";
  }
  scss += ");";
  return scss;
}
function generateSCSSTheme(colorPalettes, colorComment) {
  let scss = [
    "// This file was generated by running 'ng generate @angular/material:theme-color'.",
    "// Proceed with caution if making changes to this file.",
    "",
    "@use 'sass:map';",
    "@use '@angular/material' as mat;",
    "",
    "// Note: " + colorComment,
    "$_palettes: " + getColorPalettesSCSS(colorPalettes),
    "",
    "$_rest: (",
    "  secondary: map.get($_palettes, secondary),",
    "  neutral: map.get($_palettes, neutral),",
    "  neutral-variant: map.get($_palettes,  neutral-variant),",
    "  error: map.get($_palettes, error),",
    ");",
    "",
    "$primary-palette: map.merge(map.get($_palettes, primary), $_rest);",
    "$tertiary-palette: map.merge(map.get($_palettes, tertiary), $_rest);"
  ];
  return scss.join("\n");
}
function getHighContrastOverides(colorScheme) {
  const overrides = /* @__PURE__ */ new Map();
  overrides.set("primary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.primary));
  overrides.set("on-primary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onPrimary));
  overrides.set("primary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.primaryContainer));
  overrides.set("on-primary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onPrimaryContainer));
  overrides.set("inverse-primary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.inversePrimary));
  overrides.set("primary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.primaryFixed));
  overrides.set("primary-fixed-dim", (0, material_color_utilities_1.hexFromArgb)(colorScheme.primaryFixedDim));
  overrides.set("on-primary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onPrimaryFixed));
  overrides.set("on-primary-fixed-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onPrimaryFixedVariant));
  overrides.set("secondary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.secondary));
  overrides.set("on-secondary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSecondary));
  overrides.set("secondary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.secondaryContainer));
  overrides.set("on-secondary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSecondaryContainer));
  overrides.set("secondary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.secondaryFixed));
  overrides.set("secondary-fixed-dim", (0, material_color_utilities_1.hexFromArgb)(colorScheme.secondaryFixedDim));
  overrides.set("on-secondary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSecondaryFixed));
  overrides.set("on-secondary-fixed-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSecondaryFixedVariant));
  overrides.set("tertiary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.tertiary));
  overrides.set("on-tertiary", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onTertiary));
  overrides.set("tertiary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.tertiaryContainer));
  overrides.set("on-tertiary-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onTertiaryContainer));
  overrides.set("tertiary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.tertiaryFixed));
  overrides.set("tertiary-fixed-dim", (0, material_color_utilities_1.hexFromArgb)(colorScheme.tertiaryFixedDim));
  overrides.set("on-tertiary-fixed", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onTertiaryFixed));
  overrides.set("on-tertiary-fixed-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onTertiaryFixedVariant));
  overrides.set("background", (0, material_color_utilities_1.hexFromArgb)(colorScheme.background));
  overrides.set("on-background", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onBackground));
  overrides.set("surface", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surface));
  overrides.set("surface-dim", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceDim));
  overrides.set("surface-bright", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceBright));
  overrides.set("surface-container-lowest", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceContainerLowest));
  overrides.set("surface-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceContainer));
  overrides.set("surface-container-high", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceContainerHigh));
  overrides.set("surface-container-highest", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceContainerHighest));
  overrides.set("on-surface", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSurface));
  overrides.set("shadow", (0, material_color_utilities_1.hexFromArgb)(colorScheme.shadow));
  overrides.set("scrim", (0, material_color_utilities_1.hexFromArgb)(colorScheme.scrim));
  overrides.set("surface-tint", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceTint));
  overrides.set("inverse-surface", (0, material_color_utilities_1.hexFromArgb)(colorScheme.inverseSurface));
  overrides.set("inverse-on-surface", (0, material_color_utilities_1.hexFromArgb)(colorScheme.inverseOnSurface));
  overrides.set("outline", (0, material_color_utilities_1.hexFromArgb)(colorScheme.outline));
  overrides.set("outline-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.outlineVariant));
  overrides.set("error", (0, material_color_utilities_1.hexFromArgb)(colorScheme.error));
  overrides.set("on-error", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onError));
  overrides.set("error-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.errorContainer));
  overrides.set("on-error-container", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onErrorContainer));
  overrides.set("surface-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.surfaceVariant));
  overrides.set("on-surface-variant", (0, material_color_utilities_1.hexFromArgb)(colorScheme.onSurfaceVariant));
  return overrides;
}
function generateHighContrastOverrideMixinsSCSS(lightHighContrastColorScheme, darkHighContrastColorScheme) {
  let scss = "\n";
  scss += "\n@function _high-contrast-value($light, $dark, $theme-type) {\n";
  scss += "  @if ($theme-type == light) {\n";
  scss += "    @return $light;\n";
  scss += "  }\n";
  scss += "  @if ($theme-type == dark) {\n";
  scss += "    @return $dark;\n";
  scss += "  }\n";
  scss += "  @if ($theme-type == color-scheme) {\n";
  scss += "    @return light-dark(#{$light}, #{$dark});\n";
  scss += "  }\n";
  scss += "  \n  @error 'Unknown theme-type #{$theme-type}. Expected light, dark, or color-scheme';\n";
  scss += "}\n";
  const lightOverrides = getHighContrastOverides(lightHighContrastColorScheme);
  const darkOverrides = getHighContrastOverides(darkHighContrastColorScheme);
  scss += "\n@mixin high-contrast-overrides($theme-type) {\n";
  scss += "  @include mat.theme-overrides((\n";
  for (const [key, value] of lightOverrides.entries()) {
    scss += "    " + key + ": _high-contrast-value(" + value + ", " + darkOverrides.get(key) + ", $theme-type),\n";
  }
  scss += "  ))\n";
  scss += " }\n";
  return scss;
}
function createLightDarkVar(leftSpacing, variableName, lightColor, darkColor, comment) {
  const commentContent = comment ? " /* " + comment + " */" : "";
  const lightDarkValue = "light-dark(" + (0, material_color_utilities_1.hexFromArgb)(lightColor) + ", " + (0, material_color_utilities_1.hexFromArgb)(darkColor) + ");";
  return leftSpacing + "--mat-sys-" + variableName + ": " + lightDarkValue + commentContent + "\n";
}
function getColorSysVariablesCSS(lightScheme, darkScheme, isHighContrast = false) {
  let css = "";
  let leftSpacing = " ".repeat(isHighContrast ? 4 : 2);
  css += leftSpacing + "/* Primary palette variables */\n";
  css += createLightDarkVar(leftSpacing, "primary", isHighContrast ? lightScheme.primary : lightScheme.primaryPalette.tone(40), isHighContrast ? darkScheme.primary : lightScheme.primaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-primary", isHighContrast ? lightScheme.onPrimary : lightScheme.primaryPalette.tone(100), isHighContrast ? darkScheme.onPrimary : darkScheme.primaryPalette.tone(20));
  css += createLightDarkVar(leftSpacing, "primary-container", isHighContrast ? lightScheme.primaryContainer : lightScheme.primaryPalette.tone(90), isHighContrast ? darkScheme.primaryContainer : darkScheme.primaryPalette.tone(30));
  css += createLightDarkVar(leftSpacing, "on-primary-container", isHighContrast ? lightScheme.onPrimaryContainer : lightScheme.primaryPalette.tone(10), isHighContrast ? darkScheme.onPrimaryContainer : darkScheme.primaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "inverse-primary", lightScheme.inversePrimary, darkScheme.inversePrimary);
  css += createLightDarkVar(leftSpacing, "primary-fixed", isHighContrast ? lightScheme.primaryFixed : lightScheme.primaryPalette.tone(90), isHighContrast ? darkScheme.primaryFixed : darkScheme.primaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "primary-fixed-dim", isHighContrast ? lightScheme.primaryFixedDim : lightScheme.primaryPalette.tone(80), isHighContrast ? darkScheme.primaryFixedDim : darkScheme.primaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-primary-fixed", lightScheme.onPrimaryFixed, darkScheme.onPrimaryFixed);
  css += createLightDarkVar(leftSpacing, "on-primary-fixed-variant", lightScheme.onPrimaryFixedVariant, darkScheme.onPrimaryFixedVariant);
  css += "\n" + leftSpacing + "/* Secondary palette variables */\n";
  css += createLightDarkVar(leftSpacing, "secondary", isHighContrast ? lightScheme.secondary : lightScheme.secondaryPalette.tone(40), isHighContrast ? darkScheme.secondary : darkScheme.secondaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-secondary", isHighContrast ? lightScheme.onSecondary : lightScheme.secondaryPalette.tone(100), isHighContrast ? darkScheme.onSecondary : darkScheme.secondaryPalette.tone(20));
  css += createLightDarkVar(leftSpacing, "secondary-container", isHighContrast ? lightScheme.secondaryContainer : lightScheme.secondaryPalette.tone(90), isHighContrast ? darkScheme.secondaryContainer : darkScheme.secondaryPalette.tone(30));
  css += createLightDarkVar(leftSpacing, "on-secondary-container", isHighContrast ? lightScheme.onSecondaryContainer : lightScheme.secondaryPalette.tone(10), isHighContrast ? darkScheme.onSecondaryContainer : darkScheme.secondaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "secondary-fixed", isHighContrast ? lightScheme.secondaryFixed : lightScheme.secondaryPalette.tone(90), isHighContrast ? darkScheme.secondaryFixed : darkScheme.secondaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "secondary-fixed-dim", isHighContrast ? lightScheme.secondaryFixedDim : lightScheme.secondaryPalette.tone(80), isHighContrast ? darkScheme.secondaryFixedDim : darkScheme.secondaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-secondary-fixed", lightScheme.onSecondaryFixed, darkScheme.onSecondaryFixed);
  css += createLightDarkVar(leftSpacing, "on-secondary-fixed-variant", lightScheme.onSecondaryFixedVariant, darkScheme.onSecondaryFixedVariant);
  css += "\n" + leftSpacing + "/* Tertiary palette variables */\n";
  css += createLightDarkVar(leftSpacing, "tertiary", isHighContrast ? lightScheme.tertiary : lightScheme.tertiaryPalette.tone(40), isHighContrast ? darkScheme.tertiary : darkScheme.tertiaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-tertiary", isHighContrast ? lightScheme.tertiary : lightScheme.tertiaryPalette.tone(100), isHighContrast ? darkScheme.tertiary : darkScheme.tertiaryPalette.tone(20));
  css += createLightDarkVar(leftSpacing, "tertiary-container", isHighContrast ? lightScheme.tertiaryContainer : lightScheme.tertiaryPalette.tone(90), isHighContrast ? darkScheme.tertiaryContainer : darkScheme.tertiaryPalette.tone(30));
  css += createLightDarkVar(leftSpacing, "on-tertiary-container", isHighContrast ? lightScheme.onTertiaryContainer : lightScheme.tertiaryPalette.tone(10), isHighContrast ? darkScheme.onTertiaryContainer : darkScheme.tertiaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "tertiary-fixed", isHighContrast ? lightScheme.tertiaryFixed : lightScheme.tertiaryPalette.tone(90), isHighContrast ? darkScheme.tertiaryFixed : darkScheme.tertiaryPalette.tone(90));
  css += createLightDarkVar(leftSpacing, "tertiary-fixed-dim", isHighContrast ? lightScheme.tertiaryFixedDim : lightScheme.tertiaryPalette.tone(80), isHighContrast ? darkScheme.tertiaryFixedDim : darkScheme.tertiaryPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-tertiary-fixed", lightScheme.onTertiaryFixed, darkScheme.onTertiaryFixed);
  css += createLightDarkVar(leftSpacing, "on-tertiary-fixed-variant", lightScheme.onTertiaryFixedVariant, darkScheme.onTertiaryFixedVariant);
  css += "\n" + leftSpacing + "/* Neutral palette variables */\n";
  css += createLightDarkVar(leftSpacing, "background", lightScheme.background, darkScheme.background);
  css += createLightDarkVar(leftSpacing, "on-background", lightScheme.onBackground, darkScheme.onBackground);
  css += createLightDarkVar(leftSpacing, "surface", lightScheme.surface, darkScheme.surface);
  css += createLightDarkVar(leftSpacing, "surface-dim", lightScheme.surfaceDim, darkScheme.surfaceDim);
  css += createLightDarkVar(leftSpacing, "surface-bright", lightScheme.surfaceBright, darkScheme.surfaceBright);
  css += createLightDarkVar(leftSpacing, "surface-container-lowest", lightScheme.surfaceContainerLowest, darkScheme.surfaceContainerLowest);
  css += createLightDarkVar(leftSpacing, "surface-container", lightScheme.surfaceContainer, darkScheme.surfaceContainer);
  css += createLightDarkVar(leftSpacing, "surface-container-high", lightScheme.surfaceContainerHigh, darkScheme.surfaceContainerHigh);
  css += createLightDarkVar(leftSpacing, "surface-container-highest", lightScheme.surfaceContainerHighest, darkScheme.surfaceContainerHighest);
  css += createLightDarkVar(leftSpacing, "on-surface", lightScheme.onSurface, darkScheme.onSurface);
  css += createLightDarkVar(leftSpacing, "shadow", lightScheme.shadow, darkScheme.shadow);
  css += createLightDarkVar(leftSpacing, "scrim", lightScheme.scrim, darkScheme.scrim);
  css += createLightDarkVar(leftSpacing, "surface-tint", lightScheme.surfaceTint, darkScheme.surfaceTint);
  css += createLightDarkVar(leftSpacing, "inverse-surface", lightScheme.inverseSurface, darkScheme.inverseSurface);
  css += createLightDarkVar(leftSpacing, "inverse-on-surface", lightScheme.inverseOnSurface, darkScheme.inverseOnSurface);
  css += createLightDarkVar(leftSpacing, "outline", lightScheme.outline, darkScheme.outline);
  css += createLightDarkVar(leftSpacing, "outline-variant", lightScheme.outlineVariant, darkScheme.outlineVariant);
  css += createLightDarkVar(leftSpacing, "neutral10", lightScheme.neutralPalette.tone(10), darkScheme.neutralPalette.tone(10), "Variable used for the form field native select option text color");
  css += "\n" + leftSpacing + "/* Error palette variables */\n";
  css += createLightDarkVar(leftSpacing, "error", isHighContrast ? lightScheme.error : lightScheme.errorPalette.tone(40), isHighContrast ? darkScheme.error : darkScheme.errorPalette.tone(80));
  css += createLightDarkVar(leftSpacing, "on-error", lightScheme.onError, darkScheme.onError);
  css += createLightDarkVar(leftSpacing, "error-container", isHighContrast ? lightScheme.errorContainer : lightScheme.errorPalette.tone(90), isHighContrast ? darkScheme.errorContainer : darkScheme.errorPalette.tone(30));
  css += createLightDarkVar(leftSpacing, "on-error-container", isHighContrast ? lightScheme.onErrorContainer : lightScheme.errorPalette.tone(10), isHighContrast ? darkScheme.onErrorContainer : darkScheme.errorPalette.tone(90));
  css += "\n" + leftSpacing + "/* Neutral variant palette variables */\n";
  css += createLightDarkVar(leftSpacing, "surface-variant", lightScheme.surfaceVariant, darkScheme.surfaceVariant);
  css += createLightDarkVar(leftSpacing, "on-surface-variant", lightScheme.onSurfaceVariant, darkScheme.onSurfaceVariant);
  css += createLightDarkVar(leftSpacing, "neutral-variant20", lightScheme.neutralVariantPalette.tone(20), darkScheme.neutralVariantPalette.tone(20), "Variable used for the sidenav scrim (container background shadow when opened)");
  return css;
}
function getTypographySysVariablesCSS() {
  let css = "";
  css += "\n  /* Typography variables. Only used in the different typescale system variables. */\n";
  css += "  --mat-sys-brand-font-family: Roboto; /* The font-family to use for brand text. */\n";
  css += "  --mat-sys-plain-font-family: Roboto; /* The font-family to use for plain text. */\n";
  css += "  --mat-sys-bold-font-weight: 700; /* The font-weight to use for bold text. */\n";
  css += "  --mat-sys-medium-font-weight: 500; /* The font-weight to use for medium text. */\n";
  css += "  --mat-sys-regular-font-weight: 400; /* The font-weight to use for regular text. */\n\n";
  css += "  /* Typescale variables. */\n";
  css += "  /* Warning: Risk of reduced fidelity from using the composite typography tokens (ex. --mat-sys-body-large) since\n";
  css += '     tracking cannot be represented in the "font" property shorthand. Consider using the discrete properties instead. */\n';
  css += "  --mat-sys-body-large: var(--mat-sys-body-large-weight) var(--mat-sys-body-large-size) / var(--mat-sys-body-large-line-height) var(--mat-sys-body-large-font);\n";
  css += "  --mat-sys-body-large-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-body-large-line-height: 1.5rem;\n";
  css += "  --mat-sys-body-large-size: 1rem;\n";
  css += "  --mat-sys-body-large-tracking: 0.031rem;\n";
  css += "  --mat-sys-body-large-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Body medium typescale */\n";
  css += "  --mat-sys-body-medium: var(--mat-sys-body-medium-weight) var(--mat-sys-body-medium-size) / var(--mat-sys-body-medium-line-height) var(--mat-sys-body-medium-font);\n";
  css += "  --mat-sys-body-medium-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-body-medium-line-height: 1.25rem;\n";
  css += "  --mat-sys-body-medium-size: 0.875rem;\n";
  css += "  --mat-sys-body-medium-tracking: 0.016rem;\n";
  css += "  --mat-sys-body-medium-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Body small typescale */\n";
  css += "  --mat-sys-body-small: var(--mat-sys-body-small-weight) var(--mat-sys-body-small-size) / var(--mat-sys-body-small-line-height) var(--mat-sys-body-small-font);\n";
  css += "  --mat-sys-body-small-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-body-small-line-height: 1rem;\n";
  css += "  --mat-sys-body-small-size: 0.75rem;\n";
  css += "  --mat-sys-body-small-tracking: 0.025rem;\n";
  css += "  --mat-sys-body-small-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Display large typescale */\n";
  css += "  --mat-sys-display-large: var(--mat-sys-display-large-weight) var(--mat-sys-display-large-size) / var(--mat-sys-display-large-line-height) var(--mat-sys-display-large-font);\n";
  css += "  --mat-sys-display-large-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-display-large-line-height: 4rem;\n";
  css += "  --mat-sys-display-large-size: 3.562rem;\n";
  css += "  --mat-sys-display-large-tracking: -0.016rem;\n";
  css += "  --mat-sys-display-large-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Display medium typescale */\n";
  css += "  --mat-sys-display-medium: var(--mat-sys-display-medium-weight) var(--mat-sys-display-medium-size) / var(--mat-sys-display-medium-line-height) var(--mat-sys-display-medium-font);\n";
  css += "  --mat-sys-display-medium-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-display-medium-line-height: 3.25rem;\n";
  css += "  --mat-sys-display-medium-size: 2.812rem;\n";
  css += "  --mat-sys-display-medium-tracking: 0;\n";
  css += "  --mat-sys-display-medium-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Display small typescale */\n";
  css += "  --mat-sys-display-small: var(--mat-sys-display-small-weight) var(--mat-sys-display-small-size) / var(--mat-sys-display-small-line-height) var(--mat-sys-display-small-font);\n";
  css += "  --mat-sys-display-small-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-display-small-line-height: 2.75rem;\n";
  css += "  --mat-sys-display-small-size: 2.25rem;\n";
  css += "  --mat-sys-display-small-tracking: 0;\n";
  css += "  --mat-sys-display-small-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Headline large typescale */\n";
  css += "  --mat-sys-headline-large: var(--mat-sys-headline-large-weight) var(--mat-sys-headline-large-size) / var(--mat-sys-headline-large-line-height) var(--mat-sys-headline-large-font);\n";
  css += "  --mat-sys-headline-large-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-headline-large-line-height: 2.5rem;\n";
  css += "  --mat-sys-headline-large-size: 2rem;\n";
  css += "  --mat-sys-headline-large-tracking: 0;\n";
  css += "  --mat-sys-headline-large-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Headline medium typescale */\n";
  css += "  --mat-sys-headline-medium: var(--mat-sys-headline-medium-weight) var(--mat-sys-headline-medium-size) / var(--mat-sys-headline-medium-line-height) var(--mat-sys-headline-medium-font);\n";
  css += "  --mat-sys-headline-medium-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-headline-medium-line-height: 2.25rem;\n";
  css += "  --mat-sys-headline-medium-size: 1.75rem;\n";
  css += "  --mat-sys-headline-medium-tracking: 0;\n";
  css += "  --mat-sys-headline-medium-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Headline small typescale */\n";
  css += "  --mat-sys-headline-small: var(--mat-sys-headline-small-weight) var(--mat-sys-headline-small-size) / var(--mat-sys-headline-small-line-height) var(--mat-sys-headline-small-font);\n";
  css += "  --mat-sys-headline-small-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-headline-small-line-height: 2rem;\n";
  css += "  --mat-sys-headline-small-size: 1.5rem;\n";
  css += "  --mat-sys-headline-small-tracking: 0;\n";
  css += "  --mat-sys-headline-small-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Label large typescale */\n";
  css += "  --mat-sys-label-large: var(--mat-sys-label-large-weight) var(--mat-sys-label-large-size) / var(--mat-sys-label-large-line-height) var(--mat-sys-label-large-font);\n";
  css += "  --mat-sys-label-large-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-label-large-line-height: 1.25rem;\n";
  css += "  --mat-sys-label-large-size: 0.875rem;\n";
  css += "  --mat-sys-label-large-tracking: 0.006rem;\n";
  css += "  --mat-sys-label-large-weight: var(--mat-sys-medium-font-weight);\n";
  css += "  --mat-sys-label-large-weight-prominent: var(--mat-sys-bold-font-weight);\n";
  css += "\n  /* Label medium typescale */\n";
  css += "  --mat-sys-label-medium: var(--mat-sys-label-medium-weight) var(--mat-sys-label-medium-size) / var(--mat-sys-label-medium-line-height) var(--mat-sys-label-medium-font);\n";
  css += "  --mat-sys-label-medium-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-label-medium-line-height: 1rem;\n";
  css += "  --mat-sys-label-medium-size: 0.75rem;\n";
  css += "  --mat-sys-label-medium-tracking: 0.031rem;\n";
  css += "  --mat-sys-label-medium-weight: var(--mat-sys-medium-font-weight);\n";
  css += "  --mat-sys-label-medium-weight-prominent: var(--mat-sys-bold-font-weight);\n";
  css += "\n  /* Label small typescale */\n";
  css += "  --mat-sys-label-small: var(--mat-sys-label-small-weight) var(--mat-sys-label-small-size) / var(--mat-sys-label-small-line-height) var(--mat-sys-label-small-font);\n";
  css += "  --mat-sys-label-small-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-label-small-line-height: 1rem;\n";
  css += "  --mat-sys-label-small-size: 0.688rem;\n";
  css += "  --mat-sys-label-small-tracking: 0.031rem;\n";
  css += "  --mat-sys-label-small-weight: var(--mat-sys-medium-font-weight);\n";
  css += "\n  /* Title large typescale */\n";
  css += "  --mat-sys-title-large: var(--mat-sys-title-large-weight) var(--mat-sys-title-large-size) / var(--mat-sys-title-large-line-height) var(--mat-sys-title-large-font);\n";
  css += "  --mat-sys-title-large-font: var(--mat-sys-brand-font-family);\n";
  css += "  --mat-sys-title-large-line-height: 1.75rem;\n";
  css += "  --mat-sys-title-large-size: 1.375rem;\n";
  css += "  --mat-sys-title-large-tracking: 0;\n";
  css += "  --mat-sys-title-large-weight: var(--mat-sys-regular-font-weight);\n";
  css += "\n  /* Title medium typescale */\n";
  css += "  --mat-sys-title-medium: var(--mat-sys-title-medium-weight) var(--mat-sys-title-medium-size) / var(--mat-sys-title-medium-line-height) var(--mat-sys-title-medium-font);\n";
  css += "  --mat-sys-title-medium-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-title-medium-line-height: 1.5rem;\n";
  css += "  --mat-sys-title-medium-size: 1rem;\n";
  css += "  --mat-sys-title-medium-tracking: 0.009rem;\n";
  css += "  --mat-sys-title-medium-weight: var(--mat-sys-medium-font-weight);\n";
  css += "\n  /* Title small typescale */\n";
  css += "  --mat-sys-title-small: var(--mat-sys-title-small-weight) var(--mat-sys-title-small-size) / var(--mat-sys-title-small-line-height) var(--mat-sys-title-small-font);\n";
  css += "  --mat-sys-title-small-font: var(--mat-sys-plain-font-family);\n";
  css += "  --mat-sys-title-small-line-height: 1.25rem;\n";
  css += "  --mat-sys-title-small-size: 0.875rem;\n";
  css += "  --mat-sys-title-small-tracking: 0.006rem;\n";
  css += "  --mat-sys-title-small-weight: var(--mat-sys-medium-font-weight);\n";
  return css;
}
function getElevationSysVariablesCSS() {
  let css = "";
  css += "\n  /* Box shadow colors. Only used in the elevation level system variables. */\n";
  css += "  --mat-sys-umbra-color: color-mix(in srgb, var(--mat-sys-shadow), transparent 80%);\n";
  css += "  --mat-sys-penumbra-color: color-mix(in srgb, var(--mat-sys-shadow), transparent 86%);\n";
  css += "  --mat-sys-ambient-color: color-mix(in srgb, var(--mat-sys-shadow), transparent 88%);\n";
  css += "\n  /* Elevation level system variables. These are used as the value for box-shadow CSS property. */\n";
  css += "  --mat-sys-level0: 0px 0px 0px 0px var(--mat-sys-umbra-color), 0px 0px 0px 0px var(--mat-sys-penumbra-color), 0px 0px 0px 0px var(--mat-sys-ambient-color);\n";
  css += "  --mat-sys-level1: 0px 2px 1px -1px var(--mat-sys-umbra-color), 0px 1px 1px 0px var(--mat-sys-penumbra-color), 0px 1px 3px 0px var(--mat-sys-ambient-color);\n";
  css += "  --mat-sys-level2: 0px 3px 3px -2px var(--mat-sys-umbra-color), 0px 3px 4px 0px var(--mat-sys-penumbra-color), 0px 1px 8px 0px var(--mat-sys-ambient-color);\n";
  css += "  --mat-sys-level3: 0px 3px 5px -1px var(--mat-sys-umbra-color), 0px 6px 10px 0px var(--mat-sys-penumbra-color), 0px 1px 18px 0px var(--mat-sys-ambient-color);\n";
  css += "  --mat-sys-level4: 0px 5px 5px -3px var(--mat-sys-umbra-color), 0px 8px 10px 1px var(--mat-sys-penumbra-color), 0px 3px 14px 2px var(--mat-sys-ambient-color);\n";
  css += "  --mat-sys-level5: 0px 7px 8px -4px var(--mat-sys-umbra-color), 0px 12px 17px 2px var(--mat-sys-penumbra-color), 0px 5px 22px 4px var(--mat-sys-ambient-color);\n";
  return css;
}
function getShapeSysVariablesCSS() {
  let css = "";
  css += "  --mat-sys-corner-extra-large: 28px;\n";
  css += "  --mat-sys-corner-extra-large-top: 28px 28px 0 0;\n";
  css += "  --mat-sys-corner-extra-small: 4px;\n";
  css += "  --mat-sys-corner-extra-small-top: 4px 4px 0 0;\n";
  css += "  --mat-sys-corner-full: 9999px;\n";
  css += "  --mat-sys-corner-large: 16px;\n";
  css += "  --mat-sys-corner-large-end: 0 16px 16px 0;\n";
  css += "  --mat-sys-corner-large-start: 16px 0 0 16px;\n";
  css += "  --mat-sys-corner-large-top: 16px 16px 0 0;\n";
  css += "  --mat-sys-corner-medium: 12px;\n";
  css += "  --mat-sys-corner-none: 0;\n";
  css += "  --mat-sys-corner-small: 8px;\n";
  return css;
}
function getStateSysVariablesCSS() {
  let css = "";
  css += "  --mat-sys-dragged-state-layer-opacity: 0.16;\n";
  css += "  --mat-sys-focus-state-layer-opacity: 0.12;\n";
  css += "  --mat-sys-hover-state-layer-opacity: 0.08;\n";
  css += "  --mat-sys-pressed-state-layer-opacity: 0.12;\n";
  return css;
}
function getAllSysVariablesCSS(lightColorScheme, darkColorScheme) {
  let css = "";
  css += "  /* COLOR SYSTEM VARIABLES */\n";
  css += "  color-scheme: light;\n\n";
  css += getColorSysVariablesCSS(lightColorScheme, darkColorScheme);
  css += "\n  /* TYPOGRAPHY SYSTEM VARIABLES */\n";
  css += getTypographySysVariablesCSS();
  css += "\n  /* ELEVATION SYSTEM VARIABLES */\n";
  css += getElevationSysVariablesCSS();
  css += "\n  /* SHAPE SYSTEM VARIABLES */\n";
  css += getShapeSysVariablesCSS();
  css += "\n  /* STATE SYSTEM VARIABLES */\n";
  css += getStateSysVariablesCSS();
  return css;
}
function getHighContrastOverridesCSS(lightColorScheme, darkColorScheme) {
  let css = "\n";
  css += "  @media (prefers-contrast: more) {\n";
  css += getColorSysVariablesCSS(lightColorScheme, darkColorScheme, true);
  css += "  }\n";
  return css;
}
function createThemeFile(content, tree, directory, isScss = true) {
  const fileName = isScss ? "_theme-colors.scss" : "theme.css";
  const filePath = directory ? directory + fileName : fileName;
  tree.create(filePath, content);
}
function getColorComment(primaryColor, secondaryColor, tertiaryColor, neutralColor, neutralVariantColor, errorColor) {
  let colorComment = "Color palettes are generated from primary: " + primaryColor;
  if (secondaryColor) {
    colorComment += ", secondary: " + secondaryColor;
  }
  if (tertiaryColor) {
    colorComment += ", tertiary: " + tertiaryColor;
  }
  if (neutralColor) {
    colorComment += ", neutral: " + neutralColor;
  }
  if (neutralVariantColor) {
    colorComment += ", neutral variant: " + neutralVariantColor;
  }
  if (errorColor) {
    colorComment += ", error: " + errorColor;
  }
  return colorComment;
}
function default_1(options) {
  return (tree, context) => __async(this, null, function* () {
    const colorComment = getColorComment(options.primaryColor, options.secondaryColor, options.tertiaryColor, options.neutralColor, options.neutralVariantColor, options.errorColor);
    const colorPalettes = getColorPalettes(options.primaryColor, options.secondaryColor, options.tertiaryColor, options.neutralColor, options.neutralVariantColor, options.errorColor);
    let lightHighContrastColorScheme;
    let darkHighContrastColorScheme;
    if (options.includeHighContrast) {
      lightHighContrastColorScheme = getMaterialDynamicScheme(
        colorPalettes.primary,
        colorPalettes.secondary,
        colorPalettes.tertiary,
        colorPalettes.neutral,
        colorPalettes.neutralVariant,
        false,
        1
      );
      darkHighContrastColorScheme = getMaterialDynamicScheme(
        colorPalettes.primary,
        colorPalettes.secondary,
        colorPalettes.tertiary,
        colorPalettes.neutral,
        colorPalettes.neutralVariant,
        true,
        1
      );
      if (options.errorColor) {
        lightHighContrastColorScheme.errorPalette = colorPalettes.error;
        darkHighContrastColorScheme.errorPalette = colorPalettes.error;
      }
    }
    if (options.isScss) {
      let themeScss = generateSCSSTheme(colorPalettes, colorComment);
      if (options.includeHighContrast) {
        themeScss += generateHighContrastOverrideMixinsSCSS(lightHighContrastColorScheme, darkHighContrastColorScheme);
      }
      createThemeFile(themeScss, tree, options.directory);
    } else {
      let themeCss = "";
      themeCss += "/* Note: " + colorComment + " */\n";
      themeCss += "html {\n";
      const lightColorScheme = getMaterialDynamicScheme(
        colorPalettes.primary,
        colorPalettes.secondary,
        colorPalettes.tertiary,
        colorPalettes.neutral,
        colorPalettes.neutralVariant,
        false,
        0
      );
      const darkColorScheme = getMaterialDynamicScheme(
        colorPalettes.primary,
        colorPalettes.secondary,
        colorPalettes.tertiary,
        colorPalettes.neutral,
        colorPalettes.neutralVariant,
        true,
        0
      );
      if (options.errorColor) {
        lightColorScheme.errorPalette = colorPalettes.error;
        darkColorScheme.errorPalette = colorPalettes.error;
      }
      themeCss += getAllSysVariablesCSS(lightColorScheme, darkColorScheme);
      if (options.includeHighContrast) {
        themeCss += getHighContrastOverridesCSS(lightHighContrastColorScheme, darkHighContrastColorScheme);
      }
      themeCss += "}\n";
      createThemeFile(themeCss, tree, options.directory, false);
    }
  });
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=index_bundled.js.map
