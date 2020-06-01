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
/** @docs-private */
class MatMenuItemBase {
}
const _MatMenuItemMixinBase = mixinDisableRipple(mixinDisabled(MatMenuItemBase));
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
let MatMenuItem = /** @class */ (() => {
    class MatMenuItem extends _MatMenuItemMixinBase {
        constructor(_elementRef, document, _focusMonitor, _parentMenu) {
            // @breaking-change 8.0.0 make `_focusMonitor` and `document` required params.
            super();
            this._elementRef = _elementRef;
            this._focusMonitor = _focusMonitor;
            this._parentMenu = _parentMenu;
            /** ARIA role for the menu item. */
            this.role = 'menuitem';
            /** Stream that emits when the menu item is hovered. */
            this._hovered = new Subject();
            /** Stream that emits when the menu item is focused. */
            this._focused = new Subject();
            /** Whether the menu item is highlighted. */
            this._highlighted = false;
            /** Whether the menu item acts as a trigger for a sub-menu. */
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
        /** Focuses the menu item. */
        focus(origin = 'program', options) {
            if (this._focusMonitor) {
                this._focusMonitor.focusVia(this._getHostElement(), origin, options);
            }
            else {
                this._getHostElement().focus(options);
            }
            this._focused.next(this);
        }
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
        /** Used to set the `tabindex`. */
        _getTabIndex() {
            return this.disabled ? '-1' : '0';
        }
        /** Returns the host DOM element. */
        _getHostElement() {
            return this._elementRef.nativeElement;
        }
        /** Prevents the default element actions if it is disabled. */
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
        /** Emits to the hover stream. */
        // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
        // In Ivy the `host` bindings will be merged when this class is extended, whereas in
        // ViewEngine they're overwritten.
        // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
        // tslint:disable-next-line:no-host-decorator-in-concrete
        _handleMouseEnter() {
            this._hovered.next(this);
        }
        /** Gets the label to be used when determining whether the option should be focused. */
        getLabel() {
            const element = this._elementRef.nativeElement;
            const textNodeType = this._document ? this._document.TEXT_NODE : 3;
            let output = '';
            if (element.childNodes) {
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
                        '[class.mat-menu-item]': 'true',
                        '[class.mat-menu-item-highlighted]': '_highlighted',
                        '[class.mat-menu-item-submenu-trigger]': '_triggersSubmenu',
                        '[attr.tabindex]': '_getTabIndex()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.disabled]': 'disabled || null',
                        'class': 'mat-focus-indicator',
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
    return MatMenuItem;
})();
export { MatMenuItem };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS1pdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL21lbnUvbWVudS1pdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBa0IsWUFBWSxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFFN0UsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUVWLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUdMLGFBQWEsRUFDYixrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsY0FBYyxFQUFlLE1BQU0sY0FBYyxDQUFDO0FBRTFELGtEQUFrRDtBQUNsRCxvQkFBb0I7QUFDcEIsTUFBTSxlQUFlO0NBQUc7QUFDeEIsTUFBTSxxQkFBcUIsR0FDdkIsa0JBQWtCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFFdkQ7O0dBRUc7QUFDSDtJQUFBLE1Ba0JhLFdBQVksU0FBUSxxQkFBcUI7UUFvQnBELFlBQ1UsV0FBb0MsRUFDMUIsUUFBYyxFQUN4QixhQUE0QixFQUNPLFdBQXVDO1lBRWxGLDhFQUE4RTtZQUM5RSxLQUFLLEVBQUUsQ0FBQztZQU5BLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtZQUVwQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtZQUNPLGdCQUFXLEdBQVgsV0FBVyxDQUE0QjtZQXJCcEYsbUNBQW1DO1lBQzFCLFNBQUksR0FBc0QsVUFBVSxDQUFDO1lBSTlFLHVEQUF1RDtZQUM5QyxhQUFRLEdBQXlCLElBQUksT0FBTyxF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QUMsUUFBUSxDQUFDO29DQWNoQyxZQUFZLFNBQUMsWUFBWTs7SUE2QjVCLGtCQUFDO0tBQUE7U0E5SFksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0ZvY3VzYWJsZU9wdGlvbiwgRm9jdXNNb25pdG9yLCBGb2N1c09yaWdpbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBJbnB1dCxcbiAgSG9zdExpc3RlbmVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLFxuICBDYW5EaXNhYmxlUmlwcGxlLCBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtNQVRfTUVOVV9QQU5FTCwgTWF0TWVudVBhbmVsfSBmcm9tICcuL21lbnUtcGFuZWwnO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdE1lbnVJdGVtLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdE1lbnVJdGVtQmFzZSB7fVxuY29uc3QgX01hdE1lbnVJdGVtTWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdE1lbnVJdGVtQmFzZSA9XG4gICAgbWl4aW5EaXNhYmxlUmlwcGxlKG1peGluRGlzYWJsZWQoTWF0TWVudUl0ZW1CYXNlKSk7XG5cbi8qKlxuICogU2luZ2xlIGl0ZW0gaW5zaWRlIG9mIGEgYG1hdC1tZW51YC4gUHJvdmlkZXMgdGhlIG1lbnUgaXRlbSBzdHlsaW5nIGFuZCBhY2Nlc3NpYmlsaXR5IHRyZWF0bWVudC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW21hdC1tZW51LWl0ZW1dJyxcbiAgZXhwb3J0QXM6ICdtYXRNZW51SXRlbScsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZScsXG4gICAgJ1tjbGFzcy5tYXQtbWVudS1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm1hdC1tZW51LWl0ZW0taGlnaGxpZ2h0ZWRdJzogJ19oaWdobGlnaHRlZCcsXG4gICAgJ1tjbGFzcy5tYXQtbWVudS1pdGVtLXN1Ym1lbnUtdHJpZ2dlcl0nOiAnX3RyaWdnZXJzU3VibWVudScsXG4gICAgJ1thdHRyLnRhYmluZGV4XSc6ICdfZ2V0VGFiSW5kZXgoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkLnRvU3RyaW5nKCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQgfHwgbnVsbCcsXG4gICAgJ2NsYXNzJzogJ21hdC1mb2N1cy1pbmRpY2F0b3InLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGVVcmw6ICdtZW51LWl0ZW0uaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIE1hdE1lbnVJdGVtIGV4dGVuZHMgX01hdE1lbnVJdGVtTWl4aW5CYXNlXG4gICAgaW1wbGVtZW50cyBGb2N1c2FibGVPcHRpb24sIENhbkRpc2FibGUsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveSB7XG5cbiAgLyoqIEFSSUEgcm9sZSBmb3IgdGhlIG1lbnUgaXRlbS4gKi9cbiAgQElucHV0KCkgcm9sZTogJ21lbnVpdGVtJyB8ICdtZW51aXRlbXJhZGlvJyB8ICdtZW51aXRlbWNoZWNrYm94JyA9ICdtZW51aXRlbSc7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuIHRoZSBtZW51IGl0ZW0gaXMgaG92ZXJlZC4gKi9cbiAgcmVhZG9ubHkgX2hvdmVyZWQ6IFN1YmplY3Q8TWF0TWVudUl0ZW0+ID0gbmV3IFN1YmplY3Q8TWF0TWVudUl0ZW0+KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1lbnUgaXRlbSBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBfZm9jdXNlZCA9IG5ldyBTdWJqZWN0PE1hdE1lbnVJdGVtPigpO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGl0ZW0gaXMgaGlnaGxpZ2h0ZWQuICovXG4gIF9oaWdobGlnaHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBtZW51IGl0ZW0gYWN0cyBhcyBhIHRyaWdnZXIgZm9yIGEgc3ViLW1lbnUuICovXG4gIF90cmlnZ2Vyc1N1Ym1lbnU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSxcbiAgICBwcml2YXRlIF9mb2N1c01vbml0b3I/OiBGb2N1c01vbml0b3IsXG4gICAgQEluamVjdChNQVRfTUVOVV9QQU5FTCkgQE9wdGlvbmFsKCkgcHVibGljIF9wYXJlbnRNZW51PzogTWF0TWVudVBhbmVsPE1hdE1lbnVJdGVtPikge1xuXG4gICAgLy8gQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBtYWtlIGBfZm9jdXNNb25pdG9yYCBhbmQgYGRvY3VtZW50YCByZXF1aXJlZCBwYXJhbXMuXG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChfZm9jdXNNb25pdG9yKSB7XG4gICAgICAvLyBTdGFydCBtb25pdG9yaW5nIHRoZSBlbGVtZW50IHNvIGl0IGdldHMgdGhlIGFwcHJvcHJpYXRlIGZvY3VzZWQgY2xhc3Nlcy4gV2Ugd2FudFxuICAgICAgLy8gdG8gc2hvdyB0aGUgZm9jdXMgc3R5bGUgZm9yIG1lbnUgaXRlbXMgb25seSB3aGVuIHRoZSBmb2N1cyB3YXMgbm90IGNhdXNlZCBieSBhXG4gICAgICAvLyBtb3VzZSBvciB0b3VjaCBpbnRlcmFjdGlvbi5cbiAgICAgIF9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLl9lbGVtZW50UmVmLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKF9wYXJlbnRNZW51ICYmIF9wYXJlbnRNZW51LmFkZEl0ZW0pIHtcbiAgICAgIF9wYXJlbnRNZW51LmFkZEl0ZW0odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBtZW51IGl0ZW0uICovXG4gIGZvY3VzKG9yaWdpbjogRm9jdXNPcmlnaW4gPSAncHJvZ3JhbScsIG9wdGlvbnM/OiBGb2N1c09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5fZ2V0SG9zdEVsZW1lbnQoKSwgb3JpZ2luLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZ2V0SG9zdEVsZW1lbnQoKS5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLl9mb2N1c2VkLm5leHQodGhpcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5fZm9jdXNNb25pdG9yKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5fZWxlbWVudFJlZik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudE1lbnUgJiYgdGhpcy5fcGFyZW50TWVudS5yZW1vdmVJdGVtKSB7XG4gICAgICB0aGlzLl9wYXJlbnRNZW51LnJlbW92ZUl0ZW0odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5faG92ZXJlZC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2ZvY3VzZWQuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBVc2VkIHRvIHNldCB0aGUgYHRhYmluZGV4YC4gKi9cbiAgX2dldFRhYkluZGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgPyAnLTEnIDogJzAnO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIGhvc3QgRE9NIGVsZW1lbnQuICovXG4gIF9nZXRIb3N0RWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBQcmV2ZW50cyB0aGUgZGVmYXVsdCBlbGVtZW50IGFjdGlvbnMgaWYgaXQgaXMgZGlzYWJsZWQuICovXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIF9jaGVja0Rpc2FibGVkKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEVtaXRzIHRvIHRoZSBob3ZlciBzdHJlYW0uICovXG4gIC8vIFdlIGhhdmUgdG8gdXNlIGEgYEhvc3RMaXN0ZW5lcmAgaGVyZSBpbiBvcmRlciB0byBzdXBwb3J0IGJvdGggSXZ5IGFuZCBWaWV3RW5naW5lLlxuICAvLyBJbiBJdnkgdGhlIGBob3N0YCBiaW5kaW5ncyB3aWxsIGJlIG1lcmdlZCB3aGVuIHRoaXMgY2xhc3MgaXMgZXh0ZW5kZWQsIHdoZXJlYXMgaW5cbiAgLy8gVmlld0VuZ2luZSB0aGV5J3JlIG92ZXJ3cml0dGVuLlxuICAvLyBUT0RPKGNyaXNiZXRvKTogd2UgbW92ZSB0aGlzIGJhY2sgaW50byBgaG9zdGAgb25jZSBJdnkgaXMgdHVybmVkIG9uIGJ5IGRlZmF1bHQuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1ob3N0LWRlY29yYXRvci1pbi1jb25jcmV0ZVxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgX2hhbmRsZU1vdXNlRW50ZXIoKSB7XG4gICAgdGhpcy5faG92ZXJlZC5uZXh0KHRoaXMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGxhYmVsIHRvIGJlIHVzZWQgd2hlbiBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBvcHRpb24gc2hvdWxkIGJlIGZvY3VzZWQuICovXG4gIGdldExhYmVsKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgdGV4dE5vZGVUeXBlID0gdGhpcy5fZG9jdW1lbnQgPyB0aGlzLl9kb2N1bWVudC5URVhUX05PREUgOiAzO1xuICAgIGxldCBvdXRwdXQgPSAnJztcblxuICAgIGlmIChlbGVtZW50LmNoaWxkTm9kZXMpIHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IGVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGg7XG5cbiAgICAgIC8vIEdvIHRocm91Z2ggYWxsIHRoZSB0b3AtbGV2ZWwgdGV4dCBub2RlcyBhbmQgZXh0cmFjdCB0aGVpciB0ZXh0LlxuICAgICAgLy8gV2Ugc2tpcCBhbnl0aGluZyB0aGF0J3Mgbm90IGEgdGV4dCBub2RlIHRvIHByZXZlbnQgdGhlIHRleHQgZnJvbVxuICAgICAgLy8gYmVpbmcgdGhyb3duIG9mZiBieSBzb21ldGhpbmcgbGlrZSBhbiBpY29uLlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzW2ldLm5vZGVUeXBlID09PSB0ZXh0Tm9kZVR5cGUpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gZWxlbWVudC5jaGlsZE5vZGVzW2ldLnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dHB1dC50cmltKCk7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==