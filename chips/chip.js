var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
/**
 * A material design styled Chip component. Used inside the ChipList component.
 */
export var MdChip = (function () {
    function MdChip(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /* Whether or not the chip is disabled. */
        this._disabled = null;
        /**
         * Emitted when the chip is focused.
         */
        this.onFocus = new EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        this.destroy = new EventEmitter();
    }
    MdChip.prototype.ngOnInit = function () {
        var el = this._elementRef.nativeElement;
        if (el.nodeName.toLowerCase() == 'md-chip' || el.hasAttribute('md-chip')) {
            el.classList.add('md-chip');
        }
    };
    MdChip.prototype.ngOnDestroy = function () {
        this.destroy.emit({ chip: this });
    };
    Object.defineProperty(MdChip.prototype, "disabled", {
        /** Whether or not the chip is disabled. */
        get: function () {
            return this._disabled;
        },
        /** Sets the disabled state of the chip. */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "_isAriaDisabled", {
        /** A String representation of the current disabled state. */
        get: function () {
            return String(coerceBooleanProperty(this.disabled));
        },
        enumerable: true,
        configurable: true
    });
    /** Allows for programmatic focusing of the chip. */
    MdChip.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
        this.onFocus.emit({ chip: this });
    };
    /** Ensures events fire properly upon click. */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            this.focus();
        }
    };
    __decorate([
        Output(), 
        __metadata('design:type', Object)
    ], MdChip.prototype, "destroy", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdChip.prototype, "disabled", null);
    MdChip = __decorate([
        Component({
            selector: 'md-basic-chip, [md-basic-chip], md-chip, [md-chip]',
            template: "<ng-content></ng-content>",
            host: {
                'tabindex': '-1',
                'role': 'option',
                '[attr.disabled]': 'disabled',
                '[attr.aria-disabled]': '_isAriaDisabled',
                '(click)': '_handleClick($event)'
            }
        }), 
        __metadata('design:paramtypes', [Renderer, ElementRef])
    ], MdChip);
    return MdChip;
}());

//# sourceMappingURL=chip.js.map
