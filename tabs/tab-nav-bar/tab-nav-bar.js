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
    /** Animates the ink bar to the position of the active link element. */
    MdTabNavBar.prototype.updateActiveLink = function (element) {
        this._inkBar.alignToElement(element);
    };
    __decorate([
        ViewChild(MdInkBar), 
        __metadata('design:type', MdInkBar)
    ], MdTabNavBar.prototype, "_inkBar", void 0);
    MdTabNavBar = __decorate([
        Component({selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
            template: "<ng-content></ng-content><md-ink-bar></md-ink-bar>",
            styles: ["[md-tab-link],[md-tab-nav-bar]{position:relative;overflow:hidden}[md-tab-nav-bar]{display:flex;flex-direction:row;flex-shrink:0}[md-tab-link]{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;text-decoration:none}[md-tab-link]:focus{outline:0;opacity:1}@media (max-width:600px){[md-tab-link]{min-width:72px}}md-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}"],
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
    function MdTabLink(_mdTabNavBar, _element) {
        this._mdTabNavBar = _mdTabNavBar;
        this._element = _element;
        this._isActive = false;
    }
    Object.defineProperty(MdTabLink.prototype, "active", {
        /** Whether the link is active. */
        get: function () { return this._isActive; },
        set: function (value) {
            this._isActive = value;
            if (value) {
                this._mdTabNavBar.updateActiveLink(this._element.nativeElement);
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
    function MdTabLinkRipple(_element, _ngZone, _ruler) {
        _super.call(this, _element, _ngZone, _ruler);
        this._element = _element;
        this._ngZone = _ngZone;
    }
    /**
     * In certain cases the parent destroy handler may not get called. See Angular issue #11606.
     */
    MdTabLinkRipple.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    MdTabLinkRipple = __decorate([
        Directive({
            selector: '[md-tab-link], [mat-tab-link]',
        }), 
        __metadata('design:paramtypes', [ElementRef, NgZone, ViewportRuler])
    ], MdTabLinkRipple);
    return MdTabLinkRipple;
}(MdRipple));

//# sourceMappingURL=tab-nav-bar.js.map
