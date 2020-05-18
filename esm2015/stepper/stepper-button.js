/**
 * @fileoverview added by tsickle
 * Generated from: src/material/stepper/stepper-button.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';
/**
 * Button that moves to the next step in a stepper workflow.
 */
let MatStepperNext = /** @class */ (() => {
    /**
     * Button that moves to the next step in a stepper workflow.
     */
    class MatStepperNext extends CdkStepperNext {
    }
    MatStepperNext.decorators = [
        { type: Directive, args: [{
                    selector: 'button[matStepperNext]',
                    host: {
                        '[type]': 'type',
                    },
                    inputs: ['type']
                },] }
    ];
    return MatStepperNext;
})();
export { MatStepperNext };
/**
 * Button that moves to the previous step in a stepper workflow.
 */
let MatStepperPrevious = /** @class */ (() => {
    /**
     * Button that moves to the previous step in a stepper workflow.
     */
    class MatStepperPrevious extends CdkStepperPrevious {
    }
    MatStepperPrevious.decorators = [
        { type: Directive, args: [{
                    selector: 'button[matStepperPrevious]',
                    host: {
                        '[type]': 'type',
                    },
                    inputs: ['type']
                },] }
    ];
    return MatStepperPrevious;
})();
export { MatStepperPrevious };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7OztBQUd4Qzs7OztJQUFBLE1BT2EsY0FBZSxTQUFRLGNBQWM7OztnQkFQakQsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLElBQUksRUFBRTt3QkFDSixRQUFRLEVBQUUsTUFBTTtxQkFDakI7b0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNqQjs7SUFFRCxxQkFBQztLQUFBO1NBRFksY0FBYzs7OztBQUkzQjs7OztJQUFBLE1BT2Esa0JBQW1CLFNBQVEsa0JBQWtCOzs7Z0JBUHpELFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osUUFBUSxFQUFFLE1BQU07cUJBQ2pCO29CQUNELE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDakI7O0lBRUQseUJBQUM7S0FBQTtTQURZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1N0ZXBwZXJOZXh0LCBDZGtTdGVwcGVyUHJldmlvdXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zdGVwcGVyJztcbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqIEJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBuZXh0IHN0ZXAgaW4gYSBzdGVwcGVyIHdvcmtmbG93LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYnV0dG9uW21hdFN0ZXBwZXJOZXh0XScsXG4gIGhvc3Q6IHtcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICB9LFxuICBpbnB1dHM6IFsndHlwZSddXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJOZXh0IGV4dGVuZHMgQ2RrU3RlcHBlck5leHQge1xufVxuXG4vKiogQnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIHByZXZpb3VzIHN0ZXAgaW4gYSBzdGVwcGVyIHdvcmtmbG93LiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYnV0dG9uW21hdFN0ZXBwZXJQcmV2aW91c10nLFxuICBob3N0OiB7XG4gICAgJ1t0eXBlXSc6ICd0eXBlJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ3R5cGUnXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVyUHJldmlvdXMgZXh0ZW5kcyBDZGtTdGVwcGVyUHJldmlvdXMge1xufVxuIl19