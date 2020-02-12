(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/observers'), require('@angular/core'), require('@angular/material/core'), require('tslib'), require('@angular/cdk/a11y'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/forms'), require('@angular/platform-browser/animations')) :
    typeof define === 'function' && define.amd ? define('@angular/material/slide-toggle', ['exports', '@angular/cdk/observers', '@angular/core', '@angular/material/core', 'tslib', '@angular/cdk/a11y', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/forms', '@angular/platform-browser/animations'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.slideToggle = {}), global.ng.cdk.observers, global.ng.core, global.ng.material.core, global.tslib, global.ng.cdk.a11y, global.ng.cdk.bidi, global.ng.cdk.coercion, global.ng.forms, global.ng.platformBrowser.animations));
}(this, (function (exports, observers, core, core$1, tslib, a11y, bidi, coercion, forms, animations) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Injection token to be used to override the default options for `mat-slide-toggle`. */
    var MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS = new core.InjectionToken('mat-slide-toggle-default-options', {
        providedIn: 'root',
        factory: function () { return ({ disableToggleValue: false }); }
    });

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // Increasing integer for generating unique ids for slide-toggle components.
    var nextUniqueId = 0;
    /** @docs-private */
    var MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return MatSlideToggle; }),
        multi: true
    };
    /** Change event object emitted by a MatSlideToggle. */
    var MatSlideToggleChange = /** @class */ (function () {
        function MatSlideToggleChange(
        /** The source MatSlideToggle of the event. */
        source, 
        /** The new `checked` value of the MatSlideToggle. */
        checked) {
            this.source = source;
            this.checked = checked;
        }
        return MatSlideToggleChange;
    }());
    // Boilerplate for applying mixins to MatSlideToggle.
    /** @docs-private */
    var MatSlideToggleBase = /** @class */ (function () {
        function MatSlideToggleBase(_elementRef) {
            this._elementRef = _elementRef;
        }
        return MatSlideToggleBase;
    }());
    var _MatSlideToggleMixinBase = core$1.mixinTabIndex(core$1.mixinColor(core$1.mixinDisableRipple(core$1.mixinDisabled(MatSlideToggleBase)), 'accent'));
    /** Represents a slidable "switch" toggle that can be moved between on and off. */
    var MatSlideToggle = /** @class */ (function (_super) {
        tslib.__extends(MatSlideToggle, _super);
        function MatSlideToggle(elementRef, _focusMonitor, _changeDetectorRef, tabIndex, 
        /**
         * @deprecated `_ngZone` and `_dir` parameters to be removed.
         * @breaking-change 10.0.0
         */
        _ngZone, defaults, _animationMode, _dir) {
            var _this = _super.call(this, elementRef) || this;
            _this._focusMonitor = _focusMonitor;
            _this._changeDetectorRef = _changeDetectorRef;
            _this.defaults = defaults;
            _this._animationMode = _animationMode;
            _this._onChange = function (_) { };
            _this._onTouched = function () { };
            _this._uniqueId = "mat-slide-toggle-" + ++nextUniqueId;
            _this._required = false;
            _this._checked = false;
            /** Name value will be applied to the input element if present. */
            _this.name = null;
            /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
            _this.id = _this._uniqueId;
            /** Whether the label should appear after or before the slide-toggle. Defaults to 'after'. */
            _this.labelPosition = 'after';
            /** Used to set the aria-label attribute on the underlying input element. */
            _this.ariaLabel = null;
            /** Used to set the aria-labelledby attribute on the underlying input element. */
            _this.ariaLabelledby = null;
            /** An event will be dispatched each time the slide-toggle changes its value. */
            _this.change = new core.EventEmitter();
            /**
             * An event will be dispatched each time the slide-toggle input is toggled.
             * This event is always emitted when the user toggles the slide toggle, but this does not mean
             * the slide toggle's value has changed.
             */
            _this.toggleChange = new core.EventEmitter();
            /**
             * An event will be dispatched each time the slide-toggle is dragged.
             * This event is always emitted when the user drags the slide toggle to make a change greater
             * than 50%. It does not mean the slide toggle's value is changed. The event is not emitted when
             * the user toggles the slide toggle to change its value.
             * @deprecated No longer being used. To be removed.
             * @breaking-change 10.0.0
             */
            _this.dragChange = new core.EventEmitter();
            _this.tabIndex = parseInt(tabIndex) || 0;
            return _this;
        }
        Object.defineProperty(MatSlideToggle.prototype, "required", {
            /** Whether the slide-toggle is required. */
            get: function () { return this._required; },
            set: function (value) { this._required = coercion.coerceBooleanProperty(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatSlideToggle.prototype, "checked", {
            /** Whether the slide-toggle element is checked or not. */
            get: function () { return this._checked; },
            set: function (value) {
                this._checked = coercion.coerceBooleanProperty(value);
                this._changeDetectorRef.markForCheck();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatSlideToggle.prototype, "inputId", {
            /** Returns the unique id for the visual hidden input. */
            get: function () { return (this.id || this._uniqueId) + "-input"; },
            enumerable: true,
            configurable: true
        });
        MatSlideToggle.prototype.ngAfterContentInit = function () {
            var _this = this;
            this._focusMonitor
                .monitor(this._elementRef, true)
                .subscribe(function (focusOrigin) {
                // Only forward focus manually when it was received programmatically or through the
                // keyboard. We should not do this for mouse/touch focus for two reasons:
                // 1. It can prevent clicks from landing in Chrome (see #18269).
                // 2. They're already handled by the wrapping `label` element.
                if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                    _this._inputElement.nativeElement.focus();
                }
                else if (!focusOrigin) {
                    // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                    // Angular does not expect events to be raised during change detection, so any state
                    // change (such as a form control's 'ng-touched') will cause a changed-after-checked
                    // error. See https://github.com/angular/angular/issues/17793. To work around this,
                    // we defer telling the form control it has been touched until the next tick.
                    Promise.resolve().then(function () { return _this._onTouched(); });
                }
            });
        };
        MatSlideToggle.prototype.ngOnDestroy = function () {
            this._focusMonitor.stopMonitoring(this._elementRef);
        };
        /** Method being called whenever the underlying input emits a change event. */
        MatSlideToggle.prototype._onChangeEvent = function (event) {
            // We always have to stop propagation on the change event.
            // Otherwise the change event, from the input element, will bubble up and
            // emit its event object to the component's `change` output.
            event.stopPropagation();
            this.toggleChange.emit();
            // When the slide toggle's config disables toggle change event by setting
            // `disableToggleValue: true`, the slide toggle's value does not change, and the
            // checked state of the underlying input needs to be changed back.
            if (this.defaults.disableToggleValue) {
                this._inputElement.nativeElement.checked = this.checked;
                return;
            }
            // Sync the value from the underlying input element with the component instance.
            this.checked = this._inputElement.nativeElement.checked;
            // Emit our custom change event only if the underlying input emitted one. This ensures that
            // there is no change event, when the checked state changes programmatically.
            this._emitChangeEvent();
        };
        /** Method being called whenever the slide-toggle has been clicked. */
        MatSlideToggle.prototype._onInputClick = function (event) {
            // We have to stop propagation for click events on the visual hidden input element.
            // By default, when a user clicks on a label element, a generated click event will be
            // dispatched on the associated input element. Since we are using a label element as our
            // root container, the click event on the `slide-toggle` will be executed twice.
            // The real click event will bubble up, and the generated click event also tries to bubble up.
            // This will lead to multiple click events.
            // Preventing bubbling for the second event will solve that issue.
            event.stopPropagation();
        };
        /** Implemented as part of ControlValueAccessor. */
        MatSlideToggle.prototype.writeValue = function (value) {
            this.checked = !!value;
        };
        /** Implemented as part of ControlValueAccessor. */
        MatSlideToggle.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        /** Implemented as part of ControlValueAccessor. */
        MatSlideToggle.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        /** Implemented as a part of ControlValueAccessor. */
        MatSlideToggle.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
            this._changeDetectorRef.markForCheck();
        };
        /** Focuses the slide-toggle. */
        MatSlideToggle.prototype.focus = function (options) {
            this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
        };
        /** Toggles the checked state of the slide-toggle. */
        MatSlideToggle.prototype.toggle = function () {
            this.checked = !this.checked;
            this._onChange(this.checked);
        };
        /**
         * Emits a change event on the `change` output. Also notifies the FormControl about the change.
         */
        MatSlideToggle.prototype._emitChangeEvent = function () {
            this._onChange(this.checked);
            this.change.emit(new MatSlideToggleChange(this, this.checked));
        };
        /** Method being called whenever the label text changes. */
        MatSlideToggle.prototype._onLabelTextChange = function () {
            // Since the event of the `cdkObserveContent` directive runs outside of the zone, the
            // slide-toggle component will be only marked for check, but no actual change detection runs
            // automatically. Instead of going back into the zone in order to trigger a change detection
            // which causes *all* components to be checked (if explicitly marked or not using OnPush),
            // we only trigger an explicit change detection for the slide-toggle view and its children.
            this._changeDetectorRef.detectChanges();
        };
        MatSlideToggle.decorators = [
            { type: core.Component, args: [{
                        selector: 'mat-slide-toggle',
                        exportAs: 'matSlideToggle',
                        host: {
                            'class': 'mat-slide-toggle',
                            '[id]': 'id',
                            // Needs to be `-1` so it can still receive programmatic focus.
                            '[attr.tabindex]': 'disabled ? null : -1',
                            '[attr.aria-label]': 'null',
                            '[attr.aria-labelledby]': 'null',
                            '[class.mat-checked]': 'checked',
                            '[class.mat-disabled]': 'disabled',
                            '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                            '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        },
                        template: "<label [attr.for]=\"inputId\" class=\"mat-slide-toggle-label\" #label>\n  <div #toggleBar class=\"mat-slide-toggle-bar\"\n       [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\">\n\n    <input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\"\n           role=\"switch\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [tabIndex]=\"tabIndex\"\n           [checked]=\"checked\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [attr.aria-checked]=\"checked.toString()\"\n           [attr.aria-label]=\"ariaLabel\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           (change)=\"_onChangeEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n\n    <div class=\"mat-slide-toggle-thumb-container\" #thumbContainer>\n      <div class=\"mat-slide-toggle-thumb\"></div>\n      <div class=\"mat-slide-toggle-ripple mat-focus-indicator\" mat-ripple\n           [matRippleTrigger]=\"label\"\n           [matRippleDisabled]=\"disableRipple || disabled\"\n           [matRippleCentered]=\"true\"\n           [matRippleRadius]=\"20\"\n           [matRippleAnimation]=\"{enterDuration: 150}\">\n\n        <div class=\"mat-ripple-element mat-slide-toggle-persistent-ripple\"></div>\n      </div>\n    </div>\n\n  </div>\n\n  <span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n",
                        providers: [MAT_SLIDE_TOGGLE_VALUE_ACCESSOR],
                        inputs: ['disabled', 'disableRipple', 'color', 'tabIndex'],
                        encapsulation: core.ViewEncapsulation.None,
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [".mat-slide-toggle{display:inline-block;height:24px;max-width:100%;line-height:24px;white-space:nowrap;outline:none;-webkit-tap-highlight-color:transparent}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px, 0, 0)}[dir=rtl] .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(-16px, 0, 0)}.mat-slide-toggle.mat-disabled{opacity:.38}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{display:flex;flex:1;flex-direction:row;align-items:center;height:inherit;cursor:pointer}.mat-slide-toggle-content{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar,.mat-slide-toggle-bar{margin-right:8px;margin-left:0}[dir=rtl] .mat-slide-toggle-bar,.mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0, 0, 0);transition:all 80ms linear;transition-property:transform}._mat-animation-noopable .mat-slide-toggle-thumb-container{transition:none}[dir=rtl] .mat-slide-toggle-thumb-container{left:auto;right:0}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;flex-shrink:0;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}[dir=rtl] .mat-slide-toggle-input{left:auto;right:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}._mat-animation-noopable .mat-slide-toggle-bar,._mat-animation-noopable .mat-slide-toggle-thumb{transition:none}.mat-slide-toggle .mat-slide-toggle-ripple{position:absolute;top:calc(50% - 20px);left:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-slide-toggle .mat-slide-toggle-ripple .mat-ripple-element:not(.mat-slide-toggle-persistent-ripple){opacity:.12}.mat-slide-toggle-persistent-ripple{width:100%;height:100%;transform:none}.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:.04}.mat-slide-toggle:not(.mat-disabled).cdk-keyboard-focused .mat-slide-toggle-persistent-ripple{opacity:.12}.mat-slide-toggle-persistent-ripple,.mat-slide-toggle.mat-disabled .mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:0}@media(hover: none){.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{display:none}}.cdk-high-contrast-active .mat-slide-toggle-thumb,.cdk-high-contrast-active .mat-slide-toggle-bar{border:1px solid}.cdk-high-contrast-active .mat-slide-toggle.cdk-keyboard-focused .mat-slide-toggle-bar{outline:2px dotted;outline-offset:5px}\n"]
                    }] }
        ];
        /** @nocollapse */
        MatSlideToggle.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: a11y.FocusMonitor },
            { type: core.ChangeDetectorRef },
            { type: String, decorators: [{ type: core.Attribute, args: ['tabindex',] }] },
            { type: core.NgZone },
            { type: undefined, decorators: [{ type: core.Inject, args: [MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,] }] },
            { type: String, decorators: [{ type: core.Optional }, { type: core.Inject, args: [animations.ANIMATION_MODULE_TYPE,] }] },
            { type: bidi.Directionality, decorators: [{ type: core.Optional }] }
        ]; };
        MatSlideToggle.propDecorators = {
            _thumbEl: [{ type: core.ViewChild, args: ['thumbContainer',] }],
            _thumbBarEl: [{ type: core.ViewChild, args: ['toggleBar',] }],
            name: [{ type: core.Input }],
            id: [{ type: core.Input }],
            labelPosition: [{ type: core.Input }],
            ariaLabel: [{ type: core.Input, args: ['aria-label',] }],
            ariaLabelledby: [{ type: core.Input, args: ['aria-labelledby',] }],
            required: [{ type: core.Input }],
            checked: [{ type: core.Input }],
            change: [{ type: core.Output }],
            toggleChange: [{ type: core.Output }],
            dragChange: [{ type: core.Output }],
            _inputElement: [{ type: core.ViewChild, args: ['input',] }]
        };
        return MatSlideToggle;
    }(_MatSlideToggleMixinBase));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = {
        provide: forms.NG_VALIDATORS,
        useExisting: core.forwardRef(function () { return MatSlideToggleRequiredValidator; }),
        multi: true
    };
    /**
     * Validator for Material slide-toggle components with the required attribute in a
     * template-driven form. The default validator for required form controls asserts
     * that the control value is not undefined but that is not appropriate for a slide-toggle
     * where the value is always defined.
     *
     * Required slide-toggle form controls are valid when checked.
     */
    var MatSlideToggleRequiredValidator = /** @class */ (function (_super) {
        tslib.__extends(MatSlideToggleRequiredValidator, _super);
        function MatSlideToggleRequiredValidator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatSlideToggleRequiredValidator.decorators = [
            { type: core.Directive, args: [{
                        selector: "mat-slide-toggle[required][formControlName],\n             mat-slide-toggle[required][formControl], mat-slide-toggle[required][ngModel]",
                        providers: [MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR],
                    },] }
        ];
        return MatSlideToggleRequiredValidator;
    }(forms.CheckboxRequiredValidator));

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** This module is used by both original and MDC-based slide-toggle implementations. */
    var _MatSlideToggleRequiredValidatorModule = /** @class */ (function () {
        function _MatSlideToggleRequiredValidatorModule() {
        }
        _MatSlideToggleRequiredValidatorModule.decorators = [
            { type: core.NgModule, args: [{
                        exports: [MatSlideToggleRequiredValidator],
                        declarations: [MatSlideToggleRequiredValidator],
                    },] }
        ];
        return _MatSlideToggleRequiredValidatorModule;
    }());
    var MatSlideToggleModule = /** @class */ (function () {
        function MatSlideToggleModule() {
        }
        MatSlideToggleModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            _MatSlideToggleRequiredValidatorModule,
                            core$1.MatRippleModule,
                            core$1.MatCommonModule,
                            observers.ObserversModule,
                        ],
                        exports: [
                            _MatSlideToggleRequiredValidatorModule,
                            MatSlideToggle,
                            core$1.MatCommonModule
                        ],
                        declarations: [MatSlideToggle],
                    },] }
        ];
        return MatSlideToggleModule;
    }());

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

    exports.MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS = MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS;
    exports.MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR = MAT_SLIDE_TOGGLE_REQUIRED_VALIDATOR;
    exports.MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = MAT_SLIDE_TOGGLE_VALUE_ACCESSOR;
    exports.MatSlideToggle = MatSlideToggle;
    exports.MatSlideToggleChange = MatSlideToggleChange;
    exports.MatSlideToggleModule = MatSlideToggleModule;
    exports.MatSlideToggleRequiredValidator = MatSlideToggleRequiredValidator;
    exports._MatSlideToggleRequiredValidatorModule = _MatSlideToggleRequiredValidatorModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-slide-toggle.umd.js.map
