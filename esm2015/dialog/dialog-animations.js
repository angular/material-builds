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
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by MatDialog.
 * \@docs-private
 * @type {?}
 */
export const matDialogAnimations = {
    /**
     * Animation that is applied on the dialog container by defalt.
     */
    dialogContainer: trigger('dialogContainer', [
        // Note: The `enter` animation transitions to `transform: none`, because for some reason
        // specifying the transform explicitly, causes IE both to blur the dialog content and
        // decimate the animation performance. Leaving it as `none` solves both issues.
        state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
        state('enter', style({ transform: 'none' })),
        transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
        transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL2RpYWxvZy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyxtQkFBbUIsR0FFNUI7Ozs7SUFFRixlQUFlLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQzFDLHdGQUF3RjtRQUN4RixxRkFBcUY7UUFDckYsK0VBQStFO1FBQy9FLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztRQUNqRSxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQzFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLGtDQUFrQyxFQUMvRCxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsVUFBVSxDQUFDLHNCQUFzQixFQUM3QixPQUFPLENBQUMscUNBQXFDLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztLQUN6RSxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgTWF0RGlhbG9nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0RGlhbG9nQW5pbWF0aW9uczoge1xuICByZWFkb25seSBkaWFsb2dDb250YWluZXI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCBpcyBhcHBsaWVkIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyIGJ5IGRlZmFsdC4gKi9cbiAgZGlhbG9nQ29udGFpbmVyOiB0cmlnZ2VyKCdkaWFsb2dDb250YWluZXInLCBbXG4gICAgLy8gTm90ZTogVGhlIGBlbnRlcmAgYW5pbWF0aW9uIHRyYW5zaXRpb25zIHRvIGB0cmFuc2Zvcm06IG5vbmVgLCBiZWNhdXNlIGZvciBzb21lIHJlYXNvblxuICAgIC8vIHNwZWNpZnlpbmcgdGhlIHRyYW5zZm9ybSBleHBsaWNpdGx5LCBjYXVzZXMgSUUgYm90aCB0byBibHVyIHRoZSBkaWFsb2cgY29udGVudCBhbmRcbiAgICAvLyBkZWNpbWF0ZSB0aGUgYW5pbWF0aW9uIHBlcmZvcm1hbmNlLiBMZWF2aW5nIGl0IGFzIGBub25lYCBzb2x2ZXMgYm90aCBpc3N1ZXMuXG4gICAgc3RhdGUoJ3ZvaWQsIGV4aXQnLCBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGUoMC43KSd9KSksXG4gICAgc3RhdGUoJ2VudGVyJywgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnfSkpLFxuICAgIHRyYW5zaXRpb24oJyogPT4gZW50ZXInLCBhbmltYXRlKCcxNTBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsXG4gICAgICAgIHN0eWxlKHt0cmFuc2Zvcm06ICdub25lJywgb3BhY2l0eTogMX0pKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2b2lkLCAqID0+IGV4aXQnLFxuICAgICAgICBhbmltYXRlKCc3NW1zIGN1YmljLWJlemllcigwLjQsIDAuMCwgMC4yLCAxKScsIHN0eWxlKHtvcGFjaXR5OiAwfSkpKSxcbiAgXSlcbn07XG4iXX0=