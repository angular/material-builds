/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager, addAriaReferencedId, LiveAnnouncer, removeAriaReferencedId, } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { SelectionModel } from '@angular/cdk/collections';
import { A, DOWN_ARROW, ENTER, hasModifierKey, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW, } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay, } from '@angular/cdk/overlay';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, booleanAttribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Inject, inject, InjectionToken, Input, NgZone, numberAttribute, Optional, Output, QueryList, Self, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm, Validators, } from '@angular/forms';
import { _countGroupLabelsBeforeOption, _ErrorStateTracker, _getOptionScrollPosition, ErrorStateMatcher, MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, } from '@angular/material/core';
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { defer, merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, takeUntil, } from 'rxjs/operators';
import { matSelectAnimations } from './select-animations';
import { getMatSelectDynamicMultipleError, getMatSelectNonArrayValueError, getMatSelectNonFunctionValueError, } from './select-errors';
import { NgClass } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/bidi";
import * as i4 from "@angular/forms";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/material/form-field";
let nextUniqueId = 0;
/** Injection token that determines the scroll handling while a select is open. */
export const MAT_SELECT_SCROLL_STRATEGY = new InjectionToken('mat-select-scroll-strategy', {
    providedIn: 'root',
    factory: () => {
        const overlay = inject(Overlay);
        return () => overlay.scrollStrategies.reposition();
    },
});
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
export class MatSelect {
    /** Scrolls a particular option into the view. */
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
    /** Called when the panel has been opened and the overlay has settled on its final position. */
    _positioningSettled() {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
    }
    /** Creates a change event object that should be emitted by the select. */
    _getChangeEvent(value) {
        return new MatSelectChange(this, value);
    }
    /** Whether the select is focused. */
    get focused() {
        return this._focused || this._panelOpen;
    }
    /** Whether checkmark indicator for single-selection options is hidden. */
    get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
    }
    set hideSingleSelectionIndicator(value) {
        this._hideSingleSelectionIndicator = value;
        this._syncParentProperties();
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
        this._required = value;
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
        this._multiple = value;
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
    /** Object used to control when error messages are shown. */
    get errorStateMatcher() {
        return this._errorStateTracker.matcher;
    }
    set errorStateMatcher(value) {
        this._errorStateTracker.matcher = value;
    }
    /** Unique id of the element. */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value || this._uid;
        this.stateChanges.next();
    }
    /** Whether the select is in an error state. */
    get errorState() {
        return this._errorStateTracker.errorState;
    }
    set errorState(value) {
        this._errorStateTracker.errorState = value;
    }
    constructor(_viewportRuler, _changeDetectorRef, 
    /**
     * @deprecated Unused param, will be removed.
     * @breaking-change 19.0.0
     */
    _unusedNgZone, defaultErrorStateMatcher, _elementRef, _dir, parentForm, parentFormGroup, _parentFormField, ngControl, tabIndex, scrollStrategyFactory, _liveAnnouncer, _defaultOptions) {
        this._viewportRuler = _viewportRuler;
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._dir = _dir;
        this._parentFormField = _parentFormField;
        this.ngControl = ngControl;
        this._liveAnnouncer = _liveAnnouncer;
        this._defaultOptions = _defaultOptions;
        /**
         * This position config ensures that the top "start" corner of the overlay
         * is aligned with with the top "start" of the origin by default (overlapping
         * the trigger completely). If the panel cannot fit below the trigger, it
         * will fall back to a position above the trigger.
         */
        this._positions = [
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                panelClass: 'mat-mdc-select-panel-above',
            },
            {
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'bottom',
                panelClass: 'mat-mdc-select-panel-above',
            },
        ];
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
        /**
         * Emits whenever the component state changes and should cause the parent
         * form-field to update. Implemented as part of `MatFormFieldControl`.
         * @docs-private
         */
        this.stateChanges = new Subject();
        /**
         * Disable the automatic labeling to avoid issues like #27241.
         * @docs-private
         */
        this.disableAutomaticLabeling = true;
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
        /** Whether the select is disabled. */
        this.disabled = false;
        /** Whether ripples in the select are disabled. */
        this.disableRipple = false;
        /** Tab index of the select. */
        this.tabIndex = 0;
        this._hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
        this._multiple = false;
        /** Whether to center the active option over the trigger. */
        this.disableOptionCentering = this._defaultOptions?.disableOptionCentering ?? false;
        /** Aria label of the select. */
        this.ariaLabel = '';
        /**
         * Width of the panel. If set to `auto`, the panel will match the trigger width.
         * If set to null or an empty string, the panel will grow to match the longest option's text.
         */
        this.panelWidth = this._defaultOptions && typeof this._defaultOptions.panelWidth !== 'undefined'
            ? this._defaultOptions.panelWidth
            : 'auto';
        this._initialized = new Subject();
        /** Combined stream of all of the child options' change events. */
        this.optionSelectionChanges = defer(() => {
            const options = this.options;
            if (options) {
                return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map(option => option.onSelectionChange))));
            }
            return this._initialized.pipe(switchMap(() => this.optionSelectionChanges));
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
        /**
         * Track which modal we have modified the `aria-owns` attribute of. When the combobox trigger is
         * inside an aria-modal, we apply aria-owns to the parent modal with the `id` of the options
         * panel. Track the modal we have changed so we can undo the changes on destroy.
         */
        this._trackedModal = null;
        // `skipPredicate` determines if key manager should avoid putting a given option in the tab
        // order. Allow disabled list items to receive focus via keyboard to align with WAI ARIA
        // recommendation.
        //
        // Normally WAI ARIA's instructions are to exclude disabled items from the tab order, but it
        // makes a few exceptions for compound widgets.
        //
        // From [Developing a Keyboard Interface](
        // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
        //   "For the following composite widget elements, keep them focusable when disabled: Options in a
        //   Listbox..."
        //
        // The user can focus disabled options using the keyboard, but the user cannot click disabled
        // options.
        this._skipPredicate = (option) => {
            if (this.panelOpen) {
                // Support keyboard focusing disabled options in an ARIA listbox.
                return false;
            }
            // When the panel is closed, skip over disabled options. Support options via the UP/DOWN arrow
            // keys on a closed select. ARIA listbox interaction pattern is less relevant when the panel is
            // closed.
            return option.disabled;
        };
        if (this.ngControl) {
            // Note: we provide the value accessor through here, instead of
            // the `providers` to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
        }
        // Note that we only want to set this when the defaults pass it in, otherwise it should
        // stay as `undefined` so that it falls back to the default in the key manager.
        if (_defaultOptions?.typeaheadDebounceInterval != null) {
            this.typeaheadDebounceInterval = _defaultOptions.typeaheadDebounceInterval;
        }
        this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, ngControl, parentFormGroup, parentForm, this.stateChanges);
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
        this._viewportRuler
            .change()
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
            if (this.panelOpen) {
                this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
                this._changeDetectorRef.detectChanges();
            }
        });
    }
    ngAfterContentInit() {
        this._initialized.next();
        this._initialized.complete();
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
        // Updating the disabled state is handled by the input, but we need to additionally let
        // the parent form field know to run change detection when the disabled state changes.
        if (changes['disabled'] || changes['userAriaDescribedBy']) {
            this.stateChanges.next();
        }
        if (changes['typeaheadDebounceInterval'] && this._keyManager) {
            this._keyManager.withTypeAhead(this.typeaheadDebounceInterval);
        }
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
        this._destroy.next();
        this._destroy.complete();
        this.stateChanges.complete();
        this._clearFromModal();
    }
    /** Toggles the overlay panel open or closed. */
    toggle() {
        this.panelOpen ? this.close() : this.open();
    }
    /** Opens the overlay panel. */
    open() {
        if (!this._canOpen()) {
            return;
        }
        // It's important that we read this as late as possible, because doing so earlier will
        // return a different element since it's based on queries in the form field which may
        // not have run yet. Also this needs to be assigned before we measure the overlay width.
        if (this._parentFormField) {
            this._preferredOverlayOrigin = this._parentFormField.getConnectedOverlayOrigin();
        }
        this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
        this._applyModalPanelOwnership();
        this._panelOpen = true;
        this._keyManager.withHorizontalOrientation(null);
        this._highlightCorrectOption();
        this._changeDetectorRef.markForCheck();
        // Required for the MDC form field to pick up when the overlay has been opened.
        this.stateChanges.next();
    }
    /**
     * If the autocomplete trigger is inside of an `aria-modal` element, connect
     * that modal to the options panel with `aria-owns`.
     *
     * For some browser + screen reader combinations, when navigation is inside
     * of an `aria-modal` element, the screen reader treats everything outside
     * of that modal as hidden or invisible.
     *
     * This causes a problem when the combobox trigger is _inside_ of a modal, because the
     * options panel is rendered _outside_ of that modal, preventing screen reader navigation
     * from reaching the panel.
     *
     * We can work around this issue by applying `aria-owns` to the modal with the `id` of
     * the options panel. This effectively communicates to assistive technology that the
     * options panel is part of the same interaction as the modal.
     *
     * At time of this writing, this issue is present in VoiceOver.
     * See https://github.com/angular/components/issues/20694
     */
    _applyModalPanelOwnership() {
        // TODO(http://github.com/angular/components/issues/26853): consider de-duplicating this with
        // the `LiveAnnouncer` and any other usages.
        //
        // Note that the selector here is limited to CDK overlays at the moment in order to reduce the
        // section of the DOM we need to look through. This should cover all the cases we support, but
        // the selector can be expanded if it turns out to be too narrow.
        const modal = this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');
        if (!modal) {
            // Most commonly, the autocomplete trigger is not inside a modal.
            return;
        }
        const panelId = `${this.id}-panel`;
        if (this._trackedModal) {
            removeAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
        }
        addAriaReferencedId(modal, 'aria-owns', panelId);
        this._trackedModal = modal;
    }
    /** Clears the reference to the listbox overlay element from the modal it was added to. */
    _clearFromModal() {
        if (!this._trackedModal) {
            // Most commonly, the autocomplete trigger is not used inside a modal.
            return;
        }
        const panelId = `${this.id}-panel`;
        removeAriaReferencedId(this._trackedModal, 'aria-owns', panelId);
        this._trackedModal = null;
    }
    /** Closes the overlay panel and focuses the host element. */
    close() {
        if (this._panelOpen) {
            this._panelOpen = false;
            this._keyManager.withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr');
            this._changeDetectorRef.markForCheck();
            this._onTouched();
            // Required for the MDC form field to pick up when the overlay has been closed.
            this.stateChanges.next();
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
    /** Refreshes the error state of the select. */
    updateErrorState() {
        this._errorStateTracker.updateErrorState();
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
    /** Gets how wide the overlay panel should be. */
    _getOverlayWidth(preferredOrigin) {
        if (this.panelWidth === 'auto') {
            const refToMeasure = preferredOrigin instanceof CdkOverlayOrigin
                ? preferredOrigin.elementRef
                : preferredOrigin || this._elementRef;
            return refToMeasure.nativeElement.getBoundingClientRect().width;
        }
        return this.panelWidth === null ? '' : this.panelWidth;
    }
    /** Syncs the parent state with the individual options. */
    _syncParentProperties() {
        if (this.options) {
            for (const option of this.options) {
                option._changeDetectorRef.markForCheck();
            }
        }
    }
    /** Sets up a key manager to listen to keyboard events on the overlay panel. */
    _initKeyManager() {
        this._keyManager = new ActiveDescendantKeyManager(this.options)
            .withTypeAhead(this.typeaheadDebounceInterval)
            .withVerticalOrientation()
            .withHorizontalOrientation(this._isRtl() ? 'rtl' : 'ltr')
            .withHomeAndEnd()
            .withPageUpDown()
            .withAllowedModifierKeys(['shiftKey'])
            .skipPredicate(this._skipPredicate);
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
        let valueToEmit;
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
     * the first *enabled* option.
     */
    _highlightCorrectOption() {
        if (this._keyManager) {
            if (this.empty) {
                // Find the index of the first *enabled* option. Avoid calling `_keyManager.setActiveItem`
                // because it activates the first option that passes the skip predicate, rather than the
                // first *enabled* option.
                let firstEnabledOptionIndex = -1;
                for (let index = 0; index < this.options.length; index++) {
                    const option = this.options.get(index);
                    if (!option.disabled) {
                        firstEnabledOptionIndex = index;
                        break;
                    }
                }
                this._keyManager.setActiveItem(firstEnabledOptionIndex);
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
        // Since the panel doesn't overlap the trigger, we
        // want the label to only float when there's a value.
        return this.panelOpen || !this.empty || (this.focused && !!this.placeholder);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatSelect, deps: [{ token: i1.ViewportRuler }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i2.ErrorStateMatcher }, { token: i0.ElementRef }, { token: i3.Directionality, optional: true }, { token: i4.NgForm, optional: true }, { token: i4.FormGroupDirective, optional: true }, { token: MAT_FORM_FIELD, optional: true }, { token: i4.NgControl, optional: true, self: true }, { token: 'tabindex', attribute: true }, { token: MAT_SELECT_SCROLL_STRATEGY }, { token: i5.LiveAnnouncer }, { token: MAT_SELECT_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.0-next.2", type: MatSelect, isStandalone: true, selector: "mat-select", inputs: { userAriaDescribedBy: ["aria-describedby", "userAriaDescribedBy"], panelClass: "panelClass", disabled: ["disabled", "disabled", booleanAttribute], disableRipple: ["disableRipple", "disableRipple", booleanAttribute], tabIndex: ["tabIndex", "tabIndex", (value) => (value == null ? 0 : numberAttribute(value))], hideSingleSelectionIndicator: ["hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute], placeholder: "placeholder", required: ["required", "required", booleanAttribute], multiple: ["multiple", "multiple", booleanAttribute], disableOptionCentering: ["disableOptionCentering", "disableOptionCentering", booleanAttribute], compareWith: "compareWith", value: "value", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], errorStateMatcher: "errorStateMatcher", typeaheadDebounceInterval: ["typeaheadDebounceInterval", "typeaheadDebounceInterval", numberAttribute], sortComparator: "sortComparator", id: "id", panelWidth: "panelWidth" }, outputs: { openedChange: "openedChange", _openedStream: "opened", _closedStream: "closed", selectionChange: "selectionChange", valueChange: "valueChange" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none", "aria-haspopup": "listbox" }, listeners: { "keydown": "_handleKeydown($event)", "focus": "_onFocus()", "blur": "_onBlur()" }, properties: { "attr.id": "id", "attr.tabindex": "disabled ? -1 : tabIndex", "attr.aria-controls": "panelOpen ? id + \"-panel\" : null", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "attr.aria-activedescendant": "_getAriaActiveDescendant()", "class.mat-mdc-select-disabled": "disabled", "class.mat-mdc-select-invalid": "errorState", "class.mat-mdc-select-required": "required", "class.mat-mdc-select-empty": "empty", "class.mat-mdc-select-multiple": "multiple" }, classAttribute: "mat-mdc-select" }, providers: [
            { provide: MatFormFieldControl, useExisting: MatSelect },
            { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatSelect },
        ], queries: [{ propertyName: "customTrigger", first: true, predicate: MAT_SELECT_TRIGGER, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], viewQueries: [{ propertyName: "trigger", first: true, predicate: ["trigger"], descendants: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }, { propertyName: "_overlayDir", first: true, predicate: CdkConnectedOverlay, descendants: true }], exportAs: ["matSelect"], usesOnChanges: true, ngImport: i0, template: "<div cdk-overlay-origin\n     class=\"mat-mdc-select-trigger\"\n     (click)=\"open()\"\n     #fallbackOverlayOrigin=\"cdkOverlayOrigin\"\n     #trigger>\n\n  <div class=\"mat-mdc-select-value\" [attr.id]=\"_valueId\">\n    @if (empty) {\n      <span class=\"mat-mdc-select-placeholder mat-mdc-select-min-line\">{{placeholder}}</span>\n    } @else {\n      <span class=\"mat-mdc-select-value-text\">\n        @if (customTrigger) {\n          <ng-content select=\"mat-select-trigger\"></ng-content>\n        } @else {\n          <span class=\"mat-mdc-select-min-line\">{{triggerValue}}</span>\n        }\n      </span>\n    }\n  </div>\n\n  <div class=\"mat-mdc-select-arrow-wrapper\">\n    <div class=\"mat-mdc-select-arrow\">\n      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->\n      <svg viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </div>\n  </div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"_preferredOverlayOrigin || fallbackOverlayOrigin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayWidth]=\"_overlayWidth\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div\n    #panel\n    role=\"listbox\"\n    tabindex=\"-1\"\n    class=\"mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open {{ _getPanelTheme() }}\"\n    [attr.id]=\"id + '-panel'\"\n    [attr.aria-multiselectable]=\"multiple\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n    [ngClass]=\"panelClass\"\n    [@transformPanel]=\"'showing'\"\n    (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n    (keydown)=\"_handleKeydown($event)\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-mdc-select{display:inline-block;width:100%;outline:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-select-enabled-trigger-text-color, var(--mat-app-on-surface));font-family:var(--mat-select-trigger-text-font, var(--mat-app-body-large-font));line-height:var(--mat-select-trigger-text-line-height, var(--mat-app-body-large-line-height));font-size:var(--mat-select-trigger-text-size, var(--mat-app-body-large-size));font-weight:var(--mat-select-trigger-text-weight, var(--mat-app-body-large-weight));letter-spacing:var(--mat-select-trigger-text-tracking, var(--mat-app-body-large-tracking))}div.mat-mdc-select-panel{box-shadow:var(--mat-select-container-elevation-shadow)}.mat-mdc-select-disabled{color:var(--mat-select-disabled-trigger-text-color)}.mat-mdc-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-mdc-select-disabled .mat-mdc-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-mdc-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-mdc-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-mdc-select-arrow-wrapper{height:24px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper{transform:none}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after{color:var(--mat-select-invalid-arrow-color, var(--mat-app-error))}.mat-mdc-select-arrow{width:10px;height:5px;position:relative;color:var(--mat-select-enabled-arrow-color, var(--mat-app-on-surface-variant))}.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow{color:var(--mat-select-focused-arrow-color, var(--mat-app-primary))}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow{color:var(--mat-select-disabled-arrow-color)}.mat-mdc-select-arrow svg{fill:currentColor;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:CanvasText}.mat-mdc-select-disabled .cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:GrayText}div.mat-mdc-select-panel{width:100%;max-height:275px;outline:0;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-select-panel-background-color, var(--mat-app-surface-container))}.cdk-high-contrast-active div.mat-mdc-select-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-select-panel-above) div.mat-mdc-select-panel{border-top-left-radius:0;border-top-right-radius:0;transform-origin:top center}.mat-mdc-select-panel-above div.mat-mdc-select-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:bottom center}div.mat-mdc-select-panel .mat-mdc-option{--mdc-list-list-item-container-color: var(--mat-select-panel-background-color)}.mat-mdc-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);color:var(--mat-select-placeholder-text-color, var(--mat-app-on-surface-variant))}._mat-animation-noopable .mat-mdc-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-mdc-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper{cursor:pointer}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label{max-width:calc(100% - 18px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above{max-width:calc(100%/0.75 - 24px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch{max-width:calc(100% - 24px)}.mat-mdc-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper{transform:var(--mat-select-arrow-transform)}"], dependencies: [{ kind: "directive", type: CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }, { kind: "directive", type: CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush", "cdkConnectedOverlayDisposeOnNavigation"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [matSelectAnimations.transformPanel], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatSelect, decorators: [{
            type: Component,
            args: [{ selector: 'mat-select', exportAs: 'matSelect', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'role': 'combobox',
                        'aria-autocomplete': 'none',
                        'aria-haspopup': 'listbox',
                        'class': 'mat-mdc-select',
                        '[attr.id]': 'id',
                        '[attr.tabindex]': 'disabled ? -1 : tabIndex',
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
                    ], standalone: true, imports: [CdkOverlayOrigin, CdkConnectedOverlay, NgClass], template: "<div cdk-overlay-origin\n     class=\"mat-mdc-select-trigger\"\n     (click)=\"open()\"\n     #fallbackOverlayOrigin=\"cdkOverlayOrigin\"\n     #trigger>\n\n  <div class=\"mat-mdc-select-value\" [attr.id]=\"_valueId\">\n    @if (empty) {\n      <span class=\"mat-mdc-select-placeholder mat-mdc-select-min-line\">{{placeholder}}</span>\n    } @else {\n      <span class=\"mat-mdc-select-value-text\">\n        @if (customTrigger) {\n          <ng-content select=\"mat-select-trigger\"></ng-content>\n        } @else {\n          <span class=\"mat-mdc-select-min-line\">{{triggerValue}}</span>\n        }\n      </span>\n    }\n  </div>\n\n  <div class=\"mat-mdc-select-arrow-wrapper\">\n    <div class=\"mat-mdc-select-arrow\">\n      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->\n      <svg viewBox=\"0 0 24 24\" width=\"24px\" height=\"24px\" focusable=\"false\" aria-hidden=\"true\">\n        <path d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </div>\n  </div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"_preferredOverlayOrigin || fallbackOverlayOrigin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayWidth]=\"_overlayWidth\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div\n    #panel\n    role=\"listbox\"\n    tabindex=\"-1\"\n    class=\"mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open {{ _getPanelTheme() }}\"\n    [attr.id]=\"id + '-panel'\"\n    [attr.aria-multiselectable]=\"multiple\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n    [ngClass]=\"panelClass\"\n    [@transformPanel]=\"'showing'\"\n    (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n    (keydown)=\"_handleKeydown($event)\">\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-mdc-select{display:inline-block;width:100%;outline:none;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;color:var(--mat-select-enabled-trigger-text-color, var(--mat-app-on-surface));font-family:var(--mat-select-trigger-text-font, var(--mat-app-body-large-font));line-height:var(--mat-select-trigger-text-line-height, var(--mat-app-body-large-line-height));font-size:var(--mat-select-trigger-text-size, var(--mat-app-body-large-size));font-weight:var(--mat-select-trigger-text-weight, var(--mat-app-body-large-weight));letter-spacing:var(--mat-select-trigger-text-tracking, var(--mat-app-body-large-tracking))}div.mat-mdc-select-panel{box-shadow:var(--mat-select-container-elevation-shadow)}.mat-mdc-select-disabled{color:var(--mat-select-disabled-trigger-text-color)}.mat-mdc-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-mdc-select-disabled .mat-mdc-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-mdc-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-mdc-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-mdc-select-arrow-wrapper{height:24px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper{transform:none}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after{color:var(--mat-select-invalid-arrow-color, var(--mat-app-error))}.mat-mdc-select-arrow{width:10px;height:5px;position:relative;color:var(--mat-select-enabled-arrow-color, var(--mat-app-on-surface-variant))}.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow{color:var(--mat-select-focused-arrow-color, var(--mat-app-primary))}.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow{color:var(--mat-select-disabled-arrow-color)}.mat-mdc-select-arrow svg{fill:currentColor;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:CanvasText}.mat-mdc-select-disabled .cdk-high-contrast-active .mat-mdc-select-arrow svg{fill:GrayText}div.mat-mdc-select-panel{width:100%;max-height:275px;outline:0;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-select-panel-background-color, var(--mat-app-surface-container))}.cdk-high-contrast-active div.mat-mdc-select-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-select-panel-above) div.mat-mdc-select-panel{border-top-left-radius:0;border-top-right-radius:0;transform-origin:top center}.mat-mdc-select-panel-above div.mat-mdc-select-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:bottom center}div.mat-mdc-select-panel .mat-mdc-option{--mdc-list-list-item-container-color: var(--mat-select-panel-background-color)}.mat-mdc-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);color:var(--mat-select-placeholder-text-color, var(--mat-app-on-surface-variant))}._mat-animation-noopable .mat-mdc-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-mdc-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper{cursor:pointer}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label{max-width:calc(100% - 18px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above{max-width:calc(100%/0.75 - 24px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch{max-width:calc(100% - 24px)}.mat-mdc-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper{transform:var(--mat-select-arrow-transform)}"] }]
        }], ctorParameters: () => [{ type: i1.ViewportRuler }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i2.ErrorStateMatcher }, { type: i0.ElementRef }, { type: i3.Directionality, decorators: [{
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
                }] }], propDecorators: { options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }], optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], customTrigger: [{
                type: ContentChild,
                args: [MAT_SELECT_TRIGGER]
            }], userAriaDescribedBy: [{
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
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], tabIndex: [{
                type: Input,
                args: [{
                        transform: (value) => (value == null ? 0 : numberAttribute(value)),
                    }]
            }], hideSingleSelectionIndicator: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], multiple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], disableOptionCentering: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
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
                type: Input,
                args: [{ transform: numberAttribute }]
            }], sortComparator: [{
                type: Input
            }], id: [{
                type: Input
            }], panelWidth: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatSelectTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MatSelectTrigger, isStandalone: true, selector: "mat-select-trigger", providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatSelectTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-select-trigger',
                    providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatSelectTrigger }],
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NlbGVjdC9zZWxlY3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2VsZWN0L3NlbGVjdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCwwQkFBMEIsRUFDMUIsbUJBQW1CLEVBQ25CLGFBQWEsRUFDYixzQkFBc0IsR0FDdkIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFDTCxDQUFDLEVBQ0QsVUFBVSxFQUNWLEtBQUssRUFDTCxjQUFjLEVBQ2QsVUFBVSxFQUNWLFdBQVcsRUFDWCxLQUFLLEVBQ0wsUUFBUSxHQUNULE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFFaEIsT0FBTyxHQUVSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFFTCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUNMLE1BQU0sRUFDTixlQUFlLEVBSWYsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsSUFBSSxFQUVKLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGtCQUFrQixFQUNsQixTQUFTLEVBQ1QsTUFBTSxF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QUFXLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQzs7a0dBRzlELGdCQUFnQjtrQkFMNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLGtCQUFrQixFQUFDLENBQUM7b0JBQ3pFLFVBQVUsRUFBRSxJQUFJO2lCQUNqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcixcbiAgYWRkQXJpYVJlZmVyZW5jZWRJZCxcbiAgTGl2ZUFubm91bmNlcixcbiAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtTZWxlY3Rpb25Nb2RlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEEsXG4gIERPV05fQVJST1csXG4gIEVOVEVSLFxuICBoYXNNb2RpZmllcktleSxcbiAgTEVGVF9BUlJPVyxcbiAgUklHSFRfQVJST1csXG4gIFNQQUNFLFxuICBVUF9BUlJPVyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENka0Nvbm5lY3RlZE92ZXJsYXksXG4gIENka092ZXJsYXlPcmlnaW4sXG4gIENvbm5lY3RlZFBvc2l0aW9uLFxuICBPdmVybGF5LFxuICBTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBpbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBudW1iZXJBdHRyaWJ1dGUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2VsZixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBYnN0cmFjdENvbnRyb2wsXG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtR3JvdXBEaXJlY3RpdmUsXG4gIE5nQ29udHJvbCxcbiAgTmdGb3JtLFxuICBWYWxpZGF0b3JzLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1xuICBfY291bnRHcm91cExhYmVsc0JlZm9yZU9wdGlvbixcbiAgX0Vycm9yU3RhdGVUcmFja2VyLFxuICBfZ2V0T3B0aW9uU2Nyb2xsUG9zaXRpb24sXG4gIEVycm9yU3RhdGVNYXRjaGVyLFxuICBNQVRfT1BUR1JPVVAsXG4gIE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCxcbiAgTWF0T3B0Z3JvdXAsXG4gIE1hdE9wdGlvbixcbiAgTWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TUFUX0ZPUk1fRklFTEQsIE1hdEZvcm1GaWVsZCwgTWF0Rm9ybUZpZWxkQ29udHJvbH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5pbXBvcnQge2RlZmVyLCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN0YXJ0V2l0aCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0U2VsZWN0QW5pbWF0aW9uc30gZnJvbSAnLi9zZWxlY3QtYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcixcbiAgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yLFxuICBnZXRNYXRTZWxlY3ROb25GdW5jdGlvblZhbHVlRXJyb3IsXG59IGZyb20gJy4vc2VsZWN0LWVycm9ycyc7XG5pbXBvcnQge05nQ2xhc3N9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc2Nyb2xsIGhhbmRsaW5nIHdoaWxlIGEgc2VsZWN0IGlzIG9wZW4uICovXG5leHBvcnQgY29uc3QgTUFUX1NFTEVDVF9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48KCkgPT4gU2Nyb2xsU3RyYXRlZ3k+KFxuICAnbWF0LXNlbGVjdC1zY3JvbGwtc3RyYXRlZ3knLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6ICgpID0+IHtcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBpbmplY3QoT3ZlcmxheSk7XG4gICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbiAgICB9LFxuICB9LFxuKTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZKFxuICBvdmVybGF5OiBPdmVybGF5LFxuKTogKCkgPT4gU2Nyb2xsU3RyYXRlZ3kge1xuICByZXR1cm4gKCkgPT4gb3ZlcmxheS5zY3JvbGxTdHJhdGVnaWVzLnJlcG9zaXRpb24oKTtcbn1cblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0U2VsZWN0Q29uZmlnIHtcbiAgLyoqIFdoZXRoZXIgb3B0aW9uIGNlbnRlcmluZyBzaG91bGQgYmUgZGlzYWJsZWQuICovXG4gIGRpc2FibGVPcHRpb25DZW50ZXJpbmc/OiBib29sZWFuO1xuXG4gIC8qKiBUaW1lIHRvIHdhaXQgaW4gbWlsbGlzZWNvbmRzIGFmdGVyIHRoZSBsYXN0IGtleXN0cm9rZSBiZWZvcmUgbW92aW5nIGZvY3VzIHRvIGFuIGl0ZW0uICovXG4gIHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXI7XG5cbiAgLyoqIENsYXNzIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBtZW51J3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGVyIGljb24gaW5kaWNhdG9ycyBzaG91bGQgYmUgaGlkZGVuIGZvciBzaW5nbGUtc2VsZWN0aW9uLiAqL1xuICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHBhbmVsLiBJZiBzZXQgdG8gYGF1dG9gLCB0aGUgcGFuZWwgd2lsbCBtYXRjaCB0aGUgdHJpZ2dlciB3aWR0aC5cbiAgICogSWYgc2V0IHRvIG51bGwgb3IgYW4gZW1wdHkgc3RyaW5nLCB0aGUgcGFuZWwgd2lsbCBncm93IHRvIG1hdGNoIHRoZSBsb25nZXN0IG9wdGlvbidzIHRleHQuXG4gICAqL1xuICBwYW5lbFdpZHRoPzogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbDtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyB0aGUgc2VsZWN0IG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfU0VMRUNUX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RDb25maWc+KCdNQVRfU0VMRUNUX0NPTkZJRycpO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWSxcbiAgZGVwczogW092ZXJsYXldLFxuICB1c2VGYWN0b3J5OiBNQVRfU0VMRUNUX1NDUk9MTF9TVFJBVEVHWV9QUk9WSURFUl9GQUNUT1JZLFxufTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBNYXRTZWxlY3RUcmlnZ2VyYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRTZWxlY3RUcmlnZ2VyYCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGRpcmVjdGl2ZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9TRUxFQ1RfVFJJR0dFUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRTZWxlY3RUcmlnZ2VyPignTWF0U2VsZWN0VHJpZ2dlcicpO1xuXG4vKiogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IHZhbHVlIGhhcyBjaGFuZ2VkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRTZWxlY3QsXG4gICAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnc2VsZWN0Lmh0bWwnLFxuICBzdHlsZVVybDogJ3NlbGVjdC5jc3MnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbm9uZScsXG4gICAgJ2FyaWEtaGFzcG9wdXAnOiAnbGlzdGJveCcsXG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtc2VsZWN0JyxcbiAgICAnW2F0dHIuaWRdJzogJ2lkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiB0YWJJbmRleCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ3BhbmVsT3BlbiA/IGlkICsgXCItcGFuZWxcIiA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdwYW5lbE9wZW4nLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsXSc6ICdhcmlhTGFiZWwgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtcmVxdWlyZWRdJzogJ3JlcXVpcmVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdfZ2V0QXJpYUFjdGl2ZURlc2NlbmRhbnQoKScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXNlbGVjdC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1zZWxlY3QtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLXNlbGVjdC1yZXF1aXJlZF0nOiAncmVxdWlyZWQnLFxuICAgICdbY2xhc3MubWF0LW1kYy1zZWxlY3QtZW1wdHldJzogJ2VtcHR5JyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtc2VsZWN0LW11bHRpcGxlXSc6ICdtdWx0aXBsZScsXG4gICAgJyhrZXlkb3duKSc6ICdfaGFuZGxlS2V5ZG93bigkZXZlbnQpJyxcbiAgICAnKGZvY3VzKSc6ICdfb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ19vbkJsdXIoKScsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFttYXRTZWxlY3RBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE1hdEZvcm1GaWVsZENvbnRyb2wsIHVzZUV4aXN0aW5nOiBNYXRTZWxlY3R9LFxuICAgIHtwcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRTZWxlY3R9LFxuICBdLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ2RrT3ZlcmxheU9yaWdpbiwgQ2RrQ29ubmVjdGVkT3ZlcmxheSwgTmdDbGFzc10sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFNlbGVjdFxuICBpbXBsZW1lbnRzXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBEb0NoZWNrLFxuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE1hdEZvcm1GaWVsZENvbnRyb2w8YW55Plxue1xuICAvKiogQWxsIG9mIHRoZSBkZWZpbmVkIHNlbGVjdCBvcHRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgaXMgb25seSBuZWNlc3NhcnkgZm9yIHRoZSBub24tTURDIHNlbGVjdCwgYnV0IGl0J3MgdGVjaG5pY2FsbHkgYVxuICAvLyBwdWJsaWMgQVBJIHNvIHdlIGhhdmUgdG8ga2VlcCBpdC4gSXQgc2hvdWxkIGJlIGRlcHJlY2F0ZWQgYW5kIHJlbW92ZWQgZXZlbnR1YWxseS5cbiAgLyoqIEFsbCBvZiB0aGUgZGVmaW5lZCBncm91cHMgb2Ygb3B0aW9ucy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfT1BUR1JPVVAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogVXNlci1zdXBwbGllZCBvdmVycmlkZSBvZiB0aGUgdHJpZ2dlciBlbGVtZW50LiAqL1xuICBAQ29udGVudENoaWxkKE1BVF9TRUxFQ1RfVFJJR0dFUikgY3VzdG9tVHJpZ2dlcjogTWF0U2VsZWN0VHJpZ2dlcjtcblxuICAvKipcbiAgICogVGhpcyBwb3NpdGlvbiBjb25maWcgZW5zdXJlcyB0aGF0IHRoZSB0b3AgXCJzdGFydFwiIGNvcm5lciBvZiB0aGUgb3ZlcmxheVxuICAgKiBpcyBhbGlnbmVkIHdpdGggd2l0aCB0aGUgdG9wIFwic3RhcnRcIiBvZiB0aGUgb3JpZ2luIGJ5IGRlZmF1bHQgKG92ZXJsYXBwaW5nXG4gICAqIHRoZSB0cmlnZ2VyIGNvbXBsZXRlbHkpLiBJZiB0aGUgcGFuZWwgY2Fubm90IGZpdCBiZWxvdyB0aGUgdHJpZ2dlciwgaXRcbiAgICogd2lsbCBmYWxsIGJhY2sgdG8gYSBwb3NpdGlvbiBhYm92ZSB0aGUgdHJpZ2dlci5cbiAgICovXG4gIF9wb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ3RvcCcsXG4gICAgfSxcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnZW5kJyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdlbmQnLFxuICAgICAgb3ZlcmxheVk6ICd0b3AnLFxuICAgIH0sXG4gICAge1xuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbScsXG4gICAgICBwYW5lbENsYXNzOiAnbWF0LW1kYy1zZWxlY3QtcGFuZWwtYWJvdmUnLFxuICAgIH0sXG4gICAge1xuICAgICAgb3JpZ2luWDogJ2VuZCcsXG4gICAgICBvcmlnaW5ZOiAndG9wJyxcbiAgICAgIG92ZXJsYXlYOiAnZW5kJyxcbiAgICAgIG92ZXJsYXlZOiAnYm90dG9tJyxcbiAgICAgIHBhbmVsQ2xhc3M6ICdtYXQtbWRjLXNlbGVjdC1wYW5lbC1hYm92ZScsXG4gICAgfSxcbiAgXTtcblxuICAvKiogU2Nyb2xscyBhIHBhcnRpY3VsYXIgb3B0aW9uIGludG8gdGhlIHZpZXcuICovXG4gIF9zY3JvbGxPcHRpb25JbnRvVmlldyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF07XG5cbiAgICBpZiAob3B0aW9uKSB7XG4gICAgICBjb25zdCBwYW5lbDogSFRNTEVsZW1lbnQgPSB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBsYWJlbENvdW50ID0gX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVPcHRpb24oaW5kZXgsIHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25Hcm91cHMpO1xuICAgICAgY29uc3QgZWxlbWVudCA9IG9wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAwICYmIGxhYmVsQ291bnQgPT09IDEpIHtcbiAgICAgICAgLy8gSWYgd2UndmUgZ290IG9uZSBncm91cCBsYWJlbCBiZWZvcmUgdGhlIG9wdGlvbiBhbmQgd2UncmUgYXQgdGhlIHRvcCBvcHRpb24sXG4gICAgICAgIC8vIHNjcm9sbCB0aGUgbGlzdCB0byB0aGUgdG9wLiBUaGlzIGlzIGJldHRlciBVWCB0aGFuIHNjcm9sbGluZyB0aGUgbGlzdCB0byB0aGVcbiAgICAgICAgLy8gdG9wIG9mIHRoZSBvcHRpb24sIGJlY2F1c2UgaXQgYWxsb3dzIHRoZSB1c2VyIHRvIHJlYWQgdGhlIHRvcCBncm91cCdzIGxhYmVsLlxuICAgICAgICBwYW5lbC5zY3JvbGxUb3AgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFuZWwuc2Nyb2xsVG9wID0gX2dldE9wdGlvblNjcm9sbFBvc2l0aW9uKFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0VG9wLFxuICAgICAgICAgIGVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgICAgIHBhbmVsLnNjcm9sbFRvcCxcbiAgICAgICAgICBwYW5lbC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBwYW5lbCBoYXMgYmVlbiBvcGVuZWQgYW5kIHRoZSBvdmVybGF5IGhhcyBzZXR0bGVkIG9uIGl0cyBmaW5hbCBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25pbmdTZXR0bGVkKCkge1xuICAgIHRoaXMuX3Njcm9sbE9wdGlvbkludG9WaWV3KHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4IHx8IDApO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjaGFuZ2UgZXZlbnQgb2JqZWN0IHRoYXQgc2hvdWxkIGJlIGVtaXR0ZWQgYnkgdGhlIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfZ2V0Q2hhbmdlRXZlbnQodmFsdWU6IGFueSkge1xuICAgIHJldHVybiBuZXcgTWF0U2VsZWN0Q2hhbmdlKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBGYWN0b3J5IGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIGEgc2Nyb2xsIHN0cmF0ZWd5IGZvciB0aGlzIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5OiAoKSA9PiBTY3JvbGxTdHJhdGVneTtcblxuICAvKiogV2hldGhlciBvciBub3QgdGhlIG92ZXJsYXkgcGFuZWwgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfcGFuZWxPcGVuID0gZmFsc2U7XG5cbiAgLyoqIENvbXBhcmlzb24gZnVuY3Rpb24gdG8gc3BlY2lmeSB3aGljaCBvcHRpb24gaXMgZGlzcGxheWVkLiBEZWZhdWx0cyB0byBvYmplY3QgZXF1YWxpdHkuICovXG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoID0gKG8xOiBhbnksIG8yOiBhbnkpID0+IG8xID09PSBvMjtcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGlzIGlucHV0LiAqL1xuICBwcml2YXRlIF91aWQgPSBgbWF0LXNlbGVjdC0ke25leHRVbmlxdWVJZCsrfWA7XG5cbiAgLyoqIEN1cnJlbnQgYGFyaWEtbGFiZWxsZWRieWAgdmFsdWUgZm9yIHRoZSBzZWxlY3QgdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfdHJpZ2dlckFyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogS2VlcHMgdHJhY2sgb2YgdGhlIHByZXZpb3VzIGZvcm0gY29udHJvbCBhc3NpZ25lZCB0byB0aGUgc2VsZWN0LlxuICAgKiBVc2VkIHRvIGRldGVjdCBpZiBpdCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIHByaXZhdGUgX3ByZXZpb3VzQ29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqIFRyYWNrcyB0aGUgZXJyb3Igc3RhdGUgb2YgdGhlIHNlbGVjdC4gKi9cbiAgcHJpdmF0ZSBfZXJyb3JTdGF0ZVRyYWNrZXI6IF9FcnJvclN0YXRlVHJhY2tlcjtcblxuICAvKipcbiAgICogRW1pdHMgd2hlbmV2ZXIgdGhlIGNvbXBvbmVudCBzdGF0ZSBjaGFuZ2VzIGFuZCBzaG91bGQgY2F1c2UgdGhlIHBhcmVudFxuICAgKiBmb3JtLWZpZWxkIHRvIHVwZGF0ZS4gSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgTWF0Rm9ybUZpZWxkQ29udHJvbGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIERpc2FibGUgdGhlIGF1dG9tYXRpYyBsYWJlbGluZyB0byBhdm9pZCBpc3N1ZXMgbGlrZSAjMjcyNDEuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IGRpc2FibGVBdXRvbWF0aWNMYWJlbGluZyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgQElucHV0KCdhcmlhLWRlc2NyaWJlZGJ5JykgdXNlckFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xuXG4gIC8qKiBEZWFscyB3aXRoIHRoZSBzZWxlY3Rpb24gbG9naWMuICovXG4gIF9zZWxlY3Rpb25Nb2RlbDogU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPjtcblxuICAvKiogTWFuYWdlcyBrZXlib2FyZCBldmVudHMgZm9yIG9wdGlvbnMgaW4gdGhlIHBhbmVsLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogSWRlYWwgb3JpZ2luIGZvciB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW46IENka092ZXJsYXlPcmlnaW4gfCBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaWR0aCBvZiB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgX292ZXJsYXlXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBgVmlldyAtPiBtb2RlbCBjYWxsYmFjayBjYWxsZWQgd2hlbiB2YWx1ZSBjaGFuZ2VzYCAqL1xuICBfb25DaGFuZ2U6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgLyoqIGBWaWV3IC0+IG1vZGVsIGNhbGxiYWNrIGNhbGxlZCB3aGVuIHNlbGVjdCBoYXMgYmVlbiB0b3VjaGVkYCAqL1xuICBfb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIElEIGZvciB0aGUgRE9NIG5vZGUgY29udGFpbmluZyB0aGUgc2VsZWN0J3MgdmFsdWUuICovXG4gIF92YWx1ZUlkID0gYG1hdC1zZWxlY3QtdmFsdWUtJHtuZXh0VW5pcXVlSWQrK31gO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBwYW5lbCBlbGVtZW50IGlzIGZpbmlzaGVkIHRyYW5zZm9ybWluZyBpbi4gKi9cbiAgcmVhZG9ubHkgX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbSA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICAvKiogU3RyYXRlZ3kgdGhhdCB3aWxsIGJlIHVzZWQgdG8gaGFuZGxlIHNjcm9sbGluZyB3aGlsZSB0aGUgc2VsZWN0IHBhbmVsIGlzIG9wZW4uICovXG4gIF9zY3JvbGxTdHJhdGVneTogU2Nyb2xsU3RyYXRlZ3k7XG5cbiAgX292ZXJsYXlQYW5lbENsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSA9IHRoaXMuX2RlZmF1bHRPcHRpb25zPy5vdmVybGF5UGFuZWxDbGFzcyB8fCAnJztcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGZvY3VzZWQuICovXG4gIGdldCBmb2N1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb2N1c2VkIHx8IHRoaXMuX3BhbmVsT3BlbjtcbiAgfVxuICBwcml2YXRlIF9mb2N1c2VkID0gZmFsc2U7XG5cbiAgLyoqIEEgbmFtZSBmb3IgdGhpcyBjb250cm9sIHRoYXQgY2FuIGJlIHVzZWQgYnkgYG1hdC1mb3JtLWZpZWxkYC4gKi9cbiAgY29udHJvbFR5cGUgPSAnbWF0LXNlbGVjdCc7XG5cbiAgLyoqIFRyaWdnZXIgdGhhdCBvcGVucyB0aGUgc2VsZWN0LiAqL1xuICBAVmlld0NoaWxkKCd0cmlnZ2VyJykgdHJpZ2dlcjogRWxlbWVudFJlZjtcblxuICAvKiogUGFuZWwgY29udGFpbmluZyB0aGUgc2VsZWN0IG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIE92ZXJsYXkgcGFuZSBjb250YWluaW5nIHRoZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXkpXG4gIHByb3RlY3RlZCBfb3ZlcmxheURpcjogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcblxuICAvKiogQ2xhc3NlcyB0byBiZSBwYXNzZWQgdG8gdGhlIHNlbGVjdCBwYW5lbC4gU3VwcG9ydHMgdGhlIHNhbWUgc3ludGF4IGFzIGBuZ0NsYXNzYC4gKi9cbiAgQElucHV0KCkgcGFuZWxDbGFzczogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIGluIHRoZSBzZWxlY3QgYXJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGRpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGFiIGluZGV4IG9mIHRoZSBzZWxlY3QuICovXG4gIEBJbnB1dCh7XG4gICAgdHJhbnNmb3JtOiAodmFsdWU6IHVua25vd24pID0+ICh2YWx1ZSA9PSBudWxsID8gMCA6IG51bWJlckF0dHJpYnV0ZSh2YWx1ZSkpLFxuICB9KVxuICB0YWJJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogV2hldGhlciBjaGVja21hcmsgaW5kaWNhdG9yIGZvciBzaW5nbGUtc2VsZWN0aW9uIG9wdGlvbnMgaXMgaGlkZGVuLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yO1xuICB9XG4gIHNldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA9IHZhbHVlO1xuICAgIHRoaXMuX3N5bmNQYXJlbnRQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjogYm9vbGVhbiA9XG4gICAgdGhpcy5fZGVmYXVsdE9wdGlvbnM/LmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG5cbiAgLyoqIFBsYWNlaG9sZGVyIHRvIGJlIHNob3duIGlmIG5vIHZhbHVlIGhhcyBiZWVuIHNlbGVjdGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcGxhY2Vob2xkZXI7XG4gIH1cbiAgc2V0IHBsYWNlaG9sZGVyKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wbGFjZWhvbGRlciA9IHZhbHVlO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuICBwcml2YXRlIF9wbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjb21wb25lbnQgaXMgcmVxdWlyZWQuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZCA/PyB0aGlzLm5nQ29udHJvbD8uY29udHJvbD8uaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMucmVxdWlyZWQpID8/IGZhbHNlO1xuICB9XG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gdmFsdWU7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBhbGxvd2VkIHRvIHNlbGVjdCBtdWx0aXBsZSBvcHRpb25zLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGdldCBtdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbXVsdGlwbGU7XG4gIH1cbiAgc2V0IG11bHRpcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBnZXRNYXRTZWxlY3REeW5hbWljTXVsdGlwbGVFcnJvcigpO1xuICAgIH1cblxuICAgIHRoaXMuX211bHRpcGxlID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfbXVsdGlwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0byBjZW50ZXIgdGhlIGFjdGl2ZSBvcHRpb24gb3ZlciB0aGUgdHJpZ2dlci4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KVxuICBkaXNhYmxlT3B0aW9uQ2VudGVyaW5nID0gdGhpcy5fZGVmYXVsdE9wdGlvbnM/LmRpc2FibGVPcHRpb25DZW50ZXJpbmcgPz8gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGNvbXBhcmUgdGhlIG9wdGlvbiB2YWx1ZXMgd2l0aCB0aGUgc2VsZWN0ZWQgdmFsdWVzLiBUaGUgZmlyc3QgYXJndW1lbnRcbiAgICogaXMgYSB2YWx1ZSBmcm9tIGFuIG9wdGlvbi4gVGhlIHNlY29uZCBpcyBhIHZhbHVlIGZyb20gdGhlIHNlbGVjdGlvbi4gQSBib29sZWFuXG4gICAqIHNob3VsZCBiZSByZXR1cm5lZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb21wYXJlV2l0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcGFyZVdpdGg7XG4gIH1cbiAgc2V0IGNvbXBhcmVXaXRoKGZuOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IGdldE1hdFNlbGVjdE5vbkZ1bmN0aW9uVmFsdWVFcnJvcigpO1xuICAgIH1cbiAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xuICAgICAgLy8gQSBkaWZmZXJlbnQgY29tcGFyYXRvciBtZWFucyB0aGUgc2VsZWN0aW9uIGNvdWxkIGNoYW5nZS5cbiAgICAgIHRoaXMuX2luaXRpYWxpemVTZWxlY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogVmFsdWUgb2YgdGhlIHNlbGVjdCBjb250cm9sLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBoYXNBc3NpZ25lZCA9IHRoaXMuX2Fzc2lnblZhbHVlKG5ld1ZhbHVlKTtcblxuICAgIGlmIChoYXNBc3NpZ25lZCkge1xuICAgICAgdGhpcy5fb25DaGFuZ2UobmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF92YWx1ZTogYW55O1xuXG4gIC8qKiBBcmlhIGxhYmVsIG9mIHRoZSBzZWxlY3QuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIElucHV0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIE9iamVjdCB1c2VkIHRvIGNvbnRyb2wgd2hlbiBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uICovXG4gIEBJbnB1dCgpXG4gIGdldCBlcnJvclN0YXRlTWF0Y2hlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIubWF0Y2hlcjtcbiAgfVxuICBzZXQgZXJyb3JTdGF0ZU1hdGNoZXIodmFsdWU6IEVycm9yU3RhdGVNYXRjaGVyKSB7XG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIubWF0Y2hlciA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIFRpbWUgdG8gd2FpdCBpbiBtaWxsaXNlY29uZHMgYWZ0ZXIgdGhlIGxhc3Qga2V5c3Ryb2tlIGJlZm9yZSBtb3ZpbmcgZm9jdXMgdG8gYW4gaXRlbS4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZX0pXG4gIHR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw6IG51bWJlcjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdXNlZCB0byBzb3J0IHRoZSB2YWx1ZXMgaW4gYSBzZWxlY3QgaW4gbXVsdGlwbGUgbW9kZS5cbiAgICogRm9sbG93cyB0aGUgc2FtZSBsb2dpYyBhcyBgQXJyYXkucHJvdG90eXBlLnNvcnRgLlxuICAgKi9cbiAgQElucHV0KCkgc29ydENvbXBhcmF0b3I6IChhOiBNYXRPcHRpb24sIGI6IE1hdE9wdGlvbiwgb3B0aW9uczogTWF0T3B0aW9uW10pID0+IG51bWJlcjtcblxuICAvKiogVW5pcXVlIGlkIG9mIHRoZSBlbGVtZW50LiAqL1xuICBASW5wdXQoKVxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cbiAgc2V0IGlkKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbHVlIHx8IHRoaXMuX3VpZDtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cbiAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgc2VsZWN0IGlzIGluIGFuIGVycm9yIHN0YXRlLiAqL1xuICBnZXQgZXJyb3JTdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIuZXJyb3JTdGF0ZTtcbiAgfVxuICBzZXQgZXJyb3JTdGF0ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Vycm9yU3RhdGVUcmFja2VyLmVycm9yU3RhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgcGFuZWwuIElmIHNldCB0byBgYXV0b2AsIHRoZSBwYW5lbCB3aWxsIG1hdGNoIHRoZSB0cmlnZ2VyIHdpZHRoLlxuICAgKiBJZiBzZXQgdG8gbnVsbCBvciBhbiBlbXB0eSBzdHJpbmcsIHRoZSBwYW5lbCB3aWxsIGdyb3cgdG8gbWF0Y2ggdGhlIGxvbmdlc3Qgb3B0aW9uJ3MgdGV4dC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPVxuICAgIHRoaXMuX2RlZmF1bHRPcHRpb25zICYmIHR5cGVvZiB0aGlzLl9kZWZhdWx0T3B0aW9ucy5wYW5lbFdpZHRoICE9PSAndW5kZWZpbmVkJ1xuICAgICAgPyB0aGlzLl9kZWZhdWx0T3B0aW9ucy5wYW5lbFdpZHRoXG4gICAgICA6ICdhdXRvJztcblxuICBwcml2YXRlIF9pbml0aWFsaXplZCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqIENvbWJpbmVkIHN0cmVhbSBvZiBhbGwgb2YgdGhlIGNoaWxkIG9wdGlvbnMnIGNoYW5nZSBldmVudHMuICovXG4gIHJlYWRvbmx5IG9wdGlvblNlbGVjdGlvbkNoYW5nZXM6IE9ic2VydmFibGU8TWF0T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiA9IGRlZmVyKCgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNoYW5nZXMucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG9wdGlvbnMpLFxuICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4ub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5vblNlbGVjdGlvbkNoYW5nZSkpKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRpYWxpemVkLnBpcGUoc3dpdGNoTWFwKCgpID0+IHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcykpO1xuICB9KTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZWxlY3QgcGFuZWwgaGFzIGJlZW4gdG9nZ2xlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYmVlbiBvcGVuZWQuICovXG4gIEBPdXRwdXQoJ29wZW5lZCcpIHJlYWRvbmx5IF9vcGVuZWRTdHJlYW06IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLm9wZW5lZENoYW5nZS5waXBlKFxuICAgIGZpbHRlcihvID0+IG8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0IGhhcyBiZWVuIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgnY2xvc2VkJykgcmVhZG9ubHkgX2Nsb3NlZFN0cmVhbTogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMub3BlbmVkQ2hhbmdlLnBpcGUoXG4gICAgZmlsdGVyKG8gPT4gIW8pLFxuICAgIG1hcCgoKSA9PiB7fSksXG4gICk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VsZWN0ZWQgdmFsdWUgaGFzIGJlZW4gY2hhbmdlZCBieSB0aGUgdXNlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdGlvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TWF0U2VsZWN0Q2hhbmdlPigpO1xuXG4gIC8qKlxuICAgKiBFdmVudCB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSByYXcgdmFsdWUgb2YgdGhlIHNlbGVjdCBjaGFuZ2VzLiBUaGlzIGlzIGhlcmUgcHJpbWFyaWx5XG4gICAqIHRvIGZhY2lsaXRhdGUgdGhlIHR3by13YXkgYmluZGluZyBmb3IgdGhlIGB2YWx1ZWAgaW5wdXQuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIEBPdXRwdXQoKSByZWFkb25seSB2YWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3ZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgVW51c2VkIHBhcmFtLCB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxOS4wLjBcbiAgICAgKi9cbiAgICBfdW51c2VkTmdab25lOiBOZ1pvbmUsXG4gICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyOiBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBPcHRpb25hbCgpIHBhcmVudEZvcm06IE5nRm9ybSxcbiAgICBAT3B0aW9uYWwoKSBwYXJlbnRGb3JtR3JvdXA6IEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEKSBwcm90ZWN0ZWQgX3BhcmVudEZvcm1GaWVsZDogTWF0Rm9ybUZpZWxkLFxuICAgIEBTZWxmKCkgQE9wdGlvbmFsKCkgcHVibGljIG5nQ29udHJvbDogTmdDb250cm9sLFxuICAgIEBBdHRyaWJ1dGUoJ3RhYmluZGV4JykgdGFiSW5kZXg6IHN0cmluZyxcbiAgICBASW5qZWN0KE1BVF9TRUxFQ1RfU0NST0xMX1NUUkFURUdZKSBzY3JvbGxTdHJhdGVneUZhY3Rvcnk6IGFueSxcbiAgICBwcml2YXRlIF9saXZlQW5ub3VuY2VyOiBMaXZlQW5ub3VuY2VyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX1NFTEVDVF9DT05GSUcpIHByb3RlY3RlZCBfZGVmYXVsdE9wdGlvbnM/OiBNYXRTZWxlY3RDb25maWcsXG4gICkge1xuICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgLy8gTm90ZTogd2UgcHJvdmlkZSB0aGUgdmFsdWUgYWNjZXNzb3IgdGhyb3VnaCBoZXJlLCBpbnN0ZWFkIG9mXG4gICAgICAvLyB0aGUgYHByb3ZpZGVyc2AgdG8gYXZvaWQgcnVubmluZyBpbnRvIGEgY2lyY3VsYXIgaW1wb3J0LlxuICAgICAgdGhpcy5uZ0NvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBzZXQgdGhpcyB3aGVuIHRoZSBkZWZhdWx0cyBwYXNzIGl0IGluLCBvdGhlcndpc2UgaXQgc2hvdWxkXG4gICAgLy8gc3RheSBhcyBgdW5kZWZpbmVkYCBzbyB0aGF0IGl0IGZhbGxzIGJhY2sgdG8gdGhlIGRlZmF1bHQgaW4gdGhlIGtleSBtYW5hZ2VyLlxuICAgIGlmIChfZGVmYXVsdE9wdGlvbnM/LnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy50eXBlYWhlYWREZWJvdW5jZUludGVydmFsID0gX2RlZmF1bHRPcHRpb25zLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWw7XG4gICAgfVxuXG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIgPSBuZXcgX0Vycm9yU3RhdGVUcmFja2VyKFxuICAgICAgZGVmYXVsdEVycm9yU3RhdGVNYXRjaGVyLFxuICAgICAgbmdDb250cm9sLFxuICAgICAgcGFyZW50Rm9ybUdyb3VwLFxuICAgICAgcGFyZW50Rm9ybSxcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLFxuICAgICk7XG4gICAgdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5ID0gc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5O1xuICAgIHRoaXMuX3Njcm9sbFN0cmF0ZWd5ID0gdGhpcy5fc2Nyb2xsU3RyYXRlZ3lGYWN0b3J5KCk7XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgLy8gRm9yY2Ugc2V0dGVyIHRvIGJlIGNhbGxlZCBpbiBjYXNlIGlkIHdhcyBub3Qgc3BlY2lmaWVkLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0T3B0aW9uPih0aGlzLm11bHRpcGxlKTtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG5cbiAgICAvLyBXZSBuZWVkIGBkaXN0aW5jdFVudGlsQ2hhbmdlZGAgaGVyZSwgYmVjYXVzZSBzb21lIGJyb3dzZXJzIHdpbGxcbiAgICAvLyBmaXJlIHRoZSBhbmltYXRpb24gZW5kIGV2ZW50IHR3aWNlIGZvciB0aGUgc2FtZSBhbmltYXRpb24uIFNlZTpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NFxuICAgIHRoaXMuX3BhbmVsRG9uZUFuaW1hdGluZ1N0cmVhbVxuICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9wYW5lbERvbmVBbmltYXRpbmcodGhpcy5wYW5lbE9wZW4pKTtcblxuICAgIHRoaXMuX3ZpZXdwb3J0UnVsZXJcbiAgICAgIC5jaGFuZ2UoKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlXaWR0aCA9IHRoaXMuX2dldE92ZXJsYXlXaWR0aCh0aGlzLl9wcmVmZXJyZWRPdmVybGF5T3JpZ2luKTtcbiAgICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVkLm5leHQoKTtcbiAgICB0aGlzLl9pbml0aWFsaXplZC5jb21wbGV0ZSgpO1xuXG4gICAgdGhpcy5faW5pdEtleU1hbmFnZXIoKTtcblxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNoYW5nZWQucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBldmVudC5hZGRlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0KCkpO1xuICAgICAgZXZlbnQucmVtb3ZlZC5mb3JFYWNoKG9wdGlvbiA9PiBvcHRpb24uZGVzZWxlY3QoKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuY2hhbmdlcy5waXBlKHN0YXJ0V2l0aChudWxsKSwgdGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzZXRPcHRpb25zKCk7XG4gICAgICB0aGlzLl9pbml0aWFsaXplU2VsZWN0aW9uKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgY29uc3QgbmV3QXJpYUxhYmVsbGVkYnkgPSB0aGlzLl9nZXRUcmlnZ2VyQXJpYUxhYmVsbGVkYnkoKTtcbiAgICBjb25zdCBuZ0NvbnRyb2wgPSB0aGlzLm5nQ29udHJvbDtcblxuICAgIC8vIFdlIGhhdmUgdG8gbWFuYWdlIHNldHRpbmcgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIG91cnNlbHZlcywgYmVjYXVzZSBwYXJ0IG9mIGl0cyB2YWx1ZVxuICAgIC8vIGlzIGNvbXB1dGVkIGFzIGEgcmVzdWx0IG9mIGEgY29udGVudCBxdWVyeSB3aGljaCBjYW4gY2F1c2UgdGhpcyBiaW5kaW5nIHRvIHRyaWdnZXIgYVxuICAgIC8vIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3IuXG4gICAgaWYgKG5ld0FyaWFMYWJlbGxlZGJ5ICE9PSB0aGlzLl90cmlnZ2VyQXJpYUxhYmVsbGVkQnkpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5fdHJpZ2dlckFyaWFMYWJlbGxlZEJ5ID0gbmV3QXJpYUxhYmVsbGVkYnk7XG4gICAgICBpZiAobmV3QXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIG5ld0FyaWFMYWJlbGxlZGJ5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmdDb250cm9sKSB7XG4gICAgICAvLyBUaGUgZGlzYWJsZWQgc3RhdGUgbWlnaHQgZ28gb3V0IG9mIHN5bmMgaWYgdGhlIGZvcm0gZ3JvdXAgaXMgc3dhcHBlZCBvdXQuIFNlZSAjMTc4NjAuXG4gICAgICBpZiAodGhpcy5fcHJldmlvdXNDb250cm9sICE9PSBuZ0NvbnRyb2wuY29udHJvbCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fcHJldmlvdXNDb250cm9sICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IG51bGwgJiZcbiAgICAgICAgICBuZ0NvbnRyb2wuZGlzYWJsZWQgIT09IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IG5nQ29udHJvbC5kaXNhYmxlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzQ29udHJvbCA9IG5nQ29udHJvbC5jb250cm9sO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVwZGF0ZUVycm9yU3RhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgLy8gVXBkYXRpbmcgdGhlIGRpc2FibGVkIHN0YXRlIGlzIGhhbmRsZWQgYnkgdGhlIGlucHV0LCBidXQgd2UgbmVlZCB0byBhZGRpdGlvbmFsbHkgbGV0XG4gICAgLy8gdGhlIHBhcmVudCBmb3JtIGZpZWxkIGtub3cgdG8gcnVuIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGUgZGlzYWJsZWQgc3RhdGUgY2hhbmdlcy5cbiAgICBpZiAoY2hhbmdlc1snZGlzYWJsZWQnXSB8fCBjaGFuZ2VzWyd1c2VyQXJpYURlc2NyaWJlZEJ5J10pIHtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sndHlwZWFoZWFkRGVib3VuY2VJbnRlcnZhbCddICYmIHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aFR5cGVBaGVhZCh0aGlzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXI/LmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgICB0aGlzLl9jbGVhckZyb21Nb2RhbCgpO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgdGhlIG92ZXJsYXkgcGFuZWwgb3BlbiBvciBjbG9zZWQuICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqIE9wZW5zIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY2FuT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSXQncyBpbXBvcnRhbnQgdGhhdCB3ZSByZWFkIHRoaXMgYXMgbGF0ZSBhcyBwb3NzaWJsZSwgYmVjYXVzZSBkb2luZyBzbyBlYXJsaWVyIHdpbGxcbiAgICAvLyByZXR1cm4gYSBkaWZmZXJlbnQgZWxlbWVudCBzaW5jZSBpdCdzIGJhc2VkIG9uIHF1ZXJpZXMgaW4gdGhlIGZvcm0gZmllbGQgd2hpY2ggbWF5XG4gICAgLy8gbm90IGhhdmUgcnVuIHlldC4gQWxzbyB0aGlzIG5lZWRzIHRvIGJlIGFzc2lnbmVkIGJlZm9yZSB3ZSBtZWFzdXJlIHRoZSBvdmVybGF5IHdpZHRoLlxuICAgIGlmICh0aGlzLl9wYXJlbnRGb3JtRmllbGQpIHtcbiAgICAgIHRoaXMuX3ByZWZlcnJlZE92ZXJsYXlPcmlnaW4gPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQuZ2V0Q29ubmVjdGVkT3ZlcmxheU9yaWdpbigpO1xuICAgIH1cblxuICAgIHRoaXMuX292ZXJsYXlXaWR0aCA9IHRoaXMuX2dldE92ZXJsYXlXaWR0aCh0aGlzLl9wcmVmZXJyZWRPdmVybGF5T3JpZ2luKTtcbiAgICB0aGlzLl9hcHBseU1vZGFsUGFuZWxPd25lcnNoaXAoKTtcbiAgICB0aGlzLl9wYW5lbE9wZW4gPSB0cnVlO1xuICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbihudWxsKTtcbiAgICB0aGlzLl9oaWdobGlnaHRDb3JyZWN0T3B0aW9uKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAvLyBSZXF1aXJlZCBmb3IgdGhlIE1EQyBmb3JtIGZpZWxkIHRvIHBpY2sgdXAgd2hlbiB0aGUgb3ZlcmxheSBoYXMgYmVlbiBvcGVuZWQuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIHdoaWNoIG1vZGFsIHdlIGhhdmUgbW9kaWZpZWQgdGhlIGBhcmlhLW93bnNgIGF0dHJpYnV0ZSBvZi4gV2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpc1xuICAgKiBpbnNpZGUgYW4gYXJpYS1tb2RhbCwgd2UgYXBwbHkgYXJpYS1vd25zIHRvIHRoZSBwYXJlbnQgbW9kYWwgd2l0aCB0aGUgYGlkYCBvZiB0aGUgb3B0aW9uc1xuICAgKiBwYW5lbC4gVHJhY2sgdGhlIG1vZGFsIHdlIGhhdmUgY2hhbmdlZCBzbyB3ZSBjYW4gdW5kbyB0aGUgY2hhbmdlcyBvbiBkZXN0cm95LlxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhY2tlZE1vZGFsOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBpbnNpZGUgb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIGNvbm5lY3RcbiAgICogdGhhdCBtb2RhbCB0byB0aGUgb3B0aW9ucyBwYW5lbCB3aXRoIGBhcmlhLW93bnNgLlxuICAgKlxuICAgKiBGb3Igc29tZSBicm93c2VyICsgc2NyZWVuIHJlYWRlciBjb21iaW5hdGlvbnMsIHdoZW4gbmF2aWdhdGlvbiBpcyBpbnNpZGVcbiAgICogb2YgYW4gYGFyaWEtbW9kYWxgIGVsZW1lbnQsIHRoZSBzY3JlZW4gcmVhZGVyIHRyZWF0cyBldmVyeXRoaW5nIG91dHNpZGVcbiAgICogb2YgdGhhdCBtb2RhbCBhcyBoaWRkZW4gb3IgaW52aXNpYmxlLlxuICAgKlxuICAgKiBUaGlzIGNhdXNlcyBhIHByb2JsZW0gd2hlbiB0aGUgY29tYm9ib3ggdHJpZ2dlciBpcyBfaW5zaWRlXyBvZiBhIG1vZGFsLCBiZWNhdXNlIHRoZVxuICAgKiBvcHRpb25zIHBhbmVsIGlzIHJlbmRlcmVkIF9vdXRzaWRlXyBvZiB0aGF0IG1vZGFsLCBwcmV2ZW50aW5nIHNjcmVlbiByZWFkZXIgbmF2aWdhdGlvblxuICAgKiBmcm9tIHJlYWNoaW5nIHRoZSBwYW5lbC5cbiAgICpcbiAgICogV2UgY2FuIHdvcmsgYXJvdW5kIHRoaXMgaXNzdWUgYnkgYXBwbHlpbmcgYGFyaWEtb3duc2AgdG8gdGhlIG1vZGFsIHdpdGggdGhlIGBpZGAgb2ZcbiAgICogdGhlIG9wdGlvbnMgcGFuZWwuIFRoaXMgZWZmZWN0aXZlbHkgY29tbXVuaWNhdGVzIHRvIGFzc2lzdGl2ZSB0ZWNobm9sb2d5IHRoYXQgdGhlXG4gICAqIG9wdGlvbnMgcGFuZWwgaXMgcGFydCBvZiB0aGUgc2FtZSBpbnRlcmFjdGlvbiBhcyB0aGUgbW9kYWwuXG4gICAqXG4gICAqIEF0IHRpbWUgb2YgdGhpcyB3cml0aW5nLCB0aGlzIGlzc3VlIGlzIHByZXNlbnQgaW4gVm9pY2VPdmVyLlxuICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjA2OTRcbiAgICovXG4gIHByaXZhdGUgX2FwcGx5TW9kYWxQYW5lbE93bmVyc2hpcCgpIHtcbiAgICAvLyBUT0RPKGh0dHA6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMjY4NTMpOiBjb25zaWRlciBkZS1kdXBsaWNhdGluZyB0aGlzIHdpdGhcbiAgICAvLyB0aGUgYExpdmVBbm5vdW5jZXJgIGFuZCBhbnkgb3RoZXIgdXNhZ2VzLlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHRoZSBzZWxlY3RvciBoZXJlIGlzIGxpbWl0ZWQgdG8gQ0RLIG92ZXJsYXlzIGF0IHRoZSBtb21lbnQgaW4gb3JkZXIgdG8gcmVkdWNlIHRoZVxuICAgIC8vIHNlY3Rpb24gb2YgdGhlIERPTSB3ZSBuZWVkIHRvIGxvb2sgdGhyb3VnaC4gVGhpcyBzaG91bGQgY292ZXIgYWxsIHRoZSBjYXNlcyB3ZSBzdXBwb3J0LCBidXRcbiAgICAvLyB0aGUgc2VsZWN0b3IgY2FuIGJlIGV4cGFuZGVkIGlmIGl0IHR1cm5zIG91dCB0byBiZSB0b28gbmFycm93LlxuICAgIGNvbnN0IG1vZGFsID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsb3Nlc3QoXG4gICAgICAnYm9keSA+IC5jZGstb3ZlcmxheS1jb250YWluZXIgW2FyaWEtbW9kYWw9XCJ0cnVlXCJdJyxcbiAgICApO1xuXG4gICAgaWYgKCFtb2RhbCkge1xuICAgICAgLy8gTW9zdCBjb21tb25seSwgdGhlIGF1dG9jb21wbGV0ZSB0cmlnZ2VyIGlzIG5vdCBpbnNpZGUgYSBtb2RhbC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5lbElkID0gYCR7dGhpcy5pZH0tcGFuZWxgO1xuXG4gICAgaWYgKHRoaXMuX3RyYWNrZWRNb2RhbCkge1xuICAgICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB9XG5cbiAgICBhZGRBcmlhUmVmZXJlbmNlZElkKG1vZGFsLCAnYXJpYS1vd25zJywgcGFuZWxJZCk7XG4gICAgdGhpcy5fdHJhY2tlZE1vZGFsID0gbW9kYWw7XG4gIH1cblxuICAvKiogQ2xlYXJzIHRoZSByZWZlcmVuY2UgdG8gdGhlIGxpc3Rib3ggb3ZlcmxheSBlbGVtZW50IGZyb20gdGhlIG1vZGFsIGl0IHdhcyBhZGRlZCB0by4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJGcm9tTW9kYWwoKSB7XG4gICAgaWYgKCF0aGlzLl90cmFja2VkTW9kYWwpIHtcbiAgICAgIC8vIE1vc3QgY29tbW9ubHksIHRoZSBhdXRvY29tcGxldGUgdHJpZ2dlciBpcyBub3QgdXNlZCBpbnNpZGUgYSBtb2RhbC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYW5lbElkID0gYCR7dGhpcy5pZH0tcGFuZWxgO1xuXG4gICAgcmVtb3ZlQXJpYVJlZmVyZW5jZWRJZCh0aGlzLl90cmFja2VkTW9kYWwsICdhcmlhLW93bnMnLCBwYW5lbElkKTtcbiAgICB0aGlzLl90cmFja2VkTW9kYWwgPSBudWxsO1xuICB9XG5cbiAgLyoqIENsb3NlcyB0aGUgb3ZlcmxheSBwYW5lbCBhbmQgZm9jdXNlcyB0aGUgaG9zdCBlbGVtZW50LiAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGFuZWxPcGVuKSB7XG4gICAgICB0aGlzLl9wYW5lbE9wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9pc1J0bCgpID8gJ3J0bCcgOiAnbHRyJyk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgLy8gUmVxdWlyZWQgZm9yIHRoZSBNREMgZm9ybSBmaWVsZCB0byBwaWNrIHVwIHdoZW4gdGhlIG92ZXJsYXkgaGFzIGJlZW4gY2xvc2VkLlxuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3QncyB2YWx1ZS4gUGFydCBvZiB0aGUgQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXG4gICAqIHJlcXVpcmVkIHRvIGludGVncmF0ZSB3aXRoIEFuZ3VsYXIncyBjb3JlIGZvcm1zIEFQSS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIE5ldyB2YWx1ZSB0byBiZSB3cml0dGVuIHRvIHRoZSBtb2RlbC5cbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2lnblZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0J3MgdmFsdWVcbiAgICogY2hhbmdlcyBmcm9tIHVzZXIgaW5wdXQuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxuICAgKiByZXF1aXJlZCB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc2VsZWN0IGlzIGJsdXJyZWRcbiAgICogYnkgdGhlIHVzZXIuIFBhcnQgb2YgdGhlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZSByZXF1aXJlZFxuICAgKiB0byBpbnRlZ3JhdGUgd2l0aCBBbmd1bGFyJ3MgY29yZSBmb3JtcyBBUEkuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBDYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIHRvdWNoZWQuXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgc2VsZWN0LiBQYXJ0IG9mIHRoZSBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2UgcmVxdWlyZWRcbiAgICogdG8gaW50ZWdyYXRlIHdpdGggQW5ndWxhcidzIGNvcmUgZm9ybXMgQVBJLlxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBTZXRzIHdoZXRoZXIgdGhlIGNvbXBvbmVudCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIG9yIG5vdCB0aGUgb3ZlcmxheSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgcGFuZWxPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9wYW5lbE9wZW47XG4gIH1cblxuICAvKiogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBvcHRpb24uICovXG4gIGdldCBzZWxlY3RlZCgpOiBNYXRPcHRpb24gfCBNYXRPcHRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGUgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbD8uc2VsZWN0ZWQgfHwgW10gOiB0aGlzLl9zZWxlY3Rpb25Nb2RlbD8uc2VsZWN0ZWRbMF07XG4gIH1cblxuICAvKiogVGhlIHZhbHVlIGRpc3BsYXllZCBpbiB0aGUgdHJpZ2dlci4gKi9cbiAgZ2V0IHRyaWdnZXJWYWx1ZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmVtcHR5KSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX211bHRpcGxlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZC5tYXAob3B0aW9uID0+IG9wdGlvbi52aWV3VmFsdWUpO1xuXG4gICAgICBpZiAodGhpcy5faXNSdGwoKSkge1xuICAgICAgICBzZWxlY3RlZE9wdGlvbnMucmV2ZXJzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBUT0RPKGNyaXNiZXRvKTogZGVsaW1pdGVyIHNob3VsZCBiZSBjb25maWd1cmFibGUgZm9yIHByb3BlciBsb2NhbGl6YXRpb24uXG4gICAgICByZXR1cm4gc2VsZWN0ZWRPcHRpb25zLmpvaW4oJywgJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdGVkWzBdLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIC8qKiBSZWZyZXNoZXMgdGhlIGVycm9yIHN0YXRlIG9mIHRoZSBzZWxlY3QuICovXG4gIHVwZGF0ZUVycm9yU3RhdGUoKSB7XG4gICAgdGhpcy5fZXJyb3JTdGF0ZVRyYWNrZXIudXBkYXRlRXJyb3JTdGF0ZSgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgaW4gUlRMIG1vZGUuICovXG4gIF9pc1J0bCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgYWxsIGtleWRvd24gZXZlbnRzIG9uIHRoZSBzZWxlY3QuICovXG4gIF9oYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLnBhbmVsT3BlbiA/IHRoaXMuX2hhbmRsZU9wZW5LZXlkb3duKGV2ZW50KSA6IHRoaXMuX2hhbmRsZUNsb3NlZEtleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyB3aGlsZSB0aGUgc2VsZWN0IGlzIGNsb3NlZC4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlQ2xvc2VkS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgIGNvbnN0IGlzQXJyb3dLZXkgPVxuICAgICAga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fFxuICAgICAga2V5Q29kZSA9PT0gVVBfQVJST1cgfHxcbiAgICAgIGtleUNvZGUgPT09IExFRlRfQVJST1cgfHxcbiAgICAgIGtleUNvZGUgPT09IFJJR0hUX0FSUk9XO1xuICAgIGNvbnN0IGlzT3BlbktleSA9IGtleUNvZGUgPT09IEVOVEVSIHx8IGtleUNvZGUgPT09IFNQQUNFO1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgLy8gT3BlbiB0aGUgc2VsZWN0IG9uIEFMVCArIGFycm93IGtleSB0byBtYXRjaCB0aGUgbmF0aXZlIDxzZWxlY3Q+XG4gICAgaWYgKFxuICAgICAgKCFtYW5hZ2VyLmlzVHlwaW5nKCkgJiYgaXNPcGVuS2V5ICYmICFoYXNNb2RpZmllcktleShldmVudCkpIHx8XG4gICAgICAoKHRoaXMubXVsdGlwbGUgfHwgZXZlbnQuYWx0S2V5KSAmJiBpc0Fycm93S2V5KVxuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gcHJldmVudHMgdGhlIHBhZ2UgZnJvbSBzY3JvbGxpbmcgZG93biB3aGVuIHByZXNzaW5nIHNwYWNlXG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICBjb25zdCBwcmV2aW91c2x5U2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuICAgICAgbWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSB0aGlzLnNlbGVjdGVkO1xuXG4gICAgICAvLyBTaW5jZSB0aGUgdmFsdWUgaGFzIGNoYW5nZWQsIHdlIG5lZWQgdG8gYW5ub3VuY2UgaXQgb3Vyc2VsdmVzLlxuICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uICYmIHByZXZpb3VzbHlTZWxlY3RlZE9wdGlvbiAhPT0gc2VsZWN0ZWRPcHRpb24pIHtcbiAgICAgICAgLy8gV2Ugc2V0IGEgZHVyYXRpb24gb24gdGhlIGxpdmUgYW5ub3VuY2VtZW50LCBiZWNhdXNlIHdlIHdhbnQgdGhlIGxpdmUgZWxlbWVudCB0byBiZVxuICAgICAgICAvLyBjbGVhcmVkIGFmdGVyIGEgd2hpbGUgc28gdGhhdCB1c2VycyBjYW4ndCBuYXZpZ2F0ZSB0byBpdCB1c2luZyB0aGUgYXJyb3cga2V5cy5cbiAgICAgICAgdGhpcy5fbGl2ZUFubm91bmNlci5hbm5vdW5jZSgoc2VsZWN0ZWRPcHRpb24gYXMgTWF0T3B0aW9uKS52aWV3VmFsdWUsIDEwMDAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgd2hlbiB0aGUgc2VsZWN0ZWQgaXMgb3Blbi4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlT3BlbktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBtYW5hZ2VyID0gdGhpcy5fa2V5TWFuYWdlcjtcbiAgICBjb25zdCBrZXlDb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICBjb25zdCBpc0Fycm93S2V5ID0ga2V5Q29kZSA9PT0gRE9XTl9BUlJPVyB8fCBrZXlDb2RlID09PSBVUF9BUlJPVztcbiAgICBjb25zdCBpc1R5cGluZyA9IG1hbmFnZXIuaXNUeXBpbmcoKTtcblxuICAgIGlmIChpc0Fycm93S2V5ICYmIGV2ZW50LmFsdEtleSkge1xuICAgICAgLy8gQ2xvc2UgdGhlIHNlbGVjdCBvbiBBTFQgKyBhcnJvdyBrZXkgdG8gbWF0Y2ggdGhlIG5hdGl2ZSA8c2VsZWN0PlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGluIHRoaXMgY2FzZSBpZiB0aGUgdXNlciBpcyB0eXBpbmcsXG4gICAgICAvLyBiZWNhdXNlIHRoZSB0eXBpbmcgc2VxdWVuY2UgY2FuIGluY2x1ZGUgdGhlIHNwYWNlIGtleS5cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgIWlzVHlwaW5nICYmXG4gICAgICAoa2V5Q29kZSA9PT0gRU5URVIgfHwga2V5Q29kZSA9PT0gU1BBQ0UpICYmXG4gICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICFoYXNNb2RpZmllcktleShldmVudClcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgfSBlbHNlIGlmICghaXNUeXBpbmcgJiYgdGhpcy5fbXVsdGlwbGUgJiYga2V5Q29kZSA9PT0gQSAmJiBldmVudC5jdHJsS2V5KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3QgaGFzRGVzZWxlY3RlZE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMuc29tZShvcHQgPT4gIW9wdC5kaXNhYmxlZCAmJiAhb3B0LnNlbGVjdGVkKTtcblxuICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IHtcbiAgICAgICAgaWYgKCFvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgICAgICBoYXNEZXNlbGVjdGVkT3B0aW9ucyA/IG9wdGlvbi5zZWxlY3QoKSA6IG9wdGlvbi5kZXNlbGVjdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJldmlvdXNseUZvY3VzZWRJbmRleCA9IG1hbmFnZXIuYWN0aXZlSXRlbUluZGV4O1xuXG4gICAgICBtYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fbXVsdGlwbGUgJiZcbiAgICAgICAgaXNBcnJvd0tleSAmJlxuICAgICAgICBldmVudC5zaGlmdEtleSAmJlxuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0gJiZcbiAgICAgICAgbWFuYWdlci5hY3RpdmVJdGVtSW5kZXggIT09IHByZXZpb3VzbHlGb2N1c2VkSW5kZXhcbiAgICAgICkge1xuICAgICAgICBtYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uRm9jdXMoKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9mb2N1c2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIHRvdWNoZWQgY2FsbGJhY2sgb25seSBpZiB0aGUgcGFuZWwgaXMgY2xvc2VkLiBPdGhlcndpc2UsIHRoZSB0cmlnZ2VyIHdpbGxcbiAgICogXCJibHVyXCIgdG8gdGhlIHBhbmVsIHdoZW4gaXQgb3BlbnMsIGNhdXNpbmcgYSBmYWxzZSBwb3NpdGl2ZS5cbiAgICovXG4gIF9vbkJsdXIoKSB7XG4gICAgdGhpcy5fZm9jdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2tleU1hbmFnZXI/LmNhbmNlbFR5cGVhaGVhZCgpO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkICYmICF0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBpcyBpbnZva2VkIHdoZW4gdGhlIG92ZXJsYXkgcGFuZWwgaGFzIGJlZW4gYXR0YWNoZWQuXG4gICAqL1xuICBfb25BdHRhY2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9vdmVybGF5RGlyLnBvc2l0aW9uQ2hhbmdlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nU2V0dGxlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHRoZW1lIHRvIGJlIHVzZWQgb24gdGhlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxUaGVtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnRGb3JtRmllbGQgPyBgbWF0LSR7dGhpcy5fcGFyZW50Rm9ybUZpZWxkLmNvbG9yfWAgOiAnJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzZWxlY3QgaGFzIGEgdmFsdWUuICovXG4gIGdldCBlbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuX3NlbGVjdGlvbk1vZGVsIHx8IHRoaXMuX3NlbGVjdGlvbk1vZGVsLmlzRW1wdHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVTZWxlY3Rpb24oKTogdm9pZCB7XG4gICAgLy8gRGVmZXIgc2V0dGluZyB0aGUgdmFsdWUgaW4gb3JkZXIgdG8gYXZvaWQgdGhlIFwiRXhwcmVzc2lvblxuICAgIC8vIGhhcyBjaGFuZ2VkIGFmdGVyIGl0IHdhcyBjaGVja2VkXCIgZXJyb3JzIGZyb20gQW5ndWxhci5cbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLm5nQ29udHJvbCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHRoaXMubmdDb250cm9sLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zZXRTZWxlY3Rpb25CeVZhbHVlKHRoaXMuX3ZhbHVlKTtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzZWxlY3RlZCBvcHRpb24gYmFzZWQgb24gYSB2YWx1ZS4gSWYgbm8gb3B0aW9uIGNhbiBiZVxuICAgKiBmb3VuZCB3aXRoIHRoZSBkZXNpZ25hdGVkIHZhbHVlLCB0aGUgc2VsZWN0IHRyaWdnZXIgaXMgY2xlYXJlZC5cbiAgICovXG4gIHByaXZhdGUgX3NldFNlbGVjdGlvbkJ5VmFsdWUodmFsdWU6IGFueSB8IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2gob3B0aW9uID0+IG9wdGlvbi5zZXRJbmFjdGl2ZVN0eWxlcygpKTtcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgdmFsdWUpIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgICAgdGhyb3cgZ2V0TWF0U2VsZWN0Tm9uQXJyYXlWYWx1ZUVycm9yKCk7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRWYWx1ZTogYW55KSA9PiB0aGlzLl9zZWxlY3RPcHRpb25CeVZhbHVlKGN1cnJlbnRWYWx1ZSkpO1xuICAgICAgdGhpcy5fc29ydFZhbHVlcygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb3JyZXNwb25kaW5nT3B0aW9uID0gdGhpcy5fc2VsZWN0T3B0aW9uQnlWYWx1ZSh2YWx1ZSk7XG5cbiAgICAgIC8vIFNoaWZ0IGZvY3VzIHRvIHRoZSBhY3RpdmUgaXRlbS4gTm90ZSB0aGF0IHdlIHNob3VsZG4ndCBkbyB0aGlzIGluIG11bHRpcGxlXG4gICAgICAvLyBtb2RlLCBiZWNhdXNlIHdlIGRvbid0IGtub3cgd2hhdCBvcHRpb24gdGhlIHVzZXIgaW50ZXJhY3RlZCB3aXRoIGxhc3QuXG4gICAgICBpZiAoY29ycmVzcG9uZGluZ09wdGlvbikge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oY29ycmVzcG9uZGluZ09wdGlvbik7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnBhbmVsT3Blbikge1xuICAgICAgICAvLyBPdGhlcndpc2UgcmVzZXQgdGhlIGhpZ2hsaWdodGVkIG9wdGlvbi4gTm90ZSB0aGF0IHdlIG9ubHkgd2FudCB0byBkbyB0aGlzIHdoaWxlXG4gICAgICAgIC8vIGNsb3NlZCwgYmVjYXVzZSBkb2luZyBpdCB3aGlsZSBvcGVuIGNhbiBzaGlmdCB0aGUgdXNlcidzIGZvY3VzIHVubmVjZXNzYXJpbHkuXG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbSgtMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgYW5kIHNlbGVjdHMgYW5kIG9wdGlvbiBiYXNlZCBvbiBpdHMgdmFsdWUuXG4gICAqIEByZXR1cm5zIE9wdGlvbiB0aGF0IGhhcyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZS5cbiAgICovXG4gIHByaXZhdGUgX3NlbGVjdE9wdGlvbkJ5VmFsdWUodmFsdWU6IGFueSk6IE1hdE9wdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29ycmVzcG9uZGluZ09wdGlvbiA9IHRoaXMub3B0aW9ucy5maW5kKChvcHRpb246IE1hdE9wdGlvbikgPT4ge1xuICAgICAgLy8gU2tpcCBvcHRpb25zIHRoYXQgYXJlIGFscmVhZHkgaW4gdGhlIG1vZGVsLiBUaGlzIGFsbG93cyB1cyB0byBoYW5kbGUgY2FzZXNcbiAgICAgIC8vIHdoZXJlIHRoZSBzYW1lIHByaW1pdGl2ZSB2YWx1ZSBpcyBzZWxlY3RlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5pc1NlbGVjdGVkKG9wdGlvbikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcmVhdCBudWxsIGFzIGEgc3BlY2lhbCByZXNldCB2YWx1ZS5cbiAgICAgICAgcmV0dXJuIG9wdGlvbi52YWx1ZSAhPSBudWxsICYmIHRoaXMuX2NvbXBhcmVXaXRoKG9wdGlvbi52YWx1ZSwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICAgIC8vIE5vdGlmeSBkZXZlbG9wZXJzIG9mIGVycm9ycyBpbiB0aGVpciBjb21wYXJhdG9yLlxuICAgICAgICAgIGNvbnNvbGUud2FybihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdPcHRpb24pIHtcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChjb3JyZXNwb25kaW5nT3B0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ycmVzcG9uZGluZ09wdGlvbjtcbiAgfVxuXG4gIC8qKiBBc3NpZ25zIGEgc3BlY2lmaWMgdmFsdWUgdG8gdGhlIHNlbGVjdC4gUmV0dXJucyB3aGV0aGVyIHRoZSB2YWx1ZSBoYXMgY2hhbmdlZC4gKi9cbiAgcHJpdmF0ZSBfYXNzaWduVmFsdWUobmV3VmFsdWU6IGFueSB8IGFueVtdKTogYm9vbGVhbiB7XG4gICAgLy8gQWx3YXlzIHJlLWFzc2lnbiBhbiBhcnJheSwgYmVjYXVzZSBpdCBtaWdodCBoYXZlIGJlZW4gbXV0YXRlZC5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX3ZhbHVlIHx8ICh0aGlzLl9tdWx0aXBsZSAmJiBBcnJheS5pc0FycmF5KG5ld1ZhbHVlKSkpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fc2V0U2VsZWN0aW9uQnlWYWx1ZShuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gYHNraXBQcmVkaWNhdGVgIGRldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBvcHRpb24gaW4gdGhlIHRhYlxuICAvLyBvcmRlci4gQWxsb3cgZGlzYWJsZWQgbGlzdCBpdGVtcyB0byByZWNlaXZlIGZvY3VzIHZpYSBrZXlib2FyZCB0byBhbGlnbiB3aXRoIFdBSSBBUklBXG4gIC8vIHJlY29tbWVuZGF0aW9uLlxuICAvL1xuICAvLyBOb3JtYWxseSBXQUkgQVJJQSdzIGluc3RydWN0aW9ucyBhcmUgdG8gZXhjbHVkZSBkaXNhYmxlZCBpdGVtcyBmcm9tIHRoZSB0YWIgb3JkZXIsIGJ1dCBpdFxuICAvLyBtYWtlcyBhIGZldyBleGNlcHRpb25zIGZvciBjb21wb3VuZCB3aWRnZXRzLlxuICAvL1xuICAvLyBGcm9tIFtEZXZlbG9waW5nIGEgS2V5Ym9hcmQgSW50ZXJmYWNlXShcbiAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1dBSS9BUklBL2FwZy9wcmFjdGljZXMva2V5Ym9hcmQtaW50ZXJmYWNlLyk6XG4gIC8vICAgXCJGb3IgdGhlIGZvbGxvd2luZyBjb21wb3NpdGUgd2lkZ2V0IGVsZW1lbnRzLCBrZWVwIHRoZW0gZm9jdXNhYmxlIHdoZW4gZGlzYWJsZWQ6IE9wdGlvbnMgaW4gYVxuICAvLyAgIExpc3Rib3guLi5cIlxuICAvL1xuICAvLyBUaGUgdXNlciBjYW4gZm9jdXMgZGlzYWJsZWQgb3B0aW9ucyB1c2luZyB0aGUga2V5Ym9hcmQsIGJ1dCB0aGUgdXNlciBjYW5ub3QgY2xpY2sgZGlzYWJsZWRcbiAgLy8gb3B0aW9ucy5cbiAgcHJpdmF0ZSBfc2tpcFByZWRpY2F0ZSA9IChvcHRpb246IE1hdE9wdGlvbikgPT4ge1xuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgLy8gU3VwcG9ydCBrZXlib2FyZCBmb2N1c2luZyBkaXNhYmxlZCBvcHRpb25zIGluIGFuIEFSSUEgbGlzdGJveC5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBXaGVuIHRoZSBwYW5lbCBpcyBjbG9zZWQsIHNraXAgb3ZlciBkaXNhYmxlZCBvcHRpb25zLiBTdXBwb3J0IG9wdGlvbnMgdmlhIHRoZSBVUC9ET1dOIGFycm93XG4gICAgLy8ga2V5cyBvbiBhIGNsb3NlZCBzZWxlY3QuIEFSSUEgbGlzdGJveCBpbnRlcmFjdGlvbiBwYXR0ZXJuIGlzIGxlc3MgcmVsZXZhbnQgd2hlbiB0aGUgcGFuZWwgaXNcbiAgICAvLyBjbG9zZWQuXG4gICAgcmV0dXJuIG9wdGlvbi5kaXNhYmxlZDtcbiAgfTtcblxuICAvKiogR2V0cyBob3cgd2lkZSB0aGUgb3ZlcmxheSBwYW5lbCBzaG91bGQgYmUuICovXG4gIHByaXZhdGUgX2dldE92ZXJsYXlXaWR0aChcbiAgICBwcmVmZXJyZWRPcmlnaW46IEVsZW1lbnRSZWY8RWxlbWVudFJlZj4gfCBDZGtPdmVybGF5T3JpZ2luIHwgdW5kZWZpbmVkLFxuICApOiBzdHJpbmcgfCBudW1iZXIge1xuICAgIGlmICh0aGlzLnBhbmVsV2lkdGggPT09ICdhdXRvJykge1xuICAgICAgY29uc3QgcmVmVG9NZWFzdXJlID1cbiAgICAgICAgcHJlZmVycmVkT3JpZ2luIGluc3RhbmNlb2YgQ2RrT3ZlcmxheU9yaWdpblxuICAgICAgICAgID8gcHJlZmVycmVkT3JpZ2luLmVsZW1lbnRSZWZcbiAgICAgICAgICA6IHByZWZlcnJlZE9yaWdpbiB8fCB0aGlzLl9lbGVtZW50UmVmO1xuICAgICAgcmV0dXJuIHJlZlRvTWVhc3VyZS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhbmVsV2lkdGggPT09IG51bGwgPyAnJyA6IHRoaXMucGFuZWxXaWR0aDtcbiAgfVxuICAvKiogU3luY3MgdGhlIHBhcmVudCBzdGF0ZSB3aXRoIHRoZSBpbmRpdmlkdWFsIG9wdGlvbnMuICovXG4gIF9zeW5jUGFyZW50UHJvcGVydGllcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9uLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB1cCBhIGtleSBtYW5hZ2VyIHRvIGxpc3RlbiB0byBrZXlib2FyZCBldmVudHMgb24gdGhlIG92ZXJsYXkgcGFuZWwuICovXG4gIHByaXZhdGUgX2luaXRLZXlNYW5hZ2VyKCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpXG4gICAgICAud2l0aFR5cGVBaGVhZCh0aGlzLnR5cGVhaGVhZERlYm91bmNlSW50ZXJ2YWwpXG4gICAgICAud2l0aFZlcnRpY2FsT3JpZW50YXRpb24oKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5faXNSdGwoKSA/ICdydGwnIDogJ2x0cicpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLndpdGhQYWdlVXBEb3duKClcbiAgICAgIC53aXRoQWxsb3dlZE1vZGlmaWVyS2V5cyhbJ3NoaWZ0S2V5J10pXG4gICAgICAuc2tpcFByZWRpY2F0ZSh0aGlzLl9za2lwUHJlZGljYXRlKTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIudGFiT3V0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgLy8gU2VsZWN0IHRoZSBhY3RpdmUgaXRlbSB3aGVuIHRhYmJpbmcgYXdheS4gVGhpcyBpcyBjb25zaXN0ZW50IHdpdGggaG93IHRoZSBuYXRpdmVcbiAgICAgICAgLy8gc2VsZWN0IGJlaGF2ZXMuIE5vdGUgdGhhdCB3ZSBvbmx5IHdhbnQgdG8gZG8gdGhpcyBpbiBzaW5nbGUgc2VsZWN0aW9uIG1vZGUuXG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uX3NlbGVjdFZpYUludGVyYWN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXN0b3JlIGZvY3VzIHRvIHRoZSB0cmlnZ2VyIGJlZm9yZSBjbG9zaW5nLiBFbnN1cmVzIHRoYXQgdGhlIGZvY3VzXG4gICAgICAgIC8vIHBvc2l0aW9uIHdvbid0IGJlIGxvc3QgaWYgdGhlIHVzZXIgZ290IGZvY3VzIGludG8gdGhlIG92ZXJsYXkuXG4gICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9wYW5lbE9wZW4gJiYgdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLl9zY3JvbGxPcHRpb25JbnRvVmlldyh0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCB8fCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BhbmVsT3BlbiAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtLl9zZWxlY3RWaWFJbnRlcmFjdGlvbigpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIERyb3BzIGN1cnJlbnQgb3B0aW9uIHN1YnNjcmlwdGlvbnMgYW5kIElEcyBhbmQgcmVzZXRzIGZyb20gc2NyYXRjaC4gKi9cbiAgcHJpdmF0ZSBfcmVzZXRPcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWRPckRlc3Ryb3llZCA9IG1lcmdlKHRoaXMub3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95KTtcblxuICAgIHRoaXMub3B0aW9uU2VsZWN0aW9uQ2hhbmdlcy5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgdGhpcy5fb25TZWxlY3QoZXZlbnQuc291cmNlLCBldmVudC5pc1VzZXJJbnB1dCk7XG5cbiAgICAgIGlmIChldmVudC5pc1VzZXJJbnB1dCAmJiAhdGhpcy5tdWx0aXBsZSAmJiB0aGlzLl9wYW5lbE9wZW4pIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB0aGlzLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIG9wdGlvbnMgYW5kIHJlYWN0IGFjY29yZGluZ2x5LlxuICAgIC8vIEhhbmRsZXMgY2FzZXMgbGlrZSB0aGUgbGFiZWxzIG9mIHRoZSBzZWxlY3RlZCBvcHRpb25zIGNoYW5naW5nLlxuICAgIG1lcmdlKC4uLnRoaXMub3B0aW9ucy5tYXAob3B0aW9uID0+IG9wdGlvbi5fc3RhdGVDaGFuZ2VzKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbChjaGFuZ2VkT3JEZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIGBfc3RhdGVDaGFuZ2VzYCBjYW4gZmlyZSBhcyBhIHJlc3VsdCBvZiBhIGNoYW5nZSBpbiB0aGUgbGFiZWwncyBET00gdmFsdWUgd2hpY2ggbWF5XG4gICAgICAgIC8vIGJlIHRoZSByZXN1bHQgb2YgYW4gZXhwcmVzc2lvbiBjaGFuZ2luZy4gV2UgaGF2ZSB0byB1c2UgYGRldGVjdENoYW5nZXNgIGluIG9yZGVyXG4gICAgICAgIC8vIHRvIGF2b2lkIFwiY2hhbmdlZCBhZnRlciBjaGVja2VkXCIgZXJyb3JzIChzZWUgIzE0NzkzKS5cbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB0aGlzLnN0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBJbnZva2VkIHdoZW4gYW4gb3B0aW9uIGlzIGNsaWNrZWQuICovXG4gIHByaXZhdGUgX29uU2VsZWN0KG9wdGlvbjogTWF0T3B0aW9uLCBpc1VzZXJJbnB1dDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pO1xuXG4gICAgaWYgKG9wdGlvbi52YWx1ZSA9PSBudWxsICYmICF0aGlzLl9tdWx0aXBsZSkge1xuICAgICAgb3B0aW9uLmRlc2VsZWN0KCk7XG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xuXG4gICAgICBpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Byb3BhZ2F0ZUNoYW5nZXMob3B0aW9uLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdhc1NlbGVjdGVkICE9PSBvcHRpb24uc2VsZWN0ZWQpIHtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkXG4gICAgICAgICAgPyB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3Qob3B0aW9uKVxuICAgICAgICAgIDogdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3Qob3B0aW9uKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbShvcHRpb24pO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICB0aGlzLl9zb3J0VmFsdWVzKCk7XG5cbiAgICAgICAgaWYgKGlzVXNlcklucHV0KSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgdXNlciBzZWxlY3RlZCB0aGUgb3B0aW9uIHdpdGggdGhlaXIgbW91c2UsIHdlXG4gICAgICAgICAgLy8gd2FudCB0byByZXN0b3JlIGZvY3VzIGJhY2sgdG8gdGhlIHRyaWdnZXIsIGluIG9yZGVyIHRvXG4gICAgICAgICAgLy8gcHJldmVudCB0aGUgc2VsZWN0IGtleWJvYXJkIGNvbnRyb2xzIGZyb20gY2xhc2hpbmcgd2l0aFxuICAgICAgICAgIC8vIHRoZSBvbmVzIGZyb20gYG1hdC1vcHRpb25gLlxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3YXNTZWxlY3RlZCAhPT0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuaXNTZWxlY3RlZChvcHRpb24pKSB7XG4gICAgICB0aGlzLl9wcm9wYWdhdGVDaGFuZ2VzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICB9XG5cbiAgLyoqIFNvcnRzIHRoZSBzZWxlY3RlZCB2YWx1ZXMgaW4gdGhlIHNlbGVjdGVkIGJhc2VkIG9uIHRoZWlyIG9yZGVyIGluIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc29ydFZhbHVlcygpIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy50b0FycmF5KCk7XG5cbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc29ydENvbXBhcmF0b3JcbiAgICAgICAgICA/IHRoaXMuc29ydENvbXBhcmF0b3IoYSwgYiwgb3B0aW9ucylcbiAgICAgICAgICA6IG9wdGlvbnMuaW5kZXhPZihhKSAtIG9wdGlvbnMuaW5kZXhPZihiKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFbWl0cyBjaGFuZ2UgZXZlbnQgdG8gc2V0IHRoZSBtb2RlbCB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBfcHJvcGFnYXRlQ2hhbmdlcyhmYWxsYmFja1ZhbHVlPzogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbHVlVG9FbWl0OiBhbnk7XG5cbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgdmFsdWVUb0VtaXQgPSAodGhpcy5zZWxlY3RlZCBhcyBNYXRPcHRpb25bXSkubWFwKG9wdGlvbiA9PiBvcHRpb24udmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZVRvRW1pdCA9IHRoaXMuc2VsZWN0ZWQgPyAodGhpcy5zZWxlY3RlZCBhcyBNYXRPcHRpb24pLnZhbHVlIDogZmFsbGJhY2tWYWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlVG9FbWl0O1xuICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdCh2YWx1ZVRvRW1pdCk7XG4gICAgdGhpcy5fb25DaGFuZ2UodmFsdWVUb0VtaXQpO1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlLmVtaXQodGhpcy5fZ2V0Q2hhbmdlRXZlbnQodmFsdWVUb0VtaXQpKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWdobGlnaHRzIHRoZSBzZWxlY3RlZCBpdGVtLiBJZiBubyBvcHRpb24gaXMgc2VsZWN0ZWQsIGl0IHdpbGwgaGlnaGxpZ2h0XG4gICAqIHRoZSBmaXJzdCAqZW5hYmxlZCogb3B0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfaGlnaGxpZ2h0Q29ycmVjdE9wdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgaWYgKHRoaXMuZW1wdHkpIHtcbiAgICAgICAgLy8gRmluZCB0aGUgaW5kZXggb2YgdGhlIGZpcnN0ICplbmFibGVkKiBvcHRpb24uIEF2b2lkIGNhbGxpbmcgYF9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW1gXG4gICAgICAgIC8vIGJlY2F1c2UgaXQgYWN0aXZhdGVzIHRoZSBmaXJzdCBvcHRpb24gdGhhdCBwYXNzZXMgdGhlIHNraXAgcHJlZGljYXRlLCByYXRoZXIgdGhhbiB0aGVcbiAgICAgICAgLy8gZmlyc3QgKmVuYWJsZWQqIG9wdGlvbi5cbiAgICAgICAgbGV0IGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4ID0gLTE7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLm9wdGlvbnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5vcHRpb25zLmdldChpbmRleCkhO1xuICAgICAgICAgIGlmICghb3B0aW9uLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBmaXJzdEVuYWJsZWRPcHRpb25JbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKGZpcnN0RW5hYmxlZE9wdGlvbkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zZWxlY3RlZFswXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGFsbG93ZWQgdG8gb3Blbi4gKi9cbiAgcHJvdGVjdGVkIF9jYW5PcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fcGFuZWxPcGVuICYmICF0aGlzLmRpc2FibGVkICYmIHRoaXMub3B0aW9ucz8ubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzZWxlY3QgZWxlbWVudC4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBzZWxlY3QgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxJZCA9IHRoaXMuX3BhcmVudEZvcm1GaWVsZD8uZ2V0TGFiZWxJZCgpO1xuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHRoZSBgYXJpYS1hY3RpdmVkZXNjZW5kYW50YCB0byBiZSBzZXQgb24gdGhlIGhvc3QuICovXG4gIF9nZXRBcmlhQWN0aXZlRGVzY2VuZGFudCgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5wYW5lbE9wZW4gJiYgdGhpcy5fa2V5TWFuYWdlciAmJiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0uaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IG9mIHRoZSBzZWxlY3QgY29tcG9uZW50IHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2dldFRyaWdnZXJBcmlhTGFiZWxsZWRieSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsSWQgPSB0aGlzLl9wYXJlbnRGb3JtRmllbGQ/LmdldExhYmVsSWQoKTtcbiAgICBsZXQgdmFsdWUgPSAobGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJykgKyB0aGlzLl92YWx1ZUlkO1xuXG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsbGVkYnkpIHtcbiAgICAgIHZhbHVlICs9ICcgJyArIHRoaXMuYXJpYUxhYmVsbGVkYnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSBvdmVybGF5IHBhbmVsIGlzIGRvbmUgYW5pbWF0aW5nLiAqL1xuICBwcm90ZWN0ZWQgX3BhbmVsRG9uZUFuaW1hdGluZyhpc09wZW46IGJvb2xlYW4pIHtcbiAgICB0aGlzLm9wZW5lZENoYW5nZS5lbWl0KGlzT3Blbik7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBNYXRGb3JtRmllbGRDb250cm9sLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBzZXREZXNjcmliZWRCeUlkcyhpZHM6IHN0cmluZ1tdKSB7XG4gICAgaWYgKGlkcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBpZHMuam9pbignICcpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIE1hdEZvcm1GaWVsZENvbnRyb2wuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIG9uQ29udGFpbmVyQ2xpY2soKSB7XG4gICAgdGhpcy5mb2N1cygpO1xuICAgIHRoaXMub3BlbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgTWF0Rm9ybUZpZWxkQ29udHJvbC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHNob3VsZExhYmVsRmxvYXQoKTogYm9vbGVhbiB7XG4gICAgLy8gU2luY2UgdGhlIHBhbmVsIGRvZXNuJ3Qgb3ZlcmxhcCB0aGUgdHJpZ2dlciwgd2VcbiAgICAvLyB3YW50IHRoZSBsYWJlbCB0byBvbmx5IGZsb2F0IHdoZW4gdGhlcmUncyBhIHZhbHVlLlxuICAgIHJldHVybiB0aGlzLnBhbmVsT3BlbiB8fCAhdGhpcy5lbXB0eSB8fCAodGhpcy5mb2N1c2VkICYmICEhdGhpcy5wbGFjZWhvbGRlcik7XG4gIH1cbn1cblxuLyoqXG4gKiBBbGxvd3MgdGhlIHVzZXIgdG8gY3VzdG9taXplIHRoZSB0cmlnZ2VyIHRoYXQgaXMgZGlzcGxheWVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYSB2YWx1ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXNlbGVjdC10cmlnZ2VyJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9TRUxFQ1RfVFJJR0dFUiwgdXNlRXhpc3Rpbmc6IE1hdFNlbGVjdFRyaWdnZXJ9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U2VsZWN0VHJpZ2dlciB7fVxuIiwiPGRpdiBjZGstb3ZlcmxheS1vcmlnaW5cbiAgICAgY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC10cmlnZ2VyXCJcbiAgICAgKGNsaWNrKT1cIm9wZW4oKVwiXG4gICAgICNmYWxsYmFja092ZXJsYXlPcmlnaW49XCJjZGtPdmVybGF5T3JpZ2luXCJcbiAgICAgI3RyaWdnZXI+XG5cbiAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LXZhbHVlXCIgW2F0dHIuaWRdPVwiX3ZhbHVlSWRcIj5cbiAgICBAaWYgKGVtcHR5KSB7XG4gICAgICA8c3BhbiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LXBsYWNlaG9sZGVyIG1hdC1tZGMtc2VsZWN0LW1pbi1saW5lXCI+e3twbGFjZWhvbGRlcn19PC9zcGFuPlxuICAgIH0gQGVsc2Uge1xuICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC12YWx1ZS10ZXh0XCI+XG4gICAgICAgIEBpZiAoY3VzdG9tVHJpZ2dlcikge1xuICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1zZWxlY3QtdHJpZ2dlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgfSBAZWxzZSB7XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC1taW4tbGluZVwiPnt7dHJpZ2dlclZhbHVlfX08L3NwYW4+XG4gICAgICAgIH1cbiAgICAgIDwvc3Bhbj5cbiAgICB9XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJtYXQtbWRjLXNlbGVjdC1hcnJvdy13cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1tZGMtc2VsZWN0LWFycm93XCI+XG4gICAgICA8IS0tIFVzZSBhbiBpbmxpbmUgU1ZHLCBiZWNhdXNlIGl0IHdvcmtzIGJldHRlciB0aGFuIGEgQ1NTIHRyaWFuZ2xlIGluIGhpZ2ggY29udHJhc3QgbW9kZS4gLS0+XG4gICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0cHhcIiBoZWlnaHQ9XCIyNHB4XCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHBhdGggZD1cIk03IDEwbDUgNSA1LTV6XCIvPlxuICAgICAgPC9zdmc+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZVxuICBjZGstY29ubmVjdGVkLW92ZXJsYXlcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUxvY2tQb3NpdGlvblxuICBjZGtDb25uZWN0ZWRPdmVybGF5SGFzQmFja2Ryb3BcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUJhY2tkcm9wQ2xhc3M9XCJjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcFwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5UGFuZWxDbGFzc109XCJfb3ZlcmxheVBhbmVsQ2xhc3NcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVNjcm9sbFN0cmF0ZWd5XT1cIl9zY3JvbGxTdHJhdGVneVwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3JpZ2luXT1cIl9wcmVmZXJyZWRPdmVybGF5T3JpZ2luIHx8IGZhbGxiYWNrT3ZlcmxheU9yaWdpblwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJwYW5lbE9wZW5cIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uc109XCJfcG9zaXRpb25zXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlXaWR0aF09XCJfb3ZlcmxheVdpZHRoXCJcbiAgKGJhY2tkcm9wQ2xpY2spPVwiY2xvc2UoKVwiXG4gIChhdHRhY2gpPVwiX29uQXR0YWNoZWQoKVwiXG4gIChkZXRhY2gpPVwiY2xvc2UoKVwiPlxuICA8ZGl2XG4gICAgI3BhbmVsXG4gICAgcm9sZT1cImxpc3Rib3hcIlxuICAgIHRhYmluZGV4PVwiLTFcIlxuICAgIGNsYXNzPVwibWF0LW1kYy1zZWxlY3QtcGFuZWwgbWRjLW1lbnUtc3VyZmFjZSBtZGMtbWVudS1zdXJmYWNlLS1vcGVuIHt7IF9nZXRQYW5lbFRoZW1lKCkgfX1cIlxuICAgIFthdHRyLmlkXT1cImlkICsgJy1wYW5lbCdcIlxuICAgIFthdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXT1cIm11bHRpcGxlXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoKVwiXG4gICAgW25nQ2xhc3NdPVwicGFuZWxDbGFzc1wiXG4gICAgW0B0cmFuc2Zvcm1QYW5lbF09XCInc2hvd2luZydcIlxuICAgIChAdHJhbnNmb3JtUGFuZWwuZG9uZSk9XCJfcGFuZWxEb25lQW5pbWF0aW5nU3RyZWFtLm5leHQoJGV2ZW50LnRvU3RhdGUpXCJcbiAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCI+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=