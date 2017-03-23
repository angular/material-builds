var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MdChipList } from './chip-list';
import { MdChip } from './chip';
var MdChipsModule = MdChipsModule_1 = (function () {
    function MdChipsModule() {
    }
    /** @deprecated */
    MdChipsModule.forRoot = function () {
        return {
            ngModule: MdChipsModule_1,
            providers: []
        };
    };
    return MdChipsModule;
}());
MdChipsModule = MdChipsModule_1 = __decorate([
    NgModule({
        imports: [],
        exports: [MdChipList, MdChip],
        declarations: [MdChipList, MdChip]
    })
], MdChipsModule);
export { MdChipsModule };
export * from './chip-list';
export * from './chip';
var MdChipsModule_1;
//# sourceMappingURL=index.js.map