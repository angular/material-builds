/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatCommonModule, MatRippleModule } from '@angular/material/core';
import { MatAnchor, MatButton } from './button';
import { MatFabAnchor, MatFabButton, MatMiniFabAnchor, MatMiniFabButton } from './fab';
import { MatIconAnchor, MatIconButton } from './icon-button';
import * as i0 from "@angular/core";
class MatButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MatButtonModule, declarations: [MatAnchor,
            MatButton,
            MatIconAnchor,
            MatMiniFabAnchor,
            MatMiniFabButton,
            MatIconButton,
            MatFabAnchor,
            MatFabButton], imports: [MatCommonModule, MatRippleModule], exports: [MatAnchor,
            MatButton,
            MatIconAnchor,
            MatIconButton,
            MatMiniFabAnchor,
            MatMiniFabButton,
            MatFabAnchor,
            MatFabButton,
            MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonModule, imports: [MatCommonModule, MatRippleModule, MatCommonModule] }); }
}
export { MatButtonModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatRippleModule],
                    exports: [
                        MatAnchor,
                        MatButton,
                        MatIconAnchor,
                        MatIconButton,
                        MatMiniFabAnchor,
                        MatMiniFabButton,
                        MatFabAnchor,
                        MatFabButton,
                        MatCommonModule,
                    ],
                    declarations: [
                        MatAnchor,
                        MatButton,
                        MatIconAnchor,
                        MatMiniFabAnchor,
                        MatMiniFabButton,
                        MatIconButton,
                        MatFabAnchor,
                        MatFabButton,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUUzRCxNQXdCYSxlQUFlOzhHQUFmLGVBQWU7K0dBQWYsZUFBZSxpQkFWeEIsU0FBUztZQUNULFNBQVM7WUFDVCxhQUFhO1lBQ2IsZ0JBQWdCO1lBQ2hCLGdCQUFnQjtZQUNoQixhQUFhO1lBQ2IsWUFBWTtZQUNaLFlBQVksYUFwQkosZUFBZSxFQUFFLGVBQWUsYUFFeEMsU0FBUztZQUNULFNBQVM7WUFDVCxhQUFhO1lBQ2IsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQixnQkFBZ0I7WUFDaEIsWUFBWTtZQUNaLFlBQVk7WUFDWixlQUFlOytHQWFOLGVBQWUsWUF2QmhCLGVBQWUsRUFBRSxlQUFlLEVBVXhDLGVBQWU7O1NBYU4sZUFBZTsyRkFBZixlQUFlO2tCQXhCM0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDO29CQUMzQyxPQUFPLEVBQUU7d0JBQ1AsU0FBUzt3QkFDVCxTQUFTO3dCQUNULGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixnQkFBZ0I7d0JBQ2hCLGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixZQUFZO3dCQUNaLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRTt3QkFDWixTQUFTO3dCQUNULFNBQVM7d0JBQ1QsYUFBYTt3QkFDYixnQkFBZ0I7d0JBQ2hCLGdCQUFnQjt3QkFDaEIsYUFBYTt3QkFDYixZQUFZO3dCQUNaLFlBQVk7cUJBQ2I7aUJBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZSwgTWF0UmlwcGxlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7TWF0QW5jaG9yLCBNYXRCdXR0b259IGZyb20gJy4vYnV0dG9uJztcbmltcG9ydCB7TWF0RmFiQW5jaG9yLCBNYXRGYWJCdXR0b24sIE1hdE1pbmlGYWJBbmNob3IsIE1hdE1pbmlGYWJCdXR0b259IGZyb20gJy4vZmFiJztcbmltcG9ydCB7TWF0SWNvbkFuY2hvciwgTWF0SWNvbkJ1dHRvbn0gZnJvbSAnLi9pY29uLWJ1dHRvbic7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtNYXRDb21tb25Nb2R1bGUsIE1hdFJpcHBsZU1vZHVsZV0sXG4gIGV4cG9ydHM6IFtcbiAgICBNYXRBbmNob3IsXG4gICAgTWF0QnV0dG9uLFxuICAgIE1hdEljb25BbmNob3IsXG4gICAgTWF0SWNvbkJ1dHRvbixcbiAgICBNYXRNaW5pRmFiQW5jaG9yLFxuICAgIE1hdE1pbmlGYWJCdXR0b24sXG4gICAgTWF0RmFiQW5jaG9yLFxuICAgIE1hdEZhYkJ1dHRvbixcbiAgICBNYXRDb21tb25Nb2R1bGUsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE1hdEFuY2hvcixcbiAgICBNYXRCdXR0b24sXG4gICAgTWF0SWNvbkFuY2hvcixcbiAgICBNYXRNaW5pRmFiQW5jaG9yLFxuICAgIE1hdE1pbmlGYWJCdXR0b24sXG4gICAgTWF0SWNvbkJ1dHRvbixcbiAgICBNYXRGYWJBbmNob3IsXG4gICAgTWF0RmFiQnV0dG9uLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25Nb2R1bGUge31cbiJdfQ==