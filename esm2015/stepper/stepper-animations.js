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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyxvQkFBb0IsR0FHN0I7Ozs7SUFFRix3QkFBd0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7UUFDbEQsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDdkYsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ25FLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLHlCQUF5QixFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ2xGLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7S0FDdEUsQ0FBQzs7OztJQUdGLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQzNELEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQzdFLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0ZXJpYWwgc3RlcHBlcnMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRTdGVwcGVyQW5pbWF0aW9uczoge1xuICByZWFkb25seSBob3Jpem9udGFsU3RlcFRyYW5zaXRpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbiAgcmVhZG9ubHkgdmVydGljYWxTdGVwVHJhbnNpdGlvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHRyYW5zaXRpb25zIHRoZSBzdGVwIGFsb25nIHRoZSBYIGF4aXMgaW4gYSBob3Jpem9udGFsIHN0ZXBwZXIuICovXG4gIGhvcml6b250YWxTdGVwVHJhbnNpdGlvbjogdHJpZ2dlcignc3RlcFRyYW5zaXRpb24nLCBbXG4gICAgc3RhdGUoJ3ByZXZpb3VzJywgc3R5bGUoe3RyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwLCAwKScsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIHN0YXRlKCdjdXJyZW50Jywgc3R5bGUoe3RyYW5zZm9ybTogJ25vbmUnLCB2aXNpYmlsaXR5OiAndmlzaWJsZSd9KSksXG4gICAgc3RhdGUoJ25leHQnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICB0cmFuc2l0aW9uKCcqID0+IConLCBhbmltYXRlKCc1MDBtcyBjdWJpYy1iZXppZXIoMC4zNSwgMCwgMC4yNSwgMSknKSlcbiAgXSksXG5cbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHRyYW5zaXRpb25zIHRoZSBzdGVwIGFsb25nIHRoZSBZIGF4aXMgaW4gYSB2ZXJ0aWNhbCBzdGVwcGVyLiAqL1xuICB2ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uOiB0cmlnZ2VyKCdzdGVwVHJhbnNpdGlvbicsIFtcbiAgICBzdGF0ZSgncHJldmlvdXMnLCBzdHlsZSh7aGVpZ2h0OiAnMHB4JywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgc3RhdGUoJ25leHQnLCBzdHlsZSh7aGVpZ2h0OiAnMHB4JywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgc3RhdGUoJ2N1cnJlbnQnLCBzdHlsZSh7aGVpZ2h0OiAnKicsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ30pKSxcbiAgICB0cmFuc2l0aW9uKCcqIDw9PiBjdXJyZW50JywgYW5pbWF0ZSgnMjI1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJykpXG4gIF0pXG59O1xuIl19