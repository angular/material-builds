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
export class MatButtonLazyLoader {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatButtonLazyLoader, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWxhenktbG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2J1dHRvbi9idXR0b24tbGF6eS1sb2FkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxxQkFBcUIsRUFDckIsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBRU4sTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsU0FBUyxFQUdULGNBQWMsR0FFZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFL0MsbUVBQW1FO0FBQ25FLE1BQU0sb0JBQW9CLEdBQUcsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUM7QUFFN0MsdUVBQXVFO0FBQ3ZFLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUvRSx3RkFBd0Y7QUFDeEYsTUFBTSxDQUFDLE1BQU0sK0JBQStCLEdBQUcsaUNBQWlDLENBQUM7QUFFakY7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBTzlCO1FBTlEsY0FBUyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMvQyxtQkFBYyxHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLHlCQUFvQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLGNBQVMsR0FBRyxNQUFN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SSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUM7SUFDeEYsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBTklNQVRJT05fTU9EVUxFX1RZUEUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBpbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgTWF0UmlwcGxlLFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcblxuLyoqIFRoZSBvcHRpb25zIGZvciB0aGUgTWF0QnV0dG9uUmlwcGxlTG9hZGVyJ3MgZXZlbnQgbGlzdGVuZXJzLiAqL1xuY29uc3QgZXZlbnRMaXN0ZW5lck9wdGlvbnMgPSB7Y2FwdHVyZTogdHJ1ZX07XG5cbi8qKiBUaGUgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoZSByaXBwbGUuICovXG5jb25zdCByaXBwbGVJbnRlcmFjdGlvbkV2ZW50cyA9IFsnZm9jdXMnLCAnY2xpY2snLCAnbW91c2VlbnRlcicsICd0b3VjaHN0YXJ0J107XG5cbi8qKiBUaGUgYXR0cmlidXRlIGF0dGFjaGVkIHRvIGEgbWF0LWJ1dHRvbiB3aG9zZSByaXBwbGUgaGFzIG5vdCB5ZXQgYmVlbiBpbml0aWFsaXplZC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQlVUVE9OX1JJUFBMRV9VTklOSVRJQUxJWkVEID0gJ21hdC1idXR0b24tcmlwcGxlLXVuaW5pdGlhbGl6ZWQnO1xuXG4vKipcbiAqIEhhbmRsZXMgYXR0YWNoaW5nIHRoZSBNYXRCdXR0b24ncyByaXBwbGUgb24gZGVtYW5kLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdXMgdG8gYXZvaWQgZWFnZXJseSBjcmVhdGluZyAmIGF0dGFjaGluZyB0aGUgTWF0QnV0dG9uJ3MgcmlwcGxlLlxuICogSXQgd29ya3MgYnkgY3JlYXRpbmcgJiBhdHRhY2hpbmcgdGhlIHJpcHBsZSBvbmx5IHdoZW4gYSBNYXRCdXR0b24gaXMgZmlyc3QgaW50ZXJhY3RlZCB3aXRoLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNYXRCdXR0b25MYXp5TG9hZGVyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQsIHtvcHRpb25hbDogdHJ1ZX0pO1xuICBwcml2YXRlIF9hbmltYXRpb25Nb2RlID0gaW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSwge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX2dsb2JhbFJpcHBsZU9wdGlvbnMgPSBpbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUywge29wdGlvbmFsOiB0cnVlfSk7XG4gIHByaXZhdGUgX3BsYXRmb3JtID0gaW5qZWN0KFBsYXRmb3JtKTtcbiAgcHJpdmF0ZSBfbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQ/LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX29uSW50ZXJhY3Rpb24sIGV2ZW50TGlzdGVuZXJPcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGZvciAoY29uc3QgZXZlbnQgb2YgcmlwcGxlSW50ZXJhY3Rpb25FdmVudHMpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Py5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9vbkludGVyYWN0aW9uLCBldmVudExpc3RlbmVyT3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgY3JlYXRpbmcgYW5kIGF0dGFjaGluZyBidXR0b24gaW50ZXJuYWxzIHdoZW4gYSBidXR0b24gaXMgaW5pdGlhbGx5IGludGVyYWN0ZWQgd2l0aC4gKi9cbiAgcHJpdmF0ZSBfb25JbnRlcmFjdGlvbiA9IChldmVudDogRXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9kb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBldmVudFRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBFbGVtZW50O1xuXG4gICAgLy8gVE9ETyh3YWduZXJtYWNpZWwpOiBDb25zaWRlciBiYXRjaGluZyB0aGVzZSBldmVudHMgdG8gaW1wcm92ZSBydW50aW1lIHBlcmZvcm1hbmNlLlxuXG4gICAgY29uc3QgYnV0dG9uID0gZXZlbnRUYXJnZXQuY2xvc2VzdChgWyR7TUFUX0JVVFRPTl9SSVBQTEVfVU5JTklUSUFMSVpFRH1dYCk7XG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZShNQVRfQlVUVE9OX1JJUFBMRV9VTklOSVRJQUxJWkVEKTtcbiAgICAgIHRoaXMuX2FwcGVuZFJpcHBsZShidXR0b24gYXMgSFRNTEVsZW1lbnQpO1xuICAgIH1cbiAgfTtcblxuICAvKiogQ3JlYXRlcyBhIE1hdEJ1dHRvblJpcHBsZSBhbmQgYXBwZW5kcyBpdCB0byB0aGUgZ2l2ZW4gYnV0dG9uIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2FwcGVuZFJpcHBsZShidXR0b246IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9kb2N1bWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByaXBwbGUgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtYnV0dG9uLXJpcHBsZScpO1xuXG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IE1hdEJ1dHRvblJpcHBsZVRhcmdldChcbiAgICAgIGJ1dHRvbixcbiAgICAgIHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgPyB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zIDogdW5kZWZpbmVkLFxuICAgICAgdGhpcy5fYW5pbWF0aW9uTW9kZSA/IHRoaXMuX2FuaW1hdGlvbk1vZGUgOiB1bmRlZmluZWQsXG4gICAgKTtcbiAgICB0YXJnZXQucmlwcGxlQ29uZmlnLmNlbnRlcmVkID0gYnV0dG9uLmhhc0F0dHJpYnV0ZSgnbWF0LWljb24tYnV0dG9uJyk7XG5cbiAgICBjb25zdCByaXBwbGVSZW5kZXJlciA9IG5ldyBSaXBwbGVSZW5kZXJlcih0YXJnZXQsIHRoaXMuX25nWm9uZSwgcmlwcGxlLCB0aGlzLl9wbGF0Zm9ybSk7XG4gICAgcmlwcGxlUmVuZGVyZXIuc2V0dXBUcmlnZ2VyRXZlbnRzKGJ1dHRvbik7XG4gICAgYnV0dG9uLmFwcGVuZChyaXBwbGUpO1xuICB9XG5cbiAgX2NyZWF0ZU1hdFJpcHBsZShidXR0b246IEhUTUxFbGVtZW50KTogTWF0UmlwcGxlIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX2RvY3VtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcubWF0LW1kYy1idXR0b24tcmlwcGxlJyk/LnJlbW92ZSgpO1xuICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoTUFUX0JVVFRPTl9SSVBQTEVfVU5JTklUSUFMSVpFRCk7XG4gICAgY29uc3QgcmlwcGxlRWwgPSB0aGlzLl9kb2N1bWVudCEuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHJpcHBsZUVsLmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtYnV0dG9uLXJpcHBsZScpO1xuICAgIGNvbnN0IHJpcHBsZSA9IG5ldyBNYXRSaXBwbGUoXG4gICAgICBuZXcgRWxlbWVudFJlZihyaXBwbGVFbCksXG4gICAgICB0aGlzLl9uZ1pvbmUsXG4gICAgICB0aGlzLl9wbGF0Zm9ybSxcbiAgICAgIHRoaXMuX2dsb2JhbFJpcHBsZU9wdGlvbnMgPyB0aGlzLl9nbG9iYWxSaXBwbGVPcHRpb25zIDogdW5kZWZpbmVkLFxuICAgICAgdGhpcy5fYW5pbWF0aW9uTW9kZSA/IHRoaXMuX2FuaW1hdGlvbk1vZGUgOiB1bmRlZmluZWQsXG4gICAgKTtcbiAgICByaXBwbGUuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHJpcHBsZS50cmlnZ2VyID0gYnV0dG9uO1xuICAgIGJ1dHRvbi5hcHBlbmQocmlwcGxlRWwpO1xuICAgIHJldHVybiByaXBwbGU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgUmlwcGxlVGFyZ2V0IGZvciB0aGUgbGF6aWx5IHJlbmRlcmVkIE1hdEJ1dHRvbiByaXBwbGUuXG4gKiBJdCBoYW5kbGVzIHJpcHBsZSBjb25maWd1cmF0aW9uIGFuZCBkaXNhYmxlZCBzdGF0ZSBmb3IgcmlwcGxlcyBpbnRlcmFjdGlvbnMuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgY29uZmlndXJhdGlvbiBpcyB1c3VhbGx5IGhhbmRsZWQgYnkgdGhlIE1hdFJpcHBsZSwgYnV0IHRoZSBNYXRCdXR0b25MYXp5TG9hZGVyIGRvZXMgbm90IHVzZSB0aGVcbiAqIE1hdFJpcHBsZSBEaXJlY3RpdmUuIEluIG9yZGVyIHRvIGNyZWF0ZSAmIGF0dGFjaCBhIHJpcHBsZSBvbiBkZW1hbmQsIGl0IHVzZXMgdGhlIFwibG93ZXIgbGV2ZWxcIiBSaXBwbGVSZW5kZXJlci5cbiAqL1xuY2xhc3MgTWF0QnV0dG9uUmlwcGxlVGFyZ2V0IGltcGxlbWVudHMgUmlwcGxlVGFyZ2V0IHtcbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2J1dHRvbjogSFRNTEVsZW1lbnQsXG4gICAgcHJpdmF0ZSBfZ2xvYmFsUmlwcGxlT3B0aW9ucz86IFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gICAgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgdGhpcy5fc2V0UmlwcGxlQ29uZmlnKF9nbG9iYWxSaXBwbGVPcHRpb25zLCBhbmltYXRpb25Nb2RlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFJpcHBsZUNvbmZpZyhnbG9iYWxSaXBwbGVPcHRpb25zPzogUmlwcGxlR2xvYmFsT3B0aW9ucywgYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5yaXBwbGVDb25maWcuYW5pbWF0aW9uID0ge2VudGVyRHVyYXRpb246IDAsIGV4aXREdXJhdGlvbjogMH07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9idXR0b24uaGFzQXR0cmlidXRlKCdkaXNhYmxlZCcpIHx8ICEhdGhpcy5fZ2xvYmFsUmlwcGxlT3B0aW9ucz8uZGlzYWJsZWQ7XG4gIH1cbn1cbiJdfQ==