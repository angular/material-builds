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
import { DefaultStyleCompatibilityModeModule } from '../core';
import { MdAutocomplete } from './autocomplete';
export * from './autocomplete';
export var MdAutocompleteModule = (function () {
    function MdAutocompleteModule() {
    }
    MdAutocompleteModule.forRoot = function () {
        return {
            ngModule: MdAutocompleteModule,
            providers: []
        };
    };
    MdAutocompleteModule = __decorate([
        NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdAutocomplete, DefaultStyleCompatibilityModeModule],
            declarations: [MdAutocomplete],
        }), 
        __metadata('design:paramtypes', [])
    ], MdAutocompleteModule);
    return MdAutocompleteModule;
}());

//# sourceMappingURL=index.js.map
