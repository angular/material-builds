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
    constructor(elementRef, _changeDetectorRef, _globalModel, _dateAdapter, _rangeSelectionStrategy, 
    /**
     * @deprecated `intl` argument to become required.
     * @breaking-change 12.0.0
     */
    intl) {
        super(elementRef);
        this._changeDetectorRef = _changeDetectorRef;
        this._globalModel = _globalModel;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        this._subscriptions = new Subscription();
        /** Current state of the animation. */
        this._animationState = 'enter';
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Portal with projected action buttons. */
        this._actionsPortal = null;
        // @breaking-change 12.0.0 Remove fallback for `intl`.
        this._closeButtonText = (intl === null || intl === void 0 ? void 0 : intl.closeCalendarLabel) || 'Close calendar';
    }
    ngOnInit() {
        // If we have actions, clone the model so that we have the ability to cancel the selection,
        // otherwise update the global model directly. Note that we want to assign this as soon as
        // possible, but `_actionsPortal` isn't available in the constructor so we do it in `ngOnInit`.
        this._model = this._actionsPortal ? this._globalModel.clone() : this._globalModel;
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
        // Delegate closing the popup to the actions.
        if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
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
    /** Applies the current pending selection to the global model. */
    _applyPendingSelection() {
        if (this._model !== this._globalModel) {
            this._globalModel.updateSelection(this._model.selection, this);
        }
    }
}
MatDatepickerContent.decorators = [
    { type: Component, args: [{
                selector: 'mat-datepicker-content',
                template: "<div\n  cdkTrapFocus\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n",
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
                styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;overflow:auto;margin:-24px}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}\n"]
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
        this._restoreFocus = true;
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
     * Whether to restore focus to the previously-focused element when the calendar is closed.
     * Note that automatic focus restoration is an accessibility feature and it is recommended that
     * you provide your own equivalent, if you decide to turn it off.
     */
    get restoreFocus() { return this._restoreFocus; }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
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
    /**
     * Registers a portal containing action buttons with the datepicker.
     * @param portal Portal to be registered.
     */
    registerActions(portal) {
        if (this._actionsPortal && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('A MatDatepicker can only be associated with a single actions row.');
        }
        this._actionsPortal = portal;
    }
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal) {
        if (portal === this._actionsPortal) {
            this._actionsPortal = null;
        }
    }
    /** Open the calendar. */
    open() {
        var _a, _b;
        if (this._opened || this.disabled) {
            return;
        }
        if (!this.datepickerInput && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Attempted to open an MatDatepicker with no associated input.');
        }
        // If the `activeElement` is inside a shadow root, `document.activeElement` will
        // point to the shadow root so we have to descend into it ourselves.
        const activeElement = (_a = this._document) === null || _a === void 0 ? void 0 : _a.activeElement;
        this._focusedElementBeforeOpen =
            ((_b = activeElement === null || activeElement === void 0 ? void 0 : activeElement.shadowRoot) === null || _b === void 0 ? void 0 : _b.activeElement) || activeElement;
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
        if (this._restoreFocus && this._focusedElementBeforeOpen &&
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
    /** Applies the current pending selection on the popup to the model. */
    _applyPendingSelection() {
        var _a, _b;
        const instance = ((_a = this._popupComponentRef) === null || _a === void 0 ? void 0 : _a.instance) || ((_b = this._dialogRef) === null || _b === void 0 ? void 0 : _b.componentInstance);
        instance === null || instance === void 0 ? void 0 : instance._applyPendingSelection();
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
            // Disable the dialog's automatic focus capturing, because it'll go to the close button
            // automatically. The calendar will move focus on its own once it renders.
            autoFocus: false,
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
        instance._actionsPortal = this._actionsPortal;
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
    restoreFocus: [{ type: Input }],
    yearSelected: [{ type: Output }],
    monthSelected: [{ type: Output }],
    viewChanged: [{ type: Output }],
    dateClass: [{ type: Input }],
    openedStream: [{ type: Output, args: ['opened',] }],
    closedStream: [{ type: Output, args: ['closed',] }],
    panelClass: [{ type: Input }],
    opened: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RixPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQWdDLE1BQU0scUJBQXFCLENBQUM7QUFDbkYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLFNBQVMsR0FJVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsV0FBVyxFQUNYLFVBQVUsR0FFWCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxTQUFTLEVBQWUsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBYyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsV0FBVyxFQUFr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QkFDRSxPQUFPLEVBQUUsUUFBUTtnQkFDakIsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixRQUFRLEVBQUUsVUFBVTthQUNyQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxVQUFVO2dCQUNuQixPQUFPLEVBQUUsVUFBVTtnQkFDbkIsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRSxRQUFRO2FBQ25CO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLFVBQVU7YUFDckI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUE1ZEYsU0FBUzs7O1lBck9GLFNBQVM7WUF0Q2YsT0FBTztZQWtCUCxNQUFNO1lBS04sZ0JBQWdCOzRDQWthSCxNQUFNLFNBQUMsOEJBQThCO1lBdlpsRCxXQUFXLHVCQXdaRSxRQUFRO1lBOWJmLGNBQWMsdUJBK2JQLFFBQVE7NENBQ1IsUUFBUSxZQUFJLE1BQU0sU0FBQyxRQUFRO1lBNVl4QyxxQkFBcUI7OztzQ0FtT3BCLEtBQUs7c0JBR0wsS0FBSzt3QkFZTCxLQUFLO29CQUdMLEtBQUs7c0JBY0wsS0FBSzt1QkFRTCxLQUFLO3dCQWdCTCxLQUFLO3dCQUlMLEtBQUs7MkJBUUwsS0FBSzsyQkFXTCxNQUFNOzRCQU1OLE1BQU07MEJBS04sTUFBTTt3QkFJTixLQUFLOzJCQUdMLE1BQU0sU0FBQyxRQUFROzJCQUdmLE1BQU0sU0FBQyxRQUFRO3lCQU1mLEtBQUs7cUJBUUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RVNDQVBFLCBoYXNNb2RpZmllcktleSwgVVBfQVJST1d9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBTY3JvbGxTdHJhdGVneSxcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbXBvbmVudFBvcnRhbCwgQ29tcG9uZW50VHlwZSwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5Db2xvckN0b3IsXG4gIERhdGVBZGFwdGVyLFxuICBtaXhpbkNvbG9yLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXREaWFsb2csIE1hdERpYWxvZ1JlZn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGlhbG9nJztcbmltcG9ydCB7bWVyZ2UsIFN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRDYWxlbmRhciwgTWF0Q2FsZW5kYXJWaWV3fSBmcm9tICcuL2NhbGVuZGFyJztcbmltcG9ydCB7bWF0RGF0ZXBpY2tlckFuaW1hdGlvbnN9IGZyb20gJy4vZGF0ZXBpY2tlci1hbmltYXRpb25zJztcbmltcG9ydCB7Y3JlYXRlTWlzc2luZ0RhdGVJbXBsRXJyb3J9IGZyb20gJy4vZGF0ZXBpY2tlci1lcnJvcnMnO1xuaW1wb3J0IHtNYXRDYWxlbmRhclVzZXJFdmVudCwgTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbn0gZnJvbSAnLi9jYWxlbmRhci1ib2R5JztcbmltcG9ydCB7RGF0ZUZpbHRlckZufSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtYmFzZSc7XG5pbXBvcnQge1xuICBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uLFxuICBNYXREYXRlU2VsZWN0aW9uTW9kZWwsXG4gIERhdGVSYW5nZSxcbn0gZnJvbSAnLi9kYXRlLXNlbGVjdGlvbi1tb2RlbCc7XG5pbXBvcnQge1xuICBNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1ksXG4gIE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICcuL2RhdGUtcmFuZ2Utc2VsZWN0aW9uLXN0cmF0ZWd5JztcbmltcG9ydCB7TWF0RGF0ZXBpY2tlckludGx9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnRsJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgSUQgZm9yIGVhY2ggZGF0ZXBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBkYXRlcGlja2VyVWlkID0gMDtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1kYXRlcGlja2VyLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgZGF0ZXBpY2tlciBkcm9wZG93biBhbG9uZyB0aGUgWCBheGlzLiAqL1xuZXhwb3J0IHR5cGUgRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JyB8ICdlbmQnO1xuXG4vKiogUG9zc2libGUgcG9zaXRpb25zIGZvciB0aGUgZGF0ZXBpY2tlciBkcm9wZG93biBhbG9uZyB0aGUgWSBheGlzLiAqL1xuZXhwb3J0IHR5cGUgRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0RGF0ZXBpY2tlckNvbnRlbnQuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7IH1cbn1cbmNvbnN0IF9NYXREYXRlcGlja2VyQ29udGVudE1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdERhdGVwaWNrZXJDb250ZW50QmFzZSA9XG4gICAgbWl4aW5Db2xvcihNYXREYXRlcGlja2VyQ29udGVudEJhc2UpO1xuXG4vKipcbiAqIENvbXBvbmVudCB1c2VkIGFzIHRoZSBjb250ZW50IGZvciB0aGUgZGF0ZXBpY2tlciBkaWFsb2cgYW5kIHBvcHVwLiBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mIHVzaW5nXG4gKiBNYXRDYWxlbmRhciBkaXJlY3RseSBhcyB0aGUgY29udGVudCBzbyB3ZSBjYW4gY29udHJvbCB0aGUgaW5pdGlhbCBmb2N1cy4gVGhpcyBhbHNvIGdpdmVzIHVzIGFcbiAqIHBsYWNlIHRvIHB1dCBhZGRpdGlvbmFsIGZlYXR1cmVzIG9mIHRoZSBwb3B1cCB0aGF0IGFyZSBub3QgcGFydCBvZiB0aGUgY2FsZW5kYXIgaXRzZWxmIGluIHRoZVxuICogZnV0dXJlLiAoZS5nLiBjb25maXJtYXRpb24gYnV0dG9ucykuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJ2RhdGVwaWNrZXItY29udGVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2RhdGVwaWNrZXItY29udGVudC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZGF0ZXBpY2tlci1jb250ZW50JyxcbiAgICAnW0B0cmFuc2Zvcm1QYW5lbF0nOiAnX2FuaW1hdGlvblN0YXRlJyxcbiAgICAnKEB0cmFuc2Zvcm1QYW5lbC5kb25lKSc6ICdfYW5pbWF0aW9uRG9uZS5uZXh0KCknLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItY29udGVudC10b3VjaF0nOiAnZGF0ZXBpY2tlci50b3VjaFVpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdERhdGVwaWNrZXJBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsLFxuICAgIG1hdERhdGVwaWNrZXJBbmltYXRpb25zLmZhZGVJbkNhbGVuZGFyLFxuICBdLFxuICBleHBvcnRBczogJ21hdERhdGVwaWNrZXJDb250ZW50JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydjb2xvciddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXREYXRlcGlja2VyQ29udGVudDxTLCBEID0gRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPj5cbiAgZXh0ZW5kcyBfTWF0RGF0ZXBpY2tlckNvbnRlbnRNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgQ2FuQ29sb3Ige1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGNhbGVuZGFyIGNvbXBvbmVudC4gKi9cbiAgQFZpZXdDaGlsZChNYXRDYWxlbmRhcikgX2NhbGVuZGFyOiBNYXRDYWxlbmRhcjxEPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBkYXRlcGlja2VyIHRoYXQgY3JlYXRlZCB0aGUgb3ZlcmxheS4gKi9cbiAgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlckJhc2U8YW55LCBTLCBEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGlucHV0LiAqL1xuICBfaXNBYm92ZTogYm9vbGVhbjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICdlbnRlcicgfCAndm9pZCcgPSAnZW50ZXInO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBoYXMgZmluaXNoZWQuICovXG4gIF9hbmltYXRpb25Eb25lID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGV4dCBmb3IgdGhlIGNsb3NlIGJ1dHRvbi4gKi9cbiAgX2Nsb3NlQnV0dG9uVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9zZSBidXR0b24gY3VycmVudGx5IGhhcyBmb2N1cy4gKi9cbiAgX2Nsb3NlQnV0dG9uRm9jdXNlZDogYm9vbGVhbjtcblxuICAvKiogUG9ydGFsIHdpdGggcHJvamVjdGVkIGFjdGlvbiBidXR0b25zLiAqL1xuICBfYWN0aW9uc1BvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9nbG9iYWxNb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSlcbiAgICAgICAgcHJpdmF0ZSBfcmFuZ2VTZWxlY3Rpb25TdHJhdGVneTogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4sXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGludGxgIGFyZ3VtZW50IHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEyLjAuMFxuICAgICAqL1xuICAgIGludGw/OiBNYXREYXRlcGlja2VySW50bCkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wIFJlbW92ZSBmYWxsYmFjayBmb3IgYGludGxgLlxuICAgIHRoaXMuX2Nsb3NlQnV0dG9uVGV4dCA9IGludGw/LmNsb3NlQ2FsZW5kYXJMYWJlbCB8fCAnQ2xvc2UgY2FsZW5kYXInO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zLCBjbG9uZSB0aGUgbW9kZWwgc28gdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvIGNhbmNlbCB0aGUgc2VsZWN0aW9uLFxuICAgIC8vIG90aGVyd2lzZSB1cGRhdGUgdGhlIGdsb2JhbCBtb2RlbCBkaXJlY3RseS4gTm90ZSB0aGF0IHdlIHdhbnQgdG8gYXNzaWduIHRoaXMgYXMgc29vbiBhc1xuICAgIC8vIHBvc3NpYmxlLCBidXQgYF9hY3Rpb25zUG9ydGFsYCBpc24ndCBhdmFpbGFibGUgaW4gdGhlIGNvbnN0cnVjdG9yIHNvIHdlIGRvIGl0IGluIGBuZ09uSW5pdGAuXG4gICAgdGhpcy5fbW9kZWwgPSB0aGlzLl9hY3Rpb25zUG9ydGFsID8gdGhpcy5fZ2xvYmFsTW9kZWwuY2xvbmUoKSA6IHRoaXMuX2dsb2JhbE1vZGVsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZGF0ZXBpY2tlci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pKTtcbiAgICB0aGlzLl9jYWxlbmRhci5mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfaGFuZGxlVXNlclNlbGVjdGlvbihldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5fbW9kZWwuc2VsZWN0aW9uO1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudmFsdWU7XG4gICAgY29uc3QgaXNSYW5nZSA9IHNlbGVjdGlvbiBpbnN0YW5jZW9mIERhdGVSYW5nZTtcblxuICAgIC8vIElmIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlIGFuZCB3ZSBoYXZlIGEgc2VsZWN0aW9uIHN0cmF0ZWd5LCBhbHdheXMgcGFzcyB0aGUgdmFsdWUgdGhyb3VnaFxuICAgIC8vIHRoZXJlLiBPdGhlcndpc2UgZG9uJ3QgYXNzaWduIG51bGwgdmFsdWVzIHRvIHRoZSBtb2RlbCwgdW5sZXNzIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlLlxuICAgIC8vIEEgbnVsbCB2YWx1ZSB3aGVuIHBpY2tpbmcgYSByYW5nZSBtZWFucyB0aGF0IHRoZSB1c2VyIGNhbmNlbGxlZCB0aGUgc2VsZWN0aW9uIChlLmcuIGJ5XG4gICAgLy8gcHJlc3NpbmcgZXNjYXBlKSwgd2hlcmVhcyB3aGVuIHNlbGVjdGluZyBhIHNpbmdsZSB2YWx1ZSBpdCBtZWFucyB0aGF0IHRoZSB2YWx1ZSBkaWRuJ3RcbiAgICAvLyBjaGFuZ2UuIFRoaXMgaXNuJ3QgdmVyeSBpbnR1aXRpdmUsIGJ1dCBpdCdzIGhlcmUgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICAgIGlmIChpc1JhbmdlICYmIHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kuc2VsZWN0aW9uRmluaXNoZWQodmFsdWUsXG4gICAgICAgICAgc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRGF0ZVJhbmdlPEQ+LCBldmVudC5ldmVudCk7XG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVTZWxlY3Rpb24obmV3U2VsZWN0aW9uIGFzIHVua25vd24gYXMgUywgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAmJiAoaXNSYW5nZSB8fFxuICAgICAgICAgICAgICAhdGhpcy5fZGF0ZUFkYXB0ZXIuc2FtZURhdGUodmFsdWUsIHNlbGVjdGlvbiBhcyB1bmtub3duIGFzIEQpKSkge1xuICAgICAgdGhpcy5fbW9kZWwuYWRkKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBEZWxlZ2F0ZSBjbG9zaW5nIHRoZSBwb3B1cCB0byB0aGUgYWN0aW9ucy5cbiAgICBpZiAoKCF0aGlzLl9tb2RlbCB8fCB0aGlzLl9tb2RlbC5pc0NvbXBsZXRlKCkpICYmICF0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX2dldFNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbC5zZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEIHwgRGF0ZVJhbmdlPEQ+IHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHRoZSBjdXJyZW50IHBlbmRpbmcgc2VsZWN0aW9uIHRvIHRoZSBnbG9iYWwgbW9kZWwuICovXG4gIF9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsICE9PSB0aGlzLl9nbG9iYWxNb2RlbCkge1xuICAgICAgdGhpcy5fZ2xvYmFsTW9kZWwudXBkYXRlU2VsZWN0aW9uKHRoaXMuX21vZGVsLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcbn1cblxuLyoqIEEgZGF0ZXBpY2tlciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBhIHtAbGluayBNYXREYXRlcGlja2VyQ29udHJvbH0uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVwaWNrZXJQYW5lbDxDIGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIFMsXG4gICAgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+IHtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBkYXRlIHBpY2tlciBpcyBjbG9zZWQuICovXG4gIGNsb3NlZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+O1xuICAvKiogQ29sb3IgcGFsZXR0ZSB0byB1c2Ugb24gdGhlIGRhdGVwaWNrZXIncyBjYWxlbmRhci4gKi9cbiAgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoZSBkYXRlcGlja2VyIGlzIGFzc29jaWF0ZWQgd2l0aC4gKi9cbiAgZGF0ZXBpY2tlcklucHV0OiBDO1xuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3AtdXAgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgLyoqIFRoZSBpZCBmb3IgdGhlIGRhdGVwaWNrZXIncyBjYWxlbmRhci4gKi9cbiAgaWQ6IHN0cmluZztcbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaXMgb3Blbi4gKi9cbiAgb3BlbmVkOiBib29sZWFuO1xuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGRhdGUgcGlja2VyIGlzIG9wZW5lZC4gKi9cbiAgb3BlbmVkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyJ3Mgc3RhdGUgY2hhbmdlcy4gKi9cbiAgc3RhdGVDaGFuZ2VzOiBTdWJqZWN0PHZvaWQ+O1xuICAvKiogT3BlbnMgdGhlIGRhdGVwaWNrZXIuICovXG4gIG9wZW4oKTogdm9pZDtcbiAgLyoqIFJlZ2lzdGVyIGFuIGlucHV0IHdpdGggdGhlIGRhdGVwaWNrZXIuICovXG4gIHJlZ2lzdGVySW5wdXQoaW5wdXQ6IEMpOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD47XG59XG5cbi8qKiBCYXNlIGNsYXNzIGZvciBhIGRhdGVwaWNrZXIuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXREYXRlcGlja2VyQmFzZTxDIGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sIFMsXG4gIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+PiBpbXBsZW1lbnRzIE1hdERhdGVwaWNrZXJQYW5lbDxDLCBTLCBEPiwgT25EZXN0cm95LFxuICAgIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfaW5wdXRTdGF0ZUNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIEFuIGlucHV0IGluZGljYXRpbmcgdGhlIHR5cGUgb2YgdGhlIGN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGZvciB0aGUgY2FsZW5kYXIsIGlmIHNldC4gKi9cbiAgQElucHV0KCkgY2FsZW5kYXJIZWFkZXJDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8YW55PjtcblxuICAvKiogVGhlIGRhdGUgdG8gb3BlbiB0aGUgY2FsZW5kYXIgdG8gaW5pdGlhbGx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gZXhwbGljaXQgc3RhcnRBdCBpcyBzZXQgd2Ugc3RhcnQgdGhlcmUsIG90aGVyd2lzZSB3ZSBzdGFydCBhdCB3aGF0ZXZlciB0aGUgY3VycmVudGx5XG4gICAgLy8gc2VsZWN0ZWQgdmFsdWUgaXMuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0QXQgfHwgKHRoaXMuZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvciB8fFxuICAgICAgICAodGhpcy5kYXRlcGlja2VySW5wdXQgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRUaGVtZVBhbGV0dGUoKSA6IHVuZGVmaW5lZCk7XG4gIH1cbiAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBVSSBpcyBpbiB0b3VjaCBtb2RlLiBJbiB0b3VjaCBtb2RlIHRoZSBjYWxlbmRhciBvcGVucyBpbiBhIGRpYWxvZyByYXRoZXJcbiAgICogdGhhbiBhIHBvcHVwIGFuZCBlbGVtZW50cyBoYXZlIG1vcmUgcGFkZGluZyB0byBhbGxvdyBmb3IgYmlnZ2VyIHRvdWNoIHRhcmdldHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgdG91Y2hVaSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3RvdWNoVWk7IH1cbiAgc2V0IHRvdWNoVWkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl90b3VjaFVpID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90b3VjaFVpID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wLXVwIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCA9PT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0ID9cbiAgICAgICAgdGhpcy5kYXRlcGlja2VySW5wdXQuZGlzYWJsZWQgOiAhIXRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeFBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeVBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYmVsb3cnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlc3RvcmUgZm9jdXMgdG8gdGhlIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50IHdoZW4gdGhlIGNhbGVuZGFyIGlzIGNsb3NlZC5cbiAgICogTm90ZSB0aGF0IGF1dG9tYXRpYyBmb2N1cyByZXN0b3JhdGlvbiBpcyBhbiBhY2Nlc3NpYmlsaXR5IGZlYXR1cmUgYW5kIGl0IGlzIHJlY29tbWVuZGVkIHRoYXRcbiAgICogeW91IHByb3ZpZGUgeW91ciBvd24gZXF1aXZhbGVudCwgaWYgeW91IGRlY2lkZSB0byB0dXJuIGl0IG9mZi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXN0b3JlRm9jdXMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXN0b3JlRm9jdXM7IH1cbiAgc2V0IHJlc3RvcmVGb2N1cyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Jlc3RvcmVGb2N1cyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcmVzdG9yZUZvY3VzID0gdHJ1ZTtcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldy5cbiAgICogVGhpcyBkb2Vzbid0IGltcGx5IGEgY2hhbmdlIG9uIHRoZSBzZWxlY3RlZCBkYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHllYXJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyBzZWxlY3RlZCBtb250aCBpbiB5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBtb250aFNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8RD4gPSBuZXcgRXZlbnRFbWl0dGVyPEQ+KCk7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHdoZW4gdGhlIGN1cnJlbnQgdmlldyBjaGFuZ2VzLlxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZpZXdDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8TWF0Q2FsZW5kYXJWaWV3PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRDYWxlbmRhclZpZXc+KHRydWUpO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBjdXN0b20gQ1NTIGNsYXNzZXMgdG8gZGF0ZXMuICovXG4gIEBJbnB1dCgpIGRhdGVDbGFzczogTWF0Q2FsZW5kYXJDZWxsQ2xhc3NGdW5jdGlvbjxEPjtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlciBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkYXRlcGlja2VyIGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBkYXRlIHBpY2tlciBwYW5lbC5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzaW1pbGFyIHRvIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYW5lbENsYXNzKCk6IHN0cmluZyB8IHN0cmluZ1tdIHsgcmV0dXJuIHRoaXMuX3BhbmVsQ2xhc3M7IH1cbiAgc2V0IHBhbmVsQ2xhc3ModmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fcGFuZWxDbGFzcyA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9wYW5lbENsYXNzOiBzdHJpbmdbXTtcblxuICAvKiogV2hldGhlciB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW5lZDsgfVxuICBzZXQgb3BlbmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSA/IHRoaXMub3BlbigpIDogdGhpcy5jbG9zZSgpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1kYXRlcGlja2VyLSR7ZGF0ZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dC5taW47XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1heDtcbiAgfVxuXG4gIF9nZXREYXRlRmlsdGVyKCk6IERhdGVGaWx0ZXJGbjxEPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgd2hlbiB0aGUgY2FsZW5kYXIgaXMgb3BlbmVkIGFzIGEgcG9wdXAuICovXG4gIHByaXZhdGUgX3BvcHVwUmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIGRpYWxvZyB3aGVuIHRoZSBjYWxlbmRhciBpcyBvcGVuZWQgYXMgYSBkaWFsb2cuICovXG4gIHByaXZhdGUgX2RpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgY29tcG9uZW50IGluc3RhbnRpYXRlZCBpbiBwb3B1cCBtb2RlLiAqL1xuICBwcml2YXRlIF9wb3B1cENvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PiB8IG51bGw7XG5cbiAgLyoqIFRoZSBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIHRoZSBkYXRlcGlja2VyIHdhcyBvcGVuZWQuICovXG4gIHByaXZhdGUgX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbjogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKiogVW5pcXVlIGNsYXNzIHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgYmFja2Ryb3Agc28gdGhhdCB0aGUgdGVzdCBoYXJuZXNzZXMgY2FuIGxvb2sgaXQgdXAuICovXG4gIHByaXZhdGUgX2JhY2tkcm9wSGFybmVzc0NsYXNzID0gYCR7dGhpcy5pZH0tYmFja2Ryb3BgO1xuXG4gIC8qKiBDdXJyZW50bHktcmVnaXN0ZXJlZCBhY3Rpb25zIHBvcnRhbC4gKi9cbiAgcHJpdmF0ZSBfYWN0aW9uc1BvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsO1xuXG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGlzIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRlcGlja2VySW5wdXQ6IEM7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpYWxvZzogTWF0RGlhbG9nLFxuICAgICAgICAgICAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgICAgICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPikge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2UgPSBjaGFuZ2VzWyd4UG9zaXRpb24nXSB8fCBjaGFuZ2VzWyd5UG9zaXRpb24nXTtcblxuICAgIGlmIChwb3NpdGlvbkNoYW5nZSAmJiAhcG9zaXRpb25DaGFuZ2UuZmlyc3RDaGFuZ2UgJiYgdGhpcy5fcG9wdXBSZWYpIHtcbiAgICAgIHRoaXMuX3NldENvbm5lY3RlZFBvc2l0aW9ucyhcbiAgICAgICAgICB0aGlzLl9wb3B1cFJlZi5nZXRDb25maWcoKS5wb3NpdGlvblN0cmF0ZWd5IGFzIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICB0aGlzLl9wb3B1cFJlZi51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gZGF0ZSAqL1xuICBzZWxlY3QoZGF0ZTogRCk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsLmFkZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldyAqL1xuICBfc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogRCk6IHZvaWQge1xuICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQobm9ybWFsaXplZFllYXIpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldyAqL1xuICBfc2VsZWN0TW9udGgobm9ybWFsaXplZE1vbnRoOiBEKTogdm9pZCB7XG4gICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2VkIHZpZXcgKi9cbiAgX3ZpZXdDaGFuZ2VkKHZpZXc6IE1hdENhbGVuZGFyVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh2aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRlcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gbW9kZWwgdGhhdCB0aGUgaW5wdXQgc2hvdWxkIGhvb2sgaXRzZWxmIHVwIHRvLlxuICAgKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRhdGVwaWNrZXJJbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzID1cbiAgICAgICAgaW5wdXQuc3RhdGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCkpO1xuICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBwb3J0YWwgY29udGFpbmluZyBhY3Rpb24gYnV0dG9ucyB3aXRoIHRoZSBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJBY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYWN0aW9uc1BvcnRhbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0EgTWF0RGF0ZXBpY2tlciBjYW4gb25seSBiZSBhc3NvY2lhdGVkIHdpdGggYSBzaW5nbGUgYWN0aW9ucyByb3cuJyk7XG4gICAgfVxuICAgIHRoaXMuX2FjdGlvbnNQb3J0YWwgPSBwb3J0YWw7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHBvcnRhbCBjb250YWluaW5nIGFjdGlvbiBidXR0b25zIGZyb20gdGhlIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICByZW1vdmVBY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWwpOiB2b2lkIHtcbiAgICBpZiAocG9ydGFsID09PSB0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hY3Rpb25zUG9ydGFsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogT3BlbiB0aGUgY2FsZW5kYXIuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW5lZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5kYXRlcGlja2VySW5wdXQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0ZWQgdG8gb3BlbiBhbiBNYXREYXRlcGlja2VyIHdpdGggbm8gYXNzb2NpYXRlZCBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgYGFjdGl2ZUVsZW1lbnRgIGlzIGluc2lkZSBhIHNoYWRvdyByb290LCBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgd2lsbFxuICAgIC8vIHBvaW50IHRvIHRoZSBzaGFkb3cgcm9vdCBzbyB3ZSBoYXZlIHRvIGRlc2NlbmQgaW50byBpdCBvdXJzZWx2ZXMuXG4gICAgY29uc3QgYWN0aXZlRWxlbWVudDogSFRNTEVsZW1lbnR8bnVsbCA9IHRoaXMuX2RvY3VtZW50Py5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9XG4gICAgICBhY3RpdmVFbGVtZW50Py5zaGFkb3dSb290Py5hY3RpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50IHx8IGFjdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy50b3VjaFVpID8gdGhpcy5fb3BlbkFzRGlhbG9nKCkgOiB0aGlzLl9vcGVuQXNQb3B1cCgpO1xuICAgIHRoaXMuX29wZW5lZCA9IHRydWU7XG4gICAgdGhpcy5vcGVuZWRTdHJlYW0uZW1pdCgpO1xuICB9XG5cbiAgLyoqIENsb3NlIHRoZSBjYWxlbmRhci4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9vcGVuZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmICYmIHRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgICAgaW5zdGFuY2UuX3N0YXJ0RXhpdEFuaW1hdGlvbigpO1xuICAgICAgaW5zdGFuY2UuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fZGVzdHJveVBvcHVwKCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGlhbG9nUmVmKSB7XG4gICAgICB0aGlzLl9kaWFsb2dSZWYuY2xvc2UoKTtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZiA9IG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcGxldGVDbG9zZSA9ICgpID0+IHtcbiAgICAgIC8vIFRoZSBgX29wZW5lZGAgY291bGQndmUgYmVlbiByZXNldCBhbHJlYWR5IGlmXG4gICAgICAvLyB3ZSBnb3QgdHdvIGV2ZW50cyBpbiBxdWljayBzdWNjZXNzaW9uLlxuICAgICAgaWYgKHRoaXMuX29wZW5lZCkge1xuICAgICAgICB0aGlzLl9vcGVuZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jbG9zZWRTdHJlYW0uZW1pdCgpO1xuICAgICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4gPSBudWxsO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5fcmVzdG9yZUZvY3VzICYmIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQmVjYXVzZSBJRSBtb3ZlcyBmb2N1cyBhc3luY2hyb25vdXNseSwgd2UgY2FuJ3QgY291bnQgb24gaXQgYmVpbmcgcmVzdG9yZWQgYmVmb3JlIHdlJ3ZlXG4gICAgICAvLyBtYXJrZWQgdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLiBJZiB0aGUgZXZlbnQgZmlyZXMgb3V0IG9mIHNlcXVlbmNlIGFuZCB0aGUgZWxlbWVudCB0aGF0XG4gICAgICAvLyB3ZSdyZSByZWZvY3VzaW5nIG9wZW5zIHRoZSBkYXRlcGlja2VyIG9uIGZvY3VzLCB0aGUgdXNlciBjb3VsZCBiZSBzdHVjayB3aXRoIG5vdCBiZWluZ1xuICAgICAgLy8gYWJsZSB0byBjbG9zZSB0aGUgY2FsZW5kYXIgYXQgYWxsLiBXZSB3b3JrIGFyb3VuZCBpdCBieSBtYWtpbmcgdGhlIGxvZ2ljLCB0aGF0IG1hcmtzXG4gICAgICAvLyB0aGUgZGF0ZXBpY2tlciBhcyBjbG9zZWQsIGFzeW5jIGFzIHdlbGwuXG4gICAgICB0aGlzLl9mb2N1c2VkRWxlbWVudEJlZm9yZU9wZW4uZm9jdXMoKTtcbiAgICAgIHNldFRpbWVvdXQoY29tcGxldGVDbG9zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBsZXRlQ2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQXBwbGllcyB0aGUgY3VycmVudCBwZW5kaW5nIHNlbGVjdGlvbiBvbiB0aGUgcG9wdXAgdG8gdGhlIG1vZGVsLiAqL1xuICBfYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5fcG9wdXBDb21wb25lbnRSZWY/Lmluc3RhbmNlIHx8IHRoaXMuX2RpYWxvZ1JlZj8uY29tcG9uZW50SW5zdGFuY2U7XG4gICAgaW5zdGFuY2U/Ll9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRpYWxvZy4gKi9cbiAgcHJpdmF0ZSBfb3BlbkFzRGlhbG9nKCk6IHZvaWQge1xuICAgIC8vIFVzdWFsbHkgdGhpcyB3b3VsZCBiZSBoYW5kbGVkIGJ5IGBvcGVuYCB3aGljaCBlbnN1cmVzIHRoYXQgd2UgY2FuIG9ubHkgaGF2ZSBvbmUgb3ZlcmxheVxuICAgIC8vIG9wZW4gYXQgYSB0aW1lLCBob3dldmVyIHNpbmNlIHdlIHJlc2V0IHRoZSB2YXJpYWJsZXMgaW4gYXN5bmMgaGFuZGxlcnMgc29tZSBvdmVybGF5c1xuICAgIC8vIG1heSBzbGlwIHRocm91Z2ggaWYgdGhlIHVzZXIgb3BlbnMgYW5kIGNsb3NlcyBtdWx0aXBsZSB0aW1lcyBpbiBxdWljayBzdWNjZXNzaW9uIChlLmcuXG4gICAgLy8gYnkgaG9sZGluZyBkb3duIHRoZSBlbnRlciBrZXkpLlxuICAgIGlmICh0aGlzLl9kaWFsb2dSZWYpIHtcbiAgICAgIHRoaXMuX2RpYWxvZ1JlZi5jbG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2RpYWxvZ1JlZiA9IHRoaXMuX2RpYWxvZy5vcGVuPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCwge1xuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJyxcbiAgICAgIHZpZXdDb250YWluZXJSZWY6IHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgICBwYW5lbENsYXNzOiAnbWF0LWRhdGVwaWNrZXItZGlhbG9nJyxcblxuICAgICAgLy8gVGhlc2UgdmFsdWVzIGFyZSBhbGwgdGhlIHNhbWUgYXMgdGhlIGRlZmF1bHRzLCBidXQgd2Ugc2V0IHRoZW0gZXhwbGljaXRseSBzbyB0aGF0IHRoZVxuICAgICAgLy8gZGF0ZXBpY2tlciBkaWFsb2cgYmVoYXZlcyBjb25zaXN0ZW50bHkgZXZlbiBpZiB0aGUgdXNlciBjaGFuZ2VkIHRoZSBkZWZhdWx0cy5cbiAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgZGlzYWJsZUNsb3NlOiBmYWxzZSxcbiAgICAgIGJhY2tkcm9wQ2xhc3M6IFsnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCcsIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzXSxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGhlaWdodDogJycsXG4gICAgICBtaW5XaWR0aDogJycsXG4gICAgICBtaW5IZWlnaHQ6ICcnLFxuICAgICAgbWF4V2lkdGg6ICc4MHZ3JyxcbiAgICAgIG1heEhlaWdodDogJycsXG4gICAgICBwb3NpdGlvbjoge30sXG5cbiAgICAgIC8vIERpc2FibGUgdGhlIGRpYWxvZydzIGF1dG9tYXRpYyBmb2N1cyBjYXB0dXJpbmcsIGJlY2F1c2UgaXQnbGwgZ28gdG8gdGhlIGNsb3NlIGJ1dHRvblxuICAgICAgLy8gYXV0b21hdGljYWxseS4gVGhlIGNhbGVuZGFyIHdpbGwgbW92ZSBmb2N1cyBvbiBpdHMgb3duIG9uY2UgaXQgcmVuZGVycy5cbiAgICAgIGF1dG9Gb2N1czogZmFsc2UsXG5cbiAgICAgIC8vIGBNYXREaWFsb2dgIGhhcyBmb2N1cyByZXN0b3JhdGlvbiBidWlsdCBpbiwgaG93ZXZlciB3ZSB3YW50IHRvIGRpc2FibGUgaXQgc2luY2UgdGhlXG4gICAgICAvLyBkYXRlcGlja2VyIGFsc28gaGFzIGZvY3VzIHJlc3RvcmF0aW9uIGZvciBkcm9wZG93biBtb2RlLiBXZSB3YW50IHRvIGRvIHRoaXMsIGluIG9yZGVyXG4gICAgICAvLyB0byBlbnN1cmUgdGhhdCB0aGUgdGltaW5nIGlzIGNvbnNpc3RlbnQgYmV0d2VlbiBkcm9wZG93biBhbmQgZGlhbG9nIG1vZGVzIHNpbmNlIGBNYXREaWFsb2dgXG4gICAgICAvLyByZXN0b3JlcyBmb2N1cyB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQsIGJ1dCB0aGUgZGF0ZXBpY2tlciBkb2VzIGl0IGltbWVkaWF0ZWx5LlxuICAgICAgLy8gRnVydGhlcm1vcmUsIHRoaXMgYXZvaWRzIGFueSBjb25mbGljdHMgd2hlcmUgdGhlIGRhdGVwaWNrZXIgY29uc3VtZXIgbWlnaHQgbW92ZSBmb2N1c1xuICAgICAgLy8gaW5zaWRlIHRoZSBgY2xvc2VkYCBldmVudCB3aGljaCBpcyBkaXNwYXRjaGVkIGltbWVkaWF0ZWx5LlxuICAgICAgcmVzdG9yZUZvY3VzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKCgpID0+IHRoaXMuY2xvc2UoKSk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlKTtcbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhciBhcyBhIHBvcHVwLiAqL1xuICBwcml2YXRlIF9vcGVuQXNQb3B1cCgpOiB2b2lkIHtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihNYXREYXRlcGlja2VyQ29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcblxuICAgIHRoaXMuX2Rlc3Ryb3lQb3B1cCgpO1xuICAgIHRoaXMuX2NyZWF0ZVBvcHVwKCk7XG4gICAgdGhpcy5fcG9wdXBDb21wb25lbnRSZWYgPSB0aGlzLl9wb3B1cFJlZiEuYXR0YWNoKHBvcnRhbCk7XG4gICAgdGhpcy5fZm9yd2FyZENvbnRlbnRWYWx1ZXModGhpcy5fcG9wdXBDb21wb25lbnRSZWYuaW5zdGFuY2UpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBwb3NpdGlvbiBvbmNlIHRoZSBjYWxlbmRhciBoYXMgcmVuZGVyZWQuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3BvcHVwUmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEZvcndhcmRzIHJlbGV2YW50IHZhbHVlcyBmcm9tIHRoZSBkYXRlcGlja2VyIHRvIHRoZSBkYXRlcGlja2VyIGNvbnRlbnQgaW5zaWRlIHRoZSBvdmVybGF5LiAqL1xuICBwcm90ZWN0ZWQgX2ZvcndhcmRDb250ZW50VmFsdWVzKGluc3RhbmNlOiBNYXREYXRlcGlja2VyQ29udGVudDxTLCBEPikge1xuICAgIGluc3RhbmNlLmRhdGVwaWNrZXIgPSB0aGlzO1xuICAgIGluc3RhbmNlLmNvbG9yID0gdGhpcy5jb2xvcjtcbiAgICBpbnN0YW5jZS5fYWN0aW9uc1BvcnRhbCA9IHRoaXMuX2FjdGlvbnNQb3J0YWw7XG4gIH1cblxuICAvKiogQ3JlYXRlIHRoZSBwb3B1cC4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlUG9wdXAoKTogdm9pZCB7XG4gICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQnKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKCk7XG5cbiAgICBjb25zdCBvdmVybGF5Q29uZmlnID0gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3kpLFxuICAgICAgaGFzQmFja2Ryb3A6IHRydWUsXG4gICAgICBiYWNrZHJvcENsYXNzOiBbJ21hdC1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wJywgdGhpcy5fYmFja2Ryb3BIYXJuZXNzQ2xhc3NdLFxuICAgICAgZGlyZWN0aW9uOiB0aGlzLl9kaXIsXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtZGF0ZXBpY2tlci1wb3B1cCcsXG4gICAgfSk7XG5cbiAgICB0aGlzLl9wb3B1cFJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKG92ZXJsYXlDb25maWcpO1xuICAgIHRoaXMuX3BvcHVwUmVmLm92ZXJsYXlFbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcblxuICAgIG1lcmdlKFxuICAgICAgdGhpcy5fcG9wdXBSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgdGhpcy5fcG9wdXBSZWYuZGV0YWNobWVudHMoKSxcbiAgICAgIHRoaXMuX3BvcHVwUmVmLmtleWRvd25FdmVudHMoKS5waXBlKGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIC8vIENsb3Npbmcgb24gYWx0ICsgdXAgaXMgb25seSB2YWxpZCB3aGVuIHRoZXJlJ3MgYW4gaW5wdXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBkYXRlcGlja2VyLlxuICAgICAgICByZXR1cm4gKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fCAodGhpcy5kYXRlcGlja2VySW5wdXQgJiZcbiAgICAgICAgICAgIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykgJiYgZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cpO1xuICAgICAgfSkpXG4gICAgKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgY3VycmVudCBwb3B1cCBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9kZXN0cm95UG9wdXAoKSB7XG4gICAgaWYgKHRoaXMuX3BvcHVwUmVmKSB7XG4gICAgICB0aGlzLl9wb3B1cFJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9wb3B1cFJlZiA9IHRoaXMuX3BvcHVwQ29tcG9uZW50UmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb25zIG9mIHRoZSBkYXRlcGlja2VyIGluIGRyb3Bkb3duIG1vZGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc2V0Q29ubmVjdGVkUG9zaXRpb25zKHN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICBjb25zdCBwcmltYXJ5WCA9IHRoaXMueFBvc2l0aW9uID09PSAnZW5kJyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBzZWNvbmRhcnlYID0gcHJpbWFyeVggPT09ICdzdGFydCcgPyAnZW5kJyA6ICdzdGFydCc7XG4gICAgY29uc3QgcHJpbWFyeVkgPSB0aGlzLnlQb3NpdGlvbiA9PT0gJ2Fib3ZlJyA/ICdib3R0b20nIDogJ3RvcCc7XG4gICAgY29uc3Qgc2Vjb25kYXJ5WSA9IHByaW1hcnlZID09PSAndG9wJyA/ICdib3R0b20nIDogJ3RvcCc7XG5cbiAgICByZXR1cm4gc3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhbXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHByaW1hcnlYLFxuICAgICAgICBvcmlnaW5ZOiBzZWNvbmRhcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBzZWNvbmRhcnlYLFxuICAgICAgICBvcmlnaW5ZOiBzZWNvbmRhcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcmlnaW5YOiBzZWNvbmRhcnlYLFxuICAgICAgICBvcmlnaW5ZOiBwcmltYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZXG4gICAgICB9XG4gICAgXSk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29wZW5lZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdG91Y2hVaTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVzdG9yZUZvY3VzOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=