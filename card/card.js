var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, Component, ViewEncapsulation, ChangeDetectionStrategy, Directive } from '@angular/core';
import { CompatibilityModule } from '../core';
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
export var MdCardContent = (function () {
    function MdCardContent() {
    }
    MdCardContent = __decorate([
        Directive({
            selector: 'md-card-content, mat-card-content',
            host: {
                '[class.mat-card-content]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardContent);
    return MdCardContent;
}());
/**
 * Title of a card, needed as it's used as a selector in the API.
 */
export var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    MdCardTitle = __decorate([
        Directive({
            selector: 'md-card-title, mat-card-title',
            host: {
                '[class.mat-card-title]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitle);
    return MdCardTitle;
}());
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
export var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    MdCardSubtitle = __decorate([
        Directive({
            selector: 'md-card-subtitle, mat-card-subtitle',
            host: {
                '[class.mat-card-subtitle]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardSubtitle);
    return MdCardSubtitle;
}());
/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
export var MdCardActions = (function () {
    function MdCardActions() {
    }
    MdCardActions = __decorate([
        Directive({
            selector: 'md-card-actions, mat-card-actions',
            host: {
                '[class.mat-card-actions]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardActions);
    return MdCardActions;
}());
/**
 * Footer of a card, needed as it's used as a selector in the API.
 */
export var MdCardFooter = (function () {
    function MdCardFooter() {
    }
    MdCardFooter = __decorate([
        Directive({
            selector: 'md-card-footer, mat-card-footer',
            host: {
                '[class.mat-card-footer]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardFooter);
    return MdCardFooter;
}());
/**
 * Image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardSmImage = (function () {
    function MdCardSmImage() {
    }
    MdCardSmImage = __decorate([
        Directive({
            selector: '[md-card-sm-image], [mat-card-sm-image]',
            host: {
                '[class.mat-card-sm-image]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardSmImage);
    return MdCardSmImage;
}());
/**
 * Image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardMdImage = (function () {
    function MdCardMdImage() {
    }
    MdCardMdImage = __decorate([
        Directive({
            selector: '[md-card-md-image], [mat-card-md-image]',
            host: {
                '[class.mat-card-md-image]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardMdImage);
    return MdCardMdImage;
}());
/**
 * Image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardLgImage = (function () {
    function MdCardLgImage() {
    }
    MdCardLgImage = __decorate([
        Directive({
            selector: '[md-card-lg-image], [mat-card-lg-image]',
            host: {
                'class.mat-card-lg-image': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardLgImage);
    return MdCardLgImage;
}());
/**
 * Image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardImage = (function () {
    function MdCardImage() {
    }
    MdCardImage = __decorate([
        Directive({
            selector: '[md-card-image], [mat-card-image]',
            host: {
                '[class.mat-card-image]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardImage);
    return MdCardImage;
}());
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardXlImage = (function () {
    function MdCardXlImage() {
    }
    MdCardXlImage = __decorate([
        Directive({
            selector: 'md-card-xl-image, mat-card-xl-image',
            host: {
                '[class.mat-card-xl-image]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardXlImage);
    return MdCardXlImage;
}());
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 */
export var MdCardAvatar = (function () {
    function MdCardAvatar() {
    }
    MdCardAvatar = __decorate([
        Directive({
            selector: 'md-card-avatar, mat-card-avatar',
            host: {
                '[class.mat-card-avatar]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardAvatar);
    return MdCardAvatar;
}());
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - md-card-title
 * - md-card-subtitle
 * - md-card-content
 * - md-card-actions
 * - md-card-footer
 */
export var MdCard = (function () {
    function MdCard() {
    }
    MdCard = __decorate([
        Component({selector: 'md-card, mat-card',
            template: "<ng-content></ng-content>",
            styles: [".mat-card{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);will-change:box-shadow;display:block;position:relative;padding:24px;border-radius:2px;font-family:Roboto,\"Helvetica Neue\",sans-serif}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-title{font-size:24px;font-weight:400}.mat-card-content,.mat-card-header .mat-card-title,.mat-card-subtitle{font-size:14px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions[align=end]{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{position:absolute;width:100%;min-height:5px;bottom:0;left:0}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row;height:40px;margin:-8px 0 16px}.mat-card-header-text{height:40px;margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child,.mat-card>:last-child{margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child),.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            host: {
                '[class.mat-card]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCard);
    return MdCard;
}());
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 */
export var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    MdCardHeader = __decorate([
        Component({selector: 'md-card-header, mat-card-header',
            template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar]\"></ng-content><div class=\"mat-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content></ng-content>",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            host: {
                '[class.mat-card-header]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardHeader);
    return MdCardHeader;
}());
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 */
export var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    MdCardTitleGroup = __decorate([
        Component({selector: 'md-card-title-group, mat-card-title-group',
            template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
            host: {
                '[class.mat-card-title-group]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitleGroup);
    return MdCardTitleGroup;
}());
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
//# sourceMappingURL=card.js.map