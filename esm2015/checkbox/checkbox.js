/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Inject, Input, NgZone, Optional, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRipple, mixinColor, mixinDisabled, mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_CHECKBOX_CLICK_ACTION, MAT_CHECKBOX_DEFAULT_OPTIONS } from './checkbox-config';
// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;
/**
 * Provider Expression that allows mat-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatCheckbox),
    multi: true
};
/** Change event object emitted by MatCheckbox. */
export class MatCheckboxChange {
}
// Boilerplate for applying mixins to MatCheckbox.
/** @docs-private */
class MatCheckboxBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatCheckboxMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(MatCheckboxBase))));
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MatCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://material.io/design/components/selection-controls.html
 */
let MatCheckbox = /** @class */ (() => {
    class MatCheckbox extends _MatCheckboxMixinBase {
        constructor(elementRef, _changeDetectorRef, _focusMonitor, _ngZone, tabIndex, 
        /**
         * @deprecated `_clickAction` parameter to be removed, use
         * `MAT_CHECKBOX_DEFAULT_OPTIONS`
         * @breaking-change 10.0.0
         */
        _clickAction, _animationMode, _options) {
            super(elementRef);
            this._changeDetectorRef = _changeDetectorRef;
            this._focusMonitor = _focusMonitor;
            this._ngZone = _ngZone;
            this._clickAction = _clickAction;
            this._animationMode = _animationMode;
            this._options = _options;
            /**
             * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
             * take precedence so this may be omitted.
             */
            this.ariaLabel = '';
            /**
             * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
             */
            this.ariaLabelledby = null;
            this._uniqueId = `mat-checkbox-${++nextUniqueId}`;
            /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
            this.id = this._uniqueId;
            /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
            this.labelPosition = 'after';
            /** Name value will be applied to the input element if present */
            this.name = null;
            /** Event emitted when the checkbox's `checked` value changes. */
            this.change = new EventEmitter();
            /** Event emitted when the checkbox's `indeterminate` value changes. */
            this.indeterminateChange = new EventEmitter();
            /**
             * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
             * @docs-private
             */
            this._onTouched = () => { };
            this._currentAnimationClass = '';
            this._currentCheckState = 0 /* Init */;
            this._controlValueAccessorChangeFn = () => { };
            this._checked = false;
            this._disabled = false;
            this._indeterminate = false;
            this._options = this._options || {};
            if (this._options.color) {
                this.color = this._options.color;
            }
            this.tabIndex = parseInt(tabIndex) || 0;
            this._focusMonitor.monitor(elementRef, true).subscribe(focusOrigin => {
                if (!focusOrigin) {
                    // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                    // Angular does not expect events to be raised during change detection, so any state change
                    // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
                    // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                    // telling the form control it has been touched until the next tick.
                    Promise.resolve().then(() => {
                        this._onTouched();
                        _changeDetectorRef.markForCheck();
                    });
                }
            });
            // TODO: Remove this after the `_clickAction` parameter is removed as an injection parameter.
            this._clickAction = this._clickAction || this._options.clickAction;
        }
        /** Returns the unique id for the visual hidden input. */
        get inputId() { return `${this.id || this._uniqueId}-input`; }
        /** Whether the checkbox is required. */
        get required() { return this._required; }
        set required(value) { this._required = coerceBooleanProperty(value); }
        ngAfterViewInit() {
            this._syncIndeterminate(this._indeterminate);
        }
        // TODO: Delete next major revision.
        ngAfterViewChecked() { }
        ngOnDestroy() {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        /**
         * Whether the checkbox is checked.
         */
        get checked() { return this._checked; }
        set checked(value) {
            if (value != this.checked) {
                this._checked = value;
                this._changeDetectorRef.markForCheck();
            }
        }
        /**
         * Whether the checkbox is disabled. This fully overrides the implementation provided by
         * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
         */
        get disabled() { return this._disabled; }
        set disabled(value) {
            const newValue = coerceBooleanProperty(value);
            if (newValue !== this.disabled) {
                this._disabled = newValue;
                this._changeDetectorRef.markForCheck();
            }
        }
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
         * set to false.
         */
        get indeterminate() { return this._indeterminate; }
        set indeterminate(value) {
            const changed = value != this._indeterminate;
            this._indeterminate = coerceBooleanProperty(value);
            if (changed) {
                if (this._indeterminate) {
                    this._transitionCheckState(3 /* Indeterminate */);
                }
                else {
                    this._transitionCheckState(this.checked ? 1 /* Checked */ : 2 /* Unchecked */);
                }
                this.indeterminateChange.emit(this._indeterminate);
            }
            this._syncIndeterminate(this._indeterminate);
        }
        _isRippleDisabled() {
            return this.disableRipple || this.disabled;
        }
        /** Method being called whenever the label text changes. */
        _onLabelTextChange() {
            // Since the event of the `cdkObserveContent` directive runs outside of the zone, the checkbox
            // component will be only marked for check, but no actual change detection runs automatically.
            // Instead of going back into the zone in order to trigger a change detection which causes
            // *all* components to be checked (if explicitly marked or not using OnPush), we only trigger
            // an explicit change detection for the checkbox view and its children.
            this._changeDetectorRef.detectChanges();
        }
        // Implemented as part of ControlValueAccessor.
        writeValue(value) {
            this.checked = !!value;
        }
        // Implemented as part of ControlValueAccessor.
        registerOnChange(fn) {
            this._controlValueAccessorChangeFn = fn;
        }
        // Implemented as part of ControlValueAccessor.
        registerOnTouched(fn) {
            this._onTouched = fn;
        }
        // Implemented as part of ControlValueAccessor.
        setDisabledState(isDisabled) {
            this.disabled = isDisabled;
        }
        _getAriaChecked() {
            if (this.checked) {
                return 'true';
            }
            return this.indeterminate ? 'mixed' : 'false';
        }
        _transitionCheckState(newState) {
            let oldState = this._currentCheckState;
            let element = this._elementRef.nativeElement;
            if (oldState === newState) {
                return;
            }
            if (this._currentAnimationClass.length > 0) {
                element.classList.remove(this._currentAnimationClass);
            }
            this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
            this._currentCheckState = newState;
            if (this._currentAnimationClass.length > 0) {
                element.classList.add(this._currentAnimationClass);
                // Remove the animation class to avoid animation when the checkbox is moved between containers
                const animationClass = this._currentAnimationClass;
                this._ngZone.runOutsideAngular(() => {
                    setTimeout(() => {
                        element.classList.remove(animationClass);
                    }, 1000);
                });
            }
        }
        _emitChangeEvent() {
            const event = new MatCheckboxChange();
            event.source = this;
            event.checked = this.checked;
            this._controlValueAccessorChangeFn(this.checked);
            this.change.emit(event);
        }
        /** Toggles the `checked` state of the checkbox. */
        toggle() {
            this.checked = !this.checked;
        }
        /**
         * Event handler for checkbox input element.
         * Toggles checked state if element is not disabled.
         * Do not toggle on (change) event since IE doesn't fire change event when
         *   indeterminate checkbox is clicked.
         * @param event
         */
        _onInputClick(event) {
            // We have to stop propagation for click events on the visual hidden input element.
            // By default, when a user clicks on a label element, a generated click event will be
            // dispatched on the associated input element. Since we are using a label element as our
            // root container, the click event on the `checkbox` will be executed twice.
            // The real click event will bubble up, and the generated click event also tries to bubble up.
            // This will lead to multiple click events.
            // Preventing bubbling for the second event will solve that issue.
            event.stopPropagation();
            // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
            if (!this.disabled && this._clickAction !== 'noop') {
                // When user manually click on the checkbox, `indeterminate` is set to false.
                if (this.indeterminate && this._clickAction !== 'check') {
                    Promise.resolve().then(() => {
                        this._indeterminate = false;
                        this.indeterminateChange.emit(this._indeterminate);
                    });
                }
                this.toggle();
                this._transitionCheckState(this._checked ? 1 /* Checked */ : 2 /* Unchecked */);
                // Emit our custom change event if the native input emitted one.
                // It is important to only emit it, if the native input triggered one, because
                // we don't want to trigger a change event, when the `checked` variable changes for example.
                this._emitChangeEvent();
            }
            else if (!this.disabled && this._clickAction === 'noop') {
                // Reset native input when clicked with noop. The native checkbox becomes checked after
                // click, reset it to be align with `checked` value of `mat-checkbox`.
                this._inputElement.nativeElement.checked = this.checked;
                this._inputElement.nativeElement.indeterminate = this.indeterminate;
            }
        }
        /** Focuses the checkbox. */
        focus(origin = 'keyboard', options) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        }
        _onInteractionEvent(event) {
            // We always have to stop propagation on the change event.
            // Otherwise the change event, from the input element, will bubble up and
            // emit its event object to the `change` output.
            event.stopPropagation();
        }
        _getAnimationClassForCheckStateTransition(oldState, newState) {
            // Don't transition if animations are disabled.
            if (this._animationMode === 'NoopAnimations') {
                return '';
            }
            let animSuffix = '';
            switch (oldState) {
                case 0 /* Init */:
                    // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                    // [checked] bound to it.
                    if (newState === 1 /* Checked */) {
                        animSuffix = 'unchecked-checked';
                    }
                    else if (newState == 3 /* Indeterminate */) {
                        animSuffix = 'unchecked-indeterminate';
                    }
                    else {
                        return '';
                    }
                    break;
                case 2 /* Unchecked */:
                    animSuffix = newState === 1 /* Checked */ ?
                        'unchecked-checked' : 'unchecked-indeterminate';
                    break;
                case 1 /* Checked */:
                    animSuffix = newState === 2 /* Unchecked */ ?
                        'checked-unchecked' : 'checked-indeterminate';
                    break;
                case 3 /* Indeterminate */:
                    animSuffix = newState === 1 /* Checked */ ?
                        'indeterminate-checked' : 'indeterminate-unchecked';
                    break;
            }
            return `mat-checkbox-anim-${animSuffix}`;
        }
        /**
         * Syncs the indeterminate value with the checkbox DOM node.
         *
         * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
         * property is supported on an element boils down to `if (propName in element)`. Domino's
         * HTMLInputElement doesn't have an `indeterminate` property so Ivy will warn during
         * server-side rendering.
         */
        _syncIndeterminate(value) {
            const nativeCheckbox = this._inputElement;
            if (nativeCheckbox) {
                nativeCheckbox.nativeElement.indeterminate = value;
            }
        }
    }
    MatCheckbox.decorators = [
        { type: Component, args: [{
                    selector: 'mat-checkbox',
                    template: "<label [attr.for]=\"inputId\" class=\"mat-checkbox-layout\" #label>\n  <div class=\"mat-checkbox-inner-container\"\n       [class.mat-checkbox-inner-container-no-side-margin]=\"!checkboxLabel.textContent || !checkboxLabel.textContent.trim()\">\n    <input #input\n           class=\"mat-checkbox-input cdk-visually-hidden\" type=\"checkbox\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [checked]=\"checked\"\n           [attr.value]=\"value\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [tabIndex]=\"tabIndex\"\n           [attr.aria-label]=\"ariaLabel || null\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-checked]=\"_getAriaChecked()\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onInteractionEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n    <div matRipple class=\"mat-checkbox-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleRadius]=\"20\"\n         [matRippleCentered]=\"true\"\n         [matRippleAnimation]=\"{enterDuration: 150}\">\n      <div class=\"mat-ripple-element mat-checkbox-persistent-ripple\"></div>\n    </div>\n    <div class=\"mat-checkbox-frame\"></div>\n    <div class=\"mat-checkbox-background\">\n      <svg version=\"1.1\"\n           focusable=\"false\"\n           class=\"mat-checkbox-checkmark\"\n           viewBox=\"0 0 24 24\"\n           xml:space=\"preserve\">\n        <path class=\"mat-checkbox-checkmark-path\"\n              fill=\"none\"\n              stroke=\"white\"\n              d=\"M4.1,12.7 9,17.6 20.3,6.3\"/>\n      </svg>\n      <!-- Element for rendering the indeterminate state checkbox. -->\n      <div class=\"mat-checkbox-mixedmark\"></div>\n    </div>\n  </div>\n  <span class=\"mat-checkbox-label\" #checkboxLabel (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n",
                    exportAs: 'matCheckbox',
                    host: {
                        'class': 'mat-checkbox',
                        '[id]': 'id',
                        '[attr.tabindex]': 'null',
                        '[class.mat-checkbox-indeterminate]': 'indeterminate',
                        '[class.mat-checkbox-checked]': 'checked',
                        '[class.mat-checkbox-disabled]': 'disabled',
                        '[class.mat-checkbox-label-before]': 'labelPosition == "before"',
                        '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
                    },
                    providers: [MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR],
                    inputs: ['disableRipple', 'color', 'tabIndex'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.910259}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);stroke-dashoffset:0}to{stroke-dashoffset:-22.910259}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0deg)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}32.8%,100%{opacity:0;transform:scaleX(0)}}.mat-checkbox-background,.mat-checkbox-frame{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);cursor:pointer;-webkit-tap-highlight-color:transparent}._mat-animation-noopable.mat-checkbox{transition:none;animation:none}.mat-checkbox .mat-ripple-element:not(.mat-checkbox-persistent-ripple){opacity:.16}.mat-checkbox-layout{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex;white-space:nowrap}.mat-checkbox-label{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto}.mat-checkbox-inner-container{display:inline-block;height:16px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:16px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1);border-width:2px;border-style:solid}._mat-animation-noopable .mat-checkbox-frame{transition:none}.mat-checkbox.cdk-keyboard-focused .cdk-high-contrast-active .mat-checkbox-frame{border-style:dotted}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0, 0, 0.2, 0.1),opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}._mat-animation-noopable .mat-checkbox-background{transition:none}.cdk-high-contrast-active .mat-checkbox .mat-checkbox-background{background:none}.mat-checkbox-persistent-ripple{width:100%;height:100%;transform:none}.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:.04}.mat-checkbox.cdk-keyboard-focused .mat-checkbox-persistent-ripple{opacity:.12}.mat-checkbox-persistent-ripple,.mat-checkbox.mat-checkbox-disabled .mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:0}@media(hover: none){.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{display:none}}.mat-checkbox-checkmark{top:0;left:0;right:0;bottom:0;position:absolute;width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.910259;stroke-dasharray:22.910259;stroke-width:2.1333333333px}.cdk-high-contrast-black-on-white .mat-checkbox-checkmark-path{stroke:#000 !important}.mat-checkbox-mixedmark{width:calc(100% - 6px);height:2px;opacity:0;transform:scaleX(0) rotate(0deg);border-radius:2px}.cdk-high-contrast-active .mat-checkbox-mixedmark{height:0;border-top:solid 2px;margin-top:2px}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0deg)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.cdk-high-contrast-active .mat-checkbox-disabled{opacity:.5}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0ms mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0ms mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:300ms linear 0ms mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}.mat-checkbox .mat-checkbox-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}\n"]
                }] }
    ];
    /** @nocollapse */
    MatCheckbox.ctorParameters = () => [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: FocusMonitor },
        { type: NgZone },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_CHECKBOX_CLICK_ACTION,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_CHECKBOX_DEFAULT_OPTIONS,] }] }
    ];
    MatCheckbox.propDecorators = {
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
        ariaDescribedby: [{ type: Input, args: ['aria-describedby',] }],
        id: [{ type: Input }],
        required: [{ type: Input }],
        labelPosition: [{ type: Input }],
        name: [{ type: Input }],
        change: [{ type: Output }],
        indeterminateChange: [{ type: Output }],
        value: [{ type: Input }],
        _inputElement: [{ type: ViewChild, args: ['input',] }],
        ripple: [{ type: ViewChild, args: [MatRipple,] }],
        checked: [{ type: Input }],
        disabled: [{ type: Input }],
        indeterminate: [{ type: Input }]
    };
    return MatCheckbox;
})();
export { MatCheckbox };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFrQixZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQVNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLDRCQUE0QixFQUc3QixNQUFNLG1CQUFtQixDQUFDO0FBRzNCLHdFQUF3RTtBQUN4RSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFRO0lBQ3RELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDMUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBaUJGLGtEQUFrRDtBQUNsRCxNQUFNLE9BQU8saUJBQWlCO0NBSzdCO0FBRUQs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IFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9uLCBGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBNYXRSaXBwbGUsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9DSEVDS0JPWF9DTElDS19BQ1RJT04sXG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlMsXG4gIE1hdENoZWNrYm94Q2xpY2tBY3Rpb24sXG4gIE1hdENoZWNrYm94RGVmYXVsdE9wdGlvbnNcbn0gZnJvbSAnLi9jaGVja2JveC1jb25maWcnO1xuXG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciBjaGVja2JveCBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtY2hlY2tib3ggdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hFQ0tCT1hfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0Q2hlY2tib3gpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkaWZmZXJlbnQgc3RhdGVzIHRoYXQgcmVxdWlyZSBjdXN0b20gdHJhbnNpdGlvbnMgYmV0d2VlbiB0aGVtLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZW51bSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZSB7XG4gIC8qKiBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IGJlZm9yZSBhbnkgdXNlciBpbnRlcmFjdGlvbi4gKi9cbiAgSW5pdCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgY2hlY2tlZC4gKi9cbiAgQ2hlY2tlZCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgdW5jaGVja2VkLiAqL1xuICBVbmNoZWNrZWQsXG4gIC8qKiBUaGUgc3RhdGUgcmVwcmVzZW50aW5nIHRoZSBjb21wb25lbnQgd2hlbiBpdCdzIGJlY29taW5nIGluZGV0ZXJtaW5hdGUuICovXG4gIEluZGV0ZXJtaW5hdGVcbn1cblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRDaGVja2JveC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveENoYW5nZSB7XG4gIC8qKiBUaGUgc291cmNlIE1hdENoZWNrYm94IG9mIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBNYXRDaGVja2JveDtcbiAgLyoqIFRoZSBuZXcgYGNoZWNrZWRgIHZhbHVlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgY2hlY2tlZDogYm9vbGVhbjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGVja2JveC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRDaGVja2JveEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0Q2hlY2tib3hNaXhpbkJhc2U6XG4gICAgSGFzVGFiSW5kZXhDdG9yICZcbiAgICBDYW5Db2xvckN0b3IgJlxuICAgIENhbkRpc2FibGVSaXBwbGVDdG9yICZcbiAgICBDYW5EaXNhYmxlQ3RvciAmXG4gICAgdHlwZW9mIE1hdENoZWNrYm94QmFzZSA9XG4gICAgICAgIG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVSaXBwbGUobWl4aW5EaXNhYmxlZChNYXRDaGVja2JveEJhc2UpKSkpO1xuXG5cbi8qKlxuICogQSBtYXRlcmlhbCBkZXNpZ24gY2hlY2tib3ggY29tcG9uZW50LiBTdXBwb3J0cyBhbGwgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYW4gSFRNTDUgY2hlY2tib3gsXG4gKiBhbmQgZXhwb3NlcyBhIHNpbWlsYXIgQVBJLiBBIE1hdENoZWNrYm94IGNhbiBiZSBlaXRoZXIgY2hlY2tlZCwgdW5jaGVja2VkLCBpbmRldGVybWluYXRlLCBvclxuICogZGlzYWJsZWQuIE5vdGUgdGhhdCBhbGwgYWRkaXRpb25hbCBhY2Nlc3NpYmlsaXR5IGF0dHJpYnV0ZXMgYXJlIHRha2VuIGNhcmUgb2YgYnkgdGhlIGNvbXBvbmVudCxcbiAqIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gcHJvdmlkZSB0aGVtIHlvdXJzZWxmLiBIb3dldmVyLCBpZiB5b3Ugd2FudCB0byBvbWl0IGEgbGFiZWwgYW5kIHN0aWxsXG4gKiBoYXZlIHRoZSBjaGVja2JveCBiZSBhY2Nlc3NpYmxlLCB5b3UgbWF5IHN1cHBseSBhbiBbYXJpYS1sYWJlbF0gaW5wdXQuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvc2VsZWN0aW9uLWNvbnRyb2xzLmh0bWxcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoZWNrYm94JyxcbiAgdGVtcGxhdGVVcmw6ICdjaGVja2JveC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2NoZWNrYm94LmNzcyddLFxuICBleHBvcnRBczogJ21hdENoZWNrYm94JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hlY2tib3gnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWluZGV0ZXJtaW5hdGVdJzogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWNoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tib3gtbGFiZWwtYmVmb3JlXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiYmVmb3JlXCInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnYCxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbTUFUX0NIRUNLQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZScsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveCBleHRlbmRzIF9NYXRDaGVja2JveE1peGluQmFzZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSwgQ2FuQ29sb3IsIENhbkRpc2FibGUsIEhhc1RhYkluZGV4LCBDYW5EaXNhYmxlUmlwcGxlLFxuICAgIEZvY3VzYWJsZU9wdGlvbiB7XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVkIHRvIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZSBvZiB0aGUgaG9zdCBlbGVtZW50LiBJbiBtb3N0IGNhc2VzLCBhcmlhLWxhYmVsbGVkYnkgd2lsbFxuICAgKiB0YWtlIHByZWNlZGVuY2Ugc28gdGhpcyBtYXkgYmUgb21pdHRlZC5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgJ2FyaWEtZGVzY3JpYmVkYnknIGF0dHJpYnV0ZSBpcyByZWFkIGFmdGVyIHRoZSBlbGVtZW50J3MgbGFiZWwgYW5kIGZpZWxkIHR5cGUuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3VuaXF1ZUlkOiBzdHJpbmcgPSBgbWF0LWNoZWNrYm94LSR7KytuZXh0VW5pcXVlSWR9YDtcblxuICAvKiogQSB1bmlxdWUgaWQgZm9yIHRoZSBjaGVja2JveCBpbnB1dC4gSWYgbm9uZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuXG4gIC8qKiBSZXR1cm5zIHRoZSB1bmlxdWUgaWQgZm9yIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0LiAqL1xuICBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gYCR7dGhpcy5pZCB8fCB0aGlzLl91bmlxdWVJZH0taW5wdXRgOyB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KCkgbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogTmFtZSB2YWx1ZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGVsZW1lbnQgaWYgcHJlc2VudCAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjaGVja2JveCdzIGBjaGVja2VkYCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tib3gncyBgaW5kZXRlcm1pbmF0ZWAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGluZGV0ZXJtaW5hdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogVGhlIHZhbHVlIGF0dHJpYnV0ZSBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgKi9cbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZztcblxuICAvKiogVGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPmAgZWxlbWVudCAqL1xuICBAVmlld0NoaWxkKCdpbnB1dCcpIF9pbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGluc3RhbmNlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJpcHBsZTogTWF0UmlwcGxlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgYmx1cnJlZC4gTmVlZGVkIHRvIHByb3Blcmx5IGltcGxlbWVudCBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3VycmVudEFuaW1hdGlvbkNsYXNzOiBzdHJpbmcgPSAnJztcblxuICBwcml2YXRlIF9jdXJyZW50Q2hlY2tTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUgPSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5Jbml0O1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBgX2NsaWNrQWN0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZCwgdXNlXG4gICAgICAgICAgICAgICAqIGBNQVRfQ0hFQ0tCT1hfREVGQVVMVF9PUFRJT05TYFxuICAgICAgICAgICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQ0hFQ0tCT1hfQ0xJQ0tfQUNUSU9OKVxuICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfY2xpY2tBY3Rpb246IE1hdENoZWNrYm94Q2xpY2tBY3Rpb24sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0NIRUNLQk9YX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIHByaXZhdGUgX29wdGlvbnM/OiBNYXRDaGVja2JveERlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5jb2xvcikge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuX29wdGlvbnMuY29sb3I7XG4gICAgfVxuXG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IoZWxlbWVudFJlZiwgdHJ1ZSkuc3Vic2NyaWJlKGZvY3VzT3JpZ2luID0+IHtcbiAgICAgIGlmICghZm9jdXNPcmlnaW4pIHtcbiAgICAgICAgLy8gV2hlbiBhIGZvY3VzZWQgZWxlbWVudCBiZWNvbWVzIGRpc2FibGVkLCB0aGUgYnJvd3NlciAqaW1tZWRpYXRlbHkqIGZpcmVzIGEgYmx1ciBldmVudC5cbiAgICAgICAgLy8gQW5ndWxhciBkb2VzIG5vdCBleHBlY3QgZXZlbnRzIHRvIGJlIHJhaXNlZCBkdXJpbmcgY2hhbmdlIGRldGVjdGlvbiwgc28gYW55IHN0YXRlIGNoYW5nZVxuICAgICAgICAvLyAoc3VjaCBhcyBhIGZvcm0gY29udHJvbCdzICduZy10b3VjaGVkJykgd2lsbCBjYXVzZSBhIGNoYW5nZWQtYWZ0ZXItY2hlY2tlZCBlcnJvci5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE3NzkzLiBUbyB3b3JrIGFyb3VuZCB0aGlzLCB3ZSBkZWZlclxuICAgICAgICAvLyB0ZWxsaW5nIHRoZSBmb3JtIGNvbnRyb2wgaXQgaGFzIGJlZW4gdG91Y2hlZCB1bnRpbCB0aGUgbmV4dCB0aWNrLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgICAgICBfY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgYWZ0ZXIgdGhlIGBfY2xpY2tBY3Rpb25gIHBhcmFtZXRlciBpcyByZW1vdmVkIGFzIGFuIGluamVjdGlvbiBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fY2xpY2tBY3Rpb24gPSB0aGlzLl9jbGlja0FjdGlvbiB8fCB0aGlzLl9vcHRpb25zLmNsaWNrQWN0aW9uO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3N5bmNJbmRldGVybWluYXRlKHRoaXMuX2luZGV0ZXJtaW5hdGUpO1xuICB9XG5cbiAgLy8gVE9ETzogRGVsZXRlIG5leHQgbWFqb3IgcmV2aXNpb24uXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHt9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7IH1cbiAgc2V0IGNoZWNrZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT0gdGhpcy5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9jaGVja2VkID0gdmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBkaXNhYmxlZC4gVGhpcyBmdWxseSBvdmVycmlkZXMgdGhlIGltcGxlbWVudGF0aW9uIHByb3ZpZGVkIGJ5XG4gICAqIG1peGluRGlzYWJsZWQsIGJ1dCB0aGUgbWl4aW4gaXMgc3RpbGwgcmVxdWlyZWQgYmVjYXVzZSBtaXhpblRhYkluZGV4IHJlcXVpcmVzIGl0LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgaW5kZXRlcm1pbmF0ZS4gVGhpcyBpcyBhbHNvIGtub3duIGFzIFwibWl4ZWRcIiBtb2RlIGFuZCBjYW4gYmUgdXNlZCB0b1xuICAgKiByZXByZXNlbnQgYSBjaGVja2JveCB3aXRoIHRocmVlIHN0YXRlcywgZS5nLiBhIGNoZWNrYm94IHRoYXQgcmVwcmVzZW50cyBhIG5lc3RlZCBsaXN0IG9mXG4gICAqIGNoZWNrYWJsZSBpdGVtcy4gTm90ZSB0aGF0IHdoZW5ldmVyIGNoZWNrYm94IGlzIG1hbnVhbGx5IGNsaWNrZWQsIGluZGV0ZXJtaW5hdGUgaXMgaW1tZWRpYXRlbHlcbiAgICogc2V0IHRvIGZhbHNlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGluZGV0ZXJtaW5hdGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9pbmRldGVybWluYXRlOyB9XG4gIHNldCBpbmRldGVybWluYXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHZhbHVlICE9IHRoaXMuX2luZGV0ZXJtaW5hdGU7XG4gICAgdGhpcy5faW5kZXRlcm1pbmF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgaWYgKHRoaXMuX2luZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkNoZWNrU3RhdGUoVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5kZXRlcm1pbmF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uQ2hlY2tTdGF0ZShcbiAgICAgICAgICB0aGlzLmNoZWNrZWQgPyBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkIDogVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5kZXRlcm1pbmF0ZUNoYW5nZS5lbWl0KHRoaXMuX2luZGV0ZXJtaW5hdGUpO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmNJbmRldGVybWluYXRlKHRoaXMuX2luZGV0ZXJtaW5hdGUpO1xuICB9XG4gIHByaXZhdGUgX2luZGV0ZXJtaW5hdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogTWV0aG9kIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgbGFiZWwgdGV4dCBjaGFuZ2VzLiAqL1xuICBfb25MYWJlbFRleHRDaGFuZ2UoKSB7XG4gICAgLy8gU2luY2UgdGhlIGV2ZW50IG9mIHRoZSBgY2RrT2JzZXJ2ZUNvbnRlbnRgIGRpcmVjdGl2ZSBydW5zIG91dHNpZGUgb2YgdGhlIHpvbmUsIHRoZSBjaGVja2JveFxuICAgIC8vIGNvbXBvbmVudCB3aWxsIGJlIG9ubHkgbWFya2VkIGZvciBjaGVjaywgYnV0IG5vIGFjdHVhbCBjaGFuZ2UgZGV0ZWN0aW9uIHJ1bnMgYXV0b21hdGljYWxseS5cbiAgICAvLyBJbnN0ZWFkIG9mIGdvaW5nIGJhY2sgaW50byB0aGUgem9uZSBpbiBvcmRlciB0byB0cmlnZ2VyIGEgY2hhbmdlIGRldGVjdGlvbiB3aGljaCBjYXVzZXNcbiAgICAvLyAqYWxsKiBjb21wb25lbnRzIHRvIGJlIGNoZWNrZWQgKGlmIGV4cGxpY2l0bHkgbWFya2VkIG9yIG5vdCB1c2luZyBPblB1c2gpLCB3ZSBvbmx5IHRyaWdnZXJcbiAgICAvLyBhbiBleHBsaWNpdCBjaGFuZ2UgZGV0ZWN0aW9uIGZvciB0aGUgY2hlY2tib3ggdmlldyBhbmQgaXRzIGNoaWxkcmVuLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuY2hlY2tlZCA9ICEhdmFsdWU7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgX2dldEFyaWFDaGVja2VkKCk6ICd0cnVlJyB8ICdmYWxzZScgfCAnbWl4ZWQnIHtcbiAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICByZXR1cm4gJ3RydWUnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmluZGV0ZXJtaW5hdGUgPyAnbWl4ZWQnIDogJ2ZhbHNlJztcbiAgfVxuXG4gIHByaXZhdGUgX3RyYW5zaXRpb25DaGVja1N0YXRlKG5ld1N0YXRlOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZSkge1xuICAgIGxldCBvbGRTdGF0ZSA9IHRoaXMuX2N1cnJlbnRDaGVja1N0YXRlO1xuICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmIChvbGRTdGF0ZSA9PT0gbmV3U3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcy5sZW5ndGggPiAwKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MgPSB0aGlzLl9nZXRBbmltYXRpb25DbGFzc0ZvckNoZWNrU3RhdGVUcmFuc2l0aW9uKFxuICAgICAgICBvbGRTdGF0ZSwgbmV3U3RhdGUpO1xuICAgIHRoaXMuX2N1cnJlbnRDaGVja1N0YXRlID0gbmV3U3RhdGU7XG5cbiAgICBpZiAodGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGFuaW1hdGlvbiBjbGFzcyB0byBhdm9pZCBhbmltYXRpb24gd2hlbiB0aGUgY2hlY2tib3ggaXMgbW92ZWQgYmV0d2VlbiBjb250YWluZXJzXG4gICAgICBjb25zdCBhbmltYXRpb25DbGFzcyA9IHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcztcblxuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGFuaW1hdGlvbkNsYXNzKTtcbiAgICAgICAgfSwgMTAwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9lbWl0Q2hhbmdlRXZlbnQoKSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0Q2hlY2tib3hDaGFuZ2UoKTtcbiAgICBldmVudC5zb3VyY2UgPSB0aGlzO1xuICAgIGV2ZW50LmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG5cbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKHRoaXMuY2hlY2tlZCk7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgYGNoZWNrZWRgIHN0YXRlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tlZCA9ICF0aGlzLmNoZWNrZWQ7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3IgY2hlY2tib3ggaW5wdXQgZWxlbWVudC5cbiAgICogVG9nZ2xlcyBjaGVja2VkIHN0YXRlIGlmIGVsZW1lbnQgaXMgbm90IGRpc2FibGVkLlxuICAgKiBEbyBub3QgdG9nZ2xlIG9uIChjaGFuZ2UpIGV2ZW50IHNpbmNlIElFIGRvZXNuJ3QgZmlyZSBjaGFuZ2UgZXZlbnQgd2hlblxuICAgKiAgIGluZGV0ZXJtaW5hdGUgY2hlY2tib3ggaXMgY2xpY2tlZC5cbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBfb25JbnB1dENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBmb3IgY2xpY2sgZXZlbnRzIG9uIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0IGVsZW1lbnQuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgbGFiZWwgZWxlbWVudCwgYSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgd2lsbCBiZVxuICAgIC8vIGRpc3BhdGNoZWQgb24gdGhlIGFzc29jaWF0ZWQgaW5wdXQgZWxlbWVudC4gU2luY2Ugd2UgYXJlIHVzaW5nIGEgbGFiZWwgZWxlbWVudCBhcyBvdXJcbiAgICAvLyByb290IGNvbnRhaW5lciwgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBgY2hlY2tib3hgIHdpbGwgYmUgZXhlY3V0ZWQgdHdpY2UuXG4gICAgLy8gVGhlIHJlYWwgY2xpY2sgZXZlbnQgd2lsbCBidWJibGUgdXAsIGFuZCB0aGUgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IGFsc28gdHJpZXMgdG8gYnViYmxlIHVwLlxuICAgIC8vIFRoaXMgd2lsbCBsZWFkIHRvIG11bHRpcGxlIGNsaWNrIGV2ZW50cy5cbiAgICAvLyBQcmV2ZW50aW5nIGJ1YmJsaW5nIGZvciB0aGUgc2Vjb25kIGV2ZW50IHdpbGwgc29sdmUgdGhhdCBpc3N1ZS5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIC8vIElmIHJlc2V0SW5kZXRlcm1pbmF0ZSBpcyBmYWxzZSwgYW5kIHRoZSBjdXJyZW50IHN0YXRlIGlzIGluZGV0ZXJtaW5hdGUsIGRvIG5vdGhpbmcgb24gY2xpY2tcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5fY2xpY2tBY3Rpb24gIT09ICdub29wJykge1xuICAgICAgLy8gV2hlbiB1c2VyIG1hbnVhbGx5IGNsaWNrIG9uIHRoZSBjaGVja2JveCwgYGluZGV0ZXJtaW5hdGVgIGlzIHNldCB0byBmYWxzZS5cbiAgICAgIGlmICh0aGlzLmluZGV0ZXJtaW5hdGUgJiYgdGhpcy5fY2xpY2tBY3Rpb24gIT09ICdjaGVjaycpIHtcblxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9pbmRldGVybWluYXRlID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5pbmRldGVybWluYXRlQ2hhbmdlLmVtaXQodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNoZWNrU3RhdGUoXG4gICAgICAgICAgdGhpcy5fY2hlY2tlZCA/IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQgOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWQpO1xuXG4gICAgICAvLyBFbWl0IG91ciBjdXN0b20gY2hhbmdlIGV2ZW50IGlmIHRoZSBuYXRpdmUgaW5wdXQgZW1pdHRlZCBvbmUuXG4gICAgICAvLyBJdCBpcyBpbXBvcnRhbnQgdG8gb25seSBlbWl0IGl0LCBpZiB0aGUgbmF0aXZlIGlucHV0IHRyaWdnZXJlZCBvbmUsIGJlY2F1c2VcbiAgICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gdHJpZ2dlciBhIGNoYW5nZSBldmVudCwgd2hlbiB0aGUgYGNoZWNrZWRgIHZhcmlhYmxlIGNoYW5nZXMgZm9yIGV4YW1wbGUuXG4gICAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmRpc2FibGVkICYmIHRoaXMuX2NsaWNrQWN0aW9uID09PSAnbm9vcCcpIHtcbiAgICAgIC8vIFJlc2V0IG5hdGl2ZSBpbnB1dCB3aGVuIGNsaWNrZWQgd2l0aCBub29wLiBUaGUgbmF0aXZlIGNoZWNrYm94IGJlY29tZXMgY2hlY2tlZCBhZnRlclxuICAgICAgLy8gY2xpY2ssIHJlc2V0IGl0IHRvIGJlIGFsaWduIHdpdGggYGNoZWNrZWRgIHZhbHVlIG9mIGBtYXQtY2hlY2tib3hgLlxuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcbiAgICAgIHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmluZGV0ZXJtaW5hdGUgPSB0aGlzLmluZGV0ZXJtaW5hdGU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGNoZWNrYm94LiAqL1xuICBmb2N1cyhvcmlnaW46IEZvY3VzT3JpZ2luID0gJ2tleWJvYXJkJywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9pbnB1dEVsZW1lbnQsIG9yaWdpbiwgb3B0aW9ucyk7XG4gIH1cblxuICBfb25JbnRlcmFjdGlvbkV2ZW50KGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gb24gdGhlIGNoYW5nZSBldmVudC5cbiAgICAvLyBPdGhlcndpc2UgdGhlIGNoYW5nZSBldmVudCwgZnJvbSB0aGUgaW5wdXQgZWxlbWVudCwgd2lsbCBidWJibGUgdXAgYW5kXG4gICAgLy8gZW1pdCBpdHMgZXZlbnQgb2JqZWN0IHRvIHRoZSBgY2hhbmdlYCBvdXRwdXQuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRBbmltYXRpb25DbGFzc0ZvckNoZWNrU3RhdGVUcmFuc2l0aW9uKFxuICAgICAgb2xkU3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlLCBuZXdTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUpOiBzdHJpbmcge1xuICAgIC8vIERvbid0IHRyYW5zaXRpb24gaWYgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBsZXQgYW5pbVN1ZmZpeDogc3RyaW5nID0gJyc7XG5cbiAgICBzd2l0Y2ggKG9sZFN0YXRlKSB7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLkluaXQ6XG4gICAgICAgIC8vIEhhbmRsZSBlZGdlIGNhc2Ugd2hlcmUgdXNlciBpbnRlcmFjdHMgd2l0aCBjaGVja2JveCB0aGF0IGRvZXMgbm90IGhhdmUgWyhuZ01vZGVsKV0gb3JcbiAgICAgICAgLy8gW2NoZWNrZWRdIGJvdW5kIHRvIGl0LlxuICAgICAgICBpZiAobmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQpIHtcbiAgICAgICAgICBhbmltU3VmZml4ID0gJ3VuY2hlY2tlZC1jaGVja2VkJztcbiAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5JbmRldGVybWluYXRlKSB7XG4gICAgICAgICAgYW5pbVN1ZmZpeCA9ICd1bmNoZWNrZWQtaW5kZXRlcm1pbmF0ZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWQ6XG4gICAgICAgIGFuaW1TdWZmaXggPSBuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZCA/XG4gICAgICAgICAgICAndW5jaGVja2VkLWNoZWNrZWQnIDogJ3VuY2hlY2tlZC1pbmRldGVybWluYXRlJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQ6XG4gICAgICAgIGFuaW1TdWZmaXggPSBuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkID9cbiAgICAgICAgICAgICdjaGVja2VkLXVuY2hlY2tlZCcgOiAnY2hlY2tlZC1pbmRldGVybWluYXRlJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLkluZGV0ZXJtaW5hdGU6XG4gICAgICAgIGFuaW1TdWZmaXggPSBuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZCA/XG4gICAgICAgICAgICAnaW5kZXRlcm1pbmF0ZS1jaGVja2VkJyA6ICdpbmRldGVybWluYXRlLXVuY2hlY2tlZCc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBgbWF0LWNoZWNrYm94LWFuaW0tJHthbmltU3VmZml4fWA7XG4gIH1cblxuICAvKipcbiAgICogU3luY3MgdGhlIGluZGV0ZXJtaW5hdGUgdmFsdWUgd2l0aCB0aGUgY2hlY2tib3ggRE9NIG5vZGUuXG4gICAqXG4gICAqIFdlIHN5bmMgYGluZGV0ZXJtaW5hdGVgIGRpcmVjdGx5IG9uIHRoZSBET00gbm9kZSwgYmVjYXVzZSBpbiBJdnkgdGhlIGNoZWNrIGZvciB3aGV0aGVyIGFcbiAgICogcHJvcGVydHkgaXMgc3VwcG9ydGVkIG9uIGFuIGVsZW1lbnQgYm9pbHMgZG93biB0byBgaWYgKHByb3BOYW1lIGluIGVsZW1lbnQpYC4gRG9taW5vJ3NcbiAgICogSFRNTElucHV0RWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gYGluZGV0ZXJtaW5hdGVgIHByb3BlcnR5IHNvIEl2eSB3aWxsIHdhcm4gZHVyaW5nXG4gICAqIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICovXG4gIHByaXZhdGUgX3N5bmNJbmRldGVybWluYXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmF0aXZlQ2hlY2tib3ggPSB0aGlzLl9pbnB1dEVsZW1lbnQ7XG5cbiAgICBpZiAobmF0aXZlQ2hlY2tib3gpIHtcbiAgICAgIG5hdGl2ZUNoZWNrYm94Lm5hdGl2ZUVsZW1lbnQuaW5kZXRlcm1pbmF0ZSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2luZGV0ZXJtaW5hdGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==