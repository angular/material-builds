var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { MdChip } from './chip';
import { FocusKeyManager } from '../core/a11y/focus-key-manager';
import { coerceBooleanProperty } from '../core/coercion/boolean-property';
import { SPACE, LEFT_ARROW, RIGHT_ARROW } from '../core/keyboard/keycodes';
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
export var MdChipList = (function () {
    function MdChipList(_elementRef) {
        this._elementRef = _elementRef;
        /** Track which chips we're listening to for focus/destruction. */
        this._subscribed = new WeakMap();
        /** Whether or not the chip is selectable. */
        this._selectable = true;
    }
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new FocusKeyManager(this.chips).withWrap();
        // Go ahead and subscribe all of the initial chips
        this._subscribeChips(this.chips);
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this._subscribeChips(chips);
        });
    };
    Object.defineProperty(MdChipList.prototype, "selectable", {
        /**
         * Whether or not this chip is selectable. When a chip is not selectable,
         * it's selected state is always ignored.
         */
        get: function () {
            return this._selectable;
        },
        set: function (value) {
            this._selectable = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Programmatically focus the chip list. This in turn focuses the first
     * non-disabled chip in this chip list.
     */
    MdChipList.prototype.focus = function () {
        // TODO: ARIA says this should focus the first `selected` chip.
        this._keyManager.setFirstItemActive();
    };
    /** Passes relevant key presses to our key manager. */
    MdChipList.prototype._keydown = function (event) {
        var target = event.target;
        // If they are on a chip, check for space/left/right, otherwise pass to our key manager
        if (target && target.classList.contains('mat-chip')) {
            switch (event.keyCode) {
                case SPACE:
                    // If we are selectable, toggle the focused chip
                    if (this.selectable) {
                        this._toggleSelectOnFocusedChip();
                    }
                    // Always prevent space from scrolling the page since the list has focus
                    event.preventDefault();
                    break;
                case LEFT_ARROW:
                    this._keyManager.setPreviousItemActive();
                    event.preventDefault();
                    break;
                case RIGHT_ARROW:
                    this._keyManager.setNextItemActive();
                    event.preventDefault();
                    break;
                default:
                    this._keyManager.onKeydown(event);
            }
        }
    };
    /** Toggles the selected state of the currently focused chip. */
    MdChipList.prototype._toggleSelectOnFocusedChip = function () {
        // Allow disabling of chip selection
        if (!this.selectable) {
            return;
        }
        var focusedIndex = this._keyManager.activeItemIndex;
        if (this._isValidIndex(focusedIndex)) {
            var focusedChip = this.chips.toArray()[focusedIndex];
            if (focusedChip) {
                focusedChip.toggleSelected();
            }
        }
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param chips The list of chips to be subscribed.
     */
    MdChipList.prototype._subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this._addChip(chip); });
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param chip The chip to be subscribed (or checked for existing
     * subscription).
     */
    MdChipList.prototype._addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._subscribed.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip.onFocus.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                _this._keyManager.updateActiveItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and check focus
        chip.destroy.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this._isValidIndex(chipIndex)) {
                // Check whether the chip is the last item
                if (chipIndex < _this.chips.length - 1) {
                    _this._keyManager.setActiveItem(chipIndex);
                }
                else if (chipIndex - 1 >= 0) {
                    _this._keyManager.setActiveItem(chipIndex - 1);
                }
            }
            _this._subscribed.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._subscribed.set(chip, true);
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns True if the index is valid for our list of chips.
     */
    MdChipList.prototype._isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdChipList.prototype, "selectable", null);
    MdChipList = __decorate([
        Component({selector: 'md-chip-list, mat-chip-list',
            template: "<div class=\"md-chip-list-wrapper\"><ng-content></ng-content></div>",
            host: {
                // Properties
                'tabindex': '0',
                'role': 'listbox',
                '[class.mat-chip-list]': 'true',
                // Events
                '(focus)': 'focus()',
                '(keydown)': '_keydown($event)'
            },
            queries: {
                chips: new ContentChildren(MdChip)
            },
            styles: [".mat-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0 3px}.mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):first-child{margin-left:0;margin-right:3px}.mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):first-child{margin-left:3px;margin-right:0}[dir=rtl] .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-left:0;margin-right:3px}.mat-chip:not(.mat-basic-chip){display:inline-block;padding:8px 12px;border-radius:24px;font-size:13px;line-height:16px}.mat-chip-list-stacked .mat-chip-list-wrapper{display:block}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){display:block;margin:0 0 8px}[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip){margin:0 0 8px}.mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child,[dir=rtl] .mat-chip-list-stacked .mat-chip-list-wrapper .mat-chip:not(.mat-basic-chip):last-child{margin-bottom:0}"],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [ElementRef])
    ], MdChipList);
    return MdChipList;
}());
export var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    /** @deprecated */
    MdChipsModule.forRoot = function () {
        return {
            ngModule: MdChipsModule,
            providers: []
        };
    };
    MdChipsModule = __decorate([
        NgModule({
            imports: [],
            exports: [MdChipList, MdChip],
            declarations: [MdChipList, MdChip]
        }), 
        __metadata('design:paramtypes', [])
    ], MdChipsModule);
    return MdChipsModule;
}());
//# sourceMappingURL=chip-list.js.map