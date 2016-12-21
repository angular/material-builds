var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ViewChild, Component, Input, Output, EventEmitter, trigger, state, style, animate, transition, ElementRef, Optional } from '@angular/core';
import { TemplatePortal, PortalHostDirective, Dir } from '../core';
import 'rxjs/add/operator/map';
/**
 * Wrapper for the contents of a tab.
 */
export var MdTabBody = (function () {
    function MdTabBody(_elementRef, _dir) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /** Event emitted when the tab begins to animate towards the center as the active tab. */
        this.onCentering = new EventEmitter();
        /** Event emitted when the tab completes its animation towards the center. */
        this.onCentered = new EventEmitter(true);
    }
    Object.defineProperty(MdTabBody.prototype, "position", {
        set: function (position) {
            if (position < 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'left' : 'right';
            }
            else if (position > 0) {
                this._position = this._getLayoutDirection() == 'ltr' ? 'right' : 'left';
            }
            else {
                this._position = 'center';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabBody.prototype, "origin", {
        /** The origin position from which this tab should appear when it is centered into view. */
        set: function (origin) {
            if (origin == null) {
                return;
            }
            var dir = this._getLayoutDirection();
            if ((dir == 'ltr' && origin <= 0) || (dir == 'rtl' && origin > 0)) {
                this._origin = 'left';
            }
            else {
                this._origin = 'right';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After initialized, check if the content is centered and has an origin. If so, set the
     * special position states that transition the tab from the left or right before centering.
     */
    MdTabBody.prototype.ngOnInit = function () {
        if (this._position == 'center' && this._origin) {
            this._position = this._origin == 'left' ? 'left-origin-center' : 'right-origin-center';
        }
    };
    /**
     * After the view has been set, check if the tab content is set to the center and attach the
     * content if it is not already attached.
     */
    MdTabBody.prototype.ngAfterViewChecked = function () {
        if (this._isCenterPosition(this._position) && !this._portalHost.hasAttached()) {
            this._portalHost.attach(this._content);
        }
    };
    MdTabBody.prototype._onTranslateTabStarted = function (e) {
        if (this._isCenterPosition(e.toState)) {
            this.onCentering.emit(this._elementRef.nativeElement.clientHeight);
        }
    };
    MdTabBody.prototype._onTranslateTabComplete = function (e) {
        // If the end state is that the tab is not centered, then detach the content.
        if (!this._isCenterPosition(e.toState) && !this._isCenterPosition(this._position)) {
            this._portalHost.detach();
        }
        // If the transition to the center is complete, emit an event.
        if (this._isCenterPosition(e.toState) && this._isCenterPosition(this._position)) {
            this.onCentered.emit();
        }
    };
    /** The text direction of the containing app. */
    MdTabBody.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /** Whether the provided position state is considered center, regardless of origin. */
    MdTabBody.prototype._isCenterPosition = function (position) {
        return position == 'center' ||
            position == 'left-origin-center' ||
            position == 'right-origin-center';
    };
    __decorate([
        ViewChild(PortalHostDirective), 
        __metadata('design:type', PortalHostDirective)
    ], MdTabBody.prototype, "_portalHost", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], MdTabBody.prototype, "onCentering", void 0);
    __decorate([
        Output(), 
        __metadata('design:type', EventEmitter)
    ], MdTabBody.prototype, "onCentered", void 0);
    __decorate([
        Input('content'), 
        __metadata('design:type', TemplatePortal)
    ], MdTabBody.prototype, "_content", void 0);
    __decorate([
        Input('position'), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], MdTabBody.prototype, "position", null);
    __decorate([
        Input('origin'), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], MdTabBody.prototype, "origin", null);
    MdTabBody = __decorate([
        Component({selector: 'md-tab-body',
            template: "<div class=\"md-tab-body-content\" #content [@translateTab]=\"_position\" (@translateTab.start)=\"_onTranslateTabStarted($event)\" (@translateTab.done)=\"_onTranslateTabComplete($event)\"><template cdkPortalHost></template></div>",
            animations: [
                trigger('translateTab', [
                    state('left', style({ transform: 'translate3d(-100%, 0, 0)' })),
                    state('left-origin-center', style({ transform: 'translate3d(0, 0, 0)' })),
                    state('right-origin-center', style({ transform: 'translate3d(0, 0, 0)' })),
                    state('center', style({ transform: 'translate3d(0, 0, 0)' })),
                    state('right', style({ transform: 'translate3d(100%, 0, 0)' })),
                    transition('* => left, * => right, left => center, right => center', animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
                    transition('void => left-origin-center', [
                        style({ transform: 'translate3d(-100%, 0, 0)' }),
                        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                    ]),
                    transition('void => right-origin-center', [
                        style({ transform: 'translate3d(100%, 0, 0)' }),
                        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                    ])
                ])
            ]
        }),
        __param(1, Optional()), 
        __metadata('design:paramtypes', [ElementRef, Dir])
    ], MdTabBody);
    return MdTabBody;
}());

//# sourceMappingURL=tab-body.js.map
