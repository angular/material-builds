/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ChangeDetectionStrategy, Directive, Input, Optional, Inject, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Content of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
export class MatCardContent {
}
MatCardContent.decorators = [
    { type: Directive, args: [{
                selector: 'mat-card-content',
                host: { 'class': 'mat-card-content' }
            },] }
];
/**
 * Title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
export class MatCardTitle {
}
MatCardTitle.decorators = [
    { type: Directive, args: [{
                selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
                host: {
                    'class': 'mat-card-title'
                }
            },] }
];
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
export class MatCardSubtitle {
}
MatCardSubtitle.decorators = [
    { type: Directive, args: [{
                selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
                host: {
                    'class': 'mat-card-subtitle'
                }
            },] }
];
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
export class MatCardActions {
    constructor() {
        /**
         * Position of the actions inside the card.
         */
        this.align = 'start';
    }
}
MatCardActions.decorators = [
    { type: Directive, args: [{
                selector: 'mat-card-actions',
                exportAs: 'matCardActions',
                host: {
                    'class': 'mat-card-actions',
                    '[class.mat-card-actions-align-end]': 'align === "end"',
                }
            },] }
];
MatCardActions.propDecorators = {
    align: [{ type: Input }]
};
if (false) {
    /**
     * Position of the actions inside the card.
     * @type {?}
     */
    MatCardActions.prototype.align;
}
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * \@docs-private
 */
export class MatCardFooter {
}
MatCardFooter.decorators = [
    { type: Directive, args: [{
                selector: 'mat-card-footer',
                host: { 'class': 'mat-card-footer' }
            },] }
];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardImage {
}
MatCardImage.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-image], [matCardImage]',
                host: { 'class': 'mat-card-image' }
            },] }
];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardSmImage {
}
MatCardSmImage.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-sm-image], [matCardImageSmall]',
                host: { 'class': 'mat-card-sm-image' }
            },] }
];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardMdImage {
}
MatCardMdImage.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-md-image], [matCardImageMedium]',
                host: { 'class': 'mat-card-md-image' }
            },] }
];
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardLgImage {
}
MatCardLgImage.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-lg-image], [matCardImageLarge]',
                host: { 'class': 'mat-card-lg-image' }
            },] }
];
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardXlImage {
}
MatCardXlImage.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-xl-image], [matCardImageXLarge]',
                host: { 'class': 'mat-card-xl-image' }
            },] }
];
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * \@docs-private
 */
export class MatCardAvatar {
}
MatCardAvatar.decorators = [
    { type: Directive, args: [{
                selector: '[mat-card-avatar], [matCardAvatar]',
                host: { 'class': 'mat-card-avatar' }
            },] }
];
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
 */
export class MatCard {
    // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
    /**
     * @param {?=} _animationMode
     */
    constructor(_animationMode) {
        this._animationMode = _animationMode;
    }
}
MatCard.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-card',
                exportAs: 'matCard',
                template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'mat-card',
                    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                },
                styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}._mat-animation-noopable.mat-card{transition:none;animation:none}.mat-card .mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider-horizontal{left:auto;right:0}.mat-card .mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card .mat-divider-horizontal.mat-divider-inset{margin-right:0}@media(-ms-high-contrast: active){.mat-card{outline:solid 1px}}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child,.mat-card-actions .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}\n"]
            }] }
];
/** @nocollapse */
MatCard.ctorParameters = () => [
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
if (false) {
    /** @type {?} */
    MatCard.prototype._animationMode;
}
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * \@docs-private
 */
export class MatCardHeader {
}
MatCardHeader.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-card-header',
                template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-header' }
            }] }
];
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a preset
 * layout that groups an image with a title section.
 * \@docs-private
 */
export class MatCardTitleGroup {
}
MatCardTitleGroup.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-card-title-group',
                template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'class': 'mat-card-title-group' }
            }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jYXJkL2NhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsU0FBUyxFQUNULEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7OztBQVczRSxNQUFNLE9BQU8sY0FBYzs7O1lBSjFCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUM7YUFDcEM7Ozs7OztBQWFELE1BQU0sT0FBTyxZQUFZOzs7WUFOeEIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrREFBa0Q7Z0JBQzVELElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsZ0JBQWdCO2lCQUMxQjthQUNGOzs7Ozs7QUFhRCxNQUFNLE9BQU8sZUFBZTs7O1lBTjNCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkRBQTJEO2dCQUNyRSxJQUFJLEVBQUU7b0JBQ0osT0FBTyxFQUFFLG1CQUFtQjtpQkFDN0I7YUFDRjs7Ozs7O0FBZUQsTUFBTSxPQUFPLGNBQWM7SUFSM0I7Ozs7UUFVVyxVQUFLLEdBQW9CLE9BQU8sQ0FBQztJQUM1QyxDQUFDOzs7WUFYQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxrQkFBa0I7b0JBQzNCLG9DQUFvQyxFQUFFLGlCQUFpQjtpQkFDeEQ7YUFDRjs7O29CQUdFLEtBQUs7Ozs7Ozs7SUFBTiwrQkFBMEM7Ozs7OztBQVc1QyxNQUFNLE9BQU8sYUFBYTs7O1lBSnpCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7YUFDbkM7Ozs7OztBQVdELE1BQU0sT0FBTyxZQUFZOzs7WUFKeEIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQ0FBa0M7Z0JBQzVDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBQzthQUNsQzs7Ozs7O0FBV0QsTUFBTSxPQUFPLGNBQWM7OztZQUoxQixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBDQUEwQztnQkFDcEQsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFDO2FBQ3JDOzs7Ozs7QUFXRCxNQUFNLE9BQU8sY0FBYzs7O1lBSjFCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkNBQTJDO2dCQUNyRCxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUM7YUFDckM7Ozs7OztBQVdELE1BQU0sT0FBTyxjQUFjOzs7WUFKMUIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwwQ0FBMEM7Z0JBQ3BELElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxtQkFBbUIsRUFBQzthQUNyQzs7Ozs7O0FBV0QsTUFBTSxPQUFPLGNBQWM7OztZQUoxQixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJDQUEyQztnQkFDckQsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFDO2FBQ3JDOzs7Ozs7QUFXRCxNQUFNLE9BQU8sYUFBYTs7O1lBSnpCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2dCQUM5QyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7YUFDbkM7Ozs7Ozs7Ozs7Ozs7QUE0QkQsTUFBTSxPQUFPLE9BQU87Ozs7O0lBRWxCLFlBQThELGNBQXVCO1FBQXZCLG1CQUFjLEdBQWQsY0FBYyxDQUFTO0lBQUcsQ0FBQzs7O1lBZjFGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ25CLFFBQVEsRUFBRSxVQUFVO2dCQUNwQixRQUFRLEVBQUUsU0FBUztnQkFDbkIsNkZBQXdCO2dCQUV4QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsVUFBVTtvQkFDbkIsaUNBQWlDLEVBQUUscUNBQXFDO2lCQUN6RTs7YUFDRjs7Ozt5Q0FHYyxRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7OztJQUF6QyxpQ0FBeUU7Ozs7Ozs7QUFpQnZGLE1BQU0sT0FBTyxhQUFhOzs7WUFSekIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsdVVBQStCO2dCQUMvQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQzthQUNuQzs7Ozs7OztBQWlCRCxNQUFNLE9BQU8saUJBQWlCOzs7WUFSN0IsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMseVFBQW9DO2dCQUNwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQzthQUN4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKipcbiAqIENvbnRlbnQgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtY29udGVudCcsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtY29udGVudCd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRDb250ZW50IHt9XG5cbi8qKlxuICogVGl0bGUgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWNhcmQtdGl0bGUsIFttYXQtY2FyZC10aXRsZV0sIFttYXRDYXJkVGl0bGVdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FyZC10aXRsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkVGl0bGUge31cblxuLyoqXG4gKiBTdWItdGl0bGUgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbWF0LWNhcmQtc3VidGl0bGUsIFttYXQtY2FyZC1zdWJ0aXRsZV0sIFttYXRDYXJkU3VidGl0bGVdYCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FyZC1zdWJ0aXRsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkU3VidGl0bGUge31cblxuLyoqXG4gKiBBY3Rpb24gc2VjdGlvbiBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtY2FyZC1hY3Rpb25zJyxcbiAgZXhwb3J0QXM6ICdtYXRDYXJkQWN0aW9ucycsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQtYWN0aW9ucycsXG4gICAgJ1tjbGFzcy5tYXQtY2FyZC1hY3Rpb25zLWFsaWduLWVuZF0nOiAnYWxpZ24gPT09IFwiZW5kXCInLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRBY3Rpb25zIHtcbiAgLyoqIFBvc2l0aW9uIG9mIHRoZSBhY3Rpb25zIGluc2lkZSB0aGUgY2FyZC4gKi9cbiAgQElucHV0KCkgYWxpZ246ICdzdGFydCcgfCAnZW5kJyA9ICdzdGFydCc7XG59XG5cbi8qKlxuICogRm9vdGVyIG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLWZvb3RlcicsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtZm9vdGVyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZEZvb3RlciB7fVxuXG4vKipcbiAqIEltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtaW1hZ2VdLCBbbWF0Q2FyZEltYWdlXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtaW1hZ2UnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkSW1hZ2Uge31cblxuLyoqXG4gKiBJbWFnZSB1c2VkIGluIGEgY2FyZCwgbmVlZGVkIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLXNtLWltYWdlXSwgW21hdENhcmRJbWFnZVNtYWxsXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtc20taW1hZ2UnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkU21JbWFnZSB7fVxuXG4vKipcbiAqIEltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtbWQtaW1hZ2VdLCBbbWF0Q2FyZEltYWdlTWVkaXVtXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtbWQtaW1hZ2UnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkTWRJbWFnZSB7fVxuXG4vKipcbiAqIEltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtbGctaW1hZ2VdLCBbbWF0Q2FyZEltYWdlTGFyZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1sZy1pbWFnZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRMZ0ltYWdlIHt9XG5cbi8qKlxuICogTGFyZ2UgaW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC14bC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VYTGFyZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC14bC1pbWFnZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRYbEltYWdlIHt9XG5cbi8qKlxuICogQXZhdGFyIGltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtYXZhdGFyXSwgW21hdENhcmRBdmF0YXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1hdmF0YXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkQXZhdGFyIHt9XG5cblxuLyoqXG4gKiBBIGJhc2ljIGNvbnRlbnQgY29udGFpbmVyIGNvbXBvbmVudCB0aGF0IGFkZHMgdGhlIHN0eWxlcyBvZiBhIE1hdGVyaWFsIGRlc2lnbiBjYXJkLlxuICpcbiAqIFdoaWxlIHRoaXMgY29tcG9uZW50IGNhbiBiZSB1c2VkIGFsb25lLCBpdCBhbHNvIHByb3ZpZGVzIGEgbnVtYmVyXG4gKiBvZiBwcmVzZXQgc3R5bGVzIGZvciBjb21tb24gY2FyZCBzZWN0aW9ucywgaW5jbHVkaW5nOlxuICogLSBtYXQtY2FyZC10aXRsZVxuICogLSBtYXQtY2FyZC1zdWJ0aXRsZVxuICogLSBtYXQtY2FyZC1jb250ZW50XG4gKiAtIG1hdC1jYXJkLWFjdGlvbnNcbiAqIC0gbWF0LWNhcmQtZm9vdGVyXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC1jYXJkJyxcbiAgZXhwb3J0QXM6ICdtYXRDYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnY2FyZC5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWNhcmQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmQge1xuICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfYW5pbWF0aW9uTW9kZWAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHt9XG59XG5cblxuLyoqXG4gKiBDb21wb25lbnQgaW50ZW5kZWQgdG8gYmUgdXNlZCB3aXRoaW4gdGhlIGA8bWF0LWNhcmQ+YCBjb21wb25lbnQuIEl0IGFkZHMgc3R5bGVzIGZvciBhXG4gKiBwcmVzZXQgaGVhZGVyIHNlY3Rpb24gKGkuZS4gYSB0aXRsZSwgc3VidGl0bGUsIGFuZCBhdmF0YXIgbGF5b3V0KS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtaGVhZGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLWhlYWRlci5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWNhcmQtaGVhZGVyJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZEhlYWRlciB7fVxuXG5cbi8qKlxuICogQ29tcG9uZW50IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBgPG1hdC1jYXJkPmAgY29tcG9uZW50LiBJdCBhZGRzIHN0eWxlcyBmb3IgYSBwcmVzZXRcbiAqIGxheW91dCB0aGF0IGdyb3VwcyBhbiBpbWFnZSB3aXRoIGEgdGl0bGUgc2VjdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtdGl0bGUtZ3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJ2NhcmQtdGl0bGUtZ3JvdXAuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLXRpdGxlLWdyb3VwJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZFRpdGxlR3JvdXAge31cbiJdfQ==