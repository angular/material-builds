/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, END, ENTER, hasModifierKey, HOME, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, Overlay, } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, isDevMode, NgZone, Optional, Output, QueryList, Self, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, ErrorStateMatcher, MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, mixinDisabled, mixinDisableRipple, mixinErrorState, mixinTabIndex, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { defer, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, takeUntil, } from 'rxjs/operators';
import { matSelectAnimations } from './select-animations';
import { getMatSelectDynamicMultipleError, getMatSelectNonArrayValueError, getMatSelectNonFunctionValueError, } from './select-errors';
let nextUniqueId = 0;
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */
/** The max height of the select's overlay panel */
export const SELECT_PANEL_MAX_HEIGHT = 256;
/** The panel's padding on the x-axis */
export const SELECT_PANEL_PADDING_X = 16;
/** The panel's x axis padding if it is indented (e.g. there is an option group). */
export const SELECT_PANEL_INDENT_PADDING_X = SELECT_PANEL_PADDING_X * 2;
/** The height of the select items in `em` units. */
export const SELECT_ITEM_HEIGHT_EM = 3;
// TODO(josephperrott): Revert to a constant after 2018 spec updates are fully merged.
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * Calculated as:
 * (SELECT_PANEL_PADDING_X * 1.5) + 16 = 40
 * The padding is multiplied by 1.5 because the checkbox's margin is half the padding.
 * The checkbox width is 16px.
 */
export const SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_PANEL_PADDING_X * 1.5 + 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
export const SELECT_PANEL_VIEWPORT_PADDING = 8;
/** Injection token that determines the scroll handling while a select is open. */
export const MAT_SELECT_SCROLL_STRATEGY = new InjectionToken('mat-select-scroll-strategy');
/** @docs-private */
export function MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay) {
    return () => overlay.scrollStrategies.reposition();
}
/** Injection token that can be used to provide the default options the select module. */
export const MAT_SELECT_CONFIG = new InjectionToken('MAT_SELECT_CONFIG');
/** @docs-private */
export const MAT_SELECT_SCROLL_STRATEGY_PROVIDER = {
    provide: MAT_SELECT_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
/** Change event object that is emitted when the select value has changed. */
export class MatSelectChange {
    constructor(
    /** Reference to the select that emitted the change event. */
    source, 
    /** Current value of the select that emitted the event. */
    value) {
        this.source = source;
        this.value = value;
    }
}
// Boilerplate for applying mixins to MatSelect.
/** @docs-private */
class MatSelectBase {
    constructor(_elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) {
        this._elementRef = _elementRef;
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}
const _MatSelectMixinBase = mixinDisableRipple(mixinTabIndex(mixinDisabled(mixinErrorState(MatSelectBase))));
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
let MatSelectTrigger = /** @class */ (() => {
    class MatSelectTrigger {
    }
    MatSelectTrigger.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-select-trigger'
                },] }
    ];
    return MatSelectTrigger;
})();
export { MatSelectTrigger };
let MatSelect = /** @class */ (() => {
    class MatSelect extends _MatSelectMixinBase {
        constructor(_viewportRuler, _changeDetectorRef, _ngZone, _defaultErrorStateMatcher, elementRef, _dir, _parentForm, _parentFormGroup, _parentFormField, ngControl, tabIndex, scrollStrategyFactory, _liveAnnouncer, defaults) {
            super(elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
            this._viewportRuler = _viewportRuler;
            this._changeDetectorRef = _changeDetectorRef;
            this._ngZone = _ngZone;
            this._dir = _dir;
            this._parentFormField = _parentFormField;
            this.ngControl = ngControl;
            this._liveAnnouncer = _liveAnnouncer;
            /** Whether or not the overlay panel is open. */
            this._panelOpen = false;
            /** Whether filling out the select is required in the form. */
            this._required = false;
            /** The scroll position of the overlay panel, calculated to center the selected option. */
            this._scrollTop = 0;
            /** Whether the component is in multiple selection mode. */
            this._multiple = false;
            /** Comparison function to specify which option is displayed. Defaults to object equality. */
            this._compareWith = (o1, o2) => o1 === o2;
            /** Unique id for this input. */
            this._uid = `mat-select-${nextUniqueId++}`;
            /** Emits whenever the component is destroyed. */
            this._destroy = new Subject();
            /** The cached font-size of the trigger element. */
            this._triggerFontSize = 0;
            /** `View -> model callback called when value changes` */
            this._onChange = () => { };
            /** `View -> model callback called when select has been touched` */
            this._onTouched = () => { };
            /** The IDs of child options to be passed to the aria-owns attribute. */
            this._optionIds = '';
            /** The value of the select panel's transform-origin property. */
            this._transformOrigin = 'top';
            /** Emits when the panel element is finished transforming in. */
            this._panelDoneAnimatingStream = new Subject();
            /**
             * The y-offset of the overlay panel in relation to the trigger's top start corner.
             * This must be adjusted to align the selected option text over the trigger text.
             * when the panel opens. Will change based on the y-position of the selected option.
             */
            this._offsetY = 0;
            /**
             * This position config ensures that the top "start" corner of the overlay
             * is aligned with with the top "start" of the origin by default (overlapping
             * the trigger completely). If the panel cannot fit below the trigger, it
             * will fall back to a position above the trigger.
             */
            this._positions = [
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'top',
                },
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'bottom',
                },
            ];
            /** Whether the component is disabling centering of the active option over the trigger. */
            this._disableOptionCentering = false;
            this._focused = false;
            /** A name for this control that can be used by `mat-form-field`. */
            this.controlType = 'mat-select';
            /** Aria label of the select. If not specified, the placeholder will be used as label. */
            this.ariaLabel = '';
            /** Combined stream of all of the child options' change events. */
            this.optionSelectionChanges = defer(() => {
                const options = this.options;
                if (options) {
                    return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))));
                }
                return this._ngZone.onStable
                    .asObservable()
                    .pipe(take(1), switchMap(() => this.optionSelectionChanges));
            });
            /** Event emitted when the select panel has been toggled. */
            this.openedChange = new EventEmitter();
            /** Event emitted when the select has been opened. */
            this._openedStream = this.openedChange.pipe(filter(o => o), map(() => { }));
            /** Event emitted when the select has been closed. */
            this._closedStream = this.openedChange.pipe(filter(o => !o), map(() => { }));
            /** Event emitted when the selected value has been changed by the user. */
            this.selectionChange = new EventEmitter();
            /**
             * Event that emits whenever the raw value of the select changes. This is here primarily
             * to facilitate the two-way binding for the `value` input.
             * @docs-private
             */
            this.valueChange = new EventEmitter();
            if (this.ngControl) {
                // Note: we provide the value accessor through here, instead of
                // the `providers` to avoid running into a circular import.
                this.ngControl.valueAccessor = this;
            }
            this._scrollStrategyFactory = scrollStrategyFactory;
            this._scrollStrategy = this._scrollStrategyFactory();
            this.tabIndex = parseInt(tabIndex) || 0;
            // Force setter to be called in case id was not specified.
            this.id = this.id;
            if (defaults) {
                if (defaults.disableOptionCentering != null) {
                    this.disableOptionCentering = defaults.disableOptionCentering;
                }
                if (defaults.typeaheadDebounceInterval != null) {
                    this.typeaheadDebounceInterval = defaults.typeaheadDebounceInterval;
                }
            }
        }
        /** Whether the select is focused. */
        get focused() {
            return this._focused || this._panelOpen;
        }
        /** Placeholder to be shown if no value has been selected. */
        get placeholder() { return this._placeholder; }
        set placeholder(value) {
            this._placeholder = value;
            this.stateChanges.next();
        }
        /** Whether the component is required. */
        get required() { return this._required; }
        set required(value) {
            this._required = coerceBooleanProperty(value);
            this.stateChanges.next();
        }
        /** Whether the user should be allowed to select multiple options. */
        get multiple() { return this._multiple; }
        set multiple(value) {
            if (this._selectionModel) {
                throw getMatSelectDynamicMultipleError();
            }
            this._multiple = coerceBooleanProperty(value);
        }
        /** Whether to center the active option over the trigger. */
        get disableOptionCentering() { return this._disableOptionCentering; }
        set disableOptionCentering(value) {
            this._disableOptionCentering = coerceBooleanProperty(value);
        }
        /**
         * Function to compare the option values with the selected values. The first argument
         * is a value from an option. The second is a value from the selection. A boolean
         * should be returned.
         */
        get compareWith() { return this._compareWith; }
        set compareWith(fn) {
            if (typeof fn !== 'function') {
                throw getMatSelectNonFunctionValueError();
            }
            this._compareWith = fn;
            if (this._selectionModel) {
                // A different comparator means the selection could change.
                this._initializeSelection();
            }
        }
        /** Value of the select control. */
        get value() { return this._value; }
        set value(newValue) {
            if (newValue !== this._value) {
                this.writeValue(newValue);
                this._value = newValue;
            }
        }
        /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
        get typeaheadDebounceInterval() { return this._typeaheadDebounceInterval; }
        set typeaheadDebounceInterval(value) {
            this._typeaheadDebounceInterval = coerceNumberProperty(value);
        }
        /** Unique id of the element. */
        get id() { return this._id; }
        set id(value) {
            this._id = value || this._uid;
            this.stateChanges.next();
        }
        ngOnInit() {
            this._selectionModel = new SelectionModel(this.multiple);
            this.stateChanges.next();
            // We need `distinctUntilChanged` here, because some browsers will
            // fire the animation end event twice for the same animation. See:
            // https://github.com/angular/angular/issues/24084
            this._panelDoneAnimatingStream
                .pipe(distinctUntilChanged(), takeUntil(this._destroy))
                .subscribe(() => {
                if (this.panelOpen) {
                    this._scrollTop = 0;
                    this.openedChange.emit(true);
                }
                else {
                    this.openedChange.emit(false);
                    this.overlayDir.offsetX = 0;
                    this._changeDetectorRef.markForCheck();
                }
            });
            this._viewportRuler.change()
                .pipe(takeUntil(this._destroy))
                .subscribe(() => {
                if (this._panelOpen) {
                    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
                    this._changeDetectorRef.markForCheck();
                }
            });
        }
        ngAfterContentInit() {
            this._initKeyManager();
            this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe(event => {
                event.added.forEach(option => option.select());
                event.removed.forEach(option => option.deselect());
            });
            this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
                this._resetOptions();
                this._initializeSelection();
            });
        }
        ngDoCheck() {
            if (this.ngControl) {
                this.updateErrorState();
            }
        }
        ngOnChanges(changes) {
            // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
            // the parent form field know to run change detection when the disabled state changes.
            if (changes['disabled']) {
                this.stateChanges.next();
            }
            if (changes['typeaheadDebounceInterval'] && this._keyManager) {
                this._keyManager.withTypeAhead(this._typeaheadDebounceInterval);
            }
        }
        ngOnDestroy() {
            this._destroy.next();
            this._destroy.complete();
            this.stateChanges.complete();
        }
        /** Toggles the overlay panel open or closed. */
        toggle() {
            this.panelOpen ? this.close() : this.open();
        }
        /** Opens the overlay panel. */
        open() {
            if (this.disabled || !this.options || !this.options.length || this._panelOpen) {
                return;
            }
            this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
            // Note: The computed font-size will be a string pixel value (e.g. "16px").
            // `parseInt` ignores the trailing 'px' and converts this to a number.
            this._triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement).fontSize || '0');
            this._panelOpen = true;
            this._keyManager.withHorizontalOrientation(null);
            this._calculateOverlayPosition();
            this._highlightCorrectOption();
            this._changeDetectorRef.markForCheck();
            // Set the font size on the panel element once it exists.
            this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                if (this._triggerFontSize && this.overlayDir.overlayRef &&
                    this.overlayDir.overlayRef.overlayElement) {
                    this.overlayDir.overlayRef.overlayElement.style.fontSize = `${this._triggerFontSize}px`;
                }
            });
        }
        /** Closes the overlay panel and focuses the host element. */
        close() {
            if (this._panelOpen) {
                this._panelOpen = false;
                this._keyManager.withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr');
                this._changeDetectorRef.markForCheck();
                this._onTouched();
            }
        }
        /**
         * Sets the select's value. Part of the ControlValueAccessor interface
         * required to integrate with Angular's core forms API.
         *
         * @param value New value to be written to the model.
         */
        writeValue(value) {
            if (this.options) {
                this._setSelectionByValue(value);
            }
        }
        /**
         * Saves a callback function to be invoked when the select's value
         * changes from user input. Part of the ControlValueAccessor interface
         * required to integrate with Angular's core forms API.
         *
         * @param fn Callback to be triggered when the value changes.
         */
        registerOnChange(fn) {
            this._onChange = fn;
        }
        /**
         * Saves a callback function to be invoked when the select is blurred
         * by the user. Part of the ControlValueAccessor interface required
         * to integrate with Angular's core forms API.
         *
         * @param fn Callback to be triggered when the component has been touched.
         */
        registerOnTouched(fn) {
            this._onTouched = fn;
        }
        /**
         * Disables the select. Part of the ControlValueAccessor interface required
         * to integrate with Angular's core forms API.
         *
         * @param isDisabled Sets whether the component is disabled.
         */
        setDisabledState(isDisabled) {
            this.disabled = isDisabled;
            this._changeDetectorRef.markForCheck();
            this.stateChanges.next();
        }
        /** Whether or not the overlay panel is open. */
        get panelOpen() {
            return this._panelOpen;
        }
        /** The currently selected option. */
        get selected() {
            return this.multiple ? this._selectionModel.selected : this._selectionModel.selected[0];
        }
        /** The value displayed in the trigger. */
        get triggerValue() {
            if (this.empty) {
                return '';
            }
            if (this._multiple) {
                const selectedOptions = this._selectionModel.selected.map(option => option.viewValue);
                if (this._isRtl()) {
                    selectedOptions.reverse();
                }
                // TODO(crisbeto): delimiter should be configurable for proper localization.
                return selectedOptions.join(', ');
            }
            return this._selectionModel.selected[0].viewValue;
        }
        /** Whether the element is in RTL mode. */
        _isRtl() {
            return this._dir ? this._dir.value === 'rtl' : false;
        }
        /** Handles all keydown events on the select. */
        _handleKeydown(event) {
            if (!this.disabled) {
                this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
            }
        }
        /** Handles keyboard events while the select is closed. */
        _handleClosedKeydown(event) {
            const keyCode = event.keyCode;
            const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW ||
                keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
            const isOpenKey = keyCode === ENTER || keyCode === SPACE;
            const manager = this._keyManager;
            // Open the select on ALT + arrow key to match the native <select>
            if (!manager.isTyping() && (isOpenKey && !hasModifierKey(event)) ||
                ((this.multiple || event.altKey) && isArrowKey)) {
                event.preventDefault(); // prevents the page from scrolling down when pressing space
                this.open();
            }
            else if (!this.multiple) {
                const previouslySelectedOption = this.selected;
                if (keyCode === HOME || keyCode === END) {
                    keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
                    event.preventDefault();
                }
                else {
                    manager.onKeydown(event);
                }
                const selectedOption = this.selected;
                // Since the value has changed, we need to announce it ourselves.
                if (selectedOption && previouslySelectedOption !== selectedOption) {
                    // We set a duration on the live announcement, because we want the live element to be
                    // cleared after a while so that users can't navigate to it using the arrow keys.
                    this._liveAnnouncer.announce(selectedOption.viewValue, 10000);
                }
            }
        }
        /** Handles keyboard events when the selected is open. */
        _handleOpenKeydown(event) {
            const manager = this._keyManager;
            const keyCode = event.keyCode;
            const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
            const isTyping = manager.isTyping();
            if (keyCode === HOME || keyCode === END) {
                event.preventDefault();
                keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
            }
            else if (isArrowKey && event.altKey) {
                // Close the select on ALT + arrow key to match the native <select>
                event.preventDefault();
                this.close();
                // Don't do anything in this case if the user is typing,
                // because the typing sequence can include the space key.
            }
            else if (!isTyping && (keyCode === ENTER || keyCode === SPACE) && manager.activeItem &&
                !hasModifierKey(event)) {
                event.preventDefault();
                manager.activeItem._selectViaInteraction();
            }
            else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
                event.preventDefault();
                const hasDeselectedOptions = this.options.some(opt => !opt.disabled && !opt.selected);
                this.options.forEach(option => {
                    if (!option.disabled) {
                        hasDeselectedOptions ? option.select() : option.deselect();
                    }
                });
            }
            else {
                const previouslyFocusedIndex = manager.activeItemIndex;
                manager.onKeydown(event);
                if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem &&
                    manager.activeItemIndex !== previouslyFocusedIndex) {
                    manager.activeItem._selectViaInteraction();
                }
            }
        }
        _onFocus() {
            if (!this.disabled) {
                this._focused = true;
                this.stateChanges.next();
            }
        }
        /**
         * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
         * "blur" to the panel when it opens, causing a false positive.
         */
        _onBlur() {
            this._focused = false;
            if (!this.disabled && !this.panelOpen) {
                this._onTouched();
                this._changeDetectorRef.markForCheck();
                this.stateChanges.next();
            }
        }
        /**
         * Callback that is invoked when the overlay panel has been attached.
         */
        _onAttached() {
            this.overlayDir.positionChange.pipe(take(1)).subscribe(() => {
                this._changeDetectorRef.detectChanges();
                this._calculateOverlayOffsetX();
                this.panel.nativeElement.scrollTop = this._scrollTop;
            });
        }
        /** Returns the theme to be used on the panel. */
        _getPanelTheme() {
            return this._parentFormField ? `mat-${this._parentFormField.color}` : '';
        }
        /** Whether the select has a value. */
        get empty() {
            return !this._selectionModel || this._selectionModel.isEmpty();
        }
        _initializeSelection() {
            // Defer setting the value in order to avoid the "Expression
            // has changed after it was checked" errors from Angular.
            Promise.resolve().then(() => {
                this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value);
                this.stateChanges.next();
            });
        }
        /**
         * Sets the selected option based on a value. If no option can be
         * found with the designated value, the select trigger is cleared.
         */
        _setSelectionByValue(value) {
            if (this.multiple && value) {
                if (!Array.isArray(value)) {
                    throw getMatSelectNonArrayValueError();
                }
                this._selectionModel.clear();
                value.forEach((currentValue) => this._selectValue(currentValue));
                this._sortValues();
            }
            else {
                this._selectionModel.clear();
                const correspondingOption = this._selectValue(value);
                // Shift focus to the active item. Note that we shouldn't do this in multiple
                // mode, because we don't know what option the user interacted with last.
                if (correspondingOption) {
                    this._keyManager.setActiveItem(correspondingOption);
                }
                else if (!this.panelOpen) {
                    // Otherwise reset the highlighted option. Note that we only want to do this while
                    // closed, because doing it while open can shift the user's focus unnecessarily.
                    this._keyManager.setActiveItem(-1);
                }
            }
            this._changeDetectorRef.markForCheck();
        }
        /**
         * Finds and selects and option based on its value.
         * @returns Option that has the corresponding value.
         */
        _selectValue(value) {
            const correspondingOption = this.options.find((option) => {
                try {
                    // Treat null as a special reset value.
                    return option.value != null && this._compareWith(option.value, value);
                }
                catch (error) {
                    if (isDevMode()) {
                        // Notify developers of errors in their comparator.
                        console.warn(error);
                    }
                    return false;
                }
            });
            if (correspondingOption) {
                this._selectionModel.select(correspondingOption);
            }
            return correspondingOption;
        }
        /** Sets up a key manager to listen to keyboard events on the overlay panel. */
        _initKeyManager() {
            this._keyManager = new ActiveDescendantKeyManager(this.options)
                .withTypeAhead(this._typeaheadDebounceInterval)
                .withVerticalOrientation()
                .withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr')
                .withAllowedModifierKeys(['shiftKey']);
            this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
                if (this.panelOpen) {
                    // Select the active item when tabbing away. This is consistent with how the native
                    // select behaves. Note that we only want to do this in single selection mode.
                    if (!this.multiple && this._keyManager.activeItem) {
                        this._keyManager.activeItem._selectViaInteraction();
                    }
                    // Restore focus to the trigger before closing. Ensures that the focus
                    // position won't be lost if the user got focus into the overlay.
                    this.focus();
                    this.close();
                }
            });
            this._keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
                if (this._panelOpen && this.panel) {
                    this._scrollActiveOptionIntoView();
                }
                else if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
                    this._keyManager.activeItem._selectViaInteraction();
                }
            });
        }
        /** Drops current option subscriptions and IDs and resets from scratch. */
        _resetOptions() {
            const changedOrDestroyed = merge(this.options.changes, this._destroy);
            this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe(event => {
                this._onSelect(event.source, event.isUserInput);
                if (event.isUserInput && !this.multiple && this._panelOpen) {
                    this.close();
                    this.focus();
                }
            });
            // Listen to changes in the internal state of the options and react accordingly.
            // Handles cases like the labels of the selected options changing.
            merge(...this.options.map(option => option._stateChanges))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(() => {
                this._changeDetectorRef.markForCheck();
                this.stateChanges.next();
            });
            this._setOptionIds();
        }
        /** Invoked when an option is clicked. */
        _onSelect(option, isUserInput) {
            const wasSelected = this._selectionModel.isSelected(option);
            if (option.value == null && !this._multiple) {
                option.deselect();
                this._selectionModel.clear();
                this._propagateChanges(option.value);
            }
            else {
                if (wasSelected !== option.selected) {
                    option.selected ? this._selectionModel.select(option) :
                        this._selectionModel.deselect(option);
                }
                if (isUserInput) {
                    this._keyManager.setActiveItem(option);
                }
                if (this.multiple) {
                    this._sortValues();
                    if (isUserInput) {
                        // In case the user selected the option with their mouse, we
                        // want to restore focus back to the trigger, in order to
                        // prevent the select keyboard controls from clashing with
                        // the ones from `mat-option`.
                        this.focus();
                    }
                }
            }
            if (wasSelected !== this._selectionModel.isSelected(option)) {
                this._propagateChanges();
            }
            this.stateChanges.next();
        }
        /** Sorts the selected values in the selected based on their order in the panel. */
        _sortValues() {
            if (this.multiple) {
                const options = this.options.toArray();
                this._selectionModel.sort((a, b) => {
                    return this.sortComparator ? this.sortComparator(a, b, options) :
                        options.indexOf(a) - options.indexOf(b);
                });
                this.stateChanges.next();
            }
        }
        /** Emits change event to set the model value. */
        _propagateChanges(fallbackValue) {
            let valueToEmit = null;
            if (this.multiple) {
                valueToEmit = this.selected.map(option => option.value);
            }
            else {
                valueToEmit = this.selected ? this.selected.value : fallbackValue;
            }
            this._value = valueToEmit;
            this.valueChange.emit(valueToEmit);
            this._onChange(valueToEmit);
            this.selectionChange.emit(new MatSelectChange(this, valueToEmit));
            this._changeDetectorRef.markForCheck();
        }
        /** Records option IDs to pass to the aria-owns property. */
        _setOptionIds() {
            this._optionIds = this.options.map(option => option.id).join(' ');
        }
        /**
         * Highlights the selected item. If no option is selected, it will highlight
         * the first item instead.
         */
        _highlightCorrectOption() {
            if (this._keyManager) {
                if (this.empty) {
                    this._keyManager.setFirstItemActive();
                }
                else {
                    this._keyManager.setActiveItem(this._selectionModel.selected[0]);
                }
            }
        }
        /** Scrolls the active option into view. */
        _scrollActiveOptionIntoView() {
            const activeOptionIndex = this._keyManager.activeItemIndex || 0;
            const labelCount = _countGroupLabelsBeforeOption(activeOptionIndex, this.options, this.optionGroups);
            this.panel.nativeElement.scrollTop = _getOptionScrollPosition(activeOptionIndex + labelCount, this._getItemHeight(), this.panel.nativeElement.scrollTop, SELECT_PANEL_MAX_HEIGHT);
        }
        /** Focuses the select element. */
        focus(options) {
            this._elementRef.nativeElement.focus(options);
        }
        /** Gets the index of the provided option in the option list. */
        _getOptionIndex(option) {
            return this.options.reduce((result, current, index) => {
                if (result !== undefined) {
                    return result;
                }
                return option === current ? index : undefined;
            }, undefined);
        }
        /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
        _calculateOverlayPosition() {
            const itemHeight = this._getItemHeight();
            const items = this._getItemCount();
            const panelHeight = Math.min(items * itemHeight, SELECT_PANEL_MAX_HEIGHT);
            const scrollContainerHeight = items * itemHeight;
            // The farthest the panel can be scrolled before it hits the bottom
            const maxScroll = scrollContainerHeight - panelHeight;
            // If no value is selected we open the popup to the first item.
            let selectedOptionOffset = this.empty ? 0 : this._getOptionIndex(this._selectionModel.selected[0]);
            selectedOptionOffset += _countGroupLabelsBeforeOption(selectedOptionOffset, this.options, this.optionGroups);
            // We must maintain a scroll buffer so the selected option will be scrolled to the
            // center of the overlay panel rather than the top.
            const scrollBuffer = panelHeight / 2;
            this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, scrollBuffer, maxScroll);
            this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
            this._checkOverlayWithinViewport(maxScroll);
        }
        /**
         * Calculates the scroll position of the select's overlay panel.
         *
         * Attempts to center the selected option in the panel. If the option is
         * too high or too low in the panel to be scrolled to the center, it clamps the
         * scroll position to the min or max scroll positions respectively.
         */
        _calculateOverlayScroll(selectedIndex, scrollBuffer, maxScroll) {
            const itemHeight = this._getItemHeight();
            const optionOffsetFromScrollTop = itemHeight * selectedIndex;
            const halfOptionHeight = itemHeight / 2;
            // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
            // scroll container, then subtracts the scroll buffer to scroll the option down to
            // the center of the overlay panel. Half the option height must be re-added to the
            // scrollTop so the option is centered based on its middle, not its top edge.
            const optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
            return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
        }
        /** Returns the aria-label of the select component. */
        _getAriaLabel() {
            // If an ariaLabelledby value has been set by the consumer, the select should not overwrite the
            // `aria-labelledby` value by setting the ariaLabel to the placeholder.
            return this.ariaLabelledby ? null : this.ariaLabel || this.placeholder;
        }
        /** Returns the aria-labelledby of the select component. */
        _getAriaLabelledby() {
            if (this.ariaLabelledby) {
                return this.ariaLabelledby;
            }
            // Note: we use `_getAriaLabel` here, because we want to check whether there's a
            // computed label. `this.ariaLabel` is only the user-specified label.
            if (!this._parentFormField || !this._parentFormField._hasFloatingLabel() ||
                this._getAriaLabel()) {
                return null;
            }
            return this._parentFormField._labelId || null;
        }
        /** Determines the `aria-activedescendant` to be set on the host. */
        _getAriaActiveDescendant() {
            if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
                return this._keyManager.activeItem.id;
            }
            return null;
        }
        /**
         * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text when
         * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
         * can't be calculated until the panel has been attached, because we need to know the
         * content width in order to constrain the panel within the viewport.
         */
        _calculateOverlayOffsetX() {
            const overlayRect = this.overlayDir.overlayRef.overlayElement.getBoundingClientRect();
            const viewportSize = this._viewportRuler.getViewportSize();
            const isRtl = this._isRtl();
            const paddingWidth = this.multiple ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X :
                SELECT_PANEL_PADDING_X * 2;
            let offsetX;
            // Adjust the offset, depending on the option padding.
            if (this.multiple) {
                offsetX = SELECT_MULTIPLE_PANEL_PADDING_X;
            }
            else {
                let selected = this._selectionModel.selected[0] || this.options.first;
                offsetX = selected && selected.group ? SELECT_PANEL_INDENT_PADDING_X : SELECT_PANEL_PADDING_X;
            }
            // Invert the offset in LTR.
            if (!isRtl) {
                offsetX *= -1;
            }
            // Determine how much the select overflows on each side.
            const leftOverflow = 0 - (overlayRect.left + offsetX - (isRtl ? paddingWidth : 0));
            const rightOverflow = overlayRect.right + offsetX - viewportSize.width
                + (isRtl ? 0 : paddingWidth);
            // If the element overflows on either side, reduce the offset to allow it to fit.
            if (leftOverflow > 0) {
                offsetX += leftOverflow + SELECT_PANEL_VIEWPORT_PADDING;
            }
            else if (rightOverflow > 0) {
                offsetX -= rightOverflow + SELECT_PANEL_VIEWPORT_PADDING;
            }
            // Set the offset directly in order to avoid having to go through change detection and
            // potentially triggering "changed after it was checked" errors. Round the value to avoid
            // blurry content in some browsers.
            this.overlayDir.offsetX = Math.round(offsetX);
            this.overlayDir.overlayRef.updatePosition();
        }
        /**
         * Calculates the y-offset of the select's overlay panel in relation to the
         * top start corner of the trigger. It has to be adjusted in order for the
         * selected option to be aligned over the trigger when the panel opens.
         */
        _calculateOverlayOffsetY(selectedIndex, scrollBuffer, maxScroll) {
            const itemHeight = this._getItemHeight();
            const optionHeightAdjustment = (itemHeight - this._triggerRect.height) / 2;
            const maxOptionsDisplayed = Math.floor(SELECT_PANEL_MAX_HEIGHT / itemHeight);
            let optionOffsetFromPanelTop;
            // Disable offset if requested by user by returning 0 as value to offset
            if (this._disableOptionCentering) {
                return 0;
            }
            if (this._scrollTop === 0) {
                optionOffsetFromPanelTop = selectedIndex * itemHeight;
            }
            else if (this._scrollTop === maxScroll) {
                const firstDisplayedIndex = this._getItemCount() - maxOptionsDisplayed;
                const selectedDisplayIndex = selectedIndex - firstDisplayedIndex;
                // The first item is partially out of the viewport. Therefore we need to calculate what
                // portion of it is shown in the viewport and account for it in our offset.
                let partialItemHeight = itemHeight - (this._getItemCount() * itemHeight - SELECT_PANEL_MAX_HEIGHT) % itemHeight;
                // Because the panel height is longer than the height of the options alone,
                // there is always extra padding at the top or bottom of the panel. When
                // scrolled to the very bottom, this padding is at the top of the panel and
                // must be added to the offset.
                optionOffsetFromPanelTop = selectedDisplayIndex * itemHeight + partialItemHeight;
            }
            else {
                // If the option was scrolled to the middle of the panel using a scroll buffer,
                // its offset will be the scroll buffer minus the half height that was added to
                // center it.
                optionOffsetFromPanelTop = scrollBuffer - itemHeight / 2;
            }
            // The final offset is the option's offset from the top, adjusted for the height difference,
            // multiplied by -1 to ensure that the overlay moves in the correct direction up the page.
            // The value is rounded to prevent some browsers from blurring the content.
            return Math.round(optionOffsetFromPanelTop * -1 - optionHeightAdjustment);
        }
        /**
         * Checks that the attempted overlay position will fit within the viewport.
         * If it will not fit, tries to adjust the scroll position and the associated
         * y-offset so the panel can open fully on-screen. If it still won't fit,
         * sets the offset back to 0 to allow the fallback position to take over.
         */
        _checkOverlayWithinViewport(maxScroll) {
            const itemHeight = this._getItemHeight();
            const viewportSize = this._viewportRuler.getViewportSize();
            const topSpaceAvailable = this._triggerRect.top - SELECT_PANEL_VIEWPORT_PADDING;
            const bottomSpaceAvailable = viewportSize.height - this._triggerRect.bottom - SELECT_PANEL_VIEWPORT_PADDING;
            const panelHeightTop = Math.abs(this._offsetY);
            const totalPanelHeight = Math.min(this._getItemCount() * itemHeight, SELECT_PANEL_MAX_HEIGHT);
            const panelHeightBottom = totalPanelHeight - panelHeightTop - this._triggerRect.height;
            if (panelHeightBottom > bottomSpaceAvailable) {
                this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
            }
            else if (panelHeightTop > topSpaceAvailable) {
                this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
            }
            else {
                this._transformOrigin = this._getOriginBasedOnOption();
            }
        }
        /** Adjusts the overlay panel up to fit in the viewport. */
        _adjustPanelUp(panelHeightBottom, bottomSpaceAvailable) {
            // Browsers ignore fractional scroll offsets, so we need to round.
            const distanceBelowViewport = Math.round(panelHeightBottom - bottomSpaceAvailable);
            // Scrolls the panel up by the distance it was extending past the boundary, then
            // adjusts the offset by that amount to move the panel up into the viewport.
            this._scrollTop -= distanceBelowViewport;
            this._offsetY -= distanceBelowViewport;
            this._transformOrigin = this._getOriginBasedOnOption();
            // If the panel is scrolled to the very top, it won't be able to fit the panel
            // by scrolling, so set the offset to 0 to allow the fallback position to take
            // effect.
            if (this._scrollTop <= 0) {
                this._scrollTop = 0;
                this._offsetY = 0;
                this._transformOrigin = `50% bottom 0px`;
            }
        }
        /** Adjusts the overlay panel down to fit in the viewport. */
        _adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll) {
            // Browsers ignore fractional scroll offsets, so we need to round.
            const distanceAboveViewport = Math.round(panelHeightTop - topSpaceAvailable);
            // Scrolls the panel down by the distance it was extending past the boundary, then
            // adjusts the offset by that amount to move the panel down into the viewport.
            this._scrollTop += distanceAboveViewport;
            this._offsetY += distanceAboveViewport;
            this._transformOrigin = this._getOriginBasedOnOption();
            // If the panel is scrolled to the very bottom, it won't be able to fit the
            // panel by scrolling, so set the offset to 0 to allow the fallback position
            // to take effect.
            if (this._scrollTop >= maxScroll) {
                this._scrollTop = maxScroll;
                this._offsetY = 0;
                this._transformOrigin = `50% top 0px`;
                return;
            }
        }
        /** Sets the transform origin point based on the selected option. */
        _getOriginBasedOnOption() {
            const itemHeight = this._getItemHeight();
            const optionHeightAdjustment = (itemHeight - this._triggerRect.height) / 2;
            const originY = Math.abs(this._offsetY) - optionHeightAdjustment + itemHeight / 2;
            return `50% ${originY}px 0px`;
        }
        /** Calculates the amount of items in the select. This includes options and group labels. */
        _getItemCount() {
            return this.options.length + this.optionGroups.length;
        }
        /** Calculates the height of the select's options. */
        _getItemHeight() {
            return this._triggerFontSize * SELECT_ITEM_HEIGHT_EM;
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        setDescribedByIds(ids) {
            this._ariaDescribedby = ids.join(' ');
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        onContainerClick() {
            this.focus();
            this.open();
        }
        /**
         * Implemented as part of MatFormFieldControl.
         * @docs-private
         */
        get shouldLabelFloat() {
            return this._panelOpen || !this.empty;
        }
    }
    MatSelect.decorators = [
        { type: Component, args: [{
                    selector: 'mat-select',
                    exportAs: 'matSelect',
                    template: "<div cdk-overlay-origin\n     class=\"mat-select-trigger\"\n     aria-hidden=\"true\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\">\n    <span class=\"mat-select-placeholder\" *ngSwitchCase=\"true\">{{placeholder || '\\u00A0'}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span *ngSwitchDefault>{{triggerValue || '\\u00A0'}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      [attr.id]=\"id + '-panel'\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
                    inputs: ['disabled', 'disableRipple', 'tabIndex'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        'role': 'listbox',
                        '[attr.id]': 'id',
                        '[attr.tabindex]': 'tabIndex',
                        '[attr.aria-label]': '_getAriaLabel()',
                        '[attr.aria-labelledby]': '_getAriaLabelledby()',
                        '[attr.aria-required]': 'required.toString()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[attr.aria-owns]': 'panelOpen ? _optionIds : null',
                        '[attr.aria-multiselectable]': 'multiple',
                        '[attr.aria-describedby]': '_ariaDescribedby || null',
                        '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
                        '[class.mat-select-disabled]': 'disabled',
                        '[class.mat-select-invalid]': 'errorState',
                        '[class.mat-select-required]': 'required',
                        '[class.mat-select-empty]': 'empty',
                        'class': 'mat-select',
                        '(keydown)': '_handleKeydown($event)',
                        '(focus)': '_onFocus()',
                        '(blur)': '_onBlur()',
                    },
                    animations: [
                        matSelectAnimations.transformPanelWrap,
                        matSelectAnimations.transformPanel
                    ],
                    providers: [
                        { provide: MatFormFieldControl, useExisting: MatSelect },
                        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect }
                    ],
                    styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-table;cursor:pointer;position:relative;box-sizing:border-box}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-select-value{display:table-cell;max-width:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{display:table-cell;vertical-align:middle}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:transparent;-webkit-text-fill-color:transparent;transition:none;display:block}\n"]
                }] }
    ];
    /** @nocollapse */
    MatSelect.ctorParameters = () => [
        { type: ViewportRuler },
        { type: ChangeDetectorRef },
        { type: NgZone },
        { type: ErrorStateMatcher },
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgForm, decorators: [{ type: Optional }] },
        { type: FormGroupDirective, decorators: [{ type: Optional }] },
        { type: MatFormField, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD,] }] },
        { type: NgControl, decorators: [{ type: Self }, { type: Optional }] },
        { type: String, decorators: [{ type: Attribute, args: ['tabindex',] }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_SELECT_SCROLL_STRATEGY,] }] },
        { type: LiveAnnouncer },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_SELECT_CONFIG,] }] }
    ];
    MatSelect.propDecorators = {
        trigger: [{ type: ViewChild, args: ['trigger',] }],
        panel: [{ type: ViewChild, args: ['panel',] }],
        overlayDir: [{ type: ViewChild, args: [CdkConnectedOverlay,] }],
        options: [{ type: ContentChildren, args: [MatOption, { descendants: true },] }],
        optionGroups: [{ type: ContentChildren, args: [MatOptgroup, { descendants: true },] }],
        panelClass: [{ type: Input }],
        customTrigger: [{ type: ContentChild, args: [MatSelectTrigger,] }],
        placeholder: [{ type: Input }],
        required: [{ type: Input }],
        multiple: [{ type: Input }],
        disableOptionCentering: [{ type: Input }],
        compareWith: [{ type: Input }],
        value: [{ type: Input }],
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }],
        errorStateMatcher: [{ type: Input }],
        typeaheadDebounceInterval: [{ type: Input }],
        sortComparator: [{ type: Input }],
        id: [{ type: Input }],
        openedChange: [{ type: Output }],
        _openedStream: [{ type: Output, args: ['opened',] }],
        _closedStream: [{ type: Output, args: ['closed',] }],
        selectionChange: [{ type: Output }],
        valueChange: [{ type: Output }]
    };
    return MatSelect;
})();
export { MatSelect };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLDBCQUEwQixFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsQ0FBQyxFQUNELFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLGNBQWMsRUFDZCxJQUFJLEVBQ0osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLG1CQUFtQixFQUVuQixPQUFPLEdBRVIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBSU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsSUFBSSxFQUVKLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0YsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix3QkFBd0IsRUFPeEIsaUJBQWlCLEVBR2pCLDJCQUEyQixFQUMzQixXQUFXLEVBQ1gsU0FBUyxFQUVULGFBQWEsRUFDYixrQkFBa0IsRUFDbEIsZUFBZSxFQUNmLGFBQWEsR0FDZCxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sOEJBQThCLENBQUM7QUFDL0YsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQ0wsb0JBQW9CLEVBQ3BCLE1BQU0sRUFDTixHQUFHLEVBQ0gsU0FBUyxFQUNULFNBQVMsRUFDVCxJQUFJLEVBQ0osU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEIsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDeEQsT0FBTyxFQUNMLGdDQUFnQyxFQUNoQyw4QkFBOEIsRUFDOUIsaUNBQWlDLEdBQ2xDLE1BQU0saUJBQWlCLENBQUM7QUFHekIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBRXJCOzs7O0dBSUc7QUFFSCxtREFBbUQ7QUFDbkQsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxDQUFDO0FBRTNDLHdDQUF3QztBQUN4QyxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFFekMsb0ZBQW9GO0FBQ3BGLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHLHNCQUFzQixHQUFHLENBQUMsQ0FBQztBQUV4RSxvREFBb0Q7QUFDcEQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxDQUFDO0FBRXZDLHNGQUFzRjtBQUN0Rjs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHLHNCQUFzQixHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFFakY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxDQUFDO0FBRS9DLGtGQUFrRjtBQUNsRixNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FDbkMsSUFBSSxjQUFjLENBQXVCLDRCQUE0QixDQUFDLENBQUM7QUFFM0Usb0JBQW9CO0FBQ3BCLE1BQU0sVUFBVSwyQ0FBMkMsQ0FBQyxPQUFnQjtJQUUxRSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNyRCxDQUFDO0FBV0QseUZBQXlGO0FBQ3pGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLElBQUksY0FBYyxDQUFrQixtQkFBbUIsQ0FBQyxDQUFDO0FBRTFGLG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxtQ0FBbUMsR0FBRztJQUNqRCxPQUFPLEVBQUUsMEJBQTBCO0lBQ25DLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLFVBQVUsRUFBRSwyQ0FBMkM7Q0FDeEQsQ0FBQztBQUVGLDZFQUE2RTtBQUM3RSxNQUFNLE9BQU8sZUFBZTtJQUMxQjtJQUNFLDZEQUE2RDtJQUN0RCxNQUFpQjtJQUN4QiwwREFBMEQ7SUFDbkQsS0FBVTtRQUZWLFdBQU0sR0FBTixNQUFNLENBQVc7UUFFakIsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUFJLENBQUM7Q0FDekI7QUFFRCxnREFBZ0Q7QUFDaEQsb0JBQW9CO0FBQ3BCLE1BQU0sYUFBYTtJQUNqQixZQUFtQixXQUF1QixFQUN2Qix5QkFBNEMsRUFDNUMsV0FBbUIsRUFDbkIsZ0JBQW9DLEVBQ3BDLFNBQW9CO1FBSnBCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3ZCLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBbUI7UUFDNUMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFDbkIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFvQjtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFXO0lBQUcsQ0FBQztDQUM1QztBQUNELE1BQU0sbUJBQW1CLEdBTWpCLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBR3pGOztHQUVHO0FBQ0g7SUFBQSxNQUdhLGdCQUFnQjs7O2dCQUg1QixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtpQkFDL0I7O0lBQzhCLHVCQUFDO0tBQUE7U0FBbkIsZ0JBQWdCO0FBRzdCO0lBQUEsTUF1Q2EsU0FBVSxTQUFRLG1CQUFtQjtRQXFRaEQsWUFDVSxjQUE2QixFQUM3QixrQkFBcUMsRUFDckMsT0FBZSxFQUN2Qix5QkFBNEMsRUFDNUMsVUFBc0IsRUFDRixJQUFvQixFQUM1QixXQUFtQixFQUNuQixnQkFBb0MsRUFDSixnQkFBOEIsRUFDL0MsU0FBb0IsRUFDeEIsUUFBZ0IsRUFDSCxxQkFBMEIsRUFDdEQsY0FBNkIsRUFDRSxRQUEwQjtZQUNqRSxLQUFLLENBQUMsVUFBVSxFQUFFLHlCQUF5QixFQUFFLFdBQVcsRUFDbEQsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFmM0IsbUJBQWMsR0FBZCxjQUFjLENBQWU7WUFDN0IsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtZQUNyQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1lBR0gsU0FBSSxHQUFKLElBQUksQ0FBZ0I7WUFHSSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWM7WUFDL0MsY0FBUyxHQUFULFNBQVMsQ0FBVztZQUd2QyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtZQTdRdkMsZ0RBQWdEO1lBQ3hDLGVBQVUsR0FBRyxLQUFLLENBQUM7WUFFM0IsOERBQThEO1lBQ3RELGNBQVMsR0FBWSxLQUFLLENBQUM7WUFFbkMsMEZBQTBGO1lBQ2xGLGVBQVUsR0FBRyxDQUFDLENBQUM7WUFLdkIsMkRBQTJEO1lBQ25ELGNBQVMsR0FBWSxLQUFLLENBQUM7WUFFbkMsNkZBQTZGO1lBQ3JGLGlCQUFZLEdBQUcsQ0FBQyxFQUFPLEVBQUUsRUFBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDO1lBRXZELGdDQUFnQztZQUN4QixTQUFJLEdBQUcsY0FBYyxZQUFZLEVBQUUsRUFBRSxDQUFDO1lBRTlDLGlEQUFpRDtZQUNoQyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztZQVFoRCxtREFBbUQ7WUFDbkQscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1lBUXJCLHlEQUF5RDtZQUN6RCxjQUFTLEdBQXlCLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztZQUUzQyxtRUFBbUU7WUFDbkUsZUFBVSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztZQUV0Qix3RUFBd0U7WUFDeEUsZUFBVSxHQUFXLEVBQUUsQ0FBQztZQUV4QixpRUFBaUU7WUFDakUscUJBQWdCLEdBQVcsS0FBSyxDQUFDO1lBRWpDLGdFQUFnRTtZQUNoRSw4QkFBeUIsR0FBRyxJQUFJLE9BQU8sRUFBVSxDQUFDO1lBS2xEOzs7O2VBSUc7WUFDSCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRWI7Ozs7O2VBS0c7WUFDSCxlQUFVLEdBQXdCO2dCQUNoQztvQkFDRSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsUUFBUSxFQUFFLE9BQU87b0JBQ2pCLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsT0FBTyxFQUFFLFFBQVE7b0JBQ2pCLFFBQVEsRUFBRSxPQUFPO29CQUNqQixRQUFRLEVBQUUsUUFBUTtpQkFDbkI7YUFDRixDQUFDO1lBRUYsMEZBQTBGO1lBQ2xGLDRCQUF1QixHQUFZLEtBQUssQ0FBQztZQU16QyxhQUFRLEdBQUcsS0FBSyxDQUFDO1lBRXpCLG9FQUFvRTtZQUNwRSxnQkFBVyxHQUFHLFlBQVksQ0FBQztZQTJGM0IseUZBQXlGO1lBQ3BFLGNBQVMsR0FBVyxFQUFFLENBQUM7WUErQjVDLGtFQUFrRTtZQUN6RCwyQkFBc0IsR0FBeUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDakYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFFN0IsSUFBSSxPQUFPLEVBQUU7b0JBQ1gsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FDekIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUNsQixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FDM0UsQ0FBQztpQkFDSDtnQkFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUTtxQkFDekIsWUFBWSxFQUFFO3FCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDakUsQ0FBQyxDQUF5QyxDQUFDO1lBRTNDLDREQUE0RDtZQUN6QyxpQkFBWSxHQUEwQixJQUFJLFlBQVksRUFBVyxDQUFDO1lBRXJGLHFEQUFxRDtZQUMxQixrQkFBYSxHQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxRCxxREFBcUQ7WUFDMUIsa0JBQWEsR0FDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxRCwwRUFBMEU7WUFDeEQsb0JBQWUsR0FDOUIsSUFBSSxZQUFZLEVBQW1CLENBQUM7WUFFeEM7Ozs7ZUFJRztZQUNnQixnQkFBVyxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1lBb0IxRSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2xCLCtEQUErRDtnQkFDL0QsMkRBQTJEO2dCQUMzRCxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7YUFDckM7WUFFRCxJQUFJLENBQUMsc0JBQXNCLEdBQUcscUJBQXFCLENBQUM7WUFDcEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEMsMERBQTBEO1lBQzFELElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUVsQixJQUFJLFFBQVEsRUFBRTtnQkFDWixJQUFJLFFBQVEsQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLEVBQUU7b0JBQzNDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUM7aUJBQy9EO2dCQUVELElBQUksUUFBUSxDQUFDLHlCQUF5QixJQUFJLElBQUksRUFBRTtvQkFDOUMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQztpQkFDckU7YUFDRjtRQUNILENBQUM7UUFoTkQscUNBQXFDO1FBQ3JDLElBQUksT0FBTztZQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzFDLENBQUM7UUFnQ0QsNkRBQTZEO1FBQzdELElBQ0ksV0FBVyxLQUFhLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSxXQUFXLENBQUMsS0FBYTtZQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFFRCx5Q0FBeUM7UUFDekMsSUFDSSxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRUQscUVBQXFFO1FBQ3JFLElBQ0ksUUFBUSxLQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxRQUFRLENBQUMsS0FBYztZQUN6QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLE1BQU0sZ0NBQWdDLEVBQUUsQ0FBQzthQUMxQztZQUVELElBQUksQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELDREQUE0RDtRQUM1RCxJQUNJLHNCQUFzQixLQUFjLE9BQU8sSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUM5RSxJQUFJLHNCQUFzQixDQUFDLEtBQWM7WUFDdkMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsSUFDSSxXQUFXLEtBQUssT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLFdBQVcsQ0FBQyxFQUFpQztZQUMvQyxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRTtnQkFDNUIsTUFBTSxpQ0FBaUMsRUFBRSxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN4QiwyREFBMkQ7Z0JBQzNELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO2FBQzdCO1FBQ0gsQ0FBQztRQUVELG1DQUFtQztRQUNuQyxJQUNJLEtBQUssS0FBVSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3hDLElBQUksS0FBSyxDQUFDLFFBQWE7WUFDckIsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7YUFDeEI7UUFDSCxDQUFDO1FBWUQsNEZBQTRGO1FBQzVGLElBQ0kseUJBQXlCLEtBQWEsT0FBTyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQ25GLElBQUkseUJBQXlCLENBQUMsS0FBYTtZQUN6QyxJQUFJLENBQUMsMEJBQTBCLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQVNELGdDQUFnQztRQUNoQyxJQUNJLEVBQUUsS0FBYSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLElBQUksRUFBRSxDQUFDLEtBQWE7WUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFtRkQsUUFBUTtZQUNOLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFekIsa0VBQWtFO1lBQ2xFLGtFQUFrRTtZQUNsRSxrREFBa0Q7WUFDbEQsSUFBSSxDQUFDLHlCQUF5QjtpQkFDM0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdEQsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDOUI7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO2lCQUN4QztZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUwsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7aUJBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUM5QixTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNkLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO29CQUN2RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7aUJBQ3hDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsa0JBQWtCO1lBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV2QixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDNUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2xGLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsU0FBUztZQUNQLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7YUFDekI7UUFDSCxDQUFDO1FBRUQsV0FBVyxDQUFDLE9BQXNCO1lBQ2hDLDZGQUE2RjtZQUM3RixzRkFBc0Y7WUFDdEYsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7WUFFRCxJQUFJLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQzVELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2FBQ2pFO1FBQ0gsQ0FBQztRQUVELFdBQVc7WUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBRUQsZ0RBQWdEO1FBQ2hELE1BQU07WUFDSixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QyxDQUFDO1FBRUQsK0JBQStCO1FBQy9CLElBQUk7WUFDRixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDN0UsT0FBTzthQUNSO1lBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3ZFLDJFQUEyRTtZQUMzRSxzRUFBc0U7WUFDdEUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUUvRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUV2Qyx5REFBeUQ7WUFDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hFLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVTtvQkFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFO29CQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDO2lCQUN6RjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELDZEQUE2RDtRQUM3RCxLQUFLO1lBQ0gsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25CO1FBQ0gsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsVUFBVSxDQUFDLEtBQVU7WUFDbkIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQixJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEM7UUFDSCxDQUFDO1FBRUQ7Ozs7OztXQU1HO1FBQ0gsZ0JBQWdCLENBQUMsRUFBd0I7WUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVEOzs7Ozs7V0FNRztRQUNILGlCQUFpQixDQUFDLEVBQVk7WUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsZ0JBQWdCLENBQUMsVUFBbUI7WUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7WUFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVELGdEQUFnRDtRQUNoRCxJQUFJLFNBQVM7WUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsQ0FBQztRQUVELHFDQUFxQztRQUNyQyxJQUFJLFFBQVE7WUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBRUQsMENBQTBDO1FBQzFDLElBQUksWUFBWTtZQUNkLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxPQUFPLEVBQUUsQ0FBQzthQUNYO1lBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXRGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNqQixlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQzNCO2dCQUVELDRFQUE0RTtnQkFDNUUsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO1lBRUQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDcEQsQ0FBQztRQUVELDBDQUEwQztRQUMxQyxNQUFNO1lBQ0osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN2RCxDQUFDO1FBRUQsZ0RBQWdEO1FBQ2hELGNBQWMsQ0FBQyxLQUFvQjtZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEY7UUFDSCxDQUFDO1FBRUQsMERBQTBEO1FBQ2xELG9CQUFvQixDQUFDLEtBQW9CO1lBQy9DLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDOUIsTUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFVBQVUsSUFBSSxPQUFPLEtBQUssUUFBUTtnQkFDOUMsT0FBTyxLQUFLLFVBQVUsSUFBSSxPQUFPLEtBQUssV0FBVyxDQUFDO1lBQ3JFLE1BQU0sU0FBUyxHQUFHLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssQ0FBQztZQUN6RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBRWpDLGtFQUFrRTtZQUNsRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5RCxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksVUFBVSxDQUFDLEVBQUU7Z0JBQ2pELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLDREQUE0RDtnQkFDcEYsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2I7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFFL0MsSUFBSSxPQUFPLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7b0JBQ3ZDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztvQkFDOUUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2lCQUN4QjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUMxQjtnQkFFRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUVyQyxpRUFBaUU7Z0JBQ2pFLElBQUksY0FBYyxJQUFJLHdCQUF3QixLQUFLLGNBQWMsRUFBRTtvQkFDakUscUZBQXFGO29CQUNyRixpRkFBaUY7b0JBQ2pGLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFFLGNBQTRCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUM5RTthQUNGO1FBQ0gsQ0FBQztRQUVELHlEQUF5RDtRQUNqRCxrQkFBa0IsQ0FBQyxLQUFvQjtZQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDOUIsTUFBTSxVQUFVLEdBQUcsT0FBTyxLQUFLLFVBQVUsSUFBSSxPQUFPLEtBQUssUUFBUSxDQUFDO1lBQ2xFLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVwQyxJQUFJLE9BQU8sS0FBSyxJQUFJLElBQUksT0FBTyxLQUFLLEdBQUcsRUFBRTtnQkFDdkMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDL0U7aUJBQU0sSUFBSSxVQUFVLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckMsbUVBQW1FO2dCQUNuRSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDYix3REFBd0Q7Z0JBQ3hELHlEQUF5RDthQUMxRDtpQkFBTSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFVBQVU7Z0JBQ3BGLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUM1QztpQkFBTSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO2dCQUN4RSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRXRGLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTt3QkFDcEIsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUM1RDtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLE1BQU0sc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztnQkFFdkQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFekIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLFVBQVUsSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxVQUFVO29CQUNwRSxPQUFPLENBQUMsZUFBZSxLQUFLLHNCQUFzQixFQUFFO29CQUN0RCxPQUFPLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUM7aUJBQzVDO2FBQ0Y7UUFDSCxDQUFDO1FBRUQsUUFBUTtZQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUM7UUFFRDs7O1dBR0c7UUFDSCxPQUFPO1lBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUM7UUFFRDs7V0FFRztRQUNILFdBQVc7WUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDMUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsaURBQWlEO1FBQ2pELGNBQWM7WUFDWixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMzRSxDQUFDO1FBRUQsc0NBQXNDO1FBQ3RDLElBQUksS0FBSztZQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakUsQ0FBQztRQUVPLG9CQUFvQjtZQUMxQiw0REFBNEQ7WUFDNUQseURBQXlEO1lBQ3pELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUMxQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxvQkFBb0IsQ0FBQyxLQUFrQjtZQUM3QyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxFQUFFO2dCQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDekIsTUFBTSw4QkFBOEIsRUFBRSxDQUFDO2lCQUN4QztnQkFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBaUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDN0IsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVyRCw2RUFBNkU7Z0JBQzdFLHlFQUF5RTtnQkFDekUsSUFBSSxtQkFBbUIsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztpQkFDckQ7cUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsZ0ZBQWdGO29CQUNoRixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQzthQUNGO1lBRUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pDLENBQUM7UUFFRDs7O1dBR0c7UUFDSyxZQUFZLENBQUMsS0FBVTtZQUM3QixNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO2dCQUNsRSxJQUFJO29CQUNGLHVDQUF1QztvQkFDdkMsT0FBTyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUcsS0FBSyxDQUFDLENBQUM7aUJBQ3hFO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLElBQUksU0FBUyxFQUFFLEVBQUU7d0JBQ2YsbURBQW1EO3dCQUNuRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUNyQjtvQkFDRCxPQUFPLEtBQUssQ0FBQztpQkFDZDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxtQkFBbUIsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzthQUNsRDtZQUVELE9BQU8sbUJBQW1CLENBQUM7UUFDN0IsQ0FBQztRQUVELCtFQUErRTtRQUN2RSxlQUFlO1lBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSwwQkFBMEIsQ0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDO2lCQUN2RSxhQUFhLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDO2lCQUM5Qyx1QkFBdUIsRUFBRTtpQkFDekIseUJBQXlCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDeEQsdUJBQXVCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRXpDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDcEUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixtRkFBbUY7b0JBQ25GLDhFQUE4RTtvQkFDOUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7d0JBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUM7cUJBQ3JEO29CQUVELHNFQUFzRTtvQkFDdEUsaUVBQWlFO29CQUNqRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2lCQUNkO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BFLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNqQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztpQkFDcEM7cUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO29CQUM1RSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2lCQUNyRDtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELDBFQUEwRTtRQUNsRSxhQUFhO1lBQ25CLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUV0RSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNoRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUVoRCxJQUFJLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQzFELElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDYixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2Q7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILGdGQUFnRjtZQUNoRixrRUFBa0U7WUFDbEUsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztpQkFDbkMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFTCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUVELHlDQUF5QztRQUNqQyxTQUFTLENBQUMsTUFBaUIsRUFBRSxXQUFvQjtZQUN2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1RCxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDM0MsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNsQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNMLElBQUksV0FBVyxLQUFLLE1BQU0sQ0FBQyxRQUFRLEVBQUU7b0JBQ25DLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN6RDtnQkFFRCxJQUFJLFdBQVcsRUFBRTtvQkFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBRW5CLElBQUksV0FBVyxFQUFFO3dCQUNmLDREQUE0RDt3QkFDNUQseURBQXlEO3dCQUN6RCwwREFBMEQ7d0JBQzFELDhCQUE4Qjt3QkFDOUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3FCQUNkO2lCQUNGO2FBQ0Y7WUFFRCxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDM0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDMUI7WUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFFRCxtRkFBbUY7UUFDM0UsV0FBVztZQUNqQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRXZDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZFLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDMUI7UUFDSCxDQUFDO1FBRUQsaURBQWlEO1FBQ3pDLGlCQUFpQixDQUFDLGFBQW1CO1lBQzNDLElBQUksV0FBVyxHQUFRLElBQUksQ0FBQztZQUU1QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLFdBQVcsR0FBSSxJQUFJLENBQUMsUUFBd0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDMUU7aUJBQU07Z0JBQ0wsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxRQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2FBQ2xGO1lBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekMsQ0FBQztRQUVELDREQUE0RDtRQUNwRCxhQUFhO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRDs7O1dBR0c7UUFDSyx1QkFBdUI7WUFDN0IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsRTthQUNGO1FBQ0gsQ0FBQztRQUVELDJDQUEyQztRQUNuQywyQkFBMkI7WUFDakMsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7WUFDaEUsTUFBTSxVQUFVLEdBQUcsNkJBQTZCLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFDNUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXZCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyx3QkFBd0IsQ0FDM0QsaUJBQWlCLEdBQUcsVUFBVSxFQUM5QixJQUFJLENBQUMsY0FBYyxFQUFFLEVBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFDbEMsdUJBQXVCLENBQ3hCLENBQUM7UUFDSixDQUFDO1FBRUQsa0NBQWtDO1FBQ2xDLEtBQUssQ0FBQyxPQUFzQjtZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELGdFQUFnRTtRQUN4RCxlQUFlLENBQUMsTUFBaUI7WUFDdkMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQTBCLEVBQUUsT0FBa0IsRUFBRSxLQUFhLEVBQUUsRUFBRTtnQkFDM0YsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUN4QixPQUFPLE1BQU0sQ0FBQztpQkFDZjtnQkFFRCxPQUFPLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2hELENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBRUQsZ0ZBQWdGO1FBQ3hFLHlCQUF5QjtZQUMvQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ25DLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQzFFLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQztZQUVqRCxtRUFBbUU7WUFDbkUsTUFBTSxTQUFTLEdBQUcscUJBQXFCLEdBQUcsV0FBVyxDQUFDO1lBRXRELCtEQUErRDtZQUMvRCxJQUFJLG9CQUFvQixHQUNwQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztZQUU3RSxvQkFBb0IsSUFBSSw2QkFBNkIsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUNwRixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFdkIsa0ZBQWtGO1lBQ2xGLG1EQUFtRDtZQUNuRCxNQUFNLFlBQVksR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLG9CQUFvQixFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFN0YsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRDs7Ozs7O1dBTUc7UUFDSCx1QkFBdUIsQ0FBQyxhQUFxQixFQUFFLFlBQW9CLEVBQzNDLFNBQWlCO1lBQ3ZDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QyxNQUFNLHlCQUF5QixHQUFHLFVBQVUsR0FBRyxhQUFhLENBQUM7WUFDN0QsTUFBTSxnQkFBZ0IsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLHNGQUFzRjtZQUN0RixrRkFBa0Y7WUFDbEYsa0ZBQWtGO1lBQ2xGLDZFQUE2RTtZQUM3RSxNQUFNLHFCQUFxQixHQUFHLHlCQUF5QixHQUFHLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQztZQUMxRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUscUJBQXFCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRUQsc0RBQXNEO1FBQ3RELGFBQWE7WUFDWCwrRkFBK0Y7WUFDL0YsdUVBQXVFO1lBQ3ZFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDekUsQ0FBQztRQUVELDJEQUEyRDtRQUMzRCxrQkFBa0I7WUFDaEIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN2QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDNUI7WUFFRCxnRkFBZ0Y7WUFDaEYscUVBQXFFO1lBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtnQkFDdEIsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7UUFDaEQsQ0FBQztRQUVELG9FQUFvRTtRQUNwRSx3QkFBd0I7WUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3JFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2FBQ3ZDO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQ7Ozs7OztXQU1HO1FBQ0ssd0JBQXdCO1lBQzlCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3RGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDM0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLCtCQUErQixHQUFHLHNCQUFzQixDQUFDLENBQUM7Z0JBQzFELHNCQUFzQixHQUFHLENBQUMsQ0FBQztZQUNoRSxJQUFJLE9BQWUsQ0FBQztZQUVwQixzREFBc0Q7WUFDdEQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixPQUFPLEdBQUcsK0JBQStCLENBQUM7YUFDM0M7aUJBQU07Z0JBQ0wsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3RFLE9BQU8sR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDO2FBQy9GO1lBRUQsNEJBQTRCO1lBQzVCLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2Y7WUFFRCx3REFBd0Q7WUFDeEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRixNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxZQUFZLENBQUMsS0FBSztrQkFDOUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFbkQsaUZBQWlGO1lBQ2pGLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtnQkFDcEIsT0FBTyxJQUFJLFlBQVksR0FBRyw2QkFBNkIsQ0FBQzthQUN6RDtpQkFBTSxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7Z0JBQzVCLE9BQU8sSUFBSSxhQUFhLEdBQUcsNkJBQTZCLENBQUM7YUFDMUQ7WUFFRCxzRkFBc0Y7WUFDdEYseUZBQXlGO1lBQ3pGLG1DQUFtQztZQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzlDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0ssd0JBQXdCLENBQUMsYUFBcUIsRUFBRSxZQUFvQixFQUM1QyxTQUFpQjtZQUMvQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRSxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEdBQUcsVUFBVSxDQUFDLENBQUM7WUFDN0UsSUFBSSx3QkFBZ0MsQ0FBQztZQUVyQyx3RUFBd0U7WUFDeEUsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO2dCQUN6Qix3QkFBd0IsR0FBRyxhQUFhLEdBQUcsVUFBVSxDQUFDO2FBQ3ZEO2lCQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLG1CQUFtQixDQUFDO2dCQUN2RSxNQUFNLG9CQUFvQixHQUFHLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztnQkFFakUsdUZBQXVGO2dCQUN2RiwyRUFBMkU7Z0JBQzNFLElBQUksaUJBQWlCLEdBQ2pCLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxVQUFVLEdBQUcsdUJBQXVCLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBRTVGLDJFQUEyRTtnQkFDM0Usd0VBQXdFO2dCQUN4RSwyRUFBMkU7Z0JBQzNFLCtCQUErQjtnQkFDL0Isd0JBQXdCLEdBQUcsb0JBQW9CLEdBQUcsVUFBVSxHQUFHLGlCQUFpQixDQUFDO2FBQ2xGO2lCQUFNO2dCQUNMLCtFQUErRTtnQkFDL0UsK0VBQStFO2dCQUMvRSxhQUFhO2dCQUNiLHdCQUF3QixHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO2FBQzFEO1lBRUQsNEZBQTRGO1lBQzVGLDBGQUEwRjtZQUMxRiwyRUFBMkU7WUFDM0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxHQUFHLHNCQUFzQixDQUFDLENBQUM7UUFDNUUsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0ssMkJBQTJCLENBQUMsU0FBaUI7WUFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFM0QsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyw2QkFBNkIsQ0FBQztZQUNoRixNQUFNLG9CQUFvQixHQUN0QixZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLDZCQUE2QixDQUFDO1lBRW5GLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sZ0JBQWdCLEdBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLFVBQVUsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0saUJBQWlCLEdBQUcsZ0JBQWdCLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1lBRXZGLElBQUksaUJBQWlCLEdBQUcsb0JBQW9CLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQzthQUM5RDtpQkFBTSxJQUFJLGNBQWMsR0FBRyxpQkFBaUIsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNwRTtpQkFBTTtnQkFDTCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7YUFDeEQ7UUFDSCxDQUFDO1FBRUQsMkRBQTJEO1FBQ25ELGNBQWMsQ0FBQyxpQkFBeUIsRUFBRSxvQkFBNEI7WUFDNUUsa0VBQWtFO1lBQ2xFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO1lBRW5GLGdGQUFnRjtZQUNoRiw0RUFBNEU7WUFDNUUsSUFBSSxDQUFDLFVBQVUsSUFBSSxxQkFBcUIsQ0FBQztZQUN6QyxJQUFJLENBQUMsUUFBUSxJQUFJLHFCQUFxQixDQUFDO1lBQ3ZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUV2RCw4RUFBOEU7WUFDOUUsOEVBQThFO1lBQzlFLFVBQVU7WUFDVixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFO2dCQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQzthQUMxQztRQUNILENBQUM7UUFFRCw2REFBNkQ7UUFDckQsZ0JBQWdCLENBQUMsY0FBc0IsRUFBRSxpQkFBeUIsRUFDakQsU0FBaUI7WUFDeEMsa0VBQWtFO1lBQ2xFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztZQUU3RSxrRkFBa0Y7WUFDbEYsOEVBQThFO1lBQzlFLElBQUksQ0FBQyxVQUFVLElBQUkscUJBQXFCLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsSUFBSSxxQkFBcUIsQ0FBQztZQUN2QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFFdkQsMkVBQTJFO1lBQzNFLDRFQUE0RTtZQUM1RSxrQkFBa0I7WUFDbEIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO2dCQUN0QyxPQUFPO2FBQ1I7UUFDSCxDQUFDO1FBRUQsb0VBQW9FO1FBQzVELHVCQUF1QjtZQUM3QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDekMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxzQkFBc0IsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2xGLE9BQU8sT0FBTyxPQUFPLFFBQVEsQ0FBQztRQUNoQyxDQUFDO1FBRUQsNEZBQTRGO1FBQ3BGLGFBQWE7WUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUN4RCxDQUFDO1FBRUQscURBQXFEO1FBQzdDLGNBQWM7WUFDcEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcscUJBQXFCLENBQUM7UUFDdkQsQ0FBQztRQUVEOzs7V0FHRztRQUNILGlCQUFpQixDQUFDLEdBQWE7WUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7V0FHRztRQUNILGdCQUFnQjtZQUNkLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFFRDs7O1dBR0c7UUFDSCxJQUFJLGdCQUFnQjtZQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hDLENBQUM7OztnQkE1cENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsWUFBWTtvQkFDdEIsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLDh6REFBMEI7b0JBRTFCLE1BQU0sRUFBRSxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsVUFBVSxDQUFDO29CQUNqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUUsU0FBUzt3QkFDakIsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLGlCQUFpQixFQUFFLFVBQVU7d0JBQzdCLG1CQUFtQixFQUFFLGlCQUFpQjt3QkFDdEMsd0JBQXdCLEVBQUUsc0JBQXNCO3dCQUNoRCxzQkFBc0IsRUFBRSxxQkFBcUI7d0JBQzdDLHNCQUFzQixFQUFFLHFCQUFxQjt3QkFDN0MscUJBQXFCLEVBQUUsWUFBWTt3QkFDbkMsa0JBQWtCLEVBQUUsK0JBQStCO3dCQUNuRCw2QkFBNkIsRUFBRSxVQUFVO3dCQUN6Qyx5QkFBeUIsRUFBRSwwQkFBMEI7d0JBQ3JELDhCQUE4QixFQUFFLDRCQUE0Qjt3QkFDNUQsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsNEJBQTRCLEVBQUUsWUFBWTt3QkFDMUMsNkJBQTZCLEVBQUUsVUFBVTt3QkFDekMsMEJBQTBCLEVBQUUsT0FBTzt3QkFDbkMsT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7d0JBQ3JDLFNBQVMsRUFBRSxZQUFZO3dCQUN2QixRQUFRLEVBQUUsV0FBVztxQkFDdEI7b0JBQ0QsVUFBVSxFQUFFO3dCQUNWLG1CQUFtQixDQUFDLGtCQUFrQjt3QkFDdEMsbUJBQW1CLENBQUMsY0FBYztxQkFDbkM7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUM7d0JBQ3RELEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUM7cUJBQy9EOztpQkFDRjs7OztnQkFuTk8sYUFBYTtnQkFLbkIsaUJBQWlCO2dCQVlqQixNQUFNO2dCQXNCTixpQkFBaUI7Z0JBNUJqQixVQUFVO2dCQXJDSixjQUFjLHVCQXlmakIsUUFBUTtnQkFsY2dELE1BQU0sdUJBbWM5RCxRQUFRO2dCQW5jaUIsa0JBQWtCLHVCQW9jM0MsUUFBUTtnQkE5YVcsWUFBWSx1QkErYS9CLFFBQVEsWUFBSSxNQUFNLFNBQUMsY0FBYztnQkFyY1ksU0FBUyx1QkFzY3RELElBQUksWUFBSSxRQUFROzZDQUNoQixTQUFTLFNBQUMsVUFBVTtnREFDcEIsTUFBTSxTQUFDLDBCQUEwQjtnQkFoZ0JGLGFBQWE7Z0RBa2dCNUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7OzswQkE1S3RDLFNBQVMsU0FBQyxTQUFTO3dCQUduQixTQUFTLFNBQUMsT0FBTzs2QkFRakIsU0FBUyxTQUFDLG1CQUFtQjswQkFHN0IsZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7K0JBRzlDLGVBQWUsU0FBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzZCQUdoRCxLQUFLO2dDQUdMLFlBQVksU0FBQyxnQkFBZ0I7OEJBRzdCLEtBQUs7MkJBUUwsS0FBSzsyQkFRTCxLQUFLO3lDQVdMLEtBQUs7OEJBV0wsS0FBSzt3QkFjTCxLQUFLOzRCQVdMLEtBQUssU0FBQyxZQUFZO2lDQUdsQixLQUFLLFNBQUMsaUJBQWlCO29DQUd2QixLQUFLOzRDQUdMLEtBQUs7aUNBV0wsS0FBSztxQkFHTCxLQUFLOytCQXlCTCxNQUFNO2dDQUdOLE1BQU0sU0FBQyxRQUFRO2dDQUlmLE1BQU0sU0FBQyxRQUFRO2tDQUlmLE1BQU07OEJBUU4sTUFBTTs7SUEwM0JULGdCQUFDO0tBQUE7U0E3bkNZLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciwgTGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ2RrQ29ubmVjdGVkT3ZlcmxheSxcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgaXNEZXZNb2RlLFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2VsZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBGb3JtR3JvdXBEaXJlY3RpdmUsIE5nQ29udHJvbCwgTmdGb3JtfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlQ3RvcixcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgSGFzVGFiSW5kZXgsXG4gIEhhc1RhYkluZGV4Q3RvcixcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgYWxpZ25tZW50IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gb3ZlclxuICogdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAqL1xuXG4vKiogVGhlIG1heCBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCA9IDI1NjtcblxuLyoqIFRoZSBwYW5lbCdzIHBhZGRpbmcgb24gdGhlIHgtYXhpcyAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggPSAxNjtcblxuLyoqIFRoZSBwYW5lbCdzIHggYXhpcyBwYWRkaW5nIGlmIGl0IGlzIGluZGVudGVkIChlLmcuIHRoZXJlIGlzIGFuIG9wdGlvbiBncm91cCkuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcblxuLyoqIFRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCBpdGVtcyBpbiBgZW1gIHVuaXRzLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9JVEVNX0hFSUdIVF9FTSA9IDM7XG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IFJldmVydCB0byBhIGNvbnN0YW50IGFmdGVyIDIwMTggc3BlYyB1cGRhdGVzIGFyZSBmdWxseSBtZXJnZWQuXG4vKipcbiAqIERpc3RhbmNlIGJldHdlZW4gdGhlIHBhbmVsIGVkZ2UgYW5kIHRoZSBvcHRpb24gdGV4dCBpblxuICogbXVsdGktc2VsZWN0aW9uIG1vZGUuXG4gKlxuICogQ2FsY3VsYXRlZCBhczpcbiAqIChTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41KSArIDE2ID0gNDBcbiAqIFRoZSBwYWRkaW5nIGlzIG11bHRpcGxpZWQgYnkgMS41IGJlY2F1c2UgdGhlIGNoZWNrYm94J3MgbWFyZ2luIGlzIGhhbGYgdGhlIHBhZGRpbmcuXG4gKiBUaGUgY2hlY2tib3ggd2lkdGggaXMgMTZweC5cbiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41ICsgMTY7XG5cbi8qKlxuICogVGhlIHNlbGVjdCBwYW5lbCB3aWxsIG9ubHkgXCJmaXRcIiBpbnNpZGUgdGhlIHZpZXdwb3J0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYXRcbiAqIHRoaXMgdmFsdWUgb3IgbW9yZSBhd2F5IGZyb20gdGhlIHZpZXdwb3J0IGJvdW5kYXJ5LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkcgPSA4O1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1zZWxlY3Qtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTpcbiAgICAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBzZWxlY3QgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTZWxlY3RDb25maWcge1xuICAvKiogV2hldGhlciBvcHRpb24gY2VudGVyaW5nIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZU9wdGlvbkNlbnRlcmluZz86IGJvb2xlYW47XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbD86IG51bWJlcjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0LFxuICAgIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkgeyB9XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2VsZWN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNlbGVjdEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge31cbn1cbmNvbnN0IF9NYXRTZWxlY3RNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICZcbiAgICB0eXBlb2YgTWF0U2VsZWN0QmFzZSA9XG4gICAgICAgIG1peGluRGlzYWJsZVJpcHBsZShtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZWQobWl4aW5FcnJvclN0YXRlKE1hdFNlbGVjdEJhc2UpKSkpO1xuXG5cbi8qKlxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGN1c3RvbWl6ZSB0aGUgdHJpZ2dlciB0aGF0IGlzIGRpc3BsYXllZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QtdHJpZ2dlcidcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0VHJpZ2dlciB7fVxuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnc2VsZWN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2VsZWN0LmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2xpc3Rib3gnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdfZ2V0QXJpYUxhYmVsKCknLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ19nZXRBcmlhTGFiZWxsZWRieSgpJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncmVxdWlyZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJ3BhbmVsT3BlbiA/IF9vcHRpb25JZHMgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJ211bHRpcGxlJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1lbXB0eV0nOiAnZW1wdHknLFxuICAgICdjbGFzcyc6ICdtYXQtc2VsZWN0JyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdFNlbGVjdEFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWxXcmFwLFxuICAgIG1hdFNlbGVjdEFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXRTZWxlY3R9LFxuICAgIHtwcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRTZWxlY3R9XG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdCBleHRlbmRzIF9NYXRTZWxlY3RNaXhpbkJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBPbkluaXQsIERvQ2hlY2ssIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDYW5EaXNhYmxlLCBIYXNUYWJJbmRleCxcbiAgICBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sIENhblVwZGF0ZUVycm9yU3RhdGUsIENhbkRpc2FibGVSaXBwbGUge1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneUZhY3Rvcnk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3ZlcmxheSBwYW5lbCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9wYW5lbE9wZW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciBmaWxsaW5nIG91dCB0aGUgc2VsZWN0IGlzIHJlcXVpcmVkIGluIHRoZSBmb3JtLiAqL1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5IHBhbmVsLCBjYWxjdWxhdGVkIHRvIGNlbnRlciB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb3AgPSAwO1xuXG4gIC8qKiBUaGUgcGxhY2Vob2xkZXIgZGlzcGxheWVkIGluIHRoZSB0cmlnZ2VyIG9mIHRoZSBzZWxlY3QuICovXG4gIHByaXZhdGUgX3BsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBpbiBtdWx0aXBsZSBzZWxlY3Rpb24gbW9kZS4gKi9cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQ29tcGFyaXNvbiBmdW5jdGlvbiB0byBzcGVjaWZ5IHdoaWNoIG9wdGlvbiBpcyBkaXNwbGF5ZWQuIERlZmF1bHRzIHRvIG9iamVjdCBlcXVhbGl0eS4gKi9cbiAgcHJpdmF0ZSBfY29tcGFyZVdpdGggPSAobzE6IGFueSwgbzI6IGFueSkgPT4gbzEgPT09IG8yO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByaXZhdGUgX3VpZCA9IGBtYXQtc2VsZWN0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgbGFzdCBtZWFzdXJlZCB2YWx1ZSBmb3IgdGhlIHRyaWdnZXIncyBjbGllbnQgYm91bmRpbmcgcmVjdC4gKi9cbiAgX3RyaWdnZXJSZWN0OiBDbGllbnRSZWN0O1xuXG4gIC8qKiBUaGUgYXJpYS1kZXNjcmliZWRieSBhdHRyaWJ1dGUgb24gdGhlIHNlbGVjdCBmb3IgaW1wcm92ZWQgYTExeS4gKi9cbiAgX2FyaWFEZXNjcmliZWRieTogc3RyaW5nO1xuXG4gIC8qKiBUaGUgY2FjaGVkIGZvbnQtc2l6ZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfdHJpZ2dlckZvbnRTaXplID0gMDtcblxuICAvKiogRGVhbHMgd2l0aCB0aGUgc2VsZWN0aW9uIGxvZ2ljLiAqL1xuICBfc2VsZWN0aW9uTW9kZWw6IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj47XG5cbiAgLyoqIE1hbmFnZXMga2V5Ym9hcmQgZXZlbnRzIGZvciBvcHRpb25zIGluIHRoZSBwYW5lbC4gKi9cbiAgX2tleU1hbmFnZXI6IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPE1hdE9wdGlvbj47XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gc2VsZWN0IGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogVGhlIElEcyBvZiBjaGlsZCBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byB0aGUgYXJpYS1vd25zIGF0dHJpYnV0ZS4gKi9cbiAgX29wdGlvbklkczogc3RyaW5nID0gJyc7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IHBhbmVsJ3MgdHJhbnNmb3JtLW9yaWdpbiBwcm9wZXJ0eS4gKi9cbiAgX3RyYW5zZm9ybU9yaWdpbjogc3RyaW5nID0gJ3RvcCc7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHBhbmVsIGVsZW1lbnQgaXMgZmluaXNoZWQgdHJhbnNmb3JtaW5nIGluLiAqL1xuICBfcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IHdpbGwgYmUgdXNlZCB0byBoYW5kbGUgc2Nyb2xsaW5nIHdoaWxlIHRoZSBzZWxlY3QgcGFuZWwgaXMgb3Blbi4gKi9cbiAgX3Njcm9sbFN0cmF0ZWd5OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogVGhlIHktb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQuXG4gICAqIHdoZW4gdGhlIHBhbmVsIG9wZW5zLiBXaWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgeS1wb3NpdGlvbiBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uLlxuICAgKi9cbiAgX29mZnNldFkgPSAwO1xuXG4gIC8qKlxuICAgKiBUaGlzIHBvc2l0aW9uIGNvbmZpZyBlbnN1cmVzIHRoYXQgdGhlIHRvcCBcInN0YXJ0XCIgY29ybmVyIG9mIHRoZSBvdmVybGF5XG4gICAqIGlzIGFsaWduZWQgd2l0aCB3aXRoIHRoZSB0b3AgXCJzdGFydFwiIG9mIHRoZSBvcmlnaW4gYnkgZGVmYXVsdCAob3ZlcmxhcHBpbmdcbiAgICogdGhlIHRyaWdnZXIgY29tcGxldGVseSkuIElmIHRoZSBwYW5lbCBjYW5ub3QgZml0IGJlbG93IHRoZSB0cmlnZ2VyLCBpdFxuICAgKiB3aWxsIGZhbGwgYmFjayB0byBhIHBvc2l0aW9uIGFib3ZlIHRoZSB0cmlnZ2VyLlxuICAgKi9cbiAgX3Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICdib3R0b20nLFxuICAgIH0sXG4gIF07XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxpbmcgY2VudGVyaW5nIG9mIHRoZSBhY3RpdmUgb3B0aW9uIG92ZXIgdGhlIHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkIHx8IHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuICBwcml2YXRlIF9mb2N1c2VkID0gZmFsc2U7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbWF0LXNlbGVjdCc7XG5cbiAgLyoqIFRyaWdnZXIgdGhhdCBvcGVucyB0aGUgc2VsZWN0LiAqL1xuICBAVmlld0NoaWxkKCd0cmlnZ2VyJykgdHJpZ2dlcjogRWxlbWVudFJlZjtcblxuICAvKiogUGFuZWwgY29udGFpbmluZyB0aGUgc2VsZWN0IG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIE92ZXJsYXkgcGFuZSBjb250YWluaW5nIHRoZSBvcHRpb25zLlxuICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIHByaXZhdGUgQVBJLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXkpIG92ZXJsYXlEaXI6IENka0Nvbm5lY3RlZE92ZXJsYXk7XG5cbiAgLyoqIEFsbCBvZiB0aGUgZGVmaW5lZCBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+O1xuXG4gIC8qKiBBbGwgb2YgdGhlIGRlZmluZWQgZ3JvdXBzIG9mIG9wdGlvbnMuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0Z3JvdXAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHNlbGVjdCBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKiBVc2VyLXN1cHBsaWVkIG92ZXJyaWRlIG9mIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0U2VsZWN0VHJpZ2dlcikgY3VzdG9tVHJpZ2dlcjogTWF0U2VsZWN0VHJpZ2dlcjtcblxuICAvKiogUGxhY2Vob2xkZXIgdG8gYmUgc2hvd24gaWYgbm8gdmFsdWUgaGFzIGJlZW4gc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7IH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBzZWxlY3QgbXVsdGlwbGUgb3B0aW9ucy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRvIGNlbnRlciB0aGUgYWN0aXZlIG9wdGlvbiBvdmVyIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc7IH1cbiAgc2V0IGRpc2FibGVPcHRpb25DZW50ZXJpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcHRpb24gdmFsdWVzIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlcy4gVGhlIGZpcnN0IGFyZ3VtZW50XG4gICAqIGlzIGEgdmFsdWUgZnJvbSBhbiBvcHRpb24uIFRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3Rpb24uIEEgYm9vbGVhblxuICAgKiBzaG91bGQgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY29tcGFyZVdpdGgoKSB7IHJldHVybiB0aGlzLl9jb21wYXJlV2l0aDsgfVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uRnVuY3Rpb25WYWx1ZUVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICAvLyBBIGRpZmZlcmVudCBjb21wYXJhdG9yIG1lYW5zIHRoZSBzZWxlY3Rpb24gY291bGQgY2hhbmdlLlxuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2VsZWN0IGNvbnRyb2wuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICB0aGlzLndyaXRlVmFsdWUobmV3VmFsdWUpO1xuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgc2VsZWN0LiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgcGxhY2Vob2xkZXIgd2lsbCBiZSB1c2VkIGFzIGxhYmVsLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBPYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKSBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7IH1cbiAgc2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHNvcnQgdGhlIHZhbHVlcyBpbiBhIHNlbGVjdCBpbiBtdWx0aXBsZSBtb2RlLlxuICAgKiBGb2xsb3dzIHRoZSBzYW1lIGxvZ2ljIGFzIGBBcnJheS5wcm90b3R5cGUuc29ydGAuXG4gICAqL1xuICBASW5wdXQoKSBzb3J0Q29tcGFyYXRvcjogKGE6IE1hdE9wdGlvbiwgYjogTWF0T3B0aW9uLCBvcHRpb25zOiBNYXRPcHRpb25bXSkgPT4gbnVtYmVyO1xuXG4gIC8qKiBVbmlxdWUgaWQgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faWQ7IH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgb3B0aW9ucycgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uQ2hhbmdlczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgob3B0aW9ucyksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiBtZXJnZSguLi5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9uU2VsZWN0aW9uQ2hhbmdlKSkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgLnBpcGUodGFrZSgxKSwgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcykpO1xuICB9KSBhcyBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT47XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IHBhbmVsIGhhcyBiZWVuIHRvZ2dsZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcGVuZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKSByZWFkb25seSBfb3BlbmVkU3RyZWFtOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKG8gPT4gbyksIG1hcCgoKSA9PiB7fSkpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBjbG9zZWQuICovXG4gIEBPdXRwdXQoJ2Nsb3NlZCcpIHJlYWRvbmx5IF9jbG9zZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiAhbyksIG1hcCgoKSA9PiB7fSkpO1xuXG4gICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkIGJ5IHRoZSB1c2VyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0Q2hhbmdlPiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdFNlbGVjdENoYW5nZT4oKTtcblxuICAvKipcbiAgICogRXZlbnQgdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgcmF3IHZhbHVlIG9mIHRoZSBzZWxlY3QgY2hhbmdlcy4gVGhpcyBpcyBoZXJlIHByaW1hcmlseVxuICAgKiB0byBmYWNpbGl0YXRlIHRoZSB0d28td2F5IGJpbmRpbmcgZm9yIHRoZSBgdmFsdWVgIGlucHV0LlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm1Hcm91cDogRm9ybUdyb3VwRGlyZWN0aXZlLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTEQpIHByaXZhdGUgX3BhcmVudEZvcm1GaWVsZDogTWF0Rm9ybUZpZWxkLFxuICAgIEBTZWxmKCkgQE9wdGlvbmFsKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBASW5qZWN0KE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk6IGFueSxcbiAgICBwcml2YXRlIF9saXZlQW5ub3VuY2VyOiBMaXZlQW5ub3VuY2VyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1NFTEVDVF9DT05GSUcpIGRlZmF1bHRzPzogTWF0U2VsZWN0Q29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgX3BhcmVudEZvcm0sXG4gICAgICAgICAgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gTm90ZTogd2UgcHJvdmlkZSB0aGUgdmFsdWUgYWNjZXNzb3IgdGhyb3VnaCBoZXJlLCBpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgYHByb3ZpZGVyc2AgdG8gYXZvaWQgcnVubmluZyBpbnRvIGEgY2lyY3VsYXIgaW1wb3J0LlxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5ID0gc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5O1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5KCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuXG4gICAgaWYgKGRlZmF1bHRzKSB7XG4gICAgICBpZiAoZGVmYXVsdHMuZGlzYWJsZU9wdGlvbkNlbnRlcmluZyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA9IGRlZmF1bHRzLmRpc2FibGVPcHRpb25DZW50ZXJpbmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZWZhdWx0cy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gZGVmYXVsdHMudHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRPcHRpb24+KHRoaXMubXVsdGlwbGUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcblxuICAgIC8vIFdlIG5lZWQgYGRpc3RpbmN0VW50aWxDaGFuZ2VkYCBoZXJlLCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgd2lsbFxuICAgIC8vIGZpcmUgdGhlIGFuaW1hdGlvbiBlbmQgZXZlbnQgdHdpY2UgZm9yIHRoZSBzYW1lIGFuaW1hdGlvbi4gU2VlOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtXG4gICAgICAucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgICAgICAgIHRoaXMub3ZlcmxheURpci5vZmZzZXRYID0gMDtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2luaXRLZXlNYW5hZ2VyKCk7XG5cbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jaGFuZ2VkLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgZXZlbnQuYWRkZWQuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLnNlbGVjdCgpKTtcbiAgICAgIGV2ZW50LnJlbW92ZWQuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLmRlc2VsZWN0KCkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vcHRpb25zLmNoYW5nZXMucGlwZShzdGFydFdpdGgobnVsbCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX3Jlc2V0T3B0aW9ucygpO1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlbGVjdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIFVwZGF0aW5nIHRoZSBkaXNhYmxlZCBzdGF0ZSBpcyBoYW5kbGVkIGJ5IGBtaXhpbkRpc2FibGVkYCwgYnV0IHdlIG5lZWQgdG8gYWRkaXRpb25hbGx5IGxldFxuICAgIC8vIHRoZSBwYXJlbnQgZm9ybSBmaWVsZCBrbm93IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gdGhlIGRpc2FibGVkIHN0YXRlIGNoYW5nZXMuXG4gICAgaWYgKGNoYW5nZXNbJ2Rpc2FibGVkJ10pIHtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sndHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCddICYmIHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBvdmVybGF5IHBhbmVsIG9wZW4gb3IgY2xvc2VkLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5wYW5lbE9wZW4gPyB0aGlzLmNsb3NlKCkgOiB0aGlzLm9wZW4oKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5vcHRpb25zIHx8ICF0aGlzLm9wdGlvbnMubGVuZ3RoIHx8IHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgLy8gTm90ZTogVGhlIGNvbXB1dGVkIGZvbnQtc2l6ZSB3aWxsIGJlIGEgc3RyaW5nIHBpeGVsIHZhbHVlIChlLmcuIFwiMTZweFwiKS5cbiAgICAvLyBgcGFyc2VJbnRgIGlnbm9yZXMgdGhlIHRyYWlsaW5nICdweCcgYW5kIGNvbnZlcnRzIHRoaXMgdG8gYSBudW1iZXIuXG4gICAgdGhpcy5fdHJpZ2dlckZvbnRTaXplID0gcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudCkuZm9udFNpemUgfHwgJzAnKTtcblxuICAgIHRoaXMuX3BhbmVsT3BlbiA9IHRydWU7XG4gICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKG51bGwpO1xuICAgIHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpO1xuICAgIHRoaXMuX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcblxuICAgIC8vIFNldCB0aGUgZm9udCBzaXplIG9uIHRoZSBwYW5lbCBlbGVtZW50IG9uY2UgaXQgZXhpc3RzLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fdHJpZ2dlckZvbnRTaXplICYmIHRoaXMub3ZlcmxheURpci5vdmVybGF5UmVmICYmXG4gICAgICAgICAgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSBgJHt0aGlzLl90cmlnZ2VyRm9udFNpemV9cHhgO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgb3ZlcmxheSBwYW5lbCBhbmQgZm9jdXNlcyB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9wYW5lbE9wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9pc1J0bCgpID8gJ3J0bCcgOiAnbHRyJyk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3QncyB2YWx1ZS4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0J3MgdmFsdWVcbiAgICogY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0IGlzIGJsdXJyZWRcbiAgICogYnkgdGhlIHVzZXIuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHRvdWNoZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgc2VsZWN0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3ZlcmxheSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW47XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb24uICovXG4gIGdldCBzZWxlY3RlZCgpOiBNYXRPcHRpb24gfCBNYXRPcHRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZCA6IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdO1xuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBkaXNwbGF5ZWQgaW4gdGhlIHRyaWdnZXIuICovXG4gIGdldCB0cmlnZ2VyVmFsdWUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lbXB0eSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQubWFwKG9wdGlvbiA9PiBvcHRpb24udmlld1ZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMuX2lzUnRsKCkpIHtcbiAgICAgICAgc2VsZWN0ZWRPcHRpb25zLnJldmVyc2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IGRlbGltaXRlciBzaG91bGQgYmUgY29uZmlndXJhYmxlIGZvciBwcm9wZXIgbG9jYWxpemF0aW9uLlxuICAgICAgcmV0dXJuIHNlbGVjdGVkT3B0aW9ucy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXS52aWV3VmFsdWU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbiBSVEwgbW9kZS4gKi9cbiAgX2lzUnRsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnIDogZmFsc2U7XG4gIH1cblxuICAvKiogSGFuZGxlcyBhbGwga2V5ZG93biBldmVudHMgb24gdGhlIHNlbGVjdC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZWxPcGVuID8gdGhpcy5faGFuZGxlT3BlbktleWRvd24oZXZlbnQpIDogdGhpcy5faGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIHdoaWxlIHRoZSBzZWxlY3QgaXMgY2xvc2VkLiAqL1xuICBwcml2YXRlIF9oYW5kbGVDbG9zZWRLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaXNBcnJvd0tleSA9IGtleUNvZGUgPT09IERPV05fQVJST1cgfHwga2V5Q29kZSA9PT0gVVBfQVJST1cgfHxcbiAgICAgICAgICAgICAgICAgICAgICAga2V5Q29kZSA9PT0gTEVGVF9BUlJPVyB8fCBrZXlDb2RlID09PSBSSUdIVF9BUlJPVztcbiAgICBjb25zdCBpc09wZW5LZXkgPSBrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIC8vIE9wZW4gdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgIGlmICghbWFuYWdlci5pc1R5cGluZygpICYmIChpc09wZW5LZXkgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICgodGhpcy5tdWx0aXBsZSB8fCBldmVudC5hbHRLZXkpICYmIGlzQXJyb3dLZXkpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50cyB0aGUgcGFnZSBmcm9tIHNjcm9sbGluZyBkb3duIHdoZW4gcHJlc3Npbmcgc3BhY2VcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG5cbiAgICAgIGlmIChrZXlDb2RlID09PSBIT01FIHx8IGtleUNvZGUgPT09IEVORCkge1xuICAgICAgICBrZXlDb2RlID09PSBIT01FID8gbWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKSA6IG1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuXG4gICAgICAvLyBTaW5jZSB0aGUgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIG5lZWQgdG8gYW5ub3VuY2UgaXQgb3Vyc2VsdmVzLlxuICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uICYmIHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiAhPT0gc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgLy8gV2Ugc2V0IGEgZHVyYXRpb24gb24gdGhlIGxpdmUgYW5ub3VuY2VtZW50LCBiZWNhdXNlIHdlIHdhbnQgdGhlIGxpdmUgZWxlbWVudCB0byBiZVxuICAgICAgICAvLyBjbGVhcmVkIGFmdGVyIGEgd2hpbGUgc28gdGhhdCB1c2VycyBjYW4ndCBuYXZpZ2F0ZSB0byBpdCB1c2luZyB0aGUgYXJyb3cga2V5cy5cbiAgICAgICAgdGhpcy5fbGl2ZUFubm91bmNlci5hbm5vdW5jZSgoc2VsZWN0ZWRPcHRpb24gYXMgTWF0T3B0aW9uKS52aWV3VmFsdWUsIDEwMDAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hlbiB0aGUgc2VsZWN0ZWQgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlT3BlbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVztcbiAgICBjb25zdCBpc1R5cGluZyA9IG1hbmFnZXIuaXNUeXBpbmcoKTtcblxuICAgIGlmIChrZXlDb2RlID09PSBIT01FIHx8IGtleUNvZGUgPT09IEVORCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJvd0tleSAmJiBldmVudC5hbHRLZXkpIHtcbiAgICAgIC8vIENsb3NlIHRoZSBzZWxlY3Qgb24gQUxUICsgYXJyb3cga2V5IHRvIG1hdGNoIHRoZSBuYXRpdmUgPHNlbGVjdD5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAvLyBEb24ndCBkbyBhbnl0aGluZyBpbiB0aGlzIGNhc2UgaWYgdGhlIHVzZXIgaXMgdHlwaW5nLFxuICAgICAgLy8gYmVjYXVzZSB0aGUgdHlwaW5nIHNlcXVlbmNlIGNhbiBpbmNsdWRlIHRoZSBzcGFjZSBrZXkuXG4gICAgfSBlbHNlIGlmICghaXNUeXBpbmcgJiYgKGtleUNvZGUgPT09IEVOVEVSIHx8IGtleUNvZGUgPT09IFNQQUNFKSAmJiBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgfSBlbHNlIGlmICghaXNUeXBpbmcgJiYgdGhpcy5fbXVsdGlwbGUgJiYga2V5Q29kZSA9PT0gQSAmJiBldmVudC5jdHJsS2V5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFzRGVzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuc29tZShvcHQgPT4gIW9wdC5kaXNhYmxlZCAmJiAhb3B0LnNlbGVjdGVkKTtcblxuICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgICAgICBoYXNEZXNlbGVjdGVkT3B0aW9ucyA/IG9wdGlvbi5zZWxlY3QoKSA6IG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJldmlvdXNseUZvY3VzZWRJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG5cbiAgICAgIGlmICh0aGlzLl9tdWx0aXBsZSAmJiBpc0Fycm93S2V5ICYmIGV2ZW50LnNoaWZ0S2V5ICYmIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ICE9PSBwcmV2aW91c2x5Rm9jdXNlZEluZGV4KSB7XG4gICAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgdG91Y2hlZCBjYWxsYmFjayBvbmx5IGlmIHRoZSBwYW5lbCBpcyBjbG9zZWQuIE90aGVyd2lzZSwgdGhlIHRyaWdnZXIgd2lsbFxuICAgKiBcImJsdXJcIiB0byB0aGUgcGFuZWwgd2hlbiBpdCBvcGVucywgY2F1c2luZyBhIGZhbHNlIHBvc2l0aXZlLlxuICAgKi9cbiAgX29uQmx1cigpIHtcbiAgICB0aGlzLl9mb2N1c2VkID0gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGlzIGludm9rZWQgd2hlbiB0aGUgb3ZlcmxheSBwYW5lbCBoYXMgYmVlbiBhdHRhY2hlZC5cbiAgICovXG4gIF9vbkF0dGFjaGVkKCk6IHZvaWQge1xuICAgIHRoaXMub3ZlcmxheURpci5wb3NpdGlvbkNoYW5nZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpO1xuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMuX3Njcm9sbFRvcDtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB0aGVtZSB0byBiZSB1c2VkIG9uIHRoZSBwYW5lbC4gKi9cbiAgX2dldFBhbmVsVGhlbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50Rm9ybUZpZWxkID8gYG1hdC0ke3RoaXMuX3BhcmVudEZvcm1GaWVsZC5jb2xvcn1gIDogJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9zZWxlY3Rpb25Nb2RlbCB8fCB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc0VtcHR5KCk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIC8vIERlZmVyIHNldHRpbmcgdGhlIHZhbHVlIGluIG9yZGVyIHRvIGF2b2lkIHRoZSBcIkV4cHJlc3Npb25cbiAgICAvLyBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycyBmcm9tIEFuZ3VsYXIuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHRoaXMubmdDb250cm9sID8gdGhpcy5uZ0NvbnRyb2wudmFsdWUgOiB0aGlzLl92YWx1ZSk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgb3B0aW9uIGJhc2VkIG9uIGEgdmFsdWUuIElmIG5vIG9wdGlvbiBjYW4gYmVcbiAgICogZm91bmQgd2l0aCB0aGUgZGVzaWduYXRlZCB2YWx1ZSwgdGhlIHNlbGVjdCB0cmlnZ2VyIGlzIGNsZWFyZWQuXG4gICAqL1xuICBwcml2YXRlIF9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlOiBhbnkgfCBhbnlbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm11bHRpcGxlICYmIHZhbHVlKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHRocm93IGdldE1hdFNlbGVjdE5vbkFycmF5VmFsdWVFcnJvcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSkpO1xuICAgICAgdGhpcy5fc29ydFZhbHVlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMuX3NlbGVjdFZhbHVlKHZhbHVlKTtcblxuICAgICAgLy8gU2hpZnQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBpdGVtLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGRvIHRoaXMgaW4gbXVsdGlwbGVcbiAgICAgIC8vIG1vZGUsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IG9wdGlvbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggbGFzdC5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSByZXNldCB0aGUgaGlnaGxpZ2h0ZWQgb3B0aW9uLiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXMgd2hpbGVcbiAgICAgICAgLy8gY2xvc2VkLCBiZWNhdXNlIGRvaW5nIGl0IHdoaWxlIG9wZW4gY2FuIHNoaWZ0IHRoZSB1c2VyJ3MgZm9jdXMgdW5uZWNlc3NhcmlseS5cbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyBhbmQgb3B0aW9uIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgT3B0aW9uIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSk6IE1hdE9wdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKChvcHRpb246IE1hdE9wdGlvbikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVHJlYXQgbnVsbCBhcyBhIHNwZWNpYWwgcmVzZXQgdmFsdWUuXG4gICAgICAgIHJldHVybiBvcHRpb24udmFsdWUgIT0gbnVsbCAmJiB0aGlzLl9jb21wYXJlV2l0aChvcHRpb24udmFsdWUsICB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgICAvLyBOb3RpZnkgZGV2ZWxvcGVycyBvZiBlcnJvcnMgaW4gdGhlaXIgY29tcGFyYXRvci5cbiAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcnJlc3BvbmRpbmdPcHRpb247XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAvLyBTZWxlY3QgdGhlIGFjdGl2ZSBpdGVtIHdoZW4gdGFiYmluZyBhd2F5LiBUaGlzIGlzIGNvbnNpc3RlbnQgd2l0aCBob3cgdGhlIG5hdGl2ZVxuICAgICAgICAvLyBzZWxlY3QgYmVoYXZlcy4gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBkbyB0aGlzIGluIHNpbmdsZSBzZWxlY3Rpb24gbW9kZS5cbiAgICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc3RvcmUgZm9jdXMgdG8gdGhlIHRyaWdnZXIgYmVmb3JlIGNsb3NpbmcuIEVuc3VyZXMgdGhhdCB0aGUgZm9jdXNcbiAgICAgICAgLy8gcG9zaXRpb24gd29uJ3QgYmUgbG9zdCBpZiB0aGUgdXNlciBnb3QgZm9jdXMgaW50byB0aGUgb3ZlcmxheS5cbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9wYW5lbE9wZW4gJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLl9zY3JvbGxBY3RpdmVPcHRpb25JbnRvVmlldygpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5fcGFuZWxPcGVuICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogRHJvcHMgY3VycmVudCBvcHRpb24gc3Vic2NyaXB0aW9ucyBhbmQgSURzIGFuZCByZXNldHMgZnJvbSBzY3JhdGNoLiAqL1xuICBwcml2YXRlIF9yZXNldE9wdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZE9yRGVzdHJveWVkID0gbWVyZ2UodGhpcy5vcHRpb25zLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3kpO1xuXG4gICAgdGhpcy5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICB0aGlzLl9vblNlbGVjdChldmVudC5zb3VyY2UsIGV2ZW50LmlzVXNlcklucHV0KTtcblxuICAgICAgaWYgKGV2ZW50LmlzVXNlcklucHV0ICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiB0byBjaGFuZ2VzIGluIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgb3B0aW9ucyBhbmQgcmVhY3QgYWNjb3JkaW5nbHkuXG4gICAgLy8gSGFuZGxlcyBjYXNlcyBsaWtlIHRoZSBsYWJlbHMgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbnMgY2hhbmdpbmcuXG4gICAgbWVyZ2UoLi4udGhpcy5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLl9zdGF0ZUNoYW5nZXMpKVxuICAgICAgLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fc2V0T3B0aW9uSWRzKCk7XG4gIH1cblxuICAvKiogSW52b2tlZCB3aGVuIGFuIG9wdGlvbiBpcyBjbGlja2VkLiAqL1xuICBwcml2YXRlIF9vblNlbGVjdChvcHRpb246IE1hdE9wdGlvbiwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB3YXNTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb24udmFsdWUgPT0gbnVsbCAmJiAhdGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMob3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdhc1NlbGVjdGVkICE9PSBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID8gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KG9wdGlvbikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5kZXNlbGVjdChvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKG9wdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuX3NvcnRWYWx1ZXMoKTtcblxuICAgICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSB1c2VyIHNlbGVjdGVkIHRoZSBvcHRpb24gd2l0aCB0aGVpciBtb3VzZSwgd2VcbiAgICAgICAgICAvLyB3YW50IHRvIHJlc3RvcmUgZm9jdXMgYmFjayB0byB0aGUgdHJpZ2dlciwgaW4gb3JkZXIgdG9cbiAgICAgICAgICAvLyBwcmV2ZW50IHRoZSBzZWxlY3Qga2V5Ym9hcmQgY29udHJvbHMgZnJvbSBjbGFzaGluZyB3aXRoXG4gICAgICAgICAgLy8gdGhlIG9uZXMgZnJvbSBgbWF0LW9wdGlvbmAuXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdhc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKG9wdGlvbikpIHtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogU29ydHMgdGhlIHNlbGVjdGVkIHZhbHVlcyBpbiB0aGUgc2VsZWN0ZWQgYmFzZWQgb24gdGhlaXIgb3JkZXIgaW4gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9zb3J0VmFsdWVzKCkge1xuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKTtcblxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0Q29tcGFyYXRvciA/IHRoaXMuc29ydENvbXBhcmF0b3IoYSwgYiwgb3B0aW9ucykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW5kZXhPZihhKSAtIG9wdGlvbnMuaW5kZXhPZihiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uW10pLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uKS52YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3RDaGFuZ2UodGhpcywgdmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBSZWNvcmRzIG9wdGlvbiBJRHMgdG8gcGFzcyB0byB0aGUgYXJpYS1vd25zIHByb3BlcnR5LiAqL1xuICBwcml2YXRlIF9zZXRPcHRpb25JZHMoKSB7XG4gICAgdGhpcy5fb3B0aW9uSWRzID0gdGhpcy5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLmlkKS5qb2luKCcgJyk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB0aGUgc2VsZWN0ZWQgaXRlbS4gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBpdCB3aWxsIGhpZ2hsaWdodFxuICAgKiB0aGUgZmlyc3QgaXRlbSBpbnN0ZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNjcm9sbHMgdGhlIGFjdGl2ZSBvcHRpb24gaW50byB2aWV3LiAqL1xuICBwcml2YXRlIF9zY3JvbGxBY3RpdmVPcHRpb25JbnRvVmlldygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVPcHRpb25JbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDA7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGFjdGl2ZU9wdGlvbkluZGV4LCB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHRoaXMub3B0aW9uR3JvdXBzKTtcblxuICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICBhY3RpdmVPcHRpb25JbmRleCArIGxhYmVsQ291bnQsXG4gICAgICB0aGlzLl9nZXRJdGVtSGVpZ2h0KCksXG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFRcbiAgICApO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdCBlbGVtZW50LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGluZGV4IG9mIHRoZSBwcm92aWRlZCBvcHRpb24gaW4gdGhlIG9wdGlvbiBsaXN0LiAqL1xuICBwcml2YXRlIF9nZXRPcHRpb25JbmRleChvcHRpb246IE1hdE9wdGlvbik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZWR1Y2UoKHJlc3VsdDogbnVtYmVyIHwgdW5kZWZpbmVkLCBjdXJyZW50OiBNYXRPcHRpb24sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0aW9uID09PSBjdXJyZW50ID8gaW5kZXggOiB1bmRlZmluZWQ7XG4gICAgfSwgdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHgtIGFuZCB5LW9mZnNldHMgb2YgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbUNvdW50KCk7XG4gICAgY29uc3QgcGFuZWxIZWlnaHQgPSBNYXRoLm1pbihpdGVtcyAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBzY3JvbGxDb250YWluZXJIZWlnaHQgPSBpdGVtcyAqIGl0ZW1IZWlnaHQ7XG5cbiAgICAvLyBUaGUgZmFydGhlc3QgdGhlIHBhbmVsIGNhbiBiZSBzY3JvbGxlZCBiZWZvcmUgaXQgaGl0cyB0aGUgYm90dG9tXG4gICAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsQ29udGFpbmVySGVpZ2h0IC0gcGFuZWxIZWlnaHQ7XG5cbiAgICAvLyBJZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCB3ZSBvcGVuIHRoZSBwb3B1cCB0byB0aGUgZmlyc3QgaXRlbS5cbiAgICBsZXQgc2VsZWN0ZWRPcHRpb25PZmZzZXQgPVxuICAgICAgICB0aGlzLmVtcHR5ID8gMCA6IHRoaXMuX2dldE9wdGlvbkluZGV4KHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdKSE7XG5cbiAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCArPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihzZWxlY3RlZE9wdGlvbk9mZnNldCwgdGhpcy5vcHRpb25zLFxuICAgICAgICB0aGlzLm9wdGlvbkdyb3Vwcyk7XG5cbiAgICAvLyBXZSBtdXN0IG1haW50YWluIGEgc2Nyb2xsIGJ1ZmZlciBzbyB0aGUgc2VsZWN0ZWQgb3B0aW9uIHdpbGwgYmUgc2Nyb2xsZWQgdG8gdGhlXG4gICAgLy8gY2VudGVyIG9mIHRoZSBvdmVybGF5IHBhbmVsIHJhdGhlciB0aGFuIHRoZSB0b3AuXG4gICAgY29uc3Qgc2Nyb2xsQnVmZmVyID0gcGFuZWxIZWlnaHQgLyAyO1xuICAgIHRoaXMuX3Njcm9sbFRvcCA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcbiAgICB0aGlzLl9vZmZzZXRZID0gdGhpcy5fY2FsY3VsYXRlT3ZlcmxheU9mZnNldFkoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcblxuICAgIHRoaXMuX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLlxuICAgKlxuICAgKiBBdHRlbXB0cyB0byBjZW50ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGUgcGFuZWwuIElmIHRoZSBvcHRpb24gaXNcbiAgICogdG9vIGhpZ2ggb3IgdG9vIGxvdyBpbiB0aGUgcGFuZWwgdG8gYmUgc2Nyb2xsZWQgdG8gdGhlIGNlbnRlciwgaXQgY2xhbXBzIHRoZVxuICAgKiBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIG1pbiBvciBtYXggc2Nyb2xsIHBvc2l0aW9ucyByZXNwZWN0aXZlbHkuXG4gICAqL1xuICBfY2FsY3VsYXRlT3ZlcmxheVNjcm9sbChzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEJ1ZmZlcjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wID0gaXRlbUhlaWdodCAqIHNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaGFsZk9wdGlvbkhlaWdodCA9IGl0ZW1IZWlnaHQgLyAyO1xuXG4gICAgLy8gU3RhcnRzIGF0IHRoZSBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wLCB3aGljaCBzY3JvbGxzIHRoZSBvcHRpb24gdG8gdGhlIHRvcCBvZiB0aGVcbiAgICAvLyBzY3JvbGwgY29udGFpbmVyLCB0aGVuIHN1YnRyYWN0cyB0aGUgc2Nyb2xsIGJ1ZmZlciB0byBzY3JvbGwgdGhlIG9wdGlvbiBkb3duIHRvXG4gICAgLy8gdGhlIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSGFsZiB0aGUgb3B0aW9uIGhlaWdodCBtdXN0IGJlIHJlLWFkZGVkIHRvIHRoZVxuICAgIC8vIHNjcm9sbFRvcCBzbyB0aGUgb3B0aW9uIGlzIGNlbnRlcmVkIGJhc2VkIG9uIGl0cyBtaWRkbGUsIG5vdCBpdHMgdG9wIGVkZ2UuXG4gICAgY29uc3Qgb3B0aW1hbFNjcm9sbFBvc2l0aW9uID0gb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCAtIHNjcm9sbEJ1ZmZlciArIGhhbGZPcHRpb25IZWlnaHQ7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KDAsIG9wdGltYWxTY3JvbGxQb3NpdGlvbiksIG1heFNjcm9sbCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYXJpYS1sYWJlbCBvZiB0aGUgc2VsZWN0IGNvbXBvbmVudC4gKi9cbiAgX2dldEFyaWFMYWJlbCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAvLyBJZiBhbiBhcmlhTGFiZWxsZWRieSB2YWx1ZSBoYXMgYmVlbiBzZXQgYnkgdGhlIGNvbnN1bWVyLCB0aGUgc2VsZWN0IHNob3VsZCBub3Qgb3ZlcndyaXRlIHRoZVxuICAgIC8vIGBhcmlhLWxhYmVsbGVkYnlgIHZhbHVlIGJ5IHNldHRpbmcgdGhlIGFyaWFMYWJlbCB0byB0aGUgcGxhY2Vob2xkZXIuXG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBudWxsIDogdGhpcy5hcmlhTGFiZWwgfHwgdGhpcy5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhcmlhLWxhYmVsbGVkYnkgb2YgdGhlIHNlbGVjdCBjb21wb25lbnQuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWxsZWRieSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgdXNlIGBfZ2V0QXJpYUxhYmVsYCBoZXJlLCBiZWNhdXNlIHdlIHdhbnQgdG8gY2hlY2sgd2hldGhlciB0aGVyZSdzIGFcbiAgICAvLyBjb21wdXRlZCBsYWJlbC4gYHRoaXMuYXJpYUxhYmVsYCBpcyBvbmx5IHRoZSB1c2VyLXNwZWNpZmllZCBsYWJlbC5cbiAgICBpZiAoIXRoaXMuX3BhcmVudEZvcm1GaWVsZCB8fCAhdGhpcy5fcGFyZW50Rm9ybUZpZWxkLl9oYXNGbG9hdGluZ0xhYmVsKCkgfHxcbiAgICAgIHRoaXMuX2dldEFyaWFMYWJlbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcGFyZW50Rm9ybUZpZWxkLl9sYWJlbElkIHx8IG51bGw7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB0aGUgYGFyaWEtYWN0aXZlZGVzY2VuZGFudGAgdG8gYmUgc2V0IG9uIHRoZSBob3N0LiAqL1xuICBfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMucGFuZWxPcGVuICYmIHRoaXMuX2tleU1hbmFnZXIgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgtb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQgd2hlblxuICAgKiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIExUUiBvciBSVEwgdGV4dCBkaXJlY3Rpb24uIE5vdGUgdGhhdCB0aGUgb2Zmc2V0XG4gICAqIGNhbid0IGJlIGNhbGN1bGF0ZWQgdW50aWwgdGhlIHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGVcbiAgICogY29udGVudCB3aWR0aCBpbiBvcmRlciB0byBjb25zdHJhaW4gdGhlIHBhbmVsIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5UmVjdCA9IHRoaXMub3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHZpZXdwb3J0U2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLl9pc1J0bCgpO1xuICAgIGNvbnN0IHBhZGRpbmdXaWR0aCA9IHRoaXMubXVsdGlwbGUgPyBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YICsgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuICAgIGxldCBvZmZzZXRYOiBudW1iZXI7XG5cbiAgICAvLyBBZGp1c3QgdGhlIG9mZnNldCwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb24gcGFkZGluZy5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgb2Zmc2V0WCA9IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1g7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdIHx8IHRoaXMub3B0aW9ucy5maXJzdDtcbiAgICAgIG9mZnNldFggPSBzZWxlY3RlZCAmJiBzZWxlY3RlZC5ncm91cCA/IFNFTEVDVF9QQU5FTF9JTkRFTlRfUEFERElOR19YIDogU0VMRUNUX1BBTkVMX1BBRERJTkdfWDtcbiAgICB9XG5cbiAgICAvLyBJbnZlcnQgdGhlIG9mZnNldCBpbiBMVFIuXG4gICAgaWYgKCFpc1J0bCkge1xuICAgICAgb2Zmc2V0WCAqPSAtMTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggdGhlIHNlbGVjdCBvdmVyZmxvd3Mgb24gZWFjaCBzaWRlLlxuICAgIGNvbnN0IGxlZnRPdmVyZmxvdyA9IDAgLSAob3ZlcmxheVJlY3QubGVmdCArIG9mZnNldFggLSAoaXNSdGwgPyBwYWRkaW5nV2lkdGggOiAwKSk7XG4gICAgY29uc3QgcmlnaHRPdmVyZmxvdyA9IG92ZXJsYXlSZWN0LnJpZ2h0ICsgb2Zmc2V0WCAtIHZpZXdwb3J0U2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICArIChpc1J0bCA/IDAgOiBwYWRkaW5nV2lkdGgpO1xuXG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgb3ZlcmZsb3dzIG9uIGVpdGhlciBzaWRlLCByZWR1Y2UgdGhlIG9mZnNldCB0byBhbGxvdyBpdCB0byBmaXQuXG4gICAgaWYgKGxlZnRPdmVyZmxvdyA+IDApIHtcbiAgICAgIG9mZnNldFggKz0gbGVmdE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfSBlbHNlIGlmIChyaWdodE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCAtPSByaWdodE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvZmZzZXQgZGlyZWN0bHkgaW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGdvIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbiBhbmRcbiAgICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIFwiY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycy4gUm91bmQgdGhlIHZhbHVlIHRvIGF2b2lkXG4gICAgLy8gYmx1cnJ5IGNvbnRlbnQgaW4gc29tZSBicm93c2Vycy5cbiAgICB0aGlzLm92ZXJsYXlEaXIub2Zmc2V0WCA9IE1hdGgucm91bmQob2Zmc2V0WCk7XG4gICAgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSB5LW9mZnNldCBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGVcbiAgICogdG9wIHN0YXJ0IGNvcm5lciBvZiB0aGUgdHJpZ2dlci4gSXQgaGFzIHRvIGJlIGFkanVzdGVkIGluIG9yZGVyIGZvciB0aGVcbiAgICogc2VsZWN0ZWQgb3B0aW9uIHRvIGJlIGFsaWduZWQgb3ZlciB0aGUgdHJpZ2dlciB3aGVuIHRoZSBwYW5lbCBvcGVucy5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkSW5kZXg6IG51bWJlciwgc2Nyb2xsQnVmZmVyOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbWF4T3B0aW9uc0Rpc3BsYXllZCA9IE1hdGguZmxvb3IoU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgLyBpdGVtSGVpZ2h0KTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wOiBudW1iZXI7XG5cbiAgICAvLyBEaXNhYmxlIG9mZnNldCBpZiByZXF1ZXN0ZWQgYnkgdXNlciBieSByZXR1cm5pbmcgMCBhcyB2YWx1ZSB0byBvZmZzZXRcbiAgICBpZiAodGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gMCkge1xuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWRJbmRleCAqIGl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zY3JvbGxUb3AgPT09IG1heFNjcm9sbCkge1xuICAgICAgY29uc3QgZmlyc3REaXNwbGF5ZWRJbmRleCA9IHRoaXMuX2dldEl0ZW1Db3VudCgpIC0gbWF4T3B0aW9uc0Rpc3BsYXllZDtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGlzcGxheUluZGV4ID0gc2VsZWN0ZWRJbmRleCAtIGZpcnN0RGlzcGxheWVkSW5kZXg7XG5cbiAgICAgIC8vIFRoZSBmaXJzdCBpdGVtIGlzIHBhcnRpYWxseSBvdXQgb2YgdGhlIHZpZXdwb3J0LiBUaGVyZWZvcmUgd2UgbmVlZCB0byBjYWxjdWxhdGUgd2hhdFxuICAgICAgLy8gcG9ydGlvbiBvZiBpdCBpcyBzaG93biBpbiB0aGUgdmlld3BvcnQgYW5kIGFjY291bnQgZm9yIGl0IGluIG91ciBvZmZzZXQuXG4gICAgICBsZXQgcGFydGlhbEl0ZW1IZWlnaHQgPVxuICAgICAgICAgIGl0ZW1IZWlnaHQgLSAodGhpcy5fZ2V0SXRlbUNvdW50KCkgKiBpdGVtSGVpZ2h0IC0gU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpICUgaXRlbUhlaWdodDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgcGFuZWwgaGVpZ2h0IGlzIGxvbmdlciB0aGFuIHRoZSBoZWlnaHQgb2YgdGhlIG9wdGlvbnMgYWxvbmUsXG4gICAgICAvLyB0aGVyZSBpcyBhbHdheXMgZXh0cmEgcGFkZGluZyBhdCB0aGUgdG9wIG9yIGJvdHRvbSBvZiB0aGUgcGFuZWwuIFdoZW5cbiAgICAgIC8vIHNjcm9sbGVkIHRvIHRoZSB2ZXJ5IGJvdHRvbSwgdGhpcyBwYWRkaW5nIGlzIGF0IHRoZSB0b3Agb2YgdGhlIHBhbmVsIGFuZFxuICAgICAgLy8gbXVzdCBiZSBhZGRlZCB0byB0aGUgb2Zmc2V0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWREaXNwbGF5SW5kZXggKiBpdGVtSGVpZ2h0ICsgcGFydGlhbEl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBvcHRpb24gd2FzIHNjcm9sbGVkIHRvIHRoZSBtaWRkbGUgb2YgdGhlIHBhbmVsIHVzaW5nIGEgc2Nyb2xsIGJ1ZmZlcixcbiAgICAgIC8vIGl0cyBvZmZzZXQgd2lsbCBiZSB0aGUgc2Nyb2xsIGJ1ZmZlciBtaW51cyB0aGUgaGFsZiBoZWlnaHQgdGhhdCB3YXMgYWRkZWQgdG9cbiAgICAgIC8vIGNlbnRlciBpdC5cbiAgICAgIG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCA9IHNjcm9sbEJ1ZmZlciAtIGl0ZW1IZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIFRoZSBmaW5hbCBvZmZzZXQgaXMgdGhlIG9wdGlvbidzIG9mZnNldCBmcm9tIHRoZSB0b3AsIGFkanVzdGVkIGZvciB0aGUgaGVpZ2h0IGRpZmZlcmVuY2UsXG4gICAgLy8gbXVsdGlwbGllZCBieSAtMSB0byBlbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBtb3ZlcyBpbiB0aGUgY29ycmVjdCBkaXJlY3Rpb24gdXAgdGhlIHBhZ2UuXG4gICAgLy8gVGhlIHZhbHVlIGlzIHJvdW5kZWQgdG8gcHJldmVudCBzb21lIGJyb3dzZXJzIGZyb20gYmx1cnJpbmcgdGhlIGNvbnRlbnQuXG4gICAgcmV0dXJuIE1hdGgucm91bmQob3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wICogLTEgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhhdCB0aGUgYXR0ZW1wdGVkIG92ZXJsYXkgcG9zaXRpb24gd2lsbCBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICogSWYgaXQgd2lsbCBub3QgZml0LCB0cmllcyB0byBhZGp1c3QgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgdGhlIGFzc29jaWF0ZWRcbiAgICogeS1vZmZzZXQgc28gdGhlIHBhbmVsIGNhbiBvcGVuIGZ1bGx5IG9uLXNjcmVlbi4gSWYgaXQgc3RpbGwgd29uJ3QgZml0LFxuICAgKiBzZXRzIHRoZSBvZmZzZXQgYmFjayB0byAwIHRvIGFsbG93IHRoZSBmYWxsYmFjayBwb3NpdGlvbiB0byB0YWtlIG92ZXIuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGw6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRTaXplID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNpemUoKTtcblxuICAgIGNvbnN0IHRvcFNwYWNlQXZhaWxhYmxlID0gdGhpcy5fdHJpZ2dlclJlY3QudG9wIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgY29uc3QgYm90dG9tU3BhY2VBdmFpbGFibGUgPVxuICAgICAgICB2aWV3cG9ydFNpemUuaGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuYm90dG9tIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG5cbiAgICBjb25zdCBwYW5lbEhlaWdodFRvcCA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpO1xuICAgIGNvbnN0IHRvdGFsUGFuZWxIZWlnaHQgPVxuICAgICAgICBNYXRoLm1pbih0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBwYW5lbEhlaWdodEJvdHRvbSA9IHRvdGFsUGFuZWxIZWlnaHQgLSBwYW5lbEhlaWdodFRvcCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodDtcblxuICAgIGlmIChwYW5lbEhlaWdodEJvdHRvbSA+IGJvdHRvbVNwYWNlQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLl9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tLCBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG4gICAgfSBlbHNlIGlmIChwYW5lbEhlaWdodFRvcCA+IHRvcFNwYWNlQXZhaWxhYmxlKSB7XG4gICAgIHRoaXMuX2FkanVzdFBhbmVsRG93bihwYW5lbEhlaWdodFRvcCwgdG9wU3BhY2VBdmFpbGFibGUsIG1heFNjcm9sbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRqdXN0cyB0aGUgb3ZlcmxheSBwYW5lbCB1cCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tOiBudW1iZXIsIGJvdHRvbVNwYWNlQXZhaWxhYmxlOiBudW1iZXIpIHtcbiAgICAvLyBCcm93c2VycyBpZ25vcmUgZnJhY3Rpb25hbCBzY3JvbGwgb2Zmc2V0cywgc28gd2UgbmVlZCB0byByb3VuZC5cbiAgICBjb25zdCBkaXN0YW5jZUJlbG93Vmlld3BvcnQgPSBNYXRoLnJvdW5kKHBhbmVsSGVpZ2h0Qm90dG9tIC0gYm90dG9tU3BhY2VBdmFpbGFibGUpO1xuXG4gICAgLy8gU2Nyb2xscyB0aGUgcGFuZWwgdXAgYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgdXAgaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgdG9wLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGUgcGFuZWxcbiAgICAvLyBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2VcbiAgICAvLyBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA8PSAwKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIGJvdHRvbSAwcHhgO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIGRvd24gdG8gZml0IGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wOiBudW1iZXIsIHRvcFNwYWNlQXZhaWxhYmxlOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQWJvdmVWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRUb3AgLSB0b3BTcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCBkb3duIGJ5IHRoZSBkaXN0YW5jZSBpdCB3YXMgZXh0ZW5kaW5nIHBhc3QgdGhlIGJvdW5kYXJ5LCB0aGVuXG4gICAgLy8gYWRqdXN0cyB0aGUgb2Zmc2V0IGJ5IHRoYXQgYW1vdW50IHRvIG1vdmUgdGhlIHBhbmVsIGRvd24gaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGVcbiAgICAvLyBwYW5lbCBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uXG4gICAgLy8gdG8gdGFrZSBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IG1heFNjcm9sbDtcbiAgICAgIHRoaXMuX29mZnNldFkgPSAwO1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gYDUwJSB0b3AgMHB4YDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdHJhbnNmb3JtIG9yaWdpbiBwb2ludCBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk6IHN0cmluZyB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25IZWlnaHRBZGp1c3RtZW50ID0gKGl0ZW1IZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5oZWlnaHQpIC8gMjtcbiAgICBjb25zdCBvcmlnaW5ZID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSkgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50ICsgaXRlbUhlaWdodCAvIDI7XG4gICAgcmV0dXJuIGA1MCUgJHtvcmlnaW5ZfXB4IDBweGA7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGl0ZW1zIGluIHRoZSBzZWxlY3QuIFRoaXMgaW5jbHVkZXMgb3B0aW9ucyBhbmQgZ3JvdXAgbGFiZWxzLiAqL1xuICBwcml2YXRlIF9nZXRJdGVtQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxlbmd0aCArIHRoaXMub3B0aW9uR3JvdXBzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldEl0ZW1IZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHJpZ2dlckZvbnRTaXplICogU0VMRUNUX0lURU1fSEVJR0hUX0VNO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZWRieSA9IGlkcy5qb2luKCcgJyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgICB0aGlzLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW4gfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=