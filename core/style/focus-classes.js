var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, Injectable, Optional, SkipSelf, Renderer, ElementRef } from '@angular/core';
/** Monitors mouse and keyboard events to determine the cause of focus events. */
export var FocusOriginMonitor = (function () {
    function FocusOriginMonitor() {
        var _this = this;
        /** The focus origin that the next focus event is a result of. */
        this._origin = null;
        // Listen to keydown and mousedown in the capture phase so we can detect them even if the user
        // stops propagation.
        // TODO(mmalerba): Figure out how to handle touchstart
        document.addEventListener('keydown', function () { return _this._setOriginForCurrentEventQueue('keyboard'); }, true);
        document.addEventListener('mousedown', function () { return _this._setOriginForCurrentEventQueue('mouse'); }, true);
    }
    /** Register an element to receive focus classes. */
    FocusOriginMonitor.prototype.registerElementForFocusClasses = function (element, renderer) {
        var _this = this;
        renderer.listen(element, 'focus', function () { return _this._onFocus(element, renderer); });
        renderer.listen(element, 'blur', function () { return _this._onBlur(element, renderer); });
    };
    /** Focuses the element via the specified focus origin. */
    FocusOriginMonitor.prototype.focusVia = function (element, renderer, origin) {
        this._setOriginForCurrentEventQueue(origin);
        renderer.invokeElementMethod(element, 'focus');
    };
    /** Sets the origin and schedules an async function to clear it at the end of the event queue. */
    FocusOriginMonitor.prototype._setOriginForCurrentEventQueue = function (origin) {
        var _this = this;
        this._origin = origin;
        setTimeout(function () { return _this._origin = null; }, 0);
    };
    /** Handles focus events on a registered element. */
    FocusOriginMonitor.prototype._onFocus = function (element, renderer) {
        renderer.setElementClass(element, 'cdk-focused', true);
        renderer.setElementClass(element, 'cdk-keyboard-focused', this._origin == 'keyboard');
        renderer.setElementClass(element, 'cdk-mouse-focused', this._origin == 'mouse');
        renderer.setElementClass(element, 'cdk-program-focused', !this._origin || this._origin == 'program');
        this._origin = null;
    };
    /** Handles blur events on a registered element. */
    FocusOriginMonitor.prototype._onBlur = function (element, renderer) {
        renderer.setElementClass(element, 'cdk-focused', false);
        renderer.setElementClass(element, 'cdk-keyboard-focused', false);
        renderer.setElementClass(element, 'cdk-mouse-focused', false);
        renderer.setElementClass(element, 'cdk-program-focused', false);
    };
    FocusOriginMonitor = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], FocusOriginMonitor);
    return FocusOriginMonitor;
}());
/**
 * Directive that determines how a particular element was focused (via keyboard, mouse, or
 * programmatically) and adds corresponding classes to the element.
 */
export var CdkFocusClasses = (function () {
    function CdkFocusClasses(elementRef, focusOriginMonitor, renderer) {
        focusOriginMonitor.registerElementForFocusClasses(elementRef.nativeElement, renderer);
    }
    CdkFocusClasses = __decorate([
        Directive({
            selector: '[cdkFocusClasses]',
        }), 
        __metadata('design:paramtypes', [ElementRef, FocusOriginMonitor, Renderer])
    ], CdkFocusClasses);
    return CdkFocusClasses;
}());
export function FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY(parentDispatcher) {
    return parentDispatcher || new FocusOriginMonitor();
}
export var FOCUS_ORIGIN_MONITOR_PROVIDER = {
    // If there is already a FocusOriginMonitor available, use that. Otherwise, provide a new one.
    provide: FocusOriginMonitor,
    deps: [[new Optional(), new SkipSelf(), FocusOriginMonitor]],
    useFactory: FOCUS_ORIGIN_MONITOR_PROVIDER_FACTORY
};
//# sourceMappingURL=focus-classes.js.map