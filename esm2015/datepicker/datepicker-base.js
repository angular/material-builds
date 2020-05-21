/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef, Directive, } from '@angular/core';
import { DateAdapter, mixinColor, } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { merge, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MatCalendar } from './calendar';
import { matDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateSelectionModel, DateRange, } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy');
/** @docs-private */
export function MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_DATEPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
};
// Boilerplate for applying mixins to MatDatepickerContent.
/** @docs-private */
class MatDatepickerContentBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatDatepickerContentMixinBase = mixinColor(MatDatepickerContentBase);
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
let MatDatepickerContent = /** @class */ (() => {
    let MatDatepickerContent = class MatDatepickerContent extends _MatDatepickerContentMixinBase {
        constructor(elementRef, 
        /**
         * @deprecated `_changeDetectorRef`, `_model` and `_rangeSelectionStrategy`
         * parameters to become required.
         * @breaking-change 11.0.0
         */
        _changeDetectorRef, _model, _dateAdapter, _rangeSelectionStrategy) {
            super(elementRef);
            this._changeDetectorRef = _changeDetectorRef;
            this._model = _model;
            this._dateAdapter = _dateAdapter;
            this._rangeSelectionStrategy = _rangeSelectionStrategy;
            /** Current state of the animation. */
            this._animationState = 'enter';
            /** Emits when an animation has finished. */
            this._animationDone = new Subject();
        }
        ngAfterViewInit() {
            this._calendar.focusActiveCell();
        }
        ngOnDestroy() {
            this._animationDone.complete();
        }
        _handleUserSelection(event) {
            // @breaking-change 11.0.0 Remove null checks for _model,
            // _rangeSelectionStrategy and _dateAdapter.
            if (this._model && this._dateAdapter) {
                const selection = this._model.selection;
                const value = event.value;
                const isRange = selection instanceof DateRange;
                // If we're selecting a range and we have a selection strategy, always pass the value through
                // there. Otherwise don't assign null values to the model, unless we're selecting a range.
                // A null value when picking a range means that the user cancelled the selection (e.g. by
                // pressing escape), whereas when selecting a single value it means that the value didn't
                // change. This isn't very intuitive, but it's here for backwards-compatibility.
                if (isRange && this._rangeSelectionStrategy) {
                    const newSelection = this._rangeSelectionStrategy.selectionFinished(value, selection, event.event);
                    this._model.updateSelection(newSelection, this);
                }
                else if (value && (isRange ||
                    !this._dateAdapter.sameDate(value, selection))) {
                    this._model.add(value);
                }
            }
            if (!this._model || this._model.isComplete()) {
                this.datepicker.close();
            }
        }
        _startExitAnimation() {
            this._animationState = 'void';
            // @breaking-change 11.0.0 Remove null check for `_changeDetectorRef`.
            if (this._changeDetectorRef) {
                this._changeDetectorRef.markForCheck();
            }
        }
        _getSelected() {
            // @breaking-change 11.0.0 Remove null check for `_model`.
            return this._model ? this._model.selection : null;
        }
    };
    __decorate([
        ViewChild(MatCalendar),
        __metadata("design:type", MatCalendar)
    ], MatDatepickerContent.prototype, "_calendar", void 0);
    MatDatepickerContent = __decorate([
        Component({
            selector: 'mat-datepicker-content',
            template: "<mat-calendar cdkTrapFocus\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._minDate\"\n    [maxDate]=\"datepicker._maxDate\"\n    [dateFilter]=\"datepicker._dateFilter\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\">\n</mat-calendar>\n",
            host: {
                'class': 'mat-datepicker-content',
                '[@transformPanel]': '_animationState',
                '(@transformPanel.done)': '_animationDone.next()',
                '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
            },
            animations: [
                matDatepickerAnimations.transformPanel,
                matDatepickerAnimations.fadeInCalendar,
            ],
            exportAs: 'matDatepickerContent',
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            inputs: ['color'],
            styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content-touch{display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}\n"]
        }),
        __param(4, Optional()), __param(4, Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)),
        __metadata("design:paramtypes", [ElementRef,
            ChangeDetectorRef,
            MatDateSelectionModel,
            DateAdapter, Object])
    ], MatDatepickerContent);
    return MatDatepickerContent;
})();
export { MatDatepickerContent };
/** Base class for a datepicker. */
let MatDatepickerBase = /** @class */ (() => {
    let MatDatepickerBase = class MatDatepickerBase {
        constructor(_dialog, _overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _document, _model) {
            this._dialog = _dialog;
            this._overlay = _overlay;
            this._ngZone = _ngZone;
            this._viewContainerRef = _viewContainerRef;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            this._document = _document;
            this._model = _model;
            /** The view that the calendar should start in. */
            this.startView = 'month';
            this._touchUi = false;
            /** Preferred position of the datepicker in the X axis. */
            this.xPosition = 'start';
            /** Preferred position of the datepicker in the Y axis. */
            this.yPosition = 'below';
            /**
             * Emits selected year in multiyear view.
             * This doesn't imply a change on the selected date.
             */
            this.yearSelected = new EventEmitter();
            /**
             * Emits selected month in year view.
             * This doesn't imply a change on the selected date.
             */
            this.monthSelected = new EventEmitter();
            /** Emits when the datepicker has been opened. */
            this.openedStream = new EventEmitter();
            /** Emits when the datepicker has been closed. */
            this.closedStream = new EventEmitter();
            this._opened = false;
            /** The id for the datepicker calendar. */
            this.id = `mat-datepicker-${datepickerUid++}`;
            /** The element that was focused before the datepicker was opened. */
            this._focusedElementBeforeOpen = null;
            /** Emits when the datepicker is disabled. */
            this._disabledChange = new Subject();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            this._scrollStrategy = scrollStrategy;
        }
        /** The date to open the calendar to initially. */
        get startAt() {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datepickerInput ? this._datepickerInput.getStartValue() : null);
        }
        set startAt(value) {
            this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
        }
        /** Color palette to use on the datepicker's calendar. */
        get color() {
            return this._color ||
                (this._datepickerInput ? this._datepickerInput.getThemePalette() : undefined);
        }
        set color(value) {
            this._color = value;
        }
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        get touchUi() { return this._touchUi; }
        set touchUi(value) {
            this._touchUi = coerceBooleanProperty(value);
        }
        /** Whether the datepicker pop-up should be disabled. */
        get disabled() {
            return this._disabled === undefined && this._datepickerInput ?
                this._datepickerInput.disabled : !!this._disabled;
        }
        set disabled(value) {
            const newValue = coerceBooleanProperty(value);
            if (newValue !== this._disabled) {
                this._disabled = newValue;
                this._disabledChange.next(newValue);
            }
        }
        /** Whether the calendar is open. */
        get opened() { return this._opened; }
        set opened(value) { value ? this.open() : this.close(); }
        /** The minimum selectable date. */
        get _minDate() {
            return this._datepickerInput && this._datepickerInput.min;
        }
        /** The maximum selectable date. */
        get _maxDate() {
            return this._datepickerInput && this._datepickerInput.max;
        }
        get _dateFilter() {
            return this._datepickerInput && this._datepickerInput.dateFilter;
        }
        ngOnChanges(changes) {
            const positionChange = changes['xPosition'] || changes['yPosition'];
            if (positionChange && !positionChange.firstChange && this._popupRef) {
                this._setConnectedPositions(this._popupRef.getConfig().positionStrategy);
                if (this.opened) {
                    this._popupRef.updatePosition();
                }
            }
        }
        ngOnDestroy() {
            this._destroyPopup();
            this.close();
            this._disabledChange.complete();
        }
        /** Selects the given date */
        select(date) {
            this._model.add(date);
        }
        /** Emits the selected year in multiyear view */
        _selectYear(normalizedYear) {
            this.yearSelected.emit(normalizedYear);
        }
        /** Emits selected month in year view */
        _selectMonth(normalizedMonth) {
            this.monthSelected.emit(normalizedMonth);
        }
        /**
         * Register an input with this datepicker.
         * @param input The datepicker input to register with this datepicker.
         * @returns Selection model that the input should hook itself up to.
         */
        _registerInput(input) {
            if (this._datepickerInput) {
                throw Error('A MatDatepicker can only be associated with a single input.');
            }
            this._datepickerInput = input;
            return this._model;
        }
        /** Open the calendar. */
        open() {
            if (this._opened || this.disabled) {
                return;
            }
            if (!this._datepickerInput) {
                throw Error('Attempted to open an MatDatepicker with no associated input.');
            }
            if (this._document) {
                this._focusedElementBeforeOpen = this._document.activeElement;
            }
            this.touchUi ? this._openAsDialog() : this._openAsPopup();
            this._opened = true;
            this.openedStream.emit();
        }
        /** Close the calendar. */
        close() {
            if (!this._opened) {
                return;
            }
            if (this._popupComponentRef && this._popupRef) {
                const instance = this._popupComponentRef.instance;
                instance._startExitAnimation();
                instance._animationDone.pipe(take(1)).subscribe(() => this._destroyPopup());
            }
            if (this._dialogRef) {
                this._dialogRef.close();
                this._dialogRef = null;
            }
            const completeClose = () => {
                // The `_opened` could've been reset already if
                // we got two events in quick succession.
                if (this._opened) {
                    this._opened = false;
                    this.closedStream.emit();
                    this._focusedElementBeforeOpen = null;
                }
            };
            if (this._focusedElementBeforeOpen &&
                typeof this._focusedElementBeforeOpen.focus === 'function') {
                // Because IE moves focus asynchronously, we can't count on it being restored before we've
                // marked the datepicker as closed. If the event fires out of sequence and the element that
                // we're refocusing opens the datepicker on focus, the user could be stuck with not being
                // able to close the calendar at all. We work around it by making the logic, that marks
                // the datepicker as closed, async as well.
                this._focusedElementBeforeOpen.focus();
                setTimeout(completeClose);
            }
            else {
                completeClose();
            }
        }
        /** Open the calendar as a dialog. */
        _openAsDialog() {
            // Usually this would be handled by `open` which ensures that we can only have one overlay
            // open at a time, however since we reset the variables in async handlers some overlays
            // may slip through if the user opens and closes multiple times in quick succession (e.g.
            // by holding down the enter key).
            if (this._dialogRef) {
                this._dialogRef.close();
            }
            this._dialogRef = this._dialog.open(MatDatepickerContent, {
                direction: this._dir ? this._dir.value : 'ltr',
                viewContainerRef: this._viewContainerRef,
                panelClass: 'mat-datepicker-dialog',
                // These values are all the same as the defaults, but we set them explicitly so that the
                // datepicker dialog behaves consistently even if the user changed the defaults.
                hasBackdrop: true,
                disableClose: false,
                width: '',
                height: '',
                minWidth: '',
                minHeight: '',
                maxWidth: '80vw',
                maxHeight: '',
                position: {},
                autoFocus: true,
                // `MatDialog` has focus restoration built in, however we want to disable it since the
                // datepicker also has focus restoration for dropdown mode. We want to do this, in order
                // to ensure that the timing is consistent between dropdown and dialog modes since `MatDialog`
                // restores focus when the animation is finished, but the datepicker does it immediately.
                // Furthermore, this avoids any conflicts where the datepicker consumer might move focus
                // inside the `closed` event which is dispatched immediately.
                restoreFocus: false
            });
            this._dialogRef.afterClosed().subscribe(() => this.close());
            this._forwardContentValues(this._dialogRef.componentInstance);
        }
        /** Open the calendar as a popup. */
        _openAsPopup() {
            const portal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
            this._destroyPopup();
            this._createPopup();
            this._popupComponentRef = this._popupRef.attach(portal);
            this._forwardContentValues(this._popupComponentRef.instance);
            // Update the position once the calendar has rendered.
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this._popupRef.updatePosition();
            });
        }
        /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
        _forwardContentValues(instance) {
            instance.datepicker = this;
            instance.color = this.color;
        }
        /** Create the popup. */
        _createPopup() {
            const positionStrategy = this._overlay.position()
                .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
                .withTransformOriginOn('.mat-datepicker-content')
                .withFlexibleDimensions(false)
                .withViewportMargin(8)
                .withLockedPosition();
            const overlayConfig = new OverlayConfig({
                positionStrategy: this._setConnectedPositions(positionStrategy),
                hasBackdrop: true,
                backdropClass: 'mat-overlay-transparent-backdrop',
                direction: this._dir,
                scrollStrategy: this._scrollStrategy(),
                panelClass: 'mat-datepicker-popup',
            });
            this._popupRef = this._overlay.create(overlayConfig);
            this._popupRef.overlayElement.setAttribute('role', 'dialog');
            merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter(event => {
                // Closing on alt + up is only valid when there's an input associated with the datepicker.
                return event.keyCode === ESCAPE ||
                    (this._datepickerInput && event.altKey && event.keyCode === UP_ARROW);
            }))).subscribe(event => {
                if (event) {
                    event.preventDefault();
                }
                this.close();
            });
        }
        /** Destroys the current popup overlay. */
        _destroyPopup() {
            if (this._popupRef) {
                this._popupRef.dispose();
                this._popupRef = this._popupComponentRef = null;
            }
        }
        /** Sets the positions of the datepicker in dropdown mode based on the current configuration. */
        _setConnectedPositions(strategy) {
            const primaryX = this.xPosition === 'end' ? 'end' : 'start';
            const secondaryX = primaryX === 'start' ? 'end' : 'start';
            const primaryY = this.yPosition === 'above' ? 'bottom' : 'top';
            const secondaryY = primaryY === 'top' ? 'bottom' : 'top';
            return strategy.withPositions([
                {
                    originX: primaryX,
                    originY: secondaryY,
                    overlayX: primaryX,
                    overlayY: primaryY
                },
                {
                    originX: primaryX,
                    originY: primaryY,
                    overlayX: primaryX,
                    overlayY: secondaryY
                },
                {
                    originX: secondaryX,
                    originY: secondaryY,
                    overlayX: secondaryX,
                    overlayY: primaryY
                },
                {
                    originX: secondaryX,
                    originY: primaryY,
                    overlayX: secondaryX,
                    overlayY: secondaryY
                }
            ]);
        }
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        _getValidDateOrNull(obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatDatepickerBase.prototype, "calendarHeaderComponent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatDatepickerBase.prototype, "startAt", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatDatepickerBase.prototype, "startView", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatDatepickerBase.prototype, "color", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDatepickerBase.prototype, "touchUi", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDatepickerBase.prototype, "disabled", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatDatepickerBase.prototype, "xPosition", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatDatepickerBase.prototype, "yPosition", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatDatepickerBase.prototype, "yearSelected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], MatDatepickerBase.prototype, "monthSelected", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MatDatepickerBase.prototype, "panelClass", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Function)
    ], MatDatepickerBase.prototype, "dateClass", void 0);
    __decorate([
        Output('opened'),
        __metadata("design:type", EventEmitter)
    ], MatDatepickerBase.prototype, "openedStream", void 0);
    __decorate([
        Output('closed'),
        __metadata("design:type", EventEmitter)
    ], MatDatepickerBase.prototype, "closedStream", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatDatepickerBase.prototype, "opened", null);
    MatDatepickerBase = __decorate([
        Directive(),
        __param(4, Inject(MAT_DATEPICKER_SCROLL_STRATEGY)),
        __param(5, Optional()),
        __param(6, Optional()),
        __param(7, Optional()), __param(7, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [MatDialog,
            Overlay,
            NgZone,
            ViewContainerRef, Object, DateAdapter,
            Directionality, Object, MatDateSelectionModel])
    ], MatDatepickerBase);
    return MatDatepickerBase;
})();
export { MatDatepickerBase };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RCxPQUFPLEVBQ0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFDbkUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsV0FBVyxFQUNYLFVBQVUsR0FFWCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUNoRCxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdkMsT0FBTyxFQUFD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aUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBVUF9BUlJPV30gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgRGF0ZUFkYXB0ZXIsXG4gIG1peGluQ29sb3IsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZywgTWF0RGlhbG9nUmVmfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHttZXJnZSwgU3ViamVjdCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDYWxlbmRhcn0gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQge21hdERhdGVwaWNrZXJBbmltYXRpb25zfSBmcm9tICcuL2RhdGVwaWNrZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJDZWxsQ3NzQ2xhc3NlcywgTWF0Q2FsZW5kYXJVc2VyRXZlbnR9IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge0RhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtcbiAgRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbixcbiAgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBEYXRlUmFuZ2UsXG59IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHtcbiAgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZLFxuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnLi9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneSc7XG5cbi8qKiBVc2VkIHRvIGdlbmVyYXRlIGEgdW5pcXVlIElEIGZvciBlYWNoIGRhdGVwaWNrZXIgaW5zdGFuY2UuICovXG5sZXQgZGF0ZXBpY2tlclVpZCA9IDA7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtZGF0ZXBpY2tlci1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFggYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCcgfCAnZW5kJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFkgYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdERhdGVwaWNrZXJDb250ZW50LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdERhdGVwaWNrZXJDb250ZW50QmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikgeyB9XG59XG5jb25zdCBfTWF0RGF0ZXBpY2tlckNvbnRlbnRNaXhpbkJhc2U6IENhbkNvbG9yQ3RvciAmIHR5cGVvZiBNYXREYXRlcGlja2VyQ29udGVudEJhc2UgPVxuICAgIG1peGluQ29sb3IoTWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdXNlZCBhcyB0aGUgY29udGVudCBmb3IgdGhlIGRhdGVwaWNrZXIgZGlhbG9nIGFuZCBwb3B1cC4gV2UgdXNlIHRoaXMgaW5zdGVhZCBvZiB1c2luZ1xuICogTWF0Q2FsZW5kYXIgZGlyZWN0bHkgYXMgdGhlIGNvbnRlbnQgc28gd2UgY2FuIGNvbnRyb2wgdGhlIGluaXRpYWwgZm9jdXMuIFRoaXMgYWxzbyBnaXZlcyB1cyBhXG4gKiBwbGFjZSB0byBwdXQgYWRkaXRpb25hbCBmZWF0dXJlcyBvZiB0aGUgcG9wdXAgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIGNhbGVuZGFyIGl0c2VsZiBpbiB0aGVcbiAqIGZ1dHVyZS4gKGUuZy4gY29uZmlybWF0aW9uIGJ1dHRvbnMpLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZXBpY2tlci1jb250ZW50JyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlcGlja2VyLWNvbnRlbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlcGlja2VyLWNvbnRlbnQuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuZG9uZSknOiAnX2FuaW1hdGlvbkRvbmUubmV4dCgpJyxcbiAgICAnW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtdG91Y2hdJzogJ2RhdGVwaWNrZXIudG91Y2hVaScsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXREYXRlcGlja2VyQW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbCxcbiAgICBtYXREYXRlcGlja2VyQW5pbWF0aW9ucy5mYWRlSW5DYWxlbmRhcixcbiAgXSxcbiAgZXhwb3J0QXM6ICdtYXREYXRlcGlja2VyQ29udGVudCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gIGV4dGVuZHMgX01hdERhdGVwaWNrZXJDb250ZW50TWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDYW5Db2xvciB7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgY2FsZW5kYXIgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdENhbGVuZGFyKSBfY2FsZW5kYXI6IE1hdENhbGVuZGFyPEQ+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGRhdGVwaWNrZXIgdGhhdCBjcmVhdGVkIHRoZSBvdmVybGF5LiAqL1xuICBkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyQmFzZTxhbnksIFMsIEQ+O1xuXG4gIC8qKiBTdGFydCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvblN0YXJ0OiBEIHwgbnVsbDtcblxuICAvKiogRW5kIG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBjb21wYXJpc29uRW5kOiBEIHwgbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpcyBhYm92ZSBvciBiZWxvdyB0aGUgaW5wdXQuICovXG4gIF9pc0Fib3ZlOiBib29sZWFuO1xuXG4gIC8qKiBDdXJyZW50IHN0YXRlIG9mIHRoZSBhbmltYXRpb24uICovXG4gIF9hbmltYXRpb25TdGF0ZTogJ2VudGVyJyB8ICd2b2lkJyA9ICdlbnRlcic7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9jaGFuZ2VEZXRlY3RvclJlZmAsIGBfbW9kZWxgIGFuZCBgX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3lgXG4gICAgICogcGFyYW1ldGVycyB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMS4wLjBcbiAgICAgKi9cbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX21vZGVsPzogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyPzogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1kpXG4gICAgICAgIHByaXZhdGUgX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3k/OiBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneTxEPikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX2NhbGVuZGFyLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX2hhbmRsZVVzZXJTZWxlY3Rpb24oZXZlbnQ6IE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPikge1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBudWxsIGNoZWNrcyBmb3IgX21vZGVsLFxuICAgIC8vIF9yYW5nZVNlbGVjdGlvblN0cmF0ZWd5IGFuZCBfZGF0ZUFkYXB0ZXIuXG4gICAgaWYgKHRoaXMuX21vZGVsICYmIHRoaXMuX2RhdGVBZGFwdGVyKSB7XG4gICAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLl9tb2RlbC5zZWxlY3Rpb247XG4gICAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnZhbHVlO1xuICAgICAgY29uc3QgaXNSYW5nZSA9IHNlbGVjdGlvbiBpbnN0YW5jZW9mIERhdGVSYW5nZTtcblxuICAgICAgLy8gSWYgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UgYW5kIHdlIGhhdmUgYSBzZWxlY3Rpb24gc3RyYXRlZ3ksIGFsd2F5cyBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAgICAvLyB0aGVyZS4gT3RoZXJ3aXNlIGRvbid0IGFzc2lnbiBudWxsIHZhbHVlcyB0byB0aGUgbW9kZWwsIHVubGVzcyB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZS5cbiAgICAgIC8vIEEgbnVsbCB2YWx1ZSB3aGVuIHBpY2tpbmcgYSByYW5nZSBtZWFucyB0aGF0IHRoZSB1c2VyIGNhbmNlbGxlZCB0aGUgc2VsZWN0aW9uIChlLmcuIGJ5XG4gICAgICAvLyBwcmVzc2luZyBlc2NhcGUpLCB3aGVyZWFzIHdoZW4gc2VsZWN0aW5nIGEgc2luZ2xlIHZhbHVlIGl0IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGRpZG4ndFxuICAgICAgLy8gY2hhbmdlLiBUaGlzIGlzbid0IHZlcnkgaW50dWl0aXZlLCBidXQgaXQncyBoZXJlIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbiAgICAgIGlmIChpc1JhbmdlICYmIHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneS5zZWxlY3Rpb25GaW5pc2hlZCh2YWx1ZSxcbiAgICAgICAgICAgIHNlbGVjdGlvbiBhcyB1bmtub3duIGFzIERhdGVSYW5nZTxEPiwgZXZlbnQuZXZlbnQpO1xuICAgICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24obmV3U2VsZWN0aW9uIGFzIHVua25vd24gYXMgUywgdGhpcyk7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlICYmIChpc1JhbmdlIHx8XG4gICAgICAgICAgICAgICAgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbHVlLCBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEKSkpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwuYWRkKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX21vZGVsIHx8IHRoaXMuX21vZGVsLmlzQ29tcGxldGUoKSkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcblxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTEuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgX2NoYW5nZURldGVjdG9yUmVmYC5cbiAgICBpZiAodGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRTZWxlY3RlZCgpIHtcbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDExLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYF9tb2RlbGAuXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsID8gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCB8IERhdGVSYW5nZTxEPiB8IG51bGwgOiBudWxsO1xuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIF9kaXNhYmxlZENoYW5nZTogT2JzZXJ2YWJsZTxib29sZWFuPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGEgZGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdERhdGVwaWNrZXJCYXNlPEMgZXh0ZW5kcyBNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgUyxcbiAgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+IGltcGxlbWVudHMgT25EZXN0cm95LCBDYW5Db2xvciwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBBbiBpbnB1dCBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIHRoZSBjdXN0b20gaGVhZGVyIGNvbXBvbmVudCBmb3IgdGhlIGNhbGVuZGFyLCBpZiBzZXQuICovXG4gIEBJbnB1dCgpIGNhbGVuZGFySGVhZGVyQ29tcG9uZW50OiBDb21wb25lbnRUeXBlPGFueT47XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiB0aGlzLl9zdGFydEF0IHx8ICh0aGlzLl9kYXRlcGlja2VySW5wdXQgPyB0aGlzLl9kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2dldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvciB8fFxuICAgICAgICAodGhpcy5fZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5fZGF0ZXBpY2tlcklucHV0LmdldFRoZW1lUGFsZXR0ZSgpIDogdW5kZWZpbmVkKTtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIFVJIGlzIGluIHRvdWNoIG1vZGUuIEluIHRvdWNoIG1vZGUgdGhlIGNhbGVuZGFyIG9wZW5zIGluIGEgZGlhbG9nIHJhdGhlclxuICAgKiB0aGFuIGEgcG9wdXAgYW5kIGVsZW1lbnRzIGhhdmUgbW9yZSBwYWRkaW5nIHRvIGFsbG93IGZvciBiaWdnZXIgdG91Y2ggdGFyZ2V0cy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0b3VjaFVpKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdG91Y2hVaTsgfVxuICBzZXQgdG91Y2hVaSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3RvdWNoVWkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3RvdWNoVWkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3AtdXAgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0ID9cbiAgICAgICAgdGhpcy5fZGF0ZXBpY2tlcklucHV0LmRpc2FibGVkIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fZGlzYWJsZWRDaGFuZ2UubmV4dChuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeFBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeVBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYmVsb3cnO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBzZWxlY3RlZCB5ZWFyIGluIG11bHRpeWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgeWVhclNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG1vbnRoU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIGRhdGUgcGlja2VyIHBhbmVsLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICBASW5wdXQoKSBwYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgY3VzdG9tIENTUyBjbGFzc2VzIHRvIGRhdGVzLiAqL1xuICBASW5wdXQoKSBkYXRlQ2xhc3M6IChkYXRlOiBEKSA9PiBNYXRDYWxlbmRhckNlbGxDc3NDbGFzc2VzO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgb3BlbmVkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKSBjbG9zZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3BlbmVkOyB9XG4gIHNldCBvcGVuZWQodmFsdWU6IGJvb2xlYW4pIHsgdmFsdWUgPyB0aGlzLm9wZW4oKSA6IHRoaXMuY2xvc2UoKTsgfVxuICBwcml2YXRlIF9vcGVuZWQgPSBmYWxzZTtcblxuICAvKiogVGhlIGlkIGZvciB0aGUgZGF0ZXBpY2tlciBjYWxlbmRhci4gKi9cbiAgaWQ6IHN0cmluZyA9IGBtYXQtZGF0ZXBpY2tlci0ke2RhdGVwaWNrZXJVaWQrK31gO1xuXG4gIC8qKiBUaGUgbWluaW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIGdldCBfbWluRGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLl9kYXRlcGlja2VySW5wdXQubWluO1xuICB9XG5cbiAgLyoqIFRoZSBtYXhpbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgZ2V0IF9tYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5tYXg7XG4gIH1cblxuICBnZXQgX2RhdGVGaWx0ZXIoKTogRGF0ZUZpbHRlckZuPEQ+IHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5kYXRlRmlsdGVyO1xuICB9XG5cbiAgLyoqIEEgcmVmZXJlbmNlIHRvIHRoZSBvdmVybGF5IHdoZW4gdGhlIGNhbGVuZGFyIGlzIG9wZW5lZCBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9wb3B1cFJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG5cbiAgLyoqIEEgcmVmZXJlbmNlIHRvIHRoZSBkaWFsb2cgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9kaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPj4gfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBpbnN0YW50aWF0ZWQgaW4gcG9wdXAgbW9kZS4gKi9cbiAgcHJpdmF0ZSBfcG9wdXBDb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPj4gfCBudWxsO1xuXG4gIC8qKiBUaGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGF0ZXBpY2tlciB3YXMgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW46IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoaXMgZGF0ZXBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIF9kYXRlcGlja2VySW5wdXQ6IEM7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaXMgZGlzYWJsZWQuICovXG4gIHJlYWRvbmx5IF9kaXNhYmxlZENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2csXG4gICAgICAgICAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+KSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlcikge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwb3NpdGlvbkNoYW5nZSA9IGNoYW5nZXNbJ3hQb3NpdGlvbiddIHx8IGNoYW5nZXNbJ3lQb3NpdGlvbiddO1xuXG4gICAgaWYgKHBvc2l0aW9uQ2hhbmdlICYmICFwb3NpdGlvbkNoYW5nZS5maXJzdENoYW5nZSAmJiB0aGlzLl9wb3B1cFJlZikge1xuICAgICAgdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKFxuICAgICAgICAgIHRoaXMuX3BvcHVwUmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTtcblxuICAgICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICAgIHRoaXMuX3BvcHVwUmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveVBvcHVwKCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2Rpc2FibGVkQ2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gZGF0ZSAqL1xuICBzZWxlY3QoZGF0ZTogRCk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsLmFkZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldyAqL1xuICBfc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogRCk6IHZvaWQge1xuICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQobm9ybWFsaXplZFllYXIpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldyAqL1xuICBfc2VsZWN0TW9udGgobm9ybWFsaXplZE1vbnRoOiBEKTogdm9pZCB7XG4gICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRlcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gbW9kZWwgdGhhdCB0aGUgaW5wdXQgc2hvdWxkIGhvb2sgaXRzZWxmIHVwIHRvLlxuICAgKi9cbiAgX3JlZ2lzdGVySW5wdXQoaW5wdXQ6IEMpOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4ge1xuICAgIGlmICh0aGlzLl9kYXRlcGlja2VySW5wdXQpIHtcbiAgICAgIHRocm93IEVycm9yKCdBIE1hdERhdGVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cbiAgICB0aGlzLl9kYXRlcGlja2VySW5wdXQgPSBpbnB1dDtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWw7XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5fZGF0ZXBpY2tlcklucHV0KSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGVkIHRvIG9wZW4gYW4gTWF0RGF0ZXBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9kb2N1bWVudCkge1xuICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICB0aGlzLnRvdWNoVWkgPyB0aGlzLl9vcGVuQXNEaWFsb2coKSA6IHRoaXMuX29wZW5Bc1BvcHVwKCk7XG4gICAgdGhpcy5fb3BlbmVkID0gdHJ1ZTtcbiAgICB0aGlzLm9wZW5lZFN0cmVhbS5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgdGhlIGNhbGVuZGFyLiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX29wZW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fcG9wdXBDb21wb25lbnRSZWYgJiYgdGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5fcG9wdXBDb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgICBpbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgICBpbnN0YW5jZS5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9kZXN0cm95UG9wdXAoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgICAgdGhpcy5fZGlhbG9nUmVmID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wbGV0ZUNsb3NlID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIGBfb3BlbmVkYCBjb3VsZCd2ZSBiZWVuIHJlc2V0IGFscmVhZHkgaWZcbiAgICAgIC8vIHdlIGdvdCB0d28gZXZlbnRzIGluIHF1aWNrIHN1Y2Nlc3Npb24uXG4gICAgICBpZiAodGhpcy5fb3BlbmVkKSB7XG4gICAgICAgIHRoaXMuX29wZW5lZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3NlZFN0cmVhbS5lbWl0KCk7XG4gICAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gJiZcbiAgICAgIHR5cGVvZiB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuLmZvY3VzKCk7XG4gICAgICBzZXRUaW1lb3V0KGNvbXBsZXRlQ2xvc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wbGV0ZUNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9vcGVuQXNEaWFsb2coKTogdm9pZCB7XG4gICAgLy8gVXN1YWxseSB0aGlzIHdvdWxkIGJlIGhhbmRsZWQgYnkgYG9wZW5gIHdoaWNoIGVuc3VyZXMgdGhhdCB3ZSBjYW4gb25seSBoYXZlIG9uZSBvdmVybGF5XG4gICAgLy8gb3BlbiBhdCBhIHRpbWUsIGhvd2V2ZXIgc2luY2Ugd2UgcmVzZXQgdGhlIHZhcmlhYmxlcyBpbiBhc3luYyBoYW5kbGVycyBzb21lIG92ZXJsYXlzXG4gICAgLy8gbWF5IHNsaXAgdGhyb3VnaCBpZiB0aGUgdXNlciBvcGVucyBhbmQgY2xvc2VzIG11bHRpcGxlIHRpbWVzIGluIHF1aWNrIHN1Y2Nlc3Npb24gKGUuZy5cbiAgICAvLyBieSBob2xkaW5nIGRvd24gdGhlIGVudGVyIGtleSkuXG4gICAgaWYgKHRoaXMuX2RpYWxvZ1JlZikge1xuICAgICAgdGhpcy5fZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZGlhbG9nUmVmID0gdGhpcy5fZGlhbG9nLm9wZW48TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+KE1hdERhdGVwaWNrZXJDb250ZW50LCB7XG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInLFxuICAgICAgdmlld0NvbnRhaW5lclJlZjogdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtZGF0ZXBpY2tlci1kaWFsb2cnLFxuXG4gICAgICAvLyBUaGVzZSB2YWx1ZXMgYXJlIGFsbCB0aGUgc2FtZSBhcyB0aGUgZGVmYXVsdHMsIGJ1dCB3ZSBzZXQgdGhlbSBleHBsaWNpdGx5IHNvIHRoYXQgdGhlXG4gICAgICAvLyBkYXRlcGlja2VyIGRpYWxvZyBiZWhhdmVzIGNvbnNpc3RlbnRseSBldmVuIGlmIHRoZSB1c2VyIGNoYW5nZWQgdGhlIGRlZmF1bHRzLlxuICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICBkaXNhYmxlQ2xvc2U6IGZhbHNlLFxuICAgICAgd2lkdGg6ICcnLFxuICAgICAgaGVpZ2h0OiAnJyxcbiAgICAgIG1pbldpZHRoOiAnJyxcbiAgICAgIG1pbkhlaWdodDogJycsXG4gICAgICBtYXhXaWR0aDogJzgwdncnLFxuICAgICAgbWF4SGVpZ2h0OiAnJyxcbiAgICAgIHBvc2l0aW9uOiB7fSxcbiAgICAgIGF1dG9Gb2N1czogdHJ1ZSxcblxuICAgICAgLy8gYE1hdERpYWxvZ2AgaGFzIGZvY3VzIHJlc3RvcmF0aW9uIGJ1aWx0IGluLCBob3dldmVyIHdlIHdhbnQgdG8gZGlzYWJsZSBpdCBzaW5jZSB0aGVcbiAgICAgIC8vIGRhdGVwaWNrZXIgYWxzbyBoYXMgZm9jdXMgcmVzdG9yYXRpb24gZm9yIGRyb3Bkb3duIG1vZGUuIFdlIHdhbnQgdG8gZG8gdGhpcywgaW4gb3JkZXJcbiAgICAgIC8vIHRvIGVuc3VyZSB0aGF0IHRoZSB0aW1pbmcgaXMgY29uc2lzdGVudCBiZXR3ZWVuIGRyb3Bkb3duIGFuZCBkaWFsb2cgbW9kZXMgc2luY2UgYE1hdERpYWxvZ2BcbiAgICAgIC8vIHJlc3RvcmVzIGZvY3VzIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZCwgYnV0IHRoZSBkYXRlcGlja2VyIGRvZXMgaXQgaW1tZWRpYXRlbHkuXG4gICAgICAvLyBGdXJ0aGVybW9yZSwgdGhpcyBhdm9pZHMgYW55IGNvbmZsaWN0cyB3aGVyZSB0aGUgZGF0ZXBpY2tlciBjb25zdW1lciBtaWdodCBtb3ZlIGZvY3VzXG4gICAgICAvLyBpbnNpZGUgdGhlIGBjbG9zZWRgIGV2ZW50IHdoaWNoIGlzIGRpc3BhdGNoZWQgaW1tZWRpYXRlbHkuXG4gICAgICByZXN0b3JlRm9jdXM6IGZhbHNlXG4gICAgfSk7XG5cbiAgICB0aGlzLl9kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jbG9zZSgpKTtcbiAgICB0aGlzLl9mb3J3YXJkQ29udGVudFZhbHVlcyh0aGlzLl9kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UpO1xuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX29wZW5Bc1BvcHVwKCk6IHZvaWQge1xuICAgIGNvbnN0IHBvcnRhbCA9IG5ldyBDb21wb25lbnRQb3J0YWw8TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+KE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuXG4gICAgdGhpcy5fZGVzdHJveVBvcHVwKCk7XG4gICAgdGhpcy5fY3JlYXRlUG9wdXAoKTtcbiAgICB0aGlzLl9wb3B1cENvbXBvbmVudFJlZiA9IHRoaXMuX3BvcHVwUmVmIS5hdHRhY2gocG9ydGFsKTtcbiAgICB0aGlzLl9mb3J3YXJkQ29udGVudFZhbHVlcyh0aGlzLl9wb3B1cENvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9uY2UgdGhlIGNhbGVuZGFyIGhhcyByZW5kZXJlZC5cbiAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcG9wdXBSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogRm9yd2FyZHMgcmVsZXZhbnQgdmFsdWVzIGZyb20gdGhlIGRhdGVwaWNrZXIgdG8gdGhlIGRhdGVwaWNrZXIgY29udGVudCBpbnNpZGUgdGhlIG92ZXJsYXkuICovXG4gIHByb3RlY3RlZCBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+KSB7XG4gICAgaW5zdGFuY2UuZGF0ZXBpY2tlciA9IHRoaXM7XG4gICAgaW5zdGFuY2UuY29sb3IgPSB0aGlzLmNvbG9yO1xuICB9XG5cbiAgLyoqIENyZWF0ZSB0aGUgcG9wdXAuICovXG4gIHByaXZhdGUgX2NyZWF0ZVBvcHVwKCk6IHZvaWQge1xuICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkpXG4gICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGVwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMocG9zaXRpb25TdHJhdGVneSksXG4gICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6ICdtYXQtb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcCcsXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgcGFuZWxDbGFzczogJ21hdC1kYXRlcGlja2VyLXBvcHVwJyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gICAgdGhpcy5fcG9wdXBSZWYub3ZlcmxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgbWVyZ2UoXG4gICAgICB0aGlzLl9wb3B1cFJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICB0aGlzLl9wb3B1cFJlZi5kZXRhY2htZW50cygpLFxuICAgICAgdGhpcy5fcG9wdXBSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gQ2xvc2luZyBvbiBhbHQgKyB1cCBpcyBvbmx5IHZhbGlkIHdoZW4gdGhlcmUncyBhbiBpbnB1dCBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAgICAgIHJldHVybiBldmVudC5rZXlDb2RlID09PSBFU0NBUEUgfHxcbiAgICAgICAgICAgICAgICh0aGlzLl9kYXRlcGlja2VySW5wdXQgJiYgZXZlbnQuYWx0S2V5ICYmIGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XKTtcbiAgICAgIH0pKVxuICAgICkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIGN1cnJlbnQgcG9wdXAgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBvcHVwKCkge1xuICAgIGlmICh0aGlzLl9wb3B1cFJlZikge1xuICAgICAgdGhpcy5fcG9wdXBSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fcG9wdXBSZWYgPSB0aGlzLl9wb3B1cENvbXBvbmVudFJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvZiB0aGUgZGF0ZXBpY2tlciBpbiBkcm9wZG93biBtb2RlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24uICovXG4gIHByaXZhdGUgX3NldENvbm5lY3RlZFBvc2l0aW9ucyhzdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgY29uc3QgcHJpbWFyeVggPSB0aGlzLnhQb3NpdGlvbiA9PT0gJ2VuZCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgY29uc3Qgc2Vjb25kYXJ5WCA9IHByaW1hcnlYID09PSAnc3RhcnQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHByaW1hcnlZID0gdGhpcy55UG9zaXRpb24gPT09ICdhYm92ZScgPyAnYm90dG9tJyA6ICd0b3AnO1xuICAgIGNvbnN0IHNlY29uZGFyeVkgPSBwcmltYXJ5WSA9PT0gJ3RvcCcgPyAnYm90dG9tJyA6ICd0b3AnO1xuXG4gICAgcmV0dXJuIHN0cmF0ZWd5LndpdGhQb3NpdGlvbnMoW1xuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHByaW1hcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHByaW1hcnlYLFxuICAgICAgICBvcmlnaW5ZOiBwcmltYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHByaW1hcnlYLFxuICAgICAgICBvdmVybGF5WTogc2Vjb25kYXJ5WVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogc2Vjb25kYXJ5WVxuICAgICAgfVxuICAgIF0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBjaGVjay5cbiAgICogQHJldHVybnMgVGhlIGdpdmVuIG9iamVjdCBpZiBpdCBpcyBib3RoIGEgZGF0ZSBpbnN0YW5jZSBhbmQgdmFsaWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0VmFsaWREYXRlT3JOdWxsKG9iajogYW55KTogRCB8IG51bGwge1xuICAgIHJldHVybiAodGhpcy5fZGF0ZUFkYXB0ZXIuaXNEYXRlSW5zdGFuY2Uob2JqKSAmJiB0aGlzLl9kYXRlQWRhcHRlci5pc1ZhbGlkKG9iaikpID8gb2JqIDogbnVsbDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdG91Y2hVaTogQm9vbGVhbklucHV0O1xufVxuIl19