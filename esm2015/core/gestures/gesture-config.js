/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Injectable, InjectionToken, Inject, Optional } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import { MatCommonModule } from '../common-behaviors/common-module';
/**
 * Injection token that can be used to provide options to the Hammerjs instance.
 * More info at http://hammerjs.github.io/api/.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 10.0.0
 */
export const MAT_HAMMER_OPTIONS = new InjectionToken('MAT_HAMMER_OPTIONS');
const ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES = [
    'longpress',
    'slide',
    'slidestart',
    'slideend',
    'slideright',
    'slideleft'
];
const ɵ0 = () => { }, ɵ1 = () => { };
/**
 * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
 * been loaded on the page.
 */
const noopHammerInstance = {
    on: ɵ0,
    off: ɵ1,
};
/**
 * Adjusts configuration of our gesture library, Hammer.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 10.0.0
 */
let GestureConfig = /** @class */ (() => {
    let GestureConfig = class GestureConfig extends HammerGestureConfig {
        constructor(_hammerOptions, _commonModule) {
            super();
            this._hammerOptions = _hammerOptions;
            /** List of new event names to add to the gesture support list */
            this.events = ANGULAR_MATERIAL_SUPPORTED_HAMMER_GESTURES;
        }
        /**
         * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
         *
         * Our gesture names come from the Material Design gestures spec:
         * https://material.io/design/#gestures-touch-mechanics
         *
         * More information on default recognizers can be found in Hammer docs:
         * http://hammerjs.github.io/recognizer-pan/
         * http://hammerjs.github.io/recognizer-press/
         *
         * @param element Element to which to assign the new HammerJS gestures.
         * @returns Newly-created HammerJS instance.
         */
        buildHammer(element) {
            const hammer = typeof window !== 'undefined' ? window.Hammer : null;
            if (!hammer) {
                // If HammerJS is not loaded here, return the noop HammerInstance. This is necessary to
                // ensure that omitting HammerJS completely will not cause any errors while *also* supporting
                // the lazy-loading of HammerJS via the HAMMER_LOADER token introduced in Angular 6.1.
                // Because we can't depend on HAMMER_LOADER's existance until 7.0, we have to always set
                // `this.events` to the set we support, instead of conditionally setting it to `[]` if
                // `HAMMER_LOADER` is present (and then throwing an Error here if `window.Hammer` is
                // undefined).
                // @breaking-change 8.0.0
                return noopHammerInstance;
            }
            const mc = new hammer(element, this._hammerOptions || undefined);
            // Default Hammer Recognizers.
            const pan = new hammer.Pan();
            const swipe = new hammer.Swipe();
            const press = new hammer.Press();
            // Notice that a HammerJS recognizer can only depend on one other recognizer once.
            // Otherwise the previous `recognizeWith` will be dropped.
            // TODO: Confirm threshold numbers with Material Design UX Team
            const slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
            const longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
            // Overwrite the default `pan` event to use the swipe event.
            pan.recognizeWith(swipe);
            // Since the slide event threshold is set to zero, the slide recognizer can fire and
            // accidentally reset the longpress recognizer. In order to make sure that the two
            // recognizers can run simultaneously but don't affect each other, we allow the slide
            // recognizer to recognize while a longpress is being processed.
            // See: https://github.com/hammerjs/hammer.js/blob/master/src/manager.js#L123-L124
            longpress.recognizeWith(slide);
            // Add customized gestures to Hammer manager
            mc.add([swipe, press, pan, slide, longpress]);
            return mc;
        }
        /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
        _createRecognizer(base, options, ...inheritances) {
            let recognizer = new base.constructor(options);
            inheritances.push(base);
            inheritances.forEach(item => recognizer.recognizeWith(item));
            return recognizer;
        }
    };
    GestureConfig = __decorate([
        Injectable(),
        __param(0, Optional()), __param(0, Inject(MAT_HAMMER_OPTIONS)),
        __param(1, Optional()),
        __metadata("design:paramtypes", [Object, MatCommonModule])
    ], GestureConfig);
    return GestureConfig;
})();
export { GestureConfig };
export { ɵ0, ɵ1 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9nZXN0dXJlcy9nZXN0dXJlLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFTbEU7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLGNBQWMsQ0FBZ0Isb0JBQW9CLENBQUMsQ0FBQztBQUUxRixNQUFNLDBDQUEwQyxHQUFHO0lBQ2pELFdBQVc7SUFDWCxPQUFPO0lBQ1AsWUFBWTtJQUNaLFVBQVU7SUFDVixZQUFZO0lBQ1osV0FBVztDQUNaLENBQUM7V0FPSSxHQUFHLEVBQUUsR0FBRSxDQUFDLE9BQ1AsR0FBRyxFQUFFLEdBQUUsQ0FBQztBQU5mOzs7R0FHRztBQUNILE1BQU0sa0JBQWtCLEdBQW1CO0lBQ3pDLEVBQUUsSUFBVTtJQUNaLEdBQUcsSUFBVTtDQUNkLENBQUM7QUFFRjs7OztHQUlHO0FBRUg7SUFBQSxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsbUJBQW1CO1FBSXBELFlBQ2tELGNBQThCLEVBQ2xFLGFBQStCO1lBQzNDLEtBQUssRUFBRSxDQUFDO1lBRndDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtZQUpoRixpRUFBaUU7WUFDakUsV0FBTSxHQUFHLDBDQUEwQyxDQUFDO1FBTXBELENBQUM7UUFFRDs7Ozs7Ozs7Ozs7O1dBWUc7UUFDSCxXQUFXLENBQUMsT0FBb0I7WUFDOUIsTUFBTSxNQUFNLEdBQWlCLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUUsTUFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBRTNGLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsdUZBQXVGO2dCQUN2Riw2RkFBNkY7Z0JBQzdGLHNGQUFzRjtnQkFDdEYsd0ZBQXdGO2dCQUN4RixzRkFBc0Y7Z0JBQ3RGLG9GQUFvRjtnQkFDcEYsY0FBYztnQkFDZCx5QkFBeUI7Z0JBQ3pCLE9BQU8sa0JBQWtCLENBQUM7YUFDM0I7WUFFRCxNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsSUFBSSxTQUFTLENBQUMsQ0FBQztZQUVqRSw4QkFBOEI7WUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFakMsa0ZBQWtGO1lBQ2xGLDBEQUEwRDtZQUMxRCwrREFBK0Q7WUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBRWpGLDREQUE0RDtZQUM1RCxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXpCLG9GQUFvRjtZQUNwRixrRkFBa0Y7WUFDbEYscUZBQXFGO1lBQ3JGLGdFQUFnRTtZQUNoRSxrRkFBa0Y7WUFDbEYsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvQiw0Q0FBNEM7WUFDNUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBRTlDLE9BQU8sRUFBb0IsQ0FBQztRQUM5QixDQUFDO1FBRUQsc0ZBQXNGO1FBQzlFLGlCQUFpQixDQUFDLElBQWdCLEVBQUUsT0FBWSxFQUFFLEdBQUcsWUFBMEI7WUFDckYsSUFBSSxVQUFVLEdBQUcsSUFBSyxJQUFJLENBQUMsV0FBZ0MsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVyRSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFN0QsT0FBTyxVQUFVLENBQUM7UUFDcEIsQ0FBQztLQUVGLENBQUE7SUE3RVksYUFBYTtRQUR6QixVQUFVLEVBQUU7UUFNUixXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtRQUN0QyxXQUFBLFFBQVEsRUFBRSxDQUFBO2lEQUFpQixlQUFlO09BTmxDLGFBQWEsQ0E2RXpCO0lBQUQsb0JBQUM7S0FBQTtTQTdFWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4sIEluamVjdCwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIYW1tZXJHZXN0dXJlQ29uZmlnfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICcuLi9jb21tb24tYmVoYXZpb3JzL2NvbW1vbi1tb2R1bGUnO1xuaW1wb3J0IHtcbiAgSGFtbWVyU3RhdGljLFxuICBIYW1tZXJJbnN0YW5jZSxcbiAgUmVjb2duaXplcixcbiAgUmVjb2duaXplclN0YXRpYyxcbiAgSGFtbWVyT3B0aW9ucyxcbn0gZnJvbSAnLi9nZXN0dXJlLWFubm90YXRpb25zJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgdG8gdGhlIEhhbW1lcmpzIGluc3RhbmNlLlxuICogTW9yZSBpbmZvIGF0IGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vYXBpLy5cbiAqIEBkZXByZWNhdGVkIE5vIGxvbmdlciBiZWluZyB1c2VkLiBUbyBiZSByZW1vdmVkLlxuICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9IQU1NRVJfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxIYW1tZXJPcHRpb25zPignTUFUX0hBTU1FUl9PUFRJT05TJyk7XG5cbmNvbnN0IEFOR1VMQVJfTUFURVJJQUxfU1VQUE9SVEVEX0hBTU1FUl9HRVNUVVJFUyA9IFtcbiAgJ2xvbmdwcmVzcycsXG4gICdzbGlkZScsXG4gICdzbGlkZXN0YXJ0JyxcbiAgJ3NsaWRlZW5kJyxcbiAgJ3NsaWRlcmlnaHQnLFxuICAnc2xpZGVsZWZ0J1xuXTtcblxuLyoqXG4gKiBGYWtlIEhhbW1lckluc3RhbmNlIHRoYXQgaXMgdXNlZCB3aGVuIGEgSGFtbWVyIGluc3RhbmNlIGlzIHJlcXVlc3RlZCB3aGVuIEhhbW1lckpTIGhhcyBub3RcbiAqIGJlZW4gbG9hZGVkIG9uIHRoZSBwYWdlLlxuICovXG5jb25zdCBub29wSGFtbWVySW5zdGFuY2U6IEhhbW1lckluc3RhbmNlID0ge1xuICBvbjogKCkgPT4ge30sXG4gIG9mZjogKCkgPT4ge30sXG59O1xuXG4vKipcbiAqIEFkanVzdHMgY29uZmlndXJhdGlvbiBvZiBvdXIgZ2VzdHVyZSBsaWJyYXJ5LCBIYW1tZXIuXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBHZXN0dXJlQ29uZmlnIGV4dGVuZHMgSGFtbWVyR2VzdHVyZUNvbmZpZyB7XG4gIC8qKiBMaXN0IG9mIG5ldyBldmVudCBuYW1lcyB0byBhZGQgdG8gdGhlIGdlc3R1cmUgc3VwcG9ydCBsaXN0ICovXG4gIGV2ZW50cyA9IEFOR1VMQVJfTUFURVJJQUxfU1VQUE9SVEVEX0hBTU1FUl9HRVNUVVJFUztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9IQU1NRVJfT1BUSU9OUykgcHJpdmF0ZSBfaGFtbWVyT3B0aW9ucz86IEhhbW1lck9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgX2NvbW1vbk1vZHVsZT86IE1hdENvbW1vbk1vZHVsZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQnVpbGRzIEhhbW1lciBpbnN0YW5jZSBtYW51YWxseSB0byBhZGQgY3VzdG9tIHJlY29nbml6ZXJzIHRoYXQgbWF0Y2ggdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjLlxuICAgKlxuICAgKiBPdXIgZ2VzdHVyZSBuYW1lcyBjb21lIGZyb20gdGhlIE1hdGVyaWFsIERlc2lnbiBnZXN0dXJlcyBzcGVjOlxuICAgKiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi8jZ2VzdHVyZXMtdG91Y2gtbWVjaGFuaWNzXG4gICAqXG4gICAqIE1vcmUgaW5mb3JtYXRpb24gb24gZGVmYXVsdCByZWNvZ25pemVycyBjYW4gYmUgZm91bmQgaW4gSGFtbWVyIGRvY3M6XG4gICAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vcmVjb2duaXplci1wYW4vXG4gICAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vcmVjb2duaXplci1wcmVzcy9cbiAgICpcbiAgICogQHBhcmFtIGVsZW1lbnQgRWxlbWVudCB0byB3aGljaCB0byBhc3NpZ24gdGhlIG5ldyBIYW1tZXJKUyBnZXN0dXJlcy5cbiAgICogQHJldHVybnMgTmV3bHktY3JlYXRlZCBIYW1tZXJKUyBpbnN0YW5jZS5cbiAgICovXG4gIGJ1aWxkSGFtbWVyKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSGFtbWVySW5zdGFuY2Uge1xuICAgIGNvbnN0IGhhbW1lcjogSGFtbWVyU3RhdGljID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyAod2luZG93IGFzIGFueSkuSGFtbWVyIDogbnVsbDtcblxuICAgIGlmICghaGFtbWVyKSB7XG4gICAgICAvLyBJZiBIYW1tZXJKUyBpcyBub3QgbG9hZGVkIGhlcmUsIHJldHVybiB0aGUgbm9vcCBIYW1tZXJJbnN0YW5jZS4gVGhpcyBpcyBuZWNlc3NhcnkgdG9cbiAgICAgIC8vIGVuc3VyZSB0aGF0IG9taXR0aW5nIEhhbW1lckpTIGNvbXBsZXRlbHkgd2lsbCBub3QgY2F1c2UgYW55IGVycm9ycyB3aGlsZSAqYWxzbyogc3VwcG9ydGluZ1xuICAgICAgLy8gdGhlIGxhenktbG9hZGluZyBvZiBIYW1tZXJKUyB2aWEgdGhlIEhBTU1FUl9MT0FERVIgdG9rZW4gaW50cm9kdWNlZCBpbiBBbmd1bGFyIDYuMS5cbiAgICAgIC8vIEJlY2F1c2Ugd2UgY2FuJ3QgZGVwZW5kIG9uIEhBTU1FUl9MT0FERVIncyBleGlzdGFuY2UgdW50aWwgNy4wLCB3ZSBoYXZlIHRvIGFsd2F5cyBzZXRcbiAgICAgIC8vIGB0aGlzLmV2ZW50c2AgdG8gdGhlIHNldCB3ZSBzdXBwb3J0LCBpbnN0ZWFkIG9mIGNvbmRpdGlvbmFsbHkgc2V0dGluZyBpdCB0byBgW11gIGlmXG4gICAgICAvLyBgSEFNTUVSX0xPQURFUmAgaXMgcHJlc2VudCAoYW5kIHRoZW4gdGhyb3dpbmcgYW4gRXJyb3IgaGVyZSBpZiBgd2luZG93LkhhbW1lcmAgaXNcbiAgICAgIC8vIHVuZGVmaW5lZCkuXG4gICAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wXG4gICAgICByZXR1cm4gbm9vcEhhbW1lckluc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0IG1jID0gbmV3IGhhbW1lcihlbGVtZW50LCB0aGlzLl9oYW1tZXJPcHRpb25zIHx8IHVuZGVmaW5lZCk7XG5cbiAgICAvLyBEZWZhdWx0IEhhbW1lciBSZWNvZ25pemVycy5cbiAgICBjb25zdCBwYW4gPSBuZXcgaGFtbWVyLlBhbigpO1xuICAgIGNvbnN0IHN3aXBlID0gbmV3IGhhbW1lci5Td2lwZSgpO1xuICAgIGNvbnN0IHByZXNzID0gbmV3IGhhbW1lci5QcmVzcygpO1xuXG4gICAgLy8gTm90aWNlIHRoYXQgYSBIYW1tZXJKUyByZWNvZ25pemVyIGNhbiBvbmx5IGRlcGVuZCBvbiBvbmUgb3RoZXIgcmVjb2duaXplciBvbmNlLlxuICAgIC8vIE90aGVyd2lzZSB0aGUgcHJldmlvdXMgYHJlY29nbml6ZVdpdGhgIHdpbGwgYmUgZHJvcHBlZC5cbiAgICAvLyBUT0RPOiBDb25maXJtIHRocmVzaG9sZCBudW1iZXJzIHdpdGggTWF0ZXJpYWwgRGVzaWduIFVYIFRlYW1cbiAgICBjb25zdCBzbGlkZSA9IHRoaXMuX2NyZWF0ZVJlY29nbml6ZXIocGFuLCB7ZXZlbnQ6ICdzbGlkZScsIHRocmVzaG9sZDogMH0sIHN3aXBlKTtcbiAgICBjb25zdCBsb25ncHJlc3MgPSB0aGlzLl9jcmVhdGVSZWNvZ25pemVyKHByZXNzLCB7ZXZlbnQ6ICdsb25ncHJlc3MnLCB0aW1lOiA1MDB9KTtcblxuICAgIC8vIE92ZXJ3cml0ZSB0aGUgZGVmYXVsdCBgcGFuYCBldmVudCB0byB1c2UgdGhlIHN3aXBlIGV2ZW50LlxuICAgIHBhbi5yZWNvZ25pemVXaXRoKHN3aXBlKTtcblxuICAgIC8vIFNpbmNlIHRoZSBzbGlkZSBldmVudCB0aHJlc2hvbGQgaXMgc2V0IHRvIHplcm8sIHRoZSBzbGlkZSByZWNvZ25pemVyIGNhbiBmaXJlIGFuZFxuICAgIC8vIGFjY2lkZW50YWxseSByZXNldCB0aGUgbG9uZ3ByZXNzIHJlY29nbml6ZXIuIEluIG9yZGVyIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB0d29cbiAgICAvLyByZWNvZ25pemVycyBjYW4gcnVuIHNpbXVsdGFuZW91c2x5IGJ1dCBkb24ndCBhZmZlY3QgZWFjaCBvdGhlciwgd2UgYWxsb3cgdGhlIHNsaWRlXG4gICAgLy8gcmVjb2duaXplciB0byByZWNvZ25pemUgd2hpbGUgYSBsb25ncHJlc3MgaXMgYmVpbmcgcHJvY2Vzc2VkLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2hhbW1lcmpzL2hhbW1lci5qcy9ibG9iL21hc3Rlci9zcmMvbWFuYWdlci5qcyNMMTIzLUwxMjRcbiAgICBsb25ncHJlc3MucmVjb2duaXplV2l0aChzbGlkZSk7XG5cbiAgICAvLyBBZGQgY3VzdG9taXplZCBnZXN0dXJlcyB0byBIYW1tZXIgbWFuYWdlclxuICAgIG1jLmFkZChbc3dpcGUsIHByZXNzLCBwYW4sIHNsaWRlLCBsb25ncHJlc3NdKTtcblxuICAgIHJldHVybiBtYyBhcyBIYW1tZXJJbnN0YW5jZTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgbmV3IHJlY29nbml6ZXIsIHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBkZWZhdWx0IHJlY29nbml6ZXJzIG9mIEhhbW1lckpTICovXG4gIHByaXZhdGUgX2NyZWF0ZVJlY29nbml6ZXIoYmFzZTogUmVjb2duaXplciwgb3B0aW9uczogYW55LCAuLi5pbmhlcml0YW5jZXM6IFJlY29nbml6ZXJbXSkge1xuICAgIGxldCByZWNvZ25pemVyID0gbmV3IChiYXNlLmNvbnN0cnVjdG9yIGFzIFJlY29nbml6ZXJTdGF0aWMpKG9wdGlvbnMpO1xuXG4gICAgaW5oZXJpdGFuY2VzLnB1c2goYmFzZSk7XG4gICAgaW5oZXJpdGFuY2VzLmZvckVhY2goaXRlbSA9PiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbSkpO1xuXG4gICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gIH1cblxufVxuIl19