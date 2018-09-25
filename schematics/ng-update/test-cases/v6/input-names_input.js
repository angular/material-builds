"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let A = class A {
};
A = __decorate([
    core_1.Component({
        template: `
    <mat-radio-group align="end"></mat-radio-group>
    <mat-radio-group [align]="myAlign">
      <mat-radio-button [align]="myAlign"></mat-radio-button>
      <mat-radio-button align="start"></mat-radio-button>
    </mat-radio-group>
  `
    })
], A);
let B = class B {
};
B = __decorate([
    core_1.Component({
        template: `
    <mat-drawer align="end"></mat-drawer>
    <mat-drawer [align]="myAlign"></mat-drawer>
    <mat-sidenav [align]="myAlign"></mat-sidenav>
  `
    })
], B);
let C = class C {
};
C = __decorate([
    core_1.Component({
        template: `
    <mat-form-field dividerColor="primary"></mat-form-field>
    <mat-form-field [dividerColor]="myColor"></mat-form-field>
    <mat-form-field floatPlaceholder="always"></mat-form-field>
    <mat-form-field [floatPlaceholder]="floatState"></mat-form-field>
  `
    })
], C);
let D = class D {
};
D = __decorate([
    core_1.Component({
        template: `
    <mat-tab-group [mat-dynamic-height]="myHeight"></mat-tab-group>
    <mat-checkbox align="end"></mat-checkbox>
    <div matTooltip [tooltip-position]="end"></div>
    <mat-slider [tick-interval]="interval"></mat-slider>
    <mat-slider [thumb-label]="myLabel"></mat-slider>
  `
    })
], D);
//# sourceMappingURL=input-names_input.js.map