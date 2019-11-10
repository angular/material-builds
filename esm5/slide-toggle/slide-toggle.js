/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation, NgZone, Optional, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from './slide-toggle-config';
// Increasing integer for generating unique ids for slide-toggle components.
var nextUniqueId = 0;
/** @docs-private */
export var MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatSlideToggle; }),
    multi: true
};
/** Change event object emitted by a MatSlideToggle. */
var MatSlideToggleChange = /** @class */ (function () {
    function MatSlideToggleChange(
    /** The source MatSlideToggle of the event. */
    source, 
    /** The new `checked` value of the MatSlideToggle. */
    checked) {
        this.source = source;
        this.checked = checked;
    }
    return MatSlideToggleChange;
}());
export { MatSlideToggleChange };
// Boilerplate for applying mixins to MatSlideToggle.
/** @docs-private */
var MatSlideToggleBase = /** @class */ (function () {
    function MatSlideToggleBase(_elementRef) {
        this._elementRef = _elementRef;
    }
    return MatSlideToggleBase;
}());
var _MatSlideToggleMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(MatSlideToggleBase)), 'accent'));
/** Represents a slidable "switch" toggle that can be moved between on and off. */
var MatSlideToggle = /** @class */ (function (_super) {
    __extends(MatSlideToggle, _super);
    function MatSlideToggle(elementRef, _focusMonitor, _changeDetectorRef, tabIndex, 
    /**
     * @deprecated `_ngZone` and `_dir` parameters to be removed.
     * @breaking-change 10.0.0
     */
    _ngZone, defaults, _animationMode, _dir) {
        var _this = _super.call(this, elementRef) || this;
        _this._focusMonitor = _focusMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this.defaults = defaults;
        _this._animationMode = _animationMode;
        _this._onChange = function (_) { };
        _this._onTouched = function () { };
        _this._uniqueId = "mat-slide-toggle-" + ++nextUniqueId;
        _this._required = false;
        _this._checked = false;
        /** Name value will be applied to the input element if present. */
        _this.name = null;
        /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
        _this.id = _this._uniqueId;
        /** Whether the label should appear after or before the slide-toggle. Defaults to 'after'. */
        _this.labelPosition = 'after';
        /** Used to set the aria-label attribute on the underlying input element. */
        _this.ariaLabel = null;
        /** Used to set the aria-labelledby attribute on the underlying input element. */
        _this.ariaLabelledby = null;
        /** An event will be dispatched each time the slide-toggle changes its value. */
        _this.change = new EventEmitter();
        /**
         * An event will be dispatched each time the slide-toggle input is toggled.
         * This event is always emitted when the user toggles the slide toggle, but this does not mean
         * the slide toggle's value has changed.
         */
        _this.toggleChange = new EventEmitter();
        /**
         * An event will be dispatched each time the slide-toggle is dragged.
         * This event is always emitted when the user drags the slide toggle to make a change greater
         * than 50%. It does not mean the slide toggle's value is changed. The event is not emitted when
         * the user toggles the slide toggle to change its value.
         * @deprecated No longer being used. To be removed.
         * @breaking-change 10.0.0
         */
        _this.dragChange = new EventEmitter();
        _this.tabIndex = parseInt(tabIndex) || 0;
        return _this;
    }
    Object.defineProperty(MatSlideToggle.prototype, "required", {
        /** Whether the slide-toggle is required. */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlideToggle.prototype, "checked", {
        /** Whether the slide-toggle element is checked or not. */
        get: function () { return this._checked; },
        set: function (value) {
            this._checked = coerceBooleanProperty(value);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlideToggle.prototype, "inputId", {
        /** Returns the unique id for the visual hidden input. */
        get: function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    MatSlideToggle.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe(function (focusOrigin) {
            if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state
                // change (such as a form control's 'ng-touched') will cause a changed-after-checked
                // error. See https://github.com/angular/angular/issues/17793. To work around this,
                // we defer telling the form control it has been touched until the next tick.
                Promise.resolve().then(function () { return _this._onTouched(); });
            }
        });
    };
    MatSlideToggle.prototype.ngOnDestroy = function () {
        this._focusMonitor.stopMonitoring(this._elementRef);
    };
    /** Method being called whenever the underlying input emits a change event. */
    MatSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        this.toggleChange.emit();
        // When the slide toggle's config disables toggle change event by setting
        // `disableToggleValue: true`, the slide toggle's value does not change, and the
        // checked state of the underlying input needs to be changed back.
        if (this.defaults.disableToggleValue) {
            this._inputElement.nativeElement.checked = this.checked;
            return;
        }
        // Sync the value from the underlying input element with the component instance.
        this.checked = this._inputElement.nativeElement.checked;
        // Emit our custom change event only if the underlying input emitted one. This ensures that
        // there is no change event, when the checked state changes programmatically.
        this._emitChangeEvent();
    };
    /** Method being called whenever the slide-toggle has been clicked. */
    MatSlideToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSlideToggle.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSlideToggle.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MatSlideToggle.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MatSlideToggle.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /** Focuses the slide-toggle. */
    MatSlideToggle.prototype.focus = function (options) {
        this._focusMonitor.focusVia(this._inputElement, 'keyboard', options);
    };
    /** Toggles the checked state of the slide-toggle. */
    MatSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
        this._onChange(this.checked);
    };
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     */
    MatSlideToggle.prototype._emitChangeEvent = function () {
        this._onChange(this.checked);
        this.change.emit(new MatSlideToggleChange(this, this.checked));
    };
    /** Method being called whenever the label text changes. */
    MatSlideToggle.prototype._onLabelTextChange = function () {
        // Since the event of the `cdkObserveContent` directive runs outside of the zone, the
        // slide-toggle component will be only marked for check, but no actual change detection runs
        // automatically. Instead of going back into the zone in order to trigger a change detection
        // which causes *all* components to be checked (if explicitly marked or not using OnPush),
        // we only trigger an explicit change detection for the slide-toggle view and its children.
        this._changeDetectorRef.detectChanges();
    };
    MatSlideToggle.decorators = [
        { type: Component, args: [{
                    selector: 'mat-slide-toggle',
                    exportAs: 'matSlideToggle',
                    host: {
                        'class': 'mat-slide-toggle',
                        '[id]': 'id',
                        // Needs to be `-1` so it can still receive programmatic focus.
                        '[attr.tabindex]': 'disabled ? null : -1',
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[class.mat-checked]': 'checked',
                        '[class.mat-disabled]': 'disabled',
                        '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '(focus)': '_inputElement.nativeElement.focus()',
                    },
                    template: "<label [attr.for]=\"inputId\" class=\"mat-slide-toggle-label\" #label>\n  <div #toggleBar class=\"mat-slide-toggle-bar\"\n       [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\">\n\n    <input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\"\n           role=\"switch\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [tabIndex]=\"tabIndex\"\n           [checked]=\"checked\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [attr.aria-checked]=\"checked.toString()\"\n           [attr.aria-label]=\"ariaLabel\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           (change)=\"_onChangeEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n\n    <div class=\"mat-slide-toggle-thumb-container\" #thumbContainer>\n      <div class=\"mat-slide-toggle-thumb\"></div>\n      <div class=\"mat-slide-toggle-ripple\" mat-ripple\n           [matRippleTrigger]=\"label\"\n           [matRippleDisabled]=\"disableRipple || disabled\"\n           [matRippleCentered]=\"true\"\n           [matRippleRadius]=\"20\"\n           [matRippleAnimation]=\"{enterDuration: 150}\">\n\n        <div class=\"mat-ripple-element mat-slide-toggle-persistent-ripple\"></div>\n      </div>\n    </div>\n\n  </div>\n\n  <span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n",
                    providers: [MAT_SLIDE_TOGGLE_VALUE_ACCESSOR],
                    inputs: ['disabled', 'disableRipple', 'color', 'tabIndex'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-slide-toggle{display:inline-block;height:24px;max-width:100%;line-height:24px;white-space:nowrap;outline:none;-webkit-tap-highlight-color:transparent}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px, 0, 0)}[dir=rtl] .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(-16px, 0, 0)}.mat-slide-toggle.mat-disabled{opacity:.38}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{display:flex;flex:1;flex-direction:row;align-items:center;height:inherit;cursor:pointer}.mat-slide-toggle-content{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar,.mat-slide-toggle-bar{margin-right:8px;margin-left:0}[dir=rtl] .mat-slide-toggle-bar,.mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0, 0, 0);transition:all 80ms linear;transition-property:transform}._mat-animation-noopable .mat-slide-toggle-thumb-container{transition:none}[dir=rtl] .mat-slide-toggle-thumb-container{left:auto;right:0}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;flex-shrink:0;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}[dir=rtl] .mat-slide-toggle-input{left:auto;right:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}._mat-animation-noopable .mat-slide-toggle-bar,._mat-animation-noopable .mat-slide-toggle-thumb{transition:none}.mat-slide-toggle .mat-slide-toggle-ripple{position:absolute;top:calc(50% - 20px);left:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-slide-toggle .mat-slide-toggle-ripple .mat-ripple-element:not(.mat-slide-toggle-persistent-ripple){opacity:.12}.mat-slide-toggle-persistent-ripple{width:100%;height:100%;transform:none}.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:.04}.mat-slide-toggle:not(.mat-disabled).cdk-keyboard-focused .mat-slide-toggle-persistent-ripple{opacity:.12}.mat-slide-toggle-persistent-ripple,.mat-slide-toggle.mat-disabled .mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:0}@media(hover: none){.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{display:none}}.cdk-high-contrast-active .mat-slide-toggle-thumb{background:#fff;border:1px solid #000}.mat-slide-toggle.mat-checked .cdk-high-contrast-active .mat-slide-toggle-thumb{background:#000;border:1px solid #fff}.cdk-high-contrast-active .mat-slide-toggle-bar{background:#fff}.mat-slide-toggle.cdk-keyboard-focused .cdk-high-contrast-active .mat-slide-toggle-bar{outline:1px dotted;outline-offset:5px}.cdk-high-contrast-black-on-white .mat-slide-toggle-bar{border:1px solid #000}\n"]
                }] }
    ];
    /** @nocollapse */
    MatSlideToggle.ctorParameters = function () { return [
        { type: ElementRef },
        { type: FocusMonitor },
        { type: ChangeDetectorRef },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: NgZone },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: Directionality, decorators: [{ type: Optional }] }
    ]; };
    MatSlideToggle.propDecorators = {
        _thumbEl: [{ type: ViewChild, args: ['thumbContainer',] }],
        _thumbBarEl: [{ type: ViewChild, args: ['toggleBar',] }],
        name: [{ type: Input }],
        id: [{ type: Input }],
        labelPosition: [{ type: Input }],
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
        required: [{ type: Input }],
        checked: [{ type: Input }],
        change: [{ type: Output }],
        toggleChange: [{ type: Output }],
        dragChange: [{ type: Output }],
        _inputElement: [{ type: ViewChild, args: ['input',] }]
    };
    return MatSlideToggle;
}(_MatSlideToggleMixinBase));
export { MatSlideToggle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlLXRvZ2dsZS9zbGlkZS10b2dnbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFLTCxVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsZ0NBQWdDLEVBRWpDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0IsNEVBQTRFO0FBQzVFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLElBQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxjQUFjLEVBQWQsQ0FBYyxDQUFDO0lBQzdDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FB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WUFBSSxNQUFNLFNBQUMscUJBQXFCO2dCQWhML0MsY0FBYyx1QkFpTFAsUUFBUTs7OzJCQXZFcEIsU0FBUyxTQUFDLGdCQUFnQjs4QkFHMUIsU0FBUyxTQUFDLFdBQVc7dUJBR3JCLEtBQUs7cUJBR0wsS0FBSztnQ0FHTCxLQUFLOzRCQUdMLEtBQUssU0FBQyxZQUFZO2lDQUdsQixLQUFLLFNBQUMsaUJBQWlCOzJCQUd2QixLQUFLOzBCQUtMLEtBQUs7eUJBT0wsTUFBTTsrQkFRTixNQUFNOzZCQVVOLE1BQU07Z0NBTU4sU0FBUyxTQUFDLE9BQU87O0lBZ0lwQixxQkFBQztDQUFBLEFBN05ELENBdUJvQyx3QkFBd0IsR0FzTTNEO1NBdE1ZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3J9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsIENhbkNvbG9yQ3RvcixcbiAgQ2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBIYXNUYWJJbmRleCwgSGFzVGFiSW5kZXhDdG9yLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIG1peGluVGFiSW5kZXgsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBNQVRfU0xJREVfVE9HR0xFX0RFRkFVTFRfT1BUSU9OUyxcbiAgTWF0U2xpZGVUb2dnbGVEZWZhdWx0T3B0aW9uc1xufSBmcm9tICcuL3NsaWRlLXRvZ2dsZS1jb25maWcnO1xuXG4vLyBJbmNyZWFzaW5nIGludGVnZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGlkcyBmb3Igc2xpZGUtdG9nZ2xlIGNvbXBvbmVudHMuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU0xJREVfVE9HR0xFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRTbGlkZVRvZ2dsZSksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IGEgTWF0U2xpZGVUb2dnbGUuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVUb2dnbGVDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHNvdXJjZSBNYXRTbGlkZVRvZ2dsZSBvZiB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2xpZGVUb2dnbGUsXG4gICAgLyoqIFRoZSBuZXcgYGNoZWNrZWRgIHZhbHVlIG9mIHRoZSBNYXRTbGlkZVRvZ2dsZS4gKi9cbiAgICBwdWJsaWMgY2hlY2tlZDogYm9vbGVhbikgeyB9XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2xpZGVUb2dnbGUuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0U2xpZGVUb2dnbGVCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuY29uc3QgX01hdFNsaWRlVG9nZ2xlTWl4aW5CYXNlOlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuQ29sb3JDdG9yICZcbiAgICBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmXG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIHR5cGVvZiBNYXRTbGlkZVRvZ2dsZUJhc2UgPVxuICAgICAgICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoTWF0U2xpZGVUb2dnbGVCYXNlKSksICdhY2NlbnQnKSk7XG5cbi8qKiBSZXByZXNlbnRzIGEgc2xpZGFibGUgXCJzd2l0Y2hcIiB0b2dnbGUgdGhhdCBjYW4gYmUgbW92ZWQgYmV0d2VlbiBvbiBhbmQgb2ZmLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlLXRvZ2dsZScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVUb2dnbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zbGlkZS10b2dnbGUnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAvLyBOZWVkcyB0byBiZSBgLTFgIHNvIGl0IGNhbiBzdGlsbCByZWNlaXZlIHByb2dyYW1tYXRpYyBmb2N1cy5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IC0xJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZS10b2dnbGUtbGFiZWwtYmVmb3JlXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiYmVmb3JlXCInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICcoZm9jdXMpJzogJ19pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZS10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZS10b2dnbGUuY3NzJ10sXG4gIHByb3ZpZGVyczogW01BVF9TTElERV9UT0dHTEVfVkFMVUVfQUNDRVNTT1JdLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvcicsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVUb2dnbGUgZXh0ZW5kcyBfTWF0U2xpZGVUb2dnbGVNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhbkRpc2FibGUsIENhbkNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSGFzVGFiSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5EaXNhYmxlUmlwcGxlIHtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfdW5pcXVlSWQ6IHN0cmluZyA9IGBtYXQtc2xpZGUtdG9nZ2xlLSR7KytuZXh0VW5pcXVlSWR9YDtcbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHRodW1iIEhUTUxFbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCd0aHVtYkNvbnRhaW5lcicpIF90aHVtYkVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHRodW1iIGJhciBIVE1MRWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgndG9nZ2xlQmFyJykgX3RodW1iQmFyRWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIE5hbWUgdmFsdWUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBlbGVtZW50IGlmIHByZXNlbnQuICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBIHVuaXF1ZSBpZCBmb3IgdGhlIHNsaWRlLXRvZ2dsZSBpbnB1dC4gSWYgbm9uZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgc2xpZGUtdG9nZ2xlLiBEZWZhdWx0cyB0byAnYWZ0ZXInLiAqL1xuICBASW5wdXQoKSBsYWJlbFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgYXJpYS1sYWJlbCBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogVXNlZCB0byBzZXQgdGhlIGFyaWEtbGFiZWxsZWRieSBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlLXRvZ2dsZSBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlKSB7IHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZS10b2dnbGUgZWxlbWVudCBpcyBjaGVja2VkIG9yIG5vdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNoZWNrZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jaGVja2VkOyB9XG4gIHNldCBjaGVja2VkKHZhbHVlKSB7XG4gICAgdGhpcy5fY2hlY2tlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgLyoqIEFuIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCBlYWNoIHRpbWUgdGhlIHNsaWRlLXRvZ2dsZSBjaGFuZ2VzIGl0cyB2YWx1ZS4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdFNsaWRlVG9nZ2xlQ2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNsaWRlVG9nZ2xlQ2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCB3aWxsIGJlIGRpc3BhdGNoZWQgZWFjaCB0aW1lIHRoZSBzbGlkZS10b2dnbGUgaW5wdXQgaXMgdG9nZ2xlZC5cbiAgICogVGhpcyBldmVudCBpcyBhbHdheXMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHRvZ2dsZXMgdGhlIHNsaWRlIHRvZ2dsZSwgYnV0IHRoaXMgZG9lcyBub3QgbWVhblxuICAgKiB0aGUgc2xpZGUgdG9nZ2xlJ3MgdmFsdWUgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdG9nZ2xlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCBlYWNoIHRpbWUgdGhlIHNsaWRlLXRvZ2dsZSBpcyBkcmFnZ2VkLlxuICAgKiBUaGlzIGV2ZW50IGlzIGFsd2F5cyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgZHJhZ3MgdGhlIHNsaWRlIHRvZ2dsZSB0byBtYWtlIGEgY2hhbmdlIGdyZWF0ZXJcbiAgICogdGhhbiA1MCUuIEl0IGRvZXMgbm90IG1lYW4gdGhlIHNsaWRlIHRvZ2dsZSdzIHZhbHVlIGlzIGNoYW5nZWQuIFRoZSBldmVudCBpcyBub3QgZW1pdHRlZCB3aGVuXG4gICAqIHRoZSB1c2VyIHRvZ2dsZXMgdGhlIHNsaWRlIHRvZ2dsZSB0byBjaGFuZ2UgaXRzIHZhbHVlLlxuICAgKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBkcmFnQ2hhbmdlOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFJldHVybnMgdGhlIHVuaXF1ZSBpZCBmb3IgdGhlIHZpc3VhbCBoaWRkZW4gaW5wdXQuICovXG4gIGdldCBpbnB1dElkKCk6IHN0cmluZyB7IHJldHVybiBgJHt0aGlzLmlkIHx8IHRoaXMuX3VuaXF1ZUlkfS1pbnB1dGA7IH1cblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2lucHV0JykgX2lucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9mb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQGRlcHJlY2F0ZWQgYF9uZ1pvbmVgIGFuZCBgX2RpcmAgcGFyYW1ldGVycyB0byBiZSByZW1vdmVkLlxuICAgICAgICAgICAgICAgICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfU0xJREVfVE9HR0xFX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIHB1YmxpYyBkZWZhdWx0czogTWF0U2xpZGVUb2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgX2Rpcj86IERpcmVjdGlvbmFsaXR5KSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICBpZiAoIWZvY3VzT3JpZ2luKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIGZvY3VzZWQgZWxlbWVudCBiZWNvbWVzIGRpc2FibGVkLCB0aGUgYnJvd3NlciAqaW1tZWRpYXRlbHkqIGZpcmVzIGEgYmx1ciBldmVudC5cbiAgICAgICAgICAvLyBBbmd1bGFyIGRvZXMgbm90IGV4cGVjdCBldmVudHMgdG8gYmUgcmFpc2VkIGR1cmluZyBjaGFuZ2UgZGV0ZWN0aW9uLCBzbyBhbnkgc3RhdGVcbiAgICAgICAgICAvLyBjaGFuZ2UgKHN1Y2ggYXMgYSBmb3JtIGNvbnRyb2wncyAnbmctdG91Y2hlZCcpIHdpbGwgY2F1c2UgYSBjaGFuZ2VkLWFmdGVyLWNoZWNrZWRcbiAgICAgICAgICAvLyBlcnJvci4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzE3NzkzLiBUbyB3b3JrIGFyb3VuZCB0aGlzLFxuICAgICAgICAgIC8vIHdlIGRlZmVyIHRlbGxpbmcgdGhlIGZvcm0gY29udHJvbCBpdCBoYXMgYmVlbiB0b3VjaGVkIHVudGlsIHRoZSBuZXh0IHRpY2suXG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9vblRvdWNoZWQoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuX2VsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIE1ldGhvZCBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHVuZGVybHlpbmcgaW5wdXQgZW1pdHMgYSBjaGFuZ2UgZXZlbnQuICovXG4gIF9vbkNoYW5nZUV2ZW50KGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gb24gdGhlIGNoYW5nZSBldmVudC5cbiAgICAvLyBPdGhlcndpc2UgdGhlIGNoYW5nZSBldmVudCwgZnJvbSB0aGUgaW5wdXQgZWxlbWVudCwgd2lsbCBidWJibGUgdXAgYW5kXG4gICAgLy8gZW1pdCBpdHMgZXZlbnQgb2JqZWN0IHRvIHRoZSBjb21wb25lbnQncyBgY2hhbmdlYCBvdXRwdXQuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy50b2dnbGVDaGFuZ2UuZW1pdCgpO1xuXG4gICAgLy8gV2hlbiB0aGUgc2xpZGUgdG9nZ2xlJ3MgY29uZmlnIGRpc2FibGVzIHRvZ2dsZSBjaGFuZ2UgZXZlbnQgYnkgc2V0dGluZ1xuICAgIC8vIGBkaXNhYmxlVG9nZ2xlVmFsdWU6IHRydWVgLCB0aGUgc2xpZGUgdG9nZ2xlJ3MgdmFsdWUgZG9lcyBub3QgY2hhbmdlLCBhbmQgdGhlXG4gICAgLy8gY2hlY2tlZCBzdGF0ZSBvZiB0aGUgdW5kZXJseWluZyBpbnB1dCBuZWVkcyB0byBiZSBjaGFuZ2VkIGJhY2suXG4gICAgaWYgKHRoaXMuZGVmYXVsdHMuZGlzYWJsZVRvZ2dsZVZhbHVlKSB7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGVja2VkID0gdGhpcy5jaGVja2VkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFN5bmMgdGhlIHZhbHVlIGZyb20gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudCB3aXRoIHRoZSBjb21wb25lbnQgaW5zdGFuY2UuXG4gICAgdGhpcy5jaGVja2VkID0gdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hlY2tlZDtcblxuICAgIC8vIEVtaXQgb3VyIGN1c3RvbSBjaGFuZ2UgZXZlbnQgb25seSBpZiB0aGUgdW5kZXJseWluZyBpbnB1dCBlbWl0dGVkIG9uZS4gVGhpcyBlbnN1cmVzIHRoYXRcbiAgICAvLyB0aGVyZSBpcyBubyBjaGFuZ2UgZXZlbnQsIHdoZW4gdGhlIGNoZWNrZWQgc3RhdGUgY2hhbmdlcyBwcm9ncmFtbWF0aWNhbGx5LlxuICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICB9XG5cbiAgLyoqIE1ldGhvZCBiZWluZyBjYWxsZWQgd2hlbmV2ZXIgdGhlIHNsaWRlLXRvZ2dsZSBoYXMgYmVlbiBjbGlja2VkLiAqL1xuICBfb25JbnB1dENsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIFdlIGhhdmUgdG8gc3RvcCBwcm9wYWdhdGlvbiBmb3IgY2xpY2sgZXZlbnRzIG9uIHRoZSB2aXN1YWwgaGlkZGVuIGlucHV0IGVsZW1lbnQuXG4gICAgLy8gQnkgZGVmYXVsdCwgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIGEgbGFiZWwgZWxlbWVudCwgYSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgd2lsbCBiZVxuICAgIC8vIGRpc3BhdGNoZWQgb24gdGhlIGFzc29jaWF0ZWQgaW5wdXQgZWxlbWVudC4gU2luY2Ugd2UgYXJlIHVzaW5nIGEgbGFiZWwgZWxlbWVudCBhcyBvdXJcbiAgICAvLyByb290IGNvbnRhaW5lciwgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBgc2xpZGUtdG9nZ2xlYCB3aWxsIGJlIGV4ZWN1dGVkIHR3aWNlLlxuICAgIC8vIFRoZSByZWFsIGNsaWNrIGV2ZW50IHdpbGwgYnViYmxlIHVwLCBhbmQgdGhlIGdlbmVyYXRlZCBjbGljayBldmVudCBhbHNvIHRyaWVzIHRvIGJ1YmJsZSB1cC5cbiAgICAvLyBUaGlzIHdpbGwgbGVhZCB0byBtdWx0aXBsZSBjbGljayBldmVudHMuXG4gICAgLy8gUHJldmVudGluZyBidWJibGluZyBmb3IgdGhlIHNlY29uZCBldmVudCB3aWxsIHNvbHZlIHRoYXQgaXNzdWUuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5jaGVja2VkID0gISF2YWx1ZTtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBhIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNsaWRlLXRvZ2dsZS4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9pbnB1dEVsZW1lbnQsICdrZXlib2FyZCcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIHNsaWRlLXRvZ2dsZS4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tlZCA9ICF0aGlzLmNoZWNrZWQ7XG4gICAgdGhpcy5fb25DaGFuZ2UodGhpcy5jaGVja2VkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGNoYW5nZSBldmVudCBvbiB0aGUgYGNoYW5nZWAgb3V0cHV0LiBBbHNvIG5vdGlmaWVzIHRoZSBGb3JtQ29udHJvbCBhYm91dCB0aGUgY2hhbmdlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX29uQ2hhbmdlKHRoaXMuY2hlY2tlZCk7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0U2xpZGVUb2dnbGVDaGFuZ2UodGhpcywgdGhpcy5jaGVja2VkKSk7XG4gIH1cblxuICAvKiogTWV0aG9kIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgbGFiZWwgdGV4dCBjaGFuZ2VzLiAqL1xuICBfb25MYWJlbFRleHRDaGFuZ2UoKSB7XG4gICAgLy8gU2luY2UgdGhlIGV2ZW50IG9mIHRoZSBgY2RrT2JzZXJ2ZUNvbnRlbnRgIGRpcmVjdGl2ZSBydW5zIG91dHNpZGUgb2YgdGhlIHpvbmUsIHRoZVxuICAgIC8vIHNsaWRlLXRvZ2dsZSBjb21wb25lbnQgd2lsbCBiZSBvbmx5IG1hcmtlZCBmb3IgY2hlY2ssIGJ1dCBubyBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zXG4gICAgLy8gYXV0b21hdGljYWxseS4gSW5zdGVhZCBvZiBnb2luZyBiYWNrIGludG8gdGhlIHpvbmUgaW4gb3JkZXIgdG8gdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAvLyB3aGljaCBjYXVzZXMgKmFsbCogY29tcG9uZW50cyB0byBiZSBjaGVja2VkIChpZiBleHBsaWNpdGx5IG1hcmtlZCBvciBub3QgdXNpbmcgT25QdXNoKSxcbiAgICAvLyB3ZSBvbmx5IHRyaWdnZXIgYW4gZXhwbGljaXQgY2hhbmdlIGRldGVjdGlvbiBmb3IgdGhlIHNsaWRlLXRvZ2dsZSB2aWV3IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NoZWNrZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG4iXX0=