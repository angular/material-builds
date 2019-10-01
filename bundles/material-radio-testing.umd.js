(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/cdk/coercion')) :
    typeof define === 'function' && define.amd ? define('@angular/material/radio/testing', ['exports', 'tslib', '@angular/cdk/coercion'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.radio = global.ng.material.radio || {}, global.ng.material.radio.testing = {}), global.tslib, global.ng.cdk.coercion));
}(this, function (exports, tslib_1, coercion) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Base class for component harnesses that all component harness authors should extend. This base
     * component harness provides the basic ability to locate element and sub-component harness. It
     * should be inherited when defining user's own harness.
     */
    var ComponentHarness = /** @class */ (function () {
        function ComponentHarness(locatorFactory) {
            this.locatorFactory = locatorFactory;
        }
        /** Gets a `Promise` for the `TestElement` representing the host element of the component. */
        ComponentHarness.prototype.host = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this.locatorFactory.rootElement];
                });
            });
        };
        /**
         * Gets a `LocatorFactory` for the document root element. This factory can be used to create
         * locators for elements that a component creates outside of its own root element. (e.g. by
         * appending to document.body).
         */
        ComponentHarness.prototype.documentRootLocatorFactory = function () {
            return this.locatorFactory.documentRootLocatorFactory();
        };
        ComponentHarness.prototype.locatorFor = function (arg) {
            return this.locatorFactory.locatorFor(arg);
        };
        ComponentHarness.prototype.locatorForOptional = function (arg) {
            return this.locatorFactory.locatorForOptional(arg);
        };
        ComponentHarness.prototype.locatorForAll = function (arg) {
            return this.locatorFactory.locatorForAll(arg);
        };
        /**
         * Flushes change detection and async tasks.
         * In most cases it should not be necessary to call this manually. However, there may be some edge
         * cases where it is needed to fully flush animation events.
         */
        ComponentHarness.prototype.forceStabilize = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    return [2 /*return*/, this.locatorFactory.forceStabilize()];
                });
            });
        };
        return ComponentHarness;
    }());
    /**
     * A class used to associate a ComponentHarness class with predicates functions that can be used to
     * filter instances of the class.
     */
    var HarnessPredicate = /** @class */ (function () {
        function HarnessPredicate(harnessType, options) {
            this.harnessType = harnessType;
            this._predicates = [];
            this._descriptions = [];
            this._addBaseOptions(options);
        }
        /**
         * Checks if a string matches the given pattern.
         * @param s The string to check, or a Promise for the string to check.
         * @param pattern The pattern the string is expected to match. If `pattern` is a string, `s` is
         *   expected to match exactly. If `pattern` is a regex, a partial match is allowed.
         * @return A Promise that resolves to whether the string matches the pattern.
         */
        HarnessPredicate.stringMatches = function (s, pattern) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, s];
                        case 1:
                            s = _a.sent();
                            return [2 /*return*/, typeof pattern === 'string' ? s === pattern : pattern.test(s)];
                    }
                });
            });
        };
        /**
         * Adds a predicate function to be run against candidate harnesses.
         * @param description A description of this predicate that may be used in error messages.
         * @param predicate An async predicate function.
         * @return this (for method chaining).
         */
        HarnessPredicate.prototype.add = function (description, predicate) {
            this._descriptions.push(description);
            this._predicates.push(predicate);
            return this;
        };
        /**
         * Adds a predicate function that depends on an option value to be run against candidate
         * harnesses. If the option value is undefined, the predicate will be ignored.
         * @param name The name of the option (may be used in error messages).
         * @param option The option value.
         * @param predicate The predicate function to run if the option value is not undefined.
         * @return this (for method chaining).
         */
        HarnessPredicate.prototype.addOption = function (name, option, predicate) {
            // Add quotes around strings to differentiate them from other values
            var value = typeof option === 'string' ? "\"" + option + "\"" : "" + option;
            if (option !== undefined) {
                this.add(name + " = " + value, function (item) { return predicate(item, option); });
            }
            return this;
        };
        /**
         * Filters a list of harnesses on this predicate.
         * @param harnesses The list of harnesses to filter.
         * @return A list of harnesses that satisfy this predicate.
         */
        HarnessPredicate.prototype.filter = function (harnesses) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var results;
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(harnesses.map(function (h) { return _this.evaluate(h); }))];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, harnesses.filter(function (_, i) { return results[i]; })];
                    }
                });
            });
        };
        /**
         * Evaluates whether the given harness satisfies this predicate.
         * @param harness The harness to check
         * @return A promise that resolves to true if the harness satisfies this predicate,
         *   and resolves to false otherwise.
         */
        HarnessPredicate.prototype.evaluate = function (harness) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var results;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.all(this._predicates.map(function (p) { return p(harness); }))];
                        case 1:
                            results = _a.sent();
                            return [2 /*return*/, results.reduce(function (combined, current) { return combined && current; }, true)];
                    }
                });
            });
        };
        /** Gets a description of this predicate for use in error messages. */
        HarnessPredicate.prototype.getDescription = function () {
            return this._descriptions.join(', ');
        };
        /** Gets the selector used to find candidate elements. */
        HarnessPredicate.prototype.getSelector = function () {
            var _this = this;
            return this._ancestor.split(',')
                .map(function (part) { return (part.trim() + " " + _this.harnessType.hostSelector).trim(); })
                .join(',');
        };
        /** Adds base options common to all harness types. */
        HarnessPredicate.prototype._addBaseOptions = function (options) {
            var _this = this;
            this._ancestor = options.ancestor || '';
            if (this._ancestor) {
                this._descriptions.push("has ancestor matching selector \"" + this._ancestor + "\"");
            }
            var selector = options.selector;
            if (selector !== undefined) {
                this.add("host matches selector \"" + selector + "\"", function (item) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, item.host()];
                            case 1: return [2 /*return*/, (_a.sent()).matchesSelector(selector)];
                        }
                    });
                }); });
            }
        };
        return HarnessPredicate;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Creates a browser MouseEvent with the specified options.
     * @docs-private
     */
    function createMouseEvent(type, x, y, button) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (button === void 0) { button = 0; }
        var event = document.createEvent('MouseEvent');
        var originalPreventDefault = event.preventDefault;
        event.initMouseEvent(type, true, /* canBubble */ true, /* cancelable */ window, /* view */ 0, /* detail */ x, /* screenX */ y, /* screenY */ x, /* clientX */ y, /* clientY */ false, /* ctrlKey */ false, /* altKey */ false, /* shiftKey */ false, /* metaKey */ button, /* button */ null /* relatedTarget */);
        // `initMouseEvent` doesn't allow us to pass the `buttons` and
        // defaults it to 0 which looks like a fake event.
        Object.defineProperty(event, 'buttons', { get: function () { return 1; } });
        // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
        event.preventDefault = function () {
            Object.defineProperty(event, 'defaultPrevented', { get: function () { return true; } });
            return originalPreventDefault.apply(this, arguments);
        };
        return event;
    }
    /**
     * Creates a browser TouchEvent with the specified pointer coordinates.
     * @docs-private
     */
    function createTouchEvent(type, pageX, pageY) {
        if (pageX === void 0) { pageX = 0; }
        if (pageY === void 0) { pageY = 0; }
        // In favor of creating events that work for most of the browsers, the event is created
        // as a basic UI Event. The necessary details for the event will be set manually.
        var event = document.createEvent('UIEvent');
        var touchDetails = { pageX: pageX, pageY: pageY };
        event.initUIEvent(type, true, true, window, 0);
        // Most of the browsers don't have a "initTouchEvent" method that can be used to define
        // the touch details.
        Object.defineProperties(event, {
            touches: { value: [touchDetails] },
            targetTouches: { value: [touchDetails] },
            changedTouches: { value: [touchDetails] }
        });
        return event;
    }
    /**
     * Dispatches a keydown event from an element.
     * @docs-private
     */
    function createKeyboardEvent(type, keyCode, key, target, modifiers) {
        if (keyCode === void 0) { keyCode = 0; }
        if (key === void 0) { key = ''; }
        if (modifiers === void 0) { modifiers = {}; }
        var event = document.createEvent('KeyboardEvent');
        var originalPreventDefault = event.preventDefault;
        // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
        if (event.initKeyEvent) {
            event.initKeyEvent(type, true, true, window, modifiers.control, modifiers.alt, modifiers.shift, modifiers.meta, keyCode);
        }
        else {
            // `initKeyboardEvent` expects to receive modifiers as a whitespace-delimited string
            // See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/initKeyboardEvent
            var modifiersStr = (modifiers.control ? 'Control ' : '' + modifiers.alt ? 'Alt ' : '' +
                modifiers.shift ? 'Shift ' : '' + modifiers.meta ? 'Meta' : '').trim();
            event.initKeyboardEvent(type, true, /* canBubble */ true, /* cancelable */ window, /* view */ 0, /* char */ key, /* key */ 0, /* location */ modifiersStr, /* modifiersList */ false /* repeat */);
        }
        // Webkit Browsers don't set the keyCode when calling the init function.
        // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
        Object.defineProperties(event, {
            keyCode: { get: function () { return keyCode; } },
            key: { get: function () { return key; } },
            target: { get: function () { return target; } },
            ctrlKey: { get: function () { return !!modifiers.control; } },
            altKey: { get: function () { return !!modifiers.alt; } },
            shiftKey: { get: function () { return !!modifiers.shift; } },
            metaKey: { get: function () { return !!modifiers.meta; } }
        });
        // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
        event.preventDefault = function () {
            Object.defineProperty(event, 'defaultPrevented', { get: function () { return true; } });
            return originalPreventDefault.apply(this, arguments);
        };
        return event;
    }
    /**
     * Creates a fake event object with any desired event type.
     * @docs-private
     */
    function createFakeEvent(type, canBubble, cancelable) {
        if (canBubble === void 0) { canBubble = false; }
        if (cancelable === void 0) { cancelable = true; }
        var event = document.createEvent('Event');
        event.initEvent(type, canBubble, cancelable);
        return event;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Utility to dispatch any event on a Node.
     * @docs-private
     */
    function dispatchEvent(node, event) {
        node.dispatchEvent(event);
        return event;
    }
    /**
     * Shorthand to dispatch a fake event on a specified node.
     * @docs-private
     */
    function dispatchFakeEvent(node, type, canBubble) {
        return dispatchEvent(node, createFakeEvent(type, canBubble));
    }
    /**
     * Shorthand to dispatch a keyboard event with a specified key code.
     * @docs-private
     */
    function dispatchKeyboardEvent(node, type, keyCode, key, target, modifiers) {
        return dispatchEvent(node, createKeyboardEvent(type, keyCode, key, target, modifiers));
    }
    /**
     * Shorthand to dispatch a mouse event on the specified coordinates.
     * @docs-private
     */
    function dispatchMouseEvent(node, type, x, y, event) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (event === void 0) { event = createMouseEvent(type, x, y); }
        return dispatchEvent(node, event);
    }
    /**
     * Shorthand to dispatch a touch event on the specified coordinates.
     * @docs-private
     */
    function dispatchTouchEvent(node, type, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return dispatchEvent(node, createTouchEvent(type, x, y));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function triggerFocusChange(element, event) {
        var eventFired = false;
        var handler = function () { return eventFired = true; };
        element.addEventListener(event, handler);
        element[event]();
        element.removeEventListener(event, handler);
        if (!eventFired) {
            dispatchFakeEvent(element, event);
        }
    }
    /**
     * Patches an elements focus and blur methods to emit events consistently and predictably.
     * This is necessary, because some browsers, like IE11, will call the focus handlers asynchronously,
     * while others won't fire them at all if the browser window is not focused.
     * @docs-private
     */
    function patchElementFocus(element) {
        element.focus = function () { return dispatchFakeEvent(element, 'focus'); };
        element.blur = function () { return dispatchFakeEvent(element, 'blur'); };
    }
    /** @docs-private */
    function triggerFocus(element) {
        triggerFocusChange(element, 'focus');
    }
    /** @docs-private */
    function triggerBlur(element) {
        triggerFocusChange(element, 'blur');
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Base harness environment class that can be extended to allow `ComponentHarness`es to be used in
     * different test environments (e.g. testbed, protractor, etc.). This class implements the
     * functionality of both a `HarnessLoader` and `LocatorFactory`. This class is generic on the raw
     * element type, `E`, used by the particular test environment.
     */
    var HarnessEnvironment = /** @class */ (function () {
        function HarnessEnvironment(rawRootElement) {
            this.rawRootElement = rawRootElement;
            this.rootElement = this.createTestElement(rawRootElement);
        }
        // Implemented as part of the `LocatorFactory` interface.
        HarnessEnvironment.prototype.documentRootLocatorFactory = function () {
            return this.createEnvironment(this.getDocumentRoot());
        };
        HarnessEnvironment.prototype.locatorFor = function (arg) {
            var _this = this;
            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(typeof arg === 'string')) return [3 /*break*/, 2];
                            _a = this.createTestElement;
                            return [4 /*yield*/, this._assertElementFound(arg)];
                        case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                        case 2: return [2 /*return*/, this._assertHarnessFound(arg)];
                    }
                });
            }); };
        };
        HarnessEnvironment.prototype.locatorForOptional = function (arg) {
            var _this = this;
            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var element, candidates;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(typeof arg === 'string')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAllRawElements(arg)];
                        case 1:
                            element = (_a.sent())[0];
                            return [2 /*return*/, element ? this.createTestElement(element) : null];
                        case 2: return [4 /*yield*/, this._getAllHarnesses(arg)];
                        case 3:
                            candidates = _a.sent();
                            return [2 /*return*/, candidates[0] || null];
                    }
                });
            }); };
        };
        HarnessEnvironment.prototype.locatorForAll = function (arg) {
            var _this = this;
            return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(typeof arg === 'string')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getAllRawElements(arg)];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (e) { return _this.createTestElement(e); })];
                        case 2: return [2 /*return*/, this._getAllHarnesses(arg)];
                    }
                });
            }); };
        };
        // Implemented as part of the `HarnessLoader` interface.
        HarnessEnvironment.prototype.getHarness = function (harnessType) {
            return this.locatorFor(harnessType)();
        };
        // Implemented as part of the `HarnessLoader` interface.
        HarnessEnvironment.prototype.getAllHarnesses = function (harnessType) {
            return this.locatorForAll(harnessType)();
        };
        // Implemented as part of the `HarnessLoader` interface.
        HarnessEnvironment.prototype.getChildLoader = function (selector) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.createEnvironment;
                            return [4 /*yield*/, this._assertElementFound(selector)];
                        case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                    }
                });
            });
        };
        // Implemented as part of the `HarnessLoader` interface.
        HarnessEnvironment.prototype.getAllChildLoaders = function (selector) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAllRawElements(selector)];
                        case 1: return [2 /*return*/, (_a.sent()).map(function (e) { return _this.createEnvironment(e); })];
                    }
                });
            });
        };
        /** Creates a `ComponentHarness` for the given harness type with the given raw host element. */
        HarnessEnvironment.prototype.createComponentHarness = function (harnessType, element) {
            return new harnessType(this.createEnvironment(element));
        };
        HarnessEnvironment.prototype._getAllHarnesses = function (harnessType) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var harnessPredicate, elements;
                var _this = this;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            harnessPredicate = harnessType instanceof HarnessPredicate ?
                                harnessType : new HarnessPredicate(harnessType, {});
                            return [4 /*yield*/, this.getAllRawElements(harnessPredicate.getSelector())];
                        case 1:
                            elements = _a.sent();
                            return [2 /*return*/, harnessPredicate.filter(elements.map(function (element) { return _this.createComponentHarness(harnessPredicate.harnessType, element); }))];
                    }
                });
            });
        };
        HarnessEnvironment.prototype._assertElementFound = function (selector) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var element;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAllRawElements(selector)];
                        case 1:
                            element = (_a.sent())[0];
                            if (!element) {
                                throw Error("Expected to find element matching selector: \"" + selector + "\", but none was found");
                            }
                            return [2 /*return*/, element];
                    }
                });
            });
        };
        HarnessEnvironment.prototype._assertHarnessFound = function (harnessType) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var harness;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getAllHarnesses(harnessType)];
                        case 1:
                            harness = (_a.sent())[0];
                            if (!harness) {
                                throw _getErrorForMissingHarness(harnessType);
                            }
                            return [2 /*return*/, harness];
                    }
                });
            });
        };
        return HarnessEnvironment;
    }());
    function _getErrorForMissingHarness(harnessType) {
        var harnessPredicate = harnessType instanceof HarnessPredicate ? harnessType : new HarnessPredicate(harnessType, {});
        var _a = harnessPredicate.harnessType, name = _a.name, hostSelector = _a.hostSelector;
        var restrictions = harnessPredicate.getDescription();
        var message = "Expected to find element for " + name + " matching selector: \"" + hostSelector + "\"";
        if (restrictions) {
            message += " (with restrictions: " + restrictions + ")";
        }
        message += ', but none was found';
        return Error(message);
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** An enum of non-text keys that can be used with the `sendKeys` method. */
    // NOTE: This is a separate enum from `@angular/cdk/keycodes` because we don't necessarily want to
    // support every possible keyCode. We also can't rely on Protractor's `Key` because we don't want a
    // dependency on any particular testing framework here. Instead we'll just maintain this supported
    // list of keys and let individual concrete `HarnessEnvironment` classes map them to whatever key
    // representation is used in its respective testing framework.
    var TestKey;
    (function (TestKey) {
        TestKey[TestKey["BACKSPACE"] = 0] = "BACKSPACE";
        TestKey[TestKey["TAB"] = 1] = "TAB";
        TestKey[TestKey["ENTER"] = 2] = "ENTER";
        TestKey[TestKey["SHIFT"] = 3] = "SHIFT";
        TestKey[TestKey["CONTROL"] = 4] = "CONTROL";
        TestKey[TestKey["ALT"] = 5] = "ALT";
        TestKey[TestKey["ESCAPE"] = 6] = "ESCAPE";
        TestKey[TestKey["PAGE_UP"] = 7] = "PAGE_UP";
        TestKey[TestKey["PAGE_DOWN"] = 8] = "PAGE_DOWN";
        TestKey[TestKey["END"] = 9] = "END";
        TestKey[TestKey["HOME"] = 10] = "HOME";
        TestKey[TestKey["LEFT_ARROW"] = 11] = "LEFT_ARROW";
        TestKey[TestKey["UP_ARROW"] = 12] = "UP_ARROW";
        TestKey[TestKey["RIGHT_ARROW"] = 13] = "RIGHT_ARROW";
        TestKey[TestKey["DOWN_ARROW"] = 14] = "DOWN_ARROW";
        TestKey[TestKey["INSERT"] = 15] = "INSERT";
        TestKey[TestKey["DELETE"] = 16] = "DELETE";
        TestKey[TestKey["F1"] = 17] = "F1";
        TestKey[TestKey["F2"] = 18] = "F2";
        TestKey[TestKey["F3"] = 19] = "F3";
        TestKey[TestKey["F4"] = 20] = "F4";
        TestKey[TestKey["F5"] = 21] = "F5";
        TestKey[TestKey["F6"] = 22] = "F6";
        TestKey[TestKey["F7"] = 23] = "F7";
        TestKey[TestKey["F8"] = 24] = "F8";
        TestKey[TestKey["F9"] = 25] = "F9";
        TestKey[TestKey["F10"] = 26] = "F10";
        TestKey[TestKey["F11"] = 27] = "F11";
        TestKey[TestKey["F12"] = 28] = "F12";
        TestKey[TestKey["META"] = 29] = "META";
    })(TestKey || (TestKey = {}));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Checks whether the given Element is a text input element.
     * @docs-private
     */
    function isTextInput(element) {
        return element.nodeName.toLowerCase() === 'input' ||
            element.nodeName.toLowerCase() === 'textarea';
    }
    function typeInElement(element) {
        var e_1, _a;
        var modifiersAndKeys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            modifiersAndKeys[_i - 1] = arguments[_i];
        }
        var first = modifiersAndKeys[0];
        var modifiers;
        var rest;
        if (typeof first !== 'string' && first.keyCode === undefined && first.key === undefined) {
            modifiers = first;
            rest = modifiersAndKeys.slice(1);
        }
        else {
            modifiers = {};
            rest = modifiersAndKeys;
        }
        var keys = rest
            .map(function (k) { return typeof k === 'string' ?
            k.split('').map(function (c) { return ({ keyCode: c.toUpperCase().charCodeAt(0), key: c }); }) : [k]; })
            .reduce(function (arr, k) { return arr.concat(k); }, []);
        triggerFocus(element);
        try {
            for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                dispatchKeyboardEvent(element, 'keydown', key.keyCode, key.key, element, modifiers);
                dispatchKeyboardEvent(element, 'keypress', key.keyCode, key.key, element, modifiers);
                if (isTextInput(element) && key.key && key.key.length === 1) {
                    element.value += key.key;
                    dispatchFakeEvent(element, 'input');
                }
                dispatchKeyboardEvent(element, 'keyup', key.keyCode, key.key, element, modifiers);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * Clears the text in an input or textarea element.
     * @docs-private
     */
    function clearElement(element) {
        triggerFocus(element);
        element.value = '';
        dispatchFakeEvent(element, 'input');
    }

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

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Harness for interacting with a standard mat-radio-group in tests.
     * @dynamic
     */
    var MatRadioGroupHarness = /** @class */ (function (_super) {
        tslib_1.__extends(MatRadioGroupHarness, _super);
        function MatRadioGroupHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._radioButtons = _this.locatorForAll(MatRadioButtonHarness);
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a radio-group with
         * specific attributes.
         * @param options Options for narrowing the search:
         *   - `selector` finds a radio-group whose host element matches the given selector.
         *   - `name` finds a radio-group with specific name.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatRadioGroupHarness.with = function (options) {
            if (options === void 0) { options = {}; }
            return new HarnessPredicate(MatRadioGroupHarness, options)
                .addOption('name', options.name, this._checkRadioGroupName);
        };
        /** Gets the name of the radio-group. */
        MatRadioGroupHarness.prototype.getName = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var hostName, radioNames;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._getGroupNameFromHost()];
                        case 1:
                            hostName = _a.sent();
                            // It's not possible to always determine the "name" of a radio-group by reading
                            // the attribute. This is because the radio-group does not set the "name" as an
                            // element attribute if the "name" value is set through a binding.
                            if (hostName !== null) {
                                return [2 /*return*/, hostName];
                            }
                            return [4 /*yield*/, this._getNamesFromRadioButtons()];
                        case 2:
                            radioNames = _a.sent();
                            if (!radioNames.length) {
                                return [2 /*return*/, null];
                            }
                            if (!this._checkRadioNamesInGroupEqual(radioNames)) {
                                throw Error('Radio buttons in radio-group have mismatching names.');
                            }
                            return [2 /*return*/, radioNames[0]];
                    }
                });
            });
        };
        /** Gets the id of the radio-group. */
        MatRadioGroupHarness.prototype.getId = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                    }
                });
            });
        };
        /** Gets the selected radio-button in a radio-group. */
        MatRadioGroupHarness.prototype.getSelectedRadioButton = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var _a, _b, radioButton, e_1_1;
                var e_1, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 6, 7, 8]);
                            return [4 /*yield*/, this.getRadioButtons()];
                        case 1:
                            _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                            _d.label = 2;
                        case 2:
                            if (!!_b.done) return [3 /*break*/, 5];
                            radioButton = _b.value;
                            return [4 /*yield*/, radioButton.isChecked()];
                        case 3:
                            if (_d.sent()) {
                                return [2 /*return*/, radioButton];
                            }
                            _d.label = 4;
                        case 4:
                            _b = _a.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/, null];
                    }
                });
            });
        };
        /** Gets the selected value of the radio-group. */
        MatRadioGroupHarness.prototype.getSelectedValue = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var selectedRadio;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getSelectedRadioButton()];
                        case 1:
                            selectedRadio = _a.sent();
                            if (!selectedRadio) {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, selectedRadio.getValue()];
                    }
                });
            });
        };
        /** Gets all radio buttons which are part of the radio-group. */
        MatRadioGroupHarness.prototype.getRadioButtons = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._radioButtons()];
                        case 1: return [2 /*return*/, (_a.sent())];
                    }
                });
            });
        };
        MatRadioGroupHarness.prototype._getGroupNameFromHost = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        MatRadioGroupHarness.prototype._getNamesFromRadioButtons = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var groupNames, _a, _b, radio, radioName, e_2_1;
                var e_2, _c;
                return tslib_1.__generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            groupNames = [];
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 7, 8, 9]);
                            return [4 /*yield*/, this.getRadioButtons()];
                        case 2:
                            _a = tslib_1.__values.apply(void 0, [_d.sent()]), _b = _a.next();
                            _d.label = 3;
                        case 3:
                            if (!!_b.done) return [3 /*break*/, 6];
                            radio = _b.value;
                            return [4 /*yield*/, radio.getName()];
                        case 4:
                            radioName = _d.sent();
                            if (radioName !== null) {
                                groupNames.push(radioName);
                            }
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_2_1 = _d.sent();
                            e_2 = { error: e_2_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, groupNames];
                    }
                });
            });
        };
        /** Checks if the specified radio names are all equal. */
        MatRadioGroupHarness.prototype._checkRadioNamesInGroupEqual = function (radioNames) {
            var e_3, _a;
            var groupName = null;
            try {
                for (var radioNames_1 = tslib_1.__values(radioNames), radioNames_1_1 = radioNames_1.next(); !radioNames_1_1.done; radioNames_1_1 = radioNames_1.next()) {
                    var radioName = radioNames_1_1.value;
                    if (groupName === null) {
                        groupName = radioName;
                    }
                    else if (groupName !== radioName) {
                        return false;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (radioNames_1_1 && !radioNames_1_1.done && (_a = radioNames_1.return)) _a.call(radioNames_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return true;
        };
        /**
         * Checks if a radio-group harness has the given name. Throws if a radio-group with
         * matching name could be found but has mismatching radio-button names.
         */
        MatRadioGroupHarness._checkRadioGroupName = function (harness, name) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var radioNames;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, harness._getGroupNameFromHost()];
                        case 1:
                            // Check if there is a radio-group which has the "name" attribute set
                            // to the expected group name. It's not possible to always determine
                            // the "name" of a radio-group by reading the attribute. This is because
                            // the radio-group does not set the "name" as an element attribute if the
                            // "name" value is set through a binding.
                            if ((_a.sent()) === name) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, harness._getNamesFromRadioButtons()];
                        case 2:
                            radioNames = _a.sent();
                            if (radioNames.indexOf(name) === -1) {
                                return [2 /*return*/, false];
                            }
                            if (!harness._checkRadioNamesInGroupEqual(radioNames)) {
                                throw Error("The locator found a radio-group with name \"" + name + "\", but some " +
                                    "radio-button's within the group have mismatching names, which is invalid.");
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        MatRadioGroupHarness.hostSelector = 'mat-radio-group';
        return MatRadioGroupHarness;
    }(ComponentHarness));
    /**
     * Harness for interacting with a standard mat-radio-button in tests.
     * @dynamic
     */
    var MatRadioButtonHarness = /** @class */ (function (_super) {
        tslib_1.__extends(MatRadioButtonHarness, _super);
        function MatRadioButtonHarness() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._textLabel = _this.locatorFor('.mat-radio-label-content');
            _this._clickLabel = _this.locatorFor('.mat-radio-label');
            _this._input = _this.locatorFor('input');
            return _this;
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a radio-button with
         * specific attributes.
         * @param options Options for narrowing the search:
         *   - `selector` finds a radio-button whose host element matches the given selector.
         *   - `label` finds a radio-button with specific label text.
         *   - `name` finds a radio-button with specific name.
         * @return a `HarnessPredicate` configured with the given options.
         */
        MatRadioButtonHarness.with = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return new HarnessPredicate(MatRadioButtonHarness, options)
                .addOption('label', options.label, function (harness, label) { return HarnessPredicate.stringMatches(harness.getLabelText(), label); })
                .addOption('name', options.name, function (harness, name) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, harness.getName()];
                    case 1: return [2 /*return*/, (_a.sent()) === name];
                }
            }); }); });
        };
        /** Whether the radio-button is checked. */
        MatRadioButtonHarness.prototype.isChecked = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var checked, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            checked = (_b.sent()).getProperty('checked');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, checked];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the radio-button is disabled. */
        MatRadioButtonHarness.prototype.isDisabled = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var disabled, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            disabled = (_b.sent()).getAttribute('disabled');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, disabled];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Whether the radio-button is required. */
        MatRadioButtonHarness.prototype.isRequired = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var required, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1:
                            required = (_b.sent()).getAttribute('required');
                            _a = coercion.coerceBooleanProperty;
                            return [4 /*yield*/, required];
                        case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                    }
                });
            });
        };
        /** Gets a promise for the radio-button's name. */
        MatRadioButtonHarness.prototype.getName = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getAttribute('name')];
                    }
                });
            });
        };
        /** Gets a promise for the radio-button's id. */
        MatRadioButtonHarness.prototype.getId = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.host()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('id')];
                    }
                });
            });
        };
        /**
         * Gets the value of the radio-button. The radio-button value will be
         * converted to a string.
         *
         * Note that this means that radio-button's with objects as value will
         * intentionally have the `[object Object]` as return value.
         */
        MatRadioButtonHarness.prototype.getValue = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).getProperty('value')];
                    }
                });
            });
        };
        /** Gets a promise for the radio-button's label text. */
        MatRadioButtonHarness.prototype.getLabelText = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._textLabel()];
                        case 1: return [2 /*return*/, (_a.sent()).text()];
                    }
                });
            });
        };
        /**
         * Focuses the radio-button and returns a void promise that indicates when the
         * action is complete.
         */
        MatRadioButtonHarness.prototype.focus = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).focus()];
                    }
                });
            });
        };
        /**
         * Blurs the radio-button and returns a void promise that indicates when the
         * action is complete.
         */
        MatRadioButtonHarness.prototype.blur = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._input()];
                        case 1: return [2 /*return*/, (_a.sent()).blur()];
                    }
                });
            });
        };
        /**
         * Puts the radio-button in a checked state by clicking it if it is currently unchecked,
         * or doing nothing if it is already checked. Returns a void promise that indicates when
         * the action is complete.
         */
        MatRadioButtonHarness.prototype.check = function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isChecked()];
                        case 1:
                            if (!!(_a.sent())) return [3 /*break*/, 3];
                            return [4 /*yield*/, this._clickLabel()];
                        case 2: return [2 /*return*/, (_a.sent()).click()];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        MatRadioButtonHarness.hostSelector = 'mat-radio-button';
        return MatRadioButtonHarness;
    }(ComponentHarness));

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

    exports.MatRadioGroupHarness = MatRadioGroupHarness;
    exports.MatRadioButtonHarness = MatRadioButtonHarness;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=material-radio-testing.umd.js.map
