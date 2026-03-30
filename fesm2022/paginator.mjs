import * as i0 from '@angular/core';
import { Injectable, InjectionToken, inject, ChangeDetectorRef, numberAttribute, EventEmitter, booleanAttribute, Output, Input, ViewEncapsulation, ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Subject, ReplaySubject } from 'rxjs';
import { MatFormField } from './_form-field-chunk.mjs';
import { MatSelect, MatSelectModule } from './select.mjs';
import { MatOption } from './_option-chunk.mjs';
import { MatIconButton } from './_icon-button-chunk.mjs';
import { MatTooltip } from './_tooltip-chunk.mjs';
import { MatTooltipModule } from './tooltip.mjs';
import { MatButtonModule } from './button.mjs';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './_animation-chunk.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/collections';
import '@angular/cdk/keycodes';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/forms';
import './_error-options-chunk.mjs';
import './_error-state-chunk.mjs';
import './form-field.mjs';
import '@angular/cdk/observers';
import './_option-module-chunk.mjs';
import './_ripple-module-chunk.mjs';
import './_ripple-chunk.mjs';
import '@angular/cdk/private';
import './_pseudo-checkbox-module-chunk.mjs';
import './_pseudo-checkbox-chunk.mjs';
import './_structural-styles-chunk.mjs';
import './_ripple-loader-chunk.mjs';
import '@angular/cdk/portal';

class MatPaginatorIntl {
  changes = new Subject();
  itemsPerPageLabel = 'Items per page:';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';
  firstPageLabel = 'First page';
  lastPageLabel = 'Last page';
  getRangeLabel = (page, pageSize, length) => {
    if (length == 0 || pageSize == 0) {
      return `0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} of ${length}`;
  };
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginatorIntl,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginatorIntl,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatPaginatorIntl,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});

const DEFAULT_PAGE_SIZE = 50;
class PageEvent {
  pageIndex;
  previousPageIndex;
  pageSize;
  length;
}
const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
class MatPaginator {
  _intl = inject(MatPaginatorIntl);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _formFieldAppearance;
  _pageSizeLabelId = inject(_IdGenerator).getId('mat-paginator-page-size-label-');
  _intlChanges;
  _isInitialized = false;
  _initializedStream = new ReplaySubject(1);
  color;
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(value) {
    this._pageIndex = Math.max(value || 0, 0);
    this._changeDetectorRef.markForCheck();
  }
  _pageIndex = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value || 0;
    this._changeDetectorRef.markForCheck();
  }
  _length = 0;
  get pageSize() {
    return this._pageSize;
  }
  set pageSize(value) {
    this._pageSize = Math.max(value || 0, 0);
    this._updateDisplayedPageSizeOptions();
  }
  _pageSize;
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value) {
    this._pageSizeOptions = (value || []).map(p => numberAttribute(p, 0));
    this._updateDisplayedPageSizeOptions();
  }
  _pageSizeOptions = [];
  hidePageSize = false;
  showFirstLastButtons = false;
  selectConfig = {};
  disabled = false;
  page = new EventEmitter();
  _displayedPageSizeOptions;
  initialized = this._initializedStream;
  constructor() {
    const _intl = this._intl;
    const defaults = inject(MAT_PAGINATOR_DEFAULT_OPTIONS, {
      optional: true
    });
    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
    if (defaults) {
      const {
        pageSize,
        pageSizeOptions,
        hidePageSize,
        showFirstLastButtons
      } = defaults;
      if (pageSize != null) {
        this._pageSize = pageSize;
      }
      if (pageSizeOptions != null) {
        this._pageSizeOptions = pageSizeOptions;
      }
      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }
      if (showFirstLastButtons != null) {
        this.showFirstLastButtons = showFirstLastButtons;
      }
    }
    this._formFieldAppearance = defaults?.formFieldAppearance || 'outline';
  }
  ngOnInit() {
    this._isInitialized = true;
    this._updateDisplayedPageSizeOptions();
    this._initializedStream.next();
  }
  ngOnDestroy() {
    this._initializedStream.complete();
    this._intlChanges.unsubscribe();
  }
  nextPage() {
    if (this.hasNextPage()) {
      this._navigate(this.pageIndex + 1);
    }
  }
  previousPage() {
    if (this.hasPreviousPage()) {
      this._navigate(this.pageIndex - 1);
    }
  }
  firstPage() {
    if (this.hasPreviousPage()) {
      this._navigate(0);
    }
  }
  lastPage() {
    if (this.hasNextPage()) {
      this._navigate(this.getNumberOfPages() - 1);
    }
  }
  hasPreviousPage() {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }
  hasNextPage() {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }
  getNumberOfPages() {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }
  _changePageSize(pageSize) {
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }
  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }
  _updateDisplayedPageSizeOptions() {
    if (!this._isInitialized) {
      return;
    }
    if (!this.pageSize) {
      this._pageSize = this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }
    this._displayedPageSizeOptions = this.pageSizeOptions.slice();
    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }
  _emitPageEvent(previousPageIndex) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }
  _navigate(index) {
    const previousIndex = this.pageIndex;
    if (index !== previousIndex) {
      this.pageIndex = index;
      this._emitPageEvent(previousIndex);
    }
  }
  _buttonClicked(targetIndex, isDisabled) {
    if (!isDisabled) {
      this._navigate(targetIndex);
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginator,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "22.0.0-next.5",
    type: MatPaginator,
    isStandalone: true,
    selector: "mat-paginator",
    inputs: {
      color: "color",
      pageIndex: ["pageIndex", "pageIndex", numberAttribute],
      length: ["length", "length", numberAttribute],
      pageSize: ["pageSize", "pageSize", numberAttribute],
      pageSizeOptions: "pageSizeOptions",
      hidePageSize: ["hidePageSize", "hidePageSize", booleanAttribute],
      showFirstLastButtons: ["showFirstLastButtons", "showFirstLastButtons", booleanAttribute],
      selectConfig: "selectConfig",
      disabled: ["disabled", "disabled", booleanAttribute]
    },
    outputs: {
      page: "page"
    },
    host: {
      attributes: {
        "role": "group"
      },
      classAttribute: "mat-mdc-paginator"
    },
    exportAs: ["matPaginator"],
    ngImport: i0,
    template: "<div class=\"mat-mdc-paginator-outer-container\">\n  <div class=\"mat-mdc-paginator-container\">\n    @if (!hidePageSize) {\n      <div class=\"mat-mdc-paginator-page-size\">\n        <div class=\"mat-mdc-paginator-page-size-label\" [attr.id]=\"_pageSizeLabelId\" aria-hidden=\"true\">\n          {{_intl.itemsPerPageLabel}}\n        </div>\n\n        @if (_displayedPageSizeOptions.length > 1) {\n          <mat-form-field\n            [appearance]=\"_formFieldAppearance!\"\n            [color]=\"color\"\n            class=\"mat-mdc-paginator-page-size-select\">\n            <mat-select\n              #selectRef\n              [value]=\"pageSize\"\n              [disabled]=\"disabled\"\n              [aria-labelledby]=\"_pageSizeLabelId\"\n              [panelClass]=\"selectConfig.panelClass || ''\"\n              [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n              (selectionChange)=\"_changePageSize($event.value)\"\n              hideSingleSelectionIndicator>\n              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {\n                <mat-option [value]=\"pageSizeOption\">\n                  {{pageSizeOption}}\n                </mat-option>\n              }\n            </mat-select>\n          <div class=\"mat-mdc-paginator-touch-target\" (click)=\"selectRef.open()\"></div>\n          </mat-form-field>\n        }\n\n        @if (_displayedPageSizeOptions.length <= 1) {\n          <div class=\"mat-mdc-paginator-page-size-value\">{{pageSize}}</div>\n        }\n      </div>\n    }\n\n    <div class=\"mat-mdc-paginator-range-actions\">\n      <div class=\"mat-mdc-paginator-range-label\" aria-atomic=\"true\" aria-live=\"polite\" role=\"status\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <!--\n      The buttons use `disabledInteractive` so that they can retain focus if they become disabled,\n      otherwise focus is moved to the document body. However, users should not be able to navigate\n      into these buttons, so `tabindex` is set to -1 when disabled.\n      -->\n\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-first\"\n                (click)=\"_buttonClicked(0, _previousButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.firstPageLabel\"\n                [matTooltip]=\"_intl.firstPageLabel\"\n                [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_previousButtonsDisabled()\"\n                [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n          </svg>\n        </button>\n      }\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-previous\"\n              (click)=\"_buttonClicked(pageIndex - 1, _previousButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-next\"\n              (click)=\"_buttonClicked(pageIndex + 1, _nextButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-last\"\n                (click)=\"_buttonClicked(getNumberOfPages() - 1, _nextButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.lastPageLabel\"\n                [matTooltip]=\"_intl.lastPageLabel\"\n                [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_nextButtonsDisabled()\"\n                [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n          </svg>\n        </button>\n      }\n    </div>\n  </div>\n</div>\n",
    styles: [".mat-mdc-paginator {\n  display: block;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));\n  background-color: var(--mat-paginator-container-background-color, var(--mat-sys-surface));\n  font-family: var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));\n  font-weight: var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));\n  letter-spacing: var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));\n  --mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);\n  --mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px);\n}\n.mat-mdc-paginator .mat-mdc-select-value {\n  font-size: var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size));\n}\n.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.mat-mdc-paginator .mat-mdc-select {\n  line-height: 1.5;\n}\n\n.mat-mdc-paginator-outer-container {\n  display: flex;\n}\n\n.mat-mdc-paginator-container {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 0 8px;\n  flex-wrap: wrap;\n  width: 100%;\n  min-height: var(--mat-paginator-container-size, 56px);\n}\n\n.mat-mdc-paginator-page-size {\n  display: flex;\n  align-items: baseline;\n  margin-right: 8px;\n}\n[dir=rtl] .mat-mdc-paginator-page-size {\n  margin-right: 0;\n  margin-left: 8px;\n}\n\n.mat-mdc-paginator-page-size-label {\n  margin: 0 4px;\n}\n\n.mat-mdc-paginator-page-size-select {\n  margin: 0 4px;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n}\n\n.mat-mdc-paginator-range-label {\n  margin: 0 32px 0 24px;\n}\n\n.mat-mdc-paginator-range-actions {\n  display: flex;\n  align-items: center;\n}\n\n.mat-mdc-paginator-icon {\n  display: inline-block;\n  width: 28px;\n  fill: var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {\n  fill: var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n[dir=rtl] .mat-mdc-paginator-icon {\n  transform: rotate(180deg);\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,\n  .mat-mdc-paginator-icon {\n    fill: currentColor;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {\n    outline: solid 1px;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {\n    color: GrayText;\n  }\n}\n.mat-mdc-paginator-touch-target {\n  display: var(--mat-paginator-touch-target-display, block);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n  height: var(--mat-paginator-page-size-select-touch-target-height, 48px);\n  background-color: transparent;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n}\n"],
    dependencies: [{
      kind: "component",
      type: MatFormField,
      selector: "mat-form-field",
      inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"],
      exportAs: ["matFormField"]
    }, {
      kind: "component",
      type: MatSelect,
      selector: "mat-select",
      inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth", "canSelectNullableOptions"],
      outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"],
      exportAs: ["matSelect"]
    }, {
      kind: "component",
      type: MatOption,
      selector: "mat-option",
      inputs: ["value", "id", "disabled"],
      outputs: ["onSelectionChange"],
      exportAs: ["matOption"]
    }, {
      kind: "component",
      type: MatIconButton,
      selector: "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]",
      exportAs: ["matButton", "matAnchor"]
    }, {
      kind: "directive",
      type: MatTooltip,
      selector: "[matTooltip]",
      inputs: ["matTooltipPosition", "matTooltipPositionAtOrigin", "matTooltipDisabled", "matTooltipShowDelay", "matTooltipHideDelay", "matTooltipTouchGestures", "matTooltip", "matTooltipClass"],
      exportAs: ["matTooltip"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatPaginator,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-paginator',
      exportAs: 'matPaginator',
      host: {
        'class': 'mat-mdc-paginator',
        'role': 'group'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip],
      template: "<div class=\"mat-mdc-paginator-outer-container\">\n  <div class=\"mat-mdc-paginator-container\">\n    @if (!hidePageSize) {\n      <div class=\"mat-mdc-paginator-page-size\">\n        <div class=\"mat-mdc-paginator-page-size-label\" [attr.id]=\"_pageSizeLabelId\" aria-hidden=\"true\">\n          {{_intl.itemsPerPageLabel}}\n        </div>\n\n        @if (_displayedPageSizeOptions.length > 1) {\n          <mat-form-field\n            [appearance]=\"_formFieldAppearance!\"\n            [color]=\"color\"\n            class=\"mat-mdc-paginator-page-size-select\">\n            <mat-select\n              #selectRef\n              [value]=\"pageSize\"\n              [disabled]=\"disabled\"\n              [aria-labelledby]=\"_pageSizeLabelId\"\n              [panelClass]=\"selectConfig.panelClass || ''\"\n              [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n              (selectionChange)=\"_changePageSize($event.value)\"\n              hideSingleSelectionIndicator>\n              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {\n                <mat-option [value]=\"pageSizeOption\">\n                  {{pageSizeOption}}\n                </mat-option>\n              }\n            </mat-select>\n          <div class=\"mat-mdc-paginator-touch-target\" (click)=\"selectRef.open()\"></div>\n          </mat-form-field>\n        }\n\n        @if (_displayedPageSizeOptions.length <= 1) {\n          <div class=\"mat-mdc-paginator-page-size-value\">{{pageSize}}</div>\n        }\n      </div>\n    }\n\n    <div class=\"mat-mdc-paginator-range-actions\">\n      <div class=\"mat-mdc-paginator-range-label\" aria-atomic=\"true\" aria-live=\"polite\" role=\"status\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <!--\n      The buttons use `disabledInteractive` so that they can retain focus if they become disabled,\n      otherwise focus is moved to the document body. However, users should not be able to navigate\n      into these buttons, so `tabindex` is set to -1 when disabled.\n      -->\n\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-first\"\n                (click)=\"_buttonClicked(0, _previousButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.firstPageLabel\"\n                [matTooltip]=\"_intl.firstPageLabel\"\n                [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_previousButtonsDisabled()\"\n                [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n          </svg>\n        </button>\n      }\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-previous\"\n              (click)=\"_buttonClicked(pageIndex - 1, _previousButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              [tabindex]=\"_previousButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button matIconButton type=\"button\"\n              class=\"mat-mdc-paginator-navigation-next\"\n              (click)=\"_buttonClicked(pageIndex + 1, _nextButtonsDisabled())\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              matTooltipPosition=\"above\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n              disabledInteractive>\n        <svg class=\"mat-mdc-paginator-icon\"\n             viewBox=\"0 0 24 24\"\n             focusable=\"false\"\n             aria-hidden=\"true\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      @if (showFirstLastButtons) {\n        <button matIconButton type=\"button\"\n                class=\"mat-mdc-paginator-navigation-last\"\n                (click)=\"_buttonClicked(getNumberOfPages() - 1, _nextButtonsDisabled())\"\n                [attr.aria-label]=\"_intl.lastPageLabel\"\n                [matTooltip]=\"_intl.lastPageLabel\"\n                [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n                matTooltipPosition=\"above\"\n                [disabled]=\"_nextButtonsDisabled()\"\n                [tabindex]=\"_nextButtonsDisabled() ? -1 : null\"\n                disabledInteractive>\n          <svg class=\"mat-mdc-paginator-icon\"\n              viewBox=\"0 0 24 24\"\n              focusable=\"false\"\n              aria-hidden=\"true\">\n            <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n          </svg>\n        </button>\n      }\n    </div>\n  </div>\n</div>\n",
      styles: [".mat-mdc-paginator {\n  display: block;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));\n  background-color: var(--mat-paginator-container-background-color, var(--mat-sys-surface));\n  font-family: var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));\n  font-weight: var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));\n  letter-spacing: var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));\n  --mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);\n  --mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px);\n}\n.mat-mdc-paginator .mat-mdc-select-value {\n  font-size: var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size));\n}\n.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.mat-mdc-paginator .mat-mdc-select {\n  line-height: 1.5;\n}\n\n.mat-mdc-paginator-outer-container {\n  display: flex;\n}\n\n.mat-mdc-paginator-container {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 0 8px;\n  flex-wrap: wrap;\n  width: 100%;\n  min-height: var(--mat-paginator-container-size, 56px);\n}\n\n.mat-mdc-paginator-page-size {\n  display: flex;\n  align-items: baseline;\n  margin-right: 8px;\n}\n[dir=rtl] .mat-mdc-paginator-page-size {\n  margin-right: 0;\n  margin-left: 8px;\n}\n\n.mat-mdc-paginator-page-size-label {\n  margin: 0 4px;\n}\n\n.mat-mdc-paginator-page-size-select {\n  margin: 0 4px;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n}\n\n.mat-mdc-paginator-range-label {\n  margin: 0 32px 0 24px;\n}\n\n.mat-mdc-paginator-range-actions {\n  display: flex;\n  align-items: center;\n}\n\n.mat-mdc-paginator-icon {\n  display: inline-block;\n  width: 28px;\n  fill: var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {\n  fill: var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n[dir=rtl] .mat-mdc-paginator-icon {\n  transform: rotate(180deg);\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,\n  .mat-mdc-paginator-icon {\n    fill: currentColor;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {\n    outline: solid 1px;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {\n    color: GrayText;\n  }\n}\n.mat-mdc-paginator-touch-target {\n  display: var(--mat-paginator-touch-target-display, block);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n  height: var(--mat-paginator-page-size-select-touch-target-height, 48px);\n  background-color: transparent;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    color: [{
      type: Input
    }],
    pageIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    length: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSize: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSizeOptions: [{
      type: Input
    }],
    hidePageSize: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showFirstLastButtons: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selectConfig: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    page: [{
      type: Output
    }]
  }
});

class MatPaginatorModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginatorModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginatorModule,
    imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
    exports: [MatPaginator]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatPaginatorModule,
    imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatPaginatorModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
      exports: [MatPaginator]
    }]
  }]
});

export { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent };
//# sourceMappingURL=paginator.mjs.map
