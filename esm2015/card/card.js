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
 * @docs-private
 */
let MatCardContent = /** @class */ (() => {
    class MatCardContent {
    }
    MatCardContent.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-card-content, [mat-card-content], [matCardContent]',
                    host: { 'class': 'mat-card-content' }
                },] }
    ];
    return MatCardContent;
})();
export { MatCardContent };
/**
 * Title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
let MatCardTitle = /** @class */ (() => {
    class MatCardTitle {
    }
    MatCardTitle.decorators = [
        { type: Directive, args: [{
                    selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
                    host: {
                        'class': 'mat-card-title'
                    }
                },] }
    ];
    return MatCardTitle;
})();
export { MatCardTitle };
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
let MatCardSubtitle = /** @class */ (() => {
    class MatCardSubtitle {
    }
    MatCardSubtitle.decorators = [
        { type: Directive, args: [{
                    selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
                    host: {
                        'class': 'mat-card-subtitle'
                    }
                },] }
    ];
    return MatCardSubtitle;
})();
export { MatCardSubtitle };
/**
 * Action section of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
let MatCardActions = /** @class */ (() => {
    class MatCardActions {
        constructor() {
            /** Position of the actions inside the card. */
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
    return MatCardActions;
})();
export { MatCardActions };
/**
 * Footer of a card, needed as it's used as a selector in the API.
 * @docs-private
 */
let MatCardFooter = /** @class */ (() => {
    class MatCardFooter {
    }
    MatCardFooter.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-card-footer',
                    host: { 'class': 'mat-card-footer' }
                },] }
    ];
    return MatCardFooter;
})();
export { MatCardFooter };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardImage = /** @class */ (() => {
    class MatCardImage {
    }
    MatCardImage.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-image], [matCardImage]',
                    host: { 'class': 'mat-card-image' }
                },] }
    ];
    return MatCardImage;
})();
export { MatCardImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardSmImage = /** @class */ (() => {
    class MatCardSmImage {
    }
    MatCardSmImage.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-sm-image], [matCardImageSmall]',
                    host: { 'class': 'mat-card-sm-image' }
                },] }
    ];
    return MatCardSmImage;
})();
export { MatCardSmImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardMdImage = /** @class */ (() => {
    class MatCardMdImage {
    }
    MatCardMdImage.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-md-image], [matCardImageMedium]',
                    host: { 'class': 'mat-card-md-image' }
                },] }
    ];
    return MatCardMdImage;
})();
export { MatCardMdImage };
/**
 * Image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardLgImage = /** @class */ (() => {
    class MatCardLgImage {
    }
    MatCardLgImage.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-lg-image], [matCardImageLarge]',
                    host: { 'class': 'mat-card-lg-image' }
                },] }
    ];
    return MatCardLgImage;
})();
export { MatCardLgImage };
/**
 * Large image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardXlImage = /** @class */ (() => {
    class MatCardXlImage {
    }
    MatCardXlImage.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-xl-image], [matCardImageXLarge]',
                    host: { 'class': 'mat-card-xl-image' }
                },] }
    ];
    return MatCardXlImage;
})();
export { MatCardXlImage };
/**
 * Avatar image used in a card, needed to add the mat- CSS styling.
 * @docs-private
 */
let MatCardAvatar = /** @class */ (() => {
    class MatCardAvatar {
    }
    MatCardAvatar.decorators = [
        { type: Directive, args: [{
                    selector: '[mat-card-avatar], [matCardAvatar]',
                    host: { 'class': 'mat-card-avatar' }
                },] }
    ];
    return MatCardAvatar;
})();
export { MatCardAvatar };
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
let MatCard = /** @class */ (() => {
    class MatCard {
        // @breaking-change 9.0.0 `_animationMode` parameter to be made required.
        constructor(_animationMode) {
            this._animationMode = _animationMode;
        }
    }
    MatCard.decorators = [
        { type: Component, args: [{
                    selector: 'mat-card',
                    exportAs: 'matCard',
                    template: "<ng-content></ng-content>\n<ng-content select=\"mat-card-footer\"></ng-content>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        'class': 'mat-card mat-focus-indicator',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    },
                    styles: [".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}._mat-animation-noopable.mat-card{transition:none;animation:none}.mat-card .mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider-horizontal{left:auto;right:0}.mat-card .mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card .mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions .mat-button:first-child,.mat-card-actions .mat-raised-button:first-child,.mat-card-actions .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatCard.ctorParameters = () => [
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ];
    return MatCard;
})();
export { MatCard };
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a
 * preset header section (i.e. a title, subtitle, and avatar layout).
 * @docs-private
 */
let MatCardHeader = /** @class */ (() => {
    class MatCardHeader {
    }
    MatCardHeader.decorators = [
        { type: Component, args: [{
                    selector: 'mat-card-header',
                    template: "<ng-content select=\"[mat-card-avatar], [matCardAvatar]\"></ng-content>\n<div class=\"mat-card-header-text\">\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content></ng-content>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'mat-card-header' }
                }] }
    ];
    return MatCardHeader;
})();
export { MatCardHeader };
/**
 * Component intended to be used within the `<mat-card>` component. It adds styles for a preset
 * layout that groups an image with a title section.
 * @docs-private
 */
let MatCardTitleGroup = /** @class */ (() => {
    class MatCardTitleGroup {
    }
    MatCardTitleGroup.decorators = [
        { type: Component, args: [{
                    selector: 'mat-card-title-group',
                    template: "<div>\n  <ng-content\n      select=\"mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]\"></ng-content>\n</div>\n<ng-content select=\"img\"></ng-content>\n<ng-content></ng-content>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'class': 'mat-card-title-group' }
                }] }
    ];
    return MatCardTitleGroup;
})();
export { MatCardTitleGroup };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jYXJkL2NhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxLQUFLLEVBQ0wsUUFBUSxFQUNSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUczRTs7O0dBR0c7QUFDSDtJQUFBLE1BSWEsY0FBYzs7O2dCQUoxQixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHdEQUF3RDtvQkFDbEUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDO2lCQUNwQzs7SUFDNEIscUJBQUM7S0FBQTtTQUFqQixjQUFjO0FBRTNCOzs7R0FHRztBQUNIO0lBQUEsTUFNYSxZQUFZOzs7Z0JBTnhCLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0RBQWtEO29CQUM1RCxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGdCQUFnQjtxQkFDMUI7aUJBQ0Y7O0lBQzBCLG1CQUFDO0tBQUE7U0FBZixZQUFZO0FBRXpCOzs7R0FHRztBQUNIO0lBQUEsTUFNYSxlQUFlOzs7Z0JBTjNCLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsMkRBQTJEO29CQUNyRSxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLG1CQUFtQjtxQkFDN0I7aUJBQ0Y7O0lBQzZCLHNCQUFDO0tBQUE7U0FBbEIsZUFBZTtBQUU1Qjs7O0dBR0c7QUFDSDtJQUFBLE1BUWEsY0FBYztRQVIzQjtZQVNFLCtDQUErQztZQUN0QyxVQUFLLEdBQW9CLE9BQU8sQ0FBQztRQUM1QyxDQUFDOzs7Z0JBWEEsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFB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QUUsaUJBQWlCLEVBQUM7aUJBQ25DOztJQUMyQixvQkFBQztLQUFBO1NBQWhCLGFBQWE7QUFHMUI7Ozs7R0FJRztBQUNIO0lBQUEsTUFPYSxpQkFBaUI7OztnQkFQN0IsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLHlRQUFvQztvQkFDcEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUM7aUJBQ3hDOztJQUMrQix3QkFBQztLQUFBO1NBQXBCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKipcbiAqIENvbnRlbnQgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtY29udGVudCwgW21hdC1jYXJkLWNvbnRlbnRdLCBbbWF0Q2FyZENvbnRlbnRdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1jb250ZW50J31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZENvbnRlbnQge31cblxuLyoqXG4gKiBUaXRsZSBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2FyZC10aXRsZSwgW21hdC1jYXJkLXRpdGxlXSwgW21hdENhcmRUaXRsZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLXRpdGxlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRUaXRsZSB7fVxuXG4vKipcbiAqIFN1Yi10aXRsZSBvZiBhIGNhcmQsIG5lZWRlZCBhcyBpdCdzIHVzZWQgYXMgYSBzZWxlY3RvciBpbiB0aGUgQVBJLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6IGBtYXQtY2FyZC1zdWJ0aXRsZSwgW21hdC1jYXJkLXN1YnRpdGxlXSwgW21hdENhcmRTdWJ0aXRsZV1gLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1jYXJkLXN1YnRpdGxlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRTdWJ0aXRsZSB7fVxuXG4vKipcbiAqIEFjdGlvbiBzZWN0aW9uIG9mIGEgY2FyZCwgbmVlZGVkIGFzIGl0J3MgdXNlZCBhcyBhIHNlbGVjdG9yIGluIHRoZSBBUEkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLWFjdGlvbnMnLFxuICBleHBvcnRBczogJ21hdENhcmRBY3Rpb25zJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FyZC1hY3Rpb25zJyxcbiAgICAnW2NsYXNzLm1hdC1jYXJkLWFjdGlvbnMtYWxpZ24tZW5kXSc6ICdhbGlnbiA9PT0gXCJlbmRcIicsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZEFjdGlvbnMge1xuICAvKiogUG9zaXRpb24gb2YgdGhlIGFjdGlvbnMgaW5zaWRlIHRoZSBjYXJkLiAqL1xuICBASW5wdXQoKSBhbGlnbjogJ3N0YXJ0JyB8ICdlbmQnID0gJ3N0YXJ0Jztcbn1cblxuLyoqXG4gKiBGb290ZXIgb2YgYSBjYXJkLCBuZWVkZWQgYXMgaXQncyB1c2VkIGFzIGEgc2VsZWN0b3IgaW4gdGhlIEFQSS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1mb290ZXInfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkRm9vdGVyIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1pbWFnZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRJbWFnZSB7fVxuXG4vKipcbiAqIEltYWdlIHVzZWQgaW4gYSBjYXJkLCBuZWVkZWQgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LWNhcmQtc20taW1hZ2VdLCBbbWF0Q2FyZEltYWdlU21hbGxdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1zbS1pbWFnZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRTbUltYWdlIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1tZC1pbWFnZV0sIFttYXRDYXJkSW1hZ2VNZWRpdW1dJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC1tZC1pbWFnZSd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRNZEltYWdlIHt9XG5cbi8qKlxuICogSW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1sZy1pbWFnZV0sIFttYXRDYXJkSW1hZ2VMYXJnZV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWxnLWltYWdlJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZExnSW1hZ2Uge31cblxuLyoqXG4gKiBMYXJnZSBpbWFnZSB1c2VkIGluIGEgY2FyZCwgbmVlZGVkIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1jYXJkLXhsLWltYWdlXSwgW21hdENhcmRJbWFnZVhMYXJnZV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLXhsLWltYWdlJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZFhsSW1hZ2Uge31cblxuLyoqXG4gKiBBdmF0YXIgaW1hZ2UgdXNlZCBpbiBhIGNhcmQsIG5lZWRlZCB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtY2FyZC1hdmF0YXJdLCBbbWF0Q2FyZEF2YXRhcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWF2YXRhcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRBdmF0YXIge31cblxuXG4vKipcbiAqIEEgYmFzaWMgY29udGVudCBjb250YWluZXIgY29tcG9uZW50IHRoYXQgYWRkcyB0aGUgc3R5bGVzIG9mIGEgTWF0ZXJpYWwgZGVzaWduIGNhcmQuXG4gKlxuICogV2hpbGUgdGhpcyBjb21wb25lbnQgY2FuIGJlIHVzZWQgYWxvbmUsIGl0IGFsc28gcHJvdmlkZXMgYSBudW1iZXJcbiAqIG9mIHByZXNldCBzdHlsZXMgZm9yIGNvbW1vbiBjYXJkIHNlY3Rpb25zLCBpbmNsdWRpbmc6XG4gKiAtIG1hdC1jYXJkLXRpdGxlXG4gKiAtIG1hdC1jYXJkLXN1YnRpdGxlXG4gKiAtIG1hdC1jYXJkLWNvbnRlbnRcbiAqIC0gbWF0LWNhcmQtYWN0aW9uc1xuICogLSBtYXQtY2FyZC1mb290ZXJcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWNhcmQnLFxuICBleHBvcnRBczogJ21hdENhcmQnLFxuICB0ZW1wbGF0ZVVybDogJ2NhcmQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydjYXJkLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtY2FyZCBtYXQtZm9jdXMtaW5kaWNhdG9yJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDYXJkIHtcbiAgLy8gQGJyZWFraW5nLWNoYW5nZSA5LjAuMCBgX2FuaW1hdGlvbk1vZGVgIHBhcmFtZXRlciB0byBiZSBtYWRlIHJlcXVpcmVkLlxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7fVxufVxuXG5cbi8qKlxuICogQ29tcG9uZW50IGludGVuZGVkIHRvIGJlIHVzZWQgd2l0aGluIHRoZSBgPG1hdC1jYXJkPmAgY29tcG9uZW50LiBJdCBhZGRzIHN0eWxlcyBmb3IgYVxuICogcHJlc2V0IGhlYWRlciBzZWN0aW9uIChpLmUuIGEgdGl0bGUsIHN1YnRpdGxlLCBhbmQgYXZhdGFyIGxheW91dCkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLWhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnY2FyZC1oZWFkZXIuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1jYXJkLWhlYWRlcid9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRIZWFkZXIge31cblxuXG4vKipcbiAqIENvbXBvbmVudCBpbnRlbmRlZCB0byBiZSB1c2VkIHdpdGhpbiB0aGUgYDxtYXQtY2FyZD5gIGNvbXBvbmVudC4gSXQgYWRkcyBzdHlsZXMgZm9yIGEgcHJlc2V0XG4gKiBsYXlvdXQgdGhhdCBncm91cHMgYW4gaW1hZ2Ugd2l0aCBhIHRpdGxlIHNlY3Rpb24uXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1jYXJkLXRpdGxlLWdyb3VwJyxcbiAgdGVtcGxhdGVVcmw6ICdjYXJkLXRpdGxlLWdyb3VwLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtY2FyZC10aXRsZS1ncm91cCd9XG59KVxuZXhwb3J0IGNsYXNzIE1hdENhcmRUaXRsZUdyb3VwIHt9XG4iXX0=