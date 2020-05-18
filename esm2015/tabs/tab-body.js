/**
 * @fileoverview added by tsickle
 * Generated from: src/material/tabs/tab-body.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
import { DOCUMENT } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { matTabsAnimations } from './tabs-animations';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
/**
 * The portal host directive for the contents of the tab.
 * \@docs-private
 */
let MatTabBodyPortal = /** @class */ (() => {
    /**
     * The portal host directive for the contents of the tab.
     * \@docs-private
     */
    class MatTabBodyPortal extends CdkPortalOutlet {
        /**
         * @param {?} componentFactoryResolver
         * @param {?} viewContainerRef
         * @param {?} _host
         * @param {?=} _document
         */
        constructor(componentFactoryResolver, viewContainerRef, _host, 
        /**
         * @deprecated `_document` parameter to be made required.
         * @breaking-change 9.0.0
         */
        _document) {
            super(componentFactoryResolver, viewContainerRef, _document);
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
                        () => MatTabBody)),] }] },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ];
    return MatTabBodyPortal;
})();
export { MatTabBodyPortal };
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
let _MatTabBodyBase = /** @class */ (() => {
    /**
     * Base class with all of the `MatTabBody` functionality.
     * \@docs-private
     * @abstract
     */
    class _MatTabBodyBase {
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
                this._position = this._computePositionFromOrigin(this.origin);
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
         * @param {?} origin
         * @return {?}
         */
        _computePositionFromOrigin(origin) {
            /** @type {?} */
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
    return _MatTabBodyBase;
})();
export { _MatTabBodyBase };
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
let MatTabBody = /** @class */ (() => {
    /**
     * Wrapper for the contents of a tab.
     * \@docs-private
     */
    class MatTabBody extends _MatTabBodyBase {
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
        _portalHost: [{ type: ViewChild, args: [PortalHostDirective,] }]
    };
    return MatTabBody;
})();
export { MatTabBody };
if (false) {
    /** @type {?} */
    MatTabBody.prototype._portalHost;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWJvZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQ0wsU0FBUyxFQUNULGlCQUFpQixFQUNqQixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixZQUFZLEVBR1osVUFBVSxFQUNWLFNBQVMsRUFDVCxRQUFRLEVBQ1IsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsZ0JBQWdCLEVBQ2hCLFVBQVUsRUFDVixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RixPQUFPLEVBQUMsY0FBYyxFQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxZQUFZLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUEyQi9EOzs7OztJQUFBLE1BR2EsZ0JBQWlCLFNBQVEsZUFBZTs7Ozs7OztRQU1uRCxZQUNFLHdCQUFrRCxFQUNsRCxnQkFBa0MsRUFDWSxLQUFpQjtRQUMvRDs7O1dBR0c7UUFDZSxTQUFlO1lBQ2pDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztZQU5mLFVBQUssR0FBTCxLQUFLLENBQVk7Ozs7WUFQekQsa0JBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDOzs7O1lBRW5DLGdCQUFXLEdBQUcsWUFB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RTt3QkFDSixPQUFPLEVBQUUsY0FBYztxQkFDeEI7O2lCQUNGOzs7O2dCQXBQQyxVQUFVO2dCQVlKLGNBQWMsdUJBNk9QLFFBQVE7Z0JBaFFyQixpQkFBaUI7Ozs4QkE2UGhCLFNBQVMsU0FBQyxtQkFBbUI7O0lBT2hDLGlCQUFDO0tBQUE7U0FSWSxVQUFVOzs7SUFDckIsaUNBQWlFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIElucHV0LFxuICBJbmplY3QsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgRWxlbWVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIGZvcndhcmRSZWYsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7VGVtcGxhdGVQb3J0YWwsIENka1BvcnRhbE91dGxldCwgUG9ydGFsSG9zdERpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5LCBEaXJlY3Rpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1N1YnNjcmlwdGlvbiwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hdFRhYnNBbmltYXRpb25zfSBmcm9tICcuL3RhYnMtYW5pbWF0aW9ucyc7XG5pbXBvcnQge3N0YXJ0V2l0aCwgZGlzdGluY3RVbnRpbENoYW5nZWR9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBUaGVzZSBwb3NpdGlvbiBzdGF0ZXMgYXJlIHVzZWQgaW50ZXJuYWxseSBhcyBhbmltYXRpb24gc3RhdGVzIGZvciB0aGUgdGFiIGJvZHkuIFNldHRpbmcgdGhlXG4gKiBwb3NpdGlvbiBzdGF0ZSB0byBsZWZ0LCByaWdodCwgb3IgY2VudGVyIHdpbGwgdHJhbnNpdGlvbiB0aGUgdGFiIGJvZHkgZnJvbSBpdHMgY3VycmVudFxuICogcG9zaXRpb24gdG8gaXRzIHJlc3BlY3RpdmUgc3RhdGUuIElmIHRoZXJlIGlzIG5vdCBjdXJyZW50IHBvc2l0aW9uICh2b2lkLCBpbiB0aGUgY2FzZSBvZiBhIG5ld1xuICogdGFiIGJvZHkpLCB0aGVuIHRoZXJlIHdpbGwgYmUgbm8gdHJhbnNpdGlvbiBhbmltYXRpb24gdG8gaXRzIHN0YXRlLlxuICpcbiAqIEluIHRoZSBjYXNlIG9mIGEgbmV3IHRhYiBib2R5IHRoYXQgc2hvdWxkIGltbWVkaWF0ZWx5IGJlIGNlbnRlcmVkIHdpdGggYW4gYW5pbWF0aW5nIHRyYW5zaXRpb24sXG4gKiB0aGVuIGxlZnQtb3JpZ2luLWNlbnRlciBvciByaWdodC1vcmlnaW4tY2VudGVyIGNhbiBiZSB1c2VkLCB3aGljaCB3aWxsIHVzZSBsZWZ0IG9yIHJpZ2h0IGFzIGl0c1xuICogcHN1ZWRvLXByaW9yIHN0YXRlLlxuICovXG5leHBvcnQgdHlwZSBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZSA9XG4gICAgJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnIHwgJ2xlZnQtb3JpZ2luLWNlbnRlcicgfCAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG5cbi8qKlxuICogVGhlIG9yaWdpbiBzdGF0ZSBpcyBhbiBpbnRlcm5hbGx5IHVzZWQgc3RhdGUgdGhhdCBpcyBzZXQgb24gYSBuZXcgdGFiIGJvZHkgaW5kaWNhdGluZyBpZiBpdFxuICogYmVnYW4gdG8gdGhlIGxlZnQgb3IgcmlnaHQgb2YgdGhlIHByaW9yIHNlbGVjdGVkIGluZGV4LiBGb3IgZXhhbXBsZSwgaWYgdGhlIHNlbGVjdGVkIGluZGV4IHdhc1xuICogc2V0IHRvIDEsIGFuZCBhIG5ldyB0YWIgaXMgY3JlYXRlZCBhbmQgc2VsZWN0ZWQgYXQgaW5kZXggMiwgdGhlbiB0aGUgdGFiIGJvZHkgd291bGQgaGF2ZSBhblxuICogb3JpZ2luIG9mIHJpZ2h0IGJlY2F1c2UgaXRzIGluZGV4IHdhcyBncmVhdGVyIHRoYW4gdGhlIHByaW9yIHNlbGVjdGVkIGluZGV4LlxuICovXG5leHBvcnQgdHlwZSBNYXRUYWJCb2R5T3JpZ2luU3RhdGUgPSAnbGVmdCcgfCAncmlnaHQnO1xuXG4vKipcbiAqIFRoZSBwb3J0YWwgaG9zdCBkaXJlY3RpdmUgZm9yIHRoZSBjb250ZW50cyBvZiB0aGUgdGFiLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VGFiQm9keUhvc3RdJ1xufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJCb2R5UG9ydGFsIGV4dGVuZHMgQ2RrUG9ydGFsT3V0bGV0IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKiogU3Vic2NyaXB0aW9uIHRvIGV2ZW50cyBmb3Igd2hlbiB0aGUgdGFiIGJvZHkgYmVnaW5zIGNlbnRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2VudGVyaW5nU3ViID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAvKiogU3Vic2NyaXB0aW9uIHRvIGV2ZW50cyBmb3Igd2hlbiB0aGUgdGFiIGJvZHkgZmluaXNoZXMgbGVhdmluZyBmcm9tIGNlbnRlciBwb3NpdGlvbi4gKi9cbiAgcHJpdmF0ZSBfbGVhdmluZ1N1YiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBNYXRUYWJCb2R5KSkgcHJpdmF0ZSBfaG9zdDogTWF0VGFiQm9keSxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgX2RvY3VtZW50YCBwYXJhbWV0ZXIgdG8gYmUgbWFkZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDkuMC4wXG4gICAgICovXG4gICAgQEluamVjdChET0NVTUVOVCkgX2RvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCB2aWV3Q29udGFpbmVyUmVmLCBfZG9jdW1lbnQpO1xuICB9XG5cbiAgLyoqIFNldCBpbml0aWFsIHZpc2liaWxpdHkgb3Igc2V0IHVwIHN1YnNjcmlwdGlvbiBmb3IgY2hhbmdpbmcgdmlzaWJpbGl0eS4gKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIHRoaXMuX2NlbnRlcmluZ1N1YiA9IHRoaXMuX2hvc3QuX2JlZm9yZUNlbnRlcmluZ1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2hvc3QuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5faG9zdC5fcG9zaXRpb24pKSlcbiAgICAgIC5zdWJzY3JpYmUoKGlzQ2VudGVyaW5nOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGlmIChpc0NlbnRlcmluZyAmJiAhdGhpcy5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICAgICAgdGhpcy5hdHRhY2godGhpcy5faG9zdC5fY29udGVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5fbGVhdmluZ1N1YiA9IHRoaXMuX2hvc3QuX2FmdGVyTGVhdmluZ0NlbnRlci5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5kZXRhY2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDbGVhbiB1cCBjZW50ZXJpbmcgc3Vic2NyaXB0aW9uLiAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuX2NlbnRlcmluZ1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2xlYXZpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRUYWJCb2R5YCBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjbGFzcy1uYW1lXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYkJvZHlCYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKiogQ3VycmVudCBwb3NpdGlvbiBvZiB0aGUgdGFiLWJvZHkgaW4gdGhlIHRhYi1ncm91cC4gWmVybyBtZWFucyB0aGF0IHRoZSB0YWIgaXMgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfcG9zaXRpb25JbmRleDogbnVtYmVyO1xuXG4gIC8qKiBTdWJzY3JpcHRpb24gdG8gdGhlIGRpcmVjdGlvbmFsaXR5IGNoYW5nZSBvYnNlcnZhYmxlLiAqL1xuICBwcml2YXRlIF9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIFRhYiBib2R5IHBvc2l0aW9uIHN0YXRlLiBVc2VkIGJ5IHRoZSBhbmltYXRpb24gdHJpZ2dlciBmb3IgdGhlIGN1cnJlbnQgc3RhdGUuICovXG4gIF9wb3NpdGlvbjogTWF0VGFiQm9keVBvc2l0aW9uU3RhdGU7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gYW5pbWF0aW9uIG9uIHRoZSB0YWIgaXMgY29tcGxldGUuICovXG4gIF90cmFuc2xhdGVUYWJDb21wbGV0ZSA9IG5ldyBTdWJqZWN0PEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHRhYiBiZWdpbnMgdG8gYW5pbWF0ZSB0b3dhcmRzIHRoZSBjZW50ZXIgYXMgdGhlIGFjdGl2ZSB0YWIuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfb25DZW50ZXJpbmc6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgYmVmb3JlIHRoZSBjZW50ZXJpbmcgb2YgdGhlIHRhYiBiZWdpbnMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfYmVmb3JlQ2VudGVyaW5nOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgYmVmb3JlIHRoZSBjZW50ZXJpbmcgb2YgdGhlIHRhYiBiZWdpbnMuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBfYWZ0ZXJMZWF2aW5nQ2VudGVyOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIGNvbXBsZXRlcyBpdHMgYW5pbWF0aW9uIHRvd2FyZHMgdGhlIGNlbnRlci4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF9vbkNlbnRlcmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KHRydWUpO1xuXG4gICAvKiogVGhlIHBvcnRhbCBob3N0IGluc2lkZSBvZiB0aGlzIGNvbnRhaW5lciBpbnRvIHdoaWNoIHRoZSB0YWIgYm9keSBjb250ZW50IHdpbGwgYmUgbG9hZGVkLiAqL1xuICBhYnN0cmFjdCBfcG9ydGFsSG9zdDogUG9ydGFsSG9zdERpcmVjdGl2ZTtcblxuICAvKiogVGhlIHRhYiBib2R5IGNvbnRlbnQgdG8gZGlzcGxheS4gKi9cbiAgQElucHV0KCdjb250ZW50JykgX2NvbnRlbnQ6IFRlbXBsYXRlUG9ydGFsO1xuXG4gIC8qKiBQb3NpdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB3aGVuIHRoZSB0YWIgaXMgaW1tZWRpYXRlbHkgYmVjb21pbmcgdmlzaWJsZSBhZnRlciBjcmVhdGlvbi4gKi9cbiAgQElucHV0KCkgb3JpZ2luOiBudW1iZXIgfCBudWxsO1xuXG4gIC8vIE5vdGUgdGhhdCB0aGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGFsd2F5cyBiZSBvdmVyd3JpdHRlbiBieSBgTWF0VGFiQm9keWAsIGJ1dCB3ZSBuZWVkIG9uZVxuICAvLyBhbnl3YXkgdG8gcHJldmVudCB0aGUgYW5pbWF0aW9ucyBtb2R1bGUgZnJvbSB0aHJvd2luZyBhbiBlcnJvciBpZiB0aGUgYm9keSBpcyB1c2VkIG9uIGl0cyBvd24uXG4gIC8qKiBEdXJhdGlvbiBmb3IgdGhlIHRhYidzIGFuaW1hdGlvbi4gKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uRHVyYXRpb246IHN0cmluZyA9ICc1MDBtcyc7XG5cbiAgLyoqIFRoZSBzaGlmdGVkIGluZGV4IHBvc2l0aW9uIG9mIHRoZSB0YWIgYm9keSwgd2hlcmUgemVybyByZXByZXNlbnRzIHRoZSBhY3RpdmUgY2VudGVyIHRhYi4gKi9cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4ID0gcG9zaXRpb247XG4gICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcblxuICAgIGlmIChfZGlyKSB7XG4gICAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24gPSBfZGlyLmNoYW5nZS5zdWJzY3JpYmUoKGRpcjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKGRpcik7XG4gICAgICAgIGNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgZ2V0IHVuaXF1ZSBhbmltYXRpb24gZXZlbnRzLCBiZWNhdXNlIHRoZSBgLmRvbmVgIGNhbGxiYWNrIGNhbiBnZXRcbiAgICAvLyBpbnZva2VkIHR3aWNlIGluIHNvbWUgYnJvd3NlcnMuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNDA4NC5cbiAgICB0aGlzLl90cmFuc2xhdGVUYWJDb21wbGV0ZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4LCB5KSA9PiB7XG4gICAgICByZXR1cm4geC5mcm9tU3RhdGUgPT09IHkuZnJvbVN0YXRlICYmIHgudG9TdGF0ZSA9PT0geS50b1N0YXRlO1xuICAgIH0pKS5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgLy8gSWYgdGhlIHRyYW5zaXRpb24gdG8gdGhlIGNlbnRlciBpcyBjb21wbGV0ZSwgZW1pdCBhbiBldmVudC5cbiAgICAgIGlmICh0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LnRvU3RhdGUpICYmIHRoaXMuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5fcG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuX29uQ2VudGVyZWQuZW1pdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5faXNDZW50ZXJQb3NpdGlvbihldmVudC5mcm9tU3RhdGUpICYmICF0aGlzLl9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX3Bvc2l0aW9uKSkge1xuICAgICAgICB0aGlzLl9hZnRlckxlYXZpbmdDZW50ZXIuZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIGluaXRpYWxpemVkLCBjaGVjayBpZiB0aGUgY29udGVudCBpcyBjZW50ZXJlZCBhbmQgaGFzIGFuIG9yaWdpbi4gSWYgc28sIHNldCB0aGVcbiAgICogc3BlY2lhbCBwb3NpdGlvbiBzdGF0ZXMgdGhhdCB0cmFuc2l0aW9uIHRoZSB0YWIgZnJvbSB0aGUgbGVmdCBvciByaWdodCBiZWZvcmUgY2VudGVyaW5nLlxuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uID09ICdjZW50ZXInICYmIHRoaXMub3JpZ2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdGhpcy5fY29tcHV0ZVBvc2l0aW9uRnJvbU9yaWdpbih0aGlzLm9yaWdpbik7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGlyQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5fdHJhbnNsYXRlVGFiQ29tcGxldGUuY29tcGxldGUoKTtcbiAgfVxuXG4gIF9vblRyYW5zbGF0ZVRhYlN0YXJ0ZWQoZXZlbnQ6IEFuaW1hdGlvbkV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaXNDZW50ZXJpbmcgPSB0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LnRvU3RhdGUpO1xuICAgIHRoaXMuX2JlZm9yZUNlbnRlcmluZy5lbWl0KGlzQ2VudGVyaW5nKTtcbiAgICBpZiAoaXNDZW50ZXJpbmcpIHtcbiAgICAgIHRoaXMuX29uQ2VudGVyaW5nLmVtaXQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSB0ZXh0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIF9nZXRMYXlvdXREaXJlY3Rpb24oKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHByb3ZpZGVkIHBvc2l0aW9uIHN0YXRlIGlzIGNvbnNpZGVyZWQgY2VudGVyLCByZWdhcmRsZXNzIG9mIG9yaWdpbi4gKi9cbiAgX2lzQ2VudGVyUG9zaXRpb24ocG9zaXRpb246IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlfHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwb3NpdGlvbiA9PSAnY2VudGVyJyB8fFxuICAgICAgICBwb3NpdGlvbiA9PSAnbGVmdC1vcmlnaW4tY2VudGVyJyB8fFxuICAgICAgICBwb3NpdGlvbiA9PSAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG4gIH1cblxuICAvKiogQ29tcHV0ZXMgdGhlIHBvc2l0aW9uIHN0YXRlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdGFiLWJvZHkgYW5pbWF0aW9uIHRyaWdnZXIuICovXG4gIHByaXZhdGUgX2NvbXB1dGVQb3NpdGlvbkFuaW1hdGlvblN0YXRlKGRpcjogRGlyZWN0aW9uID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpIHtcbiAgICBpZiAodGhpcy5fcG9zaXRpb25JbmRleCA8IDApIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gZGlyID09ICdsdHInID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Bvc2l0aW9uSW5kZXggPiAwKSB7XG4gICAgICB0aGlzLl9wb3NpdGlvbiA9IGRpciA9PSAnbHRyJyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gJ2NlbnRlcic7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSBwb3NpdGlvbiBzdGF0ZSBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIG9yaWdpbiBwb3NpdGlvbi4gVGhpcyBpcyB1c2VkIGlmIHRoZVxuICAgKiB0YWIgaXMgYmVjb21pbmcgdmlzaWJsZSBpbW1lZGlhdGVseSBhZnRlciBjcmVhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgX2NvbXB1dGVQb3NpdGlvbkZyb21PcmlnaW4ob3JpZ2luOiBudW1iZXIpOiBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZSB7XG4gICAgY29uc3QgZGlyID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCk7XG5cbiAgICBpZiAoKGRpciA9PSAnbHRyJyAmJiBvcmlnaW4gPD0gMCkgfHwgKGRpciA9PSAncnRsJyAmJiBvcmlnaW4gPiAwKSkge1xuICAgICAgcmV0dXJuICdsZWZ0LW9yaWdpbi1jZW50ZXInO1xuICAgIH1cblxuICAgIHJldHVybiAncmlnaHQtb3JpZ2luLWNlbnRlcic7XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgY29udGVudHMgb2YgYSB0YWIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWItYm9keScsXG4gIHRlbXBsYXRlVXJsOiAndGFiLWJvZHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0YWItYm9keS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBhbmltYXRpb25zOiBbbWF0VGFic0FuaW1hdGlvbnMudHJhbnNsYXRlVGFiXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWJvZHknLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYkJvZHkgZXh0ZW5kcyBfTWF0VGFiQm9keUJhc2Uge1xuICBAVmlld0NoaWxkKFBvcnRhbEhvc3REaXJlY3RpdmUpIF9wb3J0YWxIb3N0OiBQb3J0YWxIb3N0RGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBkaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgICAgICAgICAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBkaXIsIGNoYW5nZURldGVjdG9yUmVmKTtcbiAgfVxufVxuIl19