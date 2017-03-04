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
import { CompatibilityModule } from '../core';
import { MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle, MdCardActions, MdCardFooter, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardImage, MdCardXlImage, MdCardAvatar } from './card';
export var MdCardModule = (function () {
    function MdCardModule() {
    }
    /** @deprecated */
    MdCardModule.forRoot = function () {
        return {
            ngModule: MdCardModule,
            providers: []
        };
    };
    MdCardModule = __decorate([
        NgModule({
            imports: [CompatibilityModule],
            exports: [
                MdCard,
                MdCardHeader,
                MdCardTitleGroup,
                MdCardContent,
                MdCardTitle,
                MdCardSubtitle,
                MdCardActions,
                MdCardFooter,
                MdCardSmImage,
                MdCardMdImage,
                MdCardLgImage,
                MdCardImage,
                MdCardXlImage,
                MdCardAvatar,
                CompatibilityModule,
            ],
            declarations: [
                MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                MdCardActions, MdCardFooter, MdCardSmImage, MdCardMdImage, MdCardLgImage, MdCardImage,
                MdCardXlImage, MdCardAvatar,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardModule);
    return MdCardModule;
}());
export * from './card';
//# sourceMappingURL=index.js.map