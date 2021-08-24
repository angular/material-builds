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
    constructor(elementRef, _changeDetectorRef, _dir, _defaults, _platform, _ngZone, _animationMode) {
        super(elementRef);
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
                template: "<div class=\"mat-form-field-wrapper\">\n  <div class=\"mat-form-field-flex\" #connectionContainer\n       (click)=\"_control.onContainerClick && _control.onContainerClick($event)\">\n\n    <!-- Outline used for outline appearance. -->\n    <ng-container *ngIf=\"appearance == 'outline'\">\n      <div class=\"mat-form-field-outline\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n      <div class=\"mat-form-field-outline mat-form-field-outline-thick\">\n        <div class=\"mat-form-field-outline-start\"></div>\n        <div class=\"mat-form-field-outline-gap\"></div>\n        <div class=\"mat-form-field-outline-end\"></div>\n      </div>\n    </ng-container>\n\n    <div class=\"mat-form-field-prefix\" *ngIf=\"_prefixChildren.length\">\n      <ng-content select=\"[matPrefix]\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-infix\" #inputContainer>\n      <ng-content></ng-content>\n\n      <span class=\"mat-form-field-label-wrapper\">\n        <!-- We add aria-owns as a workaround for an issue in JAWS & NVDA where the label isn't\n             read if it comes before the control in the DOM. -->\n        <label class=\"mat-form-field-label\"\n               (cdkObserveContent)=\"updateOutlineGap()\"\n               [cdkObserveContentDisabled]=\"appearance != 'outline'\"\n               [id]=\"_labelId\"\n               [attr.for]=\"_control.id\"\n               [attr.aria-owns]=\"_control.id\"\n               [class.mat-empty]=\"_control.empty && !_shouldAlwaysFloat()\"\n               [class.mat-form-field-empty]=\"_control.empty && !_shouldAlwaysFloat()\"\n               [class.mat-accent]=\"color == 'accent'\"\n               [class.mat-warn]=\"color == 'warn'\"\n               #label\n               *ngIf=\"_hasFloatingLabel()\"\n               [ngSwitch]=\"_hasLabel()\">\n\n          <!-- @breaking-change 8.0.0 remove in favor of mat-label element an placeholder attr. -->\n          <ng-container *ngSwitchCase=\"false\">\n            <ng-content select=\"mat-placeholder\"></ng-content>\n            <span>{{_control.placeholder}}</span>\n          </ng-container>\n\n          <ng-content select=\"mat-label\" *ngSwitchCase=\"true\"></ng-content>\n\n          <!-- @breaking-change 8.0.0 remove `mat-placeholder-required` class -->\n          <span\n            class=\"mat-placeholder-required mat-form-field-required-marker\"\n            aria-hidden=\"true\"\n            *ngIf=\"!hideRequiredMarker && _control.required && !_control.disabled\">&#32;*</span>\n        </label>\n      </span>\n    </div>\n\n    <div class=\"mat-form-field-suffix\" *ngIf=\"_suffixChildren.length\">\n      <ng-content select=\"[matSuffix]\"></ng-content>\n    </div>\n  </div>\n\n  <!-- Underline used for legacy, standard, and box appearances. -->\n  <div class=\"mat-form-field-underline\"\n       *ngIf=\"appearance != 'outline'\">\n    <span class=\"mat-form-field-ripple\"\n          [class.mat-accent]=\"color == 'accent'\"\n          [class.mat-warn]=\"color == 'warn'\"></span>\n  </div>\n\n  <div class=\"mat-form-field-subscript-wrapper\"\n       [ngSwitch]=\"_getDisplayedMessages()\">\n    <div *ngSwitchCase=\"'error'\" [@transitionMessages]=\"_subscriptAnimationState\">\n      <ng-content select=\"mat-error\"></ng-content>\n    </div>\n\n    <div class=\"mat-form-field-hint-wrapper\" *ngSwitchCase=\"'hint'\"\n      [@transitionMessages]=\"_subscriptAnimationState\">\n      <!-- TODO(mmalerba): use an actual <mat-hint> once all selectors are switched to mat-* -->\n      <div *ngIf=\"hintLabel\" [id]=\"_hintLabelId\" class=\"mat-hint\">{{hintLabel}}</div>\n      <ng-content select=\"mat-hint:not([align='end'])\"></ng-content>\n      <div class=\"mat-form-field-hint-spacer\"></div>\n      <ng-content select=\"mat-hint[align='end']\"></ng-content>\n    </div>\n  </div>\n</div>\n",
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
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:none;transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field-hint-end{order:1}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}.cdk-high-contrast-active .mat-form-field-appearance-fill.mat-focused .mat-form-field-flex{outline:dashed 3px}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-ripple{height:0}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit;box-sizing:content-box}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date],.mat-input-element[type=datetime],.mat-input-element[type=datetime-local],.mat-input-element[type=month],.mat-input-element[type=week],.mat-input-element[type=time]{line-height:1}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{opacity:0}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}.mat-focused .cdk-high-contrast-active select.mat-input-element::-ms-value{color:inherit}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.cdk-high-contrast-active .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick{border:3px dashed}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n"]
            },] }
];
MatFormField.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxVQUFVLEdBQ1gsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFDLFNBQVMsRUFBVyxNQUFNLFNBQVMsQ0FBQztBQUM1QyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLGtDQUFrQyxFQUNsQyx1Q0FBdUMsR0FDeEMsTUFBTSxxQkFBcUIsQ0FBQztBQUM3QixPQUFPLEVBQUMsU0FBUyxFQUFVLE1BQU0sUUFBUSxDQUFDO0FBQzFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFZLE1BQU0sVUFBVSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxVQUFVLEVBQVksTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBRS9DLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUNyQixNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUNoQyxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUc1Qjs7O0dBR0c7QUFDSCxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQztJQUNuQyxZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0MsRUFBRSxTQUFTLENBQUMsQ0FBQztBQXNCZDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FDdkMsSUFBSSxjQUFjLENBQTZCLGdDQUFnQyxDQUFDLENBQUM7QUFFckY7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBZSxjQUFjLENBQUMsQ0FBQztBQUUvRSxxRkFBcUY7QUFnRHJGLE1BQU0sT0FBTyxZQUFhLFNBQVEsaUJBQWlCO0lBaUhqRCxZQUNJLFVBQXNCLEVBQVUsa0JBQXFDLEVBQ2pELElBQW9CLEVBQ29CLFNBQzlCLEVBQVUsU0FBbUIsRUFBVSxPQUFlLEVBQ3pDLGNBQXNCO1FBQ25FLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUxnQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ2pELFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ29CLGNBQVMsR0FBVCxTQUFTLENBQ3ZDO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFsSHhGOzs7V0FHRztRQUNLLDRDQUF1QyxHQUFHLEtBQUssQ0FBQztRQUV4RCx3RkFBd0Y7UUFDaEYseUNBQW9DLEdBQUcsS0FBSyxDQUFDO1FBRXBDLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBd0JsRCxpRkFBaUY7UUFDekUsdUJBQWtCLEdBQUcsS0FBSyxDQUFDO1FBVW5DLHNEQUFzRDtRQUN0RCw2QkFBd0IsR0FBVyxFQUFFLENBQUM7UUFTOUIsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUV4QixnQ0FBZ0M7UUFDdkIsaUJBQVksR0FBVyxZQUFZLFlBQVksRUFBRSxFQUFFLENBQUM7UUFFN0QsbUNBQW1DO1FBQzFCLGFBQVEsR0FBRyx3QkFBd0IsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQTBEM0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsY0FBYyxLQUFLLGdCQUFnQixDQUFDO1FBRTlELHlFQUF5RTtRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3hGLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM1RSxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDO0lBbEhELHVDQUF1QztJQUN2QyxJQUNJLFVBQVUsS0FBNkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNyRSxJQUFJLFVBQVUsQ0FBQyxLQUE2QjtRQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRWxDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FBQztRQUV0RixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDeEQsSUFBSSxDQUFDLG9DQUFvQyxHQUFHLElBQUksQ0FBQztTQUNsRDtJQUNILENBQUM7SUFHRCxvREFBb0Q7SUFDcEQsSUFDSSxrQkFBa0IsS0FBYyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDdEUsSUFBSSxrQkFBa0IsQ0FBQyxLQUFjO1FBQ25DLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBTUQsNkRBQTZEO0lBQzdELGtCQUFrQjtRQUNoQixPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2xFLENBQUM7SUFFRCwwQ0FBMEM7SUFDMUMsY0FBYyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBS2pFLG9DQUFvQztJQUNwQyxJQUNJLFNBQVMsS0FBYSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25ELElBQUksU0FBUyxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFTRDs7Ozs7OztPQU9HO0lBQ0gsSUFDSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ2xHLENBQUM7SUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFxQjtRQUNsQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQzlELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFZRCxJQUFJLFFBQVE7UUFDVix1RkFBdUY7UUFDdkYsNkRBQTZEO1FBQzdELE9BQU8sSUFBSSxDQUFDLHlCQUF5QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ3pGLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7SUFDekMsQ0FBQztJQTZCRDs7T0FFRztJQUNILFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlCQUF5QjtRQUN2QixPQUFPLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFELENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFN0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUU5QixJQUFJLE9BQU8sQ0FBQyxXQUFXLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDNUY7UUFFRCx3RkFBd0Y7UUFDeEYsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN4RCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWTtpQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ2hDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztTQUM1RDtRQUVELCtEQUErRDtRQUMvRCx5REFBeUQ7UUFDekQsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDcEUsSUFBSSxJQUFJLENBQUMsb0NBQW9DLEVBQUU7b0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN6QjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCwrRUFBK0U7UUFDL0UsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUMvRSxJQUFJLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDO1lBQ2pELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM5RCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBRUgsa0VBQWtFO1FBQ2xFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQy9ELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDL0QsSUFBSSxPQUFPLHFCQUFxQixLQUFLLFVBQVUsRUFBRTtvQkFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7d0JBQ2xDLHFCQUFxQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7b0JBQ3ZELENBQUMsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNO29CQUNMLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN6QjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLHVDQUF1QyxFQUFFO1lBQ2hELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLE9BQU8sQ0FBQztRQUN4QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELDZGQUE2RjtJQUM3RixjQUFjLENBQUMsSUFBcUI7UUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRSxPQUFPLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCx1QkFBdUI7UUFDckIsd0ZBQXdGO1FBQ3hGLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3BELElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRCxpQkFBaUI7UUFDZix3RkFBd0Y7UUFDeEYsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3BGLENBQUM7SUFFRCxxREFBcUQ7SUFDckQscUJBQXFCO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDbkQsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxvQkFBb0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDckQsdURBQXVEO1lBQ3ZELCtDQUErQztZQUMvQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUMxQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO2dCQUUvQixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7b0JBQ2pGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0sscUJBQXFCO1FBQzNCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGlCQUFpQjtZQUNyRCxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUNqRCxNQUFNLHVDQUF1QyxFQUFFLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQsMEVBQTBFO0lBQ2xFLGFBQWE7UUFDbkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSyxjQUFjO1FBQ3BCLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUN6RSxJQUFJLFNBQWtCLENBQUM7WUFDdkIsSUFBSSxPQUFnQixDQUFDO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBYSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUU7b0JBQzFCLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7d0JBQy9CLE1BQU0sa0NBQWtDLENBQUMsT0FBTyxDQUFDLENBQUM7cUJBQ25EO29CQUNELFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2xCO3FCQUFNLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUU7b0JBQy9CLElBQUksT0FBTyxFQUFFO3dCQUNYLE1BQU0sa0NBQWtDLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQ2pEO29CQUNELE9BQU8sR0FBRyxJQUFJLENBQUM7aUJBQ2hCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCwwQ0FBMEM7SUFDbEMsMEJBQTBCO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksTUFBTSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSyxtQkFBbUI7UUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztZQUV2QixxRkFBcUY7WUFDckYsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQjtnQkFDbkMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsRUFBRTtnQkFDdkQsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDM0Q7WUFFRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLE1BQU0sRUFBRTtnQkFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFFakUsSUFBSSxTQUFTLEVBQUU7b0JBQ2IsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ3hCO3FCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDMUIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzdCO2dCQUVELElBQUksT0FBTyxFQUFFO29CQUNYLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUN0QjthQUNGO2lCQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVELDhEQUE4RDtJQUNwRCxxQkFBcUI7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7WUFDckUsTUFBTSxrQ0FBa0MsRUFBRSxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQjtRQUNkLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFL0QsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTTtZQUNyRSxDQUFDLE9BQU8sQ0FBQyxXQUFZLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQzdCLHVEQUF1RDtZQUN2RCxPQUFPO1NBQ1I7UUFDRCx1RkFBdUY7UUFDdkYsOENBQThDO1FBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsdUNBQXVDLEdBQUcsSUFBSSxDQUFDO1lBQ3BELE9BQU87U0FDUjtRQUVELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFakIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGFBQWEsQ0FBQztRQUM3RCxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUM3RSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUV6RSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUM1RCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUV4RCw2RUFBNkU7WUFDN0UsZ0ZBQWdGO1lBQ2hGLGdGQUFnRjtZQUNoRiw2RUFBNkU7WUFDN0UsbUVBQW1FO1lBQ25FLHFGQUFxRjtZQUNyRixJQUFJLGFBQWEsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMzRCxJQUFJLENBQUMsb0NBQW9DLEdBQUcsSUFBSSxDQUFDO2dCQUNqRCxJQUFJLENBQUMsdUNBQXVDLEdBQUcsS0FBSyxDQUFDO2dCQUNyRCxPQUFPO2FBQ1I7WUFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDdkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO1lBQy9FLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztZQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsVUFBVSxJQUFLLGFBQWEsQ0FBQyxDQUFDLENBQWlCLENBQUMsV0FBVyxDQUFDO2FBQzdEO1lBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO1lBQ3ZFLFFBQVEsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsa0JBQWtCLEdBQUcsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekY7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLFVBQVUsSUFBSSxDQUFDO1NBQzdDO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxRQUFRLElBQUksQ0FBQztTQUN6QztRQUVELElBQUksQ0FBQyxvQ0FBb0M7WUFDckMsSUFBSSxDQUFDLHVDQUF1QyxHQUFHLEtBQUssQ0FBQztJQUMzRCxDQUFDO0lBRUQsNkVBQTZFO0lBQ3JFLFlBQVksQ0FBQyxJQUFnQjtRQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzRSxDQUFDO0lBRUQsNERBQTREO0lBQ3BELGdCQUFnQjtRQUN0QixNQUFNLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFFNUQsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFO1lBQ3ZCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2Qyw2RUFBNkU7WUFDN0UscUVBQXFFO1lBQ3JFLE9BQU8sUUFBUSxJQUFJLFFBQVEsS0FBSyxPQUFPLENBQUM7U0FDekM7UUFFRCxvRkFBb0Y7UUFDcEYsNEZBQTRGO1FBQzVGLE9BQU8sUUFBUSxDQUFDLGVBQWdCLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELENBQUM7OztZQTFmRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLDA1SEFBOEI7Z0JBWTlCLFVBQVUsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDO2dCQUN2RCxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLGdCQUFnQjtvQkFDekIsNENBQTRDLEVBQUUsMEJBQTBCO29CQUN4RSx3Q0FBd0MsRUFBRSxzQkFBc0I7b0JBQ2hFLDJDQUEyQyxFQUFFLHlCQUF5QjtvQkFDdEUsMENBQTBDLEVBQUUsd0JBQXdCO29CQUNwRSxnQ0FBZ0MsRUFBRSxxQkFBcUI7b0JBQ3ZELGtDQUFrQyxFQUFFLGtCQUFrQjtvQkFDdEQscUNBQXFDLEVBQUUscUJBQXFCO29CQUM1RCxrQ0FBa0MsRUFBRSxxQkFBcUI7b0JBQ3pELHlDQUF5QyxFQUFFLDJCQUEyQjtvQkFDdEUsaUNBQWlDLEVBQUUsbUJBQW1CO29CQUN0RCxtQ0FBbUMsRUFBRSxxQkFBcUI7b0JBQzFELHFCQUFxQixFQUFFLGtCQUFrQjtvQkFDekMsc0JBQXNCLEVBQUUsNkJBQTZCO29CQUNyRCxvQkFBb0IsRUFBRSwyQkFBMkI7b0JBQ2pELHFCQUFxQixFQUFFLDRCQUE0QjtvQkFDbkQsa0JBQWtCLEVBQUUseUJBQXlCO29CQUM3QyxrQkFBa0IsRUFBRSx5QkFBeUI7b0JBQzdDLG9CQUFvQixFQUFFLDJCQUEyQjtvQkFDakQsb0JBQW9CLEVBQUUsMkJBQTJCO29CQUNqRCxpQ0FBaUMsRUFBRSxxQkFBcUI7aUJBQ3pEO2dCQUNELE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDakIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUM7aUJBQ3JEOzthQUNGOzs7WUFoSUMsVUFBVTtZQUpWLGlCQUFpQjtZQVBYLGNBQWMsdUJBZ1FmLFFBQVE7NENBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyw4QkFBOEI7WUF4TmhELFFBQVE7WUExQmQsTUFBTTt5Q0FvUEQsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt5QkF2RzVDLEtBQUs7aUNBY0wsS0FBSzt3QkFzQkwsS0FBSzt5QkFzQkwsS0FBSztzQ0FlTCxTQUFTLFNBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2lDQUMvQyxTQUFTLFNBQUMsZ0JBQWdCO3FCQUMxQixTQUFTLFNBQUMsT0FBTztnQ0FFakIsWUFBWSxTQUFDLG1CQUFtQjs2QkFDaEMsWUFBWSxTQUFDLG1CQUFtQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzttQ0FXaEQsWUFBWSxTQUFDLFFBQVE7Z0NBQ3JCLFlBQVksU0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dDQUNyQyxZQUFZLFNBQUMsY0FBYzs2QkFFM0IsZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7NEJBQzlDLGVBQWUsU0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzhCQUM5QyxlQUFlLFNBQUMsVUFBVSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs4QkFDL0MsZUFBZSxTQUFDLFVBQVUsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBtaXhpbkNvbG9yLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01BVF9FUlJPUiwgTWF0RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHttYXRGb3JtRmllbGRBbmltYXRpb25zfSBmcm9tICcuL2Zvcm0tZmllbGQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2x9IGZyb20gJy4vZm9ybS1maWVsZC1jb250cm9sJztcbmltcG9ydCB7XG4gIGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcixcbn0gZnJvbSAnLi9mb3JtLWZpZWxkLWVycm9ycyc7XG5pbXBvcnQge19NQVRfSElOVCwgTWF0SGludH0gZnJvbSAnLi9oaW50JztcbmltcG9ydCB7TWF0TGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtNYXRQbGFjZWhvbGRlcn0gZnJvbSAnLi9wbGFjZWhvbGRlcic7XG5pbXBvcnQge01BVF9QUkVGSVgsIE1hdFByZWZpeH0gZnJvbSAnLi9wcmVmaXgnO1xuaW1wb3J0IHtNQVRfU1VGRklYLCBNYXRTdWZmaXh9IGZyb20gJy4vc3VmZml4JztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5jb25zdCBmbG9hdGluZ0xhYmVsU2NhbGUgPSAwLjc1O1xuY29uc3Qgb3V0bGluZUdhcFBhZGRpbmcgPSA1O1xuXG5cbi8qKlxuICogQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRGb3JtRmllbGQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IF9NYXRGb3JtRmllbGRCYXNlID0gbWl4aW5Db2xvcihjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn0sICdwcmltYXJ5Jyk7XG5cbi8qKiBQb3NzaWJsZSBhcHBlYXJhbmNlIHN0eWxlcyBmb3IgdGhlIGZvcm0gZmllbGQuICovXG5leHBvcnQgdHlwZSBNYXRGb3JtRmllbGRBcHBlYXJhbmNlID0gJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuXG4vKiogUG9zc2libGUgdmFsdWVzIGZvciB0aGUgXCJmbG9hdExhYmVsXCIgZm9ybS1maWVsZCBpbnB1dC4gKi9cbmV4cG9ydCB0eXBlIEZsb2F0TGFiZWxUeXBlID0gJ2Fsd2F5cycgfCAnbmV2ZXInIHwgJ2F1dG8nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGZvcm0gZmllbGQgdGhhdCBjYW4gYmUgY29uZmlndXJlZFxuICogdXNpbmcgdGhlIGBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucyB7XG4gIGFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuICBoaWRlUmVxdWlyZWRNYXJrZXI/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgZm9yIGZvcm0tZmllbGRzIHNob3VsZCBieSBkZWZhdWx0IGZsb2F0IGBhbHdheXNgLFxuICAgKiBgbmV2ZXJgLCBvciBgYXV0b2AgKG9ubHkgd2hlbiBuZWNlc3NhcnkpLlxuICAgKi9cbiAgZmxvYXRMYWJlbD86IEZsb2F0TGFiZWxUeXBlO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGVcbiAqIGRlZmF1bHQgb3B0aW9ucyBmb3IgYWxsIGZvcm0gZmllbGQgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zPignTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TJyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gaW5qZWN0IGFuIGluc3RhbmNlcyBvZiBgTWF0Rm9ybUZpZWxkYC4gSXQgc2VydmVzXG4gKiBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRGb3JtRmllbGRgIGNsYXNzIHdoaWNoIHdvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGBNYXRGb3JtRmllbGRgIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTEQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkPignTWF0Rm9ybUZpZWxkJyk7XG5cbi8qKiBDb250YWluZXIgZm9yIGZvcm0gY29udHJvbHMgdGhhdCBhcHBsaWVzIE1hdGVyaWFsIERlc2lnbiBzdHlsaW5nIGFuZCBiZWhhdmlvci4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1mb3JtLWZpZWxkJyxcbiAgZXhwb3J0QXM6ICdtYXRGb3JtRmllbGQnLFxuICB0ZW1wbGF0ZVVybDogJ2Zvcm0tZmllbGQuaHRtbCcsXG4gIC8vIE1hdElucHV0IGlzIGEgZGlyZWN0aXZlIGFuZCBjYW4ndCBoYXZlIHN0eWxlcywgc28gd2UgbmVlZCB0byBpbmNsdWRlIGl0cyBzdHlsZXMgaGVyZVxuICAvLyBpbiBmb3JtLWZpZWxkLWlucHV0LmNzcy4gVGhlIE1hdElucHV0IHN0eWxlcyBhcmUgZmFpcmx5IG1pbmltYWwgc28gaXQgc2hvdWxkbid0IGJlIGFcbiAgLy8gYmlnIGRlYWwgZm9yIHBlb3BsZSB3aG8gYXJlbid0IHVzaW5nIE1hdElucHV0LlxuICBzdHlsZVVybHM6IFtcbiAgICAnZm9ybS1maWVsZC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWZpbGwuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1pbnB1dC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWxlZ2FjeS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLW91dGxpbmUuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1zdGFuZGFyZC5jc3MnLFxuICBdLFxuICBhbmltYXRpb25zOiBbbWF0Rm9ybUZpZWxkQW5pbWF0aW9ucy50cmFuc2l0aW9uTWVzc2FnZXNdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb3JtLWZpZWxkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtZmlsbF0nOiAnYXBwZWFyYW5jZSA9PSBcImZpbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLW91dGxpbmVdJzogJ2FwcGVhcmFuY2UgPT0gXCJvdXRsaW5lXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1sZWdhY3ldJzogJ2FwcGVhcmFuY2UgPT0gXCJsZWdhY3lcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1pbnZhbGlkXSc6ICdfY29udHJvbC5lcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWNhbi1mbG9hdF0nOiAnX2NhbkxhYmVsRmxvYXQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXRdJzogJ19zaG91bGRMYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsXSc6ICdfaGFzRmxvYXRpbmdMYWJlbCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpZGUtcGxhY2Vob2xkZXJdJzogJ19oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtZGlzYWJsZWRdJzogJ19jb250cm9sLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWRdJzogJ19jb250cm9sLmF1dG9maWxsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvY3VzZWRdJzogJ19jb250cm9sLmZvY3VzZWQnLFxuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInVudG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ19zaG91bGRGb3J3YXJkKFwicHJpc3RpbmVcIiknLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ19zaG91bGRGb3J3YXJkKFwiZGlydHlcIiknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwidmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJpbnZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ19zaG91bGRGb3J3YXJkKFwicGVuZGluZ1wiKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnIV9hbmltYXRpb25zRW5hYmxlZCcsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9GT1JNX0ZJRUxELCB1c2VFeGlzdGluZzogTWF0Rm9ybUZpZWxkfSxcbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZCBleHRlbmRzIF9NYXRGb3JtRmllbGRCYXNlXG4gICAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkNvbG9yIHtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZFxuICAgKiBpbW1lZGlhdGVseSBvbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgbmV4dCB0aW1lIHRoZSB6b25lIGhhcyBzdGFiaWxpemVkLiAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBmb3JtLWZpZWxkIGFwcGVhcmFuY2Ugc3R5bGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgeyByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTsgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuYXBwZWFyYW5jZSkgfHwgJ2xlZ2FjeSc7XG5cbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSA9PT0gJ291dGxpbmUnICYmIG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgcmVxdWlyZWQgbWFya2VyIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUmVxdWlyZWRNYXJrZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXI7IH1cbiAgc2V0IGhpZGVSZXF1aXJlZE1hcmtlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGxvZ2ljIHRoYXQgZGlzYWJsZXMgdGhlIGxhYmVsIGFuaW1hdGlvbiBpbiBjZXJ0YWluIGNhc2VzLiAqL1xuICBwcml2YXRlIF9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBmbG9hdGluZyBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0IG9yIG5vdC4gKi9cbiAgX3Nob3VsZEFsd2F5c0Zsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZsb2F0TGFiZWwgPT09ICdhbHdheXMnICYmICF0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBjYW4gZmxvYXQgb3Igbm90LiAqL1xuICBfY2FuTGFiZWxGbG9hdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCAhPT0gJ25ldmVyJzsgfVxuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgbWF0LWhpbnQgYW5kIG1hdC1lcnJvciBhbmltYXRpb25zLiAqL1xuICBfc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGU6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBUZXh0IGZvciB0aGUgZm9ybSBmaWVsZCBoaW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGludExhYmVsKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9oaW50TGFiZWw7IH1cbiAgc2V0IGhpbnRMYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faGludExhYmVsID0gdmFsdWU7XG4gICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGludExhYmVsID0gJyc7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaGludCBsYWJlbC5cbiAgcmVhZG9ubHkgX2hpbnRMYWJlbElkOiBzdHJpbmcgPSBgbWF0LWhpbnQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGxhYmVsIGVsZW1lbnQuXG4gIHJlYWRvbmx5IF9sYWJlbElkID0gYG1hdC1mb3JtLWZpZWxkLWxhYmVsLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCwgbmV2ZXIgZmxvYXQgb3IgZmxvYXQgYXMgdGhlIHVzZXIgdHlwZXMuXG4gICAqXG4gICAqIE5vdGU6IG9ubHkgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHN1cHBvcnRzIHRoZSBgbmV2ZXJgIG9wdGlvbi4gYG5ldmVyYCB3YXMgb3JpZ2luYWxseSBhZGRlZCBhcyBhXG4gICAqIHdheSB0byBtYWtlIHRoZSBmbG9hdGluZyBsYWJlbCBlbXVsYXRlIHRoZSBiZWhhdmlvciBvZiBhIHN0YW5kYXJkIGlucHV0IHBsYWNlaG9sZGVyLiBIb3dldmVyXG4gICAqIHRoZSBmb3JtIGZpZWxkIG5vdyBzdXBwb3J0cyBib3RoIGZsb2F0aW5nIGxhYmVscyBhbmQgcGxhY2Vob2xkZXJzLiBUaGVyZWZvcmUgaW4gdGhlIG5vbi1sZWdhY3lcbiAgICogYXBwZWFyYW5jZXMgdGhlIGBuZXZlcmAgb3B0aW9uIGhhcyBiZWVuIGRpc2FibGVkIGluIGZhdm9yIG9mIGp1c3QgdXNpbmcgdGhlIHBsYWNlaG9sZGVyLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGZsb2F0TGFiZWwoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgIT09ICdsZWdhY3knICYmIHRoaXMuX2Zsb2F0TGFiZWwgPT09ICduZXZlcicgPyAnYXV0bycgOiB0aGlzLl9mbG9hdExhYmVsO1xuICB9XG4gIHNldCBmbG9hdExhYmVsKHZhbHVlOiBGbG9hdExhYmVsVHlwZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZmxvYXRMYWJlbCkge1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCA9IHZhbHVlIHx8IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9mbG9hdExhYmVsOiBGbG9hdExhYmVsVHlwZTtcblxuICAvKiogV2hldGhlciB0aGUgQW5ndWxhciBhbmltYXRpb25zIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgQFZpZXdDaGlsZCgnY29ubmVjdGlvbkNvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfY29ubmVjdGlvbkNvbnRhaW5lclJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRDb250YWluZXInKSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgcHJpdmF0ZSBfbGFiZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCkgX2NvbnRyb2xOb25TdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sLCB7c3RhdGljOiB0cnVlfSkgX2NvbnRyb2xTdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgZ2V0IF9jb250cm9sKCkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBuZWVkIHRoaXMgd29ya2Fyb3VuZCBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAgIC8vICBXZSBzaG91bGQgY2xlYW4gdGhpcyB1cCBvbmNlIEl2eSBpcyB0aGUgZGVmYXVsdCByZW5kZXJlci5cbiAgICByZXR1cm4gdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sIHx8IHRoaXMuX2NvbnRyb2xOb25TdGF0aWMgfHwgdGhpcy5fY29udHJvbFN0YXRpYztcbiAgfVxuICBzZXQgX2NvbnRyb2wodmFsdWUpIHtcbiAgICB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2w6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcblxuICBAQ29udGVudENoaWxkKE1hdExhYmVsKSBfbGFiZWxDaGlsZE5vblN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwsIHtzdGF0aWM6IHRydWV9KSBfbGFiZWxDaGlsZFN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcblxuICBAQ29udGVudENoaWxkcmVuKE1BVF9FUlJPUiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oX01BVF9ISU5ULCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX1BSRUZJWCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfU1VGRklYLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3VmZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRTdWZmaXg+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TKSBwcml2YXRlIF9kZWZhdWx0czpcbiAgICAgICAgICBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucywgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBfYW5pbWF0aW9uTW9kZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLmZsb2F0TGFiZWwgPSB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgPSBfYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCB0aHJvdWdoIGhlcmUgc28gd2UgaW52b2tlIHRoZSBzZXR0ZXIgb24gdGhlIGZpcnN0IHJ1bi5cbiAgICB0aGlzLmFwcGVhcmFuY2UgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5hcHBlYXJhbmNlKSA/IF9kZWZhdWx0cy5hcHBlYXJhbmNlIDogJ2xlZ2FjeSc7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gKF9kZWZhdWx0cyAmJiBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyICE9IG51bGwpID9cbiAgICAgICAgX2RlZmF1bHRzLmhpZGVSZXF1aXJlZE1hcmtlciA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlkIG9mIHRoZSBsYWJlbCBlbGVtZW50LiBJZiBubyBsYWJlbCBpcyBwcmVzZW50LCByZXR1cm5zIGBudWxsYC5cbiAgICovXG4gIGdldExhYmVsSWQoKTogc3RyaW5nfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgPyB0aGlzLl9sYWJlbElkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIEVsZW1lbnRSZWYgZm9yIHRoZSBlbGVtZW50IHRoYXQgYSBvdmVybGF5IGF0dGFjaGVkIHRvIHRoZSBmb3JtLWZpZWxkIHNob3VsZCBiZVxuICAgKiBwb3NpdGlvbmVkIHJlbGF0aXZlIHRvLlxuICAgKi9cbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbkNvbnRhaW5lclJlZiB8fCB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG5cbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5fY29udHJvbDtcblxuICAgIGlmIChjb250cm9sLmNvbnRyb2xUeXBlKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWZvcm0tZmllbGQtdHlwZS0ke2NvbnRyb2wuY29udHJvbFR5cGV9YCk7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIGNoaWxkIGNvbnRyb2wgc3RhdGUgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZSBmb3JtIGZpZWxkIFVJLlxuICAgIGNvbnRyb2wuc3RhdGVDaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBpZiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICBpZiAoY29udHJvbC5uZ0NvbnRyb2wgJiYgY29udHJvbC5uZ0NvbnRyb2wudmFsdWVDaGFuZ2VzKSB7XG4gICAgICBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXNcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB3ZSBoYXZlIHRvIHJ1biBvdXRzaWRlIG9mIHRoZSBgTmdab25lYCBleHBsaWNpdGx5LFxuICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIHRocm93aW5nIHVzZXJzIGludG8gYW4gaW5maW5pdGUgbG9vcFxuICAgIC8vIGlmIGB6b25lLXBhdGNoLXJ4anNgIGlzIGluY2x1ZGVkLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gYW5kIHVwZGF0ZSB0aGUgb3V0bGluZSBpZiB0aGUgc3VmZml4IG9yIHByZWZpeCBjaGFuZ2VzLlxuICAgIG1lcmdlKHRoaXMuX3ByZWZpeENoaWxkcmVuLmNoYW5nZXMsIHRoaXMuX3N1ZmZpeENoaWxkcmVuLmNoYW5nZXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJlLXZhbGlkYXRlIHdoZW4gdGhlIG51bWJlciBvZiBoaW50cyBjaGFuZ2VzLlxuICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJpYS1kZXNjcmliZWQgYnkgd2hlbiB0aGUgbnVtYmVyIG9mIGVycm9ycyBjaGFuZ2VzLlxuICAgIHRoaXMuX2Vycm9yQ2hpbGRyZW4uY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuICAgIGlmICh0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSkge1xuICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEF2b2lkIGFuaW1hdGlvbnMgb24gbG9hZC5cbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBjbGFzcyBmcm9tIHRoZSBOZ0NvbnRyb2wgc2hvdWxkIGJlIGZvcndhcmRlZCB0byB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfc2hvdWxkRm9yd2FyZChwcm9wOiBrZXlvZiBOZ0NvbnRyb2wpOiBib29sZWFuIHtcbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9jb250cm9sID8gdGhpcy5fY29udHJvbC5uZ0NvbnRyb2wgOiBudWxsO1xuICAgIHJldHVybiBuZ0NvbnRyb2wgJiYgbmdDb250cm9sW3Byb3BdO1xuICB9XG5cbiAgX2hhc1BsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiAhISh0aGlzLl9jb250cm9sICYmIHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgfHwgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCk7XG4gIH1cblxuICBfaGFzTGFiZWwoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYyk7XG4gIH1cblxuICBfc2hvdWxkTGFiZWxGbG9hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2FuTGFiZWxGbG9hdCgpICYmXG4gICAgICAgICgodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnNob3VsZExhYmVsRmxvYXQpIHx8IHRoaXMuX3Nob3VsZEFsd2F5c0Zsb2F0KCkpO1xuICB9XG5cbiAgX2hpZGVDb250cm9sUGxhY2Vob2xkZXIoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgPT09ICdsZWdhY3knICYmICF0aGlzLl9oYXNMYWJlbCgpIHx8XG4gICAgICAgIHRoaXMuX2hhc0xhYmVsKCkgJiYgIXRoaXMuX3Nob3VsZExhYmVsRmxvYXQoKTtcbiAgfVxuXG4gIF9oYXNGbG9hdGluZ0xhYmVsKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gdGhpcy5faGFzTGFiZWwoKSB8fCB0aGlzLmFwcGVhcmFuY2UgPT09ICdsZWdhY3knICYmIHRoaXMuX2hhc1BsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGRpc3BsYXkgaGludHMgb3IgZXJyb3JzLiAqL1xuICBfZ2V0RGlzcGxheWVkTWVzc2FnZXMoKTogJ2Vycm9yJyB8ICdoaW50JyB7XG4gICAgcmV0dXJuICh0aGlzLl9lcnJvckNoaWxkcmVuICYmIHRoaXMuX2Vycm9yQ2hpbGRyZW4ubGVuZ3RoID4gMCAmJlxuICAgICAgICB0aGlzLl9jb250cm9sLmVycm9yU3RhdGUpID8gJ2Vycm9yJyA6ICdoaW50JztcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgcGxhY2Vob2xkZXIgdXAgYW5kIGxvY2tzIGl0IGluIHBvc2l0aW9uLiAqL1xuICBfYW5pbWF0ZUFuZExvY2tMYWJlbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faGFzRmxvYXRpbmdMYWJlbCgpICYmIHRoaXMuX2NhbkxhYmVsRmxvYXQoKSkge1xuICAgICAgLy8gSWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQsIHdlIHNob3VsZG4ndCBnbyBpbiBoZXJlLFxuICAgICAgLy8gYmVjYXVzZSB0aGUgYHRyYW5zaXRpb25lbmRgIHdpbGwgbmV2ZXIgZmlyZS5cbiAgICAgIGlmICh0aGlzLl9hbmltYXRpb25zRW5hYmxlZCAmJiB0aGlzLl9sYWJlbCkge1xuICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IHRydWU7XG5cbiAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJykucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZsb2F0TGFiZWwgPSAnYWx3YXlzJztcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBvbmx5IG9uZSBwbGFjZWhvbGRlciAoZWl0aGVyIGBwbGFjZWhvbGRlcmAgYXR0cmlidXRlIG9uIHRoZSBjaGlsZCBjb250cm9sXG4gICAqIG9yIGNoaWxkIGVsZW1lbnQgd2l0aCB0aGUgYG1hdC1wbGFjZWhvbGRlcmAgZGlyZWN0aXZlKS5cbiAgICovXG4gIHByaXZhdGUgX3ZhbGlkYXRlUGxhY2Vob2xkZXJzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyICYmIHRoaXMuX3BsYWNlaG9sZGVyQ2hpbGQgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRQbGFjZWhvbGRlckNvbmZsaWN0RXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9lcyBhbnkgZXh0cmEgcHJvY2Vzc2luZyB0aGF0IGlzIHJlcXVpcmVkIHdoZW4gaGFuZGxpbmcgdGhlIGhpbnRzLiAqL1xuICBwcml2YXRlIF9wcm9jZXNzSGludHMoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVIaW50cygpO1xuICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGEgbWF4aW11bSBvZiBvbmUgb2YgZWFjaCBgPG1hdC1oaW50PmAgYWxpZ25tZW50IHNwZWNpZmllZCwgd2l0aCB0aGVcbiAgICogYXR0cmlidXRlIGJlaW5nIGNvbnNpZGVyZWQgYXMgYGFsaWduPVwic3RhcnRcImAuXG4gICAqL1xuICBwcml2YXRlIF92YWxpZGF0ZUhpbnRzKCkge1xuICAgIGlmICh0aGlzLl9oaW50Q2hpbGRyZW4gJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIGxldCBzdGFydEhpbnQ6IE1hdEhpbnQ7XG4gICAgICBsZXQgZW5kSGludDogTWF0SGludDtcbiAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5mb3JFYWNoKChoaW50OiBNYXRIaW50KSA9PiB7XG4gICAgICAgIGlmIChoaW50LmFsaWduID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0SGludCB8fCB0aGlzLmhpbnRMYWJlbCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignc3RhcnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhcnRIaW50ID0gaGludDtcbiAgICAgICAgfSBlbHNlIGlmIChoaW50LmFsaWduID09PSAnZW5kJykge1xuICAgICAgICAgIGlmIChlbmRIaW50KSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yKCdlbmQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZW5kSGludCA9IGhpbnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkZWZhdWx0IGZsb2F0IGxhYmVsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk6IEZsb2F0TGFiZWxUeXBlIHtcbiAgICByZXR1cm4gKHRoaXMuX2RlZmF1bHRzICYmIHRoaXMuX2RlZmF1bHRzLmZsb2F0TGFiZWwpIHx8ICdhdXRvJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBsaXN0IG9mIGVsZW1lbnQgSURzIHRoYXQgZGVzY3JpYmUgdGhlIGNoaWxkIGNvbnRyb2wuIFRoaXMgYWxsb3dzIHRoZSBjb250cm9sIHRvIHVwZGF0ZVxuICAgKiBpdHMgYGFyaWEtZGVzY3JpYmVkYnlgIGF0dHJpYnV0ZSBhY2NvcmRpbmdseS5cbiAgICovXG4gIHByaXZhdGUgX3N5bmNEZXNjcmliZWRCeUlkcygpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbCkge1xuICAgICAgbGV0IGlkczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBSZW1vdmUgdGhlIHR5cGUgY2hlY2sgd2hlbiB3ZSBmaW5kIHRoZSByb290IGNhdXNlIG9mIHRoaXMgYnVnLlxuICAgICAgaWYgKHRoaXMuX2NvbnRyb2wudXNlckFyaWFEZXNjcmliZWRCeSAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5fY29udHJvbC51c2VyQXJpYURlc2NyaWJlZEJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZHMucHVzaCguLi50aGlzLl9jb250cm9sLnVzZXJBcmlhRGVzY3JpYmVkQnkuc3BsaXQoJyAnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9nZXREaXNwbGF5ZWRNZXNzYWdlcygpID09PSAnaGludCcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ3N0YXJ0JykgOiBudWxsO1xuICAgICAgICBjb25zdCBlbmRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ2VuZCcpIDogbnVsbDtcblxuICAgICAgICBpZiAoc3RhcnRIaW50KSB7XG4gICAgICAgICAgaWRzLnB1c2goc3RhcnRIaW50LmlkKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9oaW50TGFiZWwpIHtcbiAgICAgICAgICBpZHMucHVzaCh0aGlzLl9oaW50TGFiZWxJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKGVuZEhpbnQuaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2Vycm9yQ2hpbGRyZW4pIHtcbiAgICAgICAgaWRzLnB1c2goLi4udGhpcy5fZXJyb3JDaGlsZHJlbi5tYXAoZXJyb3IgPT4gZXJyb3IuaWQpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29udHJvbC5zZXREZXNjcmliZWRCeUlkcyhpZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGZvcm0gZmllbGQncyBjb250cm9sIGlzIG1pc3NpbmcuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVDb250cm9sQ2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250cm9sICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZSBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZVxuICAgKiBhcHBlYXJhbmNlLlxuICAgKi9cbiAgdXBkYXRlT3V0bGluZUdhcCgpIHtcbiAgICBjb25zdCBsYWJlbEVsID0gdGhpcy5fbGFiZWwgPyB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmICh0aGlzLmFwcGVhcmFuY2UgIT09ICdvdXRsaW5lJyB8fCAhbGFiZWxFbCB8fCAhbGFiZWxFbC5jaGlsZHJlbi5sZW5ndGggfHxcbiAgICAgICAgIWxhYmVsRWwudGV4dENvbnRlbnQhLnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXNuJ3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IGluIHRoZSBET00sIHRoZSBvdXRsaW5lIGdhcCB3aWxsIG5lZWQgdG8gYmUgY2FsY3VsYXRlZFxuICAgIC8vIHRoZSBuZXh0IHRpbWUgaXQgaXMgY2hlY2tlZCBhbmQgaW4gdGhlIERPTS5cbiAgICBpZiAoIXRoaXMuX2lzQXR0YWNoZWRUb0RPTSgpKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0V2lkdGggPSAwO1xuICAgIGxldCBnYXBXaWR0aCA9IDA7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnQnKTtcbiAgICBjb25zdCBnYXBFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJyk7XG5cbiAgICBpZiAodGhpcy5fbGFiZWwgJiYgdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb250YWluZXIncyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLCBpdCBtZWFucyB0aGF0IHRoZSBlbGVtZW50IGlzXG4gICAgICAvLyBpbnZpc2libGUgYW5kIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgb3V0bGluZSBnYXAuIE1hcmsgdGhlIGVsZW1lbnQgYXMgbmVlZGluZ1xuICAgICAgLy8gdG8gYmUgY2hlY2tlZCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuIFdlIGNhbid0IGRvIHRoaXMgaW1tZWRpYXRlbHlcbiAgICAgIC8vIG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24sIGJlY2F1c2UgZXZlbiBpZiB0aGUgZWxlbWVudCBiZWNvbWVzIHZpc2libGUsXG4gICAgICAvLyB0aGUgYENsaWVudFJlY3RgIHdvbid0IGJlIHJlY2xhY3VsYXRlZCBpbW1lZGlhdGVseS4gV2UgcmVzZXQgdGhlXG4gICAgICAvLyBgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5YCBmbGFnIHNvbWUgd2UgZG9uJ3QgcnVuIHRoZSBjaGVja3MgdHdpY2UuXG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChjb250YWluZXJSZWN0KTtcbiAgICAgIGNvbnN0IGxhYmVsQ2hpbGRyZW4gPSBsYWJlbEVsLmNoaWxkcmVuO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsQ2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhYmVsQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSAobGFiZWxDaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgICBzdGFydFdpZHRoID0gTWF0aC5hYnMobGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0KSAtIG91dGxpbmVHYXBQYWRkaW5nO1xuICAgICAgZ2FwV2lkdGggPSBsYWJlbFdpZHRoID4gMCA/IGxhYmVsV2lkdGggKiBmbG9hdGluZ0xhYmVsU2NhbGUgKyBvdXRsaW5lR2FwUGFkZGluZyAqIDIgOiAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJ0RWxzW2ldLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtnYXBXaWR0aH1weGA7XG4gICAgfVxuXG4gICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPVxuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN0YXJ0IGVuZCBvZiB0aGUgcmVjdCBjb25zaWRlcmluZyB0aGUgY3VycmVudCBkaXJlY3Rpb25hbGl0eS4gKi9cbiAgcHJpdmF0ZSBfZ2V0U3RhcnRFbmQocmVjdDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0O1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBmb3JtIGZpZWxkIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gIHByaXZhdGUgX2lzQXR0YWNoZWRUb0RPTSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50LmdldFJvb3ROb2RlKSB7XG4gICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgRE9NIHRoZSByb290IG5vZGUgd2lsbCBiZSBlaXRoZXIgdGhlIGRvY3VtZW50XG4gICAgICAvLyBvciB0aGUgY2xvc2VzdCBzaGFkb3cgcm9vdCwgb3RoZXJ3aXNlIGl0J2xsIGJlIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiByb290Tm9kZSAmJiByb290Tm9kZSAhPT0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGNoZWNraW5nIGlmIGl0J3MgaW4gdGhlIGRvY3VtZW50LiBUaGlzIGRvZXNuJ3QgYWNjb3VudCBmb3JcbiAgICAvLyBzaGFkb3cgRE9NLCBob3dldmVyIGJyb3dzZXIgdGhhdCBzdXBwb3J0IHNoYWRvdyBET00gc2hvdWxkIHN1cHBvcnQgYGdldFJvb3ROb2RlYCBhcyB3ZWxsLlxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNvbnRhaW5zKGVsZW1lbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVSZXF1aXJlZE1hcmtlcjogQm9vbGVhbklucHV0O1xufVxuIl19