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
import { MdLineModule, MdRippleModule, CompatibilityModule } from '../core';
import { MdList, MdListItem, MdListDivider, MdListAvatarCssMatStyler, MdListIconCssMatStyler, MdListCssMatStyler, MdNavListCssMatStyler, MdDividerCssMatStyler, MdListSubheaderCssMatStyler, MdNavListTokenSetter } from './list';
export var MdListModule = (function () {
    function MdListModule() {
    }
    /** @deprecated */
    MdListModule.forRoot = function () {
        return {
            ngModule: MdListModule,
            providers: []
        };
    };
    MdListModule = __decorate([
        NgModule({
            imports: [MdLineModule, MdRippleModule, CompatibilityModule],
            exports: [
                MdList,
                MdListItem,
                MdListDivider,
                MdListAvatarCssMatStyler,
                MdLineModule,
                CompatibilityModule,
                MdListIconCssMatStyler,
                MdListCssMatStyler,
                MdNavListCssMatStyler,
                MdDividerCssMatStyler,
                MdListSubheaderCssMatStyler,
                MdNavListTokenSetter,
            ],
            declarations: [
                MdList,
                MdListItem,
                MdListDivider,
                MdListAvatarCssMatStyler,
                MdListIconCssMatStyler,
                MdListCssMatStyler,
                MdNavListCssMatStyler,
                MdDividerCssMatStyler,
                MdListSubheaderCssMatStyler,
                MdNavListTokenSetter,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdListModule);
    return MdListModule;
}());
export * from './list';
//# sourceMappingURL=index.js.map