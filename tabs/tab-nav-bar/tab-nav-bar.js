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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, Input, ViewChild, ElementRef, ViewEncapsulation, Directive, NgZone, Inject, Optional } from '@angular/core';
import { MdInkBar } from '../ink-bar';
import { MdRipple } from '../../core/ripple/index';
import { ViewportRuler } from '../../core/overlay/position/viewport-ruler';
import { MD_RIPPLE_GLOBAL_OPTIONS } from '../../core/ripple/ripple';
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
            template: "<div class=\"mat-tab-links\"><ng-content></ng-content><md-ink-bar></md-ink-bar></div>",
            styles: [".mat-tab-nav-bar{overflow:hidden;position:relative;flex-shrink:0}.mat-tab-links{position:relative}.mat-tab-link{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-block;vertical-align:top;text-decoration:none;position:relative;overflow:hidden}.mat-tab-link:focus{outline:0;opacity:1}@media (max-width:600px){.mat-tab-link{min-width:72px}}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0} /*# sourceMappingURL=tab-nav-bar.css.map */ "],
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
    function MdTabLinkRipple(elementRef, ngZone, ruler, globalOptions) {
        _super.call(this, elementRef, ngZone, ruler, globalOptions);
    }
    MdTabLinkRipple = __decorate([
        Directive({
            selector: '[md-tab-link], [mat-tab-link]',
            host: {
                '[class.mat-tab-link]': 'true',
            },
        }),
        __param(3, Optional()),
        __param(3, Inject(MD_RIPPLE_GLOBAL_OPTIONS)), 
        __metadata('design:paramtypes', [ElementRef, NgZone, ViewportRuler, Object])
    ], MdTabLinkRipple);
    return MdTabLinkRipple;
}(MdRipple));
//# sourceMappingURL=tab-nav-bar.js.map