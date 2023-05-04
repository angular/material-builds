/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage, } from './card';
import * as i0 from "@angular/core";
const CARD_DIRECTIVES = [
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardImage,
    MatCardLgImage,
    MatCardMdImage,
    MatCardSmImage,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    MatCardXlImage,
];
class MatCardModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatCardModule, declarations: [MatCard,
            MatCardActions,
            MatCardAvatar,
            MatCardContent,
            MatCardFooter,
            MatCardHeader,
            MatCardImage,
            MatCardLgImage,
            MatCardMdImage,
            MatCardSmImage,
            MatCardSubtitle,
            MatCardTitle,
            MatCardTitleGroup,
            MatCardXlImage], imports: [MatCommonModule, CommonModule], exports: [MatCard,
            MatCardActions,
            MatCardAvatar,
            MatCardContent,
            MatCardFooter,
            MatCardHeader,
            MatCardImage,
            MatCardLgImage,
            MatCardMdImage,
            MatCardSmImage,
            MatCardSubtitle,
            MatCardTitle,
            MatCardTitleGroup,
            MatCardXlImage, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCardModule, imports: [MatCommonModule, CommonModule, MatCommonModule] }); }
}
export { MatCardModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatCardModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, CommonModule],
                    exports: [CARD_DIRECTIVES, MatCommonModule],
                    declarations: CARD_DIRECTIVES,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2NhcmQvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQ0wsT0FBTyxFQUNQLGNBQWMsRUFDZCxhQUFhLEVBQ2IsY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQ2IsWUFBWSxFQUNaLGNBQWMsRUFDZCxjQUFjLEVBQ2QsY0FBYyxFQUNkLGVBQWUsRUFDZixZQUFZLEVBQ1osaUJBQWlCLEVBQ2pCLGNBQWMsR0FDZixNQUFNLFFBQVEsQ0FBQzs7QUFFaEIsTUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTztJQUNQLGNBQWM7SUFDZCxhQUFhO0lBQ2IsY0FBYztJQUNkLGFBQWE7SUFDYixhQUFhO0lBQ2IsWUFBWTtJQUNaLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGVBQWU7SUFDZixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLGNBQWM7Q0FDZixDQUFDO0FBRUYsTUFLYSxhQUFhOzhHQUFiLGFBQWE7K0dBQWIsYUFBYSxpQkFyQnhCLE9BQU87WUFDUCxjQUFjO1lBQ2QsYUFBYTtZQUNiLGNBQWM7WUFDZCxhQUFhO1lBQ2IsYUFBYTtZQUNiLFlBQVk7WUFDWixjQUFjO1lBQ2QsY0FBYztZQUNkLGNBQWM7WUFDZCxlQUFlO1lBQ2YsWUFBWTtZQUNaLGlCQUFpQjtZQUNqQixjQUFjLGFBSUosZUFBZSxFQUFFLFlBQVksYUFqQnZDLE9BQU87WUFDUCxjQUFjO1lBQ2QsYUFBYTtZQUNiLGNBQWM7WUFDZCxhQUFhO1lBQ2IsYUFBYTtZQUNiLFlBQVk7WUFDWixjQUFjO1lBQ2QsY0FBYztZQUNkLGNBQWM7WUFDZCxlQUFlO1lBQ2YsWUFBWTtZQUNaLGlCQUFpQjtZQUNqQixjQUFjLEVBS2EsZUFBZTsrR0FHL0IsYUFBYSxZQUpkLGVBQWUsRUFBRSxZQUFZLEVBQ1osZUFBZTs7U0FHL0IsYUFBYTsyRkFBYixhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUM7b0JBQ3hDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQzNDLFlBQVksRUFBRSxlQUFlO2lCQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtcbiAgTWF0Q2FyZCxcbiAgTWF0Q2FyZEFjdGlvbnMsXG4gIE1hdENhcmRBdmF0YXIsXG4gIE1hdENhcmRDb250ZW50LFxuICBNYXRDYXJkRm9vdGVyLFxuICBNYXRDYXJkSGVhZGVyLFxuICBNYXRDYXJkSW1hZ2UsXG4gIE1hdENhcmRMZ0ltYWdlLFxuICBNYXRDYXJkTWRJbWFnZSxcbiAgTWF0Q2FyZFNtSW1hZ2UsXG4gIE1hdENhcmRTdWJ0aXRsZSxcbiAgTWF0Q2FyZFRpdGxlLFxuICBNYXRDYXJkVGl0bGVHcm91cCxcbiAgTWF0Q2FyZFhsSW1hZ2UsXG59IGZyb20gJy4vY2FyZCc7XG5cbmNvbnN0IENBUkRfRElSRUNUSVZFUyA9IFtcbiAgTWF0Q2FyZCxcbiAgTWF0Q2FyZEFjdGlvbnMsXG4gIE1hdENhcmRBdmF0YXIsXG4gIE1hdENhcmRDb250ZW50LFxuICBNYXRDYXJkRm9vdGVyLFxuICBNYXRDYXJkSGVhZGVyLFxuICBNYXRDYXJkSW1hZ2UsXG4gIE1hdENhcmRMZ0ltYWdlLFxuICBNYXRDYXJkTWRJbWFnZSxcbiAgTWF0Q2FyZFNtSW1hZ2UsXG4gIE1hdENhcmRTdWJ0aXRsZSxcbiAgTWF0Q2FyZFRpdGxlLFxuICBNYXRDYXJkVGl0bGVHcm91cCxcbiAgTWF0Q2FyZFhsSW1hZ2UsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbQ0FSRF9ESVJFQ1RJVkVTLCBNYXRDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IENBUkRfRElSRUNUSVZFUyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0Q2FyZE1vZHVsZSB7fVxuIl19