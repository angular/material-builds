/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation, Optional, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinColor, mixinDisabled, mixinDisableRipple, mixinTabIndex, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from './slide-toggle-config';
// Increasing integer for generating unique ids for slide-toggle components.
let nextUniqueId = 0;
/** @docs-private */
export const MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatSlideToggle),
    multi: true
};
/** Change event object emitted by a MatSlideToggle. */
export class MatSlideToggleChange {
    constructor(
    /** The source MatSlideToggle of the event. */
    source, 
    /** The new `checked` value of the MatSlideToggle. */
    checked) {
        this.source = source;
        this.checked = checked;
    }
}
// Boilerplate for applying mixins to MatSlideToggle.
/** @docs-private */
const _MatSlideToggleBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}))));
/** Represents a slidable "switch" toggle that can be moved between on and off. */
export class MatSlideToggle extends _MatSlideToggleBase {
    constructor(elementRef, _focusMonitor, _changeDetectorRef, tabIndex, defaults, animationMode) {
        super(elementRef);
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this.defaults = defaults;
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._uniqueId = `mat-slide-toggle-${++nextUniqueId}`;
        this._required = false;
        this._checked = false;
        /** Name value will be applied to the input element if present. */
        this.name = null;
        /** A unique id for the slide-toggle input. If none is supplied, it will be auto-generated. */
        this.id = this._uniqueId;
        /** Whether the label should appear after or before the slide-toggle. Defaults to 'after'. */
        this.labelPosition = 'after';
        /** Used to set the aria-label attribute on the underlying input element. */
        this.ariaLabel = null;
        /** Used to set the aria-labelledby attribute on the underlying input element. */
        this.ariaLabelledby = null;
        /** An event will be dispatched each time the slide-toggle changes its value. */
        this.change = new EventEmitter();
        /**
         * An event will be dispatched each time the slide-toggle input is toggled.
         * This event is always emitted when the user toggles the slide toggle, but this does not mean
         * the slide toggle's value has changed.
         */
        this.toggleChange = new EventEmitter();
        this.tabIndex = parseInt(tabIndex) || 0;
        this.color = this.defaultColor = defaults.color || 'accent';
        this._noopAnimations = animationMode === 'NoopAnimations';
    }
    /** Whether the slide-toggle is required. */
    get required() { return this._required; }
    set required(value) { this._required = coerceBooleanProperty(value); }
    /** Whether the slide-toggle element is checked or not. */
    get checked() { return this._checked; }
    set checked(value) {
        this._checked = coerceBooleanProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Returns the unique id for the visual hidden input. */
    get inputId() { return `${this.id || this._uniqueId}-input`; }
    ngAfterContentInit() {
        this._focusMonitor
            .monitor(this._elementRef, true)
            .subscribe(focusOrigin => {
            // Only forward focus manually when it was received programmatically or through the
            // keyboard. We should not do this for mouse/touch focus for two reasons:
            // 1. It can prevent clicks from landing in Chrome (see #18269).
            // 2. They're already handled by the wrapping `label` element.
            if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                this._inputElement.nativeElement.focus();
            }
            else if (!focusOrigin) {
                // When a focused element becomes disabled, the browser *immediately* fires a blur event.
                // Angular does not expect events to be raised during change detection, so any state
                // change (such as a form control's 'ng-touched') will cause a changed-after-checked
                // error. See https://github.com/angular/angular/issues/17793. To work around this,
                // we defer telling the form control it has been touched until the next tick.
                Promise.resolve().then(() => this._onTouched());
            }
        });
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef);
    }
    /** Method being called whenever the underlying input emits a change event. */
    _onChangeEvent(event) {
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
    }
    /** Method being called whenever the slide-toggle has been clicked. */
    _onInputClick(event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /** Implemented as part of ControlValueAccessor. */
    writeValue(value) {
        this.checked = !!value;
    }
    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /** Implemented as a part of ControlValueAccessor. */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    }
    /** Focuses the slide-toggle. */
    focus(options, origin) {
        if (origin) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        }
        else {
            this._inputElement.nativeElement.focus(options);
        }
    }
    /** Toggles the checked state of the slide-toggle. */
    toggle() {
        this.checked = !this.checked;
        this._onChange(this.checked);
    }
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     */
    _emitChangeEvent() {
        this._onChange(this.checked);
        this.change.emit(new MatSlideToggleChange(this, this.checked));
    }
    /** Method being called whenever the label text changes. */
    _onLabelTextChange() {
        // Since the event of the `cdkObserveContent` directive runs outside of the zone, the
        // slide-toggle component will be only marked for check, but no actual change detection runs
        // automatically. Instead of going back into the zone in order to trigger a change detection
        // which causes *all* components to be checked (if explicitly marked or not using OnPush),
        // we only trigger an explicit change detection for the slide-toggle view and its children.
        this._changeDetectorRef.detectChanges();
    }
}
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
                    '[class._mat-animation-noopable]': '_noopAnimations',
                },
                template: "<label [attr.for]=\"inputId\" class=\"mat-slide-toggle-label\" #label>\n  <div #toggleBar class=\"mat-slide-toggle-bar\"\n       [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\">\n\n    <input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\"\n           role=\"switch\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [tabIndex]=\"tabIndex\"\n           [checked]=\"checked\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [attr.aria-checked]=\"checked.toString()\"\n           [attr.aria-label]=\"ariaLabel\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onChangeEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n\n    <div class=\"mat-slide-toggle-thumb-container\" #thumbContainer>\n      <div class=\"mat-slide-toggle-thumb\"></div>\n      <div class=\"mat-slide-toggle-ripple mat-focus-indicator\" mat-ripple\n           [matRippleTrigger]=\"label\"\n           [matRippleDisabled]=\"disableRipple || disabled\"\n           [matRippleCentered]=\"true\"\n           [matRippleRadius]=\"20\"\n           [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n        <div class=\"mat-ripple-element mat-slide-toggle-persistent-ripple\"></div>\n      </div>\n    </div>\n\n  </div>\n\n  <span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n",
                providers: [MAT_SLIDE_TOGGLE_VALUE_ACCESSOR],
                inputs: ['disabled', 'disableRipple', 'color', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-slide-toggle{display:inline-block;height:24px;max-width:100%;line-height:24px;white-space:nowrap;outline:none;-webkit-tap-highlight-color:transparent}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px, 0, 0)}[dir=rtl] .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(-16px, 0, 0)}.mat-slide-toggle.mat-disabled{opacity:.38}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:flex;flex:1;flex-direction:row;align-items:center;height:inherit;cursor:pointer}.mat-slide-toggle-content{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar,.mat-slide-toggle-bar{margin-right:8px;margin-left:0}[dir=rtl] .mat-slide-toggle-bar,.mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0, 0, 0);transition:all 80ms linear;transition-property:transform}._mat-animation-noopable .mat-slide-toggle-thumb-container{transition:none}[dir=rtl] .mat-slide-toggle-thumb-container{left:auto;right:0}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;flex-shrink:0;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}[dir=rtl] .mat-slide-toggle-input{left:auto;right:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}._mat-animation-noopable .mat-slide-toggle-bar,._mat-animation-noopable .mat-slide-toggle-thumb{transition:none}.mat-slide-toggle .mat-slide-toggle-ripple{position:absolute;top:calc(50% - 20px);left:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-slide-toggle .mat-slide-toggle-ripple .mat-ripple-element:not(.mat-slide-toggle-persistent-ripple){opacity:.12}.mat-slide-toggle-persistent-ripple{width:100%;height:100%;transform:none}.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:.04}.mat-slide-toggle:not(.mat-disabled).cdk-keyboard-focused .mat-slide-toggle-persistent-ripple{opacity:.12}.mat-slide-toggle-persistent-ripple,.mat-slide-toggle.mat-disabled .mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:0}@media(hover: none){.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{display:none}}.cdk-high-contrast-active .mat-slide-toggle-thumb,.cdk-high-contrast-active .mat-slide-toggle-bar{border:1px solid}.cdk-high-contrast-active .mat-slide-toggle.cdk-keyboard-focused .mat-slide-toggle-bar{outline:2px dotted;outline-offset:5px}\n"]
            },] }
];
MatSlideToggle.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatSlideToggle.propDecorators = {
    _thumbEl: [{ type: ViewChild, args: ['thumbContainer',] }],
    _thumbBarEl: [{ type: ViewChild, args: ['toggleBar',] }],
    name: [{ type: Input }],
    id: [{ type: Input }],
    labelPosition: [{ type: Input }],
    ariaLabel: [{ type: Input, args: ['aria-label',] }],
    ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
    ariaDescribedby: [{ type: Input, args: ['aria-describedby',] }],
    required: [{ type: Input }],
    checked: [{ type: Input }],
    change: [{ type: Output }],
    toggleChange: [{ type: Output }],
    _inputElement: [{ type: ViewChild, args: ['input',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NsaWRlLXRvZ2dsZS9zbGlkZS10b2dnbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBZSxxQkFBcUIsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZGLE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUVMLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFLTCxVQUFVLEVBQ1YsYUFBYSxFQUNiLGtCQUFrQixFQUNsQixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsZ0NBQWdDLEVBRWpDLE1BQU0sdUJBQXVCLENBQUM7QUFFL0IsNEVBQTRFO0FBQzVFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQixvQkFBb0I7QUFDcEIsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQVE7SUFDbEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztJQUM3QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRix1REFBdUQ7QUFDdkQsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQjtJQUNFLDhDQUE4QztJQUN2QyxNQUFzQjtJQUM3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TSxTQUFDLGdDQUFnQzt5Q0FFdkMsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt1QkExRHBELFNBQVMsU0FBQyxnQkFBZ0I7MEJBRzFCLFNBQVMsU0FBQyxXQUFXO21CQUdyQixLQUFLO2lCQUdMLEtBQUs7NEJBR0wsS0FBSzt3QkFHTCxLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLGlCQUFpQjs4QkFHdkIsS0FBSyxTQUFDLGtCQUFrQjt1QkFHeEIsS0FBSztzQkFLTCxLQUFLO3FCQU9MLE1BQU07MkJBUU4sTUFBTTs0QkFNTixTQUFTLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBIYXNUYWJJbmRleCxcbiAgbWl4aW5Db2xvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgTUFUX1NMSURFX1RPR0dMRV9ERUZBVUxUX09QVElPTlMsXG4gIE1hdFNsaWRlVG9nZ2xlRGVmYXVsdE9wdGlvbnNcbn0gZnJvbSAnLi9zbGlkZS10b2dnbGUtY29uZmlnJztcblxuLy8gSW5jcmVhc2luZyBpbnRlZ2VyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBpZHMgZm9yIHNsaWRlLXRvZ2dsZSBjb21wb25lbnRzLlxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX1NMSURFX1RPR0dMRV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0U2xpZGVUb2dnbGUpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgZW1pdHRlZCBieSBhIE1hdFNsaWRlVG9nZ2xlLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlVG9nZ2xlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBzb3VyY2UgTWF0U2xpZGVUb2dnbGUgb2YgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNsaWRlVG9nZ2xlLFxuICAgIC8qKiBUaGUgbmV3IGBjaGVja2VkYCB2YWx1ZSBvZiB0aGUgTWF0U2xpZGVUb2dnbGUuICovXG4gICAgcHVibGljIGNoZWNrZWQ6IGJvb2xlYW4pIHsgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNsaWRlVG9nZ2xlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRTbGlkZVRvZ2dsZUJhc2UgPVxuICBtaXhpblRhYkluZGV4KG1peGluQ29sb3IobWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSkpKSk7XG5cbi8qKiBSZXByZXNlbnRzIGEgc2xpZGFibGUgXCJzd2l0Y2hcIiB0b2dnbGUgdGhhdCBjYW4gYmUgbW92ZWQgYmV0d2VlbiBvbiBhbmQgb2ZmLiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNsaWRlLXRvZ2dsZScsXG4gIGV4cG9ydEFzOiAnbWF0U2xpZGVUb2dnbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zbGlkZS10b2dnbGUnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAvLyBOZWVkcyB0byBiZSBgLTFgIHNvIGl0IGNhbiBzdGlsbCByZWNlaXZlIHByb2dyYW1tYXRpYyBmb2N1cy5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gbnVsbCA6IC0xJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnbnVsbCcsXG4gICAgJ1tjbGFzcy5tYXQtY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tjbGFzcy5tYXQtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zbGlkZS10b2dnbGUtbGFiZWwtYmVmb3JlXSc6ICdsYWJlbFBvc2l0aW9uID09IFwiYmVmb3JlXCInLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19ub29wQW5pbWF0aW9ucycsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnc2xpZGUtdG9nZ2xlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2xpZGUtdG9nZ2xlLmNzcyddLFxuICBwcm92aWRlcnM6IFtNQVRfU0xJREVfVE9HR0xFX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNsaWRlVG9nZ2xlIGV4dGVuZHMgX01hdFNsaWRlVG9nZ2xlQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5EaXNhYmxlLCBDYW5Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIYXNUYWJJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDYW5EaXNhYmxlUmlwcGxlIHtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgcHJpdmF0ZSBfdW5pcXVlSWQ6IHN0cmluZyA9IGBtYXQtc2xpZGUtdG9nZ2xlLSR7KytuZXh0VW5pcXVlSWR9YDtcbiAgcHJpdmF0ZSBfcmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIG5vb3AgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZC4gKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHRodW1iIEhUTUxFbGVtZW50LiAqL1xuICBAVmlld0NoaWxkKCd0aHVtYkNvbnRhaW5lcicpIF90aHVtYkVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHRodW1iIGJhciBIVE1MRWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgndG9nZ2xlQmFyJykgX3RodW1iQmFyRWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIE5hbWUgdmFsdWUgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBpbnB1dCBlbGVtZW50IGlmIHByZXNlbnQuICovXG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBBIHVuaXF1ZSBpZCBmb3IgdGhlIHNsaWRlLXRvZ2dsZSBpbnB1dC4gSWYgbm9uZSBpcyBzdXBwbGllZCwgaXQgd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IHRoaXMuX3VuaXF1ZUlkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgc2xpZGUtdG9nZ2xlLiBEZWZhdWx0cyB0byAnYWZ0ZXInLiAqL1xuICBASW5wdXQoKSBsYWJlbFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgYXJpYS1sYWJlbCBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogVXNlZCB0byBzZXQgdGhlIGFyaWEtbGFiZWxsZWRieSBhdHRyaWJ1dGUgb24gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVzZWQgdG8gc2V0IHRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgdW5kZXJseWluZyBpbnB1dCBlbGVtZW50LiAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSBhcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgc2xpZGUtdG9nZ2xlIGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWUpIHsgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlLXRvZ2dsZSBlbGVtZW50IGlzIGNoZWNrZWQgb3Igbm90LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7IH1cbiAgc2V0IGNoZWNrZWQodmFsdWUpIHtcbiAgICB0aGlzLl9jaGVja2VkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICAvKiogQW4gZXZlbnQgd2lsbCBiZSBkaXNwYXRjaGVkIGVhY2ggdGltZSB0aGUgc2xpZGUtdG9nZ2xlIGNoYW5nZXMgaXRzIHZhbHVlLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2xpZGVUb2dnbGVDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2xpZGVUb2dnbGVDaGFuZ2U+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IHdpbGwgYmUgZGlzcGF0Y2hlZCBlYWNoIHRpbWUgdGhlIHNsaWRlLXRvZ2dsZSBpbnB1dCBpcyB0b2dnbGVkLlxuICAgKiBUaGlzIGV2ZW50IGlzIGFsd2F5cyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgdG9nZ2xlcyB0aGUgc2xpZGUgdG9nZ2xlLCBidXQgdGhpcyBkb2VzIG5vdCBtZWFuXG4gICAqIHRoZSBzbGlkZSB0b2dnbGUncyB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB0b2dnbGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogUmV0dXJucyB0aGUgdW5pcXVlIGlkIGZvciB0aGUgdmlzdWFsIGhpZGRlbiBpbnB1dC4gKi9cbiAgZ2V0IGlucHV0SWQoKTogc3RyaW5nIHsgcmV0dXJuIGAke3RoaXMuaWQgfHwgdGhpcy5fdW5pcXVlSWR9LWlucHV0YDsgfVxuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHVuZGVybHlpbmcgaW5wdXQgZWxlbWVudC4gKi9cbiAgQFZpZXdDaGlsZCgnaW5wdXQnKSBfaW5wdXRFbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfU0xJREVfVE9HR0xFX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgICAgIHB1YmxpYyBkZWZhdWx0czogTWF0U2xpZGVUb2dnbGVEZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG4gICAgdGhpcy5jb2xvciA9IHRoaXMuZGVmYXVsdENvbG9yID0gZGVmYXVsdHMuY29sb3IgfHwgJ2FjY2VudCc7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvclxuICAgICAgLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICAvLyBPbmx5IGZvcndhcmQgZm9jdXMgbWFudWFsbHkgd2hlbiBpdCB3YXMgcmVjZWl2ZWQgcHJvZ3JhbW1hdGljYWxseSBvciB0aHJvdWdoIHRoZVxuICAgICAgICAvLyBrZXlib2FyZC4gV2Ugc2hvdWxkIG5vdCBkbyB0aGlzIGZvciBtb3VzZS90b3VjaCBmb2N1cyBmb3IgdHdvIHJlYXNvbnM6XG4gICAgICAgIC8vIDEuIEl0IGNhbiBwcmV2ZW50IGNsaWNrcyBmcm9tIGxhbmRpbmcgaW4gQ2hyb21lIChzZWUgIzE4MjY5KS5cbiAgICAgICAgLy8gMi4gVGhleSdyZSBhbHJlYWR5IGhhbmRsZWQgYnkgdGhlIHdyYXBwaW5nIGBsYWJlbGAgZWxlbWVudC5cbiAgICAgICAgaWYgKGZvY3VzT3JpZ2luID09PSAna2V5Ym9hcmQnIHx8IGZvY3VzT3JpZ2luID09PSAncHJvZ3JhbScpIHtcbiAgICAgICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICB9IGVsc2UgaWYgKCFmb2N1c09yaWdpbikge1xuICAgICAgICAgIC8vIFdoZW4gYSBmb2N1c2VkIGVsZW1lbnQgYmVjb21lcyBkaXNhYmxlZCwgdGhlIGJyb3dzZXIgKmltbWVkaWF0ZWx5KiBmaXJlcyBhIGJsdXIgZXZlbnQuXG4gICAgICAgICAgLy8gQW5ndWxhciBkb2VzIG5vdCBleHBlY3QgZXZlbnRzIHRvIGJlIHJhaXNlZCBkdXJpbmcgY2hhbmdlIGRldGVjdGlvbiwgc28gYW55IHN0YXRlXG4gICAgICAgICAgLy8gY2hhbmdlIChzdWNoIGFzIGEgZm9ybSBjb250cm9sJ3MgJ25nLXRvdWNoZWQnKSB3aWxsIGNhdXNlIGEgY2hhbmdlZC1hZnRlci1jaGVja2VkXG4gICAgICAgICAgLy8gZXJyb3IuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNzc5My4gVG8gd29yayBhcm91bmQgdGhpcyxcbiAgICAgICAgICAvLyB3ZSBkZWZlciB0ZWxsaW5nIHRoZSBmb3JtIGNvbnRyb2wgaXQgaGFzIGJlZW4gdG91Y2hlZCB1bnRpbCB0aGUgbmV4dCB0aWNrLlxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fb25Ub3VjaGVkKCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVtaXRzIGEgY2hhbmdlIGV2ZW50LiAqL1xuICBfb25DaGFuZ2VFdmVudChldmVudDogRXZlbnQpIHtcbiAgICAvLyBXZSBhbHdheXMgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIG9uIHRoZSBjaGFuZ2UgZXZlbnQuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBjaGFuZ2UgZXZlbnQsIGZyb20gdGhlIGlucHV0IGVsZW1lbnQsIHdpbGwgYnViYmxlIHVwIGFuZFxuICAgIC8vIGVtaXQgaXRzIGV2ZW50IG9iamVjdCB0byB0aGUgY29tcG9uZW50J3MgYGNoYW5nZWAgb3V0cHV0LlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMudG9nZ2xlQ2hhbmdlLmVtaXQoKTtcblxuICAgIC8vIFdoZW4gdGhlIHNsaWRlIHRvZ2dsZSdzIGNvbmZpZyBkaXNhYmxlcyB0b2dnbGUgY2hhbmdlIGV2ZW50IGJ5IHNldHRpbmdcbiAgICAvLyBgZGlzYWJsZVRvZ2dsZVZhbHVlOiB0cnVlYCwgdGhlIHNsaWRlIHRvZ2dsZSdzIHZhbHVlIGRvZXMgbm90IGNoYW5nZSwgYW5kIHRoZVxuICAgIC8vIGNoZWNrZWQgc3RhdGUgb2YgdGhlIHVuZGVybHlpbmcgaW5wdXQgbmVlZHMgdG8gYmUgY2hhbmdlZCBiYWNrLlxuICAgIGlmICh0aGlzLmRlZmF1bHRzLmRpc2FibGVUb2dnbGVWYWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTeW5jIHRoZSB2YWx1ZSBmcm9tIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQgd2l0aCB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmNoZWNrZWQ7XG5cbiAgICAvLyBFbWl0IG91ciBjdXN0b20gY2hhbmdlIGV2ZW50IG9ubHkgaWYgdGhlIHVuZGVybHlpbmcgaW5wdXQgZW1pdHRlZCBvbmUuIFRoaXMgZW5zdXJlcyB0aGF0XG4gICAgLy8gdGhlcmUgaXMgbm8gY2hhbmdlIGV2ZW50LCB3aGVuIHRoZSBjaGVja2VkIHN0YXRlIGNoYW5nZXMgcHJvZ3JhbW1hdGljYWxseS5cbiAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSBzbGlkZS10b2dnbGUgaGFzIGJlZW4gY2xpY2tlZC4gKi9cbiAgX29uSW5wdXRDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAvLyBXZSBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gZm9yIGNsaWNrIGV2ZW50cyBvbiB0aGUgdmlzdWFsIGhpZGRlbiBpbnB1dCBlbGVtZW50LlxuICAgIC8vIEJ5IGRlZmF1bHQsIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGxhYmVsIGVsZW1lbnQsIGEgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IHdpbGwgYmVcbiAgICAvLyBkaXNwYXRjaGVkIG9uIHRoZSBhc3NvY2lhdGVkIGlucHV0IGVsZW1lbnQuIFNpbmNlIHdlIGFyZSB1c2luZyBhIGxhYmVsIGVsZW1lbnQgYXMgb3VyXG4gICAgLy8gcm9vdCBjb250YWluZXIsIHRoZSBjbGljayBldmVudCBvbiB0aGUgYHNsaWRlLXRvZ2dsZWAgd2lsbCBiZSBleGVjdXRlZCB0d2ljZS5cbiAgICAvLyBUaGUgcmVhbCBjbGljayBldmVudCB3aWxsIGJ1YmJsZSB1cCwgYW5kIHRoZSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgYWxzbyB0cmllcyB0byBidWJibGUgdXAuXG4gICAgLy8gVGhpcyB3aWxsIGxlYWQgdG8gbXVsdGlwbGUgY2xpY2sgZXZlbnRzLlxuICAgIC8vIFByZXZlbnRpbmcgYnViYmxpbmcgZm9yIHRoZSBzZWNvbmQgZXZlbnQgd2lsbCBzb2x2ZSB0aGF0IGlzc3VlLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgLyoqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tlZCA9ICEhdmFsdWU7XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci4gKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKiogSW1wbGVtZW50ZWQgYXMgYSBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLiAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzbGlkZS10b2dnbGUuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMsIG9yaWdpbj86IEZvY3VzT3JpZ2luKTogdm9pZCB7XG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgdGhpcy5fZm9jdXNNb25pdG9yLmZvY3VzVmlhKHRoaXMuX2lucHV0RWxlbWVudCwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIHNsaWRlLXRvZ2dsZS4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tlZCA9ICF0aGlzLmNoZWNrZWQ7XG4gICAgdGhpcy5fb25DaGFuZ2UodGhpcy5jaGVja2VkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGNoYW5nZSBldmVudCBvbiB0aGUgYGNoYW5nZWAgb3V0cHV0LiBBbHNvIG5vdGlmaWVzIHRoZSBGb3JtQ29udHJvbCBhYm91dCB0aGUgY2hhbmdlLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW1pdENoYW5nZUV2ZW50KCkge1xuICAgIHRoaXMuX29uQ2hhbmdlKHRoaXMuY2hlY2tlZCk7XG4gICAgdGhpcy5jaGFuZ2UuZW1pdChuZXcgTWF0U2xpZGVUb2dnbGVDaGFuZ2UodGhpcywgdGhpcy5jaGVja2VkKSk7XG4gIH1cblxuICAvKiogTWV0aG9kIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgbGFiZWwgdGV4dCBjaGFuZ2VzLiAqL1xuICBfb25MYWJlbFRleHRDaGFuZ2UoKSB7XG4gICAgLy8gU2luY2UgdGhlIGV2ZW50IG9mIHRoZSBgY2RrT2JzZXJ2ZUNvbnRlbnRgIGRpcmVjdGl2ZSBydW5zIG91dHNpZGUgb2YgdGhlIHpvbmUsIHRoZVxuICAgIC8vIHNsaWRlLXRvZ2dsZSBjb21wb25lbnQgd2lsbCBiZSBvbmx5IG1hcmtlZCBmb3IgY2hlY2ssIGJ1dCBubyBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zXG4gICAgLy8gYXV0b21hdGljYWxseS4gSW5zdGVhZCBvZiBnb2luZyBiYWNrIGludG8gdGhlIHpvbmUgaW4gb3JkZXIgdG8gdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAvLyB3aGljaCBjYXVzZXMgKmFsbCogY29tcG9uZW50cyB0byBiZSBjaGVja2VkIChpZiBleHBsaWNpdGx5IG1hcmtlZCBvciBub3QgdXNpbmcgT25QdXNoKSxcbiAgICAvLyB3ZSBvbmx5IHRyaWdnZXIgYW4gZXhwbGljaXQgY2hhbmdlIGRldGVjdGlvbiBmb3IgdGhlIHNsaWRlLXRvZ2dsZSB2aWV3IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jaGVja2VkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuIl19