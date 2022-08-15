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
 */
export class MatLegacyInkBar {
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
}
MatLegacyInkBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatLegacyInkBar, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: _MAT_INK_BAR_POSITIONER }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatLegacyInkBar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: MatLegacyInkBar, selector: "mat-ink-bar", host: { properties: { "class._mat-animation-noopable": "_animationMode === 'NoopAnimations'" }, classAttribute: "mat-ink-bar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatLegacyInkBar, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9sZWdhY3ktdGFicy9pbmstYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUMsdUJBQXVCLEVBQXVCLE1BQU0sd0JBQXdCLENBQUM7O0FBRXJGOzs7R0FHRztBQVFILE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQ1UsV0FBb0MsRUFDcEMsT0FBZSxFQUNrQixpQkFBdUMsRUFDOUIsY0FBdUI7UUFIakUsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDa0Isc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFzQjtRQUM5QixtQkFBYyxHQUFkLGNBQWMsQ0FBUztJQUN4RSxDQUFDO0lBRUo7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWiwyRUFBMkU7UUFDM0Usd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDakQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztnQkFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDOUQsQ0FBQztJQUVELHlCQUF5QjtJQUN6QixJQUFJO1FBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFDN0QsQ0FBQzs7NEdBcENVLGVBQWUsa0VBSWhCLHVCQUF1QixhQUNYLHFCQUFxQjtnR0FMaEMsZUFBZTsyRkFBZixlQUFlO2tCQVAzQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLGlDQUFpQyxFQUFFLHFDQUFxQztxQkFDekU7aUJBQ0Y7OzBCQUtJLE1BQU07MkJBQUMsdUJBQXVCOzswQkFDOUIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdCwgTmdab25lLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtfTUFUX0lOS19CQVJfUE9TSVRJT05FUiwgX01hdElua0JhclBvc2l0aW9uZXJ9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuXG4vKipcbiAqIFRoZSBpbmstYmFyIGlzIHVzZWQgdG8gZGlzcGxheSBhbmQgYW5pbWF0ZSB0aGUgbGluZSB1bmRlcm5lYXRoIHRoZSBjdXJyZW50IGFjdGl2ZSB0YWIgbGFiZWwuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1pbmstYmFyJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtaW5rLWJhcicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiBgX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucydgLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lJbmtCYXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSKSBwcml2YXRlIF9pbmtCYXJQb3NpdGlvbmVyOiBfTWF0SW5rQmFyUG9zaXRpb25lcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHN0eWxlcyBmcm9tIHRoZSBwcm92aWRlZCBlbGVtZW50IGluIG9yZGVyIHRvIGFsaWduIHRoZSBpbmstYmFyIHRvIHRoYXQgZWxlbWVudC5cbiAgICogU2hvd3MgdGhlIGluayBiYXIgaWYgcHJldmlvdXNseSBzZXQgYXMgaGlkZGVuLlxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKi9cbiAgYWxpZ25Ub0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIC8vIGBvblN0YWJsZWAgbWlnaHQgbm90IHJ1biBmb3IgYSB3aGlsZSBpZiB0aGUgem9uZSBoYXMgYWxyZWFkeSBzdGFiaWxpemVkLlxuICAgIC8vIFdyYXAgdGhlIGNhbGwgaW4gYE5nWm9uZS5ydW5gIHRvIGVuc3VyZSB0aGF0IGl0IHJ1bnMgcmVsYXRpdmVseSBzb29uLlxuICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5faW5rQmFyUG9zaXRpb25lcihlbGVtZW50KTtcbiAgICAgICAgY29uc3QgaW5rQmFyID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpbmtCYXIuc3R5bGUubGVmdCA9IHBvc2l0aW9ucy5sZWZ0O1xuICAgICAgICBpbmtCYXIuc3R5bGUud2lkdGggPSBwb3NpdGlvbnMud2lkdGg7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTaG93cyB0aGUgaW5rIGJhci4gKi9cbiAgc2hvdygpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgfVxuXG4gIC8qKiBIaWRlcyB0aGUgaW5rIGJhci4gKi9cbiAgaGlkZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICB9XG59XG4iXX0=