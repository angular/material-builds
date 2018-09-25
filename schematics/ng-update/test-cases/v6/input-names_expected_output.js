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
    <mat-radio-group labelPosition="end"></mat-radio-group>
    <mat-radio-group [labelPosition]="myAlign">
      <mat-radio-button [labelPosition]="myAlign"></mat-radio-button>
      <mat-radio-button labelPosition="start"></mat-radio-button>
    </mat-radio-group>
  `
    })
], A);
let B = class B {
};
B = __decorate([
    core_1.Component({
        template: `
    <mat-drawer position="end"></mat-drawer>
    <mat-drawer [position]="myAlign"></mat-drawer>
    <mat-sidenav [position]="myAlign"></mat-sidenav>
  `
    })
], B);
let C = class C {
};
C = __decorate([
    core_1.Component({
        template: `
    <mat-form-field color="primary"></mat-form-field>
    <mat-form-field [color]="myColor"></mat-form-field>
    <mat-form-field floatLabel="always"></mat-form-field>
    <mat-form-field [floatLabel]="floatState"></mat-form-field>
  `
    })
], C);
let D = class D {
};
D = __decorate([
    core_1.Component({
        template: `
    <mat-tab-group [dynamicHeight]="myHeight"></mat-tab-group>
    <mat-checkbox labelPosition="end"></mat-checkbox>
    <div matTooltip [matTooltipPosition]="end"></div>
    <mat-slider [tickInterval]="interval"></mat-slider>
    <mat-slider [thumbLabel]="myLabel"></mat-slider>
  `
    })
], D);
//# sourceMappingURL=input-names_expected_output.js.map