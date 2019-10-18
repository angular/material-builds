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
        /* Holds the previous direction emitted by directionality service change emitter.
           This is used in updateOutlineGap() method to update the width and position of the gap in the
           outline. Only relevant for the outline appearance. The direction is getting updated in the
           UI after directionality service change emission. So the outlines gaps are getting
           updated in updateOutlineGap() method before connectionContainer child direction change
           in UI. We may get wrong calculations. So we are storing the previous direction to get the
           correct outline calculations*/
        _this._previousDirection = 'ltr';
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
            this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(function () {
                _this.updateOutlineGap();
                _this._previousDirection = _this._dir.value;
            });
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
        if (!this._isAttachedToDOM()) {
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
        return this._previousDirection === 'rtl' ? rect.right : rect.left;
    };
    /** Checks whether the form field is attached to the DOM. */
    MatFormField.prototype._isAttachedToDOM = function () {
        var element = this._elementRef.nativeElement;
        if (element.getRootNode) {
            var rootNode = element.getRootNode();
            // If the element is inside the DOM the root node will be either the document
            // or the closest shadow root, otherwise it'll be the element itself.
            return rootNode && rootNode !== element;
        }
        // Otherwise fall back to checking if it's in the document. This doesn't account for
        // shadow DOM, however browser that support shadow DOM should support `getRootNode` as well.
        return document.documentElement.contains(element);
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
                    styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}@media(-ms-high-contrast: active){.mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scaleY(1.0001)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:scaleX(1);transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}@media(-ms-high-contrast: active){.mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}@media(-ms-high-contrast: active){.mat-form-field-appearance-fill .mat-form-field-ripple{height:0;border-top:solid 2px}}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}@media(-ms-high-contrast: active){.mat-focused select.mat-input-element::-ms-value{color:inherit}}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}@media(-ms-high-contrast: active){.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px;transition:border-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:2px}}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}@media(-ms-high-contrast: active){.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n"]
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
        _errorChildren: [{ type: ContentChildren, args: [MatError, { descendants: true },] }],
        _hintChildren: [{ type: ContentChildren, args: [MatHint, { descendants: true },] }],
        _prefixChildren: [{ type: ContentChildren, args: [MatPrefix, { descendants: true },] }],
        _suffixChildren: [{ type: ContentChildren, args: [MatSuffix, { descendants: true },] }]
    };
    return MatFormField;
}(_MatFormFieldMixinBase));
export { MatFormField };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBWSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBSUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBSUwsd0JBQXdCLEVBQ3hCLFVBQVUsR0FDWCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMvQyxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3pELE9BQU8sRUFDTCxrQ0FBa0MsRUFDbEMsa0NBQWtDLEVBQ2xDLHVDQUF1QyxHQUN4QyxNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFNBQVMs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QUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7eUJBQzNDLFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO29DQUVsQyxZQUFZLFNBQUMsbUJBQW1CLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO2lDQUNqRCxZQUFZLFNBQUMsbUJBQW1CLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3VDQVdoRCxZQUFZLFNBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztvQ0FDdEMsWUFBWSxTQUFDLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7b0NBS3JDLFlBQVksU0FBQyxjQUFjLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO2lDQUM1QyxlQUFlLFNBQUMsUUFBUSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQ0FDN0MsZUFBZSxTQUFDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7a0NBQzVDLGVBQWUsU0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2tDQUM5QyxlQUFlLFNBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs7SUFxVWpELG1CQUFDO0NBQUEsQUF0ZkQsQ0ErQ2tDLHNCQUFzQixHQXVjdkQ7U0F2Y1ksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsIENhbkNvbG9yQ3RvcixcbiAgRmxvYXRMYWJlbFR5cGUsXG4gIExhYmVsT3B0aW9ucyxcbiAgTUFUX0xBQkVMX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkNvbG9yLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdEVycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7bWF0Rm9ybUZpZWxkQW5pbWF0aW9uc30gZnJvbSAnLi9mb3JtLWZpZWxkLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sfSBmcm9tICcuL2Zvcm0tZmllbGQtY29udHJvbCc7XG5pbXBvcnQge1xuICBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRQbGFjZWhvbGRlckNvbmZsaWN0RXJyb3IsXG59IGZyb20gJy4vZm9ybS1maWVsZC1lcnJvcnMnO1xuaW1wb3J0IHtNYXRIaW50fSBmcm9tICcuL2hpbnQnO1xuaW1wb3J0IHtNYXRMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge01hdFBsYWNlaG9sZGVyfSBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCB7TWF0UHJlZml4fSBmcm9tICcuL3ByZWZpeCc7XG5pbXBvcnQge01hdFN1ZmZpeH0gZnJvbSAnLi9zdWZmaXgnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcbmNvbnN0IGZsb2F0aW5nTGFiZWxTY2FsZSA9IDAuNzU7XG5jb25zdCBvdXRsaW5lR2FwUGFkZGluZyA9IDU7XG5cblxuLyoqXG4gKiBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEZvcm1GaWVsZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY2xhc3MgTWF0Rm9ybUZpZWxkQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byB3aGljaCB3ZSdyZSBhcHBseWluZyB0aGUgZm9ybSBmaWVsZCBtaXhpbnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IF9NYXRGb3JtRmllbGRNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRGb3JtRmllbGRCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdEZvcm1GaWVsZEJhc2UsICdwcmltYXJ5Jyk7XG5cbi8qKiBQb3NzaWJsZSBhcHBlYXJhbmNlIHN0eWxlcyBmb3IgdGhlIGZvcm0gZmllbGQuICovXG5leHBvcnQgdHlwZSBNYXRGb3JtRmllbGRBcHBlYXJhbmNlID0gJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGZvcm0gZmllbGQgdGhhdCBjYW4gYmUgY29uZmlndXJlZFxuICogdXNpbmcgdGhlIGBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucyB7XG4gIGFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuICBoaWRlUmVxdWlyZWRNYXJrZXI/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGVcbiAqIGRlZmF1bHQgb3B0aW9ucyBmb3IgYWxsIGZvcm0gZmllbGQgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zPignTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TJyk7XG5cblxuLyoqIENvbnRhaW5lciBmb3IgZm9ybSBjb250cm9scyB0aGF0IGFwcGxpZXMgTWF0ZXJpYWwgRGVzaWduIHN0eWxpbmcgYW5kIGJlaGF2aW9yLiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWZvcm0tZmllbGQnLFxuICBleHBvcnRBczogJ21hdEZvcm1GaWVsZCcsXG4gIHRlbXBsYXRlVXJsOiAnZm9ybS1maWVsZC5odG1sJyxcbiAgLy8gTWF0SW5wdXQgaXMgYSBkaXJlY3RpdmUgYW5kIGNhbid0IGhhdmUgc3R5bGVzLCBzbyB3ZSBuZWVkIHRvIGluY2x1ZGUgaXRzIHN0eWxlcyBoZXJlXG4gIC8vIGluIGZvcm0tZmllbGQtaW5wdXQuY3NzLiBUaGUgTWF0SW5wdXQgc3R5bGVzIGFyZSBmYWlybHkgbWluaW1hbCBzbyBpdCBzaG91bGRuJ3QgYmUgYVxuICAvLyBiaWcgZGVhbCBmb3IgcGVvcGxlIHdobyBhcmVuJ3QgdXNpbmcgTWF0SW5wdXQuXG4gIHN0eWxlVXJsczogW1xuICAgICdmb3JtLWZpZWxkLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtZmlsbC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWlucHV0LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtbGVnYWN5LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtb3V0bGluZS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLXN0YW5kYXJkLmNzcycsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFttYXRGb3JtRmllbGRBbmltYXRpb25zLnRyYW5zaXRpb25NZXNzYWdlc10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvcm0tZmllbGQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PSBcInN0YW5kYXJkXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1maWxsXSc6ICdhcHBlYXJhbmNlID09IFwiZmlsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utb3V0bGluZV0nOiAnYXBwZWFyYW5jZSA9PSBcIm91dGxpbmVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWxlZ2FjeV0nOiAnYXBwZWFyYW5jZSA9PSBcImxlZ2FjeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWludmFsaWRdJzogJ19jb250cm9sLmVycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtY2FuLWZsb2F0XSc6ICdfY2FuTGFiZWxGbG9hdCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXRdJzogJ19zaG91bGRMYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsXSc6ICdfaGFzRmxvYXRpbmdMYWJlbCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpZGUtcGxhY2Vob2xkZXJdJzogJ19oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtZGlzYWJsZWRdJzogJ19jb250cm9sLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWRdJzogJ19jb250cm9sLmF1dG9maWxsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvY3VzZWRdJzogJ19jb250cm9sLmZvY3VzZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInVudG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ19zaG91bGRGb3J3YXJkKFwicHJpc3RpbmVcIiknLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ19zaG91bGRGb3J3YXJkKFwiZGlydHlcIiknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwidmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJpbnZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ19zaG91bGRGb3J3YXJkKFwicGVuZGluZ1wiKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnIV9hbmltYXRpb25zRW5hYmxlZCcsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGQgZXh0ZW5kcyBfTWF0Rm9ybUZpZWxkTWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkNvbG9yIHtcbiAgcHJpdmF0ZSBfbGFiZWxPcHRpb25zOiBMYWJlbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICogaW1tZWRpYXRlbHkgb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gICAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdXRsaW5lIGdhcCBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIG5leHQgdGltZSB0aGUgem9uZSBoYXMgc3RhYmlsaXplZC4gKi9cbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSBmYWxzZTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZm9ybS1maWVsZCBhcHBlYXJhbmNlIHN0eWxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlIHsgcmV0dXJuIHRoaXMuX2FwcGVhcmFuY2U7IH1cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UpIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX2FwcGVhcmFuY2U7XG5cbiAgICB0aGlzLl9hcHBlYXJhbmNlID0gdmFsdWUgfHwgKHRoaXMuX2RlZmF1bHRzICYmIHRoaXMuX2RlZmF1bHRzLmFwcGVhcmFuY2UpIHx8ICdsZWdhY3knO1xuXG4gICAgaWYgKHRoaXMuX2FwcGVhcmFuY2UgPT09ICdvdXRsaW5lJyAmJiBvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgX2FwcGVhcmFuY2U6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJlcXVpcmVkIG1hcmtlciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVJlcXVpcmVkTWFya2VyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyOyB9XG4gIHNldCBoaWRlUmVxdWlyZWRNYXJrZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVSZXF1aXJlZE1hcmtlcjogYm9vbGVhbjtcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBsb2dpYyB0aGF0IGRpc2FibGVzIHRoZSBsYWJlbCBhbmltYXRpb24gaW4gY2VydGFpbiBjYXNlcy4gKi9cbiAgcHJpdmF0ZSBfc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZmxvYXRpbmcgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCBvciBub3QuICovXG4gIGdldCBfc2hvdWxkQWx3YXlzRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCA9PT0gJ2Fsd2F5cycgJiYgIXRoaXMuX3Nob3dBbHdheXNBbmltYXRlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGNhbiBmbG9hdCBvciBub3QuICovXG4gIGdldCBfY2FuTGFiZWxGbG9hdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCAhPT0gJ25ldmVyJzsgfVxuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgbWF0LWhpbnQgYW5kIG1hdC1lcnJvciBhbmltYXRpb25zLiAqL1xuICBfc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGU6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBUZXh0IGZvciB0aGUgZm9ybSBmaWVsZCBoaW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGludExhYmVsKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9oaW50TGFiZWw7IH1cbiAgc2V0IGhpbnRMYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faGludExhYmVsID0gdmFsdWU7XG4gICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGludExhYmVsID0gJyc7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaGludCBsYWJlbC5cbiAgX2hpbnRMYWJlbElkOiBzdHJpbmcgPSBgbWF0LWhpbnQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGludGVybmFsIGZvcm0gZmllbGQgbGFiZWwuXG4gIF9sYWJlbElkID0gYG1hdC1mb3JtLWZpZWxkLWxhYmVsLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCwgbmV2ZXIgZmxvYXQgb3IgZmxvYXQgYXMgdGhlIHVzZXIgdHlwZXMuXG4gICAqXG4gICAqIE5vdGU6IG9ubHkgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHN1cHBvcnRzIHRoZSBgbmV2ZXJgIG9wdGlvbi4gYG5ldmVyYCB3YXMgb3JpZ2luYWxseSBhZGRlZCBhcyBhXG4gICAqIHdheSB0byBtYWtlIHRoZSBmbG9hdGluZyBsYWJlbCBlbXVsYXRlIHRoZSBiZWhhdmlvciBvZiBhIHN0YW5kYXJkIGlucHV0IHBsYWNlaG9sZGVyLiBIb3dldmVyXG4gICAqIHRoZSBmb3JtIGZpZWxkIG5vdyBzdXBwb3J0cyBib3RoIGZsb2F0aW5nIGxhYmVscyBhbmQgcGxhY2Vob2xkZXJzLiBUaGVyZWZvcmUgaW4gdGhlIG5vbi1sZWdhY3lcbiAgICogYXBwZWFyYW5jZXMgdGhlIGBuZXZlcmAgb3B0aW9uIGhhcyBiZWVuIGRpc2FibGVkIGluIGZhdm9yIG9mIGp1c3QgdXNpbmcgdGhlIHBsYWNlaG9sZGVyLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGZsb2F0TGFiZWwoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgIT09ICdsZWdhY3knICYmIHRoaXMuX2Zsb2F0TGFiZWwgPT09ICduZXZlcicgPyAnYXV0bycgOiB0aGlzLl9mbG9hdExhYmVsO1xuICB9XG4gIHNldCBmbG9hdExhYmVsKHZhbHVlOiBGbG9hdExhYmVsVHlwZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZmxvYXRMYWJlbCkge1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCA9IHZhbHVlIHx8IHRoaXMuX2xhYmVsT3B0aW9ucy5mbG9hdCB8fCAnYXV0byc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZmxvYXRMYWJlbDogRmxvYXRMYWJlbFR5cGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIEFuZ3VsYXIgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNFbmFibGVkOiBib29sZWFuO1xuXG4gIC8qIEhvbGRzIHRoZSBwcmV2aW91cyBkaXJlY3Rpb24gZW1pdHRlZCBieSBkaXJlY3Rpb25hbGl0eSBzZXJ2aWNlIGNoYW5nZSBlbWl0dGVyLlxuICAgICBUaGlzIGlzIHVzZWQgaW4gdXBkYXRlT3V0bGluZUdhcCgpIG1ldGhvZCB0byB1cGRhdGUgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZVxuICAgICBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZSBhcHBlYXJhbmNlLiBUaGUgZGlyZWN0aW9uIGlzIGdldHRpbmcgdXBkYXRlZCBpbiB0aGVcbiAgICAgVUkgYWZ0ZXIgZGlyZWN0aW9uYWxpdHkgc2VydmljZSBjaGFuZ2UgZW1pc3Npb24uIFNvIHRoZSBvdXRsaW5lcyBnYXBzIGFyZSBnZXR0aW5nXG4gICAgIHVwZGF0ZWQgaW4gdXBkYXRlT3V0bGluZUdhcCgpIG1ldGhvZCBiZWZvcmUgY29ubmVjdGlvbkNvbnRhaW5lciBjaGlsZCBkaXJlY3Rpb24gY2hhbmdlXG4gICAgIGluIFVJLiBXZSBtYXkgZ2V0IHdyb25nIGNhbGN1bGF0aW9ucy4gU28gd2UgYXJlIHN0b3JpbmcgdGhlIHByZXZpb3VzIGRpcmVjdGlvbiB0byBnZXQgdGhlXG4gICAgIGNvcnJlY3Qgb3V0bGluZSBjYWxjdWxhdGlvbnMqL1xuICBwcml2YXRlIF9wcmV2aW91c0RpcmVjdGlvbjogRGlyZWN0aW9uID0gJ2x0cic7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBWaWV3Q2hpbGQoJ3VuZGVybGluZScsIHtzdGF0aWM6IGZhbHNlfSkgdW5kZXJsaW5lUmVmOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2Nvbm5lY3Rpb25Db250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX2Nvbm5lY3Rpb25Db250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Q29udGFpbmVyJywge3N0YXRpYzogZmFsc2V9KSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJywge3N0YXRpYzogZmFsc2V9KSBwcml2YXRlIF9sYWJlbDogRWxlbWVudFJlZjtcblxuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wsIHtzdGF0aWM6IGZhbHNlfSkgX2NvbnRyb2xOb25TdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sLCB7c3RhdGljOiB0cnVlfSkgX2NvbnRyb2xTdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgZ2V0IF9jb250cm9sKCkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBuZWVkIHRoaXMgaGFja3kgd29ya2Fyb3VuZCBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5XG4gICAgLy8gYW5kIFZpZXdFbmdpbmUuIFdlIHNob3VsZCBjbGVhbiB0aGlzIHVwIG9uY2UgSXZ5IGlzIHRoZSBkZWZhdWx0IHJlbmRlcmVyLlxuICAgIHJldHVybiB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgfHwgdGhpcy5fY29udHJvbE5vblN0YXRpYyB8fCB0aGlzLl9jb250cm9sU3RhdGljO1xuICB9XG4gIHNldCBfY29udHJvbCh2YWx1ZSkge1xuICAgIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbDogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwsIHtzdGF0aWM6IGZhbHNlfSkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBnZXQgX2xhYmVsQ2hpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYztcbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIsIHtzdGF0aWM6IGZhbHNlfSkgX3BsYWNlaG9sZGVyQ2hpbGQ6IE1hdFBsYWNlaG9sZGVyO1xuICBAQ29udGVudENoaWxkcmVuKE1hdEVycm9yLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfZXJyb3JDaGlsZHJlbjogUXVlcnlMaXN0PE1hdEVycm9yPjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRIaW50LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0UHJlZml4LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfcHJlZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRQcmVmaXg+O1xuICBAQ29udGVudENoaWxkcmVuKE1hdFN1ZmZpeCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3N1ZmZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0U3VmZml4PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfTEFCRUxfR0xPQkFMX09QVElPTlMpIGxhYmVsT3B0aW9uczogTGFiZWxPcHRpb25zLFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0czpcbiAgICAgICAgICBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucywgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBfYW5pbWF0aW9uTW9kZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoX2VsZW1lbnRSZWYpO1xuXG4gICAgdGhpcy5fbGFiZWxPcHRpb25zID0gbGFiZWxPcHRpb25zID8gbGFiZWxPcHRpb25zIDoge307XG4gICAgdGhpcy5mbG9hdExhYmVsID0gdGhpcy5fbGFiZWxPcHRpb25zLmZsb2F0IHx8ICdhdXRvJztcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IChfZGVmYXVsdHMgJiYgX2RlZmF1bHRzLmFwcGVhcmFuY2UpID8gX2RlZmF1bHRzLmFwcGVhcmFuY2UgOiAnbGVnYWN5JztcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIgIT0gbnVsbCkgP1xuICAgICAgICBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBFbGVtZW50UmVmIGZvciB0aGUgZWxlbWVudCB0aGF0IGEgb3ZlcmxheSBhdHRhY2hlZCB0byB0aGUgZm9ybS1maWVsZCBzaG91bGQgYmVcbiAgICogcG9zaXRpb25lZCByZWxhdGl2ZSB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYgfHwgdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuX2NvbnRyb2w7XG5cbiAgICBpZiAoY29udHJvbC5jb250cm9sVHlwZSkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1mb3JtLWZpZWxkLXR5cGUtJHtjb250cm9sLmNvbnRyb2xUeXBlfWApO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBjaGlsZCBjb250cm9sIHN0YXRlIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgZm9ybSBmaWVsZCBVSS5cbiAgICBjb250cm9sLnN0YXRlQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsISkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIHRoaXMuX3ByZXZpb3VzRGlyZWN0aW9uID0gdGhpcy5fZGlyLnZhbHVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQXZvaWQgYW5pbWF0aW9ucyBvbiBsb2FkLlxuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIE5nQ29udHJvbCBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIF9zaG91bGRGb3J3YXJkKHByb3A6IGtleW9mIE5nQ29udHJvbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2NvbnRyb2wgPyB0aGlzLl9jb250cm9sLm5nQ29udHJvbCA6IG51bGw7XG4gICAgcmV0dXJuIG5nQ29udHJvbCAmJiBuZ0NvbnRyb2xbcHJvcF07XG4gIH1cblxuICBfaGFzUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2NvbnRyb2wgJiYgdGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciB8fCB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKTtcbiAgfVxuXG4gIF9oYXNMYWJlbCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9sYWJlbENoaWxkO1xuICB9XG5cbiAgX3Nob3VsZExhYmVsRmxvYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbkxhYmVsRmxvYXQgJiYgKHRoaXMuX2NvbnRyb2wuc2hvdWxkTGFiZWxGbG9hdCB8fCB0aGlzLl9zaG91bGRBbHdheXNGbG9hdCk7XG4gIH1cblxuICBfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIXRoaXMuX2hhc0xhYmVsKCkgfHxcbiAgICAgICAgdGhpcy5faGFzTGFiZWwoKSAmJiAhdGhpcy5fc2hvdWxkTGFiZWxGbG9hdCgpO1xuICB9XG5cbiAgX2hhc0Zsb2F0aW5nTGFiZWwoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLl9oYXNMYWJlbCgpIHx8IHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgdGhpcy5faGFzUGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZGlzcGxheSBoaW50cyBvciBlcnJvcnMuICovXG4gIF9nZXREaXNwbGF5ZWRNZXNzYWdlcygpOiAnZXJyb3InIHwgJ2hpbnQnIHtcbiAgICByZXR1cm4gKHRoaXMuX2Vycm9yQ2hpbGRyZW4gJiYgdGhpcy5fZXJyb3JDaGlsZHJlbi5sZW5ndGggPiAwICYmXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuZXJyb3JTdGF0ZSkgPyAnZXJyb3InIDogJ2hpbnQnO1xuICB9XG5cbiAgLyoqIEFuaW1hdGVzIHRoZSBwbGFjZWhvbGRlciB1cCBhbmQgbG9ja3MgaXQgaW4gcG9zaXRpb24uICovXG4gIF9hbmltYXRlQW5kTG9ja0xhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgJiYgdGhpcy5fY2FuTGFiZWxGbG9hdCkge1xuICAgICAgLy8gSWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHdlIHNob3VsZG4ndCBnbyBpbiBoZXJlLFxuICAgICAgLy8gYmVjYXVzZSB0aGUgYHRyYW5zaXRpb25lbmRgIHdpbGwgbmV2ZXIgZmlyZS5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRpb25zRW5hYmxlZCkge1xuICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IHRydWU7XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZsb2F0TGFiZWwgPSAnYWx3YXlzJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBwbGFjZWhvbGRlciAoZWl0aGVyIGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlIG9uIHRoZSBjaGlsZCBjb250cm9sXG4gICAqIG9yIGNoaWxkIGVsZW1lbnQgd2l0aCB0aGUgYG1hdC1wbGFjZWhvbGRlcmAgZGlyZWN0aXZlKS5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlUGxhY2Vob2xkZXJzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyICYmIHRoaXMuX3BsYWNlaG9sZGVyQ2hpbGQpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIGFueSBleHRyYSBwcm9jZXNzaW5nIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiBoYW5kbGluZyB0aGUgaGludHMuICovXG4gIHByaXZhdGUgX3Byb2Nlc3NIaW50cygpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUhpbnRzKCk7XG4gICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgYSBtYXhpbXVtIG9mIG9uZSBvZiBlYWNoIGA8bWF0LWhpbnQ+YCBhbGlnbm1lbnQgc3BlY2lmaWVkLCB3aXRoIHRoZVxuICAgKiBhdHRyaWJ1dGUgYmVpbmcgY29uc2lkZXJlZCBhcyBgYWxpZ249XCJzdGFydFwiYC5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlSGludHMoKSB7XG4gICAgaWYgKHRoaXMuX2hpbnRDaGlsZHJlbikge1xuICAgICAgbGV0IHN0YXJ0SGludDogTWF0SGludDtcbiAgICAgIGxldCBlbmRIaW50OiBNYXRIaW50O1xuICAgICAgdGhpcy5faGludENoaWxkcmVuLmZvckVhY2goKGhpbnQ6IE1hdEhpbnQpID0+IHtcbiAgICAgICAgaWYgKGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIHtcbiAgICAgICAgICBpZiAoc3RhcnRIaW50IHx8IHRoaXMuaGludExhYmVsKSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yKCdzdGFydCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFydEhpbnQgPSBoaW50O1xuICAgICAgICB9IGVsc2UgaWYgKGhpbnQuYWxpZ24gPT09ICdlbmQnKSB7XG4gICAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ2VuZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbmRIaW50ID0gaGludDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBkZXNjcmliZSB0aGUgY2hpbGQgY29udHJvbC4gVGhpcyBhbGxvd3MgdGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAqIGl0cyBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0Rlc2NyaWJlZEJ5SWRzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XG4gICAgICBsZXQgaWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKSA9PT0gJ2hpbnQnKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdlbmQnKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXJ0SGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faGludExhYmVsKSB7XG4gICAgICAgICAgaWRzLnB1c2godGhpcy5faGludExhYmVsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJvckNoaWxkcmVuKSB7XG4gICAgICAgIGlkcyA9IHRoaXMuX2Vycm9yQ2hpbGRyZW4ubWFwKGVycm9yID0+IGVycm9yLmlkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29udHJvbC5zZXREZXNjcmliZWRCeUlkcyhpZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGZvcm0gZmllbGQncyBjb250cm9sIGlzIG1pc3NpbmcuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVDb250cm9sQ2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250cm9sKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZSBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZVxuICAgKiBhcHBlYXJhbmNlLlxuICAgKi9cbiAgdXBkYXRlT3V0bGluZUdhcCgpIHtcbiAgICBjb25zdCBsYWJlbEVsID0gdGhpcy5fbGFiZWwgPyB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmICh0aGlzLmFwcGVhcmFuY2UgIT09ICdvdXRsaW5lJyB8fCAhbGFiZWxFbCB8fCAhbGFiZWxFbC5jaGlsZHJlbi5sZW5ndGggfHxcbiAgICAgICAgIWxhYmVsRWwudGV4dENvbnRlbnQudHJpbSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpc24ndCBhdmFpbGFibGUgb24gdGhlIHNlcnZlci5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQgaW4gdGhlIERPTSwgdGhlIG91dGxpbmUgZ2FwIHdpbGwgbmVlZCB0byBiZSBjYWxjdWxhdGVkXG4gICAgLy8gdGhlIG5leHQgdGltZSBpdCBpcyBjaGVja2VkIGFuZCBpbiB0aGUgRE9NLlxuICAgIGlmICghdGhpcy5faXNBdHRhY2hlZFRvRE9NKCkpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRXaWR0aCA9IDA7XG4gICAgbGV0IGdhcFdpZHRoID0gMDtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdGFydEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1zdGFydCcpO1xuICAgIGNvbnN0IGdhcEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1nYXAnKTtcblxuICAgIGlmICh0aGlzLl9sYWJlbCAmJiB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8sIGl0IG1lYW5zIHRoYXQgdGhlIGVsZW1lbnQgaXNcbiAgICAgIC8vIGludmlzaWJsZSBhbmQgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSBvdXRsaW5lIGdhcC4gTWFyayB0aGUgZWxlbWVudCBhcyBuZWVkaW5nXG4gICAgICAvLyB0byBiZSBjaGVja2VkIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy4gV2UgY2FuJ3QgZG8gdGhpcyBpbW1lZGlhdGVseVxuICAgICAgLy8gb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiwgYmVjYXVzZSBldmVuIGlmIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSxcbiAgICAgIC8vIHRoZSBgQ2xpZW50UmVjdGAgd29uJ3QgYmUgcmVjbGFjdWxhdGVkIGltbWVkaWF0ZWx5LiBXZSByZXNldCB0aGVcbiAgICAgIC8vIGBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHlgIGZsYWcgc29tZSB3ZSBkb24ndCBydW4gdGhlIGNoZWNrcyB0d2ljZS5cbiAgICAgIGlmIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGNvbnRhaW5lclJlY3QpO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsRWwuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIGxhYmVsRWwuY2hpbGRyZW4pIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSBjaGlsZC5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHN0YXJ0V2lkdGggPSBsYWJlbFN0YXJ0IC0gY29udGFpbmVyU3RhcnQgLSBvdXRsaW5lR2FwUGFkZGluZztcbiAgICAgIGdhcFdpZHRoID0gbGFiZWxXaWR0aCA+IDAgPyBsYWJlbFdpZHRoICogZmxvYXRpbmdMYWJlbFNjYWxlICsgb3V0bGluZUdhcFBhZGRpbmcgKiAyIDogMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0RWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdGFydEVscy5pdGVtKGkpLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHMuaXRlbShpKS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgZW5kIG9mIHRoZSByZWN0IGNvbnNpZGVyaW5nIHRoZSBjdXJyZW50IGRpcmVjdGlvbmFsaXR5LiAqL1xuICBwcml2YXRlIF9nZXRTdGFydEVuZChyZWN0OiBDbGllbnRSZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNEaXJlY3Rpb24gPT09ICdydGwnID8gcmVjdC5yaWdodCA6IHJlY3QubGVmdDtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZm9ybSBmaWVsZCBpcyBhdHRhY2hlZCB0byB0aGUgRE9NLiAqL1xuICBwcml2YXRlIF9pc0F0dGFjaGVkVG9ET00oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoZWxlbWVudC5nZXRSb290Tm9kZSkge1xuICAgICAgY29uc3Qgcm9vdE5vZGUgPSBlbGVtZW50LmdldFJvb3ROb2RlKCk7XG4gICAgICAvLyBJZiB0aGUgZWxlbWVudCBpcyBpbnNpZGUgdGhlIERPTSB0aGUgcm9vdCBub2RlIHdpbGwgYmUgZWl0aGVyIHRoZSBkb2N1bWVudFxuICAgICAgLy8gb3IgdGhlIGNsb3Nlc3Qgc2hhZG93IHJvb3QsIG90aGVyd2lzZSBpdCdsbCBiZSB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICByZXR1cm4gcm9vdE5vZGUgJiYgcm9vdE5vZGUgIT09IGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gT3RoZXJ3aXNlIGZhbGwgYmFjayB0byBjaGVja2luZyBpZiBpdCdzIGluIHRoZSBkb2N1bWVudC4gVGhpcyBkb2Vzbid0IGFjY291bnQgZm9yXG4gICAgLy8gc2hhZG93IERPTSwgaG93ZXZlciBicm93c2VyIHRoYXQgc3VwcG9ydCBzaGFkb3cgRE9NIHNob3VsZCBzdXBwb3J0IGBnZXRSb290Tm9kZWAgYXMgd2VsbC5cbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IS5jb250YWlucyhlbGVtZW50KTtcbiAgfVxufVxuIl19