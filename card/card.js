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
import { DefaultStyleCompatibilityModeModule } from '../core';
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
export var MdCardContent = (function () {
    function MdCardContent() {
    }
    MdCardContent = __decorate([
        Directive({
            selector: 'md-card-content, mat-card-content'
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
            selector: 'md-card-title, mat-card-title'
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
            selector: 'md-card-subtitle, mat-card-subtitle'
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
            selector: 'md-card-actions, mat-card-actions'
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
            selector: 'md-card-footer, mat-card-footer'
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardFooter);
    return MdCardFooter;
}());
/*

<md-card> is a basic content container component that adds the styles of a material design card.

While you can use this component alone,
it also provides a number of preset styles for common card sections, including:
 - md-card-title
 - md-card-subtitle
 - md-card-content
 - md-card-actions
 - md-card-footer

 You can see some examples of cards here:
 http://embed.plnkr.co/s5O4YcyvbLhIApSrIhtj/

 TODO(kara): update link to demo site when it exists

*/
export var MdCard = (function () {
    function MdCard() {
    }
    MdCard = __decorate([
        Component({selector: 'md-card, mat-card',
            template: "<ng-content></ng-content>",
            styles: ["md-card{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);will-change:box-shadow;display:block;position:relative;padding:24px;border-radius:2px;font-family:Roboto,\"Helvetica Neue\",sans-serif}@media screen and (-ms-high-contrast:active){md-card{outline:solid 1px}}.md-card-flat{box-shadow:none}md-card-actions,md-card-content,md-card-subtitle,md-card-title{display:block;margin-bottom:16px}md-card-title{font-size:24px;font-weight:400}md-card-content,md-card-header md-card-title,md-card-subtitle{font-size:14px}md-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}md-card-actions[align=end]{display:flex;justify-content:flex-end}[md-card-image]{width:calc(100% + 48px);margin:0 -24px 16px}[md-card-xl-image]{width:240px;height:240px;margin:-8px}md-card-footer{position:absolute;width:100%;min-height:5px;bottom:0;left:0}md-card-actions [md-button],md-card-actions [md-raised-button]{margin:0 4px}md-card-header{display:flex;flex-direction:row;height:40px;margin:-8px 0 16px}.md-card-header-text{height:40px;margin:0 8px}[md-card-avatar]{height:40px;width:40px;border-radius:50%}[md-card-lg-image],[md-card-md-image],[md-card-sm-image]{margin:-8px 0}md-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}[md-card-sm-image]{width:80px;height:80px}[md-card-md-image]{width:112px;height:112px}[md-card-lg-image]{width:152px;height:152px}@media (max-width:600px){md-card{padding:24px 16px}[md-card-image]{width:calc(100% + 32px);margin:16px -16px}md-card-title-group{margin:0}[md-card-xl-image]{margin-left:0;margin-right:0}md-card-header{margin:-8px 0 0}}md-card-content>:first-child,md-card>:first-child{margin-top:0}md-card-content>:last-child,md-card>:last-child{margin-bottom:0}[md-card-image]:first-child{margin-top:-24px}md-card>md-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}md-card-actions [md-button]:first-child,md-card-actions [md-raised-button]:first-child{margin-left:0;margin-right:0}md-card-subtitle:not(:first-child),md-card-title:not(:first-child){margin-top:-4px}md-card-header md-card-subtitle:not(:first-child),md-card>[md-card-xl-image]:first-child{margin-top:-8px}md-card>[md-card-xl-image]:last-child{margin-bottom:-8px}"],
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCard);
    return MdCard;
}());
/*  The following components don't have any behavior.
 They simply use content projection to wrap user content
 for flex layout purposes in <md-card> (and thus allow a cleaner, boilerplate-free API).


<md-card-header> is a component intended to be used within the <md-card> component.
It adds styles for a preset header section (i.e. a title, subtitle, and avatar layout).

You can see an example of a card with a header here:
http://embed.plnkr.co/tvJl19z3gZTQd6WmwkIa/

TODO(kara): update link to demo site when it exists
*/
export var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    MdCardHeader = __decorate([
        Component({selector: 'md-card-header, mat-card-header',
            template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar]\"></ng-content><div class=\"md-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content></ng-content>",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardHeader);
    return MdCardHeader;
}());
/*

<md-card-title-group> is a component intended to be used within the <md-card> component.
It adds styles for a preset layout that groups an image with a title section.

You can see an example of a card with a title-group section here:
http://embed.plnkr.co/EDfgCF9eKcXjini1WODm/

TODO(kara): update link to demo site when it exists
*/
export var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    MdCardTitleGroup = __decorate([
        Component({selector: 'md-card-title-group, mat-card-title-group',
            template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
            encapsulation: ViewEncapsulation.None,
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardTitleGroup);
    return MdCardTitleGroup;
}());
export var MdCardModule = (function () {
    function MdCardModule() {
    }
    MdCardModule.forRoot = function () {
        return {
            ngModule: MdCardModule,
            providers: []
        };
    };
    MdCardModule = __decorate([
        NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [
                MdCard,
                MdCardHeader,
                MdCardTitleGroup,
                MdCardContent,
                MdCardTitle,
                MdCardSubtitle,
                MdCardActions,
                MdCardFooter,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [
                MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                MdCardActions, MdCardFooter
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCardModule);
    return MdCardModule;
}());

//# sourceMappingURL=card.js.map
