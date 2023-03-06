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
MatChipSet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatChipSet, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatChipSet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.0-rc.0", type: MatChipSet, selector: "mat-chip-set", inputs: { disabled: "disabled", role: "role" }, host: { listeners: { "keydown": "_handleKeydown($event)" }, properties: { "attr.role": "role" }, classAttribute: "mat-mdc-chip-set mdc-evolution-chip-set" }, queries: [{ propertyName: "_chips", predicate: MatChip, descendants: true }], usesInheritance: true, ngImport: i0, template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: [".mdc-evolution-chip-set{display:flex}.mdc-evolution-chip-set:focus{outline:none}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mdc-evolution-chip-set--overflow .mdc-evolution-chip-set__chips{flex-flow:nowrap}.mdc-evolution-chip-set .mdc-evolution-chip-set__chips{margin-left:-8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip-set__chips,.mdc-evolution-chip-set .mdc-evolution-chip-set__chips[dir=rtl]{margin-left:0;margin-right:-8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-left:8px;margin-right:0}[dir=rtl] .mdc-evolution-chip-set .mdc-evolution-chip,.mdc-evolution-chip-set .mdc-evolution-chip[dir=rtl]{margin-left:0;margin-right:8px}.mdc-evolution-chip-set .mdc-evolution-chip{margin-top:4px;margin-bottom:4px}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-rc.0", ngImport: i0, type: MatChipSet, decorators: [{
            type: Component,
            args: [{ selector: 'mat-chip-set', template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcC1zZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY2hpcHMvY2hpcC1zZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixLQUFLLEVBRUwsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBQyxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9ELE9BQU8sRUFBQyxPQUFPLEVBQWUsTUFBTSxRQUFRLENBQUM7OztBQUc3Qzs7O0dBR0c7QUFDSCxNQUFlLGNBQWM7SUFFM0IsWUFBWSxXQUF1QixJQUFHLENBQUM7Q0FDeEM7QUFDRCxNQUFNLG9CQUFvQixHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUzRDs7OztHQUlHO0FBaUJILE1BQU0sT0FBTyxVQUNYLFNBQVEsb0JBQW9CO0lBZTVCLCtEQUErRDtJQUMvRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELGdFQUFnRTtJQUNo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UUFBUSxDQUFDLENBQUM7WUFFcEQsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO2dCQUN4QixrRUFBa0U7Z0JBQ2xFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2Q7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2lCQUMxQzthQUNGO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNyQjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUM7SUFDN0MsQ0FBQzs7NEdBaFJVLFVBQVU7Z0dBQVYsVUFBVSx5UkErREosT0FBTyx1RUE3RWQ7Ozs7R0FJVDtnR0FVVSxVQUFVO2tCQWhCdEIsU0FBUzsrQkFDRSxjQUFjLFlBQ2Q7Ozs7R0FJVCxRQUVLO3dCQUNKLE9BQU8sRUFBRSx5Q0FBeUM7d0JBQ2xELFdBQVcsRUFBRSx3QkFBd0I7d0JBQ3JDLGFBQWEsRUFBRSxNQUFNO3FCQUN0QixpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzswQkE4RTVDLFFBQVE7NENBaERQLFFBQVE7c0JBRFgsS0FBSztnQkFpQkYsSUFBSTtzQkFEUCxLQUFLO2dCQXlCTixNQUFNO3NCQUxMLGVBQWU7dUJBQUMsT0FBTyxFQUFFO3dCQUN4Qix1RUFBdUU7d0JBQ3ZFLDhDQUE4Qzt3QkFDOUMsV0FBVyxFQUFFLElBQUk7cUJBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIYXNUYWJJbmRleCwgbWl4aW5UYWJJbmRleH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7c3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDaGlwLCBNYXRDaGlwRXZlbnR9IGZyb20gJy4vY2hpcCc7XG5pbXBvcnQge01hdENoaXBBY3Rpb259IGZyb20gJy4vY2hpcC1hY3Rpb24nO1xuXG4vKipcbiAqIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0Q2hpcFNldC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuYWJzdHJhY3QgY2xhc3MgTWF0Q2hpcFNldEJhc2Uge1xuICBhYnN0cmFjdCBkaXNhYmxlZDogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IoX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0Q2hpcFNldE1peGluQmFzZSA9IG1peGluVGFiSW5kZXgoTWF0Q2hpcFNldEJhc2UpO1xuXG4vKipcbiAqIEJhc2ljIGNvbnRhaW5lciBjb21wb25lbnQgZm9yIHRoZSBNYXRDaGlwIGNvbXBvbmVudC5cbiAqXG4gKiBFeHRlbmRlZCBieSBNYXRDaGlwTGlzdGJveCBhbmQgTWF0Q2hpcEdyaWQgZm9yIGRpZmZlcmVudCBpbnRlcmFjdGlvbiBwYXR0ZXJucy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNoaXAtc2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwibWRjLWV2b2x1dGlvbi1jaGlwLXNldF9fY2hpcHNcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWydjaGlwLXNldC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWNoaXAtc2V0IG1kYy1ldm9sdXRpb24tY2hpcC1zZXQnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcFNldFxuICBleHRlbmRzIF9NYXRDaGlwU2V0TWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgSGFzVGFiSW5kZXgsIE9uRGVzdHJveVxue1xuICAvKiogSW5kZXggb2YgdGhlIGxhc3QgZGVzdHJveWVkIGNoaXAgdGhhdCBoYWQgZm9jdXMuICovXG4gIHByaXZhdGUgX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4OiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgd2l0aGluIHRoZSBjaGlwIGxpc3QuICovXG4gIHByb3RlY3RlZCBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdENoaXBBY3Rpb24+O1xuXG4gIC8qKiBTdWJqZWN0IHRoYXQgZW1pdHMgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBSb2xlIHRvIHVzZSBpZiBpdCBoYXNuJ3QgYmVlbiBvdmVyd3JpdHRlbiBieSB0aGUgdXNlci4gKi9cbiAgcHJvdGVjdGVkIF9kZWZhdWx0Um9sZSA9ICdwcmVzZW50YXRpb24nO1xuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBjaGlwcycgZm9jdXMgZXZlbnRzLiAqL1xuICBnZXQgY2hpcEZvY3VzQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRDaGlwU3RyZWFtKGNoaXAgPT4gY2hpcC5fb25Gb2N1cyk7XG4gIH1cblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgY2hpcHMnIHJlbW92ZSBldmVudHMuICovXG4gIGdldCBjaGlwRGVzdHJveWVkQ2hhbmdlcygpOiBPYnNlcnZhYmxlPE1hdENoaXBFdmVudD4ge1xuICAgIHJldHVybiB0aGlzLl9nZXRDaGlwU3RyZWFtKGNoaXAgPT4gY2hpcC5kZXN0cm95ZWQpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNoaXAgc2V0IGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNDaGlwc1N0YXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjaGlwIGxpc3QgY29udGFpbnMgY2hpcHMgb3Igbm90LiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoaXBzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKiBUaGUgQVJJQSByb2xlIGFwcGxpZWQgdG8gdGhlIGNoaXAgc2V0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm9sZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5fZXhwbGljaXRSb2xlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXhwbGljaXRSb2xlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmVtcHR5ID8gbnVsbCA6IHRoaXMuX2RlZmF1bHRSb2xlO1xuICB9XG5cbiAgc2V0IHJvbGUodmFsdWU6IHN0cmluZyB8IG51bGwpIHtcbiAgICB0aGlzLl9leHBsaWNpdFJvbGUgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9leHBsaWNpdFJvbGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIGFueSBvZiB0aGUgY2hpcHMgaW5zaWRlIG9mIHRoaXMgY2hpcC1zZXQgaGFzIGZvY3VzLiAqL1xuICBnZXQgZm9jdXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGFzRm9jdXNlZENoaXAoKTtcbiAgfVxuXG4gIC8qKiBUaGUgY2hpcHMgdGhhdCBhcmUgcGFydCBvZiB0aGlzIGNoaXAgc2V0LiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdENoaXAsIHtcbiAgICAvLyBXZSBuZWVkIHRvIHVzZSBgZGVzY2VuZGFudHM6IHRydWVgLCBiZWNhdXNlIEl2eSB3aWxsIG5vIGxvbmdlciBtYXRjaFxuICAgIC8vIGluZGlyZWN0IGRlc2NlbmRhbnRzIGlmIGl0J3MgbGVmdCBhcyBmYWxzZS5cbiAgICBkZXNjZW5kYW50czogdHJ1ZSxcbiAgfSlcbiAgX2NoaXBzOiBRdWVyeUxpc3Q8TWF0Q2hpcD47XG5cbiAgLyoqIEZsYXQgbGlzdCBvZiBhbGwgdGhlIGFjdGlvbnMgY29udGFpbmVkIHdpdGhpbiB0aGUgY2hpcHMuICovXG4gIF9jaGlwQWN0aW9ucyA9IG5ldyBRdWVyeUxpc3Q8TWF0Q2hpcEFjdGlvbj4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICkge1xuICAgIHN1cGVyKF9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zZXRVcEZvY3VzTWFuYWdlbWVudCgpO1xuICAgIHRoaXMuX3RyYWNrQ2hpcFNldENoYW5nZXMoKTtcbiAgICB0aGlzLl90cmFja0Rlc3Ryb3llZEZvY3VzZWRDaGlwKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fY2hpcEFjdGlvbnMuZGVzdHJveSgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgYW55IG9mIHRoZSBjaGlwcyBpcyBmb2N1c2VkLiAqL1xuICBwcm90ZWN0ZWQgX2hhc0ZvY3VzZWRDaGlwKCkge1xuICAgIHJldHVybiB0aGlzLl9jaGlwcyAmJiB0aGlzLl9jaGlwcy5zb21lKGNoaXAgPT4gY2hpcC5faGFzRm9jdXMoKSk7XG4gIH1cblxuICAvKiogU3luY3MgdGhlIGNoaXAtc2V0J3Mgc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBjaGlwcy4gKi9cbiAgcHJvdGVjdGVkIF9zeW5jQ2hpcHNTdGF0ZSgpIHtcbiAgICBpZiAodGhpcy5fY2hpcHMpIHtcbiAgICAgIHRoaXMuX2NoaXBzLmZvckVhY2goY2hpcCA9PiB7XG4gICAgICAgIGNoaXAuZGlzYWJsZWQgPSB0aGlzLl9kaXNhYmxlZDtcbiAgICAgICAgY2hpcC5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogRHVtbXkgbWV0aG9kIGZvciBzdWJjbGFzc2VzIHRvIG92ZXJyaWRlLiBCYXNlIGNoaXAgc2V0IGNhbm5vdCBiZSBmb2N1c2VkLiAqL1xuICBmb2N1cygpIHt9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIG9uIHRoZSBjaGlwIHNldC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5fb3JpZ2luYXRlc0Zyb21DaGlwKGV2ZW50KSkge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGVuc3VyZSBhbGwgaW5kZXhlcyBhcmUgdmFsaWQuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gYmUgY2hlY2tlZC5cbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgaW5kZXggaXMgdmFsaWQgZm9yIG91ciBsaXN0IG9mIGNoaXBzLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5fY2hpcHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGB0YWJpbmRleGAgZnJvbSB0aGUgY2hpcCBzZXQgYW5kIHJlc2V0cyBpdCBiYWNrIGFmdGVyd2FyZHMsIGFsbG93aW5nIHRoZVxuICAgKiB1c2VyIHRvIHRhYiBvdXQgb2YgaXQuIFRoaXMgcHJldmVudHMgdGhlIHNldCBmcm9tIGNhcHR1cmluZyBmb2N1cyBhbmQgcmVkaXJlY3RpbmdcbiAgICogaXQgYmFjayB0byB0aGUgZmlyc3QgY2hpcCwgY3JlYXRpbmcgYSBmb2N1cyB0cmFwLCBpZiBpdCB1c2VyIHRyaWVzIHRvIHRhYiBhd2F5LlxuICAgKi9cbiAgcHJvdGVjdGVkIF9hbGxvd0ZvY3VzRXNjYXBlKCkge1xuICAgIGlmICh0aGlzLnRhYkluZGV4ICE9PSAtMSkge1xuICAgICAgY29uc3QgcHJldmlvdXNUYWJJbmRleCA9IHRoaXMudGFiSW5kZXg7XG4gICAgICB0aGlzLnRhYkluZGV4ID0gLTE7XG5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIG5lZWRzIHRvIGJlIGEgYHNldFRpbWVvdXRgLCBiZWNhdXNlIGEgYFByb21pc2UucmVzb2x2ZWBcbiAgICAgIC8vIGRvZXNuJ3QgYWxsb3cgZW5vdWdoIHRpbWUgZm9yIHRoZSBmb2N1cyB0byBlc2NhcGUuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLnRhYkluZGV4ID0gcHJldmlvdXNUYWJJbmRleCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3RyZWFtIG9mIGV2ZW50cyBmcm9tIGFsbCB0aGUgY2hpcHMgd2l0aGluIHRoZSBzZXQuXG4gICAqIFRoZSBzdHJlYW0gd2lsbCBhdXRvbWF0aWNhbGx5IGluY29ycG9yYXRlIGFueSBuZXdseS1hZGRlZCBjaGlwcy5cbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0Q2hpcFN0cmVhbTxULCBDIGV4dGVuZHMgTWF0Q2hpcCA9IE1hdENoaXA+KFxuICAgIG1hcHBpbmdGdW5jdGlvbjogKGNoaXA6IEMpID0+IE9ic2VydmFibGU8VD4sXG4gICk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLl9jaGlwcy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4uKHRoaXMuX2NoaXBzIGFzIFF1ZXJ5TGlzdDxDPikubWFwKG1hcHBpbmdGdW5jdGlvbikpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGFuIGV2ZW50IGNvbWVzIGZyb20gaW5zaWRlIGEgY2hpcCBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgX29yaWdpbmF0ZXNGcm9tQ2hpcChldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICBsZXQgY3VycmVudEVsZW1lbnQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuXG4gICAgd2hpbGUgKGN1cnJlbnRFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIC8vIE51bGwgY2hlY2sgdGhlIGNsYXNzTGlzdCwgYmVjYXVzZSBJRSBhbmQgRWRnZSBkb24ndCBzdXBwb3J0IGl0IG9uIGFsbCBlbGVtZW50cy5cbiAgICAgIGlmIChjdXJyZW50RWxlbWVudC5jbGFzc0xpc3QgJiYgY3VycmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZGMtZXZvbHV0aW9uLWNoaXAnKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIFNldHMgdXAgdGhlIGNoaXAgc2V0J3MgZm9jdXMgbWFuYWdlbWVudCBsb2dpYy4gKi9cbiAgcHJpdmF0ZSBfc2V0VXBGb2N1c01hbmFnZW1lbnQoKSB7XG4gICAgLy8gQ3JlYXRlIGEgZmxhdCBgUXVlcnlMaXN0YCBjb250YWluaW5nIHRoZSBhY3Rpb25zIG9mIGFsbCBvZiB0aGUgY2hpcHMuXG4gICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gbmF2aWdhdGUgYm90aCB3aXRoaW4gdGhlIGNoaXAgYW5kIG1vdmUgdG8gdGhlIG5leHQvcHJldmlvdXNcbiAgICAvLyBvbmUgdXNpbmcgdGhlIGV4aXN0aW5nIGBMaXN0S2V5TWFuYWdlcmAuXG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aCh0aGlzLl9jaGlwcykpLnN1YnNjcmliZSgoY2hpcHM6IFF1ZXJ5TGlzdDxNYXRDaGlwPikgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uczogTWF0Q2hpcEFjdGlvbltdID0gW107XG4gICAgICBjaGlwcy5mb3JFYWNoKGNoaXAgPT4gY2hpcC5fZ2V0QWN0aW9ucygpLmZvckVhY2goYWN0aW9uID0+IGFjdGlvbnMucHVzaChhY3Rpb24pKSk7XG4gICAgICB0aGlzLl9jaGlwQWN0aW9ucy5yZXNldChhY3Rpb25zKTtcbiAgICAgIHRoaXMuX2NoaXBBY3Rpb25zLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBGb2N1c0tleU1hbmFnZXIodGhpcy5fY2hpcEFjdGlvbnMpXG4gICAgICAud2l0aFZlcnRpY2FsT3JpZW50YXRpb24oKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cicpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLnNraXBQcmVkaWNhdGUoYWN0aW9uID0+IHRoaXMuX3NraXBQcmVkaWNhdGUoYWN0aW9uKSk7XG5cbiAgICAvLyBLZWVwIHRoZSBtYW5hZ2VyIGFjdGl2ZSBpbmRleCBpbiBzeW5jIHNvIHRoYXQgbmF2aWdhdGlvbiBwaWNrc1xuICAgIC8vIHVwIGZyb20gdGhlIGN1cnJlbnQgY2hpcCBpZiB0aGUgdXNlciBjbGlja3MgaW50byB0aGUgbGlzdCBkaXJlY3RseS5cbiAgICB0aGlzLmNoaXBGb2N1c0NoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCh7Y2hpcH0pID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGNoaXAuX2dldFNvdXJjZUFjdGlvbihkb2N1bWVudC5hY3RpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuXG4gICAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShhY3Rpb24pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlyPy5jaGFuZ2VcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZShkaXJlY3Rpb24gPT4gdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKGRpcmVjdGlvbikpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBjaGlwIGFjdGlvbiBpbiB0aGUgdGFiIGluZGV4LiBTa2lwXG4gICAqIG5vbi1pbnRlcmFjdGl2ZSBhbmQgZGlzYWJsZWQgYWN0aW9ucyBzaW5jZSB0aGUgdXNlciBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIHRoZW0uXG4gICAqL1xuICBwcm90ZWN0ZWQgX3NraXBQcmVkaWNhdGUoYWN0aW9uOiBNYXRDaGlwQWN0aW9uKTogYm9vbGVhbiB7XG4gICAgLy8gU2tpcCBjaGlwcyB0aGF0IHRoZSB1c2VyIGNhbm5vdCBpbnRlcmFjdCB3aXRoLiBgbWF0LWNoaXAtc2V0YCBkb2VzIG5vdCBwZXJtaXQgZm9jdXNpbmcgZGlzYWJsZWRcbiAgICAvLyBjaGlwcy5cbiAgICByZXR1cm4gIWFjdGlvbi5pc0ludGVyYWN0aXZlIHx8IGFjdGlvbi5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBMaXN0ZW5zIHRvIGNoYW5nZXMgaW4gdGhlIGNoaXAgc2V0IGFuZCBzeW5jcyB1cCB0aGUgc3RhdGUgb2YgdGhlIGluZGl2aWR1YWwgY2hpcHMuICovXG4gIHByaXZhdGUgX3RyYWNrQ2hpcFNldENoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2hpcHMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAvLyBTaW5jZSB0aGlzIGhhcHBlbnMgYWZ0ZXIgdGhlIGNvbnRlbnQgaGFzIGJlZW5cbiAgICAgICAgLy8gY2hlY2tlZCwgd2UgbmVlZCB0byBkZWZlciBpdCB0byB0aGUgbmV4dCB0aWNrLlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHRoaXMuX3N5bmNDaGlwc1N0YXRlKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZWRpcmVjdERlc3Ryb3llZENoaXBGb2N1cygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFN0YXJ0cyB0cmFja2luZyB0aGUgZGVzdHJveWVkIGNoaXBzIGluIG9yZGVyIHRvIGNhcHR1cmUgdGhlIGZvY3VzZWQgb25lLiAqL1xuICBwcml2YXRlIF90cmFja0Rlc3Ryb3llZEZvY3VzZWRDaGlwKCkge1xuICAgIHRoaXMuY2hpcERlc3Ryb3llZENoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKChldmVudDogTWF0Q2hpcEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBjaGlwQXJyYXkgPSB0aGlzLl9jaGlwcy50b0FycmF5KCk7XG4gICAgICBjb25zdCBjaGlwSW5kZXggPSBjaGlwQXJyYXkuaW5kZXhPZihldmVudC5jaGlwKTtcblxuICAgICAgLy8gSWYgdGhlIGZvY3VzZWQgY2hpcCBpcyBkZXN0cm95ZWQsIHNhdmUgaXRzIGluZGV4IHNvIHRoYXQgd2UgY2FuIG1vdmUgZm9jdXMgdG8gdGhlIG5leHRcbiAgICAgIC8vIGNoaXAuIFdlIG9ubHkgc2F2ZSB0aGUgaW5kZXggaGVyZSwgcmF0aGVyIHRoYW4gbW92ZSB0aGUgZm9jdXMgaW1tZWRpYXRlbHksIGJlY2F1c2Ugd2Ugd2FudFxuICAgICAgLy8gdG8gd2FpdCB1bnRpbCB0aGUgY2hpcCBpcyByZW1vdmVkIGZyb20gdGhlIGNoaXAgbGlzdCBiZWZvcmUgZm9jdXNpbmcgdGhlIG5leHQgb25lLiBUaGlzXG4gICAgICAvLyBhbGxvd3MgdXMgdG8ga2VlcCBmb2N1cyBvbiB0aGUgc2FtZSBpbmRleCBpZiB0aGUgY2hpcCBnZXRzIHN3YXBwZWQgb3V0LlxuICAgICAgaWYgKHRoaXMuX2lzVmFsaWRJbmRleChjaGlwSW5kZXgpICYmIGV2ZW50LmNoaXAuX2hhc0ZvY3VzKCkpIHtcbiAgICAgICAgdGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXggPSBjaGlwSW5kZXg7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIG5leHQgYXBwcm9wcmlhdGUgY2hpcCB0byBtb3ZlIGZvY3VzIHRvLFxuICAgKiBpZiB0aGUgY3VycmVudGx5LWZvY3VzZWQgY2hpcCBpcyBkZXN0cm95ZWQuXG4gICAqL1xuICBwcml2YXRlIF9yZWRpcmVjdERlc3Ryb3llZENoaXBGb2N1cygpIHtcbiAgICBpZiAodGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9jaGlwcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gTWF0aC5taW4odGhpcy5fbGFzdERlc3Ryb3llZEZvY3VzZWRDaGlwSW5kZXgsIHRoaXMuX2NoaXBzLmxlbmd0aCAtIDEpO1xuICAgICAgY29uc3QgY2hpcFRvRm9jdXMgPSB0aGlzLl9jaGlwcy50b0FycmF5KClbbmV3SW5kZXhdO1xuXG4gICAgICBpZiAoY2hpcFRvRm9jdXMuZGlzYWJsZWQpIHtcbiAgICAgICAgLy8gSWYgd2UncmUgZG93biB0byBvbmUgZGlzYWJsZWQgY2hpcCwgbW92ZSBmb2N1cyBiYWNrIHRvIHRoZSBzZXQuXG4gICAgICAgIGlmICh0aGlzLl9jaGlwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRQcmV2aW91c0l0ZW1BY3RpdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpcFRvRm9jdXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cblxuICAgIHRoaXMuX2xhc3REZXN0cm95ZWRGb2N1c2VkQ2hpcEluZGV4ID0gbnVsbDtcbiAgfVxufVxuIl19