/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ChangeDetectorRef, Input, Inject, Output, EventEmitter, ElementRef, Directive, Optional, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, forwardRef, ViewChild, } from '@angular/core';
import { TemplatePortal, CdkPortalOutlet, PortalHostDirective } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { Subscription, Subject } from 'rxjs';
import { matTabsAnimations } from './tabs-animations';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
/**
 * The portal host directive for the contents of the tab.
 * \@docs-private
 */
export class MatTabBodyPortal extends CdkPortalOutlet {
    /**
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} _host
     */
    constructor(componentFactoryResolver, viewContainerRef, _host) {
        super(componentFactoryResolver, viewContainerRef);
        this._host = _host;
        /**
         * Subscription to events for when the tab body begins centering.
         */
        this._centeringSub = Subscription.EMPTY;
        /**
         * Subscription to events for when the tab body finishes leaving from center position.
         */
        this._leavingSub = Subscription.EMPTY;
    }
    /**
     * Set initial visibility or set up subscription for changing visibility.
     * @return {?}
     */
    ngOnInit() {
        super.ngOnInit();
        this._centeringSub = this._host._beforeCentering
            .pipe(startWith(this._host._isCenterPosition(this._host._position)))
            .subscribe((/**
         * @param {?} isCentering
         * @return {?}
         */
        (isCentering) => {
            if (isCentering && !this.hasAttached()) {
                this.attach(this._host._content);
            }
        }));
        this._leavingSub = this._host._afterLeavingCenter.subscribe((/**
         * @return {?}
         */
        () => {
            this.detach();
        }));
    }
    /**
     * Clean up centering subscription.
     * @return {?}
     */
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
/** @nocollapse */
MatTabBodyPortal.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: MatTabBody, decorators: [{ type: Inject, args: [forwardRef((/**
                     * @return {?}
                     */
                    () => MatTabBody)),] }] }
];
if (false) {
    /**
     * Subscription to events for when the tab body begins centering.
     * @type {?}
     * @private
     */
    MatTabBodyPortal.prototype._centeringSub;
    /**
     * Subscription to events for when the tab body finishes leaving from center position.
     * @type {?}
     * @private
     */
    MatTabBodyPortal.prototype._leavingSub;
    /**
     * @type {?}
     * @private
     */
    MatTabBodyPortal.prototype._host;
}
/**
 * Base class with all of the `MatTabBody` functionality.
 * \@docs-private
 * @abstract
 */
// tslint:disable-next-line:class-name
export class _MatTabBodyBase {
    /**
     * @param {?} _elementRef
     * @param {?} _dir
     * @param {?} changeDetectorRef
     */
    constructor(_elementRef, _dir, changeDetectorRef) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /**
         * Subscription to the directionality change observable.
         */
        this._dirChangeSubscription = Subscription.EMPTY;
        /**
         * Emits when an animation on the tab is complete.
         */
        this._translateTabComplete = new Subject();
        /**
         * Event emitted when the tab begins to animate towards the center as the active tab.
         */
        this._onCentering = new EventEmitter();
        /**
         * Event emitted before the centering of the tab begins.
         */
        this._beforeCentering = new EventEmitter();
        /**
         * Event emitted before the centering of the tab begins.
         */
        this._afterLeavingCenter = new EventEmitter();
        /**
         * Event emitted when the tab completes its animation towards the center.
         */
        this._onCentered = new EventEmitter(true);
        // Note that the default value will always be overwritten by `MatTabBody`, but we need one
        // anyway to prevent the animations module from throwing an error if the body is used on its own.
        /**
         * Duration for the tab's animation.
         */
        this.animationDuration = '500ms';
        if (_dir) {
            this._dirChangeSubscription = _dir.change.subscribe((/**
             * @param {?} dir
             * @return {?}
             */
            (dir) => {
                this._computePositionAnimationState(dir);
                changeDetectorRef.markForCheck();
            }));
        }
        // Ensure that we get unique animation events, because the `.done` callback can get
        // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
        this._translateTabComplete.pipe(distinctUntilChanged((/**
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
            // If the transition to the center is complete, emit an event.
            if (this._isCenterPosition(event.toState) && this._isCenterPosition(this._position)) {
                this._onCentered.emit();
            }
            if (this._isCenterPosition(event.fromState) && !this._isCenterPosition(this._position)) {
                this._afterLeavingCenter.emit();
            }
        }));
    }
    /**
     * The shifted index position of the tab body, where zero represents the active center tab.
     * @param {?} position
     * @return {?}
     */
    set position(position) {
        this._positionIndex = position;
        this._computePositionAnimationState();
    }
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     * @return {?}
     */
    ngOnInit() {
        if (this._position == 'center' && this.origin != null) {
            this._position = this._computePositionFromOrigin();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._dirChangeSubscription.unsubscribe();
        this._translateTabComplete.complete();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _onTranslateTabStarted(event) {
        /** @type {?} */
        const isCentering = this._isCenterPosition(event.toState);
        this._beforeCentering.emit(isCentering);
        if (isCentering) {
            this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    }
    /**
     * The text direction of the containing app.
     * @return {?}
     */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /**
     * Whether the provided position state is considered center, regardless of origin.
     * @param {?} position
     * @return {?}
     */
    _isCenterPosition(position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    }
    /**
     * Computes the position state that will be used for the tab-body animation trigger.
     * @private
     * @param {?=} dir
     * @return {?}
     */
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
     * @private
     * @return {?}
     */
    _computePositionFromOrigin() {
        /** @type {?} */
        const dir = this._getLayoutDirection();
        if ((dir == 'ltr' && this.origin <= 0) || (dir == 'rtl' && this.origin > 0)) {
            return 'left-origin-center';
        }
        return 'right-origin-center';
    }
}
_MatTabBodyBase.decorators = [
    { type: Directive, args: [{
                // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                selector: 'do-not-use-abstract-mat-tab-body-base'
            },] }
];
/** @nocollapse */
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
if (false) {
    /**
     * Current position of the tab-body in the tab-group. Zero means that the tab is visible.
     * @type {?}
     * @private
     */
    _MatTabBodyBase.prototype._positionIndex;
    /**
     * Subscription to the directionality change observable.
     * @type {?}
     * @private
     */
    _MatTabBodyBase.prototype._dirChangeSubscription;
    /**
     * Tab body position state. Used by the animation trigger for the current state.
     * @type {?}
     */
    _MatTabBodyBase.prototype._position;
    /**
     * Emits when an animation on the tab is complete.
     * @type {?}
     */
    _MatTabBodyBase.prototype._translateTabComplete;
    /**
     * Event emitted when the tab begins to animate towards the center as the active tab.
     * @type {?}
     */
    _MatTabBodyBase.prototype._onCentering;
    /**
     * Event emitted before the centering of the tab begins.
     * @type {?}
     */
    _MatTabBodyBase.prototype._beforeCentering;
    /**
     * Event emitted before the centering of the tab begins.
     * @type {?}
     */
    _MatTabBodyBase.prototype._afterLeavingCenter;
    /**
     * Event emitted when the tab completes its animation towards the center.
     * @type {?}
     */
    _MatTabBodyBase.prototype._onCentered;
    /**
     * The portal host inside of this container into which the tab body content will be loaded.
     * @type {?}
     */
    _MatTabBodyBase.prototype._portalHost;
    /**
     * The tab body content to display.
     * @type {?}
     */
    _MatTabBodyBase.prototype._content;
    /**
     * Position that will be used when the tab is immediately becoming visible after creation.
     * @type {?}
     */
    _MatTabBodyBase.prototype.origin;
    /**
     * Duration for the tab's animation.
     * @type {?}
     */
    _MatTabBodyBase.prototype.animationDuration;
    /**
     * @type {?}
     * @private
     */
    _MatTabBodyBase.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    _MatTabBodyBase.prototype._dir;
}
/**
 * Wrapper for the contents of a tab.
 * \@docs-private
 */
export class MatTabBody extends _MatTabBodyBase {
    /**
     * @param {?} elementRef
     * @param {?} dir
     * @param {?} changeDetectorRef
     */
    constructor(elementRef, dir, changeDetectorRef) {
        super(elementRef, dir, changeDetectorRef);
    }
}
MatTabBody.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-tab-body',
                template: "<div class=\"mat-tab-body-content\" #content\n     [@translateTab]=\"{\n        value: _position,\n        params: {animationDuration: animationDuration}\n     }\"\n     (@translateTab.start)=\"_onTranslateTabStarted($event)\"\n     (@translateTab.done)=\"_translateTabComplete.next($event)\">\n  <ng-template matTabBodyHost></ng-template>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                // tslint:disable-next-line:validate-decorators
                changeDetection: ChangeDetectionStrategy.Default,
                animations: [matTabsAnimations.translateTab],
                host: {
                    'class': 'mat-tab-body',
                },
                styles: [".mat-tab-body-content{height:100%;overflow:auto}.mat-tab-group-dynamic-height .mat-tab-body-content{overflow:hidden}\n"]
            }] }
];
/** @nocollapse */
MatTabBody.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: ChangeDetectorRef }
];
MatTabBody.propDecorators = {
    _portalHost: [{ type: ViewChild, args: [PortalHostDirective, { static: false },] }]
};
if (false) {
    /** @type {?} */
    MatTabBody.prototype._portalHost;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWJvZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksRUFHWixVQUFVLEVBQ1YsU0FBUyxFQUNULFFBQVEsRUFDUixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUN4QixnQkFBZ0IsRUFDaEIsVUFBVSxFQUNWLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsY0FBYyxFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pGLE9BQU8sRUFBQyxjQUFjLEVBQVksTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBOEIvRCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZUFBZTs7Ozs7O0lBTW5ELFlBQ0Usd0JBQWtELEVBQ2xELGdCQUFrQyxFQUNZLEtBQWlCO1FBQzdELEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRE4sVUFBSyxHQUFMLEtBQUssQ0FBWTs7OztRQVB6RCxrQkFBYSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7Ozs7UUFFbkMsZ0JBQVcsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0lBT3pDLENBQUM7Ozs7O0lBR0QsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJ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QUM7Ozs7SUFBL0MsaUNBQWtGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGZvcndhcmRSZWYsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWwsIENka1BvcnRhbE91dGxldCwgUG9ydGFsSG9zdERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5LCBEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7U3Vic2NyaXB0aW9uLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWF0VGFic0FuaW1hdGlvbnN9IGZyb20gJy4vdGFicy1hbmltYXRpb25zJztcbmltcG9ydCB7c3RhcnRXaXRoLCBkaXN0aW5jdFVudGlsQ2hhbmdlZH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIFRoZXNlIHBvc2l0aW9uIHN0YXRlcyBhcmUgdXNlZCBpbnRlcm5hbGx5IGFzIGFuaW1hdGlvbiBzdGF0ZXMgZm9yIHRoZSB0YWIgYm9keS4gU2V0dGluZyB0aGVcbiAqIHBvc2l0aW9uIHN0YXRlIHRvIGxlZnQsIHJpZ2h0LCBvciBjZW50ZXIgd2lsbCB0cmFuc2l0aW9uIHRoZSB0YWIgYm9keSBmcm9tIGl0cyBjdXJyZW50XG4gKiBwb3NpdGlvbiB0byBpdHMgcmVzcGVjdGl2ZSBzdGF0ZS4gSWYgdGhlcmUgaXMgbm90IGN1cnJlbnQgcG9zaXRpb24gKHZvaWQsIGluIHRoZSBjYXNlIG9mIGEgbmV3XG4gKiB0YWIgYm9keSksIHRoZW4gdGhlcmUgd2lsbCBiZSBubyB0cmFuc2l0aW9uIGFuaW1hdGlvbiB0byBpdHMgc3RhdGUuXG4gKlxuICogSW4gdGhlIGNhc2Ugb2YgYSBuZXcgdGFiIGJvZHkgdGhhdCBzaG91bGQgaW1tZWRpYXRlbHkgYmUgY2VudGVyZWQgd2l0aCBhbiBhbmltYXRpbmcgdHJhbnNpdGlvbixcbiAqIHRoZW4gbGVmdC1vcmlnaW4tY2VudGVyIG9yIHJpZ2h0LW9yaWdpbi1jZW50ZXIgY2FuIGJlIHVzZWQsIHdoaWNoIHdpbGwgdXNlIGxlZnQgb3IgcmlnaHQgYXMgaXRzXG4gKiBwc3VlZG8tcHJpb3Igc3RhdGUuXG4gKi9cbmV4cG9ydCB0eXBlIE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlID1cbiAgICAnbGVmdCcgfCAnY2VudGVyJyB8ICdyaWdodCcgfCAnbGVmdC1vcmlnaW4tY2VudGVyJyB8ICdyaWdodC1vcmlnaW4tY2VudGVyJztcblxuLyoqXG4gKiBUaGUgb3JpZ2luIHN0YXRlIGlzIGFuIGludGVybmFsbHkgdXNlZCBzdGF0ZSB0aGF0IGlzIHNldCBvbiBhIG5ldyB0YWIgYm9keSBpbmRpY2F0aW5nIGlmIGl0XG4gKiBiZWdhbiB0byB0aGUgbGVmdCBvciByaWdodCBvZiB0aGUgcHJpb3Igc2VsZWN0ZWQgaW5kZXguIEZvciBleGFtcGxlLCBpZiB0aGUgc2VsZWN0ZWQgaW5kZXggd2FzXG4gKiBzZXQgdG8gMSwgYW5kIGEgbmV3IHRhYiBpcyBjcmVhdGVkIGFuZCBzZWxlY3RlZCBhdCBpbmRleCAyLCB0aGVuIHRoZSB0YWIgYm9keSB3b3VsZCBoYXZlIGFuXG4gKiBvcmlnaW4gb2YgcmlnaHQgYmVjYXVzZSBpdHMgaW5kZXggd2FzIGdyZWF0ZXIgdGhhbiB0aGUgcHJpb3Igc2VsZWN0ZWQgaW5kZXguXG4gKi9cbmV4cG9ydCB0eXBlIE1hdFRhYkJvZHlPcmlnaW5TdGF0ZSA9ICdsZWZ0JyB8ICdyaWdodCc7XG5cbi8qKlxuICogVGhlIHBvcnRhbCBob3N0IGRpcmVjdGl2ZSBmb3IgdGhlIGNvbnRlbnRzIG9mIHRoZSB0YWIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUYWJCb2R5SG9zdF0nXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkJvZHlQb3J0YWwgZXh0ZW5kcyBDZGtQb3J0YWxPdXRsZXQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gZXZlbnRzIGZvciB3aGVuIHRoZSB0YWIgYm9keSBiZWdpbnMgY2VudGVyaW5nLiAqL1xuICBwcml2YXRlIF9jZW50ZXJpbmdTdWIgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gZXZlbnRzIGZvciB3aGVuIHRoZSB0YWIgYm9keSBmaW5pc2hlcyBsZWF2aW5nIGZyb20gY2VudGVyIHBvc2l0aW9uLiAqL1xuICBwcml2YXRlIF9sZWF2aW5nU3ViID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE1hdFRhYkJvZHkpKSBwcml2YXRlIF9ob3N0OiBNYXRUYWJCb2R5KSB7XG4gICAgICBzdXBlcihjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHZpZXdDb250YWluZXJSZWYpO1xuICB9XG5cbiAgLyoqIFNldCBpbml0aWFsIHZpc2liaWxpdHkgb3Igc2V0IHVwIHN1YnNjcmlwdGlvbiBmb3IgY2hhbmdpbmcgdmlzaWJpbGl0eS4gKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIHRoaXMuX2NlbnRlcmluZ1N1YiA9IHRoaXMuX2hvc3QuX2JlZm9yZUNlbnRlcmluZ1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2hvc3QuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5faG9zdC5fcG9zaXRpb24pKSlcbiAgICAgIC5zdWJzY3JpYmUoKGlzQ2VudGVyaW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGlmIChpc0NlbnRlcmluZyAmJiAhdGhpcy5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2godGhpcy5faG9zdC5fY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fbGVhdmluZ1N1YiA9IHRoaXMuX2hvc3QuX2FmdGVyTGVhdmluZ0NlbnRlci5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDbGVhbiB1cCBjZW50ZXJpbmcgc3Vic2NyaXB0aW9uLiAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2NlbnRlcmluZ1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2xlYXZpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJCb2R5YCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgLy8gVE9ETyhjcmlzYmV0byk6IHRoaXMgc2VsZWN0b3IgY2FuIGJlIHJlbW92ZWQgd2hlbiB3ZSB1cGRhdGUgdG8gQW5ndWxhciA5LjAuXG4gIHNlbGVjdG9yOiAnZG8tbm90LXVzZS1hYnN0cmFjdC1tYXQtdGFiLWJvZHktYmFzZSdcbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUYWJCb2R5QmFzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIEN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHRhYi1ib2R5IGluIHRoZSB0YWItZ3JvdXAuIFplcm8gbWVhbnMgdGhhdCB0aGUgdGFiIGlzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3Bvc2l0aW9uSW5kZXg6IG51bWJlcjtcblxuICAvKiogU3Vic2NyaXB0aW9uIHRvIHRoZSBkaXJlY3Rpb25hbGl0eSBjaGFuZ2Ugb2JzZXJ2YWJsZS4gKi9cbiAgcHJpdmF0ZSBfZGlyQ2hhbmdlU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBUYWIgYm9keSBwb3NpdGlvbiBzdGF0ZS4gVXNlZCBieSB0aGUgYW5pbWF0aW9uIHRyaWdnZXIgZm9yIHRoZSBjdXJyZW50IHN0YXRlLiAqL1xuICBfcG9zaXRpb246IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlO1xuXG4gIC8qKiBFbWl0cyB3aGVuIGFuIGFuaW1hdGlvbiBvbiB0aGUgdGFiIGlzIGNvbXBsZXRlLiAqL1xuICBfdHJhbnNsYXRlVGFiQ29tcGxldGUgPSBuZXcgU3ViamVjdDxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0YWIgYmVnaW5zIHRvIGFuaW1hdGUgdG93YXJkcyB0aGUgY2VudGVyIGFzIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX29uQ2VudGVyaW5nOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGJlZm9yZSB0aGUgY2VudGVyaW5nIG9mIHRoZSB0YWIgYmVnaW5zLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX2JlZm9yZUNlbnRlcmluZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIGJlZm9yZSB0aGUgY2VudGVyaW5nIG9mIHRoZSB0YWIgYmVnaW5zLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX2FmdGVyTGVhdmluZ0NlbnRlcjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRhYiBjb21wbGV0ZXMgaXRzIGFuaW1hdGlvbiB0b3dhcmRzIHRoZSBjZW50ZXIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfb25DZW50ZXJlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPih0cnVlKTtcblxuICAgLyoqIFRoZSBwb3J0YWwgaG9zdCBpbnNpZGUgb2YgdGhpcyBjb250YWluZXIgaW50byB3aGljaCB0aGUgdGFiIGJvZHkgY29udGVudCB3aWxsIGJlIGxvYWRlZC4gKi9cbiAgYWJzdHJhY3QgX3BvcnRhbEhvc3Q6IFBvcnRhbEhvc3REaXJlY3RpdmU7XG5cbiAgLyoqIFRoZSB0YWIgYm9keSBjb250ZW50IHRvIGRpc3BsYXkuICovXG4gIEBJbnB1dCgnY29udGVudCcpIF9jb250ZW50OiBUZW1wbGF0ZVBvcnRhbDtcblxuICAvKiogUG9zaXRpb24gdGhhdCB3aWxsIGJlIHVzZWQgd2hlbiB0aGUgdGFiIGlzIGltbWVkaWF0ZWx5IGJlY29taW5nIHZpc2libGUgYWZ0ZXIgY3JlYXRpb24uICovXG4gIEBJbnB1dCgpIG9yaWdpbjogbnVtYmVyO1xuXG4gIC8vIE5vdGUgdGhhdCB0aGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBvdmVyd3JpdHRlbiBieSBgTWF0VGFiQm9keWAsIGJ1dCB3ZSBuZWVkIG9uZVxuICAvLyBhbnl3YXkgdG8gcHJldmVudCB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgZnJvbSB0aHJvd2luZyBhbiBlcnJvciBpZiB0aGUgYm9keSBpcyB1c2VkIG9uIGl0cyBvd24uXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYidzIGFuaW1hdGlvbi4gKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZyA9ICc1MDBtcyc7XG5cbiAgLyoqIFRoZSBzaGlmdGVkIGluZGV4IHBvc2l0aW9uIG9mIHRoZSB0YWIgYm9keSwgd2hlcmUgemVybyByZXByZXNlbnRzIHRoZSBhY3RpdmUgY2VudGVyIHRhYi4gKi9cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4ID0gcG9zaXRpb247XG4gICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIGlmIChfZGlyKSB7XG4gICAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBfZGlyLmNoYW5nZS5zdWJzY3JpYmUoKGRpcjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKGRpcik7XG4gICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgZ2V0IHVuaXF1ZSBhbmltYXRpb24gZXZlbnRzLCBiZWNhdXNlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGNhbiBnZXRcbiAgICAvLyBpbnZva2VkIHR3aWNlIGluIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NC5cbiAgICB0aGlzLl90cmFuc2xhdGVUYWJDb21wbGV0ZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRyYW5zaXRpb24gdG8gdGhlIGNlbnRlciBpcyBjb21wbGV0ZSwgZW1pdCBhbiBldmVudC5cbiAgICAgIGlmICh0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LnRvU3RhdGUpICYmIHRoaXMuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5fcG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuX29uQ2VudGVyZWQuZW1pdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC5mcm9tU3RhdGUpICYmICF0aGlzLl9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uKSkge1xuICAgICAgICB0aGlzLl9hZnRlckxlYXZpbmdDZW50ZXIuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIGluaXRpYWxpemVkLCBjaGVjayBpZiB0aGUgY29udGVudCBpcyBjZW50ZXJlZCBhbmQgaGFzIGFuIG9yaWdpbi4gSWYgc28sIHNldCB0aGVcbiAgICogc3BlY2lhbCBwb3NpdGlvbiBzdGF0ZXMgdGhhdCB0cmFuc2l0aW9uIHRoZSB0YWIgZnJvbSB0aGUgbGVmdCBvciByaWdodCBiZWZvcmUgY2VudGVyaW5nLlxuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uID09ICdjZW50ZXInICYmIHRoaXMub3JpZ2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5fY29tcHV0ZVBvc2l0aW9uRnJvbU9yaWdpbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3RyYW5zbGF0ZVRhYkNvbXBsZXRlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBfb25UcmFuc2xhdGVUYWJTdGFydGVkKGV2ZW50OiBBbmltYXRpb25FdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlzQ2VudGVyaW5nID0gdGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC50b1N0YXRlKTtcbiAgICB0aGlzLl9iZWZvcmVDZW50ZXJpbmcuZW1pdChpc0NlbnRlcmluZyk7XG4gICAgaWYgKGlzQ2VudGVyaW5nKSB7XG4gICAgICB0aGlzLl9vbkNlbnRlcmluZy5lbWl0KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgdGV4dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBfZ2V0TGF5b3V0RGlyZWN0aW9uKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwcm92aWRlZCBwb3NpdGlvbiBzdGF0ZSBpcyBjb25zaWRlcmVkIGNlbnRlciwgcmVnYXJkbGVzcyBvZiBvcmlnaW4uICovXG4gIF9pc0NlbnRlclBvc2l0aW9uKHBvc2l0aW9uOiBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZXxzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcG9zaXRpb24gPT0gJ2NlbnRlcicgfHxcbiAgICAgICAgcG9zaXRpb24gPT0gJ2xlZnQtb3JpZ2luLWNlbnRlcicgfHxcbiAgICAgICAgcG9zaXRpb24gPT0gJ3JpZ2h0LW9yaWdpbi1jZW50ZXInO1xuICB9XG5cbiAgLyoqIENvbXB1dGVzIHRoZSBwb3NpdGlvbiBzdGF0ZSB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHRhYi1ib2R5IGFuaW1hdGlvbiB0cmlnZ2VyLiAqL1xuICBwcml2YXRlIF9jb21wdXRlUG9zaXRpb25BbmltYXRpb25TdGF0ZShkaXI6IERpcmVjdGlvbiA9IHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKSB7XG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uSW5kZXggPCAwKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IGRpciA9PSAnbHRyJyA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wb3NpdGlvbkluZGV4ID4gMCkge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSBkaXIgPT0gJ2x0cicgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9ICdjZW50ZXInO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wdXRlcyB0aGUgcG9zaXRpb24gc3RhdGUgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBvcmlnaW4gcG9zaXRpb24uIFRoaXMgaXMgdXNlZCBpZiB0aGVcbiAgICogdGFiIGlzIGJlY29taW5nIHZpc2libGUgaW1tZWRpYXRlbHkgYWZ0ZXIgY3JlYXRpb24uXG4gICAqL1xuICBwcml2YXRlIF9jb21wdXRlUG9zaXRpb25Gcm9tT3JpZ2luKCk6IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlIHtcbiAgICBjb25zdCBkaXIgPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKTtcblxuICAgIGlmICgoZGlyID09ICdsdHInICYmIHRoaXMub3JpZ2luIDw9IDApIHx8IChkaXIgPT0gJ3J0bCcgJiYgdGhpcy5vcmlnaW4gPiAwKSkge1xuICAgICAgcmV0dXJuICdsZWZ0LW9yaWdpbi1jZW50ZXInO1xuICAgIH1cblxuICAgIHJldHVybiAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgY29udGVudHMgb2YgYSB0YWIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10YWItYm9keScsXG4gIHRlbXBsYXRlVXJsOiAndGFiLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItYm9keS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0VGFic0FuaW1hdGlvbnMudHJhbnNsYXRlVGFiXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWJvZHknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkJvZHkgZXh0ZW5kcyBfTWF0VGFiQm9keUJhc2Uge1xuICBAVmlld0NoaWxkKFBvcnRhbEhvc3REaXJlY3RpdmUsIHtzdGF0aWM6IGZhbHNlfSkgX3BvcnRhbEhvc3Q6IFBvcnRhbEhvc3REaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRpciwgY2hhbmdlRGV0ZWN0b3JSZWYpO1xuICB9XG59XG4iXX0=