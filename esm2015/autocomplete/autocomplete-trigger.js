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
import { MatAutocomplete } from './autocomplete';
import { MatAutocompleteOrigin } from './autocomplete-origin';
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the scrollTop of the panel. Because we are not
 * actually focusing the active item, scroll must be handled manually.
 */
/** The height of each autocomplete option. */
export const AUTOCOMPLETE_OPTION_HEIGHT = 48;
/** The total height of the autocomplete panel. */
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
let MatAutocompleteTrigger = /** @class */ (() => {
    class MatAutocompleteTrigger {
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
                    .asObservable()
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
            return merge(fromEvent(this._document, 'click'), fromEvent(this._document, 'touchend'))
                .pipe(filter(event => {
                // If we're in the Shadow DOM, the event target will be the shadow root, so we have to
                // fall back to check the first element in the path of the click event.
                const clickTarget = (this._isInsideShadowRoot && event.composedPath ? event.composedPath()[0] :
                    event.target);
                const formField = this._formField ? this._formField._elementRef.nativeElement : null;
                return this._overlayAttached && clickTarget !== this._element.nativeElement &&
                    (!formField || !formField.contains(clickTarget)) &&
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
            if (keyCode === ESCAPE) {
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
                    this._scrollToOption();
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
         * Given that we are not actually focusing active options, we must manually adjust scroll
         * to reveal options below the fold. First, we find the offset of the option from the top
         * of the panel. If that offset is below the fold, the new scrollTop will be the offset -
         * the panel height + the option height, so the active option will be just visible at the
         * bottom of the panel. If that offset is above the top of the visible panel, the new scrollTop
         * will become the offset. If that offset is visible within the panel already, the scrollTop is
         * not adjusted.
         */
        _scrollToOption() {
            const index = this.autocomplete._keyManager.activeItemIndex || 0;
            const labelCount = _countGroupLabelsBeforeOption(index, this.autocomplete.options, this.autocomplete.optionGroups);
            if (index === 0 && labelCount === 1) {
                // If we've got one group label before the option and we're at the top option,
                // scroll the list to the top. This is better UX than scrolling the list to the
                // top of the option, because it allows the user to read the top group's label.
                this.autocomplete._setScrollTop(0);
            }
            else {
                const newScrollPosition = _getOptionScrollPosition(index + labelCount, AUTOCOMPLETE_OPTION_HEIGHT, this.autocomplete._getScrollTop(), AUTOCOMPLETE_PANEL_HEIGHT);
                this.autocomplete._setScrollTop(newScrollPosition);
            }
        }
        /**
         * This method listens to a stream of panel closing actions and resets the
         * stream every time the option list changes.
         */
        _subscribeToClosingActions() {
            const firstStable = this._zone.onStable.asObservable().pipe(take(1));
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
                if (option != skip && option.selected) {
                    option.deselect();
                }
            });
        }
        _attachOverlay() {
            if (!this.autocomplete) {
                throw getMatAutocompleteMissingPanelError();
            }
            // We want to resolve this once, as late as possible so that we can be
            // sure that the element has been moved into its final place in the DOM.
            if (this._isInsideShadowRoot == null) {
                this._isInsideShadowRoot = !!_getShadowRoot(this._element.nativeElement);
            }
            let overlayRef = this._overlayRef;
            if (!overlayRef) {
                this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
                overlayRef = this._overlay.create(this._getOverlayConfig());
                this._overlayRef = overlayRef;
                // Use the `keydownEvents` in order to take advantage of
                // the overlay event targeting provided by the CDK overlay.
                overlayRef.keydownEvents().subscribe(event => {
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
                direction: this._dir
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
            const panelClass = 'mat-autocomplete-panel-above';
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
        { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }, { type: Host }] },
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
    return MatAutocompleteTrigger;
})();
export { MatAutocompleteTrigger };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLXRyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS10cmlnZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9FLE9BQU8sRUFFTCxPQUFPLEVBQ1AsYUFBYSxHQUtkLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsSUFBSSxFQUNKLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsZ0JBQWdCLEdBR2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsNkJBQTZCLEVBQzdCLHdCQUF3QixFQUV4Qix3QkFBd0IsR0FDekIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsY0FBYyxFQUFFLFlBQVksRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzFF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c0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0RPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFRBQiwgVVBfQVJST1d9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBGbGV4aWJsZUNvbm5lY3RlZFBvc2l0aW9uU3RyYXRlZ3ksXG4gIE92ZXJsYXksXG4gIE92ZXJsYXlDb25maWcsXG4gIE92ZXJsYXlSZWYsXG4gIFBvc2l0aW9uU3RyYXRlZ3ksXG4gIFNjcm9sbFN0cmF0ZWd5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtfZ2V0U2hhZG93Um9vdH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG4gIE1hdE9wdGlvbixcbiAgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBmcm9tRXZlbnQsIG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIG1hcCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtNYXRBdXRvY29tcGxldGV9IGZyb20gJy4vYXV0b2NvbXBsZXRlJztcbmltcG9ydCB7TWF0QXV0b2NvbXBsZXRlT3JpZ2lufSBmcm9tICcuL2F1dG9jb21wbGV0ZS1vcmlnaW4nO1xuXG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgc2Nyb2xsVG9wIG9mIHRoZSBwYW5lbC4gQmVjYXVzZSB3ZSBhcmUgbm90XG4gKiBhY3R1YWxseSBmb2N1c2luZyB0aGUgYWN0aXZlIGl0ZW0sIHNjcm9sbCBtdXN0IGJlIGhhbmRsZWQgbWFudWFsbHkuXG4gKi9cblxuLyoqIFRoZSBoZWlnaHQgb2YgZWFjaCBhdXRvY29tcGxldGUgb3B0aW9uLiAqL1xuZXhwb3J0IGNvbnN0IEFVVE9DT01QTEVURV9PUFRJT05fSEVJR0hUID0gNDg7XG5cbi8qKiBUaGUgdG90YWwgaGVpZ2h0IG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG5leHBvcnQgY29uc3QgQVVUT0NPTVBMRVRFX1BBTkVMX0hFSUdIVCA9IDI1NjtcblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGRldGVybWluZXMgdGhlIHNjcm9sbCBoYW5kbGluZyB3aGlsZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1hdXRvY29tcGxldGUtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1lfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfQVVUT0NPTVBMRVRFX1NDUk9MTF9TVFJBVEVHWV9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBQcm92aWRlciB0aGF0IGFsbG93cyB0aGUgYXV0b2NvbXBsZXRlIHRvIHJlZ2lzdGVyIGFzIGEgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXRBdXRvY29tcGxldGVUcmlnZ2VyKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBlcnJvciB0byBiZSB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIHVzZSBhbiBhdXRvY29tcGxldGUgdHJpZ2dlciB3aXRob3V0IGEgcGFuZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXRBdXRvY29tcGxldGVNaXNzaW5nUGFuZWxFcnJvcigpOiBFcnJvciB7XG4gIHJldHVybiBFcnJvcignQXR0ZW1wdGluZyB0byBvcGVuIGFuIHVuZGVmaW5lZCBpbnN0YW5jZSBvZiBgbWF0LWF1dG9jb21wbGV0ZWAuICcgK1xuICAgICAgICAgICAgICAgJ01ha2Ugc3VyZSB0aGF0IHRoZSBpZCBwYXNzZWQgdG8gdGhlIGBtYXRBdXRvY29tcGxldGVgIGlzIGNvcnJlY3QgYW5kIHRoYXQgJyArXG4gICAgICAgICAgICAgICAneW91XFwncmUgYXR0ZW1wdGluZyB0byBvcGVuIGl0IGFmdGVyIHRoZSBuZ0FmdGVyQ29udGVudEluaXQgaG9vay4nKTtcbn1cblxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBpbnB1dFttYXRBdXRvY29tcGxldGVdLCB0ZXh0YXJlYVttYXRBdXRvY29tcGxldGVdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYXV0b2NvbXBsZXRlLXRyaWdnZXInLFxuICAgICdbYXR0ci5hdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZUF0dHJpYnV0ZScsXG4gICAgJ1thdHRyLnJvbGVdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IFwiY29tYm9ib3hcIicsXG4gICAgJ1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGVEaXNhYmxlZCA/IG51bGwgOiBcImxpc3RcIicsXG4gICAgJ1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiAnKHBhbmVsT3BlbiAmJiBhY3RpdmVPcHRpb24pID8gYWN0aXZlT3B0aW9uLmlkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2F1dG9jb21wbGV0ZURpc2FibGVkID8gbnVsbCA6IHBhbmVsT3Blbi50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICcoYXV0b2NvbXBsZXRlRGlzYWJsZWQgfHwgIXBhbmVsT3BlbikgPyBudWxsIDogYXV0b2NvbXBsZXRlPy5pZCcsXG4gICAgJ1thdHRyLmFyaWEtaGFzcG9wdXBdJzogJyFhdXRvY29tcGxldGVEaXNhYmxlZCcsXG4gICAgLy8gTm90ZTogd2UgdXNlIGBmb2N1c2luYCwgYXMgb3Bwb3NlZCB0byBgZm9jdXNgLCBpbiBvcmRlciB0byBvcGVuIHRoZSBwYW5lbFxuICAgIC8vIGEgbGl0dGxlIGVhcmxpZXIuIFRoaXMgYXZvaWRzIGlzc3VlcyB3aGVyZSBJRSBkZWxheXMgdGhlIGZvY3VzaW5nIG9mIHRoZSBpbnB1dC5cbiAgICAnKGZvY3VzaW4pJzogJ19oYW5kbGVGb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKScsXG4gICAgJyhpbnB1dCknOiAnX2hhbmRsZUlucHV0KCRldmVudCknLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gIH0sXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlVHJpZ2dlcicsXG4gIHByb3ZpZGVyczogW01BVF9BVVRPQ09NUExFVEVfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZVRyaWdnZXIgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9vdmVybGF5UmVmOiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgcHJpdmF0ZSBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcbiAgcHJpdmF0ZSBfY29tcG9uZW50RGVzdHJveWVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2F1dG9jb21wbGV0ZURpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogT2xkIHZhbHVlIG9mIHRoZSBuYXRpdmUgaW5wdXQuIFVzZWQgdG8gd29yayBhcm91bmQgaXNzdWVzIHdpdGggdGhlIGBpbnB1dGAgZXZlbnQgb24gSUUuICovXG4gIHByaXZhdGUgX3ByZXZpb3VzVmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG5cbiAgLyoqIFN0cmF0ZWd5IHRoYXQgaXMgdXNlZCB0byBwb3NpdGlvbiB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneTtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIGxhYmVsIHN0YXRlIGlzIGJlaW5nIG92ZXJyaWRkZW4uICovXG4gIHByaXZhdGUgX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc3Vic2NyaXB0aW9uIGZvciBjbG9zaW5nIGFjdGlvbnMgKHNvbWUgYXJlIGJvdW5kIHRvIGRvY3VtZW50KS4gKi9cbiAgcHJpdmF0ZSBfY2xvc2luZ0FjdGlvbnNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHZpZXdwb3J0IHNpemUgY2hhbmdlcy4gKi9cbiAgcHJpdmF0ZSBfdmlld3BvcnRTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBjYW4gb3BlbiB0aGUgbmV4dCB0aW1lIGl0IGlzIGZvY3VzZWQuIFVzZWQgdG8gcHJldmVudCBhIGZvY3VzZWQsXG4gICAqIGNsb3NlZCBhdXRvY29tcGxldGUgZnJvbSBiZWluZyByZW9wZW5lZCBpZiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhbm90aGVyIGJyb3dzZXIgdGFiIGFuZCB0aGVuXG4gICAqIGNvbWVzIGJhY2suXG4gICAqL1xuICBwcml2YXRlIF9jYW5PcGVuT25OZXh0Rm9jdXMgPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIGluc2lkZSBvZiBhIFNoYWRvd1Jvb3QgY29tcG9uZW50LiAqL1xuICBwcml2YXRlIF9pc0luc2lkZVNoYWRvd1Jvb3Q6IGJvb2xlYW47XG5cbiAgLyoqIFN0cmVhbSBvZiBrZXlib2FyZCBldmVudHMgdGhhdCBjYW4gY2xvc2UgdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbG9zZUtleUV2ZW50U3RyZWFtID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3Igd2hlbiB0aGUgd2luZG93IGlzIGJsdXJyZWQuIE5lZWRzIHRvIGJlIGFuXG4gICAqIGFycm93IGZ1bmN0aW9uIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0LlxuICAgKi9cbiAgcHJpdmF0ZSBfd2luZG93Qmx1ckhhbmRsZXIgPSAoKSA9PiB7XG4gICAgLy8gSWYgdGhlIHVzZXIgYmx1cnJlZCB0aGUgd2luZG93IHdoaWxlIHRoZSBhdXRvY29tcGxldGUgaXMgZm9jdXNlZCwgaXQgbWVhbnMgdGhhdCBpdCdsbCBiZVxuICAgIC8vIHJlZm9jdXNlZCB3aGVuIHRoZXkgY29tZSBiYWNrLiBJbiB0aGlzIGNhc2Ugd2Ugd2FudCB0byBza2lwIHRoZSBmaXJzdCBmb2N1cyBldmVudCwgaWYgdGhlXG4gICAgLy8gcGFuZSB3YXMgY2xvc2VkLCBpbiBvcmRlciB0byBhdm9pZCByZW9wZW5pbmcgaXQgdW5pbnRlbnRpb25hbGx5LlxuICAgIHRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cyA9XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCB8fCB0aGlzLnBhbmVsT3BlbjtcbiAgfVxuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiB2YWx1ZSBjaGFuZ2VzYCAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIGF1dG9jb21wbGV0ZSBoYXMgYmVlbiB0b3VjaGVkYCAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIFRoZSBhdXRvY29tcGxldGUgcGFuZWwgdG8gYmUgYXR0YWNoZWQgdG8gdGhpcyB0cmlnZ2VyLiAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZScpIGF1dG9jb21wbGV0ZTogTWF0QXV0b2NvbXBsZXRlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHJlbGF0aXZlIHRvIHRoZSB0cmlnZ2VyIGVsZW1lbnQuIEEgcG9zaXRpb24gb2YgYGF1dG9gXG4gICAqIHdpbGwgcmVuZGVyIHRoZSBwYW5lbCB1bmRlcm5lYXRoIHRoZSB0cmlnZ2VyIGlmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBmb3IgaXQgdG8gZml0IGluXG4gICAqIHRoZSB2aWV3cG9ydCwgb3RoZXJ3aXNlIHRoZSBwYW5lbCB3aWxsIGJlIHNob3duIGFib3ZlIGl0LiBJZiB0aGUgcG9zaXRpb24gaXMgc2V0IHRvXG4gICAqIGBhYm92ZWAgb3IgYGJlbG93YCwgdGhlIHBhbmVsIHdpbGwgYWx3YXlzIGJlIHNob3duIGFib3ZlIG9yIGJlbG93IHRoZSB0cmlnZ2VyLiBubyBtYXR0ZXJcbiAgICogd2hldGhlciBpdCBmaXRzIGNvbXBsZXRlbHkgaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVQb3NpdGlvbicpIHBvc2l0aW9uOiAnYXV0bycgfCAnYWJvdmUnIHwgJ2JlbG93JyA9ICdhdXRvJztcblxuICAvKipcbiAgICogUmVmZXJlbmNlIHJlbGF0aXZlIHRvIHdoaWNoIHRvIHBvc2l0aW9uIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuXG4gICAqIERlZmF1bHRzIHRvIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBlbGVtZW50LlxuICAgKi9cbiAgQElucHV0KCdtYXRBdXRvY29tcGxldGVDb25uZWN0ZWRUbycpIGNvbm5lY3RlZFRvOiBNYXRBdXRvY29tcGxldGVPcmlnaW47XG5cbiAgLyoqXG4gICAqIGBhdXRvY29tcGxldGVgIGF0dHJpYnV0ZSB0byBiZSBzZXQgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBJbnB1dCgnYXV0b2NvbXBsZXRlJykgYXV0b2NvbXBsZXRlQXR0cmlidXRlOiBzdHJpbmcgPSAnb2ZmJztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIGlzIGRpc2FibGVkLiBXaGVuIGRpc2FibGVkLCB0aGUgZWxlbWVudCB3aWxsXG4gICAqIGFjdCBhcyBhIHJlZ3VsYXIgaW5wdXQgYW5kIHRoZSB1c2VyIHdvbid0IGJlIGFibGUgdG8gb3BlbiB0aGUgcGFuZWwuXG4gICAqL1xuICBASW5wdXQoJ21hdEF1dG9jb21wbGV0ZURpc2FibGVkJylcbiAgZ2V0IGF1dG9jb21wbGV0ZURpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fYXV0b2NvbXBsZXRlRGlzYWJsZWQ7IH1cbiAgc2V0IGF1dG9jb21wbGV0ZURpc2FibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXV0b2NvbXBsZXRlRGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PiwgcHJpdmF0ZSBfb3ZlcmxheTogT3ZlcmxheSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgICAgICAgICAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIEBIb3N0KCkgcHJpdmF0ZSBfZm9ybUZpZWxkOiBNYXRGb3JtRmllbGQsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIpIHtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHNjcm9sbFN0cmF0ZWd5O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgdGhpcy5fd2luZG93Qmx1ckhhbmRsZXIpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiYgdGhpcy5fcG9zaXRpb25TdHJhdGVneSkge1xuICAgICAgdGhpcy5fc2V0U3RyYXRlZ3lQb3NpdGlvbnModGhpcy5fcG9zaXRpb25TdHJhdGVneSk7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICB0aGlzLl9vdmVybGF5UmVmIS51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2dldFdpbmRvdygpO1xuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuX3dpbmRvd0JsdXJIYW5kbGVyKTtcbiAgICB9XG5cbiAgICB0aGlzLl92aWV3cG9ydFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2NvbXBvbmVudERlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5fZGVzdHJveVBhbmVsKCk7XG4gICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3ZlcmxheUF0dGFjaGVkICYmIHRoaXMuYXV0b2NvbXBsZXRlLnNob3dQYW5lbDtcbiAgfVxuICBwcml2YXRlIF9vdmVybGF5QXR0YWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogT3BlbnMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBvcGVuUGFuZWwoKTogdm9pZCB7XG4gICAgdGhpcy5fYXR0YWNoT3ZlcmxheSgpO1xuICAgIHRoaXMuX2Zsb2F0TGFiZWwoKTtcbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIGF1dG9jb21wbGV0ZSBzdWdnZXN0aW9uIHBhbmVsLiAqL1xuICBjbG9zZVBhbmVsKCk6IHZvaWQge1xuICAgIHRoaXMuX3Jlc2V0TGFiZWwoKTtcblxuICAgIGlmICghdGhpcy5fb3ZlcmxheUF0dGFjaGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAvLyBPbmx5IGVtaXQgaWYgdGhlIHBhbmVsIHdhcyB2aXNpYmxlLlxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuY2xvc2VkLmVtaXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5faXNPcGVuID0gdGhpcy5fb3ZlcmxheUF0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fb3ZlcmxheVJlZiAmJiB0aGlzLl9vdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNoKCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCBpbiBzb21lIGNhc2VzIHRoaXMgY2FuIGVuZCB1cCBiZWluZyBjYWxsZWQgYWZ0ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgLy8gQWRkIGEgY2hlY2sgdG8gZW5zdXJlIHRoYXQgd2UgZG9uJ3QgdHJ5IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG9uIGEgZGVzdHJveWVkIHZpZXcuXG4gICAgaWYgKCF0aGlzLl9jb21wb25lbnREZXN0cm95ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5LCBiZWNhdXNlXG4gICAgICAvLyBgZnJvbUV2ZW50YCBkb2Vzbid0IHNlZW0gdG8gZG8gaXQgYXQgdGhlIHByb3BlciB0aW1lLlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGxhYmVsIGlzIHJlc2V0IHdoZW4gdGhlXG4gICAgICAvLyB1c2VyIGNsaWNrcyBvdXRzaWRlLlxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgYXV0b2NvbXBsZXRlIHN1Z2dlc3Rpb24gcGFuZWwgdG8gZW5zdXJlIHRoYXQgaXQgZml0cyBhbGwgb3B0aW9uc1xuICAgKiB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgdXBkYXRlUG9zaXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX292ZXJsYXlBdHRhY2hlZCkge1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSBzdHJlYW0gb2YgYWN0aW9ucyB0aGF0IHNob3VsZCBjbG9zZSB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLCBpbmNsdWRpbmdcbiAgICogd2hlbiBhbiBvcHRpb24gaXMgc2VsZWN0ZWQsIG9uIGJsdXIsIGFuZCB3aGVuIFRBQiBpcyBwcmVzc2VkLlxuICAgKi9cbiAgZ2V0IHBhbmVsQ2xvc2luZ0FjdGlvbnMoKTogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2V8bnVsbD4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgIHRoaXMub3B0aW9uU2VsZWN0aW9ucyxcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKSxcbiAgICAgIHRoaXMuX2Nsb3NlS2V5RXZlbnRTdHJlYW0sXG4gICAgICB0aGlzLl9nZXRPdXRzaWRlQ2xpY2tTdHJlYW0oKSxcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYgP1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGV0YWNobWVudHMoKS5waXBlKGZpbHRlcigoKSA9PiB0aGlzLl9vdmVybGF5QXR0YWNoZWQpKSA6XG4gICAgICAgICAgb2JzZXJ2YWJsZU9mKClcbiAgICApLnBpcGUoXG4gICAgICAvLyBOb3JtYWxpemUgdGhlIG91dHB1dCBzbyB3ZSByZXR1cm4gYSBjb25zaXN0ZW50IHR5cGUuXG4gICAgICBtYXAoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UgPyBldmVudCA6IG51bGwpXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTdHJlYW0gb2YgYXV0b2NvbXBsZXRlIG9wdGlvbiBzZWxlY3Rpb25zLiAqL1xuICByZWFkb25seSBvcHRpb25TZWxlY3Rpb25zOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT4gPSBkZWZlcigoKSA9PiB7XG4gICAgaWYgKHRoaXMuYXV0b2NvbXBsZXRlICYmIHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMpIHtcbiAgICAgcmV0dXJuIG1lcmdlKC4uLnRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24ub25TZWxlY3Rpb25DaGFuZ2UpKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgYW55IHN1YnNjcmliZXJzIGJlZm9yZSBgbmdBZnRlclZpZXdJbml0YCwgdGhlIGBhdXRvY29tcGxldGVgIHdpbGwgYmUgdW5kZWZpbmVkLlxuICAgIC8vIFJldHVybiBhIHN0cmVhbSB0aGF0IHdlJ2xsIHJlcGxhY2Ugd2l0aCB0aGUgcmVhbCBvbmUgb25jZSBldmVyeXRoaW5nIGlzIGluIHBsYWNlLlxuICAgIHJldHVybiB0aGlzLl96b25lLm9uU3RhYmxlXG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5vcHRpb25TZWxlY3Rpb25zKSk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogVGhlIGN1cnJlbnRseSBhY3RpdmUgb3B0aW9uLCBjb2VyY2VkIHRvIE1hdE9wdGlvbiB0eXBlLiAqL1xuICBnZXQgYWN0aXZlT3B0aW9uKCk6IE1hdE9wdGlvbiB8IG51bGwge1xuICAgIGlmICh0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogU3RyZWFtIG9mIGNsaWNrcyBvdXRzaWRlIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIHByaXZhdGUgX2dldE91dHNpZGVDbGlja1N0cmVhbSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PixcbiAgICAgICAgICAgICAgIGZyb21FdmVudCh0aGlzLl9kb2N1bWVudCwgJ3RvdWNoZW5kJykgYXMgT2JzZXJ2YWJsZTxUb3VjaEV2ZW50PilcbiAgICAgICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IHtcbiAgICAgICAgICAvLyBJZiB3ZSdyZSBpbiB0aGUgU2hhZG93IERPTSwgdGhlIGV2ZW50IHRhcmdldCB3aWxsIGJlIHRoZSBzaGFkb3cgcm9vdCwgc28gd2UgaGF2ZSB0b1xuICAgICAgICAgIC8vIGZhbGwgYmFjayB0byBjaGVjayB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgcGF0aCBvZiB0aGUgY2xpY2sgZXZlbnQuXG4gICAgICAgICAgY29uc3QgY2xpY2tUYXJnZXQgPVxuICAgICAgICAgICAgICAodGhpcy5faXNJbnNpZGVTaGFkb3dSb290ICYmIGV2ZW50LmNvbXBvc2VkUGF0aCA/IGV2ZW50LmNvbXBvc2VkUGF0aCgpWzBdIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGZvcm1GaWVsZCA9IHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgICAgICAgIHJldHVybiB0aGlzLl9vdmVybGF5QXR0YWNoZWQgJiYgY2xpY2tUYXJnZXQgIT09IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgICAoIWZvcm1GaWVsZCB8fCAhZm9ybUZpZWxkLmNvbnRhaW5zKGNsaWNrVGFyZ2V0KSkgJiZcbiAgICAgICAgICAgICAgKCEhdGhpcy5fb3ZlcmxheVJlZiAmJiAhdGhpcy5fb3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5jb250YWlucyhjbGlja1RhcmdldCkpO1xuICAgICAgICB9KSk7XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbCkudGhlbigoKSA9PiB0aGlzLl9zZXRUcmlnZ2VyVmFsdWUodmFsdWUpKTtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvLyBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIENvbnRyb2xWYWx1ZUFjY2Vzc29yLlxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8vIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgQ29udHJvbFZhbHVlQWNjZXNzb3IuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gIH1cblxuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuXG4gICAgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBhY3Rpb24gb24gYWxsIGVzY2FwZSBrZXkgcHJlc3Nlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseSB0byBicmluZyBJRVxuICAgIC8vIGluIGxpbmUgd2l0aCBvdGhlciBicm93c2Vycy4gQnkgZGVmYXVsdCwgcHJlc3NpbmcgZXNjYXBlIG9uIElFIHdpbGwgY2F1c2UgaXQgdG8gcmV2ZXJ0XG4gICAgLy8gdGhlIGlucHV0IHZhbHVlIHRvIHRoZSBvbmUgdGhhdCBpdCBoYWQgb24gZm9jdXMsIGhvd2V2ZXIgaXQgd29uJ3QgZGlzcGF0Y2ggYW55IGV2ZW50c1xuICAgIC8vIHdoaWNoIG1lYW5zIHRoYXQgdGhlIG1vZGVsIHZhbHVlIHdpbGwgYmUgb3V0IG9mIHN5bmMgd2l0aCB0aGUgdmlldy5cbiAgICBpZiAoa2V5Q29kZSA9PT0gRVNDQVBFKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFjdGl2ZU9wdGlvbiAmJiBrZXlDb2RlID09PSBFTlRFUiAmJiB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5hY3RpdmVPcHRpb24uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB0aGlzLl9yZXNldEFjdGl2ZUl0ZW0oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmF1dG9jb21wbGV0ZSkge1xuICAgICAgY29uc3QgcHJldkFjdGl2ZUl0ZW0gPSB0aGlzLmF1dG9jb21wbGV0ZS5fa2V5TWFuYWdlci5hY3RpdmVJdGVtO1xuICAgICAgY29uc3QgaXNBcnJvd0tleSA9IGtleUNvZGUgPT09IFVQX0FSUk9XIHx8IGtleUNvZGUgPT09IERPV05fQVJST1c7XG5cbiAgICAgIGlmICh0aGlzLnBhbmVsT3BlbiB8fCBrZXlDb2RlID09PSBUQUIpIHtcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiB0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgICAgdGhpcy5vcGVuUGFuZWwoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQXJyb3dLZXkgfHwgdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSAhPT0gcHJldkFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9PcHRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfaGFuZGxlSW5wdXQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgbGV0IHZhbHVlOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgLy8gQmFzZWQgb24gYE51bWJlclZhbHVlQWNjZXNzb3JgIGZyb20gZm9ybXMuXG4gICAgaWYgKHRhcmdldC50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgaW5wdXQgaGFzIGEgcGxhY2Vob2xkZXIsIElFIHdpbGwgZmlyZSB0aGUgYGlucHV0YCBldmVudCBvbiBwYWdlIGxvYWQsXG4gICAgLy8gZm9jdXMgYW5kIGJsdXIsIGluIGFkZGl0aW9uIHRvIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgY2hhbmdlZCB0aGUgdmFsdWUuIFRvXG4gICAgLy8gZmlsdGVyIG91dCBhbGwgb2YgdGhlIGV4dHJhIGV2ZW50cywgd2Ugc2F2ZSB0aGUgdmFsdWUgb24gZm9jdXMgYW5kIGJldHdlZW5cbiAgICAvLyBgaW5wdXRgIGV2ZW50cywgYW5kIHdlIGNoZWNrIHdoZXRoZXIgaXQgY2hhbmdlZC5cbiAgICAvLyBTZWU6IGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODg1NzQ3L1xuICAgIGlmICh0aGlzLl9wcmV2aW91c1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fb25DaGFuZ2UodmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5fY2FuT3BlbigpICYmIHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICB0aGlzLm9wZW5QYW5lbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVGb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2Nhbk9wZW5Pbk5leHRGb2N1cykge1xuICAgICAgdGhpcy5fY2FuT3Blbk9uTmV4dEZvY3VzID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgIHRoaXMuX2F0dGFjaE92ZXJsYXkoKTtcbiAgICAgIHRoaXMuX2Zsb2F0TGFiZWwodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluIFwiYXV0b1wiIG1vZGUsIHRoZSBsYWJlbCB3aWxsIGFuaW1hdGUgZG93biBhcyBzb29uIGFzIGZvY3VzIGlzIGxvc3QuXG4gICAqIFRoaXMgY2F1c2VzIHRoZSB2YWx1ZSB0byBqdW1wIHdoZW4gc2VsZWN0aW5nIGFuIG9wdGlvbiB3aXRoIHRoZSBtb3VzZS5cbiAgICogVGhpcyBtZXRob2QgbWFudWFsbHkgZmxvYXRzIHRoZSBsYWJlbCB1bnRpbCB0aGUgcGFuZWwgY2FuIGJlIGNsb3NlZC5cbiAgICogQHBhcmFtIHNob3VsZEFuaW1hdGUgV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGJlIGFuaW1hdGVkIHdoZW4gaXQgaXMgZmxvYXRlZC5cbiAgICovXG4gIHByaXZhdGUgX2Zsb2F0TGFiZWwoc2hvdWxkQW5pbWF0ZSA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Zvcm1GaWVsZCAmJiB0aGlzLl9mb3JtRmllbGQuZmxvYXRMYWJlbCA9PT0gJ2F1dG8nKSB7XG4gICAgICBpZiAoc2hvdWxkQW5pbWF0ZSkge1xuICAgICAgICB0aGlzLl9mb3JtRmllbGQuX2FuaW1hdGVBbmRMb2NrTGFiZWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID0gJ2Fsd2F5cyc7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21hbnVhbGx5RmxvYXRpbmdMYWJlbCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIElmIHRoZSBsYWJlbCBoYXMgYmVlbiBtYW51YWxseSBlbGV2YXRlZCwgcmV0dXJuIGl0IHRvIGl0cyBub3JtYWwgc3RhdGUuICovXG4gIHByaXZhdGUgX3Jlc2V0TGFiZWwoKTogdm9pZCAge1xuICAgIGlmICh0aGlzLl9tYW51YWxseUZsb2F0aW5nTGFiZWwpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5mbG9hdExhYmVsID0gJ2F1dG8nO1xuICAgICAgdGhpcy5fbWFudWFsbHlGbG9hdGluZ0xhYmVsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHRoYXQgd2UgYXJlIG5vdCBhY3R1YWxseSBmb2N1c2luZyBhY3RpdmUgb3B0aW9ucywgd2UgbXVzdCBtYW51YWxseSBhZGp1c3Qgc2Nyb2xsXG4gICAqIHRvIHJldmVhbCBvcHRpb25zIGJlbG93IHRoZSBmb2xkLiBGaXJzdCwgd2UgZmluZCB0aGUgb2Zmc2V0IG9mIHRoZSBvcHRpb24gZnJvbSB0aGUgdG9wXG4gICAqIG9mIHRoZSBwYW5lbC4gSWYgdGhhdCBvZmZzZXQgaXMgYmVsb3cgdGhlIGZvbGQsIHRoZSBuZXcgc2Nyb2xsVG9wIHdpbGwgYmUgdGhlIG9mZnNldCAtXG4gICAqIHRoZSBwYW5lbCBoZWlnaHQgKyB0aGUgb3B0aW9uIGhlaWdodCwgc28gdGhlIGFjdGl2ZSBvcHRpb24gd2lsbCBiZSBqdXN0IHZpc2libGUgYXQgdGhlXG4gICAqIGJvdHRvbSBvZiB0aGUgcGFuZWwuIElmIHRoYXQgb2Zmc2V0IGlzIGFib3ZlIHRoZSB0b3Agb2YgdGhlIHZpc2libGUgcGFuZWwsIHRoZSBuZXcgc2Nyb2xsVG9wXG4gICAqIHdpbGwgYmVjb21lIHRoZSBvZmZzZXQuIElmIHRoYXQgb2Zmc2V0IGlzIHZpc2libGUgd2l0aGluIHRoZSBwYW5lbCBhbHJlYWR5LCB0aGUgc2Nyb2xsVG9wIGlzXG4gICAqIG5vdCBhZGp1c3RlZC5cbiAgICovXG4gIHByaXZhdGUgX3Njcm9sbFRvT3B0aW9uKCk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5hdXRvY29tcGxldGUuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDA7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGluZGV4LFxuICAgICAgICB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zLCB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25Hcm91cHMpO1xuXG4gICAgaWYgKGluZGV4ID09PSAwICYmIGxhYmVsQ291bnQgPT09IDEpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGdvdCBvbmUgZ3JvdXAgbGFiZWwgYmVmb3JlIHRoZSBvcHRpb24gYW5kIHdlJ3JlIGF0IHRoZSB0b3Agb3B0aW9uLFxuICAgICAgLy8gc2Nyb2xsIHRoZSBsaXN0IHRvIHRoZSB0b3AuIFRoaXMgaXMgYmV0dGVyIFVYIHRoYW4gc2Nyb2xsaW5nIHRoZSBsaXN0IHRvIHRoZVxuICAgICAgLy8gdG9wIG9mIHRoZSBvcHRpb24sIGJlY2F1c2UgaXQgYWxsb3dzIHRoZSB1c2VyIHRvIHJlYWQgdGhlIHRvcCBncm91cCdzIGxhYmVsLlxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbmV3U2Nyb2xsUG9zaXRpb24gPSBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICAgIGluZGV4ICsgbGFiZWxDb3VudCxcbiAgICAgICAgQVVUT0NPTVBMRVRFX09QVElPTl9IRUlHSFQsXG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9nZXRTY3JvbGxUb3AoKSxcbiAgICAgICAgQVVUT0NPTVBMRVRFX1BBTkVMX0hFSUdIVFxuICAgICAgKTtcblxuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX3NldFNjcm9sbFRvcChuZXdTY3JvbGxQb3NpdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGxpc3RlbnMgdG8gYSBzdHJlYW0gb2YgcGFuZWwgY2xvc2luZyBhY3Rpb25zIGFuZCByZXNldHMgdGhlXG4gICAqIHN0cmVhbSBldmVyeSB0aW1lIHRoZSBvcHRpb24gbGlzdCBjaGFuZ2VzLlxuICAgKi9cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9DbG9zaW5nQWN0aW9ucygpOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IGZpcnN0U3RhYmxlID0gdGhpcy5fem9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpO1xuICAgIGNvbnN0IG9wdGlvbkNoYW5nZXMgPSB0aGlzLmF1dG9jb21wbGV0ZS5vcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgIHRhcCgoKSA9PiB0aGlzLl9wb3NpdGlvblN0cmF0ZWd5LnJlYXBwbHlMYXN0UG9zaXRpb24oKSksXG4gICAgICAvLyBEZWZlciBlbWl0dGluZyB0byB0aGUgc3RyZWFtIHVudGlsIHRoZSBuZXh0IHRpY2ssIGJlY2F1c2UgY2hhbmdpbmdcbiAgICAgIC8vIGJpbmRpbmdzIGluIGhlcmUgd2lsbCBjYXVzZSBcImNoYW5nZWQgYWZ0ZXIgY2hlY2tlZFwiIGVycm9ycy5cbiAgICAgIGRlbGF5KDApXG4gICAgKTtcblxuICAgIC8vIFdoZW4gdGhlIHpvbmUgaXMgc3RhYmxlIGluaXRpYWxseSwgYW5kIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGNoYW5nZXMuLi5cbiAgICByZXR1cm4gbWVyZ2UoZmlyc3RTdGFibGUsIG9wdGlvbkNoYW5nZXMpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgbmV3IHN0cmVhbSBvZiBwYW5lbENsb3NpbmdBY3Rpb25zLCByZXBsYWNpbmcgYW55IHByZXZpb3VzIHN0cmVhbXNcbiAgICAgICAgICAgIC8vIHRoYXQgd2VyZSBjcmVhdGVkLCBhbmQgZmxhdHRlbiBpdCBzbyBvdXIgc3RyZWFtIG9ubHkgZW1pdHMgY2xvc2luZyBldmVudHMuLi5cbiAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHdhc09wZW4gPSB0aGlzLnBhbmVsT3BlbjtcbiAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9zZXRWaXNpYmlsaXR5KCk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3ZlcmxheVJlZiEudXBkYXRlUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBgcGFuZWxPcGVuYCBzdGF0ZSBjaGFuZ2VkLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0byBlbWl0IHRoZSBgb3BlbmVkYFxuICAgICAgICAgICAgICAgIC8vIGV2ZW50LCBiZWNhdXNlIHdlIG1heSBub3QgaGF2ZSBlbWl0dGVkIGl0IHdoZW4gdGhlIHBhbmVsIHdhcyBhdHRhY2hlZC4gVGhpc1xuICAgICAgICAgICAgICAgIC8vIGNhbiBoYXBwZW4gaWYgdGhlIHVzZXJzIG9wZW5zIHRoZSBwYW5lbCBhbmQgdGhlcmUgYXJlIG5vIG9wdGlvbnMsIGJ1dCB0aGVcbiAgICAgICAgICAgICAgICAvLyBvcHRpb25zIGNvbWUgaW4gc2xpZ2h0bHkgbGF0ZXIgb3IgYXMgYSByZXN1bHQgb2YgdGhlIHZhbHVlIGNoYW5naW5nLlxuICAgICAgICAgICAgICAgIGlmICh3YXNPcGVuICE9PSB0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUub3BlbmVkLmVtaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYW5lbENsb3NpbmdBY3Rpb25zO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAvLyB3aGVuIHRoZSBmaXJzdCBjbG9zaW5nIGV2ZW50IG9jY3Vycy4uLlxuICAgICAgICAgICAgdGFrZSgxKSlcbiAgICAgICAgLy8gc2V0IHRoZSB2YWx1ZSwgY2xvc2UgdGhlIHBhbmVsLCBhbmQgY29tcGxldGUuXG4gICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4gdGhpcy5fc2V0VmFsdWVBbmRDbG9zZShldmVudCkpO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBhdXRvY29tcGxldGUgc3VnZ2VzdGlvbiBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveVBhbmVsKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLmNsb3NlUGFuZWwoKTtcbiAgICAgIHRoaXMuX292ZXJsYXlSZWYuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5fb3ZlcmxheVJlZiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VHJpZ2dlclZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB0b0Rpc3BsYXkgPSB0aGlzLmF1dG9jb21wbGV0ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aCA/XG4gICAgICB0aGlzLmF1dG9jb21wbGV0ZS5kaXNwbGF5V2l0aCh2YWx1ZSkgOlxuICAgICAgdmFsdWU7XG5cbiAgICAvLyBTaW1wbHkgZmFsbGluZyBiYWNrIHRvIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgZGlzcGxheSB2YWx1ZSBpcyBmYWxzeSBkb2VzIG5vdCB3b3JrIHByb3Blcmx5LlxuICAgIC8vIFRoZSBkaXNwbGF5IHZhbHVlIGNhbiBhbHNvIGJlIHRoZSBudW1iZXIgemVybyBhbmQgc2hvdWxkbid0IGZhbGwgYmFjayB0byBhbiBlbXB0eSBzdHJpbmcuXG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IHRvRGlzcGxheSAhPSBudWxsID8gdG9EaXNwbGF5IDogJyc7XG5cbiAgICAvLyBJZiBpdCdzIHVzZWQgd2l0aGluIGEgYE1hdEZvcm1GaWVsZGAsIHdlIHNob3VsZCBzZXQgaXQgdGhyb3VnaCB0aGUgcHJvcGVydHkgc28gaXQgY2FuIGdvXG4gICAgLy8gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgIGlmICh0aGlzLl9mb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX2Zvcm1GaWVsZC5fY29udHJvbC52YWx1ZSA9IGlucHV0VmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC52YWx1ZSA9IGlucHV0VmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJldmlvdXNWYWx1ZSA9IGlucHV0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY2xvc2VzIHRoZSBwYW5lbCwgYW5kIGlmIGEgdmFsdWUgaXMgc3BlY2lmaWVkLCBhbHNvIHNldHMgdGhlIGFzc29jaWF0ZWRcbiAgICogY29udHJvbCB0byB0aGF0IHZhbHVlLiBJdCB3aWxsIGFsc28gbWFyayB0aGUgY29udHJvbCBhcyBkaXJ0eSBpZiB0aGlzIGludGVyYWN0aW9uXG4gICAqIHN0ZW1tZWQgZnJvbSB0aGUgdXNlci5cbiAgICovXG4gIHByaXZhdGUgX3NldFZhbHVlQW5kQ2xvc2UoZXZlbnQ6IE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQuc291cmNlKSB7XG4gICAgICB0aGlzLl9jbGVhclByZXZpb3VzU2VsZWN0ZWRPcHRpb24oZXZlbnQuc291cmNlKTtcbiAgICAgIHRoaXMuX3NldFRyaWdnZXJWYWx1ZShldmVudC5zb3VyY2UudmFsdWUpO1xuICAgICAgdGhpcy5fb25DaGFuZ2UoZXZlbnQuc291cmNlLnZhbHVlKTtcbiAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5hdXRvY29tcGxldGUuX2VtaXRTZWxlY3RFdmVudChldmVudC5zb3VyY2UpO1xuICAgIH1cblxuICAgIHRoaXMuY2xvc2VQYW5lbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFueSBwcmV2aW91cyBzZWxlY3RlZCBvcHRpb24gYW5kIGVtaXQgYSBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50IGZvciB0aGlzIG9wdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBfY2xlYXJQcmV2aW91c1NlbGVjdGVkT3B0aW9uKHNraXA6IE1hdE9wdGlvbikge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbiAhPSBza2lwICYmIG9wdGlvbi5zZWxlY3RlZCkge1xuICAgICAgICBvcHRpb24uZGVzZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGFjaE92ZXJsYXkoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmF1dG9jb21wbGV0ZSkge1xuICAgICAgdGhyb3cgZ2V0TWF0QXV0b2NvbXBsZXRlTWlzc2luZ1BhbmVsRXJyb3IoKTtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIHJlc29sdmUgdGhpcyBvbmNlLCBhcyBsYXRlIGFzIHBvc3NpYmxlIHNvIHRoYXQgd2UgY2FuIGJlXG4gICAgLy8gc3VyZSB0aGF0IHRoZSBlbGVtZW50IGhhcyBiZWVuIG1vdmVkIGludG8gaXRzIGZpbmFsIHBsYWNlIGluIHRoZSBET00uXG4gICAgaWYgKHRoaXMuX2lzSW5zaWRlU2hhZG93Um9vdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9pc0luc2lkZVNoYWRvd1Jvb3QgPSAhIV9nZXRTaGFkb3dSb290KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuXG4gICAgbGV0IG92ZXJsYXlSZWYgPSB0aGlzLl9vdmVybGF5UmVmO1xuXG4gICAgaWYgKCFvdmVybGF5UmVmKSB7XG4gICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5hdXRvY29tcGxldGUudGVtcGxhdGUsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICAgICAgb3ZlcmxheVJlZiA9IHRoaXMuX292ZXJsYXkuY3JlYXRlKHRoaXMuX2dldE92ZXJsYXlDb25maWcoKSk7XG4gICAgICB0aGlzLl9vdmVybGF5UmVmID0gb3ZlcmxheVJlZjtcblxuICAgICAgLy8gVXNlIHRoZSBga2V5ZG93bkV2ZW50c2AgaW4gb3JkZXIgdG8gdGFrZSBhZHZhbnRhZ2Ugb2ZcbiAgICAgIC8vIHRoZSBvdmVybGF5IGV2ZW50IHRhcmdldGluZyBwcm92aWRlZCBieSB0aGUgQ0RLIG92ZXJsYXkuXG4gICAgICBvdmVybGF5UmVmLmtleWRvd25FdmVudHMoKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAvLyBDbG9zZSB3aGVuIHByZXNzaW5nIEVTQ0FQRSBvciBBTFQgKyBVUF9BUlJPVywgYmFzZWQgb24gdGhlIGExMXkgZ3VpZGVsaW5lcy5cbiAgICAgICAgLy8gU2VlOiBodHRwczovL3d3dy53My5vcmcvVFIvd2FpLWFyaWEtcHJhY3RpY2VzLTEuMS8jdGV4dGJveC1rZXlib2FyZC1pbnRlcmFjdGlvblxuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFIHx8IChldmVudC5rZXlDb2RlID09PSBVUF9BUlJPVyAmJiBldmVudC5hbHRLZXkpKSB7XG4gICAgICAgICAgdGhpcy5fcmVzZXRBY3RpdmVJdGVtKCk7XG4gICAgICAgICAgdGhpcy5fY2xvc2VLZXlFdmVudFN0cmVhbS5uZXh0KCk7XG5cbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHN0b3AgcHJvcGFnYXRpb24sIG90aGVyd2lzZSB0aGUgZXZlbnQgd2lsbCBldmVudHVhbGx5XG4gICAgICAgICAgLy8gcmVhY2ggdGhlIGlucHV0IGl0c2VsZiBhbmQgY2F1c2UgdGhlIG92ZXJsYXkgdG8gYmUgcmVvcGVuZWQuXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3ZpZXdwb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgb3ZlcmxheVJlZikge1xuICAgICAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSB0cmlnZ2VyLCBwYW5lbCB3aWR0aCBhbmQgZGlyZWN0aW9uLCBpbiBjYXNlIGFueXRoaW5nIGhhcyBjaGFuZ2VkLlxuICAgICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneS5zZXRPcmlnaW4odGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpKTtcbiAgICAgIG92ZXJsYXlSZWYudXBkYXRlU2l6ZSh7d2lkdGg6IHRoaXMuX2dldFBhbmVsV2lkdGgoKX0pO1xuICAgIH1cblxuICAgIGlmIChvdmVybGF5UmVmICYmICFvdmVybGF5UmVmLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgIG92ZXJsYXlSZWYuYXR0YWNoKHRoaXMuX3BvcnRhbCk7XG4gICAgICB0aGlzLl9jbG9zaW5nQWN0aW9uc1N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvQ2xvc2luZ0FjdGlvbnMoKTtcbiAgICB9XG5cbiAgICBjb25zdCB3YXNPcGVuID0gdGhpcy5wYW5lbE9wZW47XG5cbiAgICB0aGlzLmF1dG9jb21wbGV0ZS5fc2V0VmlzaWJpbGl0eSgpO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9pc09wZW4gPSB0aGlzLl9vdmVybGF5QXR0YWNoZWQgPSB0cnVlO1xuXG4gICAgLy8gV2UgbmVlZCB0byBkbyBhbiBleHRyYSBgcGFuZWxPcGVuYCBjaGVjayBpbiBoZXJlLCBiZWNhdXNlIHRoZVxuICAgIC8vIGF1dG9jb21wbGV0ZSB3b24ndCBiZSBzaG93biBpZiB0aGVyZSBhcmUgbm8gb3B0aW9ucy5cbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgd2FzT3BlbiAhPT0gdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLm9wZW5lZC5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5fZ2V0T3ZlcmxheVBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5fc2Nyb2xsU3RyYXRlZ3koKSxcbiAgICAgIHdpZHRoOiB0aGlzLl9nZXRQYW5lbFdpZHRoKCksXG4gICAgICBkaXJlY3Rpb246IHRoaXMuX2RpclxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0T3ZlcmxheVBvc2l0aW9uKCk6IFBvc2l0aW9uU3RyYXRlZ3kge1xuICAgIGNvbnN0IHN0cmF0ZWd5ID0gdGhpcy5fb3ZlcmxheS5wb3NpdGlvbigpXG4gICAgICAuZmxleGlibGVDb25uZWN0ZWRUbyh0aGlzLl9nZXRDb25uZWN0ZWRFbGVtZW50KCkpXG4gICAgICAud2l0aEZsZXhpYmxlRGltZW5zaW9ucyhmYWxzZSlcbiAgICAgIC53aXRoUHVzaChmYWxzZSk7XG5cbiAgICB0aGlzLl9zZXRTdHJhdGVneVBvc2l0aW9ucyhzdHJhdGVneSk7XG4gICAgdGhpcy5fcG9zaXRpb25TdHJhdGVneSA9IHN0cmF0ZWd5O1xuICAgIHJldHVybiBzdHJhdGVneTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBwb3NpdGlvbnMgb24gYSBwb3NpdGlvbiBzdHJhdGVneSBiYXNlZCBvbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXQgc3RhdGUuICovXG4gIHByaXZhdGUgX3NldFN0cmF0ZWd5UG9zaXRpb25zKHBvc2l0aW9uU3RyYXRlZ3k6IEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSkge1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBwcm92aWRlIGhvcml6b250YWwgZmFsbGJhY2sgcG9zaXRpb25zLCBldmVuIHRob3VnaCBieSBkZWZhdWx0IHRoZSBkcm9wZG93blxuICAgIC8vIHdpZHRoIG1hdGNoZXMgdGhlIGlucHV0LCBiZWNhdXNlIGNvbnN1bWVycyBjYW4gb3ZlcnJpZGUgdGhlIHdpZHRoLiBTZWUgIzE4ODU0LlxuICAgIGNvbnN0IGJlbG93UG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgICAge29yaWdpblg6ICdzdGFydCcsIG9yaWdpblk6ICdib3R0b20nLCBvdmVybGF5WDogJ3N0YXJ0Jywgb3ZlcmxheVk6ICd0b3AnfSxcbiAgICAgIHtvcmlnaW5YOiAnZW5kJywgb3JpZ2luWTogJ2JvdHRvbScsIG92ZXJsYXlYOiAnZW5kJywgb3ZlcmxheVk6ICd0b3AnfVxuICAgIF07XG5cbiAgICAvLyBUaGUgb3ZlcmxheSBlZGdlIGNvbm5lY3RlZCB0byB0aGUgdHJpZ2dlciBzaG91bGQgaGF2ZSBzcXVhcmVkIGNvcm5lcnMsIHdoaWxlXG4gICAgLy8gdGhlIG9wcG9zaXRlIGVuZCBoYXMgcm91bmRlZCBjb3JuZXJzLiBXZSBhcHBseSBhIENTUyBjbGFzcyB0byBzd2FwIHRoZVxuICAgIC8vIGJvcmRlci1yYWRpdXMgYmFzZWQgb24gdGhlIG92ZXJsYXkgcG9zaXRpb24uXG4gICAgY29uc3QgcGFuZWxDbGFzcyA9ICdtYXQtYXV0b2NvbXBsZXRlLXBhbmVsLWFib3ZlJztcbiAgICBjb25zdCBhYm92ZVBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICAgIHtvcmlnaW5YOiAnc3RhcnQnLCBvcmlnaW5ZOiAndG9wJywgb3ZlcmxheVg6ICdzdGFydCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc30sXG4gICAgICB7b3JpZ2luWDogJ2VuZCcsIG9yaWdpblk6ICd0b3AnLCBvdmVybGF5WDogJ2VuZCcsIG92ZXJsYXlZOiAnYm90dG9tJywgcGFuZWxDbGFzc31cbiAgICBdO1xuXG4gICAgbGV0IHBvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnYWJvdmUnKSB7XG4gICAgICBwb3NpdGlvbnMgPSBhYm92ZVBvc2l0aW9ucztcbiAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdiZWxvdycpIHtcbiAgICAgIHBvc2l0aW9ucyA9IGJlbG93UG9zaXRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbnMgPSBbLi4uYmVsb3dQb3NpdGlvbnMsIC4uLmFib3ZlUG9zaXRpb25zXTtcbiAgICB9XG5cbiAgICBwb3NpdGlvblN0cmF0ZWd5LndpdGhQb3NpdGlvbnMocG9zaXRpb25zKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbm5lY3RlZEVsZW1lbnQoKTogRWxlbWVudFJlZiB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGVkVG8pIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3RlZFRvLmVsZW1lbnRSZWY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1GaWVsZCA/IHRoaXMuX2Zvcm1GaWVsZC5nZXRDb25uZWN0ZWRPdmVybGF5T3JpZ2luKCkgOiB0aGlzLl9lbGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFuZWxXaWR0aCgpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmF1dG9jb21wbGV0ZS5wYW5lbFdpZHRoIHx8IHRoaXMuX2dldEhvc3RXaWR0aCgpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHdpZHRoIG9mIHRoZSBpbnB1dCBlbGVtZW50LCBzbyB0aGUgcGFuZWwgd2lkdGggY2FuIG1hdGNoIGl0LiAqL1xuICBwcml2YXRlIF9nZXRIb3N0V2lkdGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0Q29ubmVjdGVkRWxlbWVudCgpLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBhY3RpdmUgaXRlbSB0byAtMSBzbyBhcnJvdyBldmVudHMgd2lsbCBhY3RpdmF0ZSB0aGVcbiAgICogY29ycmVjdCBvcHRpb25zLCBvciB0byAwIGlmIHRoZSBjb25zdW1lciBvcHRlZCBpbnRvIGl0LlxuICAgKi9cbiAgcHJpdmF0ZSBfcmVzZXRBY3RpdmVJdGVtKCk6IHZvaWQge1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odGhpcy5hdXRvY29tcGxldGUuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID8gMCA6IC0xKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHBhbmVsIGNhbiBiZSBvcGVuZWQuICovXG4gIHByaXZhdGUgX2Nhbk9wZW4oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICByZXR1cm4gIWVsZW1lbnQucmVhZE9ubHkgJiYgIWVsZW1lbnQuZGlzYWJsZWQgJiYgIXRoaXMuX2F1dG9jb21wbGV0ZURpc2FibGVkO1xuICB9XG5cbiAgLyoqIFVzZSBkZWZhdWx0VmlldyBvZiBpbmplY3RlZCBkb2N1bWVudCBpZiBhdmFpbGFibGUgb3IgZmFsbGJhY2sgdG8gZ2xvYmFsIHdpbmRvdyByZWZlcmVuY2UgKi9cbiAgcHJpdmF0ZSBfZ2V0V2luZG93KCk6IFdpbmRvdyB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Py5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b2NvbXBsZXRlRGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==