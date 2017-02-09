var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ContentChildren, ElementRef, Input, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdOption } from '../core';
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueAutocompleteIdCounter = 0;
export var MdAutocomplete = (function () {
    function MdAutocomplete() {
        /** Whether the autocomplete panel displays above or below its trigger. */
        this.positionY = 'below';
        /** Whether the autocomplete panel should be visible, depending on option length. */
        this.showPanel = false;
        /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
        this.id = "md-autocomplete-" + _uniqueAutocompleteIdCounter++;
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display
     * options below the fold, as they are not actually being focused when active.
     */
    MdAutocomplete.prototype._setScrollTop = function (scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    };
    /** Panel should hide itself when the option list is empty. */
    MdAutocomplete.prototype._setVisibility = function () {
        var _this = this;
        Promise.resolve().then(function () { return _this.showPanel = !!_this.options.length; });
    };
    /** Sets a class on the panel based on its position (used to set y-offset). */
    MdAutocomplete.prototype._getClassList = function () {
        return {
            'mat-autocomplete-panel-below': this.positionY === 'below',
            'mat-autocomplete-panel-above': this.positionY === 'above',
            'mat-autocomplete-visible': this.showPanel,
            'mat-autocomplete-hidden': !this.showPanel
        };
    };
    __decorate([
        ViewChild(TemplateRef), 
        __metadata('design:type', TemplateRef)
    ], MdAutocomplete.prototype, "template", void 0);
    __decorate([
        ViewChild('panel'), 
        __metadata('design:type', ElementRef)
    ], MdAutocomplete.prototype, "panel", void 0);
    __decorate([
        ContentChildren(MdOption), 
        __metadata('design:type', QueryList)
    ], MdAutocomplete.prototype, "options", void 0);
    __decorate([
        Input(), 
        __metadata('design:type', Function)
    ], MdAutocomplete.prototype, "displayWith", void 0);
    MdAutocomplete = __decorate([
        Component({selector: 'md-autocomplete, mat-autocomplete',
            template: "<template><div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_getClassList()\" #panel><ng-content></ng-content></div></template>",
            styles: [".mat-autocomplete-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-height:256px;position:relative}.mat-autocomplete-panel.mat-autocomplete-panel-below{top:6px}.mat-autocomplete-panel.mat-autocomplete-panel-above{top:-24px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}"],
            encapsulation: ViewEncapsulation.None,
            exportAs: 'mdAutocomplete',
            host: {
                '[class.mat-autocomplete]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdAutocomplete);
    return MdAutocomplete;
}());
//# sourceMappingURL=autocomplete.js.map