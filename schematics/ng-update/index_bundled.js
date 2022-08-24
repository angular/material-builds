var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
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

// node_modules/tslib/tslib.js
var require_tslib = __commonJS({
  "node_modules/tslib/tslib.js"(exports, module2) {
    var __extends;
    var __assign;
    var __rest;
    var __decorate;
    var __param;
    var __metadata;
    var __awaiter;
    var __generator;
    var __exportStar;
    var __values;
    var __read;
    var __spread;
    var __spreadArrays;
    var __spreadArray;
    var __await;
    var __asyncGenerator;
    var __asyncDelegator;
    var __asyncValues;
    var __makeTemplateObject;
    var __importStar;
    var __importDefault;
    var __classPrivateFieldGet;
    var __classPrivateFieldSet;
    var __createBinding;
    (function(factory) {
      var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
      if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function(exports2) {
          factory(createExporter(root, createExporter(exports2)));
        });
      } else if (typeof module2 === "object" && typeof module2.exports === "object") {
        factory(createExporter(root, createExporter(module2.exports)));
      } else {
        factory(createExporter(root));
      }
      function createExporter(exports2, previous) {
        if (exports2 !== root) {
          if (typeof Object.create === "function") {
            Object.defineProperty(exports2, "__esModule", { value: true });
          } else {
            exports2.__esModule = true;
          }
        }
        return function(id, v) {
          return exports2[id] = previous ? previous(id, v) : v;
        };
      }
    })(function(exporter) {
      var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
        d.__proto__ = b;
      } || function(d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      __extends = function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      __rest = function(s, e) {
        var t = {};
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
          }
        return t;
      };
      __decorate = function(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      };
      __param = function(paramIndex, decorator) {
        return function(target, key) {
          decorator(target, key, paramIndex);
        };
      };
      __metadata = function(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
          return Reflect.metadata(metadataKey, metadataValue);
      };
      __awaiter = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      __generator = function(thisArg, body) {
        var _ = { label: 0, sent: function() {
          if (t[0] & 1)
            throw t[1];
          return t[1];
        }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
          return this;
        }), g;
        function verb(n) {
          return function(v) {
            return step([n, v]);
          };
        }
        function step(op) {
          if (f)
            throw new TypeError("Generator is already executing.");
          while (_)
            try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                return t;
              if (y = 0, t)
                op = [op[0] & 2, t.value];
              switch (op[0]) {
                case 0:
                case 1:
                  t = op;
                  break;
                case 4:
                  _.label++;
                  return { value: op[1], done: false };
                case 5:
                  _.label++;
                  y = op[1];
                  op = [0];
                  continue;
                case 7:
                  op = _.ops.pop();
                  _.trys.pop();
                  continue;
                default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                    _ = 0;
                    continue;
                  }
                  if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                    _.label = op[1];
                    break;
                  }
                  if (op[0] === 6 && _.label < t[1]) {
                    _.label = t[1];
                    t = op;
                    break;
                  }
                  if (t && _.label < t[2]) {
                    _.label = t[2];
                    _.ops.push(op);
                    break;
                  }
                  if (t[2])
                    _.ops.pop();
                  _.trys.pop();
                  continue;
              }
              op = body.call(thisArg, _);
            } catch (e) {
              op = [6, e];
              y = 0;
            } finally {
              f = t = 0;
            }
          if (op[0] & 5)
            throw op[1];
          return { value: op[0] ? op[1] : void 0, done: true };
        }
      };
      __exportStar = function(m, o) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
            __createBinding(o, m, p);
      };
      __createBinding = Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      };
      __values = function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
          return m.call(o);
        if (o && typeof o.length === "number")
          return {
            next: function() {
              if (o && i >= o.length)
                o = void 0;
              return { value: o && o[i++], done: !o };
            }
          };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
      };
      __read = function(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
          return o;
        var i = m.call(o), r, ar = [], e;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
            ar.push(r.value);
        } catch (error) {
          e = { error };
        } finally {
          try {
            if (r && !r.done && (m = i["return"]))
              m.call(i);
          } finally {
            if (e)
              throw e.error;
          }
        }
        return ar;
      };
      __spread = function() {
        for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read(arguments[i]));
        return ar;
      };
      __spreadArrays = function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
          s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      __spreadArray = function(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      __await = function(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
      };
      __asyncGenerator = function(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i;
        function verb(n) {
          if (g[n])
            i[n] = function(v) {
              return new Promise(function(a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
              });
            };
        }
        function resume(n, v) {
          try {
            step(g[n](v));
          } catch (e) {
            settle(q[0][3], e);
          }
        }
        function step(r) {
          r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
          resume("next", value);
        }
        function reject(value) {
          resume("throw", value);
        }
        function settle(f, v) {
          if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]);
        }
      };
      __asyncDelegator = function(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function(e) {
          throw e;
        }), verb("return"), i[Symbol.iterator] = function() {
          return this;
        }, i;
        function verb(n, f) {
          i[n] = o[n] ? function(v) {
            return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v;
          } : f;
        }
      };
      __asyncValues = function(o) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
          return this;
        }, i);
        function verb(n) {
          i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
              v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
          };
        }
        function settle(resolve, reject, d, v) {
          Promise.resolve(v).then(function(v2) {
            resolve({ value: v2, done: d });
          }, reject);
        }
      };
      __makeTemplateObject = function(cooked, raw) {
        if (Object.defineProperty) {
          Object.defineProperty(cooked, "raw", { value: raw });
        } else {
          cooked.raw = raw;
        }
        return cooked;
      };
      var __setModuleDefault = Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      };
      __importStar = function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      __importDefault = function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      __classPrivateFieldGet = function(receiver, state, kind, f) {
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
      };
      __classPrivateFieldSet = function(receiver, state, value, kind, f) {
        if (kind === "m")
          throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
          throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
          throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
      };
      exporter("__extends", __extends);
      exporter("__assign", __assign);
      exporter("__rest", __rest);
      exporter("__decorate", __decorate);
      exporter("__param", __param);
      exporter("__metadata", __metadata);
      exporter("__awaiter", __awaiter);
      exporter("__generator", __generator);
      exporter("__exportStar", __exportStar);
      exporter("__createBinding", __createBinding);
      exporter("__values", __values);
      exporter("__read", __read);
      exporter("__spread", __spread);
      exporter("__spreadArrays", __spreadArrays);
      exporter("__spreadArray", __spreadArray);
      exporter("__await", __await);
      exporter("__asyncGenerator", __asyncGenerator);
      exporter("__asyncDelegator", __asyncDelegator);
      exporter("__asyncValues", __asyncValues);
      exporter("__makeTemplateObject", __makeTemplateObject);
      exporter("__importStar", __importStar);
      exporter("__importDefault", __importDefault);
      exporter("__classPrivateFieldGet", __classPrivateFieldGet);
      exporter("__classPrivateFieldSet", __classPrivateFieldSet);
    });
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/find-hammer-script-tags.js
var require_find_hammer_script_tags = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/find-hammer-script-tags.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findHammerScriptImportElements = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    function findHammerScriptImportElements(htmlContent) {
      const document = schematics_1.parse5.parse(htmlContent, { sourceCodeLocationInfo: true });
      const nodeQueue = [...document.childNodes];
      const result = [];
      while (nodeQueue.length) {
        const node = nodeQueue.shift();
        if (node.childNodes) {
          nodeQueue.push(...node.childNodes);
        }
        if (node.nodeName.toLowerCase() === "script" && node.attrs.length !== 0) {
          const srcAttribute = node.attrs.find((a) => a.name === "src");
          if (srcAttribute && isPotentialHammerScriptReference(srcAttribute.value)) {
            result.push(node);
          }
        }
      }
      return result;
    }
    exports.findHammerScriptImportElements = findHammerScriptImportElements;
    function isPotentialHammerScriptReference(srcPath) {
      return /\/hammer(\.min)?\.js($|\?)/.test(srcPath);
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/find-main-module.js
var require_find_main_module = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/find-main-module.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.findMainModuleExpression = void 0;
    var tslib_1 = require_tslib();
    var ts = tslib_1.__importStar(require("typescript"));
    function findMainModuleExpression(mainSourceFile) {
      let foundModule = null;
      const visitNode = (node) => {
        if (ts.isCallExpression(node) && node.arguments.length && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.name) && node.expression.name.text === "bootstrapModule") {
          foundModule = node.arguments[0];
        } else {
          ts.forEachChild(node, visitNode);
        }
      };
      ts.forEachChild(mainSourceFile, visitNode);
      return foundModule;
    }
    exports.findMainModuleExpression = findMainModuleExpression;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/gesture-config-template.js
var require_gesture_config_template = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/gesture-config-template.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.gestureConfigTemplate = void 0;
    exports.gestureConfigTemplate = `
/**
 * Custom HammerJS configuration forked from Angular Material. With Angular v9,
 * Angular Material dropped HammerJS as a dependency. This configuration was added
 * automatically to this application because ng-update detected that this application
 * directly used custom HammerJS gestures defined by Angular Material.
 *
 * Read more in the dedicated guide: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md?
 */

import {Injectable, Inject, Optional, Type} from '@angular/core';
import {HammerGestureConfig} from '@angular/platform-browser';
import {MAT_HAMMER_OPTIONS} from '@angular/material/core';

/**
 * Noop hammer instance that is used when an instance is requested, but
 * Hammer has not been loaded on the page yet.
 */
const noopHammerInstance = {
  on: () => {},
  off: () => {},
};

/**
 * Gesture config that provides custom Hammer gestures on top of the default Hammer
 * gestures. These gestures will be available as events in component templates.
 */
@Injectable()
export class GestureConfig extends HammerGestureConfig {
  /** List of event names to add to the Hammer gesture plugin list */
  events = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
  ];

  constructor(@Optional() @Inject(MAT_HAMMER_OPTIONS) private hammerOptions?: any) {
    super();
  }

  /**
   * Builds Hammer instance manually to add custom recognizers that match the
   * Material Design specification. Gesture names originate from the Material Design
   * gestures: https://material.io/design/#gestures-touch-mechanics
   *
   * More information on default recognizers can be found in the Hammer docs:
   *   http://hammerjs.github.io/recognizer-pan/
   *   http://hammerjs.github.io/recognizer-press/
   * @param element Element to which to assign the new HammerJS gestures.
   * @returns Newly-created HammerJS instance.
   */
  buildHammer(element: HTMLElement): any {
    const hammer: any = typeof window !== 'undefined' ? (window as any).Hammer : null;

    if (!hammer) {
      return noopHammerInstance;
    }

    const mc = new hammer(element, this.hammerOptions || undefined);

    // Default Hammer Recognizers.
    const pan = new hammer.Pan();
    const swipe = new hammer.Swipe();
    const press = new hammer.Press();

    // Notice that a HammerJS recognizer can only depend on one other recognizer once.
    // Otherwise the previous \`recognizeWith\` will be dropped.
    const slide = this._createRecognizer(pan, {event: 'slide', threshold: 0}, swipe);
    const longpress = this._createRecognizer(press, {event: 'longpress', time: 500});

    // Overwrite the default \`pan\` event to use the swipe event.
    pan.recognizeWith(swipe);

    // Since the slide event threshold is set to zero, the slide recognizer can fire and
    // accidentally reset the longpress recognizer. In order to make sure that the two
    // recognizers can run simultaneously but don't affect each other, we allow the slide
    // recognizer to recognize while a longpress is being processed.
    // See: https://github.com/hammerjs/hammer.js/blob/master/src/manager.js#L123-L124
    longpress.recognizeWith(slide);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, slide, longpress]);

    return mc;
  }

  /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
  private _createRecognizer(base: object, options: any, ...inheritances: object[]) {
    const recognizer = new (base.constructor as Type<any>)(options);
    inheritances.push(base);
    inheritances.forEach(item => recognizer.recognizeWith(item));
    return recognizer;
  }
}
`;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-template-check.js
var require_hammer_template_check = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-template-check.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isHammerJsUsedInTemplate = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    var STANDARD_HAMMERJS_EVENTS = [
      "pan",
      "panstart",
      "panmove",
      "panend",
      "pancancel",
      "panleft",
      "panright",
      "panup",
      "pandown",
      "pinch",
      "pinchstart",
      "pinchmove",
      "pinchend",
      "pinchcancel",
      "pinchin",
      "pinchout",
      "press",
      "pressup",
      "rotate",
      "rotatestart",
      "rotatemove",
      "rotateend",
      "rotatecancel",
      "swipe",
      "swipeleft",
      "swiperight",
      "swipeup",
      "swipedown",
      "tap"
    ];
    var CUSTOM_MATERIAL_HAMMERJS_EVENS = [
      "longpress",
      "slide",
      "slidestart",
      "slideend",
      "slideright",
      "slideleft"
    ];
    function isHammerJsUsedInTemplate(html) {
      const document = schematics_1.parse5.parseFragment(html, { sourceCodeLocationInfo: true });
      let customEvents = false;
      let standardEvents = false;
      const visitNodes = (nodes) => {
        nodes.forEach((node) => {
          if (!isElement(node)) {
            return;
          }
          for (let attr of node.attrs) {
            if (!customEvents && CUSTOM_MATERIAL_HAMMERJS_EVENS.some((e) => `(${e})` === attr.name)) {
              customEvents = true;
            }
            if (!standardEvents && STANDARD_HAMMERJS_EVENTS.some((e) => `(${e})` === attr.name)) {
              standardEvents = true;
            }
          }
          if (!customEvents || !standardEvents) {
            visitNodes(node.childNodes);
          }
        });
      };
      visitNodes(document.childNodes);
      return { customEvents, standardEvents };
    }
    exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
    function isElement(node) {
      return !!node.attrs;
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/import-manager.js
var require_import_manager = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/import-manager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportManager = void 0;
    var tslib_1 = require_tslib();
    var path_1 = require("path");
    var ts = tslib_1.__importStar(require("typescript"));
    var hasFlag = (data, flag) => (data.state & flag) !== 0;
    var ImportManager = class {
      constructor(_fileSystem, _printer) {
        this._fileSystem = _fileSystem;
        this._printer = _printer;
        this._usedIdentifierNames = /* @__PURE__ */ new Map();
        this._importCache = /* @__PURE__ */ new Map();
      }
      _analyzeImportsIfNeeded(sourceFile) {
        if (this._importCache.has(sourceFile)) {
          return this._importCache.get(sourceFile);
        }
        const result = [];
        for (let node of sourceFile.statements) {
          if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
            continue;
          }
          const moduleName = node.moduleSpecifier.text;
          if (!node.importClause) {
            result.push({ moduleName, node, state: 0 });
            continue;
          }
          if (!node.importClause.namedBindings) {
            result.push({
              moduleName,
              node,
              name: node.importClause.name,
              state: 0
            });
            continue;
          }
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            result.push({
              moduleName,
              node,
              specifiers: node.importClause.namedBindings.elements.map((el) => ({
                name: el.name,
                propertyName: el.propertyName
              })),
              state: 0
            });
          } else {
            result.push({
              moduleName,
              node,
              name: node.importClause.namedBindings.name,
              namespace: true,
              state: 0
            });
          }
        }
        this._importCache.set(sourceFile, result);
        return result;
      }
      _isModuleSpecifierMatching(basePath, specifier, moduleName) {
        return specifier.startsWith(".") ? (0, path_1.resolve)(basePath, specifier) === (0, path_1.resolve)(basePath, moduleName) : specifier === moduleName;
      }
      deleteNamedBindingImport(sourceFile, symbolName, moduleName) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        for (let importData of fileImports) {
          if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName) || !importData.specifiers) {
            continue;
          }
          const specifierIndex = importData.specifiers.findIndex((d) => (d.propertyName || d.name).text === symbolName);
          if (specifierIndex !== -1) {
            importData.specifiers.splice(specifierIndex, 1);
            if (importData.specifiers.length === 0) {
              importData.state |= 8;
            } else {
              importData.state |= 2;
            }
          }
        }
      }
      deleteImportByDeclaration(declaration) {
        const fileImports = this._analyzeImportsIfNeeded(declaration.getSourceFile());
        for (let importData of fileImports) {
          if (importData.node === declaration) {
            importData.state |= 8;
          }
        }
      }
      addImportToSourceFile(sourceFile, symbolName, moduleName, typeImport = false, ignoreIdentifierCollisions = []) {
        const sourceDir = (0, path_1.dirname)(sourceFile.fileName);
        const fileImports = this._analyzeImportsIfNeeded(sourceFile);
        let existingImport = null;
        for (let importData of fileImports) {
          if (!this._isModuleSpecifierMatching(sourceDir, importData.moduleName, moduleName)) {
            continue;
          }
          if (!symbolName && !importData.namespace && !importData.specifiers) {
            return ts.factory.createIdentifier(importData.name.text);
          }
          if (importData.namespace && !typeImport) {
            return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(importData.name.text), ts.factory.createIdentifier(symbolName || "default"));
          } else if (importData.specifiers && symbolName) {
            const existingSpecifier = importData.specifiers.find((s) => s.propertyName ? s.propertyName.text === symbolName : s.name.text === symbolName);
            if (existingSpecifier) {
              return ts.factory.createIdentifier(existingSpecifier.name.text);
            }
            existingImport = importData;
          }
        }
        if (existingImport) {
          const propertyIdentifier = ts.factory.createIdentifier(symbolName);
          const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
          const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
          const importName = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
          existingImport.specifiers.push({
            name: importName,
            propertyName: needsGeneratedUniqueName ? propertyIdentifier : void 0
          });
          existingImport.state |= 2;
          if (hasFlag(existingImport, 8)) {
            existingImport.state &= ~8;
          }
          return importName;
        }
        let identifier = null;
        let newImport = null;
        if (symbolName) {
          const propertyIdentifier = ts.factory.createIdentifier(symbolName);
          const generatedUniqueIdentifier = this._getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions);
          const needsGeneratedUniqueName = generatedUniqueIdentifier.text !== symbolName;
          identifier = needsGeneratedUniqueName ? generatedUniqueIdentifier : propertyIdentifier;
          const newImportDecl = ts.factory.createImportDeclaration(void 0, void 0, ts.factory.createImportClause(false, void 0, ts.factory.createNamedImports([])), ts.factory.createStringLiteral(moduleName));
          newImport = {
            moduleName,
            node: newImportDecl,
            specifiers: [
              {
                propertyName: needsGeneratedUniqueName ? propertyIdentifier : void 0,
                name: identifier
              }
            ],
            state: 4
          };
        } else {
          identifier = this._getUniqueIdentifier(sourceFile, "defaultExport", ignoreIdentifierCollisions);
          const newImportDecl = ts.factory.createImportDeclaration(void 0, void 0, ts.factory.createImportClause(false, identifier, void 0), ts.factory.createStringLiteral(moduleName));
          newImport = {
            moduleName,
            node: newImportDecl,
            name: identifier,
            state: 4
          };
        }
        fileImports.push(newImport);
        return identifier;
      }
      recordChanges() {
        this._importCache.forEach((fileImports, sourceFile) => {
          const recorder = this._fileSystem.edit(this._fileSystem.resolve(sourceFile.fileName));
          const lastUnmodifiedImport = fileImports.reverse().find((i) => i.state === 0);
          const importStartIndex = lastUnmodifiedImport ? this._getEndPositionOfNode(lastUnmodifiedImport.node) : 0;
          fileImports.forEach((importData) => {
            if (importData.state === 0) {
              return;
            }
            if (hasFlag(importData, 8)) {
              if (!hasFlag(importData, 4)) {
                recorder.remove(importData.node.getFullStart(), importData.node.getFullWidth());
              }
              return;
            }
            if (importData.specifiers) {
              const namedBindings = importData.node.importClause.namedBindings;
              const importSpecifiers = importData.specifiers.map((s) => ts.factory.createImportSpecifier(false, s.propertyName, s.name));
              const updatedBindings = ts.factory.updateNamedImports(namedBindings, importSpecifiers);
              if (hasFlag(importData, 4)) {
                const updatedImport = ts.factory.updateImportDeclaration(importData.node, void 0, void 0, ts.factory.createImportClause(false, void 0, updatedBindings), ts.factory.createStringLiteral(importData.moduleName), void 0);
                const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, updatedImport, sourceFile);
                recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}
` : `
${newImportText}`);
                return;
              } else if (hasFlag(importData, 2)) {
                const newNamedBindingsText = this._printer.printNode(ts.EmitHint.Unspecified, updatedBindings, sourceFile);
                recorder.remove(namedBindings.getStart(), namedBindings.getWidth());
                recorder.insertRight(namedBindings.getStart(), newNamedBindingsText);
                return;
              }
            } else if (hasFlag(importData, 4)) {
              const newImportText = this._printer.printNode(ts.EmitHint.Unspecified, importData.node, sourceFile);
              recorder.insertLeft(importStartIndex, importStartIndex === 0 ? `${newImportText}
` : `
${newImportText}`);
              return;
            }
            throw Error("Unexpected import modification.");
          });
        });
      }
      correctNodePosition(node, offset, position) {
        const sourceFile = node.getSourceFile();
        if (!this._importCache.has(sourceFile)) {
          return position;
        }
        const newPosition = __spreadValues({}, position);
        const fileImports = this._importCache.get(sourceFile);
        for (let importData of fileImports) {
          const fullEnd = importData.node.getFullStart() + importData.node.getFullWidth();
          if (offset > fullEnd && hasFlag(importData, 8)) {
            newPosition.line--;
          } else if (offset > fullEnd && hasFlag(importData, 4)) {
            newPosition.line++;
          }
        }
        return newPosition;
      }
      _getUniqueIdentifier(sourceFile, symbolName, ignoreIdentifierCollisions) {
        if (this._isUniqueIdentifierName(sourceFile, symbolName, ignoreIdentifierCollisions)) {
          this._recordUsedIdentifier(sourceFile, symbolName);
          return ts.factory.createIdentifier(symbolName);
        }
        let name = null;
        let counter = 1;
        do {
          name = `${symbolName}_${counter++}`;
        } while (!this._isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions));
        this._recordUsedIdentifier(sourceFile, name);
        return ts.factory.createIdentifier(name);
      }
      _isUniqueIdentifierName(sourceFile, name, ignoreIdentifierCollisions) {
        if (this._usedIdentifierNames.has(sourceFile) && this._usedIdentifierNames.get(sourceFile).indexOf(name) !== -1) {
          return false;
        }
        const nodeQueue = [sourceFile];
        while (nodeQueue.length) {
          const node = nodeQueue.shift();
          if (ts.isIdentifier(node) && node.text === name && !ignoreIdentifierCollisions.includes(node)) {
            return false;
          }
          nodeQueue.push(...node.getChildren());
        }
        return true;
      }
      _recordUsedIdentifier(sourceFile, identifierName) {
        this._usedIdentifierNames.set(sourceFile, (this._usedIdentifierNames.get(sourceFile) || []).concat(identifierName));
      }
      _getEndPositionOfNode(node) {
        const nodeEndPos = node.getEnd();
        const commentRanges = ts.getTrailingCommentRanges(node.getSourceFile().text, nodeEndPos);
        if (!commentRanges || !commentRanges.length) {
          return nodeEndPos;
        }
        return commentRanges[commentRanges.length - 1].end;
      }
    };
    exports.ImportManager = ImportManager;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-array-element.js
var require_remove_array_element = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-array-element.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeElementFromArrayExpression = exports.getParentSyntaxList = void 0;
    var tslib_1 = require_tslib();
    var ts = tslib_1.__importStar(require("typescript"));
    function getParentSyntaxList(node) {
      if (!node.parent) {
        return null;
      }
      const parent = node.parent;
      const { pos, end } = node;
      for (const child of parent.getChildren()) {
        if (child.pos > end || child === node) {
          return null;
        }
        if (child.kind === ts.SyntaxKind.SyntaxList && child.pos <= pos && child.end >= end) {
          return child;
        }
      }
      return null;
    }
    exports.getParentSyntaxList = getParentSyntaxList;
    function findTrailingCommaToken(list, element) {
      let foundElement = false;
      for (let child of list.getChildren()) {
        if (!foundElement && child === element) {
          foundElement = true;
        } else if (foundElement) {
          if (child.kind === ts.SyntaxKind.CommaToken) {
            return child;
          }
          break;
        }
      }
      return null;
    }
    function removeElementFromArrayExpression(element, recorder) {
      recorder.remove(element.getFullStart(), element.getFullWidth());
      const syntaxList = getParentSyntaxList(element);
      if (!syntaxList) {
        return;
      }
      const trailingComma = findTrailingCommaToken(syntaxList, element);
      if (trailingComma !== null) {
        recorder.remove(trailingComma.getFullStart(), trailingComma.getFullWidth());
      }
    }
    exports.removeElementFromArrayExpression = removeElementFromArrayExpression;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-element-from-html.js
var require_remove_element_from_html = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-element-from-html.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.removeElementFromHtml = void 0;
    function removeElementFromHtml(element, recorder) {
      const { startOffset, endOffset } = element.sourceCodeLocation;
      const parentIndex = element.parentNode.childNodes.indexOf(element);
      const precedingTextSibling = element.parentNode.childNodes.find((f, i) => f.nodeName === "#text" && i === parentIndex - 1);
      recorder.remove(startOffset, endOffset - startOffset);
      if (precedingTextSibling && /^\s+$/.test(precedingTextSibling.value)) {
        const textSiblingLocation = precedingTextSibling.sourceCodeLocation;
        recorder.remove(textSiblingLocation.startOffset, textSiblingLocation.endOffset - textSiblingLocation.startOffset);
      }
    }
    exports.removeElementFromHtml = removeElementFromHtml;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-gestures-migration.js
var require_hammer_gestures_migration = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/hammer-gestures-v9/hammer-gestures-migration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HammerGesturesMigration = void 0;
    var tslib_1 = require_tslib();
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular/cdk/schematics");
    var change_1 = require("@schematics/angular/utility/change");
    var ts = tslib_1.__importStar(require("typescript"));
    var find_hammer_script_tags_1 = require_find_hammer_script_tags();
    var find_main_module_1 = require_find_main_module();
    var gesture_config_template_1 = require_gesture_config_template();
    var hammer_template_check_1 = require_hammer_template_check();
    var import_manager_1 = require_import_manager();
    var remove_array_element_1 = require_remove_array_element();
    var remove_element_from_html_1 = require_remove_element_from_html();
    var GESTURE_CONFIG_CLASS_NAME = "GestureConfig";
    var GESTURE_CONFIG_FILE_NAME = "gesture-config";
    var HAMMER_CONFIG_TOKEN_NAME = "HAMMER_GESTURE_CONFIG";
    var HAMMER_CONFIG_TOKEN_MODULE = "@angular/platform-browser";
    var HAMMER_MODULE_NAME = "HammerModule";
    var HAMMER_MODULE_IMPORT = "@angular/platform-browser";
    var HAMMER_MODULE_SPECIFIER = "hammerjs";
    var CANNOT_REMOVE_REFERENCE_ERROR = `Cannot remove reference to "GestureConfig". Please remove manually.`;
    var HammerGesturesMigration2 = class extends schematics_1.DevkitMigration {
      constructor() {
        super(...arguments);
        this.enabled = HammerGesturesMigration2._isAllowedVersion(this.targetVersion) && !this.context.isTestTarget;
        this._printer = ts.createPrinter();
        this._importManager = new import_manager_1.ImportManager(this.fileSystem, this._printer);
        this._nodeFailures = [];
        this._customEventsUsedInTemplate = false;
        this._standardEventsUsedInTemplate = false;
        this._usedInRuntime = false;
        this._installImports = [];
        this._gestureConfigReferences = [];
        this._hammerConfigTokenReferences = [];
        this._hammerModuleReferences = [];
        this._deletedIdentifiers = [];
      }
      visitTemplate(template) {
        if (!this._customEventsUsedInTemplate || !this._standardEventsUsedInTemplate) {
          const { standardEvents, customEvents } = (0, hammer_template_check_1.isHammerJsUsedInTemplate)(template.content);
          this._customEventsUsedInTemplate = this._customEventsUsedInTemplate || customEvents;
          this._standardEventsUsedInTemplate = this._standardEventsUsedInTemplate || standardEvents;
        }
      }
      visitNode(node) {
        this._checkHammerImports(node);
        this._checkForRuntimeHammerUsage(node);
        this._checkForMaterialGestureConfig(node);
        this._checkForHammerGestureConfigToken(node);
        this._checkForHammerModuleReference(node);
      }
      postAnalysis() {
        const hasCustomGestureConfigSetup = this._hammerConfigTokenReferences.some((r) => this._checkForCustomGestureConfigSetup(r));
        const usedInTemplate = this._standardEventsUsedInTemplate || this._customEventsUsedInTemplate;
        if (hasCustomGestureConfigSetup) {
          HammerGesturesMigration2.globalUsesHammer = true;
          if (!usedInTemplate && this._gestureConfigReferences.length) {
            this._removeMaterialGestureConfigSetup();
            this.printInfo("The HammerJS v9 migration for Angular Components detected that HammerJS is manually set up in combination with references to the Angular Material gesture config. This target cannot be migrated completely, but all references to the deprecated Angular Material gesture have been removed. Read more here: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do");
          } else if (usedInTemplate && this._gestureConfigReferences.length) {
            this.printInfo("The HammerJS v9 migration for Angular Components detected that HammerJS is manually set up in combination with references to the Angular Material gesture config. This target cannot be migrated completely. Please manually remove references to the deprecated Angular Material gesture config. Read more here: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do");
          }
        } else if (this._usedInRuntime || usedInTemplate) {
          HammerGesturesMigration2.globalUsesHammer = true;
          if (!usedInTemplate) {
            this._removeMaterialGestureConfigSetup();
            this._removeHammerModuleReferences();
          } else if (this._standardEventsUsedInTemplate && !this._customEventsUsedInTemplate) {
            this._setupHammerWithStandardEvents();
          } else {
            this._setupHammerWithCustomEvents();
          }
        } else {
          this._removeHammerSetup();
        }
        this._importManager.recordChanges();
        this.failures.push(...this._createMigrationFailures());
        if (!hasCustomGestureConfigSetup && !this._usedInRuntime && usedInTemplate) {
          this.printInfo("The HammerJS v9 migration for Angular Components migrated the project to keep HammerJS installed, but detected ambiguous usage of HammerJS. Please manually check if you can remove HammerJS from your application. More details: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#the-migration-reported-ambiguous-usage-what-should-i-do");
        }
      }
      _setupHammerWithCustomEvents() {
        const project = this.context.project;
        const sourceRoot = this.fileSystem.resolve(project.sourceRoot || project.root);
        const newConfigPath = (0, core_1.join)(sourceRoot, this._getAvailableGestureConfigFileName(sourceRoot));
        this.fileSystem.create(newConfigPath, gesture_config_template_1.gestureConfigTemplate);
        this._gestureConfigReferences.forEach((i) => {
          const filePath = this.fileSystem.resolve(i.node.getSourceFile().fileName);
          return this._replaceGestureConfigReference(i, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(newConfigPath, filePath));
        });
        this._setupNewGestureConfigInRootModule(newConfigPath);
        this._setupHammerModuleInRootModule();
      }
      _setupHammerWithStandardEvents() {
        this._setupHammerModuleInRootModule();
        this._removeMaterialGestureConfigSetup();
      }
      _removeHammerSetup() {
        this._installImports.forEach((i) => this._importManager.deleteImportByDeclaration(i));
        this._removeMaterialGestureConfigSetup();
        this._removeHammerModuleReferences();
        this._removeHammerFromIndexFile();
      }
      _removeMaterialGestureConfigSetup() {
        this._gestureConfigReferences.forEach((r) => this._removeGestureConfigReference(r));
        this._hammerConfigTokenReferences.forEach((r) => {
          if (r.isImport) {
            this._removeHammerConfigTokenImportIfUnused(r);
          }
        });
      }
      _removeHammerModuleReferences() {
        this._hammerModuleReferences.forEach(({ node, isImport, importData }) => {
          const sourceFile = node.getSourceFile();
          const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
          if (!isNamespacedIdentifierAccess(node)) {
            this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_MODULE_NAME, importData.moduleName);
          }
          if (isImport) {
            return;
          }
          if (ts.isArrayLiteralExpression(node.parent)) {
            (0, remove_array_element_1.removeElementFromArrayExpression)(node, recorder);
          } else {
            recorder.remove(node.getStart(), node.getWidth());
            recorder.insertRight(node.getStart(), `/* TODO: remove */ {}`);
            this._nodeFailures.push({
              node,
              message: 'Unable to delete reference to "HammerModule".'
            });
          }
        });
      }
      _checkForHammerGestureConfigToken(node) {
        if (ts.isIdentifier(node)) {
          const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
          if (importData && importData.symbolName === HAMMER_CONFIG_TOKEN_NAME && importData.moduleName === HAMMER_CONFIG_TOKEN_MODULE) {
            this._hammerConfigTokenReferences.push({
              node,
              importData,
              isImport: ts.isImportSpecifier(node.parent)
            });
          }
        }
      }
      _checkForHammerModuleReference(node) {
        if (ts.isIdentifier(node)) {
          const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
          if (importData && importData.symbolName === HAMMER_MODULE_NAME && importData.moduleName === HAMMER_MODULE_IMPORT) {
            this._hammerModuleReferences.push({
              node,
              importData,
              isImport: ts.isImportSpecifier(node.parent)
            });
          }
        }
      }
      _checkHammerImports(node) {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text === HAMMER_MODULE_SPECIFIER) {
          if (node.importClause && !(node.importClause.namedBindings && ts.isNamedImports(node.importClause.namedBindings) && node.importClause.namedBindings.elements.length === 0)) {
            this._usedInRuntime = true;
          } else {
            this._installImports.push(node);
          }
        }
      }
      _checkForRuntimeHammerUsage(node) {
        if (this._usedInRuntime) {
          return;
        }
        if (ts.isPropertyAccessExpression(node) && node.name.text === "Hammer") {
          const originExpr = unwrapExpression(node.expression);
          if (ts.isIdentifier(originExpr) && originExpr.text === "window") {
            this._usedInRuntime = true;
          }
          return;
        }
        if (ts.isElementAccessExpression(node) && ts.isStringLiteral(node.argumentExpression) && node.argumentExpression.text === "Hammer") {
          const originExpr = unwrapExpression(node.expression);
          if (ts.isIdentifier(originExpr) && originExpr.text === "window") {
            this._usedInRuntime = true;
          }
          return;
        }
        if (ts.isIdentifier(node) && node.text === "Hammer" && !ts.isPropertyAccessExpression(node.parent) && !ts.isElementAccessExpression(node.parent)) {
          const symbol = this._getDeclarationSymbolOfNode(node);
          if (symbol && symbol.valueDeclaration && symbol.valueDeclaration.getSourceFile().fileName.includes("@types/hammerjs")) {
            this._usedInRuntime = true;
          }
        }
      }
      _checkForMaterialGestureConfig(node) {
        if (ts.isIdentifier(node)) {
          const importData = (0, schematics_1.getImportOfIdentifier)(node, this.typeChecker);
          if (importData && importData.symbolName === GESTURE_CONFIG_CLASS_NAME && importData.moduleName.startsWith("@angular/material/")) {
            this._gestureConfigReferences.push({
              node,
              importData,
              isImport: ts.isImportSpecifier(node.parent)
            });
          }
        }
      }
      _checkForCustomGestureConfigSetup(tokenRef) {
        let propertyAssignment = tokenRef.node;
        while (propertyAssignment && !ts.isPropertyAssignment(propertyAssignment)) {
          propertyAssignment = propertyAssignment.parent;
        }
        if (!propertyAssignment || !ts.isPropertyAssignment(propertyAssignment) || getPropertyNameText(propertyAssignment.name) !== "provide") {
          return false;
        }
        const objectLiteralExpr = propertyAssignment.parent;
        const matchingIdentifiers = findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier);
        return !this._gestureConfigReferences.some((r) => matchingIdentifiers.includes(r.node));
      }
      _getAvailableGestureConfigFileName(sourceRoot) {
        if (!this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${GESTURE_CONFIG_FILE_NAME}.ts`))) {
          return `${GESTURE_CONFIG_FILE_NAME}.ts`;
        }
        let possibleName = `${GESTURE_CONFIG_FILE_NAME}-`;
        let index = 1;
        while (this.fileSystem.fileExists((0, core_1.join)(sourceRoot, `${possibleName}-${index}.ts`))) {
          index++;
        }
        return `${possibleName + index}.ts`;
      }
      _replaceGestureConfigReference({ node, importData, isImport }, symbolName, moduleSpecifier) {
        const sourceFile = node.getSourceFile();
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const gestureIdentifiersInFile = this._getGestureConfigIdentifiersOfFile(sourceFile);
        if (isNamespacedIdentifierAccess(node)) {
          const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
          recorder.remove(node.parent.getStart(), node.parent.getWidth());
          recorder.insertRight(node.parent.getStart(), this._printNode(newExpression, sourceFile));
          return;
        }
        this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
        if (!isImport) {
          const newExpression = this._importManager.addImportToSourceFile(sourceFile, symbolName, moduleSpecifier, false, gestureIdentifiersInFile);
          recorder.remove(node.getStart(), node.getWidth());
          recorder.insertRight(node.getStart(), this._printNode(newExpression, sourceFile));
        }
      }
      _removeGestureConfigReference({ node, importData, isImport }) {
        const sourceFile = node.getSourceFile();
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        if (!isNamespacedIdentifierAccess(node)) {
          this._importManager.deleteNamedBindingImport(sourceFile, GESTURE_CONFIG_CLASS_NAME, importData.moduleName);
        }
        if (isImport) {
          return;
        }
        const providerAssignment = node.parent;
        if (!ts.isPropertyAssignment(providerAssignment) || getPropertyNameText(providerAssignment.name) !== "useClass") {
          this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
          return;
        }
        const objectLiteralExpr = providerAssignment.parent;
        const provideToken = objectLiteralExpr.properties.find((p) => ts.isPropertyAssignment(p) && getPropertyNameText(p.name) === "provide");
        if (!provideToken || !this._isReferenceToHammerConfigToken(provideToken.initializer)) {
          this._nodeFailures.push({ node, message: CANNOT_REMOVE_REFERENCE_ERROR });
          return;
        }
        this._deletedIdentifiers.push(...findMatchingChildNodes(objectLiteralExpr, ts.isIdentifier));
        if (!ts.isArrayLiteralExpression(objectLiteralExpr.parent)) {
          recorder.remove(objectLiteralExpr.getStart(), objectLiteralExpr.getWidth());
          recorder.insertRight(objectLiteralExpr.getStart(), `/* TODO: remove */ {}`);
          this._nodeFailures.push({
            node: objectLiteralExpr,
            message: `Unable to delete provider definition for "GestureConfig" completely. Please clean up the provider.`
          });
          return;
        }
        (0, remove_array_element_1.removeElementFromArrayExpression)(objectLiteralExpr, recorder);
      }
      _removeHammerConfigTokenImportIfUnused({ node, importData }) {
        const sourceFile = node.getSourceFile();
        const isTokenUsed = this._hammerConfigTokenReferences.some((r) => !r.isImport && !isNamespacedIdentifierAccess(r.node) && r.node.getSourceFile() === sourceFile && !this._deletedIdentifiers.includes(r.node));
        if (!isTokenUsed) {
          this._importManager.deleteNamedBindingImport(sourceFile, HAMMER_CONFIG_TOKEN_NAME, importData.moduleName);
        }
      }
      _removeHammerFromIndexFile() {
        const indexFilePaths = (0, schematics_1.getProjectIndexFiles)(this.context.project);
        indexFilePaths.forEach((filePath) => {
          if (!this.fileSystem.fileExists(filePath)) {
            return;
          }
          const htmlContent = this.fileSystem.read(filePath);
          const recorder = this.fileSystem.edit(filePath);
          (0, find_hammer_script_tags_1.findHammerScriptImportElements)(htmlContent).forEach((el) => (0, remove_element_from_html_1.removeElementFromHtml)(el, recorder));
        });
      }
      _setupNewGestureConfigInRootModule(gestureConfigPath) {
        const { project } = this.context;
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === void 0) {
          this.failures.push({
            filePath: mainFilePath,
            message: `Could not setup Hammer gestures in module. Please manually ensure that the Hammer gesture config is set up.`
          });
          return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, "NgModule", "@angular/core");
        if (!metadata.length) {
          return;
        }
        const filePath = this.fileSystem.resolve(sourceFile.fileName);
        const recorder = this.fileSystem.edit(filePath);
        const providersField = (0, schematics_1.getMetadataField)(metadata[0], "providers")[0];
        const providerIdentifiers = providersField ? findMatchingChildNodes(providersField, ts.isIdentifier) : null;
        const gestureConfigExpr = this._importManager.addImportToSourceFile(sourceFile, GESTURE_CONFIG_CLASS_NAME, getModuleSpecifier(gestureConfigPath, filePath), false, this._getGestureConfigIdentifiersOfFile(sourceFile));
        const hammerConfigTokenExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_CONFIG_TOKEN_NAME, HAMMER_CONFIG_TOKEN_MODULE);
        const newProviderNode = ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment("provide", hammerConfigTokenExpr),
          ts.factory.createPropertyAssignment("useClass", gestureConfigExpr)
        ]);
        if (!providerIdentifiers || !(this._hammerConfigTokenReferences.some((r) => providerIdentifiers.includes(r.node)) && this._gestureConfigReferences.some((r) => providerIdentifiers.includes(r.node)))) {
          const symbolName = this._printNode(newProviderNode, sourceFile);
          (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, "providers", symbolName, null).forEach((change) => {
            if (change instanceof change_1.InsertChange) {
              recorder.insertRight(change.pos, change.toAdd);
            }
          });
        }
      }
      _getRootModuleSymbol(mainFilePath) {
        const mainFile = this.program.getSourceFile(mainFilePath);
        if (!mainFile) {
          return null;
        }
        const appModuleExpr = (0, find_main_module_1.findMainModuleExpression)(mainFile);
        if (!appModuleExpr) {
          return null;
        }
        const appModuleSymbol = this._getDeclarationSymbolOfNode(unwrapExpression(appModuleExpr));
        if (!appModuleSymbol || !appModuleSymbol.valueDeclaration) {
          return null;
        }
        return appModuleSymbol;
      }
      _setupHammerModuleInRootModule() {
        const { project } = this.context;
        const mainFilePath = (0, schematics_1.getProjectMainFile)(project);
        const rootModuleSymbol = this._getRootModuleSymbol(mainFilePath);
        if (rootModuleSymbol === null || rootModuleSymbol.valueDeclaration === void 0) {
          this.failures.push({
            filePath: mainFilePath,
            message: `Could not setup HammerModule. Please manually set up the "HammerModule" from "@angular/platform-browser".`
          });
          return;
        }
        const sourceFile = rootModuleSymbol.valueDeclaration.getSourceFile();
        const metadata = (0, schematics_1.getDecoratorMetadata)(sourceFile, "NgModule", "@angular/core");
        if (!metadata.length) {
          return;
        }
        const importsField = (0, schematics_1.getMetadataField)(metadata[0], "imports")[0];
        const importIdentifiers = importsField ? findMatchingChildNodes(importsField, ts.isIdentifier) : null;
        const recorder = this.fileSystem.edit(this.fileSystem.resolve(sourceFile.fileName));
        const hammerModuleExpr = this._importManager.addImportToSourceFile(sourceFile, HAMMER_MODULE_NAME, HAMMER_MODULE_IMPORT);
        if (!importIdentifiers || !this._hammerModuleReferences.some((r) => importIdentifiers.includes(r.node))) {
          const symbolName = this._printNode(hammerModuleExpr, sourceFile);
          (0, schematics_1.addSymbolToNgModuleMetadata)(sourceFile, sourceFile.fileName, "imports", symbolName, null).forEach((change) => {
            if (change instanceof change_1.InsertChange) {
              recorder.insertRight(change.pos, change.toAdd);
            }
          });
        }
      }
      _printNode(node, sourceFile) {
        return this._printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
      }
      _getGestureConfigIdentifiersOfFile(sourceFile) {
        return this._gestureConfigReferences.filter((d) => d.node.getSourceFile() === sourceFile).map((d) => d.node);
      }
      _getDeclarationSymbolOfNode(node) {
        const symbol = this.typeChecker.getSymbolAtLocation(node);
        if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
          return this.typeChecker.getAliasedSymbol(symbol);
        }
        return symbol;
      }
      _isReferenceToHammerConfigToken(expr) {
        const unwrapped = unwrapExpression(expr);
        if (ts.isIdentifier(unwrapped)) {
          return this._hammerConfigTokenReferences.some((r) => r.node === unwrapped);
        } else if (ts.isPropertyAccessExpression(unwrapped)) {
          return this._hammerConfigTokenReferences.some((r) => r.node === unwrapped.name);
        }
        return false;
      }
      _createMigrationFailures() {
        return this._nodeFailures.map(({ node, message }) => {
          const sourceFile = node.getSourceFile();
          const offset = node.getStart();
          const position = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart());
          return {
            position: this._importManager.correctNodePosition(node, offset, position),
            message,
            filePath: this.fileSystem.resolve(sourceFile.fileName)
          };
        });
      }
      static globalPostMigration(tree, target, context) {
        if (!this._isAllowedVersion(target)) {
          return;
        }
        context.logger.info("\n\u26A0  General notice: The HammerJS v9 migration for Angular Components is not able to migrate tests. Please manually clean up tests in your project if they rely on " + (this.globalUsesHammer ? "the deprecated Angular Material gesture config." : "HammerJS."));
        context.logger.info("Read more about migrating tests: https://github.com/angular/components/blob/3a204da37fd1366cae411b5c234517ecad199737/guides/v9-hammerjs-migration.md#how-to-migrate-my-tests");
        if (!this.globalUsesHammer && this._removeHammerFromPackageJson(tree)) {
          return { runPackageManager: true };
        }
        this.globalUsesHammer = false;
      }
      static _removeHammerFromPackageJson(tree) {
        if (!tree.exists("/package.json")) {
          return false;
        }
        const packageJson = JSON.parse(tree.read("/package.json").toString("utf8"));
        if (packageJson.dependencies && packageJson.dependencies[HAMMER_MODULE_SPECIFIER]) {
          delete packageJson.dependencies[HAMMER_MODULE_SPECIFIER];
          tree.overwrite("/package.json", JSON.stringify(packageJson, null, 2));
          return true;
        }
        return false;
      }
      static _isAllowedVersion(target) {
        return target === schematics_1.TargetVersion.V9 || target === schematics_1.TargetVersion.V10;
      }
    };
    exports.HammerGesturesMigration = HammerGesturesMigration2;
    HammerGesturesMigration2.globalUsesHammer = false;
    function unwrapExpression(node) {
      if (ts.isParenthesizedExpression(node)) {
        return unwrapExpression(node.expression);
      } else if (ts.isAsExpression(node)) {
        return unwrapExpression(node.expression);
      } else if (ts.isTypeAssertion(node)) {
        return unwrapExpression(node.expression);
      }
      return node;
    }
    function getModuleSpecifier(newPath, containingFile) {
      let result = (0, core_1.relative)((0, core_1.dirname)(containingFile), newPath).replace(/\\/g, "/").replace(/\.ts$/, "");
      if (!result.startsWith(".")) {
        result = `./${result}`;
      }
      return result;
    }
    function getPropertyNameText(node) {
      if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) {
        return node.text;
      }
      return null;
    }
    function isNamespacedIdentifierAccess(node) {
      return ts.isQualifiedName(node.parent) || ts.isPropertyAccessExpression(node.parent);
    }
    function findMatchingChildNodes(parent, predicate) {
      const result = [];
      const visitNode = (node) => {
        if (predicate(node)) {
          result.push(node);
        }
        ts.forEachChild(node, visitNode);
      };
      ts.forEachChild(parent, visitNode);
      return result;
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-class-inheritance.js
var require_misc_class_inheritance = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-class-inheritance.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MiscClassInheritanceMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var MiscClassInheritanceMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
      }
      visitNode(node) {
        if (ts.isClassDeclaration(node)) {
          this._visitClassDeclaration(node);
        }
      }
      _visitClassDeclaration(node) {
        const baseTypes = (0, schematics_1.determineBaseTypes)(node);
        const className = node.name ? node.name.text : "{unknown-name}";
        if (!baseTypes) {
          return;
        }
        if (baseTypes.includes("MatFormFieldControl")) {
          const hasFloatLabelMember = node.members.filter((member) => member.name).find((member) => member.name.getText() === "shouldLabelFloat");
          if (!hasFloatLabelMember) {
            this.createFailureAtNode(node, `Found class "${className}" which extends "${"MatFormFieldControl"}". This class must define "${"shouldLabelFloat"}" which is now a required property.`);
          }
        }
      }
    };
    exports.MiscClassInheritanceMigration = MiscClassInheritanceMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-class-names.js
var require_misc_class_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-class-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MiscClassNamesMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var MiscClassNamesMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
      }
      visitNode(node) {
        if (ts.isIdentifier(node)) {
          this._visitIdentifier(node);
        }
      }
      _visitIdentifier(identifier) {
        if (identifier.getText() === "MatDrawerToggleResult") {
          this.createFailureAtNode(identifier, `Found "MatDrawerToggleResult" which has changed from a class type to a string literal type. Your code may need to be updated.`);
        }
        if (identifier.getText() === "MatListOptionChange") {
          this.createFailureAtNode(identifier, `Found usage of "MatListOptionChange" which has been removed. Please listen for "selectionChange" on "MatSelectionList" instead.`);
        }
      }
    };
    exports.MiscClassNamesMigration = MiscClassNamesMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-imports.js
var require_misc_imports = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-imports.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MiscImportsMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var MiscImportsMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
      }
      visitNode(node) {
        if (ts.isImportDeclaration(node)) {
          this._visitImportDeclaration(node);
        }
      }
      _visitImportDeclaration(node) {
        if (!(0, schematics_1.isMaterialImportDeclaration)(node) || !node.importClause || !node.importClause.namedBindings) {
          return;
        }
        const namedBindings = node.importClause.namedBindings;
        if (ts.isNamedImports(namedBindings)) {
          this._checkAnimationConstants(namedBindings);
        }
      }
      _checkAnimationConstants(namedImports) {
        namedImports.elements.filter((element) => ts.isIdentifier(element.name)).forEach((element) => {
          const importName = element.name.text;
          if (importName === "SHOW_ANIMATION" || importName === "HIDE_ANIMATION") {
            this.createFailureAtNode(element, `Found deprecated symbol "${importName}" which has been removed`);
          }
        });
      }
    };
    exports.MiscImportsMigration = MiscImportsMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-property-names.js
var require_misc_property_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-property-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MiscPropertyNamesMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var MiscPropertyNamesMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
      }
      visitNode(node) {
        if (ts.isPropertyAccessExpression(node)) {
          this._visitPropertyAccessExpression(node);
        }
      }
      _visitPropertyAccessExpression(node) {
        const hostType = this.typeChecker.getTypeAtLocation(node.expression);
        const typeName = hostType && hostType.symbol && hostType.symbol.getName();
        if (typeName === "MatListOption" && node.name.text === "selectionChange") {
          this.createFailureAtNode(node, `Found deprecated property "selectionChange" of class "MatListOption". Use the "selectionChange" property on the parent "MatSelectionList" instead.`);
        }
        if (typeName === "MatDatepicker" && node.name.text === "selectedChanged") {
          this.createFailureAtNode(node, `Found deprecated property "selectedChanged" of class "MatDatepicker". Use the "dateChange" or "dateInput" methods on "MatDatepickerInput" instead.`);
        }
      }
    };
    exports.MiscPropertyNamesMigration = MiscPropertyNamesMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-template.js
var require_misc_template = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-checks/misc-template.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MiscTemplateMigration = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    var MiscTemplateMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
      }
      visitTemplate(template) {
        (0, schematics_1.findOutputsOnElementWithTag)(template.content, "selectionChange", ["mat-list-option"]).forEach((offset) => {
          this.failures.push({
            filePath: template.filePath,
            position: template.getCharacterAndLineOfPosition(template.start + offset),
            message: `Found deprecated "selectionChange" output binding on "mat-list-option". Use "selectionChange" on "mat-selection-list" instead.`
          });
        });
        (0, schematics_1.findOutputsOnElementWithTag)(template.content, "selectedChanged", ["mat-datepicker"]).forEach((offset) => {
          this.failures.push({
            filePath: template.filePath,
            position: template.getCharacterAndLineOfPosition(template.start + offset),
            message: `Found deprecated "selectedChanged" output binding on "mat-datepicker". Use "dateChange" or "dateInput" on "<input [matDatepicker]>" instead.`
          });
        });
        (0, schematics_1.findInputsOnElementWithTag)(template.content, "selected", ["mat-button-toggle-group"]).forEach((offset) => {
          this.failures.push({
            filePath: template.filePath,
            position: template.getCharacterAndLineOfPosition(template.start + offset),
            message: `Found deprecated "selected" input binding on "mat-radio-button-group". Use "value" instead.`
          });
        });
      }
    };
    exports.MiscTemplateMigration = MiscTemplateMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor.js
var require_ripple_speed_factor = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSpeedFactorConvertExpression = exports.convertSpeedFactorToDuration = void 0;
    function convertSpeedFactorToDuration(factor) {
      return 450 / (factor || 1);
    }
    exports.convertSpeedFactorToDuration = convertSpeedFactorToDuration;
    function createSpeedFactorConvertExpression(speedFactorValue) {
      return `450 / (${speedFactorValue})`;
    }
    exports.createSpeedFactorConvertExpression = createSpeedFactorConvertExpression;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor-migration.js
var require_ripple_speed_factor_migration = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor-migration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RippleSpeedFactorMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var ripple_speed_factor_1 = require_ripple_speed_factor();
    var speedFactorNumberRegex = /\[matRippleSpeedFactor]="(\d+(?:\.\d+)?)"/g;
    var speedFactorNotParseable = /\[matRippleSpeedFactor]="(?!\d+(?:\.\d+)?")(.*)"/g;
    var removeNote = `TODO: Cleanup duration calculation.`;
    var RippleSpeedFactorMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V7;
      }
      visitNode(node) {
        if (ts.isBinaryExpression(node)) {
          this._visitBinaryExpression(node);
        } else if (ts.isPropertyAssignment(node)) {
          this._visitPropertyAssignment(node);
        }
      }
      visitTemplate(template) {
        let match;
        while ((match = speedFactorNumberRegex.exec(template.content)) !== null) {
          const newEnterDuration = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(parseFloat(match[1]));
          this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: ${newEnterDuration}}"`);
        }
        while ((match = speedFactorNotParseable.exec(template.content)) !== null) {
          const newDurationExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(match[1]);
          this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: (${newDurationExpression})}"`);
        }
      }
      _visitBinaryExpression(expression) {
        if (!ts.isPropertyAccessExpression(expression.left)) {
          return;
        }
        const leftExpression = expression.left;
        const targetTypeNode = this.typeChecker.getTypeAtLocation(leftExpression.expression);
        if (!targetTypeNode.symbol) {
          return;
        }
        const targetTypeName = targetTypeNode.symbol.getName();
        const propertyName = leftExpression.name.getText();
        const filePath = this.fileSystem.resolve(leftExpression.getSourceFile().fileName);
        if (targetTypeName === "MatRipple" && propertyName === "speedFactor") {
          if (ts.isNumericLiteral(expression.right)) {
            const numericValue = parseFloat(expression.right.text);
            const newEnterDurationValue = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(numericValue);
            this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), "animation");
            this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
          } else {
            const newExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(expression.right.getText());
            this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), "animation");
            this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
          }
        }
      }
      _visitPropertyAssignment(assignment) {
        if (!ts.isObjectLiteralExpression(assignment.parent)) {
          return;
        }
        if (assignment.name.getText() !== "baseSpeedFactor") {
          return;
        }
        const { initializer, name } = assignment;
        const filePath = this.fileSystem.resolve(assignment.getSourceFile().fileName);
        if (ts.isNumericLiteral(initializer)) {
          const numericValue = parseFloat(initializer.text);
          const newEnterDurationValue = (0, ripple_speed_factor_1.convertSpeedFactorToDuration)(numericValue);
          this._replaceText(filePath, name.getStart(), name.getWidth(), "animation");
          this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
        } else {
          const newExpression = (0, ripple_speed_factor_1.createSpeedFactorConvertExpression)(initializer.getText());
          this._replaceText(filePath, name.getStart(), name.getWidth(), "animation");
          this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
        }
      }
      _replaceText(filePath, start, width, newText) {
        const recorder = this.fileSystem.edit(filePath);
        recorder.remove(start, width);
        recorder.insertRight(start, newText);
      }
    };
    exports.RippleSpeedFactorMigration = RippleSpeedFactorMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/typescript/module-specifiers.js
var require_module_specifiers = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/typescript/module-specifiers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isMaterialExportDeclaration = exports.isMaterialImportDeclaration = exports.cdkModuleSpecifier = exports.materialModuleSpecifier = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.materialModuleSpecifier = "@angular/material";
    exports.cdkModuleSpecifier = "@angular/cdk";
    function isMaterialImportDeclaration(node) {
      return isMaterialDeclaration((0, schematics_1.getImportDeclaration)(node));
    }
    exports.isMaterialImportDeclaration = isMaterialImportDeclaration;
    function isMaterialExportDeclaration(node) {
      return isMaterialDeclaration((0, schematics_1.getExportDeclaration)(node));
    }
    exports.isMaterialExportDeclaration = isMaterialExportDeclaration;
    function isMaterialDeclaration(declaration) {
      if (!declaration.moduleSpecifier) {
        return false;
      }
      const moduleSpecifier = declaration.moduleSpecifier.getText();
      return moduleSpecifier.indexOf(exports.materialModuleSpecifier) !== -1 || moduleSpecifier.indexOf(exports.cdkModuleSpecifier) !== -1;
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/package-imports-v8/material-symbols.js
var require_material_symbols = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/package-imports-v8/material-symbols.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.materialSymbolMap = void 0;
    exports.materialSymbolMap = {
      "AUTOCOMPLETE_OPTION_HEIGHT": "autocomplete",
      "AUTOCOMPLETE_PANEL_HEIGHT": "autocomplete",
      "getMatAutocompleteMissingPanelError": "autocomplete",
      "MAT_AUTOCOMPLETE_DEFAULT_OPTIONS": "autocomplete",
      "MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY": "autocomplete",
      "MAT_AUTOCOMPLETE_SCROLL_STRATEGY": "autocomplete",
      "MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY": "autocomplete",
      "MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER": "autocomplete",
      "MAT_AUTOCOMPLETE_VALUE_ACCESSOR": "autocomplete",
      "MatAutocomplete": "autocomplete",
      "MatAutocompleteDefaultOptions": "autocomplete",
      "MatAutocompleteModule": "autocomplete",
      "MatAutocompleteOrigin": "autocomplete",
      "MatAutocompleteSelectedEvent": "autocomplete",
      "MatAutocompleteTrigger": "autocomplete",
      "MatBadge": "badge",
      "MatBadgeModule": "badge",
      "MatBadgePosition": "badge",
      "MatBadgeSize": "badge",
      "MAT_BOTTOM_SHEET_DATA": "bottom-sheet",
      "MAT_BOTTOM_SHEET_DEFAULT_OPTIONS": "bottom-sheet",
      "MatBottomSheet": "bottom-sheet",
      "matBottomSheetAnimations": "bottom-sheet",
      "MatBottomSheetConfig": "bottom-sheet",
      "MatBottomSheetContainer": "bottom-sheet",
      "MatBottomSheetModule": "bottom-sheet",
      "MatBottomSheetRef": "bottom-sheet",
      "MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS": "button-toggle",
      "MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR": "button-toggle",
      "MatButtonToggle": "button-toggle",
      "MatButtonToggleAppearance": "button-toggle",
      "MatButtonToggleChange": "button-toggle",
      "MatButtonToggleDefaultOptions": "button-toggle",
      "MatButtonToggleGroup": "button-toggle",
      "MatButtonToggleGroupMultiple": "button-toggle",
      "MatButtonToggleModule": "button-toggle",
      "ToggleType": "button-toggle",
      "MatAnchor": "button",
      "MatButton": "button",
      "MatButtonModule": "button",
      "MatCard": "card",
      "MatCardActions": "card",
      "MatCardAvatar": "card",
      "MatCardContent": "card",
      "MatCardFooter": "card",
      "MatCardHeader": "card",
      "MatCardImage": "card",
      "MatCardLgImage": "card",
      "MatCardMdImage": "card",
      "MatCardModule": "card",
      "MatCardSmImage": "card",
      "MatCardSubtitle": "card",
      "MatCardTitle": "card",
      "MatCardTitleGroup": "card",
      "MatCardXlImage": "card",
      "_MatCheckboxRequiredValidatorModule": "checkbox",
      "MAT_CHECKBOX_CLICK_ACTION": "checkbox",
      "MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR": "checkbox",
      "MAT_CHECKBOX_REQUIRED_VALIDATOR": "checkbox",
      "MatCheckbox": "checkbox",
      "MatCheckboxChange": "checkbox",
      "MatCheckboxClickAction": "checkbox",
      "MatCheckboxModule": "checkbox",
      "MatCheckboxRequiredValidator": "checkbox",
      "TransitionCheckState": "checkbox",
      "MAT_CHIPS_DEFAULT_OPTIONS": "chips",
      "MatChip": "chips",
      "MatChipAvatar": "chips",
      "MatChipEvent": "chips",
      "MatChipInput": "chips",
      "MatChipInputEvent": "chips",
      "MatChipList": "chips",
      "MatChipListChange": "chips",
      "MatChipRemove": "chips",
      "MatChipsDefaultOptions": "chips",
      "MatChipSelectionChange": "chips",
      "MatChipsModule": "chips",
      "MatChipTrailingIcon": "chips",
      "_countGroupLabelsBeforeOption": "core",
      "_getOptionScrollPosition": "core",
      "AnimationCurves": "core",
      "AnimationDurations": "core",
      "JAN": "core",
      "FEB": "core",
      "MAR": "core",
      "APR": "core",
      "MAY": "core",
      "JUN": "core",
      "JUL": "core",
      "AUG": "core",
      "SEP": "core",
      "OCT": "core",
      "NOV": "core",
      "DEC": "core",
      "CanColor": "core",
      "CanColorCtor": "core",
      "CanDisable": "core",
      "CanDisableCtor": "core",
      "CanDisableRipple": "core",
      "CanDisableRippleCtor": "core",
      "CanUpdateErrorState": "core",
      "CanUpdateErrorStateCtor": "core",
      "DateAdapter": "core",
      "defaultRippleAnimationConfig": "core",
      "ErrorStateMatcher": "core",
      "FloatLabelType": "core",
      "GestureConfig": "core",
      "HammerInput": "core",
      "HammerInstance": "core",
      "HammerManager": "core",
      "HammerOptions": "core",
      "HammerStatic": "core",
      "HasInitialized": "core",
      "HasInitializedCtor": "core",
      "HasTabIndex": "core",
      "HasTabIndexCtor": "core",
      "LabelOptions": "core",
      "MAT_DATE_FORMATS": "core",
      "MAT_DATE_LOCALE": "core",
      "MAT_DATE_LOCALE_FACTORY": "core",
      "MAT_DATE_LOCALE_PROVIDER": "core",
      "MAT_HAMMER_OPTIONS": "core",
      "MAT_LABEL_GLOBAL_OPTIONS": "core",
      "MAT_NATIVE_DATE_FORMATS": "core",
      "MAT_OPTION_PARENT_COMPONENT": "core",
      "MAT_RIPPLE_GLOBAL_OPTIONS": "core",
      "MatCommonModule": "core",
      "MatDateFormats": "core",
      "MATERIAL_SANITY_CHECKS": "core",
      "MatLine": "core",
      "MatLineModule": "core",
      "MatLineSetter": "core",
      "MatNativeDateModule": "core",
      "MatOptgroup": "core",
      "MatOption": "core",
      "MatOptionModule": "core",
      "MatOptionParentComponent": "core",
      "MatOptionSelectionChange": "core",
      "MatPseudoCheckbox": "core",
      "MatPseudoCheckboxModule": "core",
      "MatPseudoCheckboxState": "core",
      "MatRipple": "core",
      "MatRippleModule": "core",
      "mixinColor": "core",
      "mixinDisabled": "core",
      "mixinDisableRipple": "core",
      "mixinErrorState": "core",
      "mixinInitialized": "core",
      "mixinTabIndex": "core",
      "NativeDateAdapter": "core",
      "NativeDateModule": "core",
      "Recognizer": "core",
      "RecognizerStatic": "core",
      "RippleAnimationConfig": "core",
      "RippleConfig": "core",
      "RippleGlobalOptions": "core",
      "RippleRef": "core",
      "RippleRenderer": "core",
      "RippleState": "core",
      "RippleTarget": "core",
      "setLines": "core",
      "ShowOnDirtyErrorStateMatcher": "core",
      "ThemePalette": "core",
      "VERSION": "core",
      "MAT_DATEPICKER_SCROLL_STRATEGY": "datepicker",
      "MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY": "datepicker",
      "MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER": "datepicker",
      "MAT_DATEPICKER_VALIDATORS": "datepicker",
      "MAT_DATEPICKER_VALUE_ACCESSOR": "datepicker",
      "MatCalendar": "datepicker",
      "MatCalendarBody": "datepicker",
      "MatCalendarCell": "datepicker",
      "MatCalendarCellCssClasses": "datepicker",
      "MatCalendarHeader": "datepicker",
      "MatCalendarView": "datepicker",
      "MatDatepicker": "datepicker",
      "matDatepickerAnimations": "datepicker",
      "MatDatepickerContent": "datepicker",
      "MatDatepickerInput": "datepicker",
      "MatDatepickerInputEvent": "datepicker",
      "MatDatepickerIntl": "datepicker",
      "MatDatepickerModule": "datepicker",
      "MatDatepickerToggle": "datepicker",
      "MatDatepickerToggleIcon": "datepicker",
      "MatMonthView": "datepicker",
      "MatMultiYearView": "datepicker",
      "MatYearView": "datepicker",
      "yearsPerPage": "datepicker",
      "yearsPerRow": "datepicker",
      "DialogPosition": "dialog",
      "DialogRole": "dialog",
      "MAT_DIALOG_DATA": "dialog",
      "MAT_DIALOG_DEFAULT_OPTIONS": "dialog",
      "MAT_DIALOG_SCROLL_STRATEGY": "dialog",
      "MAT_DIALOG_SCROLL_STRATEGY_FACTORY": "dialog",
      "MAT_DIALOG_SCROLL_STRATEGY_PROVIDER": "dialog",
      "MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY": "dialog",
      "MatDialog": "dialog",
      "MatDialogActions": "dialog",
      "matDialogAnimations": "dialog",
      "MatDialogClose": "dialog",
      "MatDialogConfig": "dialog",
      "MatDialogContainer": "dialog",
      "MatDialogContent": "dialog",
      "MatDialogModule": "dialog",
      "MatDialogRef": "dialog",
      "MatDialogState": "dialog",
      "MatDialogTitle": "dialog",
      "throwMatDialogContentAlreadyAttachedError": "dialog",
      "MatDivider": "divider",
      "MatDividerModule": "divider",
      "EXPANSION_PANEL_ANIMATION_TIMING": "expansion",
      "MAT_ACCORDION": "expansion",
      "MAT_EXPANSION_PANEL_DEFAULT_OPTIONS": "expansion",
      "MatAccordion": "expansion",
      "MatAccordionBase": "expansion",
      "MatAccordionDisplayMode": "expansion",
      "MatAccordionTogglePosition": "expansion",
      "matExpansionAnimations": "expansion",
      "MatExpansionModule": "expansion",
      "MatExpansionPanel": "expansion",
      "MatExpansionPanelActionRow": "expansion",
      "MatExpansionPanelContent": "expansion",
      "MatExpansionPanelDefaultOptions": "expansion",
      "MatExpansionPanelDescription": "expansion",
      "MatExpansionPanelHeader": "expansion",
      "MatExpansionPanelState": "expansion",
      "MatExpansionPanelTitle": "expansion",
      "getMatFormFieldDuplicatedHintError": "form-field",
      "getMatFormFieldMissingControlError": "form-field",
      "getMatFormFieldPlaceholderConflictError": "form-field",
      "MAT_FORM_FIELD_DEFAULT_OPTIONS": "form-field",
      "MatError": "form-field",
      "MatFormField": "form-field",
      "matFormFieldAnimations": "form-field",
      "MatFormFieldAppearance": "form-field",
      "MatFormFieldControl": "form-field",
      "MatFormFieldDefaultOptions": "form-field",
      "MatFormFieldModule": "form-field",
      "MatHint": "form-field",
      "MatLabel": "form-field",
      "MatPlaceholder": "form-field",
      "MatPrefix": "form-field",
      "MatSuffix": "form-field",
      "MatGridAvatarCssMatStyler": "grid-list",
      "MatGridList": "grid-list",
      "MatGridListModule": "grid-list",
      "MatGridTile": "grid-list",
      "MatGridTileFooterCssMatStyler": "grid-list",
      "MatGridTileHeaderCssMatStyler": "grid-list",
      "MatGridTileText": "grid-list",
      "getMatIconFailedToSanitizeLiteralError": "icon",
      "getMatIconFailedToSanitizeUrlError": "icon",
      "getMatIconNameNotFoundError": "icon",
      "getMatIconNoHttpProviderError": "icon",
      "ICON_REGISTRY_PROVIDER": "icon",
      "ICON_REGISTRY_PROVIDER_FACTORY": "icon",
      "IconOptions": "icon",
      "MAT_ICON_LOCATION": "icon",
      "MAT_ICON_LOCATION_FACTORY": "icon",
      "MatIcon": "icon",
      "MatIconLocation": "icon",
      "MatIconModule": "icon",
      "MatIconRegistry": "icon",
      "getMatInputUnsupportedTypeError": "input",
      "MAT_INPUT_VALUE_ACCESSOR": "input",
      "MatInput": "input",
      "MatInputModule": "input",
      "MatTextareaAutosize": "input",
      "MAT_SELECTION_LIST_VALUE_ACCESSOR": "list",
      "MatList": "list",
      "MatListAvatarCssMatStyler": "list",
      "MatListIconCssMatStyler": "list",
      "MatListItem": "list",
      "MatListModule": "list",
      "MatListOption": "list",
      "MatListSubheaderCssMatStyler": "list",
      "MatNavList": "list",
      "MatSelectionList": "list",
      "MatSelectionListChange": "list",
      "_MatMenu": "menu",
      "_MatMenuBase": "menu",
      "_MatMenuDirectivesModule": "menu",
      "fadeInItems": "menu",
      "MAT_MENU_DEFAULT_OPTIONS": "menu",
      "MAT_MENU_PANEL": "menu",
      "MAT_MENU_SCROLL_STRATEGY": "menu",
      "MatMenu": "menu",
      "matMenuAnimations": "menu",
      "MatMenuContent": "menu",
      "MatMenuDefaultOptions": "menu",
      "MatMenuItem": "menu",
      "MatMenuModule": "menu",
      "MatMenuPanel": "menu",
      "MatMenuTrigger": "menu",
      "MenuPositionX": "menu",
      "MenuPositionY": "menu",
      "transformMenu": "menu",
      "MAT_PAGINATOR_INTL_PROVIDER": "paginator",
      "MAT_PAGINATOR_INTL_PROVIDER_FACTORY": "paginator",
      "MatPaginator": "paginator",
      "MatPaginatorIntl": "paginator",
      "MatPaginatorModule": "paginator",
      "PageEvent": "paginator",
      "MAT_PROGRESS_BAR_LOCATION": "progress-bar",
      "MAT_PROGRESS_BAR_LOCATION_FACTORY": "progress-bar",
      "MatProgressBar": "progress-bar",
      "MatProgressBarLocation": "progress-bar",
      "MatProgressBarModule": "progress-bar",
      "ProgressAnimationEnd": "progress-bar",
      "MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS": "progress-spinner",
      "MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS_FACTORY": "progress-spinner",
      "MatProgressSpinner": "progress-spinner",
      "MatProgressSpinnerDefaultOptions": "progress-spinner",
      "MatProgressSpinnerModule": "progress-spinner",
      "MatSpinner": "progress-spinner",
      "ProgressSpinnerMode": "progress-spinner",
      "MAT_RADIO_DEFAULT_OPTIONS": "radio",
      "MAT_RADIO_DEFAULT_OPTIONS_FACTORY": "radio",
      "MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR": "radio",
      "MatRadioButton": "radio",
      "MatRadioChange": "radio",
      "MatRadioDefaultOptions": "radio",
      "MatRadioGroup": "radio",
      "MatRadioModule": "radio",
      "fadeInContent": "select",
      "MAT_SELECT_SCROLL_STRATEGY": "select",
      "MAT_SELECT_SCROLL_STRATEGY_PROVIDER": "select",
      "MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY": "select",
      "MatSelect": "select",
      "matSelectAnimations": "select",
      "MatSelectChange": "select",
      "MatSelectModule": "select",
      "MatSelectTrigger": "select",
      "SELECT_ITEM_HEIGHT_EM": "select",
      "SELECT_MULTIPLE_PANEL_PADDING_X": "select",
      "SELECT_PANEL_INDENT_PADDING_X": "select",
      "SELECT_PANEL_MAX_HEIGHT": "select",
      "SELECT_PANEL_PADDING_X": "select",
      "SELECT_PANEL_VIEWPORT_PADDING": "select",
      "transformPanel": "select",
      "MAT_DRAWER_DEFAULT_AUTOSIZE": "sidenav",
      "MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY": "sidenav",
      "MatDrawer": "sidenav",
      "matDrawerAnimations": "sidenav",
      "MatDrawerContainer": "sidenav",
      "MatDrawerContent": "sidenav",
      "MatDrawerToggleResult": "sidenav",
      "MatSidenav": "sidenav",
      "MatSidenavContainer": "sidenav",
      "MatSidenavContent": "sidenav",
      "MatSidenavModule": "sidenav",
      "throwMatDuplicatedDrawerError": "sidenav",
      "_MatSlideToggleRequiredValidatorModule": "slide-toggle",
      "MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS": "slide-toggle",
      "MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR": "slide-toggle",
      "MAT_SLIDE_TOGGLE_VALUE_ACCESSOR": "slide-toggle",
      "MatSlideToggle": "slide-toggle",
      "MatSlideToggleChange": "slide-toggle",
      "MatSlideToggleDefaultOptions": "slide-toggle",
      "MatSlideToggleModule": "slide-toggle",
      "MatSlideToggleRequiredValidator": "slide-toggle",
      "MAT_SLIDER_VALUE_ACCESSOR": "slider",
      "MatSlider": "slider",
      "MatSliderChange": "slider",
      "MatSliderModule": "slider",
      "MAT_SNACK_BAR_DATA": "snack-bar",
      "MAT_SNACK_BAR_DEFAULT_OPTIONS": "snack-bar",
      "MAT_SNACK_BAR_DEFAULT_OPTIONS_FACTORY": "snack-bar",
      "MatSnackBar": "snack-bar",
      "matSnackBarAnimations": "snack-bar",
      "MatSnackBarConfig": "snack-bar",
      "MatSnackBarContainer": "snack-bar",
      "MatSnackBarDismiss": "snack-bar",
      "MatSnackBarHorizontalPosition": "snack-bar",
      "MatSnackBarModule": "snack-bar",
      "MatSnackBarRef": "snack-bar",
      "MatSnackBarVerticalPosition": "snack-bar",
      "SimpleSnackBar": "snack-bar",
      "ArrowViewState": "sort",
      "ArrowViewStateTransition": "sort",
      "MAT_SORT_HEADER_INTL_PROVIDER": "sort",
      "MAT_SORT_HEADER_INTL_PROVIDER_FACTORY": "sort",
      "MatSort": "sort",
      "MatSortable": "sort",
      "matSortAnimations": "sort",
      "MatSortHeader": "sort",
      "MatSortHeaderIntl": "sort",
      "MatSortModule": "sort",
      "Sort": "sort",
      "SortDirection": "sort",
      "MAT_STEPPER_INTL_PROVIDER": "stepper",
      "MAT_STEPPER_INTL_PROVIDER_FACTORY": "stepper",
      "MatHorizontalStepper": "stepper",
      "MatStep": "stepper",
      "MatStepHeader": "stepper",
      "MatStepLabel": "stepper",
      "MatStepper": "stepper",
      "matStepperAnimations": "stepper",
      "MatStepperIcon": "stepper",
      "MatStepperIconContext": "stepper",
      "MatStepperIntl": "stepper",
      "MatStepperModule": "stepper",
      "MatStepperNext": "stepper",
      "MatStepperPrevious": "stepper",
      "MatVerticalStepper": "stepper",
      "MatCell": "table",
      "MatCellDef": "table",
      "MatColumnDef": "table",
      "MatFooterCell": "table",
      "MatFooterCellDef": "table",
      "MatFooterRow": "table",
      "MatFooterRowDef": "table",
      "MatHeaderCell": "table",
      "MatHeaderCellDef": "table",
      "MatHeaderRow": "table",
      "MatHeaderRowDef": "table",
      "MatRow": "table",
      "MatRowDef": "table",
      "MatTable": "table",
      "MatTableDataSource": "table",
      "MatTableModule": "table",
      "MatTextColumn": "table",
      "_MAT_INK_BAR_POSITIONER": "tabs",
      "_MatInkBarPositioner": "tabs",
      "_MatTabBodyBase": "tabs",
      "_MatTabGroupBase": "tabs",
      "_MatTabHeaderBase": "tabs",
      "_MatTabLinkBase": "tabs",
      "_MatTabNavBase": "tabs",
      "MAT_TABS_CONFIG": "tabs",
      "MatInkBar": "tabs",
      "MatTab": "tabs",
      "MatTabBody": "tabs",
      "MatTabBodyOriginState": "tabs",
      "MatTabBodyPortal": "tabs",
      "MatTabBodyPositionState": "tabs",
      "MatTabChangeEvent": "tabs",
      "MatTabContent": "tabs",
      "MatTabGroup": "tabs",
      "MatTabHeader": "tabs",
      "MatTabHeaderPosition": "tabs",
      "MatTabLabel": "tabs",
      "MatTabLabelWrapper": "tabs",
      "MatTabLink": "tabs",
      "MatTabNav": "tabs",
      "matTabsAnimations": "tabs",
      "MatTabsConfig": "tabs",
      "MatTabsModule": "tabs",
      "ScrollDirection": "tabs",
      "MatToolbar": "toolbar",
      "MatToolbarModule": "toolbar",
      "MatToolbarRow": "toolbar",
      "throwToolbarMixedModesError": "toolbar",
      "getMatTooltipInvalidPositionError": "tooltip",
      "MAT_TOOLTIP_DEFAULT_OPTIONS": "tooltip",
      "MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY": "tooltip",
      "MAT_TOOLTIP_SCROLL_STRATEGY": "tooltip",
      "MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY": "tooltip",
      "MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER": "tooltip",
      "MatTooltip": "tooltip",
      "matTooltipAnimations": "tooltip",
      "MatTooltipDefaultOptions": "tooltip",
      "MatTooltipModule": "tooltip",
      "SCROLL_THROTTLE_MS": "tooltip",
      "TOOLTIP_PANEL_CLASS": "tooltip",
      "TooltipComponent": "tooltip",
      "TooltipPosition": "tooltip",
      "TooltipVisibility": "tooltip",
      "MatNestedTreeNode": "tree",
      "MatTree": "tree",
      "MatTreeFlatDataSource": "tree",
      "MatTreeFlattener": "tree",
      "MatTreeModule": "tree",
      "MatTreeNestedDataSource": "tree",
      "MatTreeNode": "tree",
      "MatTreeNodeDef": "tree",
      "MatTreeNodeOutlet": "tree",
      "MatTreeNodePadding": "tree",
      "MatTreeNodeToggle": "tree"
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/package-imports-v8/secondary-entry-points-migration.js
var require_secondary_entry_points_migration = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/package-imports-v8/secondary-entry-points-migration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SecondaryEntryPointsMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var module_specifiers_1 = require_module_specifiers();
    var material_symbols_1 = require_material_symbols();
    var ONLY_SUBPACKAGE_FAILURE_STR = `Importing from "@angular/material" is deprecated. Instead import from the entry-point the symbol belongs to.`;
    var NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR = `Imports from Angular Material should import specific symbols rather than importing the entire library.`;
    var ANGULAR_MATERIAL_FILEPATH_REGEX = new RegExp(`${module_specifiers_1.materialModuleSpecifier}/(.*?)/`);
    var SecondaryEntryPointsMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.printer = ts.createPrinter();
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V8 || this.targetVersion === schematics_1.TargetVersion.V9;
      }
      visitNode(declaration) {
        if (!ts.isImportDeclaration(declaration) || !ts.isStringLiteralLike(declaration.moduleSpecifier)) {
          return;
        }
        const importLocation = declaration.moduleSpecifier.text;
        if (importLocation !== module_specifiers_1.materialModuleSpecifier) {
          return;
        }
        if (!declaration.importClause || !declaration.importClause.namedBindings) {
          this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
          return;
        }
        if (!ts.isNamedImports(declaration.importClause.namedBindings)) {
          this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
          return;
        }
        if (!declaration.importClause.namedBindings.elements.length) {
          this.createFailureAtNode(declaration, NO_IMPORT_NAMED_SYMBOLS_FAILURE_STR);
          return;
        }
        const singleQuoteImport = declaration.moduleSpecifier.getText()[0] === `'`;
        const importMap = /* @__PURE__ */ new Map();
        for (const element of declaration.importClause.namedBindings.elements) {
          const elementName = element.propertyName ? element.propertyName : element.name;
          const moduleName = resolveModuleName(elementName, this.typeChecker) || material_symbols_1.materialSymbolMap[elementName.text] || null;
          if (!moduleName) {
            this.createFailureAtNode(element, `"${element.getText()}" was not found in the Material library.`);
            return;
          }
          if (importMap.has(moduleName)) {
            importMap.get(moduleName).push(element);
          } else {
            importMap.set(moduleName, [element]);
          }
        }
        const newImportStatements = Array.from(importMap.entries()).sort().map(([name, elements]) => {
          const newImport = ts.factory.createImportDeclaration(void 0, void 0, ts.factory.createImportClause(false, void 0, ts.factory.createNamedImports(elements)), ts.factory.createStringLiteral(`${module_specifiers_1.materialModuleSpecifier}/${name}`, singleQuoteImport));
          return this.printer.printNode(ts.EmitHint.Unspecified, newImport, declaration.getSourceFile());
        }).join("\n");
        if (!newImportStatements) {
          this.createFailureAtNode(declaration.moduleSpecifier, ONLY_SUBPACKAGE_FAILURE_STR);
          return;
        }
        const filePath = this.fileSystem.resolve(declaration.moduleSpecifier.getSourceFile().fileName);
        const recorder = this.fileSystem.edit(filePath);
        recorder.remove(declaration.getStart(), declaration.getWidth());
        recorder.insertRight(declaration.getStart(), newImportStatements);
      }
    };
    exports.SecondaryEntryPointsMigration = SecondaryEntryPointsMigration2;
    function getDeclarationSymbolOfNode(node, checker) {
      const symbol = checker.getSymbolAtLocation(node);
      if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
        return checker.getAliasedSymbol(symbol);
      }
      return symbol;
    }
    function resolveModuleName(node, typeChecker) {
      var _a;
      const symbol = getDeclarationSymbolOfNode(node, typeChecker);
      if (!symbol || !(symbol.valueDeclaration || symbol.declarations && symbol.declarations.length !== 0)) {
        return null;
      }
      const resolvedNode = symbol.valueDeclaration || ((_a = symbol.declarations) == null ? void 0 : _a[0]);
      if (resolvedNode === void 0) {
        return null;
      }
      const sourceFile = resolvedNode.getSourceFile().fileName;
      const matches = sourceFile.match(ANGULAR_MATERIAL_FILEPATH_REGEX);
      return matches ? matches[1] : null;
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/config.js
var require_config = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unprefixedRemovedVariables = exports.removedMaterialVariables = exports.cdkMixins = exports.cdkVariables = exports.materialVariables = exports.materialFunctions = exports.materialMixins = void 0;
    exports.materialMixins = {
      "mat-core": "core",
      "mat-core-color": "core-color",
      "mat-core-theme": "core-theme",
      "angular-material-theme": "all-component-themes",
      "angular-material-typography": "all-component-typographies",
      "angular-material-color": "all-component-colors",
      "mat-base-typography": "typography-hierarchy",
      "mat-typography-level-to-styles": "typography-level",
      "mat-elevation": "elevation",
      "mat-overridable-elevation": "overridable-elevation",
      "mat-elevation-transition": "elevation-transition",
      "mat-ripple": "ripple",
      "mat-ripple-color": "ripple-color",
      "mat-ripple-theme": "ripple-theme",
      "mat-strong-focus-indicators": "strong-focus-indicators",
      "mat-strong-focus-indicators-color": "strong-focus-indicators-color",
      "mat-strong-focus-indicators-theme": "strong-focus-indicators-theme",
      "mat-font-shorthand": "font-shorthand",
      "mat-expansion-panel-theme": "expansion-theme",
      "mat-expansion-panel-color": "expansion-color",
      "mat-expansion-panel-typography": "expansion-typography"
    };
    [
      "option",
      "optgroup",
      "pseudo-checkbox",
      "autocomplete",
      "badge",
      "bottom-sheet",
      "button",
      "button-toggle",
      "card",
      "checkbox",
      "chips",
      "divider",
      "table",
      "datepicker",
      "dialog",
      "grid-list",
      "icon",
      "input",
      "list",
      "menu",
      "paginator",
      "progress-bar",
      "progress-spinner",
      "radio",
      "select",
      "sidenav",
      "slide-toggle",
      "slider",
      "stepper",
      "sort",
      "tabs",
      "toolbar",
      "tooltip",
      "snack-bar",
      "form-field",
      "tree"
    ].forEach((name) => {
      exports.materialMixins[`mat-${name}-theme`] = `${name}-theme`;
      exports.materialMixins[`mat-${name}-color`] = `${name}-color`;
      exports.materialMixins[`mat-${name}-typography`] = `${name}-typography`;
    });
    exports.materialFunctions = {
      "mat-color": "get-color-from-palette",
      "mat-contrast": "get-contrast-color-from-palette",
      "mat-palette": "define-palette",
      "mat-dark-theme": "define-dark-theme",
      "mat-light-theme": "define-light-theme",
      "mat-typography-level": "define-typography-level",
      "mat-typography-config": "define-typography-config",
      "mat-font-size": "font-size",
      "mat-line-height": "line-height",
      "mat-font-weight": "font-weight",
      "mat-letter-spacing": "letter-spacing",
      "mat-font-family": "font-family"
    };
    exports.materialVariables = {
      "mat-light-theme-background": "light-theme-background-palette",
      "mat-dark-theme-background": "dark-theme-background-palette",
      "mat-light-theme-foreground": "light-theme-foreground-palette",
      "mat-dark-theme-foreground": "dark-theme-foreground-palette"
    };
    [
      "red",
      "pink",
      "indigo",
      "purple",
      "deep-purple",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "grey",
      "gray",
      "blue-grey",
      "blue-gray"
    ].forEach((name) => exports.materialVariables[`mat-${name}`] = `${name}-palette`);
    exports.cdkVariables = {
      "cdk-z-index-overlay-container": "overlay-container-z-index",
      "cdk-z-index-overlay": "overlay-z-index",
      "cdk-z-index-overlay-backdrop": "overlay-backdrop-z-index",
      "cdk-overlay-dark-backdrop-background": "overlay-backdrop-color"
    };
    exports.cdkMixins = {
      "cdk-overlay": "overlay",
      "cdk-a11y": "a11y-visually-hidden",
      "cdk-high-contrast": "high-contrast",
      "cdk-text-field-autofill-color": "text-field-autofill-color",
      "cdk-text-field": "text-field"
    };
    exports.removedMaterialVariables = {
      "mat-xsmall": "max-width: 599px",
      "mat-small": "max-width: 959px",
      "mat-toggle-padding": "8px",
      "mat-toggle-size": "20px",
      "mat-linear-out-slow-in-timing-function": "cubic-bezier(0, 0, 0.2, 0.1)",
      "mat-fast-out-slow-in-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
      "mat-fast-out-linear-in-timing-function": "cubic-bezier(0.4, 0, 1, 1)",
      "mat-elevation-transition-duration": "280ms",
      "mat-elevation-transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
      "mat-elevation-color": "#000",
      "mat-elevation-opacity": "1",
      "mat-elevation-prefix": `'mat-elevation-z'`,
      "mat-ripple-color-opacity": "0.1",
      "mat-badge-font-size": "12px",
      "mat-badge-font-weight": "600",
      "mat-badge-default-size": "22px",
      "mat-badge-small-size": "16px",
      "mat-badge-large-size": "28px",
      "mat-button-toggle-standard-height": "48px",
      "mat-button-toggle-standard-minimum-height": "24px",
      "mat-button-toggle-standard-maximum-height": "48px",
      "mat-chip-remove-font-size": "18px",
      "mat-datepicker-selected-today-box-shadow-width": "1px",
      "mat-datepicker-selected-fade-amount": "0.6",
      "mat-datepicker-range-fade-amount": "0.2",
      "mat-datepicker-today-fade-amount": "0.2",
      "mat-calendar-body-font-size": "13px",
      "mat-calendar-weekday-table-font-size": "11px",
      "mat-expansion-panel-header-collapsed-height": "48px",
      "mat-expansion-panel-header-collapsed-minimum-height": "36px",
      "mat-expansion-panel-header-collapsed-maximum-height": "48px",
      "mat-expansion-panel-header-expanded-height": "64px",
      "mat-expansion-panel-header-expanded-minimum-height": "48px",
      "mat-expansion-panel-header-expanded-maximum-height": "64px",
      "mat-expansion-panel-header-transition": "225ms cubic-bezier(0.4, 0, 0.2, 1)",
      "mat-menu-side-padding": "16px",
      "menu-menu-item-height": "48px",
      "menu-menu-icon-margin": "16px",
      "mat-paginator-height": "56px",
      "mat-paginator-minimum-height": "40px",
      "mat-paginator-maximum-height": "56px",
      "mat-stepper-header-height": "72px",
      "mat-stepper-header-minimum-height": "42px",
      "mat-stepper-header-maximum-height": "72px",
      "mat-stepper-label-header-height": "24px",
      "mat-stepper-label-position-bottom-top-gap": "16px",
      "mat-stepper-label-min-width": "50px",
      "mat-vertical-stepper-content-margin": "36px",
      "mat-stepper-side-gap": "24px",
      "mat-stepper-line-width": "1px",
      "mat-stepper-line-gap": "8px",
      "mat-step-sub-label-font-size": "12px",
      "mat-step-header-icon-size": "16px",
      "mat-toolbar-minimum-height": "44px",
      "mat-toolbar-height-desktop": "64px",
      "mat-toolbar-maximum-height-desktop": "64px",
      "mat-toolbar-minimum-height-desktop": "44px",
      "mat-toolbar-height-mobile": "56px",
      "mat-toolbar-maximum-height-mobile": "56px",
      "mat-toolbar-minimum-height-mobile": "44px",
      "mat-tooltip-target-height": "22px",
      "mat-tooltip-font-size": "10px",
      "mat-tooltip-vertical-padding": "6px",
      "mat-tooltip-handset-target-height": "30px",
      "mat-tooltip-handset-font-size": "14px",
      "mat-tooltip-handset-vertical-padding": "8px",
      "mat-tree-node-height": "48px",
      "mat-tree-node-minimum-height": "24px",
      "mat-tree-node-maximum-height": "48px"
    };
    exports.unprefixedRemovedVariables = {
      "z-index-fab": "20",
      "z-index-drawer": "100",
      "ease-in-out-curve-function": "cubic-bezier(0.35, 0, 0.25, 1)",
      "swift-ease-out-duration": "400ms",
      "swift-ease-out-timing-function": "cubic-bezier(0.25, 0.8, 0.25, 1)",
      "swift-ease-out": "all 400ms cubic-bezier(0.25, 0.8, 0.25, 1)",
      "swift-ease-in-duration": "300ms",
      "swift-ease-in-timing-function": "cubic-bezier(0.55, 0, 0.55, 0.2)",
      "swift-ease-in": "all 300ms cubic-bezier(0.55, 0, 0.55, 0.2)",
      "swift-ease-in-out-duration": "500ms",
      "swift-ease-in-out-timing-function": "cubic-bezier(0.35, 0, 0.25, 1)",
      "swift-ease-in-out": "all 500ms cubic-bezier(0.35, 0, 0.25, 1)",
      "swift-linear-duration": "80ms",
      "swift-linear-timing-function": "linear",
      "swift-linear": "all 80ms linear",
      "black-87-opacity": "rgba(black, 0.87)",
      "white-87-opacity": "rgba(white, 0.87)",
      "black-12-opacity": "rgba(black, 0.12)",
      "white-12-opacity": "rgba(white, 0.12)",
      "black-6-opacity": "rgba(black, 0.06)",
      "white-6-opacity": "rgba(white, 0.06)",
      "dark-primary-text": "rgba(black, 0.87)",
      "dark-secondary-text": "rgba(black, 0.54)",
      "dark-disabled-text": "rgba(black, 0.38)",
      "dark-dividers": "rgba(black, 0.12)",
      "dark-focused": "rgba(black, 0.12)",
      "light-primary-text": "white",
      "light-secondary-text": "rgba(white, 0.7)",
      "light-disabled-text": "rgba(white, 0.5)",
      "light-dividers": "rgba(white, 0.12)",
      "light-focused": "rgba(white, 0.12)"
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/migration.js
var require_migration = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/migration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateFileContent = void 0;
    var config_1 = require_config();
    var commentPairs = /* @__PURE__ */ new Map([
      ["/*", "*/"],
      ["//", "\n"]
    ]);
    var commentPlaceholderStart = "__<<ngThemingMigrationEscapedComment";
    var commentPlaceholderEnd = ">>__";
    function migrateFileContent(fileContent, oldMaterialPrefix, oldCdkPrefix, newMaterialImportPath, newCdkImportPath, extraMaterialSymbols = {}, excludedImports) {
      let { content, placeholders } = escapeComments(fileContent);
      const materialResults = detectImports(content, oldMaterialPrefix, excludedImports);
      const cdkResults = detectImports(content, oldCdkPrefix, excludedImports);
      content = migrateCdkSymbols(content, newCdkImportPath, placeholders, cdkResults);
      content = migrateMaterialSymbols(content, newMaterialImportPath, materialResults, placeholders, extraMaterialSymbols);
      content = replaceRemovedVariables(content, config_1.removedMaterialVariables);
      if (materialResults.imports.length) {
        content = replaceRemovedVariables(content, config_1.unprefixedRemovedVariables);
        content = removeStrings(content, materialResults.imports);
      }
      if (cdkResults.imports.length) {
        content = removeStrings(content, cdkResults.imports);
      }
      return restoreComments(content, placeholders);
    }
    exports.migrateFileContent = migrateFileContent;
    function detectImports(content, prefix, excludedImports) {
      if (prefix[prefix.length - 1] !== "/") {
        throw Error(`Prefix "${prefix}" has to end in a slash.`);
      }
      const namespaces = [];
      const imports = [];
      const pattern = new RegExp(`@(import|use) +['"]~?${escapeRegExp(prefix)}.*['"].*;?
`, "g");
      let match = null;
      while (match = pattern.exec(content)) {
        const [fullImport, type] = match;
        if (excludedImports == null ? void 0 : excludedImports.test(fullImport)) {
          continue;
        }
        if (type === "use") {
          const namespace = extractNamespaceFromUseStatement(fullImport);
          if (namespaces.indexOf(namespace) === -1) {
            namespaces.push(namespace);
          }
        }
        imports.push(fullImport);
      }
      return { imports, namespaces };
    }
    function migrateMaterialSymbols(content, importPath, detectedImports, commentPlaceholders, extraMaterialSymbols = {}) {
      const initialContent = content;
      const namespace = "mat";
      const mixinsToUpdate = __spreadValues(__spreadValues({}, config_1.materialMixins), extraMaterialSymbols.mixins);
      content = renameSymbols(content, mixinsToUpdate, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
      const functionsToUpdate = __spreadValues(__spreadValues({}, config_1.materialFunctions), extraMaterialSymbols.functions);
      content = renameSymbols(content, functionsToUpdate, detectedImports.namespaces, functionKeyFormatter, getFunctionValueFormatter(namespace));
      const variablesToUpdate = __spreadValues(__spreadValues({}, config_1.materialVariables), extraMaterialSymbols.variables);
      content = renameSymbols(content, variablesToUpdate, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
      if (content !== initialContent) {
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
      }
      return content;
    }
    function migrateCdkSymbols(content, importPath, commentPlaceholders, detectedImports) {
      const initialContent = content;
      const namespace = "cdk";
      content = renameSymbols(content, config_1.cdkMixins, detectedImports.namespaces, mixinKeyFormatter, getMixinValueFormatter(namespace));
      content = renameSymbols(content, config_1.cdkVariables, detectedImports.namespaces, variableKeyFormatter, getVariableValueFormatter(namespace));
      if (content !== initialContent) {
        content = insertUseStatement(content, importPath, namespace, commentPlaceholders);
      }
      return content;
    }
    function renameSymbols(content, mapping, namespaces, getKeyPattern, formatValue) {
      [...namespaces.slice(), null].forEach((namespace) => {
        Object.keys(mapping).forEach((key) => {
          const pattern = getKeyPattern(namespace, key);
          if (pattern.flags.indexOf("g") === -1) {
            throw Error("Replacement pattern must be global.");
          }
          content = content.replace(pattern, formatValue(mapping[key]));
        });
      });
      return content;
    }
    function insertUseStatement(content, importPath, namespace, commentPlaceholders) {
      if (new RegExp(`@use +['"]${importPath}['"]`, "g").test(content)) {
        return content;
      }
      let newImportIndex = 0;
      if (content.trim().startsWith(commentPlaceholderStart)) {
        const commentStartIndex = content.indexOf(commentPlaceholderStart);
        newImportIndex = content.indexOf(commentPlaceholderEnd, commentStartIndex + 1) + commentPlaceholderEnd.length;
        if (!commentPlaceholders[content.slice(commentStartIndex, newImportIndex)].endsWith("\n")) {
          newImportIndex = Math.max(newImportIndex, content.indexOf("\n", newImportIndex) + 1);
        }
      }
      return content.slice(0, newImportIndex) + `@use '${importPath}' as ${namespace};
` + content.slice(newImportIndex);
    }
    function mixinKeyFormatter(namespace, name) {
      return new RegExp(`@include +${escapeRegExp((namespace ? namespace + "." : "") + name)}`, "g");
    }
    function getMixinValueFormatter(namespace) {
      return (name) => `@include ${namespace}.${name}`;
    }
    function functionKeyFormatter(namespace, name) {
      const functionName = escapeRegExp(`${namespace ? namespace + "." : ""}${name}(`);
      return new RegExp(`(?<![-_a-zA-Z0-9])${functionName}`, "g");
    }
    function getFunctionValueFormatter(namespace) {
      return (name) => `${namespace}.${name}(`;
    }
    function variableKeyFormatter(namespace, name) {
      const variableName = escapeRegExp(`${namespace ? namespace + "." : ""}$${name}`);
      return new RegExp(`${variableName}(?![-_a-zA-Z0-9])`, "g");
    }
    function getVariableValueFormatter(namespace) {
      return (name) => `${namespace}.$${name}`;
    }
    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    }
    function removeStrings(content, toRemove) {
      return toRemove.reduce((accumulator, current) => accumulator.replace(current, ""), content).replace(/^\s+/, "");
    }
    function extractNamespaceFromUseStatement(fullImport) {
      const closeQuoteIndex = Math.max(fullImport.lastIndexOf(`"`), fullImport.lastIndexOf(`'`));
      if (closeQuoteIndex > -1) {
        const asExpression = "as ";
        const asIndex = fullImport.indexOf(asExpression, closeQuoteIndex);
        if (asIndex > -1) {
          return fullImport.slice(asIndex + asExpression.length).split(";")[0].trim();
        }
        const lastSlashIndex = fullImport.lastIndexOf("/", closeQuoteIndex);
        if (lastSlashIndex > -1) {
          const fileName = fullImport.slice(lastSlashIndex + 1, closeQuoteIndex).replace(/^_|(\.import)?\.scss$|\.import$/g, "");
          if (fileName === "index") {
            const nextSlashIndex = fullImport.lastIndexOf("/", lastSlashIndex - 1);
            if (nextSlashIndex > -1) {
              return fullImport.slice(nextSlashIndex + 1, lastSlashIndex);
            }
          } else {
            return fileName;
          }
        }
      }
      throw Error(`Could not extract namespace from import "${fullImport}".`);
    }
    function replaceRemovedVariables(content, variables) {
      Object.keys(variables).forEach((variableName) => {
        const regex = new RegExp(`\\$${escapeRegExp(variableName)}(?!\\s+:|[-_a-zA-Z0-9:])`, "g");
        content = content.replace(regex, variables[variableName]);
      });
      return content;
    }
    function escapeComments(content) {
      const placeholders = {};
      let commentCounter = 0;
      let [openIndex, closeIndex] = findComment(content);
      while (openIndex > -1 && closeIndex > -1) {
        const placeholder = commentPlaceholderStart + commentCounter++ + commentPlaceholderEnd;
        placeholders[placeholder] = content.slice(openIndex, closeIndex);
        content = content.slice(0, openIndex) + placeholder + content.slice(closeIndex);
        [openIndex, closeIndex] = findComment(content);
      }
      return { content, placeholders };
    }
    function findComment(content) {
      content += "\n";
      for (const [open, close] of commentPairs.entries()) {
        const openIndex = content.indexOf(open);
        if (openIndex > -1) {
          const closeIndex = content.indexOf(close, openIndex + 1);
          return closeIndex > -1 ? [openIndex, closeIndex + close.length] : [-1, -1];
        }
      }
      return [-1, -1];
    }
    function restoreComments(content, placeholders) {
      Object.keys(placeholders).forEach((key) => content = content.replace(key, placeholders[key]));
      return content;
    }
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/theming-api-migration.js
var require_theming_api_migration = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/theming-api-v12/theming-api-migration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ThemingApiMigration = void 0;
    var core_1 = require("@angular-devkit/core");
    var schematics_1 = require("@angular/cdk/schematics");
    var migration_1 = require_migration();
    var ThemingApiMigration2 = class extends schematics_1.DevkitMigration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V12;
      }
      visitStylesheet(stylesheet) {
        if ((0, core_1.extname)(stylesheet.filePath) === ".scss") {
          const content = stylesheet.content;
          const migratedContent = content ? (0, migration_1.migrateFileContent)(content, "@angular/material/", "@angular/cdk/", "@angular/material", "@angular/cdk", void 0, /material\/prebuilt-themes|cdk\/.*-prebuilt/) : content;
          if (migratedContent && migratedContent !== content) {
            this.fileSystem.edit(stylesheet.filePath).remove(0, stylesheet.content.length).insertLeft(0, migratedContent);
            ThemingApiMigration2.migratedFileCount++;
          }
        }
      }
      static globalPostMigration(_tree, _targetVersion, context) {
        const count = ThemingApiMigration2.migratedFileCount;
        if (count > 0) {
          context.logger.info(`Migrated ${count === 1 ? `1 file` : `${count} files`} to the new Angular Material theming API.`);
          ThemingApiMigration2.migratedFileCount = 0;
        }
      }
    };
    exports.ThemingApiMigration = ThemingApiMigration2;
    ThemingApiMigration2.migratedFileCount = 0;
  }
});

// node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "node_modules/picocolors/picocolors.js"(exports, module2) {
    var tty = require("tty");
    var isColorSupported = !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || tty.isatty(1) && process.env.TERM !== "dumb" || "CI" in process.env);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input;
      let index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let start = string.substring(0, index) + replace;
      let end = string.substring(index + close.length);
      let nextIndex = end.indexOf(close);
      return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
    };
    var createColors = (enabled = isColorSupported) => ({
      isColorSupported: enabled,
      reset: enabled ? (s) => `\x1B[0m${s}\x1B[0m` : String,
      bold: enabled ? formatter("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m") : String,
      dim: enabled ? formatter("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m") : String,
      italic: enabled ? formatter("\x1B[3m", "\x1B[23m") : String,
      underline: enabled ? formatter("\x1B[4m", "\x1B[24m") : String,
      inverse: enabled ? formatter("\x1B[7m", "\x1B[27m") : String,
      hidden: enabled ? formatter("\x1B[8m", "\x1B[28m") : String,
      strikethrough: enabled ? formatter("\x1B[9m", "\x1B[29m") : String,
      black: enabled ? formatter("\x1B[30m", "\x1B[39m") : String,
      red: enabled ? formatter("\x1B[31m", "\x1B[39m") : String,
      green: enabled ? formatter("\x1B[32m", "\x1B[39m") : String,
      yellow: enabled ? formatter("\x1B[33m", "\x1B[39m") : String,
      blue: enabled ? formatter("\x1B[34m", "\x1B[39m") : String,
      magenta: enabled ? formatter("\x1B[35m", "\x1B[39m") : String,
      cyan: enabled ? formatter("\x1B[36m", "\x1B[39m") : String,
      white: enabled ? formatter("\x1B[37m", "\x1B[39m") : String,
      gray: enabled ? formatter("\x1B[90m", "\x1B[39m") : String,
      bgBlack: enabled ? formatter("\x1B[40m", "\x1B[49m") : String,
      bgRed: enabled ? formatter("\x1B[41m", "\x1B[49m") : String,
      bgGreen: enabled ? formatter("\x1B[42m", "\x1B[49m") : String,
      bgYellow: enabled ? formatter("\x1B[43m", "\x1B[49m") : String,
      bgBlue: enabled ? formatter("\x1B[44m", "\x1B[49m") : String,
      bgMagenta: enabled ? formatter("\x1B[45m", "\x1B[49m") : String,
      bgCyan: enabled ? formatter("\x1B[46m", "\x1B[49m") : String,
      bgWhite: enabled ? formatter("\x1B[47m", "\x1B[49m") : String
    });
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// node_modules/postcss/lib/tokenize.js
var require_tokenize = __commonJS({
  "node_modules/postcss/lib/tokenize.js"(exports, module2) {
    "use strict";
    var SINGLE_QUOTE = "'".charCodeAt(0);
    var DOUBLE_QUOTE = '"'.charCodeAt(0);
    var BACKSLASH = "\\".charCodeAt(0);
    var SLASH = "/".charCodeAt(0);
    var NEWLINE = "\n".charCodeAt(0);
    var SPACE = " ".charCodeAt(0);
    var FEED = "\f".charCodeAt(0);
    var TAB = "	".charCodeAt(0);
    var CR = "\r".charCodeAt(0);
    var OPEN_SQUARE = "[".charCodeAt(0);
    var CLOSE_SQUARE = "]".charCodeAt(0);
    var OPEN_PARENTHESES = "(".charCodeAt(0);
    var CLOSE_PARENTHESES = ")".charCodeAt(0);
    var OPEN_CURLY = "{".charCodeAt(0);
    var CLOSE_CURLY = "}".charCodeAt(0);
    var SEMICOLON = ";".charCodeAt(0);
    var ASTERISK = "*".charCodeAt(0);
    var COLON = ":".charCodeAt(0);
    var AT = "@".charCodeAt(0);
    var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    var RE_BAD_BRACKET = /.[\n"'(/\\]/;
    var RE_HEX_ESCAPE = /[\da-f]/i;
    module2.exports = function tokenizer(input, options = {}) {
      let css = input.css.valueOf();
      let ignore = options.ignoreErrors;
      let code, next, quote, content, escape;
      let escaped, escapePos, prev, n, currentToken;
      let length = css.length;
      let pos = 0;
      let buffer = [];
      let returned = [];
      function position() {
        return pos;
      }
      function unclosed(what) {
        throw input.error("Unclosed " + what, pos);
      }
      function endOfFile() {
        return returned.length === 0 && pos >= length;
      }
      function nextToken(opts) {
        if (returned.length)
          return returned.pop();
        if (pos >= length)
          return;
        let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
        code = css.charCodeAt(pos);
        switch (code) {
          case NEWLINE:
          case SPACE:
          case TAB:
          case CR:
          case FEED: {
            next = pos;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
            currentToken = ["space", css.slice(pos, next)];
            pos = next - 1;
            break;
          }
          case OPEN_SQUARE:
          case CLOSE_SQUARE:
          case OPEN_CURLY:
          case CLOSE_CURLY:
          case COLON:
          case SEMICOLON:
          case CLOSE_PARENTHESES: {
            let controlChar = String.fromCharCode(code);
            currentToken = [controlChar, controlChar, pos];
            break;
          }
          case OPEN_PARENTHESES: {
            prev = buffer.length ? buffer.pop()[1] : "";
            n = css.charCodeAt(pos + 1);
            if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
              next = pos;
              do {
                escaped = false;
                next = css.indexOf(")", next + 1);
                if (next === -1) {
                  if (ignore || ignoreUnclosed) {
                    next = pos;
                    break;
                  } else {
                    unclosed("bracket");
                  }
                }
                escapePos = next;
                while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                  escapePos -= 1;
                  escaped = !escaped;
                }
              } while (escaped);
              currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              next = css.indexOf(")", pos + 1);
              content = css.slice(pos, next + 1);
              if (next === -1 || RE_BAD_BRACKET.test(content)) {
                currentToken = ["(", "(", pos];
              } else {
                currentToken = ["brackets", content, pos, next];
                pos = next;
              }
            }
            break;
          }
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE: {
            quote = code === SINGLE_QUOTE ? "'" : '"';
            next = pos;
            do {
              escaped = false;
              next = css.indexOf(quote, next + 1);
              if (next === -1) {
                if (ignore || ignoreUnclosed) {
                  next = pos + 1;
                  break;
                } else {
                  unclosed("string");
                }
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            currentToken = ["string", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case AT: {
            RE_AT_END.lastIndex = pos + 1;
            RE_AT_END.test(css);
            if (RE_AT_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_AT_END.lastIndex - 2;
            }
            currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case BACKSLASH: {
            next = pos;
            escape = true;
            while (css.charCodeAt(next + 1) === BACKSLASH) {
              next += 1;
              escape = !escape;
            }
            code = css.charCodeAt(next + 1);
            if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
              next += 1;
              if (RE_HEX_ESCAPE.test(css.charAt(next))) {
                while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                  next += 1;
                }
                if (css.charCodeAt(next + 1) === SPACE) {
                  next += 1;
                }
              }
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          default: {
            if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
              next = css.indexOf("*/", pos + 2) + 1;
              if (next === 0) {
                if (ignore || ignoreUnclosed) {
                  next = css.length;
                } else {
                  unclosed("comment");
                }
              }
              currentToken = ["comment", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else {
              RE_WORD_END.lastIndex = pos + 1;
              RE_WORD_END.test(css);
              if (RE_WORD_END.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_WORD_END.lastIndex - 2;
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              buffer.push(currentToken);
              pos = next;
            }
            break;
          }
        }
        pos++;
        return currentToken;
      }
      function back(token) {
        returned.push(token);
      }
      return {
        back,
        nextToken,
        endOfFile,
        position
      };
    };
  }
});

// node_modules/postcss/lib/terminal-highlight.js
var require_terminal_highlight = __commonJS({
  "node_modules/postcss/lib/terminal-highlight.js"(exports, module2) {
    "use strict";
    var pico = require_picocolors();
    var tokenizer = require_tokenize();
    var Input;
    function registerInput(dependant) {
      Input = dependant;
    }
    var HIGHLIGHT_THEME = {
      "brackets": pico.cyan,
      "at-word": pico.cyan,
      "comment": pico.gray,
      "string": pico.green,
      "class": pico.yellow,
      "hash": pico.magenta,
      "call": pico.cyan,
      "(": pico.cyan,
      ")": pico.cyan,
      "{": pico.yellow,
      "}": pico.yellow,
      "[": pico.yellow,
      "]": pico.yellow,
      ":": pico.yellow,
      ";": pico.yellow
    };
    function getTokenType([type, value], processor) {
      if (type === "word") {
        if (value[0] === ".") {
          return "class";
        }
        if (value[0] === "#") {
          return "hash";
        }
      }
      if (!processor.endOfFile()) {
        let next = processor.nextToken();
        processor.back(next);
        if (next[0] === "brackets" || next[0] === "(")
          return "call";
      }
      return type;
    }
    function terminalHighlight(css) {
      let processor = tokenizer(new Input(css), { ignoreErrors: true });
      let result = "";
      while (!processor.endOfFile()) {
        let token = processor.nextToken();
        let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
        if (color) {
          result += token[1].split(/\r?\n/).map((i) => color(i)).join("\n");
        } else {
          result += token[1];
        }
      }
      return result;
    }
    terminalHighlight.registerInput = registerInput;
    module2.exports = terminalHighlight;
  }
});

// node_modules/postcss/lib/css-syntax-error.js
var require_css_syntax_error = __commonJS({
  "node_modules/postcss/lib/css-syntax-error.js"(exports, module2) {
    "use strict";
    var pico = require_picocolors();
    var terminalHighlight = require_terminal_highlight();
    var CssSyntaxError = class extends Error {
      constructor(message, line, column, source, file, plugin) {
        super(message);
        this.name = "CssSyntaxError";
        this.reason = message;
        if (file) {
          this.file = file;
        }
        if (source) {
          this.source = source;
        }
        if (plugin) {
          this.plugin = plugin;
        }
        if (typeof line !== "undefined" && typeof column !== "undefined") {
          if (typeof line === "number") {
            this.line = line;
            this.column = column;
          } else {
            this.line = line.line;
            this.column = line.column;
            this.endLine = column.line;
            this.endColumn = column.column;
          }
        }
        this.setMessage();
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, CssSyntaxError);
        }
      }
      setMessage() {
        this.message = this.plugin ? this.plugin + ": " : "";
        this.message += this.file ? this.file : "<css input>";
        if (typeof this.line !== "undefined") {
          this.message += ":" + this.line + ":" + this.column;
        }
        this.message += ": " + this.reason;
      }
      showSourceCode(color) {
        if (!this.source)
          return "";
        let css = this.source;
        if (color == null)
          color = pico.isColorSupported;
        if (terminalHighlight) {
          if (color)
            css = terminalHighlight(css);
        }
        let lines = css.split(/\r?\n/);
        let start = Math.max(this.line - 3, 0);
        let end = Math.min(this.line + 2, lines.length);
        let maxWidth = String(end).length;
        let mark, aside;
        if (color) {
          let { bold, red, gray } = pico.createColors(true);
          mark = (text) => bold(red(text));
          aside = (text) => gray(text);
        } else {
          mark = aside = (str) => str;
        }
        return lines.slice(start, end).map((line, index) => {
          let number = start + 1 + index;
          let gutter = " " + (" " + number).slice(-maxWidth) + " | ";
          if (number === this.line) {
            let spacing = aside(gutter.replace(/\d/g, " ")) + line.slice(0, this.column - 1).replace(/[^\t]/g, " ");
            return mark(">") + aside(gutter) + line + "\n " + spacing + mark("^");
          }
          return " " + aside(gutter) + line;
        }).join("\n");
      }
      toString() {
        let code = this.showSourceCode();
        if (code) {
          code = "\n\n" + code + "\n";
        }
        return this.name + ": " + this.message + code;
      }
    };
    module2.exports = CssSyntaxError;
    CssSyntaxError.default = CssSyntaxError;
  }
});

// node_modules/postcss/lib/symbols.js
var require_symbols = __commonJS({
  "node_modules/postcss/lib/symbols.js"(exports, module2) {
    "use strict";
    module2.exports.isClean = Symbol("isClean");
    module2.exports.my = Symbol("my");
  }
});

// node_modules/postcss/lib/stringifier.js
var require_stringifier = __commonJS({
  "node_modules/postcss/lib/stringifier.js"(exports, module2) {
    "use strict";
    var DEFAULT_RAW = {
      colon: ": ",
      indent: "    ",
      beforeDecl: "\n",
      beforeRule: "\n",
      beforeOpen: " ",
      beforeClose: "\n",
      beforeComment: "\n",
      after: "\n",
      emptyBody: "",
      commentLeft: " ",
      commentRight: " ",
      semicolon: false
    };
    function capitalize(str) {
      return str[0].toUpperCase() + str.slice(1);
    }
    var Stringifier = class {
      constructor(builder) {
        this.builder = builder;
      }
      stringify(node, semicolon) {
        if (!this[node.type]) {
          throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
        }
        this[node.type](node, semicolon);
      }
      document(node) {
        this.body(node);
      }
      root(node) {
        this.body(node);
        if (node.raws.after)
          this.builder(node.raws.after);
      }
      comment(node) {
        let left = this.raw(node, "left", "commentLeft");
        let right = this.raw(node, "right", "commentRight");
        this.builder("/*" + left + node.text + right + "*/", node);
      }
      decl(node, semicolon) {
        let between = this.raw(node, "between", "colon");
        let string = node.prop + between + this.rawValue(node, "value");
        if (node.important) {
          string += node.raws.important || " !important";
        }
        if (semicolon)
          string += ";";
        this.builder(string, node);
      }
      rule(node) {
        this.block(node, this.rawValue(node, "selector"));
        if (node.raws.ownSemicolon) {
          this.builder(node.raws.ownSemicolon, node, "end");
        }
      }
      atrule(node, semicolon) {
        let name = "@" + node.name;
        let params = node.params ? this.rawValue(node, "params") : "";
        if (typeof node.raws.afterName !== "undefined") {
          name += node.raws.afterName;
        } else if (params) {
          name += " ";
        }
        if (node.nodes) {
          this.block(node, name + params);
        } else {
          let end = (node.raws.between || "") + (semicolon ? ";" : "");
          this.builder(name + params + end, node);
        }
      }
      body(node) {
        let last = node.nodes.length - 1;
        while (last > 0) {
          if (node.nodes[last].type !== "comment")
            break;
          last -= 1;
        }
        let semicolon = this.raw(node, "semicolon");
        for (let i = 0; i < node.nodes.length; i++) {
          let child = node.nodes[i];
          let before = this.raw(child, "before");
          if (before)
            this.builder(before);
          this.stringify(child, last !== i || semicolon);
        }
      }
      block(node, start) {
        let between = this.raw(node, "between", "beforeOpen");
        this.builder(start + between + "{", node, "start");
        let after;
        if (node.nodes && node.nodes.length) {
          this.body(node);
          after = this.raw(node, "after");
        } else {
          after = this.raw(node, "after", "emptyBody");
        }
        if (after)
          this.builder(after);
        this.builder("}", node, "end");
      }
      raw(node, own, detect) {
        let value;
        if (!detect)
          detect = own;
        if (own) {
          value = node.raws[own];
          if (typeof value !== "undefined")
            return value;
        }
        let parent = node.parent;
        if (detect === "before") {
          if (!parent || parent.type === "root" && parent.first === node) {
            return "";
          }
          if (parent && parent.type === "document") {
            return "";
          }
        }
        if (!parent)
          return DEFAULT_RAW[detect];
        let root = node.root();
        if (!root.rawCache)
          root.rawCache = {};
        if (typeof root.rawCache[detect] !== "undefined") {
          return root.rawCache[detect];
        }
        if (detect === "before" || detect === "after") {
          return this.beforeAfter(node, detect);
        } else {
          let method = "raw" + capitalize(detect);
          if (this[method]) {
            value = this[method](root, node);
          } else {
            root.walk((i) => {
              value = i.raws[own];
              if (typeof value !== "undefined")
                return false;
            });
          }
        }
        if (typeof value === "undefined")
          value = DEFAULT_RAW[detect];
        root.rawCache[detect] = value;
        return value;
      }
      rawSemicolon(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length && i.last.type === "decl") {
            value = i.raws.semicolon;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawEmptyBody(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length === 0) {
            value = i.raws.after;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawIndent(root) {
        if (root.raws.indent)
          return root.raws.indent;
        let value;
        root.walk((i) => {
          let p = i.parent;
          if (p && p !== root && p.parent && p.parent === root) {
            if (typeof i.raws.before !== "undefined") {
              let parts = i.raws.before.split("\n");
              value = parts[parts.length - 1];
              value = value.replace(/\S/g, "");
              return false;
            }
          }
        });
        return value;
      }
      rawBeforeComment(root, node) {
        let value;
        root.walkComments((i) => {
          if (typeof i.raws.before !== "undefined") {
            value = i.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node, null, "beforeDecl");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeDecl(root, node) {
        let value;
        root.walkDecls((i) => {
          if (typeof i.raws.before !== "undefined") {
            value = i.raws.before;
            if (value.includes("\n")) {
              value = value.replace(/[^\n]+$/, "");
            }
            return false;
          }
        });
        if (typeof value === "undefined") {
          value = this.raw(node, null, "beforeRule");
        } else if (value) {
          value = value.replace(/\S/g, "");
        }
        return value;
      }
      rawBeforeRule(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && (i.parent !== root || root.first !== i)) {
            if (typeof i.raws.before !== "undefined") {
              value = i.raws.before;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value)
          value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeClose(root) {
        let value;
        root.walk((i) => {
          if (i.nodes && i.nodes.length > 0) {
            if (typeof i.raws.after !== "undefined") {
              value = i.raws.after;
              if (value.includes("\n")) {
                value = value.replace(/[^\n]+$/, "");
              }
              return false;
            }
          }
        });
        if (value)
          value = value.replace(/\S/g, "");
        return value;
      }
      rawBeforeOpen(root) {
        let value;
        root.walk((i) => {
          if (i.type !== "decl") {
            value = i.raws.between;
            if (typeof value !== "undefined")
              return false;
          }
        });
        return value;
      }
      rawColon(root) {
        let value;
        root.walkDecls((i) => {
          if (typeof i.raws.between !== "undefined") {
            value = i.raws.between.replace(/[^\s:]/g, "");
            return false;
          }
        });
        return value;
      }
      beforeAfter(node, detect) {
        let value;
        if (node.type === "decl") {
          value = this.raw(node, null, "beforeDecl");
        } else if (node.type === "comment") {
          value = this.raw(node, null, "beforeComment");
        } else if (detect === "before") {
          value = this.raw(node, null, "beforeRule");
        } else {
          value = this.raw(node, null, "beforeClose");
        }
        let buf = node.parent;
        let depth = 0;
        while (buf && buf.type !== "root") {
          depth += 1;
          buf = buf.parent;
        }
        if (value.includes("\n")) {
          let indent = this.raw(node, null, "indent");
          if (indent.length) {
            for (let step = 0; step < depth; step++)
              value += indent;
          }
        }
        return value;
      }
      rawValue(node, prop) {
        let value = node[prop];
        let raw = node.raws[prop];
        if (raw && raw.value === value) {
          return raw.raw;
        }
        return value;
      }
    };
    module2.exports = Stringifier;
    Stringifier.default = Stringifier;
  }
});

// node_modules/postcss/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/postcss/lib/stringify.js"(exports, module2) {
    "use strict";
    var Stringifier = require_stringifier();
    function stringify(node, builder) {
      let str = new Stringifier(builder);
      str.stringify(node);
    }
    module2.exports = stringify;
    stringify.default = stringify;
  }
});

// node_modules/postcss/lib/node.js
var require_node = __commonJS({
  "node_modules/postcss/lib/node.js"(exports, module2) {
    "use strict";
    var { isClean, my } = require_symbols();
    var CssSyntaxError = require_css_syntax_error();
    var Stringifier = require_stringifier();
    var stringify = require_stringify();
    function cloneNode(obj, parent) {
      let cloned = new obj.constructor();
      for (let i in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, i)) {
          continue;
        }
        if (i === "proxyCache")
          continue;
        let value = obj[i];
        let type = typeof value;
        if (i === "parent" && type === "object") {
          if (parent)
            cloned[i] = parent;
        } else if (i === "source") {
          cloned[i] = value;
        } else if (Array.isArray(value)) {
          cloned[i] = value.map((j) => cloneNode(j, cloned));
        } else {
          if (type === "object" && value !== null)
            value = cloneNode(value);
          cloned[i] = value;
        }
      }
      return cloned;
    }
    var Node = class {
      constructor(defaults = {}) {
        this.raws = {};
        this[isClean] = false;
        this[my] = true;
        for (let name in defaults) {
          if (name === "nodes") {
            this.nodes = [];
            for (let node of defaults[name]) {
              if (typeof node.clone === "function") {
                this.append(node.clone());
              } else {
                this.append(node);
              }
            }
          } else {
            this[name] = defaults[name];
          }
        }
      }
      error(message, opts = {}) {
        if (this.source) {
          let { start, end } = this.rangeBy(opts);
          return this.source.input.error(message, { line: start.line, column: start.column }, { line: end.line, column: end.column }, opts);
        }
        return new CssSyntaxError(message);
      }
      warn(result, text, opts) {
        let data = { node: this };
        for (let i in opts)
          data[i] = opts[i];
        return result.warn(text, data);
      }
      remove() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.parent = void 0;
        return this;
      }
      toString(stringifier = stringify) {
        if (stringifier.stringify)
          stringifier = stringifier.stringify;
        let result = "";
        stringifier(this, (i) => {
          result += i;
        });
        return result;
      }
      assign(overrides = {}) {
        for (let name in overrides) {
          this[name] = overrides[name];
        }
        return this;
      }
      clone(overrides = {}) {
        let cloned = cloneNode(this);
        for (let name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
      cloneBefore(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertBefore(this, cloned);
        return cloned;
      }
      cloneAfter(overrides = {}) {
        let cloned = this.clone(overrides);
        this.parent.insertAfter(this, cloned);
        return cloned;
      }
      replaceWith(...nodes) {
        if (this.parent) {
          let bookmark = this;
          let foundSelf = false;
          for (let node of nodes) {
            if (node === this) {
              foundSelf = true;
            } else if (foundSelf) {
              this.parent.insertAfter(bookmark, node);
              bookmark = node;
            } else {
              this.parent.insertBefore(bookmark, node);
            }
          }
          if (!foundSelf) {
            this.remove();
          }
        }
        return this;
      }
      next() {
        if (!this.parent)
          return void 0;
        let index = this.parent.index(this);
        return this.parent.nodes[index + 1];
      }
      prev() {
        if (!this.parent)
          return void 0;
        let index = this.parent.index(this);
        return this.parent.nodes[index - 1];
      }
      before(add) {
        this.parent.insertBefore(this, add);
        return this;
      }
      after(add) {
        this.parent.insertAfter(this, add);
        return this;
      }
      root() {
        let result = this;
        while (result.parent && result.parent.type !== "document") {
          result = result.parent;
        }
        return result;
      }
      raw(prop, defaultType) {
        let str = new Stringifier();
        return str.raw(this, prop, defaultType);
      }
      cleanRaws(keepBetween) {
        delete this.raws.before;
        delete this.raws.after;
        if (!keepBetween)
          delete this.raws.between;
      }
      toJSON(_, inputs) {
        let fixed = {};
        let emitInputs = inputs == null;
        inputs = inputs || /* @__PURE__ */ new Map();
        let inputsNextIndex = 0;
        for (let name in this) {
          if (!Object.prototype.hasOwnProperty.call(this, name)) {
            continue;
          }
          if (name === "parent" || name === "proxyCache")
            continue;
          let value = this[name];
          if (Array.isArray(value)) {
            fixed[name] = value.map((i) => {
              if (typeof i === "object" && i.toJSON) {
                return i.toJSON(null, inputs);
              } else {
                return i;
              }
            });
          } else if (typeof value === "object" && value.toJSON) {
            fixed[name] = value.toJSON(null, inputs);
          } else if (name === "source") {
            let inputId = inputs.get(value.input);
            if (inputId == null) {
              inputId = inputsNextIndex;
              inputs.set(value.input, inputsNextIndex);
              inputsNextIndex++;
            }
            fixed[name] = {
              inputId,
              start: value.start,
              end: value.end
            };
          } else {
            fixed[name] = value;
          }
        }
        if (emitInputs) {
          fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
        }
        return fixed;
      }
      positionInside(index) {
        let string = this.toString();
        let column = this.source.start.column;
        let line = this.source.start.line;
        for (let i = 0; i < index; i++) {
          if (string[i] === "\n") {
            column = 1;
            line += 1;
          } else {
            column += 1;
          }
        }
        return { line, column };
      }
      positionBy(opts) {
        let pos = this.source.start;
        if (opts.index) {
          pos = this.positionInside(opts.index);
        } else if (opts.word) {
          let index = this.toString().indexOf(opts.word);
          if (index !== -1)
            pos = this.positionInside(index);
        }
        return pos;
      }
      rangeBy(opts) {
        let start = {
          line: this.source.start.line,
          column: this.source.start.column
        };
        let end = this.source.end ? {
          line: this.source.end.line,
          column: this.source.end.column + 1
        } : {
          line: start.line,
          column: start.column + 1
        };
        if (opts.word) {
          let index = this.toString().indexOf(opts.word);
          if (index !== -1) {
            start = this.positionInside(index);
            end = this.positionInside(index + opts.word.length);
          }
        } else {
          if (opts.start) {
            start = {
              line: opts.start.line,
              column: opts.start.column
            };
          } else if (opts.index) {
            start = this.positionInside(opts.index);
          }
          if (opts.end) {
            end = {
              line: opts.end.line,
              column: opts.end.column
            };
          } else if (opts.endIndex) {
            end = this.positionInside(opts.endIndex);
          } else if (opts.index) {
            end = this.positionInside(opts.index + 1);
          }
        }
        if (end.line < start.line || end.line === start.line && end.column <= start.column) {
          end = { line: start.line, column: start.column + 1 };
        }
        return { start, end };
      }
      getProxyProcessor() {
        return {
          set(node, prop, value) {
            if (node[prop] === value)
              return true;
            node[prop] = value;
            if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || prop === "text") {
              node.markDirty();
            }
            return true;
          },
          get(node, prop) {
            if (prop === "proxyOf") {
              return node;
            } else if (prop === "root") {
              return () => node.root().toProxy();
            } else {
              return node[prop];
            }
          }
        };
      }
      toProxy() {
        if (!this.proxyCache) {
          this.proxyCache = new Proxy(this, this.getProxyProcessor());
        }
        return this.proxyCache;
      }
      addToError(error) {
        error.postcssNode = this;
        if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
          let s = this.source;
          error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
        }
        return error;
      }
      markDirty() {
        if (this[isClean]) {
          this[isClean] = false;
          let next = this;
          while (next = next.parent) {
            next[isClean] = false;
          }
        }
      }
      get proxyOf() {
        return this;
      }
    };
    module2.exports = Node;
    Node.default = Node;
  }
});

// node_modules/postcss/lib/declaration.js
var require_declaration = __commonJS({
  "node_modules/postcss/lib/declaration.js"(exports, module2) {
    "use strict";
    var Node = require_node();
    var Declaration = class extends Node {
      constructor(defaults) {
        if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
          defaults = __spreadProps(__spreadValues({}, defaults), { value: String(defaults.value) });
        }
        super(defaults);
        this.type = "decl";
      }
      get variable() {
        return this.prop.startsWith("--") || this.prop[0] === "$";
      }
    };
    module2.exports = Declaration;
    Declaration.default = Declaration;
  }
});

// node_modules/source-map-js/lib/base64.js
var require_base64 = __commonJS({
  "node_modules/source-map-js/lib/base64.js"(exports) {
    var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    exports.encode = function(number) {
      if (0 <= number && number < intToCharMap.length) {
        return intToCharMap[number];
      }
      throw new TypeError("Must be between 0 and 63: " + number);
    };
    exports.decode = function(charCode) {
      var bigA = 65;
      var bigZ = 90;
      var littleA = 97;
      var littleZ = 122;
      var zero = 48;
      var nine = 57;
      var plus = 43;
      var slash = 47;
      var littleOffset = 26;
      var numberOffset = 52;
      if (bigA <= charCode && charCode <= bigZ) {
        return charCode - bigA;
      }
      if (littleA <= charCode && charCode <= littleZ) {
        return charCode - littleA + littleOffset;
      }
      if (zero <= charCode && charCode <= nine) {
        return charCode - zero + numberOffset;
      }
      if (charCode == plus) {
        return 62;
      }
      if (charCode == slash) {
        return 63;
      }
      return -1;
    };
  }
});

// node_modules/source-map-js/lib/base64-vlq.js
var require_base64_vlq = __commonJS({
  "node_modules/source-map-js/lib/base64-vlq.js"(exports) {
    var base64 = require_base64();
    var VLQ_BASE_SHIFT = 5;
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    function toVLQSigned(aValue) {
      return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
    }
    function fromVLQSigned(aValue) {
      var isNegative = (aValue & 1) === 1;
      var shifted = aValue >> 1;
      return isNegative ? -shifted : shifted;
    }
    exports.encode = function base64VLQ_encode(aValue) {
      var encoded = "";
      var digit;
      var vlq = toVLQSigned(aValue);
      do {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        if (vlq > 0) {
          digit |= VLQ_CONTINUATION_BIT;
        }
        encoded += base64.encode(digit);
      } while (vlq > 0);
      return encoded;
    };
    exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
      var strLen = aStr.length;
      var result = 0;
      var shift = 0;
      var continuation, digit;
      do {
        if (aIndex >= strLen) {
          throw new Error("Expected more digits in base 64 VLQ value.");
        }
        digit = base64.decode(aStr.charCodeAt(aIndex++));
        if (digit === -1) {
          throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
        }
        continuation = !!(digit & VLQ_CONTINUATION_BIT);
        digit &= VLQ_BASE_MASK;
        result = result + (digit << shift);
        shift += VLQ_BASE_SHIFT;
      } while (continuation);
      aOutParam.value = fromVLQSigned(result);
      aOutParam.rest = aIndex;
    };
  }
});

// node_modules/source-map-js/lib/util.js
var require_util = __commonJS({
  "node_modules/source-map-js/lib/util.js"(exports) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url = "";
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ":";
      }
      url += "//";
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    var MAX_CACHED_INPUTS = 32;
    function lruMemoize(f) {
      var cache = [];
      return function(input) {
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].input === input) {
            var temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
        var result = f(input);
        cache.unshift({
          input,
          result
        });
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
        return result;
      };
    }
    var normalize = lruMemoize(function normalize2(aPath) {
      var path = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      var isAbsolute = exports.isAbsolute(path);
      var parts = [];
      var start = 0;
      var i = 0;
      while (true) {
        start = i;
        i = path.indexOf("/", start);
        if (i === -1) {
          parts.push(path.slice(start));
          break;
        } else {
          parts.push(path.slice(start, i));
          while (i < path.length && path[i] === "/") {
            i++;
          }
        }
      }
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === ".") {
          parts.splice(i, 1);
        } else if (part === "..") {
          up++;
        } else if (up > 0) {
          if (part === "") {
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    });
    exports.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    exports.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    var supportsNullProto = function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    }();
    function identity(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      var length = s.length;
      if (length < 9) {
        return false;
      }
      if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (var i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
      var cmp;
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
  }
});

// node_modules/source-map-js/lib/array-set.js
var require_array_set = __commonJS({
  "node_modules/source-map-js/lib/array-set.js"(exports) {
    var util = require_util();
    var has = Object.prototype.hasOwnProperty;
    var hasNativeMap = typeof Map !== "undefined";
    function ArraySet() {
      this._array = [];
      this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
    }
    ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
      var set = new ArraySet();
      for (var i = 0, len = aArray.length; i < len; i++) {
        set.add(aArray[i], aAllowDuplicates);
      }
      return set;
    };
    ArraySet.prototype.size = function ArraySet_size() {
      return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
      var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
      var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
      var idx = this._array.length;
      if (!isDuplicate || aAllowDuplicates) {
        this._array.push(aStr);
      }
      if (!isDuplicate) {
        if (hasNativeMap) {
          this._set.set(aStr, idx);
        } else {
          this._set[sStr] = idx;
        }
      }
    };
    ArraySet.prototype.has = function ArraySet_has(aStr) {
      if (hasNativeMap) {
        return this._set.has(aStr);
      } else {
        var sStr = util.toSetString(aStr);
        return has.call(this._set, sStr);
      }
    };
    ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
      if (hasNativeMap) {
        var idx = this._set.get(aStr);
        if (idx >= 0) {
          return idx;
        }
      } else {
        var sStr = util.toSetString(aStr);
        if (has.call(this._set, sStr)) {
          return this._set[sStr];
        }
      }
      throw new Error('"' + aStr + '" is not in the set.');
    };
    ArraySet.prototype.at = function ArraySet_at(aIdx) {
      if (aIdx >= 0 && aIdx < this._array.length) {
        return this._array[aIdx];
      }
      throw new Error("No element indexed by " + aIdx);
    };
    ArraySet.prototype.toArray = function ArraySet_toArray() {
      return this._array.slice();
    };
    exports.ArraySet = ArraySet;
  }
});

// node_modules/source-map-js/lib/mapping-list.js
var require_mapping_list = __commonJS({
  "node_modules/source-map-js/lib/mapping-list.js"(exports) {
    var util = require_util();
    function generatedPositionAfter(mappingA, mappingB) {
      var lineA = mappingA.generatedLine;
      var lineB = mappingB.generatedLine;
      var columnA = mappingA.generatedColumn;
      var columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    function MappingList() {
      this._array = [];
      this._sorted = true;
      this._last = { generatedLine: -1, generatedColumn: 0 };
    }
    MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };
    MappingList.prototype.add = function MappingList_add(aMapping) {
      if (generatedPositionAfter(this._last, aMapping)) {
        this._last = aMapping;
        this._array.push(aMapping);
      } else {
        this._sorted = false;
        this._array.push(aMapping);
      }
    };
    MappingList.prototype.toArray = function MappingList_toArray() {
      if (!this._sorted) {
        this._array.sort(util.compareByGeneratedPositionsInflated);
        this._sorted = true;
      }
      return this._array;
    };
    exports.MappingList = MappingList;
  }
});

// node_modules/source-map-js/lib/source-map-generator.js
var require_source_map_generator = __commonJS({
  "node_modules/source-map-js/lib/source-map-generator.js"(exports) {
    var base64VLQ = require_base64_vlq();
    var util = require_util();
    var ArraySet = require_array_set().ArraySet;
    var MappingList = require_mapping_list().MappingList;
    function SourceMapGenerator(aArgs) {
      if (!aArgs) {
        aArgs = {};
      }
      this._file = util.getArg(aArgs, "file", null);
      this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
      this._skipValidation = util.getArg(aArgs, "skipValidation", false);
      this._sources = new ArraySet();
      this._names = new ArraySet();
      this._mappings = new MappingList();
      this._sourcesContents = null;
    }
    SourceMapGenerator.prototype._version = 3;
    SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot
      });
      aSourceMapConsumer.eachMapping(function(mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };
        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }
          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };
          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }
        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var sourceRelative = sourceFile;
        if (sourceRoot !== null) {
          sourceRelative = util.relative(sourceRoot, sourceFile);
        }
        if (!generator._sources.has(sourceRelative)) {
          generator._sources.add(sourceRelative);
        }
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };
    SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, "generated");
      var original = util.getArg(aArgs, "original", null);
      var source = util.getArg(aArgs, "source", null);
      var name = util.getArg(aArgs, "name", null);
      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name);
      }
      if (source != null) {
        source = String(source);
        if (!this._sources.has(source)) {
          this._sources.add(source);
        }
      }
      if (name != null) {
        name = String(name);
        if (!this._names.has(name)) {
          this._names.add(name);
        }
      }
      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source,
        name
      });
    };
    SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }
      if (aSourceContent != null) {
        if (!this._sourcesContents) {
          this._sourcesContents = /* @__PURE__ */ Object.create(null);
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };
    SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      var newSources = new ArraySet();
      var newNames = new ArraySet();
      this._mappings.unsortedForEach(function(mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source);
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }
        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }
        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }
      }, this);
      this._sources = newSources;
      this._names = newNames;
      aSourceMapConsumer.sources.forEach(function(sourceFile2) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile2 = util.join(aSourceMapPath, sourceFile2);
          }
          if (sourceRoot != null) {
            sourceFile2 = util.relative(sourceRoot, sourceFile2);
          }
          this.setSourceContent(sourceFile2, content);
        }
      }, this);
    };
    SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
      if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
        throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
      }
      if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
        return;
      } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
        return;
      } else {
        throw new Error("Invalid mapping: " + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };
    SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = "";
      var next;
      var mapping;
      var nameIdx;
      var sourceIdx;
      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];
        next = "";
        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            next += ";";
            previousGeneratedLine++;
          }
        } else {
          if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            next += ",";
          }
        }
        next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;
        if (mapping.source != null) {
          sourceIdx = this._sources.indexOf(mapping.source);
          next += base64VLQ.encode(sourceIdx - previousSource);
          previousSource = sourceIdx;
          next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;
          next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;
          if (mapping.name != null) {
            nameIdx = this._names.indexOf(mapping.name);
            next += base64VLQ.encode(nameIdx - previousName);
            previousName = nameIdx;
          }
        }
        result += next;
      }
      return result;
    };
    SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function(source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
      }, this);
    };
    SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }
      return map;
    };
    SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };
    exports.SourceMapGenerator = SourceMapGenerator;
  }
});

// node_modules/source-map-js/lib/binary-search.js
var require_binary_search = __commonJS({
  "node_modules/source-map-js/lib/binary-search.js"(exports) {
    exports.GREATEST_LOWER_BOUND = 1;
    exports.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow;
      var cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        } else {
          return mid;
        }
      } else {
        if (mid - aLow > 1) {
          return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return mid;
        } else {
          return aLow < 0 ? -1 : aLow;
        }
      }
    }
    exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  }
});

// node_modules/source-map-js/lib/quick-sort.js
var require_quick_sort = __commonJS({
  "node_modules/source-map-js/lib/quick-sort.js"(exports) {
    function SortTemplate(comparator) {
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }
      function randomIntInRange(low, high) {
        return Math.round(low + Math.random() * (high - low));
      }
      function doQuickSort(ary, comparator2, p, r) {
        if (p < r) {
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;
          swap(ary, pivotIndex, r);
          var pivot = ary[r];
          for (var j = p; j < r; j++) {
            if (comparator2(ary[j], pivot, false) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }
          swap(ary, i + 1, j);
          var q = i + 1;
          doQuickSort(ary, comparator2, p, q - 1);
          doQuickSort(ary, comparator2, q + 1, r);
        }
      }
      return doQuickSort;
    }
    function cloneSort(comparator) {
      let template = SortTemplate.toString();
      let templateFn = new Function(`return ${template}`)();
      return templateFn(comparator);
    }
    var sortCache = /* @__PURE__ */ new WeakMap();
    exports.quickSort = function(ary, comparator, start = 0) {
      let doQuickSort = sortCache.get(comparator);
      if (doQuickSort === void 0) {
        doQuickSort = cloneSort(comparator);
        sortCache.set(comparator, doQuickSort);
      }
      doQuickSort(ary, comparator, start, ary.length - 1);
    };
  }
});

// node_modules/source-map-js/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS({
  "node_modules/source-map-js/lib/source-map-consumer.js"(exports) {
    var util = require_util();
    var binarySearch = require_binary_search();
    var ArraySet = require_array_set().ArraySet;
    var base64VLQ = require_base64_vlq();
    var quickSort = require_quick_sort().quickSort;
    function SourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
    }
    SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
      return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
    };
    SourceMapConsumer.prototype._version = 3;
    SourceMapConsumer.prototype.__generatedMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
      configurable: true,
      enumerable: true,
      get: function() {
        if (!this.__generatedMappings) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__generatedMappings;
      }
    });
    SourceMapConsumer.prototype.__originalMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
      configurable: true,
      enumerable: true,
      get: function() {
        if (!this.__originalMappings) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__originalMappings;
      }
    });
    SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };
    SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };
    SourceMapConsumer.GENERATED_ORDER = 1;
    SourceMapConsumer.ORIGINAL_ORDER = 2;
    SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
    SourceMapConsumer.LEAST_UPPER_BOUND = 2;
    SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
      var mappings;
      switch (order) {
        case SourceMapConsumer.GENERATED_ORDER:
          mappings = this._generatedMappings;
          break;
        case SourceMapConsumer.ORIGINAL_ORDER:
          mappings = this._originalMappings;
          break;
        default:
          throw new Error("Unknown order of iteration.");
      }
      var sourceRoot = this.sourceRoot;
      var boundCallback = aCallback.bind(context);
      var names = this._names;
      var sources = this._sources;
      var sourceMapURL = this._sourceMapURL;
      for (var i = 0, n = mappings.length; i < n; i++) {
        var mapping = mappings[i];
        var source = mapping.source === null ? null : sources.at(mapping.source);
        source = util.computeSourceURL(sourceRoot, source, sourceMapURL);
        boundCallback({
          source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : names.at(mapping.name)
        });
      }
    };
    SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
      var line = util.getArg(aArgs, "line");
      var needle = {
        source: util.getArg(aArgs, "source"),
        originalLine: line,
        originalColumn: util.getArg(aArgs, "column", 0)
      };
      needle.source = this._findSourceIndex(needle.source);
      if (needle.source < 0) {
        return [];
      }
      var mappings = [];
      var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (aArgs.column === void 0) {
          var originalLine = mapping.originalLine;
          while (mapping && mapping.originalLine === originalLine) {
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            });
            mapping = this._originalMappings[++index];
          }
        } else {
          var originalColumn = mapping.originalColumn;
          while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            });
            mapping = this._originalMappings[++index];
          }
        }
      }
      return mappings;
    };
    exports.SourceMapConsumer = SourceMapConsumer;
    function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      var version = util.getArg(sourceMap, "version");
      var sources = util.getArg(sourceMap, "sources");
      var names = util.getArg(sourceMap, "names", []);
      var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
      var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
      var mappings = util.getArg(sourceMap, "mappings");
      var file = util.getArg(sourceMap, "file", null);
      if (version != this._version) {
        throw new Error("Unsupported version: " + version);
      }
      if (sourceRoot) {
        sourceRoot = util.normalize(sourceRoot);
      }
      sources = sources.map(String).map(util.normalize).map(function(source) {
        return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
      });
      this._names = ArraySet.fromArray(names.map(String), true);
      this._sources = ArraySet.fromArray(sources, true);
      this._absoluteSources = this._sources.toArray().map(function(s) {
        return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
      });
      this.sourceRoot = sourceRoot;
      this.sourcesContent = sourcesContent;
      this._mappings = mappings;
      this._sourceMapURL = aSourceMapURL;
      this.file = file;
    }
    BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
    BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
      var relativeSource = aSource;
      if (this.sourceRoot != null) {
        relativeSource = util.relative(this.sourceRoot, relativeSource);
      }
      if (this._sources.has(relativeSource)) {
        return this._sources.indexOf(relativeSource);
      }
      var i;
      for (i = 0; i < this._absoluteSources.length; ++i) {
        if (this._absoluteSources[i] == aSource) {
          return i;
        }
      }
      return -1;
    };
    BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
      var smc = Object.create(BasicSourceMapConsumer.prototype);
      var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
      smc.file = aSourceMap._file;
      smc._sourceMapURL = aSourceMapURL;
      smc._absoluteSources = smc._sources.toArray().map(function(s) {
        return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
      });
      var generatedMappings = aSourceMap._mappings.toArray().slice();
      var destGeneratedMappings = smc.__generatedMappings = [];
      var destOriginalMappings = smc.__originalMappings = [];
      for (var i = 0, length = generatedMappings.length; i < length; i++) {
        var srcMapping = generatedMappings[i];
        var destMapping = new Mapping();
        destMapping.generatedLine = srcMapping.generatedLine;
        destMapping.generatedColumn = srcMapping.generatedColumn;
        if (srcMapping.source) {
          destMapping.source = sources.indexOf(srcMapping.source);
          destMapping.originalLine = srcMapping.originalLine;
          destMapping.originalColumn = srcMapping.originalColumn;
          if (srcMapping.name) {
            destMapping.name = names.indexOf(srcMapping.name);
          }
          destOriginalMappings.push(destMapping);
        }
        destGeneratedMappings.push(destMapping);
      }
      quickSort(smc.__originalMappings, util.compareByOriginalPositions);
      return smc;
    };
    BasicSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
      get: function() {
        return this._absoluteSources.slice();
      }
    });
    function Mapping() {
      this.generatedLine = 0;
      this.generatedColumn = 0;
      this.source = null;
      this.originalLine = null;
      this.originalColumn = null;
      this.name = null;
    }
    var compareGenerated = util.compareByGeneratedPositionsDeflatedNoLine;
    function sortGenerated(array, start) {
      let l = array.length;
      let n = array.length - start;
      if (n <= 1) {
        return;
      } else if (n == 2) {
        let a = array[start];
        let b = array[start + 1];
        if (compareGenerated(a, b) > 0) {
          array[start] = b;
          array[start + 1] = a;
        }
      } else if (n < 20) {
        for (let i = start; i < l; i++) {
          for (let j = i; j > start; j--) {
            let a = array[j - 1];
            let b = array[j];
            if (compareGenerated(a, b) <= 0) {
              break;
            }
            array[j - 1] = b;
            array[j] = a;
          }
        }
      } else {
        quickSort(array, compareGenerated, start);
      }
    }
    BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var length = aStr.length;
      var index = 0;
      var cachedSegments = {};
      var temp = {};
      var originalMappings = [];
      var generatedMappings = [];
      var mapping, str, segment, end, value;
      let subarrayStart = 0;
      while (index < length) {
        if (aStr.charAt(index) === ";") {
          generatedLine++;
          index++;
          previousGeneratedColumn = 0;
          sortGenerated(generatedMappings, subarrayStart);
          subarrayStart = generatedMappings.length;
        } else if (aStr.charAt(index) === ",") {
          index++;
        } else {
          mapping = new Mapping();
          mapping.generatedLine = generatedLine;
          for (end = index; end < length; end++) {
            if (this._charIsMappingSeparator(aStr, end)) {
              break;
            }
          }
          str = aStr.slice(index, end);
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          mapping.generatedColumn = previousGeneratedColumn + segment[0];
          previousGeneratedColumn = mapping.generatedColumn;
          if (segment.length > 1) {
            mapping.source = previousSource + segment[1];
            previousSource += segment[1];
            mapping.originalLine = previousOriginalLine + segment[2];
            previousOriginalLine = mapping.originalLine;
            mapping.originalLine += 1;
            mapping.originalColumn = previousOriginalColumn + segment[3];
            previousOriginalColumn = mapping.originalColumn;
            if (segment.length > 4) {
              mapping.name = previousName + segment[4];
              previousName += segment[4];
            }
          }
          generatedMappings.push(mapping);
          if (typeof mapping.originalLine === "number") {
            let currentSource = mapping.source;
            while (originalMappings.length <= currentSource) {
              originalMappings.push(null);
            }
            if (originalMappings[currentSource] === null) {
              originalMappings[currentSource] = [];
            }
            originalMappings[currentSource].push(mapping);
          }
        }
      }
      sortGenerated(generatedMappings, subarrayStart);
      this.__generatedMappings = generatedMappings;
      for (var i = 0; i < originalMappings.length; i++) {
        if (originalMappings[i] != null) {
          quickSort(originalMappings[i], util.compareByOriginalPositionsNoSource);
        }
      }
      this.__originalMappings = [].concat(...originalMappings);
    };
    BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
      if (aNeedle[aLineName] <= 0) {
        throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
      }
      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };
    BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];
          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }
        mapping.lastGeneratedColumn = Infinity;
      }
    };
    BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      };
      var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util.compareByGeneratedPositionsDeflated, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
      if (index >= 0) {
        var mapping = this._generatedMappings[index];
        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, "source", null);
          if (source !== null) {
            source = this._sources.at(source);
            source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
          }
          var name = util.getArg(mapping, "name", null);
          if (name !== null) {
            name = this._names.at(name);
          }
          return {
            source,
            line: util.getArg(mapping, "originalLine", null),
            column: util.getArg(mapping, "originalColumn", null),
            name
          };
        }
      }
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };
    BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
      if (!this.sourcesContent) {
        return false;
      }
      return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
        return sc == null;
      });
    };
    BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      if (!this.sourcesContent) {
        return null;
      }
      var index = this._findSourceIndex(aSource);
      if (index >= 0) {
        return this.sourcesContent[index];
      }
      var relativeSource = aSource;
      if (this.sourceRoot != null) {
        relativeSource = util.relative(this.sourceRoot, relativeSource);
      }
      var url;
      if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
        var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
        if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
        }
        if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
        }
      }
      if (nullOnMissing) {
        return null;
      } else {
        throw new Error('"' + relativeSource + '" is not in the SourceMap.');
      }
    };
    BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
      var source = util.getArg(aArgs, "source");
      source = this._findSourceIndex(source);
      if (source < 0) {
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }
      var needle = {
        source,
        originalLine: util.getArg(aArgs, "line"),
        originalColumn: util.getArg(aArgs, "column")
      };
      var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util.compareByOriginalPositions, util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (mapping.source === needle.source) {
          return {
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          };
        }
      }
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };
    exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
    function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      var version = util.getArg(sourceMap, "version");
      var sections = util.getArg(sourceMap, "sections");
      if (version != this._version) {
        throw new Error("Unsupported version: " + version);
      }
      this._sources = new ArraySet();
      this._names = new ArraySet();
      var lastOffset = {
        line: -1,
        column: 0
      };
      this._sections = sections.map(function(s) {
        if (s.url) {
          throw new Error("Support for url field in sections not implemented.");
        }
        var offset = util.getArg(s, "offset");
        var offsetLine = util.getArg(offset, "line");
        var offsetColumn = util.getArg(offset, "column");
        if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
          throw new Error("Section offsets must be ordered and non-overlapping.");
        }
        lastOffset = offset;
        return {
          generatedOffset: {
            generatedLine: offsetLine + 1,
            generatedColumn: offsetColumn + 1
          },
          consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
        };
      });
    }
    IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    IndexedSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
      get: function() {
        var sources = [];
        for (var i = 0; i < this._sections.length; i++) {
          for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
            sources.push(this._sections[i].consumer.sources[j]);
          }
        }
        return sources;
      }
    });
    IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      };
      var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
        var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }
        return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
      });
      var section = this._sections[sectionIndex];
      if (!section) {
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }
      return section.consumer.originalPositionFor({
        line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
        bias: aArgs.bias
      });
    };
    IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
      return this._sections.every(function(s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };
    IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var content = section.consumer.sourceContentFor(aSource, true);
        if (content) {
          return content;
        }
      }
      if (nullOnMissing) {
        return null;
      } else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };
    IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
          continue;
        }
        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
        if (generatedPosition) {
          var ret = {
            line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
            column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
          };
          return ret;
        }
      }
      return {
        line: null,
        column: null
      };
    };
    IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      this.__generatedMappings = [];
      this.__originalMappings = [];
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var sectionMappings = section.consumer._generatedMappings;
        for (var j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[j];
          var source = section.consumer._sources.at(mapping.source);
          source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
          this._sources.add(source);
          source = this._sources.indexOf(source);
          var name = null;
          if (mapping.name) {
            name = section.consumer._names.at(mapping.name);
            this._names.add(name);
            name = this._names.indexOf(name);
          }
          var adjustedMapping = {
            source,
            generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name
          };
          this.__generatedMappings.push(adjustedMapping);
          if (typeof adjustedMapping.originalLine === "number") {
            this.__originalMappings.push(adjustedMapping);
          }
        }
      }
      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
      quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };
    exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  }
});

// node_modules/source-map-js/lib/source-node.js
var require_source_node = __commonJS({
  "node_modules/source-map-js/lib/source-node.js"(exports) {
    var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    var util = require_util();
    var REGEX_NEWLINE = /(\r?\n)/;
    var NEWLINE_CODE = 10;
    var isSourceNode = "$$$isSourceNode$$$";
    function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
      this.children = [];
      this.sourceContents = {};
      this.line = aLine == null ? null : aLine;
      this.column = aColumn == null ? null : aColumn;
      this.source = aSource == null ? null : aSource;
      this.name = aName == null ? null : aName;
      this[isSourceNode] = true;
      if (aChunks != null)
        this.add(aChunks);
    }
    SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      var node = new SourceNode();
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var remainingLinesIndex = 0;
      var shiftNextLine = function() {
        var lineContents = getNextLine();
        var newLine = getNextLine() || "";
        return lineContents + newLine;
        function getNextLine() {
          return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
        }
      };
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;
      var lastMapping = null;
      aSourceMapConsumer.eachMapping(function(mapping) {
        if (lastMapping !== null) {
          if (lastGeneratedLine < mapping.generatedLine) {
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
          } else {
            var nextLine = remainingLines[remainingLinesIndex] || "";
            var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            lastMapping = mapping;
            return;
          }
        }
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      if (remainingLinesIndex < remainingLines.length) {
        if (lastMapping) {
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        node.add(remainingLines.splice(remainingLinesIndex).join(""));
      }
      aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });
      return node;
      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === void 0) {
          node.add(code);
        } else {
          var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
          node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
        }
      }
    };
    SourceNode.prototype.add = function SourceNode_add(aChunk) {
      if (Array.isArray(aChunk)) {
        aChunk.forEach(function(chunk) {
          this.add(chunk);
        }, this);
      } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
        if (aChunk) {
          this.children.push(aChunk);
        }
      } else {
        throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
      }
      return this;
    };
    SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
      if (Array.isArray(aChunk)) {
        for (var i = aChunk.length - 1; i >= 0; i--) {
          this.prepend(aChunk[i]);
        }
      } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
        this.children.unshift(aChunk);
      } else {
        throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
      }
      return this;
    };
    SourceNode.prototype.walk = function SourceNode_walk(aFn) {
      var chunk;
      for (var i = 0, len = this.children.length; i < len; i++) {
        chunk = this.children[i];
        if (chunk[isSourceNode]) {
          chunk.walk(aFn);
        } else {
          if (chunk !== "") {
            aFn(chunk, {
              source: this.source,
              line: this.line,
              column: this.column,
              name: this.name
            });
          }
        }
      }
    };
    SourceNode.prototype.join = function SourceNode_join(aSep) {
      var newChildren;
      var i;
      var len = this.children.length;
      if (len > 0) {
        newChildren = [];
        for (i = 0; i < len - 1; i++) {
          newChildren.push(this.children[i]);
          newChildren.push(aSep);
        }
        newChildren.push(this.children[i]);
        this.children = newChildren;
      }
      return this;
    };
    SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
      var lastChild = this.children[this.children.length - 1];
      if (lastChild[isSourceNode]) {
        lastChild.replaceRight(aPattern, aReplacement);
      } else if (typeof lastChild === "string") {
        this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
      } else {
        this.children.push("".replace(aPattern, aReplacement));
      }
      return this;
    };
    SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };
    SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i][isSourceNode]) {
          this.children[i].walkSourceContents(aFn);
        }
      }
      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };
    SourceNode.prototype.toString = function SourceNode_toString() {
      var str = "";
      this.walk(function(chunk) {
        str += chunk;
      });
      return str;
    };
    SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
      var generated = {
        code: "",
        line: 1,
        column: 0
      };
      var map = new SourceMapGenerator(aArgs);
      var sourceMappingActive = false;
      var lastOriginalSource = null;
      var lastOriginalLine = null;
      var lastOriginalColumn = null;
      var lastOriginalName = null;
      this.walk(function(chunk, original) {
        generated.code += chunk;
        if (original.source !== null && original.line !== null && original.column !== null) {
          if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
          lastOriginalSource = original.source;
          lastOriginalLine = original.line;
          lastOriginalColumn = original.column;
          lastOriginalName = original.name;
          sourceMappingActive = true;
        } else if (sourceMappingActive) {
          map.addMapping({
            generated: {
              line: generated.line,
              column: generated.column
            }
          });
          lastOriginalSource = null;
          sourceMappingActive = false;
        }
        for (var idx = 0, length = chunk.length; idx < length; idx++) {
          if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
            generated.line++;
            generated.column = 0;
            if (idx + 1 === length) {
              lastOriginalSource = null;
              sourceMappingActive = false;
            } else if (sourceMappingActive) {
              map.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
          } else {
            generated.column++;
          }
        }
      });
      this.walkSourceContents(function(sourceFile, sourceContent) {
        map.setSourceContent(sourceFile, sourceContent);
      });
      return { code: generated.code, map };
    };
    exports.SourceNode = SourceNode;
  }
});

// node_modules/source-map-js/source-map.js
var require_source_map = __commonJS({
  "node_modules/source-map-js/source-map.js"(exports) {
    exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
    exports.SourceNode = require_source_node().SourceNode;
  }
});

// node_modules/nanoid/non-secure/index.cjs
var require_non_secure = __commonJS({
  "node_modules/nanoid/non-secure/index.cjs"(exports, module2) {
    var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    var customAlphabet = (alphabet, defaultSize = 21) => {
      return (size = defaultSize) => {
        let id = "";
        let i = size;
        while (i--) {
          id += alphabet[Math.random() * alphabet.length | 0];
        }
        return id;
      };
    };
    var nanoid = (size = 21) => {
      let id = "";
      let i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    module2.exports = { nanoid, customAlphabet };
  }
});

// node_modules/postcss/lib/previous-map.js
var require_previous_map = __commonJS({
  "node_modules/postcss/lib/previous-map.js"(exports, module2) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { existsSync, readFileSync } = require("fs");
    var { dirname, join } = require("path");
    function fromBase64(str) {
      if (Buffer) {
        return Buffer.from(str, "base64").toString();
      } else {
        return window.atob(str);
      }
    }
    var PreviousMap = class {
      constructor(css, opts) {
        if (opts.map === false)
          return;
        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, "data:");
        let prev = opts.map ? opts.map.prev : void 0;
        let text = this.loadMap(opts.from, prev);
        if (!this.mapFile && opts.from) {
          this.mapFile = opts.from;
        }
        if (this.mapFile)
          this.root = dirname(this.mapFile);
        if (text)
          this.text = text;
      }
      consumer() {
        if (!this.consumerCache) {
          this.consumerCache = new SourceMapConsumer(this.text);
        }
        return this.consumerCache;
      }
      withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
      startWith(string, start) {
        if (!string)
          return false;
        return string.substr(0, start.length) === start;
      }
      getAnnotationURL(sourceMapString) {
        return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      loadAnnotation(css) {
        let comments = css.match(/\/\*\s*# sourceMappingURL=/gm);
        if (!comments)
          return;
        let start = css.lastIndexOf(comments.pop());
        let end = css.indexOf("*/", start);
        if (start > -1 && end > -1) {
          this.annotation = this.getAnnotationURL(css.substring(start, end));
        }
      }
      decodeInline(text) {
        let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
        let baseUri = /^data:application\/json;base64,/;
        let charsetUri = /^data:application\/json;charset=utf-?8,/;
        let uri = /^data:application\/json,/;
        if (charsetUri.test(text) || uri.test(text)) {
          return decodeURIComponent(text.substr(RegExp.lastMatch.length));
        }
        if (baseCharsetUri.test(text) || baseUri.test(text)) {
          return fromBase64(text.substr(RegExp.lastMatch.length));
        }
        let encoding = text.match(/data:application\/json;([^,]+),/)[1];
        throw new Error("Unsupported source map encoding " + encoding);
      }
      loadFile(path) {
        this.root = dirname(path);
        if (existsSync(path)) {
          this.mapFile = path;
          return readFileSync(path, "utf-8").toString().trim();
        }
      }
      loadMap(file, prev) {
        if (prev === false)
          return false;
        if (prev) {
          if (typeof prev === "string") {
            return prev;
          } else if (typeof prev === "function") {
            let prevPath = prev(file);
            if (prevPath) {
              let map = this.loadFile(prevPath);
              if (!map) {
                throw new Error("Unable to load previous source map: " + prevPath.toString());
              }
              return map;
            }
          } else if (prev instanceof SourceMapConsumer) {
            return SourceMapGenerator.fromSourceMap(prev).toString();
          } else if (prev instanceof SourceMapGenerator) {
            return prev.toString();
          } else if (this.isMap(prev)) {
            return JSON.stringify(prev);
          } else {
            throw new Error("Unsupported previous source map format: " + prev.toString());
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          let map = this.annotation;
          if (file)
            map = join(dirname(file), map);
          return this.loadFile(map);
        }
      }
      isMap(map) {
        if (typeof map !== "object")
          return false;
        return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
      }
    };
    module2.exports = PreviousMap;
    PreviousMap.default = PreviousMap;
  }
});

// node_modules/postcss/lib/input.js
var require_input = __commonJS({
  "node_modules/postcss/lib/input.js"(exports, module2) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { fileURLToPath, pathToFileURL } = require("url");
    var { resolve, isAbsolute } = require("path");
    var { nanoid } = require_non_secure();
    var terminalHighlight = require_terminal_highlight();
    var CssSyntaxError = require_css_syntax_error();
    var PreviousMap = require_previous_map();
    var fromOffsetCache = Symbol("fromOffsetCache");
    var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    var pathAvailable = Boolean(resolve && isAbsolute);
    var Input = class {
      constructor(css, opts = {}) {
        if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
          throw new Error(`PostCSS received ${css} instead of CSS string`);
        }
        this.css = css.toString();
        if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
          this.hasBOM = true;
          this.css = this.css.slice(1);
        } else {
          this.hasBOM = false;
        }
        if (opts.from) {
          if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve(opts.from);
          }
        }
        if (pathAvailable && sourceMapAvailable) {
          let map = new PreviousMap(this.css, opts);
          if (map.text) {
            this.map = map;
            let file = map.consumer().file;
            if (!this.file && file)
              this.file = this.mapResolve(file);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid(6) + ">";
        }
        if (this.map)
          this.map.file = this.from;
      }
      fromOffset(offset) {
        let lastLine, lineToIndex;
        if (!this[fromOffsetCache]) {
          let lines = this.css.split("\n");
          lineToIndex = new Array(lines.length);
          let prevIndex = 0;
          for (let i = 0, l = lines.length; i < l; i++) {
            lineToIndex[i] = prevIndex;
            prevIndex += lines[i].length + 1;
          }
          this[fromOffsetCache] = lineToIndex;
        } else {
          lineToIndex = this[fromOffsetCache];
        }
        lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
          min = lineToIndex.length - 1;
        } else {
          let max = lineToIndex.length - 2;
          let mid;
          while (min < max) {
            mid = min + (max - min >> 1);
            if (offset < lineToIndex[mid]) {
              max = mid - 1;
            } else if (offset >= lineToIndex[mid + 1]) {
              min = mid + 1;
            } else {
              min = mid;
              break;
            }
          }
        }
        return {
          line: min + 1,
          col: offset - lineToIndex[min] + 1
        };
      }
      error(message, line, column, opts = {}) {
        let result, endLine, endColumn;
        if (line && typeof line === "object") {
          let start = line;
          let end = column;
          if (typeof line.offset === "number") {
            let pos = this.fromOffset(start.offset);
            line = pos.line;
            column = pos.col;
          } else {
            line = start.line;
            column = start.column;
          }
          if (typeof end.offset === "number") {
            let pos = this.fromOffset(end.offset);
            endLine = pos.line;
            endColumn = pos.col;
          } else {
            endLine = end.line;
            endColumn = end.column;
          }
        } else if (!column) {
          let pos = this.fromOffset(line);
          line = pos.line;
          column = pos.col;
        }
        let origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
          result = new CssSyntaxError(message, origin.endLine === void 0 ? origin.line : { line: origin.line, column: origin.column }, origin.endLine === void 0 ? origin.column : { line: origin.endLine, column: origin.endColumn }, origin.source, origin.file, opts.plugin);
        } else {
          result = new CssSyntaxError(message, endLine === void 0 ? line : { line, column }, endLine === void 0 ? column : { line: endLine, column: endColumn }, this.css, this.file, opts.plugin);
        }
        result.input = { line, column, endLine, endColumn, source: this.css };
        if (this.file) {
          if (pathToFileURL) {
            result.input.url = pathToFileURL(this.file).toString();
          }
          result.input.file = this.file;
        }
        return result;
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map)
          return false;
        let consumer = this.map.consumer();
        let from = consumer.originalPositionFor({ line, column });
        if (!from.source)
          return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ line: endLine, column: endColumn });
        }
        let fromUrl;
        if (isAbsolute(from.source)) {
          fromUrl = pathToFileURL(from.source);
        } else {
          fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile));
        }
        let result = {
          url: fromUrl.toString(),
          line: from.line,
          column: from.column,
          endLine: to && to.line,
          endColumn: to && to.column
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath) {
            result.file = fileURLToPath(fromUrl);
          } else {
            throw new Error(`file: protocol is not available in this PostCSS build`);
          }
        }
        let source = consumer.sourceContentFor(from.source);
        if (source)
          result.source = source;
        return result;
      }
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      get from() {
        return this.file || this.id;
      }
      toJSON() {
        let json = {};
        for (let name of ["hasBOM", "css", "file", "id"]) {
          if (this[name] != null) {
            json[name] = this[name];
          }
        }
        if (this.map) {
          json.map = __spreadValues({}, this.map);
          if (json.map.consumerCache) {
            json.map.consumerCache = void 0;
          }
        }
        return json;
      }
    };
    module2.exports = Input;
    Input.default = Input;
    if (terminalHighlight && terminalHighlight.registerInput) {
      terminalHighlight.registerInput(Input);
    }
  }
});

// node_modules/postcss/lib/map-generator.js
var require_map_generator = __commonJS({
  "node_modules/postcss/lib/map-generator.js"(exports, module2) {
    "use strict";
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { dirname, resolve, relative, sep } = require("path");
    var { pathToFileURL } = require("url");
    var Input = require_input();
    var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    var pathAvailable = Boolean(dirname && resolve && relative && sep);
    var MapGenerator = class {
      constructor(stringify, root, opts, cssString) {
        this.stringify = stringify;
        this.mapOpts = opts.map || {};
        this.root = root;
        this.opts = opts;
        this.css = cssString;
      }
      isMap() {
        if (typeof this.opts.map !== "undefined") {
          return !!this.opts.map;
        }
        return this.previous().length > 0;
      }
      previous() {
        if (!this.previousMaps) {
          this.previousMaps = [];
          if (this.root) {
            this.root.walk((node) => {
              if (node.source && node.source.input.map) {
                let map = node.source.input.map;
                if (!this.previousMaps.includes(map)) {
                  this.previousMaps.push(map);
                }
              }
            });
          } else {
            let input = new Input(this.css, this.opts);
            if (input.map)
              this.previousMaps.push(input.map);
          }
        }
        return this.previousMaps;
      }
      isInline() {
        if (typeof this.mapOpts.inline !== "undefined") {
          return this.mapOpts.inline;
        }
        let annotation = this.mapOpts.annotation;
        if (typeof annotation !== "undefined" && annotation !== true) {
          return false;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.inline);
        }
        return true;
      }
      isSourcesContent() {
        if (typeof this.mapOpts.sourcesContent !== "undefined") {
          return this.mapOpts.sourcesContent;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.withContent());
        }
        return true;
      }
      clearAnnotation() {
        if (this.mapOpts.annotation === false)
          return;
        if (this.root) {
          let node;
          for (let i = this.root.nodes.length - 1; i >= 0; i--) {
            node = this.root.nodes[i];
            if (node.type !== "comment")
              continue;
            if (node.text.indexOf("# sourceMappingURL=") === 0) {
              this.root.removeChild(i);
            }
          }
        } else if (this.css) {
          this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, "");
        }
      }
      setSourcesContent() {
        let already = {};
        if (this.root) {
          this.root.walk((node) => {
            if (node.source) {
              let from = node.source.input.from;
              if (from && !already[from]) {
                already[from] = true;
                this.map.setSourceContent(this.toUrl(this.path(from)), node.source.input.css);
              }
            }
          });
        } else if (this.css) {
          let from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
          this.map.setSourceContent(from, this.css);
        }
      }
      applyPrevMaps() {
        for (let prev of this.previous()) {
          let from = this.toUrl(this.path(prev.file));
          let root = prev.root || dirname(prev.file);
          let map;
          if (this.mapOpts.sourcesContent === false) {
            map = new SourceMapConsumer(prev.text);
            if (map.sourcesContent) {
              map.sourcesContent = map.sourcesContent.map(() => null);
            }
          } else {
            map = prev.consumer();
          }
          this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
        }
      }
      isAnnotation() {
        if (this.isInline()) {
          return true;
        }
        if (typeof this.mapOpts.annotation !== "undefined") {
          return this.mapOpts.annotation;
        }
        if (this.previous().length) {
          return this.previous().some((i) => i.annotation);
        }
        return true;
      }
      toBase64(str) {
        if (Buffer) {
          return Buffer.from(str).toString("base64");
        } else {
          return window.btoa(unescape(encodeURIComponent(str)));
        }
      }
      addAnnotation() {
        let content;
        if (this.isInline()) {
          content = "data:application/json;base64," + this.toBase64(this.map.toString());
        } else if (typeof this.mapOpts.annotation === "string") {
          content = this.mapOpts.annotation;
        } else if (typeof this.mapOpts.annotation === "function") {
          content = this.mapOpts.annotation(this.opts.to, this.root);
        } else {
          content = this.outputFile() + ".map";
        }
        let eol = "\n";
        if (this.css.includes("\r\n"))
          eol = "\r\n";
        this.css += eol + "/*# sourceMappingURL=" + content + " */";
      }
      outputFile() {
        if (this.opts.to) {
          return this.path(this.opts.to);
        } else if (this.opts.from) {
          return this.path(this.opts.from);
        } else {
          return "to.css";
        }
      }
      generateMap() {
        if (this.root) {
          this.generateString();
        } else if (this.previous().length === 1) {
          let prev = this.previous()[0].consumer();
          prev.file = this.outputFile();
          this.map = SourceMapGenerator.fromSourceMap(prev);
        } else {
          this.map = new SourceMapGenerator({ file: this.outputFile() });
          this.map.addMapping({
            source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>",
            generated: { line: 1, column: 0 },
            original: { line: 1, column: 0 }
          });
        }
        if (this.isSourcesContent())
          this.setSourcesContent();
        if (this.root && this.previous().length > 0)
          this.applyPrevMaps();
        if (this.isAnnotation())
          this.addAnnotation();
        if (this.isInline()) {
          return [this.css];
        } else {
          return [this.css, this.map];
        }
      }
      path(file) {
        if (file.indexOf("<") === 0)
          return file;
        if (/^\w+:\/\//.test(file))
          return file;
        if (this.mapOpts.absolute)
          return file;
        let from = this.opts.to ? dirname(this.opts.to) : ".";
        if (typeof this.mapOpts.annotation === "string") {
          from = dirname(resolve(from, this.mapOpts.annotation));
        }
        file = relative(from, file);
        return file;
      }
      toUrl(path) {
        if (sep === "\\") {
          path = path.replace(/\\/g, "/");
        }
        return encodeURI(path).replace(/[#?]/g, encodeURIComponent);
      }
      sourcePath(node) {
        if (this.mapOpts.from) {
          return this.toUrl(this.mapOpts.from);
        } else if (this.mapOpts.absolute) {
          if (pathToFileURL) {
            return pathToFileURL(node.source.input.from).toString();
          } else {
            throw new Error("`map.absolute` option is not available in this PostCSS build");
          }
        } else {
          return this.toUrl(this.path(node.source.input.from));
        }
      }
      generateString() {
        this.css = "";
        this.map = new SourceMapGenerator({ file: this.outputFile() });
        let line = 1;
        let column = 1;
        let noSource = "<no source>";
        let mapping = {
          source: "",
          generated: { line: 0, column: 0 },
          original: { line: 0, column: 0 }
        };
        let lines, last;
        this.stringify(this.root, (str, node, type) => {
          this.css += str;
          if (node && type !== "end") {
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            if (node.source && node.source.start) {
              mapping.source = this.sourcePath(node);
              mapping.original.line = node.source.start.line;
              mapping.original.column = node.source.start.column - 1;
              this.map.addMapping(mapping);
            } else {
              mapping.source = noSource;
              mapping.original.line = 1;
              mapping.original.column = 0;
              this.map.addMapping(mapping);
            }
          }
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column += str.length;
          }
          if (node && type !== "start") {
            let p = node.parent || { raws: {} };
            if (node.type !== "decl" || node !== p.last || p.raws.semicolon) {
              if (node.source && node.source.end) {
                mapping.source = this.sourcePath(node);
                mapping.original.line = node.source.end.line;
                mapping.original.column = node.source.end.column - 1;
                mapping.generated.line = line;
                mapping.generated.column = column - 2;
                this.map.addMapping(mapping);
              } else {
                mapping.source = noSource;
                mapping.original.line = 1;
                mapping.original.column = 0;
                mapping.generated.line = line;
                mapping.generated.column = column - 1;
                this.map.addMapping(mapping);
              }
            }
          }
        });
      }
      generate() {
        this.clearAnnotation();
        if (pathAvailable && sourceMapAvailable && this.isMap()) {
          return this.generateMap();
        } else {
          let result = "";
          this.stringify(this.root, (i) => {
            result += i;
          });
          return [result];
        }
      }
    };
    module2.exports = MapGenerator;
  }
});

// node_modules/postcss/lib/comment.js
var require_comment = __commonJS({
  "node_modules/postcss/lib/comment.js"(exports, module2) {
    "use strict";
    var Node = require_node();
    var Comment = class extends Node {
      constructor(defaults) {
        super(defaults);
        this.type = "comment";
      }
    };
    module2.exports = Comment;
    Comment.default = Comment;
  }
});

// node_modules/postcss/lib/container.js
var require_container = __commonJS({
  "node_modules/postcss/lib/container.js"(exports, module2) {
    "use strict";
    var { isClean, my } = require_symbols();
    var Declaration = require_declaration();
    var Comment = require_comment();
    var Node = require_node();
    var parse;
    var Rule;
    var AtRule;
    function cleanSource(nodes) {
      return nodes.map((i) => {
        if (i.nodes)
          i.nodes = cleanSource(i.nodes);
        delete i.source;
        return i;
      });
    }
    function markDirtyUp(node) {
      node[isClean] = false;
      if (node.proxyOf.nodes) {
        for (let i of node.proxyOf.nodes) {
          markDirtyUp(i);
        }
      }
    }
    var Container = class extends Node {
      push(child) {
        child.parent = this;
        this.proxyOf.nodes.push(child);
        return this;
      }
      each(callback) {
        if (!this.proxyOf.nodes)
          return void 0;
        let iterator = this.getIterator();
        let index, result;
        while (this.indexes[iterator] < this.proxyOf.nodes.length) {
          index = this.indexes[iterator];
          result = callback(this.proxyOf.nodes[index], index);
          if (result === false)
            break;
          this.indexes[iterator] += 1;
        }
        delete this.indexes[iterator];
        return result;
      }
      walk(callback) {
        return this.each((child, i) => {
          let result;
          try {
            result = callback(child, i);
          } catch (e) {
            throw child.addToError(e);
          }
          if (result !== false && child.walk) {
            result = child.walk(callback);
          }
          return result;
        });
      }
      walkDecls(prop, callback) {
        if (!callback) {
          callback = prop;
          return this.walk((child, i) => {
            if (child.type === "decl") {
              return callback(child, i);
            }
          });
        }
        if (prop instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "decl" && prop.test(child.prop)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "decl" && child.prop === prop) {
            return callback(child, i);
          }
        });
      }
      walkRules(selector, callback) {
        if (!callback) {
          callback = selector;
          return this.walk((child, i) => {
            if (child.type === "rule") {
              return callback(child, i);
            }
          });
        }
        if (selector instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "rule" && selector.test(child.selector)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "rule" && child.selector === selector) {
            return callback(child, i);
          }
        });
      }
      walkAtRules(name, callback) {
        if (!callback) {
          callback = name;
          return this.walk((child, i) => {
            if (child.type === "atrule") {
              return callback(child, i);
            }
          });
        }
        if (name instanceof RegExp) {
          return this.walk((child, i) => {
            if (child.type === "atrule" && name.test(child.name)) {
              return callback(child, i);
            }
          });
        }
        return this.walk((child, i) => {
          if (child.type === "atrule" && child.name === name) {
            return callback(child, i);
          }
        });
      }
      walkComments(callback) {
        return this.walk((child, i) => {
          if (child.type === "comment") {
            return callback(child, i);
          }
        });
      }
      append(...children) {
        for (let child of children) {
          let nodes = this.normalize(child, this.last);
          for (let node of nodes)
            this.proxyOf.nodes.push(node);
        }
        this.markDirty();
        return this;
      }
      prepend(...children) {
        children = children.reverse();
        for (let child of children) {
          let nodes = this.normalize(child, this.first, "prepend").reverse();
          for (let node of nodes)
            this.proxyOf.nodes.unshift(node);
          for (let id in this.indexes) {
            this.indexes[id] = this.indexes[id] + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      cleanRaws(keepBetween) {
        super.cleanRaws(keepBetween);
        if (this.nodes) {
          for (let node of this.nodes)
            node.cleanRaws(keepBetween);
        }
      }
      insertBefore(exist, add) {
        exist = this.index(exist);
        let type = exist === 0 ? "prepend" : false;
        let nodes = this.normalize(add, this.proxyOf.nodes[exist], type).reverse();
        for (let node of nodes)
          this.proxyOf.nodes.splice(exist, 0, node);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (exist <= index) {
            this.indexes[id] = index + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      insertAfter(exist, add) {
        exist = this.index(exist);
        let nodes = this.normalize(add, this.proxyOf.nodes[exist]).reverse();
        for (let node of nodes)
          this.proxyOf.nodes.splice(exist + 1, 0, node);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (exist < index) {
            this.indexes[id] = index + nodes.length;
          }
        }
        this.markDirty();
        return this;
      }
      removeChild(child) {
        child = this.index(child);
        this.proxyOf.nodes[child].parent = void 0;
        this.proxyOf.nodes.splice(child, 1);
        let index;
        for (let id in this.indexes) {
          index = this.indexes[id];
          if (index >= child) {
            this.indexes[id] = index - 1;
          }
        }
        this.markDirty();
        return this;
      }
      removeAll() {
        for (let node of this.proxyOf.nodes)
          node.parent = void 0;
        this.proxyOf.nodes = [];
        this.markDirty();
        return this;
      }
      replaceValues(pattern, opts, callback) {
        if (!callback) {
          callback = opts;
          opts = {};
        }
        this.walkDecls((decl) => {
          if (opts.props && !opts.props.includes(decl.prop))
            return;
          if (opts.fast && !decl.value.includes(opts.fast))
            return;
          decl.value = decl.value.replace(pattern, callback);
        });
        this.markDirty();
        return this;
      }
      every(condition) {
        return this.nodes.every(condition);
      }
      some(condition) {
        return this.nodes.some(condition);
      }
      index(child) {
        if (typeof child === "number")
          return child;
        if (child.proxyOf)
          child = child.proxyOf;
        return this.proxyOf.nodes.indexOf(child);
      }
      get first() {
        if (!this.proxyOf.nodes)
          return void 0;
        return this.proxyOf.nodes[0];
      }
      get last() {
        if (!this.proxyOf.nodes)
          return void 0;
        return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      normalize(nodes, sample) {
        if (typeof nodes === "string") {
          nodes = cleanSource(parse(nodes).nodes);
        } else if (Array.isArray(nodes)) {
          nodes = nodes.slice(0);
          for (let i of nodes) {
            if (i.parent)
              i.parent.removeChild(i, "ignore");
          }
        } else if (nodes.type === "root" && this.type !== "document") {
          nodes = nodes.nodes.slice(0);
          for (let i of nodes) {
            if (i.parent)
              i.parent.removeChild(i, "ignore");
          }
        } else if (nodes.type) {
          nodes = [nodes];
        } else if (nodes.prop) {
          if (typeof nodes.value === "undefined") {
            throw new Error("Value field is missed in node creation");
          } else if (typeof nodes.value !== "string") {
            nodes.value = String(nodes.value);
          }
          nodes = [new Declaration(nodes)];
        } else if (nodes.selector) {
          nodes = [new Rule(nodes)];
        } else if (nodes.name) {
          nodes = [new AtRule(nodes)];
        } else if (nodes.text) {
          nodes = [new Comment(nodes)];
        } else {
          throw new Error("Unknown node type in node creation");
        }
        let processed = nodes.map((i) => {
          if (!i[my])
            Container.rebuild(i);
          i = i.proxyOf;
          if (i.parent)
            i.parent.removeChild(i);
          if (i[isClean])
            markDirtyUp(i);
          if (typeof i.raws.before === "undefined") {
            if (sample && typeof sample.raws.before !== "undefined") {
              i.raws.before = sample.raws.before.replace(/\S/g, "");
            }
          }
          i.parent = this.proxyOf;
          return i;
        });
        return processed;
      }
      getProxyProcessor() {
        return {
          set(node, prop, value) {
            if (node[prop] === value)
              return true;
            node[prop] = value;
            if (prop === "name" || prop === "params" || prop === "selector") {
              node.markDirty();
            }
            return true;
          },
          get(node, prop) {
            if (prop === "proxyOf") {
              return node;
            } else if (!node[prop]) {
              return node[prop];
            } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
              return (...args) => {
                return node[prop](...args.map((i) => {
                  if (typeof i === "function") {
                    return (child, index) => i(child.toProxy(), index);
                  } else {
                    return i;
                  }
                }));
              };
            } else if (prop === "every" || prop === "some") {
              return (cb) => {
                return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
              };
            } else if (prop === "root") {
              return () => node.root().toProxy();
            } else if (prop === "nodes") {
              return node.nodes.map((i) => i.toProxy());
            } else if (prop === "first" || prop === "last") {
              return node[prop].toProxy();
            } else {
              return node[prop];
            }
          }
        };
      }
      getIterator() {
        if (!this.lastEach)
          this.lastEach = 0;
        if (!this.indexes)
          this.indexes = {};
        this.lastEach += 1;
        let iterator = this.lastEach;
        this.indexes[iterator] = 0;
        return iterator;
      }
    };
    Container.registerParse = (dependant) => {
      parse = dependant;
    };
    Container.registerRule = (dependant) => {
      Rule = dependant;
    };
    Container.registerAtRule = (dependant) => {
      AtRule = dependant;
    };
    module2.exports = Container;
    Container.default = Container;
    Container.rebuild = (node) => {
      if (node.type === "atrule") {
        Object.setPrototypeOf(node, AtRule.prototype);
      } else if (node.type === "rule") {
        Object.setPrototypeOf(node, Rule.prototype);
      } else if (node.type === "decl") {
        Object.setPrototypeOf(node, Declaration.prototype);
      } else if (node.type === "comment") {
        Object.setPrototypeOf(node, Comment.prototype);
      }
      node[my] = true;
      if (node.nodes) {
        node.nodes.forEach((child) => {
          Container.rebuild(child);
        });
      }
    };
  }
});

// node_modules/postcss/lib/document.js
var require_document = __commonJS({
  "node_modules/postcss/lib/document.js"(exports, module2) {
    "use strict";
    var Container = require_container();
    var LazyResult;
    var Processor;
    var Document = class extends Container {
      constructor(defaults) {
        super(__spreadValues({ type: "document" }, defaults));
        if (!this.nodes) {
          this.nodes = [];
        }
      }
      toResult(opts = {}) {
        let lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
      }
    };
    Document.registerLazyResult = (dependant) => {
      LazyResult = dependant;
    };
    Document.registerProcessor = (dependant) => {
      Processor = dependant;
    };
    module2.exports = Document;
    Document.default = Document;
  }
});

// node_modules/postcss/lib/warn-once.js
var require_warn_once = __commonJS({
  "node_modules/postcss/lib/warn-once.js"(exports, module2) {
    "use strict";
    var printed = {};
    module2.exports = function warnOnce(message) {
      if (printed[message])
        return;
      printed[message] = true;
      if (typeof console !== "undefined" && console.warn) {
        console.warn(message);
      }
    };
  }
});

// node_modules/postcss/lib/warning.js
var require_warning = __commonJS({
  "node_modules/postcss/lib/warning.js"(exports, module2) {
    "use strict";
    var Warning = class {
      constructor(text, opts = {}) {
        this.type = "warning";
        this.text = text;
        if (opts.node && opts.node.source) {
          let range = opts.node.rangeBy(opts);
          this.line = range.start.line;
          this.column = range.start.column;
          this.endLine = range.end.line;
          this.endColumn = range.end.column;
        }
        for (let opt in opts)
          this[opt] = opts[opt];
      }
      toString() {
        if (this.node) {
          return this.node.error(this.text, {
            plugin: this.plugin,
            index: this.index,
            word: this.word
          }).message;
        }
        if (this.plugin) {
          return this.plugin + ": " + this.text;
        }
        return this.text;
      }
    };
    module2.exports = Warning;
    Warning.default = Warning;
  }
});

// node_modules/postcss/lib/result.js
var require_result = __commonJS({
  "node_modules/postcss/lib/result.js"(exports, module2) {
    "use strict";
    var Warning = require_warning();
    var Result = class {
      constructor(processor, root, opts) {
        this.processor = processor;
        this.messages = [];
        this.root = root;
        this.opts = opts;
        this.css = void 0;
        this.map = void 0;
      }
      toString() {
        return this.css;
      }
      warn(text, opts = {}) {
        if (!opts.plugin) {
          if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
            opts.plugin = this.lastPlugin.postcssPlugin;
          }
        }
        let warning = new Warning(text, opts);
        this.messages.push(warning);
        return warning;
      }
      warnings() {
        return this.messages.filter((i) => i.type === "warning");
      }
      get content() {
        return this.css;
      }
    };
    module2.exports = Result;
    Result.default = Result;
  }
});

// node_modules/postcss/lib/at-rule.js
var require_at_rule = __commonJS({
  "node_modules/postcss/lib/at-rule.js"(exports, module2) {
    "use strict";
    var Container = require_container();
    var AtRule = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "atrule";
      }
      append(...children) {
        if (!this.proxyOf.nodes)
          this.nodes = [];
        return super.append(...children);
      }
      prepend(...children) {
        if (!this.proxyOf.nodes)
          this.nodes = [];
        return super.prepend(...children);
      }
    };
    module2.exports = AtRule;
    AtRule.default = AtRule;
    Container.registerAtRule(AtRule);
  }
});

// node_modules/postcss/lib/root.js
var require_root = __commonJS({
  "node_modules/postcss/lib/root.js"(exports, module2) {
    "use strict";
    var Container = require_container();
    var LazyResult;
    var Processor;
    var Root = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "root";
        if (!this.nodes)
          this.nodes = [];
      }
      removeChild(child, ignore) {
        let index = this.index(child);
        if (!ignore && index === 0 && this.nodes.length > 1) {
          this.nodes[1].raws.before = this.nodes[index].raws.before;
        }
        return super.removeChild(child);
      }
      normalize(child, sample, type) {
        let nodes = super.normalize(child);
        if (sample) {
          if (type === "prepend") {
            if (this.nodes.length > 1) {
              sample.raws.before = this.nodes[1].raws.before;
            } else {
              delete sample.raws.before;
            }
          } else if (this.first !== sample) {
            for (let node of nodes) {
              node.raws.before = sample.raws.before;
            }
          }
        }
        return nodes;
      }
      toResult(opts = {}) {
        let lazy = new LazyResult(new Processor(), this, opts);
        return lazy.stringify();
      }
    };
    Root.registerLazyResult = (dependant) => {
      LazyResult = dependant;
    };
    Root.registerProcessor = (dependant) => {
      Processor = dependant;
    };
    module2.exports = Root;
    Root.default = Root;
  }
});

// node_modules/postcss/lib/list.js
var require_list = __commonJS({
  "node_modules/postcss/lib/list.js"(exports, module2) {
    "use strict";
    var list = {
      split(string, separators, last) {
        let array = [];
        let current = "";
        let split = false;
        let func = 0;
        let quote = false;
        let escape = false;
        for (let letter of string) {
          if (escape) {
            escape = false;
          } else if (letter === "\\") {
            escape = true;
          } else if (quote) {
            if (letter === quote) {
              quote = false;
            }
          } else if (letter === '"' || letter === "'") {
            quote = letter;
          } else if (letter === "(") {
            func += 1;
          } else if (letter === ")") {
            if (func > 0)
              func -= 1;
          } else if (func === 0) {
            if (separators.includes(letter))
              split = true;
          }
          if (split) {
            if (current !== "")
              array.push(current.trim());
            current = "";
            split = false;
          } else {
            current += letter;
          }
        }
        if (last || current !== "")
          array.push(current.trim());
        return array;
      },
      space(string) {
        let spaces = [" ", "\n", "	"];
        return list.split(string, spaces);
      },
      comma(string) {
        return list.split(string, [","], true);
      }
    };
    module2.exports = list;
    list.default = list;
  }
});

// node_modules/postcss/lib/rule.js
var require_rule = __commonJS({
  "node_modules/postcss/lib/rule.js"(exports, module2) {
    "use strict";
    var Container = require_container();
    var list = require_list();
    var Rule = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "rule";
        if (!this.nodes)
          this.nodes = [];
      }
      get selectors() {
        return list.comma(this.selector);
      }
      set selectors(values) {
        let match = this.selector ? this.selector.match(/,\s*/) : null;
        let sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep);
      }
    };
    module2.exports = Rule;
    Rule.default = Rule;
    Container.registerRule(Rule);
  }
});

// node_modules/postcss/lib/parser.js
var require_parser = __commonJS({
  "node_modules/postcss/lib/parser.js"(exports, module2) {
    "use strict";
    var Declaration = require_declaration();
    var tokenizer = require_tokenize();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Root = require_root();
    var Rule = require_rule();
    var SAFE_COMMENT_NEIGHBOR = {
      empty: true,
      space: true
    };
    function findLastWithPosition(tokens) {
      for (let i = tokens.length - 1; i >= 0; i--) {
        let token = tokens[i];
        let pos = token[3] || token[2];
        if (pos)
          return pos;
      }
    }
    var Parser = class {
      constructor(input) {
        this.input = input;
        this.root = new Root();
        this.current = this.root;
        this.spaces = "";
        this.semicolon = false;
        this.customProperty = false;
        this.createTokenizer();
        this.root.source = { input, start: { offset: 0, line: 1, column: 1 } };
      }
      createTokenizer() {
        this.tokenizer = tokenizer(this.input);
      }
      parse() {
        let token;
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          switch (token[0]) {
            case "space":
              this.spaces += token[1];
              break;
            case ";":
              this.freeSemicolon(token);
              break;
            case "}":
              this.end(token);
              break;
            case "comment":
              this.comment(token);
              break;
            case "at-word":
              this.atrule(token);
              break;
            case "{":
              this.emptyRule(token);
              break;
            default:
              this.other(token);
              break;
          }
        }
        this.endFile();
      }
      comment(token) {
        let node = new Comment();
        this.init(node, token[2]);
        node.source.end = this.getPosition(token[3] || token[2]);
        let text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
          node.text = "";
          node.raws.left = text;
          node.raws.right = "";
        } else {
          let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
          node.text = match[2];
          node.raws.left = match[1];
          node.raws.right = match[3];
        }
      }
      emptyRule(token) {
        let node = new Rule();
        this.init(node, token[2]);
        node.selector = "";
        node.raws.between = "";
        this.current = node;
      }
      other(start) {
        let end = false;
        let type = null;
        let colon = false;
        let bracket = null;
        let brackets = [];
        let customProperty = start[1].startsWith("--");
        let tokens = [];
        let token = start;
        while (token) {
          type = token[0];
          tokens.push(token);
          if (type === "(" || type === "[") {
            if (!bracket)
              bracket = token;
            brackets.push(type === "(" ? ")" : "]");
          } else if (customProperty && colon && type === "{") {
            if (!bracket)
              bracket = token;
            brackets.push("}");
          } else if (brackets.length === 0) {
            if (type === ";") {
              if (colon) {
                this.decl(tokens, customProperty);
                return;
              } else {
                break;
              }
            } else if (type === "{") {
              this.rule(tokens);
              return;
            } else if (type === "}") {
              this.tokenizer.back(tokens.pop());
              end = true;
              break;
            } else if (type === ":") {
              colon = true;
            }
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
            if (brackets.length === 0)
              bracket = null;
          }
          token = this.tokenizer.nextToken();
        }
        if (this.tokenizer.endOfFile())
          end = true;
        if (brackets.length > 0)
          this.unclosedBracket(bracket);
        if (end && colon) {
          if (!customProperty) {
            while (tokens.length) {
              token = tokens[tokens.length - 1][0];
              if (token !== "space" && token !== "comment")
                break;
              this.tokenizer.back(tokens.pop());
            }
          }
          this.decl(tokens, customProperty);
        } else {
          this.unknownWord(tokens);
        }
      }
      rule(tokens) {
        tokens.pop();
        let node = new Rule();
        this.init(node, tokens[0][2]);
        node.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node, "selector", tokens);
        this.current = node;
      }
      decl(tokens, customProperty) {
        let node = new Declaration();
        this.init(node, tokens[0][2]);
        let last = tokens[tokens.length - 1];
        if (last[0] === ";") {
          this.semicolon = true;
          tokens.pop();
        }
        node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
        while (tokens[0][0] !== "word") {
          if (tokens.length === 1)
            this.unknownWord(tokens);
          node.raws.before += tokens.shift()[1];
        }
        node.source.start = this.getPosition(tokens[0][2]);
        node.prop = "";
        while (tokens.length) {
          let type = tokens[0][0];
          if (type === ":" || type === "space" || type === "comment") {
            break;
          }
          node.prop += tokens.shift()[1];
        }
        node.raws.between = "";
        let token;
        while (tokens.length) {
          token = tokens.shift();
          if (token[0] === ":") {
            node.raws.between += token[1];
            break;
          } else {
            if (token[0] === "word" && /\w/.test(token[1])) {
              this.unknownWord([token]);
            }
            node.raws.between += token[1];
          }
        }
        if (node.prop[0] === "_" || node.prop[0] === "*") {
          node.raws.before += node.prop[0];
          node.prop = node.prop.slice(1);
        }
        let firstSpaces = [];
        let next;
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment")
            break;
          firstSpaces.push(tokens.shift());
        }
        this.precheckMissedSemicolon(tokens);
        for (let i = tokens.length - 1; i >= 0; i--) {
          token = tokens[i];
          if (token[1].toLowerCase() === "!important") {
            node.important = true;
            let string = this.stringFrom(tokens, i);
            string = this.spacesFromEnd(tokens) + string;
            if (string !== " !important")
              node.raws.important = string;
            break;
          } else if (token[1].toLowerCase() === "important") {
            let cache = tokens.slice(0);
            let str = "";
            for (let j = i; j > 0; j--) {
              let type = cache[j][0];
              if (str.trim().indexOf("!") === 0 && type !== "space") {
                break;
              }
              str = cache.pop()[1] + str;
            }
            if (str.trim().indexOf("!") === 0) {
              node.important = true;
              node.raws.important = str;
              tokens = cache;
            }
          }
          if (token[0] !== "space" && token[0] !== "comment") {
            break;
          }
        }
        let hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
        if (hasWord) {
          node.raws.between += firstSpaces.map((i) => i[1]).join("");
          firstSpaces = [];
        }
        this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
        if (node.value.includes(":") && !customProperty) {
          this.checkMissedSemicolon(tokens);
        }
      }
      atrule(token) {
        let node = new AtRule();
        node.name = token[1].slice(1);
        if (node.name === "") {
          this.unnamedAtrule(node, token);
        }
        this.init(node, token[2]);
        let type;
        let prev;
        let shift;
        let last = false;
        let open = false;
        let params = [];
        let brackets = [];
        while (!this.tokenizer.endOfFile()) {
          token = this.tokenizer.nextToken();
          type = token[0];
          if (type === "(" || type === "[") {
            brackets.push(type === "(" ? ")" : "]");
          } else if (type === "{" && brackets.length > 0) {
            brackets.push("}");
          } else if (type === brackets[brackets.length - 1]) {
            brackets.pop();
          }
          if (brackets.length === 0) {
            if (type === ";") {
              node.source.end = this.getPosition(token[2]);
              this.semicolon = true;
              break;
            } else if (type === "{") {
              open = true;
              break;
            } else if (type === "}") {
              if (params.length > 0) {
                shift = params.length - 1;
                prev = params[shift];
                while (prev && prev[0] === "space") {
                  prev = params[--shift];
                }
                if (prev) {
                  node.source.end = this.getPosition(prev[3] || prev[2]);
                }
              }
              this.end(token);
              break;
            } else {
              params.push(token);
            }
          } else {
            params.push(token);
          }
          if (this.tokenizer.endOfFile()) {
            last = true;
            break;
          }
        }
        node.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
          node.raws.afterName = this.spacesAndCommentsFromStart(params);
          this.raw(node, "params", params);
          if (last) {
            token = params[params.length - 1];
            node.source.end = this.getPosition(token[3] || token[2]);
            this.spaces = node.raws.between;
            node.raws.between = "";
          }
        } else {
          node.raws.afterName = "";
          node.params = "";
        }
        if (open) {
          node.nodes = [];
          this.current = node;
        }
      }
      end(token) {
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        this.spaces = "";
        if (this.current.parent) {
          this.current.source.end = this.getPosition(token[2]);
          this.current = this.current.parent;
        } else {
          this.unexpectedClose(token);
        }
      }
      endFile() {
        if (this.current.parent)
          this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
      }
      freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
          let prev = this.current.nodes[this.current.nodes.length - 1];
          if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
            prev.raws.ownSemicolon = this.spaces;
            this.spaces = "";
          }
        }
      }
      getPosition(offset) {
        let pos = this.input.fromOffset(offset);
        return {
          offset,
          line: pos.line,
          column: pos.col
        };
      }
      init(node, offset) {
        this.current.push(node);
        node.source = {
          start: this.getPosition(offset),
          input: this.input
        };
        node.raws.before = this.spaces;
        this.spaces = "";
        if (node.type !== "comment")
          this.semicolon = false;
      }
      raw(node, prop, tokens, customProperty) {
        let token, type;
        let length = tokens.length;
        let value = "";
        let clean = true;
        let next, prev;
        for (let i = 0; i < length; i += 1) {
          token = tokens[i];
          type = token[0];
          if (type === "space" && i === length - 1 && !customProperty) {
            clean = false;
          } else if (type === "comment") {
            prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
            next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
            if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
              if (value.slice(-1) === ",") {
                clean = false;
              } else {
                value += token[1];
              }
            } else {
              clean = false;
            }
          } else {
            value += token[1];
          }
        }
        if (!clean) {
          let raw = tokens.reduce((all, i) => all + i[1], "");
          node.raws[prop] = { value, raw };
        }
        node[prop] = value;
      }
      spacesAndCommentsFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space" && lastTokenType !== "comment")
            break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      spacesAndCommentsFromStart(tokens) {
        let next;
        let spaces = "";
        while (tokens.length) {
          next = tokens[0][0];
          if (next !== "space" && next !== "comment")
            break;
          spaces += tokens.shift()[1];
        }
        return spaces;
      }
      spacesFromEnd(tokens) {
        let lastTokenType;
        let spaces = "";
        while (tokens.length) {
          lastTokenType = tokens[tokens.length - 1][0];
          if (lastTokenType !== "space")
            break;
          spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
      }
      stringFrom(tokens, from) {
        let result = "";
        for (let i = from; i < tokens.length; i++) {
          result += tokens[i][1];
        }
        tokens.splice(from, tokens.length - from);
        return result;
      }
      colon(tokens) {
        let brackets = 0;
        let token, type, prev;
        for (let [i, element] of tokens.entries()) {
          token = element;
          type = token[0];
          if (type === "(") {
            brackets += 1;
          }
          if (type === ")") {
            brackets -= 1;
          }
          if (brackets === 0 && type === ":") {
            if (!prev) {
              this.doubleColon(token);
            } else if (prev[0] === "word" && prev[1] === "progid") {
              continue;
            } else {
              return i;
            }
          }
          prev = token;
        }
        return false;
      }
      unclosedBracket(bracket) {
        throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
      }
      unknownWord(tokens) {
        throw this.input.error("Unknown word", { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
      }
      unexpectedClose(token) {
        throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
      }
      unclosedBlock() {
        let pos = this.current.source.start;
        throw this.input.error("Unclosed block", pos.line, pos.column);
      }
      doubleColon(token) {
        throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
      }
      unnamedAtrule(node, token) {
        throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
      }
      precheckMissedSemicolon() {
      }
      checkMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if (colon === false)
          return;
        let founded = 0;
        let token;
        for (let j = colon - 1; j >= 0; j--) {
          token = tokens[j];
          if (token[0] !== "space") {
            founded += 1;
            if (founded === 2)
              break;
          }
        }
        throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
      }
    };
    module2.exports = Parser;
  }
});

// node_modules/postcss/lib/parse.js
var require_parse = __commonJS({
  "node_modules/postcss/lib/parse.js"(exports, module2) {
    "use strict";
    var Container = require_container();
    var Parser = require_parser();
    var Input = require_input();
    function parse(css, opts) {
      let input = new Input(css, opts);
      let parser = new Parser(input);
      try {
        parser.parse();
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          if (e.name === "CssSyntaxError" && opts && opts.from) {
            if (/\.scss$/i.test(opts.from)) {
              e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
            } else if (/\.sass/i.test(opts.from)) {
              e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
            } else if (/\.less$/i.test(opts.from)) {
              e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
            }
          }
        }
        throw e;
      }
      return parser.root;
    }
    module2.exports = parse;
    parse.default = parse;
    Container.registerParse(parse);
  }
});

// node_modules/postcss/lib/lazy-result.js
var require_lazy_result = __commonJS({
  "node_modules/postcss/lib/lazy-result.js"(exports, module2) {
    "use strict";
    var { isClean, my } = require_symbols();
    var MapGenerator = require_map_generator();
    var stringify = require_stringify();
    var Container = require_container();
    var Document = require_document();
    var warnOnce = require_warn_once();
    var Result = require_result();
    var parse = require_parse();
    var Root = require_root();
    var TYPE_TO_CLASS_NAME = {
      document: "Document",
      root: "Root",
      atrule: "AtRule",
      rule: "Rule",
      decl: "Declaration",
      comment: "Comment"
    };
    var PLUGIN_PROPS = {
      postcssPlugin: true,
      prepare: true,
      Once: true,
      Document: true,
      Root: true,
      Declaration: true,
      Rule: true,
      AtRule: true,
      Comment: true,
      DeclarationExit: true,
      RuleExit: true,
      AtRuleExit: true,
      CommentExit: true,
      RootExit: true,
      DocumentExit: true,
      OnceExit: true
    };
    var NOT_VISITORS = {
      postcssPlugin: true,
      prepare: true,
      Once: true
    };
    var CHILDREN = 0;
    function isPromise(obj) {
      return typeof obj === "object" && typeof obj.then === "function";
    }
    function getEvents(node) {
      let key = false;
      let type = TYPE_TO_CLASS_NAME[node.type];
      if (node.type === "decl") {
        key = node.prop.toLowerCase();
      } else if (node.type === "atrule") {
        key = node.name.toLowerCase();
      }
      if (key && node.append) {
        return [
          type,
          type + "-" + key,
          CHILDREN,
          type + "Exit",
          type + "Exit-" + key
        ];
      } else if (key) {
        return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
      } else if (node.append) {
        return [type, CHILDREN, type + "Exit"];
      } else {
        return [type, type + "Exit"];
      }
    }
    function toStack(node) {
      let events;
      if (node.type === "document") {
        events = ["Document", CHILDREN, "DocumentExit"];
      } else if (node.type === "root") {
        events = ["Root", CHILDREN, "RootExit"];
      } else {
        events = getEvents(node);
      }
      return {
        node,
        events,
        eventIndex: 0,
        visitors: [],
        visitorIndex: 0,
        iterator: 0
      };
    }
    function cleanMarks(node) {
      node[isClean] = false;
      if (node.nodes)
        node.nodes.forEach((i) => cleanMarks(i));
      return node;
    }
    var postcss = {};
    var LazyResult = class {
      constructor(processor, css, opts) {
        this.stringified = false;
        this.processed = false;
        let root;
        if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
          root = cleanMarks(css);
        } else if (css instanceof LazyResult || css instanceof Result) {
          root = cleanMarks(css.root);
          if (css.map) {
            if (typeof opts.map === "undefined")
              opts.map = {};
            if (!opts.map.inline)
              opts.map.inline = false;
            opts.map.prev = css.map;
          }
        } else {
          let parser = parse;
          if (opts.syntax)
            parser = opts.syntax.parse;
          if (opts.parser)
            parser = opts.parser;
          if (parser.parse)
            parser = parser.parse;
          try {
            root = parser(css, opts);
          } catch (error) {
            this.processed = true;
            this.error = error;
          }
          if (root && !root[my]) {
            Container.rebuild(root);
          }
        }
        this.result = new Result(processor, root, opts);
        this.helpers = __spreadProps(__spreadValues({}, postcss), { result: this.result, postcss });
        this.plugins = this.processor.plugins.map((plugin) => {
          if (typeof plugin === "object" && plugin.prepare) {
            return __spreadValues(__spreadValues({}, plugin), plugin.prepare(this.result));
          } else {
            return plugin;
          }
        });
      }
      get [Symbol.toStringTag]() {
        return "LazyResult";
      }
      get processor() {
        return this.result.processor;
      }
      get opts() {
        return this.result.opts;
      }
      get css() {
        return this.stringify().css;
      }
      get content() {
        return this.stringify().content;
      }
      get map() {
        return this.stringify().map;
      }
      get root() {
        return this.sync().root;
      }
      get messages() {
        return this.sync().messages;
      }
      warnings() {
        return this.sync().warnings();
      }
      toString() {
        return this.css;
      }
      then(onFulfilled, onRejected) {
        if (process.env.NODE_ENV !== "production") {
          if (!("from" in this.opts)) {
            warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      async() {
        if (this.error)
          return Promise.reject(this.error);
        if (this.processed)
          return Promise.resolve(this.result);
        if (!this.processing) {
          this.processing = this.runAsync();
        }
        return this.processing;
      }
      sync() {
        if (this.error)
          throw this.error;
        if (this.processed)
          return this.result;
        this.processed = true;
        if (this.processing) {
          throw this.getAsyncError();
        }
        for (let plugin of this.plugins) {
          let promise = this.runOnRoot(plugin);
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
        this.prepareVisitors();
        if (this.hasListener) {
          let root = this.result.root;
          while (!root[isClean]) {
            root[isClean] = true;
            this.walkSync(root);
          }
          if (this.listeners.OnceExit) {
            if (root.type === "document") {
              for (let subRoot of root.nodes) {
                this.visitSync(this.listeners.OnceExit, subRoot);
              }
            } else {
              this.visitSync(this.listeners.OnceExit, root);
            }
          }
        }
        return this.result;
      }
      stringify() {
        if (this.error)
          throw this.error;
        if (this.stringified)
          return this.result;
        this.stringified = true;
        this.sync();
        let opts = this.result.opts;
        let str = stringify;
        if (opts.syntax)
          str = opts.syntax.stringify;
        if (opts.stringifier)
          str = opts.stringifier;
        if (str.stringify)
          str = str.stringify;
        let map = new MapGenerator(str, this.result.root, this.result.opts);
        let data = map.generate();
        this.result.css = data[0];
        this.result.map = data[1];
        return this.result;
      }
      walkSync(node) {
        node[isClean] = true;
        let events = getEvents(node);
        for (let event of events) {
          if (event === CHILDREN) {
            if (node.nodes) {
              node.each((child) => {
                if (!child[isClean])
                  this.walkSync(child);
              });
            }
          } else {
            let visitors = this.listeners[event];
            if (visitors) {
              if (this.visitSync(visitors, node.toProxy()))
                return;
            }
          }
        }
      }
      visitSync(visitors, node) {
        for (let [plugin, visitor] of visitors) {
          this.result.lastPlugin = plugin;
          let promise;
          try {
            promise = visitor(node, this.helpers);
          } catch (e) {
            throw this.handleError(e, node.proxyOf);
          }
          if (node.type !== "root" && node.type !== "document" && !node.parent) {
            return true;
          }
          if (isPromise(promise)) {
            throw this.getAsyncError();
          }
        }
      }
      runOnRoot(plugin) {
        this.result.lastPlugin = plugin;
        try {
          if (typeof plugin === "object" && plugin.Once) {
            if (this.result.root.type === "document") {
              let roots = this.result.root.nodes.map((root) => plugin.Once(root, this.helpers));
              if (isPromise(roots[0])) {
                return Promise.all(roots);
              }
              return roots;
            }
            return plugin.Once(this.result.root, this.helpers);
          } else if (typeof plugin === "function") {
            return plugin(this.result.root, this.result);
          }
        } catch (error) {
          throw this.handleError(error);
        }
      }
      getAsyncError() {
        throw new Error("Use process(css).then(cb) to work with async plugins");
      }
      handleError(error, node) {
        let plugin = this.result.lastPlugin;
        try {
          if (node)
            node.addToError(error);
          this.error = error;
          if (error.name === "CssSyntaxError" && !error.plugin) {
            error.plugin = plugin.postcssPlugin;
            error.setMessage();
          } else if (plugin.postcssVersion) {
            if (process.env.NODE_ENV !== "production") {
              let pluginName = plugin.postcssPlugin;
              let pluginVer = plugin.postcssVersion;
              let runtimeVer = this.result.processor.version;
              let a = pluginVer.split(".");
              let b = runtimeVer.split(".");
              if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
                console.error("Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below.");
              }
            }
          }
        } catch (err) {
          if (console && console.error)
            console.error(err);
        }
        return error;
      }
      runAsync() {
        return __async(this, null, function* () {
          this.plugin = 0;
          for (let i = 0; i < this.plugins.length; i++) {
            let plugin = this.plugins[i];
            let promise = this.runOnRoot(plugin);
            if (isPromise(promise)) {
              try {
                yield promise;
              } catch (error) {
                throw this.handleError(error);
              }
            }
          }
          this.prepareVisitors();
          if (this.hasListener) {
            let root = this.result.root;
            while (!root[isClean]) {
              root[isClean] = true;
              let stack = [toStack(root)];
              while (stack.length > 0) {
                let promise = this.visitTick(stack);
                if (isPromise(promise)) {
                  try {
                    yield promise;
                  } catch (e) {
                    let node = stack[stack.length - 1].node;
                    throw this.handleError(e, node);
                  }
                }
              }
            }
            if (this.listeners.OnceExit) {
              for (let [plugin, visitor] of this.listeners.OnceExit) {
                this.result.lastPlugin = plugin;
                try {
                  if (root.type === "document") {
                    let roots = root.nodes.map((subRoot) => visitor(subRoot, this.helpers));
                    yield Promise.all(roots);
                  } else {
                    yield visitor(root, this.helpers);
                  }
                } catch (e) {
                  throw this.handleError(e);
                }
              }
            }
          }
          this.processed = true;
          return this.stringify();
        });
      }
      prepareVisitors() {
        this.listeners = {};
        let add = (plugin, type, cb) => {
          if (!this.listeners[type])
            this.listeners[type] = [];
          this.listeners[type].push([plugin, cb]);
        };
        for (let plugin of this.plugins) {
          if (typeof plugin === "object") {
            for (let event in plugin) {
              if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
                throw new Error(`Unknown event ${event} in ${plugin.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
              }
              if (!NOT_VISITORS[event]) {
                if (typeof plugin[event] === "object") {
                  for (let filter in plugin[event]) {
                    if (filter === "*") {
                      add(plugin, event, plugin[event][filter]);
                    } else {
                      add(plugin, event + "-" + filter.toLowerCase(), plugin[event][filter]);
                    }
                  }
                } else if (typeof plugin[event] === "function") {
                  add(plugin, event, plugin[event]);
                }
              }
            }
          }
        }
        this.hasListener = Object.keys(this.listeners).length > 0;
      }
      visitTick(stack) {
        let visit = stack[stack.length - 1];
        let { node, visitors } = visit;
        if (node.type !== "root" && node.type !== "document" && !node.parent) {
          stack.pop();
          return;
        }
        if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
          let [plugin, visitor] = visitors[visit.visitorIndex];
          visit.visitorIndex += 1;
          if (visit.visitorIndex === visitors.length) {
            visit.visitors = [];
            visit.visitorIndex = 0;
          }
          this.result.lastPlugin = plugin;
          try {
            return visitor(node.toProxy(), this.helpers);
          } catch (e) {
            throw this.handleError(e, node);
          }
        }
        if (visit.iterator !== 0) {
          let iterator = visit.iterator;
          let child;
          while (child = node.nodes[node.indexes[iterator]]) {
            node.indexes[iterator] += 1;
            if (!child[isClean]) {
              child[isClean] = true;
              stack.push(toStack(child));
              return;
            }
          }
          visit.iterator = 0;
          delete node.indexes[iterator];
        }
        let events = visit.events;
        while (visit.eventIndex < events.length) {
          let event = events[visit.eventIndex];
          visit.eventIndex += 1;
          if (event === CHILDREN) {
            if (node.nodes && node.nodes.length) {
              node[isClean] = true;
              visit.iterator = node.getIterator();
            }
            return;
          } else if (this.listeners[event]) {
            visit.visitors = this.listeners[event];
            return;
          }
        }
        stack.pop();
      }
    };
    LazyResult.registerPostcss = (dependant) => {
      postcss = dependant;
    };
    module2.exports = LazyResult;
    LazyResult.default = LazyResult;
    Root.registerLazyResult(LazyResult);
    Document.registerLazyResult(LazyResult);
  }
});

// node_modules/postcss/lib/no-work-result.js
var require_no_work_result = __commonJS({
  "node_modules/postcss/lib/no-work-result.js"(exports, module2) {
    "use strict";
    var MapGenerator = require_map_generator();
    var stringify = require_stringify();
    var warnOnce = require_warn_once();
    var parse = require_parse();
    var Result = require_result();
    var NoWorkResult = class {
      constructor(processor, css, opts) {
        css = css.toString();
        this.stringified = false;
        this._processor = processor;
        this._css = css;
        this._opts = opts;
        this._map = void 0;
        let root;
        let str = stringify;
        this.result = new Result(this._processor, root, this._opts);
        this.result.css = css;
        let self2 = this;
        Object.defineProperty(this.result, "root", {
          get() {
            return self2.root;
          }
        });
        let map = new MapGenerator(str, root, this._opts, css);
        if (map.isMap()) {
          let [generatedCSS, generatedMap] = map.generate();
          if (generatedCSS) {
            this.result.css = generatedCSS;
          }
          if (generatedMap) {
            this.result.map = generatedMap;
          }
        }
      }
      get [Symbol.toStringTag]() {
        return "NoWorkResult";
      }
      get processor() {
        return this.result.processor;
      }
      get opts() {
        return this.result.opts;
      }
      get css() {
        return this.result.css;
      }
      get content() {
        return this.result.css;
      }
      get map() {
        return this.result.map;
      }
      get root() {
        if (this._root) {
          return this._root;
        }
        let root;
        let parser = parse;
        try {
          root = parser(this._css, this._opts);
        } catch (error) {
          this.error = error;
        }
        if (this.error) {
          throw this.error;
        } else {
          this._root = root;
          return root;
        }
      }
      get messages() {
        return [];
      }
      warnings() {
        return [];
      }
      toString() {
        return this._css;
      }
      then(onFulfilled, onRejected) {
        if (process.env.NODE_ENV !== "production") {
          if (!("from" in this._opts)) {
            warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      async() {
        if (this.error)
          return Promise.reject(this.error);
        return Promise.resolve(this.result);
      }
      sync() {
        if (this.error)
          throw this.error;
        return this.result;
      }
    };
    module2.exports = NoWorkResult;
    NoWorkResult.default = NoWorkResult;
  }
});

// node_modules/postcss/lib/processor.js
var require_processor = __commonJS({
  "node_modules/postcss/lib/processor.js"(exports, module2) {
    "use strict";
    var NoWorkResult = require_no_work_result();
    var LazyResult = require_lazy_result();
    var Document = require_document();
    var Root = require_root();
    var Processor = class {
      constructor(plugins = []) {
        this.version = "8.4.14";
        this.plugins = this.normalize(plugins);
      }
      use(plugin) {
        this.plugins = this.plugins.concat(this.normalize([plugin]));
        return this;
      }
      process(css, opts = {}) {
        if (this.plugins.length === 0 && typeof opts.parser === "undefined" && typeof opts.stringifier === "undefined" && typeof opts.syntax === "undefined") {
          return new NoWorkResult(this, css, opts);
        } else {
          return new LazyResult(this, css, opts);
        }
      }
      normalize(plugins) {
        let normalized = [];
        for (let i of plugins) {
          if (i.postcss === true) {
            i = i();
          } else if (i.postcss) {
            i = i.postcss;
          }
          if (typeof i === "object" && Array.isArray(i.plugins)) {
            normalized = normalized.concat(i.plugins);
          } else if (typeof i === "object" && i.postcssPlugin) {
            normalized.push(i);
          } else if (typeof i === "function") {
            normalized.push(i);
          } else if (typeof i === "object" && (i.parse || i.stringify)) {
            if (process.env.NODE_ENV !== "production") {
              throw new Error("PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation.");
            }
          } else {
            throw new Error(i + " is not a PostCSS plugin");
          }
        }
        return normalized;
      }
    };
    module2.exports = Processor;
    Processor.default = Processor;
    Root.registerProcessor(Processor);
    Document.registerProcessor(Processor);
  }
});

// node_modules/postcss/lib/fromJSON.js
var require_fromJSON = __commonJS({
  "node_modules/postcss/lib/fromJSON.js"(exports, module2) {
    "use strict";
    var Declaration = require_declaration();
    var PreviousMap = require_previous_map();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Input = require_input();
    var Root = require_root();
    var Rule = require_rule();
    function fromJSON(json, inputs) {
      if (Array.isArray(json))
        return json.map((n) => fromJSON(n));
      let _a = json, { inputs: ownInputs } = _a, defaults = __objRest(_a, ["inputs"]);
      if (ownInputs) {
        inputs = [];
        for (let input of ownInputs) {
          let inputHydrated = __spreadProps(__spreadValues({}, input), { __proto__: Input.prototype });
          if (inputHydrated.map) {
            inputHydrated.map = __spreadProps(__spreadValues({}, inputHydrated.map), {
              __proto__: PreviousMap.prototype
            });
          }
          inputs.push(inputHydrated);
        }
      }
      if (defaults.nodes) {
        defaults.nodes = json.nodes.map((n) => fromJSON(n, inputs));
      }
      if (defaults.source) {
        let _b = defaults.source, { inputId } = _b, source = __objRest(_b, ["inputId"]);
        defaults.source = source;
        if (inputId != null) {
          defaults.source.input = inputs[inputId];
        }
      }
      if (defaults.type === "root") {
        return new Root(defaults);
      } else if (defaults.type === "decl") {
        return new Declaration(defaults);
      } else if (defaults.type === "rule") {
        return new Rule(defaults);
      } else if (defaults.type === "comment") {
        return new Comment(defaults);
      } else if (defaults.type === "atrule") {
        return new AtRule(defaults);
      } else {
        throw new Error("Unknown node type: " + json.type);
      }
    }
    module2.exports = fromJSON;
    fromJSON.default = fromJSON;
  }
});

// node_modules/postcss/lib/postcss.js
var require_postcss = __commonJS({
  "node_modules/postcss/lib/postcss.js"(exports, module2) {
    "use strict";
    var CssSyntaxError = require_css_syntax_error();
    var Declaration = require_declaration();
    var LazyResult = require_lazy_result();
    var Container = require_container();
    var Processor = require_processor();
    var stringify = require_stringify();
    var fromJSON = require_fromJSON();
    var Document = require_document();
    var Warning = require_warning();
    var Comment = require_comment();
    var AtRule = require_at_rule();
    var Result = require_result();
    var Input = require_input();
    var parse = require_parse();
    var list = require_list();
    var Rule = require_rule();
    var Root = require_root();
    var Node = require_node();
    function postcss(...plugins) {
      if (plugins.length === 1 && Array.isArray(plugins[0])) {
        plugins = plugins[0];
      }
      return new Processor(plugins);
    }
    postcss.plugin = function plugin(name, initializer) {
      let warningPrinted = false;
      function creator(...args) {
        if (console && console.warn && !warningPrinted) {
          warningPrinted = true;
          console.warn(name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration");
          if (process.env.LANG && process.env.LANG.startsWith("cn")) {
            console.warn(name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226");
          }
        }
        let transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor().version;
        return transformer;
      }
      let cache;
      Object.defineProperty(creator, "postcss", {
        get() {
          if (!cache)
            cache = creator();
          return cache;
        }
      });
      creator.process = function(css, processOpts, pluginOpts) {
        return postcss([creator(pluginOpts)]).process(css, processOpts);
      };
      return creator;
    };
    postcss.stringify = stringify;
    postcss.parse = parse;
    postcss.fromJSON = fromJSON;
    postcss.list = list;
    postcss.comment = (defaults) => new Comment(defaults);
    postcss.atRule = (defaults) => new AtRule(defaults);
    postcss.decl = (defaults) => new Declaration(defaults);
    postcss.rule = (defaults) => new Rule(defaults);
    postcss.root = (defaults) => new Root(defaults);
    postcss.document = (defaults) => new Document(defaults);
    postcss.CssSyntaxError = CssSyntaxError;
    postcss.Declaration = Declaration;
    postcss.Container = Container;
    postcss.Processor = Processor;
    postcss.Document = Document;
    postcss.Comment = Comment;
    postcss.Warning = Warning;
    postcss.AtRule = AtRule;
    postcss.Result = Result;
    postcss.Input = Input;
    postcss.Rule = Rule;
    postcss.Root = Root;
    postcss.Node = Node;
    LazyResult.registerPostcss(postcss);
    module2.exports = postcss;
    postcss.default = postcss;
  }
});

// node_modules/postcss-scss/lib/scss-stringifier.js
var require_scss_stringifier = __commonJS({
  "node_modules/postcss-scss/lib/scss-stringifier.js"(exports, module2) {
    var Stringifier = require_stringifier();
    var ScssStringifier = class extends Stringifier {
      comment(node) {
        let left = this.raw(node, "left", "commentLeft");
        let right = this.raw(node, "right", "commentRight");
        if (node.raws.inline) {
          let text = node.raws.text || node.text;
          this.builder("//" + left + text + right, node);
        } else {
          this.builder("/*" + left + node.text + right + "*/", node);
        }
      }
      decl(node, semicolon) {
        if (!node.isNested) {
          super.decl(node, semicolon);
        } else {
          let between = this.raw(node, "between", "colon");
          let string = node.prop + between + this.rawValue(node, "value");
          if (node.important) {
            string += node.raws.important || " !important";
          }
          this.builder(string + "{", node, "start");
          let after;
          if (node.nodes && node.nodes.length) {
            this.body(node);
            after = this.raw(node, "after");
          } else {
            after = this.raw(node, "after", "emptyBody");
          }
          if (after)
            this.builder(after);
          this.builder("}", node, "end");
        }
      }
      rawValue(node, prop) {
        let value = node[prop];
        let raw = node.raws[prop];
        if (raw && raw.value === value) {
          return raw.scss ? raw.scss : raw.raw;
        } else {
          return value;
        }
      }
    };
    module2.exports = ScssStringifier;
  }
});

// node_modules/postcss-scss/lib/scss-stringify.js
var require_scss_stringify = __commonJS({
  "node_modules/postcss-scss/lib/scss-stringify.js"(exports, module2) {
    var ScssStringifier = require_scss_stringifier();
    module2.exports = function scssStringify(node, builder) {
      let str = new ScssStringifier(builder);
      str.stringify(node);
    };
  }
});

// node_modules/postcss-scss/lib/nested-declaration.js
var require_nested_declaration = __commonJS({
  "node_modules/postcss-scss/lib/nested-declaration.js"(exports, module2) {
    var { Container } = require_postcss();
    var NestedDeclaration = class extends Container {
      constructor(defaults) {
        super(defaults);
        this.type = "decl";
        this.isNested = true;
        if (!this.nodes)
          this.nodes = [];
      }
    };
    module2.exports = NestedDeclaration;
  }
});

// node_modules/postcss-scss/lib/scss-tokenize.js
var require_scss_tokenize = __commonJS({
  "node_modules/postcss-scss/lib/scss-tokenize.js"(exports, module2) {
    "use strict";
    var SINGLE_QUOTE = "'".charCodeAt(0);
    var DOUBLE_QUOTE = '"'.charCodeAt(0);
    var BACKSLASH = "\\".charCodeAt(0);
    var SLASH = "/".charCodeAt(0);
    var NEWLINE = "\n".charCodeAt(0);
    var SPACE = " ".charCodeAt(0);
    var FEED = "\f".charCodeAt(0);
    var TAB = "	".charCodeAt(0);
    var CR = "\r".charCodeAt(0);
    var OPEN_SQUARE = "[".charCodeAt(0);
    var CLOSE_SQUARE = "]".charCodeAt(0);
    var OPEN_PARENTHESES = "(".charCodeAt(0);
    var CLOSE_PARENTHESES = ")".charCodeAt(0);
    var OPEN_CURLY = "{".charCodeAt(0);
    var CLOSE_CURLY = "}".charCodeAt(0);
    var SEMICOLON = ";".charCodeAt(0);
    var ASTERISK = "*".charCodeAt(0);
    var COLON = ":".charCodeAt(0);
    var AT = "@".charCodeAt(0);
    var COMMA = ",".charCodeAt(0);
    var HASH = "#".charCodeAt(0);
    var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    var RE_BAD_BRACKET = /.[\n"'(/\\]/;
    var RE_HEX_ESCAPE = /[\da-f]/i;
    var RE_NEW_LINE = /[\n\f\r]/g;
    module2.exports = function scssTokenize(input, options = {}) {
      let css = input.css.valueOf();
      let ignore = options.ignoreErrors;
      let code, next, quote, content, escape;
      let escaped, prev, n, currentToken;
      let length = css.length;
      let pos = 0;
      let buffer = [];
      let returned = [];
      let brackets;
      function position() {
        return pos;
      }
      function unclosed(what) {
        throw input.error("Unclosed " + what, pos);
      }
      function endOfFile() {
        return returned.length === 0 && pos >= length;
      }
      function interpolation() {
        let deep = 1;
        let stringQuote = false;
        let stringEscaped = false;
        while (deep > 0) {
          next += 1;
          if (css.length <= next)
            unclosed("interpolation");
          code = css.charCodeAt(next);
          n = css.charCodeAt(next + 1);
          if (stringQuote) {
            if (!stringEscaped && code === stringQuote) {
              stringQuote = false;
              stringEscaped = false;
            } else if (code === BACKSLASH) {
              stringEscaped = !stringEscaped;
            } else if (stringEscaped) {
              stringEscaped = false;
            }
          } else if (code === SINGLE_QUOTE || code === DOUBLE_QUOTE) {
            stringQuote = code;
          } else if (code === CLOSE_CURLY) {
            deep -= 1;
          } else if (code === HASH && n === OPEN_CURLY) {
            deep += 1;
          }
        }
      }
      function nextToken(opts) {
        if (returned.length)
          return returned.pop();
        if (pos >= length)
          return;
        let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
        code = css.charCodeAt(pos);
        switch (code) {
          case NEWLINE:
          case SPACE:
          case TAB:
          case CR:
          case FEED: {
            next = pos;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
            currentToken = ["space", css.slice(pos, next)];
            pos = next - 1;
            break;
          }
          case OPEN_SQUARE:
          case CLOSE_SQUARE:
          case OPEN_CURLY:
          case CLOSE_CURLY:
          case COLON:
          case SEMICOLON:
          case CLOSE_PARENTHESES: {
            let controlChar = String.fromCharCode(code);
            currentToken = [controlChar, controlChar, pos];
            break;
          }
          case COMMA: {
            currentToken = ["word", ",", pos, pos + 1];
            break;
          }
          case OPEN_PARENTHESES: {
            prev = buffer.length ? buffer.pop()[1] : "";
            n = css.charCodeAt(pos + 1);
            if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE) {
              brackets = 1;
              escaped = false;
              next = pos + 1;
              while (next <= css.length - 1) {
                n = css.charCodeAt(next);
                if (n === BACKSLASH) {
                  escaped = !escaped;
                } else if (n === OPEN_PARENTHESES) {
                  brackets += 1;
                } else if (n === CLOSE_PARENTHESES) {
                  brackets -= 1;
                  if (brackets === 0)
                    break;
                }
                next += 1;
              }
              content = css.slice(pos, next + 1);
              currentToken = ["brackets", content, pos, next];
              pos = next;
            } else {
              next = css.indexOf(")", pos + 1);
              content = css.slice(pos, next + 1);
              if (next === -1 || RE_BAD_BRACKET.test(content)) {
                currentToken = ["(", "(", pos];
              } else {
                currentToken = ["brackets", content, pos, next];
                pos = next;
              }
            }
            break;
          }
          case SINGLE_QUOTE:
          case DOUBLE_QUOTE: {
            quote = code;
            next = pos;
            escaped = false;
            while (next < length) {
              next++;
              if (next === length)
                unclosed("string");
              code = css.charCodeAt(next);
              n = css.charCodeAt(next + 1);
              if (!escaped && code === quote) {
                break;
              } else if (code === BACKSLASH) {
                escaped = !escaped;
              } else if (escaped) {
                escaped = false;
              } else if (code === HASH && n === OPEN_CURLY) {
                interpolation();
              }
            }
            currentToken = ["string", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case AT: {
            RE_AT_END.lastIndex = pos + 1;
            RE_AT_END.test(css);
            if (RE_AT_END.lastIndex === 0) {
              next = css.length - 1;
            } else {
              next = RE_AT_END.lastIndex - 2;
            }
            currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          case BACKSLASH: {
            next = pos;
            escape = true;
            while (css.charCodeAt(next + 1) === BACKSLASH) {
              next += 1;
              escape = !escape;
            }
            code = css.charCodeAt(next + 1);
            if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
              next += 1;
              if (RE_HEX_ESCAPE.test(css.charAt(next))) {
                while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
                  next += 1;
                }
                if (css.charCodeAt(next + 1) === SPACE) {
                  next += 1;
                }
              }
            }
            currentToken = ["word", css.slice(pos, next + 1), pos, next];
            pos = next;
            break;
          }
          default:
            n = css.charCodeAt(pos + 1);
            if (code === HASH && n === OPEN_CURLY) {
              next = pos;
              interpolation();
              content = css.slice(pos, next + 1);
              currentToken = ["word", content, pos, next];
              pos = next;
            } else if (code === SLASH && n === ASTERISK) {
              next = css.indexOf("*/", pos + 2) + 1;
              if (next === 0) {
                if (ignore || ignoreUnclosed) {
                  next = css.length;
                } else {
                  unclosed("comment");
                }
              }
              currentToken = ["comment", css.slice(pos, next + 1), pos, next];
              pos = next;
            } else if (code === SLASH && n === SLASH) {
              RE_NEW_LINE.lastIndex = pos + 1;
              RE_NEW_LINE.test(css);
              if (RE_NEW_LINE.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_NEW_LINE.lastIndex - 2;
              }
              content = css.slice(pos, next + 1);
              currentToken = ["comment", content, pos, next, "inline"];
              pos = next;
            } else {
              RE_WORD_END.lastIndex = pos + 1;
              RE_WORD_END.test(css);
              if (RE_WORD_END.lastIndex === 0) {
                next = css.length - 1;
              } else {
                next = RE_WORD_END.lastIndex - 2;
              }
              currentToken = ["word", css.slice(pos, next + 1), pos, next];
              buffer.push(currentToken);
              pos = next;
            }
            break;
        }
        pos++;
        return currentToken;
      }
      function back(token) {
        returned.push(token);
      }
      return {
        back,
        nextToken,
        endOfFile,
        position
      };
    };
  }
});

// node_modules/postcss-scss/lib/scss-parser.js
var require_scss_parser = __commonJS({
  "node_modules/postcss-scss/lib/scss-parser.js"(exports, module2) {
    var { Comment } = require_postcss();
    var Parser = require_parser();
    var NestedDeclaration = require_nested_declaration();
    var scssTokenizer = require_scss_tokenize();
    var ScssParser = class extends Parser {
      createTokenizer() {
        this.tokenizer = scssTokenizer(this.input);
      }
      rule(tokens) {
        let withColon = false;
        let brackets = 0;
        let value = "";
        for (let i of tokens) {
          if (withColon) {
            if (i[0] !== "comment" && i[0] !== "{") {
              value += i[1];
            }
          } else if (i[0] === "space" && i[1].includes("\n")) {
            break;
          } else if (i[0] === "(") {
            brackets += 1;
          } else if (i[0] === ")") {
            brackets -= 1;
          } else if (brackets === 0 && i[0] === ":") {
            withColon = true;
          }
        }
        if (!withColon || value.trim() === "" || /^[#:A-Za-z-]/.test(value)) {
          super.rule(tokens);
        } else {
          tokens.pop();
          let node = new NestedDeclaration();
          this.init(node, tokens[0][2]);
          let last;
          for (let i = tokens.length - 1; i >= 0; i--) {
            if (tokens[i][0] !== "space") {
              last = tokens[i];
              break;
            }
          }
          if (last[3]) {
            let pos = this.input.fromOffset(last[3]);
            node.source.end = { offset: last[3], line: pos.line, column: pos.col };
          } else {
            let pos = this.input.fromOffset(last[2]);
            node.source.end = { offset: last[2], line: pos.line, column: pos.col };
          }
          while (tokens[0][0] !== "word") {
            node.raws.before += tokens.shift()[1];
          }
          if (tokens[0][2]) {
            let pos = this.input.fromOffset(tokens[0][2]);
            node.source.start = {
              offset: tokens[0][2],
              line: pos.line,
              column: pos.col
            };
          }
          node.prop = "";
          while (tokens.length) {
            let type = tokens[0][0];
            if (type === ":" || type === "space" || type === "comment") {
              break;
            }
            node.prop += tokens.shift()[1];
          }
          node.raws.between = "";
          let token;
          while (tokens.length) {
            token = tokens.shift();
            if (token[0] === ":") {
              node.raws.between += token[1];
              break;
            } else {
              node.raws.between += token[1];
            }
          }
          if (node.prop[0] === "_" || node.prop[0] === "*") {
            node.raws.before += node.prop[0];
            node.prop = node.prop.slice(1);
          }
          node.raws.between += this.spacesAndCommentsFromStart(tokens);
          this.precheckMissedSemicolon(tokens);
          for (let i = tokens.length - 1; i > 0; i--) {
            token = tokens[i];
            if (token[1] === "!important") {
              node.important = true;
              let string = this.stringFrom(tokens, i);
              string = this.spacesFromEnd(tokens) + string;
              if (string !== " !important") {
                node.raws.important = string;
              }
              break;
            } else if (token[1] === "important") {
              let cache = tokens.slice(0);
              let str = "";
              for (let j = i; j > 0; j--) {
                let type = cache[j][0];
                if (str.trim().indexOf("!") === 0 && type !== "space") {
                  break;
                }
                str = cache.pop()[1] + str;
              }
              if (str.trim().indexOf("!") === 0) {
                node.important = true;
                node.raws.important = str;
                tokens = cache;
              }
            }
            if (token[0] !== "space" && token[0] !== "comment") {
              break;
            }
          }
          this.raw(node, "value", tokens);
          if (node.value.includes(":")) {
            this.checkMissedSemicolon(tokens);
          }
          this.current = node;
        }
      }
      comment(token) {
        if (token[4] === "inline") {
          let node = new Comment();
          this.init(node, token[2]);
          node.raws.inline = true;
          let pos = this.input.fromOffset(token[3]);
          node.source.end = { offset: token[3], line: pos.line, column: pos.col };
          let text = token[1].slice(2);
          if (/^\s*$/.test(text)) {
            node.text = "";
            node.raws.left = text;
            node.raws.right = "";
          } else {
            let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
            let fixed = match[2].replace(/(\*\/|\/\*)/g, "*//*");
            node.text = fixed;
            node.raws.left = match[1];
            node.raws.right = match[3];
            node.raws.text = match[2];
          }
        } else {
          super.comment(token);
        }
      }
      atrule(token) {
        let name = token[1];
        let prev = token;
        while (!this.tokenizer.endOfFile()) {
          let next = this.tokenizer.nextToken();
          if (next[0] === "word" && next[2] === prev[3] + 1) {
            name += next[1];
            prev = next;
          } else {
            this.tokenizer.back(next);
            break;
          }
        }
        super.atrule(["at-word", name, token[2], prev[3]]);
      }
      raw(node, prop, tokens, customProperty) {
        super.raw(node, prop, tokens, customProperty);
        if (node.raws[prop]) {
          let scss = node.raws[prop].raw;
          node.raws[prop].raw = tokens.reduce((all, i) => {
            if (i[0] === "comment" && i[4] === "inline") {
              let text = i[1].slice(2).replace(/(\*\/|\/\*)/g, "*//*");
              return all + "/*" + text + "*/";
            } else {
              return all + i[1];
            }
          }, "");
          if (scss !== node.raws[prop].raw) {
            node.raws[prop].scss = scss;
          }
        }
      }
    };
    module2.exports = ScssParser;
  }
});

// node_modules/postcss-scss/lib/scss-parse.js
var require_scss_parse = __commonJS({
  "node_modules/postcss-scss/lib/scss-parse.js"(exports, module2) {
    var { Input } = require_postcss();
    var ScssParser = require_scss_parser();
    module2.exports = function scssParse(scss, opts) {
      let input = new Input(scss, opts);
      let parser = new ScssParser(input);
      parser.parse();
      return parser.root;
    };
  }
});

// node_modules/postcss-scss/lib/scss-syntax.js
var require_scss_syntax = __commonJS({
  "node_modules/postcss-scss/lib/scss-syntax.js"(exports, module2) {
    var stringify = require_scss_stringify();
    var parse = require_scss_parse();
    module2.exports = { parse, stringify };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/constants.js
var require_constants = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MIXINS = exports.MDC_IMPORT_CHANGES = exports.MAT_IMPORT_CHANGES = exports.COMPONENTS = void 0;
    exports.COMPONENTS = [
      "autocomplete",
      "button",
      "core",
      "card",
      "checkbox",
      "chips",
      "dialog",
      "form-field",
      "input",
      "list",
      "menu",
      "paginator",
      "progress-bar",
      "progress-spinner",
      "radio",
      "select",
      "slide-toggle",
      "snack-bar",
      "slider",
      "table",
      "tabs",
      "tooltip"
    ];
    exports.MAT_IMPORT_CHANGES = exports.COMPONENTS.map((component) => ({
      old: `@angular/material/${component}`,
      new: `@angular/material/legacy-${component}`
    }));
    exports.MDC_IMPORT_CHANGES = exports.COMPONENTS.map((component) => ({
      old: `@angular/material-experimental/mdc-${component}`,
      new: `@angular/material/${component}`
    }));
    exports.MIXINS = exports.COMPONENTS.concat(["option", "optgroup"]).flatMap((component) => [
      `${component}-theme`,
      `${component}-color`,
      `${component}-density`,
      `${component}-typography`
    ]);
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/index.js
var require_legacy_components_v15 = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegacyComponentsMigration = void 0;
    var tslib_1 = require_tslib();
    var ts = tslib_1.__importStar(require("typescript"));
    var postcss = tslib_1.__importStar(require_postcss());
    var scss = tslib_1.__importStar(require_scss_syntax());
    var constants_1 = require_constants();
    var schematics_1 = require("@angular/cdk/schematics");
    var LegacyComponentsMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V15;
      }
      visitStylesheet(stylesheet) {
        let namespace = void 0;
        const processor = new postcss.Processor([
          {
            postcssPlugin: "legacy-components-v15-plugin",
            AtRule: {
              use: (node) => {
                namespace = namespace != null ? namespace : this._parseSassNamespace(node);
              },
              include: (node) => this._handleAtInclude(node, stylesheet.filePath, namespace)
            }
          }
        ]);
        processor.process(stylesheet.content, { syntax: scss }).sync();
      }
      _parseSassNamespace(node) {
        if (node.params.startsWith("@angular/material", 1)) {
          return node.params.split(/\s+/).pop();
        }
        return;
      }
      _handleAtInclude(node, filePath, namespace) {
        var _a;
        if (!namespace || !((_a = node.source) == null ? void 0 : _a.start)) {
          return;
        }
        if (this._isLegacyMixin(node, namespace)) {
          this._replaceAt(filePath, node.source.start.offset, {
            old: `${namespace}.`,
            new: `${namespace}.legacy-`
          });
        }
      }
      _isLegacyMixin(node, namespace) {
        for (let i = 0; i < constants_1.MIXINS.length; i++) {
          if (node.params.startsWith(`${namespace}.${constants_1.MIXINS[i]}`)) {
            return true;
          }
        }
        return false;
      }
      visitNode(node) {
        if (ts.isImportDeclaration(node)) {
          this._handleImportDeclaration(node);
          return;
        }
        if (this._isDestructuredAsyncLegacyImport(node)) {
          this._handleDestructuredAsyncImport(node);
          return;
        }
        if (this._isImportCallExpression(node)) {
          this._handleImportExpression(node);
          return;
        }
      }
      _handleImportDeclaration(node) {
        var _a;
        const moduleSpecifier = node.moduleSpecifier;
        const matImportChange = this._findMatImportChange(moduleSpecifier);
        if (matImportChange) {
          this._tsReplaceAt(node, matImportChange);
          if (((_a = node.importClause) == null ? void 0 : _a.namedBindings) && ts.isNamedImports(node.importClause.namedBindings)) {
            this._handleNamedImportBindings(node.importClause.namedBindings);
          }
        }
        const mdcImportChange = this._findMdcImportChange(moduleSpecifier);
        if (mdcImportChange) {
          this._tsReplaceAt(node, mdcImportChange);
        }
      }
      _handleImportExpression(node) {
        const moduleSpecifier = node.arguments[0];
        const matImportChange = this._findMatImportChange(moduleSpecifier);
        if (matImportChange) {
          this._tsReplaceAt(node, matImportChange);
          return;
        }
        const mdcImportChange = this._findMdcImportChange(moduleSpecifier);
        if (mdcImportChange) {
          this._tsReplaceAt(node, mdcImportChange);
        }
      }
      _handleDestructuredAsyncImport(node) {
        for (let i = 0; i < node.name.elements.length; i++) {
          this._handleNamedBindings(node.name.elements[i]);
        }
      }
      _handleNamedImportBindings(node) {
        for (let i = 0; i < node.elements.length; i++) {
          this._handleNamedBindings(node.elements[i]);
        }
      }
      _handleNamedBindings(node) {
        const name = node.propertyName ? node.propertyName : node.name;
        if (!ts.isIdentifier(name)) {
          return;
        }
        const separator = ts.isImportSpecifier(node) ? " as " : ": ";
        const oldExport = name.escapedText.toString();
        const newExport = this._parseMatSymbol(oldExport);
        if (newExport) {
          const replacement = node.propertyName ? newExport : `${newExport}${separator}${oldExport}`;
          this._tsReplaceAt(name, { old: oldExport, new: replacement });
          return;
        }
      }
      _parseMatSymbol(symbol) {
        if (symbol.startsWith("Mat")) {
          return `MatLegacy${symbol.slice("Mat".length)}`;
        }
        if (symbol.startsWith("mat")) {
          return `matLegacy${symbol.slice("mat".length)}`;
        }
        if (symbol.startsWith("_Mat")) {
          return `_MatLegacy${symbol.slice("_Mat".length)}`;
        }
        if (symbol.startsWith("MAT_")) {
          return `MAT_LEGACY_${symbol.slice("MAT_".length)}`;
        }
        if (symbol.startsWith("_MAT_")) {
          return `_MAT_LEGACY_${symbol.slice("_MAT_".length)}`;
        }
        return;
      }
      _isDestructuredAsyncLegacyImport(node) {
        return ts.isVariableDeclaration(node) && !!node.initializer && ts.isAwaitExpression(node.initializer) && this._isImportCallExpression(node.initializer.expression) && ts.isStringLiteral(node.initializer.expression.arguments[0]) && !!this._findMatImportChange(node.initializer.expression.arguments[0]) && ts.isObjectBindingPattern(node.name);
      }
      _isImportCallExpression(node) {
        return ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0]);
      }
      _findMatImportChange(moduleSpecifier) {
        return constants_1.MAT_IMPORT_CHANGES.find((change) => change.old === moduleSpecifier.text);
      }
      _findMdcImportChange(moduleSpecifier) {
        return constants_1.MDC_IMPORT_CHANGES.find((change) => change.old === moduleSpecifier.text);
      }
      _tsReplaceAt(node, str) {
        const filePath = this.fileSystem.resolve(node.getSourceFile().fileName);
        this._replaceAt(filePath, node.pos, str);
      }
      _replaceAt(filePath, offset, str) {
        const index = this.fileSystem.read(filePath).indexOf(str.old, offset);
        this.fileSystem.edit(filePath).remove(index, str.old.length).insertRight(index, str.new);
      }
    };
    exports.LegacyComponentsMigration = LegacyComponentsMigration2;
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/attribute-selectors.js
var require_attribute_selectors = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/attribute-selectors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.attributeSelectors = void 0;
    exports.attributeSelectors = {};
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/class-names.js
var require_class_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/class-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.classNames = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.classNames = {
      [schematics_1.TargetVersion.V10]: [
        {
          pr: "https://github.com/angular/components/pull/19289",
          changes: [{ replace: "MatButtonToggleGroupMultiple", replaceWith: "MatButtonToggleGroup" }]
        }
      ],
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10291",
          changes: [
            { replace: "FloatPlaceholderType", replaceWith: "FloatLabelType" },
            { replace: "MAT_PLACEHOLDER_GLOBAL_OPTIONS", replaceWith: "MAT_LABEL_GLOBAL_OPTIONS" },
            { replace: "PlaceholderOptions", replaceWith: "LabelOptions" }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/constructor-checks.js
var require_constructor_checks = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/constructor-checks.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.constructorChecks = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.constructorChecks = {
      [schematics_1.TargetVersion.V14]: [
        {
          pr: "https://github.com/angular/components/pull/23327",
          changes: ["MatSelectionList", "MatSelectionListChange"]
        }
      ],
      [schematics_1.TargetVersion.V13]: [
        {
          pr: "https://github.com/angular/components/pull/23389",
          changes: ["MatFormField"]
        },
        {
          pr: "https://github.com/angular/components/pull/23573",
          changes: ["MatDatepicker", "MatDateRangePicker"]
        },
        {
          pr: "https://github.com/angular/components/pull/23328",
          changes: ["MatStepper"]
        }
      ],
      [schematics_1.TargetVersion.V12]: [
        {
          pr: "https://github.com/angular/components/pull/21897",
          changes: ["MatTooltip"]
        },
        {
          pr: "https://github.com/angular/components/pull/21952",
          changes: ["MatDatepickerContent"]
        },
        {
          pr: "https://github.com/angular/components/issues/21900",
          changes: ["MatVerticalStepper", "MatStep"]
        }
      ],
      [schematics_1.TargetVersion.V11]: [
        {
          pr: "https://github.com/angular/components/issues/20463",
          changes: ["MatChip", "MatChipRemove"]
        },
        {
          pr: "https://github.com/angular/components/pull/20449",
          changes: ["MatDatepickerContent"]
        },
        {
          pr: "https://github.com/angular/components/pull/20545",
          changes: ["MatBottomSheet", "MatBottomSheetRef"]
        },
        {
          pr: "https://github.com/angular/components/issues/20535",
          changes: ["MatCheckbox"]
        },
        {
          pr: "https://github.com/angular/components/pull/20499",
          changes: ["MatPaginatedTabHeader", "MatTabBodyPortal", "MatTabNav", "MatTab"]
        },
        {
          pr: "https://github.com/angular/components/pull/20479",
          changes: ["MatCommonModule"]
        }
      ],
      [schematics_1.TargetVersion.V10]: [
        {
          pr: "https://github.com/angular/components/pull/19307",
          changes: ["MatSlideToggle"]
        },
        {
          pr: "https://github.com/angular/components/pull/19379",
          changes: ["MatSlider"]
        },
        {
          pr: "https://github.com/angular/components/pull/19372",
          changes: ["MatSortHeader"]
        },
        {
          pr: "https://github.com/angular/components/pull/19324",
          changes: ["MatAutocompleteTrigger"]
        },
        {
          pr: "https://github.com/angular/components/pull/19363",
          changes: ["MatTooltip"]
        },
        {
          pr: "https://github.com/angular/components/pull/19323",
          changes: ["MatIcon", "MatIconRegistry"]
        }
      ],
      [schematics_1.TargetVersion.V9]: [
        {
          pr: "https://github.com/angular/components/pull/17230",
          changes: ["MatSelect"]
        },
        {
          pr: "https://github.com/angular/components/pull/17333",
          changes: ["MatDialogRef"]
        }
      ],
      [schematics_1.TargetVersion.V8]: [
        {
          pr: "https://github.com/angular/components/pull/15647",
          changes: ["MatFormField", "MatTabLink", "MatVerticalStepper"]
        },
        { pr: "https://github.com/angular/components/pull/15757", changes: ["MatBadge"] },
        { pr: "https://github.com/angular/components/issues/15734", changes: ["MatButton", "MatAnchor"] },
        {
          pr: "https://github.com/angular/components/pull/15761",
          changes: ["MatSpinner", "MatProgressSpinner"]
        },
        { pr: "https://github.com/angular/components/pull/15723", changes: ["MatList", "MatListItem"] },
        { pr: "https://github.com/angular/components/pull/15722", changes: ["MatExpansionPanel"] },
        {
          pr: "https://github.com/angular/components/pull/15737",
          changes: ["MatTabHeader", "MatTabBody"]
        },
        { pr: "https://github.com/angular/components/pull/15806", changes: ["MatSlideToggle"] },
        { pr: "https://github.com/angular/components/pull/15773", changes: ["MatDrawerContainer"] }
      ],
      [schematics_1.TargetVersion.V7]: [
        {
          pr: "https://github.com/angular/components/pull/11706",
          changes: ["MatDrawerContent"]
        },
        { pr: "https://github.com/angular/components/pull/11706", changes: ["MatSidenavContent"] }
      ],
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/9190",
          changes: ["NativeDateAdapter"]
        },
        {
          pr: "https://github.com/angular/components/pull/10319",
          changes: ["MatAutocomplete"]
        },
        {
          pr: "https://github.com/angular/components/pull/10344",
          changes: ["MatTooltip"]
        },
        {
          pr: "https://github.com/angular/components/pull/10389",
          changes: ["MatIconRegistry"]
        },
        {
          pr: "https://github.com/angular/components/pull/9775",
          changes: ["MatCalendar"]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/css-selectors.js
var require_css_selectors = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/css-selectors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cssSelectors = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.cssSelectors = {
      [schematics_1.TargetVersion.V14]: [
        {
          pr: "https://github.com/angular/components/pull/23327",
          changes: [{ replace: ".mat-list-item-avatar", replaceWith: ".mat-list-item-with-avatar" }]
        }
      ],
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10296",
          changes: [
            { replace: ".mat-form-field-placeholder", replaceWith: ".mat-form-field-label" },
            { replace: ".mat-input-container", replaceWith: ".mat-form-field" },
            { replace: ".mat-input-flex", replaceWith: ".mat-form-field-flex" },
            { replace: ".mat-input-hint-spacer", replaceWith: ".mat-form-field-hint-spacer" },
            { replace: ".mat-input-hint-wrapper", replaceWith: ".mat-form-field-hint-wrapper" },
            { replace: ".mat-input-infix", replaceWith: ".mat-form-field-infix" },
            { replace: ".mat-input-invalid", replaceWith: ".mat-form-field-invalid" },
            { replace: ".mat-input-placeholder", replaceWith: ".mat-form-field-label" },
            { replace: ".mat-input-placeholder-wrapper", replaceWith: ".mat-form-field-label-wrapper" },
            { replace: ".mat-input-prefix", replaceWith: ".mat-form-field-prefix" },
            { replace: ".mat-input-ripple", replaceWith: ".mat-form-field-ripple" },
            { replace: ".mat-input-subscript-wrapper", replaceWith: ".mat-form-field-subscript-wrapper" },
            { replace: ".mat-input-suffix", replaceWith: ".mat-form-field-suffix" },
            { replace: ".mat-input-underline", replaceWith: ".mat-form-field-underline" },
            { replace: ".mat-input-wrapper", replaceWith: ".mat-form-field-wrapper" }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10430",
          changes: [
            {
              replace: "$mat-font-family",
              replaceWith: "Roboto, 'Helvetica Neue', sans-serif",
              replaceIn: { stylesheet: true }
            }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/element-selectors.js
var require_element_selectors = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/element-selectors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.elementSelectors = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.elementSelectors = {
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10297",
          changes: [{ replace: "mat-input-container", replaceWith: "mat-form-field" }]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/input-names.js
var require_input_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/input-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.inputNames = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.inputNames = {
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10218",
          changes: [
            {
              replace: "align",
              replaceWith: "labelPosition",
              limitedTo: { elements: ["mat-radio-group", "mat-radio-button"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10279",
          changes: [
            {
              replace: "align",
              replaceWith: "position",
              limitedTo: { elements: ["mat-drawer", "mat-sidenav"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10294",
          changes: [
            { replace: "dividerColor", replaceWith: "color", limitedTo: { elements: ["mat-form-field"] } },
            {
              replace: "floatPlaceholder",
              replaceWith: "floatLabel",
              limitedTo: { elements: ["mat-form-field"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10309",
          changes: [
            {
              replace: "mat-dynamic-height",
              replaceWith: "dynamicHeight",
              limitedTo: { elements: ["mat-tab-group"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10342",
          changes: [
            { replace: "align", replaceWith: "labelPosition", limitedTo: { elements: ["mat-checkbox"] } }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10344",
          changes: [
            {
              replace: "tooltip-position",
              replaceWith: "matTooltipPosition",
              limitedTo: { attributes: ["matTooltip"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10373",
          changes: [
            { replace: "thumb-label", replaceWith: "thumbLabel", limitedTo: { elements: ["mat-slider"] } },
            {
              replace: "tick-interval",
              replaceWith: "tickInterval",
              limitedTo: { elements: ["mat-slider"] }
            }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/method-call-checks.js
var require_method_call_checks = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/method-call-checks.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.methodCallChecks = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.methodCallChecks = {
      [schematics_1.TargetVersion.V11]: [
        {
          pr: "https://github.com/angular/components/pull/20499",
          changes: [
            {
              className: "MatTabNav",
              method: "updateActiveLink",
              invalidArgCounts: [{ count: 1, message: 'The "_element" parameter has been removed' }]
            }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/output-names.js
var require_output_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/output-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.outputNames = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.outputNames = {
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10163",
          changes: [
            {
              replace: "change",
              replaceWith: "selectionChange",
              limitedTo: {
                elements: ["mat-select"]
              }
            },
            {
              replace: "onClose",
              replaceWith: "closed",
              limitedTo: {
                elements: ["mat-select"]
              }
            },
            {
              replace: "onOpen",
              replaceWith: "opened",
              limitedTo: {
                elements: ["mat-select"]
              }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10279",
          changes: [
            {
              replace: "align-changed",
              replaceWith: "positionChanged",
              limitedTo: {
                elements: ["mat-drawer", "mat-sidenav"]
              }
            },
            {
              replace: "close",
              replaceWith: "closed",
              limitedTo: {
                elements: ["mat-drawer", "mat-sidenav"]
              }
            },
            {
              replace: "open",
              replaceWith: "opened",
              limitedTo: {
                elements: ["mat-drawer", "mat-sidenav"]
              }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10309",
          changes: [
            {
              replace: "selectChange",
              replaceWith: "selectedTabChange",
              limitedTo: {
                elements: ["mat-tab-group"]
              }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10311",
          changes: [
            {
              replace: "remove",
              replaceWith: "removed",
              limitedTo: {
                attributes: ["mat-chip", "mat-basic-chip"],
                elements: ["mat-chip", "mat-basic-chip"]
              }
            },
            {
              replace: "destroy",
              replaceWith: "destroyed",
              limitedTo: {
                attributes: ["mat-chip", "mat-basic-chip"],
                elements: ["mat-chip", "mat-basic-chip"]
              }
            }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/property-names.js
var require_property_names = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/property-names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyNames = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.propertyNames = {
      [schematics_1.TargetVersion.V11]: [
        {
          pr: "https://github.com/angular/components/pull/20449",
          changes: [
            {
              replace: "getPopupConnectionElementRef",
              replaceWith: "getConnectedOverlayOrigin",
              limitedTo: { classes: ["MatDatepickerInput"] }
            }
          ]
        }
      ],
      [schematics_1.TargetVersion.V9]: [
        {
          pr: "https://github.com/angular/components/pull/17333",
          changes: [
            {
              replace: "afterOpen",
              replaceWith: "afterOpened",
              limitedTo: { classes: ["MatDialogRef"] }
            },
            {
              replace: "beforeClose",
              replaceWith: "beforeClosed",
              limitedTo: { classes: ["MatDialogRef"] }
            },
            {
              replace: "afterOpen",
              replaceWith: "afterOpened",
              limitedTo: { classes: ["MatDialog"] }
            }
          ]
        }
      ],
      [schematics_1.TargetVersion.V6]: [
        {
          pr: "https://github.com/angular/components/pull/10163",
          changes: [
            { replace: "change", replaceWith: "selectionChange", limitedTo: { classes: ["MatSelect"] } },
            {
              replace: "onOpen",
              replaceWith: "openedChange.pipe(filter(isOpen => isOpen))",
              limitedTo: { classes: ["MatSelect"] }
            },
            {
              replace: "onClose",
              replaceWith: "openedChange.pipe(filter(isOpen => !isOpen))",
              limitedTo: { classes: ["MatSelect"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10218",
          changes: [
            {
              replace: "align",
              replaceWith: "labelPosition",
              limitedTo: { classes: ["MatRadioGroup", "MatRadioButton"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10253",
          changes: [
            {
              replace: "extraClasses",
              replaceWith: "panelClass",
              limitedTo: { classes: ["MatSnackBarConfig"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10279",
          changes: [
            {
              replace: "align",
              replaceWith: "position",
              limitedTo: { classes: ["MatDrawer", "MatSidenav"] }
            },
            {
              replace: "onAlignChanged",
              replaceWith: "onPositionChanged",
              limitedTo: { classes: ["MatDrawer", "MatSidenav"] }
            },
            {
              replace: "onOpen",
              replaceWith: "openedChange.pipe(filter(isOpen => isOpen))",
              limitedTo: { classes: ["MatDrawer", "MatSidenav"] }
            },
            {
              replace: "onClose",
              replaceWith: "openedChange.pipe(filter(isOpen => !isOpen))",
              limitedTo: { classes: ["MatDrawer", "MatSidenav"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10293",
          changes: [
            {
              replace: "shouldPlaceholderFloat",
              replaceWith: "shouldLabelFloat",
              limitedTo: { classes: ["MatFormFieldControl", "MatSelect"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10294",
          changes: [
            { replace: "dividerColor", replaceWith: "color", limitedTo: { classes: ["MatFormField"] } },
            {
              replace: "floatPlaceholder",
              replaceWith: "floatLabel",
              limitedTo: { classes: ["MatFormField"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10309",
          changes: [
            {
              replace: "selectChange",
              replaceWith: "selectedTabChange",
              limitedTo: { classes: ["MatTabGroup"] }
            },
            {
              replace: "_dynamicHeightDeprecated",
              replaceWith: "dynamicHeight",
              limitedTo: { classes: ["MatTabGroup"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10311",
          changes: [
            { replace: "destroy", replaceWith: "destroyed", limitedTo: { classes: ["MatChip"] } },
            { replace: "onRemove", replaceWith: "removed", limitedTo: { classes: ["MatChip"] } }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10342",
          changes: [
            { replace: "align", replaceWith: "labelPosition", limitedTo: { classes: ["MatCheckbox"] } }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10344",
          changes: [
            {
              replace: "_positionDeprecated",
              replaceWith: "position",
              limitedTo: { classes: ["MatTooltip"] }
            }
          ]
        },
        {
          pr: "https://github.com/angular/components/pull/10373",
          changes: [
            {
              replace: "_thumbLabelDeprecated",
              replaceWith: "thumbLabel",
              limitedTo: { classes: ["MatSlider"] }
            },
            {
              replace: "_tickIntervalDeprecated",
              replaceWith: "tickInterval",
              limitedTo: { classes: ["MatSlider"] }
            }
          ]
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/symbol-removal.js
var require_symbol_removal = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/symbol-removal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.symbolRemoval = void 0;
    var schematics_1 = require("@angular/cdk/schematics");
    exports.symbolRemoval = {
      [schematics_1.TargetVersion.V13]: [
        {
          pr: "https://github.com/angular/components/pull/23529",
          changes: [
            "CanColorCtor",
            "CanDisableRippleCtor",
            "CanDisableCtor",
            "CanUpdateErrorStateCtor",
            "HasInitializedCtor",
            "HasTabIndexCtor"
          ].map((name) => ({
            name,
            module: "@angular/material/core",
            message: `\`${name}\` is no longer necessary and has been removed.`
          }))
        }
      ]
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/index.js
var require_data = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/data/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_attribute_selectors(), exports);
    tslib_1.__exportStar(require_class_names(), exports);
    tslib_1.__exportStar(require_constructor_checks(), exports);
    tslib_1.__exportStar(require_css_selectors(), exports);
    tslib_1.__exportStar(require_element_selectors(), exports);
    tslib_1.__exportStar(require_input_names(), exports);
    tslib_1.__exportStar(require_method_call_checks(), exports);
    tslib_1.__exportStar(require_output_names(), exports);
    tslib_1.__exportStar(require_property_names(), exports);
    tslib_1.__exportStar(require_symbol_removal(), exports);
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/upgrade-data.js
var require_upgrade_data = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/upgrade-data.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.materialUpgradeData = void 0;
    var data_1 = require_data();
    exports.materialUpgradeData = {
      attributeSelectors: data_1.attributeSelectors,
      classNames: data_1.classNames,
      constructorChecks: data_1.constructorChecks,
      cssSelectors: data_1.cssSelectors,
      elementSelectors: data_1.elementSelectors,
      inputNames: data_1.inputNames,
      methodCallChecks: data_1.methodCallChecks,
      outputNames: data_1.outputNames,
      propertyNames: data_1.propertyNames,
      symbolRemoval: data_1.symbolRemoval
    };
  }
});

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/index.mjs
var ng_update_exports = {};
__export(ng_update_exports, {
  updateToV10: () => updateToV10,
  updateToV11: () => updateToV11,
  updateToV12: () => updateToV12,
  updateToV13: () => updateToV13,
  updateToV14: () => updateToV14,
  updateToV15: () => updateToV15,
  updateToV6: () => updateToV6,
  updateToV7: () => updateToV7,
  updateToV8: () => updateToV8,
  updateToV9: () => updateToV9
});
module.exports = __toCommonJS(ng_update_exports);
var import_schematics = require("@angular/cdk/schematics");
var import_hammer_gestures_migration = __toESM(require_hammer_gestures_migration(), 1);
var import_misc_class_inheritance = __toESM(require_misc_class_inheritance(), 1);
var import_misc_class_names = __toESM(require_misc_class_names(), 1);
var import_misc_imports = __toESM(require_misc_imports(), 1);
var import_misc_property_names = __toESM(require_misc_property_names(), 1);
var import_misc_template = __toESM(require_misc_template(), 1);
var import_ripple_speed_factor_migration = __toESM(require_ripple_speed_factor_migration(), 1);
var import_secondary_entry_points_migration = __toESM(require_secondary_entry_points_migration(), 1);
var import_theming_api_migration = __toESM(require_theming_api_migration(), 1);
var import_legacy_components_v15 = __toESM(require_legacy_components_v15(), 1);
var import_upgrade_data = __toESM(require_upgrade_data(), 1);
var materialMigrations = [
  import_misc_class_inheritance.MiscClassInheritanceMigration,
  import_misc_class_names.MiscClassNamesMigration,
  import_misc_imports.MiscImportsMigration,
  import_misc_property_names.MiscPropertyNamesMigration,
  import_misc_template.MiscTemplateMigration,
  import_ripple_speed_factor_migration.RippleSpeedFactorMigration,
  import_secondary_entry_points_migration.SecondaryEntryPointsMigration,
  import_hammer_gestures_migration.HammerGesturesMigration,
  import_theming_api_migration.ThemingApiMigration,
  import_legacy_components_v15.LegacyComponentsMigration
];
function updateToV6() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V6, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV7() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V7, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV8() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V8, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV9() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V9, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV10() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V10, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV11() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V11, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV12() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V12, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV13() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V13, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV14() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V14, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function updateToV15() {
  return (0, import_schematics.createMigrationSchematicRule)(import_schematics.TargetVersion.V15, materialMigrations, import_upgrade_data.materialUpgradeData, onMigrationComplete);
}
function onMigrationComplete(context, targetVersion, hasFailures) {
  context.logger.info("");
  context.logger.info(`  \u2713  Updated Angular Material to ${targetVersion}`);
  context.logger.info("");
  if (hasFailures) {
    context.logger.warn("  \u26A0  Some issues were detected but could not be fixed automatically. Please check the output above and fix these issues manually.");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateToV10,
  updateToV11,
  updateToV12,
  updateToV13,
  updateToV14,
  updateToV15,
  updateToV6,
  updateToV7,
  updateToV8,
  updateToV9
});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=index_bundled.js.map
