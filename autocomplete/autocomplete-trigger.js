var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Directive, ElementRef, forwardRef, Host, Input, NgZone, Optional, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayState, TemplatePortal } from '../core';
import { MdAutocomplete } from './autocomplete';
import { Observable } from 'rxjs/Observable';
import { ActiveDescendantKeyManager } from '../core/a11y/activedescendant-key-manager';
import { ENTER, UP_ARROW, DOWN_ARROW } from '../core/keyboard/keycodes';
import { Dir } from '../core/rtl/dir';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { MdInputContainer } from '../input/input-container';
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the scrollTop of the panel. Because we are not
 * actually focusing the active item, scroll must be handled manually.
 */
/** The height of each autocomplete option. */
export var AUTOCOMPLETE_OPTION_HEIGHT = 48;
/** The total height of the autocomplete panel. */
export var AUTOCOMPLETE_PANEL_HEIGHT = 256;
/**
 * Provider that allows the autocomplete to register as a ControlValueAccessor.
 * @docs-private
 */
export var MD_AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MdAutocompleteTrigger; }),
    multi: true
};
export var MdAutocompleteTrigger = (function () {
    function MdAutocompleteTrigger(_element, _overlay, _viewContainerRef, _dir, _zone, _inputContainer) {
        this._element = _element;
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._dir = _dir;
        this._zone = _zone;
        this._inputContainer = _inputContainer;
        this._panelOpen = false;
        /** Stream of blur events that should close the panel. */
        this._blurStream = new Subject();
        /** View -> model callback called when value changes */
        this._onChange = function (value) { };
        /** View -> model callback called when autocomplete has been touched */
        this._onTouched = function () { };
    }
    Object.defineProperty(MdAutocompleteTrigger.prototype, "_matAutocomplete", {
        /** Property with mat- prefix for no-conflict mode. */
        get: function () {
            return this.autocomplete;
        },
        set: function (autocomplete) {
            this.autocomplete = autocomplete;
        },
        enumerable: true,
        configurable: true
    });
    MdAutocompleteTrigger.prototype.ngAfterContentInit = function () {
        this._keyManager = new ActiveDescendantKeyManager(this.autocomplete.options).withWrap();
    };
    MdAutocompleteTrigger.prototype.ngOnDestroy = function () {
        if (this._panelPositionSubscription) {
            this._panelPositionSubscription.unsubscribe();
        }
        this._destroyPanel();
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelOpen", {
        /* Whether or not the autocomplete panel is open. */
        get: function () {
            return this._panelOpen;
        },
        enumerable: true,
        configurable: true
    });
    /** Opens the autocomplete suggestion panel. */
    MdAutocompleteTrigger.prototype.openPanel = function () {
        if (!this._overlayRef) {
            this._createOverlay();
        }
        if (!this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._portal);
            this._subscribeToClosingActions();
        }
        this._panelOpen = true;
        this._floatPlaceholder('always');
    };
    /** Closes the autocomplete suggestion panel. */
    MdAutocompleteTrigger.prototype.closePanel = function () {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
        }
        this._panelOpen = false;
        this._floatPlaceholder('auto');
    };
    Object.defineProperty(MdAutocompleteTrigger.prototype, "panelClosingActions", {
        /**
         * A stream of actions that should close the autocomplete panel, including
         * when an option is selected, on blur, and when TAB is pressed.
         */
        get: function () {
            return Observable.merge.apply(Observable, this.optionSelections.concat([this._blurStream.asObservable(), this._keyManager.tabOut]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "optionSelections", {
        /** Stream of autocomplete option selections. */
        get: function () {
            return this.autocomplete.options.map(function (option) { return option.onSelect; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAutocompleteTrigger.prototype, "activeOption", {
        /** The currently active option, coerced to MdOption type. */
        get: function () {
            return this._keyManager.activeItem;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the autocomplete's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param value New value to be written to the model.
     */
    MdAutocompleteTrigger.prototype.writeValue = function (value) {
        var _this = this;
        Promise.resolve(null).then(function () { return _this._setTriggerValue(value); });
    };
    /**
     * Saves a callback function to be invoked when the autocomplete's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the value changes.
     */
    MdAutocompleteTrigger.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the autocomplete is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     *
     * @param fn Callback to be triggered when the component has been touched.
     */
    MdAutocompleteTrigger.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    MdAutocompleteTrigger.prototype._handleKeydown = function (event) {
        if (this.activeOption && event.keyCode === ENTER) {
            this.activeOption._selectViaInteraction();
        }
        else {
            this._keyManager.onKeydown(event);
            if (event.keyCode === UP_ARROW || event.keyCode === DOWN_ARROW) {
                this.openPanel();
                this._scrollToOption();
            }
        }
    };
    MdAutocompleteTrigger.prototype._handleInput = function (value) {
        this._onChange(value);
        this.openPanel();
    };
    MdAutocompleteTrigger.prototype._handleBlur = function (newlyFocusedTag) {
        this._onTouched();
        // Only emit blur event if the new focus is *not* on an option.
        if (newlyFocusedTag !== 'MD-OPTION') {
            this._blurStream.next(null);
        }
    };
    /**
     * In "auto" mode, the placeholder will animate down as soon as focus is lost.
     * This causes the value to jump when selecting an option with the mouse.
     * This method manually floats the placeholder until the panel can be closed.
     */
    MdAutocompleteTrigger.prototype._floatPlaceholder = function (state) {
        if (this._inputContainer) {
            this._inputContainer.floatPlaceholder = state;
        }
    };
    /**
     * Given that we are not actually focusing active options, we must manually adjust scroll
     * to reveal options below the fold. First, we find the offset of the option from the top
     * of the panel. The new scrollTop will be that offset - the panel height + the option
     * height, so the active option will be just visible at the bottom of the panel.
     */
    MdAutocompleteTrigger.prototype._scrollToOption = function () {
        var optionOffset = this._keyManager.activeItemIndex * AUTOCOMPLETE_OPTION_HEIGHT;
        var newScrollTop = Math.max(0, optionOffset - AUTOCOMPLETE_PANEL_HEIGHT + AUTOCOMPLETE_OPTION_HEIGHT);
        this.autocomplete._setScrollTop(newScrollTop);
    };
    /**
     * This method listens to a stream of panel closing actions and resets the
     * stream every time the option list changes.
     */
    MdAutocompleteTrigger.prototype._subscribeToClosingActions = function () {
        var _this = this;
        // When the zone is stable initially, and when the option list changes...
        Observable.merge(this._zone.onStable.first(), this.autocomplete.options.changes)
            .switchMap(function () {
            _this._resetPanel();
            return _this.panelClosingActions;
        })
            .first()
            .subscribe(function (event) { return _this._setValueAndClose(event); });
    };
    /** Destroys the autocomplete suggestion panel. */
    MdAutocompleteTrigger.prototype._destroyPanel = function () {
        if (this._overlayRef) {
            this.closePanel();
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    };
    MdAutocompleteTrigger.prototype._setTriggerValue = function (value) {
        this._element.nativeElement.value =
            this.autocomplete.displayWith ? this.autocomplete.displayWith(value) : value;
    };
    /**
    * This method closes the panel, and if a value is specified, also sets the associated
    * control to that value. It will also mark the control as dirty if this interaction
    * stemmed from the user.
    */
    MdAutocompleteTrigger.prototype._setValueAndClose = function (event) {
        if (event) {
            this._setTriggerValue(event.source.value);
            this._onChange(event.source.value);
        }
        this.closePanel();
    };
    MdAutocompleteTrigger.prototype._createOverlay = function () {
        this._portal = new TemplatePortal(this.autocomplete.template, this._viewContainerRef);
        this._overlayRef = this._overlay.create(this._getOverlayConfig());
    };
    MdAutocompleteTrigger.prototype._getOverlayConfig = function () {
        var overlayState = new OverlayState();
        overlayState.positionStrategy = this._getOverlayPosition();
        overlayState.width = this._getHostWidth();
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        return overlayState;
    };
    MdAutocompleteTrigger.prototype._getOverlayPosition = function () {
        this._positionStrategy = this._overlay.position().connectedTo(this._element, { originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' })
            .withFallbackPosition({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' });
        this._subscribeToPositionChanges(this._positionStrategy);
        return this._positionStrategy;
    };
    /**
     * This method subscribes to position changes in the autocomplete panel, so the panel's
     * y-offset can be adjusted to match the new position.
     */
    MdAutocompleteTrigger.prototype._subscribeToPositionChanges = function (strategy) {
        var _this = this;
        this._panelPositionSubscription = strategy.onPositionChange.subscribe(function (change) {
            _this.autocomplete.positionY = change.connectionPair.originY === 'top' ? 'above' : 'below';
        });
    };
    /** Returns the width of the input element, so the panel width can match it. */
    MdAutocompleteTrigger.prototype._getHostWidth = function () {
        return this._element.nativeElement.getBoundingClientRect().width;
    };
    /** Reset active item to null so arrow events will activate the correct options.*/
    MdAutocompleteTrigger.prototype._resetActiveItem = function () {
        this._keyManager.setActiveItem(null);
    };
    /**
     * Resets the active item and re-calculates alignment of the panel in case its size
     * has changed due to fewer or greater number of options.
     */
    MdAutocompleteTrigger.prototype._resetPanel = function () {
        this._resetActiveItem();
        this._positionStrategy.recalculateLastPosition();
        this.autocomplete._setVisibility();
    };
    __decorate([
        Input('mdAutocomplete'), 
        __metadata('design:type', MdAutocomplete)
    ], MdAutocompleteTrigger.prototype, "autocomplete", void 0);
    __decorate([
        Input('matAutocomplete'), 
        __metadata('design:type', MdAutocomplete)
    ], MdAutocompleteTrigger.prototype, "_matAutocomplete", null);
    MdAutocompleteTrigger = __decorate([
        Directive({
            selector: 'input[mdAutocomplete], input[matAutocomplete]',
            host: {
                'role': 'combobox',
                'autocomplete': 'off',
                'aria-autocomplete': 'list',
                'aria-multiline': 'false',
                '[attr.aria-activedescendant]': 'activeOption?.id',
                '[attr.aria-expanded]': 'panelOpen.toString()',
                '[attr.aria-owns]': 'autocomplete?.id',
                '(focus)': 'openPanel()',
                '(blur)': '_handleBlur($event.relatedTarget?.tagName)',
                '(input)': '_handleInput($event.target.value)',
                '(keydown)': '_handleKeydown($event)',
            },
            providers: [MD_AUTOCOMPLETE_VALUE_ACCESSOR]
        }),
        __param(3, Optional()),
        __param(5, Optional()),
        __param(5, Host()), 
        __metadata('design:paramtypes', [ElementRef, Overlay, ViewContainerRef, Dir, NgZone, MdInputContainer])
    ], MdAutocompleteTrigger);
    return MdAutocompleteTrigger;
}());
//# sourceMappingURL=autocomplete-trigger.js.map