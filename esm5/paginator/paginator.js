/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { coerceNumberProperty, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
/** The default page size if there is no page size and there are no provided page size options. */
var DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
var PageEvent = /** @class */ (function () {
    function PageEvent() {
    }
    return PageEvent;
}());
export { PageEvent };
/** Injection token that can be used to provide the default options for the paginator module. */
export var MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to MatPaginator.
/** @docs-private */
var MatPaginatorBase = /** @class */ (function () {
    function MatPaginatorBase() {
    }
    return MatPaginatorBase;
}());
var _MatPaginatorBase = mixinDisabled(mixinInitialized(MatPaginatorBase));
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
var MatPaginator = /** @class */ (function (_super) {
    __extends(MatPaginator, _super);
    function MatPaginator(_intl, _changeDetectorRef, defaults) {
        var _this = _super.call(this) || this;
        _this._intl = _intl;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._pageIndex = 0;
        _this._length = 0;
        _this._pageSizeOptions = [];
        _this._hidePageSize = false;
        _this._showFirstLastButtons = false;
        /** Event emitted when the paginator changes the page size or page index. */
        _this.page = new EventEmitter();
        _this._intlChanges = _intl.changes.subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        if (defaults) {
            var pageSize = defaults.pageSize, pageSizeOptions = defaults.pageSizeOptions, hidePageSize = defaults.hidePageSize, showFirstLastButtons = defaults.showFirstLastButtons;
            if (pageSize != null) {
                _this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                _this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                _this._hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                _this._showFirstLastButtons = showFirstLastButtons;
            }
        }
        return _this;
    }
    Object.defineProperty(MatPaginator.prototype, "pageIndex", {
        /** The zero-based page index of the displayed list of items. Defaulted to 0. */
        get: function () { return this._pageIndex; },
        set: function (value) {
            this._pageIndex = Math.max(coerceNumberProperty(value), 0);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "length", {
        /** The length of the total number of items that are being paginated. Defaulted to 0. */
        get: function () { return this._length; },
        set: function (value) {
            this._length = coerceNumberProperty(value);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "pageSize", {
        /** Number of items to display on a page. By default set to 50. */
        get: function () { return this._pageSize; },
        set: function (value) {
            this._pageSize = Math.max(coerceNumberProperty(value), 0);
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "pageSizeOptions", {
        /** The set of provided page size options to display to the user. */
        get: function () { return this._pageSizeOptions; },
        set: function (value) {
            this._pageSizeOptions = (value || []).map(function (p) { return coerceNumberProperty(p); });
            this._updateDisplayedPageSizeOptions();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "hidePageSize", {
        /** Whether to hide the page size selection UI from the user. */
        get: function () { return this._hidePageSize; },
        set: function (value) {
            this._hidePageSize = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatPaginator.prototype, "showFirstLastButtons", {
        /** Whether to show the first/last buttons UI to the user. */
        get: function () { return this._showFirstLastButtons; },
        set: function (value) {
            this._showFirstLastButtons = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    MatPaginator.prototype.ngOnInit = function () {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
        this._markInitialized();
    };
    MatPaginator.prototype.ngOnDestroy = function () {
        this._intlChanges.unsubscribe();
    };
    /** Advances to the next page if it exists. */
    MatPaginator.prototype.nextPage = function () {
        if (!this.hasNextPage()) {
            return;
        }
        var previousPageIndex = this.pageIndex;
        this.pageIndex++;
        this._emitPageEvent(previousPageIndex);
    };
    /** Move back to the previous page if it exists. */
    MatPaginator.prototype.previousPage = function () {
        if (!this.hasPreviousPage()) {
            return;
        }
        var previousPageIndex = this.pageIndex;
        this.pageIndex--;
        this._emitPageEvent(previousPageIndex);
    };
    /** Move to the first page if not already there. */
    MatPaginator.prototype.firstPage = function () {
        // hasPreviousPage being false implies at the start
        if (!this.hasPreviousPage()) {
            return;
        }
        var previousPageIndex = this.pageIndex;
        this.pageIndex = 0;
        this._emitPageEvent(previousPageIndex);
    };
    /** Move to the last page if not already there. */
    MatPaginator.prototype.lastPage = function () {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) {
            return;
        }
        var previousPageIndex = this.pageIndex;
        this.pageIndex = this.getNumberOfPages() - 1;
        this._emitPageEvent(previousPageIndex);
    };
    /** Whether there is a previous page. */
    MatPaginator.prototype.hasPreviousPage = function () {
        return this.pageIndex >= 1 && this.pageSize != 0;
    };
    /** Whether there is a next page. */
    MatPaginator.prototype.hasNextPage = function () {
        var maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    };
    /** Calculate the number of pages */
    MatPaginator.prototype.getNumberOfPages = function () {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    };
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    MatPaginator.prototype._changePageSize = function (pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        var startIndex = this.pageIndex * this.pageSize;
        var previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    };
    /** Checks whether the buttons for going forwards should be disabled. */
    MatPaginator.prototype._nextButtonsDisabled = function () {
        return this.disabled || !this.hasNextPage();
    };
    /** Checks whether the buttons for going backwards should be disabled. */
    MatPaginator.prototype._previousButtonsDisabled = function () {
        return this.disabled || !this.hasPreviousPage();
    };
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    MatPaginator.prototype._updateDisplayedPageSizeOptions = function () {
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
        this._displayedPageSizeOptions.sort(function (a, b) { return a - b; });
        this._changeDetectorRef.markForCheck();
    };
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    MatPaginator.prototype._emitPageEvent = function (previousPageIndex) {
        this.page.emit({
            previousPageIndex: previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length
        });
    };
    MatPaginator.decorators = [
        { type: Component, args: [{
                    selector: 'mat-paginator',
                    exportAs: 'matPaginator',
                    template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n",
                    inputs: ['disabled'],
                    host: {
                        'class': 'mat-paginator',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;min-height:56px;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}\n"]
                }] }
    ];
    /** @nocollapse */
    MatPaginator.ctorParameters = function () { return [
        { type: MatPaginatorIntl },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_PAGINATOR_DEFAULT_OPTIONS,] }] }
    ]; };
    MatPaginator.propDecorators = {
        color: [{ type: Input }],
        pageIndex: [{ type: Input }],
        length: [{ type: Input }],
        pageSize: [{ type: Input }],
        pageSizeOptions: [{ type: Input }],
        hidePageSize: [{ type: Input }],
        showFirstLastButtons: [{ type: Input }],
        page: [{ type: Output }]
    };
    return MatPaginator;
}(_MatPaginatorBase));
export { MatPaginator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEVBR3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNsRCxPQUFPLEVBR0wsZ0JBQWdCLEVBRWhCLGFBQWEsR0FHZCxNQUFNLHdCQUF3QixDQUFDO0FBRWhDLGtHQUFrRztBQUNsRyxJQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSDtJQUFBO0lBZUEsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQWZELElBZUM7O0FBa0JELGdHQUFnRztBQUNoRyxNQUFNLENBQUMsSUFBTSw2QkFBNkIsR0FDdEMsSUFBSSxjQUFjLENBQTZCLCtCQUErQixDQUFDLENBQUM7QUFFcEYsbURBQW1EO0FBQ25ELG9CQUFvQjtBQUNwQjtJQUFBO0lBQXdCLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFBekIsSUFBeUI7QUFDekIsSUFBTSxpQkFBaUIsR0FDbkIsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUV0RDs7OztHQUlHO0FBQ0g7SUFZa0MsZ0NBQWlCO0lBbUVqRCxzQkFBbUIsS0FBdUIsRUFDdEIsa0JBQXFDLEVBRXpDLFFBQXFDO1FBSHJELFlBSUUsaUJB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U0wsS0FBSzsrQkFTTCxLQUFLO3VDQVNMLEtBQUs7dUJBUUwsTUFBTTs7SUE0S1QsbUJBQUM7Q0FBQSxBQXRQRCxDQVlrQyxpQkFBaUIsR0EwT2xEO1NBMU9ZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgQm9vbGVhbklucHV0LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFBhZ2luYXRvckludGx9IGZyb20gJy4vcGFnaW5hdG9yLWludGwnO1xuaW1wb3J0IHtcbiAgSGFzSW5pdGlhbGl6ZWQsXG4gIEhhc0luaXRpYWxpemVkQ3RvcixcbiAgbWl4aW5Jbml0aWFsaXplZCxcbiAgVGhlbWVQYWxldHRlLFxuICBtaXhpbkRpc2FibGVkLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgQ2FuRGlzYWJsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5cbi8qKiBUaGUgZGVmYXVsdCBwYWdlIHNpemUgaWYgdGhlcmUgaXMgbm8gcGFnZSBzaXplIGFuZCB0aGVyZSBhcmUgbm8gcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMuICovXG5jb25zdCBERUZBVUxUX1BBR0VfU0laRSA9IDUwO1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhXG4gKiBkaWZmZXJlbnQgcGFnZSBzaXplIG9yIG5hdmlnYXRlcyB0byBhbm90aGVyIHBhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnQge1xuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBpbmRleC4gKi9cbiAgcGFnZUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBwYWdlIHRoYXQgd2FzIHNlbGVjdGVkIHByZXZpb3VzbHkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgVG8gYmUgbWFkZSBpbnRvIGEgcmVxdWlyZWQgcHJvcGVydHkuXG4gICAqL1xuICBwcmV2aW91c1BhZ2VJbmRleD86IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBzaXplICovXG4gIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHRvdGFsIG51bWJlciBvZiBpdGVtcyBiZWluZyBwYWdlZCAqL1xuICBsZW5ndGg6IG51bWJlcjtcbn1cblxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBOdW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBvbiBhIHBhZ2UuIEJ5IGRlZmF1bHQgc2V0IHRvIDUwLiAqL1xuICBwYWdlU2l6ZT86IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBwYWdlU2l6ZU9wdGlvbnM/OiBudW1iZXJbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIGhpZGVQYWdlU2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucz86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnM+KCdNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFBhZ2luYXRvci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRQYWdpbmF0b3JCYXNlIHt9XG5jb25zdCBfTWF0UGFnaW5hdG9yQmFzZTogQ2FuRGlzYWJsZUN0b3IgJiBIYXNJbml0aWFsaXplZEN0b3IgJiB0eXBlb2YgTWF0UGFnaW5hdG9yQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlZChtaXhpbkluaXRpYWxpemVkKE1hdFBhZ2luYXRvckJhc2UpKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdG8gcHJvdmlkZSBuYXZpZ2F0aW9uIGJldHdlZW4gcGFnZWQgaW5mb3JtYXRpb24uIERpc3BsYXlzIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50XG4gKiBwYWdlLCB1c2VyLXNlbGVjdGFibGUgb3B0aW9ucyB0byBjaGFuZ2UgdGhhdCBzaXplLCB3aGF0IGl0ZW1zIGFyZSBiZWluZyBzaG93biwgYW5kXG4gKiBuYXZpZ2F0aW9uYWwgYnV0dG9uIHRvIGdvIHRvIHRoZSBwcmV2aW91cyBvciBuZXh0IHBhZ2UuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wYWdpbmF0b3InLFxuICBleHBvcnRBczogJ21hdFBhZ2luYXRvcicsXG4gIHRlbXBsYXRlVXJsOiAncGFnaW5hdG9yLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncGFnaW5hdG9yLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcGFnaW5hdG9yJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvciBleHRlbmRzIF9NYXRQYWdpbmF0b3JCYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsXG4gIEhhc0luaXRpYWxpemVkIHtcbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX2ludGxDaGFuZ2VzOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFRoZW1lIGNvbG9yIHRvIGJlIHVzZWQgZm9yIHRoZSB1bmRlcmx5aW5nIGZvcm0gY29udHJvbHMuICovXG4gIEBJbnB1dCgpIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqIFRoZSB6ZXJvLWJhc2VkIHBhZ2UgaW5kZXggb2YgdGhlIGRpc3BsYXllZCBsaXN0IG9mIGl0ZW1zLiBEZWZhdWx0ZWQgdG8gMC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcGFnZUluZGV4OyB9XG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VJbmRleCA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZUluZGV4ID0gMDtcblxuICAvKiogVGhlIGxlbmd0aCBvZiB0aGUgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIHRoYXQgYXJlIGJlaW5nIHBhZ2luYXRlZC4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBsZW5ndGgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xlbmd0aDsgfVxuICBzZXQgbGVuZ3RoKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9sZW5ndGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcblxuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9wYWdlU2l6ZTsgfVxuICBzZXQgcGFnZVNpemUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VTaXplID0gTWF0aC5tYXgoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpLCAwKTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgc2V0IG9mIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlU2l6ZU9wdGlvbnMoKTogbnVtYmVyW10geyByZXR1cm4gdGhpcy5fcGFnZVNpemVPcHRpb25zOyB9XG4gIHNldCBwYWdlU2l6ZU9wdGlvbnModmFsdWU6IG51bWJlcltdKSB7XG4gICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gKHZhbHVlIHx8IFtdKS5tYXAocCA9PiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShwKSk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemVPcHRpb25zOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVQYWdlU2l6ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGVQYWdlU2l6ZTsgfVxuICBzZXQgaGlkZVBhZ2VTaXplKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVBhZ2VTaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUGFnZVNpemUgPSBmYWxzZTtcblxuXG4gIC8qKiBXaGV0aGVyIHRvIHNob3cgdGhlIGZpcnN0L2xhc3QgYnV0dG9ucyBVSSB0byB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHNob3dGaXJzdExhc3RCdXR0b25zKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7IH1cbiAgc2V0IHNob3dGaXJzdExhc3RCdXR0b25zKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Nob3dGaXJzdExhc3RCdXR0b25zID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcGFnaW5hdG9yIGNoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBvciBwYWdlIGluZGV4LiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcGFnZTogRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4oKTtcblxuICAvKiogRGlzcGxheWVkIHNldCBvZiBwYWdlIHNpemUgb3B0aW9ucy4gV2lsbCBiZSBzb3J0ZWQgYW5kIGluY2x1ZGUgY3VycmVudCBwYWdlIHNpemUuICovXG4gIF9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfaW50bDogTWF0UGFnaW5hdG9ySW50bCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TKVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdHM/OiBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5faW50bENoYW5nZXMgPSBfaW50bC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKSk7XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGNvbnN0IHtwYWdlU2l6ZSwgcGFnZVNpemVPcHRpb25zLCBoaWRlUGFnZVNpemUsIHNob3dGaXJzdExhc3RCdXR0b25zfSA9IGRlZmF1bHRzO1xuXG4gICAgICBpZiAocGFnZVNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFnZVNpemVPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gcGFnZVNpemVPcHRpb25zO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGlkZVBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5faGlkZVBhZ2VTaXplID0gaGlkZVBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHNob3dGaXJzdExhc3RCdXR0b25zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgICB0aGlzLl9tYXJrSW5pdGlhbGl6ZWQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogQWR2YW5jZXMgdG8gdGhlIG5leHQgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIG5leHRQYWdlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCsrO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgYmFjayB0byB0aGUgcHJldmlvdXMgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIHByZXZpb3VzUGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4LS07XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogTW92ZSB0byB0aGUgZmlyc3QgcGFnZSBpZiBub3QgYWxyZWFkeSB0aGVyZS4gKi9cbiAgZmlyc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc1ByZXZpb3VzUGFnZSBiZWluZyBmYWxzZSBpbXBsaWVzIGF0IHRoZSBzdGFydFxuICAgIGlmICghdGhpcy5oYXNQcmV2aW91c1BhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXggPSAwO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGxhc3QgcGFnZSBpZiBub3QgYWxyZWFkeSB0aGVyZS4gKi9cbiAgbGFzdFBhZ2UoKTogdm9pZCB7XG4gICAgLy8gaGFzTmV4dFBhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgZW5kXG4gICAgaWYgKCF0aGlzLmhhc05leHRQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5nZXROdW1iZXJPZlBhZ2VzKCkgLSAxO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlcmUgaXMgYSBwcmV2aW91cyBwYWdlLiAqL1xuICBoYXNQcmV2aW91c1BhZ2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4ID49IDEgJiYgdGhpcy5wYWdlU2l6ZSAhPSAwO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlcmUgaXMgYSBuZXh0IHBhZ2UuICovXG4gIGhhc05leHRQYWdlKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1heFBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICByZXR1cm4gdGhpcy5wYWdlSW5kZXggPCBtYXhQYWdlSW5kZXggJiYgdGhpcy5wYWdlU2l6ZSAhPSAwO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHBhZ2VzICovXG4gIGdldE51bWJlck9mUGFnZXMoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMucGFnZVNpemUpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5sZW5ndGggLyB0aGlzLnBhZ2VTaXplKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBzbyB0aGF0IHRoZSBmaXJzdCBpdGVtIGRpc3BsYXllZCBvbiB0aGUgcGFnZSB3aWxsIHN0aWxsIGJlXG4gICAqIGRpc3BsYXllZCB1c2luZyB0aGUgbmV3IHBhZ2Ugc2l6ZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZSBwYWdlIHNpemUgaXMgMTAgYW5kIG9uIHRoZSBzZWNvbmQgcGFnZSAoaXRlbXMgaW5kZXhlZCAxMC0xOSkgdGhlblxuICAgKiBzd2l0Y2hpbmcgc28gdGhhdCB0aGUgcGFnZSBzaXplIGlzIDUgd2lsbCBzZXQgdGhlIHRoaXJkIHBhZ2UgYXMgdGhlIGN1cnJlbnQgcGFnZSBzb1xuICAgKiB0aGF0IHRoZSAxMHRoIGl0ZW0gd2lsbCBzdGlsbCBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBfY2hhbmdlUGFnZVNpemUocGFnZVNpemU6IG51bWJlcikge1xuICAgIC8vIEN1cnJlbnQgcGFnZSBuZWVkcyB0byBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIG5ldyBwYWdlIHNpemUuIE5hdmlnYXRlIHRvIHRoZSBwYWdlXG4gICAgLy8gY29udGFpbmluZyB0aGUgcHJldmlvdXMgcGFnZSdzIGZpcnN0IGl0ZW0uXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMucGFnZUluZGV4ICogdGhpcy5wYWdlU2l6ZTtcbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuXG4gICAgdGhpcy5wYWdlSW5kZXggPSBNYXRoLmZsb29yKHN0YXJ0SW5kZXggLyBwYWdlU2l6ZSkgfHwgMDtcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGJ1dHRvbnMgZm9yIGdvaW5nIGZvcndhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX25leHRCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzTmV4dFBhZ2UoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgYmFja3dhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxpc3Qgb2YgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gSW5jbHVkZXMgbWFraW5nIHN1cmUgdGhhdFxuICAgKiB0aGUgcGFnZSBzaXplIGlzIGFuIG9wdGlvbiBhbmQgdGhhdCB0aGUgbGlzdCBpcyBzb3J0ZWQuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkgeyByZXR1cm47IH1cblxuICAgIC8vIElmIG5vIHBhZ2Ugc2l6ZSBpcyBwcm92aWRlZCwgdXNlIHRoZSBmaXJzdCBwYWdlIHNpemUgb3B0aW9uIG9yIHRoZSBkZWZhdWx0IHBhZ2Ugc2l6ZS5cbiAgICBpZiAoIXRoaXMucGFnZVNpemUpIHtcbiAgICAgIHRoaXMuX3BhZ2VTaXplID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMubGVuZ3RoICE9IDAgP1xuICAgICAgICAgIHRoaXMucGFnZVNpemVPcHRpb25zWzBdIDpcbiAgICAgICAgICBERUZBVUxUX1BBR0VfU0laRTtcbiAgICB9XG5cbiAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMgPSB0aGlzLnBhZ2VTaXplT3B0aW9ucy5zbGljZSgpO1xuXG4gICAgaWYgKHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5pbmRleE9mKHRoaXMucGFnZVNpemUpID09PSAtMSkge1xuICAgICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLnB1c2godGhpcy5wYWdlU2l6ZSk7XG4gICAgfVxuXG4gICAgLy8gU29ydCB0aGUgbnVtYmVycyB1c2luZyBhIG51bWJlci1zcGVjaWZpYyBzb3J0IGZ1bmN0aW9uLlxuICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gZXZlbnQgbm90aWZ5aW5nIHRoYXQgYSBjaGFuZ2Ugb2YgdGhlIHBhZ2luYXRvcidzIHByb3BlcnRpZXMgaGFzIGJlZW4gdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBwcmV2aW91c1BhZ2VJbmRleCxcbiAgICAgIHBhZ2VJbmRleDogdGhpcy5wYWdlSW5kZXgsXG4gICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgIGxlbmd0aDogdGhpcy5sZW5ndGhcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9wYWdlSW5kZXg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbGVuZ3RoOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3BhZ2VTaXplOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVQYWdlU2l6ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2hvd0ZpcnN0TGFzdEJ1dHRvbnM6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=