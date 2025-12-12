import * as i0 from '@angular/core';
import { Injectable, inject, ElementRef, NgZone, EventEmitter, Injector, Renderer2, afterNextRender, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, InjectionToken, ChangeDetectorRef, signal, ViewChild, ViewContainerRef, DOCUMENT, booleanAttribute, Directive, forwardRef, HostAttributeToken, ContentChild, TemplateRef, NgModule } from '@angular/core';
import { Subject, Subscription, merge, of } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS } from './_date-formats-chunk.mjs';
import { _IdGenerator, CdkMonitorFocus, CdkTrapFocus, A11yModule } from '@angular/cdk/a11y';
import { Directionality, BidiModule } from '@angular/cdk/bidi';
import { coerceStringArray } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, SPACE, ENTER, PAGE_DOWN, PAGE_UP, END, HOME, DOWN_ARROW, UP_ARROW, RIGHT_ARROW, LEFT_ARROW, BACKSPACE } from '@angular/cdk/keycodes';
import { createRepositionScrollStrategy, FlexibleConnectedPositionStrategy, createOverlayRef, OverlayConfig, createBlockScrollStrategy, createGlobalPositionStrategy, createFlexibleConnectedPositionStrategy, OverlayModule } from '@angular/cdk/overlay';
import { Platform, _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { ComponentPortal, CdkPortalOutlet, TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { startWith, take, filter } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { _CdkPrivateStyleLoader, _VisuallyHiddenLoader } from '@angular/cdk/private';
import { _StructuralStylesLoader } from './_structural-styles-chunk.mjs';
import { MatButton, MatButtonModule } from './button.mjs';
import { MatIconButton } from './_icon-button-chunk.mjs';
import { MatTooltip } from './_tooltip-chunk.mjs';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, ControlContainer, NgForm, FormGroupDirective, NgControl } from '@angular/forms';
import { MAT_INPUT_VALUE_ACCESSOR } from './_input-value-accessor-chunk.mjs';
import { MAT_FORM_FIELD, MatFormFieldControl } from './_form-field-chunk.mjs';
import { ErrorStateMatcher } from './_error-options-chunk.mjs';
import { _ErrorStateTracker } from './_error-state-chunk.mjs';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import './_ripple-module-chunk.mjs';
import './_ripple-chunk.mjs';
import './_ripple-loader-chunk.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/observers/private';

function createMissingDateImplError(provider) {
  return Error(`MatDatepicker: No provider found for ${provider}. You must add one of the following ` + `to your app config: provideNativeDateAdapter, provideDateFnsAdapter, ` + `provideLuxonDateAdapter, provideMomentDateAdapter, or provide a custom implementation.`);
}

class MatDatepickerIntl {
  changes = new Subject();
  calendarLabel = 'Calendar';
  openCalendarLabel = 'Open calendar';
  closeCalendarLabel = 'Close calendar';
  prevMonthLabel = 'Previous month';
  nextMonthLabel = 'Next month';
  prevYearLabel = 'Previous year';
  nextYearLabel = 'Next year';
  prevMultiYearLabel = 'Previous 24 years';
  nextMultiYearLabel = 'Next 24 years';
  switchToMonthViewLabel = 'Choose date';
  switchToMultiYearViewLabel = 'Choose month and year';
  startDateLabel = 'Start date';
  endDateLabel = 'End date';
  comparisonDateLabel = 'Comparison range';
  formatYearRange(start, end) {
    return `${start} \u2013 ${end}`;
  }
  formatYearRangeLabel(start, end) {
    return `${start} to ${end}`;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerIntl,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerIntl,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerIntl,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});

let uniqueIdCounter$1 = 0;
class MatCalendarCell {
  value;
  displayValue;
  ariaLabel;
  enabled;
  cssClasses;
  compareValue;
  rawValue;
  id = uniqueIdCounter$1++;
  constructor(value, displayValue, ariaLabel, enabled, cssClasses = {}, compareValue = value, rawValue) {
    this.value = value;
    this.displayValue = displayValue;
    this.ariaLabel = ariaLabel;
    this.enabled = enabled;
    this.cssClasses = cssClasses;
    this.compareValue = compareValue;
    this.rawValue = rawValue;
  }
}
const activeCapturingEventOptions = {
  passive: false,
  capture: true
};
const passiveCapturingEventOptions = {
  passive: true,
  capture: true
};
const passiveEventOptions = {
  passive: true
};
class MatCalendarBody {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _platform = inject(Platform);
  _intl = inject(MatDatepickerIntl);
  _eventCleanups;
  _skipNextFocus;
  _focusActiveCellAfterViewChecked = false;
  label;
  rows;
  todayValue;
  startValue;
  endValue;
  labelMinRequiredCells;
  numCols = 7;
  activeCell = 0;
  ngAfterViewChecked() {
    if (this._focusActiveCellAfterViewChecked) {
      this._focusActiveCell();
      this._focusActiveCellAfterViewChecked = false;
    }
  }
  isRange = false;
  cellAspectRatio = 1;
  comparisonStart;
  comparisonEnd;
  previewStart = null;
  previewEnd = null;
  startDateAccessibleName;
  endDateAccessibleName;
  selectedValueChange = new EventEmitter();
  previewChange = new EventEmitter();
  activeDateChange = new EventEmitter();
  dragStarted = new EventEmitter();
  dragEnded = new EventEmitter();
  _firstRowOffset;
  _cellPadding;
  _cellWidth;
  _startDateLabelId;
  _endDateLabelId;
  _comparisonStartDateLabelId;
  _comparisonEndDateLabelId;
  _didDragSinceMouseDown = false;
  _injector = inject(Injector);
  comparisonDateAccessibleName = this._intl.comparisonDateLabel;
  _trackRow = row => row;
  constructor() {
    const renderer = inject(Renderer2);
    const idGenerator = inject(_IdGenerator);
    this._startDateLabelId = idGenerator.getId('mat-calendar-body-start-');
    this._endDateLabelId = idGenerator.getId('mat-calendar-body-end-');
    this._comparisonStartDateLabelId = idGenerator.getId('mat-calendar-body-comparison-start-');
    this._comparisonEndDateLabelId = idGenerator.getId('mat-calendar-body-comparison-end-');
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    this._ngZone.runOutsideAngular(() => {
      const element = this._elementRef.nativeElement;
      const cleanups = [renderer.listen(element, 'touchmove', this._touchmoveHandler, activeCapturingEventOptions), renderer.listen(element, 'mouseenter', this._enterHandler, passiveCapturingEventOptions), renderer.listen(element, 'focus', this._enterHandler, passiveCapturingEventOptions), renderer.listen(element, 'mouseleave', this._leaveHandler, passiveCapturingEventOptions), renderer.listen(element, 'blur', this._leaveHandler, passiveCapturingEventOptions), renderer.listen(element, 'mousedown', this._mousedownHandler, passiveEventOptions), renderer.listen(element, 'touchstart', this._mousedownHandler, passiveEventOptions)];
      if (this._platform.isBrowser) {
        cleanups.push(renderer.listen('window', 'mouseup', this._mouseupHandler), renderer.listen('window', 'touchend', this._touchendHandler));
      }
      this._eventCleanups = cleanups;
    });
  }
  _cellClicked(cell, event) {
    if (this._didDragSinceMouseDown) {
      return;
    }
    if (cell.enabled) {
      this.selectedValueChange.emit({
        value: cell.value,
        event
      });
    }
  }
  _emitActiveDateChange(cell, event) {
    if (cell.enabled) {
      this.activeDateChange.emit({
        value: cell.value,
        event
      });
    }
  }
  _isSelected(value) {
    return this.startValue === value || this.endValue === value;
  }
  ngOnChanges(changes) {
    const columnChanges = changes['numCols'];
    const {
      rows,
      numCols
    } = this;
    if (changes['rows'] || columnChanges) {
      this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
    }
    if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
      this._cellPadding = `${50 * this.cellAspectRatio / numCols}%`;
    }
    if (columnChanges || !this._cellWidth) {
      this._cellWidth = `${100 / numCols}%`;
    }
  }
  ngOnDestroy() {
    this._eventCleanups.forEach(cleanup => cleanup());
  }
  _isActiveCell(rowIndex, colIndex) {
    let cellNumber = rowIndex * this.numCols + colIndex;
    if (rowIndex) {
      cellNumber -= this._firstRowOffset;
    }
    return cellNumber == this.activeCell;
  }
  _focusActiveCell(movePreview = true) {
    afterNextRender(() => {
      setTimeout(() => {
        const activeCell = this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
        if (activeCell) {
          if (!movePreview) {
            this._skipNextFocus = true;
          }
          activeCell.focus();
        }
      });
    }, {
      injector: this._injector
    });
  }
  _scheduleFocusActiveCellAfterViewChecked() {
    this._focusActiveCellAfterViewChecked = true;
  }
  _isRangeStart(value) {
    return isStart(value, this.startValue, this.endValue);
  }
  _isRangeEnd(value) {
    return isEnd(value, this.startValue, this.endValue);
  }
  _isInRange(value) {
    return isInRange(value, this.startValue, this.endValue, this.isRange);
  }
  _isComparisonStart(value) {
    return isStart(value, this.comparisonStart, this.comparisonEnd);
  }
  _isComparisonBridgeStart(value, rowIndex, colIndex) {
    if (!this._isComparisonStart(value) || this._isRangeStart(value) || !this._isInRange(value)) {
      return false;
    }
    let previousCell = this.rows[rowIndex][colIndex - 1];
    if (!previousCell) {
      const previousRow = this.rows[rowIndex - 1];
      previousCell = previousRow && previousRow[previousRow.length - 1];
    }
    return previousCell && !this._isRangeEnd(previousCell.compareValue);
  }
  _isComparisonBridgeEnd(value, rowIndex, colIndex) {
    if (!this._isComparisonEnd(value) || this._isRangeEnd(value) || !this._isInRange(value)) {
      return false;
    }
    let nextCell = this.rows[rowIndex][colIndex + 1];
    if (!nextCell) {
      const nextRow = this.rows[rowIndex + 1];
      nextCell = nextRow && nextRow[0];
    }
    return nextCell && !this._isRangeStart(nextCell.compareValue);
  }
  _isComparisonEnd(value) {
    return isEnd(value, this.comparisonStart, this.comparisonEnd);
  }
  _isInComparisonRange(value) {
    return isInRange(value, this.comparisonStart, this.comparisonEnd, this.isRange);
  }
  _isComparisonIdentical(value) {
    return this.comparisonStart === this.comparisonEnd && value === this.comparisonStart;
  }
  _isPreviewStart(value) {
    return isStart(value, this.previewStart, this.previewEnd);
  }
  _isPreviewEnd(value) {
    return isEnd(value, this.previewStart, this.previewEnd);
  }
  _isInPreview(value) {
    return isInRange(value, this.previewStart, this.previewEnd, this.isRange);
  }
  _getDescribedby(value) {
    if (!this.isRange) {
      return null;
    }
    if (this.startValue === value && this.endValue === value) {
      return `${this._startDateLabelId} ${this._endDateLabelId}`;
    } else if (this.startValue === value) {
      return this._startDateLabelId;
    } else if (this.endValue === value) {
      return this._endDateLabelId;
    }
    if (this.comparisonStart !== null && this.comparisonEnd !== null) {
      if (value === this.comparisonStart && value === this.comparisonEnd) {
        return `${this._comparisonStartDateLabelId} ${this._comparisonEndDateLabelId}`;
      } else if (value === this.comparisonStart) {
        return this._comparisonStartDateLabelId;
      } else if (value === this.comparisonEnd) {
        return this._comparisonEndDateLabelId;
      }
    }
    return null;
  }
  _enterHandler = event => {
    if (this._skipNextFocus && event.type === 'focus') {
      this._skipNextFocus = false;
      return;
    }
    if (event.target && this.isRange) {
      const cell = this._getCellFromElement(event.target);
      if (cell) {
        this._ngZone.run(() => this.previewChange.emit({
          value: cell.enabled ? cell : null,
          event
        }));
      }
    }
  };
  _touchmoveHandler = event => {
    if (!this.isRange) return;
    const target = getActualTouchTarget(event);
    const cell = target ? this._getCellFromElement(target) : null;
    if (target !== event.target) {
      this._didDragSinceMouseDown = true;
    }
    if (getCellElement(event.target)) {
      event.preventDefault();
    }
    this._ngZone.run(() => this.previewChange.emit({
      value: cell?.enabled ? cell : null,
      event
    }));
  };
  _leaveHandler = event => {
    if (this.previewEnd !== null && this.isRange) {
      if (event.type !== 'blur') {
        this._didDragSinceMouseDown = true;
      }
      if (event.target && this._getCellFromElement(event.target) && !(event.relatedTarget && this._getCellFromElement(event.relatedTarget))) {
        this._ngZone.run(() => this.previewChange.emit({
          value: null,
          event
        }));
      }
    }
  };
  _mousedownHandler = event => {
    if (!this.isRange) return;
    this._didDragSinceMouseDown = false;
    const cell = event.target && this._getCellFromElement(event.target);
    if (!cell || !this._isInRange(cell.compareValue)) {
      return;
    }
    this._ngZone.run(() => {
      this.dragStarted.emit({
        value: cell.rawValue,
        event
      });
    });
  };
  _mouseupHandler = event => {
    if (!this.isRange) return;
    const cellElement = getCellElement(event.target);
    if (!cellElement) {
      this._ngZone.run(() => {
        this.dragEnded.emit({
          value: null,
          event
        });
      });
      return;
    }
    if (cellElement.closest('.mat-calendar-body') !== this._elementRef.nativeElement) {
      return;
    }
    this._ngZone.run(() => {
      const cell = this._getCellFromElement(cellElement);
      this.dragEnded.emit({
        value: cell?.rawValue ?? null,
        event
      });
    });
  };
  _touchendHandler = event => {
    const target = getActualTouchTarget(event);
    if (target) {
      this._mouseupHandler({
        target
      });
    }
  };
  _getCellFromElement(element) {
    const cell = getCellElement(element);
    if (cell) {
      const row = cell.getAttribute('data-mat-row');
      const col = cell.getAttribute('data-mat-col');
      if (row && col) {
        return this.rows[parseInt(row)]?.[parseInt(col)] || null;
      }
    }
    return null;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatCalendarBody,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatCalendarBody,
    isStandalone: true,
    selector: "[mat-calendar-body]",
    inputs: {
      label: "label",
      rows: "rows",
      todayValue: "todayValue",
      startValue: "startValue",
      endValue: "endValue",
      labelMinRequiredCells: "labelMinRequiredCells",
      numCols: "numCols",
      activeCell: "activeCell",
      isRange: "isRange",
      cellAspectRatio: "cellAspectRatio",
      comparisonStart: "comparisonStart",
      comparisonEnd: "comparisonEnd",
      previewStart: "previewStart",
      previewEnd: "previewEnd",
      startDateAccessibleName: "startDateAccessibleName",
      endDateAccessibleName: "endDateAccessibleName"
    },
    outputs: {
      selectedValueChange: "selectedValueChange",
      previewChange: "previewChange",
      activeDateChange: "activeDateChange",
      dragStarted: "dragStarted",
      dragEnded: "dragEnded"
    },
    host: {
      classAttribute: "mat-calendar-body"
    },
    exportAs: ["matCalendarBody"],
    usesOnChanges: true,
    ngImport: i0,
    template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n@if (_firstRowOffset < labelMinRequiredCells) {\n  <tr aria-hidden=\"true\">\n    <td class=\"mat-calendar-body-label\"\n        [attr.colspan]=\"numCols\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\">\n      {{label}}\n    </td>\n  </tr>\n}\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n@for (row of rows; track _trackRow(row); let rowIndex = $index) {\n  <tr role=\"row\">\n    <!--\n      This cell is purely decorative, but we can't put `aria-hidden` or `role=\"presentation\"` on it,\n      because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n      table cells is maintained by setting the top and bottom padding as a percentage of the width\n      (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n    -->\n    @if (rowIndex === 0 && _firstRowOffset) {\n      <td\n        class=\"mat-calendar-body-label\"\n        [attr.colspan]=\"_firstRowOffset\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\">\n        {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n      </td>\n    }\n    <!--\n      Each gridcell in the calendar contains a button, which signals to assistive technology that the\n      cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n      background.\n    -->\n    @for (item of row; track item.id; let colIndex = $index) {\n      <td\n        role=\"gridcell\"\n        class=\"mat-calendar-body-cell-container\"\n        [style.width]=\"_cellWidth\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\"\n        [attr.data-mat-row]=\"rowIndex\"\n        [attr.data-mat-col]=\"colIndex\"\n      >\n        <button\n            type=\"button\"\n            class=\"mat-calendar-body-cell\"\n            [ngClass]=\"item.cssClasses\"\n            [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n            [class.mat-calendar-body-disabled]=\"!item.enabled\"\n            [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n            [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n            [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n            [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n            [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n            [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n            [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n            [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n            [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n            [attr.aria-label]=\"item.ariaLabel\"\n            [attr.aria-disabled]=\"!item.enabled || null\"\n            [attr.aria-pressed]=\"_isSelected(item.compareValue)\"\n            [attr.aria-current]=\"todayValue === item.compareValue ? 'date' : null\"\n            [attr.aria-describedby]=\"_getDescribedby(item.compareValue)\"\n            (click)=\"_cellClicked(item, $event)\"\n            (focus)=\"_emitActiveDateChange(item, $event)\">\n            <span class=\"mat-calendar-body-cell-content mat-focus-indicator\"\n              [class.mat-calendar-body-selected]=\"_isSelected(item.compareValue)\"\n              [class.mat-calendar-body-comparison-identical]=\"_isComparisonIdentical(item.compareValue)\"\n              [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n              {{item.displayValue}}\n            </span>\n            <span class=\"mat-calendar-body-cell-preview\" aria-hidden=\"true\"></span>\n        </button>\n      </td>\n    }\n  </tr>\n}\n\n<span [id]=\"_startDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{startDateAccessibleName}}\n</span>\n<span [id]=\"_endDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{endDateAccessibleName}}\n</span>\n<span [id]=\"_comparisonStartDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{comparisonDateAccessibleName}} {{startDateAccessibleName}}\n</span>\n<span [id]=\"_comparisonEndDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{comparisonDateAccessibleName}} {{endDateAccessibleName}}\n</span>\n",
    styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-today:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){border-color:var(--mat-datepicker-calendar-date-today-outline-color, var(--mat-sys-primary))}.mat-calendar-body-label{height:0;line-height:0;text-align:start;padding-left:4.7142857143%;padding-right:4.7142857143%;font-size:var(--mat-datepicker-calendar-body-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-body-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-datepicker-calendar-body-label-text-color, var(--mat-sys-on-surface))}.mat-calendar-body-hidden-label{display:none}.mat-calendar-body-cell-container{position:relative;height:0;line-height:0}.mat-calendar-body-cell{position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;margin:0;font-family:var(--mat-datepicker-calendar-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-datepicker-calendar-text-size, var(--mat-sys-body-medium-size));-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-calendar-body-cell::-moz-focus-inner{border:0}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-cell-preview{content:\"\";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;display:block;height:90%;width:100%}.mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-start::after,.mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,.mat-calendar-body-comparison-start::after,.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,[dir=rtl] .mat-calendar-body-comparison-start::after,[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,.mat-calendar-body-comparison-end::after,.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,[dir=rtl] .mat-calendar-body-comparison-end::after,[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-comparison-bridge-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-bridge-end.mat-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end.mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-end.mat-calendar-body-range-start::after{width:90%}.mat-calendar-body-in-preview{color:var(--mat-datepicker-calendar-date-preview-state-outline-color, var(--mat-sys-primary))}.mat-calendar-body-in-preview .mat-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-disabled>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){color:var(--mat-datepicker-calendar-date-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-calendar-body-disabled>.mat-calendar-body-today:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){border-color:var(--mat-datepicker-calendar-date-today-disabled-state-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mat-calendar-body-disabled{opacity:.5}}.mat-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px;color:var(--mat-datepicker-calendar-date-text-color, var(--mat-sys-on-surface));border-color:var(--mat-datepicker-calendar-date-outline-color, transparent)}.mat-calendar-body-cell-content.mat-focus-indicator{position:absolute}@media(forced-colors: active){.mat-calendar-body-cell-content{border:none}}.cdk-keyboard-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical),.cdk-program-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){background-color:var(--mat-datepicker-calendar-date-focus-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent))}@media(hover: hover){.mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){background-color:var(--mat-datepicker-calendar-date-hover-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}}.mat-calendar-body-selected{background-color:var(--mat-datepicker-calendar-date-selected-state-background-color, var(--mat-sys-primary));color:var(--mat-datepicker-calendar-date-selected-state-text-color, var(--mat-sys-on-primary))}.mat-calendar-body-disabled>.mat-calendar-body-selected{background-color:var(--mat-datepicker-calendar-date-selected-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-calendar-body-selected.mat-calendar-body-today{box-shadow:inset 0 0 0 1px var(--mat-datepicker-calendar-date-today-selected-state-outline-color, var(--mat-sys-primary))}.mat-calendar-body-in-range::before{background:var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container))}.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range::before{background:var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container))}.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range::before{background:var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container))}.mat-calendar-body-comparison-bridge-start::before,[dir=rtl] .mat-calendar-body-comparison-bridge-end::before{background:linear-gradient(to right, var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container)) 50%, var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container)) 50%)}.mat-calendar-body-comparison-bridge-end::before,[dir=rtl] .mat-calendar-body-comparison-bridge-start::before{background:linear-gradient(to left, var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container)) 50%, var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container)) 50%)}.mat-calendar-body-in-range>.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range.mat-calendar-body-in-range::after{background:var(--mat-datepicker-calendar-date-in-overlap-range-state-background-color, var(--mat-sys-secondary-container))}.mat-calendar-body-comparison-identical.mat-calendar-body-selected,.mat-calendar-body-in-comparison-range>.mat-calendar-body-selected{background:var(--mat-datepicker-calendar-date-in-overlap-range-selected-state-background-color, var(--mat-sys-secondary))}@media(forced-colors: active){.mat-datepicker-popup:not(:empty),.mat-calendar-body-cell:not(.mat-calendar-body-in-range) .mat-calendar-body-selected{outline:solid 1px}.mat-calendar-body-today{outline:dotted 1px}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-selected{background:none}.mat-calendar-body-in-range::before,.mat-calendar-body-comparison-bridge-start::before,.mat-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.mat-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .mat-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.mat-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .mat-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.mat-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.mat-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}}\n"],
    dependencies: [{
      kind: "directive",
      type: NgClass,
      selector: "[ngClass]",
      inputs: ["class", "ngClass"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatCalendarBody,
  decorators: [{
    type: Component,
    args: [{
      selector: '[mat-calendar-body]',
      host: {
        'class': 'mat-calendar-body'
      },
      exportAs: 'matCalendarBody',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgClass],
      template: "<!--\n  If there's not enough space in the first row, create a separate label row. We mark this row as\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\n-->\n@if (_firstRowOffset < labelMinRequiredCells) {\n  <tr aria-hidden=\"true\">\n    <td class=\"mat-calendar-body-label\"\n        [attr.colspan]=\"numCols\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\">\n      {{label}}\n    </td>\n  </tr>\n}\n\n<!-- Create the first row separately so we can include a special spacer cell. -->\n@for (row of rows; track _trackRow(row); let rowIndex = $index) {\n  <tr role=\"row\">\n    <!--\n      This cell is purely decorative, but we can't put `aria-hidden` or `role=\"presentation\"` on it,\n      because it throws off the week days for the rest of the row on NVDA. The aspect ratio of the\n      table cells is maintained by setting the top and bottom padding as a percentage of the width\n      (a variant of the trick described here: https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\n    -->\n    @if (rowIndex === 0 && _firstRowOffset) {\n      <td\n        class=\"mat-calendar-body-label\"\n        [attr.colspan]=\"_firstRowOffset\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\">\n        {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\n      </td>\n    }\n    <!--\n      Each gridcell in the calendar contains a button, which signals to assistive technology that the\n      cell is interactable, as well as the selection state via `aria-pressed`. See #23476 for\n      background.\n    -->\n    @for (item of row; track item.id; let colIndex = $index) {\n      <td\n        role=\"gridcell\"\n        class=\"mat-calendar-body-cell-container\"\n        [style.width]=\"_cellWidth\"\n        [style.paddingTop]=\"_cellPadding\"\n        [style.paddingBottom]=\"_cellPadding\"\n        [attr.data-mat-row]=\"rowIndex\"\n        [attr.data-mat-col]=\"colIndex\"\n      >\n        <button\n            type=\"button\"\n            class=\"mat-calendar-body-cell\"\n            [ngClass]=\"item.cssClasses\"\n            [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\n            [class.mat-calendar-body-disabled]=\"!item.enabled\"\n            [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\n            [class.mat-calendar-body-range-start]=\"_isRangeStart(item.compareValue)\"\n            [class.mat-calendar-body-range-end]=\"_isRangeEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-range]=\"_isInRange(item.compareValue)\"\n            [class.mat-calendar-body-comparison-bridge-start]=\"_isComparisonBridgeStart(item.compareValue, rowIndex, colIndex)\"\n            [class.mat-calendar-body-comparison-bridge-end]=\"_isComparisonBridgeEnd(item.compareValue, rowIndex, colIndex)\"\n            [class.mat-calendar-body-comparison-start]=\"_isComparisonStart(item.compareValue)\"\n            [class.mat-calendar-body-comparison-end]=\"_isComparisonEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-comparison-range]=\"_isInComparisonRange(item.compareValue)\"\n            [class.mat-calendar-body-preview-start]=\"_isPreviewStart(item.compareValue)\"\n            [class.mat-calendar-body-preview-end]=\"_isPreviewEnd(item.compareValue)\"\n            [class.mat-calendar-body-in-preview]=\"_isInPreview(item.compareValue)\"\n            [attr.aria-label]=\"item.ariaLabel\"\n            [attr.aria-disabled]=\"!item.enabled || null\"\n            [attr.aria-pressed]=\"_isSelected(item.compareValue)\"\n            [attr.aria-current]=\"todayValue === item.compareValue ? 'date' : null\"\n            [attr.aria-describedby]=\"_getDescribedby(item.compareValue)\"\n            (click)=\"_cellClicked(item, $event)\"\n            (focus)=\"_emitActiveDateChange(item, $event)\">\n            <span class=\"mat-calendar-body-cell-content mat-focus-indicator\"\n              [class.mat-calendar-body-selected]=\"_isSelected(item.compareValue)\"\n              [class.mat-calendar-body-comparison-identical]=\"_isComparisonIdentical(item.compareValue)\"\n              [class.mat-calendar-body-today]=\"todayValue === item.compareValue\">\n              {{item.displayValue}}\n            </span>\n            <span class=\"mat-calendar-body-cell-preview\" aria-hidden=\"true\"></span>\n        </button>\n      </td>\n    }\n  </tr>\n}\n\n<span [id]=\"_startDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{startDateAccessibleName}}\n</span>\n<span [id]=\"_endDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{endDateAccessibleName}}\n</span>\n<span [id]=\"_comparisonStartDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{comparisonDateAccessibleName}} {{startDateAccessibleName}}\n</span>\n<span [id]=\"_comparisonEndDateLabelId\" class=\"mat-calendar-body-hidden-label\">\n  {{comparisonDateAccessibleName}} {{endDateAccessibleName}}\n</span>\n",
      styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-today:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){border-color:var(--mat-datepicker-calendar-date-today-outline-color, var(--mat-sys-primary))}.mat-calendar-body-label{height:0;line-height:0;text-align:start;padding-left:4.7142857143%;padding-right:4.7142857143%;font-size:var(--mat-datepicker-calendar-body-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-body-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-datepicker-calendar-body-label-text-color, var(--mat-sys-on-surface))}.mat-calendar-body-hidden-label{display:none}.mat-calendar-body-cell-container{position:relative;height:0;line-height:0}.mat-calendar-body-cell{position:absolute;top:0;left:0;width:100%;height:100%;background:none;text-align:center;outline:none;margin:0;font-family:var(--mat-datepicker-calendar-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-datepicker-calendar-text-size, var(--mat-sys-body-medium-size));-webkit-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-calendar-body-cell::-moz-focus-inner{border:0}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-cell-preview{content:\"\";position:absolute;top:5%;left:0;z-index:0;box-sizing:border-box;display:block;height:90%;width:100%}.mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-start::after,.mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,.mat-calendar-body-comparison-start::after,.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:5%;width:95%;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-range-start:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-start:not(.mat-calendar-body-comparison-bridge-start)::before,[dir=rtl] .mat-calendar-body-comparison-start::after,[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{left:0;border-radius:0;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,.mat-calendar-body-comparison-end::after,.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}[dir=rtl] .mat-calendar-body-range-end:not(.mat-calendar-body-in-comparison-range)::before,[dir=rtl] .mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-end:not(.mat-calendar-body-comparison-bridge-end)::before,[dir=rtl] .mat-calendar-body-comparison-end::after,[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{left:5%;border-radius:0;border-top-left-radius:999px;border-bottom-left-radius:999px}[dir=rtl] .mat-calendar-body-comparison-bridge-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-bridge-end.mat-calendar-body-range-start::after{width:95%;border-top-right-radius:999px;border-bottom-right-radius:999px}.mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,[dir=rtl] .mat-calendar-body-comparison-start.mat-calendar-body-range-end::after,.mat-calendar-body-comparison-end.mat-calendar-body-range-start::after,[dir=rtl] .mat-calendar-body-comparison-end.mat-calendar-body-range-start::after{width:90%}.mat-calendar-body-in-preview{color:var(--mat-datepicker-calendar-date-preview-state-outline-color, var(--mat-sys-primary))}.mat-calendar-body-in-preview .mat-calendar-body-cell-preview{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-preview-start .mat-calendar-body-cell-preview{border-left:0;border-right:dashed 1px}.mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-preview-end .mat-calendar-body-cell-preview{border-right:0;border-left:dashed 1px}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-disabled>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){color:var(--mat-datepicker-calendar-date-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-calendar-body-disabled>.mat-calendar-body-today:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){border-color:var(--mat-datepicker-calendar-date-today-disabled-state-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mat-calendar-body-disabled{opacity:.5}}.mat-calendar-body-cell-content{top:5%;left:5%;z-index:1;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;line-height:1;border-width:1px;border-style:solid;border-radius:999px;color:var(--mat-datepicker-calendar-date-text-color, var(--mat-sys-on-surface));border-color:var(--mat-datepicker-calendar-date-outline-color, transparent)}.mat-calendar-body-cell-content.mat-focus-indicator{position:absolute}@media(forced-colors: active){.mat-calendar-body-cell-content{border:none}}.cdk-keyboard-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical),.cdk-program-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){background-color:var(--mat-datepicker-calendar-date-focus-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent))}@media(hover: hover){.mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical){background-color:var(--mat-datepicker-calendar-date-hover-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent))}}.mat-calendar-body-selected{background-color:var(--mat-datepicker-calendar-date-selected-state-background-color, var(--mat-sys-primary));color:var(--mat-datepicker-calendar-date-selected-state-text-color, var(--mat-sys-on-primary))}.mat-calendar-body-disabled>.mat-calendar-body-selected{background-color:var(--mat-datepicker-calendar-date-selected-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-calendar-body-selected.mat-calendar-body-today{box-shadow:inset 0 0 0 1px var(--mat-datepicker-calendar-date-today-selected-state-outline-color, var(--mat-sys-primary))}.mat-calendar-body-in-range::before{background:var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container))}.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range::before{background:var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container))}.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range::before{background:var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container))}.mat-calendar-body-comparison-bridge-start::before,[dir=rtl] .mat-calendar-body-comparison-bridge-end::before{background:linear-gradient(to right, var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container)) 50%, var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container)) 50%)}.mat-calendar-body-comparison-bridge-end::before,[dir=rtl] .mat-calendar-body-comparison-bridge-start::before{background:linear-gradient(to left, var(--mat-datepicker-calendar-date-in-range-state-background-color, var(--mat-sys-primary-container)) 50%, var(--mat-datepicker-calendar-date-in-comparison-range-state-background-color, var(--mat-sys-tertiary-container)) 50%)}.mat-calendar-body-in-range>.mat-calendar-body-comparison-identical,.mat-calendar-body-in-comparison-range.mat-calendar-body-in-range::after{background:var(--mat-datepicker-calendar-date-in-overlap-range-state-background-color, var(--mat-sys-secondary-container))}.mat-calendar-body-comparison-identical.mat-calendar-body-selected,.mat-calendar-body-in-comparison-range>.mat-calendar-body-selected{background:var(--mat-datepicker-calendar-date-in-overlap-range-selected-state-background-color, var(--mat-sys-secondary))}@media(forced-colors: active){.mat-datepicker-popup:not(:empty),.mat-calendar-body-cell:not(.mat-calendar-body-in-range) .mat-calendar-body-selected{outline:solid 1px}.mat-calendar-body-today{outline:dotted 1px}.mat-calendar-body-cell::before,.mat-calendar-body-cell::after,.mat-calendar-body-selected{background:none}.mat-calendar-body-in-range::before,.mat-calendar-body-comparison-bridge-start::before,.mat-calendar-body-comparison-bridge-end::before{border-top:solid 1px;border-bottom:solid 1px}.mat-calendar-body-range-start::before{border-left:solid 1px}[dir=rtl] .mat-calendar-body-range-start::before{border-left:0;border-right:solid 1px}.mat-calendar-body-range-end::before{border-right:solid 1px}[dir=rtl] .mat-calendar-body-range-end::before{border-right:0;border-left:solid 1px}.mat-calendar-body-in-comparison-range::before{border-top:dashed 1px;border-bottom:dashed 1px}.mat-calendar-body-comparison-start::before{border-left:dashed 1px}[dir=rtl] .mat-calendar-body-comparison-start::before{border-left:0;border-right:dashed 1px}.mat-calendar-body-comparison-end::before{border-right:dashed 1px}[dir=rtl] .mat-calendar-body-comparison-end::before{border-right:0;border-left:dashed 1px}}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    label: [{
      type: Input
    }],
    rows: [{
      type: Input
    }],
    todayValue: [{
      type: Input
    }],
    startValue: [{
      type: Input
    }],
    endValue: [{
      type: Input
    }],
    labelMinRequiredCells: [{
      type: Input
    }],
    numCols: [{
      type: Input
    }],
    activeCell: [{
      type: Input
    }],
    isRange: [{
      type: Input
    }],
    cellAspectRatio: [{
      type: Input
    }],
    comparisonStart: [{
      type: Input
    }],
    comparisonEnd: [{
      type: Input
    }],
    previewStart: [{
      type: Input
    }],
    previewEnd: [{
      type: Input
    }],
    startDateAccessibleName: [{
      type: Input
    }],
    endDateAccessibleName: [{
      type: Input
    }],
    selectedValueChange: [{
      type: Output
    }],
    previewChange: [{
      type: Output
    }],
    activeDateChange: [{
      type: Output
    }],
    dragStarted: [{
      type: Output
    }],
    dragEnded: [{
      type: Output
    }]
  }
});
function isTableCell(node) {
  return node?.nodeName === 'TD';
}
function getCellElement(element) {
  let cell;
  if (isTableCell(element)) {
    cell = element;
  } else if (isTableCell(element.parentNode)) {
    cell = element.parentNode;
  } else if (isTableCell(element.parentNode?.parentNode)) {
    cell = element.parentNode.parentNode;
  }
  return cell?.getAttribute('data-mat-row') != null ? cell : null;
}
function isStart(value, start, end) {
  return end !== null && start !== end && value < end && value === start;
}
function isEnd(value, start, end) {
  return start !== null && start !== end && value >= start && value === end;
}
function isInRange(value, start, end, rangeEnabled) {
  return rangeEnabled && start !== null && end !== null && start !== end && value >= start && value <= end;
}
function getActualTouchTarget(event) {
  const touchLocation = event.changedTouches[0];
  return document.elementFromPoint(touchLocation.clientX, touchLocation.clientY);
}

class DateRange {
  start;
  end;
  _disableStructuralEquivalency;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}
class MatDateSelectionModel {
  selection;
  _adapter;
  _selectionChanged = new Subject();
  selectionChanged = this._selectionChanged;
  constructor(selection, _adapter) {
    this.selection = selection;
    this._adapter = _adapter;
    this.selection = selection;
  }
  updateSelection(value, source) {
    const oldValue = this.selection;
    this.selection = value;
    this._selectionChanged.next({
      selection: value,
      source,
      oldValue
    });
  }
  ngOnDestroy() {
    this._selectionChanged.complete();
  }
  _isValidDateInstance(date) {
    return this._adapter.isDateInstance(date) && this._adapter.isValid(date);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDateSelectionModel,
    deps: "invalid",
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDateSelectionModel
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDateSelectionModel,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: undefined
  }, {
    type: DateAdapter
  }]
});
class MatSingleDateSelectionModel extends MatDateSelectionModel {
  constructor(adapter) {
    super(null, adapter);
  }
  add(date) {
    super.updateSelection(date, this);
  }
  isValid() {
    return this.selection != null && this._isValidDateInstance(this.selection);
  }
  isComplete() {
    return this.selection != null;
  }
  clone() {
    const clone = new MatSingleDateSelectionModel(this._adapter);
    clone.updateSelection(this.selection, this);
    return clone;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSingleDateSelectionModel,
    deps: [{
      token: DateAdapter
    }],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatSingleDateSelectionModel
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatSingleDateSelectionModel,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: DateAdapter
  }]
});
class MatRangeDateSelectionModel extends MatDateSelectionModel {
  constructor(adapter) {
    super(new DateRange(null, null), adapter);
  }
  add(date) {
    let {
      start,
      end
    } = this.selection;
    if (start == null) {
      start = date;
    } else if (end == null) {
      end = date;
    } else {
      start = date;
      end = null;
    }
    super.updateSelection(new DateRange(start, end), this);
  }
  isValid() {
    const {
      start,
      end
    } = this.selection;
    if (start == null && end == null) {
      return true;
    }
    if (start != null && end != null) {
      return this._isValidDateInstance(start) && this._isValidDateInstance(end) && this._adapter.compareDate(start, end) <= 0;
    }
    return (start == null || this._isValidDateInstance(start)) && (end == null || this._isValidDateInstance(end));
  }
  isComplete() {
    return this.selection.start != null && this.selection.end != null;
  }
  clone() {
    const clone = new MatRangeDateSelectionModel(this._adapter);
    clone.updateSelection(this.selection, this);
    return clone;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatRangeDateSelectionModel,
    deps: [{
      token: DateAdapter
    }],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatRangeDateSelectionModel
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatRangeDateSelectionModel,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: DateAdapter
  }]
});
const MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER = {
  provide: MatDateSelectionModel,
  useFactory: () => {
    const parent = inject(MatDateSelectionModel, {
      optional: true,
      skipSelf: true
    });
    return parent || new MatSingleDateSelectionModel(inject(DateAdapter));
  }
};
const MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER = {
  provide: MatDateSelectionModel,
  useFactory: () => {
    const parent = inject(MatDateSelectionModel, {
      optional: true,
      skipSelf: true
    });
    return parent || new MatRangeDateSelectionModel(inject(DateAdapter));
  }
};

const MAT_DATE_RANGE_SELECTION_STRATEGY = new InjectionToken('MAT_DATE_RANGE_SELECTION_STRATEGY');
class DefaultMatCalendarRangeStrategy {
  _dateAdapter;
  constructor(_dateAdapter) {
    this._dateAdapter = _dateAdapter;
  }
  selectionFinished(date, currentRange) {
    let {
      start,
      end
    } = currentRange;
    if (start == null) {
      start = date;
    } else if (end == null && date && this._dateAdapter.compareDate(date, start) >= 0) {
      end = date;
    } else {
      start = date;
      end = null;
    }
    return new DateRange(start, end);
  }
  createPreview(activeDate, currentRange) {
    let start = null;
    let end = null;
    if (currentRange.start && !currentRange.end && activeDate) {
      start = currentRange.start;
      end = activeDate;
    }
    return new DateRange(start, end);
  }
  createDrag(dragOrigin, originalRange, newDate) {
    let start = originalRange.start;
    let end = originalRange.end;
    if (!start || !end) {
      return null;
    }
    const adapter = this._dateAdapter;
    const isRange = adapter.compareDate(start, end) !== 0;
    const diffYears = adapter.getYear(newDate) - adapter.getYear(dragOrigin);
    const diffMonths = adapter.getMonth(newDate) - adapter.getMonth(dragOrigin);
    const diffDays = adapter.getDate(newDate) - adapter.getDate(dragOrigin);
    if (isRange && adapter.sameDate(dragOrigin, originalRange.start)) {
      start = newDate;
      if (adapter.compareDate(newDate, end) > 0) {
        end = adapter.addCalendarYears(end, diffYears);
        end = adapter.addCalendarMonths(end, diffMonths);
        end = adapter.addCalendarDays(end, diffDays);
      }
    } else if (isRange && adapter.sameDate(dragOrigin, originalRange.end)) {
      end = newDate;
      if (adapter.compareDate(newDate, start) < 0) {
        start = adapter.addCalendarYears(start, diffYears);
        start = adapter.addCalendarMonths(start, diffMonths);
        start = adapter.addCalendarDays(start, diffDays);
      }
    } else {
      start = adapter.addCalendarYears(start, diffYears);
      start = adapter.addCalendarMonths(start, diffMonths);
      start = adapter.addCalendarDays(start, diffDays);
      end = adapter.addCalendarYears(end, diffYears);
      end = adapter.addCalendarMonths(end, diffMonths);
      end = adapter.addCalendarDays(end, diffDays);
    }
    return new DateRange(start, end);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: DefaultMatCalendarRangeStrategy,
    deps: [{
      token: DateAdapter
    }],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: DefaultMatCalendarRangeStrategy
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: DefaultMatCalendarRangeStrategy,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: DateAdapter
  }]
});

const DAYS_PER_WEEK = 7;
let uniqueIdCounter = 0;
class MatMonthView {
  _changeDetectorRef = inject(ChangeDetectorRef);
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dir = inject(Directionality, {
    optional: true
  });
  _rangeStrategy = inject(MAT_DATE_RANGE_SELECTION_STRATEGY, {
    optional: true
  });
  _rerenderSubscription = Subscription.EMPTY;
  _selectionKeyPressed;
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    const oldActiveDate = this._activeDate;
    const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
    if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
      this._init();
    }
  }
  _activeDate;
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    this._setRanges(this._selected);
  }
  _selected;
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _minDate;
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _maxDate;
  dateFilter;
  dateClass;
  comparisonStart;
  comparisonEnd;
  startDateAccessibleName;
  endDateAccessibleName;
  activeDrag = null;
  selectedChange = new EventEmitter();
  _userSelection = new EventEmitter();
  dragStarted = new EventEmitter();
  dragEnded = new EventEmitter();
  activeDateChange = new EventEmitter();
  _matCalendarBody;
  _monthLabel = signal('', ...(ngDevMode ? [{
    debugName: "_monthLabel"
  }] : []));
  _weeks = signal([], ...(ngDevMode ? [{
    debugName: "_weeks"
  }] : []));
  _firstWeekOffset = signal(0, ...(ngDevMode ? [{
    debugName: "_firstWeekOffset"
  }] : []));
  _rangeStart = signal(null, ...(ngDevMode ? [{
    debugName: "_rangeStart"
  }] : []));
  _rangeEnd = signal(null, ...(ngDevMode ? [{
    debugName: "_rangeEnd"
  }] : []));
  _comparisonRangeStart = signal(null, ...(ngDevMode ? [{
    debugName: "_comparisonRangeStart"
  }] : []));
  _comparisonRangeEnd = signal(null, ...(ngDevMode ? [{
    debugName: "_comparisonRangeEnd"
  }] : []));
  _previewStart = signal(null, ...(ngDevMode ? [{
    debugName: "_previewStart"
  }] : []));
  _previewEnd = signal(null, ...(ngDevMode ? [{
    debugName: "_previewEnd"
  }] : []));
  _isRange = signal(false, ...(ngDevMode ? [{
    debugName: "_isRange"
  }] : []));
  _todayDate = signal(null, ...(ngDevMode ? [{
    debugName: "_todayDate"
  }] : []));
  _weekdays = signal([], ...(ngDevMode ? [{
    debugName: "_weekdays"
  }] : []));
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }
      if (!this._dateFormats) {
        throw createMissingDateImplError('MAT_DATE_FORMATS');
      }
    }
    this._activeDate = this._dateAdapter.today();
  }
  ngAfterContentInit() {
    this._rerenderSubscription = this._dateAdapter.localeChanges.pipe(startWith(null)).subscribe(() => this._init());
  }
  ngOnChanges(changes) {
    const comparisonChange = changes['comparisonStart'] || changes['comparisonEnd'];
    if (comparisonChange && !comparisonChange.firstChange) {
      this._setRanges(this.selected);
    }
    if (changes['activeDrag'] && !this.activeDrag) {
      this._clearPreview();
    }
  }
  ngOnDestroy() {
    this._rerenderSubscription.unsubscribe();
  }
  _dateSelected(event) {
    const date = event.value;
    const selectedDate = this._getDateFromDayOfMonth(date);
    let rangeStartDate;
    let rangeEndDate;
    if (this._selected instanceof DateRange) {
      rangeStartDate = this._getDateInCurrentMonth(this._selected.start);
      rangeEndDate = this._getDateInCurrentMonth(this._selected.end);
    } else {
      rangeStartDate = rangeEndDate = this._getDateInCurrentMonth(this._selected);
    }
    if (rangeStartDate !== date || rangeEndDate !== date) {
      this.selectedChange.emit(selectedDate);
    }
    this._userSelection.emit({
      value: selectedDate,
      event: event.event
    });
    this._clearPreview();
    this._changeDetectorRef.markForCheck();
  }
  _updateActiveDate(event) {
    const month = event.value;
    const oldActiveDate = this._activeDate;
    this.activeDate = this._getDateFromDayOfMonth(month);
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this._activeDate);
    }
  }
  _handleCalendarBodyKeydown(event) {
    const oldActiveDate = this._activeDate;
    const isRtl = this._isRtl();
    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? -1 : 1);
        break;
      case UP_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
        break;
      case HOME:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
        break;
      case END:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, this._dateAdapter.getNumDaysInMonth(this._activeDate) - this._dateAdapter.getDate(this._activeDate));
        break;
      case PAGE_UP:
        this.activeDate = event.altKey ? this._dateAdapter.addCalendarYears(this._activeDate, -1) : this._dateAdapter.addCalendarMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this.activeDate = event.altKey ? this._dateAdapter.addCalendarYears(this._activeDate, 1) : this._dateAdapter.addCalendarMonths(this._activeDate, 1);
        break;
      case ENTER:
      case SPACE:
        this._selectionKeyPressed = true;
        if (this._canSelect(this._activeDate)) {
          event.preventDefault();
        }
        return;
      case ESCAPE:
        if (this._previewEnd() != null && !hasModifierKey(event)) {
          this._clearPreview();
          if (this.activeDrag) {
            this.dragEnded.emit({
              value: null,
              event
            });
          } else {
            this.selectedChange.emit(null);
            this._userSelection.emit({
              value: null,
              event
            });
          }
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      default:
        return;
    }
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
      this._focusActiveCellAfterViewChecked();
    }
    event.preventDefault();
  }
  _handleCalendarBodyKeyup(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      if (this._selectionKeyPressed && this._canSelect(this._activeDate)) {
        this._dateSelected({
          value: this._dateAdapter.getDate(this._activeDate),
          event
        });
      }
      this._selectionKeyPressed = false;
    }
  }
  _init() {
    this._setRanges(this.selected);
    this._todayDate.set(this._getCellCompareValue(this._dateAdapter.today()));
    this._monthLabel.set(this._dateFormats.display.monthLabel ? this._dateAdapter.format(this.activeDate, this._dateFormats.display.monthLabel) : this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)].toLocaleUpperCase());
    let firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
    this._firstWeekOffset.set((DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) - this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK);
    this._initWeekdays();
    this._createWeekCells();
    this._changeDetectorRef.markForCheck();
  }
  _focusActiveCell(movePreview) {
    this._matCalendarBody._focusActiveCell(movePreview);
  }
  _focusActiveCellAfterViewChecked() {
    this._matCalendarBody._scheduleFocusActiveCellAfterViewChecked();
  }
  _previewChanged({
    event,
    value: cell
  }) {
    if (this._rangeStrategy) {
      const value = cell ? cell.rawValue : null;
      const previewRange = this._rangeStrategy.createPreview(value, this.selected, event);
      this._previewStart.set(this._getCellCompareValue(previewRange.start));
      this._previewEnd.set(this._getCellCompareValue(previewRange.end));
      if (this.activeDrag && value) {
        const dragRange = this._rangeStrategy.createDrag?.(this.activeDrag.value, this.selected, value, event);
        if (dragRange) {
          this._previewStart.set(this._getCellCompareValue(dragRange.start));
          this._previewEnd.set(this._getCellCompareValue(dragRange.end));
        }
      }
    }
  }
  _dragEnded(event) {
    if (!this.activeDrag) return;
    if (event.value) {
      const dragDropResult = this._rangeStrategy?.createDrag?.(this.activeDrag.value, this.selected, event.value, event.event);
      this.dragEnded.emit({
        value: dragDropResult ?? null,
        event: event.event
      });
    } else {
      this.dragEnded.emit({
        value: null,
        event: event.event
      });
    }
  }
  _getDateFromDayOfMonth(dayOfMonth) {
    return this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), dayOfMonth);
  }
  _initWeekdays() {
    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
    const weekdays = longWeekdays.map((long, i) => {
      return {
        long,
        narrow: narrowWeekdays[i],
        id: uniqueIdCounter++
      };
    });
    this._weekdays.set(weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek)));
  }
  _createWeekCells() {
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
    const dateNames = this._dateAdapter.getDateNames();
    const weeks = [[]];
    for (let i = 0, cell = this._firstWeekOffset(); i < daysInMonth; i++, cell++) {
      if (cell == DAYS_PER_WEEK) {
        weeks.push([]);
        cell = 0;
      }
      const date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
      const enabled = this._shouldEnableDate(date);
      const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
      const cellClasses = this.dateClass ? this.dateClass(date, 'month') : undefined;
      weeks[weeks.length - 1].push(new MatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses, this._getCellCompareValue(date), date));
    }
    this._weeks.set(weeks);
  }
  _shouldEnableDate(date) {
    return !!date && (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) && (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0) && (!this.dateFilter || this.dateFilter(date));
  }
  _getDateInCurrentMonth(date) {
    return date && this._hasSameMonthAndYear(date, this.activeDate) ? this._dateAdapter.getDate(date) : null;
  }
  _hasSameMonthAndYear(d1, d2) {
    return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) && this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
  }
  _getCellCompareValue(date) {
    if (date) {
      const year = this._dateAdapter.getYear(date);
      const month = this._dateAdapter.getMonth(date);
      const day = this._dateAdapter.getDate(date);
      return new Date(year, month, day).getTime();
    }
    return null;
  }
  _isRtl() {
    return this._dir && this._dir.value === 'rtl';
  }
  _setRanges(selectedValue) {
    if (selectedValue instanceof DateRange) {
      this._rangeStart.set(this._getCellCompareValue(selectedValue.start));
      this._rangeEnd.set(this._getCellCompareValue(selectedValue.end));
      this._isRange.set(true);
    } else {
      this._rangeStart.set(this._getCellCompareValue(selectedValue));
      this._rangeEnd.set(this._rangeStart());
      this._isRange.set(false);
    }
    this._comparisonRangeStart.set(this._getCellCompareValue(this.comparisonStart));
    this._comparisonRangeEnd.set(this._getCellCompareValue(this.comparisonEnd));
  }
  _canSelect(date) {
    return !this.dateFilter || this.dateFilter(date);
  }
  _clearPreview() {
    this._previewStart.set(null);
    this._previewEnd.set(null);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatMonthView,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatMonthView,
    isStandalone: true,
    selector: "mat-month-view",
    inputs: {
      activeDate: "activeDate",
      selected: "selected",
      minDate: "minDate",
      maxDate: "maxDate",
      dateFilter: "dateFilter",
      dateClass: "dateClass",
      comparisonStart: "comparisonStart",
      comparisonEnd: "comparisonEnd",
      startDateAccessibleName: "startDateAccessibleName",
      endDateAccessibleName: "endDateAccessibleName",
      activeDrag: "activeDrag"
    },
    outputs: {
      selectedChange: "selectedChange",
      _userSelection: "_userSelection",
      dragStarted: "dragStarted",
      dragEnded: "dragEnded",
      activeDateChange: "activeDateChange"
    },
    viewQueries: [{
      propertyName: "_matCalendarBody",
      first: true,
      predicate: MatCalendarBody,
      descendants: true
    }],
    exportAs: ["matMonthView"],
    usesOnChanges: true,
    ngImport: i0,
    template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      @for (day of _weekdays(); track day.id) {\n        <th scope=\"col\">\n          <span class=\"cdk-visually-hidden\">{{day.long}}</span>\n          <span aria-hidden=\"true\">{{day.narrow}}</span>\n        </th>\n      }\n    </tr>\n    <tr aria-hidden=\"true\"><th class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel()\"\n         [rows]=\"_weeks()\"\n         [todayValue]=\"_todayDate()!\"\n         [startValue]=\"_rangeStart()!\"\n         [endValue]=\"_rangeEnd()!\"\n         [comparisonStart]=\"_comparisonRangeStart()\"\n         [comparisonEnd]=\"_comparisonRangeEnd()\"\n         [previewStart]=\"_previewStart()\"\n         [previewEnd]=\"_previewEnd()\"\n         [isRange]=\"_isRange()\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         [startDateAccessibleName]=\"startDateAccessibleName\"\n         [endDateAccessibleName]=\"endDateAccessibleName\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (dragStarted)=\"dragStarted.emit($event)\"\n         (dragEnded)=\"_dragEnded($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
    dependencies: [{
      kind: "component",
      type: MatCalendarBody,
      selector: "[mat-calendar-body]",
      inputs: ["label", "rows", "todayValue", "startValue", "endValue", "labelMinRequiredCells", "numCols", "activeCell", "isRange", "cellAspectRatio", "comparisonStart", "comparisonEnd", "previewStart", "previewEnd", "startDateAccessibleName", "endDateAccessibleName"],
      outputs: ["selectedValueChange", "previewChange", "activeDateChange", "dragStarted", "dragEnded"],
      exportAs: ["matCalendarBody"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatMonthView,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-month-view',
      exportAs: 'matMonthView',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatCalendarBody],
      template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead class=\"mat-calendar-table-header\">\n    <tr>\n      @for (day of _weekdays(); track day.id) {\n        <th scope=\"col\">\n          <span class=\"cdk-visually-hidden\">{{day.long}}</span>\n          <span aria-hidden=\"true\">{{day.narrow}}</span>\n        </th>\n      }\n    </tr>\n    <tr aria-hidden=\"true\"><th class=\"mat-calendar-table-header-divider\" colspan=\"7\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_monthLabel()\"\n         [rows]=\"_weeks()\"\n         [todayValue]=\"_todayDate()!\"\n         [startValue]=\"_rangeStart()!\"\n         [endValue]=\"_rangeEnd()!\"\n         [comparisonStart]=\"_comparisonRangeStart()\"\n         [comparisonEnd]=\"_comparisonRangeEnd()\"\n         [previewStart]=\"_previewStart()\"\n         [previewEnd]=\"_previewEnd()\"\n         [isRange]=\"_isRange()\"\n         [labelMinRequiredCells]=\"3\"\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\n         [startDateAccessibleName]=\"startDateAccessibleName\"\n         [endDateAccessibleName]=\"endDateAccessibleName\"\n         (selectedValueChange)=\"_dateSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (previewChange)=\"_previewChanged($event)\"\n         (dragStarted)=\"dragStarted.emit($event)\"\n         (dragEnded)=\"_dragEnded($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n"
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    activeDate: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    minDate: [{
      type: Input
    }],
    maxDate: [{
      type: Input
    }],
    dateFilter: [{
      type: Input
    }],
    dateClass: [{
      type: Input
    }],
    comparisonStart: [{
      type: Input
    }],
    comparisonEnd: [{
      type: Input
    }],
    startDateAccessibleName: [{
      type: Input
    }],
    endDateAccessibleName: [{
      type: Input
    }],
    activeDrag: [{
      type: Input
    }],
    selectedChange: [{
      type: Output
    }],
    _userSelection: [{
      type: Output
    }],
    dragStarted: [{
      type: Output
    }],
    dragEnded: [{
      type: Output
    }],
    activeDateChange: [{
      type: Output
    }],
    _matCalendarBody: [{
      type: ViewChild,
      args: [MatCalendarBody]
    }]
  }
});

const yearsPerPage = 24;
const yearsPerRow = 4;
class MatMultiYearView {
  _changeDetectorRef = inject(ChangeDetectorRef);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dir = inject(Directionality, {
    optional: true
  });
  _rerenderSubscription = Subscription.EMPTY;
  _selectionKeyPressed;
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
    if (!isSameMultiYearView(this._dateAdapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
      this._init();
    }
  }
  _activeDate;
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    this._setSelectedYear(value);
  }
  _selected;
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _minDate;
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _maxDate;
  dateFilter;
  dateClass;
  selectedChange = new EventEmitter();
  yearSelected = new EventEmitter();
  activeDateChange = new EventEmitter();
  _matCalendarBody;
  _years = signal([], ...(ngDevMode ? [{
    debugName: "_years"
  }] : []));
  _todayYear = signal(0, ...(ngDevMode ? [{
    debugName: "_todayYear"
  }] : []));
  _selectedYear = signal(null, ...(ngDevMode ? [{
    debugName: "_selectedYear"
  }] : []));
  constructor() {
    if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw createMissingDateImplError('DateAdapter');
    }
    this._activeDate = this._dateAdapter.today();
  }
  ngAfterContentInit() {
    this._rerenderSubscription = this._dateAdapter.localeChanges.pipe(startWith(null)).subscribe(() => this._init());
  }
  ngOnDestroy() {
    this._rerenderSubscription.unsubscribe();
  }
  _init() {
    this._todayYear.set(this._dateAdapter.getYear(this._dateAdapter.today()));
    const activeYear = this._dateAdapter.getYear(this._activeDate);
    const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
    const years = [];
    for (let i = 0, row = []; i < yearsPerPage; i++) {
      row.push(minYearOfPage + i);
      if (row.length == yearsPerRow) {
        years.push(row.map(year => this._createCellForYear(year)));
        row = [];
      }
    }
    this._years.set(years);
    this._changeDetectorRef.markForCheck();
  }
  _yearSelected(event) {
    const year = event.value;
    const selectedYear = this._dateAdapter.createDate(year, 0, 1);
    const selectedDate = this._getDateFromYear(year);
    this.yearSelected.emit(selectedYear);
    this.selectedChange.emit(selectedDate);
  }
  _updateActiveDate(event) {
    const year = event.value;
    const oldActiveDate = this._activeDate;
    this.activeDate = this._getDateFromYear(year);
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
    }
  }
  _handleCalendarBodyKeydown(event) {
    const oldActiveDate = this._activeDate;
    const isRtl = this._isRtl();
    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? -1 : 1);
        break;
      case UP_ARROW:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -yearsPerRow);
        break;
      case DOWN_ARROW:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerRow);
        break;
      case HOME:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate));
        break;
      case END:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerPage - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate) - 1);
        break;
      case PAGE_UP:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
        break;
      case PAGE_DOWN:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
        break;
      case ENTER:
      case SPACE:
        this._selectionKeyPressed = true;
        break;
      default:
        return;
    }
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
    }
    this._focusActiveCellAfterViewChecked();
    event.preventDefault();
  }
  _handleCalendarBodyKeyup(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      if (this._selectionKeyPressed) {
        this._yearSelected({
          value: this._dateAdapter.getYear(this._activeDate),
          event
        });
      }
      this._selectionKeyPressed = false;
    }
  }
  _getActiveCell() {
    return getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
  }
  _focusActiveCell() {
    this._matCalendarBody._focusActiveCell();
  }
  _focusActiveCellAfterViewChecked() {
    this._matCalendarBody._scheduleFocusActiveCellAfterViewChecked();
  }
  _getDateFromYear(year) {
    const activeMonth = this._dateAdapter.getMonth(this.activeDate);
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, activeMonth, 1));
    const normalizedDate = this._dateAdapter.createDate(year, activeMonth, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth));
    return normalizedDate;
  }
  _createCellForYear(year) {
    const date = this._dateAdapter.createDate(year, 0, 1);
    const yearName = this._dateAdapter.getYearName(date);
    const cellClasses = this.dateClass ? this.dateClass(date, 'multi-year') : undefined;
    return new MatCalendarCell(year, yearName, yearName, this._shouldEnableYear(year), cellClasses);
  }
  _shouldEnableYear(year) {
    if (year === undefined || year === null || this.maxDate && year > this._dateAdapter.getYear(this.maxDate) || this.minDate && year < this._dateAdapter.getYear(this.minDate)) {
      return false;
    }
    if (!this.dateFilter) {
      return true;
    }
    const firstOfYear = this._dateAdapter.createDate(year, 0, 1);
    for (let date = firstOfYear; this._dateAdapter.getYear(date) == year; date = this._dateAdapter.addCalendarDays(date, 1)) {
      if (this.dateFilter(date)) {
        return true;
      }
    }
    return false;
  }
  _isRtl() {
    return this._dir && this._dir.value === 'rtl';
  }
  _setSelectedYear(value) {
    this._selectedYear.set(null);
    if (value instanceof DateRange) {
      const displayValue = value.start || value.end;
      if (displayValue) {
        this._selectedYear.set(this._dateAdapter.getYear(displayValue));
      }
    } else if (value) {
      this._selectedYear.set(this._dateAdapter.getYear(value));
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatMultiYearView,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatMultiYearView,
    isStandalone: true,
    selector: "mat-multi-year-view",
    inputs: {
      activeDate: "activeDate",
      selected: "selected",
      minDate: "minDate",
      maxDate: "maxDate",
      dateFilter: "dateFilter",
      dateClass: "dateClass"
    },
    outputs: {
      selectedChange: "selectedChange",
      yearSelected: "yearSelected",
      activeDateChange: "activeDateChange"
    },
    viewQueries: [{
      propertyName: "_matCalendarBody",
      first: true,
      predicate: MatCalendarBody,
      descendants: true
    }],
    exportAs: ["matMultiYearView"],
    ngImport: i0,
    template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead aria-hidden=\"true\" class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [rows]=\"_years()\"\n         [todayValue]=\"_todayYear()\"\n         [startValue]=\"_selectedYear()!\"\n         [endValue]=\"_selectedYear()!\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_getActiveCell()\"\n         (selectedValueChange)=\"_yearSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
    dependencies: [{
      kind: "component",
      type: MatCalendarBody,
      selector: "[mat-calendar-body]",
      inputs: ["label", "rows", "todayValue", "startValue", "endValue", "labelMinRequiredCells", "numCols", "activeCell", "isRange", "cellAspectRatio", "comparisonStart", "comparisonEnd", "previewStart", "previewEnd", "startDateAccessibleName", "endDateAccessibleName"],
      outputs: ["selectedValueChange", "previewChange", "activeDateChange", "dragStarted", "dragEnded"],
      exportAs: ["matCalendarBody"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatMultiYearView,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-multi-year-view',
      exportAs: 'matMultiYearView',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatCalendarBody],
      template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead aria-hidden=\"true\" class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [rows]=\"_years()\"\n         [todayValue]=\"_todayYear()\"\n         [startValue]=\"_selectedYear()!\"\n         [endValue]=\"_selectedYear()!\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_getActiveCell()\"\n         (selectedValueChange)=\"_yearSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n"
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    activeDate: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    minDate: [{
      type: Input
    }],
    maxDate: [{
      type: Input
    }],
    dateFilter: [{
      type: Input
    }],
    dateClass: [{
      type: Input
    }],
    selectedChange: [{
      type: Output
    }],
    yearSelected: [{
      type: Output
    }],
    activeDateChange: [{
      type: Output
    }],
    _matCalendarBody: [{
      type: ViewChild,
      args: [MatCalendarBody]
    }]
  }
});
function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
  const year1 = dateAdapter.getYear(date1);
  const year2 = dateAdapter.getYear(date2);
  const startingYear = getStartingYear(dateAdapter, minDate, maxDate);
  return Math.floor((year1 - startingYear) / yearsPerPage) === Math.floor((year2 - startingYear) / yearsPerPage);
}
function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
  const activeYear = dateAdapter.getYear(activeDate);
  return euclideanModulo(activeYear - getStartingYear(dateAdapter, minDate, maxDate), yearsPerPage);
}
function getStartingYear(dateAdapter, minDate, maxDate) {
  let startingYear = 0;
  if (maxDate) {
    const maxYear = dateAdapter.getYear(maxDate);
    startingYear = maxYear - yearsPerPage + 1;
  } else if (minDate) {
    startingYear = dateAdapter.getYear(minDate);
  }
  return startingYear;
}
function euclideanModulo(a, b) {
  return (a % b + b) % b;
}

class MatYearView {
  _changeDetectorRef = inject(ChangeDetectorRef);
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dir = inject(Directionality, {
    optional: true
  });
  _rerenderSubscription = Subscription.EMPTY;
  _selectionKeyPressed;
  get activeDate() {
    return this._activeDate;
  }
  set activeDate(value) {
    let oldActiveDate = this._activeDate;
    const validDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
    if (this._dateAdapter.getYear(oldActiveDate) !== this._dateAdapter.getYear(this._activeDate)) {
      this._init();
    }
  }
  _activeDate;
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    this._setSelectedMonth(value);
  }
  _selected;
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _minDate;
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _maxDate;
  dateFilter;
  dateClass;
  selectedChange = new EventEmitter();
  monthSelected = new EventEmitter();
  activeDateChange = new EventEmitter();
  _matCalendarBody;
  _months = signal([], ...(ngDevMode ? [{
    debugName: "_months"
  }] : []));
  _yearLabel = signal('', ...(ngDevMode ? [{
    debugName: "_yearLabel"
  }] : []));
  _todayMonth = signal(null, ...(ngDevMode ? [{
    debugName: "_todayMonth"
  }] : []));
  _selectedMonth = signal(null, ...(ngDevMode ? [{
    debugName: "_selectedMonth"
  }] : []));
  constructor() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }
      if (!this._dateFormats) {
        throw createMissingDateImplError('MAT_DATE_FORMATS');
      }
    }
    this._activeDate = this._dateAdapter.today();
  }
  ngAfterContentInit() {
    this._rerenderSubscription = this._dateAdapter.localeChanges.pipe(startWith(null)).subscribe(() => this._init());
  }
  ngOnDestroy() {
    this._rerenderSubscription.unsubscribe();
  }
  _monthSelected(event) {
    const month = event.value;
    const selectedMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
    this.monthSelected.emit(selectedMonth);
    const selectedDate = this._getDateFromMonth(month);
    this.selectedChange.emit(selectedDate);
  }
  _updateActiveDate(event) {
    const month = event.value;
    const oldActiveDate = this._activeDate;
    this.activeDate = this._getDateFromMonth(month);
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
    }
  }
  _handleCalendarBodyKeydown(event) {
    const oldActiveDate = this._activeDate;
    const isRtl = this._isRtl();
    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? 1 : -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? -1 : 1);
        break;
      case UP_ARROW:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -4);
        break;
      case DOWN_ARROW:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 4);
        break;
      case HOME:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
        break;
      case END:
        this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
        break;
      case PAGE_UP:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
        break;
      case PAGE_DOWN:
        this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
        break;
      case ENTER:
      case SPACE:
        this._selectionKeyPressed = true;
        break;
      default:
        return;
    }
    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
      this._focusActiveCellAfterViewChecked();
    }
    event.preventDefault();
  }
  _handleCalendarBodyKeyup(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      if (this._selectionKeyPressed) {
        this._monthSelected({
          value: this._dateAdapter.getMonth(this._activeDate),
          event
        });
      }
      this._selectionKeyPressed = false;
    }
  }
  _init() {
    this._setSelectedMonth(this.selected);
    this._todayMonth.set(this._getMonthInCurrentYear(this._dateAdapter.today()));
    this._yearLabel.set(this._dateAdapter.getYearName(this.activeDate));
    let monthNames = this._dateAdapter.getMonthNames('short');
    this._months.set([[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(row => row.map(month => this._createCellForMonth(month, monthNames[month]))));
    this._changeDetectorRef.markForCheck();
  }
  _focusActiveCell() {
    this._matCalendarBody._focusActiveCell();
  }
  _focusActiveCellAfterViewChecked() {
    this._matCalendarBody._scheduleFocusActiveCellAfterViewChecked();
  }
  _getMonthInCurrentYear(date) {
    return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ? this._dateAdapter.getMonth(date) : null;
  }
  _getDateFromMonth(month) {
    const normalizedDate = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(normalizedDate);
    return this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth));
  }
  _createCellForMonth(month, monthName) {
    const date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
    const ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.monthYearA11yLabel);
    const cellClasses = this.dateClass ? this.dateClass(date, 'year') : undefined;
    return new MatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._shouldEnableMonth(month), cellClasses);
  }
  _shouldEnableMonth(month) {
    const activeYear = this._dateAdapter.getYear(this.activeDate);
    if (month === undefined || month === null || this._isYearAndMonthAfterMaxDate(activeYear, month) || this._isYearAndMonthBeforeMinDate(activeYear, month)) {
      return false;
    }
    if (!this.dateFilter) {
      return true;
    }
    const firstOfMonth = this._dateAdapter.createDate(activeYear, month, 1);
    for (let date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
      if (this.dateFilter(date)) {
        return true;
      }
    }
    return false;
  }
  _isYearAndMonthAfterMaxDate(year, month) {
    if (this.maxDate) {
      const maxYear = this._dateAdapter.getYear(this.maxDate);
      const maxMonth = this._dateAdapter.getMonth(this.maxDate);
      return year > maxYear || year === maxYear && month > maxMonth;
    }
    return false;
  }
  _isYearAndMonthBeforeMinDate(year, month) {
    if (this.minDate) {
      const minYear = this._dateAdapter.getYear(this.minDate);
      const minMonth = this._dateAdapter.getMonth(this.minDate);
      return year < minYear || year === minYear && month < minMonth;
    }
    return false;
  }
  _isRtl() {
    return this._dir && this._dir.value === 'rtl';
  }
  _setSelectedMonth(value) {
    if (value instanceof DateRange) {
      this._selectedMonth.set(this._getMonthInCurrentYear(value.start) || this._getMonthInCurrentYear(value.end));
    } else {
      this._selectedMonth.set(this._getMonthInCurrentYear(value));
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatYearView,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatYearView,
    isStandalone: true,
    selector: "mat-year-view",
    inputs: {
      activeDate: "activeDate",
      selected: "selected",
      minDate: "minDate",
      maxDate: "maxDate",
      dateFilter: "dateFilter",
      dateClass: "dateClass"
    },
    outputs: {
      selectedChange: "selectedChange",
      monthSelected: "monthSelected",
      activeDateChange: "activeDateChange"
    },
    viewQueries: [{
      propertyName: "_matCalendarBody",
      first: true,
      predicate: MatCalendarBody,
      descendants: true
    }],
    exportAs: ["matYearView"],
    ngImport: i0,
    template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead aria-hidden=\"true\" class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_yearLabel()\"\n         [rows]=\"_months()\"\n         [todayValue]=\"_todayMonth()!\"\n         [startValue]=\"_selectedMonth()!\"\n         [endValue]=\"_selectedMonth()!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_dateAdapter.getMonth(activeDate)\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n",
    dependencies: [{
      kind: "component",
      type: MatCalendarBody,
      selector: "[mat-calendar-body]",
      inputs: ["label", "rows", "todayValue", "startValue", "endValue", "labelMinRequiredCells", "numCols", "activeCell", "isRange", "cellAspectRatio", "comparisonStart", "comparisonEnd", "previewStart", "previewEnd", "startDateAccessibleName", "endDateAccessibleName"],
      outputs: ["selectedValueChange", "previewChange", "activeDateChange", "dragStarted", "dragEnded"],
      exportAs: ["matCalendarBody"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatYearView,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-year-view',
      exportAs: 'matYearView',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatCalendarBody],
      template: "<table class=\"mat-calendar-table\" role=\"grid\">\n  <thead aria-hidden=\"true\" class=\"mat-calendar-table-header\">\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\n  </thead>\n  <tbody mat-calendar-body\n         [label]=\"_yearLabel()\"\n         [rows]=\"_months()\"\n         [todayValue]=\"_todayMonth()!\"\n         [startValue]=\"_selectedMonth()!\"\n         [endValue]=\"_selectedMonth()!\"\n         [labelMinRequiredCells]=\"2\"\n         [numCols]=\"4\"\n         [cellAspectRatio]=\"4 / 7\"\n         [activeCell]=\"_dateAdapter.getMonth(activeDate)\"\n         (selectedValueChange)=\"_monthSelected($event)\"\n         (activeDateChange)=\"_updateActiveDate($event)\"\n         (keyup)=\"_handleCalendarBodyKeyup($event)\"\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\n  </tbody>\n</table>\n"
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    activeDate: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    minDate: [{
      type: Input
    }],
    maxDate: [{
      type: Input
    }],
    dateFilter: [{
      type: Input
    }],
    dateClass: [{
      type: Input
    }],
    selectedChange: [{
      type: Output
    }],
    monthSelected: [{
      type: Output
    }],
    activeDateChange: [{
      type: Output
    }],
    _matCalendarBody: [{
      type: ViewChild,
      args: [MatCalendarBody]
    }]
  }
});

class MatCalendarHeader {
  _intl = inject(MatDatepickerIntl);
  calendar = inject(MatCalendar);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _periodButtonText;
  _periodButtonDescription;
  _periodButtonLabel;
  _prevButtonLabel;
  _nextButtonLabel;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
    const changeDetectorRef = inject(ChangeDetectorRef);
    this._updateLabels();
    this.calendar.stateChanges.subscribe(() => {
      this._updateLabels();
      changeDetectorRef.markForCheck();
    });
  }
  get periodButtonText() {
    return this._periodButtonText;
  }
  get periodButtonDescription() {
    return this._periodButtonDescription;
  }
  get periodButtonLabel() {
    return this._periodButtonLabel;
  }
  get prevButtonLabel() {
    return this._prevButtonLabel;
  }
  get nextButtonLabel() {
    return this._nextButtonLabel;
  }
  currentPeriodClicked() {
    this.calendar.currentView = this.calendar.currentView == 'month' ? 'multi-year' : 'month';
  }
  previousClicked() {
    if (this.previousEnabled()) {
      this.calendar.activeDate = this.calendar.currentView == 'month' ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) : this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
    }
  }
  nextClicked() {
    if (this.nextEnabled()) {
      this.calendar.activeDate = this.calendar.currentView == 'month' ? this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) : this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
    }
  }
  previousEnabled() {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate || !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
  }
  nextEnabled() {
    return !this.calendar.maxDate || !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
  }
  _updateLabels() {
    const calendar = this.calendar;
    const intl = this._intl;
    const adapter = this._dateAdapter;
    if (calendar.currentView === 'month') {
      this._periodButtonText = adapter.format(calendar.activeDate, this._dateFormats.display.monthYearLabel).toLocaleUpperCase();
      this._periodButtonDescription = adapter.format(calendar.activeDate, this._dateFormats.display.monthYearLabel).toLocaleUpperCase();
      this._periodButtonLabel = intl.switchToMultiYearViewLabel;
      this._prevButtonLabel = intl.prevMonthLabel;
      this._nextButtonLabel = intl.nextMonthLabel;
    } else if (calendar.currentView === 'year') {
      this._periodButtonText = adapter.getYearName(calendar.activeDate);
      this._periodButtonDescription = adapter.getYearName(calendar.activeDate);
      this._periodButtonLabel = intl.switchToMonthViewLabel;
      this._prevButtonLabel = intl.prevYearLabel;
      this._nextButtonLabel = intl.nextYearLabel;
    } else {
      this._periodButtonText = intl.formatYearRange(...this._formatMinAndMaxYearLabels());
      this._periodButtonDescription = intl.formatYearRangeLabel(...this._formatMinAndMaxYearLabels());
      this._periodButtonLabel = intl.switchToMonthViewLabel;
      this._prevButtonLabel = intl.prevMultiYearLabel;
      this._nextButtonLabel = intl.nextMultiYearLabel;
    }
  }
  _isSameView(date1, date2) {
    if (this.calendar.currentView == 'month') {
      return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) && this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
    }
    if (this.calendar.currentView == 'year') {
      return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    }
    return isSameMultiYearView(this._dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
  }
  _formatMinAndMaxYearLabels() {
    const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
    const minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
    const maxYearOfPage = minYearOfPage + yearsPerPage - 1;
    const minYearLabel = this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1));
    const maxYearLabel = this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
    return [minYearLabel, maxYearLabel];
  }
  _periodButtonLabelId = inject(_IdGenerator).getId('mat-calendar-period-label-');
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatCalendarHeader,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatCalendarHeader,
    isStandalone: true,
    selector: "mat-calendar-header",
    exportAs: ["matCalendarHeader"],
    ngImport: i0,
    template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <!-- [Firefox Issue: https://bugzilla.mozilla.org/show_bug.cgi?id=1880533]\n      Relocated label next to related button and made visually hidden via cdk-visually-hidden\n      to enable label to appear in a11y tree for SR when using Firefox -->\n    <span [id]=\"_periodButtonLabelId\" class=\"cdk-visually-hidden\" aria-live=\"polite\">{{periodButtonDescription}}</span>\n    <button matButton type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            [attr.aria-describedby]=\"_periodButtonLabelId\">\n      <span aria-hidden=\"true\">{{periodButtonText}}</span>\n      <svg class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"calendar.currentView !== 'month'\"\n           viewBox=\"0 0 10 5\" focusable=\"false\" aria-hidden=\"true\">\n           <polygon points=\"0,0 5,5 10,0\"/>\n      </svg>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button matIconButton type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [matTooltip]=\"prevButtonLabel\" [attr.aria-label]=\"prevButtonLabel\" disabledInteractive>\n      <svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n       </svg>\n    </button>\n\n    <button matIconButton type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [matTooltip]=\"nextButtonLabel\" [attr.aria-label]=\"nextButtonLabel\" disabledInteractive>\n      <svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n      </svg>\n    </button>\n  </div>\n</div>\n",
    dependencies: [{
      kind: "component",
      type: MatButton,
      selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ",
      inputs: ["matButton"],
      exportAs: ["matButton", "matAnchor"]
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
  version: "21.0.3",
  ngImport: i0,
  type: MatCalendarHeader,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-calendar-header',
      exportAs: 'matCalendarHeader',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatButton, MatIconButton, MatTooltip],
      template: "<div class=\"mat-calendar-header\">\n  <div class=\"mat-calendar-controls\">\n    <!-- [Firefox Issue: https://bugzilla.mozilla.org/show_bug.cgi?id=1880533]\n      Relocated label next to related button and made visually hidden via cdk-visually-hidden\n      to enable label to appear in a11y tree for SR when using Firefox -->\n    <span [id]=\"_periodButtonLabelId\" class=\"cdk-visually-hidden\" aria-live=\"polite\">{{periodButtonDescription}}</span>\n    <button matButton type=\"button\" class=\"mat-calendar-period-button\"\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\n            [attr.aria-describedby]=\"_periodButtonLabelId\">\n      <span aria-hidden=\"true\">{{periodButtonText}}</span>\n      <svg class=\"mat-calendar-arrow\" [class.mat-calendar-invert]=\"calendar.currentView !== 'month'\"\n           viewBox=\"0 0 10 5\" focusable=\"false\" aria-hidden=\"true\">\n           <polygon points=\"0,0 5,5 10,0\"/>\n      </svg>\n    </button>\n\n    <div class=\"mat-calendar-spacer\"></div>\n\n    <ng-content></ng-content>\n\n    <button matIconButton type=\"button\" class=\"mat-calendar-previous-button\"\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\n            [matTooltip]=\"prevButtonLabel\" [attr.aria-label]=\"prevButtonLabel\" disabledInteractive>\n      <svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n       </svg>\n    </button>\n\n    <button matIconButton type=\"button\" class=\"mat-calendar-next-button\"\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\n            [matTooltip]=\"nextButtonLabel\" [attr.aria-label]=\"nextButtonLabel\" disabledInteractive>\n      <svg viewBox=\"0 0 24 24\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n      </svg>\n    </button>\n  </div>\n</div>\n"
    }]
  }],
  ctorParameters: () => []
});
class MatCalendar {
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  headerComponent;
  _calendarHeaderPortal;
  _intlChanges;
  _moveFocusOnNextTick = false;
  get startAt() {
    return this._startAt;
  }
  set startAt(value) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _startAt;
  startView = 'month';
  get selected() {
    return this._selected;
  }
  set selected(value) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
  }
  _selected;
  get minDate() {
    return this._minDate;
  }
  set minDate(value) {
    this._minDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _minDate;
  get maxDate() {
    return this._maxDate;
  }
  set maxDate(value) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _maxDate;
  dateFilter;
  dateClass;
  comparisonStart;
  comparisonEnd;
  startDateAccessibleName;
  endDateAccessibleName;
  selectedChange = new EventEmitter();
  yearSelected = new EventEmitter();
  monthSelected = new EventEmitter();
  viewChanged = new EventEmitter(true);
  _userSelection = new EventEmitter();
  _userDragDrop = new EventEmitter();
  monthView;
  yearView;
  multiYearView;
  get activeDate() {
    return this._clampedActiveDate;
  }
  set activeDate(value) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }
  _clampedActiveDate;
  get currentView() {
    return this._currentView;
  }
  set currentView(value) {
    const viewChangedResult = this._currentView !== value ? value : null;
    this._currentView = value;
    this._moveFocusOnNextTick = true;
    this._changeDetectorRef.markForCheck();
    if (viewChangedResult) {
      this.stateChanges.next();
      this.viewChanged.emit(viewChangedResult);
    }
  }
  _currentView;
  _activeDrag = null;
  stateChanges = new Subject();
  constructor() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }
      if (!this._dateFormats) {
        throw createMissingDateImplError('MAT_DATE_FORMATS');
      }
    }
    this._intlChanges = inject(MatDatepickerIntl).changes.subscribe(() => {
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    });
  }
  ngAfterContentInit() {
    this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || MatCalendarHeader);
    this.activeDate = this.startAt || this._dateAdapter.today();
    this._currentView = this.startView;
  }
  ngAfterViewChecked() {
    if (this._moveFocusOnNextTick) {
      this._moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }
  ngOnDestroy() {
    this._intlChanges.unsubscribe();
    this.stateChanges.complete();
  }
  ngOnChanges(changes) {
    const minDateChange = changes['minDate'] && !this._dateAdapter.sameDate(changes['minDate'].previousValue, changes['minDate'].currentValue) ? changes['minDate'] : undefined;
    const maxDateChange = changes['maxDate'] && !this._dateAdapter.sameDate(changes['maxDate'].previousValue, changes['maxDate'].currentValue) ? changes['maxDate'] : undefined;
    const changeRequiringRerender = minDateChange || maxDateChange || changes['dateFilter'];
    if (changeRequiringRerender && !changeRequiringRerender.firstChange) {
      const view = this._getCurrentViewComponent();
      if (view) {
        if (this._elementRef.nativeElement.contains(_getFocusedElementPierceShadowDom())) {
          this._moveFocusOnNextTick = true;
        }
        this._changeDetectorRef.detectChanges();
        view._init();
      }
    }
    this.stateChanges.next();
  }
  focusActiveCell() {
    this._getCurrentViewComponent()._focusActiveCell(false);
  }
  updateTodaysDate() {
    this._getCurrentViewComponent()._init();
  }
  _dateSelected(event) {
    const date = event.value;
    if (this.selected instanceof DateRange || date && !this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
    this._userSelection.emit(event);
  }
  _yearSelectedInMultiYearView(normalizedYear) {
    this.yearSelected.emit(normalizedYear);
  }
  _monthSelectedInYearView(normalizedMonth) {
    this.monthSelected.emit(normalizedMonth);
  }
  _goToDateInView(date, view) {
    this.activeDate = date;
    this.currentView = view;
  }
  _dragStarted(event) {
    this._activeDrag = event;
  }
  _dragEnded(event) {
    if (!this._activeDrag) return;
    if (event.value) {
      this._userDragDrop.emit(event);
    }
    this._activeDrag = null;
  }
  _getCurrentViewComponent() {
    return this.monthView || this.yearView || this.multiYearView;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatCalendar,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatCalendar,
    isStandalone: true,
    selector: "mat-calendar",
    inputs: {
      headerComponent: "headerComponent",
      startAt: "startAt",
      startView: "startView",
      selected: "selected",
      minDate: "minDate",
      maxDate: "maxDate",
      dateFilter: "dateFilter",
      dateClass: "dateClass",
      comparisonStart: "comparisonStart",
      comparisonEnd: "comparisonEnd",
      startDateAccessibleName: "startDateAccessibleName",
      endDateAccessibleName: "endDateAccessibleName"
    },
    outputs: {
      selectedChange: "selectedChange",
      yearSelected: "yearSelected",
      monthSelected: "monthSelected",
      viewChanged: "viewChanged",
      _userSelection: "_userSelection",
      _userDragDrop: "_userDragDrop"
    },
    host: {
      classAttribute: "mat-calendar"
    },
    providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
    viewQueries: [{
      propertyName: "monthView",
      first: true,
      predicate: MatMonthView,
      descendants: true
    }, {
      propertyName: "yearView",
      first: true,
      predicate: MatYearView,
      descendants: true
    }, {
      propertyName: "multiYearView",
      first: true,
      predicate: MatMultiYearView,
      descendants: true
    }],
    exportAs: ["matCalendar"],
    usesOnChanges: true,
    ngImport: i0,
    template: "<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  @switch (currentView) {\n    @case ('month') {\n        <mat-month-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            [comparisonStart]=\"comparisonStart\"\n            [comparisonEnd]=\"comparisonEnd\"\n            [startDateAccessibleName]=\"startDateAccessibleName\"\n            [endDateAccessibleName]=\"endDateAccessibleName\"\n            (_userSelection)=\"_dateSelected($event)\"\n            (dragStarted)=\"_dragStarted($event)\"\n            (dragEnded)=\"_dragEnded($event)\"\n            [activeDrag]=\"_activeDrag\"></mat-month-view>\n    }\n\n    @case ('year') {\n        <mat-year-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            (monthSelected)=\"_monthSelectedInYearView($event)\"\n            (selectedChange)=\"_goToDateInView($event, 'month')\"></mat-year-view>\n    }\n\n    @case ('multi-year') {\n        <mat-multi-year-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n            (selectedChange)=\"_goToDateInView($event, 'year')\"></mat-multi-year-view>\n    }\n  }\n</div>\n",
    styles: [".mat-calendar{display:block;line-height:normal;font-family:var(--mat-datepicker-calendar-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-datepicker-calendar-text-size, var(--mat-sys-body-medium-size))}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;align-items:center;margin:5% calc(4.7142857143% - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0;margin:0 8px;font-size:var(--mat-datepicker-calendar-period-button-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-period-button-text-weight, var(--mat-sys-title-small-weight));--mat-button-text-label-text-color: var(--mat-datepicker-calendar-period-button-text-color, var(--mat-sys-on-surface-variant))}.mat-calendar-arrow{display:inline-block;width:10px;height:5px;margin:0 0 0 5px;vertical-align:middle;fill:var(--mat-datepicker-calendar-period-button-icon-color, var(--mat-sys-on-surface-variant))}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}@media(forced-colors: active){.mat-calendar-arrow{fill:CanvasText}}.mat-datepicker-content .mat-calendar-previous-button:not(.mat-mdc-button-disabled),.mat-datepicker-content .mat-calendar-next-button:not(.mat-mdc-button-disabled){color:var(--mat-datepicker-calendar-navigation-button-icon-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0;color:var(--mat-datepicker-calendar-header-text-color, var(--mat-sys-on-surface-variant));font-size:var(--mat-datepicker-calendar-header-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-header-text-weight, var(--mat-sys-title-small-weight))}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px;background:var(--mat-datepicker-calendar-header-divider-color, transparent)}.mat-calendar-body-cell-content::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px)*-1)}.mat-calendar-body-cell:focus-visible .mat-focus-indicator::before{content:\"\"}\n"],
    dependencies: [{
      kind: "directive",
      type: CdkPortalOutlet,
      selector: "[cdkPortalOutlet]",
      inputs: ["cdkPortalOutlet"],
      outputs: ["attached"],
      exportAs: ["cdkPortalOutlet"]
    }, {
      kind: "directive",
      type: CdkMonitorFocus,
      selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]",
      outputs: ["cdkFocusChange"],
      exportAs: ["cdkMonitorFocus"]
    }, {
      kind: "component",
      type: MatMonthView,
      selector: "mat-month-view",
      inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName", "activeDrag"],
      outputs: ["selectedChange", "_userSelection", "dragStarted", "dragEnded", "activeDateChange"],
      exportAs: ["matMonthView"]
    }, {
      kind: "component",
      type: MatYearView,
      selector: "mat-year-view",
      inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass"],
      outputs: ["selectedChange", "monthSelected", "activeDateChange"],
      exportAs: ["matYearView"]
    }, {
      kind: "component",
      type: MatMultiYearView,
      selector: "mat-multi-year-view",
      inputs: ["activeDate", "selected", "minDate", "maxDate", "dateFilter", "dateClass"],
      outputs: ["selectedChange", "yearSelected", "activeDateChange"],
      exportAs: ["matMultiYearView"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatCalendar,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-calendar',
      host: {
        'class': 'mat-calendar'
      },
      exportAs: 'matCalendar',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
      imports: [CdkPortalOutlet, CdkMonitorFocus, MatMonthView, MatYearView, MatMultiYearView],
      template: "<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\n\n<div class=\"mat-calendar-content\" cdkMonitorSubtreeFocus tabindex=\"-1\">\n  @switch (currentView) {\n    @case ('month') {\n        <mat-month-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            [comparisonStart]=\"comparisonStart\"\n            [comparisonEnd]=\"comparisonEnd\"\n            [startDateAccessibleName]=\"startDateAccessibleName\"\n            [endDateAccessibleName]=\"endDateAccessibleName\"\n            (_userSelection)=\"_dateSelected($event)\"\n            (dragStarted)=\"_dragStarted($event)\"\n            (dragEnded)=\"_dragEnded($event)\"\n            [activeDrag]=\"_activeDrag\"></mat-month-view>\n    }\n\n    @case ('year') {\n        <mat-year-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            (monthSelected)=\"_monthSelectedInYearView($event)\"\n            (selectedChange)=\"_goToDateInView($event, 'month')\"></mat-year-view>\n    }\n\n    @case ('multi-year') {\n        <mat-multi-year-view\n            [(activeDate)]=\"activeDate\"\n            [selected]=\"selected\"\n            [dateFilter]=\"dateFilter\"\n            [maxDate]=\"maxDate\"\n            [minDate]=\"minDate\"\n            [dateClass]=\"dateClass\"\n            (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\n            (selectedChange)=\"_goToDateInView($event, 'year')\"></mat-multi-year-view>\n    }\n  }\n</div>\n",
      styles: [".mat-calendar{display:block;line-height:normal;font-family:var(--mat-datepicker-calendar-text-font, var(--mat-sys-body-medium-font));font-size:var(--mat-datepicker-calendar-text-size, var(--mat-sys-body-medium-size))}.mat-calendar-header{padding:8px 8px 0 8px}.mat-calendar-content{padding:0 8px 8px 8px;outline:none}.mat-calendar-controls{display:flex;align-items:center;margin:5% calc(4.7142857143% - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0;margin:0 8px;font-size:var(--mat-datepicker-calendar-period-button-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-period-button-text-weight, var(--mat-sys-title-small-weight));--mat-button-text-label-text-color: var(--mat-datepicker-calendar-period-button-text-color, var(--mat-sys-on-surface-variant))}.mat-calendar-arrow{display:inline-block;width:10px;height:5px;margin:0 0 0 5px;vertical-align:middle;fill:var(--mat-datepicker-calendar-period-button-icon-color, var(--mat-sys-on-surface-variant))}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}@media(forced-colors: active){.mat-calendar-arrow{fill:CanvasText}}.mat-datepicker-content .mat-calendar-previous-button:not(.mat-mdc-button-disabled),.mat-datepicker-content .mat-calendar-next-button:not(.mat-mdc-button-disabled){color:var(--mat-datepicker-calendar-navigation-button-icon-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-calendar-previous-button,[dir=rtl] .mat-calendar-next-button{transform:rotate(180deg)}.mat-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.mat-calendar-table-header th{text-align:center;padding:0 0 8px 0;color:var(--mat-datepicker-calendar-header-text-color, var(--mat-sys-on-surface-variant));font-size:var(--mat-datepicker-calendar-header-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-datepicker-calendar-header-text-weight, var(--mat-sys-title-small-weight))}.mat-calendar-table-header-divider{position:relative;height:1px}.mat-calendar-table-header-divider::after{content:\"\";position:absolute;top:0;left:-8px;right:-8px;height:1px;background:var(--mat-datepicker-calendar-header-divider-color, transparent)}.mat-calendar-body-cell-content::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px)*-1)}.mat-calendar-body-cell:focus-visible .mat-focus-indicator::before{content:\"\"}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    headerComponent: [{
      type: Input
    }],
    startAt: [{
      type: Input
    }],
    startView: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    minDate: [{
      type: Input
    }],
    maxDate: [{
      type: Input
    }],
    dateFilter: [{
      type: Input
    }],
    dateClass: [{
      type: Input
    }],
    comparisonStart: [{
      type: Input
    }],
    comparisonEnd: [{
      type: Input
    }],
    startDateAccessibleName: [{
      type: Input
    }],
    endDateAccessibleName: [{
      type: Input
    }],
    selectedChange: [{
      type: Output
    }],
    yearSelected: [{
      type: Output
    }],
    monthSelected: [{
      type: Output
    }],
    viewChanged: [{
      type: Output
    }],
    _userSelection: [{
      type: Output
    }],
    _userDragDrop: [{
      type: Output
    }],
    monthView: [{
      type: ViewChild,
      args: [MatMonthView]
    }],
    yearView: [{
      type: ViewChild,
      args: [MatYearView]
    }],
    multiYearView: [{
      type: ViewChild,
      args: [MatMultiYearView]
    }]
  }
});

const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy', {
  providedIn: 'root',
  factory: () => {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
  }
});
class MatDatepickerContent {
  _elementRef = inject(ElementRef);
  _animationsDisabled = _animationsDisabled();
  _changeDetectorRef = inject(ChangeDetectorRef);
  _globalModel = inject(MatDateSelectionModel);
  _dateAdapter = inject(DateAdapter);
  _ngZone = inject(NgZone);
  _rangeSelectionStrategy = inject(MAT_DATE_RANGE_SELECTION_STRATEGY, {
    optional: true
  });
  _stateChanges;
  _model;
  _eventCleanups;
  _animationFallback;
  _calendar;
  color;
  datepicker;
  comparisonStart;
  comparisonEnd;
  startDateAccessibleName;
  endDateAccessibleName;
  _isAbove;
  _animationDone = new Subject();
  _isAnimating = false;
  _closeButtonText;
  _closeButtonFocused;
  _actionsPortal = null;
  _dialogLabelId;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_VisuallyHiddenLoader);
    this._closeButtonText = inject(MatDatepickerIntl).closeCalendarLabel;
    if (!this._animationsDisabled) {
      const element = this._elementRef.nativeElement;
      const renderer = inject(Renderer2);
      this._eventCleanups = this._ngZone.runOutsideAngular(() => [renderer.listen(element, 'animationstart', this._handleAnimationEvent), renderer.listen(element, 'animationend', this._handleAnimationEvent), renderer.listen(element, 'animationcancel', this._handleAnimationEvent)]);
    }
  }
  ngAfterViewInit() {
    this._stateChanges = this.datepicker.stateChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
    this._calendar.focusActiveCell();
  }
  ngOnDestroy() {
    clearTimeout(this._animationFallback);
    this._eventCleanups?.forEach(cleanup => cleanup());
    this._stateChanges?.unsubscribe();
    this._animationDone.complete();
  }
  _handleUserSelection(event) {
    const selection = this._model.selection;
    const value = event.value;
    const isRange = selection instanceof DateRange;
    if (isRange && this._rangeSelectionStrategy) {
      const newSelection = this._rangeSelectionStrategy.selectionFinished(value, selection, event.event);
      this._model.updateSelection(newSelection, this);
    } else if (value && (isRange || !this._dateAdapter.sameDate(value, selection))) {
      this._model.add(value);
    }
    if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
      this.datepicker.close();
    }
  }
  _handleUserDragDrop(event) {
    this._model.updateSelection(event.value, this);
  }
  _startExitAnimation() {
    this._elementRef.nativeElement.classList.add('mat-datepicker-content-exit');
    if (this._animationsDisabled) {
      this._animationDone.next();
    } else {
      clearTimeout(this._animationFallback);
      this._animationFallback = setTimeout(() => {
        if (!this._isAnimating) {
          this._animationDone.next();
        }
      }, 200);
    }
  }
  _handleAnimationEvent = event => {
    const element = this._elementRef.nativeElement;
    if (event.target !== element || !event.animationName.startsWith('_mat-datepicker-content')) {
      return;
    }
    clearTimeout(this._animationFallback);
    this._isAnimating = event.type === 'animationstart';
    element.classList.toggle('mat-datepicker-content-animating', this._isAnimating);
    if (!this._isAnimating) {
      this._animationDone.next();
    }
  };
  _getSelected() {
    return this._model.selection;
  }
  _applyPendingSelection() {
    if (this._model !== this._globalModel) {
      this._globalModel.updateSelection(this._model.selection, this);
    }
  }
  _assignActions(portal, forceRerender) {
    this._model = portal ? this._globalModel.clone() : this._globalModel;
    this._actionsPortal = portal;
    if (forceRerender) {
      this._changeDetectorRef.detectChanges();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerContent,
    isStandalone: true,
    selector: "mat-datepicker-content",
    inputs: {
      color: "color"
    },
    host: {
      properties: {
        "class": "color ? \"mat-\" + color : \"\"",
        "class.mat-datepicker-content-touch": "datepicker.touchUi",
        "class.mat-datepicker-content-animations-enabled": "!_animationsDisabled"
      },
      classAttribute: "mat-datepicker-content"
    },
    viewQueries: [{
      propertyName: "_calendar",
      first: true,
      predicate: MatCalendar,
      descendants: true
    }],
    exportAs: ["matDatepickerContent"],
    ngImport: i0,
    template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [class]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    matButton=\"elevated\"\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n",
    styles: ["@keyframes _mat-datepicker-content-dropdown-enter{from{opacity:0;transform:scaleY(0.8)}to{opacity:1;transform:none}}@keyframes _mat-datepicker-content-dialog-enter{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:none}}@keyframes _mat-datepicker-content-exit{from{opacity:1}to{opacity:0}}.mat-datepicker-content{display:block;background-color:var(--mat-datepicker-calendar-container-background-color, var(--mat-sys-surface-container-high));color:var(--mat-datepicker-calendar-container-text-color, var(--mat-sys-on-surface));box-shadow:var(--mat-datepicker-calendar-container-elevation-shadow, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12));border-radius:var(--mat-datepicker-calendar-container-shape, var(--mat-sys-corner-large))}.mat-datepicker-content.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-dropdown-enter 120ms cubic-bezier(0, 0, 0.2, 1)}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.mat-datepicker-content-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mat-datepicker-calendar-container-touch-elevation-shadow, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12));border-radius:var(--mat-datepicker-calendar-container-touch-shape, var(--mat-sys-corner-extra-large));position:relative;overflow:visible}.mat-datepicker-content-touch.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-dialog-enter 150ms cubic-bezier(0, 0, 0.2, 1)}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}.mat-datepicker-content-exit.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-exit 100ms linear}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"],
    dependencies: [{
      kind: "directive",
      type: CdkTrapFocus,
      selector: "[cdkTrapFocus]",
      inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"],
      exportAs: ["cdkTrapFocus"]
    }, {
      kind: "component",
      type: MatCalendar,
      selector: "mat-calendar",
      inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName"],
      outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection", "_userDragDrop"],
      exportAs: ["matCalendar"]
    }, {
      kind: "directive",
      type: CdkPortalOutlet,
      selector: "[cdkPortalOutlet]",
      inputs: ["cdkPortalOutlet"],
      outputs: ["attached"],
      exportAs: ["cdkPortalOutlet"]
    }, {
      kind: "component",
      type: MatButton,
      selector: "    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],    a[mat-flat-button], a[mat-stroked-button]  ",
      inputs: ["matButton"],
      exportAs: ["matButton", "matAnchor"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerContent,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-datepicker-content',
      host: {
        'class': 'mat-datepicker-content',
        '[class]': 'color ? "mat-" + color : ""',
        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
        '[class.mat-datepicker-content-animations-enabled]': '!_animationsDisabled'
      },
      exportAs: 'matDatepickerContent',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CdkTrapFocus, MatCalendar, CdkPortalOutlet, MatButton],
      template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [class]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    matButton=\"elevated\"\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n",
      styles: ["@keyframes _mat-datepicker-content-dropdown-enter{from{opacity:0;transform:scaleY(0.8)}to{opacity:1;transform:none}}@keyframes _mat-datepicker-content-dialog-enter{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:none}}@keyframes _mat-datepicker-content-exit{from{opacity:1}to{opacity:0}}.mat-datepicker-content{display:block;background-color:var(--mat-datepicker-calendar-container-background-color, var(--mat-sys-surface-container-high));color:var(--mat-datepicker-calendar-container-text-color, var(--mat-sys-on-surface));box-shadow:var(--mat-datepicker-calendar-container-elevation-shadow, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12));border-radius:var(--mat-datepicker-calendar-container-shape, var(--mat-sys-corner-large))}.mat-datepicker-content.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-dropdown-enter 120ms cubic-bezier(0, 0, 0.2, 1)}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.mat-datepicker-content-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mat-datepicker-calendar-container-touch-elevation-shadow, 0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12));border-radius:var(--mat-datepicker-calendar-container-touch-shape, var(--mat-sys-corner-extra-large));position:relative;overflow:visible}.mat-datepicker-content-touch.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-dialog-enter 150ms cubic-bezier(0, 0, 0.2, 1)}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}.mat-datepicker-content-exit.mat-datepicker-content-animations-enabled{animation:_mat-datepicker-content-exit 100ms linear}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _calendar: [{
      type: ViewChild,
      args: [MatCalendar]
    }],
    color: [{
      type: Input
    }]
  }
});
class MatDatepickerBase {
  _injector = inject(Injector);
  _viewContainerRef = inject(ViewContainerRef);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dir = inject(Directionality, {
    optional: true
  });
  _model = inject(MatDateSelectionModel);
  _animationsDisabled = _animationsDisabled();
  _scrollStrategy = inject(MAT_DATEPICKER_SCROLL_STRATEGY);
  _inputStateChanges = Subscription.EMPTY;
  _document = inject(DOCUMENT);
  calendarHeaderComponent;
  get startAt() {
    return this._startAt || (this.datepickerInput ? this.datepickerInput.getStartValue() : null);
  }
  set startAt(value) {
    this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  _startAt;
  startView = 'month';
  get color() {
    return this._color || (this.datepickerInput ? this.datepickerInput.getThemePalette() : undefined);
  }
  set color(value) {
    this._color = value;
  }
  _color;
  touchUi = false;
  get disabled() {
    return this._disabled === undefined && this.datepickerInput ? this.datepickerInput.disabled : !!this._disabled;
  }
  set disabled(value) {
    if (value !== this._disabled) {
      this._disabled = value;
      this.stateChanges.next(undefined);
    }
  }
  _disabled;
  xPosition = 'start';
  yPosition = 'below';
  restoreFocus = true;
  yearSelected = new EventEmitter();
  monthSelected = new EventEmitter();
  viewChanged = new EventEmitter(true);
  dateClass;
  openedStream = new EventEmitter();
  closedStream = new EventEmitter();
  get panelClass() {
    return this._panelClass;
  }
  set panelClass(value) {
    this._panelClass = coerceStringArray(value);
  }
  _panelClass;
  get opened() {
    return this._opened;
  }
  set opened(value) {
    if (value) {
      this.open();
    } else {
      this.close();
    }
  }
  _opened = false;
  id = inject(_IdGenerator).getId('mat-datepicker-');
  _getMinDate() {
    return this.datepickerInput && this.datepickerInput.min;
  }
  _getMaxDate() {
    return this.datepickerInput && this.datepickerInput.max;
  }
  _getDateFilter() {
    return this.datepickerInput && this.datepickerInput.dateFilter;
  }
  _overlayRef;
  _componentRef;
  _focusedElementBeforeOpen = null;
  _backdropHarnessClass = `${this.id}-backdrop`;
  _actionsPortal;
  datepickerInput;
  stateChanges = new Subject();
  _changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw createMissingDateImplError('DateAdapter');
    }
    this._model.selectionChanged.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
  ngOnChanges(changes) {
    const positionChange = changes['xPosition'] || changes['yPosition'];
    if (positionChange && !positionChange.firstChange && this._overlayRef) {
      const positionStrategy = this._overlayRef.getConfig().positionStrategy;
      if (positionStrategy instanceof FlexibleConnectedPositionStrategy) {
        this._setConnectedPositions(positionStrategy);
        if (this.opened) {
          this._overlayRef.updatePosition();
        }
      }
    }
    this.stateChanges.next(undefined);
  }
  ngOnDestroy() {
    this._destroyOverlay();
    this.close();
    this._inputStateChanges.unsubscribe();
    this.stateChanges.complete();
  }
  select(date) {
    this._model.add(date);
  }
  _selectYear(normalizedYear) {
    this.yearSelected.emit(normalizedYear);
  }
  _selectMonth(normalizedMonth) {
    this.monthSelected.emit(normalizedMonth);
  }
  _viewChanged(view) {
    this.viewChanged.emit(view);
  }
  registerInput(input) {
    if (this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('A MatDatepicker can only be associated with a single input.');
    }
    this._inputStateChanges.unsubscribe();
    this.datepickerInput = input;
    this._inputStateChanges = input.stateChanges.subscribe(() => this.stateChanges.next(undefined));
    return this._model;
  }
  registerActions(portal) {
    if (this._actionsPortal && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('A MatDatepicker can only be associated with a single actions row.');
    }
    this._actionsPortal = portal;
    this._componentRef?.instance._assignActions(portal, true);
  }
  removeActions(portal) {
    if (portal === this._actionsPortal) {
      this._actionsPortal = null;
      this._componentRef?.instance._assignActions(null, true);
    }
  }
  open() {
    if (this._opened || this.disabled || this._componentRef?.instance._isAnimating) {
      return;
    }
    if (!this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error('Attempted to open an MatDatepicker with no associated input.');
    }
    this._focusedElementBeforeOpen = _getFocusedElementPierceShadowDom();
    this._openOverlay();
    this._opened = true;
    this.openedStream.emit();
  }
  close() {
    if (!this._opened || this._componentRef?.instance._isAnimating) {
      return;
    }
    const canRestoreFocus = this.restoreFocus && this._focusedElementBeforeOpen && typeof this._focusedElementBeforeOpen.focus === 'function';
    const completeClose = () => {
      if (this._opened) {
        this._opened = false;
        this.closedStream.emit();
      }
    };
    if (this._componentRef) {
      const {
        instance,
        location
      } = this._componentRef;
      instance._animationDone.pipe(take(1)).subscribe(() => {
        const activeElement = this._document.activeElement;
        if (canRestoreFocus && (!activeElement || activeElement === this._document.activeElement || location.nativeElement.contains(activeElement))) {
          this._focusedElementBeforeOpen.focus();
        }
        this._focusedElementBeforeOpen = null;
        this._destroyOverlay();
      });
      instance._startExitAnimation();
    }
    if (canRestoreFocus) {
      setTimeout(completeClose);
    } else {
      completeClose();
    }
  }
  _applyPendingSelection() {
    this._componentRef?.instance?._applyPendingSelection();
  }
  _forwardContentValues(instance) {
    instance.datepicker = this;
    instance.color = this.color;
    instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
    instance._assignActions(this._actionsPortal, false);
  }
  _openOverlay() {
    this._destroyOverlay();
    const isDialog = this.touchUi;
    const portal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
    const overlayRef = this._overlayRef = createOverlayRef(this._injector, new OverlayConfig({
      positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
      hasBackdrop: true,
      backdropClass: [isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop', this._backdropHarnessClass],
      direction: this._dir || 'ltr',
      scrollStrategy: isDialog ? createBlockScrollStrategy(this._injector) : this._scrollStrategy(),
      panelClass: `mat-datepicker-${isDialog ? 'dialog' : 'popup'}`,
      disableAnimations: this._animationsDisabled
    }));
    this._getCloseStream(overlayRef).subscribe(event => {
      if (event) {
        event.preventDefault();
      }
      this.close();
    });
    overlayRef.keydownEvents().subscribe(event => {
      const keyCode = event.keyCode;
      if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === PAGE_UP || keyCode === PAGE_DOWN) {
        event.preventDefault();
      }
    });
    this._componentRef = overlayRef.attach(portal);
    this._forwardContentValues(this._componentRef.instance);
    if (!isDialog) {
      afterNextRender(() => {
        overlayRef.updatePosition();
      }, {
        injector: this._injector
      });
    }
  }
  _destroyOverlay() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = this._componentRef = null;
    }
  }
  _getDialogStrategy() {
    return createGlobalPositionStrategy(this._injector).centerHorizontally().centerVertically();
  }
  _getDropdownStrategy() {
    const strategy = createFlexibleConnectedPositionStrategy(this._injector, this.datepickerInput.getConnectedOverlayOrigin()).withTransformOriginOn('.mat-datepicker-content').withFlexibleDimensions(false).withViewportMargin(8).withLockedPosition();
    return this._setConnectedPositions(strategy);
  }
  _setConnectedPositions(strategy) {
    const primaryX = this.xPosition === 'end' ? 'end' : 'start';
    const secondaryX = primaryX === 'start' ? 'end' : 'start';
    const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
    const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
    return strategy.withPositions([{
      originX: primaryX,
      originY: secondaryY,
      overlayX: primaryX,
      overlayY: primaryY
    }, {
      originX: primaryX,
      originY: primaryY,
      overlayX: primaryX,
      overlayY: secondaryY
    }, {
      originX: secondaryX,
      originY: secondaryY,
      overlayX: secondaryX,
      overlayY: primaryY
    }, {
      originX: secondaryX,
      originY: primaryY,
      overlayX: secondaryX,
      overlayY: secondaryY
    }]);
  }
  _getCloseStream(overlayRef) {
    const ctrlShiftMetaModifiers = ['ctrlKey', 'shiftKey', 'metaKey'];
    return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
      return event.keyCode === ESCAPE && !hasModifierKey(event) || this.datepickerInput && hasModifierKey(event, 'altKey') && event.keyCode === UP_ARROW && ctrlShiftMetaModifiers.every(modifier => !hasModifierKey(event, modifier));
    })));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatDatepickerBase,
    isStandalone: true,
    inputs: {
      calendarHeaderComponent: "calendarHeaderComponent",
      startAt: "startAt",
      startView: "startView",
      color: "color",
      touchUi: ["touchUi", "touchUi", booleanAttribute],
      disabled: ["disabled", "disabled", booleanAttribute],
      xPosition: "xPosition",
      yPosition: "yPosition",
      restoreFocus: ["restoreFocus", "restoreFocus", booleanAttribute],
      dateClass: "dateClass",
      panelClass: "panelClass",
      opened: ["opened", "opened", booleanAttribute]
    },
    outputs: {
      yearSelected: "yearSelected",
      monthSelected: "monthSelected",
      viewChanged: "viewChanged",
      openedStream: "opened",
      closedStream: "closed"
    },
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerBase,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => [],
  propDecorators: {
    calendarHeaderComponent: [{
      type: Input
    }],
    startAt: [{
      type: Input
    }],
    startView: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    touchUi: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    xPosition: [{
      type: Input
    }],
    yPosition: [{
      type: Input
    }],
    restoreFocus: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    yearSelected: [{
      type: Output
    }],
    monthSelected: [{
      type: Output
    }],
    viewChanged: [{
      type: Output
    }],
    dateClass: [{
      type: Input
    }],
    openedStream: [{
      type: Output,
      args: ['opened']
    }],
    closedStream: [{
      type: Output,
      args: ['closed']
    }],
    panelClass: [{
      type: Input
    }],
    opened: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  }
});

class MatDatepicker extends MatDatepickerBase {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepicker,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepicker,
    isStandalone: true,
    selector: "mat-datepicker",
    providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, {
      provide: MatDatepickerBase,
      useExisting: MatDatepicker
    }],
    exportAs: ["matDatepicker"],
    usesInheritance: true,
    ngImport: i0,
    template: '',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepicker,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-datepicker',
      template: '',
      exportAs: 'matDatepicker',
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [MAT_SINGLE_DATE_SELECTION_MODEL_PROVIDER, {
        provide: MatDatepickerBase,
        useExisting: MatDatepicker
      }]
    }]
  }]
});

class MatDatepickerInputEvent {
  target;
  targetElement;
  value;
  constructor(target, targetElement) {
    this.target = target;
    this.targetElement = targetElement;
    this.value = this.target.value;
  }
}
class MatDatepickerInputBase {
  _elementRef = inject(ElementRef);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _dateFormats = inject(MAT_DATE_FORMATS, {
    optional: true
  });
  _isInitialized;
  get value() {
    return this._model ? this._getValueFromModel(this._model.selection) : this._pendingValue;
  }
  set value(value) {
    this._assignValueProgrammatically(value, true);
  }
  _model;
  get disabled() {
    return !!this._disabled || this._parentDisabled();
  }
  set disabled(value) {
    const newValue = value;
    const element = this._elementRef.nativeElement;
    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this.stateChanges.next(undefined);
    }
    if (newValue && this._isInitialized && element.blur) {
      element.blur();
    }
  }
  _disabled;
  dateChange = new EventEmitter();
  dateInput = new EventEmitter();
  stateChanges = new Subject();
  _onTouched = () => {};
  _validatorOnChange = () => {};
  _cvaOnChange = () => {};
  _valueChangesSubscription = Subscription.EMPTY;
  _localeSubscription = Subscription.EMPTY;
  _pendingValue;
  _parseValidator = () => {
    return this._lastValueValid ? null : {
      'matDatepickerParse': {
        'text': this._elementRef.nativeElement.value
      }
    };
  };
  _filterValidator = control => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !controlValue || this._matchesFilter(controlValue) ? null : {
      'matDatepickerFilter': true
    };
  };
  _minValidator = control => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const min = this._getMinDate();
    return !min || !controlValue || this._dateAdapter.compareDate(min, controlValue) <= 0 ? null : {
      'matDatepickerMin': {
        'min': min,
        'actual': controlValue
      }
    };
  };
  _maxValidator = control => {
    const controlValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const max = this._getMaxDate();
    return !max || !controlValue || this._dateAdapter.compareDate(max, controlValue) >= 0 ? null : {
      'matDatepickerMax': {
        'max': max,
        'actual': controlValue
      }
    };
  };
  _getValidators() {
    return [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator];
  }
  _registerModel(model) {
    this._model = model;
    this._valueChangesSubscription.unsubscribe();
    if (this._pendingValue) {
      this._assignValue(this._pendingValue);
    }
    this._valueChangesSubscription = this._model.selectionChanged.subscribe(event => {
      if (this._shouldHandleChangeEvent(event)) {
        const value = this._getValueFromModel(event.selection);
        this._lastValueValid = this._isValidValue(value);
        this._cvaOnChange(value);
        this._onTouched();
        this._formatValue(value);
        this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
        this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
      }
    });
  }
  _lastValueValid = false;
  constructor() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }
      if (!this._dateFormats) {
        throw createMissingDateImplError('MAT_DATE_FORMATS');
      }
    }
    this._localeSubscription = this._dateAdapter.localeChanges.subscribe(() => {
      this._assignValueProgrammatically(this.value, true);
    });
  }
  ngAfterViewInit() {
    this._isInitialized = true;
  }
  ngOnChanges(changes) {
    if (dateInputsHaveChanged(changes, this._dateAdapter)) {
      this.stateChanges.next(undefined);
    }
  }
  ngOnDestroy() {
    this._valueChangesSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this.stateChanges.complete();
  }
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  validate(c) {
    return this._validator ? this._validator(c) : null;
  }
  writeValue(value) {
    this._assignValueProgrammatically(value, value !== this.value);
  }
  registerOnChange(fn) {
    this._cvaOnChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  _onKeydown(event) {
    const ctrlShiftMetaModifiers = ['ctrlKey', 'shiftKey', 'metaKey'];
    const isAltDownArrow = hasModifierKey(event, 'altKey') && event.keyCode === DOWN_ARROW && ctrlShiftMetaModifiers.every(modifier => !hasModifierKey(event, modifier));
    if (isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
      this._openPopup();
      event.preventDefault();
    }
  }
  _onInput(event) {
    const value = event.target.value;
    const lastValueWasValid = this._lastValueValid;
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    this._lastValueValid = this._isValidValue(date);
    date = this._dateAdapter.getValidDateOrNull(date);
    const hasChanged = !this._dateAdapter.sameDate(date, this.value);
    if (!date || hasChanged) {
      this._cvaOnChange(date);
    } else {
      if (value && !this.value) {
        this._cvaOnChange(date);
      }
      if (lastValueWasValid !== this._lastValueValid) {
        this._validatorOnChange();
      }
    }
    if (hasChanged) {
      this._assignValue(date);
      this.dateInput.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
  }
  _onChange() {
    this.dateChange.emit(new MatDatepickerInputEvent(this, this._elementRef.nativeElement));
  }
  _onBlur() {
    if (this.value) {
      this._formatValue(this.value);
    }
    this._onTouched();
  }
  _formatValue(value) {
    this._elementRef.nativeElement.value = value != null ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
  }
  _assignValue(value) {
    if (this._model) {
      this._assignValueToModel(value);
      this._pendingValue = null;
    } else {
      this._pendingValue = value;
    }
  }
  _isValidValue(value) {
    return !value || this._dateAdapter.isValid(value);
  }
  _parentDisabled() {
    return false;
  }
  _assignValueProgrammatically(value, reformat) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = this._isValidValue(value);
    value = this._dateAdapter.getValidDateOrNull(value);
    this._assignValue(value);
    if (reformat) {
      this._formatValue(value);
    }
  }
  _matchesFilter(value) {
    const filter = this._getDateFilter();
    return !filter || filter(value);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerInputBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatDatepickerInputBase,
    isStandalone: true,
    inputs: {
      value: "value",
      disabled: ["disabled", "disabled", booleanAttribute]
    },
    outputs: {
      dateChange: "dateChange",
      dateInput: "dateInput"
    },
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerInputBase,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => [],
  propDecorators: {
    value: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    dateChange: [{
      type: Output
    }],
    dateInput: [{
      type: Output
    }]
  }
});
function dateInputsHaveChanged(changes, adapter) {
  const keys = Object.keys(changes);
  for (let key of keys) {
    const {
      previousValue,
      currentValue
    } = changes[key];
    if (adapter.isDateInstance(previousValue) && adapter.isDateInstance(currentValue)) {
      if (!adapter.sameDate(previousValue, currentValue)) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
}

const MAT_DATEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatDatepickerInput),
  multi: true
};
const MAT_DATEPICKER_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MatDatepickerInput),
  multi: true
};
class MatDatepickerInput extends MatDatepickerInputBase {
  _formField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  _closedSubscription = Subscription.EMPTY;
  _openedSubscription = Subscription.EMPTY;
  set matDatepicker(datepicker) {
    if (datepicker) {
      this._datepicker = datepicker;
      this._ariaOwns.set(datepicker.opened ? datepicker.id : null);
      this._closedSubscription = datepicker.closedStream.subscribe(() => {
        this._onTouched();
        this._ariaOwns.set(null);
      });
      this._openedSubscription = datepicker.openedStream.subscribe(() => {
        this._ariaOwns.set(datepicker.id);
      });
      this._registerModel(datepicker.registerInput(this));
    }
  }
  _datepicker;
  _ariaOwns = signal(null, ...(ngDevMode ? [{
    debugName: "_ariaOwns"
  }] : []));
  get min() {
    return this._min;
  }
  set min(value) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._validatorOnChange();
    }
  }
  _min;
  get max() {
    return this._max;
  }
  set max(value) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._validatorOnChange();
    }
  }
  _max;
  get dateFilter() {
    return this._dateFilter;
  }
  set dateFilter(value) {
    const wasMatchingValue = this._matchesFilter(this.value);
    this._dateFilter = value;
    if (this._matchesFilter(this.value) !== wasMatchingValue) {
      this._validatorOnChange();
    }
  }
  _dateFilter;
  _validator;
  constructor() {
    super();
    this._validator = Validators.compose(super._getValidators());
  }
  getConnectedOverlayOrigin() {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }
  getOverlayLabelId() {
    if (this._formField) {
      return this._formField.getLabelId();
    }
    return this._elementRef.nativeElement.getAttribute('aria-labelledby');
  }
  getThemePalette() {
    return this._formField ? this._formField.color : undefined;
  }
  getStartValue() {
    return this.value;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._closedSubscription.unsubscribe();
    this._openedSubscription.unsubscribe();
  }
  _openPopup() {
    if (this._datepicker) {
      this._datepicker.open();
    }
  }
  _getValueFromModel(modelValue) {
    return modelValue;
  }
  _assignValueToModel(value) {
    if (this._model) {
      this._model.updateSelection(value, this);
    }
  }
  _getMinDate() {
    return this._min;
  }
  _getMaxDate() {
    return this._max;
  }
  _getDateFilter() {
    return this._dateFilter;
  }
  _shouldHandleChangeEvent(event) {
    return event.source !== this;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerInput,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerInput,
    isStandalone: true,
    selector: "input[matDatepicker]",
    inputs: {
      matDatepicker: "matDatepicker",
      min: "min",
      max: "max",
      dateFilter: ["matDatepickerFilter", "dateFilter"]
    },
    host: {
      listeners: {
        "input": "_onInput($event)",
        "change": "_onChange()",
        "blur": "_onBlur()",
        "keydown": "_onKeydown($event)"
      },
      properties: {
        "attr.aria-haspopup": "_datepicker ? \"dialog\" : null",
        "attr.aria-owns": "_ariaOwns()",
        "attr.min": "min ? _dateAdapter.toIso8601(min) : null",
        "attr.max": "max ? _dateAdapter.toIso8601(max) : null",
        "attr.data-mat-calendar": "_datepicker ? _datepicker.id : null",
        "disabled": "disabled"
      },
      classAttribute: "mat-datepicker-input"
    },
    providers: [MAT_DATEPICKER_VALUE_ACCESSOR, MAT_DATEPICKER_VALIDATORS, {
      provide: MAT_INPUT_VALUE_ACCESSOR,
      useExisting: MatDatepickerInput
    }],
    exportAs: ["matDatepickerInput"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerInput,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[matDatepicker]',
      providers: [MAT_DATEPICKER_VALUE_ACCESSOR, MAT_DATEPICKER_VALIDATORS, {
        provide: MAT_INPUT_VALUE_ACCESSOR,
        useExisting: MatDatepickerInput
      }],
      host: {
        'class': 'mat-datepicker-input',
        '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
        '[attr.aria-owns]': '_ariaOwns()',
        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
        '[attr.data-mat-calendar]': '_datepicker ? _datepicker.id : null',
        '[disabled]': 'disabled',
        '(input)': '_onInput($event)',
        '(change)': '_onChange()',
        '(blur)': '_onBlur()',
        '(keydown)': '_onKeydown($event)'
      },
      exportAs: 'matDatepickerInput'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    matDatepicker: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    dateFilter: [{
      type: Input,
      args: ['matDatepickerFilter']
    }]
  }
});

class MatDatepickerToggleIcon {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerToggleIcon,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerToggleIcon,
    isStandalone: true,
    selector: "[matDatepickerToggleIcon]",
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerToggleIcon,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matDatepickerToggleIcon]'
    }]
  }]
});
class MatDatepickerToggle {
  _intl = inject(MatDatepickerIntl);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _stateChanges = Subscription.EMPTY;
  datepicker;
  tabIndex;
  ariaLabel;
  get disabled() {
    if (this._disabled === undefined && this.datepicker) {
      return this.datepicker.disabled;
    }
    return !!this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  _disabled;
  disableRipple;
  _customIcon;
  _button;
  constructor() {
    const defaultTabIndex = inject(new HostAttributeToken('tabindex'), {
      optional: true
    });
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }
  ngOnChanges(changes) {
    if (changes['datepicker']) {
      this._watchStateChanges();
    }
  }
  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }
  ngAfterContentInit() {
    this._watchStateChanges();
  }
  _open(event) {
    if (this.datepicker && !this.disabled) {
      this.datepicker.open();
      event.stopPropagation();
    }
  }
  _watchStateChanges() {
    const datepickerStateChanged = this.datepicker ? this.datepicker.stateChanges : of();
    const inputStateChanged = this.datepicker && this.datepicker.datepickerInput ? this.datepicker.datepickerInput.stateChanges : of();
    const datepickerToggled = this.datepicker ? merge(this.datepicker.openedStream, this.datepicker.closedStream) : of();
    this._stateChanges.unsubscribe();
    this._stateChanges = merge(this._intl.changes, datepickerStateChanged, inputStateChanged, datepickerToggled).subscribe(() => this._changeDetectorRef.markForCheck());
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerToggle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatDatepickerToggle,
    isStandalone: true,
    selector: "mat-datepicker-toggle",
    inputs: {
      datepicker: ["for", "datepicker"],
      tabIndex: "tabIndex",
      ariaLabel: ["aria-label", "ariaLabel"],
      disabled: ["disabled", "disabled", booleanAttribute],
      disableRipple: "disableRipple"
    },
    host: {
      listeners: {
        "click": "_open($event)"
      },
      properties: {
        "attr.tabindex": "null",
        "class.mat-datepicker-toggle-active": "datepicker && datepicker.opened",
        "class.mat-accent": "datepicker && datepicker.color === \"accent\"",
        "class.mat-warn": "datepicker && datepicker.color === \"warn\"",
        "attr.data-mat-calendar": "datepicker ? datepicker.id : null"
      },
      classAttribute: "mat-datepicker-toggle"
    },
    queries: [{
      propertyName: "_customIcon",
      first: true,
      predicate: MatDatepickerToggleIcon,
      descendants: true
    }],
    viewQueries: [{
      propertyName: "_button",
      first: true,
      predicate: ["button"],
      descendants: true
    }],
    exportAs: ["matDatepickerToggle"],
    usesOnChanges: true,
    ngImport: i0,
    template: "<button\n  #button\n  matIconButton\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [tabIndex]=\"disabled ? -1 : tabIndex\"\n  [attr.aria-expanded]=\"datepicker ? datepicker.opened : null\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    <svg\n      class=\"mat-datepicker-toggle-default-icon\"\n      viewBox=\"0 0 24 24\"\n      width=\"24px\"\n      height=\"24px\"\n      fill=\"currentColor\"\n      focusable=\"false\"\n      aria-hidden=\"true\">\n      <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n    </svg>\n  }\n\n  <ng-content select=\"[matDatepickerToggleIcon]\"></ng-content>\n</button>\n",
    styles: [".mat-datepicker-toggle{pointer-events:auto;color:var(--mat-datepicker-toggle-icon-color, var(--mat-sys-on-surface-variant))}.mat-datepicker-toggle button{color:inherit}.mat-datepicker-toggle-active{color:var(--mat-datepicker-toggle-active-state-icon-color, var(--mat-sys-primary))}@media(forced-colors: active){.mat-datepicker-toggle-default-icon{color:CanvasText}}\n"],
    dependencies: [{
      kind: "component",
      type: MatIconButton,
      selector: "button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]",
      exportAs: ["matButton", "matAnchor"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerToggle,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-datepicker-toggle',
      host: {
        'class': 'mat-datepicker-toggle',
        '[attr.tabindex]': 'null',
        '[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
        '[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
        '[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
        '[attr.data-mat-calendar]': 'datepicker ? datepicker.id : null',
        '(click)': '_open($event)'
      },
      exportAs: 'matDatepickerToggle',
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatIconButton],
      template: "<button\n  #button\n  matIconButton\n  type=\"button\"\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\n  [attr.aria-label]=\"ariaLabel || _intl.openCalendarLabel\"\n  [tabIndex]=\"disabled ? -1 : tabIndex\"\n  [attr.aria-expanded]=\"datepicker ? datepicker.opened : null\"\n  [disabled]=\"disabled\"\n  [disableRipple]=\"disableRipple\">\n\n  @if (!_customIcon) {\n    <svg\n      class=\"mat-datepicker-toggle-default-icon\"\n      viewBox=\"0 0 24 24\"\n      width=\"24px\"\n      height=\"24px\"\n      fill=\"currentColor\"\n      focusable=\"false\"\n      aria-hidden=\"true\">\n      <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\n    </svg>\n  }\n\n  <ng-content select=\"[matDatepickerToggleIcon]\"></ng-content>\n</button>\n",
      styles: [".mat-datepicker-toggle{pointer-events:auto;color:var(--mat-datepicker-toggle-icon-color, var(--mat-sys-on-surface-variant))}.mat-datepicker-toggle button{color:inherit}.mat-datepicker-toggle-active{color:var(--mat-datepicker-toggle-active-state-icon-color, var(--mat-sys-primary))}@media(forced-colors: active){.mat-datepicker-toggle-default-icon{color:CanvasText}}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    datepicker: [{
      type: Input,
      args: ['for']
    }],
    tabIndex: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ['aria-label']
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableRipple: [{
      type: Input
    }],
    _customIcon: [{
      type: ContentChild,
      args: [MatDatepickerToggleIcon]
    }],
    _button: [{
      type: ViewChild,
      args: ['button']
    }]
  }
});

class MatDateRangeInput {
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _dateAdapter = inject(DateAdapter, {
    optional: true
  });
  _formField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  _closedSubscription = Subscription.EMPTY;
  _openedSubscription = Subscription.EMPTY;
  _startInput;
  _endInput;
  get value() {
    return this._model ? this._model.selection : null;
  }
  id = inject(_IdGenerator).getId('mat-date-range-input-');
  focused = false;
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  controlType = 'mat-date-range-input';
  get placeholder() {
    const start = this._startInput?._getPlaceholder() || '';
    const end = this._endInput?._getPlaceholder() || '';
    return start || end ? `${start} ${this.separator} ${end}` : '';
  }
  get rangePicker() {
    return this._rangePicker;
  }
  set rangePicker(rangePicker) {
    if (rangePicker) {
      this._model = rangePicker.registerInput(this);
      this._rangePicker = rangePicker;
      this._closedSubscription.unsubscribe();
      this._openedSubscription.unsubscribe();
      this._ariaOwns.set(this.rangePicker.opened ? rangePicker.id : null);
      this._closedSubscription = rangePicker.closedStream.subscribe(() => {
        this._startInput?._onTouched();
        this._endInput?._onTouched();
        this._ariaOwns.set(null);
      });
      this._openedSubscription = rangePicker.openedStream.subscribe(() => {
        this._ariaOwns.set(rangePicker.id);
      });
      this._registerModel(this._model);
    }
  }
  _rangePicker;
  _ariaOwns = signal(null, ...(ngDevMode ? [{
    debugName: "_ariaOwns"
  }] : []));
  get required() {
    return this._required ?? (this._isTargetRequired(this) || this._isTargetRequired(this._startInput) || this._isTargetRequired(this._endInput)) ?? false;
  }
  set required(value) {
    this._required = value;
  }
  _required;
  get dateFilter() {
    return this._dateFilter;
  }
  set dateFilter(value) {
    const start = this._startInput;
    const end = this._endInput;
    const wasMatchingStart = start && start._matchesFilter(start.value);
    const wasMatchingEnd = end && end._matchesFilter(start.value);
    this._dateFilter = value;
    if (start && start._matchesFilter(start.value) !== wasMatchingStart) {
      start._validatorOnChange();
    }
    if (end && end._matchesFilter(end.value) !== wasMatchingEnd) {
      end._validatorOnChange();
    }
  }
  _dateFilter;
  get min() {
    return this._min;
  }
  set min(value) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._revalidate();
    }
  }
  _min;
  get max() {
    return this._max;
  }
  set max(value) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._revalidate();
    }
  }
  _max;
  get disabled() {
    return this._startInput && this._endInput ? this._startInput.disabled && this._endInput.disabled : this._groupDisabled;
  }
  set disabled(value) {
    if (value !== this._groupDisabled) {
      this._groupDisabled = value;
      this.stateChanges.next(undefined);
    }
  }
  _groupDisabled = false;
  get errorState() {
    if (this._startInput && this._endInput) {
      return this._startInput.errorState || this._endInput.errorState;
    }
    return false;
  }
  get empty() {
    const startEmpty = this._startInput ? this._startInput.isEmpty() : false;
    const endEmpty = this._endInput ? this._endInput.isEmpty() : false;
    return startEmpty && endEmpty;
  }
  _ariaDescribedBy = null;
  _model;
  separator = '–';
  comparisonStart = null;
  comparisonEnd = null;
  ngControl;
  stateChanges = new Subject();
  disableAutomaticLabeling = true;
  constructor() {
    if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (this._formField?._elementRef.nativeElement.classList.contains('mat-mdc-form-field')) {
      this._elementRef.nativeElement.classList.add('mat-mdc-input-element', 'mat-mdc-form-field-input-control', 'mdc-text-field__input');
    }
    this.ngControl = inject(ControlContainer, {
      optional: true,
      self: true
    });
  }
  get describedByIds() {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute('aria-describedby');
    return existingDescribedBy?.split(' ') || [];
  }
  setDescribedByIds(ids) {
    this._ariaDescribedBy = ids.length ? ids.join(' ') : null;
  }
  onContainerClick() {
    if (!this.focused && !this.disabled) {
      if (!this._model || !this._model.selection.start) {
        this._startInput.focus();
      } else {
        this._endInput.focus();
      }
    }
  }
  ngAfterContentInit() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._startInput) {
        throw Error('mat-date-range-input must contain a matStartDate input');
      }
      if (!this._endInput) {
        throw Error('mat-date-range-input must contain a matEndDate input');
      }
    }
    if (this._model) {
      this._registerModel(this._model);
    }
    merge(this._startInput.stateChanges, this._endInput.stateChanges).subscribe(() => {
      this.stateChanges.next(undefined);
    });
  }
  ngOnChanges(changes) {
    if (dateInputsHaveChanged(changes, this._dateAdapter)) {
      this.stateChanges.next(undefined);
    }
  }
  ngOnDestroy() {
    this._closedSubscription.unsubscribe();
    this._openedSubscription.unsubscribe();
    this.stateChanges.complete();
  }
  getStartValue() {
    return this.value ? this.value.start : null;
  }
  getThemePalette() {
    return this._formField ? this._formField.color : undefined;
  }
  getConnectedOverlayOrigin() {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }
  getOverlayLabelId() {
    return this._formField ? this._formField.getLabelId() : null;
  }
  _getInputMirrorValue(part) {
    const input = part === 'start' ? this._startInput : this._endInput;
    return input ? input.getMirrorValue() : '';
  }
  _shouldHidePlaceholders() {
    return this._startInput ? !this._startInput.isEmpty() : false;
  }
  _handleChildValueChange() {
    this.stateChanges.next(undefined);
    this._changeDetectorRef.markForCheck();
  }
  _openDatepicker() {
    if (this._rangePicker) {
      this._rangePicker.open();
    }
  }
  _shouldHideSeparator() {
    return (!this._formField || this._formField.getLabelId() && !this._formField._shouldLabelFloat()) && this.empty;
  }
  _getAriaLabelledby() {
    const formField = this._formField;
    return formField && formField._hasFloatingLabel() ? formField._labelId : null;
  }
  _getStartDateAccessibleName() {
    return this._startInput._getAccessibleName();
  }
  _getEndDateAccessibleName() {
    return this._endInput._getAccessibleName();
  }
  _updateFocus(origin) {
    this.focused = origin !== null;
    this.stateChanges.next();
  }
  _revalidate() {
    if (this._startInput) {
      this._startInput._validatorOnChange();
    }
    if (this._endInput) {
      this._endInput._validatorOnChange();
    }
  }
  _registerModel(model) {
    if (this._startInput) {
      this._startInput._registerModel(model);
    }
    if (this._endInput) {
      this._endInput._registerModel(model);
    }
  }
  _isTargetRequired(target) {
    return target?.ngControl?.control?.hasValidator(Validators.required);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDateRangeInput,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "16.1.0",
    version: "21.0.3",
    type: MatDateRangeInput,
    isStandalone: true,
    selector: "mat-date-range-input",
    inputs: {
      rangePicker: "rangePicker",
      required: ["required", "required", booleanAttribute],
      dateFilter: "dateFilter",
      min: "min",
      max: "max",
      disabled: ["disabled", "disabled", booleanAttribute],
      separator: "separator",
      comparisonStart: "comparisonStart",
      comparisonEnd: "comparisonEnd"
    },
    host: {
      attributes: {
        "role": "group"
      },
      properties: {
        "class.mat-date-range-input-hide-placeholders": "_shouldHidePlaceholders()",
        "class.mat-date-range-input-required": "required",
        "attr.id": "id",
        "attr.aria-labelledby": "_getAriaLabelledby()",
        "attr.aria-describedby": "_ariaDescribedBy",
        "attr.data-mat-calendar": "rangePicker ? rangePicker.id : null"
      },
      classAttribute: "mat-date-range-input"
    },
    providers: [{
      provide: MatFormFieldControl,
      useExisting: MatDateRangeInput
    }],
    exportAs: ["matDateRangeInput"],
    usesOnChanges: true,
    ngImport: i0,
    template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('start')}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-wrapper mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('end')}}</span>\n  </div>\n</div>\n\n",
    styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px;color:var(--mat-datepicker-range-input-separator-color, var(--mat-sys-on-surface))}.mat-form-field-disabled .mat-date-range-input-separator{color:var(--mat-datepicker-range-input-disabled-state-separator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}._mat-animation-noopable .mat-date-range-input-separator{transition:none}.mat-date-range-input-separator-hidden{-webkit-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-end-wrapper{flex-grow:1}.mat-date-range-input-inner{position:absolute;top:0;left:0;font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%;height:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner[disabled]{color:var(--mat-datepicker-range-input-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}}._mat-animation-noopable .mat-date-range-input-inner::placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-moz-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-webkit-input-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner:-ms-input-placeholder{transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-mdc-form-field-type-mat-date-range-input .mat-mdc-form-field-infix{width:200px}\n"],
    dependencies: [{
      kind: "directive",
      type: CdkMonitorFocus,
      selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]",
      outputs: ["cdkFocusChange"],
      exportAs: ["cdkMonitorFocus"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDateRangeInput,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-date-range-input',
      exportAs: 'matDateRangeInput',
      host: {
        'class': 'mat-date-range-input',
        '[class.mat-date-range-input-hide-placeholders]': '_shouldHidePlaceholders()',
        '[class.mat-date-range-input-required]': 'required',
        '[attr.id]': 'id',
        'role': 'group',
        '[attr.aria-labelledby]': '_getAriaLabelledby()',
        '[attr.aria-describedby]': '_ariaDescribedBy',
        '[attr.data-mat-calendar]': 'rangePicker ? rangePicker.id : null'
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [{
        provide: MatFormFieldControl,
        useExisting: MatDateRangeInput
      }],
      imports: [CdkMonitorFocus],
      template: "<div\n  class=\"mat-date-range-input-container\"\n  cdkMonitorSubtreeFocus\n  (cdkFocusChange)=\"_updateFocus($event)\">\n  <div class=\"mat-date-range-input-wrapper\">\n    <ng-content select=\"input[matStartDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('start')}}</span>\n  </div>\n\n  <span\n    class=\"mat-date-range-input-separator\"\n    [class.mat-date-range-input-separator-hidden]=\"_shouldHideSeparator()\">{{separator}}</span>\n\n  <div class=\"mat-date-range-input-wrapper mat-date-range-input-end-wrapper\">\n    <ng-content select=\"input[matEndDate]\"></ng-content>\n    <span\n      class=\"mat-date-range-input-mirror\"\n      aria-hidden=\"true\">{{_getInputMirrorValue('end')}}</span>\n  </div>\n</div>\n\n",
      styles: [".mat-date-range-input{display:block;width:100%}.mat-date-range-input-container{display:flex;align-items:center}.mat-date-range-input-separator{transition:opacity 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);margin:0 4px;color:var(--mat-datepicker-range-input-separator-color, var(--mat-sys-on-surface))}.mat-form-field-disabled .mat-date-range-input-separator{color:var(--mat-datepicker-range-input-disabled-state-separator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}._mat-animation-noopable .mat-date-range-input-separator{transition:none}.mat-date-range-input-separator-hidden{-webkit-user-select:none;user-select:none;opacity:0;transition:none}.mat-date-range-input-wrapper{position:relative;overflow:hidden;max-width:calc(50% - 4px)}.mat-date-range-input-end-wrapper{flex-grow:1}.mat-date-range-input-inner{position:absolute;top:0;left:0;font:inherit;background:rgba(0,0,0,0);color:currentColor;border:none;outline:none;padding:0;margin:0;vertical-align:bottom;text-align:inherit;-webkit-appearance:none;width:100%;height:100%}.mat-date-range-input-inner:-moz-ui-invalid{box-shadow:none}.mat-date-range-input-inner::placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-moz-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner::-webkit-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner:-ms-input-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-date-range-input-inner[disabled]{color:var(--mat-datepicker-range-input-disabled-state-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::-moz-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-moz-placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner::-webkit-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner::-webkit-input-placeholder{opacity:0}}.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{-webkit-user-select:none;user-select:none;color:rgba(0,0,0,0) !important;-webkit-text-fill-color:rgba(0,0,0,0);transition:none}@media(forced-colors: active){.mat-form-field-hide-placeholder .mat-date-range-input-inner:-ms-input-placeholder,.mat-date-range-input-hide-placeholders .mat-date-range-input-inner:-ms-input-placeholder{opacity:0}}._mat-animation-noopable .mat-date-range-input-inner::placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-moz-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner::-webkit-input-placeholder{transition:none}._mat-animation-noopable .mat-date-range-input-inner:-ms-input-placeholder{transition:none}.mat-date-range-input-mirror{-webkit-user-select:none;user-select:none;visibility:hidden;white-space:nowrap;display:inline-block;min-width:2px}.mat-mdc-form-field-type-mat-date-range-input .mat-mdc-form-field-infix{width:200px}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    rangePicker: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    dateFilter: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    separator: [{
      type: Input
    }],
    comparisonStart: [{
      type: Input
    }],
    comparisonEnd: [{
      type: Input
    }]
  }
});

function _computeAriaAccessibleName(element) {
  return _computeAriaAccessibleNameInternal(element, true);
}
function ssrSafeIsElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}
function ssrSafeIsHTMLInputElement(node) {
  return node.nodeName === 'INPUT';
}
function ssrSafeIsHTMLTextAreaElement(node) {
  return node.nodeName === 'TEXTAREA';
}
function _computeAriaAccessibleNameInternal(currentNode, isDirectlyReferenced) {
  if (ssrSafeIsElement(currentNode) && isDirectlyReferenced) {
    const labelledbyIds = currentNode.getAttribute?.('aria-labelledby')?.split(/\s+/g) || [];
    const validIdRefs = labelledbyIds.reduce((validIds, id) => {
      const elem = document.getElementById(id);
      if (elem) {
        validIds.push(elem);
      }
      return validIds;
    }, []);
    if (validIdRefs.length) {
      return validIdRefs.map(idRef => {
        return _computeAriaAccessibleNameInternal(idRef, false);
      }).join(' ');
    }
  }
  if (ssrSafeIsElement(currentNode)) {
    const ariaLabel = currentNode.getAttribute('aria-label')?.trim();
    if (ariaLabel) {
      return ariaLabel;
    }
  }
  if (ssrSafeIsHTMLInputElement(currentNode) || ssrSafeIsHTMLTextAreaElement(currentNode)) {
    if (currentNode.labels?.length) {
      return Array.from(currentNode.labels).map(x => _computeAriaAccessibleNameInternal(x, false)).join(' ');
    }
    const placeholder = currentNode.getAttribute('placeholder')?.trim();
    if (placeholder) {
      return placeholder;
    }
    const title = currentNode.getAttribute('title')?.trim();
    if (title) {
      return title;
    }
  }
  return (currentNode.textContent || '').replace(/\s+/g, ' ').trim();
}

class MatDateRangeInputPartBase extends MatDatepickerInputBase {
  _rangeInput = inject(MatDateRangeInput);
  _elementRef = inject(ElementRef);
  _defaultErrorStateMatcher = inject(ErrorStateMatcher);
  _injector = inject(Injector);
  _rawValue = signal('', ...(ngDevMode ? [{
    debugName: "_rawValue"
  }] : []));
  _parentForm = inject(NgForm, {
    optional: true
  });
  _parentFormGroup = inject(FormGroupDirective, {
    optional: true
  });
  ngControl;
  _dir = inject(Directionality, {
    optional: true
  });
  _errorStateTracker;
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value) {
    this._errorStateTracker.matcher = value;
  }
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value) {
    this._errorStateTracker.errorState = value;
  }
  constructor() {
    super();
    this._errorStateTracker = new _ErrorStateTracker(this._defaultErrorStateMatcher, null, this._parentFormGroup, this._parentForm, this.stateChanges);
  }
  ngOnInit() {
    const ngControl = this._injector.get(NgControl, null, {
      optional: true,
      self: true
    });
    if (ngControl) {
      this.ngControl = ngControl;
      this._errorStateTracker.ngControl = ngControl;
    }
  }
  ngAfterContentInit() {
    this._register();
  }
  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
    this._rawValue.set(this._elementRef.nativeElement.value);
  }
  isEmpty() {
    return this._rawValue().length === 0;
  }
  _getPlaceholder() {
    return this._elementRef.nativeElement.placeholder;
  }
  focus() {
    this._elementRef.nativeElement.focus();
  }
  getMirrorValue() {
    const value = this._rawValue();
    return value.length > 0 ? value : this._getPlaceholder();
  }
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }
  _onInput(event) {
    super._onInput(event);
    this._rangeInput._handleChildValueChange();
  }
  _openPopup() {
    this._rangeInput._openDatepicker();
  }
  _getMinDate() {
    return this._rangeInput.min;
  }
  _getMaxDate() {
    return this._rangeInput.max;
  }
  _getDateFilter() {
    return this._rangeInput.dateFilter;
  }
  _parentDisabled() {
    return this._rangeInput._groupDisabled;
  }
  _shouldHandleChangeEvent({
    source
  }) {
    return source !== this._rangeInput._startInput && source !== this._rangeInput._endInput;
  }
  _assignValueProgrammatically(value, reformat) {
    super._assignValueProgrammatically(value, reformat);
    const opposite = this === this._rangeInput._startInput ? this._rangeInput._endInput : this._rangeInput._startInput;
    opposite?._validatorOnChange();
    this._rawValue.set(this._elementRef.nativeElement.value);
  }
  _formatValue(value) {
    super._formatValue(value);
    this._rangeInput._handleChildValueChange();
  }
  _getAccessibleName() {
    return _computeAriaAccessibleName(this._elementRef.nativeElement);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDateRangeInputPartBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDateRangeInputPartBase,
    isStandalone: true,
    inputs: {
      errorStateMatcher: "errorStateMatcher"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDateRangeInputPartBase,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => [],
  propDecorators: {
    errorStateMatcher: [{
      type: Input
    }]
  }
});
class MatStartDate extends MatDateRangeInputPartBase {
  _startValidator = control => {
    const start = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const end = this._model ? this._model.selection.end : null;
    return !start || !end || this._dateAdapter.compareDate(start, end) <= 0 ? null : {
      'matStartDateInvalid': {
        'end': end,
        'actual': start
      }
    };
  };
  _validator = Validators.compose([...super._getValidators(), this._startValidator]);
  _register() {
    this._rangeInput._startInput = this;
  }
  _getValueFromModel(modelValue) {
    return modelValue.start;
  }
  _shouldHandleChangeEvent(change) {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.start ? !!change.selection.start : !change.selection.start || !!this._dateAdapter.compareDate(change.oldValue.start, change.selection.start);
    }
  }
  _assignValueToModel(value) {
    if (this._model) {
      const range = new DateRange(value, this._model.selection.end);
      this._model.updateSelection(range, this);
      this._rangeInput._handleChildValueChange();
    }
  }
  _onKeydown(event) {
    const endInput = this._rangeInput._endInput;
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';
    if ((event.keyCode === RIGHT_ARROW && isLtr || event.keyCode === LEFT_ARROW && !isLtr) && element.selectionStart === element.value.length && element.selectionEnd === element.value.length) {
      event.preventDefault();
      endInput._elementRef.nativeElement.setSelectionRange(0, 0);
      endInput.focus();
    } else {
      super._onKeydown(event);
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStartDate,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStartDate,
    isStandalone: true,
    selector: "input[matStartDate]",
    outputs: {
      dateChange: "dateChange",
      dateInput: "dateInput"
    },
    host: {
      attributes: {
        "type": "text"
      },
      listeners: {
        "input": "_onInput($event)",
        "change": "_onChange()",
        "keydown": "_onKeydown($event)",
        "blur": "_onBlur()"
      },
      properties: {
        "disabled": "disabled",
        "attr.aria-haspopup": "_rangeInput.rangePicker ? \"dialog\" : null",
        "attr.aria-owns": "_rangeInput._ariaOwns() || null",
        "attr.min": "_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()!) : null",
        "attr.max": "_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()!) : null"
      },
      classAttribute: "mat-start-date mat-date-range-input-inner"
    },
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatStartDate,
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: MatStartDate,
      multi: true
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStartDate,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[matStartDate]',
      host: {
        'class': 'mat-start-date mat-date-range-input-inner',
        '[disabled]': 'disabled',
        '(input)': '_onInput($event)',
        '(change)': '_onChange()',
        '(keydown)': '_onKeydown($event)',
        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
        '[attr.aria-owns]': '_rangeInput._ariaOwns() || null',
        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()!) : null',
        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()!) : null',
        '(blur)': '_onBlur()',
        'type': 'text'
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MatStartDate,
        multi: true
      }, {
        provide: NG_VALIDATORS,
        useExisting: MatStartDate,
        multi: true
      }],
      outputs: ['dateChange', 'dateInput']
    }]
  }]
});
class MatEndDate extends MatDateRangeInputPartBase {
  _endValidator = control => {
    const end = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    const start = this._model ? this._model.selection.start : null;
    return !end || !start || this._dateAdapter.compareDate(end, start) >= 0 ? null : {
      'matEndDateInvalid': {
        'start': start,
        'actual': end
      }
    };
  };
  _register() {
    this._rangeInput._endInput = this;
  }
  _validator = Validators.compose([...super._getValidators(), this._endValidator]);
  _getValueFromModel(modelValue) {
    return modelValue.end;
  }
  _shouldHandleChangeEvent(change) {
    if (!super._shouldHandleChangeEvent(change)) {
      return false;
    } else {
      return !change.oldValue?.end ? !!change.selection.end : !change.selection.end || !!this._dateAdapter.compareDate(change.oldValue.end, change.selection.end);
    }
  }
  _assignValueToModel(value) {
    if (this._model) {
      const range = new DateRange(this._model.selection.start, value);
      this._model.updateSelection(range, this);
    }
  }
  _moveCaretToEndOfStartInput() {
    const startInput = this._rangeInput._startInput._elementRef.nativeElement;
    const value = startInput.value;
    if (value.length > 0) {
      startInput.setSelectionRange(value.length, value.length);
    }
    startInput.focus();
  }
  _onKeydown(event) {
    const element = this._elementRef.nativeElement;
    const isLtr = this._dir?.value !== 'rtl';
    if (event.keyCode === BACKSPACE && !element.value) {
      this._moveCaretToEndOfStartInput();
    } else if ((event.keyCode === LEFT_ARROW && isLtr || event.keyCode === RIGHT_ARROW && !isLtr) && element.selectionStart === 0 && element.selectionEnd === 0) {
      event.preventDefault();
      this._moveCaretToEndOfStartInput();
    } else {
      super._onKeydown(event);
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatEndDate,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatEndDate,
    isStandalone: true,
    selector: "input[matEndDate]",
    outputs: {
      dateChange: "dateChange",
      dateInput: "dateInput"
    },
    host: {
      attributes: {
        "type": "text"
      },
      listeners: {
        "input": "_onInput($event)",
        "change": "_onChange()",
        "keydown": "_onKeydown($event)",
        "blur": "_onBlur()"
      },
      properties: {
        "disabled": "disabled",
        "attr.aria-haspopup": "_rangeInput.rangePicker ? \"dialog\" : null",
        "attr.aria-owns": "_rangeInput._ariaOwns() || null",
        "attr.min": "_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()!) : null",
        "attr.max": "_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()!) : null"
      },
      classAttribute: "mat-end-date mat-date-range-input-inner"
    },
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatEndDate,
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: MatEndDate,
      multi: true
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatEndDate,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[matEndDate]',
      host: {
        'class': 'mat-end-date mat-date-range-input-inner',
        '[disabled]': 'disabled',
        '(input)': '_onInput($event)',
        '(change)': '_onChange()',
        '(keydown)': '_onKeydown($event)',
        '[attr.aria-haspopup]': '_rangeInput.rangePicker ? "dialog" : null',
        '[attr.aria-owns]': '_rangeInput._ariaOwns() || null',
        '[attr.min]': '_getMinDate() ? _dateAdapter.toIso8601(_getMinDate()!) : null',
        '[attr.max]': '_getMaxDate() ? _dateAdapter.toIso8601(_getMaxDate()!) : null',
        '(blur)': '_onBlur()',
        'type': 'text'
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MatEndDate,
        multi: true
      }, {
        provide: NG_VALIDATORS,
        useExisting: MatEndDate,
        multi: true
      }],
      outputs: ['dateChange', 'dateInput']
    }]
  }]
});

class MatDateRangePicker extends MatDatepickerBase {
  _forwardContentValues(instance) {
    super._forwardContentValues(instance);
    const input = this.datepickerInput;
    if (input) {
      instance.comparisonStart = input.comparisonStart;
      instance.comparisonEnd = input.comparisonEnd;
      instance.startDateAccessibleName = input._getStartDateAccessibleName();
      instance.endDateAccessibleName = input._getEndDateAccessibleName();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDateRangePicker,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDateRangePicker,
    isStandalone: true,
    selector: "mat-date-range-picker",
    providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER, {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useFactory: () => {
        const parent = inject(MAT_DATE_RANGE_SELECTION_STRATEGY, {
          optional: true,
          skipSelf: true
        });
        return parent || new DefaultMatCalendarRangeStrategy(inject(DateAdapter));
      }
    }, {
      provide: MatDatepickerBase,
      useExisting: MatDateRangePicker
    }],
    exportAs: ["matDateRangePicker"],
    usesInheritance: true,
    ngImport: i0,
    template: '',
    isInline: true,
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDateRangePicker,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-date-range-picker',
      template: '',
      exportAs: 'matDateRangePicker',
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER, {
        provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
        useFactory: () => {
          const parent = inject(MAT_DATE_RANGE_SELECTION_STRATEGY, {
            optional: true,
            skipSelf: true
          });
          return parent || new DefaultMatCalendarRangeStrategy(inject(DateAdapter));
        }
      }, {
        provide: MatDatepickerBase,
        useExisting: MatDateRangePicker
      }]
    }]
  }]
});

class MatDatepickerApply {
  _datepicker = inject(MatDatepickerBase);
  constructor() {}
  _applySelection() {
    this._datepicker._applyPendingSelection();
    this._datepicker.close();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerApply,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerApply,
    isStandalone: true,
    selector: "[matDatepickerApply], [matDateRangePickerApply]",
    host: {
      listeners: {
        "click": "_applySelection()"
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerApply,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matDatepickerApply], [matDateRangePickerApply]',
      host: {
        '(click)': '_applySelection()'
      }
    }]
  }],
  ctorParameters: () => []
});
class MatDatepickerCancel {
  _datepicker = inject(MatDatepickerBase);
  constructor() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerCancel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerCancel,
    isStandalone: true,
    selector: "[matDatepickerCancel], [matDateRangePickerCancel]",
    host: {
      listeners: {
        "click": "_datepicker.close()"
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerCancel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matDatepickerCancel], [matDateRangePickerCancel]',
      host: {
        '(click)': '_datepicker.close()'
      }
    }]
  }],
  ctorParameters: () => []
});
class MatDatepickerActions {
  _datepicker = inject(MatDatepickerBase);
  _viewContainerRef = inject(ViewContainerRef);
  _template;
  _portal;
  constructor() {}
  ngAfterViewInit() {
    this._portal = new TemplatePortal(this._template, this._viewContainerRef);
    this._datepicker.registerActions(this._portal);
  }
  ngOnDestroy() {
    this._datepicker.removeActions(this._portal);
    if (this._portal && this._portal.isAttached) {
      this._portal?.detach();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerActions,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatDatepickerActions,
    isStandalone: true,
    selector: "mat-datepicker-actions, mat-date-range-picker-actions",
    viewQueries: [{
      propertyName: "_template",
      first: true,
      predicate: TemplateRef,
      descendants: true
    }],
    ngImport: i0,
    template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
    isInline: true,
    styles: [".mat-datepicker-actions{display:flex;justify-content:flex-end;align-items:center;padding:0 8px 8px 8px}.mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerActions,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-datepicker-actions, mat-date-range-picker-actions',
      template: `
    <ng-template>
      <div class="mat-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      styles: [".mat-datepicker-actions{display:flex;justify-content:flex-end;align-items:center;padding:0 8px 8px 8px}.mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-datepicker-actions .mat-mdc-button-base+.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _template: [{
      type: ViewChild,
      args: [TemplateRef]
    }]
  }
});

class MatDatepickerModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerModule,
    imports: [MatButtonModule, OverlayModule, A11yModule, PortalModule, MatCalendar, MatCalendarBody, MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon, MatMonthView, MatYearView, MatMultiYearView, MatCalendarHeader, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatDatepickerActions, MatDatepickerCancel, MatDatepickerApply],
    exports: [BidiModule, CdkScrollableModule, MatCalendar, MatCalendarBody, MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon, MatMonthView, MatYearView, MatMultiYearView, MatCalendarHeader, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatDatepickerActions, MatDatepickerCancel, MatDatepickerApply]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatDatepickerModule,
    providers: [MatDatepickerIntl],
    imports: [MatButtonModule, OverlayModule, A11yModule, PortalModule, MatDatepickerContent, MatDatepickerToggle, MatCalendarHeader, BidiModule, CdkScrollableModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatDatepickerModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [MatButtonModule, OverlayModule, A11yModule, PortalModule, MatCalendar, MatCalendarBody, MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon, MatMonthView, MatYearView, MatMultiYearView, MatCalendarHeader, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatDatepickerActions, MatDatepickerCancel, MatDatepickerApply],
      exports: [BidiModule, CdkScrollableModule, MatCalendar, MatCalendarBody, MatDatepicker, MatDatepickerContent, MatDatepickerInput, MatDatepickerToggle, MatDatepickerToggleIcon, MatMonthView, MatYearView, MatMultiYearView, MatCalendarHeader, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatDatepickerActions, MatDatepickerCancel, MatDatepickerApply],
      providers: [MatDatepickerIntl]
    }]
  }]
});

export { DateRange, DefaultMatCalendarRangeStrategy, MAT_DATEPICKER_SCROLL_STRATEGY, MAT_DATEPICKER_VALIDATORS, MAT_DATEPICKER_VALUE_ACCESSOR, MAT_DATE_RANGE_SELECTION_STRATEGY, MatCalendar, MatCalendarBody, MatCalendarCell, MatCalendarHeader, MatDateRangeInput, MatDateRangePicker, MatDateSelectionModel, MatDatepicker, MatDatepickerActions, MatDatepickerApply, MatDatepickerCancel, MatDatepickerContent, MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerIntl, MatDatepickerModule, MatDatepickerToggle, MatDatepickerToggleIcon, MatEndDate, MatMonthView, MatMultiYearView, MatRangeDateSelectionModel, MatSingleDateSelectionModel, MatStartDate, MatYearView, yearsPerPage, yearsPerRow };
//# sourceMappingURL=datepicker.mjs.map
