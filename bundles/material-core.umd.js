(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/cdk/a11y'), require('@angular/cdk/bidi'), require('@angular/cdk'), require('tslib'), require('@angular/cdk/coercion'), require('rxjs'), require('@angular/cdk/platform'), require('@angular/platform-browser'), require('rxjs/operators'), require('@angular/common'), require('@angular/platform-browser/animations'), require('@angular/cdk/keycodes')) :
    typeof define === 'function' && define.amd ? define('@angular/material/core', ['exports', '@angular/core', '@angular/cdk/a11y', '@angular/cdk/bidi', '@angular/cdk', 'tslib', '@angular/cdk/coercion', 'rxjs', '@angular/cdk/platform', '@angular/platform-browser', 'rxjs/operators', '@angular/common', '@angular/platform-browser/animations', '@angular/cdk/keycodes'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.core = {}), global.ng.core, global.ng.cdk.a11y, global.ng.cdk.bidi, global.ng.cdk, global.tslib, global.ng.cdk.coercion, global.rxjs, global.ng.cdk.platform, global.ng.platformBrowser, global.rxjs.operators, global.ng.common, global.ng.platformBrowser.animations, global.ng.cdk.keycodes));
}(this, (function (exports, i0, a11y, bidi, cdk, tslib, coercion, rxjs, platform, platformBrowser, operators, common, animations, keycodes) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Current version of Angular Material. */
    var VERSION = new i0.Version('9.0.0-sha-198911f5c');

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @docs-private */
    var AnimationCurves = /** @class */ (function () {
        function AnimationCurves() {
        }
        AnimationCurves.STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
        AnimationCurves.DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
        AnimationCurves.ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
        AnimationCurves.SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
        return AnimationCurves;
    }());
    /** @docs-private */
    var AnimationDurations = /** @class */ (function () {
        function AnimationDurations() {
        }
        AnimationDurations.COMPLEX = '375ms';
        AnimationDurations.ENTERING = '225ms';
        AnimationDurations.EXITING = '195ms';
        return AnimationDurations;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // Private version constant to circumvent test/build issues,
    // i.e. avoid core to depend on the @angular/material primary entry-point
    // Can be removed once the Material primary entry-point no longer
    // re-exports all secondary entry-points
    var VERSION$1 = new i0.Version('9.0.0-sha-198911f5c');
    /** @docs-private */
    function MATERIAL_SANITY_CHECKS_FACTORY() {
        return true;
    }
    /** Injection token that configures whether the Material sanity checks are enabled. */
    var MATERIAL_SANITY_CHECKS = new i0.InjectionToken('mat-sanity-checks', {
        providedIn: 'root',
        factory: MATERIAL_SANITY_CHECKS_FACTORY,
    });
    /**
     * Module that captures anything that should be loaded and/or run for *all* Angular Material
     * components. This includes Bidi, etc.
     *
     * This module should be imported to each top-level component module (e.g., MatTabsModule).
     */
    var MatCommonModule = /** @class */ (function () {
        function MatCommonModule(highContrastModeDetector, sanityChecks) {
            /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
            this._hasDoneGlobalChecks = false;
            /** Reference to the global `document` object. */
            this._document = typeof document === 'object' && document ? document : null;
            /** Reference to the global 'window' object. */
            this._window = typeof window === 'object' && window ? window : null;
            // While A11yModule also does this, we repeat it here to avoid importing A11yModule
            // in MatCommonModule.
            highContrastModeDetector._applyBodyHighContrastModeCssClasses();
            // Note that `_sanityChecks` is typed to `any`, because AoT
            // throws an error if we use the `SanityChecks` type directly.
            this._sanityChecks = sanityChecks;
            if (!this._hasDoneGlobalChecks) {
                this._checkDoctypeIsDefined();
                this._checkThemeIsPresent();
                this._checkCdkVersionMatch();
                this._hasDoneGlobalChecks = true;
            }
        }
        /** Whether any sanity checks are enabled. */
        MatCommonModule.prototype._checksAreEnabled = function () {
            return i0.isDevMode() && !this._isTestEnv();
        };
        /** Whether the code is running in tests. */
        MatCommonModule.prototype._isTestEnv = function () {
            var window = this._window;
            return window && (window.__karma__ || window.jasmine);
        };
        MatCommonModule.prototype._checkDoctypeIsDefined = function () {
            var isEnabled = this._checksAreEnabled() &&
                (this._sanityChecks === true || this._sanityChecks.doctype);
            if (isEnabled && this._document && !this._document.doctype) {
                console.warn('Current document does not have a doctype. This may cause ' +
                    'some Angular Material components not to behave as expected.');
            }
        };
        MatCommonModule.prototype._checkThemeIsPresent = function () {
            // We need to assert that the `body` is defined, because these checks run very early
            // and the `body` won't be defined if the consumer put their scripts in the `head`.
            var isDisabled = !this._checksAreEnabled() ||
                (this._sanityChecks === false || !this._sanityChecks.theme);
            if (isDisabled || !this._document || !this._document.body ||
                typeof getComputedStyle !== 'function') {
                return;
            }
            var testElement = this._document.createElement('div');
            testElement.classList.add('mat-theme-loaded-marker');
            this._document.body.appendChild(testElement);
            var computedStyle = getComputedStyle(testElement);
            // In some situations the computed style of the test element can be null. For example in
            // Firefox, the computed style is null if an application is running inside of a hidden iframe.
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
            if (computedStyle && computedStyle.display !== 'none') {
                console.warn('Could not find Angular Material core theme. Most Material ' +
                    'components may not work as expected. For more info refer ' +
                    'to the theming guide: https://material.angular.io/guide/theming');
            }
            this._document.body.removeChild(testElement);
        };
        /** Checks whether the material version matches the cdk version */
        MatCommonModule.prototype._checkCdkVersionMatch = function () {
            var isEnabled = this._checksAreEnabled() &&
                (this._sanityChecks === true || this._sanityChecks.version);
            if (isEnabled && VERSION$1.full !== cdk.VERSION.full) {
                console.warn('The Angular Material version (' + VERSION$1.full + ') does not match ' +
                    'the Angular CDK version (' + cdk.VERSION.full + ').\n' +
                    'Please ensure the versions of these two packages exactly match.');
            }
        };
        MatCommonModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [bidi.BidiModule],
                        exports: [bidi.BidiModule],
                    },] }
        ];
        /** @nocollapse */
        MatCommonModule.ctorParameters = function () { return [
            { type: a11y.HighContrastModeDetector },
            { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MATERIAL_SANITY_CHECKS,] }] }
        ]; };
        return MatCommonModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Mixin to augment a directive with a `disabled` property. */
    function mixinDisabled(base) {
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                _this._disabled = false;
                return _this;
            }
            Object.defineProperty(class_1.prototype, "disabled", {
                get: function () { return this._disabled; },
                set: function (value) { this._disabled = coercion.coerceBooleanProperty(value); },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(base));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Mixin to augment a directive with a `color` property. */
    function mixinColor(base, defaultColor) {
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                // Set the default color that can be specified from the mixin.
                _this.color = defaultColor;
                return _this;
            }
            Object.defineProperty(class_1.prototype, "color", {
                get: function () { return this._color; },
                set: function (value) {
                    var colorPalette = value || defaultColor;
                    if (colorPalette !== this._color) {
                        if (this._color) {
                            this._elementRef.nativeElement.classList.remove("mat-" + this._color);
                        }
                        if (colorPalette) {
                            this._elementRef.nativeElement.classList.add("mat-" + colorPalette);
                        }
                        this._color = colorPalette;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(base));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Mixin to augment a directive with a `disableRipple` property. */
    function mixinDisableRipple(base) {
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                _this._disableRipple = false;
                return _this;
            }
            Object.defineProperty(class_1.prototype, "disableRipple", {
                /** Whether the ripple effect is disabled or not. */
                get: function () { return this._disableRipple; },
                set: function (value) { this._disableRipple = coercion.coerceBooleanProperty(value); },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(base));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Mixin to augment a directive with a `tabIndex` property. */
    function mixinTabIndex(base, defaultTabIndex) {
        if (defaultTabIndex === void 0) { defaultTabIndex = 0; }
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                _this._tabIndex = defaultTabIndex;
                return _this;
            }
            Object.defineProperty(class_1.prototype, "tabIndex", {
                get: function () { return this.disabled ? -1 : this._tabIndex; },
                set: function (value) {
                    // If the specified tabIndex value is null or undefined, fall back to the default value.
                    this._tabIndex = value != null ? value : defaultTabIndex;
                },
                enumerable: true,
                configurable: true
            });
            return class_1;
        }(base));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Mixin to augment a directive with updateErrorState method.
     * For component with `errorState` and need to update `errorState`.
     */
    function mixinErrorState(base) {
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                /** Whether the component is in an error state. */
                _this.errorState = false;
                /**
                 * Stream that emits whenever the state of the input changes such that the wrapping
                 * `MatFormField` needs to run change detection.
                 */
                _this.stateChanges = new rxjs.Subject();
                return _this;
            }
            class_1.prototype.updateErrorState = function () {
                var oldState = this.errorState;
                var parent = this._parentFormGroup || this._parentForm;
                var matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
                var control = this.ngControl ? this.ngControl.control : null;
                var newState = matcher.isErrorState(control, parent);
                if (newState !== oldState) {
                    this.errorState = newState;
                    this.stateChanges.next();
                }
            };
            return class_1;
        }(base));
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Mixin to augment a directive with an initialized property that will emits when ngOnInit ends. */
    function mixinInitialized(base) {
        return /** @class */ (function (_super) {
            tslib.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, tslib.__spread(args)) || this;
                /** Whether this directive has been marked as initialized. */
                _this._isInitialized = false;
                /**
                 * List of subscribers that subscribed before the directive was initialized. Should be notified
                 * during _markInitialized. Set to null after pending subscribers are notified, and should
                 * not expect to be populated after.
                 */
                _this._pendingSubscribers = [];
                /**
                 * Observable stream that emits when the directive initializes. If already initialized, the
                 * subscriber is stored to be notified once _markInitialized is called.
                 */
                _this.initialized = new rxjs.Observable(function (subscriber) {
                    // If initialized, immediately notify the subscriber. Otherwise store the subscriber to notify
                    // when _markInitialized is called.
                    if (_this._isInitialized) {
                        _this._notifySubscriber(subscriber);
                    }
                    else {
                        _this._pendingSubscribers.push(subscriber);
                    }
                });
                return _this;
            }
            /**
             * Marks the state as initialized and notifies pending subscribers. Should be called at the end
             * of ngOnInit.
             * @docs-private
             */
            class_1.prototype._markInitialized = function () {
                if (this._isInitialized) {
                    throw Error('This directive has already been marked as initialized and ' +
                        'should not be called twice.');
                }
                this._isInitialized = true;
                this._pendingSubscribers.forEach(this._notifySubscriber);
                this._pendingSubscribers = null;
            };
            /** Emits and completes the subscriber stream (should only emit once). */
            class_1.prototype._notifySubscriber = function (subscriber) {
                subscriber.next();
                subscriber.complete();
            };
            return class_1;
        }(base));
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
    /** InjectionToken for datepicker that can be used to override default locale code. */
    var MAT_DATE_LOCALE = new i0.InjectionToken('MAT_DATE_LOCALE', {
        providedIn: 'root',
        factory: MAT_DATE_LOCALE_FACTORY,
    });
    /** @docs-private */
    function MAT_DATE_LOCALE_FACTORY() {
        return i0.inject(i0.LOCALE_ID);
    }
    /**
     * No longer needed since MAT_DATE_LOCALE has been changed to a scoped injectable.
     * If you are importing and providing this in your code you can simply remove it.
     * @deprecated
     * @breaking-change 8.0.0
     */
    var MAT_DATE_LOCALE_PROVIDER = { provide: MAT_DATE_LOCALE, useExisting: i0.LOCALE_ID };
    /** Adapts type `D` to be usable as a date by cdk-based components that work with dates. */
    var DateAdapter = /** @class */ (function () {
        function DateAdapter() {
            this._localeChanges = new rxjs.Subject();
        }
        Object.defineProperty(DateAdapter.prototype, "localeChanges", {
            /** A stream that emits when the locale changes. */
            get: function () { return this._localeChanges; },
            enumerable: true,
            configurable: true
        });
        /**
         * Attempts to deserialize a value to a valid date object. This is different from parsing in that
         * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
         * string). The default implementation does not allow any deserialization, it simply checks that
         * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
         * method on all of its `@Input()` properties that accept dates. It is therefore possible to
         * support passing values from your backend directly to these properties by overriding this method
         * to also deserialize the format used by your backend.
         * @param value The value to be deserialized into a date object.
         * @returns The deserialized date object, either a valid date, null if the value can be
         *     deserialized into a null date (e.g. the empty string), or an invalid date.
         */
        DateAdapter.prototype.deserialize = function (value) {
            if (value == null || this.isDateInstance(value) && this.isValid(value)) {
                return value;
            }
            return this.invalid();
        };
        /**
         * Sets the locale used for all dates.
         * @param locale The new locale.
         */
        DateAdapter.prototype.setLocale = function (locale) {
            this.locale = locale;
            this._localeChanges.next();
        };
        /**
         * Compares two dates.
         * @param first The first date to compare.
         * @param second The second date to compare.
         * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
         *     a number greater than 0 if the first date is later.
         */
        DateAdapter.prototype.compareDate = function (first, second) {
            return this.getYear(first) - this.getYear(second) ||
                this.getMonth(first) - this.getMonth(second) ||
                this.getDate(first) - this.getDate(second);
        };
        /**
         * Checks if two dates are equal.
         * @param first The first date to check.
         * @param second The second date to check.
         * @returns Whether the two dates are equal.
         *     Null dates are considered equal to other null dates.
         */
        DateAdapter.prototype.sameDate = function (first, second) {
            if (first && second) {
                var firstValid = this.isValid(first);
                var secondValid = this.isValid(second);
                if (firstValid && secondValid) {
                    return !this.compareDate(first, second);
                }
                return firstValid == secondValid;
            }
            return first == second;
        };
        /**
         * Clamp the given date between min and max dates.
         * @param date The date to clamp.
         * @param min The minimum value to allow. If null or omitted no min is enforced.
         * @param max The maximum value to allow. If null or omitted no max is enforced.
         * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
         *     otherwise `date`.
         */
        DateAdapter.prototype.clampDate = function (date, min, max) {
            if (min && this.compareDate(date, min) < 0) {
                return min;
            }
            if (max && this.compareDate(date, max) > 0) {
                return max;
            }
            return date;
        };
        return DateAdapter;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_DATE_FORMATS = new i0.InjectionToken('mat-date-formats');

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // TODO(mmalerba): Remove when we no longer support safari 9.
    /** Whether the browser supports the Intl API. */
    var SUPPORTS_INTL_API;
    // We need a try/catch around the reference to `Intl`, because accessing it in some cases can
    // cause IE to throw. These cases are tied to particular versions of Windows and can happen if
    // the consumer is providing a polyfilled `Map`. See:
    // https://github.com/Microsoft/ChakraCore/issues/3189
    // https://github.com/angular/components/issues/15687
    try {
        SUPPORTS_INTL_API = typeof Intl != 'undefined';
    }
    catch (_a) {
        SUPPORTS_INTL_API = false;
    }
    /** The default month names to use if Intl API is not available. */
    var DEFAULT_MONTH_NAMES = {
        'long': [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };
    var ɵ0 = function (i) { return String(i + 1); };
    /** The default date names to use if Intl API is not available. */
    var DEFAULT_DATE_NAMES = range(31, ɵ0);
    /** The default day of the week names to use if Intl API is not available. */
    var DEFAULT_DAY_OF_WEEK_NAMES = {
        'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };
    /**
     * Matches strings that have the form of a valid RFC 3339 string
     * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
     * because the regex will match strings an with out of bounds month, date, etc.
     */
    var ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
    /** Creates an array and fills it with values. */
    function range(length, valueFunction) {
        var valuesArray = Array(length);
        for (var i = 0; i < length; i++) {
            valuesArray[i] = valueFunction(i);
        }
        return valuesArray;
    }
    /** Adapts the native JS Date for use with cdk-based components that work with dates. */
    var NativeDateAdapter = /** @class */ (function (_super) {
        tslib.__extends(NativeDateAdapter, _super);
        function NativeDateAdapter(matDateLocale, platform) {
            var _this = _super.call(this) || this;
            /**
             * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
             * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
             * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
             * will produce `'8/13/1800'`.
             *
             * TODO(mmalerba): drop this variable. It's not being used in the code right now. We're now
             * getting the string representation of a Date object from its utc representation. We're keeping
             * it here for sometime, just for precaution, in case we decide to revert some of these changes
             * though.
             */
            _this.useUtcForDisplay = true;
            _super.prototype.setLocale.call(_this, matDateLocale);
            // IE does its own time zone correction, so we disable this on IE.
            _this.useUtcForDisplay = !platform.TRIDENT;
            _this._clampDate = platform.TRIDENT || platform.EDGE;
            return _this;
        }
        NativeDateAdapter.prototype.getYear = function (date) {
            return date.getFullYear();
        };
        NativeDateAdapter.prototype.getMonth = function (date) {
            return date.getMonth();
        };
        NativeDateAdapter.prototype.getDate = function (date) {
            return date.getDate();
        };
        NativeDateAdapter.prototype.getDayOfWeek = function (date) {
            return date.getDay();
        };
        NativeDateAdapter.prototype.getMonthNames = function (style) {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
                return range(12, function (i) {
                    return _this._stripDirectionalityCharacters(_this._format(dtf_1, new Date(2017, i, 1)));
                });
            }
            return DEFAULT_MONTH_NAMES[style];
        };
        NativeDateAdapter.prototype.getDateNames = function () {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_2 = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
                return range(31, function (i) { return _this._stripDirectionalityCharacters(_this._format(dtf_2, new Date(2017, 0, i + 1))); });
            }
            return DEFAULT_DATE_NAMES;
        };
        NativeDateAdapter.prototype.getDayOfWeekNames = function (style) {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_3 = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
                return range(7, function (i) { return _this._stripDirectionalityCharacters(_this._format(dtf_3, new Date(2017, 0, i + 1))); });
            }
            return DEFAULT_DAY_OF_WEEK_NAMES[style];
        };
        NativeDateAdapter.prototype.getYearName = function (date) {
            if (SUPPORTS_INTL_API) {
                var dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
                return this._stripDirectionalityCharacters(this._format(dtf, date));
            }
            return String(this.getYear(date));
        };
        NativeDateAdapter.prototype.getFirstDayOfWeek = function () {
            // We can't tell using native JS Date what the first day of the week is, we default to Sunday.
            return 0;
        };
        NativeDateAdapter.prototype.getNumDaysInMonth = function (date) {
            return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
        };
        NativeDateAdapter.prototype.clone = function (date) {
            return new Date(date.getTime());
        };
        NativeDateAdapter.prototype.createDate = function (year, month, date) {
            // Check for invalid month and date (except upper bound on date which we have to check after
            // creating the Date).
            if (month < 0 || month > 11) {
                throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
            }
            if (date < 1) {
                throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
            }
            var result = this._createDateWithOverflow(year, month, date);
            // Check that the date wasn't above the upper bound for the month, causing the month to overflow
            if (result.getMonth() != month) {
                throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
            }
            return result;
        };
        NativeDateAdapter.prototype.today = function () {
            return new Date();
        };
        NativeDateAdapter.prototype.parse = function (value) {
            // We have no way using the native JS Date to set the parse format or locale, so we ignore these
            // parameters.
            if (typeof value == 'number') {
                return new Date(value);
            }
            return value ? new Date(Date.parse(value)) : null;
        };
        NativeDateAdapter.prototype.format = function (date, displayFormat) {
            if (!this.isValid(date)) {
                throw Error('NativeDateAdapter: Cannot format invalid date.');
            }
            if (SUPPORTS_INTL_API) {
                // On IE and Edge the i18n API will throw a hard error that can crash the entire app
                // if we attempt to format a date whose year is less than 1 or greater than 9999.
                if (this._clampDate && (date.getFullYear() < 1 || date.getFullYear() > 9999)) {
                    date = this.clone(date);
                    date.setFullYear(Math.max(1, Math.min(9999, date.getFullYear())));
                }
                displayFormat = tslib.__assign(tslib.__assign({}, displayFormat), { timeZone: 'utc' });
                var dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
                return this._stripDirectionalityCharacters(this._format(dtf, date));
            }
            return this._stripDirectionalityCharacters(date.toDateString());
        };
        NativeDateAdapter.prototype.addCalendarYears = function (date, years) {
            return this.addCalendarMonths(date, years * 12);
        };
        NativeDateAdapter.prototype.addCalendarMonths = function (date, months) {
            var newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
            // It's possible to wind up in the wrong month if the original month has more days than the new
            // month. In this case we want to go to the last day of the desired month.
            // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
            // guarantee this.
            if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
                newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
            }
            return newDate;
        };
        NativeDateAdapter.prototype.addCalendarDays = function (date, days) {
            return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
        };
        NativeDateAdapter.prototype.toIso8601 = function (date) {
            return [
                date.getUTCFullYear(),
                this._2digit(date.getUTCMonth() + 1),
                this._2digit(date.getUTCDate())
            ].join('-');
        };
        /**
         * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
         * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
         * invalid date for all other values.
         */
        NativeDateAdapter.prototype.deserialize = function (value) {
            if (typeof value === 'string') {
                if (!value) {
                    return null;
                }
                // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
                // string is the right format first.
                if (ISO_8601_REGEX.test(value)) {
                    var date = new Date(value);
                    if (this.isValid(date)) {
                        return date;
                    }
                }
            }
            return _super.prototype.deserialize.call(this, value);
        };
        NativeDateAdapter.prototype.isDateInstance = function (obj) {
            return obj instanceof Date;
        };
        NativeDateAdapter.prototype.isValid = function (date) {
            return !isNaN(date.getTime());
        };
        NativeDateAdapter.prototype.invalid = function () {
            return new Date(NaN);
        };
        /** Creates a date but allows the month and date to overflow. */
        NativeDateAdapter.prototype._createDateWithOverflow = function (year, month, date) {
            var result = new Date(year, month, date);
            // We need to correct for the fact that JS native Date treats years in range [0, 99] as
            // abbreviations for 19xx.
            if (year >= 0 && year < 100) {
                result.setFullYear(this.getYear(result) - 1900);
            }
            return result;
        };
        /**
         * Pads a number to make it two digits.
         * @param n The number to pad.
         * @returns The padded number.
         */
        NativeDateAdapter.prototype._2digit = function (n) {
            return ('00' + n).slice(-2);
        };
        /**
         * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
         * other browsers do not. We remove them to make output consistent and because they interfere with
         * date parsing.
         * @param str The string to strip direction characters from.
         * @returns The stripped string.
         */
        NativeDateAdapter.prototype._stripDirectionalityCharacters = function (str) {
            return str.replace(/[\u200e\u200f]/g, '');
        };
        /**
         * When converting Date object to string, javascript built-in functions may return wrong
         * results because it applies its internal DST rules. The DST rules around the world change
         * very frequently, and the current valid rule is not always valid in previous years though.
         * We work around this problem building a new Date object which has its internal UTC
         * representation with the local date and time.
         * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
         *    timeZone set to 'utc' to work fine.
         * @param date Date from which we want to get the string representation according to dtf
         * @returns A Date object with its UTC representation based on the passed in date info
         */
        NativeDateAdapter.prototype._format = function (dtf, date) {
            var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            return dtf.format(d);
        };
        NativeDateAdapter.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        NativeDateAdapter.ctorParameters = function () { return [
            { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_LOCALE,] }] },
            { type: platform.Platform }
        ]; };
        return NativeDateAdapter;
    }(DateAdapter));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_NATIVE_DATE_FORMATS = {
        parse: {
            dateInput: null,
        },
        display: {
            dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
            monthYearLabel: { year: 'numeric', month: 'short' },
            dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYearA11yLabel: { year: 'numeric', month: 'long' },
        }
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var NativeDateModule = /** @class */ (function () {
        function NativeDateModule() {
        }
        NativeDateModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [platform.PlatformModule],
                        providers: [
                            { provide: DateAdapter, useClass: NativeDateAdapter },
                        ],
                    },] }
        ];
        return NativeDateModule;
    }());
    var ɵ0$1 = MAT_NATIVE_DATE_FORMATS;
    var MatNativeDateModule = /** @class */ (function () {
        function MatNativeDateModule() {
        }
        MatNativeDateModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [NativeDateModule],
                        providers: [{ provide: MAT_DATE_FORMATS, useValue: ɵ0$1 }],
                    },] }
        ];
        return MatNativeDateModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Error state matcher that matches when a control is invalid and dirty. */
    var ShowOnDirtyErrorStateMatcher = /** @class */ (function () {
        function ShowOnDirtyErrorStateMatcher() {
        }
        ShowOnDirtyErrorStateMatcher.prototype.isErrorState = function (control, form) {
            return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
        };
        ShowOnDirtyErrorStateMatcher.decorators = [
            { type: i0.Injectable }
        ];
        return ShowOnDirtyErrorStateMatcher;
    }());
    /** Provider that defines how form controls behave with regards to displaying error messages. */
    var ErrorStateMatcher = /** @class */ (function () {
        function ErrorStateMatcher() {
        }
        ErrorStateMatcher.prototype.isErrorState = function (control, form) {
            return !!(control && control.invalid && (control.touched || (form && form.submitted)));
        };
        ErrorStateMatcher.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] }
        ];
        ErrorStateMatcher.ɵprov = i0.ɵɵdefineInjectable({ factory: function ErrorStateMatcher_Factory() { return new ErrorStateMatcher(); }, token: ErrorStateMatcher, providedIn: "root" });
        return ErrorStateMatcher;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Injection token that can be used to provide options to the Hammerjs instance.
     * More info at http://hammerjs.github.io/api/.
     * @deprecated No longer being used. To be removed.
     * @breaking-change 10.0.0
     */
    var MAT_HAMMER_OPTIONS = new i0.InjectionToken('MAT_HAMMER_OPTIONS');
    var ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES = [
        'longpress',
        'slide',
        'slidestart',
        'slideend',
        'slideright',
        'slideleft'
    ];
    var ɵ0$2 = function () { }, ɵ1 = function () { };
    /**
     * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
     * been loaded on the page.
     */
    var noopHammerInstance = {
        on: ɵ0$2,
        off: ɵ1,
    };
    /**
     * Adjusts configuration of our gesture library, Hammer.
     * @deprecated No longer being used. To be removed.
     * @breaking-change 10.0.0
     */
    var GestureConfig = /** @class */ (function (_super) {
        tslib.__extends(GestureConfig, _super);
        function GestureConfig(_hammerOptions, _commonModule) {
            var _this = _super.call(this) || this;
            _this._hammerOptions = _hammerOptions;
            /** List of new event names to add to the gesture support list */
            _this.events = ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES;
            return _this;
        }
        /**
         * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
         *
         * Our gesture names come from the Material Design gestures spec:
         * https://material.io/design/#gestures-touch-mechanics
         *
         * More information on default recognizers can be found in Hammer docs:
         * http://hammerjs.github.io/recognizer-pan/
         * http://hammerjs.github.io/recognizer-press/
         *
         * @param element Element to which to assign the new HammerJS gestures.
         * @returns Newly-created HammerJS instance.
         */
        GestureConfig.prototype.buildHammer = function (element) {
            var hammer = typeof window !== 'undefined' ? window.Hammer : null;
            if (!hammer) {
                // If HammerJS is not loaded here, return the noop HammerInstance. This is necessary to
                // ensure that omitting HammerJS completely will not cause any errors while *also* supporting
                // the lazy-loading of HammerJS via the HAMMER_LOADER token introduced in Angular 6.1.
                // Because we can't depend on HAMMER_LOADER's existance until 7.0, we have to always set
                // `this.events` to the set we support, instead of conditionally setting it to `[]` if
                // `HAMMER_LOADER` is present (and then throwing an Error here if `window.Hammer` is
                // undefined).
                // @breaking-change 8.0.0
                return noopHammerInstance;
            }
            var mc = new hammer(element, this._hammerOptions || undefined);
            // Default Hammer Recognizers.
            var pan = new hammer.Pan();
            var swipe = new hammer.Swipe();
            var press = new hammer.Press();
            // Notice that a HammerJS recognizer can only depend on one other recognizer once.
            // Otherwise the previous `recognizeWith` will be dropped.
            // TODO: Confirm threshold numbers with Material Design UX Team
            var slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
            var longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
            // Overwrite the default `pan` event to use the swipe event.
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
        };
        /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
        GestureConfig.prototype._createRecognizer = function (base, options) {
            var inheritances = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                inheritances[_i - 2] = arguments[_i];
            }
            var recognizer = new base.constructor(options);
            inheritances.push(base);
            inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
            return recognizer;
        };
        GestureConfig.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        GestureConfig.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_HAMMER_OPTIONS,] }] },
            { type: MatCommonModule, decorators: [{ type: i0.Optional }] }
        ]; };
        return GestureConfig;
    }(platformBrowser.HammerGestureConfig));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Shared directive to count lines inside a text area, such as a list item.
     * Line elements can be extracted with a @ContentChildren(MatLine) query, then
     * counted by checking the query list's length.
     */
    var MatLine = /** @class */ (function () {
        function MatLine() {
        }
        MatLine.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[mat-line], [matLine]',
                        host: { 'class': 'mat-line' }
                    },] }
        ];
        return MatLine;
    }());
    /**
     * Helper that takes a query list of lines and sets the correct class on the host.
     * @docs-private
     */
    function setLines(lines, element) {
        // Note: doesn't need to unsubscribe, because `changes`
        // gets completed by Angular when the view is destroyed.
        lines.changes.pipe(operators.startWith(lines)).subscribe(function (_a) {
            var length = _a.length;
            setClass(element, 'mat-2-line', false);
            setClass(element, 'mat-3-line', false);
            setClass(element, 'mat-multi-line', false);
            if (length === 2 || length === 3) {
                setClass(element, "mat-" + length + "-line", true);
            }
            else if (length > 3) {
                setClass(element, "mat-multi-line", true);
            }
        });
    }
    /** Adds or removes a class from an element. */
    function setClass(element, className, isAdd) {
        var classList = element.nativeElement.classList;
        isAdd ? classList.add(className) : classList.remove(className);
    }
    /**
     * Helper that takes a query list of lines and sets the correct class on the host.
     * @docs-private
     * @deprecated Use `setLines` instead.
     * @breaking-change 8.0.0
     */
    var MatLineSetter = /** @class */ (function () {
        function MatLineSetter(lines, element) {
            setLines(lines, element);
        }
        return MatLineSetter;
    }());
    var MatLineModule = /** @class */ (function () {
        function MatLineModule() {
        }
        MatLineModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [MatCommonModule],
                        exports: [MatLine, MatCommonModule],
                        declarations: [MatLine],
                    },] }
        ];
        return MatLineModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    (function (RippleState) {
        RippleState[RippleState["FADING_IN"] = 0] = "FADING_IN";
        RippleState[RippleState["VISIBLE"] = 1] = "VISIBLE";
        RippleState[RippleState["FADING_OUT"] = 2] = "FADING_OUT";
        RippleState[RippleState["HIDDEN"] = 3] = "HIDDEN";
    })(exports.RippleState || (exports.RippleState = {}));
    /**
     * Reference to a previously launched ripple element.
     */
    var RippleRef = /** @class */ (function () {
        function RippleRef(_renderer, 
        /** Reference to the ripple HTML element. */
        element, 
        /** Ripple configuration used for the ripple. */
        config) {
            this._renderer = _renderer;
            this.element = element;
            this.config = config;
            /** Current state of the ripple. */
            this.state = exports.RippleState.HIDDEN;
        }
        /** Fades out the ripple element. */
        RippleRef.prototype.fadeOut = function () {
            this._renderer.fadeOutRipple(this);
        };
        return RippleRef;
    }());

    /**
     * Default ripple animation configuration for ripples without an explicit
     * animation config specified.
     */
    var defaultRippleAnimationConfig = {
        enterDuration: 450,
        exitDuration: 400
    };
    /**
     * Timeout for ignoring mouse events. Mouse events will be temporary ignored after touch
     * events to avoid synthetic mouse events.
     */
    var ignoreMouseEventsTimeout = 800;
    /** Options that apply to all the event listeners that are bound by the ripple renderer. */
    var passiveEventOptions = platform.normalizePassiveListenerOptions({ passive: true });
    /**
     * Helper service that performs DOM manipulations. Not intended to be used outside this module.
     * The constructor takes a reference to the ripple directive's host element and a map of DOM
     * event handlers to be installed on the element that triggers ripple animations.
     * This will eventually become a custom renderer once Angular support exists.
     * @docs-private
     */
    var RippleRenderer = /** @class */ (function () {
        function RippleRenderer(_target, _ngZone, elementOrElementRef, platform) {
            var _this = this;
            this._target = _target;
            this._ngZone = _ngZone;
            /** Whether the pointer is currently down or not. */
            this._isPointerDown = false;
            /** Events to be registered on the trigger element. */
            this._triggerEvents = new Map();
            /** Set of currently active ripple references. */
            this._activeRipples = new Set();
            /** Function being called whenever the trigger is being pressed using mouse. */
            this._onMousedown = function (event) {
                // Screen readers will fire fake mouse events for space/enter. Skip launching a
                // ripple in this case for consistency with the non-screen-reader experience.
                var isFakeMousedown = a11y.isFakeMousedownFromScreenReader(event);
                var isSyntheticEvent = _this._lastTouchStartEvent &&
                    Date.now() < _this._lastTouchStartEvent + ignoreMouseEventsTimeout;
                if (!_this._target.rippleDisabled && !isFakeMousedown && !isSyntheticEvent) {
                    _this._isPointerDown = true;
                    _this.fadeInRipple(event.clientX, event.clientY, _this._target.rippleConfig);
                }
            };
            /** Function being called whenever the trigger is being pressed using touch. */
            this._onTouchStart = function (event) {
                if (!_this._target.rippleDisabled) {
                    // Some browsers fire mouse events after a `touchstart` event. Those synthetic mouse
                    // events will launch a second ripple if we don't ignore mouse events for a specific
                    // time after a touchstart event.
                    _this._lastTouchStartEvent = Date.now();
                    _this._isPointerDown = true;
                    // Use `changedTouches` so we skip any touches where the user put
                    // their finger down, but used another finger to tap the element again.
                    var touches = event.changedTouches;
                    for (var i = 0; i < touches.length; i++) {
                        _this.fadeInRipple(touches[i].clientX, touches[i].clientY, _this._target.rippleConfig);
                    }
                }
            };
            /** Function being called whenever the trigger is being released. */
            this._onPointerUp = function () {
                if (!_this._isPointerDown) {
                    return;
                }
                _this._isPointerDown = false;
                // Fade-out all ripples that are visible and not persistent.
                _this._activeRipples.forEach(function (ripple) {
                    // By default, only ripples that are completely visible will fade out on pointer release.
                    // If the `terminateOnPointerUp` option is set, ripples that still fade in will also fade out.
                    var isVisible = ripple.state === exports.RippleState.VISIBLE ||
                        ripple.config.terminateOnPointerUp && ripple.state === exports.RippleState.FADING_IN;
                    if (!ripple.config.persistent && isVisible) {
                        ripple.fadeOut();
                    }
                });
            };
            // Only do anything if we're on the browser.
            if (platform.isBrowser) {
                this._containerElement = coercion.coerceElement(elementOrElementRef);
                // Specify events which need to be registered on the trigger.
                this._triggerEvents
                    .set('mousedown', this._onMousedown)
                    .set('mouseup', this._onPointerUp)
                    .set('mouseleave', this._onPointerUp)
                    .set('touchstart', this._onTouchStart)
                    .set('touchend', this._onPointerUp)
                    .set('touchcancel', this._onPointerUp);
            }
        }
        /**
         * Fades in a ripple at the given coordinates.
         * @param x Coordinate within the element, along the X axis at which to start the ripple.
         * @param y Coordinate within the element, along the Y axis at which to start the ripple.
         * @param config Extra ripple options.
         */
        RippleRenderer.prototype.fadeInRipple = function (x, y, config) {
            var _this = this;
            if (config === void 0) { config = {}; }
            var containerRect = this._containerRect =
                this._containerRect || this._containerElement.getBoundingClientRect();
            var animationConfig = tslib.__assign(tslib.__assign({}, defaultRippleAnimationConfig), config.animation);
            if (config.centered) {
                x = containerRect.left + containerRect.width / 2;
                y = containerRect.top + containerRect.height / 2;
            }
            var radius = config.radius || distanceToFurthestCorner(x, y, containerRect);
            var offsetX = x - containerRect.left;
            var offsetY = y - containerRect.top;
            var duration = animationConfig.enterDuration;
            var ripple = document.createElement('div');
            ripple.classList.add('mat-ripple-element');
            ripple.style.left = offsetX - radius + "px";
            ripple.style.top = offsetY - radius + "px";
            ripple.style.height = radius * 2 + "px";
            ripple.style.width = radius * 2 + "px";
            // If a custom color has been specified, set it as inline style. If no color is
            // set, the default color will be applied through the ripple theme styles.
            if (config.color != null) {
                ripple.style.backgroundColor = config.color;
            }
            ripple.style.transitionDuration = duration + "ms";
            this._containerElement.appendChild(ripple);
            // By default the browser does not recalculate the styles of dynamically created
            // ripple elements. This is critical because then the `scale` would not animate properly.
            enforceStyleRecalculation(ripple);
            ripple.style.transform = 'scale(1)';
            // Exposed reference to the ripple that will be returned.
            var rippleRef = new RippleRef(this, ripple, config);
            rippleRef.state = exports.RippleState.FADING_IN;
            // Add the ripple reference to the list of all active ripples.
            this._activeRipples.add(rippleRef);
            if (!config.persistent) {
                this._mostRecentTransientRipple = rippleRef;
            }
            // Wait for the ripple element to be completely faded in.
            // Once it's faded in, the ripple can be hidden immediately if the mouse is released.
            this._runTimeoutOutsideZone(function () {
                var isMostRecentTransientRipple = rippleRef === _this._mostRecentTransientRipple;
                rippleRef.state = exports.RippleState.VISIBLE;
                // When the timer runs out while the user has kept their pointer down, we want to
                // keep only the persistent ripples and the latest transient ripple. We do this,
                // because we don't want stacked transient ripples to appear after their enter
                // animation has finished.
                if (!config.persistent && (!isMostRecentTransientRipple || !_this._isPointerDown)) {
                    rippleRef.fadeOut();
                }
            }, duration);
            return rippleRef;
        };
        /** Fades out a ripple reference. */
        RippleRenderer.prototype.fadeOutRipple = function (rippleRef) {
            var wasActive = this._activeRipples.delete(rippleRef);
            if (rippleRef === this._mostRecentTransientRipple) {
                this._mostRecentTransientRipple = null;
            }
            // Clear out the cached bounding rect if we have no more ripples.
            if (!this._activeRipples.size) {
                this._containerRect = null;
            }
            // For ripples that are not active anymore, don't re-run the fade-out animation.
            if (!wasActive) {
                return;
            }
            var rippleEl = rippleRef.element;
            var animationConfig = tslib.__assign(tslib.__assign({}, defaultRippleAnimationConfig), rippleRef.config.animation);
            rippleEl.style.transitionDuration = animationConfig.exitDuration + "ms";
            rippleEl.style.opacity = '0';
            rippleRef.state = exports.RippleState.FADING_OUT;
            // Once the ripple faded out, the ripple can be safely removed from the DOM.
            this._runTimeoutOutsideZone(function () {
                rippleRef.state = exports.RippleState.HIDDEN;
                rippleEl.parentNode.removeChild(rippleEl);
            }, animationConfig.exitDuration);
        };
        /** Fades out all currently active ripples. */
        RippleRenderer.prototype.fadeOutAll = function () {
            this._activeRipples.forEach(function (ripple) { return ripple.fadeOut(); });
        };
        /** Sets up the trigger event listeners */
        RippleRenderer.prototype.setupTriggerEvents = function (elementOrElementRef) {
            var _this = this;
            var element = coercion.coerceElement(elementOrElementRef);
            if (!element || element === this._triggerElement) {
                return;
            }
            // Remove all previously registered event listeners from the trigger element.
            this._removeTriggerEvents();
            this._ngZone.runOutsideAngular(function () {
                _this._triggerEvents.forEach(function (fn, type) {
                    element.addEventListener(type, fn, passiveEventOptions);
                });
            });
            this._triggerElement = element;
        };
        /** Runs a timeout outside of the Angular zone to avoid triggering the change detection. */
        RippleRenderer.prototype._runTimeoutOutsideZone = function (fn, delay) {
            if (delay === void 0) { delay = 0; }
            this._ngZone.runOutsideAngular(function () { return setTimeout(fn, delay); });
        };
        /** Removes previously registered event listeners from the trigger element. */
        RippleRenderer.prototype._removeTriggerEvents = function () {
            var _this = this;
            if (this._triggerElement) {
                this._triggerEvents.forEach(function (fn, type) {
                    _this._triggerElement.removeEventListener(type, fn, passiveEventOptions);
                });
            }
        };
        return RippleRenderer;
    }());
    /** Enforces a style recalculation of a DOM element by computing its styles. */
    function enforceStyleRecalculation(element) {
        // Enforce a style recalculation by calling `getComputedStyle` and accessing any property.
        // Calling `getPropertyValue` is important to let optimizers know that this is not a noop.
        // See: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
        window.getComputedStyle(element).getPropertyValue('opacity');
    }
    /**
     * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
     */
    function distanceToFurthestCorner(x, y, rect) {
        var distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
        var distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
        return Math.sqrt(distX * distX + distY * distY);
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Injection token that can be used to specify the global ripple options. */
    var MAT_RIPPLE_GLOBAL_OPTIONS = new i0.InjectionToken('mat-ripple-global-options');
    var MatRipple = /** @class */ (function () {
        function MatRipple(_elementRef, ngZone, platform, globalOptions, animationMode) {
            this._elementRef = _elementRef;
            /**
             * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
             * will be the distance from the center of the ripple to the furthest corner of the host element's
             * bounding rectangle.
             */
            this.radius = 0;
            this._disabled = false;
            /** Whether ripple directive is initialized and the input bindings are set. */
            this._isInitialized = false;
            this._globalOptions = globalOptions || {};
            this._rippleRenderer = new RippleRenderer(this, ngZone, _elementRef, platform);
            if (animationMode === 'NoopAnimations') {
                this._globalOptions.animation = { enterDuration: 0, exitDuration: 0 };
            }
        }
        Object.defineProperty(MatRipple.prototype, "disabled", {
            /**
             * Whether click events will not trigger the ripple. Ripples can be still launched manually
             * by using the `launch()` method.
             */
            get: function () { return this._disabled; },
            set: function (value) {
                this._disabled = value;
                this._setupTriggerEventsIfEnabled();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRipple.prototype, "trigger", {
            /**
             * The element that triggers the ripple when click events are received.
             * Defaults to the directive's host element.
             */
            get: function () { return this._trigger || this._elementRef.nativeElement; },
            set: function (trigger) {
                this._trigger = trigger;
                this._setupTriggerEventsIfEnabled();
            },
            enumerable: true,
            configurable: true
        });
        MatRipple.prototype.ngOnInit = function () {
            this._isInitialized = true;
            this._setupTriggerEventsIfEnabled();
        };
        MatRipple.prototype.ngOnDestroy = function () {
            this._rippleRenderer._removeTriggerEvents();
        };
        /** Fades out all currently showing ripple elements. */
        MatRipple.prototype.fadeOutAll = function () {
            this._rippleRenderer.fadeOutAll();
        };
        Object.defineProperty(MatRipple.prototype, "rippleConfig", {
            /**
             * Ripple configuration from the directive's input values.
             * @docs-private Implemented as part of RippleTarget
             */
            get: function () {
                return {
                    centered: this.centered,
                    radius: this.radius,
                    color: this.color,
                    animation: tslib.__assign(tslib.__assign({}, this._globalOptions.animation), this.animation),
                    terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatRipple.prototype, "rippleDisabled", {
            /**
             * Whether ripples on pointer-down are disabled or not.
             * @docs-private Implemented as part of RippleTarget
             */
            get: function () {
                return this.disabled || !!this._globalOptions.disabled;
            },
            enumerable: true,
            configurable: true
        });
        /** Sets up the trigger event listeners if ripples are enabled. */
        MatRipple.prototype._setupTriggerEventsIfEnabled = function () {
            if (!this.disabled && this._isInitialized) {
                this._rippleRenderer.setupTriggerEvents(this.trigger);
            }
        };
        /** Launches a manual ripple at the specified coordinated or just by the ripple config. */
        MatRipple.prototype.launch = function (configOrX, y, config) {
            if (y === void 0) { y = 0; }
            if (typeof configOrX === 'number') {
                return this._rippleRenderer.fadeInRipple(configOrX, y, tslib.__assign(tslib.__assign({}, this.rippleConfig), config));
            }
            else {
                return this._rippleRenderer.fadeInRipple(0, 0, tslib.__assign(tslib.__assign({}, this.rippleConfig), configOrX));
            }
        };
        MatRipple.decorators = [
            { type: i0.Directive, args: [{
                        selector: '[mat-ripple], [matRipple]',
                        exportAs: 'matRipple',
                        host: {
                            'class': 'mat-ripple',
                            '[class.mat-ripple-unbounded]': 'unbounded'
                        }
                    },] }
        ];
        /** @nocollapse */
        MatRipple.ctorParameters = function () { return [
            { type: i0.ElementRef },
            { type: i0.NgZone },
            { type: platform.Platform },
            { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_RIPPLE_GLOBAL_OPTIONS,] }] },
            { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] }
        ]; };
        MatRipple.propDecorators = {
            color: [{ type: i0.Input, args: ['matRippleColor',] }],
            unbounded: [{ type: i0.Input, args: ['matRippleUnbounded',] }],
            centered: [{ type: i0.Input, args: ['matRippleCentered',] }],
            radius: [{ type: i0.Input, args: ['matRippleRadius',] }],
            animation: [{ type: i0.Input, args: ['matRippleAnimation',] }],
            disabled: [{ type: i0.Input, args: ['matRippleDisabled',] }],
            trigger: [{ type: i0.Input, args: ['matRippleTrigger',] }]
        };
        return MatRipple;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatRippleModule = /** @class */ (function () {
        function MatRippleModule() {
        }
        MatRippleModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [MatCommonModule, platform.PlatformModule],
                        exports: [MatRipple, MatCommonModule],
                        declarations: [MatRipple],
                    },] }
        ];
        return MatRippleModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Component that shows a simplified checkbox without including any kind of "real" checkbox.
     * Meant to be used when the checkbox is purely decorative and a large number of them will be
     * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
     * Note that theming is meant to be handled by the parent element, e.g.
     * `mat-primary .mat-pseudo-checkbox`.
     *
     * Note that this component will be completely invisible to screen-reader users. This is *not*
     * interchangeable with `<mat-checkbox>` and should *not* be used if the user would directly
     * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
     * of more complex components that appropriately handle selected / checked state.
     * @docs-private
     */
    var MatPseudoCheckbox = /** @class */ (function () {
        function MatPseudoCheckbox(_animationMode) {
            this._animationMode = _animationMode;
            /** Display state of the checkbox. */
            this.state = 'unchecked';
            /** Whether the checkbox is disabled. */
            this.disabled = false;
        }
        MatPseudoCheckbox.decorators = [
            { type: i0.Component, args: [{
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        selector: 'mat-pseudo-checkbox',
                        template: '',
                        host: {
                            'class': 'mat-pseudo-checkbox',
                            '[class.mat-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
                            '[class.mat-pseudo-checkbox-checked]': 'state === "checked"',
                            '[class.mat-pseudo-checkbox-disabled]': 'disabled',
                            '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        },
                        styles: [".mat-pseudo-checkbox{width:16px;height:16px;border:2px solid;border-radius:2px;cursor:pointer;display:inline-block;vertical-align:middle;box-sizing:border-box;position:relative;flex-shrink:0;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1),background-color 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox::after{position:absolute;opacity:0;content:\"\";border-bottom:2px solid currentColor;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}.mat-pseudo-checkbox.mat-pseudo-checkbox-checked,.mat-pseudo-checkbox.mat-pseudo-checkbox-indeterminate{border-color:transparent}._mat-animation-noopable.mat-pseudo-checkbox{transition:none;animation:none}._mat-animation-noopable.mat-pseudo-checkbox::after{transition:none}.mat-pseudo-checkbox-disabled{cursor:default}.mat-pseudo-checkbox-indeterminate::after{top:5px;left:1px;width:10px;opacity:1;border-radius:2px}.mat-pseudo-checkbox-checked::after{top:2.4px;left:1px;width:8px;height:3px;border-left:2px solid currentColor;transform:rotate(-45deg);opacity:1;box-sizing:content-box}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatPseudoCheckbox.ctorParameters = function () { return [
            { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] }
        ]; };
        MatPseudoCheckbox.propDecorators = {
            state: [{ type: i0.Input }],
            disabled: [{ type: i0.Input }]
        };
        return MatPseudoCheckbox;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatPseudoCheckboxModule = /** @class */ (function () {
        function MatPseudoCheckboxModule() {
        }
        MatPseudoCheckboxModule.decorators = [
            { type: i0.NgModule, args: [{
                        exports: [MatPseudoCheckbox],
                        declarations: [MatPseudoCheckbox]
                    },] }
        ];
        return MatPseudoCheckboxModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // Boilerplate for applying mixins to MatOptgroup.
    /** @docs-private */
    var MatOptgroupBase = /** @class */ (function () {
        function MatOptgroupBase() {
        }
        return MatOptgroupBase;
    }());
    var _MatOptgroupMixinBase = mixinDisabled(MatOptgroupBase);
    // Counter for unique group ids.
    var _uniqueOptgroupIdCounter = 0;
    /**
     * Component that is used to group instances of `mat-option`.
     */
    var MatOptgroup = /** @class */ (function (_super) {
        tslib.__extends(MatOptgroup, _super);
        function MatOptgroup() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /** Unique id for the underlying label. */
            _this._labelId = "mat-optgroup-label-" + _uniqueOptgroupIdCounter++;
            return _this;
        }
        MatOptgroup.decorators = [
            { type: i0.Component, args: [{
                        selector: 'mat-optgroup',
                        exportAs: 'matOptgroup',
                        template: "<label class=\"mat-optgroup-label\" [id]=\"_labelId\">{{ label }} <ng-content></ng-content></label>\n<ng-content select=\"mat-option, ng-container\"></ng-content>\n",
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        inputs: ['disabled'],
                        host: {
                            'class': 'mat-optgroup',
                            'role': 'group',
                            '[class.mat-optgroup-disabled]': 'disabled',
                            '[attr.aria-disabled]': 'disabled.toString()',
                            '[attr.aria-labelledby]': '_labelId',
                        },
                        styles: [".mat-optgroup-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-optgroup-label[disabled]{cursor:default}[dir=rtl] .mat-optgroup-label{text-align:right}.mat-optgroup-label .mat-icon{margin-right:16px;vertical-align:middle}.mat-optgroup-label .mat-icon svg{vertical-align:top}[dir=rtl] .mat-optgroup-label .mat-icon{margin-left:16px;margin-right:0}\n"]
                    }] }
        ];
        MatOptgroup.propDecorators = {
            label: [{ type: i0.Input }]
        };
        return MatOptgroup;
    }(_MatOptgroupMixinBase));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Option IDs need to be unique across components, so this counter exists outside of
     * the component definition.
     */
    var _uniqueIdCounter = 0;
    /** Event object emitted by MatOption when selected or deselected. */
    var MatOptionSelectionChange = /** @class */ (function () {
        function MatOptionSelectionChange(
        /** Reference to the option that emitted the event. */
        source, 
        /** Whether the change in the option's value was a result of a user action. */
        isUserInput) {
            if (isUserInput === void 0) { isUserInput = false; }
            this.source = source;
            this.isUserInput = isUserInput;
        }
        return MatOptionSelectionChange;
    }());
    /**
     * Injection token used to provide the parent component to options.
     */
    var MAT_OPTION_PARENT_COMPONENT = new i0.InjectionToken('MAT_OPTION_PARENT_COMPONENT');
    /**
     * Single option inside of a `<mat-select>` element.
     */
    var MatOption = /** @class */ (function () {
        function MatOption(_element, _changeDetectorRef, _parent, group) {
            this._element = _element;
            this._changeDetectorRef = _changeDetectorRef;
            this._parent = _parent;
            this.group = group;
            this._selected = false;
            this._active = false;
            this._disabled = false;
            this._mostRecentViewValue = '';
            /** The unique ID of the option. */
            this.id = "mat-option-" + _uniqueIdCounter++;
            /** Event emitted when the option is selected or deselected. */
            // tslint:disable-next-line:no-output-on-prefix
            this.onSelectionChange = new i0.EventEmitter();
            /** Emits when the state of the option changes and any parents have to be notified. */
            this._stateChanges = new rxjs.Subject();
        }
        Object.defineProperty(MatOption.prototype, "multiple", {
            /** Whether the wrapping component is in multiple selection mode. */
            get: function () { return this._parent && this._parent.multiple; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatOption.prototype, "selected", {
            /** Whether or not the option is currently selected. */
            get: function () { return this._selected; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatOption.prototype, "disabled", {
            /** Whether the option is disabled. */
            get: function () { return (this.group && this.group.disabled) || this._disabled; },
            set: function (value) { this._disabled = coercion.coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatOption.prototype, "disableRipple", {
            /** Whether ripples for the option are disabled. */
            get: function () { return this._parent && this._parent.disableRipple; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatOption.prototype, "active", {
            /**
             * Whether or not the option is currently active and ready to be selected.
             * An active option displays styles as if it is focused, but the
             * focus is actually retained somewhere else. This comes in handy
             * for components like autocomplete where focus must remain on the input.
             */
            get: function () {
                return this._active;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatOption.prototype, "viewValue", {
            /**
             * The displayed value of the option. It is necessary to show the selected option in the
             * select's trigger.
             */
            get: function () {
                // TODO(kara): Add input property alternative for node envs.
                return (this._getHostElement().textContent || '').trim();
            },
            enumerable: true,
            configurable: true
        });
        /** Selects the option. */
        MatOption.prototype.select = function () {
            if (!this._selected) {
                this._selected = true;
                this._changeDetectorRef.markForCheck();
                this._emitSelectionChangeEvent();
            }
        };
        /** Deselects the option. */
        MatOption.prototype.deselect = function () {
            if (this._selected) {
                this._selected = false;
                this._changeDetectorRef.markForCheck();
                this._emitSelectionChangeEvent();
            }
        };
        /** Sets focus onto this option. */
        MatOption.prototype.focus = function (_origin, options) {
            // Note that we aren't using `_origin`, but we need to keep it because some internal consumers
            // use `MatOption` in a `FocusKeyManager` and we need it to match `FocusableOption`.
            var element = this._getHostElement();
            if (typeof element.focus === 'function') {
                element.focus(options);
            }
        };
        /**
         * This method sets display styles on the option to make it appear
         * active. This is used by the ActiveDescendantKeyManager so key
         * events will display the proper options as active on arrow key events.
         */
        MatOption.prototype.setActiveStyles = function () {
            if (!this._active) {
                this._active = true;
                this._changeDetectorRef.markForCheck();
            }
        };
        /**
         * This method removes display styles on the option that made it appear
         * active. This is used by the ActiveDescendantKeyManager so key
         * events will display the proper options as active on arrow key events.
         */
        MatOption.prototype.setInactiveStyles = function () {
            if (this._active) {
                this._active = false;
                this._changeDetectorRef.markForCheck();
            }
        };
        /** Gets the label to be used when determining whether the option should be focused. */
        MatOption.prototype.getLabel = function () {
            return this.viewValue;
        };
        /** Ensures the option is selected when activated from the keyboard. */
        MatOption.prototype._handleKeydown = function (event) {
            if ((event.keyCode === keycodes.ENTER || event.keyCode === keycodes.SPACE) && !keycodes.hasModifierKey(event)) {
                this._selectViaInteraction();
                // Prevent the page from scrolling down and form submits.
                event.preventDefault();
            }
        };
        /**
         * `Selects the option while indicating the selection came from the user. Used to
         * determine if the select's view -> model callback should be invoked.`
         */
        MatOption.prototype._selectViaInteraction = function () {
            if (!this.disabled) {
                this._selected = this.multiple ? !this._selected : true;
                this._changeDetectorRef.markForCheck();
                this._emitSelectionChangeEvent(true);
            }
        };
        /**
         * Gets the `aria-selected` value for the option. We explicitly omit the `aria-selected`
         * attribute from single-selection, unselected options. Including the `aria-selected="false"`
         * attributes adds a significant amount of noise to screen-reader users without providing useful
         * information.
         */
        MatOption.prototype._getAriaSelected = function () {
            return this.selected || (this.multiple ? false : null);
        };
        /** Returns the correct tabindex for the option depending on disabled state. */
        MatOption.prototype._getTabIndex = function () {
            return this.disabled ? '-1' : '0';
        };
        /** Gets the host DOM element. */
        MatOption.prototype._getHostElement = function () {
            return this._element.nativeElement;
        };
        MatOption.prototype.ngAfterViewChecked = function () {
            // Since parent components could be using the option's label to display the selected values
            // (e.g. `mat-select`) and they don't have a way of knowing if the option's label has changed
            // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
            // relatively cheap, however we still limit them only to selected options in order to avoid
            // hitting the DOM too often.
            if (this._selected) {
                var viewValue = this.viewValue;
                if (viewValue !== this._mostRecentViewValue) {
                    this._mostRecentViewValue = viewValue;
                    this._stateChanges.next();
                }
            }
        };
        MatOption.prototype.ngOnDestroy = function () {
            this._stateChanges.complete();
        };
        /** Emits the selection change event. */
        MatOption.prototype._emitSelectionChangeEvent = function (isUserInput) {
            if (isUserInput === void 0) { isUserInput = false; }
            this.onSelectionChange.emit(new MatOptionSelectionChange(this, isUserInput));
        };
        MatOption.decorators = [
            { type: i0.Component, args: [{
                        selector: 'mat-option',
                        exportAs: 'matOption',
                        host: {
                            'role': 'option',
                            '[attr.tabindex]': '_getTabIndex()',
                            '[class.mat-selected]': 'selected',
                            '[class.mat-option-multiple]': 'multiple',
                            '[class.mat-active]': 'active',
                            '[id]': 'id',
                            '[attr.aria-selected]': '_getAriaSelected()',
                            '[attr.aria-disabled]': 'disabled.toString()',
                            '[class.mat-option-disabled]': 'disabled',
                            '(click)': '_selectViaInteraction()',
                            '(keydown)': '_handleKeydown($event)',
                            'class': 'mat-option mat-focus-indicator',
                        },
                        template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<span class=\"mat-option-text\"><ng-content></ng-content></span>\n\n<div class=\"mat-option-ripple\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n",
                        encapsulation: i0.ViewEncapsulation.None,
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative;cursor:pointer;outline:none;display:flex;flex-direction:row;max-width:100%;box-sizing:border-box;align-items:center;-webkit-tap-highlight-color:transparent}.mat-option[disabled]{cursor:default}[dir=rtl] .mat-option{text-align:right}.mat-option .mat-icon{margin-right:16px;vertical-align:middle}.mat-option .mat-icon svg{vertical-align:top}[dir=rtl] .mat-option .mat-icon{margin-left:16px;margin-right:0}.mat-option[aria-disabled=true]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:32px}[dir=rtl] .mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:16px;padding-right:32px}.cdk-high-contrast-active .mat-option{margin:0 1px}.cdk-high-contrast-active .mat-option.mat-active{border:solid 1px currentColor;margin:0}.mat-option-text{display:inline-block;flex-grow:1;overflow:hidden;text-overflow:ellipsis}.mat-option .mat-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.cdk-high-contrast-active .mat-option .mat-option-ripple{opacity:.5}.mat-option-pseudo-checkbox{margin-right:8px}[dir=rtl] .mat-option-pseudo-checkbox{margin-left:8px;margin-right:0}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatOption.ctorParameters = function () { return [
            { type: i0.ElementRef },
            { type: i0.ChangeDetectorRef },
            { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_OPTION_PARENT_COMPONENT,] }] },
            { type: MatOptgroup, decorators: [{ type: i0.Optional }] }
        ]; };
        MatOption.propDecorators = {
            value: [{ type: i0.Input }],
            id: [{ type: i0.Input }],
            disabled: [{ type: i0.Input }],
            onSelectionChange: [{ type: i0.Output }]
        };
        return MatOption;
    }());
    /**
     * Counts the amount of option group labels that precede the specified option.
     * @param optionIndex Index of the option at which to start counting.
     * @param options Flat list of all of the options.
     * @param optionGroups Flat list of all of the option groups.
     * @docs-private
     */
    function _countGroupLabelsBeforeOption(optionIndex, options, optionGroups) {
        if (optionGroups.length) {
            var optionsArray = options.toArray();
            var groups = optionGroups.toArray();
            var groupCounter = 0;
            for (var i = 0; i < optionIndex + 1; i++) {
                if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
                    groupCounter++;
                }
            }
            return groupCounter;
        }
        return 0;
    }
    /**
     * Determines the position to which to scroll a panel in order for an option to be into view.
     * @param optionIndex Index of the option to be scrolled into the view.
     * @param optionHeight Height of the options.
     * @param currentScrollPosition Current scroll position of the panel.
     * @param panelHeight Height of the panel.
     * @docs-private
     */
    function _getOptionScrollPosition(optionIndex, optionHeight, currentScrollPosition, panelHeight) {
        var optionOffset = optionIndex * optionHeight;
        if (optionOffset < currentScrollPosition) {
            return optionOffset;
        }
        if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
            return Math.max(0, optionOffset - panelHeight + optionHeight);
        }
        return currentScrollPosition;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MatOptionModule = /** @class */ (function () {
        function MatOptionModule() {
        }
        MatOptionModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [MatRippleModule, common.CommonModule, MatPseudoCheckboxModule],
                        exports: [MatOption, MatOptgroup],
                        declarations: [MatOption, MatOptgroup]
                    },] }
        ];
        return MatOptionModule;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * InjectionToken that can be used to specify the global label options.
     * @deprecated Use `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token from
     *     `@angular/material/form-field` instead.
     * @breaking-change 11.0.0
     */
    var MAT_LABEL_GLOBAL_OPTIONS = new i0.InjectionToken('mat-label-global-options');

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * When constructing a Date, the month is zero-based. This can be confusing, since people are
     * used to seeing them one-based. So we create these aliases to make writing the tests easier.
     * @docs-private
     * @breaking-change 8.0.0 Remove this with V8 since it was only targeted for testing.
     */
    var JAN = 0, FEB = 1, MAR = 2, APR = 3, MAY = 4, JUN = 5, JUL = 6, AUG = 7, SEP = 8, OCT = 9, NOV = 10, DEC = 11;

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.APR = APR;
    exports.AUG = AUG;
    exports.AnimationCurves = AnimationCurves;
    exports.AnimationDurations = AnimationDurations;
    exports.DEC = DEC;
    exports.DateAdapter = DateAdapter;
    exports.ErrorStateMatcher = ErrorStateMatcher;
    exports.FEB = FEB;
    exports.GestureConfig = GestureConfig;
    exports.JAN = JAN;
    exports.JUL = JUL;
    exports.JUN = JUN;
    exports.MAR = MAR;
    exports.MATERIAL_SANITY_CHECKS = MATERIAL_SANITY_CHECKS;
    exports.MAT_DATE_FORMATS = MAT_DATE_FORMATS;
    exports.MAT_DATE_LOCALE = MAT_DATE_LOCALE;
    exports.MAT_DATE_LOCALE_FACTORY = MAT_DATE_LOCALE_FACTORY;
    exports.MAT_DATE_LOCALE_PROVIDER = MAT_DATE_LOCALE_PROVIDER;
    exports.MAT_HAMMER_OPTIONS = MAT_HAMMER_OPTIONS;
    exports.MAT_LABEL_GLOBAL_OPTIONS = MAT_LABEL_GLOBAL_OPTIONS;
    exports.MAT_NATIVE_DATE_FORMATS = MAT_NATIVE_DATE_FORMATS;
    exports.MAT_OPTION_PARENT_COMPONENT = MAT_OPTION_PARENT_COMPONENT;
    exports.MAT_RIPPLE_GLOBAL_OPTIONS = MAT_RIPPLE_GLOBAL_OPTIONS;
    exports.MAY = MAY;
    exports.MatCommonModule = MatCommonModule;
    exports.MatLine = MatLine;
    exports.MatLineModule = MatLineModule;
    exports.MatLineSetter = MatLineSetter;
    exports.MatNativeDateModule = MatNativeDateModule;
    exports.MatOptgroup = MatOptgroup;
    exports.MatOption = MatOption;
    exports.MatOptionModule = MatOptionModule;
    exports.MatOptionSelectionChange = MatOptionSelectionChange;
    exports.MatPseudoCheckbox = MatPseudoCheckbox;
    exports.MatPseudoCheckboxModule = MatPseudoCheckboxModule;
    exports.MatRipple = MatRipple;
    exports.MatRippleModule = MatRippleModule;
    exports.NOV = NOV;
    exports.NativeDateAdapter = NativeDateAdapter;
    exports.NativeDateModule = NativeDateModule;
    exports.OCT = OCT;
    exports.RippleRef = RippleRef;
    exports.RippleRenderer = RippleRenderer;
    exports.SEP = SEP;
    exports.ShowOnDirtyErrorStateMatcher = ShowOnDirtyErrorStateMatcher;
    exports.VERSION = VERSION;
    exports._countGroupLabelsBeforeOption = _countGroupLabelsBeforeOption;
    exports._getOptionScrollPosition = _getOptionScrollPosition;
    exports.defaultRippleAnimationConfig = defaultRippleAnimationConfig;
    exports.mixinColor = mixinColor;
    exports.mixinDisableRipple = mixinDisableRipple;
    exports.mixinDisabled = mixinDisabled;
    exports.mixinErrorState = mixinErrorState;
    exports.mixinInitialized = mixinInitialized;
    exports.mixinTabIndex = mixinTabIndex;
    exports.setLines = setLines;
    exports.ɵ0 = ɵ0$1;
    exports.ɵ1 = ɵ1;
    exports.ɵangular_material_src_material_core_core_a = MATERIAL_SANITY_CHECKS_FACTORY;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-core.umd.js.map
