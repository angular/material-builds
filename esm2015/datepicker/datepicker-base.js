/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, UP_ARROW } from '@angular/cdk/keycodes';
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
    constructor(elementRef, _changeDetectorRef, _model, _dateAdapter, _rangeSelectionStrategy) {
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
    }
    ngAfterViewInit() {
        this._subscriptions.add(this.datepicker._stateChanges.subscribe(() => {
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
                template: "<mat-calendar cdkTrapFocus\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\">\n</mat-calendar>\n",
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
            },] }
];
MatDatepickerContent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MatDateSelectionModel },
    { type: DateAdapter },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_DATE_RANGE_SELECTION_STRATEGY,] }] }
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
        this._stateChanges = new Subject();
        if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        this._startAt = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));
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
            this._stateChanges.next(undefined);
        }
    }
    /** Whether the calendar is open. */
    get opened() { return this._opened; }
    set opened(value) {
        coerceBooleanProperty(value) ? this.open() : this.close();
    }
    /** The minimum selectable date. */
    _getMinDate() {
        return this._datepickerInput && this._datepickerInput.min;
    }
    /** The maximum selectable date. */
    _getMaxDate() {
        return this._datepickerInput && this._datepickerInput.max;
    }
    _getDateFilter() {
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
        this._stateChanges.next(undefined);
    }
    ngOnDestroy() {
        this._destroyPopup();
        this.close();
        this._inputStateChanges.unsubscribe();
        this._stateChanges.complete();
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
        if (this._datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('A MatDatepicker can only be associated with a single input.');
        }
        this._inputStateChanges.unsubscribe();
        this._datepickerInput = input;
        this._inputStateChanges =
            input.stateChanges.subscribe(() => this._stateChanges.next(undefined));
        return this._model;
    }
    /** Open the calendar. */
    open() {
        if (this._opened || this.disabled) {
            return;
        }
        if (!this._datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
            .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
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
    panelClass: [{ type: Input }],
    dateClass: [{ type: Input }],
    openedStream: [{ type: Output, args: ['opened',] }],
    closedStream: [{ type: Output, args: ['closed',] }],
    opened: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFDTCxPQUFPLEVBQ1AsYUFBYSxHQUlkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBZ0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsU0FBUyxHQUdWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxXQUFXLEVBQ1gsVUFBVSxHQUVYLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBZSxNQUFNLDBCQUEwQixDQUFDO0FBQ2pFLE9BQU8sRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFjLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdkMs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UTtnQkFDbEIsUUFBUSxFQUFFLFVBQVU7YUFDckI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsUUFBUTthQUNuQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxVQUFVO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBelpGLFNBQVM7OztZQTVLRixTQUFTO1lBckNmLE9BQU87WUFrQlAsTUFBTTtZQUtOLGdCQUFnQjs0Q0EyVUgsTUFBTSxTQUFDLDhCQUE4QjtZQWpVbEQsV0FBVyx1QkFrVUUsUUFBUTtZQXZXZixjQUFjLHVCQXdXUCxRQUFROzRDQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsUUFBUTtZQXRUeEMscUJBQXFCOzs7c0NBeUtwQixLQUFLO3NCQUdMLEtBQUs7d0JBWUwsS0FBSztvQkFHTCxLQUFLO3NCQWNMLEtBQUs7dUJBUUwsS0FBSzt3QkFnQkwsS0FBSzt3QkFJTCxLQUFLOzJCQU9MLE1BQU07NEJBTU4sTUFBTTt5QkFHTixLQUFLO3dCQUdMLEtBQUs7MkJBR0wsTUFBTSxTQUFDLFFBQVE7MkJBR2YsTUFBTSxTQUFDLFFBQVE7cUJBSWYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtFU0NBUEUsIFVQX0FSUk9XfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5Db2xvcixcbiAgQ2FuQ29sb3JDdG9yLFxuICBEYXRlQWRhcHRlcixcbiAgbWl4aW5Db2xvcixcbiAgVGhlbWVQYWxldHRlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0RGlhbG9nLCBNYXREaWFsb2dSZWZ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQge21lcmdlLCBTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJ9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHttYXREYXRlcGlja2VyQW5pbWF0aW9uc30gZnJvbSAnLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge01hdENhbGVuZGFyVXNlckV2ZW50LCBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9ufSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7XG4gIEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sXG4gIE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgRGF0ZVJhbmdlLFxufSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSxcbiAgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRlcGlja2VyIGluc3RhbmNlLiAqL1xubGV0IGRhdGVwaWNrZXJVaWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LWRhdGVwaWNrZXItc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnIHwgJ2VuZCc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBZIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXREYXRlcGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXREYXRlcGlja2VyQ29udGVudEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHsgfVxufVxuY29uc3QgX01hdERhdGVwaWNrZXJDb250ZW50TWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlID1cbiAgICBtaXhpbkNvbG9yKE1hdERhdGVwaWNrZXJDb250ZW50QmFzZSk7XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRlcGlja2VyIGRpYWxvZyBhbmQgcG9wdXAuIFdlIHVzZSB0aGlzIGluc3RlYWQgb2YgdXNpbmdcbiAqIE1hdENhbGVuZGFyIGRpcmVjdGx5IGFzIHRoZSBjb250ZW50IHNvIHdlIGNhbiBjb250cm9sIHRoZSBpbml0aWFsIGZvY3VzLiBUaGlzIGFsc28gZ2l2ZXMgdXMgYVxuICogcGxhY2UgdG8gcHV0IGFkZGl0aW9uYWwgZmVhdHVyZXMgb2YgdGhlIHBvcHVwIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjYWxlbmRhciBpdHNlbGYgaW4gdGhlXG4gKiBmdXR1cmUuIChlLmcuIGNvbmZpcm1hdGlvbiBidXR0b25zKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZGF0ZXBpY2tlci1jb250ZW50LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICAgICdbQHRyYW5zZm9ybVBhbmVsXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHRyYW5zZm9ybVBhbmVsLmRvbmUpJzogJ19hbmltYXRpb25Eb25lLm5leHQoKScsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXBpY2tlci1jb250ZW50LXRvdWNoXSc6ICdkYXRlcGlja2VyLnRvdWNoVWknLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0RGF0ZXBpY2tlckFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWwsXG4gICAgbWF0RGF0ZXBpY2tlckFuaW1hdGlvbnMuZmFkZUluQ2FsZW5kYXIsXG4gIF0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlckNvbnRlbnQnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2NvbG9yJ10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PlxuICBleHRlbmRzIF9NYXREYXRlcGlja2VyQ29udGVudE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGNhbGVuZGFyIGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRDYWxlbmRhcikgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxEPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBkYXRlcGlja2VyIHRoYXQgY3JlYXRlZCB0aGUgb3ZlcmxheS4gKi9cbiAgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlckJhc2U8YW55LCBTLCBEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGlucHV0LiAqL1xuICBfaXNBYm92ZTogYm9vbGVhbjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICdlbnRlcicgfCAndm9pZCcgPSAnZW50ZXInO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuICovXG4gIF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSlcbiAgICAgICAgcHJpdmF0ZSBfcmFuZ2VTZWxlY3Rpb25TdHJhdGVneTogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4pIHtcbiAgICBzdXBlcihlbGVtZW50UmVmKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmRhdGVwaWNrZXIuX3N0YXRlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5fY2FsZW5kYXIuZm9jdXNBY3RpdmVDZWxsKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX2hhbmRsZVVzZXJTZWxlY3Rpb24oZXZlbnQ6IE1hdENhbGVuZGFyVXNlckV2ZW50PEQgfCBudWxsPikge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuX21vZGVsLnNlbGVjdGlvbjtcbiAgICBjb25zdCB2YWx1ZSA9IGV2ZW50LnZhbHVlO1xuICAgIGNvbnN0IGlzUmFuZ2UgPSBzZWxlY3Rpb24gaW5zdGFuY2VvZiBEYXRlUmFuZ2U7XG5cbiAgICAvLyBJZiB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZSBhbmQgd2UgaGF2ZSBhIHNlbGVjdGlvbiBzdHJhdGVneSwgYWx3YXlzIHBhc3MgdGhlIHZhbHVlIHRocm91Z2hcbiAgICAvLyB0aGVyZS4gT3RoZXJ3aXNlIGRvbid0IGFzc2lnbiBudWxsIHZhbHVlcyB0byB0aGUgbW9kZWwsIHVubGVzcyB3ZSdyZSBzZWxlY3RpbmcgYSByYW5nZS5cbiAgICAvLyBBIG51bGwgdmFsdWUgd2hlbiBwaWNraW5nIGEgcmFuZ2UgbWVhbnMgdGhhdCB0aGUgdXNlciBjYW5jZWxsZWQgdGhlIHNlbGVjdGlvbiAoZS5nLiBieVxuICAgIC8vIHByZXNzaW5nIGVzY2FwZSksIHdoZXJlYXMgd2hlbiBzZWxlY3RpbmcgYSBzaW5nbGUgdmFsdWUgaXQgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZGlkbid0XG4gICAgLy8gY2hhbmdlLiBUaGlzIGlzbid0IHZlcnkgaW50dWl0aXZlLCBidXQgaXQncyBoZXJlIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbiAgICBpZiAoaXNSYW5nZSAmJiB0aGlzLl9yYW5nZVNlbGVjdGlvblN0cmF0ZWd5KSB7XG4gICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSB0aGlzLl9yYW5nZVNlbGVjdGlvblN0cmF0ZWd5LnNlbGVjdGlvbkZpbmlzaGVkKHZhbHVlLFxuICAgICAgICAgIHNlbGVjdGlvbiBhcyB1bmtub3duIGFzIERhdGVSYW5nZTxEPiwgZXZlbnQuZXZlbnQpO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKG5ld1NlbGVjdGlvbiBhcyB1bmtub3duIGFzIFMsIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgJiYgKGlzUmFuZ2UgfHxcbiAgICAgICAgICAgICAgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbHVlLCBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEKSkpIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9tb2RlbCB8fCB0aGlzLl9tb2RlbC5pc0NvbXBsZXRlKCkpIHtcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIF9zdGFydEV4aXRBbmltYXRpb24oKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSAndm9pZCc7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfZ2V0U2VsZWN0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsLnNlbGVjdGlvbiBhcyB1bmtub3duIGFzIEQgfCBEYXRlUmFuZ2U8RD4gfCBudWxsO1xuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGEgZGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdERhdGVwaWNrZXJCYXNlPEMgZXh0ZW5kcyBNYXREYXRlcGlja2VyQ29udHJvbDxEPiwgUyxcbiAgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2lucHV0U3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBBbiBpbnB1dCBpbmRpY2F0aW5nIHRoZSB0eXBlIG9mIHRoZSBjdXN0b20gaGVhZGVyIGNvbXBvbmVudCBmb3IgdGhlIGNhbGVuZGFyLCBpZiBzZXQuICovXG4gIEBJbnB1dCgpIGNhbGVuZGFySGVhZGVyQ29tcG9uZW50OiBDb21wb25lbnRUeXBlPGFueT47XG5cbiAgLyoqIFRoZSBkYXRlIHRvIG9wZW4gdGhlIGNhbGVuZGFyIHRvIGluaXRpYWxseS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHN0YXJ0QXQoKTogRCB8IG51bGwge1xuICAgIC8vIElmIGFuIGV4cGxpY2l0IHN0YXJ0QXQgaXMgc2V0IHdlIHN0YXJ0IHRoZXJlLCBvdGhlcndpc2Ugd2Ugc3RhcnQgYXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnRseVxuICAgIC8vIHNlbGVjdGVkIHZhbHVlIGlzLlxuICAgIHJldHVybiB0aGlzLl9zdGFydEF0IHx8ICh0aGlzLl9kYXRlcGlja2VySW5wdXQgPyB0aGlzLl9kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvciB8fFxuICAgICAgICAodGhpcy5fZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5fZGF0ZXBpY2tlcklucHV0LmdldFRoZW1lUGFsZXR0ZSgpIDogdW5kZWZpbmVkKTtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIFVJIGlzIGluIHRvdWNoIG1vZGUuIEluIHRvdWNoIG1vZGUgdGhlIGNhbGVuZGFyIG9wZW5zIGluIGEgZGlhbG9nIHJhdGhlclxuICAgKiB0aGFuIGEgcG9wdXAgYW5kIGVsZW1lbnRzIGhhdmUgbW9yZSBwYWRkaW5nIHRvIGFsbG93IGZvciBiaWdnZXIgdG91Y2ggdGFyZ2V0cy5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCB0b3VjaFVpKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fdG91Y2hVaTsgfVxuICBzZXQgdG91Y2hVaSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3RvdWNoVWkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3RvdWNoVWkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3AtdXAgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0ID9cbiAgICAgICAgdGhpcy5fZGF0ZXBpY2tlcklucHV0LmRpc2FibGVkIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0ZXBpY2tlciBpbiB0aGUgWCBheGlzLiAqL1xuICBASW5wdXQoKVxuICB4UG9zaXRpb246IERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCc7XG5cbiAgLyoqIFByZWZlcnJlZCBwb3NpdGlvbiBvZiB0aGUgZGF0ZXBpY2tlciBpbiB0aGUgWSBheGlzLiAqL1xuICBASW5wdXQoKVxuICB5UG9zaXRpb246IERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdiZWxvdyc7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHNlbGVjdGVkIHllYXIgaW4gbXVsdGl5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbW9udGhTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgZGF0ZSBwaWNrZXIgcGFuZWwuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgpIHBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSA/IHRoaXMub3BlbigpIDogdGhpcy5jbG9zZSgpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1kYXRlcGlja2VyLSR7ZGF0ZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0Lm1pbjtcbiAgfVxuXG4gIC8qKiBUaGUgbWF4aW11bSBzZWxlY3RhYmxlIGRhdGUuICovXG4gIF9nZXRNYXhEYXRlKCk6IEQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuX2RhdGVwaWNrZXJJbnB1dC5tYXg7XG4gIH1cblxuICBfZ2V0RGF0ZUZpbHRlcigpOiBEYXRlRmlsdGVyRm48RD4ge1xuICAgIHJldHVybiB0aGlzLl9kYXRlcGlja2VySW5wdXQgJiYgdGhpcy5fZGF0ZXBpY2tlcklucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX3BvcHVwUmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3aGVuIHRoZSBjYWxlbmRhciBpcyBvcGVuZWQgYXMgYSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbnRpYXRlZCBpbiBwb3B1cCBtb2RlLiAqL1xuICBwcml2YXRlIF9wb3B1cENvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkYXRlcGlja2VyIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogVW5pcXVlIGNsYXNzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3Agc28gdGhhdCB0aGUgdGVzdCBoYXJuZXNzZXMgY2FuIGxvb2sgaXQgdXAuICovXG4gIHByaXZhdGUgX2JhY2tkcm9wSGFybmVzc0NsYXNzID0gYCR7dGhpcy5pZH0tYmFja2Ryb3BgO1xuXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGlzIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBfZGF0ZXBpY2tlcklucHV0OiBDO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyJ3Mgc3RhdGUgY2hhbmdlcy4gKi9cbiAgcmVhZG9ubHkgX3N0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGlhbG9nOiBNYXREaWFsb2csXG4gICAgICAgICAgICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICAgICAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+KSB7XG4gICAgaWYgKCF0aGlzLl9kYXRlQWRhcHRlciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgY3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3IoJ0RhdGVBZGFwdGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSBzY3JvbGxTdHJhdGVneTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBwb3NpdGlvbkNoYW5nZSA9IGNoYW5nZXNbJ3hQb3NpdGlvbiddIHx8IGNoYW5nZXNbJ3lQb3NpdGlvbiddO1xuXG4gICAgaWYgKHBvc2l0aW9uQ2hhbmdlICYmICFwb3NpdGlvbkNoYW5nZS5maXJzdENoYW5nZSAmJiB0aGlzLl9wb3B1cFJlZikge1xuICAgICAgdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKFxuICAgICAgICAgIHRoaXMuX3BvcHVwUmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3kgYXMgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KTtcblxuICAgICAgaWYgKHRoaXMub3BlbmVkKSB7XG4gICAgICAgIHRoaXMuX3BvcHVwUmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFNlbGVjdHMgdGhlIGdpdmVuIGRhdGUgKi9cbiAgc2VsZWN0KGRhdGU6IEQpOiB2b2lkIHtcbiAgICB0aGlzLl9tb2RlbC5hZGQoZGF0ZSk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIHNlbGVjdGVkIHllYXIgaW4gbXVsdGl5ZWFyIHZpZXcgKi9cbiAgX3NlbGVjdFllYXIobm9ybWFsaXplZFllYXI6IEQpOiB2b2lkIHtcbiAgICB0aGlzLnllYXJTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRZZWFyKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXcgKi9cbiAgX3NlbGVjdE1vbnRoKG5vcm1hbGl6ZWRNb250aDogRCk6IHZvaWQge1xuICAgIHRoaXMubW9udGhTZWxlY3RlZC5lbWl0KG5vcm1hbGl6ZWRNb250aCk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGlzIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBpbnB1dCBUaGUgZGF0ZXBpY2tlciBpbnB1dCB0byByZWdpc3RlciB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHJldHVybnMgU2VsZWN0aW9uIG1vZGVsIHRoYXQgdGhlIGlucHV0IHNob3VsZCBob29rIGl0c2VsZiB1cCB0by5cbiAgICovXG4gIF9yZWdpc3RlcklucHV0KGlucHV0OiBDKTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+IHtcbiAgICBpZiAodGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9kYXRlcGlja2VySW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcyA9XG4gICAgICAgIGlucHV0LnN0YXRlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKSk7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vcGVuZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuX2RhdGVwaWNrZXJJbnB1dCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRlZCB0byBvcGVuIGFuIE1hdERhdGVwaWNrZXIgd2l0aCBubyBhc3NvY2lhdGVkIGlucHV0LicpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgdGhpcy50b3VjaFVpID8gdGhpcy5fb3BlbkFzRGlhbG9nKCkgOiB0aGlzLl9vcGVuQXNQb3B1cCgpO1xuICAgIHRoaXMuX29wZW5lZCA9IHRydWU7XG4gICAgdGhpcy5vcGVuZWRTdHJlYW0uZW1pdCgpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBjYWxlbmRhci4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9vcGVuZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmICYmIHRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgaW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICAgICAgaW5zdGFuY2UuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGVzdHJveVBvcHVwKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGVDbG9zZSA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSBgX29wZW5lZGAgY291bGQndmUgYmVlbiByZXNldCBhbHJlYWR5IGlmXG4gICAgICAvLyB3ZSBnb3QgdHdvIGV2ZW50cyBpbiBxdWljayBzdWNjZXNzaW9uLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZCkge1xuICAgICAgICB0aGlzLl9vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWRTdHJlYW0uZW1pdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuICYmXG4gICAgICB0eXBlb2YgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuLmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBCZWNhdXNlIElFIG1vdmVzIGZvY3VzIGFzeW5jaHJvbm91c2x5LCB3ZSBjYW4ndCBjb3VudCBvbiBpdCBiZWluZyByZXN0b3JlZCBiZWZvcmUgd2UndmVcbiAgICAgIC8vIG1hcmtlZCB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQuIElmIHRoZSBldmVudCBmaXJlcyBvdXQgb2Ygc2VxdWVuY2UgYW5kIHRoZSBlbGVtZW50IHRoYXRcbiAgICAgIC8vIHdlJ3JlIHJlZm9jdXNpbmcgb3BlbnMgdGhlIGRhdGVwaWNrZXIgb24gZm9jdXMsIHRoZSB1c2VyIGNvdWxkIGJlIHN0dWNrIHdpdGggbm90IGJlaW5nXG4gICAgICAvLyBhYmxlIHRvIGNsb3NlIHRoZSBjYWxlbmRhciBhdCBhbGwuIFdlIHdvcmsgYXJvdW5kIGl0IGJ5IG1ha2luZyB0aGUgbG9naWMsIHRoYXQgbWFya3NcbiAgICAgIC8vIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZCwgYXN5bmMgYXMgd2VsbC5cbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cygpO1xuICAgICAgc2V0VGltZW91dChjb21wbGV0ZUNsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfb3BlbkFzRGlhbG9nKCk6IHZvaWQge1xuICAgIC8vIFVzdWFsbHkgdGhpcyB3b3VsZCBiZSBoYW5kbGVkIGJ5IGBvcGVuYCB3aGljaCBlbnN1cmVzIHRoYXQgd2UgY2FuIG9ubHkgaGF2ZSBvbmUgb3ZlcmxheVxuICAgIC8vIG9wZW4gYXQgYSB0aW1lLCBob3dldmVyIHNpbmNlIHdlIHJlc2V0IHRoZSB2YXJpYWJsZXMgaW4gYXN5bmMgaGFuZGxlcnMgc29tZSBvdmVybGF5c1xuICAgIC8vIG1heSBzbGlwIHRocm91Z2ggaWYgdGhlIHVzZXIgb3BlbnMgYW5kIGNsb3NlcyBtdWx0aXBsZSB0aW1lcyBpbiBxdWljayBzdWNjZXNzaW9uIChlLmcuXG4gICAgLy8gYnkgaG9sZGluZyBkb3duIHRoZSBlbnRlciBrZXkpLlxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2RpYWxvZ1JlZiA9IHRoaXMuX2RpYWxvZy5vcGVuPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCwge1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJyxcbiAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgICBwYW5lbENsYXNzOiAnbWF0LWRhdGVwaWNrZXItZGlhbG9nJyxcblxuICAgICAgLy8gVGhlc2UgdmFsdWVzIGFyZSBhbGwgdGhlIHNhbWUgYXMgdGhlIGRlZmF1bHRzLCBidXQgd2Ugc2V0IHRoZW0gZXhwbGljaXRseSBzbyB0aGF0IHRoZVxuICAgICAgLy8gZGF0ZXBpY2tlciBkaWFsb2cgYmVoYXZlcyBjb25zaXN0ZW50bHkgZXZlbiBpZiB0aGUgdXNlciBjaGFuZ2VkIHRoZSBkZWZhdWx0cy5cbiAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgZGlzYWJsZUNsb3NlOiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IFsnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCcsIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzXSxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGhlaWdodDogJycsXG4gICAgICBtaW5XaWR0aDogJycsXG4gICAgICBtaW5IZWlnaHQ6ICcnLFxuICAgICAgbWF4V2lkdGg6ICc4MHZ3JyxcbiAgICAgIG1heEhlaWdodDogJycsXG4gICAgICBwb3NpdGlvbjoge30sXG4gICAgICBhdXRvRm9jdXM6IHRydWUsXG5cbiAgICAgIC8vIGBNYXREaWFsb2dgIGhhcyBmb2N1cyByZXN0b3JhdGlvbiBidWlsdCBpbiwgaG93ZXZlciB3ZSB3YW50IHRvIGRpc2FibGUgaXQgc2luY2UgdGhlXG4gICAgICAvLyBkYXRlcGlja2VyIGFsc28gaGFzIGZvY3VzIHJlc3RvcmF0aW9uIGZvciBkcm9wZG93biBtb2RlLiBXZSB3YW50IHRvIGRvIHRoaXMsIGluIG9yZGVyXG4gICAgICAvLyB0byBlbnN1cmUgdGhhdCB0aGUgdGltaW5nIGlzIGNvbnNpc3RlbnQgYmV0d2VlbiBkcm9wZG93biBhbmQgZGlhbG9nIG1vZGVzIHNpbmNlIGBNYXREaWFsb2dgXG4gICAgICAvLyByZXN0b3JlcyBmb2N1cyB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQsIGJ1dCB0aGUgZGF0ZXBpY2tlciBkb2VzIGl0IGltbWVkaWF0ZWx5LlxuICAgICAgLy8gRnVydGhlcm1vcmUsIHRoaXMgYXZvaWRzIGFueSBjb25mbGljdHMgd2hlcmUgdGhlIGRhdGVwaWNrZXIgY29uc3VtZXIgbWlnaHQgbW92ZSBmb2N1c1xuICAgICAgLy8gaW5zaWRlIHRoZSBgY2xvc2VkYCBldmVudCB3aGljaCBpcyBkaXNwYXRjaGVkIGltbWVkaWF0ZWx5LlxuICAgICAgcmVzdG9yZUZvY3VzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlKTtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9vcGVuQXNQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuX2NyZWF0ZVBvcHVwKCk7XG4gICAgdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSB0aGlzLl9wb3B1cFJlZiEuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fcG9wdXBDb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvcndhcmRzIHJlbGV2YW50IHZhbHVlcyBmcm9tIHRoZSBkYXRlcGlja2VyIHRvIHRoZSBkYXRlcGlja2VyIGNvbnRlbnQgaW5zaWRlIHRoZSBvdmVybGF5LiAqL1xuICBwcm90ZWN0ZWQgX2ZvcndhcmRDb250ZW50VmFsdWVzKGluc3RhbmNlOiBNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPikge1xuICAgIGluc3RhbmNlLmRhdGVwaWNrZXIgPSB0aGlzO1xuICAgIGluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgfVxuXG4gIC8qKiBDcmVhdGUgdGhlIHBvcHVwLiAqL1xuICBwcml2YXRlIF9jcmVhdGVQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9kYXRlcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQnKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKCk7XG5cbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3kpLFxuICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICBiYWNrZHJvcENsYXNzOiBbJ21hdC1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJywgdGhpcy5fYmFja2Ryb3BIYXJuZXNzQ2xhc3NdLFxuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtZGF0ZXBpY2tlci1wb3B1cCcsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9wb3B1cFJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICAgIHRoaXMuX3BvcHVwUmVmLm92ZXJsYXlFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcblxuICAgIG1lcmdlKFxuICAgICAgdGhpcy5fcG9wdXBSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgdGhpcy5fcG9wdXBSZWYuZGV0YWNobWVudHMoKSxcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmtleWRvd25FdmVudHMoKS5waXBlKGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIC8vIENsb3Npbmcgb24gYWx0ICsgdXAgaXMgb25seSB2YWxpZCB3aGVuIHRoZXJlJ3MgYW4gaW5wdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlcGlja2VyLlxuICAgICAgICByZXR1cm4gZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFIHx8XG4gICAgICAgICAgICAgICAodGhpcy5fZGF0ZXBpY2tlcklucHV0ICYmIGV2ZW50LmFsdEtleSAmJiBldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyk7XG4gICAgICB9KSlcbiAgICApLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBjdXJyZW50IHBvcHVwIG92ZXJsYXkuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQb3B1cCgpIHtcbiAgICBpZiAodGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX3BvcHVwUmVmID0gdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb2YgdGhlIGRhdGVwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLiAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBwcmltYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogcHJpbWFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBzZWNvbmRhcnlYLFxuICAgICAgICBvdmVybGF5WTogcHJpbWFyeVlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVlcbiAgICAgIH1cbiAgICBdKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3BlbmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90b3VjaFVpOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=