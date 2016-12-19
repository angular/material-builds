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
import { Component, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { BasePortalHost, PortalHostDirective } from '../core';
import { MdDialogContentAlreadyAttachedError } from './dialog-errors';
import { FocusTrap } from '../core/a11y/focus-trap';
import 'rxjs/add/operator/first';
/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
export var MdDialogContainer = (function (_super) {
    __extends(MdDialogContainer, _super);
    function MdDialogContainer(_ngZone) {
        _super.call(this);
        this._ngZone = _ngZone;
        /** Element that was focused before the dialog was opened. Save this to restore upon close. */
        this._elementFocusedBeforeDialogWasOpened = null;
    }
    /** Attach a portal as content to this dialog container. */
    MdDialogContainer.prototype.attachComponentPortal = function (portal) {
        var _this = this;
        if (this._portalHost.hasAttached()) {
            throw new MdDialogContentAlreadyAttachedError();
        }
        var attachResult = this._portalHost.attachComponentPortal(portal);
        // If were to attempt to focus immediately, then the content of the dialog would not yet be
        // ready in instances where change detection has to run first. To deal with this, we simply
        // wait for the microtask queue to be empty.
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this._elementFocusedBeforeDialogWasOpened = document.activeElement;
            _this._focusTrap.focusFirstTabbableElement();
        });
        return attachResult;
    };
    MdDialogContainer.prototype.attachTemplatePortal = function (portal) {
        throw Error('Not yet implemented');
    };
    /** Handles the user pressing the Escape key. */
    MdDialogContainer.prototype.handleEscapeKey = function () {
        if (!this.dialogConfig.disableClose) {
            this.dialogRef.close();
        }
    };
    MdDialogContainer.prototype.ngOnDestroy = function () {
        var _this = this;
        // When the dialog is destroyed, return focus to the element that originally had it before
        // the dialog was opened. Wait for the DOM to finish settling before changing the focus so
        // that it doesn't end up back on the <body>.
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this._elementFocusedBeforeDialogWasOpened.focus();
        });
    };
    __decorate([
        ViewChild(PortalHostDirective), 
        __metadata('design:type', PortalHostDirective)
    ], MdDialogContainer.prototype, "_portalHost", void 0);
    __decorate([
        ViewChild(FocusTrap), 
        __metadata('design:type', FocusTrap)
    ], MdDialogContainer.prototype, "_focusTrap", void 0);
    MdDialogContainer = __decorate([
        Component({selector: 'md-dialog-container, mat-dialog-container',
            template: "<focus-trap><template portalhost></template></focus-trap>",
            styles: ["md-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;width:100%;height:100%}@media screen and (-ms-high-contrast:active){md-dialog-container{outline:solid 1px}}[mat-dialog-content],[md-dialog-content],mat-dialog-content,md-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto}[mat-dialog-title],[md-dialog-title]{font-size:20px;font-weight:700;margin:0 0 20px;display:block}[mat-dialog-actions],[md-dialog-actions],mat-dialog-actions,md-dialog-actions{padding:12px 0;display:block}[mat-dialog-actions]:last-child,[md-dialog-actions]:last-child,mat-dialog-actions:last-child,md-dialog-actions:last-child{margin-bottom:-24px}"],
            host: {
                'class': 'md-dialog-container',
                '[attr.role]': 'dialogConfig?.role',
                '(keydown.escape)': 'handleEscapeKey()',
            },
            encapsulation: ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [NgZone])
    ], MdDialogContainer);
    return MdDialogContainer;
}(BasePortalHost));

//# sourceMappingURL=dialog-container.js.map
