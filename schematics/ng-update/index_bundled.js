var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/index.js
var require_legacy_components_v15 = __commonJS({
  "bazel-out/k8-fastbuild/bin/src/material/schematics/ng-update/migrations/legacy-components-v15/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LegacyComponentsMigration = void 0;
    var tslib_1 = require_tslib();
    var schematics_1 = require("@angular/cdk/schematics");
    var ts = tslib_1.__importStar(require("typescript"));
    var LegacyComponentsMigration2 = class extends schematics_1.Migration {
      constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V15;
      }
      visitNode(node) {
        if (ts.isImportDeclaration(node)) {
          this._handleImportDeclaration(node);
          return;
        }
        if (this._isDestructuredAsyncImport(node)) {
          this._handleDestructuredAsyncImport(node);
          return;
        }
        if (this._isImportCallExpression(node)) {
          this._handleImportExpression(node);
          return;
        }
      }
      _handleDestructuredAsyncImport(node) {
        for (let i = 0; i < node.name.elements.length; i++) {
          const n = node.name.elements[i];
          const name = n.propertyName ? n.propertyName : n.name;
          if (ts.isIdentifier(name)) {
            const oldExport = name.escapedText.toString();
            const suffix = oldExport.slice("Mat".length);
            const newExport = n.propertyName ? `MatLegacy${suffix}` : `MatLegacy${suffix}: Mat${suffix}`;
            this._replaceAt(name, { old: oldExport, new: newExport });
          }
        }
      }
      _handleImportDeclaration(node) {
        var _a;
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier.text.startsWith("@angular/material/")) {
          this._replaceAt(node, { old: "@angular/material/", new: "@angular/material/legacy-" });
          if (((_a = node.importClause) == null ? void 0 : _a.namedBindings) && ts.isNamedImports(node.importClause.namedBindings)) {
            this._handleNamedImportBindings(node.importClause.namedBindings);
          }
        }
      }
      _handleImportExpression(node) {
        const moduleSpecifier = node.arguments[0];
        if (moduleSpecifier.text.startsWith("@angular/material/")) {
          this._replaceAt(node, { old: "@angular/material/", new: "@angular/material/legacy-" });
        }
      }
      _handleNamedImportBindings(node) {
        for (let i = 0; i < node.elements.length; i++) {
          const n = node.elements[i];
          const name = n.propertyName ? n.propertyName : n.name;
          const oldExport = name.escapedText.toString();
          const suffix = oldExport.slice("Mat".length);
          const newExport = n.propertyName ? `MatLegacy${suffix}` : `MatLegacy${suffix} as Mat${suffix}`;
          this._replaceAt(name, { old: oldExport, new: newExport });
        }
      }
      _isDestructuredAsyncImport(node) {
        return ts.isVariableDeclaration(node) && !!node.initializer && ts.isAwaitExpression(node.initializer) && ts.isCallExpression(node.initializer.expression) && ts.SyntaxKind.ImportKeyword === node.initializer.expression.expression.kind && ts.isObjectBindingPattern(node.name);
      }
      _isImportCallExpression(node) {
        return ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length === 1 && ts.isStringLiteralLike(node.arguments[0]);
      }
      _replaceAt(node, str) {
        const filePath = this.fileSystem.resolve(node.getSourceFile().fileName);
        const index = this.fileSystem.read(filePath).indexOf(str.old, node.pos);
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
