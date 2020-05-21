/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';
/** Button that moves to the next step in a stepper workflow. */
let MatStepperNext = /** @class */ (() => {
    let MatStepperNext = class MatStepperNext extends CdkStepperNext {
    };
    MatStepperNext = __decorate([
        Directive({
            selector: 'button[matStepperNext]',
            host: {
                '[type]': 'type',
            },
            inputs: ['type']
        })
    ], MatStepperNext);
    return MatStepperNext;
})();
export { MatStepperNext };
/** Button that moves to the previous step in a stepper workflow. */
let MatStepperPrevious = /** @class */ (() => {
    let MatStepperPrevious = class MatStepperPrevious extends CdkStepperPrevious {
    };
    MatStepperPrevious = __decorate([
        Directive({
            selector: 'button[matStepperPrevious]',
            host: {
                '[type]': 'type',
            },
            inputs: ['type']
        })
    ], MatStepperPrevious);
    return MatStepperPrevious;
})();
export { MatStepperPrevious };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFeEMsZ0VBQWdFO0FBUWhFO0lBQUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBZSxTQUFRLGNBQWM7S0FDakQsQ0FBQTtJQURZLGNBQWM7UUFQMUIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHdCQUF3QjtZQUNsQyxJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLE1BQU07YUFDakI7WUFDRCxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUM7U0FDakIsQ0FBQztPQUNXLGNBQWMsQ0FDMUI7SUFBRCxxQkFBQztLQUFBO1NBRFksY0FBYztBQUczQixvRUFBb0U7QUFRcEU7SUFBQSxJQUFhLGtCQUFrQixHQUEvQixNQUFhLGtCQUFtQixTQUFRLGtCQUFrQjtLQUN6RCxDQUFBO0lBRFksa0JBQWtCO1FBUDlCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSw0QkFBNEI7WUFDdEMsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxNQUFNO2FBQ2pCO1lBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQ2pCLENBQUM7T0FDVyxrQkFBa0IsQ0FDOUI7SUFBRCx5QkFBQztLQUFBO1NBRFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2RrU3RlcHBlck5leHQsIENka1N0ZXBwZXJQcmV2aW91c30gZnJvbSAnQGFuZ3VsYXIvY2RrL3N0ZXBwZXInO1xuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQnV0dG9uIHRoYXQgbW92ZXMgdG8gdGhlIG5leHQgc3RlcCBpbiBhIHN0ZXBwZXIgd29ya2Zsb3cuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bbWF0U3RlcHBlck5leHRdJyxcbiAgaG9zdDoge1xuICAgICdbdHlwZV0nOiAndHlwZScsXG4gIH0sXG4gIGlucHV0czogWyd0eXBlJ11cbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlck5leHQgZXh0ZW5kcyBDZGtTdGVwcGVyTmV4dCB7XG59XG5cbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgcHJldmlvdXMgc3RlcCBpbiBhIHN0ZXBwZXIgd29ya2Zsb3cuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bbWF0U3RlcHBlclByZXZpb3VzXScsXG4gIGhvc3Q6IHtcbiAgICAnW3R5cGVdJzogJ3R5cGUnLFxuICB9LFxuICBpbnB1dHM6IFsndHlwZSddXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJQcmV2aW91cyBleHRlbmRzIENka1N0ZXBwZXJQcmV2aW91cyB7XG59XG4iXX0=