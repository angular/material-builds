var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { NgModule, Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultStyleCompatibilityModeModule } from '../core/compatibility/default-mode';
// TODO(josephperrott): Benchpress tests.
// TODO(josephperrott): Add ARIA attributes for progressbar "for".
/**
 * <md-progress-bar> component.
 */
export var MdProgressBar = (function () {
    function MdProgressBar() {
        /** Color of the progress bar. */
        this.color = 'primary';
        this._value = 0;
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
        /** Value of the progressbar. Defaults to zero. Mirrored to aria-valuenow. */
        get: function () { return this._value; },
        set: function (v) { this._value = clamp(v || 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdProgressBar.prototype, "bufferValue", {
        /** Buffer value of the progress bar. Defaults to zero. */
        get: function () { return this._bufferValue; },
        set: function (v) { this._bufferValue = clamp(v || 0); },
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
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "color", void 0);
    __decorate([
        Input(),
        HostBinding('attr.aria-valuenow'), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "value", null);
    __decorate([
        Input(), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "bufferValue", null);
    __decorate([
        Input(),
        HostBinding('attr.mode'), 
        __metadata('design:type', Object)
    ], MdProgressBar.prototype, "mode", void 0);
    MdProgressBar = __decorate([
        Component({selector: 'md-progress-bar, mat-progress-bar',
            host: {
                'role': 'progressbar',
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                '[class.md-primary]': 'color == "primary"',
                '[class.md-accent]': 'color == "accent"',
                '[class.md-warn]': 'color == "warn"',
            },
            template: "<div class=\"md-progress-bar-background\"></div><div class=\"md-progress-bar-buffer\" [ngStyle]=\"_bufferTransform()\"></div><div class=\"md-progress-bar-primary md-progress-bar-fill\" [ngStyle]=\"_primaryTransform()\"></div><div class=\"md-progress-bar-secondary md-progress-bar-fill\"></div>",
            styles: [":host{display:block;height:5px;overflow:hidden;position:relative;transform:translateZ(0);transition:opacity 250ms linear;width:100%}:host .md-progress-bar-background{background-repeat:repeat-x;background-size:10px 4px;height:100%;position:absolute;visibility:hidden;width:100%}:host .md-progress-bar-buffer{height:100%;position:absolute;transform-origin:top left;transition:transform 250ms ease;width:100%}:host .md-progress-bar-secondary{visibility:hidden}:host .md-progress-bar-fill{animation:none;height:100%;position:absolute;transform-origin:top left;transition:transform 250ms ease;width:100%}:host .md-progress-bar-fill::after{animation:none;content:'';display:inline-block;height:100%;position:absolute;width:100%;left:0}:host[mode=query]{transform:rotateZ(180deg)}:host[mode=query] .md-progress-bar-fill,:host[mode=indeterminate] .md-progress-bar-fill{transition:none}:host[mode=query] .md-progress-bar-primary,:host[mode=indeterminate] .md-progress-bar-primary{animation:md-progress-bar-primary-indeterminate-translate 2s infinite linear;left:-145.166611%}:host[mode=query] .md-progress-bar-primary.md-progress-bar-fill::after,:host[mode=indeterminate] .md-progress-bar-primary.md-progress-bar-fill::after{animation:md-progress-bar-primary-indeterminate-scale 2s infinite linear}:host[mode=query] .md-progress-bar-secondary,:host[mode=indeterminate] .md-progress-bar-secondary{animation:md-progress-bar-secondary-indeterminate-translate 2s infinite linear;left:-54.888891%;visibility:visible}:host[mode=query] .md-progress-bar-secondary.md-progress-bar-fill::after,:host[mode=indeterminate] .md-progress-bar-secondary.md-progress-bar-fill::after{animation:md-progress-bar-secondary-indeterminate-scale 2s infinite linear}:host[mode=buffer] .md-progress-bar-background{animation:md-progress-bar-background-scroll 250ms infinite linear;visibility:visible}:host-context([dir=rtl]){transform:rotateY(180deg)}@keyframes md-progress-bar-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(.5,0,.70173,.49582);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);transform:translateX(83.67142%)}100%{transform:translateX(200.61106%)}}@keyframes md-progress-bar-primary-indeterminate-scale{0%{transform:scaleX(.08)}36.65%{animation-timing-function:cubic-bezier(.33473,.12482,.78584,1);transform:scaleX(.08)}69.15%{animation-timing-function:cubic-bezier(.06,.11,.6,1);transform:scaleX(.66148)}100%{transform:scaleX(.08)}}@keyframes md-progress-bar-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:translateX(37.65191%)}48.35%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:translateX(84.38617%)}100%{transform:translateX(160.27778%)}}@keyframes md-progress-bar-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(.15,0,.51506,.40969);transform:scaleX(.08)}19.15%{animation-timing-function:cubic-bezier(.31033,.28406,.8,.73371);transform:scaleX(.4571)}44.15%{animation-timing-function:cubic-bezier(.4,.62704,.6,.90203);transform:scaleX(.72796)}100%{transform:scaleX(.08)}}@keyframes md-progress-bar-background-scroll{to{transform:translateX(-10px)}}"],
            changeDetection: ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressBar);
    return MdProgressBar;
}());
/** Clamps a value to be between two numbers, by default 0 and 100. */
function clamp(v, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.max(min, Math.min(max, v));
}
export var MdProgressBarModule = (function () {
    function MdProgressBarModule() {
    }
    MdProgressBarModule.forRoot = function () {
        return {
            ngModule: MdProgressBarModule,
            providers: []
        };
    };
    MdProgressBarModule = __decorate([
        NgModule({
            imports: [CommonModule, DefaultStyleCompatibilityModeModule],
            exports: [MdProgressBar, DefaultStyleCompatibilityModeModule],
            declarations: [MdProgressBar],
        }), 
        __metadata('design:paramtypes', [])
    ], MdProgressBarModule);
    return MdProgressBarModule;
}());

//# sourceMappingURL=progress-bar.js.map
