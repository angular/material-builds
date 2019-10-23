/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, isDevMode, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
var nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/** @docs-private */
var MatBadgeBase = /** @class */ (function () {
    function MatBadgeBase() {
    }
    return MatBadgeBase;
}());
var _MatBadgeMixinBase = mixinDisabled(MatBadgeBase);
/** Directive to display a text badge. */
var MatBadge = /** @class */ (function (_super) {
    __extends(MatBadge, _super);
    function MatBadge(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
        var _this = _super.call(this) || this;
        _this._ngZone = _ngZone;
        _this._elementRef = _elementRef;
        _this._ariaDescriber = _ariaDescriber;
        _this._renderer = _renderer;
        _this._animationMode = _animationMode;
        /** Whether the badge has any content. */
        _this._hasContent = false;
        _this._color = 'primary';
        _this._overlap = true;
        /**
         * Position the badge should reside.
         * Accepts any combination of 'above'|'below' and 'before'|'after'
         */
        _this.position = 'above after';
        /** Size of the badge. Can be 'small', 'medium', or 'large'. */
        _this.size = 'medium';
        /** Unique id for the badge */
        _this._id = nextId++;
        if (isDevMode()) {
            var nativeElement = _elementRef.nativeElement;
            if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                throw Error('matBadge must be attached to an element node.');
            }
        }
        return _this;
    }
    Object.defineProperty(MatBadge.prototype, "color", {
        /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
        get: function () { return this._color; },
        set: function (value) {
            this._setColor(value);
            this._color = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatBadge.prototype, "overlap", {
        /** Whether the badge should overlap its contents or not */
        get: function () { return this._overlap; },
        set: function (val) {
            this._overlap = coerceBooleanProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatBadge.prototype, "description", {
        /** Message used to describe the decorated element via aria-describedby */
        get: function () { return this._description; },
        set: function (newDescription) {
            if (newDescription !== this._description) {
                var badgeElement = this._badgeElement;
                this._updateHostAriaDescription(newDescription, this._description);
                this._description = newDescription;
                if (badgeElement) {
                    newDescription ? badgeElement.setAttribute('aria-label', newDescription) :
                        badgeElement.removeAttribute('aria-label');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatBadge.prototype, "hidden", {
        /** Whether the badge is hidden. */
        get: function () { return this._hidden; },
        set: function (val) {
            this._hidden = coerceBooleanProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    /** Whether the badge is above the host or not */
    MatBadge.prototype.isAbove = function () {
        return this.position.indexOf('below') === -1;
    };
    /** Whether the badge is after the host or not */
    MatBadge.prototype.isAfter = function () {
        return this.position.indexOf('before') === -1;
    };
    MatBadge.prototype.ngOnChanges = function (changes) {
        var contentChange = changes['content'];
        if (contentChange) {
            var value = contentChange.currentValue;
            this._hasContent = value != null && ("" + value).trim().length > 0;
            this._updateTextContent();
        }
    };
    MatBadge.prototype.ngOnDestroy = function () {
        var badgeElement = this._badgeElement;
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
    };
    /**
     * Gets the element into which the badge's content is being rendered.
     * Undefined if the element hasn't been created (e.g. if the badge doesn't have content).
     */
    MatBadge.prototype.getBadgeElement = function () {
        return this._badgeElement;
    };
    /** Injects a span element into the DOM with the content. */
    MatBadge.prototype._updateTextContent = function () {
        if (!this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
        }
        else {
            this._badgeElement.textContent = this.content;
        }
        return this._badgeElement;
    };
    /** Creates the badge element */
    MatBadge.prototype._createBadgeElement = function () {
        var badgeElement = this._renderer.createElement('span');
        var activeClass = 'mat-badge-active';
        var contentClass = 'mat-badge-content';
        // Clear any existing badges which may have persisted from a server-side render.
        this._clearExistingBadges(contentClass);
        badgeElement.setAttribute('id', "mat-badge-content-" + this._id);
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
            this._ngZone.runOutsideAngular(function () {
                requestAnimationFrame(function () {
                    badgeElement.classList.add(activeClass);
                });
            });
        }
        else {
            badgeElement.classList.add(activeClass);
        }
        return badgeElement;
    };
    /** Sets the aria-label property on the element */
    MatBadge.prototype._updateHostAriaDescription = function (newDescription, oldDescription) {
        // ensure content available before setting label
        var content = this._updateTextContent();
        if (oldDescription) {
            this._ariaDescriber.removeDescription(content, oldDescription);
        }
        if (newDescription) {
            this._ariaDescriber.describe(content, newDescription);
        }
    };
    /** Adds css theme class given the color to the component host */
    MatBadge.prototype._setColor = function (colorPalette) {
        if (colorPalette !== this._color) {
            if (this._color) {
                this._elementRef.nativeElement.classList.remove("mat-badge-" + this._color);
            }
            if (colorPalette) {
                this._elementRef.nativeElement.classList.add("mat-badge-" + colorPalette);
            }
        }
    };
    /** Clears any existing badges that might be left over from server-side rendering. */
    MatBadge.prototype._clearExistingBadges = function (cssClass) {
        var element = this._elementRef.nativeElement;
        var childCount = element.children.length;
        // Use a reverse while, because we'll be removing elements from the list as we're iterating.
        while (childCount--) {
            var currentChild = element.children[childCount];
            if (currentChild.classList.contains(cssClass)) {
                element.removeChild(currentChild);
            }
        }
    };
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
    MatBadge.ctorParameters = function () { return [
        { type: NgZone },
        { type: ElementRef },
        { type: AriaDescriber },
        { type: Renderer2 },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
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
}(_MatBadgeMixinBase));
export { MatBadge };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsU0FBUyxFQUVULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9GLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLCtDQUErQztBQUMvQyxvQkFBb0I7QUFDcEI7SUFBQTtJQUFvQixDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBQXJCLElBQXFCO0FBRXJCLElBQU0sa0JBQWtCLEdBQ21CLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUt2RSx5Q0FBeUM7QUFDekM7SUFpQjhCLDRCQUFrQjtJQStEOUMsa0JBQ1ksT0FBZSxFQUNmLFdBQW9DLEVBQ3BDLGNBQTZCLEVBQzdCLFNBQW9CLEVBQ3VCLGNBQXVCO1FBTDlFLFlBTUksaUJBQU8sU0FRUjtRQWJTLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixpQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsb0JBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsZUFBUyxHQUFULFNBQVMsQ0FBVztRQUN1QixvQkFBYyxHQUFkLGNBQWMsQ0FBUztRQW5FOUUseUNBQXlDO1FBQ3pDLGlCQUFXLEdBQUcsS0FBSyxDQUFDO1FB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dEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxXQUFXO3dCQUNwQiwyQkFBMkIsRUFBRSxTQUFTO3dCQUN0Qyx5QkFBeUIsRUFBRSxXQUFXO3dCQUN0Qyx5QkFBeUIsRUFBRSxZQUFZO3dCQUN2QywwQkFBMEIsRUFBRSxZQUFZO3dCQUN4Qyx5QkFBeUIsRUFBRSxXQUFXO3dCQUN0Qyx5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLDBCQUEwQixFQUFFLG1CQUFtQjt3QkFDL0MseUJBQXlCLEVBQUUsa0JBQWtCO3dCQUM3QywwQkFBMEIsRUFBRSx3QkFBd0I7d0JBQ3BELDRCQUE0QixFQUFFLFVBQVU7cUJBQ3pDO2lCQUNGOzs7O2dCQXpDQyxNQUFNO2dCQUhOLFVBQVU7Z0JBSkosYUFBYTtnQkFXbkIsU0FBUzs2Q0EwR0osUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt3QkEvRDVDLEtBQUssU0FBQyxlQUFlOzBCQVNyQixLQUFLLFNBQUMsaUJBQWlCOzJCQVd2QixLQUFLLFNBQUMsa0JBQWtCOzBCQUd4QixLQUFLLFNBQUMsVUFBVTs4QkFHaEIsS0FBSyxTQUFDLHFCQUFxQjt1QkFpQjNCLEtBQUssU0FBQyxjQUFjO3lCQUdwQixLQUFLLFNBQUMsZ0JBQWdCOztJQThKekIsZUFBQztDQUFBLEFBbE9ELENBaUI4QixrQkFBa0IsR0FpTi9DO1NBak5ZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhRGVzY3JpYmVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgaXNEZXZNb2RlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsIG1peGluRGlzYWJsZWQsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG5sZXQgbmV4dElkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRCYWRnZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRCYWRnZUJhc2Uge31cblxuY29uc3QgX01hdEJhZGdlTWl4aW5CYXNlOlxuICAgIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdEJhZGdlQmFzZSA9IG1peGluRGlzYWJsZWQoTWF0QmFkZ2VCYXNlKTtcblxuZXhwb3J0IHR5cGUgTWF0QmFkZ2VQb3NpdGlvbiA9ICdhYm92ZSBhZnRlcicgfCAnYWJvdmUgYmVmb3JlJyB8ICdiZWxvdyBiZWZvcmUnIHwgJ2JlbG93IGFmdGVyJztcbmV4cG9ydCB0eXBlIE1hdEJhZGdlU2l6ZSA9ICdzbWFsbCcgfCAnbWVkaXVtJyB8ICdsYXJnZSc7XG5cbi8qKiBEaXJlY3RpdmUgdG8gZGlzcGxheSBhIHRleHQgYmFkZ2UuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0QmFkZ2VdJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkOiBtYXRCYWRnZURpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJhZGdlJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1vdmVybGFwXSc6ICdvdmVybGFwJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hYm92ZV0nOiAnaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWxvd10nOiAnIWlzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVmb3JlXSc6ICchaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hZnRlcl0nOiAnaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1zbWFsbF0nOiAnc2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1tZWRpdW1dJzogJ3NpemUgPT09IFwibWVkaXVtXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWxhcmdlXSc6ICdzaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWhpZGRlbl0nOiAnaGlkZGVuIHx8ICFfaGFzQ29udGVudCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QmFkZ2UgZXh0ZW5kcyBfTWF0QmFkZ2VNaXhpbkJhc2UgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgQ2FuRGlzYWJsZSB7XG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBoYXMgYW55IGNvbnRlbnQuICovXG4gIF9oYXNDb250ZW50ID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBjb2xvciBvZiB0aGUgYmFkZ2UuIENhbiBiZSBgcHJpbWFyeWAsIGBhY2NlbnRgLCBvciBgd2FybmAuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VDb2xvcicpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUgeyByZXR1cm4gdGhpcy5fY29sb3I7IH1cbiAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9zZXRDb2xvcih2YWx1ZSk7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBzaG91bGQgb3ZlcmxhcCBpdHMgY29udGVudHMgb3Igbm90ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VPdmVybGFwJylcbiAgZ2V0IG92ZXJsYXAoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9vdmVybGFwOyB9XG4gIHNldCBvdmVybGFwKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX292ZXJsYXAgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9vdmVybGFwOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogUG9zaXRpb24gdGhlIGJhZGdlIHNob3VsZCByZXNpZGUuXG4gICAqIEFjY2VwdHMgYW55IGNvbWJpbmF0aW9uIG9mICdhYm92ZSd8J2JlbG93JyBhbmQgJ2JlZm9yZSd8J2FmdGVyJ1xuICAgKi9cbiAgQElucHV0KCdtYXRCYWRnZVBvc2l0aW9uJykgcG9zaXRpb246IE1hdEJhZGdlUG9zaXRpb24gPSAnYWJvdmUgYWZ0ZXInO1xuXG4gIC8qKiBUaGUgY29udGVudCBmb3IgdGhlIGJhZGdlICovXG4gIEBJbnB1dCgnbWF0QmFkZ2UnKSBjb250ZW50OiBzdHJpbmc7XG5cbiAgLyoqIE1lc3NhZ2UgdXNlZCB0byBkZXNjcmliZSB0aGUgZGVjb3JhdGVkIGVsZW1lbnQgdmlhIGFyaWEtZGVzY3JpYmVkYnkgKi9cbiAgQElucHV0KCdtYXRCYWRnZURlc2NyaXB0aW9uJylcbiAgZ2V0IGRlc2NyaXB0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjsgfVxuICBzZXQgZGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIGlmIChuZXdEZXNjcmlwdGlvbiAhPT0gdGhpcy5fZGVzY3JpcHRpb24pIHtcbiAgICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgICAgIHRoaXMuX3VwZGF0ZUhvc3RBcmlhRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb24sIHRoaXMuX2Rlc2NyaXB0aW9uKTtcbiAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICAgIGlmIChiYWRnZUVsZW1lbnQpIHtcbiAgICAgICAgbmV3RGVzY3JpcHRpb24gPyBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgbmV3RGVzY3JpcHRpb24pIDpcbiAgICAgICAgICAgIGJhZGdlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfZGVzY3JpcHRpb246IHN0cmluZztcblxuICAvKiogU2l6ZSBvZiB0aGUgYmFkZ2UuIENhbiBiZSAnc21hbGwnLCAnbWVkaXVtJywgb3IgJ2xhcmdlJy4gKi9cbiAgQElucHV0KCdtYXRCYWRnZVNpemUnKSBzaXplOiBNYXRCYWRnZVNpemUgPSAnbWVkaXVtJztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgaGlkZGVuLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlSGlkZGVuJylcbiAgZ2V0IGhpZGRlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGRlbjsgfVxuICBzZXQgaGlkZGVuKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGRlbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX2hpZGRlbjogYm9vbGVhbjtcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgYmFkZ2UgKi9cbiAgX2lkOiBudW1iZXIgPSBuZXh0SWQrKztcblxuICBwcml2YXRlIF9iYWRnZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgIHByaXZhdGUgX2FyaWFEZXNjcmliZXI6IEFyaWFEZXNjcmliZXIsXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIGlmIChpc0Rldk1vZGUoKSkge1xuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgIT09IG5hdGl2ZUVsZW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ21hdEJhZGdlIG11c3QgYmUgYXR0YWNoZWQgdG8gYW4gZWxlbWVudCBub2RlLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhYm92ZSB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBYm92ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWxvdycpID09PSAtMTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhZnRlciB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBZnRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWZvcmUnKSA9PT0gLTE7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgY29udGVudENoYW5nZSA9IGNoYW5nZXNbJ2NvbnRlbnQnXTtcblxuICAgIGlmIChjb250ZW50Q2hhbmdlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnRlbnRDaGFuZ2UuY3VycmVudFZhbHVlO1xuICAgICAgdGhpcy5faGFzQ29udGVudCA9IHZhbHVlICE9IG51bGwgJiYgYCR7dmFsdWV9YC50cmltKCkubGVuZ3RoID4gMDtcbiAgICAgIHRoaXMuX3VwZGF0ZVRleHRDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fYmFkZ2VFbGVtZW50O1xuXG4gICAgaWYgKGJhZGdlRWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihiYWRnZUVsZW1lbnQsIHRoaXMuZGVzY3JpcHRpb24pO1xuICAgICAgfVxuXG4gICAgICAvLyBXaGVuIGNyZWF0aW5nIGEgYmFkZ2UgdGhyb3VnaCB0aGUgUmVuZGVyZXIsIEFuZ3VsYXIgd2lsbCBrZWVwIGl0IGluIGFuIGluZGV4LlxuICAgICAgLy8gV2UgaGF2ZSB0byBkZXN0cm95IGl0IG91cnNlbHZlcywgb3RoZXJ3aXNlIGl0J2xsIGJlIHJldGFpbmVkIGluIG1lbW9yeS5cbiAgICAgIGlmICh0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZSkge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZShiYWRnZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IGludG8gd2hpY2ggdGhlIGJhZGdlJ3MgY29udGVudCBpcyBiZWluZyByZW5kZXJlZC5cbiAgICogVW5kZWZpbmVkIGlmIHRoZSBlbGVtZW50IGhhc24ndCBiZWVuIGNyZWF0ZWQgKGUuZy4gaWYgdGhlIGJhZGdlIGRvZXNuJ3QgaGF2ZSBjb250ZW50KS5cbiAgICovXG4gIGdldEJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBJbmplY3RzIGEgc3BhbiBlbGVtZW50IGludG8gdGhlIERPTSB3aXRoIHRoZSBjb250ZW50LiAqL1xuICBwcml2YXRlIF91cGRhdGVUZXh0Q29udGVudCgpOiBIVE1MU3BhbkVsZW1lbnQge1xuICAgIGlmICghdGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQgPSB0aGlzLl9jcmVhdGVCYWRnZUVsZW1lbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5jb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgdGhlIGJhZGdlIGVsZW1lbnQgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgYWN0aXZlQ2xhc3MgPSAnbWF0LWJhZGdlLWFjdGl2ZSc7XG4gICAgY29uc3QgY29udGVudENsYXNzID0gJ21hdC1iYWRnZS1jb250ZW50JztcblxuICAgIC8vIENsZWFyIGFueSBleGlzdGluZyBiYWRnZXMgd2hpY2ggbWF5IGhhdmUgcGVyc2lzdGVkIGZyb20gYSBzZXJ2ZXItc2lkZSByZW5kZXIuXG4gICAgdGhpcy5fY2xlYXJFeGlzdGluZ0JhZGdlcyhjb250ZW50Q2xhc3MpO1xuICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgYG1hdC1iYWRnZS1jb250ZW50LSR7dGhpcy5faWR9YCk7XG4gICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoY29udGVudENsYXNzKTtcbiAgICBiYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tYXQtYW5pbWF0aW9uLW5vb3BhYmxlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb24pIHtcbiAgICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFkZ2VFbGVtZW50KTtcblxuICAgIC8vIGFuaW1hdGUgaW4gYWZ0ZXIgaW5zZXJ0aW9uXG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGFyaWEtbGFiZWwgcHJvcGVydHkgb24gdGhlIGVsZW1lbnQgKi9cbiAgcHJpdmF0ZSBfdXBkYXRlSG9zdEFyaWFEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nLCBvbGREZXNjcmlwdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gZW5zdXJlIGNvbnRlbnQgYXZhaWxhYmxlIGJlZm9yZSBzZXR0aW5nIGxhYmVsXG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuX3VwZGF0ZVRleHRDb250ZW50KCk7XG5cbiAgICBpZiAob2xkRGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24oY29udGVudCwgb2xkRGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIGlmIChuZXdEZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5kZXNjcmliZShjb250ZW50LCBuZXdEZXNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFkZHMgY3NzIHRoZW1lIGNsYXNzIGdpdmVuIHRoZSBjb2xvciB0byB0aGUgY29tcG9uZW50IGhvc3QgKi9cbiAgcHJpdmF0ZSBfc2V0Q29sb3IoY29sb3JQYWxldHRlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBpZiAoY29sb3JQYWxldHRlICE9PSB0aGlzLl9jb2xvcikge1xuICAgICAgaWYgKHRoaXMuX2NvbG9yKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGBtYXQtYmFkZ2UtJHt0aGlzLl9jb2xvcn1gKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2xvclBhbGV0dGUpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoYG1hdC1iYWRnZS0ke2NvbG9yUGFsZXR0ZX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIGFueSBleGlzdGluZyBiYWRnZXMgdGhhdCBtaWdodCBiZSBsZWZ0IG92ZXIgZnJvbSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuICovXG4gIHByaXZhdGUgX2NsZWFyRXhpc3RpbmdCYWRnZXMoY3NzQ2xhc3M6IHN0cmluZykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgbGV0IGNoaWxkQ291bnQgPSBlbGVtZW50LmNoaWxkcmVuLmxlbmd0aDtcblxuICAgIC8vIFVzZSBhIHJldmVyc2Ugd2hpbGUsIGJlY2F1c2Ugd2UnbGwgYmUgcmVtb3ZpbmcgZWxlbWVudHMgZnJvbSB0aGUgbGlzdCBhcyB3ZSdyZSBpdGVyYXRpbmcuXG4gICAgd2hpbGUgKGNoaWxkQ291bnQtLSkge1xuICAgICAgY29uc3QgY3VycmVudENoaWxkID0gZWxlbWVudC5jaGlsZHJlbltjaGlsZENvdW50XTtcblxuICAgICAgaWYgKGN1cnJlbnRDaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoY3NzQ2xhc3MpKSB7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoY3VycmVudENoaWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==