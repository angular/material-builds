/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { MatLineModule, MatCommonModule } from '@angular/material/core';
import { MatGridTile, MatGridTileText, MatGridTileFooterCssMatStyler, MatGridTileHeaderCssMatStyler, MatGridAvatarCssMatStyler } from './grid-tile';
import { MatGridList } from './grid-list';
let MatGridListModule = /** @class */ (() => {
    let MatGridListModule = class MatGridListModule {
    };
    MatGridListModule = __decorate([
        NgModule({
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
        })
    ], MatGridListModule);
    return MatGridListModule;
})();
export { MatGridListModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LW1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9ncmlkLWxpc3QvZ3JpZC1saXN0LW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsYUFBYSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RFLE9BQU8sRUFDTCxXQUFXLEVBQUUsZUFBZSxFQUFFLDZCQUE2QixFQUMzRCw2QkFBNkIsRUFBRSx5QkFBeUIsRUFDekQsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQXdCeEM7SUFBQSxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtLQUFHLENBQUE7SUFBcEIsaUJBQWlCO1FBckI3QixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDO1lBQ3pDLE9BQU8sRUFBRTtnQkFDUCxXQUFXO2dCQUNYLFdBQVc7Z0JBQ1gsZUFBZTtnQkFDZixhQUFhO2dCQUNiLGVBQWU7Z0JBQ2YsNkJBQTZCO2dCQUM3Qiw2QkFBNkI7Z0JBQzdCLHlCQUF5QjthQUMxQjtZQUNELFlBQVksRUFBRTtnQkFDWixXQUFXO2dCQUNYLFdBQVc7Z0JBQ1gsZUFBZTtnQkFDZiw2QkFBNkI7Z0JBQzdCLDZCQUE2QjtnQkFDN0IseUJBQXlCO2FBQzFCO1NBQ0YsQ0FBQztPQUNXLGlCQUFpQixDQUFHO0lBQUQsd0JBQUM7S0FBQTtTQUFwQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdExpbmVNb2R1bGUsIE1hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1xuICBNYXRHcmlkVGlsZSwgTWF0R3JpZFRpbGVUZXh0LCBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlcixcbiAgTWF0R3JpZFRpbGVIZWFkZXJDc3NNYXRTdHlsZXIsIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbn0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtNYXRHcmlkTGlzdH0gZnJvbSAnLi9ncmlkLWxpc3QnO1xuXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRMaW5lTW9kdWxlLCBNYXRDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdExpbmVNb2R1bGUsXG4gICAgTWF0Q29tbW9uTW9kdWxlLFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTWF0R3JpZExpc3QsXG4gICAgTWF0R3JpZFRpbGUsXG4gICAgTWF0R3JpZFRpbGVUZXh0LFxuICAgIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRUaWxlRm9vdGVyQ3NzTWF0U3R5bGVyLFxuICAgIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXJcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3RNb2R1bGUge31cbiJdfQ==