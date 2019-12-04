/**
 * @fileoverview added by tsickle
 * Generated from: src/material/menu/menu-item.ts
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
import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, Inject, Optional, Input, HostListener, } from '@angular/core';
import { mixinDisabled, mixinDisableRipple, } from '@angular/material/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MAT_MENU_PANEL } from './menu-panel';
// Boilerplate for applying mixins to MatMenuItem.
/**
 * \@docs-private
 */
class MatMenuItemBase {
}
/** @type {?} */
const _MatMenuItemMixinBase = mixinDisableRipple(mixinDisabled(MatMenuItemBase));
/**
 * This directive is intended to be used inside an mat-menu tag.
 * It exists mostly to set the role attribute.
 */
export class MatMenuItem extends _MatMenuItemMixinBase {
    /**
     * @param {?} _elementRef
     * @param {?=} document
     * @param {?=} _focusMonitor
     * @param {?=} _parentMenu
     */
    constructor(_elementRef, document, _focusMonitor, _parentMenu) {
        // @breaking-change 8.0.0 make `_focusMonitor` and `document` required params.
        super();
        this._elementRef = _elementRef;
        this._focusMonitor = _focusMonitor;
        this._parentMenu = _parentMenu;
        /**
         * ARIA role for the menu item.
         */
        this.role = 'menuitem';
        /**
         * Stream that emits when the menu item is hovered.
         */
        this._hovered = new Subject();
        /**
         * Stream that emits when the menu item is focused.
         */
        this._focused = new Subject();
        /**
         * Whether the menu item is highlighted.
         */
        this._highlighted = false;
        /**
         * Whether the menu item acts as a trigger for a sub-menu.
         */
        this._triggersSubmenu = false;
        if (_focusMonitor) {
            // Start monitoring the element so it gets the appropriate focused classes. We want
            // to show the focus style for menu items only when the focus was not caused by a
            // mouse or touch interaction.
            _focusMonitor.monitor(this._elementRef, false);
        }
        if (_parentMenu && _parentMenu.addItem) {
            _parentMenu.addItem(this);
        }
        this._document = document;
    }
    /**
     * Focuses the menu item.
     * @param {?=} origin
     * @param {?=} options
     * @return {?}
     */
    focus(origin = 'program', options) {
        if (this._focusMonitor) {
            this._focusMonitor.focusVia(this._getHostElement(), origin, options);
        }
        else {
            this._getHostElement().focus(options);
        }
        this._focused.next(this);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this._focusMonitor) {
            this._focusMonitor.stopMonitoring(this._elementRef);
        }
        if (this._parentMenu && this._parentMenu.removeItem) {
            this._parentMenu.removeItem(this);
        }
        this._hovered.complete();
        this._focused.complete();
    }
    /**
     * Used to set the `tabindex`.
     * @return {?}
     */
    _getTabIndex() {
        return this.disabled ? '-1' : '0';
    }
    /**
     * Returns the host DOM element.
     * @return {?}
     */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /**
     * Prevents the default element actions if it is disabled.
     * @param {?} event
     * @return {?}
     */
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    _checkDisabled(event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    /**
     * Emits to the hover stream.
     * @return {?}
     */
    // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
    // In Ivy the `host` bindings will be merged when this class is extended, whereas in
    // ViewEngine they're overwritten.
    // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
    // tslint:disable-next-line:no-host-decorator-in-concrete
    _handleMouseEnter() {
        this._hovered.next(this);
    }
    /**
     * Gets the label to be used when determining whether the option should be focused.
     * @return {?}
     */
    getLabel() {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        const textNodeType = this._document ? this._document.TEXT_NODE : 3;
        /** @type {?} */
        let output = '';
        if (element.childNodes) {
            /** @type {?} */
            const length = element.childNodes.length;
            // Go through all the top-level text nodes and extract their text.
            // We skip anything that's not a text node to prevent the text from
            // being thrown off by something like an icon.
            for (let i = 0; i < length; i++) {
                if (element.childNodes[i].nodeType === textNodeType) {
                    output += element.childNodes[i].textContent;
                }
            }
        }
        return output.trim();
    }
}
MatMenuItem.decorators = [
    { type: Component, args: [{
                selector: '[mat-menu-item]',
                exportAs: 'matMenuItem',
                inputs: ['disabled', 'disableRipple'],
                host: {
                    '[attr.role]': 'role',
                    'class': 'mat-menu-item',
                    '[class.mat-menu-item-highlighted]': '_highlighted',
                    '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                    '[attr.tabindex]': '_getTabIndex()',
                    '[attr.aria-disabled]': 'disabled.toString()',
                    '[attr.disabled]': 'disabled || null',
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: "<ng-content></ng-content>\n<div class=\"mat-menu-ripple\" matRipple\n     [matRippleDisabled]=\"disableRipple || disabled\"\n     [matRippleTrigger]=\"_getHostElement()\">\n</div>\n"
            }] }
];
/** @nocollapse */
MatMenuItem.ctorParameters = () => [
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: FocusMonitor },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_MENU_PANEL,] }, { type: Optional }] }
];
MatMenuItem.propDecorators = {
    role: [{ type: Input }],
    _checkDisabled: [{ type: HostListener, args: ['click', ['$event'],] }],
    _handleMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
};
if (false) {
    /** @type {?} */
    MatMenuItem.ngAcceptInputType_disabled;
    /** @type {?} */
    MatMenuItem.ngAcceptInputType_disableRipple;
    /**
     * ARIA role for the menu item.
     * @type {?}
     */
    MatMenuItem.prototype.role;
    /**
     * @type {?}
     * @private
     */
    MatMenuItem.prototype._document;
    /**
     * Stream that emits when the menu item is hovered.
     * @type {?}
     */
    MatMenuItem.prototype._hovered;
    /**
     * Stream that emits when the menu item is focused.
     * @type {?}
     */
    MatMenuItem.prototype._focused;
    /**
     * Whether the menu item is highlighted.
     * @type {?}
     */
    MatMenuItem.prototype._highlighted;
    /**
     * Whether the menu item acts as a trigger for a sub-menu.
     * @type {?}
     */
    MatMenuItem.prototype._triggersSubmenu;
    /**
     * @type {?}
     * @private
     */
    MatMenuItem.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatMenuItem.prototype._focusMonitor;
    /** @type {?} */
    MatMenuItem.prototype._parentMenu;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFDOzs7OztBQUkxRCxNQUFNLGVBQWU7Q0FBRzs7TUFDbEIscUJBQXFCLEdBQ3ZCLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Ozs7QUF1QnRELE1BQU0sT0FBTyxXQUFZLFNBQVEscUJBQXFCOzs7Ozs7O0lBb0JwRCxZQUNVLFdBQW9DLEVBQzFCLFFBQWMsRUFDeEIsYUFBNEIsRUFDTyxXQUF1QztRQUVsRiw4RUFBOEU7UUFDOUUsS0FBSyxFQUFFLENBQUM7UUFOQSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFFcEMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFDTyxnQkFBVyxHQUFYLFdBQVcsQ0FBNEI7Ozs7UUFwQjNFLFNBQUksR0FBc0QsVUFBVSxDQUFDOzs7O1FBS3JFLGFBQVEsR0FBeUIsSUFBSSxPQUFPLEVBQWUsQ0FBQzs7OztRQUc1RCxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQWUsQ0FBQzs7OztRQUcv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O1NBQ0Y7UUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDOzs7WUEzSUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osYUFBYSxFQUFFLE1BQU07b0JBQ3JCLE9BQU8sRUFBRSxlQUFlO29CQUN4QixtQ0FBbUMsRUFBRSxjQUFjO29CQUNuRCx1Q0FBdUMsRUFBRSxrQkFBa0I7b0JBQzNELGlCQUFpQixFQUFFLGdCQUFnQjtvQkFDbkMsc0JBQXNCLEVBQUUscUJBQXFCO29CQUM3QyxpQkFBaUIsRUFBRSxrQkFBa0I7aUJBQ3RDO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsaU1BQTZCO2FBQzlCOzs7O1lBNUNDLFVBQVU7NENBbUVQLE1BQU0sU0FBQyxRQUFRO1lBdkVLLFlBQVk7NENBeUVoQyxNQUFNLFNBQUMsY0FBYyxjQUFHLFFBQVE7OzttQkFwQmxDLEtBQUs7NkJBK0VMLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0NBY2hDLFlBQVksU0FBQyxZQUFZOzs7O0lBMkIxQix1Q0FBdUU7O0lBQ3ZFLDRDQUE0RTs7Ozs7SUF6SDVFLDJCQUE4RTs7Ozs7SUFFOUUsZ0NBQTRCOzs7OztJQUc1QiwrQkFBcUU7Ozs7O0lBR3JFLCtCQUErQzs7Ozs7SUFHL0MsbUNBQThCOzs7OztJQUc5Qix1Q0FBa0M7Ozs7O0lBR2hDLGtDQUE0Qzs7Ozs7SUFFNUMsb0NBQW9DOztJQUNwQyxrQ0FBa0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvciwgRm9jdXNPcmlnaW59IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG4gIElucHV0LFxuICBIb3N0TGlzdGVuZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSwgQ2FuRGlzYWJsZUN0b3IsXG4gIENhbkRpc2FibGVSaXBwbGUsIENhbkRpc2FibGVSaXBwbGVDdG9yLFxuICBtaXhpbkRpc2FibGVkLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge01BVF9NRU5VX1BBTkVMLCBNYXRNZW51UGFuZWx9IGZyb20gJy4vbWVudS1wYW5lbCc7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0TWVudUl0ZW0uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0TWVudUl0ZW1CYXNlIHt9XG5jb25zdCBfTWF0TWVudUl0ZW1NaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0TWVudUl0ZW1CYXNlID1cbiAgICBtaXhpbkRpc2FibGVSaXBwbGUobWl4aW5EaXNhYmxlZChNYXRNZW51SXRlbUJhc2UpKTtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIGluc2lkZSBhbiBtYXQtbWVudSB0YWcuXG4gKiBJdCBleGlzdHMgbW9zdGx5IHRvIHNldCB0aGUgcm9sZSBhdHRyaWJ1dGUuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1ttYXQtbWVudS1pdGVtXScsXG4gIGV4cG9ydEFzOiAnbWF0TWVudUl0ZW0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUnLFxuICAgICdjbGFzcyc6ICdtYXQtbWVudS1pdGVtJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW0taGlnaGxpZ2h0ZWRdJzogJ19oaWdobGlnaHRlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWVudS1pdGVtLXN1Ym1lbnUtdHJpZ2dlcl0nOiAnX3RyaWdnZXJzU3VibWVudScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJ21lbnUtaXRlbS5odG1sJyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TWVudUl0ZW0gZXh0ZW5kcyBfTWF0TWVudUl0ZW1NaXhpbkJhc2VcbiAgICBpbXBsZW1lbnRzIEZvY3VzYWJsZU9wdGlvbiwgQ2FuRGlzYWJsZSwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95IHtcblxuICAvKiogQVJJQSByb2xlIGZvciB0aGUgbWVudSBpdGVtLiAqL1xuICBASW5wdXQoKSByb2xlOiAnbWVudWl0ZW0nIHwgJ21lbnVpdGVtcmFkaW8nIHwgJ21lbnVpdGVtY2hlY2tib3gnID0gJ21lbnVpdGVtJztcblxuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBob3ZlcmVkLiAqL1xuICByZWFkb25seSBfaG92ZXJlZDogU3ViamVjdDxNYXRNZW51SXRlbT4gPSBuZXcgU3ViamVjdDxNYXRNZW51SXRlbT4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgd2hlbiB0aGUgbWVudSBpdGVtIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IF9mb2N1c2VkID0gbmV3IFN1YmplY3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBpcyBoaWdobGlnaHRlZC4gKi9cbiAgX2hpZ2hsaWdodGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG1lbnUgaXRlbSBhY3RzIGFzIGEgdHJpZ2dlciBmb3IgYSBzdWItbWVudS4gKi9cbiAgX3RyaWdnZXJzU3VibWVudTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55LFxuICAgIHByaXZhdGUgX2ZvY3VzTW9uaXRvcj86IEZvY3VzTW9uaXRvcixcbiAgICBASW5qZWN0KE1BVF9NRU5VX1BBTkVMKSBAT3B0aW9uYWwoKSBwdWJsaWMgX3BhcmVudE1lbnU/OiBNYXRNZW51UGFuZWw8TWF0TWVudUl0ZW0+KSB7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDguMC4wIG1ha2UgYF9mb2N1c01vbml0b3JgIGFuZCBgZG9jdW1lbnRgIHJlcXVpcmVkIHBhcmFtcy5cbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKF9mb2N1c01vbml0b3IpIHtcbiAgICAgIC8vIFN0YXJ0IG1vbml0b3JpbmcgdGhlIGVsZW1lbnQgc28gaXQgZ2V0cyB0aGUgYXBwcm9wcmlhdGUgZm9jdXNlZCBjbGFzc2VzLiBXZSB3YW50XG4gICAgICAvLyB0byBzaG93IHRoZSBmb2N1cyBzdHlsZSBmb3IgbWVudSBpdGVtcyBvbmx5IHdoZW4gdGhlIGZvY3VzIHdhcyBub3QgY2F1c2VkIGJ5IGFcbiAgICAgIC8vIG1vdXNlIG9yIHRvdWNoIGludGVyYWN0aW9uLlxuICAgICAgX2ZvY3VzTW9uaXRvci5tb25pdG9yKHRoaXMuX2VsZW1lbnRSZWYsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBpZiAoX3BhcmVudE1lbnUgJiYgX3BhcmVudE1lbnUuYWRkSXRlbSkge1xuICAgICAgX3BhcmVudE1lbnUuYWRkSXRlbSh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIG1lbnUgaXRlbS4gKi9cbiAgZm9jdXMob3JpZ2luOiBGb2N1c09yaWdpbiA9ICdwcm9ncmFtJywgb3B0aW9ucz86IEZvY3VzT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5mb2N1c1ZpYSh0aGlzLl9nZXRIb3N0RWxlbWVudCgpLCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9nZXRIb3N0RWxlbWVudCgpLmZvY3VzKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuX2ZvY3VzZWQubmV4dCh0aGlzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLl9mb2N1c01vbml0b3IpIHtcbiAgICAgIHRoaXMuX2ZvY3VzTW9uaXRvci5zdG9wTW9uaXRvcmluZyh0aGlzLl9lbGVtZW50UmVmKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50TWVudSAmJiB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0pIHtcbiAgICAgIHRoaXMuX3BhcmVudE1lbnUucmVtb3ZlSXRlbSh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9ob3ZlcmVkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZm9jdXNlZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIFVzZWQgdG8gc2V0IHRoZSBgdGFiaW5kZXhgLiAqL1xuICBfZ2V0VGFiSW5kZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCA/ICctMScgOiAnMCc7XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgaG9zdCBET00gZWxlbWVudC4gKi9cbiAgX2dldEhvc3RFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgLyoqIFByZXZlbnRzIHRoZSBkZWZhdWx0IGVsZW1lbnQgYWN0aW9ucyBpZiBpdCBpcyBkaXNhYmxlZC4gKi9cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSlcbiAgX2NoZWNrRGlzYWJsZWQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cblxuICAvKiogRW1pdHMgdG8gdGhlIGhvdmVyIHN0cmVhbS4gKi9cbiAgLy8gV2UgaGF2ZSB0byB1c2UgYSBgSG9zdExpc3RlbmVyYCBoZXJlIGluIG9yZGVyIHRvIHN1cHBvcnQgYm90aCBJdnkgYW5kIFZpZXdFbmdpbmUuXG4gIC8vIEluIEl2eSB0aGUgYGhvc3RgIGJpbmRpbmdzIHdpbGwgYmUgbWVyZ2VkIHdoZW4gdGhpcyBjbGFzcyBpcyBleHRlbmRlZCwgd2hlcmVhcyBpblxuICAvLyBWaWV3RW5naW5lIHRoZXkncmUgb3ZlcndyaXR0ZW4uXG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB3ZSBtb3ZlIHRoaXMgYmFjayBpbnRvIGBob3N0YCBvbmNlIEl2eSBpcyB0dXJuZWQgb24gYnkgZGVmYXVsdC5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtZGVjb3JhdG9yLWluLWNvbmNyZXRlXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBfaGFuZGxlTW91c2VFbnRlcigpIHtcbiAgICB0aGlzLl9ob3ZlcmVkLm5leHQodGhpcyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGFiZWwgdG8gYmUgdXNlZCB3aGVuIGRldGVybWluaW5nIHdoZXRoZXIgdGhlIG9wdGlvbiBzaG91bGQgYmUgZm9jdXNlZC4gKi9cbiAgZ2V0TGFiZWwoKTogc3RyaW5nIHtcbiAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0ZXh0Tm9kZVR5cGUgPSB0aGlzLl9kb2N1bWVudCA/IHRoaXMuX2RvY3VtZW50LlRFWFRfTk9ERSA6IDM7XG4gICAgbGV0IG91dHB1dCA9ICcnO1xuXG4gICAgaWYgKGVsZW1lbnQuY2hpbGROb2Rlcykge1xuICAgICAgY29uc3QgbGVuZ3RoID0gZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aDtcblxuICAgICAgLy8gR28gdGhyb3VnaCBhbGwgdGhlIHRvcC1sZXZlbCB0ZXh0IG5vZGVzIGFuZCBleHRyYWN0IHRoZWlyIHRleHQuXG4gICAgICAvLyBXZSBza2lwIGFueXRoaW5nIHRoYXQncyBub3QgYSB0ZXh0IG5vZGUgdG8gcHJldmVudCB0aGUgdGV4dCBmcm9tXG4gICAgICAvLyBiZWluZyB0aHJvd24gb2ZmIGJ5IHNvbWV0aGluZyBsaWtlIGFuIGljb24uXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlbGVtZW50LmNoaWxkTm9kZXNbaV0ubm9kZVR5cGUgPT09IHRleHROb2RlVHlwZSkge1xuICAgICAgICAgIG91dHB1dCArPSBlbGVtZW50LmNoaWxkTm9kZXNbaV0udGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0LnRyaW0oKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlUmlwcGxlOiBib29sZWFuIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==