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
import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, Directive, NgZone } from '@angular/core';
import { MdInkBar } from '../ink-bar';
import { MdRipple } from '../../core/ripple/ripple';
import { ViewportRuler } from '../../core/overlay/position/viewport-ruler';
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export var MdTabNavBar = (function () {
    function MdTabNavBar() {
    }
    /** Notifies the component that the active link has been changed. */
    MdTabNavBar.prototype.updateActiveLink = function (element) {
        this._activeLinkChanged = this._activeLinkElement != element;
        this._activeLinkElement = element;
    };
    /** Checks if the active link has been changed and, if so, will update the ink bar. */
    MdTabNavBar.prototype.ngAfterContentChecked = function () {
        if (this._activeLinkChanged) {
            this._inkBar.alignToElement(this._activeLinkElement.nativeElement);
            this._activeLinkChanged = false;
        }
    };
    __decorate([
        ViewChild(MdInkBar), 
        __metadata('design:type', MdInkBar)
    ], MdTabNavBar.prototype, "_inkBar", void 0);
    MdTabNavBar = __decorate([
        Component({selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
            template: "<div class=\"mat-tab-links\"><ng-content></ng-content></div><md-ink-bar></md-ink-bar>",
            styles: [".mat-tab-link,.mat-tab-nav-bar{position:relative;overflow:hidden}.mat-tab-nav-bar{flex-shrink:0}.mat-tab-links{display:flex;position:relative}.mat-tab-link{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;text-decoration:none}.mat-tab-link:focus{outline:0;opacity:1}@media (max-width:600px){.mat-tab-link{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}"],
            host: {
                '[class.mat-tab-nav-bar]': 'true',
            },
            encapsulation: ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [])
    ], MdTabNavBar);
    return MdTabNavBar;
}());
/**
 * Link inside of a `md-tab-nav-bar`.
 */
export var MdTabLink = (function () {
    function MdTabLink(_mdTabNavBar, _elementRef) {
        this._mdTabNavBar = _mdTabNavBar;
        this._elementRef = _elementRef;
        this._isActive = false;
    }
    Object.defineProperty(MdTabLink.prototype, "active", {
        /** Whether the link is active. */
        get: function () { return this._isActive; },
        set: function (value) {
            this._isActive = value;
            if (value) {
                this._mdTabNavBar.updateActiveLink(this._elementRef);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Input(), 
        __metadata('design:type', Boolean)
    ], MdTabLink.prototype, "active", null);
    MdTabLink = __decorate([
        Directive({
            selector: '[md-tab-link], [mat-tab-link]',
            host: {
                '[class.mat-tab-link]': 'true',
            }
        }), 
        __metadata('design:paramtypes', [MdTabNavBar, ElementRef])
    ], MdTabLink);
    return MdTabLink;
}());
/**
 * Simple directive that extends the ripple and matches the selector of the MdTabLink. This
 * adds the ripple behavior to nav bar labels.
 */
export var MdTabLinkRipple = (function (_super) {
    __extends(MdTabLinkRipple, _super);
    function MdTabLinkRipple(elementRef, ngZone, ruler) {
        _super.call(this, elementRef, ngZone, ruler);
    }
    MdTabLinkRipple = __decorate([
        Directive({
            selector: '[md-tab-link], [mat-tab-link]',
            host: {
                '[class.mat-tab-link]': 'true',
            },
        }), 
        __metadata('design:paramtypes', [ElementRef, NgZone, ViewportRuler])
    ], MdTabLinkRipple);
    return MdTabLinkRipple;
}(MdRipple));
//# sourceMappingURL=tab-nav-bar.js.map