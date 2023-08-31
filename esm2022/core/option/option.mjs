import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, Optional, Inject, Input, Output, EventEmitter, ViewChild, booleanAttribute, } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_OPTGROUP, MatOptgroup } from './optgroup';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
import * as i1 from "../ripple/ripple";
import * as i2 from "@angular/common";
import * as i3 from "../selection/pseudo-checkbox/pseudo-checkbox";
import * as i4 from "./optgroup";
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatOption, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_OPTION_PARENT_COMPONENT, optional: true }, { token: MAT_OPTGROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatOption, selector: "mat-option", inputs: { value: "value", id: "id", disabled: ["disabled", "disabled", booleanAttribute] }, outputs: { onSelectionChange: "onSelectionChange" }, host: { attributes: { "role": "option" }, listeners: { "click": "_selectViaInteraction()", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-list-item--selected": "selected", "class.mat-mdc-option-multiple": "multiple", "class.mat-mdc-option-active": "active", "class.mdc-list-item--disabled": "disabled", "id": "id", "attr.aria-selected": "selected", "attr.aria-disabled": "disabled.toString()" }, classAttribute: "mat-mdc-option mdc-list-item" }, viewQueries: [{ propertyName: "_text", first: true, predicate: ["text"], descendants: true, static: true }], exportAs: ["matOption"], ngImport: i0, template: "<!-- Set aria-hidden=\"true\" to this DOM node and other decorative nodes in this file. This might\n be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead\n of the Option node (#23202). Most assistive technology will generally ignore non-role,\n non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->\n<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-mdc-option-pseudo-checkbox\" [disabled]=\"disabled\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" aria-hidden=\"true\"></mat-pseudo-checkbox>\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n<mat-pseudo-checkbox *ngIf=\"!multiple && selected && !hideSingleSelectionIndicator\"\n    class=\"mat-mdc-option-pseudo-checkbox\" [disabled]=\"disabled\" state=\"checked\"\n    aria-hidden=\"true\" appearance=\"minimal\"></mat-pseudo-checkbox>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" aria-hidden=\"true\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);color:var(--mat-option-label-text-color);font-family:var(--mat-option-label-text-font);line-height:var(--mat-option-label-text-line-height);font-size:var(--mat-option-label-text-size);letter-spacing:var(--mat-option-label-text-tracking);font-weight:var(--mat-option-label-text-weight);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option:hover:not(.mdc-list-item--disabled){background-color:var(--mat-option-hover-state-layer-color)}.mat-mdc-option:focus.mdc-list-item,.mat-mdc-option.mat-mdc-option-active.mdc-list-item{background-color:var(--mat-option-focus-state-layer-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) .mdc-list-item__primary-text{color:var(--mat-option-selected-state-label-text-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple){background-color:var(--mat-option-selected-state-layer-color)}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i1.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: ["state", "disabled", "appearance"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatOption, decorators: [{
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
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!-- Set aria-hidden=\"true\" to this DOM node and other decorative nodes in this file. This might\n be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead\n of the Option node (#23202). Most assistive technology will generally ignore non-role,\n non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->\n<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-mdc-option-pseudo-checkbox\" [disabled]=\"disabled\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" aria-hidden=\"true\"></mat-pseudo-checkbox>\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n<mat-pseudo-checkbox *ngIf=\"!multiple && selected && !hideSingleSelectionIndicator\"\n    class=\"mat-mdc-option-pseudo-checkbox\" [disabled]=\"disabled\" state=\"checked\"\n    aria-hidden=\"true\" appearance=\"minimal\"></mat-pseudo-checkbox>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" aria-hidden=\"true\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\" [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);color:var(--mat-option-label-text-color);font-family:var(--mat-option-label-text-font);line-height:var(--mat-option-label-text-line-height);font-size:var(--mat-option-label-text-size);letter-spacing:var(--mat-option-label-text-tracking);font-weight:var(--mat-option-label-text-weight);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option:hover:not(.mdc-list-item--disabled){background-color:var(--mat-option-hover-state-layer-color)}.mat-mdc-option:focus.mdc-list-item,.mat-mdc-option.mat-mdc-option-active.mdc-list-item{background-color:var(--mat-option-focus-state-layer-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled) .mdc-list-item__primary-text{color:var(--mat-option-selected-state-label-text-color)}.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-multiple){background-color:var(--mat-option-selected-state-layer-color)}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTION_PARENT_COMPONENT]
                }] }, { type: i4.MatOptgroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTGROUP]
                }] }]; }, propDecorators: { value: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvb3B0aW9uL29wdGlvbi50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL29wdGlvbi9vcHRpb24uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxPQUFPLEVBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUdOLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUVaLFNBQVMsRUFDVCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyRCxPQUFPLEVBQTJCLDJCQUEyQixFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQUV0Rjs7O0dBR0c7QUFDSCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUV6QixxRUFBcUU7QUFDckUsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQztJQUNFLHNEQUFzRDtJQUMvQyxNQUFvQjtJQUMzQiw4RUFBOEU7SUFDdkUsY0FBYyxLQUFLO1FBRm5CLFdBQU0sR0FBTixNQUFNLENBQWM7UUFFcEIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7SUFDekIsQ0FBQztDQUNMO0FBRUQ7O0dBRUc7QUErQkgsTUFBTSxPQUFPLFNBQVM7SUFNcEIsb0VBQW9FO0lBQ3BFLElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJ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WSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUVyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNFLFlBQVksRUFBRSxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsd0JBQXdCLENBQ3RDLFlBQW9CLEVBQ3BCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixXQUFtQjtJQUVuQixJQUFJLFlBQVksR0FBRyxxQkFBcUIsRUFBRTtRQUN4QyxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxxQkFBcUIsR0FBRyxXQUFXLEVBQUU7UUFDckUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDO0tBQy9EO0lBRUQsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9uLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtFTlRFUiwgaGFzTW9kaWZpZXJLZXksIFNQQUNFfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIEVsZW1lbnRSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBPbkRlc3Ryb3ksXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7TUFUX09QVEdST1VQLCBNYXRPcHRncm91cH0gZnJvbSAnLi9vcHRncm91cCc7XG5pbXBvcnQge01hdE9wdGlvblBhcmVudENvbXBvbmVudCwgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UfSBmcm9tICcuL29wdGlvbi1wYXJlbnQnO1xuXG4vKipcbiAqIE9wdGlvbiBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRPcHRpb24gd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZTxUID0gYW55PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG9wdGlvbiB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdE9wdGlvbjxUPixcbiAgICAvKiogV2hldGhlciB0aGUgY2hhbmdlIGluIHRoZSBvcHRpb24ncyB2YWx1ZSB3YXMgYSByZXN1bHQgb2YgYSB1c2VyIGFjdGlvbi4gKi9cbiAgICBwdWJsaWMgaXNVc2VySW5wdXQgPSBmYWxzZSxcbiAgKSB7fVxufVxuXG4vKipcbiAqIFNpbmdsZSBvcHRpb24gaW5zaWRlIG9mIGEgYDxtYXQtc2VsZWN0PmAgZWxlbWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW9wdGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0T3B0aW9uJyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgJ1tjbGFzcy5tZGMtbGlzdC1pdGVtLS1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1vcHRpb24tbXVsdGlwbGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtb3B0aW9uLWFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnW2NsYXNzLm1kYy1saXN0LWl0ZW0tLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICAgIC8vIFNldCBhcmlhLXNlbGVjdGVkIHRvIGZhbHNlIGZvciBub24tc2VsZWN0ZWQgaXRlbXMgYW5kIHRydWUgZm9yIHNlbGVjdGVkIGl0ZW1zLiBDb25mb3JtIHRvXG4gICAgLy8gW1dBSSBBUklBIExpc3Rib3ggYXV0aG9yaW5nIHByYWN0aWNlcyBndWlkZV0oXG4gICAgLy8gIGh0dHBzOi8vd3d3LnczLm9yZy9XQUkvQVJJQS9hcGcvcGF0dGVybnMvbGlzdGJveC8pLCBcIklmIGFueSBvcHRpb25zIGFyZSBzZWxlY3RlZCwgZWFjaFxuICAgIC8vIHNlbGVjdGVkIG9wdGlvbiBoYXMgZWl0aGVyIGFyaWEtc2VsZWN0ZWQgb3IgYXJpYS1jaGVja2VkICBzZXQgdG8gdHJ1ZS4gQWxsIG9wdGlvbnMgdGhhdCBhcmVcbiAgICAvLyBzZWxlY3RhYmxlIGJ1dCBub3Qgc2VsZWN0ZWQgaGF2ZSBlaXRoZXIgYXJpYS1zZWxlY3RlZCBvciBhcmlhLWNoZWNrZWQgc2V0IHRvIGZhbHNlLlwiIEFsaWduXG4gICAgLy8gYXJpYS1zZWxlY3RlZCBpbXBsZW1lbnRhdGlvbiBvZiBDaGlwcyBhbmQgTGlzdCBjb21wb25lbnRzLlxuICAgIC8vXG4gICAgLy8gU2V0IGBhcmlhLXNlbGVjdGVkPVwiZmFsc2VcImAgb24gbm90LXNlbGVjdGVkIGxpc3Rib3ggb3B0aW9ucyB0byBmaXggVm9pY2VPdmVyIGFubm91bmNpbmdcbiAgICAvLyBldmVyeSBvcHRpb24gYXMgXCJzZWxlY3RlZFwiICgjMjE0OTEpLlxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICcoY2xpY2spJzogJ19zZWxlY3RWaWFJbnRlcmFjdGlvbigpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICdjbGFzcyc6ICdtYXQtbWRjLW9wdGlvbiBtZGMtbGlzdC1pdGVtJyxcbiAgfSxcbiAgc3R5bGVVcmxzOiBbJ29wdGlvbi5jc3MnXSxcbiAgdGVtcGxhdGVVcmw6ICdvcHRpb24uaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRpb248VCA9IGFueT4gaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3NlbGVjdGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2FjdGl2ZSA9IGZhbHNlO1xuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9tb3N0UmVjZW50Vmlld1ZhbHVlID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHdyYXBwaW5nIGNvbXBvbmVudCBpcyBpbiBtdWx0aXBsZSBzZWxlY3Rpb24gbW9kZS4gKi9cbiAgZ2V0IG11bHRpcGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50Lm11bHRpcGxlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvcHRpb24gaXMgY3VycmVudGx5IHNlbGVjdGVkLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkO1xuICB9XG5cbiAgLyoqIFRoZSBmb3JtIHZhbHVlIG9mIHRoZSBvcHRpb24uICovXG4gIEBJbnB1dCgpIHZhbHVlOiBUO1xuXG4gIC8qKiBUaGUgdW5pcXVlIElEIG9mIHRoZSBvcHRpb24uICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LW9wdGlvbi0ke191bmlxdWVJZENvdW50ZXIrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5ncm91cCAmJiB0aGlzLmdyb3VwLmRpc2FibGVkKSB8fCB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBmb3IgdGhlIG9wdGlvbiBhcmUgZGlzYWJsZWQuICovXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpc2FibGVSaXBwbGUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdG8gZGlzcGxheSBjaGVja21hcmsgZm9yIHNpbmdsZS1zZWxlY3Rpb24uICovXG4gIGdldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IpO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvblNlbGVjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPFQ+PigpO1xuXG4gIC8qKiBFbGVtZW50IGNvbnRhaW5pbmcgdGhlIG9wdGlvbidzIHRleHQuICovXG4gIEBWaWV3Q2hpbGQoJ3RleHQnLCB7c3RhdGljOiB0cnVlfSkgX3RleHQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9uIGNoYW5nZXMgYW5kIGFueSBwYXJlbnRzIGhhdmUgdG8gYmUgbm90aWZpZWQuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UKSBwcml2YXRlIF9wYXJlbnQ6IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9PUFRHUk9VUCkgcHVibGljIGdyb3VwOiBNYXRPcHRncm91cCxcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3B0aW9uIGlzIGN1cnJlbnRseSBhY3RpdmUgYW5kIHJlYWR5IHRvIGJlIHNlbGVjdGVkLlxuICAgKiBBbiBhY3RpdmUgb3B0aW9uIGRpc3BsYXlzIHN0eWxlcyBhcyBpZiBpdCBpcyBmb2N1c2VkLCBidXQgdGhlXG4gICAqIGZvY3VzIGlzIGFjdHVhbGx5IHJldGFpbmVkIHNvbWV3aGVyZSBlbHNlLiBUaGlzIGNvbWVzIGluIGhhbmR5XG4gICAqIGZvciBjb21wb25lbnRzIGxpa2UgYXV0b2NvbXBsZXRlIHdoZXJlIGZvY3VzIG11c3QgcmVtYWluIG9uIHRoZSBpbnB1dC5cbiAgICovXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGlzcGxheWVkIHZhbHVlIG9mIHRoZSBvcHRpb24uIEl0IGlzIG5lY2Vzc2FyeSB0byBzaG93IHRoZSBzZWxlY3RlZCBvcHRpb24gaW4gdGhlXG4gICAqIHNlbGVjdCdzIHRyaWdnZXIuXG4gICAqL1xuICBnZXQgdmlld1ZhbHVlKCk6IHN0cmluZyB7XG4gICAgLy8gVE9ETyhrYXJhKTogQWRkIGlucHV0IHByb3BlcnR5IGFsdGVybmF0aXZlIGZvciBub2RlIGVudnMuXG4gICAgcmV0dXJuICh0aGlzLl90ZXh0Py5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50IHx8ICcnKS50cmltKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgb3B0aW9uLiAqL1xuICBzZWxlY3QoZW1pdEV2ZW50ID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgdGhlIG9wdGlvbi4gKi9cbiAgZGVzZWxlY3QoZW1pdEV2ZW50ID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIGZvY3VzIG9udG8gdGhpcyBvcHRpb24uICovXG4gIGZvY3VzKF9vcmlnaW4/OiBGb2N1c09yaWdpbiwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBhcmVuJ3QgdXNpbmcgYF9vcmlnaW5gLCBidXQgd2UgbmVlZCB0byBrZWVwIGl0IGJlY2F1c2Ugc29tZSBpbnRlcm5hbCBjb25zdW1lcnNcbiAgICAvLyB1c2UgYE1hdE9wdGlvbmAgaW4gYSBgRm9jdXNLZXlNYW5hZ2VyYCBhbmQgd2UgbmVlZCBpdCB0byBtYXRjaCBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZ2V0SG9zdEVsZW1lbnQoKTtcblxuICAgIGlmICh0eXBlb2YgZWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2V0cyBkaXNwbGF5IHN0eWxlcyBvbiB0aGUgb3B0aW9uIHRvIG1ha2UgaXQgYXBwZWFyXG4gICAqIGFjdGl2ZS4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciBzbyBrZXlcbiAgICogZXZlbnRzIHdpbGwgZGlzcGxheSB0aGUgcHJvcGVyIG9wdGlvbnMgYXMgYWN0aXZlIG9uIGFycm93IGtleSBldmVudHMuXG4gICAqL1xuICBzZXRBY3RpdmVTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmVtb3ZlcyBkaXNwbGF5IHN0eWxlcyBvbiB0aGUgb3B0aW9uIHRoYXQgbWFkZSBpdCBhcHBlYXJcbiAgICogYWN0aXZlLiBUaGlzIGlzIHVzZWQgYnkgdGhlIEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyIHNvIGtleVxuICAgKiBldmVudHMgd2lsbCBkaXNwbGF5IHRoZSBwcm9wZXIgb3B0aW9ucyBhcyBhY3RpdmUgb24gYXJyb3cga2V5IGV2ZW50cy5cbiAgICovXG4gIHNldEluYWN0aXZlU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIHRvIGJlIHVzZWQgd2hlbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBvcHRpb24gc2hvdWxkIGJlIGZvY3VzZWQuICovXG4gIGdldExhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmlld1ZhbHVlO1xuICB9XG5cbiAgLyoqIEVuc3VyZXMgdGhlIG9wdGlvbiBpcyBzZWxlY3RlZCB3aGVuIGFjdGl2YXRlZCBmcm9tIHRoZSBrZXlib2FyZC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuXG4gICAgICAvLyBQcmV2ZW50IHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nIGRvd24gYW5kIGZvcm0gc3VibWl0cy5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGBTZWxlY3RzIHRoZSBvcHRpb24gd2hpbGUgaW5kaWNhdGluZyB0aGUgc2VsZWN0aW9uIGNhbWUgZnJvbSB0aGUgdXNlci4gVXNlZCB0b1xuICAgKiBkZXRlcm1pbmUgaWYgdGhlIHNlbGVjdCdzIHZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgc2hvdWxkIGJlIGludm9rZWQuYFxuICAgKi9cbiAgX3NlbGVjdFZpYUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gIXRoaXMuX3NlbGVjdGVkIDogdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBjb3JyZWN0IHRhYmluZGV4IGZvciB0aGUgb3B0aW9uIGRlcGVuZGluZyBvbiBkaXNhYmxlZCBzdGF0ZS4gKi9cbiAgLy8gVGhpcyBtZXRob2QgaXMgb25seSB1c2VkIGJ5IGBNYXRMZWdhY3lPcHRpb25gLiBLZWVwaW5nIGl0IGhlcmUgdG8gYXZvaWQgYnJlYWtpbmcgdGhlIHR5cGVzLlxuICAvLyBUaGF0J3MgYmVjYXVzZSBgTWF0TGVnYWN5T3B0aW9uYCB1c2UgYE1hdE9wdGlvbmAgdHlwZSBpbiBhIGZldyBwbGFjZXMgc3VjaCBhc1xuICAvLyBgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlYC4gSXQgaXMgc2FmZSB0byBkZWxldGUgdGhpcyB3aGVuIGBNYXRMZWdhY3lPcHRpb25gIGlzIGRlbGV0ZWQuXG4gIF9nZXRUYWJJbmRleCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8gJy0xJyA6ICcwJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBob3N0IERPTSBlbGVtZW50LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgLy8gU2luY2UgcGFyZW50IGNvbXBvbmVudHMgY291bGQgYmUgdXNpbmcgdGhlIG9wdGlvbidzIGxhYmVsIHRvIGRpc3BsYXkgdGhlIHNlbGVjdGVkIHZhbHVlc1xuICAgIC8vIChlLmcuIGBtYXQtc2VsZWN0YCkgYW5kIHRoZXkgZG9uJ3QgaGF2ZSBhIHdheSBvZiBrbm93aW5nIGlmIHRoZSBvcHRpb24ncyBsYWJlbCBoYXMgY2hhbmdlZFxuICAgIC8vIHdlIGhhdmUgdG8gY2hlY2sgZm9yIGNoYW5nZXMgaW4gdGhlIERPTSBvdXJzZWx2ZXMgYW5kIGRpc3BhdGNoIGFuIGV2ZW50LiBUaGVzZSBjaGVja3MgYXJlXG4gICAgLy8gcmVsYXRpdmVseSBjaGVhcCwgaG93ZXZlciB3ZSBzdGlsbCBsaW1pdCB0aGVtIG9ubHkgdG8gc2VsZWN0ZWQgb3B0aW9ucyBpbiBvcmRlciB0byBhdm9pZFxuICAgIC8vIGhpdHRpbmcgdGhlIERPTSB0b28gb2Z0ZW4uXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICBjb25zdCB2aWV3VmFsdWUgPSB0aGlzLnZpZXdWYWx1ZTtcblxuICAgICAgaWYgKHZpZXdWYWx1ZSAhPT0gdGhpcy5fbW9zdFJlY2VudFZpZXdWYWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5fbW9zdFJlY2VudFZpZXdWYWx1ZSkge1xuICAgICAgICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3N0UmVjZW50Vmlld1ZhbHVlID0gdmlld1ZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50LiAqL1xuICBwcml2YXRlIF9lbWl0U2VsZWN0aW9uQ2hhbmdlRXZlbnQoaXNVc2VySW5wdXQgPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2UuZW1pdChuZXcgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPFQ+KHRoaXMsIGlzVXNlcklucHV0KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIGFtb3VudCBvZiBvcHRpb24gZ3JvdXAgbGFiZWxzIHRoYXQgcHJlY2VkZSB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cbiAqIEBwYXJhbSBvcHRpb25JbmRleCBJbmRleCBvZiB0aGUgb3B0aW9uIGF0IHdoaWNoIHRvIHN0YXJ0IGNvdW50aW5nLlxuICogQHBhcmFtIG9wdGlvbnMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9ucy5cbiAqIEBwYXJhbSBvcHRpb25Hcm91cHMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9uIGdyb3Vwcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKFxuICBvcHRpb25JbmRleDogbnVtYmVyLFxuICBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPixcbiAgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+LFxuKTogbnVtYmVyIHtcbiAgaWYgKG9wdGlvbkdyb3Vwcy5sZW5ndGgpIHtcbiAgICBsZXQgb3B0aW9uc0FycmF5ID0gb3B0aW9ucy50b0FycmF5KCk7XG4gICAgbGV0IGdyb3VwcyA9IG9wdGlvbkdyb3Vwcy50b0FycmF5KCk7XG4gICAgbGV0IGdyb3VwQ291bnRlciA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbkluZGV4ICsgMTsgaSsrKSB7XG4gICAgICBpZiAob3B0aW9uc0FycmF5W2ldLmdyb3VwICYmIG9wdGlvbnNBcnJheVtpXS5ncm91cCA9PT0gZ3JvdXBzW2dyb3VwQ291bnRlcl0pIHtcbiAgICAgICAgZ3JvdXBDb3VudGVyKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwQ291bnRlcjtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIHBvc2l0aW9uIHRvIHdoaWNoIHRvIHNjcm9sbCBhIHBhbmVsIGluIG9yZGVyIGZvciBhbiBvcHRpb24gdG8gYmUgaW50byB2aWV3LlxuICogQHBhcmFtIG9wdGlvbk9mZnNldCBPZmZzZXQgb2YgdGhlIG9wdGlvbiBmcm9tIHRoZSB0b3Agb2YgdGhlIHBhbmVsLlxuICogQHBhcmFtIG9wdGlvbkhlaWdodCBIZWlnaHQgb2YgdGhlIG9wdGlvbnMuXG4gKiBAcGFyYW0gY3VycmVudFNjcm9sbFBvc2l0aW9uIEN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBwYW5lbC5cbiAqIEBwYXJhbSBwYW5lbEhlaWdodCBIZWlnaHQgb2YgdGhlIHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uKFxuICBvcHRpb25PZmZzZXQ6IG51bWJlcixcbiAgb3B0aW9uSGVpZ2h0OiBudW1iZXIsXG4gIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjogbnVtYmVyLFxuICBwYW5lbEhlaWdodDogbnVtYmVyLFxuKTogbnVtYmVyIHtcbiAgaWYgKG9wdGlvbk9mZnNldCA8IGN1cnJlbnRTY3JvbGxQb3NpdGlvbikge1xuICAgIHJldHVybiBvcHRpb25PZmZzZXQ7XG4gIH1cblxuICBpZiAob3B0aW9uT2Zmc2V0ICsgb3B0aW9uSGVpZ2h0ID4gY3VycmVudFNjcm9sbFBvc2l0aW9uICsgcGFuZWxIZWlnaHQpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgb3B0aW9uT2Zmc2V0IC0gcGFuZWxIZWlnaHQgKyBvcHRpb25IZWlnaHQpO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjtcbn1cbiIsIjwhLS0gU2V0IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRvIHRoaXMgRE9NIG5vZGUgYW5kIG90aGVyIGRlY29yYXRpdmUgbm9kZXMgaW4gdGhpcyBmaWxlLiBUaGlzIG1pZ2h0XG4gYmUgY29udHJpYnV0aW5nIHRvIGlzc3VlIHdoZXJlIHNvbWV0aW1lcyBWb2ljZU92ZXIgZm9jdXNlcyBvbiBhIFRleHROb2RlIGluIHRoZSBhMTF5IHRyZWUgaW5zdGVhZFxuIG9mIHRoZSBPcHRpb24gbm9kZSAoIzIzMjAyKS4gTW9zdCBhc3Npc3RpdmUgdGVjaG5vbG9neSB3aWxsIGdlbmVyYWxseSBpZ25vcmUgbm9uLXJvbGUsXG4gbm9uLXRleHQtY29udGVudCBlbGVtZW50cy4gQWRkaW5nIGFyaWEtaGlkZGVuIHNlZW1zIHRvIG1ha2UgVm9pY2VPdmVyIGJlaGF2ZSBtb3JlIGNvbnNpc3RlbnRseS4gLS0+XG48bWF0LXBzZXVkby1jaGVja2JveCAqbmdJZj1cIm11bHRpcGxlXCIgY2xhc3M9XCJtYXQtbWRjLW9wdGlvbi1wc2V1ZG8tY2hlY2tib3hcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgIFtzdGF0ZV09XCJzZWxlY3RlZCA/ICdjaGVja2VkJyA6ICd1bmNoZWNrZWQnXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9tYXQtcHNldWRvLWNoZWNrYm94PlxuXG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtaWNvblwiPjwvbmctY29udGVudD5cblxuPHNwYW4gY2xhc3M9XCJtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHRcIiAjdGV4dD48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9zcGFuPlxuXG48IS0tIFJlbmRlciBjaGVja21hcmsgYXQgdGhlIGVuZCBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gLS0+XG48bWF0LXBzZXVkby1jaGVja2JveCAqbmdJZj1cIiFtdWx0aXBsZSAmJiBzZWxlY3RlZCAmJiAhaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvclwiXG4gICAgY2xhc3M9XCJtYXQtbWRjLW9wdGlvbi1wc2V1ZG8tY2hlY2tib3hcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBzdGF0ZT1cImNoZWNrZWRcIlxuICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGFwcGVhcmFuY2U9XCJtaW5pbWFsXCI+PC9tYXQtcHNldWRvLWNoZWNrYm94PlxuXG48IS0tIFNlZSBhMTF5IG5vdGVzIGluc2lkZSBvcHRncm91cC50cyBmb3IgY29udGV4dCBiZWhpbmQgdGhpcyBlbGVtZW50LiAtLT5cbjxzcGFuIGNsYXNzPVwiY2RrLXZpc3VhbGx5LWhpZGRlblwiICpuZ0lmPVwiZ3JvdXAgJiYgZ3JvdXAuX2luZXJ0XCI+KHt7IGdyb3VwLmxhYmVsIH19KTwvc3Bhbj5cblxuPGRpdiBjbGFzcz1cIm1hdC1tZGMtb3B0aW9uLXJpcHBsZSBtYXQtbWRjLWZvY3VzLWluZGljYXRvclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIG1hdC1yaXBwbGVcbiAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwiX2dldEhvc3RFbGVtZW50KClcIiBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZWQgfHwgZGlzYWJsZVJpcHBsZVwiPlxuPC9kaXY+XG4iXX0=