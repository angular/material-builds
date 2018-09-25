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
const a = platform_browser_1.By.css('.mat-form-field-label');
const b = platform_browser_1.By.css('.mat-form-field-label-wrapper');
const c = platform_browser_1.By.css('.mat-form-field');
const d = platform_browser_1.By.css('.mat-form-field-flex');
const e = platform_browser_1.By.css('.mat-form-field-hint-spacer');
let F = class F {
};
F = __decorate([
    core_1.Component({
        template: `
    <ng-content select=".mat-form-field-suffix"></ng-content>

    <style>
      .mat-form-field-suffix {
        border: red 1px solid;
      }

      .mat-form-field-underline {
        background: blue;
      }
    </style>
  `
    })
], F);
let G = class G {
};
G = __decorate([
    core_1.Component({
        styles: [`
    .mat-form-field-subscript-wrapper {
      flex-direction: row;
    }
    .mat-form-field .mat-form-field-label {
      color: lightcoral;
    }
  `]
    })
], G);
let H = class H {
};
H = __decorate([
    core_1.Component({
        // Considering this is SCSS that will be transformed by Webpack loaders.
        styles: [`
    body, html {
      font-family: Roboto, 'Helvetica Neue', sans-serif;
    }
  `]
    })
], H);
//# sourceMappingURL=css-names_expected_output.js.map