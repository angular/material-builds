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
import { A, DOWN_ARROW, ENTER, hasModifierKey, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, Overlay, } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, Self, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, ErrorStateMatcher, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, mixinDisabled, mixinDisableRipple, mixinErrorState, mixinTabIndex, } from '@angular/material/core';
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
/** The max height of the select's overlay panel. */
export const SELECT_PANEL_MAX_HEIGHT = 256;
/** The panel's padding on the x-axis. */
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
const _MatSelectMixinBase = mixinDisableRipple(mixinTabIndex(mixinDisabled(mixinErrorState(class {
    constructor(_elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl) {
        this._elementRef = _elementRef;
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
    }
}))));
/**
 * Injection token that can be used to reference instances of `MatSelectTrigger`. It serves as
 * alternative token to the actual `MatSelectTrigger` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_SELECT_TRIGGER = new InjectionToken('MatSelectTrigger');
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
export class MatSelectTrigger {
}
MatSelectTrigger.decorators = [
    { type: Directive, args: [{
                selector: 'mat-select-trigger',
                providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }],
            },] }
];
/** Base class with all of the `MatSelect` functionality. */
export class _MatSelectBase extends _MatSelectMixinBase {
    constructor(_viewportRuler, _changeDetectorRef, _ngZone, _defaultErrorStateMatcher, elementRef, _dir, _parentForm, _parentFormGroup, _parentFormField, ngControl, tabIndex, scrollStrategyFactory, _liveAnnouncer, _defaultOptions) {
        var _a, _b, _c;
        super(elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        this._viewportRuler = _viewportRuler;
        this._changeDetectorRef = _changeDetectorRef;
        this._ngZone = _ngZone;
        this._dir = _dir;
        this._parentFormField = _parentFormField;
        this._liveAnnouncer = _liveAnnouncer;
        this._defaultOptions = _defaultOptions;
        /** Whether or not the overlay panel is open. */
        this._panelOpen = false;
        /** Comparison function to specify which option is displayed. Defaults to object equality. */
        this._compareWith = (o1, o2) => o1 === o2;
        /** Unique id for this input. */
        this._uid = `mat-select-${nextUniqueId++}`;
        /** Current `ariar-labelledby` value for the select trigger. */
        this._triggerAriaLabelledBy = null;
        /** Emits whenever the component is destroyed. */
        this._destroy = new Subject();
        /** `View -> model callback called when value changes` */
        this._onChange = () => { };
        /** `View -> model callback called when select has been touched` */
        this._onTouched = () => { };
        /** ID for the DOM node containing the select's value. */
        this._valueId = `mat-select-value-${nextUniqueId++}`;
        /** Emits when the panel element is finished transforming in. */
        this._panelDoneAnimatingStream = new Subject();
        this._overlayPanelClass = ((_a = this._defaultOptions) === null || _a === void 0 ? void 0 : _a.overlayPanelClass) || '';
        this._focused = false;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mat-select';
        this._required = false;
        this._multiple = false;
        this._disableOptionCentering = (_c = (_b = this._defaultOptions) === null || _b === void 0 ? void 0 : _b.disableOptionCentering) !== null && _c !== void 0 ? _c : false;
        /** Aria label of the select. */
        this.ariaLabel = '';
        /** Combined stream of all of the child options' change events. */
        this.optionSelectionChanges = defer(() => {
            const options = this.options;
            if (options) {
                return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))));
            }
            return this._ngZone.onStable
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
        // Note that we only want to set this when the defaults pass it in, otherwise it should
        // stay as `undefined` so that it falls back to the default in the key manager.
        if ((_defaultOptions === null || _defaultOptions === void 0 ? void 0 : _defaultOptions.typeaheadDebounceInterval) != null) {
            this._typeaheadDebounceInterval = _defaultOptions.typeaheadDebounceInterval;
        }
        this._scrollStrategyFactory = scrollStrategyFactory;
        this._scrollStrategy = this._scrollStrategyFactory();
        this.tabIndex = parseInt(tabIndex) || 0;
        // Force setter to be called in case id was not specified.
        this.id = this.id;
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
        if (this._selectionModel && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        // Always re-assign an array, because it might have been mutated.
        if (newValue !== this._value || (this._multiple && Array.isArray(newValue))) {
            if (this.options) {
                this._setSelectionByValue(newValue);
            }
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
            .subscribe(() => this._panelDoneAnimating(this.panelOpen));
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
        const newAriaLabelledby = this._getTriggerAriaLabelledby();
        // We have to manage setting the `aria-labelledby` ourselves, because part of its value
        // is computed as a result of a content query which can cause this binding to trigger a
        // "changed after checked" error.
        if (newAriaLabelledby !== this._triggerAriaLabelledBy) {
            const element = this._elementRef.nativeElement;
            this._triggerAriaLabelledBy = newAriaLabelledby;
            if (newAriaLabelledby) {
                element.setAttribute('aria-labelledby', newAriaLabelledby);
            }
            else {
                element.removeAttribute('aria-labelledby');
            }
        }
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
        if (this._canOpen()) {
            this._panelOpen = true;
            this._keyManager.withHorizontalOrientation(null);
            this._highlightCorrectOption();
            this._changeDetectorRef.markForCheck();
        }
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
        this.value = value;
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
            manager.onKeydown(event);
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
        if (isArrowKey && event.altKey) {
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
        this._overlayDir.positionChange.pipe(take(1)).subscribe(() => {
            this._changeDetectorRef.detectChanges();
            this._positioningSettled();
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
        this._selectionModel.selected.forEach(option => option.setInactiveStyles());
        this._selectionModel.clear();
        if (this.multiple && value) {
            if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw getMatSelectNonArrayValueError();
            }
            value.forEach((currentValue) => this._selectValue(currentValue));
            this._sortValues();
        }
        else {
            const correspondingOption = this._selectValue(value);
            // Shift focus to the active item. Note that we shouldn't do this in multiple
            // mode, because we don't know what option the user interacted with last.
            if (correspondingOption) {
                this._keyManager.updateActiveItem(correspondingOption);
            }
            else if (!this.panelOpen) {
                // Otherwise reset the highlighted option. Note that we only want to do this while
                // closed, because doing it while open can shift the user's focus unnecessarily.
                this._keyManager.updateActiveItem(-1);
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
            // Skip options that are already in the model. This allows us to handle cases
            // where the same primitive value is selected multiple times.
            if (this._selectionModel.isSelected(option)) {
                return false;
            }
            try {
                // Treat null as a special reset value.
                return option.value != null && this._compareWith(option.value, value);
            }
            catch (error) {
                if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
            .withHomeAndEnd()
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
                this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
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
    }
    /** Invoked when an option is clicked. */
    _onSelect(option, isUserInput) {
        const wasSelected = this._selectionModel.isSelected(option);
        if (option.value == null && !this._multiple) {
            option.deselect();
            this._selectionModel.clear();
            if (this.value != null) {
                this._propagateChanges(option.value);
            }
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
        this.selectionChange.emit(this._getChangeEvent(valueToEmit));
        this._changeDetectorRef.markForCheck();
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
    /** Whether the panel is allowed to open. */
    _canOpen() {
        var _a;
        return !this._panelOpen && !this.disabled && ((_a = this.options) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    /** Focuses the select element. */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Gets the aria-labelledby for the select panel. */
    _getPanelAriaLabelledby() {
        var _a;
        if (this.ariaLabel) {
            return null;
        }
        const labelId = (_a = this._parentFormField) === null || _a === void 0 ? void 0 : _a.getLabelId();
        const labelExpression = (labelId ? labelId + ' ' : '');
        return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
    }
    /** Determines the `aria-activedescendant` to be set on the host. */
    _getAriaActiveDescendant() {
        if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
            return this._keyManager.activeItem.id;
        }
        return null;
    }
    /** Gets the aria-labelledby of the select component trigger. */
    _getTriggerAriaLabelledby() {
        var _a;
        if (this.ariaLabel) {
            return null;
        }
        const labelId = (_a = this._parentFormField) === null || _a === void 0 ? void 0 : _a.getLabelId();
        let value = (labelId ? labelId + ' ' : '') + this._valueId;
        if (this.ariaLabelledby) {
            value += ' ' + this.ariaLabelledby;
        }
        return value;
    }
    /** Called when the overlay panel is done animating. */
    _panelDoneAnimating(isOpen) {
        this.openedChange.emit(isOpen);
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
        return this._panelOpen || !this.empty || (this._focused && !!this._placeholder);
    }
}
_MatSelectBase.decorators = [
    { type: Directive }
];
_MatSelectBase.ctorParameters = () => [
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
_MatSelectBase.propDecorators = {
    trigger: [{ type: ViewChild, args: ['trigger',] }],
    panel: [{ type: ViewChild, args: ['panel',] }],
    _overlayDir: [{ type: ViewChild, args: [CdkConnectedOverlay,] }],
    panelClass: [{ type: Input }],
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
export class MatSelect extends _MatSelectBase {
    constructor() {
        super(...arguments);
        /** The scroll position of the overlay panel, calculated to center the selected option. */
        this._scrollTop = 0;
        /** The cached font-size of the trigger element. */
        this._triggerFontSize = 0;
        /** The value of the select panel's transform-origin property. */
        this._transformOrigin = 'top';
        /**
         * The y-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text.
         * when the panel opens. Will change based on the y-position of the selected option.
         */
        this._offsetY = 0;
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
    ngOnInit() {
        super.ngOnInit();
        this._viewportRuler.change().pipe(takeUntil(this._destroy)).subscribe(() => {
            if (this.panelOpen) {
                this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    open() {
        if (super._canOpen()) {
            super.open();
            this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
            // Note: The computed font-size will be a string pixel value (e.g. "16px").
            // `parseInt` ignores the trailing 'px' and converts this to a number.
            this._triggerFontSize =
                parseInt(getComputedStyle(this.trigger.nativeElement).fontSize || '0');
            this._calculateOverlayPosition();
            // Set the font size on the panel element once it exists.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._triggerFontSize && this._overlayDir.overlayRef &&
                    this._overlayDir.overlayRef.overlayElement) {
                    this._overlayDir.overlayRef.overlayElement.style.fontSize = `${this._triggerFontSize}px`;
                }
            });
        }
    }
    /** Scrolls the active option into view. */
    _scrollOptionIntoView(index) {
        const labelCount = _countGroupLabelsBeforeOption(index, this.options, this.optionGroups);
        const itemHeight = this._getItemHeight();
        this.panel.nativeElement.scrollTop = _getOptionScrollPosition((index + labelCount) * itemHeight, itemHeight, this.panel.nativeElement.scrollTop, SELECT_PANEL_MAX_HEIGHT);
    }
    _positioningSettled() {
        this._calculateOverlayOffsetX();
        this.panel.nativeElement.scrollTop = this._scrollTop;
    }
    _panelDoneAnimating(isOpen) {
        if (this.panelOpen) {
            this._scrollTop = 0;
        }
        else {
            this._overlayDir.offsetX = 0;
            this._changeDetectorRef.markForCheck();
        }
        super._panelDoneAnimating(isOpen);
    }
    _getChangeEvent(value) {
        return new MatSelectChange(this, value);
    }
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     */
    _calculateOverlayOffsetX() {
        const overlayRect = this._overlayDir.overlayRef.overlayElement.getBoundingClientRect();
        const viewportSize = this._viewportRuler.getViewportSize();
        const isRtl = this._isRtl();
        const paddingWidth = this.multiple ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X :
            SELECT_PANEL_PADDING_X * 2;
        let offsetX;
        // Adjust the offset, depending on the option padding.
        if (this.multiple) {
            offsetX = SELECT_MULTIPLE_PANEL_PADDING_X;
        }
        else if (this.disableOptionCentering) {
            offsetX = SELECT_PANEL_PADDING_X;
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
        this._overlayDir.offsetX = Math.round(offsetX);
        this._overlayDir.overlayRef.updatePosition();
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
        if (this.disableOptionCentering) {
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
    /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
    _calculateOverlayPosition() {
        const itemHeight = this._getItemHeight();
        const items = this._getItemCount();
        const panelHeight = Math.min(items * itemHeight, SELECT_PANEL_MAX_HEIGHT);
        const scrollContainerHeight = items * itemHeight;
        // The farthest the panel can be scrolled before it hits the bottom
        const maxScroll = scrollContainerHeight - panelHeight;
        // If no value is selected we open the popup to the first item.
        let selectedOptionOffset;
        if (this.empty) {
            selectedOptionOffset = 0;
        }
        else {
            selectedOptionOffset =
                Math.max(this.options.toArray().indexOf(this._selectionModel.selected[0]), 0);
        }
        selectedOptionOffset += _countGroupLabelsBeforeOption(selectedOptionOffset, this.options, this.optionGroups);
        // We must maintain a scroll buffer so the selected option will be scrolled to the
        // center of the overlay panel rather than the top.
        const scrollBuffer = panelHeight / 2;
        this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, scrollBuffer, maxScroll);
        this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
        this._checkOverlayWithinViewport(maxScroll);
    }
    /** Sets the transform origin point based on the selected option. */
    _getOriginBasedOnOption() {
        const itemHeight = this._getItemHeight();
        const optionHeightAdjustment = (itemHeight - this._triggerRect.height) / 2;
        const originY = Math.abs(this._offsetY) - optionHeightAdjustment + itemHeight / 2;
        return `50% ${originY}px 0px`;
    }
    /** Calculates the height of the select's options. */
    _getItemHeight() {
        return this._triggerFontSize * SELECT_ITEM_HEIGHT_EM;
    }
    /** Calculates the amount of items in the select. This includes options and group labels. */
    _getItemCount() {
        return this.options.length + this.optionGroups.length;
    }
}
MatSelect.decorators = [
    { type: Component, args: [{
                selector: 'mat-select',
                exportAs: 'matSelect',
                template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
                inputs: ['disabled', 'disableRipple', 'tabIndex'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'role': 'combobox',
                    'aria-autocomplete': 'none',
                    // TODO(crisbeto): the value for aria-haspopup should be `listbox`, but currently it's difficult
                    // to sync into Google, because of an outdated automated a11y check which flags it as an invalid
                    // value. At some point we should try to switch it back to being `listbox`.
                    'aria-haspopup': 'true',
                    'class': 'mat-select',
                    '[attr.id]': 'id',
                    '[attr.tabindex]': 'tabIndex',
                    '[attr.aria-controls]': 'panelOpen ? id + "-panel" : null',
                    '[attr.aria-expanded]': 'panelOpen',
                    '[attr.aria-label]': 'ariaLabel || null',
                    '[attr.aria-required]': 'required.toString()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.aria-invalid]': 'errorState',
                    '[attr.aria-describedby]': '_ariaDescribedby || null',
                    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
                    '[class.mat-select-disabled]': 'disabled',
                    '[class.mat-select-invalid]': 'errorState',
                    '[class.mat-select-required]': 'required',
                    '[class.mat-select-empty]': 'empty',
                    '[class.mat-select-multiple]': 'multiple',
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
                styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-table;cursor:pointer;position:relative;box-sizing:border-box}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-select-value{display:table-cell;max-width:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{display:table-cell;vertical-align:middle}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:transparent;-webkit-text-fill-color:transparent;transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px}\n"]
            },] }
];
MatSelect.propDecorators = {
    options: [{ type: ContentChildren, args: [MatOption, { descendants: true },] }],
    optionGroups: [{ type: ContentChildren, args: [MAT_OPTGROUP, { descendants: true },] }],
    customTrigger: [{ type: ContentChild, args: [MAT_SELECT_TRIGGER,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLDBCQUEwQixFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsQ0FBQyxFQUNELFVBQVUsRUFDVixLQUFLLEVBQ0wsY0FBYyxFQUNkLFVBQVUsRUFDVixXQUFXLEVBQ1gsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFDTCxtQkFBbUIsRUFFbkIsT0FBTyxHQUVSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFFTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBRVQsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBSU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsSUFBSSxFQUVKLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0YsT0FBTyxFQUNMLDZCQUE2QixFQUM3Qix3QkFBd0IsRUFJeEIsaUJB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RUFBRSxVQUFVO29CQUN6QyxXQUFXLEVBQUUsd0JBQXdCO29CQUNyQyxTQUFTLEVBQUUsWUFBWTtvQkFDdkIsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCO2dCQUNELFVBQVUsRUFBRTtvQkFDVixtQkFBbUIsQ0FBQyxrQkFBa0I7b0JBQ3RDLG1CQUFtQixDQUFDLGNBQWM7aUJBQ25DO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFDO29CQUN0RCxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFDO2lCQUMvRDs7YUFDRjs7O3NCQXFCRSxlQUFlLFNBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzsyQkFFOUMsZUFBZSxTQUFDLFlBQVksRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7NEJBRWpELFlBQVksU0FBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciwgTGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIFNQQUNFLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENka0Nvbm5lY3RlZE92ZXJsYXksXG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTZWxmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIEZvcm1Hcm91cERpcmVjdGl2ZSwgTmdDb250cm9sLCBOZ0Zvcm19IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBIYXNUYWJJbmRleCxcbiAgTUFUX09QVEdST1VQLFxuICBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsXG4gIE1hdE9wdGdyb3VwLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkVycm9yU3RhdGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIF9NYXRPcHRpb25CYXNlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgYWxpZ25tZW50IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gb3ZlclxuICogdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAqL1xuXG4vKiogVGhlIG1heCBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgPSAyNTY7XG5cbi8qKiBUaGUgcGFuZWwncyBwYWRkaW5nIG9uIHRoZSB4LWF4aXMuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCA9IDE2O1xuXG4vKiogVGhlIHBhbmVsJ3MgeCBheGlzIHBhZGRpbmcgaWYgaXQgaXMgaW5kZW50ZWQgKGUuZy4gdGhlcmUgaXMgYW4gb3B0aW9uIGdyb3VwKS4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWCA9IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuXG4vKiogVGhlIGhlaWdodCBvZiB0aGUgc2VsZWN0IGl0ZW1zIGluIGBlbWAgdW5pdHMuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX0lURU1fSEVJR0hUX0VNID0gMztcblxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogUmV2ZXJ0IHRvIGEgY29uc3RhbnQgYWZ0ZXIgMjAxOCBzcGVjIHVwZGF0ZXMgYXJlIGZ1bGx5IG1lcmdlZC5cbi8qKlxuICogRGlzdGFuY2UgYmV0d2VlbiB0aGUgcGFuZWwgZWRnZSBhbmQgdGhlIG9wdGlvbiB0ZXh0IGluXG4gKiBtdWx0aS1zZWxlY3Rpb24gbW9kZS5cbiAqXG4gKiBDYWxjdWxhdGVkIGFzOlxuICogKFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAxLjUpICsgMTYgPSA0MFxuICogVGhlIHBhZGRpbmcgaXMgbXVsdGlwbGllZCBieSAxLjUgYmVjYXVzZSB0aGUgY2hlY2tib3gncyBtYXJnaW4gaXMgaGFsZiB0aGUgcGFkZGluZy5cbiAqIFRoZSBjaGVja2JveCB3aWR0aCBpcyAxNnB4LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX01VTFRJUExFX1BBTkVMX1BBRERJTkdfWCA9IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAxLjUgKyAxNjtcblxuLyoqXG4gKiBUaGUgc2VsZWN0IHBhbmVsIHdpbGwgb25seSBcImZpdFwiIGluc2lkZSB0aGUgdmlld3BvcnQgaWYgaXQgaXMgcG9zaXRpb25lZCBhdFxuICogdGhpcyB2YWx1ZSBvciBtb3JlIGF3YXkgZnJvbSB0aGUgdmlld3BvcnQgYm91bmRhcnkuXG4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORyA9IDg7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSBzZWxlY3QgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LXNlbGVjdC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOlxuICAgICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHNlbGVjdCBtb2R1bGUuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNlbGVjdENvbmZpZyB7XG4gIC8qKiBXaGV0aGVyIG9wdGlvbiBjZW50ZXJpbmcgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nPzogYm9vbGVhbjtcblxuICAvKiogVGltZSB0byB3YWl0IGluIG1pbGxpc2Vjb25kcyBhZnRlciB0aGUgbGFzdCBrZXlzdHJva2UgYmVmb3JlIG1vdmluZyBmb2N1cyB0byBhbiBpdGVtLiAqL1xuICB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgdGhlIHNlbGVjdCBtb2R1bGUuICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U2VsZWN0Q29uZmlnPignTUFUX1NFTEVDVF9DT05GSUcnKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgdmFsdWUgaGFzIGNoYW5nZWQuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VsZWN0IHRoYXQgZW1pdHRlZCB0aGUgY2hhbmdlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNlbGVjdCxcbiAgICAvKiogQ3VycmVudCB2YWx1ZSBvZiB0aGUgc2VsZWN0IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHZhbHVlOiBhbnkpIHsgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNlbGVjdC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U2VsZWN0TWl4aW5CYXNlID1cbiAgbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChtaXhpbkVycm9yU3RhdGUoY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wpIHt9XG4gIH0pKSkpO1xuXG5cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKipcbiAqIEFsbG93cyB0aGUgdXNlciB0byBjdXN0b21pemUgdGhlIHRyaWdnZXIgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0LXRyaWdnZXInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NFTEVDVF9UUklHR0VSLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0VHJpZ2dlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RUcmlnZ2VyIHt9XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0U2VsZWN0YCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFNlbGVjdEJhc2U8Qz4gZXh0ZW5kcyBfTWF0U2VsZWN0TWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgsXG4gICAgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBDYW5VcGRhdGVFcnJvclN0YXRlLCBDYW5EaXNhYmxlUmlwcGxlIHtcblxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIHNlbGVjdCBvcHRpb25zLiAqL1xuICBhYnN0cmFjdCBvcHRpb25zOiBRdWVyeUxpc3Q8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGZvciB0aGUgbm9uLU1EQyBzZWxlY3QsIGJ1dCBpdCdzIHRlY2huaWNhbGx5IGFcbiAgLy8gcHVibGljIEFQSSBzbyB3ZSBoYXZlIHRvIGtlZXAgaXQuIEl0IHNob3VsZCBiZSBkZXByZWNhdGVkIGFuZCByZW1vdmVkIGV2ZW50dWFsbHkuXG4gIC8qKiBBbGwgb2YgdGhlIGRlZmluZWQgZ3JvdXBzIG9mIG9wdGlvbnMuICovXG4gIGFic3RyYWN0IG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogVXNlci1zdXBwbGllZCBvdmVycmlkZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBhYnN0cmFjdCBjdXN0b21UcmlnZ2VyOiB7fTtcblxuICAvKipcbiAgICogVGhpcyBwb3NpdGlvbiBjb25maWcgZW5zdXJlcyB0aGF0IHRoZSB0b3AgXCJzdGFydFwiIGNvcm5lciBvZiB0aGUgb3ZlcmxheVxuICAgKiBpcyBhbGlnbmVkIHdpdGggd2l0aCB0aGUgdG9wIFwic3RhcnRcIiBvZiB0aGUgb3JpZ2luIGJ5IGRlZmF1bHQgKG92ZXJsYXBwaW5nXG4gICAqIHRoZSB0cmlnZ2VyIGNvbXBsZXRlbHkpLiBJZiB0aGUgcGFuZWwgY2Fubm90IGZpdCBiZWxvdyB0aGUgdHJpZ2dlciwgaXRcbiAgICogd2lsbCBmYWxsIGJhY2sgdG8gYSBwb3NpdGlvbiBhYm92ZSB0aGUgdHJpZ2dlci5cbiAgICovXG4gIGFic3RyYWN0IF9wb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW107XG5cbiAgLyoqIFNjcm9sbHMgYSBwYXJ0aWN1bGFyIG9wdGlvbiBpbnRvIHRoZSB2aWV3LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3Njcm9sbE9wdGlvbkludG9WaWV3KGluZGV4OiBudW1iZXIpOiB2b2lkO1xuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgcGFuZWwgaGFzIGJlZW4gb3BlbmVkIGFuZCB0aGUgb3ZlcmxheSBoYXMgc2V0dGxlZCBvbiBpdHMgZmluYWwgcG9zaXRpb24uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcG9zaXRpb25pbmdTZXR0bGVkKCk6IHZvaWQ7XG5cbiAgLyoqIENyZWF0ZXMgYSBjaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGVtaXR0ZWQgYnkgdGhlIHNlbGVjdC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRDaGFuZ2VFdmVudCh2YWx1ZTogYW55KTogQztcblxuICAvKiogRmFjdG9yeSBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhIHNjcm9sbCBzdHJhdGVneSBmb3IgdGhpcyBzZWxlY3QuICovXG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIHByaXZhdGUgX3BhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIC8qKiBDb21wYXJpc29uIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggb3B0aW9uIGlzIGRpc3BsYXllZC4gRGVmYXVsdHMgdG8gb2JqZWN0IGVxdWFsaXR5LiAqL1xuICBwcml2YXRlIF9jb21wYXJlV2l0aCA9IChvMTogYW55LCBvMjogYW55KSA9PiBvMSA9PT0gbzI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfdWlkID0gYG1hdC1zZWxlY3QtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBDdXJyZW50IGBhcmlhci1sYWJlbGxlZGJ5YCB2YWx1ZSBmb3IgdGhlIHNlbGVjdCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyQXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIG9uIHRoZSBzZWxlY3QgZm9yIGltcHJvdmVkIGExMXkuICovXG4gIF9hcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogRGVhbHMgd2l0aCB0aGUgc2VsZWN0aW9uIGxvZ2ljLiAqL1xuICBfc2VsZWN0aW9uTW9kZWw6IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj47XG5cbiAgLyoqIE1hbmFnZXMga2V5Ym9hcmQgZXZlbnRzIGZvciBvcHRpb25zIGluIHRoZSBwYW5lbC4gKi9cbiAgX2tleU1hbmFnZXI6IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPE1hdE9wdGlvbj47XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gc2VsZWN0IGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogSUQgZm9yIHRoZSBET00gbm9kZSBjb250YWluaW5nIHRoZSBzZWxlY3QncyB2YWx1ZS4gKi9cbiAgX3ZhbHVlSWQgPSBgbWF0LXNlbGVjdC12YWx1ZS0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHBhbmVsIGVsZW1lbnQgaXMgZmluaXNoZWQgdHJhbnNmb3JtaW5nIGluLiAqL1xuICByZWFkb25seSBfcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IHdpbGwgYmUgdXNlZCB0byBoYW5kbGUgc2Nyb2xsaW5nIHdoaWxlIHRoZSBzZWxlY3QgcGFuZWwgaXMgb3Blbi4gKi9cbiAgX3Njcm9sbFN0cmF0ZWd5OiBTY3JvbGxTdHJhdGVneTtcblxuICBfb3ZlcmxheVBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/Lm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWQgfHwgdGhpcy5fcGFuZWxPcGVuO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogQSBuYW1lIGZvciB0aGlzIGNvbnRyb2wgdGhhdCBjYW4gYmUgdXNlZCBieSBgbWF0LWZvcm0tZmllbGRgLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtc2VsZWN0JztcblxuICAvKiogVHJpZ2dlciB0aGF0IG9wZW5zIHRoZSBzZWxlY3QuICovXG4gIEBWaWV3Q2hpbGQoJ3RyaWdnZXInKSB0cmlnZ2VyOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBQYW5lbCBjb250YWluaW5nIHRoZSBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKiogT3ZlcmxheSBwYW5lIGNvbnRhaW5pbmcgdGhlIG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ29ubmVjdGVkT3ZlcmxheSlcbiAgcHJvdGVjdGVkIF9vdmVybGF5RGlyOiBDZGtDb25uZWN0ZWRPdmVybGF5O1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgc2VsZWN0IHBhbmVsLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICBASW5wdXQoKSBwYW5lbENsYXNzOiBzdHJpbmd8c3RyaW5nW118U2V0PHN0cmluZz58e1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgLyoqIFBsYWNlaG9sZGVyIHRvIGJlIHNob3duIGlmIG5vIHZhbHVlIGhhcyBiZWVuIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyOyB9XG4gIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgc2hvdWxkIGJlIGFsbG93ZWQgdG8gc2VsZWN0IG11bHRpcGxlIG9wdGlvbnMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX211bHRpcGxlOyB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0RHluYW1pY011bHRpcGxlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tdWx0aXBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBjZW50ZXIgdGhlIGFjdGl2ZSBvcHRpb24gb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVPcHRpb25DZW50ZXJpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nOyB9XG4gIHNldCBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID8/IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcHRpb24gdmFsdWVzIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlcy4gVGhlIGZpcnN0IGFyZ3VtZW50XG4gICAqIGlzIGEgdmFsdWUgZnJvbSBhbiBvcHRpb24uIFRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3Rpb24uIEEgYm9vbGVhblxuICAgKiBzaG91bGQgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY29tcGFyZVdpdGgoKSB7IHJldHVybiB0aGlzLl9jb21wYXJlV2l0aDsgfVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uRnVuY3Rpb25WYWx1ZUVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICAvLyBBIGRpZmZlcmVudCBjb21wYXJhdG9yIG1lYW5zIHRoZSBzZWxlY3Rpb24gY291bGQgY2hhbmdlLlxuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2VsZWN0IGNvbnRyb2wuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fdmFsdWU7IH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAvLyBBbHdheXMgcmUtYXNzaWduIGFuIGFycmF5LCBiZWNhdXNlIGl0IG1pZ2h0IGhhdmUgYmVlbiBtdXRhdGVkLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUgfHwgKHRoaXMuX211bHRpcGxlICYmIEFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgc2VsZWN0LiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBPYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKSBvdmVycmlkZSBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7IH1cbiAgc2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIHNvcnQgdGhlIHZhbHVlcyBpbiBhIHNlbGVjdCBpbiBtdWx0aXBsZSBtb2RlLlxuICAgKiBGb2xsb3dzIHRoZSBzYW1lIGxvZ2ljIGFzIGBBcnJheS5wcm90b3R5cGUuc29ydGAuXG4gICAqL1xuICBASW5wdXQoKSBzb3J0Q29tcGFyYXRvcjogKGE6IE1hdE9wdGlvbiwgYjogTWF0T3B0aW9uLCBvcHRpb25zOiBNYXRPcHRpb25bXSkgPT4gbnVtYmVyO1xuXG4gIC8qKiBVbmlxdWUgaWQgb2YgdGhlIGVsZW1lbnQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5faWQ7IH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgb3B0aW9ucycgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uQ2hhbmdlczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgob3B0aW9ucyksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiBtZXJnZSguLi5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9uU2VsZWN0aW9uQ2hhbmdlKSkpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9uZ1pvbmUub25TdGFibGVcbiAgICAgIC5waXBlKHRha2UoMSksIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMpKTtcbiAgfSkgYXMgT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBwYW5lbCBoYXMgYmVlbiB0b2dnbGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgcmVhZG9ubHkgX29wZW5lZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLm9wZW5lZENoYW5nZS5waXBlKGZpbHRlcihvID0+IG8pLCBtYXAoKCkgPT4ge30pKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKSByZWFkb25seSBfY2xvc2VkU3RyZWFtOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKG8gPT4gIW8pLCBtYXAoKCkgPT4ge30pKTtcblxuICAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0ZWQgdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBieSB0aGUgdXNlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPEM+ID0gbmV3IEV2ZW50RW1pdHRlcjxDPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNlbGVjdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJvdGVjdGVkIF9wYXJlbnRGb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCxcbiAgICBAU2VsZigpIEBPcHRpb25hbCgpIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBASW5qZWN0KE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk6IGFueSxcbiAgICBwcml2YXRlIF9saXZlQW5ub3VuY2VyOiBMaXZlQW5ub3VuY2VyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1NFTEVDVF9DT05GSUcpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0U2VsZWN0Q29uZmlnKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlciwgX3BhcmVudEZvcm0sXG4gICAgICAgICAgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gTm90ZTogd2UgcHJvdmlkZSB0aGUgdmFsdWUgYWNjZXNzb3IgdGhyb3VnaCBoZXJlLCBpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgYHByb3ZpZGVyc2AgdG8gYXZvaWQgcnVubmluZyBpbnRvIGEgY2lyY3VsYXIgaW1wb3J0LlxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBzZXQgdGhpcyB3aGVuIHRoZSBkZWZhdWx0cyBwYXNzIGl0IGluLCBvdGhlcndpc2UgaXQgc2hvdWxkXG4gICAgLy8gc3RheSBhcyBgdW5kZWZpbmVkYCBzbyB0aGF0IGl0IGZhbGxzIGJhY2sgdG8gdGhlIGRlZmF1bHQgaW4gdGhlIGtleSBtYW5hZ2VyLlxuICAgIGlmIChfZGVmYXVsdE9wdGlvbnM/LnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCA9IF9kZWZhdWx0T3B0aW9ucy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeSA9IHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHRoaXMuX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeSgpO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIC8vIEZvcmNlIHNldHRlciB0byBiZSBjYWxsZWQgaW4gY2FzZSBpZCB3YXMgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLmlkID0gdGhpcy5pZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj4odGhpcy5tdWx0aXBsZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuXG4gICAgLy8gV2UgbmVlZCBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGhlcmUsIGJlY2F1c2Ugc29tZSBicm93c2VycyB3aWxsXG4gICAgLy8gZmlyZSB0aGUgYW5pbWF0aW9uIGVuZCBldmVudCB0d2ljZSBmb3IgdGhlIHNhbWUgYW5pbWF0aW9uLiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW1cbiAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcGFuZWxEb25lQW5pbWF0aW5nKHRoaXMucGFuZWxPcGVuKSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5pdEtleU1hbmFnZXIoKTtcblxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5hZGRlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0KCkpO1xuICAgICAgZXZlbnQucmVtb3ZlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uZGVzZWxlY3QoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRPcHRpb25zKCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgY29uc3QgbmV3QXJpYUxhYmVsbGVkYnkgPSB0aGlzLl9nZXRUcmlnZ2VyQXJpYUxhYmVsbGVkYnkoKTtcblxuICAgIC8vIFdlIGhhdmUgdG8gbWFuYWdlIHNldHRpbmcgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIG91cnNlbHZlcywgYmVjYXVzZSBwYXJ0IG9mIGl0cyB2YWx1ZVxuICAgIC8vIGlzIGNvbXB1dGVkIGFzIGEgcmVzdWx0IG9mIGEgY29udGVudCBxdWVyeSB3aGljaCBjYW4gY2F1c2UgdGhpcyBiaW5kaW5nIHRvIHRyaWdnZXIgYVxuICAgIC8vIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3IuXG4gICAgaWYgKG5ld0FyaWFMYWJlbGxlZGJ5ICE9PSB0aGlzLl90cmlnZ2VyQXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fdHJpZ2dlckFyaWFMYWJlbGxlZEJ5ID0gbmV3QXJpYUxhYmVsbGVkYnk7XG4gICAgICBpZiAobmV3QXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIG5ld0FyaWFMYWJlbGxlZGJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5uZ0NvbnRyb2wpIHtcbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAvLyBVcGRhdGluZyB0aGUgZGlzYWJsZWQgc3RhdGUgaXMgaGFuZGxlZCBieSBgbWl4aW5EaXNhYmxlZGAsIGJ1dCB3ZSBuZWVkIHRvIGFkZGl0aW9uYWxseSBsZXRcbiAgICAvLyB0aGUgcGFyZW50IGZvcm0gZmllbGQga25vdyB0byBydW4gY2hhbmdlIGRldGVjdGlvbiB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0ZSBjaGFuZ2VzLlxuICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddKSB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXNbJ3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwnXSAmJiB0aGlzLl9rZXlNYW5hZ2VyKSB7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhUeXBlQWhlYWQodGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgb3ZlcmxheSBwYW5lbCBvcGVuIG9yIGNsb3NlZC4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMucGFuZWxPcGVuID8gdGhpcy5jbG9zZSgpIDogdGhpcy5vcGVuKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgdGhpcy5fcGFuZWxPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbihudWxsKTtcbiAgICAgIHRoaXMuX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG92ZXJsYXkgcGFuZWwgYW5kIGZvY3VzZXMgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgdGhpcy5fcGFuZWxPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5faXNSdGwoKSA/ICdydGwnIDogJ2x0cicpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0J3MgdmFsdWUuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgdmFsdWUgdG8gYmUgd3JpdHRlbiB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCdzIHZhbHVlXG4gICAqIGNoYW5nZXMgZnJvbSB1c2VyIGlucHV0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCBpcyBibHVycmVkXG4gICAqIGJ5IHRoZSB1c2VyLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiB0b3VjaGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIHNlbGVjdC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgU2V0cyB3aGV0aGVyIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQuXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxPcGVuO1xuICB9XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0T3B0aW9uIHwgTWF0T3B0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQgOiB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXTtcbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgZGlzcGxheWVkIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBnZXQgdHJpZ2dlclZhbHVlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkLm1hcChvcHRpb24gPT4gb3B0aW9uLnZpZXdWYWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl9pc1J0bCgpKSB7XG4gICAgICAgIHNlbGVjdGVkT3B0aW9ucy5yZXZlcnNlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiBkZWxpbWl0ZXIgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSBmb3IgcHJvcGVyIGxvY2FsaXphdGlvbi5cbiAgICAgIHJldHVybiBzZWxlY3RlZE9wdGlvbnMuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0udmlld1ZhbHVlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaW4gUlRMIG1vZGUuICovXG4gIF9pc1J0bCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYWxsIGtleWRvd24gZXZlbnRzIG9uIHRoZSBzZWxlY3QuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuX2hhbmRsZU9wZW5LZXlkb3duKGV2ZW50KSA6IHRoaXMuX2hhbmRsZUNsb3NlZEtleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGlsZSB0aGUgc2VsZWN0IGlzIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8IGtleUNvZGUgPT09IFVQX0FSUk9XIHx8XG4gICAgICAgICAgICAgICAgICAgICAgIGtleUNvZGUgPT09IExFRlRfQVJST1cgfHwga2V5Q29kZSA9PT0gUklHSFRfQVJST1c7XG4gICAgY29uc3QgaXNPcGVuS2V5ID0ga2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0U7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICAvLyBPcGVuIHRoZSBzZWxlY3Qgb24gQUxUICsgYXJyb3cga2V5IHRvIG1hdGNoIHRoZSBuYXRpdmUgPHNlbGVjdD5cbiAgICBpZiAoIW1hbmFnZXIuaXNUeXBpbmcoKSAmJiAoaXNPcGVuS2V5ICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHx8XG4gICAgICAoKHRoaXMubXVsdGlwbGUgfHwgZXZlbnQuYWx0S2V5KSAmJiBpc0Fycm93S2V5KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudHMgdGhlIHBhZ2UgZnJvbSBzY3JvbGxpbmcgZG93biB3aGVuIHByZXNzaW5nIHNwYWNlXG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5U2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuXG4gICAgICAvLyBTaW5jZSB0aGUgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIG5lZWQgdG8gYW5ub3VuY2UgaXQgb3Vyc2VsdmVzLlxuICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uICYmIHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiAhPT0gc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgLy8gV2Ugc2V0IGEgZHVyYXRpb24gb24gdGhlIGxpdmUgYW5ub3VuY2VtZW50LCBiZWNhdXNlIHdlIHdhbnQgdGhlIGxpdmUgZWxlbWVudCB0byBiZVxuICAgICAgICAvLyBjbGVhcmVkIGFmdGVyIGEgd2hpbGUgc28gdGhhdCB1c2VycyBjYW4ndCBuYXZpZ2F0ZSB0byBpdCB1c2luZyB0aGUgYXJyb3cga2V5cy5cbiAgICAgICAgdGhpcy5fbGl2ZUFubm91bmNlci5hbm5vdW5jZSgoc2VsZWN0ZWRPcHRpb24gYXMgTWF0T3B0aW9uKS52aWV3VmFsdWUsIDEwMDAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hlbiB0aGUgc2VsZWN0ZWQgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlT3BlbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVztcbiAgICBjb25zdCBpc1R5cGluZyA9IG1hbmFnZXIuaXNUeXBpbmcoKTtcblxuICAgIGlmIChpc0Fycm93S2V5ICYmIGV2ZW50LmFsdEtleSkge1xuICAgICAgLy8gQ2xvc2UgdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGluIHRoaXMgY2FzZSBpZiB0aGUgdXNlciBpcyB0eXBpbmcsXG4gICAgICAvLyBiZWNhdXNlIHRoZSB0eXBpbmcgc2VxdWVuY2UgY2FuIGluY2x1ZGUgdGhlIHNwYWNlIGtleS5cbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpICYmIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiB0aGlzLl9tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBBICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYXNEZXNlbGVjdGVkT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5zb21lKG9wdCA9PiAhb3B0LmRpc2FibGVkICYmICFvcHQuc2VsZWN0ZWQpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBpZiAoIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICAgIGhhc0Rlc2VsZWN0ZWRPcHRpb25zID8gb3B0aW9uLnNlbGVjdCgpIDogb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEluZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcblxuICAgICAgaWYgKHRoaXMuX211bHRpcGxlICYmIGlzQXJyb3dLZXkgJiYgZXZlbnQuc2hpZnRLZXkgJiYgbWFuYWdlci5hY3RpdmVJdGVtICYmXG4gICAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzbHlGb2N1c2VkSW5kZXgpIHtcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbkZvY3VzKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSB0b3VjaGVkIGNhbGxiYWNrIG9ubHkgaWYgdGhlIHBhbmVsIGlzIGNsb3NlZC4gT3RoZXJ3aXNlLCB0aGUgdHJpZ2dlciB3aWxsXG4gICAqIFwiYmx1clwiIHRvIHRoZSBwYW5lbCB3aGVuIGl0IG9wZW5zLCBjYXVzaW5nIGEgZmFsc2UgcG9zaXRpdmUuXG4gICAqL1xuICBfb25CbHVyKCkge1xuICAgIHRoaXMuX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLlxuICAgKi9cbiAgX29uQXR0YWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5fb3ZlcmxheURpci5wb3NpdGlvbkNoYW5nZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl9wb3NpdGlvbmluZ1NldHRsZWQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSB0aGVtZSB0byBiZSB1c2VkIG9uIHRoZSBwYW5lbC4gKi9cbiAgX2dldFBhbmVsVGhlbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50Rm9ybUZpZWxkID8gYG1hdC0ke3RoaXMuX3BhcmVudEZvcm1GaWVsZC5jb2xvcn1gIDogJyc7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLiAqL1xuICBnZXQgZW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9zZWxlY3Rpb25Nb2RlbCB8fCB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc0VtcHR5KCk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIC8vIERlZmVyIHNldHRpbmcgdGhlIHZhbHVlIGluIG9yZGVyIHRvIGF2b2lkIHRoZSBcIkV4cHJlc3Npb25cbiAgICAvLyBoYXMgY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycyBmcm9tIEFuZ3VsYXIuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHRoaXMubmdDb250cm9sID8gdGhpcy5uZ0NvbnRyb2wudmFsdWUgOiB0aGlzLl92YWx1ZSk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0ZWQgb3B0aW9uIGJhc2VkIG9uIGEgdmFsdWUuIElmIG5vIG9wdGlvbiBjYW4gYmVcbiAgICogZm91bmQgd2l0aCB0aGUgZGVzaWduYXRlZCB2YWx1ZSwgdGhlIHNlbGVjdCB0cmlnZ2VyIGlzIGNsZWFyZWQuXG4gICAqL1xuICBwcml2YXRlIF9zZXRTZWxlY3Rpb25CeVZhbHVlKHZhbHVlOiBhbnkgfCBhbnlbXSk6IHZvaWQge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5zZXRJbmFjdGl2ZVN0eWxlcygpKTtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRWYWx1ZTogYW55KSA9PiB0aGlzLl9zZWxlY3RWYWx1ZShjdXJyZW50VmFsdWUpKTtcbiAgICAgIHRoaXMuX3NvcnRWYWx1ZXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMuX3NlbGVjdFZhbHVlKHZhbHVlKTtcblxuICAgICAgLy8gU2hpZnQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBpdGVtLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGRvIHRoaXMgaW4gbXVsdGlwbGVcbiAgICAgIC8vIG1vZGUsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IG9wdGlvbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggbGFzdC5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSByZXNldCB0aGUgaGlnaGxpZ2h0ZWQgb3B0aW9uLiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXMgd2hpbGVcbiAgICAgICAgLy8gY2xvc2VkLCBiZWNhdXNlIGRvaW5nIGl0IHdoaWxlIG9wZW4gY2FuIHNoaWZ0IHRoZSB1c2VyJ3MgZm9jdXMgdW5uZWNlc3NhcmlseS5cbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyBhbmQgb3B0aW9uIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgT3B0aW9uIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0VmFsdWUodmFsdWU6IGFueSk6IE1hdE9wdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKChvcHRpb246IE1hdE9wdGlvbikgPT4ge1xuICAgICAgLy8gU2tpcCBvcHRpb25zIHRoYXQgYXJlIGFscmVhZHkgaW4gdGhlIG1vZGVsLiBUaGlzIGFsbG93cyB1cyB0byBoYW5kbGUgY2FzZXNcbiAgICAgIC8vIHdoZXJlIHRoZSBzYW1lIHByaW1pdGl2ZSB2YWx1ZSBpcyBzZWxlY3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKG9wdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcmVhdCBudWxsIGFzIGEgc3BlY2lhbCByZXNldCB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSAhPSBudWxsICYmIHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbi52YWx1ZSwgIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAvLyBOb3RpZnkgZGV2ZWxvcGVycyBvZiBlcnJvcnMgaW4gdGhlaXIgY29tcGFyYXRvci5cbiAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcnJlc3BvbmRpbmdPcHRpb247XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhbJ3NoaWZ0S2V5J10pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gU2VsZWN0IHRoZSBhY3RpdmUgaXRlbSB3aGVuIHRhYmJpbmcgYXdheS4gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggaG93IHRoZSBuYXRpdmVcbiAgICAgICAgLy8gc2VsZWN0IGJlaGF2ZXMuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuXG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXN0b3JlIGZvY3VzIHRvIHRoZSB0cmlnZ2VyIGJlZm9yZSBjbG9zaW5nLiBFbnN1cmVzIHRoYXQgdGhlIGZvY3VzXG4gICAgICAgIC8vIHBvc2l0aW9uIHdvbid0IGJlIGxvc3QgaWYgdGhlIHVzZXIgZ290IGZvY3VzIGludG8gdGhlIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fcGFuZWxPcGVuICYmIHRoaXMucGFuZWwpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsT3B0aW9uSW50b1ZpZXcodGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9wYW5lbE9wZW4gJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBEcm9wcyBjdXJyZW50IG9wdGlvbiBzdWJzY3JpcHRpb25zIGFuZCBJRHMgYW5kIHJlc2V0cyBmcm9tIHNjcmF0Y2guICovXG4gIHByaXZhdGUgX3Jlc2V0T3B0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkT3JEZXN0cm95ZWQgPSBtZXJnZSh0aGlzLm9wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSk7XG5cbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuX29uU2VsZWN0KGV2ZW50LnNvdXJjZSwgZXZlbnQuaXNVc2VySW5wdXQpO1xuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBvcHRpb25zIGFuZCByZWFjdCBhY2NvcmRpbmdseS5cbiAgICAvLyBIYW5kbGVzIGNhc2VzIGxpa2UgdGhlIGxhYmVscyBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucyBjaGFuZ2luZy5cbiAgICBtZXJnZSguLi50aGlzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uX3N0YXRlQ2hhbmdlcykpXG4gICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogSW52b2tlZCB3aGVuIGFuIG9wdGlvbiBpcyBjbGlja2VkLiAqL1xuICBwcml2YXRlIF9vblNlbGVjdChvcHRpb246IE1hdE9wdGlvbiwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB3YXNTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb24udmFsdWUgPT0gbnVsbCAmJiAhdGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcblxuICAgICAgaWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKG9wdGlvbi52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChvcHRpb24pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3Qob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG5cbiAgICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgdXNlciBzZWxlY3RlZCB0aGUgb3B0aW9uIHdpdGggdGhlaXIgbW91c2UsIHdlXG4gICAgICAgICAgLy8gd2FudCB0byByZXN0b3JlIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIsIGluIG9yZGVyIHRvXG4gICAgICAgICAgLy8gcHJldmVudCB0aGUgc2VsZWN0IGtleWJvYXJkIGNvbnRyb2xzIGZyb20gY2xhc2hpbmcgd2l0aFxuICAgICAgICAgIC8vIHRoZSBvbmVzIGZyb20gYG1hdC1vcHRpb25gLlxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pKSB7XG4gICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFNvcnRzIHRoZSBzZWxlY3RlZCB2YWx1ZXMgaW4gdGhlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZWlyIG9yZGVyIGluIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc29ydFZhbHVlcygpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy50b0FycmF5KCk7XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydENvbXBhcmF0b3IgPyB0aGlzLnNvcnRDb21wYXJhdG9yKGEsIGIsIG9wdGlvbnMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmluZGV4T2YoYSkgLSBvcHRpb25zLmluZGV4T2YoYik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIHNldCB0aGUgbW9kZWwgdmFsdWUuICovXG4gIHByaXZhdGUgX3Byb3BhZ2F0ZUNoYW5nZXMoZmFsbGJhY2tWYWx1ZT86IGFueSk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbltdKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbikudmFsdWUgOiBmYWxsYmFja1ZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLl9nZXRDaGFuZ2VFdmVudCh2YWx1ZVRvRW1pdCkpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgdGhlIHNlbGVjdGVkIGl0ZW0uIElmIG5vIG9wdGlvbiBpcyBzZWxlY3RlZCwgaXQgd2lsbCBoaWdobGlnaHRcbiAgICogdGhlIGZpcnN0IGl0ZW0gaW5zdGVhZC5cbiAgICovXG4gIHByaXZhdGUgX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBpcyBhbGxvd2VkIHRvIG9wZW4uICovXG4gIHByb3RlY3RlZCBfY2FuT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3BhbmVsT3BlbiAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wdGlvbnM/Lmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0IGVsZW1lbnQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGZvciB0aGUgc2VsZWN0IHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsSWQgPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQ/LmdldExhYmVsSWQoKTtcbiAgICBjb25zdCBsYWJlbEV4cHJlc3Npb24gPSAobGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJyk7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHRoZSBgYXJpYS1hY3RpdmVkZXNjZW5kYW50YCB0byBiZSBzZXQgb24gdGhlIGhvc3QuICovXG4gIF9nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgdGhpcy5fa2V5TWFuYWdlciAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IG9mIHRoZSBzZWxlY3QgY29tcG9uZW50IHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2dldFRyaWdnZXJBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsSWQgPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQ/LmdldExhYmVsSWQoKTtcbiAgICBsZXQgdmFsdWUgPSAobGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJykgKyB0aGlzLl92YWx1ZUlkO1xuXG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgIHZhbHVlICs9ICcgJyArIHRoaXMuYXJpYUxhYmVsbGVkYnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGlzIGRvbmUgYW5pbWF0aW5nLiAqL1xuICBwcm90ZWN0ZWQgX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KGlzT3Blbik7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgdGhpcy5mb2N1cygpO1xuICAgIHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbiB8fCAhdGhpcy5lbXB0eSB8fCAodGhpcy5fZm9jdXNlZCAmJiAhIXRoaXMuX3BsYWNlaG9sZGVyKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICdzZWxlY3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzZWxlY3QuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnY29tYm9ib3gnLFxuICAgICdhcmlhLWF1dG9jb21wbGV0ZSc6ICdub25lJyxcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhlIHZhbHVlIGZvciBhcmlhLWhhc3BvcHVwIHNob3VsZCBiZSBgbGlzdGJveGAsIGJ1dCBjdXJyZW50bHkgaXQncyBkaWZmaWN1bHRcbiAgICAvLyB0byBzeW5jIGludG8gR29vZ2xlLCBiZWNhdXNlIG9mIGFuIG91dGRhdGVkIGF1dG9tYXRlZCBhMTF5IGNoZWNrIHdoaWNoIGZsYWdzIGl0IGFzIGFuIGludmFsaWRcbiAgICAvLyB2YWx1ZS4gQXQgc29tZSBwb2ludCB3ZSBzaG91bGQgdHJ5IHRvIHN3aXRjaCBpdCBiYWNrIHRvIGJlaW5nIGBsaXN0Ym94YC5cbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXNlbGVjdCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ3BhbmVsT3BlbiA/IGlkICsgXCItcGFuZWxcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdwYW5lbE9wZW4nLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2F0dHIuYXJpYS1kZXNjcmliZWRieV0nOiAnX2FyaWFEZXNjcmliZWRieSB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1lbXB0eV0nOiAnZW1wdHknLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFdyYXAsXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0IGV4dGVuZHMgX01hdFNlbGVjdEJhc2U8TWF0U2VsZWN0Q2hhbmdlPiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8qKiBUaGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBvdmVybGF5IHBhbmVsLCBjYWxjdWxhdGVkIHRvIGNlbnRlciB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9zY3JvbGxUb3AgPSAwO1xuXG4gIC8qKiBUaGUgbGFzdCBtZWFzdXJlZCB2YWx1ZSBmb3IgdGhlIHRyaWdnZXIncyBjbGllbnQgYm91bmRpbmcgcmVjdC4gKi9cbiAgX3RyaWdnZXJSZWN0OiBDbGllbnRSZWN0O1xuXG4gIC8qKiBUaGUgY2FjaGVkIGZvbnQtc2l6ZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBfdHJpZ2dlckZvbnRTaXplID0gMDtcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcGFuZWwncyB0cmFuc2Zvcm0tb3JpZ2luIHByb3BlcnR5LiAqL1xuICBfdHJhbnNmb3JtT3JpZ2luOiBzdHJpbmcgPSAndG9wJztcblxuICAvKipcbiAgICogVGhlIHktb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQuXG4gICAqIHdoZW4gdGhlIHBhbmVsIG9wZW5zLiBXaWxsIGNoYW5nZSBiYXNlZCBvbiB0aGUgeS1wb3NpdGlvbiBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uLlxuICAgKi9cbiAgX29mZnNldFkgPSAwO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPjtcblxuICBAQ29udGVudENoaWxkcmVuKE1BVF9PUFRHUk9VUCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+O1xuXG4gIEBDb250ZW50Q2hpbGQoTUFUX1NFTEVDVF9UUklHR0VSKSBjdXN0b21UcmlnZ2VyOiBNYXRTZWxlY3RUcmlnZ2VyO1xuXG4gIF9wb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ3RvcCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ2JvdHRvbScsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAnYm90dG9tJyxcbiAgICB9LFxuICBdO1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwuXG4gICAqXG4gICAqIEF0dGVtcHRzIHRvIGNlbnRlciB0aGUgc2VsZWN0ZWQgb3B0aW9uIGluIHRoZSBwYW5lbC4gSWYgdGhlIG9wdGlvbiBpc1xuICAgKiB0b28gaGlnaCBvciB0b28gbG93IGluIHRoZSBwYW5lbCB0byBiZSBzY3JvbGxlZCB0byB0aGUgY2VudGVyLCBpdCBjbGFtcHMgdGhlXG4gICAqIHNjcm9sbCBwb3NpdGlvbiB0byB0aGUgbWluIG9yIG1heCBzY3JvbGwgcG9zaXRpb25zIHJlc3BlY3RpdmVseS5cbiAgICovXG4gIF9jYWxjdWxhdGVPdmVybGF5U2Nyb2xsKHNlbGVjdGVkSW5kZXg6IG51bWJlciwgc2Nyb2xsQnVmZmVyOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IG9wdGlvbk9mZnNldEZyb21TY3JvbGxUb3AgPSBpdGVtSGVpZ2h0ICogc2VsZWN0ZWRJbmRleDtcbiAgICBjb25zdCBoYWxmT3B0aW9uSGVpZ2h0ID0gaXRlbUhlaWdodCAvIDI7XG5cbiAgICAvLyBTdGFydHMgYXQgdGhlIG9wdGlvbk9mZnNldEZyb21TY3JvbGxUb3AsIHdoaWNoIHNjcm9sbHMgdGhlIG9wdGlvbiB0byB0aGUgdG9wIG9mIHRoZVxuICAgIC8vIHNjcm9sbCBjb250YWluZXIsIHRoZW4gc3VidHJhY3RzIHRoZSBzY3JvbGwgYnVmZmVyIHRvIHNjcm9sbCB0aGUgb3B0aW9uIGRvd24gdG9cbiAgICAvLyB0aGUgY2VudGVyIG9mIHRoZSBvdmVybGF5IHBhbmVsLiBIYWxmIHRoZSBvcHRpb24gaGVpZ2h0IG11c3QgYmUgcmUtYWRkZWQgdG8gdGhlXG4gICAgLy8gc2Nyb2xsVG9wIHNvIHRoZSBvcHRpb24gaXMgY2VudGVyZWQgYmFzZWQgb24gaXRzIG1pZGRsZSwgbm90IGl0cyB0b3AgZWRnZS5cbiAgICBjb25zdCBvcHRpbWFsU2Nyb2xsUG9zaXRpb24gPSBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wIC0gc2Nyb2xsQnVmZmVyICsgaGFsZk9wdGlvbkhlaWdodDtcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoMCwgb3B0aW1hbFNjcm9sbFBvc2l0aW9uKSwgbWF4U2Nyb2xsKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gICAgdGhpcy5fdmlld3BvcnRSdWxlci5jaGFuZ2UoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICB0aGlzLl90cmlnZ2VyUmVjdCA9IHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHN1cGVyLl9jYW5PcGVuKCkpIHtcbiAgICAgIHN1cGVyLm9wZW4oKTtcbiAgICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tcHV0ZWQgZm9udC1zaXplIHdpbGwgYmUgYSBzdHJpbmcgcGl4ZWwgdmFsdWUgKGUuZy4gXCIxNnB4XCIpLlxuICAgICAgLy8gYHBhcnNlSW50YCBpZ25vcmVzIHRoZSB0cmFpbGluZyAncHgnIGFuZCBjb252ZXJ0cyB0aGlzIHRvIGEgbnVtYmVyLlxuICAgICAgdGhpcy5fdHJpZ2dlckZvbnRTaXplID1cbiAgICAgICAgICBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50KS5mb250U2l6ZSB8fCAnMCcpO1xuICAgICAgdGhpcy5fY2FsY3VsYXRlT3ZlcmxheVBvc2l0aW9uKCk7XG5cbiAgICAgIC8vIFNldCB0aGUgZm9udCBzaXplIG9uIHRoZSBwYW5lbCBlbGVtZW50IG9uY2UgaXQgZXhpc3RzLlxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3RyaWdnZXJGb250U2l6ZSAmJiB0aGlzLl9vdmVybGF5RGlyLm92ZXJsYXlSZWYgJiZcbiAgICAgICAgICAgIHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IGAke3RoaXMuX3RyaWdnZXJGb250U2l6ZX1weGA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTY3JvbGxzIHRoZSBhY3RpdmUgb3B0aW9uIGludG8gdmlldy4gKi9cbiAgcHJvdGVjdGVkIF9zY3JvbGxPcHRpb25JbnRvVmlldyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGluZGV4LCB0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uR3JvdXBzKTtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuXG4gICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgIChpbmRleCArIGxhYmVsQ291bnQpICogaXRlbUhlaWdodCxcbiAgICAgIGl0ZW1IZWlnaHQsXG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFRcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9wb3NpdGlvbmluZ1NldHRsZWQoKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRlT3ZlcmxheU9mZnNldFgoKTtcbiAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9wYW5lbERvbmVBbmltYXRpbmcoaXNPcGVuOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vdmVybGF5RGlyLm9mZnNldFggPSAwO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW4pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRDaGFuZ2VFdmVudCh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBNYXRTZWxlY3RDaGFuZ2UodGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgtb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQgd2hlblxuICAgKiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIExUUiBvciBSVEwgdGV4dCBkaXJlY3Rpb24uIE5vdGUgdGhhdCB0aGUgb2Zmc2V0XG4gICAqIGNhbid0IGJlIGNhbGN1bGF0ZWQgdW50aWwgdGhlIHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGVcbiAgICogY29udGVudCB3aWR0aCBpbiBvcmRlciB0byBjb25zdHJhaW4gdGhlIHBhbmVsIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5UmVjdCA9IHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB2aWV3cG9ydFNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2l6ZSgpO1xuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5faXNSdGwoKTtcbiAgICBjb25zdCBwYWRkaW5nV2lkdGggPSB0aGlzLm11bHRpcGxlID8gU0VMRUNUX01VTFRJUExFX1BBTkVMX1BBRERJTkdfWCArIFNFTEVDVF9QQU5FTF9QQURESU5HX1ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcbiAgICBsZXQgb2Zmc2V0WDogbnVtYmVyO1xuXG4gICAgLy8gQWRqdXN0IHRoZSBvZmZzZXQsIGRlcGVuZGluZyBvbiB0aGUgb3B0aW9uIHBhZGRpbmcuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIG9mZnNldFggPSBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nKSB7XG4gICAgICBvZmZzZXRYID0gU0VMRUNUX1BBTkVMX1BBRERJTkdfWDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0gfHwgdGhpcy5vcHRpb25zLmZpcnN0O1xuICAgICAgb2Zmc2V0WCA9IHNlbGVjdGVkICYmIHNlbGVjdGVkLmdyb3VwID8gU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggOiBTRUxFQ1RfUEFORUxfUEFERElOR19YO1xuICAgIH1cblxuICAgIC8vIEludmVydCB0aGUgb2Zmc2V0IGluIExUUi5cbiAgICBpZiAoIWlzUnRsKSB7XG4gICAgICBvZmZzZXRYICo9IC0xO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBob3cgbXVjaCB0aGUgc2VsZWN0IG92ZXJmbG93cyBvbiBlYWNoIHNpZGUuXG4gICAgY29uc3QgbGVmdE92ZXJmbG93ID0gMCAtIChvdmVybGF5UmVjdC5sZWZ0ICsgb2Zmc2V0WCAtIChpc1J0bCA/IHBhZGRpbmdXaWR0aCA6IDApKTtcbiAgICBjb25zdCByaWdodE92ZXJmbG93ID0gb3ZlcmxheVJlY3QucmlnaHQgKyBvZmZzZXRYIC0gdmlld3BvcnRTaXplLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzUnRsID8gMCA6IHBhZGRpbmdXaWR0aCk7XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBvdmVyZmxvd3Mgb24gZWl0aGVyIHNpZGUsIHJlZHVjZSB0aGUgb2Zmc2V0IHRvIGFsbG93IGl0IHRvIGZpdC5cbiAgICBpZiAobGVmdE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCArPSBsZWZ0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9IGVsc2UgaWYgKHJpZ2h0T3ZlcmZsb3cgPiAwKSB7XG4gICAgICBvZmZzZXRYIC09IHJpZ2h0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG9mZnNldCBkaXJlY3RseSBpbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gZ28gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uIGFuZFxuICAgIC8vIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgXCJjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzLiBSb3VuZCB0aGUgdmFsdWUgdG8gYXZvaWRcbiAgICAvLyBibHVycnkgY29udGVudCBpbiBzb21lIGJyb3dzZXJzLlxuICAgIHRoaXMuX292ZXJsYXlEaXIub2Zmc2V0WCA9IE1hdGgucm91bmQob2Zmc2V0WCk7XG4gICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgeS1vZmZzZXQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlXG4gICAqIHRvcCBzdGFydCBjb3JuZXIgb2YgdGhlIHRyaWdnZXIuIEl0IGhhcyB0byBiZSBhZGp1c3RlZCBpbiBvcmRlciBmb3IgdGhlXG4gICAqIHNlbGVjdGVkIG9wdGlvbiB0byBiZSBhbGlnbmVkIG92ZXIgdGhlIHRyaWdnZXIgd2hlbiB0aGUgcGFuZWwgb3BlbnMuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WShzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEJ1ZmZlcjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IG9wdGlvbkhlaWdodEFkanVzdG1lbnQgPSAoaXRlbUhlaWdodCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodCkgLyAyO1xuICAgIGNvbnN0IG1heE9wdGlvbnNEaXNwbGF5ZWQgPSBNYXRoLmZsb29yKFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUIC8gaXRlbUhlaWdodCk7XG4gICAgbGV0IG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcDogbnVtYmVyO1xuXG4gICAgLy8gRGlzYWJsZSBvZmZzZXQgaWYgcmVxdWVzdGVkIGJ5IHVzZXIgYnkgcmV0dXJuaW5nIDAgYXMgdmFsdWUgdG8gb2Zmc2V0XG4gICAgaWYgKHRoaXMuZGlzYWJsZU9wdGlvbkNlbnRlcmluZykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gMCkge1xuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWRJbmRleCAqIGl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zY3JvbGxUb3AgPT09IG1heFNjcm9sbCkge1xuICAgICAgY29uc3QgZmlyc3REaXNwbGF5ZWRJbmRleCA9IHRoaXMuX2dldEl0ZW1Db3VudCgpIC0gbWF4T3B0aW9uc0Rpc3BsYXllZDtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGlzcGxheUluZGV4ID0gc2VsZWN0ZWRJbmRleCAtIGZpcnN0RGlzcGxheWVkSW5kZXg7XG5cbiAgICAgIC8vIFRoZSBmaXJzdCBpdGVtIGlzIHBhcnRpYWxseSBvdXQgb2YgdGhlIHZpZXdwb3J0LiBUaGVyZWZvcmUgd2UgbmVlZCB0byBjYWxjdWxhdGUgd2hhdFxuICAgICAgLy8gcG9ydGlvbiBvZiBpdCBpcyBzaG93biBpbiB0aGUgdmlld3BvcnQgYW5kIGFjY291bnQgZm9yIGl0IGluIG91ciBvZmZzZXQuXG4gICAgICBsZXQgcGFydGlhbEl0ZW1IZWlnaHQgPVxuICAgICAgICAgIGl0ZW1IZWlnaHQgLSAodGhpcy5fZ2V0SXRlbUNvdW50KCkgKiBpdGVtSGVpZ2h0IC0gU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpICUgaXRlbUhlaWdodDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgcGFuZWwgaGVpZ2h0IGlzIGxvbmdlciB0aGFuIHRoZSBoZWlnaHQgb2YgdGhlIG9wdGlvbnMgYWxvbmUsXG4gICAgICAvLyB0aGVyZSBpcyBhbHdheXMgZXh0cmEgcGFkZGluZyBhdCB0aGUgdG9wIG9yIGJvdHRvbSBvZiB0aGUgcGFuZWwuIFdoZW5cbiAgICAgIC8vIHNjcm9sbGVkIHRvIHRoZSB2ZXJ5IGJvdHRvbSwgdGhpcyBwYWRkaW5nIGlzIGF0IHRoZSB0b3Agb2YgdGhlIHBhbmVsIGFuZFxuICAgICAgLy8gbXVzdCBiZSBhZGRlZCB0byB0aGUgb2Zmc2V0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWREaXNwbGF5SW5kZXggKiBpdGVtSGVpZ2h0ICsgcGFydGlhbEl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBvcHRpb24gd2FzIHNjcm9sbGVkIHRvIHRoZSBtaWRkbGUgb2YgdGhlIHBhbmVsIHVzaW5nIGEgc2Nyb2xsIGJ1ZmZlcixcbiAgICAgIC8vIGl0cyBvZmZzZXQgd2lsbCBiZSB0aGUgc2Nyb2xsIGJ1ZmZlciBtaW51cyB0aGUgaGFsZiBoZWlnaHQgdGhhdCB3YXMgYWRkZWQgdG9cbiAgICAgIC8vIGNlbnRlciBpdC5cbiAgICAgIG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCA9IHNjcm9sbEJ1ZmZlciAtIGl0ZW1IZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIFRoZSBmaW5hbCBvZmZzZXQgaXMgdGhlIG9wdGlvbidzIG9mZnNldCBmcm9tIHRoZSB0b3AsIGFkanVzdGVkIGZvciB0aGUgaGVpZ2h0IGRpZmZlcmVuY2UsXG4gICAgLy8gbXVsdGlwbGllZCBieSAtMSB0byBlbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBtb3ZlcyBpbiB0aGUgY29ycmVjdCBkaXJlY3Rpb24gdXAgdGhlIHBhZ2UuXG4gICAgLy8gVGhlIHZhbHVlIGlzIHJvdW5kZWQgdG8gcHJldmVudCBzb21lIGJyb3dzZXJzIGZyb20gYmx1cnJpbmcgdGhlIGNvbnRlbnQuXG4gICAgcmV0dXJuIE1hdGgucm91bmQob3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wICogLTEgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhhdCB0aGUgYXR0ZW1wdGVkIG92ZXJsYXkgcG9zaXRpb24gd2lsbCBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICogSWYgaXQgd2lsbCBub3QgZml0LCB0cmllcyB0byBhZGp1c3QgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgdGhlIGFzc29jaWF0ZWRcbiAgICogeS1vZmZzZXQgc28gdGhlIHBhbmVsIGNhbiBvcGVuIGZ1bGx5IG9uLXNjcmVlbi4gSWYgaXQgc3RpbGwgd29uJ3QgZml0LFxuICAgKiBzZXRzIHRoZSBvZmZzZXQgYmFjayB0byAwIHRvIGFsbG93IHRoZSBmYWxsYmFjayBwb3NpdGlvbiB0byB0YWtlIG92ZXIuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGw6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRTaXplID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNpemUoKTtcblxuICAgIGNvbnN0IHRvcFNwYWNlQXZhaWxhYmxlID0gdGhpcy5fdHJpZ2dlclJlY3QudG9wIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgY29uc3QgYm90dG9tU3BhY2VBdmFpbGFibGUgPVxuICAgICAgICB2aWV3cG9ydFNpemUuaGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuYm90dG9tIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG5cbiAgICBjb25zdCBwYW5lbEhlaWdodFRvcCA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpO1xuICAgIGNvbnN0IHRvdGFsUGFuZWxIZWlnaHQgPVxuICAgICAgICBNYXRoLm1pbih0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBwYW5lbEhlaWdodEJvdHRvbSA9IHRvdGFsUGFuZWxIZWlnaHQgLSBwYW5lbEhlaWdodFRvcCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodDtcblxuICAgIGlmIChwYW5lbEhlaWdodEJvdHRvbSA+IGJvdHRvbVNwYWNlQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLl9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tLCBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG4gICAgfSBlbHNlIGlmIChwYW5lbEhlaWdodFRvcCA+IHRvcFNwYWNlQXZhaWxhYmxlKSB7XG4gICAgIHRoaXMuX2FkanVzdFBhbmVsRG93bihwYW5lbEhlaWdodFRvcCwgdG9wU3BhY2VBdmFpbGFibGUsIG1heFNjcm9sbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRqdXN0cyB0aGUgb3ZlcmxheSBwYW5lbCB1cCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tOiBudW1iZXIsIGJvdHRvbVNwYWNlQXZhaWxhYmxlOiBudW1iZXIpIHtcbiAgICAvLyBCcm93c2VycyBpZ25vcmUgZnJhY3Rpb25hbCBzY3JvbGwgb2Zmc2V0cywgc28gd2UgbmVlZCB0byByb3VuZC5cbiAgICBjb25zdCBkaXN0YW5jZUJlbG93Vmlld3BvcnQgPSBNYXRoLnJvdW5kKHBhbmVsSGVpZ2h0Qm90dG9tIC0gYm90dG9tU3BhY2VBdmFpbGFibGUpO1xuXG4gICAgLy8gU2Nyb2xscyB0aGUgcGFuZWwgdXAgYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgdXAgaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgdG9wLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGUgcGFuZWxcbiAgICAvLyBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2VcbiAgICAvLyBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA8PSAwKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIGJvdHRvbSAwcHhgO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIGRvd24gdG8gZml0IGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wOiBudW1iZXIsIHRvcFNwYWNlQXZhaWxhYmxlOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQWJvdmVWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRUb3AgLSB0b3BTcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCBkb3duIGJ5IHRoZSBkaXN0YW5jZSBpdCB3YXMgZXh0ZW5kaW5nIHBhc3QgdGhlIGJvdW5kYXJ5LCB0aGVuXG4gICAgLy8gYWRqdXN0cyB0aGUgb2Zmc2V0IGJ5IHRoYXQgYW1vdW50IHRvIG1vdmUgdGhlIHBhbmVsIGRvd24gaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGVcbiAgICAvLyBwYW5lbCBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uXG4gICAgLy8gdG8gdGFrZSBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IG1heFNjcm9sbDtcbiAgICAgIHRoaXMuX29mZnNldFkgPSAwO1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gYDUwJSB0b3AgMHB4YDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB4LSBhbmQgeS1vZmZzZXRzIG9mIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5UG9zaXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2dldEl0ZW1Db3VudCgpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0ID0gTWF0aC5taW4oaXRlbXMgKiBpdGVtSGVpZ2h0LCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCk7XG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVySGVpZ2h0ID0gaXRlbXMgKiBpdGVtSGVpZ2h0O1xuXG4gICAgLy8gVGhlIGZhcnRoZXN0IHRoZSBwYW5lbCBjYW4gYmUgc2Nyb2xsZWQgYmVmb3JlIGl0IGhpdHMgdGhlIGJvdHRvbVxuICAgIGNvbnN0IG1heFNjcm9sbCA9IHNjcm9sbENvbnRhaW5lckhlaWdodCAtIHBhbmVsSGVpZ2h0O1xuXG4gICAgLy8gSWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQgd2Ugb3BlbiB0aGUgcG9wdXAgdG8gdGhlIGZpcnN0IGl0ZW0uXG4gICAgbGV0IHNlbGVjdGVkT3B0aW9uT2Zmc2V0OiBudW1iZXI7XG5cbiAgICBpZiAodGhpcy5lbXB0eSkge1xuICAgICAgc2VsZWN0ZWRPcHRpb25PZmZzZXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCA9XG4gICAgICAgICAgTWF0aC5tYXgodGhpcy5vcHRpb25zLnRvQXJyYXkoKS5pbmRleE9mKHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdKSwgMCk7XG4gICAgfVxuXG4gICAgc2VsZWN0ZWRPcHRpb25PZmZzZXQgKz0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHRoaXMub3B0aW9ucyxcbiAgICAgICAgdGhpcy5vcHRpb25Hcm91cHMpO1xuXG4gICAgLy8gV2UgbXVzdCBtYWludGFpbiBhIHNjcm9sbCBidWZmZXIgc28gdGhlIHNlbGVjdGVkIG9wdGlvbiB3aWxsIGJlIHNjcm9sbGVkIHRvIHRoZVxuICAgIC8vIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbCByYXRoZXIgdGhhbiB0aGUgdG9wLlxuICAgIGNvbnN0IHNjcm9sbEJ1ZmZlciA9IHBhbmVsSGVpZ2h0IC8gMjtcbiAgICB0aGlzLl9zY3JvbGxUb3AgPSB0aGlzLl9jYWxjdWxhdGVPdmVybGF5U2Nyb2xsKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG4gICAgdGhpcy5fb2Zmc2V0WSA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG5cbiAgICB0aGlzLl9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGwpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHRyYW5zZm9ybSBvcmlnaW4gcG9pbnQgYmFzZWQgb24gdGhlIHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3JpZ2luQmFzZWRPbk9wdGlvbigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3Qgb3JpZ2luWSA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpIC0gb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCArIGl0ZW1IZWlnaHQgLyAyO1xuICAgIHJldHVybiBgNTAlICR7b3JpZ2luWX1weCAwcHhgO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiB0aGUgc2VsZWN0J3Mgb3B0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZ2V0SXRlbUhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyRm9udFNpemUgKiBTRUxFQ1RfSVRFTV9IRUlHSFRfRU07XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGl0ZW1zIGluIHRoZSBzZWxlY3QuIFRoaXMgaW5jbHVkZXMgb3B0aW9ucyBhbmQgZ3JvdXAgbGFiZWxzLiAqL1xuICBwcml2YXRlIF9nZXRJdGVtQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxlbmd0aCArIHRoaXMub3B0aW9uR3JvdXBzLmxlbmd0aDtcbiAgfVxuXG59XG4iXX0=