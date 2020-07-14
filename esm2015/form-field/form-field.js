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
    get _shouldAlwaysFloat() {
        return this.floatLabel === 'always' && !this._showAlwaysAnimate;
    }
    /** Whether the label can float or not. */
    get _canLabelFloat() { return this.floatLabel !== 'never'; }
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
    get _labelChild() {
        return this._labelChildNonStatic || this._labelChildStatic;
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
        return !!this._labelChild;
    }
    _shouldLabelFloat() {
        return this._canLabelFloat &&
            ((this._control && this._control.shouldLabelFloat) || this._shouldAlwaysFloat);
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
        if (this._hasFloatingLabel() && this._canLabelFloat) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCx3QkFBd0IsRUFDeEIsVUFBVSxHQUNYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQVcsTUFBTSxTQUFTLENBQUM7QUFDNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxrQ0FBa0MsRUFDbEMsdUNBQXVDLEdBQ3hDLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBVSxNQUFNLFFBQVEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9B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LFFBQVEsWUFBSSxNQUFNLFNBQUMsOEJBQThCO1lBalBoRCxRQUFRO1lBNUJkLE1BQU07eUNBK1FELFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7eUJBdEg1QyxLQUFLO2lDQWNMLEtBQUs7d0JBc0JMLEtBQUs7eUJBc0JMLEtBQUs7MkJBbUJMLFNBQVMsU0FBQyxXQUFXO3NDQUVyQixTQUFTLFNBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2lDQUMvQyxTQUFTLFNBQUMsZ0JBQWdCO3FCQUMxQixTQUFTLFNBQUMsT0FBTztnQ0FFakIsWUFBWSxTQUFDLG1CQUFtQjs2QkFDaEMsWUFBWSxTQUFDLG1CQUFtQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzttQ0FXaEQsWUFBWSxTQUFDLFFBQVE7Z0NBQ3JCLFlBQVksU0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dDQUtyQyxZQUFZLFNBQUMsY0FBYzs2QkFHM0IsZUFBZSxTQUFDLFNBQWdCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQUVyRCxlQUFlLFNBQUMsU0FBZ0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBRXJELGVBQWUsU0FBQyxVQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs4QkFFdEQsZUFBZSxTQUFDLFVBQWlCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLFxuICBMYWJlbE9wdGlvbnMsXG4gIE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgbWVyZ2UsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNQVRfRVJST1IsIE1hdEVycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7bWF0Rm9ybUZpZWxkQW5pbWF0aW9uc30gZnJvbSAnLi9mb3JtLWZpZWxkLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sfSBmcm9tICcuL2Zvcm0tZmllbGQtY29udHJvbCc7XG5pbXBvcnQge1xuICBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRQbGFjZWhvbGRlckNvbmZsaWN0RXJyb3IsXG59IGZyb20gJy4vZm9ybS1maWVsZC1lcnJvcnMnO1xuaW1wb3J0IHtfTUFUX0hJTlQsIE1hdEhpbnR9IGZyb20gJy4vaGludCc7XG5pbXBvcnQge01hdExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7TWF0UGxhY2Vob2xkZXJ9IGZyb20gJy4vcGxhY2Vob2xkZXInO1xuaW1wb3J0IHtNQVRfUFJFRklYLCBNYXRQcmVmaXh9IGZyb20gJy4vcHJlZml4JztcbmltcG9ydCB7TUFUX1NVRkZJWCwgTWF0U3VmZml4fSBmcm9tICcuL3N1ZmZpeCc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuY29uc3QgZmxvYXRpbmdMYWJlbFNjYWxlID0gMC43NTtcbmNvbnN0IG91dGxpbmVHYXBQYWRkaW5nID0gNTtcblxuXG4vKipcbiAqIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Rm9ybUZpZWxkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBNYXRGb3JtRmllbGRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIHdoaWNoIHdlJ3JlIGFwcGx5aW5nIHRoZSBmb3JtIGZpZWxkIG1peGlucy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgX01hdEZvcm1GaWVsZE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEZvcm1GaWVsZEJhc2UgPVxuICAgIG1peGluQ29sb3IoTWF0Rm9ybUZpZWxkQmFzZSwgJ3ByaW1hcnknKTtcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgZm9ybSBmaWVsZC4gKi9cbmV4cG9ydCB0eXBlIE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCcgfCAnZmlsbCcgfCAnb3V0bGluZSc7XG5cbi8qKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBcImZsb2F0TGFiZWxcIiBmb3JtLWZpZWxkIGlucHV0LiAqL1xuZXhwb3J0IHR5cGUgRmxvYXRMYWJlbFR5cGUgPSAnYWx3YXlzJyB8ICduZXZlcicgfCAnYXV0byc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgZm9ybSBmaWVsZCB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zIHtcbiAgYXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gIGhpZGVSZXF1aXJlZE1hcmtlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBmb3IgZm9ybS1maWVsZHMgc2hvdWxkIGJ5IGRlZmF1bHQgZmxvYXQgYGFsd2F5c2AsXG4gICAqIGBuZXZlcmAsIG9yIGBhdXRvYCAob25seSB3aGVuIG5lY2Vzc2FyeSkuXG4gICAqL1xuICBmbG9hdExhYmVsPzogRmxvYXRMYWJlbFR5cGU7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgZm9ybSBmaWVsZCB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnM+KCdNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBpbmplY3QgYW4gaW5zdGFuY2VzIG9mIGBNYXRGb3JtRmllbGRgLiBJdCBzZXJ2ZXNcbiAqIGFzIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdEZvcm1GaWVsZGAgY2xhc3Mgd2hpY2ggd291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgYE1hdEZvcm1GaWVsZGAgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRk9STV9GSUVMRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRGb3JtRmllbGQ+KCdNYXRGb3JtRmllbGQnKTtcblxuLyoqIENvbnRhaW5lciBmb3IgZm9ybSBjb250cm9scyB0aGF0IGFwcGxpZXMgTWF0ZXJpYWwgRGVzaWduIHN0eWxpbmcgYW5kIGJlaGF2aW9yLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvcm0tZmllbGQnLFxuICBleHBvcnRBczogJ21hdEZvcm1GaWVsZCcsXG4gIHRlbXBsYXRlVXJsOiAnZm9ybS1maWVsZC5odG1sJyxcbiAgLy8gTWF0SW5wdXQgaXMgYSBkaXJlY3RpdmUgYW5kIGNhbid0IGhhdmUgc3R5bGVzLCBzbyB3ZSBuZWVkIHRvIGluY2x1ZGUgaXRzIHN0eWxlcyBoZXJlXG4gIC8vIGluIGZvcm0tZmllbGQtaW5wdXQuY3NzLiBUaGUgTWF0SW5wdXQgc3R5bGVzIGFyZSBmYWlybHkgbWluaW1hbCBzbyBpdCBzaG91bGRuJ3QgYmUgYVxuICAvLyBiaWcgZGVhbCBmb3IgcGVvcGxlIHdobyBhcmVuJ3QgdXNpbmcgTWF0SW5wdXQuXG4gIHN0eWxlVXJsczogW1xuICAgICdmb3JtLWZpZWxkLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtZmlsbC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWlucHV0LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtbGVnYWN5LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtb3V0bGluZS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLXN0YW5kYXJkLmNzcycsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFttYXRGb3JtRmllbGRBbmltYXRpb25zLnRyYW5zaXRpb25NZXNzYWdlc10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvcm0tZmllbGQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PSBcInN0YW5kYXJkXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1maWxsXSc6ICdhcHBlYXJhbmNlID09IFwiZmlsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utb3V0bGluZV0nOiAnYXBwZWFyYW5jZSA9PSBcIm91dGxpbmVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWxlZ2FjeV0nOiAnYXBwZWFyYW5jZSA9PSBcImxlZ2FjeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWludmFsaWRdJzogJ19jb250cm9sLmVycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtY2FuLWZsb2F0XSc6ICdfY2FuTGFiZWxGbG9hdCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXRdJzogJ19zaG91bGRMYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsXSc6ICdfaGFzRmxvYXRpbmdMYWJlbCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpZGUtcGxhY2Vob2xkZXJdJzogJ19oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtZGlzYWJsZWRdJzogJ19jb250cm9sLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWRdJzogJ19jb250cm9sLmF1dG9maWxsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvY3VzZWRdJzogJ19jb250cm9sLmZvY3VzZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInVudG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ19zaG91bGRGb3J3YXJkKFwicHJpc3RpbmVcIiknLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ19zaG91bGRGb3J3YXJkKFwiZGlydHlcIiknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwidmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJpbnZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ19zaG91bGRGb3J3YXJkKFwicGVuZGluZ1wiKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnIV9hbmltYXRpb25zRW5hYmxlZCcsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9GT1JNX0ZJRUxELCB1c2VFeGlzdGluZzogTWF0Rm9ybUZpZWxkfSxcbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZCBleHRlbmRzIF9NYXRGb3JtRmllbGRNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9sYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZFxuICAgKiBpbW1lZGlhdGVseSBvbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgbmV4dCB0aW1lIHRoZSB6b25lIGhhcyBzdGFiaWxpemVkLiAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBmb3JtLWZpZWxkIGFwcGVhcmFuY2Ugc3R5bGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgeyByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTsgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuYXBwZWFyYW5jZSkgfHwgJ2xlZ2FjeSc7XG5cbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSA9PT0gJ291dGxpbmUnICYmIG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgcmVxdWlyZWQgbWFya2VyIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUmVxdWlyZWRNYXJrZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXI7IH1cbiAgc2V0IGhpZGVSZXF1aXJlZE1hcmtlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGxvZ2ljIHRoYXQgZGlzYWJsZXMgdGhlIGxhYmVsIGFuaW1hdGlvbiBpbiBjZXJ0YWluIGNhc2VzLiAqL1xuICBwcml2YXRlIF9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBmbG9hdGluZyBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9zaG91bGRBbHdheXNGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mbG9hdExhYmVsID09PSAnYWx3YXlzJyAmJiAhdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgY2FuIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9jYW5MYWJlbEZsb2F0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5mbG9hdExhYmVsICE9PSAnbmV2ZXInOyB9XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBmb3JtIGZpZWxkIGhpbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaW50TGFiZWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2hpbnRMYWJlbDsgfVxuICBzZXQgaGludExhYmVsKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaW50TGFiZWwgPSB2YWx1ZTtcbiAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgfVxuICBwcml2YXRlIF9oaW50TGFiZWwgPSAnJztcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBoaW50IGxhYmVsLlxuICBfaGludExhYmVsSWQ6IHN0cmluZyA9IGBtYXQtaGludC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaW50ZXJuYWwgZm9ybSBmaWVsZCBsYWJlbC5cbiAgX2xhYmVsSWQgPSBgbWF0LWZvcm0tZmllbGQtbGFiZWwtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0LCBuZXZlciBmbG9hdCBvciBmbG9hdCBhcyB0aGUgdXNlciB0eXBlcy5cbiAgICpcbiAgICogTm90ZTogb25seSB0aGUgbGVnYWN5IGFwcGVhcmFuY2Ugc3VwcG9ydHMgdGhlIGBuZXZlcmAgb3B0aW9uLiBgbmV2ZXJgIHdhcyBvcmlnaW5hbGx5IGFkZGVkIGFzIGFcbiAgICogd2F5IHRvIG1ha2UgdGhlIGZsb2F0aW5nIGxhYmVsIGVtdWxhdGUgdGhlIGJlaGF2aW9yIG9mIGEgc3RhbmRhcmQgaW5wdXQgcGxhY2Vob2xkZXIuIEhvd2V2ZXJcbiAgICogdGhlIGZvcm0gZmllbGQgbm93IHN1cHBvcnRzIGJvdGggZmxvYXRpbmcgbGFiZWxzIGFuZCBwbGFjZWhvbGRlcnMuIFRoZXJlZm9yZSBpbiB0aGUgbm9uLWxlZ2FjeVxuICAgKiBhcHBlYXJhbmNlcyB0aGUgYG5ldmVyYCBvcHRpb24gaGFzIGJlZW4gZGlzYWJsZWQgaW4gZmF2b3Igb2YganVzdCB1c2luZyB0aGUgcGxhY2Vob2xkZXIuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZmxvYXRMYWJlbCgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSAhPT0gJ2xlZ2FjeScgJiYgdGhpcy5fZmxvYXRMYWJlbCA9PT0gJ25ldmVyJyA/ICdhdXRvJyA6IHRoaXMuX2Zsb2F0TGFiZWw7XG4gIH1cbiAgc2V0IGZsb2F0TGFiZWwodmFsdWU6IEZsb2F0TGFiZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mbG9hdExhYmVsKSB7XG4gICAgICB0aGlzLl9mbG9hdExhYmVsID0gdmFsdWUgfHwgdGhpcy5fZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Zsb2F0TGFiZWw6IEZsb2F0TGFiZWxUeXBlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBBbmd1bGFyIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRW5hYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQFZpZXdDaGlsZCgndW5kZXJsaW5lJykgdW5kZXJsaW5lUmVmOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2Nvbm5lY3Rpb25Db250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX2Nvbm5lY3Rpb25Db250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Q29udGFpbmVyJykgX2lucHV0Q29udGFpbmVyUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdsYWJlbCcpIHByaXZhdGUgX2xhYmVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wpIF9jb250cm9sTm9uU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCwge3N0YXRpYzogdHJ1ZX0pIF9jb250cm9sU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIGdldCBfY29udHJvbCgpIHtcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbmVlZCB0aGlzIHdvcmthcm91bmQgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgICAvLyAgV2Ugc2hvdWxkIGNsZWFuIHRoaXMgdXAgb25jZSBJdnkgaXMgdGhlIGRlZmF1bHQgcmVuZGVyZXIuXG4gICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCB8fCB0aGlzLl9jb250cm9sTm9uU3RhdGljIHx8IHRoaXMuX2NvbnRyb2xTdGF0aWM7XG4gIH1cbiAgc2V0IF9jb250cm9sKHZhbHVlKSB7XG4gICAgdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRGb3JtRmllbGRDb250cm9sOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMYWJlbCkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBnZXQgX2xhYmVsQ2hpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYztcbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcblxuICAvLyBUT0RPOiBSZW1vdmUgY2FzdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8zNzUwNiBpcyBhdmFpbGFibGUuXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX0VSUk9SIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihfTUFUX0hJTlQgYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfUFJFRklYIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICBAQ29udGVudENoaWxkcmVuKE1BVF9TVUZGSVggYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3VmZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRTdWZmaXg+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUykgbGFiZWxPcHRpb25zOiBMYWJlbE9wdGlvbnMsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRzOlxuICAgICAgICAgIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zLCBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9sYWJlbE9wdGlvbnMgPSBsYWJlbE9wdGlvbnMgPyBsYWJlbE9wdGlvbnMgOiB7fTtcbiAgICB0aGlzLmZsb2F0TGFiZWwgPSB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgPSBfYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCB0aHJvdWdoIGhlcmUgc28gd2UgaW52b2tlIHRoZSBzZXR0ZXIgb24gdGhlIGZpcnN0IHJ1bi5cbiAgICB0aGlzLmFwcGVhcmFuY2UgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5hcHBlYXJhbmNlKSA/IF9kZWZhdWx0cy5hcHBlYXJhbmNlIDogJ2xlZ2FjeSc7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gKF9kZWZhdWx0cyAmJiBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyICE9IG51bGwpID9cbiAgICAgICAgX2RlZmF1bHRzLmhpZGVSZXF1aXJlZE1hcmtlciA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gRWxlbWVudFJlZiBmb3IgdGhlIGVsZW1lbnQgdGhhdCBhIG92ZXJsYXkgYXR0YWNoZWQgdG8gdGhlIGZvcm0tZmllbGQgc2hvdWxkIGJlXG4gICAqIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8uXG4gICAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmIHx8IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcblxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLl9jb250cm9sO1xuXG4gICAgaWYgKGNvbnRyb2wuY29udHJvbFR5cGUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtZm9ybS1maWVsZC10eXBlLSR7Y29udHJvbC5jb250cm9sVHlwZX1gKTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgY2hpbGQgY29udHJvbCBzdGF0ZSBpbiBvcmRlciB0byB1cGRhdGUgdGhlIGZvcm0gZmllbGQgVUkuXG4gICAgY29udHJvbC5zdGF0ZUNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBpZiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICBpZiAoY29udHJvbC5uZ0NvbnRyb2wgJiYgY29udHJvbC5uZ0NvbnRyb2wudmFsdWVDaGFuZ2VzKSB7XG4gICAgICBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXNcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB3ZSBoYXZlIHRvIHJ1biBvdXRzaWRlIG9mIHRoZSBgTmdab25lYCBleHBsaWNpdGx5LFxuICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIHRocm93aW5nIHVzZXJzIGludG8gYW4gaW5maW5pdGUgbG9vcFxuICAgIC8vIGlmIGB6b25lLXBhdGNoLXJ4anNgIGlzIGluY2x1ZGVkLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gYW5kIHVwZGF0ZSB0aGUgb3V0bGluZSBpZiB0aGUgc3VmZml4IG9yIHByZWZpeCBjaGFuZ2VzLlxuICAgIG1lcmdlKHRoaXMuX3ByZWZpeENoaWxkcmVuLmNoYW5nZXMsIHRoaXMuX3N1ZmZpeENoaWxkcmVuLmNoYW5nZXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJlLXZhbGlkYXRlIHdoZW4gdGhlIG51bWJlciBvZiBoaW50cyBjaGFuZ2VzLlxuICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJpYS1kZXNjcmliZWQgYnkgd2hlbiB0aGUgbnVtYmVyIG9mIGVycm9ycyBjaGFuZ2VzLlxuICAgIHRoaXMuX2Vycm9yQ2hpbGRyZW4uY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuICAgIGlmICh0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSkge1xuICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEF2b2lkIGFuaW1hdGlvbnMgb24gbG9hZC5cbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBjbGFzcyBmcm9tIHRoZSBOZ0NvbnRyb2wgc2hvdWxkIGJlIGZvcndhcmRlZCB0byB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfc2hvdWxkRm9yd2FyZChwcm9wOiBrZXlvZiBOZ0NvbnRyb2wpOiBib29sZWFuIHtcbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9jb250cm9sID8gdGhpcy5fY29udHJvbC5uZ0NvbnRyb2wgOiBudWxsO1xuICAgIHJldHVybiBuZ0NvbnRyb2wgJiYgbmdDb250cm9sW3Byb3BdO1xuICB9XG5cbiAgX2hhc1BsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiAhISh0aGlzLl9jb250cm9sICYmIHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgfHwgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCk7XG4gIH1cblxuICBfaGFzTGFiZWwoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fbGFiZWxDaGlsZDtcbiAgfVxuXG4gIF9zaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiB0aGlzLl9jYW5MYWJlbEZsb2F0ICYmXG4gICAgICAgICgodGhpcy5fY29udHJvbCAmJiB0aGlzLl9jb250cm9sLnNob3VsZExhYmVsRmxvYXQpIHx8IHRoaXMuX3Nob3VsZEFsd2F5c0Zsb2F0KTtcbiAgfVxuXG4gIF9oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiAhdGhpcy5faGFzTGFiZWwoKSB8fFxuICAgICAgICB0aGlzLl9oYXNMYWJlbCgpICYmICF0aGlzLl9zaG91bGRMYWJlbEZsb2F0KCk7XG4gIH1cblxuICBfaGFzRmxvYXRpbmdMYWJlbCgpIHtcbiAgICAvLyBJbiB0aGUgbGVnYWN5IGFwcGVhcmFuY2UgdGhlIHBsYWNlaG9sZGVyIGlzIHByb21vdGVkIHRvIGEgbGFiZWwgaWYgbm8gbGFiZWwgaXMgZ2l2ZW4uXG4gICAgcmV0dXJuIHRoaXMuX2hhc0xhYmVsKCkgfHwgdGhpcy5hcHBlYXJhbmNlID09PSAnbGVnYWN5JyAmJiB0aGlzLl9oYXNQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0byBkaXNwbGF5IGhpbnRzIG9yIGVycm9ycy4gKi9cbiAgX2dldERpc3BsYXllZE1lc3NhZ2VzKCk6ICdlcnJvcicgfCAnaGludCcge1xuICAgIHJldHVybiAodGhpcy5fZXJyb3JDaGlsZHJlbiAmJiB0aGlzLl9lcnJvckNoaWxkcmVuLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgdGhpcy5fY29udHJvbC5lcnJvclN0YXRlKSA/ICdlcnJvcicgOiAnaGludCc7XG4gIH1cblxuICAvKiogQW5pbWF0ZXMgdGhlIHBsYWNlaG9sZGVyIHVwIGFuZCBsb2NrcyBpdCBpbiBwb3NpdGlvbi4gKi9cbiAgX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2hhc0Zsb2F0aW5nTGFiZWwoKSAmJiB0aGlzLl9jYW5MYWJlbEZsb2F0KSB7XG4gICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZCwgd2Ugc2hvdWxkbid0IGdvIGluIGhlcmUsXG4gICAgICAvLyBiZWNhdXNlIHRoZSBgdHJhbnNpdGlvbmVuZGAgd2lsbCBuZXZlciBmaXJlLlxuICAgICAgaWYgKHRoaXMuX2FuaW1hdGlvbnNFbmFibGVkICYmIHRoaXMuX2xhYmVsKSB7XG4gICAgICAgIHRoaXMuX3Nob3dBbHdheXNBbmltYXRlID0gdHJ1ZTtcblxuICAgICAgICBmcm9tRXZlbnQodGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIG9ubHkgb25lIHBsYWNlaG9sZGVyIChlaXRoZXIgYHBsYWNlaG9sZGVyYCBhdHRyaWJ1dGUgb24gdGhlIGNoaWxkIGNvbnRyb2xcbiAgICogb3IgY2hpbGQgZWxlbWVudCB3aXRoIHRoZSBgbWF0LXBsYWNlaG9sZGVyYCBkaXJlY3RpdmUpLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVQbGFjZWhvbGRlcnMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgJiYgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCkge1xuICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkUGxhY2Vob2xkZXJDb25mbGljdEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERvZXMgYW55IGV4dHJhIHByb2Nlc3NpbmcgdGhhdCBpcyByZXF1aXJlZCB3aGVuIGhhbmRsaW5nIHRoZSBoaW50cy4gKi9cbiAgcHJpdmF0ZSBfcHJvY2Vzc0hpbnRzKCkge1xuICAgIHRoaXMuX3ZhbGlkYXRlSGludHMoKTtcbiAgICB0aGlzLl9zeW5jRGVzY3JpYmVkQnlJZHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnN1cmUgdGhhdCB0aGVyZSBpcyBhIG1heGltdW0gb2Ygb25lIG9mIGVhY2ggYDxtYXQtaGludD5gIGFsaWdubWVudCBzcGVjaWZpZWQsIHdpdGggdGhlXG4gICAqIGF0dHJpYnV0ZSBiZWluZyBjb25zaWRlcmVkIGFzIGBhbGlnbj1cInN0YXJ0XCJgLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmFsaWRhdGVIaW50cygpIHtcbiAgICBpZiAodGhpcy5faGludENoaWxkcmVuKSB7XG4gICAgICBsZXQgc3RhcnRIaW50OiBNYXRIaW50O1xuICAgICAgbGV0IGVuZEhpbnQ6IE1hdEhpbnQ7XG4gICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZm9yRWFjaCgoaGludDogTWF0SGludCkgPT4ge1xuICAgICAgICBpZiAoaGludC5hbGlnbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGlmIChzdGFydEhpbnQgfHwgdGhpcy5oaW50TGFiZWwpIHtcbiAgICAgICAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZER1cGxpY2F0ZWRIaW50RXJyb3IoJ3N0YXJ0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YXJ0SGludCA9IGhpbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaGludC5hbGlnbiA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignZW5kJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVuZEhpbnQgPSBoaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZGVmYXVsdCBmbG9hdCBsYWJlbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuICh0aGlzLl9kZWZhdWx0cyAmJiB0aGlzLl9kZWZhdWx0cy5mbG9hdExhYmVsKSB8fCB0aGlzLl9sYWJlbE9wdGlvbnMuZmxvYXQgfHwgJ2F1dG8nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGxpc3Qgb2YgZWxlbWVudCBJRHMgdGhhdCBkZXNjcmliZSB0aGUgY2hpbGQgY29udHJvbC4gVGhpcyBhbGxvd3MgdGhlIGNvbnRyb2wgdG8gdXBkYXRlXG4gICAqIGl0cyBgYXJpYS1kZXNjcmliZWRieWAgYXR0cmlidXRlIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0Rlc2NyaWJlZEJ5SWRzKCkge1xuICAgIGlmICh0aGlzLl9jb250cm9sKSB7XG4gICAgICBsZXQgaWRzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICBpZiAodGhpcy5fZ2V0RGlzcGxheWVkTWVzc2FnZXMoKSA9PT0gJ2hpbnQnKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdzdGFydCcpIDogbnVsbDtcbiAgICAgICAgY29uc3QgZW5kSGludCA9IHRoaXMuX2hpbnRDaGlsZHJlbiA/XG4gICAgICAgICAgICB0aGlzLl9oaW50Q2hpbGRyZW4uZmluZChoaW50ID0+IGhpbnQuYWxpZ24gPT09ICdlbmQnKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXJ0SGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKHN0YXJ0SGludC5pZCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faGludExhYmVsKSB7XG4gICAgICAgICAgaWRzLnB1c2godGhpcy5faGludExhYmVsSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVuZEhpbnQpIHtcbiAgICAgICAgICBpZHMucHVzaChlbmRIaW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9lcnJvckNoaWxkcmVuKSB7XG4gICAgICAgIGlkcyA9IHRoaXMuX2Vycm9yQ2hpbGRyZW4ubWFwKGVycm9yID0+IGVycm9yLmlkKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29udHJvbC5zZXREZXNjcmliZWRCeUlkcyhpZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGZvcm0gZmllbGQncyBjb250cm9sIGlzIG1pc3NpbmcuICovXG4gIHByb3RlY3RlZCBfdmFsaWRhdGVDb250cm9sQ2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLl9jb250cm9sKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHdpZHRoIGFuZCBwb3NpdGlvbiBvZiB0aGUgZ2FwIGluIHRoZSBvdXRsaW5lLiBPbmx5IHJlbGV2YW50IGZvciB0aGUgb3V0bGluZVxuICAgKiBhcHBlYXJhbmNlLlxuICAgKi9cbiAgdXBkYXRlT3V0bGluZUdhcCgpIHtcbiAgICBjb25zdCBsYWJlbEVsID0gdGhpcy5fbGFiZWwgPyB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmICh0aGlzLmFwcGVhcmFuY2UgIT09ICdvdXRsaW5lJyB8fCAhbGFiZWxFbCB8fCAhbGFiZWxFbC5jaGlsZHJlbi5sZW5ndGggfHxcbiAgICAgICAgIWxhYmVsRWwudGV4dENvbnRlbnQhLnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICAvLyBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaXNuJ3QgYXZhaWxhYmxlIG9uIHRoZSBzZXJ2ZXIuXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIG5vdCBwcmVzZW50IGluIHRoZSBET00sIHRoZSBvdXRsaW5lIGdhcCB3aWxsIG5lZWQgdG8gYmUgY2FsY3VsYXRlZFxuICAgIC8vIHRoZSBuZXh0IHRpbWUgaXQgaXMgY2hlY2tlZCBhbmQgaW4gdGhlIERPTS5cbiAgICBpZiAoIXRoaXMuX2lzQXR0YWNoZWRUb0RPTSgpKSB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0V2lkdGggPSAwO1xuICAgIGxldCBnYXBXaWR0aCA9IDA7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3Qgc3RhcnRFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtc3RhcnQnKTtcbiAgICBjb25zdCBnYXBFbHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLm1hdC1mb3JtLWZpZWxkLW91dGxpbmUtZ2FwJyk7XG5cbiAgICBpZiAodGhpcy5fbGFiZWwgJiYgdGhpcy5fbGFiZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIC8vIElmIHRoZSBjb250YWluZXIncyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSB6ZXJvLCBpdCBtZWFucyB0aGF0IHRoZSBlbGVtZW50IGlzXG4gICAgICAvLyBpbnZpc2libGUgYW5kIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgb3V0bGluZSBnYXAuIE1hcmsgdGhlIGVsZW1lbnQgYXMgbmVlZGluZ1xuICAgICAgLy8gdG8gYmUgY2hlY2tlZCB0aGUgbmV4dCB0aW1lIHRoZSB6b25lIHN0YWJpbGl6ZXMuIFdlIGNhbid0IGRvIHRoaXMgaW1tZWRpYXRlbHlcbiAgICAgIC8vIG9uIHRoZSBuZXh0IGNoYW5nZSBkZXRlY3Rpb24sIGJlY2F1c2UgZXZlbiBpZiB0aGUgZWxlbWVudCBiZWNvbWVzIHZpc2libGUsXG4gICAgICAvLyB0aGUgYENsaWVudFJlY3RgIHdvbid0IGJlIHJlY2xhY3VsYXRlZCBpbW1lZGlhdGVseS4gV2UgcmVzZXQgdGhlXG4gICAgICAvLyBgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5YCBmbGFnIHNvbWUgd2UgZG9uJ3QgcnVuIHRoZSBjaGVja3MgdHdpY2UuXG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSB0aGlzLl9nZXRTdGFydEVuZChjb250YWluZXJSZWN0KTtcbiAgICAgIGNvbnN0IGxhYmVsQ2hpbGRyZW4gPSBsYWJlbEVsLmNoaWxkcmVuO1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGxhYmVsQ2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpO1xuICAgICAgbGV0IGxhYmVsV2lkdGggPSAwO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhYmVsQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGFiZWxXaWR0aCArPSAobGFiZWxDaGlsZHJlbltpXSBhcyBIVE1MRWxlbWVudCkub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgICBzdGFydFdpZHRoID0gTWF0aC5hYnMobGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0KSAtIG91dGxpbmVHYXBQYWRkaW5nO1xuICAgICAgZ2FwV2lkdGggPSBsYWJlbFdpZHRoID4gMCA/IGxhYmVsV2lkdGggKiBmbG9hdGluZ0xhYmVsU2NhbGUgKyBvdXRsaW5lR2FwUGFkZGluZyAqIDIgOiAwO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnRFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0YXJ0RWxzW2ldLnN0eWxlLndpZHRoID0gYCR7c3RhcnRXaWR0aH1weGA7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2FwRWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBnYXBFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtnYXBXaWR0aH1weGA7XG4gICAgfVxuXG4gICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPVxuICAgICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHN0YXJ0IGVuZCBvZiB0aGUgcmVjdCBjb25zaWRlcmluZyB0aGUgY3VycmVudCBkaXJlY3Rpb25hbGl0eS4gKi9cbiAgcHJpdmF0ZSBfZ2V0U3RhcnRFbmQocmVjdDogQ2xpZW50UmVjdCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJykgPyByZWN0LnJpZ2h0IDogcmVjdC5sZWZ0O1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBmb3JtIGZpZWxkIGlzIGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gIHByaXZhdGUgX2lzQXR0YWNoZWRUb0RPTSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChlbGVtZW50LmdldFJvb3ROb2RlKSB7XG4gICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcbiAgICAgIC8vIElmIHRoZSBlbGVtZW50IGlzIGluc2lkZSB0aGUgRE9NIHRoZSByb290IG5vZGUgd2lsbCBiZSBlaXRoZXIgdGhlIGRvY3VtZW50XG4gICAgICAvLyBvciB0aGUgY2xvc2VzdCBzaGFkb3cgcm9vdCwgb3RoZXJ3aXNlIGl0J2xsIGJlIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgIHJldHVybiByb290Tm9kZSAmJiByb290Tm9kZSAhPT0gZWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBPdGhlcndpc2UgZmFsbCBiYWNrIHRvIGNoZWNraW5nIGlmIGl0J3MgaW4gdGhlIGRvY3VtZW50LiBUaGlzIGRvZXNuJ3QgYWNjb3VudCBmb3JcbiAgICAvLyBzaGFkb3cgRE9NLCBob3dldmVyIGJyb3dzZXIgdGhhdCBzdXBwb3J0IHNoYWRvdyBET00gc2hvdWxkIHN1cHBvcnQgYGdldFJvb3ROb2RlYCBhcyB3ZWxsLlxuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhLmNvbnRhaW5zKGVsZW1lbnQpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVSZXF1aXJlZE1hcmtlcjogQm9vbGVhbklucHV0O1xufVxuIl19