/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { _supportsShadowDom } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, MatOptionSelectionChange, } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { defer, fromEvent, merge, of as observableOf, Subject, Subscription } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteOrigin } from './autocomplete-origin';
/**
 * The height of each autocomplete option.
 * @type {?}
 */
export const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 * @type {?}
 */
export const AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Injection token that determines the scroll handling while the autocomplete panel is open.
 * @type {?}
 */
export const MAT_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('mat-autocomplete-scroll-strategy');
/**
 * \@docs-private
 * @param {?} overlay
 * @return {?}
 */
export function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay) {
    return (/**
     * @return {?}
     */
    () => overlay.scrollStrategies.reposition());
}
/**
 * \@docs-private
 * @type {?}
 */
export const MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,
};
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * \@docs-private
 * @type {?}
 */
export const MAT_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => MatAutocompleteTrigger)),
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * \@docs-private
 * @return {?}
 */
export function getMatAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `mat-autocomplete`. ' +
        'Make sure that the id passed to the `matAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
}
export class MatAutocompleteTrigger {
    /**
     * @param {?} _element
     * @param {?} _overlay
     * @param {?} _viewContainerRef
     * @param {?} _zone
     * @param {?} _changeDetectorRef
     * @param {?} scrollStrategy
     * @param {?} _dir
     * @param {?} _formField
     * @param {?} _document
     * @param {?=} _viewportRuler
     */
    constructor(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, scrollStrategy, _dir, _formField, _document, _viewportRuler) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._formField = _formField;
        this._document = _document;
        this._viewportRuler = _viewportRuler;
        this._componentDestroyed = false;
        this._autocompleteDisabled = false;
        /**
         * Whether or not the label state is being overridden.
         */
        this._manuallyFloatingLabel = false;
        /**
         * Subscription to viewport size changes.
         */
        this._viewportSubscription = Subscription.EMPTY;
        /**
         * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
         * closed autocomplete from being reopened if the user switches to another browser tab and then
         * comes back.
         */
        this._canOpenOnNextFocus = true;
        /**
         * Stream of keyboard events that can close the panel.
         */
        this._closeKeyEventStream = new Subject();
        /**
         * Event handler for when the window is blurred. Needs to be an
         * arrow function in order to preserve the context.
         */
        this._windowBlurHandler = (/**
         * @return {?}
         */
        () => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
                this._document.activeElement !== this._element.nativeElement || this.panelOpen;
        });
        /**
         * `View -> model callback called when value changes`
         */
        this._onChange = (/**
         * @return {?}
         */
        () => { });
        /**
         * `View -> model callback called when autocomplete has been touched`
         */
        this._onTouched = (/**
         * @return {?}
         */
        () => { });
        /**
         * Position of the autocomplete panel relative to the trigger element. A position of `auto`
         * will render the panel underneath the trigger if there is enough space for it to fit in
         * the viewport, otherwise the panel will be shown above it. If the position is set to
         * `above` or `below`, the panel will always be shown above or below the trigger. no matter
         * whether it fits completely in the viewport.
         */
        this.position = 'auto';
        /**
         * `autocomplete` attribute to be set on the input element.
         * \@docs-private
         */
        this.autocompleteAttribute = 'off';
        this._overlayAttached = false;
        /**
         * Stream of autocomplete option selections.
         */
        this.optionSelections = (/** @type {?} */ (defer((/**
         * @return {?}
         */
        () => {
            if (this.autocomplete && this.autocomplete.options) {
                return merge(...this.autocomplete.options.map((/**
                 * @param {?} option
                 * @return {?}
                 */
                option => option.onSelectionChange)));
            }
            // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
            // Return a stream that we'll replace with the real one once everything is in place.
            return this._zone.onStable
                .asObservable()
                .pipe(take(1), switchMap((/**
             * @return {?}
             */
            () => this.optionSelections)));
        }))));
        this._scrollStrategy = scrollStrategy;
    }
    /**
     * Whether the autocomplete is disabled. When disabled, the element will
     * act as a regular input and the user won't be able to open the panel.
     * @return {?}
     */
    get autocompleteDisabled() { return this._autocompleteDisabled; }
    /**
     * @param {?} value
     * @return {?}
     */
    set autocompleteDisabled(value) {
        this._autocompleteDisabled = coerceBooleanProperty(value);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (typeof window !== 'undefined') {
            this._zone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                window.addEventListener('blur', this._windowBlurHandler);
            }));
            if (_supportsShadowDom()) {
                /** @type {?} */
                const element = this._element.nativeElement;
                /** @type {?} */
                const rootNode = element.getRootNode ? element.getRootNode() : null;
                // We need to take the `ShadowRoot` off of `window`, because the built-in types are
                // incorrect. See https://github.com/Microsoft/TypeScript/issues/27929.
                this._isInsideShadowRoot = rootNode instanceof ((/** @type {?} */ (window))).ShadowRoot;
            }
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['position'] && this._positionStrategy) {
            this._setStrategyPositions(this._positionStrategy);
            if (this.panelOpen) {
                (/** @type {?} */ (this._overlayRef)).updatePosition();
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('blur', this._windowBlurHandler);
        }
        this._viewportSubscription.unsubscribe();
        this._componentDestroyed = true;
        this._destroyPanel();
        this._closeKeyEventStream.complete();
    }
    /**
     * Whether or not the autocomplete panel is open.
     * @return {?}
     */
    get panelOpen() {
        return this._overlayAttached && this.autocomplete.showPanel;
    }
    /**
     * Opens the autocomplete suggestion panel.
     * @return {?}
     */
    openPanel() {
        this._attachOverlay();
        this._floatLabel();
    }
    /**
     * Closes the autocomplete suggestion panel.
     * @return {?}
     */
    closePanel() {
        this._resetLabel();
        if (!this._overlayAttached) {
            return;
        }
        if (this.panelOpen) {
            // Only emit if the panel was visible.
            this.autocomplete.closed.emit();
        }
        this.autocomplete._isOpen = this._overlayAttached = false;
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }
        // Note that in some cases this can end up being called after the component is destroyed.
        // Add a check to ensure that we don't try to run change detection on a destroyed view.
        if (!this._componentDestroyed) {
            // We need to trigger change detection manually, because
            // `fromEvent` doesn't seem to do it at the proper time.
            // This ensures that the label is reset when the
            // user clicks outside.
            this._changeDetectorRef.detectChanges();
        }
    }
    /**
     * Updates the position of the autocomplete suggestion panel to ensure that it fits all options
     * within the viewport.
     * @return {?}
     */
    updatePosition() {
        if (this._overlayAttached) {
            (/** @type {?} */ (this._overlayRef)).updatePosition();
        }
    }
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     * @return {?}
     */
    get panelClosingActions() {
        return merge(this.optionSelections, this.autocomplete._keyManager.tabOut.pipe(filter((/**
         * @return {?}
         */
        () => this._overlayAttached))), this._closeKeyEventStream, this._getOutsideClickStream(), this._overlayRef ?
            this._overlayRef.detachments().pipe(filter((/**
             * @return {?}
             */
            () => this._overlayAttached))) :
            observableOf()).pipe(
        // Normalize the output so we return a consistent type.
        map((/**
         * @param {?} event
         * @return {?}
         */
        event => event instanceof MatOptionSelectionChange ? event : null)));
    }
    /**
     * The currently active option, coerced to MatOption type.
     * @return {?}
     */
    get activeOption() {
        if (this.autocomplete && this.autocomplete._keyManager) {
            return this.autocomplete._keyManager.activeItem;
        }
        return null;
    }
    /**
     * Stream of clicks outside of the autocomplete panel.
     * @private
     * @return {?}
     */
    _getOutsideClickStream() {
        return merge((/** @type {?} */ (fromEvent(this._document, 'click'))), (/** @type {?} */ (fromEvent(this._document, 'touchend'))))
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
            // fall back to check the first element in the path of the click event.
            /** @type {?} */
            const clickTarget = (/** @type {?} */ ((this._isInsideShadowRoot && event.composedPath ? event.composedPath()[0] :
                event.target)));
            /** @type {?} */
            const formField = this._formField ? this._formField._elementRef.nativeElement : null;
            return this._overlayAttached && clickTarget !== this._element.nativeElement &&
                (!formField || !formField.contains(clickTarget)) &&
                (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
        })));
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        Promise.resolve(null).then((/**
         * @return {?}
         */
        () => this._setTriggerValue(value)));
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._element.nativeElement.disabled = isDisabled;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleKeydown(event) {
        /** @type {?} */
        const keyCode = event.keyCode;
        // Prevent the default action on all escape key presses. This is here primarily to bring IE
        // in line with other browsers. By default, pressing escape on IE will cause it to revert
        // the input value to the one that it had on focus, however it won't dispatch any events
        // which means that the model value will be out of sync with the view.
        if (keyCode === ESCAPE) {
            event.preventDefault();
        }
        if (this.activeOption && keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else if (this.autocomplete) {
            /** @type {?} */
            const prevActiveItem = this.autocomplete._keyManager.activeItem;
            /** @type {?} */
            const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
            if (this.panelOpen || keyCode === TAB) {
                this.autocomplete._keyManager.onKeydown(event);
            }
            else if (isArrowKey && this._canOpen()) {
                this.openPanel();
            }
            if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
                this._scrollToOption();
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _handleInput(event) {
        /** @type {?} */
        let target = (/** @type {?} */ (event.target));
        /** @type {?} */
        let value = target.value;
        // Based on `NumberValueAccessor` from forms.
        if (target.type === 'number') {
            value = value == '' ? null : parseFloat(value);
        }
        // If the input has a placeholder, IE will fire the `input` event on page load,
        // focus and blur, in addition to when the user actually changed the value. To
        // filter out all of the extra events, we save the value on focus and between
        // `input` events, and we check whether it changed.
        // See: https://connect.microsoft.com/IE/feedback/details/885747/
        if (this._previousValue !== value) {
            this._previousValue = value;
            this._onChange(value);
            if (this._canOpen() && this._document.activeElement === event.target) {
                this.openPanel();
            }
        }
    }
    /**
     * @return {?}
     */
    _handleFocus() {
        if (!this._canOpenOnNextFocus) {
            this._canOpenOnNextFocus = true;
        }
        else if (this._canOpen()) {
            this._previousValue = this._element.nativeElement.value;
            this._attachOverlay();
            this._floatLabel(true);
        }
    }
    /**
     * In "auto" mode, the label will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the label until the panel can be closed.
     * @private
     * @param {?=} shouldAnimate Whether the label should be animated when it is floated.
     * @return {?}
     */
    _floatLabel(shouldAnimate = false) {
        if (this._formField && this._formField.floatLabel === 'auto') {
            if (shouldAnimate) {
                this._formField._animateAndLockLabel();
            }
            else {
                this._formField.floatLabel = 'always';
            }
            this._manuallyFloatingLabel = true;
        }
    }
    /**
     * If the label has been manually elevated, return it to its normal state.
     * @private
     * @return {?}
     */
    _resetLabel() {
        if (this._manuallyFloatingLabel) {
            this._formField.floatLabel = 'auto';
            this._manuallyFloatingLabel = false;
        }
    }
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
     * the panel height + the option height, so the active option will be just visible at the
     * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
     * will become the offset. If that offset is visible within the panel already, the scrollTop is
     * not adjusted.
     * @private
     * @return {?}
     */
    _scrollToOption() {
        /** @type {?} */
        const index = this.autocomplete._keyManager.activeItemIndex || 0;
        /** @type {?} */
        const labelCount = _countGroupLabelsBeforeOption(index, this.autocomplete.options, this.autocomplete.optionGroups);
        /** @type {?} */
        const newScrollPosition = _getOptionScrollPosition(index + labelCount, AUTOCOMPLETE_OPTION_HEIGHT, this.autocomplete._getScrollTop(), AUTOCOMPLETE_PANEL_HEIGHT);
        this.autocomplete._setScrollTop(newScrollPosition);
    }
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     * @private
     * @return {?}
     */
    _subscribeToClosingActions() {
        /** @type {?} */
        const firstStable = this._zone.onStable.asObservable().pipe(take(1));
        /** @type {?} */
        const optionChanges = this.autocomplete.options.changes.pipe(tap((/**
         * @return {?}
         */
        () => this._positionStrategy.reapplyLastPosition())), 
        // Defer emitting to the stream until the next tick, because changing
        // bindings in here will cause "changed after checked" errors.
        delay(0));
        // When the zone is stable initially, and when the option list changes...
        return merge(firstStable, optionChanges)
            .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const wasOpen = this.panelOpen;
            this._resetActiveItem();
            this.autocomplete._setVisibility();
            if (this.panelOpen) {
                (/** @type {?} */ (this._overlayRef)).updatePosition();
                // If the `panelOpen` state changed, we need to make sure to emit the `opened`
                // event, because we may not have emitted it when the panel was attached. This
                // can happen if the users opens the panel and there are no options, but the
                // options come in slightly later or as a result of the value changing.
                if (wasOpen !== this.panelOpen) {
                    this.autocomplete.opened.emit();
                }
            }
            return this.panelClosingActions;
        })), 
        // when the first closing event occurs...
        take(1))
            // set the value, close the panel, and complete.
            .subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => this._setValueAndClose(event)));
    }
    /**
     * Destroys the autocomplete suggestion panel.
     * @private
     * @return {?}
     */
    _destroyPanel() {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    _setTriggerValue(value) {
        /** @type {?} */
        const toDisplay = this.autocomplete && this.autocomplete.displayWith ?
            this.autocomplete.displayWith(value) :
            value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        /** @type {?} */
        const inputValue = toDisplay != null ? toDisplay : '';
        // If it's used within a `MatFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = inputValue;
        }
        else {
            this._element.nativeElement.value = inputValue;
        }
        this._previousValue = inputValue;
    }
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     * @private
     * @param {?} event
     * @return {?}
     */
    _setValueAndClose(event) {
        if (event && event.source) {
            this._clearPreviousSelectedOption(event.source);
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
            this._element.nativeElement.focus();
            this.autocomplete._emitSelectEvent(event.source);
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     * @private
     * @param {?} skip
     * @return {?}
     */
    _clearPreviousSelectedOption(skip) {
        this.autocomplete.options.forEach((/**
         * @param {?} option
         * @return {?}
         */
        option => {
            if (option != skip && option.selected) {
                option.deselect();
            }
        }));
    }
    /**
     * @private
     * @return {?}
     */
    _attachOverlay() {
        if (!this.autocomplete) {
            throw getMatAutocompleteMissingPanelError();
        }
        /** @type {?} */
        let overlayRef = this._overlayRef;
        if (!overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
            overlayRef = this._overlay.create(this._getOverlayConfig());
            this._overlayRef = overlayRef;
            // Use the `keydownEvents` in order to take advantage of
            // the overlay event targeting provided by the CDK overlay.
            overlayRef.keydownEvents().subscribe((/**
             * @param {?} event
             * @return {?}
             */
            event => {
                // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
                // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
                if (event.keyCode === ESCAPE || (event.keyCode === UP_ARROW && event.altKey)) {
                    this._resetActiveItem();
                    this._closeKeyEventStream.next();
                    // We need to stop propagation, otherwise the event will eventually
                    // reach the input itself and cause the overlay to be reopened.
                    event.stopPropagation();
                    event.preventDefault();
                }
            }));
            if (this._viewportRuler) {
                this._viewportSubscription = this._viewportRuler.change().subscribe((/**
                 * @return {?}
                 */
                () => {
                    if (this.panelOpen && overlayRef) {
                        overlayRef.updateSize({ width: this._getPanelWidth() });
                    }
                }));
            }
        }
        else {
            // Update the trigger, panel width and direction, in case anything has changed.
            this._positionStrategy.setOrigin(this._getConnectedElement());
            overlayRef.updateSize({ width: this._getPanelWidth() });
        }
        if (overlayRef && !overlayRef.hasAttached()) {
            overlayRef.attach(this._portal);
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        /** @type {?} */
        const wasOpen = this.panelOpen;
        this.autocomplete._setVisibility();
        this.autocomplete._isOpen = this._overlayAttached = true;
        // We need to do an extra `panelOpen` check in here, because the
        // autocomplete won't be shown if there are no options.
        if (this.panelOpen && wasOpen !== this.panelOpen) {
            this.autocomplete.opened.emit();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getPanelWidth(),
            direction: this._dir
        });
    }
    /**
     * @private
     * @return {?}
     */
    _getOverlayPosition() {
        /** @type {?} */
        const strategy = this._overlay.position()
            .flexibleConnectedTo(this._getConnectedElement())
            .withFlexibleDimensions(false)
            .withPush(false);
        this._setStrategyPositions(strategy);
        this._positionStrategy = strategy;
        return strategy;
    }
    /**
     * Sets the positions on a position strategy based on the directive's input state.
     * @private
     * @param {?} positionStrategy
     * @return {?}
     */
    _setStrategyPositions(positionStrategy) {
        /** @type {?} */
        const belowPosition = {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
        };
        /** @type {?} */
        const abovePosition = {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            // The overlay edge connected to the trigger should have squared corners, while
            // the opposite end has rounded corners. We apply a CSS class to swap the
            // border-radius based on the overlay position.
            panelClass: 'mat-autocomplete-panel-above'
        };
        /** @type {?} */
        let positions;
        if (this.position === 'above') {
            positions = [abovePosition];
        }
        else if (this.position === 'below') {
            positions = [belowPosition];
        }
        else {
            positions = [belowPosition, abovePosition];
        }
        positionStrategy.withPositions(positions);
    }
    /**
     * @private
     * @return {?}
     */
    _getConnectedElement() {
        if (this.connectedTo) {
            return this.connectedTo.elementRef;
        }
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._element;
    }
    /**
     * @private
     * @return {?}
     */
    _getPanelWidth() {
        return this.autocomplete.panelWidth || this._getHostWidth();
    }
    /**
     * Returns the width of the input element, so the panel width can match it.
     * @private
     * @return {?}
     */
    _getHostWidth() {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    }
    /**
     * Resets the active item to -1 so arrow events will activate the
     * correct options, or to 0 if the consumer opted into it.
     * @private
     * @return {?}
     */
    _resetActiveItem() {
        this.autocomplete._keyManager.setActiveItem(this.autocomplete.autoActiveFirstOption ? 0 : -1);
    }
    /**
     * Determines whether the panel can be opened.
     * @private
     * @return {?}
     */
    _canOpen() {
        /** @type {?} */
        const element = this._element.nativeElement;
        return !element.readOnly && !element.disabled && !this._autocompleteDisabled;
    }
}
MatAutocompleteTrigger.decorators = [
    { type: Directive, args: [{
                selector: `input[matAutocomplete], textarea[matAutocomplete]`,
                host: {
                    'class': 'mat-autocomplete-trigger',
                    '[attr.autocomplete]': 'autocompleteAttribute',
                    '[attr.role]': 'autocompleteDisabled ? null : "combobox"',
                    '[attr.aria-autocomplete]': 'autocompleteDisabled ? null : "list"',
                    '[attr.aria-activedescendant]': '(panelOpen && activeOption) ? activeOption.id : null',
                    '[attr.aria-expanded]': 'autocompleteDisabled ? null : panelOpen.toString()',
                    '[attr.aria-owns]': '(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id',
                    '[attr.aria-haspopup]': '!autocompleteDisabled',
                    // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                    // a little earlier. This avoids issues where IE delays the focusing of the input.
                    '(focusin)': '_handleFocus()',
                    '(blur)': '_onTouched()',
                    '(input)': '_handleInput($event)',
                    '(keydown)': '_handleKeydown($event)',
                },
                exportAs: 'matAutocompleteTrigger',
                providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR]
            },] }
];
/** @nocollapse */
MatAutocompleteTrigger.ctorParameters = () => [
    { type: ElementRef },
    { type: Overlay },
    { type: ViewContainerRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY,] }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Host }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: ViewportRuler }
];
MatAutocompleteTrigger.propDecorators = {
    autocomplete: [{ type: Input, args: ['matAutocomplete',] }],
    position: [{ type: Input, args: ['matAutocompletePosition',] }],
    connectedTo: [{ type: Input, args: ['matAutocompleteConnectedTo',] }],
    autocompleteAttribute: [{ type: Input, args: ['autocomplete',] }],
    autocompleteDisabled: [{ type: Input, args: ['matAutocompleteDisabled',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._overlayRef;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._portal;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._componentDestroyed;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._autocompleteDisabled;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._scrollStrategy;
    /**
     * Old value of the native input. Used to work around issues with the `input` event on IE.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._previousValue;
    /**
     * Strategy that is used to position the panel.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._positionStrategy;
    /**
     * Whether or not the label state is being overridden.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._manuallyFloatingLabel;
    /**
     * The subscription for closing actions (some are bound to document).
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._closingActionsSubscription;
    /**
     * Subscription to viewport size changes.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._viewportSubscription;
    /**
     * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
     * closed autocomplete from being reopened if the user switches to another browser tab and then
     * comes back.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._canOpenOnNextFocus;
    /**
     * Whether the element is inside of a ShadowRoot component.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._isInsideShadowRoot;
    /**
     * Stream of keyboard events that can close the panel.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._closeKeyEventStream;
    /**
     * Event handler for when the window is blurred. Needs to be an
     * arrow function in order to preserve the context.
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._windowBlurHandler;
    /**
     * `View -> model callback called when value changes`
     * @type {?}
     */
    MatAutocompleteTrigger.prototype._onChange;
    /**
     * `View -> model callback called when autocomplete has been touched`
     * @type {?}
     */
    MatAutocompleteTrigger.prototype._onTouched;
    /**
     * The autocomplete panel to be attached to this trigger.
     * @type {?}
     */
    MatAutocompleteTrigger.prototype.autocomplete;
    /**
     * Position of the autocomplete panel relative to the trigger element. A position of `auto`
     * will render the panel underneath the trigger if there is enough space for it to fit in
     * the viewport, otherwise the panel will be shown above it. If the position is set to
     * `above` or `below`, the panel will always be shown above or below the trigger. no matter
     * whether it fits completely in the viewport.
     * @type {?}
     */
    MatAutocompleteTrigger.prototype.position;
    /**
     * Reference relative to which to position the autocomplete panel.
     * Defaults to the autocomplete trigger element.
     * @type {?}
     */
    MatAutocompleteTrigger.prototype.connectedTo;
    /**
     * `autocomplete` attribute to be set on the input element.
     * \@docs-private
     * @type {?}
     */
    MatAutocompleteTrigger.prototype.autocompleteAttribute;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._overlayAttached;
    /**
     * Stream of autocomplete option selections.
     * @type {?}
     */
    MatAutocompleteTrigger.prototype.optionSelections;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._element;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._overlay;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._viewContainerRef;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._zone;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._formField;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._document;
    /**
     * @type {?}
     * @private
     */
    MatAutocompleteTrigger.prototype._viewportRuler;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0UsT0FBTyxFQUVMLE9BQU8sRUFDUCxhQUFhLEdBS2QsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixHQUdqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix3QkFBd0IsRUFFeEIsd0JBQXdCLEdBQ3pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBQyxL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cURBQXFDOzs7Ozs7SUFHckMsc0RBQTREOzs7Ozs7O0lBTTVELG9EQU1DOzs7OztJQUdELDJDQUEyQzs7Ozs7SUFHM0MsNENBQXNCOzs7OztJQUd0Qiw4Q0FBd0Q7Ozs7Ozs7OztJQVN4RCwwQ0FBZ0Y7Ozs7OztJQU1oRiw2Q0FBd0U7Ozs7OztJQU14RSx1REFBNkQ7Ozs7O0lBbUU3RCxrREFBMEM7Ozs7O0lBcUUxQyxrREFVMkM7Ozs7O0lBdEkvQiwwQ0FBOEM7Ozs7O0lBQUUsMENBQXlCOzs7OztJQUN6RSxtREFBMkM7Ozs7O0lBQzNDLHVDQUFxQjs7Ozs7SUFDckIsb0RBQTZDOzs7OztJQUU3QyxzQ0FBd0M7Ozs7O0lBQ3hDLDRDQUFvRDs7Ozs7SUFDcEQsMkNBQW9EOzs7OztJQUVwRCxnREFBc0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET1dOX0FSUk9XLCBFTlRFUiwgRVNDQVBFLCBUQUIsIFVQX0FSUk9XfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBQb3NpdGlvblN0cmF0ZWd5LFxuICBTY3JvbGxTdHJhdGVneSxcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7X3N1cHBvcnRzU2hhZG93RG9tfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3QsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtkZWZlciwgZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TWF0QXV0b2NvbXBsZXRlfSBmcm9tICcuL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZU9yaWdpbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgc3R5bGUgY29uc3RhbnRzIGFyZSBuZWNlc3NhcnkgdG8gc2F2ZSBoZXJlIGluIG9yZGVyXG4gKiB0byBwcm9wZXJseSBjYWxjdWxhdGUgdGhlIHNjcm9sbFRvcCBvZiB0aGUgcGFuZWwuIEJlY2F1c2Ugd2UgYXJlIG5vdFxuICogYWN0dWFsbHkgZm9jdXNpbmcgdGhlIGFjdGl2ZSBpdGVtLCBzY3JvbGwgbXVzdCBiZSBoYW5kbGVkIG1hbnVhbGx5LlxuICovXG5cbi8qKiBUaGUgaGVpZ2h0IG9mIGVhY2ggYXV0b2NvbXBsZXRlIG9wdGlvbi4gKi9cbmV4cG9ydCBjb25zdCBBVVRPQ09NUExFVEVfT1BUSU9OX0hFSUdIVCA9IDQ4O1xuXG4vKiogVGhlIHRvdGFsIGhlaWdodCBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9DT01QTEVURV9QQU5FTF9IRUlHSFQgPSAyNTY7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtYXV0b2NvbXBsZXRlLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIGF1dG9jb21wbGV0ZSB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gZXJyb3IgdG8gYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byB1c2UgYW4gYXV0b2NvbXBsZXRlIHRyaWdnZXIgd2l0aG91dCBhIHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ0F0dGVtcHRpbmcgdG8gb3BlbiBhbiB1bmRlZmluZWQgaW5zdGFuY2Ugb2YgYG1hdC1hdXRvY29tcGxldGVgLiAnICtcbiAgICAgICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCB0aGUgaWQgcGFzc2VkIHRvIHRoZSBgbWF0QXV0b2NvbXBsZXRlYCBpcyBjb3JyZWN0IGFuZCB0aGF0ICcgK1xuICAgICAgICAgICAgICAgJ3lvdVxcJ3JlIGF0dGVtcHRpbmcgdG8gb3BlbiBpdCBhZnRlciB0aGUgbmdBZnRlckNvbnRlbnRJbml0IGhvb2suJyk7XG59XG5cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgaW5wdXRbbWF0QXV0b2NvbXBsZXRlXSwgdGV4dGFyZWFbbWF0QXV0b2NvbXBsZXRlXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWF1dG9jb21wbGV0ZS10cmlnZ2VyJyxcbiAgICAnW2F0dHIuYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGVBdHRyaWJ1dGUnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImNvbWJvYm94XCInLFxuICAgICdbYXR0ci5hcmlhLWF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJsaXN0XCInLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJyhwYW5lbE9wZW4gJiYgYWN0aXZlT3B0aW9uKSA/IGFjdGl2ZU9wdGlvbi5pZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBwYW5lbE9wZW4udG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAnKGF1dG9jb21wbGV0ZURpc2FibGVkIHx8ICFwYW5lbE9wZW4pID8gbnVsbCA6IGF1dG9jb21wbGV0ZT8uaWQnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICchYXV0b2NvbXBsZXRlRGlzYWJsZWQnLFxuICAgIC8vIE5vdGU6IHdlIHVzZSBgZm9jdXNpbmAsIGFzIG9wcG9zZWQgdG8gYGZvY3VzYCwgaW4gb3JkZXIgdG8gb3BlbiB0aGUgcGFuZWxcbiAgICAvLyBhIGxpdHRsZSBlYXJsaWVyLiBUaGlzIGF2b2lkcyBpc3N1ZXMgd2hlcmUgSUUgZGVsYXlzIHRoZSBmb2N1c2luZyBvZiB0aGUgaW5wdXQuXG4gICAgJyhmb2N1c2luKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknLFxuICAgICcoaW5wdXQpJzogJ19oYW5kbGVJbnB1dCgkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZVRyaWdnZXInLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVUcmlnZ2VyIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX2NvbXBvbmVudERlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hdXRvY29tcGxldGVEaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIE9sZCB2YWx1ZSBvZiB0aGUgbmF0aXZlIGlucHV0LiBVc2VkIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aXRoIHRoZSBgaW5wdXRgIGV2ZW50IG9uIElFLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IGlzIHVzZWQgdG8gcG9zaXRpb24gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBsYWJlbCBzdGF0ZSBpcyBiZWluZyBvdmVycmlkZGVuLiAqL1xuICBwcml2YXRlIF9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcblxuICAvKiogVGhlIHN1YnNjcmlwdGlvbiBmb3IgY2xvc2luZyBhY3Rpb25zIChzb21lIGFyZSBib3VuZCB0byBkb2N1bWVudCkuICovXG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgY2FuIG9wZW4gdGhlIG5leHQgdGltZSBpdCBpcyBmb2N1c2VkLiBVc2VkIHRvIHByZXZlbnQgYSBmb2N1c2VkLFxuICAgKiBjbG9zZWQgYXV0b2NvbXBsZXRlIGZyb20gYmVpbmcgcmVvcGVuZWQgaWYgdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBicm93c2VyIHRhYiBhbmQgdGhlblxuICAgKiBjb21lcyBiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbnNpZGUgb2YgYSBTaGFkb3dSb290IGNvbXBvbmVudC4gKi9cbiAgcHJpdmF0ZSBfaXNJbnNpZGVTaGFkb3dSb290OiBib29sZWFuO1xuXG4gIC8qKiBTdHJlYW0gb2Yga2V5Ym9hcmQgZXZlbnRzIHRoYXQgY2FuIGNsb3NlIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2xvc2VLZXlFdmVudFN0cmVhbSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIHdpbmRvdyBpcyBibHVycmVkLiBOZWVkcyB0byBiZSBhblxuICAgKiBhcnJvdyBmdW5jdGlvbiBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dC5cbiAgICovXG4gIHByaXZhdGUgX3dpbmRvd0JsdXJIYW5kbGVyID0gKCkgPT4ge1xuICAgIC8vIElmIHRoZSB1c2VyIGJsdXJyZWQgdGhlIHdpbmRvdyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIGlzIGZvY3VzZWQsIGl0IG1lYW5zIHRoYXQgaXQnbGwgYmVcbiAgICAvLyByZWZvY3VzZWQgd2hlbiB0aGV5IGNvbWUgYmFjay4gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdG8gc2tpcCB0aGUgZmlyc3QgZm9jdXMgZXZlbnQsIGlmIHRoZVxuICAgIC8vIHBhbmUgd2FzIGNsb3NlZCwgaW4gb3JkZXIgdG8gYXZvaWQgcmVvcGVuaW5nIGl0IHVuaW50ZW50aW9uYWxseS5cbiAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPVxuICAgICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5wYW5lbE9wZW47XG4gIH1cblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBhdXRvY29tcGxldGUgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRvIGJlIGF0dGFjaGVkIHRvIHRoaXMgdHJpZ2dlci4gKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGU6IE1hdEF1dG9jb21wbGV0ZTtcblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCByZWxhdGl2ZSB0byB0aGUgdHJpZ2dlciBlbGVtZW50LiBBIHBvc2l0aW9uIG9mIGBhdXRvYFxuICAgKiB3aWxsIHJlbmRlciB0aGUgcGFuZWwgdW5kZXJuZWF0aCB0aGUgdHJpZ2dlciBpZiB0aGVyZSBpcyBlbm91Z2ggc3BhY2UgZm9yIGl0IHRvIGZpdCBpblxuICAgKiB0aGUgdmlld3BvcnQsIG90aGVyd2lzZSB0aGUgcGFuZWwgd2lsbCBiZSBzaG93biBhYm92ZSBpdC4gSWYgdGhlIHBvc2l0aW9uIGlzIHNldCB0b1xuICAgKiBgYWJvdmVgIG9yIGBiZWxvd2AsIHRoZSBwYW5lbCB3aWxsIGFsd2F5cyBiZSBzaG93biBhYm92ZSBvciBiZWxvdyB0aGUgdHJpZ2dlci4gbm8gbWF0dGVyXG4gICAqIHdoZXRoZXIgaXQgZml0cyBjb21wbGV0ZWx5IGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlUG9zaXRpb24nKSBwb3NpdGlvbjogJ2F1dG8nIHwgJ2Fib3ZlJyB8ICdiZWxvdycgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSByZWxhdGl2ZSB0byB3aGljaCB0byBwb3NpdGlvbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLlxuICAgKiBEZWZhdWx0cyB0byB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlQ29ubmVjdGVkVG8nKSBjb25uZWN0ZWRUbzogTWF0QXV0b2NvbXBsZXRlT3JpZ2luO1xuXG4gIC8qKlxuICAgKiBgYXV0b2NvbXBsZXRlYCBhdHRyaWJ1dGUgdG8gYmUgc2V0IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2F1dG9jb21wbGV0ZScpIGF1dG9jb21wbGV0ZUF0dHJpYnV0ZTogc3RyaW5nID0gJ29mZic7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBpcyBkaXNhYmxlZC4gV2hlbiBkaXNhYmxlZCwgdGhlIGVsZW1lbnQgd2lsbFxuICAgKiBhY3QgYXMgYSByZWd1bGFyIGlucHV0IGFuZCB0aGUgdXNlciB3b24ndCBiZSBhYmxlIHRvIG9wZW4gdGhlIHBhbmVsLlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVEaXNhYmxlZCcpXG4gIGdldCBhdXRvY29tcGxldGVEaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkOyB9XG4gIHNldCBhdXRvY29tcGxldGVEaXNhYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sIHByaXZhdGUgX292ZXJsYXk6IE92ZXJsYXksXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3pvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgX2Zvcm1GaWVsZDogTWF0Rm9ybUZpZWxkLFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIE1ha2UgYF92aWV3cG9ydFJ1bGVyYCByZXF1aXJlZC5cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcj86IFZpZXdwb3J0UnVsZXIpIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChfc3VwcG9ydHNTaGFkb3dEb20oKSkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICBjb25zdCByb290Tm9kZSA9IGVsZW1lbnQuZ2V0Um9vdE5vZGUgPyBlbGVtZW50LmdldFJvb3ROb2RlKCkgOiBudWxsO1xuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdGFrZSB0aGUgYFNoYWRvd1Jvb3RgIG9mZiBvZiBgd2luZG93YCwgYmVjYXVzZSB0aGUgYnVpbHQtaW4gdHlwZXMgYXJlXG4gICAgICAgIC8vIGluY29ycmVjdC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjc5MjkuXG4gICAgICAgIHRoaXMuX2lzSW5zaWRlU2hhZG93Um9vdCA9IHJvb3ROb2RlIGluc3RhbmNlb2YgKHdpbmRvdyBhcyBhbnkpLlNoYWRvd1Jvb3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fY29tcG9uZW50RGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLl9kZXN0cm95UGFuZWwoKTtcbiAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiYgdGhpcy5hdXRvY29tcGxldGUuc2hvd1BhbmVsO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXlBdHRhY2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBPcGVucyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIG9wZW5QYW5lbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9hdHRhY2hPdmVybGF5KCk7XG4gICAgdGhpcy5fZmxvYXRMYWJlbCgpO1xuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIGNsb3NlUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzZXRMYWJlbCgpO1xuXG4gICAgaWYgKCF0aGlzLl9vdmVybGF5QXR0YWNoZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIC8vIE9ubHkgZW1pdCBpZiB0aGUgcGFuZWwgd2FzIHZpc2libGUuXG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgIH1cblxuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSB0aGlzLl9vdmVybGF5QXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmICYmIHRoaXMuX292ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2goKTtcbiAgICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IGluIHNvbWUgY2FzZXMgdGhpcyBjYW4gZW5kIHVwIGJlaW5nIGNhbGxlZCBhZnRlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICAvLyBBZGQgYSBjaGVjayB0byBlbnN1cmUgdGhhdCB3ZSBkb24ndCB0cnkgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24gb24gYSBkZXN0cm95ZWQgdmlldy5cbiAgICBpZiAoIXRoaXMuX2NvbXBvbmVudERlc3Ryb3llZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHksIGJlY2F1c2VcbiAgICAgIC8vIGBmcm9tRXZlbnRgIGRvZXNuJ3Qgc2VlbSB0byBkbyBpdCBhdCB0aGUgcHJvcGVyIHRpbWUuXG4gICAgICAvLyBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgbGFiZWwgaXMgcmVzZXQgd2hlbiB0aGVcbiAgICAgIC8vIHVzZXIgY2xpY2tzIG91dHNpZGUuXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbCB0byBlbnN1cmUgdGhhdCBpdCBmaXRzIGFsbCBvcHRpb25zXG4gICAqIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0cmVhbSBvZiBhY3Rpb25zIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwsIGluY2x1ZGluZ1xuICAgKiB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZCwgb24gYmx1ciwgYW5kIHdoZW4gVEFCIGlzIHByZXNzZWQuXG4gICAqL1xuICBnZXQgcGFuZWxDbG9zaW5nQWN0aW9ucygpOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZXxudWxsPiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25zLFxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpLFxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbSxcbiAgICAgIHRoaXMuX2dldE91dHNpZGVDbGlja1N0cmVhbSgpLFxuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA/XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpIDpcbiAgICAgICAgICBvYnNlcnZhYmxlT2YoKVxuICAgICkucGlwZShcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgb3V0cHV0IHNvIHdlIHJldHVybiBhIGNvbnNpc3RlbnQgdHlwZS5cbiAgICAgIG1hcChldmVudCA9PiBldmVudCBpbnN0YW5jZW9mIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSA/IGV2ZW50IDogbnVsbClcbiAgICApO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBhdXRvY29tcGxldGUgb3B0aW9uIHNlbGVjdGlvbnMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbnM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucykge1xuICAgICByZXR1cm4gbWVyZ2UoLi4udGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgc3Vic2NyaWJlcnMgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLCB0aGUgYGF1dG9jb21wbGV0ZWAgd2lsbCBiZSB1bmRlZmluZWQuXG4gICAgLy8gUmV0dXJuIGEgc3RyZWFtIHRoYXQgd2UnbGwgcmVwbGFjZSB3aXRoIHRoZSByZWFsIG9uZSBvbmNlIGV2ZXJ5dGhpbmcgaXMgaW4gcGxhY2UuXG4gICAgcmV0dXJuIHRoaXMuX3pvbmUub25TdGFibGVcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKHRha2UoMSksIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm9wdGlvblNlbGVjdGlvbnMpKTtcbiAgfSkgYXMgT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+O1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBvcHRpb24sIGNvZXJjZWQgdG8gTWF0T3B0aW9uIHR5cGUuICovXG4gIGdldCBhY3RpdmVPcHRpb24oKTogTWF0T3B0aW9uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlICYmIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgICAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgICAgICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAndG91Y2hlbmQnKSBhcyBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+KVxuICAgICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAgIC8vIElmIHdlJ3JlIGluIHRoZSBTaGFkb3cgRE9NLCB0aGUgZXZlbnQgdGFyZ2V0IHdpbGwgYmUgdGhlIHNoYWRvdyByb290LCBzbyB3ZSBoYXZlIHRvXG4gICAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGNoZWNrIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBwYXRoIG9mIHRoZSBjbGljayBldmVudC5cbiAgICAgICAgICBjb25zdCBjbGlja1RhcmdldCA9XG4gICAgICAgICAgICAgICh0aGlzLl9pc0luc2lkZVNoYWRvd1Jvb3QgJiYgZXZlbnQuY29tcG9zZWRQYXRoID8gZXZlbnQuY29tcG9zZWRQYXRoKClbMF0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3QgZm9ybUZpZWxkID0gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX292ZXJsYXlBdHRhY2hlZCAmJiBjbGlja1RhcmdldCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgICAgICghZm9ybUZpZWxkIHx8ICFmb3JtRmllbGQuY29udGFpbnMoY2xpY2tUYXJnZXQpKSAmJlxuICAgICAgICAgICAgICAoISF0aGlzLl9vdmVybGF5UmVmICYmICF0aGlzLl9vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSk7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIFByb21pc2UucmVzb2x2ZShudWxsKS50aGVuKCgpID0+IHRoaXMuX3NldFRyaWdnZXJWYWx1ZSh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiBvbiBhbGwgZXNjYXBlIGtleSBwcmVzc2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5IHRvIGJyaW5nIElFXG4gICAgLy8gaW4gbGluZSB3aXRoIG90aGVyIGJyb3dzZXJzLiBCeSBkZWZhdWx0LCBwcmVzc2luZyBlc2NhcGUgb24gSUUgd2lsbCBjYXVzZSBpdCB0byByZXZlcnRcbiAgICAvLyB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGF0IGl0IGhhZCBvbiBmb2N1cywgaG93ZXZlciBpdCB3b24ndCBkaXNwYXRjaCBhbnkgZXZlbnRzXG4gICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgbW9kZWwgdmFsdWUgd2lsbCBiZSBvdXQgb2Ygc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgIGlmIChrZXlDb2RlID09PSBFU0NBUEUpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWN0aXZlT3B0aW9uICYmIGtleUNvZGUgPT09IEVOVEVSICYmIHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9wdGlvbi5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBjb25zdCBwcmV2QWN0aXZlSXRlbSA9IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgICAgaWYgKHRoaXMucGFuZWxPcGVuIHx8IGtleUNvZGUgPT09IFRBQikge1xuICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgfSBlbHNlIGlmIChpc0Fycm93S2V5ICYmIHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNBcnJvd0tleSB8fCB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtICE9PSBwcmV2QWN0aXZlSXRlbSkge1xuICAgICAgICB0aGlzLl9zY3JvbGxUb09wdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBsZXQgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAvLyBCYXNlZCBvbiBgTnVtYmVyVmFsdWVBY2Nlc3NvcmAgZnJvbSBmb3Jtcy5cbiAgICBpZiAodGFyZ2V0LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbnB1dCBoYXMgYSBwbGFjZWhvbGRlciwgSUUgd2lsbCBmaXJlIHRoZSBgaW5wdXRgIGV2ZW50IG9uIHBhZ2UgbG9hZCxcbiAgICAvLyBmb2N1cyBhbmQgYmx1ciwgaW4gYWRkaXRpb24gdG8gd2hlbiB0aGUgdXNlciBhY3R1YWxseSBjaGFuZ2VkIHRoZSB2YWx1ZS4gVG9cbiAgICAvLyBmaWx0ZXIgb3V0IGFsbCBvZiB0aGUgZXh0cmEgZXZlbnRzLCB3ZSBzYXZlIHRoZSB2YWx1ZSBvbiBmb2N1cyBhbmQgYmV0d2VlblxuICAgIC8vIGBpbnB1dGAgZXZlbnRzLCBhbmQgd2UgY2hlY2sgd2hldGhlciBpdCBjaGFuZ2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84ODU3NDcvXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzKSB7XG4gICAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fYXR0YWNoT3ZlcmxheSgpO1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW4gXCJhdXRvXCIgbW9kZSwgdGhlIGxhYmVsIHdpbGwgYW5pbWF0ZSBkb3duIGFzIHNvb24gYXMgZm9jdXMgaXMgbG9zdC5cbiAgICogVGhpcyBjYXVzZXMgdGhlIHZhbHVlIHRvIGp1bXAgd2hlbiBzZWxlY3RpbmcgYW4gb3B0aW9uIHdpdGggdGhlIG1vdXNlLlxuICAgKiBUaGlzIG1ldGhvZCBtYW51YWxseSBmbG9hdHMgdGhlIGxhYmVsIHVudGlsIHRoZSBwYW5lbCBjYW4gYmUgY2xvc2VkLlxuICAgKiBAcGFyYW0gc2hvdWxkQW5pbWF0ZSBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYmUgYW5pbWF0ZWQgd2hlbiBpdCBpcyBmbG9hdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZmxvYXRMYWJlbChzaG91bGRBbmltYXRlID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9ybUZpZWxkICYmIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID09PSAnYXV0bycpIHtcbiAgICAgIGlmIChzaG91bGRBbmltYXRlKSB7XG4gICAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fYW5pbWF0ZUFuZExvY2tMYWJlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYWx3YXlzJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogSWYgdGhlIGxhYmVsIGhhcyBiZWVuIG1hbnVhbGx5IGVsZXZhdGVkLCByZXR1cm4gaXQgdG8gaXRzIG5vcm1hbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRMYWJlbCgpOiB2b2lkICB7XG4gICAgaWYgKHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYXV0byc7XG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdGhhdCB3ZSBhcmUgbm90IGFjdHVhbGx5IGZvY3VzaW5nIGFjdGl2ZSBvcHRpb25zLCB3ZSBtdXN0IG1hbnVhbGx5IGFkanVzdCBzY3JvbGxcbiAgICogdG8gcmV2ZWFsIG9wdGlvbnMgYmVsb3cgdGhlIGZvbGQuIEZpcnN0LCB3ZSBmaW5kIHRoZSBvZmZzZXQgb2YgdGhlIG9wdGlvbiBmcm9tIHRoZSB0b3BcbiAgICogb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBiZWxvdyB0aGUgZm9sZCwgdGhlIG5ldyBzY3JvbGxUb3Agd2lsbCBiZSB0aGUgb2Zmc2V0IC1cbiAgICogdGhlIHBhbmVsIGhlaWdodCArIHRoZSBvcHRpb24gaGVpZ2h0LCBzbyB0aGUgYWN0aXZlIG9wdGlvbiB3aWxsIGJlIGp1c3QgdmlzaWJsZSBhdCB0aGVcbiAgICogYm90dG9tIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYWJvdmUgdGhlIHRvcCBvZiB0aGUgdmlzaWJsZSBwYW5lbCwgdGhlIG5ldyBzY3JvbGxUb3BcbiAgICogd2lsbCBiZWNvbWUgdGhlIG9mZnNldC4gSWYgdGhhdCBvZmZzZXQgaXMgdmlzaWJsZSB3aXRoaW4gdGhlIHBhbmVsIGFscmVhZHksIHRoZSBzY3JvbGxUb3AgaXNcbiAgICogbm90IGFkanVzdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG9PcHRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMDtcbiAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oaW5kZXgsXG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMsIHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbkdyb3Vwcyk7XG5cbiAgICBjb25zdCBuZXdTY3JvbGxQb3NpdGlvbiA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgIGluZGV4ICsgbGFiZWxDb3VudCxcbiAgICAgIEFVVE9DT01QTEVURV9PUFRJT05fSEVJR0hULFxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2dldFNjcm9sbFRvcCgpLFxuICAgICAgQVVUT0NPTVBMRVRFX1BBTkVMX0hFSUdIVFxuICAgICk7XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0U2Nyb2xsVG9wKG5ld1Njcm9sbFBvc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBsaXN0ZW5zIHRvIGEgc3RyZWFtIG9mIHBhbmVsIGNsb3NpbmcgYWN0aW9ucyBhbmQgcmVzZXRzIHRoZVxuICAgKiBzdHJlYW0gZXZlcnkgdGltZSB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBmaXJzdFN0YWJsZSA9IHRoaXMuX3pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKTtcbiAgICBjb25zdCBvcHRpb25DaGFuZ2VzID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICB0YXAoKCkgPT4gdGhpcy5fcG9zaXRpb25TdHJhdGVneS5yZWFwcGx5TGFzdFBvc2l0aW9uKCkpLFxuICAgICAgLy8gRGVmZXIgZW1pdHRpbmcgdG8gdGhlIHN0cmVhbSB1bnRpbCB0aGUgbmV4dCB0aWNrLCBiZWNhdXNlIGNoYW5naW5nXG4gICAgICAvLyBiaW5kaW5ncyBpbiBoZXJlIHdpbGwgY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgICBkZWxheSgwKVxuICAgICk7XG5cbiAgICAvLyBXaGVuIHRoZSB6b25lIGlzIHN0YWJsZSBpbml0aWFsbHksIGFuZCB3aGVuIHRoZSBvcHRpb24gbGlzdCBjaGFuZ2VzLi4uXG4gICAgcmV0dXJuIG1lcmdlKGZpcnN0U3RhYmxlLCBvcHRpb25DaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBzdHJlYW0gb2YgcGFuZWxDbG9zaW5nQWN0aW9ucywgcmVwbGFjaW5nIGFueSBwcmV2aW91cyBzdHJlYW1zXG4gICAgICAgICAgICAvLyB0aGF0IHdlcmUgY3JlYXRlZCwgYW5kIGZsYXR0ZW4gaXQgc28gb3VyIHN0cmVhbSBvbmx5IGVtaXRzIGNsb3NpbmcgZXZlbnRzLi4uXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG4gICAgICAgICAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0VmlzaWJpbGl0eSgpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgYHBhbmVsT3BlbmAgc3RhdGUgY2hhbmdlZCwgd2UgbmVlZCB0byBtYWtlIHN1cmUgdG8gZW1pdCB0aGUgYG9wZW5lZGBcbiAgICAgICAgICAgICAgICAvLyBldmVudCwgYmVjYXVzZSB3ZSBtYXkgbm90IGhhdmUgZW1pdHRlZCBpdCB3aGVuIHRoZSBwYW5lbCB3YXMgYXR0YWNoZWQuIFRoaXNcbiAgICAgICAgICAgICAgICAvLyBjYW4gaGFwcGVuIGlmIHRoZSB1c2VycyBvcGVucyB0aGUgcGFuZWwgYW5kIHRoZXJlIGFyZSBubyBvcHRpb25zLCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gb3B0aW9ucyBjb21lIGluIHNsaWdodGx5IGxhdGVyIG9yIGFzIGEgcmVzdWx0IG9mIHRoZSB2YWx1ZSBjaGFuZ2luZy5cbiAgICAgICAgICAgICAgICBpZiAod2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wZW5lZC5lbWl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxDbG9zaW5nQWN0aW9ucztcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgLy8gd2hlbiB0aGUgZmlyc3QgY2xvc2luZyBldmVudCBvY2N1cnMuLi5cbiAgICAgICAgICAgIHRha2UoMSkpXG4gICAgICAgIC8vIHNldCB0aGUgdmFsdWUsIGNsb3NlIHRoZSBwYW5lbCwgYW5kIGNvbXBsZXRlLlxuICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQpKTtcbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQYW5lbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldFRyaWdnZXJWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdG9EaXNwbGF5ID0gdGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUuZGlzcGxheVdpdGggP1xuICAgICAgdGhpcy5hdXRvY29tcGxldGUuZGlzcGxheVdpdGgodmFsdWUpIDpcbiAgICAgIHZhbHVlO1xuXG4gICAgLy8gU2ltcGx5IGZhbGxpbmcgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIGRpc3BsYXkgdmFsdWUgaXMgZmFsc3kgZG9lcyBub3Qgd29yayBwcm9wZXJseS5cbiAgICAvLyBUaGUgZGlzcGxheSB2YWx1ZSBjYW4gYWxzbyBiZSB0aGUgbnVtYmVyIHplcm8gYW5kIHNob3VsZG4ndCBmYWxsIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nLlxuICAgIGNvbnN0IGlucHV0VmFsdWUgPSB0b0Rpc3BsYXkgIT0gbnVsbCA/IHRvRGlzcGxheSA6ICcnO1xuXG4gICAgLy8gSWYgaXQncyB1c2VkIHdpdGhpbiBhIGBNYXRGb3JtRmllbGRgLCB3ZSBzaG91bGQgc2V0IGl0IHRocm91Z2ggdGhlIHByb3BlcnR5IHNvIGl0IGNhbiBnb1xuICAgIC8vIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICBpZiAodGhpcy5fZm9ybUZpZWxkKSB7XG4gICAgICB0aGlzLl9mb3JtRmllbGQuX2NvbnRyb2wudmFsdWUgPSBpbnB1dFZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBpbnB1dFZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX3ByZXZpb3VzVmFsdWUgPSBpbnB1dFZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNsb3NlcyB0aGUgcGFuZWwsIGFuZCBpZiBhIHZhbHVlIGlzIHNwZWNpZmllZCwgYWxzbyBzZXRzIHRoZSBhc3NvY2lhdGVkXG4gICAqIGNvbnRyb2wgdG8gdGhhdCB2YWx1ZS4gSXQgd2lsbCBhbHNvIG1hcmsgdGhlIGNvbnRyb2wgYXMgZGlydHkgaWYgdGhpcyBpbnRlcmFjdGlvblxuICAgKiBzdGVtbWVkIGZyb20gdGhlIHVzZXIuXG4gICAqL1xuICBwcml2YXRlIF9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50OiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKGV2ZW50ICYmIGV2ZW50LnNvdXJjZSkge1xuICAgICAgdGhpcy5fY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKGV2ZW50LnNvdXJjZSk7XG4gICAgICB0aGlzLl9zZXRUcmlnZ2VyVmFsdWUoZXZlbnQuc291cmNlLnZhbHVlKTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKGV2ZW50LnNvdXJjZS52YWx1ZSk7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9lbWl0U2VsZWN0RXZlbnQoZXZlbnQuc291cmNlKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbnkgcHJldmlvdXMgc2VsZWN0ZWQgb3B0aW9uIGFuZCBlbWl0IGEgc2VsZWN0aW9uIGNoYW5nZSBldmVudCBmb3IgdGhpcyBvcHRpb25cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihza2lwOiBNYXRPcHRpb24pIHtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24gIT0gc2tpcCAmJiBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hdHRhY2hPdmVybGF5KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUpIHtcbiAgICAgIHRocm93IGdldE1hdEF1dG9jb21wbGV0ZU1pc3NpbmdQYW5lbEVycm9yKCk7XG4gICAgfVxuXG4gICAgbGV0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuXG4gICAgaWYgKCFvdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5hdXRvY29tcGxldGUudGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcblxuICAgICAgLy8gVXNlIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gdGFrZSBhZHZhbnRhZ2Ugb2ZcbiAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAvLyBDbG9zZSB3aGVuIHByZXNzaW5nIEVTQ0FQRSBvciBBTFQgKyBVUF9BUlJPVywgYmFzZWQgb24gdGhlIGExMXkgZ3VpZGVsaW5lcy5cbiAgICAgICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFIHx8IChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyAmJiBldmVudC5hbHRLZXkpKSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24sIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBldmVudHVhbGx5XG4gICAgICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLl92aWV3cG9ydFJ1bGVyKSB7XG4gICAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiBvdmVybGF5UmVmKSB7XG4gICAgICAgICAgICBvdmVybGF5UmVmLnVwZGF0ZVNpemUoe3dpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCl9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVcGRhdGUgdGhlIHRyaWdnZXIsIHBhbmVsIHdpZHRoIGFuZCBkaXJlY3Rpb24sIGluIGNhc2UgYW55dGhpbmcgaGFzIGNoYW5nZWQuXG4gICAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5LnNldE9yaWdpbih0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpO1xuICAgICAgb3ZlcmxheVJlZi51cGRhdGVTaXplKHt3aWR0aDogdGhpcy5fZ2V0UGFuZWxXaWR0aCgpfSk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJsYXlSZWYgJiYgIW92ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fcG9ydGFsKTtcbiAgICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uID0gdGhpcy5fc3Vic2NyaWJlVG9DbG9zaW5nQWN0aW9ucygpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcblxuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRWaXNpYmlsaXR5KCk7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX2lzT3BlbiA9IHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IHRydWU7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIGFuIGV4dHJhIGBwYW5lbE9wZW5gIGNoZWNrIGluIGhlcmUsIGJlY2F1c2UgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHdvbid0IGJlIHNob3duIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiB3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5hdXRvY29tcGxldGUub3BlbmVkLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKCk6IE92ZXJsYXlDb25maWcge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9nZXRPdmVybGF5UG9zaXRpb24oKSxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgd2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5UG9zaXRpb24oKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2dldENvbm5lY3RlZEVsZW1lbnQoKSlcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhQdXNoKGZhbHNlKTtcblxuICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHN0cmF0ZWd5KTtcbiAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgcmV0dXJuIHN0cmF0ZWd5O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvbiBhIHBvc2l0aW9uIHN0cmF0ZWd5IGJhc2VkIG9uIHRoZSBkaXJlY3RpdmUncyBpbnB1dCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc2V0U3RyYXRlZ3lQb3NpdGlvbnMocG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgY29uc3QgYmVsb3dQb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24gPSB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ2JvdHRvbScsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAndG9wJ1xuICAgIH07XG4gICAgY29uc3QgYWJvdmVQb3NpdGlvbjogQ29ubmVjdGVkUG9zaXRpb24gPSB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAnYm90dG9tJyxcblxuICAgICAgLy8gVGhlIG92ZXJsYXkgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIHRyaWdnZXIgc2hvdWxkIGhhdmUgc3F1YXJlZCBjb3JuZXJzLCB3aGlsZVxuICAgICAgLy8gdGhlIG9wcG9zaXRlIGVuZCBoYXMgcm91bmRlZCBjb3JuZXJzLiBXZSBhcHBseSBhIENTUyBjbGFzcyB0byBzd2FwIHRoZVxuICAgICAgLy8gYm9yZGVyLXJhZGl1cyBiYXNlZCBvbiB0aGUgb3ZlcmxheSBwb3NpdGlvbi5cbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtYXV0b2NvbXBsZXRlLXBhbmVsLWFib3ZlJ1xuICAgIH07XG5cbiAgICBsZXQgcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdO1xuXG4gICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdhYm92ZScpIHtcbiAgICAgIHBvc2l0aW9ucyA9IFthYm92ZVBvc2l0aW9uXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIHBvc2l0aW9ucyA9IFtiZWxvd1Bvc2l0aW9uXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25zID0gW2JlbG93UG9zaXRpb24sIGFib3ZlUG9zaXRpb25dO1xuICAgIH1cblxuICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29ubmVjdGVkRWxlbWVudCgpOiBFbGVtZW50UmVmIHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWRUbykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkVG8uZWxlbWVudFJlZjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9nZXRQYW5lbFdpZHRoKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLnBhbmVsV2lkdGggfHwgdGhpcy5fZ2V0SG9zdFdpZHRoKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIGlucHV0IGVsZW1lbnQsIHNvIHRoZSBwYW5lbCB3aWR0aCBjYW4gbWF0Y2ggaXQuICovXG4gIHByaXZhdGUgX2dldEhvc3RXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGFjdGl2ZSBpdGVtIHRvIC0xIHNvIGFycm93IGV2ZW50cyB3aWxsIGFjdGl2YXRlIHRoZVxuICAgKiBjb3JyZWN0IG9wdGlvbnMsIG9yIHRvIDAgaWYgdGhlIGNvbnN1bWVyIG9wdGVkIGludG8gaXQuXG4gICAqL1xuICBwcml2YXRlIF9yZXNldEFjdGl2ZUl0ZW0oKTogdm9pZCB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLmF1dG9jb21wbGV0ZS5hdXRvQWN0aXZlRmlyc3RPcHRpb24gPyAwIDogLTEpO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFuZWwgY2FuIGJlIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfY2FuT3BlbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHJldHVybiAhZWxlbWVudC5yZWFkT25seSAmJiAhZWxlbWVudC5kaXNhYmxlZCAmJiAhdGhpcy5fYXV0b2NvbXBsZXRlRGlzYWJsZWQ7XG4gIH1cbn1cbiJdfQ==