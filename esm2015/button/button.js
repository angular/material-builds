/**
 * @fileoverview added by tsickle
 * Generated from: src/material/button/button.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation, Optional, Inject, Input, } from '@angular/core';
import { MatRipple, mixinColor, mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/**
 * Default color palette for round buttons (mat-fab and mat-mini-fab)
 * @type {?}
 */
const DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * List of classes to add to MatButton instances based on host attributes to
 * style as different variants.
 * @type {?}
 */
const BUTTON_HOST_ATTRIBUTES = [
    'mat-button',
    'mat-flat-button',
    'mat-icon-button',
    'mat-raised-button',
    'mat-stroked-button',
    'mat-mini-fab',
    'mat-fab',
];
// Boilerplate for applying mixins to MatButton.
/**
 * \@docs-private
 */
class MatButtonBase {
    /**
     * @param {?} _elementRef
     */
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
if (false) {
    /** @type {?} */
    MatButtonBase.prototype._elementRef;
}
/** @type {?} */
const _MatButtonMixinBase = mixinColor(mixinDisabled(mixinDisableRipple(MatButtonBase)));
/**
 * Material design button.
 */
let MatButton = /** @class */ (() => {
    /**
     * Material design button.
     */
    class MatButton extends _MatButtonMixinBase {
        /**
         * @param {?} elementRef
         * @param {?} _focusMonitor
         * @param {?} _animationMode
         */
        constructor(elementRef, _focusMonitor, _animationMode) {
            super(elementRef);
            this._focusMonitor = _focusMonitor;
            this._animationMode = _animationMode;
            /**
             * Whether the button is round.
             */
            this.isRoundButton = this._hasHostAttributes('mat-fab', 'mat-mini-fab');
            /**
             * Whether the button is icon button.
             */
            this.isIconButton = this._hasHostAttributes('mat-icon-button');
            // For each of the variant selectors that is present in the button's host
            // attributes, add the correct corresponding class.
            for (const attr of BUTTON_HOST_ATTRIBUTES) {
                if (this._hasHostAttributes(attr)) {
                    ((/** @type {?} */ (this._getHostElement()))).classList.add(attr);
                }
            }
            // Add a class that applies to all buttons. This makes it easier to target if somebody
            // wants to target all Material buttons. We do it here rather than `host` to ensure that
            // the class is applied to derived classes.
            elementRef.nativeElement.classList.add('mat-button-base');
            this._focusMonitor.monitor(this._elementRef, true);
            if (this.isRoundButton) {
                this.color = DEFAULT_ROUND_BUTTON_COLOR;
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        /**
         * Focuses the button.
         * @param {?=} origin
         * @param {?=} options
         * @return {?}
         */
        focus(origin = 'program', options) {
            this._focusMonitor.focusVia(this._getHostElement(), origin, options);
        }
        /**
         * @return {?}
         */
        _getHostElement() {
            return this._elementRef.nativeElement;
        }
        /**
         * @return {?}
         */
        _isRippleDisabled() {
            return this.disableRipple || this.disabled;
        }
        /**
         * Gets whether the button has one of the given attributes.
         * @param {...?} attributes
         * @return {?}
         */
        _hasHostAttributes(...attributes) {
            return attributes.some((/**
             * @param {?} attribute
             * @return {?}
             */
            attribute => this._getHostElement().hasAttribute(attribute)));
        }
    }
    MatButton.decorators = [
        { type: Component, args: [{
                    selector: `button[mat-button], button[mat-raised-button], button[mat-icon-button],
             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],
             button[mat-flat-button]`,
                    exportAs: 'matButton',
                    host: {
                        '[attr.disabled]': 'disabled || null',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        'class': 'mat-focus-indicator',
                    },
                    template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span>\n<div matRipple class=\"mat-button-ripple\"\n     [class.mat-button-ripple-round]=\"isRoundButton || isIconButton\"\n     [matRippleDisabled]=\"_isRippleDisabled()\"\n     [matRippleCentered]=\"isIconButton\"\n     [matRippleTrigger]=\"_getHostElement()\"></div>\n<div class=\"mat-button-focus-overlay\"></div>\n",
                    inputs: ['disabled', 'disableRipple', 'color'],
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{opacity:0}.mat-button:hover .mat-button-focus-overlay,.mat-stroked-button:hover .mat-button-focus-overlay{opacity:.04}@media(hover: none){.mat-button:hover .mat-button-focus-overlay,.mat-stroked-button:hover .mat-button-focus-overlay{opacity:0}}.mat-button,.mat-icon-button,.mat-stroked-button,.mat-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-button[disabled],.mat-icon-button[disabled],.mat-stroked-button[disabled],.mat-flat-button[disabled]{cursor:default}.mat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-button.cdk-program-focused .mat-button-focus-overlay,.mat-icon-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-icon-button.cdk-program-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-program-focused .mat-button-focus-overlay,.mat-flat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-flat-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-raised-button::-moz-focus-inner{border:0}.mat-raised-button[disabled]{cursor:default}.mat-raised-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-raised-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-raised-button::-moz-focus-inner{border:0}._mat-animation-noopable.mat-raised-button{transition:none;animation:none}.mat-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.mat-stroked-button .mat-button-ripple.mat-ripple,.mat-stroked-button .mat-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.mat-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab::-moz-focus-inner{border:0}.mat-fab[disabled]{cursor:default}.mat-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-fab{transition:none;animation:none}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab::-moz-focus-inner{border:0}.mat-mini-fab[disabled]{cursor:default}.mat-mini-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-mini-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-mini-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-mini-fab{transition:none;animation:none}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button i,.mat-icon-button .mat-icon{line-height:24px}.mat-button-ripple.mat-ripple,.mat-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-button-ripple.mat-ripple:not(:empty){transform:translateZ(0)}.mat-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-button-focus-overlay{transition:none}.cdk-high-contrast-active .mat-button-focus-overlay{background-color:#fff}.cdk-high-contrast-black-on-white .mat-button-focus-overlay{background-color:#000}.mat-button-ripple-round{border-radius:50%;z-index:1}.mat-button .mat-button-wrapper>*,.mat-flat-button .mat-button-wrapper>*,.mat-stroked-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-fab .mat-button-wrapper>*,.mat-mini-fab .mat-button-wrapper>*{vertical-align:middle}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button{display:block;font-size:inherit;width:2.5em;height:2.5em}.cdk-high-contrast-active .mat-button,.cdk-high-contrast-active .mat-flat-button,.cdk-high-contrast-active .mat-raised-button,.cdk-high-contrast-active .mat-icon-button,.cdk-high-contrast-active .mat-fab,.cdk-high-contrast-active .mat-mini-fab{outline:solid 1px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatButton.ctorParameters = () => [
        { type: ElementRef },
        { type: FocusMonitor },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ];
    MatButton.propDecorators = {
        ripple: [{ type: ViewChild, args: [MatRipple,] }]
    };
    return MatButton;
})();
export { MatButton };
if (false) {
    /** @type {?} */
    MatButton.ngAcceptInputType_disabled;
    /** @type {?} */
    MatButton.ngAcceptInputType_disableRipple;
    /**
     * Whether the button is round.
     * @type {?}
     */
    MatButton.prototype.isRoundButton;
    /**
     * Whether the button is icon button.
     * @type {?}
     */
    MatButton.prototype.isIconButton;
    /**
     * Reference to the MatRipple instance of the button.
     * @type {?}
     */
    MatButton.prototype.ripple;
    /**
     * @type {?}
     * @private
     */
    MatButton.prototype._focusMonitor;
    /** @type {?} */
    MatButton.prototype._animationMode;
}
/**
 * Material design anchor button.
 */
let MatAnchor = /** @class */ (() => {
    /**
     * Material design anchor button.
     */
    class MatAnchor extends MatButton {
        /**
         * @param {?} focusMonitor
         * @param {?} elementRef
         * @param {?} animationMode
         */
        constructor(focusMonitor, elementRef, animationMode) {
            super(elementRef, focusMonitor, animationMode);
        }
        /**
         * @param {?} event
         * @return {?}
         */
        _haltDisabledEvents(event) {
            // A disabled button shouldn't apply any actions
            if (this.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }
    }
    MatAnchor.decorators = [
        { type: Component, args: [{
                    selector: `a[mat-button], a[mat-raised-button], a[mat-icon-button], a[mat-fab],
             a[mat-mini-fab], a[mat-stroked-button], a[mat-flat-button]`,
                    exportAs: 'matButton, matAnchor',
                    host: {
                        // Note that we ignore the user-specified tabindex when it's disabled for
                        // consistency with the `mat-button` applied on native buttons where even
                        // though they have an index, they're not tabbable.
                        '[attr.tabindex]': 'disabled ? -1 : (tabIndex || 0)',
                        '[attr.disabled]': 'disabled || null',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '(click)': '_haltDisabledEvents($event)',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        'class': 'mat-focus-indicator',
                    },
                    inputs: ['disabled', 'disableRipple', 'color'],
                    template: "<span class=\"mat-button-wrapper\"><ng-content></ng-content></span>\n<div matRipple class=\"mat-button-ripple\"\n     [class.mat-button-ripple-round]=\"isRoundButton || isIconButton\"\n     [matRippleDisabled]=\"_isRippleDisabled()\"\n     [matRippleCentered]=\"isIconButton\"\n     [matRippleTrigger]=\"_getHostElement()\"></div>\n<div class=\"mat-button-focus-overlay\"></div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{opacity:0}.mat-button:hover .mat-button-focus-overlay,.mat-stroked-button:hover .mat-button-focus-overlay{opacity:.04}@media(hover: none){.mat-button:hover .mat-button-focus-overlay,.mat-stroked-button:hover .mat-button-focus-overlay{opacity:0}}.mat-button,.mat-icon-button,.mat-stroked-button,.mat-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-button[disabled],.mat-icon-button[disabled],.mat-stroked-button[disabled],.mat-flat-button[disabled]{cursor:default}.mat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-button.cdk-program-focused .mat-button-focus-overlay,.mat-icon-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-icon-button.cdk-program-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-program-focused .mat-button-focus-overlay,.mat-flat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-flat-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-raised-button::-moz-focus-inner{border:0}.mat-raised-button[disabled]{cursor:default}.mat-raised-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-raised-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-raised-button::-moz-focus-inner{border:0}._mat-animation-noopable.mat-raised-button{transition:none;animation:none}.mat-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.mat-stroked-button .mat-button-ripple.mat-ripple,.mat-stroked-button .mat-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.mat-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab::-moz-focus-inner{border:0}.mat-fab[disabled]{cursor:default}.mat-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-fab{transition:none;animation:none}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab::-moz-focus-inner{border:0}.mat-mini-fab[disabled]{cursor:default}.mat-mini-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-mini-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-mini-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-mini-fab{transition:none;animation:none}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button i,.mat-icon-button .mat-icon{line-height:24px}.mat-button-ripple.mat-ripple,.mat-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-button-ripple.mat-ripple:not(:empty){transform:translateZ(0)}.mat-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-button-focus-overlay{transition:none}.cdk-high-contrast-active .mat-button-focus-overlay{background-color:#fff}.cdk-high-contrast-black-on-white .mat-button-focus-overlay{background-color:#000}.mat-button-ripple-round{border-radius:50%;z-index:1}.mat-button .mat-button-wrapper>*,.mat-flat-button .mat-button-wrapper>*,.mat-stroked-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-fab .mat-button-wrapper>*,.mat-mini-fab .mat-button-wrapper>*{vertical-align:middle}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button{display:block;font-size:inherit;width:2.5em;height:2.5em}.cdk-high-contrast-active .mat-button,.cdk-high-contrast-active .mat-flat-button,.cdk-high-contrast-active .mat-raised-button,.cdk-high-contrast-active .mat-icon-button,.cdk-high-contrast-active .mat-fab,.cdk-high-contrast-active .mat-mini-fab{outline:solid 1px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatAnchor.ctorParameters = () => [
        { type: FocusMonitor },
        { type: ElementRef },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ];
    MatAnchor.propDecorators = {
        tabIndex: [{ type: Input }]
    };
    return MatAnchor;
})();
export { MatAnchor };
if (false) {
    /**
     * Tabindex of the button.
     * @type {?}
     */
    MatAnchor.prototype.tabIndex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBK0IsTUFBTSxtQkFBbUIsQ0FBQztBQUU3RSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBRVYsU0FBUyxFQUNULGlCQUFpQixFQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBT0wsU0FBUyxFQUNULFVBQVUsRUFDVixhQUFhLEVBQ2Isa0JBQWtCLEdBQ25CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O01BR3JFLDBCQUEwQixHQUFHLFFBQVE7Ozs7OztNQU1yQyxzQkFBc0IsR0FBRztJQUM3QixZQUFZO0lBQ1osaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIsb0JBQW9CO0lBQ3BCLGNBQWM7SUFDZCxTQUFTO0NBQ1Y7Ozs7O0FBSUQsTUFBTSxhQUFhOzs7O0lBQ2pCLFlBQW1CLFdBQXVCO1FBQXZCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO0lBQUcsQ0FBQztDQUMvQzs7O0lBRGEsb0NBQThCOzs7TUFHdEMsbUJBQW1CLEdBQ0UsVUFBVSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzs7O0FBS3ZGOzs7O0lBQUEsTUFnQmEsU0FBVSxTQUFRLG1CQUFtQjs7Ozs7O1FBWWhELFlBQVksVUFBc0IsRUFDZCxhQUEyQixFQUNlLGNBQXNCO1lBQ2xGLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUZBLGtCQUFhLEdBQWIsYUFBYSxDQUFjO1lBQ2UsbUJBQWMsR0FBZCxjQUFjLENBQVE7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RUQsbUJBQW1CLENBQUMsS0FBWTtZQUM5QixnREFBZ0Q7WUFDaEQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQzs7O2dCQXRDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFO3dFQUM0RDtvQkFDdEUsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFOzs7O3dCQUlKLGlCQUFpQixFQUFFLGlDQUFpQzt3QkFDcEQsaUJBQWlCLEVBQUUsa0JBQWtCO3dCQUNyQyxzQkFBc0IsRUFBRSxxQkFBcUI7d0JBQzdDLFNBQVMsRUFBRSw2QkFBNkI7d0JBQ3hDLGlDQUFpQyxFQUFFLHFDQUFxQzt3QkFDeEUsT0FBTyxFQUFFLHFCQUFxQjtxQkFDL0I7b0JBQ0QsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUM7b0JBQzlDLHdZQUEwQjtvQkFFMUIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7Ozs7Z0JBOUpPLFlBQVk7Z0JBS2xCLFVBQVU7NkNBaUtQLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7MkJBTDFDLEtBQUs7O0lBZ0JSLGdCQUFDO0tBQUE7U0FsQlksU0FBUzs7Ozs7O0lBRXBCLDZCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzTW9uaXRvciwgRm9jdXNhYmxlT3B0aW9uLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9wdGlvbmFsLFxuICBJbmplY3QsXG4gIElucHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkNvbG9yLFxuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5Db2xvckN0b3IsXG4gIENhbkRpc2FibGVDdG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgTWF0UmlwcGxlLFxuICBtaXhpbkNvbG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBEZWZhdWx0IGNvbG9yIHBhbGV0dGUgZm9yIHJvdW5kIGJ1dHRvbnMgKG1hdC1mYWIgYW5kIG1hdC1taW5pLWZhYikgKi9cbmNvbnN0IERFRkFVTFRfUk9VTkRfQlVUVE9OX0NPTE9SID0gJ2FjY2VudCc7XG5cbi8qKlxuICogTGlzdCBvZiBjbGFzc2VzIHRvIGFkZCB0byBNYXRCdXR0b24gaW5zdGFuY2VzIGJhc2VkIG9uIGhvc3QgYXR0cmlidXRlcyB0b1xuICogc3R5bGUgYXMgZGlmZmVyZW50IHZhcmlhbnRzLlxuICovXG5jb25zdCBCVVRUT05fSE9TVF9BVFRSSUJVVEVTID0gW1xuICAnbWF0LWJ1dHRvbicsXG4gICdtYXQtZmxhdC1idXR0b24nLFxuICAnbWF0LWljb24tYnV0dG9uJyxcbiAgJ21hdC1yYWlzZWQtYnV0dG9uJyxcbiAgJ21hdC1zdHJva2VkLWJ1dHRvbicsXG4gICdtYXQtbWluaS1mYWInLFxuICAnbWF0LWZhYicsXG5dO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEJ1dHRvbi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRCdXR0b25CYXNlIHtcbiAgY29uc3RydWN0b3IocHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuXG5jb25zdCBfTWF0QnV0dG9uTWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIENhbkRpc2FibGVDdG9yICYgQ2FuQ29sb3JDdG9yICZcbiAgICB0eXBlb2YgTWF0QnV0dG9uQmFzZSA9IG1peGluQ29sb3IobWl4aW5EaXNhYmxlZChtaXhpbkRpc2FibGVSaXBwbGUoTWF0QnV0dG9uQmFzZSkpKTtcblxuLyoqXG4gKiBNYXRlcmlhbCBkZXNpZ24gYnV0dG9uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IGBidXR0b25bbWF0LWJ1dHRvbl0sIGJ1dHRvblttYXQtcmFpc2VkLWJ1dHRvbl0sIGJ1dHRvblttYXQtaWNvbi1idXR0b25dLFxuICAgICAgICAgICAgIGJ1dHRvblttYXQtZmFiXSwgYnV0dG9uW21hdC1taW5pLWZhYl0sIGJ1dHRvblttYXQtc3Ryb2tlZC1idXR0b25dLFxuICAgICAgICAgICAgIGJ1dHRvblttYXQtZmxhdC1idXR0b25dYCxcbiAgZXhwb3J0QXM6ICdtYXRCdXR0b24nLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCB8fCBudWxsJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgICAnY2xhc3MnOiAnbWF0LWZvY3VzLWluZGljYXRvcicsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnYnV0dG9uLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYnV0dG9uLmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvciddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QnV0dG9uIGV4dGVuZHMgX01hdEJ1dHRvbk1peGluQmFzZVxuICAgIGltcGxlbWVudHMgT25EZXN0cm95LCBDYW5EaXNhYmxlLCBDYW5Db2xvciwgQ2FuRGlzYWJsZVJpcHBsZSwgRm9jdXNhYmxlT3B0aW9uIHtcblxuICAvKiogV2hldGhlciB0aGUgYnV0dG9uIGlzIHJvdW5kLiAqL1xuICByZWFkb25seSBpc1JvdW5kQnV0dG9uOiBib29sZWFuID0gdGhpcy5faGFzSG9zdEF0dHJpYnV0ZXMoJ21hdC1mYWInLCAnbWF0LW1pbmktZmFiJyk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBpY29uIGJ1dHRvbi4gKi9cbiAgcmVhZG9ubHkgaXNJY29uQnV0dG9uOiBib29sZWFuID0gdGhpcy5faGFzSG9zdEF0dHJpYnV0ZXMoJ21hdC1pY29uLWJ1dHRvbicpO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIE1hdFJpcHBsZSBpbnN0YW5jZSBvZiB0aGUgYnV0dG9uLiAqL1xuICBAVmlld0NoaWxkKE1hdFJpcHBsZSkgcmlwcGxlOiBNYXRSaXBwbGU7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gRm9yIGVhY2ggb2YgdGhlIHZhcmlhbnQgc2VsZWN0b3JzIHRoYXQgaXMgcHJlc2VudCBpbiB0aGUgYnV0dG9uJ3MgaG9zdFxuICAgIC8vIGF0dHJpYnV0ZXMsIGFkZCB0aGUgY29ycmVjdCBjb3JyZXNwb25kaW5nIGNsYXNzLlxuICAgIGZvciAoY29uc3QgYXR0ciBvZiBCVVRUT05fSE9TVF9BVFRSSUJVVEVTKSB7XG4gICAgICBpZiAodGhpcy5faGFzSG9zdEF0dHJpYnV0ZXMoYXR0cikpIHtcbiAgICAgICAgKHRoaXMuX2dldEhvc3RFbGVtZW50KCkgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5hZGQoYXR0cik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgY2xhc3MgdGhhdCBhcHBsaWVzIHRvIGFsbCBidXR0b25zLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0byB0YXJnZXQgaWYgc29tZWJvZHlcbiAgICAvLyB3YW50cyB0byB0YXJnZXQgYWxsIE1hdGVyaWFsIGJ1dHRvbnMuIFdlIGRvIGl0IGhlcmUgcmF0aGVyIHRoYW4gYGhvc3RgIHRvIGVuc3VyZSB0aGF0XG4gICAgLy8gdGhlIGNsYXNzIGlzIGFwcGxpZWQgdG8gZGVyaXZlZCBjbGFzc2VzLlxuICAgIGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtYnV0dG9uLWJhc2UnKTtcblxuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMuaXNSb3VuZEJ1dHRvbikge1xuICAgICAgdGhpcy5jb2xvciA9IERFRkFVTFRfUk9VTkRfQlVUVE9OX0NPTE9SO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBidXR0b24uICovXG4gIGZvY3VzKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZ2V0SG9zdEVsZW1lbnQoKSwgb3JpZ2luLCBvcHRpb25zKTtcbiAgfVxuXG4gIF9nZXRIb3N0RWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgX2lzUmlwcGxlRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgYnV0dG9uIGhhcyBvbmUgb2YgdGhlIGdpdmVuIGF0dHJpYnV0ZXMuICovXG4gIF9oYXNIb3N0QXR0cmlidXRlcyguLi5hdHRyaWJ1dGVzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBhdHRyaWJ1dGVzLnNvbWUoYXR0cmlidXRlID0+IHRoaXMuX2dldEhvc3RFbGVtZW50KCkuaGFzQXR0cmlidXRlKGF0dHJpYnV0ZSkpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBCb29sZWFuSW5wdXQ7XG59XG5cbi8qKlxuICogTWF0ZXJpYWwgZGVzaWduIGFuY2hvciBidXR0b24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogYGFbbWF0LWJ1dHRvbl0sIGFbbWF0LXJhaXNlZC1idXR0b25dLCBhW21hdC1pY29uLWJ1dHRvbl0sIGFbbWF0LWZhYl0sXG4gICAgICAgICAgICAgYVttYXQtbWluaS1mYWJdLCBhW21hdC1zdHJva2VkLWJ1dHRvbl0sIGFbbWF0LWZsYXQtYnV0dG9uXWAsXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uLCBtYXRBbmNob3InLFxuICBob3N0OiB7XG4gICAgLy8gTm90ZSB0aGF0IHdlIGlnbm9yZSB0aGUgdXNlci1zcGVjaWZpZWQgdGFiaW5kZXggd2hlbiBpdCdzIGRpc2FibGVkIGZvclxuICAgIC8vIGNvbnNpc3RlbmN5IHdpdGggdGhlIGBtYXQtYnV0dG9uYCBhcHBsaWVkIG9uIG5hdGl2ZSBidXR0b25zIHdoZXJlIGV2ZW5cbiAgICAvLyB0aG91Z2ggdGhleSBoYXZlIGFuIGluZGV4LCB0aGV5J3JlIG5vdCB0YWJiYWJsZS5cbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiAodGFiSW5kZXggfHwgMCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICcoY2xpY2spJzogJ19oYWx0RGlzYWJsZWRFdmVudHMoJGV2ZW50KScsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ2NsYXNzJzogJ21hdC1mb2N1cy1pbmRpY2F0b3InLFxuICB9LFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICdjb2xvciddLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2J1dHRvbi5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEFuY2hvciBleHRlbmRzIE1hdEJ1dHRvbiB7XG4gIC8qKiBUYWJpbmRleCBvZiB0aGUgYnV0dG9uLiAqL1xuICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU6IHN0cmluZykge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGZvY3VzTW9uaXRvciwgYW5pbWF0aW9uTW9kZSk7XG4gIH1cblxuICBfaGFsdERpc2FibGVkRXZlbnRzKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIEEgZGlzYWJsZWQgYnV0dG9uIHNob3VsZG4ndCBhcHBseSBhbnkgYWN0aW9uc1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=