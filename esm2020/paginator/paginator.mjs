/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty, coerceBooleanProperty, } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, Directive, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "./paginator-intl";
import * as i2 from "@angular/material/form-field";
import * as i3 from "@angular/material/select";
import * as i4 from "@angular/material/core";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/common";
import * as i7 from "@angular/material/tooltip";
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
const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(class {
}));
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
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;
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
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = Math.max(coerceNumberProperty(value), 0);
        this._changeDetectorRef.markForCheck();
    }
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = coerceNumberProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = Math.max(coerceNumberProperty(value), 0);
        this._updateDisplayedPageSizeOptions();
    }
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => coerceNumberProperty(p));
        this._updateDisplayedPageSizeOptions();
    }
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize() {
        return this._hidePageSize;
    }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons() {
        return this._showFirstLastButtons;
    }
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
            this._pageSize =
                this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
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
            length: this.length,
        });
    }
}
_MatPaginatorBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatPaginatorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatPaginatorBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: _MatPaginatorBase, inputs: { color: "color", pageIndex: "pageIndex", length: "length", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: "hidePageSize", showFirstLastButtons: "showFirstLastButtons" }, outputs: { page: "page" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatPaginatorBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined }]; }, propDecorators: { color: [{
                type: Input
            }], pageIndex: [{
                type: Input
            }], length: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input
            }], showFirstLastButtons: [{
                type: Input
            }], page: [{
                type: Output
            }] } });
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
MatPaginator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatPaginator, deps: [{ token: i1.MatPaginatorIntl }, { token: i0.ChangeDetectorRef }, { token: MAT_PAGINATOR_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatPaginator.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatPaginator, selector: "mat-paginator", inputs: { disabled: "disabled" }, host: { attributes: { "role": "group" }, classAttribute: "mat-paginator" }, exportAs: ["matPaginator"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}\n"], components: [{ type: i2.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i3.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i4.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i5.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i7.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatPaginator, decorators: [{
            type: Component,
            args: [{ selector: 'mat-paginator', exportAs: 'matPaginator', inputs: ['disabled'], host: {
                        'class': 'mat-paginator',
                        'role': 'group',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_PAGINATOR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEdBR3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixhQUFhLEdBRWQsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7O0FBR2hDLGtHQUFrRztBQUNsRyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sU0FBUztDQWVyQjtBQW9CRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQzdELCtCQUErQixDQUNoQyxDQUFDO0FBRUYsd0RBQXdEO0FBQ3hELG9CQUFvQjtBQUNwQixNQUFNLHNCQUFzQixHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztDQUFRLENBQUMsQ0FBQyxDQUFDO0FBRXpFOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsaUJBUXBCLFNBQVEsc0JBQXNCO0lBK0U5QixZQUNTLEtBQXVCLEVBQ3RCLGtCQUFxQyxFQUM3QyxRQUFZO1FBRVosS0FBSyxFQUFFLENBQUM7UUFK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VSxZQUFZLG1GQU9ELDZCQUE2Qjs2RkFQeEMsWUFBWSxzTkMzWHpCLDZ1SEFzRkE7MkZEcVNhLFlBQVk7a0JBYnhCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGNBQWMsVUFHaEIsQ0FBQyxVQUFVLENBQUMsUUFDZDt3QkFDSixPQUFPLEVBQUUsZUFBZTt3QkFDeEIsTUFBTSxFQUFFLE9BQU87cUJBQ2hCLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzswQkFTbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgQm9vbGVhbklucHV0LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIERpcmVjdGl2ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFBhZ2luYXRvckludGx9IGZyb20gJy4vcGFnaW5hdG9yLWludGwnO1xuaW1wb3J0IHtcbiAgSGFzSW5pdGlhbGl6ZWQsXG4gIG1peGluSW5pdGlhbGl6ZWQsXG4gIFRoZW1lUGFsZXR0ZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgQ2FuRGlzYWJsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdEZvcm1GaWVsZEFwcGVhcmFuY2V9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuXG4vKiogVGhlIGRlZmF1bHQgcGFnZSBzaXplIGlmIHRoZXJlIGlzIG5vIHBhZ2Ugc2l6ZSBhbmQgdGhlcmUgYXJlIG5vIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zLiAqL1xuY29uc3QgREVGQVVMVF9QQUdFX1NJWkUgPSA1MDtcblxuLyoqXG4gKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYVxuICogZGlmZmVyZW50IHBhZ2Ugc2l6ZSBvciBuYXZpZ2F0ZXMgdG8gYW5vdGhlciBwYWdlLlxuICovXG5leHBvcnQgY2xhc3MgUGFnZUV2ZW50IHtcbiAgLyoqIFRoZSBjdXJyZW50IHBhZ2UgaW5kZXguICovXG4gIHBhZ2VJbmRleDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJbmRleCBvZiB0aGUgcGFnZSB0aGF0IHdhcyBzZWxlY3RlZCBwcmV2aW91c2x5LlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDguMC4wIFRvIGJlIG1hZGUgaW50byBhIHJlcXVpcmVkIHByb3BlcnR5LlxuICAgKi9cbiAgcHJldmlvdXNQYWdlSW5kZXg/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHBhZ2Ugc2l6ZSAqL1xuICBwYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKiBUaGUgY3VycmVudCB0b3RhbCBudW1iZXIgb2YgaXRlbXMgYmVpbmcgcGFnZWQgKi9cbiAgbGVuZ3RoOiBudW1iZXI7XG59XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHBhZ2luYXRvciBtb2R1bGUuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zIHtcbiAgLyoqIE51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IG9uIGEgcGFnZS4gQnkgZGVmYXVsdCBzZXQgdG8gNTAuICovXG4gIHBhZ2VTaXplPzogbnVtYmVyO1xuXG4gIC8qKiBUaGUgc2V0IG9mIHByb3ZpZGVkIHBhZ2Ugc2l6ZSBvcHRpb25zIHRvIGRpc3BsYXkgdG8gdGhlIHVzZXIuICovXG4gIHBhZ2VTaXplT3B0aW9ucz86IG51bWJlcltdO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci4gKi9cbiAgaGlkZVBhZ2VTaXplPzogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIHNob3dGaXJzdExhc3RCdXR0b25zPzogYm9vbGVhbjtcblxuICAvKiogVGhlIGRlZmF1bHQgZm9ybS1maWVsZCBhcHBlYXJhbmNlIHRvIGFwcGx5IHRvIHRoZSBwYWdlIHNpemUgb3B0aW9ucyBzZWxlY3Rvci4gKi9cbiAgZm9ybUZpZWxkQXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPihcbiAgJ01BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TJyxcbik7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gX01hdFBhZ2luYXRvckJhc2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdFBhZ2luYXRvck1peGluQmFzZSA9IG1peGluRGlzYWJsZWQobWl4aW5Jbml0aWFsaXplZChjbGFzcyB7fSkpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRQYWdpbmF0b3JgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRQYWdpbmF0b3JCYXNlPFxuICAgIE8gZXh0ZW5kcyB7XG4gICAgICBwYWdlU2l6ZT86IG51bWJlcjtcbiAgICAgIHBhZ2VTaXplT3B0aW9ucz86IG51bWJlcltdO1xuICAgICAgaGlkZVBhZ2VTaXplPzogYm9vbGVhbjtcbiAgICAgIHNob3dGaXJzdExhc3RCdXR0b25zPzogYm9vbGVhbjtcbiAgICB9LFxuICA+XG4gIGV4dGVuZHMgX01hdFBhZ2luYXRvck1peGluQmFzZVxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZFxue1xuICBwcml2YXRlIF9pbml0aWFsaXplZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaW50bENoYW5nZXM6IFN1YnNjcmlwdGlvbjtcblxuICAvKiogVGhlbWUgY29sb3IgdG8gYmUgdXNlZCBmb3IgdGhlIHVuZGVybHlpbmcgZm9ybSBjb250cm9scy4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogVGhlIHplcm8tYmFzZWQgcGFnZSBpbmRleCBvZiB0aGUgZGlzcGxheWVkIGxpc3Qgb2YgaXRlbXMuIERlZmF1bHRlZCB0byAwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZUluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDtcbiAgfVxuICBzZXQgcGFnZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlSW5kZXggPSBNYXRoLm1heChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSksIDApO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VJbmRleCA9IDA7XG5cbiAgLyoqIFRoZSBsZW5ndGggb2YgdGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyB0aGF0IGFyZSBiZWluZyBwYWdpbmF0ZWQuIERlZmF1bHRlZCB0byAwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgfVxuICBzZXQgbGVuZ3RoKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9sZW5ndGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcblxuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xuICB9XG4gIHNldCBwYWdlU2l6ZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFnZVNpemUgPSBNYXRoLm1heChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSksIDApO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBzZXQgb2YgcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplT3B0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplT3B0aW9ucztcbiAgfVxuICBzZXQgcGFnZVNpemVPcHRpb25zKHZhbHVlOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9ICh2YWx1ZSB8fCBbXSkubWFwKHAgPT4gY29lcmNlTnVtYmVyUHJvcGVydHkocCkpO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplT3B0aW9uczogbnVtYmVyW10gPSBbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUGFnZVNpemUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVQYWdlU2l6ZTtcbiAgfVxuICBzZXQgaGlkZVBhZ2VTaXplKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVBhZ2VTaXplID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlUGFnZVNpemUgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93Rmlyc3RMYXN0QnV0dG9ucygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7XG4gIH1cbiAgc2V0IHNob3dGaXJzdExhc3RCdXR0b25zKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Nob3dGaXJzdExhc3RCdXR0b25zID0gZmFsc2U7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgcGFnaW5hdG9yIGNoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBvciBwYWdlIGluZGV4LiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcGFnZTogRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPFBhZ2VFdmVudD4oKTtcblxuICAvKiogRGlzcGxheWVkIHNldCBvZiBwYWdlIHNpemUgb3B0aW9ucy4gV2lsbCBiZSBzb3J0ZWQgYW5kIGluY2x1ZGUgY3VycmVudCBwYWdlIHNpemUuICovXG4gIF9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnM6IG51bWJlcltdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfaW50bDogTWF0UGFnaW5hdG9ySW50bCxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgZGVmYXVsdHM/OiBPLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzID0gX2ludGwuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCkpO1xuXG4gICAgaWYgKGRlZmF1bHRzKSB7XG4gICAgICBjb25zdCB7cGFnZVNpemUsIHBhZ2VTaXplT3B0aW9ucywgaGlkZVBhZ2VTaXplLCBzaG93Rmlyc3RMYXN0QnV0dG9uc30gPSBkZWZhdWx0cztcblxuICAgICAgaWYgKHBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhZ2VTaXplT3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9IHBhZ2VTaXplT3B0aW9ucztcbiAgICAgIH1cblxuICAgICAgaWYgKGhpZGVQYWdlU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGhpZGVQYWdlU2l6ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3dGaXJzdExhc3RCdXR0b25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBzaG93Rmlyc3RMYXN0QnV0dG9ucztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gICAgdGhpcy5fbWFya0luaXRpYWxpemVkKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqIEFkdmFuY2VzIHRvIHRoZSBuZXh0IHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBuZXh0UGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzTmV4dFBhZ2UoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXgrKztcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIGJhY2sgdG8gdGhlIHByZXZpb3VzIHBhZ2UgaWYgaXQgZXhpc3RzLiAqL1xuICBwcmV2aW91c1BhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleC0tO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGZpcnN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGZpcnN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNQcmV2aW91c1BhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgc3RhcnRcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBsYXN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGxhc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc05leHRQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIGVuZFxuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgcHJldmlvdXMgcGFnZS4gKi9cbiAgaGFzUHJldmlvdXNQYWdlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA+PSAxICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgbmV4dCBwYWdlLiAqL1xuICBoYXNOZXh0UGFnZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXhQYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4IDwgbWF4UGFnZUluZGV4ICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBwYWdlcyAqL1xuICBnZXROdW1iZXJPZlBhZ2VzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMubGVuZ3RoIC8gdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgcGFnZSBzaXplIHNvIHRoYXQgdGhlIGZpcnN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBwYWdlIHdpbGwgc3RpbGwgYmVcbiAgICogZGlzcGxheWVkIHVzaW5nIHRoZSBuZXcgcGFnZSBzaXplLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIHBhZ2Ugc2l6ZSBpcyAxMCBhbmQgb24gdGhlIHNlY29uZCBwYWdlIChpdGVtcyBpbmRleGVkIDEwLTE5KSB0aGVuXG4gICAqIHN3aXRjaGluZyBzbyB0aGF0IHRoZSBwYWdlIHNpemUgaXMgNSB3aWxsIHNldCB0aGUgdGhpcmQgcGFnZSBhcyB0aGUgY3VycmVudCBwYWdlIHNvXG4gICAqIHRoYXQgdGhlIDEwdGggaXRlbSB3aWxsIHN0aWxsIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIF9jaGFuZ2VQYWdlU2l6ZShwYWdlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy8gQ3VycmVudCBwYWdlIG5lZWRzIHRvIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgbmV3IHBhZ2Ugc2l6ZS4gTmF2aWdhdGUgdG8gdGhlIHBhZ2VcbiAgICAvLyBjb250YWluaW5nIHRoZSBwcmV2aW91cyBwYWdlJ3MgZmlyc3QgaXRlbS5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5wYWdlSW5kZXggKiB0aGlzLnBhZ2VTaXplO1xuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG5cbiAgICB0aGlzLnBhZ2VJbmRleCA9IE1hdGguZmxvb3Ioc3RhcnRJbmRleCAvIHBhZ2VTaXplKSB8fCAwO1xuICAgIHRoaXMucGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgZm9yd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5oYXNOZXh0UGFnZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBidXR0b25zIGZvciBnb2luZyBiYWNrd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzUHJldmlvdXNQYWdlKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGlzdCBvZiBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiBJbmNsdWRlcyBtYWtpbmcgc3VyZSB0aGF0XG4gICAqIHRoZSBwYWdlIHNpemUgaXMgYW4gb3B0aW9uIGFuZCB0aGF0IHRoZSBsaXN0IGlzIHNvcnRlZC5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gcGFnZSBzaXplIGlzIHByb3ZpZGVkLCB1c2UgdGhlIGZpcnN0IHBhZ2Ugc2l6ZSBvcHRpb24gb3IgdGhlIGRlZmF1bHQgcGFnZSBzaXplLlxuICAgIGlmICghdGhpcy5wYWdlU2l6ZSkge1xuICAgICAgdGhpcy5fcGFnZVNpemUgPVxuICAgICAgICB0aGlzLnBhZ2VTaXplT3B0aW9ucy5sZW5ndGggIT0gMCA/IHRoaXMucGFnZVNpemVPcHRpb25zWzBdIDogREVGQVVMVF9QQUdFX1NJWkU7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMuc2xpY2UoKTtcblxuICAgIGlmICh0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuaW5kZXhPZih0aGlzLnBhZ2VTaXplKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5wdXNoKHRoaXMucGFnZVNpemUpO1xuICAgIH1cblxuICAgIC8vIFNvcnQgdGhlIG51bWJlcnMgdXNpbmcgYSBudW1iZXItc3BlY2lmaWMgc29ydCBmdW5jdGlvbi5cbiAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGFuIGV2ZW50IG5vdGlmeWluZyB0aGF0IGEgY2hhbmdlIG9mIHRoZSBwYWdpbmF0b3IncyBwcm9wZXJ0aWVzIGhhcyBiZWVuIHRyaWdnZXJlZC4gKi9cbiAgcHJpdmF0ZSBfZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5wYWdlLmVtaXQoe1xuICAgICAgcHJldmlvdXNQYWdlSW5kZXgsXG4gICAgICBwYWdlSW5kZXg6IHRoaXMucGFnZUluZGV4LFxuICAgICAgcGFnZVNpemU6IHRoaXMucGFnZVNpemUsXG4gICAgICBsZW5ndGg6IHRoaXMubGVuZ3RoLFxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3BhZ2VJbmRleDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9sZW5ndGg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcGFnZVNpemU6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVBhZ2VTaXplOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zaG93Rmlyc3RMYXN0QnV0dG9uczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBDb21wb25lbnQgdG8gcHJvdmlkZSBuYXZpZ2F0aW9uIGJldHdlZW4gcGFnZWQgaW5mb3JtYXRpb24uIERpc3BsYXlzIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50XG4gKiBwYWdlLCB1c2VyLXNlbGVjdGFibGUgb3B0aW9ucyB0byBjaGFuZ2UgdGhhdCBzaXplLCB3aGF0IGl0ZW1zIGFyZSBiZWluZyBzaG93biwgYW5kXG4gKiBuYXZpZ2F0aW9uYWwgYnV0dG9uIHRvIGdvIHRvIHRoZSBwcmV2aW91cyBvciBuZXh0IHBhZ2UuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wYWdpbmF0b3InLFxuICBleHBvcnRBczogJ21hdFBhZ2luYXRvcicsXG4gIHRlbXBsYXRlVXJsOiAncGFnaW5hdG9yLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncGFnaW5hdG9yLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcGFnaW5hdG9yJyxcbiAgICAncm9sZSc6ICdncm91cCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3IgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yQmFzZTxNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucz4ge1xuICAvKiogSWYgc2V0LCBzdHlsZXMgdGhlIFwicGFnZSBzaXplXCIgZm9ybSBmaWVsZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHN0eWxlLiAqL1xuICBfZm9ybUZpZWxkQXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW50bDogTWF0UGFnaW5hdG9ySW50bCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdHM/OiBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIoaW50bCwgY2hhbmdlRGV0ZWN0b3JSZWYsIGRlZmF1bHRzKTtcblxuICAgIGlmIChkZWZhdWx0cyAmJiBkZWZhdWx0cy5mb3JtRmllbGRBcHBlYXJhbmNlICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZEFwcGVhcmFuY2UgPSBkZWZhdWx0cy5mb3JtRmllbGRBcHBlYXJhbmNlO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3Itb3V0ZXItY29udGFpbmVyXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWNvbnRhaW5lclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZVwiICpuZ0lmPVwiIWhpZGVQYWdlU2l6ZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplLWxhYmVsXCI+XG4gICAgICAgIHt7X2ludGwuaXRlbXNQZXJQYWdlTGFiZWx9fVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxtYXQtZm9ybS1maWVsZFxuICAgICAgICAqbmdJZj1cIl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMubGVuZ3RoID4gMVwiXG4gICAgICAgIFthcHBlYXJhbmNlXT1cIl9mb3JtRmllbGRBcHBlYXJhbmNlIVwiXG4gICAgICAgIFtjb2xvcl09XCJjb2xvclwiXG4gICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1wYWdlLXNpemUtc2VsZWN0XCI+XG4gICAgICAgIDxtYXQtc2VsZWN0XG4gICAgICAgICAgW3ZhbHVlXT1cInBhZ2VTaXplXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgIFthcmlhLWxhYmVsXT1cIl9pbnRsLml0ZW1zUGVyUGFnZUxhYmVsXCJcbiAgICAgICAgICAoc2VsZWN0aW9uQ2hhbmdlKT1cIl9jaGFuZ2VQYWdlU2l6ZSgkZXZlbnQudmFsdWUpXCI+XG4gICAgICAgICAgPG1hdC1vcHRpb24gKm5nRm9yPVwibGV0IHBhZ2VTaXplT3B0aW9uIG9mIF9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnNcIiBbdmFsdWVdPVwicGFnZVNpemVPcHRpb25cIj5cbiAgICAgICAgICAgIHt7cGFnZVNpemVPcHRpb259fVxuICAgICAgICAgIDwvbWF0LW9wdGlvbj5cbiAgICAgICAgPC9tYXQtc2VsZWN0PlxuICAgICAgPC9tYXQtZm9ybS1maWVsZD5cblxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplLXZhbHVlXCJcbiAgICAgICAgKm5nSWY9XCJfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLmxlbmd0aCA8PSAxXCI+e3twYWdlU2l6ZX19PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1yYW5nZS1hY3Rpb25zXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1yYW5nZS1sYWJlbFwiPlxuICAgICAgICB7e19pbnRsLmdldFJhbmdlTGFiZWwocGFnZUluZGV4LCBwYWdlU2l6ZSwgbGVuZ3RoKX19XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWZpcnN0XCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImZpcnN0UGFnZSgpXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfaW50bC5maXJzdFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cIl9pbnRsLmZpcnN0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBEaXNhYmxlZF09XCJfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiJ2Fib3ZlJ1wiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgICpuZ0lmPVwic2hvd0ZpcnN0TGFzdEJ1dHRvbnNcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItaWNvblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTguNDEgMTYuNTlMMTMuODIgMTJsNC41OS00LjU5TDE3IDZsLTYgNiA2IDZ6TTYgNmgydjEySDZ6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLXByZXZpb3VzXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cInByZXZpb3VzUGFnZSgpXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfaW50bC5wcmV2aW91c1BhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cIl9pbnRsLnByZXZpb3VzUGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBEaXNhYmxlZF09XCJfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiJ2Fib3ZlJ1wiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKVwiPlxuICAgICAgICA8c3ZnIGNsYXNzPVwibWF0LXBhZ2luYXRvci1pY29uXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZvY3VzYWJsZT1cImZhbHNlXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xNS40MSA3LjQxTDE0IDZsLTYgNiA2IDYgMS40MS0xLjQxTDEwLjgzIDEyelwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1uZXh0XCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cIm5leHRQYWdlKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9pbnRsLm5leHRQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5uZXh0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBEaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBQb3NpdGlvbl09XCInYWJvdmUnXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIl9uZXh0QnV0dG9uc0Rpc2FibGVkKClcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItaWNvblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTAgNkw4LjU5IDcuNDEgMTMuMTcgMTJsLTQuNTggNC41OUwxMCAxOGw2LTZ6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBtYXQtaWNvbi1idXR0b24gdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgIGNsYXNzPVwibWF0LXBhZ2luYXRvci1uYXZpZ2F0aW9uLWxhc3RcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwibGFzdFBhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwubGFzdFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwXT1cIl9pbnRsLmxhc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcERpc2FibGVkXT1cIl9uZXh0QnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX25leHRCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgICpuZ0lmPVwic2hvd0ZpcnN0TGFzdEJ1dHRvbnNcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItaWNvblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNS41OSA3LjQxTDEwLjE4IDEybC00LjU5IDQuNTlMNyAxOGw2LTYtNi02ek0xNiA2aDJ2MTJoLTJ6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19