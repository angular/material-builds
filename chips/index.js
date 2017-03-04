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
import { MdChipList } from './chip-list';
import { MdChip } from './chip';
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
export * from './chip-list';
export * from './chip';
//# sourceMappingURL=index.js.map