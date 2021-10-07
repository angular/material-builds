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
import { FormGroupDirective, NgControl, NgForm, Validators, } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, ErrorStateMatcher, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, mixinDisabled, mixinDisableRipple, mixinErrorState, mixinTabIndex, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
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
import * as i7 from "@angular/cdk/overlay";
import * as i8 from "@angular/common";
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
MatSelectTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSelectTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatSelectTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSelectTrigger, selector: "mat-select-trigger", providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSelectTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-select-trigger',
                    providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }],
                }]
        }] });
/** Base class with all of the `MatSelect` functionality. */
export class _MatSelectBase extends _MatSelectMixinBase {
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
        if (_defaultOptions?.typeaheadDebounceInterval != null) {
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
    get required() {
        return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
    }
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
        return this.multiple ? (this._selectionModel?.selected || []) :
            this._selectionModel?.selected[0];
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
_MatSelectBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSelectBase, deps: [{ token: i1.ViewportRuler }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.ErrorStateMatcher }, { token: i0.ElementRef }, { token: i3.Directionality, optional: true }, { token: i4.NgForm, optional: true }, { token: i4.FormGroupDirective, optional: true }, { token: MAT_FORM_FIELD, optional: true }, { token: i4.NgControl, optional: true, self: true }, { token: 'tabindex', attribute: true }, { token: MAT_SELECT_SCROLL_STRATEGY }, { token: i5.LiveAnnouncer }, { token: MAT_SELECT_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatSelectBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: _MatSelectBase, inputs: { panelClass: "panelClass", placeholder: "placeholder", required: "required", multiple: "multiple", disableOptionCentering: "disableOptionCentering", compareWith: "compareWith", value: "value", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], errorStateMatcher: "errorStateMatcher", typeaheadDebounceInterval: "typeaheadDebounceInterval", sortComparator: "sortComparator", id: "id" }, outputs: { openedChange: "openedChange", _openedStream: "opened", _closedStream: "closed", selectionChange: "selectionChange", valueChange: "valueChange" }, viewQueries: [{ propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }, { propertyName: "_overlayDir", first: true, predicate: CdkConnectedOverlay, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: _MatSelectBase, decorators: [{
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
                }] }]; }, propDecorators: { trigger: [{
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
        if (index === 0 && labelCount === 1) {
            // If we've got one group label before the option and we're at the top option,
            // scroll the list to the top. This is better UX than scrolling the list to the
            // top of the option, because it allows the user to read the top group's label.
            this.panel.nativeElement.scrollTop = 0;
        }
        else {
            this.panel.nativeElement.scrollTop = _getOptionScrollPosition((index + labelCount) * itemHeight, itemHeight, this.panel.nativeElement.scrollTop, SELECT_PANEL_MAX_HEIGHT);
        }
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
MatSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSelect, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatSelect, selector: "mat-select", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none", "aria-haspopup": "true" }, listeners: { "keydown": "_handleKeydown($event)", "focus": "_onFocus()", "blur": "_onBlur()" }, properties: { "attr.id": "id", "attr.tabindex": "tabIndex", "attr.aria-controls": "panelOpen ? id + \"-panel\" : null", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "attr.aria-describedby": "_ariaDescribedby || null", "attr.aria-activedescendant": "_getAriaActiveDescendant()", "class.mat-select-disabled": "disabled", "class.mat-select-invalid": "errorState", "class.mat-select-required": "required", "class.mat-select-empty": "empty", "class.mat-select-multiple": "multiple" }, classAttribute: "mat-select" }, providers: [
        { provide: MatFormFieldControl, useExisting: MatSelect },
        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect }
    ], queries: [{ propertyName: "customTrigger", first: true, predicate: MAT_SELECT_TRIGGER, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], exportAs: ["matSelect"], usesInheritance: true, ngImport: i0, template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-table;cursor:pointer;position:relative;box-sizing:border-box}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:default}.mat-select-value{display:table-cell;max-width:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{display:table-cell;vertical-align:middle}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:transparent;-webkit-text-fill-color:transparent;transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;opacity:0}\n"], directives: [{ type: i7.CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { type: i8.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { type: i8.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { type: i8.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { type: i7.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { type: i8.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [
        matSelectAnimations.transformPanelWrap,
        matSelectAnimations.transformPanel
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatSelect, decorators: [{
            type: Component,
            args: [{ selector: 'mat-select', exportAs: 'matSelect', inputs: ['disabled', 'disableRipple', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
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
                    }, animations: [
                        matSelectAnimations.transformPanelWrap,
                        matSelectAnimations.transformPanel
                    ], providers: [
                        { provide: MatFormFieldControl, useExisting: MatSelect },
                        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect }
                    ], template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-table;cursor:pointer;position:relative;box-sizing:border-box}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;-moz-user-select:none;user-select:none;cursor:default}.mat-select-value{display:table-cell;max-width:0;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{display:table-cell;vertical-align:middle}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:transparent;-webkit-text-fill-color:transparent;transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;opacity:0}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBRSxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsRUFFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGNBQWMsRUFDZCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsbUJBQW1CLEVBRW5CLE9BQU8sR0FFUixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUlOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULElBQUksRUFFSixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFFTCxrQkFBa0IsRUFDbEIsU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEdBQ1gs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LEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFdBQVcsV0FBVyxFQUFDO3dCQUN0RCxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxXQUFXLFdBQVcsRUFBQztxQkFDL0Q7OEJBc0JnRCxPQUFPO3NCQUF2RCxlQUFlO3VCQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBRUssWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVoQixhQUFhO3NCQUE5QyxZQUFZO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyLCBMaXZlQW5ub3VuY2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBCb29sZWFuSW5wdXQsXG4gIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSxcbiAgY29lcmNlTnVtYmVyUHJvcGVydHksXG4gIE51bWJlcklucHV0XG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1NlbGVjdGlvbk1vZGVsfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQSxcbiAgRE9XTl9BUlJPVyxcbiAgRU5URVIsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ2RrQ29ubmVjdGVkT3ZlcmxheSxcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNlbGYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgTmdDb250cm9sLFxuICBOZ0Zvcm0sXG4gIFZhbGlkYXRvcnMsXG59IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7XG4gIF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG4gIENhbkRpc2FibGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhblVwZGF0ZUVycm9yU3RhdGUsXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBIYXNUYWJJbmRleCxcbiAgTUFUX09QVEdST1VQLFxuICBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsXG4gIE1hdE9wdGdyb3VwLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZSxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpbkVycm9yU3RhdGUsXG4gIG1peGluVGFiSW5kZXgsXG4gIF9NYXRPcHRpb25CYXNlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgYWxpZ25tZW50IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gb3ZlclxuICogdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAqL1xuXG4vKiogVGhlIG1heCBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgPSAyNTY7XG5cbi8qKiBUaGUgcGFuZWwncyBwYWRkaW5nIG9uIHRoZSB4LWF4aXMuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCA9IDE2O1xuXG4vKiogVGhlIHBhbmVsJ3MgeCBheGlzIHBhZGRpbmcgaWYgaXQgaXMgaW5kZW50ZWQgKGUuZy4gdGhlcmUgaXMgYW4gb3B0aW9uIGdyb3VwKS4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWCA9IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuXG4vKiogVGhlIGhlaWdodCBvZiB0aGUgc2VsZWN0IGl0ZW1zIGluIGBlbWAgdW5pdHMuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX0lURU1fSEVJR0hUX0VNID0gMztcblxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogUmV2ZXJ0IHRvIGEgY29uc3RhbnQgYWZ0ZXIgMjAxOCBzcGVjIHVwZGF0ZXMgYXJlIGZ1bGx5IG1lcmdlZC5cbi8qKlxuICogRGlzdGFuY2UgYmV0d2VlbiB0aGUgcGFuZWwgZWRnZSBhbmQgdGhlIG9wdGlvbiB0ZXh0IGluXG4gKiBtdWx0aS1zZWxlY3Rpb24gbW9kZS5cbiAqXG4gKiBDYWxjdWxhdGVkIGFzOlxuICogKFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAxLjUpICsgMTYgPSA0MFxuICogVGhlIHBhZGRpbmcgaXMgbXVsdGlwbGllZCBieSAxLjUgYmVjYXVzZSB0aGUgY2hlY2tib3gncyBtYXJnaW4gaXMgaGFsZiB0aGUgcGFkZGluZy5cbiAqIFRoZSBjaGVja2JveCB3aWR0aCBpcyAxNnB4LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX01VTFRJUExFX1BBTkVMX1BBRERJTkdfWCA9IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAxLjUgKyAxNjtcblxuLyoqXG4gKiBUaGUgc2VsZWN0IHBhbmVsIHdpbGwgb25seSBcImZpdFwiIGluc2lkZSB0aGUgdmlld3BvcnQgaWYgaXQgaXMgcG9zaXRpb25lZCBhdFxuICogdGhpcyB2YWx1ZSBvciBtb3JlIGF3YXkgZnJvbSB0aGUgdmlld3BvcnQgYm91bmRhcnkuXG4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORyA9IDg7XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBkZXRlcm1pbmVzIHRoZSBzY3JvbGwgaGFuZGxpbmcgd2hpbGUgYSBzZWxlY3QgaXMgb3Blbi4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPCgpID0+IFNjcm9sbFN0cmF0ZWd5PignbWF0LXNlbGVjdC1zY3JvbGwtc3RyYXRlZ3knKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKG92ZXJsYXk6IE92ZXJsYXkpOlxuICAgICgpID0+IFNjcm9sbFN0cmF0ZWd5IHtcbiAgcmV0dXJuICgpID0+IG92ZXJsYXkuc2Nyb2xsU3RyYXRlZ2llcy5yZXBvc2l0aW9uKCk7XG59XG5cbi8qKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIHNlbGVjdCBtb2R1bGUuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdFNlbGVjdENvbmZpZyB7XG4gIC8qKiBXaGV0aGVyIG9wdGlvbiBjZW50ZXJpbmcgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nPzogYm9vbGVhbjtcblxuICAvKiogVGltZSB0byB3YWl0IGluIG1pbGxpc2Vjb25kcyBhZnRlciB0aGUgbGFzdCBrZXlzdHJva2UgYmVmb3JlIG1vdmluZyBmb2N1cyB0byBhbiBpdGVtLiAqL1xuICB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsPzogbnVtYmVyO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgbWVudSdzIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgdGhlIHNlbGVjdCBtb2R1bGUuICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0U2VsZWN0Q29uZmlnPignTUFUX1NFTEVDVF9DT05GSUcnKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUiA9IHtcbiAgcHJvdmlkZTogTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1ksXG4gIGRlcHM6IFtPdmVybGF5XSxcbiAgdXNlRmFjdG9yeTogTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWSxcbn07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgdmFsdWUgaGFzIGNoYW5nZWQuICovXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0Q2hhbmdlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgc2VsZWN0IHRoYXQgZW1pdHRlZCB0aGUgY2hhbmdlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdFNlbGVjdCxcbiAgICAvKiogQ3VycmVudCB2YWx1ZSBvZiB0aGUgc2VsZWN0IHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHZhbHVlOiBhbnkpIHsgfVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNlbGVjdC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U2VsZWN0TWl4aW5CYXNlID1cbiAgbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluVGFiSW5kZXgobWl4aW5EaXNhYmxlZChtaXhpbkVycm9yU3RhdGUoY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICAgICAgICAgICAgICBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wpIHt9XG4gIH0pKSkpO1xuXG5cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKipcbiAqIEFsbG93cyB0aGUgdXNlciB0byBjdXN0b21pemUgdGhlIHRyaWdnZXIgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0LXRyaWdnZXInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NFTEVDVF9UUklHR0VSLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0VHJpZ2dlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RUcmlnZ2VyIHt9XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0U2VsZWN0YCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFNlbGVjdEJhc2U8Qz4gZXh0ZW5kcyBfTWF0U2VsZWN0TWl4aW5CYXNlIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgQ2FuRGlzYWJsZSwgSGFzVGFiSW5kZXgsXG4gICAgTWF0Rm9ybUZpZWxkQ29udHJvbDxhbnk+LCBDYW5VcGRhdGVFcnJvclN0YXRlLCBDYW5EaXNhYmxlUmlwcGxlIHtcblxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIHNlbGVjdCBvcHRpb25zLiAqL1xuICBhYnN0cmFjdCBvcHRpb25zOiBRdWVyeUxpc3Q8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIGlzIG9ubHkgbmVjZXNzYXJ5IGZvciB0aGUgbm9uLU1EQyBzZWxlY3QsIGJ1dCBpdCdzIHRlY2huaWNhbGx5IGFcbiAgLy8gcHVibGljIEFQSSBzbyB3ZSBoYXZlIHRvIGtlZXAgaXQuIEl0IHNob3VsZCBiZSBkZXByZWNhdGVkIGFuZCByZW1vdmVkIGV2ZW50dWFsbHkuXG4gIC8qKiBBbGwgb2YgdGhlIGRlZmluZWQgZ3JvdXBzIG9mIG9wdGlvbnMuICovXG4gIGFic3RyYWN0IG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogVXNlci1zdXBwbGllZCBvdmVycmlkZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBhYnN0cmFjdCBjdXN0b21UcmlnZ2VyOiB7fTtcblxuICAvKipcbiAgICogVGhpcyBwb3NpdGlvbiBjb25maWcgZW5zdXJlcyB0aGF0IHRoZSB0b3AgXCJzdGFydFwiIGNvcm5lciBvZiB0aGUgb3ZlcmxheVxuICAgKiBpcyBhbGlnbmVkIHdpdGggd2l0aCB0aGUgdG9wIFwic3RhcnRcIiBvZiB0aGUgb3JpZ2luIGJ5IGRlZmF1bHQgKG92ZXJsYXBwaW5nXG4gICAqIHRoZSB0cmlnZ2VyIGNvbXBsZXRlbHkpLiBJZiB0aGUgcGFuZWwgY2Fubm90IGZpdCBiZWxvdyB0aGUgdHJpZ2dlciwgaXRcbiAgICogd2lsbCBmYWxsIGJhY2sgdG8gYSBwb3NpdGlvbiBhYm92ZSB0aGUgdHJpZ2dlci5cbiAgICovXG4gIGFic3RyYWN0IF9wb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW107XG5cbiAgLyoqIFNjcm9sbHMgYSBwYXJ0aWN1bGFyIG9wdGlvbiBpbnRvIHRoZSB2aWV3LiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3Njcm9sbE9wdGlvbkludG9WaWV3KGluZGV4OiBudW1iZXIpOiB2b2lkO1xuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgcGFuZWwgaGFzIGJlZW4gb3BlbmVkIGFuZCB0aGUgb3ZlcmxheSBoYXMgc2V0dGxlZCBvbiBpdHMgZmluYWwgcG9zaXRpb24uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfcG9zaXRpb25pbmdTZXR0bGVkKCk6IHZvaWQ7XG5cbiAgLyoqIENyZWF0ZXMgYSBjaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGVtaXR0ZWQgYnkgdGhlIHNlbGVjdC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9nZXRDaGFuZ2VFdmVudCh2YWx1ZTogYW55KTogQztcblxuICAvKiogRmFjdG9yeSBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhIHNjcm9sbCBzdHJhdGVneSBmb3IgdGhpcyBzZWxlY3QuICovXG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIHByaXZhdGUgX3BhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIC8qKiBDb21wYXJpc29uIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggb3B0aW9uIGlzIGRpc3BsYXllZC4gRGVmYXVsdHMgdG8gb2JqZWN0IGVxdWFsaXR5LiAqL1xuICBwcml2YXRlIF9jb21wYXJlV2l0aCA9IChvMTogYW55LCBvMjogYW55KSA9PiBvMSA9PT0gbzI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfdWlkID0gYG1hdC1zZWxlY3QtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBDdXJyZW50IGBhcmlhci1sYWJlbGxlZGJ5YCB2YWx1ZSBmb3IgdGhlIHNlbGVjdCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyQXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogVGhlIGFyaWEtZGVzY3JpYmVkYnkgYXR0cmlidXRlIG9uIHRoZSBzZWxlY3QgZm9yIGltcHJvdmVkIGExMXkuICovXG4gIF9hcmlhRGVzY3JpYmVkYnk6IHN0cmluZztcblxuICAvKiogRGVhbHMgd2l0aCB0aGUgc2VsZWN0aW9uIGxvZ2ljLiAqL1xuICBfc2VsZWN0aW9uTW9kZWw6IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj47XG5cbiAgLyoqIE1hbmFnZXMga2V5Ym9hcmQgZXZlbnRzIGZvciBvcHRpb25zIGluIHRoZSBwYW5lbC4gKi9cbiAgX2tleU1hbmFnZXI6IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPE1hdE9wdGlvbj47XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHZhbHVlIGNoYW5nZXNgICovXG4gIF9vbkNoYW5nZTogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gc2VsZWN0IGhhcyBiZWVuIHRvdWNoZWRgICovXG4gIF9vblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogSUQgZm9yIHRoZSBET00gbm9kZSBjb250YWluaW5nIHRoZSBzZWxlY3QncyB2YWx1ZS4gKi9cbiAgX3ZhbHVlSWQgPSBgbWF0LXNlbGVjdC12YWx1ZS0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHBhbmVsIGVsZW1lbnQgaXMgZmluaXNoZWQgdHJhbnNmb3JtaW5nIGluLiAqL1xuICByZWFkb25seSBfcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuXG4gIC8qKiBTdHJhdGVneSB0aGF0IHdpbGwgYmUgdXNlZCB0byBoYW5kbGUgc2Nyb2xsaW5nIHdoaWxlIHRoZSBzZWxlY3QgcGFuZWwgaXMgb3Blbi4gKi9cbiAgX3Njcm9sbFN0cmF0ZWd5OiBTY3JvbGxTdHJhdGVneTtcblxuICBfb3ZlcmxheVBhbmVsQ2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/Lm92ZXJsYXlQYW5lbENsYXNzIHx8ICcnO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWQgfHwgdGhpcy5fcGFuZWxPcGVuO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogQSBuYW1lIGZvciB0aGlzIGNvbnRyb2wgdGhhdCBjYW4gYmUgdXNlZCBieSBgbWF0LWZvcm0tZmllbGRgLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtc2VsZWN0JztcblxuICAvKiogVHJpZ2dlciB0aGF0IG9wZW5zIHRoZSBzZWxlY3QuICovXG4gIEBWaWV3Q2hpbGQoJ3RyaWdnZXInKSB0cmlnZ2VyOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBQYW5lbCBjb250YWluaW5nIHRoZSBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKiogT3ZlcmxheSBwYW5lIGNvbnRhaW5pbmcgdGhlIG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ29ubmVjdGVkT3ZlcmxheSlcbiAgcHJvdGVjdGVkIF9vdmVybGF5RGlyOiBDZGtDb25uZWN0ZWRPdmVybGF5O1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgc2VsZWN0IHBhbmVsLiBTdXBwb3J0cyB0aGUgc2FtZSBzeW50YXggYXMgYG5nQ2xhc3NgLiAqL1xuICBASW5wdXQoKSBwYW5lbENsYXNzOiBzdHJpbmd8c3RyaW5nW118U2V0PHN0cmluZz58e1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgLyoqIFBsYWNlaG9sZGVyIHRvIGJlIHNob3duIGlmIG5vIHZhbHVlIGhhcyBiZWVuIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyOyB9XG4gIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkID8/IHRoaXMubmdDb250cm9sPy5jb250cm9sPy5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkgPz8gZmFsc2U7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBzaG91bGQgYmUgYWxsb3dlZCB0byBzZWxlY3QgbXVsdGlwbGUgb3B0aW9ucy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IG11bHRpcGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbXVsdGlwbGU7IH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9tdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGNlbnRlciB0aGUgYWN0aXZlIG9wdGlvbiBvdmVyIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc7IH1cbiAgc2V0IGRpc2FibGVPcHRpb25DZW50ZXJpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/LmRpc2FibGVPcHRpb25DZW50ZXJpbmcgPz8gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgdGhlIG9wdGlvbiB2YWx1ZXMgd2l0aCB0aGUgc2VsZWN0ZWQgdmFsdWVzLiBUaGUgZmlyc3QgYXJndW1lbnRcbiAgICogaXMgYSB2YWx1ZSBmcm9tIGFuIG9wdGlvbi4gVGhlIHNlY29uZCBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGlvbi4gQSBib29sZWFuXG4gICAqIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHsgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoOyB9XG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcbiAgICAgIC8vIEEgZGlmZmVyZW50IGNvbXBhcmF0b3IgbWVhbnMgdGhlIHNlbGVjdGlvbiBjb3VsZCBjaGFuZ2UuXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzZWxlY3QgY29udHJvbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIC8vIEFsd2F5cyByZS1hc3NpZ24gYW4gYXJyYXksIGJlY2F1c2UgaXQgbWlnaHQgaGF2ZSBiZWVuIG11dGF0ZWQuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl92YWx1ZSB8fCAodGhpcy5fbXVsdGlwbGUgJiYgQXJyYXkuaXNBcnJheShuZXdWYWx1ZSkpKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUobmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZTogYW55O1xuXG4gIC8qKiBBcmlhIGxhYmVsIG9mIHRoZSBzZWxlY3QuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIElucHV0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIE9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpIG92ZXJyaWRlIGVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcjtcblxuICAvKiogVGltZSB0byB3YWl0IGluIG1pbGxpc2Vjb25kcyBhZnRlciB0aGUgbGFzdCBrZXlzdHJva2UgYmVmb3JlIG1vdmluZyBmb2N1cyB0byBhbiBpdGVtLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDsgfVxuICBzZXQgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gc29ydCB0aGUgdmFsdWVzIGluIGEgc2VsZWN0IGluIG11bHRpcGxlIG1vZGUuXG4gICAqIEZvbGxvd3MgdGhlIHNhbWUgbG9naWMgYXMgYEFycmF5LnByb3RvdHlwZS5zb3J0YC5cbiAgICovXG4gIEBJbnB1dCgpIHNvcnRDb21wYXJhdG9yOiAoYTogTWF0T3B0aW9uLCBiOiBNYXRPcHRpb24sIG9wdGlvbnM6IE1hdE9wdGlvbltdKSA9PiBudW1iZXI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBvZiB0aGUgZWxlbWVudC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9pZDsgfVxuICBzZXQgaWQodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2lkID0gdmFsdWUgfHwgdGhpcy5fdWlkO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9pZDogc3RyaW5nO1xuXG4gIC8qKiBDb21iaW5lZCBzdHJlYW0gb2YgYWxsIG9mIHRoZSBjaGlsZCBvcHRpb25zJyBjaGFuZ2UgZXZlbnRzLiAqL1xuICByZWFkb25seSBvcHRpb25TZWxlY3Rpb25DaGFuZ2VzOiBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT4gPSBkZWZlcigoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICByZXR1cm4gb3B0aW9ucy5jaGFuZ2VzLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aChvcHRpb25zKSxcbiAgICAgICAgc3dpdGNoTWFwKCgpID0+IG1lcmdlKC4uLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24ub25TZWxlY3Rpb25DaGFuZ2UpKSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX25nWm9uZS5vblN0YWJsZVxuICAgICAgLnBpcGUodGFrZSgxKSwgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcykpO1xuICB9KSBhcyBPYnNlcnZhYmxlPE1hdE9wdGlvblNlbGVjdGlvbkNoYW5nZT47XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IHBhbmVsIGhhcyBiZWVuIHRvZ2dsZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcGVuZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGJlZW4gb3BlbmVkLiAqL1xuICBAT3V0cHV0KCdvcGVuZWQnKSByZWFkb25seSBfb3BlbmVkU3RyZWFtOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoZmlsdGVyKG8gPT4gbyksIG1hcCgoKSA9PiB7fSkpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBjbG9zZWQuICovXG4gIEBPdXRwdXQoJ2Nsb3NlZCcpIHJlYWRvbmx5IF9jbG9zZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiAhbyksIG1hcCgoKSA9PiB7fSkpO1xuXG4gICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkIGJ5IHRoZSB1c2VyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Qz4gPSBuZXcgRXZlbnRFbWl0dGVyPEM+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2VsZWN0IGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX25nWm9uZTogTmdab25lLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcm90ZWN0ZWQgX3BhcmVudEZvcm1GaWVsZDogTWF0Rm9ybUZpZWxkLFxuICAgIEBTZWxmKCkgQE9wdGlvbmFsKCkgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTogYW55LFxuICAgIHByaXZhdGUgX2xpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfU0VMRUNUX0NPTkZJRykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTZWxlY3RDb25maWcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSxcbiAgICAgICAgICBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBOb3RlOiB3ZSBwcm92aWRlIHRoZSB2YWx1ZSBhY2Nlc3NvciB0aHJvdWdoIGhlcmUsIGluc3RlYWQgb2ZcbiAgICAgIC8vIHRoZSBgcHJvdmlkZXJzYCB0byBhdm9pZCBydW5uaW5nIGludG8gYSBjaXJjdWxhciBpbXBvcnQuXG4gICAgICB0aGlzLm5nQ29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIHNldCB0aGlzIHdoZW4gdGhlIGRlZmF1bHRzIHBhc3MgaXQgaW4sIG90aGVyd2lzZSBpdCBzaG91bGRcbiAgICAvLyBzdGF5IGFzIGB1bmRlZmluZWRgIHNvIHRoYXQgaXQgZmFsbHMgYmFjayB0byB0aGUgZGVmYXVsdCBpbiB0aGUga2V5IG1hbmFnZXIuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucz8udHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gX2RlZmF1bHRPcHRpb25zLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5ID0gc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5O1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5KCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPih0aGlzLm11bHRpcGxlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG5cbiAgICAvLyBXZSBuZWVkIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaGVyZSwgYmVjYXVzZSBzb21lIGJyb3dzZXJzIHdpbGxcbiAgICAvLyBmaXJlIHRoZSBhbmltYXRpb24gZW5kIGV2ZW50IHR3aWNlIGZvciB0aGUgc2FtZSBhbmltYXRpb24uIFNlZTpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbVxuICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmcodGhpcy5wYW5lbE9wZW4pKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0S2V5TWFuYWdlcigpO1xuXG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2hhbmdlZC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmFkZGVkLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5zZWxlY3QoKSk7XG4gICAgICBldmVudC5yZW1vdmVkLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5kZXNlbGVjdCgpKTtcbiAgICB9KTtcblxuICAgIHRoaXMub3B0aW9ucy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldE9wdGlvbnMoKTtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZWxlY3Rpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBjb25zdCBuZXdBcmlhTGFiZWxsZWRieSA9IHRoaXMuX2dldFRyaWdnZXJBcmlhTGFiZWxsZWRieSgpO1xuXG4gICAgLy8gV2UgaGF2ZSB0byBtYW5hZ2Ugc2V0dGluZyB0aGUgYGFyaWEtbGFiZWxsZWRieWAgb3Vyc2VsdmVzLCBiZWNhdXNlIHBhcnQgb2YgaXRzIHZhbHVlXG4gICAgLy8gaXMgY29tcHV0ZWQgYXMgYSByZXN1bHQgb2YgYSBjb250ZW50IHF1ZXJ5IHdoaWNoIGNhbiBjYXVzZSB0aGlzIGJpbmRpbmcgdG8gdHJpZ2dlciBhXG4gICAgLy8gXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvci5cbiAgICBpZiAobmV3QXJpYUxhYmVsbGVkYnkgIT09IHRoaXMuX3RyaWdnZXJBcmlhTGFiZWxsZWRCeSkge1xuICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLl90cmlnZ2VyQXJpYUxhYmVsbGVkQnkgPSBuZXdBcmlhTGFiZWxsZWRieTtcbiAgICAgIGlmIChuZXdBcmlhTGFiZWxsZWRieSkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgbmV3QXJpYUxhYmVsbGVkYnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgdGhpcy51cGRhdGVFcnJvclN0YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIFVwZGF0aW5nIHRoZSBkaXNhYmxlZCBzdGF0ZSBpcyBoYW5kbGVkIGJ5IGBtaXhpbkRpc2FibGVkYCwgYnV0IHdlIG5lZWQgdG8gYWRkaXRpb25hbGx5IGxldFxuICAgIC8vIHRoZSBwYXJlbnQgZm9ybSBmaWVsZCBrbm93IHRvIHJ1biBjaGFuZ2UgZGV0ZWN0aW9uIHdoZW4gdGhlIGRpc2FibGVkIHN0YXRlIGNoYW5nZXMuXG4gICAgaWYgKGNoYW5nZXNbJ2Rpc2FibGVkJ10pIHtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sndHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCddICYmIHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBvdmVybGF5IHBhbmVsIG9wZW4gb3IgY2xvc2VkLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5wYW5lbE9wZW4gPyB0aGlzLmNsb3NlKCkgOiB0aGlzLm9wZW4oKTtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICB0aGlzLl9wYW5lbE9wZW4gPSB0cnVlO1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKG51bGwpO1xuICAgICAgdGhpcy5faGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgb3ZlcmxheSBwYW5lbCBhbmQgZm9jdXNlcyB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9wYW5lbE9wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9pc1J0bCgpID8gJ3J0bCcgOiAnbHRyJyk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3QncyB2YWx1ZS4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0J3MgdmFsdWVcbiAgICogY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0IGlzIGJsdXJyZWRcbiAgICogYnkgdGhlIHVzZXIuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHRvdWNoZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgc2VsZWN0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3ZlcmxheSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW47XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb24uICovXG4gIGdldCBzZWxlY3RlZCgpOiBNYXRPcHRpb24gfCBNYXRPcHRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyAodGhpcy5fc2VsZWN0aW9uTW9kZWw/LnNlbGVjdGVkIHx8IFtdKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWw/LnNlbGVjdGVkWzBdO1xuICB9XG5cbiAgLyoqIFRoZSB2YWx1ZSBkaXNwbGF5ZWQgaW4gdGhlIHRyaWdnZXIuICovXG4gIGdldCB0cmlnZ2VyVmFsdWUoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5lbXB0eSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQubWFwKG9wdGlvbiA9PiBvcHRpb24udmlld1ZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMuX2lzUnRsKCkpIHtcbiAgICAgICAgc2VsZWN0ZWRPcHRpb25zLnJldmVyc2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gVE9ETyhjcmlzYmV0byk6IGRlbGltaXRlciBzaG91bGQgYmUgY29uZmlndXJhYmxlIGZvciBwcm9wZXIgbG9jYWxpemF0aW9uLlxuICAgICAgcmV0dXJuIHNlbGVjdGVkT3B0aW9ucy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXS52aWV3VmFsdWU7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBpcyBpbiBSVEwgbW9kZS4gKi9cbiAgX2lzUnRsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnIDogZmFsc2U7XG4gIH1cblxuICAvKiogSGFuZGxlcyBhbGwga2V5ZG93biBldmVudHMgb24gdGhlIHNlbGVjdC4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMucGFuZWxPcGVuID8gdGhpcy5faGFuZGxlT3BlbktleWRvd24oZXZlbnQpIDogdGhpcy5faGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIHdoaWxlIHRoZSBzZWxlY3QgaXMgY2xvc2VkLiAqL1xuICBwcml2YXRlIF9oYW5kbGVDbG9zZWRLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG4gICAgY29uc3QgaXNBcnJvd0tleSA9IGtleUNvZGUgPT09IERPV05fQVJST1cgfHwga2V5Q29kZSA9PT0gVVBfQVJST1cgfHxcbiAgICAgICAgICAgICAgICAgICAgICAga2V5Q29kZSA9PT0gTEVGVF9BUlJPVyB8fCBrZXlDb2RlID09PSBSSUdIVF9BUlJPVztcbiAgICBjb25zdCBpc09wZW5LZXkgPSBrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRTtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcblxuICAgIC8vIE9wZW4gdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgIGlmICghbWFuYWdlci5pc1R5cGluZygpICYmIChpc09wZW5LZXkgJiYgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkgfHxcbiAgICAgICgodGhpcy5tdWx0aXBsZSB8fCBldmVudC5hbHRLZXkpICYmIGlzQXJyb3dLZXkpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50cyB0aGUgcGFnZSBmcm9tIHNjcm9sbGluZyBkb3duIHdoZW4gcHJlc3Npbmcgc3BhY2VcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMubXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG5cbiAgICAgIC8vIFNpbmNlIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZCwgd2UgbmVlZCB0byBhbm5vdW5jZSBpdCBvdXJzZWx2ZXMuXG4gICAgICBpZiAoc2VsZWN0ZWRPcHRpb24gJiYgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uICE9PSBzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAvLyBXZSBzZXQgYSBkdXJhdGlvbiBvbiB0aGUgbGl2ZSBhbm5vdW5jZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgbGl2ZSBlbGVtZW50IHRvIGJlXG4gICAgICAgIC8vIGNsZWFyZWQgYWZ0ZXIgYSB3aGlsZSBzbyB0aGF0IHVzZXJzIGNhbid0IG5hdmlnYXRlIHRvIGl0IHVzaW5nIHRoZSBhcnJvdyBrZXlzLlxuICAgICAgICB0aGlzLl9saXZlQW5ub3VuY2VyLmFubm91bmNlKChzZWxlY3RlZE9wdGlvbiBhcyBNYXRPcHRpb24pLnZpZXdWYWx1ZSwgMTAwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGVuIHRoZSBzZWxlY3RlZCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9oYW5kbGVPcGVuS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8IGtleUNvZGUgPT09IFVQX0FSUk9XO1xuICAgIGNvbnN0IGlzVHlwaW5nID0gbWFuYWdlci5pc1R5cGluZygpO1xuXG4gICAgaWYgKGlzQXJyb3dLZXkgJiYgZXZlbnQuYWx0S2V5KSB7XG4gICAgICAvLyBDbG9zZSB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaW4gdGhpcyBjYXNlIGlmIHRoZSB1c2VyIGlzIHR5cGluZyxcbiAgICAgIC8vIGJlY2F1c2UgdGhlIHR5cGluZyBzZXF1ZW5jZSBjYW4gaW5jbHVkZSB0aGUgc3BhY2Uga2V5LlxuICAgIH0gZWxzZSBpZiAoIWlzVHlwaW5nICYmIChrZXlDb2RlID09PSBFTlRFUiB8fCBrZXlDb2RlID09PSBTUEFDRSkgJiYgbWFuYWdlci5hY3RpdmVJdGVtICYmXG4gICAgICAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgIH0gZWxzZSBpZiAoIWlzVHlwaW5nICYmIHRoaXMuX211bHRpcGxlICYmIGtleUNvZGUgPT09IEEgJiYgZXZlbnQuY3RybEtleSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IGhhc0Rlc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5vcHRpb25zLnNvbWUob3B0ID0+ICFvcHQuZGlzYWJsZWQgJiYgIW9wdC5zZWxlY3RlZCk7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgIGlmICghb3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgaGFzRGVzZWxlY3RlZE9wdGlvbnMgPyBvcHRpb24uc2VsZWN0KCkgOiBvcHRpb24uZGVzZWxlY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzbHlGb2N1c2VkSW5kZXggPSBtYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleDtcblxuICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuXG4gICAgICBpZiAodGhpcy5fbXVsdGlwbGUgJiYgaXNBcnJvd0tleSAmJiBldmVudC5zaGlmdEtleSAmJiBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCAhPT0gcHJldmlvdXNseUZvY3VzZWRJbmRleCkge1xuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9mb2N1c2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIHRvdWNoZWQgY2FsbGJhY2sgb25seSBpZiB0aGUgcGFuZWwgaXMgY2xvc2VkLiBPdGhlcndpc2UsIHRoZSB0cmlnZ2VyIHdpbGxcbiAgICogXCJibHVyXCIgdG8gdGhlIHBhbmVsIHdoZW4gaXQgb3BlbnMsIGNhdXNpbmcgYSBmYWxzZSBwb3NpdGl2ZS5cbiAgICovXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5fZm9jdXNlZCA9IGZhbHNlO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIG92ZXJsYXkgcGFuZWwgaGFzIGJlZW4gYXR0YWNoZWQuXG4gICAqL1xuICBfb25BdHRhY2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vdmVybGF5RGlyLnBvc2l0aW9uQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nU2V0dGxlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRoZW1lIHRvIGJlIHVzZWQgb24gdGhlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxUaGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGb3JtRmllbGQgPyBgbWF0LSR7dGhpcy5fcGFyZW50Rm9ybUZpZWxkLmNvbG9yfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3NlbGVjdGlvbk1vZGVsIHx8IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgIC8vIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzIGZyb20gQW5ndWxhci5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC52YWx1ZSA6IHRoaXMuX3ZhbHVlKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb24gYmFzZWQgb24gYSB2YWx1ZS4gSWYgbm8gb3B0aW9uIGNhbiBiZVxuICAgKiBmb3VuZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHZhbHVlLCB0aGUgc2VsZWN0IHRyaWdnZXIgaXMgY2xlYXJlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLnNldEluYWN0aXZlU3R5bGVzKCkpO1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25BcnJheVZhbHVlRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdFZhbHVlKGN1cnJlbnRWYWx1ZSkpO1xuICAgICAgdGhpcy5fc29ydFZhbHVlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUpO1xuXG4gICAgICAvLyBTaGlmdCBmb2N1cyB0byB0aGUgYWN0aXZlIGl0ZW0uIE5vdGUgdGhhdCB3ZSBzaG91bGRuJ3QgZG8gdGhpcyBpbiBtdWx0aXBsZVxuICAgICAgLy8gbW9kZSwgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoYXQgb3B0aW9uIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCBsYXN0LlxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGNvcnJlc3BvbmRpbmdPcHRpb24pO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJlc2V0IHRoZSBoaWdobGlnaHRlZCBvcHRpb24uIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyB3aGlsZVxuICAgICAgICAvLyBjbG9zZWQsIGJlY2F1c2UgZG9pbmcgaXQgd2hpbGUgb3BlbiBjYW4gc2hpZnQgdGhlIHVzZXIncyBmb2N1cyB1bm5lY2Vzc2FyaWx5LlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBzZWxlY3RzIGFuZCBvcHRpb24gYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBPcHRpb24gdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KTogTWF0T3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQoKG9wdGlvbjogTWF0T3B0aW9uKSA9PiB7XG4gICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgLy8gd2hlcmUgdGhlIHNhbWUgcHJpbWl0aXZlIHZhbHVlIGlzIHNlbGVjdGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRyZWF0IG51bGwgYXMgYSBzcGVjaWFsIHJlc2V0IHZhbHVlLlxuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlICE9IG51bGwgJiYgdGhpcy5fY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCAgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgIC8vIE5vdGlmeSBkZXZlbG9wZXJzIG9mIGVycm9ycyBpbiB0aGVpciBjb21wYXJhdG9yLlxuICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ09wdGlvbjtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIGEga2V5IG1hbmFnZXIgdG8gbGlzdGVuIHRvIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfaW5pdEtleU1hbmFnZXIoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoVHlwZUFoZWFkKHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpXG4gICAgICAud2l0aFZlcnRpY2FsT3JpZW50YXRpb24oKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5faXNSdGwoKSA/ICdydGwnIDogJ2x0cicpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAvLyBTZWxlY3QgdGhlIGFjdGl2ZSBpdGVtIHdoZW4gdGFiYmluZyBhd2F5LiBUaGlzIGlzIGNvbnNpc3RlbnQgd2l0aCBob3cgdGhlIG5hdGl2ZVxuICAgICAgICAvLyBzZWxlY3QgYmVoYXZlcy4gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBkbyB0aGlzIGluIHNpbmdsZSBzZWxlY3Rpb24gbW9kZS5cbiAgICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc3RvcmUgZm9jdXMgdG8gdGhlIHRyaWdnZXIgYmVmb3JlIGNsb3NpbmcuIEVuc3VyZXMgdGhhdCB0aGUgZm9jdXNcbiAgICAgICAgLy8gcG9zaXRpb24gd29uJ3QgYmUgbG9zdCBpZiB0aGUgdXNlciBnb3QgZm9jdXMgaW50byB0aGUgb3ZlcmxheS5cbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9wYW5lbE9wZW4gJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLl9zY3JvbGxPcHRpb25JbnRvVmlldyh0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BhbmVsT3BlbiAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIERyb3BzIGN1cnJlbnQgb3B0aW9uIHN1YnNjcmlwdGlvbnMgYW5kIElEcyBhbmQgcmVzZXRzIGZyb20gc2NyYXRjaC4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRPcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWRPckRlc3Ryb3llZCA9IG1lcmdlKHRoaXMub3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95KTtcblxuICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5fb25TZWxlY3QoZXZlbnQuc291cmNlLCBldmVudC5pc1VzZXJJbnB1dCk7XG5cbiAgICAgIGlmIChldmVudC5pc1VzZXJJbnB1dCAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG9wdGlvbnMgYW5kIHJlYWN0IGFjY29yZGluZ2x5LlxuICAgIC8vIEhhbmRsZXMgY2FzZXMgbGlrZSB0aGUgbGFiZWxzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5naW5nLlxuICAgIG1lcmdlKC4uLnRoaXMub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5fc3RhdGVDaGFuZ2VzKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBJbnZva2VkIHdoZW4gYW4gb3B0aW9uIGlzIGNsaWNrZWQuICovXG4gIHByaXZhdGUgX29uU2VsZWN0KG9wdGlvbjogTWF0T3B0aW9uLCBpc1VzZXJJbnB1dDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbi52YWx1ZSA9PSBudWxsICYmICF0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMob3B0aW9uLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdhc1NlbGVjdGVkICE9PSBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID8gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KG9wdGlvbikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5kZXNlbGVjdChvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKG9wdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuX3NvcnRWYWx1ZXMoKTtcblxuICAgICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSB1c2VyIHNlbGVjdGVkIHRoZSBvcHRpb24gd2l0aCB0aGVpciBtb3VzZSwgd2VcbiAgICAgICAgICAvLyB3YW50IHRvIHJlc3RvcmUgZm9jdXMgYmFjayB0byB0aGUgdHJpZ2dlciwgaW4gb3JkZXIgdG9cbiAgICAgICAgICAvLyBwcmV2ZW50IHRoZSBzZWxlY3Qga2V5Ym9hcmQgY29udHJvbHMgZnJvbSBjbGFzaGluZyB3aXRoXG4gICAgICAgICAgLy8gdGhlIG9uZXMgZnJvbSBgbWF0LW9wdGlvbmAuXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdhc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKG9wdGlvbikpIHtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogU29ydHMgdGhlIHNlbGVjdGVkIHZhbHVlcyBpbiB0aGUgc2VsZWN0ZWQgYmFzZWQgb24gdGhlaXIgb3JkZXIgaW4gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9zb3J0VmFsdWVzKCkge1xuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKTtcblxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0Q29tcGFyYXRvciA/IHRoaXMuc29ydENvbXBhcmF0b3IoYSwgYiwgb3B0aW9ucykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW5kZXhPZihhKSAtIG9wdGlvbnMuaW5kZXhPZihiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uW10pLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uKS52YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuX2dldENoYW5nZUV2ZW50KHZhbHVlVG9FbWl0KSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB0aGUgc2VsZWN0ZWQgaXRlbS4gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBpdCB3aWxsIGhpZ2hsaWdodFxuICAgKiB0aGUgZmlyc3QgaXRlbSBpbnN0ZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGFsbG93ZWQgdG8gb3Blbi4gKi9cbiAgcHJvdGVjdGVkIF9jYW5PcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fcGFuZWxPcGVuICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucz8ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgZWxlbWVudC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpO1xuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IChsYWJlbElkID8gbGFiZWxJZCArICcgJyA6ICcnKTtcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxsZWRieSA/IGxhYmVsRXhwcmVzc2lvbiArIHRoaXMuYXJpYUxhYmVsbGVkYnkgOiBsYWJlbElkO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgdGhlIGBhcmlhLWFjdGl2ZWRlc2NlbmRhbnRgIHRvIGJlIHNldCBvbiB0aGUgaG9zdC4gKi9cbiAgX2dldEFyaWFBY3RpdmVEZXNjZW5kYW50KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLnBhbmVsT3BlbiAmJiB0aGlzLl9rZXlNYW5hZ2VyICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5pZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgb2YgdGhlIHNlbGVjdCBjb21wb25lbnQgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfZ2V0VHJpZ2dlckFyaWFMYWJlbGxlZGJ5KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpO1xuICAgIGxldCB2YWx1ZSA9IChsYWJlbElkID8gbGFiZWxJZCArICcgJyA6ICcnKSArIHRoaXMuX3ZhbHVlSWQ7XG5cbiAgICBpZiAodGhpcy5hcmlhTGFiZWxsZWRieSkge1xuICAgICAgdmFsdWUgKz0gJyAnICsgdGhpcy5hcmlhTGFiZWxsZWRieTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIG92ZXJsYXkgcGFuZWwgaXMgZG9uZSBhbmltYXRpbmcuICovXG4gIHByb3RlY3RlZCBfcGFuZWxEb25lQW5pbWF0aW5nKGlzT3BlbjogYm9vbGVhbikge1xuICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQoaXNPcGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHNldERlc2NyaWJlZEJ5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVkYnkgPSBpZHMuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgb25Db250YWluZXJDbGljaygpIHtcbiAgICB0aGlzLmZvY3VzKCk7XG4gICAgdGhpcy5vcGVuKCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgc2hvdWxkTGFiZWxGbG9hdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxPcGVuIHx8ICF0aGlzLmVtcHR5IHx8ICh0aGlzLl9mb2N1c2VkICYmICEhdGhpcy5fcGxhY2Vob2xkZXIpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JlcXVpcmVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tdWx0aXBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZU9wdGlvbkNlbnRlcmluZzogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfdGFiSW5kZXg6IE51bWJlcklucHV0O1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0JyxcbiAgZXhwb3J0QXM6ICdtYXRTZWxlY3QnLFxuICB0ZW1wbGF0ZVVybDogJ3NlbGVjdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3NlbGVjdC5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdjb21ib2JveCcsXG4gICAgJ2FyaWEtYXV0b2NvbXBsZXRlJzogJ25vbmUnLFxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGUgdmFsdWUgZm9yIGFyaWEtaGFzcG9wdXAgc2hvdWxkIGJlIGBsaXN0Ym94YCwgYnV0IGN1cnJlbnRseSBpdCdzIGRpZmZpY3VsdFxuICAgIC8vIHRvIHN5bmMgaW50byBHb29nbGUsIGJlY2F1c2Ugb2YgYW4gb3V0ZGF0ZWQgYXV0b21hdGVkIGExMXkgY2hlY2sgd2hpY2ggZmxhZ3MgaXQgYXMgYW4gaW52YWxpZFxuICAgIC8vIHZhbHVlLiBBdCBzb21lIHBvaW50IHdlIHNob3VsZCB0cnkgdG8gc3dpdGNoIGl0IGJhY2sgdG8gYmVpbmcgYGxpc3Rib3hgLlxuICAgICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLFxuICAgICdjbGFzcyc6ICdtYXQtc2VsZWN0JyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ3RhYkluZGV4JyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncGFuZWxPcGVuID8gaWQgKyBcIi1wYW5lbFwiIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ3BhbmVsT3BlbicsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ2FyaWFMYWJlbCB8fCBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1yZXF1aXJlZF0nOiAncmVxdWlyZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZGJ5IHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ19nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWVtcHR5XSc6ICdlbXB0eScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LW11bHRpcGxlXSc6ICdtdWx0aXBsZScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTZWxlY3RBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsV3JhcCxcbiAgICBtYXRTZWxlY3RBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNYXRGb3JtRmllbGRDb250cm9sLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0fSxcbiAgICB7cHJvdmlkZTogTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogTWF0U2VsZWN0fVxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3QgZXh0ZW5kcyBfTWF0U2VsZWN0QmFzZTxNYXRTZWxlY3RDaGFuZ2U+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLyoqIFRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgcGFuZWwsIGNhbGN1bGF0ZWQgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIFRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGZvciB0aGUgdHJpZ2dlcidzIGNsaWVudCBib3VuZGluZyByZWN0LiAqL1xuICBfdHJpZ2dlclJlY3Q6IENsaWVudFJlY3Q7XG5cbiAgLyoqIFRoZSBjYWNoZWQgZm9udC1zaXplIG9mIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF90cmlnZ2VyRm9udFNpemUgPSAwO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIHNlbGVjdCBwYW5lbCdzIHRyYW5zZm9ybS1vcmlnaW4gcHJvcGVydHkuICovXG4gIF90cmFuc2Zvcm1PcmlnaW46IHN0cmluZyA9ICd0b3AnO1xuXG4gIC8qKlxuICAgKiBUaGUgeS1vZmZzZXQgb2YgdGhlIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlIHRyaWdnZXIncyB0b3Agc3RhcnQgY29ybmVyLlxuICAgKiBUaGlzIG11c3QgYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIHNlbGVjdGVkIG9wdGlvbiB0ZXh0IG92ZXIgdGhlIHRyaWdnZXIgdGV4dC5cbiAgICogd2hlbiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIHRoZSB5LXBvc2l0aW9uIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uXG4gICAqL1xuICBfb2Zmc2V0WSA9IDA7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+O1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG5cbiAgQENvbnRlbnRDaGlsZChNQVRfU0VMRUNUX1RSSUdHRVIpIGN1c3RvbVRyaWdnZXI6IE1hdFNlbGVjdFRyaWdnZXI7XG5cbiAgX3Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICdib3R0b20nLFxuICAgIH0sXG4gIF07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbC5cbiAgICpcbiAgICogQXR0ZW1wdHMgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24gaW4gdGhlIHBhbmVsLiBJZiB0aGUgb3B0aW9uIGlzXG4gICAqIHRvbyBoaWdoIG9yIHRvbyBsb3cgaW4gdGhlIHBhbmVsIHRvIGJlIHNjcm9sbGVkIHRvIHRoZSBjZW50ZXIsIGl0IGNsYW1wcyB0aGVcbiAgICogc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBtaW4gb3IgbWF4IHNjcm9sbCBwb3NpdGlvbnMgcmVzcGVjdGl2ZWx5LlxuICAgKi9cbiAgX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRJbmRleDogbnVtYmVyLCBzY3JvbGxCdWZmZXI6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCA9IGl0ZW1IZWlnaHQgKiBzZWxlY3RlZEluZGV4O1xuICAgIGNvbnN0IGhhbGZPcHRpb25IZWlnaHQgPSBpdGVtSGVpZ2h0IC8gMjtcblxuICAgIC8vIFN0YXJ0cyBhdCB0aGUgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCwgd2hpY2ggc2Nyb2xscyB0aGUgb3B0aW9uIHRvIHRoZSB0b3Agb2YgdGhlXG4gICAgLy8gc2Nyb2xsIGNvbnRhaW5lciwgdGhlbiBzdWJ0cmFjdHMgdGhlIHNjcm9sbCBidWZmZXIgdG8gc2Nyb2xsIHRoZSBvcHRpb24gZG93biB0b1xuICAgIC8vIHRoZSBjZW50ZXIgb2YgdGhlIG92ZXJsYXkgcGFuZWwuIEhhbGYgdGhlIG9wdGlvbiBoZWlnaHQgbXVzdCBiZSByZS1hZGRlZCB0byB0aGVcbiAgICAvLyBzY3JvbGxUb3Agc28gdGhlIG9wdGlvbiBpcyBjZW50ZXJlZCBiYXNlZCBvbiBpdHMgbWlkZGxlLCBub3QgaXRzIHRvcCBlZGdlLlxuICAgIGNvbnN0IG9wdGltYWxTY3JvbGxQb3NpdGlvbiA9IG9wdGlvbk9mZnNldEZyb21TY3JvbGxUb3AgLSBzY3JvbGxCdWZmZXIgKyBoYWxmT3B0aW9uSGVpZ2h0O1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCgwLCBvcHRpbWFsU2Nyb2xsUG9zaXRpb24pLCBtYXhTY3JvbGwpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAoc3VwZXIuX2Nhbk9wZW4oKSkge1xuICAgICAgc3VwZXIub3BlbigpO1xuICAgICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21wdXRlZCBmb250LXNpemUgd2lsbCBiZSBhIHN0cmluZyBwaXhlbCB2YWx1ZSAoZS5nLiBcIjE2cHhcIikuXG4gICAgICAvLyBgcGFyc2VJbnRgIGlnbm9yZXMgdGhlIHRyYWlsaW5nICdweCcgYW5kIGNvbnZlcnRzIHRoaXMgdG8gYSBudW1iZXIuXG4gICAgICB0aGlzLl90cmlnZ2VyRm9udFNpemUgPVxuICAgICAgICAgIHBhcnNlSW50KGdldENvbXB1dGVkU3R5bGUodGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQpLmZvbnRTaXplIHx8ICcwJyk7XG4gICAgICB0aGlzLl9jYWxjdWxhdGVPdmVybGF5UG9zaXRpb24oKTtcblxuICAgICAgLy8gU2V0IHRoZSBmb250IHNpemUgb24gdGhlIHBhbmVsIGVsZW1lbnQgb25jZSBpdCBleGlzdHMuXG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fdHJpZ2dlckZvbnRTaXplICYmIHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZiAmJlxuICAgICAgICAgICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gYCR7dGhpcy5fdHJpZ2dlckZvbnRTaXplfXB4YDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNjcm9sbHMgdGhlIGFjdGl2ZSBvcHRpb24gaW50byB2aWV3LiAqL1xuICBwcm90ZWN0ZWQgX3Njcm9sbE9wdGlvbkludG9WaWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oaW5kZXgsIHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25Hcm91cHMpO1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbGFiZWxDb3VudCA9PT0gMSkge1xuICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAvLyB0b3Agb2YgdGhlIG9wdGlvbiwgYmVjYXVzZSBpdCBhbGxvd3MgdGhlIHVzZXIgdG8gcmVhZCB0aGUgdG9wIGdyb3VwJ3MgbGFiZWwuXG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgKGluZGV4ICsgbGFiZWxDb3VudCkgKiBpdGVtSGVpZ2h0LFxuICAgICAgICBpdGVtSGVpZ2h0LFxuICAgICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Bvc2l0aW9uaW5nU2V0dGxlZCgpIHtcbiAgICB0aGlzLl9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpO1xuICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSB0aGlzLl9zY3JvbGxUb3A7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW46IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX292ZXJsYXlEaXIub2Zmc2V0WCA9IDA7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICBzdXBlci5fcGFuZWxEb25lQW5pbWF0aW5nKGlzT3Blbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dldENoYW5nZUV2ZW50KHZhbHVlOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IE1hdFNlbGVjdENoYW5nZSh0aGlzLCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgeC1vZmZzZXQgb2YgdGhlIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlIHRyaWdnZXIncyB0b3Agc3RhcnQgY29ybmVyLlxuICAgKiBUaGlzIG11c3QgYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIHNlbGVjdGVkIG9wdGlvbiB0ZXh0IG92ZXIgdGhlIHRyaWdnZXIgdGV4dCB3aGVuXG4gICAqIHRoZSBwYW5lbCBvcGVucy4gV2lsbCBjaGFuZ2UgYmFzZWQgb24gTFRSIG9yIFJUTCB0ZXh0IGRpcmVjdGlvbi4gTm90ZSB0aGF0IHRoZSBvZmZzZXRcbiAgICogY2FuJ3QgYmUgY2FsY3VsYXRlZCB1bnRpbCB0aGUgcGFuZWwgaGFzIGJlZW4gYXR0YWNoZWQsIGJlY2F1c2Ugd2UgbmVlZCB0byBrbm93IHRoZVxuICAgKiBjb250ZW50IHdpZHRoIGluIG9yZGVyIHRvIGNvbnN0cmFpbiB0aGUgcGFuZWwgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRYKCk6IHZvaWQge1xuICAgIGNvbnN0IG92ZXJsYXlSZWN0ID0gdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHZpZXdwb3J0U2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLl9pc1J0bCgpO1xuICAgIGNvbnN0IHBhZGRpbmdXaWR0aCA9IHRoaXMubXVsdGlwbGUgPyBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YICsgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuICAgIGxldCBvZmZzZXRYOiBudW1iZXI7XG5cbiAgICAvLyBBZGp1c3QgdGhlIG9mZnNldCwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb24gcGFkZGluZy5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgb2Zmc2V0WCA9IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1g7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRpc2FibGVPcHRpb25DZW50ZXJpbmcpIHtcbiAgICAgIG9mZnNldFggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSB8fCB0aGlzLm9wdGlvbnMuZmlyc3Q7XG4gICAgICBvZmZzZXRYID0gc2VsZWN0ZWQgJiYgc2VsZWN0ZWQuZ3JvdXAgPyBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWCA6IFNFTEVDVF9QQU5FTF9QQURESU5HX1g7XG4gICAgfVxuXG4gICAgLy8gSW52ZXJ0IHRoZSBvZmZzZXQgaW4gTFRSLlxuICAgIGlmICghaXNSdGwpIHtcbiAgICAgIG9mZnNldFggKj0gLTE7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIGhvdyBtdWNoIHRoZSBzZWxlY3Qgb3ZlcmZsb3dzIG9uIGVhY2ggc2lkZS5cbiAgICBjb25zdCBsZWZ0T3ZlcmZsb3cgPSAwIC0gKG92ZXJsYXlSZWN0LmxlZnQgKyBvZmZzZXRYIC0gKGlzUnRsID8gcGFkZGluZ1dpZHRoIDogMCkpO1xuICAgIGNvbnN0IHJpZ2h0T3ZlcmZsb3cgPSBvdmVybGF5UmVjdC5yaWdodCArIG9mZnNldFggLSB2aWV3cG9ydFNpemUud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoaXNSdGwgPyAwIDogcGFkZGluZ1dpZHRoKTtcblxuICAgIC8vIElmIHRoZSBlbGVtZW50IG92ZXJmbG93cyBvbiBlaXRoZXIgc2lkZSwgcmVkdWNlIHRoZSBvZmZzZXQgdG8gYWxsb3cgaXQgdG8gZml0LlxuICAgIGlmIChsZWZ0T3ZlcmZsb3cgPiAwKSB7XG4gICAgICBvZmZzZXRYICs9IGxlZnRPdmVyZmxvdyArIFNFTEVDVF9QQU5FTF9WSUVXUE9SVF9QQURESU5HO1xuICAgIH0gZWxzZSBpZiAocmlnaHRPdmVyZmxvdyA+IDApIHtcbiAgICAgIG9mZnNldFggLT0gcmlnaHRPdmVyZmxvdyArIFNFTEVDVF9QQU5FTF9WSUVXUE9SVF9QQURESU5HO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgb2Zmc2V0IGRpcmVjdGx5IGluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBnbyB0aHJvdWdoIGNoYW5nZSBkZXRlY3Rpb24gYW5kXG4gICAgLy8gcG90ZW50aWFsbHkgdHJpZ2dlcmluZyBcImNoYW5nZWQgYWZ0ZXIgaXQgd2FzIGNoZWNrZWRcIiBlcnJvcnMuIFJvdW5kIHRoZSB2YWx1ZSB0byBhdm9pZFxuICAgIC8vIGJsdXJyeSBjb250ZW50IGluIHNvbWUgYnJvd3NlcnMuXG4gICAgdGhpcy5fb3ZlcmxheURpci5vZmZzZXRYID0gTWF0aC5yb3VuZChvZmZzZXRYKTtcbiAgICB0aGlzLl9vdmVybGF5RGlyLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSB5LW9mZnNldCBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGVcbiAgICogdG9wIHN0YXJ0IGNvcm5lciBvZiB0aGUgdHJpZ2dlci4gSXQgaGFzIHRvIGJlIGFkanVzdGVkIGluIG9yZGVyIGZvciB0aGVcbiAgICogc2VsZWN0ZWQgb3B0aW9uIHRvIGJlIGFsaWduZWQgb3ZlciB0aGUgdHJpZ2dlciB3aGVuIHRoZSBwYW5lbCBvcGVucy5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkSW5kZXg6IG51bWJlciwgc2Nyb2xsQnVmZmVyOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbWF4T3B0aW9uc0Rpc3BsYXllZCA9IE1hdGguZmxvb3IoU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgLyBpdGVtSGVpZ2h0KTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wOiBudW1iZXI7XG5cbiAgICAvLyBEaXNhYmxlIG9mZnNldCBpZiByZXF1ZXN0ZWQgYnkgdXNlciBieSByZXR1cm5pbmcgMCBhcyB2YWx1ZSB0byBvZmZzZXRcbiAgICBpZiAodGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZEluZGV4ICogaXRlbUhlaWdodDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gbWF4U2Nyb2xsKSB7XG4gICAgICBjb25zdCBmaXJzdERpc3BsYXllZEluZGV4ID0gdGhpcy5fZ2V0SXRlbUNvdW50KCkgLSBtYXhPcHRpb25zRGlzcGxheWVkO1xuICAgICAgY29uc3Qgc2VsZWN0ZWREaXNwbGF5SW5kZXggPSBzZWxlY3RlZEluZGV4IC0gZmlyc3REaXNwbGF5ZWRJbmRleDtcblxuICAgICAgLy8gVGhlIGZpcnN0IGl0ZW0gaXMgcGFydGlhbGx5IG91dCBvZiB0aGUgdmlld3BvcnQuIFRoZXJlZm9yZSB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB3aGF0XG4gICAgICAvLyBwb3J0aW9uIG9mIGl0IGlzIHNob3duIGluIHRoZSB2aWV3cG9ydCBhbmQgYWNjb3VudCBmb3IgaXQgaW4gb3VyIG9mZnNldC5cbiAgICAgIGxldCBwYXJ0aWFsSXRlbUhlaWdodCA9XG4gICAgICAgICAgaXRlbUhlaWdodCAtICh0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQgLSBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCkgJSBpdGVtSGVpZ2h0O1xuXG4gICAgICAvLyBCZWNhdXNlIHRoZSBwYW5lbCBoZWlnaHQgaXMgbG9uZ2VyIHRoYW4gdGhlIGhlaWdodCBvZiB0aGUgb3B0aW9ucyBhbG9uZSxcbiAgICAgIC8vIHRoZXJlIGlzIGFsd2F5cyBleHRyYSBwYWRkaW5nIGF0IHRoZSB0b3Agb3IgYm90dG9tIG9mIHRoZSBwYW5lbC4gV2hlblxuICAgICAgLy8gc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCB0aGlzIHBhZGRpbmcgaXMgYXQgdGhlIHRvcCBvZiB0aGUgcGFuZWwgYW5kXG4gICAgICAvLyBtdXN0IGJlIGFkZGVkIHRvIHRoZSBvZmZzZXQuXG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZERpc3BsYXlJbmRleCAqIGl0ZW1IZWlnaHQgKyBwYXJ0aWFsSXRlbUhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIG9wdGlvbiB3YXMgc2Nyb2xsZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgcGFuZWwgdXNpbmcgYSBzY3JvbGwgYnVmZmVyLFxuICAgICAgLy8gaXRzIG9mZnNldCB3aWxsIGJlIHRoZSBzY3JvbGwgYnVmZmVyIG1pbnVzIHRoZSBoYWxmIGhlaWdodCB0aGF0IHdhcyBhZGRlZCB0b1xuICAgICAgLy8gY2VudGVyIGl0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2Nyb2xsQnVmZmVyIC0gaXRlbUhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZpbmFsIG9mZnNldCBpcyB0aGUgb3B0aW9uJ3Mgb2Zmc2V0IGZyb20gdGhlIHRvcCwgYWRqdXN0ZWQgZm9yIHRoZSBoZWlnaHQgZGlmZmVyZW5jZSxcbiAgICAvLyBtdWx0aXBsaWVkIGJ5IC0xIHRvIGVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IG1vdmVzIGluIHRoZSBjb3JyZWN0IGRpcmVjdGlvbiB1cCB0aGUgcGFnZS5cbiAgICAvLyBUaGUgdmFsdWUgaXMgcm91bmRlZCB0byBwcmV2ZW50IHNvbWUgYnJvd3NlcnMgZnJvbSBibHVycmluZyB0aGUgY29udGVudC5cbiAgICByZXR1cm4gTWF0aC5yb3VuZChvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgKiAtMSAtIG9wdGlvbkhlaWdodEFkanVzdG1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGF0IHRoZSBhdHRlbXB0ZWQgb3ZlcmxheSBwb3NpdGlvbiB3aWxsIGZpdCB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKiBJZiBpdCB3aWxsIG5vdCBmaXQsIHRyaWVzIHRvIGFkanVzdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB0aGUgYXNzb2NpYXRlZFxuICAgKiB5LW9mZnNldCBzbyB0aGUgcGFuZWwgY2FuIG9wZW4gZnVsbHkgb24tc2NyZWVuLiBJZiBpdCBzdGlsbCB3b24ndCBmaXQsXG4gICAqIHNldHMgdGhlIG9mZnNldCBiYWNrIHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2Ugb3Zlci5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCB2aWV3cG9ydFNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2l6ZSgpO1xuXG4gICAgY29uc3QgdG9wU3BhY2VBdmFpbGFibGUgPSB0aGlzLl90cmlnZ2VyUmVjdC50b3AgLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICBjb25zdCBib3R0b21TcGFjZUF2YWlsYWJsZSA9XG4gICAgICAgIHZpZXdwb3J0U2l6ZS5oZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5ib3R0b20gLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcblxuICAgIGNvbnN0IHBhbmVsSGVpZ2h0VG9wID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSk7XG4gICAgY29uc3QgdG90YWxQYW5lbEhlaWdodCA9XG4gICAgICAgIE1hdGgubWluKHRoaXMuX2dldEl0ZW1Db3VudCgpICogaXRlbUhlaWdodCwgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0Qm90dG9tID0gdG90YWxQYW5lbEhlaWdodCAtIHBhbmVsSGVpZ2h0VG9wIC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0O1xuXG4gICAgaWYgKHBhbmVsSGVpZ2h0Qm90dG9tID4gYm90dG9tU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuX2FkanVzdFBhbmVsVXAocGFuZWxIZWlnaHRCb3R0b20sIGJvdHRvbVNwYWNlQXZhaWxhYmxlKTtcbiAgICB9IGVsc2UgaWYgKHBhbmVsSGVpZ2h0VG9wID4gdG9wU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgdGhpcy5fYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wLCB0b3BTcGFjZUF2YWlsYWJsZSwgbWF4U2Nyb2xsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luQmFzZWRPbk9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIHVwIHRvIGZpdCBpbiB0aGUgdmlld3BvcnQuICovXG4gIHByaXZhdGUgX2FkanVzdFBhbmVsVXAocGFuZWxIZWlnaHRCb3R0b206IG51bWJlciwgYm90dG9tU3BhY2VBdmFpbGFibGU6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQmVsb3dWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRCb3R0b20gLSBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCB1cCBieSB0aGUgZGlzdGFuY2UgaXQgd2FzIGV4dGVuZGluZyBwYXN0IHRoZSBib3VuZGFyeSwgdGhlblxuICAgIC8vIGFkanVzdHMgdGhlIG9mZnNldCBieSB0aGF0IGFtb3VudCB0byBtb3ZlIHRoZSBwYW5lbCB1cCBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICB0aGlzLl9zY3JvbGxUb3AgLT0gZGlzdGFuY2VCZWxvd1ZpZXdwb3J0O1xuICAgIHRoaXMuX29mZnNldFkgLT0gZGlzdGFuY2VCZWxvd1ZpZXdwb3J0O1xuICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcblxuICAgIC8vIElmIHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgdmVyeSB0b3AsIGl0IHdvbid0IGJlIGFibGUgdG8gZml0IHRoZSBwYW5lbFxuICAgIC8vIGJ5IHNjcm9sbGluZywgc28gc2V0IHRoZSBvZmZzZXQgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb24gdG8gdGFrZVxuICAgIC8vIGVmZmVjdC5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wIDw9IDApIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9vZmZzZXRZID0gMDtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IGA1MCUgYm90dG9tIDBweGA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFkanVzdHMgdGhlIG92ZXJsYXkgcGFuZWwgZG93biB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbERvd24ocGFuZWxIZWlnaHRUb3A6IG51bWJlciwgdG9wU3BhY2VBdmFpbGFibGU6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbDogbnVtYmVyKSB7XG4gICAgLy8gQnJvd3NlcnMgaWdub3JlIGZyYWN0aW9uYWwgc2Nyb2xsIG9mZnNldHMsIHNvIHdlIG5lZWQgdG8gcm91bmQuXG4gICAgY29uc3QgZGlzdGFuY2VBYm92ZVZpZXdwb3J0ID0gTWF0aC5yb3VuZChwYW5lbEhlaWdodFRvcCAtIHRvcFNwYWNlQXZhaWxhYmxlKTtcblxuICAgIC8vIFNjcm9sbHMgdGhlIHBhbmVsIGRvd24gYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgZG93biBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICB0aGlzLl9zY3JvbGxUb3AgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX29mZnNldFkgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcblxuICAgIC8vIElmIHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgdmVyeSBib3R0b20sIGl0IHdvbid0IGJlIGFibGUgdG8gZml0IHRoZVxuICAgIC8vIHBhbmVsIGJ5IHNjcm9sbGluZywgc28gc2V0IHRoZSBvZmZzZXQgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb25cbiAgICAvLyB0byB0YWtlIGVmZmVjdC5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gbWF4U2Nyb2xsO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIHRvcCAwcHhgO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHgtIGFuZCB5LW9mZnNldHMgb2YgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbUNvdW50KCk7XG4gICAgY29uc3QgcGFuZWxIZWlnaHQgPSBNYXRoLm1pbihpdGVtcyAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBzY3JvbGxDb250YWluZXJIZWlnaHQgPSBpdGVtcyAqIGl0ZW1IZWlnaHQ7XG5cbiAgICAvLyBUaGUgZmFydGhlc3QgdGhlIHBhbmVsIGNhbiBiZSBzY3JvbGxlZCBiZWZvcmUgaXQgaGl0cyB0aGUgYm90dG9tXG4gICAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsQ29udGFpbmVySGVpZ2h0IC0gcGFuZWxIZWlnaHQ7XG5cbiAgICAvLyBJZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCB3ZSBvcGVuIHRoZSBwb3B1cCB0byB0aGUgZmlyc3QgaXRlbS5cbiAgICBsZXQgc2VsZWN0ZWRPcHRpb25PZmZzZXQ6IG51bWJlcjtcblxuICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkT3B0aW9uT2Zmc2V0ID1cbiAgICAgICAgICBNYXRoLm1heCh0aGlzLm9wdGlvbnMudG9BcnJheSgpLmluZGV4T2YodGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0pLCAwKTtcbiAgICB9XG5cbiAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCArPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihzZWxlY3RlZE9wdGlvbk9mZnNldCwgdGhpcy5vcHRpb25zLFxuICAgICAgICB0aGlzLm9wdGlvbkdyb3Vwcyk7XG5cbiAgICAvLyBXZSBtdXN0IG1haW50YWluIGEgc2Nyb2xsIGJ1ZmZlciBzbyB0aGUgc2VsZWN0ZWQgb3B0aW9uIHdpbGwgYmUgc2Nyb2xsZWQgdG8gdGhlXG4gICAgLy8gY2VudGVyIG9mIHRoZSBvdmVybGF5IHBhbmVsIHJhdGhlciB0aGFuIHRoZSB0b3AuXG4gICAgY29uc3Qgc2Nyb2xsQnVmZmVyID0gcGFuZWxIZWlnaHQgLyAyO1xuICAgIHRoaXMuX3Njcm9sbFRvcCA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcbiAgICB0aGlzLl9vZmZzZXRZID0gdGhpcy5fY2FsY3VsYXRlT3ZlcmxheU9mZnNldFkoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcblxuICAgIHRoaXMuX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdHJhbnNmb3JtIG9yaWdpbiBwb2ludCBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk6IHN0cmluZyB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25IZWlnaHRBZGp1c3RtZW50ID0gKGl0ZW1IZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5oZWlnaHQpIC8gMjtcbiAgICBjb25zdCBvcmlnaW5ZID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSkgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50ICsgaXRlbUhlaWdodCAvIDI7XG4gICAgcmV0dXJuIGA1MCUgJHtvcmlnaW5ZfXB4IDBweGA7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgaGVpZ2h0IG9mIHRoZSBzZWxlY3QncyBvcHRpb25zLiAqL1xuICBwcml2YXRlIF9nZXRJdGVtSGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3RyaWdnZXJGb250U2l6ZSAqIFNFTEVDVF9JVEVNX0hFSUdIVF9FTTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgaXRlbXMgaW4gdGhlIHNlbGVjdC4gVGhpcyBpbmNsdWRlcyBvcHRpb25zIGFuZCBncm91cCBsYWJlbHMuICovXG4gIHByaXZhdGUgX2dldEl0ZW1Db3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMubGVuZ3RoICsgdGhpcy5vcHRpb25Hcm91cHMubGVuZ3RoO1xuICB9XG5cbn1cbiIsIjwhLS1cbiBOb3RlIHRoYXQgdGhlIHNlbGVjdCB0cmlnZ2VyIGVsZW1lbnQgc3BlY2lmaWVzIGBhcmlhLW93bnNgIHBvaW50aW5nIHRvIHRoZSBsaXN0Ym94IG92ZXJsYXkuXG4gV2hpbGUgYXJpYS1vd25zIGlzIG5vdCByZXF1aXJlZCBmb3IgdGhlIEFSSUEgMS4yIGByb2xlPVwiY29tYm9ib3hcImAgaW50ZXJhY3Rpb24gcGF0dGVybixcbiBpdCBmaXhlcyBhbiBpc3N1ZSB3aXRoIFZvaWNlT3ZlciB3aGVuIHRoZSBzZWxlY3QgYXBwZWFycyBpbnNpZGUgb2YgYW4gYGFyaWEtbW9kZWw9XCJ0cnVlXCJgXG4gZWxlbWVudCAoZS5nLiBhIGRpYWxvZykuIFdpdGhvdXQgdGhpcyBgYXJpYS1vd25zYCwgdGhlIGBhcmlhLW1vZGFsYCBvbiBhIGRpYWxvZyBwcmV2ZW50c1xuIFZvaWNlT3ZlciBmcm9tIFwic2VlaW5nXCIgdGhlIHNlbGVjdCdzIGxpc3Rib3ggb3ZlcmxheSBmb3IgYXJpYS1hY3RpdmVkZXNjZW5kYW50LlxuIFVzaW5nIGBhcmlhLW93bnNgIHJlLXBhcmVudHMgdGhlIHNlbGVjdCBvdmVybGF5IHNvIHRoYXQgaXQgd29ya3MgYWdhaW4uXG4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNjk0XG4tLT5cbjxkaXYgY2RrLW92ZXJsYXktb3JpZ2luXG4gICAgIFthdHRyLmFyaWEtb3duc109XCJwYW5lbE9wZW4gPyBpZCArICctcGFuZWwnIDogbnVsbFwiXG4gICAgIGNsYXNzPVwibWF0LXNlbGVjdC10cmlnZ2VyXCJcbiAgICAgKGNsaWNrKT1cInRvZ2dsZSgpXCJcbiAgICAgI29yaWdpbj1cImNka092ZXJsYXlPcmlnaW5cIlxuICAgICAjdHJpZ2dlcj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zZWxlY3QtdmFsdWVcIiBbbmdTd2l0Y2hdPVwiZW1wdHlcIiBbYXR0ci5pZF09XCJfdmFsdWVJZFwiPlxuICAgIDxzcGFuIGNsYXNzPVwibWF0LXNlbGVjdC1wbGFjZWhvbGRlciBtYXQtc2VsZWN0LW1pbi1saW5lXCIgKm5nU3dpdGNoQ2FzZT1cInRydWVcIj57e3BsYWNlaG9sZGVyfX08L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtc2VsZWN0LXZhbHVlLXRleHRcIiAqbmdTd2l0Y2hDYXNlPVwiZmFsc2VcIiBbbmdTd2l0Y2hdPVwiISFjdXN0b21UcmlnZ2VyXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1hdC1zZWxlY3QtbWluLWxpbmVcIiAqbmdTd2l0Y2hEZWZhdWx0Pnt7dHJpZ2dlclZhbHVlfX08L3NwYW4+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtc2VsZWN0LXRyaWdnZXJcIiAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiPjwvbmctY29udGVudD5cbiAgICA8L3NwYW4+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJtYXQtc2VsZWN0LWFycm93LXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwibWF0LXNlbGVjdC1hcnJvd1wiPjwvZGl2PjwvZGl2PlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZVxuICBjZGstY29ubmVjdGVkLW92ZXJsYXlcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUxvY2tQb3NpdGlvblxuICBjZGtDb25uZWN0ZWRPdmVybGF5SGFzQmFja2Ryb3BcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUJhY2tkcm9wQ2xhc3M9XCJjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcFwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5UGFuZWxDbGFzc109XCJfb3ZlcmxheVBhbmVsQ2xhc3NcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVNjcm9sbFN0cmF0ZWd5XT1cIl9zY3JvbGxTdHJhdGVneVwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3JpZ2luXT1cIm9yaWdpblwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJwYW5lbE9wZW5cIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uc109XCJfcG9zaXRpb25zXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlNaW5XaWR0aF09XCJfdHJpZ2dlclJlY3Q/LndpZHRoIVwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T2Zmc2V0WV09XCJfb2Zmc2V0WVwiXG4gIChiYWNrZHJvcENsaWNrKT1cImNsb3NlKClcIlxuICAoYXR0YWNoKT1cIl9vbkF0dGFjaGVkKClcIlxuICAoZGV0YWNoKT1cImNsb3NlKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zZWxlY3QtcGFuZWwtd3JhcFwiIFtAdHJhbnNmb3JtUGFuZWxXcmFwXT5cbiAgICA8ZGl2XG4gICAgICAjcGFuZWxcbiAgICAgIHJvbGU9XCJsaXN0Ym94XCJcbiAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgY2xhc3M9XCJtYXQtc2VsZWN0LXBhbmVsIHt7IF9nZXRQYW5lbFRoZW1lKCkgfX1cIlxuICAgICAgW2F0dHIuaWRdPVwiaWQgKyAnLXBhbmVsJ1wiXG4gICAgICBbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV09XCJtdWx0aXBsZVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieSgpXCJcbiAgICAgIFtuZ0NsYXNzXT1cInBhbmVsQ2xhc3NcIlxuICAgICAgW0B0cmFuc2Zvcm1QYW5lbF09XCJtdWx0aXBsZSA/ICdzaG93aW5nLW11bHRpcGxlJyA6ICdzaG93aW5nJ1wiXG4gICAgICAoQHRyYW5zZm9ybVBhbmVsLmRvbmUpPVwiX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbS5uZXh0KCRldmVudC50b1N0YXRlKVwiXG4gICAgICBbc3R5bGUudHJhbnNmb3JtT3JpZ2luXT1cIl90cmFuc2Zvcm1PcmlnaW5cIlxuICAgICAgW3N0eWxlLmZvbnQtc2l6ZS5weF09XCJfdHJpZ2dlckZvbnRTaXplXCJcbiAgICAgIChrZXlkb3duKT1cIl9oYW5kbGVLZXlkb3duKCRldmVudClcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19