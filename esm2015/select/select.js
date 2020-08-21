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
export class MatSelect extends _MatSelectMixinBase {
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
        if (newValue !== this._value) {
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
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
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
            if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
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
        const itemHeight = this._getItemHeight();
        this.panel.nativeElement.scrollTop = _getOptionScrollPosition((activeOptionIndex + labelCount) * itemHeight, itemHeight, this.panel.nativeElement.scrollTop, SELECT_PANEL_MAX_HEIGHT);
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
        return this._parentFormField.getLabelId();
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
                template: "<div cdk-overlay-origin\n     class=\"mat-select-trigger\"\n     aria-hidden=\"true\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\">\n    <span class=\"mat-select-placeholder\" *ngSwitchCase=\"true\">{{placeholder || '\\u00A0'}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span *ngSwitchDefault>{{triggerValue || '\\u00A0'}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_triggerRect?.width!\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      [attr.id]=\"id + '-panel'\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n",
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
            },] }
];
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
    optionGroups: [{ type: ContentChildren, args: [MAT_OPTGROUP, { descendants: true },] }],
    panelClass: [{ type: Input }],
    customTrigger: [{ type: ContentChild, args: [MAT_SELECT_TRIGGER,] }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLDBCQUEwQixFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsQ0FBQyxFQUNELFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLGNBQWMsRUFDZCxJQUFJLEVBQ0osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLG1CQUFtQixFQUVuQixPQUFPLEdBRVIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFJTixRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxJQUFJLEVBRUosU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXVCLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRixPQUFPLEVBQ0wsNkJBQTZCLEVB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WUE3Z0JGLGFBQWE7NENBK2dCNUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7OztzQkFoTHRDLFNBQVMsU0FBQyxTQUFTO29CQUduQixTQUFTLFNBQUMsT0FBTzt5QkFRakIsU0FBUyxTQUFDLG1CQUFtQjtzQkFHN0IsZUFBZSxTQUFDLFNBQVMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7MkJBSTlDLGVBQWUsU0FBQyxZQUFtQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzt5QkFHeEQsS0FBSzs0QkFJTCxZQUFZLFNBQUMsa0JBQXlCOzBCQUd0QyxLQUFLO3VCQVFMLEtBQUs7dUJBUUwsS0FBSztxQ0FXTCxLQUFLOzBCQVdMLEtBQUs7b0JBY0wsS0FBSzt3QkFjTCxLQUFLLFNBQUMsWUFBWTs2QkFHbEIsS0FBSyxTQUFDLGlCQUFpQjtnQ0FHdkIsS0FBSzt3Q0FHTCxLQUFLOzZCQVdMLEtBQUs7aUJBR0wsS0FBSzsyQkF3QkwsTUFBTTs0QkFHTixNQUFNLFNBQUMsUUFBUTs0QkFJZixNQUFNLFNBQUMsUUFBUTs4QkFJZixNQUFNOzBCQVFOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlciwgTGl2ZUFubm91bmNlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtcbiAgQm9vbGVhbklucHV0LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBOdW1iZXJJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVORCxcbiAgRU5URVIsXG4gIGhhc01vZGlmaWVyS2V5LFxuICBIT01FLFxuICBMRUZUX0FSUk9XLFxuICBSSUdIVF9BUlJPVyxcbiAgU1BBQ0UsXG4gIFVQX0FSUk9XLFxufSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgQ2RrQ29ubmVjdGVkT3ZlcmxheSxcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIE92ZXJsYXksXG4gIFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNlbGYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgYWxpZ25tZW50IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gb3ZlclxuICogdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAqL1xuXG4vKiogVGhlIG1heCBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCA9IDI1NjtcblxuLyoqIFRoZSBwYW5lbCdzIHBhZGRpbmcgb24gdGhlIHgtYXhpcyAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggPSAxNjtcblxuLyoqIFRoZSBwYW5lbCdzIHggYXhpcyBwYWRkaW5nIGlmIGl0IGlzIGluZGVudGVkIChlLmcuIHRoZXJlIGlzIGFuIG9wdGlvbiBncm91cCkuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcblxuLyoqIFRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCBpdGVtcyBpbiBgZW1gIHVuaXRzLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9JVEVNX0hFSUdIVF9FTSA9IDM7XG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IFJldmVydCB0byBhIGNvbnN0YW50IGFmdGVyIDIwMTggc3BlYyB1cGRhdGVzIGFyZSBmdWxseSBtZXJnZWQuXG4vKipcbiAqIERpc3RhbmNlIGJldHdlZW4gdGhlIHBhbmVsIGVkZ2UgYW5kIHRoZSBvcHRpb24gdGV4dCBpblxuICogbXVsdGktc2VsZWN0aW9uIG1vZGUuXG4gKlxuICogQ2FsY3VsYXRlZCBhczpcbiAqIChTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41KSArIDE2ID0gNDBcbiAqIFRoZSBwYWRkaW5nIGlzIG11bHRpcGxpZWQgYnkgMS41IGJlY2F1c2UgdGhlIGNoZWNrYm94J3MgbWFyZ2luIGlzIGhhbGYgdGhlIHBhZGRpbmcuXG4gKiBUaGUgY2hlY2tib3ggd2lkdGggaXMgMTZweC5cbiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41ICsgMTY7XG5cbi8qKlxuICogVGhlIHNlbGVjdCBwYW5lbCB3aWxsIG9ubHkgXCJmaXRcIiBpbnNpZGUgdGhlIHZpZXdwb3J0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYXRcbiAqIHRoaXMgdmFsdWUgb3IgbW9yZSBhd2F5IGZyb20gdGhlIHZpZXdwb3J0IGJvdW5kYXJ5LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkcgPSA4O1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1zZWxlY3Qtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTpcbiAgICAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBzZWxlY3QgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTZWxlY3RDb25maWcge1xuICAvKiogV2hldGhlciBvcHRpb24gY2VudGVyaW5nIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZU9wdGlvbkNlbnRlcmluZz86IGJvb2xlYW47XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbD86IG51bWJlcjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0LFxuICAgIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkgeyB9XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2VsZWN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNlbGVjdEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge31cbn1cbmNvbnN0IF9NYXRTZWxlY3RNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICZcbiAgICB0eXBlb2YgTWF0U2VsZWN0QmFzZSA9XG4gICAgICAgIG1peGluRGlzYWJsZVJpcHBsZShtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZWQobWl4aW5FcnJvclN0YXRlKE1hdFNlbGVjdEJhc2UpKSkpO1xuXG5cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKipcbiAqIEFsbG93cyB0aGUgdXNlciB0byBjdXN0b21pemUgdGhlIHRyaWdnZXIgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0LXRyaWdnZXInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NFTEVDVF9UUklHR0VSLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0VHJpZ2dlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RUcmlnZ2VyIHt9XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICdzZWxlY3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzZWxlY3QuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnbGlzdGJveCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ19nZXRBcmlhTGFiZWwoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2dldEFyaWFMYWJlbGxlZGJ5KCknLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAncGFuZWxPcGVuID8gX29wdGlvbklkcyA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZGJ5IHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ19nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWVtcHR5XSc6ICdlbXB0eScsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3QnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFdyYXAsXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0IGV4dGVuZHMgX01hdFNlbGVjdE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIE9uSW5pdCwgRG9DaGVjaywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIENhbkRpc2FibGUsIEhhc1RhYkluZGV4LFxuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PiwgQ2FuVXBkYXRlRXJyb3JTdGF0ZSwgQ2FuRGlzYWJsZVJpcHBsZSB7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIHByaXZhdGUgX3BhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIGZpbGxpbmcgb3V0IHRoZSBzZWxlY3QgaXMgcmVxdWlyZWQgaW4gdGhlIGZvcm0uICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgcGFuZWwsIGNhbGN1bGF0ZWQgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIFRoZSBwbGFjZWhvbGRlciBkaXNwbGF5ZWQgaW4gdGhlIHRyaWdnZXIgb2YgdGhlIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLiAqL1xuICBwcml2YXRlIF9tdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDb21wYXJpc29uIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggb3B0aW9uIGlzIGRpc3BsYXllZC4gRGVmYXVsdHMgdG8gb2JqZWN0IGVxdWFsaXR5LiAqL1xuICBwcml2YXRlIF9jb21wYXJlV2l0aCA9IChvMTogYW55LCBvMjogYW55KSA9PiBvMSA9PT0gbzI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfdWlkID0gYG1hdC1zZWxlY3QtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGZvciB0aGUgdHJpZ2dlcidzIGNsaWVudCBib3VuZGluZyByZWN0LiAqL1xuICBfdHJpZ2dlclJlY3Q6IENsaWVudFJlY3Q7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgc2VsZWN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjYWNoZWQgZm9udC1zaXplIG9mIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF90cmlnZ2VyRm9udFNpemUgPSAwO1xuXG4gIC8qKiBEZWFscyB3aXRoIHRoZSBzZWxlY3Rpb24gbG9naWMuICovXG4gIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPjtcblxuICAvKiogTWFuYWdlcyBrZXlib2FyZCBldmVudHMgZm9yIG9wdGlvbnMgaW4gdGhlIHBhbmVsLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBzZWxlY3QgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgSURzIG9mIGNoaWxkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIHRoZSBhcmlhLW93bnMgYXR0cmlidXRlLiAqL1xuICBfb3B0aW9uSWRzOiBzdHJpbmcgPSAnJztcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcGFuZWwncyB0cmFuc2Zvcm0tb3JpZ2luIHByb3BlcnR5LiAqL1xuICBfdHJhbnNmb3JtT3JpZ2luOiBzdHJpbmcgPSAndG9wJztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcGFuZWwgZWxlbWVudCBpcyBmaW5pc2hlZCB0cmFuc2Zvcm1pbmcgaW4uICovXG4gIF9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW0gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgLyoqIFN0cmF0ZWd5IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGhhbmRsZSBzY3JvbGxpbmcgd2hpbGUgdGhlIHNlbGVjdCBwYW5lbCBpcyBvcGVuLiAqL1xuICBfc2Nyb2xsU3RyYXRlZ3k6IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBUaGUgeS1vZmZzZXQgb2YgdGhlIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlIHRyaWdnZXIncyB0b3Agc3RhcnQgY29ybmVyLlxuICAgKiBUaGlzIG11c3QgYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIHNlbGVjdGVkIG9wdGlvbiB0ZXh0IG92ZXIgdGhlIHRyaWdnZXIgdGV4dC5cbiAgICogd2hlbiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIHRoZSB5LXBvc2l0aW9uIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uXG4gICAqL1xuICBfb2Zmc2V0WSA9IDA7XG5cbiAgLyoqXG4gICAqIFRoaXMgcG9zaXRpb24gY29uZmlnIGVuc3VyZXMgdGhhdCB0aGUgdG9wIFwic3RhcnRcIiBjb3JuZXIgb2YgdGhlIG92ZXJsYXlcbiAgICogaXMgYWxpZ25lZCB3aXRoIHdpdGggdGhlIHRvcCBcInN0YXJ0XCIgb2YgdGhlIG9yaWdpbiBieSBkZWZhdWx0IChvdmVybGFwcGluZ1xuICAgKiB0aGUgdHJpZ2dlciBjb21wbGV0ZWx5KS4gSWYgdGhlIHBhbmVsIGNhbm5vdCBmaXQgYmVsb3cgdGhlIHRyaWdnZXIsIGl0XG4gICAqIHdpbGwgZmFsbCBiYWNrIHRvIGEgcG9zaXRpb24gYWJvdmUgdGhlIHRyaWdnZXIuXG4gICAqL1xuICBfcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgIH0sXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgfSxcbiAgXTtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGluZyBjZW50ZXJpbmcgb2YgdGhlIGFjdGl2ZSBvcHRpb24gb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU9wdGlvbkNlbnRlcmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWQgfHwgdGhpcy5fcGFuZWxPcGVuO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogQSBuYW1lIGZvciB0aGlzIGNvbnRyb2wgdGhhdCBjYW4gYmUgdXNlZCBieSBgbWF0LWZvcm0tZmllbGRgLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtc2VsZWN0JztcblxuICAvKiogVHJpZ2dlciB0aGF0IG9wZW5zIHRoZSBzZWxlY3QuICovXG4gIEBWaWV3Q2hpbGQoJ3RyaWdnZXInKSB0cmlnZ2VyOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBQYW5lbCBjb250YWluaW5nIHRoZSBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogT3ZlcmxheSBwYW5lIGNvbnRhaW5pbmcgdGhlIG9wdGlvbnMuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgcHJpdmF0ZSBBUEkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ29ubmVjdGVkT3ZlcmxheSkgb3ZlcmxheURpcjogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcblxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIHNlbGVjdCBvcHRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIGdyb3VwcyBvZiBvcHRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9PUFRHUk9VUCBhcyBhbnksIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHNlbGVjdCBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgLyoqIFVzZXItc3VwcGxpZWQgb3ZlcnJpZGUgb2YgdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfU0VMRUNUX1RSSUdHRVIgYXMgYW55KSBjdXN0b21UcmlnZ2VyOiBNYXRTZWxlY3RUcmlnZ2VyO1xuXG4gIC8qKiBQbGFjZWhvbGRlciB0byBiZSBzaG93biBpZiBubyB2YWx1ZSBoYXMgYmVlbiBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjsgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBvcHRpb25zLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tdWx0aXBsZTsgfVxuICBzZXQgbXVsdGlwbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldE1hdFNlbGVjdER5bmFtaWNNdWx0aXBsZUVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdG8gY2VudGVyIHRoZSBhY3RpdmUgb3B0aW9uIG92ZXIgdGhlIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZzsgfVxuICBzZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmcgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgdGhlIG9wdGlvbiB2YWx1ZXMgd2l0aCB0aGUgc2VsZWN0ZWQgdmFsdWVzLiBUaGUgZmlyc3QgYXJndW1lbnRcbiAgICogaXMgYSB2YWx1ZSBmcm9tIGFuIG9wdGlvbi4gVGhlIHNlY29uZCBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGlvbi4gQSBib29sZWFuXG4gICAqIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHsgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoOyB9XG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcbiAgICAgIC8vIEEgZGlmZmVyZW50IGNvbXBhcmF0b3IgbWVhbnMgdGhlIHNlbGVjdGlvbiBjb3VsZCBjaGFuZ2UuXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzZWxlY3QgY29udHJvbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0aW9uQnlWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIHNlbGVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHBsYWNlaG9sZGVyIHdpbGwgYmUgdXNlZCBhcyBsYWJlbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogT2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOyB9XG4gIHNldCB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IG51bWJlcjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzb3J0IHRoZSB2YWx1ZXMgaW4gYSBzZWxlY3QgaW4gbXVsdGlwbGUgbW9kZS5cbiAgICogRm9sbG93cyB0aGUgc2FtZSBsb2dpYyBhcyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLlxuICAgKi9cbiAgQElucHV0KCkgc29ydENvbXBhcmF0b3I6IChhOiBNYXRPcHRpb24sIGI6IE1hdE9wdGlvbiwgb3B0aW9uczogTWF0T3B0aW9uW10pID0+IG51bWJlcjtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2lkOiBzdHJpbmc7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIG9wdGlvbnMnIGNoYW5nZSBldmVudHMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbkNoYW5nZXM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmdab25lLm9uU3RhYmxlXG4gICAgICAucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzKSk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgcGFuZWwgaGFzIGJlZW4gdG9nZ2xlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiBvKSwgbWFwKCgpID0+IHt9KSk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLm9wZW5lZENoYW5nZS5waXBlKGZpbHRlcihvID0+ICFvKSwgbWFwKCgpID0+IHt9KSk7XG5cbiAgIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdGVkIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQgYnkgdGhlIHVzZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3RDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNlbGVjdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfcGFyZW50Rm9ybUZpZWxkOiBNYXRGb3JtRmllbGQsXG4gICAgQFNlbGYoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTogYW55LFxuICAgIHByaXZhdGUgX2xpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfU0VMRUNUX0NPTkZJRykgZGVmYXVsdHM/OiBNYXRTZWxlY3RDb25maWcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSxcbiAgICAgICAgICBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBOb3RlOiB3ZSBwcm92aWRlIHRoZSB2YWx1ZSBhY2Nlc3NvciB0aHJvdWdoIGhlcmUsIGluc3RlYWQgb2ZcbiAgICAgIC8vIHRoZSBgcHJvdmlkZXJzYCB0byBhdm9pZCBydW5uaW5nIGludG8gYSBjaXJjdWxhciBpbXBvcnQuXG4gICAgICB0aGlzLm5nQ29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneUZhY3RvcnkgPSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSB0aGlzLl9zY3JvbGxTdHJhdGVneUZhY3RvcnkoKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICAvLyBGb3JjZSBzZXR0ZXIgdG8gYmUgY2FsbGVkIGluIGNhc2UgaWQgd2FzIG5vdCBzcGVjaWZpZWQuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQ7XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gZGVmYXVsdHMuZGlzYWJsZU9wdGlvbkNlbnRlcmluZztcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgPSBkZWZhdWx0cy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj4odGhpcy5tdWx0aXBsZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuXG4gICAgLy8gV2UgbmVlZCBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGhlcmUsIGJlY2F1c2Ugc29tZSBicm93c2VycyB3aWxsXG4gICAgLy8gZmlyZSB0aGUgYW5pbWF0aW9uIGVuZCBldmVudCB0d2ljZSBmb3IgdGhlIHNhbWUgYW5pbWF0aW9uLiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW1cbiAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgICAgdGhpcy5vdmVybGF5RGlyLm9mZnNldFggPSAwO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuX3ZpZXdwb3J0UnVsZXIuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5pdEtleU1hbmFnZXIoKTtcblxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5hZGRlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0KCkpO1xuICAgICAgZXZlbnQucmVtb3ZlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uZGVzZWxlY3QoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRPcHRpb25zKCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gVXBkYXRpbmcgdGhlIGRpc2FibGVkIHN0YXRlIGlzIGhhbmRsZWQgYnkgYG1peGluRGlzYWJsZWRgLCBidXQgd2UgbmVlZCB0byBhZGRpdGlvbmFsbHkgbGV0XG4gICAgLy8gdGhlIHBhcmVudCBmb3JtIGZpZWxkIGtub3cgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgY2hhbmdlcy5cbiAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXSkge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWyd0eXBlYWhlYWREZWJvdW5jZUludGVydmFsJ10gJiYgdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoVHlwZUFoZWFkKHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIG92ZXJsYXkgcGFuZWwgb3BlbiBvciBjbG9zZWQuICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8ICF0aGlzLm9wdGlvbnMgfHwgIXRoaXMub3B0aW9ucy5sZW5ndGggfHwgdGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyBOb3RlOiBUaGUgY29tcHV0ZWQgZm9udC1zaXplIHdpbGwgYmUgYSBzdHJpbmcgcGl4ZWwgdmFsdWUgKGUuZy4gXCIxNnB4XCIpLlxuICAgIC8vIGBwYXJzZUludGAgaWdub3JlcyB0aGUgdHJhaWxpbmcgJ3B4JyBhbmQgY29udmVydHMgdGhpcyB0byBhIG51bWJlci5cbiAgICB0aGlzLl90cmlnZ2VyRm9udFNpemUgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50KS5mb250U2l6ZSB8fCAnMCcpO1xuXG4gICAgdGhpcy5fcGFuZWxPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24obnVsbCk7XG4gICAgdGhpcy5fY2FsY3VsYXRlT3ZlcmxheVBvc2l0aW9uKCk7XG4gICAgdGhpcy5faGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgLy8gU2V0IHRoZSBmb250IHNpemUgb24gdGhlIHBhbmVsIGVsZW1lbnQgb25jZSBpdCBleGlzdHMuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl90cmlnZ2VyRm9udFNpemUgJiYgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYgJiZcbiAgICAgICAgICB0aGlzLm92ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IGAke3RoaXMuX3RyaWdnZXJGb250U2l6ZX1weGA7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBvdmVybGF5IHBhbmVsIGFuZCBmb2N1c2VzIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX3BhbmVsT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdCdzIHZhbHVlLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIG1vZGVsLlxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QgaXMgYmx1cnJlZFxuICAgKiBieSB0aGUgdXNlci4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdG91Y2hlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBzZWxlY3QuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgZ2V0IHNlbGVjdGVkKCk6IE1hdE9wdGlvbiB8IE1hdE9wdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF07XG4gIH1cblxuICAvKiogVGhlIHZhbHVlIGRpc3BsYXllZCBpbiB0aGUgdHJpZ2dlci4gKi9cbiAgZ2V0IHRyaWdnZXJWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX211bHRpcGxlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZC5tYXAob3B0aW9uID0+IG9wdGlvbi52aWV3VmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5faXNSdGwoKSkge1xuICAgICAgICBzZWxlY3RlZE9wdGlvbnMucmV2ZXJzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPKGNyaXNiZXRvKTogZGVsaW1pdGVyIHNob3VsZCBiZSBjb25maWd1cmFibGUgZm9yIHByb3BlciBsb2NhbGl6YXRpb24uXG4gICAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25zLmpvaW4oJywgJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIGluIFJUTCBtb2RlLiAqL1xuICBfaXNSdGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGFsbCBrZXlkb3duIGV2ZW50cyBvbiB0aGUgc2VsZWN0LiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5wYW5lbE9wZW4gPyB0aGlzLl9oYW5kbGVPcGVuS2V5ZG93bihldmVudCkgOiB0aGlzLl9oYW5kbGVDbG9zZWRLZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hpbGUgdGhlIHNlbGVjdCBpcyBjbG9zZWQuICovXG4gIHByaXZhdGUgX2hhbmRsZUNsb3NlZEtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVyB8fFxuICAgICAgICAgICAgICAgICAgICAgICBrZXlDb2RlID09PSBMRUZUX0FSUk9XIHx8IGtleUNvZGUgPT09IFJJR0hUX0FSUk9XO1xuICAgIGNvbnN0IGlzT3BlbktleSA9IGtleUNvZGUgPT09IEVOVEVSIHx8IGtleUNvZGUgPT09IFNQQUNFO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gT3BlbiB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgaWYgKCFtYW5hZ2VyLmlzVHlwaW5nKCkgJiYgKGlzT3BlbktleSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgKCh0aGlzLm11bHRpcGxlIHx8IGV2ZW50LmFsdEtleSkgJiYgaXNBcnJvd0tleSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnRzIHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nIGRvd24gd2hlbiBwcmVzc2luZyBzcGFjZVxuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3QgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uID0gdGhpcy5zZWxlY3RlZDtcblxuICAgICAgaWYgKGtleUNvZGUgPT09IEhPTUUgfHwga2V5Q29kZSA9PT0gRU5EKSB7XG4gICAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG5cbiAgICAgIC8vIFNpbmNlIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZCwgd2UgbmVlZCB0byBhbm5vdW5jZSBpdCBvdXJzZWx2ZXMuXG4gICAgICBpZiAoc2VsZWN0ZWRPcHRpb24gJiYgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uICE9PSBzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAvLyBXZSBzZXQgYSBkdXJhdGlvbiBvbiB0aGUgbGl2ZSBhbm5vdW5jZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgbGl2ZSBlbGVtZW50IHRvIGJlXG4gICAgICAgIC8vIGNsZWFyZWQgYWZ0ZXIgYSB3aGlsZSBzbyB0aGF0IHVzZXJzIGNhbid0IG5hdmlnYXRlIHRvIGl0IHVzaW5nIHRoZSBhcnJvdyBrZXlzLlxuICAgICAgICB0aGlzLl9saXZlQW5ub3VuY2VyLmFubm91bmNlKChzZWxlY3RlZE9wdGlvbiBhcyBNYXRPcHRpb24pLnZpZXdWYWx1ZSwgMTAwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGVuIHRoZSBzZWxlY3RlZCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9oYW5kbGVPcGVuS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8IGtleUNvZGUgPT09IFVQX0FSUk9XO1xuICAgIGNvbnN0IGlzVHlwaW5nID0gbWFuYWdlci5pc1R5cGluZygpO1xuXG4gICAgaWYgKGtleUNvZGUgPT09IEhPTUUgfHwga2V5Q29kZSA9PT0gRU5EKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIGlmIChpc0Fycm93S2V5ICYmIGV2ZW50LmFsdEtleSkge1xuICAgICAgLy8gQ2xvc2UgdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGluIHRoaXMgY2FzZSBpZiB0aGUgdXNlciBpcyB0eXBpbmcsXG4gICAgICAvLyBiZWNhdXNlIHRoZSB0eXBpbmcgc2VxdWVuY2UgY2FuIGluY2x1ZGUgdGhlIHNwYWNlIGtleS5cbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpICYmIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiB0aGlzLl9tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBBICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYXNEZXNlbGVjdGVkT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5zb21lKG9wdCA9PiAhb3B0LmRpc2FibGVkICYmICFvcHQuc2VsZWN0ZWQpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBpZiAoIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICAgIGhhc0Rlc2VsZWN0ZWRPcHRpb25zID8gb3B0aW9uLnNlbGVjdCgpIDogb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEluZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcblxuICAgICAgaWYgKHRoaXMuX211bHRpcGxlICYmIGlzQXJyb3dLZXkgJiYgZXZlbnQuc2hpZnRLZXkgJiYgbWFuYWdlci5hY3RpdmVJdGVtICYmXG4gICAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzbHlGb2N1c2VkSW5kZXgpIHtcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbkZvY3VzKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSB0b3VjaGVkIGNhbGxiYWNrIG9ubHkgaWYgdGhlIHBhbmVsIGlzIGNsb3NlZC4gT3RoZXJ3aXNlLCB0aGUgdHJpZ2dlciB3aWxsXG4gICAqIFwiYmx1clwiIHRvIHRoZSBwYW5lbCB3aGVuIGl0IG9wZW5zLCBjYXVzaW5nIGEgZmFsc2UgcG9zaXRpdmUuXG4gICAqL1xuICBfb25CbHVyKCkge1xuICAgIHRoaXMuX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLlxuICAgKi9cbiAgX29uQXR0YWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVybGF5RGlyLnBvc2l0aW9uQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRYKCk7XG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRoZW1lIHRvIGJlIHVzZWQgb24gdGhlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxUaGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGb3JtRmllbGQgPyBgbWF0LSR7dGhpcy5fcGFyZW50Rm9ybUZpZWxkLmNvbG9yfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3NlbGVjdGlvbk1vZGVsIHx8IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgIC8vIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzIGZyb20gQW5ndWxhci5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC52YWx1ZSA6IHRoaXMuX3ZhbHVlKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb24gYmFzZWQgb24gYSB2YWx1ZS4gSWYgbm8gb3B0aW9uIGNhbiBiZVxuICAgKiBmb3VuZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHZhbHVlLCB0aGUgc2VsZWN0IHRyaWdnZXIgaXMgY2xlYXJlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgICB2YWx1ZS5mb3JFYWNoKChjdXJyZW50VmFsdWU6IGFueSkgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUpO1xuXG4gICAgICAvLyBTaGlmdCBmb2N1cyB0byB0aGUgYWN0aXZlIGl0ZW0uIE5vdGUgdGhhdCB3ZSBzaG91bGRuJ3QgZG8gdGhpcyBpbiBtdWx0aXBsZVxuICAgICAgLy8gbW9kZSwgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoYXQgb3B0aW9uIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCBsYXN0LlxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGNvcnJlc3BvbmRpbmdPcHRpb24pO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJlc2V0IHRoZSBoaWdobGlnaHRlZCBvcHRpb24uIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyB3aGlsZVxuICAgICAgICAvLyBjbG9zZWQsIGJlY2F1c2UgZG9pbmcgaXQgd2hpbGUgb3BlbiBjYW4gc2hpZnQgdGhlIHVzZXIncyBmb2N1cyB1bm5lY2Vzc2FyaWx5LlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBzZWxlY3RzIGFuZCBvcHRpb24gYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBPcHRpb24gdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KTogTWF0T3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQoKG9wdGlvbjogTWF0T3B0aW9uKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcmVhdCBudWxsIGFzIGEgc3BlY2lhbCByZXNldCB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSAhPSBudWxsICYmIHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbi52YWx1ZSwgIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgICAvLyBOb3RpZnkgZGV2ZWxvcGVycyBvZiBlcnJvcnMgaW4gdGhlaXIgY29tcGFyYXRvci5cbiAgICAgICAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nT3B0aW9uKSB7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3QoY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvcnJlc3BvbmRpbmdPcHRpb247XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsKVxuICAgICAgLndpdGhWZXJ0aWNhbE9yaWVudGF0aW9uKClcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKVxuICAgICAgLndpdGhBbGxvd2VkTW9kaWZpZXJLZXlzKFsnc2hpZnRLZXknXSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnRhYk91dC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAvLyBTZWxlY3QgdGhlIGFjdGl2ZSBpdGVtIHdoZW4gdGFiYmluZyBhd2F5LiBUaGlzIGlzIGNvbnNpc3RlbnQgd2l0aCBob3cgdGhlIG5hdGl2ZVxuICAgICAgICAvLyBzZWxlY3QgYmVoYXZlcy4gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBkbyB0aGlzIGluIHNpbmdsZSBzZWxlY3Rpb24gbW9kZS5cbiAgICAgICAgaWYgKCF0aGlzLm11bHRpcGxlICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlc3RvcmUgZm9jdXMgdG8gdGhlIHRyaWdnZXIgYmVmb3JlIGNsb3NpbmcuIEVuc3VyZXMgdGhhdCB0aGUgZm9jdXNcbiAgICAgICAgLy8gcG9zaXRpb24gd29uJ3QgYmUgbG9zdCBpZiB0aGUgdXNlciBnb3QgZm9jdXMgaW50byB0aGUgb3ZlcmxheS5cbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9wYW5lbE9wZW4gJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLl9zY3JvbGxBY3RpdmVPcHRpb25JbnRvVmlldygpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5fcGFuZWxPcGVuICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbSkge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogRHJvcHMgY3VycmVudCBvcHRpb24gc3Vic2NyaXB0aW9ucyBhbmQgSURzIGFuZCByZXNldHMgZnJvbSBzY3JhdGNoLiAqL1xuICBwcml2YXRlIF9yZXNldE9wdGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZE9yRGVzdHJveWVkID0gbWVyZ2UodGhpcy5vcHRpb25zLmNoYW5nZXMsIHRoaXMuX2Rlc3Ryb3kpO1xuXG4gICAgdGhpcy5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICB0aGlzLl9vblNlbGVjdChldmVudC5zb3VyY2UsIGV2ZW50LmlzVXNlcklucHV0KTtcblxuICAgICAgaWYgKGV2ZW50LmlzVXNlcklucHV0ICYmICF0aGlzLm11bHRpcGxlICYmIHRoaXMuX3BhbmVsT3Blbikge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiB0byBjaGFuZ2VzIGluIHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgb3B0aW9ucyBhbmQgcmVhY3QgYWNjb3JkaW5nbHkuXG4gICAgLy8gSGFuZGxlcyBjYXNlcyBsaWtlIHRoZSBsYWJlbHMgb2YgdGhlIHNlbGVjdGVkIG9wdGlvbnMgY2hhbmdpbmcuXG4gICAgbWVyZ2UoLi4udGhpcy5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLl9zdGF0ZUNoYW5nZXMpKVxuICAgICAgLnBpcGUodGFrZVVudGlsKGNoYW5nZWRPckRlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fc2V0T3B0aW9uSWRzKCk7XG4gIH1cblxuICAvKiogSW52b2tlZCB3aGVuIGFuIG9wdGlvbiBpcyBjbGlja2VkLiAqL1xuICBwcml2YXRlIF9vblNlbGVjdChvcHRpb246IE1hdE9wdGlvbiwgaXNVc2VySW5wdXQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBjb25zdCB3YXNTZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzU2VsZWN0ZWQob3B0aW9uKTtcblxuICAgIGlmIChvcHRpb24udmFsdWUgPT0gbnVsbCAmJiAhdGhpcy5fbXVsdGlwbGUpIHtcbiAgICAgIG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcblxuICAgICAgaWYgKHRoaXMudmFsdWUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKG9wdGlvbi52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gb3B0aW9uLnNlbGVjdGVkKSB7XG4gICAgICAgIG9wdGlvbi5zZWxlY3RlZCA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChvcHRpb24pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3Qob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG5cbiAgICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgdXNlciBzZWxlY3RlZCB0aGUgb3B0aW9uIHdpdGggdGhlaXIgbW91c2UsIHdlXG4gICAgICAgICAgLy8gd2FudCB0byByZXN0b3JlIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIsIGluIG9yZGVyIHRvXG4gICAgICAgICAgLy8gcHJldmVudCB0aGUgc2VsZWN0IGtleWJvYXJkIGNvbnRyb2xzIGZyb20gY2xhc2hpbmcgd2l0aFxuICAgICAgICAgIC8vIHRoZSBvbmVzIGZyb20gYG1hdC1vcHRpb25gLlxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pKSB7XG4gICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFNvcnRzIHRoZSBzZWxlY3RlZCB2YWx1ZXMgaW4gdGhlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZWlyIG9yZGVyIGluIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc29ydFZhbHVlcygpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy50b0FycmF5KCk7XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydENvbXBhcmF0b3IgPyB0aGlzLnNvcnRDb21wYXJhdG9yKGEsIGIsIG9wdGlvbnMpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmluZGV4T2YoYSkgLSBvcHRpb25zLmluZGV4T2YoYik7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgY2hhbmdlIGV2ZW50IHRvIHNldCB0aGUgbW9kZWwgdmFsdWUuICovXG4gIHByaXZhdGUgX3Byb3BhZ2F0ZUNoYW5nZXMoZmFsbGJhY2tWYWx1ZT86IGFueSk6IHZvaWQge1xuICAgIGxldCB2YWx1ZVRvRW1pdDogYW55ID0gbnVsbDtcblxuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbltdKS5tYXAob3B0aW9uID0+IG9wdGlvbi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gdGhpcy5zZWxlY3RlZCA/ICh0aGlzLnNlbGVjdGVkIGFzIE1hdE9wdGlvbikudmFsdWUgOiBmYWxsYmFja1ZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWVUb0VtaXQ7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChuZXcgTWF0U2VsZWN0Q2hhbmdlKHRoaXMsIHZhbHVlVG9FbWl0KSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogUmVjb3JkcyBvcHRpb24gSURzIHRvIHBhc3MgdG8gdGhlIGFyaWEtb3ducyBwcm9wZXJ0eS4gKi9cbiAgcHJpdmF0ZSBfc2V0T3B0aW9uSWRzKCkge1xuICAgIHRoaXMuX29wdGlvbklkcyA9IHRoaXMub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5pZCkuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZ2hsaWdodHMgdGhlIHNlbGVjdGVkIGl0ZW0uIElmIG5vIG9wdGlvbiBpcyBzZWxlY3RlZCwgaXQgd2lsbCBoaWdobGlnaHRcbiAgICogdGhlIGZpcnN0IGl0ZW0gaW5zdGVhZC5cbiAgICovXG4gIHByaXZhdGUgX2hpZ2hsaWdodENvcnJlY3RPcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBTY3JvbGxzIHRoZSBhY3RpdmUgb3B0aW9uIGludG8gdmlldy4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsQWN0aXZlT3B0aW9uSW50b1ZpZXcoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aXZlT3B0aW9uSW5kZXggPSB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwO1xuICAgIGNvbnN0IGxhYmVsQ291bnQgPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihhY3RpdmVPcHRpb25JbmRleCwgdGhpcy5vcHRpb25zLFxuICAgICAgICB0aGlzLm9wdGlvbkdyb3Vwcyk7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcblxuICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICAoYWN0aXZlT3B0aW9uSW5kZXggKyBsYWJlbENvdW50KSAqIGl0ZW1IZWlnaHQsXG4gICAgICBpdGVtSGVpZ2h0LFxuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCxcbiAgICAgIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgZWxlbWVudC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBpbmRleCBvZiB0aGUgcHJvdmlkZWQgb3B0aW9uIGluIHRoZSBvcHRpb24gbGlzdC4gKi9cbiAgcHJpdmF0ZSBfZ2V0T3B0aW9uSW5kZXgob3B0aW9uOiBNYXRPcHRpb24pOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmVkdWNlKChyZXN1bHQ6IG51bWJlciB8IHVuZGVmaW5lZCwgY3VycmVudDogTWF0T3B0aW9uLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAocmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9wdGlvbiA9PT0gY3VycmVudCA/IGluZGV4IDogdW5kZWZpbmVkO1xuICAgIH0sIHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB4LSBhbmQgeS1vZmZzZXRzIG9mIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5UG9zaXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2dldEl0ZW1Db3VudCgpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0ID0gTWF0aC5taW4oaXRlbXMgKiBpdGVtSGVpZ2h0LCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCk7XG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVySGVpZ2h0ID0gaXRlbXMgKiBpdGVtSGVpZ2h0O1xuXG4gICAgLy8gVGhlIGZhcnRoZXN0IHRoZSBwYW5lbCBjYW4gYmUgc2Nyb2xsZWQgYmVmb3JlIGl0IGhpdHMgdGhlIGJvdHRvbVxuICAgIGNvbnN0IG1heFNjcm9sbCA9IHNjcm9sbENvbnRhaW5lckhlaWdodCAtIHBhbmVsSGVpZ2h0O1xuXG4gICAgLy8gSWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQgd2Ugb3BlbiB0aGUgcG9wdXAgdG8gdGhlIGZpcnN0IGl0ZW0uXG4gICAgbGV0IHNlbGVjdGVkT3B0aW9uT2Zmc2V0ID1cbiAgICAgICAgdGhpcy5lbXB0eSA/IDAgOiB0aGlzLl9nZXRPcHRpb25JbmRleCh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSkhO1xuXG4gICAgc2VsZWN0ZWRPcHRpb25PZmZzZXQgKz0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHRoaXMub3B0aW9ucyxcbiAgICAgICAgdGhpcy5vcHRpb25Hcm91cHMpO1xuXG4gICAgLy8gV2UgbXVzdCBtYWludGFpbiBhIHNjcm9sbCBidWZmZXIgc28gdGhlIHNlbGVjdGVkIG9wdGlvbiB3aWxsIGJlIHNjcm9sbGVkIHRvIHRoZVxuICAgIC8vIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbCByYXRoZXIgdGhhbiB0aGUgdG9wLlxuICAgIGNvbnN0IHNjcm9sbEJ1ZmZlciA9IHBhbmVsSGVpZ2h0IC8gMjtcbiAgICB0aGlzLl9zY3JvbGxUb3AgPSB0aGlzLl9jYWxjdWxhdGVPdmVybGF5U2Nyb2xsKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG4gICAgdGhpcy5fb2Zmc2V0WSA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkT3B0aW9uT2Zmc2V0LCBzY3JvbGxCdWZmZXIsIG1heFNjcm9sbCk7XG5cbiAgICB0aGlzLl9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGwpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbC5cbiAgICpcbiAgICogQXR0ZW1wdHMgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24gaW4gdGhlIHBhbmVsLiBJZiB0aGUgb3B0aW9uIGlzXG4gICAqIHRvbyBoaWdoIG9yIHRvbyBsb3cgaW4gdGhlIHBhbmVsIHRvIGJlIHNjcm9sbGVkIHRvIHRoZSBjZW50ZXIsIGl0IGNsYW1wcyB0aGVcbiAgICogc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBtaW4gb3IgbWF4IHNjcm9sbCBwb3NpdGlvbnMgcmVzcGVjdGl2ZWx5LlxuICAgKi9cbiAgX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRJbmRleDogbnVtYmVyLCBzY3JvbGxCdWZmZXI6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCA9IGl0ZW1IZWlnaHQgKiBzZWxlY3RlZEluZGV4O1xuICAgIGNvbnN0IGhhbGZPcHRpb25IZWlnaHQgPSBpdGVtSGVpZ2h0IC8gMjtcblxuICAgIC8vIFN0YXJ0cyBhdCB0aGUgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCwgd2hpY2ggc2Nyb2xscyB0aGUgb3B0aW9uIHRvIHRoZSB0b3Agb2YgdGhlXG4gICAgLy8gc2Nyb2xsIGNvbnRhaW5lciwgdGhlbiBzdWJ0cmFjdHMgdGhlIHNjcm9sbCBidWZmZXIgdG8gc2Nyb2xsIHRoZSBvcHRpb24gZG93biB0b1xuICAgIC8vIHRoZSBjZW50ZXIgb2YgdGhlIG92ZXJsYXkgcGFuZWwuIEhhbGYgdGhlIG9wdGlvbiBoZWlnaHQgbXVzdCBiZSByZS1hZGRlZCB0byB0aGVcbiAgICAvLyBzY3JvbGxUb3Agc28gdGhlIG9wdGlvbiBpcyBjZW50ZXJlZCBiYXNlZCBvbiBpdHMgbWlkZGxlLCBub3QgaXRzIHRvcCBlZGdlLlxuICAgIGNvbnN0IG9wdGltYWxTY3JvbGxQb3NpdGlvbiA9IG9wdGlvbk9mZnNldEZyb21TY3JvbGxUb3AgLSBzY3JvbGxCdWZmZXIgKyBoYWxmT3B0aW9uSGVpZ2h0O1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCgwLCBvcHRpbWFsU2Nyb2xsUG9zaXRpb24pLCBtYXhTY3JvbGwpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGFyaWEtbGFiZWwgb2YgdGhlIHNlbGVjdCBjb21wb25lbnQuICovXG4gIF9nZXRBcmlhTGFiZWwoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgLy8gSWYgYW4gYXJpYUxhYmVsbGVkYnkgdmFsdWUgaGFzIGJlZW4gc2V0IGJ5IHRoZSBjb25zdW1lciwgdGhlIHNlbGVjdCBzaG91bGQgbm90IG92ZXJ3cml0ZSB0aGVcbiAgICAvLyBgYXJpYS1sYWJlbGxlZGJ5YCB2YWx1ZSBieSBzZXR0aW5nIHRoZSBhcmlhTGFiZWwgdG8gdGhlIHBsYWNlaG9sZGVyLlxuICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbGxlZGJ5ID8gbnVsbCA6IHRoaXMuYXJpYUxhYmVsIHx8IHRoaXMucGxhY2Vob2xkZXI7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYXJpYS1sYWJlbGxlZGJ5IG9mIHRoZSBzZWxlY3QgY29tcG9uZW50LiAqL1xuICBfZ2V0QXJpYUxhYmVsbGVkYnkoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbGxlZGJ5O1xuICAgIH1cblxuICAgIC8vIE5vdGU6IHdlIHVzZSBgX2dldEFyaWFMYWJlbGAgaGVyZSwgYmVjYXVzZSB3ZSB3YW50IHRvIGNoZWNrIHdoZXRoZXIgdGhlcmUncyBhXG4gICAgLy8gY29tcHV0ZWQgbGFiZWwuIGB0aGlzLmFyaWFMYWJlbGAgaXMgb25seSB0aGUgdXNlci1zcGVjaWZpZWQgbGFiZWwuXG4gICAgaWYgKCF0aGlzLl9wYXJlbnRGb3JtRmllbGQgfHwgIXRoaXMuX3BhcmVudEZvcm1GaWVsZC5faGFzRmxvYXRpbmdMYWJlbCgpIHx8XG4gICAgICB0aGlzLl9nZXRBcmlhTGFiZWwoKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudEZvcm1GaWVsZC5nZXRMYWJlbElkKCk7XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB0aGUgYGFyaWEtYWN0aXZlZGVzY2VuZGFudGAgdG8gYmUgc2V0IG9uIHRoZSBob3N0LiAqL1xuICBfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMucGFuZWxPcGVuICYmIHRoaXMuX2tleU1hbmFnZXIgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHgtb2Zmc2V0IG9mIHRoZSBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZSB0cmlnZ2VyJ3MgdG9wIHN0YXJ0IGNvcm5lci5cbiAgICogVGhpcyBtdXN0IGJlIGFkanVzdGVkIHRvIGFsaWduIHRoZSBzZWxlY3RlZCBvcHRpb24gdGV4dCBvdmVyIHRoZSB0cmlnZ2VyIHRleHQgd2hlblxuICAgKiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIExUUiBvciBSVEwgdGV4dCBkaXJlY3Rpb24uIE5vdGUgdGhhdCB0aGUgb2Zmc2V0XG4gICAqIGNhbid0IGJlIGNhbGN1bGF0ZWQgdW50aWwgdGhlIHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLCBiZWNhdXNlIHdlIG5lZWQgdG8ga25vdyB0aGVcbiAgICogY29udGVudCB3aWR0aCBpbiBvcmRlciB0byBjb25zdHJhaW4gdGhlIHBhbmVsIHdpdGhpbiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WCgpOiB2b2lkIHtcbiAgICBjb25zdCBvdmVybGF5UmVjdCA9IHRoaXMub3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHZpZXdwb3J0U2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuZ2V0Vmlld3BvcnRTaXplKCk7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLl9pc1J0bCgpO1xuICAgIGNvbnN0IHBhZGRpbmdXaWR0aCA9IHRoaXMubXVsdGlwbGUgPyBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YICsgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuICAgIGxldCBvZmZzZXRYOiBudW1iZXI7XG5cbiAgICAvLyBBZGp1c3QgdGhlIG9mZnNldCwgZGVwZW5kaW5nIG9uIHRoZSBvcHRpb24gcGFkZGluZy5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgb2Zmc2V0WCA9IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1g7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdIHx8IHRoaXMub3B0aW9ucy5maXJzdDtcbiAgICAgIG9mZnNldFggPSBzZWxlY3RlZCAmJiBzZWxlY3RlZC5ncm91cCA/IFNFTEVDVF9QQU5FTF9JTkRFTlRfUEFERElOR19YIDogU0VMRUNUX1BBTkVMX1BBRERJTkdfWDtcbiAgICB9XG5cbiAgICAvLyBJbnZlcnQgdGhlIG9mZnNldCBpbiBMVFIuXG4gICAgaWYgKCFpc1J0bCkge1xuICAgICAgb2Zmc2V0WCAqPSAtMTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggdGhlIHNlbGVjdCBvdmVyZmxvd3Mgb24gZWFjaCBzaWRlLlxuICAgIGNvbnN0IGxlZnRPdmVyZmxvdyA9IDAgLSAob3ZlcmxheVJlY3QubGVmdCArIG9mZnNldFggLSAoaXNSdGwgPyBwYWRkaW5nV2lkdGggOiAwKSk7XG4gICAgY29uc3QgcmlnaHRPdmVyZmxvdyA9IG92ZXJsYXlSZWN0LnJpZ2h0ICsgb2Zmc2V0WCAtIHZpZXdwb3J0U2l6ZS53aWR0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICArIChpc1J0bCA/IDAgOiBwYWRkaW5nV2lkdGgpO1xuXG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgb3ZlcmZsb3dzIG9uIGVpdGhlciBzaWRlLCByZWR1Y2UgdGhlIG9mZnNldCB0byBhbGxvdyBpdCB0byBmaXQuXG4gICAgaWYgKGxlZnRPdmVyZmxvdyA+IDApIHtcbiAgICAgIG9mZnNldFggKz0gbGVmdE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfSBlbHNlIGlmIChyaWdodE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCAtPSByaWdodE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvZmZzZXQgZGlyZWN0bHkgaW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGdvIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbiBhbmRcbiAgICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIFwiY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycy4gUm91bmQgdGhlIHZhbHVlIHRvIGF2b2lkXG4gICAgLy8gYmx1cnJ5IGNvbnRlbnQgaW4gc29tZSBicm93c2Vycy5cbiAgICB0aGlzLm92ZXJsYXlEaXIub2Zmc2V0WCA9IE1hdGgucm91bmQob2Zmc2V0WCk7XG4gICAgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSB5LW9mZnNldCBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGVcbiAgICogdG9wIHN0YXJ0IGNvcm5lciBvZiB0aGUgdHJpZ2dlci4gSXQgaGFzIHRvIGJlIGFkanVzdGVkIGluIG9yZGVyIGZvciB0aGVcbiAgICogc2VsZWN0ZWQgb3B0aW9uIHRvIGJlIGFsaWduZWQgb3ZlciB0aGUgdHJpZ2dlciB3aGVuIHRoZSBwYW5lbCBvcGVucy5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRZKHNlbGVjdGVkSW5kZXg6IG51bWJlciwgc2Nyb2xsQnVmZmVyOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbWF4T3B0aW9uc0Rpc3BsYXllZCA9IE1hdGguZmxvb3IoU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgLyBpdGVtSGVpZ2h0KTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wOiBudW1iZXI7XG5cbiAgICAvLyBEaXNhYmxlIG9mZnNldCBpZiByZXF1ZXN0ZWQgYnkgdXNlciBieSByZXR1cm5pbmcgMCBhcyB2YWx1ZSB0byBvZmZzZXRcbiAgICBpZiAodGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gMCkge1xuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWRJbmRleCAqIGl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9zY3JvbGxUb3AgPT09IG1heFNjcm9sbCkge1xuICAgICAgY29uc3QgZmlyc3REaXNwbGF5ZWRJbmRleCA9IHRoaXMuX2dldEl0ZW1Db3VudCgpIC0gbWF4T3B0aW9uc0Rpc3BsYXllZDtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRGlzcGxheUluZGV4ID0gc2VsZWN0ZWRJbmRleCAtIGZpcnN0RGlzcGxheWVkSW5kZXg7XG5cbiAgICAgIC8vIFRoZSBmaXJzdCBpdGVtIGlzIHBhcnRpYWxseSBvdXQgb2YgdGhlIHZpZXdwb3J0LiBUaGVyZWZvcmUgd2UgbmVlZCB0byBjYWxjdWxhdGUgd2hhdFxuICAgICAgLy8gcG9ydGlvbiBvZiBpdCBpcyBzaG93biBpbiB0aGUgdmlld3BvcnQgYW5kIGFjY291bnQgZm9yIGl0IGluIG91ciBvZmZzZXQuXG4gICAgICBsZXQgcGFydGlhbEl0ZW1IZWlnaHQgPVxuICAgICAgICAgIGl0ZW1IZWlnaHQgLSAodGhpcy5fZ2V0SXRlbUNvdW50KCkgKiBpdGVtSGVpZ2h0IC0gU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpICUgaXRlbUhlaWdodDtcblxuICAgICAgLy8gQmVjYXVzZSB0aGUgcGFuZWwgaGVpZ2h0IGlzIGxvbmdlciB0aGFuIHRoZSBoZWlnaHQgb2YgdGhlIG9wdGlvbnMgYWxvbmUsXG4gICAgICAvLyB0aGVyZSBpcyBhbHdheXMgZXh0cmEgcGFkZGluZyBhdCB0aGUgdG9wIG9yIGJvdHRvbSBvZiB0aGUgcGFuZWwuIFdoZW5cbiAgICAgIC8vIHNjcm9sbGVkIHRvIHRoZSB2ZXJ5IGJvdHRvbSwgdGhpcyBwYWRkaW5nIGlzIGF0IHRoZSB0b3Agb2YgdGhlIHBhbmVsIGFuZFxuICAgICAgLy8gbXVzdCBiZSBhZGRlZCB0byB0aGUgb2Zmc2V0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2VsZWN0ZWREaXNwbGF5SW5kZXggKiBpdGVtSGVpZ2h0ICsgcGFydGlhbEl0ZW1IZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBvcHRpb24gd2FzIHNjcm9sbGVkIHRvIHRoZSBtaWRkbGUgb2YgdGhlIHBhbmVsIHVzaW5nIGEgc2Nyb2xsIGJ1ZmZlcixcbiAgICAgIC8vIGl0cyBvZmZzZXQgd2lsbCBiZSB0aGUgc2Nyb2xsIGJ1ZmZlciBtaW51cyB0aGUgaGFsZiBoZWlnaHQgdGhhdCB3YXMgYWRkZWQgdG9cbiAgICAgIC8vIGNlbnRlciBpdC5cbiAgICAgIG9wdGlvbk9mZnNldEZyb21QYW5lbFRvcCA9IHNjcm9sbEJ1ZmZlciAtIGl0ZW1IZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIFRoZSBmaW5hbCBvZmZzZXQgaXMgdGhlIG9wdGlvbidzIG9mZnNldCBmcm9tIHRoZSB0b3AsIGFkanVzdGVkIGZvciB0aGUgaGVpZ2h0IGRpZmZlcmVuY2UsXG4gICAgLy8gbXVsdGlwbGllZCBieSAtMSB0byBlbnN1cmUgdGhhdCB0aGUgb3ZlcmxheSBtb3ZlcyBpbiB0aGUgY29ycmVjdCBkaXJlY3Rpb24gdXAgdGhlIHBhZ2UuXG4gICAgLy8gVGhlIHZhbHVlIGlzIHJvdW5kZWQgdG8gcHJldmVudCBzb21lIGJyb3dzZXJzIGZyb20gYmx1cnJpbmcgdGhlIGNvbnRlbnQuXG4gICAgcmV0dXJuIE1hdGgucm91bmQob3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wICogLTEgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhhdCB0aGUgYXR0ZW1wdGVkIG92ZXJsYXkgcG9zaXRpb24gd2lsbCBmaXQgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICogSWYgaXQgd2lsbCBub3QgZml0LCB0cmllcyB0byBhZGp1c3QgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgdGhlIGFzc29jaWF0ZWRcbiAgICogeS1vZmZzZXQgc28gdGhlIHBhbmVsIGNhbiBvcGVuIGZ1bGx5IG9uLXNjcmVlbi4gSWYgaXQgc3RpbGwgd29uJ3QgZml0LFxuICAgKiBzZXRzIHRoZSBvZmZzZXQgYmFjayB0byAwIHRvIGFsbG93IHRoZSBmYWxsYmFjayBwb3NpdGlvbiB0byB0YWtlIG92ZXIuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja092ZXJsYXlXaXRoaW5WaWV3cG9ydChtYXhTY3JvbGw6IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRTaXplID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNpemUoKTtcblxuICAgIGNvbnN0IHRvcFNwYWNlQXZhaWxhYmxlID0gdGhpcy5fdHJpZ2dlclJlY3QudG9wIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgY29uc3QgYm90dG9tU3BhY2VBdmFpbGFibGUgPVxuICAgICAgICB2aWV3cG9ydFNpemUuaGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuYm90dG9tIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG5cbiAgICBjb25zdCBwYW5lbEhlaWdodFRvcCA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpO1xuICAgIGNvbnN0IHRvdGFsUGFuZWxIZWlnaHQgPVxuICAgICAgICBNYXRoLm1pbih0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBwYW5lbEhlaWdodEJvdHRvbSA9IHRvdGFsUGFuZWxIZWlnaHQgLSBwYW5lbEhlaWdodFRvcCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodDtcblxuICAgIGlmIChwYW5lbEhlaWdodEJvdHRvbSA+IGJvdHRvbVNwYWNlQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLl9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tLCBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG4gICAgfSBlbHNlIGlmIChwYW5lbEhlaWdodFRvcCA+IHRvcFNwYWNlQXZhaWxhYmxlKSB7XG4gICAgIHRoaXMuX2FkanVzdFBhbmVsRG93bihwYW5lbEhlaWdodFRvcCwgdG9wU3BhY2VBdmFpbGFibGUsIG1heFNjcm9sbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRqdXN0cyB0aGUgb3ZlcmxheSBwYW5lbCB1cCB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tOiBudW1iZXIsIGJvdHRvbVNwYWNlQXZhaWxhYmxlOiBudW1iZXIpIHtcbiAgICAvLyBCcm93c2VycyBpZ25vcmUgZnJhY3Rpb25hbCBzY3JvbGwgb2Zmc2V0cywgc28gd2UgbmVlZCB0byByb3VuZC5cbiAgICBjb25zdCBkaXN0YW5jZUJlbG93Vmlld3BvcnQgPSBNYXRoLnJvdW5kKHBhbmVsSGVpZ2h0Qm90dG9tIC0gYm90dG9tU3BhY2VBdmFpbGFibGUpO1xuXG4gICAgLy8gU2Nyb2xscyB0aGUgcGFuZWwgdXAgYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgdXAgaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZIC09IGRpc3RhbmNlQmVsb3dWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgdG9wLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGUgcGFuZWxcbiAgICAvLyBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2VcbiAgICAvLyBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA8PSAwKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIGJvdHRvbSAwcHhgO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIGRvd24gdG8gZml0IGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wOiBudW1iZXIsIHRvcFNwYWNlQXZhaWxhYmxlOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQWJvdmVWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRUb3AgLSB0b3BTcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCBkb3duIGJ5IHRoZSBkaXN0YW5jZSBpdCB3YXMgZXh0ZW5kaW5nIHBhc3QgdGhlIGJvdW5kYXJ5LCB0aGVuXG4gICAgLy8gYWRqdXN0cyB0aGUgb2Zmc2V0IGJ5IHRoYXQgYW1vdW50IHRvIG1vdmUgdGhlIHBhbmVsIGRvd24gaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGVcbiAgICAvLyBwYW5lbCBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uXG4gICAgLy8gdG8gdGFrZSBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IG1heFNjcm9sbDtcbiAgICAgIHRoaXMuX29mZnNldFkgPSAwO1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gYDUwJSB0b3AgMHB4YDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdHJhbnNmb3JtIG9yaWdpbiBwb2ludCBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgb3B0aW9uLiAqL1xuICBwcml2YXRlIF9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk6IHN0cmluZyB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25IZWlnaHRBZGp1c3RtZW50ID0gKGl0ZW1IZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5oZWlnaHQpIC8gMjtcbiAgICBjb25zdCBvcmlnaW5ZID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSkgLSBvcHRpb25IZWlnaHRBZGp1c3RtZW50ICsgaXRlbUhlaWdodCAvIDI7XG4gICAgcmV0dXJuIGA1MCUgJHtvcmlnaW5ZfXB4IDBweGA7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgYW1vdW50IG9mIGl0ZW1zIGluIHRoZSBzZWxlY3QuIFRoaXMgaW5jbHVkZXMgb3B0aW9ucyBhbmQgZ3JvdXAgbGFiZWxzLiAqL1xuICBwcml2YXRlIF9nZXRJdGVtQ291bnQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxlbmd0aCArIHRoaXMub3B0aW9uR3JvdXBzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldEl0ZW1IZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHJpZ2dlckZvbnRTaXplICogU0VMRUNUX0lURU1fSEVJR0hUX0VNO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgc2V0RGVzY3JpYmVkQnlJZHMoaWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX2FyaWFEZXNjcmliZWRieSA9IGlkcy5qb2luKCcgJyk7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBvbkNvbnRhaW5lckNsaWNrKCkge1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgICB0aGlzLm9wZW4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCBzaG91bGRMYWJlbEZsb2F0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW4gfHwgIXRoaXMuZW1wdHk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcmVxdWlyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX211bHRpcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOiBOdW1iZXJJbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV90YWJJbmRleDogTnVtYmVySW5wdXQ7XG59XG4iXX0=