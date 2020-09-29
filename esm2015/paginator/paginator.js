/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, Directive, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
}
/** Injection token that can be used to provide the default options for the paginator module. */
export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to _MatPaginatorBase.
/** @docs-private */
class MatPaginatorMixinBase {
}
const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(MatPaginatorMixinBase));
/**
 * Base class with all of the `MatPaginator` functionality.
 * @docs-private
 */
export class _MatPaginatorBase extends _MatPaginatorMixinBase {
    constructor(_intl, _changeDetectorRef, defaults) {
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        this._hidePageSize = false;
        this._showFirstLastButtons = false;
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
        if (defaults) {
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons, } = defaults;
            if (pageSize != null) {
                this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                this._hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                this._showFirstLastButtons = showFirstLastButtons;
            }
        }
    }
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex() { return this._pageIndex; }
    set pageIndex(value) {
        this._pageIndex = Math.max(coerceNumberProperty(value), 0);
        this._changeDetectorRef.markForCheck();
    }
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() { return this._length; }
    set length(value) {
        this._length = coerceNumberProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() { return this._pageSize; }
    set pageSize(value) {
        this._pageSize = Math.max(coerceNumberProperty(value), 0);
        this._updateDisplayedPageSizeOptions();
    }
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() { return this._pageSizeOptions; }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => coerceNumberProperty(p));
        this._updateDisplayedPageSizeOptions();
    }
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize() { return this._hidePageSize; }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons() { return this._showFirstLastButtons; }
    set showFirstLastButtons(value) {
        this._showFirstLastButtons = coerceBooleanProperty(value);
    }
    ngOnInit() {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
        this._markInitialized();
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Advances to the next page if it exists. */
    nextPage() {
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex++;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move back to the previous page if it exists. */
    previousPage() {
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex--;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the first page if not already there. */
    firstPage() {
        // hasPreviousPage being false implies at the start
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = 0;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the last page if not already there. */
    lastPage() {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.getNumberOfPages() - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Whether there is a previous page. */
    hasPreviousPage() {
        return this.pageIndex >= 1 && this.pageSize != 0;
    }
    /** Whether there is a next page. */
    hasNextPage() {
        const maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    }
    /** Calculate the number of pages */
    getNumberOfPages() {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    }
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        const startIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    }
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled() {
        return this.disabled || !this.hasNextPage();
    }
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled() {
        return this.disabled || !this.hasPreviousPage();
    }
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    _updateDisplayedPageSizeOptions() {
        if (!this._initialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            this._pageSize = this.pageSizeOptions.length != 0 ?
                this.pageSizeOptions[0] :
                DEFAULT_PAGE_SIZE;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.slice();
        if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
            this._displayedPageSizeOptions.push(this.pageSize);
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort((a, b) => a - b);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    _emitPageEvent(previousPageIndex) {
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    }
}
_MatPaginatorBase.decorators = [
    { type: Directive }
];
_MatPaginatorBase.ctorParameters = () => [
    { type: MatPaginatorIntl },
    { type: ChangeDetectorRef },
    { type: undefined }
];
_MatPaginatorBase.propDecorators = {
    color: [{ type: Input }],
    pageIndex: [{ type: Input }],
    length: [{ type: Input }],
    pageSize: [{ type: Input }],
    pageSizeOptions: [{ type: Input }],
    hidePageSize: [{ type: Input }],
    showFirstLastButtons: [{ type: Input }],
    page: [{ type: Output }]
};
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export class MatPaginator extends _MatPaginatorBase {
    constructor(intl, changeDetectorRef, defaults) {
        super(intl, changeDetectorRef, defaults);
        if (defaults && defaults.formFieldAppearance != null) {
            this._formFieldAppearance = defaults.formFieldAppearance;
        }
    }
}
MatPaginator.decorators = [
    { type: Component, args: [{
                selector: 'mat-paginator',
                exportAs: 'matPaginator',
                template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n",
                inputs: ['disabled'],
                host: {
                    'class': 'mat-paginator',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}\n"]
            },] }
];
MatPaginator.ctorParameters = () => [
    { type: MatPaginatorIntl },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PAGINATOR_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixxQkFBcUIsRUFHdEIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBR0wsZ0JBQWdCLEVBRWhCLGFBQWEsR0FHZCxNQUFNLHdCQUF3QixDQUFDO0FBR2hDLGtHQUFrRztBQUNsRyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sU0FBUztDQWVyQjtBQXFCRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQ3RDLElBQUksY0FBYyxDQUE2QiwrQkFBK0IsQ0FBQyxDQUFDO0FBRXBGLHdEQUF3RDtBQUN4RCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUI7Q0FBRztBQUM5QixNQUFNLHNCQUFzQixHQUN4QixhQUFhLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0FBRTNEOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsaUJBS25CLFNBQVEsc0JBQXNCO0lBbUUvQixZQUFtQixLQUF1QixFQUN0QixrQkFBcUMsRUFDN0MsUUFBWTtRQUN0QixLQUFLLEVBQUUsQ0FBQztRQUhTLFVBQUssR0FBTCxLQUFLLENBQWtCO1FBQ3RCLHVCQUFrQixH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O2lCQUN6QjtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7WUE1VU8sZ0JBQWdCO1lBZHRCLGlCQUFpQjs0Q0FpV2QsUUFBUSxZQUFJLE1BQU0sU0FBQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgQm9vbGVhbklucHV0LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0UGFnaW5hdG9ySW50bH0gZnJvbSAnLi9wYWdpbmF0b3ItaW50bCc7XG5pbXBvcnQge1xuICBIYXNJbml0aWFsaXplZCxcbiAgSGFzSW5pdGlhbGl6ZWRDdG9yLFxuICBtaXhpbkluaXRpYWxpemVkLFxuICBUaGVtZVBhbGV0dGUsXG4gIG1peGluRGlzYWJsZWQsXG4gIENhbkRpc2FibGVDdG9yLFxuICBDYW5EaXNhYmxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQXBwZWFyYW5jZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbi8qKiBUaGUgZGVmYXVsdCBwYWdlIHNpemUgaWYgdGhlcmUgaXMgbm8gcGFnZSBzaXplIGFuZCB0aGVyZSBhcmUgbm8gcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMuICovXG5jb25zdCBERUZBVUxUX1BBR0VfU0laRSA9IDUwO1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhXG4gKiBkaWZmZXJlbnQgcGFnZSBzaXplIG9yIG5hdmlnYXRlcyB0byBhbm90aGVyIHBhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnQge1xuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBpbmRleC4gKi9cbiAgcGFnZUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBwYWdlIHRoYXQgd2FzIHNlbGVjdGVkIHByZXZpb3VzbHkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgVG8gYmUgbWFkZSBpbnRvIGEgcmVxdWlyZWQgcHJvcGVydHkuXG4gICAqL1xuICBwcmV2aW91c1BhZ2VJbmRleD86IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBzaXplICovXG4gIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHRvdGFsIG51bWJlciBvZiBpdGVtcyBiZWluZyBwYWdlZCAqL1xuICBsZW5ndGg6IG51bWJlcjtcbn1cblxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBOdW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBvbiBhIHBhZ2UuIEJ5IGRlZmF1bHQgc2V0IHRvIDUwLiAqL1xuICBwYWdlU2l6ZT86IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBwYWdlU2l6ZU9wdGlvbnM/OiBudW1iZXJbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIGhpZGVQYWdlU2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucz86IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGZvcm0tZmllbGQgYXBwZWFyYW5jZSB0byBhcHBseSB0byB0aGUgcGFnZSBzaXplIG9wdGlvbnMgc2VsZWN0b3IuICovXG4gIGZvcm1GaWVsZEFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPignTUFUX1BBR0lOQVRPUl9ERUZBVUxUX09QVElPTlMnKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBfTWF0UGFnaW5hdG9yQmFzZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRQYWdpbmF0b3JNaXhpbkJhc2Uge31cbmNvbnN0IF9NYXRQYWdpbmF0b3JNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgSGFzSW5pdGlhbGl6ZWRDdG9yICYgdHlwZW9mIE1hdFBhZ2luYXRvck1peGluQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChtaXhpbkluaXRpYWxpemVkKE1hdFBhZ2luYXRvck1peGluQmFzZSkpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRQYWdpbmF0b3JgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRQYWdpbmF0b3JCYXNlPE8gZXh0ZW5kcyB7XG4gIHBhZ2VTaXplPzogbnVtYmVyO1xuICBwYWdlU2l6ZU9wdGlvbnM/OiBudW1iZXJbXTtcbiAgaGlkZVBhZ2VTaXplPzogYm9vbGVhbjtcbiAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM/OiBib29sZWFuO1xufT4gZXh0ZW5kcyBfTWF0UGFnaW5hdG9yTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksXG4gICAgQ2FuRGlzYWJsZSwgSGFzSW5pdGlhbGl6ZWQge1xuICBwcml2YXRlIF9pbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaW50bENoYW5nZXM6IFN1YnNjcmlwdGlvbjtcblxuICAvKiogVGhlbWUgY29sb3IgdG8gYmUgdXNlZCBmb3IgdGhlIHVuZGVybHlpbmcgZm9ybSBjb250cm9scy4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogVGhlIHplcm8tYmFzZWQgcGFnZSBpbmRleCBvZiB0aGUgZGlzcGxheWVkIGxpc3Qgb2YgaXRlbXMuIERlZmF1bHRlZCB0byAwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9wYWdlSW5kZXg7IH1cbiAgc2V0IHBhZ2VJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFnZUluZGV4ID0gTWF0aC5tYXgoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpLCAwKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlSW5kZXggPSAwO1xuXG4gIC8qKiBUaGUgbGVuZ3RoIG9mIHRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMgdGhhdCBhcmUgYmVpbmcgcGFnaW5hdGVkLiBEZWZhdWx0ZWQgdG8gMC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fbGVuZ3RoOyB9XG4gIHNldCBsZW5ndGgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2xlbmd0aCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9sZW5ndGggPSAwO1xuXG4gIC8qKiBOdW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBvbiBhIHBhZ2UuIEJ5IGRlZmF1bHQgc2V0IHRvIDUwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZVNpemUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3BhZ2VTaXplOyB9XG4gIHNldCBwYWdlU2l6ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFnZVNpemUgPSBNYXRoLm1heChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSksIDApO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBzZXQgb2YgcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplT3B0aW9ucygpOiBudW1iZXJbXSB7IHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnM7IH1cbiAgc2V0IHBhZ2VTaXplT3B0aW9ucyh2YWx1ZTogbnVtYmVyW10pIHtcbiAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSAodmFsdWUgfHwgW10pLm1hcChwID0+IGNvZXJjZU51bWJlclByb3BlcnR5KHApKTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdID0gW107XG5cbiAgLyoqIFdoZXRoZXIgdG8gaGlkZSB0aGUgcGFnZSBzaXplIHNlbGVjdGlvbiBVSSBmcm9tIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVBhZ2VTaXplKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZVBhZ2VTaXplOyB9XG4gIHNldCBoaWRlUGFnZVNpemUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlUGFnZVNpemUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVQYWdlU2l6ZSA9IGZhbHNlO1xuXG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2hvd0ZpcnN0TGFzdEJ1dHRvbnMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9uczsgfVxuICBzZXQgc2hvd0ZpcnN0TGFzdEJ1dHRvbnModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBmYWxzZTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBwYWdpbmF0b3IgY2hhbmdlcyB0aGUgcGFnZSBzaXplIG9yIHBhZ2UgaW5kZXguICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBwYWdlOiBFdmVudEVtaXR0ZXI8UGFnZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8UGFnZUV2ZW50PigpO1xuXG4gIC8qKiBEaXNwbGF5ZWQgc2V0IG9mIHBhZ2Ugc2l6ZSBvcHRpb25zLiBXaWxsIGJlIHNvcnRlZCBhbmQgaW5jbHVkZSBjdXJyZW50IHBhZ2Ugc2l6ZS4gKi9cbiAgX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9uczogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9pbnRsOiBNYXRQYWdpbmF0b3JJbnRsLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIGRlZmF1bHRzPzogTykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW50bENoYW5nZXMgPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgcGFnZVNpemUsXG4gICAgICAgIHBhZ2VTaXplT3B0aW9ucyxcbiAgICAgICAgaGlkZVBhZ2VTaXplLFxuICAgICAgICBzaG93Rmlyc3RMYXN0QnV0dG9ucyxcbiAgICAgIH0gPSBkZWZhdWx0cztcblxuICAgICAgaWYgKHBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhZ2VTaXplT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9IHBhZ2VTaXplT3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgaWYgKGhpZGVQYWdlU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGhpZGVQYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3dGaXJzdExhc3RCdXR0b25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBzaG93Rmlyc3RMYXN0QnV0dG9ucztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEFkdmFuY2VzIHRvIHRoZSBuZXh0IHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBuZXh0UGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzTmV4dFBhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXgrKztcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBwcmV2aW91c1BhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleC0tO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGZpcnN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGZpcnN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNQcmV2aW91c1BhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgc3RhcnRcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBsYXN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGxhc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc05leHRQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIGVuZFxuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgcHJldmlvdXMgcGFnZS4gKi9cbiAgaGFzUHJldmlvdXNQYWdlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA+PSAxICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgbmV4dCBwYWdlLiAqL1xuICBoYXNOZXh0UGFnZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXhQYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4IDwgbWF4UGFnZUluZGV4ICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBwYWdlcyAqL1xuICBnZXROdW1iZXJPZlBhZ2VzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMubGVuZ3RoIC8gdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDaGFuZ2VzIHRoZSBwYWdlIHNpemUgc28gdGhhdCB0aGUgZmlyc3QgaXRlbSBkaXNwbGF5ZWQgb24gdGhlIHBhZ2Ugd2lsbCBzdGlsbCBiZVxuICAgKiBkaXNwbGF5ZWQgdXNpbmcgdGhlIG5ldyBwYWdlIHNpemUuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGUgcGFnZSBzaXplIGlzIDEwIGFuZCBvbiB0aGUgc2Vjb25kIHBhZ2UgKGl0ZW1zIGluZGV4ZWQgMTAtMTkpIHRoZW5cbiAgICogc3dpdGNoaW5nIHNvIHRoYXQgdGhlIHBhZ2Ugc2l6ZSBpcyA1IHdpbGwgc2V0IHRoZSB0aGlyZCBwYWdlIGFzIHRoZSBjdXJyZW50IHBhZ2Ugc29cbiAgICogdGhhdCB0aGUgMTB0aCBpdGVtIHdpbGwgc3RpbGwgYmUgZGlzcGxheWVkLlxuICAgKi9cbiAgX2NoYW5nZVBhZ2VTaXplKHBhZ2VTaXplOiBudW1iZXIpIHtcbiAgICAvLyBDdXJyZW50IHBhZ2UgbmVlZHMgdG8gYmUgdXBkYXRlZCB0byByZWZsZWN0IHRoZSBuZXcgcGFnZSBzaXplLiBOYXZpZ2F0ZSB0byB0aGUgcGFnZVxuICAgIC8vIGNvbnRhaW5pbmcgdGhlIHByZXZpb3VzIHBhZ2UncyBmaXJzdCBpdGVtLlxuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSB0aGlzLnBhZ2VJbmRleCAqIHRoaXMucGFnZVNpemU7XG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcblxuICAgIHRoaXMucGFnZUluZGV4ID0gTWF0aC5mbG9vcihzdGFydEluZGV4IC8gcGFnZVNpemUpIHx8IDA7XG4gICAgdGhpcy5wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBidXR0b25zIGZvciBnb2luZyBmb3J3YXJkcyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIF9uZXh0QnV0dG9uc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmhhc05leHRQYWdlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGJ1dHRvbnMgZm9yIGdvaW5nIGJhY2t3YXJkcyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIF9wcmV2aW91c0J1dHRvbnNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5oYXNQcmV2aW91c1BhZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsaXN0IG9mIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuIEluY2x1ZGVzIG1ha2luZyBzdXJlIHRoYXRcbiAgICogdGhlIHBhZ2Ugc2l6ZSBpcyBhbiBvcHRpb24gYW5kIHRoYXQgdGhlIGxpc3QgaXMgc29ydGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCkge1xuICAgIGlmICghdGhpcy5faW5pdGlhbGl6ZWQpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBJZiBubyBwYWdlIHNpemUgaXMgcHJvdmlkZWQsIHVzZSB0aGUgZmlyc3QgcGFnZSBzaXplIG9wdGlvbiBvciB0aGUgZGVmYXVsdCBwYWdlIHNpemUuXG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICB0aGlzLl9wYWdlU2l6ZSA9IHRoaXMucGFnZVNpemVPcHRpb25zLmxlbmd0aCAhPSAwID9cbiAgICAgICAgICB0aGlzLnBhZ2VTaXplT3B0aW9uc1swXSA6XG4gICAgICAgICAgREVGQVVMVF9QQUdFX1NJWkU7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMuc2xpY2UoKTtcblxuICAgIGlmICh0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuaW5kZXhPZih0aGlzLnBhZ2VTaXplKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5wdXNoKHRoaXMucGFnZVNpemUpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgdGhlIG51bWJlcnMgdXNpbmcgYSBudW1iZXItc3BlY2lmaWMgc29ydCBmdW5jdGlvbi5cbiAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGV2ZW50IG5vdGlmeWluZyB0aGF0IGEgY2hhbmdlIG9mIHRoZSBwYWdpbmF0b3IncyBwcm9wZXJ0aWVzIGhhcyBiZWVuIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5wYWdlLmVtaXQoe1xuICAgICAgcHJldmlvdXNQYWdlSW5kZXgsXG4gICAgICBwYWdlSW5kZXg6IHRoaXMucGFnZUluZGV4LFxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICBsZW5ndGg6IHRoaXMubGVuZ3RoXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcGFnZUluZGV4OiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2xlbmd0aDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9wYWdlU2l6ZTogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlUGFnZVNpemU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Nob3dGaXJzdExhc3RCdXR0b25zOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG5cbi8qKlxuICogQ29tcG9uZW50IHRvIHByb3ZpZGUgbmF2aWdhdGlvbiBiZXR3ZWVuIHBhZ2VkIGluZm9ybWF0aW9uLiBEaXNwbGF5cyB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudFxuICogcGFnZSwgdXNlci1zZWxlY3RhYmxlIG9wdGlvbnMgdG8gY2hhbmdlIHRoYXQgc2l6ZSwgd2hhdCBpdGVtcyBhcmUgYmVpbmcgc2hvd24sIGFuZFxuICogbmF2aWdhdGlvbmFsIGJ1dHRvbiB0byBnbyB0byB0aGUgcHJldmlvdXMgb3IgbmV4dCBwYWdlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtcGFnaW5hdG9yJyxcbiAgZXhwb3J0QXM6ICdtYXRQYWdpbmF0b3InLFxuICB0ZW1wbGF0ZVVybDogJ3BhZ2luYXRvci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3BhZ2luYXRvci5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXBhZ2luYXRvcicsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3IgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yQmFzZTxNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucz4ge1xuICAvKiogSWYgc2V0LCBzdHlsZXMgdGhlIFwicGFnZSBzaXplXCIgZm9ybSBmaWVsZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHN0eWxlLiAqL1xuICBfZm9ybUZpZWxkQXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgY29uc3RydWN0b3IoaW50bDogTWF0UGFnaW5hdG9ySW50bCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdHM/OiBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGludGwsIGNoYW5nZURldGVjdG9yUmVmLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9ybUZpZWxkQXBwZWFyYW5jZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9mb3JtRmllbGRBcHBlYXJhbmNlID0gZGVmYXVsdHMuZm9ybUZpZWxkQXBwZWFyYW5jZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==