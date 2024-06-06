/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { addAriaReferencedId, removeAriaReferencedId } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { _getEventTarget } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, ElementRef, Host, Inject, InjectionToken, Injector, Input, NgZone, Optional, ViewContainerRef, afterNextRender, booleanAttribute, forwardRef, inject, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatOptionSelectionChange, _countGroupLabelsBeforeOption, _getOptionScrollPosition, } from '@angular/material/core';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { Observable, Subject, Subscription, defer, fromEvent, merge, of as observableOf } from 'rxjs';
import { delay, filter, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatAutocomplete, } from './autocomplete';
import { MatAutocompleteOrigin } from './autocomplete-origin';
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
        this._changeDetectorRef.markForCheck();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9GLE9BQU8sRUFHTCxPQUFPLEVBQ1AsYUFBYSxHQUlkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLGNBQWMsRUFDZCxRQUFRLEVBQ1IsS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBRVIsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsVUFBVSxFQUNWLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUVMLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFDN0Isd0JBQXdCLEdBQ3pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLDhCQUE4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Z0JBU1UsUUFBUTtzQkFBekMsS0FBSzt1QkFBQyx5QkFBeUI7Z0JBTUssV0FBVztzQkFBL0MsS0FBSzt1QkFBQyw0QkFBNEI7Z0JBTVoscUJBQXFCO3NCQUEzQyxLQUFLO3VCQUFDLGNBQWM7Z0JBT3JCLG9CQUFvQjtzQkFEbkIsS0FBSzt1QkFBQyxFQUFDLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthZGRBcmlhUmVmZXJlbmNlZElkLCByZW1vdmVBcmlhUmVmZXJlbmNlZElkfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1csIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgT3ZlcmxheSxcbiAgT3ZlcmxheUNvbmZpZyxcbiAgT3ZlcmxheVJlZixcbiAgUG9zaXRpb25TdHJhdGVneSxcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7X2dldEV2ZW50VGFyZ2V0fSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3QsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGFmdGVyTmV4dFJlbmRlcixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgZm9yd2FyZFJlZixcbiAgaW5qZWN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBNYXRPcHRpb24sXG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01BVF9GT1JNX0ZJRUxELCBNYXRGb3JtRmllbGR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24sIGRlZmVyLCBmcm9tRXZlbnQsIG1lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCBtYXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TLFxuICBNYXRBdXRvY29tcGxldGUsXG4gIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zLFxufSBmcm9tICcuL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQge01hdEF1dG9jb21wbGV0ZU9yaWdpbn0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuLyoqXG4gKiBQcm92aWRlciB0aGF0IGFsbG93cyB0aGUgYXV0b2NvbXBsZXRlIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRBdXRvY29tcGxldGVUcmlnZ2VyKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gZXJyb3IgdG8gYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byB1c2UgYW4gYXV0b2NvbXBsZXRlIHRyaWdnZXIgd2l0aG91dCBhIHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoXG4gICAgJ0F0dGVtcHRpbmcgdG8gb3BlbiBhbiB1bmRlZmluZWQgaW5zdGFuY2Ugb2YgYG1hdC1hdXRvY29tcGxldGVgLiAnICtcbiAgICAgICdNYWtlIHN1cmUgdGhhdCB0aGUgaWQgcGFzc2VkIHRvIHRoZSBgbWF0QXV0b2NvbXBsZXRlYCBpcyBjb3JyZWN0IGFuZCB0aGF0ICcgK1xuICAgICAgXCJ5b3UncmUgYXR0ZW1wdGluZyB0byBvcGVuIGl0IGFmdGVyIHRoZSBuZ0FmdGVyQ29udGVudEluaXQgaG9vay5cIixcbiAgKTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LWF1dG9jb21wbGV0ZS1zY3JvbGwtc3RyYXRlZ3knLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBpbmplY3QoT3ZlcmxheSk7XG4gICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9LFxuICB9LFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdEF1dG9jb21wbGV0ZVRyaWdnZXJgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRBdXRvY29tcGxldGVdLCB0ZXh0YXJlYVttYXRBdXRvY29tcGxldGVdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWF1dG9jb21wbGV0ZS10cmlnZ2VyJyxcbiAgICAnW2F0dHIuYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGVBdHRyaWJ1dGUnLFxuICAgICdbYXR0ci5yb2xlXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImNvbWJvYm94XCInLFxuICAgICdbYXR0ci5hcmlhLWF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJsaXN0XCInLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJyhwYW5lbE9wZW4gJiYgYWN0aXZlT3B0aW9uKSA/IGFjdGl2ZU9wdGlvbi5pZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBwYW5lbE9wZW4udG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJyhhdXRvY29tcGxldGVEaXNhYmxlZCB8fCAhcGFuZWxPcGVuKSA/IG51bGwgOiBhdXRvY29tcGxldGU/LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJsaXN0Ym94XCInLFxuICAgIC8vIE5vdGU6IHdlIHVzZSBgZm9jdXNpbmAsIGFzIG9wcG9zZWQgdG8gYGZvY3VzYCwgaW4gb3JkZXIgdG8gb3BlbiB0aGUgcGFuZWxcbiAgICAvLyBhIGxpdHRsZSBlYXJsaWVyLiBUaGlzIGF2b2lkcyBpc3N1ZXMgd2hlcmUgSUUgZGVsYXlzIHRoZSBmb2N1c2luZyBvZiB0aGUgaW5wdXQuXG4gICAgJyhmb2N1c2luKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknLFxuICAgICcoaW5wdXQpJzogJ19oYW5kbGVJbnB1dCgkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGVUcmlnZ2VyJyxcbiAgcHJvdmlkZXJzOiBbTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUl0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXJcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX2NvbXBvbmVudERlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgX2tleWRvd25TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG4gIHByaXZhdGUgX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcblxuICAvKiogT2xkIHZhbHVlIG9mIHRoZSBuYXRpdmUgaW5wdXQuIFVzZWQgdG8gd29yayBhcm91bmQgaXNzdWVzIHdpdGggdGhlIGBpbnB1dGAgZXZlbnQgb24gSUUuICovXG4gIHByaXZhdGUgX3ByZXZpb3VzVmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBpbnB1dCBlbGVtZW50IHdoZW4gdGhlIHBhbmVsIHdhcyBhdHRhY2hlZCAoZXZlbiBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucykuICovXG4gIHByaXZhdGUgX3ZhbHVlT25BdHRhY2g6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFZhbHVlIG9uIHRoZSBwcmV2aW91cyBrZXlkb3duIGV2ZW50LiAqL1xuICBwcml2YXRlIF92YWx1ZU9uTGFzdEtleWRvd246IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqIFN0cmF0ZWd5IHRoYXQgaXMgdXNlZCB0byBwb3NpdGlvbiB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIGxhYmVsIHN0YXRlIGlzIGJlaW5nIG92ZXJyaWRkZW4uICovXG4gIHByaXZhdGUgX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3Vic2NyaXB0aW9uIGZvciBjbG9zaW5nIGFjdGlvbnMgKHNvbWUgYXJlIGJvdW5kIHRvIGRvY3VtZW50KS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHZpZXdwb3J0IHNpemUgY2hhbmdlcy4gKi9cbiAgcHJpdmF0ZSBfdmlld3BvcnRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBjYW4gb3BlbiB0aGUgbmV4dCB0aW1lIGl0IGlzIGZvY3VzZWQuIFVzZWQgdG8gcHJldmVudCBhIGZvY3VzZWQsXG4gICAqIGNsb3NlZCBhdXRvY29tcGxldGUgZnJvbSBiZWluZyByZW9wZW5lZCBpZiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhbm90aGVyIGJyb3dzZXIgdGFiIGFuZCB0aGVuXG4gICAqIGNvbWVzIGJhY2suXG4gICAqL1xuICBwcml2YXRlIF9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuXG4gIC8qKiBWYWx1ZSBpbnNpZGUgdGhlIGlucHV0IGJlZm9yZSB3ZSBhdXRvLXNlbGVjdGVkIGFuIG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVCZWZvcmVBdXRvU2VsZWN0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgb3B0aW9uIHRoYXQgd2UgaGF2ZSBhdXRvLXNlbGVjdGVkIGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcsXG4gICAqIGJ1dCB3aGljaCBoYXNuJ3QgYmVlbiBwcm9wYWdhdGVkIHRvIHRoZSBtb2RlbCB2YWx1ZSB5ZXQuXG4gICAqL1xuICBwcml2YXRlIF9wZW5kaW5nQXV0b3NlbGVjdGVkT3B0aW9uOiBNYXRPcHRpb24gfCBudWxsO1xuXG4gIC8qKiBTdHJlYW0gb2Yga2V5Ym9hcmQgZXZlbnRzIHRoYXQgY2FuIGNsb3NlIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2xvc2VLZXlFdmVudFN0cmVhbSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIHdpbmRvdyBpcyBibHVycmVkLiBOZWVkcyB0byBiZSBhblxuICAgKiBhcnJvdyBmdW5jdGlvbiBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dC5cbiAgICovXG4gIHByaXZhdGUgX3dpbmRvd0JsdXJIYW5kbGVyID0gKCkgPT4ge1xuICAgIC8vIElmIHRoZSB1c2VyIGJsdXJyZWQgdGhlIHdpbmRvdyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIGlzIGZvY3VzZWQsIGl0IG1lYW5zIHRoYXQgaXQnbGwgYmVcbiAgICAvLyByZWZvY3VzZWQgd2hlbiB0aGV5IGNvbWUgYmFjay4gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdG8gc2tpcCB0aGUgZmlyc3QgZm9jdXMgZXZlbnQsIGlmIHRoZVxuICAgIC8vIHBhbmUgd2FzIGNsb3NlZCwgaW4gb3JkZXIgdG8gYXZvaWQgcmVvcGVuaW5nIGl0IHVuaW50ZW50aW9uYWxseS5cbiAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPVxuICAgICAgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50IHx8IHRoaXMucGFuZWxPcGVuO1xuICB9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiB2YWx1ZSBjaGFuZ2VzYCAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIGF1dG9jb21wbGV0ZSBoYXMgYmVlbiB0b3VjaGVkYCAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBhdXRvY29tcGxldGUgcGFuZWwgdG8gYmUgYXR0YWNoZWQgdG8gdGhpcyB0cmlnZ2VyLiAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZScpIGF1dG9jb21wbGV0ZTogTWF0QXV0b2NvbXBsZXRlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHJlbGF0aXZlIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQuIEEgcG9zaXRpb24gb2YgYGF1dG9gXG4gICAqIHdpbGwgcmVuZGVyIHRoZSBwYW5lbCB1bmRlcm5lYXRoIHRoZSB0cmlnZ2VyIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBmb3IgaXQgdG8gZml0IGluXG4gICAqIHRoZSB2aWV3cG9ydCwgb3RoZXJ3aXNlIHRoZSBwYW5lbCB3aWxsIGJlIHNob3duIGFib3ZlIGl0LiBJZiB0aGUgcG9zaXRpb24gaXMgc2V0IHRvXG4gICAqIGBhYm92ZWAgb3IgYGJlbG93YCwgdGhlIHBhbmVsIHdpbGwgYWx3YXlzIGJlIHNob3duIGFib3ZlIG9yIGJlbG93IHRoZSB0cmlnZ2VyLiBubyBtYXR0ZXJcbiAgICogd2hldGhlciBpdCBmaXRzIGNvbXBsZXRlbHkgaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVQb3NpdGlvbicpIHBvc2l0aW9uOiAnYXV0bycgfCAnYWJvdmUnIHwgJ2JlbG93JyA9ICdhdXRvJztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHJlbGF0aXZlIHRvIHdoaWNoIHRvIHBvc2l0aW9uIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBlbGVtZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVDb25uZWN0ZWRUbycpIGNvbm5lY3RlZFRvOiBNYXRBdXRvY29tcGxldGVPcmlnaW47XG5cbiAgLyoqXG4gICAqIGBhdXRvY29tcGxldGVgIGF0dHJpYnV0ZSB0byBiZSBzZXQgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgnYXV0b2NvbXBsZXRlJykgYXV0b2NvbXBsZXRlQXR0cmlidXRlOiBzdHJpbmcgPSAnb2ZmJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlzIGRpc2FibGVkLiBXaGVuIGRpc2FibGVkLCB0aGUgZWxlbWVudCB3aWxsXG4gICAqIGFjdCBhcyBhIHJlZ3VsYXIgaW5wdXQgYW5kIHRoZSB1c2VyIHdvbid0IGJlIGFibGUgdG8gb3BlbiB0aGUgcGFuZWwuXG4gICAqL1xuICBASW5wdXQoe2FsaWFzOiAnbWF0QXV0b2NvbXBsZXRlRGlzYWJsZWQnLCB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBhdXRvY29tcGxldGVEaXNhYmxlZDogYm9vbGVhbjtcblxuICBwcml2YXRlIF9pbml0aWFsaXplZCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgcHJpdmF0ZSBfaW5qZWN0b3IgPSBpbmplY3QoSW5qZWN0b3IpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgX3pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5IHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBASG9zdCgpIHByaXZhdGUgX2Zvcm1GaWVsZDogTWF0Rm9ybUZpZWxkIHwgbnVsbCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRzPzogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMgfCBudWxsLFxuICApIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgYWJvdmUgdGhlIGlucHV0LiAqL1xuICBwcml2YXRlIF9hYm92ZUNsYXNzID0gJ21hdC1tZGMtYXV0b2NvbXBsZXRlLXBhbmVsLWFib3ZlJztcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQubmV4dCgpO1xuICAgIHRoaXMuX2luaXRpYWxpemVkLmNvbXBsZXRlKCk7XG5cbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVySGFuZGxlcik7XG4gICAgfVxuXG4gICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9jb21wb25lbnREZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2Rlc3Ryb3lQYW5lbCgpO1xuICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0uY29tcGxldGUoKTtcbiAgICB0aGlzLl9jbGVhckZyb21Nb2RhbCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmIHRoaXMuYXV0b2NvbXBsZXRlLnNob3dQYW5lbDtcbiAgfVxuICBwcml2YXRlIF9vdmVybGF5QXR0YWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BlbnMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBvcGVuUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fb3BlblBhbmVsSW50ZXJuYWwoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBjbG9zZVBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX3Jlc2V0TGFiZWwoKTtcblxuICAgIGlmICghdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBPbmx5IGVtaXQgaWYgdGhlIHBhbmVsIHdhcyB2aXNpYmxlLlxuICAgICAgLy8gYGFmdGVyTmV4dFJlbmRlcmAgYWx3YXlzIHJ1bnMgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLCBzbyBhbGwgdGhlIHN1YnNjcmlwdGlvbnMgZnJvbVxuICAgICAgLy8gYF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKClgIGFyZSBhbHNvIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgIC8vIFdlIHNob3VsZCBtYW51YWxseSBydW4gaW4gQW5ndWxhciB6b25lIHRvIHVwZGF0ZSBVSSBhZnRlciBwYW5lbCBjbG9zaW5nLlxuICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT25seSByZXNldCBpZiB0aGlzIHRyaWdnZXIgaXMgdGhlIGxhdGVzdCBvbmUgdGhhdCBvcGVuZWQgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHNpbmNlIGFub3RoZXIgbWF5IGhhdmUgdGFrZW4gaXQgb3Zlci5cbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUuX2xhdGVzdE9wZW5pbmdUcmlnZ2VyID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fbGF0ZXN0T3BlbmluZ1RyaWdnZXIgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVQYW5lbFN0YXRlKCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgaW4gc29tZSBjYXNlcyB0aGlzIGNhbiBlbmQgdXAgYmVpbmcgY2FsbGVkIGFmdGVyIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgIC8vIEFkZCBhIGNoZWNrIHRvIGVuc3VyZSB0aGF0IHdlIGRvbid0IHRyeSB0byBydW4gY2hhbmdlIGRldGVjdGlvbiBvbiBhIGRlc3Ryb3llZCB2aWV3LlxuICAgIGlmICghdGhpcy5fY29tcG9uZW50RGVzdHJveWVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseSwgYmVjYXVzZVxuICAgICAgLy8gYGZyb21FdmVudGAgZG9lc24ndCBzZWVtIHRvIGRvIGl0IGF0IHRoZSBwcm9wZXIgdGltZS5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBsYWJlbCBpcyByZXNldCB3aGVuIHRoZVxuICAgICAgLy8gdXNlciBjbGlja3Mgb3V0c2lkZS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYXJpYS1vd25zIGF0dHJpYnV0ZSB3aGVuIHRoZSBhdXRvY29tcGxldGUgaXMgbm8gbG9uZ2VyIHZpc2libGUuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCB0aGlzLmF1dG9jb21wbGV0ZS5pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbCB0byBlbnN1cmUgdGhhdCBpdCBmaXRzIGFsbCBvcHRpb25zXG4gICAqIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0cmVhbSBvZiBhY3Rpb25zIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwsIGluY2x1ZGluZ1xuICAgKiB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZCwgb24gYmx1ciwgYW5kIHdoZW4gVEFCIGlzIHByZXNzZWQuXG4gICAqL1xuICBnZXQgcGFuZWxDbG9zaW5nQWN0aW9ucygpOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGw+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvbnMsXG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci50YWJPdXQucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSksXG4gICAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLFxuICAgICAgdGhpcy5fZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCksXG4gICAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAgID8gdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpXG4gICAgICAgIDogb2JzZXJ2YWJsZU9mKCksXG4gICAgKS5waXBlKFxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBvdXRwdXQgc28gd2UgcmV0dXJuIGEgY29uc2lzdGVudCB0eXBlLlxuICAgICAgbWFwKGV2ZW50ID0+IChldmVudCBpbnN0YW5jZW9mIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSA/IGV2ZW50IDogbnVsbCkpLFxuICAgICk7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGNoYW5nZXMgdG8gdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgYXV0b2NvbXBsZXRlIG9wdGlvbnMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbnM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5hdXRvY29tcGxldGUgPyB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zIDogbnVsbDtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aChvcHRpb25zKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IG1lcmdlKC4uLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24ub25TZWxlY3Rpb25DaGFuZ2UpKSksXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgc3Vic2NyaWJlcnMgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLCB0aGUgYGF1dG9jb21wbGV0ZWAgd2lsbCBiZSB1bmRlZmluZWQuXG4gICAgLy8gUmV0dXJuIGEgc3RyZWFtIHRoYXQgd2UnbGwgcmVwbGFjZSB3aXRoIHRoZSByZWFsIG9uZSBvbmNlIGV2ZXJ5dGhpbmcgaXMgaW4gcGxhY2UuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRpYWxpemVkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9ucykpO1xuICB9KSBhcyBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT47XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgYWN0aXZlIG9wdGlvbiwgY29lcmNlZCB0byBNYXRPcHRpb24gdHlwZS4gKi9cbiAgZ2V0IGFjdGl2ZU9wdGlvbigpOiBNYXRPcHRpb24gfCBudWxsIHtcbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdhdXhjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICd0b3VjaGVuZCcpIGFzIE9ic2VydmFibGU8VG91Y2hFdmVudD4sXG4gICAgKS5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gSWYgd2UncmUgaW4gdGhlIFNoYWRvdyBET00sIHRoZSBldmVudCB0YXJnZXQgd2lsbCBiZSB0aGUgc2hhZG93IHJvb3QsIHNvIHdlIGhhdmUgdG9cbiAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGNoZWNrIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBwYXRoIG9mIHRoZSBjbGljayBldmVudC5cbiAgICAgICAgY29uc3QgY2xpY2tUYXJnZXQgPSBfZ2V0RXZlbnRUYXJnZXQ8SFRNTEVsZW1lbnQ+KGV2ZW50KSE7XG4gICAgICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZFxuICAgICAgICAgID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKS5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBjb25zdCBjdXN0b21PcmlnaW4gPSB0aGlzLmNvbm5lY3RlZFRvID8gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmXG4gICAgICAgICAgY2xpY2tUYXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgIC8vIE5vcm1hbGx5IGZvY3VzIG1vdmVzIGluc2lkZSBgbW91c2Vkb3duYCBzbyB0aGlzIGNvbmRpdGlvbiB3aWxsIGFsbW9zdCBhbHdheXMgYmVcbiAgICAgICAgICAvLyB0cnVlLiBJdHMgbWFpbiBwdXJwb3NlIGlzIHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgaXMgZm9jdXNlZCBmcm9tIGFuXG4gICAgICAgICAgLy8gb3V0c2lkZSBjbGljayB3aGljaCBwcm9wYWdhdGVzIHVwIHRvIHRoZSBgYm9keWAgbGlzdGVuZXIgd2l0aGluIHRoZSBzYW1lIHNlcXVlbmNlXG4gICAgICAgICAgLy8gYW5kIGNhdXNlcyB0aGUgcGFuZWwgdG8gY2xvc2UgaW1tZWRpYXRlbHkgKHNlZSAjMzEwNikuXG4gICAgICAgICAgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgKCFmb3JtRmllbGQgfHwgIWZvcm1GaWVsZC5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgKCFjdXN0b21PcmlnaW4gfHwgIWN1c3RvbU9yaWdpbi5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgISF0aGlzLl9vdmVybGF5UmVmICYmXG4gICAgICAgICAgIXRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY29udGFpbnMoY2xpY2tUYXJnZXQpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUodmFsdWUpKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gb24gYWxsIGVzY2FwZSBrZXkgcHJlc3Nlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseSB0byBicmluZyBJRVxuICAgIC8vIGluIGxpbmUgd2l0aCBvdGhlciBicm93c2Vycy4gQnkgZGVmYXVsdCwgcHJlc3NpbmcgZXNjYXBlIG9uIElFIHdpbGwgY2F1c2UgaXQgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhhdCBpdCBoYWQgb24gZm9jdXMsIGhvd2V2ZXIgaXQgd29uJ3QgZGlzcGF0Y2ggYW55IGV2ZW50c1xuICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIG1vZGVsIHZhbHVlIHdpbGwgYmUgb3V0IG9mIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZU9uTGFzdEtleWRvd24gPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAodGhpcy5hY3RpdmVPcHRpb24gJiYga2V5Q29kZSA9PT0gRU5URVIgJiYgdGhpcy5wYW5lbE9wZW4gJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9wdGlvbi5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBjb25zdCBwcmV2QWN0aXZlSXRlbSA9IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgICAgaWYgKGtleUNvZGUgPT09IFRBQiB8fCAoaXNBcnJvd0tleSAmJiAhaGFzTW9kaWZpZXIgJiYgdGhpcy5wYW5lbE9wZW4pKSB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyb3dLZXkgJiYgdGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICAgIHRoaXMuX29wZW5QYW5lbEludGVybmFsKHRoaXMuX3ZhbHVlT25MYXN0S2V5ZG93bik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Fycm93S2V5IHx8IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0gIT09IHByZXZBY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbFRvT3B0aW9uKHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvY29tcGxldGUuYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbiAmJiB0aGlzLmFjdGl2ZU9wdGlvbikge1xuICAgICAgICAgIGlmICghdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVCZWZvcmVBdXRvU2VsZWN0aW9uID0gdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSB0aGlzLmFjdGl2ZU9wdGlvbjtcbiAgICAgICAgICB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZSh0aGlzLmFjdGl2ZU9wdGlvbi52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaGFuZGxlSW5wdXQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbGV0IHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gQmFzZWQgb24gYE51bWJlclZhbHVlQWNjZXNzb3JgIGZyb20gZm9ybXMuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaW5wdXQgaGFzIGEgcGxhY2Vob2xkZXIsIElFIHdpbGwgZmlyZSB0aGUgYGlucHV0YCBldmVudCBvbiBwYWdlIGxvYWQsXG4gICAgLy8gZm9jdXMgYW5kIGJsdXIsIGluIGFkZGl0aW9uIHRvIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgY2hhbmdlZCB0aGUgdmFsdWUuIFRvXG4gICAgLy8gZmlsdGVyIG91dCBhbGwgb2YgdGhlIGV4dHJhIGV2ZW50cywgd2Ugc2F2ZSB0aGUgdmFsdWUgb24gZm9jdXMgYW5kIGJldHdlZW5cbiAgICAvLyBgaW5wdXRgIGV2ZW50cywgYW5kIHdlIGNoZWNrIHdoZXRoZXIgaXQgY2hhbmdlZC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODg1NzQ3L1xuICAgIGlmICh0aGlzLl9wcmV2aW91c1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG5cbiAgICAgIC8vIElmIHNlbGVjdGlvbiBpcyByZXF1aXJlZCB3ZSBkb24ndCB3cml0ZSB0byB0aGUgQ1ZBIHdoaWxlIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgICAgIC8vIEF0IHRoZSBlbmQgb2YgdGhlIHNlbGVjdGlvbiBlaXRoZXIgdGhlIHVzZXIgd2lsbCBoYXZlIHBpY2tlZCBzb21ldGhpbmdcbiAgICAgIC8vIG9yIHdlJ2xsIHJlc2V0IHRoZSB2YWx1ZSBiYWNrIHRvIG51bGwuXG4gICAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlIHx8ICF0aGlzLmF1dG9jb21wbGV0ZS5yZXF1aXJlU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsT3BlbiAmJiAhdGhpcy5hdXRvY29tcGxldGUucmVxdWlyZVNlbGVjdGlvbikge1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3QgcmVzZXQgdGhpcyB3aGVuIGByZXF1aXJlU2VsZWN0aW9uYCBpcyBlbmFibGVkLFxuICAgICAgICAvLyBiZWNhdXNlIHRoZSBvcHRpb24gd2lsbCBiZSByZXNldCB3aGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucz8uZmluZChvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5fZ2V0RGlzcGxheVZhbHVlKHNlbGVjdGVkT3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gZGlzcGxheSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb24uZGVzZWxlY3QoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY2FuT3BlbigpICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICAvLyBXaGVuIHRoZSBgaW5wdXRgIGV2ZW50IGZpcmVzLCB0aGUgaW5wdXQncyB2YWx1ZSB3aWxsIGhhdmUgYWxyZWFkeSBjaGFuZ2VkLiBUaGlzIG1lYW5zXG4gICAgICAgIC8vIHRoYXQgaWYgd2UgdGFrZSB0aGUgYHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZWAgZGlyZWN0bHksIGl0J2xsIGJlIG9uZSBrZXlzdHJva2VcbiAgICAgICAgLy8gYmVoaW5kLiBUaGlzIGNhbiBiZSBhIHByb2JsZW0gd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgdmFsdWUsIGNoYW5nZXMgYSBjaGFyYWN0ZXIgd2hpbGVcbiAgICAgICAgLy8gdGhlIGlucHV0IHN0aWxsIGhhcyBmb2N1cyBhbmQgdGhlbiBjbGlja3MgYXdheSAoc2VlICMyODQzMikuIFRvIHdvcmsgYXJvdW5kIGl0LCB3ZVxuICAgICAgICAvLyBjYXB0dXJlIHRoZSB2YWx1ZSBpbiBga2V5ZG93bmAgc28gd2UgY2FuIHVzZSBpdCBoZXJlLlxuICAgICAgICBjb25zdCB2YWx1ZU9uQXR0YWNoID0gdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duID8/IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3BlblBhbmVsSW50ZXJuYWwodmFsdWVPbkF0dGFjaCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzKSB7XG4gICAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fYXR0YWNoT3ZlcmxheSh0aGlzLl9wcmV2aW91c1ZhbHVlKTtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9vcGVuUGFuZWxJbnRlcm5hbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbiBcImF1dG9cIiBtb2RlLCB0aGUgbGFiZWwgd2lsbCBhbmltYXRlIGRvd24gYXMgc29vbiBhcyBmb2N1cyBpcyBsb3N0LlxuICAgKiBUaGlzIGNhdXNlcyB0aGUgdmFsdWUgdG8ganVtcCB3aGVuIHNlbGVjdGluZyBhbiBvcHRpb24gd2l0aCB0aGUgbW91c2UuXG4gICAqIFRoaXMgbWV0aG9kIG1hbnVhbGx5IGZsb2F0cyB0aGUgbGFiZWwgdW50aWwgdGhlIHBhbmVsIGNhbiBiZSBjbG9zZWQuXG4gICAqIEBwYXJhbSBzaG91bGRBbmltYXRlIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBiZSBhbmltYXRlZCB3aGVuIGl0IGlzIGZsb2F0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9mbG9hdExhYmVsKHNob3VsZEFuaW1hdGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mb3JtRmllbGQgJiYgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZEFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLl9hbmltYXRlQW5kTG9ja0xhYmVsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJZiB0aGUgbGFiZWwgaGFzIGJlZW4gbWFudWFsbHkgZWxldmF0ZWQsIHJldHVybiBpdCB0byBpdHMgbm9ybWFsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9yZXNldExhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwpIHtcbiAgICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYXV0byc7XG4gICAgICB9XG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbGlzdGVucyB0byBhIHN0cmVhbSBvZiBwYW5lbCBjbG9zaW5nIGFjdGlvbnMgYW5kIHJlc2V0cyB0aGVcbiAgICogc3RyZWFtIGV2ZXJ5IHRpbWUgdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgaW5pdGlhbFJlbmRlciA9IG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgICAgYWZ0ZXJOZXh0UmVuZGVyKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHtpbmplY3RvcjogdGhpcy5faW5qZWN0b3J9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgICBjb25zdCBvcHRpb25DaGFuZ2VzID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICB0YXAoKCkgPT4gdGhpcy5fcG9zaXRpb25TdHJhdGVneS5yZWFwcGx5TGFzdFBvc2l0aW9uKCkpLFxuICAgICAgLy8gRGVmZXIgZW1pdHRpbmcgdG8gdGhlIHN0cmVhbSB1bnRpbCB0aGUgbmV4dCB0aWNrLCBiZWNhdXNlIGNoYW5naW5nXG4gICAgICAvLyBiaW5kaW5ncyBpbiBoZXJlIHdpbGwgY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgICBkZWxheSgwKSxcbiAgICApO1xuXG4gICAgLy8gV2hlbiB0aGUgb3B0aW9ucyBhcmUgaW5pdGlhbGx5IHJlbmRlcmVkLCBhbmQgd2hlbiB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy4uLlxuICAgIHJldHVybiAoXG4gICAgICBtZXJnZShpbml0aWFsUmVuZGVyLCBvcHRpb25DaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgc3RyZWFtIG9mIHBhbmVsQ2xvc2luZ0FjdGlvbnMsIHJlcGxhY2luZyBhbnkgcHJldmlvdXMgc3RyZWFtc1xuICAgICAgICAgIC8vIHRoYXQgd2VyZSBjcmVhdGVkLCBhbmQgZmxhdHRlbiBpdCBzbyBvdXIgc3RyZWFtIG9ubHkgZW1pdHMgY2xvc2luZyBldmVudHMuLi5cbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT5cbiAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gYGFmdGVyTmV4dFJlbmRlcmAgYWx3YXlzIHJ1bnMgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLCB0aHVzIHdlIGhhdmUgdG8gcmUtZW50ZXJcbiAgICAgICAgICAgICAgLy8gdGhlIEFuZ3VsYXIgem9uZS4gVGhpcyB3aWxsIGxlYWQgdG8gY2hhbmdlIGRldGVjdGlvbiBiZWluZyBjYWxsZWQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhclxuICAgICAgICAgICAgICAvLyB6b25lIGFuZCB0aGUgYGF1dG9jb21wbGV0ZS5vcGVuZWRgIHdpbGwgYWxzbyBlbWl0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIuXG4gICAgICAgICAgICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcbiAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAod2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgYHBhbmVsT3BlbmAgc3RhdGUgY2hhbmdlZCwgd2UgbmVlZCB0byBtYWtlIHN1cmUgdG8gZW1pdCB0aGUgYG9wZW5lZGAgb3JcbiAgICAgICAgICAgICAgICAvLyBgY2xvc2VkYCBldmVudCwgYmVjYXVzZSB3ZSBtYXkgbm90IGhhdmUgZW1pdHRlZCBpdC4gVGhpcyBjYW4gaGFwcGVuXG4gICAgICAgICAgICAgICAgLy8gLSBpZiB0aGUgdXNlcnMgb3BlbnMgdGhlIHBhbmVsIGFuZCB0aGVyZSBhcmUgbm8gb3B0aW9ucywgYnV0IHRoZVxuICAgICAgICAgICAgICAgIC8vICAgb3B0aW9ucyBjb21lIGluIHNsaWdodGx5IGxhdGVyIG9yIGFzIGEgcmVzdWx0IG9mIHRoZSB2YWx1ZSBjaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAvLyAtIGlmIHRoZSBwYW5lbCBpcyBjbG9zZWQgYWZ0ZXIgdGhlIHVzZXIgZW50ZXJlZCBhIHN0cmluZyB0aGF0IGRpZCBub3QgbWF0Y2ggYW55XG4gICAgICAgICAgICAgICAgLy8gICBvZiB0aGUgYXZhaWxhYmxlIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgLy8gLSBpZiBhIHZhbGlkIHN0cmluZyBpcyBlbnRlcmVkIGFmdGVyIGFuIGludmFsaWQgb25lLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsQ2xvc2luZ0FjdGlvbnM7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApLFxuICAgICAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IGNsb3NpbmcgZXZlbnQgb2NjdXJzLi4uXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgKVxuICAgICAgICAvLyBzZXQgdGhlIHZhbHVlLCBjbG9zZSB0aGUgcGFuZWwsIGFuZCBjb21wbGV0ZS5cbiAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50KSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBvcGVuZWQgZXZlbnQgb25jZSBpdCdzIGtub3duIHRoYXQgdGhlIHBhbmVsIHdpbGwgYmUgc2hvd24gYW5kIHN0b3Jlc1xuICAgKiB0aGUgc3RhdGUgb2YgdGhlIHRyaWdnZXIgcmlnaHQgYmVmb3JlIHRoZSBvcGVuaW5nIHNlcXVlbmNlIHdhcyBmaW5pc2hlZC5cbiAgICovXG4gIHByaXZhdGUgX2VtaXRPcGVuZWQoKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUub3BlbmVkLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQYW5lbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHaXZlbiBhIHZhbHVlLCByZXR1cm5zIHRoZSBzdHJpbmcgdGhhdCBzaG91bGQgYmUgc2hvd24gd2l0aGluIHRoZSBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlzcGxheVZhbHVlPFQ+KHZhbHVlOiBUKTogVCB8IHN0cmluZyB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGU7XG4gICAgcmV0dXJuIGF1dG9jb21wbGV0ZSAmJiBhdXRvY29tcGxldGUuZGlzcGxheVdpdGggPyBhdXRvY29tcGxldGUuZGlzcGxheVdpdGgodmFsdWUpIDogdmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9hc3NpZ25PcHRpb25WYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdG9EaXNwbGF5ID0gdGhpcy5fZ2V0RGlzcGxheVZhbHVlKHZhbHVlKTtcblxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIFNpbXBseSBmYWxsaW5nIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBkaXNwbGF5IHZhbHVlIGlzIGZhbHN5IGRvZXMgbm90IHdvcmsgcHJvcGVybHkuXG4gICAgLy8gVGhlIGRpc3BsYXkgdmFsdWUgY2FuIGFsc28gYmUgdGhlIG51bWJlciB6ZXJvIGFuZCBzaG91bGRuJ3QgZmFsbCBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICB0aGlzLl91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHRvRGlzcGxheSAhPSBudWxsID8gdG9EaXNwbGF5IDogJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTmF0aXZlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gSWYgaXQncyB1c2VkIHdpdGhpbiBhIGBNYXRGb3JtRmllbGRgLCB3ZSBzaG91bGQgc2V0IGl0IHRocm91Z2ggdGhlIHByb3BlcnR5IHNvIGl0IGNhbiBnb1xuICAgIC8vIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICBpZiAodGhpcy5fZm9ybUZpZWxkKSB7XG4gICAgICB0aGlzLl9mb3JtRmllbGQuX2NvbnRyb2wudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNsb3NlcyB0aGUgcGFuZWwsIGFuZCBpZiBhIHZhbHVlIGlzIHNwZWNpZmllZCwgYWxzbyBzZXRzIHRoZSBhc3NvY2lhdGVkXG4gICAqIGNvbnRyb2wgdG8gdGhhdCB2YWx1ZS4gSXQgd2lsbCBhbHNvIG1hcmsgdGhlIGNvbnRyb2wgYXMgZGlydHkgaWYgdGhpcyBpbnRlcmFjdGlvblxuICAgKiBzdGVtbWVkIGZyb20gdGhlIHVzZXIuXG4gICAqL1xuICBwcml2YXRlIF9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50OiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgfCBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLmF1dG9jb21wbGV0ZTtcbiAgICBjb25zdCB0b1NlbGVjdCA9IGV2ZW50ID8gZXZlbnQuc291cmNlIDogdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbjtcblxuICAgIGlmICh0b1NlbGVjdCkge1xuICAgICAgdGhpcy5fY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKHRvU2VsZWN0KTtcbiAgICAgIHRoaXMuX2Fzc2lnbk9wdGlvblZhbHVlKHRvU2VsZWN0LnZhbHVlKTtcbiAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNob3VsZCB3YWl0IHVudGlsIHRoZSBhbmltYXRpb24gaXMgZG9uZSwgb3RoZXJ3aXNlIHRoZSB2YWx1ZVxuICAgICAgLy8gZ2V0cyByZXNldCB3aGlsZSB0aGUgcGFuZWwgaXMgc3RpbGwgYW5pbWF0aW5nIHdoaWNoIGxvb2tzIGdsaXRjaHkuIEl0J2xsIGxpa2VseSBicmVha1xuICAgICAgLy8gc29tZSB0ZXN0cyB0byBjaGFuZ2UgaXQgYXQgdGhpcyBwb2ludC5cbiAgICAgIHRoaXMuX29uQ2hhbmdlKHRvU2VsZWN0LnZhbHVlKTtcbiAgICAgIHBhbmVsLl9lbWl0U2VsZWN0RXZlbnQodG9TZWxlY3QpO1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBhbmVsLnJlcXVpcmVTZWxlY3Rpb24gJiZcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSAhPT0gdGhpcy5fdmFsdWVPbkF0dGFjaFxuICAgICkge1xuICAgICAgdGhpcy5fY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKG51bGwpO1xuICAgICAgdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUobnVsbCk7XG4gICAgICAvLyBXYWl0IGZvciB0aGUgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgY2xlYXJpbmcgdGhlIGZvcm0gY29udHJvbCB2YWx1ZSwgb3RoZXJ3aXNlXG4gICAgICAvLyB0aGUgb3B0aW9ucyBtaWdodCBjaGFuZ2Ugd2hpbGUgdGhlIGFuaW1hdGlvbiBpcyBydW5uaW5nIHdoaWNoIGxvb2tzIGdsaXRjaHkuXG4gICAgICBpZiAocGFuZWwuX2FuaW1hdGlvbkRvbmUpIHtcbiAgICAgICAgcGFuZWwuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25DaGFuZ2UobnVsbCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UobnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYW55IHByZXZpb3VzIHNlbGVjdGVkIG9wdGlvbiBhbmQgZW1pdCBhIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgZm9yIHRoaXMgb3B0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24oc2tpcDogTWF0T3B0aW9uIHwgbnVsbCwgZW1pdEV2ZW50PzogYm9vbGVhbikge1xuICAgIC8vIE51bGwgY2hlY2tzIGFyZSBuZWNlc3NhcnkgaGVyZSwgYmVjYXVzZSB0aGUgYXV0b2NvbXBsZXRlXG4gICAgLy8gb3IgaXRzIG9wdGlvbnMgbWF5IG5vdCBoYXZlIGJlZW4gYXNzaWduZWQgeWV0LlxuICAgIHRoaXMuYXV0b2NvbXBsZXRlPy5vcHRpb25zPy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uICE9PSBza2lwICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uZGVzZWxlY3QoZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX29wZW5QYW5lbEludGVybmFsKHZhbHVlT25BdHRhY2ggPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICB0aGlzLl9hdHRhY2hPdmVybGF5KHZhbHVlT25BdHRhY2gpO1xuICAgIHRoaXMuX2Zsb2F0TGFiZWwoKTtcbiAgICAvLyBBZGQgYXJpYS1vd25zIGF0dHJpYnV0ZSB3aGVuIHRoZSBhdXRvY29tcGxldGUgYmVjb21lcyB2aXNpYmxlLlxuICAgIGlmICh0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIGNvbnN0IHBhbmVsSWQgPSB0aGlzLmF1dG9jb21wbGV0ZS5pZDtcbiAgICAgIGFkZEFyaWFSZWZlcmVuY2VkSWQodGhpcy5fdHJhY2tlZE1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoT3ZlcmxheSh2YWx1ZU9uQXR0YWNoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpO1xuICAgIH1cblxuICAgIGxldCBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcblxuICAgIGlmICghb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuYXV0b2NvbXBsZXRlLnRlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLCB7XG4gICAgICAgIGlkOiB0aGlzLl9mb3JtRmllbGQ/LmdldExhYmVsSWQoKSxcbiAgICAgIH0pO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl92YWx1ZU9uQXR0YWNoID0gdmFsdWVPbkF0dGFjaDtcbiAgICAgIHRoaXMuX3ZhbHVlT25MYXN0S2V5ZG93biA9IG51bGw7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gdHJ1ZTtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fbGF0ZXN0T3BlbmluZ1RyaWdnZXIgPSB0aGlzO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRDb2xvcih0aGlzLl9mb3JtRmllbGQ/LmNvbG9yKTtcbiAgICB0aGlzLl91cGRhdGVQYW5lbFN0YXRlKCk7XG4gICAgdGhpcy5fYXBwbHlNb2RhbFBhbmVsT3duZXJzaGlwKCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIGFuIGV4dHJhIGBwYW5lbE9wZW5gIGNoZWNrIGluIGhlcmUsIGJlY2F1c2UgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHdvbid0IGJlIHNob3duIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiB3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlUGFuZWxLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgLy8gQ2xvc2Ugd2hlbiBwcmVzc2luZyBFU0NBUEUgb3IgQUxUICsgVVBfQVJST1csIGJhc2VkIG9uIHRoZSBhMTF5IGd1aWRlbGluZXMuXG4gICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgIGlmIChcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyAmJiBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpKVxuICAgICkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFkIHR5cGVkIHNvbWV0aGluZyBpbiBiZWZvcmUgd2UgYXV0b3NlbGVjdGVkIGFuIG9wdGlvbiwgYW5kIHRoZXkgZGVjaWRlZFxuICAgICAgLy8gdG8gY2FuY2VsIHRoZSBzZWxlY3Rpb24sIHJlc3RvcmUgdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhleSBoYWQgdHlwZWQgaW4uXG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbikge1xuICAgICAgICB0aGlzLl91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHRoaXMuX3ZhbHVlQmVmb3JlQXV0b1NlbGVjdGlvbiA/PyAnJyk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvbiwgb3RoZXJ3aXNlIHRoZSBldmVudCB3aWxsIGV2ZW50dWFsbHlcbiAgICAgIC8vIHJlYWNoIHRoZSBpbnB1dCBpdHNlbGYgYW5kIGNhdXNlIHRoZSBvdmVybGF5IHRvIGJlIHJlb3BlbmVkLlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKiogVXBkYXRlcyB0aGUgcGFuZWwncyB2aXNpYmlsaXR5IHN0YXRlIGFuZCBhbnkgdHJpZ2dlciBzdGF0ZSB0aWVkIHRvIGlkLiAqL1xuICBwcml2YXRlIF91cGRhdGVQYW5lbFN0YXRlKCkge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRWaXNpYmlsaXR5KCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgaGVyZSB3ZSBzdWJzY3JpYmUgYW5kIHVuc3Vic2NyaWJlIGJhc2VkIG9uIHRoZSBwYW5lbCdzIHZpc2libGl0eSBzdGF0ZSxcbiAgICAvLyBiZWNhdXNlIHRoZSBhY3Qgb2Ygc3Vic2NyaWJpbmcgd2lsbCBwcmV2ZW50IGV2ZW50cyBmcm9tIHJlYWNoaW5nIG90aGVyIG92ZXJsYXlzIGFuZFxuICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gYmxvY2sgdGhlIGV2ZW50cyBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmITtcblxuICAgICAgaWYgKCF0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gICAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUodGhpcy5faGFuZGxlUGFuZWxLZXlkb3duKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBwb2ludGVyIGV2ZW50cyBzdHJlYW0gc28gdGhhdCBpdCBkb2Vzbid0IGdldCBwaWNrZWQgdXAgYnkgb3RoZXIgb3ZlcmxheXMuXG4gICAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBzaG91bGQgc3dpdGNoIGBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtYCBldmVudHVhbGx5IHRvIHVzZSB0aGlzIHN0cmVhbSxcbiAgICAgICAgLy8gYnV0IHRoZSBiZWh2aW9yIGlzbid0IGV4YWN0bHkgdGhlIHNhbWUgYW5kIGl0IGVuZHMgdXAgYnJlYWtpbmcgc29tZSBpbnRlcm5hbCB0ZXN0cy5cbiAgICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uID0gb3ZlcmxheVJlZi5vdXRzaWRlUG9pbnRlckV2ZW50cygpLnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IHRoaXMuX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/PyB1bmRlZmluZWQsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLl9kZWZhdWx0cz8ub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5UG9zaXRpb24oKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgY29uc3Qgc3RyYXRlZ3kgPSB0aGlzLl9vdmVybGF5XG4gICAgICAucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFB1c2goZmFsc2UpO1xuXG4gICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICAgIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICByZXR1cm4gc3RyYXRlZ3k7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3kgYmFzZWQgb24gdGhlIGRpcmVjdGl2ZSdzIGlucHV0IHN0YXRlLiAqL1xuICBwcml2YXRlIF9zZXRTdHJhdGVneVBvc2l0aW9ucyhwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgcHJvdmlkZSBob3Jpem9udGFsIGZhbGxiYWNrIHBvc2l0aW9ucywgZXZlbiB0aG91Z2ggYnkgZGVmYXVsdCB0aGUgZHJvcGRvd25cbiAgICAvLyB3aWR0aCBtYXRjaGVzIHRoZSBpbnB1dCwgYmVjYXVzZSBjb25zdW1lcnMgY2FuIG92ZXJyaWRlIHRoZSB3aWR0aC4gU2VlICMxODg1NC5cbiAgICBjb25zdCBiZWxvd1Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnYm90dG9tJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAndG9wJ30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAndG9wJ30sXG4gICAgXTtcblxuICAgIC8vIFRoZSBvdmVybGF5IGVkZ2UgY29ubmVjdGVkIHRvIHRoZSB0cmlnZ2VyIHNob3VsZCBoYXZlIHNxdWFyZWQgY29ybmVycywgd2hpbGVcbiAgICAvLyB0aGUgb3Bwb3NpdGUgZW5kIGhhcyByb3VuZGVkIGNvcm5lcnMuIFdlIGFwcGx5IGEgQ1NTIGNsYXNzIHRvIHN3YXAgdGhlXG4gICAgLy8gYm9yZGVyLXJhZGl1cyBiYXNlZCBvbiB0aGUgb3ZlcmxheSBwb3NpdGlvbi5cbiAgICBjb25zdCBwYW5lbENsYXNzID0gdGhpcy5fYWJvdmVDbGFzcztcbiAgICBjb25zdCBhYm92ZVBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAndG9wJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc30sXG4gICAgXTtcblxuICAgIGxldCBwb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW107XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2Fib3ZlJykge1xuICAgICAgcG9zaXRpb25zID0gYWJvdmVQb3NpdGlvbnM7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYmVsb3cnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBiZWxvd1Bvc2l0aW9ucztcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zaXRpb25zID0gWy4uLmJlbG93UG9zaXRpb25zLCAuLi5hYm92ZVBvc2l0aW9uc107XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdHJhdGVneS53aXRoUG9zaXRpb25zKHBvc2l0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRDb25uZWN0ZWRFbGVtZW50KCk6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0ZWRUbykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGVkVG8uZWxlbWVudFJlZjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKSA6IHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBwcml2YXRlIF9nZXRQYW5lbFdpZHRoKCk6IG51bWJlciB8IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLnBhbmVsV2lkdGggfHwgdGhpcy5fZ2V0SG9zdFdpZHRoKCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIGlucHV0IGVsZW1lbnQsIHNvIHRoZSBwYW5lbCB3aWR0aCBjYW4gbWF0Y2ggaXQuICovXG4gIHByaXZhdGUgX2dldEhvc3RXaWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYWN0aXZlIGl0ZW0gdG8gLTEuIFRoaXMgaXMgc28gdGhhdCBwcmVzc2luZyBhcnJvdyBrZXlzIHdpbGwgYWN0aXZhdGUgdGhlIGNvcnJlY3RcbiAgICogb3B0aW9uLlxuICAgKlxuICAgKiBJZiB0aGUgY29uc3VtZXIgb3B0ZWQtaW4gdG8gYXV0b21hdGljYWxseSBhY3RpdmF0YXRpbmcgdGhlIGZpcnN0IG9wdGlvbiwgYWN0aXZhdGUgdGhlIGZpcnN0XG4gICAqICplbmFibGVkKiBvcHRpb24uXG4gICAqL1xuICBwcml2YXRlIF9yZXNldEFjdGl2ZUl0ZW0oKTogdm9pZCB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGU7XG5cbiAgICBpZiAoYXV0b2NvbXBsZXRlLmF1dG9BY3RpdmVGaXJzdE9wdGlvbikge1xuICAgICAgLy8gRmluZCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0ICplbmFibGVkKiBvcHRpb24uIEF2b2lkIGNhbGxpbmcgYF9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW1gXG4gICAgICAvLyBiZWNhdXNlIGl0IGFjdGl2YXRlcyB0aGUgZmlyc3Qgb3B0aW9uIHRoYXQgcGFzc2VzIHRoZSBza2lwIHByZWRpY2F0ZSwgcmF0aGVyIHRoYW4gdGhlXG4gICAgICAvLyBmaXJzdCAqZW5hYmxlZCogb3B0aW9uLlxuICAgICAgbGV0IGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4ID0gLTE7XG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBhdXRvY29tcGxldGUub3B0aW9ucy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gYXV0b2NvbXBsZXRlLm9wdGlvbnMuZ2V0KGluZGV4KSE7XG4gICAgICAgIGlmICghb3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgZmlyc3RFbmFibGVkT3B0aW9uSW5kZXggPSBpbmRleDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oZmlyc3RFbmFibGVkT3B0aW9uSW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhdXRvY29tcGxldGUuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSgtMSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgcGFuZWwgY2FuIGJlIG9wZW5lZC4gKi9cbiAgcHJpdmF0ZSBfY2FuT3BlbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgIHJldHVybiAhZWxlbWVudC5yZWFkT25seSAmJiAhZWxlbWVudC5kaXNhYmxlZCAmJiAhdGhpcy5hdXRvY29tcGxldGVEaXNhYmxlZDtcbiAgfVxuXG4gIC8qKiBVc2UgZGVmYXVsdFZpZXcgb2YgaW5qZWN0ZWQgZG9jdW1lbnQgaWYgYXZhaWxhYmxlIG9yIGZhbGxiYWNrIHRvIGdsb2JhbCB3aW5kb3cgcmVmZXJlbmNlICovXG4gIHByaXZhdGUgX2dldFdpbmRvdygpOiBXaW5kb3cge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudD8uZGVmYXVsdFZpZXcgfHwgd2luZG93O1xuICB9XG5cbiAgLyoqIFNjcm9sbHMgdG8gYSBwYXJ0aWN1bGFyIG9wdGlvbiBpbiB0aGUgbGlzdC4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG9PcHRpb24oaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIC8vIEdpdmVuIHRoYXQgd2UgYXJlIG5vdCBhY3R1YWxseSBmb2N1c2luZyBhY3RpdmUgb3B0aW9ucywgd2UgbXVzdCBtYW51YWxseSBhZGp1c3Qgc2Nyb2xsXG4gICAgLy8gdG8gcmV2ZWFsIG9wdGlvbnMgYmVsb3cgdGhlIGZvbGQuIEZpcnN0LCB3ZSBmaW5kIHRoZSBvZmZzZXQgb2YgdGhlIG9wdGlvbiBmcm9tIHRoZSB0b3BcbiAgICAvLyBvZiB0aGUgcGFuZWwuIElmIHRoYXQgb2Zmc2V0IGlzIGJlbG93IHRoZSBmb2xkLCB0aGUgbmV3IHNjcm9sbFRvcCB3aWxsIGJlIHRoZSBvZmZzZXQgLVxuICAgIC8vIHRoZSBwYW5lbCBoZWlnaHQgKyB0aGUgb3B0aW9uIGhlaWdodCwgc28gdGhlIGFjdGl2ZSBvcHRpb24gd2lsbCBiZSBqdXN0IHZpc2libGUgYXQgdGhlXG4gICAgLy8gYm90dG9tIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYWJvdmUgdGhlIHRvcCBvZiB0aGUgdmlzaWJsZSBwYW5lbCwgdGhlIG5ldyBzY3JvbGxUb3BcbiAgICAvLyB3aWxsIGJlY29tZSB0aGUgb2Zmc2V0LiBJZiB0aGF0IG9mZnNldCBpcyB2aXNpYmxlIHdpdGhpbiB0aGUgcGFuZWwgYWxyZWFkeSwgdGhlIHNjcm9sbFRvcCBpc1xuICAgIC8vIG5vdCBhZGp1c3RlZC5cbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcbiAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oXG4gICAgICBpbmRleCxcbiAgICAgIGF1dG9jb21wbGV0ZS5vcHRpb25zLFxuICAgICAgYXV0b2NvbXBsZXRlLm9wdGlvbkdyb3VwcyxcbiAgICApO1xuXG4gICAgaWYgKGluZGV4ID09PSAwICYmIGxhYmVsQ291bnQgPT09IDEpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGdvdCBvbmUgZ3JvdXAgbGFiZWwgYmVmb3JlIHRoZSBvcHRpb24gYW5kIHdlJ3JlIGF0IHRoZSB0b3Agb3B0aW9uLFxuICAgICAgLy8gc2Nyb2xsIHRoZSBsaXN0IHRvIHRoZSB0b3AuIFRoaXMgaXMgYmV0dGVyIFVYIHRoYW4gc2Nyb2xsaW5nIHRoZSBsaXN0IHRvIHRoZVxuICAgICAgLy8gdG9wIG9mIHRoZSBvcHRpb24sIGJlY2F1c2UgaXQgYWxsb3dzIHRoZSB1c2VyIHRvIHJlYWQgdGhlIHRvcCBncm91cCdzIGxhYmVsLlxuICAgICAgYXV0b2NvbXBsZXRlLl9zZXRTY3JvbGxUb3AoMCk7XG4gICAgfSBlbHNlIGlmIChhdXRvY29tcGxldGUucGFuZWwpIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGF1dG9jb21wbGV0ZS5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF07XG5cbiAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IG9wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKTtcbiAgICAgICAgY29uc3QgbmV3U2Nyb2xsUG9zaXRpb24gPSBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICAgICAgZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgYXV0b2NvbXBsZXRlLl9nZXRTY3JvbGxUb3AoKSxcbiAgICAgICAgICBhdXRvY29tcGxldGUucGFuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgYXV0b2NvbXBsZXRlLl9zZXRTY3JvbGxUb3AobmV3U2Nyb2xsUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayB3aGljaCBtb2RhbCB3ZSBoYXZlIG1vZGlmaWVkIHRoZSBgYXJpYS1vd25zYCBhdHRyaWJ1dGUgb2YuIFdoZW4gdGhlIGNvbWJvYm94IHRyaWdnZXIgaXNcbiAgICogaW5zaWRlIGFuIGFyaWEtbW9kYWwsIHdlIGFwcGx5IGFyaWEtb3ducyB0byB0aGUgcGFyZW50IG1vZGFsIHdpdGggdGhlIGBpZGAgb2YgdGhlIG9wdGlvbnNcbiAgICogcGFuZWwuIFRyYWNrIHRoZSBtb2RhbCB3ZSBoYXZlIGNoYW5nZWQgc28gd2UgY2FuIHVuZG8gdGhlIGNoYW5nZXMgb24gZGVzdHJveS5cbiAgICovXG4gIHByaXZhdGUgX3RyYWNrZWRNb2RhbDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIgaXMgaW5zaWRlIG9mIGFuIGBhcmlhLW1vZGFsYCBlbGVtZW50LCBjb25uZWN0XG4gICAqIHRoYXQgbW9kYWwgdG8gdGhlIG9wdGlvbnMgcGFuZWwgd2l0aCBgYXJpYS1vd25zYC5cbiAgICpcbiAgICogRm9yIHNvbWUgYnJvd3NlciArIHNjcmVlbiByZWFkZXIgY29tYmluYXRpb25zLCB3aGVuIG5hdmlnYXRpb24gaXMgaW5zaWRlXG4gICAqIG9mIGFuIGBhcmlhLW1vZGFsYCBlbGVtZW50LCB0aGUgc2NyZWVuIHJlYWRlciB0cmVhdHMgZXZlcnl0aGluZyBvdXRzaWRlXG4gICAqIG9mIHRoYXQgbW9kYWwgYXMgaGlkZGVuIG9yIGludmlzaWJsZS5cbiAgICpcbiAgICogVGhpcyBjYXVzZXMgYSBwcm9ibGVtIHdoZW4gdGhlIGNvbWJvYm94IHRyaWdnZXIgaXMgX2luc2lkZV8gb2YgYSBtb2RhbCwgYmVjYXVzZSB0aGVcbiAgICogb3B0aW9ucyBwYW5lbCBpcyByZW5kZXJlZCBfb3V0c2lkZV8gb2YgdGhhdCBtb2RhbCwgcHJldmVudGluZyBzY3JlZW4gcmVhZGVyIG5hdmlnYXRpb25cbiAgICogZnJvbSByZWFjaGluZyB0aGUgcGFuZWwuXG4gICAqXG4gICAqIFdlIGNhbiB3b3JrIGFyb3VuZCB0aGlzIGlzc3VlIGJ5IGFwcGx5aW5nIGBhcmlhLW93bnNgIHRvIHRoZSBtb2RhbCB3aXRoIHRoZSBgaWRgIG9mXG4gICAqIHRoZSBvcHRpb25zIHBhbmVsLiBUaGlzIGVmZmVjdGl2ZWx5IGNvbW11bmljYXRlcyB0byBhc3Npc3RpdmUgdGVjaG5vbG9neSB0aGF0IHRoZVxuICAgKiBvcHRpb25zIHBhbmVsIGlzIHBhcnQgb2YgdGhlIHNhbWUgaW50ZXJhY3Rpb24gYXMgdGhlIG1vZGFsLlxuICAgKlxuICAgKiBBdCB0aW1lIG9mIHRoaXMgd3JpdGluZywgdGhpcyBpc3N1ZSBpcyBwcmVzZW50IGluIFZvaWNlT3Zlci5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNjk0XG4gICAqL1xuICBwcml2YXRlIF9hcHBseU1vZGFsUGFuZWxPd25lcnNoaXAoKSB7XG4gICAgLy8gVE9ETyhodHRwOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzI2ODUzKTogY29uc2lkZXIgZGUtZHVwbGljYXRpbmcgdGhpcyB3aXRoXG4gICAgLy8gdGhlIGBMaXZlQW5ub3VuY2VyYCBhbmQgYW55IG90aGVyIHVzYWdlcy5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB0aGUgc2VsZWN0b3IgaGVyZSBpcyBsaW1pdGVkIHRvIENESyBvdmVybGF5cyBhdCB0aGUgbW9tZW50IGluIG9yZGVyIHRvIHJlZHVjZSB0aGVcbiAgICAvLyBzZWN0aW9uIG9mIHRoZSBET00gd2UgbmVlZCB0byBsb29rIHRocm91Z2guIFRoaXMgc2hvdWxkIGNvdmVyIGFsbCB0aGUgY2FzZXMgd2Ugc3VwcG9ydCwgYnV0XG4gICAgLy8gdGhlIHNlbGVjdG9yIGNhbiBiZSBleHBhbmRlZCBpZiBpdCB0dXJucyBvdXQgdG8gYmUgdG9vIG5hcnJvdy5cbiAgICBjb25zdCBtb2RhbCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbG9zZXN0KFxuICAgICAgJ2JvZHkgPiAuY2RrLW92ZXJsYXktY29udGFpbmVyIFthcmlhLW1vZGFsPVwidHJ1ZVwiXScsXG4gICAgKTtcblxuICAgIGlmICghbW9kYWwpIHtcbiAgICAgIC8vIE1vc3QgY29tbW9ubHksIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBub3QgaW5zaWRlIGEgbW9kYWwuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFuZWxJZCA9IHRoaXMuYXV0b2NvbXBsZXRlLmlkO1xuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB9XG5cbiAgICBhZGRBcmlhUmVmZXJlbmNlZElkKG1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgdGhpcy5fdHJhY2tlZE1vZGFsID0gbW9kYWw7XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSByZWZlcmVuY2VzIHRvIHRoZSBsaXN0Ym94IG92ZXJsYXkgZWxlbWVudCBmcm9tIHRoZSBtb2RhbCBpdCB3YXMgYWRkZWQgdG8uICovXG4gIHByaXZhdGUgX2NsZWFyRnJvbU1vZGFsKCkge1xuICAgIGlmICh0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIGNvbnN0IHBhbmVsSWQgPSB0aGlzLmF1dG9jb21wbGV0ZS5pZDtcblxuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICAgIHRoaXMuX3RyYWNrZWRNb2RhbCA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=