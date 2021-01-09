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
import { _getShadowRoot } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, ElementRef, forwardRef, Host, Inject, InjectionToken, Input, NgZone, Optional, ViewContainerRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, MatOptionSelectionChange, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormField } from '@angular/material/form-field';
import { defer, fromEvent, merge, of as observableOf, Subject, Subscription } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { _MatAutocompleteBase, MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from './autocomplete';
import { _MatAutocompleteOriginBase } from './autocomplete-origin';
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the scrollTop of the panel. Because we are not
 * actually focusing the active item, scroll must be handled manually.
 */
/**
 * The height of each autocomplete option.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 12.0.0
 */
export const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/**
 * The total height of the autocomplete panel.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 12.0.0
 */
export const AUTOCOMPLETE_PANEL_HEIGHT = 256;
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
    multi: true
};
/**
 * Creates an error to be thrown when attempting to use an autocomplete trigger without a panel.
 * @docs-private
 */
export function getMatAutocompleteMissingPanelError() {
    return Error('Attempting to open an undefined instance of `mat-autocomplete`. ' +
        'Make sure that the id passed to the `matAutocomplete` is correct and that ' +
        'you\'re attempting to open it after the ngAfterContentInit hook.');
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
        /** Stream of autocomplete option selections. */
        this.optionSelections = defer(() => {
            if (this.autocomplete && this.autocomplete.options) {
                return merge(...this.autocomplete.options.map(option => option.onSelectionChange));
            }
            // If there are any subscribers before `ngAfterViewInit`, the `autocomplete` will be undefined.
            // Return a stream that we'll replace with the real one once everything is in place.
            return this._zone.onStable
                .pipe(take(1), switchMap(() => this.optionSelections));
        });
        this._scrollStrategy = scrollStrategy;
    }
    /**
     * Whether the autocomplete is disabled. When disabled, the element will
     * act as a regular input and the user won't be able to open the panel.
     */
    get autocompleteDisabled() { return this._autocompleteDisabled; }
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
        return merge(this.optionSelections, this.autocomplete._keyManager.tabOut.pipe(filter(() => this._overlayAttached)), this._closeKeyEventStream, this._getOutsideClickStream(), this._overlayRef ?
            this._overlayRef.detachments().pipe(filter(() => this._overlayAttached)) :
            observableOf()).pipe(
        // Normalize the output so we return a consistent type.
        map(event => event instanceof MatOptionSelectionChange ? event : null));
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
        return merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'auxclick'), fromEvent(this._document, 'touchend'))
            .pipe(filter(event => {
            // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
            // fall back to check the first element in the path of the click event.
            const clickTarget = (this._isInsideShadowRoot && event.composedPath ? event.composedPath()[0] :
                event.target);
            const formField = this._formField ? this._formField._elementRef.nativeElement : null;
            const customOrigin = this.connectedTo ? this.connectedTo.elementRef.nativeElement : null;
            return this._overlayAttached && clickTarget !== this._element.nativeElement &&
                (!formField || !formField.contains(clickTarget)) &&
                (!customOrigin || !customOrigin.contains(clickTarget)) &&
                (!!this._overlayRef && !this._overlayRef.overlayElement.contains(clickTarget));
        }));
    }
    // Implemented as part of ControlValueAccessor.
    writeValue(value) {
        Promise.resolve(null).then(() => this._setTriggerValue(value));
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
        // Prevent the default action on all escape key presses. This is here primarily to bring IE
        // in line with other browsers. By default, pressing escape on IE will cause it to revert
        // the input value to the one that it had on focus, however it won't dispatch any events
        // which means that the model value will be out of sync with the view.
        if (keyCode === ESCAPE && !hasModifierKey(event)) {
            event.preventDefault();
        }
        if (this.activeOption && keyCode === ENTER && this.panelOpen) {
            this.activeOption._selectViaInteraction();
            this._resetActiveItem();
            event.preventDefault();
        }
        else if (this.autocomplete) {
            const prevActiveItem = this.autocomplete._keyManager.activeItem;
            const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;
            if (this.panelOpen || keyCode === TAB) {
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
        return merge(firstStable, optionChanges)
            .pipe(
        // create a new stream of panelClosingActions, replacing any previous streams
        // that were created, and flatten it so our stream only emits closing events...
        switchMap(() => {
            const wasOpen = this.panelOpen;
            this._resetActiveItem();
            this.autocomplete._setVisibility();
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
            return this.panelClosingActions;
        }), 
        // when the first closing event occurs...
        take(1))
            // set the value, close the panel, and complete.
            .subscribe(event => this._setValueAndClose(event));
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
        const toDisplay = this.autocomplete && this.autocomplete.displayWith ?
            this.autocomplete.displayWith(value) :
            value;
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
     */
    _clearPreviousSelectedOption(skip) {
        this.autocomplete.options.forEach(option => {
            if (option !== skip && option.selected) {
                option.deselect();
            }
        });
    }
    _attachOverlay() {
        var _a;
        if (!this.autocomplete && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatAutocompleteMissingPanelError();
        }
        // We want to resolve this once, as late as possible so that we can be
        // sure that the element has been moved into its final place in the DOM.
        if (this._isInsideShadowRoot == null) {
            this._isInsideShadowRoot = !!_getShadowRoot(this._element.nativeElement);
        }
        let overlayRef = this._overlayRef;
        if (!overlayRef) {
            this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef, { id: (_a = this._formField) === null || _a === void 0 ? void 0 : _a._labelId });
            overlayRef = this._overlay.create(this._getOverlayConfig());
            this._overlayRef = overlayRef;
            // Use the `keydownEvents` in order to take advantage of
            // the overlay event targeting provided by the CDK overlay.
            overlayRef.keydownEvents().subscribe(event => {
                // Close when pressing ESCAPE or ALT + UP_ARROW, based on the a11y guidelines.
                // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
                if ((event.keyCode === ESCAPE && !hasModifierKey(event)) ||
                    (event.keyCode === UP_ARROW && hasModifierKey(event, 'altKey'))) {
                    this._resetActiveItem();
                    this._closeKeyEventStream.next();
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
        var _a;
        return new OverlayConfig({
            positionStrategy: this._getOverlayPosition(),
            scrollStrategy: this._scrollStrategy(),
            width: this._getPanelWidth(),
            direction: this._dir,
            panelClass: (_a = this._defaults) === null || _a === void 0 ? void 0 : _a.overlayPanelClass,
        });
    }
    _getOverlayPosition() {
        const strategy = this._overlay.position()
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
            { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
        ];
        // The overlay edge connected to the trigger should have squared corners, while
        // the opposite end has rounded corners. We apply a CSS class to swap the
        // border-radius based on the overlay position.
        const panelClass = this._aboveClass;
        const abovePositions = [
            { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', panelClass },
            { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', panelClass }
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
        this.autocomplete._keyManager.setActiveItem(this.autocomplete.autoActiveFirstOption ? 0 : -1);
    }
    /** Determines whether the panel can be opened. */
    _canOpen() {
        const element = this._element.nativeElement;
        return !element.readOnly && !element.disabled && !this._autocompleteDisabled;
    }
    /** Use defaultView of injected document if available or fallback to global window reference */
    _getWindow() {
        var _a;
        return ((_a = this._document) === null || _a === void 0 ? void 0 : _a.defaultView) || window;
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
        else {
            const option = autocomplete.options.toArray()[index];
            if (option) {
                const element = option._getHostElement();
                const newScrollPosition = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, autocomplete._getScrollTop(), autocomplete.panel.nativeElement.offsetHeight);
                autocomplete._setScrollTop(newScrollPosition);
            }
        }
    }
}
_MatAutocompleteTriggerBase.decorators = [
    { type: Directive }
];
_MatAutocompleteTriggerBase.ctorParameters = () => [
    { type: ElementRef },
    { type: Overlay },
    { type: ViewContainerRef },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY,] }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }, { type: Host }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: ViewportRuler },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,] }] }
];
_MatAutocompleteTriggerBase.propDecorators = {
    autocomplete: [{ type: Input, args: ['matAutocomplete',] }],
    position: [{ type: Input, args: ['matAutocompletePosition',] }],
    connectedTo: [{ type: Input, args: ['matAutocompleteConnectedTo',] }],
    autocompleteAttribute: [{ type: Input, args: ['autocomplete',] }],
    autocompleteDisabled: [{ type: Input, args: ['matAutocompleteDisabled',] }]
};
export class MatAutocompleteTrigger extends _MatAutocompleteTriggerBase {
    constructor() {
        super(...arguments);
        this._aboveClass = 'mat-autocomplete-panel-above';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvRixPQUFPLEVBRUwsT0FBTyxFQUNQLGFBQWEsR0FLZCxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLElBQUksRUFDSixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixHQUdqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDdkUsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix3QkFBd0IsRUFFeEIsd0JBQXdCLEdBQ3pCLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUMsTUFBTSw4QkFBOEIs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SSxNQUFNLFNBQUMsUUFBUTtZQWhNbEMsYUFBYTs0Q0FrTU4sUUFBUSxZQUFJLE1BQU0sU0FBQyxnQ0FBZ0M7OzsyQkExQy9ELEtBQUssU0FBQyxpQkFBaUI7dUJBU3ZCLEtBQUssU0FBQyx5QkFBeUI7MEJBTS9CLEtBQUssU0FBQyw0QkFBNEI7b0NBTWxDLEtBQUssU0FBQyxjQUFjO21DQU1wQixLQUFLLFNBQUMseUJBQXlCOztBQWlsQmxDLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSwyQkFBMkI7SUFyQnZFOztRQXNCWSxnQkFBVyxHQUFHLDhCQUE4QixDQUFDO0lBQ3pELENBQUM7OztZQXZCQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1EQUFtRDtnQkFDN0QsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSwwQkFBMEI7b0JBQ25DLHFCQUFxQixFQUFFLHVCQUF1QjtvQkFDOUMsYUFBYSxFQUFFLDBDQUEwQztvQkFDekQsMEJBQTBCLEVBQUUsc0NBQXNDO29CQUNsRSw4QkFBOEIsRUFBRSxzREFBc0Q7b0JBQ3RGLHNCQUFzQixFQUFFLG9EQUFvRDtvQkFDNUUsa0JBQWtCLEVBQUUsZ0VBQWdFO29CQUNwRixzQkFBc0IsRUFBRSx1QkFBdUI7b0JBQy9DLDRFQUE0RTtvQkFDNUUsa0ZBQWtGO29CQUNsRixXQUFXLEVBQUUsZ0JBQWdCO29CQUM3QixRQUFRLEVBQUUsY0FBYztvQkFDeEIsU0FBUyxFQUFFLHNCQUFzQjtvQkFDakMsV0FBVyxFQUFFLHdCQUF3QjtpQkFDdEM7Z0JBQ0QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsU0FBUyxFQUFFLENBQUMsK0JBQStCLENBQUM7YUFDN0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1csIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5LFxuICBPdmVybGF5LFxuICBPdmVybGF5Q29uZmlnLFxuICBPdmVybGF5UmVmLFxuICBQb3NpdGlvblN0cmF0ZWd5LFxuICBTY3JvbGxTdHJhdGVneSxcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7X2dldFNoYWRvd1Jvb3R9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01BVF9GT1JNX0ZJRUxELCBNYXRGb3JtRmllbGR9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHtkZWZlciwgZnJvbUV2ZW50LCBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgYXMgb2JzZXJ2YWJsZU9mLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIF9NYXRBdXRvY29tcGxldGVCYXNlLFxuICBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyxcbiAgTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnNcbn0gZnJvbSAnLi9hdXRvY29tcGxldGUnO1xuaW1wb3J0IHtfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZX0gZnJvbSAnLi9hdXRvY29tcGxldGUtb3JpZ2luJztcblxuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgc3R5bGUgY29uc3RhbnRzIGFyZSBuZWNlc3NhcnkgdG8gc2F2ZSBoZXJlIGluIG9yZGVyXG4gKiB0byBwcm9wZXJseSBjYWxjdWxhdGUgdGhlIHNjcm9sbFRvcCBvZiB0aGUgcGFuZWwuIEJlY2F1c2Ugd2UgYXJlIG5vdFxuICogYWN0dWFsbHkgZm9jdXNpbmcgdGhlIGFjdGl2ZSBpdGVtLCBzY3JvbGwgbXVzdCBiZSBoYW5kbGVkIG1hbnVhbGx5LlxuICovXG5cbi8qKlxuICogVGhlIGhlaWdodCBvZiBlYWNoIGF1dG9jb21wbGV0ZSBvcHRpb24uXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTIuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBBVVRPQ09NUExFVEVfT1BUSU9OX0hFSUdIVCA9IDQ4O1xuXG4vKipcbiAqIFRoZSB0b3RhbCBoZWlnaHQgb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC5cbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9DT01QTEVURV9QQU5FTF9IRUlHSFQgPSAyNTY7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KCdtYXQtYXV0b2NvbXBsZXRlLXNjcm9sbC1zdHJhdGVneScpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfU0NST0xMX1NUUkFURUdZX0ZBQ1RPUlkob3ZlcmxheTogT3ZlcmxheSk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWSxcbn07XG5cbi8qKlxuICogUHJvdmlkZXIgdGhhdCBhbGxvd3MgdGhlIGF1dG9jb21wbGV0ZSB0byByZWdpc3RlciBhcyBhIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gZXJyb3IgdG8gYmUgdGhyb3duIHdoZW4gYXR0ZW1wdGluZyB0byB1c2UgYW4gYXV0b2NvbXBsZXRlIHRyaWdnZXIgd2l0aG91dCBhIHBhbmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTogRXJyb3Ige1xuICByZXR1cm4gRXJyb3IoJ0F0dGVtcHRpbmcgdG8gb3BlbiBhbiB1bmRlZmluZWQgaW5zdGFuY2Ugb2YgYG1hdC1hdXRvY29tcGxldGVgLiAnICtcbiAgICAgICAgICAgICAgICdNYWtlIHN1cmUgdGhhdCB0aGUgaWQgcGFzc2VkIHRvIHRoZSBgbWF0QXV0b2NvbXBsZXRlYCBpcyBjb3JyZWN0IGFuZCB0aGF0ICcgK1xuICAgICAgICAgICAgICAgJ3lvdVxcJ3JlIGF0dGVtcHRpbmcgdG8gb3BlbiBpdCBhZnRlciB0aGUgbmdBZnRlckNvbnRlbnRJbml0IGhvb2suJyk7XG59XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlcmAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRBdXRvY29tcGxldGVUcmlnZ2VyQmFzZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgcHJpdmF0ZSBfb3ZlcmxheVJlZjogT3ZlcmxheVJlZiB8IG51bGw7XG4gIHByaXZhdGUgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG4gIHByaXZhdGUgX2NvbXBvbmVudERlc3Ryb3llZCA9IGZhbHNlO1xuICBwcml2YXRlIF9hdXRvY29tcGxldGVEaXNhYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIE9sZCB2YWx1ZSBvZiB0aGUgbmF0aXZlIGlucHV0LiBVc2VkIHRvIHdvcmsgYXJvdW5kIGlzc3VlcyB3aXRoIHRoZSBgaW5wdXRgIGV2ZW50IG9uIElFLiAqL1xuICBwcml2YXRlIF9wcmV2aW91c1ZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IGlzIHVzZWQgdG8gcG9zaXRpb24gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBsYWJlbCBzdGF0ZSBpcyBiZWluZyBvdmVycmlkZGVuLiAqL1xuICBwcml2YXRlIF9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcblxuICAvKiogVGhlIHN1YnNjcmlwdGlvbiBmb3IgY2xvc2luZyBhY3Rpb25zIChzb21lIGFyZSBib3VuZCB0byBkb2N1bWVudCkuICovXG4gIHByaXZhdGUgX2Nsb3NpbmdBY3Rpb25zU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB2aWV3cG9ydCBzaXplIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgY2FuIG9wZW4gdGhlIG5leHQgdGltZSBpdCBpcyBmb2N1c2VkLiBVc2VkIHRvIHByZXZlbnQgYSBmb2N1c2VkLFxuICAgKiBjbG9zZWQgYXV0b2NvbXBsZXRlIGZyb20gYmVpbmcgcmVvcGVuZWQgaWYgdGhlIHVzZXIgc3dpdGNoZXMgdG8gYW5vdGhlciBicm93c2VyIHRhYiBhbmQgdGhlblxuICAgKiBjb21lcyBiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbnNpZGUgb2YgYSBTaGFkb3dSb290IGNvbXBvbmVudC4gKi9cbiAgcHJpdmF0ZSBfaXNJbnNpZGVTaGFkb3dSb290OiBib29sZWFuO1xuXG4gIC8qKiBTdHJlYW0gb2Yga2V5Ym9hcmQgZXZlbnRzIHRoYXQgY2FuIGNsb3NlIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfY2xvc2VLZXlFdmVudFN0cmVhbSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIHdoZW4gdGhlIHdpbmRvdyBpcyBibHVycmVkLiBOZWVkcyB0byBiZSBhblxuICAgKiBhcnJvdyBmdW5jdGlvbiBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dC5cbiAgICovXG4gIHByaXZhdGUgX3dpbmRvd0JsdXJIYW5kbGVyID0gKCkgPT4ge1xuICAgIC8vIElmIHRoZSB1c2VyIGJsdXJyZWQgdGhlIHdpbmRvdyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIGlzIGZvY3VzZWQsIGl0IG1lYW5zIHRoYXQgaXQnbGwgYmVcbiAgICAvLyByZWZvY3VzZWQgd2hlbiB0aGV5IGNvbWUgYmFjay4gSW4gdGhpcyBjYXNlIHdlIHdhbnQgdG8gc2tpcCB0aGUgZmlyc3QgZm9jdXMgZXZlbnQsIGlmIHRoZVxuICAgIC8vIHBhbmUgd2FzIGNsb3NlZCwgaW4gb3JkZXIgdG8gYXZvaWQgcmVvcGVuaW5nIGl0IHVuaW50ZW50aW9uYWxseS5cbiAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPVxuICAgICAgICB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgfHwgdGhpcy5wYW5lbE9wZW47XG4gIH1cblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBhdXRvY29tcGxldGUgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRvIGJlIGF0dGFjaGVkIHRvIHRoaXMgdHJpZ2dlci4gKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGU6IF9NYXRBdXRvY29tcGxldGVCYXNlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHJlbGF0aXZlIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQuIEEgcG9zaXRpb24gb2YgYGF1dG9gXG4gICAqIHdpbGwgcmVuZGVyIHRoZSBwYW5lbCB1bmRlcm5lYXRoIHRoZSB0cmlnZ2VyIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBmb3IgaXQgdG8gZml0IGluXG4gICAqIHRoZSB2aWV3cG9ydCwgb3RoZXJ3aXNlIHRoZSBwYW5lbCB3aWxsIGJlIHNob3duIGFib3ZlIGl0LiBJZiB0aGUgcG9zaXRpb24gaXMgc2V0IHRvXG4gICAqIGBhYm92ZWAgb3IgYGJlbG93YCwgdGhlIHBhbmVsIHdpbGwgYWx3YXlzIGJlIHNob3duIGFib3ZlIG9yIGJlbG93IHRoZSB0cmlnZ2VyLiBubyBtYXR0ZXJcbiAgICogd2hldGhlciBpdCBmaXRzIGNvbXBsZXRlbHkgaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVQb3NpdGlvbicpIHBvc2l0aW9uOiAnYXV0bycgfCAnYWJvdmUnIHwgJ2JlbG93JyA9ICdhdXRvJztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHJlbGF0aXZlIHRvIHdoaWNoIHRvIHBvc2l0aW9uIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBlbGVtZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVDb25uZWN0ZWRUbycpIGNvbm5lY3RlZFRvOiBfTWF0QXV0b2NvbXBsZXRlT3JpZ2luQmFzZTtcblxuICAvKipcbiAgICogYGF1dG9jb21wbGV0ZWAgYXR0cmlidXRlIHRvIGJlIHNldCBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhdXRvY29tcGxldGUnKSBhdXRvY29tcGxldGVBdHRyaWJ1dGU6IHN0cmluZyA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBlbGVtZW50IHdpbGxcbiAgICogYWN0IGFzIGEgcmVndWxhciBpbnB1dCBhbmQgdGhlIHVzZXIgd29uJ3QgYmUgYWJsZSB0byBvcGVuIHRoZSBwYW5lbC5cbiAgICovXG4gIEBJbnB1dCgnbWF0QXV0b2NvbXBsZXRlRGlzYWJsZWQnKVxuICBnZXQgYXV0b2NvbXBsZXRlRGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hdXRvY29tcGxldGVEaXNhYmxlZDsgfVxuICBzZXQgYXV0b2NvbXBsZXRlRGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9hdXRvY29tcGxldGVEaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LCBwcml2YXRlIF9vdmVybGF5OiBPdmVybGF5LFxuICAgICAgICAgICAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSkgc2Nyb2xsU3RyYXRlZ3k6IGFueSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgQEhvc3QoKSBwcml2YXRlIF9mb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUylcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZGVmYXVsdHM/OiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucykge1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gc2Nyb2xsU3RyYXRlZ3k7XG4gIH1cblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBhYm92ZSB0aGUgaW5wdXQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfYWJvdmVDbGFzczogc3RyaW5nO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuX3NldFN0cmF0ZWd5UG9zaXRpb25zKHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kpO1xuXG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCB3aW5kb3cgPSB0aGlzLl9nZXRXaW5kb3coKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLl93aW5kb3dCbHVySGFuZGxlcik7XG4gICAgfVxuXG4gICAgdGhpcy5fdmlld3BvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9jb21wb25lbnREZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX2Rlc3Ryb3lQYW5lbCgpO1xuICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0uY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXlBdHRhY2hlZCAmJiB0aGlzLmF1dG9jb21wbGV0ZS5zaG93UGFuZWw7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxheUF0dGFjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIE9wZW5zIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgb3BlblBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICB0aGlzLl9mbG9hdExhYmVsKCk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgY2xvc2VQYW5lbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNldExhYmVsKCk7XG5cbiAgICBpZiAoIXRoaXMuX292ZXJsYXlBdHRhY2hlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgLy8gT25seSBlbWl0IGlmIHRoZSBwYW5lbCB3YXMgdmlzaWJsZS5cbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmNsb3NlZC5lbWl0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvY29tcGxldGUuX2lzT3BlbiA9IHRoaXMuX292ZXJsYXlBdHRhY2hlZCA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYgJiYgdGhpcy5fb3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaCgpO1xuICAgICAgdGhpcy5fY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgaW4gc29tZSBjYXNlcyB0aGlzIGNhbiBlbmQgdXAgYmVpbmcgY2FsbGVkIGFmdGVyIHRoZSBjb21wb25lbnQgaXMgZGVzdHJveWVkLlxuICAgIC8vIEFkZCBhIGNoZWNrIHRvIGVuc3VyZSB0aGF0IHdlIGRvbid0IHRyeSB0byBydW4gY2hhbmdlIGRldGVjdGlvbiBvbiBhIGRlc3Ryb3llZCB2aWV3LlxuICAgIGlmICghdGhpcy5fY29tcG9uZW50RGVzdHJveWVkKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBtYW51YWxseSwgYmVjYXVzZVxuICAgICAgLy8gYGZyb21FdmVudGAgZG9lc24ndCBzZWVtIHRvIGRvIGl0IGF0IHRoZSBwcm9wZXIgdGltZS5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGF0IHRoZSBsYWJlbCBpcyByZXNldCB3aGVuIHRoZVxuICAgICAgLy8gdXNlciBjbGlja3Mgb3V0c2lkZS5cbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsIHRvIGVuc3VyZSB0aGF0IGl0IGZpdHMgYWxsIG9wdGlvbnNcbiAgICogd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5QXR0YWNoZWQpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgc3RyZWFtIG9mIGFjdGlvbnMgdGhhdCBzaG91bGQgY2xvc2UgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCwgaW5jbHVkaW5nXG4gICAqIHdoZW4gYW4gb3B0aW9uIGlzIHNlbGVjdGVkLCBvbiBibHVyLCBhbmQgd2hlbiBUQUIgaXMgcHJlc3NlZC5cbiAgICovXG4gIGdldCBwYW5lbENsb3NpbmdBY3Rpb25zKCk6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlfG51bGw+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICB0aGlzLm9wdGlvblNlbGVjdGlvbnMsXG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci50YWJPdXQucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSksXG4gICAgICB0aGlzLl9jbG9zZUtleUV2ZW50U3RyZWFtLFxuICAgICAgdGhpcy5fZ2V0T3V0c2lkZUNsaWNrU3RyZWFtKCksXG4gICAgICB0aGlzLl9vdmVybGF5UmVmID9cbiAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmLmRldGFjaG1lbnRzKCkucGlwZShmaWx0ZXIoKCkgPT4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSkgOlxuICAgICAgICAgIG9ic2VydmFibGVPZigpXG4gICAgKS5waXBlKFxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBvdXRwdXQgc28gd2UgcmV0dXJuIGEgY29uc2lzdGVudCB0eXBlLlxuICAgICAgbWFwKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlID8gZXZlbnQgOiBudWxsKVxuICAgICk7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGF1dG9jb21wbGV0ZSBvcHRpb24gc2VsZWN0aW9ucy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zKSB7XG4gICAgICByZXR1cm4gbWVyZ2UoLi4udGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgc3Vic2NyaWJlcnMgYmVmb3JlIGBuZ0FmdGVyVmlld0luaXRgLCB0aGUgYGF1dG9jb21wbGV0ZWAgd2lsbCBiZSB1bmRlZmluZWQuXG4gICAgLy8gUmV0dXJuIGEgc3RyZWFtIHRoYXQgd2UnbGwgcmVwbGFjZSB3aXRoIHRoZSByZWFsIG9uZSBvbmNlIGV2ZXJ5dGhpbmcgaXMgaW4gcGxhY2UuXG4gICAgcmV0dXJuIHRoaXMuX3pvbmUub25TdGFibGVcbiAgICAgICAgLnBpcGUodGFrZSgxKSwgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9ucykpO1xuICB9KSBhcyBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT47XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgYWN0aXZlIG9wdGlvbiwgY29lcmNlZCB0byBNYXRPcHRpb24gdHlwZS4gKi9cbiAgZ2V0IGFjdGl2ZU9wdGlvbigpOiBNYXRPcHRpb24gfCBudWxsIHtcbiAgICBpZiAodGhpcy5hdXRvY29tcGxldGUgJiYgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIFN0cmVhbSBvZiBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICdhdXhjbGljaycpIGFzIE9ic2VydmFibGU8TW91c2VFdmVudD4sXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5fZG9jdW1lbnQsICd0b3VjaGVuZCcpIGFzIE9ic2VydmFibGU8VG91Y2hFdmVudD4pXG4gICAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiB7XG4gICAgICAgICAgLy8gSWYgd2UncmUgaW4gdGhlIFNoYWRvdyBET00sIHRoZSBldmVudCB0YXJnZXQgd2lsbCBiZSB0aGUgc2hhZG93IHJvb3QsIHNvIHdlIGhhdmUgdG9cbiAgICAgICAgICAvLyBmYWxsIGJhY2sgdG8gY2hlY2sgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIHBhdGggb2YgdGhlIGNsaWNrIGV2ZW50LlxuICAgICAgICAgIGNvbnN0IGNsaWNrVGFyZ2V0ID1cbiAgICAgICAgICAgICAgKHRoaXMuX2lzSW5zaWRlU2hhZG93Um9vdCAmJiBldmVudC5jb21wb3NlZFBhdGggPyBldmVudC5jb21wb3NlZFBhdGgoKVswXSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0KSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBjb25zdCBmb3JtRmllbGQgPSB0aGlzLl9mb3JtRmllbGQgPyB0aGlzLl9mb3JtRmllbGQuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA6IG51bGw7XG4gICAgICAgICAgY29uc3QgY3VzdG9tT3JpZ2luID0gdGhpcy5jb25uZWN0ZWRUbyA/IHRoaXMuY29ubmVjdGVkVG8uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiYgY2xpY2tUYXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAgICAgKCFjdXN0b21PcmlnaW4gfHwgIWN1c3RvbU9yaWdpbi5jb250YWlucyhjbGlja1RhcmdldCkpICYmXG4gICAgICAgICAgICAgICghIXRoaXMuX292ZXJsYXlSZWYgJiYgIXRoaXMuX292ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuY29udGFpbnMoY2xpY2tUYXJnZXQpKTtcbiAgICAgICAgfSkpO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpLnRoZW4oKCkgPT4gdGhpcy5fc2V0VHJpZ2dlclZhbHVlKHZhbHVlKSk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLy8gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBDb250cm9sVmFsdWVBY2Nlc3Nvci5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHt9KSB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcblxuICAgIC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIG9uIGFsbCBlc2NhcGUga2V5IHByZXNzZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHkgdG8gYnJpbmcgSUVcbiAgICAvLyBpbiBsaW5lIHdpdGggb3RoZXIgYnJvd3NlcnMuIEJ5IGRlZmF1bHQsIHByZXNzaW5nIGVzY2FwZSBvbiBJRSB3aWxsIGNhdXNlIGl0IHRvIHJldmVydFxuICAgIC8vIHRoZSBpbnB1dCB2YWx1ZSB0byB0aGUgb25lIHRoYXQgaXQgaGFkIG9uIGZvY3VzLCBob3dldmVyIGl0IHdvbid0IGRpc3BhdGNoIGFueSBldmVudHNcbiAgICAvLyB3aGljaCBtZWFucyB0aGF0IHRoZSBtb2RlbCB2YWx1ZSB3aWxsIGJlIG91dCBvZiBzeW5jIHdpdGggdGhlIHZpZXcuXG4gICAgaWYgKGtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbiAmJiBrZXlDb2RlID09PSBFTlRFUiAmJiB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5hY3RpdmVPcHRpb24uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmF1dG9jb21wbGV0ZSkge1xuICAgICAgY29uc3QgcHJldkFjdGl2ZUl0ZW0gPSB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICAgICAgY29uc3QgaXNBcnJvd0tleSA9IGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1c7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsT3BlbiB8fCBrZXlDb2RlID09PSBUQUIpIHtcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiB0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgICAgdGhpcy5vcGVuUGFuZWwoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXJyb3dLZXkgfHwgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSAhPT0gcHJldkFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9PcHRpb24odGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVJbnB1dChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBsZXQgdmFsdWU6IG51bWJlciB8IHN0cmluZyB8IG51bGwgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAvLyBCYXNlZCBvbiBgTnVtYmVyVmFsdWVBY2Nlc3NvcmAgZnJvbSBmb3Jtcy5cbiAgICBpZiAodGFyZ2V0LnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlID09ICcnID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBpbnB1dCBoYXMgYSBwbGFjZWhvbGRlciwgSUUgd2lsbCBmaXJlIHRoZSBgaW5wdXRgIGV2ZW50IG9uIHBhZ2UgbG9hZCxcbiAgICAvLyBmb2N1cyBhbmQgYmx1ciwgaW4gYWRkaXRpb24gdG8gd2hlbiB0aGUgdXNlciBhY3R1YWxseSBjaGFuZ2VkIHRoZSB2YWx1ZS4gVG9cbiAgICAvLyBmaWx0ZXIgb3V0IGFsbCBvZiB0aGUgZXh0cmEgZXZlbnRzLCB3ZSBzYXZlIHRoZSB2YWx1ZSBvbiBmb2N1cyBhbmQgYmV0d2VlblxuICAgIC8vIGBpbnB1dGAgZXZlbnRzLCBhbmQgd2UgY2hlY2sgd2hldGhlciBpdCBjaGFuZ2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84ODU3NDcvXG4gICAgaWYgKHRoaXMuX3ByZXZpb3VzVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl9jYW5PcGVuKCkgJiYgdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZXZlbnQudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMub3BlblBhbmVsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUZvY3VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzKSB7XG4gICAgICB0aGlzLl9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fYXR0YWNoT3ZlcmxheSgpO1xuICAgICAgdGhpcy5fZmxvYXRMYWJlbCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW4gXCJhdXRvXCIgbW9kZSwgdGhlIGxhYmVsIHdpbGwgYW5pbWF0ZSBkb3duIGFzIHNvb24gYXMgZm9jdXMgaXMgbG9zdC5cbiAgICogVGhpcyBjYXVzZXMgdGhlIHZhbHVlIHRvIGp1bXAgd2hlbiBzZWxlY3RpbmcgYW4gb3B0aW9uIHdpdGggdGhlIG1vdXNlLlxuICAgKiBUaGlzIG1ldGhvZCBtYW51YWxseSBmbG9hdHMgdGhlIGxhYmVsIHVudGlsIHRoZSBwYW5lbCBjYW4gYmUgY2xvc2VkLlxuICAgKiBAcGFyYW0gc2hvdWxkQW5pbWF0ZSBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYmUgYW5pbWF0ZWQgd2hlbiBpdCBpcyBmbG9hdGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfZmxvYXRMYWJlbChzaG91bGRBbmltYXRlID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9ybUZpZWxkICYmIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID09PSAnYXV0bycpIHtcbiAgICAgIGlmIChzaG91bGRBbmltYXRlKSB7XG4gICAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fYW5pbWF0ZUFuZExvY2tMYWJlbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYWx3YXlzJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogSWYgdGhlIGxhYmVsIGhhcyBiZWVuIG1hbnVhbGx5IGVsZXZhdGVkLCByZXR1cm4gaXQgdG8gaXRzIG5vcm1hbCBzdGF0ZS4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRMYWJlbCgpOiB2b2lkICB7XG4gICAgaWYgKHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkLmZsb2F0TGFiZWwgPSAnYXV0byc7XG4gICAgICB0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbGlzdGVucyB0byBhIHN0cmVhbSBvZiBwYW5lbCBjbG9zaW5nIGFjdGlvbnMgYW5kIHJlc2V0cyB0aGVcbiAgICogc3RyZWFtIGV2ZXJ5IHRpbWUgdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuXG4gICAqL1xuICBwcml2YXRlIF9zdWJzY3JpYmVUb0Nsb3NpbmdBY3Rpb25zKCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgZmlyc3RTdGFibGUgPSB0aGlzLl96b25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSk7XG4gICAgY29uc3Qgb3B0aW9uQ2hhbmdlcyA9IHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgdGFwKCgpID0+IHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kucmVhcHBseUxhc3RQb3NpdGlvbigpKSxcbiAgICAgIC8vIERlZmVyIGVtaXR0aW5nIHRvIHRoZSBzdHJlYW0gdW50aWwgdGhlIG5leHQgdGljaywgYmVjYXVzZSBjaGFuZ2luZ1xuICAgICAgLy8gYmluZGluZ3MgaW4gaGVyZSB3aWxsIGNhdXNlIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzLlxuICAgICAgZGVsYXkoMClcbiAgICApO1xuXG4gICAgLy8gV2hlbiB0aGUgem9uZSBpcyBzdGFibGUgaW5pdGlhbGx5LCBhbmQgd2hlbiB0aGUgb3B0aW9uIGxpc3QgY2hhbmdlcy4uLlxuICAgIHJldHVybiBtZXJnZShmaXJzdFN0YWJsZSwgb3B0aW9uQ2hhbmdlcylcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgc3RyZWFtIG9mIHBhbmVsQ2xvc2luZ0FjdGlvbnMsIHJlcGxhY2luZyBhbnkgcHJldmlvdXMgc3RyZWFtc1xuICAgICAgICAgICAgLy8gdGhhdCB3ZXJlIGNyZWF0ZWQsIGFuZCBmbGF0dGVuIGl0IHNvIG91ciBzdHJlYW0gb25seSBlbWl0cyBjbG9zaW5nIGV2ZW50cy4uLlxuICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgd2FzT3BlbiA9IHRoaXMucGFuZWxPcGVuO1xuICAgICAgICAgICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX3NldFZpc2liaWxpdHkoKTtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGBwYW5lbE9wZW5gIHN0YXRlIGNoYW5nZWQsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRvIGVtaXQgdGhlIGBvcGVuZWRgXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQsIGJlY2F1c2Ugd2UgbWF5IG5vdCBoYXZlIGVtaXR0ZWQgaXQgd2hlbiB0aGUgcGFuZWwgd2FzIGF0dGFjaGVkLiBUaGlzXG4gICAgICAgICAgICAgICAgLy8gY2FuIGhhcHBlbiBpZiB0aGUgdXNlcnMgb3BlbnMgdGhlIHBhbmVsIGFuZCB0aGVyZSBhcmUgbm8gb3B0aW9ucywgYnV0IHRoZVxuICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMgY29tZSBpbiBzbGlnaHRseSBsYXRlciBvciBhcyBhIHJlc3VsdCBvZiB0aGUgdmFsdWUgY2hhbmdpbmcuXG4gICAgICAgICAgICAgICAgaWYgKHdhc09wZW4gIT09IHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcGVuZWQuZW1pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhbmVsQ2xvc2luZ0FjdGlvbnM7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlIGZpcnN0IGNsb3NpbmcgZXZlbnQgb2NjdXJzLi4uXG4gICAgICAgICAgICB0YWtlKDEpKVxuICAgICAgICAvLyBzZXQgdGhlIHZhbHVlLCBjbG9zZSB0aGUgcGFuZWwsIGFuZCBjb21wbGV0ZS5cbiAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiB0aGlzLl9zZXRWYWx1ZUFuZENsb3NlKGV2ZW50KSk7XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBwcml2YXRlIF9kZXN0cm95UGFuZWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMuY2xvc2VQYW5lbCgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRUcmlnZ2VyVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHRvRGlzcGxheSA9IHRoaXMuYXV0b2NvbXBsZXRlICYmIHRoaXMuYXV0b2NvbXBsZXRlLmRpc3BsYXlXaXRoID9cbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmRpc3BsYXlXaXRoKHZhbHVlKSA6XG4gICAgICB2YWx1ZTtcblxuICAgIC8vIFNpbXBseSBmYWxsaW5nIGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBkaXNwbGF5IHZhbHVlIGlzIGZhbHN5IGRvZXMgbm90IHdvcmsgcHJvcGVybHkuXG4gICAgLy8gVGhlIGRpc3BsYXkgdmFsdWUgY2FuIGFsc28gYmUgdGhlIG51bWJlciB6ZXJvIGFuZCBzaG91bGRuJ3QgZmFsbCBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICBjb25zdCBpbnB1dFZhbHVlID0gdG9EaXNwbGF5ICE9IG51bGwgPyB0b0Rpc3BsYXkgOiAnJztcblxuICAgIC8vIElmIGl0J3MgdXNlZCB3aXRoaW4gYSBgTWF0Rm9ybUZpZWxkYCwgd2Ugc2hvdWxkIHNldCBpdCB0aHJvdWdoIHRoZSBwcm9wZXJ0eSBzbyBpdCBjYW4gZ29cbiAgICAvLyB0aHJvdWdoIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkLl9jb250cm9sLnZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl9wcmV2aW91c1ZhbHVlID0gaW5wdXRWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBjbG9zZXMgdGhlIHBhbmVsLCBhbmQgaWYgYSB2YWx1ZSBpcyBzcGVjaWZpZWQsIGFsc28gc2V0cyB0aGUgYXNzb2NpYXRlZFxuICAgKiBjb250cm9sIHRvIHRoYXQgdmFsdWUuIEl0IHdpbGwgYWxzbyBtYXJrIHRoZSBjb250cm9sIGFzIGRpcnR5IGlmIHRoaXMgaW50ZXJhY3Rpb25cbiAgICogc3RlbW1lZCBmcm9tIHRoZSB1c2VyLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0VmFsdWVBbmRDbG9zZShldmVudDogTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlIHwgbnVsbCk6IHZvaWQge1xuICAgIGlmIChldmVudCAmJiBldmVudC5zb3VyY2UpIHtcbiAgICAgIHRoaXMuX2NsZWFyUHJldmlvdXNTZWxlY3RlZE9wdGlvbihldmVudC5zb3VyY2UpO1xuICAgICAgdGhpcy5fc2V0VHJpZ2dlclZhbHVlKGV2ZW50LnNvdXJjZS52YWx1ZSk7XG4gICAgICB0aGlzLl9vbkNoYW5nZShldmVudC5zb3VyY2UudmFsdWUpO1xuICAgICAgdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5fZW1pdFNlbGVjdEV2ZW50KGV2ZW50LnNvdXJjZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZVBhbmVsKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYW55IHByZXZpb3VzIHNlbGVjdGVkIG9wdGlvbiBhbmQgZW1pdCBhIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgZm9yIHRoaXMgb3B0aW9uXG4gICAqL1xuICBwcml2YXRlIF9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24oc2tpcDogTWF0T3B0aW9uKSB7XG4gICAgdGhpcy5hdXRvY29tcGxldGUub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBpZiAob3B0aW9uICE9PSBza2lwICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGFjaE92ZXJsYXkoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmF1dG9jb21wbGV0ZSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIHJlc29sdmUgdGhpcyBvbmNlLCBhcyBsYXRlIGFzIHBvc3NpYmxlIHNvIHRoYXQgd2UgY2FuIGJlXG4gICAgLy8gc3VyZSB0aGF0IHRoZSBlbGVtZW50IGhhcyBiZWVuIG1vdmVkIGludG8gaXRzIGZpbmFsIHBsYWNlIGluIHRoZSBET00uXG4gICAgaWYgKHRoaXMuX2lzSW5zaWRlU2hhZG93Um9vdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9pc0luc2lkZVNoYWRvd1Jvb3QgPSAhIV9nZXRTaGFkb3dSb290KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgbGV0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuXG4gICAgaWYgKCFvdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5hdXRvY29tcGxldGUudGVtcGxhdGUsXG4gICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHtpZDogdGhpcy5fZm9ybUZpZWxkPy5fbGFiZWxJZH0pO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcblxuICAgICAgLy8gVXNlIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gdGFrZSBhZHZhbnRhZ2Ugb2ZcbiAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAvLyBDbG9zZSB3aGVuIHByZXNzaW5nIEVTQ0FQRSBvciBBTFQgKyBVUF9BUlJPVywgYmFzZWQgb24gdGhlIGExMXkgZ3VpZGVsaW5lcy5cbiAgICAgICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgICAgICBpZiAoKGV2ZW50LmtleUNvZGUgPT09IEVTQ0FQRSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgICAgICAgKGV2ZW50LmtleUNvZGUgPT09IFVQX0FSUk9XICYmIGhhc01vZGlmaWVyS2V5KGV2ZW50LCAnYWx0S2V5JykpKSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24sIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBldmVudHVhbGx5XG4gICAgICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0VmlzaWJpbGl0eSgpO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSB0aGlzLl9vdmVybGF5QXR0YWNoZWQgPSB0cnVlO1xuXG4gICAgLy8gV2UgbmVlZCB0byBkbyBhbiBleHRyYSBgcGFuZWxPcGVuYCBjaGVjayBpbiBoZXJlLCBiZWNhdXNlIHRoZVxuICAgIC8vIGF1dG9jb21wbGV0ZSB3b24ndCBiZSBzaG93biBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgd2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wZW5lZC5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpcixcbiAgICAgIHBhbmVsQ2xhc3M6IHRoaXMuX2RlZmF1bHRzPy5vdmVybGF5UGFuZWxDbGFzcyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE92ZXJsYXlQb3NpdGlvbigpOiBQb3NpdGlvblN0cmF0ZWd5IHtcbiAgICBjb25zdCBzdHJhdGVneSA9IHRoaXMuX292ZXJsYXkucG9zaXRpb24oKVxuICAgICAgLmZsZXhpYmxlQ29ubmVjdGVkVG8odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKVxuICAgICAgLndpdGhGbGV4aWJsZURpbWVuc2lvbnMoZmFsc2UpXG4gICAgICAud2l0aFB1c2goZmFsc2UpO1xuXG4gICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnMoc3RyYXRlZ3kpO1xuICAgIHRoaXMuX3Bvc2l0aW9uU3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICByZXR1cm4gc3RyYXRlZ3k7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgcG9zaXRpb25zIG9uIGEgcG9zaXRpb24gc3RyYXRlZ3kgYmFzZWQgb24gdGhlIGRpcmVjdGl2ZSdzIGlucHV0IHN0YXRlLiAqL1xuICBwcml2YXRlIF9zZXRTdHJhdGVneVBvc2l0aW9ucyhwb3NpdGlvblN0cmF0ZWd5OiBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3kpIHtcbiAgICAvLyBOb3RlIHRoYXQgd2UgcHJvdmlkZSBob3Jpem9udGFsIGZhbGxiYWNrIHBvc2l0aW9ucywgZXZlbiB0aG91Z2ggYnkgZGVmYXVsdCB0aGUgZHJvcGRvd25cbiAgICAvLyB3aWR0aCBtYXRjaGVzIHRoZSBpbnB1dCwgYmVjYXVzZSBjb25zdW1lcnMgY2FuIG92ZXJyaWRlIHRoZSB3aWR0aC4gU2VlICMxODg1NC5cbiAgICBjb25zdCBiZWxvd1Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAnYm90dG9tJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAndG9wJ30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAndG9wJ31cbiAgICBdO1xuXG4gICAgLy8gVGhlIG92ZXJsYXkgZWRnZSBjb25uZWN0ZWQgdG8gdGhlIHRyaWdnZXIgc2hvdWxkIGhhdmUgc3F1YXJlZCBjb3JuZXJzLCB3aGlsZVxuICAgIC8vIHRoZSBvcHBvc2l0ZSBlbmQgaGFzIHJvdW5kZWQgY29ybmVycy4gV2UgYXBwbHkgYSBDU1MgY2xhc3MgdG8gc3dhcCB0aGVcbiAgICAvLyBib3JkZXItcmFkaXVzIGJhc2VkIG9uIHRoZSBvdmVybGF5IHBvc2l0aW9uLlxuICAgIGNvbnN0IHBhbmVsQ2xhc3MgPSB0aGlzLl9hYm92ZUNsYXNzO1xuICAgIGNvbnN0IGFib3ZlUG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ3RvcCcsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICdib3R0b20nLCBwYW5lbENsYXNzfVxuICAgIF07XG5cbiAgICBsZXQgcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdO1xuXG4gICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICdhYm92ZScpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGFib3ZlUG9zaXRpb25zO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2JlbG93Jykge1xuICAgICAgcG9zaXRpb25zID0gYmVsb3dQb3NpdGlvbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9ucyA9IFsuLi5iZWxvd1Bvc2l0aW9ucywgLi4uYWJvdmVQb3NpdGlvbnNdO1xuICAgIH1cblxuICAgIHBvc2l0aW9uU3RyYXRlZ3kud2l0aFBvc2l0aW9ucyhwb3NpdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29ubmVjdGVkRWxlbWVudCgpOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGVkVG8pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFuZWxXaWR0aCgpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5wYW5lbFdpZHRoIHx8IHRoaXMuX2dldEhvc3RXaWR0aCgpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBpbnB1dCBlbGVtZW50LCBzbyB0aGUgcGFuZWwgd2lkdGggY2FuIG1hdGNoIGl0LiAqL1xuICBwcml2YXRlIF9nZXRIb3N0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBhY3RpdmUgaXRlbSB0byAtMSBzbyBhcnJvdyBldmVudHMgd2lsbCBhY3RpdmF0ZSB0aGVcbiAgICogY29ycmVjdCBvcHRpb25zLCBvciB0byAwIGlmIHRoZSBjb25zdW1lciBvcHRlZCBpbnRvIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzZXRBY3RpdmVJdGVtKCk6IHZvaWQge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odGhpcy5hdXRvY29tcGxldGUuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID8gMCA6IC0xKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhbmVsIGNhbiBiZSBvcGVuZWQuICovXG4gIHByaXZhdGUgX2Nhbk9wZW4oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gIWVsZW1lbnQucmVhZE9ubHkgJiYgIWVsZW1lbnQuZGlzYWJsZWQgJiYgIXRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Py5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICAvKiogU2Nyb2xscyB0byBhIHBhcnRpY3VsYXIgb3B0aW9uIGluIHRoZSBsaXN0LiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb09wdGlvbihpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gR2l2ZW4gdGhhdCB3ZSBhcmUgbm90IGFjdHVhbGx5IGZvY3VzaW5nIGFjdGl2ZSBvcHRpb25zLCB3ZSBtdXN0IG1hbnVhbGx5IGFkanVzdCBzY3JvbGxcbiAgICAvLyB0byByZXZlYWwgb3B0aW9ucyBiZWxvdyB0aGUgZm9sZC4gRmlyc3QsIHdlIGZpbmQgdGhlIG9mZnNldCBvZiB0aGUgb3B0aW9uIGZyb20gdGhlIHRvcFxuICAgIC8vIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYmVsb3cgdGhlIGZvbGQsIHRoZSBuZXcgc2Nyb2xsVG9wIHdpbGwgYmUgdGhlIG9mZnNldCAtXG4gICAgLy8gdGhlIHBhbmVsIGhlaWdodCArIHRoZSBvcHRpb24gaGVpZ2h0LCBzbyB0aGUgYWN0aXZlIG9wdGlvbiB3aWxsIGJlIGp1c3QgdmlzaWJsZSBhdCB0aGVcbiAgICAvLyBib3R0b20gb2YgdGhlIHBhbmVsLiBJZiB0aGF0IG9mZnNldCBpcyBhYm92ZSB0aGUgdG9wIG9mIHRoZSB2aXNpYmxlIHBhbmVsLCB0aGUgbmV3IHNjcm9sbFRvcFxuICAgIC8vIHdpbGwgYmVjb21lIHRoZSBvZmZzZXQuIElmIHRoYXQgb2Zmc2V0IGlzIHZpc2libGUgd2l0aGluIHRoZSBwYW5lbCBhbHJlYWR5LCB0aGUgc2Nyb2xsVG9wIGlzXG4gICAgLy8gbm90IGFkanVzdGVkLlxuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IHRoaXMuYXV0b2NvbXBsZXRlO1xuICAgIGNvbnN0IGxhYmVsQ291bnQgPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihpbmRleCxcbiAgICAgIGF1dG9jb21wbGV0ZS5vcHRpb25zLCBhdXRvY29tcGxldGUub3B0aW9uR3JvdXBzKTtcblxuICAgIGlmIChpbmRleCA9PT0gMCAmJiBsYWJlbENvdW50ID09PSAxKSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBnb3Qgb25lIGdyb3VwIGxhYmVsIGJlZm9yZSB0aGUgb3B0aW9uIGFuZCB3ZSdyZSBhdCB0aGUgdG9wIG9wdGlvbixcbiAgICAgIC8vIHNjcm9sbCB0aGUgbGlzdCB0byB0aGUgdG9wLiBUaGlzIGlzIGJldHRlciBVWCB0aGFuIHNjcm9sbGluZyB0aGUgbGlzdCB0byB0aGVcbiAgICAgIC8vIHRvcCBvZiB0aGUgb3B0aW9uLCBiZWNhdXNlIGl0IGFsbG93cyB0aGUgdXNlciB0byByZWFkIHRoZSB0b3AgZ3JvdXAncyBsYWJlbC5cbiAgICAgIGF1dG9jb21wbGV0ZS5fc2V0U2Nyb2xsVG9wKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBhdXRvY29tcGxldGUub3B0aW9ucy50b0FycmF5KClbaW5kZXhdO1xuXG4gICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBvcHRpb24uX2dldEhvc3RFbGVtZW50KCk7XG4gICAgICAgIGNvbnN0IG5ld1Njcm9sbFBvc2l0aW9uID0gX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uKFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIGF1dG9jb21wbGV0ZS5fZ2V0U2Nyb2xsVG9wKCksXG4gICAgICAgICAgYXV0b2NvbXBsZXRlLnBhbmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgYXV0b2NvbXBsZXRlLl9zZXRTY3JvbGxUb3AobmV3U2Nyb2xsUG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvY29tcGxldGVEaXNhYmxlZDogQm9vbGVhbklucHV0O1xufVxuXG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogYGlucHV0W21hdEF1dG9jb21wbGV0ZV0sIHRleHRhcmVhW21hdEF1dG9jb21wbGV0ZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1hdXRvY29tcGxldGUtdHJpZ2dlcicsXG4gICAgJ1thdHRyLmF1dG9jb21wbGV0ZV0nOiAnYXV0b2NvbXBsZXRlQXR0cmlidXRlJyxcbiAgICAnW2F0dHIucm9sZV0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogXCJjb21ib2JveFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICcocGFuZWxPcGVuICYmIGFjdGl2ZU9wdGlvbikgPyBhY3RpdmVPcHRpb24uaWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnYXV0b2NvbXBsZXRlRGlzYWJsZWQgPyBudWxsIDogcGFuZWxPcGVuLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJyhhdXRvY29tcGxldGVEaXNhYmxlZCB8fCAhcGFuZWxPcGVuKSA/IG51bGwgOiBhdXRvY29tcGxldGU/LmlkJyxcbiAgICAnW2F0dHIuYXJpYS1oYXNwb3B1cF0nOiAnIWF1dG9jb21wbGV0ZURpc2FibGVkJyxcbiAgICAvLyBOb3RlOiB3ZSB1c2UgYGZvY3VzaW5gLCBhcyBvcHBvc2VkIHRvIGBmb2N1c2AsIGluIG9yZGVyIHRvIG9wZW4gdGhlIHBhbmVsXG4gICAgLy8gYSBsaXR0bGUgZWFybGllci4gVGhpcyBhdm9pZHMgaXNzdWVzIHdoZXJlIElFIGRlbGF5cyB0aGUgZm9jdXNpbmcgb2YgdGhlIGlucHV0LlxuICAgICcoZm9jdXNpbiknOiAnX2hhbmRsZUZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJyxcbiAgICAnKGlucHV0KSc6ICdfaGFuZGxlSW5wdXQoJGV2ZW50KScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgfSxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGVUcmlnZ2VyJyxcbiAgcHJvdmlkZXJzOiBbTUFUX0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlVHJpZ2dlciBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVUcmlnZ2VyQmFzZSB7XG4gIHByb3RlY3RlZCBfYWJvdmVDbGFzcyA9ICdtYXQtYXV0b2NvbXBsZXRlLXBhbmVsLWFib3ZlJztcbn1cbiJdfQ==