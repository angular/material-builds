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
import { CdkConnectedOverlay, Overlay, } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, NgZone, Optional, Output, QueryList, Self, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators, } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _getOptionScrollPosition, ErrorStateMatcher, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, mixinDisabled, mixinDisableRipple, mixinErrorState, mixinTabIndex, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatLegacyFormField, MatLegacyFormFieldControl, } from '@angular/material/legacy-form-field';
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
import * as i6 from "@angular/material/legacy-form-field";
import * as i7 from "@angular/common";
import * as i8 from "@angular/cdk/overlay";
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
MatSelectTrigger.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelectTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatSelectTrigger.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatSelectTrigger, selector: "mat-select-trigger", providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelectTrigger, decorators: [{
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
        this._selectionModel.selected.forEach(option => option.setInactiveStyles());
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
_MatSelectBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatSelectBase, deps: [{ token: i1.ViewportRuler }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.ErrorStateMatcher }, { token: i0.ElementRef }, { token: i3.Directionality, optional: true }, { token: i4.NgForm, optional: true }, { token: i4.FormGroupDirective, optional: true }, { token: MAT_FORM_FIELD, optional: true }, { token: i4.NgControl, optional: true, self: true }, { token: 'tabindex', attribute: true }, { token: MAT_SELECT_SCROLL_STRATEGY }, { token: i5.LiveAnnouncer }, { token: MAT_SELECT_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
_MatSelectBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: _MatSelectBase, inputs: { userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], panelClass: "panelClass", placeholder: "placeholder", required: "required", multiple: "multiple", disableOptionCentering: "disableOptionCentering", compareWith: "compareWith", value: "value", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], errorStateMatcher: "errorStateMatcher", typeaheadDebounceInterval: "typeaheadDebounceInterval", sortComparator: "sortComparator", id: "id" }, outputs: { openedChange: "openedChange", _openedStream: "opened", _closedStream: "closed", selectionChange: "selectionChange", valueChange: "valueChange" }, viewQueries: [{ propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }, { propertyName: "_overlayDir", first: true, predicate: CdkConnectedOverlay, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatSelectBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.ViewportRuler }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i2.ErrorStateMatcher }, { type: i0.ElementRef }, { type: i3.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i4.NgForm, decorators: [{
                    type: Optional
                }] }, { type: i4.FormGroupDirective, decorators: [{
                    type: Optional
                }] }, { type: i6.MatLegacyFormField, decorators: [{
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
        this._viewportRuler
            .change()
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
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
            this._triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement).fontSize || '0');
            this._calculateOverlayPosition();
            // Set the font size on the panel element once it exists.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._triggerFontSize &&
                    this._overlayDir.overlayRef &&
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
        const paddingWidth = this.multiple
            ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X
            : SELECT_PANEL_PADDING_X * 2;
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
        const rightOverflow = overlayRect.right + offsetX - viewportSize.width + (isRtl ? 0 : paddingWidth);
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
            let partialItemHeight = itemHeight - ((this._getItemCount() * itemHeight - SELECT_PANEL_MAX_HEIGHT) % itemHeight);
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
            selectedOptionOffset = Math.max(this.options.toArray().indexOf(this._selectionModel.selected[0]), 0);
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
MatSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelect, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.1", type: MatSelect, selector: "mat-select", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none", "aria-haspopup": "true" }, listeners: { "keydown": "_handleKeydown($event)", "focus": "_onFocus()", "blur": "_onBlur()" }, properties: { "attr.id": "id", "attr.tabindex": "tabIndex", "attr.aria-controls": "panelOpen ? id + \"-panel\" : null", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "attr.aria-activedescendant": "_getAriaActiveDescendant()", "class.mat-select-disabled": "disabled", "class.mat-select-invalid": "errorState", "class.mat-select-required": "required", "class.mat-select-empty": "empty", "class.mat-select-multiple": "multiple" }, classAttribute: "mat-select" }, providers: [
        { provide: MatLegacyFormFieldControl, useExisting: MatSelect },
        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect },
    ], queries: [{ propertyName: "customTrigger", first: true, predicate: MAT_SELECT_TRIGGER, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], exportAs: ["matSelect"], usesInheritance: true, ngImport: i0, template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{height:16px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;margin:0 4px}.mat-form-field.mat-focused .mat-select-arrow{transform:translateX(0)}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"], dependencies: [{ kind: "directive", type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i7.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i7.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i7.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "directive", type: i8.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: i8.CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }], animations: [matSelectAnimations.transformPanelWrap, matSelectAnimations.transformPanel], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatSelect, decorators: [{
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
                        '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
                        '[class.mat-select-disabled]': 'disabled',
                        '[class.mat-select-invalid]': 'errorState',
                        '[class.mat-select-required]': 'required',
                        '[class.mat-select-empty]': 'empty',
                        '[class.mat-select-multiple]': 'multiple',
                        '(keydown)': '_handleKeydown($event)',
                        '(focus)': '_onFocus()',
                        '(blur)': '_onBlur()',
                    }, animations: [matSelectAnimations.transformPanelWrap, matSelectAnimations.transformPanel], providers: [
                        { provide: MatLegacyFormFieldControl, useExisting: MatSelect },
                        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect },
                    ], template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{height:16px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;margin:0 4px}.mat-form-field.mat-focused .mat-select-arrow{transform:translateX(0)}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBRSxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUNMLENBQUMsRUFDRCxVQUFVLEVBQ1YsS0FBSyxFQUNMLGNBQWMsRUFDZCxVQUFVLEVBQ1YsV0FBVyxFQUNYLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQ0wsbUJBQW1CLEVBRW5CLE9BQU8sR0FFUixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBRUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUlOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULElBQUksRUFFSixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxrQkFBa0IsRUFDbEIsU0FBUyxFQUNULE1BQU0sRUFDTixVQUFVLEdBQ1gs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QUM7cUJBQy9EOzhCQXNCZ0QsT0FBTztzQkFBdkQsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVLLFlBQVk7c0JBQS9ELGVBQWU7dUJBQUMsWUFBWSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFFaEIsYUFBYTtzQkFBOUMsWUFBWTt1QkFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciwgTGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBLFxuICBET1dOX0FSUk9XLFxuICBFTlRFUixcbiAgaGFzTW9kaWZpZXJLZXksXG4gIExFRlRfQVJST1csXG4gIFJJR0hUX0FSUk9XLFxuICBTUEFDRSxcbiAgVVBfQVJST1csXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge1xuICBDZGtDb25uZWN0ZWRPdmVybGF5LFxuICBDb25uZWN0ZWRQb3NpdGlvbixcbiAgT3ZlcmxheSxcbiAgU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2VsZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgTmdGb3JtLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgSGFzVGFiSW5kZXgsXG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBtaXhpblRhYkluZGV4LFxuICBfTWF0T3B0aW9uQmFzZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfRk9STV9GSUVMRCxcbiAgTWF0TGVnYWN5Rm9ybUZpZWxkLFxuICBNYXRMZWdhY3lGb3JtRmllbGRDb250cm9sLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9sZWdhY3ktZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgc3R5bGUgY29uc3RhbnRzIGFyZSBuZWNlc3NhcnkgdG8gc2F2ZSBoZXJlIGluIG9yZGVyXG4gKiB0byBwcm9wZXJseSBjYWxjdWxhdGUgdGhlIGFsaWdubWVudCBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uIG92ZXJcbiAqIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gKi9cblxuLyoqIFRoZSBtYXggaGVpZ2h0IG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUID0gMjU2O1xuXG4vKiogVGhlIHBhbmVsJ3MgcGFkZGluZyBvbiB0aGUgeC1heGlzLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggPSAxNjtcblxuLyoqIFRoZSBwYW5lbCdzIHggYXhpcyBwYWRkaW5nIGlmIGl0IGlzIGluZGVudGVkIChlLmcuIHRoZXJlIGlzIGFuIG9wdGlvbiBncm91cCkuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcblxuLyoqIFRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCBpdGVtcyBpbiBgZW1gIHVuaXRzLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9JVEVNX0hFSUdIVF9FTSA9IDM7XG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IFJldmVydCB0byBhIGNvbnN0YW50IGFmdGVyIDIwMTggc3BlYyB1cGRhdGVzIGFyZSBmdWxseSBtZXJnZWQuXG4vKipcbiAqIERpc3RhbmNlIGJldHdlZW4gdGhlIHBhbmVsIGVkZ2UgYW5kIHRoZSBvcHRpb24gdGV4dCBpblxuICogbXVsdGktc2VsZWN0aW9uIG1vZGUuXG4gKlxuICogQ2FsY3VsYXRlZCBhczpcbiAqIChTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41KSArIDE2ID0gNDBcbiAqIFRoZSBwYWRkaW5nIGlzIG11bHRpcGxpZWQgYnkgMS41IGJlY2F1c2UgdGhlIGNoZWNrYm94J3MgbWFyZ2luIGlzIGhhbGYgdGhlIHBhZGRpbmcuXG4gKiBUaGUgY2hlY2tib3ggd2lkdGggaXMgMTZweC5cbiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41ICsgMTY7XG5cbi8qKlxuICogVGhlIHNlbGVjdCBwYW5lbCB3aWxsIG9ubHkgXCJmaXRcIiBpbnNpZGUgdGhlIHZpZXdwb3J0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYXRcbiAqIHRoaXMgdmFsdWUgb3IgbW9yZSBhd2F5IGZyb20gdGhlIHZpZXdwb3J0IGJvdW5kYXJ5LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkcgPSA4O1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LXNlbGVjdC1zY3JvbGwtc3RyYXRlZ3knLFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBvdmVybGF5OiBPdmVybGF5LFxuKTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U2VsZWN0Q29uZmlnIHtcbiAgLyoqIFdoZXRoZXIgb3B0aW9uIGNlbnRlcmluZyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVPcHRpb25DZW50ZXJpbmc/OiBib29sZWFuO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXI7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0LFxuICAgIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSxcbiAgKSB7fVxufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFNlbGVjdC5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0U2VsZWN0TWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKFxuICBtaXhpblRhYkluZGV4KFxuICAgIG1peGluRGlzYWJsZWQoXG4gICAgICBtaXhpbkVycm9yU3RhdGUoXG4gICAgICAgIGNsYXNzIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IHN0YXRlIGNoYW5nZXMgYW5kIHNob3VsZCBjYXVzZSB0aGUgcGFyZW50XG4gICAgICAgICAgICogZm9ybS1maWVsZCB0byB1cGRhdGUuIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgYE1hdEZvcm1GaWVsZENvbnRyb2xgLlxuICAgICAgICAgICAqIEBkb2NzLXByaXZhdGVcbiAgICAgICAgICAgKi9cbiAgICAgICAgICByZWFkb25seSBzdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gICAgICAgICAgY29uc3RydWN0b3IoXG4gICAgICAgICAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICBwdWJsaWMgX2RlZmF1bHRFcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAgICAgICAgICBwdWJsaWMgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZvcm0gY29udHJvbCBib3VuZCB0byB0aGUgY29tcG9uZW50LlxuICAgICAgICAgICAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAgICAgICAgICAgKiBAZG9jcy1wcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCxcbiAgICAgICAgICApIHt9XG4gICAgICAgIH0sXG4gICAgICApLFxuICAgICksXG4gICksXG4pO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYE1hdFNlbGVjdFRyaWdnZXJgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYE1hdFNlbGVjdFRyaWdnZXJgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9UUklHR0VSID0gbmV3IEluamVjdGlvblRva2VuPE1hdFNlbGVjdFRyaWdnZXI+KCdNYXRTZWxlY3RUcmlnZ2VyJyk7XG5cbi8qKlxuICogQWxsb3dzIHRoZSB1c2VyIHRvIGN1c3RvbWl6ZSB0aGUgdHJpZ2dlciB0aGF0IGlzIGRpc3BsYXllZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QtdHJpZ2dlcicsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfU0VMRUNUX1RSSUdHRVIsIHVzZUV4aXN0aW5nOiBNYXRTZWxlY3RUcmlnZ2VyfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdFRyaWdnZXIge31cblxuLyoqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRTZWxlY3RgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0U2VsZWN0QmFzZTxDPlxuICBleHRlbmRzIF9NYXRTZWxlY3RNaXhpbkJhc2VcbiAgaW1wbGVtZW50c1xuICAgIEFmdGVyQ29udGVudEluaXQsXG4gICAgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgRG9DaGVjayxcbiAgICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBDYW5EaXNhYmxlLFxuICAgIEhhc1RhYkluZGV4LFxuICAgIE1hdExlZ2FjeUZvcm1GaWVsZENvbnRyb2w8YW55PixcbiAgICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICAgIENhbkRpc2FibGVSaXBwbGVcbntcbiAgLyoqIEFsbCBvZiB0aGUgZGVmaW5lZCBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgYWJzdHJhY3Qgb3B0aW9uczogUXVlcnlMaXN0PF9NYXRPcHRpb25CYXNlPjtcblxuICAvLyBUT0RPKGNyaXNiZXRvKTogdGhpcyBpcyBvbmx5IG5lY2Vzc2FyeSBmb3IgdGhlIG5vbi1NREMgc2VsZWN0LCBidXQgaXQncyB0ZWNobmljYWxseSBhXG4gIC8vIHB1YmxpYyBBUEkgc28gd2UgaGF2ZSB0byBrZWVwIGl0LiBJdCBzaG91bGQgYmUgZGVwcmVjYXRlZCBhbmQgcmVtb3ZlZCBldmVudHVhbGx5LlxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIGdyb3VwcyBvZiBvcHRpb25zLiAqL1xuICBhYnN0cmFjdCBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG5cbiAgLyoqIFVzZXItc3VwcGxpZWQgb3ZlcnJpZGUgb2YgdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgYWJzdHJhY3QgY3VzdG9tVHJpZ2dlcjoge307XG5cbiAgLyoqXG4gICAqIFRoaXMgcG9zaXRpb24gY29uZmlnIGVuc3VyZXMgdGhhdCB0aGUgdG9wIFwic3RhcnRcIiBjb3JuZXIgb2YgdGhlIG92ZXJsYXlcbiAgICogaXMgYWxpZ25lZCB3aXRoIHdpdGggdGhlIHRvcCBcInN0YXJ0XCIgb2YgdGhlIG9yaWdpbiBieSBkZWZhdWx0IChvdmVybGFwcGluZ1xuICAgKiB0aGUgdHJpZ2dlciBjb21wbGV0ZWx5KS4gSWYgdGhlIHBhbmVsIGNhbm5vdCBmaXQgYmVsb3cgdGhlIHRyaWdnZXIsIGl0XG4gICAqIHdpbGwgZmFsbCBiYWNrIHRvIGEgcG9zaXRpb24gYWJvdmUgdGhlIHRyaWdnZXIuXG4gICAqL1xuICBhYnN0cmFjdCBfcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdO1xuXG4gIC8qKiBTY3JvbGxzIGEgcGFydGljdWxhciBvcHRpb24gaW50byB0aGUgdmlldy4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9zY3JvbGxPcHRpb25JbnRvVmlldyhpbmRleDogbnVtYmVyKTogdm9pZDtcblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHBhbmVsIGhhcyBiZWVuIG9wZW5lZCBhbmQgdGhlIG92ZXJsYXkgaGFzIHNldHRsZWQgb24gaXRzIGZpbmFsIHBvc2l0aW9uLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3Bvc2l0aW9uaW5nU2V0dGxlZCgpOiB2b2lkO1xuXG4gIC8qKiBDcmVhdGVzIGEgY2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IHNob3VsZCBiZSBlbWl0dGVkIGJ5IHRoZSBzZWxlY3QuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfZ2V0Q2hhbmdlRXZlbnQodmFsdWU6IGFueSk6IEM7XG5cbiAgLyoqIEZhY3RvcnkgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgYSBzY3JvbGwgc3RyYXRlZ3kgZm9yIHRoaXMgc2VsZWN0LiAqL1xuICBwcml2YXRlIF9zY3JvbGxTdHJhdGVneUZhY3Rvcnk6ICgpID0+IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3ZlcmxheSBwYW5lbCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9wYW5lbE9wZW4gPSBmYWxzZTtcblxuICAvKiogQ29tcGFyaXNvbiBmdW5jdGlvbiB0byBzcGVjaWZ5IHdoaWNoIG9wdGlvbiBpcyBkaXNwbGF5ZWQuIERlZmF1bHRzIHRvIG9iamVjdCBlcXVhbGl0eS4gKi9cbiAgcHJpdmF0ZSBfY29tcGFyZVdpdGggPSAobzE6IGFueSwgbzI6IGFueSkgPT4gbzEgPT09IG8yO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoaXMgaW5wdXQuICovXG4gIHByaXZhdGUgX3VpZCA9IGBtYXQtc2VsZWN0LSR7bmV4dFVuaXF1ZUlkKyt9YDtcblxuICAvKiogQ3VycmVudCBgYXJpYS1sYWJlbGxlZGJ5YCB2YWx1ZSBmb3IgdGhlIHNlbGVjdCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF90cmlnZ2VyQXJpYUxhYmVsbGVkQnk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBLZWVwcyB0cmFjayBvZiB0aGUgcHJldmlvdXMgZm9ybSBjb250cm9sIGFzc2lnbmVkIHRvIHRoZSBzZWxlY3QuXG4gICAqIFVzZWQgdG8gZGV0ZWN0IGlmIGl0IGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJldmlvdXNDb250cm9sOiBBYnN0cmFjdENvbnRyb2wgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBASW5wdXQoJ2FyaWEtZGVzY3JpYmVkYnknKSB1c2VyQXJpYURlc2NyaWJlZEJ5OiBzdHJpbmc7XG5cbiAgLyoqIERlYWxzIHdpdGggdGhlIHNlbGVjdGlvbiBsb2dpYy4gKi9cbiAgX3NlbGVjdGlvbk1vZGVsOiBTZWxlY3Rpb25Nb2RlbDxNYXRPcHRpb24+O1xuXG4gIC8qKiBNYW5hZ2VzIGtleWJvYXJkIGV2ZW50cyBmb3Igb3B0aW9ucyBpbiB0aGUgcGFuZWwuICovXG4gIF9rZXlNYW5hZ2VyOiBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiB2YWx1ZSBjaGFuZ2VzYCAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHNlbGVjdCBoYXMgYmVlbiB0b3VjaGVkYCAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIElEIGZvciB0aGUgRE9NIG5vZGUgY29udGFpbmluZyB0aGUgc2VsZWN0J3MgdmFsdWUuICovXG4gIF92YWx1ZUlkID0gYG1hdC1zZWxlY3QtdmFsdWUtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBwYW5lbCBlbGVtZW50IGlzIGZpbmlzaGVkIHRyYW5zZm9ybWluZyBpbi4gKi9cbiAgcmVhZG9ubHkgX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbSA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICAvKiogU3RyYXRlZ3kgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaGFuZGxlIHNjcm9sbGluZyB3aGlsZSB0aGUgc2VsZWN0IHBhbmVsIGlzIG9wZW4uICovXG4gIF9zY3JvbGxTdHJhdGVneTogU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgX292ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5vdmVybGF5UGFuZWxDbGFzcyB8fCAnJztcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkIHx8IHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuICBwcml2YXRlIF9mb2N1c2VkID0gZmFsc2U7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbWF0LXNlbGVjdCc7XG5cbiAgLyoqIFRyaWdnZXIgdGhhdCBvcGVucyB0aGUgc2VsZWN0LiAqL1xuICBAVmlld0NoaWxkKCd0cmlnZ2VyJykgdHJpZ2dlcjogRWxlbWVudFJlZjtcblxuICAvKiogUGFuZWwgY29udGFpbmluZyB0aGUgc2VsZWN0IG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIE92ZXJsYXkgcGFuZSBjb250YWluaW5nIHRoZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXkpXG4gIHByb3RlY3RlZCBfb3ZlcmxheURpcjogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHNlbGVjdCBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKiBQbGFjZWhvbGRlciB0byBiZSBzaG93biBpZiBubyB2YWx1ZSBoYXMgYmVlbiBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3BsYWNlaG9sZGVyO1xuICB9XG4gIHNldCBwbGFjZWhvbGRlcih2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXIgPSB2YWx1ZTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIHJlcXVpcmVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVkID8/IHRoaXMubmdDb250cm9sPy5jb250cm9sPy5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkgPz8gZmFsc2U7XG4gIH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBvcHRpb25zLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX211bHRpcGxlO1xuICB9XG4gIHNldCBtdWx0aXBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX211bHRpcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9tdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGNlbnRlciB0aGUgYWN0aXZlIG9wdGlvbiBvdmVyIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZztcbiAgfVxuICBzZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZyh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZU9wdGlvbkNlbnRlcmluZyA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID8/IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcHRpb24gdmFsdWVzIHdpdGggdGhlIHNlbGVjdGVkIHZhbHVlcy4gVGhlIGZpcnN0IGFyZ3VtZW50XG4gICAqIGlzIGEgdmFsdWUgZnJvbSBhbiBvcHRpb24uIFRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzZWxlY3Rpb24uIEEgYm9vbGVhblxuICAgKiBzaG91bGQgYmUgcmV0dXJuZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgY29tcGFyZVdpdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoO1xuICB9XG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcbiAgICAgIC8vIEEgZGlmZmVyZW50IGNvbXBhcmF0b3IgbWVhbnMgdGhlIHNlbGVjdGlvbiBjb3VsZCBjaGFuZ2UuXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzZWxlY3QgY29udHJvbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgY29uc3QgaGFzQXNzaWduZWQgPSB0aGlzLl9hc3NpZ25WYWx1ZShuZXdWYWx1ZSk7XG5cbiAgICBpZiAoaGFzQXNzaWduZWQpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfdmFsdWU6IGFueTtcblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgc2VsZWN0LiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBPYmplY3QgdXNlZCB0byBjb250cm9sIHdoZW4gZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLiAqL1xuICBASW5wdXQoKSBvdmVycmlkZSBlcnJvclN0YXRlTWF0Y2hlcjogRXJyb3JTdGF0ZU1hdGNoZXI7XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbDtcbiAgfVxuICBzZXQgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IG51bWJlcjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzb3J0IHRoZSB2YWx1ZXMgaW4gYSBzZWxlY3QgaW4gbXVsdGlwbGUgbW9kZS5cbiAgICogRm9sbG93cyB0aGUgc2FtZSBsb2dpYyBhcyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLlxuICAgKi9cbiAgQElucHV0KCkgc29ydENvbXBhcmF0b3I6IChhOiBNYXRPcHRpb24sIGI6IE1hdE9wdGlvbiwgb3B0aW9uczogTWF0T3B0aW9uW10pID0+IG51bWJlcjtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogQ29tYmluZWQgc3RyZWFtIG9mIGFsbCBvZiB0aGUgY2hpbGQgb3B0aW9ucycgY2hhbmdlIGV2ZW50cy4gKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uQ2hhbmdlczogT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgob3B0aW9ucyksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiBtZXJnZSguLi5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm9uU2VsZWN0aW9uQ2hhbmdlKSkpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUoXG4gICAgICB0YWtlKDEpLFxuICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcyksXG4gICAgKTtcbiAgfSkgYXMgT2JzZXJ2YWJsZTxNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2U+O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBwYW5lbCBoYXMgYmVlbiB0b2dnbGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgnb3BlbmVkJykgcmVhZG9ubHkgX29wZW5lZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gbyksXG4gICAgbWFwKCgpID0+IHt9KSxcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICBAT3V0cHV0KCdjbG9zZWQnKSByZWFkb25seSBfY2xvc2VkU3RyZWFtOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShcbiAgICBmaWx0ZXIobyA9PiAhbyksXG4gICAgbWFwKCgpID0+IHt9KSxcbiAgKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3RlZCB2YWx1ZSBoYXMgYmVlbiBjaGFuZ2VkIGJ5IHRoZSB1c2VyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Qz4gPSBuZXcgRXZlbnRFbWl0dGVyPEM+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IHRoYXQgZW1pdHMgd2hlbmV2ZXIgdGhlIHJhdyB2YWx1ZSBvZiB0aGUgc2VsZWN0IGNoYW5nZXMuIFRoaXMgaXMgaGVyZSBwcmltYXJpbHlcbiAgICogdG8gZmFjaWxpdGF0ZSB0aGUgdHdvLXdheSBiaW5kaW5nIGZvciB0aGUgYHZhbHVlYCBpbnB1dC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgX25nWm9uZTogTmdab25lLFxuICAgIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybTogTmdGb3JtLFxuICAgIEBPcHRpb25hbCgpIF9wYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcm90ZWN0ZWQgX3BhcmVudEZvcm1GaWVsZDogTWF0TGVnYWN5Rm9ybUZpZWxkLFxuICAgIEBTZWxmKCkgQE9wdGlvbmFsKCkgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTogYW55LFxuICAgIHByaXZhdGUgX2xpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfU0VMRUNUX0NPTkZJRykgcHJpdmF0ZSBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTZWxlY3RDb25maWcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIF9kZWZhdWx0RXJyb3JTdGF0ZU1hdGNoZXIsIF9wYXJlbnRGb3JtLCBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBOb3RlOiB3ZSBwcm92aWRlIHRoZSB2YWx1ZSBhY2Nlc3NvciB0aHJvdWdoIGhlcmUsIGluc3RlYWQgb2ZcbiAgICAgIC8vIHRoZSBgcHJvdmlkZXJzYCB0byBhdm9pZCBydW5uaW5nIGludG8gYSBjaXJjdWxhciBpbXBvcnQuXG4gICAgICB0aGlzLm5nQ29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG5cbiAgICAvLyBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIHNldCB0aGlzIHdoZW4gdGhlIGRlZmF1bHRzIHBhc3MgaXQgaW4sIG90aGVyd2lzZSBpdCBzaG91bGRcbiAgICAvLyBzdGF5IGFzIGB1bmRlZmluZWRgIHNvIHRoYXQgaXQgZmFsbHMgYmFjayB0byB0aGUgZGVmYXVsdCBpbiB0aGUga2V5IG1hbmFnZXIuXG4gICAgaWYgKF9kZWZhdWx0T3B0aW9ucz8udHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gX2RlZmF1bHRPcHRpb25zLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7XG4gICAgfVxuXG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5ID0gc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5O1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5KCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPih0aGlzLm11bHRpcGxlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG5cbiAgICAvLyBXZSBuZWVkIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaGVyZSwgYmVjYXVzZSBzb21lIGJyb3dzZXJzIHdpbGxcbiAgICAvLyBmaXJlIHRoZSBhbmltYXRpb24gZW5kIGV2ZW50IHR3aWNlIGZvciB0aGUgc2FtZSBhbmltYXRpb24uIFNlZTpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbVxuICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmcodGhpcy5wYW5lbE9wZW4pKTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9pbml0S2V5TWFuYWdlcigpO1xuXG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2hhbmdlZC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGV2ZW50LmFkZGVkLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5zZWxlY3QoKSk7XG4gICAgICBldmVudC5yZW1vdmVkLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5kZXNlbGVjdCgpKTtcbiAgICB9KTtcblxuICAgIHRoaXMub3B0aW9ucy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9yZXNldE9wdGlvbnMoKTtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZWxlY3Rpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICBjb25zdCBuZXdBcmlhTGFiZWxsZWRieSA9IHRoaXMuX2dldFRyaWdnZXJBcmlhTGFiZWxsZWRieSgpO1xuICAgIGNvbnN0IG5nQ29udHJvbCA9IHRoaXMubmdDb250cm9sO1xuXG4gICAgLy8gV2UgaGF2ZSB0byBtYW5hZ2Ugc2V0dGluZyB0aGUgYGFyaWEtbGFiZWxsZWRieWAgb3Vyc2VsdmVzLCBiZWNhdXNlIHBhcnQgb2YgaXRzIHZhbHVlXG4gICAgLy8gaXMgY29tcHV0ZWQgYXMgYSByZXN1bHQgb2YgYSBjb250ZW50IHF1ZXJ5IHdoaWNoIGNhbiBjYXVzZSB0aGlzIGJpbmRpbmcgdG8gdHJpZ2dlciBhXG4gICAgLy8gXCJjaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvci5cbiAgICBpZiAobmV3QXJpYUxhYmVsbGVkYnkgIT09IHRoaXMuX3RyaWdnZXJBcmlhTGFiZWxsZWRCeSkge1xuICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLl90cmlnZ2VyQXJpYUxhYmVsbGVkQnkgPSBuZXdBcmlhTGFiZWxsZWRieTtcbiAgICAgIGlmIChuZXdBcmlhTGFiZWxsZWRieSkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgbmV3QXJpYUxhYmVsbGVkYnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZ0NvbnRyb2wpIHtcbiAgICAgIC8vIFRoZSBkaXNhYmxlZCBzdGF0ZSBtaWdodCBnbyBvdXQgb2Ygc3luYyBpZiB0aGUgZm9ybSBncm91cCBpcyBzd2FwcGVkIG91dC4gU2VlICMxNzg2MC5cbiAgICAgIGlmICh0aGlzLl9wcmV2aW91c0NvbnRyb2wgIT09IG5nQ29udHJvbC5jb250cm9sKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLl9wcmV2aW91c0NvbnRyb2wgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIG5nQ29udHJvbC5kaXNhYmxlZCAhPT0gbnVsbCAmJlxuICAgICAgICAgIG5nQ29udHJvbC5kaXNhYmxlZCAhPT0gdGhpcy5kaXNhYmxlZFxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLmRpc2FibGVkID0gbmdDb250cm9sLmRpc2FibGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcHJldmlvdXNDb250cm9sID0gbmdDb250cm9sLmNvbnRyb2w7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAvLyBVcGRhdGluZyB0aGUgZGlzYWJsZWQgc3RhdGUgaXMgaGFuZGxlZCBieSBgbWl4aW5EaXNhYmxlZGAsIGJ1dCB3ZSBuZWVkIHRvIGFkZGl0aW9uYWxseSBsZXRcbiAgICAvLyB0aGUgcGFyZW50IGZvcm0gZmllbGQga25vdyB0byBydW4gY2hhbmdlIGRldGVjdGlvbiB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0ZSBjaGFuZ2VzLlxuICAgIGlmIChjaGFuZ2VzWydkaXNhYmxlZCddIHx8IGNoYW5nZXNbJ3VzZXJBcmlhRGVzY3JpYmVkQnknXSkge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWyd0eXBlYWhlYWREZWJvdW5jZUludGVydmFsJ10gJiYgdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoVHlwZUFoZWFkKHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIG92ZXJsYXkgcGFuZWwgb3BlbiBvciBjbG9zZWQuICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9jYW5PcGVuKCkpIHtcbiAgICAgIHRoaXMuX3BhbmVsT3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24obnVsbCk7XG4gICAgICB0aGlzLl9oaWdobGlnaHRDb3JyZWN0T3B0aW9uKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBvdmVybGF5IHBhbmVsIGFuZCBmb2N1c2VzIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX3BhbmVsT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdCdzIHZhbHVlLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIG1vZGVsLlxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fYXNzaWduVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QgaXMgYmx1cnJlZFxuICAgKiBieSB0aGUgdXNlci4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdG91Y2hlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBzZWxlY3QuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgZ2V0IHNlbGVjdGVkKCk6IE1hdE9wdGlvbiB8IE1hdE9wdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsPy5zZWxlY3RlZCB8fCBbXSA6IHRoaXMuX3NlbGVjdGlvbk1vZGVsPy5zZWxlY3RlZFswXTtcbiAgfVxuXG4gIC8qKiBUaGUgdmFsdWUgZGlzcGxheWVkIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBnZXQgdHJpZ2dlclZhbHVlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkT3B0aW9ucyA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkLm1hcChvcHRpb24gPT4gb3B0aW9uLnZpZXdWYWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLl9pc1J0bCgpKSB7XG4gICAgICAgIHNlbGVjdGVkT3B0aW9ucy5yZXZlcnNlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRPRE8oY3Jpc2JldG8pOiBkZWxpbWl0ZXIgc2hvdWxkIGJlIGNvbmZpZ3VyYWJsZSBmb3IgcHJvcGVyIGxvY2FsaXphdGlvbi5cbiAgICAgIHJldHVybiBzZWxlY3RlZE9wdGlvbnMuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0udmlld1ZhbHVlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaW4gUlRMIG1vZGUuICovXG4gIF9pc1J0bCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYWxsIGtleWRvd24gZXZlbnRzIG9uIHRoZSBzZWxlY3QuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuX2hhbmRsZU9wZW5LZXlkb3duKGV2ZW50KSA6IHRoaXMuX2hhbmRsZUNsb3NlZEtleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGlsZSB0aGUgc2VsZWN0IGlzIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPVxuICAgICAga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fFxuICAgICAga2V5Q29kZSA9PT0gVVBfQVJST1cgfHxcbiAgICAgIGtleUNvZGUgPT09IExFRlRfQVJST1cgfHxcbiAgICAgIGtleUNvZGUgPT09IFJJR0hUX0FSUk9XO1xuICAgIGNvbnN0IGlzT3BlbktleSA9IGtleUNvZGUgPT09IEVOVEVSIHx8IGtleUNvZGUgPT09IFNQQUNFO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gT3BlbiB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgaWYgKFxuICAgICAgKCFtYW5hZ2VyLmlzVHlwaW5nKCkgJiYgaXNPcGVuS2V5ICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHx8XG4gICAgICAoKHRoaXMubXVsdGlwbGUgfHwgZXZlbnQuYWx0S2V5KSAmJiBpc0Fycm93S2V5KVxuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudHMgdGhlIHBhZ2UgZnJvbSBzY3JvbGxpbmcgZG93biB3aGVuIHByZXNzaW5nIHNwYWNlXG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5U2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuXG4gICAgICAvLyBTaW5jZSB0aGUgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIG5lZWQgdG8gYW5ub3VuY2UgaXQgb3Vyc2VsdmVzLlxuICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uICYmIHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiAhPT0gc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgLy8gV2Ugc2V0IGEgZHVyYXRpb24gb24gdGhlIGxpdmUgYW5ub3VuY2VtZW50LCBiZWNhdXNlIHdlIHdhbnQgdGhlIGxpdmUgZWxlbWVudCB0byBiZVxuICAgICAgICAvLyBjbGVhcmVkIGFmdGVyIGEgd2hpbGUgc28gdGhhdCB1c2VycyBjYW4ndCBuYXZpZ2F0ZSB0byBpdCB1c2luZyB0aGUgYXJyb3cga2V5cy5cbiAgICAgICAgdGhpcy5fbGl2ZUFubm91bmNlci5hbm5vdW5jZSgoc2VsZWN0ZWRPcHRpb24gYXMgTWF0T3B0aW9uKS52aWV3VmFsdWUsIDEwMDAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hlbiB0aGUgc2VsZWN0ZWQgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlT3BlbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVztcbiAgICBjb25zdCBpc1R5cGluZyA9IG1hbmFnZXIuaXNUeXBpbmcoKTtcblxuICAgIGlmIChpc0Fycm93S2V5ICYmIGV2ZW50LmFsdEtleSkge1xuICAgICAgLy8gQ2xvc2UgdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGluIHRoaXMgY2FzZSBpZiB0aGUgdXNlciBpcyB0eXBpbmcsXG4gICAgICAvLyBiZWNhdXNlIHRoZSB0eXBpbmcgc2VxdWVuY2UgY2FuIGluY2x1ZGUgdGhlIHNwYWNlIGtleS5cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgIWlzVHlwaW5nICYmXG4gICAgICAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpICYmXG4gICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICFoYXNNb2RpZmllcktleShldmVudClcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgfSBlbHNlIGlmICghaXNUeXBpbmcgJiYgdGhpcy5fbXVsdGlwbGUgJiYga2V5Q29kZSA9PT0gQSAmJiBldmVudC5jdHJsS2V5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFzRGVzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuc29tZShvcHQgPT4gIW9wdC5kaXNhYmxlZCAmJiAhb3B0LnNlbGVjdGVkKTtcblxuICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgICAgICBoYXNEZXNlbGVjdGVkT3B0aW9ucyA/IG9wdGlvbi5zZWxlY3QoKSA6IG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJldmlvdXNseUZvY3VzZWRJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fbXVsdGlwbGUgJiZcbiAgICAgICAgaXNBcnJvd0tleSAmJlxuICAgICAgICBldmVudC5zaGlmdEtleSAmJlxuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzbHlGb2N1c2VkSW5kZXhcbiAgICAgICkge1xuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9mb2N1c2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIHRvdWNoZWQgY2FsbGJhY2sgb25seSBpZiB0aGUgcGFuZWwgaXMgY2xvc2VkLiBPdGhlcndpc2UsIHRoZSB0cmlnZ2VyIHdpbGxcbiAgICogXCJibHVyXCIgdG8gdGhlIHBhbmVsIHdoZW4gaXQgb3BlbnMsIGNhdXNpbmcgYSBmYWxzZSBwb3NpdGl2ZS5cbiAgICovXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5fZm9jdXNlZCA9IGZhbHNlO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIG92ZXJsYXkgcGFuZWwgaGFzIGJlZW4gYXR0YWNoZWQuXG4gICAqL1xuICBfb25BdHRhY2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vdmVybGF5RGlyLnBvc2l0aW9uQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nU2V0dGxlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRoZW1lIHRvIGJlIHVzZWQgb24gdGhlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxUaGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGb3JtRmllbGQgPyBgbWF0LSR7dGhpcy5fcGFyZW50Rm9ybUZpZWxkLmNvbG9yfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3NlbGVjdGlvbk1vZGVsIHx8IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgIC8vIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzIGZyb20gQW5ndWxhci5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMubmdDb250cm9sLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHRoaXMuX3ZhbHVlKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb24gYmFzZWQgb24gYSB2YWx1ZS4gSWYgbm8gb3B0aW9uIGNhbiBiZVxuICAgKiBmb3VuZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHZhbHVlLCB0aGUgc2VsZWN0IHRyaWdnZXIgaXMgY2xlYXJlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWQuZm9yRWFjaChvcHRpb24gPT4gb3B0aW9uLnNldEluYWN0aXZlU3R5bGVzKCkpO1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB2YWx1ZSkge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25BcnJheVZhbHVlRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgdmFsdWUuZm9yRWFjaCgoY3VycmVudFZhbHVlOiBhbnkpID0+IHRoaXMuX3NlbGVjdE9wdGlvbkJ5VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdPcHRpb24gPSB0aGlzLl9zZWxlY3RPcHRpb25CeVZhbHVlKHZhbHVlKTtcblxuICAgICAgLy8gU2hpZnQgZm9jdXMgdG8gdGhlIGFjdGl2ZSBpdGVtLiBOb3RlIHRoYXQgd2Ugc2hvdWxkbid0IGRvIHRoaXMgaW4gbXVsdGlwbGVcbiAgICAgIC8vIG1vZGUsIGJlY2F1c2Ugd2UgZG9uJ3Qga25vdyB3aGF0IG9wdGlvbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggbGFzdC5cbiAgICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSByZXNldCB0aGUgaGlnaGxpZ2h0ZWQgb3B0aW9uLiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXMgd2hpbGVcbiAgICAgICAgLy8gY2xvc2VkLCBiZWNhdXNlIGRvaW5nIGl0IHdoaWxlIG9wZW4gY2FuIHNoaWZ0IHRoZSB1c2VyJ3MgZm9jdXMgdW5uZWNlc3NhcmlseS5cbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBhbmQgc2VsZWN0cyBhbmQgb3B0aW9uIGJhc2VkIG9uIGl0cyB2YWx1ZS5cbiAgICogQHJldHVybnMgT3B0aW9uIHRoYXQgaGFzIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlLlxuICAgKi9cbiAgcHJpdmF0ZSBfc2VsZWN0T3B0aW9uQnlWYWx1ZSh2YWx1ZTogYW55KTogTWF0T3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQoKG9wdGlvbjogTWF0T3B0aW9uKSA9PiB7XG4gICAgICAvLyBTa2lwIG9wdGlvbnMgdGhhdCBhcmUgYWxyZWFkeSBpbiB0aGUgbW9kZWwuIFRoaXMgYWxsb3dzIHVzIHRvIGhhbmRsZSBjYXNlc1xuICAgICAgLy8gd2hlcmUgdGhlIHNhbWUgcHJpbWl0aXZlIHZhbHVlIGlzIHNlbGVjdGVkIG11bHRpcGxlIHRpbWVzLlxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRyZWF0IG51bGwgYXMgYSBzcGVjaWFsIHJlc2V0IHZhbHVlLlxuICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlICE9IG51bGwgJiYgdGhpcy5fY29tcGFyZVdpdGgob3B0aW9uLnZhbHVlLCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgICAgLy8gTm90aWZ5IGRldmVsb3BlcnMgb2YgZXJyb3JzIGluIHRoZWlyIGNvbXBhcmF0b3IuXG4gICAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KGNvcnJlc3BvbmRpbmdPcHRpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBjb3JyZXNwb25kaW5nT3B0aW9uO1xuICB9XG5cbiAgLyoqIEFzc2lnbnMgYSBzcGVjaWZpYyB2YWx1ZSB0byB0aGUgc2VsZWN0LiBSZXR1cm5zIHdoZXRoZXIgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuICBwcml2YXRlIF9hc3NpZ25WYWx1ZShuZXdWYWx1ZTogYW55IHwgYW55W10pOiBib29sZWFuIHtcbiAgICAvLyBBbHdheXMgcmUtYXNzaWduIGFuIGFycmF5LCBiZWNhdXNlIGl0IG1pZ2h0IGhhdmUgYmVlbiBtdXRhdGVkLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUgfHwgKHRoaXMuX211bHRpcGxlICYmIEFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhbJ3NoaWZ0S2V5J10pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci50YWJPdXQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gU2VsZWN0IHRoZSBhY3RpdmUgaXRlbSB3aGVuIHRhYmJpbmcgYXdheS4gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggaG93IHRoZSBuYXRpdmVcbiAgICAgICAgLy8gc2VsZWN0IGJlaGF2ZXMuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuXG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXN0b3JlIGZvY3VzIHRvIHRoZSB0cmlnZ2VyIGJlZm9yZSBjbG9zaW5nLiBFbnN1cmVzIHRoYXQgdGhlIGZvY3VzXG4gICAgICAgIC8vIHBvc2l0aW9uIHdvbid0IGJlIGxvc3QgaWYgdGhlIHVzZXIgZ290IGZvY3VzIGludG8gdGhlIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fcGFuZWxPcGVuICYmIHRoaXMucGFuZWwpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsT3B0aW9uSW50b1ZpZXcodGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXggfHwgMCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9wYW5lbE9wZW4gJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBEcm9wcyBjdXJyZW50IG9wdGlvbiBzdWJzY3JpcHRpb25zIGFuZCBJRHMgYW5kIHJlc2V0cyBmcm9tIHNjcmF0Y2guICovXG4gIHByaXZhdGUgX3Jlc2V0T3B0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkT3JEZXN0cm95ZWQgPSBtZXJnZSh0aGlzLm9wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSk7XG5cbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuX29uU2VsZWN0KGV2ZW50LnNvdXJjZSwgZXZlbnQuaXNVc2VySW5wdXQpO1xuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBvcHRpb25zIGFuZCByZWFjdCBhY2NvcmRpbmdseS5cbiAgICAvLyBIYW5kbGVzIGNhc2VzIGxpa2UgdGhlIGxhYmVscyBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucyBjaGFuZ2luZy5cbiAgICBtZXJnZSguLi50aGlzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uX3N0YXRlQ2hhbmdlcykpXG4gICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogSW52b2tlZCB3aGVuIGFuIG9wdGlvbiBpcyBjbGlja2VkLiAqL1xuICBwcml2YXRlIF9vblNlbGVjdChvcHRpb246IE1hdE9wdGlvbiwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB3YXNTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb24udmFsdWUgPT0gbnVsbCAmJiAhdGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcblxuICAgICAgaWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKG9wdGlvbi52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZFxuICAgICAgICAgID8gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KG9wdGlvbilcbiAgICAgICAgICA6IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmRlc2VsZWN0KG9wdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1VzZXJJbnB1dCkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0ob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5fc29ydFZhbHVlcygpO1xuXG4gICAgICAgIGlmIChpc1VzZXJJbnB1dCkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIHVzZXIgc2VsZWN0ZWQgdGhlIG9wdGlvbiB3aXRoIHRoZWlyIG1vdXNlLCB3ZVxuICAgICAgICAgIC8vIHdhbnQgdG8gcmVzdG9yZSBmb2N1cyBiYWNrIHRvIHRoZSB0cmlnZ2VyLCBpbiBvcmRlciB0b1xuICAgICAgICAgIC8vIHByZXZlbnQgdGhlIHNlbGVjdCBrZXlib2FyZCBjb250cm9scyBmcm9tIGNsYXNoaW5nIHdpdGhcbiAgICAgICAgICAvLyB0aGUgb25lcyBmcm9tIGBtYXQtb3B0aW9uYC5cbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2FzU2VsZWN0ZWQgIT09IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKSkge1xuICAgICAgdGhpcy5fcHJvcGFnYXRlQ2hhbmdlcygpO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBTb3J0cyB0aGUgc2VsZWN0ZWQgdmFsdWVzIGluIHRoZSBzZWxlY3RlZCBiYXNlZCBvbiB0aGVpciBvcmRlciBpbiB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgX3NvcnRWYWx1ZXMoKSB7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMudG9BcnJheSgpO1xuXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvcnRDb21wYXJhdG9yXG4gICAgICAgICAgPyB0aGlzLnNvcnRDb21wYXJhdG9yKGEsIGIsIG9wdGlvbnMpXG4gICAgICAgICAgOiBvcHRpb25zLmluZGV4T2YoYSkgLSBvcHRpb25zLmluZGV4T2YoYik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIHNldCB0aGUgbW9kZWwgdmFsdWUuICovXG4gIHByaXZhdGUgX3Byb3BhZ2F0ZUNoYW5nZXMoZmFsbGJhY2tWYWx1ZT86IGFueSk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbltdKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbikudmFsdWUgOiBmYWxsYmFja1ZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLl9nZXRDaGFuZ2VFdmVudCh2YWx1ZVRvRW1pdCkpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgdGhlIHNlbGVjdGVkIGl0ZW0uIElmIG5vIG9wdGlvbiBpcyBzZWxlY3RlZCwgaXQgd2lsbCBoaWdobGlnaHRcbiAgICogdGhlIGZpcnN0IGl0ZW0gaW5zdGVhZC5cbiAgICovXG4gIHByaXZhdGUgX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBpcyBhbGxvd2VkIHRvIG9wZW4uICovXG4gIHByb3RlY3RlZCBfY2FuT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3BhbmVsT3BlbiAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLm9wdGlvbnM/Lmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2VsZWN0IGVsZW1lbnQuICovXG4gIGZvY3VzKG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMob3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGZvciB0aGUgc2VsZWN0IHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsSWQgPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQ/LmdldExhYmVsSWQoKTtcbiAgICBjb25zdCBsYWJlbEV4cHJlc3Npb24gPSBsYWJlbElkID8gbGFiZWxJZCArICcgJyA6ICcnO1xuICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbGxlZGJ5ID8gbGFiZWxFeHByZXNzaW9uICsgdGhpcy5hcmlhTGFiZWxsZWRieSA6IGxhYmVsSWQ7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB0aGUgYGFyaWEtYWN0aXZlZGVzY2VuZGFudGAgdG8gYmUgc2V0IG9uIHRoZSBob3N0LiAqL1xuICBfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMucGFuZWxPcGVuICYmIHRoaXMuX2tleU1hbmFnZXIgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFyaWEtbGFiZWxsZWRieSBvZiB0aGUgc2VsZWN0IGNvbXBvbmVudCB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9nZXRUcmlnZ2VyQXJpYUxhYmVsbGVkYnkoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbElkID0gdGhpcy5fcGFyZW50Rm9ybUZpZWxkPy5nZXRMYWJlbElkKCk7XG4gICAgbGV0IHZhbHVlID0gKGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJycpICsgdGhpcy5fdmFsdWVJZDtcblxuICAgIGlmICh0aGlzLmFyaWFMYWJlbGxlZGJ5KSB7XG4gICAgICB2YWx1ZSArPSAnICcgKyB0aGlzLmFyaWFMYWJlbGxlZGJ5O1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgb3ZlcmxheSBwYW5lbCBpcyBkb25lIGFuaW1hdGluZy4gKi9cbiAgcHJvdGVjdGVkIF9wYW5lbERvbmVBbmltYXRpbmcoaXNPcGVuOiBib29sZWFuKSB7XG4gICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdChpc09wZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIGlmIChpZHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgaWRzLmpvaW4oJyAnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgICB0aGlzLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW4gfHwgIXRoaXMuZW1wdHkgfHwgKHRoaXMuX2ZvY3VzZWQgJiYgISF0aGlzLl9wbGFjZWhvbGRlcik7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICdzZWxlY3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzZWxlY3QuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnY29tYm9ib3gnLFxuICAgICdhcmlhLWF1dG9jb21wbGV0ZSc6ICdub25lJyxcbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhlIHZhbHVlIGZvciBhcmlhLWhhc3BvcHVwIHNob3VsZCBiZSBgbGlzdGJveGAsIGJ1dCBjdXJyZW50bHkgaXQncyBkaWZmaWN1bHRcbiAgICAvLyB0byBzeW5jIGludG8gR29vZ2xlLCBiZWNhdXNlIG9mIGFuIG91dGRhdGVkIGF1dG9tYXRlZCBhMTF5IGNoZWNrIHdoaWNoIGZsYWdzIGl0IGFzIGFuIGludmFsaWRcbiAgICAvLyB2YWx1ZS4gQXQgc29tZSBwb2ludCB3ZSBzaG91bGQgdHJ5IHRvIHN3aXRjaCBpdCBiYWNrIHRvIGJlaW5nIGBsaXN0Ym94YC5cbiAgICAnYXJpYS1oYXNwb3B1cCc6ICd0cnVlJyxcbiAgICAnY2xhc3MnOiAnbWF0LXNlbGVjdCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ3BhbmVsT3BlbiA/IGlkICsgXCItcGFuZWxcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdwYW5lbE9wZW4nLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWludmFsaWRdJzogJ2Vycm9yU3RhdGUnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1lbXB0eV0nOiAnZW1wdHknLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1tdWx0aXBsZV0nOiAnbXVsdGlwbGUnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICB9LFxuICBhbmltYXRpb25zOiBbbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFdyYXAsIG1hdFNlbGVjdEFuaW1hdGlvbnMudHJhbnNmb3JtUGFuZWxdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0TGVnYWN5Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdCBleHRlbmRzIF9NYXRTZWxlY3RCYXNlPE1hdFNlbGVjdENoYW5nZT4gaW1wbGVtZW50cyBPbkluaXQge1xuICAvKiogVGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgb3ZlcmxheSBwYW5lbCwgY2FsY3VsYXRlZCB0byBjZW50ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsVG9wID0gMDtcblxuICAvKiogVGhlIGxhc3QgbWVhc3VyZWQgdmFsdWUgZm9yIHRoZSB0cmlnZ2VyJ3MgY2xpZW50IGJvdW5kaW5nIHJlY3QuICovXG4gIF90cmlnZ2VyUmVjdDogQ2xpZW50UmVjdDtcblxuICAvKiogVGhlIGNhY2hlZCBmb250LXNpemUgb2YgdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgX3RyaWdnZXJGb250U2l6ZSA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IHBhbmVsJ3MgdHJhbnNmb3JtLW9yaWdpbiBwcm9wZXJ0eS4gKi9cbiAgX3RyYW5zZm9ybU9yaWdpbjogc3RyaW5nID0gJ3RvcCc7XG5cbiAgLyoqXG4gICAqIFRoZSB5LW9mZnNldCBvZiB0aGUgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGUgdHJpZ2dlcidzIHRvcCBzdGFydCBjb3JuZXIuXG4gICAqIFRoaXMgbXVzdCBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIHRleHQgb3ZlciB0aGUgdHJpZ2dlciB0ZXh0LlxuICAgKiB3aGVuIHRoZSBwYW5lbCBvcGVucy4gV2lsbCBjaGFuZ2UgYmFzZWQgb24gdGhlIHktcG9zaXRpb24gb2YgdGhlIHNlbGVjdGVkIG9wdGlvbi5cbiAgICovXG4gIF9vZmZzZXRZID0gMDtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfT1BUR1JPVVAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICBAQ29udGVudENoaWxkKE1BVF9TRUxFQ1RfVFJJR0dFUikgY3VzdG9tVHJpZ2dlcjogTWF0U2VsZWN0VHJpZ2dlcjtcblxuICBfcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgIH0sXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgfSxcbiAgXTtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLlxuICAgKlxuICAgKiBBdHRlbXB0cyB0byBjZW50ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGUgcGFuZWwuIElmIHRoZSBvcHRpb24gaXNcbiAgICogdG9vIGhpZ2ggb3IgdG9vIGxvdyBpbiB0aGUgcGFuZWwgdG8gYmUgc2Nyb2xsZWQgdG8gdGhlIGNlbnRlciwgaXQgY2xhbXBzIHRoZVxuICAgKiBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIG1pbiBvciBtYXggc2Nyb2xsIHBvc2l0aW9ucyByZXNwZWN0aXZlbHkuXG4gICAqL1xuICBfY2FsY3VsYXRlT3ZlcmxheVNjcm9sbChzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEJ1ZmZlcjogbnVtYmVyLCBtYXhTY3JvbGw6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wID0gaXRlbUhlaWdodCAqIHNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaGFsZk9wdGlvbkhlaWdodCA9IGl0ZW1IZWlnaHQgLyAyO1xuXG4gICAgLy8gU3RhcnRzIGF0IHRoZSBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wLCB3aGljaCBzY3JvbGxzIHRoZSBvcHRpb24gdG8gdGhlIHRvcCBvZiB0aGVcbiAgICAvLyBzY3JvbGwgY29udGFpbmVyLCB0aGVuIHN1YnRyYWN0cyB0aGUgc2Nyb2xsIGJ1ZmZlciB0byBzY3JvbGwgdGhlIG9wdGlvbiBkb3duIHRvXG4gICAgLy8gdGhlIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSGFsZiB0aGUgb3B0aW9uIGhlaWdodCBtdXN0IGJlIHJlLWFkZGVkIHRvIHRoZVxuICAgIC8vIHNjcm9sbFRvcCBzbyB0aGUgb3B0aW9uIGlzIGNlbnRlcmVkIGJhc2VkIG9uIGl0cyBtaWRkbGUsIG5vdCBpdHMgdG9wIGVkZ2UuXG4gICAgY29uc3Qgb3B0aW1hbFNjcm9sbFBvc2l0aW9uID0gb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCAtIHNjcm9sbEJ1ZmZlciArIGhhbGZPcHRpb25IZWlnaHQ7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KDAsIG9wdGltYWxTY3JvbGxQb3NpdGlvbiksIG1heFNjcm9sbCk7XG4gIH1cblxuICBvdmVycmlkZSBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIHRoaXMuX3ZpZXdwb3J0UnVsZXJcbiAgICAgIC5jaGFuZ2UoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgb3ZlcnJpZGUgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAoc3VwZXIuX2Nhbk9wZW4oKSkge1xuICAgICAgc3VwZXIub3BlbigpO1xuICAgICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21wdXRlZCBmb250LXNpemUgd2lsbCBiZSBhIHN0cmluZyBwaXhlbCB2YWx1ZSAoZS5nLiBcIjE2cHhcIikuXG4gICAgICAvLyBgcGFyc2VJbnRgIGlnbm9yZXMgdGhlIHRyYWlsaW5nICdweCcgYW5kIGNvbnZlcnRzIHRoaXMgdG8gYSBudW1iZXIuXG4gICAgICB0aGlzLl90cmlnZ2VyRm9udFNpemUgPSBwYXJzZUludChcbiAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudCkuZm9udFNpemUgfHwgJzAnLFxuICAgICAgKTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpO1xuXG4gICAgICAvLyBTZXQgdGhlIGZvbnQgc2l6ZSBvbiB0aGUgcGFuZWwgZWxlbWVudCBvbmNlIGl0IGV4aXN0cy5cbiAgICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyRm9udFNpemUgJiZcbiAgICAgICAgICB0aGlzLl9vdmVybGF5RGlyLm92ZXJsYXlSZWYgJiZcbiAgICAgICAgICB0aGlzLl9vdmVybGF5RGlyLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LnN0eWxlLmZvbnRTaXplID0gYCR7dGhpcy5fdHJpZ2dlckZvbnRTaXplfXB4YDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFNjcm9sbHMgdGhlIGFjdGl2ZSBvcHRpb24gaW50byB2aWV3LiAqL1xuICBwcm90ZWN0ZWQgX3Njcm9sbE9wdGlvbkludG9WaWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oaW5kZXgsIHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25Hcm91cHMpO1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG5cbiAgICBpZiAoaW5kZXggPT09IDAgJiYgbGFiZWxDb3VudCA9PT0gMSkge1xuICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAvLyBzY3JvbGwgdGhlIGxpc3QgdG8gdGhlIHRvcC4gVGhpcyBpcyBiZXR0ZXIgVVggdGhhbiBzY3JvbGxpbmcgdGhlIGxpc3QgdG8gdGhlXG4gICAgICAvLyB0b3Agb2YgdGhlIG9wdGlvbiwgYmVjYXVzZSBpdCBhbGxvd3MgdGhlIHVzZXIgdG8gcmVhZCB0aGUgdG9wIGdyb3VwJ3MgbGFiZWwuXG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgICAgKGluZGV4ICsgbGFiZWxDb3VudCkgKiBpdGVtSGVpZ2h0LFxuICAgICAgICBpdGVtSGVpZ2h0LFxuICAgICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgICBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9wb3NpdGlvbmluZ1NldHRsZWQoKSB7XG4gICAgdGhpcy5fY2FsY3VsYXRlT3ZlcmxheU9mZnNldFgoKTtcbiAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9wYW5lbERvbmVBbmltYXRpbmcoaXNPcGVuOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vdmVybGF5RGlyLm9mZnNldFggPSAwO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgc3VwZXIuX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW4pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9nZXRDaGFuZ2VFdmVudCh2YWx1ZTogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBNYXRTZWxlY3RDaGFuZ2UodGhpcywgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgtb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQgd2hlblxuICAgKiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIExUUiBvciBSVEwgdGV4dCBkaXJlY3Rpb24uIE5vdGUgdGhhdCB0aGUgb2Zmc2V0XG4gICAqIGNhbid0IGJlIGNhbGN1bGF0ZWQgdW50aWwgdGhlIHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGVcbiAgICogY29udGVudCB3aWR0aCBpbiBvcmRlciB0byBjb25zdHJhaW4gdGhlIHBhbmVsIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5UmVjdCA9IHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB2aWV3cG9ydFNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2l6ZSgpO1xuICAgIGNvbnN0IGlzUnRsID0gdGhpcy5faXNSdGwoKTtcbiAgICBjb25zdCBwYWRkaW5nV2lkdGggPSB0aGlzLm11bHRpcGxlXG4gICAgICA/IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggKyBTRUxFQ1RfUEFORUxfUEFERElOR19YXG4gICAgICA6IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuICAgIGxldCBvZmZzZXRYOiBudW1iZXI7XG5cbiAgICAvLyBBZGp1c3QgdGhlIG9mZnNldCwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb24gcGFkZGluZy5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgb2Zmc2V0WCA9IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1g7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRpc2FibGVPcHRpb25DZW50ZXJpbmcpIHtcbiAgICAgIG9mZnNldFggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSB8fCB0aGlzLm9wdGlvbnMuZmlyc3Q7XG4gICAgICBvZmZzZXRYID0gc2VsZWN0ZWQgJiYgc2VsZWN0ZWQuZ3JvdXAgPyBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWCA6IFNFTEVDVF9QQU5FTF9QQURESU5HX1g7XG4gICAgfVxuXG4gICAgLy8gSW52ZXJ0IHRoZSBvZmZzZXQgaW4gTFRSLlxuICAgIGlmICghaXNSdGwpIHtcbiAgICAgIG9mZnNldFggKj0gLTE7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIGhvdyBtdWNoIHRoZSBzZWxlY3Qgb3ZlcmZsb3dzIG9uIGVhY2ggc2lkZS5cbiAgICBjb25zdCBsZWZ0T3ZlcmZsb3cgPSAwIC0gKG92ZXJsYXlSZWN0LmxlZnQgKyBvZmZzZXRYIC0gKGlzUnRsID8gcGFkZGluZ1dpZHRoIDogMCkpO1xuICAgIGNvbnN0IHJpZ2h0T3ZlcmZsb3cgPVxuICAgICAgb3ZlcmxheVJlY3QucmlnaHQgKyBvZmZzZXRYIC0gdmlld3BvcnRTaXplLndpZHRoICsgKGlzUnRsID8gMCA6IHBhZGRpbmdXaWR0aCk7XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBvdmVyZmxvd3Mgb24gZWl0aGVyIHNpZGUsIHJlZHVjZSB0aGUgb2Zmc2V0IHRvIGFsbG93IGl0IHRvIGZpdC5cbiAgICBpZiAobGVmdE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCArPSBsZWZ0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9IGVsc2UgaWYgKHJpZ2h0T3ZlcmZsb3cgPiAwKSB7XG4gICAgICBvZmZzZXRYIC09IHJpZ2h0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG9mZnNldCBkaXJlY3RseSBpbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gZ28gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uIGFuZFxuICAgIC8vIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgXCJjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzLiBSb3VuZCB0aGUgdmFsdWUgdG8gYXZvaWRcbiAgICAvLyBibHVycnkgY29udGVudCBpbiBzb21lIGJyb3dzZXJzLlxuICAgIHRoaXMuX292ZXJsYXlEaXIub2Zmc2V0WCA9IE1hdGgucm91bmQob2Zmc2V0WCk7XG4gICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgeS1vZmZzZXQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlXG4gICAqIHRvcCBzdGFydCBjb3JuZXIgb2YgdGhlIHRyaWdnZXIuIEl0IGhhcyB0byBiZSBhZGp1c3RlZCBpbiBvcmRlciBmb3IgdGhlXG4gICAqIHNlbGVjdGVkIG9wdGlvbiB0byBiZSBhbGlnbmVkIG92ZXIgdGhlIHRyaWdnZXIgd2hlbiB0aGUgcGFuZWwgb3BlbnMuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WShcbiAgICBzZWxlY3RlZEluZGV4OiBudW1iZXIsXG4gICAgc2Nyb2xsQnVmZmVyOiBudW1iZXIsXG4gICAgbWF4U2Nyb2xsOiBudW1iZXIsXG4gICk6IG51bWJlciB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25IZWlnaHRBZGp1c3RtZW50ID0gKGl0ZW1IZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5oZWlnaHQpIC8gMjtcbiAgICBjb25zdCBtYXhPcHRpb25zRGlzcGxheWVkID0gTWF0aC5mbG9vcihTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAvIGl0ZW1IZWlnaHQpO1xuICAgIGxldCBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3A6IG51bWJlcjtcblxuICAgIC8vIERpc2FibGUgb2Zmc2V0IGlmIHJlcXVlc3RlZCBieSB1c2VyIGJ5IHJldHVybmluZyAwIGFzIHZhbHVlIHRvIG9mZnNldFxuICAgIGlmICh0aGlzLmRpc2FibGVPcHRpb25DZW50ZXJpbmcpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zY3JvbGxUb3AgPT09IDApIHtcbiAgICAgIG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCA9IHNlbGVjdGVkSW5kZXggKiBpdGVtSGVpZ2h0O1xuICAgIH0gZWxzZSBpZiAodGhpcy5fc2Nyb2xsVG9wID09PSBtYXhTY3JvbGwpIHtcbiAgICAgIGNvbnN0IGZpcnN0RGlzcGxheWVkSW5kZXggPSB0aGlzLl9nZXRJdGVtQ291bnQoKSAtIG1heE9wdGlvbnNEaXNwbGF5ZWQ7XG4gICAgICBjb25zdCBzZWxlY3RlZERpc3BsYXlJbmRleCA9IHNlbGVjdGVkSW5kZXggLSBmaXJzdERpc3BsYXllZEluZGV4O1xuXG4gICAgICAvLyBUaGUgZmlyc3QgaXRlbSBpcyBwYXJ0aWFsbHkgb3V0IG9mIHRoZSB2aWV3cG9ydC4gVGhlcmVmb3JlIHdlIG5lZWQgdG8gY2FsY3VsYXRlIHdoYXRcbiAgICAgIC8vIHBvcnRpb24gb2YgaXQgaXMgc2hvd24gaW4gdGhlIHZpZXdwb3J0IGFuZCBhY2NvdW50IGZvciBpdCBpbiBvdXIgb2Zmc2V0LlxuICAgICAgbGV0IHBhcnRpYWxJdGVtSGVpZ2h0ID1cbiAgICAgICAgaXRlbUhlaWdodCAtICgodGhpcy5fZ2V0SXRlbUNvdW50KCkgKiBpdGVtSGVpZ2h0IC0gU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpICUgaXRlbUhlaWdodCk7XG5cbiAgICAgIC8vIEJlY2F1c2UgdGhlIHBhbmVsIGhlaWdodCBpcyBsb25nZXIgdGhhbiB0aGUgaGVpZ2h0IG9mIHRoZSBvcHRpb25zIGFsb25lLFxuICAgICAgLy8gdGhlcmUgaXMgYWx3YXlzIGV4dHJhIHBhZGRpbmcgYXQgdGhlIHRvcCBvciBib3R0b20gb2YgdGhlIHBhbmVsLiBXaGVuXG4gICAgICAvLyBzY3JvbGxlZCB0byB0aGUgdmVyeSBib3R0b20sIHRoaXMgcGFkZGluZyBpcyBhdCB0aGUgdG9wIG9mIHRoZSBwYW5lbCBhbmRcbiAgICAgIC8vIG11c3QgYmUgYWRkZWQgdG8gdGhlIG9mZnNldC5cbiAgICAgIG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCA9IHNlbGVjdGVkRGlzcGxheUluZGV4ICogaXRlbUhlaWdodCArIHBhcnRpYWxJdGVtSGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGUgb3B0aW9uIHdhcyBzY3JvbGxlZCB0byB0aGUgbWlkZGxlIG9mIHRoZSBwYW5lbCB1c2luZyBhIHNjcm9sbCBidWZmZXIsXG4gICAgICAvLyBpdHMgb2Zmc2V0IHdpbGwgYmUgdGhlIHNjcm9sbCBidWZmZXIgbWludXMgdGhlIGhhbGYgaGVpZ2h0IHRoYXQgd2FzIGFkZGVkIHRvXG4gICAgICAvLyBjZW50ZXIgaXQuXG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzY3JvbGxCdWZmZXIgLSBpdGVtSGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZmluYWwgb2Zmc2V0IGlzIHRoZSBvcHRpb24ncyBvZmZzZXQgZnJvbSB0aGUgdG9wLCBhZGp1c3RlZCBmb3IgdGhlIGhlaWdodCBkaWZmZXJlbmNlLFxuICAgIC8vIG11bHRpcGxpZWQgYnkgLTEgdG8gZW5zdXJlIHRoYXQgdGhlIG92ZXJsYXkgbW92ZXMgaW4gdGhlIGNvcnJlY3QgZGlyZWN0aW9uIHVwIHRoZSBwYWdlLlxuICAgIC8vIFRoZSB2YWx1ZSBpcyByb3VuZGVkIHRvIHByZXZlbnQgc29tZSBicm93c2VycyBmcm9tIGJsdXJyaW5nIHRoZSBjb250ZW50LlxuICAgIHJldHVybiBNYXRoLnJvdW5kKG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCAqIC0xIC0gb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoYXQgdGhlIGF0dGVtcHRlZCBvdmVybGF5IHBvc2l0aW9uIHdpbGwgZml0IHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqIElmIGl0IHdpbGwgbm90IGZpdCwgdHJpZXMgdG8gYWRqdXN0IHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHRoZSBhc3NvY2lhdGVkXG4gICAqIHktb2Zmc2V0IHNvIHRoZSBwYW5lbCBjYW4gb3BlbiBmdWxseSBvbi1zY3JlZW4uIElmIGl0IHN0aWxsIHdvbid0IGZpdCxcbiAgICogc2V0cyB0aGUgb2Zmc2V0IGJhY2sgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb24gdG8gdGFrZSBvdmVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tPdmVybGF5V2l0aGluVmlld3BvcnQobWF4U2Nyb2xsOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IHZpZXdwb3J0U2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG5cbiAgICBjb25zdCB0b3BTcGFjZUF2YWlsYWJsZSA9IHRoaXMuX3RyaWdnZXJSZWN0LnRvcCAtIFNFTEVDVF9QQU5FTF9WSUVXUE9SVF9QQURESU5HO1xuICAgIGNvbnN0IGJvdHRvbVNwYWNlQXZhaWxhYmxlID1cbiAgICAgIHZpZXdwb3J0U2l6ZS5oZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5ib3R0b20gLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcblxuICAgIGNvbnN0IHBhbmVsSGVpZ2h0VG9wID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSk7XG4gICAgY29uc3QgdG90YWxQYW5lbEhlaWdodCA9IE1hdGgubWluKHRoaXMuX2dldEl0ZW1Db3VudCgpICogaXRlbUhlaWdodCwgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0Qm90dG9tID0gdG90YWxQYW5lbEhlaWdodCAtIHBhbmVsSGVpZ2h0VG9wIC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0O1xuXG4gICAgaWYgKHBhbmVsSGVpZ2h0Qm90dG9tID4gYm90dG9tU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuX2FkanVzdFBhbmVsVXAocGFuZWxIZWlnaHRCb3R0b20sIGJvdHRvbVNwYWNlQXZhaWxhYmxlKTtcbiAgICB9IGVsc2UgaWYgKHBhbmVsSGVpZ2h0VG9wID4gdG9wU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuX2FkanVzdFBhbmVsRG93bihwYW5lbEhlaWdodFRvcCwgdG9wU3BhY2VBdmFpbGFibGUsIG1heFNjcm9sbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRqdXN0cyB0aGUgb3ZlcmxheSBwYW5lbCB1cCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tOiBudW1iZXIsIGJvdHRvbVNwYWNlQXZhaWxhYmxlOiBudW1iZXIpIHtcbiAgICAvLyBCcm93c2VycyBpZ25vcmUgZnJhY3Rpb25hbCBzY3JvbGwgb2Zmc2V0cywgc28gd2UgbmVlZCB0byByb3VuZC5cbiAgICBjb25zdCBkaXN0YW5jZUJlbG93Vmlld3BvcnQgPSBNYXRoLnJvdW5kKHBhbmVsSGVpZ2h0Qm90dG9tIC0gYm90dG9tU3BhY2VBdmFpbGFibGUpO1xuXG4gICAgLy8gU2Nyb2xscyB0aGUgcGFuZWwgdXAgYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgdXAgaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgdG9wLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGUgcGFuZWxcbiAgICAvLyBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2VcbiAgICAvLyBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA8PSAwKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIGJvdHRvbSAwcHhgO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIGRvd24gdG8gZml0IGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wOiBudW1iZXIsIHRvcFNwYWNlQXZhaWxhYmxlOiBudW1iZXIsIG1heFNjcm9sbDogbnVtYmVyKSB7XG4gICAgLy8gQnJvd3NlcnMgaWdub3JlIGZyYWN0aW9uYWwgc2Nyb2xsIG9mZnNldHMsIHNvIHdlIG5lZWQgdG8gcm91bmQuXG4gICAgY29uc3QgZGlzdGFuY2VBYm92ZVZpZXdwb3J0ID0gTWF0aC5yb3VuZChwYW5lbEhlaWdodFRvcCAtIHRvcFNwYWNlQXZhaWxhYmxlKTtcblxuICAgIC8vIFNjcm9sbHMgdGhlIHBhbmVsIGRvd24gYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgZG93biBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICB0aGlzLl9zY3JvbGxUb3AgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX29mZnNldFkgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcblxuICAgIC8vIElmIHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgdmVyeSBib3R0b20sIGl0IHdvbid0IGJlIGFibGUgdG8gZml0IHRoZVxuICAgIC8vIHBhbmVsIGJ5IHNjcm9sbGluZywgc28gc2V0IHRoZSBvZmZzZXQgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb25cbiAgICAvLyB0byB0YWtlIGVmZmVjdC5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gbWF4U2Nyb2xsO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIHRvcCAwcHhgO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHgtIGFuZCB5LW9mZnNldHMgb2YgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbUNvdW50KCk7XG4gICAgY29uc3QgcGFuZWxIZWlnaHQgPSBNYXRoLm1pbihpdGVtcyAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBzY3JvbGxDb250YWluZXJIZWlnaHQgPSBpdGVtcyAqIGl0ZW1IZWlnaHQ7XG5cbiAgICAvLyBUaGUgZmFydGhlc3QgdGhlIHBhbmVsIGNhbiBiZSBzY3JvbGxlZCBiZWZvcmUgaXQgaGl0cyB0aGUgYm90dG9tXG4gICAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsQ29udGFpbmVySGVpZ2h0IC0gcGFuZWxIZWlnaHQ7XG5cbiAgICAvLyBJZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCB3ZSBvcGVuIHRoZSBwb3B1cCB0byB0aGUgZmlyc3QgaXRlbS5cbiAgICBsZXQgc2VsZWN0ZWRPcHRpb25PZmZzZXQ6IG51bWJlcjtcblxuICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkT3B0aW9uT2Zmc2V0ID0gTWF0aC5tYXgoXG4gICAgICAgIHRoaXMub3B0aW9ucy50b0FycmF5KCkuaW5kZXhPZih0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSksXG4gICAgICAgIDAsXG4gICAgICApO1xuICAgIH1cblxuICAgIHNlbGVjdGVkT3B0aW9uT2Zmc2V0ICs9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKFxuICAgICAgc2VsZWN0ZWRPcHRpb25PZmZzZXQsXG4gICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICB0aGlzLm9wdGlvbkdyb3VwcyxcbiAgICApO1xuXG4gICAgLy8gV2UgbXVzdCBtYWludGFpbiBhIHNjcm9sbCBidWZmZXIgc28gdGhlIHNlbGVjdGVkIG9wdGlvbiB3aWxsIGJlIHNjcm9sbGVkIHRvIHRoZVxuICAgIC8vIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbCByYXRoZXIgdGhhbiB0aGUgdG9wLlxuICAgIGNvbnN0IHNjcm9sbEJ1ZmZlciA9IHBhbmVsSGVpZ2h0IC8gMjtcbiAgICB0aGlzLl9zY3JvbGxUb3AgPSB0aGlzLl9jYWxjdWxhdGVPdmVybGF5U2Nyb2xsKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG4gICAgdGhpcy5fb2Zmc2V0WSA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG5cbiAgICB0aGlzLl9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGwpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHRyYW5zZm9ybSBvcmlnaW4gcG9pbnQgYmFzZWQgb24gdGhlIHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3JpZ2luQmFzZWRPbk9wdGlvbigpOiBzdHJpbmcge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3Qgb3JpZ2luWSA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpIC0gb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCArIGl0ZW1IZWlnaHQgLyAyO1xuICAgIHJldHVybiBgNTAlICR7b3JpZ2luWX1weCAwcHhgO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiB0aGUgc2VsZWN0J3Mgb3B0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZ2V0SXRlbUhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyRm9udFNpemUgKiBTRUxFQ1RfSVRFTV9IRUlHSFRfRU07XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGl0ZW1zIGluIHRoZSBzZWxlY3QuIFRoaXMgaW5jbHVkZXMgb3B0aW9ucyBhbmQgZ3JvdXAgbGFiZWxzLiAqL1xuICBwcml2YXRlIF9nZXRJdGVtQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxlbmd0aCArIHRoaXMub3B0aW9uR3JvdXBzLmxlbmd0aDtcbiAgfVxufVxuIiwiPCEtLVxuIE5vdGUgdGhhdCB0aGUgc2VsZWN0IHRyaWdnZXIgZWxlbWVudCBzcGVjaWZpZXMgYGFyaWEtb3duc2AgcG9pbnRpbmcgdG8gdGhlIGxpc3Rib3ggb3ZlcmxheS5cbiBXaGlsZSBhcmlhLW93bnMgaXMgbm90IHJlcXVpcmVkIGZvciB0aGUgQVJJQSAxLjIgYHJvbGU9XCJjb21ib2JveFwiYCBpbnRlcmFjdGlvbiBwYXR0ZXJuLFxuIGl0IGZpeGVzIGFuIGlzc3VlIHdpdGggVm9pY2VPdmVyIHdoZW4gdGhlIHNlbGVjdCBhcHBlYXJzIGluc2lkZSBvZiBhbiBgYXJpYS1tb2RlbD1cInRydWVcImBcbiBlbGVtZW50IChlLmcuIGEgZGlhbG9nKS4gV2l0aG91dCB0aGlzIGBhcmlhLW93bnNgLCB0aGUgYGFyaWEtbW9kYWxgIG9uIGEgZGlhbG9nIHByZXZlbnRzXG4gVm9pY2VPdmVyIGZyb20gXCJzZWVpbmdcIiB0aGUgc2VsZWN0J3MgbGlzdGJveCBvdmVybGF5IGZvciBhcmlhLWFjdGl2ZWRlc2NlbmRhbnQuXG4gVXNpbmcgYGFyaWEtb3duc2AgcmUtcGFyZW50cyB0aGUgc2VsZWN0IG92ZXJsYXkgc28gdGhhdCBpdCB3b3JrcyBhZ2Fpbi5cbiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2OTRcbi0tPlxuPGRpdiBjZGstb3ZlcmxheS1vcmlnaW5cbiAgICAgW2F0dHIuYXJpYS1vd25zXT1cInBhbmVsT3BlbiA/IGlkICsgJy1wYW5lbCcgOiBudWxsXCJcbiAgICAgY2xhc3M9XCJtYXQtc2VsZWN0LXRyaWdnZXJcIlxuICAgICAoY2xpY2spPVwidG9nZ2xlKClcIlxuICAgICAjb3JpZ2luPVwiY2RrT3ZlcmxheU9yaWdpblwiXG4gICAgICN0cmlnZ2VyPlxuICA8ZGl2IGNsYXNzPVwibWF0LXNlbGVjdC12YWx1ZVwiIFtuZ1N3aXRjaF09XCJlbXB0eVwiIFthdHRyLmlkXT1cIl92YWx1ZUlkXCI+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtc2VsZWN0LXBsYWNlaG9sZGVyIG1hdC1zZWxlY3QtbWluLWxpbmVcIiAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiPnt7cGxhY2Vob2xkZXJ9fTwvc3Bhbj5cbiAgICA8c3BhbiBjbGFzcz1cIm1hdC1zZWxlY3QtdmFsdWUtdGV4dFwiICpuZ1N3aXRjaENhc2U9XCJmYWxzZVwiIFtuZ1N3aXRjaF09XCIhIWN1c3RvbVRyaWdnZXJcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWF0LXNlbGVjdC1taW4tbGluZVwiICpuZ1N3aXRjaERlZmF1bHQ+e3t0cmlnZ2VyVmFsdWV9fTwvc3Bhbj5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1zZWxlY3QtdHJpZ2dlclwiICpuZ1N3aXRjaENhc2U9XCJ0cnVlXCI+PC9uZy1jb250ZW50PlxuICAgIDwvc3Bhbj5cbiAgPC9kaXY+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zZWxlY3QtYXJyb3ctd3JhcHBlclwiPjxkaXYgY2xhc3M9XCJtYXQtc2VsZWN0LWFycm93XCI+PC9kaXY+PC9kaXY+XG48L2Rpdj5cblxuPG5nLXRlbXBsYXRlXG4gIGNkay1jb25uZWN0ZWQtb3ZlcmxheVxuICBjZGtDb25uZWN0ZWRPdmVybGF5TG9ja1Bvc2l0aW9uXG4gIGNka0Nvbm5lY3RlZE92ZXJsYXlIYXNCYWNrZHJvcFxuICBjZGtDb25uZWN0ZWRPdmVybGF5QmFja2Ryb3BDbGFzcz1cImNkay1vdmVybGF5LXRyYW5zcGFyZW50LWJhY2tkcm9wXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQYW5lbENsYXNzXT1cIl9vdmVybGF5UGFuZWxDbGFzc1wiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5U2Nyb2xsU3RyYXRlZ3ldPVwiX3Njcm9sbFN0cmF0ZWd5XCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcmlnaW5dPVwib3JpZ2luXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cInBhbmVsT3BlblwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25zXT1cIl9wb3NpdGlvbnNcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheU1pbldpZHRoXT1cIl90cmlnZ2VyUmVjdD8ud2lkdGghXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPZmZzZXRZXT1cIl9vZmZzZXRZXCJcbiAgKGJhY2tkcm9wQ2xpY2spPVwiY2xvc2UoKVwiXG4gIChhdHRhY2gpPVwiX29uQXR0YWNoZWQoKVwiXG4gIChkZXRhY2gpPVwiY2xvc2UoKVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LXNlbGVjdC1wYW5lbC13cmFwXCIgW0B0cmFuc2Zvcm1QYW5lbFdyYXBdPlxuICAgIDxkaXZcbiAgICAgICNwYW5lbFxuICAgICAgcm9sZT1cImxpc3Rib3hcIlxuICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICBjbGFzcz1cIm1hdC1zZWxlY3QtcGFuZWwge3sgX2dldFBhbmVsVGhlbWUoKSB9fVwiXG4gICAgICBbYXR0ci5pZF09XCJpZCArICctcGFuZWwnXCJcbiAgICAgIFthdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXT1cIm11bHRpcGxlXCJcbiAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cIl9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KClcIlxuICAgICAgW25nQ2xhc3NdPVwicGFuZWxDbGFzc1wiXG4gICAgICBbQHRyYW5zZm9ybVBhbmVsXT1cIm11bHRpcGxlID8gJ3Nob3dpbmctbXVsdGlwbGUnIDogJ3Nob3dpbmcnXCJcbiAgICAgIChAdHJhbnNmb3JtUGFuZWwuZG9uZSk9XCJfcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtLm5leHQoJGV2ZW50LnRvU3RhdGUpXCJcbiAgICAgIFtzdHlsZS50cmFuc2Zvcm1PcmlnaW5dPVwiX3RyYW5zZm9ybU9yaWdpblwiXG4gICAgICBbc3R5bGUuZm9udC1zaXplLnB4XT1cIl90cmlnZ2VyRm9udFNpemVcIlxuICAgICAgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=