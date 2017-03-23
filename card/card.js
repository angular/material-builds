var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Directive } from '@angular/core';
/**
 * Content of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
var MdCardContent = (function () {
    function MdCardContent() {
    }
    return MdCardContent;
}());
MdCardContent = __decorate([
    Directive({
        selector: 'md-card-content, mat-card-content',
        host: {
            '[class.mat-card-content]': 'true'
        }
    })
], MdCardContent);
export { MdCardContent };
/**
 * Title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    return MdCardTitle;
}());
MdCardTitle = __decorate([
    Directive({
        selector: 'md-card-title, mat-card-title',
        host: {
            '[class.mat-card-title]': 'true'
        }
    })
], MdCardTitle);
export { MdCardTitle };
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    return MdCardSubtitle;
}());
MdCardSubtitle = __decorate([
    Directive({
        selector: 'md-card-subtitle, mat-card-subtitle',
        host: {
            '[class.mat-card-subtitle]': 'true'
        }
    })
], MdCardSubtitle);
export { MdCardSubtitle };
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
var MdCardActions = (function () {
    function MdCardActions() {
    }
    return MdCardActions;
}());
MdCardActions = __decorate([
    Directive({
        selector: 'md-card-actions, mat-card-actions',
        host: {
            '[class.mat-card-actions]': 'true'
        }
    })
], MdCardActions);
export { MdCardActions };
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
var MdCardFooter = (function () {
    function MdCardFooter() {
    }
    return MdCardFooter;
}());
MdCardFooter = __decorate([
    Directive({
        selector: 'md-card-footer, mat-card-footer',
        host: {
            '[class.mat-card-footer]': 'true'
        }
    })
], MdCardFooter);
export { MdCardFooter };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardSmImage = (function () {
    function MdCardSmImage() {
    }
    return MdCardSmImage;
}());
MdCardSmImage = __decorate([
    Directive({
        selector: '[md-card-sm-image], [mat-card-sm-image]',
        host: {
            '[class.mat-card-sm-image]': 'true'
        }
    })
], MdCardSmImage);
export { MdCardSmImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardMdImage = (function () {
    function MdCardMdImage() {
    }
    return MdCardMdImage;
}());
MdCardMdImage = __decorate([
    Directive({
        selector: '[md-card-md-image], [mat-card-md-image]',
        host: {
            '[class.mat-card-md-image]': 'true'
        }
    })
], MdCardMdImage);
export { MdCardMdImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardLgImage = (function () {
    function MdCardLgImage() {
    }
    return MdCardLgImage;
}());
MdCardLgImage = __decorate([
    Directive({
        selector: '[md-card-lg-image], [mat-card-lg-image]',
        host: {
            'class.mat-card-lg-image': 'true'
        }
    })
], MdCardLgImage);
export { MdCardLgImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardImage = (function () {
    function MdCardImage() {
    }
    return MdCardImage;
}());
MdCardImage = __decorate([
    Directive({
        selector: '[md-card-image], [mat-card-image]',
        host: {
            '[class.mat-card-image]': 'true'
        }
    })
], MdCardImage);
export { MdCardImage };
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardXlImage = (function () {
    function MdCardXlImage() {
    }
    return MdCardXlImage;
}());
MdCardXlImage = __decorate([
    Directive({
        selector: '[md-card-xl-image], [mat-card-xl-image]',
        host: {
            '[class.mat-card-xl-image]': 'true'
        }
    })
], MdCardXlImage);
export { MdCardXlImage };
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
var MdCardAvatar = (function () {
    function MdCardAvatar() {
    }
    return MdCardAvatar;
}());
MdCardAvatar = __decorate([
    Directive({
        selector: '[md-card-avatar], [mat-card-avatar]',
        host: {
            '[class.mat-card-avatar]': 'true'
        }
    })
], MdCardAvatar);
export { MdCardAvatar };
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
var MdCard = (function () {
    function MdCard() {
    }
    return MdCard;
}());
MdCard = __decorate([
    Component({selector: 'md-card, mat-card',
        template: "<ng-content></ng-content>",
        styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);will-change:box-shadow;display:block;position:relative;padding:24px;border-radius:2px;font-family:Roboto,\"Helvetica Neue\",sans-serif}.mat-card:not([class*=mat-elevation-z]){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.mat-card{outline:solid 1px}}.mat-card-flat{box-shadow:none}.mat-card-actions,.mat-card-content,.mat-card-subtitle,.mat-card-title{display:block;margin-bottom:16px}.mat-card-title{font-size:24px;font-weight:400}.mat-card-subtitle{font-size:14px}.mat-card-content{font-size:14px}.mat-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}.mat-card-actions[align=end]{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 48px);margin:0 -24px 16px -24px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-footer{position:absolute;width:100%;min-height:5px;bottom:0;left:0}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button{margin:0 4px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header-text{margin:0 8px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0}.mat-card-header .mat-card-title{font-size:14px}.mat-card-lg-image,.mat-card-md-image,.mat-card-sm-image{margin:-8px 0}.mat-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}@media (max-width:600px){.mat-card{padding:24px 16px}.mat-card-actions{margin-left:-8px;margin-right:-8px}.mat-card-image{width:calc(100% + 32px);margin:16px -16px}.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}.mat-card-header{margin:-8px 0 0 0}}.mat-card-content>:first-child,.mat-card>:first-child{margin-top:0}.mat-card-content>:last-child,.mat-card>:last-child{margin-bottom:0}.mat-card-image:first-child{margin-top:-24px}.mat-card>.mat-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child{margin-left:0;margin-right:0}.mat-card-subtitle:not(:first-child),.mat-card-title:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px} /*# sourceMappingURL=card.css.map */ "],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: {
            '[class.mat-card]': 'true'
        }
    })
], MdCard);
export { MdCard };
/**
 * Component intended to be used within the `<md-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * @docs-private
 */
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    return MdCardHeader;
}());
MdCardHeader = __decorate([
    Component({selector: 'md-card-header, mat-card-header',
        template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar]\"></ng-content><div class=\"mat-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content></ng-content>",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: {
            '[class.mat-card-header]': 'true'
        }
    })
], MdCardHeader);
export { MdCardHeader };
/**
 * Component intended to be used within the <md-card> component. It adds styles for a preset
 * layout that groups an image with a title section.
 * @docs-private
 */
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    return MdCardTitleGroup;
}());
MdCardTitleGroup = __decorate([
    Component({selector: 'md-card-title-group, mat-card-title-group',
        template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        host: {
            '[class.mat-card-title-group]': 'true'
        }
    })
], MdCardTitleGroup);
export { MdCardTitleGroup };
//# sourceMappingURL=card.js.map