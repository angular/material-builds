var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Renderer, forwardRef, ChangeDetectionStrategy, Input, Output, EventEmitter, NgModule, ViewChild, ViewEncapsulation } from '@angular/core';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { applyCssTransform, coerceBooleanProperty, GestureConfig, CompatibilityModule } from '../core';
import { Observable } from 'rxjs/Observable';
export var MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
// A simple change event emitted by the MdSlideToggle component.
export var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
// Increasing integer for generating unique ids for slide-toggle components.
var nextId = 0;
/**
 * Two-state control, which can be also called `switch`.
 */
export var MdSlideToggle = (function () {
    function MdSlideToggle(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        // A unique id for the slide-toggle. By default the id is auto-generated.
        this._uniqueId = "md-slide-toggle-" + ++nextId;
        this._checked = false;
        this._isMousedown = false;
        this._slideRenderer = null;
        this._disabled = false;
        this._required = false;
        // Needs to be public to support AOT compilation (as host binding).
        this._hasFocus = false;
        /** Name value will be applied to the input element if present */
        this.name = null;
        /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
        this.id = this._uniqueId;
        /** Used to specify the tabIndex value for the underlying input element. */
        this.tabIndex = 0;
        /** Whether the label should appear after or before the slide-toggle. Defaults to 'after' */
        this.labelPosition = 'after';
        /** Used to set the aria-label attribute on the underlying input element. */
        this.ariaLabel = null;
        /** Used to set the aria-labelledby attribute on the underlying input element. */
        this.ariaLabelledby = null;
        this._change = new EventEmitter();
        /** An event will be dispatched each time the slide-toggle changes its value. */
        this.change = this._change.asObservable();
    }
    Object.defineProperty(MdSlideToggle.prototype, "disabled", {
        /** Whether the slide-toggle is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "required", {
        /** Whether the slide-toggle is required. */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "inputId", {
        /** Returns the unique id for the visual hidden input. */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        this._slideRenderer = new SlideToggleRenderer(this._elementRef);
    };
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     */
    MdSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Once a drag is currently in progress, we do not want to toggle the slide-toggle on a click.
        if (!this.disabled && !this._slideRenderer.isDragging()) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    MdSlideToggle.prototype._onInputClick = function (event) {
        this.onTouched();
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdSlideToggle.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMousedown = true;
        setTimeout(function () { return _this._isMousedown = false; }, 100);
    };
    MdSlideToggle.prototype._onInputFocus = function () {
        // Only show the focus / ripple indicator when the focus was not triggered by a mouse
        // interaction on the component.
        if (!this._isMousedown) {
            this._hasFocus = true;
        }
    };
    MdSlideToggle.prototype._onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdSlideToggle.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /** Focuses the slide-toggle. */
    MdSlideToggle.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
        this._onInputFocus();
    };
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        /** Whether the slide-toggle is checked. */
        get: function () { return !!this._checked; },
        set: function (value) {
            if (this.checked !== !!value) {
                this._checked = value;
                this.onChange(this._checked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "color", {
        /** The color of the slide-toggle. Can be primary, accent, or warn. */
        get: function () { return this._color; },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    /** Toggles the checked state of the slide-toggle. */
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    MdSlideToggle.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdSlideToggle.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "mat-" + color, isAdd);
        }
    };
    /** Emits the change event to the `change` output EventEmitter */
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this._change.emit(event);
    };
    MdSlideToggle.prototype._onDragStart = function () {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    };
    MdSlideToggle.prototype._onDrag = function (event) {
        if (this._slideRenderer.isDragging()) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    };
    MdSlideToggle.prototype._onDragEnd = function () {
        var _this = this;
        if (!this._slideRenderer.isDragging()) {
            return;
        }
        // Notice that we have to stop outside of the current event handler,
        // because otherwise the click event will be fired and will reset the new checked variable.
        setTimeout(function () {
            _this.checked = _this._slideRenderer.stopThumbDrag();
            _this._emitChangeEvent();
        }, 0);
    };
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "name", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "id", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Number)
    ], MdSlideToggle.prototype, "tabIndex", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlideToggle.prototype, "labelPosition", void 0);
    __decorate([
        Input('aria-label'), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabel", void 0);
    __decorate([
        Input('aria-labelledby'), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabelledby", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdSlideToggle.prototype, "disabled", null);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdSlideToggle.prototype, "required", null);
    __decorate([
        Output(), 
        __metadata('design:type', Observable)
    ], MdSlideToggle.prototype, "change", void 0);
    __decorate([
        ViewChild('input'), 
        __metadata('design:type', ElementRef)
    ], MdSlideToggle.prototype, "_inputElement", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdSlideToggle.prototype, "checked", null);
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdSlideToggle.prototype, "color", null);
    MdSlideToggle = __decorate([
        Component({selector: 'md-slide-toggle, mat-slide-toggle',
            host: {
                '[class.mat-slide-toggle]': 'true',
                '[class.mat-checked]': 'checked',
                '[class.mat-disabled]': 'disabled',
                // This mat-slide-toggle prefix will change, once the temporary ripple is removed.
                '[class.mat-slide-toggle-focused]': '_hasFocus',
                '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                '(mousedown)': '_setMousedown()'
            },
            template: "<label class=\"mat-slide-toggle-label\"><div class=\"mat-slide-toggle-container\"><div class=\"mat-slide-toggle-bar\"></div><div class=\"mat-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart()\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd()\"><div class=\"mat-slide-toggle-thumb\"><div class=\"mat-ink-ripple\"></div></div></div><input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [tabIndex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (blur)=\"_onInputBlur()\" (focus)=\"_onInputFocus()\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"></div><span class=\"mat-slide-toggle-content\"><ng-content></ng-content></span></label>",
            styles: [".mat-slide-toggle{display:flex;height:24px;margin:16px 0;line-height:24px;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(100%,0,0)}.mat-slide-toggle .mat-ink-ripple{border-radius:50%;opacity:0;height:48px;left:50%;overflow:hidden;pointer-events:none;position:absolute;top:50%;transform:translate(-50%,-50%);transition:opacity ease 280ms,background-color ease 280ms;width:48px}.mat-slide-toggle.mat-slide-toggle-focused .mat-ink-ripple{opacity:1}.mat-slide-toggle.mat-slide-toggle-disabled .mat-ink-ripple{background-color:#000}.mat-slide-toggle.mat-disabled .mat-slide-toggle-container,.mat-slide-toggle.mat-disabled .mat-slide-toggle-label{cursor:default}.mat-slide-toggle-content{font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500}.mat-slide-toggle-label{display:flex;flex:1;cursor:pointer}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-container{order:2}.mat-slide-toggle-container{cursor:-webkit-grab;cursor:grab;width:36px;height:24px;position:relative}.mat-slide-toggle-container,[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-container{margin-right:8px;margin-left:0}.mat-slide-toggle-label-before .mat-slide-toggle-container,[dir=rtl] .mat-slide-toggle-container{margin-left:8px;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;top:2px;left:0;z-index:1;width:16px;transform:translate3d(0,0,0);transition:all 80ms linear;transition-property:transform}.mat-slide-toggle-thumb-container.mat-dragging{transition-duration:0s}.mat-slide-toggle-thumb{position:absolute;margin:0;left:0;top:0;height:20px;width:20px;border-radius:50%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-slide-toggle-thumb{background:#fff;border:1px solid #000}.mat-slide-toggle-bar{background:#fff}}.mat-slide-toggle-bar{position:absolute;left:1px;top:5px;width:34px;height:14px;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}"],
            providers: [MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [ElementRef, Renderer])
    ], MdSlideToggle);
    return MdSlideToggle;
}());
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = (function () {
    function SlideToggleRenderer(_elementRef) {
        this._elementRef = _elementRef;
        this._thumbEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-thumb-container');
        this._thumbBarEl = _elementRef.nativeElement.querySelector('.mat-slide-toggle-bar');
    }
    /** Whether the slide-toggle is currently dragging. */
    SlideToggleRenderer.prototype.isDragging = function () {
        return !!this._thumbBarWidth;
    };
    /** Initializes the drag of the slide-toggle. */
    SlideToggleRenderer.prototype.startThumbDrag = function (checked) {
        if (!this.isDragging()) {
            this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
            this._checked = checked;
            this._thumbEl.classList.add('mat-dragging');
        }
    };
    /** Stops the current drag and returns the new checked value. */
    SlideToggleRenderer.prototype.stopThumbDrag = function () {
        if (this.isDragging()) {
            this._thumbBarWidth = null;
            this._thumbEl.classList.remove('mat-dragging');
            applyCssTransform(this._thumbEl, '');
            return this._percentage > 50;
        }
    };
    /** Updates the thumb containers position from the specified distance. */
    SlideToggleRenderer.prototype.updateThumbPosition = function (distance) {
        this._percentage = this._getThumbPercentage(distance);
        applyCssTransform(this._thumbEl, "translate3d(" + this._percentage + "%, 0, 0)");
    };
    /** Retrieves the percentage of thumb from the moved distance. */
    SlideToggleRenderer.prototype._getThumbPercentage = function (distance) {
        var percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._checked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());
export var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    /** @deprecated */
    MdSlideToggleModule.forRoot = function () {
        return {
            ngModule: MdSlideToggleModule,
            providers: []
        };
    };
    MdSlideToggleModule = __decorate([
        NgModule({
            imports: [FormsModule, CompatibilityModule],
            exports: [MdSlideToggle, CompatibilityModule],
            declarations: [MdSlideToggle],
            providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }],
        }), 
        __metadata('design:paramtypes', [])
    ], MdSlideToggleModule);
    return MdSlideToggleModule;
}());
//# sourceMappingURL=slide-toggle.js.map