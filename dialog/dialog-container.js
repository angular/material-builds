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
import { Component, ViewChild, ViewEncapsulation, NgZone, Renderer, ElementRef, animate, state, style, transition, trigger, EventEmitter } from '@angular/core';
import { BasePortalHost, PortalHostDirective } from '../core';
import { MdDialogContentAlreadyAttachedError } from './dialog-errors';
import { FocusTrapFactory } from '../core/a11y/focus-trap';
import 'rxjs/add/operator/first';
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export var MdDialogContainer = (function (_super) {
    __extends(MdDialogContainer, _super);
    function MdDialogContainer(_ngZone, _renderer, _elementRef, _focusTrapFactory) {
        _super.call(this);
        this._ngZone = _ngZone;
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        /** Element that was focused before the dialog was opened. Save this to restore upon close. */
        this._elementFocusedBeforeDialogWasOpened = null;
        /** State of the dialog animation. */
        this._state = 'enter';
        /** Emits the current animation state whenever it changes. */
        this._onAnimationStateChange = new EventEmitter();
    }
    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    MdDialogContainer.prototype.attachComponentPortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throw new MdDialogContentAlreadyAttachedError();
        }
        var attachResult = this._portalHost.attachComponentPortal(portal);
        this._trapFocus();
        return attachResult;
    };
    /**
     * Attach a TemplatePortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    MdDialogContainer.prototype.attachTemplatePortal = function (portal) {
        if (this._portalHost.hasAttached()) {
            throw new MdDialogContentAlreadyAttachedError();
        }
        var attachedResult = this._portalHost.attachTemplatePortal(portal);
        this._trapFocus();
        return attachedResult;
    };
    /**
     * Moves the focus inside the focus trap.
     * @private
     */
    MdDialogContainer.prototype._trapFocus = function () {
        var _this = this;
        if (!this._focusTrap) {
            this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        }
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this._elementFocusedBeforeDialogWasOpened = document.activeElement;
            _this._focusTrap.focusFirstTabbableElement();
        });
    };
    /**
     * Kicks off the leave animation.
     * @docs-private
     */
    MdDialogContainer.prototype._exit = function () {
        this._state = 'exit';
        this._onAnimationStateChange.emit('exit-start');
    };
    /**
     * Callback, invoked whenever an animation on the host completes.
     * @docs-private
     */
    MdDialogContainer.prototype._onAnimationDone = function (event) {
        this._onAnimationStateChange.emit(event.toState);
    };
    MdDialogContainer.prototype.ngOnDestroy = function () {
        var _this = this;
        // When the dialog is destroyed, return focus to the element that originally had it before
        // the dialog was opened. Wait for the DOM to finish settling before changing the focus so
        // that it doesn't end up back on the <body>. Also note that we need the extra check, because
        // IE can set the `activeElement` to null in some cases.
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            var toFocus = _this._elementFocusedBeforeDialogWasOpened;
            // We need to check whether the focus method exists at all, because IE seems to throw an
            // exception, even if the element is the document.body.
            if (toFocus && 'focus' in toFocus) {
                toFocus.focus();
            }
            _this._onAnimationStateChange.complete();
        });
        this._focusTrap.destroy();
    };
    __decorate([
        ViewChild(PortalHostDirective), 
        __metadata('design:type', PortalHostDirective)
    ], MdDialogContainer.prototype, "_portalHost", void 0);
    MdDialogContainer = __decorate([
        Component({selector: 'md-dialog-container, mat-dialog-container',
            template: "<template cdkPortalHost></template>",
            styles: [".mat-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;width:100%;height:100%}@media screen and (-ms-high-contrast:active){.mat-dialog-container{outline:solid 1px}}.mat-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto}.mat-dialog-title{font-size:20px;font-weight:700;margin:0 0 20px;display:block}.mat-dialog-actions{padding:12px 0;display:flex}.mat-dialog-actions:last-child{margin-bottom:-24px}.mat-dialog-actions[align=end]{justify-content:flex-end}.mat-dialog-actions[align=center]{justify-content:center} /*# sourceMappingURL=dialog.css.map */ "],
            encapsulation: ViewEncapsulation.None,
            animations: [
                trigger('slideDialog', [
                    state('void', style({ transform: 'translateY(25%) scale(0.9)', opacity: 0 })),
                    state('enter', style({ transform: 'translateY(0%) scale(1)', opacity: 1 })),
                    state('exit', style({ transform: 'translateY(25%)', opacity: 0 })),
                    transition('* => *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
                ])
            ],
            host: {
                '[class.mat-dialog-container]': 'true',
                '[attr.role]': 'dialogConfig?.role',
                '[@slideDialog]': '_state',
                '(@slideDialog.done)': '_onAnimationDone($event)',
            },
        }), 
        __metadata('design:paramtypes', [NgZone, Renderer, ElementRef, FocusTrapFactory])
    ], MdDialogContainer);
    return MdDialogContainer;
}(BasePortalHost));
//# sourceMappingURL=dialog-container.js.map