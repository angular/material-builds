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
export class MatCheckbox extends _MatCheckboxMixinBase {
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
        // TODO: Remove this after the `_clickAction` parameter is removed as an injection parameter.
        this._clickAction = this._clickAction || this._options.clickAction;
    }
    /** Returns the unique id for the visual hidden input. */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
    /** Whether the checkbox is required. */
    get required() { return this._required; }
    set required(value) { this._required = coerceBooleanProperty(value); }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this._elementRef, true).subscribe(focusOrigin => {
            if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state change
                // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
                // See https://github.com/angular/angular/issues/17793. To work around this, we defer
                // telling the form control it has been touched until the next tick.
                Promise.resolve().then(() => {
                    this._onTouched();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
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
                styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.910259}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);stroke-dashoffset:0}to{stroke-dashoffset:-22.910259}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0deg)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}32.8%,100%{opacity:0;transform:scaleX(0)}}.mat-checkbox-background,.mat-checkbox-frame{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);cursor:pointer;-webkit-tap-highlight-color:transparent}._mat-animation-noopable.mat-checkbox{transition:none;animation:none}.mat-checkbox .mat-ripple-element:not(.mat-checkbox-persistent-ripple){opacity:.16}.mat-checkbox-layout{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex;white-space:nowrap}.mat-checkbox-label{-webkit-user-select:auto;-moz-user-select:auto;-ms-user-select:auto;user-select:auto}.mat-checkbox-inner-container{display:inline-block;height:16px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:16px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1);border-width:2px;border-style:solid}._mat-animation-noopable .mat-checkbox-frame{transition:none}.cdk-high-contrast-active .mat-checkbox.cdk-keyboard-focused .mat-checkbox-frame{border-style:dotted}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0, 0, 0.2, 0.1),opacity 90ms cubic-bezier(0, 0, 0.2, 0.1)}._mat-animation-noopable .mat-checkbox-background{transition:none}.cdk-high-contrast-active .mat-checkbox .mat-checkbox-background{background:none}.mat-checkbox-persistent-ripple{width:100%;height:100%;transform:none}.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:.04}.mat-checkbox.cdk-keyboard-focused .mat-checkbox-persistent-ripple{opacity:.12}.mat-checkbox-persistent-ripple,.mat-checkbox.mat-checkbox-disabled .mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:0}@media(hover: none){.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{display:none}}.mat-checkbox-checkmark{top:0;left:0;right:0;bottom:0;position:absolute;width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.910259;stroke-dasharray:22.910259;stroke-width:2.1333333333px}.cdk-high-contrast-black-on-white .mat-checkbox-checkmark-path{stroke:#000 !important}.mat-checkbox-mixedmark{width:calc(100% - 6px);height:2px;opacity:0;transform:scaleX(0) rotate(0deg);border-radius:2px}.cdk-high-contrast-active .mat-checkbox-mixedmark{height:0;border-top:solid 2px;margin-top:2px}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0deg)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.cdk-high-contrast-active .mat-checkbox-disabled{opacity:.5}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0ms mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0ms mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:300ms linear 0ms mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}.mat-checkbox .mat-checkbox-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}\n"]
            },] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFrQixZQUFZLEVBQWMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQWUscUJBQXFCLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RixPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQVNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQ0wseUJBQXlCLEVBQ3pCLDRCQUE0QixFQUc3QixNQUFNLG1CQUFtQixDQUFDO0FBRzNCLHdFQUF3RTtBQUN4RSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFRO0lBQ3RELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7SUFDMUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBaUJGLGtEQUFrRDtBQUNsRCxNQUFNLE9BQU8saUJBQWlCO0NBSzdCO0FBRUQsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLGVBQWU7SUFDbkIsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0NBQy9DO0FBQ0QsTUFBTSxxQkFBcUIsR0FNbkIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFHdEY7Ozs7Ozs7R0FPRztBQXFCSCxNQUFNLE9BQU8sV0FBWSxTQUFRLHFCQUFxQjtJQWtFcEQsWUFBWSxVQUFtQyxFQUMzQixrQkFBcUMsRUFDckMsYUFBMkIsRUFDM0IsT0FBZSxFQUNBLFFBQWdCO0lBQ3ZDOzs7O09BSUc7SUFFUyxZQUFvQyxFQUNFLGNBQXVCLEVBRTdELFFBQW9DO1FBQzFELEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQWRBLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsa0JBQWEsR0FBYixhQUFhLENBQWM7UUFDM0IsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQVFYLGlCQUFZLEdBQVosWUFBWSxDQUF3QjtRQUNFLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBRTdELGFBQVEsR0FBUixRQUFRLENBQTRCO1FBNUU1RDs7O1dBR0c7UUFDa0IsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUU1Qzs7V0FFRztRQUN1QixtQkFBYyxHQUFrQixJQUFJLENBQUM7UUFLdkQsY0FBUyxHQUFXLGdCQUFnQixFQUFFLFlBQVksRUFBRSxDQUFDO1FBRTdELDBGQUEwRjtRQUNqRixPQUFFLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQVdyQyx3RkFBd0Y7UUFDL0Usa0JBQWEsR0FBdUIsT0FBTyxDQUFDO1FBRXJELGlFQUFpRTtRQUN4RCxTQUFJLEdBQWtCLElBQUksQ0FBQztRQUVwQyxpRUFBaUU7UUFDOUMsV0FBTSxHQUNyQixJQUFJLFlBQVksRUFBcUIsQ0FBQztRQUUxQyx1RUFBdUU7UUFDcEQsd0JBQW1CLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFXNUY7OztXQUdHO1FBQ0gsZUFBVSxHQUFjLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUV6QiwyQkFBc0IsR0FBVyxFQUFFLENBQUM7UUFFcEMsdUJBQWtCLGdCQUFtRDtRQUVyRSxrQ0FBNkIsR0FBeUIsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBa0UvRCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBZ0IxQixjQUFTLEdBQVksS0FBSyxDQUFDO1FBMEIzQixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQTFGdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUVwQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDbEM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsNkZBQTZGO1FBQzdGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztJQUNyRSxDQUFDO0lBckVELHlEQUF5RDtJQUN6RCxJQUFJLE9BQU8sS0FBYSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRXRFLHdDQUF3QztJQUN4QyxJQUNJLFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2xELElBQUksUUFBUSxDQUFDLEtBQWMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQWlFL0UsZUFBZTtRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hCLHlGQUF5RjtnQkFDekYsMkZBQTJGO2dCQUMzRixvRkFBb0Y7Z0JBQ3BGLHFGQUFxRjtnQkFDckYsb0VBQW9FO2dCQUNwRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3pDLENBQUMsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELG9DQUFvQztJQUNwQyxrQkFBa0IsS0FBSSxDQUFDO0lBRXZCLFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFDSSxPQUFPLEtBQWMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUdEOzs7T0FHRztJQUNILElBQ0ksUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBSSxRQUFRLENBQUMsS0FBVTtRQUNyQixNQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QyxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILElBQ0ksYUFBYSxLQUFjLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsSUFBSSxhQUFhLENBQUMsS0FBYztRQUM5QixNQUFNLE9BQU8sR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRW5ELElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN2QixJQUFJLENBQUMscUJBQXFCLHVCQUFvQyxDQUFDO2FBQ2hFO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxxQkFBcUIsQ0FDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlCQUE4QixDQUFDLGtCQUErQixDQUFDLENBQUM7YUFDakY7WUFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNwRDtRQUVELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUdELGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdDLENBQUM7SUFFRCwyREFBMkQ7SUFDM0Qsa0JBQWtCO1FBQ2hCLDhGQUE4RjtRQUM5Riw4RkFBOEY7UUFDOUYsMEZBQTBGO1FBQzFGLDZGQUE2RjtRQUM3Rix1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsVUFBVSxDQUFDLEtBQVU7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsZ0JBQWdCLENBQUMsRUFBd0I7UUFDdkMsSUFBSSxDQUFDLDZCQUE2QixHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsK0NBQStDO0lBQy9DLGlCQUFpQixDQUFDLEVBQU87UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELCtDQUErQztJQUMvQyxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUM3QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNoRCxDQUFDO0lBRU8scUJBQXFCLENBQUMsUUFBOEI7UUFDMUQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3ZDLElBQUksT0FBTyxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUUxRCxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDekIsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMxQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUN2RDtRQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMseUNBQXlDLENBQ3hFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxDQUFDO1FBRW5DLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFbkQsOEZBQThGO1lBQzlGLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztZQUVuRCxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDbEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQ3RDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU3QixJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxhQUFhLENBQUMsS0FBWTtRQUN4QixtRkFBbUY7UUFDbkYscUZBQXFGO1FBQ3JGLHdGQUF3RjtRQUN4Riw0RUFBNEU7UUFDNUUsOEZBQThGO1FBQzlGLDJDQUEyQztRQUMzQyxrRUFBa0U7UUFDbEUsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXhCLDhGQUE4RjtRQUM5RixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLE1BQU0sRUFBRTtZQUNsRCw2RUFBNkU7WUFDN0UsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssT0FBTyxFQUFFO2dCQUV2RCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7b0JBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLHFCQUFxQixDQUN0QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsaUJBQThCLENBQUMsa0JBQStCLENBQUMsQ0FBQztZQUVuRixnRUFBZ0U7WUFDaEUsOEVBQThFO1lBQzlFLDRGQUE0RjtZQUM1RixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjthQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssTUFBTSxFQUFFO1lBQ3pELHVGQUF1RjtZQUN2RixzRUFBc0U7WUFDdEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRUQsNEJBQTRCO0lBQzVCLEtBQUssQ0FBQyxTQUFzQixVQUFVLEVBQUUsT0FBc0I7UUFDNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQVk7UUFDOUIsMERBQTBEO1FBQzFELHlFQUF5RTtRQUN6RSxnREFBZ0Q7UUFDaEQsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTyx5Q0FBeUMsQ0FDN0MsUUFBOEIsRUFBRSxRQUE4QjtRQUNoRSwrQ0FBK0M7UUFDL0MsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGdCQUFnQixFQUFFO1lBQzVDLE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFFRCxJQUFJLFVBQVUsR0FBVyxFQUFFLENBQUM7UUFFNUIsUUFBUSxRQUFRLEVBQUU7WUFDaEI7Z0JBQ0Usd0ZBQXdGO2dCQUN4Rix5QkFBeUI7Z0JBQ3pCLElBQUksUUFBUSxvQkFBaUMsRUFBRTtvQkFDN0MsVUFBVSxHQUFHLG1CQUFtQixDQUFDO2lCQUNsQztxQkFBTSxJQUFJLFFBQVEseUJBQXNDLEVBQUU7b0JBQ3pELFVBQVUsR0FBRyx5QkFBeUIsQ0FBQztpQkFDeEM7cUJBQU07b0JBQ0wsT0FBTyxFQUFFLENBQUM7aUJBQ1g7Z0JBQ0QsTUFBTTtZQUNSO2dCQUNFLFVBQVUsR0FBRyxRQUFRLG9CQUFpQyxDQUFDLENBQUM7b0JBQ3BELG1CQUFtQixDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDcEQsTUFBTTtZQUNSO2dCQUNFLFVBQVUsR0FBRyxRQUFRLHNCQUFtQyxDQUFDLENBQUM7b0JBQ3RELG1CQUFtQixDQUFDLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQztnQkFDbEQsTUFBTTtZQUNSO2dCQUNFLFVBQVUsR0FBRyxRQUFRLG9CQUFpQyxDQUFDLENBQUM7b0JBQ3BELHVCQUF1QixDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDeEQsTUFBTTtTQUNUO1FBRUQsT0FBTyxxQkFBcUIsVUFBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSyxrQkFBa0IsQ0FBQyxLQUFjO1FBQ3ZDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFMUMsSUFBSSxjQUFjLEVBQUU7WUFDbEIsY0FBYyxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQzs7O1lBbllGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsa21FQUE0QjtnQkFFNUIsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLElBQUk7b0JBQ1osaUJBQWlCLEVBQUUsTUFBTTtvQkFDekIsb0NBQW9DLEVBQUUsZUFBZTtvQkFDckQsOEJBQThCLEVBQUUsU0FBUztvQkFDekMsK0JBQStCLEVBQUUsVUFBVTtvQkFDM0MsbUNBQW1DLEVBQUUsMkJBQTJCO29CQUNoRSxpQ0FBaUMsRUFBRSxxQ0FBcUM7aUJBQ3pFO2dCQUNELFNBQVMsRUFBRSxDQUFDLG1DQUFtQyxDQUFDO2dCQUNoRCxNQUFNLEVBQUUsQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQztnQkFDOUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7O1lBcEhDLFVBQVU7WUFGVixpQkFBaUI7WUFOTSxZQUFZO1lBYW5DLE1BQU07eUNBc0xPLFNBQVMsU0FBQyxVQUFVOzRDQU1wQixRQUFRLFlBQUksTUFBTSxTQUFDLHlCQUF5Qjt5Q0FFNUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7NENBQ3hDLFFBQVEsWUFBSSxNQUFNLFNBQUMsNEJBQTRCOzs7d0JBdkUzRCxLQUFLLFNBQUMsWUFBWTs2QkFLbEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGtCQUFrQjtpQkFLeEIsS0FBSzt1QkFNTCxLQUFLOzRCQU1MLEtBQUs7bUJBR0wsS0FBSztxQkFHTCxNQUFNO2tDQUlOLE1BQU07b0JBR04sS0FBSzs0QkFHTCxTQUFTLFNBQUMsT0FBTztxQkFHakIsU0FBUyxTQUFDLFNBQVM7c0JBc0VuQixLQUFLO3VCQWNMLEtBQUs7NEJBa0JMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCxcbiAgSGFzVGFiSW5kZXhDdG9yLFxuICBNYXRSaXBwbGUsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9DSEVDS0JPWF9DTElDS19BQ1RJT04sXG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlMsXG4gIE1hdENoZWNrYm94Q2xpY2tBY3Rpb24sXG4gIE1hdENoZWNrYm94RGVmYXVsdE9wdGlvbnNcbn0gZnJvbSAnLi9jaGVja2JveC1jb25maWcnO1xuXG5cbi8vIEluY3JlYXNpbmcgaW50ZWdlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgaWRzIGZvciBjaGVja2JveCBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtY2hlY2tib3ggdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIFRoaXMgYWxsb3dzIGl0IHRvIHN1cHBvcnQgWyhuZ01vZGVsKV0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQ0hFQ0tCT1hfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0Q2hlY2tib3gpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkaWZmZXJlbnQgc3RhdGVzIHRoYXQgcmVxdWlyZSBjdXN0b20gdHJhbnNpdGlvbnMgYmV0d2VlbiB0aGVtLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZW51bSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZSB7XG4gIC8qKiBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IGJlZm9yZSBhbnkgdXNlciBpbnRlcmFjdGlvbi4gKi9cbiAgSW5pdCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgY2hlY2tlZC4gKi9cbiAgQ2hlY2tlZCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgdW5jaGVja2VkLiAqL1xuICBVbmNoZWNrZWQsXG4gIC8qKiBUaGUgc3RhdGUgcmVwcmVzZW50aW5nIHRoZSBjb21wb25lbnQgd2hlbiBpdCdzIGJlY29taW5nIGluZGV0ZXJtaW5hdGUuICovXG4gIEluZGV0ZXJtaW5hdGVcbn1cblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRDaGVja2JveC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveENoYW5nZSB7XG4gIC8qKiBUaGUgc291cmNlIE1hdENoZWNrYm94IG9mIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBNYXRDaGVja2JveDtcbiAgLyoqIFRoZSBuZXcgYGNoZWNrZWRgIHZhbHVlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgY2hlY2tlZDogYm9vbGVhbjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGVja2JveC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRDaGVja2JveEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0Q2hlY2tib3hNaXhpbkJhc2U6XG4gICAgSGFzVGFiSW5kZXhDdG9yICZcbiAgICBDYW5Db2xvckN0b3IgJlxuICAgIENhbkRpc2FibGVSaXBwbGVDdG9yICZcbiAgICBDYW5EaXNhYmxlQ3RvciAmXG4gICAgdHlwZW9mIE1hdENoZWNrYm94QmFzZSA9XG4gICAgICAgIG1peGluVGFiSW5kZXgobWl4aW5Db2xvcihtaXhpbkRpc2FibGVSaXBwbGUobWl4aW5EaXNhYmxlZChNYXRDaGVja2JveEJhc2UpKSkpO1xuXG5cbi8qKlxuICogQSBtYXRlcmlhbCBkZXNpZ24gY2hlY2tib3ggY29tcG9uZW50LiBTdXBwb3J0cyBhbGwgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgYW4gSFRNTDUgY2hlY2tib3gsXG4gKiBhbmQgZXhwb3NlcyBhIHNpbWlsYXIgQVBJLiBBIE1hdENoZWNrYm94IGNhbiBiZSBlaXRoZXIgY2hlY2tlZCwgdW5jaGVja2VkLCBpbmRldGVybWluYXRlLCBvclxuICogZGlzYWJsZWQuIE5vdGUgdGhhdCBhbGwgYWRkaXRpb25hbCBhY2Nlc3NpYmlsaXR5IGF0dHJpYnV0ZXMgYXJlIHRha2VuIGNhcmUgb2YgYnkgdGhlIGNvbXBvbmVudCxcbiAqIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gcHJvdmlkZSB0aGVtIHlvdXJzZWxmLiBIb3dldmVyLCBpZiB5b3Ugd2FudCB0byBvbWl0IGEgbGFiZWwgYW5kIHN0aWxsXG4gKiBoYXZlIHRoZSBjaGVja2JveCBiZSBhY2Nlc3NpYmxlLCB5b3UgbWF5IHN1cHBseSBhbiBbYXJpYS1sYWJlbF0gaW5wdXQuXG4gKiBTZWU6IGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGVzaWduL2NvbXBvbmVudHMvc2VsZWN0aW9uLWNvbnRyb2xzLmh0bWxcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoZWNrYm94JyxcbiAgdGVtcGxhdGVVcmw6ICdjaGVja2JveC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2NoZWNrYm94LmNzcyddLFxuICBleHBvcnRBczogJ21hdENoZWNrYm94JyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2hlY2tib3gnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ251bGwnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWluZGV0ZXJtaW5hdGVdJzogJ2luZGV0ZXJtaW5hdGUnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWNoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbY2xhc3MubWF0LWNoZWNrYm94LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tib3gtbGFiZWwtYmVmb3JlXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiYmVmb3JlXCInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogYF9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnYCxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbTUFUX0NIRUNLQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1JdLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZScsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveCBleHRlbmRzIF9NYXRDaGVja2JveE1peGluQmFzZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSwgQ2FuQ29sb3IsIENhbkRpc2FibGUsIEhhc1RhYkluZGV4LCBDYW5EaXNhYmxlUmlwcGxlLFxuICAgIEZvY3VzYWJsZU9wdGlvbiB7XG5cbiAgLyoqXG4gICAqIEF0dGFjaGVkIHRvIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZSBvZiB0aGUgaG9zdCBlbGVtZW50LiBJbiBtb3N0IGNhc2VzLCBhcmlhLWxhYmVsbGVkYnkgd2lsbFxuICAgKiB0YWtlIHByZWNlZGVuY2Ugc28gdGhpcyBtYXkgYmUgb21pdHRlZC5cbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUgd2hpY2ggd2lsbCBiZSBmb3J3YXJkZWQgdG8gdGhlIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBUaGUgJ2FyaWEtZGVzY3JpYmVkYnknIGF0dHJpYnV0ZSBpcyByZWFkIGFmdGVyIHRoZSBlbGVtZW50J3MgbGFiZWwgYW5kIGZpZWxkIHR5cGUuICovXG4gIEBJbnB1dCgnYXJpYS1kZXNjcmliZWRieScpIGFyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIHByaXZhdGUgX3VuaXF1ZUlkOiBzdHJpbmcgPSBgbWF0LWNoZWNrYm94LSR7KytuZXh0VW5pcXVlSWR9YDtcblxuICAvKiogQSB1bmlxdWUgaWQgZm9yIHRoZSBjaGVja2JveCBpbnB1dC4gSWYgbm9uZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuXG4gIC8qKiBSZXR1cm5zIHRoZSB1bmlxdWUgaWQgZm9yIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0LiAqL1xuICBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gYCR7dGhpcy5pZCB8fCB0aGlzLl91bmlxdWVJZH0taW5wdXRgOyB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgY2hlY2tib3guIERlZmF1bHRzIHRvICdhZnRlcicgKi9cbiAgQElucHV0KCkgbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICAvKiogTmFtZSB2YWx1ZSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIGlucHV0IGVsZW1lbnQgaWYgcHJlc2VudCAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjaGVja2JveCdzIGBjaGVja2VkYCB2YWx1ZSBjaGFuZ2VzLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tib3gncyBgaW5kZXRlcm1pbmF0ZWAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGluZGV0ZXJtaW5hdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogVGhlIHZhbHVlIGF0dHJpYnV0ZSBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgKi9cbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZztcblxuICAvKiogVGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPmAgZWxlbWVudCAqL1xuICBAVmlld0NoaWxkKCdpbnB1dCcpIF9pbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGluc3RhbmNlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJpcHBsZTogTWF0UmlwcGxlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgYmx1cnJlZC4gTmVlZGVkIHRvIHByb3Blcmx5IGltcGxlbWVudCBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3VycmVudEFuaW1hdGlvbkNsYXNzOiBzdHJpbmcgPSAnJztcblxuICBwcml2YXRlIF9jdXJyZW50Q2hlY2tTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUgPSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5Jbml0O1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBgX2NsaWNrQWN0aW9uYCBwYXJhbWV0ZXIgdG8gYmUgcmVtb3ZlZCwgdXNlXG4gICAgICAgICAgICAgICAqIGBNQVRfQ0hFQ0tCT1hfREVGQVVMVF9PUFRJT05TYFxuICAgICAgICAgICAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQ0hFQ0tCT1hfQ0xJQ0tfQUNUSU9OKVxuICAgICAgICAgICAgICAgICAgcHJpdmF0ZSBfY2xpY2tBY3Rpb246IE1hdENoZWNrYm94Q2xpY2tBY3Rpb24sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0NIRUNLQk9YX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIHByaXZhdGUgX29wdGlvbnM/OiBNYXRDaGVja2JveERlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHRoaXMuX29wdGlvbnMgfHwge307XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5jb2xvcikge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuX29wdGlvbnMuY29sb3I7XG4gICAgfVxuXG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgYWZ0ZXIgdGhlIGBfY2xpY2tBY3Rpb25gIHBhcmFtZXRlciBpcyByZW1vdmVkIGFzIGFuIGluamVjdGlvbiBwYXJhbWV0ZXIuXG4gICAgdGhpcy5fY2xpY2tBY3Rpb24gPSB0aGlzLl9jbGlja0FjdGlvbiB8fCB0aGlzLl9vcHRpb25zLmNsaWNrQWN0aW9uO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpLnN1YnNjcmliZShmb2N1c09yaWdpbiA9PiB7XG4gICAgICBpZiAoIWZvY3VzT3JpZ2luKSB7XG4gICAgICAgIC8vIFdoZW4gYSBmb2N1c2VkIGVsZW1lbnQgYmVjb21lcyBkaXNhYmxlZCwgdGhlIGJyb3dzZXIgKmltbWVkaWF0ZWx5KiBmaXJlcyBhIGJsdXIgZXZlbnQuXG4gICAgICAgIC8vIEFuZ3VsYXIgZG9lcyBub3QgZXhwZWN0IGV2ZW50cyB0byBiZSByYWlzZWQgZHVyaW5nIGNoYW5nZSBkZXRlY3Rpb24sIHNvIGFueSBzdGF0ZSBjaGFuZ2VcbiAgICAgICAgLy8gKHN1Y2ggYXMgYSBmb3JtIGNvbnRyb2wncyAnbmctdG91Y2hlZCcpIHdpbGwgY2F1c2UgYSBjaGFuZ2VkLWFmdGVyLWNoZWNrZWQgZXJyb3IuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNzc5My4gVG8gd29yayBhcm91bmQgdGhpcywgd2UgZGVmZXJcbiAgICAgICAgLy8gdGVsbGluZyB0aGUgZm9ybSBjb250cm9sIGl0IGhhcyBiZWVuIHRvdWNoZWQgdW50aWwgdGhlIG5leHQgdGljay5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fc3luY0luZGV0ZXJtaW5hdGUodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gIH1cblxuICAvLyBUT0RPOiBEZWxldGUgbmV4dCBtYWpvciByZXZpc2lvbi5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge31cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2hlY2tib3ggaXMgY2hlY2tlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjaGVja2VkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2hlY2tlZDsgfVxuICBzZXQgY2hlY2tlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPSB0aGlzLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9jaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGRpc2FibGVkLiBUaGlzIGZ1bGx5IG92ZXJyaWRlcyB0aGUgaW1wbGVtZW50YXRpb24gcHJvdmlkZWQgYnlcbiAgICogbWl4aW5EaXNhYmxlZCwgYnV0IHRoZSBtaXhpbiBpcyBzdGlsbCByZXF1aXJlZCBiZWNhdXNlIG1peGluVGFiSW5kZXggcmVxdWlyZXMgaXQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZGlzYWJsZWQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyBpbmRldGVybWluYXRlLiBUaGlzIGlzIGFsc28ga25vd24gYXMgXCJtaXhlZFwiIG1vZGUgYW5kIGNhbiBiZSB1c2VkIHRvXG4gICAqIHJlcHJlc2VudCBhIGNoZWNrYm94IHdpdGggdGhyZWUgc3RhdGVzLCBlLmcuIGEgY2hlY2tib3ggdGhhdCByZXByZXNlbnRzIGEgbmVzdGVkIGxpc3Qgb2ZcbiAgICogY2hlY2thYmxlIGl0ZW1zLiBOb3RlIHRoYXQgd2hlbmV2ZXIgY2hlY2tib3ggaXMgbWFudWFsbHkgY2xpY2tlZCwgaW5kZXRlcm1pbmF0ZSBpcyBpbW1lZGlhdGVseVxuICAgKiBzZXQgdG8gZmFsc2UuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgaW5kZXRlcm1pbmF0ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2luZGV0ZXJtaW5hdGU7IH1cbiAgc2V0IGluZGV0ZXJtaW5hdGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdmFsdWUgIT0gdGhpcy5faW5kZXRlcm1pbmF0ZTtcbiAgICB0aGlzLl9pbmRldGVybWluYXRlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICBpZiAodGhpcy5faW5kZXRlcm1pbmF0ZSkge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uQ2hlY2tTdGF0ZShUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5JbmRldGVybWluYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25DaGVja1N0YXRlKFxuICAgICAgICAgIHRoaXMuY2hlY2tlZCA/IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWQgOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWQpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRldGVybWluYXRlQ2hhbmdlLmVtaXQodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3luY0luZGV0ZXJtaW5hdGUodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW5kZXRlcm1pbmF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSBsYWJlbCB0ZXh0IGNoYW5nZXMuICovXG4gIF9vbkxhYmVsVGV4dENoYW5nZSgpIHtcbiAgICAvLyBTaW5jZSB0aGUgZXZlbnQgb2YgdGhlIGBjZGtPYnNlcnZlQ29udGVudGAgZGlyZWN0aXZlIHJ1bnMgb3V0c2lkZSBvZiB0aGUgem9uZSwgdGhlIGNoZWNrYm94XG4gICAgLy8gY29tcG9uZW50IHdpbGwgYmUgb25seSBtYXJrZWQgZm9yIGNoZWNrLCBidXQgbm8gYWN0dWFsIGNoYW5nZSBkZXRlY3Rpb24gcnVucyBhdXRvbWF0aWNhbGx5LlxuICAgIC8vIEluc3RlYWQgb2YgZ29pbmcgYmFjayBpbnRvIHRoZSB6b25lIGluIG9yZGVyIHRvIHRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIHdoaWNoIGNhdXNlc1xuICAgIC8vICphbGwqIGNvbXBvbmVudHMgdG8gYmUgY2hlY2tlZCAoaWYgZXhwbGljaXRseSBtYXJrZWQgb3Igbm90IHVzaW5nIE9uUHVzaCksIHdlIG9ubHkgdHJpZ2dlclxuICAgIC8vIGFuIGV4cGxpY2l0IGNoYW5nZSBkZXRlY3Rpb24gZm9yIHRoZSBjaGVja2JveCB2aWV3IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5jaGVja2VkID0gISF2YWx1ZTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfZ2V0QXJpYUNoZWNrZWQoKTogJ3RydWUnIHwgJ2ZhbHNlJyB8ICdtaXhlZCcge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiAndHJ1ZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZSA/ICdtaXhlZCcgOiAnZmFsc2UnO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNoZWNrU3RhdGUobmV3U3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlKSB7XG4gICAgbGV0IG9sZFN0YXRlID0gdGhpcy5fY3VycmVudENoZWNrU3RhdGU7XG4gICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKG9sZFN0YXRlID09PSBuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyA9IHRoaXMuX2dldEFuaW1hdGlvbkNsYXNzRm9yQ2hlY2tTdGF0ZVRyYW5zaXRpb24oXG4gICAgICAgIG9sZFN0YXRlLCBuZXdTdGF0ZSk7XG4gICAgdGhpcy5fY3VycmVudENoZWNrU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgIGlmICh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIGF2b2lkIGFuaW1hdGlvbiB3aGVuIHRoZSBjaGVja2JveCBpcyBtb3ZlZCBiZXR3ZWVuIGNvbnRhaW5lcnNcbiAgICAgIGNvbnN0IGFuaW1hdGlvbkNsYXNzID0gdGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uQ2xhc3MpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRDaGVja2JveENoYW5nZSgpO1xuICAgIGV2ZW50LnNvdXJjZSA9IHRoaXM7XG4gICAgZXZlbnQuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcblxuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy5jaGVja2VkKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBgY2hlY2tlZGAgc3RhdGUgb2YgdGhlIGNoZWNrYm94LiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5jaGVja2VkID0gIXRoaXMuY2hlY2tlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciBjaGVja2JveCBpbnB1dCBlbGVtZW50LlxuICAgKiBUb2dnbGVzIGNoZWNrZWQgc3RhdGUgaWYgZWxlbWVudCBpcyBub3QgZGlzYWJsZWQuXG4gICAqIERvIG5vdCB0b2dnbGUgb24gKGNoYW5nZSkgZXZlbnQgc2luY2UgSUUgZG9lc24ndCBmaXJlIGNoYW5nZSBldmVudCB3aGVuXG4gICAqICAgaW5kZXRlcm1pbmF0ZSBjaGVja2JveCBpcyBjbGlja2VkLlxuICAgKiBAcGFyYW0gZXZlbnRcbiAgICovXG4gIF9vbklucHV0Q2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIGZvciBjbGljayBldmVudHMgb24gdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQgZWxlbWVudC5cbiAgICAvLyBCeSBkZWZhdWx0LCB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBsYWJlbCBlbGVtZW50LCBhIGdlbmVyYXRlZCBjbGljayBldmVudCB3aWxsIGJlXG4gICAgLy8gZGlzcGF0Y2hlZCBvbiB0aGUgYXNzb2NpYXRlZCBpbnB1dCBlbGVtZW50LiBTaW5jZSB3ZSBhcmUgdXNpbmcgYSBsYWJlbCBlbGVtZW50IGFzIG91clxuICAgIC8vIHJvb3QgY29udGFpbmVyLCB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGBjaGVja2JveGAgd2lsbCBiZSBleGVjdXRlZCB0d2ljZS5cbiAgICAvLyBUaGUgcmVhbCBjbGljayBldmVudCB3aWxsIGJ1YmJsZSB1cCwgYW5kIHRoZSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgYWxzbyB0cmllcyB0byBidWJibGUgdXAuXG4gICAgLy8gVGhpcyB3aWxsIGxlYWQgdG8gbXVsdGlwbGUgY2xpY2sgZXZlbnRzLlxuICAgIC8vIFByZXZlbnRpbmcgYnViYmxpbmcgZm9yIHRoZSBzZWNvbmQgZXZlbnQgd2lsbCBzb2x2ZSB0aGF0IGlzc3VlLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgLy8gSWYgcmVzZXRJbmRldGVybWluYXRlIGlzIGZhbHNlLCBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgaXMgaW5kZXRlcm1pbmF0ZSwgZG8gbm90aGluZyBvbiBjbGlja1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiB0aGlzLl9jbGlja0FjdGlvbiAhPT0gJ25vb3AnKSB7XG4gICAgICAvLyBXaGVuIHVzZXIgbWFudWFsbHkgY2xpY2sgb24gdGhlIGNoZWNrYm94LCBgaW5kZXRlcm1pbmF0ZWAgaXMgc2V0IHRvIGZhbHNlLlxuICAgICAgaWYgKHRoaXMuaW5kZXRlcm1pbmF0ZSAmJiB0aGlzLl9jbGlja0FjdGlvbiAhPT0gJ2NoZWNrJykge1xuXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2luZGV0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmluZGV0ZXJtaW5hdGVDaGFuZ2UuZW1pdCh0aGlzLl9pbmRldGVybWluYXRlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uQ2hlY2tTdGF0ZShcbiAgICAgICAgICB0aGlzLl9jaGVja2VkID8gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZCA6IFRyYW5zaXRpb25DaGVja1N0YXRlLlVuY2hlY2tlZCk7XG5cbiAgICAgIC8vIEVtaXQgb3VyIGN1c3RvbSBjaGFuZ2UgZXZlbnQgaWYgdGhlIG5hdGl2ZSBpbnB1dCBlbWl0dGVkIG9uZS5cbiAgICAgIC8vIEl0IGlzIGltcG9ydGFudCB0byBvbmx5IGVtaXQgaXQsIGlmIHRoZSBuYXRpdmUgaW5wdXQgdHJpZ2dlcmVkIG9uZSwgYmVjYXVzZVxuICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0byB0cmlnZ2VyIGEgY2hhbmdlIGV2ZW50LCB3aGVuIHRoZSBgY2hlY2tlZGAgdmFyaWFibGUgY2hhbmdlcyBmb3IgZXhhbXBsZS5cbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5fY2xpY2tBY3Rpb24gPT09ICdub29wJykge1xuICAgICAgLy8gUmVzZXQgbmF0aXZlIGlucHV0IHdoZW4gY2xpY2tlZCB3aXRoIG5vb3AuIFRoZSBuYXRpdmUgY2hlY2tib3ggYmVjb21lcyBjaGVja2VkIGFmdGVyXG4gICAgICAvLyBjbGljaywgcmVzZXQgaXQgdG8gYmUgYWxpZ24gd2l0aCBgY2hlY2tlZGAgdmFsdWUgb2YgYG1hdC1jaGVja2JveGAuXG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGVja2VkID0gdGhpcy5jaGVja2VkO1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuaW5kZXRlcm1pbmF0ZSA9IHRoaXMuaW5kZXRlcm1pbmF0ZTtcbiAgICB9XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgY2hlY2tib3guICovXG4gIGZvY3VzKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAna2V5Ym9hcmQnLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2lucHV0RWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgfVxuXG4gIF9vbkludGVyYWN0aW9uRXZlbnQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gV2UgYWx3YXlzIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBvbiB0aGUgY2hhbmdlIGV2ZW50LlxuICAgIC8vIE90aGVyd2lzZSB0aGUgY2hhbmdlIGV2ZW50LCBmcm9tIHRoZSBpbnB1dCBlbGVtZW50LCB3aWxsIGJ1YmJsZSB1cCBhbmRcbiAgICAvLyBlbWl0IGl0cyBldmVudCBvYmplY3QgdG8gdGhlIGBjaGFuZ2VgIG91dHB1dC5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFuaW1hdGlvbkNsYXNzRm9yQ2hlY2tTdGF0ZVRyYW5zaXRpb24oXG4gICAgICBvbGRTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUsIG5ld1N0YXRlOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZSk6IHN0cmluZyB7XG4gICAgLy8gRG9uJ3QgdHJhbnNpdGlvbiBpZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZC5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGxldCBhbmltU3VmZml4OiBzdHJpbmcgPSAnJztcblxuICAgIHN3aXRjaCAob2xkU3RhdGUpIHtcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5pdDpcbiAgICAgICAgLy8gSGFuZGxlIGVkZ2UgY2FzZSB3aGVyZSB1c2VyIGludGVyYWN0cyB3aXRoIGNoZWNrYm94IHRoYXQgZG9lcyBub3QgaGF2ZSBbKG5nTW9kZWwpXSBvclxuICAgICAgICAvLyBbY2hlY2tlZF0gYm91bmQgdG8gaXQuXG4gICAgICAgIGlmIChuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZCkge1xuICAgICAgICAgIGFuaW1TdWZmaXggPSAndW5jaGVja2VkLWNoZWNrZWQnO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFRyYW5zaXRpb25DaGVja1N0YXRlLkluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgICBhbmltU3VmZml4ID0gJ3VuY2hlY2tlZC1pbmRldGVybWluYXRlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLlVuY2hlY2tlZDpcbiAgICAgICAgYW5pbVN1ZmZpeCA9IG5ld1N0YXRlID09PSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkID9cbiAgICAgICAgICAgICd1bmNoZWNrZWQtY2hlY2tlZCcgOiAndW5jaGVja2VkLWluZGV0ZXJtaW5hdGUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZDpcbiAgICAgICAgYW5pbVN1ZmZpeCA9IG5ld1N0YXRlID09PSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5VbmNoZWNrZWQgP1xuICAgICAgICAgICAgJ2NoZWNrZWQtdW5jaGVja2VkJyA6ICdjaGVja2VkLWluZGV0ZXJtaW5hdGUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5kZXRlcm1pbmF0ZTpcbiAgICAgICAgYW5pbVN1ZmZpeCA9IG5ld1N0YXRlID09PSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkID9cbiAgICAgICAgICAgICdpbmRldGVybWluYXRlLWNoZWNrZWQnIDogJ2luZGV0ZXJtaW5hdGUtdW5jaGVja2VkJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBtYXQtY2hlY2tib3gtYW5pbS0ke2FuaW1TdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyB0aGUgaW5kZXRlcm1pbmF0ZSB2YWx1ZSB3aXRoIHRoZSBjaGVja2JveCBET00gbm9kZS5cbiAgICpcbiAgICogV2Ugc3luYyBgaW5kZXRlcm1pbmF0ZWAgZGlyZWN0bHkgb24gdGhlIERPTSBub2RlLCBiZWNhdXNlIGluIEl2eSB0aGUgY2hlY2sgZm9yIHdoZXRoZXIgYVxuICAgKiBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgb24gYW4gZWxlbWVudCBib2lscyBkb3duIHRvIGBpZiAocHJvcE5hbWUgaW4gZWxlbWVudClgLiBEb21pbm8nc1xuICAgKiBIVE1MSW5wdXRFbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBgaW5kZXRlcm1pbmF0ZWAgcHJvcGVydHkgc28gSXZ5IHdpbGwgd2FybiBkdXJpbmdcbiAgICogc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0luZGV0ZXJtaW5hdGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuYXRpdmVDaGVja2JveCA9IHRoaXMuX2lucHV0RWxlbWVudDtcblxuICAgIGlmIChuYXRpdmVDaGVja2JveCkge1xuICAgICAgbmF0aXZlQ2hlY2tib3gubmF0aXZlRWxlbWVudC5pbmRldGVybWluYXRlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5kZXRlcm1pbmF0ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuIl19