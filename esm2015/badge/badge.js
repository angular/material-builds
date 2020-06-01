/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, isDevMode, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
let nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/** @docs-private */
class MatBadgeBase {
}
const _MatBadgeMixinBase = mixinDisabled(MatBadgeBase);
/** Directive to display a text badge. */
let MatBadge = /** @class */ (() => {
    class MatBadge extends _MatBadgeMixinBase {
        constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
            super();
            this._ngZone = _ngZone;
            this._elementRef = _elementRef;
            this._ariaDescriber = _ariaDescriber;
            this._renderer = _renderer;
            this._animationMode = _animationMode;
            /** Whether the badge has any content. */
            this._hasContent = false;
            this._color = 'primary';
            this._overlap = true;
            /**
             * Position the badge should reside.
             * Accepts any combination of 'above'|'below' and 'before'|'after'
             */
            this.position = 'above after';
            /** Size of the badge. Can be 'small', 'medium', or 'large'. */
            this.size = 'medium';
            /** Unique id for the badge */
            this._id = nextId++;
            if (isDevMode()) {
                const nativeElement = _elementRef.nativeElement;
                if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                    throw Error('matBadge must be attached to an element node.');
                }
            }
        }
        /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
        get color() { return this._color; }
        set color(value) {
            this._setColor(value);
            this._color = value;
        }
        /** Whether the badge should overlap its contents or not */
        get overlap() { return this._overlap; }
        set overlap(val) {
            this._overlap = coerceBooleanProperty(val);
        }
        /** Message used to describe the decorated element via aria-describedby */
        get description() { return this._description; }
        set description(newDescription) {
            if (newDescription !== this._description) {
                const badgeElement = this._badgeElement;
                this._updateHostAriaDescription(newDescription, this._description);
                this._description = newDescription;
                if (badgeElement) {
                    newDescription ? badgeElement.setAttribute('aria-label', newDescription) :
                        badgeElement.removeAttribute('aria-label');
                }
            }
        }
        /** Whether the badge is hidden. */
        get hidden() { return this._hidden; }
        set hidden(val) {
            this._hidden = coerceBooleanProperty(val);
        }
        /** Whether the badge is above the host or not */
        isAbove() {
            return this.position.indexOf('below') === -1;
        }
        /** Whether the badge is after the host or not */
        isAfter() {
            return this.position.indexOf('before') === -1;
        }
        ngOnChanges(changes) {
            const contentChange = changes['content'];
            if (contentChange) {
                const value = contentChange.currentValue;
                this._hasContent = value != null && `${value}`.trim().length > 0;
                this._updateTextContent();
            }
        }
        ngOnDestroy() {
            const badgeElement = this._badgeElement;
            if (badgeElement) {
                if (this.description) {
                    this._ariaDescriber.removeDescription(badgeElement, this.description);
                }
                // When creating a badge through the Renderer, Angular will keep it in an index.
                // We have to destroy it ourselves, otherwise it'll be retained in memory.
                if (this._renderer.destroyNode) {
                    this._renderer.destroyNode(badgeElement);
                }
            }
        }
        /**
         * Gets the element into which the badge's content is being rendered.
         * Undefined if the element hasn't been created (e.g. if the badge doesn't have content).
         */
        getBadgeElement() {
            return this._badgeElement;
        }
        /** Injects a span element into the DOM with the content. */
        _updateTextContent() {
            if (!this._badgeElement) {
                this._badgeElement = this._createBadgeElement();
            }
            else {
                this._badgeElement.textContent = this.content;
            }
            return this._badgeElement;
        }
        /** Creates the badge element */
        _createBadgeElement() {
            const badgeElement = this._renderer.createElement('span');
            const activeClass = 'mat-badge-active';
            const contentClass = 'mat-badge-content';
            // Clear any existing badges which may have persisted from a server-side render.
            this._clearExistingBadges(contentClass);
            badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
            badgeElement.classList.add(contentClass);
            badgeElement.textContent = this.content;
            if (this._animationMode === 'NoopAnimations') {
                badgeElement.classList.add('_mat-animation-noopable');
            }
            if (this.description) {
                badgeElement.setAttribute('aria-label', this.description);
            }
            this._elementRef.nativeElement.appendChild(badgeElement);
            // animate in after insertion
            if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
                this._ngZone.runOutsideAngular(() => {
                    requestAnimationFrame(() => {
                        badgeElement.classList.add(activeClass);
                    });
                });
            }
            else {
                badgeElement.classList.add(activeClass);
            }
            return badgeElement;
        }
        /** Sets the aria-label property on the element */
        _updateHostAriaDescription(newDescription, oldDescription) {
            // ensure content available before setting label
            const content = this._updateTextContent();
            if (oldDescription) {
                this._ariaDescriber.removeDescription(content, oldDescription);
            }
            if (newDescription) {
                this._ariaDescriber.describe(content, newDescription);
            }
        }
        /** Adds css theme class given the color to the component host */
        _setColor(colorPalette) {
            if (colorPalette !== this._color) {
                if (this._color) {
                    this._elementRef.nativeElement.classList.remove(`mat-badge-${this._color}`);
                }
                if (colorPalette) {
                    this._elementRef.nativeElement.classList.add(`mat-badge-${colorPalette}`);
                }
            }
        }
        /** Clears any existing badges that might be left over from server-side rendering. */
        _clearExistingBadges(cssClass) {
            const element = this._elementRef.nativeElement;
            let childCount = element.children.length;
            // Use a reverse while, because we'll be removing elements from the list as we're iterating.
            while (childCount--) {
                const currentChild = element.children[childCount];
                if (currentChild.classList.contains(cssClass)) {
                    element.removeChild(currentChild);
                }
            }
        }
    }
    MatBadge.decorators = [
        { type: Directive, args: [{
                    selector: '[matBadge]',
                    inputs: ['disabled: matBadgeDisabled'],
                    host: {
                        'class': 'mat-badge',
                        '[class.mat-badge-overlap]': 'overlap',
                        '[class.mat-badge-above]': 'isAbove()',
                        '[class.mat-badge-below]': '!isAbove()',
                        '[class.mat-badge-before]': '!isAfter()',
                        '[class.mat-badge-after]': 'isAfter()',
                        '[class.mat-badge-small]': 'size === "small"',
                        '[class.mat-badge-medium]': 'size === "medium"',
                        '[class.mat-badge-large]': 'size === "large"',
                        '[class.mat-badge-hidden]': 'hidden || !_hasContent',
                        '[class.mat-badge-disabled]': 'disabled',
                    },
                },] }
    ];
    /** @nocollapse */
    MatBadge.ctorParameters = () => [
        { type: NgZone },
        { type: ElementRef },
        { type: AriaDescriber },
        { type: Renderer2 },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ];
    MatBadge.propDecorators = {
        color: [{ type: Input, args: ['matBadgeColor',] }],
        overlap: [{ type: Input, args: ['matBadgeOverlap',] }],
        position: [{ type: Input, args: ['matBadgePosition',] }],
        content: [{ type: Input, args: ['matBadge',] }],
        description: [{ type: Input, args: ['matBadgeDescription',] }],
        size: [{ type: Input, args: ['matBadgeSize',] }],
        hidden: [{ type: Input, args: ['matBadgeHidden',] }]
    };
    return MatBadge;
})();
export { MatBadge };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEVBRVQsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDL0YsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFHM0UsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRWYsK0NBQStDO0FBQy9DLG9CQUFvQjtBQUNwQixNQUFNLFlBQVk7Q0FBRztBQUVyQixNQUFNLGtCQUFrQixHQUNtQixhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFVdkUseUNBQXlDO0FBQ3pDO0lBQUEsTUFpQmEsUUFBUyxTQUFRLGtCQUFrQjtRQStEOUMsWUFDWSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsY0FBNkIsRUFDN0IsU0FBb0IsRUFDdUIsY0FBdUI7WUFDMUUsS0FBSyxFQUFFLENBQUM7WUFMQSxZQUFPLEdBQVAsT0FBTyxDQUFRO1lBQ2YsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1lBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1lBQzdCLGNBQVMsR0FBVCxTQUFTLENBQVc7WUFDdUIsbUJBQWMsR0FBZCxjQUFjLENBQVM7WUFuRTlFLHlDQUF5QztZQUN6QyxnQkFBVyxHQUFHLEtBQUssQ0FBQztZQVNaLFdBQU0sR0FBaUIsU0FBUyxDQUFDO1lBUWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7WUFFakM7OztlQUdHO1lBQ3dCLGFBQVEsR0FBcUIsYUFBYSxDQUFDO1lBc0J0RSwrREFBK0Q7WUFDeEMsU0FBSSxHQUFpQixRQUFRLENBQUM7WUFVckQsOEJBQThCO1lBQzlCLFFBQUcsR0FBVyxNQUFNLEVBQUUsQ0FBQztZQVluQixJQUFJLFNBQVMsRUFBRSxFQUFFO2dCQUNmLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2hELElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUMsWUFBWSxFQUFFO29CQUN6RCxNQUFNLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO2lCQUM5RDthQUNGO1FBQ0gsQ0FBQztRQXpFSCxxRUFBcUU7UUFDckUsSUFDSSxLQUFLLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxLQUFLLENBQUMsS0FBbUI7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBR0QsMkRBQTJEO1FBQzNELElBQ0ksT0FBTyxLQUFjLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxPQUFPLENBQUMsR0FBWTtZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFZRCwwRUFBMEU7UUFDMUUsSUFDSSxXQUFXLEtBQWEsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFJLFdBQVcsQ0FBQyxjQUFzQjtZQUNwQyxJQUFJLGNBQWMsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN4QyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsMEJBQTBCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbkUsSUFBSSxDQUFDLFlBQVksR0FBRyxjQUFjLENBQUM7Z0JBRW5DLElBQUksWUFBWSxFQUFFO29CQUNoQixjQUFjLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RFLFlBQVksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ2hEO2FBQ0Y7UUFDSCxDQUFDO1FBTUQsbUNBQW1DO1FBQ25DLElBQ0ksTUFBTSxLQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxNQUFNLENBQUMsR0FBWTtZQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUF3QkQsaURBQWlEO1FBQ2pELE9BQU87WUFDTCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxpREFBaUQ7UUFDakQsT0FBTztZQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUVELFdBQVcsQ0FBQyxPQUFzQjtZQUNoQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFekMsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzNCO1FBQ0gsQ0FBQztRQUVELFdBQVc7WUFDVCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBRXhDLElBQUksWUFBWSxFQUFFO2dCQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDdkU7Z0JBRUQsZ0ZBQWdGO2dCQUNoRiwwRUFBMEU7Z0JBQzFFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7b0JBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUMxQzthQUNGO1FBQ0gsQ0FBQztRQUVEOzs7V0FHRztRQUNILGVBQWU7WUFDYixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQztRQUVELDREQUE0RDtRQUNwRCxrQkFBa0I7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDakQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUMvQztZQUNELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM1QixDQUFDO1FBRUQsZ0NBQWdDO1FBQ3hCLG1CQUFtQjtZQUN6QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRCxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztZQUN2QyxNQUFNLFlBQVksR0FBRyxtQkFBbUIsQ0FBQztZQUV6QyxnRkFBZ0Y7WUFDaEYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3hDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLHFCQUFxQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqRSxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN6QyxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFFeEMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGdCQUFnQixFQUFFO2dCQUM1QyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ3ZEO1lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixZQUFZLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDM0Q7WUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFekQsNkJBQTZCO1lBQzdCLElBQUksT0FBTyxxQkFBcUIsS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDM0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7b0JBQ2xDLHFCQUFxQixDQUFDLEdBQUcsRUFBRTt3QkFDekIsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzFDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDekM7WUFFRCxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDO1FBRUQsa0RBQWtEO1FBQzFDLDBCQUEwQixDQUFDLGNBQXNCLEVBQUUsY0FBc0I7WUFDL0UsZ0RBQWdEO1lBQ2hELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRTFDLElBQUksY0FBYyxFQUFFO2dCQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQzthQUNoRTtZQUVELElBQUksY0FBYyxFQUFFO2dCQUNsQixJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDdkQ7UUFDSCxDQUFDO1FBRUQsaUVBQWlFO1FBQ3pELFNBQVMsQ0FBQyxZQUEwQjtZQUMxQyxJQUFJLFlBQVksS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RTtnQkFDRCxJQUFJLFlBQVksRUFBRTtvQkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLFlBQVksRUFBRSxDQUFDLENBQUM7aUJBQzNFO2FBQ0Y7UUFDSCxDQUFDO1FBRUQscUZBQXFGO1FBQzdFLG9CQUFvQixDQUFDLFFBQWdCO1lBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDO1lBQy9DLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBRXpDLDRGQUE0RjtZQUM1RixPQUFPLFVBQVUsRUFBRSxFQUFFO2dCQUNuQixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUVsRCxJQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM3QyxPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUNuQzthQUNGO1FBQ0gsQ0FBQzs7O2dCQWpPRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLE1BQU0sRUFBRSxDQUFDLDRCQUE0QixDQUFDO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLFdBQVc7d0JBQ3BCLDJCQUEyQixFQUFFLFNBQVM7d0JBQ3RDLHlCQUF5QixFQUFFLFdBQVc7d0JBQ3RDLHlCQUF5QixFQUFFLFlBQVk7d0JBQ3ZDLDBCQUEwQixFQUFFLFlBQVk7d0JBQ3hDLHlCQUF5QixFQUFFLFdBQVc7d0JBQ3RDLHlCQUF5QixFQUFFLGtCQUFrQjt3QkFDN0MsMEJBQTBCLEVBQUUsbUJBQW1CO3dCQUMvQyx5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLDBCQUEwQixFQUFFLHdCQUF3Qjt3QkFDcEQsNEJBQTRCLEVBQUUsVUFBVTtxQkFDekM7aUJBQ0Y7Ozs7Z0JBOUNDLE1BQU07Z0JBSE4sVUFBVTtnQkFKSixhQUFhO2dCQVduQixTQUFTOzZDQStHSixRQUFRLFlBQUksTUFBTSxTQUFDLHFCQUFxQjs7O3dCQS9ENUMsS0FBSyxTQUFDLGVBQWU7MEJBU3JCLEtBQUssU0FBQyxpQkFBaUI7MkJBV3ZCLEtBQUssU0FBQyxrQkFBa0I7MEJBR3hCLEtBQUssU0FBQyxVQUFVOzhCQUdoQixLQUFLLFNBQUMscUJBQXFCO3VCQWlCM0IsS0FBSyxTQUFDLGNBQWM7eUJBR3BCLEtBQUssU0FBQyxnQkFBZ0I7O0lBa0t6QixlQUFDO0tBQUE7U0FyTlksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QmFkZ2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0QmFkZ2VCYXNlIHt9XG5cbmNvbnN0IF9NYXRCYWRnZU1peGluQmFzZTpcbiAgICBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRCYWRnZUJhc2UgPSBtaXhpbkRpc2FibGVkKE1hdEJhZGdlQmFzZSk7XG5cbi8qKiBBbGxvd2VkIHBvc2l0aW9uIG9wdGlvbnMgZm9yIG1hdEJhZGdlUG9zaXRpb24gKi9cbmV4cG9ydCB0eXBlIE1hdEJhZGdlUG9zaXRpb24gPVxuICAgICdhYm92ZSBhZnRlcicgfCAnYWJvdmUgYmVmb3JlJyB8ICdiZWxvdyBiZWZvcmUnIHwgJ2JlbG93IGFmdGVyJyB8XG4gICAgJ2JlZm9yZScgfCAnYWZ0ZXInIHwgJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8qKiBBbGxvd2VkIHNpemUgb3B0aW9ucyBmb3IgbWF0QmFkZ2VTaXplICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVNpemUgPSAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4vKiogRGlyZWN0aXZlIHRvIGRpc3BsYXkgYSB0ZXh0IGJhZGdlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEJhZGdlXScsXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0QmFkZ2VEaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1iYWRnZScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utb3ZlcmxhcF0nOiAnb3ZlcmxhcCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWJvdmVdJzogJ2lzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVsb3ddJzogJyFpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlZm9yZV0nOiAnIWlzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWZ0ZXJdJzogJ2lzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utc21hbGxdJzogJ3NpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbWVkaXVtXSc6ICdzaXplID09PSBcIm1lZGl1bVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1sYXJnZV0nOiAnc2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1oaWRkZW5dJzogJ2hpZGRlbiB8fCAhX2hhc0NvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJhZGdlIGV4dGVuZHMgX01hdEJhZGdlTWl4aW5CYXNlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIENhbkRpc2FibGUge1xuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaGFzIGFueSBjb250ZW50LiAqL1xuICBfaGFzQ29udGVudCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgY29sb3Igb2YgdGhlIGJhZGdlLiBDYW4gYmUgYHByaW1hcnlgLCBgYWNjZW50YCwgb3IgYHdhcm5gLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlQ29sb3InKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yOyB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fc2V0Q29sb3IodmFsdWUpO1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2Ugc2hvdWxkIG92ZXJsYXAgaXRzIGNvbnRlbnRzIG9yIG5vdCAqL1xuICBASW5wdXQoJ21hdEJhZGdlT3ZlcmxhcCcpXG4gIGdldCBvdmVybGFwKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcDsgfVxuICBzZXQgb3ZlcmxhcCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWRnZSBzaG91bGQgcmVzaWRlLlxuICAgKiBBY2NlcHRzIGFueSBjb21iaW5hdGlvbiBvZiAnYWJvdmUnfCdiZWxvdycgYW5kICdiZWZvcmUnfCdhZnRlcidcbiAgICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VQb3NpdGlvbicpIHBvc2l0aW9uOiBNYXRCYWRnZVBvc2l0aW9uID0gJ2Fib3ZlIGFmdGVyJztcblxuICAvKiogVGhlIGNvbnRlbnQgZm9yIHRoZSBiYWRnZSAqL1xuICBASW5wdXQoJ21hdEJhZGdlJykgY29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBNZXNzYWdlIHVzZWQgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHZpYSBhcmlhLWRlc2NyaWJlZGJ5ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247IH1cbiAgc2V0IGRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3RGVzY3JpcHRpb24gIT09IHRoaXMuX2Rlc2NyaXB0aW9uKSB7XG4gICAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gICAgICB0aGlzLl91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uLCB0aGlzLl9kZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uID8gYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIG5ld0Rlc2NyaXB0aW9uKSA6XG4gICAgICAgICAgICBiYWRnZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIFNpemUgb2YgdGhlIGJhZGdlLiBDYW4gYmUgJ3NtYWxsJywgJ21lZGl1bScsIG9yICdsYXJnZScuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VTaXplJykgc2l6ZTogTWF0QmFkZ2VTaXplID0gJ21lZGl1bSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUhpZGRlbicpXG4gIGdldCBoaWRkZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRkZW47IH1cbiAgc2V0IGhpZGRlbih2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGJhZGdlICovXG4gIF9pZDogbnVtYmVyID0gbmV4dElkKys7XG5cbiAgcHJpdmF0ZSBfYmFkZ2VFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmIChuYXRpdmVFbGVtZW50Lm5vZGVUeXBlICE9PSBuYXRpdmVFbGVtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgIHRocm93IEVycm9yKCdtYXRCYWRnZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQgbm9kZS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWJvdmUgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWJvdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVsb3cnKSA9PT0gLTE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWZ0ZXIgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWZ0ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVmb3JlJykgPT09IC0xO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNvbnRlbnRDaGFuZ2UgPSBjaGFuZ2VzWydjb250ZW50J107XG5cbiAgICBpZiAoY29udGVudENoYW5nZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb250ZW50Q2hhbmdlLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMuX2hhc0NvbnRlbnQgPSB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAudHJpbSgpLmxlbmd0aCA+IDA7XG4gICAgICB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX2JhZGdlRWxlbWVudDtcblxuICAgIGlmIChiYWRnZUVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24oYmFkZ2VFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlbiBjcmVhdGluZyBhIGJhZGdlIHRocm91Z2ggdGhlIFJlbmRlcmVyLCBBbmd1bGFyIHdpbGwga2VlcCBpdCBpbiBhbiBpbmRleC5cbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVzdHJveSBpdCBvdXJzZWx2ZXMsIG90aGVyd2lzZSBpdCdsbCBiZSByZXRhaW5lZCBpbiBtZW1vcnkuXG4gICAgICBpZiAodGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUoYmFkZ2VFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCBpbnRvIHdoaWNoIHRoZSBiYWRnZSdzIGNvbnRlbnQgaXMgYmVpbmcgcmVuZGVyZWQuXG4gICAqIFVuZGVmaW5lZCBpZiB0aGUgZWxlbWVudCBoYXNuJ3QgYmVlbiBjcmVhdGVkIChlLmcuIGlmIHRoZSBiYWRnZSBkb2Vzbid0IGhhdmUgY29udGVudCkuXG4gICAqL1xuICBnZXRCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogSW5qZWN0cyBhIHNwYW4gZWxlbWVudCBpbnRvIHRoZSBET00gd2l0aCB0aGUgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGV4dENvbnRlbnQoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBiYWRnZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX2NyZWF0ZUJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gJ21hdC1iYWRnZS1hY3RpdmUnO1xuICAgIGNvbnN0IGNvbnRlbnRDbGFzcyA9ICdtYXQtYmFkZ2UtY29udGVudCc7XG5cbiAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgYmFkZ2VzIHdoaWNoIG1heSBoYXZlIHBlcnNpc3RlZCBmcm9tIGEgc2VydmVyLXNpZGUgcmVuZGVyLlxuICAgIHRoaXMuX2NsZWFyRXhpc3RpbmdCYWRnZXMoY29udGVudENsYXNzKTtcbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5jb250ZW50O1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG5cbiAgICAvLyBhbmltYXRlIGluIGFmdGVyIGluc2VydGlvblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhcmlhLWxhYmVsIHByb3BlcnR5IG9uIHRoZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX3VwZGF0ZUhvc3RBcmlhRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZywgb2xkRGVzY3JpcHRpb246IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIGVuc3VyZSBjb250ZW50IGF2YWlsYWJsZSBiZWZvcmUgc2V0dGluZyBsYWJlbFxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuXG4gICAgaWYgKG9sZERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGNvbnRlbnQsIG9sZERlc2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAobmV3RGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUoY29udGVudCwgbmV3RGVzY3JpcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGRzIGNzcyB0aGVtZSBjbGFzcyBnaXZlbiB0aGUgY29sb3IgdG8gdGhlIGNvbXBvbmVudCBob3N0ICovXG4gIHByaXZhdGUgX3NldENvbG9yKGNvbG9yUGFsZXR0ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgaWYgKGNvbG9yUGFsZXR0ZSAhPT0gdGhpcy5fY29sb3IpIHtcbiAgICAgIGlmICh0aGlzLl9jb2xvcikge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhZGdlLSR7dGhpcy5fY29sb3J9YCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sb3JQYWxldHRlKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtYmFkZ2UtJHtjb2xvclBhbGV0dGV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFycyBhbnkgZXhpc3RpbmcgYmFkZ2VzIHRoYXQgbWlnaHQgYmUgbGVmdCBvdmVyIGZyb20gc2VydmVyLXNpZGUgcmVuZGVyaW5nLiAqL1xuICBwcml2YXRlIF9jbGVhckV4aXN0aW5nQmFkZ2VzKGNzc0NsYXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBjaGlsZENvdW50ID0gZWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAvLyBVc2UgYSByZXZlcnNlIHdoaWxlLCBiZWNhdXNlIHdlJ2xsIGJlIHJlbW92aW5nIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QgYXMgd2UncmUgaXRlcmF0aW5nLlxuICAgIHdoaWxlIChjaGlsZENvdW50LS0pIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZCA9IGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRDb3VudF07XG5cbiAgICAgIGlmIChjdXJyZW50Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKGNzc0NsYXNzKSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGN1cnJlbnRDaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRkZW46IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXA6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==