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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsU0FBUyxFQUVULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9GLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLCtDQUErQztBQUMvQyxvQkFBb0I7QUFDcEI7SUFBQTtJQUFvQixDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBQXJCLElBQXFCO0FBRXJCLElBQU0sa0JBQWtCLEdBQ21CLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQVV2RSx5Q0FBeUM7QUFDekM7SUFpQjhCLDRCQUFrQjtJQStEOUMsa0JBQ1ksT0FBZSxFQUNmLFdBQW9DLEVBQ3BDLGNBQTZCLEVBQzdCLFNBQW9CLEVBQ3VCLGNBQXVCO1FBTDlFLFlBTUksaUJBQU8sU0FRUjtRQWJTLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixpQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDcEMsb0JBQWMsR0FBZCxjQUFjLENBQWU7UUFDN0IsZUFBUyxHQUFULFNBQVMsQ0FBVztRQUN1QixvQkFBYyxHQUFkLGNBQWMsQ0FBUztRQW5FOUUseUNBQXlDO1FBQ3pDLGlCQUFXLEdBQUcsS0FBSyxDQUFDO1FB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dEMsSUFBSSxFQUFFO3dCQUNKLE9BQU8sRUFBRSxXQUFXO3dCQUNwQiwyQkFBMkIsRUFBRSxTQUFTO3dCQUN0Qyx5QkFBeUIsRUFBRSxXQUFXO3dCQUN0Qyx5QkFBeUIsRUFBRSxZQUFZO3dCQUN2QywwQkFBMEIsRUFBRSxZQUFZO3dCQUN4Qyx5QkFBeUIsRUFBRSxXQUFXO3dCQUN0Qyx5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLDBCQUEwQixFQUFFLG1CQUFtQjt3QkFDL0MseUJBQXlCLEVBQUUsa0JBQWtCO3dCQUM3QywwQkFBMEIsRUFBRSx3QkFBd0I7d0JBQ3BELDRCQUE0QixFQUFFLFVBQVU7cUJBQ3pDO2lCQUNGOzs7O2dCQTlDQyxNQUFNO2dCQUhOLFVBQVU7Z0JBSkosYUFBYTtnQkFXbkIsU0FBUzs2Q0ErR0osUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt3QkEvRDVDLEtBQUssU0FBQyxlQUFlOzBCQVNyQixLQUFLLFNBQUMsaUJBQWlCOzJCQVd2QixLQUFLLFNBQUMsa0JBQWtCOzBCQUd4QixLQUFLLFNBQUMsVUFBVTs4QkFHaEIsS0FBSyxTQUFDLHFCQUFxQjt1QkFpQjNCLEtBQUssU0FBQyxjQUFjO3lCQUdwQixLQUFLLFNBQUMsZ0JBQWdCOztJQWtLekIsZUFBQztDQUFBLEFBdE9ELENBaUI4QixrQkFBa0IsR0FxTi9DO1NBck5ZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhRGVzY3JpYmVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBpc0Rldk1vZGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZCwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEJhZGdlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEJhZGdlQmFzZSB7fVxuXG5jb25zdCBfTWF0QmFkZ2VNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0QmFkZ2VCYXNlID0gbWl4aW5EaXNhYmxlZChNYXRCYWRnZUJhc2UpO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgICAnYWJvdmUgYWZ0ZXInIHwgJ2Fib3ZlIGJlZm9yZScgfCAnYmVsb3cgYmVmb3JlJyB8ICdiZWxvdyBhZnRlcicgfFxuICAgICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQWxsb3dlZCBzaXplIG9wdGlvbnMgZm9yIG1hdEJhZGdlU2l6ZSAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuLyoqIERpcmVjdGl2ZSB0byBkaXNwbGF5IGEgdGV4dCBiYWRnZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRCYWRnZV0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdEJhZGdlRGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYmFkZ2UnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW92ZXJsYXBdJzogJ292ZXJsYXAnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFib3ZlXSc6ICdpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlbG93XSc6ICchaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWZvcmVdJzogJyFpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFmdGVyXSc6ICdpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLXNtYWxsXSc6ICdzaXplID09PSBcInNtYWxsXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW1lZGl1bV0nOiAnc2l6ZSA9PT0gXCJtZWRpdW1cIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbGFyZ2VdJzogJ3NpemUgPT09IFwibGFyZ2VcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtaGlkZGVuXSc6ICdoaWRkZW4gfHwgIV9oYXNDb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBleHRlbmRzIF9NYXRCYWRnZU1peGluQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBDYW5EaXNhYmxlIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGhhcyBhbnkgY29udGVudC4gKi9cbiAgX2hhc0NvbnRlbnQgPSBmYWxzZTtcblxuICAvKiogVGhlIGNvbG9yIG9mIHRoZSBiYWRnZS4gQ2FuIGJlIGBwcmltYXJ5YCwgYGFjY2VudGAsIG9yIGB3YXJuYC4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUNvbG9yJylcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvcjsgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX3NldENvbG9yKHZhbHVlKTtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIHNob3VsZCBvdmVybGFwIGl0cyBjb250ZW50cyBvciBub3QgKi9cbiAgQElucHV0KCdtYXRCYWRnZU92ZXJsYXAnKVxuICBnZXQgb3ZlcmxhcCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXA7IH1cbiAgc2V0IG92ZXJsYXAodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiB0aGUgYmFkZ2Ugc2hvdWxkIHJlc2lkZS5cbiAgICogQWNjZXB0cyBhbnkgY29tYmluYXRpb24gb2YgJ2Fib3ZlJ3wnYmVsb3cnIGFuZCAnYmVmb3JlJ3wnYWZ0ZXInXG4gICAqL1xuICBASW5wdXQoJ21hdEJhZGdlUG9zaXRpb24nKSBwb3NpdGlvbjogTWF0QmFkZ2VQb3NpdGlvbiA9ICdhYm92ZSBhZnRlcic7XG5cbiAgLyoqIFRoZSBjb250ZW50IGZvciB0aGUgYmFkZ2UgKi9cbiAgQElucHV0KCdtYXRCYWRnZScpIGNvbnRlbnQ6IHN0cmluZztcblxuICAvKiogTWVzc2FnZSB1c2VkIHRvIGRlc2NyaWJlIHRoZSBkZWNvcmF0ZWQgZWxlbWVudCB2aWEgYXJpYS1kZXNjcmliZWRieSAqL1xuICBASW5wdXQoJ21hdEJhZGdlRGVzY3JpcHRpb24nKVxuICBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uOyB9XG4gIHNldCBkZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uICE9PSB0aGlzLl9kZXNjcmlwdGlvbikge1xuICAgICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICAgICAgdGhpcy5fdXBkYXRlSG9zdEFyaWFEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbiwgdGhpcy5fZGVzY3JpcHRpb24pO1xuICAgICAgdGhpcy5fZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgICAgaWYgKGJhZGdlRWxlbWVudCkge1xuICAgICAgICBuZXdEZXNjcmlwdGlvbiA/IGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBuZXdEZXNjcmlwdGlvbikgOlxuICAgICAgICAgICAgYmFkZ2VFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBTaXplIG9mIHRoZSBiYWRnZS4gQ2FuIGJlICdzbWFsbCcsICdtZWRpdW0nLCBvciAnbGFyZ2UnLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlU2l6ZScpIHNpemU6IE1hdEJhZGdlU2l6ZSA9ICdtZWRpdW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZGVuOyB9XG4gIHNldCBoaWRkZW4odmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZGVuID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBiYWRnZSAqL1xuICBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5ub2RlVHlwZSAhPT0gbmF0aXZlRWxlbWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignbWF0QmFkZ2UgbXVzdCBiZSBhdHRhY2hlZCB0byBhbiBlbGVtZW50IG5vZGUuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFib3ZlIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFmdGVyIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0FmdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlZm9yZScpID09PSAtMTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb250ZW50Q2hhbmdlID0gY2hhbmdlc1snY29udGVudCddO1xuXG4gICAgaWYgKGNvbnRlbnRDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udGVudENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLl9oYXNDb250ZW50ID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gLnRyaW0oKS5sZW5ndGggPiAwO1xuICAgICAgdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG5cbiAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGJhZGdlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoZW4gY3JlYXRpbmcgYSBiYWRnZSB0aHJvdWdoIHRoZSBSZW5kZXJlciwgQW5ndWxhciB3aWxsIGtlZXAgaXQgaW4gYW4gaW5kZXguXG4gICAgICAvLyBXZSBoYXZlIHRvIGRlc3Ryb3kgaXQgb3Vyc2VsdmVzLCBvdGhlcndpc2UgaXQnbGwgYmUgcmV0YWluZWQgaW4gbWVtb3J5LlxuICAgICAgaWYgKHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKGJhZGdlRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgaW50byB3aGljaCB0aGUgYmFkZ2UncyBjb250ZW50IGlzIGJlaW5nIHJlbmRlcmVkLlxuICAgKiBVbmRlZmluZWQgaWYgdGhlIGVsZW1lbnQgaGFzbid0IGJlZW4gY3JlYXRlZCAoZS5nLiBpZiB0aGUgYmFkZ2UgZG9lc24ndCBoYXZlIGNvbnRlbnQpLlxuICAgKi9cbiAgZ2V0QmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIEluamVjdHMgYSBzcGFuIGVsZW1lbnQgaW50byB0aGUgRE9NIHdpdGggdGhlIGNvbnRlbnQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRleHRDb250ZW50KCk6IEhUTUxTcGFuRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogQ3JlYXRlcyB0aGUgYmFkZ2UgZWxlbWVudCAqL1xuICBwcml2YXRlIF9jcmVhdGVCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9ICdtYXQtYmFkZ2UtYWN0aXZlJztcbiAgICBjb25zdCBjb250ZW50Q2xhc3MgPSAnbWF0LWJhZGdlLWNvbnRlbnQnO1xuXG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGJhZGdlcyB3aGljaCBtYXkgaGF2ZSBwZXJzaXN0ZWQgZnJvbSBhIHNlcnZlci1zaWRlIHJlbmRlci5cbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgbWF0LWJhZGdlLWNvbnRlbnQtJHt0aGlzLl9pZH1gKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjb250ZW50Q2xhc3MpO1xuICAgIGJhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRoaXMuZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChiYWRnZUVsZW1lbnQpO1xuXG4gICAgLy8gYW5pbWF0ZSBpbiBhZnRlciBpbnNlcnRpb25cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIHJldHVybiBiYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYXJpYS1sYWJlbCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xuICBwcml2YXRlIF91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcsIG9sZERlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBlbnN1cmUgY29udGVudCBhdmFpbGFibGUgYmVmb3JlIHNldHRpbmcgbGFiZWxcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcblxuICAgIGlmIChvbGREZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihjb250ZW50LCBvbGREZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKGNvbnRlbnQsIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRkcyBjc3MgdGhlbWUgY2xhc3MgZ2l2ZW4gdGhlIGNvbG9yIHRvIHRoZSBjb21wb25lbnQgaG9zdCAqL1xuICBwcml2YXRlIF9zZXRDb2xvcihjb2xvclBhbGV0dGU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGlmIChjb2xvclBhbGV0dGUgIT09IHRoaXMuX2NvbG9yKSB7XG4gICAgICBpZiAodGhpcy5fY29sb3IpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWRnZS0ke3RoaXMuX2NvbG9yfWApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWJhZGdlLSR7Y29sb3JQYWxldHRlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgYW55IGV4aXN0aW5nIGJhZGdlcyB0aGF0IG1pZ2h0IGJlIGxlZnQgb3ZlciBmcm9tIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcyhjc3NDbGFzczogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgY2hpbGRDb3VudCA9IGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgLy8gVXNlIGEgcmV2ZXJzZSB3aGlsZSwgYmVjYXVzZSB3ZSdsbCBiZSByZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBsaXN0IGFzIHdlJ3JlIGl0ZXJhdGluZy5cbiAgICB3aGlsZSAoY2hpbGRDb3VudC0tKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBlbGVtZW50LmNoaWxkcmVuW2NoaWxkQ291bnRdO1xuXG4gICAgICBpZiAoY3VycmVudENoaWxkLmNsYXNzTGlzdC5jb250YWlucyhjc3NDbGFzcykpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChjdXJyZW50Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZGVuOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vdmVybGFwOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=