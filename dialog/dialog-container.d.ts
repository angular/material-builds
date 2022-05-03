/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationEvent } from '@angular/animations';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { FocusMonitor, FocusTrapFactory, InteractivityChecker } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { MatDialogConfig } from './dialog-config';
import * as i0 from "@angular/core";
/** Event that captures the state of dialog container animations. */
interface DialogAnimationEvent {
    state: 'opened' | 'opening' | 'closing' | 'closed';
    totalTime: number;
}
/**
 * Base class for the `MatDialogContainer`. The base class does not implement
 * animations as these are left to implementers of the dialog container.
 */
export declare abstract class _MatDialogContainerBase extends CdkDialogContainer<MatDialogConfig> {
    /** Emits when an animation state changes. */
    _animationStateChanged: EventEmitter<DialogAnimationEvent>;
    constructor(elementRef: ElementRef, focusTrapFactory: FocusTrapFactory, _document: any, dialogConfig: MatDialogConfig, interactivityChecker: InteractivityChecker, ngZone: NgZone, overlayRef: OverlayRef, focusMonitor?: FocusMonitor);
    /** Starts the dialog exit animation. */
    abstract _startExitAnimation(): void;
    protected _captureInitialFocus(): void;
    /**
     * Callback for when the open dialog animation has finished. Intended to
     * be called by sub-classes that use different animation implementations.
     */
    protected _openAnimationDone(totalTime: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<_MatDialogContainerBase, [null, null, { optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<_MatDialogContainerBase, "ng-component", never, {}, {}, never, never, false>;
}
/**
 * Internal component that wraps user-provided dialog content.
 * Animation is based on https://material.io/guidelines/motion/choreography.html.
 * @docs-private
 */
export declare class MatDialogContainer extends _MatDialogContainerBase {
    private _changeDetectorRef;
    /** State of the dialog animation. */
    _state: 'void' | 'enter' | 'exit';
    /** Callback, invoked whenever an animation on the host completes. */
    _onAnimationDone({ toState, totalTime }: AnimationEvent): void;
    /** Callback, invoked when an animation on the host starts. */
    _onAnimationStart({ toState, totalTime }: AnimationEvent): void;
    /** Starts the dialog exit animation. */
    _startExitAnimation(): void;
    constructor(elementRef: ElementRef, focusTrapFactory: FocusTrapFactory, document: any, dialogConfig: MatDialogConfig, checker: InteractivityChecker, ngZone: NgZone, overlayRef: OverlayRef, _changeDetectorRef: ChangeDetectorRef, focusMonitor?: FocusMonitor);
    _getAnimationState(): {
        value: "enter" | "void" | "exit";
        params: {
            enterAnimationDuration: string;
            exitAnimationDuration: string;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDialogContainer, [null, null, { optional: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDialogContainer, "mat-dialog-container", never, {}, {}, never, never, false>;
}
export {};
