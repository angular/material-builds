/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatLineModule, MatCommonModule } from '@angular/material/core';
import { MatGridTile, MatGridTileText, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridAvatarCssMatStyler } from './grid-tile';
import { MatGridList } from './grid-list';
export class MatGridListModule {
}
MatGridListModule.decorators = [
    { type: NgModule, args: [{
                imports: [MatLineModule, MatCommonModule],
                exports: [
                    MatGridList,
                    MatGridTile,
                    MatGridTileText,
                    MatLineModule,
                    MatCommonModule,
                    MatGridTileHeaderCssMatStyler,
                    MatGridTileFooterCssMatStyler,
                    MatGridAvatarCssMatStyler
                ],
                declarations: [
                    MatGridList,
                    MatGridTile,
                    MatGridTileText,
                    MatGridTileHeaderCssMatStyler,
                    MatGridTileFooterCssMatStyler,
                    MatGridAvatarCssMatStyler
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvZ3JpZC1saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN0RSxPQUFPLEVBQ0wsV0FBVyxFQUFFLGVBQWUsRUFBRSw2QkFBNkIsRUFDM0QsNkJBQTZCLEVBQUUseUJBQXlCLEVBQ3pELE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUF3QnhDLE1BQU0sT0FBTyxpQkFBaUI7OztZQXJCN0IsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUM7Z0JBQ3pDLE9BQU8sRUFBRTtvQkFDUCxXQUFXO29CQUNYLFdBQVc7b0JBQ1gsZUFBZTtvQkFDZixhQUFhO29CQUNiLGVBQWU7b0JBQ2YsNkJBQTZCO29CQUM3Qiw2QkFBNkI7b0JBQzdCLHlCQUF5QjtpQkFDMUI7Z0JBQ0QsWUFBWSxFQUFFO29CQUNaLFdBQVc7b0JBQ1gsV0FBVztvQkFDWCxlQUFlO29CQUNmLDZCQUE2QjtvQkFDN0IsNkJBQTZCO29CQUM3Qix5QkFBeUI7aUJBQzFCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdExpbmVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNYXRHcmlkVGlsZSwgTWF0R3JpZFRpbGVUZXh0LCBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlcixcbiAgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIsIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbn0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtNYXRHcmlkTGlzdH0gZnJvbSAnLi9ncmlkLWxpc3QnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRMaW5lTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdExpbmVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3RNb2R1bGUge31cbiJdfQ==