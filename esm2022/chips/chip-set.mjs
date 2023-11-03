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
    /** Combined stream of all of the child chips' focus events. */
    get chipFocusChanges() {
        return this._getChipStream(chip => chip._onFocus);
    }
    /** Combined stream of all of the child chips' destroy events. */
    get chipDestroyedChanges() {
        return this._getChipStream(chip => chip.destroyed);
    }
    /** Combined stream of all of the child chips' remove events. */
    get chipRemovedChanges() {
        return this._getChipStream(chip => chip.removed);
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
        return !this._chips || this._chips.length === 0;
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
     * Removes the `tabindex` from the chip set and resets it back afterwards, allowing the
     * user to tab out of it. This prevents the set from capturing focus and redirecting
     * it back to the first chip, creating a focus trap, if it user tries to tab away.
     */
    _allowFocusEscape() {
        if (this.tabIndex !== -1) {
            const previousTabIndex = this.tabIndex;
            this.tabIndex = -1;
            // Note that this needs to be a `setTimeout`, because a `Promise.resolve`
            // doesn't allow enough time for the focus to escape.
            setTimeout(() => (this.tabIndex = previousTabIndex));
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
            if (currentElement.classList.contains('mat-mdc-chip')) {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.0", ngImport: i0, type: MatChipSet, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0-rc.0", type: MatChipSet, selector: "mat-chip-set", inputs: { disabled: "disabled", role: "role" }, host: { listeners: { "keydown": "_handleKeydown($event)" }, properties: { "attr.role": "role" }, classAttribute: "mat-mdc-chip-set mdc-evolution-chip-set" }, queries: [{ propertyName: "_chips", predicate: MatChip, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.0", ngImport: i0, type: MatChipSet, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-set', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, host: {
                        'class': 'mat-mdc-chip-set mdc-evolution-chip-set',
                        '(keydown)': '_handleKeydown($event)',
                        '[attr.role]': 'role',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }], propDecorators: { disabled: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixLQUFLLEVBRUwsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxRQUFRLENBQUM7OztBQUc3Qzs7O0dBR0c7QUFDSCxNQUFlLGNBQWM7SUFFM0IsWUFBWSxXQUF1QixJQUFHLENBQUM7Q0FDeEM7QUFDRCxNQUFNLG9CQUFvQixHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBaUJILE1BQU0sT0FBTyxVQUNYLFNBQVEsb0JBQW9CO0lBZTVCLCtEQUErRDtJQUMvRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELGlFQUFpRTtJQUNq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bGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0hhc1RhYkluZGV4LCBtaXhpblRhYkluZGV4fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXAsIE1hdENoaXBFdmVudH0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TWF0Q2hpcEFjdGlvbn0gZnJvbSAnLi9jaGlwLWFjdGlvbic7XG5cbi8qKlxuICogQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRDaGlwU2V0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5hYnN0cmFjdCBjbGFzcyBNYXRDaGlwU2V0QmFzZSB7XG4gIGFic3RyYWN0IGRpc2FibGVkOiBib29sZWFuO1xuICBjb25zdHJ1Y3RvcihfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRDaGlwU2V0TWl4aW5CYXNlID0gbWl4aW5UYWJJbmRleChNYXRDaGlwU2V0QmFzZSk7XG5cbi8qKlxuICogQmFzaWMgY29udGFpbmVyIGNvbXBvbmVudCBmb3IgdGhlIE1hdENoaXAgY29tcG9uZW50LlxuICpcbiAqIEV4dGVuZGVkIGJ5IE1hdENoaXBMaXN0Ym94IGFuZCBNYXRDaGlwR3JpZCBmb3IgZGlmZmVyZW50IGludGVyYWN0aW9uIHBhdHRlcm5zLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1zZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZGMtZXZvbHV0aW9uLWNoaXAtc2V0X19jaGlwc1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJ2NoaXAtc2V0LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtY2hpcC1zZXQgbWRjLWV2b2x1dGlvbi1jaGlwLXNldCcsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwU2V0XG4gIGV4dGVuZHMgX01hdENoaXBTZXRNaXhpbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBIYXNUYWJJbmRleCwgT25EZXN0cm95XG57XG4gIC8qKiBJbmRleCBvZiB0aGUgbGFzdCBkZXN0cm95ZWQgY2hpcCB0aGF0IGhhZCBmb2N1cy4gKi9cbiAgcHJpdmF0ZSBfbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXg6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVc2VkIHRvIG1hbmFnZSBmb2N1cyB3aXRoaW4gdGhlIGNoaXAgbGlzdC4gKi9cbiAgcHJvdGVjdGVkIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0Q2hpcEFjdGlvbj47XG5cbiAgLyoqIFN1YmplY3QgdGhhdCBlbWl0cyB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gZGVzdHJveWVkLiAqL1xuICBwcm90ZWN0ZWQgX2Rlc3Ryb3llZCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFJvbGUgdG8gdXNlIGlmIGl0IGhhc24ndCBiZWVuIG92ZXJ3cml0dGVuIGJ5IHRoZSB1c2VyLiAqL1xuICBwcm90ZWN0ZWQgX2RlZmF1bHRSb2xlID0gJ3ByZXNlbnRhdGlvbic7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBmb2N1cyBldmVudHMuICovXG4gIGdldCBjaGlwRm9jdXNDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaXBTdHJlYW0oY2hpcCA9PiBjaGlwLl9vbkZvY3VzKTtcbiAgfVxuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgZGVzdHJveSBldmVudHMuICovXG4gIGdldCBjaGlwRGVzdHJveWVkQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRDaGlwU3RyZWFtKGNoaXAgPT4gY2hpcC5kZXN0cm95ZWQpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyByZW1vdmUgZXZlbnRzLiAqL1xuICBnZXQgY2hpcFJlbW92ZWRDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaXBTdHJlYW0oY2hpcCA9PiBjaGlwLnJlbW92ZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgc2V0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgY29udGFpbnMgY2hpcHMgb3Igbm90LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9jaGlwcyB8fCB0aGlzLl9jaGlwcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogVGhlIEFSSUEgcm9sZSBhcHBsaWVkIHRvIHRoZSBjaGlwIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvbGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2V4cGxpY2l0Um9sZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Um9sZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbXB0eSA/IG51bGwgOiB0aGlzLl9kZWZhdWx0Um9sZTtcbiAgfVxuXG4gIHNldCByb2xlKHZhbHVlOiBzdHJpbmcgfCBudWxsKSB7XG4gICAgdGhpcy5fZXhwbGljaXRSb2xlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfZXhwbGljaXRSb2xlOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciBhbnkgb2YgdGhlIGNoaXBzIGluc2lkZSBvZiB0aGlzIGNoaXAtc2V0IGhhcyBmb2N1cy4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc0ZvY3VzZWRDaGlwKCk7XG4gIH1cblxuICAvKiogVGhlIGNoaXBzIHRoYXQgYXJlIHBhcnQgb2YgdGhpcyBjaGlwIHNldC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRDaGlwLCB7XG4gICAgLy8gV2UgbmVlZCB0byB1c2UgYGRlc2NlbmRhbnRzOiB0cnVlYCwgYmVjYXVzZSBJdnkgd2lsbCBubyBsb25nZXIgbWF0Y2hcbiAgICAvLyBpbmRpcmVjdCBkZXNjZW5kYW50cyBpZiBpdCdzIGxlZnQgYXMgZmFsc2UuXG4gICAgZGVzY2VuZGFudHM6IHRydWUsXG4gIH0pXG4gIF9jaGlwczogUXVlcnlMaXN0PE1hdENoaXA+O1xuXG4gIC8qKiBGbGF0IGxpc3Qgb2YgYWxsIHRoZSBhY3Rpb25zIGNvbnRhaW5lZCB3aXRoaW4gdGhlIGNoaXBzLiAqL1xuICBfY2hpcEFjdGlvbnMgPSBuZXcgUXVlcnlMaXN0PE1hdENoaXBBY3Rpb24+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICApIHtcbiAgICBzdXBlcihfZWxlbWVudFJlZik7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fc2V0VXBGb2N1c01hbmFnZW1lbnQoKTtcbiAgICB0aGlzLl90cmFja0NoaXBTZXRDaGFuZ2VzKCk7XG4gICAgdGhpcy5fdHJhY2tEZXN0cm95ZWRGb2N1c2VkQ2hpcCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX2NoaXBBY3Rpb25zLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFueSBvZiB0aGUgY2hpcHMgaXMgZm9jdXNlZC4gKi9cbiAgcHJvdGVjdGVkIF9oYXNGb2N1c2VkQ2hpcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcHMgJiYgdGhpcy5fY2hpcHMuc29tZShjaGlwID0+IGNoaXAuX2hhc0ZvY3VzKCkpO1xuICB9XG5cbiAgLyoqIFN5bmNzIHRoZSBjaGlwLXNldCdzIHN0YXRlIHdpdGggdGhlIGluZGl2aWR1YWwgY2hpcHMuICovXG4gIHByb3RlY3RlZCBfc3luY0NoaXBzU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuX2NoaXBzKSB7XG4gICAgICB0aGlzLl9jaGlwcy5mb3JFYWNoKGNoaXAgPT4ge1xuICAgICAgICBjaGlwLmRpc2FibGVkID0gdGhpcy5fZGlzYWJsZWQ7XG4gICAgICAgIGNoaXAuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIER1bW15IG1ldGhvZCBmb3Igc3ViY2xhc3NlcyB0byBvdmVycmlkZS4gQmFzZSBjaGlwIHNldCBjYW5ub3QgYmUgZm9jdXNlZC4gKi9cbiAgZm9jdXMoKSB7fVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgY2hpcCBzZXQuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX29yaWdpbmF0ZXNGcm9tQ2hpcChldmVudCkpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXRpbGl0eSB0byBlbnN1cmUgYWxsIGluZGV4ZXMgYXJlIHZhbGlkLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IHRvIGJlIGNoZWNrZWQuXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGluZGV4IGlzIHZhbGlkIGZvciBvdXIgbGlzdCBvZiBjaGlwcy5cbiAgICovXG4gIHByb3RlY3RlZCBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuX2NoaXBzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBgdGFiaW5kZXhgIGZyb20gdGhlIGNoaXAgc2V0IGFuZCByZXNldHMgaXQgYmFjayBhZnRlcndhcmRzLCBhbGxvd2luZyB0aGVcbiAgICogdXNlciB0byB0YWIgb3V0IG9mIGl0LiBUaGlzIHByZXZlbnRzIHRoZSBzZXQgZnJvbSBjYXB0dXJpbmcgZm9jdXMgYW5kIHJlZGlyZWN0aW5nXG4gICAqIGl0IGJhY2sgdG8gdGhlIGZpcnN0IGNoaXAsIGNyZWF0aW5nIGEgZm9jdXMgdHJhcCwgaWYgaXQgdXNlciB0cmllcyB0byB0YWIgYXdheS5cbiAgICovXG4gIHByb3RlY3RlZCBfYWxsb3dGb2N1c0VzY2FwZSgpIHtcbiAgICBpZiAodGhpcy50YWJJbmRleCAhPT0gLTEpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzVGFiSW5kZXggPSB0aGlzLnRhYkluZGV4O1xuICAgICAgdGhpcy50YWJJbmRleCA9IC0xO1xuXG4gICAgICAvLyBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIGBzZXRUaW1lb3V0YCwgYmVjYXVzZSBhIGBQcm9taXNlLnJlc29sdmVgXG4gICAgICAvLyBkb2Vzbid0IGFsbG93IGVub3VnaCB0aW1lIGZvciB0aGUgZm9jdXMgdG8gZXNjYXBlLlxuICAgICAgc2V0VGltZW91dCgoKSA9PiAodGhpcy50YWJJbmRleCA9IHByZXZpb3VzVGFiSW5kZXgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHN0cmVhbSBvZiBldmVudHMgZnJvbSBhbGwgdGhlIGNoaXBzIHdpdGhpbiB0aGUgc2V0LlxuICAgKiBUaGUgc3RyZWFtIHdpbGwgYXV0b21hdGljYWxseSBpbmNvcnBvcmF0ZSBhbnkgbmV3bHktYWRkZWQgY2hpcHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldENoaXBTdHJlYW08VCwgQyBleHRlbmRzIE1hdENoaXAgPSBNYXRDaGlwPihcbiAgICBtYXBwaW5nRnVuY3Rpb246IChjaGlwOiBDKSA9PiBPYnNlcnZhYmxlPFQ+LFxuICApOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKFxuICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IG1lcmdlKC4uLih0aGlzLl9jaGlwcyBhcyBRdWVyeUxpc3Q8Qz4pLm1hcChtYXBwaW5nRnVuY3Rpb24pKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciBhbiBldmVudCBjb21lcyBmcm9tIGluc2lkZSBhIGNoaXAgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIF9vcmlnaW5hdGVzRnJvbUNoaXAoZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IGN1cnJlbnRFbGVtZW50ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICAgIHdoaWxlIChjdXJyZW50RWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBpZiAoY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtbWRjLWNoaXAnKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIGNoaXAgc2V0J3MgZm9jdXMgbWFuYWdlbWVudCBsb2dpYy4gKi9cbiAgcHJpdmF0ZSBfc2V0VXBGb2N1c01hbmFnZW1lbnQoKSB7XG4gICAgLy8gQ3JlYXRlIGEgZmxhdCBgUXVlcnlMaXN0YCBjb250YWluaW5nIHRoZSBhY3Rpb25zIG9mIGFsbCBvZiB0aGUgY2hpcHMuXG4gICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gbmF2aWdhdGUgYm90aCB3aXRoaW4gdGhlIGNoaXAgYW5kIG1vdmUgdG8gdGhlIG5leHQvcHJldmlvdXNcbiAgICAvLyBvbmUgdXNpbmcgdGhlIGV4aXN0aW5nIGBMaXN0S2V5TWFuYWdlcmAuXG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aCh0aGlzLl9jaGlwcykpLnN1YnNjcmliZSgoY2hpcHM6IFF1ZXJ5TGlzdDxNYXRDaGlwPikgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uczogTWF0Q2hpcEFjdGlvbltdID0gW107XG4gICAgICBjaGlwcy5mb3JFYWNoKGNoaXAgPT4gY2hpcC5fZ2V0QWN0aW9ucygpLmZvckVhY2goYWN0aW9uID0+IGFjdGlvbnMucHVzaChhY3Rpb24pKSk7XG4gICAgICB0aGlzLl9jaGlwQWN0aW9ucy5yZXNldChhY3Rpb25zKTtcbiAgICAgIHRoaXMuX2NoaXBBY3Rpb25zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5fY2hpcEFjdGlvbnMpXG4gICAgICAud2l0aFZlcnRpY2FsT3JpZW50YXRpb24oKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cicpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLnNraXBQcmVkaWNhdGUoYWN0aW9uID0+IHRoaXMuX3NraXBQcmVkaWNhdGUoYWN0aW9uKSk7XG5cbiAgICAvLyBLZWVwIHRoZSBtYW5hZ2VyIGFjdGl2ZSBpbmRleCBpbiBzeW5jIHNvIHRoYXQgbmF2aWdhdGlvbiBwaWNrc1xuICAgIC8vIHVwIGZyb20gdGhlIGN1cnJlbnQgY2hpcCBpZiB0aGUgdXNlciBjbGlja3MgaW50byB0aGUgbGlzdCBkaXJlY3RseS5cbiAgICB0aGlzLmNoaXBGb2N1c0NoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCh7Y2hpcH0pID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGNoaXAuX2dldFNvdXJjZUFjdGlvbihkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShhY3Rpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlyPy5jaGFuZ2VcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShkaXJlY3Rpb24gPT4gdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKGRpcmVjdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBjaGlwIGFjdGlvbiBpbiB0aGUgdGFiIGluZGV4LiBTa2lwXG4gICAqIG5vbi1pbnRlcmFjdGl2ZSBhbmQgZGlzYWJsZWQgYWN0aW9ucyBzaW5jZSB0aGUgdXNlciBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIHRoZW0uXG4gICAqL1xuICBwcm90ZWN0ZWQgX3NraXBQcmVkaWNhdGUoYWN0aW9uOiBNYXRDaGlwQWN0aW9uKTogYm9vbGVhbiB7XG4gICAgLy8gU2tpcCBjaGlwcyB0aGF0IHRoZSB1c2VyIGNhbm5vdCBpbnRlcmFjdCB3aXRoLiBgbWF0LWNoaXAtc2V0YCBkb2VzIG5vdCBwZXJtaXQgZm9jdXNpbmcgZGlzYWJsZWRcbiAgICAvLyBjaGlwcy5cbiAgICByZXR1cm4gIWFjdGlvbi5pc0ludGVyYWN0aXZlIHx8IGFjdGlvbi5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gdGhlIGNoaXAgc2V0IGFuZCBzeW5jcyB1cCB0aGUgc3RhdGUgb2YgdGhlIGluZGl2aWR1YWwgY2hpcHMuICovXG4gIHByaXZhdGUgX3RyYWNrQ2hpcFNldENoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAvLyBTaW5jZSB0aGlzIGhhcHBlbnMgYWZ0ZXIgdGhlIGNvbnRlbnQgaGFzIGJlZW5cbiAgICAgICAgLy8gY2hlY2tlZCwgd2UgbmVlZCB0byBkZWZlciBpdCB0byB0aGUgbmV4dCB0aWNrLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX3N5bmNDaGlwc1N0YXRlKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZWRpcmVjdERlc3Ryb3llZENoaXBGb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0cmFja2luZyB0aGUgZGVzdHJveWVkIGNoaXBzIGluIG9yZGVyIHRvIGNhcHR1cmUgdGhlIGZvY3VzZWQgb25lLiAqL1xuICBwcml2YXRlIF90cmFja0Rlc3Ryb3llZEZvY3VzZWRDaGlwKCkge1xuICAgIHRoaXMuY2hpcERlc3Ryb3llZENoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKChldmVudDogTWF0Q2hpcEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBjaGlwQXJyYXkgPSB0aGlzLl9jaGlwcy50b0FycmF5KCk7XG4gICAgICBjb25zdCBjaGlwSW5kZXggPSBjaGlwQXJyYXkuaW5kZXhPZihldmVudC5jaGlwKTtcblxuICAgICAgLy8gSWYgdGhlIGZvY3VzZWQgY2hpcCBpcyBkZXN0cm95ZWQsIHNhdmUgaXRzIGluZGV4IHNvIHRoYXQgd2UgY2FuIG1vdmUgZm9jdXMgdG8gdGhlIG5leHRcbiAgICAgIC8vIGNoaXAuIFdlIG9ubHkgc2F2ZSB0aGUgaW5kZXggaGVyZSwgcmF0aGVyIHRoYW4gbW92ZSB0aGUgZm9jdXMgaW1tZWRpYXRlbHksIGJlY2F1c2Ugd2Ugd2FudFxuICAgICAgLy8gdG8gd2FpdCB1bnRpbCB0aGUgY2hpcCBpcyByZW1vdmVkIGZyb20gdGhlIGNoaXAgbGlzdCBiZWZvcmUgZm9jdXNpbmcgdGhlIG5leHQgb25lLiBUaGlzXG4gICAgICAvLyBhbGxvd3MgdXMgdG8ga2VlcCBmb2N1cyBvbiB0aGUgc2FtZSBpbmRleCBpZiB0aGUgY2hpcCBnZXRzIHN3YXBwZWQgb3V0LlxuICAgICAgaWYgKHRoaXMuX2lzVmFsaWRJbmRleChjaGlwSW5kZXgpICYmIGV2ZW50LmNoaXAuX2hhc0ZvY3VzKCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXggPSBjaGlwSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIG5leHQgYXBwcm9wcmlhdGUgY2hpcCB0byBtb3ZlIGZvY3VzIHRvLFxuICAgKiBpZiB0aGUgY3VycmVudGx5LWZvY3VzZWQgY2hpcCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZWRpcmVjdERlc3Ryb3llZENoaXBGb2N1cygpIHtcbiAgICBpZiAodGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jaGlwcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gTWF0aC5taW4odGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXgsIHRoaXMuX2NoaXBzLmxlbmd0aCAtIDEpO1xuICAgICAgY29uc3QgY2hpcFRvRm9jdXMgPSB0aGlzLl9jaGlwcy50b0FycmF5KClbbmV3SW5kZXhdO1xuXG4gICAgICBpZiAoY2hpcFRvRm9jdXMuZGlzYWJsZWQpIHtcbiAgICAgICAgLy8gSWYgd2UncmUgZG93biB0byBvbmUgZGlzYWJsZWQgY2hpcCwgbW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBzZXQuXG4gICAgICAgIGlmICh0aGlzLl9jaGlwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRQcmV2aW91c0l0ZW1BY3RpdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpcFRvRm9jdXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4ID0gbnVsbDtcbiAgfVxufVxuIl19