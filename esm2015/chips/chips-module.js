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
import { ENTER } from '@angular/cdk/keycodes';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatChip, MatChipAvatar, MatChipRemove, MatChipTrailingIcon } from './chip';
import { MAT_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import { MatChipInput } from './chip-input';
import { MatChipList } from './chip-list';
/** @type {?} */
const CHIP_DECLARATIONS = [
    MatChipList,
    MatChip,
    MatChipInput,
    MatChipRemove,
    MatChipAvatar,
    MatChipTrailingIcon,
];
const ɵ0 = ({
    separatorKeyCodes: [ENTER]
});
export class MatChipsModule {
}
MatChipsModule.decorators = [
    { type: NgModule, args: [{
                exports: CHIP_DECLARATIONS,
                declarations: CHIP_DECLARATIONS,
                providers: [
                    ErrorStateMatcher,
                    {
                        provide: MAT_CHIPS_DEFAULT_OPTIONS,
                        useValue: (/** @type {?} */ (ɵ0))
                    }
                ]
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL2NoaXBzLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUNsRixPQUFPLEVBQUMseUJBQXlCLEVBQXlCLE1BQU0sd0JBQXdCLENBQUM7QUFDekYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDOztNQUVsQyxpQkFBaUIsR0FBRztJQUN4QixXQUFXO0lBQ1gsT0FBTztJQUNQLFlBQVk7SUFDWixhQUFhO0lBQ2IsYUFBYTtJQUNiLG1CQUFtQjtDQUNwQjtXQVNlLENBQUE7SUFDUixpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUMzQixDQUEwQjtBQUlqQyxNQUFNLE9BQU8sY0FBYzs7O1lBYjFCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsaUJBQWlCO2dCQUMxQixZQUFZLEVBQUUsaUJBQWlCO2dCQUMvQixTQUFTLEVBQUU7b0JBQ1QsaUJBQWlCO29CQUNqQjt3QkFDRSxPQUFPLEVBQUUseUJBQXlCO3dCQUNsQyxRQUFRLEVBQUUsdUJBRWlCO3FCQUM1QjtpQkFDRjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RU5URVJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRDaGlwLCBNYXRDaGlwQXZhdGFyLCBNYXRDaGlwUmVtb3ZlLCBNYXRDaGlwVHJhaWxpbmdJY29ufSBmcm9tICcuL2NoaXAnO1xuaW1wb3J0IHtNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TLCBNYXRDaGlwc0RlZmF1bHRPcHRpb25zfSBmcm9tICcuL2NoaXAtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7TWF0Q2hpcElucHV0fSBmcm9tICcuL2NoaXAtaW5wdXQnO1xuaW1wb3J0IHtNYXRDaGlwTGlzdH0gZnJvbSAnLi9jaGlwLWxpc3QnO1xuXG5jb25zdCBDSElQX0RFQ0xBUkFUSU9OUyA9IFtcbiAgTWF0Q2hpcExpc3QsXG4gIE1hdENoaXAsXG4gIE1hdENoaXBJbnB1dCxcbiAgTWF0Q2hpcFJlbW92ZSxcbiAgTWF0Q2hpcEF2YXRhcixcbiAgTWF0Q2hpcFRyYWlsaW5nSWNvbixcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGV4cG9ydHM6IENISVBfREVDTEFSQVRJT05TLFxuICBkZWNsYXJhdGlvbnM6IENISVBfREVDTEFSQVRJT05TLFxuICBwcm92aWRlcnM6IFtcbiAgICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxuICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAgc2VwYXJhdG9yS2V5Q29kZXM6IFtFTlRFUl1cbiAgICAgIH0gYXMgTWF0Q2hpcHNEZWZhdWx0T3B0aW9uc1xuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRDaGlwc01vZHVsZSB7fVxuIl19