/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { addAriaReferencedId, removeAriaReferencedId } from '@angular/cdk/a11y';
import { afterNextRender, booleanAttribute, ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, inject, Inject, InjectionToken, Injector, Input, NgZone, Optional, ViewContainerRef, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { _getEventTarget } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition, } from '@angular/material/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { defer, fromEvent, merge, Observable, of as observableOf, Subject, Subscription } from 'rxjs';
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
export const MAT_AUTOCOMPLETE_SCROLL_STRATEGY = new InjectionToken('mat-autocomplete-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
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
        this._initialized = new Subject();
        this._injector = inject(Injector);
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
            return this._initialized.pipe(switchMap(() => this.optionSelections));
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
        this._initialized.next();
        this._initialized.complete();
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
        this._openPanelInternal();
    }
    /** Closes the autocomplete suggestion panel. */
    closePanel() {
        this._resetLabel();
        if (!this._overlayAttached) {
            return;
        }
        if (this.panelOpen) {
            // Only emit if the panel was visible.
            // `afterNextRender` always runs outside of the Angular zone, so all the subscriptions from
            // `_subscribeToClosingActions()` are also outside of the Angular zone.
            // We should manually run in Angular zone to update UI after panel closing.
            this._zone.run(() => {
                this.autocomplete.closed.emit();
            });
        }
        // Only reset if this trigger is the latest one that opened the
        // autocomplete since another may have taken it over.
        if (this.autocomplete._latestOpeningTrigger === this) {
            this.autocomplete._isOpen = false;
            this.autocomplete._latestOpeningTrigger = null;
        }
        this._overlayAttached = false;
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
            removeAriaReferencedId(this._trackedModal, 'aria-owns', this.autocomplete.id);
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
            const formField = this._formField
                ? this._formField.getConnectedOverlayOrigin().nativeElement
                : null;
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
        this._valueOnLastKeydown = this._element.nativeElement.value;
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
                this._openPanelInternal(this._valueOnLastKeydown);
            }
            if (isArrowKey || this.autocomplete._keyManager.activeItem !== prevActiveItem) {
                this._scrollToOption(this.autocomplete._keyManager.activeItemIndex || 0);
                if (this.autocomplete.autoSelectActiveOption && this.activeOption) {
                    if (!this._pendingAutoselectedOption) {
                        this._valueBeforeAutoSelection = this._valueOnLastKeydown;
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
                    const display = this._getDisplayValue(selectedOption.value);
                    if (value !== display) {
                        selectedOption.deselect(false);
                    }
                }
            }
            if (this._canOpen() && this._document.activeElement === event.target) {
                // When the `input` event fires, the input's value will have already changed. This means
                // that if we take the `this._element.nativeElement.value` directly, it'll be one keystroke
                // behind. This can be a problem when the user selects a value, changes a character while
                // the input still has focus and then clicks away (see #28432). To work around it, we
                // capture the value in `keydown` so we can use it here.
                const valueOnAttach = this._valueOnLastKeydown ?? this._element.nativeElement.value;
                this._valueOnLastKeydown = null;
                this._openPanelInternal(valueOnAttach);
            }
        }
    }
    _handleFocus() {
        if (!this._canOpenOnNextFocus) {
            this._canOpenOnNextFocus = true;
        }
        else if (this._canOpen()) {
            this._previousValue = this._element.nativeElement.value;
            this._attachOverlay(this._previousValue);
            this._floatLabel(true);
        }
    }
    _handleClick() {
        if (this._canOpen() && !this.panelOpen) {
            this._openPanelInternal();
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
        const initialRender = new Observable(subscriber => {
            afterNextRender(() => {
                subscriber.next();
            }, { injector: this._injector });
        });
        const optionChanges = this.autocomplete.options.changes.pipe(tap(() => this._positionStrategy.reapplyLastPosition()), 
        // Defer emitting to the stream until the next tick, because changing
        // bindings in here will cause "changed after checked" errors.
        delay(0));
        // When the options are initially rendered, and when the option list changes...
        return (merge(initialRender, optionChanges)
            .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => this._zone.run(() => {
            // `afterNextRender` always runs outside of the Angular zone, thus we have to re-enter
            // the Angular zone. This will lead to change detection being called outside of the Angular
            // zone and the `autocomplete.opened` will also emit outside of the Angular.
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
            return this.panelClosingActions;
        })), 
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
    /** Given a value, returns the string that should be shown within the input. */
    _getDisplayValue(value) {
        const autocomplete = this.autocomplete;
        return autocomplete && autocomplete.displayWith ? autocomplete.displayWith(value) : value;
    }
    _assignOptionValue(value) {
        const toDisplay = this._getDisplayValue(value);
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
    _openPanelInternal(valueOnAttach = this._element.nativeElement.value) {
        this._attachOverlay(valueOnAttach);
        this._floatLabel();
        // Add aria-owns attribute when the autocomplete becomes visible.
        if (this._trackedModal) {
            const panelId = this.autocomplete.id;
            addAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
        }
    }
    _attachOverlay(valueOnAttach) {
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
            this._valueOnAttach = valueOnAttach;
            this._valueOnLastKeydown = null;
            this._closingActionsSubscription = this._subscribeToClosingActions();
        }
        const wasOpen = this.panelOpen;
        this.autocomplete._isOpen = this._overlayAttached = true;
        this.autocomplete._latestOpeningTrigger = this;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatAutocompleteTrigger, deps: [{ token: i0.ElementRef }, { token: i1.Overlay }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: MAT_AUTOCOMPLETE_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: MAT_FORM_FIELD, host: true, optional: true }, { token: DOCUMENT, optional: true }, { token: i3.ViewportRuler }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "18.0.0", type: MatAutocompleteTrigger, isStandalone: true, selector: "input[matAutocomplete], textarea[matAutocomplete]", inputs: { autocomplete: ["matAutocomplete", "autocomplete"], position: ["matAutocompletePosition", "position"], connectedTo: ["matAutocompleteConnectedTo", "connectedTo"], autocompleteAttribute: ["autocomplete", "autocompleteAttribute"], autocompleteDisabled: ["matAutocompleteDisabled", "autocompleteDisabled", booleanAttribute] }, host: { listeners: { "focusin": "_handleFocus()", "blur": "_onTouched()", "input": "_handleInput($event)", "keydown": "_handleKeydown($event)", "click": "_handleClick()" }, properties: { "attr.autocomplete": "autocompleteAttribute", "attr.role": "autocompleteDisabled ? null : \"combobox\"", "attr.aria-autocomplete": "autocompleteDisabled ? null : \"list\"", "attr.aria-activedescendant": "(panelOpen && activeOption) ? activeOption.id : null", "attr.aria-expanded": "autocompleteDisabled ? null : panelOpen.toString()", "attr.aria-controls": "(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id", "attr.aria-haspopup": "autocompleteDisabled ? null : \"listbox\"" }, classAttribute: "mat-mdc-autocomplete-trigger" }, providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR], exportAs: ["matAutocompleteTrigger"], usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatAutocompleteTrigger, decorators: [{
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
                    standalone: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlFLE9BQU8sRUFDTCxlQUFlLEVBRWYsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUVSLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0YsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLE9BQU8sRUFDUCxhQUFhLEdBS2QsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFDN0Isd0JBQXdCLEdBRXpCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLDhCQUE4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QUFXO3NCQUEvQyxLQUFLO3VCQUFDLDRCQUE0QjtnQkFNWixxQkFBcUI7c0JBQTNDLEtBQUs7dUJBQUMsY0FBYztnQkFPckIsb0JBQW9CO3NCQURuQixLQUFLO3VCQUFDLEVBQUMsS0FBSyxFQUFFLHlCQUF5QixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2FkZEFyaWFSZWZlcmVuY2VkSWQsIHJlbW92ZUFyaWFSZWZlcmVuY2VkSWR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIGFmdGVyTmV4dFJlbmRlcixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1csIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtfZ2V0RXZlbnRUYXJnZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgTWF0T3B0aW9uLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBmcm9tRXZlbnQsIG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIG1hcCwgc3dpdGNoTWFwLCB0YWtlLCB0YXAsIHN0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRBdXRvY29tcGxldGVPcmlnaW59IGZyb20gJy4vYXV0b2NvbXBsZXRlLW9yaWdpbic7XG5pbXBvcnQge1xuICBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbiAgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMsXG4gIE1hdEF1dG9jb21wbGV0ZSxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSBhdXRvY29tcGxldGUgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIHVzZSBhbiBhdXRvY29tcGxldGUgdHJpZ2dlciB3aXRob3V0IGEgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihcbiAgICAnQXR0ZW1wdGluZyB0byBvcGVuIGFuIHVuZGVmaW5lZCBpbnN0YW5jZSBvZiBgbWF0LWF1dG9jb21wbGV0ZWAuICcgK1xuICAgICAgJ01ha2Ugc3VyZSB0aGF0IHRoZSBpZCBwYXNzZWQgdG8gdGhlIGBtYXRBdXRvY29tcGxldGVgIGlzIGNvcnJlY3QgYW5kIHRoYXQgJyArXG4gICAgICBcInlvdSdyZSBhdHRlbXB0aW5nIHRvIG9wZW4gaXQgYWZ0ZXIgdGhlIG5nQWZ0ZXJDb250ZW50SW5pdCBob29rLlwiLFxuICApO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLXNjcm9sbC1zdHJhdGVneScsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogKCkgPT4ge1xuICAgICAgY29uc3Qgb3ZlcmxheSA9IGluamVjdChPdmVybGF5KTtcbiAgICAgIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xuICAgIH0sXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcmAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdEF1dG9jb21wbGV0ZV0sIHRleHRhcmVhW21hdEF1dG9jb21wbGV0ZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtYXV0b2NvbXBsZXRlLXRyaWdnZXInLFxuICAgICdbYXR0ci5hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZUF0dHJpYnV0ZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwiY29tYm9ib3hcIicsXG4gICAgJ1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImxpc3RcIicsXG4gICAgJ1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiAnKHBhbmVsT3BlbiAmJiBhY3RpdmVPcHRpb24pID8gYWN0aXZlT3B0aW9uLmlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IHBhbmVsT3Blbi50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnKGF1dG9jb21wbGV0ZURpc2FibGVkIHx8ICFwYW5lbE9wZW4pID8gbnVsbCA6IGF1dG9jb21wbGV0ZT8uaWQnLFxuICAgICdbYXR0ci5hcmlhLWhhc3BvcHVwXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImxpc3Rib3hcIicsXG4gICAgLy8gTm90ZTogd2UgdXNlIGBmb2N1c2luYCwgYXMgb3Bwb3NlZCB0byBgZm9jdXNgLCBpbiBvcmRlciB0byBvcGVuIHRoZSBwYW5lbFxuICAgIC8vIGEgbGl0dGxlIGVhcmxpZXIuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aGVyZSBJRSBkZWxheXMgdGhlIGZvY3VzaW5nIG9mIHRoZSBpbnB1dC5cbiAgICAnKGZvY3VzaW4pJzogJ19oYW5kbGVGb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKScsXG4gICAgJyhpbnB1dCknOiAnX2hhbmRsZUlucHV0KCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICB9LFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZVRyaWdnZXInLFxuICBwcm92aWRlcnM6IFtNQVRfQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlclxuICBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcbiAgcHJpdmF0ZSBfY29tcG9uZW50RGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSBfa2V5ZG93blN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcbiAgcHJpdmF0ZSBfb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuXG4gIC8qKiBPbGQgdmFsdWUgb2YgdGhlIG5hdGl2ZSBpbnB1dC4gVXNlZCB0byB3b3JrIGFyb3VuZCBpc3N1ZXMgd2l0aCB0aGUgYGlucHV0YCBldmVudCBvbiBJRS4gKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNWYWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVmFsdWUgb2YgdGhlIGlucHV0IGVsZW1lbnQgd2hlbiB0aGUgcGFuZWwgd2FzIGF0dGFjaGVkIChldmVuIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zKS4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPbkF0dGFjaDogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcblxuICAvKiogVmFsdWUgb24gdGhlIHByZXZpb3VzIGtleWRvd24gZXZlbnQuICovXG4gIHByaXZhdGUgX3ZhbHVlT25MYXN0S2V5ZG93bjogc3RyaW5nIHwgbnVsbDtcblxuICAvKiogU3RyYXRlZ3kgdGhhdCBpcyB1c2VkIHRvIHBvc2l0aW9uIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5O1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgbGFiZWwgc3RhdGUgaXMgYmVpbmcgb3ZlcnJpZGRlbi4gKi9cbiAgcHJpdmF0ZSBfbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzdWJzY3JpcHRpb24gZm9yIGNsb3NpbmcgYWN0aW9ucyAoc29tZSBhcmUgYm91bmQgdG8gZG9jdW1lbnQpLiAqL1xuICBwcml2YXRlIF9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdmlld3BvcnQgc2l6ZSBjaGFuZ2VzLiAqL1xuICBwcml2YXRlIF92aWV3cG9ydFN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGNhbiBvcGVuIHRoZSBuZXh0IHRpbWUgaXQgaXMgZm9jdXNlZC4gVXNlZCB0byBwcmV2ZW50IGEgZm9jdXNlZCxcbiAgICogY2xvc2VkIGF1dG9jb21wbGV0ZSBmcm9tIGJlaW5nIHJlb3BlbmVkIGlmIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYnJvd3NlciB0YWIgYW5kIHRoZW5cbiAgICogY29tZXMgYmFjay5cbiAgICovXG4gIHByaXZhdGUgX2Nhbk9wZW5Pbk5leHRGb2N1cyA9IHRydWU7XG5cbiAgLyoqIFZhbHVlIGluc2lkZSB0aGUgaW5wdXQgYmVmb3JlIHdlIGF1dG8tc2VsZWN0ZWQgYW4gb3B0aW9uLiAqL1xuICBwcml2YXRlIF92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3VycmVudCBvcHRpb24gdGhhdCB3ZSBoYXZlIGF1dG8tc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZyxcbiAgICogYnV0IHdoaWNoIGhhc24ndCBiZWVuIHByb3BhZ2F0ZWQgdG8gdGhlIG1vZGVsIHZhbHVlIHlldC5cbiAgICovXG4gIHByaXZhdGUgX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb246IE1hdE9wdGlvbiB8IG51bGw7XG5cbiAgLyoqIFN0cmVhbSBvZiBrZXlib2FyZCBldmVudHMgdGhhdCBjYW4gY2xvc2UgdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbG9zZUtleUV2ZW50U3RyZWFtID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWQuIE5lZWRzIHRvIGJlIGFuXG4gICAqIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHVzZXIgYmx1cnJlZCB0aGUgd2luZG93IHdoaWxlIHRoZSBhdXRvY29tcGxldGUgaXMgZm9jdXNlZCwgaXQgbWVhbnMgdGhhdCBpdCdsbCBiZVxuICAgIC8vIHJlZm9jdXNlZCB3aGVuIHRoZXkgY29tZSBiYWNrLiBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBza2lwIHRoZSBmaXJzdCBmb2N1cyBldmVudCwgaWYgdGhlXG4gICAgLy8gcGFuZSB3YXMgY2xvc2VkLCBpbiBvcmRlciB0byBhdm9pZCByZW9wZW5pbmcgaXQgdW5pbnRlbnRpb25hbGx5LlxuICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9XG4gICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5wYW5lbE9wZW47XG4gIH07XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gYXV0b2NvbXBsZXRlIGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0byBiZSBhdHRhY2hlZCB0byB0aGlzIHRyaWdnZXIuICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlJykgYXV0b2NvbXBsZXRlOiBNYXRBdXRvY29tcGxldGU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgcmVsYXRpdmUgdG8gdGhlIHRyaWdnZXIgZWxlbWVudC4gQSBwb3NpdGlvbiBvZiBgYXV0b2BcbiAgICogd2lsbCByZW5kZXIgdGhlIHBhbmVsIHVuZGVybmVhdGggdGhlIHRyaWdnZXIgaWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIGZvciBpdCB0byBmaXQgaW5cbiAgICogdGhlIHZpZXdwb3J0LCBvdGhlcndpc2UgdGhlIHBhbmVsIHdpbGwgYmUgc2hvd24gYWJvdmUgaXQuIElmIHRoZSBwb3NpdGlvbiBpcyBzZXQgdG9cbiAgICogYGFib3ZlYCBvciBgYmVsb3dgLCB0aGUgcGFuZWwgd2lsbCBhbHdheXMgYmUgc2hvd24gYWJvdmUgb3IgYmVsb3cgdGhlIHRyaWdnZXIuIG5vIG1hdHRlclxuICAgKiB3aGV0aGVyIGl0IGZpdHMgY29tcGxldGVseSBpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZVBvc2l0aW9uJykgcG9zaXRpb246ICdhdXRvJyB8ICdhYm92ZScgfCAnYmVsb3cnID0gJ2F1dG8nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgcmVsYXRpdmUgdG8gd2hpY2ggdG8gcG9zaXRpb24gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZUNvbm5lY3RlZFRvJykgY29ubmVjdGVkVG86IE1hdEF1dG9jb21wbGV0ZU9yaWdpbjtcblxuICAvKipcbiAgICogYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIHRvIGJlIHNldCBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGVBdHRyaWJ1dGU6IHN0cmluZyA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBlbGVtZW50IHdpbGxcbiAgICogYWN0IGFzIGEgcmVndWxhciBpbnB1dCBhbmQgdGhlIHVzZXIgd29uJ3QgYmUgYWJsZSB0byBvcGVuIHRoZSBwYW5lbC5cbiAgICovXG4gIEBJbnB1dCh7YWxpYXM6ICdtYXRBdXRvY29tcGxldGVEaXNhYmxlZCcsIHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGF1dG9jb21wbGV0ZURpc2FibGVkOiBib29sZWFuO1xuXG4gIHByaXZhdGUgX2luaXRpYWxpemVkID0gbmV3IFN1YmplY3QoKTtcblxuICBwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIEBIb3N0KCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdHM/OiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB8IG51bGwsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBhYm92ZSB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX2Fib3ZlQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtcGFuZWwtYWJvdmUnO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplZC5uZXh0KCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQuY29tcGxldGUoKTtcblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgdGhpcy5fcG9zaXRpb25TdHJhdGVneSkge1xuICAgICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnModGhpcy5fcG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl92aWV3cG9ydFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2NvbXBvbmVudERlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5fZGVzdHJveVBhbmVsKCk7XG4gICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2NsZWFyRnJvbU1vZGFsKCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiYgdGhpcy5hdXRvY29tcGxldGUuc2hvd1BhbmVsO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXlBdHRhY2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBPcGVucyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIG9wZW5QYW5lbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vcGVuUGFuZWxJbnRlcm5hbCgpO1xuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIGNsb3NlUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVzZXRMYWJlbCgpO1xuXG4gICAgaWYgKCF0aGlzLl9vdmVybGF5QXR0YWNoZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIC8vIE9ubHkgZW1pdCBpZiB0aGUgcGFuZWwgd2FzIHZpc2libGUuXG4gICAgICAvLyBgYWZ0ZXJOZXh0UmVuZGVyYCBhbHdheXMgcnVucyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUsIHNvIGFsbCB0aGUgc3Vic2NyaXB0aW9ucyBmcm9tXG4gICAgICAvLyBgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKWAgYXJlIGFsc28gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICAgICAgLy8gV2Ugc2hvdWxkIG1hbnVhbGx5IHJ1biBpbiBBbmd1bGFyIHpvbmUgdG8gdXBkYXRlIFVJIGFmdGVyIHBhbmVsIGNsb3NpbmcuXG4gICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJlc2V0IGlmIHRoaXMgdHJpZ2dlciBpcyB0aGUgbGF0ZXN0IG9uZSB0aGF0IG9wZW5lZCB0aGVcbiAgICAvLyBhdXRvY29tcGxldGUgc2luY2UgYW5vdGhlciBtYXkgaGF2ZSB0YWtlbiBpdCBvdmVyLlxuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZS5fbGF0ZXN0T3BlbmluZ1RyaWdnZXIgPT09IHRoaXMpIHtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9sYXRlc3RPcGVuaW5nVHJpZ2dlciA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBpbiBzb21lIGNhc2VzIHRoaXMgY2FuIGVuZCB1cCBiZWluZyBjYWxsZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgLy8gQWRkIGEgY2hlY2sgdG8gZW5zdXJlIHRoYXQgd2UgZG9uJ3QgdHJ5IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG9uIGEgZGVzdHJveWVkIHZpZXcuXG4gICAgaWYgKCF0aGlzLl9jb21wb25lbnREZXN0cm95ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LCBiZWNhdXNlXG4gICAgICAvLyBgZnJvbUV2ZW50YCBkb2Vzbid0IHNlZW0gdG8gZG8gaXQgYXQgdGhlIHByb3BlciB0aW1lLlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGxhYmVsIGlzIHJlc2V0IHdoZW4gdGhlXG4gICAgICAvLyB1c2VyIGNsaWNrcyBvdXRzaWRlLlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhcmlhLW93bnMgYXR0cmlidXRlIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBpcyBubyBsb25nZXIgdmlzaWJsZS5cbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHRoaXMuYXV0b2NvbXBsZXRlLmlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsIHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgYWxsIG9wdGlvbnNcbiAgICogd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5QXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyZWFtIG9mIGFjdGlvbnMgdGhhdCBzaG91bGQgY2xvc2UgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCwgaW5jbHVkaW5nXG4gICAqIHdoZW4gYW4gb3B0aW9uIGlzIHNlbGVjdGVkLCBvbiBibHVyLCBhbmQgd2hlbiBUQUIgaXMgcHJlc3NlZC5cbiAgICovXG4gIGdldCBwYW5lbENsb3NpbmdBY3Rpb25zKCk6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlIHwgbnVsbD4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9ucyxcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKSxcbiAgICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0sXG4gICAgICB0aGlzLl9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKSxcbiAgICAgIHRoaXMuX292ZXJsYXlSZWZcbiAgICAgICAgPyB0aGlzLl9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSlcbiAgICAgICAgOiBvYnNlcnZhYmxlT2YoKSxcbiAgICApLnBpcGUoXG4gICAgICAvLyBOb3JtYWxpemUgdGhlIG91dHB1dCBzbyB3ZSByZXR1cm4gYSBjb25zaXN0ZW50IHR5cGUuXG4gICAgICBtYXAoZXZlbnQgPT4gKGV2ZW50IGluc3RhbmNlb2YgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlID8gZXZlbnQgOiBudWxsKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2hhbmdlcyB0byB0aGUgc2VsZWN0aW9uIHN0YXRlIG9mIHRoZSBhdXRvY29tcGxldGUgb3B0aW9ucy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmF1dG9jb21wbGV0ZSA/IHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMgOiBudWxsO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIGFueSBzdWJzY3JpYmVycyBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAsIHRoZSBgYXV0b2NvbXBsZXRlYCB3aWxsIGJlIHVuZGVmaW5lZC5cbiAgICAvLyBSZXR1cm4gYSBzdHJlYW0gdGhhdCB3ZSdsbCByZXBsYWNlIHdpdGggdGhlIHJlYWwgb25lIG9uY2UgZXZlcnl0aGluZyBpcyBpbiBwbGFjZS5cbiAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQucGlwZShzd2l0Y2hNYXAoKCkgPT4gdGhpcy5vcHRpb25TZWxlY3Rpb25zKSk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogVGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uLCBjb2VyY2VkIHRvIE1hdE9wdGlvbiB0eXBlLiAqL1xuICBnZXQgYWN0aXZlT3B0aW9uKCk6IE1hdE9wdGlvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIHByaXZhdGUgX2dldE91dHNpZGVDbGlja1N0cmVhbSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PixcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ2F1eGNsaWNrJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PixcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ3RvdWNoZW5kJykgYXMgT2JzZXJ2YWJsZTxUb3VjaEV2ZW50PixcbiAgICApLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAvLyBJZiB3ZSdyZSBpbiB0aGUgU2hhZG93IERPTSwgdGhlIGV2ZW50IHRhcmdldCB3aWxsIGJlIHRoZSBzaGFkb3cgcm9vdCwgc28gd2UgaGF2ZSB0b1xuICAgICAgICAvLyBmYWxsIGJhY2sgdG8gY2hlY2sgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIHBhdGggb2YgdGhlIGNsaWNrIGV2ZW50LlxuICAgICAgICBjb25zdCBjbGlja1RhcmdldCA9IF9nZXRFdmVudFRhcmdldDxIVE1MRWxlbWVudD4oZXZlbnQpITtcbiAgICAgICAgY29uc3QgZm9ybUZpZWxkID0gdGhpcy5fZm9ybUZpZWxkXG4gICAgICAgICAgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGNvbnN0IGN1c3RvbU9yaWdpbiA9IHRoaXMuY29ubmVjdGVkVG8gPyB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiZcbiAgICAgICAgICBjbGlja1RhcmdldCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgLy8gTm9ybWFsbHkgZm9jdXMgbW92ZXMgaW5zaWRlIGBtb3VzZWRvd25gIHNvIHRoaXMgY29uZGl0aW9uIHdpbGwgYWxtb3N0IGFsd2F5cyBiZVxuICAgICAgICAgIC8vIHRydWUuIEl0cyBtYWluIHB1cnBvc2UgaXMgdG8gaGFuZGxlIHRoZSBjYXNlIHdoZXJlIHRoZSBpbnB1dCBpcyBmb2N1c2VkIGZyb20gYW5cbiAgICAgICAgICAvLyBvdXRzaWRlIGNsaWNrIHdoaWNoIHByb3BhZ2F0ZXMgdXAgdG8gdGhlIGBib2R5YCBsaXN0ZW5lciB3aXRoaW4gdGhlIHNhbWUgc2VxdWVuY2VcbiAgICAgICAgICAvLyBhbmQgY2F1c2VzIHRoZSBwYW5lbCB0byBjbG9zZSBpbW1lZGlhdGVseSAoc2VlICMzMTA2KS5cbiAgICAgICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAoIWN1c3RvbU9yaWdpbiB8fCAhY3VzdG9tT3JpZ2luLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAhIXRoaXMuX292ZXJsYXlSZWYgJiZcbiAgICAgICAgICAhdGhpcy5fb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jb250YWlucyhjbGlja1RhcmdldClcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZSh2YWx1ZSkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSkge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgfVxuXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaGFzTW9kaWZpZXIgPSBoYXNNb2RpZmllcktleShldmVudCk7XG5cbiAgICAvLyBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvbiBvbiBhbGwgZXNjYXBlIGtleSBwcmVzc2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5IHRvIGJyaW5nIElFXG4gICAgLy8gaW4gbGluZSB3aXRoIG90aGVyIGJyb3dzZXJzLiBCeSBkZWZhdWx0LCBwcmVzc2luZyBlc2NhcGUgb24gSUUgd2lsbCBjYXVzZSBpdCB0byByZXZlcnRcbiAgICAvLyB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGF0IGl0IGhhZCBvbiBmb2N1cywgaG93ZXZlciBpdCB3b24ndCBkaXNwYXRjaCBhbnkgZXZlbnRzXG4gICAgLy8gd2hpY2ggbWVhbnMgdGhhdCB0aGUgbW9kZWwgdmFsdWUgd2lsbCBiZSBvdXQgb2Ygc3luYyB3aXRoIHRoZSB2aWV3LlxuICAgIGlmIChrZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlT25MYXN0S2V5ZG93biA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbiAmJiBrZXlDb2RlID09PSBFTlRFUiAmJiB0aGlzLnBhbmVsT3BlbiAmJiAhaGFzTW9kaWZpZXIpIHtcbiAgICAgIHRoaXMuYWN0aXZlT3B0aW9uLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvY29tcGxldGUpIHtcbiAgICAgIGNvbnN0IHByZXZBY3RpdmVJdGVtID0gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbTtcbiAgICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBVUF9BUlJPVyB8fCBrZXlDb2RlID09PSBET1dOX0FSUk9XO1xuXG4gICAgICBpZiAoa2V5Q29kZSA9PT0gVEFCIHx8IChpc0Fycm93S2V5ICYmICFoYXNNb2RpZmllciAmJiB0aGlzLnBhbmVsT3BlbikpIHtcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiB0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgICAgdGhpcy5fb3BlblBhbmVsSW50ZXJuYWwodGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXJyb3dLZXkgfHwgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSAhPT0gcHJldkFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9PcHRpb24odGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuXG4gICAgICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZS5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uICYmIHRoaXMuYWN0aXZlT3B0aW9uKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb24gPSB0aGlzLl92YWx1ZU9uTGFzdEtleWRvd247XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IHRoaXMuYWN0aXZlT3B0aW9uO1xuICAgICAgICAgIHRoaXMuX2Fzc2lnbk9wdGlvblZhbHVlKHRoaXMuYWN0aXZlT3B0aW9uLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBsZXQgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAvLyBCYXNlZCBvbiBgTnVtYmVyVmFsdWVBY2Nlc3NvcmAgZnJvbSBmb3Jtcy5cbiAgICBpZiAodGFyZ2V0LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbnB1dCBoYXMgYSBwbGFjZWhvbGRlciwgSUUgd2lsbCBmaXJlIHRoZSBgaW5wdXRgIGV2ZW50IG9uIHBhZ2UgbG9hZCxcbiAgICAvLyBmb2N1cyBhbmQgYmx1ciwgaW4gYWRkaXRpb24gdG8gd2hlbiB0aGUgdXNlciBhY3R1YWxseSBjaGFuZ2VkIHRoZSB2YWx1ZS4gVG9cbiAgICAvLyBmaWx0ZXIgb3V0IGFsbCBvZiB0aGUgZXh0cmEgZXZlbnRzLCB3ZSBzYXZlIHRoZSB2YWx1ZSBvbiBmb2N1cyBhbmQgYmV0d2VlblxuICAgIC8vIGBpbnB1dGAgZXZlbnRzLCBhbmQgd2UgY2hlY2sgd2hldGhlciBpdCBjaGFuZ2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84ODU3NDcvXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uID0gbnVsbDtcblxuICAgICAgLy8gSWYgc2VsZWN0aW9uIGlzIHJlcXVpcmVkIHdlIGRvbid0IHdyaXRlIHRvIHRoZSBDVkEgd2hpbGUgdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgLy8gQXQgdGhlIGVuZCBvZiB0aGUgc2VsZWN0aW9uIGVpdGhlciB0aGUgdXNlciB3aWxsIGhhdmUgcGlja2VkIHNvbWV0aGluZ1xuICAgICAgLy8gb3Igd2UnbGwgcmVzZXQgdGhlIHZhbHVlIGJhY2sgdG8gbnVsbC5cbiAgICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUgfHwgIXRoaXMuYXV0b2NvbXBsZXRlLnJlcXVpcmVTZWxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihudWxsLCBmYWxzZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxPcGVuICYmICF0aGlzLmF1dG9jb21wbGV0ZS5yZXF1aXJlU2VsZWN0aW9uKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSBkb24ndCByZXNldCB0aGlzIHdoZW4gYHJlcXVpcmVTZWxlY3Rpb25gIGlzIGVuYWJsZWQsXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIG9wdGlvbiB3aWxsIGJlIHJlc2V0IHdoZW4gdGhlIHBhbmVsIGlzIGNsb3NlZC5cbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zPy5maW5kKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0ZWQpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAgIGNvbnN0IGRpc3BsYXkgPSB0aGlzLl9nZXREaXNwbGF5VmFsdWUoc2VsZWN0ZWRPcHRpb24udmFsdWUpO1xuXG4gICAgICAgICAgaWYgKHZhbHVlICE9PSBkaXNwbGF5KSB7XG4gICAgICAgICAgICBzZWxlY3RlZE9wdGlvbi5kZXNlbGVjdChmYWxzZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIC8vIFdoZW4gdGhlIGBpbnB1dGAgZXZlbnQgZmlyZXMsIHRoZSBpbnB1dCdzIHZhbHVlIHdpbGwgaGF2ZSBhbHJlYWR5IGNoYW5nZWQuIFRoaXMgbWVhbnNcbiAgICAgICAgLy8gdGhhdCBpZiB3ZSB0YWtlIHRoZSBgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlYCBkaXJlY3RseSwgaXQnbGwgYmUgb25lIGtleXN0cm9rZVxuICAgICAgICAvLyBiZWhpbmQuIFRoaXMgY2FuIGJlIGEgcHJvYmxlbSB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYSB2YWx1ZSwgY2hhbmdlcyBhIGNoYXJhY3RlciB3aGlsZVxuICAgICAgICAvLyB0aGUgaW5wdXQgc3RpbGwgaGFzIGZvY3VzIGFuZCB0aGVuIGNsaWNrcyBhd2F5IChzZWUgIzI4NDMyKS4gVG8gd29yayBhcm91bmQgaXQsIHdlXG4gICAgICAgIC8vIGNhcHR1cmUgdGhlIHZhbHVlIGluIGBrZXlkb3duYCBzbyB3ZSBjYW4gdXNlIGl0IGhlcmUuXG4gICAgICAgIGNvbnN0IHZhbHVlT25BdHRhY2ggPSB0aGlzLl92YWx1ZU9uTGFzdEtleWRvd24gPz8gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICB0aGlzLl92YWx1ZU9uTGFzdEtleWRvd24gPSBudWxsO1xuICAgICAgICB0aGlzLl9vcGVuUGFuZWxJbnRlcm5hbCh2YWx1ZU9uQXR0YWNoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMpIHtcbiAgICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgIHRoaXMuX3ByZXZpb3VzVmFsdWUgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICB0aGlzLl9hdHRhY2hPdmVybGF5KHRoaXMuX3ByZXZpb3VzVmFsdWUpO1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nhbk9wZW4oKSAmJiAhdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX29wZW5QYW5lbEludGVybmFsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluIFwiYXV0b1wiIG1vZGUsIHRoZSBsYWJlbCB3aWxsIGFuaW1hdGUgZG93biBhcyBzb29uIGFzIGZvY3VzIGlzIGxvc3QuXG4gICAqIFRoaXMgY2F1c2VzIHRoZSB2YWx1ZSB0byBqdW1wIHdoZW4gc2VsZWN0aW5nIGFuIG9wdGlvbiB3aXRoIHRoZSBtb3VzZS5cbiAgICogVGhpcyBtZXRob2QgbWFudWFsbHkgZmxvYXRzIHRoZSBsYWJlbCB1bnRpbCB0aGUgcGFuZWwgY2FuIGJlIGNsb3NlZC5cbiAgICogQHBhcmFtIHNob3VsZEFuaW1hdGUgV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGJlIGFuaW1hdGVkIHdoZW4gaXQgaXMgZmxvYXRlZC5cbiAgICovXG4gIHByaXZhdGUgX2Zsb2F0TGFiZWwoc2hvdWxkQW5pbWF0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCAmJiB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9PT0gJ2F1dG8nKSB7XG4gICAgICBpZiAoc2hvdWxkQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIElmIHRoZSBsYWJlbCBoYXMgYmVlbiBtYW51YWxseSBlbGV2YXRlZCwgcmV0dXJuIGl0IHRvIGl0cyBub3JtYWwgc3RhdGUuICovXG4gIHByaXZhdGUgX3Jlc2V0TGFiZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCkge1xuICAgICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICAgIHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBsaXN0ZW5zIHRvIGEgc3RyZWFtIG9mIHBhbmVsIGNsb3NpbmcgYWN0aW9ucyBhbmQgcmVzZXRzIHRoZVxuICAgKiBzdHJlYW0gZXZlcnkgdGltZSB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy5cbiAgICovXG4gIHByaXZhdGUgX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBpbml0aWFsUmVuZGVyID0gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgICBhZnRlck5leHRSZW5kZXIoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoKTtcbiAgICAgICAgfSxcbiAgICAgICAge2luamVjdG9yOiB0aGlzLl9pbmplY3Rvcn0sXG4gICAgICApO1xuICAgIH0pO1xuICAgIGNvbnN0IG9wdGlvbkNoYW5nZXMgPSB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgIHRhcCgoKSA9PiB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5LnJlYXBwbHlMYXN0UG9zaXRpb24oKSksXG4gICAgICAvLyBEZWZlciBlbWl0dGluZyB0byB0aGUgc3RyZWFtIHVudGlsIHRoZSBuZXh0IHRpY2ssIGJlY2F1c2UgY2hhbmdpbmdcbiAgICAgIC8vIGJpbmRpbmdzIGluIGhlcmUgd2lsbCBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICAgIGRlbGF5KDApLFxuICAgICk7XG5cbiAgICAvLyBXaGVuIHRoZSBvcHRpb25zIGFyZSBpbml0aWFsbHkgcmVuZGVyZWQsIGFuZCB3aGVuIHRoZSBvcHRpb24gbGlzdCBjaGFuZ2VzLi4uXG4gICAgcmV0dXJuIChcbiAgICAgIG1lcmdlKGluaXRpYWxSZW5kZXIsIG9wdGlvbkNoYW5nZXMpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIC8vIGNyZWF0ZSBhIG5ldyBzdHJlYW0gb2YgcGFuZWxDbG9zaW5nQWN0aW9ucywgcmVwbGFjaW5nIGFueSBwcmV2aW91cyBzdHJlYW1zXG4gICAgICAgICAgLy8gdGhhdCB3ZXJlIGNyZWF0ZWQsIGFuZCBmbGF0dGVuIGl0IHNvIG91ciBzdHJlYW0gb25seSBlbWl0cyBjbG9zaW5nIGV2ZW50cy4uLlxuICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PlxuICAgICAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBgYWZ0ZXJOZXh0UmVuZGVyYCBhbHdheXMgcnVucyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUsIHRodXMgd2UgaGF2ZSB0byByZS1lbnRlclxuICAgICAgICAgICAgICAvLyB0aGUgQW5ndWxhciB6b25lLiBUaGlzIHdpbGwgbGVhZCB0byBjaGFuZ2UgZGV0ZWN0aW9uIGJlaW5nIGNhbGxlZCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyXG4gICAgICAgICAgICAgIC8vIHpvbmUgYW5kIHRoZSBgYXV0b2NvbXBsZXRlLm9wZW5lZGAgd2lsbCBhbHNvIGVtaXQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhci5cbiAgICAgICAgICAgICAgY29uc3Qgd2FzT3BlbiA9IHRoaXMucGFuZWxPcGVuO1xuICAgICAgICAgICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGFuZWxTdGF0ZSgpO1xuICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBgcGFuZWxPcGVuYCBzdGF0ZSBjaGFuZ2VkLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBlbWl0IHRoZSBgb3BlbmVkYCBvclxuICAgICAgICAgICAgICAgIC8vIGBjbG9zZWRgIGV2ZW50LCBiZWNhdXNlIHdlIG1heSBub3QgaGF2ZSBlbWl0dGVkIGl0LiBUaGlzIGNhbiBoYXBwZW5cbiAgICAgICAgICAgICAgICAvLyAtIGlmIHRoZSB1c2VycyBvcGVucyB0aGUgcGFuZWwgYW5kIHRoZXJlIGFyZSBubyBvcHRpb25zLCBidXQgdGhlXG4gICAgICAgICAgICAgICAgLy8gICBvcHRpb25zIGNvbWUgaW4gc2xpZ2h0bHkgbGF0ZXIgb3IgYXMgYSByZXN1bHQgb2YgdGhlIHZhbHVlIGNoYW5naW5nLFxuICAgICAgICAgICAgICAgIC8vIC0gaWYgdGhlIHBhbmVsIGlzIGNsb3NlZCBhZnRlciB0aGUgdXNlciBlbnRlcmVkIGEgc3RyaW5nIHRoYXQgZGlkIG5vdCBtYXRjaCBhbnlcbiAgICAgICAgICAgICAgICAvLyAgIG9mIHRoZSBhdmFpbGFibGUgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAvLyAtIGlmIGEgdmFsaWQgc3RyaW5nIGlzIGVudGVyZWQgYWZ0ZXIgYW4gaW52YWxpZCBvbmUuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9lbWl0T3BlbmVkKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxDbG9zaW5nQWN0aW9ucztcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICksXG4gICAgICAgICAgLy8gd2hlbiB0aGUgZmlyc3QgY2xvc2luZyBldmVudCBvY2N1cnMuLi5cbiAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICApXG4gICAgICAgIC8vIHNldCB0aGUgdmFsdWUsIGNsb3NlIHRoZSBwYW5lbCwgYW5kIGNvbXBsZXRlLlxuICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMuX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgdGhlIG9wZW5lZCBldmVudCBvbmNlIGl0J3Mga25vd24gdGhhdCB0aGUgcGFuZWwgd2lsbCBiZSBzaG93biBhbmQgc3RvcmVzXG4gICAqIHRoZSBzdGF0ZSBvZiB0aGUgdHJpZ2dlciByaWdodCBiZWZvcmUgdGhlIG9wZW5pbmcgc2VxdWVuY2Ugd2FzIGZpbmlzaGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZW1pdE9wZW5lZCgpIHtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcGVuZWQuZW1pdCgpO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBhbmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqIEdpdmVuIGEgdmFsdWUsIHJldHVybnMgdGhlIHN0cmluZyB0aGF0IHNob3VsZCBiZSBzaG93biB3aXRoaW4gdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9nZXREaXNwbGF5VmFsdWU8VD4odmFsdWU6IFQpOiBUIHwgc3RyaW5nIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcbiAgICByZXR1cm4gYXV0b2NvbXBsZXRlICYmIGF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aCA/IGF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aCh2YWx1ZSkgOiB2YWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2lnbk9wdGlvblZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0b0Rpc3BsYXkgPSB0aGlzLl9nZXREaXNwbGF5VmFsdWUodmFsdWUpO1xuXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihudWxsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy8gU2ltcGx5IGZhbGxpbmcgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIGRpc3BsYXkgdmFsdWUgaXMgZmFsc3kgZG9lcyBub3Qgd29yayBwcm9wZXJseS5cbiAgICAvLyBUaGUgZGlzcGxheSB2YWx1ZSBjYW4gYWxzbyBiZSB0aGUgbnVtYmVyIHplcm8gYW5kIHNob3VsZG4ndCBmYWxsIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nLlxuICAgIHRoaXMuX3VwZGF0ZU5hdGl2ZUlucHV0VmFsdWUodG9EaXNwbGF5ICE9IG51bGwgPyB0b0Rpc3BsYXkgOiAnJyk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBJZiBpdCdzIHVzZWQgd2l0aGluIGEgYE1hdEZvcm1GaWVsZGAsIHdlIHNob3VsZCBzZXQgaXQgdGhyb3VnaCB0aGUgcHJvcGVydHkgc28gaXQgY2FuIGdvXG4gICAgLy8gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fY29udHJvbC52YWx1ZSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY2xvc2VzIHRoZSBwYW5lbCwgYW5kIGlmIGEgdmFsdWUgaXMgc3BlY2lmaWVkLCBhbHNvIHNldHMgdGhlIGFzc29jaWF0ZWRcbiAgICogY29udHJvbCB0byB0aGF0IHZhbHVlLiBJdCB3aWxsIGFsc28gbWFyayB0aGUgY29udHJvbCBhcyBkaXJ0eSBpZiB0aGlzIGludGVyYWN0aW9uXG4gICAqIHN0ZW1tZWQgZnJvbSB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQ6IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IHRvU2VsZWN0ID0gZXZlbnQgPyBldmVudC5zb3VyY2UgOiB0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uO1xuXG4gICAgaWYgKHRvU2VsZWN0KSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24odG9TZWxlY3QpO1xuICAgICAgdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUodG9TZWxlY3QudmFsdWUpO1xuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2hvdWxkIHdhaXQgdW50aWwgdGhlIGFuaW1hdGlvbiBpcyBkb25lLCBvdGhlcndpc2UgdGhlIHZhbHVlXG4gICAgICAvLyBnZXRzIHJlc2V0IHdoaWxlIHRoZSBwYW5lbCBpcyBzdGlsbCBhbmltYXRpbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS4gSXQnbGwgbGlrZWx5IGJyZWFrXG4gICAgICAvLyBzb21lIHRlc3RzIHRvIGNoYW5nZSBpdCBhdCB0aGlzIHBvaW50LlxuICAgICAgdGhpcy5fb25DaGFuZ2UodG9TZWxlY3QudmFsdWUpO1xuICAgICAgcGFuZWwuX2VtaXRTZWxlY3RFdmVudCh0b1NlbGVjdCk7XG4gICAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgcGFuZWwucmVxdWlyZVNlbGVjdGlvbiAmJlxuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlICE9PSB0aGlzLl92YWx1ZU9uQXR0YWNoXG4gICAgKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCk7XG4gICAgICB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZShudWxsKTtcbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBhbmltYXRpb24gdG8gZmluaXNoIGJlZm9yZSBjbGVhcmluZyB0aGUgZm9ybSBjb250cm9sIHZhbHVlLCBvdGhlcndpc2VcbiAgICAgIC8vIHRoZSBvcHRpb25zIG1pZ2h0IGNoYW5nZSB3aGlsZSB0aGUgYW5pbWF0aW9uIGlzIHJ1bm5pbmcgd2hpY2ggbG9va3MgZ2xpdGNoeS5cbiAgICAgIGlmIChwYW5lbC5fYW5pbWF0aW9uRG9uZSkge1xuICAgICAgICBwYW5lbC5fYW5pbWF0aW9uRG9uZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9vbkNoYW5nZShudWxsKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZShudWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbnkgcHJldmlvdXMgc2VsZWN0ZWQgb3B0aW9uIGFuZCBlbWl0IGEgc2VsZWN0aW9uIGNoYW5nZSBldmVudCBmb3IgdGhpcyBvcHRpb25cbiAgICovXG4gIHByaXZhdGUgX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihza2lwOiBNYXRPcHRpb24gfCBudWxsLCBlbWl0RXZlbnQ/OiBib29sZWFuKSB7XG4gICAgLy8gTnVsbCBjaGVja3MgYXJlIG5lY2Vzc2FyeSBoZXJlLCBiZWNhdXNlIHRoZSBhdXRvY29tcGxldGVcbiAgICAvLyBvciBpdHMgb3B0aW9ucyBtYXkgbm90IGhhdmUgYmVlbiBhc3NpZ25lZCB5ZXQuXG4gICAgdGhpcy5hdXRvY29tcGxldGU/Lm9wdGlvbnM/LmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgIGlmIChvcHRpb24gIT09IHNraXAgJiYgb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5kZXNlbGVjdChlbWl0RXZlbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfb3BlblBhbmVsSW50ZXJuYWwodmFsdWVPbkF0dGFjaCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkodmFsdWVPbkF0dGFjaCk7XG4gICAgdGhpcy5fZmxvYXRMYWJlbCgpO1xuICAgIC8vIEFkZCBhcmlhLW93bnMgYXR0cmlidXRlIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBiZWNvbWVzIHZpc2libGUuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgY29uc3QgcGFuZWxJZCA9IHRoaXMuYXV0b2NvbXBsZXRlLmlkO1xuICAgICAgYWRkQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hdHRhY2hPdmVybGF5KHZhbHVlT25BdHRhY2g6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hdXRvY29tcGxldGUgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldE1hdEF1dG9jb21wbGV0ZU1pc3NpbmdQYW5lbEVycm9yKCk7XG4gICAgfVxuXG4gICAgbGV0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuXG4gICAgaWYgKCFvdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5hdXRvY29tcGxldGUudGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYsIHtcbiAgICAgICAgaWQ6IHRoaXMuX2Zvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpLFxuICAgICAgfSk7XG4gICAgICBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheS5jcmVhdGUodGhpcy5fZ2V0T3ZlcmxheUNvbmZpZygpKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSBvdmVybGF5UmVmO1xuICAgICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24gPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiBvdmVybGF5UmVmKSB7XG4gICAgICAgICAgb3ZlcmxheVJlZi51cGRhdGVTaXplKHt3aWR0aDogdGhpcy5fZ2V0UGFuZWxXaWR0aCgpfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVcGRhdGUgdGhlIHRyaWdnZXIsIHBhbmVsIHdpZHRoIGFuZCBkaXJlY3Rpb24sIGluIGNhc2UgYW55dGhpbmcgaGFzIGNoYW5nZWQuXG4gICAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5LnNldE9yaWdpbih0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpO1xuICAgICAgb3ZlcmxheVJlZi51cGRhdGVTaXplKHt3aWR0aDogdGhpcy5fZ2V0UGFuZWxXaWR0aCgpfSk7XG4gICAgfVxuXG4gICAgaWYgKG92ZXJsYXlSZWYgJiYgIW92ZXJsYXlSZWYuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgb3ZlcmxheVJlZi5hdHRhY2godGhpcy5fcG9ydGFsKTtcbiAgICAgIHRoaXMuX3ZhbHVlT25BdHRhY2ggPSB2YWx1ZU9uQXR0YWNoO1xuICAgICAgdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duID0gbnVsbDtcbiAgICAgIHRoaXMuX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uID0gdGhpcy5fc3Vic2NyaWJlVG9DbG9zaW5nQWN0aW9ucygpO1xuICAgIH1cblxuICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcblxuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSB0aGlzLl9vdmVybGF5QXR0YWNoZWQgPSB0cnVlO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9sYXRlc3RPcGVuaW5nVHJpZ2dlciA9IHRoaXM7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX3NldENvbG9yKHRoaXMuX2Zvcm1GaWVsZD8uY29sb3IpO1xuICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcbiAgICB0aGlzLl9hcHBseU1vZGFsUGFuZWxPd25lcnNoaXAoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZG8gYW4gZXh0cmEgYHBhbmVsT3BlbmAgY2hlY2sgaW4gaGVyZSwgYmVjYXVzZSB0aGVcbiAgICAvLyBhdXRvY29tcGxldGUgd29uJ3QgYmUgc2hvd24gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuICYmIHdhc09wZW4gIT09IHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9lbWl0T3BlbmVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIGNvbWluZyBmcm9tIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBwcml2YXRlIF9oYW5kbGVQYW5lbEtleWRvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAvLyBDbG9zZSB3aGVuIHByZXNzaW5nIEVTQ0FQRSBvciBBTFQgKyBVUF9BUlJPVywgYmFzZWQgb24gdGhlIGExMXkgZ3VpZGVsaW5lcy5cbiAgICAvLyBTZWU6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi93YWktYXJpYS1wcmFjdGljZXMtMS4xLyN0ZXh0Ym94LWtleWJvYXJkLWludGVyYWN0aW9uXG4gICAgaWYgKFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgKGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykpXG4gICAgKSB7XG4gICAgICAvLyBJZiB0aGUgdXNlciBoYWQgdHlwZWQgc29tZXRoaW5nIGluIGJlZm9yZSB3ZSBhdXRvc2VsZWN0ZWQgYW4gb3B0aW9uLCBhbmQgdGhleSBkZWNpZGVkXG4gICAgICAvLyB0byBjYW5jZWwgdGhlIHNlbGVjdGlvbiwgcmVzdG9yZSB0aGUgaW5wdXQgdmFsdWUgdG8gdGhlIG9uZSB0aGV5IGhhZCB0eXBlZCBpbi5cbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU5hdGl2ZUlucHV0VmFsdWUodGhpcy5fdmFsdWVCZWZvcmVBdXRvU2VsZWN0aW9uID8/ICcnKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLm5leHQoKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgLy8gV2UgbmVlZCB0byBzdG9wIHByb3BhZ2F0aW9uLCBvdGhlcndpc2UgdGhlIGV2ZW50IHdpbGwgZXZlbnR1YWxseVxuICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBVcGRhdGVzIHRoZSBwYW5lbCdzIHZpc2liaWxpdHkgc3RhdGUgYW5kIGFueSB0cmlnZ2VyIHN0YXRlIHRpZWQgdG8gaWQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVBhbmVsU3RhdGUoKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUuX3NldFZpc2liaWxpdHkoKTtcblxuICAgIC8vIE5vdGUgdGhhdCBoZXJlIHdlIHN1YnNjcmliZSBhbmQgdW5zdWJzY3JpYmUgYmFzZWQgb24gdGhlIHBhbmVsJ3MgdmlzaWJsaXR5IHN0YXRlLFxuICAgIC8vIGJlY2F1c2UgdGhlIGFjdCBvZiBzdWJzY3JpYmluZyB3aWxsIHByZXZlbnQgZXZlbnRzIGZyb20gcmVhY2hpbmcgb3RoZXIgb3ZlcmxheXMgYW5kXG4gICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBibG9jayB0aGUgZXZlbnRzIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgY29uc3Qgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXlSZWYhO1xuXG4gICAgICBpZiAoIXRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gVXNlIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gdGFrZSBhZHZhbnRhZ2Ugb2ZcbiAgICAgICAgLy8gdGhlIG92ZXJsYXkgZXZlbnQgdGFyZ2V0aW5nIHByb3ZpZGVkIGJ5IHRoZSBDREsgb3ZlcmxheS5cbiAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IG92ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpLnN1YnNjcmliZSh0aGlzLl9oYW5kbGVQYW5lbEtleWRvd24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbikge1xuICAgICAgICAvLyBTdWJzY3JpYmUgdG8gdGhlIHBvaW50ZXIgZXZlbnRzIHN0cmVhbSBzbyB0aGF0IGl0IGRvZXNuJ3QgZ2V0IHBpY2tlZCB1cCBieSBvdGhlciBvdmVybGF5cy5cbiAgICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IHdlIHNob3VsZCBzd2l0Y2ggYF9nZXRPdXRzaWRlQ2xpY2tTdHJlYW1gIGV2ZW50dWFsbHkgdG8gdXNlIHRoaXMgc3RyZWFtLFxuICAgICAgICAvLyBidXQgdGhlIGJlaHZpb3IgaXNuJ3QgZXhhY3RseSB0aGUgc2FtZSBhbmQgaXQgZW5kcyB1cCBicmVha2luZyBzb21lIGludGVybmFsIHRlc3RzLlxuICAgICAgICB0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLm91dHNpZGVQb2ludGVyRXZlbnRzKCkuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uID0gdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5Q29uZmlnKCk6IE92ZXJsYXlDb25maWcge1xuICAgIHJldHVybiBuZXcgT3ZlcmxheUNvbmZpZyh7XG4gICAgICBwb3NpdGlvblN0cmF0ZWd5OiB0aGlzLl9nZXRPdmVybGF5UG9zaXRpb24oKSxcbiAgICAgIHNjcm9sbFN0cmF0ZWd5OiB0aGlzLl9zY3JvbGxTdHJhdGVneSgpLFxuICAgICAgd2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKSxcbiAgICAgIGRpcmVjdGlvbjogdGhpcy5fZGlyID8/IHVuZGVmaW5lZCxcbiAgICAgIHBhbmVsQ2xhc3M6IHRoaXMuX2RlZmF1bHRzPy5vdmVybGF5UGFuZWxDbGFzcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE92ZXJsYXlQb3NpdGlvbigpOiBQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoUHVzaChmYWxzZSk7XG5cbiAgICB0aGlzLl9zZXRTdHJhdGVneVBvc2l0aW9ucyhzdHJhdGVneSk7XG4gICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgIHJldHVybiBzdHJhdGVneTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneSBiYXNlZCBvbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgc3RhdGUuICovXG4gIHByaXZhdGUgX3NldFN0cmF0ZWd5UG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBwcm92aWRlIGhvcml6b250YWwgZmFsbGJhY2sgcG9zaXRpb25zLCBldmVuIHRob3VnaCBieSBkZWZhdWx0IHRoZSBkcm9wZG93blxuICAgIC8vIHdpZHRoIG1hdGNoZXMgdGhlIGlucHV0LCBiZWNhdXNlIGNvbnN1bWVycyBjYW4gb3ZlcnJpZGUgdGhlIHdpZHRoLiBTZWUgIzE4ODU0LlxuICAgIGNvbnN0IGJlbG93UG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2JvdHRvbScsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICBdO1xuXG4gICAgLy8gVGhlIG92ZXJsYXkgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIHRyaWdnZXIgc2hvdWxkIGhhdmUgc3F1YXJlZCBjb3JuZXJzLCB3aGlsZVxuICAgIC8vIHRoZSBvcHBvc2l0ZSBlbmQgaGFzIHJvdW5kZWQgY29ybmVycy4gV2UgYXBwbHkgYSBDU1MgY2xhc3MgdG8gc3dhcCB0aGVcbiAgICAvLyBib3JkZXItcmFkaXVzIGJhc2VkIG9uIHRoZSBvdmVybGF5IHBvc2l0aW9uLlxuICAgIGNvbnN0IHBhbmVsQ2xhc3MgPSB0aGlzLl9hYm92ZUNsYXNzO1xuICAgIGNvbnN0IGFib3ZlUG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ3RvcCcsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICBdO1xuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBhYm92ZVBvc2l0aW9ucztcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGJlbG93UG9zaXRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbnMgPSBbLi4uYmVsb3dQb3NpdGlvbnMsIC4uLmFib3ZlUG9zaXRpb25zXTtcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhQb3NpdGlvbnMocG9zaXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbm5lY3RlZEVsZW1lbnQoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZFRvKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFBhbmVsV2lkdGgoKTogbnVtYmVyIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUucGFuZWxXaWR0aCB8fCB0aGlzLl9nZXRIb3N0V2lkdGgoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgaW5wdXQgZWxlbWVudCwgc28gdGhlIHBhbmVsIHdpZHRoIGNhbiBtYXRjaCBpdC4gKi9cbiAgcHJpdmF0ZSBfZ2V0SG9zdFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENvbm5lY3RlZEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBhY3RpdmUgaXRlbSB0byAtMS4gVGhpcyBpcyBzbyB0aGF0IHByZXNzaW5nIGFycm93IGtleXMgd2lsbCBhY3RpdmF0ZSB0aGUgY29ycmVjdFxuICAgKiBvcHRpb24uXG4gICAqXG4gICAqIElmIHRoZSBjb25zdW1lciBvcHRlZC1pbiB0byBhdXRvbWF0aWNhbGx5IGFjdGl2YXRhdGluZyB0aGUgZmlyc3Qgb3B0aW9uLCBhY3RpdmF0ZSB0aGUgZmlyc3RcbiAgICogKmVuYWJsZWQqIG9wdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX3Jlc2V0QWN0aXZlSXRlbSgpOiB2b2lkIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcblxuICAgIGlmIChhdXRvY29tcGxldGUuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKSB7XG4gICAgICAvLyBGaW5kIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgKmVuYWJsZWQqIG9wdGlvbi4gQXZvaWQgY2FsbGluZyBgX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbWBcbiAgICAgIC8vIGJlY2F1c2UgaXQgYWN0aXZhdGVzIHRoZSBmaXJzdCBvcHRpb24gdGhhdCBwYXNzZXMgdGhlIHNraXAgcHJlZGljYXRlLCByYXRoZXIgdGhhbiB0aGVcbiAgICAgIC8vIGZpcnN0ICplbmFibGVkKiBvcHRpb24uXG4gICAgICBsZXQgZmlyc3RFbmFibGVkT3B0aW9uSW5kZXggPSAtMTtcblxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGF1dG9jb21wbGV0ZS5vcHRpb25zLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBhdXRvY29tcGxldGUub3B0aW9ucy5nZXQoaW5kZXgpITtcbiAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgICAgICBmaXJzdEVuYWJsZWRPcHRpb25JbmRleCA9IGluZGV4O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhdXRvY29tcGxldGUuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShmaXJzdEVuYWJsZWRPcHRpb25JbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYW5lbCBjYW4gYmUgb3BlbmVkLiAqL1xuICBwcml2YXRlIF9jYW5PcGVuKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgcmV0dXJuICFlbGVtZW50LnJlYWRPbmx5ICYmICFlbGVtZW50LmRpc2FibGVkICYmICF0aGlzLmF1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Py5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKiogU2Nyb2xscyB0byBhIHBhcnRpY3VsYXIgb3B0aW9uIGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb09wdGlvbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gR2l2ZW4gdGhhdCB3ZSBhcmUgbm90IGFjdHVhbGx5IGZvY3VzaW5nIGFjdGl2ZSBvcHRpb25zLCB3ZSBtdXN0IG1hbnVhbGx5IGFkanVzdCBzY3JvbGxcbiAgICAvLyB0byByZXZlYWwgb3B0aW9ucyBiZWxvdyB0aGUgZm9sZC4gRmlyc3QsIHdlIGZpbmQgdGhlIG9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcFxuICAgIC8vIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYmVsb3cgdGhlIGZvbGQsIHRoZSBuZXcgc2Nyb2xsVG9wIHdpbGwgYmUgdGhlIG9mZnNldCAtXG4gICAgLy8gdGhlIHBhbmVsIGhlaWdodCArIHRoZSBvcHRpb24gaGVpZ2h0LCBzbyB0aGUgYWN0aXZlIG9wdGlvbiB3aWxsIGJlIGp1c3QgdmlzaWJsZSBhdCB0aGVcbiAgICAvLyBib3R0b20gb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBhYm92ZSB0aGUgdG9wIG9mIHRoZSB2aXNpYmxlIHBhbmVsLCB0aGUgbmV3IHNjcm9sbFRvcFxuICAgIC8vIHdpbGwgYmVjb21lIHRoZSBvZmZzZXQuIElmIHRoYXQgb2Zmc2V0IGlzIHZpc2libGUgd2l0aGluIHRoZSBwYW5lbCBhbHJlYWR5LCB0aGUgc2Nyb2xsVG9wIGlzXG4gICAgLy8gbm90IGFkanVzdGVkLlxuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IGxhYmVsQ291bnQgPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihcbiAgICAgIGluZGV4LFxuICAgICAgYXV0b2NvbXBsZXRlLm9wdGlvbnMsXG4gICAgICBhdXRvY29tcGxldGUub3B0aW9uR3JvdXBzLFxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbGFiZWxDb3VudCA9PT0gMSkge1xuICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAvLyB0b3Agb2YgdGhlIG9wdGlvbiwgYmVjYXVzZSBpdCBhbGxvd3MgdGhlIHVzZXIgdG8gcmVhZCB0aGUgdG9wIGdyb3VwJ3MgbGFiZWwuXG4gICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2UgaWYgKGF1dG9jb21wbGV0ZS5wYW5lbCkge1xuICAgICAgY29uc3Qgb3B0aW9uID0gYXV0b2NvbXBsZXRlLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XTtcblxuICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gb3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpO1xuICAgICAgICBjb25zdCBuZXdTY3JvbGxQb3NpdGlvbiA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICBhdXRvY29tcGxldGUuX2dldFNjcm9sbFRvcCgpLFxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5wYW5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcChuZXdTY3JvbGxQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIHdoaWNoIG1vZGFsIHdlIGhhdmUgbW9kaWZpZWQgdGhlIGBhcmlhLW93bnNgIGF0dHJpYnV0ZSBvZi4gV2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpc1xuICAgKiBpbnNpZGUgYW4gYXJpYS1tb2RhbCwgd2UgYXBwbHkgYXJpYS1vd25zIHRvIHRoZSBwYXJlbnQgbW9kYWwgd2l0aCB0aGUgYGlkYCBvZiB0aGUgb3B0aW9uc1xuICAgKiBwYW5lbC4gVHJhY2sgdGhlIG1vZGFsIHdlIGhhdmUgY2hhbmdlZCBzbyB3ZSBjYW4gdW5kbyB0aGUgY2hhbmdlcyBvbiBkZXN0cm95LlxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhY2tlZE1vZGFsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBpbnNpZGUgb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIGNvbm5lY3RcbiAgICogdGhhdCBtb2RhbCB0byB0aGUgb3B0aW9ucyBwYW5lbCB3aXRoIGBhcmlhLW93bnNgLlxuICAgKlxuICAgKiBGb3Igc29tZSBicm93c2VyICsgc2NyZWVuIHJlYWRlciBjb21iaW5hdGlvbnMsIHdoZW4gbmF2aWdhdGlvbiBpcyBpbnNpZGVcbiAgICogb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIHRoZSBzY3JlZW4gcmVhZGVyIHRyZWF0cyBldmVyeXRoaW5nIG91dHNpZGVcbiAgICogb2YgdGhhdCBtb2RhbCBhcyBoaWRkZW4gb3IgaW52aXNpYmxlLlxuICAgKlxuICAgKiBUaGlzIGNhdXNlcyBhIHByb2JsZW0gd2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpcyBfaW5zaWRlXyBvZiBhIG1vZGFsLCBiZWNhdXNlIHRoZVxuICAgKiBvcHRpb25zIHBhbmVsIGlzIHJlbmRlcmVkIF9vdXRzaWRlXyBvZiB0aGF0IG1vZGFsLCBwcmV2ZW50aW5nIHNjcmVlbiByZWFkZXIgbmF2aWdhdGlvblxuICAgKiBmcm9tIHJlYWNoaW5nIHRoZSBwYW5lbC5cbiAgICpcbiAgICogV2UgY2FuIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUgYnkgYXBwbHlpbmcgYGFyaWEtb3duc2AgdG8gdGhlIG1vZGFsIHdpdGggdGhlIGBpZGAgb2ZcbiAgICogdGhlIG9wdGlvbnMgcGFuZWwuIFRoaXMgZWZmZWN0aXZlbHkgY29tbXVuaWNhdGVzIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHRoYXQgdGhlXG4gICAqIG9wdGlvbnMgcGFuZWwgaXMgcGFydCBvZiB0aGUgc2FtZSBpbnRlcmFjdGlvbiBhcyB0aGUgbW9kYWwuXG4gICAqXG4gICAqIEF0IHRpbWUgb2YgdGhpcyB3cml0aW5nLCB0aGlzIGlzc3VlIGlzIHByZXNlbnQgaW4gVm9pY2VPdmVyLlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2OTRcbiAgICovXG4gIHByaXZhdGUgX2FwcGx5TW9kYWxQYW5lbE93bmVyc2hpcCgpIHtcbiAgICAvLyBUT0RPKGh0dHA6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjY4NTMpOiBjb25zaWRlciBkZS1kdXBsaWNhdGluZyB0aGlzIHdpdGhcbiAgICAvLyB0aGUgYExpdmVBbm5vdW5jZXJgIGFuZCBhbnkgb3RoZXIgdXNhZ2VzLlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHRoZSBzZWxlY3RvciBoZXJlIGlzIGxpbWl0ZWQgdG8gQ0RLIG92ZXJsYXlzIGF0IHRoZSBtb21lbnQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZVxuICAgIC8vIHNlY3Rpb24gb2YgdGhlIERPTSB3ZSBuZWVkIHRvIGxvb2sgdGhyb3VnaC4gVGhpcyBzaG91bGQgY292ZXIgYWxsIHRoZSBjYXNlcyB3ZSBzdXBwb3J0LCBidXRcbiAgICAvLyB0aGUgc2VsZWN0b3IgY2FuIGJlIGV4cGFuZGVkIGlmIGl0IHR1cm5zIG91dCB0byBiZSB0b28gbmFycm93LlxuICAgIGNvbnN0IG1vZGFsID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNsb3Nlc3QoXG4gICAgICAnYm9keSA+IC5jZGstb3ZlcmxheS1jb250YWluZXIgW2FyaWEtbW9kYWw9XCJ0cnVlXCJdJyxcbiAgICApO1xuXG4gICAgaWYgKCFtb2RhbCkge1xuICAgICAgLy8gTW9zdCBjb21tb25seSwgdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGlzIG5vdCBpbnNpZGUgYSBtb2RhbC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5lbElkID0gdGhpcy5hdXRvY29tcGxldGUuaWQ7XG5cbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgIH1cblxuICAgIGFkZEFyaWFSZWZlcmVuY2VkSWQobW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB0aGlzLl90cmFja2VkTW9kYWwgPSBtb2RhbDtcbiAgfVxuXG4gIC8qKiBDbGVhcnMgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIGxpc3Rib3ggb3ZlcmxheSBlbGVtZW50IGZyb20gdGhlIG1vZGFsIGl0IHdhcyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJGcm9tTW9kYWwoKSB7XG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgY29uc3QgcGFuZWxJZCA9IHRoaXMuYXV0b2NvbXBsZXRlLmlkO1xuXG4gICAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKHRoaXMuX3RyYWNrZWRNb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgICAgdGhpcy5fdHJhY2tlZE1vZGFsID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==