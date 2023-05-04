/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ENTER } from '@angular/cdk/keycodes';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher, MatCommonModule } from '@angular/material/core';
import { MatLegacyChip, MatLegacyChipAvatar, MatLegacyChipRemove, MatLegacyChipTrailingIcon, } from './chip';
import { MAT_LEGACY_CHIPS_DEFAULT_OPTIONS, } from './chip-default-options';
import { MatLegacyChipInput } from './chip-input';
import { MatLegacyChipList } from './chip-list';
import * as i0 from "@angular/core";
const CHIP_DECLARATIONS = [
    MatLegacyChipList,
    MatLegacyChip,
    MatLegacyChipInput,
    MatLegacyChipRemove,
    MatLegacyChipAvatar,
    MatLegacyChipTrailingIcon,
];
/**
 * @deprecated Use `MatChipsModule` from `@angular/material/chips` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyChipsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipsModule, declarations: [MatLegacyChipList,
            MatLegacyChip,
            MatLegacyChipInput,
            MatLegacyChipRemove,
            MatLegacyChipAvatar,
            MatLegacyChipTrailingIcon], imports: [MatCommonModule], exports: [MatLegacyChipList,
            MatLegacyChip,
            MatLegacyChipInput,
            MatLegacyChipRemove,
            MatLegacyChipAvatar,
            MatLegacyChipTrailingIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipsModule, providers: [
            ErrorStateMatcher,
            {
                provide: MAT_LEGACY_CHIPS_DEFAULT_OPTIONS,
                useValue: {
                    separatorKeyCodes: [ENTER],
                },
            },
        ], imports: [MatCommonModule] }); }
}
export { MatLegacyChipsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyChipsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule],
                    exports: CHIP_DECLARATIONS,
                    declarations: CHIP_DECLARATIONS,
                    providers: [
                        ErrorStateMatcher,
                        {
                            provide: MAT_LEGACY_CHIPS_DEFAULT_OPTIONS,
                            useValue: {
                                separatorKeyCodes: [ENTER],
                            },
                        },
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jaGlwcy9jaGlwcy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQix5QkFBeUIsR0FDMUIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUNMLGdDQUFnQyxHQUVqQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7O0FBRTlDLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQix5QkFBeUI7Q0FDMUIsQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BY2Esb0JBQW9COzhHQUFwQixvQkFBb0I7K0dBQXBCLG9CQUFvQixpQkExQi9CLGlCQUFpQjtZQUNqQixhQUFhO1lBQ2Isa0JBQWtCO1lBQ2xCLG1CQUFtQjtZQUNuQixtQkFBbUI7WUFDbkIseUJBQXlCLGFBUWYsZUFBZSxhQWJ6QixpQkFBaUI7WUFDakIsYUFBYTtZQUNiLGtCQUFrQjtZQUNsQixtQkFBbUI7WUFDbkIsbUJBQW1CO1lBQ25CLHlCQUF5QjsrR0FxQmQsb0JBQW9CLGFBVnBCO1lBQ1QsaUJBQWlCO1lBQ2pCO2dCQUNFLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLFFBQVEsRUFBRTtvQkFDUixpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQztpQkFDSzthQUNsQztTQUNGLFlBWFMsZUFBZTs7U0FhZCxvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFkaEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7b0JBQzFCLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFlBQVksRUFBRSxpQkFBaUI7b0JBQy9CLFNBQVMsRUFBRTt3QkFDVCxpQkFBaUI7d0JBQ2pCOzRCQUNFLE9BQU8sRUFBRSxnQ0FBZ0M7NEJBQ3pDLFFBQVEsRUFBRTtnQ0FDUixpQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQzs2QkFDSzt5QkFDbEM7cUJBQ0Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFTlRFUn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtFcnJvclN0YXRlTWF0Y2hlciwgTWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7XG4gIE1hdExlZ2FjeUNoaXAsXG4gIE1hdExlZ2FjeUNoaXBBdmF0YXIsXG4gIE1hdExlZ2FjeUNoaXBSZW1vdmUsXG4gIE1hdExlZ2FjeUNoaXBUcmFpbGluZ0ljb24sXG59IGZyb20gJy4vY2hpcCc7XG5pbXBvcnQge1xuICBNQVRfTEVHQUNZX0NISVBTX0RFRkFVTFRfT1BUSU9OUyxcbiAgTWF0TGVnYWN5Q2hpcHNEZWZhdWx0T3B0aW9ucyxcbn0gZnJvbSAnLi9jaGlwLWRlZmF1bHQtb3B0aW9ucyc7XG5pbXBvcnQge01hdExlZ2FjeUNoaXBJbnB1dH0gZnJvbSAnLi9jaGlwLWlucHV0JztcbmltcG9ydCB7TWF0TGVnYWN5Q2hpcExpc3R9IGZyb20gJy4vY2hpcC1saXN0JztcblxuY29uc3QgQ0hJUF9ERUNMQVJBVElPTlMgPSBbXG4gIE1hdExlZ2FjeUNoaXBMaXN0LFxuICBNYXRMZWdhY3lDaGlwLFxuICBNYXRMZWdhY3lDaGlwSW5wdXQsXG4gIE1hdExlZ2FjeUNoaXBSZW1vdmUsXG4gIE1hdExlZ2FjeUNoaXBBdmF0YXIsXG4gIE1hdExlZ2FjeUNoaXBUcmFpbGluZ0ljb24sXG5dO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0Q2hpcHNNb2R1bGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL2NoaXBzYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBDSElQX0RFQ0xBUkFUSU9OUyxcbiAgZGVjbGFyYXRpb25zOiBDSElQX0RFQ0xBUkFUSU9OUyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAge1xuICAgICAgcHJvdmlkZTogTUFUX0xFR0FDWV9DSElQU19ERUZBVUxUX09QVElPTlMsXG4gICAgICB1c2VWYWx1ZToge1xuICAgICAgICBzZXBhcmF0b3JLZXlDb2RlczogW0VOVEVSXSxcbiAgICAgIH0gYXMgTWF0TGVnYWN5Q2hpcHNEZWZhdWx0T3B0aW9ucyxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDaGlwc01vZHVsZSB7fVxuIl19