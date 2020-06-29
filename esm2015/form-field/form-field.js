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
let MatFormField = /** @class */ (() => {
    class MatFormField extends _MatFormFieldMixinBase {
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
            return this._canLabelFloat && (this._control.shouldLabelFloat || this._shouldAlwaysFloat);
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
    return MatFormField;
})();
export { MatFormField };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9mb3JtLWZpZWxkL2Zvcm0tZmllbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFJTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFVBQVUsRUFDVixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCx3QkFBd0IsRUFDeEIsVUFBVSxHQUNYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzFELE9BQU8sRUFBQyxTQUFTLEVBQVcsTUFBTSxTQUFTLENBQUM7QUFDNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDL0QsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxrQ0FBa0MsRUFDbEMsdUNBQXVDLEdBQ3hDLE1BQU0scUJBQXFCLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBVSxNQUFNLFFBQVEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2pDLE9B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LFNBQUMsd0JBQXdCO2dCQTFSMUMsY0FBYyx1QkEyUmYsUUFBUTtnREFDUixRQUFRLFlBQUksTUFBTSxTQUFDLDhCQUE4QjtnQkFqUGhELFFBQVE7Z0JBNUJkLE1BQU07NkNBK1FELFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7NkJBdEg1QyxLQUFLO3FDQWNMLEtBQUs7NEJBc0JMLEtBQUs7NkJBc0JMLEtBQUs7K0JBbUJMLFNBQVMsU0FBQyxXQUFXOzBDQUVyQixTQUFTLFNBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO3FDQUMvQyxTQUFTLFNBQUMsZ0JBQWdCO3lCQUMxQixTQUFTLFNBQUMsT0FBTztvQ0FFakIsWUFBWSxTQUFDLG1CQUFtQjtpQ0FDaEMsWUFBWSxTQUFDLG1CQUFtQixFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzt1Q0FXaEQsWUFBWSxTQUFDLFFBQVE7b0NBQ3JCLFlBQVksU0FBQyxRQUFRLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO29DQUtyQyxZQUFZLFNBQUMsY0FBYztpQ0FHM0IsZUFBZSxTQUFDLFNBQWdCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dDQUVyRCxlQUFlLFNBQUMsU0FBZ0IsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7a0NBRXJELGVBQWUsU0FBQyxVQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztrQ0FFdEQsZUFBZSxTQUFDLFVBQWlCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOztJQWtWekQsbUJBQUM7S0FBQTtTQWhkWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLFxuICBMYWJlbE9wdGlvbnMsXG4gIE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5Db2xvcixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgbWVyZ2UsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNQVRfRVJST1IsIE1hdEVycm9yfSBmcm9tICcuL2Vycm9yJztcbmltcG9ydCB7bWF0Rm9ybUZpZWxkQW5pbWF0aW9uc30gZnJvbSAnLi9mb3JtLWZpZWxkLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRDb250cm9sfSBmcm9tICcuL2Zvcm0tZmllbGQtY29udHJvbCc7XG5pbXBvcnQge1xuICBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRNaXNzaW5nQ29udHJvbEVycm9yLFxuICBnZXRNYXRGb3JtRmllbGRQbGFjZWhvbGRlckNvbmZsaWN0RXJyb3IsXG59IGZyb20gJy4vZm9ybS1maWVsZC1lcnJvcnMnO1xuaW1wb3J0IHtfTUFUX0hJTlQsIE1hdEhpbnR9IGZyb20gJy4vaGludCc7XG5pbXBvcnQge01hdExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7TWF0UGxhY2Vob2xkZXJ9IGZyb20gJy4vcGxhY2Vob2xkZXInO1xuaW1wb3J0IHtNQVRfUFJFRklYLCBNYXRQcmVmaXh9IGZyb20gJy4vcHJlZml4JztcbmltcG9ydCB7TUFUX1NVRkZJWCwgTWF0U3VmZml4fSBmcm9tICcuL3N1ZmZpeCc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuY29uc3QgZmxvYXRpbmdMYWJlbFNjYWxlID0gMC43NTtcbmNvbnN0IG91dGxpbmVHYXBQYWRkaW5nID0gNTtcblxuXG4vKipcbiAqIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Rm9ybUZpZWxkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5jbGFzcyBNYXRGb3JtRmllbGRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIHdoaWNoIHdlJ3JlIGFwcGx5aW5nIHRoZSBmb3JtIGZpZWxkIG1peGlucy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuY29uc3QgX01hdEZvcm1GaWVsZE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdEZvcm1GaWVsZEJhc2UgPVxuICAgIG1peGluQ29sb3IoTWF0Rm9ybUZpZWxkQmFzZSwgJ3ByaW1hcnknKTtcblxuLyoqIFBvc3NpYmxlIGFwcGVhcmFuY2Ugc3R5bGVzIGZvciB0aGUgZm9ybSBmaWVsZC4gKi9cbmV4cG9ydCB0eXBlIE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgPSAnbGVnYWN5JyB8ICdzdGFuZGFyZCcgfCAnZmlsbCcgfCAnb3V0bGluZSc7XG5cbi8qKiBQb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBcImZsb2F0TGFiZWxcIiBmb3JtLWZpZWxkIGlucHV0LiAqL1xuZXhwb3J0IHR5cGUgRmxvYXRMYWJlbFR5cGUgPSAnYWx3YXlzJyB8ICduZXZlcicgfCAnYXV0byc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgZm9ybSBmaWVsZCB0aGF0IGNhbiBiZSBjb25maWd1cmVkXG4gKiB1c2luZyB0aGUgYE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OU2AgaW5qZWN0aW9uIHRva2VuLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zIHtcbiAgYXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gIGhpZGVSZXF1aXJlZE1hcmtlcj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBmb3IgZm9ybS1maWVsZHMgc2hvdWxkIGJ5IGRlZmF1bHQgZmxvYXQgYGFsd2F5c2AsXG4gICAqIGBuZXZlcmAsIG9yIGBhdXRvYCAob25seSB3aGVuIG5lY2Vzc2FyeSkuXG4gICAqL1xuICBmbG9hdExhYmVsPzogRmxvYXRMYWJlbFR5cGU7XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZVxuICogZGVmYXVsdCBvcHRpb25zIGZvciBhbGwgZm9ybSBmaWVsZCB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0Rm9ybUZpZWxkRGVmYXVsdE9wdGlvbnM+KCdNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBpbmplY3QgYW4gaW5zdGFuY2VzIG9mIGBNYXRGb3JtRmllbGRgLiBJdCBzZXJ2ZXNcbiAqIGFzIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdEZvcm1GaWVsZGAgY2xhc3Mgd2hpY2ggd291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgYE1hdEZvcm1GaWVsZGAgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRk9STV9GSUVMRCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRGb3JtRmllbGQ+KCdNYXRGb3JtRmllbGQnKTtcblxuLyoqIENvbnRhaW5lciBmb3IgZm9ybSBjb250cm9scyB0aGF0IGFwcGxpZXMgTWF0ZXJpYWwgRGVzaWduIHN0eWxpbmcgYW5kIGJlaGF2aW9yLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWZvcm0tZmllbGQnLFxuICBleHBvcnRBczogJ21hdEZvcm1GaWVsZCcsXG4gIHRlbXBsYXRlVXJsOiAnZm9ybS1maWVsZC5odG1sJyxcbiAgLy8gTWF0SW5wdXQgaXMgYSBkaXJlY3RpdmUgYW5kIGNhbid0IGhhdmUgc3R5bGVzLCBzbyB3ZSBuZWVkIHRvIGluY2x1ZGUgaXRzIHN0eWxlcyBoZXJlXG4gIC8vIGluIGZvcm0tZmllbGQtaW5wdXQuY3NzLiBUaGUgTWF0SW5wdXQgc3R5bGVzIGFyZSBmYWlybHkgbWluaW1hbCBzbyBpdCBzaG91bGRuJ3QgYmUgYVxuICAvLyBiaWcgZGVhbCBmb3IgcGVvcGxlIHdobyBhcmVuJ3QgdXNpbmcgTWF0SW5wdXQuXG4gIHN0eWxlVXJsczogW1xuICAgICdmb3JtLWZpZWxkLmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtZmlsbC5jc3MnLFxuICAgICdmb3JtLWZpZWxkLWlucHV0LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtbGVnYWN5LmNzcycsXG4gICAgJ2Zvcm0tZmllbGQtb3V0bGluZS5jc3MnLFxuICAgICdmb3JtLWZpZWxkLXN0YW5kYXJkLmNzcycsXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFttYXRGb3JtRmllbGRBbmltYXRpb25zLnRyYW5zaXRpb25NZXNzYWdlc10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWZvcm0tZmllbGQnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1zdGFuZGFyZF0nOiAnYXBwZWFyYW5jZSA9PSBcInN0YW5kYXJkXCInLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1maWxsXSc6ICdhcHBlYXJhbmNlID09IFwiZmlsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWFwcGVhcmFuY2Utb3V0bGluZV0nOiAnYXBwZWFyYW5jZSA9PSBcIm91dGxpbmVcIicsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1hcHBlYXJhbmNlLWxlZ2FjeV0nOiAnYXBwZWFyYW5jZSA9PSBcImxlZ2FjeVwiJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWludmFsaWRdJzogJ19jb250cm9sLmVycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtY2FuLWZsb2F0XSc6ICdfY2FuTGFiZWxGbG9hdCcsXG4gICAgJ1tjbGFzcy5tYXQtZm9ybS1maWVsZC1zaG91bGQtZmxvYXRdJzogJ19zaG91bGRMYWJlbEZsb2F0KCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtaGFzLWxhYmVsXSc6ICdfaGFzRmxvYXRpbmdMYWJlbCgpJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWhpZGUtcGxhY2Vob2xkZXJdJzogJ19oaWRlQ29udHJvbFBsYWNlaG9sZGVyKCknLFxuICAgICdbY2xhc3MubWF0LWZvcm0tZmllbGQtZGlzYWJsZWRdJzogJ19jb250cm9sLmRpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1mb3JtLWZpZWxkLWF1dG9maWxsZWRdJzogJ19jb250cm9sLmF1dG9maWxsZWQnLFxuICAgICdbY2xhc3MubWF0LWZvY3VzZWRdJzogJ19jb250cm9sLmZvY3VzZWQnLFxuICAgICdbY2xhc3MubWF0LWFjY2VudF0nOiAnY29sb3IgPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT0gXCJ3YXJuXCInLFxuICAgICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInVudG91Y2hlZFwiKScsXG4gICAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdfc2hvdWxkRm9yd2FyZChcInRvdWNoZWRcIiknLFxuICAgICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ19zaG91bGRGb3J3YXJkKFwicHJpc3RpbmVcIiknLFxuICAgICdbY2xhc3MubmctZGlydHldJzogJ19zaG91bGRGb3J3YXJkKFwiZGlydHlcIiknLFxuICAgICdbY2xhc3MubmctdmFsaWRdJzogJ19zaG91bGRGb3J3YXJkKFwidmFsaWRcIiknLFxuICAgICdbY2xhc3MubmctaW52YWxpZF0nOiAnX3Nob3VsZEZvcndhcmQoXCJpbnZhbGlkXCIpJyxcbiAgICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ19zaG91bGRGb3J3YXJkKFwicGVuZGluZ1wiKScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnIV9hbmltYXRpb25zRW5hYmxlZCcsXG4gIH0sXG4gIGlucHV0czogWydjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1BVF9GT1JNX0ZJRUxELCB1c2VFeGlzdGluZzogTWF0Rm9ybUZpZWxkfSxcbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE1hdEZvcm1GaWVsZCBleHRlbmRzIF9NYXRGb3JtRmllbGRNaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9sYWJlbE9wdGlvbnM6IExhYmVsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgb3V0bGluZSBnYXAgbmVlZHMgdG8gYmUgY2FsY3VsYXRlZFxuICAgKiBpbW1lZGlhdGVseSBvbiB0aGUgbmV4dCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bi5cbiAgICovXG4gIHByaXZhdGUgX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG91dGxpbmUgZ2FwIG5lZWRzIHRvIGJlIGNhbGN1bGF0ZWQgbmV4dCB0aW1lIHRoZSB6b25lIGhhcyBzdGFiaWxpemVkLiAqL1xuICBwcml2YXRlIF9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBmb3JtLWZpZWxkIGFwcGVhcmFuY2Ugc3R5bGUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgeyByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTsgfVxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fYXBwZWFyYW5jZTtcblxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZSB8fCAodGhpcy5fZGVmYXVsdHMgJiYgdGhpcy5fZGVmYXVsdHMuYXBwZWFyYW5jZSkgfHwgJ2xlZ2FjeSc7XG5cbiAgICBpZiAodGhpcy5fYXBwZWFyYW5jZSA9PT0gJ291dGxpbmUnICYmIG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkT25TdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuICBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICAvKiogV2hldGhlciB0aGUgcmVxdWlyZWQgbWFya2VyIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUmVxdWlyZWRNYXJrZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUmVxdWlyZWRNYXJrZXI7IH1cbiAgc2V0IGhpZGVSZXF1aXJlZE1hcmtlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVSZXF1aXJlZE1hcmtlciA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuO1xuXG4gIC8qKiBPdmVycmlkZSBmb3IgdGhlIGxvZ2ljIHRoYXQgZGlzYWJsZXMgdGhlIGxhYmVsIGFuaW1hdGlvbiBpbiBjZXJ0YWluIGNhc2VzLiAqL1xuICBwcml2YXRlIF9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBmbG9hdGluZyBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9zaG91bGRBbHdheXNGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mbG9hdExhYmVsID09PSAnYWx3YXlzJyAmJiAhdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGFiZWwgY2FuIGZsb2F0IG9yIG5vdC4gKi9cbiAgZ2V0IF9jYW5MYWJlbEZsb2F0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5mbG9hdExhYmVsICE9PSAnbmV2ZXInOyB9XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBmb3JtIGZpZWxkIGhpbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaW50TGFiZWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2hpbnRMYWJlbDsgfVxuICBzZXQgaGludExhYmVsKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9oaW50TGFiZWwgPSB2YWx1ZTtcbiAgICB0aGlzLl9wcm9jZXNzSGludHMoKTtcbiAgfVxuICBwcml2YXRlIF9oaW50TGFiZWwgPSAnJztcblxuICAvLyBVbmlxdWUgaWQgZm9yIHRoZSBoaW50IGxhYmVsLlxuICBfaGludExhYmVsSWQ6IHN0cmluZyA9IGBtYXQtaGludC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLy8gVW5pcXVlIGlkIGZvciB0aGUgaW50ZXJuYWwgZm9ybSBmaWVsZCBsYWJlbC5cbiAgX2xhYmVsSWQgPSBgbWF0LWZvcm0tZmllbGQtbGFiZWwtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYWx3YXlzIGZsb2F0LCBuZXZlciBmbG9hdCBvciBmbG9hdCBhcyB0aGUgdXNlciB0eXBlcy5cbiAgICpcbiAgICogTm90ZTogb25seSB0aGUgbGVnYWN5IGFwcGVhcmFuY2Ugc3VwcG9ydHMgdGhlIGBuZXZlcmAgb3B0aW9uLiBgbmV2ZXJgIHdhcyBvcmlnaW5hbGx5IGFkZGVkIGFzIGFcbiAgICogd2F5IHRvIG1ha2UgdGhlIGZsb2F0aW5nIGxhYmVsIGVtdWxhdGUgdGhlIGJlaGF2aW9yIG9mIGEgc3RhbmRhcmQgaW5wdXQgcGxhY2Vob2xkZXIuIEhvd2V2ZXJcbiAgICogdGhlIGZvcm0gZmllbGQgbm93IHN1cHBvcnRzIGJvdGggZmxvYXRpbmcgbGFiZWxzIGFuZCBwbGFjZWhvbGRlcnMuIFRoZXJlZm9yZSBpbiB0aGUgbm9uLWxlZ2FjeVxuICAgKiBhcHBlYXJhbmNlcyB0aGUgYG5ldmVyYCBvcHRpb24gaGFzIGJlZW4gZGlzYWJsZWQgaW4gZmF2b3Igb2YganVzdCB1c2luZyB0aGUgcGxhY2Vob2xkZXIuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZmxvYXRMYWJlbCgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwZWFyYW5jZSAhPT0gJ2xlZ2FjeScgJiYgdGhpcy5fZmxvYXRMYWJlbCA9PT0gJ25ldmVyJyA/ICdhdXRvJyA6IHRoaXMuX2Zsb2F0TGFiZWw7XG4gIH1cbiAgc2V0IGZsb2F0TGFiZWwodmFsdWU6IEZsb2F0TGFiZWxUeXBlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLl9mbG9hdExhYmVsKSB7XG4gICAgICB0aGlzLl9mbG9hdExhYmVsID0gdmFsdWUgfHwgdGhpcy5fZ2V0RGVmYXVsdEZsb2F0TGFiZWxTdGF0ZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Zsb2F0TGFiZWw6IEZsb2F0TGFiZWxUeXBlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBBbmd1bGFyIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQuICovXG4gIF9hbmltYXRpb25zRW5hYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMFxuICAgKi9cbiAgQFZpZXdDaGlsZCgndW5kZXJsaW5lJykgdW5kZXJsaW5lUmVmOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2Nvbm5lY3Rpb25Db250YWluZXInLCB7c3RhdGljOiB0cnVlfSkgX2Nvbm5lY3Rpb25Db250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0Q29udGFpbmVyJykgX2lucHV0Q29udGFpbmVyUmVmOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdsYWJlbCcpIHByaXZhdGUgX2xhYmVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBAQ29udGVudENoaWxkKE1hdEZvcm1GaWVsZENvbnRyb2wpIF9jb250cm9sTm9uU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIEBDb250ZW50Q2hpbGQoTWF0Rm9ybUZpZWxkQ29udHJvbCwge3N0YXRpYzogdHJ1ZX0pIF9jb250cm9sU3RhdGljOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG4gIGdldCBfY29udHJvbCgpIHtcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbmVlZCB0aGlzIHdvcmthcm91bmQgaW4gb3JkZXIgdG8gc3VwcG9ydCBib3RoIEl2eSBhbmQgVmlld0VuZ2luZS5cbiAgICAvLyAgV2Ugc2hvdWxkIGNsZWFuIHRoaXMgdXAgb25jZSBJdnkgaXMgdGhlIGRlZmF1bHQgcmVuZGVyZXIuXG4gICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Rm9ybUZpZWxkQ29udHJvbCB8fCB0aGlzLl9jb250cm9sTm9uU3RhdGljIHx8IHRoaXMuX2NvbnRyb2xTdGF0aWM7XG4gIH1cbiAgc2V0IF9jb250cm9sKHZhbHVlKSB7XG4gICAgdGhpcy5fZXhwbGljaXRGb3JtRmllbGRDb250cm9sID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRGb3JtRmllbGRDb250cm9sOiBNYXRGb3JtRmllbGRDb250cm9sPGFueT47XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMYWJlbCkgX2xhYmVsQ2hpbGROb25TdGF0aWM6IE1hdExhYmVsO1xuICBAQ29udGVudENoaWxkKE1hdExhYmVsLCB7c3RhdGljOiB0cnVlfSkgX2xhYmVsQ2hpbGRTdGF0aWM6IE1hdExhYmVsO1xuICBnZXQgX2xhYmVsQ2hpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhYmVsQ2hpbGROb25TdGF0aWMgfHwgdGhpcy5fbGFiZWxDaGlsZFN0YXRpYztcbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTWF0UGxhY2Vob2xkZXIpIF9wbGFjZWhvbGRlckNoaWxkOiBNYXRQbGFjZWhvbGRlcjtcblxuICAvLyBUT0RPOiBSZW1vdmUgY2FzdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvcHVsbC8zNzUwNiBpcyBhdmFpbGFibGUuXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX0VSUk9SIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2Vycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRFcnJvcj47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihfTUFUX0hJTlQgYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfaGludENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0SGludD47XG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfUFJFRklYIGFzIGFueSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3ByZWZpeENoaWxkcmVuOiBRdWVyeUxpc3Q8TWF0UHJlZml4PjtcbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICBAQ29udGVudENoaWxkcmVuKE1BVF9TVUZGSVggYXMgYW55LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfc3VmZml4Q2hpbGRyZW46IFF1ZXJ5TGlzdDxNYXRTdWZmaXg+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9MQUJFTF9HTE9CQUxfT1BUSU9OUykgbGFiZWxPcHRpb25zOiBMYWJlbE9wdGlvbnMsXG4gICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByaXZhdGUgX2RlZmF1bHRzOlxuICAgICAgICAgIE1hdEZvcm1GaWVsZERlZmF1bHRPcHRpb25zLCBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG5cbiAgICB0aGlzLl9sYWJlbE9wdGlvbnMgPSBsYWJlbE9wdGlvbnMgPyBsYWJlbE9wdGlvbnMgOiB7fTtcbiAgICB0aGlzLmZsb2F0TGFiZWwgPSB0aGlzLl9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgPSBfYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIC8vIFNldCB0aGUgZGVmYXVsdCB0aHJvdWdoIGhlcmUgc28gd2UgaW52b2tlIHRoZSBzZXR0ZXIgb24gdGhlIGZpcnN0IHJ1bi5cbiAgICB0aGlzLmFwcGVhcmFuY2UgPSAoX2RlZmF1bHRzICYmIF9kZWZhdWx0cy5hcHBlYXJhbmNlKSA/IF9kZWZhdWx0cy5hcHBlYXJhbmNlIDogJ2xlZ2FjeSc7XG4gICAgdGhpcy5faGlkZVJlcXVpcmVkTWFya2VyID0gKF9kZWZhdWx0cyAmJiBfZGVmYXVsdHMuaGlkZVJlcXVpcmVkTWFya2VyICE9IG51bGwpID9cbiAgICAgICAgX2RlZmF1bHRzLmhpZGVSZXF1aXJlZE1hcmtlciA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gRWxlbWVudFJlZiBmb3IgdGhlIGVsZW1lbnQgdGhhdCBhIG92ZXJsYXkgYXR0YWNoZWQgdG8gdGhlIGZvcm0tZmllbGQgc2hvdWxkIGJlXG4gICAqIHBvc2l0aW9uZWQgcmVsYXRpdmUgdG8uXG4gICAqL1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLl9jb25uZWN0aW9uQ29udGFpbmVyUmVmIHx8IHRoaXMuX2VsZW1lbnRSZWY7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVDb250cm9sQ2hpbGQoKTtcblxuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLl9jb250cm9sO1xuXG4gICAgaWYgKGNvbnRyb2wuY29udHJvbFR5cGUpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtZm9ybS1maWVsZC10eXBlLSR7Y29udHJvbC5jb250cm9sVHlwZX1gKTtcbiAgICB9XG5cbiAgICAvLyBTdWJzY3JpYmUgdG8gY2hhbmdlcyBpbiB0aGUgY2hpbGQgY29udHJvbCBzdGF0ZSBpbiBvcmRlciB0byB1cGRhdGUgdGhlIGZvcm0gZmllbGQgVUkuXG4gICAgY29udHJvbC5zdGF0ZUNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fdmFsaWRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICAvLyBSdW4gY2hhbmdlIGRldGVjdGlvbiBpZiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICBpZiAoY29udHJvbC5uZ0NvbnRyb2wgJiYgY29udHJvbC5uZ0NvbnRyb2wudmFsdWVDaGFuZ2VzKSB7XG4gICAgICBjb250cm9sLm5nQ29udHJvbC52YWx1ZUNoYW5nZXNcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB3ZSBoYXZlIHRvIHJ1biBvdXRzaWRlIG9mIHRoZSBgTmdab25lYCBleHBsaWNpdGx5LFxuICAgIC8vIGluIG9yZGVyIHRvIGF2b2lkIHRocm93aW5nIHVzZXJzIGludG8gYW4gaW5maW5pdGUgbG9vcFxuICAgIC8vIGlmIGB6b25lLXBhdGNoLXJ4anNgIGlzIGluY2x1ZGVkLlxuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gYW5kIHVwZGF0ZSB0aGUgb3V0bGluZSBpZiB0aGUgc3VmZml4IG9yIHByZWZpeCBjaGFuZ2VzLlxuICAgIG1lcmdlKHRoaXMuX3ByZWZpeENoaWxkcmVuLmNoYW5nZXMsIHRoaXMuX3N1ZmZpeENoaWxkcmVuLmNoYW5nZXMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFJlLXZhbGlkYXRlIHdoZW4gdGhlIG51bWJlciBvZiBoaW50cyBjaGFuZ2VzLlxuICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcHJvY2Vzc0hpbnRzKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJpYS1kZXNjcmliZWQgYnkgd2hlbiB0aGUgbnVtYmVyIG9mIGVycm9ycyBjaGFuZ2VzLlxuICAgIHRoaXMuX2Vycm9yQ2hpbGRyZW4uY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fZGlyKSB7XG4gICAgICB0aGlzLl9kaXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpO1xuICAgIGlmICh0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRJbW1lZGlhdGVseSkge1xuICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEF2b2lkIGFuaW1hdGlvbnMgb24gbG9hZC5cbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBjbGFzcyBmcm9tIHRoZSBOZ0NvbnRyb2wgc2hvdWxkIGJlIGZvcndhcmRlZCB0byB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBfc2hvdWxkRm9yd2FyZChwcm9wOiBrZXlvZiBOZ0NvbnRyb2wpOiBib29sZWFuIHtcbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLl9jb250cm9sID8gdGhpcy5fY29udHJvbC5uZ0NvbnRyb2wgOiBudWxsO1xuICAgIHJldHVybiBuZ0NvbnRyb2wgJiYgbmdDb250cm9sW3Byb3BdO1xuICB9XG5cbiAgX2hhc1BsYWNlaG9sZGVyKCkge1xuICAgIHJldHVybiAhISh0aGlzLl9jb250cm9sICYmIHRoaXMuX2NvbnRyb2wucGxhY2Vob2xkZXIgfHwgdGhpcy5fcGxhY2Vob2xkZXJDaGlsZCk7XG4gIH1cblxuICBfaGFzTGFiZWwoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fbGFiZWxDaGlsZDtcbiAgfVxuXG4gIF9zaG91bGRMYWJlbEZsb2F0KCkge1xuICAgIHJldHVybiB0aGlzLl9jYW5MYWJlbEZsb2F0ICYmICh0aGlzLl9jb250cm9sLnNob3VsZExhYmVsRmxvYXQgfHwgdGhpcy5fc2hvdWxkQWx3YXlzRmxvYXQpO1xuICB9XG5cbiAgX2hpZGVDb250cm9sUGxhY2Vob2xkZXIoKSB7XG4gICAgLy8gSW4gdGhlIGxlZ2FjeSBhcHBlYXJhbmNlIHRoZSBwbGFjZWhvbGRlciBpcyBwcm9tb3RlZCB0byBhIGxhYmVsIGlmIG5vIGxhYmVsIGlzIGdpdmVuLlxuICAgIHJldHVybiB0aGlzLmFwcGVhcmFuY2UgPT09ICdsZWdhY3knICYmICF0aGlzLl9oYXNMYWJlbCgpIHx8XG4gICAgICAgIHRoaXMuX2hhc0xhYmVsKCkgJiYgIXRoaXMuX3Nob3VsZExhYmVsRmxvYXQoKTtcbiAgfVxuXG4gIF9oYXNGbG9hdGluZ0xhYmVsKCkge1xuICAgIC8vIEluIHRoZSBsZWdhY3kgYXBwZWFyYW5jZSB0aGUgcGxhY2Vob2xkZXIgaXMgcHJvbW90ZWQgdG8gYSBsYWJlbCBpZiBubyBsYWJlbCBpcyBnaXZlbi5cbiAgICByZXR1cm4gdGhpcy5faGFzTGFiZWwoKSB8fCB0aGlzLmFwcGVhcmFuY2UgPT09ICdsZWdhY3knICYmIHRoaXMuX2hhc1BsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGRpc3BsYXkgaGludHMgb3IgZXJyb3JzLiAqL1xuICBfZ2V0RGlzcGxheWVkTWVzc2FnZXMoKTogJ2Vycm9yJyB8ICdoaW50JyB7XG4gICAgcmV0dXJuICh0aGlzLl9lcnJvckNoaWxkcmVuICYmIHRoaXMuX2Vycm9yQ2hpbGRyZW4ubGVuZ3RoID4gMCAmJlxuICAgICAgICB0aGlzLl9jb250cm9sLmVycm9yU3RhdGUpID8gJ2Vycm9yJyA6ICdoaW50JztcbiAgfVxuXG4gIC8qKiBBbmltYXRlcyB0aGUgcGxhY2Vob2xkZXIgdXAgYW5kIGxvY2tzIGl0IGluIHBvc2l0aW9uLiAqL1xuICBfYW5pbWF0ZUFuZExvY2tMYWJlbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faGFzRmxvYXRpbmdMYWJlbCgpICYmIHRoaXMuX2NhbkxhYmVsRmxvYXQpIHtcbiAgICAgIC8vIElmIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLCB3ZSBzaG91bGRuJ3QgZ28gaW4gaGVyZSxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIGB0cmFuc2l0aW9uZW5kYCB3aWxsIG5ldmVyIGZpcmUuXG4gICAgICBpZiAodGhpcy5fYW5pbWF0aW9uc0VuYWJsZWQgJiYgdGhpcy5fbGFiZWwpIHtcbiAgICAgICAgdGhpcy5fc2hvd0Fsd2F5c0FuaW1hdGUgPSB0cnVlO1xuXG4gICAgICAgIGZyb21FdmVudCh0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbmVuZCcpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zaG93QWx3YXlzQW5pbWF0ZSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgdGhlcmUgaXMgb25seSBvbmUgcGxhY2Vob2xkZXIgKGVpdGhlciBgcGxhY2Vob2xkZXJgIGF0dHJpYnV0ZSBvbiB0aGUgY2hpbGQgY29udHJvbFxuICAgKiBvciBjaGlsZCBlbGVtZW50IHdpdGggdGhlIGBtYXQtcGxhY2Vob2xkZXJgIGRpcmVjdGl2ZSkuXG4gICAqL1xuICBwcml2YXRlIF92YWxpZGF0ZVBsYWNlaG9sZGVycygpIHtcbiAgICBpZiAodGhpcy5fY29udHJvbC5wbGFjZWhvbGRlciAmJiB0aGlzLl9wbGFjZWhvbGRlckNoaWxkKSB7XG4gICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGRQbGFjZWhvbGRlckNvbmZsaWN0RXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9lcyBhbnkgZXh0cmEgcHJvY2Vzc2luZyB0aGF0IGlzIHJlcXVpcmVkIHdoZW4gaGFuZGxpbmcgdGhlIGhpbnRzLiAqL1xuICBwcml2YXRlIF9wcm9jZXNzSGludHMoKSB7XG4gICAgdGhpcy5fdmFsaWRhdGVIaW50cygpO1xuICAgIHRoaXMuX3N5bmNEZXNjcmliZWRCeUlkcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuc3VyZSB0aGF0IHRoZXJlIGlzIGEgbWF4aW11bSBvZiBvbmUgb2YgZWFjaCBgPG1hdC1oaW50PmAgYWxpZ25tZW50IHNwZWNpZmllZCwgd2l0aCB0aGVcbiAgICogYXR0cmlidXRlIGJlaW5nIGNvbnNpZGVyZWQgYXMgYGFsaWduPVwic3RhcnRcImAuXG4gICAqL1xuICBwcml2YXRlIF92YWxpZGF0ZUhpbnRzKCkge1xuICAgIGlmICh0aGlzLl9oaW50Q2hpbGRyZW4pIHtcbiAgICAgIGxldCBzdGFydEhpbnQ6IE1hdEhpbnQ7XG4gICAgICBsZXQgZW5kSGludDogTWF0SGludDtcbiAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5mb3JFYWNoKChoaW50OiBNYXRIaW50KSA9PiB7XG4gICAgICAgIGlmIChoaW50LmFsaWduID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgaWYgKHN0YXJ0SGludCB8fCB0aGlzLmhpbnRMYWJlbCkge1xuICAgICAgICAgICAgdGhyb3cgZ2V0TWF0Rm9ybUZpZWxkRHVwbGljYXRlZEhpbnRFcnJvcignc3RhcnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhcnRIaW50ID0gaGludDtcbiAgICAgICAgfSBlbHNlIGlmIChoaW50LmFsaWduID09PSAnZW5kJykge1xuICAgICAgICAgIGlmIChlbmRIaW50KSB7XG4gICAgICAgICAgICB0aHJvdyBnZXRNYXRGb3JtRmllbGREdXBsaWNhdGVkSGludEVycm9yKCdlbmQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZW5kSGludCA9IGhpbnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkZWZhdWx0IGZsb2F0IGxhYmVsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9nZXREZWZhdWx0RmxvYXRMYWJlbFN0YXRlKCk6IEZsb2F0TGFiZWxUeXBlIHtcbiAgICByZXR1cm4gKHRoaXMuX2RlZmF1bHRzICYmIHRoaXMuX2RlZmF1bHRzLmZsb2F0TGFiZWwpIHx8IHRoaXMuX2xhYmVsT3B0aW9ucy5mbG9hdCB8fCAnYXV0byc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbGlzdCBvZiBlbGVtZW50IElEcyB0aGF0IGRlc2NyaWJlIHRoZSBjaGlsZCBjb250cm9sLiBUaGlzIGFsbG93cyB0aGUgY29udHJvbCB0byB1cGRhdGVcbiAgICogaXRzIGBhcmlhLWRlc2NyaWJlZGJ5YCBhdHRyaWJ1dGUgYWNjb3JkaW5nbHkuXG4gICAqL1xuICBwcml2YXRlIF9zeW5jRGVzY3JpYmVkQnlJZHMoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIGxldCBpZHM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgIGlmICh0aGlzLl9nZXREaXNwbGF5ZWRNZXNzYWdlcygpID09PSAnaGludCcpIHtcbiAgICAgICAgY29uc3Qgc3RhcnRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ3N0YXJ0JykgOiBudWxsO1xuICAgICAgICBjb25zdCBlbmRIaW50ID0gdGhpcy5faGludENoaWxkcmVuID9cbiAgICAgICAgICAgIHRoaXMuX2hpbnRDaGlsZHJlbi5maW5kKGhpbnQgPT4gaGludC5hbGlnbiA9PT0gJ2VuZCcpIDogbnVsbDtcblxuICAgICAgICBpZiAoc3RhcnRIaW50KSB7XG4gICAgICAgICAgaWRzLnB1c2goc3RhcnRIaW50LmlkKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9oaW50TGFiZWwpIHtcbiAgICAgICAgICBpZHMucHVzaCh0aGlzLl9oaW50TGFiZWxJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW5kSGludCkge1xuICAgICAgICAgIGlkcy5wdXNoKGVuZEhpbnQuaWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2Vycm9yQ2hpbGRyZW4pIHtcbiAgICAgICAgaWRzID0gdGhpcy5fZXJyb3JDaGlsZHJlbi5tYXAoZXJyb3IgPT4gZXJyb3IuaWQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb250cm9sLnNldERlc2NyaWJlZEJ5SWRzKGlkcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgZm9ybSBmaWVsZCdzIGNvbnRyb2wgaXMgbWlzc2luZy4gKi9cbiAgcHJvdGVjdGVkIF92YWxpZGF0ZUNvbnRyb2xDaGlsZCgpIHtcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2wpIHtcbiAgICAgIHRocm93IGdldE1hdEZvcm1GaWVsZE1pc3NpbmdDb250cm9sRXJyb3IoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgd2lkdGggYW5kIHBvc2l0aW9uIG9mIHRoZSBnYXAgaW4gdGhlIG91dGxpbmUuIE9ubHkgcmVsZXZhbnQgZm9yIHRoZSBvdXRsaW5lXG4gICAqIGFwcGVhcmFuY2UuXG4gICAqL1xuICB1cGRhdGVPdXRsaW5lR2FwKCkge1xuICAgIGNvbnN0IGxhYmVsRWwgPSB0aGlzLl9sYWJlbCA/IHRoaXMuX2xhYmVsLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHRoaXMuYXBwZWFyYW5jZSAhPT0gJ291dGxpbmUnIHx8ICFsYWJlbEVsIHx8ICFsYWJlbEVsLmNoaWxkcmVuLmxlbmd0aCB8fFxuICAgICAgICAhbGFiZWxFbC50ZXh0Q29udGVudCEudHJpbSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpc24ndCBhdmFpbGFibGUgb24gdGhlIHNlcnZlci5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgbm90IHByZXNlbnQgaW4gdGhlIERPTSwgdGhlIG91dGxpbmUgZ2FwIHdpbGwgbmVlZCB0byBiZSBjYWxjdWxhdGVkXG4gICAgLy8gdGhlIG5leHQgdGltZSBpdCBpcyBjaGVja2VkIGFuZCBpbiB0aGUgRE9NLlxuICAgIGlmICghdGhpcy5faXNBdHRhY2hlZFRvRE9NKCkpIHtcbiAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRXaWR0aCA9IDA7XG4gICAgbGV0IGdhcFdpZHRoID0gMDtcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2Nvbm5lY3Rpb25Db250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBzdGFydEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1zdGFydCcpO1xuICAgIGNvbnN0IGdhcEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcubWF0LWZvcm0tZmllbGQtb3V0bGluZS1nYXAnKTtcblxuICAgIGlmICh0aGlzLl9sYWJlbCAmJiB0aGlzLl9sYWJlbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgLy8gSWYgdGhlIGNvbnRhaW5lcidzIHdpZHRoIGFuZCBoZWlnaHQgYXJlIHplcm8sIGl0IG1lYW5zIHRoYXQgdGhlIGVsZW1lbnQgaXNcbiAgICAgIC8vIGludmlzaWJsZSBhbmQgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSBvdXRsaW5lIGdhcC4gTWFyayB0aGUgZWxlbWVudCBhcyBuZWVkaW5nXG4gICAgICAvLyB0byBiZSBjaGVja2VkIHRoZSBuZXh0IHRpbWUgdGhlIHpvbmUgc3RhYmlsaXplcy4gV2UgY2FuJ3QgZG8gdGhpcyBpbW1lZGlhdGVseVxuICAgICAgLy8gb24gdGhlIG5leHQgY2hhbmdlIGRldGVjdGlvbiwgYmVjYXVzZSBldmVuIGlmIHRoZSBlbGVtZW50IGJlY29tZXMgdmlzaWJsZSxcbiAgICAgIC8vIHRoZSBgQ2xpZW50UmVjdGAgd29uJ3QgYmUgcmVjbGFjdWxhdGVkIGltbWVkaWF0ZWx5LiBXZSByZXNldCB0aGVcbiAgICAgIC8vIGBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHlgIGZsYWcgc29tZSB3ZSBkb24ndCBydW4gdGhlIGNoZWNrcyB0d2ljZS5cbiAgICAgIGlmIChjb250YWluZXJSZWN0LndpZHRoID09PSAwICYmIGNvbnRhaW5lclJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZE9uU3RhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IHRoaXMuX2dldFN0YXJ0RW5kKGNvbnRhaW5lclJlY3QpO1xuICAgICAgY29uc3QgbGFiZWxDaGlsZHJlbiA9IGxhYmVsRWwuY2hpbGRyZW47XG4gICAgICBjb25zdCBsYWJlbFN0YXJ0ID0gdGhpcy5fZ2V0U3RhcnRFbmQobGFiZWxDaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gICAgICBsZXQgbGFiZWxXaWR0aCA9IDA7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFiZWxDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBsYWJlbFdpZHRoICs9IChsYWJlbENoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHN0YXJ0V2lkdGggPSBNYXRoLmFicyhsYWJlbFN0YXJ0IC0gY29udGFpbmVyU3RhcnQpIC0gb3V0bGluZUdhcFBhZGRpbmc7XG4gICAgICBnYXBXaWR0aCA9IGxhYmVsV2lkdGggPiAwID8gbGFiZWxXaWR0aCAqIGZsb2F0aW5nTGFiZWxTY2FsZSArIG91dGxpbmVHYXBQYWRkaW5nICogMiA6IDA7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydEVscy5sZW5ndGg7IGkrKykge1xuICAgICAgc3RhcnRFbHNbaV0uc3R5bGUud2lkdGggPSBgJHtzdGFydFdpZHRofXB4YDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnYXBFbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGdhcEVsc1tpXS5zdHlsZS53aWR0aCA9IGAke2dhcFdpZHRofXB4YDtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRsaW5lR2FwQ2FsY3VsYXRpb25OZWVkZWRPblN0YWJsZSA9XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgZW5kIG9mIHRoZSByZWN0IGNvbnNpZGVyaW5nIHRoZSBjdXJyZW50IGRpcmVjdGlvbmFsaXR5LiAqL1xuICBwcml2YXRlIF9nZXRTdGFydEVuZChyZWN0OiBDbGllbnRSZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnKSA/IHJlY3QucmlnaHQgOiByZWN0LmxlZnQ7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGZvcm0gZmllbGQgaXMgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cbiAgcHJpdmF0ZSBfaXNBdHRhY2hlZFRvRE9NKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKGVsZW1lbnQuZ2V0Um9vdE5vZGUpIHtcbiAgICAgIGNvbnN0IHJvb3ROb2RlID0gZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuICAgICAgLy8gSWYgdGhlIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSBET00gdGhlIHJvb3Qgbm9kZSB3aWxsIGJlIGVpdGhlciB0aGUgZG9jdW1lbnRcbiAgICAgIC8vIG9yIHRoZSBjbG9zZXN0IHNoYWRvdyByb290LCBvdGhlcndpc2UgaXQnbGwgYmUgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgICAgcmV0dXJuIHJvb3ROb2RlICYmIHJvb3ROb2RlICE9PSBlbGVtZW50O1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSBmYWxsIGJhY2sgdG8gY2hlY2tpbmcgaWYgaXQncyBpbiB0aGUgZG9jdW1lbnQuIFRoaXMgZG9lc24ndCBhY2NvdW50IGZvclxuICAgIC8vIHNoYWRvdyBET00sIGhvd2V2ZXIgYnJvd3NlciB0aGF0IHN1cHBvcnQgc2hhZG93IERPTSBzaG91bGQgc3VwcG9ydCBgZ2V0Um9vdE5vZGVgIGFzIHdlbGwuXG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCEuY29udGFpbnMoZWxlbWVudCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVJlcXVpcmVkTWFya2VyOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=