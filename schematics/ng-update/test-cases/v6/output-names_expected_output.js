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
    <mat-select (selectionChange)="onChange($event)"></mat-select>
    <mat-select (closed)="onClose($event)"></mat-select>
    <mat-select (opened)="onOpen($event)"></mat-select>
  `
    })
], A);
let B = class B {
};
B = __decorate([
    core_1.Component({
        template: `
    <mat-drawer (positionChanged)="onAlignChanged()"></mat-drawer>
    <mat-drawer (closed)="onClose()" (opened)="onOpen()"></mat-drawer>
    <mat-tab-group (selectedTabChange)="onSelectionChange()"></mat-tab-group>
  `
    })
], B);
let C = class C {
};
C = __decorate([
    core_1.Component({
        template: `
    <mat-chip (removed)="removeFromList()"></mat-chip>
    <mat-basic-chip (removed)="removeFromList()"></mat-basic-chip>
    <mat-chip (destroyed)="onDestroy()"></mat-chip>
    <mat-basic-chip (destroyed)="onDestroy()"></mat-basic-chip>
  `
    })
], C);
//# sourceMappingURL=output-names_expected_output.js.map