/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Directive, Input, Optional, Inject, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
/**
 * Content of a card, needed as it's used as a selector in the API.
 * @docs-private
 * @deprecated Use `MatCardContent` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardContent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardContent, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardContent, selector: "mat-card-content, [mat-card-content], [matCardContent]", host: { classAttribute: "mat-card-content" }, ngImport: i0 }); }
}
export { MatLegacyCardContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-content, [mat-card-content], [matCardContent]',
                    host: { 'class': 'mat-card-content' },
                }]
        }] });
/**
 * Title of a card, needed as it's used as a selector in the API.
 * @docs-private
 * @deprecated Use `MatCardTitle` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardTitle, selector: "mat-card-title, [mat-card-title], [matCardTitle]", host: { classAttribute: "mat-card-title" }, ngImport: i0 }); }
}
export { MatLegacyCardTitle };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
                    host: {
                        'class': 'mat-card-title',
                    },
                }]
        }] });
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * @docs-private
 * @deprecated Use `MatCardSubtitle` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardSubtitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardSubtitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardSubtitle, selector: "mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]", host: { classAttribute: "mat-card-subtitle" }, ngImport: i0 }); }
}
export { MatLegacyCardSubtitle };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardSubtitle, decorators: [{
            type: Directive,
            args: [{
                    selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
                    host: {
                        'class': 'mat-card-subtitle',
                    },
                }]
        }] });
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * @docs-private
 * @deprecated Use `MatCardActions` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardActions {
    constructor() {
        /** Position of the actions inside the card. */
        this.align = 'start';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardActions, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardActions, selector: "mat-card-actions", inputs: { align: "align" }, host: { properties: { "class.mat-card-actions-align-end": "align === \"end\"" }, classAttribute: "mat-card-actions" }, exportAs: ["matCardActions"], ngImport: i0 }); }
}
export { MatLegacyCardActions };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardActions, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-actions',
                    exportAs: 'matCardActions',
                    host: {
                        'class': 'mat-card-actions',
                        '[class.mat-card-actions-align-end]': 'align === "end"',
                    },
                }]
        }], propDecorators: { align: [{
                type: Input
            }] } });
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * @docs-private
 * @deprecated Use `MatCardFooter` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardFooter {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardFooter, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardFooter, selector: "mat-card-footer", host: { classAttribute: "mat-card-footer" }, ngImport: i0 }); }
}
export { MatLegacyCardFooter };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardFooter, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-card-footer',
                    host: { 'class': 'mat-card-footer' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardImage` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardImage, selector: "[mat-card-image], [matCardImage]", host: { classAttribute: "mat-card-image" }, ngImport: i0 }); }
}
export { MatLegacyCardImage };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-image], [matCardImage]',
                    host: { 'class': 'mat-card-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardSmImage` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardSmImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardSmImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardSmImage, selector: "[mat-card-sm-image], [matCardImageSmall]", host: { classAttribute: "mat-card-sm-image" }, ngImport: i0 }); }
}
export { MatLegacyCardSmImage };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardSmImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-sm-image], [matCardImageSmall]',
                    host: { 'class': 'mat-card-sm-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardMdImage` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardMdImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardMdImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardMdImage, selector: "[mat-card-md-image], [matCardImageMedium]", host: { classAttribute: "mat-card-md-image" }, ngImport: i0 }); }
}
export { MatLegacyCardMdImage };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardMdImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-md-image], [matCardImageMedium]',
                    host: { 'class': 'mat-card-md-image' },
                }]
        }] });
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardLgImage` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardLgImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardLgImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardLgImage, selector: "[mat-card-lg-image], [matCardImageLarge]", host: { classAttribute: "mat-card-lg-image" }, ngImport: i0 }); }
}
export { MatLegacyCardLgImage };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardLgImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-lg-image], [matCardImageLarge]',
                    host: { 'class': 'mat-card-lg-image' },
                }]
        }] });
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardXlImage` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardXlImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardXlImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardXlImage, selector: "[mat-card-xl-image], [matCardImageXLarge]", host: { classAttribute: "mat-card-xl-image" }, ngImport: i0 }); }
}
export { MatLegacyCardXlImage };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardXlImage, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-xl-image], [matCardImageXLarge]',
                    host: { 'class': 'mat-card-xl-image' },
                }]
        }] });
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 * @deprecated Use `MatCardAvatar` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardAvatar {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardAvatar, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardAvatar, selector: "[mat-card-avatar], [matCardAvatar]", host: { classAttribute: "mat-card-avatar" }, ngImport: i0 }); }
}
export { MatLegacyCardAvatar };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-card-avatar], [matCardAvatar]',
                    host: { 'class': 'mat-card-avatar' },
                }]
        }] });
/**
 * A basic content container component that adds the styles of a Material design card.
 *
 * While this component can be used alone, it also provides a number
 * of preset styles for common card sections, including:
 * - mat-card-title
 * - mat-card-subtitle
 * - mat-card-content
 * - mat-card-actions
 * - mat-card-footer
 *
 * @deprecated Use `MatCard` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCard {
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    constructor(_animationMode) {
        this._animationMode = _animationMode;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCard, deps: [{ token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCard, selector: "mat-card", host: { properties: { "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"" }, classAttribute: "mat-card mat-focus-indicator" }, exportAs: ["matCard"], ngImport: i0, template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n", styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}.mat-card._mat-animation-noopable{transition:none !important;animation:none !important}.mat-card>.mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card>.mat-divider-horizontal{left:auto;right:0}.mat-card>.mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card>.mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyCard };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCard, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card', exportAs: 'matCard', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'class': 'mat-card mat-focus-indicator',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    }, template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n", styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}.mat-card._mat-animation-noopable{transition:none !important;animation:none !important}.mat-card>.mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card>.mat-divider-horizontal{left:auto;right:0}.mat-card>.mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card>.mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px;display:block;overflow:hidden}.mat-card-image img{width:100%}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * @docs-private
 * @deprecated Use `MatCardHeader` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardHeader {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardHeader, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardHeader, selector: "mat-card-header", host: { classAttribute: "mat-card-header" }, ngImport: i0, template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyCardHeader };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardHeader, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card-header', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'class': 'mat-card-header' }, template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n" }]
        }] });
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a preset
 * layout that groups an image with a title section.
 * @docs-private
 * @deprecated Use `MatCardTitleGroup` from `@angular/material/card` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyCardTitleGroup {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardTitleGroup, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyCardTitleGroup, selector: "mat-card-title-group", host: { classAttribute: "mat-card-title-group" }, ngImport: i0, template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyCardTitleGroup };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyCardTitleGroup, decorators: [{
            type: Component,
            args: [{ selector: 'mat-card-title-group', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: { 'class': 'mat-card-title-group' }, template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktY2FyZC9jYXJkLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jYXJkL2NhcmQuaHRtbCIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktY2FyZC9jYXJkLWhlYWRlci5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jYXJkL2NhcmQtdGl0bGUtZ3JvdXAuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsU0FBUyxFQUNULEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOztBQUUzRTs7Ozs7R0FLRztBQUNILE1BSWEsb0JBQW9COzhHQUFwQixvQkFBb0I7a0dBQXBCLG9CQUFvQjs7U0FBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdEQUF3RDtvQkFDbEUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDO2lCQUNwQzs7QUFHRDs7Ozs7R0FLRztBQUNILE1BTWEsa0JBQWtCOzhHQUFsQixrQkFBa0I7a0dBQWxCLGtCQUFrQjs7U0FBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBTjlCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtEQUFrRDtvQkFDNUQsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxnQkFBZ0I7cUJBQzFCO2lCQUNGOztBQUdEOzs7OztHQUtHO0FBQ0gsTUFNYSxxQkFBcUI7OEdBQXJCLHFCQUFxQjtrR0FBckIs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R0FGOUUsYUFBYSxrQkFFUSxxQkFBcUI7a0dBRjFDLGFBQWEsMk5DNUwxQixtRkFFQTs7U0QwTGEsYUFBYTsyRkFBYixhQUFhO2tCQVp6QixTQUFTOytCQUNFLFVBQVUsWUFDVixTQUFTLGlCQUdKLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU0sUUFDekM7d0JBQ0osT0FBTyxFQUFFLDhCQUE4Qjt3QkFDdkMsaUNBQWlDLEVBQUUscUNBQXFDO3FCQUN6RTs7MEJBSVksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7O0FBR3ZEOzs7Ozs7R0FNRztBQUNILE1BT2EsbUJBQW1COzhHQUFuQixtQkFBbUI7a0dBQW5CLG1CQUFtQixvR0UvTWhDLDZUQVFBOztTRnVNYSxtQkFBbUI7MkZBQW5CLG1CQUFtQjtrQkFQL0IsU0FBUzsrQkFDRSxpQkFBaUIsaUJBRVosaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6QyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQzs7QUFJcEM7Ozs7OztHQU1HO0FBQ0gsTUFPYSx1QkFBdUI7OEdBQXZCLHVCQUF1QjtrR0FBdkIsdUJBQXVCLDhHRy9OcEMsK1BBUUE7O1NIdU5hLHVCQUF1QjsyRkFBdkIsdUJBQXVCO2tCQVBuQyxTQUFTOytCQUNFLHNCQUFzQixpQkFFakIsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxRQUN6QyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBDb250ZW50IG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRDb250ZW50YCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jYXJkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLWNvbnRlbnQsIFttYXQtY2FyZC1jb250ZW50XSwgW21hdENhcmRDb250ZW50XScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtY29udGVudCd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDYXJkQ29udGVudCB7fVxuXG4vKipcbiAqIFRpdGxlIG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRUaXRsZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2FyZC10aXRsZSwgW21hdC1jYXJkLXRpdGxlXSwgW21hdENhcmRUaXRsZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLXRpdGxlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZFRpdGxlIHt9XG5cbi8qKlxuICogU3ViLXRpdGxlIG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRTdWJ0aXRsZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2FyZC1zdWJ0aXRsZSwgW21hdC1jYXJkLXN1YnRpdGxlXSwgW21hdENhcmRTdWJ0aXRsZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLXN1YnRpdGxlJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZFN1YnRpdGxlIHt9XG5cbi8qKlxuICogQWN0aW9uIHNlY3Rpb24gb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2FyZEFjdGlvbnNgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NhcmRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtYWN0aW9ucycsXG4gIGV4cG9ydEFzOiAnbWF0Q2FyZEFjdGlvbnMnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLWFjdGlvbnMnLFxuICAgICdbY2xhc3MubWF0LWNhcmQtYWN0aW9ucy1hbGlnbi1lbmRdJzogJ2FsaWduID09PSBcImVuZFwiJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZEFjdGlvbnMge1xuICAvKiogUG9zaXRpb24gb2YgdGhlIGFjdGlvbnMgaW5zaWRlIHRoZSBjYXJkLiAqL1xuICBASW5wdXQoKSBhbGlnbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ3N0YXJ0Jztcbn1cblxuLyoqXG4gKiBGb290ZXIgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2FyZEZvb3RlcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC1mb290ZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWZvb3Rlcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDYXJkRm9vdGVyIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRJbWFnZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtaW1hZ2VdLCBbbWF0Q2FyZEltYWdlXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtaW1hZ2UnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZEltYWdlIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRTbUltYWdlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jYXJkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1zbS1pbWFnZV0sIFttYXRDYXJkSW1hZ2VTbWFsbF0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLXNtLWltYWdlJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUNhcmRTbUltYWdlIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRNZEltYWdlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jYXJkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1tZC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VNZWRpdW1dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1tZC1pbWFnZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDYXJkTWRJbWFnZSB7fVxuXG4vKipcbiAqIEltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDYXJkTGdJbWFnZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtbGctaW1hZ2VdLCBbbWF0Q2FyZEltYWdlTGFyZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1sZy1pbWFnZSd9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDYXJkTGdJbWFnZSB7fVxuXG4vKipcbiAqIExhcmdlIGltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDYXJkWGxJbWFnZWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQteGwtaW1hZ2VdLCBbbWF0Q2FyZEltYWdlWExhcmdlXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQteGwtaW1hZ2UnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZFhsSW1hZ2Uge31cblxuLyoqXG4gKiBBdmF0YXIgaW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRBdmF0YXJgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NhcmRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLWF2YXRhcl0sIFttYXRDYXJkQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtYXZhdGFyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUNhcmRBdmF0YXIge31cblxuLyoqXG4gKiBBIGJhc2ljIGNvbnRlbnQgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGFkZHMgdGhlIHN0eWxlcyBvZiBhIE1hdGVyaWFsIGRlc2lnbiBjYXJkLlxuICpcbiAqIFdoaWxlIHRoaXMgY29tcG9uZW50IGNhbiBiZSB1c2VkIGFsb25lLCBpdCBhbHNvIHByb3ZpZGVzIGEgbnVtYmVyXG4gKiBvZiBwcmVzZXQgc3R5bGVzIGZvciBjb21tb24gY2FyZCBzZWN0aW9ucywgaW5jbHVkaW5nOlxuICogLSBtYXQtY2FyZC10aXRsZVxuICogLSBtYXQtY2FyZC1zdWJ0aXRsZVxuICogLSBtYXQtY2FyZC1jb250ZW50XG4gKiAtIG1hdC1jYXJkLWFjdGlvbnNcbiAqIC0gbWF0LWNhcmQtZm9vdGVyXG4gKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDYXJkYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9jYXJkYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkJyxcbiAgZXhwb3J0QXM6ICdtYXRDYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FyZC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUNhcmQge1xuICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogQ29tcG9uZW50IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBgPG1hdC1jYXJkPmAgY29tcG9uZW50LiBJdCBhZGRzIHN0eWxlcyBmb3IgYVxuICogcHJlc2V0IGhlYWRlciBzZWN0aW9uIChpLmUuIGEgdGl0bGUsIHN1YnRpdGxlLCBhbmQgYXZhdGFyIGxheW91dCkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdENhcmRIZWFkZXJgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NhcmRgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLWhlYWRlci5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtaGVhZGVyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUNhcmRIZWFkZXIge31cblxuLyoqXG4gKiBDb21wb25lbnQgaW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoaW4gdGhlIGA8bWF0LWNhcmQ+YCBjb21wb25lbnQuIEl0IGFkZHMgc3R5bGVzIGZvciBhIHByZXNldFxuICogbGF5b3V0IHRoYXQgZ3JvdXBzIGFuIGltYWdlIHdpdGggYSB0aXRsZSBzZWN0aW9uLlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRDYXJkVGl0bGVHcm91cGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC10aXRsZS1ncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnY2FyZC10aXRsZS1ncm91cC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtdGl0bGUtZ3JvdXAnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5Q2FyZFRpdGxlR3JvdXAge31cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1jYXJkLWZvb3RlclwiPjwvbmctY29udGVudD5cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cIlttYXQtY2FyZC1hdmF0YXJdLCBbbWF0Q2FyZEF2YXRhcl1cIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwibWF0LWNhcmQtaGVhZGVyLXRleHRcIj5cbiAgPG5nLWNvbnRlbnRcbiAgICAgIHNlbGVjdD1cIm1hdC1jYXJkLXRpdGxlLCBtYXQtY2FyZC1zdWJ0aXRsZSxcbiAgICAgIFttYXQtY2FyZC10aXRsZV0sIFttYXQtY2FyZC1zdWJ0aXRsZV0sXG4gICAgICBbbWF0Q2FyZFRpdGxlXSwgW21hdENhcmRTdWJ0aXRsZV1cIj48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiIsIjxkaXY+XG4gIDxuZy1jb250ZW50XG4gICAgICBzZWxlY3Q9XCJtYXQtY2FyZC10aXRsZSwgbWF0LWNhcmQtc3VidGl0bGUsXG4gICAgICBbbWF0LWNhcmQtdGl0bGVdLCBbbWF0LWNhcmQtc3VidGl0bGVdLFxuICAgICAgW21hdENhcmRUaXRsZV0sIFttYXRDYXJkU3VidGl0bGVdXCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG48bmctY29udGVudCBzZWxlY3Q9XCJpbWdcIj48L25nLWNvbnRlbnQ+XG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4iXX0=