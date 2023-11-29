/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ENTER } from '@angular/cdk/keycodes';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatChip } from './chip';
import { MAT_CHIPS_DEFAULT_OPTIONS } from './tokens';
import { MatChipEditInput } from './chip-edit-input';
import { MatChipGrid } from './chip-grid';
import { MatChipAvatar, MatChipRemove, MatChipTrailingIcon } from './chip-icons';
import { MatChipInput } from './chip-input';
import { MatChipListbox } from './chip-listbox';
import { MatChipRow } from './chip-row';
import { MatChipOption } from './chip-option';
import { MatChipSet } from './chip-set';
import { MatChipAction } from './chip-action';
import * as i0 from "@angular/core";
const CHIP_DECLARATIONS = [
    MatChip,
    MatChipAvatar,
    MatChipEditInput,
    MatChipGrid,
    MatChipInput,
    MatChipListbox,
    MatChipOption,
    MatChipRemove,
    MatChipRow,
    MatChipSet,
    MatChipTrailingIcon,
];
export class MatChipsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.4", ngImport: i0, type: MatChipsModule, declarations: [MatChipAction, MatChip,
            MatChipAvatar,
            MatChipEditInput,
            MatChipGrid,
            MatChipInput,
            MatChipListbox,
            MatChipOption,
            MatChipRemove,
            MatChipRow,
            MatChipSet,
            MatChipTrailingIcon], imports: [MatCommonModule, MatRippleModule], exports: [MatCommonModule, MatChip,
            MatChipAvatar,
            MatChipEditInput,
            MatChipGrid,
            MatChipInput,
            MatChipListbox,
            MatChipOption,
            MatChipRemove,
            MatChipRow,
            MatChipSet,
            MatChipTrailingIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatChipsModule, providers: [
            ErrorStateMatcher,
            {
                provide: MAT_CHIPS_DEFAULT_OPTIONS,
                useValue: {
                    separatorKeyCodes: [ENTER],
                },
            },
        ], imports: [MatCommonModule, MatRippleModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRippleModule],
                    exports: [MatCommonModule, CHIP_DECLARATIONS],
                    declarations: [MatChipAction, CHIP_DECLARATIONS],
                    providers: [
                        ErrorStateMatcher,
                        {
                            provide: MAT_CHIPS_DEFAULT_OPTIONS,
                            useValue: {
                                separatorKeyCodes: [ENTER],
                            },
                        },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NoaXBzL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzNGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFDLHlCQUF5QixFQUF5QixNQUFNLFVBQVUsQ0FBQztBQUMzRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRTVDLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsT0FBTztJQUNQLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsYUFBYTtJQUNiLGFBQWE7SUFDYixVQUFVO0lBQ1YsVUFBVTtJQUNWLG1CQUFtQjtDQUNwQixDQUFDO0FBZ0JGLE1BQU0sT0FBTyxjQUFjOzhHQUFkLGNBQWM7K0dBQWQsY0FBYyxpQkFYVixhQUFhLEVBaEI1QixPQUFPO1lBQ1AsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsWUFBWTtZQUNaLGNBQWM7WUFDZCxhQUFhO1lBQ2IsYUFBYTtZQUNiLFVBQVU7WUFDVixVQUFVO1lBQ1YsbUJBQW1CLGFBSVQsZUFBZSxFQUFFLGVBQWUsYUFDaEMsZUFBZSxFQWZ6QixPQUFPO1lBQ1AsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsWUFBWTtZQUNaLGNBQWM7WUFDZCxhQUFhO1lBQ2IsYUFBYTtZQUNiLFVBQVU7WUFDVixVQUFVO1lBQ1YsbUJBQW1COytHQWlCUixjQUFjLGFBVmQ7WUFDVCxpQkFBaUI7WUFDakI7Z0JBQ0UsT0FBTyxFQUFFLHlCQUF5QjtnQkFDbEMsUUFBUSxFQUFFO29CQUNSLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDO2lCQUNEO2FBQzVCO1NBQ0YsWUFYUyxlQUFlLEVBQUUsZUFBZSxFQUNoQyxlQUFlOzsyRkFZZCxjQUFjO2tCQWQxQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQzNDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztvQkFDN0MsWUFBWSxFQUFFLENBQUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDO29CQUNoRCxTQUFTLEVBQUU7d0JBQ1QsaUJBQWlCO3dCQUNqQjs0QkFDRSxPQUFPLEVBQUUseUJBQXlCOzRCQUNsQyxRQUFRLEVBQUU7Z0NBQ1IsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUM7NkJBQ0Q7eUJBQzVCO3FCQUNGO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RU5URVJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RXJyb3JTdGF0ZU1hdGNoZXIsIE1hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0Q2hpcH0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7TUFUX0NISVBTX0RFRkFVTFRfT1BUSU9OUywgTWF0Q2hpcHNEZWZhdWx0T3B0aW9uc30gZnJvbSAnLi90b2tlbnMnO1xuaW1wb3J0IHtNYXRDaGlwRWRpdElucHV0fSBmcm9tICcuL2NoaXAtZWRpdC1pbnB1dCc7XG5pbXBvcnQge01hdENoaXBHcmlkfSBmcm9tICcuL2NoaXAtZ3JpZCc7XG5pbXBvcnQge01hdENoaXBBdmF0YXIsIE1hdENoaXBSZW1vdmUsIE1hdENoaXBUcmFpbGluZ0ljb259IGZyb20gJy4vY2hpcC1pY29ucyc7XG5pbXBvcnQge01hdENoaXBJbnB1dH0gZnJvbSAnLi9jaGlwLWlucHV0JztcbmltcG9ydCB7TWF0Q2hpcExpc3Rib3h9IGZyb20gJy4vY2hpcC1saXN0Ym94JztcbmltcG9ydCB7TWF0Q2hpcFJvd30gZnJvbSAnLi9jaGlwLXJvdyc7XG5pbXBvcnQge01hdENoaXBPcHRpb259IGZyb20gJy4vY2hpcC1vcHRpb24nO1xuaW1wb3J0IHtNYXRDaGlwU2V0fSBmcm9tICcuL2NoaXAtc2V0JztcbmltcG9ydCB7TWF0Q2hpcEFjdGlvbn0gZnJvbSAnLi9jaGlwLWFjdGlvbic7XG5cbmNvbnN0IENISVBfREVDTEFSQVRJT05TID0gW1xuICBNYXRDaGlwLFxuICBNYXRDaGlwQXZhdGFyLFxuICBNYXRDaGlwRWRpdElucHV0LFxuICBNYXRDaGlwR3JpZCxcbiAgTWF0Q2hpcElucHV0LFxuICBNYXRDaGlwTGlzdGJveCxcbiAgTWF0Q2hpcE9wdGlvbixcbiAgTWF0Q2hpcFJlbW92ZSxcbiAgTWF0Q2hpcFJvdyxcbiAgTWF0Q2hpcFNldCxcbiAgTWF0Q2hpcFRyYWlsaW5nSWNvbixcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIENISVBfREVDTEFSQVRJT05TXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0Q2hpcEFjdGlvbiwgQ0hJUF9ERUNMQVJBVElPTlNdLFxuICBwcm92aWRlcnM6IFtcbiAgICBFcnJvclN0YXRlTWF0Y2hlcixcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxuICAgICAgdXNlVmFsdWU6IHtcbiAgICAgICAgc2VwYXJhdG9yS2V5Q29kZXM6IFtFTlRFUl0sXG4gICAgICB9IGFzIE1hdENoaXBzRGVmYXVsdE9wdGlvbnMsXG4gICAgfSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2hpcHNNb2R1bGUge31cbiJdfQ==