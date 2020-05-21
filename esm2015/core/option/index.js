/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '../ripple/index';
import { MatPseudoCheckboxModule } from '../selection/index';
import { MatOption } from './option';
import { MatOptgroup } from './optgroup';
let MatOptionModule = /** @class */ (() => {
    let MatOptionModule = class MatOptionModule {
    };
    MatOptionModule = __decorate([
        NgModule({
            imports: [MatRippleModule, CommonModule, MatPseudoCheckboxModule],
            exports: [MatOption, MatOptgroup],
            declarations: [MatOption, MatOptgroup]
        })
    ], MatOptionModule);
    return MatOptionModule;
})();
export { MatOptionModule };
export * from './option';
export * from './optgroup';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9vcHRpb24vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFRdkM7SUFBQSxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0tBQUcsQ0FBQTtJQUFsQixlQUFlO1FBTDNCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLENBQUM7WUFDakUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQztZQUNqQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDO1NBQ3ZDLENBQUM7T0FDVyxlQUFlLENBQUc7SUFBRCxzQkFBQztLQUFBO1NBQWxCLGVBQWU7QUFHNUIsY0FBYyxVQUFVLENBQUM7QUFDekIsY0FBYyxZQUFZLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TWF0UmlwcGxlTW9kdWxlfSBmcm9tICcuLi9yaXBwbGUvaW5kZXgnO1xuaW1wb3J0IHtNYXRQc2V1ZG9DaGVja2JveE1vZHVsZX0gZnJvbSAnLi4vc2VsZWN0aW9uL2luZGV4JztcbmltcG9ydCB7TWF0T3B0aW9ufSBmcm9tICcuL29wdGlvbic7XG5pbXBvcnQge01hdE9wdGdyb3VwfSBmcm9tICcuL29wdGdyb3VwJztcblxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0UmlwcGxlTW9kdWxlLCBDb21tb25Nb2R1bGUsIE1hdFBzZXVkb0NoZWNrYm94TW9kdWxlXSxcbiAgZXhwb3J0czogW01hdE9wdGlvbiwgTWF0T3B0Z3JvdXBdLFxuICBkZWNsYXJhdGlvbnM6IFtNYXRPcHRpb24sIE1hdE9wdGdyb3VwXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRPcHRpb25Nb2R1bGUge31cblxuXG5leHBvcnQgKiBmcm9tICcuL29wdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL29wdGdyb3VwJztcbiJdfQ==