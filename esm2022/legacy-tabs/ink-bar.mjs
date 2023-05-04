/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, NgZone, Optional } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';
import { _MAT_INK_BAR_POSITIONER } from '@angular/material/tabs';
import * as i0 from "@angular/core";
/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 * @deprecated Use `MatInkBar` from `@angular/material/tabs` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyInkBar {
    constructor(_elementRef, _ngZone, _inkBarPositioner, _animationMode) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._inkBarPositioner = _inkBarPositioner;
        this._animationMode = _animationMode;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param element
     */
    alignToElement(element) {
        this.show();
        // `onStable` might not run for a while if the zone has already stabilized.
        // Wrap the call in `NgZone.run` to ensure that it runs relatively soon.
        this._ngZone.run(() => {
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                const positions = this._inkBarPositioner(element);
                const inkBar = this._elementRef.nativeElement;
                inkBar.style.left = positions.left;
                inkBar.style.width = positions.width;
            });
        });
    }
    /** Shows the ink bar. */
    show() {
        this._elementRef.nativeElement.style.visibility = 'visible';
    }
    /** Hides the ink bar. */
    hide() {
        this._elementRef.nativeElement.style.visibility = 'hidden';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInkBar, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: _MAT_INK_BAR_POSITIONER }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatLegacyInkBar, selector: "mat-ink-bar", host: { properties: { "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-ink-bar" }, ngImport: i0 }); }
}
export { MatLegacyInkBar };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatLegacyInkBar, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-ink-bar',
                    host: {
                        'class': 'mat-ink-bar',
                        '[class._mat-animation-noopable]': `_animationMode === 'NoopAnimations'`,
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [_MAT_INK_BAR_POSITIONER]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktdGFicy9pbmstYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUMsdUJBQXVCLEVBQXVCLE1BQU0sd0JBQXdCLENBQUM7O0FBRXJGOzs7OztHQUtHO0FBQ0gsTUFPYSxlQUFlO0lBQzFCLFlBQ1UsV0FBb0MsRUFDcEMsT0FBZSxFQUNrQixpQkFBdUMsRUFDOUIsY0FBdUI7UUFIakUsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDa0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFzQjtRQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBUztJQUN4RSxDQUFDO0lBRUo7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWiwyRUFBMkU7UUFDM0Usd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDakQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDN0QsQ0FBQzs4R0FwQ1UsZUFBZSxrRUFJaEIsdUJBQXVCLGFBQ1gscUJBQXFCO2tHQUxoQyxlQUFlOztTQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFQM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixpQ0FBaUMsRUFBRSxxQ0FBcUM7cUJBQ3pFO2lCQUNGOzswQkFLSSxNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBQzlCLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIE5nWm9uZSwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7X01BVF9JTktfQkFSX1BPU0lUSU9ORVIsIF9NYXRJbmtCYXJQb3NpdGlvbmVyfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC90YWJzJztcblxuLyoqXG4gKiBUaGUgaW5rLWJhciBpcyB1c2VkIHRvIGRpc3BsYXkgYW5kIGFuaW1hdGUgdGhlIGxpbmUgdW5kZXJuZWF0aCB0aGUgY3VycmVudCBhY3RpdmUgdGFiIGxhYmVsLlxuICogQGRvY3MtcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRJbmtCYXJgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3RhYnNgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWluay1iYXInLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1pbmstYmFyJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6IGBfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJ2AsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeUlua0JhciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIEBJbmplY3QoX01BVF9JTktfQkFSX1BPU0lUSU9ORVIpIHByaXZhdGUgX2lua0JhclBvc2l0aW9uZXI6IF9NYXRJbmtCYXJQb3NpdGlvbmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge31cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgc3R5bGVzIGZyb20gdGhlIHByb3ZpZGVkIGVsZW1lbnQgaW4gb3JkZXIgdG8gYWxpZ24gdGhlIGluay1iYXIgdG8gdGhhdCBlbGVtZW50LlxuICAgKiBTaG93cyB0aGUgaW5rIGJhciBpZiBwcmV2aW91c2x5IHNldCBhcyBoaWRkZW4uXG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqL1xuICBhbGlnblRvRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMuc2hvdygpO1xuXG4gICAgLy8gYG9uU3RhYmxlYCBtaWdodCBub3QgcnVuIGZvciBhIHdoaWxlIGlmIHRoZSB6b25lIGhhcyBhbHJlYWR5IHN0YWJpbGl6ZWQuXG4gICAgLy8gV3JhcCB0aGUgY2FsbCBpbiBgTmdab25lLnJ1bmAgdG8gZW5zdXJlIHRoYXQgaXQgcnVucyByZWxhdGl2ZWx5IHNvb24uXG4gICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB0aGlzLl9pbmtCYXJQb3NpdGlvbmVyKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBpbmtCYXIgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlua0Jhci5zdHlsZS5sZWZ0ID0gcG9zaXRpb25zLmxlZnQ7XG4gICAgICAgIGlua0Jhci5zdHlsZS53aWR0aCA9IHBvc2l0aW9ucy53aWR0aDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFNob3dzIHRoZSBpbmsgYmFyLiAqL1xuICBzaG93KCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSBpbmsgYmFyLiAqL1xuICBoaWRlKCk6IHZvaWQge1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gIH1cbn1cbiJdfQ==