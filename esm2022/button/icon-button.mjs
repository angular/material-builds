/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, Optional, ViewEncapsulation, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_ANCHOR_HOST, MAT_ANCHOR_INPUTS, MAT_BUTTON_HOST, MAT_BUTTON_INPUTS, MatAnchorBase, MatButtonBase, } from './button-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * Material Design icon button component. This type of button displays a single interactive icon for
 * users to perform an action.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
class MatIconButton extends MatButtonBase {
    /**
     * Reference to the MatRipple instance of the button.
     * @deprecated Considered an implementation detail. To be removed.
     * @breaking-change 17.0.0
     */
    get ripple() {
        if (!this._ripple && this._rippleLoader) {
            this._ripple = this._rippleLoader._createMatRipple(this._elementRef.nativeElement);
            this._ripple.centered = true;
        }
        return this._ripple;
    }
    constructor(elementRef, platform, ngZone, animationMode) {
        super(elementRef, platform, ngZone, animationMode);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatIconButton, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i0.NgZone }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatIconButton, selector: "button[mat-icon-button]", inputs: { disabled: "disabled", disableRipple: "disableRipple", color: "color" }, host: { attributes: { "mat-button-ripple-uninitialized": "" }, properties: { "attr.disabled": "disabled || null", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "class.mat-unthemed": "!color", "class.mat-mdc-button-base": "true", "attr.mat-button-disabled": "_isRippleDisabled()", "attr.mat-button-is-fab": "_isFab" } }, exportAs: ["matButton"], usesInheritance: true, ngImport: i0, template: "<span class=\"mat-mdc-button-persistent-ripple mdc-icon-button__ripple\"></span>\n\n<ng-content></ng-content>\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-mdc-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n", styles: [".mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block}}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button[hidden]{display:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%;display:none}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring{border-color:CanvasText}}.mdc-icon-button__focus-ring::after{content:\"\";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mat-mdc-icon-button{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size);color:var(--mdc-icon-button-icon-color);--mdc-icon-button-state-layer-size:48px;--mdc-icon-button-icon-size:24px;--mdc-icon-button-disabled-icon-color:black;--mdc-icon-button-disabled-icon-opacity:0.38}.mat-mdc-icon-button .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button svg,.mat-mdc-icon-button img{width:var(--mdc-icon-button-icon-size);height:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button:disabled{opacity:var(--mdc-icon-button-disabled-icon-opacity)}.mat-mdc-icon-button:disabled{color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button{padding:12px;font-size:var(--mdc-icon-button-icon-size);border-radius:50%;flex-shrink:0;text-align:center;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button svg{vertical-align:baseline}.mat-mdc-icon-button[disabled]{cursor:default;pointer-events:none;opacity:1}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:\"\";opacity:0;background-color:var(--mat-mdc-button-persistent-ripple-color)}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-mdc-button-ripple-color)}.mat-mdc-icon-button .mdc-button__label{z-index:1}.mat-mdc-icon-button .mat-mdc-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-icon-button:focus .mat-mdc-focus-indicator::before{content:\"\"}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:50%}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}", ".cdk-high-contrast-active .mat-mdc-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-unelevated-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-raised-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-outlined-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-icon-button{outline:solid 1px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatIconButton };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatIconButton, decorators: [{
            type: Component,
            args: [{ selector: `button[mat-icon-button]`, inputs: MAT_BUTTON_INPUTS, host: MAT_BUTTON_HOST, exportAs: 'matButton', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<span class=\"mat-mdc-button-persistent-ripple mdc-icon-button__ripple\"></span>\n\n<ng-content></ng-content>\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-mdc-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n", styles: [".mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block}}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button[hidden]{display:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%;display:none}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring{border-color:CanvasText}}.mdc-icon-button__focus-ring::after{content:\"\";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mat-mdc-icon-button{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size);color:var(--mdc-icon-button-icon-color);--mdc-icon-button-state-layer-size:48px;--mdc-icon-button-icon-size:24px;--mdc-icon-button-disabled-icon-color:black;--mdc-icon-button-disabled-icon-opacity:0.38}.mat-mdc-icon-button .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button svg,.mat-mdc-icon-button img{width:var(--mdc-icon-button-icon-size);height:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button:disabled{opacity:var(--mdc-icon-button-disabled-icon-opacity)}.mat-mdc-icon-button:disabled{color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button{padding:12px;font-size:var(--mdc-icon-button-icon-size);border-radius:50%;flex-shrink:0;text-align:center;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button svg{vertical-align:baseline}.mat-mdc-icon-button[disabled]{cursor:default;pointer-events:none;opacity:1}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:\"\";opacity:0;background-color:var(--mat-mdc-button-persistent-ripple-color)}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-mdc-button-ripple-color)}.mat-mdc-icon-button .mdc-button__label{z-index:1}.mat-mdc-icon-button .mat-mdc-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-icon-button:focus .mat-mdc-focus-indicator::before{content:\"\"}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:50%}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}", ".cdk-high-contrast-active .mat-mdc-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-unelevated-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-raised-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-outlined-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-icon-button{outline:solid 1px}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
/**
 * Material Design icon button component for anchor elements. This button displays a single
 * interaction icon that allows users to navigate across different routes or pages.
 * See https://material.io/develop/web/components/buttons/icon-buttons/
 */
class MatIconAnchor extends MatAnchorBase {
    constructor(elementRef, platform, ngZone, animationMode) {
        super(elementRef, platform, ngZone, animationMode);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatIconAnchor, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: i0.NgZone }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-rc.2", type: MatIconAnchor, selector: "a[mat-icon-button]", inputs: { disabled: "disabled", disableRipple: "disableRipple", color: "color", tabIndex: "tabIndex" }, host: { attributes: { "mat-button-ripple-uninitialized": "" }, properties: { "attr.disabled": "disabled || null", "class._mat-animation-noopable": "_animationMode === \"NoopAnimations\"", "attr.tabindex": "disabled ? -1 : tabIndex", "attr.aria-disabled": "disabled.toString()", "class.mat-unthemed": "!color", "class.mat-mdc-button-base": "true", "attr.mat-button-disabled": "_isRippleDisabled()", "attr.mat-button-is-fab": "_isFab" } }, exportAs: ["matButton", "matAnchor"], usesInheritance: true, ngImport: i0, template: "<span\n    class=\"mat-mdc-button-persistent-ripple\"\n    [class.mdc-button__ripple]=\"!_isFab\"\n    [class.mdc-fab__ripple]=\"_isFab\"></span>\n\n<ng-content select=\".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])\">\n</ng-content>\n\n<span class=\"mdc-button__label\"><ng-content></ng-content></span>\n\n<ng-content select=\".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]\">\n</ng-content>\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-mdc-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n", styles: [".mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block}}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button[hidden]{display:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%;display:none}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring{border-color:CanvasText}}.mdc-icon-button__focus-ring::after{content:\"\";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mat-mdc-icon-button{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size);color:var(--mdc-icon-button-icon-color);--mdc-icon-button-state-layer-size:48px;--mdc-icon-button-icon-size:24px;--mdc-icon-button-disabled-icon-color:black;--mdc-icon-button-disabled-icon-opacity:0.38}.mat-mdc-icon-button .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button svg,.mat-mdc-icon-button img{width:var(--mdc-icon-button-icon-size);height:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button:disabled{opacity:var(--mdc-icon-button-disabled-icon-opacity)}.mat-mdc-icon-button:disabled{color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button{padding:12px;font-size:var(--mdc-icon-button-icon-size);border-radius:50%;flex-shrink:0;text-align:center;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button svg{vertical-align:baseline}.mat-mdc-icon-button[disabled]{cursor:default;pointer-events:none;opacity:1}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:\"\";opacity:0;background-color:var(--mat-mdc-button-persistent-ripple-color)}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-mdc-button-ripple-color)}.mat-mdc-icon-button .mdc-button__label{z-index:1}.mat-mdc-icon-button .mat-mdc-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-icon-button:focus .mat-mdc-focus-indicator::before{content:\"\"}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:50%}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}", ".cdk-high-contrast-active .mat-mdc-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-unelevated-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-raised-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-outlined-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-icon-button{outline:solid 1px}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatIconAnchor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2", ngImport: i0, type: MatIconAnchor, decorators: [{
            type: Component,
            args: [{ selector: `a[mat-icon-button]`, inputs: MAT_ANCHOR_INPUTS, host: MAT_ANCHOR_HOST, exportAs: 'matButton, matAnchor', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<span\n    class=\"mat-mdc-button-persistent-ripple\"\n    [class.mdc-button__ripple]=\"!_isFab\"\n    [class.mdc-fab__ripple]=\"_isFab\"></span>\n\n<ng-content select=\".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])\">\n</ng-content>\n\n<span class=\"mdc-button__label\"><ng-content></ng-content></span>\n\n<ng-content select=\".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]\">\n</ng-content>\n\n<!--\n  The indicator can't be directly on the button, because MDC uses ::before for high contrast\n  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.\n-->\n<span class=\"mat-mdc-focus-indicator\"></span>\n\n<span class=\"mat-mdc-button-touch-target\"></span>\n", styles: [".mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:rgba(0,0,0,0);fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block}}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button[hidden]{display:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__focus-ring{pointer-events:none;border:2px solid rgba(0,0,0,0);border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%;display:none}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring{border-color:CanvasText}}.mdc-icon-button__focus-ring::after{content:\"\";border:2px solid rgba(0,0,0,0);border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mat-mdc-icon-button{height:var(--mdc-icon-button-state-layer-size);width:var(--mdc-icon-button-state-layer-size);color:var(--mdc-icon-button-icon-color);--mdc-icon-button-state-layer-size:48px;--mdc-icon-button-icon-size:24px;--mdc-icon-button-disabled-icon-color:black;--mdc-icon-button-disabled-icon-opacity:0.38}.mat-mdc-icon-button .mdc-button__icon{font-size:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button svg,.mat-mdc-icon-button img{width:var(--mdc-icon-button-icon-size);height:var(--mdc-icon-button-icon-size)}.mat-mdc-icon-button:disabled{opacity:var(--mdc-icon-button-disabled-icon-opacity)}.mat-mdc-icon-button:disabled{color:var(--mdc-icon-button-disabled-icon-color)}.mat-mdc-icon-button{padding:12px;font-size:var(--mdc-icon-button-icon-size);border-radius:50%;flex-shrink:0;text-align:center;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-icon-button svg{vertical-align:baseline}.mat-mdc-icon-button[disabled]{cursor:default;pointer-events:none;opacity:1}.mat-mdc-icon-button .mat-mdc-button-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-icon-button .mat-mdc-button-ripple{overflow:hidden}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before{content:\"\";opacity:0;background-color:var(--mat-mdc-button-persistent-ripple-color)}.mat-mdc-icon-button .mat-ripple-element{background-color:var(--mat-mdc-button-ripple-color)}.mat-mdc-icon-button .mdc-button__label{z-index:1}.mat-mdc-icon-button .mat-mdc-focus-indicator{top:0;left:0;right:0;bottom:0;position:absolute}.mat-mdc-icon-button:focus .mat-mdc-focus-indicator::before{content:\"\"}.mat-mdc-icon-button .mat-mdc-button-touch-target{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mat-mdc-icon-button._mat-animation-noopable{transition:none !important;animation:none !important}.mat-mdc-icon-button .mat-mdc-button-persistent-ripple{border-radius:50%}.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before,.mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before{background:rgba(0,0,0,0);opacity:1}", ".cdk-high-contrast-active .mat-mdc-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-unelevated-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-raised-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-outlined-button:not(.mdc-button--outlined),.cdk-high-contrast-active .mat-mdc-icon-button{outline:solid 1px}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Platform }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYnV0dG9uL2ljb24tYnV0dG9uLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9pY29uLWJ1dHRvbi5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixNQUFNLEVBQ04sUUFBUSxFQUNSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUUzRSxPQUFPLEVBQ0wsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixlQUFlLEVBQ2YsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixhQUFhLEdBQ2QsTUFBTSxlQUFlLENBQUM7OztBQUd2Qjs7OztHQUlHO0FBQ0gsTUFVYSxhQUFjLFNBQVEsYUFBYTtJQUM5Qzs7OztPQUlHO0lBQ0gsSUFBYSxNQUFNO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLE9BQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUNFLFVBQXNCLEVBQ3RCLFFBQWtCLEVBQ2xCLE1BQWMsRUFDNkIsYUFBc0I7UUFFakUsS0FBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELENBQUM7bUhBckJVLGFBQWEsMEZBa0JGLHFCQUFxQjt1R0FsQmhDLGFBQWEsNmhCQzdDMUIsc2FBV0E7O1NEa0NhLGFBQWE7Z0dBQWIsYUFBYTtrQkFWekIsU0FBUzsrQkFDRSx5QkFBeUIsVUFHM0IsaUJBQWlCLFFBQ25CLGVBQWUsWUFDWCxXQUFXLGlCQUNOLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OzBCQW9CNUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7O0FBTTdDOzs7O0dBSUc7QUFDSCxNQVVhLGFBQWMsU0FBUSxhQUFhO0lBQzlDLFlBQ0UsVUFBc0IsRUFDdEIsUUFBa0IsRUFDbEIsTUFBYyxFQUM2QixhQUFzQjtRQUVqRSxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDckQsQ0FBQzttSEFSVSxhQUFhLDBGQUtGLHFCQUFxQjt1R0FMaEMsYUFBYSxxcEJFcEYxQixrekJBb0JBOztTRmdFYSxhQUFhO2dHQUFiLGFBQWE7a0JBVnpCLFNBQVM7K0JBQ0Usb0JBQW9CLFVBR3RCLGlCQUFpQixRQUNuQixlQUFlLFlBQ1gsc0JBQXNCLGlCQUNqQixpQkFBaUIsQ0FBQyxJQUFJLG1CQUNwQix1QkFBdUIsQ0FBQyxNQUFNOzswQkFPNUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgTmdab25lLFxuICBPcHRpb25hbCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbmltcG9ydCB7XG4gIE1BVF9BTkNIT1JfSE9TVCxcbiAgTUFUX0FOQ0hPUl9JTlBVVFMsXG4gIE1BVF9CVVRUT05fSE9TVCxcbiAgTUFUX0JVVFRPTl9JTlBVVFMsXG4gIE1hdEFuY2hvckJhc2UsXG4gIE1hdEJ1dHRvbkJhc2UsXG59IGZyb20gJy4vYnV0dG9uLWJhc2UnO1xuaW1wb3J0IHtNYXRSaXBwbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG4vKipcbiAqIE1hdGVyaWFsIERlc2lnbiBpY29uIGJ1dHRvbiBjb21wb25lbnQuIFRoaXMgdHlwZSBvZiBidXR0b24gZGlzcGxheXMgYSBzaW5nbGUgaW50ZXJhY3RpdmUgaWNvbiBmb3JcbiAqIHVzZXJzIHRvIHBlcmZvcm0gYW4gYWN0aW9uLlxuICogU2VlIGh0dHBzOi8vbWF0ZXJpYWwuaW8vZGV2ZWxvcC93ZWIvY29tcG9uZW50cy9idXR0b25zL2ljb24tYnV0dG9ucy9cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBgYnV0dG9uW21hdC1pY29uLWJ1dHRvbl1gLFxuICB0ZW1wbGF0ZVVybDogJ2ljb24tYnV0dG9uLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnaWNvbi1idXR0b24uY3NzJywgJ2J1dHRvbi1oaWdoLWNvbnRyYXN0LmNzcyddLFxuICBpbnB1dHM6IE1BVF9CVVRUT05fSU5QVVRTLFxuICBob3N0OiBNQVRfQlVUVE9OX0hPU1QsXG4gIGV4cG9ydEFzOiAnbWF0QnV0dG9uJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEljb25CdXR0b24gZXh0ZW5kcyBNYXRCdXR0b25CYXNlIHtcbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgTWF0UmlwcGxlIGluc3RhbmNlIG9mIHRoZSBidXR0b24uXG4gICAqIEBkZXByZWNhdGVkIENvbnNpZGVyZWQgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsLiBUbyBiZSByZW1vdmVkLlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHJpcHBsZSgpOiBNYXRSaXBwbGUge1xuICAgIGlmICghdGhpcy5fcmlwcGxlICYmIHRoaXMuX3JpcHBsZUxvYWRlcikge1xuICAgICAgdGhpcy5fcmlwcGxlID0gdGhpcy5fcmlwcGxlTG9hZGVyLl9jcmVhdGVNYXRSaXBwbGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMuX3JpcHBsZSEuY2VudGVyZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcmlwcGxlITtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBwbGF0Zm9ybSwgbmdab25lLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxufVxuXG4vKipcbiAqIE1hdGVyaWFsIERlc2lnbiBpY29uIGJ1dHRvbiBjb21wb25lbnQgZm9yIGFuY2hvciBlbGVtZW50cy4gVGhpcyBidXR0b24gZGlzcGxheXMgYSBzaW5nbGVcbiAqIGludGVyYWN0aW9uIGljb24gdGhhdCBhbGxvd3MgdXNlcnMgdG8gbmF2aWdhdGUgYWNyb3NzIGRpZmZlcmVudCByb3V0ZXMgb3IgcGFnZXMuXG4gKiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5pby9kZXZlbG9wL3dlYi9jb21wb25lbnRzL2J1dHRvbnMvaWNvbi1idXR0b25zL1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IGBhW21hdC1pY29uLWJ1dHRvbl1gLFxuICB0ZW1wbGF0ZVVybDogJ2J1dHRvbi5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2ljb24tYnV0dG9uLmNzcycsICdidXR0b24taGlnaC1jb250cmFzdC5jc3MnXSxcbiAgaW5wdXRzOiBNQVRfQU5DSE9SX0lOUFVUUyxcbiAgaG9zdDogTUFUX0FOQ0hPUl9IT1NULFxuICBleHBvcnRBczogJ21hdEJ1dHRvbiwgbWF0QW5jaG9yJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEljb25BbmNob3IgZXh0ZW5kcyBNYXRBbmNob3JCYXNlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIHBsYXRmb3JtLCBuZ1pvbmUsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG59XG4iLCI8c3BhbiBjbGFzcz1cIm1hdC1tZGMtYnV0dG9uLXBlcnNpc3RlbnQtcmlwcGxlIG1kYy1pY29uLWJ1dHRvbl9fcmlwcGxlXCI+PC9zcGFuPlxuXG48bmctY29udGVudD48L25nLWNvbnRlbnQ+XG5cbjwhLS1cbiAgVGhlIGluZGljYXRvciBjYW4ndCBiZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uLCBiZWNhdXNlIE1EQyB1c2VzIDo6YmVmb3JlIGZvciBoaWdoIGNvbnRyYXN0XG4gIGluZGljYXRpb24gYW5kIGl0IGNhbid0IGJlIG9uIHRoZSByaXBwbGUsIGJlY2F1c2UgaXQgaGFzIGEgYm9yZGVyIHJhZGl1cyBhbmQgb3ZlcmZsb3c6IGhpZGRlbi5cbi0tPlxuPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWZvY3VzLWluZGljYXRvclwiPjwvc3Bhbj5cblxuPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWJ1dHRvbi10b3VjaC10YXJnZXRcIj48L3NwYW4+XG4iLCI8c3BhblxuICAgIGNsYXNzPVwibWF0LW1kYy1idXR0b24tcGVyc2lzdGVudC1yaXBwbGVcIlxuICAgIFtjbGFzcy5tZGMtYnV0dG9uX19yaXBwbGVdPVwiIV9pc0ZhYlwiXG4gICAgW2NsYXNzLm1kYy1mYWJfX3JpcHBsZV09XCJfaXNGYWJcIj48L3NwYW4+XG5cbjxuZy1jb250ZW50IHNlbGVjdD1cIi5tYXRlcmlhbC1pY29uczpub3QoW2ljb25Qb3NpdGlvbkVuZF0pLCBtYXQtaWNvbjpub3QoW2ljb25Qb3NpdGlvbkVuZF0pLCBbbWF0QnV0dG9uSWNvbl06bm90KFtpY29uUG9zaXRpb25FbmRdKVwiPlxuPC9uZy1jb250ZW50PlxuXG48c3BhbiBjbGFzcz1cIm1kYy1idXR0b25fX2xhYmVsXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50Pjwvc3Bhbj5cblxuPG5nLWNvbnRlbnQgc2VsZWN0PVwiLm1hdGVyaWFsLWljb25zW2ljb25Qb3NpdGlvbkVuZF0sIG1hdC1pY29uW2ljb25Qb3NpdGlvbkVuZF0sIFttYXRCdXR0b25JY29uXVtpY29uUG9zaXRpb25FbmRdXCI+XG48L25nLWNvbnRlbnQ+XG5cbjwhLS1cbiAgVGhlIGluZGljYXRvciBjYW4ndCBiZSBkaXJlY3RseSBvbiB0aGUgYnV0dG9uLCBiZWNhdXNlIE1EQyB1c2VzIDo6YmVmb3JlIGZvciBoaWdoIGNvbnRyYXN0XG4gIGluZGljYXRpb24gYW5kIGl0IGNhbid0IGJlIG9uIHRoZSByaXBwbGUsIGJlY2F1c2UgaXQgaGFzIGEgYm9yZGVyIHJhZGl1cyBhbmQgb3ZlcmZsb3c6IGhpZGRlbi5cbi0tPlxuPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWZvY3VzLWluZGljYXRvclwiPjwvc3Bhbj5cblxuPHNwYW4gY2xhc3M9XCJtYXQtbWRjLWJ1dHRvbi10b3VjaC10YXJnZXRcIj48L3NwYW4+XG4iXX0=