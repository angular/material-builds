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
import { animate, keyframes, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by MatTooltip.
 * \@docs-private
 * @type {?}
 */
export const matTooltipAnimations = {
    /**
     * Animation that transitions a tooltip in and out.
     */
    tooltipState: trigger('state', [
        state('initial, void, hidden', style({ opacity: 0, transform: 'scale(0)' })),
        state('visible', style({ transform: 'scale(1)' })),
        transition('* => visible', animate('200ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
            style({ opacity: 0, transform: 'scale(0)', offset: 0 }),
            style({ opacity: 0.5, transform: 'scale(0.99)', offset: 0.5 }),
            style({ opacity: 1, transform: 'scale(1)', offset: 1 })
        ]))),
        transition('* => hidden', animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 0 }))),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2x0aXAvdG9vbHRpcC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFFUCxTQUFTLEVBQ1QsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUNSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQU03QixNQUFNLE9BQU8sb0JBQW9CLEdBRTdCOzs7O0lBRUYsWUFBWSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDN0IsS0FBSyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDMUUsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUNoRCxVQUFVLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxTQUFTLENBQUM7WUFDL0UsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQztZQUNyRCxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDO1lBQzVELEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUM7U0FDdEQsQ0FBQyxDQUFDLENBQUM7UUFDSixVQUFVLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVGLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxuICBrZXlmcmFtZXMsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IE1hdFRvb2x0aXAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRUb29sdGlwQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0b29sdGlwU3RhdGU6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCB0cmFuc2l0aW9ucyBhIHRvb2x0aXAgaW4gYW5kIG91dC4gKi9cbiAgdG9vbHRpcFN0YXRlOiB0cmlnZ2VyKCdzdGF0ZScsIFtcbiAgICBzdGF0ZSgnaW5pdGlhbCwgdm9pZCwgaGlkZGVuJywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJ30pKSxcbiAgICBzdGF0ZSgndmlzaWJsZScsIHN0eWxlKHt0cmFuc2Zvcm06ICdzY2FsZSgxKSd9KSksXG4gICAgdHJhbnNpdGlvbignKiA9PiB2aXNpYmxlJywgYW5pbWF0ZSgnMjAwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknLCBrZXlmcmFtZXMoW1xuICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJywgb2Zmc2V0OiAwfSksXG4gICAgICBzdHlsZSh7b3BhY2l0eTogMC41LCB0cmFuc2Zvcm06ICdzY2FsZSgwLjk5KScsIG9mZnNldDogMC41fSksXG4gICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMSknLCBvZmZzZXQ6IDF9KVxuICAgIF0pKSksXG4gICAgdHJhbnNpdGlvbignKiA9PiBoaWRkZW4nLCBhbmltYXRlKCcxMDBtcyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScsIHN0eWxlKHtvcGFjaXR5OiAwfSkpKSxcbiAgXSlcbn07XG4iXX0=