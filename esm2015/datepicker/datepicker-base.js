/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef, Directive, } from '@angular/core';
import { DateAdapter, mixinColor, } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MatCalendar } from './calendar';
import { matDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateSelectionModel, DateRange, } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import { MatDatepickerIntl } from './datepicker-intl';
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
export class MatDatepickerContent extends _MatDatepickerContentMixinBase {
    constructor(elementRef, _changeDetectorRef, _model, _dateAdapter, _rangeSelectionStrategy, 
    /**
     * @deprecated `intl` argument to become required.
     * @breaking-change 12.0.0
     */
    intl) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._model = _model;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        this._subscriptions = new Subscription();
        /** Current state of the animation. */
        this._animationState = 'enter';
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        // @breaking-change 12.0.0 Remove fallback for `intl`.
        this._closeButtonText = (intl === null || intl === void 0 ? void 0 : intl.closeCalendarLabel) || 'Close calendar';
    }
    ngAfterViewInit() {
        this._subscriptions.add(this.datepicker.stateChanges.subscribe(() => {
            this._changeDetectorRef.markForCheck();
        }));
        this._calendar.focusActiveCell();
    }
    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        this._animationDone.complete();
    }
    _handleUserSelection(event) {
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
        if (!this._model || this._model.isComplete()) {
            this.datepicker.close();
        }
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    _getSelected() {
        return this._model.selection;
    }
}
MatDatepickerContent.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker-content',
                template: "<div cdkTrapFocus>\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"></mat-calendar>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    color=\"primary\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n",
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
                styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.mat-datepicker-content-touch{display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-calendar{min-width:250px;min-height:312px;max-width:750px;max-height:788px}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-calendar{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-calendar{width:80vw;height:100vw}}\n"]
            },] }
];
MatDatepickerContent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatDateSelectionModel },
    { type: DateAdapter },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_RANGE_SELECTION_STRATEGY,] }] },
    { type: MatDatepickerIntl }
];
MatDatepickerContent.propDecorators = {
    _calendar: [{ type: ViewChild, args: [MatCalendar,] }]
};
/** Base class for a datepicker. */
export class MatDatepickerBase {
    constructor(_dialog, _overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _document, _model) {
        this._dialog = _dialog;
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._document = _document;
        this._model = _model;
        this._inputStateChanges = Subscription.EMPTY;
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
        /**
         * Emits when the current view changes.
         */
        this.viewChanged = new EventEmitter(true);
        /** Emits when the datepicker has been opened. */
        this.openedStream = new EventEmitter();
        /** Emits when the datepicker has been closed. */
        this.closedStream = new EventEmitter();
        this._opened = false;
        /** The id for the datepicker calendar. */
        this.id = `mat-datepicker-${datepickerUid++}`;
        /** The element that was focused before the datepicker was opened. */
        this._focusedElementBeforeOpen = null;
        /** Unique class that will be added to the backdrop so that the test harnesses can look it up. */
        this._backdropHarnessClass = `${this.id}-backdrop`;
        /** Emits when the datepicker's state changes. */
        this.stateChanges = new Subject();
        if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._scrollStrategy = scrollStrategy;
    }
    /** The date to open the calendar to initially. */
    get startAt() {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        return this._startAt || (this.datepickerInput ? this.datepickerInput.getStartValue() : null);
    }
    set startAt(value) {
        this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
    }
    /** Color palette to use on the datepicker's calendar. */
    get color() {
        return this._color ||
            (this.datepickerInput ? this.datepickerInput.getThemePalette() : undefined);
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
        return this._disabled === undefined && this.datepickerInput ?
            this.datepickerInput.disabled : !!this._disabled;
    }
    set disabled(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._disabled) {
            this._disabled = newValue;
            this.stateChanges.next(undefined);
        }
    }
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
    get panelClass() { return this._panelClass; }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() { return this._opened; }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** The minimum selectable date. */
    _getMinDate() {
        return this.datepickerInput && this.datepickerInput.min;
    }
    /** The maximum selectable date. */
    _getMaxDate() {
        return this.datepickerInput && this.datepickerInput.max;
    }
    _getDateFilter() {
        return this.datepickerInput && this.datepickerInput.dateFilter;
    }
    ngOnChanges(changes) {
        const positionChange = changes['xPosition'] || changes['yPosition'];
        if (positionChange && !positionChange.firstChange && this._popupRef) {
            this._setConnectedPositions(this._popupRef.getConfig().positionStrategy);
            if (this.opened) {
                this._popupRef.updatePosition();
            }
        }
        this.stateChanges.next(undefined);
    }
    ngOnDestroy() {
        this._destroyPopup();
        this.close();
        this._inputStateChanges.unsubscribe();
        this.stateChanges.complete();
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
    /** Emits changed view */
    _viewChanged(view) {
        this.viewChanged.emit(view);
    }
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     * @returns Selection model that the input should hook itself up to.
     */
    registerInput(input) {
        if (this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._inputStateChanges.unsubscribe();
        this.datepickerInput = input;
        this._inputStateChanges =
            input.stateChanges.subscribe(() => this.stateChanges.next(undefined));
        return this._model;
    }
    /** Open the calendar. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
            backdropClass: ['cdk-overlay-dark-backdrop', this._backdropHarnessClass],
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
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
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
            .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mat-datepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        const overlayConfig = new OverlayConfig({
            positionStrategy: this._setConnectedPositions(positionStrategy),
            hasBackdrop: true,
            backdropClass: ['mat-overlay-transparent-backdrop', this._backdropHarnessClass],
            direction: this._dir,
            scrollStrategy: this._scrollStrategy(),
            panelClass: 'mat-datepicker-popup',
        });
        this._popupRef = this._overlay.create(overlayConfig);
        this._popupRef.overlayElement.setAttribute('role', 'dialog');
        merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            return (event.keyCode === ESCAPE && !hasModifierKey(event)) || (this.datepickerInput &&
                hasModifierKey(event, 'altKey') && event.keyCode === UP_ARROW);
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
}
MatDatepickerBase.decorators = [
    { type: Directive }
];
MatDatepickerBase.ctorParameters = () => [
    { type: MatDialog },
    { type: Overlay },
    { type: NgZone },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DATEPICKER_SCROLL_STRATEGY,] }] },
    { type: DateAdapter, decorators: [{ type: Optional }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: MatDateSelectionModel }
];
MatDatepickerBase.propDecorators = {
    calendarHeaderComponent: [{ type: Input }],
    startAt: [{ type: Input }],
    startView: [{ type: Input }],
    color: [{ type: Input }],
    touchUi: [{ type: Input }],
    disabled: [{ type: Input }],
    xPosition: [{ type: Input }],
    yPosition: [{ type: Input }],
    yearSelected: [{ type: Output }],
    monthSelected: [{ type: Output }],
    viewChanged: [{ type: Output }],
    dateClass: [{ type: Input }],
    openedStream: [{ type: Output, args: ['opened',] }],
    closedStream: [{ type: Output, args: ['closed',] }],
    panelClass: [{ type: Input }],
    opened: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RixPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWdCLE1BQU0scUJBQXFCLENBQUM7QUFDbkUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsV0FBVyxFQUNYLFVBQVUsR0FFWCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBYyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsV0FBVyxFQUFrQixNQUFNLFlBQVksQ0FBQztBQUN4RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUcvRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLFNBQVMsR0FDVixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFDTCxpQ0FBaUMsR0FFbEMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxpRUFBaUU7QUFDakUsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBRXRCLHNGQUFzRjtBQUN0RixNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FDdkMsSUFBSSxjQUFjLENBQXVCLGdDQUFnQyxDQUFDLENBQUM7QUFFL0Usb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSxzQ0FBc0MsQ0FBQyxPQUFnQjtJQUNyRSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNyRCxDQUFDO0FBUUQsb0JBQW9CO0FBQ3BCLE1BQU0sQ0FBQyxNQUFNLCtDQUErQyxHQUFHO0lBQzdELE9BQU8sRUFBRSw4QkFBOEI7SUFDdkMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2YsVUFBVSxFQUFFLHNDQUFzQztDQUNuRCxDQUFDO0FBRUYsMkRBQTJEO0FBQzNELG9CQUFvQjtBQUNwQixNQUFNLHdCQUF3QjtJQUM1QixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFJLENBQUM7Q0FDaEQ7QUFDRCxNQUFNLDhCQUE4QixHQUNoQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUV6Qzs7Ozs7O0dBTUc7QUFvQkgsTUFBTSxPQUFPLG9CQUNYLFNBQVEsOEJBQThCO0lBOEJ0QyxZQUNFLFVBQXNCLEVBQ2Qsa0JBQXFDLEVBQ3JDLE1BQW1DLEVBQ25DLFlBQTRCLEVBRXhCLHVCQUF5RDtJQUNyRTs7O09BR0c7SUFDSCxJQUF3QjtRQUN4QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFWVix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW1CO1FBQ3JDLFdBQU0sR0FBTixNQUFNLENBQTZCO1FBQ25DLGlCQUFZLEdBQVosWUFBWSxDQUFnQjtRQUV4Qiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQWtDO1FBbkMvRCxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFpQjVDLHNDQUFzQztRQUN0QyxvQkFBZSxHQUFxQixPQUFPLENBQUM7UUFFNUMsNENBQTRDO1FBQzVDLG1CQUFjLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQXFCbkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxrQkFBa0IsS0FBSSxnQkFBZ0IsQ0FBQztJQUN2RSxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDbEUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxvQkFBb0IsQ0FBQyxLQUFxQztRQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLE1BQU0sT0FBTyxHQUFHLFNBQVMsWUFBWSxTQUFTLENBQUM7UUFFL0MsNkZBQTZGO1FBQzdGLDBGQUEwRjtRQUMxRix5RkFBeUY7UUFDekYseUZBQXlGO1FBQ3pGLGdGQUFnRjtRQUNoRixJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFDckUsU0FBb0MsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsWUFBNEIsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRTthQUFNLElBQUksS0FBSyxJQUFJLENBQUMsT0FBTztZQUNsQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxTQUF5QixDQUFDLENBQUMsRUFBRTtZQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxtQkFBbUI7UUFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7UUFDOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQStDLENBQUM7SUFDckUsQ0FBQzs7O1lBL0dGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxtdENBQXNDO2dCQUV0QyxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLHdCQUF3QjtvQkFDakMsbUJBQW1CLEVBQUUsaUJBQWlCO29CQUN0Qyx3QkFBd0IsRUFBRSx1QkFBdUI7b0JBQ2pELHNDQUFzQyxFQUFFLG9CQUFvQjtpQkFDN0Q7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLHVCQUF1QixDQUFDLGNBQWM7b0JBQ3RDLHVCQUF1QixDQUFDLGNBQWM7aUJBQ3ZDO2dCQUNELFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDOzthQUNsQjs7O1lBckdDLFVBQVU7WUFZVixpQkFBaUI7WUFzQmpCLHFCQUFxQjtZQWRyQixXQUFXOzRDQXNIUixRQUFRLFlBQUksTUFBTSxTQUFDLGlDQUFpQztZQWpHakQsaUJBQWlCOzs7d0JBa0V0QixTQUFTLFNBQUMsV0FBVzs7QUErSHhCLG1DQUFtQztBQUVuQyxNQUFNLE9BQWdCLGlCQUFpQjtJQTBKckMsWUFBb0IsT0FBa0IsRUFDbEIsUUFBaUIsRUFDakIsT0FBZSxFQUNmLGlCQUFtQyxFQUNILGNBQW1CLEVBQ3ZDLFlBQTRCLEVBQzVCLElBQW9CLEVBQ0YsU0FBYyxFQUM1QyxNQUFtQztRQVJuQyxZQUFPLEdBQVAsT0FBTyxDQUFXO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFFdkIsaUJBQVksR0FBWixZQUFZLENBQWdCO1FBQzVCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ0YsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUM1QyxXQUFNLEdBQU4sTUFBTSxDQUE2QjtRQTlKL0MsdUJBQWtCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQWlCaEQsa0RBQWtEO1FBQ3pDLGNBQVMsR0FBb0MsT0FBTyxDQUFDO1FBc0J0RCxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBa0J6QiwwREFBMEQ7UUFFMUQsY0FBUyxHQUFnQyxPQUFPLENBQUM7UUFFakQsMERBQTBEO1FBRTFELGNBQVMsR0FBZ0MsT0FBTyxDQUFDO1FBRWpEOzs7V0FHRztRQUNnQixpQkFBWSxHQUFvQixJQUFJLFlBQVksRUFBSyxDQUFDO1FBRXpFOzs7V0FHRztRQUNnQixrQkFBYSxHQUFvQixJQUFJLFlBQVksRUFBSyxDQUFDO1FBRTFFOztXQUVHO1FBQ2dCLGdCQUFXLEdBQzVCLElBQUksWUFBWSxDQUFrQixJQUFJLENBQUMsQ0FBQztRQUsxQyxpREFBaUQ7UUFDL0IsaUJBQVksR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUU5RSxpREFBaUQ7UUFDL0IsaUJBQVksR0FBdUIsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQW1CdEUsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUV4QiwwQ0FBMEM7UUFDMUMsT0FBRSxHQUFXLGtCQUFrQixhQUFhLEVBQUUsRUFBRSxDQUFDO1FBeUJqRCxxRUFBcUU7UUFDN0QsOEJBQXlCLEdBQXVCLElBQUksQ0FBQztRQUU3RCxpR0FBaUc7UUFDekYsMEJBQXFCLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUM7UUFLdEQsaURBQWlEO1FBQ3hDLGlCQUFZLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQVcxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUN6RSxNQUFNLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDeEMsQ0FBQztJQS9KRCxrREFBa0Q7SUFDbEQsSUFDSSxPQUFPO1FBQ1QsNkZBQTZGO1FBQzdGLHFCQUFxQjtRQUNyQixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBQ0QsSUFBSSxPQUFPLENBQUMsS0FBZTtRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBTUQseURBQXlEO0lBQ3pELElBQ0ksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU07WUFDZCxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFtQjtRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxPQUFPLEtBQWMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNoRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUdELHdEQUF3RDtJQUN4RCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDdkQsQ0FBQztJQUNELElBQUksUUFBUSxDQUFDLEtBQWM7UUFDekIsTUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUMsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFzQ0Q7OztPQUdHO0lBQ0gsSUFDSSxVQUFVLEtBQXdCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDaEUsSUFBSSxVQUFVLENBQUMsS0FBd0I7UUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBR0Qsb0NBQW9DO0lBQ3BDLElBQ0ksTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUMsSUFBSSxNQUFNLENBQUMsS0FBYztRQUN2QixxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUQsQ0FBQztJQU1ELG1DQUFtQztJQUNuQyxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO0lBQzFELENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQztJQUMxRCxDQUFDO0lBRUQsY0FBYztRQUNaLE9BQU8sSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQztJQUNqRSxDQUFDO0lBdUNELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXBFLElBQUksY0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25FLElBQUksQ0FBQyxzQkFBc0IsQ0FDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxnQkFBcUQsQ0FBQyxDQUFDO1lBRXRGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ2pDO1NBQ0Y7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRUQsNkJBQTZCO0lBQzdCLE1BQU0sQ0FBQyxJQUFPO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxXQUFXLENBQUMsY0FBaUI7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxZQUFZLENBQUMsZUFBa0I7UUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixZQUFZLENBQUMsSUFBcUI7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsS0FBUTtRQUNwQixJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7WUFDM0UsTUFBTSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUM1RTtRQUNELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsa0JBQWtCO1lBQ25CLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDMUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCx5QkFBeUI7SUFDekIsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pDLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQzVFLE1BQU0sS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7U0FDN0U7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLEtBQUs7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzdDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7WUFDbEQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDL0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1NBQzdFO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7UUFFRCxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7WUFDekIsK0NBQStDO1lBQy9DLHlDQUF5QztZQUN6QyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsSUFBSSxJQUFJLENBQUMseUJBQXlCO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLHlCQUF5QixDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDNUQsMEZBQTBGO1lBQzFGLDJGQUEyRjtZQUMzRix5RkFBeUY7WUFDekYsdUZBQXVGO1lBQ3ZGLDJDQUEyQztZQUMzQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxhQUFhLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFRCxxQ0FBcUM7SUFDN0IsYUFBYTtRQUNuQiwwRkFBMEY7UUFDMUYsdUZBQXVGO1FBQ3ZGLHlGQUF5RjtRQUN6RixrQ0FBa0M7UUFDbEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDekI7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUE2QixvQkFBb0IsRUFBRTtZQUNwRixTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUs7WUFDOUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtZQUN4QyxVQUFVLEVBQUUsdUJBQXVCO1lBRW5DLHdGQUF3RjtZQUN4RixnRkFBZ0Y7WUFDaEYsV0FBVyxFQUFFLElBQUk7WUFDakIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsYUFBYSxFQUFFLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1lBQ3hFLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEVBQUU7WUFDVixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxFQUFFO1lBQ2IsUUFBUSxFQUFFLE1BQU07WUFDaEIsU0FBUyxFQUFFLEVBQUU7WUFDYixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxJQUFJO1lBRWYsc0ZBQXNGO1lBQ3RGLHdGQUF3RjtZQUN4Riw4RkFBOEY7WUFDOUYseUZBQXlGO1lBQ3pGLHdGQUF3RjtZQUN4Riw2REFBNkQ7WUFDN0QsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsb0NBQW9DO0lBQzVCLFlBQVk7UUFDbEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQTZCLG9CQUFvQixFQUNwQixJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV2RixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdELHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNqRCxJQUFJLENBQUMsU0FBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlHQUFpRztJQUN2RixxQkFBcUIsQ0FBQyxRQUFvQztRQUNsRSxRQUFRLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMzQixRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELHdCQUF3QjtJQUNoQixZQUFZO1FBQ2xCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7YUFDOUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2FBQ3JFLHFCQUFxQixDQUFDLHlCQUF5QixDQUFDO2FBQ2hELHNCQUFzQixDQUFDLEtBQUssQ0FBQzthQUM3QixrQkFBa0IsQ0FBQyxDQUFDLENBQUM7YUFDckIsa0JBQWtCLEVBQUUsQ0FBQztRQUV4QixNQUFNLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQztZQUN0QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUM7WUFDL0QsV0FBVyxFQUFFLElBQUk7WUFDakIsYUFBYSxFQUFFLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1lBQy9FLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNwQixjQUFjLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QyxVQUFVLEVBQUUsc0JBQXNCO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUU3RCxLQUFLLENBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsRUFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pELDBGQUEwRjtZQUMxRixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlO2dCQUNoRixjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUMsQ0FDSixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNsQixJQUFJLEtBQUssRUFBRTtnQkFDVCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDeEI7WUFFRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwwQ0FBMEM7SUFDbEMsYUFBYTtRQUNuQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQsZ0dBQWdHO0lBQ3hGLHNCQUFzQixDQUFDLFFBQTJDO1FBQ3hFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM1RCxNQUFNLFVBQVUsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUMxRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDL0QsTUFBTSxVQUFVLEdBQUcsUUFBUSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFekQsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQzVCO2dCQUNFLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsUUFBUSxFQUFFLFVBQVU7YUFDckI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxVQUFVO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBNWFGLFNBQVM7OztZQW5ORixTQUFTO1lBckNmLE9BQU87WUFrQlAsTUFBTTtZQUtOLGdCQUFnQjs0Q0FnWUgsTUFBTSxTQUFDLDhCQUE4QjtZQXRYbEQsV0FBVyx1QkF1WEUsUUFBUTtZQTVaZixjQUFjLHVCQTZaUCxRQUFROzRDQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQTNXeEMscUJBQXFCOzs7c0NBaU5wQixLQUFLO3NCQUdMLEtBQUs7d0JBWUwsS0FBSztvQkFHTCxLQUFLO3NCQWNMLEtBQUs7dUJBUUwsS0FBSzt3QkFnQkwsS0FBSzt3QkFJTCxLQUFLOzJCQU9MLE1BQU07NEJBTU4sTUFBTTswQkFLTixNQUFNO3dCQUlOLEtBQUs7MkJBR0wsTUFBTSxTQUFDLFFBQVE7MkJBR2YsTUFBTSxTQUFDLFFBQVE7eUJBTWYsS0FBSztxQkFRTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZVN0cmluZ0FycmF5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5LCBVUF9BUlJPV30gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q29tcG9uZW50UG9ydGFsLCBDb21wb25lbnRUeXBlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuQ29sb3IsXG4gIENhbkNvbG9yQ3RvcixcbiAgRGF0ZUFkYXB0ZXIsXG4gIG1peGluQ29sb3IsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdERpYWxvZywgTWF0RGlhbG9nUmVmfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuaW1wb3J0IHttZXJnZSwgU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdENhbGVuZGFyLCBNYXRDYWxlbmRhclZpZXd9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHttYXREYXRlcGlja2VyQW5pbWF0aW9uc30gZnJvbSAnLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge01hdENhbGVuZGFyVXNlckV2ZW50LCBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9ufSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7XG4gIEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sXG4gIE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgRGF0ZVJhbmdlLFxufSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSxcbiAgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRlcGlja2VyIGluc3RhbmNlLiAqL1xubGV0IGRhdGVwaWNrZXJVaWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LWRhdGVwaWNrZXItc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnIHwgJ2VuZCc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBZIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXREYXRlcGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXREYXRlcGlja2VyQ29udGVudEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxufVxuY29uc3QgX01hdERhdGVwaWNrZXJDb250ZW50TWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdERhdGVwaWNrZXJDb250ZW50QmFzZSk7XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRlcGlja2VyIGRpYWxvZyBhbmQgcG9wdXAuIFdlIHVzZSB0aGlzIGluc3RlYWQgb2YgdXNpbmdcbiAqIE1hdENhbGVuZGFyIGRpcmVjdGx5IGFzIHRoZSBjb250ZW50IHNvIHdlIGNhbiBjb250cm9sIHRoZSBpbml0aWFsIGZvY3VzLiBUaGlzIGFsc28gZ2l2ZXMgdXMgYVxuICogcGxhY2UgdG8gcHV0IGFkZGl0aW9uYWwgZmVhdHVyZXMgb2YgdGhlIHBvcHVwIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjYWxlbmRhciBpdHNlbGYgaW4gdGhlXG4gKiBmdXR1cmUuIChlLmcuIGNvbmZpcm1hdGlvbiBidXR0b25zKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF0ZXBpY2tlci1jb250ZW50LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICAgICdbQHRyYW5zZm9ybVBhbmVsXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHRyYW5zZm9ybVBhbmVsLmRvbmUpJzogJ19hbmltYXRpb25Eb25lLm5leHQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXBpY2tlci1jb250ZW50LXRvdWNoXSc6ICdkYXRlcGlja2VyLnRvdWNoVWknLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0RGF0ZXBpY2tlckFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWwsXG4gICAgbWF0RGF0ZXBpY2tlckFuaW1hdGlvbnMuZmFkZUluQ2FsZW5kYXIsXG4gIF0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlckNvbnRlbnQnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBleHRlbmRzIF9NYXREYXRlcGlja2VyQ29udGVudE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGNhbGVuZGFyIGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRDYWxlbmRhcikgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxEPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBkYXRlcGlja2VyIHRoYXQgY3JlYXRlZCB0aGUgb3ZlcmxheS4gKi9cbiAgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlckJhc2U8YW55LCBTLCBEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGlucHV0LiAqL1xuICBfaXNBYm92ZTogYm9vbGVhbjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICdlbnRlcicgfCAndm9pZCcgPSAnZW50ZXInO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuICovXG4gIF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGV4dCBmb3IgdGhlIGNsb3NlIGJ1dHRvbi4gKi9cbiAgX2Nsb3NlQnV0dG9uVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9zZSBidXR0b24gY3VycmVudGx5IGhhcyBmb2N1cy4gKi9cbiAgX2Nsb3NlQnV0dG9uRm9jdXNlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSlcbiAgICAgICAgcHJpdmF0ZSBfcmFuZ2VTZWxlY3Rpb25TdHJhdGVneTogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4sXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGludGxgIGFyZ3VtZW50IHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgICAqL1xuICAgIGludGw/OiBNYXREYXRlcGlja2VySW50bCkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wIFJlbW92ZSBmYWxsYmFjayBmb3IgYGludGxgLlxuICAgIHRoaXMuX2Nsb3NlQnV0dG9uVGV4dCA9IGludGw/LmNsb3NlQ2FsZW5kYXJMYWJlbCB8fCAnQ2xvc2UgY2FsZW5kYXInO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZGF0ZXBpY2tlci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuX2NhbGVuZGFyLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9oYW5kbGVVc2VyU2VsZWN0aW9uKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4pIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLl9tb2RlbC5zZWxlY3Rpb247XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICBjb25zdCBpc1JhbmdlID0gc2VsZWN0aW9uIGluc3RhbmNlb2YgRGF0ZVJhbmdlO1xuXG4gICAgLy8gSWYgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UgYW5kIHdlIGhhdmUgYSBzZWxlY3Rpb24gc3RyYXRlZ3ksIGFsd2F5cyBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAgLy8gdGhlcmUuIE90aGVyd2lzZSBkb24ndCBhc3NpZ24gbnVsbCB2YWx1ZXMgdG8gdGhlIG1vZGVsLCB1bmxlc3Mgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgLy8gQSBudWxsIHZhbHVlIHdoZW4gcGlja2luZyBhIHJhbmdlIG1lYW5zIHRoYXQgdGhlIHVzZXIgY2FuY2VsbGVkIHRoZSBzZWxlY3Rpb24gKGUuZy4gYnlcbiAgICAvLyBwcmVzc2luZyBlc2NhcGUpLCB3aGVyZWFzIHdoZW4gc2VsZWN0aW5nIGEgc2luZ2xlIHZhbHVlIGl0IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGRpZG4ndFxuICAgIC8vIGNoYW5nZS4gVGhpcyBpc24ndCB2ZXJ5IGludHVpdGl2ZSwgYnV0IGl0J3MgaGVyZSBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkuXG4gICAgaWYgKGlzUmFuZ2UgJiYgdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneSkge1xuICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneS5zZWxlY3Rpb25GaW5pc2hlZCh2YWx1ZSxcbiAgICAgICAgICBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEYXRlUmFuZ2U8RD4sIGV2ZW50LmV2ZW50KTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihuZXdTZWxlY3Rpb24gYXMgdW5rbm93biBhcyBTLCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlICYmIChpc1JhbmdlIHx8XG4gICAgICAgICAgICAgICF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWx1ZSwgc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCkpKSB7XG4gICAgICB0aGlzLl9tb2RlbC5hZGQodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fbW9kZWwgfHwgdGhpcy5fbW9kZWwuaXNDb21wbGV0ZSgpKSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX2dldFNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbC5zZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEIHwgRGF0ZVJhbmdlPEQ+IHwgbnVsbDtcbiAgfVxufVxuXG4vKiogRm9ybSBjb250cm9sIHRoYXQgY2FuIGJlIGFzc29jaWF0ZWQgd2l0aCBhIGRhdGVwaWNrZXIuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+IHtcbiAgZ2V0U3RhcnRWYWx1ZSgpOiBEIHwgbnVsbDtcbiAgZ2V0VGhlbWVQYWxldHRlKCk6IFRoZW1lUGFsZXR0ZTtcbiAgbWluOiBEIHwgbnVsbDtcbiAgbWF4OiBEIHwgbnVsbDtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGRhdGVGaWx0ZXI6IERhdGVGaWx0ZXJGbjxEPjtcbiAgZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpOiBFbGVtZW50UmVmO1xuICBzdGF0ZUNoYW5nZXM6IE9ic2VydmFibGU8dm9pZD47XG59XG5cbi8qKiBBIGRhdGVwaWNrZXIgdGhhdCBjYW4gYmUgYXR0YWNoZWQgdG8gYSB7QGxpbmsgTWF0RGF0ZXBpY2tlckNvbnRyb2x9LiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlcGlja2VyUGFuZWw8QyBleHRlbmRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBTLFxuICAgIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PiB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0ZSBwaWNrZXIgaXMgY2xvc2VkLiAqL1xuICBjbG9zZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGUgZGF0ZXBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIGRhdGVwaWNrZXJJbnB1dDogQztcbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wLXVwIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIGlkOiBzdHJpbmc7XG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlzIG9wZW4uICovXG4gIG9wZW5lZDogYm9vbGVhbjtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBkYXRlIHBpY2tlciBpcyBvcGVuZWQuICovXG4gIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+O1xuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlcidzIHN0YXRlIGNoYW5nZXMuICovXG4gIHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPjtcbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyLiAqL1xuICBvcGVuKCk6IHZvaWQ7XG4gIC8qKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlcGlja2VyLiAqL1xuICByZWdpc3RlcklucHV0KGlucHV0OiBDKTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+O1xufVxuXG4vKiogQmFzZSBjbGFzcyBmb3IgYSBkYXRlcGlja2VyLiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZXBpY2tlckJhc2U8QyBleHRlbmRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LCBTLFxuICBEID0gRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPj4gaW1wbGVtZW50cyBNYXREYXRlcGlja2VyUGFuZWw8QywgUywgRD4sIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMge1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2lucHV0U3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBBbiBpbnB1dCBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIHRoZSBjdXN0b20gaGVhZGVyIGNvbXBvbmVudCBmb3IgdGhlIGNhbGVuZGFyLCBpZiBzZXQuICovXG4gIEBJbnB1dCgpIGNhbGVuZGFySGVhZGVyQ29tcG9uZW50OiBDb21wb25lbnRUeXBlPGFueT47XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiB0aGlzLl9zdGFydEF0IHx8ICh0aGlzLmRhdGVwaWNrZXJJbnB1dCA/IHRoaXMuZGF0ZXBpY2tlcklucHV0LmdldFN0YXJ0VmFsdWUoKSA6IG51bGwpO1xuICB9XG4gIHNldCBzdGFydEF0KHZhbHVlOiBEIHwgbnVsbCkge1xuICAgIHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9kYXRlQWRhcHRlci5nZXRWYWxpZERhdGVPck51bGwodGhpcy5fZGF0ZUFkYXB0ZXIuZGVzZXJpYWxpemUodmFsdWUpKTtcbiAgfVxuICBwcml2YXRlIF9zdGFydEF0OiBEIHwgbnVsbDtcblxuICAvKiogVGhlIHZpZXcgdGhhdCB0aGUgY2FsZW5kYXIgc2hvdWxkIHN0YXJ0IGluLiAqL1xuICBASW5wdXQoKSBzdGFydFZpZXc6ICdtb250aCcgfCAneWVhcicgfCAnbXVsdGkteWVhcicgPSAnbW9udGgnO1xuXG4gIC8qKiBDb2xvciBwYWxldHRlIHRvIHVzZSBvbiB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3IgfHxcbiAgICAgICAgKHRoaXMuZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0VGhlbWVQYWxldHRlKCkgOiB1bmRlZmluZWQpO1xuICB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBwb3B1cCBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvdWNoVWkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl90b3VjaFVpOyB9XG4gIHNldCB0b3VjaFVpKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fdG91Y2hVaSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdG91Y2hVaSA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dCA/XG4gICAgICAgIHRoaXMuZGF0ZXBpY2tlcklucHV0LmRpc2FibGVkIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHhQb3NpdGlvbjogRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JztcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHlQb3NpdGlvbjogRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHllYXJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtb250aFNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnQgdmlldyBjaGFuZ2VzLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZpZXdDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclZpZXc+KHRydWUpO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBkYXRlIHBpY2tlciBwYW5lbC5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzaW1pbGFyIHRvIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYW5lbENsYXNzKCk6IHN0cmluZyB8IHN0cmluZ1tdIHsgcmV0dXJuIHRoaXMuX3BhbmVsQ2xhc3M7IH1cbiAgc2V0IHBhbmVsQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fcGFuZWxDbGFzcyA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9wYW5lbENsYXNzOiBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSA/IHRoaXMub3BlbigpIDogdGhpcy5jbG9zZSgpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1kYXRlcGlja2VyLSR7ZGF0ZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dC5taW47XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1heDtcbiAgfVxuXG4gIF9nZXREYXRlRmlsdGVyKCk6IERhdGVGaWx0ZXJGbjxEPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX3BvcHVwUmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3aGVuIHRoZSBjYWxlbmRhciBpcyBvcGVuZWQgYXMgYSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbnRpYXRlZCBpbiBwb3B1cCBtb2RlLiAqL1xuICBwcml2YXRlIF9wb3B1cENvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkYXRlcGlja2VyIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogVW5pcXVlIGNsYXNzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3Agc28gdGhhdCB0aGUgdGVzdCBoYXJuZXNzZXMgY2FuIGxvb2sgaXQgdXAuICovXG4gIHByaXZhdGUgX2JhY2tkcm9wSGFybmVzc0NsYXNzID0gYCR7dGhpcy5pZH0tYmFja2Ryb3BgO1xuXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGlzIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRlcGlja2VySW5wdXQ6IEM7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICAgICAgICAgICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPikge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2UgPSBjaGFuZ2VzWyd4UG9zaXRpb24nXSB8fCBjaGFuZ2VzWyd5UG9zaXRpb24nXTtcblxuICAgIGlmIChwb3NpdGlvbkNoYW5nZSAmJiAhcG9zaXRpb25DaGFuZ2UuZmlyc3RDaGFuZ2UgJiYgdGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX3NldENvbm5lY3RlZFBvc2l0aW9ucyhcbiAgICAgICAgICB0aGlzLl9wb3B1cFJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICB0aGlzLl9wb3B1cFJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gZGF0ZSAqL1xuICBzZWxlY3QoZGF0ZTogRCk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsLmFkZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldyAqL1xuICBfc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogRCk6IHZvaWQge1xuICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQobm9ybWFsaXplZFllYXIpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldyAqL1xuICBfc2VsZWN0TW9udGgobm9ybWFsaXplZE1vbnRoOiBEKTogdm9pZCB7XG4gICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2VkIHZpZXcgKi9cbiAgX3ZpZXdDaGFuZ2VkKHZpZXc6IE1hdENhbGVuZGFyVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh2aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRlcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gbW9kZWwgdGhhdCB0aGUgaW5wdXQgc2hvdWxkIGhvb2sgaXRzZWxmIHVwIHRvLlxuICAgKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRhdGVwaWNrZXJJbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzID1cbiAgICAgICAgaW5wdXQuc3RhdGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCkpO1xuICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhci4gKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3BlbmVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRlZCB0byBvcGVuIGFuIE1hdERhdGVwaWNrZXIgd2l0aCBubyBhc3NvY2lhdGVkIGlucHV0LicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgdGhpcy50b3VjaFVpID8gdGhpcy5fb3BlbkFzRGlhbG9nKCkgOiB0aGlzLl9vcGVuQXNQb3B1cCgpO1xuICAgIHRoaXMuX29wZW5lZCA9IHRydWU7XG4gICAgdGhpcy5vcGVuZWRTdHJlYW0uZW1pdCgpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBjYWxlbmRhci4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9vcGVuZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmICYmIHRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgaW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICAgICAgaW5zdGFuY2UuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGVzdHJveVBvcHVwKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGVDbG9zZSA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSBgX29wZW5lZGAgY291bGQndmUgYmVlbiByZXNldCBhbHJlYWR5IGlmXG4gICAgICAvLyB3ZSBnb3QgdHdvIGV2ZW50cyBpbiBxdWljayBzdWNjZXNzaW9uLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZCkge1xuICAgICAgICB0aGlzLl9vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWRTdHJlYW0uZW1pdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuICYmXG4gICAgICB0eXBlb2YgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBCZWNhdXNlIElFIG1vdmVzIGZvY3VzIGFzeW5jaHJvbm91c2x5LCB3ZSBjYW4ndCBjb3VudCBvbiBpdCBiZWluZyByZXN0b3JlZCBiZWZvcmUgd2UndmVcbiAgICAgIC8vIG1hcmtlZCB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQuIElmIHRoZSBldmVudCBmaXJlcyBvdXQgb2Ygc2VxdWVuY2UgYW5kIHRoZSBlbGVtZW50IHRoYXRcbiAgICAgIC8vIHdlJ3JlIHJlZm9jdXNpbmcgb3BlbnMgdGhlIGRhdGVwaWNrZXIgb24gZm9jdXMsIHRoZSB1c2VyIGNvdWxkIGJlIHN0dWNrIHdpdGggbm90IGJlaW5nXG4gICAgICAvLyBhYmxlIHRvIGNsb3NlIHRoZSBjYWxlbmRhciBhdCBhbGwuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IG1ha2luZyB0aGUgbG9naWMsIHRoYXQgbWFya3NcbiAgICAgIC8vIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZCwgYXN5bmMgYXMgd2VsbC5cbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cygpO1xuICAgICAgc2V0VGltZW91dChjb21wbGV0ZUNsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfb3BlbkFzRGlhbG9nKCk6IHZvaWQge1xuICAgIC8vIFVzdWFsbHkgdGhpcyB3b3VsZCBiZSBoYW5kbGVkIGJ5IGBvcGVuYCB3aGljaCBlbnN1cmVzIHRoYXQgd2UgY2FuIG9ubHkgaGF2ZSBvbmUgb3ZlcmxheVxuICAgIC8vIG9wZW4gYXQgYSB0aW1lLCBob3dldmVyIHNpbmNlIHdlIHJlc2V0IHRoZSB2YXJpYWJsZXMgaW4gYXN5bmMgaGFuZGxlcnMgc29tZSBvdmVybGF5c1xuICAgIC8vIG1heSBzbGlwIHRocm91Z2ggaWYgdGhlIHVzZXIgb3BlbnMgYW5kIGNsb3NlcyBtdWx0aXBsZSB0aW1lcyBpbiBxdWljayBzdWNjZXNzaW9uIChlLmcuXG4gICAgLy8gYnkgaG9sZGluZyBkb3duIHRoZSBlbnRlciBrZXkpLlxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2RpYWxvZ1JlZiA9IHRoaXMuX2RpYWxvZy5vcGVuPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCwge1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJyxcbiAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgICBwYW5lbENsYXNzOiAnbWF0LWRhdGVwaWNrZXItZGlhbG9nJyxcblxuICAgICAgLy8gVGhlc2UgdmFsdWVzIGFyZSBhbGwgdGhlIHNhbWUgYXMgdGhlIGRlZmF1bHRzLCBidXQgd2Ugc2V0IHRoZW0gZXhwbGljaXRseSBzbyB0aGF0IHRoZVxuICAgICAgLy8gZGF0ZXBpY2tlciBkaWFsb2cgYmVoYXZlcyBjb25zaXN0ZW50bHkgZXZlbiBpZiB0aGUgdXNlciBjaGFuZ2VkIHRoZSBkZWZhdWx0cy5cbiAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgZGlzYWJsZUNsb3NlOiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IFsnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCcsIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzXSxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGhlaWdodDogJycsXG4gICAgICBtaW5XaWR0aDogJycsXG4gICAgICBtaW5IZWlnaHQ6ICcnLFxuICAgICAgbWF4V2lkdGg6ICc4MHZ3JyxcbiAgICAgIG1heEhlaWdodDogJycsXG4gICAgICBwb3NpdGlvbjoge30sXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG5cbiAgICAgIC8vIGBNYXREaWFsb2dgIGhhcyBmb2N1cyByZXN0b3JhdGlvbiBidWlsdCBpbiwgaG93ZXZlciB3ZSB3YW50IHRvIGRpc2FibGUgaXQgc2luY2UgdGhlXG4gICAgICAvLyBkYXRlcGlja2VyIGFsc28gaGFzIGZvY3VzIHJlc3RvcmF0aW9uIGZvciBkcm9wZG93biBtb2RlLiBXZSB3YW50IHRvIGRvIHRoaXMsIGluIG9yZGVyXG4gICAgICAvLyB0byBlbnN1cmUgdGhhdCB0aGUgdGltaW5nIGlzIGNvbnNpc3RlbnQgYmV0d2VlbiBkcm9wZG93biBhbmQgZGlhbG9nIG1vZGVzIHNpbmNlIGBNYXREaWFsb2dgXG4gICAgICAvLyByZXN0b3JlcyBmb2N1cyB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQsIGJ1dCB0aGUgZGF0ZXBpY2tlciBkb2VzIGl0IGltbWVkaWF0ZWx5LlxuICAgICAgLy8gRnVydGhlcm1vcmUsIHRoaXMgYXZvaWRzIGFueSBjb25mbGljdHMgd2hlcmUgdGhlIGRhdGVwaWNrZXIgY29uc3VtZXIgbWlnaHQgbW92ZSBmb2N1c1xuICAgICAgLy8gaW5zaWRlIHRoZSBgY2xvc2VkYCBldmVudCB3aGljaCBpcyBkaXNwYXRjaGVkIGltbWVkaWF0ZWx5LlxuICAgICAgcmVzdG9yZUZvY3VzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlKTtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9vcGVuQXNQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuX2NyZWF0ZVBvcHVwKCk7XG4gICAgdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSB0aGlzLl9wb3B1cFJlZiEuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fcG9wdXBDb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvcndhcmRzIHJlbGV2YW50IHZhbHVlcyBmcm9tIHRoZSBkYXRlcGlja2VyIHRvIHRoZSBkYXRlcGlja2VyIGNvbnRlbnQgaW5zaWRlIHRoZSBvdmVybGF5LiAqL1xuICBwcm90ZWN0ZWQgX2ZvcndhcmRDb250ZW50VmFsdWVzKGluc3RhbmNlOiBNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPikge1xuICAgIGluc3RhbmNlLmRhdGVwaWNrZXIgPSB0aGlzO1xuICAgIGluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIHBvcHVwLiAqL1xuICBwcml2YXRlIF9jcmVhdGVQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkpXG4gICAgICAud2l0aFRyYW5zZm9ybU9yaWdpbk9uKCcubWF0LWRhdGVwaWNrZXItY29udGVudCcpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oOClcbiAgICAgIC53aXRoTG9ja2VkUG9zaXRpb24oKTtcblxuICAgIGNvbnN0IG92ZXJsYXlDb25maWcgPSBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9zZXRDb25uZWN0ZWRQb3NpdGlvbnMocG9zaXRpb25TdHJhdGVneSksXG4gICAgICBoYXNCYWNrZHJvcDogdHJ1ZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IFsnbWF0LW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLCB0aGlzLl9iYWNrZHJvcEhhcm5lc3NDbGFzc10sXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgcGFuZWxDbGFzczogJ21hdC1kYXRlcGlja2VyLXBvcHVwJyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUob3ZlcmxheUNvbmZpZyk7XG4gICAgdGhpcy5fcG9wdXBSZWYub3ZlcmxheUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2RpYWxvZycpO1xuXG4gICAgbWVyZ2UoXG4gICAgICB0aGlzLl9wb3B1cFJlZi5iYWNrZHJvcENsaWNrKCksXG4gICAgICB0aGlzLl9wb3B1cFJlZi5kZXRhY2htZW50cygpLFxuICAgICAgdGhpcy5fcG9wdXBSZWYua2V5ZG93bkV2ZW50cygpLnBpcGUoZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gQ2xvc2luZyBvbiBhbHQgKyB1cCBpcyBvbmx5IHZhbGlkIHdoZW4gdGhlcmUncyBhbiBpbnB1dCBhc3NvY2lhdGVkIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAgICAgIHJldHVybiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHx8ICh0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJlxuICAgICAgICAgICAgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdhbHRLZXknKSAmJiBldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyk7XG4gICAgICB9KSlcbiAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBjdXJyZW50IHBvcHVwIG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQb3B1cCgpIHtcbiAgICBpZiAodGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb2YgdGhlIGRhdGVwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLiAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVlcbiAgICAgIH1cbiAgICBdKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3BlbmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90b3VjaFVpOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=