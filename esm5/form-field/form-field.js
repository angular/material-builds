/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, ElementRef, Inject, InjectionToken, Input, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_LABEL_GLOBAL_OPTIONS, mixinColor, } from '@angular/material/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';
import { MatError } from './error';
import { matFormFieldAnimations } from './form-field-animations';
import { MatFormFieldControl } from './form-field-control';
import { getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError, } from './form-field-errors';
import { MatHint } from './hint';
import { MatLabel } from './label';
import { MatPlaceholder } from './placeholder';
import { MatPrefix } from './prefix';
import { MatSuffix } from './suffix';
import { Platform } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
var nextUniqueId = 0;
var floatingLabelScale = 0.75;
var outlineGapPadding = 5;
/**
 * Boilerplate for applying mixins to MatFormField.
 * @docs-private
 */
var MatFormFieldBase = /** @class */ (function () {
    function MatFormFieldBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatFormFieldBase;
}());
/**
 * Base class to which we're applying the form field mixins.
 * @docs-private
 */
var _MatFormFieldMixinBase = mixinColor(MatFormFieldBase, 'primary');
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export var MAT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken('MAT_FORM_FIELD_DEFAULT_OPTIONS');
/** Container for form controls that applies Material Design styling and behavior. */
var MatFormField = /** @class */ (function (_super) {
    tslib_1.__extends(MatFormField, _super);
    function MatFormField(_elementRef, _changeDetectorRef, labelOptions, _dir, _defaults, _platform, _ngZone, _animationMode) {
        var _this = _super.call(this, _elementRef) || this;
        _this._elementRef = _elementRef;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._dir = _dir;
        _this._defaults = _defaults;
        _this._platform = _platform;
        _this._ngZone = _ngZone;
        /**
         * Whether the outline gap needs to be calculated
         * immediately on the next change detection run.
         */
        _this._outlineGapCalculationNeededImmediately = false;
        /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
        _this._outlineGapCalculationNeededOnStable = false;
        _this._destroyed = new Subject();
        /** Override for the logic that disables the label animation in certain cases. */
        _this._showAlwaysAnimate = false;
        /** State of the mat-hint and mat-error animations. */
        _this._subscriptAnimationState = '';
        _this._hintLabel = '';
        // Unique id for the hint label.
        _this._hintLabelId = "mat-hint-" + nextUniqueId++;
        // Unique id for the internal form field label.
        _this._labelId = "mat-form-field-label-" + nextUniqueId++;
        _this._labelOptions = labelOptions ? labelOptions : {};
        _this.floatLabel = _this._labelOptions.float || 'auto';
        _this._animationsEnabled = _animationMode !== 'NoopAnimations';
        // Set the default through here so we invoke the setter on the first run.
        _this.appearance = (_defaults && _defaults.appearance) ? _defaults.appearance : 'legacy';
        _this._hideRequiredMarker = (_defaults && _defaults.hideRequiredMarker != null) ?
            _defaults.hideRequiredMarker : false;
        return _this;
    }
    Object.defineProperty(MatFormField.prototype, "appearance", {
        /** The form-field appearance style. */
        get: function () { return this._appearance; },
        set: function (value) {
            var oldValue = this._appearance;
            this._appearance = value || (this._defaults && this._defaults.appearance) || 'legacy';
            if (this._appearance === 'outline' && oldValue !== value) {
                this._outlineGapCalculationNeededOnStable = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "hideRequiredMarker", {
        /** Whether the required marker should be hidden. */
        get: function () { return this._hideRequiredMarker; },
        set: function (value) {
            this._hideRequiredMarker = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_shouldAlwaysFloat", {
        /** Whether the floating label should always float or not. */
        get: function () {
            return this.floatLabel === 'always' && !this._showAlwaysAnimate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_canLabelFloat", {
        /** Whether the label can float or not. */
        get: function () { return this.floatLabel !== 'never'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "hintLabel", {
        /** Text for the form field hint. */
        get: function () { return this._hintLabel; },
        set: function (value) {
            this._hintLabel = value;
            this._processHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "floatLabel", {
        /**
         * Whether the label should always float, never float or float as the user types.
         *
         * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
         * way to make the floating label emulate the behavior of a standard input placeholder. However
         * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
         * appearances the `never` option has been disabled in favor of just using the placeholder.
         */
        get: function () {
            return this.appearance !== 'legacy' && this._floatLabel === 'never' ? 'auto' : this._floatLabel;
        },
        set: function (value) {
            if (value !== this._floatLabel) {
                this._floatLabel = value || this._labelOptions.float || 'auto';
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_control", {
        get: function () {
            // TODO(crisbeto): we need this hacky workaround in order to support both Ivy
            // and ViewEngine. We should clean this up once Ivy is the default renderer.
            return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
        },
        set: function (value) {
            this._explicitFormFieldControl = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatFormField.prototype, "_labelChild", {
        get: function () {
            return this._labelChildNonStatic || this._labelChildStatic;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets an ElementRef for the element that a overlay attached to the form-field should be
     * positioned relative to.
     */
    MatFormField.prototype.getConnectedOverlayOrigin = function () {
        return this._connectionContainerRef || this._elementRef;
    };
    MatFormField.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateControlChild();
        var control = this._control;
        if (control.controlType) {
            this._elementRef.nativeElement.classList.add("mat-form-field-type-" + control.controlType);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        control.stateChanges.pipe(startWith(null)).subscribe(function () {
            _this._validatePlaceholders();
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
        // Run change detection if the value changes.
        if (control.ngControl && control.ngControl.valueChanges) {
            control.ngControl.valueChanges
                .pipe(takeUntil(this._destroyed))
                .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        }
        // Note that we have to run outside of the `NgZone` explicitly,
        // in order to avoid throwing users into an infinite loop
        // if `zone-patch-rxjs` is included.
        this._ngZone.runOutsideAngular(function () {
            _this._ngZone.onStable.asObservable().pipe(takeUntil(_this._destroyed)).subscribe(function () {
                if (_this._outlineGapCalculationNeededOnStable) {
                    _this.updateOutlineGap();
                }
            });
        });
        // Run change detection and update the outline if the suffix or prefix changes.
        merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(function () {
            _this._outlineGapCalculationNeededOnStable = true;
            _this._changeDetectorRef.markForCheck();
        });
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(startWith(null)).subscribe(function () {
            _this._processHints();
            _this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(startWith(null)).subscribe(function () {
            _this._syncDescribedByIds();
            _this._changeDetectorRef.markForCheck();
        });
        if (this._dir) {
            this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(function () { return _this.updateOutlineGap(); });
        }
    };
    MatFormField.prototype.ngAfterContentChecked = function () {
        this._validateControlChild();
        if (this._outlineGapCalculationNeededImmediately) {
            this.updateOutlineGap();
        }
    };
    MatFormField.prototype.ngAfterViewInit = function () {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    };
    MatFormField.prototype.ngOnDestroy = function () {
        this._destroyed.next();
        this._destroyed.complete();
    };
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    MatFormField.prototype._shouldForward = function (prop) {
        var ngControl = this._control ? this._control.ngControl : null;
        return ngControl && ngControl[prop];
    };
    MatFormField.prototype._hasPlaceholder = function () {
        return !!(this._control && this._control.placeholder || this._placeholderChild);
    };
    MatFormField.prototype._hasLabel = function () {
        return !!this._labelChild;
    };
    MatFormField.prototype._shouldLabelFloat = function () {
        return this._canLabelFloat && (this._control.shouldLabelFloat || this._shouldAlwaysFloat);
    };
    MatFormField.prototype._hideControlPlaceholder = function () {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this.appearance === 'legacy' && !this._hasLabel() ||
            this._hasLabel() && !this._shouldLabelFloat();
    };
    MatFormField.prototype._hasFloatingLabel = function () {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this._hasLabel() || this.appearance === 'legacy' && this._hasPlaceholder();
    };
    /** Determines whether to display hints or errors. */
    MatFormField.prototype._getDisplayedMessages = function () {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    };
    /** Animates the placeholder up and locks it in position. */
    MatFormField.prototype._animateAndLockLabel = function () {
        var _this = this;
        if (this._hasFloatingLabel() && this._canLabelFloat) {
            // If animations are disabled, we shouldn't go in here,
            // because the `transitionend` will never fire.
            if (this._animationsEnabled) {
                this._showAlwaysAnimate = true;
                fromEvent(this._label.nativeElement, 'transitionend').pipe(take(1)).subscribe(function () {
                    _this._showAlwaysAnimate = false;
                });
            }
            this.floatLabel = 'always';
            this._changeDetectorRef.markForCheck();
        }
    };
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     */
    MatFormField.prototype._validatePlaceholders = function () {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    };
    /** Does any extra processing that is required when handling the hints. */
    MatFormField.prototype._processHints = function () {
        this._validateHints();
        this._syncDescribedByIds();
    };
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    MatFormField.prototype._validateHints = function () {
        var _this = this;
        if (this._hintChildren) {
            var startHint_1;
            var endHint_1;
            this._hintChildren.forEach(function (hint) {
                if (hint.align === 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw getMatFormFieldDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align === 'end') {
                    if (endHint_1) {
                        throw getMatFormFieldDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    MatFormField.prototype._syncDescribedByIds = function () {
        if (this._control) {
            var ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                var startHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'start'; }) : null;
                var endHint = this._hintChildren ?
                    this._hintChildren.find(function (hint) { return hint.align === 'end'; }) : null;
                if (startHint) {
                    ids.push(startHint.id);
                }
                else if (this._hintLabel) {
                    ids.push(this._hintLabelId);
                }
                if (endHint) {
                    ids.push(endHint.id);
                }
            }
            else if (this._errorChildren) {
                ids = this._errorChildren.map(function (error) { return error.id; });
            }
            this._control.setDescribedByIds(ids);
        }
    };
    /** Throws an error if the form field's control is missing. */
    MatFormField.prototype._validateControlChild = function () {
        if (!this._control) {
            throw getMatFormFieldMissingControlError();
        }
    };
    /**
     * Updates the width and position of the gap in the outline. Only relevant for the outline
     * appearance.
     */
    MatFormField.prototype.updateOutlineGap = function () {
        var e_1, _a;
        var labelEl = this._label ? this._label.nativeElement : null;
        if (this.appearance !== 'outline' || !labelEl || !labelEl.children.length ||
            !labelEl.textContent.trim()) {
            return;
        }
        if (!this._platform.isBrowser) {
            // getBoundingClientRect isn't available on the server.
            return;
        }
        // If the element is not present in the DOM, the outline gap will need to be calculated
        // the next time it is checked and in the DOM.
        if (!document.documentElement.contains(this._elementRef.nativeElement)) {
            this._outlineGapCalculationNeededImmediately = true;
            return;
        }
        var startWidth = 0;
        var gapWidth = 0;
        var container = this._connectionContainerRef.nativeElement;
        var startEls = container.querySelectorAll('.mat-form-field-outline-start');
        var gapEls = container.querySelectorAll('.mat-form-field-outline-gap');
        if (this._label && this._label.nativeElement.children.length) {
            var containerRect = container.getBoundingClientRect();
            // If the container's width and height are zero, it means that the element is
            // invisible and we can't calculate the outline gap. Mark the element as needing
            // to be checked the next time the zone stabilizes. We can't do this immediately
            // on the next change detection, because even if the element becomes visible,
            // the `ClientRect` won't be reclaculated immediately. We reset the
            // `_outlineGapCalculationNeededImmediately` flag some we don't run the checks twice.
            if (containerRect.width === 0 && containerRect.height === 0) {
                this._outlineGapCalculationNeededOnStable = true;
                this._outlineGapCalculationNeededImmediately = false;
                return;
            }
            var containerStart = this._getStartEnd(containerRect);
            var labelStart = this._getStartEnd(labelEl.children[0].getBoundingClientRect());
            var labelWidth = 0;
            try {
                for (var _b = tslib_1.__values(labelEl.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    labelWidth += child.offsetWidth;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            startWidth = labelStart - containerStart - outlineGapPadding;
            gapWidth = labelWidth > 0 ? labelWidth * floatingLabelScale + outlineGapPadding * 2 : 0;
        }
        for (var i = 0; i < startEls.length; i++) {
            startEls.item(i).style.width = startWidth + "px";
        }
        for (var i = 0; i < gapEls.length; i++) {
            gapEls.item(i).style.width = gapWidth + "px";
        }
        this._outlineGapCalculationNeededOnStable =
            this._outlineGapCalculationNeededImmediately = false;
    };
    /** Gets the start end of the rect considering the current directionality. */
    MatFormField.prototype._getStartEnd = function (rect) {
        return this._dir && this._dir.value === 'rtl' ? rect.right : rect.left;
    };
    MatFormField.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-form-field',
                    exportAs: 'matFormField',
                    template: "<div class=\"mat-form-field-wrapper\">\n  <div class=\"mat-form-field-flex\" #connectionContainer\n       (click)=\"_control.onContainerClick && _control.onContainerClick($event)\">\n\n    <!-- Outline used for outline appearance. -->\n    <ng-container *ngIf=\"appearance == 'outline'\">\n      <div class=\"mat-form-field-outline\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n      <div class=\"mat-form-field-outline mat-form-field-outline-thick\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n    </ng-container>\n\n    <div class=\"mat-form-field-prefix\" *ngIf=\"_prefixChildren.length\">\n      <ng-content select=\"[matPrefix]\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-infix\" #inputContainer>\n      <ng-content></ng-content>\n\n      <span class=\"mat-form-field-label-wrapper\">\n        <!-- We add aria-owns as a workaround for an issue in JAWS & NVDA where the label isn't\n             read if it comes before the control in the DOM. -->\n        <label class=\"mat-form-field-label\"\n               (cdkObserveContent)=\"updateOutlineGap()\"\n               [cdkObserveContentDisabled]=\"appearance != 'outline'\"\n               [id]=\"_labelId\"\n               [attr.for]=\"_control.id\"\n               [attr.aria-owns]=\"_control.id\"\n               [class.mat-empty]=\"_control.empty && !_shouldAlwaysFloat\"\n               [class.mat-form-field-empty]=\"_control.empty && !_shouldAlwaysFloat\"\n               [class.mat-accent]=\"color == 'accent'\"\n               [class.mat-warn]=\"color == 'warn'\"\n               #label\n               *ngIf=\"_hasFloatingLabel()\"\n               [ngSwitch]=\"_hasLabel()\">\n\n          <!-- @breaking-change 8.0.0 remove in favor of mat-label element an placeholder attr. -->\n          <ng-container *ngSwitchCase=\"false\">\n            <ng-content select=\"mat-placeholder\"></ng-content>\n            <span>{{_control.placeholder}}</span>\n          </ng-container>\n\n          <ng-content select=\"mat-label\" *ngSwitchCase=\"true\"></ng-content>\n\n          <!-- @breaking-change 8.0.0 remove `mat-placeholder-required` class -->\n          <span\n            class=\"mat-placeholder-required mat-form-field-required-marker\"\n            aria-hidden=\"true\"\n            *ngIf=\"!hideRequiredMarker && _control.required && !_control.disabled\">&#32;*</span>\n        </label>\n      </span>\n    </div>\n\n    <div class=\"mat-form-field-suffix\" *ngIf=\"_suffixChildren.length\">\n      <ng-content select=\"[matSuffix]\"></ng-content>\n    </div>\n  </div>\n\n  <!-- Underline used for legacy, standard, and box appearances. -->\n  <div class=\"mat-form-field-underline\" #underline\n       *ngIf=\"appearance != 'outline'\">\n    <span class=\"mat-form-field-ripple\"\n          [class.mat-accent]=\"color == 'accent'\"\n          [class.mat-warn]=\"color == 'warn'\"></span>\n  </div>\n\n  <div class=\"mat-form-field-subscript-wrapper\"\n       [ngSwitch]=\"_getDisplayedMessages()\">\n    <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\">\n      <ng-content select=\"mat-error\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-hint-wrapper\" *ngSwitchCase=\"'hint'\"\n      [@transitionMessages]=\"_subscriptAnimationState\">\n      <!-- TODO(mmalerba): use an actual <mat-hint> once all selectors are switched to mat-* -->\n      <div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div>\n      <ng-content select=\"mat-hint:not([align='end'])\"></ng-content>\n      <div class=\"mat-form-field-hint-spacer\"></div>\n      <ng-content select=\"mat-hint[align='end']\"></ng-content>\n    </div>\n  </div>\n</div>\n",
                    animations: [matFormFieldAnimations.transitionMessages],
                    host: {
                        'class': 'mat-form-field',
                        '[class.mat-form-field-appearance-standard]': 'appearance == "standard"',
                        '[class.mat-form-field-appearance-fill]': 'appearance == "fill"',
                        '[class.mat-form-field-appearance-outline]': 'appearance == "outline"',
                        '[class.mat-form-field-appearance-legacy]': 'appearance == "legacy"',
                        '[class.mat-form-field-invalid]': '_control.errorState',
                        '[class.mat-form-field-can-float]': '_canLabelFloat',
                        '[class.mat-form-field-should-float]': '_shouldLabelFloat()',
                        '[class.mat-form-field-has-label]': '_hasFloatingLabel()',
                        '[class.mat-form-field-hide-placeholder]': '_hideControlPlaceholder()',
                        '[class.mat-form-field-disabled]': '_control.disabled',
                        '[class.mat-form-field-autofilled]': '_control.autofilled',
                        '[class.mat-focused]': '_control.focused',
                        '[class.mat-accent]': 'color == "accent"',
                        '[class.mat-warn]': 'color == "warn"',
                        '[class.ng-untouched]': '_shouldForward("untouched")',
                        '[class.ng-touched]': '_shouldForward("touched")',
                        '[class.ng-pristine]': '_shouldForward("pristine")',
                        '[class.ng-dirty]': '_shouldForward("dirty")',
                        '[class.ng-valid]': '_shouldForward("valid")',
                        '[class.ng-invalid]': '_shouldForward("invalid")',
                        '[class.ng-pending]': '_shouldForward("pending")',
                        '[class._mat-animation-noopable]': '!_animationsEnabled',
                    },
                    inputs: ['color'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}@media(-ms-high-contrast: active){.mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scaleY(1.0001)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:scaleX(1);transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}/*# sourceMappingURL=form-field.css.map */\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}@media(-ms-high-contrast: active){.mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}@media(-ms-high-contrast: active){.mat-form-field-appearance-fill .mat-form-field-ripple{height:0;border-top:solid 2px}}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}/*# sourceMappingURL=form-field-fill.css.map */\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}@media(-ms-high-contrast: active){.mat-focused select.mat-input-element::-ms-value{color:inherit}}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}/*# sourceMappingURL=form-field-input.css.map */\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}/*# sourceMappingURL=form-field-legacy.css.map */\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px;transition:border-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}/*# sourceMappingURL=form-field-outline.css.map */\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:2px}}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}/*# sourceMappingURL=form-field-standard.css.map */\n"]
                }] }
    ];
    /** @nocollapse */
    MatFormField.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_LABEL_GLOBAL_OPTIONS,] }] },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] },
        { type: Platform },
        { type: NgZone },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    MatFormField.propDecorators = {
        appearance: [{ type: Input }],
        hideRequiredMarker: [{ type: Input }],
        hintLabel: [{ type: Input }],
        floatLabel: [{ type: Input }],
        underlineRef: [{ type: ViewChild, args: ['underline', { static: false },] }],
        _connectionContainerRef: [{ type: ViewChild, args: ['connectionContainer', { static: true },] }],
        _inputContainerRef: [{ type: ViewChild, args: ['inputContainer', { static: false },] }],
        _label: [{ type: ViewChild, args: ['label', { static: false },] }],
        _controlNonStatic: [{ type: ContentChild, args: [MatFormFieldControl, { static: false },] }],
        _controlStatic: [{ type: ContentChild, args: [MatFormFieldControl, { static: true },] }],
        _labelChildNonStatic: [{ type: ContentChild, args: [MatLabel, { static: false },] }],
        _labelChildStatic: [{ type: ContentChild, args: [MatLabel, { static: true },] }],
        _placeholderChild: [{ type: ContentChild, args: [MatPlaceholder, { static: false },] }],
        _errorChildren: [{ type: ContentChildren, args: [MatError,] }],
        _hintChildren: [{ type: ContentChildren, args: [MatHint,] }],
        _prefixChildren: [{ type: ContentChildren, args: [MatPrefix,] }],
        _suffixChildren: [{ type: ContentChildren, args: [MatSuffix,] }]
    };
    return MatFormField;
}(_MatFormFieldMixinBase));
export { MatFormField };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBSUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBSUwsd0JBQXdCLEVBQ3hCLFVBQVUsR0FDWCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFDTCxrQ0FBa0MsRUFDbEMsa0NBQWtDLEVBQ2xDLHVDQUF1QyxHQUN4QyxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMs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Q3hCLGVBQWUsU0FBQyxPQUFPO2tDQUN2QixlQUFlLFNBQUMsU0FBUztrQ0FDekIsZUFBZSxTQUFDLFNBQVM7O0lBa1Q1QixtQkFBQztDQUFBLEFBMWRELENBK0NrQyxzQkFBc0IsR0EyYXZEO1NBM2FZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLFxuICBGbG9hdExhYmVsVHlwZSxcbiAgTGFiZWxPcHRpb25zLFxuICBNQVRfTEFCRUxfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIG1lcmdlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHttYXRGb3JtRmllbGRBbmltYXRpb25zfSBmcm9tICcuL2Zvcm0tZmllbGQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2x9IGZyb20gJy4vZm9ybS1maWVsZC1jb250cm9sJztcbmltcG9ydCB7XG4gIGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcixcbn0gZnJvbSAnLi9mb3JtLWZpZWxkLWVycm9ycyc7XG5pbXBvcnQge01hdEhpbnR9IGZyb20gJy4vaGludCc7XG5pbXBvcnQge01hdExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7TWF0UGxhY2Vob2xkZXJ9IGZyb20gJy4vcGxhY2Vob2xkZXInO1xuaW1wb3J0IHtNYXRQcmVmaXh9IGZyb20gJy4vcHJlZml4JztcbmltcG9ydCB7TWF0U3VmZml4fSBmcm9tICcuL3N1ZmZpeCc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuY29uc3QgZmxvYXRpbmdMYWJlbFNjYWxlID0gMC43NTtcbmNvbnN0IG91dGxpbmVHYXBQYWRkaW5nID0gNTtcblxuXG4vKipcbiAqIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Rm9ybUZpZWxkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBNYXRGb3JtRmllbGRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIHdoaWNoIHdlJ3JlIGFwcGx5aW5nIHRoZSBmb3JtIGZpZWxkIG1peGlucy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgX01hdEZvcm1GaWVsZE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEZvcm1GaWVsZEJhc2UgPVxuICAgIG1peGluQ29sb3IoTWF0Rm9ybUZpZWxkQmFzZSwgJ3ByaW1hcnknKTtcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgZm9ybSBmaWVsZC4gKi9cbmV4cG9ydCB0eXBlIE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCcgfCAnZmlsbCcgfCAnb3V0bGluZSc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgZm9ybSBmaWVsZCB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zIHtcbiAgYXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gIGhpZGVSZXF1aXJlZE1hcmtlcj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgZm9ybSBmaWVsZCB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnM+KCdNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMnKTtcblxuXG4vKiogQ29udGFpbmVyIGZvciBmb3JtIGNvbnRyb2xzIHRoYXQgYXBwbGllcyBNYXRlcmlhbCBEZXNpZ24gc3R5bGluZyBhbmQgYmVoYXZpb3IuICovXG5AQ29tcG9uZW50KHtcbiAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgc2VsZWN0b3I6ICdtYXQtZm9ybS1maWVsZCcsXG4gIGV4cG9ydEFzOiAnbWF0Rm9ybUZpZWxkJyxcbiAgdGVtcGxhdGVVcmw6ICdmb3JtLWZpZWxkLmh0bWwnLFxuICAvLyBNYXRJbnB1dCBpcyBhIGRpcmVjdGl2ZSBhbmQgY2FuJ3QgaGF2ZSBzdHlsZXMsIHNvIHdlIG5lZWQgdG8gaW5jbHVkZSBpdHMgc3R5bGVzIGhlcmVcbiAgLy8gaW4gZm9ybS1maWVsZC1pbnB1dC5jc3MuIFRoZSBNYXRJbnB1dCBzdHlsZXMgYXJlIGZhaXJseSBtaW5pbWFsIHNvIGl0IHNob3VsZG4ndCBiZSBhXG4gIC8vIGJpZyBkZWFsIGZvciBwZW9wbGUgd2hvIGFyZW4ndCB1c2luZyBNYXRJbnB1dC5cbiAgc3R5bGVVcmxzOiBbXG4gICAgJ2Zvcm0tZmllbGQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1maWxsLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtaW5wdXQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1sZWdhY3kuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1vdXRsaW5lLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtc3RhbmRhcmQuY3NzJyxcbiAgXSxcbiAgYW5pbWF0aW9uczogW21hdEZvcm1GaWVsZEFuaW1hdGlvbnMudHJhbnNpdGlvbk1lc3NhZ2VzXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZm9ybS1maWVsZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09IFwic3RhbmRhcmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWZpbGxdJzogJ2FwcGVhcmFuY2UgPT0gXCJmaWxsXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdhcHBlYXJhbmNlID09IFwib3V0bGluZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtbGVnYWN5XSc6ICdhcHBlYXJhbmNlID09IFwibGVnYWN5XCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaW52YWxpZF0nOiAnX2NvbnRyb2wuZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1jYW4tZmxvYXRdJzogJ19jYW5MYWJlbEZsb2F0JyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdF0nOiAnX3Nob3VsZExhYmVsRmxvYXQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1oYXMtbGFiZWxdJzogJ19oYXNGbG9hdGluZ0xhYmVsKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGlkZS1wbGFjZWhvbGRlcl0nOiAnX2hpZGVDb250cm9sUGxhY2Vob2xkZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1kaXNhYmxlZF0nOiAnX2NvbnRyb2wuZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGxlZF0nOiAnX2NvbnRyb2wuYXV0b2ZpbGxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9jdXNlZF0nOiAnX2NvbnRyb2wuZm9jdXNlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciA9PSBcImFjY2VudFwiJyxcbiAgICAnW2NsYXNzLm1hdC13YXJuXSc6ICdjb2xvciA9PSBcIndhcm5cIicsXG4gICAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ19zaG91bGRGb3J3YXJkKFwidW50b3VjaGVkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ19zaG91bGRGb3J3YXJkKFwidG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnX3Nob3VsZEZvcndhcmQoXCJwcmlzdGluZVwiKScsXG4gICAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnX3Nob3VsZEZvcndhcmQoXCJkaXJ0eVwiKScsXG4gICAgJ1tjbGFzcy5uZy12YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ2YWxpZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdfc2hvdWxkRm9yd2FyZChcImludmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctcGVuZGluZ10nOiAnX3Nob3VsZEZvcndhcmQoXCJwZW5kaW5nXCIpJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICchX2FuaW1hdGlvbnNFbmFibGVkJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcblxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZCBleHRlbmRzIF9NYXRGb3JtRmllbGRNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9sYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZFxuICAgKiBpbW1lZGlhdGVseSBvbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgbmV4dCB0aW1lIHRoZSB6b25lIGhhcyBzdGFiaWxpemVkLiAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBmb3JtLWZpZWxkIGFwcGVhcmFuY2Ugc3R5bGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgeyByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTsgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuYXBwZWFyYW5jZSkgfHwgJ2xlZ2FjeSc7XG5cbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSA9PT0gJ291dGxpbmUnICYmIG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgcmVxdWlyZWQgbWFya2VyIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUmVxdWlyZWRNYXJrZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXI7IH1cbiAgc2V0IGhpZGVSZXF1aXJlZE1hcmtlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGxvZ2ljIHRoYXQgZGlzYWJsZXMgdGhlIGxhYmVsIGFuaW1hdGlvbiBpbiBjZXJ0YWluIGNhc2VzLiAqL1xuICBwcml2YXRlIF9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBmbG9hdGluZyBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9zaG91bGRBbHdheXNGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mbG9hdExhYmVsID09PSAnYWx3YXlzJyAmJiAhdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgY2FuIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9jYW5MYWJlbEZsb2F0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5mbG9hdExhYmVsICE9PSAnbmV2ZXInOyB9XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBmb3JtIGZpZWxkIGhpbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaW50TGFiZWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2hpbnRMYWJlbDsgfVxuICBzZXQgaGludExhYmVsKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaW50TGFiZWwgPSB2YWx1ZTtcbiAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgfVxuICBwcml2YXRlIF9oaW50TGFiZWwgPSAnJztcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBoaW50IGxhYmVsLlxuICBfaGludExhYmVsSWQ6IHN0cmluZyA9IGBtYXQtaGludC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaW50ZXJuYWwgZm9ybSBmaWVsZCBsYWJlbC5cbiAgX2xhYmVsSWQgPSBgbWF0LWZvcm0tZmllbGQtbGFiZWwtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0LCBuZXZlciBmbG9hdCBvciBmbG9hdCBhcyB0aGUgdXNlciB0eXBlcy5cbiAgICpcbiAgICogTm90ZTogb25seSB0aGUgbGVnYWN5IGFwcGVhcmFuY2Ugc3VwcG9ydHMgdGhlIGBuZXZlcmAgb3B0aW9uLiBgbmV2ZXJgIHdhcyBvcmlnaW5hbGx5IGFkZGVkIGFzIGFcbiAgICogd2F5IHRvIG1ha2UgdGhlIGZsb2F0aW5nIGxhYmVsIGVtdWxhdGUgdGhlIGJlaGF2aW9yIG9mIGEgc3RhbmRhcmQgaW5wdXQgcGxhY2Vob2xkZXIuIEhvd2V2ZXJcbiAgICogdGhlIGZvcm0gZmllbGQgbm93IHN1cHBvcnRzIGJvdGggZmxvYXRpbmcgbGFiZWxzIGFuZCBwbGFjZWhvbGRlcnMuIFRoZXJlZm9yZSBpbiB0aGUgbm9uLWxlZ2FjeVxuICAgKiBhcHBlYXJhbmNlcyB0aGUgYG5ldmVyYCBvcHRpb24gaGFzIGJlZW4gZGlzYWJsZWQgaW4gZmF2b3Igb2YganVzdCB1c2luZyB0aGUgcGxhY2Vob2xkZXIuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZmxvYXRMYWJlbCgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSAhPT0gJ2xlZ2FjeScgJiYgdGhpcy5fZmxvYXRMYWJlbCA9PT0gJ25ldmVyJyA/ICdhdXRvJyA6IHRoaXMuX2Zsb2F0TGFiZWw7XG4gIH1cbiAgc2V0IGZsb2F0TGFiZWwodmFsdWU6IEZsb2F0TGFiZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mbG9hdExhYmVsKSB7XG4gICAgICB0aGlzLl9mbG9hdExhYmVsID0gdmFsdWUgfHwgdGhpcy5fbGFiZWxPcHRpb25zLmZsb2F0IHx8ICdhdXRvJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9mbG9hdExhYmVsOiBGbG9hdExhYmVsVHlwZTtcblxuICAvKiogV2hldGhlciB0aGUgQW5ndWxhciBhbmltYXRpb25zIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBWaWV3Q2hpbGQoJ3VuZGVybGluZScsIHtzdGF0aWM6IGZhbHNlfSkgdW5kZXJsaW5lUmVmOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2Nvbm5lY3Rpb25Db250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX2Nvbm5lY3Rpb25Db250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Q29udGFpbmVyJywge3N0YXRpYzogZmFsc2V9KSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJywge3N0YXRpYzogZmFsc2V9KSBwcml2YXRlIF9sYWJlbDogRWxlbWVudFJlZjtcblxuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wsIHtzdGF0aWM6IGZhbHNlfSkgX2NvbnRyb2xOb25TdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sLCB7c3RhdGljOiB0cnVlfSkgX2NvbnRyb2xTdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgZ2V0IF9jb250cm9sKCkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBuZWVkIHRoaXMgaGFja3kgd29ya2Fyb3VuZCBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5XG4gICAgLy8gYW5kIFZpZXdFbmdpbmUuIFdlIHNob3VsZCBjbGVhbiB0aGlzIHVwIG9uY2UgSXZ5IGlzIHRoZSBkZWZhdWx0IHJlbmRlcmVyLlxuICAgIHJldHVybiB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgfHwgdGhpcy5fY29udHJvbE5vblN0YXRpYyB8fCB0aGlzLl9jb250cm9sU3RhdGljO1xuICB9XG4gIHNldCBfY29udHJvbCh2YWx1ZSkge1xuICAgIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbDogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwsIHtzdGF0aWM6IGZhbHNlfSkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBnZXQgX2xhYmVsQ2hpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYztcbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIsIHtzdGF0aWM6IGZhbHNlfSkgX3BsYWNlaG9sZGVyQ2hpbGQ6IE1hdFBsYWNlaG9sZGVyO1xuICBAQ29udGVudENoaWxkcmVuKE1hdEVycm9yKSBfZXJyb3JDaGlsZHJlbjogUXVlcnlMaXN0PE1hdEVycm9yPjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRIaW50KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0UHJlZml4KSBfcHJlZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRQcmVmaXg+O1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN1ZmZpeCkgX3N1ZmZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0U3VmZml4PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfTEFCRUxfR0xPQkFMX09QVElPTlMpIGxhYmVsT3B0aW9uczogTGFiZWxPcHRpb25zLFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0czpcbiAgICAgICAgICBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucywgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBfYW5pbWF0aW9uTW9kZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fbGFiZWxPcHRpb25zID0gbGFiZWxPcHRpb25zID8gbGFiZWxPcHRpb25zIDoge307XG4gICAgdGhpcy5mbG9hdExhYmVsID0gdGhpcy5fbGFiZWxPcHRpb25zLmZsb2F0IHx8ICdhdXRvJztcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IChfZGVmYXVsdHMgJiYgX2RlZmF1bHRzLmFwcGVhcmFuY2UpID8gX2RlZmF1bHRzLmFwcGVhcmFuY2UgOiAnbGVnYWN5JztcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIgIT0gbnVsbCkgP1xuICAgICAgICBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBFbGVtZW50UmVmIGZvciB0aGUgZWxlbWVudCB0aGF0IGEgb3ZlcmxheSBhdHRhY2hlZCB0byB0aGUgZm9ybS1maWVsZCBzaG91bGQgYmVcbiAgICogcG9zaXRpb25lZCByZWxhdGl2ZSB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYgfHwgdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuX2NvbnRyb2w7XG5cbiAgICBpZiAoY29udHJvbC5jb250cm9sVHlwZSkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1mb3JtLWZpZWxkLXR5cGUtJHtjb250cm9sLmNvbnRyb2xUeXBlfWApO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBjaGlsZCBjb250cm9sIHN0YXRlIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgZm9ybSBmaWVsZCBVSS5cbiAgICBjb250cm9sLnN0YXRlQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsISkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcbiAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMudXBkYXRlT3V0bGluZUdhcCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBBdm9pZCBhbmltYXRpb25zIG9uIGxvYWQuXG4gICAgdGhpcy5fc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgY2xhc3MgZnJvbSB0aGUgTmdDb250cm9sIHNob3VsZCBiZSBmb3J3YXJkZWQgdG8gdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgX3Nob3VsZEZvcndhcmQocHJvcDoga2V5b2YgTmdDb250cm9sKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmdDb250cm9sID0gdGhpcy5fY29udHJvbCA/IHRoaXMuX2NvbnRyb2wubmdDb250cm9sIDogbnVsbDtcbiAgICByZXR1cm4gbmdDb250cm9sICYmIG5nQ29udHJvbFtwcm9wXTtcbiAgfVxuXG4gIF9oYXNQbGFjZWhvbGRlcigpIHtcbiAgICByZXR1cm4gISEodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyIHx8IHRoaXMuX3BsYWNlaG9sZGVyQ2hpbGQpO1xuICB9XG5cbiAgX2hhc0xhYmVsKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2xhYmVsQ2hpbGQ7XG4gIH1cblxuICBfc2hvdWxkTGFiZWxGbG9hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FuTGFiZWxGbG9hdCAmJiAodGhpcy5fY29udHJvbC5zaG91bGRMYWJlbEZsb2F0IHx8IHRoaXMuX3Nob3VsZEFsd2F5c0Zsb2F0KTtcbiAgfVxuXG4gIF9oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiAhdGhpcy5faGFzTGFiZWwoKSB8fFxuICAgICAgICB0aGlzLl9oYXNMYWJlbCgpICYmICF0aGlzLl9zaG91bGRMYWJlbEZsb2F0KCk7XG4gIH1cblxuICBfaGFzRmxvYXRpbmdMYWJlbCgpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuX2hhc0xhYmVsKCkgfHwgdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiB0aGlzLl9oYXNQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0byBkaXNwbGF5IGhpbnRzIG9yIGVycm9ycy4gKi9cbiAgX2dldERpc3BsYXllZE1lc3NhZ2VzKCk6ICdlcnJvcicgfCAnaGludCcge1xuICAgIHJldHVybiAodGhpcy5fZXJyb3JDaGlsZHJlbiAmJiB0aGlzLl9lcnJvckNoaWxkcmVuLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgdGhpcy5fY29udHJvbC5lcnJvclN0YXRlKSA/ICdlcnJvcicgOiAnaGludCc7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIHBsYWNlaG9sZGVyIHVwIGFuZCBsb2NrcyBpdCBpbiBwb3NpdGlvbi4gKi9cbiAgX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2hhc0Zsb2F0aW5nTGFiZWwoKSAmJiB0aGlzLl9jYW5MYWJlbEZsb2F0KSB7XG4gICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgd2Ugc2hvdWxkbid0IGdvIGluIGhlcmUsXG4gICAgICAvLyBiZWNhdXNlIHRoZSBgdHJhbnNpdGlvbmVuZGAgd2lsbCBuZXZlciBmaXJlLlxuICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICBmcm9tRXZlbnQodGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIHBsYWNlaG9sZGVyIChlaXRoZXIgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb24gdGhlIGNoaWxkIGNvbnRyb2xcbiAgICogb3IgY2hpbGQgZWxlbWVudCB3aXRoIHRoZSBgbWF0LXBsYWNlaG9sZGVyYCBkaXJlY3RpdmUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgJiYgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgYW55IGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy4gKi9cbiAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcbiAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYDxtYXQtaGludD5gIGFsaWdubWVudCBzcGVjaWZpZWQsIHdpdGggdGhlXG4gICAqIGF0dHJpYnV0ZSBiZWluZyBjb25zaWRlcmVkIGFzIGBhbGlnbj1cInN0YXJ0XCJgLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpIHtcbiAgICBpZiAodGhpcy5faGludENoaWxkcmVuKSB7XG4gICAgICBsZXQgc3RhcnRIaW50OiBNYXRIaW50O1xuICAgICAgbGV0IGVuZEhpbnQ6IE1hdEhpbnQ7XG4gICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogTWF0SGludCkgPT4ge1xuICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGlmIChzdGFydEhpbnQgfHwgdGhpcy5oaW50TGFiZWwpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignZW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGlzdCBvZiBlbGVtZW50IElEcyB0aGF0IGRlc2NyaWJlIHRoZSBjaGlsZCBjb250cm9sLiBUaGlzIGFsbG93cyB0aGUgY29udHJvbCB0byB1cGRhdGVcbiAgICogaXRzIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgYWNjb3JkaW5nbHkuXG4gICAqL1xuICBwcml2YXRlIF9zeW5jRGVzY3JpYmVkQnlJZHMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIGxldCBpZHM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgIGlmICh0aGlzLl9nZXREaXNwbGF5ZWRNZXNzYWdlcygpID09PSAnaGludCcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ3N0YXJ0JykgOiBudWxsO1xuICAgICAgICBjb25zdCBlbmRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ2VuZCcpIDogbnVsbDtcblxuICAgICAgICBpZiAoc3RhcnRIaW50KSB7XG4gICAgICAgICAgaWRzLnB1c2goc3RhcnRIaW50LmlkKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9oaW50TGFiZWwpIHtcbiAgICAgICAgICBpZHMucHVzaCh0aGlzLl9oaW50TGFiZWxJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKGVuZEhpbnQuaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2Vycm9yQ2hpbGRyZW4pIHtcbiAgICAgICAgaWRzID0gdGhpcy5fZXJyb3JDaGlsZHJlbi5tYXAoZXJyb3IgPT4gZXJyb3IuaWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb250cm9sLnNldERlc2NyaWJlZEJ5SWRzKGlkcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZm9ybSBmaWVsZCdzIGNvbnRyb2wgaXMgbWlzc2luZy4gKi9cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpIHtcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgd2lkdGggYW5kIHBvc2l0aW9uIG9mIHRoZSBnYXAgaW4gdGhlIG91dGxpbmUuIE9ubHkgcmVsZXZhbnQgZm9yIHRoZSBvdXRsaW5lXG4gICAqIGFwcGVhcmFuY2UuXG4gICAqL1xuICB1cGRhdGVPdXRsaW5lR2FwKCkge1xuICAgIGNvbnN0IGxhYmVsRWwgPSB0aGlzLl9sYWJlbCA/IHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHRoaXMuYXBwZWFyYW5jZSAhPT0gJ291dGxpbmUnIHx8ICFsYWJlbEVsIHx8ICFsYWJlbEVsLmNoaWxkcmVuLmxlbmd0aCB8fFxuICAgICAgICAhbGFiZWxFbC50ZXh0Q29udGVudC50cmltKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgLy8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0IGlzbid0IGF2YWlsYWJsZSBvbiB0aGUgc2VydmVyLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBpcyBub3QgcHJlc2VudCBpbiB0aGUgRE9NLCB0aGUgb3V0bGluZSBnYXAgd2lsbCBuZWVkIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICAvLyB0aGUgbmV4dCB0aW1lIGl0IGlzIGNoZWNrZWQgYW5kIGluIHRoZSBET00uXG4gICAgaWYgKCFkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNvbnRhaW5zKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRXaWR0aCA9IDA7XG4gICAgbGV0IGdhcFdpZHRoID0gMDtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdGFydEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1zdGFydCcpO1xuICAgIGNvbnN0IGdhcEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1nYXAnKTtcblxuICAgIGlmICh0aGlzLl9sYWJlbCAmJiB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8sIGl0IG1lYW5zIHRoYXQgdGhlIGVsZW1lbnQgaXNcbiAgICAgIC8vIGludmlzaWJsZSBhbmQgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSBvdXRsaW5lIGdhcC4gTWFyayB0aGUgZWxlbWVudCBhcyBuZWVkaW5nXG4gICAgICAvLyB0byBiZSBjaGVja2VkIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy4gV2UgY2FuJ3QgZG8gdGhpcyBpbW1lZGlhdGVseVxuICAgICAgLy8gb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiwgYmVjYXVzZSBldmVuIGlmIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSxcbiAgICAgIC8vIHRoZSBgQ2xpZW50UmVjdGAgd29uJ3QgYmUgcmVjbGFjdWxhdGVkIGltbWVkaWF0ZWx5LiBXZSByZXNldCB0aGVcbiAgICAgIC8vIGBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHlgIGZsYWcgc29tZSB3ZSBkb24ndCBydW4gdGhlIGNoZWNrcyB0d2ljZS5cbiAgICAgIGlmIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGNvbnRhaW5lclJlY3QpO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsRWwuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGxhYmVsRWwuY2hpbGRyZW4pIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSBjaGlsZC5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHN0YXJ0V2lkdGggPSBsYWJlbFN0YXJ0IC0gY29udGFpbmVyU3RhcnQgLSBvdXRsaW5lR2FwUGFkZGluZztcbiAgICAgIGdhcFdpZHRoID0gbGFiZWxXaWR0aCA+IDAgPyBsYWJlbFdpZHRoICogZmxvYXRpbmdMYWJlbFNjYWxlICsgb3V0bGluZUdhcFBhZGRpbmcgKiAyIDogMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0RWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdGFydEVscy5pdGVtKGkpLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHMuaXRlbShpKS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgZW5kIG9mIHRoZSByZWN0IGNvbnNpZGVyaW5nIHRoZSBjdXJyZW50IGRpcmVjdGlvbmFsaXR5LiAqL1xuICBwcml2YXRlIF9nZXRTdGFydEVuZChyZWN0OiBDbGllbnRSZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0O1xuICB9XG59XG4iXX0=