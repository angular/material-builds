import { isDevMode, Directive, NgZone, ElementRef, Renderer2, Optional, Inject, Input, NgModule } from '@angular/core';
import { mixinDisabled, MatCommonModule } from '@angular/material/core';
import { AriaDescriber, A11yModule } from '@angular/cdk/a11y';
import { __extends } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatBadgeModule = /** @class */ (function () {
    function MatBadgeModule() {
    }
    MatBadgeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        A11yModule,
                        MatCommonModule
                    ],
                    exports: [MatBadge, MatCommonModule],
                    declarations: [MatBadge],
                },] }
    ];
    return MatBadgeModule;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MatBadge, MatBadgeModule };
//# sourceMappingURL=badge.js.map
