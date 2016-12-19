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
import { OverlayModule, PortalModule, OVERLAY_PROVIDERS, A11yModule, InteractivityChecker, MdPlatform, DefaultStyleCompatibilityModeModule } from '../core';
import { MdDialog } from './dialog';
import { MdDialogContainer } from './dialog-container';
import { MdDialogClose, MdDialogContent, MdDialogTitle, MdDialogActions } from './dialog-content-directives';
export var MdDialogModule = (function () {
    function MdDialogModule() {
    }
    MdDialogModule.forRoot = function () {
        return {
            ngModule: MdDialogModule,
            providers: [MdDialog, OVERLAY_PROVIDERS, InteractivityChecker, MdPlatform],
        };
    };
    MdDialogModule = __decorate([
        NgModule({
            imports: [
                OverlayModule,
                PortalModule,
                A11yModule,
                DefaultStyleCompatibilityModeModule
            ],
            exports: [
                MdDialogContainer,
                MdDialogClose,
                MdDialogTitle,
                MdDialogContent,
                MdDialogActions,
                DefaultStyleCompatibilityModeModule
            ],
            declarations: [
                MdDialogContainer,
                MdDialogClose,
                MdDialogTitle,
                MdDialogActions,
                MdDialogContent
            ],
            entryComponents: [MdDialogContainer],
        }), 
        __metadata('design:paramtypes', [])
    ], MdDialogModule);
    return MdDialogModule;
}());
export * from './dialog';
export * from './dialog-container';
export * from './dialog-content-directives';
export * from './dialog-config';
export * from './dialog-ref';

//# sourceMappingURL=index.js.map
