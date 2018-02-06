/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
/** An event that is emitted when the autofill state of an input changes. */
export declare type AutofillEvent = {
    /** The element whose autofill state changes. */
    target: Element;
    /** Whether the element is currently autofilled. */
    isAutofilled: boolean;
};
/**
 * An injectable service that can be used to monitor the autofill state of an input.
 * Based on the following blog post:
 * https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7
 */
export declare class AutofillMonitor implements OnDestroy {
    private _platform;
    private _monitoredElements;
    constructor(_platform: Platform);
    /**
     * Monitor for changes in the autofill state of the given input element.
     * @param element The element to monitor.
     * @return A stream of autofill state changes.
     */
    monitor(element: Element): Observable<AutofillEvent>;
    /**
     * Stop monitoring the autofill state of the given input element.
     * @param element The element to stop monitoring.
     */
    stopMonitoring(element: Element): void;
    ngOnDestroy(): void;
}
/** A directive that can be used to monitor the autofill state of an input. */
export declare class MatAutofill implements OnDestroy, OnInit {
    private _elementRef;
    private _autofillMonitor;
    matAutofill: EventEmitter<AutofillEvent>;
    constructor(_elementRef: ElementRef, _autofillMonitor: AutofillMonitor);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
