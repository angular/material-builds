/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE, ElementRef, Injectable, NgZone, inject, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleRenderer, } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import * as i0 from "@angular/core";
/** The options for the MatButtonRippleLoader's event listeners. */
const eventListenerOptions = { capture: true };
/** The events that should trigger the initialization of the ripple. */
const rippleInteractionEvents = ['focus', 'click', 'mouseenter', 'touchstart'];
/** The attribute attached to a mat-button whose ripple has not yet been initialized. */
export const MAT_BUTTON_RIPPLE_UNINITIALIZED = 'mat-button-ripple-uninitialized';
/**
 * Handles attaching the MatButton's ripple on demand.
 *
 * This service allows us to avoid eagerly creating & attaching the MatButton's ripple.
 * It works by creating & attaching the ripple only when a MatButton is first interacted with.
 */
class MatButtonLazyLoader {
    constructor() {
        this._document = inject(DOCUMENT, { optional: true });
        this._animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
        this._globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, { optional: true });
        this._platform = inject(Platform);
        this._ngZone = inject(NgZone);
        /** Handles creating and attaching button internals when a button is initially interacted with. */
        this._onInteraction = (event) => {
            if (event.target === this._document) {
                return;
            }
            const eventTarget = event.target;
            // TODO(wagnermaciel): Consider batching these events to improve runtime performance.
            const button = eventTarget.closest(`[${MAT_BUTTON_RIPPLE_UNINITIALIZED}]`);
            if (button) {
                button.removeAttribute(MAT_BUTTON_RIPPLE_UNINITIALIZED);
                this._appendRipple(button);
            }
        };
        this._ngZone.runOutsideAngular(() => {
            for (const event of rippleInteractionEvents) {
                this._document?.addEventListener(event, this._onInteraction, eventListenerOptions);
            }
        });
    }
    ngOnDestroy() {
        for (const event of rippleInteractionEvents) {
            this._document?.removeEventListener(event, this._onInteraction, eventListenerOptions);
        }
    }
    /** Creates a MatButtonRipple and appends it to the given button element. */
    _appendRipple(button) {
        if (!this._document) {
            return;
        }
        const ripple = this._document.createElement('span');
        ripple.classList.add('mat-mdc-button-ripple');
        const target = new MatButtonRippleTarget(button, this._globalRippleOptions ? this._globalRippleOptions : undefined, this._animationMode ? this._animationMode : undefined);
        target.rippleConfig.centered = button.hasAttribute('mat-icon-button');
        const rippleRenderer = new RippleRenderer(target, this._ngZone, ripple, this._platform);
        rippleRenderer.setupTriggerEvents(button);
        button.append(ripple);
    }
    _createMatRipple(button) {
        if (!this._document) {
            return;
        }
        button.querySelector('.mat-mdc-button-ripple')?.remove();
        button.removeAttribute(MAT_BUTTON_RIPPLE_UNINITIALIZED);
        const rippleEl = this._document.createElement('span');
        rippleEl.classList.add('mat-mdc-button-ripple');
        const ripple = new MatRipple(new ElementRef(rippleEl), this._ngZone, this._platform, this._globalRippleOptions ? this._globalRippleOptions : undefined, this._animationMode ? this._animationMode : undefined);
        ripple._isInitialized = true;
        ripple.trigger = button;
        button.append(rippleEl);
        return ripple;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonLazyLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonLazyLoader, providedIn: 'root' }); }
}
export { MatButtonLazyLoader };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatButtonLazyLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return []; } });
/**
 * The RippleTarget for the lazily rendered MatButton ripple.
 * It handles ripple configuration and disabled state for ripples interactions.
 *
 * Note that this configuration is usually handled by the MatRipple, but the MatButtonLazyLoader does not use the
 * MatRipple Directive. In order to create & attach a ripple on demand, it uses the "lower level" RippleRenderer.
 */
class MatButtonRippleTarget {
    constructor(_button, _globalRippleOptions, animationMode) {
        this._button = _button;
        this._globalRippleOptions = _globalRippleOptions;
        this._setRippleConfig(_globalRippleOptions, animationMode);
    }
    _setRippleConfig(globalRippleOptions, animationMode) {
        this.rippleConfig = globalRippleOptions || {};
        if (animationMode === 'NoopAnimations') {
            this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
    }
    get rippleDisabled() {
        return this._button.hasAttribute('disabled') || !!this._globalRippleOptions?.disabled;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxhenktbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24tbGF6eS1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsU0FBUyxFQUdULGNBQWMsR0FFZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0MsbUVBQW1FO0FBQ25FLE1BQU0sb0JBQW9CLEdBQUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUM7QUFFN0MsdUVBQXVFO0FBQ3ZFLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUvRSx3RkFBd0Y7QUFDeEYsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQUcsaUNBQWlDLENBQUM7QUFFakY7Ozs7O0dBS0c7QUFDSCxNQUNhLG1CQUFtQjtJQU85QjtRQU5RLGNBQVMsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDL0MsbUJBQWMsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNqRSx5QkFBb0IsR0FBRyxNQUFNLENBQUMseUJBQXlCLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMzRSxjQUFTLEdBQUcsTUFBTSxDQUFD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T0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQztJQUN4RixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFOSU1BVElPTl9NT0RVTEVfVFlQRSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIGluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBNYXRSaXBwbGUsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuXG4vKiogVGhlIG9wdGlvbnMgZm9yIHRoZSBNYXRCdXR0b25SaXBwbGVMb2FkZXIncyBldmVudCBsaXN0ZW5lcnMuICovXG5jb25zdCBldmVudExpc3RlbmVyT3B0aW9ucyA9IHtjYXB0dXJlOiB0cnVlfTtcblxuLyoqIFRoZSBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHJpcHBsZS4gKi9cbmNvbnN0IHJpcHBsZUludGVyYWN0aW9uRXZlbnRzID0gWydmb2N1cycsICdjbGljaycsICdtb3VzZWVudGVyJywgJ3RvdWNoc3RhcnQnXTtcblxuLyoqIFRoZSBhdHRyaWJ1dGUgYXR0YWNoZWQgdG8gYSBtYXQtYnV0dG9uIHdob3NlIHJpcHBsZSBoYXMgbm90IHlldCBiZWVuIGluaXRpYWxpemVkLiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9CVVRUT05fUklQUExFX1VOSU5JVElBTElaRUQgPSAnbWF0LWJ1dHRvbi1yaXBwbGUtdW5pbml0aWFsaXplZCc7XG5cbi8qKlxuICogSGFuZGxlcyBhdHRhY2hpbmcgdGhlIE1hdEJ1dHRvbidzIHJpcHBsZSBvbiBkZW1hbmQuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB1cyB0byBhdm9pZCBlYWdlcmx5IGNyZWF0aW5nICYgYXR0YWNoaW5nIHRoZSBNYXRCdXR0b24ncyByaXBwbGUuXG4gKiBJdCB3b3JrcyBieSBjcmVhdGluZyAmIGF0dGFjaGluZyB0aGUgcmlwcGxlIG9ubHkgd2hlbiBhIE1hdEJ1dHRvbiBpcyBmaXJzdCBpbnRlcmFjdGVkIHdpdGguXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE1hdEJ1dHRvbkxhenlMb2FkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2FuaW1hdGlvbk1vZGUgPSBpbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfZ2xvYmFsUmlwcGxlT3B0aW9ucyA9IGluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCB7b3B0aW9uYWw6IHRydWV9KTtcbiAgcHJpdmF0ZSBfcGxhdGZvcm0gPSBpbmplY3QoUGxhdGZvcm0pO1xuICBwcml2YXRlIF9uZ1pvbmUgPSBpbmplY3QoTmdab25lKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudD8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5fb25JbnRlcmFjdGlvbiwgZXZlbnRMaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cykge1xuICAgICAgdGhpcy5fZG9jdW1lbnQ/LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX29uSW50ZXJhY3Rpb24sIGV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyBjcmVhdGluZyBhbmQgYXR0YWNoaW5nIGJ1dHRvbiBpbnRlcm5hbHMgd2hlbiBhIGJ1dHRvbiBpcyBpbml0aWFsbHkgaW50ZXJhY3RlZCB3aXRoLiAqL1xuICBwcml2YXRlIF9vbkludGVyYWN0aW9uID0gKGV2ZW50OiBFdmVudCkgPT4ge1xuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuX2RvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGV2ZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEVsZW1lbnQ7XG5cbiAgICAvLyBUT0RPKHdhZ25lcm1hY2llbCk6IENvbnNpZGVyIGJhdGNoaW5nIHRoZXNlIGV2ZW50cyB0byBpbXByb3ZlIHJ1bnRpbWUgcGVyZm9ybWFuY2UuXG5cbiAgICBjb25zdCBidXR0b24gPSBldmVudFRhcmdldC5jbG9zZXN0KGBbJHtNQVRfQlVUVE9OX1JJUFBMRV9VTklOSVRJQUxJWkVEfV1gKTtcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICBidXR0b24ucmVtb3ZlQXR0cmlidXRlKE1BVF9CVVRUT05fUklQUExFX1VOSU5JVElBTElaRUQpO1xuICAgICAgdGhpcy5fYXBwZW5kUmlwcGxlKGJ1dHRvbiBhcyBIVE1MRWxlbWVudCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKiBDcmVhdGVzIGEgTWF0QnV0dG9uUmlwcGxlIGFuZCBhcHBlbmRzIGl0IHRvIHRoZSBnaXZlbiBidXR0b24gZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfYXBwZW5kUmlwcGxlKGJ1dHRvbjogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1idXR0b24tcmlwcGxlJyk7XG5cbiAgICBjb25zdCB0YXJnZXQgPSBuZXcgTWF0QnV0dG9uUmlwcGxlVGFyZ2V0KFxuICAgICAgYnV0dG9uLFxuICAgICAgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA/IHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgOiB1bmRlZmluZWQsXG4gICAgICB0aGlzLl9hbmltYXRpb25Nb2RlID8gdGhpcy5fYW5pbWF0aW9uTW9kZSA6IHVuZGVmaW5lZCxcbiAgICApO1xuICAgIHRhcmdldC5yaXBwbGVDb25maWcuY2VudGVyZWQgPSBidXR0b24uaGFzQXR0cmlidXRlKCdtYXQtaWNvbi1idXR0b24nKTtcblxuICAgIGNvbnN0IHJpcHBsZVJlbmRlcmVyID0gbmV3IFJpcHBsZVJlbmRlcmVyKHRhcmdldCwgdGhpcy5fbmdab25lLCByaXBwbGUsIHRoaXMuX3BsYXRmb3JtKTtcbiAgICByaXBwbGVSZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHMoYnV0dG9uKTtcbiAgICBidXR0b24uYXBwZW5kKHJpcHBsZSk7XG4gIH1cblxuICBfY3JlYXRlTWF0UmlwcGxlKGJ1dHRvbjogSFRNTEVsZW1lbnQpOiBNYXRSaXBwbGUgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZG9jdW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5tYXQtbWRjLWJ1dHRvbi1yaXBwbGUnKT8ucmVtb3ZlKCk7XG4gICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZShNQVRfQlVUVE9OX1JJUFBMRV9VTklOSVRJQUxJWkVEKTtcbiAgICBjb25zdCByaXBwbGVFbCA9IHRoaXMuX2RvY3VtZW50IS5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlRWwuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1idXR0b24tcmlwcGxlJyk7XG4gICAgY29uc3QgcmlwcGxlID0gbmV3IE1hdFJpcHBsZShcbiAgICAgIG5ldyBFbGVtZW50UmVmKHJpcHBsZUVsKSxcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX3BsYXRmb3JtLFxuICAgICAgdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucyA/IHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgOiB1bmRlZmluZWQsXG4gICAgICB0aGlzLl9hbmltYXRpb25Nb2RlID8gdGhpcy5fYW5pbWF0aW9uTW9kZSA6IHVuZGVmaW5lZCxcbiAgICApO1xuICAgIHJpcHBsZS5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgcmlwcGxlLnRyaWdnZXIgPSBidXR0b247XG4gICAgYnV0dG9uLmFwcGVuZChyaXBwbGVFbCk7XG4gICAgcmV0dXJuIHJpcHBsZTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBSaXBwbGVUYXJnZXQgZm9yIHRoZSBsYXppbHkgcmVuZGVyZWQgTWF0QnV0dG9uIHJpcHBsZS5cbiAqIEl0IGhhbmRsZXMgcmlwcGxlIGNvbmZpZ3VyYXRpb24gYW5kIGRpc2FibGVkIHN0YXRlIGZvciByaXBwbGVzIGludGVyYWN0aW9ucy5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBjb25maWd1cmF0aW9uIGlzIHVzdWFsbHkgaGFuZGxlZCBieSB0aGUgTWF0UmlwcGxlLCBidXQgdGhlIE1hdEJ1dHRvbkxhenlMb2FkZXIgZG9lcyBub3QgdXNlIHRoZVxuICogTWF0UmlwcGxlIERpcmVjdGl2ZS4gSW4gb3JkZXIgdG8gY3JlYXRlICYgYXR0YWNoIGEgcmlwcGxlIG9uIGRlbWFuZCwgaXQgdXNlcyB0aGUgXCJsb3dlciBsZXZlbFwiIFJpcHBsZVJlbmRlcmVyLlxuICovXG5jbGFzcyBNYXRCdXR0b25SaXBwbGVUYXJnZXQgaW1wbGVtZW50cyBSaXBwbGVUYXJnZXQge1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZyAmIFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfYnV0dG9uOiBIVE1MRWxlbWVudCxcbiAgICBwcml2YXRlIF9nbG9iYWxSaXBwbGVPcHRpb25zPzogUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgICBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLl9zZXRSaXBwbGVDb25maWcoX2dsb2JhbFJpcHBsZU9wdGlvbnMsIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0UmlwcGxlQ29uZmlnKGdsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLCBhbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIGlmIChhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLnJpcHBsZUNvbmZpZy5hbmltYXRpb24gPSB7ZW50ZXJEdXJhdGlvbjogMCwgZXhpdER1cmF0aW9uOiAwfTtcbiAgICB9XG4gIH1cblxuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2J1dHRvbi5oYXNBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgfHwgISF0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zPy5kaXNhYmxlZDtcbiAgfVxufVxuIl19