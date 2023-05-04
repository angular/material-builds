import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { Component, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, Optional, Inject, Directive, Input, Output, EventEmitter, ViewChild, } from '@angular/core';
import { Subject } from 'rxjs';
import { MatOptgroup, MAT_OPTGROUP, _MatOptgroupBase } from './optgroup';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
import * as i1 from "./optgroup";
import * as i2 from "../ripple/ripple";
import * as i3 from "@angular/common";
import * as i4 from "../selection/pseudo-checkbox/pseudo-checkbox";
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
class _MatOptionBase {
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
        this._disabled = coerceBooleanProperty(value);
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
    select() {
        if (!this._selected) {
            this._selected = true;
            this._changeDetectorRef.markForCheck();
            this._emitSelectionChangeEvent();
        }
    }
    /** Deselects the option. */
    deselect() {
        if (this._selected) {
            this._selected = false;
            this._changeDetectorRef.markForCheck();
            this._emitSelectionChangeEvent();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatOptionBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: _MatOptionBase, inputs: { value: "value", id: "id", disabled: "disabled" }, outputs: { onSelectionChange: "onSelectionChange" }, viewQueries: [{ propertyName: "_text", first: true, predicate: ["text"], descendants: true, static: true }], ngImport: i0 }); }
}
export { _MatOptionBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: _MatOptionBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined }, { type: i1._MatOptgroupBase }]; }, propDecorators: { value: [{
                type: Input
            }], id: [{
                type: Input
            }], disabled: [{
                type: Input
            }], onSelectionChange: [{
                type: Output
            }], _text: [{
                type: ViewChild,
                args: ['text', { static: true }]
            }] } });
/**
 * Single option inside of a `<mat-select>` element.
 */
class MatOption extends _MatOptionBase {
    constructor(element, changeDetectorRef, parent, group) {
        super(element, changeDetectorRef, parent, group);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOption, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_OPTION_PARENT_COMPONENT, optional: true }, { token: MAT_OPTGROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatOption, selector: "mat-option", host: { attributes: { "role": "option" }, listeners: { "click": "_selectViaInteraction()", "keydown": "_handleKeydown($event)" }, properties: { "class.mdc-list-item--selected": "selected", "class.mat-mdc-option-multiple": "multiple", "class.mat-mdc-option-active": "active", "class.mdc-list-item--disabled": "disabled", "id": "id", "attr.aria-selected": "selected", "attr.aria-disabled": "disabled.toString()" }, classAttribute: "mat-mdc-option mdc-list-item" }, exportAs: ["matOption"], usesInheritance: true, ngImport: i0, template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-mdc-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n<mat-pseudo-checkbox *ngIf=\"!multiple && selected && !hideSingleSelectionIndicator\"\n    class=\"mat-mdc-option-pseudo-checkbox\" state=\"checked\" [disabled]=\"disabled\"\n    appearance=\"minimal\"></mat-pseudo-checkbox>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"], dependencies: [{ kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: ["state", "disabled", "appearance"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatOption };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatOption, decorators: [{
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
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-mdc-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<ng-content select=\"mat-icon\"></ng-content>\n\n<span class=\"mdc-list-item__primary-text\" #text><ng-content></ng-content></span>\n\n<!-- Render checkmark at the end for single-selection. -->\n<mat-pseudo-checkbox *ngIf=\"!multiple && selected && !hideSingleSelectionIndicator\"\n    class=\"mat-mdc-option-pseudo-checkbox\" state=\"checked\" [disabled]=\"disabled\"\n    appearance=\"minimal\"></mat-pseudo-checkbox>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-mdc-option-ripple mat-mdc-focus-indicator\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-mdc-option{display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:16px;padding-right:16px;-webkit-user-select:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:rgba(0,0,0,0);min-height:48px}.mat-mdc-option:focus{outline:none}[dir=rtl] .mat-mdc-option,.mat-mdc-option[dir=rtl]{padding-left:16px;padding-right:16px}.mat-mdc-option.mdc-list-item{align-items:center}.mat-mdc-option.mdc-list-item--disabled{cursor:default;pointer-events:none}.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox,.mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text,.mat-mdc-option.mdc-list-item--disabled>mat-icon{opacity:.38}.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:32px}[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple){padding-left:16px;padding-right:32px}.mat-mdc-option .mat-icon,.mat-mdc-option .mat-pseudo-checkbox-full{margin-right:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-icon,[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full{margin-right:0;margin-left:16px}.mat-mdc-option .mat-pseudo-checkbox-minimal{margin-left:16px;flex-shrink:0}[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal{margin-right:16px;margin-left:0}.mat-mdc-option .mat-mdc-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-mdc-option .mdc-list-item__primary-text{white-space:normal;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;font-family:inherit;text-decoration:inherit;text-transform:inherit;margin-right:auto}[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text{margin-right:0;margin-left:auto}.cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{content:\"\";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}[dir=rtl] .cdk-high-contrast-active .mat-mdc-option.mdc-list-item--selected:not(.mat-mdc-option-multiple)::after{right:auto;left:16px}.mat-mdc-option-active .mat-mdc-focus-indicator::before{content:\"\"}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTION_PARENT_COMPONENT]
                }] }, { type: i1.MatOptgroup, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_OPTGROUP]
                }] }]; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvb3B0aW9uL29wdGlvbi50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL29wdGlvbi9vcHRpb24uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQSxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsVUFBVSxFQUNWLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFFWixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN2RSxPQUFPLEVBQTJCLDJCQUEyQixFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7OztBQUV0Rjs7O0dBR0c7QUFDSCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUV6QixxRUFBcUU7QUFDckUsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQztJQUNFLHNEQUFzRDtJQUMvQyxNQUF5QjtJQUNoQyw4RUFBOEU7SUFDdkUsY0FBYyxLQUFLO1FBRm5CLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBRXpCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0lBQ3pCLENBQUM7Q0FDTDtBQUVELE1BQ2EsY0FBYztJQU16QixvRUFBb0U7SUFDcEUsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FB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QVUsNkJBQTZCLENBQzNDLFdBQW1CLEVBQ25CLE9BQTZCLEVBQzdCLFlBQW9DO0lBRXBDLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtRQUN2QixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckMsSUFBSSxNQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUVyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNFLFlBQVksRUFBRSxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsd0JBQXdCLENBQ3RDLFlBQW9CLEVBQ3BCLFlBQW9CLEVBQ3BCLHFCQUE2QixFQUM3QixXQUFtQjtJQUVuQixJQUFJLFlBQVksR0FBRyxxQkFBcUIsRUFBRTtRQUN4QyxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxxQkFBcUIsR0FBRyxXQUFXLEVBQUU7UUFDckUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDO0tBQy9EO0lBRUQsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNhYmxlT3B0aW9uLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RU5URVIsIGhhc01vZGlmaWVyS2V5LCBTUEFDRX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBFbGVtZW50UmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbiAgRGlyZWN0aXZlLFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBPbkRlc3Ryb3ksXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0T3B0Z3JvdXAsIE1BVF9PUFRHUk9VUCwgX01hdE9wdGdyb3VwQmFzZX0gZnJvbSAnLi9vcHRncm91cCc7XG5pbXBvcnQge01hdE9wdGlvblBhcmVudENvbXBvbmVudCwgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UfSBmcm9tICcuL29wdGlvbi1wYXJlbnQnO1xuXG4vKipcbiAqIE9wdGlvbiBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRPcHRpb24gd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZTxUID0gYW55PiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG9wdGlvbiB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IF9NYXRPcHRpb25CYXNlPFQ+LFxuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGFuZ2UgaW4gdGhlIG9wdGlvbidzIHZhbHVlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlLFxuICApIHt9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRPcHRpb25CYXNlPFQgPSBhbnk+IGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hY3RpdmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFZpZXdWYWx1ZSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB3cmFwcGluZyBjb21wb25lbnQgaXMgaW4gbXVsdGlwbGUgc2VsZWN0aW9uIG1vZGUuICovXG4gIGdldCBtdWx0aXBsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5tdWx0aXBsZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3B0aW9uIGlzIGN1cnJlbnRseSBzZWxlY3RlZC4gKi9cbiAgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgfVxuXG4gIC8qKiBUaGUgZm9ybSB2YWx1ZSBvZiB0aGUgb3B0aW9uLiAqL1xuICBASW5wdXQoKSB2YWx1ZTogVDtcblxuICAvKiogVGhlIHVuaXF1ZSBJRCBvZiB0aGUgb3B0aW9uLiAqL1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1vcHRpb24tJHtfdW5pcXVlSWRDb3VudGVyKyt9YDtcblxuICAvKiogV2hldGhlciB0aGUgb3B0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAuZGlzYWJsZWQpIHx8IHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBmb3IgdGhlIG9wdGlvbiBhcmUgZGlzYWJsZWQuICovXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpc2FibGVSaXBwbGUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdG8gZGlzcGxheSBjaGVja21hcmsgZm9yIHNpbmdsZS1zZWxlY3Rpb24uICovXG4gIGdldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IpO1xuICB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvblNlbGVjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPFQ+PigpO1xuXG4gIC8qKiBFbGVtZW50IGNvbnRhaW5pbmcgdGhlIG9wdGlvbidzIHRleHQuICovXG4gIEBWaWV3Q2hpbGQoJ3RleHQnLCB7c3RhdGljOiB0cnVlfSkgX3RleHQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9uIGNoYW5nZXMgYW5kIGFueSBwYXJlbnRzIGhhdmUgdG8gYmUgbm90aWZpZWQuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHB1YmxpYyBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX3BhcmVudDogTWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LFxuICAgIHJlYWRvbmx5IGdyb3VwOiBfTWF0T3B0Z3JvdXBCYXNlLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBvcHRpb24gaXMgY3VycmVudGx5IGFjdGl2ZSBhbmQgcmVhZHkgdG8gYmUgc2VsZWN0ZWQuXG4gICAqIEFuIGFjdGl2ZSBvcHRpb24gZGlzcGxheXMgc3R5bGVzIGFzIGlmIGl0IGlzIGZvY3VzZWQsIGJ1dCB0aGVcbiAgICogZm9jdXMgaXMgYWN0dWFsbHkgcmV0YWluZWQgc29tZXdoZXJlIGVsc2UuIFRoaXMgY29tZXMgaW4gaGFuZHlcbiAgICogZm9yIGNvbXBvbmVudHMgbGlrZSBhdXRvY29tcGxldGUgd2hlcmUgZm9jdXMgbXVzdCByZW1haW4gb24gdGhlIGlucHV0LlxuICAgKi9cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkaXNwbGF5ZWQgdmFsdWUgb2YgdGhlIG9wdGlvbi4gSXQgaXMgbmVjZXNzYXJ5IHRvIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGVcbiAgICogc2VsZWN0J3MgdHJpZ2dlci5cbiAgICovXG4gIGdldCB2aWV3VmFsdWUoKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPKGthcmEpOiBBZGQgaW5wdXQgcHJvcGVydHkgYWx0ZXJuYXRpdmUgZm9yIG5vZGUgZW52cy5cbiAgICByZXR1cm4gKHRoaXMuX3RleHQ/Lm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb24uICovXG4gIHNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgdGhlIG9wdGlvbi4gKi9cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9lbWl0U2VsZWN0aW9uQ2hhbmdlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyBmb2N1cyBvbnRvIHRoaXMgb3B0aW9uLiAqL1xuICBmb2N1cyhfb3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgYXJlbid0IHVzaW5nIGBfb3JpZ2luYCwgYnV0IHdlIG5lZWQgdG8ga2VlcCBpdCBiZWNhdXNlIHNvbWUgaW50ZXJuYWwgY29uc3VtZXJzXG4gICAgLy8gdXNlIGBNYXRPcHRpb25gIGluIGEgYEZvY3VzS2V5TWFuYWdlcmAgYW5kIHdlIG5lZWQgaXQgdG8gbWF0Y2ggYEZvY3VzYWJsZU9wdGlvbmAuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2dldEhvc3RFbGVtZW50KCk7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgZGlzcGxheSBzdHlsZXMgb24gdGhlIG9wdGlvbiB0byBtYWtlIGl0IGFwcGVhclxuICAgKiBhY3RpdmUuIFRoaXMgaXMgdXNlZCBieSB0aGUgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXIgc28ga2V5XG4gICAqIGV2ZW50cyB3aWxsIGRpc3BsYXkgdGhlIHByb3BlciBvcHRpb25zIGFzIGFjdGl2ZSBvbiBhcnJvdyBrZXkgZXZlbnRzLlxuICAgKi9cbiAgc2V0QWN0aXZlU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWN0aXZlKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJlbW92ZXMgZGlzcGxheSBzdHlsZXMgb24gdGhlIG9wdGlvbiB0aGF0IG1hZGUgaXQgYXBwZWFyXG4gICAqIGFjdGl2ZS4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciBzbyBrZXlcbiAgICogZXZlbnRzIHdpbGwgZGlzcGxheSB0aGUgcHJvcGVyIG9wdGlvbnMgYXMgYWN0aXZlIG9uIGFycm93IGtleSBldmVudHMuXG4gICAqL1xuICBzZXRJbmFjdGl2ZVN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYWN0aXZlKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCB0byBiZSB1c2VkIHdoZW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgb3B0aW9uIHNob3VsZCBiZSBmb2N1c2VkLiAqL1xuICBnZXRMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBFbnN1cmVzIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQgd2hlbiBhY3RpdmF0ZWQgZnJvbSB0aGUga2V5Ym9hcmQuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKChldmVudC5rZXlDb2RlID09PSBFTlRFUiB8fCBldmVudC5rZXlDb2RlID09PSBTUEFDRSkgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgdGhpcy5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcblxuICAgICAgLy8gUHJldmVudCB0aGUgcGFnZSBmcm9tIHNjcm9sbGluZyBkb3duIGFuZCBmb3JtIHN1Ym1pdHMuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBgU2VsZWN0cyB0aGUgb3B0aW9uIHdoaWxlIGluZGljYXRpbmcgdGhlIHNlbGVjdGlvbiBjYW1lIGZyb20gdGhlIHVzZXIuIFVzZWQgdG9cbiAgICogZGV0ZXJtaW5lIGlmIHRoZSBzZWxlY3QncyB2aWV3IC0+IG1vZGVsIGNhbGxiYWNrIHNob3VsZCBiZSBpbnZva2VkLmBcbiAgICovXG4gIF9zZWxlY3RWaWFJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5tdWx0aXBsZSA/ICF0aGlzLl9zZWxlY3RlZCA6IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgY29ycmVjdCB0YWJpbmRleCBmb3IgdGhlIG9wdGlvbiBkZXBlbmRpbmcgb24gZGlzYWJsZWQgc3RhdGUuICovXG4gIC8vIFRoaXMgbWV0aG9kIGlzIG9ubHkgdXNlZCBieSBgTWF0TGVnYWN5T3B0aW9uYC4gS2VlcGluZyBpdCBoZXJlIHRvIGF2b2lkIGJyZWFraW5nIHRoZSB0eXBlcy5cbiAgLy8gVGhhdCdzIGJlY2F1c2UgYE1hdExlZ2FjeU9wdGlvbmAgdXNlIGBNYXRPcHRpb25gIHR5cGUgaW4gYSBmZXcgcGxhY2VzIHN1Y2ggYXNcbiAgLy8gYE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZWAuIEl0IGlzIHNhZmUgdG8gZGVsZXRlIHRoaXMgd2hlbiBgTWF0TGVnYWN5T3B0aW9uYCBpcyBkZWxldGVkLlxuICBfZ2V0VGFiSW5kZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICctMScgOiAnMCc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaG9zdCBET00gZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIC8vIFNpbmNlIHBhcmVudCBjb21wb25lbnRzIGNvdWxkIGJlIHVzaW5nIHRoZSBvcHRpb24ncyBsYWJlbCB0byBkaXNwbGF5IHRoZSBzZWxlY3RlZCB2YWx1ZXNcbiAgICAvLyAoZS5nLiBgbWF0LXNlbGVjdGApIGFuZCB0aGV5IGRvbid0IGhhdmUgYSB3YXkgb2Yga25vd2luZyBpZiB0aGUgb3B0aW9uJ3MgbGFiZWwgaGFzIGNoYW5nZWRcbiAgICAvLyB3ZSBoYXZlIHRvIGNoZWNrIGZvciBjaGFuZ2VzIGluIHRoZSBET00gb3Vyc2VsdmVzIGFuZCBkaXNwYXRjaCBhbiBldmVudC4gVGhlc2UgY2hlY2tzIGFyZVxuICAgIC8vIHJlbGF0aXZlbHkgY2hlYXAsIGhvd2V2ZXIgd2Ugc3RpbGwgbGltaXQgdGhlbSBvbmx5IHRvIHNlbGVjdGVkIG9wdGlvbnMgaW4gb3JkZXIgdG8gYXZvaWRcbiAgICAvLyBoaXR0aW5nIHRoZSBET00gdG9vIG9mdGVuLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgY29uc3Qgdmlld1ZhbHVlID0gdGhpcy52aWV3VmFsdWU7XG5cbiAgICAgIGlmICh2aWV3VmFsdWUgIT09IHRoaXMuX21vc3RSZWNlbnRWaWV3VmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vc3RSZWNlbnRWaWV3VmFsdWUpIHtcbiAgICAgICAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW9zdFJlY2VudFZpZXdWYWx1ZSA9IHZpZXdWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0aW9uIGNoYW5nZSBldmVudC4gKi9cbiAgcHJpdmF0ZSBfZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KGlzVXNlcklucHV0ID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQobmV3IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZTxUPih0aGlzLCBpc1VzZXJJbnB1dCkpO1xuICB9XG59XG5cbi8qKlxuICogU2luZ2xlIG9wdGlvbiBpbnNpZGUgb2YgYSBgPG1hdC1zZWxlY3Q+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0aW9uJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRpb24nLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2NsYXNzLm1kYy1saXN0LWl0ZW0tLXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW9wdGlvbi1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbY2xhc3MubWF0LW1kYy1vcHRpb24tYWN0aXZlXSc6ICdhY3RpdmUnLFxuICAgICdbY2xhc3MubWRjLWxpc3QtaXRlbS0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgLy8gU2V0IGFyaWEtc2VsZWN0ZWQgdG8gZmFsc2UgZm9yIG5vbi1zZWxlY3RlZCBpdGVtcyBhbmQgdHJ1ZSBmb3Igc2VsZWN0ZWQgaXRlbXMuIENvbmZvcm0gdG9cbiAgICAvLyBbV0FJIEFSSUEgTGlzdGJveCBhdXRob3JpbmcgcHJhY3RpY2VzIGd1aWRlXShcbiAgICAvLyAgaHR0cHM6Ly93d3cudzMub3JnL1dBSS9BUklBL2FwZy9wYXR0ZXJucy9saXN0Ym94LyksIFwiSWYgYW55IG9wdGlvbnMgYXJlIHNlbGVjdGVkLCBlYWNoXG4gICAgLy8gc2VsZWN0ZWQgb3B0aW9uIGhhcyBlaXRoZXIgYXJpYS1zZWxlY3RlZCBvciBhcmlhLWNoZWNrZWQgIHNldCB0byB0cnVlLiBBbGwgb3B0aW9ucyB0aGF0IGFyZVxuICAgIC8vIHNlbGVjdGFibGUgYnV0IG5vdCBzZWxlY3RlZCBoYXZlIGVpdGhlciBhcmlhLXNlbGVjdGVkIG9yIGFyaWEtY2hlY2tlZCBzZXQgdG8gZmFsc2UuXCIgQWxpZ25cbiAgICAvLyBhcmlhLXNlbGVjdGVkIGltcGxlbWVudGF0aW9uIG9mIENoaXBzIGFuZCBMaXN0IGNvbXBvbmVudHMuXG4gICAgLy9cbiAgICAvLyBTZXQgYGFyaWEtc2VsZWN0ZWQ9XCJmYWxzZVwiYCBvbiBub3Qtc2VsZWN0ZWQgbGlzdGJveCBvcHRpb25zIHRvIGZpeCBWb2ljZU92ZXIgYW5ub3VuY2luZ1xuICAgIC8vIGV2ZXJ5IG9wdGlvbiBhcyBcInNlbGVjdGVkXCIgKCMyMTQ5MSkuXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJyhjbGljayknOiAnX3NlbGVjdFZpYUludGVyYWN0aW9uKCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtb3B0aW9uIG1kYy1saXN0LWl0ZW0nLFxuICB9LFxuICBzdHlsZVVybHM6IFsnb3B0aW9uLmNzcyddLFxuICB0ZW1wbGF0ZVVybDogJ29wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdE9wdGlvbjxUID0gYW55PiBleHRlbmRzIF9NYXRPcHRpb25CYXNlPFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UKSBwYXJlbnQ6IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9PUFRHUk9VUCkgZ3JvdXA6IE1hdE9wdGdyb3VwLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50LCBjaGFuZ2VEZXRlY3RvclJlZiwgcGFyZW50LCBncm91cCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIGFtb3VudCBvZiBvcHRpb24gZ3JvdXAgbGFiZWxzIHRoYXQgcHJlY2VkZSB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cbiAqIEBwYXJhbSBvcHRpb25JbmRleCBJbmRleCBvZiB0aGUgb3B0aW9uIGF0IHdoaWNoIHRvIHN0YXJ0IGNvdW50aW5nLlxuICogQHBhcmFtIG9wdGlvbnMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9ucy5cbiAqIEBwYXJhbSBvcHRpb25Hcm91cHMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9uIGdyb3Vwcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKFxuICBvcHRpb25JbmRleDogbnVtYmVyLFxuICBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPixcbiAgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+LFxuKTogbnVtYmVyIHtcbiAgaWYgKG9wdGlvbkdyb3Vwcy5sZW5ndGgpIHtcbiAgICBsZXQgb3B0aW9uc0FycmF5ID0gb3B0aW9ucy50b0FycmF5KCk7XG4gICAgbGV0IGdyb3VwcyA9IG9wdGlvbkdyb3Vwcy50b0FycmF5KCk7XG4gICAgbGV0IGdyb3VwQ291bnRlciA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbkluZGV4ICsgMTsgaSsrKSB7XG4gICAgICBpZiAob3B0aW9uc0FycmF5W2ldLmdyb3VwICYmIG9wdGlvbnNBcnJheVtpXS5ncm91cCA9PT0gZ3JvdXBzW2dyb3VwQ291bnRlcl0pIHtcbiAgICAgICAgZ3JvdXBDb3VudGVyKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyb3VwQ291bnRlcjtcbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIHBvc2l0aW9uIHRvIHdoaWNoIHRvIHNjcm9sbCBhIHBhbmVsIGluIG9yZGVyIGZvciBhbiBvcHRpb24gdG8gYmUgaW50byB2aWV3LlxuICogQHBhcmFtIG9wdGlvbk9mZnNldCBPZmZzZXQgb2YgdGhlIG9wdGlvbiBmcm9tIHRoZSB0b3Agb2YgdGhlIHBhbmVsLlxuICogQHBhcmFtIG9wdGlvbkhlaWdodCBIZWlnaHQgb2YgdGhlIG9wdGlvbnMuXG4gKiBAcGFyYW0gY3VycmVudFNjcm9sbFBvc2l0aW9uIEN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBwYW5lbC5cbiAqIEBwYXJhbSBwYW5lbEhlaWdodCBIZWlnaHQgb2YgdGhlIHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uKFxuICBvcHRpb25PZmZzZXQ6IG51bWJlcixcbiAgb3B0aW9uSGVpZ2h0OiBudW1iZXIsXG4gIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjogbnVtYmVyLFxuICBwYW5lbEhlaWdodDogbnVtYmVyLFxuKTogbnVtYmVyIHtcbiAgaWYgKG9wdGlvbk9mZnNldCA8IGN1cnJlbnRTY3JvbGxQb3NpdGlvbikge1xuICAgIHJldHVybiBvcHRpb25PZmZzZXQ7XG4gIH1cblxuICBpZiAob3B0aW9uT2Zmc2V0ICsgb3B0aW9uSGVpZ2h0ID4gY3VycmVudFNjcm9sbFBvc2l0aW9uICsgcGFuZWxIZWlnaHQpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgb3B0aW9uT2Zmc2V0IC0gcGFuZWxIZWlnaHQgKyBvcHRpb25IZWlnaHQpO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjtcbn1cbiIsIjxtYXQtcHNldWRvLWNoZWNrYm94ICpuZ0lmPVwibXVsdGlwbGVcIiBjbGFzcz1cIm1hdC1tZGMtb3B0aW9uLXBzZXVkby1jaGVja2JveFwiXG4gICAgW3N0YXRlXT1cInNlbGVjdGVkID8gJ2NoZWNrZWQnIDogJ3VuY2hlY2tlZCdcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj48L21hdC1wc2V1ZG8tY2hlY2tib3g+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1pY29uXCI+PC9uZy1jb250ZW50PlxuXG48c3BhbiBjbGFzcz1cIm1kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dFwiICN0ZXh0PjxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG5cbjwhLS0gUmVuZGVyIGNoZWNrbWFyayBhdCB0aGUgZW5kIGZvciBzaW5nbGUtc2VsZWN0aW9uLiAtLT5cbjxtYXQtcHNldWRvLWNoZWNrYm94ICpuZ0lmPVwiIW11bHRpcGxlICYmIHNlbGVjdGVkICYmICFoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yXCJcbiAgICBjbGFzcz1cIm1hdC1tZGMtb3B0aW9uLXBzZXVkby1jaGVja2JveFwiIHN0YXRlPVwiY2hlY2tlZFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgYXBwZWFyYW5jZT1cIm1pbmltYWxcIj48L21hdC1wc2V1ZG8tY2hlY2tib3g+XG5cbjwhLS0gU2VlIGExMXkgbm90ZXMgaW5zaWRlIG9wdGdyb3VwLnRzIGZvciBjb250ZXh0IGJlaGluZCB0aGlzIGVsZW1lbnQuIC0tPlxuPHNwYW4gY2xhc3M9XCJjZGstdmlzdWFsbHktaGlkZGVuXCIgKm5nSWY9XCJncm91cCAmJiBncm91cC5faW5lcnRcIj4oe3sgZ3JvdXAubGFiZWwgfX0pPC9zcGFuPlxuXG48ZGl2IGNsYXNzPVwibWF0LW1kYy1vcHRpb24tcmlwcGxlIG1hdC1tZGMtZm9jdXMtaW5kaWNhdG9yXCIgbWF0LXJpcHBsZVxuICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiXG4gICAgIFttYXRSaXBwbGVEaXNhYmxlZF09XCJkaXNhYmxlZCB8fCBkaXNhYmxlUmlwcGxlXCI+XG48L2Rpdj5cbiJdfQ==