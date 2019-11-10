/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, mixinDisableRipple, } from '@angular/material/core';
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueAutocompleteIdCounter = 0;
/** Event object that is emitted when an autocomplete option is selected. */
var MatAutocompleteSelectedEvent = /** @class */ (function () {
    function MatAutocompleteSelectedEvent(
    /** Reference to the autocomplete panel that emitted the event. */
    source, 
    /** Option that was selected. */
    option) {
        this.source = source;
        this.option = option;
    }
    return MatAutocompleteSelectedEvent;
}());
export { MatAutocompleteSelectedEvent };
// Boilerplate for applying mixins to MatAutocomplete.
/** @docs-private */
var MatAutocompleteBase = /** @class */ (function () {
    function MatAutocompleteBase() {
    }
    return MatAutocompleteBase;
}());
var _MatAutocompleteMixinBase = mixinDisableRipple(MatAutocompleteBase);
/** Injection token to be used to override the default options for `mat-autocomplete`. */
export var MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken('mat-autocomplete-default-options', {
    providedIn: 'root',
    factory: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY() {
    return { autoActiveFirstOption: false };
}
var MatAutocomplete = /** @class */ (function (_super) {
    __extends(MatAutocomplete, _super);
    function MatAutocomplete(_changeDetectorRef, _elementRef, defaults) {
        var _this = _super.call(this) || this;
        _this._changeDetectorRef = _changeDetectorRef;
        _this._elementRef = _elementRef;
        /** Whether the autocomplete panel should be visible, depending on option length. */
        _this.showPanel = false;
        _this._isOpen = false;
        /** Function that maps an option's control value to its display value in the trigger. */
        _this.displayWith = null;
        /** Event that is emitted whenever an option from the list is selected. */
        _this.optionSelected = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is opened. */
        _this.opened = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is closed. */
        _this.closed = new EventEmitter();
        _this._classList = {};
        /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
        _this.id = "mat-autocomplete-" + _uniqueAutocompleteIdCounter++;
        _this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
        return _this;
    }
    Object.defineProperty(MatAutocomplete.prototype, "isOpen", {
        /** Whether the autocomplete panel is open. */
        get: function () { return this._isOpen && this.showPanel; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatAutocomplete.prototype, "autoActiveFirstOption", {
        /**
         * Whether the first option should be highlighted when the autocomplete panel is opened.
         * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
         */
        get: function () { return this._autoActiveFirstOption; },
        set: function (value) {
            this._autoActiveFirstOption = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatAutocomplete.prototype, "classList", {
        /**
         * Takes classes set on the host mat-autocomplete element and applies them to the panel
         * inside the overlay container to allow for easy styling.
         */
        set: function (value) {
            if (value && value.length) {
                this._classList = value.split(' ').reduce(function (classList, className) {
                    classList[className.trim()] = true;
                    return classList;
                }, {});
            }
            else {
                this._classList = {};
            }
            this._setVisibilityClasses(this._classList);
            this._elementRef.nativeElement.className = '';
        },
        enumerable: true,
        configurable: true
    });
    MatAutocomplete.prototype.ngAfterContentInit = function () {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
        // Set the initial visibility state.
        this._setVisibility();
    };
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     */
    MatAutocomplete.prototype._setScrollTop = function (scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    };
    /** Returns the panel's scrollTop. */
    MatAutocomplete.prototype._getScrollTop = function () {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    };
    /** Panel should hide itself when the option list is empty. */
    MatAutocomplete.prototype._setVisibility = function () {
        this.showPanel = !!this.options.length;
        this._setVisibilityClasses(this._classList);
        this._changeDetectorRef.markForCheck();
    };
    /** Emits the `select` event. */
    MatAutocomplete.prototype._emitSelectEvent = function (option) {
        var event = new MatAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    };
    /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
    MatAutocomplete.prototype._setVisibilityClasses = function (classList) {
        classList['mat-autocomplete-visible'] = this.showPanel;
        classList['mat-autocomplete-hidden'] = !this.showPanel;
    };
    MatAutocomplete.decorators = [
        { type: Component, args: [{
                    selector: 'mat-autocomplete',
                    template: "<ng-template>\n  <div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_classList\" #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    exportAs: 'matAutocomplete',
                    inputs: ['disableRipple'],
                    host: {
                        'class': 'mat-autocomplete'
                    },
                    providers: [
                        { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }
                    ],
                    styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatAutocomplete.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: ElementRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,] }] }
    ]; };
    MatAutocomplete.propDecorators = {
        template: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
        panel: [{ type: ViewChild, args: ['panel',] }],
        options: [{ type: ContentChildren, args: [MatOption, { descendants: true },] }],
        optionGroups: [{ type: ContentChildren, args: [MatOptgroup, { descendants: true },] }],
        displayWith: [{ type: Input }],
        autoActiveFirstOption: [{ type: Input }],
        panelWidth: [{ type: Input }],
        optionSelected: [{ type: Output }],
        opened: [{ type: Output }],
        closed: [{ type: Output }],
        classList: [{ type: Input, args: ['class',] }]
    };
    return MatAutocomplete;
}(_MatAutocompleteMixinBase));
export { MatAutocomplete };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCwyQkFBMkIsRUFDM0IsV0FBVyxFQUNYLFNBQVMsRUFDVCxrQkFBa0IsR0FDbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUdoQzs7O0dBR0c7QUFDSCxJQUFJLDRCQUE0QixHQUFHLENBQUMsQ0FBQztBQUVyQyw0RUFBNEU7QUFDNUU7SUFDRTtJQUNFLGtFQUFrRTtJQUMzRCxNQUF1QjtJQUM5QixnQ0FBZ0M7SUFDekIsTUFBaUI7UUFGakIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFFdkIsV0FBTSxHQUFOLE1BQU0sQ0FBVztJQUFJLENBQUM7SUFDakMsbUNBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQzs7QUFHRCxzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCO0lBQUE7SUFBMkIsQ0FBQztJQUFELDBCQUFDO0FBQUQsQ0FBQyxBQUE1QixJQUE0QjtBQUM1QixJQUFNLHlCQUF5QixHQUMzQixrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBUTVDLHlGQUF5RjtBQUN6RixNQUFNLENB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QUNELFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFDO3FCQUNyRTs7aUJBQ0Y7Ozs7Z0JBOUVDLGlCQUFpQjtnQkFHakIsVUFBVTtnREFpS1AsTUFBTSxTQUFDLGdDQUFnQzs7OzJCQW5FekMsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7d0JBR3JDLFNBQVMsU0FBQyxPQUFPOzBCQUdqQixlQUFlLFNBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzsrQkFHOUMsZUFBZSxTQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7OEJBR2hELEtBQUs7d0NBTUwsS0FBSzs2QkFXTCxLQUFLO2lDQUdMLE1BQU07eUJBSU4sTUFBTTt5QkFHTixNQUFNOzRCQU1OLEtBQUssU0FBQyxPQUFPOztJQXNFaEIsc0JBQUM7Q0FBQSxBQXBKRCxDQWVxQyx5QkFBeUIsR0FxSTdEO1NBcklZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZUN0b3IsXG4gIE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCxcbiAgTWF0T3B0Z3JvdXAsXG4gIE1hdE9wdGlvbixcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0QXV0b2NvbXBsZXRlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogTWF0T3B0aW9uKSB7IH1cbn1cblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEF1dG9jb21wbGV0ZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRBdXRvY29tcGxldGVCYXNlIHt9XG5jb25zdCBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlOiBDYW5EaXNhYmxlUmlwcGxlQ3RvciAmIHR5cGVvZiBNYXRBdXRvY29tcGxldGVCYXNlID1cbiAgICBtaXhpbkRpc2FibGVSaXBwbGUoTWF0QXV0b2NvbXBsZXRlQmFzZSk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtYXV0b2NvbXBsZXRlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBhdXRvQWN0aXZlRmlyc3RPcHRpb24/OiBib29sZWFuO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRvIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9ucyBmb3IgYG1hdC1hdXRvY29tcGxldGVgLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnM+KCdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsIHtcbiAgICAgIHByb3ZpZGVkSW46ICdyb290JyxcbiAgICAgIGZhY3Rvcnk6IE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gICAgfSk7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7YXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZX07XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1hdXRvY29tcGxldGUnLFxuICB0ZW1wbGF0ZVVybDogJ2F1dG9jb21wbGV0ZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2F1dG9jb21wbGV0ZS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYXV0b2NvbXBsZXRlJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogTWF0QXV0b2NvbXBsZXRlfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZSBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVNaXhpbkJhc2UgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LFxuICBDYW5EaXNhYmxlUmlwcGxlIHtcblxuICAvKiogTWFuYWdlcyBhY3RpdmUgaXRlbSBpbiBvcHRpb24gbGlzdCBiYXNlZCBvbiBrZXkgZXZlbnRzLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlLCBkZXBlbmRpbmcgb24gb3B0aW9uIGxlbmd0aC4gKi9cbiAgc2hvd1BhbmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgaXNPcGVuKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faXNPcGVuICYmIHRoaXMuc2hvd1BhbmVsOyB9XG4gIF9pc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBUaGUgQFZpZXdDaGlsZCBxdWVyeSBmb3IgVGVtcGxhdGVSZWYgaGVyZSBuZWVkcyB0byBiZSBzdGF0aWMgYmVjYXVzZSBzb21lIGNvZGUgcGF0aHNcbiAgLy8gbGVhZCB0byB0aGUgb3ZlcmxheSBiZWluZyBjcmVhdGVkIGJlZm9yZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBmaW5pc2hlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gIC8vIE5vdGFibHksIGFub3RoZXIgY29tcG9uZW50IG1heSB0cmlnZ2VyIGBmb2N1c2Agb24gdGhlIGF1dG9jb21wbGV0ZS10cmlnZ2VyLlxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKiogRWxlbWVudCBmb3IgdGhlIHBhbmVsIGNvbnRhaW5pbmcgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKCdwYW5lbCcpIHBhbmVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPjtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGdyb3VwLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgbWFwcyBhbiBvcHRpb24ncyBjb250cm9sIHZhbHVlIHRvIGl0cyBkaXNwbGF5IHZhbHVlIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKCh2YWx1ZTogYW55KSA9PiBzdHJpbmcpIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC5cbiAgICogQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdGhyb3VnaCB0aGUgYE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvQWN0aXZlRmlyc3RPcHRpb24oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb247IH1cbiAgc2V0IGF1dG9BY3RpdmVGaXJzdE9wdGlvbih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSB3aWR0aCBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAgQ2FuIGJlIGFueSBDU1Mgc2l6aW5nIHZhbHVlLCBvdGhlcndpc2UgaXQgd2lsbFxuICAgKiBtYXRjaCB0aGUgd2lkdGggb2YgaXRzIGhvc3QuXG4gICAqL1xuICBASW5wdXQoKSBwYW5lbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBvcHRpb24gZnJvbSB0aGUgbGlzdCBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wdGlvblNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudD4gPVxuICAgICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUYWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtYXV0b2NvbXBsZXRlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgcGFuZWxcbiAgICogaW5zaWRlIHRoZSBvdmVybGF5IGNvbnRhaW5lciB0byBhbGxvdyBmb3IgZWFzeSBzdHlsaW5nLlxuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBjbGFzc0xpc3QodmFsdWU6IHN0cmluZykge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IHZhbHVlLnNwbGl0KCcgJykucmVkdWNlKChjbGFzc0xpc3QsIGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICBjbGFzc0xpc3RbY2xhc3NOYW1lLnRyaW0oKV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gY2xhc3NMaXN0O1xuICAgICAgfSwge30gYXMge1trZXk6IHN0cmluZ106IGJvb2xlYW59KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gIH1cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLyoqIFVuaXF1ZSBJRCB0byBiZSB1c2VkIGJ5IGF1dG9jb21wbGV0ZSB0cmlnZ2VyJ3MgXCJhcmlhLW93bnNcIiBwcm9wZXJ0eS4gKi9cbiAgaWQ6IHN0cmluZyA9IGBtYXQtYXV0b2NvbXBsZXRlLSR7X3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlcisrfWA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRzOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSAhIWRlZmF1bHRzLmF1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPE1hdE9wdGlvbj4odGhpcy5vcHRpb25zKS53aXRoV3JhcCgpO1xuICAgIC8vIFNldCB0aGUgaW5pdGlhbCB2aXNpYmlsaXR5IHN0YXRlLlxuICAgIHRoaXMuX3NldFZpc2liaWxpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYW5lbCBzY3JvbGxUb3AuIFRoaXMgYWxsb3dzIHVzIHRvIG1hbnVhbGx5IHNjcm9sbCB0byBkaXNwbGF5IG9wdGlvbnNcbiAgICogYWJvdmUgb3IgYmVsb3cgdGhlIGZvbGQsIGFzIHRoZXkgYXJlIG5vdCBhY3R1YWxseSBiZWluZyBmb2N1c2VkIHdoZW4gYWN0aXZlLlxuICAgKi9cbiAgX3NldFNjcm9sbFRvcChzY3JvbGxUb3A6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBwYW5lbCdzIHNjcm9sbFRvcC4gKi9cbiAgX2dldFNjcm9sbFRvcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhbmVsID8gdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA6IDA7XG4gIH1cblxuICAvKiogUGFuZWwgc2hvdWxkIGhpZGUgaXRzZWxmIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBfc2V0VmlzaWJpbGl0eSgpIHtcbiAgICB0aGlzLnNob3dQYW5lbCA9ICEhdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5Q2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBgc2VsZWN0YCBldmVudC4gKi9cbiAgX2VtaXRTZWxlY3RFdmVudChvcHRpb246IE1hdE9wdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQodGhpcywgb3B0aW9uKTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGF1dG9jb21wbGV0ZSB2aXNpYmlsaXR5IGNsYXNzZXMgb24gYSBjbGFzc2xpc3QgYmFzZWQgb24gdGhlIHBhbmVsIGlzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3NldFZpc2liaWxpdHlDbGFzc2VzKGNsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59KSB7XG4gICAgY2xhc3NMaXN0WydtYXQtYXV0b2NvbXBsZXRlLXZpc2libGUnXSA9IHRoaXMuc2hvd1BhbmVsO1xuICAgIGNsYXNzTGlzdFsnbWF0LWF1dG9jb21wbGV0ZS1oaWRkZW4nXSA9ICF0aGlzLnNob3dQYW5lbDtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvQWN0aXZlRmlyc3RPcHRpb246IGJvb2xlYW4gfCBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG5cbiJdfQ==