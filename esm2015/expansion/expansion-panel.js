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
    _lazyContent: [{ type: ContentChild, args: [MatExpansionPanelContent, { static: false },] }],
    _body: [{ type: ViewChild, args: ['body', { static: false },] }]
};
if (false) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixNQUFNLEVBRU4sUUFBUSxFQUNSLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGNBQWMsR0FDZixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsYUFBYSxFQUErQyxNQUFNLGtCQUFrQixDQUFDOzs7OztJQU16RixRQUFRLEdB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LE1BQU0sU0FBQyxtQ0FBbUMsY0FBRyxRQUFROzs7eUJBbERqRSxLQUFLOzZCQVNMLEtBQUs7MEJBU0wsTUFBTTs0QkFHTixNQUFNOzJCQVNOLFlBQVksU0FBQyx3QkFBd0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7b0JBR3RELFNBQVMsU0FBQyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDOzs7Ozs7O0lBdENsQyxzQ0FBNEI7Ozs7O0lBQzVCLHdDQUE0Qjs7Ozs7SUFDNUIsNENBQW9EOzs7OztJQXFCcEQsd0NBQWlEOzs7OztJQUdqRCwwQ0FBbUQ7Ozs7O0lBR25ELDBDQUFzRDs7Ozs7SUFHdEQsc0NBQTRCOzs7OztJQUc1Qix5Q0FBZ0c7Ozs7O0lBR2hHLGtDQUFtRTs7Ozs7SUFHbkUsb0NBQXdCOzs7OztJQUd4QixzQ0FBdUQ7Ozs7O0lBR3ZELCtDQUFtRDs7Ozs7SUFLdkMsOENBQTJDOztJQUUzQywyQ0FBd0U7O0FBbUZ0RixNQUFNLE9BQU8sMEJBQTBCOzs7WUFOdEMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsZ0JBQWdCO2lCQUN4QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtDZGtBY2NvcmRpb25JdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvYWNjb3JkaW9uJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIEluamVjdCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFNraXBTZWxmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld0NoaWxkLFxuICBJbmplY3Rpb25Ub2tlbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHN0YXJ0V2l0aCwgdGFrZSwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bWF0RXhwYW5zaW9uQW5pbWF0aW9uc30gZnJvbSAnLi9leHBhbnNpb24tYW5pbWF0aW9ucyc7XG5pbXBvcnQge01hdEV4cGFuc2lvblBhbmVsQ29udGVudH0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtY29udGVudCc7XG5pbXBvcnQge01BVF9BQ0NPUkRJT04sIE1hdEFjY29yZGlvbkJhc2UsIE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9ufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcblxuLyoqIE1hdEV4cGFuc2lvblBhbmVsJ3Mgc3RhdGVzLiAqL1xuZXhwb3J0IHR5cGUgTWF0RXhwYW5zaW9uUGFuZWxTdGF0ZSA9ICdleHBhbmRlZCcgfCAnY29sbGFwc2VkJztcblxuLyoqIENvdW50ZXIgZm9yIGdlbmVyYXRpbmcgdW5pcXVlIGVsZW1lbnQgaWRzLiAqL1xubGV0IHVuaXF1ZUlkID0gMDtcblxuLyoqXG4gKiBPYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zXG4gKiBmb3IgYWxsIG9mIHRoZSBleHBhbnNpb24gcGFuZWxzIGluIGEgbW9kdWxlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMge1xuICAvKiogSGVpZ2h0IG9mIHRoZSBoZWFkZXIgd2hpbGUgdGhlIHBhbmVsIGlzIGV4cGFuZGVkLiAqL1xuICBleHBhbmRlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgY29sbGFwc2VkLiAqL1xuICBjb2xsYXBzZWRIZWlnaHQ6IHN0cmluZztcblxuICAvKiogV2hldGhlciB0aGUgdG9nZ2xlIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBoaWRlVG9nZ2xlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYWx0XG4gKiBvcHRpb25zIGZvciB0aGUgZXhwYW5zaW9uIHBhbmVsIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48TWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucz4oJ01BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TJyk7XG5cbi8qKlxuICogYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmBcbiAqXG4gKiBUaGlzIGNvbXBvbmVudCBjYW4gYmUgdXNlZCBhcyBhIHNpbmdsZSBlbGVtZW50IHRvIHNob3cgZXhwYW5kYWJsZSBjb250ZW50LCBvciBhcyBvbmUgb2ZcbiAqIG11bHRpcGxlIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgd2l0aCB0aGUgTWF0QWNjb3JkaW9uIGRpcmVjdGl2ZSBhdHRhY2hlZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHN0eWxlVXJsczogWycuL2V4cGFuc2lvbi1wYW5lbC5jc3MnXSxcbiAgc2VsZWN0b3I6ICdtYXQtZXhwYW5zaW9uLXBhbmVsJyxcbiAgZXhwb3J0QXM6ICdtYXRFeHBhbnNpb25QYW5lbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9leHBhbnNpb24tcGFuZWwuaHRtbCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZXhwYW5kZWQnXSxcbiAgb3V0cHV0czogWydvcGVuZWQnLCAnY2xvc2VkJywgJ2V4cGFuZGVkQ2hhbmdlJ10sXG4gIGFuaW1hdGlvbnM6IFttYXRFeHBhbnNpb25BbmltYXRpb25zLmJvZHlFeHBhbnNpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICAvLyBQcm92aWRlIE1hdEFjY29yZGlvbiBhcyB1bmRlZmluZWQgdG8gcHJldmVudCBuZXN0ZWQgZXhwYW5zaW9uIHBhbmVscyBmcm9tIHJlZ2lzdGVyaW5nXG4gICAgLy8gdG8gdGhlIHNhbWUgYWNjb3JkaW9uLlxuICAgIHtwcm92aWRlOiBNQVRfQUNDT1JESU9OLCB1c2VWYWx1ZTogdW5kZWZpbmVkfSxcbiAgXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZXhwYW5zaW9uLXBhbmVsJyxcbiAgICAnW2NsYXNzLm1hdC1leHBhbmRlZF0nOiAnZXhwYW5kZWQnLFxuICAgICdbY2xhc3MuX21hdC1hbmltYXRpb24tbm9vcGFibGVdJzogJ19hbmltYXRpb25Nb2RlID09PSBcIk5vb3BBbmltYXRpb25zXCInLFxuICAgICdbY2xhc3MubWF0LWV4cGFuc2lvbi1wYW5lbC1zcGFjaW5nXSc6ICdfaGFzU3BhY2luZygpJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbCBleHRlbmRzIENka0FjY29yZGlvbkl0ZW0gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSBfaGlkZVRvZ2dsZSA9IGZhbHNlO1xuICBwcml2YXRlIF90b2dnbGVQb3NpdGlvbjogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb247XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRvZ2dsZSBpbmRpY2F0b3Igc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVUb2dnbGUgfHwgKHRoaXMuYWNjb3JkaW9uICYmIHRoaXMuYWNjb3JkaW9uLmhpZGVUb2dnbGUpO1xuICB9XG4gIHNldCBoaWRlVG9nZ2xlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVRvZ2dsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cblxuICAvKiogVGhlIHBvc2l0aW9uIG9mIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdG9nZ2xlUG9zaXRpb24oKTogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24ge1xuICAgIHJldHVybiB0aGlzLl90b2dnbGVQb3NpdGlvbiB8fCAodGhpcy5hY2NvcmRpb24gJiYgdGhpcy5hY2NvcmRpb24udG9nZ2xlUG9zaXRpb24pO1xuICB9XG4gIHNldCB0b2dnbGVQb3NpdGlvbih2YWx1ZTogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24pIHtcbiAgICB0aGlzLl90b2dnbGVQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqIEFuIGV2ZW50IGVtaXR0ZWQgYWZ0ZXIgdGhlIGJvZHkncyBleHBhbnNpb24gYW5pbWF0aW9uIGhhcHBlbnMuICovXG4gIEBPdXRwdXQoKSBhZnRlckV4cGFuZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogQW4gZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYm9keSdzIGNvbGxhcHNlIGFuaW1hdGlvbiBoYXBwZW5zLiAqL1xuICBAT3V0cHV0KCkgYWZ0ZXJDb2xsYXBzZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogU3RyZWFtIHRoYXQgZW1pdHMgZm9yIGNoYW5nZXMgaW4gYEBJbnB1dGAgcHJvcGVydGllcy4gKi9cbiAgcmVhZG9ubHkgX2lucHV0Q2hhbmdlcyA9IG5ldyBTdWJqZWN0PFNpbXBsZUNoYW5nZXM+KCk7XG5cbiAgLyoqIE9wdGlvbmFsbHkgZGVmaW5lZCBhY2NvcmRpb24gdGhlIGV4cGFuc2lvbiBwYW5lbCBiZWxvbmdzIHRvLiAqL1xuICBhY2NvcmRpb246IE1hdEFjY29yZGlvbkJhc2U7XG5cbiAgLyoqIENvbnRlbnQgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGxhemlseS4gKi9cbiAgQENvbnRlbnRDaGlsZChNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQsIHtzdGF0aWM6IGZhbHNlfSkgX2xhenlDb250ZW50OiBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQ7XG5cbiAgLyoqIEVsZW1lbnQgY29udGFpbmluZyB0aGUgcGFuZWwncyB1c2VyLXByb3ZpZGVkIGNvbnRlbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2JvZHknLCB7c3RhdGljOiBmYWxzZX0pIF9ib2R5OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKiogUG9ydGFsIGhvbGRpbmcgdGhlIHVzZXIncyBjb250ZW50LiAqL1xuICBfcG9ydGFsOiBUZW1wbGF0ZVBvcnRhbDtcblxuICAvKiogSUQgZm9yIHRoZSBhc3NvY2lhdGVkIGhlYWRlciBlbGVtZW50LiBVc2VkIGZvciBhMTF5IGxhYmVsbGluZy4gKi9cbiAgX2hlYWRlcklkID0gYG1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLSR7dW5pcXVlSWQrK31gO1xuXG4gIC8qKiBTdHJlYW0gb2YgYm9keSBhbmltYXRpb24gZG9uZSBldmVudHMuICovXG4gIF9ib2R5QW5pbWF0aW9uRG9uZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIEBJbmplY3QoTUFUX0FDQ09SRElPTikgYWNjb3JkaW9uOiBNYXRBY2NvcmRpb25CYXNlLFxuICAgICAgICAgICAgICBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBfdW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcjogVW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU6IHN0cmluZyxcbiAgICAgICAgICAgICAgQEluamVjdChNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUykgQE9wdGlvbmFsKClcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zPzogTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucykge1xuICAgIHN1cGVyKGFjY29yZGlvbiwgX2NoYW5nZURldGVjdG9yUmVmLCBfdW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcik7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG5cbiAgICAvLyBXZSBuZWVkIGEgU3ViamVjdCB3aXRoIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBiZWNhdXNlIHRoZSBgZG9uZWAgZXZlbnRcbiAgICAvLyBmaXJlcyB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9ib2R5QW5pbWF0aW9uRG9uZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgaWYgKGV2ZW50LmZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB7XG4gICAgICAgIGlmIChldmVudC50b1N0YXRlID09PSAnZXhwYW5kZWQnKSB7XG4gICAgICAgICAgdGhpcy5hZnRlckV4cGFuZC5lbWl0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2NvbGxhcHNlZCcpIHtcbiAgICAgICAgICB0aGlzLmFmdGVyQ29sbGFwc2UuZW1pdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZGVmYXVsdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaGlkZVRvZ2dsZSA9IGRlZmF1bHRPcHRpb25zLmhpZGVUb2dnbGU7XG4gICAgfVxuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciB0aGUgZXhwYW5zaW9uIHBhbmVsIHNob3VsZCBoYXZlIHNwYWNpbmcgYmV0d2VlbiBpdCBhbmQgaXRzIHNpYmxpbmdzLiAqL1xuICBfaGFzU3BhY2luZygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5hY2NvcmRpb24pIHtcbiAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gc3Vic2NyaWJlIHRvIHRoZSBgc3RhdGVDaGFuZ2VzYCBvZiB0aGUgcGFyZW50IGFjY29yZGlvbiBiZWNhdXNlIGVhY2ggdGltZVxuICAgICAgLy8gdGhlIFtkaXNwbGF5TW9kZV0gaW5wdXQgY2hhbmdlcywgdGhlIGNoYW5nZSBkZXRlY3Rpb24gd2lsbCBhbHNvIGNvdmVyIHRoZSBob3N0IGJpbmRpbmdzXG4gICAgICAvLyBvZiB0aGlzIGV4cGFuc2lvbiBwYW5lbC5cbiAgICAgIHJldHVybiAodGhpcy5leHBhbmRlZCA/IHRoaXMuYWNjb3JkaW9uLmRpc3BsYXlNb2RlIDogdGhpcy5fZ2V0RXhwYW5kZWRTdGF0ZSgpKSA9PT0gJ2RlZmF1bHQnO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nLiAqL1xuICBfZ2V0RXhwYW5kZWRTdGF0ZSgpOiBNYXRFeHBhbnNpb25QYW5lbFN0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZCA/ICdleHBhbmRlZCcgOiAnY29sbGFwc2VkJztcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbGF6eUNvbnRlbnQpIHtcbiAgICAgIC8vIFJlbmRlciB0aGUgY29udGVudCBhcyBzb29uIGFzIHRoZSBwYW5lbCBiZWNvbWVzIG9wZW4uXG4gICAgICB0aGlzLm9wZW5lZC5waXBlKFxuICAgICAgICBzdGFydFdpdGgobnVsbCEpLFxuICAgICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5leHBhbmRlZCAmJiAhdGhpcy5fcG9ydGFsKSxcbiAgICAgICAgdGFrZSgxKVxuICAgICAgKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fbGF6eUNvbnRlbnQuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLl9pbnB1dENoYW5nZXMubmV4dChjaGFuZ2VzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fYm9keUFuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgICB0aGlzLl9pbnB1dENoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZXhwYW5zaW9uIHBhbmVsJ3MgY29udGVudCBjb250YWlucyB0aGUgY3VycmVudGx5LWZvY3VzZWQgZWxlbWVudC4gKi9cbiAgX2NvbnRhaW5zRm9jdXMoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2JvZHkpIHtcbiAgICAgIGNvbnN0IGZvY3VzZWRFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGJvZHlFbGVtZW50ID0gdGhpcy5fYm9keS5uYXRpdmVFbGVtZW50O1xuICAgICAgcmV0dXJuIGZvY3VzZWRFbGVtZW50ID09PSBib2R5RWxlbWVudCB8fCBib2R5RWxlbWVudC5jb250YWlucyhmb2N1c2VkRWxlbWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY3Rpb24tcm93JyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWFjdGlvbi1yb3cnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxBY3Rpb25Sb3cge31cbiJdfQ==