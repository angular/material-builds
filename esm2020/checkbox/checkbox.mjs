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
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY, } from './checkbox-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/observers";
// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;
// Default checkbox configuration.
const defaults = MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY();
/**
 * Provider Expression that allows mat-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatCheckbox),
    multi: true,
};
/** Change event object emitted by MatCheckbox. */
export class MatCheckboxChange {
}
// Boilerplate for applying mixins to MatCheckbox.
/** @docs-private */
const _MatCheckboxBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}))));
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A MatCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://material.io/design/components/selection-controls.html
 */
export class MatCheckbox extends _MatCheckboxBase {
    constructor(elementRef, _changeDetectorRef, _focusMonitor, _ngZone, tabIndex, _animationMode, _options) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._focusMonitor = _focusMonitor;
        this._ngZone = _ngZone;
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
        this._options = this._options || defaults;
        this.color = this.defaultColor = this._options.color || defaults.color;
        this.tabIndex = parseInt(tabIndex) || 0;
    }
    /** Returns the unique id for the visual hidden input. */
    get inputId() {
        return `${this.id || this._uniqueId}-input`;
    }
    /** Whether the checkbox is required. */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
    }
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
    get checked() {
        return this._checked;
    }
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
    get disabled() {
        return this._disabled;
    }
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
    get indeterminate() {
        return this._indeterminate;
    }
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
        // Assigning the value again here is redundant, but we have to do it in case it was
        // changed inside the `change` listener which will cause the input to be out of sync.
        if (this._inputElement) {
            this._inputElement.nativeElement.checked = this.checked;
        }
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
        const clickAction = this._options?.clickAction;
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
        // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
        if (!this.disabled && clickAction !== 'noop') {
            // When user manually click on the checkbox, `indeterminate` is set to false.
            if (this.indeterminate && clickAction !== 'check') {
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
        else if (!this.disabled && clickAction === 'noop') {
            // Reset native input when clicked with noop. The native checkbox becomes checked after
            // click, reset it to be align with `checked` value of `mat-checkbox`.
            this._inputElement.nativeElement.checked = this.checked;
            this._inputElement.nativeElement.indeterminate = this.indeterminate;
        }
    }
    /** Focuses the checkbox. */
    focus(origin, options) {
        if (origin) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        }
        else {
            this._inputElement.nativeElement.focus(options);
        }
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
                animSuffix =
                    newState === 1 /* Checked */
                        ? 'unchecked-checked'
                        : 'unchecked-indeterminate';
                break;
            case 1 /* Checked */:
                animSuffix =
                    newState === 2 /* Unchecked */
                        ? 'checked-unchecked'
                        : 'checked-indeterminate';
                break;
            case 3 /* Indeterminate */:
                animSuffix =
                    newState === 1 /* Checked */
                        ? 'indeterminate-checked'
                        : 'indeterminate-unchecked';
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
MatCheckbox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCheckbox, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.FocusMonitor }, { token: i0.NgZone }, { token: 'tabindex', attribute: true }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_CHECKBOX_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatCheckbox.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatCheckbox, selector: "mat-checkbox", inputs: { disableRipple: "disableRipple", color: "color", tabIndex: "tabIndex", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], ariaDescribedby: ["aria-describedby", "ariaDescribedby"], id: "id", required: "required", labelPosition: "labelPosition", name: "name", value: "value", checked: "checked", disabled: "disabled", indeterminate: "indeterminate" }, outputs: { change: "change", indeterminateChange: "indeterminateChange" }, host: { properties: { "id": "id", "attr.tabindex": "null", "class.mat-checkbox-indeterminate": "indeterminate", "class.mat-checkbox-checked": "checked", "class.mat-checkbox-disabled": "disabled", "class.mat-checkbox-label-before": "labelPosition == \"before\"", "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-checkbox" }, providers: [MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR], viewQueries: [{ propertyName: "_inputElement", first: true, predicate: ["input"], descendants: true }, { propertyName: "ripple", first: true, predicate: MatRipple, descendants: true }], exportAs: ["matCheckbox"], usesInheritance: true, ngImport: i0, template: "<label [attr.for]=\"inputId\" class=\"mat-checkbox-layout\" #label>\n  <span class=\"mat-checkbox-inner-container\"\n       [class.mat-checkbox-inner-container-no-side-margin]=\"!checkboxLabel.textContent || !checkboxLabel.textContent.trim()\">\n    <input #input\n           class=\"mat-checkbox-input cdk-visually-hidden\" type=\"checkbox\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [checked]=\"checked\"\n           [attr.value]=\"value\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [tabIndex]=\"tabIndex\"\n           [attr.aria-label]=\"ariaLabel || null\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-checked]=\"_getAriaChecked()\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onInteractionEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n    <span matRipple class=\"mat-checkbox-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleRadius]=\"20\"\n         [matRippleCentered]=\"true\"\n         [matRippleAnimation]=\"{enterDuration: _animationMode === 'NoopAnimations' ? 0 : 150}\">\n      <span class=\"mat-ripple-element mat-checkbox-persistent-ripple\"></span>\n    </span>\n    <span class=\"mat-checkbox-frame\"></span>\n    <span class=\"mat-checkbox-background\">\n      <svg version=\"1.1\"\n           focusable=\"false\"\n           class=\"mat-checkbox-checkmark\"\n           viewBox=\"0 0 24 24\"\n           xml:space=\"preserve\"\n           aria-hidden=\"true\">\n        <path class=\"mat-checkbox-checkmark-path\"\n              fill=\"none\"\n              stroke=\"white\"\n              d=\"M4.1,12.7 9,17.6 20.3,6.3\"/>\n      </svg>\n      <!-- Element for rendering the indeterminate state checkbox. -->\n      <span class=\"mat-checkbox-mixedmark\"></span>\n    </span>\n  </span>\n  <span class=\"mat-checkbox-label\" #checkboxLabel (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.910259}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);stroke-dashoffset:0}to{stroke-dashoffset:-22.910259}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0deg)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}32.8%,100%{opacity:0;transform:scaleX(0)}}.mat-checkbox-background,.mat-checkbox-frame{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{display:inline-block;transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);cursor:pointer;-webkit-tap-highlight-color:transparent}._mat-animation-noopable.mat-checkbox{transition:none;animation:none}.mat-checkbox .mat-ripple-element:not(.mat-checkbox-persistent-ripple){opacity:.16}.mat-checkbox .mat-checkbox-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.cdk-high-contrast-active .mat-checkbox.cdk-keyboard-focused .mat-checkbox-ripple{outline:solid 3px}.mat-checkbox-layout{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex;white-space:nowrap}.mat-checkbox-label{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto}.mat-checkbox-inner-container{display:inline-block;height:16px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:16px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1);border-width:2px;border-style:solid}._mat-animation-noopable .mat-checkbox-frame{transition:none}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0, 0, 0.2, 0.1),opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);-webkit-print-color-adjust:exact;color-adjust:exact}._mat-animation-noopable .mat-checkbox-background{transition:none}.cdk-high-contrast-active .mat-checkbox .mat-checkbox-background{background:none}.mat-checkbox-persistent-ripple{display:block;width:100%;height:100%;transform:none}.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:.04}.mat-checkbox.cdk-keyboard-focused .mat-checkbox-persistent-ripple{opacity:.12}.mat-checkbox-persistent-ripple,.mat-checkbox.mat-checkbox-disabled .mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:0}@media(hover: none){.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{display:none}}.mat-checkbox-checkmark{top:0;left:0;right:0;bottom:0;position:absolute;width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.910259;stroke-dasharray:22.910259;stroke-width:2.1333333333px}.cdk-high-contrast-black-on-white .mat-checkbox-checkmark-path{stroke:#000 !important}.mat-checkbox-mixedmark{width:calc(100% - 6px);height:2px;opacity:0;transform:scaleX(0) rotate(0deg);border-radius:2px}.cdk-high-contrast-active .mat-checkbox-mixedmark{height:0;border-top:solid 2px;margin-top:2px}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0deg)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.cdk-high-contrast-active .mat-checkbox-disabled{opacity:.5}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0ms mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0ms mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:300ms linear 0ms mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}\n"], directives: [{ type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i3.CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatCheckbox, decorators: [{
            type: Component,
            args: [{ selector: 'mat-checkbox', exportAs: 'matCheckbox', host: {
                        'class': 'mat-checkbox',
                        '[id]': 'id',
                        '[attr.tabindex]': 'null',
                        '[class.mat-checkbox-indeterminate]': 'indeterminate',
                        '[class.mat-checkbox-checked]': 'checked',
                        '[class.mat-checkbox-disabled]': 'disabled',
                        '[class.mat-checkbox-label-before]': 'labelPosition == "before"',
                        '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
                    }, providers: [MAT_CHECKBOX_CONTROL_VALUE_ACCESSOR], inputs: ['disableRipple', 'color', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<label [attr.for]=\"inputId\" class=\"mat-checkbox-layout\" #label>\n  <span class=\"mat-checkbox-inner-container\"\n       [class.mat-checkbox-inner-container-no-side-margin]=\"!checkboxLabel.textContent || !checkboxLabel.textContent.trim()\">\n    <input #input\n           class=\"mat-checkbox-input cdk-visually-hidden\" type=\"checkbox\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [checked]=\"checked\"\n           [attr.value]=\"value\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [tabIndex]=\"tabIndex\"\n           [attr.aria-label]=\"ariaLabel || null\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-checked]=\"_getAriaChecked()\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onInteractionEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n    <span matRipple class=\"mat-checkbox-ripple mat-focus-indicator\"\n         [matRippleTrigger]=\"label\"\n         [matRippleDisabled]=\"_isRippleDisabled()\"\n         [matRippleRadius]=\"20\"\n         [matRippleCentered]=\"true\"\n         [matRippleAnimation]=\"{enterDuration: _animationMode === 'NoopAnimations' ? 0 : 150}\">\n      <span class=\"mat-ripple-element mat-checkbox-persistent-ripple\"></span>\n    </span>\n    <span class=\"mat-checkbox-frame\"></span>\n    <span class=\"mat-checkbox-background\">\n      <svg version=\"1.1\"\n           focusable=\"false\"\n           class=\"mat-checkbox-checkmark\"\n           viewBox=\"0 0 24 24\"\n           xml:space=\"preserve\"\n           aria-hidden=\"true\">\n        <path class=\"mat-checkbox-checkmark-path\"\n              fill=\"none\"\n              stroke=\"white\"\n              d=\"M4.1,12.7 9,17.6 20.3,6.3\"/>\n      </svg>\n      <!-- Element for rendering the indeterminate state checkbox. -->\n      <span class=\"mat-checkbox-mixedmark\"></span>\n    </span>\n  </span>\n  <span class=\"mat-checkbox-label\" #checkboxLabel (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: ["@keyframes mat-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes mat-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes mat-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.910259}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1)}100%{stroke-dashoffset:0}}@keyframes mat-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mat-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);stroke-dashoffset:0}to{stroke-dashoffset:-22.910259}}@keyframes mat-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(45deg)}}@keyframes mat-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes mat-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 0.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0deg)}}@keyframes mat-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);opacity:1;transform:rotate(0deg)}to{opacity:0;transform:rotate(315deg)}}@keyframes mat-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}32.8%,100%{opacity:0;transform:scaleX(0)}}.mat-checkbox-background,.mat-checkbox-frame{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:2px;box-sizing:border-box;pointer-events:none}.mat-checkbox{display:inline-block;transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);cursor:pointer;-webkit-tap-highlight-color:transparent}._mat-animation-noopable.mat-checkbox{transition:none;animation:none}.mat-checkbox .mat-ripple-element:not(.mat-checkbox-persistent-ripple){opacity:.16}.mat-checkbox .mat-checkbox-ripple{position:absolute;left:calc(50% - 20px);top:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.cdk-high-contrast-active .mat-checkbox.cdk-keyboard-focused .mat-checkbox-ripple{outline:solid 3px}.mat-checkbox-layout{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex;white-space:nowrap}.mat-checkbox-label{-webkit-user-select:auto;-moz-user-select:auto;user-select:auto}.mat-checkbox-inner-container{display:inline-block;height:16px;line-height:0;margin:auto;margin-right:8px;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:16px;flex-shrink:0}[dir=rtl] .mat-checkbox-inner-container{margin-left:8px;margin-right:auto}.mat-checkbox-inner-container-no-side-margin{margin-left:0;margin-right:0}.mat-checkbox-frame{background-color:transparent;transition:border-color 90ms cubic-bezier(0, 0, 0.2, 0.1);border-width:2px;border-style:solid}._mat-animation-noopable .mat-checkbox-frame{transition:none}.mat-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0, 0, 0.2, 0.1),opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);-webkit-print-color-adjust:exact;color-adjust:exact}._mat-animation-noopable .mat-checkbox-background{transition:none}.cdk-high-contrast-active .mat-checkbox .mat-checkbox-background{background:none}.mat-checkbox-persistent-ripple{display:block;width:100%;height:100%;transform:none}.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:.04}.mat-checkbox.cdk-keyboard-focused .mat-checkbox-persistent-ripple{opacity:.12}.mat-checkbox-persistent-ripple,.mat-checkbox.mat-checkbox-disabled .mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{opacity:0}@media(hover: none){.mat-checkbox-inner-container:hover .mat-checkbox-persistent-ripple{display:none}}.mat-checkbox-checkmark{top:0;left:0;right:0;bottom:0;position:absolute;width:100%}.mat-checkbox-checkmark-path{stroke-dashoffset:22.910259;stroke-dasharray:22.910259;stroke-width:2.1333333333px}.cdk-high-contrast-black-on-white .mat-checkbox-checkmark-path{stroke:#000 !important}.mat-checkbox-mixedmark{width:calc(100% - 6px);height:2px;opacity:0;transform:scaleX(0) rotate(0deg);border-radius:2px}.cdk-high-contrast-active .mat-checkbox-mixedmark{height:0;border-top:solid 2px;margin-top:2px}.mat-checkbox-label-before .mat-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .mat-checkbox-label-before .mat-checkbox-inner-container{margin-left:auto;margin-right:8px}.mat-checkbox-checked .mat-checkbox-checkmark{opacity:1}.mat-checkbox-checked .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-checked .mat-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.mat-checkbox-indeterminate .mat-checkbox-checkmark-path{stroke-dashoffset:0}.mat-checkbox-indeterminate .mat-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0deg)}.mat-checkbox-unchecked .mat-checkbox-background{background-color:transparent}.mat-checkbox-disabled{cursor:default}.cdk-high-contrast-active .mat-checkbox-disabled{opacity:.5}.mat-checkbox-anim-unchecked-checked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-checked .mat-checkbox-checkmark-path{animation:180ms linear 0ms mat-checkbox-unchecked-checked-checkmark-path}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-in-background}.mat-checkbox-anim-unchecked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-unchecked-indeterminate-mixedmark}.mat-checkbox-anim-checked-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-checked-unchecked .mat-checkbox-checkmark-path{animation:90ms linear 0ms mat-checkbox-checked-unchecked-checkmark-path}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-checkmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-checkmark}.mat-checkbox-anim-checked-indeterminate .mat-checkbox-mixedmark{animation:90ms linear 0ms mat-checkbox-checked-indeterminate-mixedmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-checkmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-checkmark}.mat-checkbox-anim-indeterminate-checked .mat-checkbox-mixedmark{animation:500ms linear 0ms mat-checkbox-indeterminate-checked-mixedmark}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-background{animation:180ms linear 0ms mat-checkbox-fade-out-background}.mat-checkbox-anim-indeterminate-unchecked .mat-checkbox-mixedmark{animation:300ms linear 0ms mat-checkbox-indeterminate-unchecked-mixedmark}.mat-checkbox-input{bottom:0;left:50%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.FocusMonitor }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_CHECKBOX_DEFAULT_OPTIONS]
                }] }]; }, propDecorators: { ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], ariaDescribedby: [{
                type: Input,
                args: ['aria-describedby']
            }], id: [{
                type: Input
            }], required: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], name: [{
                type: Input
            }], change: [{
                type: Output
            }], indeterminateChange: [{
                type: Output
            }], value: [{
                type: Input
            }], _inputElement: [{
                type: ViewChild,
                args: ['input']
            }], ripple: [{
                type: ViewChild,
                args: [MatRipple]
            }], checked: [{
                type: Input
            }], disabled: [{
                type: Input
            }], indeterminate: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3gudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hlY2tib3gvY2hlY2tib3guaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWtCLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzdFLE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBRWxCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBS0wsU0FBUyxFQUNULFVBQVUsRUFDVixhQUFhLEVBQ2Isa0JBQWtCLEVBQ2xCLGFBQWEsR0FDZCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFDTCw0QkFBNEIsRUFFNUIsb0NBQW9DLEdBQ3JDLE1BQU0sbUJBQW1CLENBQUM7Ozs7O0FBRTNCLHdFQUF3RTtBQUN4RSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsa0NBQWtDO0FBQ2xDLE1BQU0sUUFBUSxHQUFHLG9DQUFvQyxFQUFFLENBQUM7QUFFeEQ7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFRO0lBQ3RELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVB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QUs7Z0JBR2EsTUFBTTtzQkFBeEIsTUFBTTtnQkFJWSxtQkFBbUI7c0JBQXJDLE1BQU07Z0JBR0UsS0FBSztzQkFBYixLQUFLO2dCQUdjLGFBQWE7c0JBQWhDLFNBQVM7dUJBQUMsT0FBTztnQkFHSSxNQUFNO3NCQUEzQixTQUFTO3VCQUFDLFNBQVM7Z0JBNERoQixPQUFPO3NCQURWLEtBQUs7Z0JBaUJPLFFBQVE7c0JBRHBCLEtBQUs7Z0JBcUJGLGFBQWE7c0JBRGhCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIEhhc1RhYkluZGV4LFxuICBNYXRSaXBwbGUsXG4gIG1peGluQ29sb3IsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5UYWJJbmRleCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlMsXG4gIE1hdENoZWNrYm94RGVmYXVsdE9wdGlvbnMsXG4gIE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbn0gZnJvbSAnLi9jaGVja2JveC1jb25maWcnO1xuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3IgY2hlY2tib3ggY29tcG9uZW50cy5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vLyBEZWZhdWx0IGNoZWNrYm94IGNvbmZpZ3VyYXRpb24uXG5jb25zdCBkZWZhdWx0cyA9IE1BVF9DSEVDS0JPWF9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpO1xuXG4vKipcbiAqIFByb3ZpZGVyIEV4cHJlc3Npb24gdGhhdCBhbGxvd3MgbWF0LWNoZWNrYm94IHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBUaGlzIGFsbG93cyBpdCB0byBzdXBwb3J0IFsobmdNb2RlbCldLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0NIRUNLQk9YX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdENoZWNrYm94KSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGRpZmZlcmVudCBzdGF0ZXMgdGhhdCByZXF1aXJlIGN1c3RvbSB0cmFuc2l0aW9ucyBiZXR3ZWVuIHRoZW0uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFRyYW5zaXRpb25DaGVja1N0YXRlIHtcbiAgLyoqIFRoZSBpbml0aWFsIHN0YXRlIG9mIHRoZSBjb21wb25lbnQgYmVmb3JlIGFueSB1c2VyIGludGVyYWN0aW9uLiAqL1xuICBJbml0LFxuICAvKiogVGhlIHN0YXRlIHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50IHdoZW4gaXQncyBiZWNvbWluZyBjaGVja2VkLiAqL1xuICBDaGVja2VkLFxuICAvKiogVGhlIHN0YXRlIHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50IHdoZW4gaXQncyBiZWNvbWluZyB1bmNoZWNrZWQuICovXG4gIFVuY2hlY2tlZCxcbiAgLyoqIFRoZSBzdGF0ZSByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudCB3aGVuIGl0J3MgYmVjb21pbmcgaW5kZXRlcm1pbmF0ZS4gKi9cbiAgSW5kZXRlcm1pbmF0ZSxcbn1cblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRDaGVja2JveC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveENoYW5nZSB7XG4gIC8qKiBUaGUgc291cmNlIE1hdENoZWNrYm94IG9mIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBNYXRDaGVja2JveDtcbiAgLyoqIFRoZSBuZXcgYGNoZWNrZWRgIHZhbHVlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgY2hlY2tlZDogYm9vbGVhbjtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGVja2JveC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0Q2hlY2tib3hCYXNlID0gbWl4aW5UYWJJbmRleChcbiAgbWl4aW5Db2xvcihcbiAgICBtaXhpbkRpc2FibGVSaXBwbGUoXG4gICAgICBtaXhpbkRpc2FibGVkKFxuICAgICAgICBjbGFzcyB7XG4gICAgICAgICAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuICAgICAgICB9LFxuICAgICAgKSxcbiAgICApLFxuICApLFxuKTtcblxuLyoqXG4gKiBBIG1hdGVyaWFsIGRlc2lnbiBjaGVja2JveCBjb21wb25lbnQuIFN1cHBvcnRzIGFsbCBvZiB0aGUgZnVuY3Rpb25hbGl0eSBvZiBhbiBIVE1MNSBjaGVja2JveCxcbiAqIGFuZCBleHBvc2VzIGEgc2ltaWxhciBBUEkuIEEgTWF0Q2hlY2tib3ggY2FuIGJlIGVpdGhlciBjaGVja2VkLCB1bmNoZWNrZWQsIGluZGV0ZXJtaW5hdGUsIG9yXG4gKiBkaXNhYmxlZC4gTm90ZSB0aGF0IGFsbCBhZGRpdGlvbmFsIGFjY2Vzc2liaWxpdHkgYXR0cmlidXRlcyBhcmUgdGFrZW4gY2FyZSBvZiBieSB0aGUgY29tcG9uZW50LFxuICogc28gdGhlcmUgaXMgbm8gbmVlZCB0byBwcm92aWRlIHRoZW0geW91cnNlbGYuIEhvd2V2ZXIsIGlmIHlvdSB3YW50IHRvIG9taXQgYSBsYWJlbCBhbmQgc3RpbGxcbiAqIGhhdmUgdGhlIGNoZWNrYm94IGJlIGFjY2Vzc2libGUsIHlvdSBtYXkgc3VwcGx5IGFuIFthcmlhLWxhYmVsXSBpbnB1dC5cbiAqIFNlZTogaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXNpZ24vY29tcG9uZW50cy9zZWxlY3Rpb24tY29udHJvbHMuaHRtbFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hlY2tib3gnLFxuICB0ZW1wbGF0ZVVybDogJ2NoZWNrYm94Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2hlY2tib3guY3NzJ10sXG4gIGV4cG9ydEFzOiAnbWF0Q2hlY2tib3gnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jaGVja2JveCcsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tib3gtaW5kZXRlcm1pbmF0ZV0nOiAnaW5kZXRlcm1pbmF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tib3gtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tib3gtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1jaGVja2JveC1sYWJlbC1iZWZvcmVdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJiZWZvcmVcIicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydgLFxuICB9LFxuICBwcm92aWRlcnM6IFtNQVRfQ0hFQ0tCT1hfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUl0sXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJywgJ2NvbG9yJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGVja2JveFxuICBleHRlbmRzIF9NYXRDaGVja2JveEJhc2VcbiAgaW1wbGVtZW50c1xuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIEFmdGVyVmlld0luaXQsXG4gICAgQWZ0ZXJWaWV3Q2hlY2tlZCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgQ2FuQ29sb3IsXG4gICAgQ2FuRGlzYWJsZSxcbiAgICBIYXNUYWJJbmRleCxcbiAgICBDYW5EaXNhYmxlUmlwcGxlLFxuICAgIEZvY3VzYWJsZU9wdGlvblxue1xuICAvKipcbiAgICogQXR0YWNoZWQgdG8gdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlIG9mIHRoZSBob3N0IGVsZW1lbnQuIEluIG1vc3QgY2FzZXMsIGFyaWEtbGFiZWxsZWRieSB3aWxsXG4gICAqIHRha2UgcHJlY2VkZW5jZSBzbyB0aGlzIG1heSBiZSBvbWl0dGVkLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKipcbiAgICogVXNlcnMgY2FuIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZSB3aGljaCB3aWxsIGJlIGZvcndhcmRlZCB0byB0aGUgaW5wdXQgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSAnYXJpYS1kZXNjcmliZWRieScgYXR0cmlidXRlIGlzIHJlYWQgYWZ0ZXIgdGhlIGVsZW1lbnQncyBsYWJlbCBhbmQgZmllbGQgdHlwZS4gKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfdW5pcXVlSWQ6IHN0cmluZyA9IGBtYXQtY2hlY2tib3gtJHsrK25leHRVbmlxdWVJZH1gO1xuXG4gIC8qKiBBIHVuaXF1ZSBpZCBmb3IgdGhlIGNoZWNrYm94IGlucHV0LiBJZiBub25lIGlzIHN1cHBsaWVkLCBpdCB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gdGhpcy5fdW5pcXVlSWQ7XG5cbiAgLyoqIFJldHVybnMgdGhlIHVuaXF1ZSBpZCBmb3IgdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQuICovXG4gIGdldCBpbnB1dElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGVja2JveCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSBjaGVja2JveC4gRGVmYXVsdHMgdG8gJ2FmdGVyJyAqL1xuICBASW5wdXQoKSBsYWJlbFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBOYW1lIHZhbHVlIHdpbGwgYmUgYXBwbGllZCB0byB0aGUgaW5wdXQgZWxlbWVudCBpZiBwcmVzZW50ICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNoZWNrYm94J3MgYGNoZWNrZWRgIHZhbHVlIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRDaGVja2JveENoYW5nZT4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0Q2hlY2tib3hDaGFuZ2U+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2hlY2tib3gncyBgaW5kZXRlcm1pbmF0ZWAgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGluZGV0ZXJtaW5hdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogVGhlIHZhbHVlIGF0dHJpYnV0ZSBvZiB0aGUgbmF0aXZlIGlucHV0IGVsZW1lbnQgKi9cbiAgQElucHV0KCkgdmFsdWU6IHN0cmluZztcblxuICAvKiogVGhlIG5hdGl2ZSBgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiPmAgZWxlbWVudCAqL1xuICBAVmlld0NoaWxkKCdpbnB1dCcpIF9pbnB1dEVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgcmlwcGxlIGluc3RhbmNlIG9mIHRoZSBjaGVja2JveC4gKi9cbiAgQFZpZXdDaGlsZChNYXRSaXBwbGUpIHJpcHBsZTogTWF0UmlwcGxlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgYmx1cnJlZC4gTmVlZGVkIHRvIHByb3Blcmx5IGltcGxlbWVudCBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgX29uVG91Y2hlZDogKCkgPT4gYW55ID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfY3VycmVudEFuaW1hdGlvbkNsYXNzOiBzdHJpbmcgPSAnJztcblxuICBwcml2YXRlIF9jdXJyZW50Q2hlY2tTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUgPSBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5Jbml0O1xuXG4gIHByaXZhdGUgX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm46ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfQ0hFQ0tCT1hfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX29wdGlvbnM/OiBNYXRDaGVja2JveERlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLl9vcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCBkZWZhdWx0cztcbiAgICB0aGlzLmNvbG9yID0gdGhpcy5kZWZhdWx0Q29sb3IgPSB0aGlzLl9vcHRpb25zLmNvbG9yIHx8IGRlZmF1bHRzLmNvbG9yO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCB0cnVlKS5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgaWYgKCFmb2N1c09yaWdpbikge1xuICAgICAgICAvLyBXaGVuIGEgZm9jdXNlZCBlbGVtZW50IGJlY29tZXMgZGlzYWJsZWQsIHRoZSBicm93c2VyICppbW1lZGlhdGVseSogZmlyZXMgYSBibHVyIGV2ZW50LlxuICAgICAgICAvLyBBbmd1bGFyIGRvZXMgbm90IGV4cGVjdCBldmVudHMgdG8gYmUgcmFpc2VkIGR1cmluZyBjaGFuZ2UgZGV0ZWN0aW9uLCBzbyBhbnkgc3RhdGUgY2hhbmdlXG4gICAgICAgIC8vIChzdWNoIGFzIGEgZm9ybSBjb250cm9sJ3MgJ25nLXRvdWNoZWQnKSB3aWxsIGNhdXNlIGEgY2hhbmdlZC1hZnRlci1jaGVja2VkIGVycm9yLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMTc3OTMuIFRvIHdvcmsgYXJvdW5kIHRoaXMsIHdlIGRlZmVyXG4gICAgICAgIC8vIHRlbGxpbmcgdGhlIGZvcm0gY29udHJvbCBpdCBoYXMgYmVlbiB0b3VjaGVkIHVudGlsIHRoZSBuZXh0IHRpY2suXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3N5bmNJbmRldGVybWluYXRlKHRoaXMuX2luZGV0ZXJtaW5hdGUpO1xuICB9XG5cbiAgLy8gVE9ETzogRGVsZXRlIG5leHQgbWFqb3IgcmV2aXNpb24uXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHt9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2hlY2tlZDtcbiAgfVxuICBzZXQgY2hlY2tlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSAhPSB0aGlzLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2NoZWNrZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9jaGVja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGRpc2FibGVkLiBUaGlzIGZ1bGx5IG92ZXJyaWRlcyB0aGUgaW1wbGVtZW50YXRpb24gcHJvdmlkZWQgYnlcbiAgICogbWl4aW5EaXNhYmxlZCwgYnV0IHRoZSBtaXhpbiBpcyBzdGlsbCByZXF1aXJlZCBiZWNhdXNlIG1peGluVGFiSW5kZXggcmVxdWlyZXMgaXQuXG4gICAqL1xuICBASW5wdXQoKVxuICBvdmVycmlkZSBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIG92ZXJyaWRlIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNoZWNrYm94IGlzIGluZGV0ZXJtaW5hdGUuIFRoaXMgaXMgYWxzbyBrbm93biBhcyBcIm1peGVkXCIgbW9kZSBhbmQgY2FuIGJlIHVzZWQgdG9cbiAgICogcmVwcmVzZW50IGEgY2hlY2tib3ggd2l0aCB0aHJlZSBzdGF0ZXMsIGUuZy4gYSBjaGVja2JveCB0aGF0IHJlcHJlc2VudHMgYSBuZXN0ZWQgbGlzdCBvZlxuICAgKiBjaGVja2FibGUgaXRlbXMuIE5vdGUgdGhhdCB3aGVuZXZlciBjaGVja2JveCBpcyBtYW51YWxseSBjbGlja2VkLCBpbmRldGVybWluYXRlIGlzIGltbWVkaWF0ZWx5XG4gICAqIHNldCB0byBmYWxzZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBpbmRldGVybWluYXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pbmRldGVybWluYXRlO1xuICB9XG4gIHNldCBpbmRldGVybWluYXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHZhbHVlICE9IHRoaXMuX2luZGV0ZXJtaW5hdGU7XG4gICAgdGhpcy5faW5kZXRlcm1pbmF0ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgaWYgKHRoaXMuX2luZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbkNoZWNrU3RhdGUoVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5kZXRlcm1pbmF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9uQ2hlY2tTdGF0ZShcbiAgICAgICAgICB0aGlzLmNoZWNrZWQgPyBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkIDogVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRldGVybWluYXRlQ2hhbmdlLmVtaXQodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3luY0luZGV0ZXJtaW5hdGUodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaW5kZXRlcm1pbmF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIF9pc1JpcHBsZURpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSBsYWJlbCB0ZXh0IGNoYW5nZXMuICovXG4gIF9vbkxhYmVsVGV4dENoYW5nZSgpIHtcbiAgICAvLyBTaW5jZSB0aGUgZXZlbnQgb2YgdGhlIGBjZGtPYnNlcnZlQ29udGVudGAgZGlyZWN0aXZlIHJ1bnMgb3V0c2lkZSBvZiB0aGUgem9uZSwgdGhlIGNoZWNrYm94XG4gICAgLy8gY29tcG9uZW50IHdpbGwgYmUgb25seSBtYXJrZWQgZm9yIGNoZWNrLCBidXQgbm8gYWN0dWFsIGNoYW5nZSBkZXRlY3Rpb24gcnVucyBhdXRvbWF0aWNhbGx5LlxuICAgIC8vIEluc3RlYWQgb2YgZ29pbmcgYmFjayBpbnRvIHRoZSB6b25lIGluIG9yZGVyIHRvIHRyaWdnZXIgYSBjaGFuZ2UgZGV0ZWN0aW9uIHdoaWNoIGNhdXNlc1xuICAgIC8vICphbGwqIGNvbXBvbmVudHMgdG8gYmUgY2hlY2tlZCAoaWYgZXhwbGljaXRseSBtYXJrZWQgb3Igbm90IHVzaW5nIE9uUHVzaCksIHdlIG9ubHkgdHJpZ2dlclxuICAgIC8vIGFuIGV4cGxpY2l0IGNoYW5nZSBkZXRlY3Rpb24gZm9yIHRoZSBjaGVja2JveCB2aWV3IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5jaGVja2VkID0gISF2YWx1ZTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5fY29udHJvbFZhbHVlQWNjZXNzb3JDaGFuZ2VGbiA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfZ2V0QXJpYUNoZWNrZWQoKTogJ3RydWUnIHwgJ2ZhbHNlJyB8ICdtaXhlZCcge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgIHJldHVybiAndHJ1ZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuaW5kZXRlcm1pbmF0ZSA/ICdtaXhlZCcgOiAnZmFsc2UnO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbkNoZWNrU3RhdGUobmV3U3RhdGU6IFRyYW5zaXRpb25DaGVja1N0YXRlKSB7XG4gICAgbGV0IG9sZFN0YXRlID0gdGhpcy5fY3VycmVudENoZWNrU3RhdGU7XG4gICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKG9sZFN0YXRlID09PSBuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyA9IHRoaXMuX2dldEFuaW1hdGlvbkNsYXNzRm9yQ2hlY2tTdGF0ZVRyYW5zaXRpb24oXG4gICAgICBvbGRTdGF0ZSxcbiAgICAgIG5ld1N0YXRlLFxuICAgICk7XG4gICAgdGhpcy5fY3VycmVudENoZWNrU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgIGlmICh0aGlzLl9jdXJyZW50QW5pbWF0aW9uQ2xhc3MubGVuZ3RoID4gMCkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX2N1cnJlbnRBbmltYXRpb25DbGFzcyk7XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgYW5pbWF0aW9uIGNsYXNzIHRvIGF2b2lkIGFuaW1hdGlvbiB3aGVuIHRoZSBjaGVja2JveCBpcyBtb3ZlZCBiZXR3ZWVuIGNvbnRhaW5lcnNcbiAgICAgIGNvbnN0IGFuaW1hdGlvbkNsYXNzID0gdGhpcy5fY3VycmVudEFuaW1hdGlvbkNsYXNzO1xuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uQ2xhc3MpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRDaGVja2JveENoYW5nZSgpO1xuICAgIGV2ZW50LnNvdXJjZSA9IHRoaXM7XG4gICAgZXZlbnQuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcblxuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4odGhpcy5jaGVja2VkKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcblxuICAgIC8vIEFzc2lnbmluZyB0aGUgdmFsdWUgYWdhaW4gaGVyZSBpcyByZWR1bmRhbnQsIGJ1dCB3ZSBoYXZlIHRvIGRvIGl0IGluIGNhc2UgaXQgd2FzXG4gICAgLy8gY2hhbmdlZCBpbnNpZGUgdGhlIGBjaGFuZ2VgIGxpc3RlbmVyIHdoaWNoIHdpbGwgY2F1c2UgdGhlIGlucHV0IHRvIGJlIG91dCBvZiBzeW5jLlxuICAgIGlmICh0aGlzLl9pbnB1dEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGBjaGVja2VkYCBzdGF0ZSBvZiB0aGUgY2hlY2tib3guICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNoZWNrZWQgPSAhdGhpcy5jaGVja2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIGNoZWNrYm94IGlucHV0IGVsZW1lbnQuXG4gICAqIFRvZ2dsZXMgY2hlY2tlZCBzdGF0ZSBpZiBlbGVtZW50IGlzIG5vdCBkaXNhYmxlZC5cbiAgICogRG8gbm90IHRvZ2dsZSBvbiAoY2hhbmdlKSBldmVudCBzaW5jZSBJRSBkb2Vzbid0IGZpcmUgY2hhbmdlIGV2ZW50IHdoZW5cbiAgICogICBpbmRldGVybWluYXRlIGNoZWNrYm94IGlzIGNsaWNrZWQuXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgX29uSW5wdXRDbGljayhldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCBjbGlja0FjdGlvbiA9IHRoaXMuX29wdGlvbnM/LmNsaWNrQWN0aW9uO1xuXG4gICAgLy8gV2UgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIGZvciBjbGljayBldmVudHMgb24gdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQgZWxlbWVudC5cbiAgICAvLyBCeSBkZWZhdWx0LCB3aGVuIGEgdXNlciBjbGlja3Mgb24gYSBsYWJlbCBlbGVtZW50LCBhIGdlbmVyYXRlZCBjbGljayBldmVudCB3aWxsIGJlXG4gICAgLy8gZGlzcGF0Y2hlZCBvbiB0aGUgYXNzb2NpYXRlZCBpbnB1dCBlbGVtZW50LiBTaW5jZSB3ZSBhcmUgdXNpbmcgYSBsYWJlbCBlbGVtZW50IGFzIG91clxuICAgIC8vIHJvb3QgY29udGFpbmVyLCB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGBjaGVja2JveGAgd2lsbCBiZSBleGVjdXRlZCB0d2ljZS5cbiAgICAvLyBUaGUgcmVhbCBjbGljayBldmVudCB3aWxsIGJ1YmJsZSB1cCwgYW5kIHRoZSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgYWxzbyB0cmllcyB0byBidWJibGUgdXAuXG4gICAgLy8gVGhpcyB3aWxsIGxlYWQgdG8gbXVsdGlwbGUgY2xpY2sgZXZlbnRzLlxuICAgIC8vIFByZXZlbnRpbmcgYnViYmxpbmcgZm9yIHRoZSBzZWNvbmQgZXZlbnQgd2lsbCBzb2x2ZSB0aGF0IGlzc3VlLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgLy8gSWYgcmVzZXRJbmRldGVybWluYXRlIGlzIGZhbHNlLCBhbmQgdGhlIGN1cnJlbnQgc3RhdGUgaXMgaW5kZXRlcm1pbmF0ZSwgZG8gbm90aGluZyBvbiBjbGlja1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiBjbGlja0FjdGlvbiAhPT0gJ25vb3AnKSB7XG4gICAgICAvLyBXaGVuIHVzZXIgbWFudWFsbHkgY2xpY2sgb24gdGhlIGNoZWNrYm94LCBgaW5kZXRlcm1pbmF0ZWAgaXMgc2V0IHRvIGZhbHNlLlxuICAgICAgaWYgKHRoaXMuaW5kZXRlcm1pbmF0ZSAmJiBjbGlja0FjdGlvbiAhPT0gJ2NoZWNrJykge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9pbmRldGVybWluYXRlID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5pbmRldGVybWluYXRlQ2hhbmdlLmVtaXQodGhpcy5faW5kZXRlcm1pbmF0ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkNoZWNrU3RhdGUoXG4gICAgICAgIHRoaXMuX2NoZWNrZWQgPyBUcmFuc2l0aW9uQ2hlY2tTdGF0ZS5DaGVja2VkIDogVHJhbnNpdGlvbkNoZWNrU3RhdGUuVW5jaGVja2VkLFxuICAgICAgKTtcblxuICAgICAgLy8gRW1pdCBvdXIgY3VzdG9tIGNoYW5nZSBldmVudCBpZiB0aGUgbmF0aXZlIGlucHV0IGVtaXR0ZWQgb25lLlxuICAgICAgLy8gSXQgaXMgaW1wb3J0YW50IHRvIG9ubHkgZW1pdCBpdCwgaWYgdGhlIG5hdGl2ZSBpbnB1dCB0cmlnZ2VyZWQgb25lLCBiZWNhdXNlXG4gICAgICAvLyB3ZSBkb24ndCB3YW50IHRvIHRyaWdnZXIgYSBjaGFuZ2UgZXZlbnQsIHdoZW4gdGhlIGBjaGVja2VkYCB2YXJpYWJsZSBjaGFuZ2VzIGZvciBleGFtcGxlLlxuICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5kaXNhYmxlZCAmJiBjbGlja0FjdGlvbiA9PT0gJ25vb3AnKSB7XG4gICAgICAvLyBSZXNldCBuYXRpdmUgaW5wdXQgd2hlbiBjbGlja2VkIHdpdGggbm9vcC4gVGhlIG5hdGl2ZSBjaGVja2JveCBiZWNvbWVzIGNoZWNrZWQgYWZ0ZXJcbiAgICAgIC8vIGNsaWNrLCByZXNldCBpdCB0byBiZSBhbGlnbiB3aXRoIGBjaGVja2VkYCB2YWx1ZSBvZiBgbWF0LWNoZWNrYm94YC5cbiAgICAgIHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmNoZWNrZWQgPSB0aGlzLmNoZWNrZWQ7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5pbmRldGVybWluYXRlID0gdGhpcy5pbmRldGVybWluYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBjaGVja2JveC4gKi9cbiAgZm9jdXMob3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5faW5wdXRFbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICBfb25JbnRlcmFjdGlvbkV2ZW50KGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gb24gdGhlIGNoYW5nZSBldmVudC5cbiAgICAvLyBPdGhlcndpc2UgdGhlIGNoYW5nZSBldmVudCwgZnJvbSB0aGUgaW5wdXQgZWxlbWVudCwgd2lsbCBidWJibGUgdXAgYW5kXG4gICAgLy8gZW1pdCBpdHMgZXZlbnQgb2JqZWN0IHRvIHRoZSBgY2hhbmdlYCBvdXRwdXQuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRBbmltYXRpb25DbGFzc0ZvckNoZWNrU3RhdGVUcmFuc2l0aW9uKFxuICAgIG9sZFN0YXRlOiBUcmFuc2l0aW9uQ2hlY2tTdGF0ZSxcbiAgICBuZXdTdGF0ZTogVHJhbnNpdGlvbkNoZWNrU3RhdGUsXG4gICk6IHN0cmluZyB7XG4gICAgLy8gRG9uJ3QgdHJhbnNpdGlvbiBpZiBhbmltYXRpb25zIGFyZSBkaXNhYmxlZC5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGxldCBhbmltU3VmZml4OiBzdHJpbmcgPSAnJztcblxuICAgIHN3aXRjaCAob2xkU3RhdGUpIHtcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5pdDpcbiAgICAgICAgLy8gSGFuZGxlIGVkZ2UgY2FzZSB3aGVyZSB1c2VyIGludGVyYWN0cyB3aXRoIGNoZWNrYm94IHRoYXQgZG9lcyBub3QgaGF2ZSBbKG5nTW9kZWwpXSBvclxuICAgICAgICAvLyBbY2hlY2tlZF0gYm91bmQgdG8gaXQuXG4gICAgICAgIGlmIChuZXdTdGF0ZSA9PT0gVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZCkge1xuICAgICAgICAgIGFuaW1TdWZmaXggPSAndW5jaGVja2VkLWNoZWNrZWQnO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFRyYW5zaXRpb25DaGVja1N0YXRlLkluZGV0ZXJtaW5hdGUpIHtcbiAgICAgICAgICBhbmltU3VmZml4ID0gJ3VuY2hlY2tlZC1pbmRldGVybWluYXRlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRyYW5zaXRpb25DaGVja1N0YXRlLlVuY2hlY2tlZDpcbiAgICAgICAgYW5pbVN1ZmZpeCA9XG4gICAgICAgICAgbmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWRcbiAgICAgICAgICAgID8gJ3VuY2hlY2tlZC1jaGVja2VkJ1xuICAgICAgICAgICAgOiAndW5jaGVja2VkLWluZGV0ZXJtaW5hdGUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuQ2hlY2tlZDpcbiAgICAgICAgYW5pbVN1ZmZpeCA9XG4gICAgICAgICAgbmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLlVuY2hlY2tlZFxuICAgICAgICAgICAgPyAnY2hlY2tlZC11bmNoZWNrZWQnXG4gICAgICAgICAgICA6ICdjaGVja2VkLWluZGV0ZXJtaW5hdGUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHJhbnNpdGlvbkNoZWNrU3RhdGUuSW5kZXRlcm1pbmF0ZTpcbiAgICAgICAgYW5pbVN1ZmZpeCA9XG4gICAgICAgICAgbmV3U3RhdGUgPT09IFRyYW5zaXRpb25DaGVja1N0YXRlLkNoZWNrZWRcbiAgICAgICAgICAgID8gJ2luZGV0ZXJtaW5hdGUtY2hlY2tlZCdcbiAgICAgICAgICAgIDogJ2luZGV0ZXJtaW5hdGUtdW5jaGVja2VkJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGBtYXQtY2hlY2tib3gtYW5pbS0ke2FuaW1TdWZmaXh9YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyB0aGUgaW5kZXRlcm1pbmF0ZSB2YWx1ZSB3aXRoIHRoZSBjaGVja2JveCBET00gbm9kZS5cbiAgICpcbiAgICogV2Ugc3luYyBgaW5kZXRlcm1pbmF0ZWAgZGlyZWN0bHkgb24gdGhlIERPTSBub2RlLCBiZWNhdXNlIGluIEl2eSB0aGUgY2hlY2sgZm9yIHdoZXRoZXIgYVxuICAgKiBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgb24gYW4gZWxlbWVudCBib2lscyBkb3duIHRvIGBpZiAocHJvcE5hbWUgaW4gZWxlbWVudClgLiBEb21pbm8nc1xuICAgKiBIVE1MSW5wdXRFbGVtZW50IGRvZXNuJ3QgaGF2ZSBhbiBgaW5kZXRlcm1pbmF0ZWAgcHJvcGVydHkgc28gSXZ5IHdpbGwgd2FybiBkdXJpbmdcbiAgICogc2VydmVyLXNpZGUgcmVuZGVyaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3luY0luZGV0ZXJtaW5hdGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuYXRpdmVDaGVja2JveCA9IHRoaXMuX2lucHV0RWxlbWVudDtcblxuICAgIGlmIChuYXRpdmVDaGVja2JveCkge1xuICAgICAgbmF0aXZlQ2hlY2tib3gubmF0aXZlRWxlbWVudC5pbmRldGVybWluYXRlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaW5kZXRlcm1pbmF0ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuIiwiPGxhYmVsIFthdHRyLmZvcl09XCJpbnB1dElkXCIgY2xhc3M9XCJtYXQtY2hlY2tib3gtbGF5b3V0XCIgI2xhYmVsPlxuICA8c3BhbiBjbGFzcz1cIm1hdC1jaGVja2JveC1pbm5lci1jb250YWluZXJcIlxuICAgICAgIFtjbGFzcy5tYXQtY2hlY2tib3gtaW5uZXItY29udGFpbmVyLW5vLXNpZGUtbWFyZ2luXT1cIiFjaGVja2JveExhYmVsLnRleHRDb250ZW50IHx8ICFjaGVja2JveExhYmVsLnRleHRDb250ZW50LnRyaW0oKVwiPlxuICAgIDxpbnB1dCAjaW5wdXRcbiAgICAgICAgICAgY2xhc3M9XCJtYXQtY2hlY2tib3gtaW5wdXQgY2RrLXZpc3VhbGx5LWhpZGRlblwiIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgIFtpZF09XCJpbnB1dElkXCJcbiAgICAgICAgICAgW3JlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgW2NoZWNrZWRdPVwiY2hlY2tlZFwiXG4gICAgICAgICAgIFthdHRyLnZhbHVlXT1cInZhbHVlXCJcbiAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgW2F0dHIubmFtZV09XCJuYW1lXCJcbiAgICAgICAgICAgW3RhYkluZGV4XT1cInRhYkluZGV4XCJcbiAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWwgfHwgbnVsbFwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRieVwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJfZ2V0QXJpYUNoZWNrZWQoKVwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtZGVzY3JpYmVkYnldPVwiYXJpYURlc2NyaWJlZGJ5XCJcbiAgICAgICAgICAgKGNoYW5nZSk9XCJfb25JbnRlcmFjdGlvbkV2ZW50KCRldmVudClcIlxuICAgICAgICAgICAoY2xpY2spPVwiX29uSW5wdXRDbGljaygkZXZlbnQpXCI+XG4gICAgPHNwYW4gbWF0UmlwcGxlIGNsYXNzPVwibWF0LWNoZWNrYm94LXJpcHBsZSBtYXQtZm9jdXMtaW5kaWNhdG9yXCJcbiAgICAgICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cImxhYmVsXCJcbiAgICAgICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJfaXNSaXBwbGVEaXNhYmxlZCgpXCJcbiAgICAgICAgIFttYXRSaXBwbGVSYWRpdXNdPVwiMjBcIlxuICAgICAgICAgW21hdFJpcHBsZUNlbnRlcmVkXT1cInRydWVcIlxuICAgICAgICAgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycgPyAwIDogMTUwfVwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtcmlwcGxlLWVsZW1lbnQgbWF0LWNoZWNrYm94LXBlcnNpc3RlbnQtcmlwcGxlXCI+PC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cIm1hdC1jaGVja2JveC1mcmFtZVwiPjwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cIm1hdC1jaGVja2JveC1iYWNrZ3JvdW5kXCI+XG4gICAgICA8c3ZnIHZlcnNpb249XCIxLjFcIlxuICAgICAgICAgICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gICAgICAgICAgIGNsYXNzPVwibWF0LWNoZWNrYm94LWNoZWNrbWFya1wiXG4gICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgICAgICB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiXG4gICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8cGF0aCBjbGFzcz1cIm1hdC1jaGVja2JveC1jaGVja21hcmstcGF0aFwiXG4gICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgc3Ryb2tlPVwid2hpdGVcIlxuICAgICAgICAgICAgICBkPVwiTTQuMSwxMi43IDksMTcuNiAyMC4zLDYuM1wiLz5cbiAgICAgIDwvc3ZnPlxuICAgICAgPCEtLSBFbGVtZW50IGZvciByZW5kZXJpbmcgdGhlIGluZGV0ZXJtaW5hdGUgc3RhdGUgY2hlY2tib3guIC0tPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtY2hlY2tib3gtbWl4ZWRtYXJrXCI+PC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgPC9zcGFuPlxuICA8c3BhbiBjbGFzcz1cIm1hdC1jaGVja2JveC1sYWJlbFwiICNjaGVja2JveExhYmVsIChjZGtPYnNlcnZlQ29udGVudCk9XCJfb25MYWJlbFRleHRDaGFuZ2UoKVwiPlxuICAgIDwhLS0gQWRkIGFuIGludmlzaWJsZSBzcGFuIHNvIEpBV1MgY2FuIHJlYWQgdGhlIGxhYmVsIC0tPlxuICAgIDxzcGFuIHN0eWxlPVwiZGlzcGxheTpub25lXCI+Jm5ic3A7PC9zcGFuPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9zcGFuPlxuPC9sYWJlbD5cbiJdfQ==