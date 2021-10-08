/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation, Directive, } from '@angular/core';
import { Subject } from 'rxjs';
import { MatOptgroup, _MatOptgroupBase, MAT_OPTGROUP } from './optgroup';
import { MAT_OPTION_PARENT_COMPONENT } from './option-parent';
import * as i0 from "@angular/core";
import * as i1 from "./optgroup";
import * as i2 from "../selection/pseudo-checkbox/pseudo-checkbox";
import * as i3 from "@angular/common";
import * as i4 from "../ripple/ripple";
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
export class _MatOptionBase {
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
    /** Whether the wrapping component is in multiple selection mode. */
    get multiple() { return this._parent && this._parent.multiple; }
    /** Whether or not the option is currently selected. */
    get selected() { return this._selected; }
    /** Whether the option is disabled. */
    get disabled() { return (this.group && this.group.disabled) || this._disabled; }
    set disabled(value) { this._disabled = coerceBooleanProperty(value); }
    /** Whether ripples for the option are disabled. */
    get disableRipple() { return this._parent && this._parent.disableRipple; }
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
        return (this._getHostElement().textContent || '').trim();
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
    /**
     * Gets the `aria-selected` value for the option. We explicitly omit the `aria-selected`
     * attribute from single-selection, unselected options. Including the `aria-selected="false"`
     * attributes adds a significant amount of noise to screen-reader users without providing useful
     * information.
     */
    _getAriaSelected() {
        return this.selected || (this.multiple ? false : null);
    }
    /** Returns the correct tabindex for the option depending on disabled state. */
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
                this._mostRecentViewValue = viewValue;
                this._stateChanges.next();
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
}
_MatOptionBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatOptionBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatOptionBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatOptionBase, inputs: { value: "value", id: "id", disabled: "disabled" }, outputs: { onSelectionChange: "onSelectionChange" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatOptionBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: undefined }, { type: i1._MatOptgroupBase }]; }, propDecorators: { value: [{
                type: Input
            }], id: [{
                type: Input
            }], disabled: [{
                type: Input
            }], onSelectionChange: [{
                type: Output
            }] } });
/**
 * Single option inside of a `<mat-select>` element.
 */
export class MatOption extends _MatOptionBase {
    constructor(element, changeDetectorRef, parent, group) {
        super(element, changeDetectorRef, parent, group);
    }
}
MatOption.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatOption, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: MAT_OPTION_PARENT_COMPONENT, optional: true }, { token: MAT_OPTGROUP, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatOption.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatOption, selector: "mat-option", host: { attributes: { "role": "option" }, listeners: { "click": "_selectViaInteraction()", "keydown": "_handleKeydown($event)" }, properties: { "attr.tabindex": "_getTabIndex()", "class.mat-selected": "selected", "class.mat-option-multiple": "multiple", "class.mat-active": "active", "id": "id", "attr.aria-selected": "_getAriaSelected()", "attr.aria-disabled": "disabled.toString()", "class.mat-option-disabled": "disabled" }, classAttribute: "mat-option mat-focus-indicator" }, exportAs: ["matOption"], usesInheritance: true, ngImport: i0, template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<span class=\"mat-option-text\"><ng-content></ng-content></span>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-option-ripple\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative;cursor:pointer;outline:none;display:flex;flex-direction:row;max-width:100%;box-sizing:border-box;align-items:center;-webkit-tap-highlight-color:transparent}.mat-option[disabled]{cursor:default}[dir=rtl] .mat-option{text-align:right}.mat-option .mat-icon{margin-right:16px;vertical-align:middle}.mat-option .mat-icon svg{vertical-align:top}[dir=rtl] .mat-option .mat-icon{margin-left:16px;margin-right:0}.mat-option[aria-disabled=true]{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:default}.mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:32px}[dir=rtl] .mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:16px;padding-right:32px}.cdk-high-contrast-active .mat-option{margin:0 1px}.cdk-high-contrast-active .mat-option.mat-active{border:solid 1px currentColor;margin:0}.cdk-high-contrast-active .mat-option[aria-disabled=true]{opacity:.5}.mat-option-text{display:inline-block;flex-grow:1;overflow:hidden;text-overflow:ellipsis}.mat-option .mat-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-option-pseudo-checkbox{margin-right:8px}[dir=rtl] .mat-option-pseudo-checkbox{margin-left:8px;margin-right:0}\n"], components: [{ type: i2.MatPseudoCheckbox, selector: "mat-pseudo-checkbox", inputs: ["state", "disabled"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatOption, decorators: [{
            type: Component,
            args: [{ selector: 'mat-option', exportAs: 'matOption', host: {
                        'role': 'option',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[class.mat-selected]': 'selected',
                        '[class.mat-option-multiple]': 'multiple',
                        '[class.mat-active]': 'active',
                        '[id]': 'id',
                        '[attr.aria-selected]': '_getAriaSelected()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[class.mat-option-disabled]': 'disabled',
                        '(click)': '_selectViaInteraction()',
                        '(keydown)': '_handleKeydown($event)',
                        'class': 'mat-option mat-focus-indicator',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<span class=\"mat-option-text\"><ng-content></ng-content></span>\n\n<!-- See a11y notes inside optgroup.ts for context behind this element. -->\n<span class=\"cdk-visually-hidden\" *ngIf=\"group && group._inert\">({{ group.label }})</span>\n\n<div class=\"mat-option-ripple\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n", styles: [".mat-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative;cursor:pointer;outline:none;display:flex;flex-direction:row;max-width:100%;box-sizing:border-box;align-items:center;-webkit-tap-highlight-color:transparent}.mat-option[disabled]{cursor:default}[dir=rtl] .mat-option{text-align:right}.mat-option .mat-icon{margin-right:16px;vertical-align:middle}.mat-option .mat-icon svg{vertical-align:top}[dir=rtl] .mat-option .mat-icon{margin-left:16px;margin-right:0}.mat-option[aria-disabled=true]{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:default}.mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:32px}[dir=rtl] .mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:16px;padding-right:32px}.cdk-high-contrast-active .mat-option{margin:0 1px}.cdk-high-contrast-active .mat-option.mat-active{border:solid 1px currentColor;margin:0}.cdk-high-contrast-active .mat-option[aria-disabled=true]{opacity:.5}.mat-option-text{display:inline-block;flex-grow:1;overflow:hidden;text-overflow:ellipsis}.mat-option .mat-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-option-pseudo-checkbox{margin-right:8px}[dir=rtl] .mat-option-pseudo-checkbox{margin-left:8px;margin-right:0}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvb3B0aW9uL29wdGlvbi50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL29wdGlvbi9vcHRpb24uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBRU4saUJBQWlCLEVBQ2pCLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZFLE9BQU8sRUFBMkIsMkJBQTJCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7O0FBRXRGOzs7R0FHRztBQUNILElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0FBRXpCLHFFQUFxRTtBQUNyRSxNQUFNLE9BQU8sd0JBQXdCO0lBQ25DO0lBQ0Usc0RBQXNEO0lBQy9DLE1BQXNCO0lBQzdCLDhFQUE4RTtJQUN2RSxjQUFjLEtBQUs7UUFGbkIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFFdEIsZ0JBQVcsR0FBWCxXQUFXLENBQVE7SUFBSSxDQUFDO0NBQ2xDO0FBR0QsTUFBTSxPQUFPLGNBQWM7SUFpQ3pCLFlBQ1UsUUFBaUMsRUFDakMsa0JBQXFDLEVBQ3JDLE9BQWlDLEVBQ2hDLEtBQXVCO1FBSHhCLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ2pDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsWUFBTyxHQUFQLE9BQU8sQ0FBMEI7UUFDaEMsVUFBSyxHQUFMLEtBQUssQ0FBa0I7UUFwQzFCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLHlCQUFvQixHQUFHLEVBQUUsQ0FBQztRQVdsQyxtQ0FBbUM7UUFDMUIsT0FBRSxHQUFXLGNBQWMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDO1FBVXpELCtEQUErRDtRQUMvRCwrQ0FBK0M7UUFDNUIsc0JBQWlCLEdBQUcsSUFBSSxZQUFZLEVBQTRCLENBQUM7UUFFcEYsc0ZBQXNGO1FBQzdFLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQU1SLENBQUM7SUEvQnRDLG9FQUFvRTtJQUNwRSxJQUFJLFFBQVEsS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBRWhFLHVEQUF1RDtJQUN2RCxJQUFJLFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBUWxELHNDQUFzQztJQUN0QyxJQUNJLFFBQVEsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLElBQUksUUFBUSxDQUFDLEtBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRSxtREFBbUQ7SUFDbkQsSUFBSSxhQUFhLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQWUxRTs7Ozs7T0FLRztJQUNILElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsNERBQTREO1FBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsTUFBTTtRQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN2QyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCw0QkFBNEI7SUFDNUIsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLEtBQUssQ0FBQyxPQUFxQixFQUFFLE9BQXNCO1FBQ2pELDhGQUE4RjtRQUM5RixvRkFBb0Y7UUFDcEYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXZDLElBQUksT0FBTyxPQUFPLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxlQUFlO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUI7UUFDZixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELHVGQUF1RjtJQUN2RixRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCx1RUFBdUU7SUFDdkUsY0FBYyxDQUFDLEtBQW9CO1FBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xGLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBRTdCLHlEQUF5RDtZQUN6RCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDeEQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGdCQUFnQjtRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELCtFQUErRTtJQUMvRSxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNwQyxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxrQkFBa0I7UUFDaEIsMkZBQTJGO1FBQzNGLDZGQUE2RjtRQUM3Riw0RkFBNEY7UUFDNUYsMkZBQTJGO1FBQzNGLDZCQUE2QjtRQUM3QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUVqQyxJQUFJLFNBQVMsS0FBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0I7U0FDRjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsd0NBQXdDO0lBQ2hDLHlCQUF5QixDQUFDLFdBQVcsR0FBRyxLQUFLO1FBQ25ELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDOzttSEFyTFUsY0FBYzt1R0FBZCxjQUFjO21HQUFkLGNBQWM7a0JBRDFCLFNBQVM7cUxBY0MsS0FBSztzQkFBYixLQUFLO2dCQUdHLEVBQUU7c0JBQVYsS0FBSztnQkFJRixRQUFRO3NCQURYLEtBQUs7Z0JBU2EsaUJBQWlCO3NCQUFuQyxNQUFNOztBQThKVDs7R0FFRztBQXVCSCxNQUFNLE9BQU8sU0FBVSxTQUFRLGNBQWM7SUFDM0MsWUFDRSxPQUFnQyxFQUNoQyxpQkFBb0MsRUFDYSxNQUFnQyxFQUMvQyxLQUFrQjtRQUNwRCxLQUFLLENBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs4R0FQVSxTQUFTLDZFQUlFLDJCQUEyQiw2QkFDM0IsWUFBWTtrR0FMdkIsU0FBUyxra0JDbFF0Qixxa0JBWUE7bUdEc1BhLFNBQVM7a0JBdEJyQixTQUFTOytCQUNFLFlBQVksWUFDWixXQUFXLFFBQ2Y7d0JBQ0osTUFBTSxFQUFFLFFBQVE7d0JBQ2hCLGlCQUFpQixFQUFFLGdCQUFnQjt3QkFDbkMsc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsb0JBQW9CLEVBQUUsUUFBUTt3QkFDOUIsTUFBTSxFQUFFLElBQUk7d0JBQ1osc0JBQXNCLEVBQUUsb0JBQW9CO3dCQUM1QyxzQkFBc0IsRUFBRSxxQkFBcUI7d0JBQzdDLDZCQUE2QixFQUFFLFVBQVU7d0JBQ3pDLFNBQVMsRUFBRSx5QkFBeUI7d0JBQ3BDLFdBQVcsRUFBRSx3QkFBd0I7d0JBQ3JDLE9BQU8sRUFBRSxnQ0FBZ0M7cUJBQzFDLGlCQUdjLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OzBCQU01QyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLDJCQUEyQjs7MEJBQzlDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsWUFBWTs7QUFLcEM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLDZCQUE2QixDQUFDLFdBQW1CLEVBQUUsT0FBNkIsRUFDOUYsWUFBb0M7SUFFcEMsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDM0UsWUFBWSxFQUFFLENBQUM7YUFDaEI7U0FDRjtRQUVELE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxZQUFvQixFQUFFLFlBQW9CLEVBQy9FLHFCQUE2QixFQUFFLFdBQW1CO0lBQ3BELElBQUksWUFBWSxHQUFHLHFCQUFxQixFQUFFO1FBQ3hDLE9BQU8sWUFBWSxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxZQUFZLEdBQUcsWUFBWSxHQUFHLHFCQUFxQixHQUFHLFdBQVcsRUFBRTtRQUNyRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDLENBQUM7S0FDL0Q7SUFFRCxPQUFPLHFCQUFxQixDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RU5URVIsIFNQQUNFLCBoYXNNb2RpZmllcktleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0NoZWNrZWQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9jdXNPcHRpb25zLCBGb2N1c2FibGVPcHRpb24sIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRPcHRncm91cCwgX01hdE9wdGdyb3VwQmFzZSwgTUFUX09QVEdST1VQfSBmcm9tICcuL29wdGdyb3VwJztcbmltcG9ydCB7TWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LCBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlR9IGZyb20gJy4vb3B0aW9uLXBhcmVudCc7XG5cbi8qKlxuICogT3B0aW9uIElEcyBuZWVkIHRvIGJlIHVuaXF1ZSBhY3Jvc3MgY29tcG9uZW50cywgc28gdGhpcyBjb3VudGVyIGV4aXN0cyBvdXRzaWRlIG9mXG4gKiB0aGUgY29tcG9uZW50IGRlZmluaXRpb24uXG4gKi9cbmxldCBfdW5pcXVlSWRDb3VudGVyID0gMDtcblxuLyoqIEV2ZW50IG9iamVjdCBlbWl0dGVkIGJ5IE1hdE9wdGlvbiB3aGVuIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgb3B0aW9uIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogX01hdE9wdGlvbkJhc2UsXG4gICAgLyoqIFdoZXRoZXIgdGhlIGNoYW5nZSBpbiB0aGUgb3B0aW9uJ3MgdmFsdWUgd2FzIGEgcmVzdWx0IG9mIGEgdXNlciBhY3Rpb24uICovXG4gICAgcHVibGljIGlzVXNlcklucHV0ID0gZmFsc2UpIHsgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBfTWF0T3B0aW9uQmFzZSBpbXBsZW1lbnRzIEZvY3VzYWJsZU9wdGlvbiwgQWZ0ZXJWaWV3Q2hlY2tlZCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfc2VsZWN0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfYWN0aXZlID0gZmFsc2U7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX21vc3RSZWNlbnRWaWV3VmFsdWUgPSAnJztcblxuICAvKiogV2hldGhlciB0aGUgd3JhcHBpbmcgY29tcG9uZW50IGlzIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLiAqL1xuICBnZXQgbXVsdGlwbGUoKSB7IHJldHVybiB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50Lm11bHRpcGxlOyB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvcHRpb24gaXMgY3VycmVudGx5IHNlbGVjdGVkLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zZWxlY3RlZDsgfVxuXG4gIC8qKiBUaGUgZm9ybSB2YWx1ZSBvZiB0aGUgb3B0aW9uLiAqL1xuICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gIC8qKiBUaGUgdW5pcXVlIElEIG9mIHRoZSBvcHRpb24uICovXG4gIEBJbnB1dCgpIGlkOiBzdHJpbmcgPSBgbWF0LW9wdGlvbi0ke191bmlxdWVJZENvdW50ZXIrK31gO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuICh0aGlzLmdyb3VwICYmIHRoaXMuZ3JvdXAuZGlzYWJsZWQpIHx8IHRoaXMuX2Rpc2FibGVkOyB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7IHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTsgfVxuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgZm9yIHRoZSBvcHRpb24gYXJlIGRpc2FibGVkLiAqL1xuICBnZXQgZGlzYWJsZVJpcHBsZSgpIHsgcmV0dXJuIHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlzYWJsZVJpcHBsZTsgfVxuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG9wdGlvbiBpcyBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeFxuICBAT3V0cHV0KCkgcmVhZG9ubHkgb25TZWxlY3Rpb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT4oKTtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgc3RhdGUgb2YgdGhlIG9wdGlvbiBjaGFuZ2VzIGFuZCBhbnkgcGFyZW50cyBoYXZlIHRvIGJlIG5vdGlmaWVkLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfcGFyZW50OiBNYXRPcHRpb25QYXJlbnRDb21wb25lbnQsXG4gICAgcmVhZG9ubHkgZ3JvdXA6IF9NYXRPcHRncm91cEJhc2UpIHt9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoZSBvcHRpb24gaXMgY3VycmVudGx5IGFjdGl2ZSBhbmQgcmVhZHkgdG8gYmUgc2VsZWN0ZWQuXG4gICAqIEFuIGFjdGl2ZSBvcHRpb24gZGlzcGxheXMgc3R5bGVzIGFzIGlmIGl0IGlzIGZvY3VzZWQsIGJ1dCB0aGVcbiAgICogZm9jdXMgaXMgYWN0dWFsbHkgcmV0YWluZWQgc29tZXdoZXJlIGVsc2UuIFRoaXMgY29tZXMgaW4gaGFuZHlcbiAgICogZm9yIGNvbXBvbmVudHMgbGlrZSBhdXRvY29tcGxldGUgd2hlcmUgZm9jdXMgbXVzdCByZW1haW4gb24gdGhlIGlucHV0LlxuICAgKi9cbiAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkaXNwbGF5ZWQgdmFsdWUgb2YgdGhlIG9wdGlvbi4gSXQgaXMgbmVjZXNzYXJ5IHRvIHNob3cgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGVcbiAgICogc2VsZWN0J3MgdHJpZ2dlci5cbiAgICovXG4gIGdldCB2aWV3VmFsdWUoKTogc3RyaW5nIHtcbiAgICAvLyBUT0RPKGthcmEpOiBBZGQgaW5wdXQgcHJvcGVydHkgYWx0ZXJuYXRpdmUgZm9yIG5vZGUgZW52cy5cbiAgICByZXR1cm4gKHRoaXMuX2dldEhvc3RFbGVtZW50KCkudGV4dENvbnRlbnQgfHwgJycpLnRyaW0oKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb24uICovXG4gIHNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXNlbGVjdHMgdGhlIG9wdGlvbi4gKi9cbiAgZGVzZWxlY3QoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9lbWl0U2VsZWN0aW9uQ2hhbmdlRXZlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyBmb2N1cyBvbnRvIHRoaXMgb3B0aW9uLiAqL1xuICBmb2N1cyhfb3JpZ2luPzogRm9jdXNPcmlnaW4sIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgYXJlbid0IHVzaW5nIGBfb3JpZ2luYCwgYnV0IHdlIG5lZWQgdG8ga2VlcCBpdCBiZWNhdXNlIHNvbWUgaW50ZXJuYWwgY29uc3VtZXJzXG4gICAgLy8gdXNlIGBNYXRPcHRpb25gIGluIGEgYEZvY3VzS2V5TWFuYWdlcmAgYW5kIHdlIG5lZWQgaXQgdG8gbWF0Y2ggYEZvY3VzYWJsZU9wdGlvbmAuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2dldEhvc3RFbGVtZW50KCk7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgZGlzcGxheSBzdHlsZXMgb24gdGhlIG9wdGlvbiB0byBtYWtlIGl0IGFwcGVhclxuICAgKiBhY3RpdmUuIFRoaXMgaXMgdXNlZCBieSB0aGUgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXIgc28ga2V5XG4gICAqIGV2ZW50cyB3aWxsIGRpc3BsYXkgdGhlIHByb3BlciBvcHRpb25zIGFzIGFjdGl2ZSBvbiBhcnJvdyBrZXkgZXZlbnRzLlxuICAgKi9cbiAgc2V0QWN0aXZlU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fYWN0aXZlKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJlbW92ZXMgZGlzcGxheSBzdHlsZXMgb24gdGhlIG9wdGlvbiB0aGF0IG1hZGUgaXQgYXBwZWFyXG4gICAqIGFjdGl2ZS4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciBzbyBrZXlcbiAgICogZXZlbnRzIHdpbGwgZGlzcGxheSB0aGUgcHJvcGVyIG9wdGlvbnMgYXMgYWN0aXZlIG9uIGFycm93IGtleSBldmVudHMuXG4gICAqL1xuICBzZXRJbmFjdGl2ZVN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYWN0aXZlKSB7XG4gICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsYWJlbCB0byBiZSB1c2VkIHdoZW4gZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgb3B0aW9uIHNob3VsZCBiZSBmb2N1c2VkLiAqL1xuICBnZXRMYWJlbCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBFbnN1cmVzIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQgd2hlbiBhY3RpdmF0ZWQgZnJvbSB0aGUga2V5Ym9hcmQuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKChldmVudC5rZXlDb2RlID09PSBFTlRFUiB8fCBldmVudC5rZXlDb2RlID09PSBTUEFDRSkgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgdGhpcy5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcblxuICAgICAgLy8gUHJldmVudCB0aGUgcGFnZSBmcm9tIHNjcm9sbGluZyBkb3duIGFuZCBmb3JtIHN1Ym1pdHMuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBgU2VsZWN0cyB0aGUgb3B0aW9uIHdoaWxlIGluZGljYXRpbmcgdGhlIHNlbGVjdGlvbiBjYW1lIGZyb20gdGhlIHVzZXIuIFVzZWQgdG9cbiAgICogZGV0ZXJtaW5lIGlmIHRoZSBzZWxlY3QncyB2aWV3IC0+IG1vZGVsIGNhbGxiYWNrIHNob3VsZCBiZSBpbnZva2VkLmBcbiAgICovXG4gIF9zZWxlY3RWaWFJbnRlcmFjdGlvbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdGhpcy5tdWx0aXBsZSA/ICF0aGlzLl9zZWxlY3RlZCA6IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYGFyaWEtc2VsZWN0ZWRgIHZhbHVlIGZvciB0aGUgb3B0aW9uLiBXZSBleHBsaWNpdGx5IG9taXQgdGhlIGBhcmlhLXNlbGVjdGVkYFxuICAgKiBhdHRyaWJ1dGUgZnJvbSBzaW5nbGUtc2VsZWN0aW9uLCB1bnNlbGVjdGVkIG9wdGlvbnMuIEluY2x1ZGluZyB0aGUgYGFyaWEtc2VsZWN0ZWQ9XCJmYWxzZVwiYFxuICAgKiBhdHRyaWJ1dGVzIGFkZHMgYSBzaWduaWZpY2FudCBhbW91bnQgb2Ygbm9pc2UgdG8gc2NyZWVuLXJlYWRlciB1c2VycyB3aXRob3V0IHByb3ZpZGluZyB1c2VmdWxcbiAgICogaW5mb3JtYXRpb24uXG4gICAqL1xuICBfZ2V0QXJpYVNlbGVjdGVkKCk6IGJvb2xlYW58bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWQgfHwgKHRoaXMubXVsdGlwbGUgPyBmYWxzZSA6IG51bGwpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGNvcnJlY3QgdGFiaW5kZXggZm9yIHRoZSBvcHRpb24gZGVwZW5kaW5nIG9uIGRpc2FibGVkIHN0YXRlLiAqL1xuICBfZ2V0VGFiSW5kZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICctMScgOiAnMCc7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgaG9zdCBET00gZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgIC8vIFNpbmNlIHBhcmVudCBjb21wb25lbnRzIGNvdWxkIGJlIHVzaW5nIHRoZSBvcHRpb24ncyBsYWJlbCB0byBkaXNwbGF5IHRoZSBzZWxlY3RlZCB2YWx1ZXNcbiAgICAvLyAoZS5nLiBgbWF0LXNlbGVjdGApIGFuZCB0aGV5IGRvbid0IGhhdmUgYSB3YXkgb2Yga25vd2luZyBpZiB0aGUgb3B0aW9uJ3MgbGFiZWwgaGFzIGNoYW5nZWRcbiAgICAvLyB3ZSBoYXZlIHRvIGNoZWNrIGZvciBjaGFuZ2VzIGluIHRoZSBET00gb3Vyc2VsdmVzIGFuZCBkaXNwYXRjaCBhbiBldmVudC4gVGhlc2UgY2hlY2tzIGFyZVxuICAgIC8vIHJlbGF0aXZlbHkgY2hlYXAsIGhvd2V2ZXIgd2Ugc3RpbGwgbGltaXQgdGhlbSBvbmx5IHRvIHNlbGVjdGVkIG9wdGlvbnMgaW4gb3JkZXIgdG8gYXZvaWRcbiAgICAvLyBoaXR0aW5nIHRoZSBET00gdG9vIG9mdGVuLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZCkge1xuICAgICAgY29uc3Qgdmlld1ZhbHVlID0gdGhpcy52aWV3VmFsdWU7XG5cbiAgICAgIGlmICh2aWV3VmFsdWUgIT09IHRoaXMuX21vc3RSZWNlbnRWaWV3VmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbW9zdFJlY2VudFZpZXdWYWx1ZSA9IHZpZXdWYWx1ZTtcbiAgICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0aW9uIGNoYW5nZSBldmVudC4gKi9cbiAgcHJpdmF0ZSBfZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KGlzVXNlcklucHV0ID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLm9uU2VsZWN0aW9uQ2hhbmdlLmVtaXQobmV3IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSh0aGlzLCBpc1VzZXJJbnB1dCkpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogU2luZ2xlIG9wdGlvbiBpbnNpZGUgb2YgYSBgPG1hdC1zZWxlY3Q+YCBlbGVtZW50LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtb3B0aW9uJyxcbiAgZXhwb3J0QXM6ICdtYXRPcHRpb24nLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnb3B0aW9uJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ19nZXRUYWJJbmRleCgpJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3RlZF0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MubWF0LW9wdGlvbi1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbY2xhc3MubWF0LWFjdGl2ZV0nOiAnYWN0aXZlJyxcbiAgICAnW2lkXSc6ICdpZCcsXG4gICAgJ1thdHRyLmFyaWEtc2VsZWN0ZWRdJzogJ19nZXRBcmlhU2VsZWN0ZWQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbY2xhc3MubWF0LW9wdGlvbi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoY2xpY2spJzogJ19zZWxlY3RWaWFJbnRlcmFjdGlvbigpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICdjbGFzcyc6ICdtYXQtb3B0aW9uIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICB9LFxuICBzdHlsZVVybHM6IFsnb3B0aW9uLmNzcyddLFxuICB0ZW1wbGF0ZVVybDogJ29wdGlvbi5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdE9wdGlvbiBleHRlbmRzIF9NYXRPcHRpb25CYXNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5UKSBwYXJlbnQ6IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9PUFRHUk9VUCkgZ3JvdXA6IE1hdE9wdGdyb3VwKSB7XG4gICAgc3VwZXIoZWxlbWVudCwgY2hhbmdlRGV0ZWN0b3JSZWYsIHBhcmVudCwgZ3JvdXApO1xuICB9XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBhbW91bnQgb2Ygb3B0aW9uIGdyb3VwIGxhYmVscyB0aGF0IHByZWNlZGUgdGhlIHNwZWNpZmllZCBvcHRpb24uXG4gKiBAcGFyYW0gb3B0aW9uSW5kZXggSW5kZXggb2YgdGhlIG9wdGlvbiBhdCB3aGljaCB0byBzdGFydCBjb3VudGluZy5cbiAqIEBwYXJhbSBvcHRpb25zIEZsYXQgbGlzdCBvZiBhbGwgb2YgdGhlIG9wdGlvbnMuXG4gKiBAcGFyYW0gb3B0aW9uR3JvdXBzIEZsYXQgbGlzdCBvZiBhbGwgb2YgdGhlIG9wdGlvbiBncm91cHMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihvcHRpb25JbmRleDogbnVtYmVyLCBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPixcbiAgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+KTogbnVtYmVyIHtcblxuICBpZiAob3B0aW9uR3JvdXBzLmxlbmd0aCkge1xuICAgIGxldCBvcHRpb25zQXJyYXkgPSBvcHRpb25zLnRvQXJyYXkoKTtcbiAgICBsZXQgZ3JvdXBzID0gb3B0aW9uR3JvdXBzLnRvQXJyYXkoKTtcbiAgICBsZXQgZ3JvdXBDb3VudGVyID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9uSW5kZXggKyAxOyBpKyspIHtcbiAgICAgIGlmIChvcHRpb25zQXJyYXlbaV0uZ3JvdXAgJiYgb3B0aW9uc0FycmF5W2ldLmdyb3VwID09PSBncm91cHNbZ3JvdXBDb3VudGVyXSkge1xuICAgICAgICBncm91cENvdW50ZXIrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ3JvdXBDb3VudGVyO1xuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB0aGUgcG9zaXRpb24gdG8gd2hpY2ggdG8gc2Nyb2xsIGEgcGFuZWwgaW4gb3JkZXIgZm9yIGFuIG9wdGlvbiB0byBiZSBpbnRvIHZpZXcuXG4gKiBAcGFyYW0gb3B0aW9uT2Zmc2V0IE9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcCBvZiB0aGUgcGFuZWwuXG4gKiBAcGFyYW0gb3B0aW9uSGVpZ2h0IEhlaWdodCBvZiB0aGUgb3B0aW9ucy5cbiAqIEBwYXJhbSBjdXJyZW50U2Nyb2xsUG9zaXRpb24gQ3VycmVudCBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIHBhbmVsLlxuICogQHBhcmFtIHBhbmVsSGVpZ2h0IEhlaWdodCBvZiB0aGUgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24ob3B0aW9uT2Zmc2V0OiBudW1iZXIsIG9wdGlvbkhlaWdodDogbnVtYmVyLFxuICAgIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjogbnVtYmVyLCBwYW5lbEhlaWdodDogbnVtYmVyKTogbnVtYmVyIHtcbiAgaWYgKG9wdGlvbk9mZnNldCA8IGN1cnJlbnRTY3JvbGxQb3NpdGlvbikge1xuICAgIHJldHVybiBvcHRpb25PZmZzZXQ7XG4gIH1cblxuICBpZiAob3B0aW9uT2Zmc2V0ICsgb3B0aW9uSGVpZ2h0ID4gY3VycmVudFNjcm9sbFBvc2l0aW9uICsgcGFuZWxIZWlnaHQpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgb3B0aW9uT2Zmc2V0IC0gcGFuZWxIZWlnaHQgKyBvcHRpb25IZWlnaHQpO1xuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRTY3JvbGxQb3NpdGlvbjtcbn1cblxuIiwiPG1hdC1wc2V1ZG8tY2hlY2tib3ggKm5nSWY9XCJtdWx0aXBsZVwiIGNsYXNzPVwibWF0LW9wdGlvbi1wc2V1ZG8tY2hlY2tib3hcIlxuICAgIFtzdGF0ZV09XCJzZWxlY3RlZCA/ICdjaGVja2VkJyA6ICd1bmNoZWNrZWQnXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCI+PC9tYXQtcHNldWRvLWNoZWNrYm94PlxuXG48c3BhbiBjbGFzcz1cIm1hdC1vcHRpb24tdGV4dFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L3NwYW4+XG5cbjwhLS0gU2VlIGExMXkgbm90ZXMgaW5zaWRlIG9wdGdyb3VwLnRzIGZvciBjb250ZXh0IGJlaGluZCB0aGlzIGVsZW1lbnQuIC0tPlxuPHNwYW4gY2xhc3M9XCJjZGstdmlzdWFsbHktaGlkZGVuXCIgKm5nSWY9XCJncm91cCAmJiBncm91cC5faW5lcnRcIj4oe3sgZ3JvdXAubGFiZWwgfX0pPC9zcGFuPlxuXG48ZGl2IGNsYXNzPVwibWF0LW9wdGlvbi1yaXBwbGVcIiBtYXQtcmlwcGxlXG4gICAgIFttYXRSaXBwbGVUcmlnZ2VyXT1cIl9nZXRIb3N0RWxlbWVudCgpXCJcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVkIHx8IGRpc2FibGVSaXBwbGVcIj5cbjwvZGl2PlxuIl19