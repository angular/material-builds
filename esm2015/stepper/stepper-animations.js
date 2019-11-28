/**
 * @fileoverview added by tsickle
 * Generated from: src/material/stepper/stepper-animations.ts
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
 * Animations used by the Material steppers.
 * \@docs-private
 * @type {?}
 */
export const matStepperAnimations = {
    /**
     * Animation that transitions the step along the X axis in a horizontal stepper.
     */
    horizontalStepTransition: trigger('stepTransition', [
        state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
        state('current', style({ transform: 'none', visibility: 'visible' })),
        state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
        transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),
    /**
     * Animation that transitions the step along the Y axis in a vertical stepper.
     */
    verticalStepTransition: trigger('stepTransition', [
        state('previous', style({ height: '0px', visibility: 'hidden' })),
        state('next', style({ height: '0px', visibility: 'hidden' })),
        state('current', style({ height: '*', visibility: 'visible' })),
        transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQU9BLE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7Ozs7OztBQU03QixNQUFNLE9BQU8sb0JBQW9CLEdBRzdCOzs7O0lBRUYsd0JBQXdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixFQUFFO1FBQ2xELEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZGLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUNuRSxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSx5QkFBeUIsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNsRixVQUFVLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQ3RFLENBQUM7Ozs7SUFHRixzQkFBc0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDaEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQy9ELEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUMzRCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDN0QsVUFBVSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztLQUM3RSxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgdGhlIE1hdGVyaWFsIHN0ZXBwZXJzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0U3RlcHBlckFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgaG9yaXpvbnRhbFN0ZXBUcmFuc2l0aW9uOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IHZlcnRpY2FsU3RlcFRyYW5zaXRpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCB0cmFuc2l0aW9ucyB0aGUgc3RlcCBhbG9uZyB0aGUgWCBheGlzIGluIGEgaG9yaXpvbnRhbCBzdGVwcGVyLiAqL1xuICBob3Jpem9udGFsU3RlcFRyYW5zaXRpb246IHRyaWdnZXIoJ3N0ZXBUcmFuc2l0aW9uJywgW1xuICAgIHN0YXRlKCdwcmV2aW91cycsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgtMTAwJSwgMCwgMCknLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICBzdGF0ZSgnY3VycmVudCcsIHN0eWxlKHt0cmFuc2Zvcm06ICdub25lJywgdmlzaWJpbGl0eTogJ3Zpc2libGUnfSkpLFxuICAgIHN0YXRlKCduZXh0Jywgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDEwMCUsIDAsIDApJywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgdHJhbnNpdGlvbignKiA9PiAqJywgYW5pbWF0ZSgnNTAwbXMgY3ViaWMtYmV6aWVyKDAuMzUsIDAsIDAuMjUsIDEpJykpXG4gIF0pLFxuXG4gIC8qKiBBbmltYXRpb24gdGhhdCB0cmFuc2l0aW9ucyB0aGUgc3RlcCBhbG9uZyB0aGUgWSBheGlzIGluIGEgdmVydGljYWwgc3RlcHBlci4gKi9cbiAgdmVydGljYWxTdGVwVHJhbnNpdGlvbjogdHJpZ2dlcignc3RlcFRyYW5zaXRpb24nLCBbXG4gICAgc3RhdGUoJ3ByZXZpb3VzJywgc3R5bGUoe2hlaWdodDogJzBweCcsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIHN0YXRlKCduZXh0Jywgc3R5bGUoe2hlaWdodDogJzBweCcsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIHN0YXRlKCdjdXJyZW50Jywgc3R5bGUoe2hlaWdodDogJyonLCB2aXNpYmlsaXR5OiAndmlzaWJsZSd9KSksXG4gICAgdHJhbnNpdGlvbignKiA8PT4gY3VycmVudCcsIGFuaW1hdGUoJzIyNW1zIGN1YmljLWJlemllcigwLjQsIDAuMCwgMC4yLCAxKScpKVxuICBdKVxufTtcbiJdfQ==