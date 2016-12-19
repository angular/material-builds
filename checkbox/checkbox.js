var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewEncapsulation, forwardRef, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
import { MdRippleModule, DefaultStyleCompatibilityModeModule } from '../core';
import { ViewportRuler } from '../core/overlay/position/viewport-ruler';
/** Monotonically increasing integer used to auto-generate unique ids for checkbox components. */
var nextId = 0;
/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export var MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdCheckbox; }),
    multi: true
};
/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
export var TransitionCheckState;
(function (TransitionCheckState) {
    /** The initial state of the component before any user interaction. */
    TransitionCheckState[TransitionCheckState["Init"] = 0] = "Init";
    /** The state representing the component when it's becoming checked. */
    TransitionCheckState[TransitionCheckState["Checked"] = 1] = "Checked";
    /** The state representing the component when it's becoming unchecked. */
    TransitionCheckState[TransitionCheckState["Unchecked"] = 2] = "Unchecked";
    /** The state representing the component when it's becoming indeterminate. */
    TransitionCheckState[TransitionCheckState["Indeterminate"] = 3] = "Indeterminate";
})(TransitionCheckState || (TransitionCheckState = {}));
/** Change event object emitted by MdCheckbox. */
export var MdCheckboxChange = (function () {
    function MdCheckboxChange() {
    }
    return MdCheckboxChange;
}());
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. An MdCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
export var MdCheckbox = (function () {
    function MdCheckbox(_renderer, _elementRef, _changeDetectorRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        /** A unique id for the checkbox. If one is not supplied, it is auto-generated. */
        this.id = "md-checkbox-" + ++nextId;
        /** Whether or not the checkbox should come before or after the label. */
        this.align = 'start';
        this._disabled = false;
        /** @docs-private */
        this.tabindex = 0;
        /** Name value will be applied to the input element if present */
        this.name = null;
        /** Event emitted when the checkbox's `checked` value changes. */
        this.change = new EventEmitter();
        /**
         * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
         * @docs-private
         */
        this.onTouched = function () { };
        this._currentAnimationClass = '';
        this._currentCheckState = TransitionCheckState.Init;
        this._checked = false;
        this._indeterminate = false;
        this._controlValueAccessorChangeFn = function (value) { };
        this._hasFocus = false;
        this.color = 'accent';
    }
    Object.defineProperty(MdCheckbox.prototype, "disableRipple", {
        /** Whether the ripple effect for this checkbox is disabled. */
        get: function () { return this._disableRipple; },
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "inputId", {
        /** ID of the native input element inside `<md-checkbox>` */
        get: function () {
            return "input-" + this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "required", {
        /** Whether the checkbox is required. */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "disabled", {
        /** Whether the checkbox is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "checked", {
        /**
         * Whether the checkbox is checked. Note that setting `checked` will immediately set
         * `indeterminate` to false.
         */
        get: function () {
            return this._checked;
        },
        set: function (checked) {
            if (checked != this.checked) {
                this._indeterminate = false;
                this._checked = checked;
                this._transitionCheckState(this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "indeterminate", {
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever `checked` is set, indeterminate is immediately set to
         * false. This differs from the web platform in that indeterminate state on native
         * checkboxes is only remove when the user manually checks the checkbox (rather than setting the
         * `checked` property programmatically). However, we feel that this behavior is more accommodating
         * to the way consumers would envision using this component.
         */
        get: function () {
            return this._indeterminate;
        },
        set: function (indeterminate) {
            this._indeterminate = indeterminate;
            if (this._indeterminate) {
                this._transitionCheckState(TransitionCheckState.Indeterminate);
            }
            else {
                this._transitionCheckState(this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "color", {
        /** The color of the button. Can be `primary`, `accent`, or `warn`. */
        get: function () { return this._color; },
        set: function (value) { this._updateColor(value); },
        enumerable: true,
        configurable: true
    });
    MdCheckbox.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdCheckbox.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdCheckbox.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdCheckbox.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MdCheckbox.prototype._transitionCheckState = function (newState) {
        var oldState = this._currentCheckState;
        var renderer = this._renderer;
        var elementRef = this._elementRef;
        if (oldState === newState) {
            return;
        }
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, false);
        }
        this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
        this._currentCheckState = newState;
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, true);
        }
    };
    MdCheckbox.prototype._emitChangeEvent = function () {
        var event = new MdCheckboxChange();
        event.source = this;
        event.checked = this.checked;
        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    };
    /** Informs the component when the input has focus so that we can style accordingly */
    MdCheckbox.prototype._onInputFocus = function () {
        this._hasFocus = true;
    };
    /** Informs the component when we lose focus in order to style accordingly */
    MdCheckbox.prototype._onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /** Toggles the `checked` state of the checkbox. */
    MdCheckbox.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * @param event
     */
    MdCheckbox.prototype._onInteractionEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    /** Focuses the checkbox. */
    MdCheckbox.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
        this._onInputFocus();
    };
    MdCheckbox.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdCheckbox.prototype._getAnimationClassForCheckStateTransition = function (oldState, newState) {
        var animSuffix;
        switch (oldState) {
            case TransitionCheckState.Init:
                // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                // [checked] bound to it.
                if (newState === TransitionCheckState.Checked) {
                    animSuffix = 'unchecked-checked';
                }
                else {
                    return '';
                }
                break;
            case TransitionCheckState.Unchecked:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'unchecked-checked' : 'unchecked-indeterminate';
                break;
            case TransitionCheckState.Checked:
                animSuffix = newState === TransitionCheckState.Unchecked ?
                    'checked-unchecked' : 'checked-indeterminate';
                break;
            case TransitionCheckState.Indeterminate:
                animSuffix = newState === TransitionCheckState.Checked ?
                    'indeterminate-checked' : 'indeterminate-unchecked';
        }
        return "md-checkbox-anim-" + animSuffix;
    };
    MdCheckbox.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    __decorate([
        Input('aria-label'), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "ariaLabel", void 0);
    __decorate([
        Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "ariaLabelledby", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "id", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdCheckbox.prototype, "disableRipple", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdCheckbox.prototype, "required", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "align", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdCheckbox.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdCheckbox.prototype, "tabindex", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "name", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], MdCheckbox.prototype, "change", void 0);
    __decorate([
        ViewChild('input'), 
        __metadata('design:type', ElementRef)
    ], MdCheckbox.prototype, "_inputElement", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "checked", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdCheckbox.prototype, "indeterminate", null);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdCheckbox.prototype, "color", null);
    MdCheckbox = __decorate([
        Component({selector: 'md-checkbox, mat-checkbox',
            template: "<label class=\"md-checkbox-layout\"><div class=\"md-checkbox-inner-container\"><input #input class=\"md-checkbox-input md-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [tabindex]=\"tabindex\" [indeterminate]=\"indeterminate\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (focus)=\"_onInputFocus()\" (blur)=\"_onInputBlur()\" (change)=\"_onInteractionEvent($event)\" (click)=\"_onInputClick($event)\"><div md-ripple *ngif=\"!_isRippleDisabled()\" class=\"md-checkbox-ripple\" [mdrippletrigger]=\"_getHostElement()\" [mdripplecentered]=\"true\" [mdripplespeedfactor]=\"0.3\" mdripplebackgroundcolor=\"rgba(0, 0, 0, 0)\"></div><div class=\"md-checkbox-frame\"></div><div class=\"md-checkbox-background\"><svg version=\"1.1\" class=\"md-checkbox-checkmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" xml:space=\"preserve\"><path class=\"md-checkbox-checkmark-path\" fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\"/></svg><div class=\"md-checkbox-mixedmark\"></div></div></div><span class=\"md-checkbox-label\"><ng-content></ng-content></span></label>",
            styles: [".md-checkbox-frame,.md-checkbox-unchecked .md-checkbox-background{background-color:transparent}@keyframes md-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes md-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes md-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.91026}50%{animation-timing-function:cubic-bezier(0,0,.2,.1)}100%{stroke-dashoffset:0}}@keyframes md-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0,0,0,1)}100%{transform:scaleX(1)}}@keyframes md-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(.4,0,1,1);stroke-dashoffset:0}to{stroke-dashoffset:-22.91026}}@keyframes md-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(45deg)}}@keyframes md-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes md-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0)}}@keyframes md-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(315deg)}}@keyframes md-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}100%,32.8%{opacity:0;transform:scaleX(0)}}.md-checkbox-background,.md-checkbox-checkmark,.md-checkbox-frame{bottom:0;left:0;position:absolute;right:0;top:0}.md-checkbox-checkmark,.md-checkbox-mixedmark{width:calc(100% - 4px)}.md-checkbox-background,.md-checkbox-frame{border-radius:2px;box-sizing:border-box;pointer-events:none}md-checkbox{cursor:pointer;transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.md-checkbox-layout{cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex}.md-checkbox-inner-container{display:inline-block;height:20px;line-height:0;margin:auto 8px auto auto;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:20px;flex-shrink:0}[dir=rtl] .md-checkbox-inner-container{margin-left:8px;margin-right:auto}.md-checkbox-layout .md-checkbox-label{line-height:24px}.md-checkbox-frame{border:2px solid;transition:border-color 90ms cubic-bezier(0,0,.2,.1);will-change:border-color}.md-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0,0,.2,.1),opacity 90ms cubic-bezier(0,0,.2,.1);will-change:background-color,opacity}.md-checkbox-checkmark{width:100%}.md-checkbox-checkmark-path{stroke-dashoffset:22.91026;stroke-dasharray:22.91026;stroke-width:2.67px}.md-checkbox-checked .md-checkbox-checkmark-path,.md-checkbox-indeterminate .md-checkbox-checkmark-path{stroke-dashoffset:0}.md-checkbox-mixedmark{height:2px;opacity:0;transform:scaleX(0) rotate(0)}.md-checkbox-align-end .md-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .md-checkbox-align-end .md-checkbox-inner-container{margin-left:auto;margin-right:8px}.md-checkbox-checked .md-checkbox-checkmark{opacity:1}.md-checkbox-checked .md-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.md-checkbox-indeterminate .md-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.md-checkbox-indeterminate .md-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0)}.md-checkbox-disabled{cursor:default}.md-checkbox-anim-unchecked-checked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-in-background}.md-checkbox-anim-unchecked-checked .md-checkbox-checkmark-path{animation:180ms linear 0s md-checkbox-unchecked-checked-checkmark-path}.md-checkbox-anim-unchecked-indeterminate .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-in-background}.md-checkbox-anim-unchecked-indeterminate .md-checkbox-mixedmark{animation:90ms linear 0s md-checkbox-unchecked-indeterminate-mixedmark}.md-checkbox-anim-checked-unchecked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-out-background}.md-checkbox-anim-checked-unchecked .md-checkbox-checkmark-path{animation:90ms linear 0s md-checkbox-checked-unchecked-checkmark-path}.md-checkbox-anim-checked-indeterminate .md-checkbox-checkmark{animation:90ms linear 0s md-checkbox-checked-indeterminate-checkmark}.md-checkbox-anim-checked-indeterminate .md-checkbox-mixedmark{animation:90ms linear 0s md-checkbox-checked-indeterminate-mixedmark}.md-checkbox-anim-indeterminate-checked .md-checkbox-checkmark{animation:.5s linear 0s md-checkbox-indeterminate-checked-checkmark}.md-checkbox-anim-indeterminate-checked .md-checkbox-mixedmark{animation:.5s linear 0s md-checkbox-indeterminate-checked-mixedmark}.md-checkbox-anim-indeterminate-unchecked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-out-background}.md-checkbox-anim-indeterminate-unchecked .md-checkbox-mixedmark{animation:.3s linear 0s md-checkbox-indeterminate-unchecked-mixedmark}.md-checkbox-input{bottom:0;left:50%}.md-checkbox-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
            host: {
                '[class.md-checkbox-indeterminate]': 'indeterminate',
                '[class.md-checkbox-checked]': 'checked',
                '[class.md-checkbox-disabled]': 'disabled',
                '[class.md-checkbox-align-end]': 'align == "end"',
                '[class.md-checkbox-focused]': '_hasFocus',
            },
            providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef, ChangeDetectorRef])
    ], MdCheckbox);
    return MdCheckbox;
}());
export var MdCheckboxModule = (function () {
    function MdCheckboxModule() {
    }
    MdCheckboxModule.forRoot = function () {
        return {
            ngModule: MdCheckboxModule,
            providers: [ViewportRuler]
        };
    };
    MdCheckboxModule = __decorate([
        NgModule({
            imports: [CommonModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdCheckbox, DefaultStyleCompatibilityModeModule],
            declarations: [MdCheckbox],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCheckboxModule);
    return MdCheckboxModule;
}());

//# sourceMappingURL=checkbox.js.map
