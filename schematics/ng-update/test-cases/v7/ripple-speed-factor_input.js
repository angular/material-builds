"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class MatRipple {
}
class A {
    constructor(ripple) {
        this.ripple = ripple;
        this.self = { me: this.ripple };
    }
    onClick() {
        this.ripple.speedFactor = 0.5;
        this.self.me.speedFactor = 1.5;
    }
}
const b = new MatRipple();
const myConstant = 1;
b.speedFactor = 0.5 + myConstant;
let C = class C {
};
C = __decorate([
    core_1.Component({
        template: `<div matRipple [matRippleSpeedFactor]="0.5"></div>`
    })
], C);
let D = class D {
    constructor() {
        this.myValue = 1.5;
    }
};
D = __decorate([
    core_1.Component({
        template: `<div matRipple [matRippleSpeedFactor]="myValue"></div>`
    })
], D);
//# sourceMappingURL=ripple-speed-factor_input.js.map