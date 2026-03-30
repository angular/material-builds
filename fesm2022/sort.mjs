import * as i0 from '@angular/core';
import { InjectionToken, EventEmitter, booleanAttribute, Output, Input, Optional, Inject, Directive, inject, ChangeDetectorRef, ElementRef, signal, ChangeDetectionStrategy, ViewEncapsulation, Component, NgModule, Injectable } from '@angular/core';
import { ReplaySubject, Subject, merge } from 'rxjs';
import { FocusMonitor, AriaDescriber } from '@angular/cdk/a11y';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { CdkColumnDef } from '@angular/cdk/table';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { _StructuralStylesLoader } from './_structural-styles-chunk.mjs';
import { BidiModule } from '@angular/cdk/bidi';
import '@angular/cdk/layout';

function getSortDuplicateSortableIdError(id) {
  return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
function getSortHeaderNotContainedWithinSortError() {
  return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
function getSortHeaderMissingIdError() {
  return Error(`MatSortHeader must be provided with a unique id.`);
}
function getSortInvalidDirectionError(direction) {
  return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}

const MAT_SORT_DEFAULT_OPTIONS = new InjectionToken('MAT_SORT_DEFAULT_OPTIONS');
class MatSort {
  _defaultOptions;
  _initializedStream = new ReplaySubject(1);
  sortables = new Map();
  _stateChanges = new Subject();
  active;
  start = 'asc';
  get direction() {
    return this._direction;
  }
  set direction(direction) {
    if (direction && direction !== 'asc' && direction !== 'desc' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  _direction = '';
  disableClear;
  disabled = false;
  sortChange = new EventEmitter();
  initialized = this._initializedStream;
  constructor(_defaultOptions) {
    this._defaultOptions = _defaultOptions;
  }
  register(sortable) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!sortable.id) {
        throw getSortHeaderMissingIdError();
      }
      if (this.sortables.has(sortable.id)) {
        throw getSortDuplicateSortableIdError(sortable.id);
      }
    }
    this.sortables.set(sortable.id, sortable);
  }
  deregister(sortable) {
    this.sortables.delete(sortable.id);
  }
  sort(sortable) {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }
    this.sortChange.emit({
      active: this.active,
      direction: this.direction
    });
  }
  getNextSortDirection(sortable) {
    if (!sortable) {
      return '';
    }
    const disableClear = sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
    let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }
  ngOnInit() {
    this._initializedStream.next();
  }
  ngOnChanges() {
    this._stateChanges.next();
  }
  ngOnDestroy() {
    this._stateChanges.complete();
    this._initializedStream.complete();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSort,
    deps: [{
      token: MAT_SORT_DEFAULT_OPTIONS,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "22.0.0-next.5",
    type: MatSort,
    isStandalone: true,
    selector: "[matSort]",
    inputs: {
      active: ["matSortActive", "active"],
      start: ["matSortStart", "start"],
      direction: ["matSortDirection", "direction"],
      disableClear: ["matSortDisableClear", "disableClear", booleanAttribute],
      disabled: ["matSortDisabled", "disabled", booleanAttribute]
    },
    outputs: {
      sortChange: "matSortChange"
    },
    host: {
      classAttribute: "mat-sort"
    },
    exportAs: ["matSort"],
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatSort,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matSort]',
      exportAs: 'matSort',
      host: {
        'class': 'mat-sort'
      }
    }]
  }],
  ctorParameters: () => [{
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_SORT_DEFAULT_OPTIONS]
    }]
  }],
  propDecorators: {
    active: [{
      type: Input,
      args: ['matSortActive']
    }],
    start: [{
      type: Input,
      args: ['matSortStart']
    }],
    direction: [{
      type: Input,
      args: ['matSortDirection']
    }],
    disableClear: [{
      type: Input,
      args: [{
        alias: 'matSortDisableClear',
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: 'matSortDisabled',
        transform: booleanAttribute
      }]
    }],
    sortChange: [{
      type: Output,
      args: ['matSortChange']
    }]
  }
});
function getSortDirectionCycle(start, disableClear) {
  let sortOrder = ['asc', 'desc'];
  if (start == 'desc') {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push('');
  }
  return sortOrder;
}

class MatSortHeader {
  _sort = inject(MatSort, {
    optional: true
  });
  _columnDef = inject(CdkColumnDef, {
    optional: true
  });
  _changeDetectorRef = inject(ChangeDetectorRef);
  _focusMonitor = inject(FocusMonitor);
  _elementRef = inject(ElementRef);
  _ariaDescriber = inject(AriaDescriber, {
    optional: true
  });
  _renderChanges;
  _animationsDisabled = _animationsDisabled();
  _recentlyCleared = signal(null, ...(ngDevMode ? [{
    debugName: "_recentlyCleared"
  }] : []));
  _sortButton;
  id;
  arrowPosition = 'after';
  start;
  disabled = false;
  get sortActionDescription() {
    return this._sortActionDescription;
  }
  set sortActionDescription(value) {
    this._updateSortActionDescription(value);
  }
  _sortActionDescription = 'Sort';
  disableClear;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const defaultOptions = inject(MAT_SORT_DEFAULT_OPTIONS, {
      optional: true
    });
    if (!this._sort && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSortHeaderNotContainedWithinSortError();
    }
    if (defaultOptions?.arrowPosition) {
      this.arrowPosition = defaultOptions?.arrowPosition;
    }
  }
  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }
    this._sort.register(this);
    this._renderChanges = merge(this._sort._stateChanges, this._sort.sortChange).subscribe(() => this._changeDetectorRef.markForCheck());
    this._sortButton = this._elementRef.nativeElement.querySelector('.mat-sort-header-container');
    this._updateSortActionDescription(this._sortActionDescription);
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(() => {
      Promise.resolve().then(() => this._recentlyCleared.set(null));
    });
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._sort.deregister(this);
    this._renderChanges?.unsubscribe();
    if (this._sortButton) {
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
    }
  }
  _toggleOnInteraction() {
    if (!this._isDisabled()) {
      const wasSorted = this._isSorted();
      const prevDirection = this._sort.direction;
      this._sort.sort(this);
      this._recentlyCleared.set(wasSorted && !this._isSorted() ? prevDirection : null);
    }
  }
  _handleKeydown(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      event.preventDefault();
      this._toggleOnInteraction();
    }
  }
  _isSorted() {
    return this._sort.active == this.id && (this._sort.direction === 'asc' || this._sort.direction === 'desc');
  }
  _isDisabled() {
    return this._sort.disabled || this.disabled;
  }
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return 'none';
    }
    return this._sort.direction == 'asc' ? 'ascending' : 'descending';
  }
  _renderArrow() {
    return !this._isDisabled() || this._isSorted();
  }
  _updateSortActionDescription(newDescription) {
    if (this._sortButton) {
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
      this._ariaDescriber?.describe(this._sortButton, newDescription);
    }
    this._sortActionDescription = newDescription;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortHeader,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "22.0.0-next.5",
    type: MatSortHeader,
    isStandalone: true,
    selector: "[mat-sort-header]",
    inputs: {
      id: ["mat-sort-header", "id"],
      arrowPosition: "arrowPosition",
      start: "start",
      disabled: ["disabled", "disabled", booleanAttribute],
      sortActionDescription: "sortActionDescription",
      disableClear: ["disableClear", "disableClear", booleanAttribute]
    },
    host: {
      listeners: {
        "click": "_toggleOnInteraction()",
        "keydown": "_handleKeydown($event)",
        "mouseleave": "_recentlyCleared.set(null)"
      },
      properties: {
        "attr.aria-sort": "_getAriaSortAttribute()",
        "class.mat-sort-header-disabled": "_isDisabled()"
      },
      classAttribute: "mat-sort-header"
    },
    exportAs: ["matSortHeader"],
    ngImport: i0,
    template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition === 'before'\"\n     [class.mat-sort-header-descending]=\"_sort.direction === 'desc'\"\n     [class.mat-sort-header-ascending]=\"_sort.direction === 'asc'\"\n     [class.mat-sort-header-recently-cleared-ascending]=\"_recentlyCleared() === 'asc'\"\n     [class.mat-sort-header-recently-cleared-descending]=\"_recentlyCleared() === 'desc'\"\n     [class.mat-sort-header-animations-disabled]=\"_animationsDisabled\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  @if (_renderArrow()) {\n    <div class=\"mat-sort-header-arrow\">\n      <ng-content select=\"[matSortHeaderIcon]\">\n        <svg viewBox=\"0 -960 960 960\" focusable=\"false\" aria-hidden=\"true\">\n          <path d=\"M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z\"/>\n        </svg>\n      </ng-content>\n    </div>\n  }\n</div>\n",
    styles: [".mat-sort-header {\n  cursor: pointer;\n}\n\n.mat-sort-header-disabled {\n  cursor: default;\n}\n\n.mat-sort-header-container {\n  display: flex;\n  align-items: center;\n  letter-spacing: normal;\n  outline: 0;\n}\n[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container, [mat-sort-header].cdk-program-focused .mat-sort-header-container {\n  border-bottom: solid 1px currentColor;\n}\n.mat-sort-header-container::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-sort-header-content {\n  display: flex;\n  align-items: center;\n}\n\n.mat-sort-header-position-before {\n  flex-direction: row-reverse;\n}\n\n@keyframes _mat-sort-header-recently-cleared-ascending {\n  from {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(-25%);\n    opacity: 0;\n  }\n}\n@keyframes _mat-sort-header-recently-cleared-descending {\n  from {\n    transform: translateY(0) rotate(180deg);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(25%) rotate(180deg);\n    opacity: 0;\n  }\n}\n.mat-sort-header-arrow {\n  height: 12px;\n  width: 12px;\n  position: relative;\n  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1), opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  overflow: visible;\n  color: var(--mat-sort-arrow-color, var(--mat-sys-on-surface));\n}\n.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow, .mat-sort-header.cdk-program-focused .mat-sort-header-arrow, .mat-sort-header:hover .mat-sort-header-arrow {\n  opacity: 0.54;\n}\n.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow {\n  opacity: 1;\n}\n.mat-sort-header-descending .mat-sort-header-arrow {\n  transform: rotate(180deg);\n}\n.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {\n  transform: translateY(-25%);\n}\n.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {\n  transition: none;\n  animation: _mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;\n}\n.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow {\n  transition: none;\n  animation: _mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;\n}\n.mat-sort-header-animations-disabled .mat-sort-header-arrow {\n  transition-duration: 0ms;\n  animation-duration: 0ms;\n}\n.mat-sort-header-arrow > svg, .mat-sort-header-arrow [matSortHeaderIcon] {\n  width: 24px;\n  height: 24px;\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: -12px 0 0 -12px;\n  transform: translateZ(0);\n}\n.mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {\n  margin: 0 0 0 6px;\n}\n.mat-sort-header-position-before .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-arrow {\n  margin: 0 6px 0 0;\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatSortHeader,
  decorators: [{
    type: Component,
    args: [{
      selector: '[mat-sort-header]',
      exportAs: 'matSortHeader',
      host: {
        'class': 'mat-sort-header',
        '(click)': '_toggleOnInteraction()',
        '(keydown)': '_handleKeydown($event)',
        '(mouseleave)': '_recentlyCleared.set(null)',
        '[attr.aria-sort]': '_getAriaSortAttribute()',
        '[class.mat-sort-header-disabled]': '_isDisabled()'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: "<!--\n  We set the `tabindex` on an element inside the table header, rather than the header itself,\n  because of a bug in NVDA where having a `tabindex` on a `th` breaks keyboard navigation in the\n  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both\n  be focusable, and have screen readers read out its `aria-sort` state. We prefer this approach\n  over having a button with an `aria-label` inside the header, because the button's `aria-label`\n  will be read out as the user is navigating the table's cell (see #13012).\n\n  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid\n-->\n<div class=\"mat-sort-header-container mat-focus-indicator\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition === 'before'\"\n     [class.mat-sort-header-descending]=\"_sort.direction === 'desc'\"\n     [class.mat-sort-header-ascending]=\"_sort.direction === 'asc'\"\n     [class.mat-sort-header-recently-cleared-ascending]=\"_recentlyCleared() === 'asc'\"\n     [class.mat-sort-header-recently-cleared-descending]=\"_recentlyCleared() === 'desc'\"\n     [class.mat-sort-header-animations-disabled]=\"_animationsDisabled\"\n     [attr.tabindex]=\"_isDisabled() ? null : 0\"\n     [attr.role]=\"_isDisabled() ? null : 'button'\">\n\n  <!--\n    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large\n    number of screenshot diff failures. It should be removed eventually. Note that the difference\n    isn't visible with a shorter header, but once it breaks up into multiple lines, this element\n    causes it to be center-aligned, whereas removing it will keep the text to the left.\n  -->\n  <div class=\"mat-sort-header-content\">\n    <ng-content></ng-content>\n  </div>\n\n  <!-- Disable animations while a current animation is running -->\n  @if (_renderArrow()) {\n    <div class=\"mat-sort-header-arrow\">\n      <ng-content select=\"[matSortHeaderIcon]\">\n        <svg viewBox=\"0 -960 960 960\" focusable=\"false\" aria-hidden=\"true\">\n          <path d=\"M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z\"/>\n        </svg>\n      </ng-content>\n    </div>\n  }\n</div>\n",
      styles: [".mat-sort-header {\n  cursor: pointer;\n}\n\n.mat-sort-header-disabled {\n  cursor: default;\n}\n\n.mat-sort-header-container {\n  display: flex;\n  align-items: center;\n  letter-spacing: normal;\n  outline: 0;\n}\n[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container, [mat-sort-header].cdk-program-focused .mat-sort-header-container {\n  border-bottom: solid 1px currentColor;\n}\n.mat-sort-header-container::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-sort-header-content {\n  display: flex;\n  align-items: center;\n}\n\n.mat-sort-header-position-before {\n  flex-direction: row-reverse;\n}\n\n@keyframes _mat-sort-header-recently-cleared-ascending {\n  from {\n    transform: translateY(0);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(-25%);\n    opacity: 0;\n  }\n}\n@keyframes _mat-sort-header-recently-cleared-descending {\n  from {\n    transform: translateY(0) rotate(180deg);\n    opacity: 1;\n  }\n  to {\n    transform: translateY(25%) rotate(180deg);\n    opacity: 0;\n  }\n}\n.mat-sort-header-arrow {\n  height: 12px;\n  width: 12px;\n  position: relative;\n  transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1), opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);\n  opacity: 0;\n  overflow: visible;\n  color: var(--mat-sort-arrow-color, var(--mat-sys-on-surface));\n}\n.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow, .mat-sort-header.cdk-program-focused .mat-sort-header-arrow, .mat-sort-header:hover .mat-sort-header-arrow {\n  opacity: 0.54;\n}\n.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow {\n  opacity: 1;\n}\n.mat-sort-header-descending .mat-sort-header-arrow {\n  transform: rotate(180deg);\n}\n.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {\n  transform: translateY(-25%);\n}\n.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow {\n  transition: none;\n  animation: _mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;\n}\n.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow {\n  transition: none;\n  animation: _mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards;\n}\n.mat-sort-header-animations-disabled .mat-sort-header-arrow {\n  transition-duration: 0ms;\n  animation-duration: 0ms;\n}\n.mat-sort-header-arrow > svg, .mat-sort-header-arrow [matSortHeaderIcon] {\n  width: 24px;\n  height: 24px;\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  margin: -12px 0 0 -12px;\n  transform: translateZ(0);\n}\n.mat-sort-header-arrow, [dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow {\n  margin: 0 0 0 6px;\n}\n.mat-sort-header-position-before .mat-sort-header-arrow, [dir=rtl] .mat-sort-header-arrow {\n  margin: 0 6px 0 0;\n}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    id: [{
      type: Input,
      args: ['mat-sort-header']
    }],
    arrowPosition: [{
      type: Input
    }],
    start: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    sortActionDescription: [{
      type: Input
    }],
    disableClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  }
});

class MatSortModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortModule,
    imports: [MatSort, MatSortHeader],
    exports: [MatSort, MatSortHeader, BidiModule]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortModule,
    imports: [BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatSortModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatSort, MatSortHeader],
      exports: [MatSort, MatSortHeader, BidiModule]
    }]
  }]
});

class MatSortHeaderIntl {
  changes = new Subject();
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortHeaderIntl,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "22.0.0-next.5",
    ngImport: i0,
    type: MatSortHeaderIntl,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.5",
  ngImport: i0,
  type: MatSortHeaderIntl,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});

export { MAT_SORT_DEFAULT_OPTIONS, MatSort, MatSortHeader, MatSortHeaderIntl, MatSortModule };
//# sourceMappingURL=sort.mjs.map
