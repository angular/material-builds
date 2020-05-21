/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
let MatTreeNodeToggle = /** @class */ (() => {
    var MatTreeNodeToggle_1;
    let MatTreeNodeToggle = MatTreeNodeToggle_1 = class MatTreeNodeToggle extends CdkTreeNodeToggle {
        constructor() {
            super(...arguments);
            this.recursive = false;
        }
    };
    __decorate([
        Input('matTreeNodeToggleRecursive'),
        __metadata("design:type", Boolean)
    ], MatTreeNodeToggle.prototype, "recursive", void 0);
    MatTreeNodeToggle = MatTreeNodeToggle_1 = __decorate([
        Directive({
            selector: '[matTreeNodeToggle]',
            providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle_1 }]
        })
    ], MatTreeNodeToggle);
    return MatTreeNodeToggle;
})();
export { MatTreeNodeToggle };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUvQzs7R0FFRztBQUtIOztJQUFBLElBQWEsaUJBQWlCLHlCQUE5QixNQUFhLGlCQUFxQixTQUFRLGlCQUFvQjtRQUE5RDs7WUFDdUMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUNsRSxDQUFDO0tBQUEsQ0FBQTtJQURzQztRQUFwQyxLQUFLLENBQUMsNEJBQTRCLENBQUM7O3dEQUE0QjtJQURyRCxpQkFBaUI7UUFKN0IsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsbUJBQWlCLEVBQUMsQ0FBQztTQUMxRSxDQUFDO09BQ1csaUJBQWlCLENBRTdCO0lBQUQsd0JBQUM7S0FBQTtTQUZZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nka1RyZWVOb2RlVG9nZ2xlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlJ3MgdG9nZ2xlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlVG9nZ2xlXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZVRvZ2dsZSwgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlVG9nZ2xlfV1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVUb2dnbGU8VD4gZXh0ZW5kcyBDZGtUcmVlTm9kZVRvZ2dsZTxUPiB7XG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVUb2dnbGVSZWN1cnNpdmUnKSByZWN1cnNpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbn1cbiJdfQ==