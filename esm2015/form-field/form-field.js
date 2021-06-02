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
import { mixinColor, } from '@angular/material/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';
import { MAT_ERROR } from './error';
import { matFormFieldAnimations } from './form-field-animations';
import { MatFormFieldControl } from './form-field-control';
import { getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError, } from './form-field-errors';
import { _MAT_HINT } from './hint';
import { MatLabel } from './label';
import { MatPlaceholder } from './placeholder';
import { MAT_PREFIX } from './prefix';
import { MAT_SUFFIX } from './suffix';
import { Platform } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
let nextUniqueId = 0;
const floatingLabelScale = 0.75;
const outlineGapPadding = 5;
/**
 * Boilerplate for applying mixins to MatFormField.
 * @docs-private
 */
const _MatFormFieldBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}, 'primary');
/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export const MAT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken('MAT_FORM_FIELD_DEFAULT_OPTIONS');
/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
export const MAT_FORM_FIELD = new InjectionToken('MatFormField');
/** Container for form controls that applies Material Design styling and behavior. */
export class MatFormField extends _MatFormFieldBase {
    constructor(_elementRef, _changeDetectorRef, 
    /**
     * @deprecated `_labelOptions` parameter no longer being used. To be removed.
     * @breaking-change 12.0.0
     */
    // Use `ElementRef` here so Angular has something to inject.
    _labelOptions, _dir, _defaults, _platform, _ngZone, _animationMode) {
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
        /** Whether the outline gap needs to be calculated next time the zone has stabilized. */
        this._outlineGapCalculationNeededOnStable = false;
        this._destroyed = new Subject();
        /** Override for the logic that disables the label animation in certain cases. */
        this._showAlwaysAnimate = false;
        /** State of the mat-hint and mat-error animations. */
        this._subscriptAnimationState = '';
        this._hintLabel = '';
        // Unique id for the hint label.
        this._hintLabelId = `mat-hint-${nextUniqueId++}`;
        // Unique id for the label element.
        this._labelId = `mat-form-field-label-${nextUniqueId++}`;
        this.floatLabel = this._getDefaultFloatLabelState();
        this._animationsEnabled = _animationMode !== 'NoopAnimations';
        // Set the default through here so we invoke the setter on the first run.
        this.appearance = (_defaults && _defaults.appearance) ? _defaults.appearance : 'legacy';
        this._hideRequiredMarker = (_defaults && _defaults.hideRequiredMarker != null) ?
            _defaults.hideRequiredMarker : false;
    }
    /** The form-field appearance style. */
    get appearance() { return this._appearance; }
    set appearance(value) {
        const oldValue = this._appearance;
        this._appearance = value || (this._defaults && this._defaults.appearance) || 'legacy';
        if (this._appearance === 'outline' && oldValue !== value) {
            this._outlineGapCalculationNeededOnStable = true;
        }
    }
    /** Whether the required marker should be hidden. */
    get hideRequiredMarker() { return this._hideRequiredMarker; }
    set hideRequiredMarker(value) {
        this._hideRequiredMarker = coerceBooleanProperty(value);
    }
    /** Whether the floating label should always float or not. */
    _shouldAlwaysFloat() {
        return this.floatLabel === 'always' && !this._showAlwaysAnimate;
    }
    /** Whether the label can float or not. */
    _canLabelFloat() { return this.floatLabel !== 'never'; }
    /** Text for the form field hint. */
    get hintLabel() { return this._hintLabel; }
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
     */
    get floatLabel() {
        return this.appearance !== 'legacy' && this._floatLabel === 'never' ? 'auto' : this._floatLabel;
    }
    set floatLabel(value) {
        if (value !== this._floatLabel) {
            this._floatLabel = value || this._getDefaultFloatLabelState();
            this._changeDetectorRef.markForCheck();
        }
    }
    get _control() {
        // TODO(crisbeto): we need this workaround in order to support both Ivy and ViewEngine.
        //  We should clean this up once Ivy is the default renderer.
        return this._explicitFormFieldControl || this._controlNonStatic || this._controlStatic;
    }
    set _control(value) {
        this._explicitFormFieldControl = value;
    }
    /**
     * Gets the id of the label element. If no label is present, returns `null`.
     */
    getLabelId() {
        return this._hasFloatingLabel() ? this._labelId : null;
    }
    /**
     * Gets an ElementRef for the element that a overlay attached to the form-field should be
     * positioned relative to.
     */
    getConnectedOverlayOrigin() {
        return this._connectionContainerRef || this._elementRef;
    }
    ngAfterContentInit() {
        this._validateControlChild();
        const control = this._control;
        if (control.controlType) {
            this._elementRef.nativeElement.classList.add(`mat-form-field-type-${control.controlType}`);
        }
        // Subscribe to changes in the child control state in order to update the form field UI.
        control.stateChanges.pipe(startWith(null)).subscribe(() => {
            this._validatePlaceholders();
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
        // Run change detection if the value changes.
        if (control.ngControl && control.ngControl.valueChanges) {
            control.ngControl.valueChanges
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => this._changeDetectorRef.markForCheck());
        }
        // Note that we have to run outside of the `NgZone` explicitly,
        // in order to avoid throwing users into an infinite loop
        // if `zone-patch-rxjs` is included.
        this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.pipe(takeUntil(this._destroyed)).subscribe(() => {
                if (this._outlineGapCalculationNeededOnStable) {
                    this.updateOutlineGap();
                }
            });
        });
        // Run change detection and update the outline if the suffix or prefix changes.
        merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
            this._outlineGapCalculationNeededOnStable = true;
            this._changeDetectorRef.markForCheck();
        });
        // Re-validate when the number of hints changes.
        this._hintChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._processHints();
            this._changeDetectorRef.markForCheck();
        });
        // Update the aria-described by when the number of errors changes.
        this._errorChildren.changes.pipe(startWith(null)).subscribe(() => {
            this._syncDescribedByIds();
            this._changeDetectorRef.markForCheck();
        });
        if (this._dir) {
            this._dir.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
                if (typeof requestAnimationFrame === 'function') {
                    this._ngZone.runOutsideAngular(() => {
                        requestAnimationFrame(() => this.updateOutlineGap());
                    });
                }
                else {
                    this.updateOutlineGap();
                }
            });
        }
    }
    ngAfterContentChecked() {
        this._validateControlChild();
        if (this._outlineGapCalculationNeededImmediately) {
            this.updateOutlineGap();
        }
    }
    ngAfterViewInit() {
        // Avoid animations on load.
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** Determines whether a class from the NgControl should be forwarded to the host element. */
    _shouldForward(prop) {
        const ngControl = this._control ? this._control.ngControl : null;
        return ngControl && ngControl[prop];
    }
    _hasPlaceholder() {
        return !!(this._control && this._control.placeholder || this._placeholderChild);
    }
    _hasLabel() {
        return !!(this._labelChildNonStatic || this._labelChildStatic);
    }
    _shouldLabelFloat() {
        return this._canLabelFloat() &&
            ((this._control && this._control.shouldLabelFloat) || this._shouldAlwaysFloat());
    }
    _hideControlPlaceholder() {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this.appearance === 'legacy' && !this._hasLabel() ||
            this._hasLabel() && !this._shouldLabelFloat();
    }
    _hasFloatingLabel() {
        // In the legacy appearance the placeholder is promoted to a label if no label is given.
        return this._hasLabel() || this.appearance === 'legacy' && this._hasPlaceholder();
    }
    /** Determines whether to display hints or errors. */
    _getDisplayedMessages() {
        return (this._errorChildren && this._errorChildren.length > 0 &&
            this._control.errorState) ? 'error' : 'hint';
    }
    /** Animates the placeholder up and locks it in position. */
    _animateAndLockLabel() {
        if (this._hasFloatingLabel() && this._canLabelFloat()) {
            // If animations are disabled, we shouldn't go in here,
            // because the `transitionend` will never fire.
            if (this._animationsEnabled && this._label) {
                this._showAlwaysAnimate = true;
                fromEvent(this._label.nativeElement, 'transitionend').pipe(take(1)).subscribe(() => {
                    this._showAlwaysAnimate = false;
                });
            }
            this.floatLabel = 'always';
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Ensure that there is only one placeholder (either `placeholder` attribute on the child control
     * or child element with the `mat-placeholder` directive).
     */
    _validatePlaceholders() {
        if (this._control.placeholder && this._placeholderChild &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatFormFieldPlaceholderConflictError();
        }
    }
    /** Does any extra processing that is required when handling the hints. */
    _processHints() {
        this._validateHints();
        this._syncDescribedByIds();
    }
    /**
     * Ensure that there is a maximum of one of each `<mat-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    _validateHints() {
        if (this._hintChildren && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            let startHint;
            let endHint;
            this._hintChildren.forEach((hint) => {
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
            });
        }
    }
    /** Gets the default float label state. */
    _getDefaultFloatLabelState() {
        return (this._defaults && this._defaults.floatLabel) || 'auto';
    }
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    _syncDescribedByIds() {
        if (this._control) {
            let ids = [];
            // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
            if (this._control.userAriaDescribedBy &&
                typeof this._control.userAriaDescribedBy === 'string') {
                ids.push(...this._control.userAriaDescribedBy.split(' '));
            }
            if (this._getDisplayedMessages() === 'hint') {
                const startHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'start') : null;
                const endHint = this._hintChildren ?
                    this._hintChildren.find(hint => hint.align === 'end') : null;
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
                ids.push(...this._errorChildren.map(error => error.id));
            }
            this._control.setDescribedByIds(ids);
        }
    }
    /** Throws an error if the form field's control is missing. */
    _validateControlChild() {
        if (!this._control && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatFormFieldMissingControlError();
        }
    }
    /**
     * Updates the width and position of the gap in the outline. Only relevant for the outline
     * appearance.
     */
    updateOutlineGap() {
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
        let startWidth = 0;
        let gapWidth = 0;
        const container = this._connectionContainerRef.nativeElement;
        const startEls = container.querySelectorAll('.mat-form-field-outline-start');
        const gapEls = container.querySelectorAll('.mat-form-field-outline-gap');
        if (this._label && this._label.nativeElement.children.length) {
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
            const containerStart = this._getStartEnd(containerRect);
            const labelChildren = labelEl.children;
            const labelStart = this._getStartEnd(labelChildren[0].getBoundingClientRect());
            let labelWidth = 0;
            for (let i = 0; i < labelChildren.length; i++) {
                labelWidth += labelChildren[i].offsetWidth;
            }
            startWidth = Math.abs(labelStart - containerStart) - outlineGapPadding;
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
    /** Gets the start end of the rect considering the current directionality. */
    _getStartEnd(rect) {
        return (this._dir && this._dir.value === 'rtl') ? rect.right : rect.left;
    }
    /** Checks whether the form field is attached to the DOM. */
    _isAttachedToDOM() {
        const element = this._elementRef.nativeElement;
        if (element.getRootNode) {
            const rootNode = element.getRootNode();
            // If the element is inside the DOM the root node will be either the document
            // or the closest shadow root, otherwise it'll be the element itself.
            return rootNode && rootNode !== element;
        }
        // Otherwise fall back to checking if it's in the document. This doesn't account for
        // shadow DOM, however browser that support shadow DOM should support `getRootNode` as well.
        return document.documentElement.contains(element);
    }
}
MatFormField.decorators = [
    { type: Component, args: [{
                selector: 'mat-form-field',
                exportAs: 'matFormField',
                template: "<div class=\"mat-form-field-wrapper\">\n  <div class=\"mat-form-field-flex\" #connectionContainer\n       (click)=\"_control.onContainerClick && _control.onContainerClick($event)\">\n\n    <!-- Outline used for outline appearance. -->\n    <ng-container *ngIf=\"appearance == 'outline'\">\n      <div class=\"mat-form-field-outline\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n      <div class=\"mat-form-field-outline mat-form-field-outline-thick\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n    </ng-container>\n\n    <div class=\"mat-form-field-prefix\" *ngIf=\"_prefixChildren.length\">\n      <ng-content select=\"[matPrefix]\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-infix\" #inputContainer>\n      <ng-content></ng-content>\n\n      <span class=\"mat-form-field-label-wrapper\">\n        <!-- We add aria-owns as a workaround for an issue in JAWS & NVDA where the label isn't\n             read if it comes before the control in the DOM. -->\n        <label class=\"mat-form-field-label\"\n               (cdkObserveContent)=\"updateOutlineGap()\"\n               [cdkObserveContentDisabled]=\"appearance != 'outline'\"\n               [id]=\"_labelId\"\n               [attr.for]=\"_control.id\"\n               [attr.aria-owns]=\"_control.id\"\n               [class.mat-empty]=\"_control.empty && !_shouldAlwaysFloat()\"\n               [class.mat-form-field-empty]=\"_control.empty && !_shouldAlwaysFloat()\"\n               [class.mat-accent]=\"color == 'accent'\"\n               [class.mat-warn]=\"color == 'warn'\"\n               #label\n               *ngIf=\"_hasFloatingLabel()\"\n               [ngSwitch]=\"_hasLabel()\">\n\n          <!-- @breaking-change 8.0.0 remove in favor of mat-label element an placeholder attr. -->\n          <ng-container *ngSwitchCase=\"false\">\n            <ng-content select=\"mat-placeholder\"></ng-content>\n            <span>{{_control.placeholder}}</span>\n          </ng-container>\n\n          <ng-content select=\"mat-label\" *ngSwitchCase=\"true\"></ng-content>\n\n          <!-- @breaking-change 8.0.0 remove `mat-placeholder-required` class -->\n          <span\n            class=\"mat-placeholder-required mat-form-field-required-marker\"\n            aria-hidden=\"true\"\n            *ngIf=\"!hideRequiredMarker && _control.required && !_control.disabled\">&#32;*</span>\n        </label>\n      </span>\n    </div>\n\n    <div class=\"mat-form-field-suffix\" *ngIf=\"_suffixChildren.length\">\n      <ng-content select=\"[matSuffix]\"></ng-content>\n    </div>\n  </div>\n\n  <!-- Underline used for legacy, standard, and box appearances. -->\n  <div class=\"mat-form-field-underline\" #underline\n       *ngIf=\"appearance != 'outline'\">\n    <span class=\"mat-form-field-ripple\"\n          [class.mat-accent]=\"color == 'accent'\"\n          [class.mat-warn]=\"color == 'warn'\"></span>\n  </div>\n\n  <div class=\"mat-form-field-subscript-wrapper\"\n       [ngSwitch]=\"_getDisplayedMessages()\">\n    <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\">\n      <ng-content select=\"mat-error\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-hint-wrapper\" *ngSwitchCase=\"'hint'\"\n      [@transitionMessages]=\"_subscriptAnimationState\">\n      <!-- TODO(mmalerba): use an actual <mat-hint> once all selectors are switched to mat-* -->\n      <div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div>\n      <ng-content select=\"mat-hint:not([align='end'])\"></ng-content>\n      <div class=\"mat-form-field-hint-spacer\"></div>\n      <ng-content select=\"mat-hint[align='end']\"></ng-content>\n    </div>\n  </div>\n</div>\n",
                animations: [matFormFieldAnimations.transitionMessages],
                host: {
                    'class': 'mat-form-field',
                    '[class.mat-form-field-appearance-standard]': 'appearance == "standard"',
                    '[class.mat-form-field-appearance-fill]': 'appearance == "fill"',
                    '[class.mat-form-field-appearance-outline]': 'appearance == "outline"',
                    '[class.mat-form-field-appearance-legacy]': 'appearance == "legacy"',
                    '[class.mat-form-field-invalid]': '_control.errorState',
                    '[class.mat-form-field-can-float]': '_canLabelFloat()',
                    '[class.mat-form-field-should-float]': '_shouldLabelFloat()',
                    '[class.mat-form-field-has-label]': '_hasFloatingLabel()',
                    '[class.mat-form-field-hide-placeholder]': '_hideControlPlaceholder()',
                    '[class.mat-form-field-disabled]': '_control.disabled',
                    '[class.mat-form-field-autofilled]': '_control.autofilled',
                    '[class.mat-focused]': '_control.focused',
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
                providers: [
                    { provide: MAT_FORM_FIELD, useExisting: MatFormField },
                ],
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:none;transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field-hint-end{order:1}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit;box-sizing:content-box}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date],.mat-input-element[type=datetime],.mat-input-element[type=datetime-local],.mat-input-element[type=month],.mat-input-element[type=week],.mat-input-element[type=time]{line-height:1}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{opacity:0}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}.mat-focused .cdk-high-contrast-active select.mat-input-element::-ms-value{color:inherit}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n"]
            },] }
];
MatFormField.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [ElementRef,] }] },
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
    _errorChildren: [{ type: ContentChildren, args: [MAT_ERROR, { descendants: true },] }],
    _hintChildren: [{ type: ContentChildren, args: [_MAT_HINT, { descendants: true },] }],
    _prefixChildren: [{ type: ContentChildren, args: [MAT_PREFIX, { descendants: true },] }],
    _suffixChildren: [{ type: ContentChildren, args: [MAT_SUFFIX, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxVQUFVLEdBQ1gsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBVyxNQUFNLFNBQVMsQ0FBQztBQUM1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLGtDQUFrQyxFQUNsQyx1Q0FBdUMsR0FDeEMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFVLE1BQU0sUUFBUSxDQUFDO0FBQzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLGNBQWMs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c2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIG1peGluQ29sb3IsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIG1lcmdlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TUFUX0VSUk9SLCBNYXRFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge21hdEZvcm1GaWVsZEFuaW1hdGlvbnN9IGZyb20gJy4vZm9ybS1maWVsZC1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnLi9mb3JtLWZpZWxkLWNvbnRyb2wnO1xuaW1wb3J0IHtcbiAgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yLFxufSBmcm9tICcuL2Zvcm0tZmllbGQtZXJyb3JzJztcbmltcG9ydCB7X01BVF9ISU5ULCBNYXRIaW50fSBmcm9tICcuL2hpbnQnO1xuaW1wb3J0IHtNYXRMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge01hdFBsYWNlaG9sZGVyfSBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCB7TUFUX1BSRUZJWCwgTWF0UHJlZml4fSBmcm9tICcuL3ByZWZpeCc7XG5pbXBvcnQge01BVF9TVUZGSVgsIE1hdFN1ZmZpeH0gZnJvbSAnLi9zdWZmaXgnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcbmNvbnN0IGZsb2F0aW5nTGFiZWxTY2FsZSA9IDAuNzU7XG5jb25zdCBvdXRsaW5lR2FwUGFkZGluZyA9IDU7XG5cblxuLyoqXG4gKiBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEZvcm1GaWVsZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgX01hdEZvcm1GaWVsZEJhc2UgPSBtaXhpbkNvbG9yKGNsYXNzIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufSwgJ3ByaW1hcnknKTtcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgZm9ybSBmaWVsZC4gKi9cbmV4cG9ydCB0eXBlIE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCcgfCAnZmlsbCcgfCAnb3V0bGluZSc7XG5cbi8qKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBcImZsb2F0TGFiZWxcIiBmb3JtLWZpZWxkIGlucHV0LiAqL1xuZXhwb3J0IHR5cGUgRmxvYXRMYWJlbFR5cGUgPSAnYWx3YXlzJyB8ICduZXZlcicgfCAnYXV0byc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgZm9ybSBmaWVsZCB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zIHtcbiAgYXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gIGhpZGVSZXF1aXJlZE1hcmtlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBmb3IgZm9ybS1maWVsZHMgc2hvdWxkIGJ5IGRlZmF1bHQgZmxvYXQgYGFsd2F5c2AsXG4gICAqIGBuZXZlcmAsIG9yIGBhdXRvYCAob25seSB3aGVuIG5lY2Vzc2FyeSkuXG4gICAqL1xuICBmbG9hdExhYmVsPzogRmxvYXRMYWJlbFR5cGU7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgZm9ybSBmaWVsZCB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnM+KCdNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBpbmplY3QgYW4gaW5zdGFuY2VzIG9mIGBNYXRGb3JtRmllbGRgLiBJdCBzZXJ2ZXNcbiAqIGFzIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdEZvcm1GaWVsZGAgY2xhc3Mgd2hpY2ggd291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgYE1hdEZvcm1GaWVsZGAgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRk9STV9GSUVMRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRGb3JtRmllbGQ+KCdNYXRGb3JtRmllbGQnKTtcblxuLyoqIENvbnRhaW5lciBmb3IgZm9ybSBjb250cm9scyB0aGF0IGFwcGxpZXMgTWF0ZXJpYWwgRGVzaWduIHN0eWxpbmcgYW5kIGJlaGF2aW9yLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvcm0tZmllbGQnLFxuICBleHBvcnRBczogJ21hdEZvcm1GaWVsZCcsXG4gIHRlbXBsYXRlVXJsOiAnZm9ybS1maWVsZC5odG1sJyxcbiAgLy8gTWF0SW5wdXQgaXMgYSBkaXJlY3RpdmUgYW5kIGNhbid0IGhhdmUgc3R5bGVzLCBzbyB3ZSBuZWVkIHRvIGluY2x1ZGUgaXRzIHN0eWxlcyBoZXJlXG4gIC8vIGluIGZvcm0tZmllbGQtaW5wdXQuY3NzLiBUaGUgTWF0SW5wdXQgc3R5bGVzIGFyZSBmYWlybHkgbWluaW1hbCBzbyBpdCBzaG91bGRuJ3QgYmUgYVxuICAvLyBiaWcgZGVhbCBmb3IgcGVvcGxlIHdobyBhcmVuJ3QgdXNpbmcgTWF0SW5wdXQuXG4gIHN0eWxlVXJsczogW1xuICAgICdmb3JtLWZpZWxkLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtZmlsbC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWlucHV0LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtbGVnYWN5LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtb3V0bGluZS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLXN0YW5kYXJkLmNzcycsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFttYXRGb3JtRmllbGRBbmltYXRpb25zLnRyYW5zaXRpb25NZXNzYWdlc10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvcm0tZmllbGQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PSBcInN0YW5kYXJkXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1maWxsXSc6ICdhcHBlYXJhbmNlID09IFwiZmlsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utb3V0bGluZV0nOiAnYXBwZWFyYW5jZSA9PSBcIm91dGxpbmVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWxlZ2FjeV0nOiAnYXBwZWFyYW5jZSA9PSBcImxlZ2FjeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWludmFsaWRdJzogJ19jb250cm9sLmVycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtY2FuLWZsb2F0XSc6ICdfY2FuTGFiZWxGbG9hdCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLXNob3VsZC1mbG9hdF0nOiAnX3Nob3VsZExhYmVsRmxvYXQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1oYXMtbGFiZWxdJzogJ19oYXNGbG9hdGluZ0xhYmVsKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGlkZS1wbGFjZWhvbGRlcl0nOiAnX2hpZGVDb250cm9sUGxhY2Vob2xkZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1kaXNhYmxlZF0nOiAnX2NvbnRyb2wuZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXV0b2ZpbGxlZF0nOiAnX2NvbnRyb2wuYXV0b2ZpbGxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9jdXNlZF0nOiAnX2NvbnRyb2wuZm9jdXNlZCcsXG4gICAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ19zaG91bGRGb3J3YXJkKFwidW50b3VjaGVkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ19zaG91bGRGb3J3YXJkKFwidG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnX3Nob3VsZEZvcndhcmQoXCJwcmlzdGluZVwiKScsXG4gICAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnX3Nob3VsZEZvcndhcmQoXCJkaXJ0eVwiKScsXG4gICAgJ1tjbGFzcy5uZy12YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ2YWxpZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdfc2hvdWxkRm9yd2FyZChcImludmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctcGVuZGluZ10nOiAnX3Nob3VsZEZvcndhcmQoXCJwZW5kaW5nXCIpJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICchX2FuaW1hdGlvbnNFbmFibGVkJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTUFUX0ZPUk1fRklFTEQsIHVzZUV4aXN0aW5nOiBNYXRGb3JtRmllbGR9LFxuICBdXG59KVxuXG5leHBvcnQgY2xhc3MgTWF0Rm9ybUZpZWxkIGV4dGVuZHMgX01hdEZvcm1GaWVsZEJhc2VcbiAgICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBvdXRsaW5lIGdhcCBuZWVkcyB0byBiZSBjYWxjdWxhdGVkXG4gICAqIGltbWVkaWF0ZWx5IG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24gcnVuLlxuICAgKi9cbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZCBuZXh0IHRpbWUgdGhlIHpvbmUgaGFzIHN0YWJpbGl6ZWQuICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGZvcm0tZmllbGQgYXBwZWFyYW5jZSBzdHlsZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFwcGVhcmFuY2UoKTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSB7IHJldHVybiB0aGlzLl9hcHBlYXJhbmNlOyB9XG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlKSB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9hcHBlYXJhbmNlO1xuXG4gICAgdGhpcy5fYXBwZWFyYW5jZSA9IHZhbHVlIHx8ICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5hcHBlYXJhbmNlKSB8fCAnbGVnYWN5JztcblxuICAgIGlmICh0aGlzLl9hcHBlYXJhbmNlID09PSAnb3V0bGluZScgJiYgb2xkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgfVxuICB9XG4gIF9hcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSByZXF1aXJlZCBtYXJrZXIgc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVSZXF1aXJlZE1hcmtlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlcjsgfVxuICBzZXQgaGlkZVJlcXVpcmVkTWFya2VyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUmVxdWlyZWRNYXJrZXI6IGJvb2xlYW47XG5cbiAgLyoqIE92ZXJyaWRlIGZvciB0aGUgbG9naWMgdGhhdCBkaXNhYmxlcyB0aGUgbGFiZWwgYW5pbWF0aW9uIGluIGNlcnRhaW4gY2FzZXMuICovXG4gIHByaXZhdGUgX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGZsb2F0aW5nIGxhYmVsIHNob3VsZCBhbHdheXMgZmxvYXQgb3Igbm90LiAqL1xuICBfc2hvdWxkQWx3YXlzRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCA9PT0gJ2Fsd2F5cycgJiYgIXRoaXMuX3Nob3dBbHdheXNBbmltYXRlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIGNhbiBmbG9hdCBvciBub3QuICovXG4gIF9jYW5MYWJlbEZsb2F0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5mbG9hdExhYmVsICE9PSAnbmV2ZXInOyB9XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBmb3JtIGZpZWxkIGhpbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaW50TGFiZWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2hpbnRMYWJlbDsgfVxuICBzZXQgaGludExhYmVsKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaW50TGFiZWwgPSB2YWx1ZTtcbiAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgfVxuICBwcml2YXRlIF9oaW50TGFiZWwgPSAnJztcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBoaW50IGxhYmVsLlxuICByZWFkb25seSBfaGludExhYmVsSWQ6IHN0cmluZyA9IGBtYXQtaGludC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgbGFiZWwgZWxlbWVudC5cbiAgcmVhZG9ubHkgX2xhYmVsSWQgPSBgbWF0LWZvcm0tZmllbGQtbGFiZWwtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0LCBuZXZlciBmbG9hdCBvciBmbG9hdCBhcyB0aGUgdXNlciB0eXBlcy5cbiAgICpcbiAgICogTm90ZTogb25seSB0aGUgbGVnYWN5IGFwcGVhcmFuY2Ugc3VwcG9ydHMgdGhlIGBuZXZlcmAgb3B0aW9uLiBgbmV2ZXJgIHdhcyBvcmlnaW5hbGx5IGFkZGVkIGFzIGFcbiAgICogd2F5IHRvIG1ha2UgdGhlIGZsb2F0aW5nIGxhYmVsIGVtdWxhdGUgdGhlIGJlaGF2aW9yIG9mIGEgc3RhbmRhcmQgaW5wdXQgcGxhY2Vob2xkZXIuIEhvd2V2ZXJcbiAgICogdGhlIGZvcm0gZmllbGQgbm93IHN1cHBvcnRzIGJvdGggZmxvYXRpbmcgbGFiZWxzIGFuZCBwbGFjZWhvbGRlcnMuIFRoZXJlZm9yZSBpbiB0aGUgbm9uLWxlZ2FjeVxuICAgKiBhcHBlYXJhbmNlcyB0aGUgYG5ldmVyYCBvcHRpb24gaGFzIGJlZW4gZGlzYWJsZWQgaW4gZmF2b3Igb2YganVzdCB1c2luZyB0aGUgcGxhY2Vob2xkZXIuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZmxvYXRMYWJlbCgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSAhPT0gJ2xlZ2FjeScgJiYgdGhpcy5fZmxvYXRMYWJlbCA9PT0gJ25ldmVyJyA/ICdhdXRvJyA6IHRoaXMuX2Zsb2F0TGFiZWw7XG4gIH1cbiAgc2V0IGZsb2F0TGFiZWwodmFsdWU6IEZsb2F0TGFiZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mbG9hdExhYmVsKSB7XG4gICAgICB0aGlzLl9mbG9hdExhYmVsID0gdmFsdWUgfHwgdGhpcy5fZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Zsb2F0TGFiZWw6IEZsb2F0TGFiZWxUeXBlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBBbmd1bGFyIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRW5hYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQFZpZXdDaGlsZCgndW5kZXJsaW5lJykgdW5kZXJsaW5lUmVmOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2Nvbm5lY3Rpb25Db250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX2Nvbm5lY3Rpb25Db250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Q29udGFpbmVyJykgX2lucHV0Q29udGFpbmVyUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdsYWJlbCcpIHByaXZhdGUgX2xhYmVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wpIF9jb250cm9sTm9uU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCwge3N0YXRpYzogdHJ1ZX0pIF9jb250cm9sU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIGdldCBfY29udHJvbCgpIHtcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbmVlZCB0aGlzIHdvcmthcm91bmQgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgICAvLyAgV2Ugc2hvdWxkIGNsZWFuIHRoaXMgdXAgb25jZSBJdnkgaXMgdGhlIGRlZmF1bHQgcmVuZGVyZXIuXG4gICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCB8fCB0aGlzLl9jb250cm9sTm9uU3RhdGljIHx8IHRoaXMuX2NvbnRyb2xTdGF0aWM7XG4gIH1cbiAgc2V0IF9jb250cm9sKHZhbHVlKSB7XG4gICAgdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRGb3JtRmllbGRDb250cm9sOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMYWJlbCkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdFBsYWNlaG9sZGVyKSBfcGxhY2Vob2xkZXJDaGlsZDogTWF0UGxhY2Vob2xkZXI7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfRVJST1IsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9lcnJvckNoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0RXJyb3I+O1xuICBAQ29udGVudENoaWxkcmVuKF9NQVRfSElOVCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2hpbnRDaGlsZHJlbjogUXVlcnlMaXN0PE1hdEhpbnQ+O1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9QUkVGSVgsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9wcmVmaXhDaGlsZHJlbjogUXVlcnlMaXN0PE1hdFByZWZpeD47XG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX1NVRkZJWCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3N1ZmZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0U3VmZml4PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgLyoqXG4gICAgICAgKiBAZGVwcmVjYXRlZCBgX2xhYmVsT3B0aW9uc2AgcGFyYW1ldGVyIG5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICAgICAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICAgICAqL1xuICAgICAgQEluamVjdChFbGVtZW50UmVmKVxuICAgICAgICAgIC8vIFVzZSBgRWxlbWVudFJlZmAgaGVyZSBzbyBBbmd1bGFyIGhhcyBzb21ldGhpbmcgdG8gaW5qZWN0LlxuICAgICAgICAgIF9sYWJlbE9wdGlvbnM6IGFueSxcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdHM6XG4gICAgICAgICAgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMsIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgX2FuaW1hdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMuZmxvYXRMYWJlbCA9IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IChfZGVmYXVsdHMgJiYgX2RlZmF1bHRzLmFwcGVhcmFuY2UpID8gX2RlZmF1bHRzLmFwcGVhcmFuY2UgOiAnbGVnYWN5JztcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIgIT0gbnVsbCkgP1xuICAgICAgICBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaWQgb2YgdGhlIGxhYmVsIGVsZW1lbnQuIElmIG5vIGxhYmVsIGlzIHByZXNlbnQsIHJldHVybnMgYG51bGxgLlxuICAgKi9cbiAgZ2V0TGFiZWxJZCgpOiBzdHJpbmd8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0Zsb2F0aW5nTGFiZWwoKSA/IHRoaXMuX2xhYmVsSWQgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gRWxlbWVudFJlZiBmb3IgdGhlIGVsZW1lbnQgdGhhdCBhIG92ZXJsYXkgYXR0YWNoZWQgdG8gdGhlIGZvcm0tZmllbGQgc2hvdWxkIGJlXG4gICAqIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8uXG4gICAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmIHx8IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcblxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLl9jb250cm9sO1xuXG4gICAgaWYgKGNvbnRyb2wuY29udHJvbFR5cGUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtZm9ybS1maWVsZC10eXBlLSR7Y29udHJvbC5jb250cm9sVHlwZX1gKTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgY2hpbGQgY29udHJvbCBzdGF0ZSBpbiBvcmRlciB0byB1cGRhdGUgdGhlIGZvcm0gZmllbGQgVUkuXG4gICAgY29udHJvbC5zdGF0ZUNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQXZvaWQgYW5pbWF0aW9ucyBvbiBsb2FkLlxuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIE5nQ29udHJvbCBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIF9zaG91bGRGb3J3YXJkKHByb3A6IGtleW9mIE5nQ29udHJvbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2NvbnRyb2wgPyB0aGlzLl9jb250cm9sLm5nQ29udHJvbCA6IG51bGw7XG4gICAgcmV0dXJuIG5nQ29udHJvbCAmJiBuZ0NvbnRyb2xbcHJvcF07XG4gIH1cblxuICBfaGFzUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2NvbnRyb2wgJiYgdGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciB8fCB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKTtcbiAgfVxuXG4gIF9oYXNMYWJlbCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5fbGFiZWxDaGlsZE5vblN0YXRpYyB8fCB0aGlzLl9sYWJlbENoaWxkU3RhdGljKTtcbiAgfVxuXG4gIF9zaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiB0aGlzLl9jYW5MYWJlbEZsb2F0KCkgJiZcbiAgICAgICAgKCh0aGlzLl9jb250cm9sICYmIHRoaXMuX2NvbnRyb2wuc2hvdWxkTGFiZWxGbG9hdCkgfHwgdGhpcy5fc2hvdWxkQWx3YXlzRmxvYXQoKSk7XG4gIH1cblxuICBfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIXRoaXMuX2hhc0xhYmVsKCkgfHxcbiAgICAgICAgdGhpcy5faGFzTGFiZWwoKSAmJiAhdGhpcy5fc2hvdWxkTGFiZWxGbG9hdCgpO1xuICB9XG5cbiAgX2hhc0Zsb2F0aW5nTGFiZWwoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLl9oYXNMYWJlbCgpIHx8IHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgdGhpcy5faGFzUGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZGlzcGxheSBoaW50cyBvciBlcnJvcnMuICovXG4gIF9nZXREaXNwbGF5ZWRNZXNzYWdlcygpOiAnZXJyb3InIHwgJ2hpbnQnIHtcbiAgICByZXR1cm4gKHRoaXMuX2Vycm9yQ2hpbGRyZW4gJiYgdGhpcy5fZXJyb3JDaGlsZHJlbi5sZW5ndGggPiAwICYmXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuZXJyb3JTdGF0ZSkgPyAnZXJyb3InIDogJ2hpbnQnO1xuICB9XG5cbiAgLyoqIEFuaW1hdGVzIHRoZSBwbGFjZWhvbGRlciB1cCBhbmQgbG9ja3MgaXQgaW4gcG9zaXRpb24uICovXG4gIF9hbmltYXRlQW5kTG9ja0xhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgJiYgdGhpcy5fY2FuTGFiZWxGbG9hdCgpKSB7XG4gICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgd2Ugc2hvdWxkbid0IGdvIGluIGhlcmUsXG4gICAgICAvLyBiZWNhdXNlIHRoZSBgdHJhbnNpdGlvbmVuZGAgd2lsbCBuZXZlciBmaXJlLlxuICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkICYmIHRoaXMuX2xhYmVsKSB7XG4gICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICBmcm9tRXZlbnQodGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIHBsYWNlaG9sZGVyIChlaXRoZXIgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb24gdGhlIGNoaWxkIGNvbnRyb2xcbiAgICogb3IgY2hpbGQgZWxlbWVudCB3aXRoIHRoZSBgbWF0LXBsYWNlaG9sZGVyYCBkaXJlY3RpdmUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgJiYgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCAmJlxuICAgICAgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEb2VzIGFueSBleHRyYSBwcm9jZXNzaW5nIHRoYXQgaXMgcmVxdWlyZWQgd2hlbiBoYW5kbGluZyB0aGUgaGludHMuICovXG4gIHByaXZhdGUgX3Byb2Nlc3NIaW50cygpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUhpbnRzKCk7XG4gICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgYSBtYXhpbXVtIG9mIG9uZSBvZiBlYWNoIGA8bWF0LWhpbnQ+YCBhbGlnbm1lbnQgc3BlY2lmaWVkLCB3aXRoIHRoZVxuICAgKiBhdHRyaWJ1dGUgYmVpbmcgY29uc2lkZXJlZCBhcyBgYWxpZ249XCJzdGFydFwiYC5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlSGludHMoKSB7XG4gICAgaWYgKHRoaXMuX2hpbnRDaGlsZHJlbiAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgbGV0IHN0YXJ0SGludDogTWF0SGludDtcbiAgICAgIGxldCBlbmRIaW50OiBNYXRIaW50O1xuICAgICAgdGhpcy5faGludENoaWxkcmVuLmZvckVhY2goKGhpbnQ6IE1hdEhpbnQpID0+IHtcbiAgICAgICAgaWYgKGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIHtcbiAgICAgICAgICBpZiAoc3RhcnRIaW50IHx8IHRoaXMuaGludExhYmVsKSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yKCdzdGFydCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFydEhpbnQgPSBoaW50O1xuICAgICAgICB9IGVsc2UgaWYgKGhpbnQuYWxpZ24gPT09ICdlbmQnKSB7XG4gICAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ2VuZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbmRIaW50ID0gaGludDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGRlZmF1bHQgZmxvYXQgbGFiZWwgc3RhdGUuICovXG4gIHByaXZhdGUgX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuZmxvYXRMYWJlbCkgfHwgJ2F1dG8nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBkZXNjcmliZSB0aGUgY2hpbGQgY29udHJvbC4gVGhpcyBhbGxvd3MgdGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAqIGl0cyBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0Rlc2NyaWJlZEJ5SWRzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XG4gICAgICBsZXQgaWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IFJlbW92ZSB0aGUgdHlwZSBjaGVjayB3aGVuIHdlIGZpbmQgdGhlIHJvb3QgY2F1c2Ugb2YgdGhpcyBidWcuXG4gICAgICBpZiAodGhpcy5fY29udHJvbC51c2VyQXJpYURlc2NyaWJlZEJ5ICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLl9jb250cm9sLnVzZXJBcmlhRGVzY3JpYmVkQnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlkcy5wdXNoKC4uLnRoaXMuX2NvbnRyb2wudXNlckFyaWFEZXNjcmliZWRCeS5zcGxpdCgnICcpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2dldERpc3BsYXllZE1lc3NhZ2VzKCkgPT09ICdoaW50Jykge1xuICAgICAgICBjb25zdCBzdGFydEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gP1xuICAgICAgICAgICAgdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnc3RhcnQnKSA6IG51bGw7XG4gICAgICAgIGNvbnN0IGVuZEhpbnQgPSB0aGlzLl9oaW50Q2hpbGRyZW4gP1xuICAgICAgICAgICAgdGhpcy5faGludENoaWxkcmVuLmZpbmQoaGludCA9PiBoaW50LmFsaWduID09PSAnZW5kJykgOiBudWxsO1xuXG4gICAgICAgIGlmIChzdGFydEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChzdGFydEhpbnQuaWQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2hpbnRMYWJlbCkge1xuICAgICAgICAgIGlkcy5wdXNoKHRoaXMuX2hpbnRMYWJlbElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbmRIaW50KSB7XG4gICAgICAgICAgaWRzLnB1c2goZW5kSGludC5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZXJyb3JDaGlsZHJlbikge1xuICAgICAgICBpZHMucHVzaCguLi50aGlzLl9lcnJvckNoaWxkcmVuLm1hcChlcnJvciA9PiBlcnJvci5pZCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb250cm9sLnNldERlc2NyaWJlZEJ5SWRzKGlkcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZm9ybSBmaWVsZCdzIGNvbnRyb2wgaXMgbWlzc2luZy4gKi9cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpIHtcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2wgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgd2lkdGggYW5kIHBvc2l0aW9uIG9mIHRoZSBnYXAgaW4gdGhlIG91dGxpbmUuIE9ubHkgcmVsZXZhbnQgZm9yIHRoZSBvdXRsaW5lXG4gICAqIGFwcGVhcmFuY2UuXG4gICAqL1xuICB1cGRhdGVPdXRsaW5lR2FwKCkge1xuICAgIGNvbnN0IGxhYmVsRWwgPSB0aGlzLl9sYWJlbCA/IHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHRoaXMuYXBwZWFyYW5jZSAhPT0gJ291dGxpbmUnIHx8ICFsYWJlbEVsIHx8ICFsYWJlbEVsLmNoaWxkcmVuLmxlbmd0aCB8fFxuICAgICAgICAhbGFiZWxFbC50ZXh0Q29udGVudCEudHJpbSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpc24ndCBhdmFpbGFibGUgb24gdGhlIHNlcnZlci5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQgaW4gdGhlIERPTSwgdGhlIG91dGxpbmUgZ2FwIHdpbGwgbmVlZCB0byBiZSBjYWxjdWxhdGVkXG4gICAgLy8gdGhlIG5leHQgdGltZSBpdCBpcyBjaGVja2VkIGFuZCBpbiB0aGUgRE9NLlxuICAgIGlmICghdGhpcy5faXNBdHRhY2hlZFRvRE9NKCkpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRXaWR0aCA9IDA7XG4gICAgbGV0IGdhcFdpZHRoID0gMDtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdGFydEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1zdGFydCcpO1xuICAgIGNvbnN0IGdhcEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1nYXAnKTtcblxuICAgIGlmICh0aGlzLl9sYWJlbCAmJiB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8sIGl0IG1lYW5zIHRoYXQgdGhlIGVsZW1lbnQgaXNcbiAgICAgIC8vIGludmlzaWJsZSBhbmQgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSBvdXRsaW5lIGdhcC4gTWFyayB0aGUgZWxlbWVudCBhcyBuZWVkaW5nXG4gICAgICAvLyB0byBiZSBjaGVja2VkIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy4gV2UgY2FuJ3QgZG8gdGhpcyBpbW1lZGlhdGVseVxuICAgICAgLy8gb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiwgYmVjYXVzZSBldmVuIGlmIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSxcbiAgICAgIC8vIHRoZSBgQ2xpZW50UmVjdGAgd29uJ3QgYmUgcmVjbGFjdWxhdGVkIGltbWVkaWF0ZWx5LiBXZSByZXNldCB0aGVcbiAgICAgIC8vIGBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHlgIGZsYWcgc29tZSB3ZSBkb24ndCBydW4gdGhlIGNoZWNrcyB0d2ljZS5cbiAgICAgIGlmIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGNvbnRhaW5lclJlY3QpO1xuICAgICAgY29uc3QgbGFiZWxDaGlsZHJlbiA9IGxhYmVsRWwuY2hpbGRyZW47XG4gICAgICBjb25zdCBsYWJlbFN0YXJ0ID0gdGhpcy5fZ2V0U3RhcnRFbmQobGFiZWxDaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgICBsZXQgbGFiZWxXaWR0aCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFiZWxDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBsYWJlbFdpZHRoICs9IChsYWJlbENoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHN0YXJ0V2lkdGggPSBNYXRoLmFicyhsYWJlbFN0YXJ0IC0gY29udGFpbmVyU3RhcnQpIC0gb3V0bGluZUdhcFBhZGRpbmc7XG4gICAgICBnYXBXaWR0aCA9IGxhYmVsV2lkdGggPiAwID8gbGFiZWxXaWR0aCAqIGZsb2F0aW5nTGFiZWxTY2FsZSArIG91dGxpbmVHYXBQYWRkaW5nICogMiA6IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhcnRFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtzdGFydFdpZHRofXB4YDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYXBFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdhcEVsc1tpXS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgZW5kIG9mIHRoZSByZWN0IGNvbnNpZGVyaW5nIHRoZSBjdXJyZW50IGRpcmVjdGlvbmFsaXR5LiAqL1xuICBwcml2YXRlIF9nZXRTdGFydEVuZChyZWN0OiBDbGllbnRSZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSA/IHJlY3QucmlnaHQgOiByZWN0LmxlZnQ7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0gZmllbGQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cbiAgcHJpdmF0ZSBfaXNBdHRhY2hlZFRvRE9NKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKGVsZW1lbnQuZ2V0Um9vdE5vZGUpIHtcbiAgICAgIGNvbnN0IHJvb3ROb2RlID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSBET00gdGhlIHJvb3Qgbm9kZSB3aWxsIGJlIGVpdGhlciB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIG9yIHRoZSBjbG9zZXN0IHNoYWRvdyByb290LCBvdGhlcndpc2UgaXQnbGwgYmUgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgICAgcmV0dXJuIHJvb3ROb2RlICYmIHJvb3ROb2RlICE9PSBlbGVtZW50O1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gY2hlY2tpbmcgaWYgaXQncyBpbiB0aGUgZG9jdW1lbnQuIFRoaXMgZG9lc24ndCBhY2NvdW50IGZvclxuICAgIC8vIHNoYWRvdyBET00sIGhvd2V2ZXIgYnJvd3NlciB0aGF0IHN1cHBvcnQgc2hhZG93IERPTSBzaG91bGQgc3VwcG9ydCBgZ2V0Um9vdE5vZGVgIGFzIHdlbGwuXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuY29udGFpbnMoZWxlbWVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVJlcXVpcmVkTWFya2VyOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=