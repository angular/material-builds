(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('@angular/common'), require('@angular/platform-browser'), require('@angular/forms'), require('rxjs/Observable'), require('@angular/http'), require('rxjs/add/observable/forkJoin'), require('rxjs/add/observable/of'), require('rxjs/add/operator/map'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/do'), require('rxjs/add/operator/share'), require('rxjs/add/operator/finally'), require('rxjs/add/operator/catch'), require('rxjs/add/operator/first')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', '@angular/common', '@angular/platform-browser', '@angular/forms', 'rxjs/Observable', '@angular/http', 'rxjs/add/observable/forkJoin', 'rxjs/add/observable/of', 'rxjs/add/operator/map', 'rxjs/add/operator/filter', 'rxjs/add/operator/do', 'rxjs/add/operator/share', 'rxjs/add/operator/finally', 'rxjs/add/operator/catch', 'rxjs/add/operator/first'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}),global.ng.core,global.Rx,global.ng.common,global.ng.platformBrowser,global.ng.forms,global.Rx,global.ng.http,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,_angular_core,rxjs_Subject,_angular_common,_angular_platformBrowser,_angular_forms,rxjs_Observable,_angular_http,rxjs_add_observable_forkJoin,rxjs_add_observable_of,rxjs_add_operator_map,rxjs_add_operator_filter,rxjs_add_operator_do,rxjs_add_operator_share,rxjs_add_operator_finally,rxjs_add_operator_catch,rxjs_add_operator_first) { 'use strict';

var __decorate$2 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$2 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MATERIAL_COMPATIBILITY_MODE = new _angular_core.OpaqueToken('md-compatibiility-mode');
/** Selector that matches all elements that may have style collisions with material1. */
var MAT_ELEMENTS_SELECTOR = "\n  mat-autocomplete,\n  mat-card,\n  mat-card-actions,\n  mat-card-content,\n  mat-card-footer,\n  mat-card-header,\n  mat-card-subtitle,\n  mat-card-title,\n  mat-card-title-group,\n  mat-checkbox,\n  mat-chip,\n  mat-dialog-container,\n  mat-divider,\n  mat-grid-list,\n  mat-grid-tile,\n  mat-grid-tile-footer,\n  mat-grid-tile-header,\n  mat-hint,\n  mat-icon,\n  mat-ink-bar,\n  mat-input,\n  mat-list,\n  mat-list-item,\n  mat-menu,\n  mat-nav-list,\n  mat-option,\n  mat-placeholder,\n  mat-progress-bar,\n  mat-progress-circle,\n  mat-radio-button,\n  mat-radio-group,\n  mat-select,\n  mat-sidenav,\n  mat-slider,\n  mat-spinner,\n  mat-tab,\n  mat-toolbar\n";
/** Directive that enforces that the `mat-` prefix cannot be used. */
var MatPrefixEnforcer = (function () {
    function MatPrefixEnforcer(isCompatibilityMode) {
        if (!isCompatibilityMode) {
            throw Error('The "mat-" prefix cannot be used out of ng-material v1 compatibility mode.');
        }
    }
    MatPrefixEnforcer = __decorate$2([
        _angular_core.Directive({ selector: MAT_ELEMENTS_SELECTOR }),
        __param(0, _angular_core.Inject(MATERIAL_COMPATIBILITY_MODE)), 
        __metadata$2('design:paramtypes', [Boolean])
    ], MatPrefixEnforcer);
    return MatPrefixEnforcer;
}());
/**
 * Module that enforces the default "compatibility mode" settings. When this module is loaded
 * without NoConflictStyleCompatibilityMode also being imported, it will throw an error if
 * there are any uses of the `mat-` prefix.
 *
 * Because the point of this directive is to *not* be used, it will be tree-shaken away by
 * optimizers when not in compatibility mode.
 */
var DefaultStyleCompatibilityModeModule = (function () {
    function DefaultStyleCompatibilityModeModule() {
    }
    DefaultStyleCompatibilityModeModule.forRoot = function () {
        return {
            ngModule: DefaultStyleCompatibilityModeModule,
            providers: [],
        };
    };
    DefaultStyleCompatibilityModeModule = __decorate$2([
        _angular_core.NgModule({
            declarations: [MatPrefixEnforcer],
            exports: [MatPrefixEnforcer],
            providers: [{
                    provide: MATERIAL_COMPATIBILITY_MODE, useValue: false,
                }]
        }), 
        __metadata$2('design:paramtypes', [])
    ], DefaultStyleCompatibilityModeModule);
    return DefaultStyleCompatibilityModeModule;
}());

var __decorate$1 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$1 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MdLine) query, then
 * counted by checking the query list's length.
 */
var MdLine = (function () {
    function MdLine() {
    }
    MdLine = __decorate$1([
        _angular_core.Directive({ selector: '[md-line], [mat-line]' }), 
        __metadata$1('design:paramtypes', [])
    ], MdLine);
    return MdLine;
}());
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
var MdLineSetter = (function () {
    function MdLineSetter(_lines, _renderer, _element) {
        var _this = this;
        this._lines = _lines;
        this._renderer = _renderer;
        this._element = _element;
        this._setLineClass(this._lines.length);
        this._lines.changes.subscribe(function () {
            _this._setLineClass(_this._lines.length);
        });
    }
    MdLineSetter.prototype._setLineClass = function (count) {
        this._resetClasses();
        if (count === 2 || count === 3) {
            this._setClass("md-" + count + "-line", true);
        }
        else if (count > 3) {
            this._setClass("md-multi-line", true);
        }
    };
    MdLineSetter.prototype._resetClasses = function () {
        this._setClass('md-2-line', false);
        this._setClass('md-3-line', false);
        this._setClass('md-multi-line', false);
    };
    MdLineSetter.prototype._setClass = function (className, bool) {
        this._renderer.setElementClass(this._element.nativeElement, className, bool);
    };
    return MdLineSetter;
}());
var MdLineModule = (function () {
    function MdLineModule() {
    }
    MdLineModule = __decorate$1([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdLine, DefaultStyleCompatibilityModeModule],
            declarations: [MdLine],
        }), 
        __metadata$1('design:paramtypes', [])
    ], MdLineModule);
    return MdLineModule;
}());

var __decorate$3 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$3 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Directive to listen to changes of direction of part of the DOM.
 *
 * Applications should use this directive instead of the native attribute so that Material
 * components can listen on changes of direction.
 */
var Dir = (function () {
    function Dir() {
        this._dir = 'ltr';
        this.dirChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(Dir.prototype, "dir", {
        get: function () {
            return this._dir;
        },
        set: function (v) {
            var old = this._dir;
            this._dir = v;
            if (old != this._dir) {
                this.dirChange.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dir.prototype, "value", {
        get: function () { return this.dir; },
        set: function (v) { this.dir = v; },
        enumerable: true,
        configurable: true
    });
    __decorate$3([
        _angular_core.Input('dir'), 
        __metadata$3('design:type', String)
    ], Dir.prototype, "_dir", void 0);
    __decorate$3([
        _angular_core.Output(), 
        __metadata$3('design:type', Object)
    ], Dir.prototype, "dirChange", void 0);
    __decorate$3([
        _angular_core.HostBinding('attr.dir'), 
        __metadata$3('design:type', String)
    ], Dir.prototype, "dir", null);
    Dir = __decorate$3([
        _angular_core.Directive({
            selector: '[dir]',
            // TODO(hansl): maybe `$implicit` isn't the best option here, but for now that's the best we got.
            exportAs: '$implicit'
        }), 
        __metadata$3('design:paramtypes', [])
    ], Dir);
    return Dir;
}());
var RtlModule = (function () {
    function RtlModule() {
    }
    RtlModule.forRoot = function () {
        return {
            ngModule: RtlModule,
            providers: []
        };
    };
    RtlModule = __decorate$3([
        _angular_core.NgModule({
            exports: [Dir],
            declarations: [Dir]
        }), 
        __metadata$3('design:paramtypes', [])
    ], RtlModule);
    return RtlModule;
}());

/** @docs-private */
var ForegroundRippleState;
(function (ForegroundRippleState) {
    ForegroundRippleState[ForegroundRippleState["NEW"] = 0] = "NEW";
    ForegroundRippleState[ForegroundRippleState["EXPANDING"] = 1] = "EXPANDING";
    ForegroundRippleState[ForegroundRippleState["FADING_OUT"] = 2] = "FADING_OUT";
})(ForegroundRippleState || (ForegroundRippleState = {}));
/**
 * Wrapper for a foreground ripple DOM element and its animation state.
 * @docs-private
 */
var ForegroundRipple = (function () {
    function ForegroundRipple(rippleElement) {
        this.rippleElement = rippleElement;
        this.state = ForegroundRippleState.NEW;
    }
    return ForegroundRipple;
}());
var RIPPLE_SPEED_PX_PER_SECOND = 1000;
var MIN_RIPPLE_FILL_TIME_SECONDS = 0.1;
var MAX_RIPPLE_FILL_TIME_SECONDS = 0.3;
/**
 * Returns the distance from the point (x, y) to the furthest corner of a rectangle.
 */
var distanceToFurthestCorner = function (x, y, rect) {
    var distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    var distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
};
/**
 * Helper service that performs DOM manipulations. Not intended to be used outside this module.
 * The constructor takes a reference to the ripple directive's host element and a map of DOM
 * event handlers to be installed on the element that triggers ripple animations.
 * This will eventually become a custom renderer once Angular support exists.
 * @docs-private
 */
var RippleRenderer = (function () {
    function RippleRenderer(_elementRef, _eventHandlers, _ngZone) {
        this._eventHandlers = _eventHandlers;
        this._ngZone = _ngZone;
        this._rippleElement = _elementRef.nativeElement;
        // The background div is created in createBackgroundIfNeeded when the ripple becomes enabled.
        // This avoids creating unneeded divs when the ripple is always disabled.
        this._backgroundDiv = null;
    }
    /** Creates the div for the ripple background, if it doesn't already exist. */
    RippleRenderer.prototype.createBackgroundIfNeeded = function () {
        if (!this._backgroundDiv) {
            this._backgroundDiv = document.createElement('div');
            this._backgroundDiv.classList.add('md-ripple-background');
            this._rippleElement.appendChild(this._backgroundDiv);
        }
    };
    /**
     * Installs event handlers on the given trigger element, and removes event handlers from the
     * previous trigger if needed.
     */
    RippleRenderer.prototype.setTriggerElement = function (newTrigger) {
        var _this = this;
        if (this._triggerElement !== newTrigger) {
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.removeEventListener(eventName, eventHandler);
                });
            }
            this._triggerElement = newTrigger;
            if (this._triggerElement) {
                this._eventHandlers.forEach(function (eventHandler, eventName) {
                    _this._triggerElement.addEventListener(eventName, eventHandler);
                });
            }
        }
    };
    /** Installs event handlers on the host element of the md-ripple directive. */
    RippleRenderer.prototype.setTriggerElementToHost = function () {
        this.setTriggerElement(this._rippleElement);
    };
    /** Removes event handlers from the current trigger element if needed. */
    RippleRenderer.prototype.clearTriggerElement = function () {
        this.setTriggerElement(null);
    };
    /**
     * Creates a foreground ripple and sets its animation to expand and fade in from the position
     * given by rippleOriginLeft and rippleOriginTop (or from the center of the <md-ripple>
     * bounding rect if centered is true).
     */
    RippleRenderer.prototype.createForegroundRipple = function (rippleOriginLeft, rippleOriginTop, color, centered, radius, speedFactor, transitionEndCallback) {
        var _this = this;
        var parentRect = this._rippleElement.getBoundingClientRect();
        // Create a foreground ripple div with the size and position of the fully expanded ripple.
        // When the div is created, it's given a transform style that causes the ripple to be displayed
        // small and centered on the event location (or the center of the bounding rect if the centered
        // argument is true). Removing that transform causes the ripple to animate to its natural size.
        var startX = centered ? (parentRect.left + parentRect.width / 2) : rippleOriginLeft;
        var startY = centered ? (parentRect.top + parentRect.height / 2) : rippleOriginTop;
        var offsetX = startX - parentRect.left;
        var offsetY = startY - parentRect.top;
        var maxRadius = radius > 0 ? radius : distanceToFurthestCorner(startX, startY, parentRect);
        var rippleDiv = document.createElement('div');
        this._rippleElement.appendChild(rippleDiv);
        rippleDiv.classList.add('md-ripple-foreground');
        rippleDiv.style.left = (offsetX - maxRadius) + "px";
        rippleDiv.style.top = (offsetY - maxRadius) + "px";
        rippleDiv.style.width = 2 * maxRadius + "px";
        rippleDiv.style.height = rippleDiv.style.width;
        // If color input is not set, this will default to the background color defined in CSS.
        rippleDiv.style.backgroundColor = color;
        // Start the ripple tiny.
        rippleDiv.style.transform = "scale(0.001)";
        var fadeInSeconds = (1 / (speedFactor || 1)) * Math.max(MIN_RIPPLE_FILL_TIME_SECONDS, Math.min(MAX_RIPPLE_FILL_TIME_SECONDS, maxRadius / RIPPLE_SPEED_PX_PER_SECOND));
        rippleDiv.style.transitionDuration = fadeInSeconds + "s";
        // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
        // Store the opacity to prevent this line as being seen as a no-op by optimizers.
        this._opacity = window.getComputedStyle(rippleDiv).opacity;
        rippleDiv.classList.add('md-ripple-fade-in');
        // Clearing the transform property causes the ripple to animate to its full size.
        rippleDiv.style.transform = '';
        var ripple = new ForegroundRipple(rippleDiv);
        ripple.state = ForegroundRippleState.EXPANDING;
        rippleDiv.addEventListener('transitionend', function (event) { return transitionEndCallback(ripple, event); });
        // Ensure that ripples are always removed, even when transitionend doesn't fire.
        // Run this outside the Angular zone because there's nothing that Angular cares about.
        // If it were to run inside the Angular zone, every test that used ripples would have to be
        // either async or fakeAsync.
        this._ngZone.runOutsideAngular(function () {
            // The ripple lasts a time equal to the sum of fade-in, transform,
            // and fade-out (3 * fade-in time).
            var rippleDuration = fadeInSeconds * 3 * 1000;
            setTimeout(function () { return _this.removeRippleFromDom(ripple.rippleElement); }, rippleDuration);
        });
    };
    /** Fades out a foreground ripple after it has fully expanded and faded in. */
    RippleRenderer.prototype.fadeOutForegroundRipple = function (ripple) {
        ripple.classList.remove('md-ripple-fade-in');
        ripple.classList.add('md-ripple-fade-out');
    };
    /** Removes a foreground ripple from the DOM after it has faded out. */
    RippleRenderer.prototype.removeRippleFromDom = function (ripple) {
        if (ripple && ripple.parentElement) {
            ripple.parentElement.removeChild(ripple);
        }
    };
    /** Fades in the ripple background. */
    RippleRenderer.prototype.fadeInRippleBackground = function (color) {
        this._backgroundDiv.classList.add('md-ripple-active');
        // If color is not set, this will default to the background color defined in CSS.
        this._backgroundDiv.style.backgroundColor = color;
    };
    /** Fades out the ripple background. */
    RippleRenderer.prototype.fadeOutRippleBackground = function () {
        if (this._backgroundDiv) {
            this._backgroundDiv.classList.remove('md-ripple-active');
        }
    };
    return RippleRenderer;
}());

var __decorate$5 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$5 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Simple utility for getting the bounds of the browser viewport.
 * @docs-private
 */
var ViewportRuler = (function () {
    function ViewportRuler() {
    }
    // TODO(jelbourn): cache the document's bounding rect and only update it when the window
    // is resized (debounced).
    /** Gets a ClientRect for the viewport's bounds. */
    ViewportRuler.prototype.getViewportRect = function () {
        // Use the document element's bounding rect rather than the window scroll properties
        // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
        // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
        // conceptual viewports. Under most circumstances these viewports are equivalent, but they
        // can disagree when the page is pinch-zoomed (on devices that support touch).
        // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
        // We use the documentElement instead of the body because, by default (without a css reset)
        // browsers typically give the document body an 8px margin, which is not included in
        // getBoundingClientRect().
        var documentRect = document.documentElement.getBoundingClientRect();
        var scrollPosition = this.getViewportScrollPosition(documentRect);
        var height = window.innerHeight;
        var width = window.innerWidth;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
        };
    };
    /**
     * Gets the (top, left) scroll position of the viewport.
     * @param documentRect
     */
    ViewportRuler.prototype.getViewportScrollPosition = function (documentRect) {
        if (documentRect === void 0) { documentRect = document.documentElement.getBoundingClientRect(); }
        // The top-left-corner of the viewport is determined by the scroll position of the document
        // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
        // whether `document.body` or `document.documentElement` is the scrolled element, so reading
        // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
        // `document.documentElement` works consistently, where the `top` and `left` values will
        // equal negative the scroll position.
        var top = -documentRect.top || document.body.scrollTop || window.scrollY || 0;
        var left = -documentRect.left || document.body.scrollLeft || window.scrollX || 0;
        return { top: top, left: left };
    };
    ViewportRuler = __decorate$5([
        _angular_core.Injectable(), 
        __metadata$5('design:paramtypes', [])
    ], ViewportRuler);
    return ViewportRuler;
}());

var __decorate$4 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$4 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdRipple = (function () {
    function MdRipple(_elementRef, _ngZone, _ruler) {
        var _this = this;
        /**
         * If set, the radius in pixels of foreground ripples when fully expanded. If unset, the radius
         * will be the distance from the center of the ripple to the furthest corner of the host element's
         * bounding rectangle.
         */
        this.maxRadius = 0;
        /**
         * If set, the normal duration of ripple animations is divided by this value. For example,
         * setting it to 0.5 will cause the animations to take twice as long.
         */
        this.speedFactor = 1;
        // These event handlers are attached to the element that triggers the ripple animations.
        var eventHandlers = new Map();
        eventHandlers.set('mousedown', function (event) { return _this._mouseDown(event); });
        eventHandlers.set('click', function (event) { return _this._click(event); });
        eventHandlers.set('mouseleave', function (event) { return _this._mouseLeave(event); });
        this._rippleRenderer = new RippleRenderer(_elementRef, eventHandlers, _ngZone);
        this._ruler = _ruler;
    }
    Object.defineProperty(MdRipple.prototype, "_triggerDeprecated", {
        /** @deprecated */
        get: function () { return this.trigger; },
        set: function (value) { this.trigger = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_centeredDeprecated", {
        /** @deprecated */
        get: function () { return this.centered; },
        set: function (value) { this.centered = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_disabledDeprecated", {
        /** @deprecated */
        get: function () { return this.disabled; },
        set: function (value) { this.disabled = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_maxRadiusDeprecated", {
        /** @deprecated */
        get: function () { return this.maxRadius; },
        set: function (value) { this.maxRadius = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_speedFactorDeprecated", {
        /** @deprecated */
        get: function () { return this.speedFactor; },
        set: function (value) { this.speedFactor = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_colorDeprecated", {
        /** @deprecated */
        get: function () { return this.color; },
        set: function (value) { this.color = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_backgroundColorDeprecated", {
        /** @deprecated */
        get: function () { return this.backgroundColor; },
        set: function (value) { this.backgroundColor = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_focusedDeprecated", {
        /** @deprecated */
        get: function () { return this.focused; },
        set: function (value) { this.focused = value; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdRipple.prototype, "_unboundedDeprecated", {
        /** @deprecated */
        get: function () { return this.unbounded; },
        set: function (value) { this.unbounded = value; },
        enumerable: true,
        configurable: true
    });
    ;
    MdRipple.prototype.ngOnInit = function () {
        // If no trigger element was explicity set, use the host element
        if (!this.trigger) {
            this._rippleRenderer.setTriggerElementToHost();
        }
        if (!this.disabled) {
            this._rippleRenderer.createBackgroundIfNeeded();
        }
    };
    MdRipple.prototype.ngOnDestroy = function () {
        // Remove event listeners on the trigger element.
        this._rippleRenderer.clearTriggerElement();
    };
    MdRipple.prototype.ngOnChanges = function (changes) {
        // If the trigger element changed (or is being initially set), add event listeners to it.
        var changedInputs = Object.keys(changes);
        if (changedInputs.indexOf('trigger') !== -1) {
            this._rippleRenderer.setTriggerElement(this.trigger);
        }
        if (!this.disabled) {
            this._rippleRenderer.createBackgroundIfNeeded();
        }
    };
    /**
     * Responds to the start of a ripple animation trigger by fading the background in.
     */
    MdRipple.prototype.start = function () {
        this._rippleRenderer.createBackgroundIfNeeded();
        this._rippleRenderer.fadeInRippleBackground(this.backgroundColor);
    };
    /**
     * Responds to the end of a ripple animation trigger by fading the background out, and creating a
     * foreground ripple that expands from the event location (or from the center of the element if
     * the "centered" property is set or forceCenter is true).
     */
    MdRipple.prototype.end = function (left, top, forceCenter) {
        var _this = this;
        if (forceCenter === void 0) { forceCenter = true; }
        this._rippleRenderer.createForegroundRipple(left, top, this.color, this.centered || forceCenter, this.maxRadius, this.speedFactor, function (ripple, e) { return _this._rippleTransitionEnded(ripple, e); });
        this._rippleRenderer.fadeOutRippleBackground();
    };
    MdRipple.prototype._rippleTransitionEnded = function (ripple, event) {
        if (event.propertyName === 'opacity') {
            // If the ripple finished expanding, start fading it out. If it finished fading out,
            // remove it from the DOM.
            switch (ripple.state) {
                case ForegroundRippleState.EXPANDING:
                    this._rippleRenderer.fadeOutForegroundRipple(ripple.rippleElement);
                    ripple.state = ForegroundRippleState.FADING_OUT;
                    break;
                case ForegroundRippleState.FADING_OUT:
                    this._rippleRenderer.removeRippleFromDom(ripple.rippleElement);
                    break;
            }
        }
    };
    /**
     * Called when the trigger element receives a mousedown event. Starts the ripple animation by
     * fading in the background.
     */
    MdRipple.prototype._mouseDown = function (event) {
        if (!this.disabled && event.button === 0) {
            this.start();
        }
    };
    /**
     * Called when the trigger element receives a click event. Creates a foreground ripple and
     * runs its animation.
     */
    MdRipple.prototype._click = function (event) {
        if (!this.disabled && event.button === 0) {
            // If screen and page positions are all 0, this was probably triggered by a keypress.
            // In that case, use the center of the bounding rect as the ripple origin.
            // FIXME: This fails on IE11, which still sets pageX/Y and screenX/Y on keyboard clicks.
            var isKeyEvent = (event.screenX === 0 && event.screenY === 0 && event.pageX === 0 && event.pageY === 0);
            this.end(event.pageX - this._ruler.getViewportScrollPosition().left, event.pageY - this._ruler.getViewportScrollPosition().top, isKeyEvent);
        }
    };
    /**
     * Called when the trigger element receives a mouseleave event. Fades out the background.
     */
    MdRipple.prototype._mouseLeave = function (event) {
        // We can always fade out the background here; It's a no-op if it was already inactive.
        this._rippleRenderer.fadeOutRippleBackground();
    };
    __decorate$4([
        _angular_core.Input('mdRippleTrigger'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "trigger", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-trigger'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_triggerDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleCentered'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "centered", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-centered'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_centeredDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleDisabled'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "disabled", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-disabled'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_disabledDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleMaxRadius'), 
        __metadata$4('design:type', Number)
    ], MdRipple.prototype, "maxRadius", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-max-radius'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_maxRadiusDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleSpeedFactor'), 
        __metadata$4('design:type', Number)
    ], MdRipple.prototype, "speedFactor", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-speed-factor'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_speedFactorDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleColor'), 
        __metadata$4('design:type', String)
    ], MdRipple.prototype, "color", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-color'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_colorDeprecated", null);
    __decorate$4([
        _angular_core.Input('mdRippleBackgroundColor'), 
        __metadata$4('design:type', String)
    ], MdRipple.prototype, "backgroundColor", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-background-color'), 
        __metadata$4('design:type', Object)
    ], MdRipple.prototype, "_backgroundColorDeprecated", null);
    __decorate$4([
        _angular_core.HostBinding('class.md-ripple-focused'),
        _angular_core.Input('mdRippleFocused'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "focused", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-focused'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "_focusedDeprecated", null);
    __decorate$4([
        _angular_core.HostBinding('class.md-ripple-unbounded'),
        _angular_core.Input('mdRippleUnbounded'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "unbounded", void 0);
    __decorate$4([
        _angular_core.Input('md-ripple-unbounded'), 
        __metadata$4('design:type', Boolean)
    ], MdRipple.prototype, "_unboundedDeprecated", null);
    MdRipple = __decorate$4([
        _angular_core.Directive({
            selector: '[md-ripple], [mat-ripple]',
        }), 
        __metadata$4('design:paramtypes', [_angular_core.ElementRef, _angular_core.NgZone, ViewportRuler])
    ], MdRipple);
    return MdRipple;
}());
var MdRippleModule = (function () {
    function MdRippleModule() {
    }
    MdRippleModule.forRoot = function () {
        return {
            ngModule: MdRippleModule,
            providers: [ViewportRuler]
        };
    };
    MdRippleModule = __decorate$4([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdRipple, DefaultStyleCompatibilityModeModule],
            declarations: [MdRipple],
        }), 
        __metadata$4('design:paramtypes', [])
    ], MdRippleModule);
    return MdRippleModule;
}());

// TODO(kara): Revisit why error messages are not being properly set.
var __extends$3 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Wrapper around Error that sets the error message.
 * @docs-private
 */
var MdError = (function (_super) {
    __extends$3(MdError, _super);
    function MdError(value) {
        _super.call(this);
        this.message = value;
    }
    return MdError;
}(Error));

var __extends$2 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Exception thrown when attempting to attach a null portal to a host.
 * @docs-private
 */
var MdNullPortalError = (function (_super) {
    __extends$2(MdNullPortalError, _super);
    function MdNullPortalError() {
        _super.call(this, 'Must provide a portal to attach');
    }
    return MdNullPortalError;
}(MdError));
/**
 * Exception thrown when attempting to attach a portal to a host that is already attached.
 * @docs-private
 */
var MdPortalAlreadyAttachedError = (function (_super) {
    __extends$2(MdPortalAlreadyAttachedError, _super);
    function MdPortalAlreadyAttachedError() {
        _super.call(this, 'Host already has a portal attached');
    }
    return MdPortalAlreadyAttachedError;
}(MdError));
/**
 * Exception thrown when attempting to attach a portal to an already-disposed host.
 * @docs-private
 */
var MdPortalHostAlreadyDisposedError = (function (_super) {
    __extends$2(MdPortalHostAlreadyDisposedError, _super);
    function MdPortalHostAlreadyDisposedError() {
        _super.call(this, 'This PortalHost has already been disposed');
    }
    return MdPortalHostAlreadyDisposedError;
}(MdError));
/**
 * Exception thrown when attempting to attach an unknown portal type.
 * @docs-private
 */
var MdUnknownPortalTypeError = (function (_super) {
    __extends$2(MdUnknownPortalTypeError, _super);
    function MdUnknownPortalTypeError() {
        _super.call(this, 'Attempting to attach an unknown Portal type. ' +
            'BasePortalHost accepts either a ComponentPortal or a TemplatePortal.');
    }
    return MdUnknownPortalTypeError;
}(MdError));
/**
 * Exception thrown when attempting to attach a portal to a null host.
 * @docs-private
 */
var MdNullPortalHostError = (function (_super) {
    __extends$2(MdNullPortalHostError, _super);
    function MdNullPortalHostError() {
        _super.call(this, 'Attempting to attach a portal to a null PortalHost');
    }
    return MdNullPortalHostError;
}(MdError));
/**
 * Exception thrown when attempting to detach a portal that is not attached.
 * @docs-private
 */
var MdNoPortalAttachedError = (function (_super) {
    __extends$2(MdNoPortalAttachedError, _super);
    function MdNoPortalAttachedError() {
        _super.call(this, 'Attempting to detach a portal that is not attached to a host');
    }
    return MdNoPortalAttachedError;
}(MdError));

var __extends$1 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A `Portal` is something that you want to render somewhere else.
 * It can be attach to / detached from a `PortalHost`.
 */
var Portal = (function () {
    function Portal() {
    }
    /** Attach this portal to a host. */
    Portal.prototype.attach = function (host) {
        if (host == null) {
            throw new MdNullPortalHostError();
        }
        if (host.hasAttached()) {
            throw new MdPortalAlreadyAttachedError();
        }
        this._attachedHost = host;
        return host.attach(this);
    };
    /** Detach this portal from its host */
    Portal.prototype.detach = function () {
        var host = this._attachedHost;
        if (host == null) {
            throw new MdNoPortalAttachedError();
        }
        this._attachedHost = null;
        return host.detach();
    };
    Object.defineProperty(Portal.prototype, "isAttached", {
        /** Whether this portal is attached to a host. */
        get: function () {
            return this._attachedHost != null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detach()`.
     */
    Portal.prototype.setAttachedHost = function (host) {
        this._attachedHost = host;
    };
    return Portal;
}());
/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
var ComponentPortal = (function (_super) {
    __extends$1(ComponentPortal, _super);
    function ComponentPortal(component, viewContainerRef, injector) {
        if (viewContainerRef === void 0) { viewContainerRef = null; }
        if (injector === void 0) { injector = null; }
        _super.call(this);
        this.component = component;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
    }
    return ComponentPortal;
}(Portal));
/**
 * A `TemplatePortal` is a portal that represents some embedded template (TemplateRef).
 */
var TemplatePortal = (function (_super) {
    __extends$1(TemplatePortal, _super);
    function TemplatePortal(template, viewContainerRef) {
        _super.call(this);
        /**
         * Additional locals for the instantiated embedded view.
         * These locals can be seen as "exports" for the template, such as how ngFor has
         * index / event / odd.
         * See https://angular.io/docs/ts/latest/api/core/EmbeddedViewRef-class.html
         */
        this.locals = new Map();
        this.templateRef = template;
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(TemplatePortal.prototype, "origin", {
        get: function () {
            return this.templateRef.elementRef;
        },
        enumerable: true,
        configurable: true
    });
    TemplatePortal.prototype.attach = function (host, locals) {
        this.locals = locals == null ? new Map() : locals;
        return _super.prototype.attach.call(this, host);
    };
    TemplatePortal.prototype.detach = function () {
        this.locals = new Map();
        return _super.prototype.detach.call(this);
    };
    return TemplatePortal;
}(Portal));
/**
 * Partial implementation of PortalHost that only deals with attaching either a
 * ComponentPortal or a TemplatePortal.
 */
var BasePortalHost = (function () {
    function BasePortalHost() {
        /** Whether this host has already been permanently disposed. */
        this._isDisposed = false;
    }
    /** Whether this host has an attached portal. */
    BasePortalHost.prototype.hasAttached = function () {
        return this._attachedPortal != null;
    };
    BasePortalHost.prototype.attach = function (portal) {
        if (portal == null) {
            throw new MdNullPortalError();
        }
        if (this.hasAttached()) {
            throw new MdPortalAlreadyAttachedError();
        }
        if (this._isDisposed) {
            throw new MdPortalHostAlreadyDisposedError();
        }
        if (portal instanceof ComponentPortal) {
            this._attachedPortal = portal;
            return this.attachComponentPortal(portal);
        }
        else if (portal instanceof TemplatePortal) {
            this._attachedPortal = portal;
            return this.attachTemplatePortal(portal);
        }
        throw new MdUnknownPortalTypeError();
    };
    BasePortalHost.prototype.detach = function () {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
        }
        this._attachedPortal = null;
        if (this._disposeFn != null) {
            this._disposeFn();
            this._disposeFn = null;
        }
    };
    BasePortalHost.prototype.dispose = function () {
        if (this.hasAttached()) {
            this.detach();
        }
        this._isDisposed = true;
    };
    BasePortalHost.prototype.setDisposeFn = function (fn) {
        this._disposeFn = fn;
    };
    return BasePortalHost;
}());

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$6 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$6 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Directive version of a `TemplatePortal`. Because the directive *is* a TemplatePortal,
 * the directive instance itself can be attached to a host, enabling declarative use of portals.
 *
 * Usage:
 * <template portal #greeting>
 *   <p> Hello {{name}} </p>
 * </template>
 */
var TemplatePortalDirective = (function (_super) {
    __extends(TemplatePortalDirective, _super);
    function TemplatePortalDirective(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    TemplatePortalDirective = __decorate$6([
        _angular_core.Directive({
            selector: '[portal]',
            exportAs: 'portal',
        }), 
        __metadata$6('design:paramtypes', [_angular_core.TemplateRef, _angular_core.ViewContainerRef])
    ], TemplatePortalDirective);
    return TemplatePortalDirective;
}(TemplatePortal));
/**
 * Directive version of a PortalHost. Because the directive *is* a PortalHost, portals can be
 * directly attached to it, enabling declarative use.
 *
 * Usage:
 * <template [portalHost]="greeting"></template>
 */
var PortalHostDirective = (function (_super) {
    __extends(PortalHostDirective, _super);
    function PortalHostDirective(_componentFactoryResolver, _viewContainerRef) {
        _super.call(this);
        this._componentFactoryResolver = _componentFactoryResolver;
        this._viewContainerRef = _viewContainerRef;
    }
    Object.defineProperty(PortalHostDirective.prototype, "portal", {
        get: function () {
            return this._portal;
        },
        set: function (p) {
            if (p) {
                this._replaceAttachedPortal(p);
            }
        },
        enumerable: true,
        configurable: true
    });
    PortalHostDirective.prototype.ngOnDestroy = function () {
        this.dispose();
    };
    /** Attach the given ComponentPortal to this PortalHost using the ComponentFactoryResolver. */
    PortalHostDirective.prototype.attachComponentPortal = function (portal) {
        portal.setAttachedHost(this);
        // If the portal specifies an origin, use that as the logical location of the component
        // in the application tree. Otherwise use the location of this PortalHost.
        var viewContainerRef = portal.viewContainerRef != null ?
            portal.viewContainerRef :
            this._viewContainerRef;
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var ref = viewContainerRef.createComponent(componentFactory, viewContainerRef.length, portal.injector || viewContainerRef.parentInjector);
        this.setDisposeFn(function () { return ref.destroy(); });
        return ref;
    };
    /** Attach the given TemplatePortal to this PortlHost as an embedded View. */
    PortalHostDirective.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        portal.setAttachedHost(this);
        this._viewContainerRef.createEmbeddedView(portal.templateRef);
        this.setDisposeFn(function () { return _this._viewContainerRef.clear(); });
        // TODO(jelbourn): return locals from view
        return new Map();
    };
    /** Detaches the currently attached Portal (if there is one) and attaches the given Portal. */
    PortalHostDirective.prototype._replaceAttachedPortal = function (p) {
        if (this.hasAttached()) {
            this.detach();
        }
        if (p) {
            this.attach(p);
            this._portal = p;
        }
    };
    PortalHostDirective = __decorate$6([
        _angular_core.Directive({
            selector: '[portalHost]',
            inputs: ['portal: portalHost']
        }), 
        __metadata$6('design:paramtypes', [_angular_core.ComponentFactoryResolver, _angular_core.ViewContainerRef])
    ], PortalHostDirective);
    return PortalHostDirective;
}(BasePortalHost));
var PortalModule = (function () {
    function PortalModule() {
    }
    PortalModule.forRoot = function () {
        return {
            ngModule: PortalModule,
            providers: []
        };
    };
    PortalModule = __decorate$6([
        _angular_core.NgModule({
            exports: [TemplatePortalDirective, PortalHostDirective],
            declarations: [TemplatePortalDirective, PortalHostDirective],
        }), 
        __metadata$6('design:paramtypes', [])
    ], PortalModule);
    return PortalModule;
}());

/**
 * OverlayState is a bag of values for either the initial configuration or current state of an
 * overlay.
 */
var OverlayState = (function () {
    function OverlayState() {
        /** Whether the overlay has a backdrop. */
        this.hasBackdrop = false;
        /** Custom class to add to the backdrop **/
        this.backdropClass = 'md-overlay-dark-backdrop';
        /** The direction of the text in the overlay panel. */
        this.direction = 'ltr';
    }
    return OverlayState;
}());

var __extends$4 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
var DomPortalHost = (function (_super) {
    __extends$4(DomPortalHost, _super);
    function DomPortalHost(_hostDomElement, _componentFactoryResolver, _appRef, _defaultInjector) {
        _super.call(this);
        this._hostDomElement = _hostDomElement;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._appRef = _appRef;
        this._defaultInjector = _defaultInjector;
    }
    /** Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver. */
    DomPortalHost.prototype.attachComponentPortal = function (portal) {
        var _this = this;
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(portal.component);
        var componentRef;
        // If the portal specifies a ViewContainerRef, we will use that as the attachment point
        // for the component (in terms of Angular's component tree, not rendering).
        // When the ViewContainerRef is missing, we use the factory to create the component directly
        // and then manually attach the ChangeDetector for that component to the application (which
        // happens automatically when using a ViewContainer).
        if (portal.viewContainerRef) {
            componentRef = portal.viewContainerRef.createComponent(componentFactory, portal.viewContainerRef.length, portal.injector || portal.viewContainerRef.parentInjector);
            this.setDisposeFn(function () { return componentRef.destroy(); });
        }
        else {
            componentRef = componentFactory.create(portal.injector || this._defaultInjector);
            // ApplicationRef's attachView and detachView methods are in Angular ^2.3.0 but not before.
            // The `else` clause here can be removed once 2.3.0 is released.
            if (this._appRef['attachView']) {
                this._appRef.attachView(componentRef.hostView);
                this.setDisposeFn(function () {
                    _this._appRef.detachView(componentRef.hostView);
                    componentRef.destroy();
                });
            }
            else {
                // When creating a component outside of a ViewContainer, we need to manually register
                // its ChangeDetector with the application. This API is unfortunately not published
                // in Angular < 2.3.0. The change detector must also be deregistered when the component
                // is destroyed to prevent memory leaks.
                var changeDetectorRef_1 = componentRef.changeDetectorRef;
                this._appRef.registerChangeDetector(changeDetectorRef_1);
                this.setDisposeFn(function () {
                    _this._appRef.unregisterChangeDetector(changeDetectorRef_1);
                    // Normally the ViewContainer will remove the component's nodes from the DOM.
                    // Without a ViewContainer, we need to manually remove the nodes.
                    var componentRootNode = _this._getComponentRootNode(componentRef);
                    if (componentRootNode.parentNode) {
                        componentRootNode.parentNode.removeChild(componentRootNode);
                    }
                    componentRef.destroy();
                });
            }
        }
        // At this point the component has been instantiated, so we move it to the location in the DOM
        // where we want it to be rendered.
        this._hostDomElement.appendChild(this._getComponentRootNode(componentRef));
        return componentRef;
    };
    DomPortalHost.prototype.attachTemplatePortal = function (portal) {
        var _this = this;
        var viewContainer = portal.viewContainerRef;
        var viewRef = viewContainer.createEmbeddedView(portal.templateRef);
        viewRef.rootNodes.forEach(function (rootNode) { return _this._hostDomElement.appendChild(rootNode); });
        this.setDisposeFn((function () {
            var index = viewContainer.indexOf(viewRef);
            if (index != -1) {
                viewContainer.remove(index);
            }
        }));
        // TODO(jelbourn): Return locals from view.
        return new Map();
    };
    DomPortalHost.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._hostDomElement.parentNode != null) {
            this._hostDomElement.parentNode.removeChild(this._hostDomElement);
        }
    };
    /** Gets the root HTMLElement for an instantiated component. */
    DomPortalHost.prototype._getComponentRootNode = function (componentRef) {
        return componentRef.hostView.rootNodes[0];
    };
    return DomPortalHost;
}(BasePortalHost));

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
var OverlayRef = (function () {
    function OverlayRef(_portalHost, _pane, _state, _ngZone) {
        this._portalHost = _portalHost;
        this._pane = _pane;
        this._state = _state;
        this._ngZone = _ngZone;
        this._backdropElement = null;
        this._backdropClick = new rxjs_Subject.Subject();
    }
    Object.defineProperty(OverlayRef.prototype, "overlayElement", {
        /** The overlay's HTML element */
        get: function () {
            return this._pane;
        },
        enumerable: true,
        configurable: true
    });
    OverlayRef.prototype.attach = function (portal) {
        if (this._state.hasBackdrop) {
            this._attachBackdrop();
        }
        var attachResult = this._portalHost.attach(portal);
        this.updateSize();
        this.updateDirection();
        this.updatePosition();
        return attachResult;
    };
    OverlayRef.prototype.detach = function () {
        this._detachBackdrop();
        return this._portalHost.detach();
    };
    OverlayRef.prototype.dispose = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.dispose();
        }
        this._detachBackdrop();
        this._portalHost.dispose();
    };
    OverlayRef.prototype.hasAttached = function () {
        return this._portalHost.hasAttached();
    };
    OverlayRef.prototype.backdropClick = function () {
        return this._backdropClick.asObservable();
    };
    /** Gets the current state config of the overlay. */
    OverlayRef.prototype.getState = function () {
        return this._state;
    };
    /** Updates the position of the overlay based on the position strategy. */
    OverlayRef.prototype.updatePosition = function () {
        if (this._state.positionStrategy) {
            this._state.positionStrategy.apply(this._pane);
        }
    };
    /** Updates the text direction of the overlay panel. **/
    OverlayRef.prototype.updateDirection = function () {
        this._pane.setAttribute('dir', this._state.direction);
    };
    /** Updates the size of the overlay based on the overlay config. */
    OverlayRef.prototype.updateSize = function () {
        if (this._state.width || this._state.width === 0) {
            this._pane.style.width = formatCssUnit(this._state.width);
        }
        if (this._state.height || this._state.height === 0) {
            this._pane.style.height = formatCssUnit(this._state.height);
        }
        if (this._state.minWidth || this._state.minWidth === 0) {
            this._pane.style.minWidth = formatCssUnit(this._state.minWidth);
        }
        if (this._state.minHeight || this._state.minHeight === 0) {
            this._pane.style.minHeight = formatCssUnit(this._state.minHeight);
        }
    };
    /** Attaches a backdrop for this overlay. */
    OverlayRef.prototype._attachBackdrop = function () {
        var _this = this;
        this._backdropElement = document.createElement('div');
        this._backdropElement.classList.add('md-overlay-backdrop');
        this._backdropElement.classList.add(this._state.backdropClass);
        this._pane.parentElement.appendChild(this._backdropElement);
        // Forward backdrop clicks such that the consumer of the overlay can perform whatever
        // action desired when such a click occurs (usually closing the overlay).
        this._backdropElement.addEventListener('click', function () {
            _this._backdropClick.next(null);
        });
        // Add class to fade-in the backdrop after one frame.
        requestAnimationFrame(function () {
            if (_this._backdropElement) {
                _this._backdropElement.classList.add('md-overlay-backdrop-showing');
            }
        });
    };
    /** Detaches the backdrop (if any) associated with the overlay. */
    OverlayRef.prototype._detachBackdrop = function () {
        var _this = this;
        var backdropToDetach = this._backdropElement;
        if (backdropToDetach) {
            var finishDetach_1 = function () {
                // It may not be attached to anything in certain cases (e.g. unit tests).
                if (backdropToDetach && backdropToDetach.parentNode) {
                    backdropToDetach.parentNode.removeChild(backdropToDetach);
                }
                // It is possible that a new portal has been attached to this overlay since we started
                // removing the backdrop. If that is the case, only clear the backdrop reference if it
                // is still the same instance that we started to remove.
                if (_this._backdropElement == backdropToDetach) {
                    _this._backdropElement = null;
                }
            };
            backdropToDetach.classList.remove('md-overlay-backdrop-showing');
            backdropToDetach.classList.remove(this._state.backdropClass);
            backdropToDetach.addEventListener('transitionend', finishDetach_1);
            // If the backdrop doesn't have a transition, the `transitionend` event won't fire.
            // In this case we make it unclickable and we try to remove it after a delay.
            backdropToDetach.style.pointerEvents = 'none';
            // Run this outside the Angular zone because there's nothing that Angular cares about.
            // If it were to run inside the Angular zone, every test that used Overlay would have to be
            // either async or fakeAsync.
            this._ngZone.runOutsideAngular(function () {
                setTimeout(finishDetach_1, 500);
            });
        }
    };
    return OverlayRef;
}());
function formatCssUnit(value) {
    return typeof value === 'string' ? value : value + "px";
}

/** The points of the origin element and the overlay element to connect. */
var ConnectionPositionPair = (function () {
    function ConnectionPositionPair(origin, overlay) {
        this.originX = origin.originX;
        this.originY = origin.originY;
        this.overlayX = overlay.overlayX;
        this.overlayY = overlay.overlayY;
    }
    return ConnectionPositionPair;
}());
/** The change event emitted by the strategy when a fallback position is used. */
var ConnectedOverlayPositionChange = (function () {
    function ConnectedOverlayPositionChange(connectionPair) {
        this.connectionPair = connectionPair;
    }
    return ConnectedOverlayPositionChange;
}());

/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * implicit position relative some origin element. The relative position is defined in terms of
 * a point on the origin element that is connected to a point on the overlay element. For example,
 * a basic dropdown is connecting the bottom-left corner of the origin to the top-left corner
 * of the overlay.
 */
var ConnectedPositionStrategy = (function () {
    function ConnectedPositionStrategy(_connectedTo, _originPos, _overlayPos, _viewportRuler) {
        this._connectedTo = _connectedTo;
        this._originPos = _originPos;
        this._overlayPos = _overlayPos;
        this._viewportRuler = _viewportRuler;
        this._dir = 'ltr';
        /** The offset in pixels for the overlay connection point on the x-axis */
        this._offsetX = 0;
        /** The offset in pixels for the overlay connection point on the y-axis */
        this._offsetY = 0;
        /** Ordered list of preferred positions, from most to least desirable. */
        this._preferredPositions = [];
        this._onPositionChange = new rxjs_Subject.Subject();
        this._origin = this._connectedTo.nativeElement;
        this.withFallbackPosition(_originPos, _overlayPos);
    }
    Object.defineProperty(ConnectedPositionStrategy.prototype, "_isRtl", {
        /** Whether the we're dealing with an RTL context */
        get: function () {
            return this._dir === 'rtl';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "onPositionChange", {
        /** Emits an event when the connection point changes. */
        get: function () {
            return this._onPositionChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedPositionStrategy.prototype, "positions", {
        get: function () {
            return this._preferredPositions;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To be used to for any cleanup after the element gets destroyed.
     */
    ConnectedPositionStrategy.prototype.dispose = function () { };
    /**
     * Updates the position of the overlay element, using whichever preferred position relative
     * to the origin fits on-screen.
     * @docs-private
     */
    ConnectedPositionStrategy.prototype.apply = function (element) {
        // We need the bounding rects for the origin and the overlay to determine how to position
        // the overlay relative to the origin.
        var originRect = this._origin.getBoundingClientRect();
        var overlayRect = element.getBoundingClientRect();
        // We use the viewport rect to determine whether a position would go off-screen.
        var viewportRect = this._viewportRuler.getViewportRect();
        var firstOverlayPoint = null;
        // We want to place the overlay in the first of the preferred positions such that the
        // overlay fits on-screen.
        for (var _i = 0, _a = this._preferredPositions; _i < _a.length; _i++) {
            var pos = _a[_i];
            // Get the (x, y) point of connection on the origin, and then use that to get the
            // (top, left) coordinate for the overlay at `pos`.
            var originPoint = this._getOriginConnectionPoint(originRect, pos);
            var overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
            firstOverlayPoint = firstOverlayPoint || overlayPoint;
            // If the overlay in the calculated position fits on-screen, put it there and we're done.
            if (this._willOverlayFitWithinViewport(overlayPoint, overlayRect, viewportRect)) {
                this._setElementPosition(element, overlayPoint);
                this._onPositionChange.next(new ConnectedOverlayPositionChange(pos));
                return Promise.resolve(null);
            }
        }
        // TODO(jelbourn): fallback behavior for when none of the preferred positions fit on-screen.
        // For now, just stick it in the first position and let it go off-screen.
        this._setElementPosition(element, firstOverlayPoint);
        return Promise.resolve(null);
    };
    ConnectedPositionStrategy.prototype.withFallbackPosition = function (originPos, overlayPos) {
        this._preferredPositions.push(new ConnectionPositionPair(originPos, overlayPos));
        return this;
    };
    /** Sets the layout direction so the overlay's position can be adjusted to match. */
    ConnectedPositionStrategy.prototype.withDirection = function (dir) {
        this._dir = dir;
        return this;
    };
    /** Sets an offset for the overlay's connection point on the x-axis */
    ConnectedPositionStrategy.prototype.withOffsetX = function (offset) {
        this._offsetX = offset;
        return this;
    };
    /** Sets an offset for the overlay's connection point on the y-axis */
    ConnectedPositionStrategy.prototype.withOffsetY = function (offset) {
        this._offsetY = offset;
        return this;
    };
    /**
     * Gets the horizontal (x) "start" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getStartX = function (rect) {
        return this._isRtl ? rect.right : rect.left;
    };
    /**
     * Gets the horizontal (x) "end" dimension based on whether the overlay is in an RTL context.
     * @param rect
     */
    ConnectedPositionStrategy.prototype._getEndX = function (rect) {
        return this._isRtl ? rect.left : rect.right;
    };
    /**
     * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
     * @param originRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOriginConnectionPoint = function (originRect, pos) {
        var originStartX = this._getStartX(originRect);
        var originEndX = this._getEndX(originRect);
        var x;
        if (pos.originX == 'center') {
            x = originStartX + (originRect.width / 2);
        }
        else {
            x = pos.originX == 'start' ? originStartX : originEndX;
        }
        var y;
        if (pos.originY == 'center') {
            y = originRect.top + (originRect.height / 2);
        }
        else {
            y = pos.originY == 'top' ? originRect.top : originRect.bottom;
        }
        return { x: x, y: y };
    };
    /**
     * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
     * origin point to which the overlay should be connected.
     * @param originPoint
     * @param overlayRect
     * @param pos
     */
    ConnectedPositionStrategy.prototype._getOverlayPoint = function (originPoint, overlayRect, pos) {
        // Calculate the (overlayStartX, overlayStartY), the start of the potential overlay position
        // relative to the origin point.
        var overlayStartX;
        if (pos.overlayX == 'center') {
            overlayStartX = -overlayRect.width / 2;
        }
        else if (pos.overlayX === 'start') {
            overlayStartX = this._isRtl ? -overlayRect.width : 0;
        }
        else {
            overlayStartX = this._isRtl ? 0 : -overlayRect.width;
        }
        var overlayStartY;
        if (pos.overlayY == 'center') {
            overlayStartY = -overlayRect.height / 2;
        }
        else {
            overlayStartY = pos.overlayY == 'top' ? 0 : -overlayRect.height;
        }
        return {
            x: originPoint.x + overlayStartX + this._offsetX,
            y: originPoint.y + overlayStartY + this._offsetY
        };
    };
    /**
     * Gets whether the overlay positioned at the given point will fit on-screen.
     * @param overlayPoint The top-left coordinate of the overlay.
     * @param overlayRect Bounding rect of the overlay, used to get its size.
     * @param viewportRect The bounding viewport.
     */
    ConnectedPositionStrategy.prototype._willOverlayFitWithinViewport = function (overlayPoint, overlayRect, viewportRect) {
        // TODO(jelbourn): probably also want some space between overlay edge and viewport edge.
        return overlayPoint.x >= 0 &&
            overlayPoint.x + overlayRect.width <= viewportRect.width &&
            overlayPoint.y >= 0 &&
            overlayPoint.y + overlayRect.height <= viewportRect.height;
    };
    /**
     * Physically positions the overlay element to the given coordinate.
     * @param element
     * @param overlayPoint
     */
    ConnectedPositionStrategy.prototype._setElementPosition = function (element, overlayPoint) {
        element.style.left = overlayPoint.x + 'px';
        element.style.top = overlayPoint.y + 'px';
    };
    return ConnectedPositionStrategy;
}());

/**
 * A strategy for positioning overlays. Using this strategy, an overlay is given an
 * explicit position relative to the browser's viewport. We use flexbox, instead of
 * transforms, in order to avoid issues with subpixel rendering which can cause the
 * element to become blurry.
 */
var GlobalPositionStrategy = (function () {
    function GlobalPositionStrategy() {
        this._cssPosition = 'static';
        this._topOffset = '';
        this._bottomOffset = '';
        this._leftOffset = '';
        this._rightOffset = '';
        this._alignItems = '';
        this._justifyContent = '';
        this._width = '';
        this._height = '';
    }
    /** Sets the top position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.top = function (value) {
        this._bottomOffset = '';
        this._topOffset = value;
        this._alignItems = 'flex-start';
        return this;
    };
    /** Sets the left position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.left = function (value) {
        this._rightOffset = '';
        this._leftOffset = value;
        this._justifyContent = 'flex-start';
        return this;
    };
    /** Sets the bottom position of the overlay. Clears any previously set vertical position. */
    GlobalPositionStrategy.prototype.bottom = function (value) {
        this._topOffset = '';
        this._bottomOffset = value;
        this._alignItems = 'flex-end';
        return this;
    };
    /** Sets the right position of the overlay. Clears any previously set horizontal position. */
    GlobalPositionStrategy.prototype.right = function (value) {
        this._leftOffset = '';
        this._rightOffset = value;
        this._justifyContent = 'flex-end';
        return this;
    };
    /** Sets the overlay width and clears any previously set width. */
    GlobalPositionStrategy.prototype.width = function (value) {
        this._width = value;
        // When the width is 100%, we should reset the `left` and the offset,
        // in order to ensure that the element is flush against the viewport edge.
        if (value === '100%') {
            this.left('0px');
        }
        return this;
    };
    /** Sets the overlay height and clears any previously set height. */
    GlobalPositionStrategy.prototype.height = function (value) {
        this._height = value;
        // When the height is 100%, we should reset the `top` and the offset,
        // in order to ensure that the element is flush against the viewport edge.
        if (value === '100%') {
            this.top('0px');
        }
        return this;
    };
    /**
     * Centers the overlay horizontally with an optional offset.
     * Clears any previously set horizontal position.
     */
    GlobalPositionStrategy.prototype.centerHorizontally = function (offset) {
        if (offset === void 0) { offset = ''; }
        this.left(offset);
        this._justifyContent = 'center';
        return this;
    };
    /**
     * Centers the overlay vertically with an optional offset.
     * Clears any previously set vertical position.
     */
    GlobalPositionStrategy.prototype.centerVertically = function (offset) {
        if (offset === void 0) { offset = ''; }
        this.top(offset);
        this._alignItems = 'center';
        return this;
    };
    /**
     * Apply the position to the element.
     * @docs-private
     */
    GlobalPositionStrategy.prototype.apply = function (element) {
        if (!this._wrapper) {
            this._wrapper = document.createElement('div');
            this._wrapper.classList.add('md-global-overlay-wrapper');
            element.parentNode.insertBefore(this._wrapper, element);
            this._wrapper.appendChild(element);
        }
        var styles = element.style;
        var parentStyles = element.parentNode.style;
        styles.position = this._cssPosition;
        styles.marginTop = this._topOffset;
        styles.marginLeft = this._leftOffset;
        styles.marginBottom = this._bottomOffset;
        styles.marginRight = this._rightOffset;
        styles.width = this._width;
        styles.height = this._height;
        parentStyles.justifyContent = this._justifyContent;
        parentStyles.alignItems = this._alignItems;
        return Promise.resolve(null);
    };
    /**
     * Removes the wrapper element from the DOM.
     */
    GlobalPositionStrategy.prototype.dispose = function () {
        if (this._wrapper && this._wrapper.parentNode) {
            this._wrapper.parentNode.removeChild(this._wrapper);
            this._wrapper = null;
        }
    };
    return GlobalPositionStrategy;
}());

var __decorate$9 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$9 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Builder for overlay position strategy. */
var OverlayPositionBuilder = (function () {
    function OverlayPositionBuilder(_viewportRuler) {
        this._viewportRuler = _viewportRuler;
    }
    /** Creates a global position strategy. */
    OverlayPositionBuilder.prototype.global = function () {
        return new GlobalPositionStrategy();
    };
    /** Creates a relative position strategy. */
    OverlayPositionBuilder.prototype.connectedTo = function (elementRef, originPos, overlayPos) {
        return new ConnectedPositionStrategy(elementRef, originPos, overlayPos, this._viewportRuler);
    };
    OverlayPositionBuilder = __decorate$9([
        _angular_core.Injectable(), 
        __metadata$9('design:paramtypes', [ViewportRuler])
    ], OverlayPositionBuilder);
    return OverlayPositionBuilder;
}());

/**
 * The OverlayContainer is the container in which all overlays will load.
 * It should be provided in the root component to ensure it is properly shared.
 */
var OverlayContainer = (function () {
    function OverlayContainer() {
    }
    /**
     * This method returns the overlay container element.  It will lazily
     * create the element the first time  it is called to facilitate using
     * the container in non-browser environments.
     * @returns {HTMLElement} the container element
     */
    OverlayContainer.prototype.getContainerElement = function () {
        if (!this._containerElement) {
            this._createContainer();
        }
        return this._containerElement;
    };
    /**
     * Create the overlay container element, which is simply a div
     * with the 'md-overlay-container' class on the document body.
     */
    OverlayContainer.prototype._createContainer = function () {
        var container = document.createElement('div');
        container.classList.add('md-overlay-container');
        document.body.appendChild(container);
        this._containerElement = container;
    };
    return OverlayContainer;
}());

var __decorate$8 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$8 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Next overlay unique ID. */
var nextUniqueId = 0;
/** The default state for newly created overlays. */
var defaultState = new OverlayState();
/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
var Overlay = (function () {
    function Overlay(_overlayContainer, _componentFactoryResolver, _positionBuilder, _appRef, _injector, _ngZone) {
        this._overlayContainer = _overlayContainer;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._positionBuilder = _positionBuilder;
        this._appRef = _appRef;
        this._injector = _injector;
        this._ngZone = _ngZone;
    }
    /**
     * Creates an overlay.
     * @param state State to apply to the overlay.
     * @returns A reference to the created overlay.
     */
    Overlay.prototype.create = function (state) {
        if (state === void 0) { state = defaultState; }
        return this._createOverlayRef(this._createPaneElement(), state);
    };
    /**
     * Returns a position builder that can be used, via fluent API,
     * to construct and configure a position strategy.
     */
    Overlay.prototype.position = function () {
        return this._positionBuilder;
    };
    /**
     * Creates the DOM element for an overlay and appends it to the overlay container.
     * @returns Promise resolving to the created element.
     */
    Overlay.prototype._createPaneElement = function () {
        var pane = document.createElement('div');
        pane.id = "md-overlay-" + nextUniqueId++;
        pane.classList.add('md-overlay-pane');
        this._overlayContainer.getContainerElement().appendChild(pane);
        return pane;
    };
    /**
     * Create a DomPortalHost into which the overlay content can be loaded.
     * @param pane The DOM element to turn into a portal host.
     * @returns A portal host for the given DOM element.
     */
    Overlay.prototype._createPortalHost = function (pane) {
        return new DomPortalHost(pane, this._componentFactoryResolver, this._appRef, this._injector);
    };
    /**
     * Creates an OverlayRef for an overlay in the given DOM element.
     * @param pane DOM element for the overlay
     * @param state
     * @returns {OverlayRef}
     */
    Overlay.prototype._createOverlayRef = function (pane, state) {
        return new OverlayRef(this._createPortalHost(pane), pane, state, this._ngZone);
    };
    Overlay = __decorate$8([
        _angular_core.Injectable(), 
        __metadata$8('design:paramtypes', [OverlayContainer, _angular_core.ComponentFactoryResolver, OverlayPositionBuilder, _angular_core.ApplicationRef, _angular_core.Injector, _angular_core.NgZone])
    ], Overlay);
    return Overlay;
}());
/** Providers for Overlay and its related injectables. */
var OVERLAY_PROVIDERS = [
    ViewportRuler,
    OverlayPositionBuilder,
    Overlay,
    OverlayContainer,
];

var __decorate$7 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$7 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$1 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/** Default set of positions for the overlay. Follows the behavior of a dropdown. */
var defaultPositionList = [
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
];
/**
 * Directive applied to an element to make it usable as an origin for an Overlay using a
 * ConnectedPositionStrategy.
 */
var OverlayOrigin = (function () {
    function OverlayOrigin(_elementRef) {
        this._elementRef = _elementRef;
    }
    Object.defineProperty(OverlayOrigin.prototype, "elementRef", {
        get: function () {
            return this._elementRef;
        },
        enumerable: true,
        configurable: true
    });
    OverlayOrigin = __decorate$7([
        _angular_core.Directive({
            selector: '[overlay-origin]',
            exportAs: 'overlayOrigin',
        }), 
        __metadata$7('design:paramtypes', [_angular_core.ElementRef])
    ], OverlayOrigin);
    return OverlayOrigin;
}());
/**
 * Directive to facilitate declarative creation of an Overlay using a ConnectedPositionStrategy.
 */
var ConnectedOverlayDirective = (function () {
    // TODO(jelbourn): inputs for size, scroll behavior, animation, etc.
    function ConnectedOverlayDirective(_overlay, templateRef, viewContainerRef, _dir) {
        this._overlay = _overlay;
        this._dir = _dir;
        this._open = false;
        this._hasBackdrop = false;
        this._offsetX = 0;
        this._offsetY = 0;
        /** Event emitted when the backdrop is clicked. */
        this.backdropClick = new _angular_core.EventEmitter();
        this.positionChange = new _angular_core.EventEmitter();
        this.attach = new _angular_core.EventEmitter();
        this.detach = new _angular_core.EventEmitter();
        this._templatePortal = new TemplatePortal(templateRef, viewContainerRef);
    }
    Object.defineProperty(ConnectedOverlayDirective.prototype, "offsetX", {
        /** The offset in pixels for the overlay connection point on the x-axis */
        get: function () {
            return this._offsetX;
        },
        set: function (offsetX) {
            this._offsetX = offsetX;
            if (this._position) {
                this._position.withOffsetX(offsetX);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "offsetY", {
        /** The offset in pixels for the overlay connection point on the y-axis */
        get: function () {
            return this._offsetY;
        },
        set: function (offsetY) {
            this._offsetY = offsetY;
            if (this._position) {
                this._position.withOffsetY(offsetY);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "hasBackdrop", {
        /** Whether or not the overlay should attach a backdrop. */
        get: function () {
            return this._hasBackdrop;
        },
        // TODO: move the boolean coercion logic to a shared function in core
        set: function (value) {
            this._hasBackdrop = value != null && "" + value !== 'false';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "open", {
        get: function () {
            return this._open;
        },
        set: function (value) {
            value ? this._attachOverlay() : this._detachOverlay();
            this._open = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "overlayRef", {
        get: function () {
            return this._overlayRef;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConnectedOverlayDirective.prototype, "dir", {
        get: function () {
            return this._dir ? this._dir.value : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    ConnectedOverlayDirective.prototype.ngOnDestroy = function () {
        this._destroyOverlay();
    };
    /** Creates an overlay */
    ConnectedOverlayDirective.prototype._createOverlay = function () {
        if (!this.positions || !this.positions.length) {
            this.positions = defaultPositionList;
        }
        this._overlayRef = this._overlay.create(this._buildConfig());
    };
    /** Builds the overlay config based on the directive's inputs */
    ConnectedOverlayDirective.prototype._buildConfig = function () {
        var overlayConfig = new OverlayState();
        if (this.width || this.width === 0) {
            overlayConfig.width = this.width;
        }
        if (this.height || this.height === 0) {
            overlayConfig.height = this.height;
        }
        if (this.minWidth || this.minWidth === 0) {
            overlayConfig.minWidth = this.minWidth;
        }
        if (this.minHeight || this.minHeight === 0) {
            overlayConfig.minHeight = this.minHeight;
        }
        overlayConfig.hasBackdrop = this.hasBackdrop;
        if (this.backdropClass) {
            overlayConfig.backdropClass = this.backdropClass;
        }
        this._position = this._createPositionStrategy();
        overlayConfig.positionStrategy = this._position;
        overlayConfig.direction = this.dir;
        return overlayConfig;
    };
    /** Returns the position strategy of the overlay to be set on the overlay config */
    ConnectedOverlayDirective.prototype._createPositionStrategy = function () {
        var pos = this.positions[0];
        var originPoint = { originX: pos.originX, originY: pos.originY };
        var overlayPoint = { overlayX: pos.overlayX, overlayY: pos.overlayY };
        var strategy = this._overlay.position()
            .connectedTo(this.origin.elementRef, originPoint, overlayPoint)
            .withDirection(this.dir)
            .withOffsetX(this.offsetX)
            .withOffsetY(this.offsetY);
        this._handlePositionChanges(strategy);
        return strategy;
    };
    ConnectedOverlayDirective.prototype._handlePositionChanges = function (strategy) {
        var _this = this;
        for (var i = 1; i < this.positions.length; i++) {
            strategy.withFallbackPosition({ originX: this.positions[i].originX, originY: this.positions[i].originY }, { overlayX: this.positions[i].overlayX, overlayY: this.positions[i].overlayY });
        }
        this._positionSubscription =
            strategy.onPositionChange.subscribe(function (pos) { return _this.positionChange.emit(pos); });
    };
    /** Attaches the overlay and subscribes to backdrop clicks if backdrop exists */
    ConnectedOverlayDirective.prototype._attachOverlay = function () {
        var _this = this;
        if (!this._overlayRef) {
            this._createOverlay();
        }
        if (!this._overlayRef.hasAttached()) {
            this._overlayRef.attach(this._templatePortal);
            this.attach.emit();
        }
        if (this.hasBackdrop) {
            this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function () {
                _this.backdropClick.emit();
            });
        }
    };
    /** Detaches the overlay and unsubscribes to backdrop clicks if backdrop exists */
    ConnectedOverlayDirective.prototype._detachOverlay = function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this.detach.emit();
        }
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
            this._backdropSubscription = null;
        }
    };
    /** Destroys the overlay created by this directive. */
    ConnectedOverlayDirective.prototype._destroyOverlay = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
    };
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', OverlayOrigin)
    ], ConnectedOverlayDirective.prototype, "origin", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Array)
    ], ConnectedOverlayDirective.prototype, "positions", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Number)
    ], ConnectedOverlayDirective.prototype, "offsetX", null);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "offsetY", null);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "width", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "height", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "minWidth", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "minHeight", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', String)
    ], ConnectedOverlayDirective.prototype, "backdropClass", void 0);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "hasBackdrop", null);
    __decorate$7([
        _angular_core.Input(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "open", null);
    __decorate$7([
        _angular_core.Output(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "backdropClick", void 0);
    __decorate$7([
        _angular_core.Output(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "positionChange", void 0);
    __decorate$7([
        _angular_core.Output(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "attach", void 0);
    __decorate$7([
        _angular_core.Output(), 
        __metadata$7('design:type', Object)
    ], ConnectedOverlayDirective.prototype, "detach", void 0);
    ConnectedOverlayDirective = __decorate$7([
        _angular_core.Directive({
            selector: '[connected-overlay]',
            exportAs: 'connectedOverlay'
        }),
        __param$1(3, _angular_core.Optional()), 
        __metadata$7('design:paramtypes', [Overlay, _angular_core.TemplateRef, _angular_core.ViewContainerRef, Dir])
    ], ConnectedOverlayDirective);
    return ConnectedOverlayDirective;
}());
var OverlayModule = (function () {
    function OverlayModule() {
    }
    OverlayModule.forRoot = function () {
        return {
            ngModule: OverlayModule,
            providers: OVERLAY_PROVIDERS,
        };
    };
    OverlayModule = __decorate$7([
        _angular_core.NgModule({
            imports: [PortalModule],
            exports: [ConnectedOverlayDirective, OverlayOrigin],
            declarations: [ConnectedOverlayDirective, OverlayOrigin],
        }), 
        __metadata$7('design:paramtypes', [])
    ], OverlayModule);
    return OverlayModule;
}());

var __decorate$13 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$13 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Whether the current platform supports the V8 Break Iterator. The V8 check
// is necessary to detect all Blink based browsers.
var hasV8BreakIterator = typeof (window) !== 'undefined' ?
    (window.Intl && window.Intl.v8BreakIterator) :
    (typeof (Intl) !== 'undefined' && Intl.v8BreakIterator);
/**
 * Service to detect the current platform by comparing the userAgent strings and
 * checking browser-specific global properties.
 * @docs-private
 */
var MdPlatform = (function () {
    function MdPlatform() {
        /** Layout Engines */
        this.EDGE = /(edge)/i.test(navigator.userAgent);
        this.TRIDENT = /(msie|trident)/i.test(navigator.userAgent);
        // EdgeHTML and Trident mock Blink specific things and need to excluded from this check.
        this.BLINK = !!(window.chrome || hasV8BreakIterator) && !!CSS && !this.EDGE && !this.TRIDENT;
        // Webkit is part of the userAgent in EdgeHTML Blink and Trident, so we need to
        // ensure that Webkit runs standalone and is not use as another engines base.
        this.WEBKIT = /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
        /** Browsers and Platform Types */
        this.IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        // It's difficult to detect the plain Gecko engine, because most of the browsers identify
        // them self as Gecko-like browsers and modify the userAgent's according to that.
        // Since we only cover one explicit Firefox case, we can simply check for Firefox
        // instead of having an unstable check for Gecko.
        this.FIREFOX = /(firefox|minefield)/i.test(navigator.userAgent);
        // Trident on mobile adds the android platform to the userAgent to trick detections.
        this.ANDROID = /android/i.test(navigator.userAgent) && !this.TRIDENT;
    }
    MdPlatform = __decorate$13([
        _angular_core.Injectable(), 
        __metadata$13('design:paramtypes', [])
    ], MdPlatform);
    return MdPlatform;
}());

var __decorate$12 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$12 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* The InteractivityChecker leans heavily on the ally.js accessibility utilities.
 * Methods like `isTabbable` are only covering specific edge-cases for the browsers which are
 * supported.
 */
/**
 * Utility for checking the interactivity of an element, such as whether is is focusable or
 * tabbable.
 */
var InteractivityChecker = (function () {
    function InteractivityChecker(_platform) {
        this._platform = _platform;
    }
    /** Gets whether an element is disabled. */
    InteractivityChecker.prototype.isDisabled = function (element) {
        // This does not capture some cases, such as a non-form control with a disabled attribute or
        // a form control inside of a disabled form, but should capture the most common cases.
        return element.hasAttribute('disabled');
    };
    /**
     * Gets whether an element is visible for the purposes of interactivity.
     *
     * This will capture states like `display: none` and `visibility: hidden`, but not things like
     * being clipped by an `overflow: hidden` parent or being outside the viewport.
     */
    InteractivityChecker.prototype.isVisible = function (element) {
        return hasGeometry(element) && getComputedStyle(element).visibility === 'visible';
    };
    /**
     * Gets whether an element can be reached via Tab key.
     * Assumes that the element has already been checked with isFocusable.
     */
    InteractivityChecker.prototype.isTabbable = function (element) {
        var frameElement = getWindow(element).frameElement;
        if (frameElement) {
            var frameType = frameElement && frameElement.nodeName.toLowerCase();
            // Frame elements inherit their tabindex onto all child elements.
            if (getTabIndexValue(frameElement) === -1) {
                return false;
            }
            // Webkit and Blink consider anything inside of an <object> element as non-tabbable.
            if ((this._platform.BLINK || this._platform.WEBKIT) && frameType === 'object') {
                return false;
            }
            // Webkit and Blink disable tabbing to an element inside of an invisible frame.
            if ((this._platform.BLINK || this._platform.WEBKIT) && !this.isVisible(frameElement)) {
                return false;
            }
        }
        var nodeName = element.nodeName.toLowerCase();
        var tabIndexValue = getTabIndexValue(element);
        if (element.hasAttribute('contenteditable')) {
            return tabIndexValue !== -1;
        }
        if (nodeName === 'iframe') {
            // The frames may be tabbable depending on content, but it's not possibly to reliably
            // investigate the content of the frames.
            return false;
        }
        if (nodeName === 'audio') {
            if (!element.hasAttribute('controls')) {
                // By default an <audio> element without the controls enabled is not tabbable.
                return false;
            }
            else if (this._platform.BLINK) {
                // In Blink <audio controls> elements are always tabbable.
                return true;
            }
        }
        if (nodeName === 'video') {
            if (!element.hasAttribute('controls') && this._platform.TRIDENT) {
                // In Trident a <video> element without the controls enabled is not tabbable.
                return false;
            }
            else if (this._platform.BLINK || this._platform.FIREFOX) {
                // In Chrome and Firefox <video controls> elements are always tabbable.
                return true;
            }
        }
        if (nodeName === 'object' && (this._platform.BLINK || this._platform.WEBKIT)) {
            // In all Blink and WebKit based browsers <object> elements are never tabbable.
            return false;
        }
        // In iOS the browser only considers some specific elements as tabbable.
        if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
            return false;
        }
        return element.tabIndex >= 0;
    };
    /** Gets whether an element can be focused by the user. */
    InteractivityChecker.prototype.isFocusable = function (element) {
        // Perform checks in order of left to most expensive.
        // Again, naive approach that does not capture many edge cases and browser quirks.
        return isPotentiallyFocusable(element) && !this.isDisabled(element) && this.isVisible(element);
    };
    InteractivityChecker = __decorate$12([
        _angular_core.Injectable(), 
        __metadata$12('design:paramtypes', [MdPlatform])
    ], InteractivityChecker);
    return InteractivityChecker;
}());
/** Checks whether the specified element has any geometry / rectangles. */
function hasGeometry(element) {
    // Use logic from jQuery to check for an invisible element.
    // See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js#L12
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
/** Gets whether an element's  */
function isNativeFormElement(element) {
    var nodeName = element.nodeName.toLowerCase();
    return nodeName === 'input' ||
        nodeName === 'select' ||
        nodeName === 'button' ||
        nodeName === 'textarea';
}
/** Gets whether an element is an <input type="hidden">. */
function isHiddenInput(element) {
    return isInputElement(element) && element.type == 'hidden';
}
/** Gets whether an element is an anchor that has an href attribute. */
function isAnchorWithHref(element) {
    return isAnchorElement(element) && element.hasAttribute('href');
}
/** Gets whether an element is an input element. */
function isInputElement(element) {
    return element.nodeName == 'input';
}
/** Gets whether an element is an anchor element. */
function isAnchorElement(element) {
    return element.nodeName.toLowerCase() == 'a';
}
/** Gets whether an element has a valid tabindex. */
function hasValidTabIndex(element) {
    if (!element.hasAttribute('tabindex') || element.tabIndex === undefined) {
        return false;
    }
    var tabIndex = element.getAttribute('tabindex');
    // IE11 parses tabindex="" as the value "-32768"
    if (tabIndex == '-32768') {
        return false;
    }
    return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
/**
 * Returns the parsed tabindex from the element attributes instead of returning the
 * evaluated tabindex from the browsers defaults.
 */
function getTabIndexValue(element) {
    if (!hasValidTabIndex(element)) {
        return null;
    }
    // See browser issue in Gecko https://bugzilla.mozilla.org/show_bug.cgi?id=1128054
    var tabIndex = parseInt(element.getAttribute('tabindex'), 10);
    return isNaN(tabIndex) ? -1 : tabIndex;
}
/** Checks whether the specified element is potentially tabbable on iOS */
function isPotentiallyTabbableIOS(element) {
    var nodeName = element.nodeName.toLowerCase();
    var inputType = nodeName === 'input' && element.type;
    return inputType === 'text'
        || inputType === 'password'
        || nodeName === 'select'
        || nodeName === 'textarea';
}
/**
 * Gets whether an element is potentially focusable without taking current visible/disabled state
 * into account.
 */
function isPotentiallyFocusable(element) {
    // Inputs are potentially focusable *unless* they're type="hidden".
    if (isHiddenInput(element)) {
        return false;
    }
    return isNativeFormElement(element) ||
        isAnchorWithHref(element) ||
        element.hasAttribute('contenteditable') ||
        hasValidTabIndex(element);
}
/** Gets the parent window of a DOM node with regards of being inside of an iframe. */
function getWindow(node) {
    return node.ownerDocument.defaultView || window;
}

/** Coerces a data-bound value (typically a string) to a boolean. */
function coerceBooleanProperty(value) {
    return value != null && "" + value !== 'false';
}

var __decorate$11 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$11 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Directive for trapping focus within a region.
 *
 * NOTE: This directive currently uses a very simple (naive) approach to focus trapping.
 * It assumes that the tab order is the same as DOM order, which is not necessarily true.
 * Things like tabIndex > 0, flex `order`, and shadow roots can cause to two to misalign.
 * This will be replaced with a more intelligent solution before the library is considered stable.
 */
var FocusTrap = (function () {
    function FocusTrap(_checker, _ngZone) {
        this._checker = _checker;
        this._ngZone = _ngZone;
        this._disabled = false;
    }
    Object.defineProperty(FocusTrap.prototype, "disabled", {
        /** Whether the focus trap is active. */
        get: function () { return this._disabled; },
        set: function (val) { this._disabled = coerceBooleanProperty(val); },
        enumerable: true,
        configurable: true
    });
    /**
     * Waits for microtask queue to empty, then focuses the first tabbable element within the focus
     * trap region.
     */
    FocusTrap.prototype.focusFirstTabbableElementWhenReady = function () {
        var _this = this;
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this.focusFirstTabbableElement();
        });
    };
    /**
     * Waits for microtask queue to empty, then focuses the last tabbable element within the focus
     * trap region.
     */
    FocusTrap.prototype.focusLastTabbableElementWhenReady = function () {
        var _this = this;
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            _this.focusLastTabbableElement();
        });
    };
    /** Focuses the first tabbable element within the focus trap region. */
    FocusTrap.prototype.focusFirstTabbableElement = function () {
        var rootElement = this.trappedContent.nativeElement;
        var redirectToElement = rootElement.querySelector('[md-focus-start]') ||
            this._getFirstTabbableElement(rootElement);
        if (redirectToElement) {
            redirectToElement.focus();
        }
    };
    /** Focuses the last tabbable element within the focus trap region. */
    FocusTrap.prototype.focusLastTabbableElement = function () {
        var rootElement = this.trappedContent.nativeElement;
        var focusTargets = rootElement.querySelectorAll('[md-focus-end]');
        var redirectToElement = null;
        if (focusTargets.length) {
            redirectToElement = focusTargets[focusTargets.length - 1];
        }
        else {
            redirectToElement = this._getLastTabbableElement(rootElement);
        }
        if (redirectToElement) {
            redirectToElement.focus();
        }
    };
    /** Get the first tabbable element from a DOM subtree (inclusive). */
    FocusTrap.prototype._getFirstTabbableElement = function (root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in DOM order.
        var childCount = root.children.length;
        for (var i = 0; i < childCount; i++) {
            var tabbableChild = this._getFirstTabbableElement(root.children[i]);
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    };
    /** Get the last tabbable element from a DOM subtree (inclusive). */
    FocusTrap.prototype._getLastTabbableElement = function (root) {
        if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
            return root;
        }
        // Iterate in reverse DOM order.
        for (var i = root.children.length - 1; i >= 0; i--) {
            var tabbableChild = this._getLastTabbableElement(root.children[i]);
            if (tabbableChild) {
                return tabbableChild;
            }
        }
        return null;
    };
    __decorate$11([
        _angular_core.ViewChild('trappedContent'), 
        __metadata$11('design:type', _angular_core.ElementRef)
    ], FocusTrap.prototype, "trappedContent", void 0);
    __decorate$11([
        _angular_core.Input(), 
        __metadata$11('design:type', Boolean)
    ], FocusTrap.prototype, "disabled", null);
    FocusTrap = __decorate$11([
        _angular_core.Component({selector: 'focus-trap',
            template: "<div *ngif=\"!disabled\" tabindex=\"0\" (focus)=\"focusLastTabbableElement()\"></div><div #trappedcontent class=\"cdk-focus-trap-content\"><ng-content></ng-content></div><div *ngif=\"!disabled\" tabindex=\"0\" (focus)=\"focusFirstTabbableElement()\"></div>",
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$11('design:paramtypes', [InteractivityChecker, _angular_core.NgZone])
    ], FocusTrap);
    return FocusTrap;
}());

var __decorate$14 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$14 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$2 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LIVE_ANNOUNCER_ELEMENT_TOKEN = new _angular_core.OpaqueToken('mdLiveAnnouncerElement');
var MdLiveAnnouncer = (function () {
    function MdLiveAnnouncer(elementToken) {
        // We inject the live element as `any` because the constructor signature cannot reference
        // browser globals (HTMLElement) on non-browser environments, since having a class decorator
        // causes TypeScript to preserve the constructor signature types.
        this._liveElement = elementToken || this._createLiveElement();
    }
    /**
     * @param message Message to be announced to the screenreader
     * @param politeness The politeness of the announcer element.
     */
    MdLiveAnnouncer.prototype.announce = function (message, politeness) {
        var _this = this;
        if (politeness === void 0) { politeness = 'polite'; }
        this._liveElement.textContent = '';
        // TODO: ensure changing the politeness works on all environments we support.
        this._liveElement.setAttribute('aria-live', politeness);
        // This 100ms timeout is necessary for some browser + screen-reader combinations:
        // - Both JAWS and NVDA over IE11 will not announce anything without a non-zero timeout.
        // - With Chrome and IE11 with NVDA or JAWS, a repeated (identical) message won't be read a
        //   second time without clearing and then using a non-zero delay.
        // (using JAWS 17 at time of this writing).
        setTimeout(function () { return _this._liveElement.textContent = message; }, 100);
    };
    /** Removes the aria-live element from the DOM. */
    MdLiveAnnouncer.prototype._removeLiveElement = function () {
        if (this._liveElement && this._liveElement.parentNode) {
            this._liveElement.parentNode.removeChild(this._liveElement);
        }
    };
    MdLiveAnnouncer.prototype._createLiveElement = function () {
        var liveEl = document.createElement('div');
        liveEl.classList.add('md-visually-hidden');
        liveEl.setAttribute('aria-atomic', 'true');
        liveEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(liveEl);
        return liveEl;
    };
    MdLiveAnnouncer = __decorate$14([
        _angular_core.Injectable(),
        __param$2(0, _angular_core.Optional()),
        __param$2(0, _angular_core.Inject(LIVE_ANNOUNCER_ELEMENT_TOKEN)), 
        __metadata$14('design:paramtypes', [Object])
    ], MdLiveAnnouncer);
    return MdLiveAnnouncer;
}());

var __decorate$15 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$15 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlatformModule = (function () {
    function PlatformModule() {
    }
    PlatformModule.forRoot = function () {
        return {
            ngModule: PlatformModule,
            providers: [MdPlatform],
        };
    };
    PlatformModule = __decorate$15([
        _angular_core.NgModule({}), 
        __metadata$15('design:paramtypes', [])
    ], PlatformModule);
    return PlatformModule;
}());

var __decorate$10 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$10 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var A11Y_PROVIDERS = [MdLiveAnnouncer, InteractivityChecker];
var A11yModule = (function () {
    function A11yModule() {
    }
    A11yModule.forRoot = function () {
        return {
            ngModule: A11yModule,
            providers: [
                PlatformModule.forRoot().providers,
                A11Y_PROVIDERS,
            ],
        };
    };
    A11yModule = __decorate$10([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, PlatformModule],
            declarations: [FocusTrap],
            exports: [FocusTrap],
        }), 
        __metadata$10('design:paramtypes', [])
    ], A11yModule);
    return A11yModule;
}());

var __decorate$16 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$16 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// "Polyfill" for `Node.replaceWith()`.
// cf. https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
function _replaceWith(toReplaceEl, otherEl) {
    toReplaceEl.parentElement.replaceChild(otherEl, toReplaceEl);
}
/** @docs-private */
var DomProjectionHost = (function () {
    function DomProjectionHost(ref) {
        this.ref = ref;
    }
    DomProjectionHost = __decorate$16([
        _angular_core.Directive({
            selector: 'dom-projection-host'
        }), 
        __metadata$16('design:paramtypes', [_angular_core.ElementRef])
    ], DomProjectionHost);
    return DomProjectionHost;
}());
/** @docs-private */
var DomProjection = (function () {
    function DomProjection() {
    }
    /**
     * Project an element into a host element.
     * Replace a host element by another element. This also replaces the children of the element
     * by the children of the host.
     *
     * It should be used like this:
     *
     * ```
     *   @Component({
     *     template: `<div>
     *       <dom-projection-host>
     *         <div>other</div>
     *         <ng-content></ng-content>
     *       </dom-projection-host>
     *     </div>`
     *   })
     *   class Cmpt {
     *     constructor(private _projector: DomProjection, private _el: ElementRef) {}
     *     ngOnInit() { this._projector.project(this._el, this._projector); }
     *   }
     * ```
     *
     * This component will move the content of the element it's applied to in the outer div. Because
     * `project()` also move the children of the host inside the projected element, the element will
     * contain the `<div>other</div>` HTML as well as its own children.
     *
     * Note: without `<ng-content></ng-content>` the projection will project an empty element.
     */
    DomProjection.prototype.project = function (ref, host) {
        var projectedEl = ref.nativeElement;
        var hostEl = host.ref.nativeElement;
        var childNodes = projectedEl.childNodes;
        var child = childNodes[0];
        // We hoist all of the projected element's children out into the projected elements position
        // because we *only* want to move the projected element and not its children.
        _replaceWith(projectedEl, child);
        var l = childNodes.length;
        while (l--) {
            child.parentNode.insertBefore(childNodes[0], child.nextSibling);
            child = child.nextSibling; // nextSibling is now the childNodes[0].
        }
        // Insert all host children under the projectedEl, then replace host by component.
        l = hostEl.childNodes.length;
        while (l--) {
            projectedEl.appendChild(hostEl.childNodes[0]);
        }
        _replaceWith(hostEl, projectedEl);
        // At this point the host is replaced by the component. Nothing else to be done.
    };
    DomProjection = __decorate$16([
        _angular_core.Injectable(), 
        __metadata$16('design:paramtypes', [])
    ], DomProjection);
    return DomProjection;
}());
/** @docs-private */
var ProjectionModule = (function () {
    function ProjectionModule() {
    }
    ProjectionModule.forRoot = function () {
        return {
            ngModule: ProjectionModule,
            providers: [DomProjection]
        };
    };
    ProjectionModule = __decorate$16([
        _angular_core.NgModule({
            exports: [DomProjectionHost],
            declarations: [DomProjectionHost],
        }), 
        __metadata$16('design:paramtypes', [])
    ], ProjectionModule);
    return ProjectionModule;
}());

var supportedInputTypes;
/** @returns {Set<string>} the input types supported by this browser. */
function getSupportedInputTypes() {
    if (!supportedInputTypes) {
        var featureTestInput_1 = document.createElement('input');
        supportedInputTypes = new Set([
            'button',
            'checkbox',
            'color',
            'date',
            'datetime-local',
            'email',
            'file',
            'hidden',
            'image',
            'month',
            'number',
            'password',
            'radio',
            'range',
            'reset',
            'search',
            'submit',
            'tel',
            'text',
            'time',
            'url',
            'week',
        ].filter(function (value) {
            featureTestInput_1.setAttribute('type', value);
            return featureTestInput_1.type === value;
        }));
    }
    return supportedInputTypes;
}

var __extends$5 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$17 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$17 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/* Adjusts configuration of our gesture library, Hammer. */
var MdGestureConfig = (function (_super) {
    __extends$5(MdGestureConfig, _super);
    function MdGestureConfig() {
        _super.apply(this, arguments);
        /* List of new event names to add to the gesture support list */
        this.events = [
            'longpress',
            'slide',
            'slidestart',
            'slideend',
            'slideright',
            'slideleft'
        ];
    }
    /*
     * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
     *
     * Our gesture names come from the Material Design gestures spec:
     * https://www.google.com/design/spec/patterns/gestures.html#gestures-touch-mechanics
     *
     * More information on default recognizers can be found in Hammer docs:
     * http://hammerjs.github.io/recognizer-pan/
     * http://hammerjs.github.io/recognizer-press/
     *
     * TODO: Confirm threshold numbers with Material Design UX Team
     * */
    MdGestureConfig.prototype.buildHammer = function (element) {
        var mc = new Hammer(element);
        // Default Hammer Recognizers.
        var pan = new Hammer.Pan();
        var swipe = new Hammer.Swipe();
        var press = new Hammer.Press();
        // Notice that a HammerJS recognizer can only depend on one other recognizer once.
        // Otherwise the previous `recognizeWith` will be dropped.
        var slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
        var longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });
        // Overwrite the default `pan` event to use the swipe event.
        pan.recognizeWith(swipe);
        // Add customized gestures to Hammer manager
        mc.add([swipe, press, pan, slide, longpress]);
        return mc;
    };
    /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
    MdGestureConfig.prototype._createRecognizer = function (base, options) {
        var inheritances = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            inheritances[_i - 2] = arguments[_i];
        }
        var recognizer = new base.constructor(options);
        inheritances.push(base);
        inheritances.forEach(function (item) { return recognizer.recognizeWith(item); });
        return recognizer;
    };
    MdGestureConfig = __decorate$17([
        _angular_core.Injectable(), 
        __metadata$17('design:paramtypes', [])
    ], MdGestureConfig);
    return MdGestureConfig;
}(_angular_platformBrowser.HammerGestureConfig));

/**
 * Screenreaders will often fire fake mousedown events when a focusable element
 * is activated using the keyboard. We can typically distinguish between these faked
 * mousedown events and real mousedown events using the "buttons" property. While
 * real mousedowns will indicate the mouse button that was pressed (e.g. "1" for
 * the left mouse button), faked mousedowns will usually set the property value to 0.
 */
function isFakeMousedownFromScreenReader(event) {
    return event.buttons === 0;
}

var __decorate$18 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$18 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
var MdUniqueSelectionDispatcher = (function () {
    function MdUniqueSelectionDispatcher() {
        this._listeners = [];
    }
    /** Notify other items that selection for the given name has been set. */
    MdUniqueSelectionDispatcher.prototype.notify = function (id, name) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(id, name);
        }
    };
    /** Listen for future changes to item selection. */
    MdUniqueSelectionDispatcher.prototype.listen = function (listener) {
        this._listeners.push(listener);
    };
    MdUniqueSelectionDispatcher = __decorate$18([
        _angular_core.Injectable(), 
        __metadata$18('design:paramtypes', [])
    ], MdUniqueSelectionDispatcher);
    return MdUniqueSelectionDispatcher;
}());

/**
 * Applies a CSS transform to an element, including browser-prefixed properties.
 * @param element
 * @param transformValue
 */
function applyCssTransform(element, transformValue) {
    // It's important to trim the result, because the browser will ignore the set operation
    // if the string contains only whitespace.
    var value = transformValue.trim();
    element.style.transform = value;
    element.style.webkitTransform = value;
}

// Due to a bug in the ChromeDriver, Angular 2 keyboard events are not triggered by `sendKeys`
// during E2E tests when using dot notation such as `(keydown.rightArrow)`. To get around this,
// we are temporarily using a single (keydown) handler.
// See: https://github.com/angular/angular/issues/9419
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var PAGE_UP = 33;
var PAGE_DOWN = 34;
var HOME = 36;
var END = 35;
var ENTER = 13;
var SPACE = 32;
var TAB = 9;
var ESCAPE = 27;
var BACKSPACE = 8;
var DELETE = 46;

/** @docs-private */
var AnimationCurves = (function () {
    function AnimationCurves() {
    }
    AnimationCurves.STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
    AnimationCurves.DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
    AnimationCurves.ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
    AnimationCurves.SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
    return AnimationCurves;
}());
/** @docs-private */
var AnimationDurations = (function () {
    function AnimationDurations() {
    }
    AnimationDurations.COMPLEX = '375ms';
    AnimationDurations.ENTERING = '225ms';
    AnimationDurations.EXITING = '195ms';
    return AnimationDurations;
}());

/** Coerces a data-bound value (typically a string) to a number. */
function coerceNumberProperty(value, fallbackValue) {
    if (fallbackValue === void 0) { fallbackValue = 0; }
    // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
    // and other non-number values as NaN, where Number just uses 0) but it considers the string
    // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
    return isNaN(parseFloat(value)) || isNaN(Number(value)) ? fallbackValue : Number(value);
}

var __decorate$19 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$19 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Selector that matches all elements that may have style collisions with material1. */
var MD_ELEMENTS_SELECTOR = "\n  md-autocomplete,\n  md-card,\n  md-card-actions,\n  md-card-content,\n  md-card-footer,\n  md-card-header,\n  md-card-subtitle,\n  md-card-title,\n  md-card-title-group,\n  md-checkbox,\n  md-chip,\n  md-dialog-container,\n  md-divider,\n  md-grid-list,\n  md-grid-tile,\n  md-grid-tile-footer,\n  md-grid-tile-header,\n  md-hint,\n  md-icon,\n  md-ink-bar,\n  md-input,\n  md-list,\n  md-list-item,\n  md-menu,\n  md-nav-list,\n  md-option,\n  md-placeholder,\n  md-progress-bar,\n  md-progress-circle,\n  md-radio-button,\n  md-radio-group,\n  md-select,\n  md-sidenav,\n  md-slider,\n  md-spinner,\n  md-tab,\n  md-toolbar\n";
/** Directive that enforces that the `md-` prefix cannot be used. */
var MdPrefixEnforcer = (function () {
    function MdPrefixEnforcer() {
        throw Error('The "md-" prefix cannot be used in ng-material v1 compatibility mode.');
    }
    MdPrefixEnforcer = __decorate$19([
        _angular_core.Directive({ selector: MD_ELEMENTS_SELECTOR }), 
        __metadata$19('design:paramtypes', [])
    ], MdPrefixEnforcer);
    return MdPrefixEnforcer;
}());
var NoConflictStyleCompatibilityMode = (function () {
    function NoConflictStyleCompatibilityMode() {
    }
    NoConflictStyleCompatibilityMode.forRoot = function () {
        return {
            ngModule: NoConflictStyleCompatibilityMode,
            providers: [],
        };
    };
    NoConflictStyleCompatibilityMode = __decorate$19([
        _angular_core.NgModule({
            declarations: [MdPrefixEnforcer],
            exports: [MdPrefixEnforcer],
            providers: [{
                    provide: MATERIAL_COMPATIBILITY_MODE, useValue: true,
                }],
        }), 
        __metadata$19('design:paramtypes', [])
    ], NoConflictStyleCompatibilityMode);
    return NoConflictStyleCompatibilityMode;
}());

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdCoreModule = (function () {
    function MdCoreModule() {
    }
    MdCoreModule.forRoot = function () {
        return {
            ngModule: MdCoreModule,
            providers: [A11Y_PROVIDERS, OVERLAY_PROVIDERS],
        };
    };
    MdCoreModule = __decorate([
        _angular_core.NgModule({
            imports: [MdLineModule, RtlModule, MdRippleModule, PortalModule, OverlayModule, A11yModule],
            exports: [MdLineModule, RtlModule, MdRippleModule, PortalModule, OverlayModule, A11yModule],
        }), 
        __metadata('design:paramtypes', [])
    ], MdCoreModule);
    return MdCoreModule;
}());

var __decorate$21 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$21 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$3 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Provider Expression that allows md-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
var MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdButtonToggleGroup; }),
    multi: true
};
var _uniqueIdCounter = 0;
/** Change event object emitted by MdButtonToggle. */
var MdButtonToggleChange = (function () {
    function MdButtonToggleChange() {
    }
    return MdButtonToggleChange;
}());
/** Exclusive selection button toggle group that behaves like a radio-button group. */
var MdButtonToggleGroup = (function () {
    function MdButtonToggleGroup() {
        /** The value for the button toggle group. Should match currently selected button toggle. */
        this._value = null;
        /** The HTML name attribute applied to toggles in this group. */
        this._name = "md-radio-group-" + _uniqueIdCounter++;
        /** Disables all toggles in the group. */
        this._disabled = null;
        /** Whether the button toggle group should be vertical. */
        this._vertical = false;
        /** The currently selected button toggle, should match the value. */
        this._selected = null;
        /** Whether the button toggle group is initialized or not. */
        this._isInitialized = false;
        /**
         * The method to be called in order to update ngModel.
         * Now `ngModel` binding is not supported in multiple selection mode.
         */
        this._controlValueAccessorChangeFn = function (value) { };
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /** Event emitted when the group's value changes. */
        this._change = new _angular_core.EventEmitter();
        /** Child button toggle buttons. */
        this._buttonToggles = null;
    }
    Object.defineProperty(MdButtonToggleGroup.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggleGroup.prototype.ngAfterViewInit = function () {
        this._isInitialized = true;
    };
    Object.defineProperty(MdButtonToggleGroup.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateButtonToggleNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "vertical", {
        get: function () {
            return this._vertical;
        },
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                this._value = newValue;
                this._updateSelectedButtonToggleFromValue();
                // Only emit a change event if the view is completely initialized.
                // We don't want to emit a change event for the initial values.
                if (this._isInitialized) {
                    this._emitChangeEvent();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroup.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            if (selected && !selected.checked) {
                selected.checked = true;
            }
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggleGroup.prototype._updateButtonToggleNames = function () {
        var _this = this;
        if (this._buttonToggles) {
            this._buttonToggles.forEach(function (toggle) {
                toggle.name = _this._name;
            });
        }
    };
    // TODO: Refactor into shared code with radio.
    MdButtonToggleGroup.prototype._updateSelectedButtonToggleFromValue = function () {
        var _this = this;
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._buttonToggles != null && !isAlreadySelected) {
            var matchingButtonToggle = this._buttonToggles.filter(function (buttonToggle) { return buttonToggle.value == _this._value; })[0];
            if (matchingButtonToggle) {
                this.selected = matchingButtonToggle;
            }
            else if (this.value == null) {
                this.selected = null;
                this._buttonToggles.forEach(function (buttonToggle) {
                    buttonToggle.checked = false;
                });
            }
        }
    };
    /** Dispatch change event with current selection and group value. */
    MdButtonToggleGroup.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this._selected;
        event.value = this._value;
        this._controlValueAccessorChangeFn(event.value);
        this._change.emit(event);
    };
    /** Implemented as part of ControlValueAccessor. */
    MdButtonToggleGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdButtonToggleGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdButtonToggleGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    __decorate$21([
        _angular_core.Output(), 
        __metadata$21('design:type', rxjs_Observable.Observable)
    ], MdButtonToggleGroup.prototype, "change", null);
    __decorate$21([
        _angular_core.ContentChildren(_angular_core.forwardRef(function () { return MdButtonToggle; })), 
        __metadata$21('design:type', _angular_core.QueryList)
    ], MdButtonToggleGroup.prototype, "_buttonToggles", void 0);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', String)
    ], MdButtonToggleGroup.prototype, "name", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggleGroup.prototype, "disabled", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggleGroup.prototype, "vertical", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Object)
    ], MdButtonToggleGroup.prototype, "value", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Object)
    ], MdButtonToggleGroup.prototype, "selected", null);
    MdButtonToggleGroup = __decorate$21([
        _angular_core.Directive({
            selector: 'md-button-toggle-group:not([multiple])',
            providers: [MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR],
            host: {
                'role': 'radiogroup',
                '[class.md-button-toggle-vertical]': 'vertical'
            },
            exportAs: 'mdButtonToggleGroup',
        }), 
        __metadata$21('design:paramtypes', [])
    ], MdButtonToggleGroup);
    return MdButtonToggleGroup;
}());
/** Multiple selection button-toggle group. `ngModel` is not supported in this mode. */
var MdButtonToggleGroupMultiple = (function () {
    function MdButtonToggleGroupMultiple() {
        /** Disables all toggles in the group. */
        this._disabled = null;
        /** Whether the button toggle group should be vertical. */
        this._vertical = false;
    }
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggleGroupMultiple.prototype, "vertical", {
        get: function () {
            return this._vertical;
        },
        set: function (value) {
            this._vertical = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggleGroupMultiple.prototype, "disabled", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggleGroupMultiple.prototype, "vertical", null);
    MdButtonToggleGroupMultiple = __decorate$21([
        _angular_core.Directive({
            selector: 'md-button-toggle-group[multiple]',
            exportAs: 'mdButtonToggleGroup',
            host: {
                '[class.md-button-toggle-vertical]': 'vertical'
            }
        }), 
        __metadata$21('design:paramtypes', [])
    ], MdButtonToggleGroupMultiple);
    return MdButtonToggleGroupMultiple;
}());
var MdButtonToggle = (function () {
    function MdButtonToggle(toggleGroup, toggleGroupMultiple, buttonToggleDispatcher, _renderer) {
        var _this = this;
        this.buttonToggleDispatcher = buttonToggleDispatcher;
        this._renderer = _renderer;
        /** Whether or not this button toggle is checked. */
        this._checked = false;
        /** Whether or not this button toggle is disabled. */
        this._disabled = null;
        /** Value assigned to this button toggle. */
        this._value = null;
        /** Whether or not the button toggle is a single selection. */
        this._isSingleSelector = null;
        /** Event emitted when the group value changes. */
        this._change = new _angular_core.EventEmitter();
        this.buttonToggleGroup = toggleGroup;
        this.buttonToggleGroupMultiple = toggleGroupMultiple;
        if (this.buttonToggleGroup) {
            buttonToggleDispatcher.listen(function (id, name) {
                if (id != _this.id && name == _this.name) {
                    _this.checked = false;
                }
            });
            this._type = 'radio';
            this.name = this.buttonToggleGroup.name;
            this._isSingleSelector = true;
        }
        else {
            // Even if there is no group at all, treat the button toggle as a checkbox so it can be
            // toggled on or off.
            this._type = 'checkbox';
            this._isSingleSelector = false;
        }
    }
    Object.defineProperty(MdButtonToggle.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    MdButtonToggle.prototype.ngOnInit = function () {
        if (this.id == null) {
            this.id = "md-button-toggle-" + _uniqueIdCounter++;
        }
        if (this.buttonToggleGroup && this._value == this.buttonToggleGroup.value) {
            this._checked = true;
        }
    };
    Object.defineProperty(MdButtonToggle.prototype, "inputId", {
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "checked", {
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (this._isSingleSelector) {
                if (newCheckedState) {
                    // Notify all button toggles with the same name (in the same group) to un-check.
                    this.buttonToggleDispatcher.notify(this.id, this.name);
                }
            }
            this._checked = newCheckedState;
            if (newCheckedState && this._isSingleSelector && this.buttonToggleGroup.value != this.value) {
                this.buttonToggleGroup.selected = this;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButtonToggle.prototype, "value", {
        /** MdButtonToggleGroup reads this to assign its own value. */
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value != value) {
                if (this.buttonToggleGroup != null && this.checked) {
                    this.buttonToggleGroup.value = value;
                }
                this._value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /** Dispatch change event with current value. */
    MdButtonToggle.prototype._emitChangeEvent = function () {
        var event = new MdButtonToggleChange();
        event.source = this;
        event.value = this._value;
        this._change.emit(event);
    };
    Object.defineProperty(MdButtonToggle.prototype, "disabled", {
        get: function () {
            return this._disabled || (this.buttonToggleGroup != null && this.buttonToggleGroup.disabled) ||
                (this.buttonToggleGroupMultiple != null && this.buttonToggleGroupMultiple.disabled);
        },
        set: function (value) {
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    /** Toggle the state of the current button toggle. */
    MdButtonToggle.prototype._toggle = function () {
        this.checked = !this.checked;
    };
    /** Checks the button toggle due to an interaction with the underlying native input. */
    MdButtonToggle.prototype._onInputChange = function (event) {
        event.stopPropagation();
        if (this._isSingleSelector) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button toggle as checked.
            this.checked = true;
            this.buttonToggleGroup.selected = this;
            this.buttonToggleGroup.onTouched();
        }
        else {
            this._toggle();
        }
        // Emit a change event when the native input does.
        this._emitChangeEvent();
    };
    MdButtonToggle.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdButtonToggle.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
    };
    __decorate$21([
        _angular_core.HostBinding(),
        _angular_core.Input(), 
        __metadata$21('design:type', String)
    ], MdButtonToggle.prototype, "id", void 0);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', String)
    ], MdButtonToggle.prototype, "name", void 0);
    __decorate$21([
        _angular_core.Output(), 
        __metadata$21('design:type', rxjs_Observable.Observable)
    ], MdButtonToggle.prototype, "change", null);
    __decorate$21([
        _angular_core.ViewChild('input'), 
        __metadata$21('design:type', _angular_core.ElementRef)
    ], MdButtonToggle.prototype, "_inputElement", void 0);
    __decorate$21([
        _angular_core.HostBinding('class.md-button-toggle-checked'),
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggle.prototype, "checked", null);
    __decorate$21([
        _angular_core.Input(), 
        __metadata$21('design:type', Object)
    ], MdButtonToggle.prototype, "value", null);
    __decorate$21([
        _angular_core.HostBinding('class.md-button-toggle-disabled'),
        _angular_core.Input(), 
        __metadata$21('design:type', Boolean)
    ], MdButtonToggle.prototype, "disabled", null);
    MdButtonToggle = __decorate$21([
        _angular_core.Component({selector: 'md-button-toggle',
            template: "<label [attr.for]=\"inputId\" class=\"md-button-toggle-label\"><input #input class=\"md-button-toggle-input md-visually-hidden\" [type]=\"_type\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" (change)=\"_onInputChange($event)\" (click)=\"_onInputClick($event)\"><div class=\"md-button-toggle-label-content\"><ng-content></ng-content></div></label>",
            styles: ["md-button-toggle-group{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);position:relative;display:inline-flex;flex-direction:row;border-radius:2px;cursor:pointer;white-space:nowrap}.md-button-toggle-vertical{flex-direction:column}.md-button-toggle-vertical .md-button-toggle-label-content{display:block}.md-button-toggle-disabled .md-button-toggle-label-content{cursor:default}md-button-toggle{white-space:nowrap}.md-button-toggle-label-content{display:inline-block;line-height:36px;padding:0 16px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-button-toggle-label-content>*{vertical-align:middle}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
        }),
        __param$3(0, _angular_core.Optional()),
        __param$3(1, _angular_core.Optional()), 
        __metadata$21('design:paramtypes', [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdUniqueSelectionDispatcher, _angular_core.Renderer])
    ], MdButtonToggle);
    return MdButtonToggle;
}());
var MdButtonToggleModule = (function () {
    function MdButtonToggleModule() {
    }
    MdButtonToggleModule.forRoot = function () {
        return {
            ngModule: MdButtonToggleModule,
            providers: [MdUniqueSelectionDispatcher]
        };
    };
    MdButtonToggleModule = __decorate$21([
        _angular_core.NgModule({
            imports: [_angular_forms.FormsModule, DefaultStyleCompatibilityModeModule],
            exports: [
                MdButtonToggleGroup,
                MdButtonToggleGroupMultiple,
                MdButtonToggle,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [MdButtonToggleGroup, MdButtonToggleGroupMultiple, MdButtonToggle],
        }), 
        __metadata$21('design:paramtypes', [])
    ], MdButtonToggleModule);
    return MdButtonToggleModule;
}());

var __extends$6 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$22 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$22 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// TODO(jelbourn): Make the `isMouseDown` stuff done with one global listener.
// TODO(kara): Convert attribute selectors to classes when attr maps become available
var MdButton = (function () {
    function MdButton(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** Whether the button has focus from the keyboard (not the mouse). Used for class binding. */
        this._isKeyboardFocused = false;
        /** Whether a mousedown has occurred on this element in the last 100ms. */
        this._isMouseDown = false;
        /** Whether the ripple effect on click should be disabled. */
        this._disableRipple = false;
        this._disabled = null;
    }
    Object.defineProperty(MdButton.prototype, "disableRipple", {
        /** Whether the ripple effect for this button is disabled. */
        get: function () { return this._disableRipple; },
        set: function (v) { this._disableRipple = coerceBooleanProperty(v); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButton.prototype, "disabled", {
        /** Whether the button is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value) ? true : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdButton.prototype, "color", {
        /** The color of the button. Can be `primary`, `accent`, or `warn`. */
        get: function () { return this._color; },
        set: function (value) { this._updateColor(value); },
        enumerable: true,
        configurable: true
    });
    MdButton.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMouseDown = true;
        setTimeout(function () { _this._isMouseDown = false; }, 100);
    };
    MdButton.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdButton.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdButton.prototype._setKeyboardFocus = function () {
        this._isKeyboardFocused = !this._isMouseDown;
    };
    MdButton.prototype._removeKeyboardFocus = function () {
        this._isKeyboardFocused = false;
    };
    /** Focuses the button. */
    MdButton.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
    };
    MdButton.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    MdButton.prototype._isRoundButton = function () {
        var el = this._elementRef.nativeElement;
        return el.hasAttribute('md-icon-button') ||
            el.hasAttribute('md-fab') ||
            el.hasAttribute('md-mini-fab');
    };
    MdButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    __decorate$22([
        _angular_core.Input(), 
        __metadata$22('design:type', Object)
    ], MdButton.prototype, "disableRipple", null);
    __decorate$22([
        _angular_core.Input(), 
        __metadata$22('design:type', Object)
    ], MdButton.prototype, "disabled", null);
    __decorate$22([
        _angular_core.Input(), 
        __metadata$22('design:type', String)
    ], MdButton.prototype, "color", null);
    MdButton = __decorate$22([
        _angular_core.Component({selector: 'button[md-button], button[md-raised-button], button[md-icon-button], ' +
                'button[md-fab], button[md-mini-fab]',
            host: {
                '[disabled]': 'disabled',
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span><div md-ripple *ngif=\"!_isRippleDisabled()\" class=\"md-button-ripple\" [class.md-button-ripple-round]=\"_isRoundButton()\" [mdrippletrigger]=\"_getHostElement()\" [mdripplecolor]=\"_isRoundButton() ? 'rgba(255, 255, 255, 0.2)' : ''\" mdripplebackgroundcolor=\"rgba(0, 0, 0, 0)\"></div><div class=\"md-button-focus-overlay\" (touchstart)=\"$event.preventDefault()\"></div>",
            styles: [".md-button-focus[md-button] .md-button-focus-overlay,.md-button-focus[md-fab] .md-button-focus-overlay,.md-button-focus[md-icon-button] .md-button-focus-overlay,.md-button-focus[md-mini-fab] .md-button-focus-overlay,.md-button-focus[md-raised-button] .md-button-focus-overlay,[md-button]:hover .md-button-focus-overlay,[md-icon-button]:hover .md-button-focus-overlay{opacity:1}[md-icon-button],[md-mini-fab]{width:40px;height:40px}[md-button],[md-fab],[md-icon-button],[md-mini-fab],[md-raised-button]{box-sizing:border-box;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;color:currentColor;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled][md-button],[disabled][md-fab],[disabled][md-icon-button],[disabled][md-mini-fab],[disabled][md-raised-button]{cursor:default}[md-fab],[md-mini-fab],[md-raised-button]{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}[md-fab],[md-mini-fab]{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);flex-shrink:0;padding:0;min-width:0;border-radius:50%}[md-fab]:active,[md-mini-fab]:active,[md-raised-button]:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled][md-fab],[disabled][md-mini-fab],[disabled][md-raised-button]{box-shadow:none}[md-button][disabled]:hover .md-button-focus-overlay,[md-button][disabled]:hover.md-accent,[md-button][disabled]:hover.md-primary,[md-button][disabled]:hover.md-warn,[md-icon-button][disabled]:hover .md-button-focus-overlay,[md-icon-button][disabled]:hover.md-accent,[md-icon-button][disabled]:hover.md-primary,[md-icon-button][disabled]:hover.md-warn{background-color:transparent}[md-fab]{width:56px;height:56px}[md-fab]:active,[md-mini-fab]:active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}[md-fab] i,[md-fab] md-icon{padding:16px 0;line-height:24px}[md-mini-fab] i,[md-mini-fab] md-icon{padding:8px 0;line-height:24px}[md-icon-button]{padding:0;min-width:0;flex-shrink:0;line-height:40px;border-radius:50%}[md-icon-button] i,[md-icon-button] md-icon{line-height:24px}[md-button] .md-button-wrapper>*,[md-icon-button] .md-button-wrapper>*,[md-raised-button] .md-button-wrapper>*{vertical-align:middle}.md-button-focus-overlay,.md-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.md-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;pointer-events:none;opacity:0}.md-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.md-button-focus-overlay{background-color:rgba(255,255,255,.5)}[md-button],[md-fab],[md-icon-button],[md-mini-fab],[md-raised-button]{outline:solid 1px}}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$22('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdButton);
    return MdButton;
}());
var MdAnchor = (function (_super) {
    __extends$6(MdAnchor, _super);
    function MdAnchor(elementRef, renderer) {
        _super.call(this, elementRef, renderer);
    }
    Object.defineProperty(MdAnchor.prototype, "tabIndex", {
        /** @docs-private */
        get: function () {
            return this.disabled ? -1 : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdAnchor.prototype, "_isAriaDisabled", {
        get: function () {
            return this.disabled ? 'true' : 'false';
        },
        enumerable: true,
        configurable: true
    });
    MdAnchor.prototype._haltDisabledEvents = function (event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    __decorate$22([
        _angular_core.HostBinding('tabIndex'), 
        __metadata$22('design:type', Number)
    ], MdAnchor.prototype, "tabIndex", null);
    MdAnchor = __decorate$22([
        _angular_core.Component({selector: 'a[md-button], a[md-raised-button], a[md-icon-button], a[md-fab], a[md-mini-fab]',
            inputs: ['color', 'disabled', 'disableRipple'],
            host: {
                '[attr.disabled]': 'disabled',
                '[attr.aria-disabled]': '_isAriaDisabled',
                '[class.md-button-focus]': '_isKeyboardFocused',
                '(mousedown)': '_setMousedown()',
                '(focus)': '_setKeyboardFocus()',
                '(blur)': '_removeKeyboardFocus()',
                '(click)': '_haltDisabledEvents($event)',
            },
            template: "<span class=\"md-button-wrapper\"><ng-content></ng-content></span><div md-ripple *ngif=\"!_isRippleDisabled()\" class=\"md-button-ripple\" [class.md-button-ripple-round]=\"_isRoundButton()\" [mdrippletrigger]=\"_getHostElement()\" [mdripplecolor]=\"_isRoundButton() ? 'rgba(255, 255, 255, 0.2)' : ''\" mdripplebackgroundcolor=\"rgba(0, 0, 0, 0)\"></div><div class=\"md-button-focus-overlay\" (touchstart)=\"$event.preventDefault()\"></div>",
            styles: [".md-button-focus[md-button] .md-button-focus-overlay,.md-button-focus[md-fab] .md-button-focus-overlay,.md-button-focus[md-icon-button] .md-button-focus-overlay,.md-button-focus[md-mini-fab] .md-button-focus-overlay,.md-button-focus[md-raised-button] .md-button-focus-overlay,[md-button]:hover .md-button-focus-overlay,[md-icon-button]:hover .md-button-focus-overlay{opacity:1}[md-icon-button],[md-mini-fab]{width:40px;height:40px}[md-button],[md-fab],[md-icon-button],[md-mini-fab],[md-raised-button]{box-sizing:border-box;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;color:currentColor;text-align:center;margin:0;min-width:88px;line-height:36px;padding:0 16px;border-radius:2px}[disabled][md-button],[disabled][md-fab],[disabled][md-icon-button],[disabled][md-mini-fab],[disabled][md-raised-button]{cursor:default}[md-fab],[md-mini-fab],[md-raised-button]{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transform:translate3d(0,0,0);transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}[md-fab],[md-mini-fab]{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);flex-shrink:0;padding:0;min-width:0;border-radius:50%}[md-fab]:active,[md-mini-fab]:active,[md-raised-button]:active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}[disabled][md-fab],[disabled][md-mini-fab],[disabled][md-raised-button]{box-shadow:none}[md-button][disabled]:hover .md-button-focus-overlay,[md-button][disabled]:hover.md-accent,[md-button][disabled]:hover.md-primary,[md-button][disabled]:hover.md-warn,[md-icon-button][disabled]:hover .md-button-focus-overlay,[md-icon-button][disabled]:hover.md-accent,[md-icon-button][disabled]:hover.md-primary,[md-icon-button][disabled]:hover.md-warn{background-color:transparent}[md-fab]{width:56px;height:56px}[md-fab]:active,[md-mini-fab]:active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}[md-fab] i,[md-fab] md-icon{padding:16px 0;line-height:24px}[md-mini-fab] i,[md-mini-fab] md-icon{padding:8px 0;line-height:24px}[md-icon-button]{padding:0;min-width:0;flex-shrink:0;line-height:40px;border-radius:50%}[md-icon-button] i,[md-icon-button] md-icon{line-height:24px}[md-button] .md-button-wrapper>*,[md-icon-button] .md-button-wrapper>*,[md-raised-button] .md-button-wrapper>*{vertical-align:middle}.md-button-focus-overlay,.md-button-ripple{position:absolute;top:0;left:0;bottom:0;right:0}.md-button-focus-overlay{background-color:rgba(0,0,0,.12);border-radius:inherit;pointer-events:none;opacity:0}.md-button-ripple-round{border-radius:50%;z-index:1}@media screen and (-ms-high-contrast:active){.md-button-focus-overlay{background-color:rgba(255,255,255,.5)}[md-button],[md-fab],[md-icon-button],[md-mini-fab],[md-raised-button]{outline:solid 1px}}"],
            encapsulation: _angular_core.ViewEncapsulation.None
        }), 
        __metadata$22('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdAnchor);
    return MdAnchor;
}(MdButton));
var MdButtonModule = (function () {
    function MdButtonModule() {
    }
    MdButtonModule.forRoot = function () {
        return {
            ngModule: MdButtonModule,
            providers: [ViewportRuler]
        };
    };
    MdButtonModule = __decorate$22([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdButton, MdAnchor, DefaultStyleCompatibilityModeModule],
            declarations: [MdButton, MdAnchor],
        }), 
        __metadata$22('design:paramtypes', [])
    ], MdButtonModule);
    return MdButtonModule;
}());

var __decorate$23 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$23 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Monotonically increasing integer used to auto-generate unique ids for checkbox components. */
var nextId = 0;
/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
var MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdCheckbox; }),
    multi: true
};
/**
 * Represents the different states that require custom transitions between them.
 * @docs-private
 */
(function (TransitionCheckState) {
    /** The initial state of the component before any user interaction. */
    TransitionCheckState[TransitionCheckState["Init"] = 0] = "Init";
    /** The state representing the component when it's becoming checked. */
    TransitionCheckState[TransitionCheckState["Checked"] = 1] = "Checked";
    /** The state representing the component when it's becoming unchecked. */
    TransitionCheckState[TransitionCheckState["Unchecked"] = 2] = "Unchecked";
    /** The state representing the component when it's becoming indeterminate. */
    TransitionCheckState[TransitionCheckState["Indeterminate"] = 3] = "Indeterminate";
})(exports.TransitionCheckState || (exports.TransitionCheckState = {}));
/** Change event object emitted by MdCheckbox. */
var MdCheckboxChange = (function () {
    function MdCheckboxChange() {
    }
    return MdCheckboxChange;
}());
/**
 * A material design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. An MdCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 * See: https://www.google.com/design/spec/components/selection-controls.html
 */
var MdCheckbox = (function () {
    function MdCheckbox(_renderer, _elementRef, _changeDetectorRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Attached to the aria-label attribute of the host element. In most cases, arial-labelledby will
         * take precedence so this may be omitted.
         */
        this.ariaLabel = '';
        /**
         * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
         */
        this.ariaLabelledby = null;
        /** A unique id for the checkbox. If one is not supplied, it is auto-generated. */
        this.id = "md-checkbox-" + ++nextId;
        /** Whether or not the checkbox should come before or after the label. */
        this.align = 'start';
        this._disabled = false;
        /** @docs-private */
        this.tabindex = 0;
        /** Name value will be applied to the input element if present */
        this.name = null;
        /** Event emitted when the checkbox's `checked` value changes. */
        this.change = new _angular_core.EventEmitter();
        /**
         * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
         * @docs-private
         */
        this.onTouched = function () { };
        this._currentAnimationClass = '';
        this._currentCheckState = exports.TransitionCheckState.Init;
        this._checked = false;
        this._indeterminate = false;
        this._controlValueAccessorChangeFn = function (value) { };
        this._hasFocus = false;
        this.color = 'accent';
    }
    Object.defineProperty(MdCheckbox.prototype, "disableRipple", {
        /** Whether the ripple effect for this checkbox is disabled. */
        get: function () { return this._disableRipple; },
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "inputId", {
        /** ID of the native input element inside `<md-checkbox>` */
        get: function () {
            return "input-" + this.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "required", {
        /** Whether the checkbox is required. */
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "disabled", {
        /** Whether the checkbox is disabled. */
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "checked", {
        /**
         * Whether the checkbox is checked. Note that setting `checked` will immediately set
         * `indeterminate` to false.
         */
        get: function () {
            return this._checked;
        },
        set: function (checked) {
            if (checked != this.checked) {
                this._indeterminate = false;
                this._checked = checked;
                this._transitionCheckState(this._checked ? exports.TransitionCheckState.Checked : exports.TransitionCheckState.Unchecked);
                this._changeDetectorRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "indeterminate", {
        /**
         * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
         * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
         * checkable items. Note that whenever `checked` is set, indeterminate is immediately set to
         * false. This differs from the web platform in that indeterminate state on native
         * checkboxes is only remove when the user manually checks the checkbox (rather than setting the
         * `checked` property programmatically). However, we feel that this behavior is more accommodating
         * to the way consumers would envision using this component.
         */
        get: function () {
            return this._indeterminate;
        },
        set: function (indeterminate) {
            this._indeterminate = indeterminate;
            if (this._indeterminate) {
                this._transitionCheckState(exports.TransitionCheckState.Indeterminate);
            }
            else {
                this._transitionCheckState(this.checked ? exports.TransitionCheckState.Checked : exports.TransitionCheckState.Unchecked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCheckbox.prototype, "color", {
        /** The color of the button. Can be `primary`, `accent`, or `warn`. */
        get: function () { return this._color; },
        set: function (value) { this._updateColor(value); },
        enumerable: true,
        configurable: true
    });
    MdCheckbox.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdCheckbox.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    MdCheckbox.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.writeValue = function (value) {
        this.checked = !!value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdCheckbox.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdCheckbox.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MdCheckbox.prototype._transitionCheckState = function (newState) {
        var oldState = this._currentCheckState;
        var renderer = this._renderer;
        var elementRef = this._elementRef;
        if (oldState === newState) {
            return;
        }
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, false);
        }
        this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
        this._currentCheckState = newState;
        if (this._currentAnimationClass.length > 0) {
            renderer.setElementClass(elementRef.nativeElement, this._currentAnimationClass, true);
        }
    };
    MdCheckbox.prototype._emitChangeEvent = function () {
        var event = new MdCheckboxChange();
        event.source = this;
        event.checked = this.checked;
        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    };
    /** Informs the component when the input has focus so that we can style accordingly */
    MdCheckbox.prototype._onInputFocus = function () {
        this._hasFocus = true;
    };
    /** Informs the component when we lose focus in order to style accordingly */
    MdCheckbox.prototype._onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /** Toggles the `checked` state of the checkbox. */
    MdCheckbox.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    /**
     * Event handler for checkbox input element.
     * Toggles checked state if element is not disabled.
     * @param event
     */
    MdCheckbox.prototype._onInteractionEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        if (!this.disabled) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    /** Focuses the checkbox. */
    MdCheckbox.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
        this._onInputFocus();
    };
    MdCheckbox.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `checkbox` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdCheckbox.prototype._getAnimationClassForCheckStateTransition = function (oldState, newState) {
        var animSuffix;
        switch (oldState) {
            case exports.TransitionCheckState.Init:
                // Handle edge case where user interacts with checkbox that does not have [(ngModel)] or
                // [checked] bound to it.
                if (newState === exports.TransitionCheckState.Checked) {
                    animSuffix = 'unchecked-checked';
                }
                else {
                    return '';
                }
                break;
            case exports.TransitionCheckState.Unchecked:
                animSuffix = newState === exports.TransitionCheckState.Checked ?
                    'unchecked-checked' : 'unchecked-indeterminate';
                break;
            case exports.TransitionCheckState.Checked:
                animSuffix = newState === exports.TransitionCheckState.Unchecked ?
                    'checked-unchecked' : 'checked-indeterminate';
                break;
            case exports.TransitionCheckState.Indeterminate:
                animSuffix = newState === exports.TransitionCheckState.Checked ?
                    'indeterminate-checked' : 'indeterminate-unchecked';
        }
        return "md-checkbox-anim-" + animSuffix;
    };
    MdCheckbox.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    __decorate$23([
        _angular_core.Input('aria-label'), 
        __metadata$23('design:type', String)
    ], MdCheckbox.prototype, "ariaLabel", void 0);
    __decorate$23([
        _angular_core.Input('aria-labelledby'), 
        __metadata$23('design:type', String)
    ], MdCheckbox.prototype, "ariaLabelledby", void 0);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', String)
    ], MdCheckbox.prototype, "id", void 0);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Boolean)
    ], MdCheckbox.prototype, "disableRipple", null);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Boolean)
    ], MdCheckbox.prototype, "required", null);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Object)
    ], MdCheckbox.prototype, "align", void 0);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Boolean)
    ], MdCheckbox.prototype, "disabled", null);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Number)
    ], MdCheckbox.prototype, "tabindex", void 0);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', String)
    ], MdCheckbox.prototype, "name", void 0);
    __decorate$23([
        _angular_core.Output(), 
        __metadata$23('design:type', _angular_core.EventEmitter)
    ], MdCheckbox.prototype, "change", void 0);
    __decorate$23([
        _angular_core.ViewChild('input'), 
        __metadata$23('design:type', _angular_core.ElementRef)
    ], MdCheckbox.prototype, "_inputElement", void 0);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Object)
    ], MdCheckbox.prototype, "checked", null);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', Object)
    ], MdCheckbox.prototype, "indeterminate", null);
    __decorate$23([
        _angular_core.Input(), 
        __metadata$23('design:type', String)
    ], MdCheckbox.prototype, "color", null);
    MdCheckbox = __decorate$23([
        _angular_core.Component({selector: 'md-checkbox, mat-checkbox',
            template: "<label class=\"md-checkbox-layout\"><div class=\"md-checkbox-inner-container\"><input #input class=\"md-checkbox-input md-visually-hidden\" type=\"checkbox\" [id]=\"inputId\" [required]=\"required\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [tabindex]=\"tabindex\" [indeterminate]=\"indeterminate\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (focus)=\"_onInputFocus()\" (blur)=\"_onInputBlur()\" (change)=\"_onInteractionEvent($event)\" (click)=\"_onInputClick($event)\"><div md-ripple *ngif=\"!_isRippleDisabled()\" class=\"md-checkbox-ripple\" [mdrippletrigger]=\"_getHostElement()\" [mdripplecentered]=\"true\" [mdripplespeedfactor]=\"0.3\" mdripplebackgroundcolor=\"rgba(0, 0, 0, 0)\"></div><div class=\"md-checkbox-frame\"></div><div class=\"md-checkbox-background\"><svg version=\"1.1\" class=\"md-checkbox-checkmark\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" xml:space=\"preserve\"><path class=\"md-checkbox-checkmark-path\" fill=\"none\" stroke=\"white\" d=\"M4.1,12.7 9,17.6 20.3,6.3\"/></svg><div class=\"md-checkbox-mixedmark\"></div></div></div><span class=\"md-checkbox-label\"><ng-content></ng-content></span></label>",
            styles: [".md-checkbox-frame,.md-checkbox-unchecked .md-checkbox-background{background-color:transparent}@keyframes md-checkbox-fade-in-background{0%{opacity:0}50%{opacity:1}}@keyframes md-checkbox-fade-out-background{0%,50%{opacity:1}100%{opacity:0}}@keyframes md-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:22.91026}50%{animation-timing-function:cubic-bezier(0,0,.2,.1)}100%{stroke-dashoffset:0}}@keyframes md-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0,0,0,1)}100%{transform:scaleX(1)}}@keyframes md-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(.4,0,1,1);stroke-dashoffset:0}to{stroke-dashoffset:-22.91026}}@keyframes md-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(45deg)}}@keyframes md-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:0;transform:rotate(45deg)}to{opacity:1;transform:rotate(360deg)}}@keyframes md-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:cubic-bezier(0,0,.2,.1);opacity:0;transform:rotate(-45deg)}to{opacity:1;transform:rotate(0)}}@keyframes md-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(.14,0,0,1);opacity:1;transform:rotate(0)}to{opacity:0;transform:rotate(315deg)}}@keyframes md-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;opacity:1;transform:scaleX(1)}100%,32.8%{opacity:0;transform:scaleX(0)}}.md-checkbox-background,.md-checkbox-checkmark,.md-checkbox-frame{bottom:0;left:0;position:absolute;right:0;top:0}.md-checkbox-checkmark,.md-checkbox-mixedmark{width:calc(100% - 4px)}.md-checkbox-background,.md-checkbox-frame{border-radius:2px;box-sizing:border-box;pointer-events:none}md-checkbox{cursor:pointer;transition:background .4s cubic-bezier(.25,.8,.25,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.md-checkbox-layout{cursor:inherit;align-items:baseline;vertical-align:middle;display:inline-flex}.md-checkbox-inner-container{display:inline-block;height:20px;line-height:0;margin:auto 8px auto auto;order:0;position:relative;vertical-align:middle;white-space:nowrap;width:20px;flex-shrink:0}[dir=rtl] .md-checkbox-inner-container{margin-left:8px;margin-right:auto}.md-checkbox-layout .md-checkbox-label{line-height:24px}.md-checkbox-frame{border:2px solid;transition:border-color 90ms cubic-bezier(0,0,.2,.1);will-change:border-color}.md-checkbox-background{align-items:center;display:inline-flex;justify-content:center;transition:background-color 90ms cubic-bezier(0,0,.2,.1),opacity 90ms cubic-bezier(0,0,.2,.1);will-change:background-color,opacity}.md-checkbox-checkmark{width:100%}.md-checkbox-checkmark-path{stroke-dashoffset:22.91026;stroke-dasharray:22.91026;stroke-width:2.67px}.md-checkbox-checked .md-checkbox-checkmark-path,.md-checkbox-indeterminate .md-checkbox-checkmark-path{stroke-dashoffset:0}.md-checkbox-mixedmark{height:2px;opacity:0;transform:scaleX(0) rotate(0)}.md-checkbox-align-end .md-checkbox-inner-container{order:1;margin-left:8px;margin-right:auto}[dir=rtl] .md-checkbox-align-end .md-checkbox-inner-container{margin-left:auto;margin-right:8px}.md-checkbox-checked .md-checkbox-checkmark{opacity:1}.md-checkbox-checked .md-checkbox-mixedmark{transform:scaleX(1) rotate(-45deg)}.md-checkbox-indeterminate .md-checkbox-checkmark{opacity:0;transform:rotate(45deg)}.md-checkbox-indeterminate .md-checkbox-mixedmark{opacity:1;transform:scaleX(1) rotate(0)}.md-checkbox-disabled{cursor:default}.md-checkbox-anim-unchecked-checked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-in-background}.md-checkbox-anim-unchecked-checked .md-checkbox-checkmark-path{animation:180ms linear 0s md-checkbox-unchecked-checked-checkmark-path}.md-checkbox-anim-unchecked-indeterminate .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-in-background}.md-checkbox-anim-unchecked-indeterminate .md-checkbox-mixedmark{animation:90ms linear 0s md-checkbox-unchecked-indeterminate-mixedmark}.md-checkbox-anim-checked-unchecked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-out-background}.md-checkbox-anim-checked-unchecked .md-checkbox-checkmark-path{animation:90ms linear 0s md-checkbox-checked-unchecked-checkmark-path}.md-checkbox-anim-checked-indeterminate .md-checkbox-checkmark{animation:90ms linear 0s md-checkbox-checked-indeterminate-checkmark}.md-checkbox-anim-checked-indeterminate .md-checkbox-mixedmark{animation:90ms linear 0s md-checkbox-checked-indeterminate-mixedmark}.md-checkbox-anim-indeterminate-checked .md-checkbox-checkmark{animation:.5s linear 0s md-checkbox-indeterminate-checked-checkmark}.md-checkbox-anim-indeterminate-checked .md-checkbox-mixedmark{animation:.5s linear 0s md-checkbox-indeterminate-checked-mixedmark}.md-checkbox-anim-indeterminate-unchecked .md-checkbox-background{animation:180ms linear 0s md-checkbox-fade-out-background}.md-checkbox-anim-indeterminate-unchecked .md-checkbox-mixedmark{animation:.3s linear 0s md-checkbox-indeterminate-unchecked-mixedmark}.md-checkbox-input{bottom:0;left:50%}.md-checkbox-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
            host: {
                '[class.md-checkbox-indeterminate]': 'indeterminate',
                '[class.md-checkbox-checked]': 'checked',
                '[class.md-checkbox-disabled]': 'disabled',
                '[class.md-checkbox-align-end]': 'align == "end"',
                '[class.md-checkbox-focused]': '_hasFocus',
            },
            providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
        }), 
        __metadata$23('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef, _angular_core.ChangeDetectorRef])
    ], MdCheckbox);
    return MdCheckbox;
}());
var MdCheckboxModule = (function () {
    function MdCheckboxModule() {
    }
    MdCheckboxModule.forRoot = function () {
        return {
            ngModule: MdCheckboxModule,
            providers: [ViewportRuler]
        };
    };
    MdCheckboxModule = __decorate$23([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdCheckbox, DefaultStyleCompatibilityModeModule],
            declarations: [MdCheckbox],
        }), 
        __metadata$23('design:paramtypes', [])
    ], MdCheckboxModule);
    return MdCheckboxModule;
}());

var __decorate$24 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$24 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$4 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Provider Expression that allows md-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
var MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdRadioGroup; }),
    multi: true
};
var _uniqueIdCounter$1 = 0;
/** Change event object emitted by MdRadio and MdRadioGroup. */
var MdRadioChange = (function () {
    function MdRadioChange() {
    }
    return MdRadioChange;
}());
/**
 * A group of radio buttons. May contain one or more `<md-radio-button>` elements.
 */
var MdRadioGroup = (function () {
    function MdRadioGroup() {
        /**
         * Selected value for group. Should equal the value of the selected radio button if there *is*
         * a corresponding radio button with a matching value. If there is *not* such a corresponding
         * radio button, this value persists to be applied in case a new radio button is added with a
         * matching value.
         */
        this._value = null;
        /** The HTML name attribute applied to radio buttons in this group. */
        this._name = "md-radio-group-" + _uniqueIdCounter$1++;
        /** Disables all individual radio buttons assigned to this group. */
        this._disabled = false;
        /** The currently selected radio button. Should match value. */
        this._selected = null;
        /** Whether the `value` has been set to its initial value. */
        this._isInitialized = false;
        /** The method to be called in order to update ngModel */
        this._controlValueAccessorChangeFn = function (value) { };
        /**
         * onTouch function registered via registerOnTouch (ControlValueAccessor).
         * @docs-private
         */
        this.onTouched = function () { };
        /**
         * Event emitted when the group value changes.
         * Change events are only emitted when the value changes due to user interaction with
         * a radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new _angular_core.EventEmitter();
        /** Child radio buttons. */
        this._radios = null;
    }
    Object.defineProperty(MdRadioGroup.prototype, "name", {
        /** Name of the radio button group. All radio buttons inside this group will use this name. */
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
            this._updateRadioButtonNames();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioGroup.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (newValue) {
            if (this._value != newValue) {
                // Set this before proceeding to ensure no circular loop occurs with selection.
                this._value = newValue;
                this._updateSelectedRadioFromValue();
                this._checkSelectedRadioButton();
            }
        },
        enumerable: true,
        configurable: true
    });
    MdRadioGroup.prototype._checkSelectedRadioButton = function () {
        if (this.selected && !this._selected.checked) {
            this._selected.checked = true;
        }
    };
    Object.defineProperty(MdRadioGroup.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (selected) {
            this._selected = selected;
            this.value = selected ? selected.value : null;
            this._checkSelectedRadioButton();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     */
    MdRadioGroup.prototype.ngAfterContentInit = function () {
        // Mark this component as initialized in AfterContentInit because the initial value can
        // possibly be set by NgModel on MdRadioGroup, and it is possible that the OnInit of the
        // NgModel occurs *after* the OnInit of the MdRadioGroup.
        this._isInitialized = true;
    };
    /**
     * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
     * radio buttons upon their blur.
     */
    MdRadioGroup.prototype._touch = function () {
        if (this.onTouched) {
            this.onTouched();
        }
    };
    MdRadioGroup.prototype._updateRadioButtonNames = function () {
        var _this = this;
        if (this._radios) {
            this._radios.forEach(function (radio) {
                radio.name = _this.name;
            });
        }
    };
    /** Updates the `selected` radio button from the internal _value state. */
    MdRadioGroup.prototype._updateSelectedRadioFromValue = function () {
        var _this = this;
        // If the value already matches the selected radio, do nothing.
        var isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            this._selected = null;
            this._radios.forEach(function (radio) {
                radio.checked = _this.value == radio.value;
                if (radio.checked) {
                    _this._selected = radio;
                }
            });
        }
    };
    /** Dispatch change event with current selection and group value. */
    MdRadioGroup.prototype._emitChangeEvent = function () {
        if (this._isInitialized) {
            var event_1 = new MdRadioChange();
            event_1.source = this._selected;
            event_1.value = this._value;
            this.change.emit(event_1);
        }
    };
    /** Implemented as part of ControlValueAccessor. */
    MdRadioGroup.prototype.writeValue = function (value) {
        this.value = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdRadioGroup.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdRadioGroup.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdRadioGroup.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    __decorate$24([
        _angular_core.Output(), 
        __metadata$24('design:type', _angular_core.EventEmitter)
    ], MdRadioGroup.prototype, "change", void 0);
    __decorate$24([
        _angular_core.ContentChildren(_angular_core.forwardRef(function () { return MdRadioButton; })), 
        __metadata$24('design:type', _angular_core.QueryList)
    ], MdRadioGroup.prototype, "_radios", void 0);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', String)
    ], MdRadioGroup.prototype, "name", null);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Object)
    ], MdRadioGroup.prototype, "align", void 0);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Boolean)
    ], MdRadioGroup.prototype, "disabled", null);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Object)
    ], MdRadioGroup.prototype, "value", null);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Object)
    ], MdRadioGroup.prototype, "selected", null);
    MdRadioGroup = __decorate$24([
        _angular_core.Directive({
            selector: 'md-radio-group, mat-radio-group',
            providers: [MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
            host: {
                'role': 'radiogroup',
            },
        }), 
        __metadata$24('design:paramtypes', [])
    ], MdRadioGroup);
    return MdRadioGroup;
}());
/**
 * A radio-button. May be inside of
 */
var MdRadioButton = (function () {
    function MdRadioButton(radioGroup, _elementRef, _renderer, radioDispatcher) {
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.radioDispatcher = radioDispatcher;
        /** Whether this radio is checked. */
        this._checked = false;
        /** The unique ID for the radio button. */
        this.id = "md-radio-" + _uniqueIdCounter$1++;
        /** Value assigned to this radio.*/
        this._value = null;
        /**
         * Event emitted when the checked state of this radio button changes.
         * Change events are only emitted when the value changes due to user interaction with
         * the radio button (the same behavior as `<input type-"radio">`).
         */
        this.change = new _angular_core.EventEmitter();
        this.radioGroup = radioGroup;
        radioDispatcher.listen(function (id, name) {
            if (id != _this.id && name == _this.name) {
                _this.checked = false;
            }
        });
    }
    Object.defineProperty(MdRadioButton.prototype, "disableRipple", {
        /** Whether the ripple effect for this radio button is disabled. */
        get: function () { return this._disableRipple; },
        set: function (value) { this._disableRipple = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "inputId", {
        /** ID of the native input element inside `<md-radio-button>` */
        get: function () {
            return this.id + "-input";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "checked", {
        /** Whether this radio button is checked. */
        get: function () {
            return this._checked;
        },
        set: function (newCheckedState) {
            if (this._checked != newCheckedState) {
                this._checked = newCheckedState;
                if (newCheckedState && this.radioGroup && this.radioGroup.value != this.value) {
                    this.radioGroup.selected = this;
                }
                else if (!newCheckedState && this.radioGroup && this.radioGroup.value == this.value) {
                    // When unchecking the selected radio button, update the selected radio
                    // property on the group.
                    this.radioGroup.selected = null;
                }
                if (newCheckedState) {
                    // Notify all radio buttons with the same name to un-check.
                    this.radioDispatcher.notify(this.id, this.name);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "value", {
        /** The value of this radio button. */
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (this._value != value) {
                this._value = value;
                if (this.radioGroup != null) {
                    if (!this.checked) {
                        // Update checked when the value changed to match the radio group's value
                        this.checked = this.radioGroup.value == value;
                    }
                    if (this.checked) {
                        this.radioGroup.selected = this;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "align", {
        /** Alignment of the radio-button relative to their labels. Can be 'before' or 'after'. */
        get: function () {
            return this._align || (this.radioGroup != null && this.radioGroup.align) || 'before';
        },
        set: function (value) {
            this._align = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdRadioButton.prototype, "disabled", {
        /** Whether the radio button is disabled. */
        get: function () {
            return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
        },
        set: function (value) {
            // The presence of *any* disabled value makes the component disabled, *except* for false.
            this._disabled = (value != null && value !== false) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    MdRadioButton.prototype.ngOnInit = function () {
        if (this.radioGroup) {
            // If the radio is inside a radio group, determine if it should be checked
            this.checked = this.radioGroup.value === this._value;
            // Copy name from parent radio group
            this.name = this.radioGroup.name;
        }
    };
    /** Dispatch change event with current value. */
    MdRadioButton.prototype._emitChangeEvent = function () {
        var event = new MdRadioChange();
        event.source = this;
        event.value = this._value;
        this.change.emit(event);
    };
    MdRadioButton.prototype._isRippleDisabled = function () {
        return this.disableRipple || this.disabled;
    };
    /**
     * We use a hidden native input field to handle changes to focus state via keyboard navigation,
     * with visual rendering done separately. The native element is kept in sync with the overall
     * state of the component.
     */
    MdRadioButton.prototype._onInputFocus = function () {
        this._isFocused = true;
    };
    /** Focuses the radio button. */
    MdRadioButton.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
        this._onInputFocus();
    };
    MdRadioButton.prototype._onInputBlur = function () {
        this._isFocused = false;
        if (this.radioGroup) {
            this.radioGroup._touch();
        }
    };
    MdRadioButton.prototype._onInputClick = function (event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `radio-button` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /**
     * Triggered when the radio button received a click or the input recognized any change.
     * Clicking on a label element, will trigger a change event on the associated input.
     */
    MdRadioButton.prototype._onInputChange = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
        var groupValueChanged = this.radioGroup && this.value != this.radioGroup.value;
        this.checked = true;
        this._emitChangeEvent();
        if (this.radioGroup) {
            this.radioGroup._controlValueAccessorChangeFn(this.value);
            this.radioGroup._touch();
            if (groupValueChanged) {
                this.radioGroup._emitChangeEvent();
            }
        }
    };
    MdRadioButton.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    __decorate$24([
        _angular_core.HostBinding('class.md-radio-focused'), 
        __metadata$24('design:type', Boolean)
    ], MdRadioButton.prototype, "_isFocused", void 0);
    __decorate$24([
        _angular_core.HostBinding('id'),
        _angular_core.Input(), 
        __metadata$24('design:type', String)
    ], MdRadioButton.prototype, "id", void 0);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', String)
    ], MdRadioButton.prototype, "name", void 0);
    __decorate$24([
        _angular_core.Input('aria-label'), 
        __metadata$24('design:type', String)
    ], MdRadioButton.prototype, "ariaLabel", void 0);
    __decorate$24([
        _angular_core.Input('aria-labelledby'), 
        __metadata$24('design:type', String)
    ], MdRadioButton.prototype, "ariaLabelledby", void 0);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Boolean)
    ], MdRadioButton.prototype, "disableRipple", null);
    __decorate$24([
        _angular_core.Output(), 
        __metadata$24('design:type', _angular_core.EventEmitter)
    ], MdRadioButton.prototype, "change", void 0);
    __decorate$24([
        _angular_core.ViewChild('input'), 
        __metadata$24('design:type', _angular_core.ElementRef)
    ], MdRadioButton.prototype, "_inputElement", void 0);
    __decorate$24([
        _angular_core.HostBinding('class.md-radio-checked'),
        _angular_core.Input(), 
        __metadata$24('design:type', Boolean)
    ], MdRadioButton.prototype, "checked", null);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Object)
    ], MdRadioButton.prototype, "value", null);
    __decorate$24([
        _angular_core.Input(), 
        __metadata$24('design:type', Object)
    ], MdRadioButton.prototype, "align", null);
    __decorate$24([
        _angular_core.HostBinding('class.md-radio-disabled'),
        _angular_core.Input(), 
        __metadata$24('design:type', Boolean)
    ], MdRadioButton.prototype, "disabled", null);
    MdRadioButton = __decorate$24([
        _angular_core.Component({selector: 'md-radio-button, mat-radio-button',
            template: "<label [attr.for]=\"inputId\" class=\"md-radio-label\"><div class=\"md-radio-container\"><div class=\"md-radio-outer-circle\"></div><div class=\"md-radio-inner-circle\"></div><div md-ripple *ngif=\"!_isRippleDisabled()\" class=\"md-radio-ripple\" [mdrippletrigger]=\"_getHostElement()\" [mdripplecentered]=\"true\" [mdripplespeedfactor]=\"0.3\" mdripplebackgroundcolor=\"rgba(0, 0, 0, 0)\"></div></div><input #input class=\"md-radio-input md-visually-hidden\" type=\"radio\" [id]=\"inputId\" [checked]=\"checked\" [disabled]=\"disabled\" [name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (change)=\"_onInputChange($event)\" (focus)=\"_onInputFocus()\" (blur)=\"_onInputBlur()\" (click)=\"_onInputClick($event)\"><div class=\"md-radio-label-content\" [class.md-radio-align-end]=\"align == 'after'\"><ng-content></ng-content></div></label>",
            styles: ["md-radio-button{display:inline-block}.md-radio-label{cursor:pointer;display:inline-flex;align-items:baseline;white-space:nowrap}.md-radio-container{box-sizing:border-box;display:inline-block;height:20px;position:relative;width:20px;top:2px}.md-radio-inner-circle,.md-radio-outer-circle{box-sizing:border-box;height:20px;left:0;top:0;width:20px;position:absolute}.md-radio-outer-circle{border:2px solid;border-radius:50%;transition:border-color ease 280ms}.md-radio-inner-circle{border-radius:50%;transition:transform ease 280ms,background-color ease 280ms;transform:scale(0)}.md-radio-checked .md-radio-inner-circle{transform:scale(.5)}.md-radio-label-content{display:inline-block;order:0;line-height:inherit;padding-left:8px;padding-right:0}[dir=rtl] .md-radio-label-content{padding-right:8px;padding-left:0}.md-radio-label-content.md-radio-align-end{order:-1;padding-left:0;padding-right:8px}[dir=rtl] .md-radio-label-content.md-radio-align-end{padding-right:0;padding-left:8px}.md-radio-disabled,.md-radio-disabled .md-radio-label{cursor:default}.md-radio-ripple{position:absolute;left:-15px;top:-15px;right:-15px;bottom:-15px;border-radius:50%;z-index:1;pointer-events:none}"],
            encapsulation: _angular_core.ViewEncapsulation.None
        }),
        __param$4(0, _angular_core.Optional()), 
        __metadata$24('design:paramtypes', [MdRadioGroup, _angular_core.ElementRef, _angular_core.Renderer, MdUniqueSelectionDispatcher])
    ], MdRadioButton);
    return MdRadioButton;
}());
var MdRadioModule = (function () {
    function MdRadioModule() {
    }
    MdRadioModule.forRoot = function () {
        return {
            ngModule: MdRadioModule,
            providers: [MdUniqueSelectionDispatcher, ViewportRuler],
        };
    };
    MdRadioModule = __decorate$24([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdRadioGroup, MdRadioButton, DefaultStyleCompatibilityModeModule],
            declarations: [MdRadioGroup, MdRadioButton],
        }), 
        __metadata$24('design:paramtypes', [])
    ], MdRadioModule);
    return MdRadioModule;
}());

var __decorate$27 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$27 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Option IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
var _uniqueIdCounter$2 = 0;
var MdOption = (function () {
    function MdOption(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this._selected = false;
        /** Whether the option is disabled.  */
        this._disabled = false;
        this._id = "md-select-option-" + _uniqueIdCounter$2++;
        /** Event emitted when the option is selected. */
        this.onSelect = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdOption.prototype, "id", {
        /** The unique ID of the option. */
        get: function () { return this._id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "selected", {
        /** Whether or not the option is currently selected. */
        get: function () {
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdOption.prototype, "viewValue", {
        /**
         * The displayed value of the option. It is necessary to show the selected option in the
         * select's trigger.
         * TODO(kara): Add input property alternative for node envs.
         */
        get: function () {
            return this._getHostElement().textContent.trim();
        },
        enumerable: true,
        configurable: true
    });
    /** Selects the option. */
    MdOption.prototype.select = function () {
        this._selected = true;
        this.onSelect.emit();
    };
    /** Deselects the option. */
    MdOption.prototype.deselect = function () {
        this._selected = false;
    };
    /** Sets focus onto this option. */
    MdOption.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._getHostElement(), 'focus');
    };
    /** Ensures the option is selected when activated from the keyboard. */
    MdOption.prototype._handleKeydown = function (event) {
        if (event.keyCode === ENTER || event.keyCode === SPACE) {
            this._selectViaInteraction();
        }
    };
    /**
     * Selects the option while indicating the selection came from the user. Used to
     * determine if the select's view -> model callback should be invoked.
     */
    MdOption.prototype._selectViaInteraction = function () {
        if (!this.disabled) {
            this._selected = true;
            this.onSelect.emit(true);
        }
    };
    /** Returns the correct tabindex for the option depending on disabled state. */
    MdOption.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    MdOption.prototype._getHostElement = function () {
        return this._element.nativeElement;
    };
    __decorate$27([
        _angular_core.Input(), 
        __metadata$27('design:type', Object)
    ], MdOption.prototype, "value", void 0);
    __decorate$27([
        _angular_core.Input(), 
        __metadata$27('design:type', Object)
    ], MdOption.prototype, "disabled", null);
    __decorate$27([
        _angular_core.Output(), 
        __metadata$27('design:type', Object)
    ], MdOption.prototype, "onSelect", void 0);
    MdOption = __decorate$27([
        _angular_core.Component({selector: 'md-option, mat-option',
            host: {
                'role': 'option',
                '[attr.tabindex]': '_getTabIndex()',
                '[class.md-selected]': 'selected',
                '[id]': 'id',
                '[attr.aria-selected]': 'selected.toString()',
                '[attr.aria-disabled]': 'disabled.toString()',
                '[class.md-option-disabled]': 'disabled',
                '(click)': '_selectViaInteraction()',
                '(keydown)': '_handleKeydown($event)'
            },
            template: "<ng-content></ng-content><div class=\"md-option-ripple\" *ngif=\"!disabled\" md-ripple mdripplebackgroundcolor=\"rgba(0,0,0,0)\" [mdrippletrigger]=\"_getHostElement()\"></div>",
            styles: [".md-select-value,md-option{white-space:nowrap;text-overflow:ellipsis}md-select{display:inline-block;outline:0}.md-select-trigger{display:flex;justify-content:space-between;align-items:center;height:30px;min-width:112px;cursor:pointer;position:relative;box-sizing:border-box}[aria-disabled=true] .md-select-trigger{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-bottom:transparent;background-position:0 bottom;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-select-placeholder{position:relative;padding:0 2px;transform-origin:left top}.md-select-placeholder.md-floating-placeholder{top:-22px;left:-2px;transform:scale(.75)}[dir=rtl] .md-select-placeholder{transform-origin:right top}[dir=rtl] .md-select-placeholder.md-floating-placeholder{left:2px}[aria-required=true] .md-select-placeholder::after{content:'*'}.md-select-value{position:absolute;overflow-x:hidden;left:0;top:6px}[dir=rtl] .md-select-value{left:auto;right:0}.md-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.md-select-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px}@media screen and (-ms-high-contrast:active){.md-select-panel{outline:solid 1px}.md-option-ripple{opacity:.5}}md-option{overflow-x:hidden;display:flex;flex-direction:row;align-items:center;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:start;text-decoration:none;position:relative;cursor:pointer;outline:0}md-option[disabled]{cursor:default}md-option md-icon{margin-right:16px}[dir=rtl] md-option md-icon{margin-left:16px}md-option[aria-disabled=true]{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-option-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
            encapsulation: _angular_core.ViewEncapsulation.None
        }), 
        __metadata$27('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdOption);
    return MdOption;
}());

/**
 * This class manages keyboard events for selectable lists. If you pass it a query list
 * of focusable items, it will focus the correct item when arrow events occur.
 */
var ListKeyManager = (function () {
    function ListKeyManager(_items) {
        this._items = _items;
        this._tabOut = new rxjs_Subject.Subject();
        this._wrap = false;
    }
    /**
     * Turns on focus wrapping mode, which ensures that the focus will wrap to
     * the other end of list when there are no more items in the given direction.
     */
    ListKeyManager.prototype.withFocusWrap = function () {
        this._wrap = true;
        return this;
    };
    /**
     * Sets the focus of the list to the item at the index specified.
     *
     * @param index The index of the item to be focused.
     */
    ListKeyManager.prototype.setFocus = function (index) {
        this._focusedItemIndex = index;
        this._items.toArray()[index].focus();
    };
    /** Sets the focus properly depending on the key event passed in. */
    ListKeyManager.prototype.onKeydown = function (event) {
        switch (event.keyCode) {
            case DOWN_ARROW:
                this.focusNextItem();
                break;
            case UP_ARROW:
                this.focusPreviousItem();
                break;
            case HOME:
                this.focusFirstItem();
                break;
            case END:
                this.focusLastItem();
                break;
            case TAB:
                // Note that we shouldn't prevent the default action on tab.
                this._tabOut.next(null);
                return;
            default:
                return;
        }
        event.preventDefault();
    };
    /** Focuses the first enabled item in the list. */
    ListKeyManager.prototype.focusFirstItem = function () {
        this._setFocusByIndex(0, 1);
    };
    /** Focuses the last enabled item in the list. */
    ListKeyManager.prototype.focusLastItem = function () {
        this._setFocusByIndex(this._items.length - 1, -1);
    };
    /** Focuses the next enabled item in the list. */
    ListKeyManager.prototype.focusNextItem = function () {
        this._setFocusByDelta(1);
    };
    /** Focuses a previous enabled item in the list. */
    ListKeyManager.prototype.focusPreviousItem = function () {
        this._setFocusByDelta(-1);
    };
    Object.defineProperty(ListKeyManager.prototype, "focusedItemIndex", {
        /** Returns the index of the currently focused item. */
        get: function () {
            return this._focusedItemIndex;
        },
        enumerable: true,
        configurable: true
    });
    /** Allows setting of the focusedItemIndex without focusing the item. */
    ListKeyManager.prototype.updateFocusedItemIndex = function (index) {
        this._focusedItemIndex = index;
    };
    Object.defineProperty(ListKeyManager.prototype, "tabOut", {
        /**
         * Observable that emits any time the TAB key is pressed, so components can react
         * when focus is shifted off of the list.
         */
        get: function () {
            return this._tabOut.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method sets focus to the correct item, given a list of items and the delta
     * between the currently focused item and the new item to be focused. It will calculate
     * the proper focus differently depending on whether wrap mode is turned on.
     */
    ListKeyManager.prototype._setFocusByDelta = function (delta, items) {
        if (items === void 0) { items = this._items.toArray(); }
        this._wrap ? this._setWrapModeFocus(delta, items)
            : this._setDefaultModeFocus(delta, items);
    };
    /**
     * Sets the focus properly given "wrap" mode. In other words, it will continue to move
     * down the list until it finds an item that is not disabled, and it will wrap if it
     * encounters either end of the list.
     */
    ListKeyManager.prototype._setWrapModeFocus = function (delta, items) {
        // when focus would leave menu, wrap to beginning or end
        this._focusedItemIndex =
            (this._focusedItemIndex + delta + items.length) % items.length;
        // skip all disabled menu items recursively until an active one is reached
        if (items[this._focusedItemIndex].disabled) {
            this._setWrapModeFocus(delta, items);
        }
        else {
            items[this._focusedItemIndex].focus();
        }
    };
    /**
     * Sets the focus properly given the default mode. In other words, it will
     * continue to move down the list until it finds an item that is not disabled. If
     * it encounters either end of the list, it will stop and not wrap.
     */
    ListKeyManager.prototype._setDefaultModeFocus = function (delta, items) {
        this._setFocusByIndex(this._focusedItemIndex + delta, delta, items);
    };
    /**
     * Sets the focus to the first enabled item starting at the index specified. If the
     * item is disabled, it will move in the fallbackDelta direction until it either
     * finds an enabled item or encounters the end of the list.
     */
    ListKeyManager.prototype._setFocusByIndex = function (index, fallbackDelta, items) {
        if (items === void 0) { items = this._items.toArray(); }
        if (!items[index]) {
            return;
        }
        while (items[index].disabled) {
            index += fallbackDelta;
            if (!items[index]) {
                return;
            }
        }
        this.setFocus(index);
    };
    return ListKeyManager;
}());

/**
 * The following are all the animations for the md-select component, with each
 * const containing the metadata for one animation.
 *
 * The values below match the implementation of the Material 1 md-select animation.
 */
/**
 * This animation shrinks the placeholder text to 75% of its normal size and translates
 * it to either the top left corner (ltr) or top right corner (rtl) of the trigger,
 * depending on the text direction of the application.
 */
var transformPlaceholder = _angular_core.trigger('transformPlaceholder', [
    _angular_core.state('floating-ltr', _angular_core.style({
        top: '-22px',
        left: '-2px',
        transform: "scale(0.75)"
    })),
    _angular_core.state('floating-rtl', _angular_core.style({
        top: '-22px',
        left: '2px',
        transform: "scale(0.75)"
    })),
    _angular_core.transition('* => *', _angular_core.animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)"))
]);
/**
 * This animation transforms the select's overlay panel on and off the page.
 *
 * When the panel is attached to the DOM, it expands its width 32px, scales it up to
 * 100% on the Y axis, fades in its border, and translates slightly up and to the
 * side to ensure the option text correctly overlaps the trigger text.
 *
 * When the panel is removed from the DOM, it simply fades out linearly.
 */
var transformPanel = _angular_core.trigger('transformPanel', [
    _angular_core.state('showing', _angular_core.style({
        opacity: 1,
        minWidth: 'calc(100% + 32px)',
        transform: "translate3d(0,0,0) scaleY(1)"
    })),
    _angular_core.transition('void => *', [
        _angular_core.style({
            opacity: 0,
            minWidth: '100%',
            transform: "translate3d(0, 0, 0) scaleY(0)"
        }),
        _angular_core.animate("150ms cubic-bezier(0.25, 0.8, 0.25, 1)")
    ]),
    _angular_core.transition('* => void', [
        _angular_core.animate('250ms 100ms linear', _angular_core.style({ opacity: 0 }))
    ])
]);
/**
 * This animation fades in the background color and text content of the
 * select's options. It is time delayed to occur 100ms after the overlay
 * panel has transformed in.
 */
var fadeInContent = _angular_core.trigger('fadeInContent', [
    _angular_core.state('showing', _angular_core.style({ opacity: 1 })),
    _angular_core.transition('void => showing', [
        _angular_core.style({ opacity: 0 }),
        _angular_core.animate("150ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)")
    ])
]);

var __decorate$26 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$26 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$5 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */
/** The fixed height of every option element. */
var SELECT_OPTION_HEIGHT = 48;
/** The max height of the select's overlay panel */
var SELECT_PANEL_MAX_HEIGHT = 256;
/** The max number of options visible at once in the select panel. */
var SELECT_MAX_OPTIONS_DISPLAYED = 5;
/** The fixed height of the select's trigger element. */
var SELECT_TRIGGER_HEIGHT = 30;
/**
 * Must adjust for the difference in height between the option and the trigger,
 * so the text will align on the y axis.
 * (SELECT_OPTION_HEIGHT (48) - SELECT_TRIGGER_HEIGHT (30)) / 2 = 9
 */
var SELECT_OPTION_HEIGHT_ADJUSTMENT = 9;
/** The panel's padding on the x-axis */
var SELECT_PANEL_PADDING_X = 16;
/**
 * The panel's padding on the y-axis. This padding indicates there are more
 * options available if you scroll.
 */
var SELECT_PANEL_PADDING_Y = 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
var SELECT_PANEL_VIEWPORT_PADDING = 8;
var MdSelect = (function () {
    function MdSelect(_element, _renderer, _viewportRuler, _dir, _control) {
        this._element = _element;
        this._renderer = _renderer;
        this._viewportRuler = _viewportRuler;
        this._dir = _dir;
        this._control = _control;
        /** Whether or not the overlay panel is open. */
        this._panelOpen = false;
        /** Subscriptions to option events. */
        this._subscriptions = [];
        /** Whether filling out the select is required in the form.  */
        this._required = false;
        /** Whether the select is disabled.  */
        this._disabled = false;
        /** The scroll position of the overlay panel, calculated to center the selected option. */
        this._scrollTop = 0;
        /** The animation state of the placeholder. */
        this._placeholderState = '';
        /** View -> model callback called when value changes */
        this._onChange = function (value) { };
        /** View -> model callback called when select has been touched */
        this._onTouched = function () { };
        /** The IDs of child options to be passed to the aria-owns attribute. */
        this._optionIds = '';
        /** The value of the select panel's transform-origin property. */
        this._transformOrigin = 'top';
        /**
         * The x-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text when
         * the panel opens. Will change based on LTR or RTL text direction.
         */
        this._offsetX = 0;
        /**
         * The y-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text.
         * when the panel opens. Will change based on the y-position of the selected option.
         */
        this._offsetY = 0;
        /**
         * This position config ensures that the top "start" corner of the overlay
         * is aligned with with the top "start" of the origin by default (overlapping
         * the trigger completely). If the panel cannot fit below the trigger, it
         * will fall back to a position above the trigger.
         */
        this._positions = [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'bottom',
            },
        ];
        this.onOpen = new _angular_core.EventEmitter();
        this.onClose = new _angular_core.EventEmitter();
        if (this._control) {
            this._control.valueAccessor = this;
        }
    }
    Object.defineProperty(MdSelect.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (value) {
            var _this = this;
            this._placeholder = value;
            // Must wait to record the trigger width to ensure placeholder width is included.
            Promise.resolve(null).then(function () { return _this._triggerWidth = _this._getWidth(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "required", {
        get: function () {
            return this._required;
        },
        set: function (value) {
            this._required = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    MdSelect.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._initKeyManager();
        this._resetOptions();
        this._changeSubscription = this.options.changes.subscribe(function () { return _this._resetOptions(); });
    };
    MdSelect.prototype.ngOnDestroy = function () {
        this._dropSubscriptions();
        this._changeSubscription.unsubscribe();
        this._tabSubscription.unsubscribe();
    };
    /** Toggles the overlay panel open or closed. */
    MdSelect.prototype.toggle = function () {
        this.panelOpen ? this.close() : this.open();
    };
    /** Opens the overlay panel. */
    MdSelect.prototype.open = function () {
        if (this.disabled) {
            return;
        }
        this._calculateOverlayPosition();
        this._placeholderState = this._isRtl() ? 'floating-rtl' : 'floating-ltr';
        this._panelOpen = true;
    };
    /** Closes the overlay panel and focuses the host element. */
    MdSelect.prototype.close = function () {
        this._panelOpen = false;
        if (!this._selected) {
            this._placeholderState = '';
        }
        this._focusHost();
    };
    /**
     * Sets the select's value. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     */
    MdSelect.prototype.writeValue = function (value) {
        var _this = this;
        if (!this.options) {
            // In reactive forms, writeValue() will be called synchronously before
            // the select's child options have been created. It's necessary to call
            // writeValue() again after the options have been created to ensure any
            // initial view value is set.
            Promise.resolve(null).then(function () { return _this.writeValue(value); });
            return;
        }
        this._setSelectionByValue(value);
    };
    /**
     * Saves a callback function to be invoked when the select's value
     * changes from user input. Part of the ControlValueAccessor interface
     * required to integrate with Angular's core forms API.
     */
    MdSelect.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    /**
     * Saves a callback function to be invoked when the select is blurred
     * by the user. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     */
    MdSelect.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    /**
     * Disables the select. Part of the ControlValueAccessor interface required
     * to integrate with Angular's core forms API.
     */
    MdSelect.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    Object.defineProperty(MdSelect.prototype, "panelOpen", {
        /** Whether or not the overlay panel is open. */
        get: function () {
            return this._panelOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSelect.prototype, "selected", {
        /** The currently selected option. */
        get: function () {
            return this._selected;
        },
        enumerable: true,
        configurable: true
    });
    MdSelect.prototype._isRtl = function () {
        return this._dir ? this._dir.value === 'rtl' : false;
    };
    /** The width of the trigger element. This is necessary to match
     * the overlay width to the trigger width.
     */
    MdSelect.prototype._getWidth = function () {
        return this._getTriggerRect().width;
    };
    /** Ensures the panel opens if activated by the keyboard. */
    MdSelect.prototype._handleKeydown = function (event) {
        if (event.keyCode === ENTER || event.keyCode === SPACE) {
            this.open();
        }
    };
    /**
     * When the panel is finished animating, emits an event and focuses
     * an option if the panel is open.
     */
    MdSelect.prototype._onPanelDone = function () {
        if (this.panelOpen) {
            this._focusCorrectOption();
            this.onOpen.emit();
        }
        else {
            this.onClose.emit();
        }
    };
    /**
     * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
     * "blur" to the panel when it opens, causing a false positive.
     */
    MdSelect.prototype._onBlur = function () {
        if (!this.panelOpen) {
            this._onTouched();
        }
    };
    /** Returns the correct tabindex for the select depending on disabled state. */
    MdSelect.prototype._getTabIndex = function () {
        return this.disabled ? '-1' : '0';
    };
    /**
     * Sets the scroll position of the scroll container. This must be called after
     * the overlay pane is attached or the scroll container element will not yet be
     * present in the DOM.
     */
    MdSelect.prototype._setScrollTop = function () {
        var scrollContainer = this.overlayDir.overlayRef.overlayElement.querySelector('.md-select-panel');
        scrollContainer.scrollTop = this._scrollTop;
    };
    /**
     * Sets the selected option based on a value. If no option can be
     * found with the designated value, the select trigger is cleared.
     */
    MdSelect.prototype._setSelectionByValue = function (value) {
        var options = this.options.toArray();
        for (var i = 0; i < this.options.length; i++) {
            if (options[i].value === value) {
                options[i].select();
                return;
            }
        }
        // Clear selection if no item was selected.
        this._clearSelection();
    };
    /** Clears the select trigger and deselects every option in the list. */
    MdSelect.prototype._clearSelection = function () {
        this._selected = null;
        this._updateOptions();
    };
    MdSelect.prototype._getTriggerRect = function () {
        return this.trigger.nativeElement.getBoundingClientRect();
    };
    /** Sets up a key manager to listen to keyboard events on the overlay panel. */
    MdSelect.prototype._initKeyManager = function () {
        var _this = this;
        this._keyManager = new ListKeyManager(this.options);
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () {
            _this.close();
        });
    };
    /** Drops current option subscriptions and IDs and resets from scratch. */
    MdSelect.prototype._resetOptions = function () {
        this._dropSubscriptions();
        this._listenToOptions();
        this._setOptionIds();
    };
    /** Listens to selection events on each option. */
    MdSelect.prototype._listenToOptions = function () {
        var _this = this;
        this.options.forEach(function (option) {
            var sub = option.onSelect.subscribe(function (isUserInput) {
                if (isUserInput) {
                    _this._onChange(option.value);
                }
                _this._onSelect(option);
            });
            _this._subscriptions.push(sub);
        });
    };
    /** Unsubscribes from all option subscriptions. */
    MdSelect.prototype._dropSubscriptions = function () {
        this._subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        this._subscriptions = [];
    };
    /** Records option IDs to pass to the aria-owns property. */
    MdSelect.prototype._setOptionIds = function () {
        this._optionIds = this.options.map(function (option) { return option.id; }).join(' ');
    };
    /** When a new option is selected, deselects the others and closes the panel. */
    MdSelect.prototype._onSelect = function (option) {
        this._selected = option;
        this._updateOptions();
        this._setValueWidth();
        this._placeholderState = '';
        if (this.panelOpen) {
            this.close();
        }
    };
    /** Deselect each option that doesn't match the current selection. */
    MdSelect.prototype._updateOptions = function () {
        var _this = this;
        this.options.forEach(function (option) {
            if (option !== _this.selected) {
                option.deselect();
            }
        });
    };
    /**
     * Must set the width of the selected option's value programmatically
     * because it is absolutely positioned and otherwise will not clip
     * overflow. The selection arrow is 9px wide, add 4px of padding = 13
     */
    MdSelect.prototype._setValueWidth = function () {
        this._selectedValueWidth = this._triggerWidth - 13;
    };
    /** Focuses the selected item. If no option is selected, it will focus
     * the first item instead.
     */
    MdSelect.prototype._focusCorrectOption = function () {
        if (this.selected) {
            this._keyManager.setFocus(this._getOptionIndex(this.selected));
        }
        else {
            this._keyManager.focusFirstItem();
        }
    };
    /** Focuses the host element when the panel closes. */
    MdSelect.prototype._focusHost = function () {
        this._renderer.invokeElementMethod(this._element.nativeElement, 'focus');
    };
    /** Gets the index of the provided option in the option list. */
    MdSelect.prototype._getOptionIndex = function (option) {
        return this.options.reduce(function (result, current, index) {
            return result === undefined ? (option === current ? index : undefined) : result;
        }, undefined);
    };
    /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
    MdSelect.prototype._calculateOverlayPosition = function () {
        this._offsetX = this._isRtl() ? SELECT_PANEL_PADDING_X : -SELECT_PANEL_PADDING_X;
        var panelHeight = Math.min(this.options.length * SELECT_OPTION_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var scrollContainerHeight = this.options.length * SELECT_OPTION_HEIGHT;
        // The farthest the panel can be scrolled before it hits the bottom
        var maxScroll = scrollContainerHeight - panelHeight;
        if (this.selected) {
            var selectedIndex = this._getOptionIndex(this.selected);
            // We must maintain a scroll buffer so the selected option will be scrolled to the
            // center of the overlay panel rather than the top.
            var scrollBuffer = panelHeight / 2;
            this._scrollTop = this._calculateOverlayScroll(selectedIndex, scrollBuffer, maxScroll);
            this._offsetY = this._calculateOverlayOffset(selectedIndex, scrollBuffer, maxScroll);
        }
        else {
            // If no option is selected, the panel centers on the first option. In this case,
            // we must only adjust for the height difference between the option element
            // and the trigger element, then multiply it by -1 to ensure the panel moves
            // in the correct direction up the page.
            this._offsetY = (SELECT_OPTION_HEIGHT - SELECT_TRIGGER_HEIGHT) / 2 * -1;
        }
        this._checkOverlayWithinViewport(maxScroll);
    };
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     */
    MdSelect.prototype._calculateOverlayScroll = function (selectedIndex, scrollBuffer, maxScroll) {
        var optionOffsetFromScrollTop = SELECT_OPTION_HEIGHT * selectedIndex;
        var halfOptionHeight = SELECT_OPTION_HEIGHT / 2;
        // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
        // scroll container, then subtracts the scroll buffer to scroll the option down to
        // the center of the overlay panel. Half the option height must be re-added to the
        // scrollTop so the option is centered based on its middle, not its top edge.
        var optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
        return clampValue(0, optimalScrollPosition, maxScroll);
    };
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     */
    MdSelect.prototype._calculateOverlayOffset = function (selectedIndex, scrollBuffer, maxScroll) {
        var optionOffsetFromPanelTop;
        if (this._scrollTop === 0) {
            optionOffsetFromPanelTop = selectedIndex * SELECT_OPTION_HEIGHT;
        }
        else if (this._scrollTop === maxScroll) {
            var firstDisplayedIndex = this.options.length - SELECT_MAX_OPTIONS_DISPLAYED;
            var selectedDisplayIndex = selectedIndex - firstDisplayedIndex;
            // Because the panel height is longer than the height of the options alone,
            // there is always extra padding at the top or bottom of the panel. When
            // scrolled to the very bottom, this padding is at the top of the panel and
            // must be added to the offset.
            optionOffsetFromPanelTop =
                selectedDisplayIndex * SELECT_OPTION_HEIGHT + SELECT_PANEL_PADDING_Y;
        }
        else {
            // If the option was scrolled to the middle of the panel using a scroll buffer,
            // its offset will be the scroll buffer minus the half height that was added to
            // center it.
            optionOffsetFromPanelTop = scrollBuffer - SELECT_OPTION_HEIGHT / 2;
        }
        // The final offset is the option's offset from the top, adjusted for the height
        // difference, multiplied by -1 to ensure that the overlay moves in the correct
        // direction up the page.
        return optionOffsetFromPanelTop * -1 - SELECT_OPTION_HEIGHT_ADJUSTMENT;
    };
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     */
    MdSelect.prototype._checkOverlayWithinViewport = function (maxScroll) {
        var viewportRect = this._viewportRuler.getViewportRect();
        var triggerRect = this._getTriggerRect();
        var topSpaceAvailable = triggerRect.top - SELECT_PANEL_VIEWPORT_PADDING;
        var bottomSpaceAvailable = viewportRect.height - triggerRect.bottom - SELECT_PANEL_VIEWPORT_PADDING;
        var panelHeightTop = Math.abs(this._offsetY);
        var totalPanelHeight = Math.min(this.options.length * SELECT_OPTION_HEIGHT, SELECT_PANEL_MAX_HEIGHT);
        var panelHeightBottom = totalPanelHeight - panelHeightTop - triggerRect.height;
        if (panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        }
        else if (panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        }
        else {
            this._transformOrigin = this._getOriginBasedOnOption();
        }
    };
    /** Adjusts the overlay panel up to fit in the viewport. */
    MdSelect.prototype._adjustPanelUp = function (panelHeightBottom, bottomSpaceAvailable) {
        var distanceBelowViewport = panelHeightBottom - bottomSpaceAvailable;
        // Scrolls the panel up by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel up into the viewport.
        this._scrollTop -= distanceBelowViewport;
        this._offsetY -= distanceBelowViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very top, it won't be able to fit the panel
        // by scrolling, so set the offset to 0 to allow the fallback position to take
        // effect.
        if (this._scrollTop <= 0) {
            this._scrollTop = 0;
            this._offsetY = 0;
            this._transformOrigin = "50% bottom 0px";
        }
    };
    /** Adjusts the overlay panel down to fit in the viewport. */
    MdSelect.prototype._adjustPanelDown = function (panelHeightTop, topSpaceAvailable, maxScroll) {
        var distanceAboveViewport = panelHeightTop - topSpaceAvailable;
        // Scrolls the panel down by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel down into the viewport.
        this._scrollTop += distanceAboveViewport;
        this._offsetY += distanceAboveViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very bottom, it won't be able to fit the
        // panel by scrolling, so set the offset to 0 to allow the fallback position
        // to take effect.
        if (this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this._offsetY = 0;
            this._transformOrigin = "50% top 0px";
            return;
        }
    };
    /** Sets the transform origin point based on the selected option. */
    MdSelect.prototype._getOriginBasedOnOption = function () {
        var originY = Math.abs(this._offsetY) - SELECT_OPTION_HEIGHT_ADJUSTMENT + SELECT_OPTION_HEIGHT / 2;
        return "50% " + originY + "px 0px";
    };
    __decorate$26([
        _angular_core.ViewChild('trigger'), 
        __metadata$26('design:type', _angular_core.ElementRef)
    ], MdSelect.prototype, "trigger", void 0);
    __decorate$26([
        _angular_core.ViewChild(ConnectedOverlayDirective), 
        __metadata$26('design:type', ConnectedOverlayDirective)
    ], MdSelect.prototype, "overlayDir", void 0);
    __decorate$26([
        _angular_core.ContentChildren(MdOption), 
        __metadata$26('design:type', _angular_core.QueryList)
    ], MdSelect.prototype, "options", void 0);
    __decorate$26([
        _angular_core.Input(), 
        __metadata$26('design:type', Object)
    ], MdSelect.prototype, "placeholder", null);
    __decorate$26([
        _angular_core.Input(), 
        __metadata$26('design:type', Object)
    ], MdSelect.prototype, "disabled", null);
    __decorate$26([
        _angular_core.Input(), 
        __metadata$26('design:type', Object)
    ], MdSelect.prototype, "required", null);
    __decorate$26([
        _angular_core.Output(), 
        __metadata$26('design:type', Object)
    ], MdSelect.prototype, "onOpen", void 0);
    __decorate$26([
        _angular_core.Output(), 
        __metadata$26('design:type', Object)
    ], MdSelect.prototype, "onClose", void 0);
    MdSelect = __decorate$26([
        _angular_core.Component({selector: 'md-select, mat-select',
            template: "<div class=\"md-select-trigger\" overlay-origin (click)=\"toggle()\" #origin=\"overlayOrigin\" #trigger><span class=\"md-select-placeholder\" [class.md-floating-placeholder]=\"this.selected\" [@transformplaceholder]=\"_placeholderState\" [style.width.px]=\"_selectedValueWidth\">{{ placeholder }} </span><span class=\"md-select-value\" *ngif=\"selected\">{{ selected?.viewValue }} </span><span class=\"md-select-arrow\"></span></div><template connected-overlay [origin]=\"origin\" [open]=\"panelOpen\" hasbackdrop (backdropclick)=\"close()\" backdropclass=\"md-overlay-transparent-backdrop\" [positions]=\"_positions\" [minwidth]=\"_triggerWidth\" [offsety]=\"_offsetY\" [offsetx]=\"_offsetX\" (attach)=\"_setScrollTop()\"><div class=\"md-select-panel\" [@transformpanel]=\"'showing'\" (@transformpanel.done)=\"_onPanelDone()\" (keydown)=\"_keyManager.onKeydown($event)\" [style.transformorigin]=\"_transformOrigin\"><div class=\"md-select-content\" [@fadeincontent]=\"'showing'\"><ng-content></ng-content></div></div></template>",
            styles: [".md-select-value,md-option{white-space:nowrap;text-overflow:ellipsis}md-select{display:inline-block;outline:0}.md-select-trigger{display:flex;justify-content:space-between;align-items:center;height:30px;min-width:112px;cursor:pointer;position:relative;box-sizing:border-box}[aria-disabled=true] .md-select-trigger{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-bottom:transparent;background-position:0 bottom;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-select-placeholder{position:relative;padding:0 2px;transform-origin:left top}.md-select-placeholder.md-floating-placeholder{top:-22px;left:-2px;transform:scale(.75)}[dir=rtl] .md-select-placeholder{transform-origin:right top}[dir=rtl] .md-select-placeholder.md-floating-placeholder{left:2px}[aria-required=true] .md-select-placeholder::after{content:'*'}.md-select-value{position:absolute;overflow-x:hidden;left:0;top:6px}[dir=rtl] .md-select-value{left:auto;right:0}.md-select-arrow{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;margin:0 4px}.md-select-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px}@media screen and (-ms-high-contrast:active){.md-select-panel{outline:solid 1px}.md-option-ripple{opacity:.5}}md-option{overflow-x:hidden;display:flex;flex-direction:row;align-items:center;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:start;text-decoration:none;position:relative;cursor:pointer;outline:0}md-option[disabled]{cursor:default}md-option md-icon{margin-right:16px}[dir=rtl] md-option md-icon{margin-left:16px}md-option[aria-disabled=true]{cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-option-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            host: {
                'role': 'listbox',
                '[attr.tabindex]': '_getTabIndex()',
                '[attr.aria-label]': 'placeholder',
                '[attr.aria-required]': 'required.toString()',
                '[attr.aria-disabled]': 'disabled.toString()',
                '[attr.aria-invalid]': '_control?.invalid || "false"',
                '[attr.aria-owns]': '_optionIds',
                '[class.md-select-disabled]': 'disabled',
                '(keydown)': '_handleKeydown($event)',
                '(blur)': '_onBlur()'
            },
            animations: [
                transformPlaceholder,
                transformPanel,
                fadeInContent
            ],
            exportAs: 'mdSelect',
        }),
        __param$5(3, _angular_core.Optional()),
        __param$5(4, _angular_core.Optional()), 
        __metadata$26('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer, ViewportRuler, Dir, _angular_forms.NgControl])
    ], MdSelect);
    return MdSelect;
}());
/** Clamps a value n between min and max values. */
function clampValue(min, n, max) {
    return Math.min(Math.max(min, n), max);
}

var __decorate$25 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$25 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdSelectModule = (function () {
    function MdSelectModule() {
    }
    MdSelectModule.forRoot = function () {
        return {
            ngModule: MdSelectModule,
            providers: [OVERLAY_PROVIDERS]
        };
    };
    MdSelectModule = __decorate$25([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, OverlayModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSelect, MdOption, DefaultStyleCompatibilityModeModule],
            declarations: [MdSelect, MdOption],
        }), 
        __metadata$25('design:paramtypes', [])
    ], MdSelectModule);
    return MdSelectModule;
}());

var __decorate$28 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$28 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MD_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdSlideToggle; }),
    multi: true
};
// A simple change event emitted by the MdSlideToggle component.
var MdSlideToggleChange = (function () {
    function MdSlideToggleChange() {
    }
    return MdSlideToggleChange;
}());
// Increasing integer for generating unique ids for slide-toggle components.
var nextId$1 = 0;
var MdSlideToggle = (function () {
    function MdSlideToggle(_elementRef, _renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        // A unique id for the slide-toggle. By default the id is auto-generated.
        this._uniqueId = "md-slide-toggle-" + ++nextId$1;
        this._checked = false;
        this._isMousedown = false;
        this._slideRenderer = null;
        this._disabled = false;
        this._required = false;
        // Needs to be public to support AOT compilation (as host binding).
        this._hasFocus = false;
        this.name = null;
        this.id = this._uniqueId;
        this.tabIndex = 0;
        this.ariaLabel = null;
        this.ariaLabelledby = null;
        this._change = new _angular_core.EventEmitter();
        this.change = this._change.asObservable();
        // Returns the unique id for the visual hidden input.
        this.getInputId = function () { return ((_this.id || _this._uniqueId) + "-input"); };
    }
    Object.defineProperty(MdSlideToggle.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MdSlideToggle.prototype.ngAfterContentInit = function () {
        this._slideRenderer = new SlideToggleRenderer(this._elementRef);
    };
    /**
     * The onChangeEvent method will be also called on click.
     * This is because everything for the slide-toggle is wrapped inside of a label,
     * which triggers a onChange event on click.
     */
    MdSlideToggle.prototype._onChangeEvent = function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Once a drag is currently in progress, we do not want to toggle the slide-toggle on a click.
        if (!this.disabled && !this._slideRenderer.isDragging()) {
            this.toggle();
            // Emit our custom change event if the native input emitted one.
            // It is important to only emit it, if the native input triggered one, because
            // we don't want to trigger a change event, when the `checked` variable changes for example.
            this._emitChangeEvent();
        }
    };
    MdSlideToggle.prototype._onInputClick = function (event) {
        this.onTouched();
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    MdSlideToggle.prototype._setMousedown = function () {
        var _this = this;
        // We only *show* the focus style when focus has come to the button via the keyboard.
        // The Material Design spec is silent on this topic, and without doing this, the
        // button continues to look :active after clicking.
        // @see http://marcysutton.com/button-focus-hell/
        this._isMousedown = true;
        setTimeout(function () { return _this._isMousedown = false; }, 100);
    };
    MdSlideToggle.prototype._onInputFocus = function () {
        // Only show the focus / ripple indicator when the focus was not triggered by a mouse
        // interaction on the component.
        if (!this._isMousedown) {
            this._hasFocus = true;
        }
    };
    MdSlideToggle.prototype._onInputBlur = function () {
        this._hasFocus = false;
        this.onTouched();
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.writeValue = function (value) {
        this.checked = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlideToggle.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdSlideToggle.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MdSlideToggle.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
        this._onInputFocus();
    };
    Object.defineProperty(MdSlideToggle.prototype, "checked", {
        get: function () {
            return !!this._checked;
        },
        set: function (value) {
            if (this.checked !== !!value) {
                this._checked = value;
                this.onChange(this._checked);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlideToggle.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdSlideToggle.prototype.toggle = function () {
        this.checked = !this.checked;
    };
    MdSlideToggle.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdSlideToggle.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    /** Emits the change event to the `change` output EventEmitter */
    MdSlideToggle.prototype._emitChangeEvent = function () {
        var event = new MdSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this._change.emit(event);
    };
    MdSlideToggle.prototype._onDragStart = function () {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    };
    MdSlideToggle.prototype._onDrag = function (event) {
        if (this._slideRenderer.isDragging()) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    };
    MdSlideToggle.prototype._onDragEnd = function () {
        var _this = this;
        if (!this._slideRenderer.isDragging()) {
            return;
        }
        // Notice that we have to stop outside of the current event handler,
        // because otherwise the click event will be fired and will reset the new checked variable.
        setTimeout(function () {
            _this.checked = _this._slideRenderer.stopThumbDrag();
            _this._emitChangeEvent();
        }, 0);
    };
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', String)
    ], MdSlideToggle.prototype, "name", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', String)
    ], MdSlideToggle.prototype, "id", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', Number)
    ], MdSlideToggle.prototype, "tabIndex", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabel", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', String)
    ], MdSlideToggle.prototype, "ariaLabelledby", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', Boolean)
    ], MdSlideToggle.prototype, "disabled", null);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', Boolean)
    ], MdSlideToggle.prototype, "required", null);
    __decorate$28([
        _angular_core.Output(), 
        __metadata$28('design:type', rxjs_Observable.Observable)
    ], MdSlideToggle.prototype, "change", void 0);
    __decorate$28([
        _angular_core.ViewChild('input'), 
        __metadata$28('design:type', _angular_core.ElementRef)
    ], MdSlideToggle.prototype, "_inputElement", void 0);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', Object)
    ], MdSlideToggle.prototype, "checked", null);
    __decorate$28([
        _angular_core.Input(), 
        __metadata$28('design:type', String)
    ], MdSlideToggle.prototype, "color", null);
    MdSlideToggle = __decorate$28([
        _angular_core.Component({selector: 'md-slide-toggle, mat-slide-toggle',
            host: {
                '[class.md-checked]': 'checked',
                '[class.md-disabled]': 'disabled',
                // This md-slide-toggle prefix will change, once the temporary ripple is removed.
                '[class.md-slide-toggle-focused]': '_hasFocus',
                '(mousedown)': '_setMousedown()'
            },
            template: "<label class=\"md-slide-toggle-label\"><div class=\"md-slide-toggle-container\"><div class=\"md-slide-toggle-bar\"></div><div class=\"md-slide-toggle-thumb-container\" (slidestart)=\"_onDragStart()\" (slide)=\"_onDrag($event)\" (slideend)=\"_onDragEnd()\"><div class=\"md-slide-toggle-thumb\"><div class=\"md-ink-ripple\"></div></div></div><input #input class=\"md-slide-toggle-input md-visually-hidden\" type=\"checkbox\" [id]=\"getInputId()\" [required]=\"required\" [tabindex]=\"tabIndex\" [checked]=\"checked\" [disabled]=\"disabled\" [attr.name]=\"name\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledby\" (blur)=\"_onInputBlur()\" (focus)=\"_onInputFocus()\" (change)=\"_onChangeEvent($event)\" (click)=\"_onInputClick($event)\"></div><span class=\"md-slide-toggle-content\"><ng-content></ng-content></span></label>",
            styles: ["md-slide-toggle{display:flex;height:24px;margin:16px 0;line-height:24px;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0}md-slide-toggle.md-checked .md-slide-toggle-thumb-container{transform:translate3d(100%,0,0)}md-slide-toggle .md-ink-ripple{border-radius:50%;opacity:0;height:48px;left:50%;overflow:hidden;pointer-events:none;position:absolute;top:50%;transform:translate(-50%,-50%);transition:opacity ease 280ms,background-color ease 280ms;width:48px}md-slide-toggle.md-slide-toggle-focused .md-ink-ripple{opacity:1}md-slide-toggle.md-slide-toggle-disabled .md-ink-ripple{background-color:#000}md-slide-toggle.md-disabled .md-slide-toggle-container,md-slide-toggle.md-disabled .md-slide-toggle-label{cursor:default}.md-slide-toggle-content{font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500}.md-slide-toggle-label{display:flex;flex:1;cursor:pointer}.md-slide-toggle-container{cursor:-webkit-grab;cursor:grab;width:36px;height:24px;position:relative;margin-right:8px}[dir=rtl] .md-slide-toggle-container{margin-left:8px;margin-right:0}.md-slide-toggle-thumb-container{position:absolute;top:2px;left:0;z-index:1;width:16px;transform:translate3d(0,0,0);transition:all 80ms linear;transition-property:transform}.md-slide-toggle-thumb-container.md-dragging{transition-duration:0s}.md-slide-toggle-thumb{position:absolute;margin:0;left:0;top:0;height:20px;width:20px;border-radius:50%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}@media screen and (-ms-high-contrast:active){.md-slide-toggle-thumb{background:#fff;border:1px solid #000}.md-slide-toggle-bar{background:#fff}}.md-slide-toggle-bar{position:absolute;left:1px;top:5px;width:34px;height:14px;border-radius:8px}.md-slide-toggle-input{bottom:0;left:10px}.md-slide-toggle-bar,.md-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}"],
            providers: [MD_SLIDE_TOGGLE_VALUE_ACCESSOR],
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
        }), 
        __metadata$28('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdSlideToggle);
    return MdSlideToggle;
}());
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = (function () {
    function SlideToggleRenderer(_elementRef) {
        this._elementRef = _elementRef;
        this._thumbEl = _elementRef.nativeElement.querySelector('.md-slide-toggle-thumb-container');
        this._thumbBarEl = _elementRef.nativeElement.querySelector('.md-slide-toggle-bar');
    }
    /** Whether the slide-toggle is currently dragging. */
    SlideToggleRenderer.prototype.isDragging = function () {
        return !!this._thumbBarWidth;
    };
    /** Initializes the drag of the slide-toggle. */
    SlideToggleRenderer.prototype.startThumbDrag = function (checked) {
        if (!this.isDragging()) {
            this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
            this._checked = checked;
            this._thumbEl.classList.add('md-dragging');
        }
    };
    /** Stops the current drag and returns the new checked value. */
    SlideToggleRenderer.prototype.stopThumbDrag = function () {
        if (this.isDragging()) {
            this._thumbBarWidth = null;
            this._thumbEl.classList.remove('md-dragging');
            applyCssTransform(this._thumbEl, '');
            return this._percentage > 50;
        }
    };
    /** Updates the thumb containers position from the specified distance. */
    SlideToggleRenderer.prototype.updateThumbPosition = function (distance) {
        this._percentage = this._getThumbPercentage(distance);
        applyCssTransform(this._thumbEl, "translate3d(" + this._percentage + "%, 0, 0)");
    };
    /** Retrieves the percentage of thumb from the moved distance. */
    SlideToggleRenderer.prototype._getThumbPercentage = function (distance) {
        var percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._checked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());
var MdSlideToggleModule = (function () {
    function MdSlideToggleModule() {
    }
    MdSlideToggleModule.forRoot = function () {
        return {
            ngModule: MdSlideToggleModule,
            providers: [{ provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig }]
        };
    };
    MdSlideToggleModule = __decorate$28([
        _angular_core.NgModule({
            imports: [_angular_forms.FormsModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSlideToggle, DefaultStyleCompatibilityModeModule],
            declarations: [MdSlideToggle],
        }), 
        __metadata$28('design:paramtypes', [])
    ], MdSlideToggleModule);
    return MdSlideToggleModule;
}());

var __decorate$29 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$29 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$6 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * Visually, a 30px separation between tick marks looks best. This is very subjective but it is
 * the default separation we chose.
 */
var MIN_AUTO_TICK_SEPARATION = 30;
/**
 * Provider Expression that allows md-slider to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)] and [formControl].
 */
var MD_SLIDER_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdSlider; }),
    multi: true
};
/** A simple change event emitted by the MdSlider component. */
var MdSliderChange = (function () {
    function MdSliderChange() {
    }
    return MdSliderChange;
}());
var MdSlider = (function () {
    function MdSlider(_dir, elementRef) {
        this._dir = _dir;
        /** A renderer to handle updating the slider's thumb and fill track. */
        this._renderer = null;
        /** The dimensions of the slider. */
        this._sliderDimensions = null;
        /** Whether or not the slider is disabled. */
        this._disabled = false;
        /** Whether or not to show the thumb label. */
        this._thumbLabel = false;
        this._controlValueAccessorChangeFn = function () { };
        /** The last value for which a change event was emitted. */
        this._lastEmittedValue = null;
        /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
        this.onTouched = function () { };
        /**
         * Whether or not the thumb is sliding.
         * Used to determine if there should be a transition for the thumb and fill track.
         */
        this._isSliding = false;
        /**
         * Whether or not the slider is active (clicked or sliding).
         * Used to shrink and grow the thumb as according to the Material Design spec.
         */
        this._isActive = false;
        /** The values at which the thumb will snap. */
        this._step = 1;
        /**
         * How often to show ticks. Relative to the step so that a tick always appears on a step.
         * Ex: Tick interval of 4 with a step of 3 will draw a tick every 4 steps (every 12 values).
         */
        this._tickInterval = 0;
        /** The size of a tick interval as a percentage of the size of the track. */
        this._tickIntervalPercent = 0;
        /** The percentage of the slider that coincides with the value. */
        this._percent = 0;
        /** Value of the slider. */
        this._value = null;
        /** The miniumum value that the slider can have. */
        this._min = 0;
        /** The maximum value that the slider can have. */
        this._max = 100;
        this._invert = false;
        this._vertical = false;
        this.change = new _angular_core.EventEmitter();
        this._renderer = new SliderRenderer(elementRef);
    }
    Object.defineProperty(MdSlider.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbLabel", {
        get: function () { return this._thumbLabel; },
        set: function (value) { this._thumbLabel = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_thumbLabelDeprecated", {
        /** @deprecated */
        get: function () { return this._thumbLabel; },
        set: function (value) { this._thumbLabel = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "step", {
        get: function () { return this._step; },
        set: function (v) { this._step = coerceNumberProperty(v, this._step); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickInterval", {
        get: function () { return this._tickInterval; },
        set: function (v) {
            this._tickInterval = (v == 'auto') ? v : coerceNumberProperty(v, this._tickInterval);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "_tickIntervalDeprecated", {
        /** @deprecated */
        get: function () { return this.tickInterval; },
        set: function (v) { this.tickInterval = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "tickIntervalPercent", {
        get: function () { return this._tickIntervalPercent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "percent", {
        get: function () { return this._clamp(this._percent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "value", {
        get: function () {
            // If the value needs to be read and it is still uninitialized, initialize it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            return this._value;
        },
        set: function (v) {
            this._value = coerceNumberProperty(v, this._value);
            this._percent = this._calculatePercentage(this._value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (v) {
            this._min = coerceNumberProperty(v, this._min);
            // If the value wasn't explicitly set by the user, set it to the min.
            if (this._value === null) {
                this.value = this._min;
            }
            this._percent = this._calculatePercentage(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (v) {
            this._max = coerceNumberProperty(v, this._max);
            this._percent = this._calculatePercentage(this.value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "invert", {
        /** Whether the slider is inverted. */
        get: function () { return this._invert; },
        set: function (value) { this._invert = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "vertical", {
        /** Whether the slider is vertical. */
        get: function () { return this._vertical; },
        set: function (value) { this._vertical = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "invertAxis", {
        /**
         * Whether the axis of the slider is inverted.
         * (i.e. whether moving the thumb in the positive x or y direction decreases the slider's value).
         */
        get: function () {
            // Standard non-inverted mode for a vertical slider should be dragging the thumb from bottom to
            // top. However from a y-axis standpoint this is inverted.
            return this.vertical ? !this.invert : this.invert;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "invertMouseCoords", {
        /**
         * Whether mouse events should be converted to a slider position by calculating their distance
         * from the right or bottom edge of the slider as opposed to the top or left.
         */
        get: function () {
            return (this.direction == 'rtl' && !this.vertical) ? !this.invertAxis : this.invertAxis;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "trackFillStyles", {
        /** CSS styles for the track fill element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            return {
                'transform': "scale" + axis + "(" + this.percent + ")"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "ticksContainerStyles", {
        /** CSS styles for the ticks container element. */
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the ticks container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var sign = !this.vertical && this.direction == 'rtl' ? '' : '-';
            var offset = this.tickIntervalPercent / 2 * 100;
            return {
                'transform': "translate" + axis + "(" + sign + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "ticksStyles", {
        /** CSS styles for the ticks element. */
        get: function () {
            var tickSize = this.tickIntervalPercent * 100;
            var backgroundSize = this.vertical ? "2px " + tickSize + "%" : tickSize + "% 2px";
            var axis = this.vertical ? 'Y' : 'X';
            // Depending on the direction we pushed the ticks container, push the ticks the opposite
            // direction to re-center them but clip off the end edge. In RTL languages we need to flip the
            // ticks 180 degrees so we're really cutting off the end edge abd not the start.
            var sign = !this.vertical && this.direction == 'rtl' ? '-' : '';
            var rotate = !this.vertical && this.direction == 'rtl' ? ' rotate(180deg)' : '';
            return {
                'backgroundSize': backgroundSize,
                // Without translateZ ticks sometimes jitter as the slider moves on Chrome & Firefox.
                'transform': "translateZ(0) translate" + axis + "(" + sign + tickSize / 2 + "%)" + rotate
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "thumbContainerStyles", {
        get: function () {
            var axis = this.vertical ? 'Y' : 'X';
            // For a horizontal slider in RTL languages we push the thumb container off the left edge
            // instead of the right edge to avoid causing a horizontal scrollbar to appear.
            var invertOffset = (this.direction == 'rtl' && !this.vertical) ? !this.invertAxis : this.invertAxis;
            var offset = (invertOffset ? this.percent : 1 - this.percent) * 100;
            return {
                'transform': "translate" + axis + "(-" + offset + "%)"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSlider.prototype, "direction", {
        /** The language direction for this slider element. */
        get: function () {
            return (this._dir && this._dir.value == 'rtl') ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    MdSlider.prototype._onMouseenter = function () {
        if (this.disabled) {
            return;
        }
        // We save the dimensions of the slider here so we can use them to update the spacing of the
        // ticks and determine where on the slider click and slide events happen.
        this._sliderDimensions = this._renderer.getSliderDimensions();
        this._updateTickIntervalPercent();
    };
    MdSlider.prototype._onClick = function (event) {
        if (this.disabled) {
            return;
        }
        this._isActive = true;
        this._isSliding = false;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.clientX, y: event.clientY });
        this._emitValueIfChanged();
    };
    MdSlider.prototype._onSlide = function (event) {
        if (this.disabled) {
            return;
        }
        // Prevent the slide from selecting anything else.
        event.preventDefault();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
    };
    MdSlider.prototype._onSlideStart = function (event) {
        if (this.disabled) {
            return;
        }
        // Simulate mouseenter in case this is a mobile device.
        this._onMouseenter();
        event.preventDefault();
        this._isSliding = true;
        this._isActive = true;
        this._renderer.addFocus();
        this._updateValueFromPosition({ x: event.center.x, y: event.center.y });
    };
    MdSlider.prototype._onSlideEnd = function () {
        this._isSliding = false;
        this._emitValueIfChanged();
    };
    MdSlider.prototype._onBlur = function () {
        this._isActive = false;
        this.onTouched();
    };
    MdSlider.prototype._onKeydown = function (event) {
        if (this.disabled) {
            return;
        }
        switch (event.keyCode) {
            case PAGE_UP:
                this._increment(10);
                break;
            case PAGE_DOWN:
                this._increment(-10);
                break;
            case END:
                this.value = this.max;
                break;
            case HOME:
                this.value = this.min;
                break;
            case LEFT_ARROW:
                // NOTE: For a sighted user it would make more sense that when they press an arrow key on an
                // inverted slider the thumb moves in that direction. However for a blind user, nothing
                // about the slider indicates that it is inverted. They will expect left to be decrement,
                // regardless of how it appears on the screen. For speakers ofRTL languages, they probably
                // expect left to mean increment. Therefore we flip the meaning of the side arrow keys for
                // RTL. For inverted sliders we prefer a good a11y experience to having it "look right" for
                // sighted users, therefore we do not swap the meaning.
                this._increment(this.direction == 'rtl' ? 1 : -1);
                break;
            case UP_ARROW:
                this._increment(1);
                break;
            case RIGHT_ARROW:
                // See comment on LEFT_ARROW about the conditions under which we flip the meaning.
                this._increment(this.direction == 'rtl' ? -1 : 1);
                break;
            case DOWN_ARROW:
                this._increment(-1);
                break;
            default:
                // Return if the key is not one that we explicitly handle to avoid calling preventDefault on
                // it.
                return;
        }
        event.preventDefault();
    };
    /** Increments the slider by the given number of steps (negative number decrements). */
    MdSlider.prototype._increment = function (numSteps) {
        this.value = this._clamp(this.value + this.step * numSteps, this.min, this.max);
    };
    /** Calculate the new value from the new physical location. The value will always be snapped. */
    MdSlider.prototype._updateValueFromPosition = function (pos) {
        if (!this._sliderDimensions) {
            return;
        }
        var offset = this.vertical ? this._sliderDimensions.top : this._sliderDimensions.left;
        var size = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
        var posComponent = this.vertical ? pos.y : pos.x;
        // The exact value is calculated from the event and used to find the closest snap value.
        var percent = this._clamp((posComponent - offset) / size);
        if (this.invertMouseCoords) {
            percent = 1 - percent;
        }
        var exactValue = this._calculateValue(percent);
        // This calculation finds the closest step by finding the closest whole number divisible by the
        // step relative to the min.
        var closestValue = Math.round((exactValue - this.min) / this.step) * this.step + this.min;
        // The value needs to snap to the min and max.
        this.value = this._clamp(closestValue, this.min, this.max);
    };
    /** Emits a change event if the current value is different from the last emitted value. */
    MdSlider.prototype._emitValueIfChanged = function () {
        if (this.value != this._lastEmittedValue) {
            var event_1 = new MdSliderChange();
            event_1.source = this;
            event_1.value = this.value;
            this._lastEmittedValue = this.value;
            this._controlValueAccessorChangeFn(this.value);
            this.change.emit(event_1);
        }
    };
    /** Updates the amount of space between ticks as a percentage of the width of the slider. */
    MdSlider.prototype._updateTickIntervalPercent = function () {
        if (!this.tickInterval) {
            return;
        }
        if (this.tickInterval == 'auto') {
            var trackSize = this.vertical ? this._sliderDimensions.height : this._sliderDimensions.width;
            var pixelsPerStep = trackSize * this.step / (this.max - this.min);
            var stepsPerTick = Math.ceil(MIN_AUTO_TICK_SEPARATION / pixelsPerStep);
            var pixelsPerTick = stepsPerTick * this.step;
            this._tickIntervalPercent = pixelsPerTick / trackSize;
        }
        else {
            this._tickIntervalPercent = this.tickInterval * this.step / (this.max - this.min);
        }
    };
    /** Calculates the percentage of the slider that a value is. */
    MdSlider.prototype._calculatePercentage = function (value) {
        return (value - this.min) / (this.max - this.min);
    };
    /** Calculates the value a percentage of the slider corresponds to. */
    MdSlider.prototype._calculateValue = function (percentage) {
        return this.min + percentage * (this.max - this.min);
    };
    /** Return a number between two numbers. */
    MdSlider.prototype._clamp = function (value, min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlider.prototype.writeValue = function (value) {
        this.value = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlider.prototype.registerOnChange = function (fn) {
        this._controlValueAccessorChangeFn = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlider.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdSlider.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Boolean)
    ], MdSlider.prototype, "disabled", null);
    __decorate$29([
        _angular_core.Input('thumbLabel'), 
        __metadata$29('design:type', Boolean)
    ], MdSlider.prototype, "thumbLabel", null);
    __decorate$29([
        _angular_core.Input('thumb-label'), 
        __metadata$29('design:type', Boolean)
    ], MdSlider.prototype, "_thumbLabelDeprecated", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "step", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "tickInterval", null);
    __decorate$29([
        _angular_core.Input('tick-interval'), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "_tickIntervalDeprecated", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "value", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "min", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "max", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "invert", null);
    __decorate$29([
        _angular_core.Input(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "vertical", null);
    __decorate$29([
        _angular_core.Output(), 
        __metadata$29('design:type', Object)
    ], MdSlider.prototype, "change", void 0);
    MdSlider = __decorate$29([
        _angular_core.Component({selector: 'md-slider, mat-slider',
            providers: [MD_SLIDER_VALUE_ACCESSOR],
            host: {
                '(blur)': '_onBlur()',
                '(click)': '_onClick($event)',
                '(keydown)': '_onKeydown($event)',
                '(mouseenter)': '_onMouseenter()',
                '(slide)': '_onSlide($event)',
                '(slideend)': '_onSlideEnd()',
                '(slidestart)': '_onSlideStart($event)',
                'role': 'slider',
                'tabindex': '0',
                '[attr.aria-disabled]': 'disabled',
                '[attr.aria-valuemax]': 'max',
                '[attr.aria-valuemin]': 'min',
                '[attr.aria-valuenow]': 'value',
                '[class.md-slider-active]': '_isActive',
                '[class.md-slider-disabled]': 'disabled',
                '[class.md-slider-has-ticks]': 'tickInterval',
                '[class.md-slider-horizontal]': '!vertical',
                '[class.md-slider-axis-inverted]': 'invertAxis',
                '[class.md-slider-sliding]': '_isSliding',
                '[class.md-slider-thumb-label-showing]': 'thumbLabel',
                '[class.md-slider-vertical]': 'vertical',
            },
            template: "<div class=\"md-slider-track\"><div class=\"md-slider-track-fill\" [ngstyle]=\"trackFillStyles\"></div><div class=\"md-slider-ticks-container\" [ngstyle]=\"ticksContainerStyles\"><div class=\"md-slider-ticks\" [ngstyle]=\"ticksStyles\"></div></div><div class=\"md-slider-thumb-container\" [ngstyle]=\"thumbContainerStyles\"><div class=\"md-slider-thumb\"></div><div class=\"md-slider-thumb-label\"><span class=\"md-slider-thumb-label-text\">{{value}}</span></div></div></div>",
            styles: ["md-slider{display:inline-block;position:relative;box-sizing:border-box;padding:8px;outline:0;vertical-align:middle}.md-slider-track{position:absolute}.md-slider-track-fill{position:absolute;transform-origin:0 0;transition:transform .4s cubic-bezier(.25,.8,.25,1)}.md-slider-ticks-container{position:absolute;left:0;top:0;overflow:hidden}.md-slider-ticks{opacity:0;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.md-slider-thumb,.md-slider-thumb-container{transition:transform .4s cubic-bezier(.25,.8,.25,1);position:absolute}.md-slider-thumb-container{z-index:1}.md-slider-thumb{right:-10px;bottom:-10px;width:20px;height:20px;border-radius:50%;transform:scale(.7)}.md-slider-thumb-label{display:none;align-items:center;justify-content:center;position:absolute;width:28px;height:28px;border-radius:50%;transition:.3s cubic-bezier(.35,0,.25,1);transition-property:transform,border-radius}.md-slider-thumb-label-text{z-index:1;font-size:12px;font-weight:700;opacity:0;transition:opacity .3s cubic-bezier(.35,0,.25,1)}.md-slider-sliding .md-slider-thumb-container,.md-slider-sliding .md-slider-track-fill{transition-duration:0s}.md-slider-has-ticks .md-slider-track::after{content:'';position:absolute;border:0 solid rgba(0,0,0,.6);opacity:0;transition:opacity .3s cubic-bezier(.35,0,.25,1)}.md-slider-active .md-slider-thumb-label-text,.md-slider-has-ticks.md-slider-active .md-slider-ticks,.md-slider-has-ticks.md-slider-active .md-slider-track::after,.md-slider-has-ticks:hover .md-slider-ticks,.md-slider-has-ticks:hover .md-slider-track::after{opacity:1}.md-slider-thumb-label-showing .md-slider-thumb-label{display:flex}.md-slider-axis-inverted .md-slider-track-fill{transform-origin:100% 100%}.md-slider-active .md-slider-thumb{transform:scale(1)}.md-slider-active.md-slider-thumb-label-showing .md-slider-thumb{transform:scale(0)}.md-slider-active .md-slider-thumb-label{border-radius:50% 50% 0}.md-slider-horizontal{height:48px;min-width:128px}.md-slider-horizontal .md-slider-track{height:2px;top:23px;left:8px;right:8px}.md-slider-horizontal .md-slider-track::after{height:2px;border-left-width:2px;right:0}.md-slider-horizontal .md-slider-track-fill{height:2px;width:100%;transform:scaleX(0)}.md-slider-horizontal .md-slider-ticks-container{height:2px;width:100%}.md-slider-horizontal .md-slider-ticks{background:repeating-linear-gradient(to right,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);background:-moz-repeating-linear-gradient(.0001deg,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);height:2px;width:100%}.md-slider-horizontal .md-slider-thumb-container{width:100%;height:0;top:50%}.md-slider-horizontal .md-slider-thumb-label{right:-14px;top:-40px;transform:translateY(26px) scale(.4) rotate(45deg)}.md-slider-horizontal .md-slider-thumb-label-text{transform:rotate(-45deg)}.md-slider-horizontal.md-slider-active .md-slider-thumb-label{transform:rotate(45deg)}.md-slider-vertical{width:48px;min-height:128px}.md-slider-vertical .md-slider-track{width:2px;top:8px;bottom:8px;left:23px}.md-slider-vertical .md-slider-track::after{width:2px;border-top-width:2px;bottom:0}.md-slider-vertical .md-slider-track-fill{height:100%;width:2px;transform:scaleY(0)}.md-slider-vertical .md-slider-ticks-container{width:2px;height:100%}.md-slider-vertical .md-slider-ticks{background:repeating-linear-gradient(to bottom,rgba(0,0,0,.6),rgba(0,0,0,.6) 2px,transparent 0,transparent);width:2px;height:100%}.md-slider-vertical .md-slider-thumb-container{height:100%;width:0;left:50%}.md-slider-vertical .md-slider-thumb-label{bottom:-14px;left:-40px;transform:translateX(26px) scale(.4) rotate(-45deg)}.md-slider-vertical .md-slider-thumb-label-text{transform:rotate(45deg)}.md-slider-vertical.md-slider-active .md-slider-thumb-label{transform:rotate(-45deg)}[dir=rtl] .md-slider-track::after{left:0;right:auto}[dir=rtl] .md-slider-horizontal .md-slider-track-fill{transform-origin:100% 100%}[dir=rtl] .md-slider-horizontal.md-slider-axis-inverted .md-slider-track-fill{transform-origin:0 0}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
        }),
        __param$6(0, _angular_core.Optional()), 
        __metadata$29('design:paramtypes', [Dir, _angular_core.ElementRef])
    ], MdSlider);
    return MdSlider;
}());
/**
 * Renderer class in order to keep all dom manipulation in one place and outside of the main class.
 * @docs-private
 */
var SliderRenderer = (function () {
    function SliderRenderer(elementRef) {
        this._sliderElement = elementRef.nativeElement;
    }
    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    SliderRenderer.prototype.getSliderDimensions = function () {
        var trackElement = this._sliderElement.querySelector('.md-slider-track');
        return trackElement.getBoundingClientRect();
    };
    /**
     * Focuses the native element.
     * Currently only used to allow a blur event to fire but will be used with keyboard input later.
     */
    SliderRenderer.prototype.addFocus = function () {
        this._sliderElement.focus();
    };
    return SliderRenderer;
}());
var MdSliderModule = (function () {
    function MdSliderModule() {
    }
    MdSliderModule.forRoot = function () {
        return {
            ngModule: MdSliderModule,
            providers: [{ provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig }]
        };
    };
    MdSliderModule = __decorate$29([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, _angular_forms.FormsModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSlider, DefaultStyleCompatibilityModeModule],
            declarations: [MdSlider],
            providers: [
                { provide: _angular_platformBrowser.HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig },
            ],
        }), 
        __metadata$29('design:paramtypes', [])
    ], MdSliderModule);
    return MdSliderModule;
}());

var __extends$7 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$30 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$30 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$7 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/** Exception thrown when two MdSidenav are matching the same side. */
var MdDuplicatedSidenavError = (function (_super) {
    __extends$7(MdDuplicatedSidenavError, _super);
    function MdDuplicatedSidenavError(align) {
        _super.call(this, "A sidenav was already declared for 'align=\"" + align + "\"'");
    }
    return MdDuplicatedSidenavError;
}(MdError));
/** Sidenav toggle promise result. */
var MdSidenavToggleResult = (function () {
    function MdSidenavToggleResult(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
    return MdSidenavToggleResult;
}());
/**
 * <md-sidenav> component.
 *
 * This component corresponds to the drawer of the sidenav.
 *
 * Please refer to README.md for examples on how to use it.
 */
var MdSidenav = (function () {
    /**
     * @param _elementRef The DOM element reference. Used for transition and width calculation.
     *     If not available we do not hook on transitions.
     */
    function MdSidenav(_elementRef, _renderer) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** Alignment of the sidenav (direction neutral); whether 'start' or 'end'. */
        this._align = 'start';
        this._valid = true;
        /** Mode of the sidenav; whether 'over' or 'side'. */
        this.mode = 'over';
        /** Whether the sidenav is opened. */
        this._opened = false;
        /** Event emitted when the sidenav is being opened. Use this to synchronize animations. */
        this.onOpenStart = new _angular_core.EventEmitter();
        /** Event emitted when the sidenav is fully opened. */
        this.onOpen = new _angular_core.EventEmitter();
        /** Event emitted when the sidenav is being closed. Use this to synchronize animations. */
        this.onCloseStart = new _angular_core.EventEmitter();
        /** Event emitted when the sidenav is fully closed. */
        this.onClose = new _angular_core.EventEmitter();
        /** Event emitted when the sidenav alignment changes. */
        this.onAlignChanged = new _angular_core.EventEmitter();
        /** The current toggle animation promise. `null` if no animation is in progress. */
        this._toggleAnimationPromise = null;
        /**
         * The current toggle animation promise resolution function.
         * `null` if no animation is in progress.
         */
        this._resolveToggleAnimationPromise = null;
        this._elementFocusedBeforeSidenavWasOpened = null;
        this.onOpen.subscribe(function () {
            _this._elementFocusedBeforeSidenavWasOpened = document.activeElement;
            if (!_this.isFocusTrapDisabled) {
                _this._focusTrap.focusFirstTabbableElementWhenReady();
            }
        });
        this.onClose.subscribe(function () {
            if (_this._elementFocusedBeforeSidenavWasOpened instanceof HTMLElement) {
                _this._renderer.invokeElementMethod(_this._elementFocusedBeforeSidenavWasOpened, 'focus');
            }
            else {
                _this._renderer.invokeElementMethod(_this._elementRef.nativeElement, 'blur');
            }
            _this._elementFocusedBeforeSidenavWasOpened = null;
        });
    }
    Object.defineProperty(MdSidenav.prototype, "valid", {
        /** Whether this md-sidenav is part of a valid md-sidenav-container configuration. */
        get: function () {
            return this._valid;
        },
        set: function (value) {
            value = coerceBooleanProperty(value);
            // When the drawers are not in a valid configuration we close them all until they are in a valid
            // configuration again.
            if (!value) {
                this.close();
            }
            this._valid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "align", {
        get: function () {
            return this._align;
        },
        set: function (value) {
            // Make sure we have a valid value.
            value = (value == 'end') ? 'end' : 'start';
            if (value != this._align) {
                this._align = value;
                this.onAlignChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "isFocusTrapDisabled", {
        get: function () {
            // The focus trap is only enabled when the sidenav is open in any mode other than side.
            return !this.opened || this.mode == 'side';
        },
        enumerable: true,
        configurable: true
    });
    MdSidenav.prototype.ngAfterContentInit = function () {
        // This can happen when the sidenav is set to opened in the template and the transition
        // isn't ended.
        if (this._toggleAnimationPromise) {
            this._resolveToggleAnimationPromise(true);
            this._toggleAnimationPromise = this._resolveToggleAnimationPromise = null;
        }
    };
    Object.defineProperty(MdSidenav.prototype, "opened", {
        /**
         * Whether the sidenav is opened. We overload this because we trigger an event when it
         * starts or end.
         */
        get: function () { return this._opened; },
        set: function (v) {
            this.toggle(coerceBooleanProperty(v));
        },
        enumerable: true,
        configurable: true
    });
    /** Open this sidenav, and return a Promise that will resolve when it's fully opened (or get
     * rejected if it didn't). */
    MdSidenav.prototype.open = function () {
        return this.toggle(true);
    };
    /**
     * Close this sidenav, and return a Promise that will resolve when it's fully closed (or get
     * rejected if it didn't).
     */
    MdSidenav.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this sidenav. This is equivalent to calling open() when it's already opened, or
     * close() when it's closed.
     * @param isOpen
     */
    MdSidenav.prototype.toggle = function (isOpen) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        if (!this.valid) {
            return Promise.resolve(new MdSidenavToggleResult(isOpen ? 'open' : 'close', true));
        }
        // Shortcut it if we're already opened.
        if (isOpen === this.opened) {
            return this._toggleAnimationPromise ||
                Promise.resolve(new MdSidenavToggleResult(isOpen ? 'open' : 'close', true));
        }
        this._opened = isOpen;
        if (isOpen) {
            this.onOpenStart.emit();
        }
        else {
            this.onCloseStart.emit();
        }
        if (this._toggleAnimationPromise) {
            this._resolveToggleAnimationPromise(false);
        }
        this._toggleAnimationPromise = new Promise(function (resolve) {
            _this._resolveToggleAnimationPromise = function (animationFinished) {
                return resolve(new MdSidenavToggleResult(isOpen ? 'open' : 'close', animationFinished));
            };
        });
        return this._toggleAnimationPromise;
    };
    /**
     * Handles the keyboard events.
     */
    MdSidenav.prototype.handleKeydown = function (event) {
        if (event.keyCode === ESCAPE) {
            this.close();
            event.stopPropagation();
        }
    };
    /**
     * When transition has finished, set the internal state for classes and emit the proper event.
     * The event passed is actually of type TransitionEvent, but that type is not available in
     * Android so we use any.
     */
    MdSidenav.prototype._onTransitionEnd = function (transitionEvent) {
        if (transitionEvent.target == this._elementRef.nativeElement
            && transitionEvent.propertyName.endsWith('transform')) {
            if (this._opened) {
                this.onOpen.emit();
            }
            else {
                this.onClose.emit();
            }
            if (this._toggleAnimationPromise) {
                this._resolveToggleAnimationPromise(true);
                this._toggleAnimationPromise = this._resolveToggleAnimationPromise = null;
            }
        }
    };
    Object.defineProperty(MdSidenav.prototype, "_isClosing", {
        get: function () {
            return !this._opened && !!this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpening", {
        get: function () {
            return this._opened && !!this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isClosed", {
        get: function () {
            return !this._opened && !this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isOpened", {
        get: function () {
            return this._opened && !this._toggleAnimationPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_isEnd", {
        get: function () {
            return this.align == 'end';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeSide", {
        get: function () {
            return this.mode == 'side';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modeOver", {
        get: function () {
            return this.mode == 'over';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_modePush", {
        get: function () {
            return this.mode == 'push';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenav.prototype, "_width", {
        get: function () {
            if (this._elementRef.nativeElement) {
                return this._elementRef.nativeElement.offsetWidth;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    __decorate$30([
        _angular_core.ViewChild(FocusTrap), 
        __metadata$30('design:type', FocusTrap)
    ], MdSidenav.prototype, "_focusTrap", void 0);
    __decorate$30([
        _angular_core.Input(), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "align", null);
    __decorate$30([
        _angular_core.Input(), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "mode", void 0);
    __decorate$30([
        _angular_core.Output('open-start'), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "onOpenStart", void 0);
    __decorate$30([
        _angular_core.Output('open'), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "onOpen", void 0);
    __decorate$30([
        _angular_core.Output('close-start'), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "onCloseStart", void 0);
    __decorate$30([
        _angular_core.Output('close'), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "onClose", void 0);
    __decorate$30([
        _angular_core.Output('align-changed'), 
        __metadata$30('design:type', Object)
    ], MdSidenav.prototype, "onAlignChanged", void 0);
    __decorate$30([
        _angular_core.Input(), 
        __metadata$30('design:type', Boolean)
    ], MdSidenav.prototype, "opened", null);
    MdSidenav = __decorate$30([
        _angular_core.Component({selector: 'md-sidenav, mat-sidenav',
            // TODO(mmalerba): move template to separate file.
            template: "<focus-trap class=\"md-sidenav-focus-trap\" [disabled]=\"isFocusTrapDisabled\"><ng-content></ng-content></focus-trap>",
            host: {
                '(transitionend)': '_onTransitionEnd($event)',
                '(keydown)': 'handleKeydown($event)',
                // must prevent the browser from aligning text based on value
                '[attr.align]': 'null',
                '[class.md-sidenav-closed]': '_isClosed',
                '[class.md-sidenav-closing]': '_isClosing',
                '[class.md-sidenav-end]': '_isEnd',
                '[class.md-sidenav-opened]': '_isOpened',
                '[class.md-sidenav-opening]': '_isOpening',
                '[class.md-sidenav-over]': '_modeOver',
                '[class.md-sidenav-push]': '_modePush',
                '[class.md-sidenav-side]': '_modeSide',
                '[class.md-sidenav-invalid]': '!valid',
                'tabIndex': '-1'
            },
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$30('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdSidenav);
    return MdSidenav;
}());
/**
 * <md-sidenav-container> component.
 *
 * This is the parent component to one or two <md-sidenav>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MdSidenavContainer = (function () {
    function MdSidenavContainer(_dir, _element, _renderer) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        /** Event emitted when the sidenav backdrop is clicked. */
        this.onBackdropClicked = new _angular_core.EventEmitter();
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.dirChange.subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MdSidenavContainer.prototype, "start", {
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdSidenavContainer.prototype, "end", {
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    MdSidenavContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        // On changes, assert on consistency.
        this._sidenavs.changes.subscribe(function () { return _this._validateDrawers(); });
        this._sidenavs.forEach(function (sidenav) {
            _this._watchSidenavToggle(sidenav);
            _this._watchSidenavAlign(sidenav);
        });
        this._validateDrawers();
    };
    /**
     * Subscribes to sidenav events in order to set a class on the main container element when the
     * sidenav is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     */
    MdSidenavContainer.prototype._watchSidenavToggle = function (sidenav) {
        var _this = this;
        if (!sidenav || sidenav.mode === 'side') {
            return;
        }
        sidenav.onOpen.subscribe(function () { return _this._setContainerClass(sidenav, true); });
        sidenav.onClose.subscribe(function () { return _this._setContainerClass(sidenav, false); });
    };
    /**
     * Subscribes to sidenav onAlignChanged event in order to re-validate drawers when the align
     * changes.
     */
    MdSidenavContainer.prototype._watchSidenavAlign = function (sidenav) {
        var _this = this;
        if (!sidenav) {
            return;
        }
        sidenav.onAlignChanged.subscribe(function () { return _this._validateDrawers(); });
    };
    /** Toggles the 'md-sidenav-opened' class on the main 'md-sidenav-container' element. */
    MdSidenavContainer.prototype._setContainerClass = function (sidenav, bool) {
        this._renderer.setElementClass(this._element.nativeElement, 'md-sidenav-opened', bool);
    };
    /** Sets the valid state of the drawers. */
    MdSidenavContainer.prototype._setDrawersValid = function (valid) {
        this._sidenavs.forEach(function (sidenav) {
            sidenav.valid = valid;
        });
        if (!valid) {
            this._start = this._end = this._left = this._right = null;
        }
    };
    /** Validate the state of the sidenav children components. */
    MdSidenavContainer.prototype._validateDrawers = function () {
        this._start = this._end = null;
        // Ensure that we have at most one start and one end sidenav.
        // NOTE: We must call toArray on _sidenavs even though it's iterable
        // (see https://github.com/Microsoft/TypeScript/issues/3164).
        for (var _i = 0, _a = this._sidenavs.toArray(); _i < _a.length; _i++) {
            var sidenav = _a[_i];
            if (sidenav.align == 'end') {
                if (this._end != null) {
                    this._setDrawersValid(false);
                    return;
                }
                this._end = sidenav;
            }
            else {
                if (this._start != null) {
                    this._setDrawersValid(false);
                    return;
                }
                this._start = sidenav;
            }
        }
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
        this._setDrawersValid(true);
    };
    MdSidenavContainer.prototype._onBackdropClicked = function () {
        this.onBackdropClicked.emit();
        this._closeModalSidenav();
    };
    MdSidenavContainer.prototype._closeModalSidenav = function () {
        if (this._start != null && this._start.mode != 'side') {
            this._start.close();
        }
        if (this._end != null && this._end.mode != 'side') {
            this._end.close();
        }
    };
    MdSidenavContainer.prototype._isShowingBackdrop = function () {
        return (this._isSidenavOpen(this._start) && this._start.mode != 'side')
            || (this._isSidenavOpen(this._end) && this._end.mode != 'side');
    };
    MdSidenavContainer.prototype._isSidenavOpen = function (side) {
        return side != null && side.opened;
    };
    /**
     * Return the width of the sidenav, if it's in the proper mode and opened.
     * This may relayout the view, so do not call this often.
     * @param sidenav
     * @param mode
     */
    MdSidenavContainer.prototype._getSidenavEffectiveWidth = function (sidenav, mode) {
        return (this._isSidenavOpen(sidenav) && sidenav.mode == mode) ? sidenav._width : 0;
    };
    MdSidenavContainer.prototype._getMarginLeft = function () {
        return this._getSidenavEffectiveWidth(this._left, 'side');
    };
    MdSidenavContainer.prototype._getMarginRight = function () {
        return this._getSidenavEffectiveWidth(this._right, 'side');
    };
    MdSidenavContainer.prototype._getPositionLeft = function () {
        return this._getSidenavEffectiveWidth(this._left, 'push');
    };
    MdSidenavContainer.prototype._getPositionRight = function () {
        return this._getSidenavEffectiveWidth(this._right, 'push');
    };
    /**
     * Returns the horizontal offset for the content area.  There should never be a value for both
     * left and right, so by subtracting the right value from the left value, we should always get
     * the appropriate offset.
     */
    MdSidenavContainer.prototype._getPositionOffset = function () {
        return this._getPositionLeft() - this._getPositionRight();
    };
    /**
     * This is using [ngStyle] rather than separate [style...] properties because [style.transform]
     * doesn't seem to work right now.
     */
    MdSidenavContainer.prototype._getStyles = function () {
        return {
            marginLeft: this._getMarginLeft() + "px",
            marginRight: this._getMarginRight() + "px",
            transform: "translate3d(" + this._getPositionOffset() + "px, 0, 0)"
        };
    };
    __decorate$30([
        _angular_core.ContentChildren(MdSidenav), 
        __metadata$30('design:type', _angular_core.QueryList)
    ], MdSidenavContainer.prototype, "_sidenavs", void 0);
    __decorate$30([
        _angular_core.Output('backdrop-clicked'), 
        __metadata$30('design:type', Object)
    ], MdSidenavContainer.prototype, "onBackdropClicked", void 0);
    MdSidenavContainer = __decorate$30([
        _angular_core.Component({selector: 'md-sidenav-container, mat-sidenav-container, md-sidenav-layout, mat-sidenav-layout',
            // Do not use ChangeDetectionStrategy.OnPush. It does not work for this component because
            // technically it is a sibling of MdSidenav (on the content tree) and isn't updated when MdSidenav
            // changes its state.
            template: "<div class=\"md-sidenav-backdrop\" (click)=\"_onBackdropClicked()\" [class.md-sidenav-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"md-sidenav, mat-sidenav\"></ng-content><div class=\"md-sidenav-content\" [ngstyle]=\"_getStyles()\"><ng-content></ng-content></div>",
            styles: [".md-sidenav-container,.md-sidenav-content{transform:translate3d(0,0,0);display:block}.md-sidenav-container{position:relative;box-sizing:border-box;-webkit-overflow-scrolling:touch;overflow:hidden}.md-sidenav-backdrop,.md-sidenav-container[fullscreen]{position:absolute;top:0;bottom:0;right:0;left:0}.md-sidenav-container[fullscreen].md-sidenav-opened{overflow:hidden}.md-sidenav-backdrop{display:block;z-index:2;visibility:hidden}.md-sidenav-backdrop.md-sidenav-shown{visibility:visible}@media screen and (-ms-high-contrast:active){.md-sidenav-backdrop{opacity:.5}}.md-sidenav-content{position:relative;height:100%;overflow:auto}md-sidenav,md-sidenav.md-sidenav-closing{transform:translate3d(-100%,0,0)}md-sidenav{display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5%;outline:0}md-sidenav.md-sidenav-closed{visibility:hidden}md-sidenav.md-sidenav-opened,md-sidenav.md-sidenav-opening{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);transform:translate3d(0,0,0)}md-sidenav.md-sidenav-opening{visibility:visible}md-sidenav.md-sidenav-end,md-sidenav.md-sidenav-end.md-sidenav-closing{transform:translate3d(100%,0,0)}md-sidenav.md-sidenav-side{z-index:1}md-sidenav.md-sidenav-end{right:0}md-sidenav.md-sidenav-end.md-sidenav-closed{visibility:hidden}md-sidenav.md-sidenav-end.md-sidenav-opened,md-sidenav.md-sidenav-end.md-sidenav-opening{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);transform:translate3d(0,0,0)}md-sidenav.md-sidenav-end.md-sidenav-opening{visibility:visible}[dir=rtl] md-sidenav,[dir=rtl] md-sidenav.md-sidenav-closing{transform:translate3d(100%,0,0)}[dir=rtl] md-sidenav.md-sidenav-closed{visibility:hidden}[dir=rtl] md-sidenav.md-sidenav-opened,[dir=rtl] md-sidenav.md-sidenav-opening{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);transform:translate3d(0,0,0)}[dir=rtl] md-sidenav.md-sidenav-opening{visibility:visible}[dir=rtl] md-sidenav.md-sidenav-end{left:0;right:auto;transform:translate3d(-100%,0,0)}[dir=rtl] md-sidenav.md-sidenav-end.md-sidenav-closed{visibility:hidden}[dir=rtl] md-sidenav.md-sidenav-end.md-sidenav-closing{transform:translate3d(-100%,0,0)}[dir=rtl] md-sidenav.md-sidenav-end.md-sidenav-opened,[dir=rtl] md-sidenav.md-sidenav-end.md-sidenav-opening{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12);transform:translate3d(0,0,0)}[dir=rtl] md-sidenav.md-sidenav-end.md-sidenav-opening{visibility:visible}.md-sidenav-focus-trap{height:100%}.md-sidenav-focus-trap>.cdk-focus-trap-content{box-sizing:border-box;height:100%;overflow-y:auto}.md-sidenav-invalid{display:none}",
".md-sidenav-content,md-sidenav{transition:transform .4s cubic-bezier(.25,.8,.25,1)}.md-sidenav-backdrop.md-sidenav-shown{transition:background-color .4s cubic-bezier(.25,.8,.25,1)}"],
            host: {
                'class': 'md-sidenav-container',
            },
            encapsulation: _angular_core.ViewEncapsulation.None,
        }),
        __param$7(0, _angular_core.Optional()), 
        __metadata$30('design:paramtypes', [Dir, _angular_core.ElementRef, _angular_core.Renderer])
    ], MdSidenavContainer);
    return MdSidenavContainer;
}());
var MdSidenavModule = (function () {
    function MdSidenavModule() {
    }
    MdSidenavModule.forRoot = function () {
        return {
            ngModule: MdSidenavModule,
            providers: [A11Y_PROVIDERS]
        };
    };
    MdSidenavModule = __decorate$30([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, DefaultStyleCompatibilityModeModule, A11yModule],
            exports: [MdSidenavContainer, MdSidenav, DefaultStyleCompatibilityModeModule],
            declarations: [MdSidenavContainer, MdSidenav],
        }), 
        __metadata$30('design:paramtypes', [])
    ], MdSidenavModule);
    return MdSidenavModule;
}());

var __decorate$31 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$31 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdListDivider = (function () {
    function MdListDivider() {
    }
    MdListDivider = __decorate$31([
        _angular_core.Directive({
            selector: 'md-divider, mat-divider'
        }), 
        __metadata$31('design:paramtypes', [])
    ], MdListDivider);
    return MdListDivider;
}());
var MdList = (function () {
    function MdList() {
    }
    MdList = __decorate$31([
        _angular_core.Component({selector: 'md-list, mat-list, md-nav-list, mat-nav-list',
            host: { 'role': 'list' },
            template: '<ng-content></ng-content>',
            styles: ["md-list,md-nav-list{padding-top:8px;display:block}md-list [md-subheader],md-nav-list [md-subheader]{display:block;box-sizing:border-box;height:48px;padding:16px;margin:0;font-size:14px;font-weight:500}md-list [md-subheader]:first-child,md-nav-list [md-subheader]:first-child{margin-top:-8px}md-list a[md-list-item],md-list md-list-item,md-nav-list a[md-list-item],md-nav-list md-list-item{display:block}md-list a[md-list-item] .md-list-item,md-list md-list-item .md-list-item,md-nav-list a[md-list-item] .md-list-item,md-nav-list md-list-item .md-list-item{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:16px;height:48px;padding:0 16px}md-list a[md-list-item].md-list-avatar .md-list-item,md-list md-list-item.md-list-avatar .md-list-item,md-nav-list a[md-list-item].md-list-avatar .md-list-item,md-nav-list md-list-item.md-list-avatar .md-list-item{height:56px}md-list a[md-list-item].md-2-line .md-list-item,md-list md-list-item.md-2-line .md-list-item,md-nav-list a[md-list-item].md-2-line .md-list-item,md-nav-list md-list-item.md-2-line .md-list-item{height:72px}md-list a[md-list-item].md-3-line .md-list-item,md-list md-list-item.md-3-line .md-list-item,md-nav-list a[md-list-item].md-3-line .md-list-item,md-nav-list md-list-item.md-3-line .md-list-item{height:88px}md-list a[md-list-item].md-multi-line .md-list-item,md-list md-list-item.md-multi-line .md-list-item,md-nav-list a[md-list-item].md-multi-line .md-list-item,md-nav-list md-list-item.md-multi-line .md-list-item{height:100%;padding:8px 16px}md-list a[md-list-item] .md-list-text,md-list md-list-item .md-list-text,md-nav-list a[md-list-item] .md-list-text,md-nav-list md-list-item .md-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}md-list a[md-list-item] .md-list-text>*,md-list md-list-item .md-list-text>*,md-nav-list a[md-list-item] .md-list-text>*,md-nav-list md-list-item .md-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-list a[md-list-item] .md-list-text:empty,md-list md-list-item .md-list-text:empty,md-nav-list a[md-list-item] .md-list-text:empty,md-nav-list md-list-item .md-list-text:empty{display:none}md-list a[md-list-item] .md-list-text:first-child,md-list md-list-item .md-list-text:first-child,md-nav-list a[md-list-item] .md-list-text:first-child,md-nav-list md-list-item .md-list-text:first-child{padding:0}md-list a[md-list-item] [md-list-avatar],md-list md-list-item [md-list-avatar],md-nav-list a[md-list-item] [md-list-avatar],md-nav-list md-list-item [md-list-avatar]{flex-shrink:0;width:40px;height:40px;border-radius:50%}md-list a[md-list-item] [md-list-icon],md-list md-list-item [md-list-icon],md-nav-list a[md-list-item] [md-list-icon],md-nav-list md-list-item [md-list-icon]{width:24px;height:24px;border-radius:50%;padding:4px}md-list a[md-list-item] [md-line],md-list md-list-item [md-line],md-nav-list a[md-list-item] [md-line],md-nav-list md-list-item [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-list a[md-list-item] [md-line]:nth-child(n+2),md-list md-list-item [md-line]:nth-child(n+2),md-nav-list a[md-list-item] [md-line]:nth-child(n+2),md-nav-list md-list-item [md-line]:nth-child(n+2){font-size:14px}md-list[dense],md-nav-list[dense]{padding-top:4px;display:block}md-list[dense] [md-subheader],md-nav-list[dense] [md-subheader]{display:block;box-sizing:border-box;height:40px;padding:16px;margin:0;font-size:13px;font-weight:500}md-list[dense] [md-subheader]:first-child,md-nav-list[dense] [md-subheader]:first-child{margin-top:-4px}md-list[dense] a[md-list-item],md-list[dense] md-list-item,md-nav-list[dense] a[md-list-item],md-nav-list[dense] md-list-item{display:block}md-list[dense] a[md-list-item] .md-list-item,md-list[dense] md-list-item .md-list-item,md-nav-list[dense] a[md-list-item] .md-list-item,md-nav-list[dense] md-list-item .md-list-item{display:flex;flex-direction:row;align-items:center;font-family:Roboto,\"Helvetica Neue\",sans-serif;box-sizing:border-box;font-size:13px;height:40px;padding:0 16px}md-list[dense] a[md-list-item].md-list-avatar .md-list-item,md-list[dense] md-list-item.md-list-avatar .md-list-item,md-nav-list[dense] a[md-list-item].md-list-avatar .md-list-item,md-nav-list[dense] md-list-item.md-list-avatar .md-list-item{height:48px}md-list[dense] a[md-list-item].md-2-line .md-list-item,md-list[dense] md-list-item.md-2-line .md-list-item,md-nav-list[dense] a[md-list-item].md-2-line .md-list-item,md-nav-list[dense] md-list-item.md-2-line .md-list-item{height:60px}md-list[dense] a[md-list-item].md-3-line .md-list-item,md-list[dense] md-list-item.md-3-line .md-list-item,md-nav-list[dense] a[md-list-item].md-3-line .md-list-item,md-nav-list[dense] md-list-item.md-3-line .md-list-item{height:76px}md-list[dense] a[md-list-item].md-multi-line .md-list-item,md-list[dense] md-list-item.md-multi-line .md-list-item,md-nav-list[dense] a[md-list-item].md-multi-line .md-list-item,md-nav-list[dense] md-list-item.md-multi-line .md-list-item{height:100%;padding:8px 16px}md-list[dense] a[md-list-item] .md-list-text,md-list[dense] md-list-item .md-list-text,md-nav-list[dense] a[md-list-item] .md-list-text,md-nav-list[dense] md-list-item .md-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden;padding:0 16px}md-list[dense] a[md-list-item] .md-list-text>*,md-list[dense] md-list-item .md-list-text>*,md-nav-list[dense] a[md-list-item] .md-list-text>*,md-nav-list[dense] md-list-item .md-list-text>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-list[dense] a[md-list-item] .md-list-text:empty,md-list[dense] md-list-item .md-list-text:empty,md-nav-list[dense] a[md-list-item] .md-list-text:empty,md-nav-list[dense] md-list-item .md-list-text:empty{display:none}md-list[dense] a[md-list-item] .md-list-text:first-child,md-list[dense] md-list-item .md-list-text:first-child,md-nav-list[dense] a[md-list-item] .md-list-text:first-child,md-nav-list[dense] md-list-item .md-list-text:first-child{padding:0}md-list[dense] a[md-list-item] [md-list-avatar],md-list[dense] md-list-item [md-list-avatar],md-nav-list[dense] a[md-list-item] [md-list-avatar],md-nav-list[dense] md-list-item [md-list-avatar]{flex-shrink:0;width:40px;height:40px;border-radius:50%}md-list[dense] a[md-list-item] [md-list-icon],md-list[dense] md-list-item [md-list-icon],md-nav-list[dense] a[md-list-item] [md-list-icon],md-nav-list[dense] md-list-item [md-list-icon]{width:24px;height:24px;border-radius:50%;padding:4px}md-list[dense] a[md-list-item] [md-line],md-list[dense] md-list-item [md-line],md-nav-list[dense] a[md-list-item] [md-line],md-nav-list[dense] md-list-item [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-list[dense] a[md-list-item] [md-line]:nth-child(n+2),md-list[dense] md-list-item [md-line]:nth-child(n+2),md-nav-list[dense] a[md-list-item] [md-line]:nth-child(n+2),md-nav-list[dense] md-list-item [md-line]:nth-child(n+2){font-size:13px}md-divider{display:block;border-top-style:solid;border-top-width:1px;margin:0}md-nav-list a{text-decoration:none;color:inherit}md-nav-list .md-list-item{cursor:pointer}md-nav-list .md-list-item.md-list-item-focus,md-nav-list .md-list-item:hover{outline:0}"],
            encapsulation: _angular_core.ViewEncapsulation.None
        }), 
        __metadata$31('design:paramtypes', [])
    ], MdList);
    return MdList;
}());
/* Need directive for a ContentChild query in list-item */
var MdListAvatar = (function () {
    function MdListAvatar() {
    }
    MdListAvatar = __decorate$31([
        _angular_core.Directive({ selector: '[md-list-avatar], [mat-list-avatar]' }), 
        __metadata$31('design:paramtypes', [])
    ], MdListAvatar);
    return MdListAvatar;
}());
var MdListItem = (function () {
    function MdListItem(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._hasFocus = false;
    }
    Object.defineProperty(MdListItem.prototype, "_hasAvatar", {
        set: function (avatar) {
            this._renderer.setElementClass(this._element.nativeElement, 'md-list-avatar', avatar != null);
        },
        enumerable: true,
        configurable: true
    });
    MdListItem.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    MdListItem.prototype._handleFocus = function () {
        this._hasFocus = true;
    };
    MdListItem.prototype._handleBlur = function () {
        this._hasFocus = false;
    };
    __decorate$31([
        _angular_core.ContentChildren(MdLine), 
        __metadata$31('design:type', _angular_core.QueryList)
    ], MdListItem.prototype, "_lines", void 0);
    __decorate$31([
        _angular_core.ContentChild(MdListAvatar), 
        __metadata$31('design:type', MdListAvatar), 
        __metadata$31('design:paramtypes', [MdListAvatar])
    ], MdListItem.prototype, "_hasAvatar", null);
    MdListItem = __decorate$31([
        _angular_core.Component({selector: 'md-list-item, mat-list-item, a[md-list-item], a[mat-list-item]',
            host: {
                'role': 'listitem',
                '(focus)': '_handleFocus()',
                '(blur)': '_handleBlur()',
            },
            template: "<div class=\"md-list-item\" [class.md-list-item-focus]=\"_hasFocus\"><ng-content select=\"[md-list-avatar],[md-list-icon], [mat-list-avatar], [mat-list-icon]\"></ng-content><div class=\"md-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content></div>",
            encapsulation: _angular_core.ViewEncapsulation.None
        }), 
        __metadata$31('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdListItem);
    return MdListItem;
}());
var MdListModule = (function () {
    function MdListModule() {
    }
    MdListModule.forRoot = function () {
        return {
            ngModule: MdListModule,
            providers: []
        };
    };
    MdListModule = __decorate$31([
        _angular_core.NgModule({
            imports: [MdLineModule, DefaultStyleCompatibilityModeModule],
            exports: [
                MdList,
                MdListItem,
                MdListDivider,
                MdListAvatar,
                MdLineModule,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [MdList, MdListItem, MdListDivider, MdListAvatar],
        }), 
        __metadata$31('design:paramtypes', [])
    ], MdListModule);
    return MdListModule;
}());

/**
 * Converts values into strings. Falsy values become empty strings.
 * @docs-private
 */
function coerceToString(value) {
    return "" + (value || '');
}
/**
 * Converts a value that might be a string into a number.
 * @docs-private
 */
function coerceToNumber(value) {
    return typeof value === 'string' ? parseInt(value, 10) : value;
}

var __decorate$33 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$33 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdGridTile = (function () {
    function MdGridTile(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        this._rowspan = 1;
        this._colspan = 1;
    }
    Object.defineProperty(MdGridTile.prototype, "rowspan", {
        get: function () {
            return this._rowspan;
        },
        set: function (value) {
            this._rowspan = coerceToNumber(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridTile.prototype, "colspan", {
        get: function () {
            return this._colspan;
        },
        set: function (value) {
            this._colspan = coerceToNumber(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    MdGridTile.prototype._setStyle = function (property, value) {
        this._renderer.setElementStyle(this._element.nativeElement, property, value);
    };
    __decorate$33([
        _angular_core.Input(), 
        __metadata$33('design:type', Object)
    ], MdGridTile.prototype, "rowspan", null);
    __decorate$33([
        _angular_core.Input(), 
        __metadata$33('design:type', Object)
    ], MdGridTile.prototype, "colspan", null);
    MdGridTile = __decorate$33([
        _angular_core.Component({selector: 'md-grid-tile, mat-grid-tile',
            host: { 'role': 'listitem' },
            template: "<figure><ng-content></ng-content></figure>",
            styles: ["md-grid-list{display:block;position:relative}md-grid-tile{display:block;position:absolute;overflow:hidden}md-grid-tile figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}md-grid-tile md-grid-tile-footer,md-grid-tile md-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;font-size:16px;position:absolute;left:0;right:0}md-grid-tile md-grid-tile-footer [md-line],md-grid-tile md-grid-tile-header [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-grid-tile md-grid-tile-footer [md-line]:nth-child(n+2),md-grid-tile md-grid-tile-header [md-line]:nth-child(n+2){font-size:12px}md-grid-tile .md-grid-list-text>*,md-grid-tile md-grid-tile-footer>*,md-grid-tile md-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-grid-tile md-grid-tile-footer.md-2-line,md-grid-tile md-grid-tile-header.md-2-line{height:68px}md-grid-tile .md-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}md-grid-tile .md-grid-list-text:empty,md-grid-tile [md-grid-avatar]:empty{display:none}md-grid-tile md-grid-tile-header{top:0}md-grid-tile md-grid-tile-footer{bottom:0}md-grid-tile [md-grid-avatar]{padding-right:16px}[dir=rtl] md-grid-tile [md-grid-avatar]{padding-right:0;padding-left:16px}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$33('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdGridTile);
    return MdGridTile;
}());
var MdGridTileText = (function () {
    function MdGridTileText(_renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
    }
    MdGridTileText.prototype.ngAfterContentInit = function () {
        this._lineSetter = new MdLineSetter(this._lines, this._renderer, this._element);
    };
    __decorate$33([
        _angular_core.ContentChildren(MdLine), 
        __metadata$33('design:type', _angular_core.QueryList)
    ], MdGridTileText.prototype, "_lines", void 0);
    MdGridTileText = __decorate$33([
        _angular_core.Component({selector: 'md-grid-tile-header, mat-grid-tile-header, md-grid-tile-footer, mat-grid-tile-footer',
            template: "<ng-content select=\"[md-grid-avatar], [mat-grid-avatar]\"></ng-content><div class=\"md-grid-list-text\"><ng-content select=\"[md-line], [mat-line]\"></ng-content></div><ng-content></ng-content>"
        }), 
        __metadata$33('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdGridTileText);
    return MdGridTileText;
}());

var __extends$8 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Exception thrown when cols property is missing from grid-list
 * @docs-private
 */
var MdGridListColsError = (function (_super) {
    __extends$8(MdGridListColsError, _super);
    function MdGridListColsError() {
        _super.call(this, "md-grid-list: must pass in number of columns. Example: <md-grid-list cols=\"3\">");
    }
    return MdGridListColsError;
}(MdError));
/**
 * Exception thrown when a tile's colspan is longer than the number of cols in list
 * @docs-private
 */
var MdGridTileTooWideError = (function (_super) {
    __extends$8(MdGridTileTooWideError, _super);
    function MdGridTileTooWideError(cols, listLength) {
        _super.call(this, "md-grid-list: tile with colspan " + cols + " is wider than grid with cols=\"" + listLength + "\".");
    }
    return MdGridTileTooWideError;
}(MdError));
/**
 * Exception thrown when an invalid ratio is passed in as a rowHeight
 * @docs-private
 */
var MdGridListBadRatioError = (function (_super) {
    __extends$8(MdGridListBadRatioError, _super);
    function MdGridListBadRatioError(value) {
        _super.call(this, "md-grid-list: invalid ratio given for row-height: \"" + value + "\"");
    }
    return MdGridListBadRatioError;
}(MdError));

/**
 * Class for determining, from a list of tiles, the (row, col) position of each of those tiles
 * in the grid. This is necessary (rather than just rendering the tiles in normal document flow)
 * because the tiles can have a rowspan.
 *
 * The positioning algorithm greedily places each tile as soon as it encounters a gap in the grid
 * large enough to accommodate it so that the tiles still render in the same order in which they
 * are given.
 *
 * The basis of the algorithm is the use of an array to track the already placed tiles. Each
 * element of the array corresponds to a column, and the value indicates how many cells in that
 * column are already occupied; zero indicates an empty cell. Moving "down" to the next row
 * decrements each value in the tracking array (indicating that the column is one cell closer to
 * being free).
 *
 * @docs-private
 */
var TileCoordinator = (function () {
    function TileCoordinator(numColumns, tiles) {
        var _this = this;
        /** Index at which the search for the next gap will start. */
        this.columnIndex = 0;
        /** The current row index. */
        this.rowIndex = 0;
        this.tracker = new Array(numColumns);
        this.tracker.fill(0, 0, this.tracker.length);
        this.positions = tiles.map(function (tile) { return _this._trackTile(tile); });
    }
    Object.defineProperty(TileCoordinator.prototype, "rowCount", {
        /** Gets the total number of rows occupied by tiles */
        get: function () { return this.rowIndex + 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileCoordinator.prototype, "rowspan", {
        /** Gets the total span of rows occupied by tiles.
         * Ex: A list with 1 row that contains a tile with rowspan 2 will have a total rowspan of 2. */
        get: function () {
            var lastRowMax = Math.max.apply(Math, this.tracker);
            // if any of the tiles has a rowspan that pushes it beyond the total row count,
            // add the difference to the rowcount
            return lastRowMax > 1 ? this.rowCount + lastRowMax - 1 : this.rowCount;
        },
        enumerable: true,
        configurable: true
    });
    /** Calculates the row and col position of a tile. */
    TileCoordinator.prototype._trackTile = function (tile) {
        // Find a gap large enough for this tile.
        var gapStartIndex = this._findMatchingGap(tile.colspan);
        // Place tile in the resulting gap.
        this._markTilePosition(gapStartIndex, tile);
        // The next time we look for a gap, the search will start at columnIndex, which should be
        // immediately after the tile that has just been placed.
        this.columnIndex = gapStartIndex + tile.colspan;
        return new TilePosition(this.rowIndex, gapStartIndex);
    };
    /** Finds the next available space large enough to fit the tile. */
    TileCoordinator.prototype._findMatchingGap = function (tileCols) {
        if (tileCols > this.tracker.length) {
            throw new MdGridTileTooWideError(tileCols, this.tracker.length);
        }
        // Start index is inclusive, end index is exclusive.
        var gapStartIndex = -1;
        var gapEndIndex = -1;
        // Look for a gap large enough to fit the given tile. Empty spaces are marked with a zero.
        do {
            // If we've reached the end of the row, go to the next row.
            if (this.columnIndex + tileCols > this.tracker.length) {
                this._nextRow();
                continue;
            }
            gapStartIndex = this.tracker.indexOf(0, this.columnIndex);
            // If there are no more empty spaces in this row at all, move on to the next row.
            if (gapStartIndex == -1) {
                this._nextRow();
                continue;
            }
            gapEndIndex = this._findGapEndIndex(gapStartIndex);
            // If a gap large enough isn't found, we want to start looking immediately after the current
            // gap on the next iteration.
            this.columnIndex = gapStartIndex + 1;
        } while (gapEndIndex - gapStartIndex < tileCols);
        return gapStartIndex;
    };
    /** Move "down" to the next row. */
    TileCoordinator.prototype._nextRow = function () {
        this.columnIndex = 0;
        this.rowIndex++;
        // Decrement all spaces by one to reflect moving down one row.
        for (var i = 0; i < this.tracker.length; i++) {
            this.tracker[i] = Math.max(0, this.tracker[i] - 1);
        }
    };
    /**
     * Finds the end index (exclusive) of a gap given the index from which to start looking.
     * The gap ends when a non-zero value is found.
     */
    TileCoordinator.prototype._findGapEndIndex = function (gapStartIndex) {
        for (var i = gapStartIndex + 1; i < this.tracker.length; i++) {
            if (this.tracker[i] != 0) {
                return i;
            }
        }
        // The gap ends with the end of the row.
        return this.tracker.length;
    };
    /** Update the tile tracker to account for the given tile in the given space. */
    TileCoordinator.prototype._markTilePosition = function (start, tile) {
        for (var i = 0; i < tile.colspan; i++) {
            this.tracker[start + i] = tile.rowspan;
        }
    };
    return TileCoordinator;
}());
/**
 * Simple data structure for tile position (row, col).
 * @docs-private
 */
var TilePosition = (function () {
    function TilePosition(row, col) {
        this.row = row;
        this.col = col;
    }
    return TilePosition;
}());

var __extends$9 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Sets the style properties for an individual tile, given the position calculated by the
 * Tile Coordinator.
 * @docs-private
 */
var TileStyler = (function () {
    function TileStyler() {
        this._rows = 0;
        this._rowspan = 0;
    }
    /**
     * Adds grid-list layout info once it is available. Cannot be processed in the constructor
     * because these properties haven't been calculated by that point.
     */
    TileStyler.prototype.init = function (_gutterSize, tracker, cols, direction) {
        this._gutterSize = normalizeUnits(_gutterSize);
        this._rows = tracker.rowCount;
        this._rowspan = tracker.rowspan;
        this._cols = cols;
        this._direction = direction;
    };
    /**
     * Computes the amount of space a single 1x1 tile would take up (width or height).
     * Used as a basis for other calculations.
     * @param sizePercent Percent of the total grid-list space that one 1x1 tile would take up.
     * @param gutterFraction Fraction of the gutter size taken up by one 1x1 tile.
     * @return The size of a 1x1 tile as an expression that can be evaluated via CSS calc().
     */
    TileStyler.prototype.getBaseTileSize = function (sizePercent, gutterFraction) {
        // Take the base size percent (as would be if evenly dividing the size between cells),
        // and then subtracting the size of one gutter. However, since there are no gutters on the
        // edges, each tile only uses a fraction (gutterShare = numGutters / numCells) of the gutter
        // size. (Imagine having one gutter per tile, and then breaking up the extra gutter on the
        // edge evenly among the cells).
        return "(" + sizePercent + "% - ( " + this._gutterSize + " * " + gutterFraction + " ))";
    };
    /**
     * Gets The horizontal or vertical position of a tile, e.g., the 'top' or 'left' property value.
     * @param offset Number of tiles that have already been rendered in the row/column.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @return Position of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTilePosition = function (baseSize, offset) {
        // The position comes the size of a 1x1 tile plus gutter for each previous tile in the
        // row/column (offset).
        return calc("(" + baseSize + " + " + this._gutterSize + ") * " + offset);
    };
    /**
     * Gets the actual size of a tile, e.g., width or height, taking rowspan or colspan into account.
     * @param baseSize Base size of a 1x1 tile (as computed in getBaseTileSize).
     * @param span The tile's rowspan or colspan.
     * @return Size of the tile as a CSS calc() expression.
     */
    TileStyler.prototype.getTileSize = function (baseSize, span) {
        return "(" + baseSize + " * " + span + ") + (" + (span - 1) + " * " + this._gutterSize + ")";
    };
    /** Gets the style properties to be applied to a tile for the given row and column index. */
    TileStyler.prototype.setStyle = function (tile, rowIndex, colIndex) {
        // Percent of the available horizontal space that one column takes up.
        var percentWidthPerTile = 100 / this._cols;
        // Fraction of the vertical gutter size that each column takes up.
        // For example, if there are 5 columns, each column uses 4/5 = 0.8 times the gutter width.
        var gutterWidthFractionPerTile = (this._cols - 1) / this._cols;
        this.setColStyles(tile, colIndex, percentWidthPerTile, gutterWidthFractionPerTile);
        this.setRowStyles(tile, rowIndex, percentWidthPerTile, gutterWidthFractionPerTile);
    };
    /** Sets the horizontal placement of the tile in the list. */
    TileStyler.prototype.setColStyles = function (tile, colIndex, percentWidth, gutterWidth) {
        // Base horizontal size of a column.
        var baseTileWidth = this.getBaseTileSize(percentWidth, gutterWidth);
        // The width and horizontal position of each tile is always calculated the same way, but the
        // height and vertical position depends on the rowMode.
        var side = this._direction === 'ltr' ? 'left' : 'right';
        tile._setStyle(side, this.getTilePosition(baseTileWidth, colIndex));
        tile._setStyle('width', calc(this.getTileSize(baseTileWidth, tile.colspan)));
    };
    /** Calculates the total size taken up by gutters across one axis of a list. */
    TileStyler.prototype.getGutterSpan = function () {
        return this._gutterSize + " * (" + this._rowspan + " - 1)";
    };
    /** Calculates the total size taken up by tiles across one axis of a list. */
    TileStyler.prototype.getTileSpan = function (tileHeight) {
        return this._rowspan + " * " + this.getTileSize(tileHeight, 1);
    };
    /**
     * Sets the vertical placement of the tile in the list.
     * This method will be implemented by each type of TileStyler.
     */
    TileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) { };
    /**
     * Calculates the computed height and returns the correct style property to set.
     * This method will be implemented by each type of TileStyler.
     */
    TileStyler.prototype.getComputedHeight = function () { return null; };
    return TileStyler;
}());
/**
 * This type of styler is instantiated when the user passes in a fixed row height.
 * Example <md-grid-list cols="3" rowHeight="100px">
 * @docs-private
 */
var FixedTileStyler = (function (_super) {
    __extends$9(FixedTileStyler, _super);
    function FixedTileStyler(fixedRowHeight) {
        _super.call(this);
        this.fixedRowHeight = fixedRowHeight;
    }
    FixedTileStyler.prototype.init = function (gutterSize, tracker, cols, direction) {
        _super.prototype.init.call(this, gutterSize, tracker, cols, direction);
        this.fixedRowHeight = normalizeUnits(this.fixedRowHeight);
    };
    FixedTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        tile._setStyle('top', this.getTilePosition(this.fixedRowHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(this.fixedRowHeight, tile.rowspan)));
    };
    FixedTileStyler.prototype.getComputedHeight = function () {
        return [
            'height', calc(this.getTileSpan(this.fixedRowHeight) + " + " + this.getGutterSpan())
        ];
    };
    return FixedTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user passes in a width:height ratio
 * for the row height.  Example <md-grid-list cols="3" rowHeight="3:1">
 * @docs-private
 */
var RatioTileStyler = (function (_super) {
    __extends$9(RatioTileStyler, _super);
    function RatioTileStyler(value) {
        _super.call(this);
        this._parseRatio(value);
    }
    RatioTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        var percentHeightPerTile = percentWidth / this.rowHeightRatio;
        this.baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterWidth);
        // Use paddingTop and marginTop to maintain the given aspect ratio, as
        // a percentage-based value for these properties is applied versus the *width* of the
        // containing block. See http://www.w3.org/TR/CSS2/box.html#margin-properties
        tile._setStyle('marginTop', this.getTilePosition(this.baseTileHeight, rowIndex));
        tile._setStyle('paddingTop', calc(this.getTileSize(this.baseTileHeight, tile.rowspan)));
    };
    RatioTileStyler.prototype.getComputedHeight = function () {
        return [
            'paddingBottom', calc(this.getTileSpan(this.baseTileHeight) + " + " + this.getGutterSpan())
        ];
    };
    RatioTileStyler.prototype._parseRatio = function (value) {
        var ratioParts = value.split(':');
        if (ratioParts.length !== 2) {
            throw new MdGridListBadRatioError(value);
        }
        this.rowHeightRatio = parseFloat(ratioParts[0]) / parseFloat(ratioParts[1]);
    };
    return RatioTileStyler;
}(TileStyler));
/**
 * This type of styler is instantiated when the user selects a "fit" row height mode.
 * In other words, the row height will reflect the total height of the container divided
 * by the number of rows.  Example <md-grid-list cols="3" rowHeight="fit">
 *
 * @docs-private
 */
var FitTileStyler = (function (_super) {
    __extends$9(FitTileStyler, _super);
    function FitTileStyler() {
        _super.apply(this, arguments);
    }
    FitTileStyler.prototype.setRowStyles = function (tile, rowIndex, percentWidth, gutterWidth) {
        // Percent of the available vertical space that one row takes up.
        var percentHeightPerTile = 100 / this._rowspan;
        // Fraction of the horizontal gutter size that each column takes up.
        var gutterHeightPerTile = (this._rows - 1) / this._rows;
        // Base vertical size of a column.
        var baseTileHeight = this.getBaseTileSize(percentHeightPerTile, gutterHeightPerTile);
        tile._setStyle('top', this.getTilePosition(baseTileHeight, rowIndex));
        tile._setStyle('height', calc(this.getTileSize(baseTileHeight, tile.rowspan)));
    };
    return FitTileStyler;
}(TileStyler));
/** Wraps a CSS string in a calc function */
function calc(exp) { return "calc(" + exp + ")"; }
/** Appends pixels to a CSS string if no units are given. */
function normalizeUnits(value) {
    return (value.match(/px|em|rem/)) ? value : value + 'px';
}

var __decorate$32 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$32 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$8 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MD_FIT_MODE = 'fit';
var MdGridList = (function () {
    function MdGridList(_renderer, _element, _dir) {
        this._renderer = _renderer;
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    Object.defineProperty(MdGridList.prototype, "cols", {
        get: function () { return this._cols; },
        set: function (value) { this._cols = coerceToNumber(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "gutterSize", {
        get: function () { return this._gutter; },
        set: function (value) { this._gutter = coerceToString(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdGridList.prototype, "rowHeight", {
        /** Set internal representation of row height from the user-provided value. */
        set: function (value) {
            this._rowHeight = coerceToString(value);
            this._setTileStyler();
        },
        enumerable: true,
        configurable: true
    });
    MdGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    MdGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /** Throw a friendly error if cols property is missing */
    MdGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw new MdGridListColsError();
        }
    };
    /** Default to equal width:height if rowHeight property is missing */
    MdGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._tileStyler = new RatioTileStyler('1:1');
        }
    };
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    MdGridList.prototype._setTileStyler = function () {
        if (this._rowHeight === MD_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (this._rowHeight && this._rowHeight.match(/:/g)) {
            this._tileStyler = new RatioTileStyler(this._rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(this._rowHeight);
        }
    };
    /** Computes and applies the size and position for all children grid tiles. */
    MdGridList.prototype._layoutTiles = function () {
        var tiles = this._tiles.toArray();
        var tracker = new TileCoordinator(this.cols, tiles);
        var direction = this._dir ? this._dir.value : 'ltr';
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        for (var i = 0; i < tiles.length; i++) {
            var pos = tracker.positions[i];
            var tile = tiles[i];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        }
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /** Sets style on the main grid-list element, given the style name and value. */
    MdGridList.prototype._setListStyle = function (style) {
        if (style) {
            this._renderer.setElementStyle(this._element.nativeElement, style[0], style[1]);
        }
    };
    __decorate$32([
        _angular_core.ContentChildren(MdGridTile), 
        __metadata$32('design:type', _angular_core.QueryList)
    ], MdGridList.prototype, "_tiles", void 0);
    __decorate$32([
        _angular_core.Input(), 
        __metadata$32('design:type', Object)
    ], MdGridList.prototype, "cols", null);
    __decorate$32([
        _angular_core.Input(), 
        __metadata$32('design:type', Object)
    ], MdGridList.prototype, "gutterSize", null);
    __decorate$32([
        _angular_core.Input(), 
        __metadata$32('design:type', Object), 
        __metadata$32('design:paramtypes', [Object])
    ], MdGridList.prototype, "rowHeight", null);
    MdGridList = __decorate$32([
        _angular_core.Component({selector: 'md-grid-list, mat-grid-list',
            template: "<div class=\"md-grid-list\"><ng-content></ng-content></div>",
            styles: ["md-grid-list{display:block;position:relative}md-grid-tile{display:block;position:absolute;overflow:hidden}md-grid-tile figure{display:flex;position:absolute;align-items:center;justify-content:center;height:100%;top:0;right:0;bottom:0;left:0;padding:0;margin:0}md-grid-tile md-grid-tile-footer,md-grid-tile md-grid-tile-header{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;font-size:16px;position:absolute;left:0;right:0}md-grid-tile md-grid-tile-footer [md-line],md-grid-tile md-grid-tile-header [md-line]{white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}md-grid-tile md-grid-tile-footer [md-line]:nth-child(n+2),md-grid-tile md-grid-tile-header [md-line]:nth-child(n+2){font-size:12px}md-grid-tile .md-grid-list-text>*,md-grid-tile md-grid-tile-footer>*,md-grid-tile md-grid-tile-header>*{margin:0;padding:0;font-weight:400;font-size:inherit}md-grid-tile md-grid-tile-footer.md-2-line,md-grid-tile md-grid-tile-header.md-2-line{height:68px}md-grid-tile .md-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}md-grid-tile .md-grid-list-text:empty,md-grid-tile [md-grid-avatar]:empty{display:none}md-grid-tile md-grid-tile-header{top:0}md-grid-tile md-grid-tile-footer{bottom:0}md-grid-tile [md-grid-avatar]{padding-right:16px}[dir=rtl] md-grid-tile [md-grid-avatar]{padding-right:0;padding-left:16px}"],
            host: {
                'role': 'list'
            },
            encapsulation: _angular_core.ViewEncapsulation.None,
        }),
        __param$8(2, _angular_core.Optional()), 
        __metadata$32('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef, Dir])
    ], MdGridList);
    return MdGridList;
}());
var MdGridListModule = (function () {
    function MdGridListModule() {
    }
    MdGridListModule.forRoot = function () {
        return {
            ngModule: MdGridListModule,
            providers: []
        };
    };
    MdGridListModule = __decorate$32([
        _angular_core.NgModule({
            imports: [MdLineModule, DefaultStyleCompatibilityModeModule],
            exports: [
                MdGridList,
                MdGridTile,
                MdGridTileText,
                MdLineModule,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [MdGridList, MdGridTile, MdGridTileText],
        }), 
        __metadata$32('design:paramtypes', [])
    ], MdGridListModule);
    return MdGridListModule;
}());

var __decorate$34 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$34 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Content of a card, needed as it's used as a selector in the API.
 */
var MdCardContent = (function () {
    function MdCardContent() {
    }
    MdCardContent = __decorate$34([
        _angular_core.Directive({
            selector: 'md-card-content, mat-card-content'
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardContent);
    return MdCardContent;
}());
/**
 * Title of a card, needed as it's used as a selector in the API.
 */
var MdCardTitle = (function () {
    function MdCardTitle() {
    }
    MdCardTitle = __decorate$34([
        _angular_core.Directive({
            selector: 'md-card-title, mat-card-title'
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardTitle);
    return MdCardTitle;
}());
/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
var MdCardSubtitle = (function () {
    function MdCardSubtitle() {
    }
    MdCardSubtitle = __decorate$34([
        _angular_core.Directive({
            selector: 'md-card-subtitle, mat-card-subtitle'
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardSubtitle);
    return MdCardSubtitle;
}());
/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
var MdCardActions = (function () {
    function MdCardActions() {
    }
    MdCardActions = __decorate$34([
        _angular_core.Directive({
            selector: 'md-card-actions, mat-card-actions'
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardActions);
    return MdCardActions;
}());
/**
 * Footer of a card, needed as it's used as a selector in the API.
 */
var MdCardFooter = (function () {
    function MdCardFooter() {
    }
    MdCardFooter = __decorate$34([
        _angular_core.Directive({
            selector: 'md-card-footer, mat-card-footer'
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardFooter);
    return MdCardFooter;
}());
/*

<md-card> is a basic content container component that adds the styles of a material design card.

While you can use this component alone,
it also provides a number of preset styles for common card sections, including:
 - md-card-title
 - md-card-subtitle
 - md-card-content
 - md-card-actions
 - md-card-footer

 You can see some examples of cards here:
 http://embed.plnkr.co/s5O4YcyvbLhIApSrIhtj/

 TODO(kara): update link to demo site when it exists

*/
var MdCard = (function () {
    function MdCard() {
    }
    MdCard = __decorate$34([
        _angular_core.Component({selector: 'md-card, mat-card',
            template: "<ng-content></ng-content>",
            styles: ["md-card{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);transition:box-shadow 280ms cubic-bezier(.4,0,.2,1);will-change:box-shadow;display:block;position:relative;padding:24px;border-radius:2px;font-family:Roboto,\"Helvetica Neue\",sans-serif}@media screen and (-ms-high-contrast:active){md-card{outline:solid 1px}}.md-card-flat{box-shadow:none}md-card-actions,md-card-content,md-card-subtitle,md-card-title{display:block;margin-bottom:16px}md-card-title{font-size:24px;font-weight:400}md-card-content,md-card-header md-card-title,md-card-subtitle{font-size:14px}md-card-actions{margin-left:-16px;margin-right:-16px;padding:8px 0}md-card-actions[align=end]{display:flex;justify-content:flex-end}[md-card-image]{width:calc(100% + 48px);margin:0 -24px 16px}[md-card-xl-image]{width:240px;height:240px;margin:-8px}md-card-footer{position:absolute;width:100%;min-height:5px;bottom:0;left:0}md-card-actions [md-button],md-card-actions [md-raised-button]{margin:0 4px}md-card-header{display:flex;flex-direction:row;height:40px;margin:-8px 0 16px}.md-card-header-text{height:40px;margin:0 8px}[md-card-avatar]{height:40px;width:40px;border-radius:50%}[md-card-lg-image],[md-card-md-image],[md-card-sm-image]{margin:-8px 0}md-card-title-group{display:flex;justify-content:space-between;margin:0 -8px}[md-card-sm-image]{width:80px;height:80px}[md-card-md-image]{width:112px;height:112px}[md-card-lg-image]{width:152px;height:152px}@media (max-width:600px){md-card{padding:24px 16px}[md-card-image]{width:calc(100% + 32px);margin:16px -16px}md-card-title-group{margin:0}[md-card-xl-image]{margin-left:0;margin-right:0}md-card-header{margin:-8px 0 0}}md-card-content>:first-child,md-card>:first-child{margin-top:0}md-card-content>:last-child,md-card>:last-child{margin-bottom:0}[md-card-image]:first-child{margin-top:-24px}md-card>md-card-actions:last-child{margin-bottom:-16px;padding-bottom:0}md-card-actions [md-button]:first-child,md-card-actions [md-raised-button]:first-child{margin-left:0;margin-right:0}md-card-subtitle:not(:first-child),md-card-title:not(:first-child){margin-top:-4px}md-card-header md-card-subtitle:not(:first-child),md-card>[md-card-xl-image]:first-child{margin-top:-8px}md-card>[md-card-xl-image]:last-child{margin-bottom:-8px}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCard);
    return MdCard;
}());
/*  The following components don't have any behavior.
 They simply use content projection to wrap user content
 for flex layout purposes in <md-card> (and thus allow a cleaner, boilerplate-free API).


<md-card-header> is a component intended to be used within the <md-card> component.
It adds styles for a preset header section (i.e. a title, subtitle, and avatar layout).

You can see an example of a card with a header here:
http://embed.plnkr.co/tvJl19z3gZTQd6WmwkIa/

TODO(kara): update link to demo site when it exists
*/
var MdCardHeader = (function () {
    function MdCardHeader() {
    }
    MdCardHeader = __decorate$34([
        _angular_core.Component({selector: 'md-card-header, mat-card-header',
            template: "<ng-content select=\"[md-card-avatar], [mat-card-avatar]\"></ng-content><div class=\"md-card-header-text\"><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content></ng-content>",
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardHeader);
    return MdCardHeader;
}());
/*

<md-card-title-group> is a component intended to be used within the <md-card> component.
It adds styles for a preset layout that groups an image with a title section.

You can see an example of a card with a title-group section here:
http://embed.plnkr.co/EDfgCF9eKcXjini1WODm/

TODO(kara): update link to demo site when it exists
*/
var MdCardTitleGroup = (function () {
    function MdCardTitleGroup() {
    }
    MdCardTitleGroup = __decorate$34([
        _angular_core.Component({selector: 'md-card-title-group, mat-card-title-group',
            template: "<div><ng-content select=\"md-card-title, mat-card-title, md-card-subtitle, mat-card-subtitle\"></ng-content></div><ng-content select=\"img\"></ng-content><ng-content></ng-content>",
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardTitleGroup);
    return MdCardTitleGroup;
}());
var MdCardModule = (function () {
    function MdCardModule() {
    }
    MdCardModule.forRoot = function () {
        return {
            ngModule: MdCardModule,
            providers: []
        };
    };
    MdCardModule = __decorate$34([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [
                MdCard,
                MdCardHeader,
                MdCardTitleGroup,
                MdCardContent,
                MdCardTitle,
                MdCardSubtitle,
                MdCardActions,
                MdCardFooter,
                DefaultStyleCompatibilityModeModule,
            ],
            declarations: [
                MdCard, MdCardHeader, MdCardTitleGroup, MdCardContent, MdCardTitle, MdCardSubtitle,
                MdCardActions, MdCardFooter
            ],
        }), 
        __metadata$34('design:paramtypes', [])
    ], MdCardModule);
    return MdCardModule;
}());

var __decorate$36 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$36 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * A material design styled Chip component. Used inside the ChipList component.
 */
var MdChip = (function () {
    function MdChip(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /* Whether or not the chip is disabled. */
        this._disabled = null;
        /**
         * Emitted when the chip is focused.
         */
        this.onFocus = new _angular_core.EventEmitter();
        /**
         * Emitted when the chip is destroyed.
         */
        this.destroy = new _angular_core.EventEmitter();
    }
    MdChip.prototype.ngOnInit = function () {
        var el = this._elementRef.nativeElement;
        if (el.nodeName.toLowerCase() == 'md-chip' || el.hasAttribute('md-chip')) {
            el.classList.add('md-chip');
        }
    };
    MdChip.prototype.ngOnDestroy = function () {
        this.destroy.emit({ chip: this });
    };
    Object.defineProperty(MdChip.prototype, "disabled", {
        /** Whether or not the chip is disabled. */
        get: function () {
            return this._disabled;
        },
        /** Sets the disabled state of the chip. */
        set: function (value) {
            this._disabled = coerceBooleanProperty(value) ? true : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdChip.prototype, "_isAriaDisabled", {
        /** A String representation of the current disabled state. */
        get: function () {
            return String(coerceBooleanProperty(this.disabled));
        },
        enumerable: true,
        configurable: true
    });
    /** Allows for programmatic focusing of the chip. */
    MdChip.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
        this.onFocus.emit({ chip: this });
    };
    /** Ensures events fire properly upon click. */
    MdChip.prototype._handleClick = function (event) {
        // Check disabled
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            this.focus();
        }
    };
    __decorate$36([
        _angular_core.Output(), 
        __metadata$36('design:type', Object)
    ], MdChip.prototype, "destroy", void 0);
    __decorate$36([
        _angular_core.Input(), 
        __metadata$36('design:type', Boolean)
    ], MdChip.prototype, "disabled", null);
    MdChip = __decorate$36([
        _angular_core.Component({
            selector: 'md-basic-chip, [md-basic-chip], md-chip, [md-chip]',
            template: "<ng-content></ng-content>",
            host: {
                'tabindex': '-1',
                'role': 'option',
                '[attr.disabled]': 'disabled',
                '[attr.aria-disabled]': '_isAriaDisabled',
                '(click)': '_handleClick($event)'
            }
        }), 
        __metadata$36('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdChip);
    return MdChip;
}());

var __decorate$35 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$35 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * A material design chips component (named ChipList for it's similarity to the List component).
 *
 * Example:
 *
 *     <md-chip-list>
 *       <md-chip>Chip 1<md-chip>
 *       <md-chip>Chip 2<md-chip>
 *     </md-chip-list>
 */
var MdChipList = (function () {
    function MdChipList(_elementRef) {
        this._elementRef = _elementRef;
        /** Track which chips we're listening to for focus/destruction. */
        this._subscribed = new WeakMap();
    }
    MdChipList.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new ListKeyManager(this.chips).withFocusWrap();
        // Go ahead and subscribe all of the initial chips
        this.subscribeChips(this.chips);
        // When the list changes, re-subscribe
        this.chips.changes.subscribe(function (chips) {
            _this.subscribeChips(chips);
        });
    };
    /** Pass relevant key presses to our key manager. */
    MdChipList.prototype.keydown = function (event) {
        this._keyManager.onKeydown(event);
    };
    /**
     * Iterate through the list of chips and add them to our list of
     * subscribed chips.
     *
     * @param chips The list of chips to be subscribed.
     */
    MdChipList.prototype.subscribeChips = function (chips) {
        var _this = this;
        chips.forEach(function (chip) { return _this.addChip(chip); });
    };
    /**
     * Add a specific chip to our subscribed list. If the chip has
     * already been subscribed, this ensures it is only subscribed
     * once.
     *
     * @param chip The chip to be subscribed (or checked for existing
     * subscription).
     */
    MdChipList.prototype.addChip = function (chip) {
        var _this = this;
        // If we've already been subscribed to a parent, do nothing
        if (this._subscribed.has(chip)) {
            return;
        }
        // Watch for focus events outside of the keyboard navigation
        chip.onFocus.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this.isValidIndex(chipIndex)) {
                _this._keyManager.updateFocusedItemIndex(chipIndex);
            }
        });
        // On destroy, remove the item from our list, and check focus
        chip.destroy.subscribe(function () {
            var chipIndex = _this.chips.toArray().indexOf(chip);
            if (_this.isValidIndex(chipIndex)) {
                // Check whether the chip is the last item
                if (chipIndex < _this.chips.length - 1) {
                    _this._keyManager.setFocus(chipIndex);
                }
                else if (chipIndex - 1 >= 0) {
                    _this._keyManager.setFocus(chipIndex - 1);
                }
            }
            _this._subscribed.delete(chip);
            chip.destroy.unsubscribe();
        });
        this._subscribed.set(chip, true);
    };
    /**
     * Utility to ensure all indexes are valid.
     *
     * @param index The index to be checked.
     * @returns {boolean} True if the index is valid for our list of chips.
     */
    MdChipList.prototype.isValidIndex = function (index) {
        return index >= 0 && index < this.chips.length;
    };
    MdChipList = __decorate$35([
        _angular_core.Component({selector: 'md-chip-list',
            template: "<div class=\"md-chip-list-wrapper\"><ng-content></ng-content></div>",
            host: {
                // Properties
                'tabindex': '0',
                'role': 'listbox',
                'class': 'md-chip-list',
                // Events
                '(focus)': '_keyManager.focusFirstItem()',
                '(keydown)': 'keydown($event)'
            },
            queries: {
                chips: new _angular_core.ContentChildren(MdChip)
            },
            styles: [".md-chip-list-wrapper{display:flex;flex-direction:row;flex-wrap:wrap;align-items:flex-start}.md-chip-list-wrapper .md-chip{margin:0 3px}.md-chip-list-wrapper .md-chip:first-child{margin-left:0;margin-right:3px}.md-chip-list-wrapper .md-chip:last-child,[dir=rtl] .md-chip-list-wrapper .md-chip:first-child{margin-left:3px;margin-right:0}[dir=rtl] .md-chip-list-wrapper .md-chip:last-child{margin-left:0;margin-right:3px}.md-chip{display:inline-block;padding:8px 12px;border-radius:24px;font-size:13px;line-height:16px}.md-chip-list-stacked .md-chip-list-wrapper{display:block}.md-chip-list-stacked .md-chip-list-wrapper .md-chip{display:block;margin:0 0 8px}[dir=rtl] .md-chip-list-stacked .md-chip-list-wrapper .md-chip{margin:0 0 8px}.md-chip-list-stacked .md-chip-list-wrapper .md-chip:last-child,[dir=rtl] .md-chip-list-stacked .md-chip-list-wrapper .md-chip:last-child{margin-bottom:0}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush
        }), 
        __metadata$35('design:paramtypes', [_angular_core.ElementRef])
    ], MdChipList);
    return MdChipList;
}());
var MdChipsModule = (function () {
    function MdChipsModule() {
    }
    MdChipsModule.forRoot = function () {
        return {
            ngModule: MdChipsModule,
            providers: []
        };
    };
    MdChipsModule = __decorate$35([
        _angular_core.NgModule({
            imports: [],
            exports: [MdChipList, MdChip],
            declarations: [MdChipList, MdChip]
        }), 
        __metadata$35('design:paramtypes', [])
    ], MdChipsModule);
    return MdChipsModule;
}());

var __extends$11 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$38 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$38 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Exception thrown when attempting to load an icon with a name that cannot be found.
 * @docs-private
 */
var MdIconNameNotFoundError = (function (_super) {
    __extends$11(MdIconNameNotFoundError, _super);
    function MdIconNameNotFoundError(iconName) {
        _super.call(this, "Unable to find icon with the name \"" + iconName + "\"");
    }
    return MdIconNameNotFoundError;
}(MdError));
/**
 * Exception thrown when attempting to load SVG content that does not contain the expected
 * <svg> tag.
 * @docs-private
 */
var MdIconSvgTagNotFoundError = (function (_super) {
    __extends$11(MdIconSvgTagNotFoundError, _super);
    function MdIconSvgTagNotFoundError() {
        _super.call(this, '<svg> tag not found');
    }
    return MdIconSvgTagNotFoundError;
}(MdError));
/**
 * Configuration for an icon, including the URL and possibly the cached SVG element.
 * @docs-private
 */
var SvgIconConfig = (function () {
    function SvgIconConfig(url) {
        this.url = url;
        this.svgElement = null;
    }
    return SvgIconConfig;
}());
/** Returns the cache key to use for an icon namespace and name. */
var iconKey = function (namespace, name) { return namespace + ':' + name; };
/**
 * Service to register and display icons used by the <md-icon> component.
 * - Registers icon URLs by namespace and name.
 * - Registers icon set URLs by namespace.
 * - Registers aliases for CSS classes, for use with icon fonts.
 * - Loads icons from URLs and extracts individual icons from icon sets.
 */
var MdIconRegistry = (function () {
    function MdIconRegistry(_http) {
        this._http = _http;
        /**
         * URLs and cached SVG elements for individual icons. Keys are of the format "[namespace]:[icon]".
         */
        this._svgIconConfigs = new Map();
        /**
         * SvgIconConfig objects and cached SVG elements for icon sets, keyed by namespace.
         * Multiple icon sets can be registered under the same namespace.
         */
        this._iconSetConfigs = new Map();
        /** Cache for icons loaded by direct URLs. */
        this._cachedIconsByUrl = new Map();
        /** In-progress icon fetches. Used to coalesce multiple requests to the same URL. */
        this._inProgressUrlFetches = new Map();
        /** Map from font identifiers to their CSS class names. Used for icon fonts. */
        this._fontCssClassesByAlias = new Map();
        /**
         * The CSS class to apply when an <md-icon> component has no icon name, url, or font specified.
         * The default 'material-icons' value assumes that the material icon font has been loaded as
         * described at http://google.github.io/material-design-icons/#icon-font-for-the-web
         */
        this._defaultFontSetClass = 'material-icons';
    }
    /** Registers an icon by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIcon = function (iconName, url) {
        return this.addSvgIconInNamespace('', iconName, url);
    };
    /** Registers an icon by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconInNamespace = function (namespace, iconName, url) {
        var key = iconKey(namespace, iconName);
        this._svgIconConfigs.set(key, new SvgIconConfig(url));
        return this;
    };
    /** Registers an icon set by URL in the default namespace. */
    MdIconRegistry.prototype.addSvgIconSet = function (url) {
        return this.addSvgIconSetInNamespace('', url);
    };
    /** Registers an icon set by URL in the specified namespace. */
    MdIconRegistry.prototype.addSvgIconSetInNamespace = function (namespace, url) {
        var config = new SvgIconConfig(url);
        if (this._iconSetConfigs.has(namespace)) {
            this._iconSetConfigs.get(namespace).push(config);
        }
        else {
            this._iconSetConfigs.set(namespace, [config]);
        }
        return this;
    };
    /**
     * Defines an alias for a CSS class name to be used for icon fonts. Creating an mdIcon
     * component with the alias as the fontSet input will cause the class name to be applied
     * to the <md-icon> element.
     */
    MdIconRegistry.prototype.registerFontClassAlias = function (alias, className) {
        if (className === void 0) { className = alias; }
        this._fontCssClassesByAlias.set(alias, className);
        return this;
    };
    /**
     * Returns the CSS class name associated with the alias by a previous call to
     * registerFontClassAlias. If no CSS class has been associated, returns the alias unmodified.
     */
    MdIconRegistry.prototype.classNameForFontAlias = function (alias) {
        return this._fontCssClassesByAlias.get(alias) || alias;
    };
    /**
     * Sets the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.setDefaultFontSetClass = function (className) {
        this._defaultFontSetClass = className;
        return this;
    };
    /**
     * Returns the CSS class name to be used for icon fonts when an <md-icon> component does not
     * have a fontSet input value, and is not loading an icon by name or URL.
     */
    MdIconRegistry.prototype.getDefaultFontSetClass = function () {
        return this._defaultFontSetClass;
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) from the given URL.
     * The response from the URL may be cached so this will not always cause an HTTP request, but
     * the produced element will always be a new copy of the originally fetched icon. (That is,
     * it will not contain any modifications made to elements previously returned).
     */
    MdIconRegistry.prototype.getSvgIconFromUrl = function (url) {
        var _this = this;
        if (this._cachedIconsByUrl.has(url)) {
            return rxjs_Observable.Observable.of(cloneSvg(this._cachedIconsByUrl.get(url)));
        }
        return this._loadSvgIconFromConfig(new SvgIconConfig(url))
            .do(function (svg) { return _this._cachedIconsByUrl.set(url, svg); })
            .map(function (svg) { return cloneSvg(svg); });
    };
    /**
     * Returns an Observable that produces the icon (as an <svg> DOM element) with the given name
     * and namespace. The icon must have been previously registered with addIcon or addIconSet;
     * if not, the Observable will throw an MdIconNameNotFoundError.
     */
    MdIconRegistry.prototype.getNamedSvgIcon = function (name, namespace) {
        if (namespace === void 0) { namespace = ''; }
        // Return (copy of) cached icon if possible.
        var key = iconKey(namespace, name);
        if (this._svgIconConfigs.has(key)) {
            return this._getSvgFromConfig(this._svgIconConfigs.get(key));
        }
        // See if we have any icon sets registered for the namespace.
        var iconSetConfigs = this._iconSetConfigs.get(namespace);
        if (iconSetConfigs) {
            return this._getSvgFromIconSetConfigs(name, iconSetConfigs);
        }
        return rxjs_Observable.Observable.throw(new MdIconNameNotFoundError(key));
    };
    /**
     * Returns the cached icon for a SvgIconConfig if available, or fetches it from its URL if not.
     */
    MdIconRegistry.prototype._getSvgFromConfig = function (config) {
        if (config.svgElement) {
            // We already have the SVG element for this icon, return a copy.
            return rxjs_Observable.Observable.of(cloneSvg(config.svgElement));
        }
        else {
            // Fetch the icon from the config's URL, cache it, and return a copy.
            return this._loadSvgIconFromConfig(config)
                .do(function (svg) { return config.svgElement = svg; })
                .map(function (svg) { return cloneSvg(svg); });
        }
    };
    /**
     * Attempts to find an icon with the specified name in any of the SVG icon sets.
     * First searches the available cached icons for a nested element with a matching name, and
     * if found copies the element to a new <svg> element. If not found, fetches all icon sets
     * that have not been cached, and searches again after all fetches are completed.
     * The returned Observable produces the SVG element if possible, and throws
     * MdIconNameNotFoundError if no icon with the specified name can be found.
     */
    MdIconRegistry.prototype._getSvgFromIconSetConfigs = function (name, iconSetConfigs) {
        var _this = this;
        // For all the icon set SVG elements we've fetched, see if any contain an icon with the
        // requested name.
        var namedIcon = this._extractIconWithNameFromAnySet(name, iconSetConfigs);
        if (namedIcon) {
            // We could cache namedIcon in _svgIconConfigs, but since we have to make a copy every
            // time anyway, there's probably not much advantage compared to just always extracting
            // it from the icon set.
            return rxjs_Observable.Observable.of(namedIcon);
        }
        // Not found in any cached icon sets. If there are icon sets with URLs that we haven't
        // fetched, fetch them now and look for iconName in the results.
        var iconSetFetchRequests = iconSetConfigs
            .filter(function (iconSetConfig) { return !iconSetConfig.svgElement; })
            .map(function (iconSetConfig) {
            return _this._loadSvgIconSetFromConfig(iconSetConfig)
                .catch(function (err, caught) {
                // Swallow errors fetching individual URLs so the combined Observable won't
                // necessarily fail.
                console.log("Loading icon set URL: " + iconSetConfig.url + " failed: " + err);
                return rxjs_Observable.Observable.of(null);
            })
                .do(function (svg) {
                // Cache SVG element.
                if (svg) {
                    iconSetConfig.svgElement = svg;
                }
            });
        });
        // Fetch all the icon set URLs. When the requests complete, every IconSet should have a
        // cached SVG element (unless the request failed), and we can check again for the icon.
        return rxjs_Observable.Observable.forkJoin(iconSetFetchRequests)
            .map(function (ignoredResults) {
            var foundIcon = _this._extractIconWithNameFromAnySet(name, iconSetConfigs);
            if (!foundIcon) {
                throw new MdIconNameNotFoundError(name);
            }
            return foundIcon;
        });
    };
    /**
     * Searches the cached SVG elements for the given icon sets for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractIconWithNameFromAnySet = function (iconName, iconSetConfigs) {
        // Iterate backwards, so icon sets added later have precedence.
        for (var i = iconSetConfigs.length - 1; i >= 0; i--) {
            var config = iconSetConfigs[i];
            if (config.svgElement) {
                var foundIcon = this._extractSvgIconFromSet(config.svgElement, iconName, config);
                if (foundIcon) {
                    return foundIcon;
                }
            }
        }
        return null;
    };
    /**
     * Loads the content of the icon URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconFromConfig = function (config) {
        var _this = this;
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._createSvgElementForSingleIcon(svgText, config); });
    };
    /**
     * Loads the content of the icon set URL specified in the SvgIconConfig and creates an SVG element
     * from it.
     */
    MdIconRegistry.prototype._loadSvgIconSetFromConfig = function (config) {
        var _this = this;
        // TODO: Document that icons should only be loaded from trusted sources.
        return this._fetchUrl(config.url)
            .map(function (svgText) { return _this._svgElementFromString(svgText); });
    };
    /**
     * Creates a DOM element from the given SVG string, and adds default attributes.
     */
    MdIconRegistry.prototype._createSvgElementForSingleIcon = function (responseText, config) {
        var svg = this._svgElementFromString(responseText);
        this._setSvgAttributes(svg, config);
        return svg;
    };
    /**
     * Searches the cached element of the given SvgIconConfig for a nested icon element whose "id"
     * tag matches the specified name. If found, copies the nested element to a new SVG element and
     * returns it. Returns null if no matching element is found.
     */
    MdIconRegistry.prototype._extractSvgIconFromSet = function (iconSet, iconName, config) {
        var iconNode = iconSet.querySelector('#' + iconName);
        if (!iconNode) {
            return null;
        }
        // If the icon node is itself an <svg> node, clone and return it directly. If not, set it as
        // the content of a new <svg> node.
        if (iconNode.tagName.toLowerCase() == 'svg') {
            return this._setSvgAttributes(iconNode.cloneNode(true), config);
        }
        // createElement('SVG') doesn't work as expected; the DOM ends up with
        // the correct nodes, but the SVG content doesn't render. Instead we
        // have to create an empty SVG node using innerHTML and append its content.
        // Elements created using DOMParser.parseFromString have the same problem.
        // http://stackoverflow.com/questions/23003278/svg-innerhtml-in-firefox-can-not-display
        var svg = this._svgElementFromString('<svg></svg>');
        // Clone the node so we don't remove it from the parent icon set element.
        svg.appendChild(iconNode.cloneNode(true));
        return this._setSvgAttributes(svg, config);
    };
    /**
     * Creates a DOM element from the given SVG string.
     */
    MdIconRegistry.prototype._svgElementFromString = function (str) {
        // TODO: Is there a better way than innerHTML? Renderer doesn't appear to have a method for
        // creating an element from an HTML string.
        var div = document.createElement('DIV');
        div.innerHTML = str;
        var svg = div.querySelector('svg');
        if (!svg) {
            throw new MdIconSvgTagNotFoundError();
        }
        return svg;
    };
    /**
     * Sets the default attributes for an SVG element to be used as an icon.
     */
    MdIconRegistry.prototype._setSvgAttributes = function (svg, config) {
        if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        svg.setAttribute('fit', '');
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false'); // Disable IE11 default behavior to make SVGs focusable.
        return svg;
    };
    /**
     * Returns an Observable which produces the string contents of the given URL. Results may be
     * cached, so future calls with the same URL may not cause another HTTP request.
     */
    MdIconRegistry.prototype._fetchUrl = function (url) {
        var _this = this;
        // Store in-progress fetches to avoid sending a duplicate request for a URL when there is
        // already a request in progress for that URL. It's necessary to call share() on the
        // Observable returned by http.get() so that multiple subscribers don't cause multiple XHRs.
        if (this._inProgressUrlFetches.has(url)) {
            return this._inProgressUrlFetches.get(url);
        }
        // TODO(jelbourn): for some reason, the `finally` operator "loses" the generic type on the
        // Observable. Figure out why and fix it.
        var req = this._http.get(url)
            .map(function (response) { return response.text(); })
            .finally(function () {
            _this._inProgressUrlFetches.delete(url);
        })
            .share();
        this._inProgressUrlFetches.set(url, req);
        return req;
    };
    MdIconRegistry = __decorate$38([
        _angular_core.Injectable(), 
        __metadata$38('design:paramtypes', [_angular_http.Http])
    ], MdIconRegistry);
    return MdIconRegistry;
}());
/** Clones an SVGElement while preserving type information. */
function cloneSvg(svg) {
    return svg.cloneNode(true);
}

var __extends$10 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$37 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$37 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Exception thrown when an invalid icon name is passed to an md-icon component. */
var MdIconInvalidNameError = (function (_super) {
    __extends$10(MdIconInvalidNameError, _super);
    function MdIconInvalidNameError(iconName) {
        _super.call(this, "Invalid icon name: \"" + iconName + "\"");
    }
    return MdIconInvalidNameError;
}(MdError));
/**
 * Component to display an icon. It can be used in the following ways:
 * - Specify the svgSrc input to load an SVG icon from a URL. The SVG content is directly inlined
 *   as a child of the <md-icon> component, so that CSS styles can easily be applied to it.
 *   The URL is loaded via an XMLHttpRequest, so it must be on the same domain as the page or its
 *   server must be configured to allow cross-domain requests.
 *   Example:
 *     <md-icon svgSrc="assets/arrow.svg"></md-icon>
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   MdIconRegistry. If the svgIcon value contains a colon it is assumed to be in the format
 *   "[namespace]:[name]", if not the value will be the name of an icon in the default namespace.
 *   Examples:
 *     <md-icon svgIcon="left-arrow"></md-icon>
 *     <md-icon svgIcon="animals:cat"></md-icon>
 *
 * - Use a font ligature as an icon by putting the ligature text in the content of the <md-icon>
 *   component. By default the Material icons font is used as described at
 *   http://google.github.io/material-design-icons/#icon-font-for-the-web. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with MdIconRegistry.registerFontClassAlias.
 *   Examples:
 *     <md-icon>home</md-icon>
 *     <md-icon fontSet="myfont">sun</md-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     <md-icon fontSet="fa" fontIcon="alarm"></md-icon>
 */
var MdIcon = (function () {
    function MdIcon(_elementRef, _renderer, _mdIconRegistry) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._mdIconRegistry = _mdIconRegistry;
        this.hostAriaLabel = '';
    }
    Object.defineProperty(MdIcon.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdIcon.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdIcon.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    /**
     * Splits an svgIcon binding value into its icon set and icon name components.
     * Returns a 2-element array of [(icon set), (icon name)].
     * The separator for the two fields is ':'. If there is no separator, an empty
     * string is returned for the icon set and the entire value is returned for
     * the icon name. If the argument is falsy, returns an array of two empty strings.
     * Throws a MdIconInvalidNameError if the name contains two or more ':' separators.
     * Examples:
     *   'social:cake' -> ['social', 'cake']
     *   'penguin' -> ['', 'penguin']
     *   null -> ['', '']
     *   'a:b:c' -> (throws MdIconInvalidNameError)
     */
    MdIcon.prototype._splitIconName = function (iconName) {
        if (!iconName) {
            return ['', ''];
        }
        var parts = iconName.split(':');
        switch (parts.length) {
            case 1:
                // Use default namespace.
                return ['', parts[0]];
            case 2:
                return parts;
            default:
                throw new MdIconInvalidNameError(iconName);
        }
    };
    MdIcon.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var changedInputs = Object.keys(changes);
        // Only update the inline SVG icon if the inputs changed, to avoid unnecessary DOM operations.
        if (changedInputs.indexOf('svgIcon') != -1 || changedInputs.indexOf('svgSrc') != -1) {
            if (this.svgIcon) {
                var _a = this._splitIconName(this.svgIcon), namespace = _a[0], iconName = _a[1];
                this._mdIconRegistry.getNamedSvgIcon(iconName, namespace).first().subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
            else if (this.svgSrc) {
                this._mdIconRegistry.getSvgIconFromUrl(this.svgSrc).first().subscribe(function (svg) { return _this._setSvgElement(svg); }, function (err) { return console.log("Error retrieving icon: " + err); });
            }
        }
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
        this._updateAriaLabel();
    };
    MdIcon.prototype.ngOnInit = function () {
        // Update font classes because ngOnChanges won't be called if none of the inputs are present,
        // e.g. <md-icon>arrow</md-icon>. In this case we need to add a CSS class for the default font.
        if (this._usingFontIcon()) {
            this._updateFontIconClasses();
        }
    };
    MdIcon.prototype.ngAfterViewChecked = function () {
        // Update aria label here because it may depend on the projected text content.
        // (e.g. <md-icon>home</md-icon> should use 'home').
        this._updateAriaLabel();
    };
    MdIcon.prototype._updateAriaLabel = function () {
        var ariaLabel = this._getAriaLabel();
        if (ariaLabel) {
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-label', ariaLabel);
        }
    };
    MdIcon.prototype._getAriaLabel = function () {
        // If the parent provided an aria-label attribute value, use it as-is. Otherwise look for a
        // reasonable value from the alt attribute, font icon name, SVG icon name, or (for ligatures)
        // the text content of the directive.
        var label = this.hostAriaLabel ||
            this.alt ||
            this.fontIcon ||
            this._splitIconName(this.svgIcon)[1];
        if (label) {
            return label;
        }
        // The "content" of an SVG icon is not a useful label.
        if (this._usingFontIcon()) {
            var text = this._elementRef.nativeElement.textContent;
            if (text) {
                return text;
            }
        }
        // TODO: Warn here in dev mode.
        return null;
    };
    MdIcon.prototype._usingFontIcon = function () {
        return !(this.svgIcon || this.svgSrc);
    };
    MdIcon.prototype._setSvgElement = function (svg) {
        var layoutElement = this._elementRef.nativeElement;
        // Remove existing child nodes and add the new SVG element.
        // We would use renderer.detachView(Array.from(layoutElement.childNodes)) here,
        // but it fails in IE11: https://github.com/angular/angular/issues/6327
        layoutElement.innerHTML = '';
        this._renderer.projectNodes(layoutElement, [svg]);
    };
    MdIcon.prototype._updateFontIconClasses = function () {
        if (!this._usingFontIcon()) {
            return;
        }
        var elem = this._elementRef.nativeElement;
        var fontSetClass = this.fontSet ?
            this._mdIconRegistry.classNameForFontAlias(this.fontSet) :
            this._mdIconRegistry.getDefaultFontSetClass();
        if (fontSetClass != this._previousFontSetClass) {
            if (this._previousFontSetClass) {
                this._renderer.setElementClass(elem, this._previousFontSetClass, false);
            }
            if (fontSetClass) {
                this._renderer.setElementClass(elem, fontSetClass, true);
            }
            this._previousFontSetClass = fontSetClass;
        }
        if (this.fontIcon != this._previousFontIconClass) {
            if (this._previousFontIconClass) {
                this._renderer.setElementClass(elem, this._previousFontIconClass, false);
            }
            if (this.fontIcon) {
                this._renderer.setElementClass(elem, this.fontIcon, true);
            }
            this._previousFontIconClass = this.fontIcon;
        }
    };
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "svgSrc", void 0);
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "svgIcon", void 0);
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "fontSet", void 0);
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "fontIcon", void 0);
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "alt", void 0);
    __decorate$37([
        _angular_core.Input('aria-label'), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "hostAriaLabel", void 0);
    __decorate$37([
        _angular_core.Input(), 
        __metadata$37('design:type', String)
    ], MdIcon.prototype, "color", null);
    MdIcon = __decorate$37([
        _angular_core.Component({template: '<ng-content></ng-content>',
            selector: 'md-icon, mat-icon',
            styles: ["md-icon{background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px}"],
            host: {
                'role': 'img',
            },
            encapsulation: _angular_core.ViewEncapsulation.None,
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$37('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer, MdIconRegistry])
    ], MdIcon);
    return MdIcon;
}());
var MdIconModule = (function () {
    function MdIconModule() {
    }
    MdIconModule.forRoot = function () {
        return {
            ngModule: MdIconModule,
            providers: [MdIconRegistry],
        };
    };
    MdIconModule = __decorate$37([
        _angular_core.NgModule({
            imports: [_angular_http.HttpModule, DefaultStyleCompatibilityModeModule],
            exports: [MdIcon, DefaultStyleCompatibilityModeModule],
            declarations: [MdIcon],
        }), 
        __metadata$37('design:paramtypes', [])
    ], MdIconModule);
    return MdIconModule;
}());

var __extends$12 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$39 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$39 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// TODO(josephperrott): Benchpress tests.
/** A single degree in radians. */
var DEGREE_IN_RADIANS = Math.PI / 180;
/** Duration of the indeterminate animation. */
var DURATION_INDETERMINATE = 667;
/** Duration of the indeterminate animation. */
var DURATION_DETERMINATE = 225;
/** Start animation value of the indeterminate animation */
var startIndeterminate = 3;
/** End animation value of the indeterminate animation */
var endIndeterminate = 80;
/* Maximum angle for the arc. The angle can't be exactly 360, because the arc becomes hidden. */
var MAX_ANGLE = 359.99 / 100;
/**
 * <md-progress-circle> component.
 */
var MdProgressCircle = (function () {
    function MdProgressCircle(_changeDetectorRef, _ngZone, _elementRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        /** The id of the last requested animation. */
        this._lastAnimationId = 0;
        this._mode = 'determinate';
    }
    Object.defineProperty(MdProgressCircle.prototype, "_ariaValueMin", {
        /**
         * Values for aria max and min are only defined as numbers when in a determinate mode.  We do this
         * because voiceover does not report the progress indicator as indeterminate if the aria min
         * and/or max value are number values.
         */
        get: function () {
            return this.mode == 'determinate' ? 0 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "_ariaValueMax", {
        get: function () {
            return this.mode == 'determinate' ? 100 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "interdeterminateInterval", {
        /** @docs-private */
        get: function () {
            return this._interdeterminateInterval;
        },
        /** @docs-private */
        set: function (interval) {
            clearInterval(this._interdeterminateInterval);
            this._interdeterminateInterval = interval;
        },
        enumerable: true,
        configurable: true
    });
    /** Clean up any animations that were running. */
    MdProgressCircle.prototype.ngOnDestroy = function () {
        this._cleanupIndeterminateAnimation();
    };
    Object.defineProperty(MdProgressCircle.prototype, "value", {
        get: function () {
            if (this.mode == 'determinate') {
                return this._value;
            }
        },
        set: function (v) {
            if (v != null && this.mode == 'determinate') {
                var newValue = clamp(v);
                this._animateCircle((this.value || 0), newValue, linearEase, DURATION_DETERMINATE, 0);
                this._value = newValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressCircle.prototype, "mode", {
        /**
         * Mode of the progress circle
         *
         * Input must be one of the values from ProgressMode, defaults to 'determinate'.
         * mode is bound to the host as the attribute host.
         */
        get: function () {
            return this._mode;
        },
        set: function (m) {
            if (m == 'indeterminate') {
                this._startIndeterminateAnimation();
            }
            else {
                this._cleanupIndeterminateAnimation();
            }
            this._mode = m;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Animates the circle from one percentage value to another.
     *
     * @param animateFrom The percentage of the circle filled starting the animation.
     * @param animateTo The percentage of the circle filled ending the animation.
     * @param ease The easing function to manage the pace of change in the animation.
     * @param duration The length of time to show the animation, in milliseconds.
     * @param rotation The starting angle of the circle fill, with 0° represented at the top center
     *    of the circle.
     */
    MdProgressCircle.prototype._animateCircle = function (animateFrom, animateTo, ease, duration, rotation) {
        var _this = this;
        var id = ++this._lastAnimationId;
        var startTime = Date.now();
        var changeInValue = animateTo - animateFrom;
        // No need to animate it if the values are the same
        if (animateTo === animateFrom) {
            this._renderArc(animateTo, rotation);
        }
        else {
            var animation_1 = function () {
                var elapsedTime = Math.max(0, Math.min(Date.now() - startTime, duration));
                _this._renderArc(ease(elapsedTime, animateFrom, changeInValue, duration), rotation);
                // Prevent overlapping animations by checking if a new animation has been called for and
                // if the animation has lasted longer than the animation duration.
                if (id === _this._lastAnimationId && elapsedTime < duration) {
                    requestAnimationFrame(animation_1);
                }
            };
            // Run the animation outside of Angular's zone, in order to avoid
            // hitting ZoneJS and change detection on each frame.
            this._ngZone.runOutsideAngular(animation_1);
        }
    };
    /**
     * Starts the indeterminate animation interval, if it is not already running.
     */
    MdProgressCircle.prototype._startIndeterminateAnimation = function () {
        var _this = this;
        var rotationStartPoint = 0;
        var start = startIndeterminate;
        var end = endIndeterminate;
        var duration = DURATION_INDETERMINATE;
        var animate = function () {
            _this._animateCircle(start, end, materialEase, duration, rotationStartPoint);
            // Prevent rotation from reaching Number.MAX_SAFE_INTEGER.
            rotationStartPoint = (rotationStartPoint + end) % 100;
            var temp = start;
            start = -end;
            end = -temp;
        };
        if (!this.interdeterminateInterval) {
            this._ngZone.runOutsideAngular(function () {
                _this.interdeterminateInterval = setInterval(animate, duration + 50, 0, false);
                animate();
            });
        }
    };
    /**
     * Removes interval, ending the animation.
     */
    MdProgressCircle.prototype._cleanupIndeterminateAnimation = function () {
        this.interdeterminateInterval = null;
    };
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     */
    MdProgressCircle.prototype._renderArc = function (currentValue, rotation) {
        // Caches the path reference so it doesn't have to be looked up every time.
        var path = this._path = this._path || this._elementRef.nativeElement.querySelector('path');
        // Ensure that the path was found. This may not be the case if the
        // animation function fires too early.
        if (path) {
            path.setAttribute('d', getSvgArc(currentValue, rotation));
        }
    };
    __decorate$39([
        _angular_core.Input(),
        _angular_core.HostBinding('attr.aria-valuenow'), 
        __metadata$39('design:type', Object)
    ], MdProgressCircle.prototype, "value", null);
    __decorate$39([
        _angular_core.HostBinding('attr.mode'),
        _angular_core.Input(), 
        __metadata$39('design:type', Object)
    ], MdProgressCircle.prototype, "mode", null);
    MdProgressCircle = __decorate$39([
        _angular_core.Component({selector: 'md-progress-circle, mat-progress-circle',
            host: {
                'role': 'progressbar',
                '[attr.aria-valuemin]': '_ariaValueMin',
                '[attr.aria-valuemax]': '_ariaValueMax',
            },
            template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path></path></svg>",
            styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;stroke-width:10px}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:md-progress-circle-sporadic-rotate,md-progress-circle-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes md-progress-circle-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes md-progress-circle-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$39('design:paramtypes', [_angular_core.ChangeDetectorRef, _angular_core.NgZone, _angular_core.ElementRef])
    ], MdProgressCircle);
    return MdProgressCircle;
}());
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-circle> instance.
 */
var MdSpinner = (function (_super) {
    __extends$12(MdSpinner, _super);
    function MdSpinner(changeDetectorRef, elementRef, ngZone) {
        _super.call(this, changeDetectorRef, ngZone, elementRef);
        this.mode = 'indeterminate';
    }
    MdSpinner.prototype.ngOnDestroy = function () {
        // The `ngOnDestroy` from `MdProgressCircle` should be called explicitly, because
        // in certain cases Angular won't call it (e.g. when using AoT and in unit tests).
        _super.prototype.ngOnDestroy.call(this);
    };
    MdSpinner = __decorate$39([
        _angular_core.Component({selector: 'md-spinner, mat-spinner',
            host: {
                'role': 'progressbar',
                'mode': 'indeterminate',
            },
            template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path></path></svg>",
            styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;stroke-width:10px}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:md-progress-circle-sporadic-rotate,md-progress-circle-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes md-progress-circle-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes md-progress-circle-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
        }), 
        __metadata$39('design:paramtypes', [_angular_core.ChangeDetectorRef, _angular_core.ElementRef, _angular_core.NgZone])
    ], MdSpinner);
    return MdSpinner;
}(MdProgressCircle));
/**
 * Module functions.
 */
/** Clamps a value to be between 0 and 100. */
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}
/**
 * Converts Polar coordinates to Cartesian.
 */
function polarToCartesian(radius, pathRadius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * DEGREE_IN_RADIANS;
    return (radius + (pathRadius * Math.cos(angleInRadians))) +
        ',' + (radius + (pathRadius * Math.sin(angleInRadians)));
}
/**
 * Easing function for linear animation.
 */
function linearEase(currentTime, startValue, changeInValue, duration) {
    return changeInValue * currentTime / duration + startValue;
}
/**
 * Easing function to match material design indeterminate animation.
 */
function materialEase(currentTime, startValue, changeInValue, duration) {
    var time = currentTime / duration;
    var timeCubed = Math.pow(time, 3);
    var timeQuad = Math.pow(time, 4);
    var timeQuint = Math.pow(time, 5);
    return startValue + changeInValue * ((6 * timeQuint) + (-15 * timeQuad) + (10 * timeCubed));
}
/**
 * Determines the path value to define the arc.  Converting percentage values to to polar
 * coordinates on the circle, and then to cartesian coordinates in the viewport.
 *
 * @param currentValue The current percentage value of the progress circle, the percentage of the
 *    circle to fill.
 * @param rotation The starting point of the circle with 0 being the 0 degree point.
 * @return A string for an SVG path representing a circle filled from the starting point to the
 *    percentage value provided.
 */
function getSvgArc(currentValue, rotation) {
    var startPoint = rotation || 0;
    var radius = 50;
    var pathRadius = 40;
    var startAngle = startPoint * MAX_ANGLE;
    var endAngle = currentValue * MAX_ANGLE;
    var start = polarToCartesian(radius, pathRadius, startAngle);
    var end = polarToCartesian(radius, pathRadius, endAngle + startAngle);
    var arcSweep = endAngle < 0 ? 0 : 1;
    var largeArcFlag;
    if (endAngle < 0) {
        largeArcFlag = endAngle >= -180 ? 0 : 1;
    }
    else {
        largeArcFlag = endAngle <= 180 ? 0 : 1;
    }
    return "M" + start + "A" + pathRadius + "," + pathRadius + " 0 " + largeArcFlag + "," + arcSweep + " " + end;
}
var MdProgressCircleModule = (function () {
    function MdProgressCircleModule() {
    }
    MdProgressCircleModule.forRoot = function () {
        return {
            ngModule: MdProgressCircleModule,
            providers: []
        };
    };
    MdProgressCircleModule = __decorate$39([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdProgressCircle, MdSpinner, DefaultStyleCompatibilityModeModule],
            declarations: [MdProgressCircle, MdSpinner],
        }), 
        __metadata$39('design:paramtypes', [])
    ], MdProgressCircleModule);
    return MdProgressCircleModule;
}());

var __decorate$40 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$40 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// TODO(josephperrott): Benchpress tests.
// TODO(josephperrott): Add ARIA attributes for progressbar "for".
/**
 * <md-progress-bar> component.
 */
var MdProgressBar = (function () {
    function MdProgressBar() {
        /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
        this._value = 0;
        /** Buffer value of the progress bar. Defaults to zero. */
        this._bufferValue = 0;
        /**
         * Mode of the progress bar.
         *
         * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
         * 'determinate'.
         * Mirrored to mode attribute.
         */
        this.mode = 'determinate';
    }
    Object.defineProperty(MdProgressBar.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = clamp$1(v || 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressBar.prototype, "bufferValue", {
        get: function () {
            return this._bufferValue;
        },
        set: function (v) {
            this._bufferValue = clamp$1(v || 0);
        },
        enumerable: true,
        configurable: true
    });
    /** Gets the current transform value for the progress bar's primary indicator. */
    MdProgressBar.prototype._primaryTransform = function () {
        var scale = this.value / 100;
        return { transform: "scaleX(" + scale + ")" };
    };
    /**
     * Gets the current transform value for the progress bar's buffer indicator.  Only used if the
     * progress mode is set to buffer, otherwise returns an undefined, causing no transformation.
     */
    MdProgressBar.prototype._bufferTransform = function () {
        if (this.mode == 'buffer') {
            var scale = this.bufferValue / 100;
            return { transform: "scaleX(" + scale + ")" };
        }
    };
    __decorate$40([
        _angular_core.Input(),
        _angular_core.HostBinding('attr.aria-valuenow'), 
        __metadata$40('design:type', Object)
    ], MdProgressBar.prototype, "value", null);
    __decorate$40([
        _angular_core.Input(), 
        __metadata$40('design:type', Object)
    ], MdProgressBar.prototype, "bufferValue", null);
    __decorate$40([
        _angular_core.Input(),
        _angular_core.HostBinding('attr.mode'), 
        __metadata$40('design:type', Object)
    ], MdProgressBar.prototype, "mode", void 0);
    MdProgressBar = __decorate$40([
        _angular_core.Component({selector: 'md-progress-bar, mat-progress-bar',
            host: {
                'role': 'progressbar',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
            },
            template: "<div class=\"md-progress-bar-background\"></div><div class=\"md-progress-bar-buffer\" [ngstyle]=\"_bufferTransform()\"></div><div class=\"md-progress-bar-primary md-progress-bar-fill\" [ngstyle]=\"_primaryTransform()\"></div><div class=\"md-progress-bar-secondary md-progress-bar-fill\"></div>",
            styles: [":host{display:block;height:5px;overflow:hidden;position:relative;transform:translateZ(0);transition:opacity 250ms linear;width:100%}:host .md-progress-bar-background{background-repeat:repeat-x;background-size:10px 4px;height:100%;position:absolute;visibility:hidden;width:100%}:host .md-progress-bar-buffer{height:100%;position:absolute;transform-origin:top left;transition:transform 250ms ease;width:100%}:host .md-progress-bar-secondary{visibility:hidden}:host .md-progress-bar-fill{animation:none;height:100%;position:absolute;transform-origin:top left;transition:transform 250ms ease;width:100%}:host .md-progress-bar-fill::after{animation:none;content:'';display:inline-block;height:100%;position:absolute;width:100%;left:0}:host[mode=query]{transform:rotateZ(180deg)}:host[mode=query] .md-progress-bar-fill,:host[mode=indeterminate] .md-progress-bar-fill{transition:none}:host[mode=query] .md-progress-bar-primary,:host[mode=indeterminate] .md-progress-bar-primary{animation:md-progress-bar-primary-indeterminate-translate 2s infinite linear;left:-145.166611%}:host[mode=query] .md-progress-bar-primary.md-progress-bar-fill::after,:host[mode=indeterminate] .md-progress-bar-primary.md-progress-bar-fill::after{animation:md-progress-bar-primary-indeterminate-scale 2s infinite linear}:host[mode=query] .md-progress-bar-secondary,:host[mode=indeterminate] .md-progress-bar-secondary{animation:md-progress-bar-secondary-indeterminate-translate 2s infinite linear;left:-54.888891%;visibility:visible}:host[mode=query] .md-progress-bar-secondary.md-progress-bar-fill::after,:host[mode=indeterminate] .md-progress-bar-secondary.md-progress-bar-fill::after{animation:md-progress-bar-secondary-indeterminate-scale 2s infinite linear}:host[mode=buffer] .md-progress-bar-background{animation:md-progress-bar-background-scroll 250ms infinite linear;visibility:visible}:host-context([dir=rtl]){transform:rotateY(180deg)}@keyframes md-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.70173,.49582);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);transform:translateX(83.67142%)}100%{transform:translateX(200.61106%)}}@keyframes md-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.33473,.12482,.78584,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.66148)}100%{transform:scaleX(.08)}}@keyframes md-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:translateX(37.65191%)}48.35%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:translateX(84.38617%)}100%{transform:translateX(160.27778%)}}@keyframes md-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:scaleX(.4571)}44.15%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes md-progress-bar-background-scroll{to{transform:translateX(-10px)}}"],
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata$40('design:paramtypes', [])
    ], MdProgressBar);
    return MdProgressBar;
}());
/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp$1(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
var MdProgressBarModule = (function () {
    function MdProgressBarModule() {
    }
    MdProgressBarModule.forRoot = function () {
        return {
            ngModule: MdProgressBarModule,
            providers: []
        };
    };
    MdProgressBarModule = __decorate$40([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, DefaultStyleCompatibilityModeModule],
            exports: [MdProgressBar, DefaultStyleCompatibilityModeModule],
            declarations: [MdProgressBar],
        }), 
        __metadata$40('design:paramtypes', [])
    ], MdProgressBarModule);
    return MdProgressBarModule;
}());

var __decorate$41 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$41 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Directive to automatically resize a textarea to fit its content.
 */
var MdTextareaAutosize = (function () {
    function MdTextareaAutosize(_elementRef) {
        this._elementRef = _elementRef;
    }
    Object.defineProperty(MdTextareaAutosize.prototype, "_minHeight", {
        /** The minimum height of the textarea as determined by minRows. */
        get: function () {
            return this.minRows ? this.minRows * this._cachedLineHeight + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTextareaAutosize.prototype, "_maxHeight", {
        /** The maximum height of the textarea as determined by maxRows. */
        get: function () {
            return this.maxRows ? this.maxRows * this._cachedLineHeight + "px" : null;
        },
        enumerable: true,
        configurable: true
    });
    MdTextareaAutosize.prototype.ngOnInit = function () {
        this._cacheTextareaLineHeight();
        this.resizeToFitContent();
    };
    /**
     * Cache the height of a single-row textarea.
     *
     * We need to know how large a single "row" of a textarea is in order to apply minRows and
     * maxRows. For the initial version, we will assume that the height of a single line in the
     * textarea does not ever change.
     */
    MdTextareaAutosize.prototype._cacheTextareaLineHeight = function () {
        var textarea = this._elementRef.nativeElement;
        // Use a clone element because we have to override some styles.
        var textareaClone = textarea.cloneNode(false);
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        textarea.parentNode.appendChild(textareaClone);
        this._cachedLineHeight = textareaClone.offsetHeight;
        textarea.parentNode.removeChild(textareaClone);
    };
    /** Resize the textarea to fit its content. */
    MdTextareaAutosize.prototype.resizeToFitContent = function () {
        var textarea = this._elementRef.nativeElement;
        // Reset the textarea height to auto in order to shrink back to its default size.
        textarea.style.height = 'auto';
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = textarea.scrollHeight + "px";
    };
    __decorate$41([
        _angular_core.Input(), 
        __metadata$41('design:type', Number)
    ], MdTextareaAutosize.prototype, "minRows", void 0);
    __decorate$41([
        _angular_core.Input(), 
        __metadata$41('design:type', Number)
    ], MdTextareaAutosize.prototype, "maxRows", void 0);
    MdTextareaAutosize = __decorate$41([
        _angular_core.Directive({
            selector: 'textarea[md-autosize], textarea[mat-autosize]',
            host: {
                '(input)': 'resizeToFitContent()',
                '[style.min-height]': '_minHeight',
                '[style.max-height]': '_maxHeight',
            },
        }), 
        __metadata$41('design:paramtypes', [_angular_core.ElementRef])
    ], MdTextareaAutosize);
    return MdTextareaAutosize;
}());

var __extends$14 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MdInputContainerPlaceholderConflictError = (function (_super) {
    __extends$14(MdInputContainerPlaceholderConflictError, _super);
    function MdInputContainerPlaceholderConflictError() {
        _super.call(this, 'Placeholder attribute and child element were both specified.');
    }
    return MdInputContainerPlaceholderConflictError;
}(MdError));
var MdInputContainerUnsupportedTypeError = (function (_super) {
    __extends$14(MdInputContainerUnsupportedTypeError, _super);
    function MdInputContainerUnsupportedTypeError(type) {
        _super.call(this, "Input type \"" + type + "\" isn't supported by md-input-container.");
    }
    return MdInputContainerUnsupportedTypeError;
}(MdError));
var MdInputContainerDuplicatedHintError = (function (_super) {
    __extends$14(MdInputContainerDuplicatedHintError, _super);
    function MdInputContainerDuplicatedHintError(align) {
        _super.call(this, "A hint was already declared for 'align=\"" + align + "\"'.");
    }
    return MdInputContainerDuplicatedHintError;
}(MdError));
var MdInputContainerMissingMdInputError = (function (_super) {
    __extends$14(MdInputContainerMissingMdInputError, _super);
    function MdInputContainerMissingMdInputError() {
        _super.call(this, 'md-input-container must contain an md-input directive. Did you forget to add md-input ' +
            'to the native input or textarea element?');
    }
    return MdInputContainerMissingMdInputError;
}(MdError));

var __decorate$43 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$43 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$9 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// Invalid input type. Using one of these will throw an MdInputContainerUnsupportedTypeError.
var MD_INPUT_INVALID_TYPES = [
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit'
];
var nextUniqueId$2 = 0;
/**
 * The placeholder directive. The content can declare this to implement more
 * complex placeholders.
 */
var MdPlaceholder = (function () {
    function MdPlaceholder() {
    }
    MdPlaceholder = __decorate$43([
        _angular_core.Directive({
            selector: 'md-placeholder, mat-placeholder'
        }), 
        __metadata$43('design:paramtypes', [])
    ], MdPlaceholder);
    return MdPlaceholder;
}());
/** The hint directive, used to tag content as hint labels (going under the input). */
var MdHint = (function () {
    function MdHint() {
        // Whether to align the hint label at the start or end of the line.
        this.align = 'start';
    }
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdHint.prototype, "align", void 0);
    MdHint = __decorate$43([
        _angular_core.Directive({
            selector: 'md-hint, mat-hint',
            host: {
                'class': 'md-hint',
                '[class.md-right]': 'align == "end"',
            }
        }), 
        __metadata$43('design:paramtypes', [])
    ], MdHint);
    return MdHint;
}());
/** The input directive, used to mark the input that `MdInputContainer` is wrapping. */
var MdInputDirective = (function () {
    function MdInputDirective(_elementRef, _renderer, _ngControl) {
        var _this = this;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngControl = _ngControl;
        this._disabled = false;
        this._placeholder = '';
        this._required = false;
        this._type = 'text';
        /**
         * Emits an event when the placeholder changes so that the `md-input-container` can re-validate.
         */
        this._placeholderChange = new _angular_core.EventEmitter();
        this.focused = false;
        this._neverEmptyInputTypes = [
            'date',
            'datetime',
            'datetime-local',
            'month',
            'time',
            'week'
        ].filter(function (t) { return getSupportedInputTypes().has(t); });
        // Force setter to be called in case id was not specified.
        this.id = this.id;
        if (this._ngControl && this._ngControl.valueChanges) {
            this._ngControl.valueChanges.subscribe(function (value) {
                _this.value = value;
            });
        }
    }
    Object.defineProperty(MdInputDirective.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value || this._uid; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInputDirective.prototype, "placeholder", {
        get: function () { return this._placeholder; },
        set: function (value) {
            if (this._placeholder != value) {
                this._placeholder = value;
                this._placeholderChange.emit(this._placeholder);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "type", {
        get: function () { return this._type; },
        set: function (value) {
            this._type = value || 'text';
            this._validateType();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "empty", {
        get: function () { return (this.value == null || this.value === '') && !this._isNeverEmpty(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputDirective.prototype, "_uid", {
        get: function () { return this._cachedUid = this._cachedUid || "md-input-" + nextUniqueId$2++; },
        enumerable: true,
        configurable: true
    });
    MdInputDirective.prototype.ngAfterContentInit = function () {
        this.value = this._elementRef.nativeElement.value;
    };
    /** Focus the input element. */
    MdInputDirective.prototype.focus = function () { this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus'); };
    MdInputDirective.prototype._onFocus = function () { this.focused = true; };
    MdInputDirective.prototype._onBlur = function () { this.focused = false; };
    MdInputDirective.prototype._onInput = function () { this.value = this._elementRef.nativeElement.value; };
    /** Make sure the input is a supported type. */
    MdInputDirective.prototype._validateType = function () {
        if (MD_INPUT_INVALID_TYPES.indexOf(this._type) != -1) {
            throw new MdInputContainerUnsupportedTypeError(this._type);
        }
    };
    MdInputDirective.prototype._isNeverEmpty = function () { return this._neverEmptyInputTypes.indexOf(this._type) != -1; };
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "disabled", null);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "id", null);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "placeholder", null);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "required", null);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "type", null);
    __decorate$43([
        _angular_core.Output(), 
        __metadata$43('design:type', Object)
    ], MdInputDirective.prototype, "_placeholderChange", void 0);
    MdInputDirective = __decorate$43([
        _angular_core.Directive({
            selector: 'input[md-input], textarea[md-input], input[mat-input], textarea[mat-input]',
            host: {
                'class': 'md-input-element',
                '[id]': 'id',
                '(blur)': '_onBlur()',
                '(focus)': '_onFocus()',
                '(input)': '_onInput()',
            }
        }),
        __param$9(2, _angular_core.Optional()), 
        __metadata$43('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer, _angular_forms.NgControl])
    ], MdInputDirective);
    return MdInputDirective;
}());
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
var MdInputContainer = (function () {
    function MdInputContainer() {
        this.align = 'start';
        this.dividerColor = 'primary';
        this._hintLabel = '';
        this._floatingPlaceholder = true;
    }
    Object.defineProperty(MdInputContainer.prototype, "hintLabel", {
        get: function () { return this._hintLabel; },
        set: function (value) {
            this._hintLabel = value;
            this._validateHints();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInputContainer.prototype, "floatingPlaceholder", {
        get: function () { return this._floatingPlaceholder; },
        set: function (value) { this._floatingPlaceholder = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MdInputContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!this._mdInputChild) {
            throw new MdInputContainerMissingMdInputError();
        }
        this._validateHints();
        this._validatePlaceholders();
        // Re-validate when things change.
        this._hintChildren.changes.subscribe(function () {
            _this._validateHints();
        });
        this._mdInputChild._placeholderChange.subscribe(function () {
            _this._validatePlaceholders();
        });
    };
    MdInputContainer.prototype._isUntouched = function () { return this._hasNgControl() && this._mdInputChild._ngControl.untouched; };
    MdInputContainer.prototype._isTouched = function () { return this._hasNgControl() && this._mdInputChild._ngControl.touched; };
    MdInputContainer.prototype._isPristine = function () { return this._hasNgControl() && this._mdInputChild._ngControl.pristine; };
    MdInputContainer.prototype._isDirty = function () { return this._hasNgControl() && this._mdInputChild._ngControl.dirty; };
    MdInputContainer.prototype._isValid = function () { return this._hasNgControl() && this._mdInputChild._ngControl.valid; };
    MdInputContainer.prototype._isInvalid = function () { return this._hasNgControl() && this._mdInputChild._ngControl.invalid; };
    MdInputContainer.prototype._isPending = function () { return this._hasNgControl() && this._mdInputChild._ngControl.pending; };
    /** Whether the input has a placeholder. */
    MdInputContainer.prototype._hasPlaceholder = function () { return !!(this._mdInputChild.placeholder || this._placeholderChild); };
    MdInputContainer.prototype._focusInput = function () { this._mdInputChild.focus(); };
    MdInputContainer.prototype._hasNgControl = function () { return !!(this._mdInputChild && this._mdInputChild._ngControl); };
    /**
     * Ensure that there is only one placeholder (either `input` attribute or child element with the
     * `md-placeholder` attribute.
     */
    MdInputContainer.prototype._validatePlaceholders = function () {
        if (this._mdInputChild.placeholder && this._placeholderChild) {
            throw new MdInputContainerPlaceholderConflictError();
        }
    };
    /**
     * Ensure that there is a maximum of one of each `<md-hint>` alignment specified, with the
     * attribute being considered as `align="start"`.
     */
    MdInputContainer.prototype._validateHints = function () {
        var _this = this;
        if (this._hintChildren) {
            var startHint_1 = null;
            var endHint_1 = null;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw new MdInputContainerDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw new MdInputContainerDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputContainer.prototype, "align", void 0);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputContainer.prototype, "dividerColor", void 0);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Object)
    ], MdInputContainer.prototype, "hintLabel", null);
    __decorate$43([
        _angular_core.Input(), 
        __metadata$43('design:type', Boolean)
    ], MdInputContainer.prototype, "floatingPlaceholder", null);
    __decorate$43([
        _angular_core.ContentChild(MdInputDirective), 
        __metadata$43('design:type', MdInputDirective)
    ], MdInputContainer.prototype, "_mdInputChild", void 0);
    __decorate$43([
        _angular_core.ContentChild(MdPlaceholder), 
        __metadata$43('design:type', MdPlaceholder)
    ], MdInputContainer.prototype, "_placeholderChild", void 0);
    __decorate$43([
        _angular_core.ContentChildren(MdHint), 
        __metadata$43('design:type', _angular_core.QueryList)
    ], MdInputContainer.prototype, "_hintChildren", void 0);
    MdInputContainer = __decorate$43([
        _angular_core.Component({selector: 'md-input-container, mat-input-container',
            template: "<div class=\"md-input-wrapper\"><div class=\"md-input-table\"><div class=\"md-input-prefix\"><ng-content select=\"[md-prefix]\"></ng-content></div><div class=\"md-input-infix\" [class.md-end]=\"align == 'end'\"><ng-content selector=\"input, textarea\"></ng-content><label class=\"md-input-placeholder\" [attr.for]=\"_mdInputChild.id\" [class.md-empty]=\"_mdInputChild.empty\" [class.md-focused]=\"_mdInputChild.focused\" [class.md-float]=\"floatingPlaceholder\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\" *ngif=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder\"></ng-content>{{_mdInputChild.placeholder}} <span class=\"md-placeholder-required\" *ngif=\"_mdInputChild.required\">*</span></label></div><div class=\"md-input-suffix\"><ng-content select=\"[md-suffix]\"></ng-content></div></div><div class=\"md-input-underline\" [class.md-disabled]=\"_mdInputChild.disabled\"><span class=\"md-input-ripple\" [class.md-focused]=\"_mdInputChild.focused\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\"></span></div><div *ngif=\"hintLabel != ''\" class=\"md-hint\">{{hintLabel}}</div><ng-content select=\"md-hint\"></ng-content></div>",
            styles: ["md-input,md-textarea{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.md-input-element.md-end,[dir=rtl] md-input,[dir=rtl] md-textarea{text-align:right}.md-input-wrapper{margin:16px 0}.md-input-table{display:inline-table;flex-flow:column;vertical-align:bottom;width:100%}.md-input-table>*{display:table-cell}.md-input-infix{position:relative}.md-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;width:100%}[dir=rtl] .md-input-element.md-end{text-align:left}.md-input-element:-moz-ui-invalid{box-shadow:none}.md-input-element:-webkit-autofill+.md-input-placeholder.md-float{display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}.md-input-placeholder{position:absolute;left:0;top:0;font-size:100%;pointer-events:none;z-index:1;width:100%;display:none;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;transform:translateY(0);transform-origin:bottom left;transition:transform .4s cubic-bezier(.25,.8,.25,1),scale .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.md-input-placeholder.md-empty{display:block;cursor:text}.md-input-placeholder.md-float.md-focused,.md-input-placeholder.md-float:not(.md-empty){display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}[dir=rtl] .md-input-placeholder{transform-origin:bottom right;left:auto;right:0}.md-input-underline{position:absolute;height:1px;width:100%;margin-top:4px;border-top-width:1px;border-top-style:solid}.md-input-underline.md-disabled{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-top:0;background-position:0}.md-input-underline .md-input-ripple{position:absolute;height:2px;z-index:1;top:-1px;width:100%;transform-origin:top;opacity:0;transform:scaleY(0);transition:transform .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.md-input-underline .md-input-ripple.md-focused{opacity:1;transform:scaleY(1)}.md-hint{display:block;position:absolute;font-size:75%;bottom:-.5em}.md-hint.md-right{right:0}[dir=rtl] .md-hint{right:0;left:auto}[dir=rtl] .md-hint.md-right{right:auto;left:0}",
"md-input-container{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.md-end .md-input-element,[dir=rtl] md-input-container{text-align:right}.md-input-element::-webkit-input-placeholder{visibility:hidden}.md-input-element::-moz-placeholder{visibility:hidden}.md-input-element:-ms-input-placeholder{visibility:hidden}.md-input-element::placeholder{visibility:hidden}[dir=rtl] .md-end .md-input-element{text-align:left}"],
            host: {
                // Remove align attribute to prevent it from interfering with layout.
                '[attr.align]': 'null',
                '[class.ng-untouched]': '_isUntouched()',
                '[class.ng-touched]': '_isTouched()',
                '[class.ng-pristine]': '_isPristine()',
                '[class.ng-dirty]': '_isDirty()',
                '[class.ng-valid]': '_isValid()',
                '[class.ng-invalid]': '_isInvalid()',
                '[class.ng-pending]': '_isPending()',
                '(click)': '_focusInput()',
            },
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$43('design:paramtypes', [])
    ], MdInputContainer);
    return MdInputContainer;
}());

var __extends$13 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$42 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$42 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var noop = function () { };
var MD_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: _angular_forms.NG_VALUE_ACCESSOR,
    useExisting: _angular_core.forwardRef(function () { return MdInput; }),
    multi: true
};
// Invalid input type. Using one of these will throw an MdInputUnsupportedTypeError.
var MD_INPUT_INVALID_INPUT_TYPE = [
    'file',
    'radio',
    'checkbox',
];
var nextUniqueId$1 = 0;
var MdInputPlaceholderConflictError = (function (_super) {
    __extends$13(MdInputPlaceholderConflictError, _super);
    function MdInputPlaceholderConflictError() {
        _super.call(this, 'Placeholder attribute and child element were both specified.');
    }
    return MdInputPlaceholderConflictError;
}(MdError));
var MdInputUnsupportedTypeError = (function (_super) {
    __extends$13(MdInputUnsupportedTypeError, _super);
    function MdInputUnsupportedTypeError(type) {
        _super.call(this, "Input type \"" + type + "\" isn't supported by md-input.");
    }
    return MdInputUnsupportedTypeError;
}(MdError));
var MdInputDuplicatedHintError = (function (_super) {
    __extends$13(MdInputDuplicatedHintError, _super);
    function MdInputDuplicatedHintError(align) {
        _super.call(this, "A hint was already declared for 'align=\"" + align + "\"'.");
    }
    return MdInputDuplicatedHintError;
}(MdError));
/**
 * Component that represents a text input. It encapsulates the <input> HTMLElement and
 * improve on its behaviour, along with styling it according to the Material Design.
 */
var MdInput = (function () {
    function MdInput(elementRef, _renderer) {
        this._renderer = _renderer;
        this._focused = false;
        this._value = '';
        /** Callback registered via registerOnTouched (ControlValueAccessor) */
        this._onTouchedCallback = noop;
        /** Callback registered via registerOnChange (ControlValueAccessor) */
        this._onChangeCallback = noop;
        /**
         * Bindings.
         */
        this.align = 'start';
        this.dividerColor = 'primary';
        this.hintLabel = '';
        this.id = "md-input-" + nextUniqueId$1++;
        this.list = null;
        this.max = null;
        this.maxlength = null;
        this.min = null;
        this.minlength = null;
        this.placeholder = null;
        this.step = null;
        this.tabindex = null;
        this.type = 'text';
        this.name = null;
        // textarea-specific
        this.rows = null;
        this.cols = null;
        this.wrap = null;
        this._floatingPlaceholder = true;
        this._autofocus = false;
        this._disabled = false;
        this._readonly = false;
        this._required = false;
        this._spellcheck = false;
        this._blurEmitter = new _angular_core.EventEmitter();
        this._focusEmitter = new _angular_core.EventEmitter();
        // Set the element type depending on normalized selector used(md-input / md-textarea)
        this._elementType = elementRef.nativeElement.nodeName.toLowerCase() === 'md-input' ?
            'input' :
            'textarea';
    }
    Object.defineProperty(MdInput.prototype, "ariaDisabled", {
        get: function () { return this._ariaDisabled; },
        set: function (value) { this._ariaDisabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "ariaRequired", {
        get: function () { return this._ariaRequired; },
        set: function (value) { this._ariaRequired = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "ariaInvalid", {
        get: function () { return this._ariaInvalid; },
        set: function (value) { this._ariaInvalid = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "focused", {
        /** Readonly properties. */
        get: function () { return this._focused; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "empty", {
        get: function () { return (this._value == null || this._value === '') && this.type !== 'date'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "characterCount", {
        get: function () {
            return this.empty ? 0 : ('' + this._value).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "inputId", {
        get: function () { return this.id + "-input"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "floatingPlaceholder", {
        get: function () { return this._floatingPlaceholder; },
        set: function (value) { this._floatingPlaceholder = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "autofocus", {
        get: function () { return this._autofocus; },
        set: function (value) { this._autofocus = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "readonly", {
        get: function () { return this._readonly; },
        set: function (value) { this._readonly = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "spellcheck", {
        get: function () { return this._spellcheck; },
        set: function (value) { this._spellcheck = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "onBlur", {
        get: function () {
            return this._blurEmitter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "onFocus", {
        get: function () {
            return this._focusEmitter.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdInput.prototype, "value", {
        get: function () { return this._value; },
        set: function (v) {
            v = this._convertValueForInputType(v);
            if (v !== this._value) {
                this._value = v;
                this._onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(MdInput.prototype, "_align", {
        // This is to remove the `align` property of the `md-input` itself. Otherwise HTML5
        // might place it as RTL when we don't want to. We still want to use `align` as an
        // Input though, so we use HostBinding.
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    /** Set focus on input */
    MdInput.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, 'focus');
    };
    MdInput.prototype._handleFocus = function (event) {
        this._focused = true;
        this._focusEmitter.emit(event);
    };
    MdInput.prototype._handleBlur = function (event) {
        this._focused = false;
        this._onTouchedCallback();
        this._blurEmitter.emit(event);
    };
    MdInput.prototype._handleChange = function (event) {
        this.value = event.target.value;
        this._onTouchedCallback();
    };
    MdInput.prototype._hasPlaceholder = function () {
        return !!this.placeholder || this._placeholderChild != null;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdInput.prototype.writeValue = function (value) {
        this._value = value;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdInput.prototype.registerOnChange = function (fn) {
        this._onChangeCallback = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    MdInput.prototype.registerOnTouched = function (fn) {
        this._onTouchedCallback = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    MdInput.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    MdInput.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._validateConstraints();
        // Trigger validation when the hint children change.
        this._hintChildren.changes.subscribe(function () {
            _this._validateConstraints();
        });
    };
    MdInput.prototype.ngOnChanges = function (changes) {
        this._validateConstraints();
    };
    /**
     * Convert the value passed in to a value that is expected from the type of the md-input.
     * This is normally performed by the *_VALUE_ACCESSOR in forms, but since the type is bound
     * on our internal input it won't work locally.
     * @private
     */
    MdInput.prototype._convertValueForInputType = function (v) {
        switch (this.type) {
            case 'number': return parseFloat(v);
            default: return v;
        }
    };
    /**
     * Ensure that all constraints defined by the API are validated, or throw errors otherwise.
     * Constraints for now:
     *   - placeholder attribute and <md-placeholder> are mutually exclusive.
     *   - type attribute is not one of the forbidden types (see constant at the top).
     *   - Maximum one of each `<md-hint>` alignment specified, with the attribute being
     *     considered as align="start".
     * @private
     */
    MdInput.prototype._validateConstraints = function () {
        var _this = this;
        if (this.placeholder != '' && this.placeholder != null && this._placeholderChild != null) {
            throw new MdInputPlaceholderConflictError();
        }
        if (MD_INPUT_INVALID_INPUT_TYPE.indexOf(this.type) != -1) {
            throw new MdInputUnsupportedTypeError(this.type);
        }
        if (this._hintChildren) {
            // Validate the hint labels.
            var startHint_1 = null;
            var endHint_1 = null;
            this._hintChildren.forEach(function (hint) {
                if (hint.align == 'start') {
                    if (startHint_1 || _this.hintLabel) {
                        throw new MdInputDuplicatedHintError('start');
                    }
                    startHint_1 = hint;
                }
                else if (hint.align == 'end') {
                    if (endHint_1) {
                        throw new MdInputDuplicatedHintError('end');
                    }
                    endHint_1 = hint;
                }
            });
        }
    };
    __decorate$42([
        _angular_core.Input('aria-label'), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "ariaLabel", void 0);
    __decorate$42([
        _angular_core.Input('aria-labelledby'), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "ariaLabelledBy", void 0);
    __decorate$42([
        _angular_core.Input('aria-disabled'), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "ariaDisabled", null);
    __decorate$42([
        _angular_core.Input('aria-required'), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "ariaRequired", null);
    __decorate$42([
        _angular_core.Input('aria-invalid'), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "ariaInvalid", null);
    __decorate$42([
        _angular_core.ContentChild(MdPlaceholder), 
        __metadata$42('design:type', MdPlaceholder)
    ], MdInput.prototype, "_placeholderChild", void 0);
    __decorate$42([
        _angular_core.ContentChildren(MdHint), 
        __metadata$42('design:type', _angular_core.QueryList)
    ], MdInput.prototype, "_hintChildren", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "align", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "dividerColor", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "hintLabel", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "autocomplete", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "autocorrect", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "autocapitalize", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "id", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "list", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "max", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "maxlength", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "min", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "minlength", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "placeholder", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "step", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "tabindex", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "type", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', String)
    ], MdInput.prototype, "name", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "rows", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Number)
    ], MdInput.prototype, "cols", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "wrap", void 0);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "floatingPlaceholder", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "autofocus", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "disabled", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "readonly", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "required", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Boolean)
    ], MdInput.prototype, "spellcheck", null);
    __decorate$42([
        _angular_core.Output('blur'), 
        __metadata$42('design:type', rxjs_Observable.Observable)
    ], MdInput.prototype, "onBlur", null);
    __decorate$42([
        _angular_core.Output('focus'), 
        __metadata$42('design:type', rxjs_Observable.Observable)
    ], MdInput.prototype, "onFocus", null);
    __decorate$42([
        _angular_core.Input(), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "value", null);
    __decorate$42([
        _angular_core.HostBinding('attr.align'), 
        __metadata$42('design:type', Object)
    ], MdInput.prototype, "_align", null);
    __decorate$42([
        _angular_core.ViewChild('input'), 
        __metadata$42('design:type', _angular_core.ElementRef)
    ], MdInput.prototype, "_inputElement", void 0);
    MdInput = __decorate$42([
        _angular_core.Component({selector: 'md-input, md-textarea',
            template: "<div class=\"md-input-wrapper\"><div class=\"md-input-table\"><div class=\"md-input-prefix\"><ng-content select=\"[md-prefix]\"></ng-content></div><div class=\"md-input-infix\"><input #input *ngif=\"_elementType === 'input'\" class=\"md-input-element\" [class.md-end]=\"align == 'end'\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.aria-disabled]=\"ariaDisabled\" [attr.aria-required]=\"ariaRequired\" [attr.aria-invalid]=\"ariaInvalid\" [attr.autocomplete]=\"autocomplete\" [attr.autocorrect]=\"autocorrect\" [attr.autocapitalize]=\"autocapitalize\" [autofocus]=\"autofocus\" [disabled]=\"disabled\" [id]=\"inputId\" [attr.list]=\"list\" [attr.max]=\"max\" [attr.maxlength]=\"maxlength\" [attr.min]=\"min\" [attr.minlength]=\"minlength\" [readonly]=\"readonly\" [required]=\"required\" [spellcheck]=\"spellcheck\" [attr.step]=\"step\" [attr.tabindex]=\"tabindex\" [type]=\"type\" [attr.name]=\"name\" (focus)=\"_handleFocus($event)\" (blur)=\"_handleBlur($event)\" [(ngmodel)]=\"value\" (change)=\"_handleChange($event)\"><textarea #input *ngif=\"_elementType === 'textarea'\" class=\"md-input-element md-input-element-textarea\" [class.md-end]=\"align == 'end'\" [attr.aria-label]=\"ariaLabel\" [attr.aria-labelledby]=\"ariaLabelledBy\" [attr.aria-disabled]=\"ariaDisabled\" [attr.aria-required]=\"ariaRequired\" [attr.aria-invalid]=\"ariaInvalid\" [attr.autocomplete]=\"autocomplete\" [attr.autocapitalize]=\"autocapitalize\" [attr.cols]=\"cols\" [attr.rows]=\"rows\" [attr.wrap]=\"wrap\" [autofocus]=\"autofocus\" [disabled]=\"disabled\" [id]=\"inputId\" [attr.maxlength]=\"maxlength\" [attr.minlength]=\"minlength\" [readonly]=\"readonly\" [required]=\"required\" [spellcheck]=\"spellcheck\" [attr.tabindex]=\"tabindex\" [attr.name]=\"name\" (focus)=\"_handleFocus($event)\" (blur)=\"_handleBlur($event)\" [(ngmodel)]=\"value\" (change)=\"_handleChange($event)\"></textarea><label class=\"md-input-placeholder\" [attr.for]=\"inputId\" [class.md-empty]=\"empty\" [class.md-focused]=\"focused\" [class.md-float]=\"floatingPlaceholder\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\" *ngif=\"_hasPlaceholder()\"><ng-content select=\"md-placeholder\"></ng-content>{{placeholder}} <span class=\"md-placeholder-required\" *ngif=\"required\">*</span></label></div><div class=\"md-input-suffix\"><ng-content select=\"[md-suffix]\"></ng-content></div></div><div class=\"md-input-underline\" [class.md-disabled]=\"disabled\"><span class=\"md-input-ripple\" [class.md-focused]=\"focused\" [class.md-accent]=\"dividerColor == 'accent'\" [class.md-warn]=\"dividerColor == 'warn'\"></span></div><div *ngif=\"hintLabel != ''\" class=\"md-hint\">{{hintLabel}}</div><ng-content select=\"md-hint\"></ng-content></div>",
            styles: ["md-input,md-textarea{display:inline-block;position:relative;font-family:Roboto,\"Helvetica Neue\",sans-serif;line-height:normal;text-align:left}.md-input-element.md-end,[dir=rtl] md-input,[dir=rtl] md-textarea{text-align:right}.md-input-wrapper{margin:16px 0}.md-input-table{display:inline-table;flex-flow:column;vertical-align:bottom;width:100%}.md-input-table>*{display:table-cell}.md-input-infix{position:relative}.md-input-element{font:inherit;background:0 0;color:currentColor;border:none;outline:0;padding:0;width:100%}[dir=rtl] .md-input-element.md-end{text-align:left}.md-input-element:-moz-ui-invalid{box-shadow:none}.md-input-element:-webkit-autofill+.md-input-placeholder.md-float{display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}.md-input-placeholder{position:absolute;left:0;top:0;font-size:100%;pointer-events:none;z-index:1;width:100%;display:none;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;transform:translateY(0);transform-origin:bottom left;transition:transform .4s cubic-bezier(.25,.8,.25,1),scale .4s cubic-bezier(.25,.8,.25,1),color .4s cubic-bezier(.25,.8,.25,1),width .4s cubic-bezier(.25,.8,.25,1)}.md-input-placeholder.md-empty{display:block;cursor:text}.md-input-placeholder.md-float.md-focused,.md-input-placeholder.md-float:not(.md-empty){display:block;padding-bottom:5px;transform:translateY(-100%) scale(.75);width:133.33333%}[dir=rtl] .md-input-placeholder{transform-origin:bottom right;left:auto;right:0}.md-input-underline{position:absolute;height:1px;width:100%;margin-top:4px;border-top-width:1px;border-top-style:solid}.md-input-underline.md-disabled{background-image:linear-gradient(to right,rgba(0,0,0,.26) 0,rgba(0,0,0,.26) 33%,transparent 0);background-size:4px 1px;background-repeat:repeat-x;border-top:0;background-position:0}.md-input-underline .md-input-ripple{position:absolute;height:2px;z-index:1;top:-1px;width:100%;transform-origin:top;opacity:0;transform:scaleY(0);transition:transform .4s cubic-bezier(.25,.8,.25,1),opacity .4s cubic-bezier(.25,.8,.25,1)}.md-input-underline .md-input-ripple.md-focused{opacity:1;transform:scaleY(1)}.md-hint{display:block;position:absolute;font-size:75%;bottom:-.5em}.md-hint.md-right{right:0}[dir=rtl] .md-hint{right:0;left:auto}[dir=rtl] .md-hint.md-right{right:auto;left:0}"],
            providers: [MD_INPUT_CONTROL_VALUE_ACCESSOR],
            host: { '(click)': 'focus()' },
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$42('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdInput);
    return MdInput;
}());
var MdInputModule = (function () {
    function MdInputModule() {
    }
    MdInputModule.forRoot = function () {
        return {
            ngModule: MdInputModule,
            providers: PlatformModule.forRoot().providers,
        };
    };
    MdInputModule = __decorate$42([
        _angular_core.NgModule({
            declarations: [
                MdInput,
                MdPlaceholder,
                MdInputContainer,
                MdHint,
                MdTextareaAutosize,
                MdInputDirective
            ],
            imports: [
                _angular_common.CommonModule,
                _angular_forms.FormsModule,
                PlatformModule,
            ],
            exports: [
                MdInput,
                MdPlaceholder,
                MdInputContainer,
                MdHint,
                MdTextareaAutosize,
                MdInputDirective
            ],
        }), 
        __metadata$42('design:paramtypes', [])
    ], MdInputModule);
    return MdInputModule;
}());

/**
 * Configuration used when opening a snack-bar.
 */
var MdSnackBarConfig = (function () {
    function MdSnackBarConfig() {
        /** The politeness level for the MdAriaLiveAnnouncer announcement. */
        this.politeness = 'assertive';
        /** Message to be announced by the MdAriaLiveAnnouncer */
        this.announcementMessage = '';
        /** The view container to place the overlay for the snack bar into. */
        this.viewContainerRef = null;
        /** The length of time in milliseconds to wait before automatically dismissing the snack bar. */
        this.duration = 0;
    }
    return MdSnackBarConfig;
}());

// TODO(josephperrott): Implement onAction observable.
/**
 * Reference to a snack bar dispatched from the snack bar service.
 */
var MdSnackBarRef = (function () {
    function MdSnackBarRef(instance, containerInstance, _overlayRef) {
        var _this = this;
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the snack bar has closed. */
        this._afterClosed = new rxjs_Subject.Subject();
        /** Subject for notifying the user that the snack bar action was called. */
        this._onAction = new rxjs_Subject.Subject();
        // Sets the readonly instance of the snack bar content component.
        this.instance = instance;
        this.containerInstance = containerInstance;
        // Dismiss snackbar on action.
        this.onAction().subscribe(function () { return _this.dismiss(); });
        containerInstance._onExit().subscribe(function () { return _this._finishDismiss(); });
    }
    /** Dismisses the snack bar. */
    MdSnackBarRef.prototype.dismiss = function () {
        if (!this._afterClosed.closed) {
            this.containerInstance.exit();
        }
    };
    /** Marks the snackbar action clicked. */
    MdSnackBarRef.prototype._action = function () {
        if (!this._onAction.closed) {
            this._onAction.next();
            this._onAction.complete();
        }
    };
    /** Marks the snackbar as opened */
    MdSnackBarRef.prototype._open = function () {
        if (!this._afterOpened.closed) {
            this._afterOpened.next();
            this._afterOpened.complete();
        }
    };
    /** Cleans up the DOM after closing. */
    MdSnackBarRef.prototype._finishDismiss = function () {
        this._overlayRef.dispose();
        this._afterClosed.next();
        this._afterClosed.complete();
    };
    /** Gets an observable that is notified when the snack bar is finished closing. */
    MdSnackBarRef.prototype.afterDismissed = function () {
        return this._afterClosed.asObservable();
    };
    /** Gets an observable that is notified when the snack bar has opened and appeared. */
    MdSnackBarRef.prototype.afterOpened = function () {
        return this.containerInstance._onEnter();
    };
    /** Gets an observable that is notified when the snack bar action is called. */
    MdSnackBarRef.prototype.onAction = function () {
        return this._onAction.asObservable();
    };
    return MdSnackBarRef;
}());

var __extends$16 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MdSnackBarContentAlreadyAttached = (function (_super) {
    __extends$16(MdSnackBarContentAlreadyAttached, _super);
    function MdSnackBarContentAlreadyAttached() {
        _super.call(this, 'Attempting to attach snack bar content after content is already attached');
    }
    return MdSnackBarContentAlreadyAttached;
}(MdError));

var __extends$15 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$45 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$45 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// TODO(jelbourn): we can't use constants from animation.ts here because you can't use
// a text interpolation in anything that is analyzed statically with ngc (for AoT compile).
var SHOW_ANIMATION = '225ms cubic-bezier(0.4,0.0,1,1)';
var HIDE_ANIMATION = '195ms cubic-bezier(0.0,0.0,0.2,1)';
/**
 * Internal component that wraps user-provided snack bar content.
 */
var MdSnackBarContainer = (function (_super) {
    __extends$15(MdSnackBarContainer, _super);
    function MdSnackBarContainer(_ngZone) {
        _super.call(this);
        this._ngZone = _ngZone;
        /** Subject for notifying that the snack bar has exited from view. */
        this.onExit = new rxjs_Subject.Subject();
        /** Subject for notifying that the snack bar has finished entering the view. */
        this.onEnter = new rxjs_Subject.Subject();
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
    __decorate$45([
        _angular_core.ViewChild(PortalHostDirective), 
        __metadata$45('design:type', PortalHostDirective)
    ], MdSnackBarContainer.prototype, "_portalHost", void 0);
    MdSnackBarContainer = __decorate$45([
        _angular_core.Component({selector: 'snack-bar-container',
            template: "<template portalhost></template>",
            styles: [":host{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);background:#323232;border-radius:2px;box-sizing:content-box;display:block;height:20px;max-width:568px;min-width:288px;overflow:hidden;padding:14px 24px;transform:translateY(100%)}@media screen and (-ms-high-contrast:active){:host{border:1px solid}}"],
            host: {
                'role': 'alert',
                '[@state]': 'animationState',
                '(@state.done)': 'onAnimationEnd($event)'
            },
            animations: [
                _angular_core.trigger('state', [
                    _angular_core.state('initial', _angular_core.style({ transform: 'translateY(100%)' })),
                    _angular_core.state('visible', _angular_core.style({ transform: 'translateY(0%)' })),
                    _angular_core.state('complete', _angular_core.style({ transform: 'translateY(100%)' })),
                    _angular_core.transition('visible => complete', _angular_core.animate(HIDE_ANIMATION)),
                    _angular_core.transition('initial => visible, void => visible', _angular_core.animate(SHOW_ANIMATION)),
                ])
            ],
        }), 
        __metadata$45('design:paramtypes', [_angular_core.NgZone])
    ], MdSnackBarContainer);
    return MdSnackBarContainer;
}(BasePortalHost));

var __decorate$46 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$46 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * A component used to open as the default snack bar, matching material spec.
 * This should only be used internally by the snack bar service.
 */
var SimpleSnackBar = (function () {
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
    SimpleSnackBar = __decorate$46([
        _angular_core.Component({selector: 'simple-snack-bar',
            template: "<span class=\"md-simple-snackbar-message\">{{message}}</span> <button md-button class=\"md-simple-snackbar-action\" *ngif=\"hasAction\" (click)=\"dismiss()\">{{action}}</button>",
            styles: ["md-simple-snackbar{display:flex;justify-content:space-between}.md-simple-snackbar-message{box-sizing:border-box;border:none;color:#fff;font-family:Roboto,'Helvetica Neue',sans-serif;font-size:14px;line-height:20px;outline:0;text-decoration:none;word-break:break-all}.md-simple-snackbar-action{box-sizing:border-box;color:#fff;float:right;font-weight:600;line-height:20px;margin:-5px 0 0 48px;min-width:initial;padding:5px;text-transform:uppercase}"],
        }), 
        __metadata$46('design:paramtypes', [])
    ], SimpleSnackBar);
    return SimpleSnackBar;
}());

/**
 * Extends an object with the *enumerable* and *own* properties of one or more source objects,
 * similar to Object.assign.
 *
 * @param dest The object which will have properties copied to it.
 * @param sources The source objects from which properties will be copied.
 */
function extendObject(dest) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (dest == null) {
        throw TypeError('Cannot convert undefined or null to object');
    }
    for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
        var source = sources_1[_a];
        if (source != null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    dest[key] = source[key];
                }
            }
        }
    }
    return dest;
}

var __decorate$44 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$44 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Service to dispatch Material Design snack bar messages.
 */
var MdSnackBar = (function () {
    function MdSnackBar(_overlay, _live) {
        this._overlay = _overlay;
        this._live = _live;
    }
    /**
     * Creates and dispatches a snack bar with a custom component for the content, removing any
     * currently opened snack bars.
     */
    MdSnackBar.prototype.openFromComponent = function (component, config) {
        var _this = this;
        config = _applyConfigDefaults(config);
        var overlayRef = this._createOverlay();
        var snackBarContainer = this._attachSnackBarContainer(overlayRef, config);
        var snackBarRef = this._attachSnackbarContent(component, snackBarContainer, overlayRef);
        // When the snackbar is dismissed, clear the reference to it.
        snackBarRef.afterDismissed().subscribe(function () {
            // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
            if (_this._snackBarRef == snackBarRef) {
                _this._snackBarRef = null;
            }
        });
        // If a snack bar is already in view, dismiss it and enter the new snack bar after exit
        // animation is complete.
        if (this._snackBarRef) {
            this._snackBarRef.afterDismissed().subscribe(function () {
                snackBarRef.containerInstance.enter();
            });
            this._snackBarRef.dismiss();
        }
        else {
            snackBarRef.containerInstance.enter();
        }
        // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
        if (config.duration > 0) {
            snackBarRef.afterOpened().subscribe(function () {
                setTimeout(function () { return snackBarRef.dismiss(); }, config.duration);
            });
        }
        this._live.announce(config.announcementMessage, config.politeness);
        this._snackBarRef = snackBarRef;
        return this._snackBarRef;
    };
    /**
     * Opens a snackbar with a message and an optional action.
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     * @returns {MdSnackBarRef<SimpleSnackBar>}
     */
    MdSnackBar.prototype.open = function (message, action, config) {
        if (action === void 0) { action = ''; }
        if (config === void 0) { config = {}; }
        config.announcementMessage = message;
        var simpleSnackBarRef = this.openFromComponent(SimpleSnackBar, config);
        simpleSnackBarRef.instance.snackBarRef = simpleSnackBarRef;
        simpleSnackBarRef.instance.message = message;
        simpleSnackBarRef.instance.action = action;
        return simpleSnackBarRef;
    };
    /**
     * Attaches the snack bar container component to the overlay.
     */
    MdSnackBar.prototype._attachSnackBarContainer = function (overlayRef, config) {
        var containerPortal = new ComponentPortal(MdSnackBarContainer, config.viewContainerRef);
        var containerRef = overlayRef.attach(containerPortal);
        containerRef.instance.snackBarConfig = config;
        return containerRef.instance;
    };
    /**
     * Places a new component as the content of the snack bar container.
     */
    MdSnackBar.prototype._attachSnackbarContent = function (component, container, overlayRef) {
        var portal = new ComponentPortal(component);
        var contentRef = container.attachComponentPortal(portal);
        return new MdSnackBarRef(contentRef.instance, container, overlayRef);
    };
    /**
     * Creates a new overlay and places it in the correct location.
     */
    MdSnackBar.prototype._createOverlay = function () {
        var state = new OverlayState();
        state.positionStrategy = this._overlay.position().global()
            .centerHorizontally()
            .bottom('0');
        return this._overlay.create(state);
    };
    MdSnackBar = __decorate$44([
        _angular_core.Injectable(), 
        __metadata$44('design:paramtypes', [Overlay, MdLiveAnnouncer])
    ], MdSnackBar);
    return MdSnackBar;
}());
/**
 * Applies default options to the snackbar config.
 * @param config The configuration to which the defaults will be applied.
 * @returns The new configuration object with defaults applied.
 */
function _applyConfigDefaults(config) {
    return extendObject(new MdSnackBarConfig(), config);
}
var MdSnackBarModule = (function () {
    function MdSnackBarModule() {
    }
    MdSnackBarModule.forRoot = function () {
        return {
            ngModule: MdSnackBarModule,
            providers: [MdSnackBar, OVERLAY_PROVIDERS, MdLiveAnnouncer]
        };
    };
    MdSnackBarModule = __decorate$44([
        _angular_core.NgModule({
            imports: [OverlayModule, PortalModule, _angular_common.CommonModule, DefaultStyleCompatibilityModeModule],
            exports: [MdSnackBarContainer, DefaultStyleCompatibilityModeModule],
            declarations: [MdSnackBarContainer, SimpleSnackBar],
            entryComponents: [MdSnackBarContainer, SimpleSnackBar],
        }), 
        __metadata$44('design:paramtypes', [])
    ], MdSnackBarModule);
    return MdSnackBarModule;
}());

var __extends$17 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$48 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$48 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Used to flag tab labels for use with the portal directive */
var MdTabLabel = (function (_super) {
    __extends$17(MdTabLabel, _super);
    function MdTabLabel(templateRef, viewContainerRef) {
        _super.call(this, templateRef, viewContainerRef);
    }
    MdTabLabel = __decorate$48([
        _angular_core.Directive({
            selector: '[md-tab-label], [mat-tab-label]',
        }), 
        __metadata$48('design:paramtypes', [_angular_core.TemplateRef, _angular_core.ViewContainerRef])
    ], MdTabLabel);
    return MdTabLabel;
}(TemplatePortalDirective));

var __decorate$49 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$49 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Used in the `md-tab-group` view to display tab labels */
var MdTabLabelWrapper = (function () {
    function MdTabLabelWrapper(elementRef, _renderer) {
        this.elementRef = elementRef;
        this._renderer = _renderer;
        /** Whether the tab label is disabled.  */
        this._disabled = false;
    }
    Object.defineProperty(MdTabLabelWrapper.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    /** Sets focus on the wrapper element */
    MdTabLabelWrapper.prototype.focus = function () {
        this._renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus');
    };
    MdTabLabelWrapper.prototype.getOffsetLeft = function () {
        return this.elementRef.nativeElement.offsetLeft;
    };
    MdTabLabelWrapper.prototype.getOffsetWidth = function () {
        return this.elementRef.nativeElement.offsetWidth;
    };
    __decorate$49([
        _angular_core.Input(), 
        __metadata$49('design:type', Object)
    ], MdTabLabelWrapper.prototype, "disabled", null);
    MdTabLabelWrapper = __decorate$49([
        _angular_core.Directive({
            selector: '[md-tab-label-wrapper], [mat-tab-label-wrapper]',
            host: {
                '[class.md-tab-disabled]': 'disabled'
            }
        }), 
        __metadata$49('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdTabLabelWrapper);
    return MdTabLabelWrapper;
}());

var __decorate$51 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$51 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** The ink-bar is used to display and animate the line underneath the current active tab label. */
var MdInkBar = (function () {
    function MdInkBar(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    /**
     * Calculates the styles from the provided element in order to align the ink-bar to that element.
     * Shows the ink bar if previously set as hidden.
     * @param element
     */
    MdInkBar.prototype.alignToElement = function (element) {
        this.show();
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'left', this._getLeftPosition(element));
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'width', this._getElementWidth(element));
    };
    /** Shows the ink bar. */
    MdInkBar.prototype.show = function () {
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'visibility', 'visible');
    };
    /** Hides the ink bar. */
    MdInkBar.prototype.hide = function () {
        this._renderer.setElementStyle(this._elementRef.nativeElement, 'visibility', 'hidden');
    };
    /**
     * Generates the pixel distance from the left based on the provided element in string format.
     * @param element
     * @returns {string}
     */
    MdInkBar.prototype._getLeftPosition = function (element) {
        return element ? element.offsetLeft + 'px' : '0';
    };
    /**
     * Generates the pixel width from the provided element in string format.
     * @param element
     * @returns {string}
     */
    MdInkBar.prototype._getElementWidth = function (element) {
        return element ? element.offsetWidth + 'px' : '0';
    };
    MdInkBar = __decorate$51([
        _angular_core.Directive({
            selector: 'md-ink-bar, mat-ink-bar',
        }), 
        __metadata$51('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdInkBar);
    return MdInkBar;
}());

var __extends$18 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$50 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$50 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
var MdTabNavBar = (function () {
    function MdTabNavBar() {
    }
    /** Animates the ink bar to the position of the active link element. */
    MdTabNavBar.prototype.updateActiveLink = function (element) {
        this._inkBar.alignToElement(element);
    };
    __decorate$50([
        _angular_core.ViewChild(MdInkBar), 
        __metadata$50('design:type', MdInkBar)
    ], MdTabNavBar.prototype, "_inkBar", void 0);
    MdTabNavBar = __decorate$50([
        _angular_core.Component({selector: '[md-tab-nav-bar], [mat-tab-nav-bar]',
            template: "<ng-content></ng-content><md-ink-bar></md-ink-bar>",
            styles: ["[md-tab-link],[md-tab-nav-bar]{position:relative;overflow:hidden}[md-tab-nav-bar]{display:flex;flex-direction:row;flex-shrink:0}[md-tab-link]{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;text-decoration:none}[md-tab-link]:focus{outline:0;opacity:1}@media (max-width:600px){[md-tab-link]{min-width:72px}}md-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$50('design:paramtypes', [])
    ], MdTabNavBar);
    return MdTabNavBar;
}());
var MdTabLink = (function () {
    function MdTabLink(_mdTabNavBar, _element) {
        this._mdTabNavBar = _mdTabNavBar;
        this._element = _element;
        this._isActive = false;
    }
    Object.defineProperty(MdTabLink.prototype, "active", {
        get: function () {
            return this._isActive;
        },
        set: function (value) {
            this._isActive = value;
            if (value) {
                this._mdTabNavBar.updateActiveLink(this._element.nativeElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate$50([
        _angular_core.Input(), 
        __metadata$50('design:type', Boolean)
    ], MdTabLink.prototype, "active", null);
    MdTabLink = __decorate$50([
        _angular_core.Directive({
            selector: '[md-tab-link], [mat-tab-link]',
        }), 
        __metadata$50('design:paramtypes', [MdTabNavBar, _angular_core.ElementRef])
    ], MdTabLink);
    return MdTabLink;
}());
/**
 * Simple directive that extends the ripple and matches the selector of the MdTabLink. This
 * adds the ripple behavior to nav bar labels.
 */
var MdTabLinkRipple = (function (_super) {
    __extends$18(MdTabLinkRipple, _super);
    function MdTabLinkRipple(_element, _ngZone, _ruler) {
        _super.call(this, _element, _ngZone, _ruler);
        this._element = _element;
        this._ngZone = _ngZone;
    }
    // In certain cases the parent destroy handler
    // may not get called. See Angular issue #11606.
    MdTabLinkRipple.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    MdTabLinkRipple = __decorate$50([
        _angular_core.Directive({
            selector: '[md-tab-link], [mat-tab-link]',
        }), 
        __metadata$50('design:paramtypes', [_angular_core.ElementRef, _angular_core.NgZone, ViewportRuler])
    ], MdTabLinkRipple);
    return MdTabLinkRipple;
}(MdRipple));

var __decorate$52 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$52 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdTab = (function () {
    function MdTab(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        /** The plain text label for the tab, used when there is no template label. */
        this.textLabel = '';
        /** The portal that will be the hosted content of the tab */
        this._contentPortal = null;
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        this.origin = null;
        this._disabled = false;
    }
    Object.defineProperty(MdTab.prototype, "content", {
        get: function () { return this._contentPortal; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTab.prototype, "disabled", {
        get: function () { return this._disabled; },
        set: function (value) { this._disabled = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    MdTab.prototype.ngOnInit = function () {
        this._contentPortal = new TemplatePortal(this._content, this._viewContainerRef);
    };
    __decorate$52([
        _angular_core.ContentChild(MdTabLabel), 
        __metadata$52('design:type', MdTabLabel)
    ], MdTab.prototype, "templateLabel", void 0);
    __decorate$52([
        _angular_core.ViewChild(_angular_core.TemplateRef), 
        __metadata$52('design:type', _angular_core.TemplateRef)
    ], MdTab.prototype, "_content", void 0);
    __decorate$52([
        _angular_core.Input('label'), 
        __metadata$52('design:type', String)
    ], MdTab.prototype, "textLabel", void 0);
    __decorate$52([
        _angular_core.Input(), 
        __metadata$52('design:type', Boolean), 
        __metadata$52('design:paramtypes', [Boolean])
    ], MdTab.prototype, "disabled", null);
    MdTab = __decorate$52([
        _angular_core.Component({selector: 'md-tab',
            template: "<template><ng-content></ng-content></template>",
        }), 
        __metadata$52('design:paramtypes', [_angular_core.ViewContainerRef])
    ], MdTab);
    return MdTab;
}());

var __decorate$53 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$53 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$10 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MdTabBody = (function () {
    function MdTabBody(_elementRef, _dir) {
        this._elementRef = _elementRef;
        this._dir = _dir;
        /** Event emitted when the tab begins to animate towards the center as the active tab. */
        this.onCentering = new _angular_core.EventEmitter();
        /** Event emitted when the tab completes its animation towards the center. */
        this.onCentered = new _angular_core.EventEmitter(true);
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
    __decorate$53([
        _angular_core.ViewChild(PortalHostDirective), 
        __metadata$53('design:type', PortalHostDirective)
    ], MdTabBody.prototype, "_portalHost", void 0);
    __decorate$53([
        _angular_core.Output(), 
        __metadata$53('design:type', _angular_core.EventEmitter)
    ], MdTabBody.prototype, "onCentering", void 0);
    __decorate$53([
        _angular_core.Output(), 
        __metadata$53('design:type', _angular_core.EventEmitter)
    ], MdTabBody.prototype, "onCentered", void 0);
    __decorate$53([
        _angular_core.Input('content'), 
        __metadata$53('design:type', TemplatePortal)
    ], MdTabBody.prototype, "_content", void 0);
    __decorate$53([
        _angular_core.Input('position'), 
        __metadata$53('design:type', Number), 
        __metadata$53('design:paramtypes', [Number])
    ], MdTabBody.prototype, "position", null);
    __decorate$53([
        _angular_core.Input('origin'), 
        __metadata$53('design:type', Number), 
        __metadata$53('design:paramtypes', [Number])
    ], MdTabBody.prototype, "origin", null);
    MdTabBody = __decorate$53([
        _angular_core.Component({selector: 'md-tab-body',
            template: "<div class=\"md-tab-body-content\" #content [@translatetab]=\"_position\" (@translatetab.start)=\"_onTranslateTabStarted($event)\" (@translatetab.done)=\"_onTranslateTabComplete($event)\"><template portalhost></template></div>",
            animations: [
                _angular_core.trigger('translateTab', [
                    _angular_core.state('left', _angular_core.style({ transform: 'translate3d(-100%, 0, 0)' })),
                    _angular_core.state('left-origin-center', _angular_core.style({ transform: 'translate3d(0, 0, 0)' })),
                    _angular_core.state('right-origin-center', _angular_core.style({ transform: 'translate3d(0, 0, 0)' })),
                    _angular_core.state('center', _angular_core.style({ transform: 'translate3d(0, 0, 0)' })),
                    _angular_core.state('right', _angular_core.style({ transform: 'translate3d(100%, 0, 0)' })),
                    _angular_core.transition('* => left, * => right, left => center, right => center', _angular_core.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')),
                    _angular_core.transition('void => left-origin-center', [
                        _angular_core.style({ transform: 'translate3d(-100%, 0, 0)' }),
                        _angular_core.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                    ]),
                    _angular_core.transition('void => right-origin-center', [
                        _angular_core.style({ transform: 'translate3d(100%, 0, 0)' }),
                        _angular_core.animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')
                    ])
                ])
            ]
        }),
        __param$10(1, _angular_core.Optional()), 
        __metadata$53('design:paramtypes', [_angular_core.ElementRef, Dir])
    ], MdTabBody);
    return MdTabBody;
}());

var __decorate$54 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$54 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$11 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
var EXAGGERATED_OVERSCROLL = 60;
/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 */
var MdTabHeader = (function () {
    function MdTabHeader(_zone, _elementRef, _dir) {
        this._zone = _zone;
        this._elementRef = _elementRef;
        this._dir = _dir;
        /** The tab index that is focused. */
        this._focusIndex = 0;
        /** The distance in pixels that the tab labels should be translated to the left. */
        this._scrollDistance = 0;
        /** Whether the header should scroll to the selected index after the view has been checked. */
        this._selectedIndexChanged = false;
        /** Whether the controls for pagination should be displayed */
        this._showPaginationControls = false;
        /** Whether the tab list can be scrolled more towards the end of the tab label list. */
        this._disableScrollAfter = true;
        /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
        this._disableScrollBefore = true;
        /** The index of the active tab. */
        this._selectedIndex = 0;
        /** Event emitted when the option is selected. */
        this.selectFocusedIndex = new _angular_core.EventEmitter();
        /** Event emitted when a label is focused. */
        this.indexFocused = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdTabHeader.prototype, "selectedIndex", {
        get: function () { return this._selectedIndex; },
        set: function (value) {
            this._selectedIndexChanged = this._selectedIndex != value;
            this._selectedIndex = value;
            this._focusIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    MdTabHeader.prototype.ngAfterContentChecked = function () {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._labelWrappers.length) {
            this._checkPaginationEnabled();
            this._checkScrollingControls();
            this._updateTabScrollPosition();
            this._tabLabelCount = this._labelWrappers.length;
        }
        // If the selected index has changed, scroll to the label and check if the scrolling controls
        // should be disabled.
        if (this._selectedIndexChanged) {
            this._scrollToLabel(this._selectedIndex);
            this._checkScrollingControls();
            this._selectedIndexChanged = false;
        }
        // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
        // then translate the header to reflect this.
        if (this._scrollDistanceChanged) {
            this._updateTabScrollPosition();
            this._scrollDistanceChanged = false;
        }
    };
    /**
     * Waits one frame for the view to update, then updates the ink bar and scroll.
     * Note: This must be run outside of the zone or it will create an infinite change detection loop
     */
    MdTabHeader.prototype.ngAfterViewChecked = function () {
        var _this = this;
        this._zone.runOutsideAngular(function () {
            window.requestAnimationFrame(function () {
                _this._alignInkBarToSelectedTab();
            });
        });
    };
    MdTabHeader.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case RIGHT_ARROW:
                this._focusNextTab();
                break;
            case LEFT_ARROW:
                this._focusPreviousTab();
                break;
            case ENTER:
                this.selectFocusedIndex.emit(this.focusIndex);
                break;
        }
    };
    Object.defineProperty(MdTabHeader.prototype, "focusIndex", {
        /** Tracks which element has focus; used for keyboard navigation */
        get: function () { return this._focusIndex; },
        /** When the focus index is set, we must manually send focus to the correct label */
        set: function (value) {
            if (!this._isValidIndex(value) || this._focusIndex == value) {
                return;
            }
            this._focusIndex = value;
            this.indexFocused.emit(value);
            this._setTabFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    MdTabHeader.prototype._isValidIndex = function (index) {
        if (!this._labelWrappers) {
            return true;
        }
        var tab = this._labelWrappers.toArray()[index];
        return tab && !tab.disabled;
    };
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    MdTabHeader.prototype._setTabFocus = function (tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._labelWrappers && this._labelWrappers.length) {
            this._labelWrappers.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            var containerEl = this._tabListContainer.nativeElement;
            var dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    };
    /**
     * Moves the focus towards the beginning or the end of the list depending on the offset provided.
     * Valid offsets are 1 and -1.
     */
    MdTabHeader.prototype._moveFocus = function (offset) {
        if (this._labelWrappers) {
            var tabs = this._labelWrappers.toArray();
            for (var i = this.focusIndex + offset; i < tabs.length && i >= 0; i += offset) {
                if (this._isValidIndex(i)) {
                    this.focusIndex = i;
                    return;
                }
            }
        }
    };
    /** Increment the focus index by 1 until a valid tab is found. */
    MdTabHeader.prototype._focusNextTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? 1 : -1);
    };
    /** Decrement the focus index by 1 until a valid tab is found. */
    MdTabHeader.prototype._focusPreviousTab = function () {
        this._moveFocus(this._getLayoutDirection() == 'ltr' ? -1 : 1);
    };
    /** The layout direction of the containing app. */
    MdTabHeader.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    MdTabHeader.prototype._updateTabScrollPosition = function () {
        var translateX = this.scrollDistance + 'px';
        if (this._getLayoutDirection() == 'ltr') {
            translateX = '-' + translateX;
        }
        applyCssTransform(this._tabList.nativeElement, "translate3d(" + translateX + ", 0, 0)");
    };
    Object.defineProperty(MdTabHeader.prototype, "scrollDistance", {
        get: function () { return this._scrollDistance; },
        /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
        set: function (v) {
            this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), v));
            // Mark that the scroll distance has changed so that after the view is checked, the CSS
            // transformation can move the header.
            this._scrollDistanceChanged = true;
            this._checkScrollingControls();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MdTabHeader.prototype._scrollHeader = function (scrollDir) {
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        this.scrollDistance += (scrollDir == 'before' ? -1 : 1) * viewLength / 3;
    };
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MdTabHeader.prototype._scrollToLabel = function (labelIndex) {
        var selectedLabel = this._labelWrappers.toArray()[labelIndex];
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        var labelBeforePos, labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = selectedLabel.getOffsetLeft();
            labelAfterPos = labelBeforePos + selectedLabel.getOffsetWidth();
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - selectedLabel.getOffsetLeft();
            labelBeforePos = labelAfterPos - selectedLabel.getOffsetWidth();
        }
        var beforeVisiblePos = this.scrollDistance;
        var afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    };
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MdTabHeader.prototype._checkPaginationEnabled = function () {
        this._showPaginationControls =
            this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
        if (!this._showPaginationControls) {
            this.scrollDistance = 0;
        }
    };
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MdTabHeader.prototype._checkScrollingControls = function () {
        // Check if the pagination arrows should be activated.
        this._disableScrollBefore = this.scrollDistance == 0;
        this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
    };
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MdTabHeader.prototype._getMaxScrollDistance = function () {
        var lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return lengthOfTabList - viewLength;
    };
    /** Tells the ink-bar to align itself to the current label wrapper */
    MdTabHeader.prototype._alignInkBarToSelectedTab = function () {
        var selectedLabelWrapper = this._labelWrappers && this._labelWrappers.length
            ? this._labelWrappers.toArray()[this.selectedIndex].elementRef.nativeElement
            : null;
        this._inkBar.alignToElement(selectedLabelWrapper);
    };
    __decorate$54([
        _angular_core.ContentChildren(MdTabLabelWrapper), 
        __metadata$54('design:type', _angular_core.QueryList)
    ], MdTabHeader.prototype, "_labelWrappers", void 0);
    __decorate$54([
        _angular_core.ViewChild(MdInkBar), 
        __metadata$54('design:type', MdInkBar)
    ], MdTabHeader.prototype, "_inkBar", void 0);
    __decorate$54([
        _angular_core.ViewChild('tabListContainer'), 
        __metadata$54('design:type', _angular_core.ElementRef)
    ], MdTabHeader.prototype, "_tabListContainer", void 0);
    __decorate$54([
        _angular_core.ViewChild('tabList'), 
        __metadata$54('design:type', _angular_core.ElementRef)
    ], MdTabHeader.prototype, "_tabList", void 0);
    __decorate$54([
        _angular_core.Input(), 
        __metadata$54('design:type', Number), 
        __metadata$54('design:paramtypes', [Number])
    ], MdTabHeader.prototype, "selectedIndex", null);
    __decorate$54([
        _angular_core.Output(), 
        __metadata$54('design:type', Object)
    ], MdTabHeader.prototype, "selectFocusedIndex", void 0);
    __decorate$54([
        _angular_core.Output(), 
        __metadata$54('design:type', Object)
    ], MdTabHeader.prototype, "indexFocused", void 0);
    MdTabHeader = __decorate$54([
        _angular_core.Component({selector: 'md-tab-header',
            template: "<div class=\"md-tab-header-pagination md-tab-header-pagination-before md-elevation-z4\" aria-hidden=\"true\" md-ripple [mdrippledisabled]=\"_disableScrollBefore\" [class.md-tab-header-pagination-disabled]=\"_disableScrollBefore\" (click)=\"_scrollHeader('before')\"><div class=\"md-tab-header-pagination-chevron\"></div></div><div class=\"md-tab-label-container\" #tablistcontainer (keydown)=\"_handleKeydown($event)\"><div class=\"md-tab-list\" #tablist role=\"tablist\"><ng-content></ng-content><md-ink-bar></md-ink-bar></div></div><div class=\"md-tab-header-pagination md-tab-header-pagination-after md-elevation-z4\" aria-hidden=\"true\" md-ripple [mdrippledisabled]=\"_disableScrollAfter\" [class.md-tab-header-pagination-disabled]=\"_disableScrollAfter\" (click)=\"_scrollHeader('after')\"><div class=\"md-tab-header-pagination-chevron\"></div></div>",
            styles: [".md-tab-header{overflow:hidden;position:relative;display:flex;flex-direction:row;flex-shrink:0}.md-tab-label{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;position:relative}.md-tab-label:focus{outline:0;opacity:1}@media (max-width:600px){.md-tab-label{min-width:72px}}md-ink-bar{position:absolute;bottom:0;height:2px;transition:.5s cubic-bezier(.35,0,.25,1)}.md-tab-header-pagination{position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2}.md-tab-header-pagination-controls-enabled .md-tab-header-pagination,.md-tab-list{display:flex}.md-tab-header-pagination-before,.md-tab-header-rtl .md-tab-header-pagination-after{padding-left:4px}.md-tab-header-pagination-before .md-tab-header-pagination-chevron,.md-tab-header-rtl .md-tab-header-pagination-after .md-tab-header-pagination-chevron{transform:rotate(-135deg)}.md-tab-header-pagination-after,.md-tab-header-rtl .md-tab-header-pagination-before{padding-right:4px}.md-tab-header-pagination-after .md-tab-header-pagination-chevron,.md-tab-header-rtl .md-tab-header-pagination-before .md-tab-header-pagination-chevron{transform:rotate(45deg)}.md-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:'';height:8px;width:8px}.md-tab-header-pagination-disabled{box-shadow:none;cursor:default}.md-tab-header-pagination-disabled .md-tab-header-pagination-chevron{border-color:#ccc}.md-tab-label-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.md-tab-list{flex-grow:1;position:relative;transition:transform .5s cubic-bezier(.35,0,.25,1)}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            host: {
                'class': 'md-tab-header',
                '[class.md-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                '[class.md-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
            }
        }),
        __param$11(2, _angular_core.Optional()), 
        __metadata$54('design:paramtypes', [_angular_core.NgZone, _angular_core.ElementRef, Dir])
    ], MdTabHeader);
    return MdTabHeader;
}());

var __decorate$47 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$47 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/** Used to generate unique ID's for each tab component */
var nextId$2 = 0;
/** A simple change event emitted on focus or selection changes. */
var MdTabChangeEvent = (function () {
    function MdTabChangeEvent() {
    }
    return MdTabChangeEvent;
}());
/**
 * Material design tab-group component.  Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://www.google.com/design/spec/components/tabs.html
 */
var MdTabGroup = (function () {
    function MdTabGroup(_renderer) {
        this._renderer = _renderer;
        /** Whether this component has been initialized. */
        this._isInitialized = false;
        /** The tab index that should be selected after the content has been checked. */
        this._indexToSelect = 0;
        /** Snapshot of the height of the tab body wrapper before another tab is activated. */
        this._tabBodyWrapperHeight = null;
        /** Whether the tab group should grow to the size of the active tab */
        this._dynamicHeight = false;
        /** The index of the active tab. */
        this._selectedIndex = null;
        this._onFocusChange = new _angular_core.EventEmitter();
        this._onSelectChange = new _angular_core.EventEmitter(true);
        this._groupId = nextId$2++;
    }
    Object.defineProperty(MdTabGroup.prototype, "dynamicHeight", {
        get: function () { return this._dynamicHeight; },
        set: function (value) { this._dynamicHeight = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "_dynamicHeightDeprecated", {
        /** @deprecated */
        get: function () { return this._dynamicHeight; },
        set: function (value) { this._dynamicHeight = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            this._indexToSelect = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectedIndexChange", {
        /** Output to enable support for two-way binding on `selectedIndex`. */
        get: function () {
            return this.selectChange.map(function (event) { return event.index; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "focusChange", {
        get: function () {
            return this._onFocusChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTabGroup.prototype, "selectChange", {
        get: function () {
            return this._onSelectChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * After the content is checked, this component knows what tabs have been defined
     * and what the selected index should be. This is where we can know exactly what position
     * each tab should be in according to the new selected index, and additionally we know how
     * a new selected tab should transition in (from the left or right).
     */
    MdTabGroup.prototype.ngAfterContentChecked = function () {
        var _this = this;
        // Clamp the next selected index to the bounds of 0 and the tabs length.
        this._indexToSelect =
            Math.min(this._tabs.length - 1, Math.max(this._indexToSelect, 0));
        // If there is a change in selected index, emit a change event. Should not trigger if
        // the selected index has not yet been initialized.
        if (this._selectedIndex != this._indexToSelect && this._selectedIndex != null) {
            this._onSelectChange.emit(this._createChangeEvent(this._indexToSelect));
        }
        // Setup the position for each tab and optionally setup an origin on the next selected tab.
        this._tabs.forEach(function (tab, index) {
            tab.position = index - _this._indexToSelect;
            // If there is already a selected tab, then set up an origin for the next selected tab
            // if it doesn't have one already.
            if (_this._selectedIndex != null && tab.position == 0 && !tab.origin) {
                tab.origin = _this._indexToSelect - _this._selectedIndex;
            }
        });
        this._selectedIndex = this._indexToSelect;
    };
    /**
     * Waits one frame for the view to update, then updates the ink bar
     * Note: This must be run outside of the zone or it will create an infinite change detection loop
     */
    MdTabGroup.prototype.ngAfterViewChecked = function () {
        this._isInitialized = true;
    };
    MdTabGroup.prototype._focusChanged = function (index) {
        this._onFocusChange.emit(this._createChangeEvent(index));
    };
    MdTabGroup.prototype._createChangeEvent = function (index) {
        var event = new MdTabChangeEvent;
        event.index = index;
        if (this._tabs && this._tabs.length) {
            event.tab = this._tabs.toArray()[index];
        }
        return event;
    };
    /** Returns a unique id for each tab label element */
    MdTabGroup.prototype._getTabLabelId = function (i) {
        return "md-tab-label-" + this._groupId + "-" + i;
    };
    /** Returns a unique id for each tab content element */
    MdTabGroup.prototype._getTabContentId = function (i) {
        return "md-tab-content-" + this._groupId + "-" + i;
    };
    /**
     * Sets the height of the body wrapper to the height of the activating tab if dynamic
     * height property is true.
     */
    MdTabGroup.prototype._setTabBodyWrapperHeight = function (tabHeight) {
        if (!this._dynamicHeight || !this._tabBodyWrapperHeight) {
            return;
        }
        this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', this._tabBodyWrapperHeight + 'px');
        // This conditional forces the browser to paint the height so that
        // the animation to the new height can have an origin.
        if (this._tabBodyWrapper.nativeElement.offsetHeight) {
            this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', tabHeight + 'px');
        }
    };
    /** Removes the height of the tab body wrapper. */
    MdTabGroup.prototype._removeTabBodyWrapperHeight = function () {
        this._tabBodyWrapperHeight = this._tabBodyWrapper.nativeElement.clientHeight;
        this._renderer.setElementStyle(this._tabBodyWrapper.nativeElement, 'height', '');
    };
    __decorate$47([
        _angular_core.ContentChildren(MdTab), 
        __metadata$47('design:type', _angular_core.QueryList)
    ], MdTabGroup.prototype, "_tabs", void 0);
    __decorate$47([
        _angular_core.ViewChild('tabBodyWrapper'), 
        __metadata$47('design:type', _angular_core.ElementRef)
    ], MdTabGroup.prototype, "_tabBodyWrapper", void 0);
    __decorate$47([
        _angular_core.Input(), 
        __metadata$47('design:type', Boolean)
    ], MdTabGroup.prototype, "dynamicHeight", null);
    __decorate$47([
        _angular_core.Input('md-dynamic-height'), 
        __metadata$47('design:type', Boolean)
    ], MdTabGroup.prototype, "_dynamicHeightDeprecated", null);
    __decorate$47([
        _angular_core.Input(), 
        __metadata$47('design:type', Number), 
        __metadata$47('design:paramtypes', [Number])
    ], MdTabGroup.prototype, "selectedIndex", null);
    __decorate$47([
        _angular_core.Output(), 
        __metadata$47('design:type', rxjs_Observable.Observable)
    ], MdTabGroup.prototype, "selectedIndexChange", null);
    __decorate$47([
        _angular_core.Output(), 
        __metadata$47('design:type', rxjs_Observable.Observable)
    ], MdTabGroup.prototype, "focusChange", null);
    __decorate$47([
        _angular_core.Output(), 
        __metadata$47('design:type', rxjs_Observable.Observable)
    ], MdTabGroup.prototype, "selectChange", null);
    MdTabGroup = __decorate$47([
        _angular_core.Component({selector: 'md-tab-group',
            template: "<md-tab-header [selectedindex]=\"selectedIndex\" #tabheader (indexfocused)=\"_focusChanged($event)\" (selectfocusedindex)=\"selectedIndex = $event\"><div class=\"md-tab-label\" role=\"tab\" md-tab-label-wrapper md-ripple *ngfor=\"let tab of _tabs; let i = index\" [id]=\"_getTabLabelId(i)\" [tabindex]=\"selectedIndex == i ? 0 : -1\" [attr.aria-controls]=\"_getTabContentId(i)\" [attr.aria-selected]=\"selectedIndex == i\" [class.md-tab-label-active]=\"selectedIndex == i\" [disabled]=\"tab.disabled\" (click)=\"tabHeader.focusIndex = selectedIndex = i\"><template [ngif]=\"tab.templateLabel\"><template [portalhost]=\"tab.templateLabel\"></template></template><template [ngif]=\"!tab.templateLabel\">{{tab.textLabel}}</template></div></md-tab-header><div class=\"md-tab-body-wrapper\" #tabbodywrapper><md-tab-body role=\"tabpanel\" *ngfor=\"let tab of _tabs; let i = index\" [id]=\"_getTabContentId(i)\" [attr.aria-labelledby]=\"_getTabLabelId(i)\" [class.md-tab-body-active]=\"selectedIndex == i\" [content]=\"tab.content\" [position]=\"tab.position\" [origin]=\"tab.origin\" (oncentered)=\"_removeTabBodyWrapperHeight()\" (oncentering)=\"_setTabBodyWrapperHeight($event)\"></md-tab-body></div>",
            styles: [":host{display:flex;flex-direction:column;font-family:Roboto,\"Helvetica Neue\",sans-serif}.md-tab-label{line-height:48px;height:48px;padding:0 12px;font-size:14px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-weight:500;cursor:pointer;box-sizing:border-box;color:currentColor;opacity:.6;min-width:160px;text-align:center;position:relative}.md-tab-label:focus{outline:0;opacity:1}@media (max-width:600px){.md-tab-label{min-width:72px}}:host[md-stretch-tabs] .md-tab-label{flex-basis:0;flex-grow:1}.md-tab-body-wrapper{position:relative;overflow:hidden;display:flex;transition:height .5s cubic-bezier(.35,0,.25,1)}md-tab-body{position:absolute;top:0;left:0;right:0;bottom:0;display:block;overflow:hidden}md-tab-body.md-tab-body-active{position:relative;overflow-x:hidden;overflow-y:auto;z-index:1;flex-grow:1}:host.md-tab-group-dynamic-height md-tab-body.md-tab-body-active{overflow-y:hidden}.md-tab-disabled{cursor:default;pointer-events:none}"],
            host: { '[class.md-tab-group-dynamic-height]': 'dynamicHeight' }
        }), 
        __metadata$47('design:paramtypes', [_angular_core.Renderer])
    ], MdTabGroup);
    return MdTabGroup;
}());
var MdTabsModule = (function () {
    function MdTabsModule() {
    }
    MdTabsModule.forRoot = function () {
        return {
            ngModule: MdTabsModule,
            providers: [ViewportRuler]
        };
    };
    MdTabsModule = __decorate$47([
        _angular_core.NgModule({
            imports: [_angular_common.CommonModule, PortalModule, MdRippleModule],
            // Don't export all components because some are only to be used internally.
            exports: [MdTabGroup, MdTabLabel, MdTab, MdTabNavBar, MdTabLink, MdTabLinkRipple],
            declarations: [MdTabGroup, MdTabLabel, MdTab, MdInkBar, MdTabLabelWrapper,
                MdTabNavBar, MdTabLink, MdTabBody, MdTabLinkRipple, MdTabHeader],
        }), 
        __metadata$47('design:paramtypes', [])
    ], MdTabsModule);
    return MdTabsModule;
}());

var __decorate$55 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$55 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdToolbarRow = (function () {
    function MdToolbarRow() {
    }
    MdToolbarRow = __decorate$55([
        _angular_core.Directive({
            selector: 'md-toolbar-row, mat-toolbar-row'
        }), 
        __metadata$55('design:paramtypes', [])
    ], MdToolbarRow);
    return MdToolbarRow;
}());
var MdToolbar = (function () {
    function MdToolbar(elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    Object.defineProperty(MdToolbar.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    MdToolbar.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    MdToolbar.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this.renderer.setElementClass(this.elementRef.nativeElement, "md-" + color, isAdd);
        }
    };
    __decorate$55([
        _angular_core.Input(), 
        __metadata$55('design:type', String)
    ], MdToolbar.prototype, "color", null);
    MdToolbar = __decorate$55([
        _angular_core.Component({selector: 'md-toolbar, mat-toolbar',
            template: "<div class=\"md-toolbar-layout\"><md-toolbar-row><ng-content></ng-content></md-toolbar-row><ng-content select=\"md-toolbar-row, mat-toolbar-row\"></ng-content></div>",
            styles: ["md-toolbar,md-toolbar md-toolbar-row{display:flex;box-sizing:border-box;width:100%}md-toolbar{font-size:20px;font-weight:400;font-family:Roboto,\"Helvetica Neue\",sans-serif;padding:0 16px;flex-direction:column;min-height:64px}md-toolbar md-toolbar-row{flex-direction:row;align-items:center}md-toolbar-row{height:64px}@media (max-width:600px) and (orientation:portrait){md-toolbar{min-height:56px}md-toolbar-row{height:56px}}@media (max-width:960px) and (orientation:landscape){md-toolbar{min-height:48px}md-toolbar-row{height:48px}}"],
            changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
            encapsulation: _angular_core.ViewEncapsulation.None
        }), 
        __metadata$55('design:paramtypes', [_angular_core.ElementRef, _angular_core.Renderer])
    ], MdToolbar);
    return MdToolbar;
}());
var MdToolbarModule = (function () {
    function MdToolbarModule() {
    }
    MdToolbarModule.forRoot = function () {
        return {
            ngModule: MdToolbarModule,
            providers: []
        };
    };
    MdToolbarModule = __decorate$55([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdToolbar, MdToolbarRow, DefaultStyleCompatibilityModeModule],
            declarations: [MdToolbar, MdToolbarRow],
        }), 
        __metadata$55('design:paramtypes', [])
    ], MdToolbarModule);
    return MdToolbarModule;
}());

var __extends$19 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Exception thrown when a tooltip has an invalid position. */
var MdTooltipInvalidPositionError = (function (_super) {
    __extends$19(MdTooltipInvalidPositionError, _super);
    function MdTooltipInvalidPositionError(position) {
        _super.call(this, "Tooltip position \"" + position + "\" is invalid.");
    }
    return MdTooltipInvalidPositionError;
}(MdError));

var __decorate$56 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$56 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$12 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/** Time in ms to delay before changing the tooltip visibility to hidden */
var TOUCHEND_HIDE_DELAY = 1500;
/**
 * Directive that attaches a material design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 *
 * https://material.google.com/components/tooltips.html
 */
var MdTooltip = (function () {
    function MdTooltip(_overlay, _elementRef, _viewContainerRef, _ngZone, _dir) {
        this._overlay = _overlay;
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._ngZone = _ngZone;
        this._dir = _dir;
        /** Allows the user to define the position of the tooltip relative to the parent element */
        this._position = 'below';
        /** The default delay in ms before showing the tooltip after show is called */
        this.showDelay = 0;
        /** The default delay in ms before hiding the tooltip after hide is called */
        this.hideDelay = 0;
    }
    Object.defineProperty(MdTooltip.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            if (value !== this._position) {
                this._position = value;
                // TODO(andrewjs): When the overlay's position can be dynamically changed, do not destroy
                // the tooltip.
                if (this._tooltipInstance) {
                    this._disposeTooltip();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_positionDeprecated", {
        /** @deprecated */
        get: function () { return this._position; },
        set: function (value) { this._position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "message", {
        get: function () {
            return this._message;
        },
        set: function (value) {
            this._message = value;
            if (this._tooltipInstance) {
                this._setTooltipMessage(this._message);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdTooltip.prototype, "_deprecatedMessage", {
        /** @deprecated */
        get: function () { return this.message; },
        set: function (v) { this.message = v; },
        enumerable: true,
        configurable: true
    });
    /** Dispose the tooltip when destroyed */
    MdTooltip.prototype.ngOnDestroy = function () {
        if (this._tooltipInstance) {
            this._disposeTooltip();
        }
    };
    /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
    MdTooltip.prototype.show = function (delay) {
        if (delay === void 0) { delay = this.showDelay; }
        if (!this._message || !this._message.trim()) {
            return;
        }
        if (!this._tooltipInstance) {
            this._createTooltip();
        }
        this._setTooltipMessage(this._message);
        this._tooltipInstance.show(this._position, delay);
    };
    /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
    MdTooltip.prototype.hide = function (delay) {
        if (delay === void 0) { delay = this.hideDelay; }
        if (this._tooltipInstance) {
            this._tooltipInstance.hide(delay);
        }
    };
    /** Shows/hides the tooltip */
    MdTooltip.prototype.toggle = function () {
        this._isTooltipVisible() ? this.hide() : this.show();
    };
    /** Returns true if the tooltip is currently visible to the user */
    MdTooltip.prototype._isTooltipVisible = function () {
        return this._tooltipInstance && this._tooltipInstance.isVisible();
    };
    /** Create the tooltip to display */
    MdTooltip.prototype._createTooltip = function () {
        var _this = this;
        this._createOverlay();
        var portal = new ComponentPortal(TooltipComponent, this._viewContainerRef);
        this._tooltipInstance = this._overlayRef.attach(portal).instance;
        // Dispose the overlay when finished the shown tooltip.
        this._tooltipInstance.afterHidden().subscribe(function () {
            // Check first if the tooltip has already been removed through this components destroy.
            if (_this._tooltipInstance) {
                _this._disposeTooltip();
            }
        });
    };
    /** Create the overlay config and position strategy */
    MdTooltip.prototype._createOverlay = function () {
        var origin = this._getOrigin();
        var position = this._getOverlayPosition();
        var strategy = this._overlay.position().connectedTo(this._elementRef, origin, position);
        var config = new OverlayState();
        config.positionStrategy = strategy;
        this._overlayRef = this._overlay.create(config);
    };
    /** Disposes the current tooltip and the overlay it is attached to */
    MdTooltip.prototype._disposeTooltip = function () {
        this._overlayRef.dispose();
        this._overlayRef = null;
        this._tooltipInstance = null;
    };
    /** Returns the origin position based on the user's position preference */
    MdTooltip.prototype._getOrigin = function () {
        if (this.position == 'above' || this.position == 'below') {
            return { originX: 'center', originY: this.position == 'above' ? 'top' : 'bottom' };
        }
        var isDirectionLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isDirectionLtr ||
            this.position == 'after' && !isDirectionLtr) {
            return { originX: 'start', originY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isDirectionLtr ||
            this.position == 'before' && !isDirectionLtr) {
            return { originX: 'end', originY: 'center' };
        }
        throw new MdTooltipInvalidPositionError(this.position);
    };
    /** Returns the overlay position based on the user's preference */
    MdTooltip.prototype._getOverlayPosition = function () {
        if (this.position == 'above') {
            return { overlayX: 'center', overlayY: 'bottom' };
        }
        if (this.position == 'below') {
            return { overlayX: 'center', overlayY: 'top' };
        }
        var isLtr = !this._dir || this._dir.value == 'ltr';
        if (this.position == 'left' ||
            this.position == 'before' && isLtr ||
            this.position == 'after' && !isLtr) {
            return { overlayX: 'end', overlayY: 'center' };
        }
        if (this.position == 'right' ||
            this.position == 'after' && isLtr ||
            this.position == 'before' && !isLtr) {
            return { overlayX: 'start', overlayY: 'center' };
        }
        throw new MdTooltipInvalidPositionError(this.position);
    };
    /** Updates the tooltip message and repositions the overlay according to the new message length */
    MdTooltip.prototype._setTooltipMessage = function (message) {
        var _this = this;
        // Must wait for the message to be painted to the tooltip so that the overlay can properly
        // calculate the correct positioning based on the size of the text.
        this._tooltipInstance.message = message;
        this._ngZone.onMicrotaskEmpty.first().subscribe(function () {
            if (_this._tooltipInstance) {
                _this._overlayRef.updatePosition();
            }
        });
    };
    __decorate$56([
        _angular_core.Input('mdTooltipPosition'), 
        __metadata$56('design:type', String)
    ], MdTooltip.prototype, "position", null);
    __decorate$56([
        _angular_core.Input('tooltip-position'), 
        __metadata$56('design:type', String)
    ], MdTooltip.prototype, "_positionDeprecated", null);
    __decorate$56([
        _angular_core.Input('mdTooltipShowDelay'), 
        __metadata$56('design:type', Object)
    ], MdTooltip.prototype, "showDelay", void 0);
    __decorate$56([
        _angular_core.Input('mdTooltipHideDelay'), 
        __metadata$56('design:type', Object)
    ], MdTooltip.prototype, "hideDelay", void 0);
    __decorate$56([
        _angular_core.Input('mdTooltip'), 
        __metadata$56('design:type', Object)
    ], MdTooltip.prototype, "message", null);
    __decorate$56([
        _angular_core.Input('md-tooltip'), 
        __metadata$56('design:type', String)
    ], MdTooltip.prototype, "_deprecatedMessage", null);
    MdTooltip = __decorate$56([
        _angular_core.Directive({
            selector: '[md-tooltip], [mat-tooltip], [mdTooltip]',
            host: {
                '(longpress)': 'show()',
                '(touchend)': 'hide(' + TOUCHEND_HIDE_DELAY + ')',
                '(mouseenter)': 'show()',
                '(mouseleave)': 'hide()',
            },
            exportAs: 'mdTooltip',
        }),
        __param$12(4, _angular_core.Optional()), 
        __metadata$56('design:paramtypes', [Overlay, _angular_core.ElementRef, _angular_core.ViewContainerRef, _angular_core.NgZone, Dir])
    ], MdTooltip);
    return MdTooltip;
}());
var TooltipComponent = (function () {
    function TooltipComponent(_dir) {
        this._dir = _dir;
        /** Property watched by the animation framework to show or hide the tooltip */
        this._visibility = 'initial';
        /** Whether interactions on the page should close the tooltip */
        this._closeOnInteraction = false;
        /** The transform origin used in the animation for showing and hiding the tooltip */
        this._transformOrigin = 'bottom';
        /** Subject for notifying that the tooltip has been hidden from the view */
        this._onHide = new rxjs_Subject.Subject();
    }
    /** Shows the tooltip with an animation originating from the provided origin */
    TooltipComponent.prototype.show = function (position, delay) {
        var _this = this;
        // Cancel the delayed hide if it is scheduled
        if (this._hideTimeoutId) {
            clearTimeout(this._hideTimeoutId);
        }
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._setTransformOrigin(position);
        this._showTimeoutId = setTimeout(function () {
            _this._visibility = 'visible';
            // If this was set to true immediately, then a body click that triggers show() would
            // trigger interaction and close the tooltip right after it was displayed.
            _this._closeOnInteraction = false;
            setTimeout(function () { _this._closeOnInteraction = true; }, 0);
        }, delay);
    };
    /** Begins the animation to hide the tooltip after the provided delay in ms */
    TooltipComponent.prototype.hide = function (delay) {
        var _this = this;
        // Cancel the delayed show if it is scheduled
        if (this._showTimeoutId) {
            clearTimeout(this._showTimeoutId);
        }
        this._hideTimeoutId = setTimeout(function () {
            _this._visibility = 'hidden';
            _this._closeOnInteraction = false;
        }, delay);
    };
    /** Returns an observable that notifies when the tooltip has been hidden from view */
    TooltipComponent.prototype.afterHidden = function () {
        return this._onHide.asObservable();
    };
    /** Whether the tooltip is being displayed */
    TooltipComponent.prototype.isVisible = function () {
        return this._visibility === 'visible';
    };
    /** Sets the tooltip transform origin according to the tooltip position */
    TooltipComponent.prototype._setTransformOrigin = function (value) {
        var isLtr = !this._dir || this._dir.value == 'ltr';
        switch (value) {
            case 'before':
                this._transformOrigin = isLtr ? 'right' : 'left';
                break;
            case 'after':
                this._transformOrigin = isLtr ? 'left' : 'right';
                break;
            case 'left':
                this._transformOrigin = 'right';
                break;
            case 'right':
                this._transformOrigin = 'left';
                break;
            case 'above':
                this._transformOrigin = 'bottom';
                break;
            case 'below':
                this._transformOrigin = 'top';
                break;
            default: throw new MdTooltipInvalidPositionError(value);
        }
    };
    TooltipComponent.prototype._afterVisibilityAnimation = function (e) {
        if (e.toState === 'hidden' && !this.isVisible()) {
            this._onHide.next();
        }
    };
    /**
     * Interactions on the HTML body should close the tooltip immediately as defined in the
     * material design spec.
     * https://material.google.com/components/tooltips.html#tooltips-interaction
     */
    TooltipComponent.prototype._handleBodyInteraction = function () {
        if (this._closeOnInteraction) {
            this.hide(0);
        }
    };
    TooltipComponent = __decorate$56([
        _angular_core.Component({selector: 'md-tooltip-component, mat-tooltip-component',
            template: "<div class=\"md-tooltip\" [style.transform-origin]=\"_transformOrigin\" [@state]=\"_visibility\" (@state.done)=\"_afterVisibilityAnimation($event)\">{{message}}</div>",
            styles: [":host{pointer-events:none}.md-tooltip{color:#fff;padding:0 8px;border-radius:2px;font-family:Roboto,\"Helvetica Neue\",sans-serif;font-size:10px;margin:14px;height:22px;line-height:22px}@media screen and (-ms-high-contrast:active){.md-tooltip{outline:solid 1px}}"],
            animations: [
                _angular_core.trigger('state', [
                    _angular_core.state('void', _angular_core.style({ transform: 'scale(0)' })),
                    _angular_core.state('initial', _angular_core.style({ transform: 'scale(0)' })),
                    _angular_core.state('visible', _angular_core.style({ transform: 'scale(1)' })),
                    _angular_core.state('hidden', _angular_core.style({ transform: 'scale(0)' })),
                    _angular_core.transition('* => visible', _angular_core.animate('150ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
                    _angular_core.transition('* => hidden', _angular_core.animate('150ms cubic-bezier(0.4, 0.0, 1, 1)')),
                ])
            ],
            host: {
                '(body:click)': 'this._handleBodyInteraction()'
            }
        }),
        __param$12(0, _angular_core.Optional()), 
        __metadata$56('design:paramtypes', [Dir])
    ], TooltipComponent);
    return TooltipComponent;
}());
var MdTooltipModule = (function () {
    function MdTooltipModule() {
    }
    MdTooltipModule.forRoot = function () {
        return {
            ngModule: MdTooltipModule,
            providers: OVERLAY_PROVIDERS,
        };
    };
    MdTooltipModule = __decorate$56([
        _angular_core.NgModule({
            imports: [OverlayModule, DefaultStyleCompatibilityModeModule],
            exports: [MdTooltip, TooltipComponent, DefaultStyleCompatibilityModeModule],
            declarations: [MdTooltip, TooltipComponent],
            entryComponents: [TooltipComponent],
        }), 
        __metadata$56('design:paramtypes', [])
    ], MdTooltipModule);
    return MdTooltipModule;
}());

var __extends$20 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Exception thrown when menu trigger doesn't have a valid md-menu instance
 * @docs-private
 */
var MdMenuMissingError = (function (_super) {
    __extends$20(MdMenuMissingError, _super);
    function MdMenuMissingError() {
        _super.call(this, "md-menu-trigger: must pass in an md-menu instance.\n\n    Example:\n      <md-menu #menu=\"mdMenu\"></md-menu>\n      <button [mdMenuTriggerFor]=\"menu\"></button>\n    ");
    }
    return MdMenuMissingError;
}(MdError));
/**
 * Exception thrown when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 * @docs-private
 */
var MdMenuInvalidPositionX = (function (_super) {
    __extends$20(MdMenuInvalidPositionX, _super);
    function MdMenuInvalidPositionX() {
        _super.call(this, "x-position value must be either 'before' or after'.\n      Example: <md-menu x-position=\"before\" #menu=\"mdMenu\"></md-menu>\n    ");
    }
    return MdMenuInvalidPositionX;
}(MdError));
/**
 * Exception thrown when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 * @docs-private
 */
var MdMenuInvalidPositionY = (function (_super) {
    __extends$20(MdMenuInvalidPositionY, _super);
    function MdMenuInvalidPositionY() {
        _super.call(this, "y-position value must be either 'above' or below'.\n      Example: <md-menu y-position=\"above\" #menu=\"mdMenu\"></md-menu>\n    ");
    }
    return MdMenuInvalidPositionY;
}(MdError));

var __decorate$59 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$59 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * This directive is intended to be used inside an md-menu tag.
 * It exists mostly to set the role attribute.
 */
var MdMenuItem = (function () {
    function MdMenuItem(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    MdMenuItem.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._elementRef.nativeElement, 'focus');
    };
    Object.defineProperty(MdMenuItem.prototype, "disabled", {
        // this is necessary to support anchors
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = (value === false || value === undefined) ? null : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuItem.prototype, "isAriaDisabled", {
        get: function () {
            return String(!!this.disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMenuItem.prototype, "_tabindex", {
        get: function () {
            return this.disabled ? '-1' : '0';
        },
        enumerable: true,
        configurable: true
    });
    MdMenuItem.prototype._getHostElement = function () {
        return this._elementRef.nativeElement;
    };
    MdMenuItem.prototype._checkDisabled = function (event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
        }
    };
    __decorate$59([
        _angular_core.HostBinding('attr.disabled'),
        _angular_core.Input(), 
        __metadata$59('design:type', Boolean)
    ], MdMenuItem.prototype, "disabled", null);
    __decorate$59([
        _angular_core.HostBinding('attr.aria-disabled'), 
        __metadata$59('design:type', String)
    ], MdMenuItem.prototype, "isAriaDisabled", null);
    MdMenuItem = __decorate$59([
        _angular_core.Component({selector: '[md-menu-item], [mat-menu-item]',
            host: {
                'role': 'menuitem',
                '(click)': '_checkDisabled($event)',
                '[attr.tabindex]': '_tabindex'
            },
            template: "<ng-content></ng-content><div class=\"md-menu-ripple\" *ngif=\"!disabled\" md-ripple mdripplebackgroundcolor=\"rgba(0,0,0,0)\" [mdrippletrigger]=\"_getHostElement()\"></div>",
            exportAs: 'mdMenuItem'
        }), 
        __metadata$59('design:paramtypes', [_angular_core.Renderer, _angular_core.ElementRef])
    ], MdMenuItem);
    return MdMenuItem;
}());

/**
 * Below are all the animations for the md-menu component.
 * Animation duration and timing values are based on Material 1.
 */
/**
 * This animation controls the menu panel's entry and exit from the page.
 *
 * When the menu panel is added to the DOM, it scales in and fades in its border.
 *
 * When the menu panel is removed from the DOM, it simply fades out after a brief
 * delay to display the ripple.
 *
 * TODO(kara): switch to :enter and :leave once Mobile Safari is sorted out.
 */
var transformMenu = _angular_core.trigger('transformMenu', [
    _angular_core.state('showing', _angular_core.style({
        opacity: 1,
        transform: "scale(1)"
    })),
    _angular_core.transition('void => *', [
        _angular_core.style({
            opacity: 0,
            transform: "scale(0)"
        }),
        _angular_core.animate("200ms cubic-bezier(0.25, 0.8, 0.25, 1)")
    ]),
    _angular_core.transition('* => void', [
        _angular_core.animate('50ms 100ms linear', _angular_core.style({ opacity: 0 }))
    ])
]);
/**
 * This animation fades in the background color and content of the menu panel
 * after its containing element is scaled in.
 */
var fadeInItems = _angular_core.trigger('fadeInItems', [
    _angular_core.state('showing', _angular_core.style({ opacity: 1 })),
    _angular_core.transition('void => *', [
        _angular_core.style({ opacity: 0 }),
        _angular_core.animate("200ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)")
    ])
]);

// TODO(kara): prevent-close functionality
var __decorate$58 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$58 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$13 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MdMenu = (function () {
    function MdMenu(posX, posY) {
        /** Config object to be passed into the menu's ngClass */
        this._classList = {};
        this.positionX = 'after';
        this.positionY = 'below';
        this.close = new _angular_core.EventEmitter();
        if (posX) {
            this._setPositionX(posX);
        }
        if (posY) {
            this._setPositionY(posY);
        }
        this.setPositionClasses(this.positionX, this.positionY);
    }
    MdMenu.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._keyManager = new ListKeyManager(this.items).withFocusWrap();
        this._tabSubscription = this._keyManager.tabOut.subscribe(function () {
            _this._emitCloseEvent();
        });
    };
    MdMenu.prototype.ngOnDestroy = function () {
        this._tabSubscription.unsubscribe();
    };
    Object.defineProperty(MdMenu.prototype, "classList", {
        /**
         * This method takes classes set on the host md-menu element and applies them on the
         * menu template that displays in the overlay container.  Otherwise, it's difficult
         * to style the containing menu from outside the component.
         * @param classes list of class names
         */
        set: function (classes) {
            this._classList = classes.split(' ').reduce(function (obj, className) {
                obj[className] = true;
                return obj;
            }, {});
            this.setPositionClasses(this.positionX, this.positionY);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Focus the first item in the menu. This method is used by the menu trigger
     * to focus the first item when the menu is opened by the ENTER key.
     */
    MdMenu.prototype.focusFirstItem = function () {
        this._keyManager.focusFirstItem();
    };
    /**
     * This emits a close event to which the trigger is subscribed. When emitted, the
     * trigger will close the menu.
     */
    MdMenu.prototype._emitCloseEvent = function () {
        this.close.emit();
    };
    MdMenu.prototype._setPositionX = function (pos) {
        if (pos !== 'before' && pos !== 'after') {
            throw new MdMenuInvalidPositionX();
        }
        this.positionX = pos;
    };
    MdMenu.prototype._setPositionY = function (pos) {
        if (pos !== 'above' && pos !== 'below') {
            throw new MdMenuInvalidPositionY();
        }
        this.positionY = pos;
    };
    /**
     * It's necessary to set position-based classes to ensure the menu panel animation
     * folds out from the correct direction.
     */
    MdMenu.prototype.setPositionClasses = function (posX, posY) {
        this._classList['md-menu-before'] = posX == 'before';
        this._classList['md-menu-after'] = posX == 'after';
        this._classList['md-menu-above'] = posY == 'above';
        this._classList['md-menu-below'] = posY == 'below';
    };
    __decorate$58([
        _angular_core.ViewChild(_angular_core.TemplateRef), 
        __metadata$58('design:type', _angular_core.TemplateRef)
    ], MdMenu.prototype, "templateRef", void 0);
    __decorate$58([
        _angular_core.ContentChildren(MdMenuItem), 
        __metadata$58('design:type', _angular_core.QueryList)
    ], MdMenu.prototype, "items", void 0);
    __decorate$58([
        _angular_core.Input('class'), 
        __metadata$58('design:type', String), 
        __metadata$58('design:paramtypes', [String])
    ], MdMenu.prototype, "classList", null);
    __decorate$58([
        _angular_core.Output(), 
        __metadata$58('design:type', Object)
    ], MdMenu.prototype, "close", void 0);
    MdMenu = __decorate$58([
        _angular_core.Component({selector: 'md-menu, mat-menu',
            host: { 'role': 'menu' },
            template: "<template><div class=\"md-menu-panel\" [ngclass]=\"_classList\" (keydown)=\"_keyManager.onKeydown($event)\" (click)=\"_emitCloseEvent()\" [@transformmenu]=\"'showing'\"><div class=\"md-menu-content\" [@fadeinitems]=\"'showing'\"><ng-content></ng-content></div></div></template>",
            styles: [".md-menu-panel{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;max-height:calc(100vh + 48px)}.md-menu-panel.md-menu-after.md-menu-below{transform-origin:left top}.md-menu-panel.md-menu-after.md-menu-above{transform-origin:left bottom}.md-menu-panel.md-menu-before.md-menu-below{transform-origin:right top}.md-menu-panel.md-menu-before.md-menu-above{transform-origin:right bottom}[dir=rtl] .md-menu-panel.md-menu-after.md-menu-below{transform-origin:right top}[dir=rtl] .md-menu-panel.md-menu-after.md-menu-above{transform-origin:right bottom}[dir=rtl] .md-menu-panel.md-menu-before.md-menu-below{transform-origin:left top}[dir=rtl] .md-menu-panel.md-menu-before.md-menu-above{transform-origin:left bottom}@media screen and (-ms-high-contrast:active){.md-menu-panel{outline:solid 1px}}.md-menu-content{padding-top:8px;padding-bottom:8px}[md-menu-item]{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;border:none;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis;display:flex;flex-direction:row;align-items:center;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:start;text-decoration:none;position:relative}[md-menu-item][disabled]{cursor:default}[md-menu-item] md-icon{margin-right:16px}[dir=rtl] [md-menu-item] md-icon{margin-left:16px}button[md-menu-item]{width:100%}.md-menu-ripple{position:absolute;top:0;left:0;bottom:0;right:0}"],
            encapsulation: _angular_core.ViewEncapsulation.None,
            animations: [
                transformMenu,
                fadeInItems
            ],
            exportAs: 'mdMenu'
        }),
        __param$13(0, _angular_core.Attribute('x-position')),
        __param$13(1, _angular_core.Attribute('y-position')), 
        __metadata$58('design:paramtypes', [String, String])
    ], MdMenu);
    return MdMenu;
}());

var __decorate$60 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$60 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param$14 = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 * This directive is intended to be used in conjunction with an md-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
var MdMenuTrigger = (function () {
    function MdMenuTrigger(_overlay, _element, _viewContainerRef, _renderer, _dir) {
        this._overlay = _overlay;
        this._element = _element;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._dir = _dir;
        this._menuOpen = false;
        // tracking input type is necessary so it's possible to only auto-focus
        // the first item of the list when the menu is opened via the keyboard
        this._openedByMouse = false;
        this.onMenuOpen = new _angular_core.EventEmitter();
        this.onMenuClose = new _angular_core.EventEmitter();
    }
    Object.defineProperty(MdMenuTrigger.prototype, "_deprecatedMenuTriggerFor", {
        /** @deprecated */
        get: function () { return this.menu; },
        set: function (v) { this.menu = v; },
        enumerable: true,
        configurable: true
    });
    MdMenuTrigger.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._checkMenu();
        this.menu.close.subscribe(function () { return _this.closeMenu(); });
    };
    MdMenuTrigger.prototype.ngOnDestroy = function () { this.destroyMenu(); };
    Object.defineProperty(MdMenuTrigger.prototype, "menuOpen", {
        get: function () { return this._menuOpen; },
        enumerable: true,
        configurable: true
    });
    MdMenuTrigger.prototype.toggleMenu = function () {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    };
    MdMenuTrigger.prototype.openMenu = function () {
        if (!this._menuOpen) {
            this._createOverlay();
            this._overlayRef.attach(this._portal);
            this._subscribeToBackdrop();
            this._initMenu();
        }
    };
    MdMenuTrigger.prototype.closeMenu = function () {
        if (this._overlayRef) {
            this._overlayRef.detach();
            this._backdropSubscription.unsubscribe();
            this._resetMenu();
        }
    };
    MdMenuTrigger.prototype.destroyMenu = function () {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
            this._cleanUpSubscriptions();
        }
    };
    MdMenuTrigger.prototype.focus = function () {
        this._renderer.invokeElementMethod(this._element.nativeElement, 'focus');
    };
    Object.defineProperty(MdMenuTrigger.prototype, "dir", {
        /** The text direction of the containing app. */
        get: function () {
            return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method ensures that the menu closes when the overlay backdrop is clicked.
     * We do not use first() here because doing so would not catch clicks from within
     * the menu, and it would fail to unsubscribe properly. Instead, we unsubscribe
     * explicitly when the menu is closed or destroyed.
     */
    MdMenuTrigger.prototype._subscribeToBackdrop = function () {
        var _this = this;
        this._backdropSubscription = this._overlayRef.backdropClick().subscribe(function () {
            _this.closeMenu();
        });
    };
    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    MdMenuTrigger.prototype._initMenu = function () {
        this._setIsMenuOpen(true);
        // Should only set focus if opened via the keyboard, so keyboard users can
        // can easily navigate menu items. According to spec, mouse users should not
        // see the focus style.
        if (!this._openedByMouse) {
            this.menu.focusFirstItem();
        }
    };
    ;
    /**
     * This method resets the menu when it's closed, most importantly restoring
     * focus to the menu trigger if the menu was opened via the keyboard.
     */
    MdMenuTrigger.prototype._resetMenu = function () {
        this._setIsMenuOpen(false);
        // Focus only needs to be reset to the host element if the menu was opened
        // by the keyboard and manually shifted to the first menu item.
        if (!this._openedByMouse) {
            this.focus();
        }
        this._openedByMouse = false;
    };
    // set state rather than toggle to support triggers sharing a menu
    MdMenuTrigger.prototype._setIsMenuOpen = function (isOpen) {
        this._menuOpen = isOpen;
        this._menuOpen ? this.onMenuOpen.emit() : this.onMenuClose.emit();
    };
    /**
     *  This method checks that a valid instance of MdMenu has been passed into
     *  mdMenuTriggerFor. If not, an exception is thrown.
     */
    MdMenuTrigger.prototype._checkMenu = function () {
        if (!this.menu) {
            throw new MdMenuMissingError();
        }
    };
    /**
     *  This method creates the overlay from the provided menu's template and saves its
     *  OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    MdMenuTrigger.prototype._createOverlay = function () {
        if (!this._overlayRef) {
            this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
            var config = this._getOverlayConfig();
            this._subscribeToPositions(config.positionStrategy);
            this._overlayRef = this._overlay.create(config);
        }
    };
    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayState
     */
    MdMenuTrigger.prototype._getOverlayConfig = function () {
        var overlayState = new OverlayState();
        overlayState.positionStrategy = this._getPosition()
            .withDirection(this.dir);
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'md-overlay-transparent-backdrop';
        overlayState.direction = this.dir;
        return overlayState;
    };
    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    MdMenuTrigger.prototype._subscribeToPositions = function (position) {
        var _this = this;
        this._positionSubscription = position.onPositionChange.subscribe(function (change) {
            var posX = change.connectionPair.originX === 'start' ? 'after' : 'before';
            var posY = change.connectionPair.originY === 'top' ? 'below' : 'above';
            _this.menu.setPositionClasses(posX, posY);
        });
    };
    /**
     * This method builds the position strategy for the overlay, so the menu is properly connected
     * to the trigger.
     * @returns ConnectedPositionStrategy
     */
    MdMenuTrigger.prototype._getPosition = function () {
        var _a = this.menu.positionX === 'before' ? ['end', 'start'] : ['start', 'end'], posX = _a[0], fallbackX = _a[1];
        var _b = this.menu.positionY === 'above' ? ['bottom', 'top'] : ['top', 'bottom'], posY = _b[0], fallbackY = _b[1];
        return this._overlay.position()
            .connectedTo(this._element, { originX: posX, originY: posY }, { overlayX: posX, overlayY: posY })
            .withFallbackPosition({ originX: fallbackX, originY: posY }, { overlayX: fallbackX, overlayY: posY })
            .withFallbackPosition({ originX: posX, originY: fallbackY }, { overlayX: posX, overlayY: fallbackY })
            .withFallbackPosition({ originX: fallbackX, originY: fallbackY }, { overlayX: fallbackX, overlayY: fallbackY });
    };
    MdMenuTrigger.prototype._cleanUpSubscriptions = function () {
        if (this._backdropSubscription) {
            this._backdropSubscription.unsubscribe();
        }
        if (this._positionSubscription) {
            this._positionSubscription.unsubscribe();
        }
    };
    MdMenuTrigger.prototype._handleMousedown = function (event) {
        if (!isFakeMousedownFromScreenReader(event)) {
            this._openedByMouse = true;
        }
    };
    __decorate$60([
        _angular_core.Input('md-menu-trigger-for'), 
        __metadata$60('design:type', Object)
    ], MdMenuTrigger.prototype, "_deprecatedMenuTriggerFor", null);
    __decorate$60([
        _angular_core.Input('mdMenuTriggerFor'), 
        __metadata$60('design:type', Object)
    ], MdMenuTrigger.prototype, "menu", void 0);
    __decorate$60([
        _angular_core.Output(), 
        __metadata$60('design:type', Object)
    ], MdMenuTrigger.prototype, "onMenuOpen", void 0);
    __decorate$60([
        _angular_core.Output(), 
        __metadata$60('design:type', Object)
    ], MdMenuTrigger.prototype, "onMenuClose", void 0);
    MdMenuTrigger = __decorate$60([
        _angular_core.Directive({
            selector: '[md-menu-trigger-for], [mat-menu-trigger-for], [mdMenuTriggerFor]',
            host: {
                'aria-haspopup': 'true',
                '(mousedown)': '_handleMousedown($event)',
                '(click)': 'toggleMenu()',
            },
            exportAs: 'mdMenuTrigger'
        }),
        __param$14(4, _angular_core.Optional()), 
        __metadata$60('design:paramtypes', [Overlay, _angular_core.ElementRef, _angular_core.ViewContainerRef, _angular_core.Renderer, Dir])
    ], MdMenuTrigger);
    return MdMenuTrigger;
}());

var __decorate$57 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$57 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdMenuModule = (function () {
    function MdMenuModule() {
    }
    MdMenuModule.forRoot = function () {
        return {
            ngModule: MdMenuModule,
            providers: OVERLAY_PROVIDERS,
        };
    };
    MdMenuModule = __decorate$57([
        _angular_core.NgModule({
            imports: [OverlayModule, _angular_common.CommonModule, MdRippleModule, DefaultStyleCompatibilityModeModule],
            exports: [MdMenu, MdMenuItem, MdMenuTrigger, DefaultStyleCompatibilityModeModule],
            declarations: [MdMenu, MdMenuItem, MdMenuTrigger],
        }), 
        __metadata$57('design:paramtypes', [])
    ], MdMenuModule);
    return MdMenuModule;
}());

// TODO(jelbourn): resizing
// TODO(jelbourn): afterOpen and beforeClose
/**
 * Reference to a dialog opened via the MdDialog service.
 */
var MdDialogRef = (function () {
    function MdDialogRef(_overlayRef) {
        this._overlayRef = _overlayRef;
        /** Subject for notifying the user that the dialog has finished closing. */
        this._afterClosed = new rxjs_Subject.Subject();
    }
    /**
     * Close the dialog.
     * @param dialogResult Optional result to return to the dialog opener.
     */
    MdDialogRef.prototype.close = function (dialogResult) {
        this._overlayRef.dispose();
        this._afterClosed.next(dialogResult);
        this._afterClosed.complete();
    };
    /** Gets an observable that is notified when the dialog is finished closing. */
    MdDialogRef.prototype.afterClosed = function () {
        return this._afterClosed.asObservable();
    };
    return MdDialogRef;
}());

/** Custom injector type specifically for instantiating components with a dialog. */
var DialogInjector = (function () {
    function DialogInjector(_dialogRef, _parentInjector) {
        this._dialogRef = _dialogRef;
        this._parentInjector = _parentInjector;
    }
    DialogInjector.prototype.get = function (token, notFoundValue) {
        if (token === MdDialogRef) {
            return this._dialogRef;
        }
        return this._parentInjector.get(token, notFoundValue);
    };
    return DialogInjector;
}());

;
/**
 * Configuration for opening a modal dialog with the MdDialog service.
 */
var MdDialogConfig = (function () {
    function MdDialogConfig() {
        /** The ARIA role of the dialog element. */
        this.role = 'dialog';
        /** Whether the user can use escape or clicking outside to close a modal. */
        this.disableClose = false;
        /** Width of the dialog. */
        this.width = '';
        /** Height of the dialog. */
        this.height = '';
    }
    return MdDialogConfig;
}());

var __extends$22 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Exception thrown when a ComponentPortal is attached to a DomPortalHost without an origin. */
var MdDialogContentAlreadyAttachedError = (function (_super) {
    __extends$22(MdDialogContentAlreadyAttachedError, _super);
    function MdDialogContentAlreadyAttachedError() {
        _super.call(this, 'Attempting to attach dialog content after content is already attached');
    }
    return MdDialogContentAlreadyAttachedError;
}(MdError));

var __extends$21 = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate$63 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$63 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Internal component that wraps user-provided dialog content.
 * @docs-private
 */
var MdDialogContainer = (function (_super) {
    __extends$21(MdDialogContainer, _super);
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
    __decorate$63([
        _angular_core.ViewChild(PortalHostDirective), 
        __metadata$63('design:type', PortalHostDirective)
    ], MdDialogContainer.prototype, "_portalHost", void 0);
    __decorate$63([
        _angular_core.ViewChild(FocusTrap), 
        __metadata$63('design:type', FocusTrap)
    ], MdDialogContainer.prototype, "_focusTrap", void 0);
    MdDialogContainer = __decorate$63([
        _angular_core.Component({selector: 'md-dialog-container, mat-dialog-container',
            template: "<focus-trap><template portalhost></template></focus-trap>",
            styles: ["md-dialog-container{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);display:block;padding:24px;border-radius:2px;box-sizing:border-box;overflow:auto;max-width:80vw;width:100%;height:100%}@media screen and (-ms-high-contrast:active){md-dialog-container{outline:solid 1px}}[mat-dialog-content],[md-dialog-content],mat-dialog-content,md-dialog-content{display:block;margin:0 -24px;padding:0 24px;max-height:65vh;overflow:auto}[mat-dialog-title],[md-dialog-title]{font-size:20px;font-weight:700;margin:0 0 20px;display:block}[mat-dialog-actions],[md-dialog-actions],mat-dialog-actions,md-dialog-actions{padding:12px 0;display:block}[mat-dialog-actions]:last-child,[md-dialog-actions]:last-child,mat-dialog-actions:last-child,md-dialog-actions:last-child{margin-bottom:-24px}"],
            host: {
                'class': 'md-dialog-container',
                '[attr.role]': 'dialogConfig?.role',
                '(keydown.escape)': 'handleEscapeKey()',
            },
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$63('design:paramtypes', [_angular_core.NgZone])
    ], MdDialogContainer);
    return MdDialogContainer;
}(BasePortalHost));

var __decorate$62 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$62 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// TODO(jelbourn): add support for opening with a TemplateRef
// TODO(jelbourn): animations
/**
 * Service to open Material Design modal dialogs.
 */
var MdDialog = (function () {
    function MdDialog(_overlay, _injector) {
        this._overlay = _overlay;
        this._injector = _injector;
        /** Keeps track of the currently-open dialogs. */
        this._openDialogs = [];
    }
    /**
     * Opens a modal dialog containing the given component.
     * @param component Type of the component to load into the load.
     * @param config
     */
    MdDialog.prototype.open = function (component, config) {
        var _this = this;
        config = _applyConfigDefaults$1(config);
        var overlayRef = this._createOverlay(config);
        var dialogContainer = this._attachDialogContainer(overlayRef, config);
        var dialogRef = this._attachDialogContent(component, dialogContainer, overlayRef);
        this._openDialogs.push(dialogRef);
        dialogRef.afterClosed().subscribe(function () { return _this._removeOpenDialog(dialogRef); });
        return dialogRef;
    };
    /**
     * Closes all of the currently-open dialogs.
     */
    MdDialog.prototype.closeAll = function () {
        var i = this._openDialogs.length;
        while (i--) {
            // The `_openDialogs` property isn't updated after close until the rxjs subscription
            // runs on the next microtask, in addition to modifying the array as we're going
            // through it. We loop through all of them and call close without assuming that
            // they'll be removed from the list instantaneously.
            this._openDialogs[i].close();
        }
    };
    /**
     * Creates the overlay into which the dialog will be loaded.
     * @param dialogConfig The dialog configuration.
     * @returns A promise resolving to the OverlayRef for the created overlay.
     */
    MdDialog.prototype._createOverlay = function (dialogConfig) {
        var overlayState = this._getOverlayState(dialogConfig);
        return this._overlay.create(overlayState);
    };
    /**
     * Attaches an MdDialogContainer to a dialog's already-created overlay.
     * @param overlay Reference to the dialog's underlying overlay.
     * @param config The dialog configuration.
     * @returns A promise resolving to a ComponentRef for the attached container.
     */
    MdDialog.prototype._attachDialogContainer = function (overlay, config) {
        var viewContainer = config ? config.viewContainerRef : null;
        var containerPortal = new ComponentPortal(MdDialogContainer, viewContainer);
        var containerRef = overlay.attach(containerPortal);
        containerRef.instance.dialogConfig = config;
        return containerRef.instance;
    };
    /**
     * Attaches the user-provided component to the already-created MdDialogContainer.
     * @param component The type of component being loaded into the dialog.
     * @param dialogContainer Reference to the wrapping MdDialogContainer.
     * @param overlayRef Reference to the overlay in which the dialog resides.
     * @returns A promise resolving to the MdDialogRef that should be returned to the user.
     */
    MdDialog.prototype._attachDialogContent = function (component, dialogContainer, overlayRef) {
        // Create a reference to the dialog we're creating in order to give the user a handle
        // to modify and close it.
        var dialogRef = new MdDialogRef(overlayRef);
        if (!dialogContainer.dialogConfig.disableClose) {
            // When the dialog backdrop is clicked, we want to close it.
            overlayRef.backdropClick().first().subscribe(function () { return dialogRef.close(); });
        }
        // Set the dialogRef to the container so that it can use the ref to close the dialog.
        dialogContainer.dialogRef = dialogRef;
        // We create an injector specifically for the component we're instantiating so that it can
        // inject the MdDialogRef. This allows a component loaded inside of a dialog to close itself
        // and, optionally, to return a value.
        var dialogInjector = new DialogInjector(dialogRef, this._injector);
        var contentPortal = new ComponentPortal(component, null, dialogInjector);
        var contentRef = dialogContainer.attachComponentPortal(contentPortal);
        dialogRef.componentInstance = contentRef.instance;
        return dialogRef;
    };
    /**
     * Creates an overlay state from a dialog config.
     * @param dialogConfig The dialog configuration.
     * @returns The overlay configuration.
     */
    MdDialog.prototype._getOverlayState = function (dialogConfig) {
        var state = new OverlayState();
        var strategy = this._overlay.position().global();
        var position = dialogConfig.position;
        state.hasBackdrop = true;
        state.positionStrategy = strategy;
        if (position && (position.left || position.right)) {
            position.left ? strategy.left(position.left) : strategy.right(position.right);
        }
        else {
            strategy.centerHorizontally();
        }
        if (position && (position.top || position.bottom)) {
            position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
        }
        else {
            strategy.centerVertically();
        }
        strategy.width(dialogConfig.width).height(dialogConfig.height);
        return state;
    };
    /**
     * Removes a dialog from the array of open dialogs.
     */
    MdDialog.prototype._removeOpenDialog = function (dialogRef) {
        var index = this._openDialogs.indexOf(dialogRef);
        if (index > -1) {
            this._openDialogs.splice(index, 1);
        }
    };
    MdDialog = __decorate$62([
        _angular_core.Injectable(), 
        __metadata$62('design:paramtypes', [Overlay, _angular_core.Injector])
    ], MdDialog);
    return MdDialog;
}());
/**
 * Applies default options to the dialog config.
 * @param dialogConfig Config to be modified.
 * @returns The new configuration object.
 */
function _applyConfigDefaults$1(dialogConfig) {
    return extendObject(new MdDialogConfig(), dialogConfig);
}

var __decorate$64 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$64 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Button that will close the current dialog.
 */
var MdDialogClose = (function () {
    function MdDialogClose(dialogRef) {
        this.dialogRef = dialogRef;
        /** Screenreader label for the button. */
        this.ariaLabel = 'Close dialog';
    }
    __decorate$64([
        _angular_core.Input('aria-label'), 
        __metadata$64('design:type', String)
    ], MdDialogClose.prototype, "ariaLabel", void 0);
    MdDialogClose = __decorate$64([
        _angular_core.Directive({
            selector: 'button[md-dialog-close], button[mat-dialog-close]',
            host: {
                '(click)': 'dialogRef.close()',
                '[attr.aria-label]': 'ariaLabel'
            }
        }), 
        __metadata$64('design:paramtypes', [MdDialogRef])
    ], MdDialogClose);
    return MdDialogClose;
}());
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
var MdDialogTitle = (function () {
    function MdDialogTitle() {
    }
    MdDialogTitle = __decorate$64([
        _angular_core.Directive({
            selector: '[md-dialog-title], [mat-dialog-title]'
        }), 
        __metadata$64('design:paramtypes', [])
    ], MdDialogTitle);
    return MdDialogTitle;
}());
/**
 * Scrollable content container of a dialog.
 */
var MdDialogContent = (function () {
    function MdDialogContent() {
    }
    MdDialogContent = __decorate$64([
        _angular_core.Directive({
            selector: '[md-dialog-content], md-dialog-content, [mat-dialog-content], mat-dialog-content'
        }), 
        __metadata$64('design:paramtypes', [])
    ], MdDialogContent);
    return MdDialogContent;
}());
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
var MdDialogActions = (function () {
    function MdDialogActions() {
    }
    MdDialogActions = __decorate$64([
        _angular_core.Directive({
            selector: '[md-dialog-actions], md-dialog-actions, [mat-dialog-actions], mat-dialog-actions'
        }), 
        __metadata$64('design:paramtypes', [])
    ], MdDialogActions);
    return MdDialogActions;
}());

var __decorate$61 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$61 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdDialogModule = (function () {
    function MdDialogModule() {
    }
    MdDialogModule.forRoot = function () {
        return {
            ngModule: MdDialogModule,
            providers: [MdDialog, OVERLAY_PROVIDERS, InteractivityChecker, MdPlatform],
        };
    };
    MdDialogModule = __decorate$61([
        _angular_core.NgModule({
            imports: [
                OverlayModule,
                PortalModule,
                A11yModule,
                DefaultStyleCompatibilityModeModule
            ],
            exports: [
                MdDialogContainer,
                MdDialogClose,
                MdDialogTitle,
                MdDialogContent,
                MdDialogActions,
                DefaultStyleCompatibilityModeModule
            ],
            declarations: [
                MdDialogContainer,
                MdDialogClose,
                MdDialogTitle,
                MdDialogActions,
                MdDialogContent
            ],
            entryComponents: [MdDialogContainer],
        }), 
        __metadata$61('design:paramtypes', [])
    ], MdDialogModule);
    return MdDialogModule;
}());

var __decorate$66 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$66 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdAutocomplete = (function () {
    function MdAutocomplete() {
    }
    MdAutocomplete = __decorate$66([
        _angular_core.Component({selector: 'md-autocomplete, mat-autocomplete',
            template: "I'm an autocomplete!",
            styles: [""],
            encapsulation: _angular_core.ViewEncapsulation.None,
        }), 
        __metadata$66('design:paramtypes', [])
    ], MdAutocomplete);
    return MdAutocomplete;
}());

var __decorate$65 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$65 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MdAutocompleteModule = (function () {
    function MdAutocompleteModule() {
    }
    MdAutocompleteModule.forRoot = function () {
        return {
            ngModule: MdAutocompleteModule,
            providers: []
        };
    };
    MdAutocompleteModule = __decorate$65([
        _angular_core.NgModule({
            imports: [DefaultStyleCompatibilityModeModule],
            exports: [MdAutocomplete, DefaultStyleCompatibilityModeModule],
            declarations: [MdAutocomplete],
        }), 
        __metadata$65('design:paramtypes', [])
    ], MdAutocompleteModule);
    return MdAutocompleteModule;
}());

var __decorate$20 = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata$20 = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MATERIAL_MODULES = [
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdChipsModule,
    MdCheckboxModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressCircleModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSliderModule,
    MdSlideToggleModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    OverlayModule,
    PortalModule,
    RtlModule,
    A11yModule,
    PlatformModule,
    ProjectionModule,
    DefaultStyleCompatibilityModeModule,
];
var MaterialRootModule = (function () {
    function MaterialRootModule() {
    }
    MaterialRootModule = __decorate$20([
        _angular_core.NgModule({
            imports: [
                MdAutocompleteModule.forRoot(),
                MdButtonModule.forRoot(),
                MdCardModule.forRoot(),
                MdChipsModule.forRoot(),
                MdCheckboxModule.forRoot(),
                MdGridListModule.forRoot(),
                MdInputModule.forRoot(),
                MdListModule.forRoot(),
                MdProgressBarModule.forRoot(),
                MdProgressCircleModule.forRoot(),
                MdRippleModule.forRoot(),
                MdSelectModule.forRoot(),
                MdSidenavModule.forRoot(),
                MdTabsModule.forRoot(),
                MdToolbarModule.forRoot(),
                PortalModule.forRoot(),
                ProjectionModule.forRoot(),
                RtlModule.forRoot(),
                // These modules include providers.
                A11yModule.forRoot(),
                MdButtonToggleModule.forRoot(),
                MdDialogModule.forRoot(),
                MdIconModule.forRoot(),
                MdMenuModule.forRoot(),
                MdRadioModule.forRoot(),
                MdSliderModule.forRoot(),
                MdSlideToggleModule.forRoot(),
                MdSnackBarModule.forRoot(),
                MdTooltipModule.forRoot(),
                PlatformModule.forRoot(),
                OverlayModule.forRoot(),
                DefaultStyleCompatibilityModeModule.forRoot(),
            ],
            exports: MATERIAL_MODULES,
        }), 
        __metadata$20('design:paramtypes', [])
    ], MaterialRootModule);
    return MaterialRootModule;
}());
var MaterialModule = (function () {
    function MaterialModule() {
    }
    MaterialModule.forRoot = function () {
        return { ngModule: MaterialRootModule };
    };
    MaterialModule = __decorate$20([
        _angular_core.NgModule({
            imports: MATERIAL_MODULES,
            exports: MATERIAL_MODULES,
        }), 
        __metadata$20('design:paramtypes', [])
    ], MaterialModule);
    return MaterialModule;
}());

exports.MdCoreModule = MdCoreModule;
exports.Dir = Dir;
exports.RtlModule = RtlModule;
exports.Portal = Portal;
exports.BasePortalHost = BasePortalHost;
exports.ComponentPortal = ComponentPortal;
exports.TemplatePortal = TemplatePortal;
exports.PortalHostDirective = PortalHostDirective;
exports.TemplatePortalDirective = TemplatePortalDirective;
exports.PortalModule = PortalModule;
exports.DomPortalHost = DomPortalHost;
exports.PlatformModule = PlatformModule;
exports.Overlay = Overlay;
exports.OVERLAY_PROVIDERS = OVERLAY_PROVIDERS;
exports.OverlayContainer = OverlayContainer;
exports.OverlayRef = OverlayRef;
exports.OverlayState = OverlayState;
exports.ConnectedOverlayDirective = ConnectedOverlayDirective;
exports.OverlayOrigin = OverlayOrigin;
exports.OverlayModule = OverlayModule;
exports.MdGestureConfig = MdGestureConfig;
exports.MdRipple = MdRipple;
exports.MdRippleModule = MdRippleModule;
exports.MdLiveAnnouncer = MdLiveAnnouncer;
exports.LIVE_ANNOUNCER_ELEMENT_TOKEN = LIVE_ANNOUNCER_ELEMENT_TOKEN;
exports.FocusTrap = FocusTrap;
exports.InteractivityChecker = InteractivityChecker;
exports.isFakeMousedownFromScreenReader = isFakeMousedownFromScreenReader;
exports.A11yModule = A11yModule;
exports.MdUniqueSelectionDispatcher = MdUniqueSelectionDispatcher;
exports.MdLineModule = MdLineModule;
exports.MdLine = MdLine;
exports.MdLineSetter = MdLineSetter;
exports.applyCssTransform = applyCssTransform;
exports.MdError = MdError;
exports.coerceBooleanProperty = coerceBooleanProperty;
exports.coerceNumberProperty = coerceNumberProperty;
exports.DefaultStyleCompatibilityModeModule = DefaultStyleCompatibilityModeModule;
exports.NoConflictStyleCompatibilityMode = NoConflictStyleCompatibilityMode;
exports.DomProjectionHost = DomProjectionHost;
exports.DomProjection = DomProjection;
exports.ProjectionModule = ProjectionModule;
exports.MdPlatform = MdPlatform;
exports.getSupportedInputTypes = getSupportedInputTypes;
exports.ConnectedPositionStrategy = ConnectedPositionStrategy;
exports.ConnectionPositionPair = ConnectionPositionPair;
exports.ConnectedOverlayPositionChange = ConnectedOverlayPositionChange;
exports.UP_ARROW = UP_ARROW;
exports.DOWN_ARROW = DOWN_ARROW;
exports.RIGHT_ARROW = RIGHT_ARROW;
exports.LEFT_ARROW = LEFT_ARROW;
exports.PAGE_UP = PAGE_UP;
exports.PAGE_DOWN = PAGE_DOWN;
exports.HOME = HOME;
exports.END = END;
exports.ENTER = ENTER;
exports.SPACE = SPACE;
exports.TAB = TAB;
exports.ESCAPE = ESCAPE;
exports.BACKSPACE = BACKSPACE;
exports.DELETE = DELETE;
exports.MATERIAL_COMPATIBILITY_MODE = MATERIAL_COMPATIBILITY_MODE;
exports.MAT_ELEMENTS_SELECTOR = MAT_ELEMENTS_SELECTOR;
exports.MatPrefixEnforcer = MatPrefixEnforcer;
exports.AnimationCurves = AnimationCurves;
exports.AnimationDurations = AnimationDurations;
exports.MaterialRootModule = MaterialRootModule;
exports.MaterialModule = MaterialModule;
exports.MdButton = MdButton;
exports.MdAnchor = MdAnchor;
exports.MdButtonModule = MdButtonModule;
exports.MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR = MD_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR;
exports.MdButtonToggleChange = MdButtonToggleChange;
exports.MdButtonToggleGroup = MdButtonToggleGroup;
exports.MdButtonToggleGroupMultiple = MdButtonToggleGroupMultiple;
exports.MdButtonToggle = MdButtonToggle;
exports.MdButtonToggleModule = MdButtonToggleModule;
exports.MdCardContent = MdCardContent;
exports.MdCardTitle = MdCardTitle;
exports.MdCardSubtitle = MdCardSubtitle;
exports.MdCardActions = MdCardActions;
exports.MdCardFooter = MdCardFooter;
exports.MdCard = MdCard;
exports.MdCardHeader = MdCardHeader;
exports.MdCardTitleGroup = MdCardTitleGroup;
exports.MdCardModule = MdCardModule;
exports.MdChipList = MdChipList;
exports.MdChipsModule = MdChipsModule;
exports.MdChip = MdChip;
exports.MD_CHECKBOX_CONTROL_VALUE_ACCESSOR = MD_CHECKBOX_CONTROL_VALUE_ACCESSOR;
exports.MdCheckboxChange = MdCheckboxChange;
exports.MdCheckbox = MdCheckbox;
exports.MdCheckboxModule = MdCheckboxModule;
exports.MdDialogModule = MdDialogModule;
exports.MdDialog = MdDialog;
exports.MdDialogContainer = MdDialogContainer;
exports.MdDialogClose = MdDialogClose;
exports.MdDialogTitle = MdDialogTitle;
exports.MdDialogContent = MdDialogContent;
exports.MdDialogActions = MdDialogActions;
exports.MdDialogConfig = MdDialogConfig;
exports.MdDialogRef = MdDialogRef;
exports.MdGridList = MdGridList;
exports.MdGridListModule = MdGridListModule;
exports.MdIconInvalidNameError = MdIconInvalidNameError;
exports.MdIcon = MdIcon;
exports.MdIconModule = MdIconModule;
exports.MdIconRegistry = MdIconRegistry;
exports.MdTextareaAutosize = MdTextareaAutosize;
exports.MD_INPUT_CONTROL_VALUE_ACCESSOR = MD_INPUT_CONTROL_VALUE_ACCESSOR;
exports.MdInputPlaceholderConflictError = MdInputPlaceholderConflictError;
exports.MdInputUnsupportedTypeError = MdInputUnsupportedTypeError;
exports.MdInputDuplicatedHintError = MdInputDuplicatedHintError;
exports.MdInput = MdInput;
exports.MdInputModule = MdInputModule;
exports.MdPlaceholder = MdPlaceholder;
exports.MdHint = MdHint;
exports.MdInputDirective = MdInputDirective;
exports.MdInputContainer = MdInputContainer;
exports.MdInputContainerPlaceholderConflictError = MdInputContainerPlaceholderConflictError;
exports.MdInputContainerUnsupportedTypeError = MdInputContainerUnsupportedTypeError;
exports.MdInputContainerDuplicatedHintError = MdInputContainerDuplicatedHintError;
exports.MdInputContainerMissingMdInputError = MdInputContainerMissingMdInputError;
exports.MdListDivider = MdListDivider;
exports.MdList = MdList;
exports.MdListAvatar = MdListAvatar;
exports.MdListItem = MdListItem;
exports.MdListModule = MdListModule;
exports.MdMenuTrigger = MdMenuTrigger;
exports.fadeInItems = fadeInItems;
exports.transformMenu = transformMenu;
exports.MdMenu = MdMenu;
exports.MdMenuItem = MdMenuItem;
exports.MdMenuModule = MdMenuModule;
exports.MdProgressBar = MdProgressBar;
exports.MdProgressBarModule = MdProgressBarModule;
exports.MdProgressCircle = MdProgressCircle;
exports.MdSpinner = MdSpinner;
exports.MdProgressCircleModule = MdProgressCircleModule;
exports.MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = MD_RADIO_GROUP_CONTROL_VALUE_ACCESSOR;
exports.MdRadioChange = MdRadioChange;
exports.MdRadioGroup = MdRadioGroup;
exports.MdRadioButton = MdRadioButton;
exports.MdRadioModule = MdRadioModule;
exports.MdSelectModule = MdSelectModule;
exports.MdOption = MdOption;
exports.fadeInContent = fadeInContent;
exports.transformPanel = transformPanel;
exports.transformPlaceholder = transformPlaceholder;
exports.SELECT_OPTION_HEIGHT = SELECT_OPTION_HEIGHT;
exports.SELECT_PANEL_MAX_HEIGHT = SELECT_PANEL_MAX_HEIGHT;
exports.SELECT_MAX_OPTIONS_DISPLAYED = SELECT_MAX_OPTIONS_DISPLAYED;
exports.SELECT_TRIGGER_HEIGHT = SELECT_TRIGGER_HEIGHT;
exports.SELECT_OPTION_HEIGHT_ADJUSTMENT = SELECT_OPTION_HEIGHT_ADJUSTMENT;
exports.SELECT_PANEL_PADDING_X = SELECT_PANEL_PADDING_X;
exports.SELECT_PANEL_PADDING_Y = SELECT_PANEL_PADDING_Y;
exports.SELECT_PANEL_VIEWPORT_PADDING = SELECT_PANEL_VIEWPORT_PADDING;
exports.MdSelect = MdSelect;
exports.MdDuplicatedSidenavError = MdDuplicatedSidenavError;
exports.MdSidenavToggleResult = MdSidenavToggleResult;
exports.MdSidenav = MdSidenav;
exports.MdSidenavContainer = MdSidenavContainer;
exports.MdSidenavModule = MdSidenavModule;
exports.MD_SLIDER_VALUE_ACCESSOR = MD_SLIDER_VALUE_ACCESSOR;
exports.MdSliderChange = MdSliderChange;
exports.MdSlider = MdSlider;
exports.SliderRenderer = SliderRenderer;
exports.MdSliderModule = MdSliderModule;
exports.MD_SLIDE_TOGGLE_VALUE_ACCESSOR = MD_SLIDE_TOGGLE_VALUE_ACCESSOR;
exports.MdSlideToggleChange = MdSlideToggleChange;
exports.MdSlideToggle = MdSlideToggle;
exports.MdSlideToggleModule = MdSlideToggleModule;
exports.MdSnackBar = MdSnackBar;
exports.MdSnackBarModule = MdSnackBarModule;
exports.SHOW_ANIMATION = SHOW_ANIMATION;
exports.HIDE_ANIMATION = HIDE_ANIMATION;
exports.MdSnackBarContainer = MdSnackBarContainer;
exports.MdSnackBarConfig = MdSnackBarConfig;
exports.MdSnackBarRef = MdSnackBarRef;
exports.MdInkBar = MdInkBar;
exports.MdTabBody = MdTabBody;
exports.MdTabHeader = MdTabHeader;
exports.MdTabLabelWrapper = MdTabLabelWrapper;
exports.MdTab = MdTab;
exports.MdTabLabel = MdTabLabel;
exports.MdTabChangeEvent = MdTabChangeEvent;
exports.MdTabGroup = MdTabGroup;
exports.MdTabsModule = MdTabsModule;
exports.MdTabNavBar = MdTabNavBar;
exports.MdTabLink = MdTabLink;
exports.MdTabLinkRipple = MdTabLinkRipple;
exports.MdToolbarRow = MdToolbarRow;
exports.MdToolbar = MdToolbar;
exports.MdToolbarModule = MdToolbarModule;
exports.TOUCHEND_HIDE_DELAY = TOUCHEND_HIDE_DELAY;
exports.MdTooltip = MdTooltip;
exports.TooltipComponent = TooltipComponent;
exports.MdTooltipModule = MdTooltipModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=./material.umd.js.map
