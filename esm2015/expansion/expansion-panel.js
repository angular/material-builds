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
                styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button-base{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button-base{margin-left:0;margin-right:8px}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGNBQWMsR0FDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsYUFBYSxFQUErQyxNQUFNLGtCQUFrQixDQUFDOzs7OztJQU16RixRQUFRLEdB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QWxEakUsS0FBSzs2QkFTTCxLQUFLOzBCQVNMLE1BQU07NEJBR04sTUFBTTsyQkFTTixZQUFZLFNBQUMsd0JBQXdCO29CQUdyQyxTQUFTLFNBQUMsTUFBTTs7OztJQTRGakIsK0NBQXNEOztJQUN0RCw2Q0FBb0Q7O0lBQ3BELDZDQUFvRDs7Ozs7SUFwSXBELHNDQUE0Qjs7Ozs7SUFDNUIsd0NBQTRCOzs7OztJQUM1Qiw0Q0FBb0Q7Ozs7O0lBcUJwRCx3Q0FBaUQ7Ozs7O0lBR2pELDBDQUFtRDs7Ozs7SUFHbkQsMENBQXNEOzs7OztJQUd0RCxzQ0FBNEI7Ozs7O0lBRzVCLHlDQUErRTs7Ozs7SUFHL0Usa0NBQWtEOzs7OztJQUdsRCxvQ0FBd0I7Ozs7O0lBR3hCLHNDQUF1RDs7Ozs7SUFHdkQsK0NBQW1EOzs7OztJQUt2Qyw4Q0FBMkM7O0lBRTNDLDJDQUF3RTs7QUF1RnRGLE1BQU0sT0FBTywwQkFBMEI7OztZQU50QyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxnQkFBZ0I7aUJBQ3hCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0Nka0FjY29yZGlvbkl0ZW19IGZyb20gJ0Bhbmd1bGFyL2Nkay9hY2NvcmRpb24nO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgSW5qZWN0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgU2tpcFNlbGYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBWaWV3Q2hpbGQsXG4gIEluamVjdGlvblRva2VuLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgc3RhcnRXaXRoLCB0YWtlLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHttYXRFeHBhbnNpb25BbmltYXRpb25zfSBmcm9tICcuL2V4cGFuc2lvbi1hbmltYXRpb25zJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWxDb250ZW50fSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC1jb250ZW50JztcbmltcG9ydCB7TUFUX0FDQ09SRElPTiwgTWF0QWNjb3JkaW9uQmFzZSwgTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb259IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuXG4vKiogTWF0RXhwYW5zaW9uUGFuZWwncyBzdGF0ZXMuICovXG5leHBvcnQgdHlwZSBNYXRFeHBhbnNpb25QYW5lbFN0YXRlID0gJ2V4cGFuZGVkJyB8ICdjb2xsYXBzZWQnO1xuXG4vKiogQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgZWxlbWVudCBpZHMuICovXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIGZvciBhbGwgb2YgdGhlIGV4cGFuc2lvbiBwYW5lbHMgaW4gYSBtb2R1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIGV4cGFuZGVkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBjb2xsYXBzZWQuICovXG4gIGNvbGxhcHNlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIGhpZGVUb2dnbGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhbHRcbiAqIG9wdGlvbnMgZm9yIHRoZSBleHBhbnNpb24gcGFuZWwgY29tcG9uZW50LlxuICovXG5leHBvcnQgY29uc3QgTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zPignTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBgPG1hdC1leHBhbnNpb24tcGFuZWw+YFxuICpcbiAqIFRoaXMgY29tcG9uZW50IGNhbiBiZSB1c2VkIGFzIGEgc2luZ2xlIGVsZW1lbnQgdG8gc2hvdyBleHBhbmRhYmxlIGNvbnRlbnQsIG9yIGFzIG9uZSBvZlxuICogbXVsdGlwbGUgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCB3aXRoIHRoZSBNYXRBY2NvcmRpb24gZGlyZWN0aXZlIGF0dGFjaGVkLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc3R5bGVVcmxzOiBbJy4vZXhwYW5zaW9uLXBhbmVsLmNzcyddLFxuICBzZWxlY3RvcjogJ21hdC1leHBhbnNpb24tcGFuZWwnLFxuICBleHBvcnRBczogJ21hdEV4cGFuc2lvblBhbmVsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2V4cGFuc2lvbi1wYW5lbC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdleHBhbmRlZCddLFxuICBvdXRwdXRzOiBbJ29wZW5lZCcsICdjbG9zZWQnLCAnZXhwYW5kZWRDaGFuZ2UnXSxcbiAgYW5pbWF0aW9uczogW21hdEV4cGFuc2lvbkFuaW1hdGlvbnMuYm9keUV4cGFuc2lvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIC8vIFByb3ZpZGUgTWF0QWNjb3JkaW9uIGFzIHVuZGVmaW5lZCB0byBwcmV2ZW50IG5lc3RlZCBleHBhbnNpb24gcGFuZWxzIGZyb20gcmVnaXN0ZXJpbmdcbiAgICAvLyB0byB0aGUgc2FtZSBhY2NvcmRpb24uXG4gICAge3Byb3ZpZGU6IE1BVF9BQ0NPUkRJT04sIHVzZVZhbHVlOiB1bmRlZmluZWR9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwnLFxuICAgICdbY2xhc3MubWF0LWV4cGFuZGVkXSc6ICdleHBhbmRlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXBhbmVsLXNwYWNpbmddJzogJ19oYXNTcGFjaW5nKCknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsIGV4dGVuZHMgQ2RrQWNjb3JkaW9uSXRlbSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcml2YXRlIF9oaWRlVG9nZ2xlID0gZmFsc2U7XG4gIHByaXZhdGUgX3RvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbjtcblxuICAvKiogV2hldGhlciB0aGUgdG9nZ2xlIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVRvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZVRvZ2dsZSB8fCAodGhpcy5hY2NvcmRpb24gJiYgdGhpcy5hY2NvcmRpb24uaGlkZVRvZ2dsZSk7XG4gIH1cbiAgc2V0IGhpZGVUb2dnbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlVG9nZ2xlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0b2dnbGVQb3NpdGlvbigpOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RvZ2dsZVBvc2l0aW9uIHx8ICh0aGlzLmFjY29yZGlvbiAmJiB0aGlzLmFjY29yZGlvbi50b2dnbGVQb3NpdGlvbik7XG4gIH1cbiAgc2V0IHRvZ2dsZVBvc2l0aW9uKHZhbHVlOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbikge1xuICAgIHRoaXMuX3RvZ2dsZVBvc2l0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKiogQW4gZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYm9keSdzIGV4cGFuc2lvbiBhbmltYXRpb24gaGFwcGVucy4gKi9cbiAgQE91dHB1dCgpIGFmdGVyRXhwYW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBBbiBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBib2R5J3MgY29sbGFwc2UgYW5pbWF0aW9uIGhhcHBlbnMuICovXG4gIEBPdXRwdXQoKSBhZnRlckNvbGxhcHNlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyBmb3IgY2hhbmdlcyBpbiBgQElucHV0YCBwcm9wZXJ0aWVzLiAqL1xuICByZWFkb25seSBfaW5wdXRDaGFuZ2VzID0gbmV3IFN1YmplY3Q8U2ltcGxlQ2hhbmdlcz4oKTtcblxuICAvKiogT3B0aW9uYWxseSBkZWZpbmVkIGFjY29yZGlvbiB0aGUgZXhwYW5zaW9uIHBhbmVsIGJlbG9uZ3MgdG8uICovXG4gIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZTtcblxuICAvKiogQ29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LiAqL1xuICBAQ29udGVudENoaWxkKE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCkgX2xhenlDb250ZW50OiBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQ7XG5cbiAgLyoqIEVsZW1lbnQgY29udGFpbmluZyB0aGUgcGFuZWwncyB1c2VyLXByb3ZpZGVkIGNvbnRlbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2JvZHknKSBfYm9keTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFBvcnRhbCBob2xkaW5nIHRoZSB1c2VyJ3MgY29udGVudC4gKi9cbiAgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgLyoqIElEIGZvciB0aGUgYXNzb2NpYXRlZCBoZWFkZXIgZWxlbWVudC4gVXNlZCBmb3IgYTExeSBsYWJlbGxpbmcuICovXG4gIF9oZWFkZXJJZCA9IGBtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci0ke3VuaXF1ZUlkKyt9YDtcblxuICAvKiogU3RyZWFtIG9mIGJvZHkgYW5pbWF0aW9uIGRvbmUgZXZlbnRzLiAqL1xuICBfYm9keUFuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBASW5qZWN0KE1BVF9BQ0NPUkRJT04pIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZSxcbiAgICAgICAgICAgICAgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihhY2NvcmRpb24sIF9jaGFuZ2VEZXRlY3RvclJlZiwgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIpO1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYm9keUFuaW1hdGlvbkRvbmUucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICB9KSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2V4cGFuZGVkJykge1xuICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQuZW1pdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdjb2xsYXBzZWQnKSB7XG4gICAgICAgICAgdGhpcy5hZnRlckNvbGxhcHNlLmVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmhpZGVUb2dnbGUgPSBkZWZhdWx0T3B0aW9ucy5oaWRlVG9nZ2xlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCBzaG91bGQgaGF2ZSBzcGFjaW5nIGJldHdlZW4gaXQgYW5kIGl0cyBzaWJsaW5ncy4gKi9cbiAgX2hhc1NwYWNpbmcoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uKSB7XG4gICAgICAvLyBXZSBkb24ndCBuZWVkIHRvIHN1YnNjcmliZSB0byB0aGUgYHN0YXRlQ2hhbmdlc2Agb2YgdGhlIHBhcmVudCBhY2NvcmRpb24gYmVjYXVzZSBlYWNoIHRpbWVcbiAgICAgIC8vIHRoZSBbZGlzcGxheU1vZGVdIGlucHV0IGNoYW5nZXMsIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIHdpbGwgYWxzbyBjb3ZlciB0aGUgaG9zdCBiaW5kaW5nc1xuICAgICAgLy8gb2YgdGhpcyBleHBhbnNpb24gcGFuZWwuXG4gICAgICByZXR1cm4gKHRoaXMuZXhwYW5kZWQgPyB0aGlzLmFjY29yZGlvbi5kaXNwbGF5TW9kZSA6IHRoaXMuX2dldEV4cGFuZGVkU3RhdGUoKSkgPT09ICdkZWZhdWx0JztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZy4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogTWF0RXhwYW5zaW9uUGFuZWxTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgPyAnZXhwYW5kZWQnIDogJ2NvbGxhcHNlZCc7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2xhenlDb250ZW50KSB7XG4gICAgICAvLyBSZW5kZXIgdGhlIGNvbnRlbnQgYXMgc29vbiBhcyB0aGUgcGFuZWwgYmVjb21lcyBvcGVuLlxuICAgICAgdGhpcy5vcGVuZWQucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG51bGwhKSxcbiAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuZXhwYW5kZWQgJiYgIXRoaXMuX3BvcnRhbCksXG4gICAgICAgIHRha2UoMSlcbiAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX2xhenlDb250ZW50Ll90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLm5leHQoY2hhbmdlcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2JvZHlBbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCdzIGNvbnRlbnQgY29udGFpbnMgdGhlIGN1cnJlbnRseS1mb2N1c2VkIGVsZW1lbnQuICovXG4gIF9jb250YWluc0ZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9ib2R5KSB7XG4gICAgICBjb25zdCBmb2N1c2VkRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBib2R5RWxlbWVudCA9IHRoaXMuX2JvZHkubmF0aXZlRWxlbWVudDtcbiAgICAgIHJldHVybiBmb2N1c2VkRWxlbWVudCA9PT0gYm9keUVsZW1lbnQgfHwgYm9keUVsZW1lbnQuY29udGFpbnMoZm9jdXNlZEVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlVG9nZ2xlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZXhwYW5kZWQ6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8IHN0cmluZztcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWFjdGlvbi1yb3cnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtYWN0aW9uLXJvdydcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEFjdGlvblJvdyB7fVxuIl19