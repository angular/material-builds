/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatMenuItem as BaseMatMenuItem } from '@angular/material/menu';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/core";
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 * @deprecated Use `MatMenuItem` from `@angular/material/menu` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacyMenuItem extends BaseMatMenuItem {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacyMenuItem, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatLegacyMenuItem, selector: "[mat-menu-item]", inputs: { disabled: "disabled", disableRipple: "disableRipple" }, host: { properties: { "attr.role": "role", "class.mat-menu-item": "true", "class.mat-menu-item-highlighted": "_highlighted", "class.mat-menu-item-submenu-trigger": "_triggersSubmenu", "attr.tabindex": "_getTabIndex()", "attr.aria-disabled": "disabled.toString()", "attr.disabled": "disabled || null", "class.mat-mdc-menu-item": "false", "class.mat-mdc-focus-indicator": "false", "class.mdc-list-item": "false", "class.mat-mdc-menu-item-highlighted": "false", "class.mat-mdc-menu-item-submenu-trigger": "false" }, classAttribute: "mat-focus-indicator" }, providers: [{ provide: BaseMatMenuItem, useExisting: MatLegacyMenuItem }], exportAs: ["matMenuItem"], usesInheritance: true, ngImport: i0, template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n", dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacyMenuItem, decorators: [{
            type: Component,
            args: [{ selector: '[mat-menu-item]', exportAs: 'matMenuItem', inputs: ['disabled', 'disableRipple'], host: {
                        '[attr.role]': 'role',
                        '[class.mat-menu-item]': 'true',
                        '[class.mat-menu-item-highlighted]': '_highlighted',
                        '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.disabled]': 'disabled || null',
                        'class': 'mat-focus-indicator',
                        // Classes added by the base class that should be removed.
                        '[class.mat-mdc-menu-item]': 'false',
                        '[class.mat-mdc-focus-indicator]': 'false',
                        '[class.mdc-list-item]': 'false',
                        '[class.mat-mdc-menu-item-highlighted]': 'false',
                        '[class.mat-mdc-menu-item-submenu-trigger]': 'false',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: BaseMatMenuItem, useExisting: MatLegacyMenuItem }], template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n\n<svg\n  *ngIf=\"_triggersSubmenu\"\n  class=\"mat-menu-submenu-icon\"\n  viewBox=\"0 0 5 10\"\n  focusable=\"false\"\n  aria-hidden=\"true\"><polygon points=\"0,0 5,5 0,10\"/></svg>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1tZW51L21lbnUtaXRlbS50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktbWVudS9tZW51LWl0ZW0uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxXQUFXLElBQUksZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7Ozs7QUFFdEU7Ozs7R0FJRztBQTJCSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZUFBZTs4R0FBekMsaUJBQWlCO2tHQUFqQixpQkFBaUIsc3BCQUZqQixDQUFDLEVBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyw0RUN4Q3pFLGdYQVlBOzsyRkQ4QmEsaUJBQWlCO2tCQTFCN0IsU0FBUzsrQkFDRSxpQkFBaUIsWUFDakIsYUFBYSxVQUNmLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxRQUMvQjt3QkFDSixhQUFhLEVBQUUsTUFBTTt3QkFDckIsdUJBQXVCLEVBQUUsTUFBTTt3QkFDL0IsbUNBQW1DLEVBQUUsY0FBYzt3QkFDbkQsdUNBQXVDLEVBQUUsa0JBQWtCO3dCQUMzRCxpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLHNCQUFzQixFQUFFLHFCQUFxQjt3QkFDN0MsaUJBQWlCLEVBQUUsa0JBQWtCO3dCQUNyQyxPQUFPLEVBQUUscUJBQXFCO3dCQUU5QiwwREFBMEQ7d0JBQzFELDJCQUEyQixFQUFFLE9BQU87d0JBQ3BDLGlDQUFpQyxFQUFFLE9BQU87d0JBQzFDLHVCQUF1QixFQUFFLE9BQU87d0JBQ2hDLHVDQUF1QyxFQUFFLE9BQU87d0JBQ2hELDJDQUEyQyxFQUFFLE9BQU87cUJBQ3JELG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLGFBRTFCLENBQUMsRUFBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFdBQVcsbUJBQW1CLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0TWVudUl0ZW0gYXMgQmFzZU1hdE1lbnVJdGVtfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcblxuLyoqXG4gKiBTaW5nbGUgaXRlbSBpbnNpZGUgb2YgYSBgbWF0LW1lbnVgLiBQcm92aWRlcyB0aGUgbWVudSBpdGVtIHN0eWxpbmcgYW5kIGFjY2Vzc2liaWxpdHkgdHJlYXRtZW50LlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRNZW51SXRlbWAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LW1lbnUtaXRlbV0nLFxuICBleHBvcnRBczogJ21hdE1lbnVJdGVtJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdbYXR0ci5yb2xlXSc6ICdyb2xlJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW1dJzogJ3RydWUnLFxuICAgICdbY2xhc3MubWF0LW1lbnUtaXRlbS1oaWdobGlnaHRlZF0nOiAnX2hpZ2hsaWdodGVkJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW0tc3VibWVudS10cmlnZ2VyXSc6ICdfdHJpZ2dlcnNTdWJtZW51JyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ19nZXRUYWJJbmRleCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnY2xhc3MnOiAnbWF0LWZvY3VzLWluZGljYXRvcicsXG5cbiAgICAvLyBDbGFzc2VzIGFkZGVkIGJ5IHRoZSBiYXNlIGNsYXNzIHRoYXQgc2hvdWxkIGJlIHJlbW92ZWQuXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW1lbnUtaXRlbV0nOiAnZmFsc2UnLFxuICAgICdbY2xhc3MubWF0LW1kYy1mb2N1cy1pbmRpY2F0b3JdJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1kYy1saXN0LWl0ZW1dJzogJ2ZhbHNlJyxcbiAgICAnW2NsYXNzLm1hdC1tZGMtbWVudS1pdGVtLWhpZ2hsaWdodGVkXSc6ICdmYWxzZScsXG4gICAgJ1tjbGFzcy5tYXQtbWRjLW1lbnUtaXRlbS1zdWJtZW51LXRyaWdnZXJdJzogJ2ZhbHNlJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlVXJsOiAnbWVudS1pdGVtLmh0bWwnLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQmFzZU1hdE1lbnVJdGVtLCB1c2VFeGlzdGluZzogTWF0TGVnYWN5TWVudUl0ZW19XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5TWVudUl0ZW0gZXh0ZW5kcyBCYXNlTWF0TWVudUl0ZW0ge31cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjxkaXYgY2xhc3M9XCJtYXQtbWVudS1yaXBwbGVcIiBtYXRSaXBwbGVcbiAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cImRpc2FibGVSaXBwbGUgfHwgZGlzYWJsZWRcIlxuICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiPlxuPC9kaXY+XG5cbjxzdmdcbiAgKm5nSWY9XCJfdHJpZ2dlcnNTdWJtZW51XCJcbiAgY2xhc3M9XCJtYXQtbWVudS1zdWJtZW51LWljb25cIlxuICB2aWV3Qm94PVwiMCAwIDUgMTBcIlxuICBmb2N1c2FibGU9XCJmYWxzZVwiXG4gIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjxwb2x5Z29uIHBvaW50cz1cIjAsMCA1LDUgMCwxMFwiLz48L3N2Zz5cbiJdfQ==