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
_MatPaginatorBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatPaginatorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatPaginatorBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatPaginatorBase, inputs: { color: "color", pageIndex: "pageIndex", length: "length", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: "hidePageSize", showFirstLastButtons: "showFirstLastButtons" }, outputs: { page: "page" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatPaginatorBase, decorators: [{
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
MatPaginator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPaginator, deps: [{ token: i1.MatPaginatorIntl }, { token: i0.ChangeDetectorRef }, { token: MAT_PAGINATOR_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatPaginator.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatPaginator, selector: "mat-paginator", inputs: { disabled: "disabled" }, host: { attributes: { "role": "group" }, classAttribute: "mat-paginator" }, exportAs: ["matPaginator"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption\">\n            {{pageSizeOption}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}\n"], components: [{ type: i2.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i3.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i4.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i5.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }], directives: [{ type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i6.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i7.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatPaginator, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEVBR3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixhQUFhLEdBRWQsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7O0FBR2hDLGtHQUFrRztBQUNsRyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sU0FBUztDQWVyQjtBQXFCRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQ3RDLElBQUksY0FBYyxDQUE2QiwrQkFBK0IsQ0FBQyxDQUFDO0FBRXBGLHdEQUF3RDtBQUN4RCxvQkFBb0I7QUFDcEIsTUFBTSxzQkFBc0IsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUM7Q0FBUSxDQUFDLENBQUMsQ0FBQztBQUV6RTs7O0dBR0c7QUFFSCxNQUFNLE9BQWdCLGlCQUtuQixTQUFRLHNCQUFzQjtJQW1FL0IsWUFBbUIsS0FBdUIsRUFDdEIsa0JBQXFDLEVBQzdDLFFBQVk7UUFDdEIsS0FBSyxFQUFFLENBQUM7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SEFaVSxZQUFZLG1GQU1ELDZCQUE2QjtxR0FOeEMsWUFBWSxzTkN4V3pCLDZ1SEFzRkE7bUdEa1JhLFlBQVk7a0JBYnhCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGNBQWMsVUFHaEIsQ0FBQyxVQUFVLENBQUMsUUFDZDt3QkFDSixPQUFPLEVBQUUsZUFBZTt3QkFDeEIsTUFBTSxFQUFFLE9BQU87cUJBQ2hCLG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzswQkFRbEMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgQm9vbGVhbklucHV0LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0LFxuICBPcHRpb25hbCxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7TWF0UGFnaW5hdG9ySW50bH0gZnJvbSAnLi9wYWdpbmF0b3ItaW50bCc7XG5pbXBvcnQge1xuICBIYXNJbml0aWFsaXplZCxcbiAgbWl4aW5Jbml0aWFsaXplZCxcbiAgVGhlbWVQYWxldHRlLFxuICBtaXhpbkRpc2FibGVkLFxuICBDYW5EaXNhYmxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkQXBwZWFyYW5jZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbi8qKiBUaGUgZGVmYXVsdCBwYWdlIHNpemUgaWYgdGhlcmUgaXMgbm8gcGFnZSBzaXplIGFuZCB0aGVyZSBhcmUgbm8gcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMuICovXG5jb25zdCBERUZBVUxUX1BBR0VfU0laRSA9IDUwO1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBhXG4gKiBkaWZmZXJlbnQgcGFnZSBzaXplIG9yIG5hdmlnYXRlcyB0byBhbm90aGVyIHBhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWdlRXZlbnQge1xuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBpbmRleC4gKi9cbiAgcGFnZUluZGV4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBwYWdlIHRoYXQgd2FzIHNlbGVjdGVkIHByZXZpb3VzbHkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgOC4wLjAgVG8gYmUgbWFkZSBpbnRvIGEgcmVxdWlyZWQgcHJvcGVydHkuXG4gICAqL1xuICBwcmV2aW91c1BhZ2VJbmRleD86IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgcGFnZSBzaXplICovXG4gIHBhZ2VTaXplOiBudW1iZXI7XG5cbiAgLyoqIFRoZSBjdXJyZW50IHRvdGFsIG51bWJlciBvZiBpdGVtcyBiZWluZyBwYWdlZCAqL1xuICBsZW5ndGg6IG51bWJlcjtcbn1cblxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwYWdpbmF0b3IgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBOdW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBvbiBhIHBhZ2UuIEJ5IGRlZmF1bHQgc2V0IHRvIDUwLiAqL1xuICBwYWdlU2l6ZT86IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBwYWdlU2l6ZU9wdGlvbnM/OiBudW1iZXJbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIGhpZGVQYWdlU2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucz86IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGZvcm0tZmllbGQgYXBwZWFyYW5jZSB0byBhcHBseSB0byB0aGUgcGFnZSBzaXplIG9wdGlvbnMgc2VsZWN0b3IuICovXG4gIGZvcm1GaWVsZEFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPignTUFUX1BBR0lOQVRPUl9ERUZBVUxUX09QVElPTlMnKTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBfTWF0UGFnaW5hdG9yQmFzZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0UGFnaW5hdG9yTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlZChtaXhpbkluaXRpYWxpemVkKGNsYXNzIHt9KSk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFBhZ2luYXRvcmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFBhZ2luYXRvckJhc2U8TyBleHRlbmRzIHtcbiAgcGFnZVNpemU/OiBudW1iZXI7XG4gIHBhZ2VTaXplT3B0aW9ucz86IG51bWJlcltdO1xuICBoaWRlUGFnZVNpemU/OiBib29sZWFuO1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucz86IGJvb2xlYW47XG59PiBleHRlbmRzIF9NYXRQYWdpbmF0b3JNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSxcbiAgICBDYW5EaXNhYmxlLCBIYXNJbml0aWFsaXplZCB7XG4gIHByaXZhdGUgX2luaXRpYWxpemVkOiBib29sZWFuO1xuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBUaGVtZSBjb2xvciB0byBiZSB1c2VkIGZvciB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xzLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBUaGUgemVyby1iYXNlZCBwYWdlIGluZGV4IG9mIHRoZSBkaXNwbGF5ZWQgbGlzdCBvZiBpdGVtcy4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDsgfVxuICBzZXQgcGFnZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlSW5kZXggPSBNYXRoLm1heChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSksIDApO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VJbmRleCA9IDA7XG5cbiAgLyoqIFRoZSBsZW5ndGggb2YgdGhlIHRvdGFsIG51bWJlciBvZiBpdGVtcyB0aGF0IGFyZSBiZWluZyBwYWdpbmF0ZWQuIERlZmF1bHRlZCB0byAwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9sZW5ndGg7IH1cbiAgc2V0IGxlbmd0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbGVuZ3RoID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG4gIHByaXZhdGUgX2xlbmd0aCA9IDA7XG5cbiAgLyoqIE51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IG9uIGEgcGFnZS4gQnkgZGVmYXVsdCBzZXQgdG8gNTAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlU2l6ZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fcGFnZVNpemU7IH1cbiAgc2V0IHBhZ2VTaXplKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IG51bWJlcltdIHsgcmV0dXJuIHRoaXMuX3BhZ2VTaXplT3B0aW9uczsgfVxuICBzZXQgcGFnZVNpemVPcHRpb25zKHZhbHVlOiBudW1iZXJbXSkge1xuICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9ICh2YWx1ZSB8fCBbXSkubWFwKHAgPT4gY29lcmNlTnVtYmVyUHJvcGVydHkocCkpO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplT3B0aW9uczogbnVtYmVyW10gPSBbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlUGFnZVNpemUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlUGFnZVNpemU7IH1cbiAgc2V0IGhpZGVQYWdlU2l6ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVBhZ2VTaXplID0gZmFsc2U7XG5cblxuICAvKiogV2hldGhlciB0byBzaG93IHRoZSBmaXJzdC9sYXN0IGJ1dHRvbnMgVUkgdG8gdGhlIHVzZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBzaG93Rmlyc3RMYXN0QnV0dG9ucygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zOyB9XG4gIHNldCBzaG93Rmlyc3RMYXN0QnV0dG9ucyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IGZhbHNlO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBhZ2luYXRvciBjaGFuZ2VzIHRoZSBwYWdlIHNpemUgb3IgcGFnZSBpbmRleC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBhZ2U6IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+KCk7XG5cbiAgLyoqIERpc3BsYXllZCBzZXQgb2YgcGFnZSBzaXplIG9wdGlvbnMuIFdpbGwgYmUgc29ydGVkIGFuZCBpbmNsdWRlIGN1cnJlbnQgcGFnZSBzaXplLiAqL1xuICBfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zOiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2ludGw6IE1hdFBhZ2luYXRvckludGwsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgZGVmYXVsdHM/OiBPKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcyA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgY29uc3Qge1xuICAgICAgICBwYWdlU2l6ZSxcbiAgICAgICAgcGFnZVNpemVPcHRpb25zLFxuICAgICAgICBoaWRlUGFnZVNpemUsXG4gICAgICAgIHNob3dGaXJzdExhc3RCdXR0b25zLFxuICAgICAgfSA9IGRlZmF1bHRzO1xuXG4gICAgICBpZiAocGFnZVNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFnZVNpemVPcHRpb25zICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gcGFnZVNpemVPcHRpb25zO1xuICAgICAgfVxuXG4gICAgICBpZiAoaGlkZVBhZ2VTaXplICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5faGlkZVBhZ2VTaXplID0gaGlkZVBhZ2VTaXplO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHNob3dGaXJzdExhc3RCdXR0b25zO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB0aGlzLl91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKTtcbiAgICB0aGlzLl9tYXJrSW5pdGlhbGl6ZWQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ludGxDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICAvKiogQWR2YW5jZXMgdG8gdGhlIG5leHQgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIG5leHRQYWdlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCsrO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgYmFjayB0byB0aGUgcHJldmlvdXMgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIHByZXZpb3VzUGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4LS07XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogTW92ZSB0byB0aGUgZmlyc3QgcGFnZSBpZiBub3QgYWxyZWFkeSB0aGVyZS4gKi9cbiAgZmlyc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc1ByZXZpb3VzUGFnZSBiZWluZyBmYWxzZSBpbXBsaWVzIGF0IHRoZSBzdGFydFxuICAgIGlmICghdGhpcy5oYXNQcmV2aW91c1BhZ2UoKSkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG4gICAgdGhpcy5wYWdlSW5kZXggPSAwO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGxhc3QgcGFnZSBpZiBub3QgYWxyZWFkeSB0aGVyZS4gKi9cbiAgbGFzdFBhZ2UoKTogdm9pZCB7XG4gICAgLy8gaGFzTmV4dFBhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgZW5kXG4gICAgaWYgKCF0aGlzLmhhc05leHRQYWdlKCkpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5nZXROdW1iZXJPZlBhZ2VzKCkgLSAxO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlcmUgaXMgYSBwcmV2aW91cyBwYWdlLiAqL1xuICBoYXNQcmV2aW91c1BhZ2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4ID49IDEgJiYgdGhpcy5wYWdlU2l6ZSAhPSAwO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlcmUgaXMgYSBuZXh0IHBhZ2UuICovXG4gIGhhc05leHRQYWdlKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG1heFBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICByZXR1cm4gdGhpcy5wYWdlSW5kZXggPCBtYXhQYWdlSW5kZXggJiYgdGhpcy5wYWdlU2l6ZSAhPSAwO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHBhZ2VzICovXG4gIGdldE51bWJlck9mUGFnZXMoKTogbnVtYmVyIHtcbiAgICBpZiAoIXRoaXMucGFnZVNpemUpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5sZW5ndGggLyB0aGlzLnBhZ2VTaXplKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENoYW5nZXMgdGhlIHBhZ2Ugc2l6ZSBzbyB0aGF0IHRoZSBmaXJzdCBpdGVtIGRpc3BsYXllZCBvbiB0aGUgcGFnZSB3aWxsIHN0aWxsIGJlXG4gICAqIGRpc3BsYXllZCB1c2luZyB0aGUgbmV3IHBhZ2Ugc2l6ZS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGlmIHRoZSBwYWdlIHNpemUgaXMgMTAgYW5kIG9uIHRoZSBzZWNvbmQgcGFnZSAoaXRlbXMgaW5kZXhlZCAxMC0xOSkgdGhlblxuICAgKiBzd2l0Y2hpbmcgc28gdGhhdCB0aGUgcGFnZSBzaXplIGlzIDUgd2lsbCBzZXQgdGhlIHRoaXJkIHBhZ2UgYXMgdGhlIGN1cnJlbnQgcGFnZSBzb1xuICAgKiB0aGF0IHRoZSAxMHRoIGl0ZW0gd2lsbCBzdGlsbCBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBfY2hhbmdlUGFnZVNpemUocGFnZVNpemU6IG51bWJlcikge1xuICAgIC8vIEN1cnJlbnQgcGFnZSBuZWVkcyB0byBiZSB1cGRhdGVkIHRvIHJlZmxlY3QgdGhlIG5ldyBwYWdlIHNpemUuIE5hdmlnYXRlIHRvIHRoZSBwYWdlXG4gICAgLy8gY29udGFpbmluZyB0aGUgcHJldmlvdXMgcGFnZSdzIGZpcnN0IGl0ZW0uXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMucGFnZUluZGV4ICogdGhpcy5wYWdlU2l6ZTtcbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuXG4gICAgdGhpcy5wYWdlSW5kZXggPSBNYXRoLmZsb29yKHN0YXJ0SW5kZXggLyBwYWdlU2l6ZSkgfHwgMDtcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgdGhpcy5fZW1pdFBhZ2VFdmVudChwcmV2aW91c1BhZ2VJbmRleCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGJ1dHRvbnMgZm9yIGdvaW5nIGZvcndhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX25leHRCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzTmV4dFBhZ2UoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgYmFja3dhcmRzIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkIHx8ICF0aGlzLmhhc1ByZXZpb3VzUGFnZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxpc3Qgb2YgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gSW5jbHVkZXMgbWFraW5nIHN1cmUgdGhhdFxuICAgKiB0aGUgcGFnZSBzaXplIGlzIGFuIG9wdGlvbiBhbmQgdGhhdCB0aGUgbGlzdCBpcyBzb3J0ZWQuXG4gICAqL1xuICBwcml2YXRlIF91cGRhdGVEaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLl9pbml0aWFsaXplZCkgeyByZXR1cm47IH1cblxuICAgIC8vIElmIG5vIHBhZ2Ugc2l6ZSBpcyBwcm92aWRlZCwgdXNlIHRoZSBmaXJzdCBwYWdlIHNpemUgb3B0aW9uIG9yIHRoZSBkZWZhdWx0IHBhZ2Ugc2l6ZS5cbiAgICBpZiAoIXRoaXMucGFnZVNpemUpIHtcbiAgICAgIHRoaXMuX3BhZ2VTaXplID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMubGVuZ3RoICE9IDAgP1xuICAgICAgICAgIHRoaXMucGFnZVNpemVPcHRpb25zWzBdIDpcbiAgICAgICAgICBERUZBVUxUX1BBR0VfU0laRTtcbiAgICB9XG5cbiAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMgPSB0aGlzLnBhZ2VTaXplT3B0aW9ucy5zbGljZSgpO1xuXG4gICAgaWYgKHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5pbmRleE9mKHRoaXMucGFnZVNpemUpID09PSAtMSkge1xuICAgICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLnB1c2godGhpcy5wYWdlU2l6ZSk7XG4gICAgfVxuXG4gICAgLy8gU29ydCB0aGUgbnVtYmVycyB1c2luZyBhIG51bWJlci1zcGVjaWZpYyBzb3J0IGZ1bmN0aW9uLlxuICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgYW4gZXZlbnQgbm90aWZ5aW5nIHRoYXQgYSBjaGFuZ2Ugb2YgdGhlIHBhZ2luYXRvcidzIHByb3BlcnRpZXMgaGFzIGJlZW4gdHJpZ2dlcmVkLiAqL1xuICBwcml2YXRlIF9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4OiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2UuZW1pdCh7XG4gICAgICBwcmV2aW91c1BhZ2VJbmRleCxcbiAgICAgIHBhZ2VJbmRleDogdGhpcy5wYWdlSW5kZXgsXG4gICAgICBwYWdlU2l6ZTogdGhpcy5wYWdlU2l6ZSxcbiAgICAgIGxlbmd0aDogdGhpcy5sZW5ndGhcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9wYWdlSW5kZXg6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbGVuZ3RoOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3BhZ2VTaXplOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVQYWdlU2l6ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2hvd0ZpcnN0TGFzdEJ1dHRvbnM6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG59XG5cblxuLyoqXG4gKiBDb21wb25lbnQgdG8gcHJvdmlkZSBuYXZpZ2F0aW9uIGJldHdlZW4gcGFnZWQgaW5mb3JtYXRpb24uIERpc3BsYXlzIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50XG4gKiBwYWdlLCB1c2VyLXNlbGVjdGFibGUgb3B0aW9ucyB0byBjaGFuZ2UgdGhhdCBzaXplLCB3aGF0IGl0ZW1zIGFyZSBiZWluZyBzaG93biwgYW5kXG4gKiBuYXZpZ2F0aW9uYWwgYnV0dG9uIHRvIGdvIHRvIHRoZSBwcmV2aW91cyBvciBuZXh0IHBhZ2UuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1wYWdpbmF0b3InLFxuICBleHBvcnRBczogJ21hdFBhZ2luYXRvcicsXG4gIHRlbXBsYXRlVXJsOiAncGFnaW5hdG9yLmh0bWwnLFxuICBzdHlsZVVybHM6IFsncGFnaW5hdG9yLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtcGFnaW5hdG9yJyxcbiAgICAncm9sZSc6ICdncm91cCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRQYWdpbmF0b3IgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yQmFzZTxNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucz4ge1xuICAvKiogSWYgc2V0LCBzdHlsZXMgdGhlIFwicGFnZSBzaXplXCIgZm9ybSBmaWVsZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHN0eWxlLiAqL1xuICBfZm9ybUZpZWxkQXBwZWFyYW5jZT86IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgY29uc3RydWN0b3IoaW50bDogTWF0UGFnaW5hdG9ySW50bCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdHM/OiBNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGludGwsIGNoYW5nZURldGVjdG9yUmVmLCBkZWZhdWx0cyk7XG5cbiAgICBpZiAoZGVmYXVsdHMgJiYgZGVmYXVsdHMuZm9ybUZpZWxkQXBwZWFyYW5jZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9mb3JtRmllbGRBcHBlYXJhbmNlID0gZGVmYXVsdHMuZm9ybUZpZWxkQXBwZWFyYW5jZTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW91dGVyLWNvbnRhaW5lclwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1jb250YWluZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1wYWdlLXNpemVcIiAqbmdJZj1cIiFoaWRlUGFnZVNpemVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1sYWJlbFwiPlxuICAgICAgICB7e19pbnRsLml0ZW1zUGVyUGFnZUxhYmVsfX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8bWF0LWZvcm0tZmllbGRcbiAgICAgICAgKm5nSWY9XCJfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLmxlbmd0aCA+IDFcIlxuICAgICAgICBbYXBwZWFyYW5jZV09XCJfZm9ybUZpZWxkQXBwZWFyYW5jZSFcIlxuICAgICAgICBbY29sb3JdPVwiY29sb3JcIlxuICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplLXNlbGVjdFwiPlxuICAgICAgICA8bWF0LXNlbGVjdFxuICAgICAgICAgIFt2YWx1ZV09XCJwYWdlU2l6ZVwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICBbYXJpYS1sYWJlbF09XCJfaW50bC5pdGVtc1BlclBhZ2VMYWJlbFwiXG4gICAgICAgICAgKHNlbGVjdGlvbkNoYW5nZSk9XCJfY2hhbmdlUGFnZVNpemUoJGV2ZW50LnZhbHVlKVwiPlxuICAgICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBwYWdlU2l6ZU9wdGlvbiBvZiBfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zXCIgW3ZhbHVlXT1cInBhZ2VTaXplT3B0aW9uXCI+XG4gICAgICAgICAgICB7e3BhZ2VTaXplT3B0aW9ufX1cbiAgICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XG5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS12YWx1ZVwiXG4gICAgICAgICpuZ0lmPVwiX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5sZW5ndGggPD0gMVwiPnt7cGFnZVNpemV9fTwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcmFuZ2UtYWN0aW9uc1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcmFuZ2UtbGFiZWxcIj5cbiAgICAgICAge3tfaW50bC5nZXRSYW5nZUxhYmVsKHBhZ2VJbmRleCwgcGFnZVNpemUsIGxlbmd0aCl9fVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1maXJzdFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJmaXJzdFBhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwuZmlyc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5maXJzdFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RCdXR0b25zXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTE4LjQxIDE2LjU5TDEzLjgyIDEybDQuNTktNC41OUwxNyA2bC02IDYgNiA2ek02IDZoMnYxMkg2elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1wcmV2aW91c1wiXG4gICAgICAgICAgICAgIChjbGljayk9XCJwcmV2aW91c1BhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwucHJldmlvdXNQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5wcmV2aW91c1BhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItaWNvblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTUuNDEgNy40MUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MUwxMC44MyAxMnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbmV4dFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJuZXh0UGFnZSgpXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfaW50bC5uZXh0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBdPVwiX2ludGwubmV4dFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX25leHRCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiJ2Fib3ZlJ1wiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwIDZMOC41OSA3LjQxIDEzLjE3IDEybC00LjU4IDQuNTlMMTAgMThsNi02elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1sYXN0XCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImxhc3RQYWdlKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9pbnRsLmxhc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5sYXN0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBEaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBQb3NpdGlvbl09XCInYWJvdmUnXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIl9uZXh0QnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RCdXR0b25zXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTUuNTkgNy40MUwxMC4xOCAxMmwtNC41OSA0LjU5TDcgMThsNi02LTYtNnpNMTYgNmgydjEyaC0yelwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==