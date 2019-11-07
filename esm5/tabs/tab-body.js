/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __extends } from "tslib";
import { Component, ChangeDetectorRef, Input, Inject, Output, EventEmitter, ElementRef, Directive, Optional, ViewEncapsulation, ChangeDetectionStrategy, ComponentFactoryResolver, ViewContainerRef, forwardRef, ViewChild, } from '@angular/core';
import { TemplatePortal, CdkPortalOutlet, PortalHostDirective } from '@angular/cdk/portal';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { matTabsAnimations } from './tabs-animations';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
var MatTabBodyPortal = /** @class */ (function (_super) {
    __extends(MatTabBodyPortal, _super);
    function MatTabBodyPortal(componentFactoryResolver, viewContainerRef, _host, 
    /**
     * @deprecated `_document` parameter to be made required.
     * @breaking-change 9.0.0
     */
    _document) {
        var _this = _super.call(this, componentFactoryResolver, viewContainerRef, _document) || this;
        _this._host = _host;
        /** Subscription to events for when the tab body begins centering. */
        _this._centeringSub = Subscription.EMPTY;
        /** Subscription to events for when the tab body finishes leaving from center position. */
        _this._leavingSub = Subscription.EMPTY;
        return _this;
    }
    /** Set initial visibility or set up subscription for changing visibility. */
    MatTabBodyPortal.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this._centeringSub = this._host._beforeCentering
            .pipe(startWith(this._host._isCenterPosition(this._host._position)))
            .subscribe(function (isCentering) {
            if (isCentering && !_this.hasAttached()) {
                _this.attach(_this._host._content);
            }
        });
        this._leavingSub = this._host._afterLeavingCenter.subscribe(function () {
            _this.detach();
        });
    };
    /** Clean up centering subscription. */
    MatTabBodyPortal.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._centeringSub.unsubscribe();
        this._leavingSub.unsubscribe();
    };
    MatTabBodyPortal.decorators = [
        { type: Directive, args: [{
                    selector: '[matTabBodyHost]'
                },] }
    ];
    /** @nocollapse */
    MatTabBodyPortal.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef },
        { type: MatTabBody, decorators: [{ type: Inject, args: [forwardRef(function () { return MatTabBody; }),] }] },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ]; };
    return MatTabBodyPortal;
}(CdkPortalOutlet));
export { MatTabBodyPortal };
/**
 * Base class with all of the `MatTabBody` functionality.
 * @docs-private
 */
var _MatTabBodyBase = /** @class */ (function () {
    function _MatTabBodyBase(_elementRef, _dir, changeDetectorRef) {
        var _this = this;
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
            this._dirChangeSubscription = _dir.change.subscribe(function (dir) {
                _this._computePositionAnimationState(dir);
                changeDetectorRef.markForCheck();
            });
        }
        // Ensure that we get unique animation events, because the `.done` callback can get
        // invoked twice in some browsers. See https://github.com/angular/angular/issues/24084.
        this._translateTabComplete.pipe(distinctUntilChanged(function (x, y) {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(function (event) {
            // If the transition to the center is complete, emit an event.
            if (_this._isCenterPosition(event.toState) && _this._isCenterPosition(_this._position)) {
                _this._onCentered.emit();
            }
            if (_this._isCenterPosition(event.fromState) && !_this._isCenterPosition(_this._position)) {
                _this._afterLeavingCenter.emit();
            }
        });
    }
    Object.defineProperty(_MatTabBodyBase.prototype, "position", {
        /** The shifted index position of the tab body, where zero represents the active center tab. */
        set: function (position) {
            this._positionIndex = position;
            this._computePositionAnimationState();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     */
    _MatTabBodyBase.prototype.ngOnInit = function () {
        if (this._position == 'center' && this.origin != null) {
            this._position = this._computePositionFromOrigin(this.origin);
        }
    };
    _MatTabBodyBase.prototype.ngOnDestroy = function () {
        this._dirChangeSubscription.unsubscribe();
        this._translateTabComplete.complete();
    };
    _MatTabBodyBase.prototype._onTranslateTabStarted = function (event) {
        var isCentering = this._isCenterPosition(event.toState);
        this._beforeCentering.emit(isCentering);
        if (isCentering) {
            this._onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    };
    /** The text direction of the containing app. */
    _MatTabBodyBase.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /** Whether the provided position state is considered center, regardless of origin. */
    _MatTabBodyBase.prototype._isCenterPosition = function (position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    };
    /** Computes the position state that will be used for the tab-body animation trigger. */
    _MatTabBodyBase.prototype._computePositionAnimationState = function (dir) {
        if (dir === void 0) { dir = this._getLayoutDirection(); }
        if (this._positionIndex < 0) {
            this._position = dir == 'ltr' ? 'left' : 'right';
        }
        else if (this._positionIndex > 0) {
            this._position = dir == 'ltr' ? 'right' : 'left';
        }
        else {
            this._position = 'center';
        }
    };
    /**
     * Computes the position state based on the specified origin position. This is used if the
     * tab is becoming visible immediately after creation.
     */
    _MatTabBodyBase.prototype._computePositionFromOrigin = function (origin) {
        var dir = this._getLayoutDirection();
        if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
            return 'left-origin-center';
        }
        return 'right-origin-center';
    };
    _MatTabBodyBase.decorators = [
        { type: Directive, args: [{
                    // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                    selector: 'do-not-use-abstract-mat-tab-body-base'
                },] }
    ];
    /** @nocollapse */
    _MatTabBodyBase.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: ChangeDetectorRef }
    ]; };
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
}());
export { _MatTabBodyBase };
/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
var MatTabBody = /** @class */ (function (_super) {
    __extends(MatTabBody, _super);
    function MatTabBody(elementRef, dir, changeDetectorRef) {
        return _super.call(this, elementRef, dir, changeDetectorRef) || this;
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
    MatTabBody.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: ChangeDetectorRef }
    ]; };
    MatTabBody.propDecorators = {
        _portalHost: [{ type: ViewChild, args: [PortalHostDirective,] }]
    };
    return MatTabBody;
}(_MatTabBodyBase));
export { MatTabBody };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLWJvZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItYm9keS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsS0FBSyxFQUNMLE1BQU0sRUFDTixNQUFNLEVBQ04sWUFBWSxFQUdaLFVBQVUsRUFDVixTQUFTLEVBQ1QsUUFBUSxFQUNSLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsd0JBQXdCLEVBQ3hCLGdCQUFnQixFQUNoQixVQUFVLEVBQ1YsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDekYsT0FBTyxFQUFDLGNBQWMsRUFBWSxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsWUFBWSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUF1Qi9EOzs7R0FHRztBQUNIO0lBR3NDLG9DQUFlO0lBTW5ELDBCQUNFLHdCQUFrRCxFQUNsRCxnQkFBa0MsRUFDWSxLQUFpQjtJQUMvRDs7O09BR0c7SUFDZSxTQUFlO1FBUm5DLFlBU0Usa0JBQU0sd0JBQXdCLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLFNBQzdEO1FBUCtDLFdBQUssR0FBTCxLQUFLLENBQVk7UUFSakUscUVBQXFFO1FBQzdELG1CQUFhLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQztRQUMzQywwRkFB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QUN4Qjs7aUJBQ0Y7Ozs7Z0JBdlBDLFVBQVU7Z0JBWUosY0FBYyx1QkFnUFAsUUFBUTtnQkFuUXJCLGlCQUFpQjs7OzhCQWdRaEIsU0FBUyxTQUFDLG1CQUFtQjs7SUFPaEMsaUJBQUM7Q0FBQSxBQXBCRCxDQVlnQyxlQUFlLEdBUTlDO1NBUlksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJbnB1dCxcbiAgSW5qZWN0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBmb3J3YXJkUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBbmltYXRpb25FdmVudH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1RlbXBsYXRlUG9ydGFsLCBDZGtQb3J0YWxPdXRsZXQsIFBvcnRhbEhvc3REaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eSwgRGlyZWN0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTdWJzY3JpcHRpb24sIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXRUYWJzQW5pbWF0aW9uc30gZnJvbSAnLi90YWJzLWFuaW1hdGlvbnMnO1xuaW1wb3J0IHtzdGFydFdpdGgsIGRpc3RpbmN0VW50aWxDaGFuZ2VkfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbi8qKlxuICogVGhlc2UgcG9zaXRpb24gc3RhdGVzIGFyZSB1c2VkIGludGVybmFsbHkgYXMgYW5pbWF0aW9uIHN0YXRlcyBmb3IgdGhlIHRhYiBib2R5LiBTZXR0aW5nIHRoZVxuICogcG9zaXRpb24gc3RhdGUgdG8gbGVmdCwgcmlnaHQsIG9yIGNlbnRlciB3aWxsIHRyYW5zaXRpb24gdGhlIHRhYiBib2R5IGZyb20gaXRzIGN1cnJlbnRcbiAqIHBvc2l0aW9uIHRvIGl0cyByZXNwZWN0aXZlIHN0YXRlLiBJZiB0aGVyZSBpcyBub3QgY3VycmVudCBwb3NpdGlvbiAodm9pZCwgaW4gdGhlIGNhc2Ugb2YgYSBuZXdcbiAqIHRhYiBib2R5KSwgdGhlbiB0aGVyZSB3aWxsIGJlIG5vIHRyYW5zaXRpb24gYW5pbWF0aW9uIHRvIGl0cyBzdGF0ZS5cbiAqXG4gKiBJbiB0aGUgY2FzZSBvZiBhIG5ldyB0YWIgYm9keSB0aGF0IHNob3VsZCBpbW1lZGlhdGVseSBiZSBjZW50ZXJlZCB3aXRoIGFuIGFuaW1hdGluZyB0cmFuc2l0aW9uLFxuICogdGhlbiBsZWZ0LW9yaWdpbi1jZW50ZXIgb3IgcmlnaHQtb3JpZ2luLWNlbnRlciBjYW4gYmUgdXNlZCwgd2hpY2ggd2lsbCB1c2UgbGVmdCBvciByaWdodCBhcyBpdHNcbiAqIHBzdWVkby1wcmlvciBzdGF0ZS5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0VGFiQm9keVBvc2l0aW9uU3RhdGUgPVxuICAgICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JyB8ICdsZWZ0LW9yaWdpbi1jZW50ZXInIHwgJ3JpZ2h0LW9yaWdpbi1jZW50ZXInO1xuXG4vKipcbiAqIFRoZSBvcmlnaW4gc3RhdGUgaXMgYW4gaW50ZXJuYWxseSB1c2VkIHN0YXRlIHRoYXQgaXMgc2V0IG9uIGEgbmV3IHRhYiBib2R5IGluZGljYXRpbmcgaWYgaXRcbiAqIGJlZ2FuIHRvIHRoZSBsZWZ0IG9yIHJpZ2h0IG9mIHRoZSBwcmlvciBzZWxlY3RlZCBpbmRleC4gRm9yIGV4YW1wbGUsIGlmIHRoZSBzZWxlY3RlZCBpbmRleCB3YXNcbiAqIHNldCB0byAxLCBhbmQgYSBuZXcgdGFiIGlzIGNyZWF0ZWQgYW5kIHNlbGVjdGVkIGF0IGluZGV4IDIsIHRoZW4gdGhlIHRhYiBib2R5IHdvdWxkIGhhdmUgYW5cbiAqIG9yaWdpbiBvZiByaWdodCBiZWNhdXNlIGl0cyBpbmRleCB3YXMgZ3JlYXRlciB0aGFuIHRoZSBwcmlvciBzZWxlY3RlZCBpbmRleC5cbiAqL1xuZXhwb3J0IHR5cGUgTWF0VGFiQm9keU9yaWdpblN0YXRlID0gJ2xlZnQnIHwgJ3JpZ2h0JztcblxuLyoqXG4gKiBUaGUgcG9ydGFsIGhvc3QgZGlyZWN0aXZlIGZvciB0aGUgY29udGVudHMgb2YgdGhlIHRhYi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRhYkJvZHlIb3N0XSdcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiQm9keVBvcnRhbCBleHRlbmRzIENka1BvcnRhbE91dGxldCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGJlZ2lucyBjZW50ZXJpbmcuICovXG4gIHByaXZhdGUgX2NlbnRlcmluZ1N1YiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBldmVudHMgZm9yIHdoZW4gdGhlIHRhYiBib2R5IGZpbmlzaGVzIGxlYXZpbmcgZnJvbSBjZW50ZXIgcG9zaXRpb24uICovXG4gIHByaXZhdGUgX2xlYXZpbmdTdWIgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTWF0VGFiQm9keSkpIHByaXZhdGUgX2hvc3Q6IE1hdFRhYkJvZHksXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9kb2N1bWVudGAgcGFyYW1ldGVyIHRvIGJlIG1hZGUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSA5LjAuMFxuICAgICAqL1xuICAgIEBJbmplY3QoRE9DVU1FTlQpIF9kb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgdmlld0NvbnRhaW5lclJlZiwgX2RvY3VtZW50KTtcbiAgfVxuXG4gIC8qKiBTZXQgaW5pdGlhbCB2aXNpYmlsaXR5IG9yIHNldCB1cCBzdWJzY3JpcHRpb24gZm9yIGNoYW5naW5nIHZpc2liaWxpdHkuICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLl9jZW50ZXJpbmdTdWIgPSB0aGlzLl9ob3N0Ll9iZWZvcmVDZW50ZXJpbmdcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9ob3N0Ll9pc0NlbnRlclBvc2l0aW9uKHRoaXMuX2hvc3QuX3Bvc2l0aW9uKSkpXG4gICAgICAuc3Vic2NyaWJlKChpc0NlbnRlcmluZzogYm9vbGVhbikgPT4ge1xuICAgICAgICBpZiAoaXNDZW50ZXJpbmcgJiYgIXRoaXMuaGFzQXR0YWNoZWQoKSkge1xuICAgICAgICAgIHRoaXMuYXR0YWNoKHRoaXMuX2hvc3QuX2NvbnRlbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2xlYXZpbmdTdWIgPSB0aGlzLl9ob3N0Ll9hZnRlckxlYXZpbmdDZW50ZXIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2xlYW4gdXAgY2VudGVyaW5nIHN1YnNjcmlwdGlvbi4gKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9jZW50ZXJpbmdTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9sZWF2aW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0VGFiQm9keWAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNlbGVjdG9yIGNhbiBiZSByZW1vdmVkIHdoZW4gd2UgdXBkYXRlIHRvIEFuZ3VsYXIgOS4wLlxuICBzZWxlY3RvcjogJ2RvLW5vdC11c2UtYWJzdHJhY3QtbWF0LXRhYi1ib2R5LWJhc2UnXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0VGFiQm9keUJhc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBDdXJyZW50IHBvc2l0aW9uIG9mIHRoZSB0YWItYm9keSBpbiB0aGUgdGFiLWdyb3VwLiBaZXJvIG1lYW5zIHRoYXQgdGhlIHRhYiBpcyB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9wb3NpdGlvbkluZGV4OiBudW1iZXI7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byB0aGUgZGlyZWN0aW9uYWxpdHkgY2hhbmdlIG9ic2VydmFibGUuICovXG4gIHByaXZhdGUgX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogVGFiIGJvZHkgcG9zaXRpb24gc3RhdGUuIFVzZWQgYnkgdGhlIGFuaW1hdGlvbiB0cmlnZ2VyIGZvciB0aGUgY3VycmVudCBzdGF0ZS4gKi9cbiAgX3Bvc2l0aW9uOiBNYXRUYWJCb2R5UG9zaXRpb25TdGF0ZTtcblxuICAvKiogRW1pdHMgd2hlbiBhbiBhbmltYXRpb24gb24gdGhlIHRhYiBpcyBjb21wbGV0ZS4gKi9cbiAgX3RyYW5zbGF0ZVRhYkNvbXBsZXRlID0gbmV3IFN1YmplY3Q8QW5pbWF0aW9uRXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdGFiIGJlZ2lucyB0byBhbmltYXRlIHRvd2FyZHMgdGhlIGNlbnRlciBhcyB0aGUgYWN0aXZlIHRhYi4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF9vbkNlbnRlcmluZzogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCBiZWZvcmUgdGhlIGNlbnRlcmluZyBvZiB0aGUgdGFiIGJlZ2lucy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF9iZWZvcmVDZW50ZXJpbmc6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCBiZWZvcmUgdGhlIGNlbnRlcmluZyBvZiB0aGUgdGFiIGJlZ2lucy4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IF9hZnRlckxlYXZpbmdDZW50ZXI6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0YWIgY29tcGxldGVzIGl0cyBhbmltYXRpb24gdG93YXJkcyB0aGUgY2VudGVyLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgX29uQ2VudGVyZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4odHJ1ZSk7XG5cbiAgIC8qKiBUaGUgcG9ydGFsIGhvc3QgaW5zaWRlIG9mIHRoaXMgY29udGFpbmVyIGludG8gd2hpY2ggdGhlIHRhYiBib2R5IGNvbnRlbnQgd2lsbCBiZSBsb2FkZWQuICovXG4gIGFic3RyYWN0IF9wb3J0YWxIb3N0OiBQb3J0YWxIb3N0RGlyZWN0aXZlO1xuXG4gIC8qKiBUaGUgdGFiIGJvZHkgY29udGVudCB0byBkaXNwbGF5LiAqL1xuICBASW5wdXQoJ2NvbnRlbnQnKSBfY29udGVudDogVGVtcGxhdGVQb3J0YWw7XG5cbiAgLyoqIFBvc2l0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHdoZW4gdGhlIHRhYiBpcyBpbW1lZGlhdGVseSBiZWNvbWluZyB2aXNpYmxlIGFmdGVyIGNyZWF0aW9uLiAqL1xuICBASW5wdXQoKSBvcmlnaW46IG51bWJlciB8IG51bGw7XG5cbiAgLy8gTm90ZSB0aGF0IHRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYWx3YXlzIGJlIG92ZXJ3cml0dGVuIGJ5IGBNYXRUYWJCb2R5YCwgYnV0IHdlIG5lZWQgb25lXG4gIC8vIGFueXdheSB0byBwcmV2ZW50IHRoZSBhbmltYXRpb25zIG1vZHVsZSBmcm9tIHRocm93aW5nIGFuIGVycm9yIGlmIHRoZSBib2R5IGlzIHVzZWQgb24gaXRzIG93bi5cbiAgLyoqIER1cmF0aW9uIGZvciB0aGUgdGFiJ3MgYW5pbWF0aW9uLiAqL1xuICBASW5wdXQoKSBhbmltYXRpb25EdXJhdGlvbjogc3RyaW5nID0gJzUwMG1zJztcblxuICAvKiogVGhlIHNoaWZ0ZWQgaW5kZXggcG9zaXRpb24gb2YgdGhlIHRhYiBib2R5LCB3aGVyZSB6ZXJvIHJlcHJlc2VudHMgdGhlIGFjdGl2ZSBjZW50ZXIgdGFiLiAqL1xuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IG51bWJlcikge1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXggPSBwb3NpdGlvbjtcbiAgICB0aGlzLl9jb21wdXRlUG9zaXRpb25BbmltYXRpb25TdGF0ZSgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuXG4gICAgaWYgKF9kaXIpIHtcbiAgICAgIHRoaXMuX2RpckNoYW5nZVN1YnNjcmlwdGlvbiA9IF9kaXIuY2hhbmdlLnN1YnNjcmliZSgoZGlyOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgICAgdGhpcy5fY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoZGlyKTtcbiAgICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB3ZSBnZXQgdW5pcXVlIGFuaW1hdGlvbiBldmVudHMsIGJlY2F1c2UgdGhlIGAuZG9uZWAgY2FsbGJhY2sgY2FuIGdldFxuICAgIC8vIGludm9rZWQgdHdpY2UgaW4gc29tZSBicm93c2Vycy4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzI0MDg0LlxuICAgIHRoaXMuX3RyYW5zbGF0ZVRhYkNvbXBsZXRlLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IHtcbiAgICAgIHJldHVybiB4LmZyb21TdGF0ZSA9PT0geS5mcm9tU3RhdGUgJiYgeC50b1N0YXRlID09PSB5LnRvU3RhdGU7XG4gICAgfSkpLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICAvLyBJZiB0aGUgdHJhbnNpdGlvbiB0byB0aGUgY2VudGVyIGlzIGNvbXBsZXRlLCBlbWl0IGFuIGV2ZW50LlxuICAgICAgaWYgKHRoaXMuX2lzQ2VudGVyUG9zaXRpb24oZXZlbnQudG9TdGF0ZSkgJiYgdGhpcy5faXNDZW50ZXJQb3NpdGlvbih0aGlzLl9wb3NpdGlvbikpIHtcbiAgICAgICAgdGhpcy5fb25DZW50ZXJlZC5lbWl0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pc0NlbnRlclBvc2l0aW9uKGV2ZW50LmZyb21TdGF0ZSkgJiYgIXRoaXMuX2lzQ2VudGVyUG9zaXRpb24odGhpcy5fcG9zaXRpb24pKSB7XG4gICAgICAgIHRoaXMuX2FmdGVyTGVhdmluZ0NlbnRlci5lbWl0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgaW5pdGlhbGl6ZWQsIGNoZWNrIGlmIHRoZSBjb250ZW50IGlzIGNlbnRlcmVkIGFuZCBoYXMgYW4gb3JpZ2luLiBJZiBzbywgc2V0IHRoZVxuICAgKiBzcGVjaWFsIHBvc2l0aW9uIHN0YXRlcyB0aGF0IHRyYW5zaXRpb24gdGhlIHRhYiBmcm9tIHRoZSBsZWZ0IG9yIHJpZ2h0IGJlZm9yZSBjZW50ZXJpbmcuXG4gICAqL1xuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcG9zaXRpb24gPT0gJ2NlbnRlcicgJiYgdGhpcy5vcmlnaW4gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSB0aGlzLl9jb21wdXRlUG9zaXRpb25Gcm9tT3JpZ2luKHRoaXMub3JpZ2luKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kaXJDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl90cmFuc2xhdGVUYWJDb21wbGV0ZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgX29uVHJhbnNsYXRlVGFiU3RhcnRlZChldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBpc0NlbnRlcmluZyA9IHRoaXMuX2lzQ2VudGVyUG9zaXRpb24oZXZlbnQudG9TdGF0ZSk7XG4gICAgdGhpcy5fYmVmb3JlQ2VudGVyaW5nLmVtaXQoaXNDZW50ZXJpbmcpO1xuICAgIGlmIChpc0NlbnRlcmluZykge1xuICAgICAgdGhpcy5fb25DZW50ZXJpbmcuZW1pdCh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKiogVGhlIHRleHQgZGlyZWN0aW9uIG9mIHRoZSBjb250YWluaW5nIGFwcC4gKi9cbiAgX2dldExheW91dERpcmVjdGlvbigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcHJvdmlkZWQgcG9zaXRpb24gc3RhdGUgaXMgY29uc2lkZXJlZCBjZW50ZXIsIHJlZ2FyZGxlc3Mgb2Ygb3JpZ2luLiAqL1xuICBfaXNDZW50ZXJQb3NpdGlvbihwb3NpdGlvbjogTWF0VGFiQm9keVBvc2l0aW9uU3RhdGV8c3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBvc2l0aW9uID09ICdjZW50ZXInIHx8XG4gICAgICAgIHBvc2l0aW9uID09ICdsZWZ0LW9yaWdpbi1jZW50ZXInIHx8XG4gICAgICAgIHBvc2l0aW9uID09ICdyaWdodC1vcmlnaW4tY2VudGVyJztcbiAgfVxuXG4gIC8qKiBDb21wdXRlcyB0aGUgcG9zaXRpb24gc3RhdGUgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0YWItYm9keSBhbmltYXRpb24gdHJpZ2dlci4gKi9cbiAgcHJpdmF0ZSBfY29tcHV0ZVBvc2l0aW9uQW5pbWF0aW9uU3RhdGUoZGlyOiBEaXJlY3Rpb24gPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSkge1xuICAgIGlmICh0aGlzLl9wb3NpdGlvbkluZGV4IDwgMCkge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSBkaXIgPT0gJ2x0cicgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fcG9zaXRpb25JbmRleCA+IDApIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uID0gZGlyID09ICdsdHInID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcG9zaXRpb24gPSAnY2VudGVyJztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgdGhlIHBvc2l0aW9uIHN0YXRlIGJhc2VkIG9uIHRoZSBzcGVjaWZpZWQgb3JpZ2luIHBvc2l0aW9uLiBUaGlzIGlzIHVzZWQgaWYgdGhlXG4gICAqIHRhYiBpcyBiZWNvbWluZyB2aXNpYmxlIGltbWVkaWF0ZWx5IGFmdGVyIGNyZWF0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcHV0ZVBvc2l0aW9uRnJvbU9yaWdpbihvcmlnaW46IG51bWJlcik6IE1hdFRhYkJvZHlQb3NpdGlvblN0YXRlIHtcbiAgICBjb25zdCBkaXIgPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKTtcblxuICAgIGlmICgoZGlyID09ICdsdHInICYmIG9yaWdpbiA8PSAwKSB8fCAoZGlyID09ICdydGwnICYmIG9yaWdpbiA+IDApKSB7XG4gICAgICByZXR1cm4gJ2xlZnQtb3JpZ2luLWNlbnRlcic7XG4gICAgfVxuXG4gICAgcmV0dXJuICdyaWdodC1vcmlnaW4tY2VudGVyJztcbiAgfVxufVxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBjb250ZW50cyBvZiBhIHRhYi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYi1ib2R5JyxcbiAgdGVtcGxhdGVVcmw6ICd0YWItYm9keS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1ib2R5LmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFsaWRhdGUtZGVjb3JhdG9yc1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGFuaW1hdGlvbnM6IFttYXRUYWJzQW5pbWF0aW9ucy50cmFuc2xhdGVUYWJdLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItYm9keScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFiQm9keSBleHRlbmRzIF9NYXRUYWJCb2R5QmFzZSB7XG4gIEBWaWV3Q2hpbGQoUG9ydGFsSG9zdERpcmVjdGl2ZSkgX3BvcnRhbEhvc3Q6IFBvcnRhbEhvc3REaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIGRpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgICAgICAgICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRpciwgY2hhbmdlRGV0ZWN0b3JSZWYpO1xuICB9XG59XG4iXX0=