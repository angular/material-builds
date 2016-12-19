var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, NgModule, ViewEncapsulation } from '@angular/core';
import { MdChip } from './chip';
import { ListKeyManager } from '../core/a11y/list-key-manager';
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
    }
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new ListKeyManager(this.chips).withFocusWrap();
        // Go ahead and subscribe all of the initial chips
        this.subscribeChips(this.chips);
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this.subscribeChips(chips);
        });
    };
    /** Pass relevant key presses to our key manager. */
    MdChipList.prototype.keydown = function (event) {
        this._keyManager.onKeydown(event);
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param chips The list of chips to be subscribed.
     */
    MdChipList.prototype.subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this.addChip(chip); });
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param chip The chip to be subscribed (or checked for existing
     * subscription).
     */
    MdChipList.prototype.addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._subscribed.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip.onFocus.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this.isValidIndex(chipIndex)) {
                _this._keyManager.updateFocusedItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and check focus
        chip.destroy.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this.isValidIndex(chipIndex)) {
                // Check whether the chip is the last item
                if (chipIndex < _this.chips.length - 1) {
                    _this._keyManager.setFocus(chipIndex);
                }
                else if (chipIndex - 1 >= 0) {
                    _this._keyManager.setFocus(chipIndex - 1);
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
     * @returns {boolean} True if the index is valid for our list of chips.
     */
    MdChipList.prototype.isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    MdChipList = __decorate([
        Component({selector: 'md-chip-list',
            template: "<div class=\"md-chip-list-wrapper\"><ng-content></ng-content></div>",
            host: {
                // Properties
                'tabindex': '0',
                'role': 'listbox',
                'class': 'md-chip-list',
                // Events
                '(focus)': '_keyManager.focusFirstItem()',
                '(keydown)': 'keydown($event)'
            },
            queries: {
                chips: new ContentChildren(MdChip)
            },
            styles: [".md-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.md-chip-list-wrapper .md-chip{margin:0 3px}.md-chip-list-wrapper .md-chip:first-child{margin-left:0;margin-right:3px}.md-chip-list-wrapper .md-chip:last-child,[dir=rtl] .md-chip-list-wrapper .md-chip:first-child{margin-left:3px;margin-right:0}[dir=rtl] .md-chip-list-wrapper .md-chip:last-child{margin-left:0;margin-right:3px}.md-chip{display:inline-block;padding:8px 12px;border-radius:24px;font-size:13px;line-height:16px}.md-chip-list-stacked .md-chip-list-wrapper{display:block}.md-chip-list-stacked .md-chip-list-wrapper .md-chip{display:block;margin:0 0 8px}[dir=rtl] .md-chip-list-stacked .md-chip-list-wrapper .md-chip{margin:0 0 8px}.md-chip-list-stacked .md-chip-list-wrapper .md-chip:last-child,[dir=rtl] .md-chip-list-stacked .md-chip-list-wrapper .md-chip:last-child{margin-bottom:0}"],
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
