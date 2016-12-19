var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, trigger, state, style, transition, animate, NgZone } from '@angular/core';
import { BasePortalHost, PortalHostDirective } from '../core';
import { MdSnackBarContentAlreadyAttached } from './snack-bar-errors';
import { Subject } from 'rxjs/Subject';
// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
export var SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
export var HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';
/**
 * Internal component that wraps user-provided snack bar content.
 */
export var MdSnackBarContainer = (function (_super) {
    __extends(MdSnackBarContainer, _super);
    function MdSnackBarContainer(_ngZone) {
        _super.call(this);
        this._ngZone = _ngZone;
        /** Subject for notifying that the snack bar has exited from view. */
        this.onExit = new Subject();
        /** Subject for notifying that the snack bar has finished entering the view. */
        this.onEnter = new Subject();
        /** The state of the snack bar animations. */
        this.animationState = 'initial';
    }
    /** Attach a component portal as content to this snack bar container. */
    MdSnackBarContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throw new MdSnackBarContentAlreadyAttached();
        }
        return this._portalHost.attachComponentPortal(portal);
    };
    /** Attach a template portal as content to this snack bar container. */
    MdSnackBarContainer.prototype.attachTemplatePortal = function (portal) {
        throw Error('Not yet implemented');
    };
    /** Handle end of animations, updating the state of the snackbar. */
    MdSnackBarContainer.prototype.onAnimationEnd = function (event) {
        var _this = this;
        if (event.toState === 'void' || event.toState === 'complete') {
            this._ngZone.run(function () {
                _this.onExit.next();
                _this.onExit.complete();
            });
        }
        if (event.toState === 'visible') {
            this._ngZone.run(function () {
                _this.onEnter.next();
                _this.onEnter.complete();
            });
        }
    };
    /** Begin animation of snack bar entrance into view. */
    MdSnackBarContainer.prototype.enter = function () {
        this.animationState = 'visible';
    };
    /** Returns an observable resolving when the enter animation completes.  */
    MdSnackBarContainer.prototype._onEnter = function () {
        this.animationState = 'visible';
        return this.onEnter.asObservable();
    };
    /** Begin animation of the snack bar exiting from view. */
    MdSnackBarContainer.prototype.exit = function () {
        this.animationState = 'complete';
        return this._onExit();
    };
    /** Returns an observable that completes after the closing animation is done. */
    MdSnackBarContainer.prototype._onExit = function () {
        return this.onExit.asObservable();
    };
    /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
    MdSnackBarContainer.prototype.ngOnDestroy = function () {
        var _this = this;
        // Wait for the zone to settle before removing the element. Helps prevent
        // errors where we end up removing an element which is in the middle of an animation.
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this.onExit.next();
            _this.onExit.complete();
        });
    };
    __decorate([
        ViewChild(PortalHostDirective), 
        __metadata('design:type', PortalHostDirective)
    ], MdSnackBarContainer.prototype, "_portalHost", void 0);
    MdSnackBarContainer = __decorate([
        Component({selector: 'snack-bar-container',
            template: "<template portalhost></template>",
            styles: [":host{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);background:#323232;border-radius:2px;box-sizing:content-box;display:block;height:20px;max-width:568px;min-width:288px;overflow:hidden;padding:14px 24px;transform:translateY(100%)}@media screen and (-ms-high-contrast:active){:host{border:1px solid}}"],
            host: {
                'role': 'alert',
                '[@state]': 'animationState',
                '(@state.done)': 'onAnimationEnd($event)'
            },
            animations: [
                trigger('state', [
                    state('initial', style({ transform: 'translateY(100%)' })),
                    state('visible', style({ transform: 'translateY(0%)' })),
                    state('complete', style({ transform: 'translateY(100%)' })),
                    transition('visible => complete', animate(HIDE_ANIMATION)),
                    transition('initial => visible, void => visible', animate(SHOW_ANIMATION)),
                ])
            ],
        }), 
        __metadata('design:paramtypes', [NgZone])
    ], MdSnackBarContainer);
    return MdSnackBarContainer;
}(BasePortalHost));

//# sourceMappingURL=snack-bar-container.js.map
