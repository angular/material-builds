/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatError } from './error';
import { MatFormField } from './form-field';
import { MatHint } from './hint';
import { MatLabel } from './label';
import { MatPlaceholder } from './placeholder';
import { MatPrefix } from './prefix';
import { MatSuffix } from './suffix';
import * as i0 from "@angular/core";
export class MatFormFieldModule {
}
MatFormFieldModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatFormFieldModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatFormFieldModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatFormFieldModule, declarations: [MatError,
        MatFormField,
        MatHint,
        MatLabel,
        MatPlaceholder,
        MatPrefix,
        MatSuffix], imports: [CommonModule,
        MatCommonModule,
        ObserversModule], exports: [MatCommonModule,
        MatError,
        MatFormField,
        MatHint,
        MatLabel,
        MatPlaceholder,
        MatPrefix,
        MatSuffix] });
MatFormFieldModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatFormFieldModule, imports: [[
            CommonModule,
            MatCommonModule,
            ObserversModule,
        ], MatCommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatFormFieldModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MatError,
                        MatFormField,
                        MatHint,
                        MatLabel,
                        MatPlaceholder,
                        MatPrefix,
                        MatSuffix,
                    ],
                    imports: [
                        CommonModule,
                        MatCommonModule,
                        ObserversModule,
                    ],
                    exports: [
                        MatCommonModule,
                        MatError,
                        MatFormField,
                        MatHint,
                        MatLabel,
                        MatPlaceholder,
                        MatPrefix,
                        MatSuffix,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS1maWVsZC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZm9ybS1maWVsZC9mb3JtLWZpZWxkLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBNEJuQyxNQUFNLE9BQU8sa0JBQWtCOzt1SEFBbEIsa0JBQWtCO3dIQUFsQixrQkFBa0IsaUJBeEIzQixRQUFRO1FBQ1IsWUFBWTtRQUNaLE9BQU87UUFDUCxRQUFRO1FBQ1IsY0FBYztRQUNkLFNBQVM7UUFDVCxTQUFTLGFBR1QsWUFBWTtRQUNaLGVBQWU7UUFDZixlQUFlLGFBR2YsZUFBZTtRQUNmLFFBQVE7UUFDUixZQUFZO1FBQ1osT0FBTztRQUNQLFFBQVE7UUFDUixjQUFjO1FBQ2QsU0FBUztRQUNULFNBQVM7d0hBR0Esa0JBQWtCLFlBaEJwQjtZQUNQLFlBQVk7WUFDWixlQUFlO1lBQ2YsZUFBZTtTQUNoQixFQUVDLGVBQWU7bUdBVU4sa0JBQWtCO2tCQTFCOUIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osUUFBUTt3QkFDUixZQUFZO3dCQUNaLE9BQU87d0JBQ1AsUUFBUTt3QkFDUixjQUFjO3dCQUNkLFNBQVM7d0JBQ1QsU0FBUztxQkFDVjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsWUFBWTt3QkFDWixlQUFlO3dCQUNmLGVBQWU7cUJBQ2hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3dCQUNmLFFBQVE7d0JBQ1IsWUFBWTt3QkFDWixPQUFPO3dCQUNQLFFBQVE7d0JBQ1IsY0FBYzt3QkFDZCxTQUFTO3dCQUNULFNBQVM7cUJBQ1Y7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZlcnNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0RXJyb3J9IGZyb20gJy4vZXJyb3InO1xuaW1wb3J0IHtNYXRGb3JtRmllbGR9IGZyb20gJy4vZm9ybS1maWVsZCc7XG5pbXBvcnQge01hdEhpbnR9IGZyb20gJy4vaGludCc7XG5pbXBvcnQge01hdExhYmVsfSBmcm9tICcuL2xhYmVsJztcbmltcG9ydCB7TWF0UGxhY2Vob2xkZXJ9IGZyb20gJy4vcGxhY2Vob2xkZXInO1xuaW1wb3J0IHtNYXRQcmVmaXh9IGZyb20gJy4vcHJlZml4JztcbmltcG9ydCB7TWF0U3VmZml4fSBmcm9tICcuL3N1ZmZpeCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdEVycm9yLFxuICAgIE1hdEZvcm1GaWVsZCxcbiAgICBNYXRIaW50LFxuICAgIE1hdExhYmVsLFxuICAgIE1hdFBsYWNlaG9sZGVyLFxuICAgIE1hdFByZWZpeCxcbiAgICBNYXRTdWZmaXgsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE9ic2VydmVyc01vZHVsZSxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIE1hdENvbW1vbk1vZHVsZSxcbiAgICBNYXRFcnJvcixcbiAgICBNYXRGb3JtRmllbGQsXG4gICAgTWF0SGludCxcbiAgICBNYXRMYWJlbCxcbiAgICBNYXRQbGFjZWhvbGRlcixcbiAgICBNYXRQcmVmaXgsXG4gICAgTWF0U3VmZml4LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRGb3JtRmllbGRNb2R1bGUge31cbiJdfQ==