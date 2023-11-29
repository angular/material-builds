/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, Optional } from '@angular/core';
import { LIST_OPTION } from './list-option-types';
import * as i0 from "@angular/core";
/**
 * Directive capturing the title of a list item. A list item usually consists of a
 * title and optional secondary or tertiary lines.
 *
 * Text content for the title never wraps. There can only be a single title per list item.
 */
export class MatListItemTitle {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemTitle, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatListItemTitle, isStandalone: true, selector: "[matListItemTitle]", host: { classAttribute: "mat-mdc-list-item-title mdc-list-item__primary-text" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matListItemTitle]',
                    host: { 'class': 'mat-mdc-list-item-title mdc-list-item__primary-text' },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });
/**
 * Directive capturing a line in a list item. A list item usually consists of a
 * title and optional secondary or tertiary lines.
 *
 * Text content inside a line never wraps. There can be at maximum two lines per list item.
 */
export class MatListItemLine {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemLine, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatListItemLine, isStandalone: true, selector: "[matListItemLine]", host: { classAttribute: "mat-mdc-list-item-line mdc-list-item__secondary-text" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemLine, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matListItemLine]',
                    host: { 'class': 'mat-mdc-list-item-line mdc-list-item__secondary-text' },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });
/**
 * Directive matching an optional meta section for list items.
 *
 * List items can reserve space at the end of an item to display a control,
 * button or additional text content.
 */
export class MatListItemMeta {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemMeta, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatListItemMeta, isStandalone: true, selector: "[matListItemMeta]", host: { classAttribute: "mat-mdc-list-item-meta mdc-list-item__end" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemMeta, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matListItemMeta]',
                    host: { 'class': 'mat-mdc-list-item-meta mdc-list-item__end' },
                    standalone: true,
                }]
        }] });
/**
 * @docs-private
 *
 * MDC uses the very intuitively named classes `.mdc-list-item__start` and `.mat-list-item__end` to
 * position content such as icons or checkboxes/radios that comes either before or after the text
 * content respectively. This directive detects the placement of the checkbox/radio and applies the
 * correct MDC class to position the icon/avatar on the opposite side.
 */
export class _MatListItemGraphicBase {
    constructor(_listOption) {
        this._listOption = _listOption;
    }
    _isAlignedAtStart() {
        // By default, in all list items the graphic is aligned at start. In list options,
        // the graphic is only aligned at start if the checkbox/radio is at the end.
        return !this._listOption || this._listOption?._getTogglePosition() === 'after';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: _MatListItemGraphicBase, deps: [{ token: LIST_OPTION, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: _MatListItemGraphicBase, host: { properties: { "class.mdc-list-item__start": "_isAlignedAtStart()", "class.mdc-list-item__end": "!_isAlignedAtStart()" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: _MatListItemGraphicBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        // MDC uses intuitively named classes `.mdc-list-item__start` and `.mat-list-item__end` to
                        // position content such as icons or checkboxes/radios that comes either before or after the
                        // text content respectively. This directive detects the placement of the checkbox/radio and
                        // applies the correct MDC class to position the icon/avatar on the opposite side.
                        '[class.mdc-list-item__start]': '_isAlignedAtStart()',
                        '[class.mdc-list-item__end]': '!_isAlignedAtStart()',
                    },
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LIST_OPTION]
                }] }] });
/**
 * Directive matching an optional avatar within a list item.
 *
 * List items can reserve space at the beginning of an item to display an avatar.
 */
export class MatListItemAvatar extends _MatListItemGraphicBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemAvatar, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatListItemAvatar, isStandalone: true, selector: "[matListItemAvatar]", host: { classAttribute: "mat-mdc-list-item-avatar" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemAvatar, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matListItemAvatar]',
                    host: { 'class': 'mat-mdc-list-item-avatar' },
                    standalone: true,
                }]
        }] });
/**
 * Directive matching an optional icon within a list item.
 *
 * List items can reserve space at the beginning of an item to display an icon.
 */
export class MatListItemIcon extends _MatListItemGraphicBase {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemIcon, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatListItemIcon, isStandalone: true, selector: "[matListItemIcon]", host: { classAttribute: "mat-mdc-list-item-icon" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatListItemIcon, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matListItemIcon]',
                    host: { 'class': 'mat-mdc-list-item-icon' },
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLXNlY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvbGlzdC1pdGVtLXNlY3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEUsT0FBTyxFQUFDLFdBQVcsRUFBYSxNQUFNLHFCQUFxQixDQUFDOztBQUU1RDs7Ozs7R0FLRztBQU1ILE1BQU0sT0FBTyxnQkFBZ0I7SUFDM0IsWUFBbUIsV0FBb0M7UUFBcEMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO0lBQUcsQ0FBQzs4R0FEaEQsZ0JBQWdCO2tHQUFoQixnQkFBZ0I7OzJGQUFoQixnQkFBZ0I7a0JBTDVCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtvQkFDOUIsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHFEQUFxRCxFQUFDO29CQUN0RSxVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBS0Q7Ozs7O0dBS0c7QUFNSCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUFtQixXQUFvQztRQUFwQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7SUFBRyxDQUFDOzhHQURoRCxlQUFlO2tHQUFmLGVBQWU7OzJGQUFmLGVBQWU7a0JBTDNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNEQUFzRCxFQUFDO29CQUN2RSxVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBS0Q7Ozs7O0dBS0c7QUFNSCxNQUFNLE9BQU8sZUFBZTs4R0FBZixlQUFlO2tHQUFmLGVBQWU7OzJGQUFmLGVBQWU7a0JBTDNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLDJDQUEyQyxFQUFDO29CQUM1RCxVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBR0Q7Ozs7Ozs7R0FPRztBQVdILE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFBb0QsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0lBRS9FLGlCQUFpQjtRQUNmLGtGQUFrRjtRQUNsRiw0RUFBNEU7UUFDNUUsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsRUFBRSxLQUFLLE9BQU8sQ0FBQztJQUNqRixDQUFDOzhHQVBVLHVCQUF1QixrQkFDRixXQUFXO2tHQURoQyx1QkFBdUI7OzJGQUF2Qix1QkFBdUI7a0JBVm5DLFNBQVM7bUJBQUM7b0JBQ1QsSUFBSSxFQUFFO3dCQUNKLDBGQUEwRjt3QkFDMUYsNEZBQTRGO3dCQUM1Riw0RkFBNEY7d0JBQzVGLGtGQUFrRjt3QkFDbEYsOEJBQThCLEVBQUUscUJBQXFCO3dCQUNyRCw0QkFBNEIsRUFBRSxzQkFBc0I7cUJBQ3JEO2lCQUNGOzswQkFFYyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFdBQVc7O0FBUzdDOzs7O0dBSUc7QUFNSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsdUJBQXVCOzhHQUFqRCxpQkFBaUI7a0dBQWpCLGlCQUFpQjs7MkZBQWpCLGlCQUFpQjtrQkFMN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUM7b0JBQzNDLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUFHRDs7OztHQUlHO0FBTUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEsdUJBQXVCOzhHQUEvQyxlQUFlO2tHQUFmLGVBQWU7OzJGQUFmLGVBQWU7a0JBTDNCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFDO29CQUN6QyxVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdCwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMSVNUX09QVElPTiwgTGlzdE9wdGlvbn0gZnJvbSAnLi9saXN0LW9wdGlvbi10eXBlcyc7XG5cbi8qKlxuICogRGlyZWN0aXZlIGNhcHR1cmluZyB0aGUgdGl0bGUgb2YgYSBsaXN0IGl0ZW0uIEEgbGlzdCBpdGVtIHVzdWFsbHkgY29uc2lzdHMgb2YgYVxuICogdGl0bGUgYW5kIG9wdGlvbmFsIHNlY29uZGFyeSBvciB0ZXJ0aWFyeSBsaW5lcy5cbiAqXG4gKiBUZXh0IGNvbnRlbnQgZm9yIHRoZSB0aXRsZSBuZXZlciB3cmFwcy4gVGhlcmUgY2FuIG9ubHkgYmUgYSBzaW5nbGUgdGl0bGUgcGVyIGxpc3QgaXRlbS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdExpc3RJdGVtVGl0bGVdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbWRjLWxpc3QtaXRlbS10aXRsZSBtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHQnfSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdEl0ZW1UaXRsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIGNhcHR1cmluZyBhIGxpbmUgaW4gYSBsaXN0IGl0ZW0uIEEgbGlzdCBpdGVtIHVzdWFsbHkgY29uc2lzdHMgb2YgYVxuICogdGl0bGUgYW5kIG9wdGlvbmFsIHNlY29uZGFyeSBvciB0ZXJ0aWFyeSBsaW5lcy5cbiAqXG4gKiBUZXh0IGNvbnRlbnQgaW5zaWRlIGEgbGluZSBuZXZlciB3cmFwcy4gVGhlcmUgY2FuIGJlIGF0IG1heGltdW0gdHdvIGxpbmVzIHBlciBsaXN0IGl0ZW0uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRMaXN0SXRlbUxpbmVdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtbWRjLWxpc3QtaXRlbS1saW5lIG1kYy1saXN0LWl0ZW1fX3NlY29uZGFyeS10ZXh0J30sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RJdGVtTGluZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIG1hdGNoaW5nIGFuIG9wdGlvbmFsIG1ldGEgc2VjdGlvbiBmb3IgbGlzdCBpdGVtcy5cbiAqXG4gKiBMaXN0IGl0ZW1zIGNhbiByZXNlcnZlIHNwYWNlIGF0IHRoZSBlbmQgb2YgYW4gaXRlbSB0byBkaXNwbGF5IGEgY29udHJvbCxcbiAqIGJ1dHRvbiBvciBhZGRpdGlvbmFsIHRleHQgY29udGVudC5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdExpc3RJdGVtTWV0YV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1tZGMtbGlzdC1pdGVtLW1ldGEgbWRjLWxpc3QtaXRlbV9fZW5kJ30sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RJdGVtTWV0YSB7fVxuXG4vKipcbiAqIEBkb2NzLXByaXZhdGVcbiAqXG4gKiBNREMgdXNlcyB0aGUgdmVyeSBpbnR1aXRpdmVseSBuYW1lZCBjbGFzc2VzIGAubWRjLWxpc3QtaXRlbV9fc3RhcnRgIGFuZCBgLm1hdC1saXN0LWl0ZW1fX2VuZGAgdG9cbiAqIHBvc2l0aW9uIGNvbnRlbnQgc3VjaCBhcyBpY29ucyBvciBjaGVja2JveGVzL3JhZGlvcyB0aGF0IGNvbWVzIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlIHRleHRcbiAqIGNvbnRlbnQgcmVzcGVjdGl2ZWx5LiBUaGlzIGRpcmVjdGl2ZSBkZXRlY3RzIHRoZSBwbGFjZW1lbnQgb2YgdGhlIGNoZWNrYm94L3JhZGlvIGFuZCBhcHBsaWVzIHRoZVxuICogY29ycmVjdCBNREMgY2xhc3MgdG8gcG9zaXRpb24gdGhlIGljb24vYXZhdGFyIG9uIHRoZSBvcHBvc2l0ZSBzaWRlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgIC8vIE1EQyB1c2VzIGludHVpdGl2ZWx5IG5hbWVkIGNsYXNzZXMgYC5tZGMtbGlzdC1pdGVtX19zdGFydGAgYW5kIGAubWF0LWxpc3QtaXRlbV9fZW5kYCB0b1xuICAgIC8vIHBvc2l0aW9uIGNvbnRlbnQgc3VjaCBhcyBpY29ucyBvciBjaGVja2JveGVzL3JhZGlvcyB0aGF0IGNvbWVzIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlXG4gICAgLy8gdGV4dCBjb250ZW50IHJlc3BlY3RpdmVseS4gVGhpcyBkaXJlY3RpdmUgZGV0ZWN0cyB0aGUgcGxhY2VtZW50IG9mIHRoZSBjaGVja2JveC9yYWRpbyBhbmRcbiAgICAvLyBhcHBsaWVzIHRoZSBjb3JyZWN0IE1EQyBjbGFzcyB0byBwb3NpdGlvbiB0aGUgaWNvbi9hdmF0YXIgb24gdGhlIG9wcG9zaXRlIHNpZGUuXG4gICAgJ1tjbGFzcy5tZGMtbGlzdC1pdGVtX19zdGFydF0nOiAnX2lzQWxpZ25lZEF0U3RhcnQoKScsXG4gICAgJ1tjbGFzcy5tZGMtbGlzdC1pdGVtX19lbmRdJzogJyFfaXNBbGlnbmVkQXRTdGFydCgpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgX01hdExpc3RJdGVtR3JhcGhpY0Jhc2Uge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KExJU1RfT1BUSU9OKSBwdWJsaWMgX2xpc3RPcHRpb246IExpc3RPcHRpb24pIHt9XG5cbiAgX2lzQWxpZ25lZEF0U3RhcnQoKSB7XG4gICAgLy8gQnkgZGVmYXVsdCwgaW4gYWxsIGxpc3QgaXRlbXMgdGhlIGdyYXBoaWMgaXMgYWxpZ25lZCBhdCBzdGFydC4gSW4gbGlzdCBvcHRpb25zLFxuICAgIC8vIHRoZSBncmFwaGljIGlzIG9ubHkgYWxpZ25lZCBhdCBzdGFydCBpZiB0aGUgY2hlY2tib3gvcmFkaW8gaXMgYXQgdGhlIGVuZC5cbiAgICByZXR1cm4gIXRoaXMuX2xpc3RPcHRpb24gfHwgdGhpcy5fbGlzdE9wdGlvbj8uX2dldFRvZ2dsZVBvc2l0aW9uKCkgPT09ICdhZnRlcic7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgbWF0Y2hpbmcgYW4gb3B0aW9uYWwgYXZhdGFyIHdpdGhpbiBhIGxpc3QgaXRlbS5cbiAqXG4gKiBMaXN0IGl0ZW1zIGNhbiByZXNlcnZlIHNwYWNlIGF0IHRoZSBiZWdpbm5pbmcgb2YgYW4gaXRlbSB0byBkaXNwbGF5IGFuIGF2YXRhci5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdExpc3RJdGVtQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LW1kYy1saXN0LWl0ZW0tYXZhdGFyJ30sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RJdGVtQXZhdGFyIGV4dGVuZHMgX01hdExpc3RJdGVtR3JhcGhpY0Jhc2Uge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgbWF0Y2hpbmcgYW4gb3B0aW9uYWwgaWNvbiB3aXRoaW4gYSBsaXN0IGl0ZW0uXG4gKlxuICogTGlzdCBpdGVtcyBjYW4gcmVzZXJ2ZSBzcGFjZSBhdCB0aGUgYmVnaW5uaW5nIG9mIGFuIGl0ZW0gdG8gZGlzcGxheSBhbiBpY29uLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0TGlzdEl0ZW1JY29uXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LW1kYy1saXN0LWl0ZW0taWNvbid9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0SXRlbUljb24gZXh0ZW5kcyBfTWF0TGlzdEl0ZW1HcmFwaGljQmFzZSB7fVxuIl19