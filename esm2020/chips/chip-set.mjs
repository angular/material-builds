/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, Optional, QueryList, ViewEncapsulation, } from '@angular/core';
import { mixinTabIndex } from '@angular/material/core';
import { merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatChip } from './chip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
/**
 * Boilerplate for applying mixins to MatChipSet.
 * @docs-private
 */
class MatChipSetBase {
    constructor(_elementRef) { }
}
const _MatChipSetMixinBase = mixinTabIndex(MatChipSetBase);
/**
 * Basic container component for the MatChip component.
 *
 * Extended by MatChipListbox and MatChipGrid for different interaction patterns.
 */
export class MatChipSet extends _MatChipSetMixinBase {
    constructor(_elementRef, _changeDetectorRef, _dir) {
        super(_elementRef);
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        /** Index of the last destroyed chip that had focus. */
        this._lastDestroyedFocusedChipIndex = null;
        /** Subject that emits when the component has been destroyed. */
        this._destroyed = new Subject();
        /** Role to use if it hasn't been overwritten by the user. */
        this._defaultRole = 'presentation';
        this._disabled = false;
        this._explicitRole = null;
        /** Flat list of all the actions contained within the chips. */
        this._chipActions = new QueryList();
    }
    /** Combined stream of all of the child chips' focus events. */
    get chipFocusChanges() {
        return this._getChipStream(chip => chip._onFocus);
    }
    /** Combined stream of all of the child chips' remove events. */
    get chipDestroyedChanges() {
        return this._getChipStream(chip => chip.destroyed);
    }
    /** Whether the chip set is disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
        this._syncChipsState();
    }
    /** Whether the chip list contains chips or not. */
    get empty() {
        return this._chips.length === 0;
    }
    /** The ARIA role applied to the chip set. */
    get role() {
        if (this._explicitRole) {
            return this._explicitRole;
        }
        return this.empty ? null : this._defaultRole;
    }
    set role(value) {
        this._explicitRole = value;
    }
    /** Whether any of the chips inside of this chip-set has focus. */
    get focused() {
        return this._hasFocusedChip();
    }
    ngAfterViewInit() {
        this._setUpFocusManagement();
        this._trackChipSetChanges();
        this._trackDestroyedFocusedChip();
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
        this._chipActions.destroy();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** Checks whether any of the chips is focused. */
    _hasFocusedChip() {
        return this._chips && this._chips.some(chip => chip._hasFocus());
    }
    /** Syncs the chip-set's state with the individual chips. */
    _syncChipsState() {
        if (this._chips) {
            this._chips.forEach(chip => {
                chip.disabled = this._disabled;
                chip._changeDetectorRef.markForCheck();
            });
        }
    }
    /** Dummy method for subclasses to override. Base chip set cannot be focused. */
    focus() { }
    /** Handles keyboard events on the chip set. */
    _handleKeydown(event) {
        if (this._originatesFromChip(event)) {
            this._keyManager.onKeydown(event);
        }
    }
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    _isValidIndex(index) {
        return index >= 0 && index < this._chips.length;
    }
    /**
     * Removes the `tabindex` from the chip grid and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the grid from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    _allowFocusEscape() {
        const previousTabIndex = this.tabIndex;
        if (this.tabIndex !== -1) {
            this.tabIndex = -1;
            Promise.resolve().then(() => {
                this.tabIndex = previousTabIndex;
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    /**
     * Gets a stream of events from all the chips within the set.
     * The stream will automatically incorporate any newly-added chips.
     */
    _getChipStream(mappingFunction) {
        return this._chips.changes.pipe(startWith(null), switchMap(() => merge(...this._chips.map(mappingFunction))));
    }
    /** Checks whether an event comes from inside a chip element. */
    _originatesFromChip(event) {
        let currentElement = event.target;
        while (currentElement && currentElement !== this._elementRef.nativeElement) {
            // Null check the classList, because IE and Edge don't support it on all elements.
            if (currentElement.classList && currentElement.classList.contains('mdc-evolution-chip')) {
                return true;
            }
            currentElement = currentElement.parentElement;
        }
        return false;
    }
    /** Sets up the chip set's focus management logic. */
    _setUpFocusManagement() {
        // Create a flat `QueryList` containing the actions of all of the chips.
        // This allows us to navigate both within the chip and move to the next/previous
        // one using the existing `ListKeyManager`.
        this._chips.changes.pipe(startWith(this._chips)).subscribe((chips) => {
            const actions = [];
            chips.forEach(chip => chip._getActions().forEach(action => actions.push(action)));
            this._chipActions.reset(actions);
            this._chipActions.notifyOnChanges();
        });
        this._keyManager = new FocusKeyManager(this._chipActions)
            .withVerticalOrientation()
            .withHorizontalOrientation(this._dir ? this._dir.value : 'ltr')
            .withHomeAndEnd()
            .skipPredicate(action => this._skipPredicate(action));
        // Keep the manager active index in sync so that navigation picks
        // up from the current chip if the user clicks into the list directly.
        this.chipFocusChanges.pipe(takeUntil(this._destroyed)).subscribe(({ chip }) => {
            const action = chip._getSourceAction(document.activeElement);
            if (action) {
                this._keyManager.updateActiveItem(action);
            }
        });
        this._dir?.change
            .pipe(takeUntil(this._destroyed))
            .subscribe(direction => this._keyManager.withHorizontalOrientation(direction));
    }
    /**
     * Determines if key manager should avoid putting a given chip action in the tab index. Skip
     * non-interactive and disabled actions since the user can't do anything with them.
     */
    _skipPredicate(action) {
        // Skip chips that the user cannot interact with. `mat-chip-set` does not permit focusing disabled
        // chips.
        return !action.isInteractive || action.disabled;
    }
    /** Listens to changes in the chip set and syncs up the state of the individual chips. */
    _trackChipSetChanges() {
        this._chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            if (this.disabled) {
                // Since this happens after the content has been
                // checked, we need to defer it to the next tick.
                Promise.resolve().then(() => this._syncChipsState());
            }
            this._redirectDestroyedChipFocus();
        });
    }
    /** Starts tracking the destroyed chips in order to capture the focused one. */
    _trackDestroyedFocusedChip() {
        this.chipDestroyedChanges.pipe(takeUntil(this._destroyed)).subscribe((event) => {
            const chipArray = this._chips.toArray();
            const chipIndex = chipArray.indexOf(event.chip);
            // If the focused chip is destroyed, save its index so that we can move focus to the next
            // chip. We only save the index here, rather than move the focus immediately, because we want
            // to wait until the chip is removed from the chip list before focusing the next one. This
            // allows us to keep focus on the same index if the chip gets swapped out.
            if (this._isValidIndex(chipIndex) && event.chip._hasFocus()) {
                this._lastDestroyedFocusedChipIndex = chipIndex;
            }
        });
    }
    /**
     * Finds the next appropriate chip to move focus to,
     * if the currently-focused chip is destroyed.
     */
    _redirectDestroyedChipFocus() {
        if (this._lastDestroyedFocusedChipIndex == null) {
            return;
        }
        if (this._chips.length) {
            const newIndex = Math.min(this._lastDestroyedFocusedChipIndex, this._chips.length - 1);
            const chipToFocus = this._chips.toArray()[newIndex];
            if (chipToFocus.disabled) {
                // If we're down to one disabled chip, move focus back to the set.
                if (this._chips.length === 1) {
                    this.focus();
                }
                else {
                    this._keyManager.setPreviousItemActive();
                }
            }
            else {
                chipToFocus.focus();
            }
        }
        else {
            this.focus();
        }
        this._lastDestroyedFocusedChipIndex = null;
    }
}
MatChipSet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatChipSet, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatChipSet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatChipSet, selector: "mat-chip-set", inputs: { disabled: "disabled", role: "role" }, host: { listeners: { "keydown": "_handleKeydown($event)" }, properties: { "attr.role": "role" }, classAttribute: "mat-mdc-chip-set mdc-evolution-chip-set" }, queries: [{ propertyName: "_chips", predicate: MatChip, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <span class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </span>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatChipSet, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-set', template: `
    <span class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </span>
  `, host: {
                        'class': 'mat-mdc-chip-set mdc-evolution-chip-set',
                        '(keydown)': '_handleKeydown($event)',
                        '[attr.role]': 'role',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { disabled: [{
                type: Input
            }], role: [{
                type: Input
            }], _chips: [{
                type: ContentChildren,
                args: [MatChip, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixLQUFLLEVBRUwsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxRQUFRLENBQUM7OztBQUc3Qzs7O0dBR0c7QUFDSCxNQUFlLGNBQWM7SUFFM0IsWUFBWSxXQUF1QixJQUFHLENBQUM7Q0FDeEM7QUFDRCxNQUFNLG9CQUFvQixHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBaUJILE1BQU0sT0FBTyxVQUNYLFNBQVEsb0JBQW9CO0lBd0U1QixZQUNZLFdBQW9DLEVBQ3BDLGtCQUFxQyxFQUMzQixJQUFvQjtRQUV4QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFKVCxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtR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dkYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVwRCxJQUFJLFdBQVcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3hCLGtFQUFrRTtnQkFDbEUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDZDtxQkFBTTtvQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLHFCQUFxQixFQUFFLENBQUM7aUJBQzFDO2FBQ0Y7aUJBQU07Z0JBQ0wsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3JCO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQztJQUM3QyxDQUFDOzt1R0FsUlUsVUFBVTsyRkFBVixVQUFVLHlSQStESixPQUFPLHVFQTdFZDs7OztHQUlUOzJGQVVVLFVBQVU7a0JBaEJ0QixTQUFTOytCQUNFLGNBQWMsWUFDZDs7OztHQUlULFFBRUs7d0JBQ0osT0FBTyxFQUFFLHlDQUF5Qzt3QkFDbEQsV0FBVyxFQUFFLHdCQUF3Qjt3QkFDckMsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLGlCQUNjLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OzBCQThFNUMsUUFBUTs0Q0FoRFAsUUFBUTtzQkFEWCxLQUFLO2dCQWlCRixJQUFJO3NCQURQLEtBQUs7Z0JBeUJOLE1BQU07c0JBTEwsZUFBZTt1QkFBQyxPQUFPLEVBQUU7d0JBQ3hCLHVFQUF1RTt3QkFDdkUsOENBQThDO3dCQUM5QyxXQUFXLEVBQUUsSUFBSTtxQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hhc1RhYkluZGV4LCBtaXhpblRhYkluZGV4fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXAsIE1hdENoaXBFdmVudH0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TWF0Q2hpcEFjdGlvbn0gZnJvbSAnLi9jaGlwLWFjdGlvbic7XG5cbi8qKlxuICogQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwU2V0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5hYnN0cmFjdCBjbGFzcyBNYXRDaGlwU2V0QmFzZSB7XG4gIGFic3RyYWN0IGRpc2FibGVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRDaGlwU2V0TWl4aW5CYXNlID0gbWl4aW5UYWJJbmRleChNYXRDaGlwU2V0QmFzZSk7XG5cbi8qKlxuICogQmFzaWMgY29udGFpbmVyIGNvbXBvbmVudCBmb3IgdGhlIE1hdENoaXAgY29tcG9uZW50LlxuICpcbiAqIEV4dGVuZGVkIGJ5IE1hdENoaXBMaXN0Ym94IGFuZCBNYXRDaGlwR3JpZCBmb3IgZGlmZmVyZW50IGludGVyYWN0aW9uIHBhdHRlcm5zLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1zZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzcGFuIGNsYXNzPVwibWRjLWV2b2x1dGlvbi1jaGlwLXNldF9fY2hpcHNcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9zcGFuPlxuICBgLFxuICBzdHlsZVVybHM6IFsnY2hpcC1zZXQuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1jaGlwLXNldCBtZGMtZXZvbHV0aW9uLWNoaXAtc2V0JyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdENoaXBTZXRcbiAgZXh0ZW5kcyBfTWF0Q2hpcFNldE1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEhhc1RhYkluZGV4LCBPbkRlc3Ryb3lcbntcbiAgLyoqIEluZGV4IG9mIHRoZSBsYXN0IGRlc3Ryb3llZCBjaGlwIHRoYXQgaGFkIGZvY3VzLiAqL1xuICBwcml2YXRlIF9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVzZWQgdG8gbWFuYWdlIGZvY3VzIHdpdGhpbiB0aGUgY2hpcCBsaXN0LiAqL1xuICBwcm90ZWN0ZWQgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRDaGlwQWN0aW9uPjtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogUm9sZSB0byB1c2UgaWYgaXQgaGFzbid0IGJlZW4gb3ZlcndyaXR0ZW4gYnkgdGhlIHVzZXIuICovXG4gIHByb3RlY3RlZCBfZGVmYXVsdFJvbGUgPSAncHJlc2VudGF0aW9uJztcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIGZvY3VzIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBGb2N1c0NoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAuX29uRm9jdXMpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyByZW1vdmUgZXZlbnRzLiAqL1xuICBnZXQgY2hpcERlc3Ryb3llZENoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAuZGVzdHJveWVkKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIHNldCBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zeW5jQ2hpcHNTdGF0ZSgpO1xuICB9XG4gIHByb3RlY3RlZCBfZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBsaXN0IGNvbnRhaW5zIGNoaXBzIG9yIG5vdC4gKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jaGlwcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogVGhlIEFSSUEgcm9sZSBhcHBsaWVkIHRvIHRoZSBjaGlwIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvbGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2V4cGxpY2l0Um9sZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Um9sZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbXB0eSA/IG51bGwgOiB0aGlzLl9kZWZhdWx0Um9sZTtcbiAgfVxuXG4gIHNldCByb2xlKHZhbHVlOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgdGhpcy5fZXhwbGljaXRSb2xlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRSb2xlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciBhbnkgb2YgdGhlIGNoaXBzIGluc2lkZSBvZiB0aGlzIGNoaXAtc2V0IGhhcyBmb2N1cy4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0ZvY3VzZWRDaGlwKCk7XG4gIH1cblxuICAvKiogVGhlIGNoaXBzIHRoYXQgYXJlIHBhcnQgb2YgdGhpcyBjaGlwIHNldC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRDaGlwLCB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYGRlc2NlbmRhbnRzOiB0cnVlYCwgYmVjYXVzZSBJdnkgd2lsbCBubyBsb25nZXIgbWF0Y2hcbiAgICAvLyBpbmRpcmVjdCBkZXNjZW5kYW50cyBpZiBpdCdzIGxlZnQgYXMgZmFsc2UuXG4gICAgZGVzY2VuZGFudHM6IHRydWUsXG4gIH0pXG4gIF9jaGlwczogUXVlcnlMaXN0PE1hdENoaXA+O1xuXG4gIC8qKiBGbGF0IGxpc3Qgb2YgYWxsIHRoZSBhY3Rpb25zIGNvbnRhaW5lZCB3aXRoaW4gdGhlIGNoaXBzLiAqL1xuICBfY2hpcEFjdGlvbnMgPSBuZXcgUXVlcnlMaXN0PE1hdENoaXBBY3Rpb24+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICApIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fc2V0VXBGb2N1c01hbmFnZW1lbnQoKTtcbiAgICB0aGlzLl90cmFja0NoaXBTZXRDaGFuZ2VzKCk7XG4gICAgdGhpcy5fdHJhY2tEZXN0cm95ZWRGb2N1c2VkQ2hpcCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX2NoaXBBY3Rpb25zLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFueSBvZiB0aGUgY2hpcHMgaXMgZm9jdXNlZC4gKi9cbiAgcHJvdGVjdGVkIF9oYXNGb2N1c2VkQ2hpcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcHMgJiYgdGhpcy5fY2hpcHMuc29tZShjaGlwID0+IGNoaXAuX2hhc0ZvY3VzKCkpO1xuICB9XG5cbiAgLyoqIFN5bmNzIHRoZSBjaGlwLXNldCdzIHN0YXRlIHdpdGggdGhlIGluZGl2aWR1YWwgY2hpcHMuICovXG4gIHByb3RlY3RlZCBfc3luY0NoaXBzU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2NoaXBzKSB7XG4gICAgICB0aGlzLl9jaGlwcy5mb3JFYWNoKGNoaXAgPT4ge1xuICAgICAgICBjaGlwLmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgICAgIGNoaXAuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIER1bW15IG1ldGhvZCBmb3Igc3ViY2xhc3NlcyB0byBvdmVycmlkZS4gQmFzZSBjaGlwIHNldCBjYW5ub3QgYmUgZm9jdXNlZC4gKi9cbiAgZm9jdXMoKSB7fVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgY2hpcCBzZXQuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX29yaWdpbmF0ZXNGcm9tQ2hpcChldmVudCkpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBlbnN1cmUgYWxsIGluZGV4ZXMgYXJlIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGluZGV4IGlzIHZhbGlkIGZvciBvdXIgbGlzdCBvZiBjaGlwcy5cbiAgICovXG4gIHByb3RlY3RlZCBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuX2NoaXBzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBgdGFiaW5kZXhgIGZyb20gdGhlIGNoaXAgZ3JpZCBhbmQgcmVzZXRzIGl0IGJhY2sgYWZ0ZXJ3YXJkcywgYWxsb3dpbmcgdGhlXG4gICAqIHVzZXIgdG8gdGFiIG91dCBvZiBpdC4gVGhpcyBwcmV2ZW50cyB0aGUgZ3JpZCBmcm9tIGNhcHR1cmluZyBmb2N1cyBhbmQgcmVkaXJlY3RpbmdcbiAgICogaXQgYmFjayB0byB0aGUgZmlyc3QgY2hpcCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwLCBpZiBpdCB1c2VyIHRyaWVzIHRvIHRhYiBhd2F5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIGNvbnN0IHByZXZpb3VzVGFiSW5kZXggPSB0aGlzLnRhYkluZGV4O1xuXG4gICAgaWYgKHRoaXMudGFiSW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnRhYkluZGV4ID0gLTE7XG5cbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnRhYkluZGV4ID0gcHJldmlvdXNUYWJJbmRleDtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHN0cmVhbSBvZiBldmVudHMgZnJvbSBhbGwgdGhlIGNoaXBzIHdpdGhpbiB0aGUgc2V0LlxuICAgKiBUaGUgc3RyZWFtIHdpbGwgYXV0b21hdGljYWxseSBpbmNvcnBvcmF0ZSBhbnkgbmV3bHktYWRkZWQgY2hpcHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldENoaXBTdHJlYW08VCwgQyBleHRlbmRzIE1hdENoaXAgPSBNYXRDaGlwPihcbiAgICBtYXBwaW5nRnVuY3Rpb246IChjaGlwOiBDKSA9PiBPYnNlcnZhYmxlPFQ+LFxuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IG1lcmdlKC4uLih0aGlzLl9jaGlwcyBhcyBRdWVyeUxpc3Q8Qz4pLm1hcChtYXBwaW5nRnVuY3Rpb24pKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhbiBldmVudCBjb21lcyBmcm9tIGluc2lkZSBhIGNoaXAgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIF9vcmlnaW5hdGVzRnJvbUNoaXAoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAgIHdoaWxlIChjdXJyZW50RWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAvLyBOdWxsIGNoZWNrIHRoZSBjbGFzc0xpc3QsIGJlY2F1c2UgSUUgYW5kIEVkZ2UgZG9uJ3Qgc3VwcG9ydCBpdCBvbiBhbGwgZWxlbWVudHMuXG4gICAgICBpZiAoY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0ICYmIGN1cnJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbWRjLWV2b2x1dGlvbi1jaGlwJykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIHRoZSBjaGlwIHNldCdzIGZvY3VzIG1hbmFnZW1lbnQgbG9naWMuICovXG4gIHByaXZhdGUgX3NldFVwRm9jdXNNYW5hZ2VtZW50KCkge1xuICAgIC8vIENyZWF0ZSBhIGZsYXQgYFF1ZXJ5TGlzdGAgY29udGFpbmluZyB0aGUgYWN0aW9ucyBvZiBhbGwgb2YgdGhlIGNoaXBzLlxuICAgIC8vIFRoaXMgYWxsb3dzIHVzIHRvIG5hdmlnYXRlIGJvdGggd2l0aGluIHRoZSBjaGlwIGFuZCBtb3ZlIHRvIHRoZSBuZXh0L3ByZXZpb3VzXG4gICAgLy8gb25lIHVzaW5nIHRoZSBleGlzdGluZyBgTGlzdEtleU1hbmFnZXJgLlxuICAgIHRoaXMuX2NoaXBzLmNoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5fY2hpcHMpKS5zdWJzY3JpYmUoKGNoaXBzOiBRdWVyeUxpc3Q8TWF0Q2hpcD4pID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbnM6IE1hdENoaXBBY3Rpb25bXSA9IFtdO1xuICAgICAgY2hpcHMuZm9yRWFjaChjaGlwID0+IGNoaXAuX2dldEFjdGlvbnMoKS5mb3JFYWNoKGFjdGlvbiA9PiBhY3Rpb25zLnB1c2goYWN0aW9uKSkpO1xuICAgICAgdGhpcy5fY2hpcEFjdGlvbnMucmVzZXQoYWN0aW9ucyk7XG4gICAgICB0aGlzLl9jaGlwQWN0aW9ucy5ub3RpZnlPbkNoYW5nZXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX2NoaXBBY3Rpb25zKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC5za2lwUHJlZGljYXRlKGFjdGlvbiA9PiB0aGlzLl9za2lwUHJlZGljYXRlKGFjdGlvbikpO1xuXG4gICAgLy8gS2VlcCB0aGUgbWFuYWdlciBhY3RpdmUgaW5kZXggaW4gc3luYyBzbyB0aGF0IG5hdmlnYXRpb24gcGlja3NcbiAgICAvLyB1cCBmcm9tIHRoZSBjdXJyZW50IGNoaXAgaWYgdGhlIHVzZXIgY2xpY2tzIGludG8gdGhlIGxpc3QgZGlyZWN0bHkuXG4gICAgdGhpcy5jaGlwRm9jdXNDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoe2NoaXB9KSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBjaGlwLl9nZXRTb3VyY2VBY3Rpb24oZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBhcyBFbGVtZW50KTtcblxuICAgICAgaWYgKGFjdGlvbikge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2Rpcj8uY2hhbmdlXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoZGlyZWN0aW9uID0+IHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbihkaXJlY3Rpb24pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGtleSBtYW5hZ2VyIHNob3VsZCBhdm9pZCBwdXR0aW5nIGEgZ2l2ZW4gY2hpcCBhY3Rpb24gaW4gdGhlIHRhYiBpbmRleC4gU2tpcFxuICAgKiBub24taW50ZXJhY3RpdmUgYW5kIGRpc2FibGVkIGFjdGlvbnMgc2luY2UgdGhlIHVzZXIgY2FuJ3QgZG8gYW55dGhpbmcgd2l0aCB0aGVtLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9za2lwUHJlZGljYXRlKGFjdGlvbjogTWF0Q2hpcEFjdGlvbik6IGJvb2xlYW4ge1xuICAgIC8vIFNraXAgY2hpcHMgdGhhdCB0aGUgdXNlciBjYW5ub3QgaW50ZXJhY3Qgd2l0aC4gYG1hdC1jaGlwLXNldGAgZG9lcyBub3QgcGVybWl0IGZvY3VzaW5nIGRpc2FibGVkXG4gICAgLy8gY2hpcHMuXG4gICAgcmV0dXJuICFhY3Rpb24uaXNJbnRlcmFjdGl2ZSB8fCBhY3Rpb24uZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogTGlzdGVucyB0byBjaGFuZ2VzIGluIHRoZSBjaGlwIHNldCBhbmQgc3luY3MgdXAgdGhlIHN0YXRlIG9mIHRoZSBpbmRpdmlkdWFsIGNoaXBzLiAqL1xuICBwcml2YXRlIF90cmFja0NoaXBTZXRDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2NoaXBzLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgLy8gU2luY2UgdGhpcyBoYXBwZW5zIGFmdGVyIHRoZSBjb250ZW50IGhhcyBiZWVuXG4gICAgICAgIC8vIGNoZWNrZWQsIHdlIG5lZWQgdG8gZGVmZXIgaXQgdG8gdGhlIG5leHQgdGljay5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9zeW5jQ2hpcHNTdGF0ZSgpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVkaXJlY3REZXN0cm95ZWRDaGlwRm9jdXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTdGFydHMgdHJhY2tpbmcgdGhlIGRlc3Ryb3llZCBjaGlwcyBpbiBvcmRlciB0byBjYXB0dXJlIHRoZSBmb2N1c2VkIG9uZS4gKi9cbiAgcHJpdmF0ZSBfdHJhY2tEZXN0cm95ZWRGb2N1c2VkQ2hpcCgpIHtcbiAgICB0aGlzLmNoaXBEZXN0cm95ZWRDaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoZXZlbnQ6IE1hdENoaXBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgY2hpcEFycmF5ID0gdGhpcy5fY2hpcHMudG9BcnJheSgpO1xuICAgICAgY29uc3QgY2hpcEluZGV4ID0gY2hpcEFycmF5LmluZGV4T2YoZXZlbnQuY2hpcCk7XG5cbiAgICAgIC8vIElmIHRoZSBmb2N1c2VkIGNoaXAgaXMgZGVzdHJveWVkLCBzYXZlIGl0cyBpbmRleCBzbyB0aGF0IHdlIGNhbiBtb3ZlIGZvY3VzIHRvIHRoZSBuZXh0XG4gICAgICAvLyBjaGlwLiBXZSBvbmx5IHNhdmUgdGhlIGluZGV4IGhlcmUsIHJhdGhlciB0aGFuIG1vdmUgdGhlIGZvY3VzIGltbWVkaWF0ZWx5LCBiZWNhdXNlIHdlIHdhbnRcbiAgICAgIC8vIHRvIHdhaXQgdW50aWwgdGhlIGNoaXAgaXMgcmVtb3ZlZCBmcm9tIHRoZSBjaGlwIGxpc3QgYmVmb3JlIGZvY3VzaW5nIHRoZSBuZXh0IG9uZS4gVGhpc1xuICAgICAgLy8gYWxsb3dzIHVzIHRvIGtlZXAgZm9jdXMgb24gdGhlIHNhbWUgaW5kZXggaWYgdGhlIGNoaXAgZ2V0cyBzd2FwcGVkIG91dC5cbiAgICAgIGlmICh0aGlzLl9pc1ZhbGlkSW5kZXgoY2hpcEluZGV4KSAmJiBldmVudC5jaGlwLl9oYXNGb2N1cygpKSB7XG4gICAgICAgIHRoaXMuX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4ID0gY2hpcEluZGV4O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIHRoZSBuZXh0IGFwcHJvcHJpYXRlIGNoaXAgdG8gbW92ZSBmb2N1cyB0byxcbiAgICogaWYgdGhlIGN1cnJlbnRseS1mb2N1c2VkIGNoaXAgaXMgZGVzdHJveWVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVkaXJlY3REZXN0cm95ZWRDaGlwRm9jdXMoKSB7XG4gICAgaWYgKHRoaXMuX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4ID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fY2hpcHMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBuZXdJbmRleCA9IE1hdGgubWluKHRoaXMuX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4LCB0aGlzLl9jaGlwcy5sZW5ndGggLSAxKTtcbiAgICAgIGNvbnN0IGNoaXBUb0ZvY3VzID0gdGhpcy5fY2hpcHMudG9BcnJheSgpW25ld0luZGV4XTtcblxuICAgICAgaWYgKGNoaXBUb0ZvY3VzLmRpc2FibGVkKSB7XG4gICAgICAgIC8vIElmIHdlJ3JlIGRvd24gdG8gb25lIGRpc2FibGVkIGNoaXAsIG1vdmUgZm9jdXMgYmFjayB0byB0aGUgc2V0LlxuICAgICAgICBpZiAodGhpcy5fY2hpcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0UHJldmlvdXNJdGVtQWN0aXZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaXBUb0ZvY3VzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleCA9IG51bGw7XG4gIH1cbn1cbiJdfQ==