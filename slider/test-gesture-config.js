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
import { Injectable } from '@angular/core';
import { GestureConfig } from '../core';
/**
 * An extension of GestureConfig that exposes the underlying HammerManager instances.
 * Tests can use these instances to emit fake gesture events.
 */
export var TestGestureConfig = (function (_super) {
    __extends(TestGestureConfig, _super);
    function TestGestureConfig() {
        _super.apply(this, arguments);
        /**
         * A map of Hammer instances to element.
         * Used to emit events over instances for an element.
         */
        this.hammerInstances = new Map();
    }
    /**
     * Create a mapping of Hammer instances to element so that events can be emitted during testing.
     */
    TestGestureConfig.prototype.buildHammer = function (element) {
        var mc = _super.prototype.buildHammer.call(this, element);
        if (this.hammerInstances.get(element)) {
            this.hammerInstances.get(element).push(mc);
        }
        else {
            this.hammerInstances.set(element, [mc]);
        }
        return mc;
    };
    /**
     * The Angular event plugin for Hammer creates a new HammerManager instance for each listener,
     * so we need to apply our event on all instances to hit the correct listener.
     */
    TestGestureConfig.prototype.emitEventForElement = function (eventType, element, eventData) {
        if (eventData === void 0) { eventData = {}; }
        var instances = this.hammerInstances.get(element);
        instances.forEach(function (instance) { return instance.emit(eventType, eventData); });
    };
    TestGestureConfig = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [])
    ], TestGestureConfig);
    return TestGestureConfig;
}(GestureConfig));

//# sourceMappingURL=test-gesture-config.js.map
