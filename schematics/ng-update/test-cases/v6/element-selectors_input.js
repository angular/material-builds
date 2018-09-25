"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const a = platform_browser_1.By.css('mat-input-container');
let B = class B {
};
B = __decorate([
    core_1.Component({
        template: `
    <mat-input-container>
      <input matInput placeholder="Test">
    </mat-input-container>

    <style>
      mat-input-container {
        border: red 1px solid;
      }
    </style>
  `
    })
], B);
let C = class C {
};
C = __decorate([
    core_1.Component({
        styles: [`
    mat-input-container {
      flex-direction: row;
    }
    :host > mat-input-container {
      text-align: right;
    }
  `]
    })
], C);
//# sourceMappingURL=element-selectors_input.js.map