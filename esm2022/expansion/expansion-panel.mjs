import { CdkAccordionItem } from '@angular/cdk/accordion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, Optional, Output, SkipSelf, ViewChild, ViewContainerRef, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter, startWith, take } from 'rxjs/operators';
import { MAT_ACCORDION } from './accordion-base';
import { matExpansionAnimations } from './expansion-animations';
import { MAT_EXPANSION_PANEL } from './expansion-panel-base';
import { MatExpansionPanelContent } from './expansion-panel-content';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/collections";
/** Counter for generating unique element ids. */
let uniqueId = 0;
/**
 * Injection token that can be used to configure the default
 * options for the expansion panel component.
 */
export const MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
/**
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
export class MatExpansionPanel extends CdkAccordionItem {
    /** Whether the toggle indicator should be hidden. */
    get hideToggle() {
        return this._hideToggle || (this.accordion && this.accordion.hideToggle);
    }
    set hideToggle(value) {
        this._hideToggle = value;
    }
    /** The position of the expansion indicator. */
    get togglePosition() {
        return this._togglePosition || (this.accordion && this.accordion.togglePosition);
    }
    set togglePosition(value) {
        this._togglePosition = value;
    }
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
        this._bodyAnimationDone
            .pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        }))
            .subscribe(event => {
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
        if (this._lazyContent && this._lazyContent._expansionPanel === this) {
            // Render the content as soon as the panel becomes open.
            this.opened
                .pipe(startWith(null), filter(() => this.expanded && !this._portal), take(1))
                .subscribe(() => {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatExpansionPanel, deps: [{ token: MAT_ACCORDION, optional: true, skipSelf: true }, { token: i0.ChangeDetectorRef }, { token: i1.UniqueSelectionDispatcher }, { token: i0.ViewContainerRef }, { token: DOCUMENT }, { token: ANIMATION_MODULE_TYPE, optional: true }, { token: MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.1.0-next.5", type: MatExpansionPanel, isStandalone: true, selector: "mat-expansion-panel", inputs: { hideToggle: ["hideToggle", "hideToggle", booleanAttribute], togglePosition: "togglePosition" }, outputs: { afterExpand: "afterExpand", afterCollapse: "afterCollapse" }, host: { properties: { "class.mat-expanded": "expanded", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "class.mat-expansion-panel-spacing": "_hasSpacing()" }, classAttribute: "mat-expansion-panel" }, providers: [
            // Provide MatAccordion as undefined to prevent nested expansion panels from registering
            // to the same accordion.
            { provide: MAT_ACCORDION, useValue: undefined },
            { provide: MAT_EXPANSION_PANEL, useExisting: MatExpansionPanel },
        ], queries: [{ propertyName: "_lazyContent", first: true, predicate: MatExpansionPanelContent, descendants: true }], viewQueries: [{ propertyName: "_body", first: true, predicate: ["body"], descendants: true }], exportAs: ["matExpansionPanel"], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content>\n<div class=\"mat-expansion-panel-content\"\n     role=\"region\"\n     [@bodyExpansion]=\"_getExpandedState()\"\n     (@bodyExpansion.done)=\"_bodyAnimationDone.next($event)\"\n     [attr.aria-labelledby]=\"_headerId\"\n     [id]=\"id\"\n     #body>\n  <div class=\"mat-expansion-panel-body\">\n    <ng-content></ng-content>\n    <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n  </div>\n  <ng-content select=\"mat-action-row\"></ng-content>\n</div>\n", styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative;background:var(--mat-expansion-container-background-color);color:var(--mat-expansion-container-text-color);border-radius:var(--mat-expansion-container-shape)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:var(--mat-expansion-container-shape);border-top-left-radius:var(--mat-expansion-container-shape)}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:var(--mat-expansion-container-shape);border-bottom-left-radius:var(--mat-expansion-container-shape)}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible;font-family:var(--mat-expansion-container-text-font);font-size:var(--mat-expansion-container-text-size);font-weight:var(--mat-expansion-container-text-weight);line-height:var(--mat-expansion-container-text-line-height);letter-spacing:var(--mat-expansion-container-text-tracking)}.mat-expansion-panel-content[style*=\"visibility: hidden\"] *{visibility:hidden !important}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;border-top-color:var(--mat-expansion-actions-divider-color)}.mat-action-row .mat-button-base,.mat-action-row .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row .mat-button-base,[dir=rtl] .mat-action-row .mat-mdc-button-base{margin-left:0;margin-right:8px}"], dependencies: [{ kind: "directive", type: CdkPortalOutlet, selector: "[cdkPortalOutlet]", inputs: ["cdkPortalOutlet"], outputs: ["attached"], exportAs: ["cdkPortalOutlet"] }], animations: [matExpansionAnimations.bodyExpansion], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatExpansionPanel, decorators: [{
            type: Component,
            args: [{ selector: 'mat-expansion-panel', exportAs: 'matExpansionPanel', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, animations: [matExpansionAnimations.bodyExpansion], providers: [
                        // Provide MatAccordion as undefined to prevent nested expansion panels from registering
                        // to the same accordion.
                        { provide: MAT_ACCORDION, useValue: undefined },
                        { provide: MAT_EXPANSION_PANEL, useExisting: MatExpansionPanel },
                    ], host: {
                        'class': 'mat-expansion-panel',
                        '[class.mat-expanded]': 'expanded',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
                    }, standalone: true, imports: [CdkPortalOutlet], template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content>\n<div class=\"mat-expansion-panel-content\"\n     role=\"region\"\n     [@bodyExpansion]=\"_getExpandedState()\"\n     (@bodyExpansion.done)=\"_bodyAnimationDone.next($event)\"\n     [attr.aria-labelledby]=\"_headerId\"\n     [id]=\"id\"\n     #body>\n  <div class=\"mat-expansion-panel-body\">\n    <ng-content></ng-content>\n    <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n  </div>\n  <ng-content select=\"mat-action-row\"></ng-content>\n</div>\n", styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative;background:var(--mat-expansion-container-background-color);color:var(--mat-expansion-container-text-color);border-radius:var(--mat-expansion-container-shape)}.mat-expansion-panel:not([class*=mat-elevation-z]){box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:var(--mat-expansion-container-shape);border-top-left-radius:var(--mat-expansion-container-shape)}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:var(--mat-expansion-container-shape);border-bottom-left-radius:var(--mat-expansion-container-shape)}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible;font-family:var(--mat-expansion-container-text-font);font-size:var(--mat-expansion-container-text-size);font-weight:var(--mat-expansion-container-text-weight);line-height:var(--mat-expansion-container-text-line-height);letter-spacing:var(--mat-expansion-container-text-tracking)}.mat-expansion-panel-content[style*=\"visibility: hidden\"] *{visibility:hidden !important}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px;border-top-color:var(--mat-expansion-actions-divider-color)}.mat-action-row .mat-button-base,.mat-action-row .mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row .mat-button-base,[dir=rtl] .mat-action-row .mat-mdc-button-base{margin-left:0;margin-right:8px}"] }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }, {
                    type: Inject,
                    args: [MAT_ACCORDION]
                }] }, { type: i0.ChangeDetectorRef }, { type: i1.UniqueSelectionDispatcher }, { type: i0.ViewContainerRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS]
                }, {
                    type: Optional
                }] }], propDecorators: { hideToggle: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], togglePosition: [{
                type: Input
            }], afterExpand: [{
                type: Output
            }], afterCollapse: [{
                type: Output
            }], _lazyContent: [{
                type: ContentChild,
                args: [MatExpansionPanelContent]
            }], _body: [{
                type: ViewChild,
                args: ['body']
            }] } });
/**
 * Actions of a `<mat-expansion-panel>`.
 */
export class MatExpansionPanelActionRow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatExpansionPanelActionRow, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.5", type: MatExpansionPanelActionRow, isStandalone: true, selector: "mat-action-row", host: { classAttribute: "mat-action-row" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.5", ngImport: i0, type: MatExpansionPanelActionRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-action-row',
                    host: {
                        class: 'mat-action-row',
                    },
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9leHBhbnNpb24tcGFuZWwudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1wYW5lbC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBR0wsUUFBUSxFQUNSLE1BQU0sRUFFTixRQUFRLEVBQ1IsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0UsT0FBTyxFQUErQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM3RixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFB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QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q2RrQWNjb3JkaW9uSXRlbX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge1VuaXF1ZVNlbGVjdGlvbkRpc3BhdGNoZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge0Nka1BvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFNraXBTZWxmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBib29sZWFuQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciwgc3RhcnRXaXRoLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge01hdEFjY29yZGlvbkJhc2UsIE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uLCBNQVRfQUNDT1JESU9OfSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcbmltcG9ydCB7bWF0RXhwYW5zaW9uQW5pbWF0aW9uc30gZnJvbSAnLi9leHBhbnNpb24tYW5pbWF0aW9ucyc7XG5pbXBvcnQge01BVF9FWFBBTlNJT05fUEFORUx9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWJhc2UnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbENvbnRlbnR9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQnO1xuXG4vKiogTWF0RXhwYW5zaW9uUGFuZWwncyBzdGF0ZXMuICovXG5leHBvcnQgdHlwZSBNYXRFeHBhbnNpb25QYW5lbFN0YXRlID0gJ2V4cGFuZGVkJyB8ICdjb2xsYXBzZWQnO1xuXG4vKiogQ291bnRlciBmb3IgZ2VuZXJhdGluZyB1bmlxdWUgZWxlbWVudCBpZHMuICovXG5sZXQgdW5pcXVlSWQgPSAwO1xuXG4vKipcbiAqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnNcbiAqIGZvciBhbGwgb2YgdGhlIGV4cGFuc2lvbiBwYW5lbHMgaW4gYSBtb2R1bGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0RXhwYW5zaW9uUGFuZWxEZWZhdWx0T3B0aW9ucyB7XG4gIC8qKiBIZWlnaHQgb2YgdGhlIGhlYWRlciB3aGlsZSB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIGV4cGFuZGVkSGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgaGVhZGVyIHdoaWxlIHRoZSBwYW5lbCBpcyBjb2xsYXBzZWQuICovXG4gIGNvbGxhcHNlZEhlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIGhpZGVUb2dnbGU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29uZmlndXJlIHRoZSBkZWZhdWx0XG4gKiBvcHRpb25zIGZvciB0aGUgZXhwYW5zaW9uIHBhbmVsIGNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9FWFBBTlNJT05fUEFORUxfREVGQVVMVF9PUFRJT05TID1cbiAgbmV3IEluamVjdGlvblRva2VuPE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnM+KCdNQVRfRVhQQU5TSU9OX1BBTkVMX0RFRkFVTFRfT1BUSU9OUycpO1xuXG4vKipcbiAqIFRoaXMgY29tcG9uZW50IGNhbiBiZSB1c2VkIGFzIGEgc2luZ2xlIGVsZW1lbnQgdG8gc2hvdyBleHBhbmRhYmxlIGNvbnRlbnQsIG9yIGFzIG9uZSBvZlxuICogbXVsdGlwbGUgY2hpbGRyZW4gb2YgYW4gZWxlbWVudCB3aXRoIHRoZSBNYXRBY2NvcmRpb24gZGlyZWN0aXZlIGF0dGFjaGVkLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc3R5bGVVcmxzOiBbJ2V4cGFuc2lvbi1wYW5lbC5jc3MnXSxcbiAgc2VsZWN0b3I6ICdtYXQtZXhwYW5zaW9uLXBhbmVsJyxcbiAgZXhwb3J0QXM6ICdtYXRFeHBhbnNpb25QYW5lbCcsXG4gIHRlbXBsYXRlVXJsOiAnZXhwYW5zaW9uLXBhbmVsLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgYW5pbWF0aW9uczogW21hdEV4cGFuc2lvbkFuaW1hdGlvbnMuYm9keUV4cGFuc2lvbl0sXG4gIHByb3ZpZGVyczogW1xuICAgIC8vIFByb3ZpZGUgTWF0QWNjb3JkaW9uIGFzIHVuZGVmaW5lZCB0byBwcmV2ZW50IG5lc3RlZCBleHBhbnNpb24gcGFuZWxzIGZyb20gcmVnaXN0ZXJpbmdcbiAgICAvLyB0byB0aGUgc2FtZSBhY2NvcmRpb24uXG4gICAge3Byb3ZpZGU6IE1BVF9BQ0NPUkRJT04sIHVzZVZhbHVlOiB1bmRlZmluZWR9LFxuICAgIHtwcm92aWRlOiBNQVRfRVhQQU5TSU9OX1BBTkVMLCB1c2VFeGlzdGluZzogTWF0RXhwYW5zaW9uUGFuZWx9LFxuICBdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1leHBhbnNpb24tcGFuZWwnLFxuICAgICdbY2xhc3MubWF0LWV4cGFuZGVkXSc6ICdleHBhbmRlZCcsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX2FuaW1hdGlvbk1vZGUgPT09IFwiTm9vcEFuaW1hdGlvbnNcIicsXG4gICAgJ1tjbGFzcy5tYXQtZXhwYW5zaW9uLXBhbmVsLXNwYWNpbmddJzogJ19oYXNTcGFjaW5nKCknLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ2RrUG9ydGFsT3V0bGV0XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0RXhwYW5zaW9uUGFuZWxcbiAgZXh0ZW5kcyBDZGtBY2NvcmRpb25JdGVtXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0b2dnbGUgaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGhpZGVUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVUb2dnbGUgfHwgKHRoaXMuYWNjb3JkaW9uICYmIHRoaXMuYWNjb3JkaW9uLmhpZGVUb2dnbGUpO1xuICB9XG4gIHNldCBoaWRlVG9nZ2xlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZVRvZ2dsZSA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2hpZGVUb2dnbGUgPSBmYWxzZTtcblxuICAvKiogVGhlIHBvc2l0aW9uIG9mIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yLiAqL1xuICBASW5wdXQoKVxuICBnZXQgdG9nZ2xlUG9zaXRpb24oKTogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24ge1xuICAgIHJldHVybiB0aGlzLl90b2dnbGVQb3NpdGlvbiB8fCAodGhpcy5hY2NvcmRpb24gJiYgdGhpcy5hY2NvcmRpb24udG9nZ2xlUG9zaXRpb24pO1xuICB9XG4gIHNldCB0b2dnbGVQb3NpdGlvbih2YWx1ZTogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24pIHtcbiAgICB0aGlzLl90b2dnbGVQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX3RvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbjtcblxuICAvKiogQW4gZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYm9keSdzIGV4cGFuc2lvbiBhbmltYXRpb24gaGFwcGVucy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFmdGVyRXhwYW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBBbiBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBib2R5J3MgY29sbGFwc2UgYW5pbWF0aW9uIGhhcHBlbnMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBhZnRlckNvbGxhcHNlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyBmb3IgY2hhbmdlcyBpbiBgQElucHV0YCBwcm9wZXJ0aWVzLiAqL1xuICByZWFkb25seSBfaW5wdXRDaGFuZ2VzID0gbmV3IFN1YmplY3Q8U2ltcGxlQ2hhbmdlcz4oKTtcblxuICAvKiogT3B0aW9uYWxseSBkZWZpbmVkIGFjY29yZGlvbiB0aGUgZXhwYW5zaW9uIHBhbmVsIGJlbG9uZ3MgdG8uICovXG4gIG92ZXJyaWRlIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZTtcblxuICAvKiogQ29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5LiAqL1xuICBAQ29udGVudENoaWxkKE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCkgX2xhenlDb250ZW50OiBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQ7XG5cbiAgLyoqIEVsZW1lbnQgY29udGFpbmluZyB0aGUgcGFuZWwncyB1c2VyLXByb3ZpZGVkIGNvbnRlbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2JvZHknKSBfYm9keTogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLyoqIFBvcnRhbCBob2xkaW5nIHRoZSB1c2VyJ3MgY29udGVudC4gKi9cbiAgX3BvcnRhbDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgLyoqIElEIGZvciB0aGUgYXNzb2NpYXRlZCBoZWFkZXIgZWxlbWVudC4gVXNlZCBmb3IgYTExeSBsYWJlbGxpbmcuICovXG4gIF9oZWFkZXJJZCA9IGBtYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci0ke3VuaXF1ZUlkKyt9YDtcblxuICAvKiogU3RyZWFtIG9mIGJvZHkgYW5pbWF0aW9uIGRvbmUgZXZlbnRzLiAqL1xuICByZWFkb25seSBfYm9keUFuaW1hdGlvbkRvbmUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBAU2tpcFNlbGYoKSBASW5qZWN0KE1BVF9BQ0NPUkRJT04pIGFjY29yZGlvbjogTWF0QWNjb3JkaW9uQmFzZSxcbiAgICBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIF91bmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyOiBVbmlxdWVTZWxlY3Rpb25EaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZTogc3RyaW5nLFxuICAgIEBJbmplY3QoTUFUX0VYUEFOU0lPTl9QQU5FTF9ERUZBVUxUX09QVElPTlMpXG4gICAgQE9wdGlvbmFsKClcbiAgICBkZWZhdWx0T3B0aW9ucz86IE1hdEV4cGFuc2lvblBhbmVsRGVmYXVsdE9wdGlvbnMsXG4gICkge1xuICAgIHN1cGVyKGFjY29yZGlvbiwgX2NoYW5nZURldGVjdG9yUmVmLCBfdW5pcXVlU2VsZWN0aW9uRGlzcGF0Y2hlcik7XG4gICAgdGhpcy5hY2NvcmRpb24gPSBhY2NvcmRpb247XG4gICAgdGhpcy5fZG9jdW1lbnQgPSBfZG9jdW1lbnQ7XG5cbiAgICAvLyBXZSBuZWVkIGEgU3ViamVjdCB3aXRoIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBiZWNhdXNlIHRoZSBgZG9uZWAgZXZlbnRcbiAgICAvLyBmaXJlcyB0d2ljZSBvbiBzb21lIGJyb3dzZXJzLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjQwODRcbiAgICB0aGlzLl9ib2R5QW5pbWF0aW9uRG9uZVxuICAgICAgLnBpcGUoXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHguZnJvbVN0YXRlID09PSB5LmZyb21TdGF0ZSAmJiB4LnRvU3RhdGUgPT09IHkudG9TdGF0ZTtcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmZyb21TdGF0ZSAhPT0gJ3ZvaWQnKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LnRvU3RhdGUgPT09ICdleHBhbmRlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJFeHBhbmQuZW1pdCgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ2NvbGxhcHNlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJDb2xsYXBzZS5lbWl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIGlmIChkZWZhdWx0T3B0aW9ucykge1xuICAgICAgdGhpcy5oaWRlVG9nZ2xlID0gZGVmYXVsdE9wdGlvbnMuaGlkZVRvZ2dsZTtcbiAgICB9XG4gIH1cblxuICAvKiogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBleHBhbnNpb24gcGFuZWwgc2hvdWxkIGhhdmUgc3BhY2luZyBiZXR3ZWVuIGl0IGFuZCBpdHMgc2libGluZ3MuICovXG4gIF9oYXNTcGFjaW5nKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmFjY29yZGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgJiYgdGhpcy5hY2NvcmRpb24uZGlzcGxheU1vZGUgPT09ICdkZWZhdWx0JztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGV4cGFuZGVkIHN0YXRlIHN0cmluZy4gKi9cbiAgX2dldEV4cGFuZGVkU3RhdGUoKTogTWF0RXhwYW5zaW9uUGFuZWxTdGF0ZSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kZWQgPyAnZXhwYW5kZWQnIDogJ2NvbGxhcHNlZCc7XG4gIH1cblxuICAvKiogVG9nZ2xlcyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIGV4cGFuc2lvbiBwYW5lbC4gKi9cbiAgb3ZlcnJpZGUgdG9nZ2xlKCk6IHZvaWQge1xuICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgZXhwYW5zaW9uIHBhbmVsIHRvIGZhbHNlLiAqL1xuICBvdmVycmlkZSBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmV4cGFuZGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIGV4cGFuc2lvbiBwYW5lbCB0byB0cnVlLiAqL1xuICBvdmVycmlkZSBvcGVuKCk6IHZvaWQge1xuICAgIHRoaXMuZXhwYW5kZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICh0aGlzLl9sYXp5Q29udGVudCAmJiB0aGlzLl9sYXp5Q29udGVudC5fZXhwYW5zaW9uUGFuZWwgPT09IHRoaXMpIHtcbiAgICAgIC8vIFJlbmRlciB0aGUgY29udGVudCBhcyBzb29uIGFzIHRoZSBwYW5lbCBiZWNvbWVzIG9wZW4uXG4gICAgICB0aGlzLm9wZW5lZFxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzdGFydFdpdGgobnVsbCksXG4gICAgICAgICAgZmlsdGVyKCgpID0+IHRoaXMuZXhwYW5kZWQgJiYgIXRoaXMuX3BvcnRhbCksXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5fbGF6eUNvbnRlbnQuX3RlbXBsYXRlLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIHRoaXMuX2lucHV0Q2hhbmdlcy5uZXh0KGNoYW5nZXMpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9ib2R5QW5pbWF0aW9uRG9uZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2lucHV0Q2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBleHBhbnNpb24gcGFuZWwncyBjb250ZW50IGNvbnRhaW5zIHRoZSBjdXJyZW50bHktZm9jdXNlZCBlbGVtZW50LiAqL1xuICBfY29udGFpbnNGb2N1cygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fYm9keSkge1xuICAgICAgY29uc3QgZm9jdXNlZEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgY29uc3QgYm9keUVsZW1lbnQgPSB0aGlzLl9ib2R5Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICByZXR1cm4gZm9jdXNlZEVsZW1lbnQgPT09IGJvZHlFbGVtZW50IHx8IGJvZHlFbGVtZW50LmNvbnRhaW5zKGZvY3VzZWRFbGVtZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBBY3Rpb25zIG9mIGEgYDxtYXQtZXhwYW5zaW9uLXBhbmVsPmAuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY3Rpb24tcm93JyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWFjdGlvbi1yb3cnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEFjdGlvblJvdyB7fVxuIiwiPG5nLWNvbnRlbnQgc2VsZWN0PVwibWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXJcIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwibWF0LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50XCJcbiAgICAgcm9sZT1cInJlZ2lvblwiXG4gICAgIFtAYm9keUV4cGFuc2lvbl09XCJfZ2V0RXhwYW5kZWRTdGF0ZSgpXCJcbiAgICAgKEBib2R5RXhwYW5zaW9uLmRvbmUpPVwiX2JvZHlBbmltYXRpb25Eb25lLm5leHQoJGV2ZW50KVwiXG4gICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfaGVhZGVySWRcIlxuICAgICBbaWRdPVwiaWRcIlxuICAgICAjYm9keT5cbiAgPGRpdiBjbGFzcz1cIm1hdC1leHBhbnNpb24tcGFuZWwtYm9keVwiPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8bmctdGVtcGxhdGUgW2Nka1BvcnRhbE91dGxldF09XCJfcG9ydGFsXCI+PC9uZy10ZW1wbGF0ZT5cbiAgPC9kaXY+XG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIm1hdC1hY3Rpb24tcm93XCI+PC9uZy1jb250ZW50PlxuPC9kaXY+XG4iXX0=