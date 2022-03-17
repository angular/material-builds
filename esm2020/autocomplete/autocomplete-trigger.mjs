/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, ENTER, ESCAPE, TAB, UP_ARROW, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, } from '@angular/cdk/overlay';
import { _getEventTarget } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, MatOptionSelectionChange, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormField } from '@angular/material/form-field';
import { defer, fromEvent, merge, of as observableOf, Subject, Subscription } from 'rxjs';
import { delay, filter, map, switchMap, take, tap, startWith } from 'rxjs/operators';
import { _MatAutocompleteBase, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, } from './autocomplete';
import { _MatAutocompleteOriginBase } from './autocomplete-origin';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/scrolling";
import * as i4 from "@angular/material/form-field";
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
/** Base class with all of the `MatAutocompleteTrigger` functionality. */
export class _MatAutocompleteTriggerBase {
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
        this._autocompleteDisabled = false;
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
        this._scrollStrategy = scrollStrategy;
    }
    /**
     * Whether the autocomplete is disabled. When disabled, the element will
     * act as a regular input and the user won't be able to open the panel.
     */
    get autocompleteDisabled() {
        return this._autocompleteDisabled;
    }
    set autocompleteDisabled(value) {
        this._autocompleteDisabled = coerceBooleanProperty(value);
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
        Promise.resolve().then(() => this._setTriggerValue(value));
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
            this._onChange(value);
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
            this._formField.floatLabel = 'auto';
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
                this.autocomplete._setVisibility();
                this._changeDetectorRef.detectChanges();
                if (this.panelOpen) {
                    this._overlayRef.updatePosition();
                    // If the `panelOpen` state changed, we need to make sure to emit the `opened`
                    // event, because we may not have emitted it when the panel was attached. This
                    // can happen if the users opens the panel and there are no options, but the
                    // options come in slightly later or as a result of the value changing.
                    if (wasOpen !== this.panelOpen) {
                        this.autocomplete.opened.emit();
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
    /** Destroys the autocomplete suggestion panel. */
    _destroyPanel() {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }
    _setTriggerValue(value) {
        const toDisplay = this.autocomplete && this.autocomplete.displayWith
            ? this.autocomplete.displayWith(value)
            : value;
        // Simply falling back to an empty string if the display value is falsy does not work properly.
        // The display value can also be the number zero and shouldn't fall back to an empty string.
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
     */
    _setValueAndClose(event) {
        const source = event && event.source;
        if (source) {
            this._clearPreviousSelectedOption(source);
            this._setTriggerValue(source.value);
            this._onChange(source.value);
            this.autocomplete._emitSelectEvent(source);
            this._element.nativeElement.focus();
        }
        this.closePanel();
    }
    /**
     * Clear any previous selected option and emit a selection change event for this option
     */
    _clearPreviousSelectedOption(skip) {
        this.autocomplete.options.forEach(option => {
            if (option !== skip && option.selected) {
                option.deselect();
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
            // Use the `keydownEvents` in order to take advantage of
            // the overlay event targeting provided by the CDK overlay.
            overlayRef.keydownEvents().subscribe(event => {
                // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
                // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
                if ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                    (event.keyCode === UP_ARROW && hasModifierKey(event, 'altKey'))) {
                    this._closeKeyEventStream.next();
                    this._resetActiveItem();
                    // We need to stop propagation, otherwise the event will eventually
                    // reach the input itself and cause the overlay to be reopened.
                    event.stopPropagation();
                    event.preventDefault();
                }
            });
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
        this.autocomplete._setVisibility();
        this.autocomplete._isOpen = this._overlayAttached = true;
        // We need to do an extra `panelOpen` check in here, because the
        // autocomplete won't be shown if there are no options.
        if (this.panelOpen && wasOpen !== this.panelOpen) {
            this.autocomplete.opened.emit();
        }
    }
    _getOverlayConfig() {
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getPanelWidth(),
            direction: this._dir,
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
     * Resets the active item to -1 so arrow events will activate the
     * correct options, or to 0 if the consumer opted into it.
     */
    _resetActiveItem() {
        const autocomplete = this.autocomplete;
        if (autocomplete.autoActiveFirstOption) {
            // Note that we go through `setFirstItemActive`, rather than `setActiveItem(0)`, because
            // the former will find the next enabled option, if the first one is disabled.
            autocomplete._keyManager.setFirstItemActive();
        }
        else {
            autocomplete._keyManager.setActiveItem(-1);
        }
    }
    /** Determines whether the panel can be opened. */
    _canOpen() {
        const element = this._element.nativeElement;
        return !element.readOnly && !element.disabled && !this._autocompleteDisabled;
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
}
_MatAutocompleteTriggerBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatAutocompleteTriggerBase, deps: [{ token: i0.ElementRef }, { token: i1.Overlay }, { token: i0.ViewContainerRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: MAT_AUTOCOMPLETE_SCROLL_STRATEGY }, { token: i2.Directionality, optional: true }, { token: MAT_FORM_FIELD, host: true, optional: true }, { token: DOCUMENT, optional: true }, { token: i3.ViewportRuler }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatAutocompleteTriggerBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: _MatAutocompleteTriggerBase, inputs: { autocomplete: ["matAutocomplete", "autocomplete"], position: ["matAutocompletePosition", "position"], connectedTo: ["matAutocompleteConnectedTo", "connectedTo"], autocompleteAttribute: ["autocomplete", "autocompleteAttribute"], autocompleteDisabled: ["matAutocompleteDisabled", "autocompleteDisabled"] }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: _MatAutocompleteTriggerBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Overlay }, { type: i0.ViewContainerRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
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
                }] }]; }, propDecorators: { autocomplete: [{
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
                args: ['matAutocompleteDisabled']
            }] } });
export class MatAutocompleteTrigger extends _MatAutocompleteTriggerBase {
    constructor() {
        super(...arguments);
        this._aboveClass = 'mat-autocomplete-panel-above';
    }
}
MatAutocompleteTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAutocompleteTrigger, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatAutocompleteTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: MatAutocompleteTrigger, selector: "input[matAutocomplete], textarea[matAutocomplete]", host: { listeners: { "focusin": "_handleFocus()", "blur": "_onTouched()", "input": "_handleInput($event)", "keydown": "_handleKeydown($event)", "click": "_handleClick()" }, properties: { "attr.autocomplete": "autocompleteAttribute", "attr.role": "autocompleteDisabled ? null : \"combobox\"", "attr.aria-autocomplete": "autocompleteDisabled ? null : \"list\"", "attr.aria-activedescendant": "(panelOpen && activeOption) ? activeOption.id : null", "attr.aria-expanded": "autocompleteDisabled ? null : panelOpen.toString()", "attr.aria-owns": "(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id", "attr.aria-haspopup": "autocompleteDisabled ? null : \"listbox\"" }, classAttribute: "mat-autocomplete-trigger" }, providers: [MAT_AUTOCOMPLETE_VALUE_ACCESSOR], exportAs: ["matAutocompleteTrigger"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MatAutocompleteTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: `input[matAutocomplete], textarea[matAutocomplete]`,
                    host: {
                        'class': 'mat-autocomplete-trigger',
                        '[attr.autocomplete]': 'autocompleteAttribute',
                        '[attr.role]': 'autocompleteDisabled ? null : "combobox"',
                        '[attr.aria-autocomplete]': 'autocompleteDisabled ? null : "list"',
                        '[attr.aria-activedescendant]': '(panelOpen && activeOption) ? activeOption.id : null',
                        '[attr.aria-expanded]': 'autocompleteDisabled ? null : panelOpen.toString()',
                        '[attr.aria-owns]': '(autocompleteDisabled || !panelOpen) ? null : autocomplete?.id',
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
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRixPQUFPLEVBRUwsT0FBTyxFQUNQLGFBQWEsR0FLZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixHQUdqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix3QkFBd0IsRUFFeEIsd0JBQXdCLEdBQ3pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIs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LHNDQUFzQzt3QkFDbEUsOEJBQThCLEVBQUUsc0RBQXNEO3dCQUN0RixzQkFBc0IsRUFBRSxvREFBb0Q7d0JBQzVFLGtCQUFrQixFQUFFLGdFQUFnRTt3QkFDcEYsc0JBQXNCLEVBQUUseUNBQXlDO3dCQUNqRSw0RUFBNEU7d0JBQzVFLGtGQUFrRjt3QkFDbEYsV0FBVyxFQUFFLGdCQUFnQjt3QkFDN0IsUUFBUSxFQUFFLGNBQWM7d0JBQ3hCLFNBQVMsRUFBRSxzQkFBc0I7d0JBQ2pDLFdBQVcsRUFBRSx3QkFBd0I7d0JBQ3JDLFNBQVMsRUFBRSxnQkFBZ0I7cUJBQzVCO29CQUNELFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFNBQVMsRUFBRSxDQUFDLCtCQUErQixDQUFDO2lCQUM3QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9XTl9BUlJPVywgRU5URVIsIEVTQ0FQRSwgVEFCLCBVUF9BUlJPVywgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtfZ2V0RXZlbnRUYXJnZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01BVF9GT1JNX0ZJRUxELCBNYXRGb3JtRmllbGR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtkZWZlciwgZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZSwgdGFwLCBzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgX01hdEF1dG9jb21wbGV0ZUJhc2UsXG4gIE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TLFxuICBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZX0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LWF1dG9jb21wbGV0ZS1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOiAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUllfUFJPVklERVIgPSB7XG4gIHByb3ZpZGU6IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZLFxuICBkZXBzOiBbT3ZlcmxheV0sXG4gIHVzZUZhY3Rvcnk6IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlksXG59O1xuXG4vKipcbiAqIFByb3ZpZGVyIHRoYXQgYWxsb3dzIHRoZSBhdXRvY29tcGxldGUgdG8gcmVnaXN0ZXIgYXMgYSBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIpLFxuICBtdWx0aTogdHJ1ZSxcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIHVzZSBhbiBhdXRvY29tcGxldGUgdHJpZ2dlciB3aXRob3V0IGEgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcihcbiAgICAnQXR0ZW1wdGluZyB0byBvcGVuIGFuIHVuZGVmaW5lZCBpbnN0YW5jZSBvZiBgbWF0LWF1dG9jb21wbGV0ZWAuICcgK1xuICAgICAgJ01ha2Ugc3VyZSB0aGF0IHRoZSBpZCBwYXNzZWQgdG8gdGhlIGBtYXRBdXRvY29tcGxldGVgIGlzIGNvcnJlY3QgYW5kIHRoYXQgJyArXG4gICAgICBcInlvdSdyZSBhdHRlbXB0aW5nIHRvIG9wZW4gaXQgYWZ0ZXIgdGhlIG5nQWZ0ZXJDb250ZW50SW5pdCBob29rLlwiLFxuICApO1xufVxuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdEF1dG9jb21wbGV0ZVRyaWdnZXJgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0QXV0b2NvbXBsZXRlVHJpZ2dlckJhc2VcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX2NvbXBvbmVudERlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hdXRvY29tcGxldGVEaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIE9sZCB2YWx1ZSBvZiB0aGUgbmF0aXZlIGlucHV0LiBVc2VkIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aXRoIHRoZSBgaW5wdXRgIGV2ZW50IG9uIElFLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IGlzIHVzZWQgdG8gcG9zaXRpb24gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBsYWJlbCBzdGF0ZSBpcyBiZWluZyBvdmVycmlkZGVuLiAqL1xuICBwcml2YXRlIF9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcblxuICAvKiogVGhlIHN1YnNjcmlwdGlvbiBmb3IgY2xvc2luZyBhY3Rpb25zIChzb21lIGFyZSBib3VuZCB0byBkb2N1bWVudCkuICovXG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgY2FuIG9wZW4gdGhlIG5leHQgdGltZSBpdCBpcyBmb2N1c2VkLiBVc2VkIHRvIHByZXZlbnQgYSBmb2N1c2VkLFxuICAgKiBjbG9zZWQgYXV0b2NvbXBsZXRlIGZyb20gYmVpbmcgcmVvcGVuZWQgaWYgdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBicm93c2VyIHRhYiBhbmQgdGhlblxuICAgKiBjb21lcyBiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcblxuICAvKiogU3RyZWFtIG9mIGtleWJvYXJkIGV2ZW50cyB0aGF0IGNhbiBjbG9zZSB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Nsb3NlS2V5RXZlbnRTdHJlYW0gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB3aGVuIHRoZSB3aW5kb3cgaXMgYmx1cnJlZC4gTmVlZHMgdG8gYmUgYW5cbiAgICogYXJyb3cgZnVuY3Rpb24gaW4gb3JkZXIgdG8gcHJlc2VydmUgdGhlIGNvbnRleHQuXG4gICAqL1xuICBwcml2YXRlIF93aW5kb3dCbHVySGFuZGxlciA9ICgpID0+IHtcbiAgICAvLyBJZiB0aGUgdXNlciBibHVycmVkIHRoZSB3aW5kb3cgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBpcyBmb2N1c2VkLCBpdCBtZWFucyB0aGF0IGl0J2xsIGJlXG4gICAgLy8gcmVmb2N1c2VkIHdoZW4gdGhleSBjb21lIGJhY2suIEluIHRoaXMgY2FzZSB3ZSB3YW50IHRvIHNraXAgdGhlIGZpcnN0IGZvY3VzIGV2ZW50LCBpZiB0aGVcbiAgICAvLyBwYW5lIHdhcyBjbG9zZWQsIGluIG9yZGVyIHRvIGF2b2lkIHJlb3BlbmluZyBpdCB1bmludGVudGlvbmFsbHkuXG4gICAgdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzID1cbiAgICAgIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCB8fCB0aGlzLnBhbmVsT3BlbjtcbiAgfTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBhdXRvY29tcGxldGUgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRvIGJlIGF0dGFjaGVkIHRvIHRoaXMgdHJpZ2dlci4gKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGU6IF9NYXRBdXRvY29tcGxldGVCYXNlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHJlbGF0aXZlIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQuIEEgcG9zaXRpb24gb2YgYGF1dG9gXG4gICAqIHdpbGwgcmVuZGVyIHRoZSBwYW5lbCB1bmRlcm5lYXRoIHRoZSB0cmlnZ2VyIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBmb3IgaXQgdG8gZml0IGluXG4gICAqIHRoZSB2aWV3cG9ydCwgb3RoZXJ3aXNlIHRoZSBwYW5lbCB3aWxsIGJlIHNob3duIGFib3ZlIGl0LiBJZiB0aGUgcG9zaXRpb24gaXMgc2V0IHRvXG4gICAqIGBhYm92ZWAgb3IgYGJlbG93YCwgdGhlIHBhbmVsIHdpbGwgYWx3YXlzIGJlIHNob3duIGFib3ZlIG9yIGJlbG93IHRoZSB0cmlnZ2VyLiBubyBtYXR0ZXJcbiAgICogd2hldGhlciBpdCBmaXRzIGNvbXBsZXRlbHkgaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVQb3NpdGlvbicpIHBvc2l0aW9uOiAnYXV0bycgfCAnYWJvdmUnIHwgJ2JlbG93JyA9ICdhdXRvJztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHJlbGF0aXZlIHRvIHdoaWNoIHRvIHBvc2l0aW9uIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBlbGVtZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVDb25uZWN0ZWRUbycpIGNvbm5lY3RlZFRvOiBfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZTtcblxuICAvKipcbiAgICogYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIHRvIGJlIHNldCBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGVBdHRyaWJ1dGU6IHN0cmluZyA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBlbGVtZW50IHdpbGxcbiAgICogYWN0IGFzIGEgcmVndWxhciBpbnB1dCBhbmQgdGhlIHVzZXIgd29uJ3QgYmUgYWJsZSB0byBvcGVuIHRoZSBwYW5lbC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlRGlzYWJsZWQnKVxuICBnZXQgYXV0b2NvbXBsZXRlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG4gIHNldCBhdXRvY29tcGxldGVEaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYXV0b2NvbXBsZXRlRGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneTogYW55LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgQEhvc3QoKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TKVxuICAgIHByaXZhdGUgX2RlZmF1bHRzPzogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBhYm92ZSB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYWJvdmVDbGFzczogc3RyaW5nO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVySGFuZGxlcik7XG4gICAgfVxuXG4gICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9jb21wb25lbnREZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2Rlc3Ryb3lQYW5lbCgpO1xuICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0uY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlBdHRhY2hlZCAmJiB0aGlzLmF1dG9jb21wbGV0ZS5zaG93UGFuZWw7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxheUF0dGFjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wZW5zIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgb3BlblBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICB0aGlzLl9mbG9hdExhYmVsKCk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgY2xvc2VQYW5lbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNldExhYmVsKCk7XG5cbiAgICBpZiAoIXRoaXMuX292ZXJsYXlBdHRhY2hlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgLy8gT25seSBlbWl0IGlmIHRoZSBwYW5lbCB3YXMgdmlzaWJsZS5cbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvY29tcGxldGUuX2lzT3BlbiA9IHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgaW4gc29tZSBjYXNlcyB0aGlzIGNhbiBlbmQgdXAgYmVpbmcgY2FsbGVkIGFmdGVyIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgIC8vIEFkZCBhIGNoZWNrIHRvIGVuc3VyZSB0aGF0IHdlIGRvbid0IHRyeSB0byBydW4gY2hhbmdlIGRldGVjdGlvbiBvbiBhIGRlc3Ryb3llZCB2aWV3LlxuICAgIGlmICghdGhpcy5fY29tcG9uZW50RGVzdHJveWVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseSwgYmVjYXVzZVxuICAgICAgLy8gYGZyb21FdmVudGAgZG9lc24ndCBzZWVtIHRvIGRvIGl0IGF0IHRoZSBwcm9wZXIgdGltZS5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBsYWJlbCBpcyByZXNldCB3aGVuIHRoZVxuICAgICAgLy8gdXNlciBjbGlja3Mgb3V0c2lkZS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsIHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgYWxsIG9wdGlvbnNcbiAgICogd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5QXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyZWFtIG9mIGFjdGlvbnMgdGhhdCBzaG91bGQgY2xvc2UgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCwgaW5jbHVkaW5nXG4gICAqIHdoZW4gYW4gb3B0aW9uIGlzIHNlbGVjdGVkLCBvbiBibHVyLCBhbmQgd2hlbiBUQUIgaXMgcHJlc3NlZC5cbiAgICovXG4gIGdldCBwYW5lbENsb3NpbmdBY3Rpb25zKCk6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlIHwgbnVsbD4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9ucyxcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKSxcbiAgICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0sXG4gICAgICB0aGlzLl9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKSxcbiAgICAgIHRoaXMuX292ZXJsYXlSZWZcbiAgICAgICAgPyB0aGlzLl9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSlcbiAgICAgICAgOiBvYnNlcnZhYmxlT2YoKSxcbiAgICApLnBpcGUoXG4gICAgICAvLyBOb3JtYWxpemUgdGhlIG91dHB1dCBzbyB3ZSByZXR1cm4gYSBjb25zaXN0ZW50IHR5cGUuXG4gICAgICBtYXAoZXZlbnQgPT4gKGV2ZW50IGluc3RhbmNlb2YgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlID8gZXZlbnQgOiBudWxsKSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgY2hhbmdlcyB0byB0aGUgc2VsZWN0aW9uIHN0YXRlIG9mIHRoZSBhdXRvY29tcGxldGUgb3B0aW9ucy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmF1dG9jb21wbGV0ZSA/IHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMgOiBudWxsO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIGFueSBzdWJzY3JpYmVycyBiZWZvcmUgYG5nQWZ0ZXJWaWV3SW5pdGAsIHRoZSBgYXV0b2NvbXBsZXRlYCB3aWxsIGJlIHVuZGVmaW5lZC5cbiAgICAvLyBSZXR1cm4gYSBzdHJlYW0gdGhhdCB3ZSdsbCByZXBsYWNlIHdpdGggdGhlIHJlYWwgb25lIG9uY2UgZXZlcnl0aGluZyBpcyBpbiBwbGFjZS5cbiAgICByZXR1cm4gdGhpcy5fem9uZS5vblN0YWJsZS5waXBlKFxuICAgICAgdGFrZSgxKSxcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm9wdGlvblNlbGVjdGlvbnMpLFxuICAgICk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogVGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uLCBjb2VyY2VkIHRvIE1hdE9wdGlvbiB0eXBlLiAqL1xuICBnZXQgYWN0aXZlT3B0aW9uKCk6IE1hdE9wdGlvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIHByaXZhdGUgX2dldE91dHNpZGVDbGlja1N0cmVhbSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PixcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ2F1eGNsaWNrJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PixcbiAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ3RvdWNoZW5kJykgYXMgT2JzZXJ2YWJsZTxUb3VjaEV2ZW50PixcbiAgICApLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4ge1xuICAgICAgICAvLyBJZiB3ZSdyZSBpbiB0aGUgU2hhZG93IERPTSwgdGhlIGV2ZW50IHRhcmdldCB3aWxsIGJlIHRoZSBzaGFkb3cgcm9vdCwgc28gd2UgaGF2ZSB0b1xuICAgICAgICAvLyBmYWxsIGJhY2sgdG8gY2hlY2sgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIHBhdGggb2YgdGhlIGNsaWNrIGV2ZW50LlxuICAgICAgICBjb25zdCBjbGlja1RhcmdldCA9IF9nZXRFdmVudFRhcmdldDxIVE1MRWxlbWVudD4oZXZlbnQpITtcbiAgICAgICAgY29uc3QgZm9ybUZpZWxkID0gdGhpcy5fZm9ybUZpZWxkID8gdGhpcy5fZm9ybUZpZWxkLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuICAgICAgICBjb25zdCBjdXN0b21PcmlnaW4gPSB0aGlzLmNvbm5lY3RlZFRvID8gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmXG4gICAgICAgICAgY2xpY2tUYXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgIC8vIE5vcm1hbGx5IGZvY3VzIG1vdmVzIGluc2lkZSBgbW91c2Vkb3duYCBzbyB0aGlzIGNvbmRpdGlvbiB3aWxsIGFsbW9zdCBhbHdheXMgYmVcbiAgICAgICAgICAvLyB0cnVlLiBJdHMgbWFpbiBwdXJwb3NlIGlzIHRvIGhhbmRsZSB0aGUgY2FzZSB3aGVyZSB0aGUgaW5wdXQgaXMgZm9jdXNlZCBmcm9tIGFuXG4gICAgICAgICAgLy8gb3V0c2lkZSBjbGljayB3aGljaCBwcm9wYWdhdGVzIHVwIHRvIHRoZSBgYm9keWAgbGlzdGVuZXIgd2l0aGluIHRoZSBzYW1lIHNlcXVlbmNlXG4gICAgICAgICAgLy8gYW5kIGNhdXNlcyB0aGUgcGFuZWwgdG8gY2xvc2UgaW1tZWRpYXRlbHkgKHNlZSAjMzEwNikuXG4gICAgICAgICAgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICAgKCFmb3JtRmllbGQgfHwgIWZvcm1GaWVsZC5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgKCFjdXN0b21PcmlnaW4gfHwgIWN1c3RvbU9yaWdpbi5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgISF0aGlzLl9vdmVybGF5UmVmICYmXG4gICAgICAgICAgIXRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY29udGFpbnMoY2xpY2tUYXJnZXQpXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICApO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB0aGlzLl9zZXRUcmlnZ2VyVmFsdWUodmFsdWUpKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGhhc01vZGlmaWVyID0gaGFzTW9kaWZpZXJLZXkoZXZlbnQpO1xuXG4gICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gb24gYWxsIGVzY2FwZSBrZXkgcHJlc3Nlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseSB0byBicmluZyBJRVxuICAgIC8vIGluIGxpbmUgd2l0aCBvdGhlciBicm93c2Vycy4gQnkgZGVmYXVsdCwgcHJlc3NpbmcgZXNjYXBlIG9uIElFIHdpbGwgY2F1c2UgaXQgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhhdCBpdCBoYWQgb24gZm9jdXMsIGhvd2V2ZXIgaXQgd29uJ3QgZGlzcGF0Y2ggYW55IGV2ZW50c1xuICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIG1vZGVsIHZhbHVlIHdpbGwgYmUgb3V0IG9mIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRVNDQVBFICYmICFoYXNNb2RpZmllcikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hY3RpdmVPcHRpb24gJiYga2V5Q29kZSA9PT0gRU5URVIgJiYgdGhpcy5wYW5lbE9wZW4gJiYgIWhhc01vZGlmaWVyKSB7XG4gICAgICB0aGlzLmFjdGl2ZU9wdGlvbi5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b2NvbXBsZXRlKSB7XG4gICAgICBjb25zdCBwcmV2QWN0aXZlSXRlbSA9IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gVVBfQVJST1cgfHwga2V5Q29kZSA9PT0gRE9XTl9BUlJPVztcblxuICAgICAgaWYgKGtleUNvZGUgPT09IFRBQiB8fCAoaXNBcnJvd0tleSAmJiAhaGFzTW9kaWZpZXIgJiYgdGhpcy5wYW5lbE9wZW4pKSB7XG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICB9IGVsc2UgaWYgKGlzQXJyb3dLZXkgJiYgdGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0Fycm93S2V5IHx8IHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0gIT09IHByZXZBY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbFRvT3B0aW9uKHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaGFuZGxlSW5wdXQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbGV0IHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gQmFzZWQgb24gYE51bWJlclZhbHVlQWNjZXNzb3JgIGZyb20gZm9ybXMuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaW5wdXQgaGFzIGEgcGxhY2Vob2xkZXIsIElFIHdpbGwgZmlyZSB0aGUgYGlucHV0YCBldmVudCBvbiBwYWdlIGxvYWQsXG4gICAgLy8gZm9jdXMgYW5kIGJsdXIsIGluIGFkZGl0aW9uIHRvIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgY2hhbmdlZCB0aGUgdmFsdWUuIFRvXG4gICAgLy8gZmlsdGVyIG91dCBhbGwgb2YgdGhlIGV4dHJhIGV2ZW50cywgd2Ugc2F2ZSB0aGUgdmFsdWUgb24gZm9jdXMgYW5kIGJldHdlZW5cbiAgICAvLyBgaW5wdXRgIGV2ZW50cywgYW5kIHdlIGNoZWNrIHdoZXRoZXIgaXQgY2hhbmdlZC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODg1NzQ3L1xuICAgIGlmICh0aGlzLl9wcmV2aW91c1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5fY2FuT3BlbigpICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cykge1xuICAgICAgdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbiBcImF1dG9cIiBtb2RlLCB0aGUgbGFiZWwgd2lsbCBhbmltYXRlIGRvd24gYXMgc29vbiBhcyBmb2N1cyBpcyBsb3N0LlxuICAgKiBUaGlzIGNhdXNlcyB0aGUgdmFsdWUgdG8ganVtcCB3aGVuIHNlbGVjdGluZyBhbiBvcHRpb24gd2l0aCB0aGUgbW91c2UuXG4gICAqIFRoaXMgbWV0aG9kIG1hbnVhbGx5IGZsb2F0cyB0aGUgbGFiZWwgdW50aWwgdGhlIHBhbmVsIGNhbiBiZSBjbG9zZWQuXG4gICAqIEBwYXJhbSBzaG91bGRBbmltYXRlIFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBiZSBhbmltYXRlZCB3aGVuIGl0IGlzIGZsb2F0ZWQuXG4gICAqL1xuICBwcml2YXRlIF9mbG9hdExhYmVsKHNob3VsZEFuaW1hdGUgPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mb3JtRmllbGQgJiYgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPT09ICdhdXRvJykge1xuICAgICAgaWYgKHNob3VsZEFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLl9hbmltYXRlQW5kTG9ja0xhYmVsKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9ICdhbHdheXMnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBJZiB0aGUgbGFiZWwgaGFzIGJlZW4gbWFudWFsbHkgZWxldmF0ZWQsIHJldHVybiBpdCB0byBpdHMgbm9ybWFsIHN0YXRlLiAqL1xuICBwcml2YXRlIF9yZXNldExhYmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID0gJ2F1dG8nO1xuICAgICAgdGhpcy5fbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGxpc3RlbnMgdG8gYSBzdHJlYW0gb2YgcGFuZWwgY2xvc2luZyBhY3Rpb25zIGFuZCByZXNldHMgdGhlXG4gICAqIHN0cmVhbSBldmVyeSB0aW1lIHRoZSBvcHRpb24gbGlzdCBjaGFuZ2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9DbG9zaW5nQWN0aW9ucygpOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IGZpcnN0U3RhYmxlID0gdGhpcy5fem9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpO1xuICAgIGNvbnN0IG9wdGlvbkNoYW5nZXMgPSB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgIHRhcCgoKSA9PiB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5LnJlYXBwbHlMYXN0UG9zaXRpb24oKSksXG4gICAgICAvLyBEZWZlciBlbWl0dGluZyB0byB0aGUgc3RyZWFtIHVudGlsIHRoZSBuZXh0IHRpY2ssIGJlY2F1c2UgY2hhbmdpbmdcbiAgICAgIC8vIGJpbmRpbmdzIGluIGhlcmUgd2lsbCBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICAgIGRlbGF5KDApLFxuICAgICk7XG5cbiAgICAvLyBXaGVuIHRoZSB6b25lIGlzIHN0YWJsZSBpbml0aWFsbHksIGFuZCB3aGVuIHRoZSBvcHRpb24gbGlzdCBjaGFuZ2VzLi4uXG4gICAgcmV0dXJuIChcbiAgICAgIG1lcmdlKGZpcnN0U3RhYmxlLCBvcHRpb25DaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgc3RyZWFtIG9mIHBhbmVsQ2xvc2luZ0FjdGlvbnMsIHJlcGxhY2luZyBhbnkgcHJldmlvdXMgc3RyZWFtc1xuICAgICAgICAgIC8vIHRoYXQgd2VyZSBjcmVhdGVkLCBhbmQgZmxhdHRlbiBpdCBzbyBvdXIgc3RyZWFtIG9ubHkgZW1pdHMgY2xvc2luZyBldmVudHMuLi5cbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4ge1xuICAgICAgICAgICAgLy8gVGhlIGBOZ1pvbmUub25TdGFibGVgIGFsd2F5cyBlbWl0cyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUsIHRodXMgd2UgaGF2ZSB0byByZS1lbnRlclxuICAgICAgICAgICAgLy8gdGhlIEFuZ3VsYXIgem9uZS4gVGhpcyB3aWxsIGxlYWQgdG8gY2hhbmdlIGRldGVjdGlvbiBiZWluZyBjYWxsZWQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhclxuICAgICAgICAgICAgLy8gem9uZSBhbmQgdGhlIGBhdXRvY29tcGxldGUub3BlbmVkYCB3aWxsIGFsc28gZW1pdCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyLlxuICAgICAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG4gICAgICAgICAgICAgIHRoaXMuX3Jlc2V0QWN0aXZlSXRlbSgpO1xuICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0VmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBgcGFuZWxPcGVuYCBzdGF0ZSBjaGFuZ2VkLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBlbWl0IHRoZSBgb3BlbmVkYFxuICAgICAgICAgICAgICAgIC8vIGV2ZW50LCBiZWNhdXNlIHdlIG1heSBub3QgaGF2ZSBlbWl0dGVkIGl0IHdoZW4gdGhlIHBhbmVsIHdhcyBhdHRhY2hlZC4gVGhpc1xuICAgICAgICAgICAgICAgIC8vIGNhbiBoYXBwZW4gaWYgdGhlIHVzZXJzIG9wZW5zIHRoZSBwYW5lbCBhbmQgdGhlcmUgYXJlIG5vIG9wdGlvbnMsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBvcHRpb25zIGNvbWUgaW4gc2xpZ2h0bHkgbGF0ZXIgb3IgYXMgYSByZXN1bHQgb2YgdGhlIHZhbHVlIGNoYW5naW5nLlxuICAgICAgICAgICAgICAgIGlmICh3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUub3BlbmVkLmVtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYW5lbENsb3NpbmdBY3Rpb25zO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IGNsb3NpbmcgZXZlbnQgb2NjdXJzLi4uXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgKVxuICAgICAgICAvLyBzZXQgdGhlIHZhbHVlLCBjbG9zZSB0aGUgcGFuZWwsIGFuZCBjb21wbGV0ZS5cbiAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50KSlcbiAgICApO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBhbmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VHJpZ2dlclZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0b0Rpc3BsYXkgPVxuICAgICAgdGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUuZGlzcGxheVdpdGhcbiAgICAgICAgPyB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aCh2YWx1ZSlcbiAgICAgICAgOiB2YWx1ZTtcblxuICAgIC8vIFNpbXBseSBmYWxsaW5nIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBkaXNwbGF5IHZhbHVlIGlzIGZhbHN5IGRvZXMgbm90IHdvcmsgcHJvcGVybHkuXG4gICAgLy8gVGhlIGRpc3BsYXkgdmFsdWUgY2FuIGFsc28gYmUgdGhlIG51bWJlciB6ZXJvIGFuZCBzaG91bGRuJ3QgZmFsbCBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICBjb25zdCBpbnB1dFZhbHVlID0gdG9EaXNwbGF5ICE9IG51bGwgPyB0b0Rpc3BsYXkgOiAnJztcblxuICAgIC8vIElmIGl0J3MgdXNlZCB3aXRoaW4gYSBgTWF0Rm9ybUZpZWxkYCwgd2Ugc2hvdWxkIHNldCBpdCB0aHJvdWdoIHRoZSBwcm9wZXJ0eSBzbyBpdCBjYW4gZ29cbiAgICAvLyB0aHJvdWdoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkLl9jb250cm9sLnZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjbG9zZXMgdGhlIHBhbmVsLCBhbmQgaWYgYSB2YWx1ZSBpcyBzcGVjaWZpZWQsIGFsc28gc2V0cyB0aGUgYXNzb2NpYXRlZFxuICAgKiBjb250cm9sIHRvIHRoYXQgdmFsdWUuIEl0IHdpbGwgYWxzbyBtYXJrIHRoZSBjb250cm9sIGFzIGRpcnR5IGlmIHRoaXMgaW50ZXJhY3Rpb25cbiAgICogc3RlbW1lZCBmcm9tIHRoZSB1c2VyLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0VmFsdWVBbmRDbG9zZShldmVudDogTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlIHwgbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IHNvdXJjZSA9IGV2ZW50ICYmIGV2ZW50LnNvdXJjZTtcblxuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihzb3VyY2UpO1xuICAgICAgdGhpcy5fc2V0VHJpZ2dlclZhbHVlKHNvdXJjZS52YWx1ZSk7XG4gICAgICB0aGlzLl9vbkNoYW5nZShzb3VyY2UudmFsdWUpO1xuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2VtaXRTZWxlY3RFdmVudChzb3VyY2UpO1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYW55IHByZXZpb3VzIHNlbGVjdGVkIG9wdGlvbiBhbmQgZW1pdCBhIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgZm9yIHRoaXMgb3B0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24oc2tpcDogTWF0T3B0aW9uKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uICE9PSBza2lwICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGFjaE92ZXJsYXkoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmF1dG9jb21wbGV0ZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTtcbiAgICB9XG5cbiAgICBsZXQgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXlSZWY7XG5cbiAgICBpZiAoIW92ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuX3BvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLmF1dG9jb21wbGV0ZS50ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZiwge1xuICAgICAgICBpZDogdGhpcy5fZm9ybUZpZWxkPy5nZXRMYWJlbElkKCksXG4gICAgICB9KTtcbiAgICAgIG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5LmNyZWF0ZSh0aGlzLl9nZXRPdmVybGF5Q29uZmlnKCkpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG92ZXJsYXlSZWY7XG5cbiAgICAgIC8vIFVzZSB0aGUgYGtleWRvd25FdmVudHNgIGluIG9yZGVyIHRvIHRha2UgYWR2YW50YWdlIG9mXG4gICAgICAvLyB0aGUgb3ZlcmxheSBldmVudCB0YXJnZXRpbmcgcHJvdmlkZWQgYnkgdGhlIENESyBvdmVybGF5LlxuICAgICAgb3ZlcmxheVJlZi5rZXlkb3duRXZlbnRzKCkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgLy8gQ2xvc2Ugd2hlbiBwcmVzc2luZyBFU0NBUEUgb3IgQUxUICsgVVBfQVJST1csIGJhc2VkIG9uIHRoZSBhMTF5IGd1aWRlbGluZXMuXG4gICAgICAgIC8vIFNlZTogaHR0cHM6Ly93d3cudzMub3JnL1RSL3dhaS1hcmlhLXByYWN0aWNlcy0xLjEvI3RleHRib3gta2V5Ym9hcmQtaW50ZXJhY3Rpb25cbiAgICAgICAgaWYgKFxuICAgICAgICAgIChldmVudC5rZXlDb2RlID09PSBFU0NBUEUgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICAgICAoZXZlbnQua2V5Q29kZSA9PT0gVVBfQVJST1cgJiYgaGFzTW9kaWZpZXJLZXkoZXZlbnQsICdhbHRLZXknKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24sIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBldmVudHVhbGx5XG4gICAgICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0VmlzaWJpbGl0eSgpO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSB0aGlzLl9vdmVybGF5QXR0YWNoZWQgPSB0cnVlO1xuXG4gICAgLy8gV2UgbmVlZCB0byBkbyBhbiBleHRyYSBgcGFuZWxPcGVuYCBjaGVjayBpbiBoZXJlLCBiZWNhdXNlIHRoZVxuICAgIC8vIGF1dG9jb21wbGV0ZSB3b24ndCBiZSBzaG93biBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgd2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wZW5lZC5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHBhbmVsQ2xhc3M6IHRoaXMuX2RlZmF1bHRzPy5vdmVybGF5UGFuZWxDbGFzcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE92ZXJsYXlQb3NpdGlvbigpOiBQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXlcbiAgICAgIC5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoUHVzaChmYWxzZSk7XG5cbiAgICB0aGlzLl9zZXRTdHJhdGVneVBvc2l0aW9ucyhzdHJhdGVneSk7XG4gICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgIHJldHVybiBzdHJhdGVneTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneSBiYXNlZCBvbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgc3RhdGUuICovXG4gIHByaXZhdGUgX3NldFN0cmF0ZWd5UG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBwcm92aWRlIGhvcml6b250YWwgZmFsbGJhY2sgcG9zaXRpb25zLCBldmVuIHRob3VnaCBieSBkZWZhdWx0IHRoZSBkcm9wZG93blxuICAgIC8vIHdpZHRoIG1hdGNoZXMgdGhlIGlucHV0LCBiZWNhdXNlIGNvbnN1bWVycyBjYW4gb3ZlcnJpZGUgdGhlIHdpZHRoLiBTZWUgIzE4ODU0LlxuICAgIGNvbnN0IGJlbG93UG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2JvdHRvbScsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICBdO1xuXG4gICAgLy8gVGhlIG92ZXJsYXkgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIHRyaWdnZXIgc2hvdWxkIGhhdmUgc3F1YXJlZCBjb3JuZXJzLCB3aGlsZVxuICAgIC8vIHRoZSBvcHBvc2l0ZSBlbmQgaGFzIHJvdW5kZWQgY29ybmVycy4gV2UgYXBwbHkgYSBDU1MgY2xhc3MgdG8gc3dhcCB0aGVcbiAgICAvLyBib3JkZXItcmFkaXVzIGJhc2VkIG9uIHRoZSBvdmVybGF5IHBvc2l0aW9uLlxuICAgIGNvbnN0IHBhbmVsQ2xhc3MgPSB0aGlzLl9hYm92ZUNsYXNzO1xuICAgIGNvbnN0IGFib3ZlUG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ3RvcCcsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICBdO1xuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBhYm92ZVBvc2l0aW9ucztcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGJlbG93UG9zaXRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbnMgPSBbLi4uYmVsb3dQb3NpdGlvbnMsIC4uLmFib3ZlUG9zaXRpb25zXTtcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhQb3NpdGlvbnMocG9zaXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbm5lY3RlZEVsZW1lbnQoKTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3RlZFRvKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWRUby5lbGVtZW50UmVmO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpIDogdGhpcy5fZWxlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFBhbmVsV2lkdGgoKTogbnVtYmVyIHwgc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hdXRvY29tcGxldGUucGFuZWxXaWR0aCB8fCB0aGlzLl9nZXRIb3N0V2lkdGgoKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgaW5wdXQgZWxlbWVudCwgc28gdGhlIHBhbmVsIHdpZHRoIGNhbiBtYXRjaCBpdC4gKi9cbiAgcHJpdmF0ZSBfZ2V0SG9zdFdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENvbm5lY3RlZEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gLTEgc28gYXJyb3cgZXZlbnRzIHdpbGwgYWN0aXZhdGUgdGhlXG4gICAqIGNvcnJlY3Qgb3B0aW9ucywgb3IgdG8gMCBpZiB0aGUgY29uc3VtZXIgb3B0ZWQgaW50byBpdC5cbiAgICovXG4gIHByaXZhdGUgX3Jlc2V0QWN0aXZlSXRlbSgpOiB2b2lkIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSB0aGlzLmF1dG9jb21wbGV0ZTtcblxuICAgIGlmIChhdXRvY29tcGxldGUuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKSB7XG4gICAgICAvLyBOb3RlIHRoYXQgd2UgZ28gdGhyb3VnaCBgc2V0Rmlyc3RJdGVtQWN0aXZlYCwgcmF0aGVyIHRoYW4gYHNldEFjdGl2ZUl0ZW0oMClgLCBiZWNhdXNlXG4gICAgICAvLyB0aGUgZm9ybWVyIHdpbGwgZmluZCB0aGUgbmV4dCBlbmFibGVkIG9wdGlvbiwgaWYgdGhlIGZpcnN0IG9uZSBpcyBkaXNhYmxlZC5cbiAgICAgIGF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0oLTEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhbmVsIGNhbiBiZSBvcGVuZWQuICovXG4gIHByaXZhdGUgX2Nhbk9wZW4oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gIWVsZW1lbnQucmVhZE9ubHkgJiYgIWVsZW1lbnQuZGlzYWJsZWQgJiYgIXRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Py5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKiogU2Nyb2xscyB0byBhIHBhcnRpY3VsYXIgb3B0aW9uIGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb09wdGlvbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gR2l2ZW4gdGhhdCB3ZSBhcmUgbm90IGFjdHVhbGx5IGZvY3VzaW5nIGFjdGl2ZSBvcHRpb25zLCB3ZSBtdXN0IG1hbnVhbGx5IGFkanVzdCBzY3JvbGxcbiAgICAvLyB0byByZXZlYWwgb3B0aW9ucyBiZWxvdyB0aGUgZm9sZC4gRmlyc3QsIHdlIGZpbmQgdGhlIG9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcFxuICAgIC8vIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYmVsb3cgdGhlIGZvbGQsIHRoZSBuZXcgc2Nyb2xsVG9wIHdpbGwgYmUgdGhlIG9mZnNldCAtXG4gICAgLy8gdGhlIHBhbmVsIGhlaWdodCArIHRoZSBvcHRpb24gaGVpZ2h0LCBzbyB0aGUgYWN0aXZlIG9wdGlvbiB3aWxsIGJlIGp1c3QgdmlzaWJsZSBhdCB0aGVcbiAgICAvLyBib3R0b20gb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBhYm92ZSB0aGUgdG9wIG9mIHRoZSB2aXNpYmxlIHBhbmVsLCB0aGUgbmV3IHNjcm9sbFRvcFxuICAgIC8vIHdpbGwgYmVjb21lIHRoZSBvZmZzZXQuIElmIHRoYXQgb2Zmc2V0IGlzIHZpc2libGUgd2l0aGluIHRoZSBwYW5lbCBhbHJlYWR5LCB0aGUgc2Nyb2xsVG9wIGlzXG4gICAgLy8gbm90IGFkanVzdGVkLlxuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IGxhYmVsQ291bnQgPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihcbiAgICAgIGluZGV4LFxuICAgICAgYXV0b2NvbXBsZXRlLm9wdGlvbnMsXG4gICAgICBhdXRvY29tcGxldGUub3B0aW9uR3JvdXBzLFxuICAgICk7XG5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbGFiZWxDb3VudCA9PT0gMSkge1xuICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAvLyB0b3Agb2YgdGhlIG9wdGlvbiwgYmVjYXVzZSBpdCBhbGxvd3MgdGhlIHVzZXIgdG8gcmVhZCB0aGUgdG9wIGdyb3VwJ3MgbGFiZWwuXG4gICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2UgaWYgKGF1dG9jb21wbGV0ZS5wYW5lbCkge1xuICAgICAgY29uc3Qgb3B0aW9uID0gYXV0b2NvbXBsZXRlLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XTtcblxuICAgICAgaWYgKG9wdGlvbikge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gb3B0aW9uLl9nZXRIb3N0RWxlbWVudCgpO1xuICAgICAgICBjb25zdCBuZXdTY3JvbGxQb3NpdGlvbiA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICBhdXRvY29tcGxldGUuX2dldFNjcm9sbFRvcCgpLFxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5wYW5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICBhdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcChuZXdTY3JvbGxQb3NpdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdEF1dG9jb21wbGV0ZV0sIHRleHRhcmVhW21hdEF1dG9jb21wbGV0ZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1hdXRvY29tcGxldGUtdHJpZ2dlcicsXG4gICAgJ1thdHRyLmF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlQXR0cmlidXRlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJjb21ib2JveFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICcocGFuZWxPcGVuICYmIGFjdGl2ZU9wdGlvbikgPyBhY3RpdmVPcHRpb24uaWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogcGFuZWxPcGVuLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhhdXRvY29tcGxldGVEaXNhYmxlZCB8fCAhcGFuZWxPcGVuKSA/IG51bGwgOiBhdXRvY29tcGxldGU/LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJsaXN0Ym94XCInLFxuICAgIC8vIE5vdGU6IHdlIHVzZSBgZm9jdXNpbmAsIGFzIG9wcG9zZWQgdG8gYGZvY3VzYCwgaW4gb3JkZXIgdG8gb3BlbiB0aGUgcGFuZWxcbiAgICAvLyBhIGxpdHRsZSBlYXJsaWVyLiBUaGlzIGF2b2lkcyBpc3N1ZXMgd2hlcmUgSUUgZGVsYXlzIHRoZSBmb2N1c2luZyBvZiB0aGUgaW5wdXQuXG4gICAgJyhmb2N1c2luKSc6ICdfaGFuZGxlRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknLFxuICAgICcoaW5wdXQpJzogJ19oYW5kbGVJbnB1dCgkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGVUcmlnZ2VyJyxcbiAgcHJvdmlkZXJzOiBbTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlVHJpZ2dlckJhc2Uge1xuICBwcm90ZWN0ZWQgX2Fib3ZlQ2xhc3MgPSAnbWF0LWF1dG9jb21wbGV0ZS1wYW5lbC1hYm92ZSc7XG59XG4iXX0=