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
import { FormsModule } from '@angular/forms';
import { MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle } from './button-toggle';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER, CompatibilityModule, FocusOriginMonitor } from '../core';
export var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    /** @deprecated */
    MdButtonToggleModule.forRoot = function () {
        return {
            ngModule: MdButtonToggleModule,
            providers: []
        };
    };
    MdButtonToggleModule = __decorate([
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
        }), 
        __metadata('design:paramtypes', [])
    ], MdButtonToggleModule);
    return MdButtonToggleModule;
}());
export * from './button-toggle';
//# sourceMappingURL=index.js.map