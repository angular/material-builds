/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, Optional, QueryList, ViewEncapsulation, booleanAttribute, numberAttribute, } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatChip } from './chip';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
/**
 * Basic container component for the MatChip component.
 *
 * Extended by MatChipListbox and MatChipGrid for different interaction patterns.
 */
export class MatChipSet {
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
        this._disabled = value;
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
        /** Tabindex of the chip set. */
        this.tabIndex = 0;
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
        const previous = this._elementRef.nativeElement.tabIndex;
        if (previous !== -1) {
            // Set the tabindex directly on the element, instead of going through
            // the data binding, because we aren't guaranteed that change detection
            // will run quickly enough to allow focus to escape.
            this._elementRef.nativeElement.tabIndex = -1;
            // Note that this needs to be a `setTimeout`, because a `Promise.resolve`
            // doesn't allow enough time for the focus to escape.
            setTimeout(() => (this._elementRef.nativeElement.tabIndex = previous));
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatChipSet, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "18.2.0-next.2", type: MatChipSet, isStandalone: true, selector: "mat-chip-set", inputs: { disabled: ["disabled", "disabled", booleanAttribute], role: "role", tabIndex: ["tabIndex", "tabIndex", (value) => (value == null ? 0 : numberAttribute(value))] }, host: { listeners: { "keydown": "_handleKeydown($event)" }, properties: { "attr.role": "role" }, classAttribute: "mat-mdc-chip-set mdc-evolution-chip-set" }, queries: [{ propertyName: "_chips", predicate: MatChip, descendants: true }], ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatChipSet, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-set', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, host: {
                        'class': 'mat-mdc-chip-set mdc-evolution-chip-set',
                        '(keydown)': '_handleKeydown($event)',
                        '[attr.role]': 'role',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }], propDecorators: { disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], role: [{
                type: Input
            }], tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => (value == null ? 0 : numberAttribute(value)),
                    }]
            }], _chips: [{
                type: ContentChildren,
                args: [MatChip, {
                        // We need to use `descendants: true`, because Ivy will no longer match
                        // indirect descendants if it's left as false.
                        descendants: true,
                    }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixLQUFLLEVBRUwsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FDaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0QsT0FBTyxFQUFDLE9BQU8sRUFBZSxNQUFNLFFBQVEsQ0FBQzs7O0FBRzdDOzs7O0dBSUc7QUFrQkgsTUFBTSxPQUFPLFVBQVU7SUFhckIsK0RBQStEO0lBQy9ELElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUVBQWlFO0lBQ2pFLElBQUksb0JBQW9CO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLElBQUksa0JBQWtCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElB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WCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQWlCaEMsSUFBSTtzQkFEUCxLQUFLO2dCQWFOLFFBQVE7c0JBSFAsS0FBSzt1QkFBQzt3QkFDTCxTQUFTLEVBQUUsQ0FBQyxLQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzVFO2dCQW1CRCxNQUFNO3NCQUxMLGVBQWU7dUJBQUMsT0FBTyxFQUFFO3dCQUN4Qix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgbnVtYmVyQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdCwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENoaXAsIE1hdENoaXBFdmVudH0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TWF0Q2hpcEFjdGlvbn0gZnJvbSAnLi9jaGlwLWFjdGlvbic7XG5cbi8qKlxuICogQmFzaWMgY29udGFpbmVyIGNvbXBvbmVudCBmb3IgdGhlIE1hdENoaXAgY29tcG9uZW50LlxuICpcbiAqIEV4dGVuZGVkIGJ5IE1hdENoaXBMaXN0Ym94IGFuZCBNYXRDaGlwR3JpZCBmb3IgZGlmZmVyZW50IGludGVyYWN0aW9uIHBhdHRlcm5zLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2hpcC1zZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJtZGMtZXZvbHV0aW9uLWNoaXAtc2V0X19jaGlwc1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmw6ICdjaGlwLXNldC5jc3MnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtY2hpcC1zZXQgbWRjLWV2b2x1dGlvbi1jaGlwLXNldCcsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwU2V0IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEluZGV4IG9mIHRoZSBsYXN0IGRlc3Ryb3llZCBjaGlwIHRoYXQgaGFkIGZvY3VzLiAqL1xuICBwcml2YXRlIF9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVzZWQgdG8gbWFuYWdlIGZvY3VzIHdpdGhpbiB0aGUgY2hpcCBsaXN0LiAqL1xuICBwcm90ZWN0ZWQgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRDaGlwQWN0aW9uPjtcblxuICAvKiogU3ViamVjdCB0aGF0IGVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogUm9sZSB0byB1c2UgaWYgaXQgaGFzbid0IGJlZW4gb3ZlcndyaXR0ZW4gYnkgdGhlIHVzZXIuICovXG4gIHByb3RlY3RlZCBfZGVmYXVsdFJvbGUgPSAncHJlc2VudGF0aW9uJztcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIGZvY3VzIGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBGb2N1c0NoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAuX29uRm9jdXMpO1xuICB9XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIGNoaXBzJyBkZXN0cm95IGV2ZW50cy4gKi9cbiAgZ2V0IGNoaXBEZXN0cm95ZWRDaGFuZ2VzKCk6IE9ic2VydmFibGU8TWF0Q2hpcEV2ZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaXBTdHJlYW0oY2hpcCA9PiBjaGlwLmRlc3Ryb3llZCk7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIHJlbW92ZSBldmVudHMuICovXG4gIGdldCBjaGlwUmVtb3ZlZENoYW5nZXMoKTogT2JzZXJ2YWJsZTxNYXRDaGlwRXZlbnQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q2hpcFN0cmVhbShjaGlwID0+IGNoaXAucmVtb3ZlZCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2hpcCBzZXQgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgY29udGFpbnMgY2hpcHMgb3Igbm90LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9jaGlwcyB8fCB0aGlzLl9jaGlwcy5sZW5ndGggPT09IDA7XG4gIH1cblxuICAvKiogVGhlIEFSSUEgcm9sZSBhcHBsaWVkIHRvIHRoZSBjaGlwIHNldC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvbGUoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuX2V4cGxpY2l0Um9sZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2V4cGxpY2l0Um9sZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5lbXB0eSA/IG51bGwgOiB0aGlzLl9kZWZhdWx0Um9sZTtcbiAgfVxuXG4gIC8qKiBUYWJpbmRleCBvZiB0aGUgY2hpcCBzZXQuICovXG4gIEBJbnB1dCh7XG4gICAgdHJhbnNmb3JtOiAodmFsdWU6IHVua25vd24pID0+ICh2YWx1ZSA9PSBudWxsID8gMCA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSkpLFxuICB9KVxuICB0YWJJbmRleDogbnVtYmVyID0gMDtcblxuICBzZXQgcm9sZSh2YWx1ZTogc3RyaW5nIHwgbnVsbCkge1xuICAgIHRoaXMuX2V4cGxpY2l0Um9sZSA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2V4cGxpY2l0Um9sZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgYW55IG9mIHRoZSBjaGlwcyBpbnNpZGUgb2YgdGhpcyBjaGlwLXNldCBoYXMgZm9jdXMuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNGb2N1c2VkQ2hpcCgpO1xuICB9XG5cbiAgLyoqIFRoZSBjaGlwcyB0aGF0IGFyZSBwYXJ0IG9mIHRoaXMgY2hpcCBzZXQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0Q2hpcCwge1xuICAgIC8vIFdlIG5lZWQgdG8gdXNlIGBkZXNjZW5kYW50czogdHJ1ZWAsIGJlY2F1c2UgSXZ5IHdpbGwgbm8gbG9uZ2VyIG1hdGNoXG4gICAgLy8gaW5kaXJlY3QgZGVzY2VuZGFudHMgaWYgaXQncyBsZWZ0IGFzIGZhbHNlLlxuICAgIGRlc2NlbmRhbnRzOiB0cnVlLFxuICB9KVxuICBfY2hpcHM6IFF1ZXJ5TGlzdDxNYXRDaGlwPjtcblxuICAvKiogRmxhdCBsaXN0IG9mIGFsbCB0aGUgYWN0aW9ucyBjb250YWluZWQgd2l0aGluIHRoZSBjaGlwcy4gKi9cbiAgX2NoaXBBY3Rpb25zID0gbmV3IFF1ZXJ5TGlzdDxNYXRDaGlwQWN0aW9uPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zZXRVcEZvY3VzTWFuYWdlbWVudCgpO1xuICAgIHRoaXMuX3RyYWNrQ2hpcFNldENoYW5nZXMoKTtcbiAgICB0aGlzLl90cmFja0Rlc3Ryb3llZEZvY3VzZWRDaGlwKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fY2hpcEFjdGlvbnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgYW55IG9mIHRoZSBjaGlwcyBpcyBmb2N1c2VkLiAqL1xuICBwcm90ZWN0ZWQgX2hhc0ZvY3VzZWRDaGlwKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGlwcyAmJiB0aGlzLl9jaGlwcy5zb21lKGNoaXAgPT4gY2hpcC5faGFzRm9jdXMoKSk7XG4gIH1cblxuICAvKiogU3luY3MgdGhlIGNoaXAtc2V0J3Mgc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBjaGlwcy4gKi9cbiAgcHJvdGVjdGVkIF9zeW5jQ2hpcHNTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fY2hpcHMpIHtcbiAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgIGNoaXAuZGlzYWJsZWQgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICAgICAgY2hpcC5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRHVtbXkgbWV0aG9kIGZvciBzdWJjbGFzc2VzIHRvIG92ZXJyaWRlLiBCYXNlIGNoaXAgc2V0IGNhbm5vdCBiZSBmb2N1c2VkLiAqL1xuICBmb2N1cygpIHt9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIG9uIHRoZSBjaGlwIHNldC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5fb3JpZ2luYXRlc0Zyb21DaGlwKGV2ZW50KSkge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGVuc3VyZSBhbGwgaW5kZXhlcyBhcmUgdmFsaWQuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaW5kZXggaXMgdmFsaWQgZm9yIG91ciBsaXN0IG9mIGNoaXBzLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5fY2hpcHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGB0YWJpbmRleGAgZnJvbSB0aGUgY2hpcCBzZXQgYW5kIHJlc2V0cyBpdCBiYWNrIGFmdGVyd2FyZHMsIGFsbG93aW5nIHRoZVxuICAgKiB1c2VyIHRvIHRhYiBvdXQgb2YgaXQuIFRoaXMgcHJldmVudHMgdGhlIHNldCBmcm9tIGNhcHR1cmluZyBmb2N1cyBhbmQgcmVkaXJlY3RpbmdcbiAgICogaXQgYmFjayB0byB0aGUgZmlyc3QgY2hpcCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwLCBpZiBpdCB1c2VyIHRyaWVzIHRvIHRhYiBhd2F5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRhYkluZGV4O1xuXG4gICAgaWYgKHByZXZpb3VzICE9PSAtMSkge1xuICAgICAgLy8gU2V0IHRoZSB0YWJpbmRleCBkaXJlY3RseSBvbiB0aGUgZWxlbWVudCwgaW5zdGVhZCBvZiBnb2luZyB0aHJvdWdoXG4gICAgICAvLyB0aGUgZGF0YSBiaW5kaW5nLCBiZWNhdXNlIHdlIGFyZW4ndCBndWFyYW50ZWVkIHRoYXQgY2hhbmdlIGRldGVjdGlvblxuICAgICAgLy8gd2lsbCBydW4gcXVpY2tseSBlbm91Z2ggdG8gYWxsb3cgZm9jdXMgdG8gZXNjYXBlLlxuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRhYkluZGV4ID0gLTE7XG5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgYHNldFRpbWVvdXRgLCBiZWNhdXNlIGEgYFByb21pc2UucmVzb2x2ZWBcbiAgICAgIC8vIGRvZXNuJ3QgYWxsb3cgZW5vdWdoIHRpbWUgZm9yIHRoZSBmb2N1cyB0byBlc2NhcGUuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGFiSW5kZXggPSBwcmV2aW91cykpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3RyZWFtIG9mIGV2ZW50cyBmcm9tIGFsbCB0aGUgY2hpcHMgd2l0aGluIHRoZSBzZXQuXG4gICAqIFRoZSBzdHJlYW0gd2lsbCBhdXRvbWF0aWNhbGx5IGluY29ycG9yYXRlIGFueSBuZXdseS1hZGRlZCBjaGlwcy5cbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0Q2hpcFN0cmVhbTxULCBDIGV4dGVuZHMgTWF0Q2hpcCA9IE1hdENoaXA+KFxuICAgIG1hcHBpbmdGdW5jdGlvbjogKGNoaXA6IEMpID0+IE9ic2VydmFibGU8VD4sXG4gICk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLl9jaGlwcy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4uKHRoaXMuX2NoaXBzIGFzIFF1ZXJ5TGlzdDxDPikubWFwKG1hcHBpbmdGdW5jdGlvbikpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFuIGV2ZW50IGNvbWVzIGZyb20gaW5zaWRlIGEgY2hpcCBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgX29yaWdpbmF0ZXNGcm9tQ2hpcChldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gICAgd2hpbGUgKGN1cnJlbnRFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGlmIChjdXJyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC1tZGMtY2hpcCcpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogU2V0cyB1cCB0aGUgY2hpcCBzZXQncyBmb2N1cyBtYW5hZ2VtZW50IGxvZ2ljLiAqL1xuICBwcml2YXRlIF9zZXRVcEZvY3VzTWFuYWdlbWVudCgpIHtcbiAgICAvLyBDcmVhdGUgYSBmbGF0IGBRdWVyeUxpc3RgIGNvbnRhaW5pbmcgdGhlIGFjdGlvbnMgb2YgYWxsIG9mIHRoZSBjaGlwcy5cbiAgICAvLyBUaGlzIGFsbG93cyB1cyB0byBuYXZpZ2F0ZSBib3RoIHdpdGhpbiB0aGUgY2hpcCBhbmQgbW92ZSB0byB0aGUgbmV4dC9wcmV2aW91c1xuICAgIC8vIG9uZSB1c2luZyB0aGUgZXhpc3RpbmcgYExpc3RLZXlNYW5hZ2VyYC5cbiAgICB0aGlzLl9jaGlwcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2NoaXBzKSkuc3Vic2NyaWJlKChjaGlwczogUXVlcnlMaXN0PE1hdENoaXA+KSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25zOiBNYXRDaGlwQWN0aW9uW10gPSBbXTtcbiAgICAgIGNoaXBzLmZvckVhY2goY2hpcCA9PiBjaGlwLl9nZXRBY3Rpb25zKCkuZm9yRWFjaChhY3Rpb24gPT4gYWN0aW9ucy5wdXNoKGFjdGlvbikpKTtcbiAgICAgIHRoaXMuX2NoaXBBY3Rpb25zLnJlc2V0KGFjdGlvbnMpO1xuICAgICAgdGhpcy5fY2hpcEFjdGlvbnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9jaGlwQWN0aW9ucylcbiAgICAgIC53aXRoVmVydGljYWxPcmllbnRhdGlvbigpXG4gICAgICAud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJylcbiAgICAgIC53aXRoSG9tZUFuZEVuZCgpXG4gICAgICAuc2tpcFByZWRpY2F0ZShhY3Rpb24gPT4gdGhpcy5fc2tpcFByZWRpY2F0ZShhY3Rpb24pKTtcblxuICAgIC8vIEtlZXAgdGhlIG1hbmFnZXIgYWN0aXZlIGluZGV4IGluIHN5bmMgc28gdGhhdCBuYXZpZ2F0aW9uIHBpY2tzXG4gICAgLy8gdXAgZnJvbSB0aGUgY3VycmVudCBjaGlwIGlmIHRoZSB1c2VyIGNsaWNrcyBpbnRvIHRoZSBsaXN0IGRpcmVjdGx5LlxuICAgIHRoaXMuY2hpcEZvY3VzQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKHtjaGlwfSkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gY2hpcC5fZ2V0U291cmNlQWN0aW9uKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgRWxlbWVudCk7XG5cbiAgICAgIGlmIChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGFjdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9kaXI/LmNoYW5nZVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKGRpcmVjdGlvbiA9PiB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24oZGlyZWN0aW9uKSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBrZXkgbWFuYWdlciBzaG91bGQgYXZvaWQgcHV0dGluZyBhIGdpdmVuIGNoaXAgYWN0aW9uIGluIHRoZSB0YWIgaW5kZXguIFNraXBcbiAgICogbm9uLWludGVyYWN0aXZlIGFuZCBkaXNhYmxlZCBhY3Rpb25zIHNpbmNlIHRoZSB1c2VyIGNhbid0IGRvIGFueXRoaW5nIHdpdGggdGhlbS5cbiAgICovXG4gIHByb3RlY3RlZCBfc2tpcFByZWRpY2F0ZShhY3Rpb246IE1hdENoaXBBY3Rpb24pOiBib29sZWFuIHtcbiAgICAvLyBTa2lwIGNoaXBzIHRoYXQgdGhlIHVzZXIgY2Fubm90IGludGVyYWN0IHdpdGguIGBtYXQtY2hpcC1zZXRgIGRvZXMgbm90IHBlcm1pdCBmb2N1c2luZyBkaXNhYmxlZFxuICAgIC8vIGNoaXBzLlxuICAgIHJldHVybiAhYWN0aW9uLmlzSW50ZXJhY3RpdmUgfHwgYWN0aW9uLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIExpc3RlbnMgdG8gY2hhbmdlcyBpbiB0aGUgY2hpcCBzZXQgYW5kIHN5bmNzIHVwIHRoZSBzdGF0ZSBvZiB0aGUgaW5kaXZpZHVhbCBjaGlwcy4gKi9cbiAgcHJpdmF0ZSBfdHJhY2tDaGlwU2V0Q2hhbmdlcygpIHtcbiAgICB0aGlzLl9jaGlwcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgIC8vIFNpbmNlIHRoaXMgaGFwcGVucyBhZnRlciB0aGUgY29udGVudCBoYXMgYmVlblxuICAgICAgICAvLyBjaGVja2VkLCB3ZSBuZWVkIHRvIGRlZmVyIGl0IHRvIHRoZSBuZXh0IHRpY2suXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdGhpcy5fc3luY0NoaXBzU3RhdGUoKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlZGlyZWN0RGVzdHJveWVkQ2hpcEZvY3VzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogU3RhcnRzIHRyYWNraW5nIHRoZSBkZXN0cm95ZWQgY2hpcHMgaW4gb3JkZXIgdG8gY2FwdHVyZSB0aGUgZm9jdXNlZCBvbmUuICovXG4gIHByaXZhdGUgX3RyYWNrRGVzdHJveWVkRm9jdXNlZENoaXAoKSB7XG4gICAgdGhpcy5jaGlwRGVzdHJveWVkQ2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKS5zdWJzY3JpYmUoKGV2ZW50OiBNYXRDaGlwRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNoaXBBcnJheSA9IHRoaXMuX2NoaXBzLnRvQXJyYXkoKTtcbiAgICAgIGNvbnN0IGNoaXBJbmRleCA9IGNoaXBBcnJheS5pbmRleE9mKGV2ZW50LmNoaXApO1xuXG4gICAgICAvLyBJZiB0aGUgZm9jdXNlZCBjaGlwIGlzIGRlc3Ryb3llZCwgc2F2ZSBpdHMgaW5kZXggc28gdGhhdCB3ZSBjYW4gbW92ZSBmb2N1cyB0byB0aGUgbmV4dFxuICAgICAgLy8gY2hpcC4gV2Ugb25seSBzYXZlIHRoZSBpbmRleCBoZXJlLCByYXRoZXIgdGhhbiBtb3ZlIHRoZSBmb2N1cyBpbW1lZGlhdGVseSwgYmVjYXVzZSB3ZSB3YW50XG4gICAgICAvLyB0byB3YWl0IHVudGlsIHRoZSBjaGlwIGlzIHJlbW92ZWQgZnJvbSB0aGUgY2hpcCBsaXN0IGJlZm9yZSBmb2N1c2luZyB0aGUgbmV4dCBvbmUuIFRoaXNcbiAgICAgIC8vIGFsbG93cyB1cyB0byBrZWVwIGZvY3VzIG9uIHRoZSBzYW1lIGluZGV4IGlmIHRoZSBjaGlwIGdldHMgc3dhcHBlZCBvdXQuXG4gICAgICBpZiAodGhpcy5faXNWYWxpZEluZGV4KGNoaXBJbmRleCkgJiYgZXZlbnQuY2hpcC5faGFzRm9jdXMoKSkge1xuICAgICAgICB0aGlzLl9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleCA9IGNoaXBJbmRleDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyB0aGUgbmV4dCBhcHByb3ByaWF0ZSBjaGlwIHRvIG1vdmUgZm9jdXMgdG8sXG4gICAqIGlmIHRoZSBjdXJyZW50bHktZm9jdXNlZCBjaGlwIGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIHByaXZhdGUgX3JlZGlyZWN0RGVzdHJveWVkQ2hpcEZvY3VzKCkge1xuICAgIGlmICh0aGlzLl9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleCA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NoaXBzLmxlbmd0aCkge1xuICAgICAgY29uc3QgbmV3SW5kZXggPSBNYXRoLm1pbih0aGlzLl9sYXN0RGVzdHJveWVkRm9jdXNlZENoaXBJbmRleCwgdGhpcy5fY2hpcHMubGVuZ3RoIC0gMSk7XG4gICAgICBjb25zdCBjaGlwVG9Gb2N1cyA9IHRoaXMuX2NoaXBzLnRvQXJyYXkoKVtuZXdJbmRleF07XG5cbiAgICAgIGlmIChjaGlwVG9Gb2N1cy5kaXNhYmxlZCkge1xuICAgICAgICAvLyBJZiB3ZSdyZSBkb3duIHRvIG9uZSBkaXNhYmxlZCBjaGlwLCBtb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIHNldC5cbiAgICAgICAgaWYgKHRoaXMuX2NoaXBzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldFByZXZpb3VzSXRlbUFjdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGlwVG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXggPSBudWxsO1xuICB9XG59XG4iXX0=