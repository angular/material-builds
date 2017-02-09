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
import { MdRippleModule, RtlModule, ObserveContentModule, PortalModule, OverlayModule, A11yModule, ProjectionModule, CompatibilityModule } from './core/index';
import { MdButtonToggleModule } from './button-toggle/index';
import { MdButtonModule } from './button/index';
import { MdCheckboxModule } from './checkbox/index';
import { MdRadioModule } from './radio/index';
import { MdSelectModule } from './select/index';
import { MdSlideToggleModule } from './slide-toggle/index';
import { MdSliderModule } from './slider/index';
import { MdSidenavModule } from './sidenav/index';
import { MdListModule } from './list/index';
import { MdGridListModule } from './grid-list/index';
import { MdCardModule } from './card/index';
import { MdChipsModule } from './chips/index';
import { MdIconModule } from './icon/index';
import { MdProgressSpinnerModule } from './progress-spinner/index';
import { MdProgressBarModule } from './progress-bar/index';
import { MdInputModule } from './input/index';
import { MdSnackBarModule } from './snack-bar/index';
import { MdTabsModule } from './tabs/index';
import { MdToolbarModule } from './toolbar/index';
import { MdTooltipModule } from './tooltip/index';
import { MdMenuModule } from './menu/index';
import { MdDialogModule } from './dialog/index';
import { PlatformModule } from './core/platform/index';
import { MdAutocompleteModule } from './autocomplete/index';
import { StyleModule } from './core/style/index';
var MATERIAL_MODULES = [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdCheckboxModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    OverlayModule,
    PortalModule,
    RtlModule,
    StyleModule,
    A11yModule,
    PlatformModule,
    ProjectionModule,
    CompatibilityModule,
    ObserveContentModule
];
export var MaterialRootModule = (function () {
    function MaterialRootModule() {
    }
    MaterialRootModule = __decorate([
        NgModule({
            imports: [
                MdAutocompleteModule.forRoot(),
                MdButtonModule.forRoot(),
                MdCardModule.forRoot(),
                MdChipsModule.forRoot(),
                MdCheckboxModule.forRoot(),
                MdGridListModule.forRoot(),
                MdInputModule.forRoot(),
                MdListModule.forRoot(),
                MdProgressBarModule.forRoot(),
                MdProgressSpinnerModule.forRoot(),
                MdRippleModule.forRoot(),
                MdSelectModule.forRoot(),
                MdSidenavModule.forRoot(),
                MdTabsModule.forRoot(),
                MdToolbarModule.forRoot(),
                PortalModule.forRoot(),
                ProjectionModule.forRoot(),
                RtlModule.forRoot(),
                ObserveContentModule.forRoot(),
                // These modules include providers.
                A11yModule.forRoot(),
                MdButtonToggleModule.forRoot(),
                MdDialogModule.forRoot(),
                MdIconModule.forRoot(),
                MdMenuModule.forRoot(),
                MdRadioModule.forRoot(),
                MdSliderModule.forRoot(),
                MdSlideToggleModule.forRoot(),
                MdSnackBarModule.forRoot(),
                MdTooltipModule.forRoot(),
                PlatformModule.forRoot(),
                OverlayModule.forRoot(),
                CompatibilityModule.forRoot(),
            ],
            exports: MATERIAL_MODULES,
        }), 
        __metadata('design:paramtypes', [])
    ], MaterialRootModule);
    return MaterialRootModule;
}());
export var MaterialModule = (function () {
    function MaterialModule() {
    }
    /** @deprecated */
    MaterialModule.forRoot = function () {
        return { ngModule: MaterialRootModule };
    };
    MaterialModule = __decorate([
        NgModule({
            imports: MATERIAL_MODULES,
            exports: MATERIAL_MODULES,
        }), 
        __metadata('design:paramtypes', [])
    ], MaterialModule);
    return MaterialModule;
}());
//# sourceMappingURL=module.js.map