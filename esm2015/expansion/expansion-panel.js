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
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, Optional, Output, SkipSelf, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, startWith, take } from 'rxjs/operators';
import { MAT_ACCORDION } from './accordion-base';
import { matExpansionAnimations } from './expansion-animations';
import { MatExpansionPanelContent } from './expansion-panel-content';
/** Counter for generating unique element ids. */
let uniqueId = 0;
/**
 * Injection token that can be used to configure the defalt
 * options for the expansion panel component.
 */
export const MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
const ɵ0 = undefined;
/**
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
export class MatExpansionPanel extends CdkAccordionItem {
    constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, _document, _animationMode, defaultOptions) {
        super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
        this._viewContainerRef = _viewContainerRef;
        this._animationMode = _animationMode;
        this._hideToggle = false;
        /** An event emitted after the body's expansion animation happens. */
        this.afterExpand = new EventEmitter();
        /** An event emitted after the body's collapse animation happens. */
        this.afterCollapse = new EventEmitter();
        /** Stream that emits for changes in `@Input` properties. */
        this._inputChanges = new Subject();
        /** ID for the associated header element. Used for a11y labelling. */
        this._headerId = `mat-expansion-panel-header-${uniqueId++}`;
        /** Stream of body animation done events. */
        this._bodyAnimationDone = new Subject();
        this.accordion = accordion;
        this._document = _document;
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._bodyAnimationDone.pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(event => {
            if (event.fromState !== 'void') {
                if (event.toState === 'expanded') {
                    this.afterExpand.emit();
                }
                else if (event.toState === 'collapsed') {
                    this.afterCollapse.emit();
                }
            }
        });
        if (defaultOptions) {
            this.hideToggle = defaultOptions.hideToggle;
        }
    }
    /** Whether the toggle indicator should be hidden. */
    get hideToggle() {
        return this._hideToggle || (this.accordion && this.accordion.hideToggle);
    }
    set hideToggle(value) {
        this._hideToggle = coerceBooleanProperty(value);
    }
    /** The position of the expansion indicator. */
    get togglePosition() {
        return this._togglePosition || (this.accordion && this.accordion.togglePosition);
    }
    set togglePosition(value) {
        this._togglePosition = value;
    }
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    _hasSpacing() {
        if (this.accordion) {
            return this.expanded && this.accordion.displayMode === 'default';
        }
        return false;
    }
    /** Gets the expanded state string. */
    _getExpandedState() {
        return this.expanded ? 'expanded' : 'collapsed';
    }
    /** Toggles the expanded state of the expansion panel. */
    toggle() {
        this.expanded = !this.expanded;
    }
    /** Sets the expanded state of the expansion panel to false. */
    close() {
        this.expanded = false;
    }
    /** Sets the expanded state of the expansion panel to true. */
    open() {
        this.expanded = true;
    }
    ngAfterContentInit() {
        if (this._lazyContent) {
            // Render the content as soon as the panel becomes open.
            this.opened.pipe(startWith(null), filter(() => this.expanded && !this._portal), take(1)).subscribe(() => {
                this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
            });
        }
    }
    ngOnChanges(changes) {
        this._inputChanges.next(changes);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._bodyAnimationDone.complete();
        this._inputChanges.complete();
    }
    /** Checks whether the expansion panel's content contains the currently-focused element. */
    _containsFocus() {
        if (this._body) {
            const focusedElement = this._document.activeElement;
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
                styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button-base,.mat-action-row button.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button-base,[dir=rtl] .mat-action-row button.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"]
            },] }
];
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
/**
 * Actions of a `<mat-expansion-panel>`.
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDeEQsT0FBTyxFQUFlLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDMUUsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixjQUFjLEVBQ2QsS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0UsT0FBTyxFQUErQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM3RixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUtuRSxpREFBaUQ7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QUFRLFlBQUksUUFBUSxZQUFJLE1BQU0sU0FBQyxhQUFhO1lBbkl6RCxpQkFBaUI7WUFOWCx5QkFBeUI7WUFzQi9CLGdCQUFnQjs0Q0F1SEgsTUFBTSxTQUFDLFFBQVE7eUNBQ2YsUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7NENBQ3hDLE1BQU0sU0FBQyxtQ0FBbUMsY0FBRyxRQUFROzs7eUJBbERqRSxLQUFLOzZCQVNMLEtBQUs7MEJBU0wsTUFBTTs0QkFHTixNQUFNOzJCQVNOLFlBQVksU0FBQyx3QkFBd0I7b0JBR3JDLFNBQVMsU0FBQyxNQUFNOztBQTZHbkI7O0dBRUc7QUFPSCxNQUFNLE9BQU8sMEJBQTBCOzs7WUFOdEMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsZ0JBQWdCO2lCQUN4QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QW5pbWF0aW9uRXZlbnR9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtDZGtBY2NvcmRpb25JdGVtfSBmcm9tICdAYW5ndWxhci9jZGsvYWNjb3JkaW9uJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBTa2lwU2VsZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaWx0ZXIsIHN0YXJ0V2l0aCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXRBY2NvcmRpb25CYXNlLCBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiwgTUFUX0FDQ09SRElPTn0gZnJvbSAnLi9hY2NvcmRpb24tYmFzZSc7XG5pbXBvcnQge21hdEV4cGFuc2lvbkFuaW1hdGlvbnN9IGZyb20gJy4vZXhwYW5zaW9uLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbENvbnRlbnR9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnO1xuXG4vKiogTWF0RXhwYW5zaW9uUGFuZWwncyBzdGF0ZXMuICovXG5leHBvcnQgdHlwZSBNYXRFeHBhbnNpb25QYW5lbFN0YXRlID0gJ2V4cGFuZGVkJyB8ICdjb2xsYXBzZWQnO1xuXG4vKiogQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgZWxlbWVudCBpZHMuICovXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIGZvciBhbGwgb2YgdGhlIGV4cGFuc2lvbiBwYW5lbHMgaW4gYSBtb2R1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIGV4cGFuZGVkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBjb2xsYXBzZWQuICovXG4gIGNvbGxhcHNlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIGhpZGVUb2dnbGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhbHRcbiAqIG9wdGlvbnMgZm9yIHRoZSBleHBhbnNpb24gcGFuZWwgY29tcG9uZW50LlxuICovXG5leHBvcnQgY29uc3QgTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRFeHBhbnNpb25QYW5lbERlZmF1bHRPcHRpb25zPignTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMnKTtcblxuLyoqXG4gKiBUaGlzIGNvbXBvbmVudCBjYW4gYmUgdXNlZCBhcyBhIHNpbmdsZSBlbGVtZW50IHRvIHNob3cgZXhwYW5kYWJsZSBjb250ZW50LCBvciBhcyBvbmUgb2ZcbiAqIG11bHRpcGxlIGNoaWxkcmVuIG9mIGFuIGVsZW1lbnQgd2l0aCB0aGUgTWF0QWNjb3JkaW9uIGRpcmVjdGl2ZSBhdHRhY2hlZC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHN0eWxlVXJsczogWydleHBhbnNpb24tcGFuZWwuY3NzJ10sXG4gIHNlbGVjdG9yOiAnbWF0LWV4cGFuc2lvbi1wYW5lbCcsXG4gIGV4cG9ydEFzOiAnbWF0RXhwYW5zaW9uUGFuZWwnLFxuICB0ZW1wbGF0ZVVybDogJ2V4cGFuc2lvbi1wYW5lbC5odG1sJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogWydkaXNhYmxlZCcsICdleHBhbmRlZCddLFxuICBvdXRwdXRzOiBbJ29wZW5lZCcsICdjbG9zZWQnLCAnZXhwYW5kZWRDaGFuZ2UnXSxcbiAgYW5pbWF0aW9uczogW21hdEV4cGFuc2lvbkFuaW1hdGlvbnMuYm9keUV4cGFuc2lvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIC8vIFByb3ZpZGUgTWF0QWNjb3JkaW9uIGFzIHVuZGVmaW5lZCB0byBwcmV2ZW50IG5lc3RlZCBleHBhbnNpb24gcGFuZWxzIGZyb20gcmVnaXN0ZXJpbmdcbiAgICAvLyB0byB0aGUgc2FtZSBhY2NvcmRpb24uXG4gICAge3Byb3ZpZGU6IE1BVF9BQ0NPUkRJT04sIHVzZVZhbHVlOiB1bmRlZmluZWR9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwnLFxuICAgICdbY2xhc3MubWF0LWV4cGFuZGVkXSc6ICdleHBhbmRlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXBhbmVsLXNwYWNpbmddJzogJ19oYXNTcGFjaW5nKCknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsIGV4dGVuZHMgQ2RrQWNjb3JkaW9uSXRlbSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcml2YXRlIF9oaWRlVG9nZ2xlID0gZmFsc2U7XG4gIHByaXZhdGUgX3RvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbjtcblxuICAvKiogV2hldGhlciB0aGUgdG9nZ2xlIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVRvZ2dsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZVRvZ2dsZSB8fCAodGhpcy5hY2NvcmRpb24gJiYgdGhpcy5hY2NvcmRpb24uaGlkZVRvZ2dsZSk7XG4gIH1cbiAgc2V0IGhpZGVUb2dnbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlVG9nZ2xlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIEBJbnB1dCgpXG4gIGdldCB0b2dnbGVQb3NpdGlvbigpOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RvZ2dsZVBvc2l0aW9uIHx8ICh0aGlzLmFjY29yZGlvbiAmJiB0aGlzLmFjY29yZGlvbi50b2dnbGVQb3NpdGlvbik7XG4gIH1cbiAgc2V0IHRvZ2dsZVBvc2l0aW9uKHZhbHVlOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbikge1xuICAgIHRoaXMuX3RvZ2dsZVBvc2l0aW9uID0gdmFsdWU7XG4gIH1cblxuICAvKiogQW4gZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYm9keSdzIGV4cGFuc2lvbiBhbmltYXRpb24gaGFwcGVucy4gKi9cbiAgQE91dHB1dCgpIGFmdGVyRXhwYW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBBbiBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBib2R5J3MgY29sbGFwc2UgYW5pbWF0aW9uIGhhcHBlbnMuICovXG4gIEBPdXRwdXQoKSBhZnRlckNvbGxhcHNlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyBmb3IgY2hhbmdlcyBpbiBgQElucHV0YCBwcm9wZXJ0aWVzLiAqL1xuICByZWFkb25seSBfaW5wdXRDaGFuZ2VzID0gbmV3IFN1YmplY3Q8U2ltcGxlQ2hhbmdlcz4oKTtcblxuICAvKiogT3B0aW9uYWxseSBkZWZpbmVkIGFjY29yZGlvbiB0aGUgZXhwYW5zaW9uIHBhbmVsIGJlbG9uZ3MgdG8uICovXG4gIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZTtcblxuICAvKiogQ29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LiAqL1xuICBAQ29udGVudENoaWxkKE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCkgX2xhenlDb250ZW50OiBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQ7XG5cbiAgLyoqIEVsZW1lbnQgY29udGFpbmluZyB0aGUgcGFuZWwncyB1c2VyLXByb3ZpZGVkIGNvbnRlbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2JvZHknKSBfYm9keTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFBvcnRhbCBob2xkaW5nIHRoZSB1c2VyJ3MgY29udGVudC4gKi9cbiAgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgLyoqIElEIGZvciB0aGUgYXNzb2NpYXRlZCBoZWFkZXIgZWxlbWVudC4gVXNlZCBmb3IgYTExeSBsYWJlbGxpbmcuICovXG4gIF9oZWFkZXJJZCA9IGBtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci0ke3VuaXF1ZUlkKyt9YDtcblxuICAvKiogU3RyZWFtIG9mIGJvZHkgYW5pbWF0aW9uIGRvbmUgZXZlbnRzLiAqL1xuICBfYm9keUFuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBASW5qZWN0KE1BVF9BQ0NPUkRJT04pIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZSxcbiAgICAgICAgICAgICAgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXI6IFVuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudDogYW55LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlOiBzdHJpbmcsXG4gICAgICAgICAgICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpIEBPcHRpb25hbCgpXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMpIHtcbiAgICBzdXBlcihhY2NvcmRpb24sIF9jaGFuZ2VEZXRlY3RvclJlZiwgX3VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXIpO1xuICAgIHRoaXMuYWNjb3JkaW9uID0gYWNjb3JkaW9uO1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuXG4gICAgLy8gV2UgbmVlZCBhIFN1YmplY3Qgd2l0aCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYmVjYXVzZSB0aGUgYGRvbmVgIGV2ZW50XG4gICAgLy8gZmlyZXMgdHdpY2Ugb24gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0XG4gICAgdGhpcy5fYm9keUFuaW1hdGlvbkRvbmUucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeCwgeSkgPT4ge1xuICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICB9KSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgIGlmIChldmVudC5mcm9tU3RhdGUgIT09ICd2b2lkJykge1xuICAgICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2V4cGFuZGVkJykge1xuICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQuZW1pdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdjb2xsYXBzZWQnKSB7XG4gICAgICAgICAgdGhpcy5hZnRlckNvbGxhcHNlLmVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRlZmF1bHRPcHRpb25zKSB7XG4gICAgICB0aGlzLmhpZGVUb2dnbGUgPSBkZWZhdWx0T3B0aW9ucy5oaWRlVG9nZ2xlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCBzaG91bGQgaGF2ZSBzcGFjaW5nIGJldHdlZW4gaXQgYW5kIGl0cyBzaWJsaW5ncy4gKi9cbiAgX2hhc1NwYWNpbmcoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYWNjb3JkaW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRlZCAmJiB0aGlzLmFjY29yZGlvbi5kaXNwbGF5TW9kZSA9PT0gJ2RlZmF1bHQnO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgc3RyaW5nLiAqL1xuICBfZ2V0RXhwYW5kZWRTdGF0ZSgpOiBNYXRFeHBhbnNpb25QYW5lbFN0YXRlIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZCA/ICdleHBhbmRlZCcgOiAnY29sbGFwc2VkJztcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgZXhwYW5zaW9uIHBhbmVsLiAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbmRlZCA9ICF0aGlzLmV4cGFuZGVkO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBleHBhbnNpb24gcGFuZWwgdG8gZmFsc2UuICovXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgZXhwYW5zaW9uIHBhbmVsIHRvIHRydWUuICovXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5leHBhbmRlZCA9IHRydWU7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2xhenlDb250ZW50KSB7XG4gICAgICAvLyBSZW5kZXIgdGhlIGNvbnRlbnQgYXMgc29vbiBhcyB0aGUgcGFuZWwgYmVjb21lcyBvcGVuLlxuICAgICAgdGhpcy5vcGVuZWQucGlwZShcbiAgICAgICAgc3RhcnRXaXRoKG51bGwhKSxcbiAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuZXhwYW5kZWQgJiYgIXRoaXMuX3BvcnRhbCksXG4gICAgICAgIHRha2UoMSlcbiAgICAgICkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMuX2xhenlDb250ZW50Ll90ZW1wbGF0ZSwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLm5leHQoY2hhbmdlcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2JvZHlBbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5faW5wdXRDaGFuZ2VzLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGV4cGFuc2lvbiBwYW5lbCdzIGNvbnRlbnQgY29udGFpbnMgdGhlIGN1cnJlbnRseS1mb2N1c2VkIGVsZW1lbnQuICovXG4gIF9jb250YWluc0ZvY3VzKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9ib2R5KSB7XG4gICAgICBjb25zdCBmb2N1c2VkRWxlbWVudCA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBib2R5RWxlbWVudCA9IHRoaXMuX2JvZHkubmF0aXZlRWxlbWVudDtcbiAgICAgIHJldHVybiBmb2N1c2VkRWxlbWVudCA9PT0gYm9keUVsZW1lbnQgfHwgYm9keUVsZW1lbnQuY29udGFpbnMoZm9jdXNlZEVsZW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlVG9nZ2xlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9leHBhbmRlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbn1cblxuLyoqXG4gKiBBY3Rpb25zIG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY3Rpb24tcm93JyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWFjdGlvbi1yb3cnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxBY3Rpb25Sb3cge31cbiJdfQ==