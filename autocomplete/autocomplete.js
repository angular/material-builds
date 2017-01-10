var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ContentChildren, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdOption } from '../core';
export var MdAutocomplete = (function () {
    function MdAutocomplete() {
    }
    __decorate([
        ViewChild(TemplateRef), 
        __metadata('design:type', TemplateRef)
    ], MdAutocomplete.prototype, "template", void 0);
    __decorate([
        ContentChildren(MdOption), 
        __metadata('design:type', QueryList)
    ], MdAutocomplete.prototype, "options", void 0);
    MdAutocomplete = __decorate([
        Component({selector: 'md-autocomplete, mat-autocomplete',
            template: "<template><div class=\"md-autocomplete-panel\"><ng-content></ng-content></div></template>",
            styles: [".md-autocomplete-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch}"],
            encapsulation: ViewEncapsulation.None,
            exportAs: 'mdAutocomplete'
        }), 
        __metadata('design:paramtypes', [])
    ], MdAutocomplete);
    return MdAutocomplete;
}());

//# sourceMappingURL=autocomplete.js.map
