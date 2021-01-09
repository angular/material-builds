/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, Optional, Output, ViewEncapsulation, Directive, } from '@angular/core';
import { Subject } from 'rxjs';
import { MatOptgroup, _MatOptgroupBase, MAT_OPTGROUP } from './optgroup';
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
 * Injection token used to provide the parent component to options.
 */
export const MAT_OPTION_PARENT_COMPONENT = new InjectionToken('MAT_OPTION_PARENT_COMPONENT');
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
_MatOptionBase.decorators = [
    { type: Directive }
];
_MatOptionBase.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined },
    { type: _MatOptgroupBase }
];
_MatOptionBase.propDecorators = {
    value: [{ type: Input }],
    id: [{ type: Input }],
    disabled: [{ type: Input }],
    onSelectionChange: [{ type: Output }]
};
/**
 * Single option inside of a `<mat-select>` element.
 */
export class MatOption extends _MatOptionBase {
    constructor(element, changeDetectorRef, parent, group) {
        super(element, changeDetectorRef, parent, group);
    }
}
MatOption.decorators = [
    { type: Component, args: [{
                selector: 'mat-option',
                exportAs: 'matOption',
                host: {
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
                },
                template: "<mat-pseudo-checkbox *ngIf=\"multiple\" class=\"mat-option-pseudo-checkbox\"\n    [state]=\"selected ? 'checked' : 'unchecked'\" [disabled]=\"disabled\"></mat-pseudo-checkbox>\n\n<span class=\"mat-option-text\"><ng-content></ng-content></span>\n\n<div class=\"mat-option-ripple\" mat-ripple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disabled || disableRipple\">\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".mat-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;text-align:left;text-decoration:none;max-width:100%;position:relative;cursor:pointer;outline:none;display:flex;flex-direction:row;max-width:100%;box-sizing:border-box;align-items:center;-webkit-tap-highlight-color:transparent}.mat-option[disabled]{cursor:default}[dir=rtl] .mat-option{text-align:right}.mat-option .mat-icon{margin-right:16px;vertical-align:middle}.mat-option .mat-icon svg{vertical-align:top}[dir=rtl] .mat-option .mat-icon{margin-left:16px;margin-right:0}.mat-option[aria-disabled=true]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:32px}[dir=rtl] .mat-optgroup .mat-option:not(.mat-option-multiple){padding-left:16px;padding-right:32px}.cdk-high-contrast-active .mat-option{margin:0 1px}.cdk-high-contrast-active .mat-option.mat-active{border:solid 1px currentColor;margin:0}.cdk-high-contrast-active .mat-option[aria-disabled=true]{opacity:.5}.mat-option-text{display:inline-block;flex-grow:1;overflow:hidden;text-overflow:ellipsis}.mat-option .mat-option-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.cdk-high-contrast-active .mat-option .mat-option-ripple{opacity:.5}.mat-option-pseudo-checkbox{margin-right:8px}[dir=rtl] .mat-option-pseudo-checkbox{margin-left:8px;margin-right:0}\n"]
            },] }
];
MatOption.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_OPTION_PARENT_COMPONENT,] }] },
    { type: MatOptgroup, decorators: [{ type: Optional }, { type: Inject, args: [MAT_OPTGROUP,] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvb3B0aW9uL29wdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUVOLGlCQUFpQixFQUNqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV2RTs7O0dBR0c7QUFDSCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUV6QixxRUFBcUU7QUFDckUsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQztJQUNFLHNEQUFzRDtJQUMvQyxNQUFzQjtJQUM3Qiw4RUFBOEU7SUFDdkUsY0FBYyxLQUFLO1FBRm5CLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBRXRCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO0lBQUksQ0FBQztDQUNsQztBQVlEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQ3BDLElBQUksY0FBYyxDQUEyQiw2QkFBNkIsQ0FBQyxDQUFDO0FBSWhGLE1BQU0sT0FBTyxjQUFjO0lBaUN6QixZQUNVLFFBQWlDLEVBQ2pDLGtCQUFxQyxFQUNyQyxPQUFpQyxFQUNoQyxLQUF1QjtRQUh4QixhQUFR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QVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNFLFlBQVksRUFBRSxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLFVBQVUsd0JBQXdCLENBQUMsWUFBb0IsRUFBRSxZQUFvQixFQUMvRSxxQkFBNkIsRUFBRSxXQUFtQjtJQUNwRCxJQUFJLFlBQVksR0FBRyxxQkFBcUIsRUFBRTtRQUN4QyxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELElBQUksWUFBWSxHQUFHLFlBQVksR0FBRyxxQkFBcUIsR0FBRyxXQUFXLEVBQUU7UUFDckUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsV0FBVyxHQUFHLFlBQVksQ0FBQyxDQUFDO0tBQy9EO0lBRUQsT0FBTyxxQkFBcUIsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0VOVEVSLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBEaXJlY3RpdmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb2N1c09wdGlvbnMsIEZvY3VzYWJsZU9wdGlvbiwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdE9wdGdyb3VwLCBfTWF0T3B0Z3JvdXBCYXNlLCBNQVRfT1BUR1JPVVB9IGZyb20gJy4vb3B0Z3JvdXAnO1xuXG4vKipcbiAqIE9wdGlvbiBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgZW1pdHRlZCBieSBNYXRPcHRpb24gd2hlbiBzZWxlY3RlZCBvciBkZXNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIG9wdGlvbiB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IF9NYXRPcHRpb25CYXNlLFxuICAgIC8qKiBXaGV0aGVyIHRoZSBjaGFuZ2UgaW4gdGhlIG9wdGlvbidzIHZhbHVlIHdhcyBhIHJlc3VsdCBvZiBhIHVzZXIgYWN0aW9uLiAqL1xuICAgIHB1YmxpYyBpc1VzZXJJbnB1dCA9IGZhbHNlKSB7IH1cbn1cblxuLyoqXG4gKiBEZXNjcmliZXMgYSBwYXJlbnQgY29tcG9uZW50IHRoYXQgbWFuYWdlcyBhIGxpc3Qgb2Ygb3B0aW9ucy5cbiAqIENvbnRhaW5zIHByb3BlcnRpZXMgdGhhdCB0aGUgb3B0aW9ucyBjYW4gaW5oZXJpdC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRPcHRpb25QYXJlbnRDb21wb25lbnQge1xuICBkaXNhYmxlUmlwcGxlPzogYm9vbGVhbjtcbiAgbXVsdGlwbGU/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB1c2VkIHRvIHByb3ZpZGUgdGhlIHBhcmVudCBjb21wb25lbnQgdG8gb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdE9wdGlvblBhcmVudENvbXBvbmVudD4oJ01BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCcpO1xuXG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIF9NYXRPcHRpb25CYXNlIGltcGxlbWVudHMgRm9jdXNhYmxlT3B0aW9uLCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9zZWxlY3RlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hY3RpdmUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbW9zdFJlY2VudFZpZXdWYWx1ZSA9ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB3cmFwcGluZyBjb21wb25lbnQgaXMgaW4gbXVsdGlwbGUgc2VsZWN0aW9uIG1vZGUuICovXG4gIGdldCBtdWx0aXBsZSgpIHsgcmV0dXJuIHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQubXVsdGlwbGU7IH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG9wdGlvbiBpcyBjdXJyZW50bHkgc2VsZWN0ZWQuICovXG4gIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkOyB9XG5cbiAgLyoqIFRoZSBmb3JtIHZhbHVlIG9mIHRoZSBvcHRpb24uICovXG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgLyoqIFRoZSB1bmlxdWUgSUQgb2YgdGhlIG9wdGlvbi4gKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtb3B0aW9uLSR7X3VuaXF1ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gKHRoaXMuZ3JvdXAgJiYgdGhpcy5ncm91cC5kaXNhYmxlZCkgfHwgdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHsgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpOyB9XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBmb3IgdGhlIG9wdGlvbiBhcmUgZGlzYWJsZWQuICovXG4gIGdldCBkaXNhYmxlUmlwcGxlKCkgeyByZXR1cm4gdGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5kaXNhYmxlUmlwcGxlOyB9XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkIG9yIGRlc2VsZWN0ZWQuICovXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4XG4gIEBPdXRwdXQoKSByZWFkb25seSBvblNlbGVjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzdGF0ZSBvZiB0aGUgb3B0aW9uIGNoYW5nZXMgYW5kIGFueSBwYXJlbnRzIGhhdmUgdG8gYmUgbm90aWZpZWQuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9wYXJlbnQ6IE1hdE9wdGlvblBhcmVudENvbXBvbmVudCxcbiAgICByZWFkb25seSBncm91cDogX01hdE9wdGdyb3VwQmFzZSkge31cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIG9wdGlvbiBpcyBjdXJyZW50bHkgYWN0aXZlIGFuZCByZWFkeSB0byBiZSBzZWxlY3RlZC5cbiAgICogQW4gYWN0aXZlIG9wdGlvbiBkaXNwbGF5cyBzdHlsZXMgYXMgaWYgaXQgaXMgZm9jdXNlZCwgYnV0IHRoZVxuICAgKiBmb2N1cyBpcyBhY3R1YWxseSByZXRhaW5lZCBzb21ld2hlcmUgZWxzZS4gVGhpcyBjb21lcyBpbiBoYW5keVxuICAgKiBmb3IgY29tcG9uZW50cyBsaWtlIGF1dG9jb21wbGV0ZSB3aGVyZSBmb2N1cyBtdXN0IHJlbWFpbiBvbiB0aGUgaW5wdXQuXG4gICAqL1xuICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRpc3BsYXllZCB2YWx1ZSBvZiB0aGUgb3B0aW9uLiBJdCBpcyBuZWNlc3NhcnkgdG8gc2hvdyB0aGUgc2VsZWN0ZWQgb3B0aW9uIGluIHRoZVxuICAgKiBzZWxlY3QncyB0cmlnZ2VyLlxuICAgKi9cbiAgZ2V0IHZpZXdWYWx1ZSgpOiBzdHJpbmcge1xuICAgIC8vIFRPRE8oa2FyYSk6IEFkZCBpbnB1dCBwcm9wZXJ0eSBhbHRlcm5hdGl2ZSBmb3Igbm9kZSBlbnZzLlxuICAgIHJldHVybiAodGhpcy5fZ2V0SG9zdEVsZW1lbnQoKS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIG9wdGlvbi4gKi9cbiAgc2VsZWN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlc2VsZWN0cyB0aGUgb3B0aW9uLiAqL1xuICBkZXNlbGVjdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX2VtaXRTZWxlY3Rpb25DaGFuZ2VFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIGZvY3VzIG9udG8gdGhpcyBvcHRpb24uICovXG4gIGZvY3VzKF9vcmlnaW4/OiBGb2N1c09yaWdpbiwgb3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBhcmVuJ3QgdXNpbmcgYF9vcmlnaW5gLCBidXQgd2UgbmVlZCB0byBrZWVwIGl0IGJlY2F1c2Ugc29tZSBpbnRlcm5hbCBjb25zdW1lcnNcbiAgICAvLyB1c2UgYE1hdE9wdGlvbmAgaW4gYSBgRm9jdXNLZXlNYW5hZ2VyYCBhbmQgd2UgbmVlZCBpdCB0byBtYXRjaCBgRm9jdXNhYmxlT3B0aW9uYC5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZ2V0SG9zdEVsZW1lbnQoKTtcblxuICAgIGlmICh0eXBlb2YgZWxlbWVudC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2V0cyBkaXNwbGF5IHN0eWxlcyBvbiB0aGUgb3B0aW9uIHRvIG1ha2UgaXQgYXBwZWFyXG4gICAqIGFjdGl2ZS4gVGhpcyBpcyB1c2VkIGJ5IHRoZSBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciBzbyBrZXlcbiAgICogZXZlbnRzIHdpbGwgZGlzcGxheSB0aGUgcHJvcGVyIG9wdGlvbnMgYXMgYWN0aXZlIG9uIGFycm93IGtleSBldmVudHMuXG4gICAqL1xuICBzZXRBY3RpdmVTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmVtb3ZlcyBkaXNwbGF5IHN0eWxlcyBvbiB0aGUgb3B0aW9uIHRoYXQgbWFkZSBpdCBhcHBlYXJcbiAgICogYWN0aXZlLiBUaGlzIGlzIHVzZWQgYnkgdGhlIEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyIHNvIGtleVxuICAgKiBldmVudHMgd2lsbCBkaXNwbGF5IHRoZSBwcm9wZXIgb3B0aW9ucyBhcyBhY3RpdmUgb24gYXJyb3cga2V5IGV2ZW50cy5cbiAgICovXG4gIHNldEluYWN0aXZlU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIHRvIGJlIHVzZWQgd2hlbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBvcHRpb24gc2hvdWxkIGJlIGZvY3VzZWQuICovXG4gIGdldExhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmlld1ZhbHVlO1xuICB9XG5cbiAgLyoqIEVuc3VyZXMgdGhlIG9wdGlvbiBpcyBzZWxlY3RlZCB3aGVuIGFjdGl2YXRlZCBmcm9tIHRoZSBrZXlib2FyZC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoKGV2ZW50LmtleUNvZGUgPT09IEVOVEVSIHx8IGV2ZW50LmtleUNvZGUgPT09IFNQQUNFKSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuXG4gICAgICAvLyBQcmV2ZW50IHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nIGRvd24gYW5kIGZvcm0gc3VibWl0cy5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIGBTZWxlY3RzIHRoZSBvcHRpb24gd2hpbGUgaW5kaWNhdGluZyB0aGUgc2VsZWN0aW9uIGNhbWUgZnJvbSB0aGUgdXNlci4gVXNlZCB0b1xuICAgKiBkZXRlcm1pbmUgaWYgdGhlIHNlbGVjdCdzIHZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgc2hvdWxkIGJlIGludm9rZWQuYFxuICAgKi9cbiAgX3NlbGVjdFZpYUludGVyYWN0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gIXRoaXMuX3NlbGVjdGVkIDogdHJ1ZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fZW1pdFNlbGVjdGlvbkNoYW5nZUV2ZW50KHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBgYXJpYS1zZWxlY3RlZGAgdmFsdWUgZm9yIHRoZSBvcHRpb24uIFdlIGV4cGxpY2l0bHkgb21pdCB0aGUgYGFyaWEtc2VsZWN0ZWRgXG4gICAqIGF0dHJpYnV0ZSBmcm9tIHNpbmdsZS1zZWxlY3Rpb24sIHVuc2VsZWN0ZWQgb3B0aW9ucy4gSW5jbHVkaW5nIHRoZSBgYXJpYS1zZWxlY3RlZD1cImZhbHNlXCJgXG4gICAqIGF0dHJpYnV0ZXMgYWRkcyBhIHNpZ25pZmljYW50IGFtb3VudCBvZiBub2lzZSB0byBzY3JlZW4tcmVhZGVyIHVzZXJzIHdpdGhvdXQgcHJvdmlkaW5nIHVzZWZ1bFxuICAgKiBpbmZvcm1hdGlvbi5cbiAgICovXG4gIF9nZXRBcmlhU2VsZWN0ZWQoKTogYm9vbGVhbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZCB8fCAodGhpcy5tdWx0aXBsZSA/IGZhbHNlIDogbnVsbCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgY29ycmVjdCB0YWJpbmRleCBmb3IgdGhlIG9wdGlvbiBkZXBlbmRpbmcgb24gZGlzYWJsZWQgc3RhdGUuICovXG4gIF9nZXRUYWJJbmRleCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkID8gJy0xJyA6ICcwJztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBob3N0IERPTSBlbGVtZW50LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgLy8gU2luY2UgcGFyZW50IGNvbXBvbmVudHMgY291bGQgYmUgdXNpbmcgdGhlIG9wdGlvbidzIGxhYmVsIHRvIGRpc3BsYXkgdGhlIHNlbGVjdGVkIHZhbHVlc1xuICAgIC8vIChlLmcuIGBtYXQtc2VsZWN0YCkgYW5kIHRoZXkgZG9uJ3QgaGF2ZSBhIHdheSBvZiBrbm93aW5nIGlmIHRoZSBvcHRpb24ncyBsYWJlbCBoYXMgY2hhbmdlZFxuICAgIC8vIHdlIGhhdmUgdG8gY2hlY2sgZm9yIGNoYW5nZXMgaW4gdGhlIERPTSBvdXJzZWx2ZXMgYW5kIGRpc3BhdGNoIGFuIGV2ZW50LiBUaGVzZSBjaGVja3MgYXJlXG4gICAgLy8gcmVsYXRpdmVseSBjaGVhcCwgaG93ZXZlciB3ZSBzdGlsbCBsaW1pdCB0aGVtIG9ubHkgdG8gc2VsZWN0ZWQgb3B0aW9ucyBpbiBvcmRlciB0byBhdm9pZFxuICAgIC8vIGhpdHRpbmcgdGhlIERPTSB0b28gb2Z0ZW4uXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkKSB7XG4gICAgICBjb25zdCB2aWV3VmFsdWUgPSB0aGlzLnZpZXdWYWx1ZTtcblxuICAgICAgaWYgKHZpZXdWYWx1ZSAhPT0gdGhpcy5fbW9zdFJlY2VudFZpZXdWYWx1ZSkge1xuICAgICAgICB0aGlzLl9tb3N0UmVjZW50Vmlld1ZhbHVlID0gdmlld1ZhbHVlO1xuICAgICAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50LiAqL1xuICBwcml2YXRlIF9lbWl0U2VsZWN0aW9uQ2hhbmdlRXZlbnQoaXNVc2VySW5wdXQgPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMub25TZWxlY3Rpb25DaGFuZ2UuZW1pdChuZXcgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlKHRoaXMsIGlzVXNlcklucHV0KSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBTaW5nbGUgb3B0aW9uIGluc2lkZSBvZiBhIGA8bWF0LXNlbGVjdD5gIGVsZW1lbnQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1vcHRpb24nLFxuICBleHBvcnRBczogJ21hdE9wdGlvbicsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnX2dldFRhYkluZGV4KCknLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdGVkXSc6ICdzZWxlY3RlZCcsXG4gICAgJ1tjbGFzcy5tYXQtb3B0aW9uLW11bHRpcGxlXSc6ICdtdWx0aXBsZScsXG4gICAgJ1tjbGFzcy5tYXQtYWN0aXZlXSc6ICdhY3RpdmUnLFxuICAgICdbaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnX2dldEFyaWFTZWxlY3RlZCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1tjbGFzcy5tYXQtb3B0aW9uLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhjbGljayknOiAnX3NlbGVjdFZpYUludGVyYWN0aW9uKCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJ2NsYXNzJzogJ21hdC1vcHRpb24gbWF0LWZvY3VzLWluZGljYXRvcicsXG4gIH0sXG4gIHN0eWxlVXJsczogWydvcHRpb24uY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnb3B0aW9uLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0T3B0aW9uIGV4dGVuZHMgX01hdE9wdGlvbkJhc2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQpIHBhcmVudDogTWF0T3B0aW9uUGFyZW50Q29tcG9uZW50LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX09QVEdST1VQKSBncm91cDogTWF0T3B0Z3JvdXApIHtcbiAgICBzdXBlcihlbGVtZW50LCBjaGFuZ2VEZXRlY3RvclJlZiwgcGFyZW50LCBncm91cCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIGFtb3VudCBvZiBvcHRpb24gZ3JvdXAgbGFiZWxzIHRoYXQgcHJlY2VkZSB0aGUgc3BlY2lmaWVkIG9wdGlvbi5cbiAqIEBwYXJhbSBvcHRpb25JbmRleCBJbmRleCBvZiB0aGUgb3B0aW9uIGF0IHdoaWNoIHRvIHN0YXJ0IGNvdW50aW5nLlxuICogQHBhcmFtIG9wdGlvbnMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9ucy5cbiAqIEBwYXJhbSBvcHRpb25Hcm91cHMgRmxhdCBsaXN0IG9mIGFsbCBvZiB0aGUgb3B0aW9uIGdyb3Vwcy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKG9wdGlvbkluZGV4OiBudW1iZXIsIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+LFxuICBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD4pOiBudW1iZXIge1xuXG4gIGlmIChvcHRpb25Hcm91cHMubGVuZ3RoKSB7XG4gICAgbGV0IG9wdGlvbnNBcnJheSA9IG9wdGlvbnMudG9BcnJheSgpO1xuICAgIGxldCBncm91cHMgPSBvcHRpb25Hcm91cHMudG9BcnJheSgpO1xuICAgIGxldCBncm91cENvdW50ZXIgPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25JbmRleCArIDE7IGkrKykge1xuICAgICAgaWYgKG9wdGlvbnNBcnJheVtpXS5ncm91cCAmJiBvcHRpb25zQXJyYXlbaV0uZ3JvdXAgPT09IGdyb3Vwc1tncm91cENvdW50ZXJdKSB7XG4gICAgICAgIGdyb3VwQ291bnRlcisrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncm91cENvdW50ZXI7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHRoZSBwb3NpdGlvbiB0byB3aGljaCB0byBzY3JvbGwgYSBwYW5lbCBpbiBvcmRlciBmb3IgYW4gb3B0aW9uIHRvIGJlIGludG8gdmlldy5cbiAqIEBwYXJhbSBvcHRpb25PZmZzZXQgT2Zmc2V0IG9mIHRoZSBvcHRpb24gZnJvbSB0aGUgdG9wIG9mIHRoZSBwYW5lbC5cbiAqIEBwYXJhbSBvcHRpb25IZWlnaHQgSGVpZ2h0IG9mIHRoZSBvcHRpb25zLlxuICogQHBhcmFtIGN1cnJlbnRTY3JvbGxQb3NpdGlvbiBDdXJyZW50IHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgcGFuZWwuXG4gKiBAcGFyYW0gcGFuZWxIZWlnaHQgSGVpZ2h0IG9mIHRoZSBwYW5lbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihvcHRpb25PZmZzZXQ6IG51bWJlciwgb3B0aW9uSGVpZ2h0OiBudW1iZXIsXG4gICAgY3VycmVudFNjcm9sbFBvc2l0aW9uOiBudW1iZXIsIHBhbmVsSGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAob3B0aW9uT2Zmc2V0IDwgY3VycmVudFNjcm9sbFBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIG9wdGlvbk9mZnNldDtcbiAgfVxuXG4gIGlmIChvcHRpb25PZmZzZXQgKyBvcHRpb25IZWlnaHQgPiBjdXJyZW50U2Nyb2xsUG9zaXRpb24gKyBwYW5lbEhlaWdodCkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBvcHRpb25PZmZzZXQgLSBwYW5lbEhlaWdodCArIG9wdGlvbkhlaWdodCk7XG4gIH1cblxuICByZXR1cm4gY3VycmVudFNjcm9sbFBvc2l0aW9uO1xufVxuXG4iXX0=