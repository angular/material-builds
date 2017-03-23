var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle } from './button-toggle';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER, CompatibilityModule, FocusOriginMonitor, } from '../core';
var MdButtonToggleModule = MdButtonToggleModule_1 = (function () {
    function MdButtonToggleModule() {
    }
    /** @deprecated */
    MdButtonToggleModule.forRoot = function () {
        return {
            ngModule: MdButtonToggleModule_1,
            providers: []
        };
    };
    return MdButtonToggleModule;
}());
MdButtonToggleModule = MdButtonToggleModule_1 = __decorate([
    NgModule({
        imports: [FormsModule, CompatibilityModule],
        exports: [
            MdButtonToggleGroup,
            MdButtonToggleGroupMultiple,
            MdButtonToggle,
            CompatibilityModule,
        ],
        declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
        providers: [UNIQUE_SELECTION_DISPATCHER_PROVIDER, FocusOriginMonitor]
    })
], MdButtonToggleModule);
export { MdButtonToggleModule };
export * from './button-toggle';
var MdButtonToggleModule_1;
//# sourceMappingURL=index.js.map