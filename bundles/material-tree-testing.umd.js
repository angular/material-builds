(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/testing'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/tree/testing', ['exports', '@angular/cdk/testing', '@angular/cdk/coercion'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.tree = global.ng.material.tree || {}, global.ng.material.tree.testing = {}), global.ng.cdk.testing, global.ng.cdk.coercion));
}(this, (function (exports, testing, coercion) { 'use strict';

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
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
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
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
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
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
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
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /** Harness for interacting with a standard Angular Material tree node. */
    var MatTreeNodeHarness = /** @class */ (function (_super) {
        __extends(MatTreeNodeHarness, _super);
        function MatTreeNodeHarness() {
            var _this = _super.apply(this, __spreadArray([], __read(arguments))) || this;
            _this._toggle = _this.locatorForOptional('[matTreeNodeToggle]');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a tree node with specific attributes.
         * @param options Options for narrowing the search
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatTreeNodeHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return getNodePredicate(MatTreeNodeHarness, options);
        };
        /** Whether the tree node is expanded. */
        MatTreeNodeHarness.prototype.isExpanded = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-expanded')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the tree node is disabled. */
        MatTreeNodeHarness.prototype.isDisabled = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getProperty('aria-disabled')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets the level of the tree node. Note that this gets the aria-level and is 1 indexed. */
        MatTreeNodeHarness.prototype.getLevel = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = coercion.coerceNumberProperty;
                            return [4 /*yield*/, this.host()];
                        case 1: return [4 /*yield*/, (_b.sent()).getAttribute('aria-level')];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets the tree node's text. */
        MatTreeNodeHarness.prototype.getText = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).text({ exclude: '.mat-tree-node, .mat-nested-tree-node, button' })];
                    }
                });
            });
        };
        /** Toggles node between expanded/collapsed. Only works when node is not disabled. */
        MatTreeNodeHarness.prototype.toggle = function () {
            return __awaiter(this, void 0, void 0, function () {
                var toggle;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._toggle()];
                        case 1:
                            toggle = _a.sent();
                            if (toggle) {
                                return [2 /*return*/, toggle.click()];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Expands the node if it is collapsed. Only works when node is not disabled. */
        MatTreeNodeHarness.prototype.expand = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isExpanded()];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toggle()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /** Collapses the node if it is expanded. Only works when node is not disabled. */
        MatTreeNodeHarness.prototype.collapse = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isExpanded()];
                        case 1:
                            if (!_a.sent()) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.toggle()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return MatTreeNodeHarness;
    }(testing.ContentContainerComponentHarness));
    /** The selector of the host element of a `MatTreeNode` instance. */
    MatTreeNodeHarness.hostSelector = '.mat-tree-node, .mat-nested-tree-node';
    function getNodePredicate(type, options) {
        var _this = this;
        return new testing.HarnessPredicate(type, options)
            .addOption('text', options.text, function (harness, text) { return testing.HarnessPredicate.stringMatches(harness.getText(), text); })
            .addOption('disabled', options.disabled, function (harness, disabled) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isDisabled()];
                case 1: return [2 /*return*/, (_a.sent()) === disabled];
            }
        }); }); })
            .addOption('expanded', options.expanded, function (harness, expanded) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.isExpanded()];
                case 1: return [2 /*return*/, (_a.sent()) === expanded];
            }
        }); }); })
            .addOption('level', options.level, function (harness, level) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, harness.getLevel()];
                case 1: return [2 /*return*/, (_a.sent()) === level];
            }
        }); }); });
    }

    /** Harness for interacting with a standard mat-tree in tests. */
    var MatTreeHarness = /** @class */ (function (_super) {
        __extends(MatTreeHarness, _super);
        function MatTreeHarness() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a tree with specific attributes.
         * @param options Options for narrowing the search
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatTreeHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new testing.HarnessPredicate(MatTreeHarness, options);
        };
        /** Gets all of the nodes in the tree. */
        MatTreeHarness.prototype.getNodes = function (filter) {
            if (filter === void 0) { filter = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_d) {
                    return [2 /*return*/, this.locatorForAll(MatTreeNodeHarness.with(filter))()];
                });
            });
        };
        /**
         * Gets an object representation for the visible tree structure
         * If a node is under an unexpanded node it will not be included.
         * Eg.
         * Tree (all nodes expanded):
         * `
         * <mat-tree>
         *   <mat-tree-node>Node 1<mat-tree-node>
         *   <mat-nested-tree-node>
         *     Node 2
         *     <mat-nested-tree-node>
         *       Node 2.1
         *       <mat-tree-node>
         *         Node 2.1.1
         *       <mat-tree-node>
         *     <mat-nested-tree-node>
         *     <mat-tree-node>
         *       Node 2.2
         *     <mat-tree-node>
         *   <mat-nested-tree-node>
         * </mat-tree>`
         *
         * Tree structure:
         * {
         *  children: [
         *    {
         *      text: 'Node 1',
         *      children: [
         *        {
         *          text: 'Node 2',
         *          children: [
         *            {
         *              text: 'Node 2.1',
         *              children: [{text: 'Node 2.1.1'}]
         *            },
         *            {text: 'Node 2.2'}
         *          ]
         *        }
         *      ]
         *    }
         *  ]
         * };
         */
        MatTreeHarness.prototype.getTreeStructure = function () {
            return __awaiter(this, void 0, void 0, function () {
                var nodes, nodeInformation;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.getNodes()];
                        case 1:
                            nodes = _d.sent();
                            return [4 /*yield*/, testing.parallel(function () { return nodes.map(function (node) {
                                    return testing.parallel(function () { return [node.getLevel(), node.getText(), node.isExpanded()]; });
                                }); })];
                        case 2:
                            nodeInformation = _d.sent();
                            return [2 /*return*/, this._getTreeStructure(nodeInformation, 1, true)];
                    }
                });
            });
        };
        /**
         * Recursively collect the structured text of the tree nodes.
         * @param nodes A list of tree nodes
         * @param level The level of nodes that are being accounted for during this iteration
         * @param parentExpanded Whether the parent of the first node in param nodes is expanded
         */
        MatTreeHarness.prototype._getTreeStructure = function (nodes, level, parentExpanded) {
            var _a, _b, _c;
            var result = {};
            for (var i = 0; i < nodes.length; i++) {
                var _d = __read(nodes[i], 3), nodeLevel = _d[0], text = _d[1], expanded = _d[2];
                var nextNodeLevel = (_b = (_a = nodes[i + 1]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : -1;
                // Return the accumulated value for the current level once we reach a shallower level node
                if (nodeLevel < level) {
                    return result;
                }
                // Skip deeper level nodes during this iteration, they will be picked up in a later iteration
                if (nodeLevel > level) {
                    continue;
                }
                // Only add to representation if it is visible (parent is expanded)
                if (parentExpanded) {
                    // Collect the data under this node according to the following rules:
                    // 1. If the next node in the list is a sibling of the current node add it to the child list
                    // 2. If the next node is a child of the current node, get the sub-tree structure for the
                    //    child and add it under this node
                    // 3. If the next node has a shallower level, we've reached the end of the child nodes for
                    //    the current parent.
                    if (nextNodeLevel === level) {
                        this._addChildToNode(result, { text: text });
                    }
                    else if (nextNodeLevel > level) {
                        var children = (_c = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)) === null || _c === void 0 ? void 0 : _c.children;
                        var child = children ? { text: text, children: children } : { text: text };
                        this._addChildToNode(result, child);
                    }
                    else {
                        this._addChildToNode(result, { text: text });
                        return result;
                    }
                }
            }
            return result;
        };
        MatTreeHarness.prototype._addChildToNode = function (result, child) {
            result.children ? result.children.push(child) : result.children = [child];
        };
        return MatTreeHarness;
    }(testing.ComponentHarness));
    /** The selector for the host element of a `MatTableHarness` instance. */
    MatTreeHarness.hostSelector = '.mat-tree';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    exports.MatTreeHarness = MatTreeHarness;
    exports.MatTreeNodeHarness = MatTreeNodeHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-tree-testing.umd.js.map
