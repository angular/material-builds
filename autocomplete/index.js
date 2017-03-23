var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MdOptionModule, OverlayModule, OVERLAY_PROVIDERS, CompatibilityModule } from '../core';
import { CommonModule } from '@angular/common';
import { MdAutocomplete } from './autocomplete';
import { MdAutocompleteTrigger } from './autocomplete-trigger';
var MdAutocompleteModule = MdAutocompleteModule_1 = (function () {
    function MdAutocompleteModule() {
    }
    /** @deprecated */
    MdAutocompleteModule.forRoot = function () {
        return {
            ngModule: MdAutocompleteModule_1,
            providers: [OVERLAY_PROVIDERS]
        };
    };
    return MdAutocompleteModule;
}());
MdAutocompleteModule = MdAutocompleteModule_1 = __decorate([
    NgModule({
        imports: [MdOptionModule, OverlayModule, CompatibilityModule, CommonModule],
        exports: [MdAutocomplete, MdOptionModule, MdAutocompleteTrigger, CompatibilityModule],
        declarations: [MdAutocomplete, MdAutocompleteTrigger],
    })
], MdAutocompleteModule);
export { MdAutocompleteModule };
export * from './autocomplete';
export * from './autocomplete-trigger';
var MdAutocompleteModule_1;
//# sourceMappingURL=index.js.map