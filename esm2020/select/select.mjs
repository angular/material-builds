/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager, LiveAnnouncer } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, ENTER, hasModifierKey, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay, } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, Self, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators, } from '@angular/forms';
import { ErrorStateMatcher, MatOption, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, mixinDisabled, mixinDisableRipple, mixinErrorState, mixinTabIndex, _countGroupLabelsBeforeOption, _getOptionScrollPosition, } from '@angular/material/core';
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from '@angular/material/form-field';
import { defer, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, takeUntil, } from 'rxjs/operators';
import { matSelectAnimations } from './select-animations';
import { getMatSelectDynamicMultipleError, getMatSelectNonArrayValueError, getMatSelectNonFunctionValueError, } from './select-errors';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/forms";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/material/form-field";
import * as i7 from "@angular/common";
import * as i8 from "@angular/cdk/overlay";
let nextUniqueId = 0;
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
/**
 * Injection token that can be used to reference instances of `MatSelectTrigger`. It serves as
 * alternative token to the actual `MatSelectTrigger` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const MAT_SELECT_TRIGGER = new InjectionToken('MatSelectTrigger');
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
    constructor(_elementRef, _defaultErrorStateMatcher, _parentForm, _parentFormGroup, 
    /**
     * Form control bound to the component.
     * Implemented as part of `MatFormFieldControl`.
     * @docs-private
     */
    ngControl) {
        this._elementRef = _elementRef;
        this._defaultErrorStateMatcher = _defaultErrorStateMatcher;
        this._parentForm = _parentForm;
        this._parentFormGroup = _parentFormGroup;
        this.ngControl = ngControl;
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        this.stateChanges = new Subject();
    }
}))));
/** Base class with all of the `MatSelect` functionality. */
export class _MatSelectBase extends _MatSelectMixinBase {
    /** Whether the select is focused. */
    get focused() {
        return this._focused || this._panelOpen;
    }
    /** Placeholder to be shown if no value has been selected. */
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    /** Whether the component is required. */
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
    set required(value) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    /** Whether the user should be allowed to select multiple options. */
    get multiple() {
        return this._multiple;
    }
    set multiple(value) {
        if (this._selectionModel && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw getMatSelectDynamicMultipleError();
        }
        this._multiple = coerceBooleanProperty(value);
    }
    /** Whether to center the active option over the trigger. */
    get disableOptionCentering() {
        return this._disableOptionCentering;
    }
    set disableOptionCentering(value) {
        this._disableOptionCentering = coerceBooleanProperty(value);
    }
    /**
     * Function to compare the option values with the selected values. The first argument
     * is a value from an option. The second is a value from the selection. A boolean
     * should be returned.
     */
    get compareWith() {
        return this._compareWith;
    }
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
    get value() {
        return this._value;
    }
    set value(newValue) {
        const hasAssigned = this._assignValue(newValue);
        if (hasAssigned) {
            this._onChange(newValue);
        }
    }
    /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
    get typeaheadDebounceInterval() {
        return this._typeaheadDebounceInterval;
    }
    set typeaheadDebounceInterval(value) {
        this._typeaheadDebounceInterval = coerceNumberProperty(value);
    }
    /** Unique id of the element. */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
        this.stateChanges.next();
    }
    constructor(_viewportRuler, _changeDetectorRef, _ngZone, _defaultErrorStateMatcher, elementRef, _dir, _parentForm, _parentFormGroup, _parentFormField, ngControl, tabIndex, scrollStrategyFactory, _liveAnnouncer, _defaultOptions) {
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
        /** Current `aria-labelledby` value for the select trigger. */
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
        this._overlayPanelClass = this._defaultOptions?.overlayPanelClass || '';
        this._focused = false;
        /** A name for this control that can be used by `mat-form-field`. */
        this.controlType = 'mat-select';
        this._multiple = false;
        this._disableOptionCentering = this._defaultOptions?.disableOptionCentering ?? false;
        /** Aria label of the select. */
        this.ariaLabel = '';
        /** Combined stream of all of the child options' change events. */
        this.optionSelectionChanges = defer(() => {
            const options = this.options;
            if (options) {
                return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))));
            }
            return this._ngZone.onStable.pipe(take(1), switchMap(() => this.optionSelectionChanges));
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
        if (_defaultOptions?.typeaheadDebounceInterval != null) {
            this._typeaheadDebounceInterval = _defaultOptions.typeaheadDebounceInterval;
        }
        this._scrollStrategyFactory = scrollStrategyFactory;
        this._scrollStrategy = this._scrollStrategyFactory();
        this.tabIndex = parseInt(tabIndex) || 0;
        // Force setter to be called in case id was not specified.
        this.id = this.id;
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
        const ngControl = this.ngControl;
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
        if (ngControl) {
            // The disabled state might go out of sync if the form group is swapped out. See #17860.
            if (this._previousControl !== ngControl.control) {
                if (this._previousControl !== undefined &&
                    ngControl.disabled !== null &&
                    ngControl.disabled !== this.disabled) {
                    this.disabled = ngControl.disabled;
                }
                this._previousControl = ngControl.control;
            }
            this.updateErrorState();
        }
    }
    ngOnChanges(changes) {
        // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
        // the parent form field know to run change detection when the disabled state changes.
        if (changes['disabled'] || changes['userAriaDescribedBy']) {
            this.stateChanges.next();
        }
        if (changes['typeaheadDebounceInterval'] && this._keyManager) {
            this._keyManager.withTypeAhead(this._typeaheadDebounceInterval);
        }
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
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
        this._assignValue(value);
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
        return this.multiple ? this._selectionModel?.selected || [] : this._selectionModel?.selected[0];
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
        const isArrowKey = keyCode === DOWN_ARROW ||
            keyCode === UP_ARROW ||
            keyCode === LEFT_ARROW ||
            keyCode === RIGHT_ARROW;
        const isOpenKey = keyCode === ENTER || keyCode === SPACE;
        const manager = this._keyManager;
        // Open the select on ALT + arrow key to match the native <select>
        if ((!manager.isTyping() && isOpenKey && !hasModifierKey(event)) ||
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
        else if (!isTyping &&
            (keyCode === ENTER || keyCode === SPACE) &&
            manager.activeItem &&
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
            if (this._multiple &&
                isArrowKey &&
                event.shiftKey &&
                manager.activeItem &&
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
        this._keyManager?.cancelTypeahead();
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
            if (this.ngControl) {
                this._value = this.ngControl.value;
            }
            this._setSelectionByValue(this._value);
            this.stateChanges.next();
        });
    }
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     */
    _setSelectionByValue(value) {
        this.options.forEach(option => option.setInactiveStyles());
        this._selectionModel.clear();
        if (this.multiple && value) {
            if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw getMatSelectNonArrayValueError();
            }
            value.forEach((currentValue) => this._selectOptionByValue(currentValue));
            this._sortValues();
        }
        else {
            const correspondingOption = this._selectOptionByValue(value);
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
    _selectOptionByValue(value) {
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
    /** Assigns a specific value to the select. Returns whether the value has changed. */
    _assignValue(newValue) {
        // Always re-assign an array, because it might have been mutated.
        if (newValue !== this._value || (this._multiple && Array.isArray(newValue))) {
            if (this.options) {
                this._setSelectionByValue(newValue);
            }
            this._value = newValue;
            return true;
        }
        return false;
    }
    /** Sets up a key manager to listen to keyboard events on the overlay panel. */
    _initKeyManager() {
        this._keyManager = new ActiveDescendantKeyManager(this.options)
            .withTypeAhead(this._typeaheadDebounceInterval)
            .withVerticalOrientation()
            .withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr')
            .withHomeAndEnd()
            .withPageUpDown()
            .withAllowedModifierKeys(['shiftKey']);
        this._keyManager.tabOut.subscribe(() => {
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
        this._keyManager.change.subscribe(() => {
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
            // `_stateChanges` can fire as a result of a change in the label's DOM value which may
            // be the result of an expression changing. We have to use `detectChanges` in order
            // to avoid "changed after checked" errors (see #14793).
            this._changeDetectorRef.detectChanges();
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
                option.selected
                    ? this._selectionModel.select(option)
                    : this._selectionModel.deselect(option);
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
                return this.sortComparator
                    ? this.sortComparator(a, b, options)
                    : options.indexOf(a) - options.indexOf(b);
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
        return !this._panelOpen && !this.disabled && this.options?.length > 0;
    }
    /** Focuses the select element. */
    focus(options) {
        this._elementRef.nativeElement.focus(options);
    }
    /** Gets the aria-labelledby for the select panel. */
    _getPanelAriaLabelledby() {
        if (this.ariaLabel) {
            return null;
        }
        const labelId = this._parentFormField?.getLabelId();
        const labelExpression = labelId ? labelId + ' ' : '';
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
        if (this.ariaLabel) {
            return null;
        }
        const labelId = this._parentFormField?.getLabelId();
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
        if (ids.length) {
            this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
        }
        else {
            this._elementRef.nativeElement.removeAttribute('aria-describedby');
        }
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
_MatSelectBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: _MatSelectBase, deps: [{ token: i1.ViewportRuler }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.ErrorStateMatcher }, { token: i0.ElementRef }, { token: i3.Directionality, optional: true }, { token: i4.NgForm, optional: true }, { token: i4.FormGroupDirective, optional: true }, { token: MAT_FORM_FIELD, optional: true }, { token: i4.NgControl, optional: true, self: true }, { token: 'tabindex', attribute: true }, { token: MAT_SELECT_SCROLL_STRATEGY }, { token: i5.LiveAnnouncer }, { token: MAT_SELECT_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatSelectBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0", type: _MatSelectBase, inputs: { userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], panelClass: "panelClass", placeholder: "placeholder", required: "required", multiple: "multiple", disableOptionCentering: "disableOptionCentering", compareWith: "compareWith", value: "value", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], errorStateMatcher: "errorStateMatcher", typeaheadDebounceInterval: "typeaheadDebounceInterval", sortComparator: "sortComparator", id: "id" }, outputs: { openedChange: "openedChange", _openedStream: "opened", _closedStream: "closed", selectionChange: "selectionChange", valueChange: "valueChange" }, viewQueries: [{ propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }, { propertyName: "_overlayDir", first: true, predicate: CdkConnectedOverlay, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: _MatSelectBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.ViewportRuler }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i2.ErrorStateMatcher }, { type: i0.ElementRef }, { type: i3.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i4.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i4.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i6.MatFormField, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_FORM_FIELD]
                }] }, { type: i4.NgControl, decorators: [{
                    type: Self
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_SELECT_SCROLL_STRATEGY]
                }] }, { type: i5.LiveAnnouncer }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_SELECT_CONFIG]
                }] }]; }, propDecorators: { userAriaDescribedBy: [{
                type: Input,
                args: ['aria-describedby']
            }], trigger: [{
                type: ViewChild,
                args: ['trigger']
            }], panel: [{
                type: ViewChild,
                args: ['panel']
            }], _overlayDir: [{
                type: ViewChild,
                args: [CdkConnectedOverlay]
            }], panelClass: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], multiple: [{
                type: Input
            }], disableOptionCentering: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], value: [{
                type: Input
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], errorStateMatcher: [{
                type: Input
            }], typeaheadDebounceInterval: [{
                type: Input
            }], sortComparator: [{
                type: Input
            }], id: [{
                type: Input
            }], openedChange: [{
                type: Output
            }], _openedStream: [{
                type: Output,
                args: ['opened']
            }], _closedStream: [{
                type: Output,
                args: ['closed']
            }], selectionChange: [{
                type: Output
            }], valueChange: [{
                type: Output
            }] } });
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 */
export class MatSelectTrigger {
}
MatSelectTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatSelectTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatSelectTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0", type: MatSelectTrigger, selector: "mat-select-trigger", providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatSelectTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-select-trigger',
                    providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }],
                }]
        }] });
export class MatSelect extends _MatSelectBase {
    constructor() {
        super(...arguments);
        this._positions = [
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                panelClass: 'mat-mdc-select-panel-above',
            },
        ];
    }
    get shouldLabelFloat() {
        // Since the panel doesn't overlap the trigger, we
        // want the label to only float when there's a value.
        return this.panelOpen || !this.empty || (this.focused && !!this.placeholder);
    }
    ngOnInit() {
        super.ngOnInit();
        this._viewportRuler
            .change()
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
            if (this.panelOpen) {
                this._overlayWidth = this._getOverlayWidth();
                this._changeDetectorRef.detectChanges();
            }
        });
    }
    ngAfterViewInit() {
        // Note that it's important that we read this in `ngAfterViewInit`, because
        // reading it earlier will cause the form field to return a different element.
        if (this._parentFormField) {
            this._preferredOverlayOrigin = this._parentFormField.getConnectedOverlayOrigin();
        }
    }
    open() {
        this._overlayWidth = this._getOverlayWidth();
        super.open();
        // Required for the MDC form field to pick up when the overlay has been opened.
        this.stateChanges.next();
    }
    close() {
        super.close();
        // Required for the MDC form field to pick up when the overlay has been closed.
        this.stateChanges.next();
    }
    /** Scrolls the active option into view. */
    _scrollOptionIntoView(index) {
        const option = this.options.toArray()[index];
        if (option) {
            const panel = this.panel.nativeElement;
            const labelCount = _countGroupLabelsBeforeOption(index, this.options, this.optionGroups);
            const element = option._getHostElement();
            if (index === 0 && labelCount === 1) {
                // If we've got one group label before the option and we're at the top option,
                // scroll the list to the top. This is better UX than scrolling the list to the
                // top of the option, because it allows the user to read the top group's label.
                panel.scrollTop = 0;
            }
            else {
                panel.scrollTop = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, panel.scrollTop, panel.offsetHeight);
            }
        }
    }
    _positioningSettled() {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
    }
    _getChangeEvent(value) {
        return new MatSelectChange(this, value);
    }
    /** Gets how wide the overlay panel should be. */
    _getOverlayWidth() {
        const refToMeasure = this._preferredOverlayOrigin instanceof CdkOverlayOrigin
            ? this._preferredOverlayOrigin.elementRef
            : this._preferredOverlayOrigin || this._elementRef;
        return refToMeasure.nativeElement.getBoundingClientRect().width;
    }
}
MatSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatSelect, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: MatSelect, selector: "mat-select", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none", "aria-haspopup": "listbox" }, listeners: { "keydown": "_handleKeydown($event)", "focus": "_onFocus()", "blur": "_onBlur()" }, properties: { "attr.id": "id", "attr.tabindex": "tabIndex", "attr.aria-controls": "panelOpen ? id + \"-panel\" : null", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "attr.aria-activedescendant": "_getAriaActiveDescendant()", "class.mat-mdc-select-disabled": "disabled", "class.mat-mdc-select-invalid": "errorState", "class.mat-mdc-select-required": "required", "class.mat-mdc-select-empty": "empty", "class.mat-mdc-select-multiple": "multiple" }, classAttribute: "mat-mdc-select" }, providers: [
        { provide: MatFormFieldControl, useExisting: MatSelect },
        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect },
    ], queries: [{ propertyName: "customTrigger", first: true, predicate: MAT_SELECT_TRIGGER, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], exportAs: ["matSelect"], usesInheritance: true, ngImport: i0, template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-mdc-select-trigger\"\n     (click)=\"toggle()\"\n     #fallbackOverlayOrigin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-mdc-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-mdc-select-placeholder mat-mdc-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-mdc-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-mdc-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-mdc-select-arrow-wrapper\">\n    <div class=\"mat-mdc-select-arrow\">\n      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->\n      <svg viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" focusable=\"false\">\n        <path d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </div>\n  </div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"_preferredOverlayOrigin || fallbackOverlayOrigin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayWidth]=\"_overlayWidth\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div\n    #panel\n    role=\"listbox\"\n    tabindex=\"-1\"\n    class=\"mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open {{ _getPanelTheme() }}\"\n    [attr.id]=\"id + '-panel'\"\n    [attr.aria-multiselectable]=\"multiple\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n    [ngClass]=\"panelClass\"\n    [@transformPanel]=\"'showing'\"\n    (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n    (keydown)=\"_handleKeydown($event)\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}.mat-mdc-select{display:inline-block;width:100%;outline:none}.mat-mdc-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-mdc-select-disabled .mat-mdc-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-mdc-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-mdc-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-mdc-select-arrow-wrapper{height:24px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper{transform:translateY(-8px)}.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper{transform:none}.mat-mdc-select-arrow{width:10px;height:5px;position:relative}.mat-mdc-select-arrow svg{fill:currentColor;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:CanvasText}.mat-mdc-select-disabled .cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:GrayText}.mdc-menu-surface.mat-mdc-select-panel{width:100%;max-height:275px;position:static;outline:0;margin:0;padding:8px 0;list-style-type:none}.mdc-menu-surface.mat-mdc-select-panel:focus{outline:none}.cdk-high-contrast-active .mdc-menu-surface.mat-mdc-select-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-select-panel-above) .mdc-menu-surface.mat-mdc-select-panel{border-top-left-radius:0;border-top-right-radius:0;transform-origin:top center}.mat-mdc-select-panel-above .mdc-menu-surface.mat-mdc-select-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:bottom center}.mat-mdc-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-mdc-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-mdc-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label{max-width:calc(100% - 18px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 24px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch{max-width:calc(100% - 24px)}.mat-mdc-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"], dependencies: [{ kind: "directive", type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i7.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i7.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i7.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "directive", type: i8.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: i8.CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }], animations: [matSelectAnimations.transformPanel], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MatSelect, decorators: [{
            type: Component,
            args: [{ selector: 'mat-select', exportAs: 'matSelect', inputs: ['disabled', 'disableRipple', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'role': 'combobox',
                        'aria-autocomplete': 'none',
                        'aria-haspopup': 'listbox',
                        'class': 'mat-mdc-select',
                        '[attr.id]': 'id',
                        '[attr.tabindex]': 'tabIndex',
                        '[attr.aria-controls]': 'panelOpen ? id + "-panel" : null',
                        '[attr.aria-expanded]': 'panelOpen',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.aria-required]': 'required.toString()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
                        '[class.mat-mdc-select-disabled]': 'disabled',
                        '[class.mat-mdc-select-invalid]': 'errorState',
                        '[class.mat-mdc-select-required]': 'required',
                        '[class.mat-mdc-select-empty]': 'empty',
                        '[class.mat-mdc-select-multiple]': 'multiple',
                        '(keydown)': '_handleKeydown($event)',
                        '(focus)': '_onFocus()',
                        '(blur)': '_onBlur()',
                    }, animations: [matSelectAnimations.transformPanel], providers: [
                        { provide: MatFormFieldControl, useExisting: MatSelect },
                        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect },
                    ], template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-mdc-select-trigger\"\n     (click)=\"toggle()\"\n     #fallbackOverlayOrigin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-mdc-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-mdc-select-placeholder mat-mdc-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-mdc-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-mdc-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-mdc-select-arrow-wrapper\">\n    <div class=\"mat-mdc-select-arrow\">\n      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->\n      <svg viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" focusable=\"false\">\n        <path d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </div>\n  </div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"_preferredOverlayOrigin || fallbackOverlayOrigin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayWidth]=\"_overlayWidth\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div\n    #panel\n    role=\"listbox\"\n    tabindex=\"-1\"\n    class=\"mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open {{ _getPanelTheme() }}\"\n    [attr.id]=\"id + '-panel'\"\n    [attr.aria-multiselectable]=\"multiple\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n    [ngClass]=\"panelClass\"\n    [@transformPanel]=\"'showing'\"\n    (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n    (keydown)=\"_handleKeydown($event)\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}.mat-mdc-select{display:inline-block;width:100%;outline:none}.mat-mdc-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-mdc-select-disabled .mat-mdc-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-mdc-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-mdc-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-mdc-select-arrow-wrapper{height:24px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper{transform:translateY(-8px)}.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper{transform:none}.mat-mdc-select-arrow{width:10px;height:5px;position:relative}.mat-mdc-select-arrow svg{fill:currentColor;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:CanvasText}.mat-mdc-select-disabled .cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:GrayText}.mdc-menu-surface.mat-mdc-select-panel{width:100%;max-height:275px;position:static;outline:0;margin:0;padding:8px 0;list-style-type:none}.mdc-menu-surface.mat-mdc-select-panel:focus{outline:none}.cdk-high-contrast-active .mdc-menu-surface.mat-mdc-select-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-select-panel-above) .mdc-menu-surface.mat-mdc-select-panel{border-top-left-radius:0;border-top-right-radius:0;transform-origin:top center}.mat-mdc-select-panel-above .mdc-menu-surface.mat-mdc-select-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:bottom center}.mat-mdc-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-mdc-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-mdc-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label{max-width:calc(100% - 18px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 24px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch{max-width:calc(100% - 24px)}.mat-mdc-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"] }]
        }], propDecorators: { options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }], optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], customTrigger: [{
                type: ContentChild,
                args: [MAT_SELECT_TRIGGER]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBRSxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGNBQWMsRUFDZCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUVoQixPQUFPLEdBRVIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUdMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxJQUFJLEVBRUosU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsa0JBQWtCLEVBQ2xCLFNBQVMsRUFDVCxNQUFNLEVB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STt3QkFDakIsaUJBQWlCLEVBQUUsVUFBVTt3QkFDN0Isc0JBQXNCLEVBQUUsa0NBQWtDO3dCQUMxRCxzQkFBc0IsRUFBRSxXQUFXO3dCQUNuQyxtQkFBbUIsRUFBRSxtQkFBbUI7d0JBQ3hDLHNCQUFzQixFQUFFLHFCQUFxQjt3QkFDN0Msc0JBQXNCLEVBQUUscUJBQXFCO3dCQUM3QyxxQkFBcUIsRUFBRSxZQUFZO3dCQUNuQyw4QkFBOEIsRUFBRSw0QkFBNEI7d0JBQzVELGlDQUFpQyxFQUFFLFVBQVU7d0JBQzdDLGdDQUFnQyxFQUFFLFlBQVk7d0JBQzlDLGlDQUFpQyxFQUFFLFVBQVU7d0JBQzdDLDhCQUE4QixFQUFFLE9BQU87d0JBQ3ZDLGlDQUFpQyxFQUFFLFVBQVU7d0JBQzdDLFdBQVcsRUFBRSx3QkFBd0I7d0JBQ3JDLFNBQVMsRUFBRSxZQUFZO3dCQUN2QixRQUFRLEVBQUUsV0FBVztxQkFDdEIsY0FDVyxDQUFDLG1CQUFtQixDQUFDLGNBQWMsQ0FBQyxhQUNyQzt3QkFDVCxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLFdBQVcsRUFBQzt3QkFDdEQsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxXQUFXLEVBQUM7cUJBQy9EOzhCQUdnRCxPQUFPO3NCQUF2RCxlQUFlO3VCQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBQ0ssWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUNoQixhQUFhO3NCQUE5QyxZQUFZO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyLCBMaXZlQW5ub3VuY2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0LFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIFNQQUNFLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENka0Nvbm5lY3RlZE92ZXJsYXksXG4gIENka092ZXJsYXlPcmlnaW4sXG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTZWxmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEFic3RyYWN0Q29udHJvbCxcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBOZ0Zvcm0sXG4gIFZhbGlkYXRvcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBIYXNUYWJJbmRleCxcbiAgTWF0T3B0Z3JvdXAsXG4gIE1hdE9wdGlvbixcbiAgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlLFxuICBNQVRfT1BUR1JPVVAsXG4gIE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkVycm9yU3RhdGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG4gIF9NYXRPcHRpb25CYXNlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Rm9ybUZpZWxkLCBNYXRGb3JtRmllbGRDb250cm9sLCBNQVRfRk9STV9GSUVMRH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LXNlbGVjdC1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBvdmVybGF5OiBPdmVybGF5LFxuKTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U2VsZWN0Q29uZmlnIHtcbiAgLyoqIFdoZXRoZXIgb3B0aW9uIGNlbnRlcmluZyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVPcHRpb25DZW50ZXJpbmc/OiBib29sZWFuO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXI7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRTZWxlY3QsXG4gICAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2VsZWN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRTZWxlY3RNaXhpbkJhc2UgPSBtaXhpbkRpc2FibGVSaXBwbGUoXG4gIG1peGluVGFiSW5kZXgoXG4gICAgbWl4aW5EaXNhYmxlZChcbiAgICAgIG1peGluRXJyb3JTdGF0ZShcbiAgICAgICAgY2xhc3Mge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEVtaXRzIHdoZW5ldmVyIHRoZSBjb21wb25lbnQgc3RhdGUgY2hhbmdlcyBhbmQgc2hvdWxkIGNhdXNlIHRoZSBwYXJlbnRcbiAgICAgICAgICAgKiBmb3JtLWZpZWxkIHRvIHVwZGF0ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAgICAgICAgICogQGRvY3MtcHJpdmF0ZVxuICAgICAgICAgICAqL1xuICAgICAgICAgIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICAgICAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRm9ybSBjb250cm9sIGJvdW5kIHRvIHRoZSBjb21wb25lbnQuXG4gICAgICAgICAgICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIGBNYXRGb3JtRmllbGRDb250cm9sYC5cbiAgICAgICAgICAgICAqIEBkb2NzLXByaXZhdGVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgICAgICAgICkge31cbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgKSxcbiAgKSxcbik7XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0U2VsZWN0YCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFNlbGVjdEJhc2U8Qz5cbiAgZXh0ZW5kcyBfTWF0U2VsZWN0TWl4aW5CYXNlXG4gIGltcGxlbWVudHNcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIERvQ2hlY2ssXG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgQ2FuRGlzYWJsZSxcbiAgICBIYXNUYWJJbmRleCxcbiAgICBNYXRGb3JtRmllbGRDb250cm9sPGFueT4sXG4gICAgQ2FuVXBkYXRlRXJyb3JTdGF0ZSxcbiAgICBDYW5EaXNhYmxlUmlwcGxlXG57XG4gIC8qKiBBbGwgb2YgdGhlIGRlZmluZWQgc2VsZWN0IG9wdGlvbnMuICovXG4gIGFic3RyYWN0IG9wdGlvbnM6IFF1ZXJ5TGlzdDxfTWF0T3B0aW9uQmFzZT47XG5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgaXMgb25seSBuZWNlc3NhcnkgZm9yIHRoZSBub24tTURDIHNlbGVjdCwgYnV0IGl0J3MgdGVjaG5pY2FsbHkgYVxuICAvLyBwdWJsaWMgQVBJIHNvIHdlIGhhdmUgdG8ga2VlcCBpdC4gSXQgc2hvdWxkIGJlIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWQgZXZlbnR1YWxseS5cbiAgLyoqIEFsbCBvZiB0aGUgZGVmaW5lZCBncm91cHMgb2Ygb3B0aW9ucy4gKi9cbiAgYWJzdHJhY3Qgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+O1xuXG4gIC8qKiBVc2VyLXN1cHBsaWVkIG92ZXJyaWRlIG9mIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIGFic3RyYWN0IGN1c3RvbVRyaWdnZXI6IHt9O1xuXG4gIC8qKlxuICAgKiBUaGlzIHBvc2l0aW9uIGNvbmZpZyBlbnN1cmVzIHRoYXQgdGhlIHRvcCBcInN0YXJ0XCIgY29ybmVyIG9mIHRoZSBvdmVybGF5XG4gICAqIGlzIGFsaWduZWQgd2l0aCB3aXRoIHRoZSB0b3AgXCJzdGFydFwiIG9mIHRoZSBvcmlnaW4gYnkgZGVmYXVsdCAob3ZlcmxhcHBpbmdcbiAgICogdGhlIHRyaWdnZXIgY29tcGxldGVseSkuIElmIHRoZSBwYW5lbCBjYW5ub3QgZml0IGJlbG93IHRoZSB0cmlnZ2VyLCBpdFxuICAgKiB3aWxsIGZhbGwgYmFjayB0byBhIHBvc2l0aW9uIGFib3ZlIHRoZSB0cmlnZ2VyLlxuICAgKi9cbiAgYWJzdHJhY3QgX3Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXTtcblxuICAvKiogU2Nyb2xscyBhIHBhcnRpY3VsYXIgb3B0aW9uIGludG8gdGhlIHZpZXcuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2Nyb2xsT3B0aW9uSW50b1ZpZXcoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBwYW5lbCBoYXMgYmVlbiBvcGVuZWQgYW5kIHRoZSBvdmVybGF5IGhhcyBzZXR0bGVkIG9uIGl0cyBmaW5hbCBwb3NpdGlvbi4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9wb3NpdGlvbmluZ1NldHRsZWQoKTogdm9pZDtcblxuICAvKiogQ3JlYXRlcyBhIGNoYW5nZSBldmVudCBvYmplY3QgdGhhdCBzaG91bGQgYmUgZW1pdHRlZCBieSB0aGUgc2VsZWN0LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2dldENoYW5nZUV2ZW50KHZhbHVlOiBhbnkpOiBDO1xuXG4gIC8qKiBGYWN0b3J5IGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGEgc2Nyb2xsIHN0cmF0ZWd5IGZvciB0aGlzIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfcGFuZWxPcGVuID0gZmFsc2U7XG5cbiAgLyoqIENvbXBhcmlzb24gZnVuY3Rpb24gdG8gc3BlY2lmeSB3aGljaCBvcHRpb24gaXMgZGlzcGxheWVkLiBEZWZhdWx0cyB0byBvYmplY3QgZXF1YWxpdHkuICovXG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoID0gKG8xOiBhbnksIG8yOiBhbnkpID0+IG8xID09PSBvMjtcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcml2YXRlIF91aWQgPSBgbWF0LXNlbGVjdC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIEN1cnJlbnQgYGFyaWEtbGFiZWxsZWRieWAgdmFsdWUgZm9yIHRoZSBzZWxlY3QgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckFyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogS2VlcHMgdHJhY2sgb2YgdGhlIHByZXZpb3VzIGZvcm0gY29udHJvbCBhc3NpZ25lZCB0byB0aGUgc2VsZWN0LlxuICAgKiBVc2VkIHRvIGRldGVjdCBpZiBpdCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHByaXZhdGUgX3ByZXZpb3VzQ29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgdXNlckFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xuXG4gIC8qKiBEZWFscyB3aXRoIHRoZSBzZWxlY3Rpb24gbG9naWMuICovXG4gIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPjtcblxuICAvKiogTWFuYWdlcyBrZXlib2FyZCBldmVudHMgZm9yIG9wdGlvbnMgaW4gdGhlIHBhbmVsLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBzZWxlY3QgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBJRCBmb3IgdGhlIERPTSBub2RlIGNvbnRhaW5pbmcgdGhlIHNlbGVjdCdzIHZhbHVlLiAqL1xuICBfdmFsdWVJZCA9IGBtYXQtc2VsZWN0LXZhbHVlLSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcGFuZWwgZWxlbWVudCBpcyBmaW5pc2hlZCB0cmFuc2Zvcm1pbmcgaW4uICovXG4gIHJlYWRvbmx5IF9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW0gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgLyoqIFN0cmF0ZWd5IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGhhbmRsZSBzY3JvbGxpbmcgd2hpbGUgdGhlIHNlbGVjdCBwYW5lbCBpcyBvcGVuLiAqL1xuICBfc2Nyb2xsU3RyYXRlZ3k6IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIF9vdmVybGF5UGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8ub3ZlcmxheVBhbmVsQ2xhc3MgfHwgJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBpcyBmb2N1c2VkLiAqL1xuICBnZXQgZm9jdXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZm9jdXNlZCB8fCB0aGlzLl9wYW5lbE9wZW47XG4gIH1cbiAgcHJpdmF0ZSBfZm9jdXNlZCA9IGZhbHNlO1xuXG4gIC8qKiBBIG5hbWUgZm9yIHRoaXMgY29udHJvbCB0aGF0IGNhbiBiZSB1c2VkIGJ5IGBtYXQtZm9ybS1maWVsZGAuICovXG4gIGNvbnRyb2xUeXBlID0gJ21hdC1zZWxlY3QnO1xuXG4gIC8qKiBUcmlnZ2VyIHRoYXQgb3BlbnMgdGhlIHNlbGVjdC4gKi9cbiAgQFZpZXdDaGlsZCgndHJpZ2dlcicpIHRyaWdnZXI6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFBhbmVsIGNvbnRhaW5pbmcgdGhlIHNlbGVjdCBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKCdwYW5lbCcpIHBhbmVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBPdmVybGF5IHBhbmUgY29udGFpbmluZyB0aGUgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZChDZGtDb25uZWN0ZWRPdmVybGF5KVxuICBwcm90ZWN0ZWQgX292ZXJsYXlEaXI6IENka0Nvbm5lY3RlZE92ZXJsYXk7XG5cbiAgLyoqIENsYXNzZXMgdG8gYmUgcGFzc2VkIHRvIHRoZSBzZWxlY3QgcGFuZWwuIFN1cHBvcnRzIHRoZSBzYW1lIHN5bnRheCBhcyBgbmdDbGFzc2AuICovXG4gIEBJbnB1dCgpIHBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdIHwgU2V0PHN0cmluZz4gfCB7W2tleTogc3RyaW5nXTogYW55fTtcblxuICAvKiogUGxhY2Vob2xkZXIgdG8gYmUgc2hvd24gaWYgbm8gdmFsdWUgaGFzIGJlZW4gc2VsZWN0ZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwbGFjZWhvbGRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjtcbiAgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX3BsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCA/PyB0aGlzLm5nQ29udHJvbD8uY29udHJvbD8uaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMucmVxdWlyZWQpID8/IGZhbHNlO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBzZWxlY3QgbXVsdGlwbGUgb3B0aW9ucy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tdWx0aXBsZTtcbiAgfVxuICBzZXQgbXVsdGlwbGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0RHluYW1pY011bHRpcGxlRXJyb3IoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tdWx0aXBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBjZW50ZXIgdGhlIGFjdGl2ZSBvcHRpb24gb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVPcHRpb25DZW50ZXJpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc7XG4gIH1cbiAgc2V0IGRpc2FibGVPcHRpb25DZW50ZXJpbmcodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmcgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVPcHRpb25DZW50ZXJpbmcgPSB0aGlzLl9kZWZhdWx0T3B0aW9ucz8uZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA/PyBmYWxzZTtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdG8gY29tcGFyZSB0aGUgb3B0aW9uIHZhbHVlcyB3aXRoIHRoZSBzZWxlY3RlZCB2YWx1ZXMuIFRoZSBmaXJzdCBhcmd1bWVudFxuICAgKiBpcyBhIHZhbHVlIGZyb20gYW4gb3B0aW9uLiBUaGUgc2Vjb25kIGlzIGEgdmFsdWUgZnJvbSB0aGUgc2VsZWN0aW9uLiBBIGJvb2xlYW5cbiAgICogc2hvdWxkIGJlIHJldHVybmVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbXBhcmVXaXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wYXJlV2l0aDtcbiAgfVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uRnVuY3Rpb25WYWx1ZUVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XG4gICAgICAvLyBBIGRpZmZlcmVudCBjb21wYXJhdG9yIG1lYW5zIHRoZSBzZWxlY3Rpb24gY291bGQgY2hhbmdlLlxuICAgICAgdGhpcy5faW5pdGlhbGl6ZVNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBWYWx1ZSBvZiB0aGUgc2VsZWN0IGNvbnRyb2wuICovXG4gIEBJbnB1dCgpXG4gIGdldCB2YWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGNvbnN0IGhhc0Fzc2lnbmVkID0gdGhpcy5fYXNzaWduVmFsdWUobmV3VmFsdWUpO1xuXG4gICAgaWYgKGhhc0Fzc2lnbmVkKSB7XG4gICAgICB0aGlzLl9vbkNoYW5nZShuZXdWYWx1ZSk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIHNlbGVjdC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogT2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgb3ZlcnJpZGUgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7XG4gIH1cbiAgc2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gc29ydCB0aGUgdmFsdWVzIGluIGEgc2VsZWN0IGluIG11bHRpcGxlIG1vZGUuXG4gICAqIEZvbGxvd3MgdGhlIHNhbWUgbG9naWMgYXMgYEFycmF5LnByb3RvdHlwZS5zb3J0YC5cbiAgICovXG4gIEBJbnB1dCgpIHNvcnRDb21wYXJhdG9yOiAoYTogTWF0T3B0aW9uLCBiOiBNYXRPcHRpb24sIG9wdGlvbnM6IE1hdE9wdGlvbltdKSA9PiBudW1iZXI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2lkOiBzdHJpbmc7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIG9wdGlvbnMnIGNoYW5nZSBldmVudHMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbkNoYW5nZXM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKFxuICAgICAgdGFrZSgxKSxcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMpLFxuICAgICk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgcGFuZWwgaGFzIGJlZW4gdG9nZ2xlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLm9wZW5lZENoYW5nZS5waXBlKFxuICAgIGZpbHRlcihvID0+IG8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gIW8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0ZWQgdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBieSB0aGUgdXNlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPEM+ID0gbmV3IEV2ZW50RW1pdHRlcjxDPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNlbGVjdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJvdGVjdGVkIF9wYXJlbnRGb3JtRmllbGQ6IE1hdEZvcm1GaWVsZCxcbiAgICBAU2VsZigpIEBPcHRpb25hbCgpIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBASW5qZWN0KE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk6IGFueSxcbiAgICBwcml2YXRlIF9saXZlQW5ub3VuY2VyOiBMaXZlQW5ub3VuY2VyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1NFTEVDVF9DT05GSUcpIHByaXZhdGUgX2RlZmF1bHRPcHRpb25zPzogTWF0U2VsZWN0Q29uZmlnLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSwgX3BhcmVudEZvcm1Hcm91cCwgbmdDb250cm9sKTtcblxuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gTm90ZTogd2UgcHJvdmlkZSB0aGUgdmFsdWUgYWNjZXNzb3IgdGhyb3VnaCBoZXJlLCBpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgYHByb3ZpZGVyc2AgdG8gYXZvaWQgcnVubmluZyBpbnRvIGEgY2lyY3VsYXIgaW1wb3J0LlxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBzZXQgdGhpcyB3aGVuIHRoZSBkZWZhdWx0cyBwYXNzIGl0IGluLCBvdGhlcndpc2UgaXQgc2hvdWxkXG4gICAgLy8gc3RheSBhcyBgdW5kZWZpbmVkYCBzbyB0aGF0IGl0IGZhbGxzIGJhY2sgdG8gdGhlIGRlZmF1bHQgaW4gdGhlIGtleSBtYW5hZ2VyLlxuICAgIGlmIChfZGVmYXVsdE9wdGlvbnM/LnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCA9IF9kZWZhdWx0T3B0aW9ucy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsO1xuICAgIH1cblxuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeSA9IHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTtcbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneSA9IHRoaXMuX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeSgpO1xuICAgIHRoaXMudGFiSW5kZXggPSBwYXJzZUludCh0YWJJbmRleCkgfHwgMDtcblxuICAgIC8vIEZvcmNlIHNldHRlciB0byBiZSBjYWxsZWQgaW4gY2FzZSBpZCB3YXMgbm90IHNwZWNpZmllZC5cbiAgICB0aGlzLmlkID0gdGhpcy5pZDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj4odGhpcy5tdWx0aXBsZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuXG4gICAgLy8gV2UgbmVlZCBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGhlcmUsIGJlY2F1c2Ugc29tZSBicm93c2VycyB3aWxsXG4gICAgLy8gZmlyZSB0aGUgYW5pbWF0aW9uIGVuZCBldmVudCB0d2ljZSBmb3IgdGhlIHNhbWUgYW5pbWF0aW9uLiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW1cbiAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcGFuZWxEb25lQW5pbWF0aW5nKHRoaXMucGFuZWxPcGVuKSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5pdEtleU1hbmFnZXIoKTtcblxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5hZGRlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0KCkpO1xuICAgICAgZXZlbnQucmVtb3ZlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uZGVzZWxlY3QoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRPcHRpb25zKCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgY29uc3QgbmV3QXJpYUxhYmVsbGVkYnkgPSB0aGlzLl9nZXRUcmlnZ2VyQXJpYUxhYmVsbGVkYnkoKTtcbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLm5nQ29udHJvbDtcblxuICAgIC8vIFdlIGhhdmUgdG8gbWFuYWdlIHNldHRpbmcgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIG91cnNlbHZlcywgYmVjYXVzZSBwYXJ0IG9mIGl0cyB2YWx1ZVxuICAgIC8vIGlzIGNvbXB1dGVkIGFzIGEgcmVzdWx0IG9mIGEgY29udGVudCBxdWVyeSB3aGljaCBjYW4gY2F1c2UgdGhpcyBiaW5kaW5nIHRvIHRyaWdnZXIgYVxuICAgIC8vIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3IuXG4gICAgaWYgKG5ld0FyaWFMYWJlbGxlZGJ5ICE9PSB0aGlzLl90cmlnZ2VyQXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fdHJpZ2dlckFyaWFMYWJlbGxlZEJ5ID0gbmV3QXJpYUxhYmVsbGVkYnk7XG4gICAgICBpZiAobmV3QXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIG5ld0FyaWFMYWJlbGxlZGJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmdDb250cm9sKSB7XG4gICAgICAvLyBUaGUgZGlzYWJsZWQgc3RhdGUgbWlnaHQgZ28gb3V0IG9mIHN5bmMgaWYgdGhlIGZvcm0gZ3JvdXAgaXMgc3dhcHBlZCBvdXQuIFNlZSAjMTc4NjAuXG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNDb250cm9sICE9PSBuZ0NvbnRyb2wuY29udHJvbCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNDb250cm9sICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IG5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ29udHJvbCA9IG5nQ29udHJvbC5jb250cm9sO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gVXBkYXRpbmcgdGhlIGRpc2FibGVkIHN0YXRlIGlzIGhhbmRsZWQgYnkgYG1peGluRGlzYWJsZWRgLCBidXQgd2UgbmVlZCB0byBhZGRpdGlvbmFsbHkgbGV0XG4gICAgLy8gdGhlIHBhcmVudCBmb3JtIGZpZWxkIGtub3cgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgY2hhbmdlcy5cbiAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXSB8fCBjaGFuZ2VzWyd1c2VyQXJpYURlc2NyaWJlZEJ5J10pIHtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sndHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCddICYmIHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgb3ZlcmxheSBwYW5lbCBvcGVuIG9yIGNsb3NlZC4gKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMucGFuZWxPcGVuID8gdGhpcy5jbG9zZSgpIDogdGhpcy5vcGVuKCk7XG4gIH1cblxuICAvKiogT3BlbnMgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Nhbk9wZW4oKSkge1xuICAgICAgdGhpcy5fcGFuZWxPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbihudWxsKTtcbiAgICAgIHRoaXMuX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbG9zZXMgdGhlIG92ZXJsYXkgcGFuZWwgYW5kIGZvY3VzZXMgdGhlIGhvc3QgZWxlbWVudC4gKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgdGhpcy5fcGFuZWxPcGVuID0gZmFsc2U7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5faXNSdGwoKSA/ICdydGwnIDogJ2x0cicpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0J3MgdmFsdWUuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBOZXcgdmFsdWUgdG8gYmUgd3JpdHRlbiB0byB0aGUgbW9kZWwuXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NpZ25WYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCdzIHZhbHVlXG4gICAqIGNoYW5nZXMgZnJvbSB1c2VyIGlucHV0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNlbGVjdCBpcyBibHVycmVkXG4gICAqIGJ5IHRoZSB1c2VyLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gQ2FsbGJhY2sgdG8gYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIGNvbXBvbmVudCBoYXMgYmVlbiB0b3VjaGVkLlxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIHNlbGVjdC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgU2V0cyB3aGV0aGVyIHRoZSBjb21wb25lbnQgaXMgZGlzYWJsZWQuXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IHBhbmVsT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxPcGVuO1xuICB9XG5cbiAgLyoqIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBnZXQgc2VsZWN0ZWQoKTogTWF0T3B0aW9uIHwgTWF0T3B0aW9uW10ge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gdGhpcy5fc2VsZWN0aW9uTW9kZWw/LnNlbGVjdGVkIHx8IFtdIDogdGhpcy5fc2VsZWN0aW9uTW9kZWw/LnNlbGVjdGVkWzBdO1xuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBkaXNwbGF5ZWQgaW4gdGhlIHRyaWdnZXIuICovXG4gIGdldCB0cmlnZ2VyVmFsdWUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lbXB0eSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQubWFwKG9wdGlvbiA9PiBvcHRpb24udmlld1ZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMuX2lzUnRsKCkpIHtcbiAgICAgICAgc2VsZWN0ZWRPcHRpb25zLnJldmVyc2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IGRlbGltaXRlciBzaG91bGQgYmUgY29uZmlndXJhYmxlIGZvciBwcm9wZXIgbG9jYWxpemF0aW9uLlxuICAgICAgcmV0dXJuIHNlbGVjdGVkT3B0aW9ucy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXS52aWV3VmFsdWU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbiBSVEwgbW9kZS4gKi9cbiAgX2lzUnRsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnIDogZmFsc2U7XG4gIH1cblxuICAvKiogSGFuZGxlcyBhbGwga2V5ZG93biBldmVudHMgb24gdGhlIHNlbGVjdC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZWxPcGVuID8gdGhpcy5faGFuZGxlT3BlbktleWRvd24oZXZlbnQpIDogdGhpcy5faGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIHdoaWxlIHRoZSBzZWxlY3QgaXMgY2xvc2VkLiAqL1xuICBwcml2YXRlIF9oYW5kbGVDbG9zZWRLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaXNBcnJvd0tleSA9XG4gICAgICBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8XG4gICAgICBrZXlDb2RlID09PSBVUF9BUlJPVyB8fFxuICAgICAga2V5Q29kZSA9PT0gTEVGVF9BUlJPVyB8fFxuICAgICAga2V5Q29kZSA9PT0gUklHSFRfQVJST1c7XG4gICAgY29uc3QgaXNPcGVuS2V5ID0ga2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0U7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICAvLyBPcGVuIHRoZSBzZWxlY3Qgb24gQUxUICsgYXJyb3cga2V5IHRvIG1hdGNoIHRoZSBuYXRpdmUgPHNlbGVjdD5cbiAgICBpZiAoXG4gICAgICAoIW1hbmFnZXIuaXNUeXBpbmcoKSAmJiBpc09wZW5LZXkgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICgodGhpcy5tdWx0aXBsZSB8fCBldmVudC5hbHRLZXkpICYmIGlzQXJyb3dLZXkpXG4gICAgKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50cyB0aGUgcGFnZSBmcm9tIHNjcm9sbGluZyBkb3duIHdoZW4gcHJlc3Npbmcgc3BhY2VcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG5cbiAgICAgIC8vIFNpbmNlIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZCwgd2UgbmVlZCB0byBhbm5vdW5jZSBpdCBvdXJzZWx2ZXMuXG4gICAgICBpZiAoc2VsZWN0ZWRPcHRpb24gJiYgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uICE9PSBzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAvLyBXZSBzZXQgYSBkdXJhdGlvbiBvbiB0aGUgbGl2ZSBhbm5vdW5jZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgbGl2ZSBlbGVtZW50IHRvIGJlXG4gICAgICAgIC8vIGNsZWFyZWQgYWZ0ZXIgYSB3aGlsZSBzbyB0aGF0IHVzZXJzIGNhbid0IG5hdmlnYXRlIHRvIGl0IHVzaW5nIHRoZSBhcnJvdyBrZXlzLlxuICAgICAgICB0aGlzLl9saXZlQW5ub3VuY2VyLmFubm91bmNlKChzZWxlY3RlZE9wdGlvbiBhcyBNYXRPcHRpb24pLnZpZXdWYWx1ZSwgMTAwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGVuIHRoZSBzZWxlY3RlZCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9oYW5kbGVPcGVuS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8IGtleUNvZGUgPT09IFVQX0FSUk9XO1xuICAgIGNvbnN0IGlzVHlwaW5nID0gbWFuYWdlci5pc1R5cGluZygpO1xuXG4gICAgaWYgKGlzQXJyb3dLZXkgJiYgZXZlbnQuYWx0S2V5KSB7XG4gICAgICAvLyBDbG9zZSB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaW4gdGhpcyBjYXNlIGlmIHRoZSB1c2VyIGlzIHR5cGluZyxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIHR5cGluZyBzZXF1ZW5jZSBjYW4gaW5jbHVkZSB0aGUgc3BhY2Uga2V5LlxuICAgIH0gZWxzZSBpZiAoXG4gICAgICAhaXNUeXBpbmcgJiZcbiAgICAgIChrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRSkgJiZcbiAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgIWhhc01vZGlmaWVyS2V5KGV2ZW50KVxuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiB0aGlzLl9tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBBICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYXNEZXNlbGVjdGVkT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5zb21lKG9wdCA9PiAhb3B0LmRpc2FibGVkICYmICFvcHQuc2VsZWN0ZWQpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBpZiAoIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICAgIGhhc0Rlc2VsZWN0ZWRPcHRpb25zID8gb3B0aW9uLnNlbGVjdCgpIDogb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEluZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcblxuICAgICAgaWYgKFxuICAgICAgICB0aGlzLl9tdWx0aXBsZSAmJlxuICAgICAgICBpc0Fycm93S2V5ICYmXG4gICAgICAgIGV2ZW50LnNoaWZ0S2V5ICYmXG4gICAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCAhPT0gcHJldmlvdXNseUZvY3VzZWRJbmRleFxuICAgICAgKSB7XG4gICAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfb25Gb2N1cygpIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX2ZvY3VzZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyB0aGUgdG91Y2hlZCBjYWxsYmFjayBvbmx5IGlmIHRoZSBwYW5lbCBpcyBjbG9zZWQuIE90aGVyd2lzZSwgdGhlIHRyaWdnZXIgd2lsbFxuICAgKiBcImJsdXJcIiB0byB0aGUgcGFuZWwgd2hlbiBpdCBvcGVucywgY2F1c2luZyBhIGZhbHNlIHBvc2l0aXZlLlxuICAgKi9cbiAgX29uQmx1cigpIHtcbiAgICB0aGlzLl9mb2N1c2VkID0gZmFsc2U7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uY2FuY2VsVHlwZWFoZWFkKCk7XG5cbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0aGF0IGlzIGludm9rZWQgd2hlbiB0aGUgb3ZlcmxheSBwYW5lbCBoYXMgYmVlbiBhdHRhY2hlZC5cbiAgICovXG4gIF9vbkF0dGFjaGVkKCk6IHZvaWQge1xuICAgIHRoaXMuX292ZXJsYXlEaXIucG9zaXRpb25DaGFuZ2UucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5fcG9zaXRpb25pbmdTZXR0bGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgdGhlbWUgdG8gYmUgdXNlZCBvbiB0aGUgcGFuZWwuICovXG4gIF9nZXRQYW5lbFRoZW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudEZvcm1GaWVsZCA/IGBtYXQtJHt0aGlzLl9wYXJlbnRGb3JtRmllbGQuY29sb3J9YCA6ICcnO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNlbGVjdCBoYXMgYSB2YWx1ZS4gKi9cbiAgZ2V0IGVtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fc2VsZWN0aW9uTW9kZWwgfHwgdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNFbXB0eSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdGlhbGl6ZVNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICAvLyBEZWZlciBzZXR0aW5nIHRoZSB2YWx1ZSBpbiBvcmRlciB0byBhdm9pZCB0aGUgXCJFeHByZXNzaW9uXG4gICAgLy8gaGFzIGNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMgZnJvbSBBbmd1bGFyLlxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdGhpcy5uZ0NvbnRyb2wudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5fdmFsdWUpO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdGVkIG9wdGlvbiBiYXNlZCBvbiBhIHZhbHVlLiBJZiBubyBvcHRpb24gY2FuIGJlXG4gICAqIGZvdW5kIHdpdGggdGhlIGRlc2lnbmF0ZWQgdmFsdWUsIHRoZSBzZWxlY3QgdHJpZ2dlciBpcyBjbGVhcmVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2V0U2VsZWN0aW9uQnlWYWx1ZSh2YWx1ZTogYW55IHwgYW55W10pOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLnNldEluYWN0aXZlU3R5bGVzKCkpO1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25BcnJheVZhbHVlRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdE9wdGlvbkJ5VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLl9zZWxlY3RPcHRpb25CeVZhbHVlKHZhbHVlKTtcblxuICAgICAgLy8gU2hpZnQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBpdGVtLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGRvIHRoaXMgaW4gbXVsdGlwbGVcbiAgICAgIC8vIG1vZGUsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IG9wdGlvbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggbGFzdC5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSByZXNldCB0aGUgaGlnaGxpZ2h0ZWQgb3B0aW9uLiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXMgd2hpbGVcbiAgICAgICAgLy8gY2xvc2VkLCBiZWNhdXNlIGRvaW5nIGl0IHdoaWxlIG9wZW4gY2FuIHNoaWZ0IHRoZSB1c2VyJ3MgZm9jdXMgdW5uZWNlc3NhcmlseS5cbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyBhbmQgb3B0aW9uIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgT3B0aW9uIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0T3B0aW9uQnlWYWx1ZSh2YWx1ZTogYW55KTogTWF0T3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQoKG9wdGlvbjogTWF0T3B0aW9uKSA9PiB7XG4gICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgLy8gd2hlcmUgdGhlIHNhbWUgcHJpbWl0aXZlIHZhbHVlIGlzIHNlbGVjdGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRyZWF0IG51bGwgYXMgYSBzcGVjaWFsIHJlc2V0IHZhbHVlLlxuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlICE9IG51bGwgJiYgdGhpcy5fY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgICAgLy8gTm90aWZ5IGRldmVsb3BlcnMgb2YgZXJyb3JzIGluIHRoZWlyIGNvbXBhcmF0b3IuXG4gICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KGNvcnJlc3BvbmRpbmdPcHRpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBjb3JyZXNwb25kaW5nT3B0aW9uO1xuICB9XG5cbiAgLyoqIEFzc2lnbnMgYSBzcGVjaWZpYyB2YWx1ZSB0byB0aGUgc2VsZWN0LiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBwcml2YXRlIF9hc3NpZ25WYWx1ZShuZXdWYWx1ZTogYW55IHwgYW55W10pOiBib29sZWFuIHtcbiAgICAvLyBBbHdheXMgcmUtYXNzaWduIGFuIGFycmF5LCBiZWNhdXNlIGl0IG1pZ2h0IGhhdmUgYmVlbiBtdXRhdGVkLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUgfHwgKHRoaXMuX211bHRpcGxlICYmIEFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoUGFnZVVwRG93bigpXG4gICAgICAud2l0aEFsbG93ZWRNb2RpZmllcktleXMoWydzaGlmdEtleSddKTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gU2VsZWN0IHRoZSBhY3RpdmUgaXRlbSB3aGVuIHRhYmJpbmcgYXdheS4gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggaG93IHRoZSBuYXRpdmVcbiAgICAgICAgLy8gc2VsZWN0IGJlaGF2ZXMuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuXG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXN0b3JlIGZvY3VzIHRvIHRoZSB0cmlnZ2VyIGJlZm9yZSBjbG9zaW5nLiBFbnN1cmVzIHRoYXQgdGhlIGZvY3VzXG4gICAgICAgIC8vIHBvc2l0aW9uIHdvbid0IGJlIGxvc3QgaWYgdGhlIHVzZXIgZ290IGZvY3VzIGludG8gdGhlIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9wYW5lbE9wZW4gJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLl9zY3JvbGxPcHRpb25JbnRvVmlldyh0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BhbmVsT3BlbiAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIERyb3BzIGN1cnJlbnQgb3B0aW9uIHN1YnNjcmlwdGlvbnMgYW5kIElEcyBhbmQgcmVzZXRzIGZyb20gc2NyYXRjaC4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRPcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWRPckRlc3Ryb3llZCA9IG1lcmdlKHRoaXMub3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95KTtcblxuICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5fb25TZWxlY3QoZXZlbnQuc291cmNlLCBldmVudC5pc1VzZXJJbnB1dCk7XG5cbiAgICAgIGlmIChldmVudC5pc1VzZXJJbnB1dCAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG9wdGlvbnMgYW5kIHJlYWN0IGFjY29yZGluZ2x5LlxuICAgIC8vIEhhbmRsZXMgY2FzZXMgbGlrZSB0aGUgbGFiZWxzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5naW5nLlxuICAgIG1lcmdlKC4uLnRoaXMub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5fc3RhdGVDaGFuZ2VzKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIGBfc3RhdGVDaGFuZ2VzYCBjYW4gZmlyZSBhcyBhIHJlc3VsdCBvZiBhIGNoYW5nZSBpbiB0aGUgbGFiZWwncyBET00gdmFsdWUgd2hpY2ggbWF5XG4gICAgICAgIC8vIGJlIHRoZSByZXN1bHQgb2YgYW4gZXhwcmVzc2lvbiBjaGFuZ2luZy4gV2UgaGF2ZSB0byB1c2UgYGRldGVjdENoYW5nZXNgIGluIG9yZGVyXG4gICAgICAgIC8vIHRvIGF2b2lkIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzIChzZWUgIzE0NzkzKS5cbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBJbnZva2VkIHdoZW4gYW4gb3B0aW9uIGlzIGNsaWNrZWQuICovXG4gIHByaXZhdGUgX29uU2VsZWN0KG9wdGlvbjogTWF0T3B0aW9uLCBpc1VzZXJJbnB1dDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbi52YWx1ZSA9PSBudWxsICYmICF0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMob3B0aW9uLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdhc1NlbGVjdGVkICE9PSBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkXG4gICAgICAgICAgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICAgIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3Qob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG5cbiAgICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgdXNlciBzZWxlY3RlZCB0aGUgb3B0aW9uIHdpdGggdGhlaXIgbW91c2UsIHdlXG4gICAgICAgICAgLy8gd2FudCB0byByZXN0b3JlIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIsIGluIG9yZGVyIHRvXG4gICAgICAgICAgLy8gcHJldmVudCB0aGUgc2VsZWN0IGtleWJvYXJkIGNvbnRyb2xzIGZyb20gY2xhc2hpbmcgd2l0aFxuICAgICAgICAgIC8vIHRoZSBvbmVzIGZyb20gYG1hdC1vcHRpb25gLlxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pKSB7XG4gICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFNvcnRzIHRoZSBzZWxlY3RlZCB2YWx1ZXMgaW4gdGhlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZWlyIG9yZGVyIGluIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc29ydFZhbHVlcygpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy50b0FycmF5KCk7XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydENvbXBhcmF0b3JcbiAgICAgICAgICA/IHRoaXMuc29ydENvbXBhcmF0b3IoYSwgYiwgb3B0aW9ucylcbiAgICAgICAgICA6IG9wdGlvbnMuaW5kZXhPZihhKSAtIG9wdGlvbnMuaW5kZXhPZihiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uW10pLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uKS52YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuX2dldENoYW5nZUV2ZW50KHZhbHVlVG9FbWl0KSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB0aGUgc2VsZWN0ZWQgaXRlbS4gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBpdCB3aWxsIGhpZ2hsaWdodFxuICAgKiB0aGUgZmlyc3QgaXRlbSBpbnN0ZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGFsbG93ZWQgdG8gb3Blbi4gKi9cbiAgcHJvdGVjdGVkIF9jYW5PcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fcGFuZWxPcGVuICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucz8ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgZWxlbWVudC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpO1xuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHRoZSBgYXJpYS1hY3RpdmVkZXNjZW5kYW50YCB0byBiZSBzZXQgb24gdGhlIGhvc3QuICovXG4gIF9nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgdGhpcy5fa2V5TWFuYWdlciAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IG9mIHRoZSBzZWxlY3QgY29tcG9uZW50IHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2dldFRyaWdnZXJBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsSWQgPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQ/LmdldExhYmVsSWQoKTtcbiAgICBsZXQgdmFsdWUgPSAobGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJykgKyB0aGlzLl92YWx1ZUlkO1xuXG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgIHZhbHVlICs9ICcgJyArIHRoaXMuYXJpYUxhYmVsbGVkYnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGlzIGRvbmUgYW5pbWF0aW5nLiAqL1xuICBwcm90ZWN0ZWQgX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KGlzT3Blbik7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGlkcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZHMuam9pbignICcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgdGhpcy5mb2N1cygpO1xuICAgIHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbiB8fCAhdGhpcy5lbXB0eSB8fCAodGhpcy5fZm9jdXNlZCAmJiAhIXRoaXMuX3BsYWNlaG9sZGVyKTtcbiAgfVxufVxuXG4vKipcbiAqIEFsbG93cyB0aGUgdXNlciB0byBjdXN0b21pemUgdGhlIHRyaWdnZXIgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0LXRyaWdnZXInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NFTEVDVF9UUklHR0VSLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0VHJpZ2dlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RUcmlnZ2VyIHt9XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnc2VsZWN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2VsZWN0LmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbm9uZScsXG4gICAgJ2FyaWEtaGFzcG9wdXAnOiAnbGlzdGJveCcsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2VsZWN0JyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncGFuZWxPcGVuID8gaWQgKyBcIi1wYW5lbFwiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ3BhbmVsT3BlbicsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncmVxdWlyZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ19nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtc2VsZWN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXNlbGVjdC1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtc2VsZWN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXNlbGVjdC1lbXB0eV0nOiAnZW1wdHknLFxuICAgICdbY2xhc3MubWF0LW1kYy1zZWxlY3QtbXVsdGlwbGVdJzogJ211bHRpcGxlJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgfSxcbiAgYW5pbWF0aW9uczogW21hdFNlbGVjdEFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWxdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdCBleHRlbmRzIF9NYXRTZWxlY3RCYXNlPE1hdFNlbGVjdENoYW5nZT4gaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG4gIEBDb250ZW50Q2hpbGQoTUFUX1NFTEVDVF9UUklHR0VSKSBjdXN0b21UcmlnZ2VyOiBNYXRTZWxlY3RUcmlnZ2VyO1xuXG4gIF9wb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ3RvcCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAnYm90dG9tJyxcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtbWRjLXNlbGVjdC1wYW5lbC1hYm92ZScsXG4gICAgfSxcbiAgXTtcblxuICAvKiogSWRlYWwgb3JpZ2luIGZvciB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW46IENka092ZXJsYXlPcmlnaW4gfCBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaWR0aCBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgX292ZXJsYXlXaWR0aDogbnVtYmVyO1xuXG4gIG92ZXJyaWRlIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIC8vIFNpbmNlIHRoZSBwYW5lbCBkb2Vzbid0IG92ZXJsYXAgdGhlIHRyaWdnZXIsIHdlXG4gICAgLy8gd2FudCB0aGUgbGFiZWwgdG8gb25seSBmbG9hdCB3aGVuIHRoZXJlJ3MgYSB2YWx1ZS5cbiAgICByZXR1cm4gdGhpcy5wYW5lbE9wZW4gfHwgIXRoaXMuZW1wdHkgfHwgKHRoaXMuZm9jdXNlZCAmJiAhIXRoaXMucGxhY2Vob2xkZXIpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB0aGlzLl92aWV3cG9ydFJ1bGVyXG4gICAgICAuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICB0aGlzLl9vdmVybGF5V2lkdGggPSB0aGlzLl9nZXRPdmVybGF5V2lkdGgoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIE5vdGUgdGhhdCBpdCdzIGltcG9ydGFudCB0aGF0IHdlIHJlYWQgdGhpcyBpbiBgbmdBZnRlclZpZXdJbml0YCwgYmVjYXVzZVxuICAgIC8vIHJlYWRpbmcgaXQgZWFybGllciB3aWxsIGNhdXNlIHRoZSBmb3JtIGZpZWxkIHRvIHJldHVybiBhIGRpZmZlcmVudCBlbGVtZW50LlxuICAgIGlmICh0aGlzLl9wYXJlbnRGb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW4gPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpO1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIG9wZW4oKSB7XG4gICAgdGhpcy5fb3ZlcmxheVdpZHRoID0gdGhpcy5fZ2V0T3ZlcmxheVdpZHRoKCk7XG4gICAgc3VwZXIub3BlbigpO1xuICAgIC8vIFJlcXVpcmVkIGZvciB0aGUgTURDIGZvcm0gZmllbGQgdG8gcGljayB1cCB3aGVuIHRoZSBvdmVybGF5IGhhcyBiZWVuIG9wZW5lZC5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBvdmVycmlkZSBjbG9zZSgpIHtcbiAgICBzdXBlci5jbG9zZSgpO1xuICAgIC8vIFJlcXVpcmVkIGZvciB0aGUgTURDIGZvcm0gZmllbGQgdG8gcGljayB1cCB3aGVuIHRoZSBvdmVybGF5IGhhcyBiZWVuIGNsb3NlZC5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogU2Nyb2xscyB0aGUgYWN0aXZlIG9wdGlvbiBpbnRvIHZpZXcuICovXG4gIHByb3RlY3RlZCBfc2Nyb2xsT3B0aW9uSW50b1ZpZXcoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMub3B0aW9ucy50b0FycmF5KClbaW5kZXhdO1xuXG4gICAgaWYgKG9wdGlvbikge1xuICAgICAgY29uc3QgcGFuZWw6IEhUTUxFbGVtZW50ID0gdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGluZGV4LCB0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uR3JvdXBzKTtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBvcHRpb24uX2dldEhvc3RFbGVtZW50KCk7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBsYWJlbENvdW50ID09PSAxKSB7XG4gICAgICAgIC8vIElmIHdlJ3ZlIGdvdCBvbmUgZ3JvdXAgbGFiZWwgYmVmb3JlIHRoZSBvcHRpb24gYW5kIHdlJ3JlIGF0IHRoZSB0b3Agb3B0aW9uLFxuICAgICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAgIC8vIHRvcCBvZiB0aGUgb3B0aW9uLCBiZWNhdXNlIGl0IGFsbG93cyB0aGUgdXNlciB0byByZWFkIHRoZSB0b3AgZ3JvdXAncyBsYWJlbC5cbiAgICAgICAgcGFuZWwuc2Nyb2xsVG9wID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhbmVsLnNjcm9sbFRvcCA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldFRvcCxcbiAgICAgICAgICBlbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICAgICBwYW5lbC5zY3JvbGxUb3AsXG4gICAgICAgICAgcGFuZWwub2Zmc2V0SGVpZ2h0LFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfcG9zaXRpb25pbmdTZXR0bGVkKCkge1xuICAgIHRoaXMuX3Njcm9sbE9wdGlvbkludG9WaWV3KHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRDaGFuZ2VFdmVudCh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBNYXRTZWxlY3RDaGFuZ2UodGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqIEdldHMgaG93IHdpZGUgdGhlIG92ZXJsYXkgcGFuZWwgc2hvdWxkIGJlLiAqL1xuICBwcml2YXRlIF9nZXRPdmVybGF5V2lkdGgoKSB7XG4gICAgY29uc3QgcmVmVG9NZWFzdXJlID1cbiAgICAgIHRoaXMuX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW4gaW5zdGFuY2VvZiBDZGtPdmVybGF5T3JpZ2luXG4gICAgICAgID8gdGhpcy5fcHJlZmVycmVkT3ZlcmxheU9yaWdpbi5lbGVtZW50UmVmXG4gICAgICAgIDogdGhpcy5fcHJlZmVycmVkT3ZlcmxheU9yaWdpbiB8fCB0aGlzLl9lbGVtZW50UmVmO1xuICAgIHJldHVybiByZWZUb01lYXN1cmUubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgfVxufVxuIiwiPCEtLVxuIE5vdGUgdGhhdCB0aGUgc2VsZWN0IHRyaWdnZXIgZWxlbWVudCBzcGVjaWZpZXMgYGFyaWEtb3duc2AgcG9pbnRpbmcgdG8gdGhlIGxpc3Rib3ggb3ZlcmxheS5cbiBXaGlsZSBhcmlhLW93bnMgaXMgbm90IHJlcXVpcmVkIGZvciB0aGUgQVJJQSAxLjIgYHJvbGU9XCJjb21ib2JveFwiYCBpbnRlcmFjdGlvbiBwYXR0ZXJuLFxuIGl0IGZpeGVzIGFuIGlzc3VlIHdpdGggVm9pY2VPdmVyIHdoZW4gdGhlIHNlbGVjdCBhcHBlYXJzIGluc2lkZSBvZiBhbiBgYXJpYS1tb2RlbD1cInRydWVcImBcbiBlbGVtZW50IChlLmcuIGEgZGlhbG9nKS4gV2l0aG91dCB0aGlzIGBhcmlhLW93bnNgLCB0aGUgYGFyaWEtbW9kYWxgIG9uIGEgZGlhbG9nIHByZXZlbnRzXG4gVm9pY2VPdmVyIGZyb20gXCJzZWVpbmdcIiB0aGUgc2VsZWN0J3MgbGlzdGJveCBvdmVybGF5IGZvciBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQuXG4gVXNpbmcgYGFyaWEtb3duc2AgcmUtcGFyZW50cyB0aGUgc2VsZWN0IG92ZXJsYXkgc28gdGhhdCBpdCB3b3JrcyBhZ2Fpbi5cbiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2OTRcbi0tPlxuPGRpdiBjZGstb3ZlcmxheS1vcmlnaW5cbiAgICAgW2F0dHIuYXJpYS1vd25zXT1cInBhbmVsT3BlbiA/IGlkICsgJy1wYW5lbCcgOiBudWxsXCJcbiAgICAgY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC10cmlnZ2VyXCJcbiAgICAgKGNsaWNrKT1cInRvZ2dsZSgpXCJcbiAgICAgI2ZhbGxiYWNrT3ZlcmxheU9yaWdpbj1cImNka092ZXJsYXlPcmlnaW5cIlxuICAgICAjdHJpZ2dlcj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LXZhbHVlXCIgW25nU3dpdGNoXT1cImVtcHR5XCIgW2F0dHIuaWRdPVwiX3ZhbHVlSWRcIj5cbiAgICA8c3BhbiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LXBsYWNlaG9sZGVyIG1hdC1tZGMtc2VsZWN0LW1pbi1saW5lXCIgKm5nU3dpdGNoQ2FzZT1cInRydWVcIj57e3BsYWNlaG9sZGVyfX08L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC12YWx1ZS10ZXh0XCIgKm5nU3dpdGNoQ2FzZT1cImZhbHNlXCIgW25nU3dpdGNoXT1cIiEhY3VzdG9tVHJpZ2dlclwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC1taW4tbGluZVwiICpuZ1N3aXRjaERlZmF1bHQ+e3t0cmlnZ2VyVmFsdWV9fTwvc3Bhbj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1zZWxlY3QtdHJpZ2dlclwiICpuZ1N3aXRjaENhc2U9XCJ0cnVlXCI+PC9uZy1jb250ZW50PlxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LWFycm93LXdyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWF0LW1kYy1zZWxlY3QtYXJyb3dcIj5cbiAgICAgIDwhLS0gVXNlIGFuIGlubGluZSBTVkcsIGJlY2F1c2UgaXQgd29ya3MgYmV0dGVyIHRoYW4gYSBDU1MgdHJpYW5nbGUgaW4gaGlnaCBjb250cmFzdCBtb2RlLiAtLT5cbiAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMjRweFwiIGhlaWdodD1cIjI0cHhcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICA8cGF0aCBkPVwiTTcgMTBsNSA1IDUtNXpcIi8+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlXG4gIGNkay1jb25uZWN0ZWQtb3ZlcmxheVxuICBjZGtDb25uZWN0ZWRPdmVybGF5TG9ja1Bvc2l0aW9uXG4gIGNka0Nvbm5lY3RlZE92ZXJsYXlIYXNCYWNrZHJvcFxuICBjZGtDb25uZWN0ZWRPdmVybGF5QmFja2Ryb3BDbGFzcz1cImNkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQYW5lbENsYXNzXT1cIl9vdmVybGF5UGFuZWxDbGFzc1wiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5U2Nyb2xsU3RyYXRlZ3ldPVwiX3Njcm9sbFN0cmF0ZWd5XCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcmlnaW5dPVwiX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW4gfHwgZmFsbGJhY2tPdmVybGF5T3JpZ2luXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cInBhbmVsT3BlblwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25zXT1cIl9wb3NpdGlvbnNcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVdpZHRoXT1cIl9vdmVybGF5V2lkdGhcIlxuICAoYmFja2Ryb3BDbGljayk9XCJjbG9zZSgpXCJcbiAgKGF0dGFjaCk9XCJfb25BdHRhY2hlZCgpXCJcbiAgKGRldGFjaCk9XCJjbG9zZSgpXCI+XG4gIDxkaXZcbiAgICAjcGFuZWxcbiAgICByb2xlPVwibGlzdGJveFwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gICAgY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC1wYW5lbCBtZGMtbWVudS1zdXJmYWNlIG1kYy1tZW51LXN1cmZhY2UtLW9wZW4ge3sgX2dldFBhbmVsVGhlbWUoKSB9fVwiXG4gICAgW2F0dHIuaWRdPVwiaWQgKyAnLXBhbmVsJ1wiXG4gICAgW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdPVwibXVsdGlwbGVcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieSgpXCJcbiAgICBbbmdDbGFzc109XCJwYW5lbENsYXNzXCJcbiAgICBbQHRyYW5zZm9ybVBhbmVsXT1cIidzaG93aW5nJ1wiXG4gICAgKEB0cmFuc2Zvcm1QYW5lbC5kb25lKT1cIl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW0ubmV4dCgkZXZlbnQudG9TdGF0ZSlcIlxuICAgIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==