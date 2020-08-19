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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLDBCQUEwQixFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUVyQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQ0wsQ0FBQyxFQUNELFVBQVUsRUFDVixHQUFHLEVBQ0gsS0FBSyxFQUNMLGNBQWMsRUFDZCxJQUFJLEVBQ0osVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLG1CQUFtQixFQUVuQixPQUFPLEdBRVIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUVMLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFFVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLFNBQVMsRUFDVCxNQUFNLEVBSU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsSUFBSSxFQUVKLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF1QixrQkFBa0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0YsT0FBTyxFQUNM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RUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzJCQUk5QyxlQUFlLFNBQUMsWUFBbUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7eUJBR3hELEtBQUs7NEJBSUwsWUFBWSxTQUFDLGtCQUF5QjswQkFHdEMsS0FBSzt1QkFRTCxLQUFLO3VCQVFMLEtBQUs7cUNBV0wsS0FBSzswQkFXTCxLQUFLO29CQWNMLEtBQUs7d0JBY0wsS0FBSyxTQUFDLFlBQVk7NkJBR2xCLEtBQUssU0FBQyxpQkFBaUI7Z0NBR3ZCLEtBQUs7d0NBR0wsS0FBSzs2QkFXTCxLQUFLO2lCQUdMLEtBQUs7MkJBd0JMLE1BQU07NEJBR04sTUFBTSxTQUFDLFFBQVE7NEJBSWYsTUFBTSxTQUFDLFFBQVE7OEJBSWYsTUFBTTswQkFRTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXIsIExpdmVBbm5vdW5jZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7U2VsZWN0aW9uTW9kZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBBLFxuICBET1dOX0FSUk9XLFxuICBFTkQsXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgSE9NRSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIFNQQUNFLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENka0Nvbm5lY3RlZE92ZXJsYXksXG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIGlzRGV2TW9kZSxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNlbGYsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgRm9ybUdyb3VwRGlyZWN0aXZlLCBOZ0NvbnRyb2wsIE5nRm9ybX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24sXG4gIF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlLFxuICBDYW5VcGRhdGVFcnJvclN0YXRlQ3RvcixcbiAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gIEhhc1RhYkluZGV4LFxuICBIYXNUYWJJbmRleEN0b3IsXG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBNYXRPcHRpb25TZWxlY3Rpb25DaGFuZ2UsXG4gIG1peGluRGlzYWJsZWQsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5FcnJvclN0YXRlLFxuICBtaXhpblRhYkluZGV4LFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5cblxubGV0IG5leHRVbmlxdWVJZCA9IDA7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBzdHlsZSBjb25zdGFudHMgYXJlIG5lY2Vzc2FyeSB0byBzYXZlIGhlcmUgaW4gb3JkZXJcbiAqIHRvIHByb3Blcmx5IGNhbGN1bGF0ZSB0aGUgYWxpZ25tZW50IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gb3ZlclxuICogdGhlIHRyaWdnZXIgZWxlbWVudC5cbiAqL1xuXG4vKiogVGhlIG1heCBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG92ZXJsYXkgcGFuZWwgKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCA9IDI1NjtcblxuLyoqIFRoZSBwYW5lbCdzIHBhZGRpbmcgb24gdGhlIHgtYXhpcyAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggPSAxNjtcblxuLyoqIFRoZSBwYW5lbCdzIHggYXhpcyBwYWRkaW5nIGlmIGl0IGlzIGluZGVudGVkIChlLmcuIHRoZXJlIGlzIGFuIG9wdGlvbiBncm91cCkuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcblxuLyoqIFRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCBpdGVtcyBpbiBgZW1gIHVuaXRzLiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9JVEVNX0hFSUdIVF9FTSA9IDM7XG5cbi8vIFRPRE8oam9zZXBocGVycm90dCk6IFJldmVydCB0byBhIGNvbnN0YW50IGFmdGVyIDIwMTggc3BlYyB1cGRhdGVzIGFyZSBmdWxseSBtZXJnZWQuXG4vKipcbiAqIERpc3RhbmNlIGJldHdlZW4gdGhlIHBhbmVsIGVkZ2UgYW5kIHRoZSBvcHRpb24gdGV4dCBpblxuICogbXVsdGktc2VsZWN0aW9uIG1vZGUuXG4gKlxuICogQ2FsY3VsYXRlZCBhczpcbiAqIChTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41KSArIDE2ID0gNDBcbiAqIFRoZSBwYWRkaW5nIGlzIG11bHRpcGxpZWQgYnkgMS41IGJlY2F1c2UgdGhlIGNoZWNrYm94J3MgbWFyZ2luIGlzIGhhbGYgdGhlIHBhZGRpbmcuXG4gKiBUaGUgY2hlY2tib3ggd2lkdGggaXMgMTZweC5cbiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggPSBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMS41ICsgMTY7XG5cbi8qKlxuICogVGhlIHNlbGVjdCBwYW5lbCB3aWxsIG9ubHkgXCJmaXRcIiBpbnNpZGUgdGhlIHZpZXdwb3J0IGlmIGl0IGlzIHBvc2l0aW9uZWQgYXRcbiAqIHRoaXMgdmFsdWUgb3IgbW9yZSBhd2F5IGZyb20gdGhlIHZpZXdwb3J0IGJvdW5kYXJ5LlxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkcgPSA4O1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjwoKSA9PiBTY3JvbGxTdHJhdGVneT4oJ21hdC1zZWxlY3Qtc2Nyb2xsLXN0cmF0ZWd5Jyk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1lfUFJPVklERVJfRkFDVE9SWShvdmVybGF5OiBPdmVybGF5KTpcbiAgICAoKSA9PiBTY3JvbGxTdHJhdGVneSB7XG4gIHJldHVybiAoKSA9PiBvdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMucmVwb3NpdGlvbigpO1xufVxuXG4vKiogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBzZWxlY3QgbW9kdWxlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRTZWxlY3RDb25maWcge1xuICAvKiogV2hldGhlciBvcHRpb24gY2VudGVyaW5nIHNob3VsZCBiZSBkaXNhYmxlZC4gKi9cbiAgZGlzYWJsZU9wdGlvbkNlbnRlcmluZz86IGJvb2xlYW47XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgdHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbD86IG51bWJlcjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBjaGFuZ2UgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0U2VsZWN0LFxuICAgIC8qKiBDdXJyZW50IHZhbHVlIG9mIHRoZSBzZWxlY3QgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgdmFsdWU6IGFueSkgeyB9XG59XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0U2VsZWN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFNlbGVjdEJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICAgICAgICAgIHB1YmxpYyBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICAgICAgICAgICAgcHVibGljIF9wYXJlbnRGb3JtOiBOZ0Zvcm0sXG4gICAgICAgICAgICAgIHB1YmxpYyBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgICAgICAgICAgIHB1YmxpYyBuZ0NvbnRyb2w6IE5nQ29udHJvbCkge31cbn1cbmNvbnN0IF9NYXRTZWxlY3RNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJlxuICAgIEhhc1RhYkluZGV4Q3RvciAmXG4gICAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IgJlxuICAgIENhblVwZGF0ZUVycm9yU3RhdGVDdG9yICZcbiAgICB0eXBlb2YgTWF0U2VsZWN0QmFzZSA9XG4gICAgICAgIG1peGluRGlzYWJsZVJpcHBsZShtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZWQobWl4aW5FcnJvclN0YXRlKE1hdFNlbGVjdEJhc2UpKSkpO1xuXG5cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKipcbiAqIEFsbG93cyB0aGUgdXNlciB0byBjdXN0b21pemUgdGhlIHRyaWdnZXIgdGhhdCBpcyBkaXNwbGF5ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBhIHZhbHVlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtc2VsZWN0LXRyaWdnZXInLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX1NFTEVDVF9UUklHR0VSLCB1c2VFeGlzdGluZzogTWF0U2VsZWN0VHJpZ2dlcn1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RUcmlnZ2VyIHt9XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdCcsXG4gIGV4cG9ydEFzOiAnbWF0U2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICdzZWxlY3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzZWxlY3QuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJywgJ3RhYkluZGV4J10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ3JvbGUnOiAnbGlzdGJveCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCcsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICd0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ19nZXRBcmlhTGFiZWwoKScsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxsZWRieV0nOiAnX2dldEFyaWFMYWJlbGxlZGJ5KCknLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtb3duc10nOiAncGFuZWxPcGVuID8gX29wdGlvbklkcyA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLW11bHRpc2VsZWN0YWJsZV0nOiAnbXVsdGlwbGUnLFxuICAgICdbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XSc6ICdfYXJpYURlc2NyaWJlZGJ5IHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ19nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LXJlcXVpcmVkXSc6ICdyZXF1aXJlZCcsXG4gICAgJ1tjbGFzcy5tYXQtc2VsZWN0LWVtcHR5XSc6ICdlbXB0eScsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3QnLFxuICAgICcoa2V5ZG93biknOiAnX2hhbmRsZUtleWRvd24oJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnX29uRm9jdXMoKScsXG4gICAgJyhibHVyKSc6ICdfb25CbHVyKCknLFxuICB9LFxuICBhbmltYXRpb25zOiBbXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFdyYXAsXG4gICAgbWF0U2VsZWN0QW5pbWF0aW9ucy50cmFuc2Zvcm1QYW5lbFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdH1cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0IGV4dGVuZHMgX01hdFNlbGVjdE1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIE9uSW5pdCwgRG9DaGVjaywgQ29udHJvbFZhbHVlQWNjZXNzb3IsIENhbkRpc2FibGUsIEhhc1RhYkluZGV4LFxuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55PiwgQ2FuVXBkYXRlRXJyb3JTdGF0ZSwgQ2FuRGlzYWJsZVJpcHBsZSB7XG4gIHByaXZhdGUgX3Njcm9sbFN0cmF0ZWd5RmFjdG9yeTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIHByaXZhdGUgX3BhbmVsT3BlbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIGZpbGxpbmcgb3V0IHRoZSBzZWxlY3QgaXMgcmVxdWlyZWQgaW4gdGhlIGZvcm0uICovXG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgcGFuZWwsIGNhbGN1bGF0ZWQgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIFRoZSBwbGFjZWhvbGRlciBkaXNwbGF5ZWQgaW4gdGhlIHRyaWdnZXIgb2YgdGhlIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGluIG11bHRpcGxlIHNlbGVjdGlvbiBtb2RlLiAqL1xuICBwcml2YXRlIF9tdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBDb21wYXJpc29uIGZ1bmN0aW9uIHRvIHNwZWNpZnkgd2hpY2ggb3B0aW9uIGlzIGRpc3BsYXllZC4gRGVmYXVsdHMgdG8gb2JqZWN0IGVxdWFsaXR5LiAqL1xuICBwcml2YXRlIF9jb21wYXJlV2l0aCA9IChvMTogYW55LCBvMjogYW55KSA9PiBvMSA9PT0gbzI7XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhpcyBpbnB1dC4gKi9cbiAgcHJpdmF0ZSBfdWlkID0gYG1hdC1zZWxlY3QtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGZvciB0aGUgdHJpZ2dlcidzIGNsaWVudCBib3VuZGluZyByZWN0LiAqL1xuICBfdHJpZ2dlclJlY3Q6IENsaWVudFJlY3Q7XG5cbiAgLyoqIFRoZSBhcmlhLWRlc2NyaWJlZGJ5IGF0dHJpYnV0ZSBvbiB0aGUgc2VsZWN0IGZvciBpbXByb3ZlZCBhMTF5LiAqL1xuICBfYXJpYURlc2NyaWJlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBjYWNoZWQgZm9udC1zaXplIG9mIHRoZSB0cmlnZ2VyIGVsZW1lbnQuICovXG4gIF90cmlnZ2VyRm9udFNpemUgPSAwO1xuXG4gIC8qKiBEZWFscyB3aXRoIHRoZSBzZWxlY3Rpb24gbG9naWMuICovXG4gIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPjtcblxuICAvKiogTWFuYWdlcyBrZXlib2FyZCBldmVudHMgZm9yIG9wdGlvbnMgaW4gdGhlIHBhbmVsLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogYFZpZXcgLT4gbW9kZWwgY2FsbGJhY2sgY2FsbGVkIHdoZW4gdmFsdWUgY2hhbmdlc2AgKi9cbiAgX29uQ2hhbmdlOiAodmFsdWU6IGFueSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiBzZWxlY3QgaGFzIGJlZW4gdG91Y2hlZGAgKi9cbiAgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKiBUaGUgSURzIG9mIGNoaWxkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIHRoZSBhcmlhLW93bnMgYXR0cmlidXRlLiAqL1xuICBfb3B0aW9uSWRzOiBzdHJpbmcgPSAnJztcblxuICAvKiogVGhlIHZhbHVlIG9mIHRoZSBzZWxlY3QgcGFuZWwncyB0cmFuc2Zvcm0tb3JpZ2luIHByb3BlcnR5LiAqL1xuICBfdHJhbnNmb3JtT3JpZ2luOiBzdHJpbmcgPSAndG9wJztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcGFuZWwgZWxlbWVudCBpcyBmaW5pc2hlZCB0cmFuc2Zvcm1pbmcgaW4uICovXG4gIF9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW0gPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG5cbiAgLyoqIFN0cmF0ZWd5IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGhhbmRsZSBzY3JvbGxpbmcgd2hpbGUgdGhlIHNlbGVjdCBwYW5lbCBpcyBvcGVuLiAqL1xuICBfc2Nyb2xsU3RyYXRlZ3k6IFNjcm9sbFN0cmF0ZWd5O1xuXG4gIC8qKlxuICAgKiBUaGUgeS1vZmZzZXQgb2YgdGhlIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlIHRyaWdnZXIncyB0b3Agc3RhcnQgY29ybmVyLlxuICAgKiBUaGlzIG11c3QgYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIHNlbGVjdGVkIG9wdGlvbiB0ZXh0IG92ZXIgdGhlIHRyaWdnZXIgdGV4dC5cbiAgICogd2hlbiB0aGUgcGFuZWwgb3BlbnMuIFdpbGwgY2hhbmdlIGJhc2VkIG9uIHRoZSB5LXBvc2l0aW9uIG9mIHRoZSBzZWxlY3RlZCBvcHRpb24uXG4gICAqL1xuICBfb2Zmc2V0WSA9IDA7XG5cbiAgLyoqXG4gICAqIFRoaXMgcG9zaXRpb24gY29uZmlnIGVuc3VyZXMgdGhhdCB0aGUgdG9wIFwic3RhcnRcIiBjb3JuZXIgb2YgdGhlIG92ZXJsYXlcbiAgICogaXMgYWxpZ25lZCB3aXRoIHdpdGggdGhlIHRvcCBcInN0YXJ0XCIgb2YgdGhlIG9yaWdpbiBieSBkZWZhdWx0IChvdmVybGFwcGluZ1xuICAgKiB0aGUgdHJpZ2dlciBjb21wbGV0ZWx5KS4gSWYgdGhlIHBhbmVsIGNhbm5vdCBmaXQgYmVsb3cgdGhlIHRyaWdnZXIsIGl0XG4gICAqIHdpbGwgZmFsbCBiYWNrIHRvIGEgcG9zaXRpb24gYWJvdmUgdGhlIHRyaWdnZXIuXG4gICAqL1xuICBfcG9zaXRpb25zOiBDb25uZWN0ZWRQb3NpdGlvbltdID0gW1xuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgIH0sXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgfSxcbiAgXTtcblxuICAvKiogV2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGluZyBjZW50ZXJpbmcgb2YgdGhlIGFjdGl2ZSBvcHRpb24gb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfZGlzYWJsZU9wdGlvbkNlbnRlcmluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZm9jdXNlZC4gKi9cbiAgZ2V0IGZvY3VzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZvY3VzZWQgfHwgdGhpcy5fcGFuZWxPcGVuO1xuICB9XG4gIHByaXZhdGUgX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAvKiogQSBuYW1lIGZvciB0aGlzIGNvbnRyb2wgdGhhdCBjYW4gYmUgdXNlZCBieSBgbWF0LWZvcm0tZmllbGRgLiAqL1xuICBjb250cm9sVHlwZSA9ICdtYXQtc2VsZWN0JztcblxuICAvKiogVHJpZ2dlciB0aGF0IG9wZW5zIHRoZSBzZWxlY3QuICovXG4gIEBWaWV3Q2hpbGQoJ3RyaWdnZXInKSB0cmlnZ2VyOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBQYW5lbCBjb250YWluaW5nIHRoZSBzZWxlY3Qgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKipcbiAgICogT3ZlcmxheSBwYW5lIGNvbnRhaW5pbmcgdGhlIG9wdGlvbnMuXG4gICAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgcHJpdmF0ZSBBUEkuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBWaWV3Q2hpbGQoQ2RrQ29ubmVjdGVkT3ZlcmxheSkgb3ZlcmxheURpcjogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcblxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIHNlbGVjdCBvcHRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgLy8gVE9ETzogUmVtb3ZlIGNhc3Qgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMzc1MDYgaXMgYXZhaWxhYmxlLlxuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIGdyb3VwcyBvZiBvcHRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9PUFRHUk9VUCBhcyBhbnksIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHNlbGVjdCBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nfHN0cmluZ1tdfFNldDxzdHJpbmc+fHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8vIFRPRE86IFJlbW92ZSBjYXN0IG9uY2UgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9wdWxsLzM3NTA2IGlzIGF2YWlsYWJsZS5cbiAgLyoqIFVzZXItc3VwcGxpZWQgb3ZlcnJpZGUgb2YgdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgQENvbnRlbnRDaGlsZChNQVRfU0VMRUNUX1RSSUdHRVIgYXMgYW55KSBjdXN0b21UcmlnZ2VyOiBNYXRTZWxlY3RUcmlnZ2VyO1xuXG4gIC8qKiBQbGFjZWhvbGRlciB0byBiZSBzaG93biBpZiBubyB2YWx1ZSBoYXMgYmVlbiBzZWxlY3RlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBsYWNlaG9sZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9wbGFjZWhvbGRlcjsgfVxuICBzZXQgcGxhY2Vob2xkZXIodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyByZXF1aXJlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBvcHRpb25zLiAqL1xuICBASW5wdXQoKVxuICBnZXQgbXVsdGlwbGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tdWx0aXBsZTsgfVxuICBzZXQgbXVsdGlwbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcbiAgICAgIHRocm93IGdldE1hdFNlbGVjdER5bmFtaWNNdWx0aXBsZUVycm9yKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbXVsdGlwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdG8gY2VudGVyIHRoZSBhY3RpdmUgb3B0aW9uIG92ZXIgdGhlIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZGlzYWJsZU9wdGlvbkNlbnRlcmluZzsgfVxuICBzZXQgZGlzYWJsZU9wdGlvbkNlbnRlcmluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVPcHRpb25DZW50ZXJpbmcgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgdGhlIG9wdGlvbiB2YWx1ZXMgd2l0aCB0aGUgc2VsZWN0ZWQgdmFsdWVzLiBUaGUgZmlyc3QgYXJndW1lbnRcbiAgICogaXMgYSB2YWx1ZSBmcm9tIGFuIG9wdGlvbi4gVGhlIHNlY29uZCBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGlvbi4gQSBib29sZWFuXG4gICAqIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHsgcmV0dXJuIHRoaXMuX2NvbXBhcmVXaXRoOyB9XG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcbiAgICAgIC8vIEEgZGlmZmVyZW50IGNvbXBhcmF0b3IgbWVhbnMgdGhlIHNlbGVjdGlvbiBjb3VsZCBjaGFuZ2UuXG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFZhbHVlIG9mIHRoZSBzZWxlY3QgY29udHJvbC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLl92YWx1ZTsgfVxuICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0aW9uQnlWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnk7XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIHNlbGVjdC4gSWYgbm90IHNwZWNpZmllZCwgdGhlIHBsYWNlaG9sZGVyIHdpbGwgYmUgdXNlZCBhcyBsYWJlbC4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogT2JqZWN0IHVzZWQgdG8gY29udHJvbCB3aGVuIGVycm9yIG1lc3NhZ2VzIGFyZSBzaG93bi4gKi9cbiAgQElucHV0KCkgZXJyb3JTdGF0ZU1hdGNoZXI6IEVycm9yU3RhdGVNYXRjaGVyO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIEBJbnB1dCgpXG4gIGdldCB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsOyB9XG4gIHNldCB0eXBlYWhlYWREZWJvdW5jZUludGVydmFsKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl90eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IG51bWJlcjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzb3J0IHRoZSB2YWx1ZXMgaW4gYSBzZWxlY3QgaW4gbXVsdGlwbGUgbW9kZS5cbiAgICogRm9sbG93cyB0aGUgc2FtZSBsb2dpYyBhcyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLlxuICAgKi9cbiAgQElucHV0KCkgc29ydENvbXBhcmF0b3I6IChhOiBNYXRPcHRpb24sIGI6IE1hdE9wdGlvbiwgb3B0aW9uczogTWF0T3B0aW9uW10pID0+IG51bWJlcjtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2lkOyB9XG4gIHNldCBpZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZSB8fCB0aGlzLl91aWQ7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX2lkOiBzdHJpbmc7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIG9wdGlvbnMnIGNoYW5nZSBldmVudHMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbkNoYW5nZXM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fbmdab25lLm9uU3RhYmxlXG4gICAgICAucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzKSk7XG4gIH0pIGFzIE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPjtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgcGFuZWwgaGFzIGJlZW4gdG9nZ2xlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPVxuICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UucGlwZShmaWx0ZXIobyA9PiBvKSwgbWFwKCgpID0+IHt9KSk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLm9wZW5lZENoYW5nZS5waXBlKGZpbHRlcihvID0+ICFvKSwgbWFwKCgpID0+IHt9KSk7XG5cbiAgIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdGVkIHZhbHVlIGhhcyBiZWVuIGNoYW5nZWQgYnkgdGhlIHVzZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxNYXRTZWxlY3RDaGFuZ2U+ID1cbiAgICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNlbGVjdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgQE9wdGlvbmFsKCkgX3BhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBfcGFyZW50Rm9ybUdyb3VwOiBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRCkgcHJpdmF0ZSBfcGFyZW50Rm9ybUZpZWxkOiBNYXRGb3JtRmllbGQsXG4gICAgQFNlbGYoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbmdDb250cm9sOiBOZ0NvbnRyb2wsXG4gICAgQEF0dHJpYnV0ZSgndGFiaW5kZXgnKSB0YWJJbmRleDogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kpIHNjcm9sbFN0cmF0ZWd5RmFjdG9yeTogYW55LFxuICAgIHByaXZhdGUgX2xpdmVBbm5vdW5jZXI6IExpdmVBbm5vdW5jZXIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfU0VMRUNUX0NPTkZJRykgZGVmYXVsdHM/OiBNYXRTZWxlY3RDb25maWcpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBfZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLCBfcGFyZW50Rm9ybSxcbiAgICAgICAgICBfcGFyZW50Rm9ybUdyb3VwLCBuZ0NvbnRyb2wpO1xuXG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICAvLyBOb3RlOiB3ZSBwcm92aWRlIHRoZSB2YWx1ZSBhY2Nlc3NvciB0aHJvdWdoIGhlcmUsIGluc3RlYWQgb2ZcbiAgICAgIC8vIHRoZSBgcHJvdmlkZXJzYCB0byBhdm9pZCBydW5uaW5nIGludG8gYSBjaXJjdWxhciBpbXBvcnQuXG4gICAgICB0aGlzLm5nQ29udHJvbC52YWx1ZUFjY2Vzc29yID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9zY3JvbGxTdHJhdGVneUZhY3RvcnkgPSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3kgPSB0aGlzLl9zY3JvbGxTdHJhdGVneUZhY3RvcnkoKTtcbiAgICB0aGlzLnRhYkluZGV4ID0gcGFyc2VJbnQodGFiSW5kZXgpIHx8IDA7XG5cbiAgICAvLyBGb3JjZSBzZXR0ZXIgdG8gYmUgY2FsbGVkIGluIGNhc2UgaWQgd2FzIG5vdCBzcGVjaWZpZWQuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQ7XG5cbiAgICBpZiAoZGVmYXVsdHMpIHtcbiAgICAgIGlmIChkZWZhdWx0cy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gZGVmYXVsdHMuZGlzYWJsZU9wdGlvbkNlbnRlcmluZztcbiAgICAgIH1cblxuICAgICAgaWYgKGRlZmF1bHRzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgPSBkZWZhdWx0cy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdE9wdGlvbj4odGhpcy5tdWx0aXBsZSk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuXG4gICAgLy8gV2UgbmVlZCBgZGlzdGluY3RVbnRpbENoYW5nZWRgIGhlcmUsIGJlY2F1c2Ugc29tZSBicm93c2VycyB3aWxsXG4gICAgLy8gZmlyZSB0aGUgYW5pbWF0aW9uIGVuZCBldmVudCB0d2ljZSBmb3IgdGhlIHNhbWUgYW5pbWF0aW9uLiBTZWU6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW1cbiAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICB0aGlzLl9zY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIHRoaXMub3BlbmVkQ2hhbmdlLmVtaXQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcGVuZWRDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgICAgdGhpcy5vdmVybGF5RGlyLm9mZnNldFggPSAwO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuX3ZpZXdwb3J0UnVsZXIuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICAgICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5faW5pdEtleU1hbmFnZXIoKTtcblxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5hZGRlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0KCkpO1xuICAgICAgZXZlbnQucmVtb3ZlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uZGVzZWxlY3QoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRPcHRpb25zKCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMubmdDb250cm9sKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gVXBkYXRpbmcgdGhlIGRpc2FibGVkIHN0YXRlIGlzIGhhbmRsZWQgYnkgYG1peGluRGlzYWJsZWRgLCBidXQgd2UgbmVlZCB0byBhZGRpdGlvbmFsbHkgbGV0XG4gICAgLy8gdGhlIHBhcmVudCBmb3JtIGZpZWxkIGtub3cgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgY2hhbmdlcy5cbiAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXSkge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWyd0eXBlYWhlYWREZWJvdW5jZUludGVydmFsJ10gJiYgdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoVHlwZUFoZWFkKHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIG92ZXJsYXkgcGFuZWwgb3BlbiBvciBjbG9zZWQuICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkIHx8ICF0aGlzLm9wdGlvbnMgfHwgIXRoaXMub3B0aW9ucy5sZW5ndGggfHwgdGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fdHJpZ2dlclJlY3QgPSB0aGlzLnRyaWdnZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAvLyBOb3RlOiBUaGUgY29tcHV0ZWQgZm9udC1zaXplIHdpbGwgYmUgYSBzdHJpbmcgcGl4ZWwgdmFsdWUgKGUuZy4gXCIxNnB4XCIpLlxuICAgIC8vIGBwYXJzZUludGAgaWdub3JlcyB0aGUgdHJhaWxpbmcgJ3B4JyBhbmQgY29udmVydHMgdGhpcyB0byBhIG51bWJlci5cbiAgICB0aGlzLl90cmlnZ2VyRm9udFNpemUgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50KS5mb250U2l6ZSB8fCAnMCcpO1xuXG4gICAgdGhpcy5fcGFuZWxPcGVuID0gdHJ1ZTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24obnVsbCk7XG4gICAgdGhpcy5fY2FsY3VsYXRlT3ZlcmxheVBvc2l0aW9uKCk7XG4gICAgdGhpcy5faGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgLy8gU2V0IHRoZSBmb250IHNpemUgb24gdGhlIHBhbmVsIGVsZW1lbnQgb25jZSBpdCBleGlzdHMuXG4gICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl90cmlnZ2VyRm9udFNpemUgJiYgdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYgJiZcbiAgICAgICAgICB0aGlzLm92ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudCkge1xuICAgICAgICB0aGlzLm92ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IGAke3RoaXMuX3RyaWdnZXJGb250U2l6ZX1weGA7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBvdmVybGF5IHBhbmVsIGFuZCBmb2N1c2VzIHRoZSBob3N0IGVsZW1lbnQuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX3BhbmVsT3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2lzUnRsKCkgPyAncnRsJyA6ICdsdHInKTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlbGVjdCdzIHZhbHVlLiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcbiAgICogcmVxdWlyZWQgdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgTmV3IHZhbHVlIHRvIGJlIHdyaXR0ZW4gdG8gdGhlIG1vZGVsLlxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGZyb20gdXNlciBpbnB1dC4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzZWxlY3QgaXMgYmx1cnJlZFxuICAgKiBieSB0aGUgdXNlci4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlIHJlcXVpcmVkXG4gICAqIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIGZuIENhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBjb21wb25lbnQgaGFzIGJlZW4gdG91Y2hlZC5cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBzZWxlY3QuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFNldHMgd2hldGhlciB0aGUgY29tcG9uZW50IGlzIGRpc2FibGVkLlxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgb3Igbm90IHRoZSBvdmVybGF5IHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBwYW5lbE9wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuXG4gIC8qKiBUaGUgY3VycmVudGx5IHNlbGVjdGVkIG9wdGlvbi4gKi9cbiAgZ2V0IHNlbGVjdGVkKCk6IE1hdE9wdGlvbiB8IE1hdE9wdGlvbltdIHtcbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF07XG4gIH1cblxuICAvKiogVGhlIHZhbHVlIGRpc3BsYXllZCBpbiB0aGUgdHJpZ2dlci4gKi9cbiAgZ2V0IHRyaWdnZXJWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX211bHRpcGxlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZC5tYXAob3B0aW9uID0+IG9wdGlvbi52aWV3VmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5faXNSdGwoKSkge1xuICAgICAgICBzZWxlY3RlZE9wdGlvbnMucmV2ZXJzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPKGNyaXNiZXRvKTogZGVsaW1pdGVyIHNob3VsZCBiZSBjb25maWd1cmFibGUgZm9yIHByb3BlciBsb2NhbGl6YXRpb24uXG4gICAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25zLmpvaW4oJywgJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IGlzIGluIFJUTCBtb2RlLiAqL1xuICBfaXNSdGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGFsbCBrZXlkb3duIGV2ZW50cyBvbiB0aGUgc2VsZWN0LiAqL1xuICBfaGFuZGxlS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5wYW5lbE9wZW4gPyB0aGlzLl9oYW5kbGVPcGVuS2V5ZG93bihldmVudCkgOiB0aGlzLl9oYW5kbGVDbG9zZWRLZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hpbGUgdGhlIHNlbGVjdCBpcyBjbG9zZWQuICovXG4gIHByaXZhdGUgX2hhbmRsZUNsb3NlZEtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVyB8fFxuICAgICAgICAgICAgICAgICAgICAgICBrZXlDb2RlID09PSBMRUZUX0FSUk9XIHx8IGtleUNvZGUgPT09IFJJR0hUX0FSUk9XO1xuICAgIGNvbnN0IGlzT3BlbktleSA9IGtleUNvZGUgPT09IEVOVEVSIHx8IGtleUNvZGUgPT09IFNQQUNFO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gT3BlbiB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgaWYgKCFtYW5hZ2VyLmlzVHlwaW5nKCkgJiYgKGlzT3BlbktleSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB8fFxuICAgICAgKCh0aGlzLm11bHRpcGxlIHx8IGV2ZW50LmFsdEtleSkgJiYgaXNBcnJvd0tleSkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIHByZXZlbnRzIHRoZSBwYWdlIGZyb20gc2Nyb2xsaW5nIGRvd24gd2hlbiBwcmVzc2luZyBzcGFjZVxuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3QgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uID0gdGhpcy5zZWxlY3RlZDtcblxuICAgICAgaWYgKGtleUNvZGUgPT09IEhPTUUgfHwga2V5Q29kZSA9PT0gRU5EKSB7XG4gICAgICAgIGtleUNvZGUgPT09IEhPTUUgPyBtYW5hZ2VyLnNldEZpcnN0SXRlbUFjdGl2ZSgpIDogbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG5cbiAgICAgIC8vIFNpbmNlIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZCwgd2UgbmVlZCB0byBhbm5vdW5jZSBpdCBvdXJzZWx2ZXMuXG4gICAgICBpZiAoc2VsZWN0ZWRPcHRpb24gJiYgcHJldmlvdXNseVNlbGVjdGVkT3B0aW9uICE9PSBzZWxlY3RlZE9wdGlvbikge1xuICAgICAgICAvLyBXZSBzZXQgYSBkdXJhdGlvbiBvbiB0aGUgbGl2ZSBhbm5vdW5jZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgbGl2ZSBlbGVtZW50IHRvIGJlXG4gICAgICAgIC8vIGNsZWFyZWQgYWZ0ZXIgYSB3aGlsZSBzbyB0aGF0IHVzZXJzIGNhbid0IG5hdmlnYXRlIHRvIGl0IHVzaW5nIHRoZSBhcnJvdyBrZXlzLlxuICAgICAgICB0aGlzLl9saXZlQW5ub3VuY2VyLmFubm91bmNlKChzZWxlY3RlZE9wdGlvbiBhcyBNYXRPcHRpb24pLnZpZXdWYWx1ZSwgMTAwMDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGVuIHRoZSBzZWxlY3RlZCBpcyBvcGVuLiAqL1xuICBwcml2YXRlIF9oYW5kbGVPcGVuS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPSBrZXlDb2RlID09PSBET1dOX0FSUk9XIHx8IGtleUNvZGUgPT09IFVQX0FSUk9XO1xuICAgIGNvbnN0IGlzVHlwaW5nID0gbWFuYWdlci5pc1R5cGluZygpO1xuXG4gICAgaWYgKGtleUNvZGUgPT09IEhPTUUgfHwga2V5Q29kZSA9PT0gRU5EKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAga2V5Q29kZSA9PT0gSE9NRSA/IG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCkgOiBtYW5hZ2VyLnNldExhc3RJdGVtQWN0aXZlKCk7XG4gICAgfSBlbHNlIGlmIChpc0Fycm93S2V5ICYmIGV2ZW50LmFsdEtleSkge1xuICAgICAgLy8gQ2xvc2UgdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGluIHRoaXMgY2FzZSBpZiB0aGUgdXNlciBpcyB0eXBpbmcsXG4gICAgICAvLyBiZWNhdXNlIHRoZSB0eXBpbmcgc2VxdWVuY2UgY2FuIGluY2x1ZGUgdGhlIHNwYWNlIGtleS5cbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpICYmIG1hbmFnZXIuYWN0aXZlSXRlbSAmJlxuICAgICAgIWhhc01vZGlmaWVyS2V5KGV2ZW50KSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICB9IGVsc2UgaWYgKCFpc1R5cGluZyAmJiB0aGlzLl9tdWx0aXBsZSAmJiBrZXlDb2RlID09PSBBICYmIGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjb25zdCBoYXNEZXNlbGVjdGVkT3B0aW9ucyA9IHRoaXMub3B0aW9ucy5zb21lKG9wdCA9PiAhb3B0LmRpc2FibGVkICYmICFvcHQuc2VsZWN0ZWQpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgICBpZiAoIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICAgIGhhc0Rlc2VsZWN0ZWRPcHRpb25zID8gb3B0aW9uLnNlbGVjdCgpIDogb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5Rm9jdXNlZEluZGV4ID0gbWFuYWdlci5hY3RpdmVJdGVtSW5kZXg7XG5cbiAgICAgIG1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcblxuICAgICAgaWYgKHRoaXMuX211bHRpcGxlICYmIGlzQXJyb3dLZXkgJiYgZXZlbnQuc2hpZnRLZXkgJiYgbWFuYWdlci5hY3RpdmVJdGVtICYmXG4gICAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzbHlGb2N1c2VkSW5kZXgpIHtcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vbkZvY3VzKCkge1xuICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fZm9jdXNlZCA9IHRydWU7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxzIHRoZSB0b3VjaGVkIGNhbGxiYWNrIG9ubHkgaWYgdGhlIHBhbmVsIGlzIGNsb3NlZC4gT3RoZXJ3aXNlLCB0aGUgdHJpZ2dlciB3aWxsXG4gICAqIFwiYmx1clwiIHRvIHRoZSBwYW5lbCB3aGVuIGl0IG9wZW5zLCBjYXVzaW5nIGEgZmFsc2UgcG9zaXRpdmUuXG4gICAqL1xuICBfb25CbHVyKCkge1xuICAgIHRoaXMuX2ZvY3VzZWQgPSBmYWxzZTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGhhcyBiZWVuIGF0dGFjaGVkLlxuICAgKi9cbiAgX29uQXR0YWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVybGF5RGlyLnBvc2l0aW9uQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRYKCk7XG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdGhpcy5fc2Nyb2xsVG9wO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRoZW1lIHRvIGJlIHVzZWQgb24gdGhlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxUaGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGb3JtRmllbGQgPyBgbWF0LSR7dGhpcy5fcGFyZW50Rm9ybUZpZWxkLmNvbG9yfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3NlbGVjdGlvbk1vZGVsIHx8IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgIC8vIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzIGZyb20gQW5ndWxhci5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuX3NldFNlbGVjdGlvbkJ5VmFsdWUodGhpcy5uZ0NvbnRyb2wgPyB0aGlzLm5nQ29udHJvbC52YWx1ZSA6IHRoaXMuX3ZhbHVlKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb24gYmFzZWQgb24gYSB2YWx1ZS4gSWYgbm8gb3B0aW9uIGNhbiBiZVxuICAgKiBmb3VuZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHZhbHVlLCB0aGUgc2VsZWN0IHRyaWdnZXIgaXMgY2xlYXJlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgICB2YWx1ZS5mb3JFYWNoKChjdXJyZW50VmFsdWU6IGFueSkgPT4gdGhpcy5fc2VsZWN0VmFsdWUoY3VycmVudFZhbHVlKSk7XG4gICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XG4gICAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5fc2VsZWN0VmFsdWUodmFsdWUpO1xuXG4gICAgICAvLyBTaGlmdCBmb2N1cyB0byB0aGUgYWN0aXZlIGl0ZW0uIE5vdGUgdGhhdCB3ZSBzaG91bGRuJ3QgZG8gdGhpcyBpbiBtdWx0aXBsZVxuICAgICAgLy8gbW9kZSwgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoYXQgb3B0aW9uIHRoZSB1c2VyIGludGVyYWN0ZWQgd2l0aCBsYXN0LlxuICAgICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGNvcnJlc3BvbmRpbmdPcHRpb24pO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHJlc2V0IHRoZSBoaWdobGlnaHRlZCBvcHRpb24uIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyB3aGlsZVxuICAgICAgICAvLyBjbG9zZWQsIGJlY2F1c2UgZG9pbmcgaXQgd2hpbGUgb3BlbiBjYW4gc2hpZnQgdGhlIHVzZXIncyBmb2N1cyB1bm5lY2Vzc2FyaWx5LlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmRzIGFuZCBzZWxlY3RzIGFuZCBvcHRpb24gYmFzZWQgb24gaXRzIHZhbHVlLlxuICAgKiBAcmV0dXJucyBPcHRpb24gdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUuXG4gICAqL1xuICBwcml2YXRlIF9zZWxlY3RWYWx1ZSh2YWx1ZTogYW55KTogTWF0T3B0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5vcHRpb25zLmZpbmQoKG9wdGlvbjogTWF0T3B0aW9uKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcmVhdCBudWxsIGFzIGEgc3BlY2lhbCByZXNldCB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSAhPSBudWxsICYmIHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbi52YWx1ZSwgIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChpc0Rldk1vZGUoKSkge1xuICAgICAgICAgIC8vIE5vdGlmeSBkZXZlbG9wZXJzIG9mIGVycm9ycyBpbiB0aGVpciBjb21wYXJhdG9yLlxuICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ09wdGlvbjtcbiAgfVxuXG4gIC8qKiBTZXRzIHVwIGEga2V5IG1hbmFnZXIgdG8gbGlzdGVuIHRvIGtleWJvYXJkIGV2ZW50cyBvbiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfaW5pdEtleU1hbmFnZXIoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoVHlwZUFoZWFkKHRoaXMuX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpXG4gICAgICAud2l0aFZlcnRpY2FsT3JpZW50YXRpb24oKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5faXNSdGwoKSA/ICdydGwnIDogJ2x0cicpXG4gICAgICAud2l0aEFsbG93ZWRNb2RpZmllcktleXMoWydzaGlmdEtleSddKTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGFuZWxPcGVuKSB7XG4gICAgICAgIC8vIFNlbGVjdCB0aGUgYWN0aXZlIGl0ZW0gd2hlbiB0YWJiaW5nIGF3YXkuIFRoaXMgaXMgY29uc2lzdGVudCB3aXRoIGhvdyB0aGUgbmF0aXZlXG4gICAgICAgIC8vIHNlbGVjdCBiZWhhdmVzLiBOb3RlIHRoYXQgd2Ugb25seSB3YW50IHRvIGRvIHRoaXMgaW4gc2luZ2xlIHNlbGVjdGlvbiBtb2RlLlxuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzdG9yZSBmb2N1cyB0byB0aGUgdHJpZ2dlciBiZWZvcmUgY2xvc2luZy4gRW5zdXJlcyB0aGF0IHRoZSBmb2N1c1xuICAgICAgICAvLyBwb3NpdGlvbiB3b24ndCBiZSBsb3N0IGlmIHRoZSB1c2VyIGdvdCBmb2N1cyBpbnRvIHRoZSBvdmVybGF5LlxuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3BhbmVsT3BlbiAmJiB0aGlzLnBhbmVsKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbEFjdGl2ZU9wdGlvbkludG9WaWV3KCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9wYW5lbE9wZW4gJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbS5fc2VsZWN0VmlhSW50ZXJhY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBEcm9wcyBjdXJyZW50IG9wdGlvbiBzdWJzY3JpcHRpb25zIGFuZCBJRHMgYW5kIHJlc2V0cyBmcm9tIHNjcmF0Y2guICovXG4gIHByaXZhdGUgX3Jlc2V0T3B0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkT3JEZXN0cm95ZWQgPSBtZXJnZSh0aGlzLm9wdGlvbnMuY2hhbmdlcywgdGhpcy5fZGVzdHJveSk7XG5cbiAgICB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuX29uU2VsZWN0KGV2ZW50LnNvdXJjZSwgZXZlbnQuaXNVc2VySW5wdXQpO1xuXG4gICAgICBpZiAoZXZlbnQuaXNVc2VySW5wdXQgJiYgIXRoaXMubXVsdGlwbGUgJiYgdGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIGludGVybmFsIHN0YXRlIG9mIHRoZSBvcHRpb25zIGFuZCByZWFjdCBhY2NvcmRpbmdseS5cbiAgICAvLyBIYW5kbGVzIGNhc2VzIGxpa2UgdGhlIGxhYmVscyBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucyBjaGFuZ2luZy5cbiAgICBtZXJnZSguLi50aGlzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uX3N0YXRlQ2hhbmdlcykpXG4gICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9zZXRPcHRpb25JZHMoKTtcbiAgfVxuXG4gIC8qKiBJbnZva2VkIHdoZW4gYW4gb3B0aW9uIGlzIGNsaWNrZWQuICovXG4gIHByaXZhdGUgX29uU2VsZWN0KG9wdGlvbjogTWF0T3B0aW9uLCBpc1VzZXJJbnB1dDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbi52YWx1ZSA9PSBudWxsICYmICF0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMob3B0aW9uLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdhc1NlbGVjdGVkICE9PSBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID8gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KG9wdGlvbikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5kZXNlbGVjdChvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKG9wdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIHRoaXMuX3NvcnRWYWx1ZXMoKTtcblxuICAgICAgICBpZiAoaXNVc2VySW5wdXQpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSB1c2VyIHNlbGVjdGVkIHRoZSBvcHRpb24gd2l0aCB0aGVpciBtb3VzZSwgd2VcbiAgICAgICAgICAvLyB3YW50IHRvIHJlc3RvcmUgZm9jdXMgYmFjayB0byB0aGUgdHJpZ2dlciwgaW4gb3JkZXIgdG9cbiAgICAgICAgICAvLyBwcmV2ZW50IHRoZSBzZWxlY3Qga2V5Ym9hcmQgY29udHJvbHMgZnJvbSBjbGFzaGluZyB3aXRoXG4gICAgICAgICAgLy8gdGhlIG9uZXMgZnJvbSBgbWF0LW9wdGlvbmAuXG4gICAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdhc1NlbGVjdGVkICE9PSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKG9wdGlvbikpIHtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMoKTtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICAvKiogU29ydHMgdGhlIHNlbGVjdGVkIHZhbHVlcyBpbiB0aGUgc2VsZWN0ZWQgYmFzZWQgb24gdGhlaXIgb3JkZXIgaW4gdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9zb3J0VmFsdWVzKCkge1xuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKTtcblxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3J0Q29tcGFyYXRvciA/IHRoaXMuc29ydENvbXBhcmF0b3IoYSwgYiwgb3B0aW9ucykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuaW5kZXhPZihhKSAtIG9wdGlvbnMuaW5kZXhPZihiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnkgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHZhbHVlVG9FbWl0ID0gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uW10pLm1hcChvcHRpb24gPT4gb3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWVUb0VtaXQgPSB0aGlzLnNlbGVjdGVkID8gKHRoaXMuc2VsZWN0ZWQgYXMgTWF0T3B0aW9uKS52YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZVRvRW1pdDtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHZhbHVlVG9FbWl0KTtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZS5lbWl0KG5ldyBNYXRTZWxlY3RDaGFuZ2UodGhpcywgdmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBSZWNvcmRzIG9wdGlvbiBJRHMgdG8gcGFzcyB0byB0aGUgYXJpYS1vd25zIHByb3BlcnR5LiAqL1xuICBwcml2YXRlIF9zZXRPcHRpb25JZHMoKSB7XG4gICAgdGhpcy5fb3B0aW9uSWRzID0gdGhpcy5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLmlkKS5qb2luKCcgJyk7XG4gIH1cblxuICAvKipcbiAgICogSGlnaGxpZ2h0cyB0aGUgc2VsZWN0ZWQgaXRlbS4gSWYgbm8gb3B0aW9uIGlzIHNlbGVjdGVkLCBpdCB3aWxsIGhpZ2hsaWdodFxuICAgKiB0aGUgZmlyc3QgaXRlbSBpbnN0ZWFkLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFNjcm9sbHMgdGhlIGFjdGl2ZSBvcHRpb24gaW50byB2aWV3LiAqL1xuICBwcml2YXRlIF9zY3JvbGxBY3RpdmVPcHRpb25JbnRvVmlldygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVPcHRpb25JbmRleCA9IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDA7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlT3B0aW9uKGFjdGl2ZU9wdGlvbkluZGV4LCB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHRoaXMub3B0aW9uR3JvdXBzKTtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuXG4gICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IF9nZXRPcHRpb25TY3JvbGxQb3NpdGlvbihcbiAgICAgIChhY3RpdmVPcHRpb25JbmRleCArIGxhYmVsQ291bnQpICogaXRlbUhlaWdodCxcbiAgICAgIGl0ZW1IZWlnaHQsXG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFRcbiAgICApO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNlbGVjdCBlbGVtZW50LiAqL1xuICBmb2N1cyhvcHRpb25zPzogRm9jdXNPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGluZGV4IG9mIHRoZSBwcm92aWRlZCBvcHRpb24gaW4gdGhlIG9wdGlvbiBsaXN0LiAqL1xuICBwcml2YXRlIF9nZXRPcHRpb25JbmRleChvcHRpb246IE1hdE9wdGlvbik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZWR1Y2UoKHJlc3VsdDogbnVtYmVyIHwgdW5kZWZpbmVkLCBjdXJyZW50OiBNYXRPcHRpb24sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0aW9uID09PSBjdXJyZW50ID8gaW5kZXggOiB1bmRlZmluZWQ7XG4gICAgfSwgdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHgtIGFuZCB5LW9mZnNldHMgb2YgdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fZ2V0SXRlbUNvdW50KCk7XG4gICAgY29uc3QgcGFuZWxIZWlnaHQgPSBNYXRoLm1pbihpdGVtcyAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBzY3JvbGxDb250YWluZXJIZWlnaHQgPSBpdGVtcyAqIGl0ZW1IZWlnaHQ7XG5cbiAgICAvLyBUaGUgZmFydGhlc3QgdGhlIHBhbmVsIGNhbiBiZSBzY3JvbGxlZCBiZWZvcmUgaXQgaGl0cyB0aGUgYm90dG9tXG4gICAgY29uc3QgbWF4U2Nyb2xsID0gc2Nyb2xsQ29udGFpbmVySGVpZ2h0IC0gcGFuZWxIZWlnaHQ7XG5cbiAgICAvLyBJZiBubyB2YWx1ZSBpcyBzZWxlY3RlZCB3ZSBvcGVuIHRoZSBwb3B1cCB0byB0aGUgZmlyc3QgaXRlbS5cbiAgICBsZXQgc2VsZWN0ZWRPcHRpb25PZmZzZXQgPVxuICAgICAgICB0aGlzLmVtcHR5ID8gMCA6IHRoaXMuX2dldE9wdGlvbkluZGV4KHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdKSE7XG5cbiAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCArPSBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbihzZWxlY3RlZE9wdGlvbk9mZnNldCwgdGhpcy5vcHRpb25zLFxuICAgICAgICB0aGlzLm9wdGlvbkdyb3Vwcyk7XG5cbiAgICAvLyBXZSBtdXN0IG1haW50YWluIGEgc2Nyb2xsIGJ1ZmZlciBzbyB0aGUgc2VsZWN0ZWQgb3B0aW9uIHdpbGwgYmUgc2Nyb2xsZWQgdG8gdGhlXG4gICAgLy8gY2VudGVyIG9mIHRoZSBvdmVybGF5IHBhbmVsIHJhdGhlciB0aGFuIHRoZSB0b3AuXG4gICAgY29uc3Qgc2Nyb2xsQnVmZmVyID0gcGFuZWxIZWlnaHQgLyAyO1xuICAgIHRoaXMuX3Njcm9sbFRvcCA9IHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcbiAgICB0aGlzLl9vZmZzZXRZID0gdGhpcy5fY2FsY3VsYXRlT3ZlcmxheU9mZnNldFkoc2VsZWN0ZWRPcHRpb25PZmZzZXQsIHNjcm9sbEJ1ZmZlciwgbWF4U2Nyb2xsKTtcblxuICAgIHRoaXMuX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsLlxuICAgKlxuICAgKiBBdHRlbXB0cyB0byBjZW50ZXIgdGhlIHNlbGVjdGVkIG9wdGlvbiBpbiB0aGUgcGFuZWwuIElmIHRoZSBvcHRpb24gaXNcbiAgICogdG9vIGhpZ2ggb3IgdG9vIGxvdyBpbiB0aGUgcGFuZWwgdG8gYmUgc2Nyb2xsZWQgdG8gdGhlIGNlbnRlciwgaXQgY2xhbXBzIHRoZVxuICAgKiBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIG1pbiBvciBtYXggc2Nyb2xsIHBvc2l0aW9ucyByZXNwZWN0aXZlbHkuXG4gICAqL1xuICBfY2FsY3VsYXRlT3ZlcmxheVNjcm9sbChzZWxlY3RlZEluZGV4OiBudW1iZXIsIHNjcm9sbEJ1ZmZlcjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wID0gaXRlbUhlaWdodCAqIHNlbGVjdGVkSW5kZXg7XG4gICAgY29uc3QgaGFsZk9wdGlvbkhlaWdodCA9IGl0ZW1IZWlnaHQgLyAyO1xuXG4gICAgLy8gU3RhcnRzIGF0IHRoZSBvcHRpb25PZmZzZXRGcm9tU2Nyb2xsVG9wLCB3aGljaCBzY3JvbGxzIHRoZSBvcHRpb24gdG8gdGhlIHRvcCBvZiB0aGVcbiAgICAvLyBzY3JvbGwgY29udGFpbmVyLCB0aGVuIHN1YnRyYWN0cyB0aGUgc2Nyb2xsIGJ1ZmZlciB0byBzY3JvbGwgdGhlIG9wdGlvbiBkb3duIHRvXG4gICAgLy8gdGhlIGNlbnRlciBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gSGFsZiB0aGUgb3B0aW9uIGhlaWdodCBtdXN0IGJlIHJlLWFkZGVkIHRvIHRoZVxuICAgIC8vIHNjcm9sbFRvcCBzbyB0aGUgb3B0aW9uIGlzIGNlbnRlcmVkIGJhc2VkIG9uIGl0cyBtaWRkbGUsIG5vdCBpdHMgdG9wIGVkZ2UuXG4gICAgY29uc3Qgb3B0aW1hbFNjcm9sbFBvc2l0aW9uID0gb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCAtIHNjcm9sbEJ1ZmZlciArIGhhbGZPcHRpb25IZWlnaHQ7XG4gICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KDAsIG9wdGltYWxTY3JvbGxQb3NpdGlvbiksIG1heFNjcm9sbCk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgYXJpYS1sYWJlbCBvZiB0aGUgc2VsZWN0IGNvbXBvbmVudC4gKi9cbiAgX2dldEFyaWFMYWJlbCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAvLyBJZiBhbiBhcmlhTGFiZWxsZWRieSB2YWx1ZSBoYXMgYmVlbiBzZXQgYnkgdGhlIGNvbnN1bWVyLCB0aGUgc2VsZWN0IHNob3VsZCBub3Qgb3ZlcndyaXRlIHRoZVxuICAgIC8vIGBhcmlhLWxhYmVsbGVkYnlgIHZhbHVlIGJ5IHNldHRpbmcgdGhlIGFyaWFMYWJlbCB0byB0aGUgcGxhY2Vob2xkZXIuXG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBudWxsIDogdGhpcy5hcmlhTGFiZWwgfHwgdGhpcy5wbGFjZWhvbGRlcjtcbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBhcmlhLWxhYmVsbGVkYnkgb2YgdGhlIHNlbGVjdCBjb21wb25lbnQuICovXG4gIF9nZXRBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWxsZWRieSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnk7XG4gICAgfVxuXG4gICAgLy8gTm90ZTogd2UgdXNlIGBfZ2V0QXJpYUxhYmVsYCBoZXJlLCBiZWNhdXNlIHdlIHdhbnQgdG8gY2hlY2sgd2hldGhlciB0aGVyZSdzIGFcbiAgICAvLyBjb21wdXRlZCBsYWJlbC4gYHRoaXMuYXJpYUxhYmVsYCBpcyBvbmx5IHRoZSB1c2VyLXNwZWNpZmllZCBsYWJlbC5cbiAgICBpZiAoIXRoaXMuX3BhcmVudEZvcm1GaWVsZCB8fCAhdGhpcy5fcGFyZW50Rm9ybUZpZWxkLl9oYXNGbG9hdGluZ0xhYmVsKCkgfHxcbiAgICAgIHRoaXMuX2dldEFyaWFMYWJlbCgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcGFyZW50Rm9ybUZpZWxkLmdldExhYmVsSWQoKTtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHRoZSBgYXJpYS1hY3RpdmVkZXNjZW5kYW50YCB0byBiZSBzZXQgb24gdGhlIGhvc3QuICovXG4gIF9nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgdGhpcy5fa2V5TWFuYWdlciAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgeC1vZmZzZXQgb2YgdGhlIG92ZXJsYXkgcGFuZWwgaW4gcmVsYXRpb24gdG8gdGhlIHRyaWdnZXIncyB0b3Agc3RhcnQgY29ybmVyLlxuICAgKiBUaGlzIG11c3QgYmUgYWRqdXN0ZWQgdG8gYWxpZ24gdGhlIHNlbGVjdGVkIG9wdGlvbiB0ZXh0IG92ZXIgdGhlIHRyaWdnZXIgdGV4dCB3aGVuXG4gICAqIHRoZSBwYW5lbCBvcGVucy4gV2lsbCBjaGFuZ2UgYmFzZWQgb24gTFRSIG9yIFJUTCB0ZXh0IGRpcmVjdGlvbi4gTm90ZSB0aGF0IHRoZSBvZmZzZXRcbiAgICogY2FuJ3QgYmUgY2FsY3VsYXRlZCB1bnRpbCB0aGUgcGFuZWwgaGFzIGJlZW4gYXR0YWNoZWQsIGJlY2F1c2Ugd2UgbmVlZCB0byBrbm93IHRoZVxuICAgKiBjb250ZW50IHdpZHRoIGluIG9yZGVyIHRvIGNvbnN0cmFpbiB0aGUgcGFuZWwgd2l0aGluIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRYKCk6IHZvaWQge1xuICAgIGNvbnN0IG92ZXJsYXlSZWN0ID0gdGhpcy5vdmVybGF5RGlyLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRTaXplID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNpemUoKTtcbiAgICBjb25zdCBpc1J0bCA9IHRoaXMuX2lzUnRsKCk7XG4gICAgY29uc3QgcGFkZGluZ1dpZHRoID0gdGhpcy5tdWx0aXBsZSA/IFNFTEVDVF9NVUxUSVBMRV9QQU5FTF9QQURESU5HX1ggKyBTRUxFQ1RfUEFORUxfUEFERElOR19YIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU0VMRUNUX1BBTkVMX1BBRERJTkdfWCAqIDI7XG4gICAgbGV0IG9mZnNldFg6IG51bWJlcjtcblxuICAgIC8vIEFkanVzdCB0aGUgb2Zmc2V0LCBkZXBlbmRpbmcgb24gdGhlIG9wdGlvbiBwYWRkaW5nLlxuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICBvZmZzZXRYID0gU0VMRUNUX01VTFRJUExFX1BBTkVMX1BBRERJTkdfWDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0gfHwgdGhpcy5vcHRpb25zLmZpcnN0O1xuICAgICAgb2Zmc2V0WCA9IHNlbGVjdGVkICYmIHNlbGVjdGVkLmdyb3VwID8gU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggOiBTRUxFQ1RfUEFORUxfUEFERElOR19YO1xuICAgIH1cblxuICAgIC8vIEludmVydCB0aGUgb2Zmc2V0IGluIExUUi5cbiAgICBpZiAoIWlzUnRsKSB7XG4gICAgICBvZmZzZXRYICo9IC0xO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBob3cgbXVjaCB0aGUgc2VsZWN0IG92ZXJmbG93cyBvbiBlYWNoIHNpZGUuXG4gICAgY29uc3QgbGVmdE92ZXJmbG93ID0gMCAtIChvdmVybGF5UmVjdC5sZWZ0ICsgb2Zmc2V0WCAtIChpc1J0bCA/IHBhZGRpbmdXaWR0aCA6IDApKTtcbiAgICBjb25zdCByaWdodE92ZXJmbG93ID0gb3ZlcmxheVJlY3QucmlnaHQgKyBvZmZzZXRYIC0gdmlld3BvcnRTaXplLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICsgKGlzUnRsID8gMCA6IHBhZGRpbmdXaWR0aCk7XG5cbiAgICAvLyBJZiB0aGUgZWxlbWVudCBvdmVyZmxvd3Mgb24gZWl0aGVyIHNpZGUsIHJlZHVjZSB0aGUgb2Zmc2V0IHRvIGFsbG93IGl0IHRvIGZpdC5cbiAgICBpZiAobGVmdE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCArPSBsZWZ0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9IGVsc2UgaWYgKHJpZ2h0T3ZlcmZsb3cgPiAwKSB7XG4gICAgICBvZmZzZXRYIC09IHJpZ2h0T3ZlcmZsb3cgKyBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG9mZnNldCBkaXJlY3RseSBpbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gZ28gdGhyb3VnaCBjaGFuZ2UgZGV0ZWN0aW9uIGFuZFxuICAgIC8vIHBvdGVudGlhbGx5IHRyaWdnZXJpbmcgXCJjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzLiBSb3VuZCB0aGUgdmFsdWUgdG8gYXZvaWRcbiAgICAvLyBibHVycnkgY29udGVudCBpbiBzb21lIGJyb3dzZXJzLlxuICAgIHRoaXMub3ZlcmxheURpci5vZmZzZXRYID0gTWF0aC5yb3VuZChvZmZzZXRYKTtcbiAgICB0aGlzLm92ZXJsYXlEaXIub3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHktb2Zmc2V0IG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZVxuICAgKiB0b3Agc3RhcnQgY29ybmVyIG9mIHRoZSB0cmlnZ2VyLiBJdCBoYXMgdG8gYmUgYWRqdXN0ZWQgaW4gb3JkZXIgZm9yIHRoZVxuICAgKiBzZWxlY3RlZCBvcHRpb24gdG8gYmUgYWxpZ25lZCBvdmVyIHRoZSB0cmlnZ2VyIHdoZW4gdGhlIHBhbmVsIG9wZW5zLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlT3ZlcmxheU9mZnNldFkoc2VsZWN0ZWRJbmRleDogbnVtYmVyLCBzY3JvbGxCdWZmZXI6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhTY3JvbGw6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBvcHRpb25IZWlnaHRBZGp1c3RtZW50ID0gKGl0ZW1IZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5oZWlnaHQpIC8gMjtcbiAgICBjb25zdCBtYXhPcHRpb25zRGlzcGxheWVkID0gTWF0aC5mbG9vcihTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCAvIGl0ZW1IZWlnaHQpO1xuICAgIGxldCBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3A6IG51bWJlcjtcblxuICAgIC8vIERpc2FibGUgb2Zmc2V0IGlmIHJlcXVlc3RlZCBieSB1c2VyIGJ5IHJldHVybmluZyAwIGFzIHZhbHVlIHRvIG9mZnNldFxuICAgIGlmICh0aGlzLl9kaXNhYmxlT3B0aW9uQ2VudGVyaW5nKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZEluZGV4ICogaXRlbUhlaWdodDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gbWF4U2Nyb2xsKSB7XG4gICAgICBjb25zdCBmaXJzdERpc3BsYXllZEluZGV4ID0gdGhpcy5fZ2V0SXRlbUNvdW50KCkgLSBtYXhPcHRpb25zRGlzcGxheWVkO1xuICAgICAgY29uc3Qgc2VsZWN0ZWREaXNwbGF5SW5kZXggPSBzZWxlY3RlZEluZGV4IC0gZmlyc3REaXNwbGF5ZWRJbmRleDtcblxuICAgICAgLy8gVGhlIGZpcnN0IGl0ZW0gaXMgcGFydGlhbGx5IG91dCBvZiB0aGUgdmlld3BvcnQuIFRoZXJlZm9yZSB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB3aGF0XG4gICAgICAvLyBwb3J0aW9uIG9mIGl0IGlzIHNob3duIGluIHRoZSB2aWV3cG9ydCBhbmQgYWNjb3VudCBmb3IgaXQgaW4gb3VyIG9mZnNldC5cbiAgICAgIGxldCBwYXJ0aWFsSXRlbUhlaWdodCA9XG4gICAgICAgICAgaXRlbUhlaWdodCAtICh0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQgLSBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCkgJSBpdGVtSGVpZ2h0O1xuXG4gICAgICAvLyBCZWNhdXNlIHRoZSBwYW5lbCBoZWlnaHQgaXMgbG9uZ2VyIHRoYW4gdGhlIGhlaWdodCBvZiB0aGUgb3B0aW9ucyBhbG9uZSxcbiAgICAgIC8vIHRoZXJlIGlzIGFsd2F5cyBleHRyYSBwYWRkaW5nIGF0IHRoZSB0b3Agb3IgYm90dG9tIG9mIHRoZSBwYW5lbC4gV2hlblxuICAgICAgLy8gc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCB0aGlzIHBhZGRpbmcgaXMgYXQgdGhlIHRvcCBvZiB0aGUgcGFuZWwgYW5kXG4gICAgICAvLyBtdXN0IGJlIGFkZGVkIHRvIHRoZSBvZmZzZXQuXG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZERpc3BsYXlJbmRleCAqIGl0ZW1IZWlnaHQgKyBwYXJ0aWFsSXRlbUhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIG9wdGlvbiB3YXMgc2Nyb2xsZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgcGFuZWwgdXNpbmcgYSBzY3JvbGwgYnVmZmVyLFxuICAgICAgLy8gaXRzIG9mZnNldCB3aWxsIGJlIHRoZSBzY3JvbGwgYnVmZmVyIG1pbnVzIHRoZSBoYWxmIGhlaWdodCB0aGF0IHdhcyBhZGRlZCB0b1xuICAgICAgLy8gY2VudGVyIGl0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2Nyb2xsQnVmZmVyIC0gaXRlbUhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZpbmFsIG9mZnNldCBpcyB0aGUgb3B0aW9uJ3Mgb2Zmc2V0IGZyb20gdGhlIHRvcCwgYWRqdXN0ZWQgZm9yIHRoZSBoZWlnaHQgZGlmZmVyZW5jZSxcbiAgICAvLyBtdWx0aXBsaWVkIGJ5IC0xIHRvIGVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IG1vdmVzIGluIHRoZSBjb3JyZWN0IGRpcmVjdGlvbiB1cCB0aGUgcGFnZS5cbiAgICAvLyBUaGUgdmFsdWUgaXMgcm91bmRlZCB0byBwcmV2ZW50IHNvbWUgYnJvd3NlcnMgZnJvbSBibHVycmluZyB0aGUgY29udGVudC5cbiAgICByZXR1cm4gTWF0aC5yb3VuZChvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgKiAtMSAtIG9wdGlvbkhlaWdodEFkanVzdG1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGF0IHRoZSBhdHRlbXB0ZWQgb3ZlcmxheSBwb3NpdGlvbiB3aWxsIGZpdCB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKiBJZiBpdCB3aWxsIG5vdCBmaXQsIHRyaWVzIHRvIGFkanVzdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB0aGUgYXNzb2NpYXRlZFxuICAgKiB5LW9mZnNldCBzbyB0aGUgcGFuZWwgY2FuIG9wZW4gZnVsbHkgb24tc2NyZWVuLiBJZiBpdCBzdGlsbCB3b24ndCBmaXQsXG4gICAqIHNldHMgdGhlIG9mZnNldCBiYWNrIHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2Ugb3Zlci5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCB2aWV3cG9ydFNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2l6ZSgpO1xuXG4gICAgY29uc3QgdG9wU3BhY2VBdmFpbGFibGUgPSB0aGlzLl90cmlnZ2VyUmVjdC50b3AgLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICBjb25zdCBib3R0b21TcGFjZUF2YWlsYWJsZSA9XG4gICAgICAgIHZpZXdwb3J0U2l6ZS5oZWlnaHQgLSB0aGlzLl90cmlnZ2VyUmVjdC5ib3R0b20gLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcblxuICAgIGNvbnN0IHBhbmVsSGVpZ2h0VG9wID0gTWF0aC5hYnModGhpcy5fb2Zmc2V0WSk7XG4gICAgY29uc3QgdG90YWxQYW5lbEhlaWdodCA9XG4gICAgICAgIE1hdGgubWluKHRoaXMuX2dldEl0ZW1Db3VudCgpICogaXRlbUhlaWdodCwgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0Qm90dG9tID0gdG90YWxQYW5lbEhlaWdodCAtIHBhbmVsSGVpZ2h0VG9wIC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0O1xuXG4gICAgaWYgKHBhbmVsSGVpZ2h0Qm90dG9tID4gYm90dG9tU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgIHRoaXMuX2FkanVzdFBhbmVsVXAocGFuZWxIZWlnaHRCb3R0b20sIGJvdHRvbVNwYWNlQXZhaWxhYmxlKTtcbiAgICB9IGVsc2UgaWYgKHBhbmVsSGVpZ2h0VG9wID4gdG9wU3BhY2VBdmFpbGFibGUpIHtcbiAgICAgdGhpcy5fYWRqdXN0UGFuZWxEb3duKHBhbmVsSGVpZ2h0VG9wLCB0b3BTcGFjZUF2YWlsYWJsZSwgbWF4U2Nyb2xsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luQmFzZWRPbk9wdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGp1c3RzIHRoZSBvdmVybGF5IHBhbmVsIHVwIHRvIGZpdCBpbiB0aGUgdmlld3BvcnQuICovXG4gIHByaXZhdGUgX2FkanVzdFBhbmVsVXAocGFuZWxIZWlnaHRCb3R0b206IG51bWJlciwgYm90dG9tU3BhY2VBdmFpbGFibGU6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQmVsb3dWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRCb3R0b20gLSBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCB1cCBieSB0aGUgZGlzdGFuY2UgaXQgd2FzIGV4dGVuZGluZyBwYXN0IHRoZSBib3VuZGFyeSwgdGhlblxuICAgIC8vIGFkanVzdHMgdGhlIG9mZnNldCBieSB0aGF0IGFtb3VudCB0byBtb3ZlIHRoZSBwYW5lbCB1cCBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICB0aGlzLl9zY3JvbGxUb3AgLT0gZGlzdGFuY2VCZWxvd1ZpZXdwb3J0O1xuICAgIHRoaXMuX29mZnNldFkgLT0gZGlzdGFuY2VCZWxvd1ZpZXdwb3J0O1xuICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcblxuICAgIC8vIElmIHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgdmVyeSB0b3AsIGl0IHdvbid0IGJlIGFibGUgdG8gZml0IHRoZSBwYW5lbFxuICAgIC8vIGJ5IHNjcm9sbGluZywgc28gc2V0IHRoZSBvZmZzZXQgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb24gdG8gdGFrZVxuICAgIC8vIGVmZmVjdC5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wIDw9IDApIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9vZmZzZXRZID0gMDtcbiAgICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IGA1MCUgYm90dG9tIDBweGA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFkanVzdHMgdGhlIG92ZXJsYXkgcGFuZWwgZG93biB0byBmaXQgaW4gdGhlIHZpZXdwb3J0LiAqL1xuICBwcml2YXRlIF9hZGp1c3RQYW5lbERvd24ocGFuZWxIZWlnaHRUb3A6IG51bWJlciwgdG9wU3BhY2VBdmFpbGFibGU6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heFNjcm9sbDogbnVtYmVyKSB7XG4gICAgLy8gQnJvd3NlcnMgaWdub3JlIGZyYWN0aW9uYWwgc2Nyb2xsIG9mZnNldHMsIHNvIHdlIG5lZWQgdG8gcm91bmQuXG4gICAgY29uc3QgZGlzdGFuY2VBYm92ZVZpZXdwb3J0ID0gTWF0aC5yb3VuZChwYW5lbEhlaWdodFRvcCAtIHRvcFNwYWNlQXZhaWxhYmxlKTtcblxuICAgIC8vIFNjcm9sbHMgdGhlIHBhbmVsIGRvd24gYnkgdGhlIGRpc3RhbmNlIGl0IHdhcyBleHRlbmRpbmcgcGFzdCB0aGUgYm91bmRhcnksIHRoZW5cbiAgICAvLyBhZGp1c3RzIHRoZSBvZmZzZXQgYnkgdGhhdCBhbW91bnQgdG8gbW92ZSB0aGUgcGFuZWwgZG93biBpbnRvIHRoZSB2aWV3cG9ydC5cbiAgICB0aGlzLl9zY3JvbGxUb3AgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX29mZnNldFkgKz0gZGlzdGFuY2VBYm92ZVZpZXdwb3J0O1xuICAgIHRoaXMuX3RyYW5zZm9ybU9yaWdpbiA9IHRoaXMuX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTtcblxuICAgIC8vIElmIHRoZSBwYW5lbCBpcyBzY3JvbGxlZCB0byB0aGUgdmVyeSBib3R0b20sIGl0IHdvbid0IGJlIGFibGUgdG8gZml0IHRoZVxuICAgIC8vIHBhbmVsIGJ5IHNjcm9sbGluZywgc28gc2V0IHRoZSBvZmZzZXQgdG8gMCB0byBhbGxvdyB0aGUgZmFsbGJhY2sgcG9zaXRpb25cbiAgICAvLyB0byB0YWtlIGVmZmVjdC5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID49IG1heFNjcm9sbCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gbWF4U2Nyb2xsO1xuICAgICAgdGhpcy5fb2Zmc2V0WSA9IDA7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSBgNTAlIHRvcCAwcHhgO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB0cmFuc2Zvcm0gb3JpZ2luIHBvaW50IGJhc2VkIG9uIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTogc3RyaW5nIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IG9wdGlvbkhlaWdodEFkanVzdG1lbnQgPSAoaXRlbUhlaWdodCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodCkgLyAyO1xuICAgIGNvbnN0IG9yaWdpblkgPSBNYXRoLmFicyh0aGlzLl9vZmZzZXRZKSAtIG9wdGlvbkhlaWdodEFkanVzdG1lbnQgKyBpdGVtSGVpZ2h0IC8gMjtcbiAgICByZXR1cm4gYDUwJSAke29yaWdpbll9cHggMHB4YDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBhbW91bnQgb2YgaXRlbXMgaW4gdGhlIHNlbGVjdC4gVGhpcyBpbmNsdWRlcyBvcHRpb25zIGFuZCBncm91cCBsYWJlbHMuICovXG4gIHByaXZhdGUgX2dldEl0ZW1Db3VudCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMubGVuZ3RoICsgdGhpcy5vcHRpb25Hcm91cHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiB0aGUgc2VsZWN0J3Mgb3B0aW9ucy4gKi9cbiAgcHJpdmF0ZSBfZ2V0SXRlbUhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyRm9udFNpemUgKiBTRUxFQ1RfSVRFTV9IRUlHSFRfRU07XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fYXJpYURlc2NyaWJlZGJ5ID0gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgdGhpcy5mb2N1cygpO1xuICAgIHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3BhbmVsT3BlbiB8fCAhdGhpcy5lbXB0eTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXF1aXJlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbXVsdGlwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVPcHRpb25DZW50ZXJpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3R5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cbiJdfQ==