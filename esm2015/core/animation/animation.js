/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/animation/animation.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@docs-private
 */
let AnimationCurves = /** @class */ (() => {
    /**
     * \@docs-private
     */
    class AnimationCurves {
    }
    AnimationCurves.STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
    AnimationCurves.DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
    AnimationCurves.ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
    AnimationCurves.SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
    return AnimationCurves;
})();
export { AnimationCurves };
if (false) {
    /** @type {?} */
    AnimationCurves.STANDARD_CURVE;
    /** @type {?} */
    AnimationCurves.DECELERATION_CURVE;
    /** @type {?} */
    AnimationCurves.ACCELERATION_CURVE;
    /** @type {?} */
    AnimationCurves.SHARP_CURVE;
}
/**
 * \@docs-private
 */
let AnimationDurations = /** @class */ (() => {
    /**
     * \@docs-private
     */
    class AnimationDurations {
    }
    AnimationDurations.COMPLEX = '375ms';
    AnimationDurations.ENTERING = '225ms';
    AnimationDurations.EXITING = '195ms';
    return AnimationDurations;
})();
export { AnimationDurations };
if (false) {
    /** @type {?} */
    AnimationDurations.COMPLEX;
    /** @type {?} */
    AnimationDurations.ENTERING;
    /** @type {?} */
    AnimationDurations.EXITING;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFTQTs7OztJQUFBLE1BQWEsZUFBZTs7SUFDbkIsOEJBQWMsR0FBRyw2QkFBNkIsQ0FBQztJQUMvQyxrQ0FBa0IsR0FBRyw2QkFBNkIsQ0FBQztJQUNuRCxrQ0FBa0IsR0FBRywyQkFBMkIsQ0FBQztJQUNqRCwyQkFBVyxHQUFHLDZCQUE2QixDQUFDO0lBQ3JELHNCQUFDO0tBQUE7U0FMWSxlQUFlOzs7SUFDMUIsK0JBQXNEOztJQUN0RCxtQ0FBMEQ7O0lBQzFELG1DQUF3RDs7SUFDeEQsNEJBQW1EOzs7OztBQUtyRDs7OztJQUFBLE1BQWEsa0JBQWtCOztJQUN0QiwwQkFBTyxHQUFHLE9BQU8sQ0FBQztJQUNsQiwyQkFBUSxHQUFHLE9BQU8sQ0FBQztJQUNuQiwwQkFBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQix5QkFBQztLQUFBO1NBSlksa0JBQWtCOzs7SUFDN0IsMkJBQXlCOztJQUN6Qiw0QkFBMEI7O0lBQzFCLDJCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkN1cnZlcyB7XG4gIHN0YXRpYyBTVEFOREFSRF9DVVJWRSA9ICdjdWJpYy1iZXppZXIoMC40LDAuMCwwLjIsMSknO1xuICBzdGF0aWMgREVDRUxFUkFUSU9OX0NVUlZFID0gJ2N1YmljLWJlemllcigwLjAsMC4wLDAuMiwxKSc7XG4gIHN0YXRpYyBBQ0NFTEVSQVRJT05fQ1VSVkUgPSAnY3ViaWMtYmV6aWVyKDAuNCwwLjAsMSwxKSc7XG4gIHN0YXRpYyBTSEFSUF9DVVJWRSA9ICdjdWJpYy1iZXppZXIoMC40LDAuMCwwLjYsMSknO1xufVxuXG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uRHVyYXRpb25zIHtcbiAgc3RhdGljIENPTVBMRVggPSAnMzc1bXMnO1xuICBzdGF0aWMgRU5URVJJTkcgPSAnMjI1bXMnO1xuICBzdGF0aWMgRVhJVElORyA9ICcxOTVtcyc7XG59XG4iXX0=