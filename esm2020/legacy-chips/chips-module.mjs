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
export class MatLegacyChipsModule {
}
MatLegacyChipsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyChipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatLegacyChipsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyChipsModule, declarations: [MatLegacyChipList,
        MatLegacyChip,
        MatLegacyChipInput,
        MatLegacyChipRemove,
        MatLegacyChipAvatar,
        MatLegacyChipTrailingIcon], imports: [MatCommonModule], exports: [MatLegacyChipList,
        MatLegacyChip,
        MatLegacyChipInput,
        MatLegacyChipRemove,
        MatLegacyChipAvatar,
        MatLegacyChipTrailingIcon] });
MatLegacyChipsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyChipsModule, providers: [
        ErrorStateMatcher,
        {
            provide: MAT_LEGACY_CHIPS_DEFAULT_OPTIONS,
            useValue: {
                separatorKeyCodes: [ENTER],
            },
        },
    ], imports: [MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: MatLegacyChipsModule, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpcHMtbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1jaGlwcy9jaGlwcy1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsbUJBQW1CLEVBQ25CLG1CQUFtQixFQUNuQix5QkFBeUIsR0FDMUIsTUFBTSxRQUFRLENBQUM7QUFDaEIsT0FBTyxFQUNMLGdDQUFnQyxHQUVqQyxNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7O0FBRTlDLE1BQU0saUJBQWlCLEdBQUc7SUFDeEIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixrQkFBa0I7SUFDbEIsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQix5QkFBeUI7Q0FDMUIsQ0FBQztBQWdCRixNQUFNLE9BQU8sb0JBQW9COztpSEFBcEIsb0JBQW9CO2tIQUFwQixvQkFBb0IsaUJBdEIvQixpQkFBaUI7UUFDakIsYUFBYTtRQUNiLGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLHlCQUF5QixhQUlmLGVBQWUsYUFUekIsaUJBQWlCO1FBQ2pCLGFBQWE7UUFDYixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLG1CQUFtQjtRQUNuQix5QkFBeUI7a0hBaUJkLG9CQUFvQixhQVZwQjtRQUNULGlCQUFpQjtRQUNqQjtZQUNFLE9BQU8sRUFBRSxnQ0FBZ0M7WUFDekMsUUFBUSxFQUFFO2dCQUNSLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDO2FBQ0s7U0FDbEM7S0FDRixZQVhTLGVBQWU7MkZBYWQsb0JBQW9CO2tCQWRoQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztvQkFDMUIsT0FBTyxFQUFFLGlCQUFpQjtvQkFDMUIsWUFBWSxFQUFFLGlCQUFpQjtvQkFDL0IsU0FBUyxFQUFFO3dCQUNULGlCQUFpQjt3QkFDakI7NEJBQ0UsT0FBTyxFQUFFLGdDQUFnQzs0QkFDekMsUUFBUSxFQUFFO2dDQUNSLGlCQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDOzZCQUNLO3lCQUNsQztxQkFDRjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0VOVEVSfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Vycm9yU3RhdGVNYXRjaGVyLCBNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0TGVnYWN5Q2hpcCxcbiAgTWF0TGVnYWN5Q2hpcEF2YXRhcixcbiAgTWF0TGVnYWN5Q2hpcFJlbW92ZSxcbiAgTWF0TGVnYWN5Q2hpcFRyYWlsaW5nSWNvbixcbn0gZnJvbSAnLi9jaGlwJztcbmltcG9ydCB7XG4gIE1BVF9MRUdBQ1lfQ0hJUFNfREVGQVVMVF9PUFRJT05TLFxuICBNYXRMZWdhY3lDaGlwc0RlZmF1bHRPcHRpb25zLFxufSBmcm9tICcuL2NoaXAtZGVmYXVsdC1vcHRpb25zJztcbmltcG9ydCB7TWF0TGVnYWN5Q2hpcElucHV0fSBmcm9tICcuL2NoaXAtaW5wdXQnO1xuaW1wb3J0IHtNYXRMZWdhY3lDaGlwTGlzdH0gZnJvbSAnLi9jaGlwLWxpc3QnO1xuXG5jb25zdCBDSElQX0RFQ0xBUkFUSU9OUyA9IFtcbiAgTWF0TGVnYWN5Q2hpcExpc3QsXG4gIE1hdExlZ2FjeUNoaXAsXG4gIE1hdExlZ2FjeUNoaXBJbnB1dCxcbiAgTWF0TGVnYWN5Q2hpcFJlbW92ZSxcbiAgTWF0TGVnYWN5Q2hpcEF2YXRhcixcbiAgTWF0TGVnYWN5Q2hpcFRyYWlsaW5nSWNvbixcbl07XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBDSElQX0RFQ0xBUkFUSU9OUyxcbiAgZGVjbGFyYXRpb25zOiBDSElQX0RFQ0xBUkFUSU9OUyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgRXJyb3JTdGF0ZU1hdGNoZXIsXG4gICAge1xuICAgICAgcHJvdmlkZTogTUFUX0xFR0FDWV9DSElQU19ERUZBVUxUX09QVElPTlMsXG4gICAgICB1c2VWYWx1ZToge1xuICAgICAgICBzZXBhcmF0b3JLZXlDb2RlczogW0VOVEVSXSxcbiAgICAgIH0gYXMgTWF0TGVnYWN5Q2hpcHNEZWZhdWx0T3B0aW9ucyxcbiAgICB9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lDaGlwc01vZHVsZSB7fVxuIl19