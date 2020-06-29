/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Input, Optional, Output, QueryList, ViewChild, ViewEncapsulation, InjectionToken, Inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisableRipple, } from '@angular/material/core';
/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 */
export const MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken('MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS');
/**
 * Injection token that can be used to reference instances of `MatButtonToggleGroup`.
 * It serves as alternative token to the actual `MatButtonToggleGroup` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const MAT_BUTTON_TOGGLE_GROUP = new InjectionToken('MatButtonToggleGroup');
/**
 * Provider Expression that allows mat-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatButtonToggleGroup),
    multi: true
};
let _uniqueIdCounter = 0;
/** Change event object emitted by MatButtonToggle. */
export class MatButtonToggleChange {
    constructor(
    /** The MatButtonToggle that emits the event. */
    source, 
    /** The value assigned to the MatButtonToggle. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/** Exclusive selection button toggle group that behaves like a radio-button group. */
let MatButtonToggleGroup = /** @class */ (() => {
    class MatButtonToggleGroup {
        constructor(_changeDetector, defaultOptions) {
            this._changeDetector = _changeDetector;
            this._vertical = false;
            this._multiple = false;
            this._disabled = false;
            /**
             * The method to be called in order to update ngModel.
             * Now `ngModel` binding is not supported in multiple selection mode.
             */
            this._controlValueAccessorChangeFn = () => { };
            /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
            this._onTouched = () => { };
            this._name = `mat-button-toggle-group-${_uniqueIdCounter++}`;
            /**
             * Event that emits whenever the value of the group changes.
             * Used to facilitate two-way data binding.
             * @docs-private
             */
            this.valueChange = new EventEmitter();
            /** Event emitted when the group's value changes. */
            this.change = new EventEmitter();
            this.appearance =
                defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
        }
        /** `name` attribute for the underlying `input` element. */
        get name() { return this._name; }
        set name(value) {
            this._name = value;
            if (this._buttonToggles) {
                this._buttonToggles.forEach(toggle => {
                    toggle.name = this._name;
                    toggle._markForCheck();
                });
            }
        }
        /** Whether the toggle group is vertical. */
        get vertical() { return this._vertical; }
        set vertical(value) {
            this._vertical = coerceBooleanProperty(value);
        }
        /** Value of the toggle group. */
        get value() {
            const selected = this._selectionModel ? this._selectionModel.selected : [];
            if (this.multiple) {
                return selected.map(toggle => toggle.value);
            }
            return selected[0] ? selected[0].value : undefined;
        }
        set value(newValue) {
            this._setSelectionByValue(newValue);
            this.valueChange.emit(this.value);
        }
        /** Selected button toggles in the group. */
        get selected() {
            const selected = this._selectionModel ? this._selectionModel.selected : [];
            return this.multiple ? selected : (selected[0] || null);
        }
        /** Whether multiple button toggles can be selected. */
        get multiple() { return this._multiple; }
        set multiple(value) {
            this._multiple = coerceBooleanProperty(value);
        }
        /** Whether multiple button toggle group is disabled. */
        get disabled() { return this._disabled; }
        set disabled(value) {
            this._disabled = coerceBooleanProperty(value);
            if (this._buttonToggles) {
                this._buttonToggles.forEach(toggle => toggle._markForCheck());
            }
        }
        ngOnInit() {
            this._selectionModel = new SelectionModel(this.multiple, undefined, false);
        }
        ngAfterContentInit() {
            this._selectionModel.select(...this._buttonToggles.filter(toggle => toggle.checked));
        }
        /**
         * Sets the model value. Implemented as part of ControlValueAccessor.
         * @param value Value to be set to the model.
         */
        writeValue(value) {
            this.value = value;
            this._changeDetector.markForCheck();
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
        /** Dispatch change event with current selection and group value. */
        _emitChangeEvent() {
            const selected = this.selected;
            const source = Array.isArray(selected) ? selected[selected.length - 1] : selected;
            const event = new MatButtonToggleChange(source, this.value);
            this._controlValueAccessorChangeFn(event.value);
            this.change.emit(event);
        }
        /**
         * Syncs a button toggle's selected state with the model value.
         * @param toggle Toggle to be synced.
         * @param select Whether the toggle should be selected.
         * @param isUserInput Whether the change was a result of a user interaction.
         * @param deferEvents Whether to defer emitting the change events.
         */
        _syncButtonToggle(toggle, select, isUserInput = false, deferEvents = false) {
            // Deselect the currently-selected toggle, if we're in single-selection
            // mode and the button being toggled isn't selected at the moment.
            if (!this.multiple && this.selected && !toggle.checked) {
                this.selected.checked = false;
            }
            if (this._selectionModel) {
                if (select) {
                    this._selectionModel.select(toggle);
                }
                else {
                    this._selectionModel.deselect(toggle);
                }
            }
            else {
                deferEvents = true;
            }
            // We need to defer in some cases in order to avoid "changed after checked errors", however
            // the side-effect is that we may end up updating the model value out of sequence in others
            // The `deferEvents` flag allows us to decide whether to do it on a case-by-case basis.
            if (deferEvents) {
                Promise.resolve().then(() => this._updateModelValue(isUserInput));
            }
            else {
                this._updateModelValue(isUserInput);
            }
        }
        /** Checks whether a button toggle is selected. */
        _isSelected(toggle) {
            return this._selectionModel && this._selectionModel.isSelected(toggle);
        }
        /** Determines whether a button toggle should be checked on init. */
        _isPrechecked(toggle) {
            if (typeof this._rawValue === 'undefined') {
                return false;
            }
            if (this.multiple && Array.isArray(this._rawValue)) {
                return this._rawValue.some(value => toggle.value != null && value === toggle.value);
            }
            return toggle.value === this._rawValue;
        }
        /** Updates the selection state of the toggles in the group based on a value. */
        _setSelectionByValue(value) {
            this._rawValue = value;
            if (!this._buttonToggles) {
                return;
            }
            if (this.multiple && value) {
                if (!Array.isArray(value)) {
                    throw Error('Value must be an array in multiple-selection mode.');
                }
                this._clearSelection();
                value.forEach((currentValue) => this._selectValue(currentValue));
            }
            else {
                this._clearSelection();
                this._selectValue(value);
            }
        }
        /** Clears the selected toggles. */
        _clearSelection() {
            this._selectionModel.clear();
            this._buttonToggles.forEach(toggle => toggle.checked = false);
        }
        /** Selects a value if there's a toggle that corresponds to it. */
        _selectValue(value) {
            const correspondingOption = this._buttonToggles.find(toggle => {
                return toggle.value != null && toggle.value === value;
            });
            if (correspondingOption) {
                correspondingOption.checked = true;
                this._selectionModel.select(correspondingOption);
            }
        }
        /** Syncs up the group's value with the model and emits the change event. */
        _updateModelValue(isUserInput) {
            // Only emit the change event for user input.
            if (isUserInput) {
                this._emitChangeEvent();
            }
            // Note: we emit this one no matter whether it was a user interaction, because
            // it is used by Angular to sync up the two-way data binding.
            this.valueChange.emit(this.value);
        }
    }
    MatButtonToggleGroup.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-button-toggle-group',
                    providers: [
                        MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
                        { provide: MAT_BUTTON_TOGGLE_GROUP, useExisting: MatButtonToggleGroup },
                    ],
                    host: {
                        'role': 'group',
                        'class': 'mat-button-toggle-group',
                        '[attr.aria-disabled]': 'disabled',
                        '[class.mat-button-toggle-vertical]': 'vertical',
                        '[class.mat-button-toggle-group-appearance-standard]': 'appearance === "standard"',
                    },
                    exportAs: 'matButtonToggleGroup',
                },] }
    ];
    MatButtonToggleGroup.ctorParameters = () => [
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
    ];
    MatButtonToggleGroup.propDecorators = {
        _buttonToggles: [{ type: ContentChildren, args: [forwardRef(() => MatButtonToggle), {
                        // Note that this would technically pick up toggles
                        // from nested groups, but that's not a case that we support.
                        descendants: true
                    },] }],
        appearance: [{ type: Input }],
        name: [{ type: Input }],
        vertical: [{ type: Input }],
        value: [{ type: Input }],
        valueChange: [{ type: Output }],
        multiple: [{ type: Input }],
        disabled: [{ type: Input }],
        change: [{ type: Output }]
    };
    return MatButtonToggleGroup;
})();
export { MatButtonToggleGroup };
// Boilerplate for applying mixins to the MatButtonToggle class.
/** @docs-private */
class MatButtonToggleBase {
}
const _MatButtonToggleMixinBase = mixinDisableRipple(MatButtonToggleBase);
/** Single button inside of a toggle group. */
let MatButtonToggle = /** @class */ (() => {
    class MatButtonToggle extends _MatButtonToggleMixinBase {
        constructor(toggleGroup, _changeDetectorRef, _elementRef, _focusMonitor, defaultTabIndex, defaultOptions) {
            super();
            this._changeDetectorRef = _changeDetectorRef;
            this._elementRef = _elementRef;
            this._focusMonitor = _focusMonitor;
            this._isSingleSelector = false;
            this._checked = false;
            /**
             * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
             */
            this.ariaLabelledby = null;
            this._disabled = false;
            /** Event emitted when the group value changes. */
            this.change = new EventEmitter();
            const parsedTabIndex = Number(defaultTabIndex);
            this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
            this.buttonToggleGroup = toggleGroup;
            this.appearance =
                defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
        }
        /** Unique ID for the underlying `button` element. */
        get buttonId() { return `${this.id}-button`; }
        /** The appearance style of the button. */
        get appearance() {
            return this.buttonToggleGroup ? this.buttonToggleGroup.appearance : this._appearance;
        }
        set appearance(value) {
            this._appearance = value;
        }
        /** Whether the button is checked. */
        get checked() {
            return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
        }
        set checked(value) {
            const newValue = coerceBooleanProperty(value);
            if (newValue !== this._checked) {
                this._checked = newValue;
                if (this.buttonToggleGroup) {
                    this.buttonToggleGroup._syncButtonToggle(this, this._checked);
                }
                this._changeDetectorRef.markForCheck();
            }
        }
        /** Whether the button is disabled. */
        get disabled() {
            return this._disabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
        }
        set disabled(value) { this._disabled = coerceBooleanProperty(value); }
        ngOnInit() {
            const group = this.buttonToggleGroup;
            this._isSingleSelector = group && !group.multiple;
            this.id = this.id || `mat-button-toggle-${_uniqueIdCounter++}`;
            if (this._isSingleSelector) {
                this.name = group.name;
            }
            if (group) {
                if (group._isPrechecked(this)) {
                    this.checked = true;
                }
                else if (group._isSelected(this) !== this._checked) {
                    // As as side effect of the circular dependency between the toggle group and the button,
                    // we may end up in a state where the button is supposed to be checked on init, but it
                    // isn't, because the checked value was assigned too early. This can happen when Ivy
                    // assigns the static input value before the `ngOnInit` has run.
                    group._syncButtonToggle(this, this._checked);
                }
            }
        }
        ngAfterViewInit() {
            this._focusMonitor.monitor(this._elementRef, true);
        }
        ngOnDestroy() {
            const group = this.buttonToggleGroup;
            this._focusMonitor.stopMonitoring(this._elementRef);
            // Remove the toggle from the selection once it's destroyed. Needs to happen
            // on the next tick in order to avoid "changed after checked" errors.
            if (group && group._isSelected(this)) {
                group._syncButtonToggle(this, false, false, true);
            }
        }
        /** Focuses the button. */
        focus(options) {
            this._buttonElement.nativeElement.focus(options);
        }
        /** Checks the button toggle due to an interaction with the underlying native button. */
        _onButtonClick() {
            const newChecked = this._isSingleSelector ? true : !this._checked;
            if (newChecked !== this._checked) {
                this._checked = newChecked;
                if (this.buttonToggleGroup) {
                    this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
                    this.buttonToggleGroup._onTouched();
                }
            }
            // Emit a change event when it's the single selector
            this.change.emit(new MatButtonToggleChange(this, this.value));
        }
        /**
         * Marks the button toggle as needing checking for change detection.
         * This method is exposed because the parent button toggle group will directly
         * update bound properties of the radio button.
         */
        _markForCheck() {
            // When the group value changes, the button will not be notified.
            // Use `markForCheck` to explicit update button toggle's status.
            this._changeDetectorRef.markForCheck();
        }
    }
    MatButtonToggle.decorators = [
        { type: Component, args: [{
                    selector: 'mat-button-toggle',
                    template: "<button #button class=\"mat-button-toggle-button mat-focus-indicator\"\n        type=\"button\"\n        [id]=\"buttonId\"\n        [attr.tabindex]=\"disabled ? -1 : tabIndex\"\n        [attr.aria-pressed]=\"checked\"\n        [disabled]=\"disabled || null\"\n        [attr.name]=\"name || null\"\n        [attr.aria-label]=\"ariaLabel\"\n        [attr.aria-labelledby]=\"ariaLabelledby\"\n        (click)=\"_onButtonClick()\">\n  <div class=\"mat-button-toggle-label-content\">\n    <ng-content></ng-content>\n  </div>\n</button>\n\n<div class=\"mat-button-toggle-focus-overlay\"></div>\n<div class=\"mat-button-toggle-ripple\" matRipple\n     [matRippleTrigger]=\"button\"\n     [matRippleDisabled]=\"this.disableRipple || this.disabled\">\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matButtonToggle',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disableRipple'],
                    host: {
                        '[class.mat-button-toggle-standalone]': '!buttonToggleGroup',
                        '[class.mat-button-toggle-checked]': 'checked',
                        '[class.mat-button-toggle-disabled]': 'disabled',
                        '[class.mat-button-toggle-appearance-standard]': 'appearance === "standard"',
                        'class': 'mat-button-toggle',
                        // Always reset the tabindex to -1 so it doesn't conflict with the one on the `button`,
                        // but can still receive focus from things like cdkFocusInitial.
                        '[attr.tabindex]': '-1',
                        '[attr.id]': 'id',
                        '[attr.name]': 'null',
                        '(focus)': 'focus()',
                    },
                    styles: [".mat-button-toggle-standalone,.mat-button-toggle-group{position:relative;display:inline-flex;flex-direction:row;white-space:nowrap;overflow:hidden;border-radius:2px;-webkit-tap-highlight-color:transparent}.cdk-high-contrast-active .mat-button-toggle-standalone,.cdk-high-contrast-active .mat-button-toggle-group{outline:solid 1px}.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.mat-button-toggle-group-appearance-standard{border-radius:4px}.cdk-high-contrast-active .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,.cdk-high-contrast-active .mat-button-toggle-group-appearance-standard{outline:0}.mat-button-toggle-vertical{flex-direction:column}.mat-button-toggle-vertical .mat-button-toggle-label-content{display:block}.mat-button-toggle{white-space:nowrap;position:relative}.mat-button-toggle .mat-icon svg{vertical-align:top}.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:1}.cdk-high-contrast-active .mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay{opacity:.5}.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{opacity:.04}.mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.12}.cdk-high-contrast-active .mat-button-toggle-appearance-standard.cdk-keyboard-focused:not(.mat-button-toggle-disabled) .mat-button-toggle-focus-overlay{opacity:.5}@media(hover: none){.mat-button-toggle-appearance-standard:not(.mat-button-toggle-disabled):hover .mat-button-toggle-focus-overlay{display:none}}.mat-button-toggle-label-content{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block;line-height:36px;padding:0 16px;position:relative}.mat-button-toggle-appearance-standard .mat-button-toggle-label-content{padding:0 12px}.mat-button-toggle-label-content>*{vertical-align:middle}.mat-button-toggle-focus-overlay{border-radius:inherit;pointer-events:none;opacity:0;top:0;left:0;right:0;bottom:0;position:absolute}.mat-button-toggle-checked .mat-button-toggle-focus-overlay{border-bottom:solid 36px}.cdk-high-contrast-active .mat-button-toggle-checked .mat-button-toggle-focus-overlay{opacity:.5;height:0}.cdk-high-contrast-active .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay{border-bottom:solid 500px}.mat-button-toggle .mat-button-toggle-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-button-toggle-button{border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;outline:none;width:100%;cursor:pointer}.mat-button-toggle-disabled .mat-button-toggle-button{cursor:default}.mat-button-toggle-button::-moz-focus-inner{border:0}\n"]
                },] }
    ];
    MatButtonToggle.ctorParameters = () => [
        { type: MatButtonToggleGroup, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BUTTON_TOGGLE_GROUP,] }] },
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: FocusMonitor },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS,] }] }
    ];
    MatButtonToggle.propDecorators = {
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
        _buttonElement: [{ type: ViewChild, args: ['button',] }],
        id: [{ type: Input }],
        name: [{ type: Input }],
        value: [{ type: Input }],
        tabIndex: [{ type: Input }],
        appearance: [{ type: Input }],
        checked: [{ type: Input }],
        disabled: [{ type: Input }],
        change: [{ type: Output }]
    };
    return MatButtonToggle;
})();
export { MatButtonToggle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLXRvZ2dsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9idXR0b24tdG9nZ2xlL2J1dHRvbi10b2dnbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsY0FBYyxFQUNkLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUVMLGtCQUFrQixHQUVuQixNQUFNLHdCQUF3QixDQUFDO0FBb0JoQzs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxpQ0FBaUMsR0FDMUMsSUFBSSxjQUFjLENBQWdDLG1DQUFtQyxDQUFDLENBQUM7QUFFM0Y7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUNoQyxJQUFJLGNBQWMsQ0FBdUIsc0JBQXNCLENBQUMsQ0FBQztBQUVyRTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0NBQXNDLEdBQVE7SUFDekQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0lBQ25ELEtBQUssRUFBRSxJ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QUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsMnZCQUFpQztvQkFFakMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQ3pCLElBQUksRUFBRTt3QkFDSixzQ0FBc0MsRUFBRSxvQkFBb0I7d0JBQzVELG1DQUFtQyxFQUFFLFNBQVM7d0JBQzlDLG9DQUFvQyxFQUFFLFVBQVU7d0JBQ2hELCtDQUErQyxFQUFFLDJCQUEyQjt3QkFDNUUsT0FBTyxFQUFFLG1CQUFtQjt3QkFDNUIsdUZBQXVGO3dCQUN2RixnRUFBZ0U7d0JBQ2hFLGlCQUFpQixFQUFFLElBQUk7d0JBQ3ZCLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixhQUFhLEVBQUUsTUFBTTt3QkFDckIsU0FBUyxFQUFFLFNBQVM7cUJBQ3JCOztpQkFDRjs7O2dCQStFdUUsb0JBQW9CLHVCQUE3RSxRQUFRLFlBQUksTUFBTSxTQUFDLHVCQUF1QjtnQkF4ZHZELGlCQUFpQjtnQkFJakIsVUFBVTtnQkFYSixZQUFZOzZDQW1lTCxTQUFTLFNBQUMsVUFBVTtnREFDcEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQ0FBaUM7Ozs0QkF6RWhFLEtBQUssU0FBQyxZQUFZO2lDQUtsQixLQUFLLFNBQUMsaUJBQWlCO2lDQUV2QixTQUFTLFNBQUMsUUFBUTtxQkFTbEIsS0FBSzt1QkFHTCxLQUFLO3dCQUdMLEtBQUs7MkJBR0wsS0FBSzs2QkFHTCxLQUFLOzBCQVVMLEtBQUs7MkJBbUJMLEtBQUs7eUJBUUwsTUFBTTs7SUE2RlQsc0JBQUM7S0FBQTtTQXhLWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNNb25pdG9yfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuXG4vKipcbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciB1c2VkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAqL1xuZXhwb3J0IHR5cGUgVG9nZ2xlVHlwZSA9ICdjaGVja2JveCcgfCAncmFkaW8nO1xuXG4vKiogUG9zc2libGUgYXBwZWFyYW5jZSBzdHlsZXMgZm9yIHRoZSBidXR0b24gdG9nZ2xlLiAqL1xuZXhwb3J0IHR5cGUgTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZSA9ICdsZWdhY3knIHwgJ3N0YW5kYXJkJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBidXR0b24gdG9nZ2xlIHRoYXQgY2FuIGJlIGNvbmZpZ3VyZWRcbiAqIHVzaW5nIHRoZSBgTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TYCBpbmplY3Rpb24gdG9rZW4uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnMge1xuICBhcHBlYXJhbmNlPzogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZTtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlXG4gKiBkZWZhdWx0IG9wdGlvbnMgZm9yIGFsbCBidXR0b24gdG9nZ2xlcyB3aXRoaW4gYW4gYXBwLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QnV0dG9uVG9nZ2xlRGVmYXVsdE9wdGlvbnM+KCdNQVRfQlVUVE9OX1RPR0dMRV9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRCdXR0b25Ub2dnbGVHcm91cGAuXG4gKiBJdCBzZXJ2ZXMgYXMgYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0QnV0dG9uVG9nZ2xlR3JvdXBgIGNsYXNzIHdoaWNoXG4gKiBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeSByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgY29tcG9uZW50IG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVAgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRCdXR0b25Ub2dnbGVHcm91cD4oJ01hdEJ1dHRvblRvZ2dsZUdyb3VwJyk7XG5cbi8qKlxuICogUHJvdmlkZXIgRXhwcmVzc2lvbiB0aGF0IGFsbG93cyBtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cCB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogVGhpcyBhbGxvd3MgaXQgdG8gc3VwcG9ydCBbKG5nTW9kZWwpXS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fVE9HR0xFX0dST1VQX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRCdXR0b25Ub2dnbGVHcm91cCksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5sZXQgX3VuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgTWF0QnV0dG9uVG9nZ2xlLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBUaGUgTWF0QnV0dG9uVG9nZ2xlIHRoYXQgZW1pdHMgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdEJ1dHRvblRvZ2dsZSxcblxuICAgIC8qKiBUaGUgdmFsdWUgYXNzaWduZWQgdG8gdGhlIE1hdEJ1dHRvblRvZ2dsZS4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkge31cbn1cblxuLyoqIEV4Y2x1c2l2ZSBzZWxlY3Rpb24gYnV0dG9uIHRvZ2dsZSBncm91cCB0aGF0IGJlaGF2ZXMgbGlrZSBhIHJhZGlvLWJ1dHRvbiBncm91cC4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1idXR0b24tdG9nZ2xlLWdyb3VwJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVBfVkFMVUVfQUNDRVNTT1IsXG4gICAge3Byb3ZpZGU6IE1BVF9CVVRUT05fVE9HR0xFX0dST1VQLCB1c2VFeGlzdGluZzogTWF0QnV0dG9uVG9nZ2xlR3JvdXB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnZ3JvdXAnLFxuICAgICdjbGFzcyc6ICdtYXQtYnV0dG9uLXRvZ2dsZS1ncm91cCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLXZlcnRpY2FsXSc6ICd2ZXJ0aWNhbCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1ncm91cC1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09PSBcInN0YW5kYXJkXCInLFxuICB9LFxuICBleHBvcnRBczogJ21hdEJ1dHRvblRvZ2dsZUdyb3VwJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uVG9nZ2xlR3JvdXAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0IHtcbiAgcHJpdmF0ZSBfdmVydGljYWwgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbXVsdGlwbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc2VsZWN0aW9uTW9kZWw6IFNlbGVjdGlvbk1vZGVsPE1hdEJ1dHRvblRvZ2dsZT47XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgcmF3IHZhbHVlIHRoYXQgdGhlIGNvbnN1bWVyIHRyaWVkIHRvIGFzc2lnbi4gVGhlIHJlYWxcbiAgICogdmFsdWUgd2lsbCBleGNsdWRlIGFueSB2YWx1ZXMgZnJvbSB0aGlzIG9uZSB0aGF0IGRvbid0IGNvcnJlc3BvbmQgdG8gYVxuICAgKiB0b2dnbGUuIFVzZWZ1bCBmb3IgdGhlIGNhc2VzIHdoZXJlIHRoZSB2YWx1ZSBpcyBhc3NpZ25lZCBiZWZvcmUgdGhlIHRvZ2dsZXNcbiAgICogaGF2ZSBiZWVuIGluaXRpYWxpemVkIG9yIGF0IHRoZSBzYW1lIHRoYXQgdGhleSdyZSBiZWluZyBzd2FwcGVkIG91dC5cbiAgICovXG4gIHByaXZhdGUgX3Jhd1ZhbHVlOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdG8gYmUgY2FsbGVkIGluIG9yZGVyIHRvIHVwZGF0ZSBuZ01vZGVsLlxuICAgKiBOb3cgYG5nTW9kZWxgIGJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCBpbiBtdWx0aXBsZSBzZWxlY3Rpb24gbW9kZS5cbiAgICovXG4gIF9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBvblRvdWNoIGZ1bmN0aW9uIHJlZ2lzdGVyZWQgdmlhIHJlZ2lzdGVyT25Ub3VjaCAoQ29udHJvbFZhbHVlQWNjZXNzb3IpLiAqL1xuICBfb25Ub3VjaGVkOiAoKSA9PiBhbnkgPSAoKSA9PiB7fTtcblxuICAvKiogQ2hpbGQgYnV0dG9uIHRvZ2dsZSBidXR0b25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTWF0QnV0dG9uVG9nZ2xlKSwge1xuICAgIC8vIE5vdGUgdGhhdCB0aGlzIHdvdWxkIHRlY2huaWNhbGx5IHBpY2sgdXAgdG9nZ2xlc1xuICAgIC8vIGZyb20gbmVzdGVkIGdyb3VwcywgYnV0IHRoYXQncyBub3QgYSBjYXNlIHRoYXQgd2Ugc3VwcG9ydC5cbiAgICBkZXNjZW5kYW50czogdHJ1ZVxuICB9KSBfYnV0dG9uVG9nZ2xlczogUXVlcnlMaXN0PE1hdEJ1dHRvblRvZ2dsZT47XG5cbiAgLyoqIFRoZSBhcHBlYXJhbmNlIGZvciBhbGwgdGhlIGJ1dHRvbnMgaW4gdGhlIGdyb3VwLiAqL1xuICBASW5wdXQoKSBhcHBlYXJhbmNlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlO1xuXG4gIC8qKiBgbmFtZWAgYXR0cmlidXRlIGZvciB0aGUgdW5kZXJseWluZyBgaW5wdXRgIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9uYW1lOyB9XG4gIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9uYW1lID0gdmFsdWU7XG5cbiAgICBpZiAodGhpcy5fYnV0dG9uVG9nZ2xlcykge1xuICAgICAgdGhpcy5fYnV0dG9uVG9nZ2xlcy5mb3JFYWNoKHRvZ2dsZSA9PiB7XG4gICAgICAgIHRvZ2dsZS5uYW1lID0gdGhpcy5fbmFtZTtcbiAgICAgICAgdG9nZ2xlLl9tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9uYW1lID0gYG1hdC1idXR0b24tdG9nZ2xlLWdyb3VwLSR7X3VuaXF1ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBncm91cCBpcyB2ZXJ0aWNhbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdmVydGljYWw7IH1cbiAgc2V0IHZlcnRpY2FsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdmVydGljYWwgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSB0b2dnbGUgZ3JvdXAuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IFtdO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHJldHVybiBzZWxlY3RlZC5tYXAodG9nZ2xlID0+IHRvZ2dsZS52YWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGVjdGVkWzBdID8gc2VsZWN0ZWRbMF0udmFsdWUgOiB1bmRlZmluZWQ7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKG5ld1ZhbHVlKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgdmFsdWUgb2YgdGhlIGdyb3VwIGNoYW5nZXMuXG4gICAqIFVzZWQgdG8gZmFjaWxpdGF0ZSB0d28td2F5IGRhdGEgYmluZGluZy5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqIFNlbGVjdGVkIGJ1dHRvbiB0b2dnbGVzIGluIHRoZSBncm91cC4gKi9cbiAgZ2V0IHNlbGVjdGVkKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IFtdO1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gc2VsZWN0ZWQgOiAoc2VsZWN0ZWRbMF0gfHwgbnVsbCk7XG4gIH1cblxuICAvKiogV2hldGhlciBtdWx0aXBsZSBidXR0b24gdG9nZ2xlcyBjYW4gYmUgc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX211bHRpcGxlOyB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG11bHRpcGxlIGJ1dHRvbiB0b2dnbGUgZ3JvdXAgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmICh0aGlzLl9idXR0b25Ub2dnbGVzKSB7XG4gICAgICB0aGlzLl9idXR0b25Ub2dnbGVzLmZvckVhY2godG9nZ2xlID0+IHRvZ2dsZS5fbWFya0ZvckNoZWNrKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGdyb3VwJ3MgdmFsdWUgY2hhbmdlcy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNoYW5nZTogRXZlbnRFbWl0dGVyPE1hdEJ1dHRvblRvZ2dsZUNoYW5nZT4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TKVxuICAgICAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEJ1dHRvblRvZ2dsZURlZmF1bHRPcHRpb25zKSB7XG5cbiAgICAgIHRoaXMuYXBwZWFyYW5jZSA9XG4gICAgICAgICAgZGVmYXVsdE9wdGlvbnMgJiYgZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA/IGRlZmF1bHRPcHRpb25zLmFwcGVhcmFuY2UgOiAnc3RhbmRhcmQnO1xuICAgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRCdXR0b25Ub2dnbGU+KHRoaXMubXVsdGlwbGUsIHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdCguLi50aGlzLl9idXR0b25Ub2dnbGVzLmZpbHRlcih0b2dnbGUgPT4gdG9nZ2xlLmNoZWNrZWQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBtb2RlbCB2YWx1ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgICogQHBhcmFtIHZhbHVlIFZhbHVlIHRvIGJlIHNldCB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMuX2NvbnRyb2xWYWx1ZUFjY2Vzc29yQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgLyoqIERpc3BhdGNoIGNoYW5nZSBldmVudCB3aXRoIGN1cnJlbnQgc2VsZWN0aW9uIGFuZCBncm91cCB2YWx1ZS4gKi9cbiAgX2VtaXRDaGFuZ2VFdmVudCgpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgY29uc3Qgc291cmNlID0gQXJyYXkuaXNBcnJheShzZWxlY3RlZCkgPyBzZWxlY3RlZFtzZWxlY3RlZC5sZW5ndGggLSAxXSA6IHNlbGVjdGVkO1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZShzb3VyY2UhLCB0aGlzLnZhbHVlKTtcbiAgICB0aGlzLl9jb250cm9sVmFsdWVBY2Nlc3NvckNoYW5nZUZuKGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTeW5jcyBhIGJ1dHRvbiB0b2dnbGUncyBzZWxlY3RlZCBzdGF0ZSB3aXRoIHRoZSBtb2RlbCB2YWx1ZS5cbiAgICogQHBhcmFtIHRvZ2dsZSBUb2dnbGUgdG8gYmUgc3luY2VkLlxuICAgKiBAcGFyYW0gc2VsZWN0IFdoZXRoZXIgdGhlIHRvZ2dsZSBzaG91bGQgYmUgc2VsZWN0ZWQuXG4gICAqIEBwYXJhbSBpc1VzZXJJbnB1dCBXaGV0aGVyIHRoZSBjaGFuZ2Ugd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBpbnRlcmFjdGlvbi5cbiAgICogQHBhcmFtIGRlZmVyRXZlbnRzIFdoZXRoZXIgdG8gZGVmZXIgZW1pdHRpbmcgdGhlIGNoYW5nZSBldmVudHMuXG4gICAqL1xuICBfc3luY0J1dHRvblRvZ2dsZSh0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICBpc1VzZXJJbnB1dCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkZWZlckV2ZW50cyA9IGZhbHNlKSB7XG4gICAgLy8gRGVzZWxlY3QgdGhlIGN1cnJlbnRseS1zZWxlY3RlZCB0b2dnbGUsIGlmIHdlJ3JlIGluIHNpbmdsZS1zZWxlY3Rpb25cbiAgICAvLyBtb2RlIGFuZCB0aGUgYnV0dG9uIGJlaW5nIHRvZ2dsZWQgaXNuJ3Qgc2VsZWN0ZWQgYXQgdGhlIG1vbWVudC5cbiAgICBpZiAoIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5zZWxlY3RlZCAmJiAhdG9nZ2xlLmNoZWNrZWQpIHtcbiAgICAgICh0aGlzLnNlbGVjdGVkIGFzIE1hdEJ1dHRvblRvZ2dsZSkuY2hlY2tlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xuICAgICAgaWYgKHNlbGVjdCkge1xuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QodG9nZ2xlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmRlc2VsZWN0KHRvZ2dsZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVyRXZlbnRzID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRlZmVyIGluIHNvbWUgY2FzZXMgaW4gb3JkZXIgdG8gYXZvaWQgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWQgZXJyb3JzXCIsIGhvd2V2ZXJcbiAgICAvLyB0aGUgc2lkZS1lZmZlY3QgaXMgdGhhdCB3ZSBtYXkgZW5kIHVwIHVwZGF0aW5nIHRoZSBtb2RlbCB2YWx1ZSBvdXQgb2Ygc2VxdWVuY2UgaW4gb3RoZXJzXG4gICAgLy8gVGhlIGBkZWZlckV2ZW50c2AgZmxhZyBhbGxvd3MgdXMgdG8gZGVjaWRlIHdoZXRoZXIgdG8gZG8gaXQgb24gYSBjYXNlLWJ5LWNhc2UgYmFzaXMuXG4gICAgaWYgKGRlZmVyRXZlbnRzKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX3VwZGF0ZU1vZGVsVmFsdWUoaXNVc2VySW5wdXQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlTW9kZWxWYWx1ZShpc1VzZXJJbnB1dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEgYnV0dG9uIHRvZ2dsZSBpcyBzZWxlY3RlZC4gKi9cbiAgX2lzU2VsZWN0ZWQodG9nZ2xlOiBNYXRCdXR0b25Ub2dnbGUpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYgdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZCh0b2dnbGUpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIGJ1dHRvbiB0b2dnbGUgc2hvdWxkIGJlIGNoZWNrZWQgb24gaW5pdC4gKi9cbiAgX2lzUHJlY2hlY2tlZCh0b2dnbGU6IE1hdEJ1dHRvblRvZ2dsZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcmF3VmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheSh0aGlzLl9yYXdWYWx1ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yYXdWYWx1ZS5zb21lKHZhbHVlID0+IHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHZhbHVlID09PSB0b2dnbGUudmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB0b2dnbGUudmFsdWUgPT09IHRoaXMuX3Jhd1ZhbHVlO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgdG9nZ2xlcyBpbiB0aGUgZ3JvdXAgYmFzZWQgb24gYSB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfc2V0U2VsZWN0aW9uQnlWYWx1ZSh2YWx1ZTogYW55fGFueVtdKSB7XG4gICAgdGhpcy5fcmF3VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICghdGhpcy5fYnV0dG9uVG9nZ2xlcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm11bHRpcGxlICYmIHZhbHVlKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdWYWx1ZSBtdXN0IGJlIGFuIGFycmF5IGluIG11bHRpcGxlLXNlbGVjdGlvbiBtb2RlLicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHNlbGVjdGVkIHRvZ2dsZXMuICovXG4gIHByaXZhdGUgX2NsZWFyU2VsZWN0aW9uKCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgdGhpcy5fYnV0dG9uVG9nZ2xlcy5mb3JFYWNoKHRvZ2dsZSA9PiB0b2dnbGUuY2hlY2tlZCA9IGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIGEgdmFsdWUgaWYgdGhlcmUncyBhIHRvZ2dsZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGl0LiAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMuX2J1dHRvblRvZ2dsZXMuZmluZCh0b2dnbGUgPT4ge1xuICAgICAgcmV0dXJuIHRvZ2dsZS52YWx1ZSAhPSBudWxsICYmIHRvZ2dsZS52YWx1ZSA9PT0gdmFsdWU7XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgY29ycmVzcG9uZGluZ09wdGlvbi5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3luY3MgdXAgdGhlIGdyb3VwJ3MgdmFsdWUgd2l0aCB0aGUgbW9kZWwgYW5kIGVtaXRzIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gIHByaXZhdGUgX3VwZGF0ZU1vZGVsVmFsdWUoaXNVc2VySW5wdXQ6IGJvb2xlYW4pIHtcbiAgICAvLyBPbmx5IGVtaXQgdGhlIGNoYW5nZSBldmVudCBmb3IgdXNlciBpbnB1dC5cbiAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgIHRoaXMuX2VtaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIGVtaXQgdGhpcyBvbmUgbm8gbWF0dGVyIHdoZXRoZXIgaXQgd2FzIGEgdXNlciBpbnRlcmFjdGlvbiwgYmVjYXVzZVxuICAgIC8vIGl0IGlzIHVzZWQgYnkgQW5ndWxhciB0byBzeW5jIHVwIHRoZSB0d28td2F5IGRhdGEgYmluZGluZy5cbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92ZXJ0aWNhbDogQm9vbGVhbklucHV0O1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIHRoZSBNYXRCdXR0b25Ub2dnbGUgY2xhc3MuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0QnV0dG9uVG9nZ2xlQmFzZSB7fVxuY29uc3QgX01hdEJ1dHRvblRvZ2dsZU1peGluQmFzZTogQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJiB0eXBlb2YgTWF0QnV0dG9uVG9nZ2xlQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKE1hdEJ1dHRvblRvZ2dsZUJhc2UpO1xuXG4vKiogU2luZ2xlIGJ1dHRvbiBpbnNpZGUgb2YgYSB0b2dnbGUgZ3JvdXAuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYnV0dG9uLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnYnV0dG9uLXRvZ2dsZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2J1dHRvbi10b2dnbGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uVG9nZ2xlJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLXN0YW5kYWxvbmVdJzogJyFidXR0b25Ub2dnbGVHcm91cCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1jaGVja2VkXSc6ICdjaGVja2VkJyxcbiAgICAnW2NsYXNzLm1hdC1idXR0b24tdG9nZ2xlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtYnV0dG9uLXRvZ2dsZS1hcHBlYXJhbmNlLXN0YW5kYXJkXSc6ICdhcHBlYXJhbmNlID09PSBcInN0YW5kYXJkXCInLFxuICAgICdjbGFzcyc6ICdtYXQtYnV0dG9uLXRvZ2dsZScsXG4gICAgLy8gQWx3YXlzIHJlc2V0IHRoZSB0YWJpbmRleCB0byAtMSBzbyBpdCBkb2Vzbid0IGNvbmZsaWN0IHdpdGggdGhlIG9uZSBvbiB0aGUgYGJ1dHRvbmAsXG4gICAgLy8gYnV0IGNhbiBzdGlsbCByZWNlaXZlIGZvY3VzIGZyb20gdGhpbmdzIGxpa2UgY2RrRm9jdXNJbml0aWFsLlxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnLTEnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci5uYW1lXSc6ICdudWxsJyxcbiAgICAnKGZvY3VzKSc6ICdmb2N1cygpJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Ub2dnbGUgZXh0ZW5kcyBfTWF0QnV0dG9uVG9nZ2xlTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LFxuICBDYW5EaXNhYmxlUmlwcGxlLCBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgX2lzU2luZ2xlU2VsZWN0b3IgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfY2hlY2tlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBdHRhY2hlZCB0byB0aGUgYXJpYS1sYWJlbCBhdHRyaWJ1dGUgb2YgdGhlIGhvc3QgZWxlbWVudC4gSW4gbW9zdCBjYXNlcywgYXJpYS1sYWJlbGxlZGJ5IHdpbGxcbiAgICogdGFrZSBwcmVjZWRlbmNlIHNvIHRoaXMgbWF5IGJlIG9taXR0ZWQuXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKipcbiAgICogVXNlcnMgY2FuIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZSB3aGljaCB3aWxsIGJlIGZvcndhcmRlZCB0byB0aGUgaW5wdXQgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQFZpZXdDaGlsZCgnYnV0dG9uJykgX2J1dHRvbkVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEJ1dHRvbkVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgcGFyZW50IGJ1dHRvbiB0b2dnbGUgZ3JvdXAgKGV4Y2x1c2l2ZSBzZWxlY3Rpb24pLiBPcHRpb25hbC4gKi9cbiAgYnV0dG9uVG9nZ2xlR3JvdXA6IE1hdEJ1dHRvblRvZ2dsZUdyb3VwO1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSB1bmRlcmx5aW5nIGBidXR0b25gIGVsZW1lbnQuICovXG4gIGdldCBidXR0b25JZCgpOiBzdHJpbmcgeyByZXR1cm4gYCR7dGhpcy5pZH0tYnV0dG9uYDsgfVxuXG4gIC8qKiBUaGUgdW5pcXVlIElEIGZvciB0aGlzIGJ1dHRvbiB0b2dnbGUuICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgLyoqIEhUTUwncyAnbmFtZScgYXR0cmlidXRlIHVzZWQgdG8gZ3JvdXAgcmFkaW9zIGZvciB1bmlxdWUgc2VsZWN0aW9uLiAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqIE1hdEJ1dHRvblRvZ2dsZUdyb3VwIHJlYWRzIHRoaXMgdG8gYXNzaWduIGl0cyBvd24gdmFsdWUuICovXG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgLyoqIFRhYmluZGV4IGZvciB0aGUgdG9nZ2xlLiAqL1xuICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVGhlIGFwcGVhcmFuY2Ugc3R5bGUgb2YgdGhlIGJ1dHRvbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGFwcGVhcmFuY2UoKTogTWF0QnV0dG9uVG9nZ2xlQXBwZWFyYW5jZSB7XG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgPyB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLmFwcGVhcmFuY2UgOiB0aGlzLl9hcHBlYXJhbmNlO1xuICB9XG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBNYXRCdXR0b25Ub2dnbGVBcHBlYXJhbmNlKSB7XG4gICAgdGhpcy5fYXBwZWFyYW5jZSA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2FwcGVhcmFuY2U6IE1hdEJ1dHRvblRvZ2dsZUFwcGVhcmFuY2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBjaGVja2VkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5idXR0b25Ub2dnbGVHcm91cCA/IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuX2lzU2VsZWN0ZWQodGhpcykgOiB0aGlzLl9jaGVja2VkO1xuICB9XG4gIHNldCBjaGVja2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9jaGVja2VkKSB7XG4gICAgICB0aGlzLl9jaGVja2VkID0gbmV3VmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAuX3N5bmNCdXR0b25Ub2dnbGUodGhpcywgdGhpcy5fY2hlY2tlZCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBidXR0b24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgKHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgJiYgdGhpcy5idXR0b25Ub2dnbGVHcm91cC5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGdyb3VwIHZhbHVlIGNoYW5nZXMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRCdXR0b25Ub2dnbGVDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPigpO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfR1JPVVApIHRvZ2dsZUdyb3VwOiBNYXRCdXR0b25Ub2dnbGVHcm91cCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgZGVmYXVsdFRhYkluZGV4OiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0JVVFRPTl9UT0dHTEVfREVGQVVMVF9PUFRJT05TKVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnM/OiBNYXRCdXR0b25Ub2dnbGVEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBwYXJzZWRUYWJJbmRleCA9IE51bWJlcihkZWZhdWx0VGFiSW5kZXgpO1xuICAgIHRoaXMudGFiSW5kZXggPSAocGFyc2VkVGFiSW5kZXggfHwgcGFyc2VkVGFiSW5kZXggPT09IDApID8gcGFyc2VkVGFiSW5kZXggOiBudWxsO1xuICAgIHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXAgPSB0b2dnbGVHcm91cDtcbiAgICB0aGlzLmFwcGVhcmFuY2UgPVxuICAgICAgICBkZWZhdWx0T3B0aW9ucyAmJiBkZWZhdWx0T3B0aW9ucy5hcHBlYXJhbmNlID8gZGVmYXVsdE9wdGlvbnMuYXBwZWFyYW5jZSA6ICdzdGFuZGFyZCc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXA7XG4gICAgdGhpcy5faXNTaW5nbGVTZWxlY3RvciA9IGdyb3VwICYmICFncm91cC5tdWx0aXBsZTtcbiAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCBgbWF0LWJ1dHRvbi10b2dnbGUtJHtfdW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAgIGlmICh0aGlzLl9pc1NpbmdsZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLm5hbWUgPSBncm91cC5uYW1lO1xuICAgIH1cblxuICAgIGlmIChncm91cCkge1xuICAgICAgaWYgKGdyb3VwLl9pc1ByZWNoZWNrZWQodGhpcykpIHtcbiAgICAgICAgdGhpcy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykgIT09IHRoaXMuX2NoZWNrZWQpIHtcbiAgICAgICAgLy8gQXMgYXMgc2lkZSBlZmZlY3Qgb2YgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kgYmV0d2VlbiB0aGUgdG9nZ2xlIGdyb3VwIGFuZCB0aGUgYnV0dG9uLFxuICAgICAgICAvLyB3ZSBtYXkgZW5kIHVwIGluIGEgc3RhdGUgd2hlcmUgdGhlIGJ1dHRvbiBpcyBzdXBwb3NlZCB0byBiZSBjaGVja2VkIG9uIGluaXQsIGJ1dCBpdFxuICAgICAgICAvLyBpc24ndCwgYmVjYXVzZSB0aGUgY2hlY2tlZCB2YWx1ZSB3YXMgYXNzaWduZWQgdG9vIGVhcmx5LiBUaGlzIGNhbiBoYXBwZW4gd2hlbiBJdnlcbiAgICAgICAgLy8gYXNzaWducyB0aGUgc3RhdGljIGlucHV0IHZhbHVlIGJlZm9yZSB0aGUgYG5nT25Jbml0YCBoYXMgcnVuLlxuICAgICAgICBncm91cC5fc3luY0J1dHRvblRvZ2dsZSh0aGlzLCB0aGlzLl9jaGVja2VkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLm1vbml0b3IodGhpcy5fZWxlbWVudFJlZiwgdHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBncm91cCA9IHRoaXMuYnV0dG9uVG9nZ2xlR3JvdXA7XG5cbiAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG5cbiAgICAvLyBSZW1vdmUgdGhlIHRvZ2dsZSBmcm9tIHRoZSBzZWxlY3Rpb24gb25jZSBpdCdzIGRlc3Ryb3llZC4gTmVlZHMgdG8gaGFwcGVuXG4gICAgLy8gb24gdGhlIG5leHQgdGljayBpbiBvcmRlciB0byBhdm9pZCBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICBpZiAoZ3JvdXAgJiYgZ3JvdXAuX2lzU2VsZWN0ZWQodGhpcykpIHtcbiAgICAgIGdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGJ1dHRvbi4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBDaGVja3MgdGhlIGJ1dHRvbiB0b2dnbGUgZHVlIHRvIGFuIGludGVyYWN0aW9uIHdpdGggdGhlIHVuZGVybHlpbmcgbmF0aXZlIGJ1dHRvbi4gKi9cbiAgX29uQnV0dG9uQ2xpY2soKSB7XG4gICAgY29uc3QgbmV3Q2hlY2tlZCA9IHRoaXMuX2lzU2luZ2xlU2VsZWN0b3IgPyB0cnVlIDogIXRoaXMuX2NoZWNrZWQ7XG5cbiAgICBpZiAobmV3Q2hlY2tlZCAhPT0gdGhpcy5fY2hlY2tlZCkge1xuICAgICAgdGhpcy5fY2hlY2tlZCA9IG5ld0NoZWNrZWQ7XG4gICAgICBpZiAodGhpcy5idXR0b25Ub2dnbGVHcm91cCkge1xuICAgICAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9zeW5jQnV0dG9uVG9nZ2xlKHRoaXMsIHRoaXMuX2NoZWNrZWQsIHRydWUpO1xuICAgICAgICB0aGlzLmJ1dHRvblRvZ2dsZUdyb3VwLl9vblRvdWNoZWQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRW1pdCBhIGNoYW5nZSBldmVudCB3aGVuIGl0J3MgdGhlIHNpbmdsZSBzZWxlY3RvclxuICAgIHRoaXMuY2hhbmdlLmVtaXQobmV3IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSh0aGlzLCB0aGlzLnZhbHVlKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGJ1dHRvbiB0b2dnbGUgYXMgbmVlZGluZyBjaGVja2luZyBmb3IgY2hhbmdlIGRldGVjdGlvbi5cbiAgICogVGhpcyBtZXRob2QgaXMgZXhwb3NlZCBiZWNhdXNlIHRoZSBwYXJlbnQgYnV0dG9uIHRvZ2dsZSBncm91cCB3aWxsIGRpcmVjdGx5XG4gICAqIHVwZGF0ZSBib3VuZCBwcm9wZXJ0aWVzIG9mIHRoZSByYWRpbyBidXR0b24uXG4gICAqL1xuICBfbWFya0ZvckNoZWNrKCkge1xuICAgIC8vIFdoZW4gdGhlIGdyb3VwIHZhbHVlIGNoYW5nZXMsIHRoZSBidXR0b24gd2lsbCBub3QgYmUgbm90aWZpZWQuXG4gICAgLy8gVXNlIGBtYXJrRm9yQ2hlY2tgIHRvIGV4cGxpY2l0IHVwZGF0ZSBidXR0b24gdG9nZ2xlJ3Mgc3RhdHVzLlxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NoZWNrZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV92ZXJ0aWNhbDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==