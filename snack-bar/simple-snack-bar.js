var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
export var SimpleSnackBar = (function () {
    function SimpleSnackBar() {
    }
    /** Dismisses the snack bar. */
    SimpleSnackBar.prototype.dismiss = function () {
        this.snackBarRef._action();
    };
    Object.defineProperty(SimpleSnackBar.prototype, "hasAction", {
        /** If the action button should be shown. */
        get: function () { return !!this.action; },
        enumerable: true,
        configurable: true
    });
    SimpleSnackBar = __decorate([
        Component({selector: 'simple-snack-bar',
            template: "<span class=\"md-simple-snackbar-message\">{{message}}</span> <button md-button class=\"md-simple-snackbar-action\" *ngIf=\"hasAction\" (click)=\"dismiss()\">{{action}}</button>",
            styles: ["md-simple-snackbar{display:flex;justify-content:space-between}.md-simple-snackbar-message{box-sizing:border-box;border:none;color:#fff;font-family:Roboto,'Helvetica Neue',sans-serif;font-size:14px;line-height:20px;outline:0;text-decoration:none;word-break:break-all}.md-simple-snackbar-action{box-sizing:border-box;color:#fff;float:right;font-weight:600;line-height:20px;margin:-5px 0 0 48px;min-width:initial;padding:5px;text-transform:uppercase}"],
        }), 
        __metadata('design:paramtypes', [])
    ], SimpleSnackBar);
    return SimpleSnackBar;
}());

//# sourceMappingURL=simple-snack-bar.js.map
