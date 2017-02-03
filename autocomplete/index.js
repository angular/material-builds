var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule } from '@angular/core';
import { MdOptionModule, OverlayModule, OVERLAY_PROVIDERS, CompatibilityModule } from '../core';
import { CommonModule } from '@angular/common';
import { MdAutocomplete } from './autocomplete';
import { MdAutocompleteTrigger } from './autocomplete-trigger';
export * from './autocomplete';
export * from './autocomplete-trigger';
export var MdAutocompleteModule = (function () {
    function MdAutocompleteModule() {
    }
    /** @deprecated */
    MdAutocompleteModule.forRoot = function () {
        return {
            ngModule: MdAutocompleteModule,
            providers: [OVERLAY_PROVIDERS]
        };
    };
    MdAutocompleteModule = __decorate([
        NgModule({
            imports: [MdOptionModule, OverlayModule, CompatibilityModule, CommonModule],
            exports: [MdAutocomplete, MdOptionModule, MdAutocompleteTrigger, CompatibilityModule],
            declarations: [MdAutocomplete, MdAutocompleteTrigger],
        }), 
        __metadata('design:paramtypes', [])
    ], MdAutocompleteModule);
    return MdAutocompleteModule;
}());
//# sourceMappingURL=index.js.map