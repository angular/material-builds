/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { addAriaReferencedId, removeAriaReferencedId } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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
        /** Implements BreakpointObserver to be used to detect handset landscape */
        this._breakpointObserver = inject(BreakpointObserver);
        this._handsetLandscapeSubscription = Subscription.EMPTY;
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
        this._handsetLandscapeSubscription.unsubscribe();
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
            // Subscribe to the breakpoint events stream to detect when screen is in
            // handsetLandscape.
            this._handsetLandscapeSubscription = this._breakpointObserver
                .observe(Breakpoints.HandsetLandscape)
                .subscribe(result => {
                const isHandsetLandscape = result.matches;
                // Check if result.matches Breakpoints.HandsetLandscape. Apply HandsetLandscape
                // settings to prevent overlay cutoff in that breakpoint. Fixes b/284148377
                if (isHandsetLandscape) {
                    this._positionStrategy
                        .withFlexibleDimensions(true)
                        .withGrowAfterOpen(true)
                        .withViewportMargin(8);
                }
                else {
                    this._positionStrategy
                        .withFlexibleDimensions(false)
                        .withGrowAfterOpen(false)
                        .withViewportMargin(0);
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
        // Set default Overlay Position
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRTlFLE9BQU8sRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9GLE9BQU8sRUFBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBR0wsT0FBTyxFQUNQLGFBQWEsR0FJZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsSUFBSSxFQUNKLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUVSLGdCQUFnQixFQUNoQixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDVixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZFLE9BQU8sRUFFTCx3QkFBd0IsRUFDeEIsNkJBQTZCLEVBQzdCLHdCQUF3QixHQUN6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RSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthZGRBcmlhUmVmZXJlbmNlZElkLCByZW1vdmVBcmlhUmVmZXJlbmNlZElkfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1csIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtCcmVha3BvaW50T2JzZXJ2ZXIsIEJyZWFrcG9pbnRzfSBmcm9tICdAYW5ndWxhci9jZGsvbGF5b3V0JztcbmltcG9ydCB7XG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge19nZXRFdmVudFRhcmdldH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBhZnRlck5leHRSZW5kZXIsXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG4gIGZvcndhcmRSZWYsXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNQVRfRk9STV9GSUVMRCwgTWF0Rm9ybUZpZWxkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdCwgU3Vic2NyaXB0aW9uLCBkZWZlciwgZnJvbUV2ZW50LCBtZXJnZSwgb2YgYXMgb2JzZXJ2YWJsZU9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyxcbiAgTWF0QXV0b2NvbXBsZXRlLFxuICBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtNYXRBdXRvY29tcGxldGVPcmlnaW59IGZyb20gJy4vYXV0b2NvbXBsZXRlLW9yaWdpbic7XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIGF1dG9jb21wbGV0ZSB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGVycm9yIHRvIGJlIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gdXNlIGFuIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIHdpdGhvdXQgYSBwYW5lbC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdEF1dG9jb21wbGV0ZU1pc3NpbmdQYW5lbEVycm9yKCk6IEVycm9yIHtcbiAgcmV0dXJuIEVycm9yKFxuICAgICdBdHRlbXB0aW5nIHRvIG9wZW4gYW4gdW5kZWZpbmVkIGluc3RhbmNlIG9mIGBtYXQtYXV0b2NvbXBsZXRlYC4gJyArXG4gICAgICAnTWFrZSBzdXJlIHRoYXQgdGhlIGlkIHBhc3NlZCB0byB0aGUgYG1hdEF1dG9jb21wbGV0ZWAgaXMgY29ycmVjdCBhbmQgdGhhdCAnICtcbiAgICAgIFwieW91J3JlIGF0dGVtcHRpbmcgdG8gb3BlbiBpdCBhZnRlciB0aGUgbmdBZnRlckNvbnRlbnRJbml0IGhvb2suXCIsXG4gICk7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PihcbiAgJ21hdC1hdXRvY29tcGxldGUtc2Nyb2xsLXN0cmF0ZWd5JyxcbiAge1xuICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICBmYWN0b3J5OiAoKSA9PiB7XG4gICAgICBjb25zdCBvdmVybGF5ID0gaW5qZWN0KE92ZXJsYXkpO1xuICAgICAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG4gICAgfSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRBdXRvY29tcGxldGVUcmlnZ2VyYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgaW5wdXRbbWF0QXV0b2NvbXBsZXRlXSwgdGV4dGFyZWFbbWF0QXV0b2NvbXBsZXRlXWAsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1hdXRvY29tcGxldGUtdHJpZ2dlcicsXG4gICAgJ1thdHRyLmF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlQXR0cmlidXRlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJjb21ib2JveFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICcocGFuZWxPcGVuICYmIGFjdGl2ZU9wdGlvbikgPyBhY3RpdmVPcHRpb24uaWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogcGFuZWxPcGVuLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICcoYXV0b2NvbXBsZXRlRGlzYWJsZWQgfHwgIXBhbmVsT3BlbikgPyBudWxsIDogYXV0b2NvbXBsZXRlPy5pZCcsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdGJveFwiJyxcbiAgICAvLyBOb3RlOiB3ZSB1c2UgYGZvY3VzaW5gLCBhcyBvcHBvc2VkIHRvIGBmb2N1c2AsIGluIG9yZGVyIHRvIG9wZW4gdGhlIHBhbmVsXG4gICAgLy8gYSBsaXR0bGUgZWFybGllci4gVGhpcyBhdm9pZHMgaXNzdWVzIHdoZXJlIElFIGRlbGF5cyB0aGUgZm9jdXNpbmcgb2YgdGhlIGlucHV0LlxuICAgICcoZm9jdXNpbiknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJyxcbiAgICAnKGlucHV0KSc6ICdfaGFuZGxlSW5wdXQoJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdfaGFuZGxlQ2xpY2soKScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlVHJpZ2dlcicsXG4gIHByb3ZpZGVyczogW01BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1JdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVUcmlnZ2VyXG4gIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX292ZXJsYXlSZWY6IE92ZXJsYXlSZWYgfCBudWxsO1xuICBwcml2YXRlIF9wb3J0YWw6IFRlbXBsYXRlUG9ydGFsO1xuICBwcml2YXRlIF9jb21wb25lbnREZXN0cm95ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3k6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIF9rZXlkb3duU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gfCBudWxsO1xuICBwcml2YXRlIF9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IG51bGw7XG5cbiAgLyoqIE9sZCB2YWx1ZSBvZiB0aGUgbmF0aXZlIGlucHV0LiBVc2VkIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aXRoIHRoZSBgaW5wdXRgIGV2ZW50IG9uIElFLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgaW5wdXQgZWxlbWVudCB3aGVuIHRoZSBwYW5lbCB3YXMgYXR0YWNoZWQgKGV2ZW4gaWYgdGhlcmUgYXJlIG5vIG9wdGlvbnMpLiAqL1xuICBwcml2YXRlIF92YWx1ZU9uQXR0YWNoOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBWYWx1ZSBvbiB0aGUgcHJldmlvdXMga2V5ZG93biBldmVudC4gKi9cbiAgcHJpdmF0ZSBfdmFsdWVPbkxhc3RLZXlkb3duOiBzdHJpbmcgfCBudWxsO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IGlzIHVzZWQgdG8gcG9zaXRpb24gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBsYWJlbCBzdGF0ZSBpcyBiZWluZyBvdmVycmlkZGVuLiAqL1xuICBwcml2YXRlIF9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcblxuICAvKiogVGhlIHN1YnNjcmlwdGlvbiBmb3IgY2xvc2luZyBhY3Rpb25zIChzb21lIGFyZSBib3VuZCB0byBkb2N1bWVudCkuICovXG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBJbXBsZW1lbnRzIEJyZWFrcG9pbnRPYnNlcnZlciB0byBiZSB1c2VkIHRvIGRldGVjdCBoYW5kc2V0IGxhbmRzY2FwZSAqL1xuICBwcml2YXRlIF9icmVha3BvaW50T2JzZXJ2ZXIgPSBpbmplY3QoQnJlYWtwb2ludE9ic2VydmVyKTtcbiAgcHJpdmF0ZSBfaGFuZHNldExhbmRzY2FwZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGNhbiBvcGVuIHRoZSBuZXh0IHRpbWUgaXQgaXMgZm9jdXNlZC4gVXNlZCB0byBwcmV2ZW50IGEgZm9jdXNlZCxcbiAgICogY2xvc2VkIGF1dG9jb21wbGV0ZSBmcm9tIGJlaW5nIHJlb3BlbmVkIGlmIHRoZSB1c2VyIHN3aXRjaGVzIHRvIGFub3RoZXIgYnJvd3NlciB0YWIgYW5kIHRoZW5cbiAgICogY29tZXMgYmFjay5cbiAgICovXG4gIHByaXZhdGUgX2Nhbk9wZW5Pbk5leHRGb2N1cyA9IHRydWU7XG5cbiAgLyoqIFZhbHVlIGluc2lkZSB0aGUgaW5wdXQgYmVmb3JlIHdlIGF1dG8tc2VsZWN0ZWQgYW4gb3B0aW9uLiAqL1xuICBwcml2YXRlIF92YWx1ZUJlZm9yZUF1dG9TZWxlY3Rpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ3VycmVudCBvcHRpb24gdGhhdCB3ZSBoYXZlIGF1dG8tc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZyxcbiAgICogYnV0IHdoaWNoIGhhc24ndCBiZWVuIHByb3BhZ2F0ZWQgdG8gdGhlIG1vZGVsIHZhbHVlIHlldC5cbiAgICovXG4gIHByaXZhdGUgX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb246IE1hdE9wdGlvbiB8IG51bGw7XG5cbiAgLyoqIFN0cmVhbSBvZiBrZXlib2FyZCBldmVudHMgdGhhdCBjYW4gY2xvc2UgdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbG9zZUtleUV2ZW50U3RyZWFtID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWQuIE5lZWRzIHRvIGJlIGFuXG4gICAqIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHVzZXIgYmx1cnJlZCB0aGUgd2luZG93IHdoaWxlIHRoZSBhdXRvY29tcGxldGUgaXMgZm9jdXNlZCwgaXQgbWVhbnMgdGhhdCBpdCdsbCBiZVxuICAgIC8vIHJlZm9jdXNlZCB3aGVuIHRoZXkgY29tZSBiYWNrLiBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBza2lwIHRoZSBmaXJzdCBmb2N1cyBldmVudCwgaWYgdGhlXG4gICAgLy8gcGFuZSB3YXMgY2xvc2VkLCBpbiBvcmRlciB0byBhdm9pZCByZW9wZW5pbmcgaXQgdW5pbnRlbnRpb25hbGx5LlxuICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9XG4gICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5wYW5lbE9wZW47XG4gIH07XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gYXV0b2NvbXBsZXRlIGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0byBiZSBhdHRhY2hlZCB0byB0aGlzIHRyaWdnZXIuICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlJykgYXV0b2NvbXBsZXRlOiBNYXRBdXRvY29tcGxldGU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgcmVsYXRpdmUgdG8gdGhlIHRyaWdnZXIgZWxlbWVudC4gQSBwb3NpdGlvbiBvZiBgYXV0b2BcbiAgICogd2lsbCByZW5kZXIgdGhlIHBhbmVsIHVuZGVybmVhdGggdGhlIHRyaWdnZXIgaWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIGZvciBpdCB0byBmaXQgaW5cbiAgICogdGhlIHZpZXdwb3J0LCBvdGhlcndpc2UgdGhlIHBhbmVsIHdpbGwgYmUgc2hvd24gYWJvdmUgaXQuIElmIHRoZSBwb3NpdGlvbiBpcyBzZXQgdG9cbiAgICogYGFib3ZlYCBvciBgYmVsb3dgLCB0aGUgcGFuZWwgd2lsbCBhbHdheXMgYmUgc2hvd24gYWJvdmUgb3IgYmVsb3cgdGhlIHRyaWdnZXIuIG5vIG1hdHRlclxuICAgKiB3aGV0aGVyIGl0IGZpdHMgY29tcGxldGVseSBpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZVBvc2l0aW9uJykgcG9zaXRpb246ICdhdXRvJyB8ICdhYm92ZScgfCAnYmVsb3cnID0gJ2F1dG8nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgcmVsYXRpdmUgdG8gd2hpY2ggdG8gcG9zaXRpb24gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAgICogRGVmYXVsdHMgdG8gdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGVsZW1lbnQuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZUNvbm5lY3RlZFRvJykgY29ubmVjdGVkVG86IE1hdEF1dG9jb21wbGV0ZU9yaWdpbjtcblxuICAvKipcbiAgICogYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIHRvIGJlIHNldCBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGVBdHRyaWJ1dGU6IHN0cmluZyA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBlbGVtZW50IHdpbGxcbiAgICogYWN0IGFzIGEgcmVndWxhciBpbnB1dCBhbmQgdGhlIHVzZXIgd29uJ3QgYmUgYWJsZSB0byBvcGVuIHRoZSBwYW5lbC5cbiAgICovXG4gIEBJbnB1dCh7YWxpYXM6ICdtYXRBdXRvY29tcGxldGVEaXNhYmxlZCcsIHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGF1dG9jb21wbGV0ZURpc2FibGVkOiBib29sZWFuO1xuXG4gIHByaXZhdGUgX2luaXRpYWxpemVkID0gbmV3IFN1YmplY3QoKTtcblxuICBwcml2YXRlIF9pbmplY3RvciA9IGluamVjdChJbmplY3Rvcik7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIEBIb3N0KCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQgfCBudWxsLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpXG4gICAgcHJpdmF0ZSBfZGVmYXVsdHM/OiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB8IG51bGwsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBhYm92ZSB0aGUgaW5wdXQuICovXG4gIHByaXZhdGUgX2Fib3ZlQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtcGFuZWwtYWJvdmUnO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplZC5uZXh0KCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQuY29tcGxldGUoKTtcblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgdGhpcy5fcG9zaXRpb25TdHJhdGVneSkge1xuICAgICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnModGhpcy5fcG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oYW5kc2V0TGFuZHNjYXBlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9jb21wb25lbnREZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2Rlc3Ryb3lQYW5lbCgpO1xuICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0uY29tcGxldGUoKTtcbiAgICB0aGlzLl9jbGVhckZyb21Nb2RhbCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmIHRoaXMuYXV0b2NvbXBsZXRlLnNob3dQYW5lbDtcbiAgfVxuICBwcml2YXRlIF9vdmVybGF5QXR0YWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BlbnMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBvcGVuUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fb3BlblBhbmVsSW50ZXJuYWwoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBjbG9zZVBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX3Jlc2V0TGFiZWwoKTtcblxuICAgIGlmICghdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBPbmx5IGVtaXQgaWYgdGhlIHBhbmVsIHdhcyB2aXNpYmxlLlxuICAgICAgLy8gYGFmdGVyTmV4dFJlbmRlcmAgYWx3YXlzIHJ1bnMgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLCBzbyBhbGwgdGhlIHN1YnNjcmlwdGlvbnMgZnJvbVxuICAgICAgLy8gYF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKClgIGFyZSBhbHNvIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICAgIC8vIFdlIHNob3VsZCBtYW51YWxseSBydW4gaW4gQW5ndWxhciB6b25lIHRvIHVwZGF0ZSBVSSBhZnRlciBwYW5lbCBjbG9zaW5nLlxuICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gT25seSByZXNldCBpZiB0aGlzIHRyaWdnZXIgaXMgdGhlIGxhdGVzdCBvbmUgdGhhdCBvcGVuZWQgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHNpbmNlIGFub3RoZXIgbWF5IGhhdmUgdGFrZW4gaXQgb3Zlci5cbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUuX2xhdGVzdE9wZW5pbmdUcmlnZ2VyID09PSB0aGlzKSB7XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fbGF0ZXN0T3BlbmluZ1RyaWdnZXIgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVQYW5lbFN0YXRlKCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgaW4gc29tZSBjYXNlcyB0aGlzIGNhbiBlbmQgdXAgYmVpbmcgY2FsbGVkIGFmdGVyIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgIC8vIEFkZCBhIGNoZWNrIHRvIGVuc3VyZSB0aGF0IHdlIGRvbid0IHRyeSB0byBydW4gY2hhbmdlIGRldGVjdGlvbiBvbiBhIGRlc3Ryb3llZCB2aWV3LlxuICAgIGlmICghdGhpcy5fY29tcG9uZW50RGVzdHJveWVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseSwgYmVjYXVzZVxuICAgICAgLy8gYGZyb21FdmVudGAgZG9lc24ndCBzZWVtIHRvIGRvIGl0IGF0IHRoZSBwcm9wZXIgdGltZS5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBsYWJlbCBpcyByZXNldCB3aGVuIHRoZVxuICAgICAgLy8gdXNlciBjbGlja3Mgb3V0c2lkZS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYXJpYS1vd25zIGF0dHJpYnV0ZSB3aGVuIHRoZSBhdXRvY29tcGxldGUgaXMgbm8gbG9uZ2VyIHZpc2libGUuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCB0aGlzLmF1dG9jb21wbGV0ZS5pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbCB0byBlbnN1cmUgdGhhdCBpdCBmaXRzIGFsbCBvcHRpb25zXG4gICAqIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHN0cmVhbSBvZiBhY3Rpb25zIHRoYXQgc2hvdWxkIGNsb3NlIHRoZSBhdXRvY29tcGxldGUgcGFuZWwsIGluY2x1ZGluZ1xuICAgKiB3aGVuIGFuIG9wdGlvbiBpcyBzZWxlY3RlZCwgb24gYmx1ciwgYW5kIHdoZW4gVEFCIGlzIHByZXNzZWQuXG4gICAqL1xuICBnZXQgcGFuZWxDbG9zaW5nQWN0aW9ucygpOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGw+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvbnMsXG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci50YWJPdXQucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSksXG4gICAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLFxuICAgICAgdGhpcy5fZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCksXG4gICAgICB0aGlzLl9vdmVybGF5UmVmXG4gICAgICAgID8gdGhpcy5fb3ZlcmxheVJlZi5kZXRhY2htZW50cygpLnBpcGUoZmlsdGVyKCgpID0+IHRoaXMuX292ZXJsYXlBdHRhY2hlZCkpXG4gICAgICAgIDogb2JzZXJ2YWJsZU9mKCksXG4gICAgKS5waXBlKFxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBvdXRwdXQgc28gd2UgcmV0dXJuIGEgY29uc2lzdGVudCB0eXBlLlxuICAgICAgbWFwKGV2ZW50ID0+IChldmVudCBpbnN0YW5jZW9mIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSA/IGV2ZW50IDogbnVsbCkpLFxuICAgICk7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGNoYW5nZXMgdG8gdGhlIHNlbGVjdGlvbiBzdGF0ZSBvZiB0aGUgYXV0b2NvbXBsZXRlIG9wdGlvbnMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbnM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5hdXRvY29tcGxldGUgPyB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zIDogbnVsbDtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aChvcHRpb25zKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IG1lcmdlKC4uLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24ub25TZWxlY3Rpb25DaGFuZ2UpKSksXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgc3Vic2NyaWJlcnMgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLCB0aGUgYGF1dG9jb21wbGV0ZWAgd2lsbCBiZSB1bmRlZmluZWQuXG4gICAgLy8gUmV0dXJuIGEgc3RyZWFtIHRoYXQgd2UnbGwgcmVwbGFjZSB3aXRoIHRoZSByZWFsIG9uZSBvbmNlIGV2ZXJ5dGhpbmcgaXMgaW4gcGxhY2UuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRpYWxpemVkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9ucykpO1xuICB9KSBhcyBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT47XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgYWN0aXZlIG9wdGlvbiwgY29lcmNlZCB0byBNYXRPcHRpb24gdHlwZS4gKi9cbiAgZ2V0IGFjdGl2ZU9wdGlvbigpOiBNYXRPcHRpb24gfCBudWxsIHtcbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdhdXhjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICd0b3VjaGVuZCcpIGFzIE9ic2VydmFibGU8VG91Y2hFdmVudD4sXG4gICAgKS5waXBlKFxuICAgICAgZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gSWYgd2UncmUgaW4gdGhlIFNoYWRvdyBET00sIHRoZSBldmVudCB0YXJnZXQgd2lsbCBiZSB0aGUgc2hhZG93IHJvb3QsIHNvIHdlIGhhdmUgdG9cbiAgICAgICAgLy8gZmFsbCBiYWNrIHRvIGNoZWNrIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBwYXRoIG9mIHRoZSBjbGljayBldmVudC5cbiAgICAgICAgY29uc3QgY2xpY2tUYXJnZXQgPSBfZ2V0RXZlbnRUYXJnZXQ8SFRNTEVsZW1lbnQ+KGV2ZW50KSE7XG4gICAgICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZFxuICAgICAgICAgID8gdGhpcy5fZm9ybUZpZWxkLmdldENvbm5lY3RlZE92ZXJsYXlPcmlnaW4oKS5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBjb25zdCBjdXN0b21PcmlnaW4gPSB0aGlzLmNvbm5lY3RlZFRvID8gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmXG4gICAgICAgICAgY2xpY2tUYXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgIC8vIE5vcm1hbGx5IGZvY3VzIG1vdmVzIGluc2lkZSBgbW91c2Vkb3duYCBzbyB0aGlzIGNvbmRpdGlvbiB3aWxsIGFsbW9zdCBhbHdheXMgYmVcbiAgICAgICAgICAvLyB0cnVlLiBJdHMgbWFpbiBwdXJwb3NlIGlzIHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgaXMgZm9jdXNlZCBmcm9tIGFuXG4gICAgICAgICAgLy8gb3V0c2lkZSBjbGljayB3aGljaCBwcm9wYWdhdGVzIHVwIHRvIHRoZSBgYm9keWAgbGlzdGVuZXIgd2l0aGluIHRoZSBzYW1lIHNlcXVlbmNlXG4gICAgICAgICAgLy8gYW5kIGNhdXNlcyB0aGUgcGFuZWwgdG8gY2xvc2UgaW1tZWRpYXRlbHkgKHNlZSAjMzEwNikuXG4gICAgICAgICAgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgKCFmb3JtRmllbGQgfHwgIWZvcm1GaWVsZC5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgKCFjdXN0b21PcmlnaW4gfHwgIWN1c3RvbU9yaWdpbi5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgISF0aGlzLl9vdmVybGF5UmVmICYmXG4gICAgICAgICAgIXRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY29udGFpbnMoY2xpY2tUYXJnZXQpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUodmFsdWUpKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gb24gYWxsIGVzY2FwZSBrZXkgcHJlc3Nlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseSB0byBicmluZyBJRVxuICAgIC8vIGluIGxpbmUgd2l0aCBvdGhlciBicm93c2Vycy4gQnkgZGVmYXVsdCwgcHJlc3NpbmcgZXNjYXBlIG9uIElFIHdpbGwgY2F1c2UgaXQgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhhdCBpdCBoYWQgb24gZm9jdXMsIGhvd2V2ZXIgaXQgd29uJ3QgZGlzcGF0Y2ggYW55IGV2ZW50c1xuICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIG1vZGVsIHZhbHVlIHdpbGwgYmUgb3V0IG9mIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZU9uTGFzdEtleWRvd24gPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWU7XG5cbiAgICBpZiAodGhpcy5hY3RpdmVPcHRpb24gJiYga2V5Q29kZSA9PT0gRU5URVIgJiYgdGhpcy5wYW5lbE9wZW4gJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9wdGlvbi5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBjb25zdCBwcmV2QWN0aXZlSXRlbSA9IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgICAgaWYgKGtleUNvZGUgPT09IFRBQiB8fCAoaXNBcnJvd0tleSAmJiAhaGFzTW9kaWZpZXIgJiYgdGhpcy5wYW5lbE9wZW4pKSB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyb3dLZXkgJiYgdGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICAgIHRoaXMuX29wZW5QYW5lbEludGVybmFsKHRoaXMuX3ZhbHVlT25MYXN0S2V5ZG93bik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Fycm93S2V5IHx8IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0gIT09IHByZXZBY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbFRvT3B0aW9uKHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcblxuICAgICAgICBpZiAodGhpcy5hdXRvY29tcGxldGUuYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbiAmJiB0aGlzLmFjdGl2ZU9wdGlvbikge1xuICAgICAgICAgIGlmICghdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVCZWZvcmVBdXRvU2VsZWN0aW9uID0gdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSB0aGlzLmFjdGl2ZU9wdGlvbjtcbiAgICAgICAgICB0aGlzLl9hc3NpZ25PcHRpb25WYWx1ZSh0aGlzLmFjdGl2ZU9wdGlvbi52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaGFuZGxlSW5wdXQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbGV0IHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gQmFzZWQgb24gYE51bWJlclZhbHVlQWNjZXNzb3JgIGZyb20gZm9ybXMuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaW5wdXQgaGFzIGEgcGxhY2Vob2xkZXIsIElFIHdpbGwgZmlyZSB0aGUgYGlucHV0YCBldmVudCBvbiBwYWdlIGxvYWQsXG4gICAgLy8gZm9jdXMgYW5kIGJsdXIsIGluIGFkZGl0aW9uIHRvIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgY2hhbmdlZCB0aGUgdmFsdWUuIFRvXG4gICAgLy8gZmlsdGVyIG91dCBhbGwgb2YgdGhlIGV4dHJhIGV2ZW50cywgd2Ugc2F2ZSB0aGUgdmFsdWUgb24gZm9jdXMgYW5kIGJldHdlZW5cbiAgICAvLyBgaW5wdXRgIGV2ZW50cywgYW5kIHdlIGNoZWNrIHdoZXRoZXIgaXQgY2hhbmdlZC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODg1NzQ3L1xuICAgIGlmICh0aGlzLl9wcmV2aW91c1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbiA9IG51bGw7XG5cbiAgICAgIC8vIElmIHNlbGVjdGlvbiBpcyByZXF1aXJlZCB3ZSBkb24ndCB3cml0ZSB0byB0aGUgQ1ZBIHdoaWxlIHRoZSB1c2VyIGlzIHR5cGluZy5cbiAgICAgIC8vIEF0IHRoZSBlbmQgb2YgdGhlIHNlbGVjdGlvbiBlaXRoZXIgdGhlIHVzZXIgd2lsbCBoYXZlIHBpY2tlZCBzb21ldGhpbmdcbiAgICAgIC8vIG9yIHdlJ2xsIHJlc2V0IHRoZSB2YWx1ZSBiYWNrIHRvIG51bGwuXG4gICAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlIHx8ICF0aGlzLmF1dG9jb21wbGV0ZS5yZXF1aXJlU2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBhbmVsT3BlbiAmJiAhdGhpcy5hdXRvY29tcGxldGUucmVxdWlyZVNlbGVjdGlvbikge1xuICAgICAgICAvLyBOb3RlIHRoYXQgd2UgZG9uJ3QgcmVzZXQgdGhpcyB3aGVuIGByZXF1aXJlU2VsZWN0aW9uYCBpcyBlbmFibGVkLFxuICAgICAgICAvLyBiZWNhdXNlIHRoZSBvcHRpb24gd2lsbCBiZSByZXNldCB3aGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQuXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9uID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucz8uZmluZChvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5fZ2V0RGlzcGxheVZhbHVlKHNlbGVjdGVkT3B0aW9uLnZhbHVlKTtcblxuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gZGlzcGxheSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcHRpb24uZGVzZWxlY3QoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY2FuT3BlbigpICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICAvLyBXaGVuIHRoZSBgaW5wdXRgIGV2ZW50IGZpcmVzLCB0aGUgaW5wdXQncyB2YWx1ZSB3aWxsIGhhdmUgYWxyZWFkeSBjaGFuZ2VkLiBUaGlzIG1lYW5zXG4gICAgICAgIC8vIHRoYXQgaWYgd2UgdGFrZSB0aGUgYHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZWAgZGlyZWN0bHksIGl0J2xsIGJlIG9uZSBrZXlzdHJva2VcbiAgICAgICAgLy8gYmVoaW5kLiBUaGlzIGNhbiBiZSBhIHByb2JsZW0gd2hlbiB0aGUgdXNlciBzZWxlY3RzIGEgdmFsdWUsIGNoYW5nZXMgYSBjaGFyYWN0ZXIgd2hpbGVcbiAgICAgICAgLy8gdGhlIGlucHV0IHN0aWxsIGhhcyBmb2N1cyBhbmQgdGhlbiBjbGlja3MgYXdheSAoc2VlICMyODQzMikuIFRvIHdvcmsgYXJvdW5kIGl0LCB3ZVxuICAgICAgICAvLyBjYXB0dXJlIHRoZSB2YWx1ZSBpbiBga2V5ZG93bmAgc28gd2UgY2FuIHVzZSBpdCBoZXJlLlxuICAgICAgICBjb25zdCB2YWx1ZU9uQXR0YWNoID0gdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duID8/IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgdGhpcy5fdmFsdWVPbkxhc3RLZXlkb3duID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb3BlblBhbmVsSW50ZXJuYWwodmFsdWVPbkF0dGFjaCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzKSB7XG4gICAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fYXR0YWNoT3ZlcmxheSh0aGlzLl9wcmV2aW91c1ZhbHVlKTtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9vcGVuUGFuZWxJbnRlcm5hbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbiBcImF1dG9cIiBtb2RlLCB0aGUgbGFiZWwgd2lsbCBhbmltYXRlIGRvd24gYXMgc29vbiBhcyBmb2N1cyBpcyBsb3N0LlxuICAgKiBUaGlzIGNhdXNlcyB0aGUgdmFsdWUgdG8ganVtcCB3aGVuIHNlbGVjdGluZyBhbiBvcHRpb24gd2l0aCB0aGUgbW91c2UuXG4gICAqIFRoaXMgbWV0aG9kIG1hbnVhbGx5IGZsb2F0cyB0aGUgbGFiZWwgdW50aWwgdGhlIHBhbmVsIGNhbiBiZSBjbG9zZWQuXG4gICAqIEBwYXJhbSBzaG91bGRBbmltYXRlIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBiZSBhbmltYXRlZCB3aGVuIGl0IGlzIGZsb2F0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9mbG9hdExhYmVsKHNob3VsZEFuaW1hdGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mb3JtRmllbGQgJiYgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZEFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLl9hbmltYXRlQW5kTG9ja0xhYmVsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJZiB0aGUgbGFiZWwgaGFzIGJlZW4gbWFudWFsbHkgZWxldmF0ZWQsIHJldHVybiBpdCB0byBpdHMgbm9ybWFsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9yZXNldExhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwpIHtcbiAgICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYXV0byc7XG4gICAgICB9XG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbGlzdGVucyB0byBhIHN0cmVhbSBvZiBwYW5lbCBjbG9zaW5nIGFjdGlvbnMgYW5kIHJlc2V0cyB0aGVcbiAgICogc3RyZWFtIGV2ZXJ5IHRpbWUgdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgaW5pdGlhbFJlbmRlciA9IG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgICAgYWZ0ZXJOZXh0UmVuZGVyKFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHtpbmplY3RvcjogdGhpcy5faW5qZWN0b3J9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgICBjb25zdCBvcHRpb25DaGFuZ2VzID0gdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICB0YXAoKCkgPT4gdGhpcy5fcG9zaXRpb25TdHJhdGVneS5yZWFwcGx5TGFzdFBvc2l0aW9uKCkpLFxuICAgICAgLy8gRGVmZXIgZW1pdHRpbmcgdG8gdGhlIHN0cmVhbSB1bnRpbCB0aGUgbmV4dCB0aWNrLCBiZWNhdXNlIGNoYW5naW5nXG4gICAgICAvLyBiaW5kaW5ncyBpbiBoZXJlIHdpbGwgY2F1c2UgXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMuXG4gICAgICBkZWxheSgwKSxcbiAgICApO1xuXG4gICAgLy8gV2hlbiB0aGUgb3B0aW9ucyBhcmUgaW5pdGlhbGx5IHJlbmRlcmVkLCBhbmQgd2hlbiB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy4uLlxuICAgIHJldHVybiAoXG4gICAgICBtZXJnZShpbml0aWFsUmVuZGVyLCBvcHRpb25DaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgc3RyZWFtIG9mIHBhbmVsQ2xvc2luZ0FjdGlvbnMsIHJlcGxhY2luZyBhbnkgcHJldmlvdXMgc3RyZWFtc1xuICAgICAgICAgIC8vIHRoYXQgd2VyZSBjcmVhdGVkLCBhbmQgZmxhdHRlbiBpdCBzbyBvdXIgc3RyZWFtIG9ubHkgZW1pdHMgY2xvc2luZyBldmVudHMuLi5cbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT5cbiAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgLy8gYGFmdGVyTmV4dFJlbmRlcmAgYWx3YXlzIHJ1bnMgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLCB0aHVzIHdlIGhhdmUgdG8gcmUtZW50ZXJcbiAgICAgICAgICAgICAgLy8gdGhlIEFuZ3VsYXIgem9uZS4gVGhpcyB3aWxsIGxlYWQgdG8gY2hhbmdlIGRldGVjdGlvbiBiZWluZyBjYWxsZWQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhclxuICAgICAgICAgICAgICAvLyB6b25lIGFuZCB0aGUgYGF1dG9jb21wbGV0ZS5vcGVuZWRgIHdpbGwgYWxzbyBlbWl0IG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIuXG4gICAgICAgICAgICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcbiAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBhbmVsU3RhdGUoKTtcbiAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAod2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgYHBhbmVsT3BlbmAgc3RhdGUgY2hhbmdlZCwgd2UgbmVlZCB0byBtYWtlIHN1cmUgdG8gZW1pdCB0aGUgYG9wZW5lZGAgb3JcbiAgICAgICAgICAgICAgICAvLyBgY2xvc2VkYCBldmVudCwgYmVjYXVzZSB3ZSBtYXkgbm90IGhhdmUgZW1pdHRlZCBpdC4gVGhpcyBjYW4gaGFwcGVuXG4gICAgICAgICAgICAgICAgLy8gLSBpZiB0aGUgdXNlcnMgb3BlbnMgdGhlIHBhbmVsIGFuZCB0aGVyZSBhcmUgbm8gb3B0aW9ucywgYnV0IHRoZVxuICAgICAgICAgICAgICAgIC8vICAgb3B0aW9ucyBjb21lIGluIHNsaWdodGx5IGxhdGVyIG9yIGFzIGEgcmVzdWx0IG9mIHRoZSB2YWx1ZSBjaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAvLyAtIGlmIHRoZSBwYW5lbCBpcyBjbG9zZWQgYWZ0ZXIgdGhlIHVzZXIgZW50ZXJlZCBhIHN0cmluZyB0aGF0IGRpZCBub3QgbWF0Y2ggYW55XG4gICAgICAgICAgICAgICAgLy8gICBvZiB0aGUgYXZhaWxhYmxlIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgLy8gLSBpZiBhIHZhbGlkIHN0cmluZyBpcyBlbnRlcmVkIGFmdGVyIGFuIGludmFsaWQgb25lLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5jbG9zZWQuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsQ2xvc2luZ0FjdGlvbnM7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICApLFxuICAgICAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IGNsb3NpbmcgZXZlbnQgb2NjdXJzLi4uXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgKVxuICAgICAgICAvLyBzZXQgdGhlIHZhbHVlLCBjbG9zZSB0aGUgcGFuZWwsIGFuZCBjb21wbGV0ZS5cbiAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50KSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBvcGVuZWQgZXZlbnQgb25jZSBpdCdzIGtub3duIHRoYXQgdGhlIHBhbmVsIHdpbGwgYmUgc2hvd24gYW5kIHN0b3Jlc1xuICAgKiB0aGUgc3RhdGUgb2YgdGhlIHRyaWdnZXIgcmlnaHQgYmVmb3JlIHRoZSBvcGVuaW5nIHNlcXVlbmNlIHdhcyBmaW5pc2hlZC5cbiAgICovXG4gIHByaXZhdGUgX2VtaXRPcGVuZWQoKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUub3BlbmVkLmVtaXQoKTtcbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwuICovXG4gIHByaXZhdGUgX2Rlc3Ryb3lQYW5lbCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHaXZlbiBhIHZhbHVlLCByZXR1cm5zIHRoZSBzdHJpbmcgdGhhdCBzaG91bGQgYmUgc2hvd24gd2l0aGluIHRoZSBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfZ2V0RGlzcGxheVZhbHVlPFQ+KHZhbHVlOiBUKTogVCB8IHN0cmluZyB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGU7XG4gICAgcmV0dXJuIGF1dG9jb21wbGV0ZSAmJiBhdXRvY29tcGxldGUuZGlzcGxheVdpdGggPyBhdXRvY29tcGxldGUuZGlzcGxheVdpdGgodmFsdWUpIDogdmFsdWU7XG4gIH1cblxuICBwcml2YXRlIF9hc3NpZ25PcHRpb25WYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgdG9EaXNwbGF5ID0gdGhpcy5fZ2V0RGlzcGxheVZhbHVlKHZhbHVlKTtcblxuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24obnVsbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIFNpbXBseSBmYWxsaW5nIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBkaXNwbGF5IHZhbHVlIGlzIGZhbHN5IGRvZXMgbm90IHdvcmsgcHJvcGVybHkuXG4gICAgLy8gVGhlIGRpc3BsYXkgdmFsdWUgY2FuIGFsc28gYmUgdGhlIG51bWJlciB6ZXJvIGFuZCBzaG91bGRuJ3QgZmFsbCBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICB0aGlzLl91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHRvRGlzcGxheSAhPSBudWxsID8gdG9EaXNwbGF5IDogJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTmF0aXZlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gSWYgaXQncyB1c2VkIHdpdGhpbiBhIGBNYXRGb3JtRmllbGRgLCB3ZSBzaG91bGQgc2V0IGl0IHRocm91Z2ggdGhlIHByb3BlcnR5IHNvIGl0IGNhbiBnb1xuICAgIC8vIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbi5cbiAgICBpZiAodGhpcy5fZm9ybUZpZWxkKSB7XG4gICAgICB0aGlzLl9mb3JtRmllbGQuX2NvbnRyb2wudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNsb3NlcyB0aGUgcGFuZWwsIGFuZCBpZiBhIHZhbHVlIGlzIHNwZWNpZmllZCwgYWxzbyBzZXRzIHRoZSBhc3NvY2lhdGVkXG4gICAqIGNvbnRyb2wgdG8gdGhhdCB2YWx1ZS4gSXQgd2lsbCBhbHNvIG1hcmsgdGhlIGNvbnRyb2wgYXMgZGlydHkgaWYgdGhpcyBpbnRlcmFjdGlvblxuICAgKiBzdGVtbWVkIGZyb20gdGhlIHVzZXIuXG4gICAqL1xuICBwcml2YXRlIF9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50OiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgfCBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLmF1dG9jb21wbGV0ZTtcbiAgICBjb25zdCB0b1NlbGVjdCA9IGV2ZW50ID8gZXZlbnQuc291cmNlIDogdGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbjtcblxuICAgIGlmICh0b1NlbGVjdCkge1xuICAgICAgdGhpcy5fY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKHRvU2VsZWN0KTtcbiAgICAgIHRoaXMuX2Fzc2lnbk9wdGlvblZhbHVlKHRvU2VsZWN0LnZhbHVlKTtcbiAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNob3VsZCB3YWl0IHVudGlsIHRoZSBhbmltYXRpb24gaXMgZG9uZSwgb3RoZXJ3aXNlIHRoZSB2YWx1ZVxuICAgICAgLy8gZ2V0cyByZXNldCB3aGlsZSB0aGUgcGFuZWwgaXMgc3RpbGwgYW5pbWF0aW5nIHdoaWNoIGxvb2tzIGdsaXRjaHkuIEl0J2xsIGxpa2VseSBicmVha1xuICAgICAgLy8gc29tZSB0ZXN0cyB0byBjaGFuZ2UgaXQgYXQgdGhpcyBwb2ludC5cbiAgICAgIHRoaXMuX29uQ2hhbmdlKHRvU2VsZWN0LnZhbHVlKTtcbiAgICAgIHBhbmVsLl9lbWl0U2VsZWN0RXZlbnQodG9TZWxlY3QpO1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHBhbmVsLnJlcXVpcmVTZWxlY3Rpb24gJiZcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSAhPT0gdGhpcy5fdmFsdWVPbkF0dGFjaFxuICAgICkge1xuICAgICAgdGhpcy5fY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKG51bGwpO1xuICAgICAgdGhpcy5fYXNzaWduT3B0aW9uVmFsdWUobnVsbCk7XG4gICAgICAvLyBXYWl0IGZvciB0aGUgYW5pbWF0aW9uIHRvIGZpbmlzaCBiZWZvcmUgY2xlYXJpbmcgdGhlIGZvcm0gY29udHJvbCB2YWx1ZSwgb3RoZXJ3aXNlXG4gICAgICAvLyB0aGUgb3B0aW9ucyBtaWdodCBjaGFuZ2Ugd2hpbGUgdGhlIGFuaW1hdGlvbiBpcyBydW5uaW5nIHdoaWNoIGxvb2tzIGdsaXRjaHkuXG4gICAgICBpZiAocGFuZWwuX2FuaW1hdGlvbkRvbmUpIHtcbiAgICAgICAgcGFuZWwuX2FuaW1hdGlvbkRvbmUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fb25DaGFuZ2UobnVsbCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UobnVsbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYW55IHByZXZpb3VzIHNlbGVjdGVkIG9wdGlvbiBhbmQgZW1pdCBhIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgZm9yIHRoaXMgb3B0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24oc2tpcDogTWF0T3B0aW9uIHwgbnVsbCwgZW1pdEV2ZW50PzogYm9vbGVhbikge1xuICAgIC8vIE51bGwgY2hlY2tzIGFyZSBuZWNlc3NhcnkgaGVyZSwgYmVjYXVzZSB0aGUgYXV0b2NvbXBsZXRlXG4gICAgLy8gb3IgaXRzIG9wdGlvbnMgbWF5IG5vdCBoYXZlIGJlZW4gYXNzaWduZWQgeWV0LlxuICAgIHRoaXMuYXV0b2NvbXBsZXRlPy5vcHRpb25zPy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uICE9PSBza2lwICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uZGVzZWxlY3QoZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX29wZW5QYW5lbEludGVybmFsKHZhbHVlT25BdHRhY2ggPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQudmFsdWUpIHtcbiAgICB0aGlzLl9hdHRhY2hPdmVybGF5KHZhbHVlT25BdHRhY2gpO1xuICAgIHRoaXMuX2Zsb2F0TGFiZWwoKTtcbiAgICAvLyBBZGQgYXJpYS1vd25zIGF0dHJpYnV0ZSB3aGVuIHRoZSBhdXRvY29tcGxldGUgYmVjb21lcyB2aXNpYmxlLlxuICAgIGlmICh0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIGNvbnN0IHBhbmVsSWQgPSB0aGlzLmF1dG9jb21wbGV0ZS5pZDtcbiAgICAgIGFkZEFyaWFSZWZlcmVuY2VkSWQodGhpcy5fdHJhY2tlZE1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoT3ZlcmxheSh2YWx1ZU9uQXR0YWNoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuYXV0b2NvbXBsZXRlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpO1xuICAgIH1cblxuICAgIGxldCBvdmVybGF5UmVmID0gdGhpcy5fb3ZlcmxheVJlZjtcblxuICAgIGlmICghb3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuYXV0b2NvbXBsZXRlLnRlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLCB7XG4gICAgICAgIGlkOiB0aGlzLl9mb3JtRmllbGQ/LmdldExhYmVsSWQoKSxcbiAgICAgIH0pO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIFN1YnNjcmliZSB0byB0aGUgYnJlYWtwb2ludCBldmVudHMgc3RyZWFtIHRvIGRldGVjdCB3aGVuIHNjcmVlbiBpcyBpblxuICAgICAgLy8gaGFuZHNldExhbmRzY2FwZS5cbiAgICAgIHRoaXMuX2hhbmRzZXRMYW5kc2NhcGVTdWJzY3JpcHRpb24gPSB0aGlzLl9icmVha3BvaW50T2JzZXJ2ZXJcbiAgICAgICAgLm9ic2VydmUoQnJlYWtwb2ludHMuSGFuZHNldExhbmRzY2FwZSlcbiAgICAgICAgLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzSGFuZHNldExhbmRzY2FwZSA9IHJlc3VsdC5tYXRjaGVzO1xuICAgICAgICAgIC8vIENoZWNrIGlmIHJlc3VsdC5tYXRjaGVzIEJyZWFrcG9pbnRzLkhhbmRzZXRMYW5kc2NhcGUuIEFwcGx5IEhhbmRzZXRMYW5kc2NhcGVcbiAgICAgICAgICAvLyBzZXR0aW5ncyB0byBwcmV2ZW50IG92ZXJsYXkgY3V0b2ZmIGluIHRoYXQgYnJlYWtwb2ludC4gRml4ZXMgYi8yODQxNDgzNzdcbiAgICAgICAgICBpZiAoaXNIYW5kc2V0TGFuZHNjYXBlKSB7XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5XG4gICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKHRydWUpXG4gICAgICAgICAgICAgIC53aXRoR3Jvd0FmdGVyT3Blbih0cnVlKVxuICAgICAgICAgICAgICAud2l0aFZpZXdwb3J0TWFyZ2luKDgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5XG4gICAgICAgICAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgICAgICAgICAud2l0aEdyb3dBZnRlck9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgIC53aXRoVmlld3BvcnRNYXJnaW4oMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl92YWx1ZU9uQXR0YWNoID0gdmFsdWVPbkF0dGFjaDtcbiAgICAgIHRoaXMuX3ZhbHVlT25MYXN0S2V5ZG93biA9IG51bGw7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gdHJ1ZTtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fbGF0ZXN0T3BlbmluZ1RyaWdnZXIgPSB0aGlzO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRDb2xvcih0aGlzLl9mb3JtRmllbGQ/LmNvbG9yKTtcbiAgICB0aGlzLl91cGRhdGVQYW5lbFN0YXRlKCk7XG4gICAgdGhpcy5fYXBwbHlNb2RhbFBhbmVsT3duZXJzaGlwKCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIGFuIGV4dHJhIGBwYW5lbE9wZW5gIGNoZWNrIGluIGhlcmUsIGJlY2F1c2UgdGhlXG4gICAgLy8gYXV0b2NvbXBsZXRlIHdvbid0IGJlIHNob3duIGlmIHRoZXJlIGFyZSBubyBvcHRpb25zLlxuICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiB3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fZW1pdE9wZW5lZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlUGFuZWxLZXlkb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgLy8gQ2xvc2Ugd2hlbiBwcmVzc2luZyBFU0NBUEUgb3IgQUxUICsgVVBfQVJST1csIGJhc2VkIG9uIHRoZSBhMTF5IGd1aWRlbGluZXMuXG4gICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgIGlmIChcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgIChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyAmJiBoYXNNb2RpZmllcktleShldmVudCwgJ2FsdEtleScpKVxuICAgICkge1xuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFkIHR5cGVkIHNvbWV0aGluZyBpbiBiZWZvcmUgd2UgYXV0b3NlbGVjdGVkIGFuIG9wdGlvbiwgYW5kIHRoZXkgZGVjaWRlZFxuICAgICAgLy8gdG8gY2FuY2VsIHRoZSBzZWxlY3Rpb24sIHJlc3RvcmUgdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhleSBoYWQgdHlwZWQgaW4uXG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0F1dG9zZWxlY3RlZE9wdGlvbikge1xuICAgICAgICB0aGlzLl91cGRhdGVOYXRpdmVJbnB1dFZhbHVlKHRoaXMuX3ZhbHVlQmVmb3JlQXV0b1NlbGVjdGlvbiA/PyAnJyk7XG4gICAgICAgIHRoaXMuX3BlbmRpbmdBdXRvc2VsZWN0ZWRPcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc3RvcCBwcm9wYWdhdGlvbiwgb3RoZXJ3aXNlIHRoZSBldmVudCB3aWxsIGV2ZW50dWFsbHlcbiAgICAgIC8vIHJlYWNoIHRoZSBpbnB1dCBpdHNlbGYgYW5kIGNhdXNlIHRoZSBvdmVybGF5IHRvIGJlIHJlb3BlbmVkLlxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfTtcblxuICAvKiogVXBkYXRlcyB0aGUgcGFuZWwncyB2aXNpYmlsaXR5IHN0YXRlIGFuZCBhbnkgdHJpZ2dlciBzdGF0ZSB0aWVkIHRvIGlkLiAqL1xuICBwcml2YXRlIF91cGRhdGVQYW5lbFN0YXRlKCkge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRWaXNpYmlsaXR5KCk7XG5cbiAgICAvLyBOb3RlIHRoYXQgaGVyZSB3ZSBzdWJzY3JpYmUgYW5kIHVuc3Vic2NyaWJlIGJhc2VkIG9uIHRoZSBwYW5lbCdzIHZpc2libGl0eSBzdGF0ZSxcbiAgICAvLyBiZWNhdXNlIHRoZSBhY3Qgb2Ygc3Vic2NyaWJpbmcgd2lsbCBwcmV2ZW50IGV2ZW50cyBmcm9tIHJlYWNoaW5nIG90aGVyIG92ZXJsYXlzIGFuZFxuICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gYmxvY2sgdGhlIGV2ZW50cyBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmITtcblxuICAgICAgaWYgKCF0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gICAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUodGhpcy5faGFuZGxlUGFuZWxLZXlkb3duKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLl9vdXRzaWRlQ2xpY2tTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gU3Vic2NyaWJlIHRvIHRoZSBwb2ludGVyIGV2ZW50cyBzdHJlYW0gc28gdGhhdCBpdCBkb2Vzbid0IGdldCBwaWNrZWQgdXAgYnkgb3RoZXIgb3ZlcmxheXMuXG4gICAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBzaG91bGQgc3dpdGNoIGBfZ2V0T3V0c2lkZUNsaWNrU3RyZWFtYCBldmVudHVhbGx5IHRvIHVzZSB0aGlzIHN0cmVhbSxcbiAgICAgICAgLy8gYnV0IHRoZSBiZWh2aW9yIGlzbid0IGV4YWN0bHkgdGhlIHNhbWUgYW5kIGl0IGVuZHMgdXAgYnJlYWtpbmcgc29tZSBpbnRlcm5hbCB0ZXN0cy5cbiAgICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uID0gb3ZlcmxheVJlZi5vdXRzaWRlUG9pbnRlckV2ZW50cygpLnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fb3V0c2lkZUNsaWNrU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IHRoaXMuX291dHNpZGVDbGlja1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpciA/PyB1bmRlZmluZWQsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLl9kZWZhdWx0cz8ub3ZlcmxheVBhbmVsQ2xhc3MsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRPdmVybGF5UG9zaXRpb24oKTogUG9zaXRpb25TdHJhdGVneSB7XG4gICAgLy8gU2V0IGRlZmF1bHQgT3ZlcmxheSBQb3NpdGlvblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheVxuICAgICAgLnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKHRoaXMuX2dldENvbm5lY3RlZEVsZW1lbnQoKSlcbiAgICAgIC53aXRoRmxleGlibGVEaW1lbnNpb25zKGZhbHNlKVxuICAgICAgLndpdGhQdXNoKGZhbHNlKTtcblxuICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHN0cmF0ZWd5KTtcbiAgICB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgcmV0dXJuIHN0cmF0ZWd5O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHBvc2l0aW9ucyBvbiBhIHBvc2l0aW9uIHN0cmF0ZWd5IGJhc2VkIG9uIHRoZSBkaXJlY3RpdmUncyBpbnB1dCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfc2V0U3RyYXRlZ3lQb3NpdGlvbnMocG9zaXRpb25TdHJhdGVneTogRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5KSB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIHByb3ZpZGUgaG9yaXpvbnRhbCBmYWxsYmFjayBwb3NpdGlvbnMsIGV2ZW4gdGhvdWdoIGJ5IGRlZmF1bHQgdGhlIGRyb3Bkb3duXG4gICAgLy8gd2lkdGggbWF0Y2hlcyB0aGUgaW5wdXQsIGJlY2F1c2UgY29uc3VtZXJzIGNhbiBvdmVycmlkZSB0aGUgd2lkdGguIFNlZSAjMTg4NTQuXG4gICAgY29uc3QgYmVsb3dQb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAgICB7b3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ2JvdHRvbScsIG92ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ3RvcCd9LFxuICAgICAge29yaWdpblg6ICdlbmQnLCBvcmlnaW5ZOiAnYm90dG9tJywgb3ZlcmxheVg6ICdlbmQnLCBvdmVybGF5WTogJ3RvcCd9LFxuICAgIF07XG5cbiAgICAvLyBUaGUgb3ZlcmxheSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgdHJpZ2dlciBzaG91bGQgaGF2ZSBzcXVhcmVkIGNvcm5lcnMsIHdoaWxlXG4gICAgLy8gdGhlIG9wcG9zaXRlIGVuZCBoYXMgcm91bmRlZCBjb3JuZXJzLiBXZSBhcHBseSBhIENTUyBjbGFzcyB0byBzd2FwIHRoZVxuICAgIC8vIGJvcmRlci1yYWRpdXMgYmFzZWQgb24gdGhlIG92ZXJsYXkgcG9zaXRpb24uXG4gICAgY29uc3QgcGFuZWxDbGFzcyA9IHRoaXMuX2Fib3ZlQ2xhc3M7XG4gICAgY29uc3QgYWJvdmVQb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAgICB7b3JpZ2luWDogJ3N0YXJ0Jywgb3JpZ2luWTogJ3RvcCcsIG92ZXJsYXlYOiAnc3RhcnQnLCBvdmVybGF5WTogJ2JvdHRvbScsIHBhbmVsQ2xhc3N9LFxuICAgICAge29yaWdpblg6ICdlbmQnLCBvcmlnaW5ZOiAndG9wJywgb3ZlcmxheVg6ICdlbmQnLCBvdmVybGF5WTogJ2JvdHRvbScsIHBhbmVsQ2xhc3N9LFxuICAgIF07XG5cbiAgICBsZXQgcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdO1xuXG4gICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdhYm92ZScpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGFib3ZlUG9zaXRpb25zO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JlbG93Jykge1xuICAgICAgcG9zaXRpb25zID0gYmVsb3dQb3NpdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9ucyA9IFsuLi5iZWxvd1Bvc2l0aW9ucywgLi4uYWJvdmVQb3NpdGlvbnNdO1xuICAgIH1cblxuICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29ubmVjdGVkRWxlbWVudCgpOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGVkVG8pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFuZWxXaWR0aCgpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5wYW5lbFdpZHRoIHx8IHRoaXMuX2dldEhvc3RXaWR0aCgpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBpbnB1dCBlbGVtZW50LCBzbyB0aGUgcGFuZWwgd2lkdGggY2FuIG1hdGNoIGl0LiAqL1xuICBwcml2YXRlIF9nZXRIb3N0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGFjdGl2ZSBpdGVtIHRvIC0xLiBUaGlzIGlzIHNvIHRoYXQgcHJlc3NpbmcgYXJyb3cga2V5cyB3aWxsIGFjdGl2YXRlIHRoZSBjb3JyZWN0XG4gICAqIG9wdGlvbi5cbiAgICpcbiAgICogSWYgdGhlIGNvbnN1bWVyIG9wdGVkLWluIHRvIGF1dG9tYXRpY2FsbHkgYWN0aXZhdGF0aW5nIHRoZSBmaXJzdCBvcHRpb24sIGFjdGl2YXRlIHRoZSBmaXJzdFxuICAgKiAqZW5hYmxlZCogb3B0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzZXRBY3RpdmVJdGVtKCk6IHZvaWQge1xuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuXG4gICAgaWYgKGF1dG9jb21wbGV0ZS5hdXRvQWN0aXZlRmlyc3RPcHRpb24pIHtcbiAgICAgIC8vIEZpbmQgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCAqZW5hYmxlZCogb3B0aW9uLiBBdm9pZCBjYWxsaW5nIGBfa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtYFxuICAgICAgLy8gYmVjYXVzZSBpdCBhY3RpdmF0ZXMgdGhlIGZpcnN0IG9wdGlvbiB0aGF0IHBhc3NlcyB0aGUgc2tpcCBwcmVkaWNhdGUsIHJhdGhlciB0aGFuIHRoZVxuICAgICAgLy8gZmlyc3QgKmVuYWJsZWQqIG9wdGlvbi5cbiAgICAgIGxldCBmaXJzdEVuYWJsZWRPcHRpb25JbmRleCA9IC0xO1xuXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXV0b2NvbXBsZXRlLm9wdGlvbnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IGF1dG9jb21wbGV0ZS5vcHRpb25zLmdldChpbmRleCkhO1xuICAgICAgICBpZiAoIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICAgIGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oLTEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhbmVsIGNhbiBiZSBvcGVuZWQuICovXG4gIHByaXZhdGUgX2Nhbk9wZW4oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gIWVsZW1lbnQucmVhZE9ubHkgJiYgIWVsZW1lbnQuZGlzYWJsZWQgJiYgIXRoaXMuYXV0b2NvbXBsZXRlRGlzYWJsZWQ7XG4gIH1cblxuICAvKiogVXNlIGRlZmF1bHRWaWV3IG9mIGluamVjdGVkIGRvY3VtZW50IGlmIGF2YWlsYWJsZSBvciBmYWxsYmFjayB0byBnbG9iYWwgd2luZG93IHJlZmVyZW5jZSAqL1xuICBwcml2YXRlIF9nZXRXaW5kb3coKTogV2luZG93IHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnQ/LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgfVxuXG4gIC8qKiBTY3JvbGxzIHRvIGEgcGFydGljdWxhciBvcHRpb24gaW4gdGhlIGxpc3QuICovXG4gIHByaXZhdGUgX3Njcm9sbFRvT3B0aW9uKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBHaXZlbiB0aGF0IHdlIGFyZSBub3QgYWN0dWFsbHkgZm9jdXNpbmcgYWN0aXZlIG9wdGlvbnMsIHdlIG11c3QgbWFudWFsbHkgYWRqdXN0IHNjcm9sbFxuICAgIC8vIHRvIHJldmVhbCBvcHRpb25zIGJlbG93IHRoZSBmb2xkLiBGaXJzdCwgd2UgZmluZCB0aGUgb2Zmc2V0IG9mIHRoZSBvcHRpb24gZnJvbSB0aGUgdG9wXG4gICAgLy8gb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBiZWxvdyB0aGUgZm9sZCwgdGhlIG5ldyBzY3JvbGxUb3Agd2lsbCBiZSB0aGUgb2Zmc2V0IC1cbiAgICAvLyB0aGUgcGFuZWwgaGVpZ2h0ICsgdGhlIG9wdGlvbiBoZWlnaHQsIHNvIHRoZSBhY3RpdmUgb3B0aW9uIHdpbGwgYmUganVzdCB2aXNpYmxlIGF0IHRoZVxuICAgIC8vIGJvdHRvbSBvZiB0aGUgcGFuZWwuIElmIHRoYXQgb2Zmc2V0IGlzIGFib3ZlIHRoZSB0b3Agb2YgdGhlIHZpc2libGUgcGFuZWwsIHRoZSBuZXcgc2Nyb2xsVG9wXG4gICAgLy8gd2lsbCBiZWNvbWUgdGhlIG9mZnNldC4gSWYgdGhhdCBvZmZzZXQgaXMgdmlzaWJsZSB3aXRoaW4gdGhlIHBhbmVsIGFscmVhZHksIHRoZSBzY3JvbGxUb3AgaXNcbiAgICAvLyBub3QgYWRqdXN0ZWQuXG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gdGhpcy5hdXRvY29tcGxldGU7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKFxuICAgICAgaW5kZXgsXG4gICAgICBhdXRvY29tcGxldGUub3B0aW9ucyxcbiAgICAgIGF1dG9jb21wbGV0ZS5vcHRpb25Hcm91cHMsXG4gICAgKTtcblxuICAgIGlmIChpbmRleCA9PT0gMCAmJiBsYWJlbENvdW50ID09PSAxKSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBnb3Qgb25lIGdyb3VwIGxhYmVsIGJlZm9yZSB0aGUgb3B0aW9uIGFuZCB3ZSdyZSBhdCB0aGUgdG9wIG9wdGlvbixcbiAgICAgIC8vIHNjcm9sbCB0aGUgbGlzdCB0byB0aGUgdG9wLiBUaGlzIGlzIGJldHRlciBVWCB0aGFuIHNjcm9sbGluZyB0aGUgbGlzdCB0byB0aGVcbiAgICAgIC8vIHRvcCBvZiB0aGUgb3B0aW9uLCBiZWNhdXNlIGl0IGFsbG93cyB0aGUgdXNlciB0byByZWFkIHRoZSB0b3AgZ3JvdXAncyBsYWJlbC5cbiAgICAgIGF1dG9jb21wbGV0ZS5fc2V0U2Nyb2xsVG9wKDApO1xuICAgIH0gZWxzZSBpZiAoYXV0b2NvbXBsZXRlLnBhbmVsKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBhdXRvY29tcGxldGUub3B0aW9ucy50b0FycmF5KClbaW5kZXhdO1xuXG4gICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBvcHRpb24uX2dldEhvc3RFbGVtZW50KCk7XG4gICAgICAgIGNvbnN0IG5ld1Njcm9sbFBvc2l0aW9uID0gX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uKFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5fZ2V0U2Nyb2xsVG9wKCksXG4gICAgICAgICAgYXV0b2NvbXBsZXRlLnBhbmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICApO1xuXG4gICAgICAgIGF1dG9jb21wbGV0ZS5fc2V0U2Nyb2xsVG9wKG5ld1Njcm9sbFBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgd2hpY2ggbW9kYWwgd2UgaGF2ZSBtb2RpZmllZCB0aGUgYGFyaWEtb3duc2AgYXR0cmlidXRlIG9mLiBXaGVuIHRoZSBjb21ib2JveCB0cmlnZ2VyIGlzXG4gICAqIGluc2lkZSBhbiBhcmlhLW1vZGFsLCB3ZSBhcHBseSBhcmlhLW93bnMgdG8gdGhlIHBhcmVudCBtb2RhbCB3aXRoIHRoZSBgaWRgIG9mIHRoZSBvcHRpb25zXG4gICAqIHBhbmVsLiBUcmFjayB0aGUgbW9kYWwgd2UgaGF2ZSBjaGFuZ2VkIHNvIHdlIGNhbiB1bmRvIHRoZSBjaGFuZ2VzIG9uIGRlc3Ryb3kuXG4gICAqL1xuICBwcml2YXRlIF90cmFja2VkTW9kYWw6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogSWYgdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGlzIGluc2lkZSBvZiBhbiBgYXJpYS1tb2RhbGAgZWxlbWVudCwgY29ubmVjdFxuICAgKiB0aGF0IG1vZGFsIHRvIHRoZSBvcHRpb25zIHBhbmVsIHdpdGggYGFyaWEtb3duc2AuXG4gICAqXG4gICAqIEZvciBzb21lIGJyb3dzZXIgKyBzY3JlZW4gcmVhZGVyIGNvbWJpbmF0aW9ucywgd2hlbiBuYXZpZ2F0aW9uIGlzIGluc2lkZVxuICAgKiBvZiBhbiBgYXJpYS1tb2RhbGAgZWxlbWVudCwgdGhlIHNjcmVlbiByZWFkZXIgdHJlYXRzIGV2ZXJ5dGhpbmcgb3V0c2lkZVxuICAgKiBvZiB0aGF0IG1vZGFsIGFzIGhpZGRlbiBvciBpbnZpc2libGUuXG4gICAqXG4gICAqIFRoaXMgY2F1c2VzIGEgcHJvYmxlbSB3aGVuIHRoZSBjb21ib2JveCB0cmlnZ2VyIGlzIF9pbnNpZGVfIG9mIGEgbW9kYWwsIGJlY2F1c2UgdGhlXG4gICAqIG9wdGlvbnMgcGFuZWwgaXMgcmVuZGVyZWQgX291dHNpZGVfIG9mIHRoYXQgbW9kYWwsIHByZXZlbnRpbmcgc2NyZWVuIHJlYWRlciBuYXZpZ2F0aW9uXG4gICAqIGZyb20gcmVhY2hpbmcgdGhlIHBhbmVsLlxuICAgKlxuICAgKiBXZSBjYW4gd29yayBhcm91bmQgdGhpcyBpc3N1ZSBieSBhcHBseWluZyBgYXJpYS1vd25zYCB0byB0aGUgbW9kYWwgd2l0aCB0aGUgYGlkYCBvZlxuICAgKiB0aGUgb3B0aW9ucyBwYW5lbC4gVGhpcyBlZmZlY3RpdmVseSBjb21tdW5pY2F0ZXMgdG8gYXNzaXN0aXZlIHRlY2hub2xvZ3kgdGhhdCB0aGVcbiAgICogb3B0aW9ucyBwYW5lbCBpcyBwYXJ0IG9mIHRoZSBzYW1lIGludGVyYWN0aW9uIGFzIHRoZSBtb2RhbC5cbiAgICpcbiAgICogQXQgdGltZSBvZiB0aGlzIHdyaXRpbmcsIHRoaXMgaXNzdWUgaXMgcHJlc2VudCBpbiBWb2ljZU92ZXIuXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yMDY5NFxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlNb2RhbFBhbmVsT3duZXJzaGlwKCkge1xuICAgIC8vIFRPRE8oaHR0cDovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8yNjg1Myk6IGNvbnNpZGVyIGRlLWR1cGxpY2F0aW5nIHRoaXMgd2l0aFxuICAgIC8vIHRoZSBgTGl2ZUFubm91bmNlcmAgYW5kIGFueSBvdGhlciB1c2FnZXMuXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgdGhlIHNlbGVjdG9yIGhlcmUgaXMgbGltaXRlZCB0byBDREsgb3ZlcmxheXMgYXQgdGhlIG1vbWVudCBpbiBvcmRlciB0byByZWR1Y2UgdGhlXG4gICAgLy8gc2VjdGlvbiBvZiB0aGUgRE9NIHdlIG5lZWQgdG8gbG9vayB0aHJvdWdoLiBUaGlzIHNob3VsZCBjb3ZlciBhbGwgdGhlIGNhc2VzIHdlIHN1cHBvcnQsIGJ1dFxuICAgIC8vIHRoZSBzZWxlY3RvciBjYW4gYmUgZXhwYW5kZWQgaWYgaXQgdHVybnMgb3V0IHRvIGJlIHRvbyBuYXJyb3cuXG4gICAgY29uc3QgbW9kYWwgPSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xvc2VzdChcbiAgICAgICdib2R5ID4gLmNkay1vdmVybGF5LWNvbnRhaW5lciBbYXJpYS1tb2RhbD1cInRydWVcIl0nLFxuICAgICk7XG5cbiAgICBpZiAoIW1vZGFsKSB7XG4gICAgICAvLyBNb3N0IGNvbW1vbmx5LCB0aGUgYXV0b2NvbXBsZXRlIHRyaWdnZXIgaXMgbm90IGluc2lkZSBhIG1vZGFsLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhbmVsSWQgPSB0aGlzLmF1dG9jb21wbGV0ZS5pZDtcblxuICAgIGlmICh0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIHJlbW92ZUFyaWFSZWZlcmVuY2VkSWQodGhpcy5fdHJhY2tlZE1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgfVxuXG4gICAgYWRkQXJpYVJlZmVyZW5jZWRJZChtb2RhbCwgJ2FyaWEtb3ducycsIHBhbmVsSWQpO1xuICAgIHRoaXMuX3RyYWNrZWRNb2RhbCA9IG1vZGFsO1xuICB9XG5cbiAgLyoqIENsZWFycyB0aGUgcmVmZXJlbmNlcyB0byB0aGUgbGlzdGJveCBvdmVybGF5IGVsZW1lbnQgZnJvbSB0aGUgbW9kYWwgaXQgd2FzIGFkZGVkIHRvLiAqL1xuICBwcml2YXRlIF9jbGVhckZyb21Nb2RhbCgpIHtcbiAgICBpZiAodGhpcy5fdHJhY2tlZE1vZGFsKSB7XG4gICAgICBjb25zdCBwYW5lbElkID0gdGhpcy5hdXRvY29tcGxldGUuaWQ7XG5cbiAgICAgIHJlbW92ZUFyaWFSZWZlcmVuY2VkSWQodGhpcy5fdHJhY2tlZE1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgICB0aGlzLl90cmFja2VkTW9kYWwgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19