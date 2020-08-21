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
class MatFormFieldBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
/**
 * Base class to which we're applying the form field mixins.
 * @docs-private
 */
const _MatFormFieldMixinBase = mixinColor(MatFormFieldBase, 'primary');
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
export class MatFormField extends _MatFormFieldMixinBase {
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
        this._labelOptions = labelOptions ? labelOptions : {};
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
        return (this._defaults && this._defaults.floatLabel) || this._labelOptions.float || 'auto';
    }
    /**
     * Sets the list of element IDs that describe the child control. This allows the control to update
     * its `aria-describedby` attribute accordingly.
     */
    _syncDescribedByIds() {
        if (this._control) {
            let ids = [];
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
                ids = this._errorChildren.map(error => error.id);
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
                providers: [
                    { provide: MAT_FORM_FIELD, useExisting: MatFormField },
                ],
                styles: [".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:scaleX(1);transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n", ".mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:\"\";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n", ".mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date],.mat-input-element[type=datetime],.mat-input-element[type=datetime-local],.mat-input-element[type=month],.mat-input-element[type=week],.mat-input-element[type=time]{line-height:1}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:\" \";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}.mat-focused .cdk-high-contrast-active select.mat-input-element::-ms-value{color:inherit}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:\"\";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n", ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n", ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n", ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:2px}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n"]
            },] }
];
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
    _errorChildren: [{ type: ContentChildren, args: [MAT_ERROR, { descendants: true },] }],
    _hintChildren: [{ type: ContentChildren, args: [_MAT_HINT, { descendants: true },] }],
    _prefixChildren: [{ type: ContentChildren, args: [MAT_PREFIX, { descendants: true },] }],
    _suffixChildren: [{ type: ContentChildren, args: [MAT_SUFFIX, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCx3QkFBd0IsRUFDeEIsVUFBVSxHQUNYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQVcsTUFBTSxTQUFTLENBQUM7QUFDNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxrQ0FBa0MsRUFDbEMsdUNBQXVDLEdBQ3hDLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBVSxNQUFNLFFBQVEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9B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IExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLCBDYW5Db2xvckN0b3IsXG4gIExhYmVsT3B0aW9ucyxcbiAgTUFUX0xBQkVMX0dMT0JBTF9PUFRJT05TLFxuICBtaXhpbkNvbG9yLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBtZXJnZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01BVF9FUlJPUiwgTWF0RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHttYXRGb3JtRmllbGRBbmltYXRpb25zfSBmcm9tICcuL2Zvcm0tZmllbGQtYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdEZvcm1GaWVsZENvbnRyb2x9IGZyb20gJy4vZm9ybS1maWVsZC1jb250cm9sJztcbmltcG9ydCB7XG4gIGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IsXG4gIGdldE1hdEZvcm1GaWVsZFBsYWNlaG9sZGVyQ29uZmxpY3RFcnJvcixcbn0gZnJvbSAnLi9mb3JtLWZpZWxkLWVycm9ycyc7XG5pbXBvcnQge19NQVRfSElOVCwgTWF0SGludH0gZnJvbSAnLi9oaW50JztcbmltcG9ydCB7TWF0TGFiZWx9IGZyb20gJy4vbGFiZWwnO1xuaW1wb3J0IHtNYXRQbGFjZWhvbGRlcn0gZnJvbSAnLi9wbGFjZWhvbGRlcic7XG5pbXBvcnQge01BVF9QUkVGSVgsIE1hdFByZWZpeH0gZnJvbSAnLi9wcmVmaXgnO1xuaW1wb3J0IHtNQVRfU1VGRklYLCBNYXRTdWZmaXh9IGZyb20gJy4vc3VmZml4JztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5jb25zdCBmbG9hdGluZ0xhYmVsU2NhbGUgPSAwLjc1O1xuY29uc3Qgb3V0bGluZUdhcFBhZGRpbmcgPSA1O1xuXG5cbi8qKlxuICogQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRGb3JtRmllbGQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNsYXNzIE1hdEZvcm1GaWVsZEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gd2hpY2ggd2UncmUgYXBwbHlpbmcgdGhlIGZvcm0gZmllbGQgbWl4aW5zLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jb25zdCBfTWF0Rm9ybUZpZWxkTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0Rm9ybUZpZWxkQmFzZSA9XG4gICAgbWl4aW5Db2xvcihNYXRGb3JtRmllbGRCYXNlLCAncHJpbWFyeScpO1xuXG4vKiogUG9zc2libGUgYXBwZWFyYW5jZSBzdHlsZXMgZm9yIHRoZSBmb3JtIGZpZWxkLiAqL1xuZXhwb3J0IHR5cGUgTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSA9ICdsZWdhY3knIHwgJ3N0YW5kYXJkJyB8ICdmaWxsJyB8ICdvdXRsaW5lJztcblxuLyoqIFBvc3NpYmxlIHZhbHVlcyBmb3IgdGhlIFwiZmxvYXRMYWJlbFwiIGZvcm0tZmllbGQgaW5wdXQuICovXG5leHBvcnQgdHlwZSBGbG9hdExhYmVsVHlwZSA9ICdhbHdheXMnIHwgJ25ldmVyJyB8ICdhdXRvJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBmb3JtIGZpZWxkIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWRcbiAqIHVzaW5nIHRoZSBgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMge1xuICBhcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcbiAgaGlkZVJlcXVpcmVkTWFya2VyPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxhYmVsIGZvciBmb3JtLWZpZWxkcyBzaG91bGQgYnkgZGVmYXVsdCBmbG9hdCBgYWx3YXlzYCxcbiAgICogYG5ldmVyYCwgb3IgYGF1dG9gIChvbmx5IHdoZW4gbmVjZXNzYXJ5KS5cbiAgICovXG4gIGZsb2F0TGFiZWw/OiBGbG9hdExhYmVsVHlwZTtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlXG4gKiBkZWZhdWx0IG9wdGlvbnMgZm9yIGFsbCBmb3JtIGZpZWxkIHdpdGhpbiBhbiBhcHAuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucz4oJ01BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGluamVjdCBhbiBpbnN0YW5jZXMgb2YgYE1hdEZvcm1GaWVsZGAuIEl0IHNlcnZlc1xuICogYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0Rm9ybUZpZWxkYCBjbGFzcyB3aGljaCB3b3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBgTWF0Rm9ybUZpZWxkYCBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9GT1JNX0ZJRUxEID0gbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZD4oJ01hdEZvcm1GaWVsZCcpO1xuXG4vKiogQ29udGFpbmVyIGZvciBmb3JtIGNvbnRyb2xzIHRoYXQgYXBwbGllcyBNYXRlcmlhbCBEZXNpZ24gc3R5bGluZyBhbmQgYmVoYXZpb3IuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZm9ybS1maWVsZCcsXG4gIGV4cG9ydEFzOiAnbWF0Rm9ybUZpZWxkJyxcbiAgdGVtcGxhdGVVcmw6ICdmb3JtLWZpZWxkLmh0bWwnLFxuICAvLyBNYXRJbnB1dCBpcyBhIGRpcmVjdGl2ZSBhbmQgY2FuJ3QgaGF2ZSBzdHlsZXMsIHNvIHdlIG5lZWQgdG8gaW5jbHVkZSBpdHMgc3R5bGVzIGhlcmVcbiAgLy8gaW4gZm9ybS1maWVsZC1pbnB1dC5jc3MuIFRoZSBNYXRJbnB1dCBzdHlsZXMgYXJlIGZhaXJseSBtaW5pbWFsIHNvIGl0IHNob3VsZG4ndCBiZSBhXG4gIC8vIGJpZyBkZWFsIGZvciBwZW9wbGUgd2hvIGFyZW4ndCB1c2luZyBNYXRJbnB1dC5cbiAgc3R5bGVVcmxzOiBbXG4gICAgJ2Zvcm0tZmllbGQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1maWxsLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtaW5wdXQuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1sZWdhY3kuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1vdXRsaW5lLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtc3RhbmRhcmQuY3NzJyxcbiAgXSxcbiAgYW5pbWF0aW9uczogW21hdEZvcm1GaWVsZEFuaW1hdGlvbnMudHJhbnNpdGlvbk1lc3NhZ2VzXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZm9ybS1maWVsZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09IFwic3RhbmRhcmRcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWZpbGxdJzogJ2FwcGVhcmFuY2UgPT0gXCJmaWxsXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdhcHBlYXJhbmNlID09IFwib3V0bGluZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtbGVnYWN5XSc6ICdhcHBlYXJhbmNlID09IFwibGVnYWN5XCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaW52YWxpZF0nOiAnX2NvbnRyb2wuZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1jYW4tZmxvYXRdJzogJ19jYW5MYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtc2hvdWxkLWZsb2F0XSc6ICdfc2hvdWxkTGFiZWxGbG9hdCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhhcy1sYWJlbF0nOiAnX2hhc0Zsb2F0aW5nTGFiZWwoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1oaWRlLXBsYWNlaG9sZGVyXSc6ICdfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWRpc2FibGVkXSc6ICdfY29udHJvbC5kaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hdXRvZmlsbGVkXSc6ICdfY29udHJvbC5hdXRvZmlsbGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb2N1c2VkXSc6ICdfY29udHJvbC5mb2N1c2VkJyxcbiAgICAnW2NsYXNzLm1hdC1hY2NlbnRdJzogJ2NvbG9yID09IFwiYWNjZW50XCInLFxuICAgICdbY2xhc3MubWF0LXdhcm5dJzogJ2NvbG9yID09IFwid2FyblwiJyxcbiAgICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ1bnRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctdG91Y2hlZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJ0b3VjaGVkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdfc2hvdWxkRm9yd2FyZChcInByaXN0aW5lXCIpJyxcbiAgICAnW2NsYXNzLm5nLWRpcnR5XSc6ICdfc2hvdWxkRm9yd2FyZChcImRpcnR5XCIpJyxcbiAgICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdfc2hvdWxkRm9yd2FyZChcInZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwiaW52YWxpZFwiKScsXG4gICAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICdfc2hvdWxkRm9yd2FyZChcInBlbmRpbmdcIiknLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJyFfYW5pbWF0aW9uc0VuYWJsZWQnLFxuICB9LFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNQVRfRk9STV9GSUVMRCwgdXNlRXhpc3Rpbmc6IE1hdEZvcm1GaWVsZH0sXG4gIF1cbn0pXG5cbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGQgZXh0ZW5kcyBfTWF0Rm9ybUZpZWxkTWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIENhbkNvbG9yIHtcbiAgcHJpdmF0ZSBfbGFiZWxPcHRpb25zOiBMYWJlbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWRcbiAgICogaW1tZWRpYXRlbHkgb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiBydW4uXG4gICAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvdXRsaW5lIGdhcCBuZWVkcyB0byBiZSBjYWxjdWxhdGVkIG5leHQgdGltZSB0aGUgem9uZSBoYXMgc3RhYmlsaXplZC4gKi9cbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSBmYWxzZTtcblxuICBwcml2YXRlIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgZm9ybS1maWVsZCBhcHBlYXJhbmNlIHN0eWxlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlIHsgcmV0dXJuIHRoaXMuX2FwcGVhcmFuY2U7IH1cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UpIHtcbiAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX2FwcGVhcmFuY2U7XG5cbiAgICB0aGlzLl9hcHBlYXJhbmNlID0gdmFsdWUgfHwgKHRoaXMuX2RlZmF1bHRzICYmIHRoaXMuX2RlZmF1bHRzLmFwcGVhcmFuY2UpIHx8ICdsZWdhY3knO1xuXG4gICAgaWYgKHRoaXMuX2FwcGVhcmFuY2UgPT09ICdvdXRsaW5lJyAmJiBvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgX2FwcGVhcmFuY2U6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHJlcXVpcmVkIG1hcmtlciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVJlcXVpcmVkTWFya2VyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyOyB9XG4gIHNldCBoaWRlUmVxdWlyZWRNYXJrZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVSZXF1aXJlZE1hcmtlcjogYm9vbGVhbjtcblxuICAvKiogT3ZlcnJpZGUgZm9yIHRoZSBsb2dpYyB0aGF0IGRpc2FibGVzIHRoZSBsYWJlbCBhbmltYXRpb24gaW4gY2VydGFpbiBjYXNlcy4gKi9cbiAgcHJpdmF0ZSBfc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZmxvYXRpbmcgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCBvciBub3QuICovXG4gIF9zaG91bGRBbHdheXNGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mbG9hdExhYmVsID09PSAnYWx3YXlzJyAmJiAhdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgY2FuIGZsb2F0IG9yIG5vdC4gKi9cbiAgX2NhbkxhYmVsRmxvYXQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmZsb2F0TGFiZWwgIT09ICduZXZlcic7IH1cblxuICAvKiogU3RhdGUgb2YgdGhlIG1hdC1oaW50IGFuZCBtYXQtZXJyb3IgYW5pbWF0aW9ucy4gKi9cbiAgX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlOiBzdHJpbmcgPSAnJztcblxuICAvKiogVGV4dCBmb3IgdGhlIGZvcm0gZmllbGQgaGludC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpbnRMYWJlbCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faGludExhYmVsOyB9XG4gIHNldCBoaW50TGFiZWwodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2hpbnRMYWJlbCA9IHZhbHVlO1xuICAgIHRoaXMuX3Byb2Nlc3NIaW50cygpO1xuICB9XG4gIHByaXZhdGUgX2hpbnRMYWJlbCA9ICcnO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGhpbnQgbGFiZWwuXG4gIHJlYWRvbmx5IF9oaW50TGFiZWxJZDogc3RyaW5nID0gYG1hdC1oaW50LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBsYWJlbCBlbGVtZW50LlxuICByZWFkb25seSBfbGFiZWxJZCA9IGBtYXQtZm9ybS1maWVsZC1sYWJlbC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhbHdheXMgZmxvYXQsIG5ldmVyIGZsb2F0IG9yIGZsb2F0IGFzIHRoZSB1c2VyIHR5cGVzLlxuICAgKlxuICAgKiBOb3RlOiBvbmx5IHRoZSBsZWdhY3kgYXBwZWFyYW5jZSBzdXBwb3J0cyB0aGUgYG5ldmVyYCBvcHRpb24uIGBuZXZlcmAgd2FzIG9yaWdpbmFsbHkgYWRkZWQgYXMgYVxuICAgKiB3YXkgdG8gbWFrZSB0aGUgZmxvYXRpbmcgbGFiZWwgZW11bGF0ZSB0aGUgYmVoYXZpb3Igb2YgYSBzdGFuZGFyZCBpbnB1dCBwbGFjZWhvbGRlci4gSG93ZXZlclxuICAgKiB0aGUgZm9ybSBmaWVsZCBub3cgc3VwcG9ydHMgYm90aCBmbG9hdGluZyBsYWJlbHMgYW5kIHBsYWNlaG9sZGVycy4gVGhlcmVmb3JlIGluIHRoZSBub24tbGVnYWN5XG4gICAqIGFwcGVhcmFuY2VzIHRoZSBgbmV2ZXJgIG9wdGlvbiBoYXMgYmVlbiBkaXNhYmxlZCBpbiBmYXZvciBvZiBqdXN0IHVzaW5nIHRoZSBwbGFjZWhvbGRlci5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBmbG9hdExhYmVsKCk6IEZsb2F0TGFiZWxUeXBlIHtcbiAgICByZXR1cm4gdGhpcy5hcHBlYXJhbmNlICE9PSAnbGVnYWN5JyAmJiB0aGlzLl9mbG9hdExhYmVsID09PSAnbmV2ZXInID8gJ2F1dG8nIDogdGhpcy5fZmxvYXRMYWJlbDtcbiAgfVxuICBzZXQgZmxvYXRMYWJlbCh2YWx1ZTogRmxvYXRMYWJlbFR5cGUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2Zsb2F0TGFiZWwpIHtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwgPSB2YWx1ZSB8fCB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZmxvYXRMYWJlbDogRmxvYXRMYWJlbFR5cGU7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIEFuZ3VsYXIgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC4gKi9cbiAgX2FuaW1hdGlvbnNFbmFibGVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAqL1xuICBAVmlld0NoaWxkKCd1bmRlcmxpbmUnKSB1bmRlcmxpbmVSZWY6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZCgnY29ubmVjdGlvbkNvbnRhaW5lcicsIHtzdGF0aWM6IHRydWV9KSBfY29ubmVjdGlvbkNvbnRhaW5lclJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnaW5wdXRDb250YWluZXInKSBfaW5wdXRDb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJykgcHJpdmF0ZSBfbGFiZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCkgX2NvbnRyb2xOb25TdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sLCB7c3RhdGljOiB0cnVlfSkgX2NvbnRyb2xTdGF0aWM6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcbiAgZ2V0IF9jb250cm9sKCkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBuZWVkIHRoaXMgd29ya2Fyb3VuZCBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAgIC8vICBXZSBzaG91bGQgY2xlYW4gdGhpcyB1cCBvbmNlIEl2eSBpcyB0aGUgZGVmYXVsdCByZW5kZXJlci5cbiAgICByZXR1cm4gdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sIHx8IHRoaXMuX2NvbnRyb2xOb25TdGF0aWMgfHwgdGhpcy5fY29udHJvbFN0YXRpYztcbiAgfVxuICBzZXQgX2NvbnRyb2wodmFsdWUpIHtcbiAgICB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2w6IE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PjtcblxuICBAQ29udGVudENoaWxkKE1hdExhYmVsKSBfbGFiZWxDaGlsZE5vblN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwsIHtzdGF0aWM6IHRydWV9KSBfbGFiZWxDaGlsZFN0YXRpYzogTWF0TGFiZWw7XG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcblxuICAvLyBUT0RPOiBSZW1vdmUgY2FzdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8zNzUwNiBpcyBhdmFpbGFibGUuXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX0VSUk9SIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihfTUFUX0hJTlQgYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfUFJFRklYIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICBAQ29udGVudENoaWxkcmVuKE1BVF9TVUZGSVggYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3VmZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRTdWZmaXg+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUykgbGFiZWxPcHRpb25zOiBMYWJlbE9wdGlvbnMsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRzOlxuICAgICAgICAgIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zLCBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9sYWJlbE9wdGlvbnMgPSBsYWJlbE9wdGlvbnMgPyBsYWJlbE9wdGlvbnMgOiB7fTtcbiAgICB0aGlzLmZsb2F0TGFiZWwgPSB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgPSBfYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCB0aHJvdWdoIGhlcmUgc28gd2UgaW52b2tlIHRoZSBzZXR0ZXIgb24gdGhlIGZpcnN0IHJ1bi5cbiAgICB0aGlzLmFwcGVhcmFuY2UgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5hcHBlYXJhbmNlKSA/IF9kZWZhdWx0cy5hcHBlYXJhbmNlIDogJ2xlZ2FjeSc7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gKF9kZWZhdWx0cyAmJiBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyICE9IG51bGwpID9cbiAgICAgICAgX2RlZmF1bHRzLmhpZGVSZXF1aXJlZE1hcmtlciA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGlkIG9mIHRoZSBsYWJlbCBlbGVtZW50LiBJZiBubyBsYWJlbCBpcyBwcmVzZW50LCByZXR1cm5zIGBudWxsYC5cbiAgICovXG4gIGdldExhYmVsSWQoKTogc3RyaW5nfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgPyB0aGlzLl9sYWJlbElkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIEVsZW1lbnRSZWYgZm9yIHRoZSBlbGVtZW50IHRoYXQgYSBvdmVybGF5IGF0dGFjaGVkIHRvIHRoZSBmb3JtLWZpZWxkIHNob3VsZCBiZVxuICAgKiBwb3NpdGlvbmVkIHJlbGF0aXZlIHRvLlxuICAgKi9cbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5fY29ubmVjdGlvbkNvbnRhaW5lclJlZiB8fCB0aGlzLl9lbGVtZW50UmVmO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG5cbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5fY29udHJvbDtcblxuICAgIGlmIChjb250cm9sLmNvbnRyb2xUeXBlKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWZvcm0tZmllbGQtdHlwZS0ke2NvbnRyb2wuY29udHJvbFR5cGV9YCk7XG4gICAgfVxuXG4gICAgLy8gU3Vic2NyaWJlIHRvIGNoYW5nZXMgaW4gdGhlIGNoaWxkIGNvbnRyb2wgc3RhdGUgaW4gb3JkZXIgdG8gdXBkYXRlIHRoZSBmb3JtIGZpZWxkIFVJLlxuICAgIGNvbnRyb2wuc3RhdGVDaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwhKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRlUGxhY2Vob2xkZXJzKCk7XG4gICAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gaWYgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAgaWYgKGNvbnRyb2wubmdDb250cm9sICYmIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlcykge1xuICAgICAgY29udHJvbC5uZ0NvbnRyb2wudmFsdWVDaGFuZ2VzXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgd2UgaGF2ZSB0byBydW4gb3V0c2lkZSBvZiB0aGUgYE5nWm9uZWAgZXhwbGljaXRseSxcbiAgICAvLyBpbiBvcmRlciB0byBhdm9pZCB0aHJvd2luZyB1c2VycyBpbnRvIGFuIGluZmluaXRlIGxvb3BcbiAgICAvLyBpZiBgem9uZS1wYXRjaC1yeGpzYCBpcyBpbmNsdWRlZC5cbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSkge1xuICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZUdhcCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCB1cGRhdGUgdGhlIG91dGxpbmUgaWYgdGhlIHN1ZmZpeCBvciBwcmVmaXggY2hhbmdlcy5cbiAgICBtZXJnZSh0aGlzLl9wcmVmaXhDaGlsZHJlbi5jaGFuZ2VzLCB0aGlzLl9zdWZmaXhDaGlsZHJlbi5jaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZS12YWxpZGF0ZSB3aGVuIHRoZSBudW1iZXIgb2YgaGludHMgY2hhbmdlcy5cbiAgICB0aGlzLl9oaW50Q2hpbGRyZW4uY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NIaW50cygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGFyaWEtZGVzY3JpYmVkIGJ5IHdoZW4gdGhlIG51bWJlciBvZiBlcnJvcnMgY2hhbmdlcy5cbiAgICB0aGlzLl9lcnJvckNoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX2Rpcikge1xuICAgICAgdGhpcy5fZGlyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy51cGRhdGVPdXRsaW5lR2FwKCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudXBkYXRlT3V0bGluZUdhcCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcbiAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMudXBkYXRlT3V0bGluZUdhcCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBBdm9pZCBhbmltYXRpb25zIG9uIGxvYWQuXG4gICAgdGhpcy5fc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIGEgY2xhc3MgZnJvbSB0aGUgTmdDb250cm9sIHNob3VsZCBiZSBmb3J3YXJkZWQgdG8gdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgX3Nob3VsZEZvcndhcmQocHJvcDoga2V5b2YgTmdDb250cm9sKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmdDb250cm9sID0gdGhpcy5fY29udHJvbCA/IHRoaXMuX2NvbnRyb2wubmdDb250cm9sIDogbnVsbDtcbiAgICByZXR1cm4gbmdDb250cm9sICYmIG5nQ29udHJvbFtwcm9wXTtcbiAgfVxuXG4gIF9oYXNQbGFjZWhvbGRlcigpIHtcbiAgICByZXR1cm4gISEodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnBsYWNlaG9sZGVyIHx8IHRoaXMuX3BsYWNlaG9sZGVyQ2hpbGQpO1xuICB9XG5cbiAgX2hhc0xhYmVsKCkge1xuICAgIHJldHVybiAhISh0aGlzLl9sYWJlbENoaWxkTm9uU3RhdGljIHx8IHRoaXMuX2xhYmVsQ2hpbGRTdGF0aWMpO1xuICB9XG5cbiAgX3Nob3VsZExhYmVsRmxvYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbkxhYmVsRmxvYXQoKSAmJlxuICAgICAgICAoKHRoaXMuX2NvbnRyb2wgJiYgdGhpcy5fY29udHJvbC5zaG91bGRMYWJlbEZsb2F0KSB8fCB0aGlzLl9zaG91bGRBbHdheXNGbG9hdCgpKTtcbiAgfVxuXG4gIF9oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiAhdGhpcy5faGFzTGFiZWwoKSB8fFxuICAgICAgICB0aGlzLl9oYXNMYWJlbCgpICYmICF0aGlzLl9zaG91bGRMYWJlbEZsb2F0KCk7XG4gIH1cblxuICBfaGFzRmxvYXRpbmdMYWJlbCgpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuX2hhc0xhYmVsKCkgfHwgdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiB0aGlzLl9oYXNQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0byBkaXNwbGF5IGhpbnRzIG9yIGVycm9ycy4gKi9cbiAgX2dldERpc3BsYXllZE1lc3NhZ2VzKCk6ICdlcnJvcicgfCAnaGludCcge1xuICAgIHJldHVybiAodGhpcy5fZXJyb3JDaGlsZHJlbiAmJiB0aGlzLl9lcnJvckNoaWxkcmVuLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgdGhpcy5fY29udHJvbC5lcnJvclN0YXRlKSA/ICdlcnJvcicgOiAnaGludCc7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIHBsYWNlaG9sZGVyIHVwIGFuZCBsb2NrcyBpdCBpbiBwb3NpdGlvbi4gKi9cbiAgX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2hhc0Zsb2F0aW5nTGFiZWwoKSAmJiB0aGlzLl9jYW5MYWJlbEZsb2F0KCkpIHtcbiAgICAgIC8vIElmIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLCB3ZSBzaG91bGRuJ3QgZ28gaW4gaGVyZSxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGB0cmFuc2l0aW9uZW5kYCB3aWxsIG5ldmVyIGZpcmUuXG4gICAgICBpZiAodGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgJiYgdGhpcy5fbGFiZWwpIHtcbiAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSB0cnVlO1xuXG4gICAgICAgIGZyb21FdmVudCh0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbmVuZCcpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgcGxhY2Vob2xkZXIgKGVpdGhlciBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZSBvbiB0aGUgY2hpbGQgY29udHJvbFxuICAgKiBvciBjaGlsZCBlbGVtZW50IHdpdGggdGhlIGBtYXQtcGxhY2Vob2xkZXJgIGRpcmVjdGl2ZSkuXG4gICAqL1xuICBwcml2YXRlIF92YWxpZGF0ZVBsYWNlaG9sZGVycygpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciAmJiB0aGlzLl9wbGFjZWhvbGRlckNoaWxkICYmXG4gICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgYW55IGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy4gKi9cbiAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcbiAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYDxtYXQtaGludD5gIGFsaWdubWVudCBzcGVjaWZpZWQsIHdpdGggdGhlXG4gICAqIGF0dHJpYnV0ZSBiZWluZyBjb25zaWRlcmVkIGFzIGBhbGlnbj1cInN0YXJ0XCJgLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpIHtcbiAgICBpZiAodGhpcy5faGludENoaWxkcmVuICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBsZXQgc3RhcnRIaW50OiBNYXRIaW50O1xuICAgICAgbGV0IGVuZEhpbnQ6IE1hdEhpbnQ7XG4gICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogTWF0SGludCkgPT4ge1xuICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGlmIChzdGFydEhpbnQgfHwgdGhpcy5oaW50TGFiZWwpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignZW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGVmYXVsdCBmbG9hdCBsYWJlbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5mbG9hdExhYmVsKSB8fCB0aGlzLl9sYWJlbE9wdGlvbnMuZmxvYXQgfHwgJ2F1dG8nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBkZXNjcmliZSB0aGUgY2hpbGQgY29udHJvbC4gVGhpcyBhbGxvd3MgdGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAqIGl0cyBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0Rlc2NyaWJlZEJ5SWRzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XG4gICAgICBsZXQgaWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKSA9PT0gJ2hpbnQnKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdlbmQnKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXJ0SGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faGludExhYmVsKSB7XG4gICAgICAgICAgaWRzLnB1c2godGhpcy5faGludExhYmVsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJvckNoaWxkcmVuKSB7XG4gICAgICAgIGlkcyA9IHRoaXMuX2Vycm9yQ2hpbGRyZW4ubWFwKGVycm9yID0+IGVycm9yLmlkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29udHJvbC5zZXREZXNjcmliZWRCeUlkcyhpZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGZvcm0gZmllbGQncyBjb250cm9sIGlzIG1pc3NpbmcuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVDb250cm9sQ2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250cm9sICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZSBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZVxuICAgKiBhcHBlYXJhbmNlLlxuICAgKi9cbiAgdXBkYXRlT3V0bGluZUdhcCgpIHtcbiAgICBjb25zdCBsYWJlbEVsID0gdGhpcy5fbGFiZWwgPyB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmICh0aGlzLmFwcGVhcmFuY2UgIT09ICdvdXRsaW5lJyB8fCAhbGFiZWxFbCB8fCAhbGFiZWxFbC5jaGlsZHJlbi5sZW5ndGggfHxcbiAgICAgICAgIWxhYmVsRWwudGV4dENvbnRlbnQhLnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXNuJ3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IGluIHRoZSBET00sIHRoZSBvdXRsaW5lIGdhcCB3aWxsIG5lZWQgdG8gYmUgY2FsY3VsYXRlZFxuICAgIC8vIHRoZSBuZXh0IHRpbWUgaXQgaXMgY2hlY2tlZCBhbmQgaW4gdGhlIERPTS5cbiAgICBpZiAoIXRoaXMuX2lzQXR0YWNoZWRUb0RPTSgpKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0V2lkdGggPSAwO1xuICAgIGxldCBnYXBXaWR0aCA9IDA7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnQnKTtcbiAgICBjb25zdCBnYXBFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJyk7XG5cbiAgICBpZiAodGhpcy5fbGFiZWwgJiYgdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb250YWluZXIncyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLCBpdCBtZWFucyB0aGF0IHRoZSBlbGVtZW50IGlzXG4gICAgICAvLyBpbnZpc2libGUgYW5kIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgb3V0bGluZSBnYXAuIE1hcmsgdGhlIGVsZW1lbnQgYXMgbmVlZGluZ1xuICAgICAgLy8gdG8gYmUgY2hlY2tlZCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuIFdlIGNhbid0IGRvIHRoaXMgaW1tZWRpYXRlbHlcbiAgICAgIC8vIG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24sIGJlY2F1c2UgZXZlbiBpZiB0aGUgZWxlbWVudCBiZWNvbWVzIHZpc2libGUsXG4gICAgICAvLyB0aGUgYENsaWVudFJlY3RgIHdvbid0IGJlIHJlY2xhY3VsYXRlZCBpbW1lZGlhdGVseS4gV2UgcmVzZXQgdGhlXG4gICAgICAvLyBgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5YCBmbGFnIHNvbWUgd2UgZG9uJ3QgcnVuIHRoZSBjaGVja3MgdHdpY2UuXG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChjb250YWluZXJSZWN0KTtcbiAgICAgIGNvbnN0IGxhYmVsQ2hpbGRyZW4gPSBsYWJlbEVsLmNoaWxkcmVuO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsQ2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhYmVsQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSAobGFiZWxDaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgICBzdGFydFdpZHRoID0gTWF0aC5hYnMobGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0KSAtIG91dGxpbmVHYXBQYWRkaW5nO1xuICAgICAgZ2FwV2lkdGggPSBsYWJlbFdpZHRoID4gMCA/IGxhYmVsV2lkdGggKiBmbG9hdGluZ0xhYmVsU2NhbGUgKyBvdXRsaW5lR2FwUGFkZGluZyAqIDIgOiAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJ0RWxzW2ldLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtnYXBXaWR0aH1weGA7XG4gICAgfVxuXG4gICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPVxuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN0YXJ0IGVuZCBvZiB0aGUgcmVjdCBjb25zaWRlcmluZyB0aGUgY3VycmVudCBkaXJlY3Rpb25hbGl0eS4gKi9cbiAgcHJpdmF0ZSBfZ2V0U3RhcnRFbmQocmVjdDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0O1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBmb3JtIGZpZWxkIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gIHByaXZhdGUgX2lzQXR0YWNoZWRUb0RPTSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50LmdldFJvb3ROb2RlKSB7XG4gICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgRE9NIHRoZSByb290IG5vZGUgd2lsbCBiZSBlaXRoZXIgdGhlIGRvY3VtZW50XG4gICAgICAvLyBvciB0aGUgY2xvc2VzdCBzaGFkb3cgcm9vdCwgb3RoZXJ3aXNlIGl0J2xsIGJlIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiByb290Tm9kZSAmJiByb290Tm9kZSAhPT0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGNoZWNraW5nIGlmIGl0J3MgaW4gdGhlIGRvY3VtZW50LiBUaGlzIGRvZXNuJ3QgYWNjb3VudCBmb3JcbiAgICAvLyBzaGFkb3cgRE9NLCBob3dldmVyIGJyb3dzZXIgdGhhdCBzdXBwb3J0IHNoYWRvdyBET00gc2hvdWxkIHN1cHBvcnQgYGdldFJvb3ROb2RlYCBhcyB3ZWxsLlxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNvbnRhaW5zKGVsZW1lbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVSZXF1aXJlZE1hcmtlcjogQm9vbGVhbklucHV0O1xufVxuIl19