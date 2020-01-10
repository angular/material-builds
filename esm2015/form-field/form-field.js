/**
 * @fileoverview added by tsickle
 * Generated from: src/material/form-field/form-field.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
/** @type {?} */
let nextUniqueId = 0;
/** @type {?} */
const floatingLabelScale = 0.75;
/** @type {?} */
const outlineGapPadding = 5;
/**
 * Boilerplate for applying mixins to MatFormField.
 * \@docs-private
 */
class MatFormFieldBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatFormFieldBase.prototype._elementRef;
}
/**
 * Base class to which we're applying the form field mixins.
 * \@docs-private
 * @type {?}
 */
const _MatFormFieldMixinBase = mixinColor(MatFormFieldBase, 'primary');
/**
 * Represents the default options for the form field that can be configured
 * using the `MAT_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 * @record
 */
export function MatFormFieldDefaultOptions() { }
if (false) {
    /** @type {?|undefined} */
    MatFormFieldDefaultOptions.prototype.appearance;
    /** @type {?|undefined} */
    MatFormFieldDefaultOptions.prototype.hideRequiredMarker;
    /**
     * Whether the label for form-fields should by default float `always`,
     * `never`, or `auto` (only when necessary).
     * @type {?|undefined}
     */
    MatFormFieldDefaultOptions.prototype.floatLabel;
}
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 * @type {?}
 */
export const MAT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken('MAT_FORM_FIELD_DEFAULT_OPTIONS');
/**
 * Container for form controls that applies Material Design styling and behavior.
 */
export class MatFormField extends _MatFormFieldMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?} _changeDetectorRef
     * @param {?} labelOptions
     * @param {?} _dir
     * @param {?} _defaults
     * @param {?} _platform
     * @param {?} _ngZone
     * @param {?} _animationMode
     */
    constructor(_elementRef, _changeDetectorRef, labelOptions, _dir, _defaults, _platform, _ngZone, _animationMode) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._defaults = _defaults;
        this._platform = _platform;
        this._ngZone = _ngZone;
        /**
         * Whether the outline gap needs to be calculated
         * immediately on the next change detection run.
         */
        this._outlineGapCalculationNeededImmediately = false;
        /**
         * Whether the outline gap needs to be calculated next time the zone has stabilized.
         */
        this._outlineGapCalculationNeededOnStable = false;
        this._destroyed = new Subject();
        /**
         * Override for the logic that disables the label animation in certain cases.
         */
        this._showAlwaysAnimate = false;
        /**
         * State of the mat-hint and mat-error animations.
         */
        this._subscriptAnimationState = '';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = `mat-hint-${nextUniqueId++}`;
        // Unique id for the internal form field label.
        this._labelId = `mat-form-field-label-${nextUniqueId++}`;
        this._labelOptions = labelOptions ? labelOptions : {};
        this.floatLabel = this._getDefaultFloatLabelState();
        this._animationsEnabled = _animationMode !== 'NoopAnimations';
        // Set the default through here so we invoke the setter on the first run.
        this.appearance = (_defaults && _defaults.appearance) ? _defaults.appearance : 'legacy';
        this._hideRequiredMarker = (_defaults && _defaults.hideRequiredMarker != null) ?
            _defaults.hideRequiredMarker : false;
    }
    /**
     * The form-field appearance style.
     * @return {?}
     */
    get appearance() { return this._appearance; }
    /**
     * @param {?} value
     * @return {?}
     */
    set appearance(value) {
        /** @type {?} */
        const oldValue = this._appearance;
        this._appearance = value || (this._defaults && this._defaults.appearance) || 'legacy';
        if (this._appearance === 'outline' && oldValue !== value) {
            this._outlineGapCalculationNeededOnStable = true;
        }
    }
    /**
     * Whether the required marker should be hidden.
     * @return {?}
     */
    get hideRequiredMarker() { return this._hideRequiredMarker; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideRequiredMarker(value) {
        this._hideRequiredMarker = coerceBooleanProperty(value);
    }
    /**
     * Whether the floating label should always float or not.
     * @return {?}
     */
    get _shouldAlwaysFloat() {
        return this.floatLabel === 'always' && !this._showAlwaysAnimate;
    }
    /**
     * Whether the label can float or not.
     * @return {?}
     */
    get _canLabelFloat() { return this.floatLabel !== 'never'; }
    /**
     * Text for the form field hint.
     * @return {?}
     */
    get hintLabel() { return this._hintLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set hintLabel(value) {
        this._hintLabel = value;
        this._processHints();
    }
    /**
     * Whether the label should always float, never float or float as the user types.
     *
     * Note: only the legacy appearance supports the `never` option. `never` was originally added as a
     * way to make the floating label emulate the behavior of a standard input placeholder. However
     * the form field now supports both floating labels and placeholders. Therefore in the non-legacy
     * appearances the `never` option has been disabled in favor of just using the placeholder.
     * @return {?}
     */
    get floatLabel() {
        return this.appearance !== 'legacy' && this._floatLabel === 'never' ? 'auto' : this._floatLabel;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set floatLabel(value) {
        if (value !== this._floatLabel) {
            this._floatLabel = value || this._getDefaultFloatLabelState();
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * @return {?}
     */
    get _control() {
        // TODO(crisbeto): we need this hacky workaround in order to support both Ivy
        // and ViewEngine. We should clean this up once Ivy is the default renderer.
        return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set _control(value) {
        this._explicitFormFieldControl = value;
    }
    /**
     * @return {?}
     */
    get _labelChild() {
        return this._labelChildNonStatic || this._labelChildStatic;
    }
    /**
     * Gets an ElementRef for the element that a overlay attached to the form-field should be
     * positioned relative to.
     * @return {?}
     */
    getConnectedOverlayOrigin() {
        return this._connectionContainerRef || this._elementRef;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._validateControlChild();
        /** @type {?} */
        const control = this._control;
        if (control.controlType) {
            this._elementRef.nativeElement.classList.add(`mat-form-field-type-${control.controlType}`);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        control.stateChanges.pipe(startWith((/** @type {?} */ (null)))).subscribe((/**
         * @return {?}
         */
        () => {
            this._validatePlaceholders();
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        }));
        // Run change detection if the value changes.
        if (control.ngControl && control.ngControl.valueChanges) {
            control.ngControl.valueChanges
                .pipe(takeUntil(this._destroyed))
                .subscribe((/**
             * @return {?}
             */
            () => this._changeDetectorRef.markForCheck()));
        }
        // Note that we have to run outside of the `NgZone` explicitly,
        // in order to avoid throwing users into an infinite loop
        // if `zone-patch-rxjs` is included.
        this._ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this._ngZone.onStable.asObservable().pipe(takeUntil(this._destroyed)).subscribe((/**
             * @return {?}
             */
            () => {
                if (this._outlineGapCalculationNeededOnStable) {
                    this.updateOutlineGap();
                }
            }));
        }));
        // Run change detection and update the outline if the suffix or prefix changes.
        merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe((/**
         * @return {?}
         */
        () => {
            this._outlineGapCalculationNeededOnStable = true;
            this._changeDetectorRef.markForCheck();
        }));
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(startWith(null)).subscribe((/**
         * @return {?}
         */
        () => {
            this._processHints();
            this._changeDetectorRef.markForCheck();
        }));
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(startWith(null)).subscribe((/**
         * @return {?}
         */
        () => {
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        }));
        if (this._dir) {
            this._dir.change.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @return {?}
             */
            () => {
                if (typeof requestAnimationFrame === 'function') {
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        requestAnimationFrame((/**
                         * @return {?}
                         */
                        () => this.updateOutlineGap()));
                    }));
                }
                else {
                    this.updateOutlineGap();
                }
            }));
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        this._validateControlChild();
        if (this._outlineGapCalculationNeededImmediately) {
            this.updateOutlineGap();
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    /**
     * Determines whether a class from the NgControl should be forwarded to the host element.
     * @param {?} prop
     * @return {?}
     */
    _shouldForward(prop) {
        /** @type {?} */
        const ngControl = this._control ? this._control.ngControl : null;
        return ngControl && ngControl[prop];
    }
    /**
     * @return {?}
     */
    _hasPlaceholder() {
        return !!(this._control && this._control.placeholder || this._placeholderChild);
    }
    /**
     * @return {?}
     */
    _hasLabel() {
        return !!this._labelChild;
    }
    /**
     * @return {?}
     */
    _shouldLabelFloat() {
        return this._canLabelFloat && (this._control.shouldLabelFloat || this._shouldAlwaysFloat);
    }
    /**
     * @return {?}
     */
    _hideControlPlaceholder() {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this.appearance === 'legacy' && !this._hasLabel() ||
            this._hasLabel() && !this._shouldLabelFloat();
    }
    /**
     * @return {?}
     */
    _hasFloatingLabel() {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this._hasLabel() || this.appearance === 'legacy' && this._hasPlaceholder();
    }
    /**
     * Determines whether to display hints or errors.
     * @return {?}
     */
    _getDisplayedMessages() {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    }
    /**
     * Animates the placeholder up and locks it in position.
     * @return {?}
     */
    _animateAndLockLabel() {
        if (this._hasFloatingLabel() && this._canLabelFloat) {
            // If animations are disabled, we shouldn't go in here,
            // because the `transitionend` will never fire.
            if (this._animationsEnabled) {
                this._showAlwaysAnimate = true;
                fromEvent(this._label.nativeElement, 'transitionend').pipe(take(1)).subscribe((/**
                 * @return {?}
                 */
                () => {
                    this._showAlwaysAnimate = false;
                }));
            }
            this.floatLabel = 'always';
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     * @private
     * @return {?}
     */
    _validatePlaceholders() {
        if (this._control.placeholder && this._placeholderChild) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    }
    /**
     * Does any extra processing that is required when handling the hints.
     * @private
     * @return {?}
     */
    _processHints() {
        this._validateHints();
        this._syncDescribedByIds();
    }
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     * @private
     * @return {?}
     */
    _validateHints() {
        if (this._hintChildren) {
            /** @type {?} */
            let startHint;
            /** @type {?} */
            let endHint;
            this._hintChildren.forEach((/**
             * @param {?} hint
             * @return {?}
             */
            (hint) => {
                if (hint.align === 'start') {
                    if (startHint || this.hintLabel) {
                        throw getMatFormFieldDuplicatedHintError('start');
                    }
                    startHint = hint;
                }
                else if (hint.align === 'end') {
                    if (endHint) {
                        throw getMatFormFieldDuplicatedHintError('end');
                    }
                    endHint = hint;
                }
            }));
        }
    }
    /**
     * Gets the default float label state.
     * @private
     * @return {?}
     */
    _getDefaultFloatLabelState() {
        return (this._defaults && this._defaults.floatLabel) || this._labelOptions.float || 'auto';
    }
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     * @private
     * @return {?}
     */
    _syncDescribedByIds() {
        if (this._control) {
            /** @type {?} */
            let ids = [];
            if (this._getDisplayedMessages() === 'hint') {
                /** @type {?} */
                const startHint = this._hintChildren ?
                    this._hintChildren.find((/**
                     * @param {?} hint
                     * @return {?}
                     */
                    hint => hint.align === 'start')) : null;
                /** @type {?} */
                const endHint = this._hintChildren ?
                    this._hintChildren.find((/**
                     * @param {?} hint
                     * @return {?}
                     */
                    hint => hint.align === 'end')) : null;
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
                ids = this._errorChildren.map((/**
                 * @param {?} error
                 * @return {?}
                 */
                error => error.id));
            }
            this._control.setDescribedByIds(ids);
        }
    }
    /**
     * Throws an error if the form field's control is missing.
     * @protected
     * @return {?}
     */
    _validateControlChild() {
        if (!this._control) {
            throw getMatFormFieldMissingControlError();
        }
    }
    /**
     * Updates the width and position of the gap in the outline. Only relevant for the outline
     * appearance.
     * @return {?}
     */
    updateOutlineGap() {
        /** @type {?} */
        const labelEl = this._label ? this._label.nativeElement : null;
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
        /** @type {?} */
        let startWidth = 0;
        /** @type {?} */
        let gapWidth = 0;
        /** @type {?} */
        const container = this._connectionContainerRef.nativeElement;
        /** @type {?} */
        const startEls = container.querySelectorAll('.mat-form-field-outline-start');
        /** @type {?} */
        const gapEls = container.querySelectorAll('.mat-form-field-outline-gap');
        if (this._label && this._label.nativeElement.children.length) {
            /** @type {?} */
            const containerRect = container.getBoundingClientRect();
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
            /** @type {?} */
            const containerStart = this._getStartEnd(containerRect);
            /** @type {?} */
            const labelStart = this._getStartEnd(labelEl.children[0].getBoundingClientRect());
            /** @type {?} */
            let labelWidth = 0;
            for (const child of labelEl.children) {
                labelWidth += child.offsetWidth;
            }
            startWidth = labelStart - containerStart - outlineGapPadding;
            gapWidth = labelWidth > 0 ? labelWidth * floatingLabelScale + outlineGapPadding * 2 : 0;
        }
        for (let i = 0; i < startEls.length; i++) {
            startEls[i].style.width = `${startWidth}px`;
        }
        for (let i = 0; i < gapEls.length; i++) {
            gapEls[i].style.width = `${gapWidth}px`;
        }
        this._outlineGapCalculationNeededOnStable =
            this._outlineGapCalculationNeededImmediately = false;
    }
    /**
     * Gets the start end of the rect considering the current directionality.
     * @private
     * @param {?} rect
     * @return {?}
     */
    _getStartEnd(rect) {
        return (this._dir && this._dir.value === 'rtl') ? rect.right : rect.left;
    }
    /**
     * Checks whether the form field is attached to the DOM.
     * @private
     * @return {?}
     */
    _isAttachedToDOM() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        if (element.getRootNode) {
            /** @type {?} */
            const rootNode = element.getRootNode();
            // If the element is inside the DOM the root node will be either the document
            // or the closest shadow root, otherwise it'll be the element itself.
            return rootNode && rootNode !== element;
        }
        // Otherwise fall back to checking if it's in the document. This doesn't account for
        // shadow DOM, however browser that support shadow DOM should support `getRootNode` as well.
        return (/** @type {?} */ (document.documentElement)).contains(element);
    }
}
MatFormField.decorators = [
    { type: Component, args: [{
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
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scaleY(1.0001)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:scaleX(1);transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}.mat-focused .cdk-high-contrast-active select.mat-input-element::-ms-value{color:inherit}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:2px}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n"]
            }] }
];
/** @nocollapse */
MatFormField.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_LABEL_GLOBAL_OPTIONS,] }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] },
    { type: Platform },
    { type: NgZone },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatFormField.propDecorators = {
    appearance: [{ type: Input }],
    hideRequiredMarker: [{ type: Input }],
    hintLabel: [{ type: Input }],
    floatLabel: [{ type: Input }],
    underlineRef: [{ type: ViewChild, args: ['underline',] }],
    _connectionContainerRef: [{ type: ViewChild, args: ['connectionContainer', { static: true },] }],
    _inputContainerRef: [{ type: ViewChild, args: ['inputContainer',] }],
    _label: [{ type: ViewChild, args: ['label',] }],
    _controlNonStatic: [{ type: ContentChild, args: [MatFormFieldControl,] }],
    _controlStatic: [{ type: ContentChild, args: [MatFormFieldControl, { static: true },] }],
    _labelChildNonStatic: [{ type: ContentChild, args: [MatLabel,] }],
    _labelChildStatic: [{ type: ContentChild, args: [MatLabel, { static: true },] }],
    _placeholderChild: [{ type: ContentChild, args: [MatPlaceholder,] }],
    _errorChildren: [{ type: ContentChildren, args: [MatError, { descendants: true },] }],
    _hintChildren: [{ type: ContentChildren, args: [MatHint, { descendants: true },] }],
    _prefixChildren: [{ type: ContentChildren, args: [MatPrefix, { descendants: true },] }],
    _suffixChildren: [{ type: ContentChildren, args: [MatSuffix, { descendants: true },] }]
};
if (false) {
    /** @type {?} */
    MatFormField.ngAcceptInputType_hideRequiredMarker;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._labelOptions;
    /**
     * Whether the outline gap needs to be calculated
     * immediately on the next change detection run.
     * @type {?}
     * @private
     */
    MatFormField.prototype._outlineGapCalculationNeededImmediately;
    /**
     * Whether the outline gap needs to be calculated next time the zone has stabilized.
     * @type {?}
     * @private
     */
    MatFormField.prototype._outlineGapCalculationNeededOnStable;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._destroyed;
    /** @type {?} */
    MatFormField.prototype._appearance;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._hideRequiredMarker;
    /**
     * Override for the logic that disables the label animation in certain cases.
     * @type {?}
     * @private
     */
    MatFormField.prototype._showAlwaysAnimate;
    /**
     * State of the mat-hint and mat-error animations.
     * @type {?}
     */
    MatFormField.prototype._subscriptAnimationState;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._hintLabel;
    /** @type {?} */
    MatFormField.prototype._hintLabelId;
    /** @type {?} */
    MatFormField.prototype._labelId;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._floatLabel;
    /**
     * Whether the Angular animations are enabled.
     * @type {?}
     */
    MatFormField.prototype._animationsEnabled;
    /**
     * @deprecated
     * \@breaking-change 8.0.0
     * @type {?}
     */
    MatFormField.prototype.underlineRef;
    /** @type {?} */
    MatFormField.prototype._connectionContainerRef;
    /** @type {?} */
    MatFormField.prototype._inputContainerRef;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._label;
    /** @type {?} */
    MatFormField.prototype._controlNonStatic;
    /** @type {?} */
    MatFormField.prototype._controlStatic;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._explicitFormFieldControl;
    /** @type {?} */
    MatFormField.prototype._labelChildNonStatic;
    /** @type {?} */
    MatFormField.prototype._labelChildStatic;
    /** @type {?} */
    MatFormField.prototype._placeholderChild;
    /** @type {?} */
    MatFormField.prototype._errorChildren;
    /** @type {?} */
    MatFormField.prototype._hintChildren;
    /** @type {?} */
    MatFormField.prototype._prefixChildren;
    /** @type {?} */
    MatFormField.prototype._suffixChildren;
    /** @type {?} */
    MatFormField.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._defaults;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._platform;
    /**
     * @type {?}
     * @private
     */
    MatFormField.prototype._ngZone;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCx3QkFBd0IsRUFDeEIsVUFBVSxHQUNYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxrQ0FBa0MsRUFDbEMsdUNBQXVDLEdBQ3hDLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUUvQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7SUFHdkUsWUFBWSxHQUFHLENBQUM7O01BQ2Qsa0JBQWtCLEdBQUcsSUFBSTs7TUFDekIsaUJBQWlCLEdBQUcsQ0FBQzs7Ozs7QUFPM0IsTUFBTSxnQkFBZ0I7Ozs7SUFDcEIsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBSSxDQUFDO0NBQ2hEOzs7SUFEYSx1Q0FBOEI7Ozs7Ozs7TUFPdEMsc0JBQXNCLEdBQ3hCLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUM7Ozs7OztBQWlCM0MsZ0RBUUM7OztJQVBDLGdEQUFvQzs7SUFDcEMsd0RBQTZCOzs7Ozs7SUFLN0IsZ0RBQTRCOzs7Ozs7O0FBTzlCLE1BQU0sT0FBTyw4QkFBOEIsR0FDdkMsSUFBSSxjQUFjLENBQTZCLGdDQUFnQyxDQUFDOzs7O0FBa0RwRixNQUFNLE9BQU8sWUFBYSxTQUFRLHNCQUFzQjs7Ozs7Ozs7Ozs7SUEySHRELFlBQ1csV0FBdUIsRUFBVSxrQkFBcUMsRUFDL0IsWUFBMEIsRUFDcEQsSUFBb0IsRUFDb0IsU0FDOUIsRUFBVSxTQUFtQixFQUFVLE9BQWUsRUFDekMsY0FBc0I7UUFDbkUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBTlYsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBRXpELFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ29CLGNBQVMsR0FBVCxTQUFTLENBQ3ZDO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7Ozs7O1FBeEhoRiw0Q0FBdUMsR0FBRyxLQUFLLENBQUM7Ozs7UUFHaEQseUNBQW9DLEdBQUcsS0FBSyxDQUFDO1FBRTdDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDOzs7O1FBeUJqQyx1QkFBa0IsR0FBRyxLQUFLLENBQUM7Ozs7UUFXbkMsNkJBQXdCLEdBQVcsRUFBRSxDQUFDO1FBUzlCLGVBQVUsR0FBRyxFQUFFLENBQUM7O1FBR3hCLGlCQUFZLEdBQVcsWUFBWSxZQUFZLEVBQUUsRUFBRSxDQUFDOztRQUdwRCxhQUFRLEdBQUcsd0JBQXdCLFlBQVksRUFBRSxFQUFFLENBQUM7UUFvRWxELElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ3BELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLEtBQUssZ0JBQWdCLENBQUM7UUFFOUQseUVBQXlFO1FBQ3pFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDeEYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzNDLENBQUM7Ozs7O0lBNUhELElBQ0ksVUFBVSxLQUE2QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7OztJQUNyRSxJQUFJLFVBQVUsQ0FBQyxLQUE2Qjs7Y0FDcEMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXO1FBRWpDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQztRQUV0RixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDeEQsSUFBSSxDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQztTQUNsRDtJQUNILENBQUM7Ozs7O0lBSUQsSUFDSSxrQkFBa0IsS0FBYyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3RFLElBQUksa0JBQWtCLENBQUMsS0FBYztRQUNuQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7Ozs7SUFPRCxJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2xFLENBQUM7Ozs7O0lBR0QsSUFBSSxjQUFjLEtBQWMsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7Ozs7O0lBTXJFLElBQ0ksU0FBUyxLQUFhLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ25ELElBQUksU0FBUyxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Ozs7Ozs7Ozs7SUFpQkQsSUFDSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ2xHLENBQUM7Ozs7O0lBQ0QsSUFBSSxVQUFVLENBQUMsS0FBcUI7UUFDbEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUM5RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDeEM7SUFDSCxDQUFDOzs7O0lBa0JELElBQUksUUFBUTtRQUNWLDZFQUE2RTtRQUM3RSw0RUFBNEU7UUFDNUUsT0FBTyxJQUFJLENBQUMseUJBQXlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDekYsQ0FBQzs7Ozs7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQzs7OztJQUtELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUM3RCxDQUFDOzs7Ozs7SUErQkQseUJBQXlCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUQsQ0FBQzs7OztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzs7Y0FFdkIsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRO1FBRTdCLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUF1QixPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUM1RjtRQUVELHdGQUF3RjtRQUN4RixPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQUEsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztRQUFDLEdBQUcsRUFBRTtZQUN6RCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQyxFQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWTtpQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2hDLFNBQVM7OztZQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsRUFBQyxDQUFDO1NBQzVEO1FBRUQsK0RBQStEO1FBQy9ELHlEQUF5RDtRQUN6RCxvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUI7OztRQUFDLEdBQUcsRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztZQUFDLEdBQUcsRUFBRTtnQkFDbkYsSUFBSSxJQUFJLENBQUMsb0NBQW9DLEVBQUU7b0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN6QjtZQUNILENBQUMsRUFBQyxDQUFDO1FBQ0wsQ0FBQyxFQUFDLENBQUM7UUFFSCwrRUFBK0U7UUFDL0UsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQy9FLElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUM7WUFDakQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUMsRUFBQyxDQUFDO1FBRUgsZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTOzs7UUFBQyxHQUFHLEVBQUU7WUFDOUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLEVBQUMsQ0FBQztRQUVILGtFQUFrRTtRQUNsRSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFFO1lBQy9ELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLEVBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUzs7O1lBQUMsR0FBRyxFQUFFO2dCQUMvRCxJQUFJLE9BQU8scUJBQXFCLEtBQUssVUFBVSxFQUFFO29CQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQjs7O29CQUFDLEdBQUcsRUFBRTt3QkFDbEMscUJBQXFCOzs7d0JBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUMsQ0FBQztvQkFDdkQsQ0FBQyxFQUFDLENBQUM7aUJBQ0o7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7aUJBQ3pCO1lBQ0gsQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Ozs7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsdUNBQXVDLEVBQUU7WUFDaEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDOzs7O0lBRUQsZUFBZTtRQUNiLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsd0JBQXdCLEdBQUcsT0FBTyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMxQyxDQUFDOzs7O0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs7Ozs7SUFHRCxjQUFjLENBQUMsSUFBcUI7O2NBQzVCLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSTtRQUNoRSxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQzs7OztJQUVELGVBQWU7UUFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEYsQ0FBQzs7OztJQUVELFNBQVM7UUFDUCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzVGLENBQUM7Ozs7SUFFRCx1QkFBdUI7UUFDckIsd0ZBQXdGO1FBQ3hGLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3BELElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BELENBQUM7Ozs7SUFFRCxpQkFBaUI7UUFDZix3RkFBd0Y7UUFDeEYsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7Ozs7O0lBR0QscUJBQXFCO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbkQsQ0FBQzs7Ozs7SUFHRCxvQkFBb0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ25ELHVEQUF1RDtZQUN2RCwrQ0FBK0M7WUFDL0MsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7Z0JBRS9CLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUzs7O2dCQUFDLEdBQUcsRUFBRTtvQkFDakYsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztnQkFDbEMsQ0FBQyxFQUFDLENBQUM7YUFDSjtZQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7Ozs7Ozs7SUFNTyxxQkFBcUI7UUFDM0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDdkQsTUFBTSx1Q0FBdUMsRUFBRSxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQzs7Ozs7O0lBR08sYUFBYTtRQUNuQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7OztJQU1PLGNBQWM7UUFDcEIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFOztnQkFDbEIsU0FBa0I7O2dCQUNsQixPQUFnQjtZQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU87Ozs7WUFBQyxDQUFDLElBQWEsRUFBRSxFQUFFO2dCQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxFQUFFO29CQUMxQixJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUMvQixNQUFNLGtDQUFrQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUNuRDtvQkFDRCxTQUFTLEdBQUcsSUFBSSxDQUFDO2lCQUNsQjtxQkFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO29CQUMvQixJQUFJLE9BQU8sRUFBRTt3QkFDWCxNQUFNLGtDQUFrQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNqRDtvQkFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNoQjtZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDOzs7Ozs7SUFHTywwQkFBMEI7UUFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDN0YsQ0FBQzs7Ozs7OztJQU1PLG1CQUFtQjtRQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7O2dCQUNiLEdBQUcsR0FBYSxFQUFFO1lBRXRCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLEtBQUssTUFBTSxFQUFFOztzQkFDckMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJOzs7O29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTs7c0JBQzVELE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSTs7OztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBRWhFLElBQUksU0FBUyxFQUFFO29CQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUN4QjtxQkFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUM3QjtnQkFFRCxJQUFJLE9BQU8sRUFBRTtvQkFDWCxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDdEI7YUFDRjtpQkFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQzlCLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUc7Ozs7Z0JBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLENBQUM7YUFDbEQ7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQzs7Ozs7O0lBR1MscUJBQXFCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sa0NBQWtDLEVBQUUsQ0FBQztTQUM1QztJQUNILENBQUM7Ozs7OztJQU1ELGdCQUFnQjs7Y0FDUixPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFFOUQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTTtZQUNyRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDL0IsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQzdCLHVEQUF1RDtZQUN2RCxPQUFPO1NBQ1I7UUFDRCx1RkFBdUY7UUFDdkYsOENBQThDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsdUNBQXVDLEdBQUcsSUFBSSxDQUFDO1lBQ3BELE9BQU87U0FDUjs7WUFFRyxVQUFVLEdBQUcsQ0FBQzs7WUFDZCxRQUFRLEdBQUcsQ0FBQzs7Y0FFVixTQUFTLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWE7O2NBQ3RELFFBQVEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsK0JBQStCLENBQUM7O2NBQ3RFLE1BQU0sR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsNkJBQTZCLENBQUM7UUFFeEUsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7O2tCQUN0RCxhQUFhLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixFQUFFO1lBRXZELDZFQUE2RTtZQUM3RSxnRkFBZ0Y7WUFDaEYsZ0ZBQWdGO1lBQ2hGLDZFQUE2RTtZQUM3RSxtRUFBbUU7WUFDbkUscUZBQXFGO1lBQ3JGLElBQUksYUFBYSxDQUFDLEtBQUssS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUM7Z0JBQ2pELElBQUksQ0FBQyx1Q0FBdUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3JELE9BQU87YUFDUjs7a0JBRUssY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDOztrQkFDakQsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDOztnQkFDN0UsVUFBVSxHQUFHLENBQUM7WUFFbEIsS0FBSyxNQUFNLEtBQUssSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxVQUFVLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUNqQztZQUNELFVBQVUsR0FBRyxVQUFVLEdBQUcsY0FBYyxHQUFHLGlCQUFpQixDQUFDO1lBQzdELFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLEdBQUcsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekY7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUsSUFBSSxDQUFDO1NBQzdDO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxRQUFRLElBQUksQ0FBQztTQUN6QztRQUVELElBQUksQ0FBQyxvQ0FBb0M7WUFDckMsSUFBSSxDQUFDLHVDQUF1QyxHQUFHLEtBQUssQ0FBQztJQUMzRCxDQUFDOzs7Ozs7O0lBR08sWUFBWSxDQUFDLElBQWdCO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNFLENBQUM7Ozs7OztJQUdPLGdCQUFnQjs7Y0FDaEIsT0FBTyxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWE7UUFFM0QsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFOztrQkFDakIsUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdEMsNkVBQTZFO1lBQzdFLHFFQUFxRTtZQUNyRSxPQUFPLFFBQVEsSUFBSSxRQUFRLEtBQUssT0FBTyxDQUFDO1NBQ3pDO1FBRUQsb0ZBQW9GO1FBQ3BGLDRGQUE0RjtRQUM1RixPQUFPLG1CQUFBLFFBQVEsQ0FBQyxlQUFlLEVBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsQ0FBQzs7O1lBcmZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsY0FBYztnQkFDeEIsaTZIQUE4QjtnQkFZOUIsVUFBVSxFQUFFLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3ZELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsZ0JBQWdCO29CQUN6Qiw0Q0FBNEMsRUFBRSwwQkFBMEI7b0JBQ3hFLHdDQUF3QyxFQUFFLHNCQUFzQjtvQkFDaEUsMkNBQTJDLEVBQUUseUJBQXlCO29CQUN0RSwwQ0FBMEMsRUFBRSx3QkFBd0I7b0JBQ3BFLGdDQUFnQyxFQUFFLHFCQUFxQjtvQkFDdkQsa0NBQWtDLEVBQUUsZ0JBQWdCO29CQUNwRCxxQ0FBcUMsRUFBRSxxQkFBcUI7b0JBQzVELGtDQUFrQyxFQUFFLHFCQUFxQjtvQkFDekQseUNBQXlDLEVBQUUsMkJBQTJCO29CQUN0RSxpQ0FBaUMsRUFBRSxtQkFBbUI7b0JBQ3RELG1DQUFtQyxFQUFFLHFCQUFxQjtvQkFDMUQscUJBQXFCLEVBQUUsa0JBQWtCO29CQUN6QyxvQkFBb0IsRUFBRSxtQkFBbUI7b0JBQ3pDLGtCQUFrQixFQUFFLGlCQUFpQjtvQkFDckMsc0JBQXNCLEVBQUUsNkJBQTZCO29CQUNyRCxvQkFBb0IsRUFBRSwyQkFBMkI7b0JBQ2pELHFCQUFxQixFQUFFLDRCQUE0QjtvQkFDbkQsa0JBQWtCLEVBQUUseUJBQXlCO29CQUM3QyxrQkFBa0IsRUFBRSx5QkFBeUI7b0JBQzdDLG9CQUFvQixFQUFFLDJCQUEyQjtvQkFDakQsb0JBQW9CLEVBQUUsMkJBQTJCO29CQUNqRCxpQ0FBaUMsRUFBRSxxQkFBcUI7aUJBQ3pEO2dCQUNELE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDakIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7OztZQXZJQyxVQUFVO1lBSlYsaUJBQWlCOzRDQTBRWixRQUFRLFlBQUksTUFBTSxTQUFDLHdCQUF3QjtZQWpSMUMsY0FBYyx1QkFrUmYsUUFBUTs0Q0FDUixRQUFRLFlBQUksTUFBTSxTQUFDLDhCQUE4QjtZQXhPaEQsUUFBUTtZQTVCZCxNQUFNO3lDQXNRRCxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3lCQWpINUMsS0FBSztpQ0FjTCxLQUFLO3dCQXNCTCxLQUFLO3lCQXNCTCxLQUFLOzJCQW1CTCxTQUFTLFNBQUMsV0FBVztzQ0FFckIsU0FBUyxTQUFDLHFCQUFxQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztpQ0FDL0MsU0FBUyxTQUFDLGdCQUFnQjtxQkFDMUIsU0FBUyxTQUFDLE9BQU87Z0NBRWpCLFlBQVksU0FBQyxtQkFBbUI7NkJBQ2hDLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7bUNBV2hELFlBQVksU0FBQyxRQUFRO2dDQUNyQixZQUFZLFNBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQ0FLckMsWUFBWSxTQUFDLGNBQWM7NkJBQzNCLGVBQWUsU0FBQyxRQUFRLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQUM3QyxlQUFlLFNBQUMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs4QkFDNUMsZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBQzlDLGVBQWUsU0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzs7O0lBZ1YvQyxrREFBMEQ7Ozs7O0lBdmMxRCxxQ0FBb0M7Ozs7Ozs7SUFNcEMsK0RBQXdEOzs7Ozs7SUFHeEQsNERBQXFEOzs7OztJQUVyRCxrQ0FBeUM7O0lBY3pDLG1DQUFvQzs7Ozs7SUFRcEMsMkNBQXFDOzs7Ozs7SUFHckMsMENBQW1DOzs7OztJQVduQyxnREFBc0M7Ozs7O0lBU3RDLGtDQUF3Qjs7SUFHeEIsb0NBQW9EOztJQUdwRCxnQ0FBb0Q7Ozs7O0lBb0JwRCxtQ0FBb0M7Ozs7O0lBR3BDLDBDQUE0Qjs7Ozs7O0lBTTVCLG9DQUFpRDs7SUFFakQsK0NBQXNGOztJQUN0RiwwQ0FBNEQ7Ozs7O0lBQzVELDhCQUErQzs7SUFFL0MseUNBQStFOztJQUMvRSxzQ0FBNEY7Ozs7O0lBUzVGLGlEQUE0RDs7SUFFNUQsNENBQXVEOztJQUN2RCx5Q0FBb0U7O0lBS3BFLHlDQUFnRTs7SUFDaEUsc0NBQW9GOztJQUNwRixxQ0FBaUY7O0lBQ2pGLHVDQUF1Rjs7SUFDdkYsdUNBQXVGOztJQUduRixtQ0FBOEI7Ozs7O0lBQUUsMENBQTZDOzs7OztJQUU3RSw0QkFBd0M7Ozs7O0lBQ3hDLGlDQUM4Qjs7Ozs7SUFBRSxpQ0FBMkI7Ozs7O0lBQUUsK0JBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLFxuICBMYWJlbE9wdGlvbnMsXG4gIE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgbWVyZ2UsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge21hdEZvcm1GaWVsZEFuaW1hdGlvbnN9IGZyb20gJy4vZm9ybS1maWVsZC1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnLi9mb3JtLWZpZWxkLWNvbnRyb2wnO1xuaW1wb3J0IHtcbiAgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yLFxufSBmcm9tICcuL2Zvcm0tZmllbGQtZXJyb3JzJztcbmltcG9ydCB7TWF0SGludH0gZnJvbSAnLi9oaW50JztcbmltcG9ydCB7TWF0TGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtNYXRQbGFjZWhvbGRlcn0gZnJvbSAnLi9wbGFjZWhvbGRlcic7XG5pbXBvcnQge01hdFByZWZpeH0gZnJvbSAnLi9wcmVmaXgnO1xuaW1wb3J0IHtNYXRTdWZmaXh9IGZyb20gJy4vc3VmZml4JztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5jb25zdCBmbG9hdGluZ0xhYmVsU2NhbGUgPSAwLjc1O1xuY29uc3Qgb3V0bGluZUdhcFBhZGRpbmcgPSA1O1xuXG5cbi8qKlxuICogQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRGb3JtRmllbGQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNsYXNzIE1hdEZvcm1GaWVsZEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gd2hpY2ggd2UncmUgYXBwbHlpbmcgdGhlIGZvcm0gZmllbGQgbWl4aW5zLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jb25zdCBfTWF0Rm9ybUZpZWxkTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0Rm9ybUZpZWxkQmFzZSA9XG4gICAgbWl4aW5Db2xvcihNYXRGb3JtRmllbGRCYXNlLCAncHJpbWFyeScpO1xuXG4vKipcbiAqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgZm9ybSBmaWVsZC5cbiAqXG4gKiBOb3RlOiBUaGUgYGxlZ2FjeWAgYW5kIGBzdGFuZGFyZGAgYXBwZWFyYW5jZXMgYXJlIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgYGZpbGxgIG9yIGBvdXRsaW5lYC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBgbGVnYWN5YCBhbmQgYHN0YW5kYXJkYC5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSA9ICdsZWdhY3knIHwgJ3N0YW5kYXJkJyB8ICdmaWxsJyB8ICdvdXRsaW5lJztcblxuLyoqIFBvc3NpYmxlIHZhbHVlcyBmb3IgdGhlIFwiZmxvYXRMYWJlbFwiIGZvcm0tZmllbGQgaW5wdXQuICovXG5leHBvcnQgdHlwZSBGbG9hdExhYmVsVHlwZSA9ICdhbHdheXMnIHwgJ25ldmVyJyB8ICdhdXRvJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBmb3JtIGZpZWxkIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWRcbiAqIHVzaW5nIHRoZSBgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMge1xuICBhcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcbiAgaGlkZVJlcXVpcmVkTWFya2VyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxhYmVsIGZvciBmb3JtLWZpZWxkcyBzaG91bGQgYnkgZGVmYXVsdCBmbG9hdCBgYWx3YXlzYCxcbiAgICogYG5ldmVyYCwgb3IgYGF1dG9gIChvbmx5IHdoZW4gbmVjZXNzYXJ5KS5cbiAgICovXG4gIGZsb2F0TGFiZWw/OiBGbG9hdExhYmVsVHlwZTtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlXG4gKiBkZWZhdWx0IG9wdGlvbnMgZm9yIGFsbCBmb3JtIGZpZWxkIHdpdGhpbiBhbiBhcHAuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucz4oJ01BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUycpO1xuXG5cbi8qKiBDb250YWluZXIgZm9yIGZvcm0gY29udHJvbHMgdGhhdCBhcHBsaWVzIE1hdGVyaWFsIERlc2lnbiBzdHlsaW5nIGFuZCBiZWhhdmlvci4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1mb3JtLWZpZWxkJyxcbiAgZXhwb3J0QXM6ICdtYXRGb3JtRmllbGQnLFxuICB0ZW1wbGF0ZVVybDogJ2Zvcm0tZmllbGQuaHRtbCcsXG4gIC8vIE1hdElucHV0IGlzIGEgZGlyZWN0aXZlIGFuZCBjYW4ndCBoYXZlIHN0eWxlcywgc28gd2UgbmVlZCB0byBpbmNsdWRlIGl0cyBzdHlsZXMgaGVyZVxuICAvLyBpbiBmb3JtLWZpZWxkLWlucHV0LmNzcy4gVGhlIE1hdElucHV0IHN0eWxlcyBhcmUgZmFpcmx5IG1pbmltYWwgc28gaXQgc2hvdWxkbid0IGJlIGFcbiAgLy8gYmlnIGRlYWwgZm9yIHBlb3BsZSB3aG8gYXJlbid0IHVzaW5nIE1hdElucHV0LlxuICBzdHlsZVVybHM6IFtcbiAgICAnZm9ybS1maWVsZC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWZpbGwuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1pbnB1dC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWxlZ2FjeS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLW91dGxpbmUuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1zdGFuZGFyZC5jc3MnLFxuICBdLFxuICBhbmltYXRpb25zOiBbbWF0Rm9ybUZpZWxkQW5pbWF0aW9ucy50cmFuc2l0aW9uTWVzc2FnZXNdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb3JtLWZpZWxkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtZmlsbF0nOiAnYXBwZWFyYW5jZSA9PSBcImZpbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLW91dGxpbmVdJzogJ2FwcGVhcmFuY2UgPT0gXCJvdXRsaW5lXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1sZWdhY3ldJzogJ2FwcGVhcmFuY2UgPT0gXCJsZWdhY3lcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1pbnZhbGlkXSc6ICdfY29udHJvbC5lcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWNhbi1mbG9hdF0nOiAnX2NhbkxhYmVsRmxvYXQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtc2hvdWxkLWZsb2F0XSc6ICdfc2hvdWxkTGFiZWxGbG9hdCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbF0nOiAnX2hhc0Zsb2F0aW5nTGFiZWwoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1oaWRlLXBsYWNlaG9sZGVyXSc6ICdfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWRpc2FibGVkXSc6ICdfY29udHJvbC5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkXSc6ICdfY29udHJvbC5hdXRvZmlsbGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb2N1c2VkXSc6ICdfY29udHJvbC5mb2N1c2VkJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ1bnRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctdG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ0b3VjaGVkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdfc2hvdWxkRm9yd2FyZChcInByaXN0aW5lXCIpJyxcbiAgICAnW2NsYXNzLm5nLWRpcnR5XSc6ICdfc2hvdWxkRm9yd2FyZChcImRpcnR5XCIpJyxcbiAgICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdfc2hvdWxkRm9yd2FyZChcInZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwiaW52YWxpZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICdfc2hvdWxkRm9yd2FyZChcInBlbmRpbmdcIiknLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJyFfYW5pbWF0aW9uc0VuYWJsZWQnLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkIGV4dGVuZHMgX01hdEZvcm1GaWVsZE1peGluQmFzZVxuICAgIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDYW5Db2xvciB7XG4gIHByaXZhdGUgX2xhYmVsT3B0aW9uczogTGFiZWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBvdXRsaW5lIGdhcCBuZWVkcyB0byBiZSBjYWxjdWxhdGVkXG4gICAqIGltbWVkaWF0ZWx5IG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCBuZXh0IHRpbWUgdGhlIHpvbmUgaGFzIHN0YWJpbGl6ZWQuICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGZvcm0tZmllbGQgYXBwZWFyYW5jZSBzdHlsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFwcGVhcmFuY2UoKTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSB7IHJldHVybiB0aGlzLl9hcHBlYXJhbmNlOyB9XG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlKSB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9hcHBlYXJhbmNlO1xuXG4gICAgdGhpcy5fYXBwZWFyYW5jZSA9IHZhbHVlIHx8ICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5hcHBlYXJhbmNlKSB8fCAnbGVnYWN5JztcblxuICAgIGlmICh0aGlzLl9hcHBlYXJhbmNlID09PSAnb3V0bGluZScgJiYgb2xkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgfVxuICB9XG4gIF9hcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByZXF1aXJlZCBtYXJrZXIgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVSZXF1aXJlZE1hcmtlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlcjsgfVxuICBzZXQgaGlkZVJlcXVpcmVkTWFya2VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUmVxdWlyZWRNYXJrZXI6IGJvb2xlYW47XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgbG9naWMgdGhhdCBkaXNhYmxlcyB0aGUgbGFiZWwgYW5pbWF0aW9uIGluIGNlcnRhaW4gY2FzZXMuICovXG4gIHByaXZhdGUgX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZsb2F0aW5nIGxhYmVsIHNob3VsZCBhbHdheXMgZmxvYXQgb3Igbm90LiAqL1xuICBnZXQgX3Nob3VsZEFsd2F5c0Zsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZsb2F0TGFiZWwgPT09ICdhbHdheXMnICYmICF0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBjYW4gZmxvYXQgb3Igbm90LiAqL1xuICBnZXQgX2NhbkxhYmVsRmxvYXQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmZsb2F0TGFiZWwgIT09ICduZXZlcic7IH1cblxuICAvKiogU3RhdGUgb2YgdGhlIG1hdC1oaW50IGFuZCBtYXQtZXJyb3IgYW5pbWF0aW9ucy4gKi9cbiAgX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlOiBzdHJpbmcgPSAnJztcblxuICAvKiogVGV4dCBmb3IgdGhlIGZvcm0gZmllbGQgaGludC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpbnRMYWJlbCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faGludExhYmVsOyB9XG4gIHNldCBoaW50TGFiZWwodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2hpbnRMYWJlbCA9IHZhbHVlO1xuICAgIHRoaXMuX3Byb2Nlc3NIaW50cygpO1xuICB9XG4gIHByaXZhdGUgX2hpbnRMYWJlbCA9ICcnO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGhpbnQgbGFiZWwuXG4gIF9oaW50TGFiZWxJZDogc3RyaW5nID0gYG1hdC1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBpbnRlcm5hbCBmb3JtIGZpZWxkIGxhYmVsLlxuICBfbGFiZWxJZCA9IGBtYXQtZm9ybS1maWVsZC1sYWJlbC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhbHdheXMgZmxvYXQsIG5ldmVyIGZsb2F0IG9yIGZsb2F0IGFzIHRoZSB1c2VyIHR5cGVzLlxuICAgKlxuICAgKiBOb3RlOiBvbmx5IHRoZSBsZWdhY3kgYXBwZWFyYW5jZSBzdXBwb3J0cyB0aGUgYG5ldmVyYCBvcHRpb24uIGBuZXZlcmAgd2FzIG9yaWdpbmFsbHkgYWRkZWQgYXMgYVxuICAgKiB3YXkgdG8gbWFrZSB0aGUgZmxvYXRpbmcgbGFiZWwgZW11bGF0ZSB0aGUgYmVoYXZpb3Igb2YgYSBzdGFuZGFyZCBpbnB1dCBwbGFjZWhvbGRlci4gSG93ZXZlclxuICAgKiB0aGUgZm9ybSBmaWVsZCBub3cgc3VwcG9ydHMgYm90aCBmbG9hdGluZyBsYWJlbHMgYW5kIHBsYWNlaG9sZGVycy4gVGhlcmVmb3JlIGluIHRoZSBub24tbGVnYWN5XG4gICAqIGFwcGVhcmFuY2VzIHRoZSBgbmV2ZXJgIG9wdGlvbiBoYXMgYmVlbiBkaXNhYmxlZCBpbiBmYXZvciBvZiBqdXN0IHVzaW5nIHRoZSBwbGFjZWhvbGRlci5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmbG9hdExhYmVsKCk6IEZsb2F0TGFiZWxUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlYXJhbmNlICE9PSAnbGVnYWN5JyAmJiB0aGlzLl9mbG9hdExhYmVsID09PSAnbmV2ZXInID8gJ2F1dG8nIDogdGhpcy5fZmxvYXRMYWJlbDtcbiAgfVxuICBzZXQgZmxvYXRMYWJlbCh2YWx1ZTogRmxvYXRMYWJlbFR5cGUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2Zsb2F0TGFiZWwpIHtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwgPSB2YWx1ZSB8fCB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZmxvYXRMYWJlbDogRmxvYXRMYWJlbFR5cGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIEFuZ3VsYXIgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNFbmFibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAVmlld0NoaWxkKCd1bmRlcmxpbmUnKSB1bmRlcmxpbmVSZWY6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZCgnY29ubmVjdGlvbkNvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfY29ubmVjdGlvbkNvbnRhaW5lclJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRDb250YWluZXInKSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgcHJpdmF0ZSBfbGFiZWw6IEVsZW1lbnRSZWY7XG5cbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sKSBfY29udHJvbE5vblN0YXRpYzogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wsIHtzdGF0aWM6IHRydWV9KSBfY29udHJvbFN0YXRpYzogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuICBnZXQgX2NvbnRyb2woKSB7XG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG5lZWQgdGhpcyBoYWNreSB3b3JrYXJvdW5kIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnlcbiAgICAvLyBhbmQgVmlld0VuZ2luZS4gV2Ugc2hvdWxkIGNsZWFuIHRoaXMgdXAgb25jZSBJdnkgaXMgdGhlIGRlZmF1bHQgcmVuZGVyZXIuXG4gICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCB8fCB0aGlzLl9jb250cm9sTm9uU3RhdGljIHx8IHRoaXMuX2NvbnRyb2xTdGF0aWM7XG4gIH1cbiAgc2V0IF9jb250cm9sKHZhbHVlKSB7XG4gICAgdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRGb3JtRmllbGRDb250cm9sOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMYWJlbCkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBnZXQgX2xhYmVsQ2hpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYztcbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRFcnJvciwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0SGludCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2hpbnRDaGlsZHJlbjogUXVlcnlMaXN0PE1hdEhpbnQ+O1xuICBAQ29udGVudENoaWxkcmVuKE1hdFByZWZpeCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRTdWZmaXgsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9zdWZmaXhDaGlsZHJlbjogUXVlcnlMaXN0PE1hdFN1ZmZpeD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0xBQkVMX0dMT0JBTF9PUFRJT05TKSBsYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucyxcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdHM6XG4gICAgICAgICAgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMsIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgX2FuaW1hdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMuX2xhYmVsT3B0aW9ucyA9IGxhYmVsT3B0aW9ucyA/IGxhYmVsT3B0aW9ucyA6IHt9O1xuICAgIHRoaXMuZmxvYXRMYWJlbCA9IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IChfZGVmYXVsdHMgJiYgX2RlZmF1bHRzLmFwcGVhcmFuY2UpID8gX2RlZmF1bHRzLmFwcGVhcmFuY2UgOiAnbGVnYWN5JztcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIgIT0gbnVsbCkgP1xuICAgICAgICBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBFbGVtZW50UmVmIGZvciB0aGUgZWxlbWVudCB0aGF0IGEgb3ZlcmxheSBhdHRhY2hlZCB0byB0aGUgZm9ybS1maWVsZCBzaG91bGQgYmVcbiAgICogcG9zaXRpb25lZCByZWxhdGl2ZSB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYgfHwgdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuX2NvbnRyb2w7XG5cbiAgICBpZiAoY29udHJvbC5jb250cm9sVHlwZSkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1mb3JtLWZpZWxkLXR5cGUtJHtjb250cm9sLmNvbnRyb2xUeXBlfWApO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBjaGlsZCBjb250cm9sIHN0YXRlIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgZm9ybSBmaWVsZCBVSS5cbiAgICBjb250cm9sLnN0YXRlQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsISkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQXZvaWQgYW5pbWF0aW9ucyBvbiBsb2FkLlxuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIE5nQ29udHJvbCBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIF9zaG91bGRGb3J3YXJkKHByb3A6IGtleW9mIE5nQ29udHJvbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2NvbnRyb2wgPyB0aGlzLl9jb250cm9sLm5nQ29udHJvbCA6IG51bGw7XG4gICAgcmV0dXJuIG5nQ29udHJvbCAmJiBuZ0NvbnRyb2xbcHJvcF07XG4gIH1cblxuICBfaGFzUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2NvbnRyb2wgJiYgdGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciB8fCB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKTtcbiAgfVxuXG4gIF9oYXNMYWJlbCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9sYWJlbENoaWxkO1xuICB9XG5cbiAgX3Nob3VsZExhYmVsRmxvYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbkxhYmVsRmxvYXQgJiYgKHRoaXMuX2NvbnRyb2wuc2hvdWxkTGFiZWxGbG9hdCB8fCB0aGlzLl9zaG91bGRBbHdheXNGbG9hdCk7XG4gIH1cblxuICBfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIXRoaXMuX2hhc0xhYmVsKCkgfHxcbiAgICAgICAgdGhpcy5faGFzTGFiZWwoKSAmJiAhdGhpcy5fc2hvdWxkTGFiZWxGbG9hdCgpO1xuICB9XG5cbiAgX2hhc0Zsb2F0aW5nTGFiZWwoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLl9oYXNMYWJlbCgpIHx8IHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgdGhpcy5faGFzUGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZGlzcGxheSBoaW50cyBvciBlcnJvcnMuICovXG4gIF9nZXREaXNwbGF5ZWRNZXNzYWdlcygpOiAnZXJyb3InIHwgJ2hpbnQnIHtcbiAgICByZXR1cm4gKHRoaXMuX2Vycm9yQ2hpbGRyZW4gJiYgdGhpcy5fZXJyb3JDaGlsZHJlbi5sZW5ndGggPiAwICYmXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuZXJyb3JTdGF0ZSkgPyAnZXJyb3InIDogJ2hpbnQnO1xuICB9XG5cbiAgLyoqIEFuaW1hdGVzIHRoZSBwbGFjZWhvbGRlciB1cCBhbmQgbG9ja3MgaXQgaW4gcG9zaXRpb24uICovXG4gIF9hbmltYXRlQW5kTG9ja0xhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgJiYgdGhpcy5fY2FuTGFiZWxGbG9hdCkge1xuICAgICAgLy8gSWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHdlIHNob3VsZG4ndCBnbyBpbiBoZXJlLFxuICAgICAgLy8gYmVjYXVzZSB0aGUgYHRyYW5zaXRpb25lbmRgIHdpbGwgbmV2ZXIgZmlyZS5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRpb25zRW5hYmxlZCkge1xuICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IHRydWU7XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZsb2F0TGFiZWwgPSAnYWx3YXlzJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBwbGFjZWhvbGRlciAoZWl0aGVyIGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlIG9uIHRoZSBjaGlsZCBjb250cm9sXG4gICAqIG9yIGNoaWxkIGVsZW1lbnQgd2l0aCB0aGUgYG1hdC1wbGFjZWhvbGRlcmAgZGlyZWN0aXZlKS5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlUGxhY2Vob2xkZXJzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyICYmIHRoaXMuX3BsYWNlaG9sZGVyQ2hpbGQpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIGFueSBleHRyYSBwcm9jZXNzaW5nIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiBoYW5kbGluZyB0aGUgaGludHMuICovXG4gIHByaXZhdGUgX3Byb2Nlc3NIaW50cygpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUhpbnRzKCk7XG4gICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgYSBtYXhpbXVtIG9mIG9uZSBvZiBlYWNoIGA8bWF0LWhpbnQ+YCBhbGlnbm1lbnQgc3BlY2lmaWVkLCB3aXRoIHRoZVxuICAgKiBhdHRyaWJ1dGUgYmVpbmcgY29uc2lkZXJlZCBhcyBgYWxpZ249XCJzdGFydFwiYC5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlSGludHMoKSB7XG4gICAgaWYgKHRoaXMuX2hpbnRDaGlsZHJlbikge1xuICAgICAgbGV0IHN0YXJ0SGludDogTWF0SGludDtcbiAgICAgIGxldCBlbmRIaW50OiBNYXRIaW50O1xuICAgICAgdGhpcy5faGludENoaWxkcmVuLmZvckVhY2goKGhpbnQ6IE1hdEhpbnQpID0+IHtcbiAgICAgICAgaWYgKGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIHtcbiAgICAgICAgICBpZiAoc3RhcnRIaW50IHx8IHRoaXMuaGludExhYmVsKSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yKCdzdGFydCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFydEhpbnQgPSBoaW50O1xuICAgICAgICB9IGVsc2UgaWYgKGhpbnQuYWxpZ24gPT09ICdlbmQnKSB7XG4gICAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ2VuZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbmRIaW50ID0gaGludDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRlZmF1bHQgZmxvYXQgbGFiZWwgc3RhdGUuICovXG4gIHByaXZhdGUgX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuZmxvYXRMYWJlbCkgfHwgdGhpcy5fbGFiZWxPcHRpb25zLmZsb2F0IHx8ICdhdXRvJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBsaXN0IG9mIGVsZW1lbnQgSURzIHRoYXQgZGVzY3JpYmUgdGhlIGNoaWxkIGNvbnRyb2wuIFRoaXMgYWxsb3dzIHRoZSBjb250cm9sIHRvIHVwZGF0ZVxuICAgKiBpdHMgYGFyaWEtZGVzY3JpYmVkYnlgIGF0dHJpYnV0ZSBhY2NvcmRpbmdseS5cbiAgICovXG4gIHByaXZhdGUgX3N5bmNEZXNjcmliZWRCeUlkcygpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbCkge1xuICAgICAgbGV0IGlkczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgaWYgKHRoaXMuX2dldERpc3BsYXllZE1lc3NhZ2VzKCkgPT09ICdoaW50Jykge1xuICAgICAgICBjb25zdCBzdGFydEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gP1xuICAgICAgICAgICAgdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnc3RhcnQnKSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGVuZEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gP1xuICAgICAgICAgICAgdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnZW5kJykgOiBudWxsO1xuXG4gICAgICAgIGlmIChzdGFydEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChzdGFydEhpbnQuaWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2hpbnRMYWJlbCkge1xuICAgICAgICAgIGlkcy5wdXNoKHRoaXMuX2hpbnRMYWJlbElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmRIaW50KSB7XG4gICAgICAgICAgaWRzLnB1c2goZW5kSGludC5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyb3JDaGlsZHJlbikge1xuICAgICAgICBpZHMgPSB0aGlzLl9lcnJvckNoaWxkcmVuLm1hcChlcnJvciA9PiBlcnJvci5pZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbnRyb2wuc2V0RGVzY3JpYmVkQnlJZHMoaWRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBmb3JtIGZpZWxkJ3MgY29udHJvbCBpcyBtaXNzaW5nLiAqL1xuICBwcm90ZWN0ZWQgX3ZhbGlkYXRlQ29udHJvbENoaWxkKCkge1xuICAgIGlmICghdGhpcy5fY29udHJvbCkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB3aWR0aCBhbmQgcG9zaXRpb24gb2YgdGhlIGdhcCBpbiB0aGUgb3V0bGluZS4gT25seSByZWxldmFudCBmb3IgdGhlIG91dGxpbmVcbiAgICogYXBwZWFyYW5jZS5cbiAgICovXG4gIHVwZGF0ZU91dGxpbmVHYXAoKSB7XG4gICAgY29uc3QgbGFiZWxFbCA9IHRoaXMuX2xhYmVsID8gdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICBpZiAodGhpcy5hcHBlYXJhbmNlICE9PSAnb3V0bGluZScgfHwgIWxhYmVsRWwgfHwgIWxhYmVsRWwuY2hpbGRyZW4ubGVuZ3RoIHx8XG4gICAgICAgICFsYWJlbEVsLnRleHRDb250ZW50LnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXNuJ3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IGluIHRoZSBET00sIHRoZSBvdXRsaW5lIGdhcCB3aWxsIG5lZWQgdG8gYmUgY2FsY3VsYXRlZFxuICAgIC8vIHRoZSBuZXh0IHRpbWUgaXQgaXMgY2hlY2tlZCBhbmQgaW4gdGhlIERPTS5cbiAgICBpZiAoIXRoaXMuX2lzQXR0YWNoZWRUb0RPTSgpKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0V2lkdGggPSAwO1xuICAgIGxldCBnYXBXaWR0aCA9IDA7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnQnKTtcbiAgICBjb25zdCBnYXBFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJyk7XG5cbiAgICBpZiAodGhpcy5fbGFiZWwgJiYgdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb250YWluZXIncyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLCBpdCBtZWFucyB0aGF0IHRoZSBlbGVtZW50IGlzXG4gICAgICAvLyBpbnZpc2libGUgYW5kIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgb3V0bGluZSBnYXAuIE1hcmsgdGhlIGVsZW1lbnQgYXMgbmVlZGluZ1xuICAgICAgLy8gdG8gYmUgY2hlY2tlZCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuIFdlIGNhbid0IGRvIHRoaXMgaW1tZWRpYXRlbHlcbiAgICAgIC8vIG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24sIGJlY2F1c2UgZXZlbiBpZiB0aGUgZWxlbWVudCBiZWNvbWVzIHZpc2libGUsXG4gICAgICAvLyB0aGUgYENsaWVudFJlY3RgIHdvbid0IGJlIHJlY2xhY3VsYXRlZCBpbW1lZGlhdGVseS4gV2UgcmVzZXQgdGhlXG4gICAgICAvLyBgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5YCBmbGFnIHNvbWUgd2UgZG9uJ3QgcnVuIHRoZSBjaGVja3MgdHdpY2UuXG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChjb250YWluZXJSZWN0KTtcbiAgICAgIGNvbnN0IGxhYmVsU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChsYWJlbEVsLmNoaWxkcmVuWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgICAgIGxldCBsYWJlbFdpZHRoID0gMDtcblxuICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBsYWJlbEVsLmNoaWxkcmVuKSB7XG4gICAgICAgIGxhYmVsV2lkdGggKz0gY2hpbGQub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgICBzdGFydFdpZHRoID0gbGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0IC0gb3V0bGluZUdhcFBhZGRpbmc7XG4gICAgICBnYXBXaWR0aCA9IGxhYmVsV2lkdGggPiAwID8gbGFiZWxXaWR0aCAqIGZsb2F0aW5nTGFiZWxTY2FsZSArIG91dGxpbmVHYXBQYWRkaW5nICogMiA6IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhcnRFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtzdGFydFdpZHRofXB4YDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYXBFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdhcEVsc1tpXS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgZW5kIG9mIHRoZSByZWN0IGNvbnNpZGVyaW5nIHRoZSBjdXJyZW50IGRpcmVjdGlvbmFsaXR5LiAqL1xuICBwcml2YXRlIF9nZXRTdGFydEVuZChyZWN0OiBDbGllbnRSZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSA/IHJlY3QucmlnaHQgOiByZWN0LmxlZnQ7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0gZmllbGQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cbiAgcHJpdmF0ZSBfaXNBdHRhY2hlZFRvRE9NKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKGVsZW1lbnQuZ2V0Um9vdE5vZGUpIHtcbiAgICAgIGNvbnN0IHJvb3ROb2RlID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSBET00gdGhlIHJvb3Qgbm9kZSB3aWxsIGJlIGVpdGhlciB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIG9yIHRoZSBjbG9zZXN0IHNoYWRvdyByb290LCBvdGhlcndpc2UgaXQnbGwgYmUgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgICAgcmV0dXJuIHJvb3ROb2RlICYmIHJvb3ROb2RlICE9PSBlbGVtZW50O1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gY2hlY2tpbmcgaWYgaXQncyBpbiB0aGUgZG9jdW1lbnQuIFRoaXMgZG9lc24ndCBhY2NvdW50IGZvclxuICAgIC8vIHNoYWRvdyBET00sIGhvd2V2ZXIgYnJvd3NlciB0aGF0IHN1cHBvcnQgc2hhZG93IERPTSBzaG91bGQgc3VwcG9ydCBgZ2V0Um9vdE5vZGVgIGFzIHdlbGwuXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuY29udGFpbnMoZWxlbWVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVJlcXVpcmVkTWFya2VyOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=