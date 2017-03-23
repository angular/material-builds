var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MdLineModule, MdRippleModule, CompatibilityModule } from '../core';
import { MdList, MdListItem, MdListDivider, MdListAvatarCssMatStyler, MdListIconCssMatStyler, MdListCssMatStyler, MdNavListCssMatStyler, MdDividerCssMatStyler, MdListSubheaderCssMatStyler, MdNavListTokenSetter, } from './list';
var MdListModule = MdListModule_1 = (function () {
    function MdListModule() {
    }
    /** @deprecated */
    MdListModule.forRoot = function () {
        return {
            ngModule: MdListModule_1,
            providers: []
        };
    };
    return MdListModule;
}());
MdListModule = MdListModule_1 = __decorate([
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
    })
], MdListModule);
export { MdListModule };
export * from './list';
var MdListModule_1;
//# sourceMappingURL=index.js.map