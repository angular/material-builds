/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
/** Harness for interacting with a standard Material calendar cell in tests. */
export class MatCalendarCellHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        /** Reference to the inner content element inside the cell. */
        this._content = this.locatorFor('.mat-calendar-body-cell-content');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatCalendarCellHarness`
     * that meets certain criteria.
     * @param options Options for filtering which cell instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatCalendarCellHarness, options)
            .addOption('text', options.text, (harness, text) => {
            return HarnessPredicate.stringMatches(harness.getText(), text);
        })
            .addOption('selected', options.selected, async (harness, selected) => {
            return (await harness.isSelected()) === selected;
        })
            .addOption('active', options.active, async (harness, active) => {
            return (await harness.isActive()) === active;
        })
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        })
            .addOption('today', options.today, async (harness, today) => {
            return (await harness.isToday()) === today;
        })
            .addOption('inRange', options.inRange, async (harness, inRange) => {
            return (await harness.isInRange()) === inRange;
        })
            .addOption('inComparisonRange', options.inComparisonRange, async (harness, inComparisonRange) => {
            return (await harness.isInComparisonRange()) === inComparisonRange;
        })
            .addOption('inPreviewRange', options.inPreviewRange, async (harness, inPreviewRange) => {
            return (await harness.isInPreviewRange()) === inPreviewRange;
        });
    }
    /** Gets the text of the calendar cell. */
    async getText() {
        return (await this._content()).text();
    }
    /** Gets the aria-label of the calendar cell. */
    async getAriaLabel() {
        // We're guaranteed for the `aria-label` to be defined
        // since this is a private element that we control.
        return (await this.host()).getAttribute('aria-label');
    }
    /** Whether the cell is selected. */
    async isSelected() {
        const host = await this.host();
        return (await host.getAttribute('aria-selected')) === 'true';
    }
    /** Whether the cell is disabled. */
    async isDisabled() {
        return this._hasState('disabled');
    }
    /** Whether the cell is currently activated using keyboard navigation. */
    async isActive() {
        return this._hasState('active');
    }
    /** Whether the cell represents today's date. */
    async isToday() {
        return (await this._content()).hasClass('mat-calendar-body-today');
    }
    /** Selects the calendar cell. Won't do anything if the cell is disabled. */
    async select() {
        return (await this.host()).click();
    }
    /** Hovers over the calendar cell. */
    async hover() {
        return (await this.host()).hover();
    }
    /** Moves the mouse away from the calendar cell. */
    async mouseAway() {
        return (await this.host()).mouseAway();
    }
    /** Focuses the calendar cell. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Removes focus from the calendar cell. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the cell is the start of the main range. */
    async isRangeStart() {
        return this._hasState('range-start');
    }
    /** Whether the cell is the end of the main range. */
    async isRangeEnd() {
        return this._hasState('range-end');
    }
    /** Whether the cell is part of the main range. */
    async isInRange() {
        return this._hasState('in-range');
    }
    /** Whether the cell is the start of the comparison range. */
    async isComparisonRangeStart() {
        return this._hasState('comparison-start');
    }
    /** Whether the cell is the end of the comparison range. */
    async isComparisonRangeEnd() {
        return this._hasState('comparison-end');
    }
    /** Whether the cell is inside of the comparison range. */
    async isInComparisonRange() {
        return this._hasState('in-comparison-range');
    }
    /** Whether the cell is the start of the preview range. */
    async isPreviewRangeStart() {
        return this._hasState('preview-start');
    }
    /** Whether the cell is the end of the preview range. */
    async isPreviewRangeEnd() {
        return this._hasState('preview-end');
    }
    /** Whether the cell is inside of the preview range. */
    async isInPreviewRange() {
        return this._hasState('in-preview');
    }
    /** Returns whether the cell has a particular CSS class-based state. */
    async _hasState(name) {
        return (await this.host()).hasClass(`mat-calendar-body-${name}`);
    }
}
MatCalendarCellHarness.hostSelector = '.mat-calendar-body-cell';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItY2VsbC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9jYWxlbmRhci1jZWxsLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHeEUsK0VBQStFO0FBQy9FLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFBNUQ7O1FBR0UsOERBQThEO1FBQ3RELGFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFnSnhFLENBQUM7SUE5SUM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQXNDLEVBQUU7UUFDbEQsT0FBTyxJQUFJLGdCQUFnQixDQUFDLHNCQUFzQixFQUFFLE9BQU8sQ0FBQzthQUN6RCxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakQsT0FBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQzthQUNELFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFO1lBQ25FLE9BQU8sQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQztRQUNuRCxDQUFDLENBQUM7YUFDRCxTQUFTLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3RCxPQUFPLENBQUMs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MEQ7SUFDMUQsS0FBSyxDQUFDLG1CQUFtQjtRQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELHdEQUF3RDtJQUN4RCxLQUFLLENBQUMsaUJBQWlCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsdURBQXVEO0lBQ3ZELEtBQUssQ0FBQyxnQkFBZ0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCx1RUFBdUU7SUFDL0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFZO1FBQ2xDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDOztBQWxKTSxtQ0FBWSxHQUFHLHlCQUF5QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgQ29tcG9uZW50SGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDYWxlbmRhckNlbGxIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9kYXRlcGlja2VyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgY2FsZW5kYXIgY2VsbCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRDYWxlbmRhckNlbGxIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1jYWxlbmRhci1ib2R5LWNlbGwnO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGlubmVyIGNvbnRlbnQgZWxlbWVudCBpbnNpZGUgdGhlIGNlbGwuICovXG4gIHByaXZhdGUgX2NvbnRlbnQgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtY2FsZW5kYXItYm9keS1jZWxsLWNvbnRlbnQnKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0Q2FsZW5kYXJDZWxsSGFybmVzc2BcbiAgICogdGhhdCBtZWV0cyBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggY2VsbCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBDYWxlbmRhckNlbGxIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRDYWxlbmRhckNlbGxIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdENhbGVuZGFyQ2VsbEhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LCAoaGFybmVzcywgdGV4dCkgPT4ge1xuICAgICAgICByZXR1cm4gSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KTtcbiAgICAgIH0pXG4gICAgICAuYWRkT3B0aW9uKCdzZWxlY3RlZCcsIG9wdGlvbnMuc2VsZWN0ZWQsIGFzeW5jIChoYXJuZXNzLCBzZWxlY3RlZCkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNTZWxlY3RlZCgpKSA9PT0gc2VsZWN0ZWQ7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignYWN0aXZlJywgb3B0aW9ucy5hY3RpdmUsIGFzeW5jIChoYXJuZXNzLCBhY3RpdmUpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzQWN0aXZlKCkpID09PSBhY3RpdmU7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignZGlzYWJsZWQnLCBvcHRpb25zLmRpc2FibGVkLCBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ3RvZGF5Jywgb3B0aW9ucy50b2RheSwgYXN5bmMgKGhhcm5lc3MsIHRvZGF5KSA9PiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc1RvZGF5KCkpID09PSB0b2RheTtcbiAgICAgIH0pXG4gICAgICAuYWRkT3B0aW9uKCdpblJhbmdlJywgb3B0aW9ucy5pblJhbmdlLCBhc3luYyAoaGFybmVzcywgaW5SYW5nZSkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNJblJhbmdlKCkpID09PSBpblJhbmdlO1xuICAgICAgfSlcbiAgICAgIC5hZGRPcHRpb24oJ2luQ29tcGFyaXNvblJhbmdlJywgb3B0aW9ucy5pbkNvbXBhcmlzb25SYW5nZSxcbiAgICAgICAgICBhc3luYyAoaGFybmVzcywgaW5Db21wYXJpc29uUmFuZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoYXdhaXQgaGFybmVzcy5pc0luQ29tcGFyaXNvblJhbmdlKCkpID09PSBpbkNvbXBhcmlzb25SYW5nZTtcbiAgICAgICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignaW5QcmV2aWV3UmFuZ2UnLCBvcHRpb25zLmluUHJldmlld1JhbmdlLCBhc3luYyAoaGFybmVzcywgaW5QcmV2aWV3UmFuZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzSW5QcmV2aWV3UmFuZ2UoKSkgPT09IGluUHJldmlld1JhbmdlO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBvZiB0aGUgY2FsZW5kYXIgY2VsbC4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY29udGVudCgpKS50ZXh0KCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbCBvZiB0aGUgY2FsZW5kYXIgY2VsbC4gKi9cbiAgYXN5bmMgZ2V0QXJpYUxhYmVsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgLy8gV2UncmUgZ3VhcmFudGVlZCBmb3IgdGhlIGBhcmlhLWxhYmVsYCB0byBiZSBkZWZpbmVkXG4gICAgLy8gc2luY2UgdGhpcyBpcyBhIHByaXZhdGUgZWxlbWVudCB0aGF0IHdlIGNvbnRyb2wuXG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykgYXMgUHJvbWlzZTxzdHJpbmc+O1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNlbGwgaXMgc2VsZWN0ZWQuICovXG4gIGFzeW5jIGlzU2VsZWN0ZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5nZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnKSkgPT09ICd0cnVlJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIGN1cnJlbnRseSBhY3RpdmF0ZWQgdXNpbmcga2V5Ym9hcmQgbmF2aWdhdGlvbi4gKi9cbiAgYXN5bmMgaXNBY3RpdmUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdhY3RpdmUnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIHJlcHJlc2VudHMgdG9kYXkncyBkYXRlLiAqL1xuICBhc3luYyBpc1RvZGF5KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fY29udGVudCgpKS5oYXNDbGFzcygnbWF0LWNhbGVuZGFyLWJvZHktdG9kYXknKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBjYWxlbmRhciBjZWxsLiBXb24ndCBkbyBhbnl0aGluZyBpZiB0aGUgY2VsbCBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgc2VsZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogSG92ZXJzIG92ZXIgdGhlIGNhbGVuZGFyIGNlbGwuICovXG4gIGFzeW5jIGhvdmVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmhvdmVyKCk7XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIG1vdXNlIGF3YXkgZnJvbSB0aGUgY2FsZW5kYXIgY2VsbC4gKi9cbiAgYXN5bmMgbW91c2VBd2F5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLm1vdXNlQXdheSgpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIGNhbGVuZGFyIGNlbGwuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBmb2N1cyBmcm9tIHRoZSBjYWxlbmRhciBjZWxsLiAqL1xuICBhc3luYyBibHVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmJsdXIoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIHRoZSBzdGFydCBvZiB0aGUgbWFpbiByYW5nZS4gKi9cbiAgYXN5bmMgaXNSYW5nZVN0YXJ0KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNTdGF0ZSgncmFuZ2Utc3RhcnQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIHRoZSBlbmQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIGFzeW5jIGlzUmFuZ2VFbmQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdyYW5nZS1lbmQnKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjZWxsIGlzIHBhcnQgb2YgdGhlIG1haW4gcmFuZ2UuICovXG4gIGFzeW5jIGlzSW5SYW5nZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5faGFzU3RhdGUoJ2luLXJhbmdlJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgc3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGFzeW5jIGlzQ29tcGFyaXNvblJhbmdlU3RhcnQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdjb21wYXJpc29uLXN0YXJ0Jyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgZW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBhc3luYyBpc0NvbXBhcmlzb25SYW5nZUVuZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5faGFzU3RhdGUoJ2NvbXBhcmlzb24tZW5kJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBpbnNpZGUgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGFzeW5jIGlzSW5Db21wYXJpc29uUmFuZ2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdpbi1jb21wYXJpc29uLXJhbmdlJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgc3RhcnQgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIGFzeW5jIGlzUHJldmlld1JhbmdlU3RhcnQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdwcmV2aWV3LXN0YXJ0Jyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyB0aGUgZW5kIG9mIHRoZSBwcmV2aWV3IHJhbmdlLiAqL1xuICBhc3luYyBpc1ByZXZpZXdSYW5nZUVuZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5faGFzU3RhdGUoJ3ByZXZpZXctZW5kJyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgY2VsbCBpcyBpbnNpZGUgb2YgdGhlIHByZXZpZXcgcmFuZ2UuICovXG4gIGFzeW5jIGlzSW5QcmV2aWV3UmFuZ2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2hhc1N0YXRlKCdpbi1wcmV2aWV3Jyk7XG4gIH1cblxuICAvKiogUmV0dXJucyB3aGV0aGVyIHRoZSBjZWxsIGhhcyBhIHBhcnRpY3VsYXIgQ1NTIGNsYXNzLWJhc2VkIHN0YXRlLiAqL1xuICBwcml2YXRlIGFzeW5jIF9oYXNTdGF0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcyhgbWF0LWNhbGVuZGFyLWJvZHktJHtuYW1lfWApO1xuICB9XG59XG4iXX0=