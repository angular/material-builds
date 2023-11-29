import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, Optional, Inject, Input, Output, EventEmitter, ViewChild, booleanAttribute, } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_OPTGROUP, MatOptgroup } from './optgroup';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
import * as i1 from "../ripple/ripple";
import * as i2 from "../selection/pseudo-checkbox/pseudo-checkbox";
import * as i3 from "./optgroup";
/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueIdCounter = 0;
/** Event object emitted by MatOption when selected or deselected. */
export class MatOptionSelectionChange {
    constructor(
    /** Reference to the option that emitted the event. */
    source, 
    /** Whether the change in the option's value was a result of a user action. */
    isUserInput = false) {
        this.source = source;
        this.isUserInput = isUserInput;
    }
}
/**
 * Single option inside of a `<mat-select>` element.
 */
export class MatOption {
    /** Whether the wrapping component is in multiple selection mode. */
    get multiple() {
        return this._parent && this._parent.multiple;
    }
    /** Whether or not the option is currently selected. */
    get selected() {
        return this._selected;
    }
    /** Whether the option is disabled. */
    get disabled() {
        return (this.group && this.group.disabled) || this._disabled;
    }
    set disabled(value) {
        this._disabled = value;
    }
    /** Whether ripples for the option are disabled. */
    get disableRipple() {
        return !!(this._parent && this._parent.disableRipple);
    }
    /** Whether to display checkmark for single-selection. */
    get hideSingleSelectionIndicator() {
        return !!(this._parent && this._parent.hideSingleSelectionIndicator);
    }
    constructor(_element, _changeDetectorRef, _parent, group) {
        this._element = _element;
        this._changeDetectorRef = _changeDetectorRef;
        this._parent = _parent;
        this.group = group;
        this._selected = false;
        this._active = false;
        this._disabled = false;
        this._mostRecentViewValue = '';
        /** The unique ID of the option. */
        this.id = `mat-option-${_uniqueIdCounter++}`;
        /** Event emitted when the option is selected or deselected. */
        // tslint:disable-next-line:no-output-on-prefix
        this.onSelectionChange = new EventEmitter();
        /** Emits when the state of the option changes and any parents have to be notified. */
        this._stateChanges = new Subject();
    }
    /**
     * Whether or not the option is currently active and ready to be selected.
     * An active option displays styles as if it is focused, but the
     * focus is actually retained somewhere else. This comes in handy
     * for components like autocomplete where focus must remain on the input.
     */
    get active() {
        return this._active;
    }
    /**
     * The displayed value of the option. It is necessary to show the selected option in the
     * select's trigger.
     */
    get viewValue() {
        // TODO(kara): Add input property alternative for node envs.
        return (this._text?.nativeElement.textContent || '').trim();
    }
    /** Selects the option. */
    select(emitEvent = true) {
        if (!this._selected) {
            this._selected = true;
            this._changeDetectorRef.markForCheck();
            if (emitEvent) {
                this._emitSelectionChangeEvent();
            }
        }
    }
    /** Deselects the option. */
    deselect(emitEvent = true) {
        if (this._selected) {
            this._selected = false;
            this._changeDetectorRef.markForCheck();
            if (emitEvent) {
                this._emitSelectionChangeEvent();
            }
        }
    }
    /** Sets focus onto this option. */
    focus(_origin, options) {
        // Note that we aren't using `_origin`, but we need to keep it because some internal consumers
        // use `MatOption` in a `FocusKeyManager` and we need it to match `FocusableOption`.
        const element = this._getHostElement();
        if (typeof element.focus === 'function') {
            element.focus(options);
        }
    }
    /**
     * This method sets display styles on the option to make it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setActiveStyles() {
        if (!this._active) {
            this._active = true;
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * This method removes display styles on the option that made it appear
     * active. This is used by the ActiveDescendantKeyManager so key
     * events will display the proper options as active on arrow key events.
     */
    setInactiveStyles() {
        if (this._active) {
            this._active = false;
            this._changeDetectorRef.markForCheck();
        }
    }
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel() {
        return this.viewValue;
    }
    /** Ensures the option is selected when activated from the keyboard. */
    _handleKeydown(event) {
        if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
            this._selectViaInteraction();
            // Prevent the page from scrolling down and form submits.
            event.preventDefault();
        }
    }
    /**
     * `Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.`
     */
    _selectViaInteraction() {
        if (!this.disabled) {
            this._selected = this.multiple ? !this._selected : true;
            this._changeDetectorRef.markForCheck();
            this._emitSelectionChangeEvent(true);
        }
    }
    /** Returns the correct tabindex for the option depending on disabled state. */
    // This method is only used by `MatLegacyOption`. Keeping it here to avoid breaking the types.
    // That's because `MatLegacyOption` use `MatOption` type in a few places such as
    // `MatOptionSelectionChange`. It is safe to delete this when `MatLegacyOption` is deleted.
    _getTabIndex() {
        return this.disabled ? '-1' : '0';
    }
    /** Gets the host DOM element. */
    _getHostElement() {
        return this._element.nativeElement;
    }
    ngAfterViewChecked() {
        // Since parent components could be using the option's label to display the selected values
        // (e.g. `mat-select`) and they don't have a way of knowing if the option's label has changed
        // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
        // relatively cheap, however we still limit them only to selected options in order to avoid
        // hitting the DOM too often.
        if (this._selected) {
            const viewValue = this.viewValue;
            if (viewValue !== this._mostRecentViewValue) {
                if (this._mostRecentViewValue) {
                    this._stateChanges.next();
                }
                this._mostRecentViewValue = viewValue;
            }
        }
    }
    ngOnDestroy() {
        this._stateChanges.complete();
    }
    /** Emits the selection change event. */
    _emitSelectionChangeEvent(isUserInput = false) {
        this.onSelectionChange.emit(new MatOptionSelectionChange(this, isUserInput));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatOption, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_OPTION_PARENT_COMPONENT, optional: true }, { token: MAT_OPTGROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.0.4", type: MatOption, selector: "mat-option", inputs: { value: "value", id: "id", disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { onSelectionChange: "onSelectionChange" }, host: { attributes: { "role": "option" }, listeners: { "click": "_selectViaInteraction()", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-list-item--selected": "selected", "class.mat-mdc-option-multiple": "multiple", "class.mat-mdc-option-active": "active", "class.mdc-list-item--disabled": "disabled", "id": "id", "attr.aria-selected": "selected", "attr.aria-disabled": "disabled.toString()" }, classAttribute: "mat-mdc-option mdc-list-item" }, viewQueries: [{ propertyName: "_text", first: true, predicate: ["text"], descendants: true, static: true }], exportAs: ["matOption"], ngImport: i0, template: "<!-- Set aria-hidden=\"true\" to this DOM node and other decorative nodes in this file. This might\n be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead\n of the Option node (#23202). Most assistive technology will generally ignore non-role,\n non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->\n@if (multiple) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        [state]=\"selected ? 'checked' : 'unchecked'\"\n        aria-hidden=\"true\"></mat-pseudo-checkbox>\n}\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n@if (!multiple && selected && !hideSingleSelectionIndicator) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        state=\"checked\"\n        aria-hidden=\"true\"\n        appearance=\"minimal\"></mat-pseudo-checkbox>\n}\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n@if (group && group._inert) {\n    <span class=\"cdk-visually-hidden\">({{ group.label }})</span>\n}\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" aria-hidden=\"true\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);color:var(--mat-option-label-text-color);font-family:var(--mat-option-label-text-font);line-height:var(--mat-option-label-text-line-height);font-size:var(--mat-option-label-text-size);letter-spacing:var(--mat-option-label-text-tracking);font-weight:var(--mat-option-label-text-weight);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option:hover:not(.mdc-list-item--disabled){background-color:var(--mat-option-hover-state-layer-color)}.mat-mdc-option:focus.mdc-list-item,.mat-mdc-option.mat-mdc-option-active.mdc-list-item{background-color:var(--mat-option-focus-state-layer-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) .mdc-list-item__primary-text{color:var(--mat-option-selected-state-label-text-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple){background-color:var(--mat-option-selected-state-layer-color)}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i1.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "component", type: i2.MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: ["state", "disabled", "appearance"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatOption, decorators: [{
            type: Component,
            args: [{ selector: 'mat-option', exportAs: 'matOption', host: {
                        'role': 'option',
                        '[class.mdc-list-item--selected]': 'selected',
                        '[class.mat-mdc-option-multiple]': 'multiple',
                        '[class.mat-mdc-option-active]': 'active',
                        '[class.mdc-list-item--disabled]': 'disabled',
                        '[id]': 'id',
                        // Set aria-selected to false for non-selected items and true for selected items. Conform to
                        // [WAI ARIA Listbox authoring practices guide](
                        //  https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), "If any options are selected, each
                        // selected option has either aria-selected or aria-checked  set to true. All options that are
                        // selectable but not selected have either aria-selected or aria-checked set to false." Align
                        // aria-selected implementation of Chips and List components.
                        //
                        // Set `aria-selected="false"` on not-selected listbox options to fix VoiceOver announcing
                        // every option as "selected" (#21491).
                        '[attr.aria-selected]': 'selected',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '(click)': '_selectViaInteraction()',
                        '(keydown)': '_handleKeydown($event)',
                        'class': 'mat-mdc-option mdc-list-item',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!-- Set aria-hidden=\"true\" to this DOM node and other decorative nodes in this file. This might\n be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead\n of the Option node (#23202). Most assistive technology will generally ignore non-role,\n non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->\n@if (multiple) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        [state]=\"selected ? 'checked' : 'unchecked'\"\n        aria-hidden=\"true\"></mat-pseudo-checkbox>\n}\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n@if (!multiple && selected && !hideSingleSelectionIndicator) {\n    <mat-pseudo-checkbox\n        class=\"mat-mdc-option-pseudo-checkbox\"\n        [disabled]=\"disabled\"\n        state=\"checked\"\n        aria-hidden=\"true\"\n        appearance=\"minimal\"></mat-pseudo-checkbox>\n}\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n@if (group && group._inert) {\n    <span class=\"cdk-visually-hidden\">({{ group.label }})</span>\n}\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" aria-hidden=\"true\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);color:var(--mat-option-label-text-color);font-family:var(--mat-option-label-text-font);line-height:var(--mat-option-label-text-line-height);font-size:var(--mat-option-label-text-size);letter-spacing:var(--mat-option-label-text-tracking);font-weight:var(--mat-option-label-text-weight);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option:hover:not(.mdc-list-item--disabled){background-color:var(--mat-option-hover-state-layer-color)}.mat-mdc-option:focus.mdc-list-item,.mat-mdc-option.mat-mdc-option-active.mdc-list-item{background-color:var(--mat-option-focus-state-layer-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) .mdc-list-item__primary-text{color:var(--mat-option-selected-state-label-text-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple){background-color:var(--mat-option-selected-state-layer-color)}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTION_PARENT_COMPONENT]
                }] }, { type: i3.MatOptgroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTGROUP]
                }] }], propDecorators: { value: [{
                type: Input
            }], id: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], onSelectionChange: [{
                type: Output
            }], _text: [{
                type: ViewChild,
                args: ['text', { static: true }]
            }] } });
/**
 * Counts the amount of option group labels that precede the specified option.
 * @param optionIndex Index of the option at which to start counting.
 * @param options Flat list of all of the options.
 * @param optionGroups Flat list of all of the option groups.
 * @docs-private
 */
export function _countGroupLabelsBeforeOption(optionIndex, options, optionGroups) {
    if (optionGroups.length) {
        let optionsArray = options.toArray();
        let groups = optionGroups.toArray();
        let groupCounter = 0;
        for (let i = 0; i < optionIndex + 1; i++) {
            if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
                groupCounter++;
            }
        }
        return groupCounter;
    }
    return 0;
}
/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(optionOffset, optionHeight, currentScrollPosition, panelHeight) {
    if (optionOffset < currentScrollPosition) {
        return optionOffset;
    }
    if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
        return Math.max(0, optionOffset - panelHeight + optionHeight);
    }
    return currentScrollPosition;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvb3B0aW9uL29wdGlvbi50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL29wdGlvbi9vcHRpb24uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxPQUFPLEVBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUdOLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUVaLFNBQVMsRUFDVCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyRCxPQUFPLEVBQTJCLDJCQUEyQixFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7O0FBRXRGOzs7R0FHRztBQUNILElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCLHFFQUFxRTtBQUNyRSxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DO0lBQ0Usc0RBQXNEO0lBQy9DLE1BQW9CO0lBQzNCLDhFQUE4RTtJQUN2RSxjQUFjLEtBQUs7UUFGbkIsV0FBTSxHQUFOLE1BQU0sQ0FBYztRQUVwQixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtJQUN6QixDQUFDO0NBQ0w7QUFFRDs7R0FFRztBQStCSCxNQUFNLE9BQU8sU0FBUztJQU1wQixvRUFBb0U7SUFDcEUsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lB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LENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDM0UsWUFBWSxFQUFFLENBQUM7YUFDaEI7U0FDRjtRQUVELE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FDdEMsWUFBb0IsRUFDcEIsWUFBb0IsRUFDcEIscUJBQTZCLEVBQzdCLFdBQW1CO0lBRW5CLElBQUksWUFBWSxHQUFHLHFCQUFxQixFQUFFO1FBQ3hDLE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxZQUFZLEdBQUcsWUFBWSxHQUFHLHFCQUFxQixHQUFHLFdBQVcsRUFBRTtRQUNyRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUM7S0FDL0Q7SUFFRCxPQUFPLHFCQUFxQixDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBoYXNNb2RpZmllcktleSwgU1BBQ0V9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgRWxlbWVudFJlZixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIE9uRGVzdHJveSxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNQVRfT1BUR1JPVVAsIE1hdE9wdGdyb3VwfSBmcm9tICcuL29wdGdyb3VwJztcbmltcG9ydCB7TWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LCBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlR9IGZyb20gJy4vb3B0aW9uLXBhcmVudCc7XG5cbi8qKlxuICogT3B0aW9uIElEcyBuZWVkIHRvIGJlIHVuaXF1ZSBhY3Jvc3MgY29tcG9uZW50cywgc28gdGhpcyBjb3VudGVyIGV4aXN0cyBvdXRzaWRlIG9mXG4gKiB0aGUgY29tcG9uZW50IGRlZmluaXRpb24uXG4gKi9cbmxldCBfdW5pcXVlSWRDb3VudGVyID0gMDtcblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdE9wdGlvbiB3aGVuIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPFQgPSBhbnk+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgb3B0aW9uIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0T3B0aW9uPFQ+LFxuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGFuZ2UgaW4gdGhlIG9wdGlvbidzIHZhbHVlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlLFxuICApIHt9XG59XG5cbi8qKlxuICogU2luZ2xlIG9wdGlvbiBpbnNpZGUgb2YgYSBgPG1hdC1zZWxlY3Q+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0aW9uJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRpb24nLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2NsYXNzLm1kYy1saXN0LWl0ZW0tLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW9wdGlvbi1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbY2xhc3MubWF0LW1kYy1vcHRpb24tYWN0aXZlXSc6ICdhY3RpdmUnLFxuICAgICdbY2xhc3MubWRjLWxpc3QtaXRlbS0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgLy8gU2V0IGFyaWEtc2VsZWN0ZWQgdG8gZmFsc2UgZm9yIG5vbi1zZWxlY3RlZCBpdGVtcyBhbmQgdHJ1ZSBmb3Igc2VsZWN0ZWQgaXRlbXMuIENvbmZvcm0gdG9cbiAgICAvLyBbV0FJIEFSSUEgTGlzdGJveCBhdXRob3JpbmcgcHJhY3RpY2VzIGd1aWRlXShcbiAgICAvLyAgaHR0cHM6Ly93d3cudzMub3JnL1dBSS9BUklBL2FwZy9wYXR0ZXJucy9saXN0Ym94LyksIFwiSWYgYW55IG9wdGlvbnMgYXJlIHNlbGVjdGVkLCBlYWNoXG4gICAgLy8gc2VsZWN0ZWQgb3B0aW9uIGhhcyBlaXRoZXIgYXJpYS1zZWxlY3RlZCBvciBhcmlhLWNoZWNrZWQgIHNldCB0byB0cnVlLiBBbGwgb3B0aW9ucyB0aGF0IGFyZVxuICAgIC8vIHNlbGVjdGFibGUgYnV0IG5vdCBzZWxlY3RlZCBoYXZlIGVpdGhlciBhcmlhLXNlbGVjdGVkIG9yIGFyaWEtY2hlY2tlZCBzZXQgdG8gZmFsc2UuXCIgQWxpZ25cbiAgICAvLyBhcmlhLXNlbGVjdGVkIGltcGxlbWVudGF0aW9uIG9mIENoaXBzIGFuZCBMaXN0IGNvbXBvbmVudHMuXG4gICAgLy9cbiAgICAvLyBTZXQgYGFyaWEtc2VsZWN0ZWQ9XCJmYWxzZVwiYCBvbiBub3Qtc2VsZWN0ZWQgbGlzdGJveCBvcHRpb25zIHRvIGZpeCBWb2ljZU92ZXIgYW5ub3VuY2luZ1xuICAgIC8vIGV2ZXJ5IG9wdGlvbiBhcyBcInNlbGVjdGVkXCIgKCMyMTQ5MSkuXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJyhjbGljayknOiAnX3NlbGVjdFZpYUludGVyYWN0aW9uKCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtb3B0aW9uIG1kYy1saXN0LWl0ZW0nLFxuICB9LFxuICBzdHlsZVVybHM6IFsnb3B0aW9uLmNzcyddLFxuICB0ZW1wbGF0ZVVybDogJ29wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdE9wdGlvbjxUID0gYW55PiBpbXBsZW1lbnRzIEZvY3VzYWJsZU9wdGlvbiwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfYWN0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX21vc3RSZWNlbnRWaWV3VmFsdWUgPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgd3JhcHBpbmcgY29tcG9uZW50IGlzIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLiAqL1xuICBnZXQgbXVsdGlwbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQubXVsdGlwbGU7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG9wdGlvbiBpcyBjdXJyZW50bHkgc2VsZWN0ZWQuICovXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWQ7XG4gIH1cblxuICAvKiogVGhlIGZvcm0gdmFsdWUgb2YgdGhlIG9wdGlvbi4gKi9cbiAgQElucHV0KCkgdmFsdWU6IFQ7XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgb2YgdGhlIG9wdGlvbi4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtb3B0aW9uLSR7X3VuaXF1ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAuZGlzYWJsZWQpIHx8IHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsdWU7XG4gIH1cblxuICAvKiogV2hldGhlciByaXBwbGVzIGZvciB0aGUgb3B0aW9uIGFyZSBkaXNhYmxlZC4gKi9cbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlzYWJsZVJpcHBsZSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0byBkaXNwbGF5IGNoZWNrbWFyayBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gKi9cbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcik7XG4gIH1cblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQgb3IgZGVzZWxlY3RlZC4gKi9cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9uU2VsZWN0aW9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U8VD4+KCk7XG5cbiAgLyoqIEVsZW1lbnQgY29udGFpbmluZyB0aGUgb3B0aW9uJ3MgdGV4dC4gKi9cbiAgQFZpZXdDaGlsZCgndGV4dCcsIHtzdGF0aWM6IHRydWV9KSBfdGV4dDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4gfCB1bmRlZmluZWQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHN0YXRlIG9mIHRoZSBvcHRpb24gY2hhbmdlcyBhbmQgYW55IHBhcmVudHMgaGF2ZSB0byBiZSBub3RpZmllZC4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQpIHByaXZhdGUgX3BhcmVudDogTWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX09QVEdST1VQKSBwdWJsaWMgZ3JvdXA6IE1hdE9wdGdyb3VwLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBvcHRpb24gaXMgY3VycmVudGx5IGFjdGl2ZSBhbmQgcmVhZHkgdG8gYmUgc2VsZWN0ZWQuXG4gICAqIEFuIGFjdGl2ZSBvcHRpb24gZGlzcGxheXMgc3R5bGVzIGFzIGlmIGl0IGlzIGZvY3VzZWQsIGJ1dCB0aGVcbiAgICogZm9jdXMgaXMgYWN0dWFsbHkgcmV0YWluZWQgc29tZXdoZXJlIGVsc2UuIFRoaXMgY29tZXMgaW4gaGFuZHlcbiAgICogZm9yIGNvbXBvbmVudHMgbGlrZSBhdXRvY29tcGxldGUgd2hlcmUgZm9jdXMgbXVzdCByZW1haW4gb24gdGhlIGlucHV0LlxuICAgKi9cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkaXNwbGF5ZWQgdmFsdWUgb2YgdGhlIG9wdGlvbi4gSXQgaXMgbmVjZXNzYXJ5IHRvIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGVcbiAgICogc2VsZWN0J3MgdHJpZ2dlci5cbiAgICovXG4gIGdldCB2aWV3VmFsdWUoKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPKGthcmEpOiBBZGQgaW5wdXQgcHJvcGVydHkgYWx0ZXJuYXRpdmUgZm9yIG5vZGUgZW52cy5cbiAgICByZXR1cm4gKHRoaXMuX3RleHQ/Lm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb24uICovXG4gIHNlbGVjdChlbWl0RXZlbnQgPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgb3B0aW9uLiAqL1xuICBkZXNlbGVjdChlbWl0RXZlbnQgPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICAgdGhpcy5fZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgZm9jdXMgb250byB0aGlzIG9wdGlvbi4gKi9cbiAgZm9jdXMoX29yaWdpbj86IEZvY3VzT3JpZ2luLCBvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIGFyZW4ndCB1c2luZyBgX29yaWdpbmAsIGJ1dCB3ZSBuZWVkIHRvIGtlZXAgaXQgYmVjYXVzZSBzb21lIGludGVybmFsIGNvbnN1bWVyc1xuICAgIC8vIHVzZSBgTWF0T3B0aW9uYCBpbiBhIGBGb2N1c0tleU1hbmFnZXJgIGFuZCB3ZSBuZWVkIGl0IHRvIG1hdGNoIGBGb2N1c2FibGVPcHRpb25gLlxuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9nZXRIb3N0RWxlbWVudCgpO1xuXG4gICAgaWYgKHR5cGVvZiBlbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBlbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzZXRzIGRpc3BsYXkgc3R5bGVzIG9uIHRoZSBvcHRpb24gdG8gbWFrZSBpdCBhcHBlYXJcbiAgICogYWN0aXZlLiBUaGlzIGlzIHVzZWQgYnkgdGhlIEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyIHNvIGtleVxuICAgKiBldmVudHMgd2lsbCBkaXNwbGF5IHRoZSBwcm9wZXIgb3B0aW9ucyBhcyBhY3RpdmUgb24gYXJyb3cga2V5IGV2ZW50cy5cbiAgICovXG4gIHNldEFjdGl2ZVN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2FjdGl2ZSkge1xuICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZW1vdmVzIGRpc3BsYXkgc3R5bGVzIG9uIHRoZSBvcHRpb24gdGhhdCBtYWRlIGl0IGFwcGVhclxuICAgKiBhY3RpdmUuIFRoaXMgaXMgdXNlZCBieSB0aGUgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXIgc28ga2V5XG4gICAqIGV2ZW50cyB3aWxsIGRpc3BsYXkgdGhlIHByb3BlciBvcHRpb25zIGFzIGFjdGl2ZSBvbiBhcnJvdyBrZXkgZXZlbnRzLlxuICAgKi9cbiAgc2V0SW5hY3RpdmVTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xuICAgICAgdGhpcy5fYWN0aXZlID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgdG8gYmUgdXNlZCB3aGVuIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIG9wdGlvbiBzaG91bGQgYmUgZm9jdXNlZC4gKi9cbiAgZ2V0TGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52aWV3VmFsdWU7XG4gIH1cblxuICAvKiogRW5zdXJlcyB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkIHdoZW4gYWN0aXZhdGVkIGZyb20gdGhlIGtleWJvYXJkLiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICgoZXZlbnQua2V5Q29kZSA9PT0gRU5URVIgfHwgZXZlbnQua2V5Q29kZSA9PT0gU1BBQ0UpICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHRoaXMuX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG5cbiAgICAgIC8vIFByZXZlbnQgdGhlIHBhZ2UgZnJvbSBzY3JvbGxpbmcgZG93biBhbmQgZm9ybSBzdWJtaXRzLlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogYFNlbGVjdHMgdGhlIG9wdGlvbiB3aGlsZSBpbmRpY2F0aW5nIHRoZSBzZWxlY3Rpb24gY2FtZSBmcm9tIHRoZSB1c2VyLiBVc2VkIHRvXG4gICAqIGRldGVybWluZSBpZiB0aGUgc2VsZWN0J3MgdmlldyAtPiBtb2RlbCBjYWxsYmFjayBzaG91bGQgYmUgaW52b2tlZC5gXG4gICAqL1xuICBfc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRoaXMubXVsdGlwbGUgPyAhdGhpcy5fc2VsZWN0ZWQgOiB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9lbWl0U2VsZWN0aW9uQ2hhbmdlRXZlbnQodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNvcnJlY3QgdGFiaW5kZXggZm9yIHRoZSBvcHRpb24gZGVwZW5kaW5nIG9uIGRpc2FibGVkIHN0YXRlLiAqL1xuICAvLyBUaGlzIG1ldGhvZCBpcyBvbmx5IHVzZWQgYnkgYE1hdExlZ2FjeU9wdGlvbmAuIEtlZXBpbmcgaXQgaGVyZSB0byBhdm9pZCBicmVha2luZyB0aGUgdHlwZXMuXG4gIC8vIFRoYXQncyBiZWNhdXNlIGBNYXRMZWdhY3lPcHRpb25gIHVzZSBgTWF0T3B0aW9uYCB0eXBlIGluIGEgZmV3IHBsYWNlcyBzdWNoIGFzXG4gIC8vIGBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2VgLiBJdCBpcyBzYWZlIHRvIGRlbGV0ZSB0aGlzIHdoZW4gYE1hdExlZ2FjeU9wdGlvbmAgaXMgZGVsZXRlZC5cbiAgX2dldFRhYkluZGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAnLTEnIDogJzAnO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGhvc3QgRE9NIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAvLyBTaW5jZSBwYXJlbnQgY29tcG9uZW50cyBjb3VsZCBiZSB1c2luZyB0aGUgb3B0aW9uJ3MgbGFiZWwgdG8gZGlzcGxheSB0aGUgc2VsZWN0ZWQgdmFsdWVzXG4gICAgLy8gKGUuZy4gYG1hdC1zZWxlY3RgKSBhbmQgdGhleSBkb24ndCBoYXZlIGEgd2F5IG9mIGtub3dpbmcgaWYgdGhlIG9wdGlvbidzIGxhYmVsIGhhcyBjaGFuZ2VkXG4gICAgLy8gd2UgaGF2ZSB0byBjaGVjayBmb3IgY2hhbmdlcyBpbiB0aGUgRE9NIG91cnNlbHZlcyBhbmQgZGlzcGF0Y2ggYW4gZXZlbnQuIFRoZXNlIGNoZWNrcyBhcmVcbiAgICAvLyByZWxhdGl2ZWx5IGNoZWFwLCBob3dldmVyIHdlIHN0aWxsIGxpbWl0IHRoZW0gb25seSB0byBzZWxlY3RlZCBvcHRpb25zIGluIG9yZGVyIHRvIGF2b2lkXG4gICAgLy8gaGl0dGluZyB0aGUgRE9NIHRvbyBvZnRlbi5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIGNvbnN0IHZpZXdWYWx1ZSA9IHRoaXMudmlld1ZhbHVlO1xuXG4gICAgICBpZiAodmlld1ZhbHVlICE9PSB0aGlzLl9tb3N0UmVjZW50Vmlld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9tb3N0UmVjZW50Vmlld1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vc3RSZWNlbnRWaWV3VmFsdWUgPSB2aWV3VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQuICovXG4gIHByaXZhdGUgX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudChpc1VzZXJJbnB1dCA9IGZhbHNlKTogdm9pZCB7XG4gICAgdGhpcy5vblNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U8VD4odGhpcywgaXNVc2VySW5wdXQpKTtcbiAgfVxufVxuXG4vKipcbiAqIENvdW50cyB0aGUgYW1vdW50IG9mIG9wdGlvbiBncm91cCBsYWJlbHMgdGhhdCBwcmVjZWRlIHRoZSBzcGVjaWZpZWQgb3B0aW9uLlxuICogQHBhcmFtIG9wdGlvbkluZGV4IEluZGV4IG9mIHRoZSBvcHRpb24gYXQgd2hpY2ggdG8gc3RhcnQgY291bnRpbmcuXG4gKiBAcGFyYW0gb3B0aW9ucyBGbGF0IGxpc3Qgb2YgYWxsIG9mIHRoZSBvcHRpb25zLlxuICogQHBhcmFtIG9wdGlvbkdyb3VwcyBGbGF0IGxpc3Qgb2YgYWxsIG9mIHRoZSBvcHRpb24gZ3JvdXBzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oXG4gIG9wdGlvbkluZGV4OiBudW1iZXIsXG4gIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+LFxuICBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD4sXG4pOiBudW1iZXIge1xuICBpZiAob3B0aW9uR3JvdXBzLmxlbmd0aCkge1xuICAgIGxldCBvcHRpb25zQXJyYXkgPSBvcHRpb25zLnRvQXJyYXkoKTtcbiAgICBsZXQgZ3JvdXBzID0gb3B0aW9uR3JvdXBzLnRvQXJyYXkoKTtcbiAgICBsZXQgZ3JvdXBDb3VudGVyID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9uSW5kZXggKyAxOyBpKyspIHtcbiAgICAgIGlmIChvcHRpb25zQXJyYXlbaV0uZ3JvdXAgJiYgb3B0aW9uc0FycmF5W2ldLmdyb3VwID09PSBncm91cHNbZ3JvdXBDb3VudGVyXSkge1xuICAgICAgICBncm91cENvdW50ZXIrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ3JvdXBDb3VudGVyO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgcG9zaXRpb24gdG8gd2hpY2ggdG8gc2Nyb2xsIGEgcGFuZWwgaW4gb3JkZXIgZm9yIGFuIG9wdGlvbiB0byBiZSBpbnRvIHZpZXcuXG4gKiBAcGFyYW0gb3B0aW9uT2Zmc2V0IE9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcCBvZiB0aGUgcGFuZWwuXG4gKiBAcGFyYW0gb3B0aW9uSGVpZ2h0IEhlaWdodCBvZiB0aGUgb3B0aW9ucy5cbiAqIEBwYXJhbSBjdXJyZW50U2Nyb2xsUG9zaXRpb24gQ3VycmVudCBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIHBhbmVsLlxuICogQHBhcmFtIHBhbmVsSGVpZ2h0IEhlaWdodCBvZiB0aGUgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gIG9wdGlvbk9mZnNldDogbnVtYmVyLFxuICBvcHRpb25IZWlnaHQ6IG51bWJlcixcbiAgY3VycmVudFNjcm9sbFBvc2l0aW9uOiBudW1iZXIsXG4gIHBhbmVsSGVpZ2h0OiBudW1iZXIsXG4pOiBudW1iZXIge1xuICBpZiAob3B0aW9uT2Zmc2V0IDwgY3VycmVudFNjcm9sbFBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIG9wdGlvbk9mZnNldDtcbiAgfVxuXG4gIGlmIChvcHRpb25PZmZzZXQgKyBvcHRpb25IZWlnaHQgPiBjdXJyZW50U2Nyb2xsUG9zaXRpb24gKyBwYW5lbEhlaWdodCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBvcHRpb25PZmZzZXQgLSBwYW5lbEhlaWdodCArIG9wdGlvbkhlaWdodCk7XG4gIH1cblxuICByZXR1cm4gY3VycmVudFNjcm9sbFBvc2l0aW9uO1xufVxuIiwiPCEtLSBTZXQgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdG8gdGhpcyBET00gbm9kZSBhbmQgb3RoZXIgZGVjb3JhdGl2ZSBub2RlcyBpbiB0aGlzIGZpbGUuIFRoaXMgbWlnaHRcbiBiZSBjb250cmlidXRpbmcgdG8gaXNzdWUgd2hlcmUgc29tZXRpbWVzIFZvaWNlT3ZlciBmb2N1c2VzIG9uIGEgVGV4dE5vZGUgaW4gdGhlIGExMXkgdHJlZSBpbnN0ZWFkXG4gb2YgdGhlIE9wdGlvbiBub2RlICgjMjMyMDIpLiBNb3N0IGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHdpbGwgZ2VuZXJhbGx5IGlnbm9yZSBub24tcm9sZSxcbiBub24tdGV4dC1jb250ZW50IGVsZW1lbnRzLiBBZGRpbmcgYXJpYS1oaWRkZW4gc2VlbXMgdG8gbWFrZSBWb2ljZU92ZXIgYmVoYXZlIG1vcmUgY29uc2lzdGVudGx5LiAtLT5cbkBpZiAobXVsdGlwbGUpIHtcbiAgICA8bWF0LXBzZXVkby1jaGVja2JveFxuICAgICAgICBjbGFzcz1cIm1hdC1tZGMtb3B0aW9uLXBzZXVkby1jaGVja2JveFwiXG4gICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgIFtzdGF0ZV09XCJzZWxlY3RlZCA/ICdjaGVja2VkJyA6ICd1bmNoZWNrZWQnXCJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9tYXQtcHNldWRvLWNoZWNrYm94PlxufVxuXG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtaWNvblwiPjwvbmctY29udGVudD5cblxuPHNwYW4gY2xhc3M9XCJtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHRcIiAjdGV4dD48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9zcGFuPlxuXG48IS0tIFJlbmRlciBjaGVja21hcmsgYXQgdGhlIGVuZCBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gLS0+XG5AaWYgKCFtdWx0aXBsZSAmJiBzZWxlY3RlZCAmJiAhaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcikge1xuICAgIDxtYXQtcHNldWRvLWNoZWNrYm94XG4gICAgICAgIGNsYXNzPVwibWF0LW1kYy1vcHRpb24tcHNldWRvLWNoZWNrYm94XCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgc3RhdGU9XCJjaGVja2VkXCJcbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgYXBwZWFyYW5jZT1cIm1pbmltYWxcIj48L21hdC1wc2V1ZG8tY2hlY2tib3g+XG59XG5cbjwhLS0gU2VlIGExMXkgbm90ZXMgaW5zaWRlIG9wdGdyb3VwLnRzIGZvciBjb250ZXh0IGJlaGluZCB0aGlzIGVsZW1lbnQuIC0tPlxuQGlmIChncm91cCAmJiBncm91cC5faW5lcnQpIHtcbiAgICA8c3BhbiBjbGFzcz1cImNkay12aXN1YWxseS1oaWRkZW5cIj4oe3sgZ3JvdXAubGFiZWwgfX0pPC9zcGFuPlxufVxuXG48ZGl2IGNsYXNzPVwibWF0LW1kYy1vcHRpb24tcmlwcGxlIG1hdC1tZGMtZm9jdXMtaW5kaWNhdG9yXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgbWF0LXJpcHBsZVxuICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiIFttYXRSaXBwbGVEaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBkaXNhYmxlUmlwcGxlXCI+XG48L2Rpdj5cbiJdfQ==