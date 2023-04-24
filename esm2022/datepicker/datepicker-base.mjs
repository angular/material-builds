/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { DOWN_ARROW, ESCAPE, hasModifierKey, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW, } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, FlexibleConnectedPositionStrategy, } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation, ChangeDetectorRef, Directive, inject, } from '@angular/core';
import { DateAdapter, mixinColor } from '@angular/material/core';
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
import * as i0 from "@angular/core";
import * as i1 from "./date-selection-model";
import * as i2 from "@angular/material/core";
import * as i3 from "./datepicker-intl";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/cdk/a11y";
import * as i7 from "@angular/cdk/portal";
import * as i8 from "./calendar";
import * as i9 from "@angular/cdk/overlay";
import * as i10 from "@angular/cdk/bidi";
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
const _MatDatepickerContentBase = mixinColor(class {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
});
/**
 * Component used as the content for the datepicker overlay. We use this instead of using
 * MatCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the overlay that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-private
 */
class MatDatepickerContent extends _MatDatepickerContentBase {
    constructor(elementRef, _changeDetectorRef, _globalModel, _dateAdapter, _rangeSelectionStrategy, intl) {
        super(elementRef);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatDatepickerContent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.MatDateSelectionModel }, { token: i2.DateAdapter }, { token: MAT_DATE_RANGE_SELECTION_STRATEGY, optional: true }, { token: i3.MatDatepickerIntl }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatDatepickerContent, selector: "mat-datepicker-content", inputs: { color: "color" }, host: { listeners: { "@transformPanel.start": "_handleAnimationEvent($event)", "@transformPanel.done": "_handleAnimationEvent($event)" }, properties: { "@transformPanel": "_animationState", "class.mat-datepicker-content-touch": "datepicker.touchUi" }, classAttribute: "mat-datepicker-content" }, viewQueries: [{ propertyName: "_calendar", first: true, predicate: MatCalendar, descendants: true }], exportAs: ["matDatepickerContent"], usesInheritance: true, ngImport: i0, template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}"], dependencies: [{ kind: "directive", type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i5.MatButton, selector: "    button[mat-button], button[mat-raised-button], button[mat-flat-button],    button[mat-stroked-button]  ", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "directive", type: i6.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i7.CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }, { kind: "component", type: i8.MatCalendar, selector: "mat-calendar", inputs: ["headerComponent", "startAt", "startView", "selected", "minDate", "maxDate", "dateFilter", "dateClass", "comparisonStart", "comparisonEnd", "startDateAccessibleName", "endDateAccessibleName"], outputs: ["selectedChange", "yearSelected", "monthSelected", "viewChanged", "_userSelection", "_userDragDrop"], exportAs: ["matCalendar"] }], animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatDatepickerContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatDatepickerContent, decorators: [{
            type: Component,
            args: [{ selector: 'mat-datepicker-content', host: {
                        'class': 'mat-datepicker-content',
                        '[@transformPanel]': '_animationState',
                        '(@transformPanel.start)': '_handleAnimationEvent($event)',
                        '(@transformPanel.done)': '_handleAnimationEvent($event)',
                        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    }, animations: [matDatepickerAnimations.transformPanel, matDatepickerAnimations.fadeInCalendar], exportAs: 'matDatepickerContent', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, inputs: ['color'], template: "<div\n  cdkTrapFocus\n  role=\"dialog\"\n  [attr.aria-modal]=\"true\"\n  [attr.aria-labelledby]=\"_dialogLabelId ?? undefined\"\n  class=\"mat-datepicker-content-container\"\n  [class.mat-datepicker-content-container-with-custom-header]=\"datepicker.calendarHeaderComponent\"\n  [class.mat-datepicker-content-container-with-actions]=\"_actionsPortal\">\n  <mat-calendar\n    [id]=\"datepicker.id\"\n    [ngClass]=\"datepicker.panelClass\"\n    [startAt]=\"datepicker.startAt\"\n    [startView]=\"datepicker.startView\"\n    [minDate]=\"datepicker._getMinDate()\"\n    [maxDate]=\"datepicker._getMaxDate()\"\n    [dateFilter]=\"datepicker._getDateFilter()\"\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\n    [selected]=\"_getSelected()\"\n    [dateClass]=\"datepicker.dateClass\"\n    [comparisonStart]=\"comparisonStart\"\n    [comparisonEnd]=\"comparisonEnd\"\n    [@fadeInCalendar]=\"'enter'\"\n    [startDateAccessibleName]=\"startDateAccessibleName\"\n    [endDateAccessibleName]=\"endDateAccessibleName\"\n    (yearSelected)=\"datepicker._selectYear($event)\"\n    (monthSelected)=\"datepicker._selectMonth($event)\"\n    (viewChanged)=\"datepicker._viewChanged($event)\"\n    (_userSelection)=\"_handleUserSelection($event)\"\n    (_userDragDrop)=\"_handleUserDragDrop($event)\"></mat-calendar>\n\n  <ng-template [cdkPortalOutlet]=\"_actionsPortal\"></ng-template>\n\n  <!-- Invisible close button for screen reader users. -->\n  <button\n    type=\"button\"\n    mat-raised-button\n    [color]=\"color || 'primary'\"\n    class=\"mat-datepicker-close-button\"\n    [class.cdk-visually-hidden]=\"!_closeButtonFocused\"\n    (focus)=\"_closeButtonFocused = true\"\n    (blur)=\"_closeButtonFocused = false\"\n    (click)=\"datepicker.close()\">{{ _closeButtonText }}</button>\n</div>\n", styles: [".mat-datepicker-content{display:block;border-radius:4px}.mat-datepicker-content .mat-calendar{width:296px;height:354px}.mat-datepicker-content .mat-datepicker-content-container-with-custom-header .mat-calendar{height:auto}.mat-datepicker-content .mat-datepicker-close-button{position:absolute;top:100%;left:0;margin-top:8px}.ng-animating .mat-datepicker-content .mat-datepicker-close-button{display:none}.mat-datepicker-content-container{display:flex;flex-direction:column;justify-content:space-between}.mat-datepicker-content-touch{display:block;max-height:80vh;position:relative;overflow:visible}.mat-datepicker-content-touch .mat-datepicker-content-container{min-height:312px;max-height:788px;min-width:250px;max-width:750px}.mat-datepicker-content-touch .mat-calendar{width:100%;height:auto}@media all and (orientation: landscape){.mat-datepicker-content-touch .mat-datepicker-content-container{width:64vh;height:80vh}}@media all and (orientation: portrait){.mat-datepicker-content-touch .mat-datepicker-content-container{width:80vw;height:100vw}.mat-datepicker-content-touch .mat-datepicker-content-container-with-actions{height:115vw}}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.MatDateSelectionModel }, { type: i2.DateAdapter }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_DATE_RANGE_SELECTION_STRATEGY]
                }] }, { type: i3.MatDatepickerIntl }]; }, propDecorators: { _calendar: [{
                type: ViewChild,
                args: [MatCalendar]
            }] } });
/** Base class for a datepicker. */
class MatDatepickerBase {
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
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a dropdown and elements have more padding to allow for bigger touch targets.
     */
    get touchUi() {
        return this._touchUi;
    }
    set touchUi(value) {
        this._touchUi = coerceBooleanProperty(value);
    }
    /** Whether the datepicker pop-up should be disabled. */
    get disabled() {
        return this._disabled === undefined && this.datepickerInput
            ? this.datepickerInput.disabled
            : !!this._disabled;
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
    get restoreFocus() {
        return this._restoreFocus;
    }
    set restoreFocus(value) {
        this._restoreFocus = coerceBooleanProperty(value);
    }
    /**
     * Classes to be passed to the date picker panel.
     * Supports string and string array values, similar to `ngClass`.
     */
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
    constructor(_overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _model) {
        this._overlay = _overlay;
        this._ngZone = _ngZone;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        this._model = _model;
        this._inputStateChanges = Subscription.EMPTY;
        this._document = inject(DOCUMENT);
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
        const canRestoreFocus = this._restoreFocus &&
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
            this._ngZone.onStable.pipe(take(1)).subscribe(() => overlayRef.updatePosition());
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatDatepickerBase, deps: [{ token: i9.Overlay }, { token: i0.NgZone }, { token: i0.ViewContainerRef }, { token: MAT_DATEPICKER_SCROLL_STRATEGY }, { token: i2.DateAdapter, optional: true }, { token: i10.Directionality, optional: true }, { token: i1.MatDateSelectionModel }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatDatepickerBase, inputs: { calendarHeaderComponent: "calendarHeaderComponent", startAt: "startAt", startView: "startView", color: "color", touchUi: "touchUi", disabled: "disabled", xPosition: "xPosition", yPosition: "yPosition", restoreFocus: "restoreFocus", dateClass: "dateClass", panelClass: "panelClass", opened: "opened" }, outputs: { yearSelected: "yearSelected", monthSelected: "monthSelected", viewChanged: "viewChanged", openedStream: "opened", closedStream: "closed" }, usesOnChanges: true, ngImport: i0 }); }
}
export { MatDatepickerBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatDatepickerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i9.Overlay }, { type: i0.NgZone }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DATEPICKER_SCROLL_STRATEGY]
                }] }, { type: i2.DateAdapter, decorators: [{
                    type: Optional
                }] }, { type: i10.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i1.MatDateSelectionModel }]; }, propDecorators: { calendarHeaderComponent: [{
                type: Input
            }], startAt: [{
                type: Input
            }], startView: [{
                type: Input
            }], color: [{
                type: Input
            }], touchUi: [{
                type: Input
            }], disabled: [{
                type: Input
            }], xPosition: [{
                type: Input
            }], yPosition: [{
                type: Input
            }], restoreFocus: [{
                type: Input
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
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1iYXNlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1jb250ZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdGLE9BQU8sRUFDTCxVQUFVLEVBQ1YsTUFBTSxFQUNOLGNBQWMsRUFDZCxVQUFVLEVBRVYsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEVBQ1gsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLE9BQU8sRUFDUCxhQUFhLEVBR2IsaUNBQWlDLEdBQ2xDLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBZ0MsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRixPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGlCQUFpQixFQUNqQixTQUFTLEVBSVQsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBVyxXQUFXLEVBQUUsVUFBVSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFFdkYsT0FBTyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQWMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBQyxNQUFNLEVB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YyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7b0JBQy9CLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUTtvQkFDMUIsc0JBQXNCLENBQUMsS0FBSyxDQUMxQixDQUFDLFFBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FDNUQsQ0FBQyxDQUNMLENBQUM7UUFDSixDQUFDLENBQUMsQ0FDSCxDQUNGLENBQUM7SUFDSixDQUFDO21IQTNmbUIsaUJBQWlCLCtGQXlMM0IsOEJBQThCO3VHQXpMcEIsaUJBQWlCOztTQUFqQixpQkFBaUI7Z0dBQWpCLGlCQUFpQjtrQkFEdEMsU0FBUzs7MEJBMExMLE1BQU07MkJBQUMsOEJBQThCOzswQkFDckMsUUFBUTs7MEJBQ1IsUUFBUTtnRkFoTEYsdUJBQXVCO3NCQUEvQixLQUFLO2dCQUlGLE9BQU87c0JBRFYsS0FBSztnQkFZRyxTQUFTO3NCQUFqQixLQUFLO2dCQUlGLEtBQUs7c0JBRFIsS0FBSztnQkFnQkYsT0FBTztzQkFEVixLQUFLO2dCQVdGLFFBQVE7c0JBRFgsS0FBSztnQkFrQk4sU0FBUztzQkFEUixLQUFLO2dCQUtOLFNBQVM7c0JBRFIsS0FBSztnQkFTRixZQUFZO3NCQURmLEtBQUs7Z0JBYWEsWUFBWTtzQkFBOUIsTUFBTTtnQkFNWSxhQUFhO3NCQUEvQixNQUFNO2dCQUtZLFdBQVc7c0JBQTdCLE1BQU07Z0JBS0UsU0FBUztzQkFBakIsS0FBSztnQkFHcUIsWUFBWTtzQkFBdEMsTUFBTTt1QkFBQyxRQUFRO2dCQUdXLFlBQVk7c0JBQXRDLE1BQU07dUJBQUMsUUFBUTtnQkFPWixVQUFVO3NCQURiLEtBQUs7Z0JBV0YsTUFBTTtzQkFEVCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZVN0cmluZ0FycmF5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRE9XTl9BUlJPVyxcbiAgRVNDQVBFLFxuICBoYXNNb2RpZmllcktleSxcbiAgTEVGVF9BUlJPVyxcbiAgTW9kaWZpZXJLZXksXG4gIFBBR0VfRE9XTixcbiAgUEFHRV9VUCxcbiAgUklHSFRfQVJST1csXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb21wb25lbnRQb3J0YWwsIENvbXBvbmVudFR5cGUsIFRlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgRGF0ZUFkYXB0ZXIsIG1peGluQ29sb3IsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7bWVyZ2UsIFN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtfZ2V0Rm9jdXNlZEVsZW1lbnRQaWVyY2VTaGFkb3dEb219IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge01hdENhbGVuZGFyLCBNYXRDYWxlbmRhclZpZXd9IGZyb20gJy4vY2FsZW5kYXInO1xuaW1wb3J0IHttYXREYXRlcGlja2VyQW5pbWF0aW9uc30gZnJvbSAnLi9kYXRlcGlja2VyLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtjcmVhdGVNaXNzaW5nRGF0ZUltcGxFcnJvcn0gZnJvbSAnLi9kYXRlcGlja2VyLWVycm9ycyc7XG5pbXBvcnQge01hdENhbGVuZGFyVXNlckV2ZW50LCBNYXRDYWxlbmRhckNlbGxDbGFzc0Z1bmN0aW9ufSBmcm9tICcuL2NhbGVuZGFyLWJvZHknO1xuaW1wb3J0IHtEYXRlRmlsdGVyRm59IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1iYXNlJztcbmltcG9ydCB7XG4gIEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb24sXG4gIE1hdERhdGVTZWxlY3Rpb25Nb2RlbCxcbiAgRGF0ZVJhbmdlLFxufSBmcm9tICcuL2RhdGUtc2VsZWN0aW9uLW1vZGVsJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFX1JBTkdFX1NFTEVDVElPTl9TVFJBVEVHWSxcbiAgTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJy4vZGF0ZS1yYW5nZS1zZWxlY3Rpb24tc3RyYXRlZ3knO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW50bH0gZnJvbSAnLi9kYXRlcGlja2VyLWludGwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqIFVzZWQgdG8gZ2VuZXJhdGUgYSB1bmlxdWUgSUQgZm9yIGVhY2ggZGF0ZXBpY2tlciBpbnN0YW5jZS4gKi9cbmxldCBkYXRlcGlja2VyVWlkID0gMDtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgY2FsZW5kYXIgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LWRhdGVwaWNrZXItc2Nyb2xsLXN0cmF0ZWd5Jyxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBYIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnIHwgJ2VuZCc7XG5cbi8qKiBQb3NzaWJsZSBwb3NpdGlvbnMgZm9yIHRoZSBkYXRlcGlja2VyIGRyb3Bkb3duIGFsb25nIHRoZSBZIGF4aXMuICovXG5leHBvcnQgdHlwZSBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYWJvdmUnIHwgJ2JlbG93JztcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfREFURVBJQ0tFUl9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9EQVRFUElDS0VSX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXREYXRlcGlja2VyQ29udGVudC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0RGF0ZXBpY2tlckNvbnRlbnRCYXNlID0gbWl4aW5Db2xvcihcbiAgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbiAgfSxcbik7XG5cbi8qKlxuICogQ29tcG9uZW50IHVzZWQgYXMgdGhlIGNvbnRlbnQgZm9yIHRoZSBkYXRlcGlja2VyIG92ZXJsYXkuIFdlIHVzZSB0aGlzIGluc3RlYWQgb2YgdXNpbmdcbiAqIE1hdENhbGVuZGFyIGRpcmVjdGx5IGFzIHRoZSBjb250ZW50IHNvIHdlIGNhbiBjb250cm9sIHRoZSBpbml0aWFsIGZvY3VzLiBUaGlzIGFsc28gZ2l2ZXMgdXMgYVxuICogcGxhY2UgdG8gcHV0IGFkZGl0aW9uYWwgZmVhdHVyZXMgb2YgdGhlIG92ZXJsYXkgdGhhdCBhcmUgbm90IHBhcnQgb2YgdGhlIGNhbGVuZGFyIGl0c2VsZiBpbiB0aGVcbiAqIGZ1dHVyZS4gKGUuZy4gY29uZmlybWF0aW9uIGJ1dHRvbnMpLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZGF0ZXBpY2tlci1jb250ZW50JyxcbiAgdGVtcGxhdGVVcmw6ICdkYXRlcGlja2VyLWNvbnRlbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydkYXRlcGlja2VyLWNvbnRlbnQuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWRhdGVwaWNrZXItY29udGVudCcsXG4gICAgJ1tAdHJhbnNmb3JtUGFuZWxdJzogJ19hbmltYXRpb25TdGF0ZScsXG4gICAgJyhAdHJhbnNmb3JtUGFuZWwuc3RhcnQpJzogJ19oYW5kbGVBbmltYXRpb25FdmVudCgkZXZlbnQpJyxcbiAgICAnKEB0cmFuc2Zvcm1QYW5lbC5kb25lKSc6ICdfaGFuZGxlQW5pbWF0aW9uRXZlbnQoJGV2ZW50KScsXG4gICAgJ1tjbGFzcy5tYXQtZGF0ZXBpY2tlci1jb250ZW50LXRvdWNoXSc6ICdkYXRlcGlja2VyLnRvdWNoVWknLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0RGF0ZXBpY2tlckFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWwsIG1hdERhdGVwaWNrZXJBbmltYXRpb25zLmZhZGVJbkNhbGVuZGFyXSxcbiAgZXhwb3J0QXM6ICdtYXREYXRlcGlja2VyQ29udGVudCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4+XG4gIGV4dGVuZHMgX01hdERhdGVwaWNrZXJDb250ZW50QmFzZVxuICBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBDYW5Db2xvclxue1xuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcml2YXRlIF9tb2RlbDogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+O1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBjYWxlbmRhciBjb21wb25lbnQuICovXG4gIEBWaWV3Q2hpbGQoTWF0Q2FsZW5kYXIpIF9jYWxlbmRhcjogTWF0Q2FsZW5kYXI8RD47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgZGF0ZXBpY2tlciB0aGF0IGNyZWF0ZWQgdGhlIG92ZXJsYXkuICovXG4gIGRhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXJCYXNlPGFueSwgUywgRD47XG5cbiAgLyoqIFN0YXJ0IG9mIHRoZSBjb21wYXJpc29uIHJhbmdlLiAqL1xuICBjb21wYXJpc29uU3RhcnQ6IEQgfCBudWxsO1xuXG4gIC8qKiBFbmQgb2YgdGhlIGNvbXBhcmlzb24gcmFuZ2UuICovXG4gIGNvbXBhcmlzb25FbmQ6IEQgfCBudWxsO1xuXG4gIC8qKiBBUklBIEFjY2Vzc2libGUgbmFtZSBvZiB0aGUgYDxpbnB1dCBtYXRTdGFydERhdGUvPmAgKi9cbiAgc3RhcnREYXRlQWNjZXNzaWJsZU5hbWU6IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIEFSSUEgQWNjZXNzaWJsZSBuYW1lIG9mIHRoZSBgPGlucHV0IG1hdEVuZERhdGUvPmAgKi9cbiAgZW5kRGF0ZUFjY2Vzc2libGVOYW1lOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlzIGFib3ZlIG9yIGJlbG93IHRoZSBpbnB1dC4gKi9cbiAgX2lzQWJvdmU6IGJvb2xlYW47XG5cbiAgLyoqIEN1cnJlbnQgc3RhdGUgb2YgdGhlIGFuaW1hdGlvbi4gKi9cbiAgX2FuaW1hdGlvblN0YXRlOiAnZW50ZXItZHJvcGRvd24nIHwgJ2VudGVyLWRpYWxvZycgfCAndm9pZCc7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gKi9cbiAgcmVhZG9ubHkgX2FuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGFuIGluLXByb2dyZXNzIGFuaW1hdGlvbi4gKi9cbiAgX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgLyoqIFRleHQgZm9yIHRoZSBjbG9zZSBidXR0b24uICovXG4gIF9jbG9zZUJ1dHRvblRleHQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY2xvc2UgYnV0dG9uIGN1cnJlbnRseSBoYXMgZm9jdXMuICovXG4gIF9jbG9zZUJ1dHRvbkZvY3VzZWQ6IGJvb2xlYW47XG5cbiAgLyoqIFBvcnRhbCB3aXRoIHByb2plY3RlZCBhY3Rpb24gYnV0dG9ucy4gKi9cbiAgX2FjdGlvbnNQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIElkIG9mIHRoZSBsYWJlbCBmb3IgdGhlIGByb2xlPVwiZGlhbG9nXCJgIGVsZW1lbnQuICovXG4gIF9kaWFsb2dMYWJlbElkOiBzdHJpbmcgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2dsb2JhbE1vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4sXG4gICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPEQ+LFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfREFURV9SQU5HRV9TRUxFQ1RJT05fU1RSQVRFR1kpXG4gICAgcHJpdmF0ZSBfcmFuZ2VTZWxlY3Rpb25TdHJhdGVneTogTWF0RGF0ZVJhbmdlU2VsZWN0aW9uU3RyYXRlZ3k8RD4sXG4gICAgaW50bDogTWF0RGF0ZXBpY2tlckludGwsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuICAgIHRoaXMuX2Nsb3NlQnV0dG9uVGV4dCA9IGludGwuY2xvc2VDYWxlbmRhckxhYmVsO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fYW5pbWF0aW9uU3RhdGUgPSB0aGlzLmRhdGVwaWNrZXIudG91Y2hVaSA/ICdlbnRlci1kaWFsb2cnIDogJ2VudGVyLWRyb3Bkb3duJztcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuX2NhbGVuZGFyLmZvY3VzQWN0aXZlQ2VsbCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9oYW5kbGVVc2VyU2VsZWN0aW9uKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxEIHwgbnVsbD4pIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLl9tb2RlbC5zZWxlY3Rpb247XG4gICAgY29uc3QgdmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICBjb25zdCBpc1JhbmdlID0gc2VsZWN0aW9uIGluc3RhbmNlb2YgRGF0ZVJhbmdlO1xuXG4gICAgLy8gSWYgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UgYW5kIHdlIGhhdmUgYSBzZWxlY3Rpb24gc3RyYXRlZ3ksIGFsd2F5cyBwYXNzIHRoZSB2YWx1ZSB0aHJvdWdoXG4gICAgLy8gdGhlcmUuIE90aGVyd2lzZSBkb24ndCBhc3NpZ24gbnVsbCB2YWx1ZXMgdG8gdGhlIG1vZGVsLCB1bmxlc3Mgd2UncmUgc2VsZWN0aW5nIGEgcmFuZ2UuXG4gICAgLy8gQSBudWxsIHZhbHVlIHdoZW4gcGlja2luZyBhIHJhbmdlIG1lYW5zIHRoYXQgdGhlIHVzZXIgY2FuY2VsbGVkIHRoZSBzZWxlY3Rpb24gKGUuZy4gYnlcbiAgICAvLyBwcmVzc2luZyBlc2NhcGUpLCB3aGVyZWFzIHdoZW4gc2VsZWN0aW5nIGEgc2luZ2xlIHZhbHVlIGl0IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGRpZG4ndFxuICAgIC8vIGNoYW5nZS4gVGhpcyBpc24ndCB2ZXJ5IGludHVpdGl2ZSwgYnV0IGl0J3MgaGVyZSBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkuXG4gICAgaWYgKGlzUmFuZ2UgJiYgdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneSkge1xuICAgICAgY29uc3QgbmV3U2VsZWN0aW9uID0gdGhpcy5fcmFuZ2VTZWxlY3Rpb25TdHJhdGVneS5zZWxlY3Rpb25GaW5pc2hlZChcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHNlbGVjdGlvbiBhcyB1bmtub3duIGFzIERhdGVSYW5nZTxEPixcbiAgICAgICAgZXZlbnQuZXZlbnQsXG4gICAgICApO1xuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKG5ld1NlbGVjdGlvbiBhcyB1bmtub3duIGFzIFMsIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICB2YWx1ZSAmJlxuICAgICAgKGlzUmFuZ2UgfHwgIXRoaXMuX2RhdGVBZGFwdGVyLnNhbWVEYXRlKHZhbHVlLCBzZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX21vZGVsLmFkZCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgLy8gRGVsZWdhdGUgY2xvc2luZyB0aGUgb3ZlcmxheSB0byB0aGUgYWN0aW9ucy5cbiAgICBpZiAoKCF0aGlzLl9tb2RlbCB8fCB0aGlzLl9tb2RlbC5pc0NvbXBsZXRlKCkpICYmICF0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlVXNlckRyYWdEcm9wKGV2ZW50OiBNYXRDYWxlbmRhclVzZXJFdmVudDxEYXRlUmFuZ2U8RD4+KSB7XG4gICAgdGhpcy5fbW9kZWwudXBkYXRlU2VsZWN0aW9uKGV2ZW50LnZhbHVlIGFzIHVua25vd24gYXMgUywgdGhpcyk7XG4gIH1cblxuICBfc3RhcnRFeGl0QW5pbWF0aW9uKCkge1xuICAgIHRoaXMuX2FuaW1hdGlvblN0YXRlID0gJ3ZvaWQnO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgX2hhbmRsZUFuaW1hdGlvbkV2ZW50KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgIHRoaXMuX2lzQW5pbWF0aW5nID0gZXZlbnQucGhhc2VOYW1lID09PSAnc3RhcnQnO1xuXG4gICAgaWYgKCF0aGlzLl9pc0FuaW1hdGluZykge1xuICAgICAgdGhpcy5fYW5pbWF0aW9uRG9uZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgX2dldFNlbGVjdGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RlbC5zZWxlY3Rpb24gYXMgdW5rbm93biBhcyBEIHwgRGF0ZVJhbmdlPEQ+IHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHRoZSBjdXJyZW50IHBlbmRpbmcgc2VsZWN0aW9uIHRvIHRoZSBnbG9iYWwgbW9kZWwuICovXG4gIF9hcHBseVBlbmRpbmdTZWxlY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsICE9PSB0aGlzLl9nbG9iYWxNb2RlbCkge1xuICAgICAgdGhpcy5fZ2xvYmFsTW9kZWwudXBkYXRlU2VsZWN0aW9uKHRoaXMuX21vZGVsLnNlbGVjdGlvbiwgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2lnbnMgYSBuZXcgcG9ydGFsIGNvbnRhaW5pbmcgdGhlIGRhdGVwaWNrZXIgYWN0aW9ucy5cbiAgICogQHBhcmFtIHBvcnRhbCBQb3J0YWwgd2l0aCB0aGUgYWN0aW9ucyB0byBiZSBhc3NpZ25lZC5cbiAgICogQHBhcmFtIGZvcmNlUmVyZW5kZXIgV2hldGhlciBhIHJlLXJlbmRlciBvZiB0aGUgcG9ydGFsIHNob3VsZCBiZSB0cmlnZ2VyZWQuIFRoaXMgaXNuJ3RcbiAgICogbmVjZXNzYXJ5IGlmIHRoZSBwb3J0YWwgaXMgYXNzaWduZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLCBidXQgaXQgbWF5IGJlIHJlcXVpcmVkIGlmIGl0J3NcbiAgICogYWRkZWQgYXQgYSBsYXRlciBwb2ludC5cbiAgICovXG4gIF9hc3NpZ25BY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWw8YW55PiB8IG51bGwsIGZvcmNlUmVyZW5kZXI6IGJvb2xlYW4pIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGFjdGlvbnMsIGNsb25lIHRoZSBtb2RlbCBzbyB0aGF0IHdlIGhhdmUgdGhlIGFiaWxpdHkgdG8gY2FuY2VsIHRoZSBzZWxlY3Rpb24sXG4gICAgLy8gb3RoZXJ3aXNlIHVwZGF0ZSB0aGUgZ2xvYmFsIG1vZGVsIGRpcmVjdGx5LiBOb3RlIHRoYXQgd2Ugd2FudCB0byBhc3NpZ24gdGhpcyBhcyBzb29uIGFzXG4gICAgLy8gcG9zc2libGUsIGJ1dCBgX2FjdGlvbnNQb3J0YWxgIGlzbid0IGF2YWlsYWJsZSBpbiB0aGUgY29uc3RydWN0b3Igc28gd2UgZG8gaXQgaW4gYG5nT25Jbml0YC5cbiAgICB0aGlzLl9tb2RlbCA9IHBvcnRhbCA/IHRoaXMuX2dsb2JhbE1vZGVsLmNsb25lKCkgOiB0aGlzLl9nbG9iYWxNb2RlbDtcbiAgICB0aGlzLl9hY3Rpb25zUG9ydGFsID0gcG9ydGFsO1xuXG4gICAgaWYgKGZvcmNlUmVyZW5kZXIpIHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEZvcm0gY29udHJvbCB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHdpdGggYSBkYXRlcGlja2VyLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXREYXRlcGlja2VyQ29udHJvbDxEPiB7XG4gIGdldFN0YXJ0VmFsdWUoKTogRCB8IG51bGw7XG4gIGdldFRoZW1lUGFsZXR0ZSgpOiBUaGVtZVBhbGV0dGU7XG4gIG1pbjogRCB8IG51bGw7XG4gIG1heDogRCB8IG51bGw7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBkYXRlRmlsdGVyOiBEYXRlRmlsdGVyRm48RD47XG4gIGdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKTogRWxlbWVudFJlZjtcbiAgZ2V0T3ZlcmxheUxhYmVsSWQoKTogc3RyaW5nIHwgbnVsbDtcbiAgc3RhdGVDaGFuZ2VzOiBPYnNlcnZhYmxlPHZvaWQ+O1xufVxuXG4vKiogQSBkYXRlcGlja2VyIHRoYXQgY2FuIGJlIGF0dGFjaGVkIHRvIGEge0BsaW5rIE1hdERhdGVwaWNrZXJDb250cm9sfS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RGF0ZXBpY2tlclBhbmVsPFxuICBDIGV4dGVuZHMgTWF0RGF0ZXBpY2tlckNvbnRyb2w8RD4sXG4gIFMsXG4gIEQgPSBFeHRyYWN0RGF0ZVR5cGVGcm9tU2VsZWN0aW9uPFM+LFxuPiB7XG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0ZSBwaWNrZXIgaXMgY2xvc2VkLiAqL1xuICBjbG9zZWRTdHJlYW06IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG4gIC8qKiBUaGUgaW5wdXQgZWxlbWVudCB0aGUgZGF0ZXBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIGRhdGVwaWNrZXJJbnB1dDogQztcbiAgLyoqIFdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wLXVwIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIGlkOiBzdHJpbmc7XG4gIC8qKiBXaGV0aGVyIHRoZSBkYXRlcGlja2VyIGlzIG9wZW4uICovXG4gIG9wZW5lZDogYm9vbGVhbjtcbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBkYXRlIHBpY2tlciBpcyBvcGVuZWQuICovXG4gIG9wZW5lZFN0cmVhbTogRXZlbnRFbWl0dGVyPHZvaWQ+O1xuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlcidzIHN0YXRlIGNoYW5nZXMuICovXG4gIHN0YXRlQ2hhbmdlczogU3ViamVjdDx2b2lkPjtcbiAgLyoqIE9wZW5zIHRoZSBkYXRlcGlja2VyLiAqL1xuICBvcGVuKCk6IHZvaWQ7XG4gIC8qKiBSZWdpc3RlciBhbiBpbnB1dCB3aXRoIHRoZSBkYXRlcGlja2VyLiAqL1xuICByZWdpc3RlcklucHV0KGlucHV0OiBDKTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+O1xufVxuXG4vKiogQmFzZSBjbGFzcyBmb3IgYSBkYXRlcGlja2VyLiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0RGF0ZXBpY2tlckJhc2U8XG4gIEMgZXh0ZW5kcyBNYXREYXRlcGlja2VyQ29udHJvbDxEPixcbiAgUyxcbiAgRCA9IEV4dHJhY3REYXRlVHlwZUZyb21TZWxlY3Rpb248Uz4sXG4+IGltcGxlbWVudHMgTWF0RGF0ZXBpY2tlclBhbmVsPEMsIFMsIEQ+LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlc1xue1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2lucHV0U3RhdGVDaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cbiAgLyoqIEFuIGlucHV0IGluZGljYXRpbmcgdGhlIHR5cGUgb2YgdGhlIGN1c3RvbSBoZWFkZXIgY29tcG9uZW50IGZvciB0aGUgY2FsZW5kYXIsIGlmIHNldC4gKi9cbiAgQElucHV0KCkgY2FsZW5kYXJIZWFkZXJDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8YW55PjtcblxuICAvKiogVGhlIGRhdGUgdG8gb3BlbiB0aGUgY2FsZW5kYXIgdG8gaW5pdGlhbGx5LiAqL1xuICBASW5wdXQoKVxuICBnZXQgc3RhcnRBdCgpOiBEIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gZXhwbGljaXQgc3RhcnRBdCBpcyBzZXQgd2Ugc3RhcnQgdGhlcmUsIG90aGVyd2lzZSB3ZSBzdGFydCBhdCB3aGF0ZXZlciB0aGUgY3VycmVudGx5XG4gICAgLy8gc2VsZWN0ZWQgdmFsdWUgaXMuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0QXQgfHwgKHRoaXMuZGF0ZXBpY2tlcklucHV0ID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0U3RhcnRWYWx1ZSgpIDogbnVsbCk7XG4gIH1cbiAgc2V0IHN0YXJ0QXQodmFsdWU6IEQgfCBudWxsKSB7XG4gICAgdGhpcy5fc3RhcnRBdCA9IHRoaXMuX2RhdGVBZGFwdGVyLmdldFZhbGlkRGF0ZU9yTnVsbCh0aGlzLl9kYXRlQWRhcHRlci5kZXNlcmlhbGl6ZSh2YWx1ZSkpO1xuICB9XG4gIHByaXZhdGUgX3N0YXJ0QXQ6IEQgfCBudWxsO1xuXG4gIC8qKiBUaGUgdmlldyB0aGF0IHRoZSBjYWxlbmRhciBzaG91bGQgc3RhcnQgaW4uICovXG4gIEBJbnB1dCgpIHN0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyB8ICdtdWx0aS15ZWFyJyA9ICdtb250aCc7XG5cbiAgLyoqIENvbG9yIHBhbGV0dGUgdG8gdXNlIG9uIHRoZSBkYXRlcGlja2VyJ3MgY2FsZW5kYXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9jb2xvciB8fCAodGhpcy5kYXRlcGlja2VySW5wdXQgPyB0aGlzLmRhdGVwaWNrZXJJbnB1dC5nZXRUaGVtZVBhbGV0dGUoKSA6IHVuZGVmaW5lZClcbiAgICApO1xuICB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2FsZW5kYXIgVUkgaXMgaW4gdG91Y2ggbW9kZS4gSW4gdG91Y2ggbW9kZSB0aGUgY2FsZW5kYXIgb3BlbnMgaW4gYSBkaWFsb2cgcmF0aGVyXG4gICAqIHRoYW4gYSBkcm9wZG93biBhbmQgZWxlbWVudHMgaGF2ZSBtb3JlIHBhZGRpbmcgdG8gYWxsb3cgZm9yIGJpZ2dlciB0b3VjaCB0YXJnZXRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvdWNoVWkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdWNoVWk7XG4gIH1cbiAgc2V0IHRvdWNoVWkodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3RvdWNoVWkgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3RvdWNoVWkgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3AtdXAgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkID09PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRlcGlja2VySW5wdXRcbiAgICAgID8gdGhpcy5kYXRlcGlja2VySW5wdXQuZGlzYWJsZWRcbiAgICAgIDogISF0aGlzLl9kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFggYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeFBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblggPSAnc3RhcnQnO1xuXG4gIC8qKiBQcmVmZXJyZWQgcG9zaXRpb24gb2YgdGhlIGRhdGVwaWNrZXIgaW4gdGhlIFkgYXhpcy4gKi9cbiAgQElucHV0KClcbiAgeVBvc2l0aW9uOiBEYXRlcGlja2VyRHJvcGRvd25Qb3NpdGlvblkgPSAnYmVsb3cnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJlc3RvcmUgZm9jdXMgdG8gdGhlIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50IHdoZW4gdGhlIGNhbGVuZGFyIGlzIGNsb3NlZC5cbiAgICogTm90ZSB0aGF0IGF1dG9tYXRpYyBmb2N1cyByZXN0b3JhdGlvbiBpcyBhbiBhY2Nlc3NpYmlsaXR5IGZlYXR1cmUgYW5kIGl0IGlzIHJlY29tbWVuZGVkIHRoYXRcbiAgICogeW91IHByb3ZpZGUgeW91ciBvd24gZXF1aXZhbGVudCwgaWYgeW91IGRlY2lkZSB0byB0dXJuIGl0IG9mZi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXN0b3JlRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc3RvcmVGb2N1cztcbiAgfVxuICBzZXQgcmVzdG9yZUZvY3VzKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9yZXN0b3JlRm9jdXMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEVtaXRzIHNlbGVjdGVkIHllYXIgaW4gbXVsdGl5ZWFyIHZpZXcuXG4gICAqIFRoaXMgZG9lc24ndCBpbXBseSBhIGNoYW5nZSBvbiB0aGUgc2VsZWN0ZWQgZGF0ZS5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB5ZWFyU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxEPiA9IG5ldyBFdmVudEVtaXR0ZXI8RD4oKTtcblxuICAvKipcbiAgICogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3LlxuICAgKiBUaGlzIGRvZXNuJ3QgaW1wbHkgYSBjaGFuZ2Ugb24gdGhlIHNlbGVjdGVkIGRhdGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbW9udGhTZWxlY3RlZDogRXZlbnRFbWl0dGVyPEQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEPigpO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB3aGVuIHRoZSBjdXJyZW50IHZpZXcgY2hhbmdlcy5cbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2aWV3Q2hhbmdlZDogRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4gPSBuZXcgRXZlbnRFbWl0dGVyPE1hdENhbGVuZGFyVmlldz4oXG4gICAgdHJ1ZSxcbiAgKTtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBhZGQgY3VzdG9tIENTUyBjbGFzc2VzIHRvIGRhdGVzLiAqL1xuICBASW5wdXQoKSBkYXRlQ2xhc3M6IE1hdENhbGVuZGFyQ2VsbENsYXNzRnVuY3Rpb248RD47XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKSByZWFkb25seSBvcGVuZWRTdHJlYW0gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGRhdGVwaWNrZXIgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKSByZWFkb25seSBjbG9zZWRTdHJlYW0gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBkYXRlIHBpY2tlciBwYW5lbC5cbiAgICogU3VwcG9ydHMgc3RyaW5nIGFuZCBzdHJpbmcgYXJyYXkgdmFsdWVzLCBzaW1pbGFyIHRvIGBuZ0NsYXNzYC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYW5lbENsYXNzKCk6IHN0cmluZyB8IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxDbGFzcztcbiAgfVxuICBzZXQgcGFuZWxDbGFzcyh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICB0aGlzLl9wYW5lbENsYXNzID0gY29lcmNlU3RyaW5nQXJyYXkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3BhbmVsQ2xhc3M6IHN0cmluZ1tdO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBpcyBvcGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgb3BlbmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vcGVuZWQ7XG4gIH1cbiAgc2V0IG9wZW5lZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKSA/IHRoaXMub3BlbigpIDogdGhpcy5jbG9zZSgpO1xuICB9XG4gIHByaXZhdGUgX29wZW5lZCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgaWQgZm9yIHRoZSBkYXRlcGlja2VyIGNhbGVuZGFyLiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1kYXRlcGlja2VyLSR7ZGF0ZXBpY2tlclVpZCsrfWA7XG5cbiAgLyoqIFRoZSBtaW5pbXVtIHNlbGVjdGFibGUgZGF0ZS4gKi9cbiAgX2dldE1pbkRhdGUoKTogRCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmRhdGVwaWNrZXJJbnB1dCAmJiB0aGlzLmRhdGVwaWNrZXJJbnB1dC5taW47XG4gIH1cblxuICAvKiogVGhlIG1heGltdW0gc2VsZWN0YWJsZSBkYXRlLiAqL1xuICBfZ2V0TWF4RGF0ZSgpOiBEIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1heDtcbiAgfVxuXG4gIF9nZXREYXRlRmlsdGVyKCk6IERhdGVGaWx0ZXJGbjxEPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmIHRoaXMuZGF0ZXBpY2tlcklucHV0LmRhdGVGaWx0ZXI7XG4gIH1cblxuICAvKiogQSByZWZlcmVuY2UgdG8gdGhlIG92ZXJsYXkgaW50byB3aGljaCB3ZSd2ZSByZW5kZXJlZCB0aGUgY2FsZW5kYXIuICovXG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGNvbXBvbmVudCBpbnN0YW5jZSByZW5kZXJlZCBpbiB0aGUgb3ZlcmxheS4gKi9cbiAgcHJpdmF0ZSBfY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8TWF0RGF0ZXBpY2tlckNvbnRlbnQ8UywgRD4+IHwgbnVsbDtcblxuICAvKiogVGhlIGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCBiZWZvcmUgdGhlIGRhdGVwaWNrZXIgd2FzIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBVbmlxdWUgY2xhc3MgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBiYWNrZHJvcCBzbyB0aGF0IHRoZSB0ZXN0IGhhcm5lc3NlcyBjYW4gbG9vayBpdCB1cC4gKi9cbiAgcHJpdmF0ZSBfYmFja2Ryb3BIYXJuZXNzQ2xhc3MgPSBgJHt0aGlzLmlkfS1iYWNrZHJvcGA7XG5cbiAgLyoqIEN1cnJlbnRseS1yZWdpc3RlcmVkIGFjdGlvbnMgcG9ydGFsLiAqL1xuICBwcml2YXRlIF9hY3Rpb25zUG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCB8IG51bGw7XG5cbiAgLyoqIFRoZSBpbnB1dCBlbGVtZW50IHRoaXMgZGF0ZXBpY2tlciBpcyBhc3NvY2lhdGVkIHdpdGguICovXG4gIGRhdGVwaWNrZXJJbnB1dDogQztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgZGF0ZXBpY2tlcidzIHN0YXRlIGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoTUFUX0RBVEVQSUNLRVJfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxEPixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX21vZGVsOiBNYXREYXRlU2VsZWN0aW9uTW9kZWw8UywgRD4sXG4gICkge1xuICAgIGlmICghdGhpcy5fZGF0ZUFkYXB0ZXIgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGNyZWF0ZU1pc3NpbmdEYXRlSW1wbEVycm9yKCdEYXRlQWRhcHRlcicpO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgcG9zaXRpb25DaGFuZ2UgPSBjaGFuZ2VzWyd4UG9zaXRpb24nXSB8fCBjaGFuZ2VzWyd5UG9zaXRpb24nXTtcblxuICAgIGlmIChwb3NpdGlvbkNoYW5nZSAmJiAhcG9zaXRpb25DaGFuZ2UuZmlyc3RDaGFuZ2UgJiYgdGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgY29uc3QgcG9zaXRpb25TdHJhdGVneSA9IHRoaXMuX292ZXJsYXlSZWYuZ2V0Q29uZmlnKCkucG9zaXRpb25TdHJhdGVneTtcblxuICAgICAgaWYgKHBvc2l0aW9uU3RyYXRlZ3kgaW5zdGFuY2VvZiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgICAgdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wZW5lZCkge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX2lucHV0U3RhdGVDaGFuZ2VzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBnaXZlbiBkYXRlICovXG4gIHNlbGVjdChkYXRlOiBEKTogdm9pZCB7XG4gICAgdGhpcy5fbW9kZWwuYWRkKGRhdGUpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBzZWxlY3RlZCB5ZWFyIGluIG11bHRpeWVhciB2aWV3ICovXG4gIF9zZWxlY3RZZWFyKG5vcm1hbGl6ZWRZZWFyOiBEKTogdm9pZCB7XG4gICAgdGhpcy55ZWFyU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkWWVhcik7XG4gIH1cblxuICAvKiogRW1pdHMgc2VsZWN0ZWQgbW9udGggaW4geWVhciB2aWV3ICovXG4gIF9zZWxlY3RNb250aChub3JtYWxpemVkTW9udGg6IEQpOiB2b2lkIHtcbiAgICB0aGlzLm1vbnRoU2VsZWN0ZWQuZW1pdChub3JtYWxpemVkTW9udGgpO1xuICB9XG5cbiAgLyoqIEVtaXRzIGNoYW5nZWQgdmlldyAqL1xuICBfdmlld0NoYW5nZWQodmlldzogTWF0Q2FsZW5kYXJWaWV3KTogdm9pZCB7XG4gICAgdGhpcy52aWV3Q2hhbmdlZC5lbWl0KHZpZXcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFuIGlucHV0IHdpdGggdGhpcyBkYXRlcGlja2VyLlxuICAgKiBAcGFyYW0gaW5wdXQgVGhlIGRhdGVwaWNrZXIgaW5wdXQgdG8gcmVnaXN0ZXIgd2l0aCB0aGlzIGRhdGVwaWNrZXIuXG4gICAqIEByZXR1cm5zIFNlbGVjdGlvbiBtb2RlbCB0aGF0IHRoZSBpbnB1dCBzaG91bGQgaG9vayBpdHNlbGYgdXAgdG8uXG4gICAqL1xuICByZWdpc3RlcklucHV0KGlucHV0OiBDKTogTWF0RGF0ZVNlbGVjdGlvbk1vZGVsPFMsIEQ+IHtcbiAgICBpZiAodGhpcy5kYXRlcGlja2VySW5wdXQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBIE1hdERhdGVwaWNrZXIgY2FuIG9ubHkgYmUgYXNzb2NpYXRlZCB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cbiAgICB0aGlzLl9pbnB1dFN0YXRlQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZGF0ZXBpY2tlcklucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5faW5wdXRTdGF0ZUNoYW5nZXMgPSBpbnB1dC5zdGF0ZUNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQodW5kZWZpbmVkKSk7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIHBvcnRhbCBjb250YWluaW5nIGFjdGlvbiBidXR0b25zIHdpdGggdGhlIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICByZWdpc3RlckFjdGlvbnMocG9ydGFsOiBUZW1wbGF0ZVBvcnRhbCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hY3Rpb25zUG9ydGFsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQSBNYXREYXRlcGlja2VyIGNhbiBvbmx5IGJlIGFzc29jaWF0ZWQgd2l0aCBhIHNpbmdsZSBhY3Rpb25zIHJvdy4nKTtcbiAgICB9XG4gICAgdGhpcy5fYWN0aW9uc1BvcnRhbCA9IHBvcnRhbDtcbiAgICB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlLl9hc3NpZ25BY3Rpb25zKHBvcnRhbCwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHBvcnRhbCBjb250YWluaW5nIGFjdGlvbiBidXR0b25zIGZyb20gdGhlIGRhdGVwaWNrZXIuXG4gICAqIEBwYXJhbSBwb3J0YWwgUG9ydGFsIHRvIGJlIHJlbW92ZWQuXG4gICAqL1xuICByZW1vdmVBY3Rpb25zKHBvcnRhbDogVGVtcGxhdGVQb3J0YWwpOiB2b2lkIHtcbiAgICBpZiAocG9ydGFsID09PSB0aGlzLl9hY3Rpb25zUG9ydGFsKSB7XG4gICAgICB0aGlzLl9hY3Rpb25zUG9ydGFsID0gbnVsbDtcbiAgICAgIHRoaXMuX2NvbXBvbmVudFJlZj8uaW5zdGFuY2UuX2Fzc2lnbkFjdGlvbnMobnVsbCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIE9wZW4gdGhlIGNhbGVuZGFyLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIC8vIFNraXAgcmVvcGVuaW5nIGlmIHRoZXJlJ3MgYW4gaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uIHRvIGF2b2lkIG92ZXJsYXBwaW5nXG4gICAgLy8gc2VxdWVuY2VzIHdoaWNoIGNhbiBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy4gU2VlICMyNTgzNy5cbiAgICBpZiAodGhpcy5fb3BlbmVkIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5fY29tcG9uZW50UmVmPy5pbnN0YW5jZS5faXNBbmltYXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZGF0ZXBpY2tlcklucHV0ICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcignQXR0ZW1wdGVkIHRvIG9wZW4gYW4gTWF0RGF0ZXBpY2tlciB3aXRoIG5vIGFzc29jaWF0ZWQgaW5wdXQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gX2dldEZvY3VzZWRFbGVtZW50UGllcmNlU2hhZG93RG9tKCk7XG4gICAgdGhpcy5fb3Blbk92ZXJsYXkoKTtcbiAgICB0aGlzLl9vcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMub3BlbmVkU3RyZWFtLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZSB0aGUgY2FsZW5kYXIuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIC8vIFNraXAgcmVvcGVuaW5nIGlmIHRoZXJlJ3MgYW4gaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uIHRvIGF2b2lkIG92ZXJsYXBwaW5nXG4gICAgLy8gc2VxdWVuY2VzIHdoaWNoIGNhbiBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy4gU2VlICMyNTgzNy5cbiAgICBpZiAoIXRoaXMuX29wZW5lZCB8fCB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlLl9pc0FuaW1hdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhblJlc3RvcmVGb2N1cyA9XG4gICAgICB0aGlzLl9yZXN0b3JlRm9jdXMgJiZcbiAgICAgIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3BlbiAmJlxuICAgICAgdHlwZW9mIHRoaXMuX2ZvY3VzZWRFbGVtZW50QmVmb3JlT3Blbi5mb2N1cyA9PT0gJ2Z1bmN0aW9uJztcblxuICAgIGNvbnN0IGNvbXBsZXRlQ2xvc2UgPSAoKSA9PiB7XG4gICAgICAvLyBUaGUgYF9vcGVuZWRgIGNvdWxkJ3ZlIGJlZW4gcmVzZXQgYWxyZWFkeSBpZlxuICAgICAgLy8gd2UgZ290IHR3byBldmVudHMgaW4gcXVpY2sgc3VjY2Vzc2lvbi5cbiAgICAgIGlmICh0aGlzLl9vcGVuZWQpIHtcbiAgICAgICAgdGhpcy5fb3BlbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VkU3RyZWFtLmVtaXQoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuX2NvbXBvbmVudFJlZikge1xuICAgICAgY29uc3Qge2luc3RhbmNlLCBsb2NhdGlvbn0gPSB0aGlzLl9jb21wb25lbnRSZWY7XG4gICAgICBpbnN0YW5jZS5fc3RhcnRFeGl0QW5pbWF0aW9uKCk7XG4gICAgICBpbnN0YW5jZS5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgICAgIC8vIFNpbmNlIHdlIHJlc3RvcmUgZm9jdXMgYWZ0ZXIgdGhlIGV4aXQgYW5pbWF0aW9uLCB3ZSBoYXZlIHRvIGNoZWNrIHRoYXRcbiAgICAgICAgLy8gdGhlIHVzZXIgZGlkbid0IG1vdmUgZm9jdXMgdGhlbXNlbHZlcyBpbnNpZGUgdGhlIGBjbG9zZWAgaGFuZGxlci5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGNhblJlc3RvcmVGb2N1cyAmJlxuICAgICAgICAgICghYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fFxuICAgICAgICAgICAgbG9jYXRpb24ubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuIS5mb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9jdXNlZEVsZW1lbnRCZWZvcmVPcGVuID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjYW5SZXN0b3JlRm9jdXMpIHtcbiAgICAgIC8vIEJlY2F1c2UgSUUgbW92ZXMgZm9jdXMgYXN5bmNocm9ub3VzbHksIHdlIGNhbid0IGNvdW50IG9uIGl0IGJlaW5nIHJlc3RvcmVkIGJlZm9yZSB3ZSd2ZVxuICAgICAgLy8gbWFya2VkIHRoZSBkYXRlcGlja2VyIGFzIGNsb3NlZC4gSWYgdGhlIGV2ZW50IGZpcmVzIG91dCBvZiBzZXF1ZW5jZSBhbmQgdGhlIGVsZW1lbnQgdGhhdFxuICAgICAgLy8gd2UncmUgcmVmb2N1c2luZyBvcGVucyB0aGUgZGF0ZXBpY2tlciBvbiBmb2N1cywgdGhlIHVzZXIgY291bGQgYmUgc3R1Y2sgd2l0aCBub3QgYmVpbmdcbiAgICAgIC8vIGFibGUgdG8gY2xvc2UgdGhlIGNhbGVuZGFyIGF0IGFsbC4gV2Ugd29yayBhcm91bmQgaXQgYnkgbWFraW5nIHRoZSBsb2dpYywgdGhhdCBtYXJrc1xuICAgICAgLy8gdGhlIGRhdGVwaWNrZXIgYXMgY2xvc2VkLCBhc3luYyBhcyB3ZWxsLlxuICAgICAgc2V0VGltZW91dChjb21wbGV0ZUNsb3NlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29tcGxldGVDbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHRoZSBjdXJyZW50IHBlbmRpbmcgc2VsZWN0aW9uIG9uIHRoZSBvdmVybGF5IHRvIHRoZSBtb2RlbC4gKi9cbiAgX2FwcGx5UGVuZGluZ1NlbGVjdGlvbigpIHtcbiAgICB0aGlzLl9jb21wb25lbnRSZWY/Lmluc3RhbmNlPy5fYXBwbHlQZW5kaW5nU2VsZWN0aW9uKCk7XG4gIH1cblxuICAvKiogRm9yd2FyZHMgcmVsZXZhbnQgdmFsdWVzIGZyb20gdGhlIGRhdGVwaWNrZXIgdG8gdGhlIGRhdGVwaWNrZXIgY29udGVudCBpbnNpZGUgdGhlIG92ZXJsYXkuICovXG4gIHByb3RlY3RlZCBfZm9yd2FyZENvbnRlbnRWYWx1ZXMoaW5zdGFuY2U6IE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+KSB7XG4gICAgaW5zdGFuY2UuZGF0ZXBpY2tlciA9IHRoaXM7XG4gICAgaW5zdGFuY2UuY29sb3IgPSB0aGlzLmNvbG9yO1xuICAgIGluc3RhbmNlLl9kaWFsb2dMYWJlbElkID0gdGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0T3ZlcmxheUxhYmVsSWQoKTtcbiAgICBpbnN0YW5jZS5fYXNzaWduQWN0aW9ucyh0aGlzLl9hY3Rpb25zUG9ydGFsLCBmYWxzZSk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG92ZXJsYXkgd2l0aCB0aGUgY2FsZW5kYXIuICovXG4gIHByaXZhdGUgX29wZW5PdmVybGF5KCk6IHZvaWQge1xuICAgIHRoaXMuX2Rlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBjb25zdCBpc0RpYWxvZyA9IHRoaXMudG91Y2hVaTtcbiAgICBjb25zdCBwb3J0YWwgPSBuZXcgQ29tcG9uZW50UG9ydGFsPE1hdERhdGVwaWNrZXJDb250ZW50PFMsIEQ+PihcbiAgICAgIE1hdERhdGVwaWNrZXJDb250ZW50LFxuICAgICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZixcbiAgICApO1xuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSAodGhpcy5fb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKFxuICAgICAgbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgICBwb3NpdGlvblN0cmF0ZWd5OiBpc0RpYWxvZyA/IHRoaXMuX2dldERpYWxvZ1N0cmF0ZWd5KCkgOiB0aGlzLl9nZXREcm9wZG93blN0cmF0ZWd5KCksXG4gICAgICAgIGhhc0JhY2tkcm9wOiB0cnVlLFxuICAgICAgICBiYWNrZHJvcENsYXNzOiBbXG4gICAgICAgICAgaXNEaWFsb2cgPyAnY2RrLW92ZXJsYXktZGFyay1iYWNrZHJvcCcgOiAnbWF0LW92ZXJsYXktdHJhbnNwYXJlbnQtYmFja2Ryb3AnLFxuICAgICAgICAgIHRoaXMuX2JhY2tkcm9wSGFybmVzc0NsYXNzLFxuICAgICAgICBdLFxuICAgICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgICAgc2Nyb2xsU3RyYXRlZ3k6IGlzRGlhbG9nID8gdGhpcy5fb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLmJsb2NrKCkgOiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgICBwYW5lbENsYXNzOiBgbWF0LWRhdGVwaWNrZXItJHtpc0RpYWxvZyA/ICdkaWFsb2cnIDogJ3BvcHVwJ31gLFxuICAgICAgfSksXG4gICAgKSk7XG5cbiAgICB0aGlzLl9nZXRDbG9zZVN0cmVhbShvdmVybGF5UmVmKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBUaGUgYHByZXZlbnREZWZhdWx0YCBjYWxsIGhhcHBlbnMgaW5zaWRlIHRoZSBjYWxlbmRhciBhcyB3ZWxsLCBob3dldmVyIGZvY3VzIG1vdmVzIGludG9cbiAgICAvLyBpdCBpbnNpZGUgYSB0aW1lb3V0IHdoaWNoIGNhbiBnaXZlIGJyb3dzZXJzIGEgY2hhbmNlIHRvIGZpcmUgb2ZmIGEga2V5Ym9hcmQgZXZlbnQgaW4tYmV0d2VlblxuICAgIC8vIHRoYXQgY2FuIHNjcm9sbCB0aGUgcGFnZSAoc2VlICMyNDk2OSkuIEFsd2F5cyBibG9jayBkZWZhdWx0IGFjdGlvbnMgb2YgYXJyb3cga2V5cyBmb3IgdGhlXG4gICAgLy8gZW50aXJlIG92ZXJsYXkgc28gdGhlIHBhZ2UgZG9lc24ndCBnZXQgc2Nyb2xsZWQgYnkgYWNjaWRlbnQuXG4gICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGtleUNvZGUgPT09IFVQX0FSUk9XIHx8XG4gICAgICAgIGtleUNvZGUgPT09IERPV05fQVJST1cgfHxcbiAgICAgICAga2V5Q29kZSA9PT0gTEVGVF9BUlJPVyB8fFxuICAgICAgICBrZXlDb2RlID09PSBSSUdIVF9BUlJPVyB8fFxuICAgICAgICBrZXlDb2RlID09PSBQQUdFX1VQIHx8XG4gICAgICAgIGtleUNvZGUgPT09IFBBR0VfRE9XTlxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jb21wb25lbnRSZWYgPSBvdmVybGF5UmVmLmF0dGFjaChwb3J0YWwpO1xuICAgIHRoaXMuX2ZvcndhcmRDb250ZW50VmFsdWVzKHRoaXMuX2NvbXBvbmVudFJlZi5pbnN0YW5jZSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9uY2UgdGhlIGNhbGVuZGFyIGhhcyByZW5kZXJlZC4gT25seSByZWxldmFudCBpbiBkcm9wZG93biBtb2RlLlxuICAgIGlmICghaXNEaWFsb2cpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiBvdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgY3VycmVudCBvdmVybGF5LiAqL1xuICBwcml2YXRlIF9kZXN0cm95T3ZlcmxheSgpIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gdGhpcy5fY29tcG9uZW50UmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyBhIHBvc2l0aW9uIHN0cmF0ZWd5IHRoYXQgd2lsbCBvcGVuIHRoZSBjYWxlbmRhciBhcyBhIGRyb3Bkb3duLiAqL1xuICBwcml2YXRlIF9nZXREaWFsb2dTdHJhdGVneSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpLmdsb2JhbCgpLmNlbnRlckhvcml6b250YWxseSgpLmNlbnRlclZlcnRpY2FsbHkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcG9zaXRpb24gc3RyYXRlZ3kgdGhhdCB3aWxsIG9wZW4gdGhlIGNhbGVuZGFyIGFzIGEgZHJvcGRvd24uICovXG4gIHByaXZhdGUgX2dldERyb3Bkb3duU3RyYXRlZ3koKSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5kYXRlcGlja2VySW5wdXQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpKVxuICAgICAgLndpdGhUcmFuc2Zvcm1PcmlnaW5PbignLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQnKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpXG4gICAgICAud2l0aExvY2tlZFBvc2l0aW9uKCk7XG5cbiAgICByZXR1cm4gdGhpcy5fc2V0Q29ubmVjdGVkUG9zaXRpb25zKHN0cmF0ZWd5KTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb2YgdGhlIGRhdGVwaWNrZXIgaW4gZHJvcGRvd24gbW9kZSBiYXNlZCBvbiB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLiAqL1xuICBwcml2YXRlIF9zZXRDb25uZWN0ZWRQb3NpdGlvbnMoc3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIGNvbnN0IHByaW1hcnlYID0gdGhpcy54UG9zaXRpb24gPT09ICdlbmQnID8gJ2VuZCcgOiAnc3RhcnQnO1xuICAgIGNvbnN0IHNlY29uZGFyeVggPSBwcmltYXJ5WCA9PT0gJ3N0YXJ0JyA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgICBjb25zdCBwcmltYXJ5WSA9IHRoaXMueVBvc2l0aW9uID09PSAnYWJvdmUnID8gJ2JvdHRvbScgOiAndG9wJztcbiAgICBjb25zdCBzZWNvbmRhcnlZID0gcHJpbWFyeVkgPT09ICd0b3AnID8gJ2JvdHRvbScgOiAndG9wJztcblxuICAgIHJldHVybiBzdHJhdGVneS53aXRoUG9zaXRpb25zKFtcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHNlY29uZGFyeVksXG4gICAgICAgIG92ZXJsYXlYOiBwcmltYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHByaW1hcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogcHJpbWFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogcHJpbWFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBzZWNvbmRhcnlZLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3JpZ2luWDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3JpZ2luWTogc2Vjb25kYXJ5WSxcbiAgICAgICAgb3ZlcmxheVg6IHNlY29uZGFyeVgsXG4gICAgICAgIG92ZXJsYXlZOiBwcmltYXJ5WSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9yaWdpblg6IHNlY29uZGFyeVgsXG4gICAgICAgIG9yaWdpblk6IHByaW1hcnlZLFxuICAgICAgICBvdmVybGF5WDogc2Vjb25kYXJ5WCxcbiAgICAgICAgb3ZlcmxheVk6IHNlY29uZGFyeVksXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgLyoqIEdldHMgYW4gb2JzZXJ2YWJsZSB0aGF0IHdpbGwgZW1pdCB3aGVuIHRoZSBvdmVybGF5IGlzIHN1cHBvc2VkIHRvIGJlIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2xvc2VTdHJlYW0ob3ZlcmxheVJlZjogT3ZlcmxheVJlZikge1xuICAgIGNvbnN0IGN0cmxTaGlmdE1ldGFNb2RpZmllcnM6IE1vZGlmaWVyS2V5W10gPSBbJ2N0cmxLZXknLCAnc2hpZnRLZXknLCAnbWV0YUtleSddO1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpLFxuICAgICAgb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLFxuICAgICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkucGlwZShcbiAgICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBDbG9zaW5nIG9uIGFsdCArIHVwIGlzIG9ubHkgdmFsaWQgd2hlbiB0aGVyZSdzIGFuIGlucHV0IGFzc29jaWF0ZWQgd2l0aCB0aGUgZGF0ZXBpY2tlci5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgICAgICAgKHRoaXMuZGF0ZXBpY2tlcklucHV0ICYmXG4gICAgICAgICAgICAgIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykgJiZcbiAgICAgICAgICAgICAgZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cgJiZcbiAgICAgICAgICAgICAgY3RybFNoaWZ0TWV0YU1vZGlmaWVycy5ldmVyeShcbiAgICAgICAgICAgICAgICAobW9kaWZpZXI6IE1vZGlmaWVyS2V5KSA9PiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQsIG1vZGlmaWVyKSxcbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuIiwiPGRpdlxuICBjZGtUcmFwRm9jdXNcbiAgcm9sZT1cImRpYWxvZ1wiXG4gIFthdHRyLmFyaWEtbW9kYWxdPVwidHJ1ZVwiXG4gIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZGlhbG9nTGFiZWxJZCA/PyB1bmRlZmluZWRcIlxuICBjbGFzcz1cIm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyXCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtY3VzdG9tLWhlYWRlcl09XCJkYXRlcGlja2VyLmNhbGVuZGFySGVhZGVyQ29tcG9uZW50XCJcbiAgW2NsYXNzLm1hdC1kYXRlcGlja2VyLWNvbnRlbnQtY29udGFpbmVyLXdpdGgtYWN0aW9uc109XCJfYWN0aW9uc1BvcnRhbFwiPlxuICA8bWF0LWNhbGVuZGFyXG4gICAgW2lkXT1cImRhdGVwaWNrZXIuaWRcIlxuICAgIFtuZ0NsYXNzXT1cImRhdGVwaWNrZXIucGFuZWxDbGFzc1wiXG4gICAgW3N0YXJ0QXRdPVwiZGF0ZXBpY2tlci5zdGFydEF0XCJcbiAgICBbc3RhcnRWaWV3XT1cImRhdGVwaWNrZXIuc3RhcnRWaWV3XCJcbiAgICBbbWluRGF0ZV09XCJkYXRlcGlja2VyLl9nZXRNaW5EYXRlKClcIlxuICAgIFttYXhEYXRlXT1cImRhdGVwaWNrZXIuX2dldE1heERhdGUoKVwiXG4gICAgW2RhdGVGaWx0ZXJdPVwiZGF0ZXBpY2tlci5fZ2V0RGF0ZUZpbHRlcigpXCJcbiAgICBbaGVhZGVyQ29tcG9uZW50XT1cImRhdGVwaWNrZXIuY2FsZW5kYXJIZWFkZXJDb21wb25lbnRcIlxuICAgIFtzZWxlY3RlZF09XCJfZ2V0U2VsZWN0ZWQoKVwiXG4gICAgW2RhdGVDbGFzc109XCJkYXRlcGlja2VyLmRhdGVDbGFzc1wiXG4gICAgW2NvbXBhcmlzb25TdGFydF09XCJjb21wYXJpc29uU3RhcnRcIlxuICAgIFtjb21wYXJpc29uRW5kXT1cImNvbXBhcmlzb25FbmRcIlxuICAgIFtAZmFkZUluQ2FsZW5kYXJdPVwiJ2VudGVyJ1wiXG4gICAgW3N0YXJ0RGF0ZUFjY2Vzc2libGVOYW1lXT1cInN0YXJ0RGF0ZUFjY2Vzc2libGVOYW1lXCJcbiAgICBbZW5kRGF0ZUFjY2Vzc2libGVOYW1lXT1cImVuZERhdGVBY2Nlc3NpYmxlTmFtZVwiXG4gICAgKHllYXJTZWxlY3RlZCk9XCJkYXRlcGlja2VyLl9zZWxlY3RZZWFyKCRldmVudClcIlxuICAgIChtb250aFNlbGVjdGVkKT1cImRhdGVwaWNrZXIuX3NlbGVjdE1vbnRoKCRldmVudClcIlxuICAgICh2aWV3Q2hhbmdlZCk9XCJkYXRlcGlja2VyLl92aWV3Q2hhbmdlZCgkZXZlbnQpXCJcbiAgICAoX3VzZXJTZWxlY3Rpb24pPVwiX2hhbmRsZVVzZXJTZWxlY3Rpb24oJGV2ZW50KVwiXG4gICAgKF91c2VyRHJhZ0Ryb3ApPVwiX2hhbmRsZVVzZXJEcmFnRHJvcCgkZXZlbnQpXCI+PC9tYXQtY2FsZW5kYXI+XG5cbiAgPG5nLXRlbXBsYXRlIFtjZGtQb3J0YWxPdXRsZXRdPVwiX2FjdGlvbnNQb3J0YWxcIj48L25nLXRlbXBsYXRlPlxuXG4gIDwhLS0gSW52aXNpYmxlIGNsb3NlIGJ1dHRvbiBmb3Igc2NyZWVuIHJlYWRlciB1c2Vycy4gLS0+XG4gIDxidXR0b25cbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBtYXQtcmFpc2VkLWJ1dHRvblxuICAgIFtjb2xvcl09XCJjb2xvciB8fCAncHJpbWFyeSdcIlxuICAgIGNsYXNzPVwibWF0LWRhdGVwaWNrZXItY2xvc2UtYnV0dG9uXCJcbiAgICBbY2xhc3MuY2RrLXZpc3VhbGx5LWhpZGRlbl09XCIhX2Nsb3NlQnV0dG9uRm9jdXNlZFwiXG4gICAgKGZvY3VzKT1cIl9jbG9zZUJ1dHRvbkZvY3VzZWQgPSB0cnVlXCJcbiAgICAoYmx1cik9XCJfY2xvc2VCdXR0b25Gb2N1c2VkID0gZmFsc2VcIlxuICAgIChjbGljayk9XCJkYXRlcGlja2VyLmNsb3NlKClcIj57eyBfY2xvc2VCdXR0b25UZXh0IH19PC9idXR0b24+XG48L2Rpdj5cbiJdfQ==