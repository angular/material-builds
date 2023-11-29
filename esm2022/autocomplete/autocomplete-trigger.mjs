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
        // Add aria-owns attribute when the autocomplete becomes visible.
        if (this._trackedModal) {
            const panelId = this.autocomplete.id;
            addAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
        }
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
        // Remove aria-owns attribute when the autocomplete is no longer visible.
        if (this._trackedModal) {
            const panelId = this.autocomplete.id;
            removeAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
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
            else if (this.panelOpen && !this.autocomplete.requireSelection) {
                // Note that we don't reset this when `requireSelection` is enabled,
                // because the option will be reset when the panel is closed.
                const selectedOption = this.autocomplete.options?.find(option => option.selected);
                if (selectedOption) {
                    const display = this.autocomplete.displayWith?.(selectedOption) ?? selectedOption.value;
                    if (value !== display) {
                        selectedOption.deselect(false);
                    }
                }
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
        if (value == null) {
            this._clearPreviousSelectedOption(null, false);
        }
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
            this._valueOnAttach = this._element.nativeElement.value;
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        const wasOpen = this.panelOpen;
        this.autocomplete._isOpen = this._overlayAttached = true;
        this.autocomplete._setColor(this._formField?.color);
        this._updatePanelState();
        this._applyModalPanelOwnership();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAutocompleteTrigger, deps: [{ token: i0.ElementRef }, { token: i1.Overlay }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: MAT_AUTOCOMPLETE_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: MAT_FORM_FIELD, host: true, optional: true }, { token: DOCUMENT, optional: true }, { token: i3.ViewportRuler }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.4", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: { autocomplete: ["matAutocomplete", "autocomplete"], position: ["matAutocompletePosition", "position"], connectedTo: ["matAutocompleteConnectedTo", "connectedTo"], autocompleteAttribute: ["autocomplete", "autocompleteAttribute"], autocompleteDisabled: ["matAutocompleteDisabled", "autocompleteDisabled", booleanAttribute] }, host: { listeners: { "focusin": "_handleFocus()", "blur": "_onTouched()", "input": "_handleInput($event)", "keydown": "_handleKeydown($event)", "click": "_handleClick()" }, properties: { "attr.autocomplete": "autocompleteAttribute", "attr.role": "autocompleteDisabled ? null : \"combobox\"", "attr.aria-autocomplete": "autocompleteDisabled ? null : \"list\"", "attr.aria-activedescendant": "(panelOpen && activeOption) ? activeOption.id : null", "attr.aria-expanded": "autocompleteDisabled ? null : panelOpen.toString()", "attr.aria-controls": "(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id", "attr.aria-haspopup": "autocompleteDisabled ? null : \"listbox\"" }, classAttribute: "mat-mdc-autocomplete-trigger" }, providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR], exportAs: ["matAutocompleteTrigger"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAutocompleteTrigger, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlFLE9BQU8sRUFFTCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUVSLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0YsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLE9BQU8sRUFDUCxhQUFhLEdBS2QsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFDN0Isd0JBQXdCLEdBRXpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLDhCQUE4QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxLQUFLLEVB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QyxLQUFLLEVBQUUseUJBQXlCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7YWRkQXJpYVJlZmVyZW5jZWRJZCwgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1csIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtfZ2V0RXZlbnRUYXJnZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgTWF0T3B0aW9uLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBmcm9tRXZlbnQsIG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIG1hcCwgc3dpdGNoTWFwLCB0YWtlLCB0YXAsIHN0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRBdXRvY29tcGxldGVPcmlnaW59IGZyb20gJy4vYXV0b2NvbXBsZXRlLW9yaWdpbic7XG5pbXBvcnQge1xuICBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbiAgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMsXG4gIE1hdEF1dG9jb21wbGV0ZSxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSBhdXRvY29tcGxldGUgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIHVzZSBhbiBhdXRvY29tcGxldGUgdHJpZ2dlciB3aXRob3V0IGEgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihcbiAgICAnQXR0ZW1wdGluZyB0byBvcGVuIGFuIHVuZGVmaW5lZCBpbnN0YW5jZSBvZiBgbWF0LWF1dG9jb21wbGV0ZWAuICcgK1xuICAgICAgJ01ha2Ugc3VyZSB0aGF0IHRoZSBpZCBwYXNzZWQgdG8gdGhlIGBtYXRBdXRvY29tcGxldGVgIGlzIGNvcnJlY3QgYW5kIHRoYXQgJyArXG4gICAgICBcInlvdSdyZSBhdHRlbXB0aW5nIHRvIG9wZW4gaXQgYWZ0ZXIgdGhlIG5nQWZ0ZXJDb250ZW50SW5pdCBob29rLlwiLFxuICApO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLXNjcm9sbC1zdHJhdGVneScsXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcmAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdEF1dG9jb21wbGV0ZV0sIHRleHRhcmVhW21hdEF1dG9jb21wbGV0ZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtYXV0b2NvbXBsZXRlLXRyaWdnZXInLFxuICAgICdbYXR0ci5hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZUF0dHJpYnV0ZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwiY29tYm9ib3hcIicsXG4gICAgJ1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImxpc3RcIicsXG4gICAgJ1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiAnKHBhbmVsT3BlbiAmJiBhY3RpdmVPcHRpb24pID8gYWN0aXZlT3B0aW9uLmlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IHBhbmVsT3Blbi50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnKGF1dG9jb21wbGV0ZURpc2FibGVkIHx8ICFwYW5lbE9wZW4pID8gbnVsbCA6IGF1dG9jb21wbGV0ZT8uaWQnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImxpc3Rib3hcIicsXG4gICAgLy8gTm90ZTogd2UgdXNlIGBmb2N1c2luYCwgYXMgb3Bwb3NlZCB0byBgZm9jdXNgLCBpbiBvcmRlciB0byBvcGVuIHRoZSBwYW5lbFxuICAgIC8vIGEgbGl0dGxlIGVhcmxpZXIuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aGVyZSBJRSBkZWxheXMgdGhlIGZvY3VzaW5nIG9mIHRoZSBpbnB1dC5cbiAgICAnKGZvY3VzaW4pJzogJ19oYW5kbGVGb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKScsXG4gICAgJyhpbnB1dCknOiAnX2hhbmRsZUlucHV0KCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZVRyaWdnZXInLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlclxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcbiAgcHJpdmF0ZSBfY29tcG9uZW50RGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfa2V5ZG93blN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcbiAgcHJpdmF0ZSBfb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuXG4gIC8qKiBPbGQgdmFsdWUgb2YgdGhlIG5hdGl2ZSBpbnB1dC4gVXNlZCB0byB3b3JrIGFyb3VuZCBpc3N1ZXMgd2l0aCB0aGUgYGlucHV0YCBldmVudCBvbiBJRS4gKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVmFsdWUgb2YgdGhlIGlucHV0IGVsZW1lbnQgd2hlbiB0aGUgcGFuZWwgd2FzIGF0dGFjaGVkIChldmVuIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zKS4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPbkF0dGFjaDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcblxuICAvKiogU3RyYXRlZ3kgdGhhdCBpcyB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5O1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgbGFiZWwgc3RhdGUgaXMgYmVpbmcgb3ZlcnJpZGRlbi4gKi9cbiAgcHJpdmF0ZSBfbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzdWJzY3JpcHRpb24gZm9yIGNsb3NpbmcgYWN0aW9ucyAoc29tZSBhcmUgYm91bmQgdG8gZG9jdW1lbnQpLiAqL1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdmlld3BvcnQgc2l6ZSBjaGFuZ2VzLiAqL1xuICBwcml2YXRlIF92aWV3cG9ydFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGNhbiBvcGVuIHRoZSBuZXh0IHRpbWUgaXQgaXMgZm9jdXNlZC4gVXNlZCB0byBwcmV2ZW50IGEgZm9jdXNlZCxcbiAgICogY2xvc2VkIGF1dG9jb21wbGV0ZSBmcm9tIGJlaW5nIHJlb3BlbmVkIGlmIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYnJvd3NlciB0YWIgYW5kIHRoZW5cbiAgICogY29tZXMgYmFjay5cbiAgICovXG4gIHByaXZhdGUgX2Nhbk9wZW5Pbk5leHRGb2N1cyA9IHRydWU7XG5cbiAgLyoqIFZhbHVlIGluc2lkZSB0aGUgaW5wdXQgYmVmb3JlIHdlIGF1dG8tc2VsZWN0ZWQgYW4gb3B0aW9uLiAqL1xuICBwcml2YXRlIF92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3VycmVudCBvcHRpb24gdGhhdCB3ZSBoYXZlIGF1dG8tc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZyxcbiAgICogYnV0IHdoaWNoIGhhc24ndCBiZWVuIHByb3BhZ2F0ZWQgdG8gdGhlIG1vZGVsIHZhbHVlIHlldC5cbiAgICovXG4gIHByaXZhdGUgX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb246IE1hdE9wdGlvbiB8IG51bGw7XG5cbiAgLyoqIFN0cmVhbSBvZiBrZXlib2FyZCBldmVudHMgdGhhdCBjYW4gY2xvc2UgdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbG9zZUtleUV2ZW50U3RyZWFtID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWQuIE5lZWRzIHRvIGJlIGFuXG4gICAqIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHVzZXIgYmx1cnJlZCB0aGUgd2luZG93IHdoaWxlIHRoZSBhdXRvY29tcGxldGUgaXMgZm9jdXNlZCwgaXQgbWVhbnMgdGhhdCBpdCdsbCBiZVxuICAgIC8vIHJlZm9jdXNlZCB3aGVuIHRoZXkgY29tZSBiYWNrLiBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBza2lwIHRoZSBmaXJzdCBmb2N1cyBldmVudCwgaWYgdGhlXG4gICAgLy8gcGFuZSB3YXMgY2xvc2VkLCBpbiBvcmRlciB0byBhdm9pZCByZW9wZW5pbmcgaXQgdW5pbnRlbnRpb25hbGx5LlxuICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9XG4gICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5wYW5lbE9wZW47XG4gIH07XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gYXV0b2NvbXBsZXRlIGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0byBiZSBhdHRhY2hlZCB0byB0aGlzIHRyaWdnZXIuICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlJykgYXV0b2NvbXBsZXRlOiBNYXRBdXRvY29tcGxldGU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgcmVsYXRpdmUgdG8gdGhlIHRyaWdnZXIgZWxlbWVudC4gQSBwb3NpdGlvbiBvZiBgYXV0b2BcbiAgICogd2lsbCByZW5kZXIgdGhlIHBhbmVsIHVuZGVybmVhdGggdGhlIHRyaWdnZXIgaWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIGZvciBpdCB0byBmaXQgaW5cbiAgICogdGhlIHZpZXdwb3J0LCBvdGhlcndpc2UgdGhlIHBhbmVsIHdpbGwgYmUgc2hvd24gYWJvdmUgaXQuIElmIHRoZSBwb3NpdGlvbiBpcyBzZXQgdG9cbiAgICogYGFib3ZlYCBvciBgYmVsb3dgLCB0aGUgcGFuZWwgd2lsbCBhbHdheXMgYmUgc2hvd24gYWJvdmUgb3IgYmVsb3cgdGhlIHRyaWdnZXIuIG5vIG1hdHRlclxuICAgKiB3aGV0aGVyIGl0IGZpdHMgY29tcGxldGVseSBpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZVBvc2l0aW9uJykgcG9zaXRpb246ICdhdXRvJyB8ICdhYm92ZScgfCAnYmVsb3cnID0gJ2F1dG8nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgcmVsYXRpdmUgdG8gd2hpY2ggdG8gcG9zaXRpb24gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZUNvbm5lY3RlZFRvJykgY29ubmVjdGVkVG86IE1hdEF1dG9jb21wbGV0ZU9yaWdpbjtcblxuICAvKipcbiAgICogYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIHRvIGJlIHNldCBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGVBdHRyaWJ1dGU6IHN0cmluZyA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBlbGVtZW50IHdpbGxcbiAgICogYWN0IGFzIGEgcmVndWxhciBpbnB1dCBhbmQgdGhlIHVzZXIgd29uJ3QgYmUgYWJsZSB0byBvcGVuIHRoZSBwYW5lbC5cbiAgICovXG4gIEBJbnB1dCh7YWxpYXM6ICdtYXRBdXRvY29tcGxldGVEaXNhYmxlZCcsIHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGF1dG9jb21wbGV0ZURpc2FibGVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX3pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5IHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBASG9zdCgpIHByaXZhdGUgX2Zvcm1GaWVsZDogTWF0Rm9ybUZpZWxkIHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRzPzogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMgfCBudWxsLFxuICApIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgYWJvdmUgdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9hYm92ZUNsYXNzID0gJ21hdC1tZGMtYXV0b2NvbXBsZXRlLXBhbmVsLWFib3ZlJztcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuX3pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVySGFuZGxlcikpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSAmJiB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLl9zZXRTdHJhdGVneVBvc2l0aW9ucyh0aGlzLl9wb3NpdGlvblN0cmF0ZWd5KTtcblxuICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy5fZ2V0V2luZG93KCk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fY29tcG9uZW50RGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLl9kZXN0cm95UGFuZWwoKTtcbiAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fY2xlYXJGcm9tTW9kYWwoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlBdHRhY2hlZCAmJiB0aGlzLmF1dG9jb21wbGV0ZS5zaG93UGFuZWw7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxheUF0dGFjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wZW5zIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgb3BlblBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICB0aGlzLl9mbG9hdExhYmVsKCk7XG4gICAgLy8gQWRkIGFyaWEtb3ducyBhdHRyaWJ1dGUgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIGJlY29tZXMgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICBjb25zdCBwYW5lbElkID0gdGhpcy5hdXRvY29tcGxldGUuaWQ7XG4gICAgICBhZGRBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBjbG9zZVBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX3Jlc2V0TGFiZWwoKTtcblxuICAgIGlmICghdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBPbmx5IGVtaXQgaWYgdGhlIHBhbmVsIHdhcyB2aXNpYmxlLlxuICAgICAgLy8gVGhlIGBOZ1pvbmUub25TdGFibGVgIGFsd2F5cyBlbWl0cyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUsXG4gICAgICAvLyBzbyBhbGwgdGhlIHN1YnNjcmlwdGlvbnMgZnJvbSBgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKWAgYXJlIGFsc28gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICAgICAgLy8gV2Ugc2hvdWxkIG1hbnVhbGx5IHJ1biBpbiBBbmd1bGFyIHpvbmUgdG8gdXBkYXRlIFVJIGFmdGVyIHBhbmVsIGNsb3NpbmcuXG4gICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBpbiBzb21lIGNhc2VzIHRoaXMgY2FuIGVuZCB1cCBiZWluZyBjYWxsZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgLy8gQWRkIGEgY2hlY2sgdG8gZW5zdXJlIHRoYXQgd2UgZG9uJ3QgdHJ5IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG9uIGEgZGVzdHJveWVkIHZpZXcuXG4gICAgaWYgKCF0aGlzLl9jb21wb25lbnREZXN0cm95ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LCBiZWNhdXNlXG4gICAgICAvLyBgZnJvbUV2ZW50YCBkb2Vzbid0IHNlZW0gdG8gZG8gaXQgYXQgdGhlIHByb3BlciB0aW1lLlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGxhYmVsIGlzIHJlc2V0IHdoZW4gdGhlXG4gICAgICAvLyB1c2VyIGNsaWNrcyBvdXRzaWRlLlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhcmlhLW93bnMgYXR0cmlidXRlIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBpcyBubyBsb25nZXIgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICBjb25zdCBwYW5lbElkID0gdGhpcy5hdXRvY29tcGxldGUuaWQ7XG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwgdG8gZW5zdXJlIHRoYXQgaXQgZml0cyBhbGwgb3B0aW9uc1xuICAgKiB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJlYW0gb2YgYWN0aW9ucyB0aGF0IHNob3VsZCBjbG9zZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLCBpbmNsdWRpbmdcbiAgICogd2hlbiBhbiBvcHRpb24gaXMgc2VsZWN0ZWQsIG9uIGJsdXIsIGFuZCB3aGVuIFRBQiBpcyBwcmVzc2VkLlxuICAgKi9cbiAgZ2V0IHBhbmVsQ2xvc2luZ0FjdGlvbnMoKTogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgfCBudWxsPiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgdGhpcy5vcHRpb25TZWxlY3Rpb25zLFxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpLFxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbSxcbiAgICAgIHRoaXMuX2dldE91dHNpZGVDbGlja1N0cmVhbSgpLFxuICAgICAgdGhpcy5fb3ZlcmxheVJlZlxuICAgICAgICA/IHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKVxuICAgICAgICA6IG9ic2VydmFibGVPZigpLFxuICAgICkucGlwZShcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgb3V0cHV0IHNvIHdlIHJldHVybiBhIGNvbnNpc3RlbnQgdHlwZS5cbiAgICAgIG1hcChldmVudCA9PiAoZXZlbnQgaW5zdGFuY2VvZiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgPyBldmVudCA6IG51bGwpKSxcbiAgICApO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBjaGFuZ2VzIHRvIHRoZSBzZWxlY3Rpb24gc3RhdGUgb2YgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICByZWFkb25seSBvcHRpb25TZWxlY3Rpb25zOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT4gPSBkZWZlcigoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuYXV0b2NvbXBsZXRlID8gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucyA6IG51bGw7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgob3B0aW9ucyksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiBtZXJnZSguLi5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9uU2VsZWN0aW9uQ2hhbmdlKSkpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHN1YnNjcmliZXJzIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YCwgdGhlIGBhdXRvY29tcGxldGVgIHdpbGwgYmUgdW5kZWZpbmVkLlxuICAgIC8vIFJldHVybiBhIHN0cmVhbSB0aGF0IHdlJ2xsIHJlcGxhY2Ugd2l0aCB0aGUgcmVhbCBvbmUgb25jZSBldmVyeXRoaW5nIGlzIGluIHBsYWNlLlxuICAgIHJldHVybiB0aGlzLl96b25lLm9uU3RhYmxlLnBpcGUoXG4gICAgICB0YWtlKDEpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9ucyksXG4gICAgKTtcbiAgfSkgYXMgT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+O1xuXG4gIC8qKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBvcHRpb24sIGNvZXJjZWQgdG8gTWF0T3B0aW9uIHR5cGUuICovXG4gIGdldCBhY3RpdmVPcHRpb24oKTogTWF0T3B0aW9uIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlICYmIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG1lcmdlKFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAnYXV4Y2xpY2snKSBhcyBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+LFxuICAgICAgZnJvbUV2ZW50KHRoaXMuX2RvY3VtZW50LCAndG91Y2hlbmQnKSBhcyBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+LFxuICAgICkucGlwZShcbiAgICAgIGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgIC8vIElmIHdlJ3JlIGluIHRoZSBTaGFkb3cgRE9NLCB0aGUgZXZlbnQgdGFyZ2V0IHdpbGwgYmUgdGhlIHNoYWRvdyByb290LCBzbyB3ZSBoYXZlIHRvXG4gICAgICAgIC8vIGZhbGwgYmFjayB0byBjaGVjayB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgcGF0aCBvZiB0aGUgY2xpY2sgZXZlbnQuXG4gICAgICAgIGNvbnN0IGNsaWNrVGFyZ2V0ID0gX2dldEV2ZW50VGFyZ2V0PEhUTUxFbGVtZW50PihldmVudCkhO1xuICAgICAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICAgIGNvbnN0IGN1c3RvbU9yaWdpbiA9IHRoaXMuY29ubmVjdGVkVG8gPyB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiZcbiAgICAgICAgICBjbGlja1RhcmdldCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgLy8gTm9ybWFsbHkgZm9jdXMgbW92ZXMgaW5zaWRlIGBtb3VzZWRvd25gIHNvIHRoaXMgY29uZGl0aW9uIHdpbGwgYWxtb3N0IGFsd2F5cyBiZVxuICAgICAgICAgIC8vIHRydWUuIEl0cyBtYWluIHB1cnBvc2UgaXMgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBpbnB1dCBpcyBmb2N1c2VkIGZyb20gYW5cbiAgICAgICAgICAvLyBvdXRzaWRlIGNsaWNrIHdoaWNoIHByb3BhZ2F0ZXMgdXAgdG8gdGhlIGBib2R5YCBsaXN0ZW5lciB3aXRoaW4gdGhlIHNhbWUgc2VxdWVuY2VcbiAgICAgICAgICAvLyBhbmQgY2F1c2VzIHRoZSBwYW5lbCB0byBjbG9zZSBpbW1lZGlhdGVseSAoc2VlICMzMTA2KS5cbiAgICAgICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAoIWN1c3RvbU9yaWdpbiB8fCAhY3VzdG9tT3JpZ2luLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAhIXRoaXMuX292ZXJsYXlSZWYgJiZcbiAgICAgICAgICAhdGhpcy5fb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jb250YWlucyhjbGlja1RhcmdldClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZSh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaGFzTW9kaWZpZXIgPSBoYXNNb2RpZmllcktleShldmVudCk7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiBvbiBhbGwgZXNjYXBlIGtleSBwcmVzc2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5IHRvIGJyaW5nIElFXG4gICAgLy8gaW4gbGluZSB3aXRoIG90aGVyIGJyb3dzZXJzLiBCeSBkZWZhdWx0LCBwcmVzc2luZyBlc2NhcGUgb24gSUUgd2lsbCBjYXVzZSBpdCB0byByZXZlcnRcbiAgICAvLyB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGF0IGl0IGhhZCBvbiBmb2N1cywgaG93ZXZlciBpdCB3b24ndCBkaXNwYXRjaCBhbnkgZXZlbnRzXG4gICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgbW9kZWwgdmFsdWUgd2lsbCBiZSBvdXQgb2Ygc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgIGlmIChrZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbiAmJiBrZXlDb2RlID09PSBFTlRFUiAmJiB0aGlzLnBhbmVsT3BlbiAmJiAhaGFzTW9kaWZpZXIpIHtcbiAgICAgIHRoaXMuYWN0aXZlT3B0aW9uLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvY29tcGxldGUpIHtcbiAgICAgIGNvbnN0IHByZXZBY3RpdmVJdGVtID0gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XO1xuXG4gICAgICBpZiAoa2V5Q29kZSA9PT0gVEFCIHx8IChpc0Fycm93S2V5ICYmICFoYXNNb2RpZmllciAmJiB0aGlzLnBhbmVsT3BlbikpIHtcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiB0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgICAgdGhpcy5vcGVuUGFuZWwoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXJyb3dLZXkgfHwgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSAhPT0gcHJldkFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9PcHRpb24odGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZS5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uICYmIHRoaXMuYWN0aXZlT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb24gPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IHRoaXMuYWN0aXZlT3B0aW9uO1xuICAgICAgICAgIHRoaXMuX2Fzc2lnbk9wdGlvblZhbHVlKHRoaXMuYWN0aXZlT3B0aW9uLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBsZXQgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAvLyBCYXNlZCBvbiBgTnVtYmVyVmFsdWVBY2Nlc3NvcmAgZnJvbSBmb3Jtcy5cbiAgICBpZiAodGFyZ2V0LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbnB1dCBoYXMgYSBwbGFjZWhvbGRlciwgSUUgd2lsbCBmaXJlIHRoZSBgaW5wdXRgIGV2ZW50IG9uIHBhZ2UgbG9hZCxcbiAgICAvLyBmb2N1cyBhbmQgYmx1ciwgaW4gYWRkaXRpb24gdG8gd2hlbiB0aGUgdXNlciBhY3R1YWxseSBjaGFuZ2VkIHRoZSB2YWx1ZS4gVG9cbiAgICAvLyBmaWx0ZXIgb3V0IGFsbCBvZiB0aGUgZXh0cmEgZXZlbnRzLCB3ZSBzYXZlIHRoZSB2YWx1ZSBvbiBmb2N1cyBhbmQgYmV0d2VlblxuICAgIC8vIGBpbnB1dGAgZXZlbnRzLCBhbmQgd2UgY2hlY2sgd2hldGhlciBpdCBjaGFuZ2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84ODU3NDcvXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uID0gbnVsbDtcblxuICAgICAgLy8gSWYgc2VsZWN0aW9uIGlzIHJlcXVpcmVkIHdlIGRvbid0IHdyaXRlIHRvIHRoZSBDVkEgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgLy8gQXQgdGhlIGVuZCBvZiB0aGUgc2VsZWN0aW9uIGVpdGhlciB0aGUgdXNlciB3aWxsIGhhdmUgcGlja2VkIHNvbWV0aGluZ1xuICAgICAgLy8gb3Igd2UnbGwgcmVzZXQgdGhlIHZhbHVlIGJhY2sgdG8gbnVsbC5cbiAgICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUgfHwgIXRoaXMuYXV0b2NvbXBsZXRlLnJlcXVpcmVTZWxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihudWxsLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxPcGVuICYmICF0aGlzLmF1dG9jb21wbGV0ZS5yZXF1aXJlU2VsZWN0aW9uKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCByZXNldCB0aGlzIHdoZW4gYHJlcXVpcmVTZWxlY3Rpb25gIGlzIGVuYWJsZWQsXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIG9wdGlvbiB3aWxsIGJlIHJlc2V0IHdoZW4gdGhlIHBhbmVsIGlzIGNsb3NlZC5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zPy5maW5kKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAgIGNvbnN0IGRpc3BsYXkgPSB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aD8uKHNlbGVjdGVkT3B0aW9uKSA/PyBzZWxlY3RlZE9wdGlvbi52YWx1ZTtcblxuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gZGlzcGxheSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb24uZGVzZWxlY3QoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY2FuT3BlbigpICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cykge1xuICAgICAgdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbiBcImF1dG9cIiBtb2RlLCB0aGUgbGFiZWwgd2lsbCBhbmltYXRlIGRvd24gYXMgc29vbiBhcyBmb2N1cyBpcyBsb3N0LlxuICAgKiBUaGlzIGNhdXNlcyB0aGUgdmFsdWUgdG8ganVtcCB3aGVuIHNlbGVjdGluZyBhbiBvcHRpb24gd2l0aCB0aGUgbW91c2UuXG4gICAqIFRoaXMgbWV0aG9kIG1hbnVhbGx5IGZsb2F0cyB0aGUgbGFiZWwgdW50aWwgdGhlIHBhbmVsIGNhbiBiZSBjbG9zZWQuXG4gICAqIEBwYXJhbSBzaG91bGRBbmltYXRlIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBiZSBhbmltYXRlZCB3aGVuIGl0IGlzIGZsb2F0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9mbG9hdExhYmVsKHNob3VsZEFuaW1hdGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mb3JtRmllbGQgJiYgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZEFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLl9hbmltYXRlQW5kTG9ja0xhYmVsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJZiB0aGUgbGFiZWwgaGFzIGJlZW4gbWFudWFsbHkgZWxldmF0ZWQsIHJldHVybiBpdCB0byBpdHMgbm9ybWFsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9yZXNldExhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwpIHtcbiAgICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYXV0byc7XG4gICAgICB9XG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbGlzdGVucyB0byBhIHN0cmVhbSBvZiBwYW5lbCBjbG9zaW5nIGFjdGlvbnMgYW5kIHJlc2V0cyB0aGVcbiAgICogc3RyZWFtIGV2ZXJ5IHRpbWUgdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgZmlyc3RTdGFibGUgPSB0aGlzLl96b25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSk7XG4gICAgY29uc3Qgb3B0aW9uQ2hhbmdlcyA9IHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgdGFwKCgpID0+IHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kucmVhcHBseUxhc3RQb3NpdGlvbigpKSxcbiAgICAgIC8vIERlZmVyIGVtaXR0aW5nIHRvIHRoZSBzdHJlYW0gdW50aWwgdGhlIG5leHQgdGljaywgYmVjYXVzZSBjaGFuZ2luZ1xuICAgICAgLy8gYmluZGluZ3MgaW4gaGVyZSB3aWxsIGNhdXNlIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzLlxuICAgICAgZGVsYXkoMCksXG4gICAgKTtcblxuICAgIC8vIFdoZW4gdGhlIHpvbmUgaXMgc3RhYmxlIGluaXRpYWxseSwgYW5kIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuLi5cbiAgICByZXR1cm4gKFxuICAgICAgbWVyZ2UoZmlyc3RTdGFibGUsIG9wdGlvbkNoYW5nZXMpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBzdHJlYW0gb2YgcGFuZWxDbG9zaW5nQWN0aW9ucywgcmVwbGFjaW5nIGFueSBwcmV2aW91cyBzdHJlYW1zXG4gICAgICAgICAgLy8gdGhhdCB3ZXJlIGNyZWF0ZWQsIGFuZCBmbGF0dGVuIGl0IHNvIG91ciBzdHJlYW0gb25seSBlbWl0cyBjbG9zaW5nIGV2ZW50cy4uLlxuICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBUaGUgYE5nWm9uZS5vblN0YWJsZWAgYWx3YXlzIGVtaXRzIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSwgdGh1cyB3ZSBoYXZlIHRvIHJlLWVudGVyXG4gICAgICAgICAgICAvLyB0aGUgQW5ndWxhciB6b25lLiBUaGlzIHdpbGwgbGVhZCB0byBjaGFuZ2UgZGV0ZWN0aW9uIGJlaW5nIGNhbGxlZCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyXG4gICAgICAgICAgICAvLyB6b25lIGFuZCB0aGUgYGF1dG9jb21wbGV0ZS5vcGVuZWRgIHdpbGwgYWxzbyBlbWl0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIuXG4gICAgICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcbiAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAod2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgYHBhbmVsT3BlbmAgc3RhdGUgY2hhbmdlZCwgd2UgbmVlZCB0byBtYWtlIHN1cmUgdG8gZW1pdCB0aGUgYG9wZW5lZGAgb3JcbiAgICAgICAgICAgICAgICAvLyBgY2xvc2VkYCBldmVudCwgYmVjYXVzZSB3ZSBtYXkgbm90IGhhdmUgZW1pdHRlZCBpdC4gVGhpcyBjYW4gaGFwcGVuXG4gICAgICAgICAgICAgICAgLy8gLSBpZiB0aGUgdXNlcnMgb3BlbnMgdGhlIHBhbmVsIGFuZCB0aGVyZSBhcmUgbm8gb3B0aW9ucywgYnV0IHRoZVxuICAgICAgICAgICAgICAgIC8vICAgb3B0aW9ucyBjb21lIGluIHNsaWdodGx5IGxhdGVyIG9yIGFzIGEgcmVzdWx0IG9mIHRoZSB2YWx1ZSBjaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAvLyAtIGlmIHRoZSBwYW5lbCBpcyBjbG9zZWQgYWZ0ZXIgdGhlIHVzZXIgZW50ZXJlZCBhIHN0cmluZyB0aGF0IGRpZCBub3QgbWF0Y2ggYW55XG4gICAgICAgICAgICAgICAgLy8gICBvZiB0aGUgYXZhaWxhYmxlIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgLy8gLSBpZiBhIHZhbGlkIHN0cmluZyBpcyBlbnRlcmVkIGFmdGVyIGFuIGludmFsaWQgb25lLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsQ2xvc2luZ0FjdGlvbnM7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgLy8gd2hlbiB0aGUgZmlyc3QgY2xvc2luZyBldmVudCBvY2N1cnMuLi5cbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICApXG4gICAgICAgIC8vIHNldCB0aGUgdmFsdWUsIGNsb3NlIHRoZSBwYW5lbCwgYW5kIGNvbXBsZXRlLlxuICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIG9wZW5lZCBldmVudCBvbmNlIGl0J3Mga25vd24gdGhhdCB0aGUgcGFuZWwgd2lsbCBiZSBzaG93biBhbmQgc3RvcmVzXG4gICAqIHRoZSBzdGF0ZSBvZiB0aGUgdHJpZ2dlciByaWdodCBiZWZvcmUgdGhlIG9wZW5pbmcgc2VxdWVuY2Ugd2FzIGZpbmlzaGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW1pdE9wZW5lZCgpIHtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcGVuZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBhbmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXNzaWduT3B0aW9uVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRvRGlzcGxheSA9XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aFxuICAgICAgICA/IHRoaXMuYXV0b2NvbXBsZXRlLmRpc3BsYXlXaXRoKHZhbHVlKVxuICAgICAgICA6IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihudWxsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8gU2ltcGx5IGZhbGxpbmcgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIGRpc3BsYXkgdmFsdWUgaXMgZmFsc3kgZG9lcyBub3Qgd29yayBwcm9wZXJseS5cbiAgICAvLyBUaGUgZGlzcGxheSB2YWx1ZSBjYW4gYWxzbyBiZSB0aGUgbnVtYmVyIHplcm8gYW5kIHNob3VsZG4ndCBmYWxsIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nLlxuICAgIHRoaXMuX3VwZGF0ZU5hdGl2ZUlucHV0VmFsdWUodG9EaXNwbGF5ICE9IG51bGwgPyB0b0Rpc3BsYXkgOiAnJyk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBJZiBpdCdzIHVzZWQgd2l0aGluIGEgYE1hdEZvcm1GaWVsZGAsIHdlIHNob3VsZCBzZXQgaXQgdGhyb3VnaCB0aGUgcHJvcGVydHkgc28gaXQgY2FuIGdvXG4gICAgLy8gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fY29udHJvbC52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY2xvc2VzIHRoZSBwYW5lbCwgYW5kIGlmIGEgdmFsdWUgaXMgc3BlY2lmaWVkLCBhbHNvIHNldHMgdGhlIGFzc29jaWF0ZWRcbiAgICogY29udHJvbCB0byB0aGF0IHZhbHVlLiBJdCB3aWxsIGFsc28gbWFyayB0aGUgY29udHJvbCBhcyBkaXJ0eSBpZiB0aGlzIGludGVyYWN0aW9uXG4gICAqIHN0ZW1tZWQgZnJvbSB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQ6IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IHRvU2VsZWN0ID0gZXZlbnQgPyBldmVudC5zb3VyY2UgOiB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uO1xuXG4gICAgaWYgKHRvU2VsZWN0KSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24odG9TZWxlY3QpO1xuICAgICAgdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUodG9TZWxlY3QudmFsdWUpO1xuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2hvdWxkIHdhaXQgdW50aWwgdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBvdGhlcndpc2UgdGhlIHZhbHVlXG4gICAgICAvLyBnZXRzIHJlc2V0IHdoaWxlIHRoZSBwYW5lbCBpcyBzdGlsbCBhbmltYXRpbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS4gSXQnbGwgbGlrZWx5IGJyZWFrXG4gICAgICAvLyBzb21lIHRlc3RzIHRvIGNoYW5nZSBpdCBhdCB0aGlzIHBvaW50LlxuICAgICAgdGhpcy5fb25DaGFuZ2UodG9TZWxlY3QudmFsdWUpO1xuICAgICAgcGFuZWwuX2VtaXRTZWxlY3RFdmVudCh0b1NlbGVjdCk7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcGFuZWwucmVxdWlyZVNlbGVjdGlvbiAmJlxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlICE9PSB0aGlzLl92YWx1ZU9uQXR0YWNoXG4gICAgKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCk7XG4gICAgICB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZShudWxsKTtcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBjbGVhcmluZyB0aGUgZm9ybSBjb250cm9sIHZhbHVlLCBvdGhlcndpc2VcbiAgICAgIC8vIHRoZSBvcHRpb25zIG1pZ2h0IGNoYW5nZSB3aGlsZSB0aGUgYW5pbWF0aW9uIGlzIHJ1bm5pbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS5cbiAgICAgIGlmIChwYW5lbC5fYW5pbWF0aW9uRG9uZSkge1xuICAgICAgICBwYW5lbC5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9vbkNoYW5nZShudWxsKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbnkgcHJldmlvdXMgc2VsZWN0ZWQgb3B0aW9uIGFuZCBlbWl0IGEgc2VsZWN0aW9uIGNoYW5nZSBldmVudCBmb3IgdGhpcyBvcHRpb25cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihza2lwOiBNYXRPcHRpb24gfCBudWxsLCBlbWl0RXZlbnQ/OiBib29sZWFuKSB7XG4gICAgLy8gTnVsbCBjaGVja3MgYXJlIG5lY2Vzc2FyeSBoZXJlLCBiZWNhdXNlIHRoZSBhdXRvY29tcGxldGVcbiAgICAvLyBvciBpdHMgb3B0aW9ucyBtYXkgbm90IGhhdmUgYmVlbiBhc3NpZ25lZCB5ZXQuXG4gICAgdGhpcy5hdXRvY29tcGxldGU/Lm9wdGlvbnM/LmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24gIT09IHNraXAgJiYgb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5kZXNlbGVjdChlbWl0RXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoT3ZlcmxheSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpO1xuICAgIH1cblxuICAgIGxldCBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcblxuICAgIGlmICghb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuYXV0b2NvbXBsZXRlLnRlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLCB7XG4gICAgICAgIGlkOiB0aGlzLl9mb3JtRmllbGQ/LmdldExhYmVsSWQoKSxcbiAgICAgIH0pO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl92YWx1ZU9uQXR0YWNoID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24gPSB0aGlzLl9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2FzT3BlbiA9IHRoaXMucGFuZWxPcGVuO1xuXG4gICAgdGhpcy5hdXRvY29tcGxldGUuX2lzT3BlbiA9IHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IHRydWU7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX3NldENvbG9yKHRoaXMuX2Zvcm1GaWVsZD8uY29sb3IpO1xuICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hcHBseU1vZGFsUGFuZWxPd25lcnNoaXAoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZG8gYW4gZXh0cmEgYHBhbmVsT3BlbmAgY2hlY2sgaW4gaGVyZSwgYmVjYXVzZSB0aGVcbiAgICAvLyBhdXRvY29tcGxldGUgd29uJ3QgYmUgc2hvd24gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuICYmIHdhc09wZW4gIT09IHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9lbWl0T3BlbmVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIGNvbWluZyBmcm9tIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBwcml2YXRlIF9oYW5kbGVQYW5lbEtleWRvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAvLyBDbG9zZSB3aGVuIHByZXNzaW5nIEVTQ0FQRSBvciBBTFQgKyBVUF9BUlJPVywgYmFzZWQgb24gdGhlIGExMXkgZ3VpZGVsaW5lcy5cbiAgICAvLyBTZWU6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS1wcmFjdGljZXMtMS4xLyN0ZXh0Ym94LWtleWJvYXJkLWludGVyYWN0aW9uXG4gICAgaWYgKFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykpXG4gICAgKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBoYWQgdHlwZWQgc29tZXRoaW5nIGluIGJlZm9yZSB3ZSBhdXRvc2VsZWN0ZWQgYW4gb3B0aW9uLCBhbmQgdGhleSBkZWNpZGVkXG4gICAgICAvLyB0byBjYW5jZWwgdGhlIHNlbGVjdGlvbiwgcmVzdG9yZSB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGV5IGhhZCB0eXBlZCBpbi5cbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU5hdGl2ZUlucHV0VmFsdWUodGhpcy5fdmFsdWVCZWZvcmVBdXRvU2VsZWN0aW9uID8/ICcnKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLm5leHQoKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgLy8gV2UgbmVlZCB0byBzdG9wIHByb3BhZ2F0aW9uLCBvdGhlcndpc2UgdGhlIGV2ZW50IHdpbGwgZXZlbnR1YWxseVxuICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBVcGRhdGVzIHRoZSBwYW5lbCdzIHZpc2liaWxpdHkgc3RhdGUgYW5kIGFueSB0cmlnZ2VyIHN0YXRlIHRpZWQgdG8gaWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBhbmVsU3RhdGUoKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX3NldFZpc2liaWxpdHkoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBoZXJlIHdlIHN1YnNjcmliZSBhbmQgdW5zdWJzY3JpYmUgYmFzZWQgb24gdGhlIHBhbmVsJ3MgdmlzaWJsaXR5IHN0YXRlLFxuICAgIC8vIGJlY2F1c2UgdGhlIGFjdCBvZiBzdWJzY3JpYmluZyB3aWxsIHByZXZlbnQgZXZlbnRzIGZyb20gcmVhY2hpbmcgb3RoZXIgb3ZlcmxheXMgYW5kXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBibG9jayB0aGUgZXZlbnRzIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXlSZWYhO1xuXG4gICAgICBpZiAoIXRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gVXNlIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gdGFrZSBhZHZhbnRhZ2Ugb2ZcbiAgICAgICAgLy8gdGhlIG92ZXJsYXkgZXZlbnQgdGFyZ2V0aW5nIHByb3ZpZGVkIGJ5IHRoZSBDREsgb3ZlcmxheS5cbiAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IG92ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnN1YnNjcmliZSh0aGlzLl9oYW5kbGVQYW5lbEtleWRvd24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbikge1xuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gdGhlIHBvaW50ZXIgZXZlbnRzIHN0cmVhbSBzbyB0aGF0IGl0IGRvZXNuJ3QgZ2V0IHBpY2tlZCB1cCBieSBvdGhlciBvdmVybGF5cy5cbiAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIHNob3VsZCBzd2l0Y2ggYF9nZXRPdXRzaWRlQ2xpY2tTdHJlYW1gIGV2ZW50dWFsbHkgdG8gdXNlIHRoaXMgc3RyZWFtLFxuICAgICAgICAvLyBidXQgdGhlIGJlaHZpb3IgaXNuJ3QgZXhhY3RseSB0aGUgc2FtZSBhbmQgaXQgZW5kcyB1cCBicmVha2luZyBzb21lIGludGVybmFsIHRlc3RzLlxuICAgICAgICB0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLm91dHNpZGVQb2ludGVyRXZlbnRzKCkuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uID0gdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKCk6IE92ZXJsYXlDb25maWcge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9nZXRPdmVybGF5UG9zaXRpb24oKSxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgd2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyID8/IHVuZGVmaW5lZCxcbiAgICAgIHBhbmVsQ2xhc3M6IHRoaXMuX2RlZmF1bHRzPy5vdmVybGF5UGFuZWxDbGFzcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE92ZXJsYXlQb3NpdGlvbigpOiBQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoUHVzaChmYWxzZSk7XG5cbiAgICB0aGlzLl9zZXRTdHJhdGVneVBvc2l0aW9ucyhzdHJhdGVneSk7XG4gICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgIHJldHVybiBzdHJhdGVneTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneSBiYXNlZCBvbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgc3RhdGUuICovXG4gIHByaXZhdGUgX3NldFN0cmF0ZWd5UG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBwcm92aWRlIGhvcml6b250YWwgZmFsbGJhY2sgcG9zaXRpb25zLCBldmVuIHRob3VnaCBieSBkZWZhdWx0IHRoZSBkcm9wZG93blxuICAgIC8vIHdpZHRoIG1hdGNoZXMgdGhlIGlucHV0LCBiZWNhdXNlIGNvbnN1bWVycyBjYW4gb3ZlcnJpZGUgdGhlIHdpZHRoLiBTZWUgIzE4ODU0LlxuICAgIGNvbnN0IGJlbG93UG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2JvdHRvbScsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICBdO1xuXG4gICAgLy8gVGhlIG92ZXJsYXkgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIHRyaWdnZXIgc2hvdWxkIGhhdmUgc3F1YXJlZCBjb3JuZXJzLCB3aGlsZVxuICAgIC8vIHRoZSBvcHBvc2l0ZSBlbmQgaGFzIHJvdW5kZWQgY29ybmVycy4gV2UgYXBwbHkgYSBDU1MgY2xhc3MgdG8gc3dhcCB0aGVcbiAgICAvLyBib3JkZXItcmFkaXVzIGJhc2VkIG9uIHRoZSBvdmVybGF5IHBvc2l0aW9uLlxuICAgIGNvbnN0IHBhbmVsQ2xhc3MgPSB0aGlzLl9hYm92ZUNsYXNzO1xuICAgIGNvbnN0IGFib3ZlUG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ3RvcCcsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICBdO1xuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBhYm92ZVBvc2l0aW9ucztcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGJlbG93UG9zaXRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbnMgPSBbLi4uYmVsb3dQb3NpdGlvbnMsIC4uLmFib3ZlUG9zaXRpb25zXTtcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhQb3NpdGlvbnMocG9zaXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbm5lY3RlZEVsZW1lbnQoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZFRvKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFBhbmVsV2lkdGgoKTogbnVtYmVyIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUucGFuZWxXaWR0aCB8fCB0aGlzLl9nZXRIb3N0V2lkdGgoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgaW5wdXQgZWxlbWVudCwgc28gdGhlIHBhbmVsIHdpZHRoIGNhbiBtYXRjaCBpdC4gKi9cbiAgcHJpdmF0ZSBfZ2V0SG9zdFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENvbm5lY3RlZEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBhY3RpdmUgaXRlbSB0byAtMS4gVGhpcyBpcyBzbyB0aGF0IHByZXNzaW5nIGFycm93IGtleXMgd2lsbCBhY3RpdmF0ZSB0aGUgY29ycmVjdFxuICAgKiBvcHRpb24uXG4gICAqXG4gICAqIElmIHRoZSBjb25zdW1lciBvcHRlZC1pbiB0byBhdXRvbWF0aWNhbGx5IGFjdGl2YXRhdGluZyB0aGUgZmlyc3Qgb3B0aW9uLCBhY3RpdmF0ZSB0aGUgZmlyc3RcbiAgICogKmVuYWJsZWQqIG9wdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX3Jlc2V0QWN0aXZlSXRlbSgpOiB2b2lkIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcblxuICAgIGlmIChhdXRvY29tcGxldGUuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKSB7XG4gICAgICAvLyBGaW5kIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgKmVuYWJsZWQqIG9wdGlvbi4gQXZvaWQgY2FsbGluZyBgX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbWBcbiAgICAgIC8vIGJlY2F1c2UgaXQgYWN0aXZhdGVzIHRoZSBmaXJzdCBvcHRpb24gdGhhdCBwYXNzZXMgdGhlIHNraXAgcHJlZGljYXRlLCByYXRoZXIgdGhhbiB0aGVcbiAgICAgIC8vIGZpcnN0ICplbmFibGVkKiBvcHRpb24uXG4gICAgICBsZXQgZmlyc3RFbmFibGVkT3B0aW9uSW5kZXggPSAtMTtcblxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGF1dG9jb21wbGV0ZS5vcHRpb25zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBhdXRvY29tcGxldGUub3B0aW9ucy5nZXQoaW5kZXgpITtcbiAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgICAgICBmaXJzdEVuYWJsZWRPcHRpb25JbmRleCA9IGluZGV4O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdXRvY29tcGxldGUuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShmaXJzdEVuYWJsZWRPcHRpb25JbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYW5lbCBjYW4gYmUgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9jYW5PcGVuKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuICFlbGVtZW50LnJlYWRPbmx5ICYmICFlbGVtZW50LmRpc2FibGVkICYmICF0aGlzLmF1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Py5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKiogU2Nyb2xscyB0byBhIHBhcnRpY3VsYXIgb3B0aW9uIGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb09wdGlvbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gR2l2ZW4gdGhhdCB3ZSBhcmUgbm90IGFjdHVhbGx5IGZvY3VzaW5nIGFjdGl2ZSBvcHRpb25zLCB3ZSBtdXN0IG1hbnVhbGx5IGFkanVzdCBzY3JvbGxcbiAgICAvLyB0byByZXZlYWwgb3B0aW9ucyBiZWxvdyB0aGUgZm9sZC4gRmlyc3QsIHdlIGZpbmQgdGhlIG9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcFxuICAgIC8vIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYmVsb3cgdGhlIGZvbGQsIHRoZSBuZXcgc2Nyb2xsVG9wIHdpbGwgYmUgdGhlIG9mZnNldCAtXG4gICAgLy8gdGhlIHBhbmVsIGhlaWdodCArIHRoZSBvcHRpb24gaGVpZ2h0LCBzbyB0aGUgYWN0aXZlIG9wdGlvbiB3aWxsIGJlIGp1c3QgdmlzaWJsZSBhdCB0aGVcbiAgICAvLyBib3R0b20gb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBhYm92ZSB0aGUgdG9wIG9mIHRoZSB2aXNpYmxlIHBhbmVsLCB0aGUgbmV3IHNjcm9sbFRvcFxuICAgIC8vIHdpbGwgYmVjb21lIHRoZSBvZmZzZXQuIElmIHRoYXQgb2Zmc2V0IGlzIHZpc2libGUgd2l0aGluIHRoZSBwYW5lbCBhbHJlYWR5LCB0aGUgc2Nyb2xsVG9wIGlzXG4gICAgLy8gbm90IGFkanVzdGVkLlxuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IGxhYmVsQ291bnQgPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihcbiAgICAgIGluZGV4LFxuICAgICAgYXV0b2NvbXBsZXRlLm9wdGlvbnMsXG4gICAgICBhdXRvY29tcGxldGUub3B0aW9uR3JvdXBzLFxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbGFiZWxDb3VudCA9PT0gMSkge1xuICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAvLyB0b3Agb2YgdGhlIG9wdGlvbiwgYmVjYXVzZSBpdCBhbGxvd3MgdGhlIHVzZXIgdG8gcmVhZCB0aGUgdG9wIGdyb3VwJ3MgbGFiZWwuXG4gICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2UgaWYgKGF1dG9jb21wbGV0ZS5wYW5lbCkge1xuICAgICAgY29uc3Qgb3B0aW9uID0gYXV0b2NvbXBsZXRlLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XTtcblxuICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gb3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpO1xuICAgICAgICBjb25zdCBuZXdTY3JvbGxQb3NpdGlvbiA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICBhdXRvY29tcGxldGUuX2dldFNjcm9sbFRvcCgpLFxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5wYW5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcChuZXdTY3JvbGxQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIHdoaWNoIG1vZGFsIHdlIGhhdmUgbW9kaWZpZWQgdGhlIGBhcmlhLW93bnNgIGF0dHJpYnV0ZSBvZi4gV2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpc1xuICAgKiBpbnNpZGUgYW4gYXJpYS1tb2RhbCwgd2UgYXBwbHkgYXJpYS1vd25zIHRvIHRoZSBwYXJlbnQgbW9kYWwgd2l0aCB0aGUgYGlkYCBvZiB0aGUgb3B0aW9uc1xuICAgKiBwYW5lbC4gVHJhY2sgdGhlIG1vZGFsIHdlIGhhdmUgY2hhbmdlZCBzbyB3ZSBjYW4gdW5kbyB0aGUgY2hhbmdlcyBvbiBkZXN0cm95LlxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhY2tlZE1vZGFsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBpbnNpZGUgb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIGNvbm5lY3RcbiAgICogdGhhdCBtb2RhbCB0byB0aGUgb3B0aW9ucyBwYW5lbCB3aXRoIGBhcmlhLW93bnNgLlxuICAgKlxuICAgKiBGb3Igc29tZSBicm93c2VyICsgc2NyZWVuIHJlYWRlciBjb21iaW5hdGlvbnMsIHdoZW4gbmF2aWdhdGlvbiBpcyBpbnNpZGVcbiAgICogb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIHRoZSBzY3JlZW4gcmVhZGVyIHRyZWF0cyBldmVyeXRoaW5nIG91dHNpZGVcbiAgICogb2YgdGhhdCBtb2RhbCBhcyBoaWRkZW4gb3IgaW52aXNpYmxlLlxuICAgKlxuICAgKiBUaGlzIGNhdXNlcyBhIHByb2JsZW0gd2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpcyBfaW5zaWRlXyBvZiBhIG1vZGFsLCBiZWNhdXNlIHRoZVxuICAgKiBvcHRpb25zIHBhbmVsIGlzIHJlbmRlcmVkIF9vdXRzaWRlXyBvZiB0aGF0IG1vZGFsLCBwcmV2ZW50aW5nIHNjcmVlbiByZWFkZXIgbmF2aWdhdGlvblxuICAgKiBmcm9tIHJlYWNoaW5nIHRoZSBwYW5lbC5cbiAgICpcbiAgICogV2UgY2FuIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUgYnkgYXBwbHlpbmcgYGFyaWEtb3duc2AgdG8gdGhlIG1vZGFsIHdpdGggdGhlIGBpZGAgb2ZcbiAgICogdGhlIG9wdGlvbnMgcGFuZWwuIFRoaXMgZWZmZWN0aXZlbHkgY29tbXVuaWNhdGVzIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHRoYXQgdGhlXG4gICAqIG9wdGlvbnMgcGFuZWwgaXMgcGFydCBvZiB0aGUgc2FtZSBpbnRlcmFjdGlvbiBhcyB0aGUgbW9kYWwuXG4gICAqXG4gICAqIEF0IHRpbWUgb2YgdGhpcyB3cml0aW5nLCB0aGlzIGlzc3VlIGlzIHByZXNlbnQgaW4gVm9pY2VPdmVyLlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2OTRcbiAgICovXG4gIHByaXZhdGUgX2FwcGx5TW9kYWxQYW5lbE93bmVyc2hpcCgpIHtcbiAgICAvLyBUT0RPKGh0dHA6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjY4NTMpOiBjb25zaWRlciBkZS1kdXBsaWNhdGluZyB0aGlzIHdpdGhcbiAgICAvLyB0aGUgYExpdmVBbm5vdW5jZXJgIGFuZCBhbnkgb3RoZXIgdXNhZ2VzLlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHRoZSBzZWxlY3RvciBoZXJlIGlzIGxpbWl0ZWQgdG8gQ0RLIG92ZXJsYXlzIGF0IHRoZSBtb21lbnQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZVxuICAgIC8vIHNlY3Rpb24gb2YgdGhlIERPTSB3ZSBuZWVkIHRvIGxvb2sgdGhyb3VnaC4gVGhpcyBzaG91bGQgY292ZXIgYWxsIHRoZSBjYXNlcyB3ZSBzdXBwb3J0LCBidXRcbiAgICAvLyB0aGUgc2VsZWN0b3IgY2FuIGJlIGV4cGFuZGVkIGlmIGl0IHR1cm5zIG91dCB0byBiZSB0b28gbmFycm93LlxuICAgIGNvbnN0IG1vZGFsID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb3Nlc3QoXG4gICAgICAnYm9keSA+IC5jZGstb3ZlcmxheS1jb250YWluZXIgW2FyaWEtbW9kYWw9XCJ0cnVlXCJdJyxcbiAgICApO1xuXG4gICAgaWYgKCFtb2RhbCkge1xuICAgICAgLy8gTW9zdCBjb21tb25seSwgdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGlzIG5vdCBpbnNpZGUgYSBtb2RhbC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5lbElkID0gdGhpcy5hdXRvY29tcGxldGUuaWQ7XG5cbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgIH1cblxuICAgIGFkZEFyaWFSZWZlcmVuY2VkSWQobW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB0aGlzLl90cmFja2VkTW9kYWwgPSBtb2RhbDtcbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIGxpc3Rib3ggb3ZlcmxheSBlbGVtZW50IGZyb20gdGhlIG1vZGFsIGl0IHdhcyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJGcm9tTW9kYWwoKSB7XG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgY29uc3QgcGFuZWxJZCA9IHRoaXMuYXV0b2NvbXBsZXRlLmlkO1xuXG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgICAgdGhpcy5fdHJhY2tlZE1vZGFsID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==