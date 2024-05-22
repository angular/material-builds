/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceStringArray } from '@angular/cdk/coercion';
import { DOWN_ARROW, ESCAPE, hasModifierKey, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, FlexibleConnectedPositionStrategy, } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef, Directive, inject, booleanAttribute, afterNextRender, Injector, } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { MatCalendar } from './calendar';
import { matDatepickerAnimations } from './datepicker-animations';
import { createMissingDateImplError } from './datepicker-errors';
import { MatDateSelectionModel, DateRange, } from './date-selection-model';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, } from './date-range-selection-strategy';
import { MatDatepickerIntl } from './datepicker-intl';
import { DOCUMENT } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import * as i0 from "@angular/core";
import * as i1 from "./date-selection-model";
import * as i2 from "@angular/material/core";
import * as i3 from "./datepicker-intl";
import * as i4 from "@angular/cdk/overlay";
import * as i5 from "@angular/cdk/bidi";
/** Used to generate a unique ID for each datepicker instance. */
let datepickerUid = 0;
/** Injection token that determines the scroll handling while the calendar is open. */
export const MAT_DATEPICKER_SCROLL_STRATEGY = new InjectionToken('mat-datepicker-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
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
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
export class MatDatepickerContent {
    constructor(_elementRef, _changeDetectorRef, _globalModel, _dateAdapter, _rangeSelectionStrategy, intl) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._globalModel = _globalModel;
        this._dateAdapter = _dateAdapter;
        this._rangeSelectionStrategy = _rangeSelectionStrategy;
        this._subscriptions = new Subscription();
        /** Emits when an animation has finished. */
        this._animationDone = new Subject();
        /** Whether there is an in-progress animation. */
        this._isAnimating = false;
        /** Portal with projected action buttons. */
        this._actionsPortal = null;
        this._closeButtonText = intl.closeCalendarLabel;
    }
    ngOnInit() {
        this._animationState = this.datepicker.touchUi ? 'enter-dialog' : 'enter-dropdown';
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
        else if (value &&
            (isRange || !this._dateAdapter.sameDate(value, selection))) {
            this._model.add(value);
        }
        // Delegate closing the overlay to the actions.
        if ((!this._model || this._model.isComplete()) && !this._actionsPortal) {
            this.datepicker.close();
        }
    }
    _handleUserDragDrop(event) {
        this._model.updateSelection(event.value, this);
    }
    _startExitAnimation() {
        this._animationState = 'void';
        this._changeDetectorRef.markForCheck();
    }
    _handleAnimationEvent(event) {
        this._isAnimating = event.phaseName === 'start';
        if (!this._isAnimating) {
            this._animationDone.next();
        }
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
    /**
     * Assigns a new portal containing the datepicker actions.
     * @param portal Portal with the actions to be assigned.
     * @param forceRerender Whether a re-render of the portal should be triggered. This isn't
     * necessary if the portal is assigned during initialization, but it may be required if it's
     * added at a later point.
     */
    _assignActions(portal, forceRerender) {
        // If we have actions, clone the model so that we have the ability to cancel the selection,
        // otherwise update the global model directly. Note that we want to assign this as soon as
        // possible, but `_actionsPortal` isn't available in the constructor so we do it in `ngOnInit`.
        this._model = portal ? this._globalModel.clone() : this._globalModel;
        this._actionsPortal = portal;
        if (forceRerender) {
            this._changeDetectorRef.detectChanges();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDatepickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.MatDateSelectionModel }, { token: i2.DateAdapter }, { token: MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }, { token: i3.MatDatepickerIntl }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.0.0", type: MatDatepickerContent, isStandalone: true, selector: "mat-datepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.start": "_handleAnimationEvent($event)", "@transformPanel.done": "_handleAnimationEvent($event)" }, properties: { "class": "color ? \"mat-\" + color : \"\"", "@transformPanel": "_animationState", "class.mat-datepicker-content-touch": "datepicker.touchUi" }, classAttribute: "mat-datepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: MatCalendar, descendants: true }], exportAs: ["matDatepickerContent"], ngImport: i0, template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [class]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px;background-color:var(--mat-datepicker-calendar-container-background-color);color:var(--mat-datepicker-calendar-container-text-color);box-shadow:var(--mat-datepicker-calendar-container-elevation-shadow);border-radius:var(--mat-datepicker-calendar-container-shape)}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mat-datepicker-calendar-container-touch-elevation-shadow);border-radius:var(--mat-datepicker-calendar-container-touch-shape);position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}"], dependencies: [{ kind: "directive", type: CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "component", type: MatCalendar, selector: "mat-calendar", inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName"], outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection", "_userDragDrop"], exportAs: ["matCalendar"] }, { kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }, { kind: "component", type: MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", exportAs: ["matButton"] }], animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDatepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-datepicker-content', host: {
                        'class': 'mat-datepicker-content',
                        '[class]': 'color ? "mat-" + color : ""',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.start)': '_handleAnimationEvent($event)',
                        '(@transformPanel.done)': '_handleAnimationEvent($event)',
                        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    }, animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], exportAs: 'matDatepickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, standalone: true, imports: [CdkTrapFocus, MatCalendar, CdkPortalOutlet, MatButton], template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [class]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px;background-color:var(--mat-datepicker-calendar-container-background-color);color:var(--mat-datepicker-calendar-container-text-color);box-shadow:var(--mat-datepicker-calendar-container-elevation-shadow);border-radius:var(--mat-datepicker-calendar-container-shape)}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;box-shadow:var(--mat-datepicker-calendar-container-touch-elevation-shadow);border-radius:var(--mat-datepicker-calendar-container-touch-shape);position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.MatDateSelectionModel }, { type: i2.DateAdapter }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_RANGE_SELECTION_STRATEGY]
                }] }, { type: i3.MatDatepickerIntl }], propDecorators: { _calendar: [{
                type: ViewChild,
                args: [MatCalendar]
            }], color: [{
                type: Input
            }] } });
/** Base class for a datepicker. */
export class MatDatepickerBase {
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
        return (this._color || (this.datepickerInput ? this.datepickerInput.getThemePalette() : undefined));
    }
    set color(value) {
        this._color = value;
    }
    /** Whether the datepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datepickerInput
            ? this.datepickerInput.disabled
            : !!this._disabled;
    }
    set disabled(value) {
        if (value !== this._disabled) {
            this._disabled = value;
            this.stateChanges.next(undefined);
        }
    }
    /** Classes to be passed to the date picker panel. */
    get panelClass() {
        return this._panelClass;
    }
    set panelClass(value) {
        this._panelClass = coerceStringArray(value);
    }
    /** Whether the calendar is open. */
    get opened() {
        return this._opened;
    }
    set opened(value) {
        if (value) {
            this.open();
        }
        else {
            this.close();
        }
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
    constructor(_overlay, 
    /**
     * @deprecated parameter is unused and will be removed
     * @breaking-change 19.0.0
     */
    _unusedNgZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _model) {
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._model = _model;
        this._inputStateChanges = Subscription.EMPTY;
        this._document = inject(DOCUMENT);
        /** The view that the calendar should start in. */
        this.startView = 'month';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a dropdown and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
        /** Preferred position of the datepicker in the X axis. */
        this.xPosition = 'start';
        /** Preferred position of the datepicker in the Y axis. */
        this.yPosition = 'below';
        /**
         * Whether to restore focus to the previously-focused element when the calendar is closed.
         * Note that automatic focus restoration is an accessibility feature and it is recommended that
         * you provide your own equivalent, if you decide to turn it off.
         */
        this.restoreFocus = true;
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
        this._injector = inject(Injector);
        if (!this._dateAdapter && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw createMissingDateImplError('DateAdapter');
        }
        this._scrollStrategy = scrollStrategy;
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
        this._inputStateChanges = input.stateChanges.subscribe(() => this.stateChanges.next(undefined));
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
        this._componentRef?.instance._assignActions(portal, true);
    }
    /**
     * Removes a portal containing action buttons from the datepicker.
     * @param portal Portal to be removed.
     */
    removeActions(portal) {
        if (portal === this._actionsPortal) {
            this._actionsPortal = null;
            this._componentRef?.instance._assignActions(null, true);
        }
    }
    /** Open the calendar. */
    open() {
        // Skip reopening if there's an in-progress animation to avoid overlapping
        // sequences which can cause "changed after checked" errors. See #25837.
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
    /** Close the calendar. */
    close() {
        // Skip reopening if there's an in-progress animation to avoid overlapping
        // sequences which can cause "changed after checked" errors. See #25837.
        if (!this._opened || this._componentRef?.instance._isAnimating) {
            return;
        }
        const canRestoreFocus = this.restoreFocus &&
            this._focusedElementBeforeOpen &&
            typeof this._focusedElementBeforeOpen.focus === 'function';
        const completeClose = () => {
            // The `_opened` could've been reset already if
            // we got two events in quick succession.
            if (this._opened) {
                this._opened = false;
                this.closedStream.emit();
            }
        };
        if (this._componentRef) {
            const { instance, location } = this._componentRef;
            instance._startExitAnimation();
            instance._animationDone.pipe(take(1)).subscribe(() => {
                const activeElement = this._document.activeElement;
                // Since we restore focus after the exit animation, we have to check that
                // the user didn't move focus themselves inside the `close` handler.
                if (canRestoreFocus &&
                    (!activeElement ||
                        activeElement === this._document.activeElement ||
                        location.nativeElement.contains(activeElement))) {
                    this._focusedElementBeforeOpen.focus();
                }
                this._focusedElementBeforeOpen = null;
                this._destroyOverlay();
            });
        }
        if (canRestoreFocus) {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            setTimeout(completeClose);
        }
        else {
            completeClose();
        }
    }
    /** Applies the current pending selection on the overlay to the model. */
    _applyPendingSelection() {
        this._componentRef?.instance?._applyPendingSelection();
    }
    /** Forwards relevant values from the datepicker to the datepicker content inside the overlay. */
    _forwardContentValues(instance) {
        instance.datepicker = this;
        instance.color = this.color;
        instance._dialogLabelId = this.datepickerInput.getOverlayLabelId();
        instance._assignActions(this._actionsPortal, false);
    }
    /** Opens the overlay with the calendar. */
    _openOverlay() {
        this._destroyOverlay();
        const isDialog = this.touchUi;
        const portal = new ComponentPortal(MatDatepickerContent, this._viewContainerRef);
        const overlayRef = (this._overlayRef = this._overlay.create(new OverlayConfig({
            positionStrategy: isDialog ? this._getDialogStrategy() : this._getDropdownStrategy(),
            hasBackdrop: true,
            backdropClass: [
                isDialog ? 'cdk-overlay-dark-backdrop' : 'mat-overlay-transparent-backdrop',
                this._backdropHarnessClass,
            ],
            direction: this._dir,
            scrollStrategy: isDialog ? this._overlay.scrollStrategies.block() : this._scrollStrategy(),
            panelClass: `mat-datepicker-${isDialog ? 'dialog' : 'popup'}`,
        })));
        this._getCloseStream(overlayRef).subscribe(event => {
            if (event) {
                event.preventDefault();
            }
            this.close();
        });
        // The `preventDefault` call happens inside the calendar as well, however focus moves into
        // it inside a timeout which can give browsers a chance to fire off a keyboard event in-between
        // that can scroll the page (see #24969). Always block default actions of arrow keys for the
        // entire overlay so the page doesn't get scrolled by accident.
        overlayRef.keydownEvents().subscribe(event => {
            const keyCode = event.keyCode;
            if (keyCode === UP_ARROW ||
                keyCode === DOWN_ARROW ||
                keyCode === LEFT_ARROW ||
                keyCode === RIGHT_ARROW ||
                keyCode === PAGE_UP ||
                keyCode === PAGE_DOWN) {
                event.preventDefault();
            }
        });
        this._componentRef = overlayRef.attach(portal);
        this._forwardContentValues(this._componentRef.instance);
        // Update the position once the calendar has rendered. Only relevant in dropdown mode.
        if (!isDialog) {
            afterNextRender(() => {
                overlayRef.updatePosition();
            }, { injector: this._injector });
        }
    }
    /** Destroys the current overlay. */
    _destroyOverlay() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = this._componentRef = null;
        }
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDialogStrategy() {
        return this._overlay.position().global().centerHorizontally().centerVertically();
    }
    /** Gets a position strategy that will open the calendar as a dropdown. */
    _getDropdownStrategy() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this.datepickerInput.getConnectedOverlayOrigin())
            .withTransformOriginOn('.mat-datepicker-content')
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withLockedPosition();
        return this._setConnectedPositions(strategy);
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
                overlayY: primaryY,
            },
            {
                originX: primaryX,
                originY: primaryY,
                overlayX: primaryX,
                overlayY: secondaryY,
            },
            {
                originX: secondaryX,
                originY: secondaryY,
                overlayX: secondaryX,
                overlayY: primaryY,
            },
            {
                originX: secondaryX,
                originY: primaryY,
                overlayX: secondaryX,
                overlayY: secondaryY,
            },
        ]);
    }
    /** Gets an observable that will emit when the overlay is supposed to be closed. */
    _getCloseStream(overlayRef) {
        const ctrlShiftMetaModifiers = ['ctrlKey', 'shiftKey', 'metaKey'];
        return merge(overlayRef.backdropClick(), overlayRef.detachments(), overlayRef.keydownEvents().pipe(filter(event => {
            // Closing on alt + up is only valid when there's an input associated with the datepicker.
            return ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (this.datepickerInput &&
                    hasModifierKey(event, 'altKey') &&
                    event.keyCode === UP_ARROW &&
                    ctrlShiftMetaModifiers.every((modifier) => !hasModifierKey(event, modifier))));
        })));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDatepickerBase, deps: [{ token: i4.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MAT_DATEPICKER_SCROLL_STRATEGY }, { token: i2.DateAdapter, optional: true }, { token: i5.Directionality, optional: true }, { token: i1.MatDateSelectionModel }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.0", type: MatDatepickerBase, inputs: { calendarHeaderComponent: "calendarHeaderComponent", startAt: "startAt", startView: "startView", color: "color", touchUi: ["touchUi", "touchUi", booleanAttribute], disabled: ["disabled", "disabled", booleanAttribute], xPosition: "xPosition", yPosition: "yPosition", restoreFocus: ["restoreFocus", "restoreFocus", booleanAttribute], dateClass: "dateClass", panelClass: "panelClass", opened: ["opened", "opened", booleanAttribute] }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", viewChanged: "viewChanged", openedStream: "opened", closedStream: "closed" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatDatepickerBase, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i4.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DATEPICKER_SCROLL_STRATEGY]
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i5.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i1.MatDateSelectionModel }], propDecorators: { calendarHeaderComponent: [{
                type: Input
            }], startAt: [{
                type: Input
            }], startView: [{
                type: Input
            }], color: [{
                type: Input
            }], touchUi: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], yearSelected: [{
                type: Output
            }], monthSelected: [{
                type: Output
            }], viewChanged: [{
                type: Output
            }], dateClass: [{
                type: Input
            }], openedStream: [{
                type: Output,
                args: ['opened']
            }], closedStream: [{
                type: Output,
                args: ['closed']
            }], panelClass: [{
                type: Input
            }], opened: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hELE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxVQUFVLEVBRVYsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLE9BQU8sRUFDUCxhQUFhLEVBR2IsaUNBQWlDLEdBQ2xDLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQWdDLE1BQU0scUJBQXFCLENBQUM7QUFDcEcsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDakIsU0FBUyxFQUlULE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFFakUsT0FBTyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQWMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FB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QixFQUFDO2dCQU9qQixZQUFZO3NCQUE5QixNQUFNO2dCQU1ZLGFBQWE7c0JBQS9CLE1BQU07Z0JBS1ksV0FBVztzQkFBN0IsTUFBTTtnQkFLRSxTQUFTO3NCQUFqQixLQUFLO2dCQUdxQixZQUFZO3NCQUF0QyxNQUFNO3VCQUFDLFFBQVE7Z0JBR1csWUFBWTtzQkFBdEMsTUFBTTt1QkFBQyxRQUFRO2dCQUlaLFVBQVU7c0JBRGIsS0FBSztnQkFXRixNQUFNO3NCQURULEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERPV05fQVJST1csXG4gIEVTQ0FQRSxcbiAgaGFzTW9kaWZpZXJLZXksXG4gIExFRlRfQVJST1csXG4gIE1vZGlmaWVyS2V5LFxuICBQQUdFX0RPV04sXG4gIFBBR0VfVVAsXG4gIFJJR0hUX0FSUk9XLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Q2RrUG9ydGFsT3V0bGV0LCBDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBpbmplY3QsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIGFmdGVyTmV4dFJlbmRlcixcbiAgSW5qZWN0b3IsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEYXRlQWRhcHRlciwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHttZXJnZSwgU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge19nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7TWF0Q2FsZW5kYXIsIE1hdENhbGVuZGFyVmlld30gZnJvbSAnLi9jYWxlbmRhcic7XG5pbXBvcnQge21hdERhdGVwaWNrZXJBbmltYXRpb25zfSBmcm9tICcuL2RhdGVwaWNrZXItYW5pbWF0aW9ucyc7XG5pbXBvcnQge2NyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yfSBmcm9tICcuL2RhdGVwaWNrZXItZXJyb3JzJztcbmltcG9ydCB7TWF0Q2FsZW5kYXJVc2VyRXZlbnQsIE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb259IGZyb20gJy4vY2FsZW5kYXItYm9keSc7XG5pbXBvcnQge0RhdGVGaWx0ZXJGbn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0LWJhc2UnO1xuaW1wb3J0IHtcbiAgRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbixcbiAgTWF0RGF0ZVNlbGVjdGlvbk1vZGVsLFxuICBEYXRlUmFuZ2UsXG59IGZyb20gJy4vZGF0ZS1zZWxlY3Rpb24tbW9kZWwnO1xuaW1wb3J0IHtcbiAgTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZLFxuICBNYXREYXRlUmFuZ2VTZWxlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnLi9kYXRlLXJhbmdlLXNlbGVjdGlvbi1zdHJhdGVneSc7XG5pbXBvcnQge01hdERhdGVwaWNrZXJJbnRsfSBmcm9tICcuL2RhdGVwaWNrZXItaW50bCc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNYXRCdXR0b259IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XG5pbXBvcnQge0Nka1RyYXBGb2N1c30gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuXG4vKiogVXNlZCB0byBnZW5lcmF0ZSBhIHVuaXF1ZSBJRCBmb3IgZWFjaCBkYXRlcGlja2VyIGluc3RhbmNlLiAqL1xubGV0IGRhdGVwaWNrZXJVaWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtZGF0ZXBpY2tlci1zY3JvbGwtc3RyYXRlZ3knLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBpbmplY3QoT3ZlcmxheSk7XG4gICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9LFxuICB9LFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFggYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWCA9ICdzdGFydCcgfCAnZW5kJztcblxuLyoqIFBvc3NpYmxlIHBvc2l0aW9ucyBmb3IgdGhlIGRhdGVwaWNrZXIgZHJvcGRvd24gYWxvbmcgdGhlIFkgYXhpcy4gKi9cbmV4cG9ydCB0eXBlIERhdGVwaWNrZXJEcm9wZG93blBvc2l0aW9uWSA9ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKipcbiAqIENvbXBvbmVudCB1c2VkIGFzIHRoZSBjb250ZW50IGZvciB0aGUgZGF0ZXBpY2tlciBvdmVybGF5LiBXZSB1c2UgdGhpcyBpbnN0ZWFkIG9mIHVzaW5nXG4gKiBNYXRDYWxlbmRhciBkaXJlY3RseSBhcyB0aGUgY29udGVudCBzbyB3ZSBjYW4gY29udHJvbCB0aGUgaW5pdGlhbCBmb2N1cy4gVGhpcyBhbHNvIGdpdmVzIHVzIGFcbiAqIHBsYWNlIHRvIHB1dCBhZGRpdGlvbmFsIGZlYXR1cmVzIG9mIHRoZSBvdmVybGF5IHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoZSBjYWxlbmRhciBpdHNlbGYgaW4gdGhlXG4gKiBmdXR1cmUuIChlLmcuIGNvbmZpcm1hdGlvbiBidXR0b25zKS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gIHRlbXBsYXRlVXJsOiAnZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwnLFxuICBzdHlsZVVybDogJ2RhdGVwaWNrZXItY29udGVudC5jc3MnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1kYXRlcGlja2VyLWNvbnRlbnQnLFxuICAgICdbY2xhc3NdJzogJ2NvbG9yID8gXCJtYXQtXCIgKyBjb2xvciA6IFwiXCInLFxuICAgICdbQHRyYW5zZm9ybVBhbmVsXSc6ICdfYW5pbWF0aW9uU3RhdGUnLFxuICAgICcoQHRyYW5zZm9ybVBhbmVsLnN0YXJ0KSc6ICdfaGFuZGxlQW5pbWF0aW9uRXZlbnQoJGV2ZW50KScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuZG9uZSknOiAnX2hhbmRsZUFuaW1hdGlvbkV2ZW50KCRldmVudCknLFxuICAgICdbY2xhc3MubWF0LWRhdGVwaWNrZXItY29udGVudC10b3VjaF0nOiAnZGF0ZXBpY2tlci50b3VjaFVpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdERhdGVwaWNrZXJBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsLCBtYXREYXRlcGlja2VyQW5pbWF0aW9ucy5mYWRlSW5DYWxlbmRhcl0sXG4gIGV4cG9ydEFzOiAnbWF0RGF0ZXBpY2tlckNvbnRlbnQnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0Nka1RyYXBGb2N1cywgTWF0Q2FsZW5kYXIsIENka1BvcnRhbE91dGxldCwgTWF0QnV0dG9uXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJpdmF0ZSBfbW9kZWw6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPjtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgY2FsZW5kYXIgY29tcG9uZW50LiAqL1xuICBAVmlld0NoaWxkKE1hdENhbGVuZGFyKSBfY2FsZW5kYXI6IE1hdENhbGVuZGFyPEQ+O1xuXG4gIC8qKiBQYWxldHRlIGNvbG9yIG9mIHRoZSBpbnRlcm5hbCBjYWxlbmRhci4gKi9cbiAgQElucHV0KCkgY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBkYXRlcGlja2VyIHRoYXQgY3JlYXRlZCB0aGUgb3ZlcmxheS4gKi9cbiAgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlckJhc2U8YW55LCBTLCBEPjtcblxuICAvKiogU3RhcnQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25TdGFydDogRCB8IG51bGw7XG5cbiAgLyoqIEVuZCBvZiB0aGUgY29tcGFyaXNvbiByYW5nZS4gKi9cbiAgY29tcGFyaXNvbkVuZDogRCB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdFN0YXJ0RGF0ZS8+YCAqL1xuICBzdGFydERhdGVBY2Nlc3NpYmxlTmFtZTogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogQVJJQSBBY2Nlc3NpYmxlIG5hbWUgb2YgdGhlIGA8aW5wdXQgbWF0RW5kRGF0ZS8+YCAqL1xuICBlbmREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgaXMgYWJvdmUgb3IgYmVsb3cgdGhlIGlucHV0LiAqL1xuICBfaXNBYm92ZTogYm9vbGVhbjtcblxuICAvKiogQ3VycmVudCBzdGF0ZSBvZiB0aGUgYW5pbWF0aW9uLiAqL1xuICBfYW5pbWF0aW9uU3RhdGU6ICdlbnRlci1kcm9wZG93bicgfCAnZW50ZXItZGlhbG9nJyB8ICd2b2lkJztcblxuICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gaGFzIGZpbmlzaGVkLiAqL1xuICByZWFkb25seSBfYW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlcmUgaXMgYW4gaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uLiAqL1xuICBfaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuICAvKiogVGV4dCBmb3IgdGhlIGNsb3NlIGJ1dHRvbi4gKi9cbiAgX2Nsb3NlQnV0dG9uVGV4dDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjbG9zZSBidXR0b24gY3VycmVudGx5IGhhcyBmb2N1cy4gKi9cbiAgX2Nsb3NlQnV0dG9uRm9jdXNlZDogYm9vbGVhbjtcblxuICAvKiogUG9ydGFsIHdpdGggcHJvamVjdGVkIGFjdGlvbiBidXR0b25zLiAqL1xuICBfYWN0aW9uc1BvcnRhbDogVGVtcGxhdGVQb3J0YWwgfCBudWxsID0gbnVsbDtcblxuICAvKiogSWQgb2YgdGhlIGxhYmVsIGZvciB0aGUgYHJvbGU9XCJkaWFsb2dcImAgZWxlbWVudC4gKi9cbiAgX2RpYWxvZ0xhYmVsSWQ6IHN0cmluZyB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9nbG9iYWxNb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICAgIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0RBVEVfUkFOR0VfU0VMRUNUSU9OX1NUUkFURUdZKVxuICAgIHByaXZhdGUgX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3k6IE1hdERhdGVSYW5nZVNlbGVjdGlvblN0cmF0ZWd5PEQ+LFxuICAgIGludGw6IE1hdERhdGVwaWNrZXJJbnRsLFxuICApIHtcbiAgICB0aGlzLl9jbG9zZUJ1dHRvblRleHQgPSBpbnRsLmNsb3NlQ2FsZW5kYXJMYWJlbDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gdGhpcy5kYXRlcGlja2VyLnRvdWNoVWkgPyAnZW50ZXItZGlhbG9nJyA6ICdlbnRlci1kcm9wZG93bic7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICB0aGlzLmRhdGVwaWNrZXIuc3RhdGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLl9jYWxlbmRhci5mb2N1c0FjdGl2ZUNlbGwoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfaGFuZGxlVXNlclNlbGVjdGlvbihldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RCB8IG51bGw+KSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5fbW9kZWwuc2VsZWN0aW9uO1xuICAgIGNvbnN0IHZhbHVlID0gZXZlbnQudmFsdWU7XG4gICAgY29uc3QgaXNSYW5nZSA9IHNlbGVjdGlvbiBpbnN0YW5jZW9mIERhdGVSYW5nZTtcblxuICAgIC8vIElmIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlIGFuZCB3ZSBoYXZlIGEgc2VsZWN0aW9uIHN0cmF0ZWd5LCBhbHdheXMgcGFzcyB0aGUgdmFsdWUgdGhyb3VnaFxuICAgIC8vIHRoZXJlLiBPdGhlcndpc2UgZG9uJ3QgYXNzaWduIG51bGwgdmFsdWVzIHRvIHRoZSBtb2RlbCwgdW5sZXNzIHdlJ3JlIHNlbGVjdGluZyBhIHJhbmdlLlxuICAgIC8vIEEgbnVsbCB2YWx1ZSB3aGVuIHBpY2tpbmcgYSByYW5nZSBtZWFucyB0aGF0IHRoZSB1c2VyIGNhbmNlbGxlZCB0aGUgc2VsZWN0aW9uIChlLmcuIGJ5XG4gICAgLy8gcHJlc3NpbmcgZXNjYXBlKSwgd2hlcmVhcyB3aGVuIHNlbGVjdGluZyBhIHNpbmdsZSB2YWx1ZSBpdCBtZWFucyB0aGF0IHRoZSB2YWx1ZSBkaWRuJ3RcbiAgICAvLyBjaGFuZ2UuIFRoaXMgaXNuJ3QgdmVyeSBpbnR1aXRpdmUsIGJ1dCBpdCdzIGhlcmUgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICAgIGlmIChpc1JhbmdlICYmIHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIGNvbnN0IG5ld1NlbGVjdGlvbiA9IHRoaXMuX3JhbmdlU2VsZWN0aW9uU3RyYXRlZ3kuc2VsZWN0aW9uRmluaXNoZWQoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEYXRlUmFuZ2U8RD4sXG4gICAgICAgIGV2ZW50LmV2ZW50LFxuICAgICAgKTtcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihuZXdTZWxlY3Rpb24gYXMgdW5rbm93biBhcyBTLCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdmFsdWUgJiZcbiAgICAgIChpc1JhbmdlIHx8ICF0aGlzLl9kYXRlQWRhcHRlci5zYW1lRGF0ZSh2YWx1ZSwgc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCkpXG4gICAgKSB7XG4gICAgICB0aGlzLl9tb2RlbC5hZGQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIERlbGVnYXRlIGNsb3NpbmcgdGhlIG92ZXJsYXkgdG8gdGhlIGFjdGlvbnMuXG4gICAgaWYgKCghdGhpcy5fbW9kZWwgfHwgdGhpcy5fbW9kZWwuaXNDb21wbGV0ZSgpKSAmJiAhdGhpcy5fYWN0aW9uc1BvcnRhbCkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZVVzZXJEcmFnRHJvcChldmVudDogTWF0Q2FsZW5kYXJVc2VyRXZlbnQ8RGF0ZVJhbmdlPEQ+Pikge1xuICAgIHRoaXMuX21vZGVsLnVwZGF0ZVNlbGVjdGlvbihldmVudC52YWx1ZSBhcyB1bmtub3duIGFzIFMsIHRoaXMpO1xuICB9XG5cbiAgX3N0YXJ0RXhpdEFuaW1hdGlvbigpIHtcbiAgICB0aGlzLl9hbmltYXRpb25TdGF0ZSA9ICd2b2lkJztcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIF9oYW5kbGVBbmltYXRpb25FdmVudChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICB0aGlzLl9pc0FuaW1hdGluZyA9IGV2ZW50LnBoYXNlTmFtZSA9PT0gJ3N0YXJ0JztcblxuICAgIGlmICghdGhpcy5faXNBbmltYXRpbmcpIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRTZWxlY3RlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuc2VsZWN0aW9uIGFzIHVua25vd24gYXMgRCB8IERhdGVSYW5nZTxEPiB8IG51bGw7XG4gIH1cblxuICAvKiogQXBwbGllcyB0aGUgY3VycmVudCBwZW5kaW5nIHNlbGVjdGlvbiB0byB0aGUgZ2xvYmFsIG1vZGVsLiAqL1xuICBfYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCAhPT0gdGhpcy5fZ2xvYmFsTW9kZWwpIHtcbiAgICAgIHRoaXMuX2dsb2JhbE1vZGVsLnVwZGF0ZVNlbGVjdGlvbih0aGlzLl9tb2RlbC5zZWxlY3Rpb24sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ25zIGEgbmV3IHBvcnRhbCBjb250YWluaW5nIHRoZSBkYXRlcGlja2VyIGFjdGlvbnMuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHdpdGggdGhlIGFjdGlvbnMgdG8gYmUgYXNzaWduZWQuXG4gICAqIEBwYXJhbSBmb3JjZVJlcmVuZGVyIFdoZXRoZXIgYSByZS1yZW5kZXIgb2YgdGhlIHBvcnRhbCBzaG91bGQgYmUgdHJpZ2dlcmVkLiBUaGlzIGlzbid0XG4gICAqIG5lY2Vzc2FyeSBpZiB0aGUgcG9ydGFsIGlzIGFzc2lnbmVkIGR1cmluZyBpbml0aWFsaXphdGlvbiwgYnV0IGl0IG1heSBiZSByZXF1aXJlZCBpZiBpdCdzXG4gICAqIGFkZGVkIGF0IGEgbGF0ZXIgcG9pbnQuXG4gICAqL1xuICBfYXNzaWduQWN0aW9ucyhwb3J0YWw6IFRlbXBsYXRlUG9ydGFsPGFueT4gfCBudWxsLCBmb3JjZVJlcmVuZGVyOiBib29sZWFuKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhY3Rpb25zLCBjbG9uZSB0aGUgbW9kZWwgc28gdGhhdCB3ZSBoYXZlIHRoZSBhYmlsaXR5IHRvIGNhbmNlbCB0aGUgc2VsZWN0aW9uLFxuICAgIC8vIG90aGVyd2lzZSB1cGRhdGUgdGhlIGdsb2JhbCBtb2RlbCBkaXJlY3RseS4gTm90ZSB0aGF0IHdlIHdhbnQgdG8gYXNzaWduIHRoaXMgYXMgc29vbiBhc1xuICAgIC8vIHBvc3NpYmxlLCBidXQgYF9hY3Rpb25zUG9ydGFsYCBpc24ndCBhdmFpbGFibGUgaW4gdGhlIGNvbnN0cnVjdG9yIHNvIHdlIGRvIGl0IGluIGBuZ09uSW5pdGAuXG4gICAgdGhpcy5fbW9kZWwgPSBwb3J0YWwgPyB0aGlzLl9nbG9iYWxNb2RlbC5jbG9uZSgpIDogdGhpcy5fZ2xvYmFsTW9kZWw7XG4gICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IHBvcnRhbDtcblxuICAgIGlmIChmb3JjZVJlcmVuZGVyKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBGb3JtIGNvbnRyb2wgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGEgZGF0ZXBpY2tlci4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4ge1xuICBnZXRTdGFydFZhbHVlKCk6IEQgfCBudWxsO1xuICBnZXRUaGVtZVBhbGV0dGUoKTogVGhlbWVQYWxldHRlO1xuICBtaW46IEQgfCBudWxsO1xuICBtYXg6IEQgfCBudWxsO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgZGF0ZUZpbHRlcjogRGF0ZUZpbHRlckZuPEQ+O1xuICBnZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCk6IEVsZW1lbnRSZWY7XG4gIGdldE92ZXJsYXlMYWJlbElkKCk6IHN0cmluZyB8IG51bGw7XG4gIHN0YXRlQ2hhbmdlczogT2JzZXJ2YWJsZTx2b2lkPjtcbn1cblxuLyoqIEEgZGF0ZXBpY2tlciB0aGF0IGNhbiBiZSBhdHRhY2hlZCB0byBhIHtAbGluayBNYXREYXRlcGlja2VyQ29udHJvbH0uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdERhdGVwaWNrZXJQYW5lbDxcbiAgQyBleHRlbmRzIE1hdERhdGVwaWNrZXJDb250cm9sPEQ+LFxuICBTLFxuICBEID0gRXh0cmFjdERhdGVUeXBlRnJvbVNlbGVjdGlvbjxTPixcbj4ge1xuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIGRhdGUgcGlja2VyIGlzIGNsb3NlZC4gKi9cbiAgY2xvc2VkU3RyZWFtOiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIC8qKiBDb2xvciBwYWxldHRlIHRvIHVzZSBvbiB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBjb2xvcjogVGhlbWVQYWxldHRlO1xuICAvKiogVGhlIGlucHV0IGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgaXMgYXNzb2NpYXRlZCB3aXRoLiAqL1xuICBkYXRlcGlja2VySW5wdXQ6IEM7XG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcC11cCBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVkOiBib29sZWFuO1xuICAvKiogVGhlIGlkIGZvciB0aGUgZGF0ZXBpY2tlcidzIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nO1xuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBpcyBvcGVuLiAqL1xuICBvcGVuZWQ6IGJvb2xlYW47XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0ZSBwaWNrZXIgaXMgb3BlbmVkLiAqL1xuICBvcGVuZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIncyBzdGF0ZSBjaGFuZ2VzLiAqL1xuICBzdGF0ZUNoYW5nZXM6IFN1YmplY3Q8dm9pZD47XG4gIC8qKiBPcGVucyB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgb3BlbigpOiB2b2lkO1xuICAvKiogUmVnaXN0ZXIgYW4gaW5wdXQgd2l0aCB0aGUgZGF0ZXBpY2tlci4gKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGEgZGF0ZXBpY2tlci4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdERhdGVwaWNrZXJCYXNlPFxuICAgIEMgZXh0ZW5kcyBNYXREYXRlcGlja2VyQ29udHJvbDxEPixcbiAgICBTLFxuICAgIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+LFxuICA+XG4gIGltcGxlbWVudHMgTWF0RGF0ZXBpY2tlclBhbmVsPEMsIFMsIEQ+LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlc1xue1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2lucHV0U3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cbiAgLyoqIEFuIGlucHV0IGluZGljYXRpbmcgdGhlIHR5cGUgb2YgdGhlIGN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGZvciB0aGUgY2FsZW5kYXIsIGlmIHNldC4gKi9cbiAgQElucHV0KCkgY2FsZW5kYXJIZWFkZXJDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8YW55PjtcblxuICAvKiogVGhlIGRhdGUgdG8gb3BlbiB0aGUgY2FsZW5kYXIgdG8gaW5pdGlhbGx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gZXhwbGljaXQgc3RhcnRBdCBpcyBzZXQgd2Ugc3RhcnQgdGhlcmUsIG90aGVyd2lzZSB3ZSBzdGFydCBhdCB3aGF0ZXZlciB0aGUgY3VycmVudGx5XG4gICAgLy8gc2VsZWN0ZWQgdmFsdWUgaXMuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0QXQgfHwgKHRoaXMuZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9jb2xvciB8fCAodGhpcy5kYXRlcGlja2VySW5wdXQgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRUaGVtZVBhbGV0dGUoKSA6IHVuZGVmaW5lZClcbiAgICApO1xuICB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBkcm9wZG93biBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICB0b3VjaFVpOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wLXVwIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXRcbiAgICAgID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZGlzYWJsZWRcbiAgICAgIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2Rpc2FibGVkKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBYIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHhQb3NpdGlvbjogRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25YID0gJ3N0YXJ0JztcblxuICAvKiogUHJlZmVycmVkIHBvc2l0aW9uIG9mIHRoZSBkYXRlcGlja2VyIGluIHRoZSBZIGF4aXMuICovXG4gIEBJbnB1dCgpXG4gIHlQb3NpdGlvbjogRGF0ZXBpY2tlckRyb3Bkb3duUG9zaXRpb25ZID0gJ2JlbG93JztcblxuICAvKipcbiAgICogV2hldGhlciB0byByZXN0b3JlIGZvY3VzIHRvIHRoZSBwcmV2aW91c2x5LWZvY3VzZWQgZWxlbWVudCB3aGVuIHRoZSBjYWxlbmRhciBpcyBjbG9zZWQuXG4gICAqIE5vdGUgdGhhdCBhdXRvbWF0aWMgZm9jdXMgcmVzdG9yYXRpb24gaXMgYW4gYWNjZXNzaWJpbGl0eSBmZWF0dXJlIGFuZCBpdCBpcyByZWNvbW1lbmRlZCB0aGF0XG4gICAqIHlvdSBwcm92aWRlIHlvdXIgb3duIGVxdWl2YWxlbnQsIGlmIHlvdSBkZWNpZGUgdG8gdHVybiBpdCBvZmYuXG4gICAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIHJlc3RvcmVGb2N1czogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHNlbGVjdGVkIHllYXIgaW4gbXVsdGl5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbW9udGhTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50IHZpZXcgY2hhbmdlcy5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4oXG4gICAgdHJ1ZSxcbiAgKTtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgY3VzdG9tIENTUyBjbGFzc2VzIHRvIGRhdGVzLiAqL1xuICBASW5wdXQoKSBkYXRlQ2xhc3M6IE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb248RD47XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKSByZWFkb25seSBvcGVuZWRTdHJlYW0gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKSByZWFkb25seSBjbG9zZWRTdHJlYW0gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBkYXRlIHBpY2tlciBwYW5lbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhbmVsQ2xhc3MoKTogc3RyaW5nIHwgc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbENsYXNzO1xuICB9XG4gIHNldCBwYW5lbENsYXNzKHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3BhbmVsQ2xhc3MgPSBjb2VyY2VTdHJpbmdBcnJheSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFuZWxDbGFzczogc3RyaW5nW107XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNhbGVuZGFyIGlzIG9wZW4uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IG9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3BlbmVkO1xuICB9XG4gIHNldCBvcGVuZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1kYXRlcGlja2VyLSR7ZGF0ZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dC5taW47XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1heDtcbiAgfVxuXG4gIF9nZXREYXRlRmlsdGVyKCk6IERhdGVGaWx0ZXJGbjxEPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgaW50byB3aGljaCB3ZSd2ZSByZW5kZXJlZCB0aGUgY2FsZW5kYXIuICovXG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBpbnN0YW5jZSByZW5kZXJlZCBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+IHwgbnVsbDtcblxuICAvKiogVGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRhdGVwaWNrZXIgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmlxdWUgY2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBiYWNrZHJvcCBzbyB0aGF0IHRoZSB0ZXN0IGhhcm5lc3NlcyBjYW4gbG9vayBpdCB1cC4gKi9cbiAgcHJpdmF0ZSBfYmFja2Ryb3BIYXJuZXNzQ2xhc3MgPSBgJHt0aGlzLmlkfS1iYWNrZHJvcGA7XG5cbiAgLyoqIEN1cnJlbnRseS1yZWdpc3RlcmVkIGFjdGlvbnMgcG9ydGFsLiAqL1xuICBwcml2YXRlIF9hY3Rpb25zUG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGw7XG5cbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoaXMgZGF0ZXBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIGRhdGVwaWNrZXJJbnB1dDogQztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlcidzIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgcGFyYW1ldGVyIGlzIHVudXNlZCBhbmQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxOS4wLjBcbiAgICAgKi9cbiAgICBfdW51c2VkTmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8RD4sXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+LFxuICApIHtcbiAgICBpZiAoIXRoaXMuX2RhdGVBZGFwdGVyICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcignRGF0ZUFkYXB0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHBvc2l0aW9uQ2hhbmdlID0gY2hhbmdlc1sneFBvc2l0aW9uJ10gfHwgY2hhbmdlc1sneVBvc2l0aW9uJ107XG5cbiAgICBpZiAocG9zaXRpb25DaGFuZ2UgJiYgIXBvc2l0aW9uQ2hhbmdlLmZpcnN0Q2hhbmdlICYmIHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uU3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5UmVmLmdldENvbmZpZygpLnBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgICAgIGlmIChwb3NpdGlvblN0cmF0ZWd5IGluc3RhbmNlb2YgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgICAgIHRoaXMuX3NldENvbm5lY3RlZFBvc2l0aW9ucyhwb3NpdGlvblN0cmF0ZWd5KTtcblxuICAgICAgICBpZiAodGhpcy5vcGVuZWQpIHtcbiAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95T3ZlcmxheSgpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogU2VsZWN0cyB0aGUgZ2l2ZW4gZGF0ZSAqL1xuICBzZWxlY3QoZGF0ZTogRCk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsLmFkZChkYXRlKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgc2VsZWN0ZWQgeWVhciBpbiBtdWx0aXllYXIgdmlldyAqL1xuICBfc2VsZWN0WWVhcihub3JtYWxpemVkWWVhcjogRCk6IHZvaWQge1xuICAgIHRoaXMueWVhclNlbGVjdGVkLmVtaXQobm9ybWFsaXplZFllYXIpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHNlbGVjdGVkIG1vbnRoIGluIHllYXIgdmlldyAqL1xuICBfc2VsZWN0TW9udGgobm9ybWFsaXplZE1vbnRoOiBEKTogdm9pZCB7XG4gICAgdGhpcy5tb250aFNlbGVjdGVkLmVtaXQobm9ybWFsaXplZE1vbnRoKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2VkIHZpZXcgKi9cbiAgX3ZpZXdDaGFuZ2VkKHZpZXc6IE1hdENhbGVuZGFyVmlldyk6IHZvaWQge1xuICAgIHRoaXMudmlld0NoYW5nZWQuZW1pdCh2aWV3KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoaXMgZGF0ZXBpY2tlci5cbiAgICogQHBhcmFtIGlucHV0IFRoZSBkYXRlcGlja2VyIGlucHV0IHRvIHJlZ2lzdGVyIHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcmV0dXJucyBTZWxlY3Rpb24gbW9kZWwgdGhhdCB0aGUgaW5wdXQgc2hvdWxkIGhvb2sgaXRzZWxmIHVwIHRvLlxuICAgKi9cbiAgcmVnaXN0ZXJJbnB1dChpbnB1dDogQyk6IE1hdERhdGVTZWxlY3Rpb25Nb2RlbDxTLCBEPiB7XG4gICAgaWYgKHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRhdGVwaWNrZXJJbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzID0gaW5wdXQuc3RhdGVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCkpO1xuICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBwb3J0YWwgY29udGFpbmluZyBhY3Rpb24gYnV0dG9ucyB3aXRoIHRoZSBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgcmVnaXN0ZXJBY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYWN0aW9uc1BvcnRhbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0EgTWF0RGF0ZXBpY2tlciBjYW4gb25seSBiZSBhc3NvY2lhdGVkIHdpdGggYSBzaW5nbGUgYWN0aW9ucyByb3cuJyk7XG4gICAgfVxuICAgIHRoaXMuX2FjdGlvbnNQb3J0YWwgPSBwb3J0YWw7XG4gICAgdGhpcy5fY29tcG9uZW50UmVmPy5pbnN0YW5jZS5fYXNzaWduQWN0aW9ucyhwb3J0YWwsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3J0YWwgY29udGFpbmluZyBhY3Rpb24gYnV0dG9ucyBmcm9tIHRoZSBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gcG9ydGFsIFBvcnRhbCB0byBiZSByZW1vdmVkLlxuICAgKi9cbiAgcmVtb3ZlQWN0aW9ucyhwb3J0YWw6IFRlbXBsYXRlUG9ydGFsKTogdm9pZCB7XG4gICAgaWYgKHBvcnRhbCA9PT0gdGhpcy5fYWN0aW9uc1BvcnRhbCkge1xuICAgICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IG51bGw7XG4gICAgICB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlLl9hc3NpZ25BY3Rpb25zKG51bGwsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBPcGVuIHRoZSBjYWxlbmRhci4gKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICAvLyBTa2lwIHJlb3BlbmluZyBpZiB0aGVyZSdzIGFuIGluLXByb2dyZXNzIGFuaW1hdGlvbiB0byBhdm9pZCBvdmVybGFwcGluZ1xuICAgIC8vIHNlcXVlbmNlcyB3aGljaCBjYW4gY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuIFNlZSAjMjU4MzcuXG4gICAgaWYgKHRoaXMuX29wZW5lZCB8fCB0aGlzLmRpc2FibGVkIHx8IHRoaXMuX2NvbXBvbmVudFJlZj8uaW5zdGFuY2UuX2lzQW5pbWF0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0F0dGVtcHRlZCB0byBvcGVuIGFuIE1hdERhdGVwaWNrZXIgd2l0aCBubyBhc3NvY2lhdGVkIGlucHV0LicpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiA9IF9nZXRGb2N1c2VkRWxlbWVudFBpZXJjZVNoYWRvd0RvbSgpO1xuICAgIHRoaXMuX29wZW5PdmVybGF5KCk7XG4gICAgdGhpcy5fb3BlbmVkID0gdHJ1ZTtcbiAgICB0aGlzLm9wZW5lZFN0cmVhbS5lbWl0KCk7XG4gIH1cblxuICAvKiogQ2xvc2UgdGhlIGNhbGVuZGFyLiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICAvLyBTa2lwIHJlb3BlbmluZyBpZiB0aGVyZSdzIGFuIGluLXByb2dyZXNzIGFuaW1hdGlvbiB0byBhdm9pZCBvdmVybGFwcGluZ1xuICAgIC8vIHNlcXVlbmNlcyB3aGljaCBjYW4gY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuIFNlZSAjMjU4MzcuXG4gICAgaWYgKCF0aGlzLl9vcGVuZWQgfHwgdGhpcy5fY29tcG9uZW50UmVmPy5pbnN0YW5jZS5faXNBbmltYXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjYW5SZXN0b3JlRm9jdXMgPVxuICAgICAgdGhpcy5yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkU3RyZWFtLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2NvbXBvbmVudFJlZikge1xuICAgICAgY29uc3Qge2luc3RhbmNlLCBsb2NhdGlvbn0gPSB0aGlzLl9jb21wb25lbnRSZWY7XG4gICAgICBpbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgICBpbnN0YW5jZS5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIC8vIFNpbmNlIHdlIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgdGhlIGV4aXQgYW5pbWF0aW9uLCB3ZSBoYXZlIHRvIGNoZWNrIHRoYXRcbiAgICAgICAgLy8gdGhlIHVzZXIgZGlkbid0IG1vdmUgZm9jdXMgdGhlbXNlbHZlcyBpbnNpZGUgdGhlIGBjbG9zZWAgaGFuZGxlci5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNhblJlc3RvcmVGb2N1cyAmJlxuICAgICAgICAgICghYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgbG9jYXRpb24ubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuIS5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjYW5SZXN0b3JlRm9jdXMpIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgc2V0VGltZW91dChjb21wbGV0ZUNsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHRoZSBjdXJyZW50IHBlbmRpbmcgc2VsZWN0aW9uIG9uIHRoZSBvdmVybGF5IHRvIHRoZSBtb2RlbC4gKi9cbiAgX2FwcGx5UGVuZGluZ1NlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlPy5fYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCk7XG4gIH1cblxuICAvKiogRm9yd2FyZHMgcmVsZXZhbnQgdmFsdWVzIGZyb20gdGhlIGRhdGVwaWNrZXIgdG8gdGhlIGRhdGVwaWNrZXIgY29udGVudCBpbnNpZGUgdGhlIG92ZXJsYXkuICovXG4gIHByb3RlY3RlZCBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+KSB7XG4gICAgaW5zdGFuY2UuZGF0ZXBpY2tlciA9IHRoaXM7XG4gICAgaW5zdGFuY2UuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgIGluc3RhbmNlLl9kaWFsb2dMYWJlbElkID0gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0T3ZlcmxheUxhYmVsSWQoKTtcbiAgICBpbnN0YW5jZS5fYXNzaWduQWN0aW9ucyh0aGlzLl9hY3Rpb25zUG9ydGFsLCBmYWxzZSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG92ZXJsYXkgd2l0aCB0aGUgY2FsZW5kYXIuICovXG4gIHByaXZhdGUgX29wZW5PdmVybGF5KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBjb25zdCBpc0RpYWxvZyA9IHRoaXMudG91Y2hVaTtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihcbiAgICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICApO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSAodGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKFxuICAgICAgbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBpc0RpYWxvZyA/IHRoaXMuX2dldERpYWxvZ1N0cmF0ZWd5KCkgOiB0aGlzLl9nZXREcm9wZG93blN0cmF0ZWd5KCksXG4gICAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgICBiYWNrZHJvcENsYXNzOiBbXG4gICAgICAgICAgaXNEaWFsb2cgPyAnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCcgOiAnbWF0LW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICAgICAgICAgIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzLFxuICAgICAgICBdLFxuICAgICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IGlzRGlhbG9nID8gdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCkgOiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICBwYW5lbENsYXNzOiBgbWF0LWRhdGVwaWNrZXItJHtpc0RpYWxvZyA/ICdkaWFsb2cnIDogJ3BvcHVwJ31gLFxuICAgICAgfSksXG4gICAgKSk7XG5cbiAgICB0aGlzLl9nZXRDbG9zZVN0cmVhbShvdmVybGF5UmVmKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgYHByZXZlbnREZWZhdWx0YCBjYWxsIGhhcHBlbnMgaW5zaWRlIHRoZSBjYWxlbmRhciBhcyB3ZWxsLCBob3dldmVyIGZvY3VzIG1vdmVzIGludG9cbiAgICAvLyBpdCBpbnNpZGUgYSB0aW1lb3V0IHdoaWNoIGNhbiBnaXZlIGJyb3dzZXJzIGEgY2hhbmNlIHRvIGZpcmUgb2ZmIGEga2V5Ym9hcmQgZXZlbnQgaW4tYmV0d2VlblxuICAgIC8vIHRoYXQgY2FuIHNjcm9sbCB0aGUgcGFnZSAoc2VlICMyNDk2OSkuIEFsd2F5cyBibG9jayBkZWZhdWx0IGFjdGlvbnMgb2YgYXJyb3cga2V5cyBmb3IgdGhlXG4gICAgLy8gZW50aXJlIG92ZXJsYXkgc28gdGhlIHBhZ2UgZG9lc24ndCBnZXQgc2Nyb2xsZWQgYnkgYWNjaWRlbnQuXG4gICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGtleUNvZGUgPT09IFVQX0FSUk9XIHx8XG4gICAgICAgIGtleUNvZGUgPT09IERPV05fQVJST1cgfHxcbiAgICAgICAga2V5Q29kZSA9PT0gTEVGVF9BUlJPVyB8fFxuICAgICAgICBrZXlDb2RlID09PSBSSUdIVF9BUlJPVyB8fFxuICAgICAgICBrZXlDb2RlID09PSBQQUdFX1VQIHx8XG4gICAgICAgIGtleUNvZGUgPT09IFBBR0VfRE9XTlxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBvdmVybGF5UmVmLmF0dGFjaChwb3J0YWwpO1xuICAgIHRoaXMuX2ZvcndhcmRDb250ZW50VmFsdWVzKHRoaXMuX2NvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9uY2UgdGhlIGNhbGVuZGFyIGhhcyByZW5kZXJlZC4gT25seSByZWxldmFudCBpbiBkcm9wZG93biBtb2RlLlxuICAgIGlmICghaXNEaWFsb2cpIHtcbiAgICAgIGFmdGVyTmV4dFJlbmRlcihcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAge2luamVjdG9yOiB0aGlzLl9pbmplY3Rvcn0sXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgY3VycmVudCBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9kZXN0cm95T3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fY29tcG9uZW50UmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyBhIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgd2lsbCBvcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRyb3Bkb3duLiAqL1xuICBwcml2YXRlIF9nZXREaWFsb2dTdHJhdGVneSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmNlbnRlclZlcnRpY2FsbHkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERyb3Bkb3duU3RyYXRlZ3koKSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQnKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb2YgdGhlIGRhdGVwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLiAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IHdpbGwgZW1pdCB3aGVuIHRoZSBvdmVybGF5IGlzIHN1cHBvc2VkIHRvIGJlIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2xvc2VTdHJlYW0ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIGNvbnN0IGN0cmxTaGlmdE1ldGFNb2RpZmllcnM6IE1vZGlmaWVyS2V5W10gPSBbJ2N0cmxLZXknLCAnc2hpZnRLZXknLCAnbWV0YUtleSddO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLFxuICAgICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBDbG9zaW5nIG9uIGFsdCArIHVwIGlzIG9ubHkgdmFsaWQgd2hlbiB0aGVyZSdzIGFuIGlucHV0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZXBpY2tlci5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgICAgICAgKHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmXG4gICAgICAgICAgICAgIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykgJiZcbiAgICAgICAgICAgICAgZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cgJiZcbiAgICAgICAgICAgICAgY3RybFNoaWZ0TWV0YU1vZGlmaWVycy5ldmVyeShcbiAgICAgICAgICAgICAgICAobW9kaWZpZXI6IE1vZGlmaWVyS2V5KSA9PiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQsIG1vZGlmaWVyKSxcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdlxuICBjZGtUcmFwRm9jdXNcbiAgcm9sZT1cImRpYWxvZ1wiXG4gIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiXG4gIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZGlhbG9nTGFiZWxJZCA/PyB1bmRlZmluZWRcIlxuICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyXCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtY3VzdG9tLWhlYWRlcl09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtYWN0aW9uc109XCJfYWN0aW9uc1BvcnRhbFwiPlxuICA8bWF0LWNhbGVuZGFyXG4gICAgW2lkXT1cImRhdGVwaWNrZXIuaWRcIlxuICAgIFtjbGFzc109XCJkYXRlcGlja2VyLnBhbmVsQ2xhc3NcIlxuICAgIFtzdGFydEF0XT1cImRhdGVwaWNrZXIuc3RhcnRBdFwiXG4gICAgW3N0YXJ0Vmlld109XCJkYXRlcGlja2VyLnN0YXJ0Vmlld1wiXG4gICAgW21pbkRhdGVdPVwiZGF0ZXBpY2tlci5fZ2V0TWluRGF0ZSgpXCJcbiAgICBbbWF4RGF0ZV09XCJkYXRlcGlja2VyLl9nZXRNYXhEYXRlKClcIlxuICAgIFtkYXRlRmlsdGVyXT1cImRhdGVwaWNrZXIuX2dldERhdGVGaWx0ZXIoKVwiXG4gICAgW2hlYWRlckNvbXBvbmVudF09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgICBbc2VsZWN0ZWRdPVwiX2dldFNlbGVjdGVkKClcIlxuICAgIFtkYXRlQ2xhc3NdPVwiZGF0ZXBpY2tlci5kYXRlQ2xhc3NcIlxuICAgIFtjb21wYXJpc29uU3RhcnRdPVwiY29tcGFyaXNvblN0YXJ0XCJcbiAgICBbY29tcGFyaXNvbkVuZF09XCJjb21wYXJpc29uRW5kXCJcbiAgICBbQGZhZGVJbkNhbGVuZGFyXT1cIidlbnRlcidcIlxuICAgIFtzdGFydERhdGVBY2Nlc3NpYmxlTmFtZV09XCJzdGFydERhdGVBY2Nlc3NpYmxlTmFtZVwiXG4gICAgW2VuZERhdGVBY2Nlc3NpYmxlTmFtZV09XCJlbmREYXRlQWNjZXNzaWJsZU5hbWVcIlxuICAgICh5ZWFyU2VsZWN0ZWQpPVwiZGF0ZXBpY2tlci5fc2VsZWN0WWVhcigkZXZlbnQpXCJcbiAgICAobW9udGhTZWxlY3RlZCk9XCJkYXRlcGlja2VyLl9zZWxlY3RNb250aCgkZXZlbnQpXCJcbiAgICAodmlld0NoYW5nZWQpPVwiZGF0ZXBpY2tlci5fdmlld0NoYW5nZWQoJGV2ZW50KVwiXG4gICAgKF91c2VyU2VsZWN0aW9uKT1cIl9oYW5kbGVVc2VyU2VsZWN0aW9uKCRldmVudClcIlxuICAgIChfdXNlckRyYWdEcm9wKT1cIl9oYW5kbGVVc2VyRHJhZ0Ryb3AoJGV2ZW50KVwiPjwvbWF0LWNhbGVuZGFyPlxuXG4gIDxuZy10ZW1wbGF0ZSBbY2RrUG9ydGFsT3V0bGV0XT1cIl9hY3Rpb25zUG9ydGFsXCI+PC9uZy10ZW1wbGF0ZT5cblxuICA8IS0tIEludmlzaWJsZSBjbG9zZSBidXR0b24gZm9yIHNjcmVlbiByZWFkZXIgdXNlcnMuIC0tPlxuICA8YnV0dG9uXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgbWF0LXJhaXNlZC1idXR0b25cbiAgICBbY29sb3JdPVwiY29sb3IgfHwgJ3ByaW1hcnknXCJcbiAgICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNsb3NlLWJ1dHRvblwiXG4gICAgW2NsYXNzLmNkay12aXN1YWxseS1oaWRkZW5dPVwiIV9jbG9zZUJ1dHRvbkZvY3VzZWRcIlxuICAgIChmb2N1cyk9XCJfY2xvc2VCdXR0b25Gb2N1c2VkID0gdHJ1ZVwiXG4gICAgKGJsdXIpPVwiX2Nsb3NlQnV0dG9uRm9jdXNlZCA9IGZhbHNlXCJcbiAgICAoY2xpY2spPVwiZGF0ZXBpY2tlci5jbG9zZSgpXCI+e3sgX2Nsb3NlQnV0dG9uVGV4dCB9fTwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=