/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectorRef, Input, Inject, Output, EventEmitter, ElementRef, Directive, Optional, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, forwardRef, ViewChild, } from '@angular/core';
import { TemplatePortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { matTabsAnimations } from './tabs-animations';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
export class MatTabBodyPortal extends CdkPortalOutlet {
    constructor(componentFactoryResolver, viewContainerRef, _host, _document) {
        super(componentFactoryResolver, viewContainerRef, _document);
        this._host = _host;
        /** Subscription to events for when the tab body begins centering. */
        this._centeringSub = Subscription.EMPTY;
        /** Subscription to events for when the tab body finishes leaving from center position. */
        this._leavingSub = Subscription.EMPTY;
    }
    /** Set initial visibility or set up subscription for changing visibility. */
    ngOnInit() {
        super.ngOnInit();
        this._centeringSub = this._host._beforeCentering
            .pipe(startWith(this._host._isCenterPosition(this._host._position)))
            .subscribe((isCentering) => {
            if (isCentering && !this.hasAttached()) {
                this.attach(this._host._content);
            }
        });
        this._leavingSub = this._host._afterLeavingCenter.subscribe(() => {
            this.detach();
        });
    }
    /** Clean up centering subscription. */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._centeringSub.unsubscribe();
        this._leavingSub.unsubscribe();
    }
}
MatTabBodyPortal.decorators = [
    { type: Directive, args: [{
                selector: '[matTabBodyHost]'
            },] }
];
MatTabBodyPortal.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: MatTabBody, decorators: [{ type: Inject, args: [forwardRef(() => MatTabBody),] }] },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
/**
 * Base class with all of the `MatTabBody` functionality.
 * @docs-private
 */
export class _MatTabBodyBase {
    constructor(_elementRef, _dir, changeDetectorRef) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /** Subscription to the directionality change observable. */
        this._dirChangeSubscription = Subscription.EMPTY;
        /** Emits when an animation on the tab is complete. */
        this._translateTabComplete = new Subject();
        /** Event emitted when the tab begins to animate towards the center as the active tab. */
        this._onCentering = new EventEmitter();
        /** Event emitted before the centering of the tab begins. */
        this._beforeCentering = new EventEmitter();
        /** Event emitted before the centering of the tab begins. */
        this._afterLeavingCenter = new EventEmitter();
        /** Event emitted when the tab completes its animation towards the center. */
        this._onCentered = new EventEmitter(true);
        // Note that the default value will always be overwritten by `MatTabBody`, but we need one
        // anyway to prevent the animations module from throwing an error if the body is used on its own.
        /** Duration for the tab's animation. */
        this.animationDuration = '500ms';
        if (_dir) {
            this._dirChangeSubscription = _dir.change.subscribe((dir) => {
                this._computePositionAnimationState(dir);
                changeDetectorRef.markForCheck();
            });
        }
        // Ensure that we get unique animation events, because the `.done` callback can get
        // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
        this._translateTabComplete.pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(event => {
            // If the transition to the center is complete, emit an event.
            if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
                this._onCentered.emit();
            }
            if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
                this._afterLeavingCenter.emit();
            }
        });
    }
    /** The shifted index position of the tab body, where zero represents the active center tab. */
    set position(position) {
        this._positionIndex = position;
        this._computePositionAnimationState();
    }
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     */
    ngOnInit() {
        if (this._position == 'center' && this.origin != null) {
            this._position = this._computePositionFromOrigin(this.origin);
        }
    }
    ngOnDestroy() {
        this._dirChangeSubscription.unsubscribe();
        this._translateTabComplete.complete();
    }
    _onTranslateTabStarted(event) {
        const isCentering = this._isCenterPosition(event.toState);
        this._beforeCentering.emit(isCentering);
        if (isCentering) {
            this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    }
    /** The text direction of the containing app. */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Whether the provided position state is considered center, regardless of origin. */
    _isCenterPosition(position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    }
    /** Computes the position state that will be used for the tab-body animation trigger. */
    _computePositionAnimationState(dir = this._getLayoutDirection()) {
        if (this._positionIndex < 0) {
            this._position = dir == 'ltr' ? 'left' : 'right';
        }
        else if (this._positionIndex > 0) {
            this._position = dir == 'ltr' ? 'right' : 'left';
        }
        else {
            this._position = 'center';
        }
    }
    /**
     * Computes the position state based on the specified origin position. This is used if the
     * tab is becoming visible immediately after creation.
     */
    _computePositionFromOrigin(origin) {
        const dir = this._getLayoutDirection();
        if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
            return 'left-origin-center';
        }
        return 'right-origin-center';
    }
}
_MatTabBodyBase.decorators = [
    { type: Directive }
];
_MatTabBodyBase.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef }
];
_MatTabBodyBase.propDecorators = {
    _onCentering: [{ type: Output }],
    _beforeCentering: [{ type: Output }],
    _afterLeavingCenter: [{ type: Output }],
    _onCentered: [{ type: Output }],
    _content: [{ type: Input, args: ['content',] }],
    origin: [{ type: Input }],
    animationDuration: [{ type: Input }],
    position: [{ type: Input }]
};
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
export class MatTabBody extends _MatTabBodyBase {
    constructor(elementRef, dir, changeDetectorRef) {
        super(elementRef, dir, changeDetectorRef);
    }
}
MatTabBody.decorators = [
    { type: Component, args: [{
                selector: 'mat-tab-body',
                template: "<div class=\"mat-tab-body-content\" #content\n     [@translateTab]=\"{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }\"\n     (@translateTab.start)=\"_onTranslateTabStarted($event)\"\n     (@translateTab.done)=\"_translateTabComplete.next($event)\"\n     cdkScrollable>\n  <ng-template matTabBodyHost></ng-template>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                animations: [matTabsAnimations.translateTab],
                host: {
                    'class': 'mat-tab-body',
                },
                styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}\n"]
            },] }
];
MatTabBody.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef }
];
MatTabBody.propDecorators = {
    _portalHost: [{ type: ViewChild, args: [CdkPortalOutlet,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWJvZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBR1osVUFBVSxFQUNWLFNBQVMsRUFDVCxRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDVixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsY0FBYyxFQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQXVCL0Q7OztHQUdHO0FBSUgsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGVBQWU7SUFNbkQsWUFDRSx3QkFBa0QsRUFDbEQsZ0JBQWtDLEVBQ1ksS0FBaUIsRUFDN0MsU0FBYztRQUNoQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFGZixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBUmpFLHFFQUFxRTtRQUM3RCxrQkFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDM0MsMEZBQTBGO1FBQ2xGLGdCQUFXLEdBQUcsWUFBWSxD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SUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDakUsT0FBTyxvQkFBb0IsQ0FBQztTQUM3QjtRQUVELE9BQU8scUJBQXFCLENBQUM7SUFDL0IsQ0FBQzs7O1lBcElGLFNBQVM7OztZQXpGUixVQUFVO1lBWUosY0FBYyx1QkE2SFAsUUFBUTtZQWhKckIsaUJBQWlCOzs7MkJBK0doQixNQUFNOytCQUdOLE1BQU07a0NBR04sTUFBTTswQkFHTixNQUFNO3VCQU1OLEtBQUssU0FBQyxTQUFTO3FCQUdmLEtBQUs7Z0NBS0wsS0FBSzt1QkFHTCxLQUFLOztBQThGUjs7O0dBR0c7QUFhSCxNQUFNLE9BQU8sVUFBVyxTQUFRLGVBQWU7SUFHN0MsWUFBWSxVQUFtQyxFQUN2QixHQUFtQixFQUMvQixpQkFBb0M7UUFDOUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7WUFuQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4Qiw2WEFBNEI7Z0JBRTVCLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQywrQ0FBK0M7Z0JBQy9DLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUM7Z0JBQzVDLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsY0FBYztpQkFDeEI7O2FBQ0Y7OztZQS9PQyxVQUFVO1lBWUosY0FBYyx1QkF3T1AsUUFBUTtZQTNQckIsaUJBQWlCOzs7MEJBd1BoQixTQUFTLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJbnB1dCxcbiAgSW5qZWN0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBmb3J3YXJkUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsLCBDZGtQb3J0YWxPdXRsZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eSwgRGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb24sIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXRUYWJzQW5pbWF0aW9uc30gZnJvbSAnLi90YWJzLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogVGhlc2UgcG9zaXRpb24gc3RhdGVzIGFyZSB1c2VkIGludGVybmFsbHkgYXMgYW5pbWF0aW9uIHN0YXRlcyBmb3IgdGhlIHRhYiBib2R5LiBTZXR0aW5nIHRoZVxuICogcG9zaXRpb24gc3RhdGUgdG8gbGVmdCwgcmlnaHQsIG9yIGNlbnRlciB3aWxsIHRyYW5zaXRpb24gdGhlIHRhYiBib2R5IGZyb20gaXRzIGN1cnJlbnRcbiAqIHBvc2l0aW9uIHRvIGl0cyByZXNwZWN0aXZlIHN0YXRlLiBJZiB0aGVyZSBpcyBub3QgY3VycmVudCBwb3NpdGlvbiAodm9pZCwgaW4gdGhlIGNhc2Ugb2YgYSBuZXdcbiAqIHRhYiBib2R5KSwgdGhlbiB0aGVyZSB3aWxsIGJlIG5vIHRyYW5zaXRpb24gYW5pbWF0aW9uIHRvIGl0cyBzdGF0ZS5cbiAqXG4gKiBJbiB0aGUgY2FzZSBvZiBhIG5ldyB0YWIgYm9keSB0aGF0IHNob3VsZCBpbW1lZGlhdGVseSBiZSBjZW50ZXJlZCB3aXRoIGFuIGFuaW1hdGluZyB0cmFuc2l0aW9uLFxuICogdGhlbiBsZWZ0LW9yaWdpbi1jZW50ZXIgb3IgcmlnaHQtb3JpZ2luLWNlbnRlciBjYW4gYmUgdXNlZCwgd2hpY2ggd2lsbCB1c2UgbGVmdCBvciByaWdodCBhcyBpdHNcbiAqIHBzdWVkby1wcmlvciBzdGF0ZS5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0VGFiQm9keVBvc2l0aW9uU3RhdGUgPVxuICAgICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JyB8ICdsZWZ0LW9yaWdpbi1jZW50ZXInIHwgJ3JpZ2h0LW9yaWdpbi1jZW50ZXInO1xuXG4vKipcbiAqIFRoZSBvcmlnaW4gc3RhdGUgaXMgYW4gaW50ZXJuYWxseSB1c2VkIHN0YXRlIHRoYXQgaXMgc2V0IG9uIGEgbmV3IHRhYiBib2R5IGluZGljYXRpbmcgaWYgaXRcbiAqIGJlZ2FuIHRvIHRoZSBsZWZ0IG9yIHJpZ2h0IG9mIHRoZSBwcmlvciBzZWxlY3RlZCBpbmRleC4gRm9yIGV4YW1wbGUsIGlmIHRoZSBzZWxlY3RlZCBpbmRleCB3YXNcbiAqIHNldCB0byAxLCBhbmQgYSBuZXcgdGFiIGlzIGNyZWF0ZWQgYW5kIHNlbGVjdGVkIGF0IGluZGV4IDIsIHRoZW4gdGhlIHRhYiBib2R5IHdvdWxkIGhhdmUgYW5cbiAqIG9yaWdpbiBvZiByaWdodCBiZWNhdXNlIGl0cyBpbmRleCB3YXMgZ3JlYXRlciB0aGFuIHRoZSBwcmlvciBzZWxlY3RlZCBpbmRleC5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0VGFiQm9keU9yaWdpblN0YXRlID0gJ2xlZnQnIHwgJ3JpZ2h0JztcblxuLyoqXG4gKiBUaGUgcG9ydGFsIGhvc3QgZGlyZWN0aXZlIGZvciB0aGUgY29udGVudHMgb2YgdGhlIHRhYi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRhYkJvZHlIb3N0XSdcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiQm9keVBvcnRhbCBleHRlbmRzIENka1BvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGJlZ2lucyBjZW50ZXJpbmcuICovXG4gIHByaXZhdGUgX2NlbnRlcmluZ1N1YiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGZpbmlzaGVzIGxlYXZpbmcgZnJvbSBjZW50ZXIgcG9zaXRpb24uICovXG4gIHByaXZhdGUgX2xlYXZpbmdTdWIgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0VGFiQm9keSkpIHByaXZhdGUgX2hvc3Q6IE1hdFRhYkJvZHksXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50OiBhbnkpIHtcbiAgICBzdXBlcihjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHZpZXdDb250YWluZXJSZWYsIF9kb2N1bWVudCk7XG4gIH1cblxuICAvKiogU2V0IGluaXRpYWwgdmlzaWJpbGl0eSBvciBzZXQgdXAgc3Vic2NyaXB0aW9uIGZvciBjaGFuZ2luZyB2aXNpYmlsaXR5LiAqL1xuICBvdmVycmlkZSBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgdGhpcy5fY2VudGVyaW5nU3ViID0gdGhpcy5faG9zdC5fYmVmb3JlQ2VudGVyaW5nXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5faG9zdC5faXNDZW50ZXJQb3NpdGlvbih0aGlzLl9ob3N0Ll9wb3NpdGlvbikpKVxuICAgICAgLnN1YnNjcmliZSgoaXNDZW50ZXJpbmc6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgaWYgKGlzQ2VudGVyaW5nICYmICF0aGlzLmhhc0F0dGFjaGVkKCkpIHtcbiAgICAgICAgICB0aGlzLmF0dGFjaCh0aGlzLl9ob3N0Ll9jb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aGlzLl9sZWF2aW5nU3ViID0gdGhpcy5faG9zdC5fYWZ0ZXJMZWF2aW5nQ2VudGVyLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmRldGFjaCgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENsZWFuIHVwIGNlbnRlcmluZyBzdWJzY3JpcHRpb24uICovXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fY2VudGVyaW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fbGVhdmluZ1N1Yi51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkJvZHlgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJCb2R5QmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHRhYi1ib2R5IGluIHRoZSB0YWItZ3JvdXAuIFplcm8gbWVhbnMgdGhhdCB0aGUgdGFiIGlzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uSW5kZXg6IG51bWJlcjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRoZSBkaXJlY3Rpb25hbGl0eSBjaGFuZ2Ugb2JzZXJ2YWJsZS4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUYWIgYm9keSBwb3NpdGlvbiBzdGF0ZS4gVXNlZCBieSB0aGUgYW5pbWF0aW9uIHRyaWdnZXIgZm9yIHRoZSBjdXJyZW50IHN0YXRlLiAqL1xuICBfcG9zaXRpb246IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgdGFiIGlzIGNvbXBsZXRlLiAqL1xuICByZWFkb25seSBfdHJhbnNsYXRlVGFiQ29tcGxldGUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0YWIgYmVnaW5zIHRvIGFuaW1hdGUgdG93YXJkcyB0aGUgY2VudGVyIGFzIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX29uQ2VudGVyaW5nOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGJlZm9yZSB0aGUgY2VudGVyaW5nIG9mIHRoZSB0YWIgYmVnaW5zLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX2JlZm9yZUNlbnRlcmluZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGJlZm9yZSB0aGUgY2VudGVyaW5nIG9mIHRoZSB0YWIgYmVnaW5zLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX2FmdGVyTGVhdmluZ0NlbnRlcjogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRhYiBjb21wbGV0ZXMgaXRzIGFuaW1hdGlvbiB0b3dhcmRzIHRoZSBjZW50ZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfb25DZW50ZXJlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPih0cnVlKTtcblxuICAgLyoqIFRoZSBwb3J0YWwgaG9zdCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgdGFiIGJvZHkgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgYWJzdHJhY3QgX3BvcnRhbEhvc3Q6IENka1BvcnRhbE91dGxldDtcblxuICAvKiogVGhlIHRhYiBib2R5IGNvbnRlbnQgdG8gZGlzcGxheS4gKi9cbiAgQElucHV0KCdjb250ZW50JykgX2NvbnRlbnQ6IFRlbXBsYXRlUG9ydGFsO1xuXG4gIC8qKiBQb3NpdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB3aGVuIHRoZSB0YWIgaXMgaW1tZWRpYXRlbHkgYmVjb21pbmcgdmlzaWJsZSBhZnRlciBjcmVhdGlvbi4gKi9cbiAgQElucHV0KCkgb3JpZ2luOiBudW1iZXIgfCBudWxsO1xuXG4gIC8vIE5vdGUgdGhhdCB0aGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBvdmVyd3JpdHRlbiBieSBgTWF0VGFiQm9keWAsIGJ1dCB3ZSBuZWVkIG9uZVxuICAvLyBhbnl3YXkgdG8gcHJldmVudCB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgZnJvbSB0aHJvd2luZyBhbiBlcnJvciBpZiB0aGUgYm9keSBpcyB1c2VkIG9uIGl0cyBvd24uXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYidzIGFuaW1hdGlvbi4gKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZyA9ICc1MDBtcyc7XG5cbiAgLyoqIFRoZSBzaGlmdGVkIGluZGV4IHBvc2l0aW9uIG9mIHRoZSB0YWIgYm9keSwgd2hlcmUgemVybyByZXByZXNlbnRzIHRoZSBhY3RpdmUgY2VudGVyIHRhYi4gKi9cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4ID0gcG9zaXRpb247XG4gICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIGlmIChfZGlyKSB7XG4gICAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBfZGlyLmNoYW5nZS5zdWJzY3JpYmUoKGRpcjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKGRpcik7XG4gICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgZ2V0IHVuaXF1ZSBhbmltYXRpb24gZXZlbnRzLCBiZWNhdXNlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGNhbiBnZXRcbiAgICAvLyBpbnZva2VkIHR3aWNlIGluIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NC5cbiAgICB0aGlzLl90cmFuc2xhdGVUYWJDb21wbGV0ZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRyYW5zaXRpb24gdG8gdGhlIGNlbnRlciBpcyBjb21wbGV0ZSwgZW1pdCBhbiBldmVudC5cbiAgICAgIGlmICh0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LnRvU3RhdGUpICYmIHRoaXMuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5fcG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuX29uQ2VudGVyZWQuZW1pdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC5mcm9tU3RhdGUpICYmICF0aGlzLl9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uKSkge1xuICAgICAgICB0aGlzLl9hZnRlckxlYXZpbmdDZW50ZXIuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIGluaXRpYWxpemVkLCBjaGVjayBpZiB0aGUgY29udGVudCBpcyBjZW50ZXJlZCBhbmQgaGFzIGFuIG9yaWdpbi4gSWYgc28sIHNldCB0aGVcbiAgICogc3BlY2lhbCBwb3NpdGlvbiBzdGF0ZXMgdGhhdCB0cmFuc2l0aW9uIHRoZSB0YWIgZnJvbSB0aGUgbGVmdCBvciByaWdodCBiZWZvcmUgY2VudGVyaW5nLlxuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uID09ICdjZW50ZXInICYmIHRoaXMub3JpZ2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5fY29tcHV0ZVBvc2l0aW9uRnJvbU9yaWdpbih0aGlzLm9yaWdpbik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fdHJhbnNsYXRlVGFiQ29tcGxldGUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9vblRyYW5zbGF0ZVRhYlN0YXJ0ZWQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaXNDZW50ZXJpbmcgPSB0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LnRvU3RhdGUpO1xuICAgIHRoaXMuX2JlZm9yZUNlbnRlcmluZy5lbWl0KGlzQ2VudGVyaW5nKTtcbiAgICBpZiAoaXNDZW50ZXJpbmcpIHtcbiAgICAgIHRoaXMuX29uQ2VudGVyaW5nLmVtaXQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB0ZXh0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIF9nZXRMYXlvdXREaXJlY3Rpb24oKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHByb3ZpZGVkIHBvc2l0aW9uIHN0YXRlIGlzIGNvbnNpZGVyZWQgY2VudGVyLCByZWdhcmRsZXNzIG9mIG9yaWdpbi4gKi9cbiAgX2lzQ2VudGVyUG9zaXRpb24ocG9zaXRpb246IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlfHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwb3NpdGlvbiA9PSAnY2VudGVyJyB8fFxuICAgICAgICBwb3NpdGlvbiA9PSAnbGVmdC1vcmlnaW4tY2VudGVyJyB8fFxuICAgICAgICBwb3NpdGlvbiA9PSAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG4gIH1cblxuICAvKiogQ29tcHV0ZXMgdGhlIHBvc2l0aW9uIHN0YXRlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdGFiLWJvZHkgYW5pbWF0aW9uIHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKGRpcjogRGlyZWN0aW9uID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpIHtcbiAgICBpZiAodGhpcy5fcG9zaXRpb25JbmRleCA8IDApIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gZGlyID09ICdsdHInID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Bvc2l0aW9uSW5kZXggPiAwKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IGRpciA9PSAnbHRyJyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gJ2NlbnRlcic7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBwb3NpdGlvbiBzdGF0ZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIG9yaWdpbiBwb3NpdGlvbi4gVGhpcyBpcyB1c2VkIGlmIHRoZVxuICAgKiB0YWIgaXMgYmVjb21pbmcgdmlzaWJsZSBpbW1lZGlhdGVseSBhZnRlciBjcmVhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX2NvbXB1dGVQb3NpdGlvbkZyb21PcmlnaW4ob3JpZ2luOiBudW1iZXIpOiBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZSB7XG4gICAgY29uc3QgZGlyID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCk7XG5cbiAgICBpZiAoKGRpciA9PSAnbHRyJyAmJiBvcmlnaW4gPD0gMCkgfHwgKGRpciA9PSAncnRsJyAmJiBvcmlnaW4gPiAwKSkge1xuICAgICAgcmV0dXJuICdsZWZ0LW9yaWdpbi1jZW50ZXInO1xuICAgIH1cblxuICAgIHJldHVybiAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgY29udGVudHMgb2YgYSB0YWIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItYm9keScsXG4gIHRlbXBsYXRlVXJsOiAndGFiLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItYm9keS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0VGFic0FuaW1hdGlvbnMudHJhbnNsYXRlVGFiXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWJvZHknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkJvZHkgZXh0ZW5kcyBfTWF0VGFiQm9keUJhc2Uge1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCkgX3BvcnRhbEhvc3Q6IENka1BvcnRhbE91dGxldDtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgZGlyLCBjaGFuZ2VEZXRlY3RvclJlZik7XG4gIH1cbn1cbiJdfQ==