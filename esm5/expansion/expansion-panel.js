/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, EventEmitter, ElementRef, Input, Inject, Optional, Output, SkipSelf, ViewContainerRef, ViewEncapsulation, ViewChild, InjectionToken, } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { filter, startWith, take, distinctUntilChanged } from 'rxjs/operators';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanelContent } from './expansion-panel-content';
import { MAT_ACCORDION } from './accordion-base';
/** Counter for generating unique element ids. */
var uniqueId = 0;
/**
 * Injection token that can be used to configure the defalt
 * options for the expansion panel component.
 */
export var MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
var ɵ0 = undefined;
/**
 * `<mat-expansion-panel>`
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
var MatExpansionPanel = /** @class */ (function (_super) {
    tslib_1.__extends(MatExpansionPanel, _super);
    function MatExpansionPanel(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, _document, _animationMode, defaultOptions) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        _this._viewContainerRef = _viewContainerRef;
        _this._animationMode = _animationMode;
        _this._hideToggle = false;
        /** An event emitted after the body's expansion animation happens. */
        _this.afterExpand = new EventEmitter();
        /** An event emitted after the body's collapse animation happens. */
        _this.afterCollapse = new EventEmitter();
        /** Stream that emits for changes in `@Input` properties. */
        _this._inputChanges = new Subject();
        /** ID for the associated header element. Used for a11y labelling. */
        _this._headerId = "mat-expansion-panel-header-" + uniqueId++;
        /** Stream of body animation done events. */
        _this._bodyAnimationDone = new Subject();
        _this.accordion = accordion;
        _this._document = _document;
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        _this._bodyAnimationDone.pipe(distinctUntilChanged(function (x, y) {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(function (event) {
            if (event.fromState !== 'void') {
                if (event.toState === 'expanded') {
                    _this.afterExpand.emit();
                }
                else if (event.toState === 'collapsed') {
                    _this.afterCollapse.emit();
                }
            }
        });
        if (defaultOptions) {
            _this.hideToggle = defaultOptions.hideToggle;
        }
        return _this;
    }
    Object.defineProperty(MatExpansionPanel.prototype, "hideToggle", {
        /** Whether the toggle indicator should be hidden. */
        get: function () {
            return this._hideToggle || (this.accordion && this.accordion.hideToggle);
        },
        set: function (value) {
            this._hideToggle = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatExpansionPanel.prototype, "togglePosition", {
        /** The position of the expansion indicator. */
        get: function () {
            return this._togglePosition || (this.accordion && this.accordion.togglePosition);
        },
        set: function (value) {
            this._togglePosition = value;
        },
        enumerable: true,
        configurable: true
    });
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    MatExpansionPanel.prototype._hasSpacing = function () {
        if (this.accordion) {
            // We don't need to subscribe to the `stateChanges` of the parent accordion because each time
            // the [displayMode] input changes, the change detection will also cover the host bindings
            // of this expansion panel.
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    };
    /** Gets the expanded state string. */
    MatExpansionPanel.prototype._getExpandedState = function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    MatExpansionPanel.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._lazyContent) {
            // Render the content as soon as the panel becomes open.
            this.opened.pipe(startWith(null), filter(function () { return _this.expanded && !_this._portal; }), take(1)).subscribe(function () {
                _this._portal = new TemplatePortal(_this._lazyContent._template, _this._viewContainerRef);
            });
        }
    };
    MatExpansionPanel.prototype.ngOnChanges = function (changes) {
        this._inputChanges.next(changes);
    };
    MatExpansionPanel.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._bodyAnimationDone.complete();
        this._inputChanges.complete();
    };
    /** Checks whether the expansion panel's content contains the currently-focused element. */
    MatExpansionPanel.prototype._containsFocus = function () {
        if (this._body) {
            var focusedElement = this._document.activeElement;
            var bodyElement = this._body.nativeElement;
            return focusedElement === bodyElement || bodyElement.contains(focusedElement);
        }
        return false;
    };
    MatExpansionPanel.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-expansion-panel',
                    exportAs: 'matExpansionPanel',
                    template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content>\n<div class=\"mat-expansion-panel-content\"\n     role=\"region\"\n     [@bodyExpansion]=\"_getExpandedState()\"\n     (@bodyExpansion.done)=\"_bodyAnimationDone.next($event)\"\n     [attr.aria-labelledby]=\"_headerId\"\n     [id]=\"id\"\n     #body>\n  <div class=\"mat-expansion-panel-body\">\n    <ng-content></ng-content>\n    <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n  </div>\n  <ng-content select=\"mat-action-row\"></ng-content>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disabled', 'expanded'],
                    outputs: ['opened', 'closed', 'expandedChange'],
                    animations: [matExpansionAnimations.bodyExpansion],
                    providers: [
                        // Provide MatAccordion as undefined to prevent nested expansion panels from registering
                        // to the same accordion.
                        { provide: MAT_ACCORDION, useValue: ɵ0 },
                    ],
                    host: {
                        'class': 'mat-expansion-panel',
                        '[class.mat-expanded]': 'expanded',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
                    },
                    styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}@media(-ms-high-contrast: active){.mat-expansion-panel{outline:solid 1px}}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button-base{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button-base{margin-left:0;margin-right:8px}/*# sourceMappingURL=expansion-panel.css.map */\n"]
                }] }
    ];
    /** @nocollapse */
    MatExpansionPanel.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: SkipSelf }, { type: Inject, args: [MAT_ACCORDION,] }] },
        { type: ChangeDetectorRef },
        { type: UniqueSelectionDispatcher },
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
    ]; };
    MatExpansionPanel.propDecorators = {
        hideToggle: [{ type: Input }],
        togglePosition: [{ type: Input }],
        afterExpand: [{ type: Output }],
        afterCollapse: [{ type: Output }],
        _lazyContent: [{ type: ContentChild, args: [MatExpansionPanelContent, { static: false },] }],
        _body: [{ type: ViewChild, args: ['body', { static: false },] }]
    };
    return MatExpansionPanel;
}(CdkAccordionItem));
export { MatExpansionPanel };
var MatExpansionPanelActionRow = /** @class */ (function () {
    function MatExpansionPanelActionRow() {
    }
    MatExpansionPanelActionRow.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-action-row',
                    host: {
                        class: 'mat-action-row'
                    }
                },] }
    ];
    return MatExpansionPanelActionRow;
}());
export { MatExpansionPanelActionRow };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLE1BQU0sRUFFTixRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsY0FBYyxHQUNmLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxhQUFhLEVBQStDLE1BQU0sa0JBQWtCLENBQUM7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eUI7Z0JBbUIvQixnQkFBZ0I7Z0RBNkhILE1BQU0sU0FBQyxRQUFROzZDQUNmLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCO2dEQUN4QyxNQUFNLFNBQUMsbUNBQW1DLGNBQUcsUUFBUTs7OzZCQWxEakUsS0FBSztpQ0FTTCxLQUFLOzhCQVNMLE1BQU07Z0NBR04sTUFBTTsrQkFTTixZQUFZLFNBQUMsd0JBQXdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO3dCQUd0RCxTQUFTLFNBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7SUEyRnBDLHdCQUFDO0NBQUEsQUExSkQsQ0F1QnVDLGdCQUFnQixHQW1JdEQ7U0FuSVksaUJBQWlCO0FBcUk5QjtJQUFBO0lBTXlDLENBQUM7O2dCQU56QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxnQkFBZ0I7cUJBQ3hCO2lCQUNGOztJQUN3QyxpQ0FBQztDQUFBLEFBTjFDLElBTTBDO1NBQTdCLDBCQUEwQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q2RrQWNjb3JkaW9uSXRlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7VW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBTa2lwU2VsZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIFZpZXdDaGlsZCxcbiAgSW5qZWN0aW9uVG9rZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBzdGFydFdpdGgsIHRha2UsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdEV4cGFuc2lvbkFuaW1hdGlvbnN9IGZyb20gJy4vZXhwYW5zaW9uLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbENvbnRlbnR9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnO1xuaW1wb3J0IHtNQVRfQUNDT1JESU9OLCBNYXRBY2NvcmRpb25CYXNlLCBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbn0gZnJvbSAnLi9hY2NvcmRpb24tYmFzZSc7XG5cbi8qKiBNYXRFeHBhbnNpb25QYW5lbCdzIHN0YXRlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdEV4cGFuc2lvblBhbmVsU3RhdGUgPSAnZXhwYW5kZWQnIHwgJ2NvbGxhcHNlZCc7XG5cbi8qKiBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBlbGVtZW50IGlkcy4gKi9cbmxldCB1bmlxdWVJZCA9IDA7XG5cbi8qKlxuICogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogZm9yIGFsbCBvZiB0aGUgZXhwYW5zaW9uIHBhbmVscyBpbiBhIG1vZHVsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zIHtcbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgZXhwYW5kZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC4gKi9cbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgaGlkZVRvZ2dsZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmFsdFxuICogb3B0aW9ucyBmb3IgdGhlIGV4cGFuc2lvbiBwYW5lbCBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnM+KCdNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vKipcbiAqIGA8bWF0LWV4cGFuc2lvbi1wYW5lbD5gXG4gKlxuICogVGhpcyBjb21wb25lbnQgY2FuIGJlIHVzZWQgYXMgYSBzaW5nbGUgZWxlbWVudCB0byBzaG93IGV4cGFuZGFibGUgY29udGVudCwgb3IgYXMgb25lIG9mXG4gKiBtdWx0aXBsZSBjaGlsZHJlbiBvZiBhbiBlbGVtZW50IHdpdGggdGhlIE1hdEFjY29yZGlvbiBkaXJlY3RpdmUgYXR0YWNoZWQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzdHlsZVVybHM6IFsnLi9leHBhbnNpb24tcGFuZWwuY3NzJ10sXG4gIHNlbGVjdG9yOiAnbWF0LWV4cGFuc2lvbi1wYW5lbCcsXG4gIGV4cG9ydEFzOiAnbWF0RXhwYW5zaW9uUGFuZWwnLFxuICB0ZW1wbGF0ZVVybDogJy4vZXhwYW5zaW9uLXBhbmVsLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2V4cGFuZGVkJ10sXG4gIG91dHB1dHM6IFsnb3BlbmVkJywgJ2Nsb3NlZCcsICdleHBhbmRlZENoYW5nZSddLFxuICBhbmltYXRpb25zOiBbbWF0RXhwYW5zaW9uQW5pbWF0aW9ucy5ib2R5RXhwYW5zaW9uXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgLy8gUHJvdmlkZSBNYXRBY2NvcmRpb24gYXMgdW5kZWZpbmVkIHRvIHByZXZlbnQgbmVzdGVkIGV4cGFuc2lvbiBwYW5lbHMgZnJvbSByZWdpc3RlcmluZ1xuICAgIC8vIHRvIHRoZSBzYW1lIGFjY29yZGlvbi5cbiAgICB7cHJvdmlkZTogTUFUX0FDQ09SRElPTiwgdXNlVmFsdWU6IHVuZGVmaW5lZH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWV4cGFuc2lvbi1wYW5lbCcsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5kZWRdJzogJ2V4cGFuZGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tcGFuZWwtc3BhY2luZ10nOiAnX2hhc1NwYWNpbmcoKScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWwgZXh0ZW5kcyBDZGtBY2NvcmRpb25JdGVtIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByaXZhdGUgX2hpZGVUb2dnbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdG9nZ2xlUG9zaXRpb246IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlVG9nZ2xlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlVG9nZ2xlIHx8ICh0aGlzLmFjY29yZGlvbiAmJiB0aGlzLmFjY29yZGlvbi5oaWRlVG9nZ2xlKTtcbiAgfVxuICBzZXQgaGlkZVRvZ2dsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVUb2dnbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFRoZSBwb3NpdGlvbiBvZiB0aGUgZXhwYW5zaW9uIGluZGljYXRvci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvZ2dsZVBvc2l0aW9uKCk6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fdG9nZ2xlUG9zaXRpb24gfHwgKHRoaXMuYWNjb3JkaW9uICYmIHRoaXMuYWNjb3JkaW9uLnRvZ2dsZVBvc2l0aW9uKTtcbiAgfVxuICBzZXQgdG9nZ2xlUG9zaXRpb24odmFsdWU6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uKSB7XG4gICAgdGhpcy5fdG9nZ2xlUG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBBbiBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBib2R5J3MgZXhwYW5zaW9uIGFuaW1hdGlvbiBoYXBwZW5zLiAqL1xuICBAT3V0cHV0KCkgYWZ0ZXJFeHBhbmQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEFuIGV2ZW50IGVtaXR0ZWQgYWZ0ZXIgdGhlIGJvZHkncyBjb2xsYXBzZSBhbmltYXRpb24gaGFwcGVucy4gKi9cbiAgQE91dHB1dCgpIGFmdGVyQ29sbGFwc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIGZvciBjaGFuZ2VzIGluIGBASW5wdXRgIHByb3BlcnRpZXMuICovXG4gIHJlYWRvbmx5IF9pbnB1dENoYW5nZXMgPSBuZXcgU3ViamVjdDxTaW1wbGVDaGFuZ2VzPigpO1xuXG4gIC8qKiBPcHRpb25hbGx5IGRlZmluZWQgYWNjb3JkaW9uIHRoZSBleHBhbnNpb24gcGFuZWwgYmVsb25ncyB0by4gKi9cbiAgYWNjb3JkaW9uOiBNYXRBY2NvcmRpb25CYXNlO1xuXG4gIC8qKiBDb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0RXhwYW5zaW9uUGFuZWxDb250ZW50LCB7c3RhdGljOiBmYWxzZX0pIF9sYXp5Q29udGVudDogTWF0RXhwYW5zaW9uUGFuZWxDb250ZW50O1xuXG4gIC8qKiBFbGVtZW50IGNvbnRhaW5pbmcgdGhlIHBhbmVsJ3MgdXNlci1wcm92aWRlZCBjb250ZW50LiAqL1xuICBAVmlld0NoaWxkKCdib2R5Jywge3N0YXRpYzogZmFsc2V9KSBfYm9keTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFBvcnRhbCBob2xkaW5nIHRoZSB1c2VyJ3MgY29udGVudC4gKi9cbiAgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgLyoqIElEIGZvciB0aGUgYXNzb2NpYXRlZCBoZWFkZXIgZWxlbWVudC4gVXNlZCBmb3IgYTExeSBsYWJlbGxpbmcuICovXG4gIF9oZWFkZXJJZCA9IGBtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci0ke3VuaXF1ZUlkKyt9YDtcblxuICAvKiogU3RyZWFtIG9mIGJvZHkgYW5pbWF0aW9uIGRvbmUgZXZlbnRzLiAqL1xuICBfYm9keUFuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBASW5qZWN0KE1BVF9BQ0NPUkRJT04pIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZSxcbiAgICAgICAgICAgICAgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihhY2NvcmRpb24sIF9jaGFuZ2VEZXRlY3RvclJlZiwgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIpO1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYm9keUFuaW1hdGlvbkRvbmUucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICB9KSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2V4cGFuZGVkJykge1xuICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQuZW1pdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdjb2xsYXBzZWQnKSB7XG4gICAgICAgICAgdGhpcy5hZnRlckNvbGxhcHNlLmVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmhpZGVUb2dnbGUgPSBkZWZhdWx0T3B0aW9ucy5oaWRlVG9nZ2xlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCBzaG91bGQgaGF2ZSBzcGFjaW5nIGJldHdlZW4gaXQgYW5kIGl0cyBzaWJsaW5ncy4gKi9cbiAgX2hhc1NwYWNpbmcoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uKSB7XG4gICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIHN1YnNjcmliZSB0byB0aGUgYHN0YXRlQ2hhbmdlc2Agb2YgdGhlIHBhcmVudCBhY2NvcmRpb24gYmVjYXVzZSBlYWNoIHRpbWVcbiAgICAgIC8vIHRoZSBbZGlzcGxheU1vZGVdIGlucHV0IGNoYW5nZXMsIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHdpbGwgYWxzbyBjb3ZlciB0aGUgaG9zdCBiaW5kaW5nc1xuICAgICAgLy8gb2YgdGhpcyBleHBhbnNpb24gcGFuZWwuXG4gICAgICByZXR1cm4gKHRoaXMuZXhwYW5kZWQgPyB0aGlzLmFjY29yZGlvbi5kaXNwbGF5TW9kZSA6IHRoaXMuX2dldEV4cGFuZGVkU3RhdGUoKSkgPT09ICdkZWZhdWx0JztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZy4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogTWF0RXhwYW5zaW9uUGFuZWxTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgPyAnZXhwYW5kZWQnIDogJ2NvbGxhcHNlZCc7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2xhenlDb250ZW50KSB7XG4gICAgICAvLyBSZW5kZXIgdGhlIGNvbnRlbnQgYXMgc29vbiBhcyB0aGUgcGFuZWwgYmVjb21lcyBvcGVuLlxuICAgICAgdGhpcy5vcGVuZWQucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG51bGwhKSxcbiAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuZXhwYW5kZWQgJiYgIXRoaXMuX3BvcnRhbCksXG4gICAgICAgIHRha2UoMSlcbiAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX2xhenlDb250ZW50Ll90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLm5leHQoY2hhbmdlcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2JvZHlBbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCdzIGNvbnRlbnQgY29udGFpbnMgdGhlIGN1cnJlbnRseS1mb2N1c2VkIGVsZW1lbnQuICovXG4gIF9jb250YWluc0ZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9ib2R5KSB7XG4gICAgICBjb25zdCBmb2N1c2VkRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBib2R5RWxlbWVudCA9IHRoaXMuX2JvZHkubmF0aXZlRWxlbWVudDtcbiAgICAgIHJldHVybiBmb2N1c2VkRWxlbWVudCA9PT0gYm9keUVsZW1lbnQgfHwgYm9keUVsZW1lbnQuY29udGFpbnMoZm9jdXNlZEVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtYWN0aW9uLXJvdycsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1hY3Rpb24tcm93J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsQWN0aW9uUm93IHt9XG4iXX0=