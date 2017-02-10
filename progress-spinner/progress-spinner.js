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
import { NgModule, Component, HostBinding, ChangeDetectionStrategy, Input, ElementRef, NgZone, Renderer, Directive } from '@angular/core';
import { CompatibilityModule } from '../core';
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
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdProgressSpinnerCssMatStyler = (function () {
    function MdProgressSpinnerCssMatStyler() {
    }
    MdProgressSpinnerCssMatStyler = __decorate([
        Directive({
            selector: 'md-progress-spinner, mat-progress-spinner',
            host: {
                '[class.mat-progress-spinner]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressSpinnerCssMatStyler);
    return MdProgressSpinnerCssMatStyler;
}());
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 */
export var MdProgressCircleCssMatStyler = (function () {
    function MdProgressCircleCssMatStyler() {
    }
    MdProgressCircleCssMatStyler = __decorate([
        Directive({
            selector: 'md-progress-circle, mat-progress-circle',
            host: {
                '[class.mat-progress-circle]': 'true'
            }
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressCircleCssMatStyler);
    return MdProgressCircleCssMatStyler;
}());
/**
 * <md-progress-spinner> component.
 */
export var MdProgressSpinner = (function () {
    function MdProgressSpinner(_ngZone, _elementRef, _renderer) {
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /** The id of the last requested animation. */
        this._lastAnimationId = 0;
        this._mode = 'determinate';
        this._color = 'primary';
    }
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMin", {
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
    Object.defineProperty(MdProgressSpinner.prototype, "_ariaValueMax", {
        get: function () {
            return this.mode == 'determinate' ? 100 : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "interdeterminateInterval", {
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
    /**
     * Clean up any animations that were running.
     */
    MdProgressSpinner.prototype.ngOnDestroy = function () {
        this._cleanupIndeterminateAnimation();
    };
    Object.defineProperty(MdProgressSpinner.prototype, "color", {
        /** The color of the progress-spinner. Can be primary, accent, or warn. */
        get: function () { return this._color; },
        set: function (value) {
            this._updateColor(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressSpinner.prototype, "value", {
        /** Value of the progress circle. It is bound to the host as the attribute aria-valuenow. */
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
    Object.defineProperty(MdProgressSpinner.prototype, "mode", {
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
    MdProgressSpinner.prototype._animateCircle = function (animateFrom, animateTo, ease, duration, rotation) {
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
    MdProgressSpinner.prototype._startIndeterminateAnimation = function () {
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
    MdProgressSpinner.prototype._cleanupIndeterminateAnimation = function () {
        this.interdeterminateInterval = null;
    };
    /**
     * Renders the arc onto the SVG element. Proxies `getArc` while setting the proper
     * DOM attribute on the `<path>`.
     */
    MdProgressSpinner.prototype._renderArc = function (currentValue, rotation) {
        // Caches the path reference so it doesn't have to be looked up every time.
        var path = this._path = this._path || this._elementRef.nativeElement.querySelector('path');
        // Ensure that the path was found. This may not be the case if the
        // animation function fires too early.
        if (path) {
            path.setAttribute('d', getSvgArc(currentValue, rotation));
        }
    };
    /**
     * Updates the color of the progress-spinner by adding the new palette class to the element
     * and removing the old one.
     */
    MdProgressSpinner.prototype._updateColor = function (newColor) {
        this._setElementColor(this._color, false);
        this._setElementColor(newColor, true);
        this._color = newColor;
    };
    /** Sets the given palette class on the component element. */
    MdProgressSpinner.prototype._setElementColor = function (color, isAdd) {
        if (color != null && color != '') {
            this._renderer.setElementClass(this._elementRef.nativeElement, "mat-" + color, isAdd);
        }
    };
    __decorate([
        Input(), 
        __metadata('design:type', String)
    ], MdProgressSpinner.prototype, "color", null);
    __decorate([
        Input(),
        HostBinding('attr.aria-valuenow'), 
        __metadata('design:type', Object)
    ], MdProgressSpinner.prototype, "value", null);
    __decorate([
        HostBinding('attr.mode'),
        Input(), 
        __metadata('design:type', Object)
    ], MdProgressSpinner.prototype, "mode", null);
    MdProgressSpinner = __decorate([
        Component({selector: 'md-progress-spinner, mat-progress-spinner, md-progress-circle, mat-progress-circle',
            host: {
                'role': 'progressbar',
                '[attr.aria-valuemin]': '_ariaValueMin',
                '[attr.aria-valuemax]': '_ariaValueMax'
            },
            template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path></path></svg>",
            styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;stroke-width:10px}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [NgZone, ElementRef, Renderer])
    ], MdProgressSpinner);
    return MdProgressSpinner;
}());
/**
 * <md-spinner> component.
 *
 * This is a component definition to be used as a convenience reference to create an
 * indeterminate <md-progress-spinner> instance.
 */
export var MdSpinner = (function (_super) {
    __extends(MdSpinner, _super);
    function MdSpinner(elementRef, ngZone, renderer) {
        _super.call(this, ngZone, elementRef, renderer);
        this.mode = 'indeterminate';
    }
    MdSpinner.prototype.ngOnDestroy = function () {
        // The `ngOnDestroy` from `MdProgressSpinner` should be called explicitly, because
        // in certain cases Angular won't call it (e.g. when using AoT and in unit tests).
        _super.prototype.ngOnDestroy.call(this);
    };
    MdSpinner = __decorate([
        Component({selector: 'md-spinner, mat-spinner',
            host: {
                'role': 'progressbar',
                'mode': 'indeterminate',
                '[class.mat-spinner]': 'true',
            },
            template: "<svg viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"><path></path></svg>",
            styles: [":host{display:block;height:100px;width:100px;overflow:hidden}:host svg{height:100%;width:100%;transform-origin:center}:host path{fill:transparent;stroke-width:10px}:host[mode=indeterminate] svg{animation-duration:5.25s,2.887s;animation-name:mat-progress-spinner-sporadic-rotate,mat-progress-spinner-linear-rotate;animation-timing-function:cubic-bezier(.35,0,.25,1),linear;animation-iteration-count:infinite;transition:none}@keyframes mat-progress-spinner-linear-rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes mat-progress-spinner-sporadic-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}"],
        }), 
        __metadata('design:paramtypes', [ElementRef, NgZone, Renderer])
    ], MdSpinner);
    return MdSpinner;
}(MdProgressSpinner));
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
export var MdProgressSpinnerModule = (function () {
    function MdProgressSpinnerModule() {
    }
    /** @deprecated */
    MdProgressSpinnerModule.forRoot = function () {
        return {
            ngModule: MdProgressSpinnerModule,
            providers: []
        };
    };
    MdProgressSpinnerModule = __decorate([
        NgModule({
            imports: [CompatibilityModule],
            exports: [
                MdProgressSpinner,
                MdSpinner,
                CompatibilityModule,
                MdProgressSpinnerCssMatStyler,
                MdProgressCircleCssMatStyler
            ],
            declarations: [
                MdProgressSpinner,
                MdSpinner,
                MdProgressSpinnerCssMatStyler,
                MdProgressCircleCssMatStyler
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressSpinnerModule);
    return MdProgressSpinnerModule;
}());
//# sourceMappingURL=progress-spinner.js.map