/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
/** Button that moves to the next step in a stepper workflow. */
export class MatStepperNext extends CdkStepperNext {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatStepperNext, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.2", type: MatStepperNext, isStandalone: true, selector: "button[matStepperNext]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-next" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatStepperNext, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperNext]',
                    host: {
                        'class': 'mat-stepper-next',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                    standalone: true,
                }]
        }] });
/** Button that moves to the previous step in a stepper workflow. */
export class MatStepperPrevious extends CdkStepperPrevious {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatStepperPrevious, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.1.0-next.2", type: MatStepperPrevious, isStandalone: true, selector: "button[matStepperPrevious]", inputs: { type: "type" }, host: { properties: { "type": "type" }, classAttribute: "mat-stepper-previous" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.2", ngImport: i0, type: MatStepperPrevious, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[matStepperPrevious]',
                    host: {
                        'class': 'mat-stepper-previous',
                        '[type]': 'type',
                    },
                    inputs: ['type'],
                    standalone: true,
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1idXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc3RlcHBlci9zdGVwcGVyLWJ1dHRvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFeEMsZ0VBQWdFO0FBVWhFLE1BQU0sT0FBTyxjQUFlLFNBQVEsY0FBYztxSEFBckMsY0FBYzt5R0FBZCxjQUFjOztrR0FBZCxjQUFjO2tCQVQxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsa0JBQWtCO3dCQUMzQixRQUFRLEVBQUUsTUFBTTtxQkFDakI7b0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUNoQixVQUFVLEVBQUUsSUFBSTtpQkFDakI7O0FBR0Qsb0VBQW9FO0FBVXBFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxrQkFBa0I7cUhBQTdDLGtCQUFrQjt5R0FBbEIsa0JBQWtCOztrR0FBbEIsa0JBQWtCO2tCQVQ5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsc0JBQXNCO3dCQUMvQixRQUFRLEVBQUUsTUFBTTtxQkFDakI7b0JBQ0QsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUNoQixVQUFVLEVBQUUsSUFBSTtpQkFDakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDZGtTdGVwcGVyTmV4dCwgQ2RrU3RlcHBlclByZXZpb3VzfSBmcm9tICdAYW5ndWxhci9jZGsvc3RlcHBlcic7XG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKiBCdXR0b24gdGhhdCBtb3ZlcyB0byB0aGUgbmV4dCBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2J1dHRvblttYXRTdGVwcGVyTmV4dF0nLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1zdGVwcGVyLW5leHQnLFxuICAgICdbdHlwZV0nOiAndHlwZScsXG4gIH0sXG4gIGlucHV0czogWyd0eXBlJ10sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJOZXh0IGV4dGVuZHMgQ2RrU3RlcHBlck5leHQge31cblxuLyoqIEJ1dHRvbiB0aGF0IG1vdmVzIHRvIHRoZSBwcmV2aW91cyBzdGVwIGluIGEgc3RlcHBlciB3b3JrZmxvdy4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2J1dHRvblttYXRTdGVwcGVyUHJldmlvdXNdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtc3RlcHBlci1wcmV2aW91cycsXG4gICAgJ1t0eXBlXSc6ICd0eXBlJyxcbiAgfSxcbiAgaW5wdXRzOiBbJ3R5cGUnXSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0U3RlcHBlclByZXZpb3VzIGV4dGVuZHMgQ2RrU3RlcHBlclByZXZpb3VzIHt9XG4iXX0=