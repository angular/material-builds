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
 * @docs-private
 */
export const matStepperAnimations = {
    /** Animation that transitions the step along the X axis in a horizontal stepper. */
    horizontalStepTransition: trigger('stepTransition', [
        state('previous', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })),
        // Transition to `inherit`, rather than `visible`,
        // because visibility on a child element the one from the parent,
        // making this element focusable inside of a `hidden` element.
        state('current', style({ transform: 'none', visibility: 'inherit' })),
        state('next', style({ transform: 'translate3d(100%, 0, 0)', visibility: 'hidden' })),
        transition('* => *', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
    ]),
    /** Animation that transitions the step along the Y axis in a vertical stepper. */
    verticalStepTransition: trigger('stepTransition', [
        state('previous', style({ height: '0px', visibility: 'hidden' })),
        state('next', style({ height: '0px', visibility: 'hidden' })),
        // Transition to `inherit`, rather than `visible`,
        // because visibility on a child element the one from the parent,
        // making this element focusable inside of a `hidden` element.
        state('current', style({ height: '*', visibility: 'inherit' })),
        transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvc3RlcHBlci1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBRzdCO0lBQ0Ysb0ZBQW9GO0lBQ3BGLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUNsRCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSwwQkFBMEIsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUN2RixrREFBa0Q7UUFDbEQsaUVBQWlFO1FBQ2pFLDhEQUE4RDtRQUM5RCxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDbkUsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDbEYsVUFBVSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztLQUN0RSxDQUFDO0lBRUYsa0ZBQWtGO0lBQ2xGLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRCxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQzNELGtEQUFrRDtRQUNsRCxpRUFBaUU7UUFDakUsOERBQThEO1FBQzlELEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUM3RCxVQUFVLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0tBQzdFLENBQUM7Q0FDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBhbmltYXRlLFxuICBzdGF0ZSxcbiAgc3R5bGUsXG4gIHRyYW5zaXRpb24sXG4gIHRyaWdnZXIsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbi8qKlxuICogQW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBNYXRlcmlhbCBzdGVwcGVycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdFN0ZXBwZXJBbmltYXRpb25zOiB7XG4gIHJlYWRvbmx5IGhvcml6b250YWxTdGVwVHJhbnNpdGlvbjogQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhO1xuICByZWFkb25seSB2ZXJ0aWNhbFN0ZXBUcmFuc2l0aW9uOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG59ID0ge1xuICAvKiogQW5pbWF0aW9uIHRoYXQgdHJhbnNpdGlvbnMgdGhlIHN0ZXAgYWxvbmcgdGhlIFggYXhpcyBpbiBhIGhvcml6b250YWwgc3RlcHBlci4gKi9cbiAgaG9yaXpvbnRhbFN0ZXBUcmFuc2l0aW9uOiB0cmlnZ2VyKCdzdGVwVHJhbnNpdGlvbicsIFtcbiAgICBzdGF0ZSgncHJldmlvdXMnLCBzdHlsZSh7dHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTEwMCUsIDAsIDApJywgdmlzaWJpbGl0eTogJ2hpZGRlbid9KSksXG4gICAgLy8gVHJhbnNpdGlvbiB0byBgaW5oZXJpdGAsIHJhdGhlciB0aGFuIGB2aXNpYmxlYCxcbiAgICAvLyBiZWNhdXNlIHZpc2liaWxpdHkgb24gYSBjaGlsZCBlbGVtZW50IHRoZSBvbmUgZnJvbSB0aGUgcGFyZW50LFxuICAgIC8vIG1ha2luZyB0aGlzIGVsZW1lbnQgZm9jdXNhYmxlIGluc2lkZSBvZiBhIGBoaWRkZW5gIGVsZW1lbnQuXG4gICAgc3RhdGUoJ2N1cnJlbnQnLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZScsIHZpc2liaWxpdHk6ICdpbmhlcml0J30pKSxcbiAgICBzdGF0ZSgnbmV4dCcsIHN0eWxlKHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsIHZpc2liaWxpdHk6ICdoaWRkZW4nfSkpLFxuICAgIHRyYW5zaXRpb24oJyogPT4gKicsIGFuaW1hdGUoJzUwMG1zIGN1YmljLWJlemllcigwLjM1LCAwLCAwLjI1LCAxKScpKVxuICBdKSxcblxuICAvKiogQW5pbWF0aW9uIHRoYXQgdHJhbnNpdGlvbnMgdGhlIHN0ZXAgYWxvbmcgdGhlIFkgYXhpcyBpbiBhIHZlcnRpY2FsIHN0ZXBwZXIuICovXG4gIHZlcnRpY2FsU3RlcFRyYW5zaXRpb246IHRyaWdnZXIoJ3N0ZXBUcmFuc2l0aW9uJywgW1xuICAgIHN0YXRlKCdwcmV2aW91cycsIHN0eWxlKHtoZWlnaHQ6ICcwcHgnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICBzdGF0ZSgnbmV4dCcsIHN0eWxlKHtoZWlnaHQ6ICcwcHgnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICAvLyBUcmFuc2l0aW9uIHRvIGBpbmhlcml0YCwgcmF0aGVyIHRoYW4gYHZpc2libGVgLFxuICAgIC8vIGJlY2F1c2UgdmlzaWJpbGl0eSBvbiBhIGNoaWxkIGVsZW1lbnQgdGhlIG9uZSBmcm9tIHRoZSBwYXJlbnQsXG4gICAgLy8gbWFraW5nIHRoaXMgZWxlbWVudCBmb2N1c2FibGUgaW5zaWRlIG9mIGEgYGhpZGRlbmAgZWxlbWVudC5cbiAgICBzdGF0ZSgnY3VycmVudCcsIHN0eWxlKHtoZWlnaHQ6ICcqJywgdmlzaWJpbGl0eTogJ2luaGVyaXQnfSkpLFxuICAgIHRyYW5zaXRpb24oJyogPD0+IGN1cnJlbnQnLCBhbmltYXRlKCcyMjVtcyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSknKSlcbiAgXSlcbn07XG4iXX0=