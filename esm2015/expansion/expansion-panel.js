/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
/**
 * Counter for generating unique element ids.
 * @type {?}
 */
let uniqueId = 0;
/**
 * Object that can be used to override the default options
 * for all of the expansion panels in a module.
 * @record
 */
export function MatExpansionPanelDefaultOptions() { }
if (false) {
    /**
     * Height of the header while the panel is expanded.
     * @type {?}
     */
    MatExpansionPanelDefaultOptions.prototype.expandedHeight;
    /**
     * Height of the header while the panel is collapsed.
     * @type {?}
     */
    MatExpansionPanelDefaultOptions.prototype.collapsedHeight;
    /**
     * Whether the toggle indicator should be hidden.
     * @type {?}
     */
    MatExpansionPanelDefaultOptions.prototype.hideToggle;
}
/**
 * Injection token that can be used to configure the defalt
 * options for the expansion panel component.
 * @type {?}
 */
export const MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
const ɵ0 = undefined;
/**
 * `<mat-expansion-panel>`
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
export class MatExpansionPanel extends CdkAccordionItem {
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     * @param {?} _viewContainerRef
     * @param {?} _document
     * @param {?} _animationMode
     * @param {?=} defaultOptions
     */
    constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, _document, _animationMode, defaultOptions) {
        super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
        this._viewContainerRef = _viewContainerRef;
        this._animationMode = _animationMode;
        this._hideToggle = false;
        /**
         * An event emitted after the body's expansion animation happens.
         */
        this.afterExpand = new EventEmitter();
        /**
         * An event emitted after the body's collapse animation happens.
         */
        this.afterCollapse = new EventEmitter();
        /**
         * Stream that emits for changes in `\@Input` properties.
         */
        this._inputChanges = new Subject();
        /**
         * ID for the associated header element. Used for a11y labelling.
         */
        this._headerId = `mat-expansion-panel-header-${uniqueId++}`;
        /**
         * Stream of body animation done events.
         */
        this._bodyAnimationDone = new Subject();
        this.accordion = accordion;
        this._document = _document;
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._bodyAnimationDone.pipe(distinctUntilChanged((/**
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        (x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))).subscribe((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.fromState !== 'void') {
                if (event.toState === 'expanded') {
                    this.afterExpand.emit();
                }
                else if (event.toState === 'collapsed') {
                    this.afterCollapse.emit();
                }
            }
        }));
        if (defaultOptions) {
            this.hideToggle = defaultOptions.hideToggle;
        }
    }
    /**
     * Whether the toggle indicator should be hidden.
     * @return {?}
     */
    get hideToggle() {
        return this._hideToggle || (this.accordion && this.accordion.hideToggle);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideToggle(value) {
        this._hideToggle = coerceBooleanProperty(value);
    }
    /**
     * The position of the expansion indicator.
     * @return {?}
     */
    get togglePosition() {
        return this._togglePosition || (this.accordion && this.accordion.togglePosition);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set togglePosition(value) {
        this._togglePosition = value;
    }
    /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    _hasSpacing() {
        if (this.accordion) {
            // We don't need to subscribe to the `stateChanges` of the parent accordion because each time
            // the [displayMode] input changes, the change detection will also cover the host bindings
            // of this expansion panel.
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    }
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    _getExpandedState() {
        return this.expanded ? 'expanded' : 'collapsed';
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this._lazyContent) {
            // Render the content as soon as the panel becomes open.
            this.opened.pipe(startWith((/** @type {?} */ (null))), filter((/**
             * @return {?}
             */
            () => this.expanded && !this._portal)), take(1)).subscribe((/**
             * @return {?}
             */
            () => {
                this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
            }));
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._inputChanges.next(changes);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._bodyAnimationDone.complete();
        this._inputChanges.complete();
    }
    /**
     * Checks whether the expansion panel's content contains the currently-focused element.
     * @return {?}
     */
    _containsFocus() {
        if (this._body) {
            /** @type {?} */
            const focusedElement = this._document.activeElement;
            /** @type {?} */
            const bodyElement = this._body.nativeElement;
            return focusedElement === bodyElement || bodyElement.contains(focusedElement);
        }
        return false;
    }
}
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
                styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}@media(-ms-high-contrast: active){.mat-expansion-panel{outline:solid 1px}}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button-base{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button-base{margin-left:0;margin-right:8px}\n"]
            }] }
];
/** @nocollapse */
MatExpansionPanel.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: SkipSelf }, { type: Inject, args: [MAT_ACCORDION,] }] },
    { type: ChangeDetectorRef },
    { type: UniqueSelectionDispatcher },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
];
MatExpansionPanel.propDecorators = {
    hideToggle: [{ type: Input }],
    togglePosition: [{ type: Input }],
    afterExpand: [{ type: Output }],
    afterCollapse: [{ type: Output }],
    _lazyContent: [{ type: ContentChild, args: [MatExpansionPanelContent,] }],
    _body: [{ type: ViewChild, args: ['body',] }]
};
if (false) {
    /** @type {?} */
    MatExpansionPanel.ngAcceptInputType_hideToggle;
    /** @type {?} */
    MatExpansionPanel.ngAcceptInputType_expanded;
    /** @type {?} */
    MatExpansionPanel.ngAcceptInputType_disabled;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanel.prototype._document;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanel.prototype._hideToggle;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanel.prototype._togglePosition;
    /**
     * An event emitted after the body's expansion animation happens.
     * @type {?}
     */
    MatExpansionPanel.prototype.afterExpand;
    /**
     * An event emitted after the body's collapse animation happens.
     * @type {?}
     */
    MatExpansionPanel.prototype.afterCollapse;
    /**
     * Stream that emits for changes in `\@Input` properties.
     * @type {?}
     */
    MatExpansionPanel.prototype._inputChanges;
    /**
     * Optionally defined accordion the expansion panel belongs to.
     * @type {?}
     */
    MatExpansionPanel.prototype.accordion;
    /**
     * Content that will be rendered lazily.
     * @type {?}
     */
    MatExpansionPanel.prototype._lazyContent;
    /**
     * Element containing the panel's user-provided content.
     * @type {?}
     */
    MatExpansionPanel.prototype._body;
    /**
     * Portal holding the user's content.
     * @type {?}
     */
    MatExpansionPanel.prototype._portal;
    /**
     * ID for the associated header element. Used for a11y labelling.
     * @type {?}
     */
    MatExpansionPanel.prototype._headerId;
    /**
     * Stream of body animation done events.
     * @type {?}
     */
    MatExpansionPanel.prototype._bodyAnimationDone;
    /**
     * @type {?}
     * @private
     */
    MatExpansionPanel.prototype._viewContainerRef;
    /** @type {?} */
    MatExpansionPanel.prototype._animationMode;
}
export class MatExpansionPanelActionRow {
}
MatExpansionPanelActionRow.decorators = [
    { type: Directive, args: [{
                selector: 'mat-action-row',
                host: {
                    class: 'mat-action-row'
                }
            },] }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGNBQWMsR0FDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsYUFBYSxFQUErQyxNQUFNLGtCQUFrQixDQUFDOzs7OztJQU16RixRQUFRLEdB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LE1BQU0sU0FBQyxtQ0FBbUMsY0FBRyxRQUFROzs7eUJBbERqRSxLQUFLOzZCQVNMLEtBQUs7MEJBU0wsTUFBTTs0QkFHTixNQUFNOzJCQVNOLFlBQVksU0FBQyx3QkFBd0I7b0JBR3JDLFNBQVMsU0FBQyxNQUFNOzs7O0lBNEZqQiwrQ0FBc0Q7O0lBQ3RELDZDQUFvRDs7SUFDcEQsNkNBQW9EOzs7OztJQXBJcEQsc0NBQTRCOzs7OztJQUM1Qix3Q0FBNEI7Ozs7O0lBQzVCLDRDQUFvRDs7Ozs7SUFxQnBELHdDQUFpRDs7Ozs7SUFHakQsMENBQW1EOzs7OztJQUduRCwwQ0FBc0Q7Ozs7O0lBR3RELHNDQUE0Qjs7Ozs7SUFHNUIseUNBQStFOzs7OztJQUcvRSxrQ0FBa0Q7Ozs7O0lBR2xELG9DQUF3Qjs7Ozs7SUFHeEIsc0NBQXVEOzs7OztJQUd2RCwrQ0FBbUQ7Ozs7O0lBS3ZDLDhDQUEyQzs7SUFFM0MsMkNBQXdFOztBQXVGdEYsTUFBTSxPQUFPLDBCQUEwQjs7O1lBTnRDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLGdCQUFnQjtpQkFDeEI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q2RrQWNjb3JkaW9uSXRlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7VW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBTa2lwU2VsZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIFZpZXdDaGlsZCxcbiAgSW5qZWN0aW9uVG9rZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBzdGFydFdpdGgsIHRha2UsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdEV4cGFuc2lvbkFuaW1hdGlvbnN9IGZyb20gJy4vZXhwYW5zaW9uLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbENvbnRlbnR9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnO1xuaW1wb3J0IHtNQVRfQUNDT1JESU9OLCBNYXRBY2NvcmRpb25CYXNlLCBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbn0gZnJvbSAnLi9hY2NvcmRpb24tYmFzZSc7XG5cbi8qKiBNYXRFeHBhbnNpb25QYW5lbCdzIHN0YXRlcy4gKi9cbmV4cG9ydCB0eXBlIE1hdEV4cGFuc2lvblBhbmVsU3RhdGUgPSAnZXhwYW5kZWQnIHwgJ2NvbGxhcHNlZCc7XG5cbi8qKiBDb3VudGVyIGZvciBnZW5lcmF0aW5nIHVuaXF1ZSBlbGVtZW50IGlkcy4gKi9cbmxldCB1bmlxdWVJZCA9IDA7XG5cbi8qKlxuICogT2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3B0aW9uc1xuICogZm9yIGFsbCBvZiB0aGUgZXhwYW5zaW9uIHBhbmVscyBpbiBhIG1vZHVsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zIHtcbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBleHBhbmRlZC4gKi9cbiAgZXhwYW5kZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC4gKi9cbiAgY29sbGFwc2VkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgaGlkZVRvZ2dsZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIGRlZmFsdFxuICogb3B0aW9ucyBmb3IgdGhlIGV4cGFuc2lvbiBwYW5lbCBjb21wb25lbnQuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnM+KCdNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vKipcbiAqIGA8bWF0LWV4cGFuc2lvbi1wYW5lbD5gXG4gKlxuICogVGhpcyBjb21wb25lbnQgY2FuIGJlIHVzZWQgYXMgYSBzaW5nbGUgZWxlbWVudCB0byBzaG93IGV4cGFuZGFibGUgY29udGVudCwgb3IgYXMgb25lIG9mXG4gKiBtdWx0aXBsZSBjaGlsZHJlbiBvZiBhbiBlbGVtZW50IHdpdGggdGhlIE1hdEFjY29yZGlvbiBkaXJlY3RpdmUgYXR0YWNoZWQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzdHlsZVVybHM6IFsnLi9leHBhbnNpb24tcGFuZWwuY3NzJ10sXG4gIHNlbGVjdG9yOiAnbWF0LWV4cGFuc2lvbi1wYW5lbCcsXG4gIGV4cG9ydEFzOiAnbWF0RXhwYW5zaW9uUGFuZWwnLFxuICB0ZW1wbGF0ZVVybDogJy4vZXhwYW5zaW9uLXBhbmVsLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2V4cGFuZGVkJ10sXG4gIG91dHB1dHM6IFsnb3BlbmVkJywgJ2Nsb3NlZCcsICdleHBhbmRlZENoYW5nZSddLFxuICBhbmltYXRpb25zOiBbbWF0RXhwYW5zaW9uQW5pbWF0aW9ucy5ib2R5RXhwYW5zaW9uXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgLy8gUHJvdmlkZSBNYXRBY2NvcmRpb24gYXMgdW5kZWZpbmVkIHRvIHByZXZlbnQgbmVzdGVkIGV4cGFuc2lvbiBwYW5lbHMgZnJvbSByZWdpc3RlcmluZ1xuICAgIC8vIHRvIHRoZSBzYW1lIGFjY29yZGlvbi5cbiAgICB7cHJvdmlkZTogTUFUX0FDQ09SRElPTiwgdXNlVmFsdWU6IHVuZGVmaW5lZH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWV4cGFuc2lvbi1wYW5lbCcsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5kZWRdJzogJ2V4cGFuZGVkJyxcbiAgICAnW2NsYXNzLl9tYXQtYW5pbWF0aW9uLW5vb3BhYmxlXSc6ICdfYW5pbWF0aW9uTW9kZSA9PT0gXCJOb29wQW5pbWF0aW9uc1wiJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbnNpb24tcGFuZWwtc3BhY2luZ10nOiAnX2hhc1NwYWNpbmcoKScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWwgZXh0ZW5kcyBDZGtBY2NvcmRpb25JdGVtIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByaXZhdGUgX2hpZGVUb2dnbGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdG9nZ2xlUG9zaXRpb246IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlVG9nZ2xlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlVG9nZ2xlIHx8ICh0aGlzLmFjY29yZGlvbiAmJiB0aGlzLmFjY29yZGlvbi5oaWRlVG9nZ2xlKTtcbiAgfVxuICBzZXQgaGlkZVRvZ2dsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hpZGVUb2dnbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG5cbiAgLyoqIFRoZSBwb3NpdGlvbiBvZiB0aGUgZXhwYW5zaW9uIGluZGljYXRvci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHRvZ2dsZVBvc2l0aW9uKCk6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fdG9nZ2xlUG9zaXRpb24gfHwgKHRoaXMuYWNjb3JkaW9uICYmIHRoaXMuYWNjb3JkaW9uLnRvZ2dsZVBvc2l0aW9uKTtcbiAgfVxuICBzZXQgdG9nZ2xlUG9zaXRpb24odmFsdWU6IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uKSB7XG4gICAgdGhpcy5fdG9nZ2xlUG9zaXRpb24gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBBbiBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBib2R5J3MgZXhwYW5zaW9uIGFuaW1hdGlvbiBoYXBwZW5zLiAqL1xuICBAT3V0cHV0KCkgYWZ0ZXJFeHBhbmQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEFuIGV2ZW50IGVtaXR0ZWQgYWZ0ZXIgdGhlIGJvZHkncyBjb2xsYXBzZSBhbmltYXRpb24gaGFwcGVucy4gKi9cbiAgQE91dHB1dCgpIGFmdGVyQ29sbGFwc2UgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIGZvciBjaGFuZ2VzIGluIGBASW5wdXRgIHByb3BlcnRpZXMuICovXG4gIHJlYWRvbmx5IF9pbnB1dENoYW5nZXMgPSBuZXcgU3ViamVjdDxTaW1wbGVDaGFuZ2VzPigpO1xuXG4gIC8qKiBPcHRpb25hbGx5IGRlZmluZWQgYWNjb3JkaW9uIHRoZSBleHBhbnNpb24gcGFuZWwgYmVsb25ncyB0by4gKi9cbiAgYWNjb3JkaW9uOiBNYXRBY2NvcmRpb25CYXNlO1xuXG4gIC8qKiBDb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHkuICovXG4gIEBDb250ZW50Q2hpbGQoTWF0RXhwYW5zaW9uUGFuZWxDb250ZW50KSBfbGF6eUNvbnRlbnQ6IE1hdEV4cGFuc2lvblBhbmVsQ29udGVudDtcblxuICAvKiogRWxlbWVudCBjb250YWluaW5nIHRoZSBwYW5lbCdzIHVzZXItcHJvdmlkZWQgY29udGVudC4gKi9cbiAgQFZpZXdDaGlsZCgnYm9keScpIF9ib2R5OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogUG9ydGFsIGhvbGRpbmcgdGhlIHVzZXIncyBjb250ZW50LiAqL1xuICBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcblxuICAvKiogSUQgZm9yIHRoZSBhc3NvY2lhdGVkIGhlYWRlciBlbGVtZW50LiBVc2VkIGZvciBhMTF5IGxhYmVsbGluZy4gKi9cbiAgX2hlYWRlcklkID0gYG1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLSR7dW5pcXVlSWQrK31gO1xuXG4gIC8qKiBTdHJlYW0gb2YgYm9keSBhbmltYXRpb24gZG9uZSBldmVudHMuICovXG4gIF9ib2R5QW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIEBJbmplY3QoTUFUX0FDQ09SRElPTikgYWNjb3JkaW9uOiBNYXRBY2NvcmRpb25CYXNlLFxuICAgICAgICAgICAgICBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBfdW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcjogVW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUykgQE9wdGlvbmFsKClcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGFjY29yZGlvbiwgX2NoYW5nZURldGVjdG9yUmVmLCBfdW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcik7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG5cbiAgICAvLyBXZSBuZWVkIGEgU3ViamVjdCB3aXRoIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBiZWNhdXNlIHRoZSBgZG9uZWAgZXZlbnRcbiAgICAvLyBmaXJlcyB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9ib2R5QW5pbWF0aW9uRG9uZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LmZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB7XG4gICAgICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZXhwYW5kZWQnKSB7XG4gICAgICAgICAgdGhpcy5hZnRlckV4cGFuZC5lbWl0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2NvbGxhcHNlZCcpIHtcbiAgICAgICAgICB0aGlzLmFmdGVyQ29sbGFwc2UuZW1pdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaGlkZVRvZ2dsZSA9IGRlZmF1bHRPcHRpb25zLmhpZGVUb2dnbGU7XG4gICAgfVxuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgZXhwYW5zaW9uIHBhbmVsIHNob3VsZCBoYXZlIHNwYWNpbmcgYmV0d2VlbiBpdCBhbmQgaXRzIHNpYmxpbmdzLiAqL1xuICBfaGFzU3BhY2luZygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5hY2NvcmRpb24pIHtcbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gc3Vic2NyaWJlIHRvIHRoZSBgc3RhdGVDaGFuZ2VzYCBvZiB0aGUgcGFyZW50IGFjY29yZGlvbiBiZWNhdXNlIGVhY2ggdGltZVxuICAgICAgLy8gdGhlIFtkaXNwbGF5TW9kZV0gaW5wdXQgY2hhbmdlcywgdGhlIGNoYW5nZSBkZXRlY3Rpb24gd2lsbCBhbHNvIGNvdmVyIHRoZSBob3N0IGJpbmRpbmdzXG4gICAgICAvLyBvZiB0aGlzIGV4cGFuc2lvbiBwYW5lbC5cbiAgICAgIHJldHVybiAodGhpcy5leHBhbmRlZCA/IHRoaXMuYWNjb3JkaW9uLmRpc3BsYXlNb2RlIDogdGhpcy5fZ2V0RXhwYW5kZWRTdGF0ZSgpKSA9PT0gJ2RlZmF1bHQnO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nLiAqL1xuICBfZ2V0RXhwYW5kZWRTdGF0ZSgpOiBNYXRFeHBhbnNpb25QYW5lbFN0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZCA/ICdleHBhbmRlZCcgOiAnY29sbGFwc2VkJztcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbGF6eUNvbnRlbnQpIHtcbiAgICAgIC8vIFJlbmRlciB0aGUgY29udGVudCBhcyBzb29uIGFzIHRoZSBwYW5lbCBiZWNvbWVzIG9wZW4uXG4gICAgICB0aGlzLm9wZW5lZC5waXBlKFxuICAgICAgICBzdGFydFdpdGgobnVsbCEpLFxuICAgICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5leHBhbmRlZCAmJiAhdGhpcy5fcG9ydGFsKSxcbiAgICAgICAgdGFrZSgxKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fbGF6eUNvbnRlbnQuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLl9pbnB1dENoYW5nZXMubmV4dChjaGFuZ2VzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fYm9keUFuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgICB0aGlzLl9pbnB1dENoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZXhwYW5zaW9uIHBhbmVsJ3MgY29udGVudCBjb250YWlucyB0aGUgY3VycmVudGx5LWZvY3VzZWQgZWxlbWVudC4gKi9cbiAgX2NvbnRhaW5zRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2JvZHkpIHtcbiAgICAgIGNvbnN0IGZvY3VzZWRFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGJvZHlFbGVtZW50ID0gdGhpcy5fYm9keS5uYXRpdmVFbGVtZW50O1xuICAgICAgcmV0dXJuIGZvY3VzZWRFbGVtZW50ID09PSBib2R5RWxlbWVudCB8fCBib2R5RWxlbWVudC5jb250YWlucyhmb2N1c2VkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2hpZGVUb2dnbGU6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9leHBhbmRlZDogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgc3RyaW5nO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtYWN0aW9uLXJvdycsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1hY3Rpb24tcm93J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsQWN0aW9uUm93IHt9XG4iXX0=