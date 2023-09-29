/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { addAriaReferencedId, removeAriaReferencedId } from '@angular/cdk/a11y';
import { booleanAttribute, ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { _getEventTarget } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition, } from '@angular/material/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { defer, fromEvent, merge, of as observableOf, Subject, Subscription } from 'rxjs';
import { delay, filter, map, switchMap, take, tap, startWith } from 'rxjs/operators';
import { MatAutocompleteOrigin } from './autocomplete-origin';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatAutocomplete, } from './autocomplete';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/scrolling";
import * as i4 from "@angular/material/form-field";
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * @docs-private
 */
export const MAT_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatAutocompleteTrigger),
    multi: true,
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @docs-private
 */
export function getMatAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `mat-autocomplete`. ' +
        'Make sure that the id passed to the `matAutocomplete` is correct and that ' +
        "you're attempting to open it after the ngAfterContentInit hook.");
}
/** Injection token that determines the scroll handling while the autocomplete panel is open. */
export const MAT_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('mat-autocomplete-scroll-strategy');
/** @docs-private */
export function MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** @docs-private */
export const MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY,
};
/** Base class with all of the `MatAutocompleteTrigger` functionality. */
export class MatAutocompleteTrigger {
    constructor(_element, _overlay, _viewContainerRef, _zone, _changeDetectorRef, scrollStrategy, _dir, _formField, _document, _viewportRuler, _defaults) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._zone = _zone;
        this._changeDetectorRef = _changeDetectorRef;
        this._dir = _dir;
        this._formField = _formField;
        this._document = _document;
        this._viewportRuler = _viewportRuler;
        this._defaults = _defaults;
        this._componentDestroyed = false;
        /** Whether or not the label state is being overridden. */
        this._manuallyFloatingLabel = false;
        /** Subscription to viewport size changes. */
        this._viewportSubscription = Subscription.EMPTY;
        /**
         * Whether the autocomplete can open the next time it is focused. Used to prevent a focused,
         * closed autocomplete from being reopened if the user switches to another browser tab and then
         * comes back.
         */
        this._canOpenOnNextFocus = true;
        /** Stream of keyboard events that can close the panel. */
        this._closeKeyEventStream = new Subject();
        /**
         * Event handler for when the window is blurred. Needs to be an
         * arrow function in order to preserve the context.
         */
        this._windowBlurHandler = () => {
            // If the user blurred the window while the autocomplete is focused, it means that it'll be
            // refocused when they come back. In this case we want to skip the first focus event, if the
            // pane was closed, in order to avoid reopening it unintentionally.
            this._canOpenOnNextFocus =
                this._document.activeElement !== this._element.nativeElement || this.panelOpen;
        };
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when autocomplete has been touched` */
        this._onTouched = () => { };
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
         * @docs-private
         */
        this.autocompleteAttribute = 'off';
        /** Class to apply to the panel when it's above the input. */
        this._aboveClass = 'mat-mdc-autocomplete-panel-above';
        this._overlayAttached = false;
        /** Stream of changes to the selection state of the autocomplete options. */
        this.optionSelections = defer(() => {
            const options = this.autocomplete ? this.autocomplete.options : null;
            if (options) {
                return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))));
            }
            // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
            // Return a stream that we'll replace with the real one once everything is in place.
            return this._zone.onStable.pipe(take(1), switchMap(() => this.optionSelections));
        });
        /** Handles keyboard events coming from the overlay panel. */
        this._handlePanelKeydown = (event) => {
            // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
            // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
            if ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                (event.keyCode === UP_ARROW && hasModifierKey(event, 'altKey'))) {
                // If the user had typed something in before we autoselected an option, and they decided
                // to cancel the selection, restore the input value to the one they had typed in.
                if (this._pendingAutoselectedOption) {
                    this._updateNativeInputValue(this._valueBeforeAutoSelection ?? '');
                    this._pendingAutoselectedOption = null;
                }
                this._closeKeyEventStream.next();
                this._resetActiveItem();
                // We need to stop propagation, otherwise the event will eventually
                // reach the input itself and cause the overlay to be reopened.
                event.stopPropagation();
                event.preventDefault();
            }
        };
        /**
         * Track which modal we have modified the `aria-owns` attribute of. When the combobox trigger is
         * inside an aria-modal, we apply aria-owns to the parent modal with the `id` of the options
         * panel. Track the modal we have changed so we can undo the changes on destroy.
         */
        this._trackedModal = null;
        this._scrollStrategy = scrollStrategy;
    }
    ngAfterViewInit() {
        const window = this._getWindow();
        if (typeof window !== 'undefined') {
            this._zone.runOutsideAngular(() => window.addEventListener('blur', this._windowBlurHandler));
        }
    }
    ngOnChanges(changes) {
        if (changes['position'] && this._positionStrategy) {
            this._setStrategyPositions(this._positionStrategy);
            if (this.panelOpen) {
                this._overlayRef.updatePosition();
            }
        }
    }
    ngOnDestroy() {
        const window = this._getWindow();
        if (typeof window !== 'undefined') {
            window.removeEventListener('blur', this._windowBlurHandler);
        }
        this._viewportSubscription.unsubscribe();
        this._componentDestroyed = true;
        this._destroyPanel();
        this._closeKeyEventStream.complete();
        this._clearFromModal();
    }
    /** Whether or not the autocomplete panel is open. */
    get panelOpen() {
        return this._overlayAttached && this.autocomplete.showPanel;
    }
    /** Opens the autocomplete suggestion panel. */
    openPanel() {
        this._attachOverlay();
        this._floatLabel();
    }
    /** Closes the autocomplete suggestion panel. */
    closePanel() {
        this._resetLabel();
        if (!this._overlayAttached) {
            return;
        }
        if (this.panelOpen) {
            // Only emit if the panel was visible.
            // The `NgZone.onStable` always emits outside of the Angular zone,
            // so all the subscriptions from `_subscribeToClosingActions()` are also outside of the Angular zone.
            // We should manually run in Angular zone to update UI after panel closing.
            this._zone.run(() => {
                this.autocomplete.closed.emit();
            });
        }
        this.autocomplete._isOpen = this._overlayAttached = false;
        this._pendingAutoselectedOption = null;
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._closingActionsSubscription.unsubscribe();
        }
        this._updatePanelState();
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
     */
    updatePosition() {
        if (this._overlayAttached) {
            this._overlayRef.updatePosition();
        }
    }
    /**
     * A stream of actions that should close the autocomplete panel, including
     * when an option is selected, on blur, and when TAB is pressed.
     */
    get panelClosingActions() {
        return merge(this.optionSelections, this.autocomplete._keyManager.tabOut.pipe(filter(() => this._overlayAttached)), this._closeKeyEventStream, this._getOutsideClickStream(), this._overlayRef
            ? this._overlayRef.detachments().pipe(filter(() => this._overlayAttached))
            : observableOf()).pipe(
        // Normalize the output so we return a consistent type.
        map(event => (event instanceof MatOptionSelectionChange ? event : null)));
    }
    /** The currently active option, coerced to MatOption type. */
    get activeOption() {
        if (this.autocomplete && this.autocomplete._keyManager) {
            return this.autocomplete._keyManager.activeItem;
        }
        return null;
    }
    /** Stream of clicks outside of the autocomplete panel. */
    _getOutsideClickStream() {
        return merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'auxclick'), fromEvent(this._document, 'touchend')).pipe(filter(event => {
            // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
            // fall back to check the first element in the path of the click event.
            const clickTarget = _getEventTarget(event);
            const formField = this._formField ? this._formField._elementRef.nativeElement : null;
            const customOrigin = this.connectedTo ? this.connectedTo.elementRef.nativeElement : null;
            return (this._overlayAttached &&
                clickTarget !== this._element.nativeElement &&
                // Normally focus moves inside `mousedown` so this condition will almost always be
                // true. Its main purpose is to handle the case where the input is focused from an
                // outside click which propagates up to the `body` listener within the same sequence
                // and causes the panel to close immediately (see #3106).
                this._document.activeElement !== this._element.nativeElement &&
                (!formField || !formField.contains(clickTarget)) &&
                (!customOrigin || !customOrigin.contains(clickTarget)) &&
                !!this._overlayRef &&
                !this._overlayRef.overlayElement.contains(clickTarget));
        }));
    }
    // Implemented as part of ControlValueAccessor.
    writeValue(value) {
        Promise.resolve(null).then(() => this._assignOptionValue(value));
    }
    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn) {
        this._onChange = fn;
    }
    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled) {
        this._element.nativeElement.disabled = isDisabled;
    }
    _handleKeydown(event) {
        const keyCode = event.keyCode;
        const hasModifier = hasModifierKey(event);
        // Prevent the default action on all escape key presses. This is here primarily to bring IE
        // in line with other browsers. By default, pressing escape on IE will cause it to revert
        // the input value to the one that it had on focus, however it won't dispatch any events
        // which means that the model value will be out of sync with the view.
        if (keyCode === ESCAPE && !hasModifier) {
            event.preventDefault();
        }
        if (this.activeOption && keyCode === ENTER && this.panelOpen && !hasModifier) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else if (this.autocomplete) {
            const prevActiveItem = this.autocomplete._keyManager.activeItem;
            const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
            if (keyCode === TAB || (isArrowKey && !hasModifier && this.panelOpen)) {
                this.autocomplete._keyManager.onKeydown(event);
            }
            else if (isArrowKey && this._canOpen()) {
                this.openPanel();
            }
            if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
                this._scrollToOption(this.autocomplete._keyManager.activeItemIndex || 0);
                if (this.autocomplete.autoSelectActiveOption && this.activeOption) {
                    if (!this._pendingAutoselectedOption) {
                        this._valueBeforeAutoSelection = this._element.nativeElement.value;
                    }
                    this._pendingAutoselectedOption = this.activeOption;
                    this._assignOptionValue(this.activeOption.value);
                }
            }
        }
    }
    _handleInput(event) {
        let target = event.target;
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
            this._pendingAutoselectedOption = null;
            // If selection is required we don't write to the CVA while the user is typing.
            // At the end of the selection either the user will have picked something
            // or we'll reset the value back to null.
            if (!this.autocomplete || !this.autocomplete.requireSelection) {
                this._onChange(value);
            }
            if (!value) {
                this._clearPreviousSelectedOption(null, false);
            }
            if (this._canOpen() && this._document.activeElement === event.target) {
                this.openPanel();
            }
        }
    }
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
    _handleClick() {
        if (this._canOpen() && !this.panelOpen) {
            this.openPanel();
        }
    }
    /**
     * In "auto" mode, the label will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the label until the panel can be closed.
     * @param shouldAnimate Whether the label should be animated when it is floated.
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
    /** If the label has been manually elevated, return it to its normal state. */
    _resetLabel() {
        if (this._manuallyFloatingLabel) {
            if (this._formField) {
                this._formField.floatLabel = 'auto';
            }
            this._manuallyFloatingLabel = false;
        }
    }
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    _subscribeToClosingActions() {
        const firstStable = this._zone.onStable.pipe(take(1));
        const optionChanges = this.autocomplete.options.changes.pipe(tap(() => this._positionStrategy.reapplyLastPosition()), 
        // Defer emitting to the stream until the next tick, because changing
        // bindings in here will cause "changed after checked" errors.
        delay(0));
        // When the zone is stable initially, and when the option list changes...
        return (merge(firstStable, optionChanges)
            .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => {
            // The `NgZone.onStable` always emits outside of the Angular zone, thus we have to re-enter
            // the Angular zone. This will lead to change detection being called outside of the Angular
            // zone and the `autocomplete.opened` will also emit outside of the Angular.
            this._zone.run(() => {
                const wasOpen = this.panelOpen;
                this._resetActiveItem();
                this._updatePanelState();
                this._changeDetectorRef.detectChanges();
                if (this.panelOpen) {
                    this._overlayRef.updatePosition();
                }
                if (wasOpen !== this.panelOpen) {
                    // If the `panelOpen` state changed, we need to make sure to emit the `opened` or
                    // `closed` event, because we may not have emitted it. This can happen
                    // - if the users opens the panel and there are no options, but the
                    //   options come in slightly later or as a result of the value changing,
                    // - if the panel is closed after the user entered a string that did not match any
                    //   of the available options,
                    // - if a valid string is entered after an invalid one.
                    if (this.panelOpen) {
                        this._captureValueOnAttach();
                        this._emitOpened();
                    }
                    else {
                        this.autocomplete.closed.emit();
                    }
                }
            });
            return this.panelClosingActions;
        }), 
        // when the first closing event occurs...
        take(1))
            // set the value, close the panel, and complete.
            .subscribe(event => this._setValueAndClose(event)));
    }
    /**
     * Emits the opened event once it's known that the panel will be shown and stores
     * the state of the trigger right before the opening sequence was finished.
     */
    _emitOpened() {
        this.autocomplete.opened.emit();
    }
    /** Intended to be called when the panel is attached. Captures the current value of the input. */
    _captureValueOnAttach() {
        this._valueOnAttach = this._element.nativeElement.value;
    }
    /** Destroys the autocomplete suggestion panel. */
    _destroyPanel() {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    _assignOptionValue(value) {
        const toDisplay = this.autocomplete && this.autocomplete.displayWith
            ? this.autocomplete.displayWith(value)
            : value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
        this._updateNativeInputValue(toDisplay != null ? toDisplay : '');
    }
    _updateNativeInputValue(value) {
        // If it's used within a `MatFormField`, we should set it through the property so it can go
        // through change detection.
        if (this._formField) {
            this._formField._control.value = value;
        }
        else {
            this._element.nativeElement.value = value;
        }
        this._previousValue = value;
    }
    /**
     * This method closes the panel, and if a value is specified, also sets the associated
     * control to that value. It will also mark the control as dirty if this interaction
     * stemmed from the user.
     */
    _setValueAndClose(event) {
        const panel = this.autocomplete;
        const toSelect = event ? event.source : this._pendingAutoselectedOption;
        if (toSelect) {
            this._clearPreviousSelectedOption(toSelect);
            this._assignOptionValue(toSelect.value);
            // TODO(crisbeto): this should wait until the animation is done, otherwise the value
            // gets reset while the panel is still animating which looks glitchy. It'll likely break
            // some tests to change it at this point.
            this._onChange(toSelect.value);
            panel._emitSelectEvent(toSelect);
            this._element.nativeElement.focus();
        }
        else if (panel.requireSelection &&
            this._element.nativeElement.value !== this._valueOnAttach) {
            this._clearPreviousSelectedOption(null);
            this._assignOptionValue(null);
            // Wait for the animation to finish before clearing the form control value, otherwise
            // the options might change while the animation is running which looks glitchy.
            if (panel._animationDone) {
                panel._animationDone.pipe(take(1)).subscribe(() => this._onChange(null));
            }
            else {
                this._onChange(null);
            }
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    _clearPreviousSelectedOption(skip, emitEvent) {
        // Null checks are necessary here, because the autocomplete
        // or its options may not have been assigned yet.
        this.autocomplete?.options?.forEach(option => {
            if (option !== skip && option.selected) {
                option.deselect(emitEvent);
            }
        });
    }
    _attachOverlay() {
        if (!this.autocomplete && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatAutocompleteMissingPanelError();
        }
        let overlayRef = this._overlayRef;
        if (!overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef, {
                id: this._formField?.getLabelId(),
            });
            overlayRef = this._overlay.create(this._getOverlayConfig());
            this._overlayRef = overlayRef;
            this._viewportSubscription = this._viewportRuler.change().subscribe(() => {
                if (this.panelOpen && overlayRef) {
                    overlayRef.updateSize({ width: this._getPanelWidth() });
                }
            });
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
        const wasOpen = this.panelOpen;
        this.autocomplete._isOpen = this._overlayAttached = true;
        this.autocomplete._setColor(this._formField?.color);
        this._updatePanelState();
        this._applyModalPanelOwnership();
        this._captureValueOnAttach();
        // We need to do an extra `panelOpen` check in here, because the
        // autocomplete won't be shown if there are no options.
        if (this.panelOpen && wasOpen !== this.panelOpen) {
            this._emitOpened();
        }
    }
    /** Updates the panel's visibility state and any trigger state tied to id. */
    _updatePanelState() {
        this.autocomplete._setVisibility();
        // Note that here we subscribe and unsubscribe based on the panel's visiblity state,
        // because the act of subscribing will prevent events from reaching other overlays and
        // we don't want to block the events if there are no options.
        if (this.panelOpen) {
            const overlayRef = this._overlayRef;
            if (!this._keydownSubscription) {
                // Use the `keydownEvents` in order to take advantage of
                // the overlay event targeting provided by the CDK overlay.
                this._keydownSubscription = overlayRef.keydownEvents().subscribe(this._handlePanelKeydown);
            }
            if (!this._outsideClickSubscription) {
                // Subscribe to the pointer events stream so that it doesn't get picked up by other overlays.
                // TODO(crisbeto): we should switch `_getOutsideClickStream` eventually to use this stream,
                // but the behvior isn't exactly the same and it ends up breaking some internal tests.
                this._outsideClickSubscription = overlayRef.outsidePointerEvents().subscribe();
            }
        }
        else {
            this._keydownSubscription?.unsubscribe();
            this._outsideClickSubscription?.unsubscribe();
            this._keydownSubscription = this._outsideClickSubscription = null;
        }
    }
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getPanelWidth(),
            direction: this._dir ?? undefined,
            panelClass: this._defaults?.overlayPanelClass,
        });
    }
    _getOverlayPosition() {
        const strategy = this._overlay
            .position()
            .flexibleConnectedTo(this._getConnectedElement())
            .withFlexibleDimensions(false)
            .withPush(false);
        this._setStrategyPositions(strategy);
        this._positionStrategy = strategy;
        return strategy;
    }
    /** Sets the positions on a position strategy based on the directive's input state. */
    _setStrategyPositions(positionStrategy) {
        // Note that we provide horizontal fallback positions, even though by default the dropdown
        // width matches the input, because consumers can override the width. See #18854.
        const belowPositions = [
            { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
            { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        ];
        // The overlay edge connected to the trigger should have squared corners, while
        // the opposite end has rounded corners. We apply a CSS class to swap the
        // border-radius based on the overlay position.
        const panelClass = this._aboveClass;
        const abovePositions = [
            { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', panelClass },
            { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', panelClass },
        ];
        let positions;
        if (this.position === 'above') {
            positions = abovePositions;
        }
        else if (this.position === 'below') {
            positions = belowPositions;
        }
        else {
            positions = [...belowPositions, ...abovePositions];
        }
        positionStrategy.withPositions(positions);
    }
    _getConnectedElement() {
        if (this.connectedTo) {
            return this.connectedTo.elementRef;
        }
        return this._formField ? this._formField.getConnectedOverlayOrigin() : this._element;
    }
    _getPanelWidth() {
        return this.autocomplete.panelWidth || this._getHostWidth();
    }
    /** Returns the width of the input element, so the panel width can match it. */
    _getHostWidth() {
        return this._getConnectedElement().nativeElement.getBoundingClientRect().width;
    }
    /**
     * Reset the active item to -1. This is so that pressing arrow keys will activate the correct
     * option.
     *
     * If the consumer opted-in to automatically activatating the first option, activate the first
     * *enabled* option.
     */
    _resetActiveItem() {
        const autocomplete = this.autocomplete;
        if (autocomplete.autoActiveFirstOption) {
            // Find the index of the first *enabled* option. Avoid calling `_keyManager.setActiveItem`
            // because it activates the first option that passes the skip predicate, rather than the
            // first *enabled* option.
            let firstEnabledOptionIndex = -1;
            for (let index = 0; index < autocomplete.options.length; index++) {
                const option = autocomplete.options.get(index);
                if (!option.disabled) {
                    firstEnabledOptionIndex = index;
                    break;
                }
            }
            autocomplete._keyManager.setActiveItem(firstEnabledOptionIndex);
        }
        else {
            autocomplete._keyManager.setActiveItem(-1);
        }
    }
    /** Determines whether the panel can be opened. */
    _canOpen() {
        const element = this._element.nativeElement;
        return !element.readOnly && !element.disabled && !this.autocompleteDisabled;
    }
    /** Use defaultView of injected document if available or fallback to global window reference */
    _getWindow() {
        return this._document?.defaultView || window;
    }
    /** Scrolls to a particular option in the list. */
    _scrollToOption(index) {
        // Given that we are not actually focusing active options, we must manually adjust scroll
        // to reveal options below the fold. First, we find the offset of the option from the top
        // of the panel. If that offset is below the fold, the new scrollTop will be the offset -
        // the panel height + the option height, so the active option will be just visible at the
        // bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
        // will become the offset. If that offset is visible within the panel already, the scrollTop is
        // not adjusted.
        const autocomplete = this.autocomplete;
        const labelCount = _countGroupLabelsBeforeOption(index, autocomplete.options, autocomplete.optionGroups);
        if (index === 0 && labelCount === 1) {
            // If we've got one group label before the option and we're at the top option,
            // scroll the list to the top. This is better UX than scrolling the list to the
            // top of the option, because it allows the user to read the top group's label.
            autocomplete._setScrollTop(0);
        }
        else if (autocomplete.panel) {
            const option = autocomplete.options.toArray()[index];
            if (option) {
                const element = option._getHostElement();
                const newScrollPosition = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, autocomplete._getScrollTop(), autocomplete.panel.nativeElement.offsetHeight);
                autocomplete._setScrollTop(newScrollPosition);
            }
        }
    }
    /**
     * If the autocomplete trigger is inside of an `aria-modal` element, connect
     * that modal to the options panel with `aria-owns`.
     *
     * For some browser + screen reader combinations, when navigation is inside
     * of an `aria-modal` element, the screen reader treats everything outside
     * of that modal as hidden or invisible.
     *
     * This causes a problem when the combobox trigger is _inside_ of a modal, because the
     * options panel is rendered _outside_ of that modal, preventing screen reader navigation
     * from reaching the panel.
     *
     * We can work around this issue by applying `aria-owns` to the modal with the `id` of
     * the options panel. This effectively communicates to assistive technology that the
     * options panel is part of the same interaction as the modal.
     *
     * At time of this writing, this issue is present in VoiceOver.
     * See https://github.com/angular/components/issues/20694
     */
    _applyModalPanelOwnership() {
        // TODO(http://github.com/angular/components/issues/26853): consider de-duplicating this with
        // the `LiveAnnouncer` and any other usages.
        //
        // Note that the selector here is limited to CDK overlays at the moment in order to reduce the
        // section of the DOM we need to look through. This should cover all the cases we support, but
        // the selector can be expanded if it turns out to be too narrow.
        const modal = this._element.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');
        if (!modal) {
            // Most commonly, the autocomplete trigger is not inside a modal.
            return;
        }
        const panelId = this.autocomplete.id;
        if (this._trackedModal) {
            removeAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
        }
        addAriaReferencedId(modal, 'aria-owns', panelId);
        this._trackedModal = modal;
    }
    /** Clears the references to the listbox overlay element from the modal it was added to. */
    _clearFromModal() {
        if (this._trackedModal) {
            const panelId = this.autocomplete.id;
            removeAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
            this._trackedModal = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: MatAutocompleteTrigger, deps: [{ token: i0.ElementRef }, { token: i1.Overlay }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: MAT_AUTOCOMPLETE_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: MAT_FORM_FIELD, host: true, optional: true }, { token: DOCUMENT, optional: true }, { token: i3.ViewportRuler }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.0-next.6", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: { autocomplete: ["matAutocomplete", "autocomplete"], position: ["matAutocompletePosition", "position"], connectedTo: ["matAutocompleteConnectedTo", "connectedTo"], autocompleteAttribute: ["autocomplete", "autocompleteAttribute"], autocompleteDisabled: ["matAutocompleteDisabled", "autocompleteDisabled", booleanAttribute] }, host: { listeners: { "focusin": "_handleFocus()", "blur": "_onTouched()", "input": "_handleInput($event)", "keydown": "_handleKeydown($event)", "click": "_handleClick()" }, properties: { "attr.autocomplete": "autocompleteAttribute", "attr.role": "autocompleteDisabled ? null : \"combobox\"", "attr.aria-autocomplete": "autocompleteDisabled ? null : \"list\"", "attr.aria-activedescendant": "(panelOpen && activeOption) ? activeOption.id : null", "attr.aria-expanded": "autocompleteDisabled ? null : panelOpen.toString()", "attr.aria-controls": "(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id", "attr.aria-haspopup": "autocompleteDisabled ? null : \"listbox\"" }, classAttribute: "mat-mdc-autocomplete-trigger" }, providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR], exportAs: ["matAutocompleteTrigger"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-next.6", ngImport: i0, type: MatAutocompleteTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matAutocomplete], textarea[matAutocomplete]`,
                    host: {
                        'class': 'mat-mdc-autocomplete-trigger',
                        '[attr.autocomplete]': 'autocompleteAttribute',
                        '[attr.role]': 'autocompleteDisabled ? null : "combobox"',
                        '[attr.aria-autocomplete]': 'autocompleteDisabled ? null : "list"',
                        '[attr.aria-activedescendant]': '(panelOpen && activeOption) ? activeOption.id : null',
                        '[attr.aria-expanded]': 'autocompleteDisabled ? null : panelOpen.toString()',
                        '[attr.aria-controls]': '(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id',
                        '[attr.aria-haspopup]': 'autocompleteDisabled ? null : "listbox"',
                        // Note: we use `focusin`, as opposed to `focus`, in order to open the panel
                        // a little earlier. This avoids issues where IE delays the focusing of the input.
                        '(focusin)': '_handleFocus()',
                        '(blur)': '_onTouched()',
                        '(input)': '_handleInput($event)',
                        '(keydown)': '_handleKeydown($event)',
                        '(click)': '_handleClick()',
                    },
                    exportAs: 'matAutocompleteTrigger',
                    providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Overlay }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY]
                }] }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i4.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }, {
                    type: Host
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.ViewportRuler }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS]
                }] }], propDecorators: { autocomplete: [{
                type: Input,
                args: ['matAutocomplete']
            }], position: [{
                type: Input,
                args: ['matAutocompletePosition']
            }], connectedTo: [{
                type: Input,
                args: ['matAutocompleteConnectedTo']
            }], autocompleteAttribute: [{
                type: Input,
                args: ['autocomplete']
            }], autocompleteDisabled: [{
                type: Input,
                args: [{ alias: 'matAutocompleteDisabled', transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlFLE9BQU8sRUFFTCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUVSLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0YsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLE9BQU8sRUFDUCxhQUFhLEdBS2QsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFDN0Isd0JBQXdCLEdBRXpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLDhCQUE4QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxLQUFLLEVB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QTFDaEIsWUFBWTtzQkFBckMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBU1UsUUFBUTtzQkFBekMsS0FBSzt1QkFBQyx5QkFBeUI7Z0JBTUssV0FBVztzQkFBL0MsS0FBSzt1QkFBQyw0QkFBNEI7Z0JBTVoscUJBQXFCO3NCQUEzQyxLQUFLO3VCQUFDLGNBQWM7Z0JBT3JCLG9CQUFvQjtzQkFEbkIsS0FBSzt1QkFBQyxFQUFDLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthZGRBcmlhUmVmZXJlbmNlZElkLCByZW1vdmVBcmlhUmVmZXJlbmNlZElkfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBib29sZWFuQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7RE9XTl9BUlJPVywgRU5URVIsIEVTQ0FQRSwgVEFCLCBVUF9BUlJPVywgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge19nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgUG9zaXRpb25TdHJhdGVneSxcbiAgU2Nyb2xsU3RyYXRlZ3ksXG4gIENvbm5lY3RlZFBvc2l0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlLFxuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uLFxuICBNYXRPcHRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNQVRfRk9STV9GSUVMRCwgTWF0Rm9ybUZpZWxkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7ZGVmZXIsIGZyb21FdmVudCwgbWVyZ2UsIE9ic2VydmFibGUsIG9mIGFzIG9ic2VydmFibGVPZiwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgbWFwLCBzd2l0Y2hNYXAsIHRha2UsIHRhcCwgc3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZU9yaWdpbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcbmltcG9ydCB7XG4gIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zLFxuICBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyxcbiAgTWF0QXV0b2NvbXBsZXRlLFxufSBmcm9tICcuL2F1dG9jb21wbGV0ZSc7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIGF1dG9jb21wbGV0ZSB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gdXNlIGFuIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIHdpdGhvdXQgYSBwYW5lbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEF1dG9jb21wbGV0ZU1pc3NpbmdQYW5lbEVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKFxuICAgICdBdHRlbXB0aW5nIHRvIG9wZW4gYW4gdW5kZWZpbmVkIGluc3RhbmNlIG9mIGBtYXQtYXV0b2NvbXBsZXRlYC4gJyArXG4gICAgICAnTWFrZSBzdXJlIHRoYXQgdGhlIGlkIHBhc3NlZCB0byB0aGUgYG1hdEF1dG9jb21wbGV0ZWAgaXMgY29ycmVjdCBhbmQgdGhhdCAnICtcbiAgICAgIFwieW91J3JlIGF0dGVtcHRpbmcgdG8gb3BlbiBpdCBhZnRlciB0aGUgbmdBZnRlckNvbnRlbnRJbml0IGhvb2suXCIsXG4gICk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ21hdC1hdXRvY29tcGxldGUtc2Nyb2xsLXN0cmF0ZWd5Jyxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRBdXRvY29tcGxldGVUcmlnZ2VyYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgaW5wdXRbbWF0QXV0b2NvbXBsZXRlXSwgdGV4dGFyZWFbbWF0QXV0b2NvbXBsZXRlXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1hdXRvY29tcGxldGUtdHJpZ2dlcicsXG4gICAgJ1thdHRyLmF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlQXR0cmlidXRlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJjb21ib2JveFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICcocGFuZWxPcGVuICYmIGFjdGl2ZU9wdGlvbikgPyBhY3RpdmVPcHRpb24uaWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogcGFuZWxPcGVuLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICcoYXV0b2NvbXBsZXRlRGlzYWJsZWQgfHwgIXBhbmVsT3BlbikgPyBudWxsIDogYXV0b2NvbXBsZXRlPy5pZCcsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdGJveFwiJyxcbiAgICAvLyBOb3RlOiB3ZSB1c2UgYGZvY3VzaW5gLCBhcyBvcHBvc2VkIHRvIGBmb2N1c2AsIGluIG9yZGVyIHRvIG9wZW4gdGhlIHBhbmVsXG4gICAgLy8gYSBsaXR0bGUgZWFybGllci4gVGhpcyBhdm9pZHMgaXNzdWVzIHdoZXJlIElFIGRlbGF5cyB0aGUgZm9jdXNpbmcgb2YgdGhlIGlucHV0LlxuICAgICcoZm9jdXNpbiknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJyxcbiAgICAnKGlucHV0KSc6ICdfaGFuZGxlSW5wdXQoJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlVHJpZ2dlcicsXG4gIHByb3ZpZGVyczogW01BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1JdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVUcmlnZ2VyXG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsO1xuICBwcml2YXRlIF9jb21wb25lbnREZXN0cm95ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF9rZXlkb3duU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuICBwcml2YXRlIF9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG5cbiAgLyoqIE9sZCB2YWx1ZSBvZiB0aGUgbmF0aXZlIGlucHV0LiBVc2VkIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aXRoIHRoZSBgaW5wdXRgIGV2ZW50IG9uIElFLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCB3aGVuIHRoZSBwYW5lbCB3YXMgYXR0YWNoZWQgKGV2ZW4gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMpLiAqL1xuICBwcml2YXRlIF92YWx1ZU9uQXR0YWNoOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IGlzIHVzZWQgdG8gcG9zaXRpb24gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBsYWJlbCBzdGF0ZSBpcyBiZWluZyBvdmVycmlkZGVuLiAqL1xuICBwcml2YXRlIF9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcblxuICAvKiogVGhlIHN1YnNjcmlwdGlvbiBmb3IgY2xvc2luZyBhY3Rpb25zIChzb21lIGFyZSBib3VuZCB0byBkb2N1bWVudCkuICovXG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgY2FuIG9wZW4gdGhlIG5leHQgdGltZSBpdCBpcyBmb2N1c2VkLiBVc2VkIHRvIHByZXZlbnQgYSBmb2N1c2VkLFxuICAgKiBjbG9zZWQgYXV0b2NvbXBsZXRlIGZyb20gYmVpbmcgcmVvcGVuZWQgaWYgdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBicm93c2VyIHRhYiBhbmQgdGhlblxuICAgKiBjb21lcyBiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcblxuICAvKiogVmFsdWUgaW5zaWRlIHRoZSBpbnB1dCBiZWZvcmUgd2UgYXV0by1zZWxlY3RlZCBhbiBvcHRpb24uICovXG4gIHByaXZhdGUgX3ZhbHVlQmVmb3JlQXV0b1NlbGVjdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBDdXJyZW50IG9wdGlvbiB0aGF0IHdlIGhhdmUgYXV0by1zZWxlY3RlZCBhcyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nLFxuICAgKiBidXQgd2hpY2ggaGFzbid0IGJlZW4gcHJvcGFnYXRlZCB0byB0aGUgbW9kZWwgdmFsdWUgeWV0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbjogTWF0T3B0aW9uIHwgbnVsbDtcblxuICAvKiogU3RyZWFtIG9mIGtleWJvYXJkIGV2ZW50cyB0aGF0IGNhbiBjbG9zZSB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nsb3NlS2V5RXZlbnRTdHJlYW0gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB3aW5kb3cgaXMgYmx1cnJlZC4gTmVlZHMgdG8gYmUgYW5cbiAgICogYXJyb3cgZnVuY3Rpb24gaW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIGNvbnRleHQuXG4gICAqL1xuICBwcml2YXRlIF93aW5kb3dCbHVySGFuZGxlciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgdXNlciBibHVycmVkIHRoZSB3aW5kb3cgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBpcyBmb2N1c2VkLCBpdCBtZWFucyB0aGF0IGl0J2xsIGJlXG4gICAgLy8gcmVmb2N1c2VkIHdoZW4gdGhleSBjb21lIGJhY2suIEluIHRoaXMgY2FzZSB3ZSB3YW50IHRvIHNraXAgdGhlIGZpcnN0IGZvY3VzIGV2ZW50LCBpZiB0aGVcbiAgICAvLyBwYW5lIHdhcyBjbG9zZWQsIGluIG9yZGVyIHRvIGF2b2lkIHJlb3BlbmluZyBpdCB1bmludGVudGlvbmFsbHkuXG4gICAgdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzID1cbiAgICAgIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCB8fCB0aGlzLnBhbmVsT3BlbjtcbiAgfTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBhdXRvY29tcGxldGUgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRvIGJlIGF0dGFjaGVkIHRvIHRoaXMgdHJpZ2dlci4gKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGU6IE1hdEF1dG9jb21wbGV0ZTtcblxuICAvKipcbiAgICogUG9zaXRpb24gb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCByZWxhdGl2ZSB0byB0aGUgdHJpZ2dlciBlbGVtZW50LiBBIHBvc2l0aW9uIG9mIGBhdXRvYFxuICAgKiB3aWxsIHJlbmRlciB0aGUgcGFuZWwgdW5kZXJuZWF0aCB0aGUgdHJpZ2dlciBpZiB0aGVyZSBpcyBlbm91Z2ggc3BhY2UgZm9yIGl0IHRvIGZpdCBpblxuICAgKiB0aGUgdmlld3BvcnQsIG90aGVyd2lzZSB0aGUgcGFuZWwgd2lsbCBiZSBzaG93biBhYm92ZSBpdC4gSWYgdGhlIHBvc2l0aW9uIGlzIHNldCB0b1xuICAgKiBgYWJvdmVgIG9yIGBiZWxvd2AsIHRoZSBwYW5lbCB3aWxsIGFsd2F5cyBiZSBzaG93biBhYm92ZSBvciBiZWxvdyB0aGUgdHJpZ2dlci4gbm8gbWF0dGVyXG4gICAqIHdoZXRoZXIgaXQgZml0cyBjb21wbGV0ZWx5IGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlUG9zaXRpb24nKSBwb3NpdGlvbjogJ2F1dG8nIHwgJ2Fib3ZlJyB8ICdiZWxvdycgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSByZWxhdGl2ZSB0byB3aGljaCB0byBwb3NpdGlvbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLlxuICAgKiBEZWZhdWx0cyB0byB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIgZWxlbWVudC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlQ29ubmVjdGVkVG8nKSBjb25uZWN0ZWRUbzogTWF0QXV0b2NvbXBsZXRlT3JpZ2luO1xuXG4gIC8qKlxuICAgKiBgYXV0b2NvbXBsZXRlYCBhdHRyaWJ1dGUgdG8gYmUgc2V0IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2F1dG9jb21wbGV0ZScpIGF1dG9jb21wbGV0ZUF0dHJpYnV0ZTogc3RyaW5nID0gJ29mZic7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBpcyBkaXNhYmxlZC4gV2hlbiBkaXNhYmxlZCwgdGhlIGVsZW1lbnQgd2lsbFxuICAgKiBhY3QgYXMgYSByZWd1bGFyIGlucHV0IGFuZCB0aGUgdXNlciB3b24ndCBiZSBhYmxlIHRvIG9wZW4gdGhlIHBhbmVsLlxuICAgKi9cbiAgQElucHV0KHthbGlhczogJ21hdEF1dG9jb21wbGV0ZURpc2FibGVkJywgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgYXV0b2NvbXBsZXRlRGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIEBIb3N0KCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdHM/OiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB8IG51bGwsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBhYm92ZSB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX2Fib3ZlQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtcGFuZWwtYWJvdmUnO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVySGFuZGxlcik7XG4gICAgfVxuXG4gICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9jb21wb25lbnREZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2Rlc3Ryb3lQYW5lbCgpO1xuICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0uY29tcGxldGUoKTtcbiAgICB0aGlzLl9jbGVhckZyb21Nb2RhbCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmIHRoaXMuYXV0b2NvbXBsZXRlLnNob3dQYW5lbDtcbiAgfVxuICBwcml2YXRlIF9vdmVybGF5QXR0YWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BlbnMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBvcGVuUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fYXR0YWNoT3ZlcmxheSgpO1xuICAgIHRoaXMuX2Zsb2F0TGFiZWwoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBjbG9zZVBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX3Jlc2V0TGFiZWwoKTtcblxuICAgIGlmICghdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBPbmx5IGVtaXQgaWYgdGhlIHBhbmVsIHdhcyB2aXNpYmxlLlxuICAgICAgLy8gVGhlIGBOZ1pvbmUub25TdGFibGVgIGFsd2F5cyBlbWl0cyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUsXG4gICAgICAvLyBzbyBhbGwgdGhlIHN1YnNjcmlwdGlvbnMgZnJvbSBgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKWAgYXJlIGFsc28gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICAgICAgLy8gV2Ugc2hvdWxkIG1hbnVhbGx5IHJ1biBpbiBBbmd1bGFyIHpvbmUgdG8gdXBkYXRlIFVJIGFmdGVyIHBhbmVsIGNsb3NpbmcuXG4gICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBpbiBzb21lIGNhc2VzIHRoaXMgY2FuIGVuZCB1cCBiZWluZyBjYWxsZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgLy8gQWRkIGEgY2hlY2sgdG8gZW5zdXJlIHRoYXQgd2UgZG9uJ3QgdHJ5IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG9uIGEgZGVzdHJveWVkIHZpZXcuXG4gICAgaWYgKCF0aGlzLl9jb21wb25lbnREZXN0cm95ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LCBiZWNhdXNlXG4gICAgICAvLyBgZnJvbUV2ZW50YCBkb2Vzbid0IHNlZW0gdG8gZG8gaXQgYXQgdGhlIHByb3BlciB0aW1lLlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGxhYmVsIGlzIHJlc2V0IHdoZW4gdGhlXG4gICAgICAvLyB1c2VyIGNsaWNrcyBvdXRzaWRlLlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwgdG8gZW5zdXJlIHRoYXQgaXQgZml0cyBhbGwgb3B0aW9uc1xuICAgKiB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJlYW0gb2YgYWN0aW9ucyB0aGF0IHNob3VsZCBjbG9zZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLCBpbmNsdWRpbmdcbiAgICogd2hlbiBhbiBvcHRpb24gaXMgc2VsZWN0ZWQsIG9uIGJsdXIsIGFuZCB3aGVuIFRBQiBpcyBwcmVzc2VkLlxuICAgKi9cbiAgZ2V0IHBhbmVsQ2xvc2luZ0FjdGlvbnMoKTogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgfCBudWxsPiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25zLFxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpLFxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbSxcbiAgICAgIHRoaXMuX2dldE91dHNpZGVDbGlja1N0cmVhbSgpLFxuICAgICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgICA/IHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKVxuICAgICAgICA6IG9ic2VydmFibGVPZigpLFxuICAgICkucGlwZShcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgb3V0cHV0IHNvIHdlIHJldHVybiBhIGNvbnNpc3RlbnQgdHlwZS5cbiAgICAgIG1hcChldmVudCA9PiAoZXZlbnQgaW5zdGFuY2VvZiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgPyBldmVudCA6IG51bGwpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBjaGFuZ2VzIHRvIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICByZWFkb25seSBvcHRpb25TZWxlY3Rpb25zOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT4gPSBkZWZlcigoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuYXV0b2NvbXBsZXRlID8gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucyA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgob3B0aW9ucyksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiBtZXJnZSguLi5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9uU2VsZWN0aW9uQ2hhbmdlKSkpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHN1YnNjcmliZXJzIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YCwgdGhlIGBhdXRvY29tcGxldGVgIHdpbGwgYmUgdW5kZWZpbmVkLlxuICAgIC8vIFJldHVybiBhIHN0cmVhbSB0aGF0IHdlJ2xsIHJlcGxhY2Ugd2l0aCB0aGUgcmVhbCBvbmUgb25jZSBldmVyeXRoaW5nIGlzIGluIHBsYWNlLlxuICAgIHJldHVybiB0aGlzLl96b25lLm9uU3RhYmxlLnBpcGUoXG4gICAgICB0YWtlKDEpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9ucyksXG4gICAgKTtcbiAgfSkgYXMgT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+O1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBvcHRpb24sIGNvZXJjZWQgdG8gTWF0T3B0aW9uIHR5cGUuICovXG4gIGdldCBhY3RpdmVPcHRpb24oKTogTWF0T3B0aW9uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlICYmIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnYXV4Y2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAndG91Y2hlbmQnKSBhcyBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+LFxuICAgICkucGlwZShcbiAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIC8vIElmIHdlJ3JlIGluIHRoZSBTaGFkb3cgRE9NLCB0aGUgZXZlbnQgdGFyZ2V0IHdpbGwgYmUgdGhlIHNoYWRvdyByb290LCBzbyB3ZSBoYXZlIHRvXG4gICAgICAgIC8vIGZhbGwgYmFjayB0byBjaGVjayB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgcGF0aCBvZiB0aGUgY2xpY2sgZXZlbnQuXG4gICAgICAgIGNvbnN0IGNsaWNrVGFyZ2V0ID0gX2dldEV2ZW50VGFyZ2V0PEhUTUxFbGVtZW50PihldmVudCkhO1xuICAgICAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICAgIGNvbnN0IGN1c3RvbU9yaWdpbiA9IHRoaXMuY29ubmVjdGVkVG8gPyB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiZcbiAgICAgICAgICBjbGlja1RhcmdldCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgLy8gTm9ybWFsbHkgZm9jdXMgbW92ZXMgaW5zaWRlIGBtb3VzZWRvd25gIHNvIHRoaXMgY29uZGl0aW9uIHdpbGwgYWxtb3N0IGFsd2F5cyBiZVxuICAgICAgICAgIC8vIHRydWUuIEl0cyBtYWluIHB1cnBvc2UgaXMgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBpbnB1dCBpcyBmb2N1c2VkIGZyb20gYW5cbiAgICAgICAgICAvLyBvdXRzaWRlIGNsaWNrIHdoaWNoIHByb3BhZ2F0ZXMgdXAgdG8gdGhlIGBib2R5YCBsaXN0ZW5lciB3aXRoaW4gdGhlIHNhbWUgc2VxdWVuY2VcbiAgICAgICAgICAvLyBhbmQgY2F1c2VzIHRoZSBwYW5lbCB0byBjbG9zZSBpbW1lZGlhdGVseSAoc2VlICMzMTA2KS5cbiAgICAgICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAoIWN1c3RvbU9yaWdpbiB8fCAhY3VzdG9tT3JpZ2luLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAhIXRoaXMuX292ZXJsYXlSZWYgJiZcbiAgICAgICAgICAhdGhpcy5fb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jb250YWlucyhjbGlja1RhcmdldClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZSh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaGFzTW9kaWZpZXIgPSBoYXNNb2RpZmllcktleShldmVudCk7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiBvbiBhbGwgZXNjYXBlIGtleSBwcmVzc2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5IHRvIGJyaW5nIElFXG4gICAgLy8gaW4gbGluZSB3aXRoIG90aGVyIGJyb3dzZXJzLiBCeSBkZWZhdWx0LCBwcmVzc2luZyBlc2NhcGUgb24gSUUgd2lsbCBjYXVzZSBpdCB0byByZXZlcnRcbiAgICAvLyB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGF0IGl0IGhhZCBvbiBmb2N1cywgaG93ZXZlciBpdCB3b24ndCBkaXNwYXRjaCBhbnkgZXZlbnRzXG4gICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgbW9kZWwgdmFsdWUgd2lsbCBiZSBvdXQgb2Ygc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgIGlmIChrZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbiAmJiBrZXlDb2RlID09PSBFTlRFUiAmJiB0aGlzLnBhbmVsT3BlbiAmJiAhaGFzTW9kaWZpZXIpIHtcbiAgICAgIHRoaXMuYWN0aXZlT3B0aW9uLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvY29tcGxldGUpIHtcbiAgICAgIGNvbnN0IHByZXZBY3RpdmVJdGVtID0gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XO1xuXG4gICAgICBpZiAoa2V5Q29kZSA9PT0gVEFCIHx8IChpc0Fycm93S2V5ICYmICFoYXNNb2RpZmllciAmJiB0aGlzLnBhbmVsT3BlbikpIHtcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiB0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgICAgdGhpcy5vcGVuUGFuZWwoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXJyb3dLZXkgfHwgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSAhPT0gcHJldkFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9PcHRpb24odGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZS5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uICYmIHRoaXMuYWN0aXZlT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb24gPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IHRoaXMuYWN0aXZlT3B0aW9uO1xuICAgICAgICAgIHRoaXMuX2Fzc2lnbk9wdGlvblZhbHVlKHRoaXMuYWN0aXZlT3B0aW9uLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBsZXQgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAvLyBCYXNlZCBvbiBgTnVtYmVyVmFsdWVBY2Nlc3NvcmAgZnJvbSBmb3Jtcy5cbiAgICBpZiAodGFyZ2V0LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbnB1dCBoYXMgYSBwbGFjZWhvbGRlciwgSUUgd2lsbCBmaXJlIHRoZSBgaW5wdXRgIGV2ZW50IG9uIHBhZ2UgbG9hZCxcbiAgICAvLyBmb2N1cyBhbmQgYmx1ciwgaW4gYWRkaXRpb24gdG8gd2hlbiB0aGUgdXNlciBhY3R1YWxseSBjaGFuZ2VkIHRoZSB2YWx1ZS4gVG9cbiAgICAvLyBmaWx0ZXIgb3V0IGFsbCBvZiB0aGUgZXh0cmEgZXZlbnRzLCB3ZSBzYXZlIHRoZSB2YWx1ZSBvbiBmb2N1cyBhbmQgYmV0d2VlblxuICAgIC8vIGBpbnB1dGAgZXZlbnRzLCBhbmQgd2UgY2hlY2sgd2hldGhlciBpdCBjaGFuZ2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84ODU3NDcvXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uID0gbnVsbDtcblxuICAgICAgLy8gSWYgc2VsZWN0aW9uIGlzIHJlcXVpcmVkIHdlIGRvbid0IHdyaXRlIHRvIHRoZSBDVkEgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgLy8gQXQgdGhlIGVuZCBvZiB0aGUgc2VsZWN0aW9uIGVpdGhlciB0aGUgdXNlciB3aWxsIGhhdmUgcGlja2VkIHNvbWV0aGluZ1xuICAgICAgLy8gb3Igd2UnbGwgcmVzZXQgdGhlIHZhbHVlIGJhY2sgdG8gbnVsbC5cbiAgICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUgfHwgIXRoaXMuYXV0b2NvbXBsZXRlLnJlcXVpcmVTZWxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihudWxsLCBmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzKSB7XG4gICAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fYXR0YWNoT3ZlcmxheSgpO1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nhbk9wZW4oKSAmJiAhdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluIFwiYXV0b1wiIG1vZGUsIHRoZSBsYWJlbCB3aWxsIGFuaW1hdGUgZG93biBhcyBzb29uIGFzIGZvY3VzIGlzIGxvc3QuXG4gICAqIFRoaXMgY2F1c2VzIHRoZSB2YWx1ZSB0byBqdW1wIHdoZW4gc2VsZWN0aW5nIGFuIG9wdGlvbiB3aXRoIHRoZSBtb3VzZS5cbiAgICogVGhpcyBtZXRob2QgbWFudWFsbHkgZmxvYXRzIHRoZSBsYWJlbCB1bnRpbCB0aGUgcGFuZWwgY2FuIGJlIGNsb3NlZC5cbiAgICogQHBhcmFtIHNob3VsZEFuaW1hdGUgV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGJlIGFuaW1hdGVkIHdoZW4gaXQgaXMgZmxvYXRlZC5cbiAgICovXG4gIHByaXZhdGUgX2Zsb2F0TGFiZWwoc2hvdWxkQW5pbWF0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCAmJiB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9PT0gJ2F1dG8nKSB7XG4gICAgICBpZiAoc2hvdWxkQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIElmIHRoZSBsYWJlbCBoYXMgYmVlbiBtYW51YWxseSBlbGV2YXRlZCwgcmV0dXJuIGl0IHRvIGl0cyBub3JtYWwgc3RhdGUuICovXG4gIHByaXZhdGUgX3Jlc2V0TGFiZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCkge1xuICAgICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICAgIHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBsaXN0ZW5zIHRvIGEgc3RyZWFtIG9mIHBhbmVsIGNsb3NpbmcgYWN0aW9ucyBhbmQgcmVzZXRzIHRoZVxuICAgKiBzdHJlYW0gZXZlcnkgdGltZSB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBmaXJzdFN0YWJsZSA9IHRoaXMuX3pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKTtcbiAgICBjb25zdCBvcHRpb25DaGFuZ2VzID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICB0YXAoKCkgPT4gdGhpcy5fcG9zaXRpb25TdHJhdGVneS5yZWFwcGx5TGFzdFBvc2l0aW9uKCkpLFxuICAgICAgLy8gRGVmZXIgZW1pdHRpbmcgdG8gdGhlIHN0cmVhbSB1bnRpbCB0aGUgbmV4dCB0aWNrLCBiZWNhdXNlIGNoYW5naW5nXG4gICAgICAvLyBiaW5kaW5ncyBpbiBoZXJlIHdpbGwgY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgICBkZWxheSgwKSxcbiAgICApO1xuXG4gICAgLy8gV2hlbiB0aGUgem9uZSBpcyBzdGFibGUgaW5pdGlhbGx5LCBhbmQgd2hlbiB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy4uLlxuICAgIHJldHVybiAoXG4gICAgICBtZXJnZShmaXJzdFN0YWJsZSwgb3B0aW9uQ2hhbmdlcylcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgLy8gY3JlYXRlIGEgbmV3IHN0cmVhbSBvZiBwYW5lbENsb3NpbmdBY3Rpb25zLCByZXBsYWNpbmcgYW55IHByZXZpb3VzIHN0cmVhbXNcbiAgICAgICAgICAvLyB0aGF0IHdlcmUgY3JlYXRlZCwgYW5kIGZsYXR0ZW4gaXQgc28gb3VyIHN0cmVhbSBvbmx5IGVtaXRzIGNsb3NpbmcgZXZlbnRzLi4uXG4gICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSBgTmdab25lLm9uU3RhYmxlYCBhbHdheXMgZW1pdHMgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLCB0aHVzIHdlIGhhdmUgdG8gcmUtZW50ZXJcbiAgICAgICAgICAgIC8vIHRoZSBBbmd1bGFyIHpvbmUuIFRoaXMgd2lsbCBsZWFkIHRvIGNoYW5nZSBkZXRlY3Rpb24gYmVpbmcgY2FsbGVkIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXJcbiAgICAgICAgICAgIC8vIHpvbmUgYW5kIHRoZSBgYXV0b2NvbXBsZXRlLm9wZW5lZGAgd2lsbCBhbHNvIGVtaXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhci5cbiAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgd2FzT3BlbiA9IHRoaXMucGFuZWxPcGVuO1xuICAgICAgICAgICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGFuZWxTdGF0ZSgpO1xuICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBgcGFuZWxPcGVuYCBzdGF0ZSBjaGFuZ2VkLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBlbWl0IHRoZSBgb3BlbmVkYCBvclxuICAgICAgICAgICAgICAgIC8vIGBjbG9zZWRgIGV2ZW50LCBiZWNhdXNlIHdlIG1heSBub3QgaGF2ZSBlbWl0dGVkIGl0LiBUaGlzIGNhbiBoYXBwZW5cbiAgICAgICAgICAgICAgICAvLyAtIGlmIHRoZSB1c2VycyBvcGVucyB0aGUgcGFuZWwgYW5kIHRoZXJlIGFyZSBubyBvcHRpb25zLCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gICBvcHRpb25zIGNvbWUgaW4gc2xpZ2h0bHkgbGF0ZXIgb3IgYXMgYSByZXN1bHQgb2YgdGhlIHZhbHVlIGNoYW5naW5nLFxuICAgICAgICAgICAgICAgIC8vIC0gaWYgdGhlIHBhbmVsIGlzIGNsb3NlZCBhZnRlciB0aGUgdXNlciBlbnRlcmVkIGEgc3RyaW5nIHRoYXQgZGlkIG5vdCBtYXRjaCBhbnlcbiAgICAgICAgICAgICAgICAvLyAgIG9mIHRoZSBhdmFpbGFibGUgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAvLyAtIGlmIGEgdmFsaWQgc3RyaW5nIGlzIGVudGVyZWQgYWZ0ZXIgYW4gaW52YWxpZCBvbmUuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9jYXB0dXJlVmFsdWVPbkF0dGFjaCgpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsQ2xvc2luZ0FjdGlvbnM7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgLy8gd2hlbiB0aGUgZmlyc3QgY2xvc2luZyBldmVudCBvY2N1cnMuLi5cbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICApXG4gICAgICAgIC8vIHNldCB0aGUgdmFsdWUsIGNsb3NlIHRoZSBwYW5lbCwgYW5kIGNvbXBsZXRlLlxuICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIG9wZW5lZCBldmVudCBvbmNlIGl0J3Mga25vd24gdGhhdCB0aGUgcGFuZWwgd2lsbCBiZSBzaG93biBhbmQgc3RvcmVzXG4gICAqIHRoZSBzdGF0ZSBvZiB0aGUgdHJpZ2dlciByaWdodCBiZWZvcmUgdGhlIG9wZW5pbmcgc2VxdWVuY2Ugd2FzIGZpbmlzaGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW1pdE9wZW5lZCgpIHtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcGVuZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqIEludGVuZGVkIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBwYW5lbCBpcyBhdHRhY2hlZC4gQ2FwdHVyZXMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9jYXB0dXJlVmFsdWVPbkF0dGFjaCgpIHtcbiAgICB0aGlzLl92YWx1ZU9uQXR0YWNoID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBhbmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXNzaWduT3B0aW9uVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRvRGlzcGxheSA9XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aFxuICAgICAgICA/IHRoaXMuYXV0b2NvbXBsZXRlLmRpc3BsYXlXaXRoKHZhbHVlKVxuICAgICAgICA6IHZhbHVlO1xuXG4gICAgLy8gU2ltcGx5IGZhbGxpbmcgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIGRpc3BsYXkgdmFsdWUgaXMgZmFsc3kgZG9lcyBub3Qgd29yayBwcm9wZXJseS5cbiAgICAvLyBUaGUgZGlzcGxheSB2YWx1ZSBjYW4gYWxzbyBiZSB0aGUgbnVtYmVyIHplcm8gYW5kIHNob3VsZG4ndCBmYWxsIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nLlxuICAgIHRoaXMuX3VwZGF0ZU5hdGl2ZUlucHV0VmFsdWUodG9EaXNwbGF5ICE9IG51bGwgPyB0b0Rpc3BsYXkgOiAnJyk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBJZiBpdCdzIHVzZWQgd2l0aGluIGEgYE1hdEZvcm1GaWVsZGAsIHdlIHNob3VsZCBzZXQgaXQgdGhyb3VnaCB0aGUgcHJvcGVydHkgc28gaXQgY2FuIGdvXG4gICAgLy8gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fY29udHJvbC52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY2xvc2VzIHRoZSBwYW5lbCwgYW5kIGlmIGEgdmFsdWUgaXMgc3BlY2lmaWVkLCBhbHNvIHNldHMgdGhlIGFzc29jaWF0ZWRcbiAgICogY29udHJvbCB0byB0aGF0IHZhbHVlLiBJdCB3aWxsIGFsc28gbWFyayB0aGUgY29udHJvbCBhcyBkaXJ0eSBpZiB0aGlzIGludGVyYWN0aW9uXG4gICAqIHN0ZW1tZWQgZnJvbSB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQ6IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IHRvU2VsZWN0ID0gZXZlbnQgPyBldmVudC5zb3VyY2UgOiB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uO1xuXG4gICAgaWYgKHRvU2VsZWN0KSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24odG9TZWxlY3QpO1xuICAgICAgdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUodG9TZWxlY3QudmFsdWUpO1xuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2hvdWxkIHdhaXQgdW50aWwgdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBvdGhlcndpc2UgdGhlIHZhbHVlXG4gICAgICAvLyBnZXRzIHJlc2V0IHdoaWxlIHRoZSBwYW5lbCBpcyBzdGlsbCBhbmltYXRpbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS4gSXQnbGwgbGlrZWx5IGJyZWFrXG4gICAgICAvLyBzb21lIHRlc3RzIHRvIGNoYW5nZSBpdCBhdCB0aGlzIHBvaW50LlxuICAgICAgdGhpcy5fb25DaGFuZ2UodG9TZWxlY3QudmFsdWUpO1xuICAgICAgcGFuZWwuX2VtaXRTZWxlY3RFdmVudCh0b1NlbGVjdCk7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcGFuZWwucmVxdWlyZVNlbGVjdGlvbiAmJlxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlICE9PSB0aGlzLl92YWx1ZU9uQXR0YWNoXG4gICAgKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCk7XG4gICAgICB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZShudWxsKTtcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBjbGVhcmluZyB0aGUgZm9ybSBjb250cm9sIHZhbHVlLCBvdGhlcndpc2VcbiAgICAgIC8vIHRoZSBvcHRpb25zIG1pZ2h0IGNoYW5nZSB3aGlsZSB0aGUgYW5pbWF0aW9uIGlzIHJ1bm5pbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS5cbiAgICAgIGlmIChwYW5lbC5fYW5pbWF0aW9uRG9uZSkge1xuICAgICAgICBwYW5lbC5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9vbkNoYW5nZShudWxsKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbnkgcHJldmlvdXMgc2VsZWN0ZWQgb3B0aW9uIGFuZCBlbWl0IGEgc2VsZWN0aW9uIGNoYW5nZSBldmVudCBmb3IgdGhpcyBvcHRpb25cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihza2lwOiBNYXRPcHRpb24gfCBudWxsLCBlbWl0RXZlbnQ/OiBib29sZWFuKSB7XG4gICAgLy8gTnVsbCBjaGVja3MgYXJlIG5lY2Vzc2FyeSBoZXJlLCBiZWNhdXNlIHRoZSBhdXRvY29tcGxldGVcbiAgICAvLyBvciBpdHMgb3B0aW9ucyBtYXkgbm90IGhhdmUgYmVlbiBhc3NpZ25lZCB5ZXQuXG4gICAgdGhpcy5hdXRvY29tcGxldGU/Lm9wdGlvbnM/LmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24gIT09IHNraXAgJiYgb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5kZXNlbGVjdChlbWl0RXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoT3ZlcmxheSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpO1xuICAgIH1cblxuICAgIGxldCBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcblxuICAgIGlmICghb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuYXV0b2NvbXBsZXRlLnRlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLCB7XG4gICAgICAgIGlkOiB0aGlzLl9mb3JtRmllbGQ/LmdldExhYmVsSWQoKSxcbiAgICAgIH0pO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gdHJ1ZTtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0Q29sb3IodGhpcy5fZm9ybUZpZWxkPy5jb2xvcik7XG4gICAgdGhpcy5fdXBkYXRlUGFuZWxTdGF0ZSgpO1xuICAgIHRoaXMuX2FwcGx5TW9kYWxQYW5lbE93bmVyc2hpcCgpO1xuICAgIHRoaXMuX2NhcHR1cmVWYWx1ZU9uQXR0YWNoKCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIGFuIGV4dHJhIGBwYW5lbE9wZW5gIGNoZWNrIGluIGhlcmUsIGJlY2F1c2UgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHdvbid0IGJlIHNob3duIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiB3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlUGFuZWxLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgLy8gQ2xvc2Ugd2hlbiBwcmVzc2luZyBFU0NBUEUgb3IgQUxUICsgVVBfQVJST1csIGJhc2VkIG9uIHRoZSBhMTF5IGd1aWRlbGluZXMuXG4gICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgIGlmIChcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyAmJiBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpKVxuICAgICkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFkIHR5cGVkIHNvbWV0aGluZyBpbiBiZWZvcmUgd2UgYXV0b3NlbGVjdGVkIGFuIG9wdGlvbiwgYW5kIHRoZXkgZGVjaWRlZFxuICAgICAgLy8gdG8gY2FuY2VsIHRoZSBzZWxlY3Rpb24sIHJlc3RvcmUgdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhleSBoYWQgdHlwZWQgaW4uXG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbikge1xuICAgICAgICB0aGlzLl91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHRoaXMuX3ZhbHVlQmVmb3JlQXV0b1NlbGVjdGlvbiA/PyAnJyk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvbiwgb3RoZXJ3aXNlIHRoZSBldmVudCB3aWxsIGV2ZW50dWFsbHlcbiAgICAgIC8vIHJlYWNoIHRoZSBpbnB1dCBpdHNlbGYgYW5kIGNhdXNlIHRoZSBvdmVybGF5IHRvIGJlIHJlb3BlbmVkLlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKiogVXBkYXRlcyB0aGUgcGFuZWwncyB2aXNpYmlsaXR5IHN0YXRlIGFuZCBhbnkgdHJpZ2dlciBzdGF0ZSB0aWVkIHRvIGlkLiAqL1xuICBwcml2YXRlIF91cGRhdGVQYW5lbFN0YXRlKCkge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRWaXNpYmlsaXR5KCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgaGVyZSB3ZSBzdWJzY3JpYmUgYW5kIHVuc3Vic2NyaWJlIGJhc2VkIG9uIHRoZSBwYW5lbCdzIHZpc2libGl0eSBzdGF0ZSxcbiAgICAvLyBiZWNhdXNlIHRoZSBhY3Qgb2Ygc3Vic2NyaWJpbmcgd2lsbCBwcmV2ZW50IGV2ZW50cyBmcm9tIHJlYWNoaW5nIG90aGVyIG92ZXJsYXlzIGFuZFxuICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gYmxvY2sgdGhlIGV2ZW50cyBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmITtcblxuICAgICAgaWYgKCF0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gICAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUodGhpcy5faGFuZGxlUGFuZWxLZXlkb3duKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBwb2ludGVyIGV2ZW50cyBzdHJlYW0gc28gdGhhdCBpdCBkb2Vzbid0IGdldCBwaWNrZWQgdXAgYnkgb3RoZXIgb3ZlcmxheXMuXG4gICAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBzaG91bGQgc3dpdGNoIGBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtYCBldmVudHVhbGx5IHRvIHVzZSB0aGlzIHN0cmVhbSxcbiAgICAgICAgLy8gYnV0IHRoZSBiZWh2aW9yIGlzbid0IGV4YWN0bHkgdGhlIHNhbWUgYW5kIGl0IGVuZHMgdXAgYnJlYWtpbmcgc29tZSBpbnRlcm5hbCB0ZXN0cy5cbiAgICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uID0gb3ZlcmxheVJlZi5vdXRzaWRlUG9pbnRlckV2ZW50cygpLnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IHRoaXMuX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/PyB1bmRlZmluZWQsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLl9kZWZhdWx0cz8ub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5UG9zaXRpb24oKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFB1c2goZmFsc2UpO1xuXG4gICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICAgIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICByZXR1cm4gc3RyYXRlZ3k7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3kgYmFzZWQgb24gdGhlIGRpcmVjdGl2ZSdzIGlucHV0IHN0YXRlLiAqL1xuICBwcml2YXRlIF9zZXRTdHJhdGVneVBvc2l0aW9ucyhwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgcHJvdmlkZSBob3Jpem9udGFsIGZhbGxiYWNrIHBvc2l0aW9ucywgZXZlbiB0aG91Z2ggYnkgZGVmYXVsdCB0aGUgZHJvcGRvd25cbiAgICAvLyB3aWR0aCBtYXRjaGVzIHRoZSBpbnB1dCwgYmVjYXVzZSBjb25zdW1lcnMgY2FuIG92ZXJyaWRlIHRoZSB3aWR0aC4gU2VlICMxODg1NC5cbiAgICBjb25zdCBiZWxvd1Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnYm90dG9tJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAndG9wJ30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAndG9wJ30sXG4gICAgXTtcblxuICAgIC8vIFRoZSBvdmVybGF5IGVkZ2UgY29ubmVjdGVkIHRvIHRoZSB0cmlnZ2VyIHNob3VsZCBoYXZlIHNxdWFyZWQgY29ybmVycywgd2hpbGVcbiAgICAvLyB0aGUgb3Bwb3NpdGUgZW5kIGhhcyByb3VuZGVkIGNvcm5lcnMuIFdlIGFwcGx5IGEgQ1NTIGNsYXNzIHRvIHN3YXAgdGhlXG4gICAgLy8gYm9yZGVyLXJhZGl1cyBiYXNlZCBvbiB0aGUgb3ZlcmxheSBwb3NpdGlvbi5cbiAgICBjb25zdCBwYW5lbENsYXNzID0gdGhpcy5fYWJvdmVDbGFzcztcbiAgICBjb25zdCBhYm92ZVBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAndG9wJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc30sXG4gICAgXTtcblxuICAgIGxldCBwb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW107XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2Fib3ZlJykge1xuICAgICAgcG9zaXRpb25zID0gYWJvdmVQb3NpdGlvbnM7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYmVsb3cnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBiZWxvd1Bvc2l0aW9ucztcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25zID0gWy4uLmJlbG93UG9zaXRpb25zLCAuLi5hYm92ZVBvc2l0aW9uc107XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdHJhdGVneS53aXRoUG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRDb25uZWN0ZWRFbGVtZW50KCk6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWRUbykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkVG8uZWxlbWVudFJlZjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9nZXRQYW5lbFdpZHRoKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLnBhbmVsV2lkdGggfHwgdGhpcy5fZ2V0SG9zdFdpZHRoKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIGlucHV0IGVsZW1lbnQsIHNvIHRoZSBwYW5lbCB3aWR0aCBjYW4gbWF0Y2ggaXQuICovXG4gIHByaXZhdGUgX2dldEhvc3RXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYWN0aXZlIGl0ZW0gdG8gLTEuIFRoaXMgaXMgc28gdGhhdCBwcmVzc2luZyBhcnJvdyBrZXlzIHdpbGwgYWN0aXZhdGUgdGhlIGNvcnJlY3RcbiAgICogb3B0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgY29uc3VtZXIgb3B0ZWQtaW4gdG8gYXV0b21hdGljYWxseSBhY3RpdmF0YXRpbmcgdGhlIGZpcnN0IG9wdGlvbiwgYWN0aXZhdGUgdGhlIGZpcnN0XG4gICAqICplbmFibGVkKiBvcHRpb24uXG4gICAqL1xuICBwcml2YXRlIF9yZXNldEFjdGl2ZUl0ZW0oKTogdm9pZCB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGU7XG5cbiAgICBpZiAoYXV0b2NvbXBsZXRlLmF1dG9BY3RpdmVGaXJzdE9wdGlvbikge1xuICAgICAgLy8gRmluZCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0ICplbmFibGVkKiBvcHRpb24uIEF2b2lkIGNhbGxpbmcgYF9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW1gXG4gICAgICAvLyBiZWNhdXNlIGl0IGFjdGl2YXRlcyB0aGUgZmlyc3Qgb3B0aW9uIHRoYXQgcGFzc2VzIHRoZSBza2lwIHByZWRpY2F0ZSwgcmF0aGVyIHRoYW4gdGhlXG4gICAgICAvLyBmaXJzdCAqZW5hYmxlZCogb3B0aW9uLlxuICAgICAgbGV0IGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4ID0gLTE7XG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhdXRvY29tcGxldGUub3B0aW9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gYXV0b2NvbXBsZXRlLm9wdGlvbnMuZ2V0KGluZGV4KSE7XG4gICAgICAgIGlmICghb3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgZmlyc3RFbmFibGVkT3B0aW9uSW5kZXggPSBpbmRleDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oZmlyc3RFbmFibGVkT3B0aW9uSW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdXRvY29tcGxldGUuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFuZWwgY2FuIGJlIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfY2FuT3BlbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHJldHVybiAhZWxlbWVudC5yZWFkT25seSAmJiAhZWxlbWVudC5kaXNhYmxlZCAmJiAhdGhpcy5hdXRvY29tcGxldGVEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudD8uZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICB9XG5cbiAgLyoqIFNjcm9sbHMgdG8gYSBwYXJ0aWN1bGFyIG9wdGlvbiBpbiB0aGUgbGlzdC4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG9PcHRpb24oaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIEdpdmVuIHRoYXQgd2UgYXJlIG5vdCBhY3R1YWxseSBmb2N1c2luZyBhY3RpdmUgb3B0aW9ucywgd2UgbXVzdCBtYW51YWxseSBhZGp1c3Qgc2Nyb2xsXG4gICAgLy8gdG8gcmV2ZWFsIG9wdGlvbnMgYmVsb3cgdGhlIGZvbGQuIEZpcnN0LCB3ZSBmaW5kIHRoZSBvZmZzZXQgb2YgdGhlIG9wdGlvbiBmcm9tIHRoZSB0b3BcbiAgICAvLyBvZiB0aGUgcGFuZWwuIElmIHRoYXQgb2Zmc2V0IGlzIGJlbG93IHRoZSBmb2xkLCB0aGUgbmV3IHNjcm9sbFRvcCB3aWxsIGJlIHRoZSBvZmZzZXQgLVxuICAgIC8vIHRoZSBwYW5lbCBoZWlnaHQgKyB0aGUgb3B0aW9uIGhlaWdodCwgc28gdGhlIGFjdGl2ZSBvcHRpb24gd2lsbCBiZSBqdXN0IHZpc2libGUgYXQgdGhlXG4gICAgLy8gYm90dG9tIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYWJvdmUgdGhlIHRvcCBvZiB0aGUgdmlzaWJsZSBwYW5lbCwgdGhlIG5ldyBzY3JvbGxUb3BcbiAgICAvLyB3aWxsIGJlY29tZSB0aGUgb2Zmc2V0LiBJZiB0aGF0IG9mZnNldCBpcyB2aXNpYmxlIHdpdGhpbiB0aGUgcGFuZWwgYWxyZWFkeSwgdGhlIHNjcm9sbFRvcCBpc1xuICAgIC8vIG5vdCBhZGp1c3RlZC5cbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcbiAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oXG4gICAgICBpbmRleCxcbiAgICAgIGF1dG9jb21wbGV0ZS5vcHRpb25zLFxuICAgICAgYXV0b2NvbXBsZXRlLm9wdGlvbkdyb3VwcyxcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID09PSAwICYmIGxhYmVsQ291bnQgPT09IDEpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGdvdCBvbmUgZ3JvdXAgbGFiZWwgYmVmb3JlIHRoZSBvcHRpb24gYW5kIHdlJ3JlIGF0IHRoZSB0b3Agb3B0aW9uLFxuICAgICAgLy8gc2Nyb2xsIHRoZSBsaXN0IHRvIHRoZSB0b3AuIFRoaXMgaXMgYmV0dGVyIFVYIHRoYW4gc2Nyb2xsaW5nIHRoZSBsaXN0IHRvIHRoZVxuICAgICAgLy8gdG9wIG9mIHRoZSBvcHRpb24sIGJlY2F1c2UgaXQgYWxsb3dzIHRoZSB1c2VyIHRvIHJlYWQgdGhlIHRvcCBncm91cCdzIGxhYmVsLlxuICAgICAgYXV0b2NvbXBsZXRlLl9zZXRTY3JvbGxUb3AoMCk7XG4gICAgfSBlbHNlIGlmIChhdXRvY29tcGxldGUucGFuZWwpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGF1dG9jb21wbGV0ZS5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF07XG5cbiAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IG9wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKTtcbiAgICAgICAgY29uc3QgbmV3U2Nyb2xsUG9zaXRpb24gPSBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICAgICAgZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgYXV0b2NvbXBsZXRlLl9nZXRTY3JvbGxUb3AoKSxcbiAgICAgICAgICBhdXRvY29tcGxldGUucGFuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgYXV0b2NvbXBsZXRlLl9zZXRTY3JvbGxUb3AobmV3U2Nyb2xsUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayB3aGljaCBtb2RhbCB3ZSBoYXZlIG1vZGlmaWVkIHRoZSBgYXJpYS1vd25zYCBhdHRyaWJ1dGUgb2YuIFdoZW4gdGhlIGNvbWJvYm94IHRyaWdnZXIgaXNcbiAgICogaW5zaWRlIGFuIGFyaWEtbW9kYWwsIHdlIGFwcGx5IGFyaWEtb3ducyB0byB0aGUgcGFyZW50IG1vZGFsIHdpdGggdGhlIGBpZGAgb2YgdGhlIG9wdGlvbnNcbiAgICogcGFuZWwuIFRyYWNrIHRoZSBtb2RhbCB3ZSBoYXZlIGNoYW5nZWQgc28gd2UgY2FuIHVuZG8gdGhlIGNoYW5nZXMgb24gZGVzdHJveS5cbiAgICovXG4gIHByaXZhdGUgX3RyYWNrZWRNb2RhbDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIgaXMgaW5zaWRlIG9mIGFuIGBhcmlhLW1vZGFsYCBlbGVtZW50LCBjb25uZWN0XG4gICAqIHRoYXQgbW9kYWwgdG8gdGhlIG9wdGlvbnMgcGFuZWwgd2l0aCBgYXJpYS1vd25zYC5cbiAgICpcbiAgICogRm9yIHNvbWUgYnJvd3NlciArIHNjcmVlbiByZWFkZXIgY29tYmluYXRpb25zLCB3aGVuIG5hdmlnYXRpb24gaXMgaW5zaWRlXG4gICAqIG9mIGFuIGBhcmlhLW1vZGFsYCBlbGVtZW50LCB0aGUgc2NyZWVuIHJlYWRlciB0cmVhdHMgZXZlcnl0aGluZyBvdXRzaWRlXG4gICAqIG9mIHRoYXQgbW9kYWwgYXMgaGlkZGVuIG9yIGludmlzaWJsZS5cbiAgICpcbiAgICogVGhpcyBjYXVzZXMgYSBwcm9ibGVtIHdoZW4gdGhlIGNvbWJvYm94IHRyaWdnZXIgaXMgX2luc2lkZV8gb2YgYSBtb2RhbCwgYmVjYXVzZSB0aGVcbiAgICogb3B0aW9ucyBwYW5lbCBpcyByZW5kZXJlZCBfb3V0c2lkZV8gb2YgdGhhdCBtb2RhbCwgcHJldmVudGluZyBzY3JlZW4gcmVhZGVyIG5hdmlnYXRpb25cbiAgICogZnJvbSByZWFjaGluZyB0aGUgcGFuZWwuXG4gICAqXG4gICAqIFdlIGNhbiB3b3JrIGFyb3VuZCB0aGlzIGlzc3VlIGJ5IGFwcGx5aW5nIGBhcmlhLW93bnNgIHRvIHRoZSBtb2RhbCB3aXRoIHRoZSBgaWRgIG9mXG4gICAqIHRoZSBvcHRpb25zIHBhbmVsLiBUaGlzIGVmZmVjdGl2ZWx5IGNvbW11bmljYXRlcyB0byBhc3Npc3RpdmUgdGVjaG5vbG9neSB0aGF0IHRoZVxuICAgKiBvcHRpb25zIHBhbmVsIGlzIHBhcnQgb2YgdGhlIHNhbWUgaW50ZXJhY3Rpb24gYXMgdGhlIG1vZGFsLlxuICAgKlxuICAgKiBBdCB0aW1lIG9mIHRoaXMgd3JpdGluZywgdGhpcyBpc3N1ZSBpcyBwcmVzZW50IGluIFZvaWNlT3Zlci5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNjk0XG4gICAqL1xuICBwcml2YXRlIF9hcHBseU1vZGFsUGFuZWxPd25lcnNoaXAoKSB7XG4gICAgLy8gVE9ETyhodHRwOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzI2ODUzKTogY29uc2lkZXIgZGUtZHVwbGljYXRpbmcgdGhpcyB3aXRoXG4gICAgLy8gdGhlIGBMaXZlQW5ub3VuY2VyYCBhbmQgYW55IG90aGVyIHVzYWdlcy5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgc2VsZWN0b3IgaGVyZSBpcyBsaW1pdGVkIHRvIENESyBvdmVybGF5cyBhdCB0aGUgbW9tZW50IGluIG9yZGVyIHRvIHJlZHVjZSB0aGVcbiAgICAvLyBzZWN0aW9uIG9mIHRoZSBET00gd2UgbmVlZCB0byBsb29rIHRocm91Z2guIFRoaXMgc2hvdWxkIGNvdmVyIGFsbCB0aGUgY2FzZXMgd2Ugc3VwcG9ydCwgYnV0XG4gICAgLy8gdGhlIHNlbGVjdG9yIGNhbiBiZSBleHBhbmRlZCBpZiBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIG5hcnJvdy5cbiAgICBjb25zdCBtb2RhbCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbG9zZXN0KFxuICAgICAgJ2JvZHkgPiAuY2RrLW92ZXJsYXktY29udGFpbmVyIFthcmlhLW1vZGFsPVwidHJ1ZVwiXScsXG4gICAgKTtcblxuICAgIGlmICghbW9kYWwpIHtcbiAgICAgIC8vIE1vc3QgY29tbW9ubHksIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBub3QgaW5zaWRlIGEgbW9kYWwuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFuZWxJZCA9IHRoaXMuYXV0b2NvbXBsZXRlLmlkO1xuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB9XG5cbiAgICBhZGRBcmlhUmVmZXJlbmNlZElkKG1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgdGhpcy5fdHJhY2tlZE1vZGFsID0gbW9kYWw7XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSByZWZlcmVuY2VzIHRvIHRoZSBsaXN0Ym94IG92ZXJsYXkgZWxlbWVudCBmcm9tIHRoZSBtb2RhbCBpdCB3YXMgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NsZWFyRnJvbU1vZGFsKCkge1xuICAgIGlmICh0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIGNvbnN0IHBhbmVsSWQgPSB0aGlzLmF1dG9jb21wbGV0ZS5pZDtcblxuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICAgIHRoaXMuX3RyYWNrZWRNb2RhbCA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=