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
            this._ngZone.onStable.asObservable().pipe(takeUntil(this._destroyed)).subscribe(() => {
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
        if (this._control.placeholder && this._placeholderChild) {
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
        if (this._hintChildren) {
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
        if (!this._control) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCx3QkFBd0IsRUFDeEIsVUFBVSxHQUNYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQVcsTUFBTSxTQUFTLENBQUM7QUFDNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxrQ0FBa0MsRUFDbEMsdUNBQXVDLEdBQ3hDLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBVSxNQUFNLFFBQVEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9B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QTVCZCxNQUFNO3lDQTJRRCxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3lCQWxINUMsS0FBSztpQ0FjTCxLQUFLO3dCQXNCTCxLQUFLO3lCQXNCTCxLQUFLOzJCQW1CTCxTQUFTLFNBQUMsV0FBVztzQ0FFckIsU0FBUyxTQUFDLHFCQUFxQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztpQ0FDL0MsU0FBUyxTQUFDLGdCQUFnQjtxQkFDMUIsU0FBUyxTQUFDLE9BQU87Z0NBRWpCLFlBQVksU0FBQyxtQkFBbUI7NkJBQ2hDLFlBQVksU0FBQyxtQkFBbUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7bUNBV2hELFlBQVksU0FBQyxRQUFRO2dDQUNyQixZQUFZLFNBQUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQztnQ0FDckMsWUFBWSxTQUFDLGNBQWM7NkJBRzNCLGVBQWUsU0FBQyxTQUFnQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs0QkFFckQsZUFBZSxTQUFDLFNBQWdCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzhCQUVyRCxlQUFlLFNBQUMsVUFBaUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBRXRELGVBQWUsU0FBQyxVQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsIENhbkNvbG9yQ3RvcixcbiAgTGFiZWxPcHRpb25zLFxuICBNQVRfTEFCRUxfR0xPQkFMX09QVElPTlMsXG4gIG1peGluQ29sb3IsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtmcm9tRXZlbnQsIG1lcmdlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TUFUX0VSUk9SLCBNYXRFcnJvcn0gZnJvbSAnLi9lcnJvcic7XG5pbXBvcnQge21hdEZvcm1GaWVsZEFuaW1hdGlvbnN9IGZyb20gJy4vZm9ybS1maWVsZC1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnLi9mb3JtLWZpZWxkLWNvbnRyb2wnO1xuaW1wb3J0IHtcbiAgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkTWlzc2luZ0NvbnRyb2xFcnJvcixcbiAgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yLFxufSBmcm9tICcuL2Zvcm0tZmllbGQtZXJyb3JzJztcbmltcG9ydCB7X01BVF9ISU5ULCBNYXRIaW50fSBmcm9tICcuL2hpbnQnO1xuaW1wb3J0IHtNYXRMYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge01hdFBsYWNlaG9sZGVyfSBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCB7TUFUX1BSRUZJWCwgTWF0UHJlZml4fSBmcm9tICcuL3ByZWZpeCc7XG5pbXBvcnQge01BVF9TVUZGSVgsIE1hdFN1ZmZpeH0gZnJvbSAnLi9zdWZmaXgnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcbmNvbnN0IGZsb2F0aW5nTGFiZWxTY2FsZSA9IDAuNzU7XG5jb25zdCBvdXRsaW5lR2FwUGFkZGluZyA9IDU7XG5cblxuLyoqXG4gKiBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEZvcm1GaWVsZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY2xhc3MgTWF0Rm9ybUZpZWxkQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byB3aGljaCB3ZSdyZSBhcHBseWluZyB0aGUgZm9ybSBmaWVsZCBtaXhpbnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmNvbnN0IF9NYXRGb3JtRmllbGRNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXRGb3JtRmllbGRCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdEZvcm1GaWVsZEJhc2UsICdwcmltYXJ5Jyk7XG5cbi8qKiBQb3NzaWJsZSBhcHBlYXJhbmNlIHN0eWxlcyBmb3IgdGhlIGZvcm0gZmllbGQuICovXG5leHBvcnQgdHlwZSBNYXRGb3JtRmllbGRBcHBlYXJhbmNlID0gJ2xlZ2FjeScgfCAnc3RhbmRhcmQnIHwgJ2ZpbGwnIHwgJ291dGxpbmUnO1xuXG4vKiogUG9zc2libGUgdmFsdWVzIGZvciB0aGUgXCJmbG9hdExhYmVsXCIgZm9ybS1maWVsZCBpbnB1dC4gKi9cbmV4cG9ydCB0eXBlIEZsb2F0TGFiZWxUeXBlID0gJ2Fsd2F5cycgfCAnbmV2ZXInIHwgJ2F1dG8nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIGZvcm0gZmllbGQgdGhhdCBjYW4gYmUgY29uZmlndXJlZFxuICogdXNpbmcgdGhlIGBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlNgIGluamVjdGlvbiB0b2tlbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRGb3JtRmllbGREZWZhdWx0T3B0aW9ucyB7XG4gIGFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuICBoaWRlUmVxdWlyZWRNYXJrZXI/OiBib29sZWFuO1xuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgZm9yIGZvcm0tZmllbGRzIHNob3VsZCBieSBkZWZhdWx0IGZsb2F0IGBhbHdheXNgLFxuICAgKiBgbmV2ZXJgLCBvciBgYXV0b2AgKG9ubHkgd2hlbiBuZWNlc3NhcnkpLlxuICAgKi9cbiAgZmxvYXRMYWJlbD86IEZsb2F0TGFiZWxUeXBlO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGVcbiAqIGRlZmF1bHQgb3B0aW9ucyBmb3IgYWxsIGZvcm0gZmllbGQgd2l0aGluIGFuIGFwcC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zPignTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TJyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gaW5qZWN0IGFuIGluc3RhbmNlcyBvZiBgTWF0Rm9ybUZpZWxkYC4gSXQgc2VydmVzXG4gKiBhcyBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRGb3JtRmllbGRgIGNsYXNzIHdoaWNoIHdvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGBNYXRGb3JtRmllbGRgIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTEQgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkPignTWF0Rm9ybUZpZWxkJyk7XG5cbi8qKiBDb250YWluZXIgZm9yIGZvcm0gY29udHJvbHMgdGhhdCBhcHBsaWVzIE1hdGVyaWFsIERlc2lnbiBzdHlsaW5nIGFuZCBiZWhhdmlvci4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1mb3JtLWZpZWxkJyxcbiAgZXhwb3J0QXM6ICdtYXRGb3JtRmllbGQnLFxuICB0ZW1wbGF0ZVVybDogJ2Zvcm0tZmllbGQuaHRtbCcsXG4gIC8vIE1hdElucHV0IGlzIGEgZGlyZWN0aXZlIGFuZCBjYW4ndCBoYXZlIHN0eWxlcywgc28gd2UgbmVlZCB0byBpbmNsdWRlIGl0cyBzdHlsZXMgaGVyZVxuICAvLyBpbiBmb3JtLWZpZWxkLWlucHV0LmNzcy4gVGhlIE1hdElucHV0IHN0eWxlcyBhcmUgZmFpcmx5IG1pbmltYWwgc28gaXQgc2hvdWxkbid0IGJlIGFcbiAgLy8gYmlnIGRlYWwgZm9yIHBlb3BsZSB3aG8gYXJlbid0IHVzaW5nIE1hdElucHV0LlxuICBzdHlsZVVybHM6IFtcbiAgICAnZm9ybS1maWVsZC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWZpbGwuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1pbnB1dC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWxlZ2FjeS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLW91dGxpbmUuY3NzJyxcbiAgICAnZm9ybS1maWVsZC1zdGFuZGFyZC5jc3MnLFxuICBdLFxuICBhbmltYXRpb25zOiBbbWF0Rm9ybUZpZWxkQW5pbWF0aW9ucy50cmFuc2l0aW9uTWVzc2FnZXNdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1mb3JtLWZpZWxkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utc3RhbmRhcmRdJzogJ2FwcGVhcmFuY2UgPT0gXCJzdGFuZGFyZFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2UtZmlsbF0nOiAnYXBwZWFyYW5jZSA9PSBcImZpbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLW91dGxpbmVdJzogJ2FwcGVhcmFuY2UgPT0gXCJvdXRsaW5lXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1sZWdhY3ldJzogJ2FwcGVhcmFuY2UgPT0gXCJsZWdhY3lcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1pbnZhbGlkXSc6ICdfY29udHJvbC5lcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWNhbi1mbG9hdF0nOiAnX2NhbkxhYmVsRmxvYXQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXRdJzogJ19zaG91bGRMYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsXSc6ICdfaGFzRmxvYXRpbmdMYWJlbCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpZGUtcGxhY2Vob2xkZXJdJzogJ19oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtZGlzYWJsZWRdJzogJ19jb250cm9sLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWRdJzogJ19jb250cm9sLmF1dG9maWxsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvY3VzZWRdJzogJ19jb250cm9sLmZvY3VzZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInVudG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ19zaG91bGRGb3J3YXJkKFwicHJpc3RpbmVcIiknLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ19zaG91bGRGb3J3YXJkKFwiZGlydHlcIiknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwidmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJpbnZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ19zaG91bGRGb3J3YXJkKFwicGVuZGluZ1wiKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnIV9hbmltYXRpb25zRW5hYmxlZCcsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9GT1JNX0ZJRUxELCB1c2VFeGlzdGluZzogTWF0Rm9ybUZpZWxkfSxcbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZCBleHRlbmRzIF9NYXRGb3JtRmllbGRNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9sYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZFxuICAgKiBpbW1lZGlhdGVseSBvbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgbmV4dCB0aW1lIHRoZSB6b25lIGhhcyBzdGFiaWxpemVkLiAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBmb3JtLWZpZWxkIGFwcGVhcmFuY2Ugc3R5bGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgeyByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTsgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuYXBwZWFyYW5jZSkgfHwgJ2xlZ2FjeSc7XG5cbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSA9PT0gJ291dGxpbmUnICYmIG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgcmVxdWlyZWQgbWFya2VyIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUmVxdWlyZWRNYXJrZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXI7IH1cbiAgc2V0IGhpZGVSZXF1aXJlZE1hcmtlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGxvZ2ljIHRoYXQgZGlzYWJsZXMgdGhlIGxhYmVsIGFuaW1hdGlvbiBpbiBjZXJ0YWluIGNhc2VzLiAqL1xuICBwcml2YXRlIF9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBmbG9hdGluZyBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0IG9yIG5vdC4gKi9cbiAgX3Nob3VsZEFsd2F5c0Zsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZsb2F0TGFiZWwgPT09ICdhbHdheXMnICYmICF0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBjYW4gZmxvYXQgb3Igbm90LiAqL1xuICBfY2FuTGFiZWxGbG9hdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZmxvYXRMYWJlbCAhPT0gJ25ldmVyJzsgfVxuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgbWF0LWhpbnQgYW5kIG1hdC1lcnJvciBhbmltYXRpb25zLiAqL1xuICBfc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGU6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBUZXh0IGZvciB0aGUgZm9ybSBmaWVsZCBoaW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGludExhYmVsKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9oaW50TGFiZWw7IH1cbiAgc2V0IGhpbnRMYWJlbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faGludExhYmVsID0gdmFsdWU7XG4gICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGludExhYmVsID0gJyc7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaGludCBsYWJlbC5cbiAgX2hpbnRMYWJlbElkOiBzdHJpbmcgPSBgbWF0LWhpbnQtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8vIFVuaXF1ZSBpZCBmb3IgdGhlIGludGVybmFsIGZvcm0gZmllbGQgbGFiZWwuXG4gIF9sYWJlbElkID0gYG1hdC1mb3JtLWZpZWxkLWxhYmVsLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFsd2F5cyBmbG9hdCwgbmV2ZXIgZmxvYXQgb3IgZmxvYXQgYXMgdGhlIHVzZXIgdHlwZXMuXG4gICAqXG4gICAqIE5vdGU6IG9ubHkgdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHN1cHBvcnRzIHRoZSBgbmV2ZXJgIG9wdGlvbi4gYG5ldmVyYCB3YXMgb3JpZ2luYWxseSBhZGRlZCBhcyBhXG4gICAqIHdheSB0byBtYWtlIHRoZSBmbG9hdGluZyBsYWJlbCBlbXVsYXRlIHRoZSBiZWhhdmlvciBvZiBhIHN0YW5kYXJkIGlucHV0IHBsYWNlaG9sZGVyLiBIb3dldmVyXG4gICAqIHRoZSBmb3JtIGZpZWxkIG5vdyBzdXBwb3J0cyBib3RoIGZsb2F0aW5nIGxhYmVscyBhbmQgcGxhY2Vob2xkZXJzLiBUaGVyZWZvcmUgaW4gdGhlIG5vbi1sZWdhY3lcbiAgICogYXBwZWFyYW5jZXMgdGhlIGBuZXZlcmAgb3B0aW9uIGhhcyBiZWVuIGRpc2FibGVkIGluIGZhdm9yIG9mIGp1c3QgdXNpbmcgdGhlIHBsYWNlaG9sZGVyLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGZsb2F0TGFiZWwoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgIT09ICdsZWdhY3knICYmIHRoaXMuX2Zsb2F0TGFiZWwgPT09ICduZXZlcicgPyAnYXV0bycgOiB0aGlzLl9mbG9hdExhYmVsO1xuICB9XG4gIHNldCBmbG9hdExhYmVsKHZhbHVlOiBGbG9hdExhYmVsVHlwZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5fZmxvYXRMYWJlbCkge1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCA9IHZhbHVlIHx8IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9mbG9hdExhYmVsOiBGbG9hdExhYmVsVHlwZTtcblxuICAvKiogV2hldGhlciB0aGUgQW5ndWxhciBhbmltYXRpb25zIGFyZSBlbmFibGVkLiAqL1xuICBfYW5pbWF0aW9uc0VuYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjBcbiAgICovXG4gIEBWaWV3Q2hpbGQoJ3VuZGVybGluZScpIHVuZGVybGluZVJlZjogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKCdjb25uZWN0aW9uQ29udGFpbmVyJywge3N0YXRpYzogdHJ1ZX0pIF9jb25uZWN0aW9uQ29udGFpbmVyUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdpbnB1dENvbnRhaW5lcicpIF9pbnB1dENvbnRhaW5lclJlZjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbGFiZWwnKSBwcml2YXRlIF9sYWJlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgQENvbnRlbnRDaGlsZChNYXRGb3JtRmllbGRDb250cm9sKSBfY29udHJvbE5vblN0YXRpYzogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wsIHtzdGF0aWM6IHRydWV9KSBfY29udHJvbFN0YXRpYzogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuICBnZXQgX2NvbnRyb2woKSB7XG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIG5lZWQgdGhpcyB3b3JrYXJvdW5kIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gICAgLy8gIFdlIHNob3VsZCBjbGVhbiB0aGlzIHVwIG9uY2UgSXZ5IGlzIHRoZSBkZWZhdWx0IHJlbmRlcmVyLlxuICAgIHJldHVybiB0aGlzLl9leHBsaWNpdEZvcm1GaWVsZENvbnRyb2wgfHwgdGhpcy5fY29udHJvbE5vblN0YXRpYyB8fCB0aGlzLl9jb250cm9sU3RhdGljO1xuICB9XG4gIHNldCBfY29udHJvbCh2YWx1ZSkge1xuICAgIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbDogTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+O1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGFiZWwpIF9sYWJlbENoaWxkTm9uU3RhdGljOiBNYXRMYWJlbDtcbiAgQENvbnRlbnRDaGlsZChNYXRMYWJlbCwge3N0YXRpYzogdHJ1ZX0pIF9sYWJlbENoaWxkU3RhdGljOiBNYXRMYWJlbDtcbiAgQENvbnRlbnRDaGlsZChNYXRQbGFjZWhvbGRlcikgX3BsYWNlaG9sZGVyQ2hpbGQ6IE1hdFBsYWNlaG9sZGVyO1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfRVJST1IgYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfZXJyb3JDaGlsZHJlbjogUXVlcnlMaXN0PE1hdEVycm9yPjtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICBAQ29udGVudENoaWxkcmVuKF9NQVRfSElOVCBhcyBhbnksIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9oaW50Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRIaW50PjtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICBAQ29udGVudENoaWxkcmVuKE1BVF9QUkVGSVggYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfcHJlZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRQcmVmaXg+O1xuICAvLyBUT0RPOiBSZW1vdmUgY2FzdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8zNzUwNiBpcyBhdmFpbGFibGUuXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX1NVRkZJWCBhcyBhbnksIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9zdWZmaXhDaGlsZHJlbjogUXVlcnlMaXN0PE1hdFN1ZmZpeD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0xBQkVMX0dMT0JBTF9PUFRJT05TKSBsYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucyxcbiAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJpdmF0ZSBfZGVmYXVsdHM6XG4gICAgICAgICAgTWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnMsIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgX2FuaW1hdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcblxuICAgIHRoaXMuX2xhYmVsT3B0aW9ucyA9IGxhYmVsT3B0aW9ucyA/IGxhYmVsT3B0aW9ucyA6IHt9O1xuICAgIHRoaXMuZmxvYXRMYWJlbCA9IHRoaXMuX2dldERlZmF1bHRGbG9hdExhYmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25zRW5hYmxlZCA9IF9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRocm91Z2ggaGVyZSBzbyB3ZSBpbnZva2UgdGhlIHNldHRlciBvbiB0aGUgZmlyc3QgcnVuLlxuICAgIHRoaXMuYXBwZWFyYW5jZSA9IChfZGVmYXVsdHMgJiYgX2RlZmF1bHRzLmFwcGVhcmFuY2UpID8gX2RlZmF1bHRzLmFwcGVhcmFuY2UgOiAnbGVnYWN5JztcbiAgICB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXIgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5oaWRlUmVxdWlyZWRNYXJrZXIgIT0gbnVsbCkgP1xuICAgICAgICBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBFbGVtZW50UmVmIGZvciB0aGUgZWxlbWVudCB0aGF0IGEgb3ZlcmxheSBhdHRhY2hlZCB0byB0aGUgZm9ybS1maWVsZCBzaG91bGQgYmVcbiAgICogcG9zaXRpb25lZCByZWxhdGl2ZSB0by5cbiAgICovXG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYgfHwgdGhpcy5fZWxlbWVudFJlZjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuXG4gICAgY29uc3QgY29udHJvbCA9IHRoaXMuX2NvbnRyb2w7XG5cbiAgICBpZiAoY29udHJvbC5jb250cm9sVHlwZSkge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1mb3JtLWZpZWxkLXR5cGUtJHtjb250cm9sLmNvbnRyb2xUeXBlfWApO1xuICAgIH1cblxuICAgIC8vIFN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBjaGlsZCBjb250cm9sIHN0YXRlIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgZm9ybSBmaWVsZCBVSS5cbiAgICBjb250cm9sLnN0YXRlQ2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsISkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl92YWxpZGF0ZVBsYWNlaG9sZGVycygpO1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIGlmIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgIGlmIChjb250cm9sLm5nQ29udHJvbCAmJiBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXMpIHtcbiAgICAgIGNvbnRyb2wubmdDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIGhhdmUgdG8gcnVuIG91dHNpZGUgb2YgdGhlIGBOZ1pvbmVgIGV4cGxpY2l0bHksXG4gICAgLy8gaW4gb3JkZXIgdG8gYXZvaWQgdGhyb3dpbmcgdXNlcnMgaW50byBhbiBpbmZpbml0ZSBsb29wXG4gICAgLy8gaWYgYHpvbmUtcGF0Y2gtcnhqc2AgaXMgaW5jbHVkZWQuXG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBhbmQgdXBkYXRlIHRoZSBvdXRsaW5lIGlmIHRoZSBzdWZmaXggb3IgcHJlZml4IGNoYW5nZXMuXG4gICAgbWVyZ2UodGhpcy5fcHJlZml4Q2hpbGRyZW4uY2hhbmdlcywgdGhpcy5fc3VmZml4Q2hpbGRyZW4uY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gUmUtdmFsaWRhdGUgd2hlbiB0aGUgbnVtYmVyIG9mIGhpbnRzIGNoYW5nZXMuXG4gICAgdGhpcy5faGludENoaWxkcmVuLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhcmlhLWRlc2NyaWJlZCBieSB3aGVuIHRoZSBudW1iZXIgb2YgZXJyb3JzIGNoYW5nZXMuXG4gICAgdGhpcy5fZXJyb3JDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fc3luY0Rlc2NyaWJlZEJ5SWRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9kaXIpIHtcbiAgICAgIHRoaXMuX2Rpci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlQ29udHJvbENoaWxkKCk7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQXZvaWQgYW5pbWF0aW9ucyBvbiBsb2FkLlxuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gJ2VudGVyJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGNsYXNzIGZyb20gdGhlIE5nQ29udHJvbCBzaG91bGQgYmUgZm9yd2FyZGVkIHRvIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIF9zaG91bGRGb3J3YXJkKHByb3A6IGtleW9mIE5nQ29udHJvbCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMuX2NvbnRyb2wgPyB0aGlzLl9jb250cm9sLm5nQ29udHJvbCA6IG51bGw7XG4gICAgcmV0dXJuIG5nQ29udHJvbCAmJiBuZ0NvbnRyb2xbcHJvcF07XG4gIH1cblxuICBfaGFzUGxhY2Vob2xkZXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2NvbnRyb2wgJiYgdGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciB8fCB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKTtcbiAgfVxuXG4gIF9oYXNMYWJlbCgpIHtcbiAgICByZXR1cm4gISEodGhpcy5fbGFiZWxDaGlsZE5vblN0YXRpYyB8fCB0aGlzLl9sYWJlbENoaWxkU3RhdGljKTtcbiAgfVxuXG4gIF9zaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiB0aGlzLl9jYW5MYWJlbEZsb2F0KCkgJiZcbiAgICAgICAgKCh0aGlzLl9jb250cm9sICYmIHRoaXMuX2NvbnRyb2wuc2hvdWxkTGFiZWxGbG9hdCkgfHwgdGhpcy5fc2hvdWxkQWx3YXlzRmxvYXQoKSk7XG4gIH1cblxuICBfaGlkZUNvbnRyb2xQbGFjZWhvbGRlcigpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgIXRoaXMuX2hhc0xhYmVsKCkgfHxcbiAgICAgICAgdGhpcy5faGFzTGFiZWwoKSAmJiAhdGhpcy5fc2hvdWxkTGFiZWxGbG9hdCgpO1xuICB9XG5cbiAgX2hhc0Zsb2F0aW5nTGFiZWwoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLl9oYXNMYWJlbCgpIHx8IHRoaXMuYXBwZWFyYW5jZSA9PT0gJ2xlZ2FjeScgJiYgdGhpcy5faGFzUGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZGlzcGxheSBoaW50cyBvciBlcnJvcnMuICovXG4gIF9nZXREaXNwbGF5ZWRNZXNzYWdlcygpOiAnZXJyb3InIHwgJ2hpbnQnIHtcbiAgICByZXR1cm4gKHRoaXMuX2Vycm9yQ2hpbGRyZW4gJiYgdGhpcy5fZXJyb3JDaGlsZHJlbi5sZW5ndGggPiAwICYmXG4gICAgICAgIHRoaXMuX2NvbnRyb2wuZXJyb3JTdGF0ZSkgPyAnZXJyb3InIDogJ2hpbnQnO1xuICB9XG5cbiAgLyoqIEFuaW1hdGVzIHRoZSBwbGFjZWhvbGRlciB1cCBhbmQgbG9ja3MgaXQgaW4gcG9zaXRpb24uICovXG4gIF9hbmltYXRlQW5kTG9ja0xhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9oYXNGbG9hdGluZ0xhYmVsKCkgJiYgdGhpcy5fY2FuTGFiZWxGbG9hdCgpKSB7XG4gICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgd2Ugc2hvdWxkbid0IGdvIGluIGhlcmUsXG4gICAgICAvLyBiZWNhdXNlIHRoZSBgdHJhbnNpdGlvbmVuZGAgd2lsbCBuZXZlciBmaXJlLlxuICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkICYmIHRoaXMuX2xhYmVsKSB7XG4gICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICBmcm9tRXZlbnQodGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIHBsYWNlaG9sZGVyIChlaXRoZXIgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb24gdGhlIGNoaWxkIGNvbnRyb2xcbiAgICogb3IgY2hpbGQgZWxlbWVudCB3aXRoIHRoZSBgbWF0LXBsYWNlaG9sZGVyYCBkaXJlY3RpdmUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgJiYgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgYW55IGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy4gKi9cbiAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcbiAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYDxtYXQtaGludD5gIGFsaWdubWVudCBzcGVjaWZpZWQsIHdpdGggdGhlXG4gICAqIGF0dHJpYnV0ZSBiZWluZyBjb25zaWRlcmVkIGFzIGBhbGlnbj1cInN0YXJ0XCJgLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpIHtcbiAgICBpZiAodGhpcy5faGludENoaWxkcmVuKSB7XG4gICAgICBsZXQgc3RhcnRIaW50OiBNYXRIaW50O1xuICAgICAgbGV0IGVuZEhpbnQ6IE1hdEhpbnQ7XG4gICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogTWF0SGludCkgPT4ge1xuICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGlmIChzdGFydEhpbnQgfHwgdGhpcy5oaW50TGFiZWwpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignZW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGVmYXVsdCBmbG9hdCBsYWJlbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5mbG9hdExhYmVsKSB8fCB0aGlzLl9sYWJlbE9wdGlvbnMuZmxvYXQgfHwgJ2F1dG8nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBkZXNjcmliZSB0aGUgY2hpbGQgY29udHJvbC4gVGhpcyBhbGxvd3MgdGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAqIGl0cyBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0Rlc2NyaWJlZEJ5SWRzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XG4gICAgICBsZXQgaWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKSA9PT0gJ2hpbnQnKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdlbmQnKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXJ0SGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faGludExhYmVsKSB7XG4gICAgICAgICAgaWRzLnB1c2godGhpcy5faGludExhYmVsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJvckNoaWxkcmVuKSB7XG4gICAgICAgIGlkcyA9IHRoaXMuX2Vycm9yQ2hpbGRyZW4ubWFwKGVycm9yID0+IGVycm9yLmlkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29udHJvbC5zZXREZXNjcmliZWRCeUlkcyhpZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGZvcm0gZmllbGQncyBjb250cm9sIGlzIG1pc3NpbmcuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVDb250cm9sQ2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250cm9sKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZSBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZVxuICAgKiBhcHBlYXJhbmNlLlxuICAgKi9cbiAgdXBkYXRlT3V0bGluZUdhcCgpIHtcbiAgICBjb25zdCBsYWJlbEVsID0gdGhpcy5fbGFiZWwgPyB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmICh0aGlzLmFwcGVhcmFuY2UgIT09ICdvdXRsaW5lJyB8fCAhbGFiZWxFbCB8fCAhbGFiZWxFbC5jaGlsZHJlbi5sZW5ndGggfHxcbiAgICAgICAgIWxhYmVsRWwudGV4dENvbnRlbnQhLnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXNuJ3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IGluIHRoZSBET00sIHRoZSBvdXRsaW5lIGdhcCB3aWxsIG5lZWQgdG8gYmUgY2FsY3VsYXRlZFxuICAgIC8vIHRoZSBuZXh0IHRpbWUgaXQgaXMgY2hlY2tlZCBhbmQgaW4gdGhlIERPTS5cbiAgICBpZiAoIXRoaXMuX2lzQXR0YWNoZWRUb0RPTSgpKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0V2lkdGggPSAwO1xuICAgIGxldCBnYXBXaWR0aCA9IDA7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnQnKTtcbiAgICBjb25zdCBnYXBFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJyk7XG5cbiAgICBpZiAodGhpcy5fbGFiZWwgJiYgdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb250YWluZXIncyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLCBpdCBtZWFucyB0aGF0IHRoZSBlbGVtZW50IGlzXG4gICAgICAvLyBpbnZpc2libGUgYW5kIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgb3V0bGluZSBnYXAuIE1hcmsgdGhlIGVsZW1lbnQgYXMgbmVlZGluZ1xuICAgICAgLy8gdG8gYmUgY2hlY2tlZCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuIFdlIGNhbid0IGRvIHRoaXMgaW1tZWRpYXRlbHlcbiAgICAgIC8vIG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24sIGJlY2F1c2UgZXZlbiBpZiB0aGUgZWxlbWVudCBiZWNvbWVzIHZpc2libGUsXG4gICAgICAvLyB0aGUgYENsaWVudFJlY3RgIHdvbid0IGJlIHJlY2xhY3VsYXRlZCBpbW1lZGlhdGVseS4gV2UgcmVzZXQgdGhlXG4gICAgICAvLyBgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5YCBmbGFnIHNvbWUgd2UgZG9uJ3QgcnVuIHRoZSBjaGVja3MgdHdpY2UuXG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChjb250YWluZXJSZWN0KTtcbiAgICAgIGNvbnN0IGxhYmVsQ2hpbGRyZW4gPSBsYWJlbEVsLmNoaWxkcmVuO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsQ2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhYmVsQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSAobGFiZWxDaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgICBzdGFydFdpZHRoID0gTWF0aC5hYnMobGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0KSAtIG91dGxpbmVHYXBQYWRkaW5nO1xuICAgICAgZ2FwV2lkdGggPSBsYWJlbFdpZHRoID4gMCA/IGxhYmVsV2lkdGggKiBmbG9hdGluZ0xhYmVsU2NhbGUgKyBvdXRsaW5lR2FwUGFkZGluZyAqIDIgOiAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJ0RWxzW2ldLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtnYXBXaWR0aH1weGA7XG4gICAgfVxuXG4gICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPVxuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN0YXJ0IGVuZCBvZiB0aGUgcmVjdCBjb25zaWRlcmluZyB0aGUgY3VycmVudCBkaXJlY3Rpb25hbGl0eS4gKi9cbiAgcHJpdmF0ZSBfZ2V0U3RhcnRFbmQocmVjdDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0O1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBmb3JtIGZpZWxkIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gIHByaXZhdGUgX2lzQXR0YWNoZWRUb0RPTSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50LmdldFJvb3ROb2RlKSB7XG4gICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgRE9NIHRoZSByb290IG5vZGUgd2lsbCBiZSBlaXRoZXIgdGhlIGRvY3VtZW50XG4gICAgICAvLyBvciB0aGUgY2xvc2VzdCBzaGFkb3cgcm9vdCwgb3RoZXJ3aXNlIGl0J2xsIGJlIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiByb290Tm9kZSAmJiByb290Tm9kZSAhPT0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGNoZWNraW5nIGlmIGl0J3MgaW4gdGhlIGRvY3VtZW50LiBUaGlzIGRvZXNuJ3QgYWNjb3VudCBmb3JcbiAgICAvLyBzaGFkb3cgRE9NLCBob3dldmVyIGJyb3dzZXIgdGhhdCBzdXBwb3J0IHNoYWRvdyBET00gc2hvdWxkIHN1cHBvcnQgYGdldFJvb3ROb2RlYCBhcyB3ZWxsLlxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNvbnRhaW5zKGVsZW1lbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVSZXF1aXJlZE1hcmtlcjogQm9vbGVhbklucHV0O1xufVxuIl19