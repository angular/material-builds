/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
 * Animations used by the MatFormField.
 * \@docs-private
 * @type {?}
 */
export const matFormFieldAnimations = {
    /**
     * Animation that transitions the form field's error and hint messages.
     */
    transitionMessages: trigger('transitionMessages', [
        // TODO(mmalerba): Use angular animations for label animation as well.
        state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
        transition('void => enter', [
            style({ opacity: 0, transform: 'translateY(-100%)' }),
            animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
        ]),
    ])
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2Zvcm0tZmllbGQvZm9ybS1maWVsZC1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBT0EsT0FBTyxFQUNMLE9BQU8sRUFDUCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFVBQVUsRUFDVixPQUFPLEdBRVIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7O0FBTTdCLE1BQU0sT0FBTyxzQkFBc0IsR0FFL0I7Ozs7SUFFRixrQkFBa0IsRUFBRSxPQUFPLENBQUMsb0JBQW9CLEVBQUU7UUFDaEQsc0VBQXNFO1FBQ3RFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLFVBQVUsQ0FBQyxlQUFlLEVBQUU7WUFDMUIsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQztZQUNyRCxPQUFPLENBQUMsd0NBQXdDLENBQUM7U0FDbEQsQ0FBQztLQUNILENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgYW5pbWF0ZSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxuICBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0Rm9ybUZpZWxkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0Rm9ybUZpZWxkQW5pbWF0aW9uczoge1xuICByZWFkb25seSB0cmFuc2l0aW9uTWVzc2FnZXM6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YVxufSA9IHtcbiAgLyoqIEFuaW1hdGlvbiB0aGF0IHRyYW5zaXRpb25zIHRoZSBmb3JtIGZpZWxkJ3MgZXJyb3IgYW5kIGhpbnQgbWVzc2FnZXMuICovXG4gIHRyYW5zaXRpb25NZXNzYWdlczogdHJpZ2dlcigndHJhbnNpdGlvbk1lc3NhZ2VzJywgW1xuICAgIC8vIFRPRE8obW1hbGVyYmEpOiBVc2UgYW5ndWxhciBhbmltYXRpb25zIGZvciBsYWJlbCBhbmltYXRpb24gYXMgd2VsbC5cbiAgICBzdGF0ZSgnZW50ZXInLCBzdHlsZSh7IG9wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCUpJyB9KSksXG4gICAgdHJhbnNpdGlvbigndm9pZCA9PiBlbnRlcicsIFtcbiAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMTAwJSknIH0pLFxuICAgICAgYW5pbWF0ZSgnMzAwbXMgY3ViaWMtYmV6aWVyKDAuNTUsIDAsIDAuNTUsIDAuMiknKSxcbiAgICBdKSxcbiAgXSlcbn07XG4iXX0=