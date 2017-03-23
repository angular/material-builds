var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { OverlayModule, PortalModule, A11yModule, CompatibilityModule, } from '../core';
import { MdDialog } from './dialog';
import { MdDialogContainer } from './dialog-container';
import { MdDialogClose, MdDialogContent, MdDialogTitle, MdDialogActions } from './dialog-content-directives';
var MdDialogModule = MdDialogModule_1 = (function () {
    function MdDialogModule() {
    }
    /** @deprecated */
    MdDialogModule.forRoot = function () {
        return {
            ngModule: MdDialogModule_1,
            providers: [],
        };
    };
    return MdDialogModule;
}());
MdDialogModule = MdDialogModule_1 = __decorate([
    NgModule({
        imports: [
            OverlayModule,
            PortalModule,
            A11yModule,
            CompatibilityModule,
        ],
        exports: [
            MdDialogContainer,
            MdDialogClose,
            MdDialogTitle,
            MdDialogContent,
            MdDialogActions,
            CompatibilityModule,
        ],
        declarations: [
            MdDialogContainer,
            MdDialogClose,
            MdDialogTitle,
            MdDialogActions,
            MdDialogContent,
        ],
        providers: [
            MdDialog,
        ],
        entryComponents: [MdDialogContainer],
    })
], MdDialogModule);
export { MdDialogModule };
export * from './dialog';
export * from './dialog-container';
export * from './dialog-content-directives';
export * from './dialog-config';
export * from './dialog-ref';
export { MD_DIALOG_DATA } from './dialog-injector';
var MdDialogModule_1;
//# sourceMappingURL=index.js.map